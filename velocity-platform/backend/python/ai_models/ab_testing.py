"""
AI Model A/B Testing Framework
Statistical testing framework for comparing AI model performance and making data-driven decisions
"""

import asyncio
import time
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple, Callable
from enum import Enum
from pydantic import BaseModel, Field
from dataclasses import dataclass
import numpy as np
from scipy import stats
import uuid
import hashlib
from collections import defaultdict
import math

class ExperimentStatus(str, Enum):
    """A/B test experiment status"""
    DRAFT = "draft"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    STOPPED = "stopped"
    ANALYSING = "analysing"

class TestType(str, Enum):
    """Types of statistical tests"""
    T_TEST = "t_test"
    WELCH_T_TEST = "welch_t_test"
    MANN_WHITNEY = "mann_whitney"
    CHI_SQUARE = "chi_square"
    BAYESIAN = "bayesian"
    SEQUENTIAL = "sequential"

class TrafficSplitStrategy(str, Enum):
    """Traffic allocation strategies"""
    EQUAL_SPLIT = "equal_split"
    WEIGHTED = "weighted"
    ADAPTIVE = "adaptive"
    THOMPSON_SAMPLING = "thompson_sampling"
    UCB = "upper_confidence_bound"

class SignificanceLevel(float, Enum):
    """Standard significance levels"""
    ALPHA_001 = 0.001  # 99.9% confidence
    ALPHA_01 = 0.01    # 99% confidence
    ALPHA_05 = 0.05    # 95% confidence
    ALPHA_10 = 0.10    # 90% confidence

@dataclass
class Variant:
    """A/B test variant configuration"""
    variant_id: str
    variant_name: str
    model_version: str
    model_config: Dict[str, Any]
    traffic_allocation: float  # 0.0 to 1.0
    description: str
    is_control: bool = False

@dataclass
class MetricDefinition:
    """Definition of a metric to track in experiments"""
    metric_name: str
    metric_type: str  # "conversion", "continuous", "count"
    aggregation: str  # "mean", "sum", "median", "rate"
    higher_is_better: bool
    minimum_detectable_effect: float
    baseline_value: Optional[float] = None
    variance: Optional[float] = None

@dataclass
class ExperimentConfig:
    """Configuration for A/B test experiment"""
    experiment_id: str
    experiment_name: str
    description: str
    variants: List[Variant]
    primary_metric: MetricDefinition
    secondary_metrics: List[MetricDefinition]
    traffic_split_strategy: TrafficSplitStrategy
    significance_level: float
    statistical_power: float
    minimum_sample_size: int
    maximum_duration_days: int
    early_stopping: bool
    guardrail_metrics: List[MetricDefinition] = Field(default_factory=list)

@dataclass
class ObservationData:
    """Single observation/measurement in the experiment"""
    observation_id: str
    experiment_id: str
    variant_id: str
    user_id: str
    session_id: str
    timestamp: datetime
    metrics: Dict[str, float]
    metadata: Dict[str, Any] = Field(default_factory=dict)

@dataclass
class VariantResults:
    """Results for a single variant"""
    variant_id: str
    sample_size: int
    metrics: Dict[str, Dict[str, float]]  # metric_name -> stats
    confidence_intervals: Dict[str, Tuple[float, float]]
    conversion_rate: Optional[float] = None

@dataclass
class StatisticalTest:
    """Statistical test result"""
    test_type: TestType
    metric_name: str
    control_variant: str
    treatment_variant: str
    statistic: float
    p_value: float
    confidence_interval: Tuple[float, float]
    effect_size: float
    is_significant: bool
    power: float
    interpretation: str

@dataclass
class ExperimentResults:
    """Complete experiment results"""
    experiment_id: str
    status: ExperimentStatus
    start_date: datetime
    end_date: Optional[datetime]
    duration_days: float
    total_observations: int
    variant_results: Dict[str, VariantResults]
    statistical_tests: List[StatisticalTest]
    winner: Optional[str] = None
    confidence_level: float = 0.0
    business_impact: Dict[str, float] = Field(default_factory=dict)
    recommendations: List[str] = Field(default_factory=list)

