"""
FAIR (Factor Analysis of Information Risk) Integration
Advanced risk quantification using FAIR methodology with GBM simulations
"""

import numpy as np
from typing import Dict, List, Optional, Tuple, Any, Union
from datetime import datetime, timedelta
from enum import Enum
from pydantic import BaseModel, Field
from dataclasses import dataclass
import math
import random
from scipy import stats

from .gbm_simulator import GBMSimulator, GBMParameters, GBMResult

class ThreatType(str, Enum):
    """Types of threat events in FAIR analysis"""
    CYBER_ATTACK = "cyber_attack"
    DATA_BREACH = "data_breach"
    OPERATIONAL_ERROR = "operational_error"
    NATURAL_DISASTER = "natural_disaster"
    REGULATORY_VIOLATION = "regulatory_violation"
    FRAUD = "fraud"
    SUPPLY_CHAIN = "supply_chain"
    REPUTATIONAL = "reputational"

class LossType(str, Enum):
    """Types of losses in FAIR methodology"""
    PRIMARY_LOSS = "primary_loss"
    SECONDARY_LOSS = "secondary_loss"
    RESPONSE_COST = "response_cost"
    REPLACEMENT_COST = "replacement_cost"
    PRODUCTIVITY_LOSS = "productivity_loss"
    COMPETITIVE_ADVANTAGE_LOSS = "competitive_advantage_loss"
    FINES_JUDGMENTS = "fines_judgments"
    REPUTATION_LOSS = "reputation_loss"

class ControlType(str, Enum):
    """Types of security controls"""
    PREVENTIVE = "preventive"
    DETECTIVE = "detective"
    RESPONSIVE = "responsive"
    COMPENSATING = "compensating"

@dataclass
class ThreatEventFrequency:
    """Threat event frequency parameters"""
    min_frequency: float  # Minimum events per year
    most_likely_frequency: float  # Most likely events per year
    max_frequency: float  # Maximum events per year
    distribution: str = "triangular"  # Distribution type
    confidence_level: float = 0.90  # Confidence in estimates

@dataclass
class LossMagnitude:
    """Loss magnitude parameters using GBM"""
    loss_type: LossType
    gbm_parameters: GBMParameters
    minimum_loss: float
    maximum_loss: float
    loss_distribution: str = "lognormal"

@dataclass
class ControlEffectiveness:
    """Security control effectiveness parameters"""
    control_type: ControlType
    effectiveness_percentage: float  # 0.0 to 1.0
    confidence_level: float
    degradation_rate: float = 0.0  # Annual degradation
    implementation_quality: float = 1.0  # Implementation quality factor

@dataclass
class FAIRParameters:
    """Complete FAIR risk analysis parameters"""
    threat_type: ThreatType
    threat_event_frequency: ThreatEventFrequency
    primary_loss: LossMagnitude
    secondary_loss: Optional[LossMagnitude] = None
    controls: List[ControlEffectiveness] = Field(default_factory=list)
    vulnerability_score: float = 0.5  # 0.0 to 1.0
    threat_capability: float = 0.5  # 0.0 to 1.0
    organizational_resilience: float = 0.5  # 0.0 to 1.0

@dataclass
class ThreatEventModel:
    """Threat event probability model"""
    base_frequency: float
    adjusted_frequency: float
    vulnerability_factor: float
    threat_capability_factor: float
    control_effectiveness_factor: float
    environmental_factors: Dict[str, float]

