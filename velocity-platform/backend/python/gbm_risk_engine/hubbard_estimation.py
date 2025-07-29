"""
Hubbard Decision Research (HDR) 5-Point Estimation System
Implementation of Douglas Hubbard's calibrated estimation methodology
"""

import numpy as np
from typing import Dict, List, Optional, Tuple, Any, Union, Callable
from datetime import datetime, timedelta
from enum import Enum
from pydantic import BaseModel, Field
from dataclasses import dataclass
import math
from scipy import stats
import random

class EstimationType(str, Enum):
    """Types of estimates in Hubbard methodology"""
    FREQUENCY = "frequency"
    MAGNITUDE = "magnitude"
    PROBABILITY = "probability"
    DURATION = "duration"
    COST = "cost"
    BENEFIT = "benefit"
    EFFECTIVENESS = "effectiveness"

class CalibrationLevel(str, Enum):
    """Expert calibration levels"""
    UNCALIBRATED = "uncalibrated"
    BASIC = "basic"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class ConfidenceInterval(str, Enum):
    """Standard confidence intervals"""
    CI_50 = "50"
    CI_80 = "80"
    CI_90 = "90"
    CI_95 = "95"
    CI_99 = "99"

@dataclass
class HubbardEstimate:
    """5-Point estimate following Hubbard methodology"""
    parameter_name: str
    estimation_type: EstimationType
    confidence_interval: str  # e.g., "90"
    lower_bound: float  # 5th percentile
    upper_bound: float  # 95th percentile
    median: float  # 50th percentile
    confidence_lower: float  # Lower confidence bound (e.g., 25th percentile)
    confidence_upper: float  # Upper confidence bound (e.g., 75th percentile)
    units: str
    context: str
    estimator_id: str
    calibration_level: CalibrationLevel
    uncertainty_level: float  # 0-1 scale
    created_at: datetime = Field(default_factory=datetime.utcnow)

@dataclass
class ExpertProfile:
    """Expert profile for calibration tracking"""
    expert_id: str
    name: str
    domain_expertise: List[str]
    years_experience: int
    calibration_level: CalibrationLevel
    calibration_score: float  # 0-1 scale
    overconfidence_bias: float  # Tendency to be overconfident
    anchoring_bias: float  # Susceptibility to anchoring
    availability_bias: float  # Availability heuristic influence
    historical_estimates: List[HubbardEstimate] = Field(default_factory=list)
    performance_metrics: Dict[str, float] = Field(default_factory=dict)

@dataclass
class CalibrationResult:
    """Expert calibration assessment result"""
    expert_id: str
    total_estimates: int
    calibration_score: float  # Percentage of actual values within confidence intervals
    overconfidence_score: float  # How often intervals were too narrow
    underconfidence_score: float  # How often intervals were too wide
    bias_indicators: Dict[str, float]
    recommended_adjustments: Dict[str, float]
    calibration_level: CalibrationLevel

@dataclass
class ExpertCalibration:
    """Expert calibration and bias correction system"""
    expert_profiles: Dict[str, ExpertProfile] = Field(default_factory=dict)
    calibration_tests: List[Dict[str, Any]] = Field(default_factory=list)
    group_estimates: Dict[str, List[HubbardEstimate]] = Field(default_factory=dict)

@dataclass
class UncertaintyQuantification:
    """Uncertainty quantification analysis"""
    parameter_name: str
    epistemic_uncertainty: float  # Knowledge uncertainty
    aleatory_uncertainty: float  # Natural variability
    total_uncertainty: float  # Combined uncertainty
    key_uncertainty_drivers: List[str]
    uncertainty_reduction_options: List[Dict[str, Any]]
    information_value_analysis: Dict[str, float]

