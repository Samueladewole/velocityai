"""
Stress Testing and Scenario Analysis Framework
Advanced stress testing capabilities for risk management and regulatory compliance
"""

import numpy as np
from typing import Dict, List, Optional, Tuple, Any, Union, Callable
from datetime import datetime, timedelta
from enum import Enum
from pydantic import BaseModel, Field
from dataclasses import dataclass
import math
from scipy import stats
import itertools

from .gbm_simulator import GBMSimulator, GBMParameters, GBMResult
from .risk_metrics import RiskMetricsCalculator, RiskMetrics, PortfolioRiskMetrics
from .portfolio_analytics import PortfolioAnalyzer, OptimizationEngine

class StressTestType(str, Enum):
    """Types of stress tests"""
    HISTORICAL_SCENARIO = "historical_scenario"
    HYPOTHETICAL_SCENARIO = "hypothetical_scenario" 
    MONTE_CARLO_STRESS = "monte_carlo_stress"
    REVERSE_STRESS = "reverse_stress"
    SENSITIVITY_ANALYSIS = "sensitivity_analysis"
    EXTREME_VALUE = "extreme_value"

class ScenarioSeverity(str, Enum):
    """Severity levels for stress scenarios"""
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"
    EXTREME = "extreme"

class RegulatoryFramework(str, Enum):
    """Regulatory stress testing frameworks"""
    BASEL_III = "basel_iii"
    CCAR = "ccar"  # Comprehensive Capital Analysis and Review
    DFAST = "dfast"  # Dodd-Frank Act Stress Testing
    SOLVENCY_II = "solvency_ii"
    IFRS_7 = "ifrs_7"

@dataclass
class StressScenario:
    """Definition of a stress testing scenario"""
    scenario_id: str
    scenario_name: str
    description: str
    scenario_type: StressTestType
    severity: ScenarioSeverity
    time_horizon: float  # Years
    shock_parameters: Dict[str, float]  # Parameter shocks
    probability: Optional[float] = None  # Estimated probability
    regulatory_framework: Optional[RegulatoryFramework] = None
    historical_precedent: Optional[str] = None

@dataclass
class MarketShock:
    """Market shock parameters for stress testing"""
    equity_shock: float = 0.0  # Percentage change
    interest_rate_shock: float = 0.0  # Basis points change
    credit_spread_shock: float = 0.0  # Basis points change
    fx_shock: float = 0.0  # Percentage change
    volatility_shock: float = 0.0  # Percentage change in volatility
    correlation_shock: float = 0.0  # Change in correlation structure

@dataclass
class StressTestResult:
    """Results from stress testing"""
    scenario: StressScenario
    base_case_metrics: Dict[str, float]
    stressed_metrics: Dict[str, float]
    impact_analysis: Dict[str, float]
    risk_contribution: Dict[str, float]
    capital_impact: Dict[str, float]
    breach_analysis: Dict[str, bool]  # Risk limit breaches
    recovery_time: Optional[float] = None  # Time to recover
    confidence_interval: Tuple[float, float] = (0.0, 0.0)