@dataclass
class FAIRResult:
    """FAIR analysis result"""
    threat_type: ThreatType
    annual_loss_expectancy: float  # ALE
    var_95: float  # Value at Risk at 95%
    var_99: float  # Value at Risk at 99%
    expected_shortfall: float  # Conditional VaR
    risk_score: str  # LOW, MEDIUM, HIGH, CRITICAL
    risk_rating: float  # 1-10 scale
    confidence_interval: Tuple[float, float]  # 90% confidence interval
    loss_exceedance_curve: List[Tuple[float, float]]  # Loss amounts and probabilities
    primary_loss_contribution: float  # Percentage of total risk
    secondary_loss_contribution: float  # Percentage of total risk
    control_effectiveness_summary: Dict[str, float]
    recommendations: List[str]
    simulation_metadata: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FAIRRiskEngine:
    """
    FAIR (Factor Analysis of Information Risk) implementation
    Integrates with GBM simulations for advanced loss modeling
    """
    
    def __init__(self, gbm_simulator: Optional[GBMSimulator] = None):
        self.gbm_simulator = gbm_simulator or GBMSimulator()
        self.risk_taxonomy = self._initialize_risk_taxonomy()
        self.control_effectiveness_models = self._initialize_control_models()
    
    def _initialize_risk_taxonomy(self) -> Dict[str, Any]:
        """Initialize FAIR risk taxonomy"""
        return {
            "threat_communities": {
                ThreatType.CYBER_ATTACK: {
                    "capability_levels": ["script_kiddie", "organized_crime", "nation_state"],
                    "typical_frequency": {"min": 0.5, "most_likely": 2.0, "max": 12.0},
                    "impact_multipliers": {"low": 0.5, "medium": 1.0, "high": 2.0}
                },
                ThreatType.DATA_BREACH: {
                    "capability_levels": ["insider", "external_hacker", "organized_group"],
                    "typical_frequency": {"min": 0.1, "most_likely": 0.5, "max": 3.0},
                    "impact_multipliers": {"low": 1.0, "medium": 3.0, "high": 10.0}
                },
                ThreatType.OPERATIONAL_ERROR: {
                    "capability_levels": ["human_error", "process_failure", "system_failure"],
                    "typical_frequency": {"min": 2.0, "most_likely": 8.0, "max": 24.0},
                    "impact_multipliers": {"low": 0.3, "medium": 1.0, "high": 3.0}
                }
            },
            "loss_forms": {
                LossType.RESPONSE_COST: {"typical_range": (10000, 500000)},
                LossType.REPLACEMENT_COST: {"typical_range": (50000, 2000000)},
                LossType.PRODUCTIVITY_LOSS: {"typical_range": (25000, 1000000)},
                LossType.FINES_JUDGMENTS: {"typical_range": (100000, 50000000)},
                LossType.REPUTATION_LOSS: {"typical_range": (500000, 100000000)}
            }
        }
    
    def _initialize_control_models(self) -> Dict[str, Any]:
        """Initialize control effectiveness models"""
        return {
            ControlType.PREVENTIVE: {
                "effectiveness_range": (0.6, 0.95),
                "degradation_factors": {"low": 0.05, "medium": 0.10, "high": 0.20}
            },
            ControlType.DETECTIVE: {
                "effectiveness_range": (0.4, 0.85),
                "degradation_factors": {"low": 0.03, "medium": 0.08, "high": 0.15}
            },
            ControlType.RESPONSIVE: {
                "effectiveness_range": (0.3, 0.75),
                "degradation_factors": {"low": 0.02, "medium": 0.05, "high": 0.12}
            }
        }
    
    def generate_threat_event_frequency(
        self, 
        frequency_params: ThreatEventFrequency
    ) -> np.ndarray:
        """Generate threat event frequency distribution"""
        
        if frequency_params.distribution == "triangular":
            # Triangular distribution
            samples = np.random.triangular(
                frequency_params.min_frequency,
                frequency_params.most_likely_frequency,
                frequency_params.max_frequency,
                size=10000
            )
        
        elif frequency_params.distribution == "lognormal":
            # Lognormal distribution
            mu = math.log(frequency_params.most_likely_frequency)
            sigma = (math.log(frequency_params.max_frequency) - math.log(frequency_params.min_frequency)) / 4
            samples = np.random.lognormal(mu, sigma, size=10000)
            
        elif frequency_params.distribution == "poisson":
            # Poisson distribution
            lam = frequency_params.most_likely_frequency
            samples = np.random.poisson(lam, size=10000)
            
        else:
            # Default to triangular
            samples = np.random.triangular(
                frequency_params.min_frequency,
                frequency_params.most_likely_frequency,
                frequency_params.max_frequency,
                size=10000
            )
        
        return np.maximum(0, samples)  # Ensure non-negative
    
    def simulate_loss_magnitude(
        self, 
        loss_params: LossMagnitude,
        num_simulations: int = 10000
    ) -> GBMResult:
        """Simulate loss magnitude using GBM"""
        
        # Configure GBM parameters for loss simulation
        gbm_params = GBMParameters(
            initial_price=loss_params.gbm_parameters.initial_price,
            drift=loss_params.gbm_parameters.drift,
            volatility=loss_params.gbm_parameters.volatility,
            time_horizon=loss_params.gbm_parameters.time_horizon,
            time_steps=loss_params.gbm_parameters.time_steps,
            num_simulations=num_simulations,
            simulation_type=loss_params.gbm_parameters.simulation_type
        )
        
        # Run GBM simulation
        gbm_result = self.gbm_simulator.run_simulation(gbm_params)
        
        # Apply loss magnitude constraints
        final_prices = np.array(gbm_result.path_statistics.final_prices)
        
        # Constrain to minimum and maximum loss bounds
        constrained_losses = np.clip(
            final_prices, 
            loss_params.minimum_loss, 
            loss_params.maximum_loss
        )
        
        # Update result with constrained losses
        gbm_result.path_statistics.final_prices = constrained_losses.tolist()
        
        return gbm_result
    
    def calculate_control_effectiveness(
        self, 
        controls: List[ControlEffectiveness],
        threat_type: ThreatType
    ) -> float:
        """Calculate combined control effectiveness"""
        
        if not controls:
            return 0.0
        
        # Calculate individual control effectiveness
        individual_effectiveness = []
        
        for control in controls:
            # Base effectiveness
            base_effectiveness = control.effectiveness_percentage
            
            # Apply implementation quality factor
            quality_adjusted = base_effectiveness * control.implementation_quality
            
            # Apply degradation if applicable
            if control.degradation_rate > 0:
                # Assume 1 year for simplicity
                degraded_effectiveness = quality_adjusted * (1 - control.degradation_rate)
            else:
                degraded_effectiveness = quality_adjusted
            
            # Apply confidence factor
            confidence_adjusted = degraded_effectiveness * control.confidence_level
            
            individual_effectiveness.append(confidence_adjusted)
        
        # Combine multiple controls (not simply additive due to overlaps)
        if len(individual_effectiveness) == 1:
            combined_effectiveness = individual_effectiveness[0]
        else:
            # Use multiplicative model for independent controls
            combined_failure_rate = 1.0
            for effectiveness in individual_effectiveness:
                combined_failure_rate *= (1 - effectiveness)
            
            combined_effectiveness = 1 - combined_failure_rate
        
        return min(combined_effectiveness, 0.99)  # Cap at 99%
    
    def calculate_vulnerability_score(
        self,
        threat_capability: float,
        organizational_resilience: float,
        control_effectiveness: float
    ) -> float:
        """Calculate vulnerability score"""
        
        # Base vulnerability from threat capability vs organizational resilience
        base_vulnerability = threat_capability / (organizational_resilience + 0.1)  # Add small constant to avoid division by zero
        
        # Adjust for control effectiveness
        adjusted_vulnerability = base_vulnerability * (1 - control_effectiveness)
        
        # Normalize to 0-1 scale
        vulnerability_score = min(adjusted_vulnerability / 2.0, 1.0)
        
        return vulnerability_score
    
    def create_threat_event_model(
        self, 
        params: FAIRParameters
    ) -> ThreatEventModel:
        """Create comprehensive threat event model"""
        
        # Base frequency from threat type
        base_freq = params.threat_event_frequency.most_likely_frequency
        
        # Calculate control effectiveness
        control_effectiveness = self.calculate_control_effectiveness(params.controls, params.threat_type)
        
        # Calculate vulnerability
        vulnerability = self.calculate_vulnerability_score(
            params.threat_capability,
            params.organizational_resilience,
            control_effectiveness
        )
        
        # Adjust frequency based on factors
        threat_capability_factor = 0.5 + params.threat_capability  # Scale from 0.5 to 1.5
        vulnerability_factor = 0.5 + vulnerability  # Scale from 0.5 to 1.5
        control_effectiveness_factor = 1 - control_effectiveness  # Invert so higher effectiveness = lower frequency
        
        adjusted_frequency = (
            base_freq * 
            threat_capability_factor * 
            vulnerability_factor * 
            (0.1 + control_effectiveness_factor)  # Ensure minimum multiplier
        )
        
        return ThreatEventModel(
            base_frequency=base_freq,
            adjusted_frequency=adjusted_frequency,
            vulnerability_factor=vulnerability_factor,
            threat_capability_factor=threat_capability_factor,
            control_effectiveness_factor=control_effectiveness_factor,
            environmental_factors={}  # Could include industry, geography, etc.
        )
    
    def calculate_annual_loss_expectancy(
        self,
        frequency_samples: np.ndarray,
        primary_loss_samples: np.ndarray,
        secondary_loss_samples: Optional[np.ndarray] = None
    ) -> Tuple[float, np.ndarray]:
        """Calculate Annual Loss Expectancy (ALE)"""
        
        # Combine primary and secondary losses
        if secondary_loss_samples is not None:
            total_loss_samples = primary_loss_samples + secondary_loss_samples
        else:
            total_loss_samples = primary_loss_samples
        
        # Calculate ALE for each simulation
        ale_samples = frequency_samples * total_loss_samples
        
        # Expected ALE
        expected_ale = np.mean(ale_samples)
        
        return expected_ale, ale_samples
    
    def generate_loss_exceedance_curve(
        self, 
        loss_samples: np.ndarray,
        percentiles: Optional[List[float]] = None
    ) -> List[Tuple[float, float]]:
        """Generate loss exceedance curve"""
        
        if percentiles is None:
            percentiles = [99.9, 99.5, 99.0, 95.0, 90.0, 75.0, 50.0, 25.0, 10.0, 5.0, 1.0, 0.1]
        
        curve_points = []
        
        for percentile in percentiles:
            loss_amount = np.percentile(loss_samples, percentile)
            exceedance_probability = (100 - percentile) / 100
            curve_points.append((loss_amount, exceedance_probability))
        
        return sorted(curve_points)
    
    def determine_risk_rating(self, ale: float, var_99: float) -> Tuple[str, float]:
        """Determine risk rating and score"""
        
        # Risk thresholds (would be configurable in production)
        critical_threshold = 10000000  # $10M
        high_threshold = 1000000      # $1M
        medium_threshold = 100000     # $100K
        
        # Use the higher of ALE or VaR for rating
        risk_value = max(ale, var_99)
        
        if risk_value >= critical_threshold:
            return "CRITICAL", min(10.0, 7.0 + 3.0 * (risk_value / critical_threshold))
        elif risk_value >= high_threshold:
            return "HIGH", min(7.0, 5.0 + 2.0 * (risk_value / high_threshold))
        elif risk_value >= medium_threshold:
            return "MEDIUM", min(5.0, 3.0 + 2.0 * (risk_value / medium_threshold))
        else:
            return "LOW", min(3.0, 1.0 + 2.0 * (risk_value / medium_threshold))
    
    def generate_recommendations(
        self, 
        params: FAIRParameters,
        result: Dict[str, Any]
    ) -> List[str]:
        """Generate risk treatment recommendations"""
        
        recommendations = []
        
        # Control-based recommendations
        current_effectiveness = self.calculate_control_effectiveness(params.controls, params.threat_type)
        
        if current_effectiveness < 0.7:
            recommendations.append("Enhance security controls - current effectiveness below 70%")
        
        if result["risk_score"] in ["HIGH", "CRITICAL"]:
            recommendations.append("Consider risk transfer options (insurance, outsourcing)")
            recommendations.append("Implement additional preventive controls")
            
        if result["secondary_loss_contribution"] > 60:
            recommendations.append("Focus on secondary loss prevention (reputation, regulatory)")
            
        # Threat-specific recommendations
        if params.threat_type == ThreatType.CYBER_ATTACK:
            recommendations.extend([
                "Implement advanced threat detection capabilities",
                "Enhance employee security awareness training",
                "Consider cyber insurance coverage"
            ])
        elif params.threat_type == ThreatType.DATA_BREACH:
            recommendations.extend([
                "Implement data loss prevention (DLP) solutions",
                "Enhance data encryption and access controls",
                "Develop incident response procedures"
            ])
        
        # Frequency-based recommendations
        if result["threat_event_model"].adjusted_frequency > 5:
            recommendations.append("High threat frequency - prioritize preventive controls")
        
        return recommendations
    
    def run_fair_analysis(self, params: FAIRParameters) -> FAIRResult:
        """Run complete FAIR risk analysis"""
        
        start_time = datetime.now()
        
        # Generate threat event model
        threat_model = self.create_threat_event_model(params)
        
        # Generate frequency distribution
        frequency_samples = self.generate_threat_event_frequency(params.threat_event_frequency)
        frequency_samples *= threat_model.adjusted_frequency / params.threat_event_frequency.most_likely_frequency
        
        # Simulate primary loss magnitude
        primary_loss_result = self.simulate_loss_magnitude(params.primary_loss)
        primary_loss_samples = np.array(primary_loss_result.path_statistics.final_prices)
        
        # Simulate secondary loss magnitude if provided
        secondary_loss_samples = None
        if params.secondary_loss:
            secondary_loss_result = self.simulate_loss_magnitude(params.secondary_loss)
            secondary_loss_samples = np.array(secondary_loss_result.path_statistics.final_prices)
        
        # Calculate Annual Loss Expectancy
        ale, ale_samples = self.calculate_annual_loss_expectancy(
            frequency_samples[:len(primary_loss_samples)],  # Match sample sizes
            primary_loss_samples,
            secondary_loss_samples
        )
        
        # Calculate risk metrics
        var_95 = np.percentile(ale_samples, 95)
        var_99 = np.percentile(ale_samples, 99)
        expected_shortfall = np.mean(ale_samples[ale_samples >= var_95])
        
        # Calculate confidence interval
        confidence_interval = (np.percentile(ale_samples, 5), np.percentile(ale_samples, 95))
        
        # Generate loss exceedance curve
        loss_curve = self.generate_loss_exceedance_curve(ale_samples)
        
        # Calculate loss contributions
        primary_contribution = np.mean(primary_loss_samples) / (np.mean(primary_loss_samples) + 
                                                               (np.mean(secondary_loss_samples) if secondary_loss_samples is not None else 0)) * 100
        secondary_contribution = 100 - primary_contribution if secondary_loss_samples is not None else 0
        
        # Determine risk rating
        risk_score, risk_rating = self.determine_risk_rating(ale, var_99)
        
        # Control effectiveness summary
        control_summary = {}
        for i, control in enumerate(params.controls):
            control_summary[f"control_{i+1}_{control.control_type.value}"] = control.effectiveness_percentage
        
        # Generate recommendations
        temp_result = {
            "risk_score": risk_score,
            "secondary_loss_contribution": secondary_contribution,
            "threat_event_model": threat_model
        }
        recommendations = self.generate_recommendations(params, temp_result)
        
        # Simulation metadata
        execution_time = (datetime.now() - start_time).total_seconds()
        metadata = {
            "execution_time_seconds": execution_time,
            "primary_loss_simulations": len(primary_loss_samples),
            "frequency_simulations": len(frequency_samples),
            "ale_simulations": len(ale_samples),
            "threat_model": threat_model.__dict__,
            "gbm_performance": primary_loss_result.simulation_metadata
        }
        
        return FAIRResult(
            threat_type=params.threat_type,
            annual_loss_expectancy=ale,
            var_95=var_95,
            var_99=var_99,
            expected_shortfall=expected_shortfall,
            risk_score=risk_score,
            risk_rating=risk_rating,
            confidence_interval=confidence_interval,
            loss_exceedance_curve=loss_curve,
            primary_loss_contribution=primary_contribution,
            secondary_loss_contribution=secondary_contribution,
            control_effectiveness_summary=control_summary,
            recommendations=recommendations,
            simulation_metadata=metadata
        )
    
    def compare_scenarios(
        self, 
        base_scenario: FAIRParameters,
        alternative_scenarios: List[Tuple[str, FAIRParameters]]
    ) -> Dict[str, Any]:
        """Compare multiple FAIR scenarios"""
        
        # Run base scenario
        base_result = self.run_fair_analysis(base_scenario)
        
        # Run alternative scenarios
        scenario_results = {"base": base_result}
        
        for scenario_name, scenario_params in alternative_scenarios:
            result = self.run_fair_analysis(scenario_params)
            scenario_results[scenario_name] = result
        
        # Calculate comparisons
        comparison = {
            "scenarios": scenario_results,
            "ale_comparison": {
                name: result.annual_loss_expectancy 
                for name, result in scenario_results.items()
            },
            "risk_reduction_analysis": {},
            "cost_benefit_ratios": {}
        }
        
        # Calculate risk reductions relative to base
        base_ale = base_result.annual_loss_expectancy
        
        for name, result in scenario_results.items():
            if name != "base":
                risk_reduction = base_ale - result.annual_loss_expectancy
                risk_reduction_pct = (risk_reduction / base_ale * 100) if base_ale > 0 else 0
                
                comparison["risk_reduction_analysis"][name] = {
                    "absolute_reduction": risk_reduction,
                    "percentage_reduction": risk_reduction_pct,
                    "residual_risk": result.annual_loss_expectancy
                }
        
        return comparison

