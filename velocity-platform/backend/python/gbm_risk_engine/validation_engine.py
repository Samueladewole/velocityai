"""
Model Validation and Backtesting Engine
Comprehensive validation framework for GBM risk models and quantitative analysis
"""

import numpy as np
from typing import Dict, List, Optional, Tuple, Any, Union, Callable
from datetime import datetime, timedelta
from enum import Enum
from pydantic import BaseModel, Field
from dataclasses import dataclass
import math
from scipy import stats
import pandas as pd

from .gbm_simulator import GBMSimulator, GBMParameters, GBMResult
from .risk_metrics import RiskMetricsCalculator, RiskMetrics
from .stress_testing import StressTester, StressScenario

class ValidationTest(str, Enum):
    """Types of validation tests"""
    BACKTESTING = "backtesting"
    KUPIEC_TEST = "kupiec_test"
    CHRISTOFFERSEN_TEST = "christoffersen_test"
    BERKOWITZ_TEST = "berkowitz_test"
    KOLMOGOROV_SMIRNOV = "kolmogorov_smirnov"
    ANDERSON_DARLING = "anderson_darling"
    JARQUE_BERA = "jarque_bera"
    LJUNG_BOX = "ljung_box"
    ARCH_TEST = "arch_test"

class ValidationResult(str, Enum):
    """Validation test results"""
    PASS = "pass"
    FAIL = "fail"
    WARNING = "warning"
    INCONCLUSIVE = "inconclusive"

class ModelType(str, Enum):
    """Types of models to validate"""
    VAR_MODEL = "var_model"
    GBM_SIMULATION = "gbm_simulation"
    STRESS_TEST = "stress_test"
    CORRELATION_MODEL = "correlation_model"
    VOLATILITY_MODEL = "volatility_model"

@dataclass
class ValidationTestResult:
    """Result from a single validation test"""
    test_name: str
    test_type: ValidationTest
    result: ValidationResult
    test_statistic: float
    p_value: float
    critical_value: float
    confidence_level: float
    description: str
    details: Dict[str, Any]
    recommendations: List[str]

@dataclass
class BacktestResult:
    """Backtesting analysis result"""
    model_type: ModelType
    test_period: Tuple[datetime, datetime]
    total_observations: int
    violations: int
    violation_rate: float
    expected_violations: int
    green_zone: bool  # Basel traffic light system
    yellow_zone: bool
    red_zone: bool
    test_results: List[ValidationTestResult]
    performance_metrics: Dict[str, float]

@dataclass
class ModelValidationReport:
    """Comprehensive model validation report"""
    model_name: str
    model_type: ModelType
    validation_date: datetime
    validation_period: Tuple[datetime, datetime]
    overall_assessment: ValidationResult
    backtesting_results: List[BacktestResult]
    statistical_tests: List[ValidationTestResult]
    performance_analysis: Dict[str, Any]
    regulatory_compliance: Dict[str, bool]
    recommendations: List[str]
    next_validation_date: datetime

