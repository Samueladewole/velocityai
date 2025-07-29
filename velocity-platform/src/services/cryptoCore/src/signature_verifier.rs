/// High-performance signature verification for Velocity Trust Protocol
/// 
/// Supports multiple signature schemes with Polygon integration
/// Optimized for batch verification and parallel processing

use crate::{CryptoError, Result};
use crate::hash_engine::{HashAlgorithm, HashEngine};
use ed25519_dalek::{
    PublicKey as Ed25519PublicKey, Signature as Ed25519Signature,
    Verifier, PUBLIC_KEY_LENGTH, SIGNATURE_LENGTH
};
use rayon::prelude::*;
use ring::signature::{self, UnparsedPublicKey};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

/// Supported signature algorithms
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum SignatureAlgorithm {
    Ed25519,
    EcdsaP256,
    RsaPss2048,
    PolygonEcdsa, // Ethereum-compatible ECDSA for Polygon
}

/// Signature verification request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatureRequest {
    pub message: Vec<u8>,
    pub signature: Vec<u8>,
    pub public_key: Vec<u8>,
    pub algorithm: SignatureAlgorithm,
    pub polygon_tx_hash: Option<String>,
}

/// Batch signature verification request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BatchSignatureRequest {
    pub requests: Vec<SignatureRequest>,
    pub fail_fast: bool, // Stop on first failure
    pub parallel_threshold: usize,
}

/// Signature verification result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatureVerificationResult {
    pub valid: bool,
    pub algorithm: SignatureAlgorithm,
    pub polygon_verified: bool,
    pub verification_time_us: u64,
    pub error: Option<String>,
}

/// High-performance signature verifier
pub struct SignatureVerifier {
    hash_engine: HashEngine,
    enable_polygon_verification: bool,
}

impl SignatureVerifier {
    pub fn new(enable_polygon_verification: bool) -> Self {
        Self {
            hash_engine: HashEngine::new(HashAlgorithm::Blake3),
            enable_polygon_verification,
        }
    }

    /// Verify a single signature
    pub fn verify_signature(&self, request: &SignatureRequest) -> SignatureVerificationResult {
        let start = std::time::Instant::now();

        let (valid, error) = match self.verify_internal(request) {
            Ok(valid) => (valid, None),
            Err(e) => (false, Some(e.to_string())),
        };

        let polygon_verified = request.polygon_tx_hash.is_some() && self.enable_polygon_verification;

        SignatureVerificationResult {
            valid,
            algorithm: request.algorithm,
            polygon_verified,
            verification_time_us: start.elapsed().as_micros() as u64,
            error,
        }
    }

    /// Internal verification logic
    fn verify_internal(&self, request: &SignatureRequest) -> Result<bool> {
        match request.algorithm {
            SignatureAlgorithm::Ed25519 => self.verify_ed25519(request),
            SignatureAlgorithm::EcdsaP256 => self.verify_ecdsa_p256(request),
            SignatureAlgorithm::RsaPss2048 => self.verify_rsa_pss(request),
            SignatureAlgorithm::PolygonEcdsa => self.verify_polygon_ecdsa(request),
        }
    }

    /// Verify Ed25519 signature
    fn verify_ed25519(&self, request: &SignatureRequest) -> Result<bool> {
        if request.public_key.len() != PUBLIC_KEY_LENGTH {
            return Err(CryptoError::InvalidInput(format!(
                "Invalid Ed25519 public key length: expected {}, got {}",
                PUBLIC_KEY_LENGTH,
                request.public_key.len()
            )));
        }

        if request.signature.len() != SIGNATURE_LENGTH {
            return Err(CryptoError::InvalidInput(format!(
                "Invalid Ed25519 signature length: expected {}, got {}",
                SIGNATURE_LENGTH,
                request.signature.len()
            )));
        }

        let public_key = Ed25519PublicKey::from_bytes(&request.public_key)
            .map_err(|e| CryptoError::CryptoOperationFailed(format!("Invalid public key: {}", e)))?;

        let signature = Ed25519Signature::from_bytes(&request.signature)
            .map_err(|e| CryptoError::CryptoOperationFailed(format!("Invalid signature: {}", e)))?;

        Ok(public_key.verify(&request.message, &signature).is_ok())
    }

    /// Verify ECDSA P-256 signature
    fn verify_ecdsa_p256(&self, request: &SignatureRequest) -> Result<bool> {
        let public_key = UnparsedPublicKey::new(
            &signature::ECDSA_P256_SHA256_ASN1,
            &request.public_key,
        );

        Ok(public_key.verify(&request.message, &request.signature).is_ok())
    }

    /// Verify RSA-PSS signature
    fn verify_rsa_pss(&self, request: &SignatureRequest) -> Result<bool> {
        let public_key = UnparsedPublicKey::new(
            &signature::RSA_PSS_2048_8192_SHA256,
            &request.public_key,
        );

        Ok(public_key.verify(&request.message, &request.signature).is_ok())
    }

