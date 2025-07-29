/// High-performance Trust Score Calculator for Velocity Trust Protocol
/// 
/// Optimized mathematical calculations for trust scoring with Polygon integration
/// Supports parallel computation and real-time updates

use crate::{CryptoError, Result};
use crate::hash_engine::{HashAlgorithm, HashEngine};
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;

/// Trust activity types with their base weights
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum TrustActivityType {
    ComplianceVerification,
    ExpertValidation,
    RegulatoryApproval,
    CrossPlatformAttestation,
    ContinuousMonitoring,
    AuditCompletion,
    PolygonVerification,
}

/// Trust activity with metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrustActivity {
    pub activity_type: TrustActivityType,
    pub timestamp: u64,
    pub value: f64,
    pub confidence: f64,
    pub verifier_reputation: f64,
    pub polygon_tx_hash: Option<String>,
    pub metadata: HashMap<String, String>,
}

/// Trust score calculation configuration
#[derive(Debug, Clone)]
pub struct TrustCalculatorConfig {
    pub activity_weights: HashMap<TrustActivityType, f64>,
    pub time_decay_factor: f64,
    pub reputation_multiplier: f64,
    pub confidence_threshold: f64,
    pub polygon_verification_boost: f64,
    pub parallel_threshold: usize,
}

impl Default for TrustCalculatorConfig {
    fn default() -> Self {
        let mut weights = HashMap::new();
        weights.insert(TrustActivityType::ComplianceVerification, 0.25);
        weights.insert(TrustActivityType::ExpertValidation, 0.20);
        weights.insert(TrustActivityType::RegulatoryApproval, 0.30);
        weights.insert(TrustActivityType::CrossPlatformAttestation, 0.10);
        weights.insert(TrustActivityType::ContinuousMonitoring, 0.05);
        weights.insert(TrustActivityType::AuditCompletion, 0.15);
        weights.insert(TrustActivityType::PolygonVerification, 0.35);

        Self {
            activity_weights: weights,
            time_decay_factor: 0.95,
            reputation_multiplier: 1.2,
            confidence_threshold: 0.7,
            polygon_verification_boost: 1.5,
            parallel_threshold: 100,
        }
    }
}

/// High-performance trust score calculator
pub struct TrustCalculator {
    config: TrustCalculatorConfig,
    hash_engine: HashEngine,
}

impl TrustCalculator {
    pub fn new(config: TrustCalculatorConfig) -> Self {
        Self {
            config,
            hash_engine: HashEngine::new(HashAlgorithm::Blake3),
        }
    }

    /// Calculate trust score from activities
    pub fn calculate_trust_score(&self, activities: &[TrustActivity]) -> Result<TrustScore> {
        if activities.is_empty() {
            return Ok(TrustScore::default());
        }

        // Use parallel processing for large datasets
        let scores = if activities.len() > self.config.parallel_threshold {
            self.calculate_parallel(activities)?
        } else {
            self.calculate_sequential(activities)?
        };

        Ok(scores)
    }

    /// Sequential calculation for smaller datasets
    fn calculate_sequential(&self, activities: &[TrustActivity]) -> Result<TrustScore> {
        let mut weighted_sum = 0.0;
        let mut total_weight = 0.0;
        let mut polygon_verified_count = 0;
        let mut activity_breakdown = HashMap::new();
        
        let current_time = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs();

        for activity in activities {
            let base_weight = self.config.activity_weights
                .get(&activity.activity_type)
                .copied()
                .unwrap_or(0.1);

            // Apply time decay
            let time_diff = (current_time - activity.timestamp) as f64;
            let time_decay = self.config.time_decay_factor.powf(time_diff / 86400.0); // Daily decay

            // Apply confidence and reputation multipliers
            let confidence_factor = if activity.confidence >= self.config.confidence_threshold {
                activity.confidence
            } else {
                activity.confidence * 0.5 // Penalty for low confidence
            };

            let reputation_factor = 1.0 + (activity.verifier_reputation - 0.5) * self.config.reputation_multiplier;

            // Apply Polygon verification boost
            let polygon_factor = if activity.polygon_tx_hash.is_some() {
                polygon_verified_count += 1;
                self.config.polygon_verification_boost
            } else {
                1.0
            };

            let final_weight = base_weight * time_decay * confidence_factor * reputation_factor * polygon_factor;
            let contribution = activity.value * final_weight;

            weighted_sum += contribution;
            total_weight += final_weight;

            // Track activity breakdown
            *activity_breakdown.entry(activity.activity_type).or_insert(0.0) += contribution;
        }

        let raw_score = if total_weight > 0.0 {
            weighted_sum / total_weight
        } else {
            0.0
        };

        // Normalize score to 0-100 range
        let normalized_score = (raw_score * 100.0).min(100.0).max(0.0);

        // Calculate trust hash for immutability
        let trust_hash = self.calculate_trust_hash(activities, normalized_score)?;

        Ok(TrustScore {
            score: normalized_score,
            confidence: self.calculate_confidence(activities),
            total_activities: activities.len(),
            polygon_verified_activities: polygon_verified_count,
            activity_breakdown,
            calculation_timestamp: current_time,
            trust_hash,
            verification_method: "velocity_trust_protocol_v1".to_string(),
        })
    }