class HubbardEstimator:
    """
    Implementation of Hubbard's calibrated estimation methodology
    Includes bias correction, expert calibration, and uncertainty quantification
    """
    
    def __init__(self):
        self.expert_profiles: Dict[str, ExpertProfile] = {}
        self.calibration_data = []
        self.bias_correction_factors = self._initialize_bias_corrections()
        self.estimation_templates = self._initialize_templates()
    
    def _initialize_bias_corrections(self) -> Dict[str, Dict[str, float]]:
        """Initialize standard bias correction factors"""
        return {
            "overconfidence": {
                "uncalibrated": 0.3,  # Widen intervals by 30%
                "basic": 0.2,
                "intermediate": 0.1,
                "advanced": 0.05,
                "expert": 0.02
            },
            "anchoring": {
                "high": 0.25,
                "medium": 0.15,
                "low": 0.05
            },
            "availability": {
                "high": 0.2,
                "medium": 0.1,
                "low": 0.05
            }
        }
    
    def _initialize_templates(self) -> Dict[str, Dict[str, Any]]:
        """Initialize estimation templates for different parameter types"""
        return {
            EstimationType.FREQUENCY: {
                "typical_ranges": {
                    "rare_events": (0.01, 1.0),
                    "common_events": (1.0, 100.0),
                    "frequent_events": (100.0, 10000.0)
                },
                "distribution": "lognormal",
                "confidence_default": "90"
            },
            EstimationType.MAGNITUDE: {
                "typical_ranges": {
                    "small": (1000, 100000),
                    "medium": (100000, 1000000),
                    "large": (1000000, 100000000)
                },
                "distribution": "lognormal",
                "confidence_default": "90"
            },
            EstimationType.COST: {
                "typical_ranges": {
                    "low_cost": (1000, 50000),
                    "medium_cost": (50000, 500000),
                    "high_cost": (500000, 10000000)
                },
                "distribution": "lognormal",
                "confidence_default": "80"
            }
        }
    
    def create_expert_profile(
        self,
        expert_id: str,
        name: str,
        domain_expertise: List[str],
        years_experience: int,
        initial_calibration_level: CalibrationLevel = CalibrationLevel.UNCALIBRATED
    ) -> ExpertProfile:
        """Create new expert profile"""
        
        profile = ExpertProfile(
            expert_id=expert_id,
            name=name,
            domain_expertise=domain_expertise,
            years_experience=years_experience,
            calibration_level=initial_calibration_level,
            calibration_score=0.0,
            overconfidence_bias=0.3,  # Default assumption
            anchoring_bias=0.2,
            availability_bias=0.15
        )
        
        self.expert_profiles[expert_id] = profile
        return profile
    
    def guided_estimation_session(
        self,
        expert_id: str,
        parameter_name: str,
        estimation_type: EstimationType,
        context: str,
        confidence_level: str = "90"
    ) -> HubbardEstimate:
        """Conduct guided estimation session with bias reduction techniques"""
        
        expert = self.expert_profiles.get(expert_id)
        if not expert:
            raise ValueError(f"Expert {expert_id} not found")
        
        print(f"\n🎯 Guided Estimation Session")
        print(f"Parameter: {parameter_name}")
        print(f"Type: {estimation_type.value}")
        print(f"Context: {context}")
        print(f"Confidence Level: {confidence_level}%")
        
        # Step 1: Anchoring reduction - consider extreme cases first
        print(f"\n1. Consider extreme cases to avoid anchoring:")
        print(f"   - What would be an extremely low value for {parameter_name}?")
        print(f"   - What would be an extremely high value for {parameter_name}?")
        
        # Step 2: Reference class forecasting
        print(f"\n2. Reference class analysis:")
        print(f"   - What similar situations have you observed?")
        print(f"   - What was the typical range in those cases?")
        
        # Step 3: Decomposition if applicable
        print(f"\n3. Consider breaking down the estimate:")
        print(f"   - What are the key components of {parameter_name}?")
        print(f"   - Can you estimate each component separately?")
        
        # For simulation purposes, generate calibrated estimates
        # In practice, this would collect actual expert input
        base_estimate = self._generate_simulated_expert_estimate(
            estimation_type, expert.calibration_level
        )
        
        # Apply bias corrections
        corrected_estimate = self._apply_bias_corrections(base_estimate, expert)
        
        estimate = HubbardEstimate(
            parameter_name=parameter_name,
            estimation_type=estimation_type,
            confidence_interval=confidence_level,
            lower_bound=corrected_estimate["lower"],
            upper_bound=corrected_estimate["upper"],
            median=corrected_estimate["median"],
            confidence_lower=corrected_estimate["conf_lower"],
            confidence_upper=corrected_estimate["conf_upper"],
            units=corrected_estimate["units"],
            context=context,
            estimator_id=expert_id,
            calibration_level=expert.calibration_level,
            uncertainty_level=corrected_estimate["uncertainty"]
        )
        
        # Store estimate in expert profile
        expert.historical_estimates.append(estimate)
        
        return estimate
    
    def _generate_simulated_expert_estimate(
        self,
        estimation_type: EstimationType,
        calibration_level: CalibrationLevel
    ) -> Dict[str, Any]:
        """Generate simulated expert estimate (for demonstration)"""
        
        template = self.estimation_templates.get(estimation_type, {})
        typical_ranges = template.get("typical_ranges", {"default": (100, 10000)})
        
        # Select a typical range
        range_key = random.choice(list(typical_ranges.keys()))
        min_val, max_val = typical_ranges[range_key]
        
        # Generate base estimate
        median = np.random.uniform(min_val, max_val)
        
        # Calibration affects interval width
        calibration_factors = {
            CalibrationLevel.UNCALIBRATED: 2.0,
            CalibrationLevel.BASIC: 1.5,
            CalibrationLevel.INTERMEDIATE: 1.2,
            CalibrationLevel.ADVANCED: 1.1,
            CalibrationLevel.EXPERT: 1.0
        }
        
        width_factor = calibration_factors[calibration_level]
        
        # Generate 90% confidence interval
        interval_width = median * 0.5 * width_factor  # Base width
        lower = max(0, median - interval_width)
        upper = median + interval_width
        
        # Generate 50% confidence interval
        conf_width = interval_width * 0.4
        conf_lower = median - conf_width
        conf_upper = median + conf_width
        
        return {
            "lower": lower,
            "upper": upper,
            "median": median,
            "conf_lower": conf_lower,
            "conf_upper": conf_upper,
            "units": "dollars" if estimation_type == EstimationType.COST else "count",
            "uncertainty": 1.0 - (1.0 / width_factor)
        }
    
    def _apply_bias_corrections(
        self,
        base_estimate: Dict[str, Any],
        expert: ExpertProfile
    ) -> Dict[str, Any]:
        """Apply bias corrections to raw estimate"""
        
        corrected = base_estimate.copy()
        
        # Overconfidence correction
        overconfidence_factor = self.bias_correction_factors["overconfidence"][expert.calibration_level.value]
        
        interval_width = base_estimate["upper"] - base_estimate["lower"]
        additional_width = interval_width * overconfidence_factor
        
        corrected["lower"] = base_estimate["lower"] - additional_width / 2
        corrected["upper"] = base_estimate["upper"] + additional_width / 2
        
        # Ensure non-negative lower bound for certain types
        if base_estimate["lower"] >= 0:
            corrected["lower"] = max(0, corrected["lower"])
        
        # Anchoring correction (adjust median slightly)
        anchoring_adjustment = (corrected["upper"] - corrected["lower"]) * 0.05 * expert.anchoring_bias
        corrected["median"] += random.uniform(-anchoring_adjustment, anchoring_adjustment)
        
        return corrected
    
    def aggregate_expert_estimates(
        self,
        estimates: List[HubbardEstimate],
        aggregation_method: str = "linear_pooling"
    ) -> HubbardEstimate:
        """Aggregate multiple expert estimates"""
        
        if not estimates:
            raise ValueError("No estimates to aggregate")
        
        if len(estimates) == 1:
            return estimates[0]
        
        # Extract values
        lower_bounds = [est.lower_bound for est in estimates]
        upper_bounds = [est.upper_bound for est in estimates]
        medians = [est.median for est in estimates]
        
        if aggregation_method == "linear_pooling":
            # Simple average (equal weights)
            agg_lower = np.mean(lower_bounds)
            agg_upper = np.mean(upper_bounds)
            agg_median = np.mean(medians)
        
        elif aggregation_method == "weighted_pooling":
            # Weight by calibration level
            weights = []
            calibration_weights = {
                CalibrationLevel.UNCALIBRATED: 1.0,
                CalibrationLevel.BASIC: 1.5,
                CalibrationLevel.INTERMEDIATE: 2.0,
                CalibrationLevel.ADVANCED: 2.5,
                CalibrationLevel.EXPERT: 3.0
            }
            
            for est in estimates:
                weights.append(calibration_weights[est.calibration_level])
            
            weights = np.array(weights) / np.sum(weights)
            
            agg_lower = np.average(lower_bounds, weights=weights)
            agg_upper = np.average(upper_bounds, weights=weights)
            agg_median = np.average(medians, weights=weights)
        
        elif aggregation_method == "logarithmic_pooling":
            # Multiplicative aggregation (geometric mean)
            agg_lower = stats.gmean([max(0.01, x) for x in lower_bounds])
            agg_upper = stats.gmean([max(0.01, x) for x in upper_bounds])
            agg_median = stats.gmean([max(0.01, x) for x in medians])
        
        else:
            raise ValueError(f"Unknown aggregation method: {aggregation_method}")
        
        # Calculate aggregated confidence bounds
        conf_lower = agg_median - (agg_median - agg_lower) * 0.5
        conf_upper = agg_median + (agg_upper - agg_median) * 0.5
        
        return HubbardEstimate(
            parameter_name=f"Aggregated_{estimates[0].parameter_name}",
            estimation_type=estimates[0].estimation_type,
            confidence_interval=estimates[0].confidence_interval,
            lower_bound=agg_lower,
            upper_bound=agg_upper,
            median=agg_median,
            confidence_lower=conf_lower,
            confidence_upper=conf_upper,
            units=estimates[0].units,
            context=f"Aggregated from {len(estimates)} experts",
            estimator_id="aggregated",
            calibration_level=CalibrationLevel.INTERMEDIATE,
            uncertainty_level=np.mean([est.uncertainty_level for est in estimates])
        )
    
    def calibrate_expert(
        self,
        expert_id: str,
        calibration_questions: List[Dict[str, Any]],
        actual_values: List[float]
    ) -> CalibrationResult:
        """Calibrate expert using known outcomes"""
        
        expert = self.expert_profiles.get(expert_id)
        if not expert:
            raise ValueError(f"Expert {expert_id} not found")
        
        if len(calibration_questions) != len(actual_values):
            raise ValueError("Number of questions must match number of actual values")
        
        # Analyze calibration performance
        within_intervals = 0
        too_narrow = 0
        too_wide = 0
        
        for question, actual in zip(calibration_questions, actual_values):
            lower = question["lower_bound"]
            upper = question["upper_bound"]
            confidence = float(question.get("confidence", "90"))
            
            if lower <= actual <= upper:
                within_intervals += 1
            elif actual < lower or actual > upper:
                # Check if interval was too narrow
                interval_width = upper - lower
                expected_width = abs(actual - (lower + upper) / 2) * 2 / (confidence / 100)
                
                if interval_width < expected_width * 0.8:
                    too_narrow += 1
                else:
                    too_wide += 1
        
        total_questions = len(calibration_questions)
        calibration_score = within_intervals / total_questions
        
        # Update expert calibration level
        if calibration_score >= 0.9:
            new_level = CalibrationLevel.EXPERT
        elif calibration_score >= 0.8:
            new_level = CalibrationLevel.ADVANCED
        elif calibration_score >= 0.7:
            new_level = CalibrationLevel.INTERMEDIATE
        elif calibration_score >= 0.6:
            new_level = CalibrationLevel.BASIC
        else:
            new_level = CalibrationLevel.UNCALIBRATED
        
        expert.calibration_level = new_level
        expert.calibration_score = calibration_score
        
        # Calculate bias indicators
        overconfidence = too_narrow / total_questions
        underconfidence = too_wide / total_questions
        
        bias_indicators = {
            "overconfidence": overconfidence,
            "underconfidence": underconfidence,
            "anchoring_tendency": expert.anchoring_bias,
            "availability_bias": expert.availability_bias
        }
        
        # Generate recommendations
        recommendations = {}
        if overconfidence > 0.3:
            recommendations["interval_adjustment"] = 1.2  # Widen intervals by 20%
        if underconfidence > 0.3:
            recommendations["interval_adjustment"] = 0.8  # Narrow intervals by 20%
        
        result = CalibrationResult(
            expert_id=expert_id,
            total_estimates=total_questions,
            calibration_score=calibration_score,
            overconfidence_score=overconfidence,
            underconfidence_score=underconfidence,
            bias_indicators=bias_indicators,
            recommended_adjustments=recommendations,
            calibration_level=new_level
        )
        
        # Store calibration data
        self.calibration_data.append(result)
        
        return result
    
    def quantify_uncertainty(
        self,
        estimates: List[HubbardEstimate],
        historical_data: Optional[List[float]] = None,
        subject_matter_expert_input: Optional[Dict[str, Any]] = None
    ) -> UncertaintyQuantification:
        """Quantify epistemic and aleatory uncertainty"""
        
        if not estimates:
            raise ValueError("At least one estimate is required")
        
        parameter_name = estimates[0].parameter_name
        
        # Calculate epistemic uncertainty (knowledge uncertainty)
        # Based on disagreement between experts and confidence intervals
        if len(estimates) > 1:
            medians = [est.median for est in estimates]
            coefficient_of_variation = np.std(medians) / np.mean(medians) if np.mean(medians) > 0 else 0
            
            # Average interval width as proxy for epistemic uncertainty
            avg_interval_width = np.mean([(est.upper_bound - est.lower_bound) / est.median 
                                         for est in estimates if est.median > 0])
            
            epistemic_uncertainty = min(1.0, (coefficient_of_variation + avg_interval_width) / 2)
        else:
            # Single estimate - use interval width
            est = estimates[0]
            interval_width = (est.upper_bound - est.lower_bound) / est.median if est.median > 0 else 1.0
            epistemic_uncertainty = min(1.0, interval_width)
        
        # Calculate aleatory uncertainty (natural variability)
        if historical_data:
            historical_cv = np.std(historical_data) / np.mean(historical_data) if np.mean(historical_data) > 0 else 0
            aleatory_uncertainty = min(1.0, historical_cv)
        else:
            # Estimate based on parameter type
            type_based_uncertainty = {
                EstimationType.FREQUENCY: 0.3,
                EstimationType.MAGNITUDE: 0.4,
                EstimationType.COST: 0.2,
                EstimationType.PROBABILITY: 0.1,
                EstimationType.EFFECTIVENESS: 0.2
            }
            aleatory_uncertainty = type_based_uncertainty.get(estimates[0].estimation_type, 0.3)
        
        # Total uncertainty (not simply additive)
        total_uncertainty = math.sqrt(epistemic_uncertainty**2 + aleatory_uncertainty**2)
        
        # Identify key uncertainty drivers
        uncertainty_drivers = []
        if epistemic_uncertainty > 0.3:
            uncertainty_drivers.append("Limited knowledge/data")
        if aleatory_uncertainty > 0.3:
            uncertainty_drivers.append("High natural variability")
        if len(estimates) > 1 and coefficient_of_variation > 0.2:
            uncertainty_drivers.append("Expert disagreement")
        
        # Uncertainty reduction options
        reduction_options = []
        if epistemic_uncertainty > aleatory_uncertainty:
            reduction_options.extend([
                {"option": "Additional data collection", "potential_reduction": epistemic_uncertainty * 0.4},
                {"option": "Expert calibration", "potential_reduction": epistemic_uncertainty * 0.3},
                {"option": "Reference class forecasting", "potential_reduction": epistemic_uncertainty * 0.2}
            ])
        else:
            reduction_options.extend([
                {"option": "Statistical modeling", "potential_reduction": aleatory_uncertainty * 0.3},
                {"option": "Conditional forecasting", "potential_reduction": aleatory_uncertainty * 0.2}
            ])
        
        # Information value analysis (simplified)
        info_value = {}
        if total_uncertainty > 0.5:
            info_value["high_value_information"] = total_uncertainty * 100000  # Example dollar value
        else:
            info_value["low_value_information"] = total_uncertainty * 10000
        
        return UncertaintyQuantification(
            parameter_name=parameter_name,
            epistemic_uncertainty=epistemic_uncertainty,
            aleatory_uncertainty=aleatory_uncertainty,
            total_uncertainty=total_uncertainty,
            key_uncertainty_drivers=uncertainty_drivers,
            uncertainty_reduction_options=reduction_options,
            information_value_analysis=info_value
        )
    
    def convert_to_distribution(
        self,
        estimate: HubbardEstimate,
        distribution_type: str = "beta_pert"
    ) -> Dict[str, Any]:
        """Convert 5-point estimate to probability distribution"""
        
        if distribution_type == "beta_pert":
            # Beta-PERT distribution using 5-point estimates
            # Modified PERT using lower, median, upper bounds
            a = estimate.lower_bound
            b = estimate.upper_bound
            c = estimate.median
            
            # Calculate Beta-PERT parameters
            mu = (a + 4*c + b) / 6
            sigma_sq = ((b - a) / 6) ** 2
            
            # Convert to beta distribution parameters
            if sigma_sq > 0:
                range_val = b - a
                alpha = ((mu - a) * (2*c - a - b)) / (sigma_sq * range_val)
                beta = (alpha * (b - mu)) / (mu - a)
            else:
                alpha = beta = 1
            
            return {
                "distribution": "beta_pert",
                "parameters": {
                    "alpha": max(0.1, alpha),
                    "beta": max(0.1, beta),
                    "lower": a,
                    "upper": b,
                    "mode": c
                },
                "moments": {
                    "mean": mu,
                    "variance": sigma_sq
                }
            }
        
        elif distribution_type == "lognormal":
            # Lognormal distribution from median and bounds
            if estimate.median <= 0:
                raise ValueError("Median must be positive for lognormal distribution")
            
            # Use median and geometric standard deviation
            geo_std = math.sqrt(estimate.upper_bound / estimate.lower_bound)
            
            mu = math.log(estimate.median)
            sigma = math.log(geo_std) / 1.645  # 90% confidence interval
            
            return {
                "distribution": "lognormal",
                "parameters": {
                    "mu": mu,
                    "sigma": sigma
                },
                "moments": {
                    "median": estimate.median,
                    "geometric_std": geo_std
                }
            }
        
        elif distribution_type == "triangular":
            # Triangular distribution
            return {
                "distribution": "triangular",
                "parameters": {
                    "lower": estimate.lower_bound,
                    "mode": estimate.median,
                    "upper": estimate.upper_bound
                }
            }
        
        else:
            raise ValueError(f"Unsupported distribution type: {distribution_type}")
    
    def sensitivity_analysis(
        self,
        base_estimates: Dict[str, HubbardEstimate],
        model_function: Callable[[Dict[str, float]], float],
        perturbation_percentage: float = 0.1
    ) -> Dict[str, float]:
        """Perform sensitivity analysis on estimates"""
        
        # Calculate base case
        base_values = {name: est.median for name, est in base_estimates.items()}
        base_result = model_function(base_values)
        
        sensitivities = {}
        
        for param_name, estimate in base_estimates.items():
            # Perturb parameter
            perturbed_values = base_values.copy()
            perturbation = estimate.median * perturbation_percentage
            perturbed_values[param_name] = estimate.median + perturbation
            
            # Calculate perturbed result
            perturbed_result = model_function(perturbed_values)
            
            # Calculate sensitivity
            sensitivity = (perturbed_result - base_result) / (perturbation / base_result) if base_result != 0 else 0
            sensitivities[param_name] = sensitivity
        
        return sensitivities