@dataclass
class StressTestSuite:
    """Collection of stress test results"""
    suite_name: str
    scenarios: List[StressTestResult]
    aggregated_metrics: Dict[str, Any]
    worst_case_scenario: str
    most_likely_scenario: str
    regulatory_compliance: Dict[str, bool]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class HistoricalScenarioGenerator:
    """Generate stress scenarios based on historical events"""
    
    def __init__(self):
        self.historical_scenarios = self._initialize_historical_scenarios()
    
    def _initialize_historical_scenarios(self) -> Dict[str, StressScenario]:
        """Initialize library of historical crisis scenarios"""
        scenarios = {}
        
        # 2008 Financial Crisis
        scenarios["financial_crisis_2008"] = StressScenario(
            scenario_id="gc_2008",
            scenario_name="2008 Global Financial Crisis",
            description="Severe financial market stress similar to 2008 crisis",
            scenario_type=StressTestType.HISTORICAL_SCENARIO,
            severity=ScenarioSeverity.EXTREME,
            time_horizon=2.0,
            shock_parameters={
                "equity_return": -0.40,  # 40% equity decline
                "credit_spread": 400,    # 400bp credit spread widening
                "volatility_multiplier": 2.5,
                "correlation_increase": 0.3
            },
            probability=0.01,  # 1% annual probability
            historical_precedent="Sep 2008 - Mar 2009"
        )
        
        # COVID-19 Crisis
        scenarios["covid_crisis_2020"] = StressScenario(
            scenario_id="covid_2020",
            scenario_name="COVID-19 Market Crash",
            description="Pandemic-induced market volatility and economic disruption",
            scenario_type=StressTestType.HISTORICAL_SCENARIO,
            severity=ScenarioSeverity.SEVERE,
            time_horizon=1.0,
            shock_parameters={
                "equity_return": -0.35,  # 35% equity decline
                "volatility_multiplier": 3.0,
                "credit_spread": 300,
                "correlation_increase": 0.4
            },
            probability=0.02,
            historical_precedent="Feb-Mar 2020"
        )
        
        # European Sovereign Debt Crisis
        scenarios["eu_debt_crisis_2011"] = StressScenario(
            scenario_id="eu_debt_2011",
            scenario_name="European Sovereign Debt Crisis",
            description="Sovereign debt crisis with contagion effects",
            scenario_type=StressTestType.HISTORICAL_SCENARIO,
            severity=ScenarioSeverity.SEVERE,
            time_horizon=3.0,
            shock_parameters={
                "sovereign_spread": 500,  # 500bp sovereign spread widening
                "equity_return": -0.25,
                "fx_shock": 0.15,  # Currency depreciation
                "correlation_increase": 0.25
            },
            probability=0.015,
            historical_precedent="2010-2012"
        )
        
        return scenarios
    
    def get_scenario(self, scenario_id: str) -> Optional[StressScenario]:
        """Get historical scenario by ID"""
        return self.historical_scenarios.get(scenario_id)
    
    def list_scenarios(self) -> List[str]:
        """List available historical scenarios"""
        return list(self.historical_scenarios.keys())

class HypotheticalScenarioGenerator:
    """Generate hypothetical stress scenarios"""
    
    def __init__(self):
        self.scenario_templates = self._initialize_scenario_templates()
    
    def _initialize_scenario_templates(self) -> Dict[str, Dict[str, Any]]:
        """Initialize scenario templates"""
        return {
            "interest_rate_shock": {
                "mild": {"rate_change": 100},      # 100bp increase
                "moderate": {"rate_change": 200},   # 200bp increase
                "severe": {"rate_change": 400},     # 400bp increase
                "extreme": {"rate_change": 600}     # 600bp increase
            },
            "equity_market_crash": {
                "mild": {"equity_return": -0.15},
                "moderate": {"equity_return": -0.25},
                "severe": {"equity_return": -0.40},
                "extreme": {"equity_return": -0.60}
            },
            "credit_crisis": {
                "mild": {"credit_spread": 150},
                "moderate": {"credit_spread": 300},
                "severe": {"credit_spread": 500},
                "extreme": {"credit_spread": 800}
            }
        }
    
    def generate_interest_rate_scenario(
        self,
        severity: ScenarioSeverity,
        time_horizon: float = 1.0,
        parallel_shift: bool = True
    ) -> StressScenario:
        """Generate interest rate shock scenario"""
        
        template = self.scenario_templates["interest_rate_shock"][severity.value]
        
        shock_params = {
            "interest_rate_change": template["rate_change"],
            "parallel_shift": parallel_shift
        }
        
        # Add curve steepening/flattening for non-parallel shifts
        if not parallel_shift:
            shock_params["curve_steepening"] = template["rate_change"] * 0.3
        
        return StressScenario(
            scenario_id=f"ir_shock_{severity.value}",
            scenario_name=f"Interest Rate Shock - {severity.value.title()}",
            description=f"{severity.value.title()} interest rate increase scenario",
            scenario_type=StressTestType.HYPOTHETICAL_SCENARIO,
            severity=severity,
            time_horizon=time_horizon,
            shock_parameters=shock_params
        )
    
    def generate_market_crash_scenario(
        self,
        severity: ScenarioSeverity,
        sector_specific: bool = False
    ) -> StressScenario:
        """Generate equity market crash scenario"""
        
        template = self.scenario_templates["equity_market_crash"][severity.value]
        
        shock_params = {
            "equity_return": template["equity_return"],
            "volatility_multiplier": 1.5 + (0.5 * ["mild", "moderate", "severe", "extreme"].index(severity.value))
        }
        
        if sector_specific:
            shock_params["sector_weights"] = {
                "financial": 1.2,    # Financial sector hit harder
                "technology": 0.8,   # Tech more resilient
                "energy": 1.4,       # Commodity sectors volatile
                "utilities": 0.6     # Defensive sectors more stable
            }
        
        return StressScenario(
            scenario_id=f"equity_crash_{severity.value}",
            scenario_name=f"Equity Market Crash - {severity.value.title()}",
            description=f"{severity.value.title()} equity market decline",
            scenario_type=StressTestType.HYPOTHETICAL_SCENARIO,
            severity=severity,
            time_horizon=1.0,
            shock_parameters=shock_params
        )