class VaRBacktester:
    """
    Value at Risk backtesting framework
    Implements regulatory backtesting requirements
    """
    
    def __init__(self):
        self.test_statistics = {}
    
    def kupiec_test(
        self,
        violations: List[bool],
        confidence_level: float = 0.95,
        significance_level: float = 0.05
    ) -> ValidationTestResult:
        """
        Kupiec Proportion of Failures (POF) test
        Tests if violation rate matches expected rate
        """
        
        n = len(violations)
        x = sum(violations)  # Number of violations
        p = 1 - confidence_level  # Expected violation rate
        
        # Test statistic: -2 * log(likelihood ratio)
        if x == 0:
            test_stat = 2 * n * math.log(1 / (1 - p))
        elif x == n:
            test_stat = 2 * n * math.log(1 / p)
        else:
            likelihood_ratio = (p**x * (1-p)**(n-x)) / ((x/n)**x * (1-x/n)**(n-x))
            test_stat = -2 * math.log(likelihood_ratio)
        
        # Critical value (chi-square with 1 degree of freedom)
        critical_value = stats.chi2.ppf(1 - significance_level, 1)
        p_value = 1 - stats.chi2.cdf(test_stat, 1)
        
        # Determine result
        if p_value > significance_level:
            result = ValidationResult.PASS
            description = "Violation rate is statistically consistent with confidence level"
        else:
            result = ValidationResult.FAIL
            description = "Violation rate significantly different from expected"
        
        recommendations = []
        if result == ValidationResult.FAIL:
            if x/n > p:
                recommendations.append("Model underestimates risk - consider increasing VaR estimates")
            else:
                recommendations.append("Model overestimates risk - consider model recalibration")
        
        return ValidationTestResult(
            test_name="Kupiec POF Test",
            test_type=ValidationTest.KUPIEC_TEST,
            result=result,
            test_statistic=test_stat,
            p_value=p_value,
            critical_value=critical_value,
            confidence_level=confidence_level,
            description=description,
            details={
                "violations": x,
                "total_observations": n,
                "violation_rate": x/n,
                "expected_rate": p
            },
            recommendations=recommendations
        )
    
    def christoffersen_test(
        self,
        violations: List[bool],
        confidence_level: float = 0.95,
        significance_level: float = 0.05
    ) -> ValidationTestResult:
        """
        Christoffersen test for independence of VaR violations
        Tests both correct coverage and independence
        """
        
        n = len(violations)
        x = sum(violations)
        p = 1 - confidence_level
        
        # Count transitions
        n00 = n01 = n10 = n11 = 0
        for i in range(1, n):
            if not violations[i-1] and not violations[i]:
                n00 += 1
            elif not violations[i-1] and violations[i]:
                n01 += 1
            elif violations[i-1] and not violations[i]:
                n10 += 1
            elif violations[i-1] and violations[i]:
                n11 += 1
        
        # Test statistics
        if n01 + n11 > 0 and n00 + n01 > 0 and n10 + n11 > 0:
            pi_01 = n01 / (n00 + n01) if (n00 + n01) > 0 else 0
            pi_11 = n11 / (n10 + n11) if (n10 + n11) > 0 else 0
            pi_hat = x / n if n > 0 else 0
            
            # Likelihood ratio for independence
            if pi_01 > 0 and pi_11 > 0 and pi_hat > 0 and pi_hat < 1:
                lr_ind = (pi_01**n01 * (1-pi_01)**(n00) * pi_11**n11 * (1-pi_11)**n10) / \
                         (pi_hat**(n01+n11) * (1-pi_hat)**(n00+n10))
                test_stat_ind = -2 * math.log(lr_ind) if lr_ind > 0 else 0
            else:
                test_stat_ind = 0
        else:
            test_stat_ind = 0
        
        # Combined test statistic (POF + Independence)
        kupiec_result = self.kupiec_test(violations, confidence_level, significance_level)
        test_stat = kupiec_result.test_statistic + test_stat_ind
        
        # Critical value (chi-square with 2 degrees of freedom)
        critical_value = stats.chi2.ppf(1 - significance_level, 2)
        p_value = 1 - stats.chi2.cdf(test_stat, 2)
        
        result = ValidationResult.PASS if p_value > significance_level else ValidationResult.FAIL
        
        description = ("VaR violations show correct coverage and independence" 
                      if result == ValidationResult.PASS 
                      else "VaR violations show incorrect coverage or clustering")
        
        return ValidationTestResult(
            test_name="Christoffersen Coverage and Independence Test",
            test_type=ValidationTest.CHRISTOFFERSEN_TEST,
            result=result,
            test_statistic=test_stat,
            p_value=p_value,
            critical_value=critical_value,
            confidence_level=confidence_level,
            description=description,
            details={
                "transitions": {"n00": n00, "n01": n01, "n10": n10, "n11": n11},
                "pi_01": pi_01 if 'pi_01' in locals() else 0,
                "pi_11": pi_11 if 'pi_11' in locals() else 0,
                "independence_test_stat": test_stat_ind
            },
            recommendations=[]
        )