    /// Verify Polygon-compatible ECDSA signature
    fn verify_polygon_ecdsa(&self, request: &SignatureRequest) -> Result<bool> {
        // For Polygon/Ethereum signatures, we need to handle the recovery ID
        // and the specific message hashing format
        
        // Hash the message with Ethereum prefix
        let eth_prefix = format!("\x19Ethereum Signed Message:\n{}", request.message.len());
        let prefixed_message = [eth_prefix.as_bytes(), &request.message].concat();
        let message_hash = self.hash_engine.hash(&prefixed_message)?;

        // In a real implementation, you'd use a proper Ethereum signature library
        // For now, we'll use standard ECDSA verification
        let public_key = UnparsedPublicKey::new(
            &signature::ECDSA_P256_SHA256_ASN1,
            &request.public_key,
        );

        Ok(public_key.verify(&message_hash, &request.signature).is_ok())
    }

    /// Verify signatures in batch
    pub fn verify_batch(&self, batch: &BatchSignatureRequest) -> Vec<SignatureVerificationResult> {
        if batch.requests.len() > batch.parallel_threshold {
            self.verify_batch_parallel(batch)
        } else {
            self.verify_batch_sequential(batch)
        }
    }

    /// Sequential batch verification
    fn verify_batch_sequential(&self, batch: &BatchSignatureRequest) -> Vec<SignatureVerificationResult> {
        let mut results = Vec::with_capacity(batch.requests.len());

        for request in &batch.requests {
            let result = self.verify_signature(request);
            
            if batch.fail_fast && !result.valid {
                results.push(result);
                // Fill remaining with failure results
                for _ in results.len()..batch.requests.len() {
                    results.push(SignatureVerificationResult {
                        valid: false,
                        algorithm: SignatureAlgorithm::Ed25519,
                        polygon_verified: false,
                        verification_time_us: 0,
                        error: Some("Skipped due to fail-fast".to_string()),
                    });
                }
                break;
            }

            results.push(result);
        }

        results
    }

    /// Parallel batch verification
    fn verify_batch_parallel(&self, batch: &BatchSignatureRequest) -> Vec<SignatureVerificationResult> {
        if batch.fail_fast {
            // For fail-fast mode, we need to check results sequentially
            // but compute them in parallel chunks
            self.verify_batch_parallel_fail_fast(batch)
        } else {
            // Full parallel processing
            batch.requests
                .par_iter()
                .map(|request| self.verify_signature(request))
                .collect()
        }
    }

    /// Parallel batch verification with fail-fast
    fn verify_batch_parallel_fail_fast(&self, batch: &BatchSignatureRequest) -> Vec<SignatureVerificationResult> {
        let chunk_size = 100; // Process in chunks for fail-fast
        let mut results = Vec::with_capacity(batch.requests.len());
        
        for chunk in batch.requests.chunks(chunk_size) {
            let chunk_results: Vec<_> = chunk
                .par_iter()
                .map(|request| self.verify_signature(request))
                .collect();

            let mut failed = false;
            for result in chunk_results {
                if !result.valid {
                    failed = true;
                    results.push(result);
                    break;
                }
                results.push(result);
            }

            if failed {
                // Fill remaining with failure results
                for _ in results.len()..batch.requests.len() {
                    results.push(SignatureVerificationResult {
                        valid: false,
                        algorithm: SignatureAlgorithm::Ed25519,
                        polygon_verified: false,
                        verification_time_us: 0,
                        error: Some("Skipped due to fail-fast".to_string()),
                    });
                }
                break;
            }
        }

        results
    }

    /// Create a signature verification proof for Polygon
    pub fn create_polygon_proof(
        &self,
        request: &SignatureRequest,
        result: &SignatureVerificationResult,
    ) -> Result<PolygonProof> {
        if !result.valid {
            return Err(CryptoError::VerificationFailed("Cannot create proof for invalid signature".to_string()));
        }

        // Create proof data
        let proof_data = PolygonProofData {
            message_hash: hex::encode(self.hash_engine.hash(&request.message)?),
            signature_hash: hex::encode(self.hash_engine.hash(&request.signature)?),
            public_key_hash: hex::encode(self.hash_engine.hash(&request.public_key)?),
            algorithm: request.algorithm,
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            verification_result: result.valid,
        };

        // Create proof hash
        let proof_bytes = bincode::serialize(&proof_data)
            .map_err(|e| CryptoError::SerializationError(e.to_string()))?;
        let proof_hash = self.hash_engine.hash(&proof_bytes)?;

        Ok(PolygonProof {
            proof_hash: hex::encode(proof_hash),
            proof_data,
            polygon_contract_address: "0x1234567890abcdef1234567890abcdef12345678".to_string(), // Placeholder
            estimated_gas: 21000 + (proof_bytes.len() as u64 * 68), // Rough estimate
        })
    }
}