    /// Parallel calculation for large datasets
    fn calculate_parallel(&self, activities: &[TrustActivity]) -> Result<TrustScore> {
        let current_time = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs();

        let config = Arc::new(self.config.clone());

        // Process activities in parallel
        let results: Vec<(f64, f64, bool, TrustActivityType, f64)> = activities
            .par_iter()
            .map(|activity| {
                let base_weight = config.activity_weights
                    .get(&activity.activity_type)
                    .copied()
                    .unwrap_or(0.1);

                let time_diff = (current_time - activity.timestamp) as f64;
                let time_decay = config.time_decay_factor.powf(time_diff / 86400.0);

                let confidence_factor = if activity.confidence >= config.confidence_threshold {
                    activity.confidence
                } else {
                    activity.confidence * 0.5
                };

                let reputation_factor = 1.0 + (activity.verifier_reputation - 0.5) * config.reputation_multiplier;

                let polygon_factor = if activity.polygon_tx_hash.is_some() {
                    config.polygon_verification_boost
                } else {
                    1.0
                };

                let final_weight = base_weight * time_decay * confidence_factor * reputation_factor * polygon_factor;
                let contribution = activity.value * final_weight;

                (contribution, final_weight, activity.polygon_tx_hash.is_some(), activity.activity_type, contribution)
            })
            .collect();

        // Aggregate results
        let mut weighted_sum = 0.0;
        let mut total_weight = 0.0;
        let mut polygon_verified_count = 0;
        let mut activity_breakdown = HashMap::new();

        for (contribution, weight, is_polygon_verified, activity_type, activity_contribution) in results {
            weighted_sum += contribution;
            total_weight += weight;
            if is_polygon_verified {
                polygon_verified_count += 1;
            }
            *activity_breakdown.entry(activity_type).or_insert(0.0) += activity_contribution;
        }

        let raw_score = if total_weight > 0.0 {
            weighted_sum / total_weight
        } else {
            0.0
        };

        let normalized_score = (raw_score * 100.0).min(100.0).max(0.0);
        let trust_hash = self.calculate_trust_hash(activities, normalized_score)?;

        Ok(TrustScore {
            score: normalized_score,
            confidence: self.calculate_confidence(activities),
            total_activities: activities.len(),
            polygon_verified_activities: polygon_verified_count,
            activity_breakdown,
            calculation_timestamp: current_time,
            trust_hash,
            verification_method: "velocity_trust_protocol_v1".to_string(),
        })
    }

    /// Calculate overall confidence in the trust score
    fn calculate_confidence(&self, activities: &[TrustActivity]) -> f64 {
        if activities.is_empty() {
            return 0.0;
        }

        let avg_confidence = activities.iter()
            .map(|a| a.confidence)
            .sum::<f64>() / activities.len() as f64;

        let avg_reputation = activities.iter()
            .map(|a| a.verifier_reputation)
            .sum::<f64>() / activities.len() as f64;

        let polygon_ratio = activities.iter()
            .filter(|a| a.polygon_tx_hash.is_some())
            .count() as f64 / activities.len() as f64;

        // Weighted confidence calculation
        (avg_confidence * 0.4 + avg_reputation * 0.3 + polygon_ratio * 0.3).min(1.0)
    }

    /// Calculate cryptographic hash of trust calculation
    fn calculate_trust_hash(&self, activities: &[TrustActivity], score: f64) -> Result<String> {
        let mut hash_data = Vec::new();
        
        // Include score
        hash_data.extend_from_slice(&score.to_le_bytes());
        
        // Include activity hashes
        for activity in activities {
            let activity_data = format!(
                "{:?}:{}:{}:{}:{}",
                activity.activity_type,
                activity.timestamp,
                activity.value,
                activity.confidence,
                activity.polygon_tx_hash.as_deref().unwrap_or("none")
            );
            hash_data.extend_from_slice(activity_data.as_bytes());
        }

        let hash = self.hash_engine.hash(&hash_data)?;
        Ok(hex::encode(hash))
    }

