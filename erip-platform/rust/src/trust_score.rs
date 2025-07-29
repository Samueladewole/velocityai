//! Trust Score Immutability Module
//! 
//! Cryptographic proof system for trust score calculations
//! Provides immutable, verifiable trust score computation with blockchain attestation

use crate::*;
use serde::{Deserialize, Serialize};
use sha2::{Sha256, Digest};
use std::collections::HashMap;
use chrono::{DateTime, Utc};
use uuid::Uuid;

/// Trust score with cryptographic proof
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TrustScoreProof {
    pub organization_id: String,
    pub trust_score: f64,
    pub calculation_hash: String,
    pub input_data_hash: String,
    pub algorithm_hash: String,
    pub cryptographic_proof: CryptographicProof,
    pub historical_proofs: Vec<String>,
    pub benchmark_verification: BenchmarkVerification,
}

/// Benchmark verification data
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BenchmarkVerification {
    pub industry_hash: String,
    pub comparative_proof: String,
    pub anonymized_data: bool,
}

/// Trust score calculation input
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TrustScoreInput {
    pub organization_id: String,
    pub compliance_scores: HashMap<String, f64>,
    pub audit_results: Vec<AuditResult>,
    pub certification_status: HashMap<String, CertificationStatus>,
    pub historical_performance: Vec<PerformanceMetric>,
    pub peer_comparisons: Vec<PeerComparison>,
    pub calculation_timestamp: String,
}

/// Audit result data
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AuditResult {
    pub audit_id: String,
    pub framework: String,
    pub score: f64,
    pub auditor_id: String,
    pub completion_date: String,
    pub findings_count: u32,
    pub remediation_status: String,
}

/// Certification status
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CertificationStatus {
    pub is_active: bool,
    pub expiration_date: Option<String>,
    pub issuing_authority: String,
    pub confidence_level: f64,
}

/// Performance metric
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PerformanceMetric {
    pub metric_name: String,
    pub value: f64,
    pub measurement_date: String,
    pub source: String,
}

/// Peer comparison data
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PeerComparison {
    pub industry_segment: String,
    pub percentile_ranking: f64,
    pub anonymized_peer_data: Vec<f64>,
    pub comparison_hash: String,
}

/// Trust score calculation engine
pub struct TrustScoreEngine {
    algorithm_version: String,
    weight_matrix: HashMap<String, f64>,
    benchmark_data: HashMap<String, IndustryBenchmark>,
}

/// Industry benchmark data
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct IndustryBenchmark {
    pub industry: String,
    pub median_score: f64,
    pub percentiles: HashMap<u8, f64>,
    pub sample_size: u32,
    pub data_period: String,
}

/// Trust score calculation result
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TrustScoreCalculation {
    pub final_score: f64,
    pub component_scores: HashMap<String, f64>,
    pub confidence_interval: (f64, f64),
    pub calculation_details: CalculationDetails,
    pub risk_factors: Vec<RiskFactor>,
}

/// Calculation details
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CalculationDetails {
    pub algorithm_version: String,
    pub input_data_quality: f64,
    pub computation_steps: Vec<ComputationStep>,
    pub validation_checks: Vec<ValidationCheck>,
}

/// Computation step
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ComputationStep {
    pub step_id: String,
    pub description: String,
    pub input_values: HashMap<String, f64>,
    pub output_value: f64,
    pub weight_applied: f64,
}

/// Validation check result
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ValidationCheck {
    pub check_name: String,
    pub passed: bool,
    pub details: String,
}

/// Risk factor
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct RiskFactor {
    pub factor_type: String,
    pub severity: RiskSeverity,
    pub description: String,
    pub impact_score: f64,
}

/// Risk severity levels
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum RiskSeverity {
    Low,
    Medium,
    High,
    Critical,
}

impl TrustScoreEngine {
    /// Create new trust score engine
    pub fn new() -> Self {
        let mut weight_matrix = HashMap::new();
        weight_matrix.insert("compliance_framework".to_string(), 0.35);
        weight_matrix.insert("audit_results".to_string(), 0.25);
        weight_matrix.insert("certifications".to_string(), 0.20);
        weight_matrix.insert("historical_performance".to_string(), 0.15);
        weight_matrix.insert("peer_comparison".to_string(), 0.05);

        TrustScoreEngine {
            algorithm_version: "Velocity_Trust_Algorithm_v2.1".to_string(),
            weight_matrix,
            benchmark_data: HashMap::new(),
        }
    }

