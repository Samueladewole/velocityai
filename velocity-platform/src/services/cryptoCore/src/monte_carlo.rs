/// High-performance Monte Carlo simulation engine for Velocity Trust Protocol
/// 
/// Optimized for risk analysis and compliance prediction with Polygon integration
/// Supports parallel simulations and GPU acceleration when available

use crate::{CryptoError, Result};
use rayon::prelude::*;
use rand::{distributions::Distribution, thread_rng, Rng, SeedableRng};
use rand_distr::{Beta, Normal, Uniform};
use rand_xoshiro::Xoshiro256PlusPlus;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

/// Types of distributions for simulation inputs
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum DistributionType {
    Normal { mean: f64, std_dev: f64 },
    Uniform { min: f64, max: f64 },
    Beta { alpha: f64, beta: f64 },
    Triangular { min: f64, mode: f64, max: f64 },
    Empirical { values: Vec<f64> },
}

/// Simulation scenario for compliance risk
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComplianceScenario {
    pub name: String,
    pub compliance_factors: Vec<ComplianceFactor>,
    pub market_conditions: MarketConditions,
    pub regulatory_environment: RegulatoryEnvironment,
    pub polygon_verification_rate: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComplianceFactor {
    pub name: String,
    pub base_value: f64,
    pub distribution: DistributionType,
    pub weight: f64,
    pub correlation_factors: Vec<(String, f64)>, // (factor_name, correlation)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarketConditions {
    pub volatility: DistributionType,
    pub growth_rate: DistributionType,
    pub competition_intensity: DistributionType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegulatoryEnvironment {
    pub stringency: DistributionType,
    pub change_frequency: DistributionType,
    pub enforcement_probability: DistributionType,
}

/// Monte Carlo simulation configuration
#[derive(Debug, Clone)]
pub struct MonteCarloConfig {
    pub iterations: usize,
    pub confidence_intervals: Vec<f64>,
    pub parallel_threshold: usize,
    pub seed: Option<u64>,
    pub enable_polygon_verification: bool,
}

impl Default for MonteCarloConfig {
    fn default() -> Self {
        Self {
            iterations: 10_000,
            confidence_intervals: vec![0.95, 0.99],
            parallel_threshold: 1_000,
            seed: None,
            enable_polygon_verification: true,
        }
    }
}

/// Monte Carlo simulation engine
pub struct MonteCarloEngine {
    config: MonteCarloConfig,
}

impl MonteCarloEngine {
    pub fn new(config: MonteCarloConfig) -> Self {
        Self { config }
    }

    /// Run compliance risk simulation
    pub fn simulate_compliance_risk(
        &self,
        scenario: &ComplianceScenario,
    ) -> Result<SimulationResult> {
        let results = if self.config.iterations > self.config.parallel_threshold {
            self.run_parallel_simulation(scenario)?
        } else {
            self.run_sequential_simulation(scenario)?
        };

        self.analyze_results(results, scenario)
    }

    /// Run sequential simulation for smaller iteration counts
    fn run_sequential_simulation(
        &self,
        scenario: &ComplianceScenario,
    ) -> Result<Vec<SimulationIteration>> {
        let mut rng = self.create_rng();
        let mut results = Vec::with_capacity(self.config.iterations);

        for i in 0..self.config.iterations {
            let iteration = self.simulate_single_iteration(scenario, &mut rng, i)?;
            results.push(iteration);
        }

        Ok(results)
    }

    /// Run parallel simulation for larger iteration counts
    fn run_parallel_simulation(
        &self,
        scenario: &ComplianceScenario,
    ) -> Result<Vec<SimulationIteration>> {
        let scenario = Arc::new(scenario.clone());
        let base_seed = self.config.seed.unwrap_or_else(|| thread_rng().gen());

        let results: Result<Vec<_>> = (0..self.config.iterations)
            .into_par_iter()
            .map(|i| {
                let scenario = Arc::clone(&scenario);
                let mut rng = Xoshiro256PlusPlus::seed_from_u64(base_seed.wrapping_add(i as u64));
                self.simulate_single_iteration(&scenario, &mut rng, i)
            })
            .collect();

        results
    }

    /// Simulate a single iteration
    fn simulate_single_iteration(
        &self,
        scenario: &ComplianceScenario,
        rng: &mut impl Rng,
        iteration_id: usize,
    ) -> Result<SimulationIteration> {
        // Sample market conditions
        let market_volatility = self.sample_distribution(&scenario.market_conditions.volatility, rng)?;
        let market_growth = self.sample_distribution(&scenario.market_conditions.growth_rate, rng)?;
        let competition = self.sample_distribution(&scenario.market_conditions.competition_intensity, rng)?;

        // Sample regulatory environment
        let regulatory_stringency = self.sample_distribution(&scenario.regulatory_environment.stringency, rng)?;
        let regulatory_changes = self.sample_distribution(&scenario.regulatory_environment.change_frequency, rng)?;
        let enforcement_prob = self.sample_distribution(&scenario.regulatory_environment.enforcement_probability, rng)?;

        // Calculate compliance factors with correlations
        let mut factor_values = Vec::new();
        let mut compliance_score = 0.0;

        for factor in &scenario.compliance_factors {
            let base_sample = self.sample_distribution(&factor.distribution, rng)?;
            
            // Apply correlations
            let mut adjusted_value = base_sample;
            for (corr_name, corr_strength) in &factor.correlation_factors {
                // Simple correlation adjustment (in production, use proper correlation matrices)
                if corr_name == "market_volatility" {
                    adjusted_value += market_volatility * corr_strength;
                } else if corr_name == "regulatory_stringency" {
                    adjusted_value += regulatory_stringency * corr_strength;
                }
            }

            adjusted_value = adjusted_value.max(0.0).min(1.0);
            compliance_score += adjusted_value * factor.weight;
            
            factor_values.push(FactorValue {
                name: factor.name.clone(),
                value: adjusted_value,
                weight: factor.weight,
            });
        }

        // Apply market and regulatory impacts
        let market_impact = 1.0 + (market_growth - 0.5) * 0.2 - market_volatility * 0.1;
        let regulatory_impact = 1.0 - (regulatory_stringency - 0.5) * 0.3 - regulatory_changes * 0.05;
        
        compliance_score *= market_impact * regulatory_impact;

        // Polygon verification boost
        let polygon_verified = rng.gen_bool(scenario.polygon_verification_rate);
        if polygon_verified && self.config.enable_polygon_verification {
            compliance_score *= 1.15; // 15% boost for Polygon verification
        }

        // Calculate risk score (inverse of compliance)
        let risk_score = 1.0 - compliance_score.max(0.0).min(1.0);

        // Determine if enforcement action occurs
        let enforcement_action = rng.gen_bool(enforcement_prob * risk_score);

        Ok(SimulationIteration {
            iteration_id,
            compliance_score,
            risk_score,
            factor_values,
            market_conditions: MarketConditionValues {
                volatility: market_volatility,
                growth_rate: market_growth,
                competition_intensity: competition,
            },
            regulatory_conditions: RegulatoryConditionValues {
                stringency: regulatory_stringency,
                change_frequency: regulatory_changes,
                enforcement_probability: enforcement_prob,
            },
            polygon_verified,
            enforcement_action,
        })
    }

    /// Sample from a distribution
    fn sample_distribution(&self, dist: &DistributionType, rng: &mut impl Rng) -> Result<f64> {
        match dist {
            DistributionType::Normal { mean, std_dev } => {
                let normal = Normal::new(*mean, *std_dev)
                    .map_err(|e| CryptoError::InvalidInput(format!("Invalid normal distribution: {}", e)))?;
                Ok(normal.sample(rng))
            }
            DistributionType::Uniform { min, max } => {
                let uniform = Uniform::new(*min, *max);
                Ok(uniform.sample(rng))
            }
            DistributionType::Beta { alpha, beta } => {
                let beta_dist = Beta::new(*alpha, *beta)
                    .map_err(|e| CryptoError::InvalidInput(format!("Invalid beta distribution: {}", e)))?;
                Ok(beta_dist.sample(rng))
            }
            DistributionType::Triangular { min, mode, max } => {
                // Simple triangular distribution implementation
                let u: f64 = rng.gen();
                let fc = (mode - min) / (max - min);
                
                if u < fc {
                    Ok(min + ((max - min) * (mode - min) * u).sqrt())
                } else {
                    Ok(max - ((max - min) * (max - mode) * (1.0 - u)).sqrt())
                }
            }
            DistributionType::Empirical { values } => {
                if values.is_empty() {
                    return Err(CryptoError::InvalidInput("Empty empirical distribution".to_string()));
                }
                let idx = rng.gen_range(0..values.len());
                Ok(values[idx])
            }
        }
    }

    /// Analyze simulation results
    fn analyze_results(
        &self,
        results: Vec<SimulationIteration>,
        scenario: &ComplianceScenario,
    ) -> Result<SimulationResult> {
        if results.is_empty() {
            return Err(CryptoError::InvalidInput("No simulation results".to_string()));
        }

        // Extract scores
        let compliance_scores: Vec<f64> = results.iter().map(|r| r.compliance_score).collect();
        let risk_scores: Vec<f64> = results.iter().map(|r| r.risk_score).collect();

        // Calculate statistics
        let stats = self.calculate_statistics(&compliance_scores);
        let risk_stats = self.calculate_statistics(&risk_scores);

        // Calculate confidence intervals
        let mut confidence_intervals = Vec::new();
        for &confidence_level in &self.config.confidence_intervals {
            let interval = self.calculate_confidence_interval(&compliance_scores, confidence_level);
            confidence_intervals.push(ConfidenceInterval {
                confidence_level,
                lower_bound: interval.0,
                upper_bound: interval.1,
            });
        }

        // Factor sensitivity analysis
        let factor_sensitivities = self.calculate_factor_sensitivities(&results);

        // Risk metrics
        let enforcement_probability = results.iter()
            .filter(|r| r.enforcement_action)
            .count() as f64 / results.len() as f64;

        let polygon_verification_rate = results.iter()
            .filter(|r| r.polygon_verified)
            .count() as f64 / results.len() as f64;

        Ok(SimulationResult {
            scenario_name: scenario.name.clone(),
            iterations: results.len(),
            compliance_statistics: stats,
            risk_statistics: risk_stats,
            confidence_intervals,
            factor_sensitivities,
            enforcement_probability,
            polygon_verification_rate,
            percentiles: self.calculate_percentiles(&compliance_scores),
            convergence_achieved: self.check_convergence(&compliance_scores),
        })
    }

    /// Calculate basic statistics
    fn calculate_statistics(&self, values: &[f64]) -> Statistics {
        let mean = values.iter().sum::<f64>() / values.len() as f64;
        
        let variance = values.iter()
            .map(|v| (v - mean).powi(2))
            .sum::<f64>() / values.len() as f64;
        
        let std_dev = variance.sqrt();
        
        let mut sorted = values.to_vec();
        sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());
        
        let median = if sorted.len() % 2 == 0 {
            (sorted[sorted.len() / 2 - 1] + sorted[sorted.len() / 2]) / 2.0
        } else {
            sorted[sorted.len() / 2]
        };

        Statistics {
            mean,
            median,
            std_dev,
            min: *sorted.first().unwrap(),
            max: *sorted.last().unwrap(),
            skewness: self.calculate_skewness(values, mean, std_dev),
            kurtosis: self.calculate_kurtosis(values, mean, std_dev),
        }
    }

    /// Calculate skewness
    fn calculate_skewness(&self, values: &[f64], mean: f64, std_dev: f64) -> f64 {
        if std_dev == 0.0 {
            return 0.0;
        }
        
        let n = values.len() as f64;
        let sum_cubed = values.iter()
            .map(|v| ((v - mean) / std_dev).powi(3))
            .sum::<f64>();
        
        (n / ((n - 1.0) * (n - 2.0))) * sum_cubed
    }

    /// Calculate kurtosis
    fn calculate_kurtosis(&self, values: &[f64], mean: f64, std_dev: f64) -> f64 {
        if std_dev == 0.0 {
            return 0.0;
        }
        
        let n = values.len() as f64;
        let sum_fourth = values.iter()
            .map(|v| ((v - mean) / std_dev).powi(4))
            .sum::<f64>();
        
        let g2 = sum_fourth / n - 3.0;
        
        // Excess kurtosis
        (n - 1.0) / ((n - 2.0) * (n - 3.0)) * ((n + 1.0) * g2 + 6.0)
    }

    /// Calculate confidence interval
    fn calculate_confidence_interval(&self, values: &[f64], confidence_level: f64) -> (f64, f64) {
        let mut sorted = values.to_vec();
        sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());
        
        let alpha = 1.0 - confidence_level;
        let lower_idx = ((alpha / 2.0) * sorted.len() as f64) as usize;
        let upper_idx = ((1.0 - alpha / 2.0) * sorted.len() as f64) as usize;
        
        (sorted[lower_idx], sorted[upper_idx.min(sorted.len() - 1)])
    }

    /// Calculate percentiles
    fn calculate_percentiles(&self, values: &[f64]) -> Vec<(f64, f64)> {
        let mut sorted = values.to_vec();
        sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());
        
        let percentiles = vec![0.01, 0.05, 0.10, 0.25, 0.50, 0.75, 0.90, 0.95, 0.99];
        percentiles.into_iter()
            .map(|p| {
                let idx = (p * sorted.len() as f64) as usize;
                (p, sorted[idx.min(sorted.len() - 1)])
            })
            .collect()
    }

    /// Calculate factor sensitivities
    fn calculate_factor_sensitivities(&self, results: &[SimulationIteration]) -> Vec<FactorSensitivity> {
        let mut sensitivities = Vec::new();
        
        if let Some(first) = results.first() {
            for factor in &first.factor_values {
                let factor_values: Vec<f64> = results.iter()
                    .map(|r| r.factor_values.iter()
                        .find(|f| f.name == factor.name)
                        .map(|f| f.value)
                        .unwrap_or(0.0))
                    .collect();
                
                let compliance_scores: Vec<f64> = results.iter()
                    .map(|r| r.compliance_score)
                    .collect();
                
                let correlation = self.calculate_correlation(&factor_values, &compliance_scores);
                
                sensitivities.push(FactorSensitivity {
                    factor_name: factor.name.clone(),
                    correlation_with_compliance: correlation,
                    impact_magnitude: correlation.abs() * factor.weight,
                });
            }
        }
        
        // Sort by impact magnitude
        sensitivities.sort_by(|a, b| b.impact_magnitude.partial_cmp(&a.impact_magnitude).unwrap());
        sensitivities
    }

    /// Calculate correlation between two vectors
    fn calculate_correlation(&self, x: &[f64], y: &[f64]) -> f64 {
        if x.len() != y.len() || x.is_empty() {
            return 0.0;
        }
        
        let n = x.len() as f64;
        let sum_x: f64 = x.iter().sum();
        let sum_y: f64 = y.iter().sum();
        let sum_xy: f64 = x.iter().zip(y.iter()).map(|(a, b)| a * b).sum();
        let sum_x2: f64 = x.iter().map(|a| a * a).sum();
        let sum_y2: f64 = y.iter().map(|b| b * b).sum();
        
        let numerator = n * sum_xy - sum_x * sum_y;
        let denominator = ((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y)).sqrt();
        
        if denominator == 0.0 {
            0.0
        } else {
            numerator / denominator
        }
    }

    /// Check convergence of simulation
    fn check_convergence(&self, values: &[f64]) -> bool {
        if values.len() < 1000 {
            return false;
        }
        
        // Check if mean has stabilized
        let half_point = values.len() / 2;
        let first_half_mean = values[..half_point].iter().sum::<f64>() / half_point as f64;
        let second_half_mean = values[half_point..].iter().sum::<f64>() / (values.len() - half_point) as f64;
        
        (first_half_mean - second_half_mean).abs() < 0.001
    }

    /// Create RNG with optional seed
    fn create_rng(&self) -> Xoshiro256PlusPlus {
        match self.config.seed {
            Some(seed) => Xoshiro256PlusPlus::seed_from_u64(seed),
            None => Xoshiro256PlusPlus::from_entropy(),
        }
    }
}