    /// Update trust score incrementally with new activities
    pub fn update_trust_score(
        &self,
        current_score: &TrustScore,
        new_activities: &[TrustActivity],
    ) -> Result<TrustScore> {
        // This is a simplified incremental update
        // In production, you'd maintain more state for true incremental updates
        let weight_factor = 0.9; // Weight of existing score
        let new_score = self.calculate_trust_score(new_activities)?;
        
        let updated_score = current_score.score * weight_factor + new_score.score * (1.0 - weight_factor);
        let updated_confidence = current_score.confidence * weight_factor + new_score.confidence * (1.0 - weight_factor);

        let mut updated_breakdown = current_score.activity_breakdown.clone();
        for (activity_type, contribution) in new_score.activity_breakdown {
            *updated_breakdown.entry(activity_type).or_insert(0.0) += contribution * (1.0 - weight_factor);
        }

        Ok(TrustScore {
            score: updated_score,
            confidence: updated_confidence,
            total_activities: current_score.total_activities + new_activities.len(),
            polygon_verified_activities: current_score.polygon_verified_activities + new_score.polygon_verified_activities,
            activity_breakdown: updated_breakdown,
            calculation_timestamp: new_score.calculation_timestamp,
            trust_hash: self.calculate_trust_hash(new_activities, updated_score)?,
            verification_method: "velocity_trust_protocol_v1".to_string(),
        })
    }
}

/// Trust score result with metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrustScore {
    pub score: f64,
    pub confidence: f64,
    pub total_activities: usize,
    pub polygon_verified_activities: usize,
    pub activity_breakdown: HashMap<TrustActivityType, f64>,
    pub calculation_timestamp: u64,
    pub trust_hash: String,
    pub verification_method: String,
}

impl Default for TrustScore {
    fn default() -> Self {
        Self {
            score: 0.0,
            confidence: 0.0,
            total_activities: 0,
            polygon_verified_activities: 0,
            activity_breakdown: HashMap::new(),
            calculation_timestamp: 0,
            trust_hash: String::new(),
            verification_method: "velocity_trust_protocol_v1".to_string(),
        }
    }
}

/// Batch trust score calculation for multiple entities
pub fn calculate_trust_scores_batch(
    calculator: &TrustCalculator,
    entity_activities: Vec<(String, Vec<TrustActivity>)>,
) -> HashMap<String, Result<TrustScore>> {
    entity_activities
        .into_par_iter()
        .map(|(entity_id, activities)| {
            let score = calculator.calculate_trust_score(&activities);
            (entity_id, score)
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_activity(activity_type: TrustActivityType, value: f64, has_polygon: bool) -> TrustActivity {
        TrustActivity {
            activity_type,
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            value,
            confidence: 0.9,
            verifier_reputation: 0.8,
            polygon_tx_hash: if has_polygon {
                Some("0x1234567890abcdef".to_string())
            } else {
                None
            },
            metadata: HashMap::new(),
        }
    }

    #[test]
    fn test_trust_calculation() {
        let calculator = TrustCalculator::new(TrustCalculatorConfig::default());
        
        let activities = vec![
            create_test_activity(TrustActivityType::ComplianceVerification, 0.9, true),
            create_test_activity(TrustActivityType::ExpertValidation, 0.85, false),
            create_test_activity(TrustActivityType::RegulatoryApproval, 0.95, true),
            create_test_activity(TrustActivityType::PolygonVerification, 1.0, true),
        ];

        let score = calculator.calculate_trust_score(&activities).unwrap();
        assert!(score.score > 80.0); // High score due to good activities
        assert_eq!(score.polygon_verified_activities, 3);
        assert_eq!(score.total_activities, 4);
    }

    #[test]
    fn test_parallel_calculation() {
        let calculator = TrustCalculator::new(TrustCalculatorConfig::default());
        
        // Create large dataset
        let activities: Vec<TrustActivity> = (0..1000)
            .map(|i| create_test_activity(
                TrustActivityType::ContinuousMonitoring,
                0.8 + (i as f64 / 10000.0),
                i % 3 == 0,
            ))
            .collect();

        let score = calculator.calculate_trust_score(&activities).unwrap();
        assert!(score.total_activities == 1000);
        assert!(score.polygon_verified_activities > 300);
    }

    #[test]
    fn test_incremental_update() {
        let calculator = TrustCalculator::new(TrustCalculatorConfig::default());
        
        let initial_activities = vec![
            create_test_activity(TrustActivityType::ComplianceVerification, 0.8, true),
        ];
        
        let initial_score = calculator.calculate_trust_score(&initial_activities).unwrap();
        
        let new_activities = vec![
            create_test_activity(TrustActivityType::AuditCompletion, 0.95, true),
        ];
        
        let updated_score = calculator.update_trust_score(&initial_score, &new_activities).unwrap();
        assert!(updated_score.score > initial_score.score);
        assert_eq!(updated_score.total_activities, 2);
    }
}