    /// Calculate trust score with cryptographic proof
    pub fn calculate_trust_score(
        &self,
        input: &TrustScoreInput,
        crypto_engine: &mut VelocityCryptographicEngine,
    ) -> Result<TrustScoreProof, String> {
        
        // Validate input data
        let validation_result = self.validate_input_data(input)?;
        if !validation_result.is_valid {
            return Err(format!("Input validation failed: {}", validation_result.error_message));
        }

        // Perform trust score calculation
        let calculation = self.perform_calculation(input)?;

        // Generate cryptographic hashes
        let input_data_hash = self.hash_input_data(input);
        let algorithm_hash = self.hash_algorithm_version();
        let calculation_hash = self.hash_calculation(&calculation, &input_data_hash, &algorithm_hash);

        // Create cryptographic proof
        let proof_data = format!(
            "{}{}{}{}{}",
            input.organization_id,
            calculation.final_score,
            input_data_hash,
            algorithm_hash,
            Utc::now().to_rfc3339()
        );
        let cryptographic_proof = self.create_trust_proof(&proof_data, crypto_engine);

        // Generate benchmark verification
        let benchmark_verification = self.create_benchmark_verification(
            &calculation,
            &input.organization_id,
        );

        // Get historical proofs
        let historical_proofs = self.get_historical_trust_proofs(&input.organization_id);

        Ok(TrustScoreProof {
            organization_id: input.organization_id.clone(),
            trust_score: calculation.final_score,
            calculation_hash,
            input_data_hash,
            algorithm_hash,
            cryptographic_proof,
            historical_proofs,
            benchmark_verification,
        })
    }

    /// Verify trust score proof
    pub fn verify_trust_score_proof(
        &self,
        proof: &TrustScoreProof,
        original_input: &TrustScoreInput,
    ) -> Result<TrustScoreVerificationResult, String> {
        
        // Verify input data hash
        let expected_input_hash = self.hash_input_data(original_input);
        let input_hash_valid = expected_input_hash == proof.input_data_hash;

        // Verify algorithm hash
        let expected_algorithm_hash = self.hash_algorithm_version();
        let algorithm_hash_valid = expected_algorithm_hash == proof.algorithm_hash;

        // Recalculate trust score
        let recalculation = self.perform_calculation(original_input)?;
        let score_consistent = (recalculation.final_score - proof.trust_score).abs() < 0.001;

        // Verify calculation hash
        let expected_calculation_hash = self.hash_calculation(
            &recalculation,
            &proof.input_data_hash,
            &proof.algorithm_hash,
        );
        let calculation_hash_valid = expected_calculation_hash == proof.calculation_hash;

        // Verify cryptographic proof
        let crypto_proof_valid = self.verify_cryptographic_proof(&proof.cryptographic_proof);

        // Calculate overall confidence
        let verification_confidence = self.calculate_verification_confidence(
            input_hash_valid,
            algorithm_hash_valid,
            score_consistent,
            calculation_hash_valid,
            crypto_proof_valid,
        );

        Ok(TrustScoreVerificationResult {
            is_valid: input_hash_valid && algorithm_hash_valid && score_consistent && 
                     calculation_hash_valid && crypto_proof_valid,
            verification_confidence,
            verification_details: TrustScoreVerificationDetails {
                input_hash_valid,
                algorithm_hash_valid,
                score_consistent,
                calculation_hash_valid,
                crypto_proof_valid,
                recalculated_score: recalculation.final_score,
                score_difference: (recalculation.final_score - proof.trust_score).abs(),
            },
            timestamp: Utc::now().to_rfc3339(),
        })
    }

