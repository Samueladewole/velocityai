/// High-performance hash engine for Velocity Trust Protocol
/// 
/// Provides optimized implementations of various hash algorithms
/// with support for parallel processing and batch operations

use crate::{CryptoError, Result};
use blake3::Hasher as Blake3Hasher;
use rayon::prelude::*;
use sha2::{Digest, Sha256, Sha512};
use sha3::{Sha3_256, Sha3_512};
use std::sync::Arc;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum HashAlgorithm {
    Sha256,
    Sha512,
    Sha3_256,
    Sha3_512,
    Blake3,
}

/// High-performance hash engine with support for multiple algorithms
pub struct HashEngine {
    algorithm: HashAlgorithm,
    parallel_threshold: usize,
}

impl HashEngine {
    pub fn new(algorithm: HashAlgorithm) -> Self {
        Self {
            algorithm,
            parallel_threshold: 1024, // Parallelize for data > 1KB
        }
    }

    /// Hash a single piece of data
    pub fn hash(&self, data: &[u8]) -> Result<Vec<u8>> {
        match self.algorithm {
            HashAlgorithm::Sha256 => Ok(Sha256::digest(data).to_vec()),
            HashAlgorithm::Sha512 => Ok(Sha512::digest(data).to_vec()),
            HashAlgorithm::Sha3_256 => Ok(Sha3_256::digest(data).to_vec()),
            HashAlgorithm::Sha3_512 => Ok(Sha3_512::digest(data).to_vec()),
            HashAlgorithm::Blake3 => Ok(blake3::hash(data).as_bytes().to_vec()),
        }
    }

    /// Hash multiple pieces of data in parallel
    pub fn hash_batch(&self, data_items: &[Vec<u8>]) -> Result<Vec<Vec<u8>>> {
        if data_items.is_empty() {
            return Err(CryptoError::InvalidInput("Empty batch".to_string()));
        }

        // Use parallel processing for large batches
        if data_items.len() > 100 {
            data_items
                .par_iter()
                .map(|data| self.hash(data))
                .collect()
        } else {
            data_items.iter().map(|data| self.hash(data)).collect()
        }
    }

    /// Create a chain hash from multiple inputs (used for blockchain operations)
    pub fn chain_hash(&self, inputs: &[Vec<u8>]) -> Result<Vec<u8>> {
        if inputs.is_empty() {
            return Err(CryptoError::InvalidInput("Empty chain".to_string()));
        }

        let mut result = self.hash(&inputs[0])?;
        
        for input in inputs.iter().skip(1) {
            let combined = [&result[..], input].concat();
            result = self.hash(&combined)?;
        }

        Ok(result)
    }

    /// Compute hash with key (HMAC-like operation)
    pub fn keyed_hash(&self, key: &[u8], data: &[u8]) -> Result<Vec<u8>> {
        match self.algorithm {
            HashAlgorithm::Blake3 => {
                let mut hasher = blake3::Hasher::new_keyed(&blake3::derive_key("Velocity Trust Protocol", key));
                hasher.update(data);
                Ok(hasher.finalize().as_bytes().to_vec())
            }
            _ => {
                // For other algorithms, use simple key||data construction
                let combined = [key, data].concat();
                self.hash(&combined)
            }
        }
    }

    /// Stream hash for large files
    pub fn stream_hash(&self) -> Box<dyn StreamHasher> {
        match self.algorithm {
            HashAlgorithm::Sha256 => Box::new(Sha256StreamHasher::new()),
            HashAlgorithm::Sha512 => Box::new(Sha512StreamHasher::new()),
            HashAlgorithm::Blake3 => Box::new(Blake3StreamHasher::new()),
            _ => Box::new(GenericStreamHasher::new(self.algorithm)),
        }
    }
}

/// Trait for streaming hash operations
pub trait StreamHasher: Send + Sync {
    fn update(&mut self, data: &[u8]);
    fn finalize(self: Box<Self>) -> Vec<u8>;
    fn reset(&mut self);
}

struct Sha256StreamHasher {
    hasher: Sha256,
}

impl Sha256StreamHasher {
    fn new() -> Self {
        Self {
            hasher: Sha256::new(),
        }
    }
}