# Utility functions for FAIR analysis

def create_standard_threat_scenarios() -> Dict[str, FAIRParameters]:
    """Create standard threat scenarios for common risk types"""
    
    scenarios = {}
    
    # Cyber Attack Scenario
    scenarios["cyber_attack"] = FAIRParameters(
        threat_type=ThreatType.CYBER_ATTACK,
        threat_event_frequency=ThreatEventFrequency(
            min_frequency=0.5,
            most_likely_frequency=2.0,
            max_frequency=8.0
        ),
        primary_loss=LossMagnitude(
            loss_type=LossType.RESPONSE_COST,
            gbm_parameters=GBMParameters(
                initial_price=100000,
                drift=0.05,
                volatility=0.3,
                time_horizon=1.0,
                time_steps=12,
                num_simulations=10000
            ),
            minimum_loss=10000,
            maximum_loss=2000000
        ),
        secondary_loss=LossMagnitude(
            loss_type=LossType.REPUTATION_LOSS,
            gbm_parameters=GBMParameters(
                initial_price=500000,
                drift=0.1,
                volatility=0.5,
                time_horizon=1.0,
                time_steps=12,
                num_simulations=10000
            ),
            minimum_loss=50000,
            maximum_loss=10000000
        ),
        vulnerability_score=0.6,
        threat_capability=0.7,
        organizational_resilience=0.5
    )
    
    # Data Breach Scenario
    scenarios["data_breach"] = FAIRParameters(
        threat_type=ThreatType.DATA_BREACH,
        threat_event_frequency=ThreatEventFrequency(
            min_frequency=0.1,
            most_likely_frequency=0.5,
            max_frequency=2.0
        ),
        primary_loss=LossMagnitude(
            loss_type=LossType.FINES_JUDGMENTS,
            gbm_parameters=GBMParameters(
                initial_price=1000000,
                drift=0.08,
                volatility=0.4,
                time_horizon=1.0,
                time_steps=12,
                num_simulations=10000
            ),
            minimum_loss=100000,
            maximum_loss=50000000
        ),
        vulnerability_score=0.4,
        threat_capability=0.6,
        organizational_resilience=0.6
    )
    
    return scenarios