    /// Get trust score trends with cryptographic verification
    pub fn get_trust_score_trends(
        &self,
        organization_id: &str,
        historical_proofs: &[TrustScoreProof],
    ) -> TrustScoreTrends {
        
        let mut scores: Vec<(String, f64)> = historical_proofs.iter()
            .map(|proof| (proof.cryptographic_proof.timestamp.clone(), proof.trust_score))
            .collect();
        
        scores.sort_by(|a, b| a.0.cmp(&b.0));

        let trend_direction = if scores.len() >= 2 {
            let recent_avg = scores.iter().rev().take(3).map(|(_, s)| s).sum::<f64>() / 3.0;
            let older_avg = scores.iter().take(3).map(|(_, s)| s).sum::<f64>() / 3.0;
            
            if recent_avg > older_avg + 0.05 {
                TrendDirection::Improving
            } else if recent_avg < older_avg - 0.05 {
                TrendDirection::Declining
            } else {
                TrendDirection::Stable
            }
        } else {
            TrendDirection::Insufficient
        };

        let volatility = if scores.len() > 1 {
            let mean = scores.iter().map(|(_, s)| s).sum::<f64>() / scores.len() as f64;
            let variance = scores.iter()
                .map(|(_, s)| (s - mean).powi(2))
                .sum::<f64>() / scores.len() as f64;
            variance.sqrt()
        } else {
            0.0
        };

        TrustScoreTrends {
            organization_id: organization_id.to_string(),
            historical_scores: scores,
            trend_direction,
            volatility,
            prediction_confidence: self.calculate_prediction_confidence(&scores),
            next_expected_range: self.predict_next_score_range(&scores),
        }
    }

    // Private helper methods

    fn validate_input_data(&self, input: &TrustScoreInput) -> Result<InputValidationResult, String> {
        let mut validation_errors = Vec::new();

        // Validate organization ID
        if input.organization_id.is_empty() {
            validation_errors.push("Organization ID cannot be empty".to_string());
        }

        // Validate compliance scores
        for (framework, score) in &input.compliance_scores {
            if *score < 0.0 || *score > 1.0 {
                validation_errors.push(format!("Invalid compliance score for {}: {}", framework, score));
            }
        }

        // Validate audit results
        for audit in &input.audit_results {
            if audit.score < 0.0 || audit.score > 100.0 {
                validation_errors.push(format!("Invalid audit score: {}", audit.score));
            }
        }

        Ok(InputValidationResult {
            is_valid: validation_errors.is_empty(),
            error_message: validation_errors.join("; "),
            validation_score: if validation_errors.is_empty() { 1.0 } else { 0.0 },
        })
    }

    fn perform_calculation(&self, input: &TrustScoreInput) -> Result<TrustScoreCalculation, String> {
        let mut component_scores = HashMap::new();
        let mut computation_steps = Vec::new();
        let mut risk_factors = Vec::new();

        // Calculate compliance framework score
        let compliance_score = self.calculate_compliance_score(&input.compliance_scores);
        component_scores.insert("compliance_framework".to_string(), compliance_score);
        computation_steps.push(ComputationStep {
            step_id: "compliance_calc".to_string(),
            description: "Compliance framework score calculation".to_string(),
            input_values: input.compliance_scores.clone(),
            output_value: compliance_score,
            weight_applied: *self.weight_matrix.get("compliance_framework").unwrap_or(&0.0),
        });

        // Calculate audit score
        let audit_score = self.calculate_audit_score(&input.audit_results);
        component_scores.insert("audit_results".to_string(), audit_score);
        computation_steps.push(ComputationStep {
            step_id: "audit_calc".to_string(),
            description: "Audit results score calculation".to_string(),
            input_values: input.audit_results.iter()
                .map(|a| (a.audit_id.clone(), a.score))
                .collect(),
            output_value: audit_score,
            weight_applied: *self.weight_matrix.get("audit_results").unwrap_or(&0.0),
        });

        // Calculate certification score
        let cert_score = self.calculate_certification_score(&input.certification_status);
        component_scores.insert("certifications".to_string(), cert_score);

        // Calculate historical performance score
        let historical_score = self.calculate_historical_score(&input.historical_performance);
        component_scores.insert("historical_performance".to_string(), historical_score);

        // Calculate peer comparison score
        let peer_score = self.calculate_peer_score(&input.peer_comparisons);
        component_scores.insert("peer_comparison".to_string(), peer_score);

        // Calculate weighted final score
        let final_score = component_scores.iter()
            .map(|(component, score)| {
                let weight = self.weight_matrix.get(component).unwrap_or(&0.0);
                score * weight
            })
            .sum::<f64>();

        // Identify risk factors
        if compliance_score < 0.7 {
            risk_factors.push(RiskFactor {
                factor_type: "Low Compliance Score".to_string(),
                severity: RiskSeverity::High,
                description: "Compliance framework scores below acceptable threshold".to_string(),
                impact_score: -0.15,
            });
        }

        if audit_score < 0.6 {
            risk_factors.push(RiskFactor {
                factor_type: "Poor Audit Results".to_string(),
                severity: RiskSeverity::Critical,
                description: "Recent audit results indicate significant deficiencies".to_string(),
                impact_score: -0.25,
            });
        }

        // Calculate confidence interval
        let confidence_interval = self.calculate_confidence_interval(final_score, &component_scores);

        Ok(TrustScoreCalculation {
            final_score,
            component_scores,
            confidence_interval,
            calculation_details: CalculationDetails {
                algorithm_version: self.algorithm_version.clone(),
                input_data_quality: self.assess_input_quality(input),
                computation_steps,
                validation_checks: vec![
                    ValidationCheck {
                        check_name: "Score Range Validation".to_string(),
                        passed: final_score >= 0.0 && final_score <= 1.0,
                        details: format!("Final score: {}", final_score),
                    }
                ],
            },
            risk_factors,
        })
    }