/// Results from a single simulation iteration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SimulationIteration {
    pub iteration_id: usize,
    pub compliance_score: f64,
    pub risk_score: f64,
    pub factor_values: Vec<FactorValue>,
    pub market_conditions: MarketConditionValues,
    pub regulatory_conditions: RegulatoryConditionValues,
    pub polygon_verified: bool,
    pub enforcement_action: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FactorValue {
    pub name: String,
    pub value: f64,
    pub weight: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarketConditionValues {
    pub volatility: f64,
    pub growth_rate: f64,
    pub competition_intensity: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegulatoryConditionValues {
    pub stringency: f64,
    pub change_frequency: f64,
    pub enforcement_probability: f64,
}

/// Aggregated simulation results
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SimulationResult {
    pub scenario_name: String,
    pub iterations: usize,
    pub compliance_statistics: Statistics,
    pub risk_statistics: Statistics,
    pub confidence_intervals: Vec<ConfidenceInterval>,
    pub factor_sensitivities: Vec<FactorSensitivity>,
    pub enforcement_probability: f64,
    pub polygon_verification_rate: f64,
    pub percentiles: Vec<(f64, f64)>,
    pub convergence_achieved: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Statistics {
    pub mean: f64,
    pub median: f64,
    pub std_dev: f64,
    pub min: f64,
    pub max: f64,
    pub skewness: f64,
    pub kurtosis: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConfidenceInterval {
    pub confidence_level: f64,
    pub lower_bound: f64,
    pub upper_bound: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FactorSensitivity {
    pub factor_name: String,
    pub correlation_with_compliance: f64,
    pub impact_magnitude: f64,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_monte_carlo_simulation() {
        let config = MonteCarloConfig {
            iterations: 1000,
            seed: Some(42), // Fixed seed for reproducibility
            ..Default::default()
        };

        let engine = MonteCarloEngine::new(config);

        let scenario = ComplianceScenario {
            name: "Base Compliance Scenario".to_string(),
            compliance_factors: vec![
                ComplianceFactor {
                    name: "Documentation Quality".to_string(),
                    base_value: 0.8,
                    distribution: DistributionType::Beta { alpha: 8.0, beta: 2.0 },
                    weight: 0.3,
                    correlation_factors: vec![("regulatory_stringency".to_string(), -0.2)],
                },
                ComplianceFactor {
                    name: "Process Maturity".to_string(),
                    base_value: 0.7,
                    distribution: DistributionType::Normal { mean: 0.7, std_dev: 0.1 },
                    weight: 0.4,
                    correlation_factors: vec![],
                },
                ComplianceFactor {
                    name: "Training Effectiveness".to_string(),
                    base_value: 0.75,
                    distribution: DistributionType::Uniform { min: 0.6, max: 0.9 },
                    weight: 0.3,
                    correlation_factors: vec![("market_volatility".to_string(), -0.1)],
                },
            ],
            market_conditions: MarketConditions {
                volatility: DistributionType::Beta { alpha: 2.0, beta: 5.0 },
                growth_rate: DistributionType::Normal { mean: 0.05, std_dev: 0.02 },
                competition_intensity: DistributionType::Uniform { min: 0.3, max: 0.7 },
            },
            regulatory_environment: RegulatoryEnvironment {
                stringency: DistributionType::Beta { alpha: 5.0, beta: 3.0 },
                change_frequency: DistributionType::Uniform { min: 0.1, max: 0.3 },
                enforcement_probability: DistributionType::Beta { alpha: 2.0, beta: 8.0 },
            },
            polygon_verification_rate: 0.7,
        };

        let result = engine.simulate_compliance_risk(&scenario).unwrap();

        assert_eq!(result.iterations, 1000);
        assert!(result.compliance_statistics.mean > 0.5);
        assert!(result.compliance_statistics.mean < 1.0);
        assert!(!result.confidence_intervals.is_empty());
        assert!(!result.factor_sensitivities.is_empty());
        assert!(result.polygon_verification_rate > 0.6);
        assert!(result.polygon_verification_rate < 0.8);
    }

    #[test]
    fn test_distribution_sampling() {
        let config = MonteCarloConfig::default();
        let engine = MonteCarloEngine::new(config);
        let mut rng = engine.create_rng();

        // Test normal distribution
        let normal = DistributionType::Normal { mean: 0.5, std_dev: 0.1 };
        let sample = engine.sample_distribution(&normal, &mut rng).unwrap();
        assert!(sample > 0.0); // Very likely to be positive with mean 0.5

        // Test uniform distribution
        let uniform = DistributionType::Uniform { min: 0.2, max: 0.8 };
        let sample = engine.sample_distribution(&uniform, &mut rng).unwrap();
        assert!(sample >= 0.2 && sample <= 0.8);

        // Test beta distribution
        let beta = DistributionType::Beta { alpha: 2.0, beta: 2.0 };
        let sample = engine.sample_distribution(&beta, &mut rng).unwrap();
        assert!(sample >= 0.0 && sample <= 1.0);
    }
}