class StatisticalValidator:
    """
    Statistical validation tests for model assumptions
    """
    
    def __init__(self):
        self.test_cache = {}
    
    def normality_tests(self, data: List[float]) -> List[ValidationTestResult]:
        """Run multiple normality tests"""
        
        tests = []
        data_array = np.array(data)
        
        # Jarque-Bera test
        jb_stat, jb_pvalue = stats.jarque_bera(data_array)
        tests.append(ValidationTestResult(
            test_name="Jarque-Bera Normality Test",
            test_type=ValidationTest.JARQUE_BERA,
            result=ValidationResult.PASS if jb_pvalue > 0.05 else ValidationResult.FAIL,
            test_statistic=jb_stat,
            p_value=jb_pvalue,
            critical_value=5.99,  # Chi-square critical value at 5%
            confidence_level=0.95,
            description="Tests for normality using skewness and kurtosis",
            details={
                "skewness": stats.skew(data_array),
                "kurtosis": stats.kurtosis(data_array)
            },
            recommendations=[]
        ))
        
        # Kolmogorov-Smirnov test
        ks_stat, ks_pvalue = stats.kstest(data_array, 'norm', 
                                         args=(np.mean(data_array), np.std(data_array)))
        tests.append(ValidationTestResult(
            test_name="Kolmogorov-Smirnov Test",
            test_type=ValidationTest.KOLMOGOROV_SMIRNOV,
            result=ValidationResult.PASS if ks_pvalue > 0.05 else ValidationResult.FAIL,
            test_statistic=ks_stat,
            p_value=ks_pvalue,
            critical_value=1.36,  # Approximate critical value at 5%
            confidence_level=0.95,
            description="Tests for normality using empirical distribution function",
            details={},
            recommendations=[]
        ))
        
        return tests
    
    def autocorrelation_test(self, data: List[float], lags: int = 10) -> ValidationTestResult:
        """Ljung-Box test for autocorrelation"""
        
        data_array = np.array(data)
        
        # Calculate autocorrelations
        autocorrs = []
        n = len(data_array)
        
        for lag in range(1, lags + 1):
            if n > lag:
                corr = np.corrcoef(data_array[:-lag], data_array[lag:])[0, 1]
                autocorrs.append(corr if not np.isnan(corr) else 0)
            else:
                autocorrs.append(0)
        
        # Ljung-Box statistic
        lb_stat = n * (n + 2) * sum((autocorrs[i]**2) / (n - i - 1) 
                                    for i in range(len(autocorrs)) if (n - i - 1) > 0)
        
        critical_value = stats.chi2.ppf(0.95, lags)
        p_value = 1 - stats.chi2.cdf(lb_stat, lags)
        
        result = ValidationResult.PASS if p_value > 0.05 else ValidationResult.FAIL
        
        return ValidationTestResult(
            test_name="Ljung-Box Autocorrelation Test",
            test_type=ValidationTest.LJUNG_BOX,
            result=result,
            test_statistic=lb_stat,
            p_value=p_value,
            critical_value=critical_value,
            confidence_level=0.95,
            description="Tests for autocorrelation in residuals",
            details={"autocorrelations": autocorrs[:5]},  # Show first 5 lags
            recommendations=[]
        )
    
    def heteroskedasticity_test(self, data: List[float]) -> ValidationTestResult:
        """ARCH test for heteroskedasticity"""
        
        data_array = np.array(data)
        
        # Calculate squared residuals
        mean_val = np.mean(data_array)
        squared_residuals = (data_array - mean_val) ** 2
        
        # Simple ARCH(1) test - regress squared residuals on lagged squared residuals
        if len(squared_residuals) > 1:
            y = squared_residuals[1:]
            x = squared_residuals[:-1]
            
            # Calculate correlation (simplified regression)
            if np.std(x) > 0 and np.std(y) > 0:
                correlation = np.corrcoef(x, y)[0, 1]
                n = len(y)
                test_stat = n * correlation**2  # LM test statistic
            else:
                test_stat = 0
                correlation = 0
        else:
            test_stat = 0
            correlation = 0
        
        critical_value = stats.chi2.ppf(0.95, 1)
        p_value = 1 - stats.chi2.cdf(test_stat, 1)
        
        result = ValidationResult.PASS if p_value > 0.05 else ValidationResult.FAIL
        
        return ValidationTestResult(
            test_name="ARCH Test for Heteroskedasticity",
            test_type=ValidationTest.ARCH_TEST,
            result=result,
            test_statistic=test_stat,
            p_value=p_value,
            critical_value=critical_value,
            confidence_level=0.95,
            description="Tests for volatility clustering (ARCH effects)",
            details={"arch_correlation": correlation},
            recommendations=[]
        )