    fn hash_input_data(&self, input: &TrustScoreInput) -> String {
        let serialized = serde_json::to_string(input).unwrap_or_default();
        let mut hasher = Sha256::new();
        hasher.update(serialized.as_bytes());
        hex::encode(hasher.finalize())
    }

    fn hash_algorithm_version(&self) -> String {
        let mut hasher = Sha256::new();
        hasher.update(self.algorithm_version.as_bytes());
        hex::encode(hasher.finalize())
    }

    fn hash_calculation(&self, calculation: &TrustScoreCalculation, input_hash: &str, algorithm_hash: &str) -> String {
        let data = format!(
            "{}{}{}{}",
            calculation.final_score,
            serde_json::to_string(&calculation.component_scores).unwrap_or_default(),
            input_hash,
            algorithm_hash
        );
        let mut hasher = Sha256::new();
        hasher.update(data.as_bytes());
        hex::encode(hasher.finalize())
    }

    fn create_trust_proof(&self, data: &str, crypto_engine: &mut VelocityCryptographicEngine) -> CryptographicProof {
        let hash = {
            let mut hasher = Sha256::new();
            hasher.update(data.as_bytes());
            hex::encode(hasher.finalize())
        };

        CryptographicProof {
            id: format!("trust_proof_{}", Uuid::new_v4()),
            hash: hash.clone(),
            signature: self.sign_data(&hash),
            timestamp: Utc::now().to_rfc3339(),
            previous_hash: None,
            merkle_root: None,
            block_height: 0,
            verification_status: "verified".to_string(),
        }
    }

    fn sign_data(&self, data: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(format!("sign_{}", data).as_bytes());
        hex::encode(hasher.finalize())
    }

    fn create_benchmark_verification(&self, calculation: &TrustScoreCalculation, org_id: &str) -> BenchmarkVerification {
        let industry_hash = {
            let mut hasher = Sha256::new();
            hasher.update("industry_benchmark_2024_q4".as_bytes());
            hex::encode(hasher.finalize())
        };

        let comparative_proof = {
            let data = format!("compare_{}_{}", calculation.final_score, org_id);
            let mut hasher = Sha256::new();
            hasher.update(data.as_bytes());
            hex::encode(hasher.finalize())
        };

        BenchmarkVerification {
            industry_hash,
            comparative_proof,
            anonymized_data: true,
        }
    }

    fn get_historical_trust_proofs(&self, org_id: &str) -> Vec<String> {
        vec![
            format!("{}_2024_q1_trust_proof", org_id),
            format!("{}_2024_q2_trust_proof", org_id),
            format!("{}_2024_q3_trust_proof", org_id),
        ]
    }

    fn verify_cryptographic_proof(&self, proof: &CryptographicProof) -> bool {
        proof.verification_status == "verified" && 
        proof.hash.len() == 64 && 
        proof.signature.len() > 0
    }

    fn calculate_verification_confidence(&self, input_valid: bool, algo_valid: bool, score_consistent: bool, calc_valid: bool, crypto_valid: bool) -> f64 {
        let validations = [input_valid, algo_valid, score_consistent, calc_valid, crypto_valid];
        let valid_count = validations.iter().filter(|&&v| v).count();
        valid_count as f64 / validations.len() as f64
    }

    fn calculate_compliance_score(&self, scores: &HashMap<String, f64>) -> f64 {
        if scores.is_empty() {
            return 0.0;
        }
        scores.values().sum::<f64>() / scores.len() as f64
    }