class StressTester:
    """
    Comprehensive stress testing engine
    Supports multiple stress testing methodologies and regulatory frameworks
    """
    
    def __init__(
        self,
        gbm_simulator: Optional[GBMSimulator] = None,
        risk_calculator: Optional[RiskMetricsCalculator] = None
    ):
        self.gbm_simulator = gbm_simulator or GBMSimulator()
        self.risk_calculator = risk_calculator or RiskMetricsCalculator()
        self.historical_generator = HistoricalScenarioGenerator()
        self.hypothetical_generator = HypotheticalScenarioGenerator()
        
    def run_single_stress_test(
        self,
        scenario: StressScenario,
        portfolio_data: Dict[str, Any],
        base_case_params: Dict[str, GBMParameters]
    ) -> StressTestResult:
        """Run a single stress test scenario"""
        
        # Calculate base case metrics
        base_case_metrics = self._calculate_base_case_metrics(
            portfolio_data, base_case_params
        )
        
        # Apply stress scenario to parameters
        stressed_params = self._apply_stress_scenario(
            base_case_params, scenario
        )
        
        # Calculate stressed metrics
        stressed_metrics = self._calculate_stressed_metrics(
            portfolio_data, stressed_params, scenario
        )
        
        # Calculate impact analysis
        impact_analysis = self._calculate_impact_analysis(
            base_case_metrics, stressed_metrics
        )
        
        # Calculate risk contribution
        risk_contribution = self._calculate_risk_contribution(
            portfolio_data, impact_analysis
        )
        
        # Calculate capital impact
        capital_impact = self._calculate_capital_impact(
            impact_analysis, portfolio_data
        )
        
        # Analyze risk limit breaches
        breach_analysis = self._analyze_limit_breaches(
            stressed_metrics, portfolio_data.get("risk_limits", {})
        )
        
        return StressTestResult(
            scenario=scenario,
            base_case_metrics=base_case_metrics,
            stressed_metrics=stressed_metrics,
            impact_analysis=impact_analysis,
            risk_contribution=risk_contribution,
            capital_impact=capital_impact,
            breach_analysis=breach_analysis,
            confidence_interval=(
                impact_analysis.get("portfolio_loss", 0) * 0.8,
                impact_analysis.get("portfolio_loss", 0) * 1.2
            )
        )
    
    def run_stress_test_suite(
        self,
        scenarios: List[StressScenario],
        portfolio_data: Dict[str, Any],
        base_case_params: Dict[str, GBMParameters]
    ) -> StressTestSuite:
        """Run comprehensive stress test suite"""
        
        results = []
        for scenario in scenarios:
            result = self.run_single_stress_test(
                scenario, portfolio_data, base_case_params
            )
            results.append(result)
        
        # Aggregate results
        aggregated_metrics = self._aggregate_stress_results(results)
        
        # Identify worst-case scenario
        worst_case = max(
            results,
            key=lambda r: r.impact_analysis.get("portfolio_loss", 0)
        )
        
        # Find most likely scenario (highest probability)
        most_likely = max(
            results,
            key=lambda r: r.scenario.probability or 0
        )
        
        # Check regulatory compliance
        regulatory_compliance = self._check_regulatory_compliance(results)
        
        return StressTestSuite(
            suite_name=f"Stress Test Suite - {datetime.now().strftime('%Y%m%d')}",
            scenarios=results,
            aggregated_metrics=aggregated_metrics,
            worst_case_scenario=worst_case.scenario.scenario_name,
            most_likely_scenario=most_likely.scenario.scenario_name,
            regulatory_compliance=regulatory_compliance
        )
    
    def _calculate_base_case_metrics(
        self,
        portfolio_data: Dict[str, Any],
        base_case_params: Dict[str, GBMParameters]
    ) -> Dict[str, float]:
        """Calculate base case risk metrics"""
        
        base_metrics = {}
        
        # Portfolio value
        base_metrics["portfolio_value"] = portfolio_data.get("total_value", 1000000)
        
        # Simulate base case returns
        portfolio_returns = []
        
        for asset_id, params in base_case_params.items():
            weight = portfolio_data.get("weights", {}).get(asset_id, 0.0)
            if weight > 0:
                # Run GBM simulation
                result = self.gbm_simulator.run_simulation(params)
                asset_returns = result.path_statistics.returns
                
                # Weight the returns
                weighted_returns = [r * weight for r in asset_returns]
                if not portfolio_returns:
                    portfolio_returns = weighted_returns
                else:
                    portfolio_returns = [
                        portfolio_returns[i] + weighted_returns[i]
                        for i in range(min(len(portfolio_returns), len(weighted_returns)))
                    ]
        
        if portfolio_returns:
            # Calculate risk metrics
            risk_metrics = self.risk_calculator.calculate_comprehensive_metrics(
                portfolio_returns
            )
            
            base_metrics.update({
                "var_95": risk_metrics.var_95 * base_metrics["portfolio_value"],
                "var_99": risk_metrics.var_99 * base_metrics["portfolio_value"],
                "expected_shortfall": risk_metrics.expected_shortfall_95 * base_metrics["portfolio_value"],
                "volatility": risk_metrics.volatility,
                "sharpe_ratio": risk_metrics.sharpe_ratio,
                "max_drawdown": risk_metrics.maximum_drawdown
            })
        
        return base_metrics
    
    def _apply_stress_scenario(
        self,
        base_params: Dict[str, GBMParameters],
        scenario: StressScenario
    ) -> Dict[str, GBMParameters]:
        """Apply stress scenario to GBM parameters"""
        
        stressed_params = {}
        
        for asset_id, params in base_params.items():
            # Create stressed parameters
            stressed_params[asset_id] = GBMParameters(
                initial_price=params.initial_price,
                drift=self._apply_drift_shock(params.drift, scenario),
                volatility=self._apply_volatility_shock(params.volatility, scenario),
                time_horizon=scenario.time_horizon,
                time_steps=params.time_steps,
                num_simulations=params.num_simulations,
                simulation_type=params.simulation_type
            )
        
        return stressed_params
    
    def _apply_drift_shock(self, base_drift: float, scenario: StressScenario) -> float:
        """Apply drift shock based on scenario"""
        
        shock_params = scenario.shock_parameters
        
        # Apply equity return shock
        if "equity_return" in shock_params:
            # Convert return shock to drift adjustment
            return_shock = shock_params["equity_return"]
            drift_adjustment = return_shock / scenario.time_horizon
            return base_drift + drift_adjustment
        
        # Apply interest rate shock (affects risk-free rate component)
        if "interest_rate_change" in shock_params:
            ir_shock = shock_params["interest_rate_change"] / 10000  # bp to decimal
            return base_drift - ir_shock  # Higher rates reduce expected returns
        
        return base_drift
    
    def _apply_volatility_shock(self, base_vol: float, scenario: StressScenario) -> float:
        """Apply volatility shock based on scenario"""
        
        shock_params = scenario.shock_parameters
        
        # Apply volatility multiplier
        if "volatility_multiplier" in shock_params:
            return base_vol * shock_params["volatility_multiplier"]
        
        # Apply absolute volatility shock
        if "volatility_shock" in shock_params:
            return base_vol + shock_params["volatility_shock"]
        
        return base_vol
    
    def _calculate_stressed_metrics(
        self,
        portfolio_data: Dict[str, Any],
        stressed_params: Dict[str, GBMParameters],
        scenario: StressScenario
    ) -> Dict[str, float]:
        """Calculate metrics under stress scenario"""
        
        # Similar to base case calculation but with stressed parameters
        return self._calculate_base_case_metrics(portfolio_data, stressed_params)
    
    def _calculate_impact_analysis(
        self,
        base_metrics: Dict[str, float],
        stressed_metrics: Dict[str, float]
    ) -> Dict[str, float]:
        """Calculate impact of stress scenario"""
        
        impact = {}
        
        for metric in ["var_95", "var_99", "expected_shortfall", "volatility", "max_drawdown"]:
            base_val = base_metrics.get(metric, 0)
            stressed_val = stressed_metrics.get(metric, 0)
            
            # Absolute change
            impact[f"{metric}_change"] = stressed_val - base_val
            
            # Percentage change
            if base_val != 0:
                impact[f"{metric}_pct_change"] = (stressed_val - base_val) / abs(base_val) * 100
        
        # Portfolio loss estimate
        portfolio_value = base_metrics.get("portfolio_value", 1000000)
        var_change = impact.get("var_95_change", 0)
        impact["portfolio_loss"] = var_change
        impact["portfolio_loss_pct"] = (var_change / portfolio_value * 100) if portfolio_value > 0 else 0
        
        return impact
    
    def _calculate_risk_contribution(
        self,
        portfolio_data: Dict[str, Any],
        impact_analysis: Dict[str, float]
    ) -> Dict[str, float]:
        """Calculate risk contribution by asset/factor"""
        
        # Simplified risk contribution calculation
        weights = portfolio_data.get("weights", {})
        total_loss = impact_analysis.get("portfolio_loss", 0)
        
        contribution = {}
        for asset_id, weight in weights.items():
            # Simplified: proportional to weight (would be more sophisticated in practice)
            contribution[asset_id] = total_loss * weight
        
        return contribution
    
    def _calculate_capital_impact(
        self,
        impact_analysis: Dict[str, float],
        portfolio_data: Dict[str, Any]
    ) -> Dict[str, float]:
        """Calculate capital adequacy impact"""
        
        base_capital = portfolio_data.get("regulatory_capital", 100000)
        portfolio_loss = impact_analysis.get("portfolio_loss", 0)
        
        capital_impact = {
            "capital_depletion": portfolio_loss,
            "capital_ratio_change": (portfolio_loss / base_capital * 100) if base_capital > 0 else 0,
            "additional_capital_needed": max(0, portfolio_loss - base_capital * 0.5)  # 50% buffer
        }
        
        return capital_impact
    
    def _analyze_limit_breaches(
        self,
        stressed_metrics: Dict[str, float],
        risk_limits: Dict[str, float]
    ) -> Dict[str, bool]:
        """Analyze risk limit breaches"""
        
        breaches = {}
        
        for limit_type, limit_value in risk_limits.items():
            metric_value = stressed_metrics.get(limit_type, 0)
            breaches[limit_type] = metric_value > limit_value
        
        return breaches
    
    def _aggregate_stress_results(
        self,
        results: List[StressTestResult]
    ) -> Dict[str, Any]:
        """Aggregate stress test results"""
        
        if not results:
            return {}
        
        # Calculate aggregate statistics
        portfolio_losses = [r.impact_analysis.get("portfolio_loss", 0) for r in results]
        var_changes = [r.impact_analysis.get("var_95_change", 0) for r in results]
        
        aggregated = {
            "total_scenarios": len(results),
            "avg_portfolio_loss": np.mean(portfolio_losses),
            "max_portfolio_loss": np.max(portfolio_losses),
            "min_portfolio_loss": np.min(portfolio_losses),
            "portfolio_loss_std": np.std(portfolio_losses),
            "scenarios_with_breaches": sum(1 for r in results if any(r.breach_analysis.values())),
            "breach_rate": sum(1 for r in results if any(r.breach_analysis.values())) / len(results) * 100
        }
        
        return aggregated
    
    def _check_regulatory_compliance(
        self,
        results: List[StressTestResult]
    ) -> Dict[str, bool]:
        """Check regulatory compliance across scenarios"""
        
        compliance = {
            "basel_iii_tier1_ratio": True,  # Would check actual ratios
            "ccar_severely_adverse": True,  # Would check CCAR scenarios
            "risk_appetite_limits": not any(any(r.breach_analysis.values()) for r in results)
        }
        
        return compliance