impl StreamHasher for Sha256StreamHasher {
    fn update(&mut self, data: &[u8]) {
        self.hasher.update(data);
    }

    fn finalize(self: Box<Self>) -> Vec<u8> {
        self.hasher.finalize().to_vec()
    }

    fn reset(&mut self) {
        self.hasher = Sha256::new();
    }
}

struct Sha512StreamHasher {
    hasher: Sha512,
}

impl Sha512StreamHasher {
    fn new() -> Self {
        Self {
            hasher: Sha512::new(),
        }
    }
}

impl StreamHasher for Sha512StreamHasher {
    fn update(&mut self, data: &[u8]) {
        self.hasher.update(data);
    }

    fn finalize(self: Box<Self>) -> Vec<u8> {
        self.hasher.finalize().to_vec()
    }

    fn reset(&mut self) {
        self.hasher = Sha512::new();
    }
}

struct Blake3StreamHasher {
    hasher: Blake3Hasher,
}

impl Blake3StreamHasher {
    fn new() -> Self {
        Self {
            hasher: blake3::Hasher::new(),
        }
    }
}

impl StreamHasher for Blake3StreamHasher {
    fn update(&mut self, data: &[u8]) {
        self.hasher.update(data);
    }

    fn finalize(self: Box<Self>) -> Vec<u8> {
        self.hasher.finalize().as_bytes().to_vec()
    }

    fn reset(&mut self) {
        self.hasher = blake3::Hasher::new();
    }
}

struct GenericStreamHasher {
    algorithm: HashAlgorithm,
    buffer: Vec<u8>,
}

impl GenericStreamHasher {
    fn new(algorithm: HashAlgorithm) -> Self {
        Self {
            algorithm,
            buffer: Vec::new(),
        }
    }
}

impl StreamHasher for GenericStreamHasher {
    fn update(&mut self, data: &[u8]) {
        self.buffer.extend_from_slice(data);
    }

    fn finalize(self: Box<Self>) -> Vec<u8> {
        let engine = HashEngine::new(self.algorithm);
        engine.hash(&self.buffer).unwrap_or_default()
    }

    fn reset(&mut self) {
        self.buffer.clear();
    }
}

/// Optimized hash verification
pub fn verify_hash(algorithm: HashAlgorithm, data: &[u8], expected_hash: &[u8]) -> bool {
    let engine = HashEngine::new(algorithm);
    match engine.hash(data) {
        Ok(computed_hash) => computed_hash == expected_hash,
        Err(_) => false,
    }
}

/// Parallel hash verification for multiple items
pub fn verify_hashes_parallel(
    algorithm: HashAlgorithm,
    items: &[(Vec<u8>, Vec<u8>)], // (data, expected_hash) pairs
) -> Vec<bool> {
    items
        .par_iter()
        .map(|(data, expected)| verify_hash(algorithm, data, expected))
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hash_algorithms() {
        let data = b"Velocity Trust Protocol";
        let algorithms = vec![
            HashAlgorithm::Sha256,
            HashAlgorithm::Sha512,
            HashAlgorithm::Sha3_256,
            HashAlgorithm::Sha3_512,
            HashAlgorithm::Blake3,
        ];

        for algo in algorithms {
            let engine = HashEngine::new(algo);
            let hash = engine.hash(data).unwrap();
            assert!(!hash.is_empty());
        }
    }

    #[test]
    fn test_batch_hashing() {
        let engine = HashEngine::new(HashAlgorithm::Blake3);
        let data_items: Vec<Vec<u8>> = (0..1000)
            .map(|i| format!("item_{}", i).into_bytes())
            .collect();

        let hashes = engine.hash_batch(&data_items).unwrap();
        assert_eq!(hashes.len(), data_items.len());
    }

    #[test]
    fn test_chain_hash() {
        let engine = HashEngine::new(HashAlgorithm::Sha256);
        let inputs = vec![
            b"block1".to_vec(),
            b"block2".to_vec(),
            b"block3".to_vec(),
        ];

        let chain_hash = engine.chain_hash(&inputs).unwrap();
        assert_eq!(chain_hash.len(), 32); // SHA256 produces 32 bytes
    }
}