class StatisticalAnalyzer:
    """
    Statistical analysis engine for A/B tests
    """
    
    def __init__(self):
        self.test_cache = {}
    
    def calculate_sample_size(
        self,
        baseline_rate: float,
        minimum_detectable_effect: float,
        significance_level: float = 0.05,
        power: float = 0.8,
        two_tailed: bool = True
    ) -> int:
        """Calculate required sample size per variant"""
        
        # For proportion tests
        if 0 <= baseline_rate <= 1:
            p1 = baseline_rate
            p2 = baseline_rate + minimum_detectable_effect
            
            # Pooled proportion
            p_pool = (p1 + p2) / 2
            
            # Effect size (Cohen's h)
            effect_size = 2 * (np.arcsin(np.sqrt(p1)) - np.arcsin(np.sqrt(p2)))
            
            # Z-scores
            z_alpha = stats.norm.ppf(1 - significance_level/2 if two_tailed else 1 - significance_level)
            z_beta = stats.norm.ppf(power)
            
            # Sample size calculation
            n = (z_alpha + z_beta) ** 2 / (effect_size ** 2)
            
            return int(np.ceil(n))
        
        # For continuous metrics
        else:
            effect_size = minimum_detectable_effect / baseline_rate  # Relative effect
            z_alpha = stats.norm.ppf(1 - significance_level/2 if two_tailed else 1 - significance_level)
            z_beta = stats.norm.ppf(power)
            
            n = 2 * ((z_alpha + z_beta) / effect_size) ** 2
            
            return int(np.ceil(n))
    
    def perform_t_test(
        self,
        control_data: List[float],
        treatment_data: List[float],
        significance_level: float = 0.05,
        equal_variances: bool = False
    ) -> StatisticalTest:
        """Perform t-test between control and treatment"""
        
        if len(control_data) < 2 or len(treatment_data) < 2:
            raise ValueError("Insufficient data for t-test")
        
        # Perform appropriate t-test
        if equal_variances:
            statistic, p_value = stats.ttest_ind(treatment_data, control_data)
            test_type = TestType.T_TEST
        else:
            statistic, p_value = stats.ttest_ind(treatment_data, control_data, equal_var=False)
            test_type = TestType.WELCH_T_TEST
        
        # Calculate effect size (Cohen's d)
        control_mean = np.mean(control_data)
        treatment_mean = np.mean(treatment_data)
        pooled_std = np.sqrt((np.var(control_data) + np.var(treatment_data)) / 2)
        effect_size = (treatment_mean - control_mean) / pooled_std if pooled_std > 0 else 0
        
        # Confidence interval for difference in means
        control_sem = stats.sem(control_data)
        treatment_sem = stats.sem(treatment_data)
        combined_sem = np.sqrt(control_sem**2 + treatment_sem**2)
        
        t_critical = stats.t.ppf(1 - significance_level/2, 
                                len(control_data) + len(treatment_data) - 2)
        margin_of_error = t_critical * combined_sem
        mean_diff = treatment_mean - control_mean
        ci_lower = mean_diff - margin_of_error
        ci_upper = mean_diff + margin_of_error
        
        # Calculate statistical power
        power = self._calculate_power_t_test(
            effect_size, len(control_data), len(treatment_data), significance_level
        )
        
        # Interpretation
        is_significant = p_value < significance_level
        interpretation = self._interpret_t_test_result(
            statistic, p_value, effect_size, is_significant
        )
        
        return StatisticalTest(
            test_type=test_type,
            metric_name="continuous_metric",
            control_variant="control",
            treatment_variant="treatment",
            statistic=statistic,
            p_value=p_value,
            confidence_interval=(ci_lower, ci_upper),
            effect_size=effect_size,
            is_significant=is_significant,
            power=power,
            interpretation=interpretation
        )
    
    def perform_proportion_test(
        self,
        control_conversions: int,
        control_total: int,
        treatment_conversions: int,
        treatment_total: int,
        significance_level: float = 0.05
    ) -> StatisticalTest:
        """Perform proportion test (z-test) for conversion rates"""
        
        if control_total < 1 or treatment_total < 1:
            raise ValueError("Insufficient sample size for proportion test")
        
        # Calculate proportions
        p1 = control_conversions / control_total
        p2 = treatment_conversions / treatment_total
        
        # Pooled proportion
        p_pool = (control_conversions + treatment_conversions) / (control_total + treatment_total)
        
        # Standard error
        se = np.sqrt(p_pool * (1 - p_pool) * (1/control_total + 1/treatment_total))
        
        # Z-statistic
        z_stat = (p2 - p1) / se if se > 0 else 0
        
        # P-value (two-tailed)
        p_value = 2 * (1 - stats.norm.cdf(abs(z_stat)))
        
        # Effect size (difference in proportions)
        effect_size = p2 - p1
        
        # Confidence interval for difference in proportions
        se_diff = np.sqrt(p1*(1-p1)/control_total + p2*(1-p2)/treatment_total)
        z_critical = stats.norm.ppf(1 - significance_level/2)
        margin_of_error = z_critical * se_diff
        ci_lower = effect_size - margin_of_error
        ci_upper = effect_size + margin_of_error
        
        # Statistical power
        power = self._calculate_power_proportion_test(
            p1, p2, control_total, treatment_total, significance_level
        )
        
        # Interpretation
        is_significant = p_value < significance_level
        interpretation = self._interpret_proportion_test_result(
            p1, p2, p_value, effect_size, is_significant
        )
        
        return StatisticalTest(
            test_type=TestType.T_TEST,  # Using t-test enum for z-test
            metric_name="conversion_rate",
            control_variant="control",
            treatment_variant="treatment",
            statistic=z_stat,
            p_value=p_value,
            confidence_interval=(ci_lower, ci_upper),
            effect_size=effect_size,
            is_significant=is_significant,
            power=power,
            interpretation=interpretation
        )
    
    def perform_bayesian_test(
        self,
        control_data: List[float],
        treatment_data: List[float],
        prior_mean: float = 0,
        prior_std: float = 1
    ) -> Dict[str, Any]:
        """Perform Bayesian A/B test"""
        
        # Simplified Bayesian analysis
        control_mean = np.mean(control_data)
        treatment_mean = np.mean(treatment_data)
        control_std = np.std(control_data)
        treatment_std = np.std(treatment_data)
        
        # Posterior distributions (simplified)
        n_control = len(control_data)
        n_treatment = len(treatment_data)
        
        # Posterior means
        posterior_control_mean = (prior_mean/prior_std**2 + n_control*control_mean/control_std**2) / \
                               (1/prior_std**2 + n_control/control_std**2)
        posterior_treatment_mean = (prior_mean/prior_std**2 + n_treatment*treatment_mean/treatment_std**2) / \
                                  (1/prior_std**2 + n_treatment/treatment_std**2)
        
        # Probability that treatment is better than control
        diff_mean = posterior_treatment_mean - posterior_control_mean
        diff_std = np.sqrt(control_std**2/n_control + treatment_std**2/n_treatment)
        
        prob_treatment_better = 1 - stats.norm.cdf(0, diff_mean, diff_std)
        
        return {
            "posterior_control_mean": posterior_control_mean,
            "posterior_treatment_mean": posterior_treatment_mean,
            "probability_treatment_better": prob_treatment_better,
            "expected_lift": diff_mean,
            "credible_interval": (
                diff_mean - 1.96 * diff_std,
                diff_mean + 1.96 * diff_std
            )
        }
    
    def _calculate_power_t_test(
        self,
        effect_size: float,
        n1: int,
        n2: int,
        alpha: float
    ) -> float:
        """Calculate statistical power for t-test"""
        
        # Degrees of freedom
        df = n1 + n2 - 2
        
        # Non-centrality parameter
        ncp = effect_size * np.sqrt((n1 * n2) / (n1 + n2))
        
        # Critical t-value
        t_critical = stats.t.ppf(1 - alpha/2, df)
        
        # Power calculation
        power = 1 - stats.nct.cdf(t_critical, df, ncp) + stats.nct.cdf(-t_critical, df, ncp)
        
        return min(1.0, max(0.0, power))
    
    def _calculate_power_proportion_test(
        self,
        p1: float,
        p2: float,
        n1: int,
        n2: int,
        alpha: float
    ) -> float:
        """Calculate statistical power for proportion test"""
        
        # Effect size (Cohen's h)
        h = 2 * (np.arcsin(np.sqrt(p1)) - np.arcsin(np.sqrt(p2)))
        
        # Standard error
        se = np.sqrt(1/n1 + 1/n2)
        
        # Z-critical value
        z_critical = stats.norm.ppf(1 - alpha/2)
        
        # Power calculation
        z_beta = abs(h) / se - z_critical
        power = stats.norm.cdf(z_beta)
        
        return min(1.0, max(0.0, power))
    
    def _interpret_t_test_result(
        self,
        statistic: float,
        p_value: float,
        effect_size: float,
        is_significant: bool
    ) -> str:
        """Generate interpretation of t-test results"""
        
        if is_significant:
            direction = "significantly higher" if statistic > 0 else "significantly lower"
            magnitude = "large" if abs(effect_size) > 0.8 else "medium" if abs(effect_size) > 0.5 else "small"
            return f"Treatment is {direction} than control with {magnitude} effect size (Cohen's d = {effect_size:.3f})"
        else:
            return f"No significant difference detected (p = {p_value:.3f}, Cohen's d = {effect_size:.3f})"
    
    def _interpret_proportion_test_result(
        self,
        p1: float,
        p2: float,
        p_value: float,
        effect_size: float,
        is_significant: bool
    ) -> str:
        """Generate interpretation of proportion test results"""
        
        if is_significant:
            relative_change = (effect_size / p1 * 100) if p1 > 0 else 0
            direction = "higher" if effect_size > 0 else "lower"
            return f"Treatment conversion rate ({p2:.3%}) is significantly {direction} than control ({p1:.3%}), " \
                   f"representing a {relative_change:.1f}% relative change"
        else:
            return f"No significant difference in conversion rates (p = {p_value:.3f})"