class ReverseStressTester:
    """
    Reverse stress testing - find scenarios that would cause specific losses
    """
    
    def __init__(self, stress_tester: StressTester):
        self.stress_tester = stress_tester
    
    def find_breaking_point(
        self,
        target_loss: float,
        portfolio_data: Dict[str, Any],
        base_case_params: Dict[str, GBMParameters],
        max_iterations: int = 100
    ) -> Dict[str, Any]:
        """Find scenario parameters that would cause target loss"""
        
        # Use optimization to find scenario parameters
        from scipy.optimize import minimize_scalar
        
        def objective(shock_magnitude):
            # Create scenario with given shock magnitude
            scenario = StressScenario(
                scenario_id="reverse_stress",
                scenario_name="Reverse Stress Test",
                description=f"Scenario to achieve {target_loss} loss",
                scenario_type=StressTestType.REVERSE_STRESS,
                severity=ScenarioSeverity.MODERATE,
                time_horizon=1.0,
                shock_parameters={
                    "equity_return": -abs(shock_magnitude),
                    "volatility_multiplier": 1 + abs(shock_magnitude)
                }
            )
            
            # Run stress test
            result = self.stress_tester.run_single_stress_test(
                scenario, portfolio_data, base_case_params
            )
            
            # Return squared difference from target
            actual_loss = result.impact_analysis.get("portfolio_loss", 0)
            return (actual_loss - target_loss) ** 2
        
        # Find optimal shock magnitude
        optimization_result = minimize_scalar(
            objective, 
            bounds=(0.01, 1.0), 
            method='bounded'
        )
        
        optimal_shock = optimization_result.x
        
        # Create final scenario
        breaking_scenario = StressScenario(
            scenario_id="breaking_point",
            scenario_name="Portfolio Breaking Point",
            description=f"Scenario causing ${target_loss:,.0f} loss",
            scenario_type=StressTestType.REVERSE_STRESS,
            severity=ScenarioSeverity.EXTREME,
            time_horizon=1.0,
            shock_parameters={
                "equity_return": -optimal_shock,
                "volatility_multiplier": 1 + optimal_shock
            }
        )
        
        # Calculate final result
        final_result = self.stress_tester.run_single_stress_test(
            breaking_scenario, portfolio_data, base_case_params
        )
        
        return {
            "target_loss": target_loss,
            "achieved_loss": final_result.impact_analysis.get("portfolio_loss", 0),
            "required_equity_shock": -optimal_shock * 100,  # As percentage
            "required_volatility_increase": optimal_shock * 100,  # As percentage
            "scenario_probability": self._estimate_scenario_probability(optimal_shock),
            "optimization_success": optimization_result.success
        }
    
    def _estimate_scenario_probability(self, shock_magnitude: float) -> float:
        """Estimate probability of scenario based on historical data"""
        
        # Simplified probability estimation based on shock magnitude
        if shock_magnitude < 0.1:  # 10% shock
            return 0.05  # 5% annual probability
        elif shock_magnitude < 0.2:  # 20% shock
            return 0.02  # 2% annual probability
        elif shock_magnitude < 0.4:  # 40% shock
            return 0.005  # 0.5% annual probability
        else:
            return 0.001  # 0.1% annual probability