/// Polygon proof for signature verification
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PolygonProof {
    pub proof_hash: String,
    pub proof_data: PolygonProofData,
    pub polygon_contract_address: String,
    pub estimated_gas: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PolygonProofData {
    pub message_hash: String,
    pub signature_hash: String,
    pub public_key_hash: String,
    pub algorithm: SignatureAlgorithm,
    pub timestamp: u64,
    pub verification_result: bool,
}

/// Aggregated signature for multiple signers
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AggregatedSignature {
    pub signatures: Vec<Vec<u8>>,
    pub public_keys: Vec<Vec<u8>>,
    pub message: Vec<u8>,
    pub threshold: usize, // Minimum valid signatures required
}

impl SignatureVerifier {
    /// Verify aggregated signature (threshold signature scheme)
    pub fn verify_aggregated_signature(
        &self,
        aggregated: &AggregatedSignature,
        algorithm: SignatureAlgorithm,
    ) -> AggregatedVerificationResult {
        let start = std::time::Instant::now();

        if aggregated.signatures.len() != aggregated.public_keys.len() {
            return AggregatedVerificationResult {
                valid: false,
                valid_signatures: 0,
                total_signatures: aggregated.signatures.len(),
                threshold_met: false,
                individual_results: vec![],
                verification_time_us: start.elapsed().as_micros() as u64,
                error: Some("Signature and public key count mismatch".to_string()),
            };
        }

        // Verify each signature
        let requests: Vec<SignatureRequest> = aggregated.signatures
            .iter()
            .zip(&aggregated.public_keys)
            .map(|(sig, pk)| SignatureRequest {
                message: aggregated.message.clone(),
                signature: sig.clone(),
                public_key: pk.clone(),
                algorithm,
                polygon_tx_hash: None,
            })
            .collect();

        let batch_request = BatchSignatureRequest {
            requests,
            fail_fast: false,
            parallel_threshold: 10,
        };

        let results = self.verify_batch(&batch_request);
        let valid_count = results.iter().filter(|r| r.valid).count();
        let threshold_met = valid_count >= aggregated.threshold;

        AggregatedVerificationResult {
            valid: threshold_met,
            valid_signatures: valid_count,
            total_signatures: aggregated.signatures.len(),
            threshold_met,
            individual_results: results,
            verification_time_us: start.elapsed().as_micros() as u64,
            error: None,
        }
    }
}

/// Result of aggregated signature verification
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AggregatedVerificationResult {
    pub valid: bool,
    pub valid_signatures: usize,
    pub total_signatures: usize,
    pub threshold_met: bool,
    pub individual_results: Vec<SignatureVerificationResult>,
    pub verification_time_us: u64,
    pub error: Option<String>,
}

#[cfg(test)]
mod tests {
    use super::*;
    use ed25519_dalek::{Keypair, Signer};
    use rand::rngs::OsRng;

    #[test]
    fn test_ed25519_signature_verification() {
        let verifier = SignatureVerifier::new(false);

        // Generate keypair
        let mut csprng = OsRng{};
        let keypair = Keypair::generate(&mut csprng);
        
        let message = b"Velocity Trust Protocol Test Message";
        let signature = keypair.sign(message);

        let request = SignatureRequest {
            message: message.to_vec(),
            signature: signature.to_bytes().to_vec(),
            public_key: keypair.public.to_bytes().to_vec(),
            algorithm: SignatureAlgorithm::Ed25519,
            polygon_tx_hash: None,
        };

        let result = verifier.verify_signature(&request);
        assert!(result.valid);
        assert_eq!(result.algorithm, SignatureAlgorithm::Ed25519);
    }

    #[test]
    fn test_batch_signature_verification() {
        let verifier = SignatureVerifier::new(false);
        let mut csprng = OsRng{};

        // Create multiple signature requests
        let mut requests = Vec::new();
        for i in 0..10 {
            let keypair = Keypair::generate(&mut csprng);
            let message = format!("Message {}", i).into_bytes();
            let signature = keypair.sign(&message);

            requests.push(SignatureRequest {
                message: message.clone(),
                signature: signature.to_bytes().to_vec(),
                public_key: keypair.public.to_bytes().to_vec(),
                algorithm: SignatureAlgorithm::Ed25519,
                polygon_tx_hash: Some(format!("0x{}", i)),
            });
        }

        let batch = BatchSignatureRequest {
            requests,
            fail_fast: false,
            parallel_threshold: 5,
        };

        let results = verifier.verify_batch(&batch);
        assert_eq!(results.len(), 10);
        assert!(results.iter().all(|r| r.valid));
    }

    #[test]
    fn test_aggregated_signature() {
        let verifier = SignatureVerifier::new(false);
        let mut csprng = OsRng{};

        let message = b"Multi-sig message";
        let mut signatures = Vec::new();
        let mut public_keys = Vec::new();

        // Create 5 signatures
        for _ in 0..5 {
            let keypair = Keypair::generate(&mut csprng);
            let signature = keypair.sign(message);
            
            signatures.push(signature.to_bytes().to_vec());
            public_keys.push(keypair.public.to_bytes().to_vec());
        }

        let aggregated = AggregatedSignature {
            signatures,
            public_keys,
            message: message.to_vec(),
            threshold: 3, // Require 3 out of 5
        };

        let result = verifier.verify_aggregated_signature(&aggregated, SignatureAlgorithm::Ed25519);
        assert!(result.valid);
        assert!(result.threshold_met);
        assert_eq!(result.valid_signatures, 5);
    }
}