class ModelValidator:
    """
    Comprehensive model validation framework
    Integrates all validation components
    """
    
    def __init__(self, gbm_simulator: Optional[GBMSimulator] = None):
        self.gbm_simulator = gbm_simulator or GBMSimulator()
        self.var_backtester = VaRBacktester()
        self.statistical_validator = StatisticalValidator()
        self.validation_history = []
    
    def validate_var_model(
        self,
        historical_returns: List[float],
        var_estimates: List[float],
        confidence_level: float = 0.95
    ) -> BacktestResult:
        """Validate VaR model using backtesting"""
        
        if len(historical_returns) != len(var_estimates):
            raise ValueError("Historical returns and VaR estimates must have same length")
        
        # Calculate violations
        violations = [returns < -var_est for returns, var_est in zip(historical_returns, var_estimates)]
        
        # Run backtesting tests
        test_results = []
        
        # Kupiec test
        kupiec_result = self.var_backtester.kupiec_test(violations, confidence_level)
        test_results.append(kupiec_result)
        
        # Christoffersen test
        christoffersen_result = self.var_backtester.christoffersen_test(violations, confidence_level)
        test_results.append(christoffersen_result)
        
        # Calculate metrics
        total_obs = len(violations)
        num_violations = sum(violations)
        violation_rate = num_violations / total_obs
        expected_violations = int(total_obs * (1 - confidence_level))
        
        # Basel traffic light system
        green_zone = num_violations <= expected_violations + 4
        yellow_zone = expected_violations + 4 < num_violations <= expected_violations + 9
        red_zone = num_violations > expected_violations + 9
        
        # Performance metrics
        performance_metrics = {
            "mean_var_accuracy": np.mean([abs(ret + var_est) / abs(ret) 
                                         for ret, var_est in zip(historical_returns, var_estimates) 
                                         if abs(ret) > 0]),
            "var_efficiency": np.mean(var_estimates) / np.std(historical_returns),
            "violation_clustering": self._calculate_violation_clustering(violations)
        }
        
        return BacktestResult(
            model_type=ModelType.VAR_MODEL,
            test_period=(datetime.now() - timedelta(days=len(violations)), datetime.now()),
            total_observations=total_obs,
            violations=num_violations,
            violation_rate=violation_rate,
            expected_violations=expected_violations,
            green_zone=green_zone,
            yellow_zone=yellow_zone,
            red_zone=red_zone,
            test_results=test_results,
            performance_metrics=performance_metrics
        )
    
    def validate_gbm_simulation(
        self,
        gbm_params: GBMParameters,
        historical_data: List[float],
        num_validation_runs: int = 10
    ) -> ValidationTestResult:
        """Validate GBM simulation against historical data"""
        
        # Run multiple simulations
        simulated_results = []
        for _ in range(num_validation_runs):
            result = self.gbm_simulator.run_simulation(gbm_params)
            simulated_results.append(result.path_statistics.final_prices)
        
        # Aggregate simulation results
        all_simulated_prices = [price for run in simulated_results for price in run]
        
        # Calculate returns
        historical_returns = [(historical_data[i] - historical_data[i-1]) / historical_data[i-1] 
                             for i in range(1, len(historical_data))]
        
        simulated_returns = [(all_simulated_prices[i] - gbm_params.initial_price) / gbm_params.initial_price 
                            for i in range(len(all_simulated_prices))]
        
        # Statistical comparison
        historical_mean = np.mean(historical_returns)
        simulated_mean = np.mean(simulated_returns)
        
        historical_std = np.std(historical_returns)
        simulated_std = np.std(simulated_returns)
        
        # Two-sample t-test for means
        t_stat, t_pvalue = stats.ttest_ind(historical_returns, simulated_returns)
        
        # F-test for variances
        f_stat = historical_std**2 / simulated_std**2 if simulated_std > 0 else 1
        f_pvalue = 2 * min(stats.f.cdf(f_stat, len(historical_returns)-1, len(simulated_returns)-1),
                          1 - stats.f.cdf(f_stat, len(historical_returns)-1, len(simulated_returns)-1))
        
        # Overall assessment
        mean_test_pass = t_pvalue > 0.05
        variance_test_pass = f_pvalue > 0.05
        
        result = ValidationResult.PASS if (mean_test_pass and variance_test_pass) else ValidationResult.FAIL
        
        return ValidationTestResult(
            test_name="GBM Simulation Validation",
            test_type=ValidationTest.BACKTESTING,
            result=result,
            test_statistic=t_stat,
            p_value=min(t_pvalue, f_pvalue),
            critical_value=1.96,  # Approximate
            confidence_level=0.95,
            description="Validates GBM simulation against historical data",
            details={
                "historical_mean": historical_mean,
                "simulated_mean": simulated_mean,
                "historical_std": historical_std,
                "simulated_std": simulated_std,
                "mean_test_pvalue": t_pvalue,
                "variance_test_pvalue": f_pvalue
            },
            recommendations=[]
        )
    
    def generate_validation_report(
        self,
        model_name: str,
        model_type: ModelType,
        validation_tests: List[ValidationTestResult],
        backtesting_results: List[BacktestResult] = None
    ) -> ModelValidationReport:
        """Generate comprehensive validation report"""
        
        # Overall assessment
        failed_tests = [test for test in validation_tests if test.result == ValidationResult.FAIL]
        warning_tests = [test for test in validation_tests if test.result == ValidationResult.WARNING]
        
        if len(failed_tests) == 0:
            overall_assessment = ValidationResult.PASS
        elif len(failed_tests) <= 2 and len(warning_tests) <= 3:
            overall_assessment = ValidationResult.WARNING
        else:
            overall_assessment = ValidationResult.FAIL
        
        # Generate recommendations
        recommendations = []
        if failed_tests:
            recommendations.append("Address failed validation tests before using model in production")
        if warning_tests:
            recommendations.append("Monitor model performance closely due to warning indicators")
        
        # Regulatory compliance check
        regulatory_compliance = {
            "basel_backtesting": all(br.green_zone for br in (backtesting_results or [])),
            "model_documentation": True,  # Would check actual documentation
            "independent_validation": True  # Would check validation independence
        }
        
        return ModelValidationReport(
            model_name=model_name,
            model_type=model_type,
            validation_date=datetime.now(),
            validation_period=(datetime.now() - timedelta(days=365), datetime.now()),
            overall_assessment=overall_assessment,
            backtesting_results=backtesting_results or [],
            statistical_tests=validation_tests,
            performance_analysis={
                "total_tests": len(validation_tests),
                "passed_tests": len([t for t in validation_tests if t.result == ValidationResult.PASS]),
                "failed_tests": len(failed_tests),
                "warning_tests": len(warning_tests)
            },
            regulatory_compliance=regulatory_compliance,
            recommendations=recommendations,
            next_validation_date=datetime.now() + timedelta(days=365)
        )
    
    def _calculate_violation_clustering(self, violations: List[bool]) -> float:
        """Calculate clustering coefficient for violations"""
        
        if len(violations) < 3:
            return 0.0
        
        # Count consecutive violations
        clusters = 0
        in_cluster = False
        
        for violation in violations:
            if violation and not in_cluster:
                clusters += 1
                in_cluster = True
            elif not violation:
                in_cluster = False
        
        # Clustering ratio
        total_violations = sum(violations)
        if total_violations == 0:
            return 0.0
        
        return clusters / total_violations