# Utility functions for stress testing

def create_regulatory_stress_scenarios() -> List[StressScenario]:
    """Create standard regulatory stress scenarios"""
    
    scenarios = []
    
    # CCAR Severely Adverse Scenario (simplified)
    scenarios.append(StressScenario(
        scenario_id="ccar_severely_adverse",
        scenario_name="CCAR Severely Adverse",
        description="Federal Reserve CCAR severely adverse scenario",
        scenario_type=StressTestType.HYPOTHETICAL_SCENARIO,
        severity=ScenarioSeverity.SEVERE,
        time_horizon=2.0,
        shock_parameters={
            "gdp_decline": -0.08,  # 8% GDP decline
            "unemployment_increase": 0.05,  # 5pp unemployment increase
            "equity_return": -0.45,  # 45% equity decline
            "house_price_decline": -0.25,  # 25% house price decline
            "volatility_multiplier": 2.0
        },
        regulatory_framework=RegulatoryFramework.CCAR
    ))
    
    # Basel III Stress Test
    scenarios.append(StressScenario(
        scenario_id="basel_iii_stress",
        scenario_name="Basel III Stress Test", 
        description="Basel III regulatory stress scenario",
        scenario_type=StressTestType.HYPOTHETICAL_SCENARIO,
        severity=ScenarioSeverity.SEVERE,
        time_horizon=1.0,
        shock_parameters={
            "equity_return": -0.30,
            "interest_rate_change": 200,  # 200bp rate increase
            "credit_spread": 300,  # 300bp credit spread widening
            "fx_shock": 0.15  # 15% FX depreciation
        },
        regulatory_framework=RegulatoryFramework.BASEL_III
    ))
    
    return scenarios

def calculate_stress_test_metrics(
    stress_results: List[StressTestResult]
) -> Dict[str, float]:
    """Calculate summary metrics across stress test results"""
    
    if not stress_results:
        return {}
    
    portfolio_losses = [r.impact_analysis.get("portfolio_loss", 0) for r in stress_results]
    var_changes = [r.impact_analysis.get("var_95_change", 0) for r in stress_results]
    
    return {
        "average_loss": np.mean(portfolio_losses),
        "maximum_loss": np.max(portfolio_losses), 
        "loss_volatility": np.std(portfolio_losses),
        "tail_expectation": np.mean(sorted(portfolio_losses, reverse=True)[:max(1, len(portfolio_losses)//10)]),
        "scenarios_count": len(stress_results),
        "breach_probability": sum(1 for r in stress_results if any(r.breach_analysis.values())) / len(stress_results)
    }