class ExperimentManager:
    """
    A/B test experiment management and execution
    """
    
    def __init__(self):
        self.experiments: Dict[str, ExperimentConfig] = {}
        self.observations: Dict[str, List[ObservationData]] = defaultdict(list)
        self.results: Dict[str, ExperimentResults] = {}
        self.analyzer = StatisticalAnalyzer()
        
    def create_experiment(
        self,
        experiment_name: str,
        description: str,
        variants: List[Variant],
        primary_metric: MetricDefinition,
        secondary_metrics: List[MetricDefinition] = None,
        significance_level: float = 0.05,
        statistical_power: float = 0.8,
        maximum_duration_days: int = 30
    ) -> str:
        """Create new A/B test experiment"""
        
        experiment_id = f"exp_{uuid.uuid4().hex[:8]}"
        
        # Calculate minimum sample size
        minimum_sample_size = self.analyzer.calculate_sample_size(
            baseline_rate=primary_metric.baseline_value or 0.1,
            minimum_detectable_effect=primary_metric.minimum_detectable_effect,
            significance_level=significance_level,
            power=statistical_power
        )
        
        experiment = ExperimentConfig(
            experiment_id=experiment_id,
            experiment_name=experiment_name,
            description=description,
            variants=variants,
            primary_metric=primary_metric,
            secondary_metrics=secondary_metrics or [],
            traffic_split_strategy=TrafficSplitStrategy.EQUAL_SPLIT,
            significance_level=significance_level,
            statistical_power=statistical_power,
            minimum_sample_size=minimum_sample_size,
            maximum_duration_days=maximum_duration_days,
            early_stopping=True
        )
        
        self.experiments[experiment_id] = experiment
        
        return experiment_id
    
    def start_experiment(self, experiment_id: str) -> bool:
        """Start running an experiment"""
        
        if experiment_id not in self.experiments:
            return False
        
        # Initialize results tracking
        self.results[experiment_id] = ExperimentResults(
            experiment_id=experiment_id,
            status=ExperimentStatus.RUNNING,
            start_date=datetime.utcnow(),
            end_date=None,
            duration_days=0,
            total_observations=0,
            variant_results={},
            statistical_tests=[]
        )
        
        return True
    
    def record_observation(
        self,
        experiment_id: str,
        variant_id: str,
        user_id: str,
        metrics: Dict[str, float],
        session_id: Optional[str] = None,
        metadata: Dict[str, Any] = None
    ) -> str:
        """Record observation in experiment"""
        
        if experiment_id not in self.experiments:
            raise ValueError(f"Experiment {experiment_id} not found")
        
        observation_id = f"obs_{uuid.uuid4().hex[:8]}"
        
        observation = ObservationData(
            observation_id=observation_id,
            experiment_id=experiment_id,
            variant_id=variant_id,
            user_id=user_id,
            session_id=session_id or f"session_{uuid.uuid4().hex[:8]}",
            timestamp=datetime.utcnow(),
            metrics=metrics,
            metadata=metadata or {}
        )
        
        self.observations[experiment_id].append(observation)
        
        # Update results
        if experiment_id in self.results:
            self.results[experiment_id].total_observations += 1
        
        return observation_id
    
    def assign_variant(
        self,
        experiment_id: str,
        user_id: str,
        context: Dict[str, Any] = None
    ) -> Optional[str]:
        """Assign user to experiment variant"""
        
        if experiment_id not in self.experiments:
            return None
        
        experiment = self.experiments[experiment_id]
        
        # Create deterministic hash for consistent assignment
        hash_input = f"{experiment_id}:{user_id}"
        user_hash = int(hashlib.md5(hash_input.encode()).hexdigest(), 16)
        assignment_value = (user_hash % 10000) / 10000.0  # 0.0 to 1.0
        
        # Assign based on traffic allocation
        cumulative_allocation = 0.0
        for variant in experiment.variants:
            cumulative_allocation += variant.traffic_allocation
            if assignment_value <= cumulative_allocation:
                return variant.variant_id
        
        # Fallback to control variant
        control_variant = next((v for v in experiment.variants if v.is_control), None)
        return control_variant.variant_id if control_variant else experiment.variants[0].variant_id
    
    def analyze_experiment(self, experiment_id: str) -> ExperimentResults:
        """Analyze experiment results"""
        
        if experiment_id not in self.experiments:
            raise ValueError(f"Experiment {experiment_id} not found")
        
        experiment = self.experiments[experiment_id]
        observations = self.observations[experiment_id]
        
        # Calculate duration
        if experiment_id in self.results:
            start_date = self.results[experiment_id].start_date
            duration_days = (datetime.utcnow() - start_date).days
        else:
            start_date = datetime.utcnow()
            duration_days = 0
        
        # Group observations by variant
        variant_observations = defaultdict(list)
        for obs in observations:
            variant_observations[obs.variant_id].append(obs)
        
        # Calculate variant results
        variant_results = {}
        for variant_id, obs_list in variant_observations.items():
            variant_results[variant_id] = self._calculate_variant_results(obs_list, experiment.primary_metric)
        
        # Perform statistical tests
        statistical_tests = self._perform_statistical_tests(
            variant_results, experiment, variant_observations
        )
        
        # Determine winner
        winner, confidence_level = self._determine_winner(statistical_tests, experiment.significance_level)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(statistical_tests, variant_results, experiment)
        
        # Calculate business impact
        business_impact = self._calculate_business_impact(variant_results, observations)
        
        results = ExperimentResults(
            experiment_id=experiment_id,
            status=ExperimentStatus.ANALYSING,
            start_date=start_date,
            end_date=None,
            duration_days=duration_days,
            total_observations=len(observations),
            variant_results=variant_results,
            statistical_tests=statistical_tests,
            winner=winner,
            confidence_level=confidence_level,
            business_impact=business_impact,
            recommendations=recommendations
        )
        
        self.results[experiment_id] = results
        
        return results
    
    def stop_experiment(self, experiment_id: str, reason: str = "Manual stop") -> bool:
        """Stop running experiment"""
        
        if experiment_id in self.results:
            self.results[experiment_id].status = ExperimentStatus.STOPPED
            self.results[experiment_id].end_date = datetime.utcnow()
            return True
        
        return False
    
    def get_experiment_status(self, experiment_id: str) -> Dict[str, Any]:
        """Get current experiment status and metrics"""
        
        if experiment_id not in self.experiments:
            return {"error": "Experiment not found"}
        
        experiment = self.experiments[experiment_id]
        observations = self.observations[experiment_id]
        
        # Basic statistics
        variant_counts = defaultdict(int)
        for obs in observations:
            variant_counts[obs.variant_id] += 1
        
        status = {
            "experiment_id": experiment_id,
            "experiment_name": experiment.experiment_name,
            "status": self.results.get(experiment_id, {}).get("status", "draft"),
            "total_observations": len(observations),
            "variant_counts": dict(variant_counts),
            "minimum_sample_size": experiment.minimum_sample_size,
            "sample_size_reached": len(observations) >= experiment.minimum_sample_size,
            "duration_days": 0
        }
        
        if experiment_id in self.results:
            result = self.results[experiment_id]
            status.update({
                "duration_days": result.duration_days,
                "statistical_power": max(test.power for test in result.statistical_tests) if result.statistical_tests else 0
            })
        
        return status
    
    def _calculate_variant_results(
        self,
        observations: List[ObservationData],
        primary_metric: MetricDefinition
    ) -> VariantResults:
        """Calculate results for a single variant"""
        
        if not observations:
            return VariantResults(
                variant_id="unknown",
                sample_size=0,
                metrics={},
                confidence_intervals={}
            )
        
        variant_id = observations[0].variant_id
        sample_size = len(observations)
        
        # Extract metric values
        metric_values = []
        for obs in observations:
            if primary_metric.metric_name in obs.metrics:
                metric_values.append(obs.metrics[primary_metric.metric_name])
        
        if not metric_values:
            return VariantResults(
                variant_id=variant_id,
                sample_size=sample_size,
                metrics={},
                confidence_intervals={}
            )
        
        # Calculate statistics
        mean_value = np.mean(metric_values)
        std_value = np.std(metric_values)
        median_value = np.median(metric_values)
        
        # Confidence interval
        sem = stats.sem(metric_values)
        confidence_interval = stats.t.interval(0.95, len(metric_values)-1, 
                                             loc=mean_value, scale=sem)
        
        metrics = {
            primary_metric.metric_name: {
                "mean": mean_value,
                "std": std_value,
                "median": median_value,
                "count": len(metric_values)
            }
        }
        
        confidence_intervals = {
            primary_metric.metric_name: confidence_interval
        }
        
        # Conversion rate for binary metrics
        conversion_rate = None
        if primary_metric.metric_type == "conversion":
            conversion_rate = np.mean([1 if v > 0 else 0 for v in metric_values])
        
        return VariantResults(
            variant_id=variant_id,
            sample_size=sample_size,
            metrics=metrics,
            confidence_intervals=confidence_intervals,
            conversion_rate=conversion_rate
        )
    
    def _perform_statistical_tests(
        self,
        variant_results: Dict[str, VariantResults],
        experiment: ExperimentConfig,
        variant_observations: Dict[str, List[ObservationData]]
    ) -> List[StatisticalTest]:
        """Perform statistical tests between variants"""
        
        statistical_tests = []
        
        # Find control variant
        control_variant = next((v for v in experiment.variants if v.is_control), None)
        if not control_variant:
            return statistical_tests
        
        control_variant_id = control_variant.variant_id
        control_observations = variant_observations[control_variant_id]
        
        # Test each treatment variant against control
        for variant in experiment.variants:
            if variant.variant_id == control_variant_id:
                continue
            
            treatment_observations = variant_observations[variant.variant_id]
            
            # Extract metric data
            control_data = [
                obs.metrics.get(experiment.primary_metric.metric_name, 0)
                for obs in control_observations
                if experiment.primary_metric.metric_name in obs.metrics
            ]
            
            treatment_data = [
                obs.metrics.get(experiment.primary_metric.metric_name, 0)
                for obs in treatment_observations
                if experiment.primary_metric.metric_name in obs.metrics
            ]
            
            if len(control_data) < 10 or len(treatment_data) < 10:
                continue  # Insufficient data
            
            # Perform appropriate test
            if experiment.primary_metric.metric_type == "conversion":
                # Proportion test
                control_conversions = sum(1 for x in control_data if x > 0)
                treatment_conversions = sum(1 for x in treatment_data if x > 0)
                
                test_result = self.analyzer.perform_proportion_test(
                    control_conversions=control_conversions,
                    control_total=len(control_data),
                    treatment_conversions=treatment_conversions,
                    treatment_total=len(treatment_data),
                    significance_level=experiment.significance_level
                )
            else:
                # t-test for continuous metrics
                test_result = self.analyzer.perform_t_test(
                    control_data=control_data,
                    treatment_data=treatment_data,
                    significance_level=experiment.significance_level
                )
            
            test_result.control_variant = control_variant_id
            test_result.treatment_variant = variant.variant_id
            test_result.metric_name = experiment.primary_metric.metric_name
            
            statistical_tests.append(test_result)
        
        return statistical_tests
    
    def _determine_winner(
        self,
        statistical_tests: List[StatisticalTest],
        significance_level: float
    ) -> Tuple[Optional[str], float]:
        """Determine winning variant based on statistical tests"""
        
        if not statistical_tests:
            return None, 0.0
        
        # Find most significant positive result
        significant_tests = [
            test for test in statistical_tests
            if test.is_significant and test.effect_size > 0
        ]
        
        if not significant_tests:
            return None, 0.0
        
        # Choose test with lowest p-value (most significant)
        best_test = min(significant_tests, key=lambda t: t.p_value)
        
        confidence_level = 1 - best_test.p_value
        
        return best_test.treatment_variant, confidence_level
    
    def _generate_recommendations(
        self,
        statistical_tests: List[StatisticalTest],
        variant_results: Dict[str, VariantResults],
        experiment: ExperimentConfig
    ) -> List[str]:
        """Generate actionable recommendations based on results"""
        
        recommendations = []
        
        if not statistical_tests:
            recommendations.append("Insufficient data for statistical analysis - continue collecting data")
            return recommendations
        
        significant_tests = [test for test in statistical_tests if test.is_significant]
        
        if not significant_tests:
            recommendations.append("No statistically significant differences found")
            recommendations.append("Consider running experiment longer or testing larger effect sizes")
        else:
            for test in significant_tests:
                if test.effect_size > 0:
                    recommendations.append(
                        f"Variant {test.treatment_variant} shows significant improvement "
                        f"({test.effect_size:.1%} lift) - consider implementing"
                    )
                else:
                    recommendations.append(
                        f"Variant {test.treatment_variant} shows significant decrease "
                        f"- avoid implementing"
                    )
        
        # Power analysis recommendations
        low_power_tests = [test for test in statistical_tests if test.power < 0.8]
        if low_power_tests:
            recommendations.append("Some tests have low statistical power - consider increasing sample size")
        
        return recommendations
    
    def _calculate_business_impact(
        self,
        variant_results: Dict[str, VariantResults],
        observations: List[ObservationData]
    ) -> Dict[str, float]:
        """Calculate estimated business impact of experiment results"""
        
        # Simplified business impact calculation
        total_value = sum(
            obs.metrics.get("revenue", 0) for obs in observations
        )
        
        return {
            "total_revenue_observed": total_value,
            "estimated_monthly_impact": total_value * 30,  # Extrapolate
            "confidence": 0.8  # Default confidence
        }