# Utility functions for Hubbard methodology

def create_calibration_test() -> List[Dict[str, Any]]:
    """Create a set of calibration questions for expert training"""
    
    questions = [
        {
            "question": "What is the population of Tokyo (in millions)?",
            "lower_bound": 8,
            "upper_bound": 15,
            "confidence": "90",
            "actual_value": 13.96
        },
        {
            "question": "In what year was the first iPhone released?",
            "lower_bound": 2005,
            "upper_bound": 2009,
            "confidence": "90", 
            "actual_value": 2007
        },
        {
            "question": "What is the approximate speed of light (million meters per second)?",
            "lower_bound": 250,
            "upper_bound": 350,
            "confidence": "90",
            "actual_value": 299.79
        }
    ]
    
    return questions

def generate_estimation_template(
    parameter_type: EstimationType,
    context: str
) -> Dict[str, Any]:
    """Generate estimation template for guided sessions"""
    
    templates = {
        EstimationType.FREQUENCY: {
            "prompt": f"How often do you expect {context} to occur per year?",
            "guidance": [
                "Consider historical frequency if available",
                "Think about similar events in your experience",
                "Consider any changes in conditions that might affect frequency"
            ],
            "typical_biases": ["availability", "recency"],
            "calibration_questions": [
                "What's the lowest frequency you could imagine?",
                "What's the highest frequency that's still plausible?",
                "What frequency would you bet on if you had to?"
            ]
        },
        EstimationType.COST: {
            "prompt": f"What do you expect the cost of {context} to be?",
            "guidance": [
                "Break down into components if possible",
                "Consider direct and indirect costs",
                "Think about cost escalation factors"
            ],
            "typical_biases": ["anchoring", "planning_fallacy"],
            "calibration_questions": [
                "What's the minimum cost if everything goes right?",
                "What's the maximum cost if things go wrong?",
                "What cost would you use for budgeting?"
            ]
        }
    }
    
    return templates.get(parameter_type, {})

def calculate_information_value(
    current_uncertainty: float,
    potential_uncertainty_reduction: float,
    decision_value: float
) -> float:
    """Calculate expected value of perfect information (EVPI)"""
    
    # Simplified EVPI calculation
    uncertainty_reduction = min(current_uncertainty, potential_uncertainty_reduction)
    information_value = decision_value * uncertainty_reduction
    
    return information_value