# Utility functions for model validation

def create_validation_test_suite(
    model_type: ModelType,
    data: Dict[str, Any]
) -> List[ValidationTestResult]:
    """Create appropriate validation test suite for model type"""
    
    validator = ModelValidator()
    tests = []
    
    if model_type == ModelType.VAR_MODEL:
        # VaR-specific tests
        if "returns" in data and "var_estimates" in data:
            backtest_result = validator.validate_var_model(
                data["returns"], data["var_estimates"]
            )
            tests.extend(backtest_result.test_results)
    
    elif model_type == ModelType.GBM_SIMULATION:
        # GBM-specific tests
        if "gbm_params" in data and "historical_data" in data:
            gbm_test = validator.validate_gbm_simulation(
                data["gbm_params"], data["historical_data"]
            )
            tests.append(gbm_test)
    
    # Add general statistical tests
    if "returns" in data:
        stat_validator = StatisticalValidator()
        tests.extend(stat_validator.normality_tests(data["returns"]))
        tests.append(stat_validator.autocorrelation_test(data["returns"]))
        tests.append(stat_validator.heteroskedasticity_test(data["returns"]))
    
    return tests

def assess_model_risk(validation_report: ModelValidationReport) -> Dict[str, Any]:
    """Assess overall model risk based on validation results"""
    
    risk_score = 0
    risk_factors = []
    
    # Failed tests increase risk
    failed_tests = [t for t in validation_report.statistical_tests if t.result == ValidationResult.FAIL]
    risk_score += len(failed_tests) * 20
    
    if failed_tests:
        risk_factors.append(f"{len(failed_tests)} validation tests failed")
    
    # Backtesting failures
    red_zone_models = [br for br in validation_report.backtesting_results if br.red_zone]
    if red_zone_models:
        risk_score += len(red_zone_models) * 30
        risk_factors.append("VaR model in Basel red zone")
    
    # Regulatory non-compliance
    non_compliant = [k for k, v in validation_report.regulatory_compliance.items() if not v]
    if non_compliant:
        risk_score += len(non_compliant) * 15
        risk_factors.append("Regulatory compliance issues")
    
    # Risk categories
    if risk_score < 20:
        risk_category = "LOW"
    elif risk_score < 50:
        risk_category = "MEDIUM"  
    elif risk_score < 80:
        risk_category = "HIGH"
    else:
        risk_category = "CRITICAL"
    
    return {
        "risk_score": min(100, risk_score),
        "risk_category": risk_category,
        "risk_factors": risk_factors,
        "model_approval": risk_category in ["LOW", "MEDIUM"],
        "required_actions": validation_report.recommendations
    }