# Global experiment manager
experiment_manager = ExperimentManager()

# Utility functions

def create_conversion_metric(
    metric_name: str,
    baseline_rate: float,
    minimum_detectable_effect: float
) -> MetricDefinition:
    """Create conversion rate metric definition"""
    
    return MetricDefinition(
        metric_name=metric_name,
        metric_type="conversion",
        aggregation="rate",
        higher_is_better=True,
        minimum_detectable_effect=minimum_detectable_effect,
        baseline_value=baseline_rate
    )

def create_continuous_metric(
    metric_name: str,
    baseline_mean: float,
    minimum_detectable_effect: float,
    baseline_std: Optional[float] = None
) -> MetricDefinition:
    """Create continuous metric definition"""
    
    return MetricDefinition(
        metric_name=metric_name,
        metric_type="continuous",
        aggregation="mean",
        higher_is_better=True,
        minimum_detectable_effect=minimum_detectable_effect,
        baseline_value=baseline_mean,
        variance=baseline_std**2 if baseline_std else None
    )

def quick_experiment_setup(
    experiment_name: str,
    control_model: str,
    treatment_model: str,
    metric_name: str,
    baseline_rate: float,
    minimum_lift: float
) -> str:
    """Quick setup for simple A/B test between two models"""
    
    # Create variants
    variants = [
        Variant(
            variant_id="control",
            variant_name="Control",
            model_version=control_model,
            model_config={},
            traffic_allocation=0.5,
            description="Control variant",
            is_control=True
        ),
        Variant(
            variant_id="treatment",
            variant_name="Treatment",
            model_version=treatment_model,
            model_config={},
            traffic_allocation=0.5,
            description="Treatment variant"
        )
    ]
    
    # Create metric
    primary_metric = create_conversion_metric(
        metric_name=metric_name,
        baseline_rate=baseline_rate,
        minimum_detectable_effect=minimum_lift
    )
    
    # Create experiment
    return experiment_manager.create_experiment(
        experiment_name=experiment_name,
        description=f"A/B test comparing {control_model} vs {treatment_model}",
        variants=variants,
        primary_metric=primary_metric
    )