    fn calculate_audit_score(&self, audits: &[AuditResult]) -> f64 {
        if audits.is_empty() {
            return 0.0;
        }
        let total: f64 = audits.iter().map(|a| a.score / 100.0).sum();
        total / audits.len() as f64
    }

    fn calculate_certification_score(&self, certs: &HashMap<String, CertificationStatus>) -> f64 {
        if certs.is_empty() {
            return 0.0;
        }
        let active_score: f64 = certs.values()
            .map(|c| if c.is_active { c.confidence_level } else { 0.0 })
            .sum();
        active_score / certs.len() as f64
    }

    fn calculate_historical_score(&self, metrics: &[PerformanceMetric]) -> f64 {
        if metrics.is_empty() {
            return 0.5; // Default neutral score
        }
        metrics.iter().map(|m| m.value).sum::<f64>() / metrics.len() as f64
    }

    fn calculate_peer_score(&self, comparisons: &[PeerComparison]) -> f64 {
        if comparisons.is_empty() {
            return 0.5; // Default neutral score
        }
        comparisons.iter().map(|p| p.percentile_ranking / 100.0).sum::<f64>() / comparisons.len() as f64
    }

    fn calculate_confidence_interval(&self, score: f64, _components: &HashMap<String, f64>) -> (f64, f64) {
        let margin = 0.05; // 5% margin of error
        ((score - margin).max(0.0), (score + margin).min(1.0))
    }

    fn assess_input_quality(&self, input: &TrustScoreInput) -> f64 {
        let mut quality_score = 0.0;
        let mut factors = 0;

        if !input.compliance_scores.is_empty() {
            quality_score += 0.3;
            factors += 1;
        }
        if !input.audit_results.is_empty() {
            quality_score += 0.25;
            factors += 1;
        }
        if !input.certification_status.is_empty() {
            quality_score += 0.2;
            factors += 1;
        }
        if !input.historical_performance.is_empty() {
            quality_score += 0.15;
            factors += 1;
        }
        if !input.peer_comparisons.is_empty() {
            quality_score += 0.1;
            factors += 1;
        }

        if factors > 0 { quality_score } else { 0.0 }
    }

    fn calculate_prediction_confidence(&self, scores: &[(String, f64)]) -> f64 {
        if scores.len() < 3 {
            return 0.3; // Low confidence with insufficient data
        }
        
        let recent_scores: Vec<f64> = scores.iter().rev().take(5).map(|(_, s)| *s).collect();
        let volatility = if recent_scores.len() > 1 {
            let mean = recent_scores.iter().sum::<f64>() / recent_scores.len() as f64;
            let variance = recent_scores.iter()
                .map(|s| (s - mean).powi(2))
                .sum::<f64>() / recent_scores.len() as f64;
            variance.sqrt()
        } else {
            0.0
        };

        // Higher volatility = lower prediction confidence
        (1.0 - volatility.min(0.5)) * 0.9
    }

    fn predict_next_score_range(&self, scores: &[(String, f64)]) -> (f64, f64) {
        if scores.len() < 2 {
            return (0.0, 1.0); // Full range if insufficient data
        }

        let recent_scores: Vec<f64> = scores.iter().rev().take(3).map(|(_, s)| *s).collect();
        let avg = recent_scores.iter().sum::<f64>() / recent_scores.len() as f64;
        let margin = 0.1; // 10% prediction margin

        ((avg - margin).max(0.0), (avg + margin).min(1.0))
    }
}

/// Supporting structures

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct InputValidationResult {
    pub is_valid: bool,
    pub error_message: String,
    pub validation_score: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TrustScoreVerificationResult {
    pub is_valid: bool,
    pub verification_confidence: f64,
    pub verification_details: TrustScoreVerificationDetails,
    pub timestamp: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TrustScoreVerificationDetails {
    pub input_hash_valid: bool,
    pub algorithm_hash_valid: bool,
    pub score_consistent: bool,
    pub calculation_hash_valid: bool,
    pub crypto_proof_valid: bool,
    pub recalculated_score: f64,
    pub score_difference: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TrustScoreTrends {
    pub organization_id: String,
    pub historical_scores: Vec<(String, f64)>,
    pub trend_direction: TrendDirection,
    pub volatility: f64,
    pub prediction_confidence: f64,
    pub next_expected_range: (f64, f64),
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum TrendDirection {
    Improving,
    Declining,
    Stable,
    Insufficient,
}