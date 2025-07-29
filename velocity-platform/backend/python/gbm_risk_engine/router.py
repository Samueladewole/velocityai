"""
GBM Risk Engine API Router
REST API endpoints for Geometric Brownian Motion risk modeling and quantitative analysis
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import Dict, List, Optional, Any
from datetime import datetime
import asyncio
import json

from .gbm_simulator import GBMSimulator, GBMParameters, SimulationType
from .risk_metrics import RiskMetricsCalculator, RiskMetrics
from .fair_integration import FAIRRiskEngine, FAIRParameters, ThreatType, LossType
from .hubbard_estimation import HubbardEstimator, EstimationType, CalibrationLevel
from .portfolio_analytics import (
    PortfolioAnalyzer, OptimizationEngine, OptimizationObjective,
    AssetParameters, OptimizationConstraints, CorrelationEstimator
)
from .stress_testing import (
    StressTester, StressScenario, StressTestType, ScenarioSeverity,
    HistoricalScenarioGenerator, HypotheticalScenarioGenerator
)
from .validation_engine import ModelValidator, ModelType, ValidationTest

from ..shared.auth import get_current_user, require_permission
from ..shared.models import APIResponse
from pydantic import BaseModel

router = APIRouter(prefix="/gbm-risk", tags=["GBM Risk Engine"])

# Request/Response Models
class GBMSimulationRequest(BaseModel):
    initial_price: float
    drift: float
    volatility: float
    time_horizon: float
    time_steps: int
    num_simulations: int
    simulation_type: SimulationType = SimulationType.SINGLE_ASSET
    seed: Optional[int] = None

class RiskMetricsRequest(BaseModel):
    returns: List[float]
    initial_value: float = 100.0
    benchmark_returns: Optional[List[float]] = None

class FAIRAnalysisRequest(BaseModel):
    threat_type: ThreatType
    threat_frequency_min: float
    threat_frequency_most_likely: float
    threat_frequency_max: float
    primary_loss_initial: float
    primary_loss_drift: float
    primary_loss_volatility: float
    primary_loss_min: float
    primary_loss_max: float
    vulnerability_score: float = 0.5
    threat_capability: float = 0.5
    organizational_resilience: float = 0.5

class HubbardEstimationRequest(BaseModel):
    expert_id: str
    parameter_name: str
    estimation_type: EstimationType
    context: str
    confidence_level: str = "90"

class PortfolioOptimizationRequest(BaseModel):
    assets: List[Dict[str, Any]]  # Asset parameters
    correlation_matrix: List[List[float]]
    objective: OptimizationObjective
    constraints: Optional[Dict[str, Any]] = None
    risk_free_rate: float = 0.02

class StressTestRequest(BaseModel):
    scenarios: List[Dict[str, Any]]  # Stress scenarios
    portfolio_data: Dict[str, Any]
    base_case_parameters: Dict[str, Dict[str, Any]]

class ValidationRequest(BaseModel):
    model_type: ModelType
    validation_data: Dict[str, Any]

# Dependency injection
def get_gbm_simulator() -> GBMSimulator:
    return GBMSimulator()

def get_risk_calculator() -> RiskMetricsCalculator:
    return RiskMetricsCalculator()

def get_fair_engine() -> FAIRRiskEngine:
    return FAIRRiskEngine()

def get_hubbard_estimator() -> HubbardEstimator:
    return HubbardEstimator()

def get_portfolio_analyzer() -> PortfolioAnalyzer:
    return PortfolioAnalyzer()

def get_stress_tester() -> StressTester:
    return StressTester()

def get_model_validator() -> ModelValidator:
    return ModelValidator()

# GBM Simulation Endpoints

@router.post("/simulate/gbm", response_model=APIResponse)
async def run_gbm_simulation(
    request: GBMSimulationRequest,
    simulator: GBMSimulator = Depends(get_gbm_simulator),
    current_user = Depends(get_current_user),
    _permission_check = Depends(require_permission("risk_modeling"))
):
    """Run Geometric Brownian Motion simulation"""
    
    try:
        # Create GBM parameters
        params = GBMParameters(
            initial_price=request.initial_price,
            drift=request.drift,
            volatility=request.volatility,
            time_horizon=request.time_horizon,
            time_steps=request.time_steps,
            num_simulations=request.num_simulations,
            simulation_type=request.simulation_type,
            seed=request.seed
        )
        
        # Run simulation
        result = simulator.run_simulation(params)
        
        # Format response
        response_data = {
            "simulation_id": f"gbm_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "parameters": {
                "initial_price": params.initial_price,
                "drift": params.drift,
                "volatility": params.volatility,
                "time_horizon": params.time_horizon,
                "simulations": params.num_simulations
            },
            "results": {
                "final_prices": result.path_statistics.final_prices[:100],  # Limit response size
                "returns": result.path_statistics.returns[:100],
                "statistical_moments": {
                    "mean": result.statistical_moments.mean,
                    "std_dev": result.statistical_moments.standard_deviation,
                    "skewness": result.statistical_moments.skewness,
                    "kurtosis": result.statistical_moments.kurtosis,
                    "median": result.statistical_moments.median
                },
                "performance_metrics": result.simulation_metadata
            }
        }
        
        return APIResponse(
            success=True,
            data=response_data,
            message="GBM simulation completed successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GBM simulation failed: {str(e)}")

# Risk Metrics Endpoints

@router.post("/risk-metrics/calculate", response_model=APIResponse)
async def calculate_risk_metrics(
    request: RiskMetricsRequest,
    calculator: RiskMetricsCalculator = Depends(get_risk_calculator),
    current_user = Depends(get_current_user),
    _permission_check = Depends(require_permission("risk_analysis"))
):
    """Calculate comprehensive risk metrics"""
    
    try:
        # Calculate risk metrics
        metrics = calculator.calculate_comprehensive_metrics(
            request.returns,
            request.initial_value,
            request.benchmark_returns
        )
        
        response_data = {
            "risk_metrics": {
                "var_95": metrics.var_95,
                "var_99": metrics.var_99,
                "expected_shortfall_95": metrics.expected_shortfall_95,
                "expected_shortfall_99": metrics.expected_shortfall_99,
                "volatility": metrics.volatility,
                "sharpe_ratio": metrics.sharpe_ratio,
                "sortino_ratio": metrics.sortino_ratio,
                "maximum_drawdown": metrics.maximum_drawdown,
                "skewness": metrics.skewness,
                "kurtosis": metrics.kurtosis,
                "tail_risk": metrics.tail_risk
            },
            "analysis": {
                "total_observations": len(request.returns),
                "probability_of_loss": metrics.probability_of_loss,
                "risk_adjusted_return": metrics.risk_adjusted_return
            }
        }
        
        return APIResponse(
            success=True,
            data=response_data,
            message="Risk metrics calculated successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk calculation failed: {str(e)}")

# FAIR Risk Analysis Endpoints

@router.post("/fair/analyze", response_model=APIResponse)
async def run_fair_analysis(
    request: FAIRAnalysisRequest,
    fair_engine: FAIRRiskEngine = Depends(get_fair_engine),
    current_user = Depends(get_current_user),
    _permission_check = Depends(require_permission("risk_modeling"))
):
    """Run FAIR (Factor Analysis of Information Risk) analysis"""
    
    try:
        # Import required classes
        from .fair_integration import ThreatEventFrequency, LossMagnitude, FAIRParameters
        from .gbm_simulator import GBMParameters
        
        # Create FAIR parameters
        threat_frequency = ThreatEventFrequency(
            min_frequency=request.threat_frequency_min,
            most_likely_frequency=request.threat_frequency_most_likely,
            max_frequency=request.threat_frequency_max
        )
        
        primary_loss = LossMagnitude(
            loss_type=LossType.PRIMARY_LOSS,
            gbm_parameters=GBMParameters(
                initial_price=request.primary_loss_initial,
                drift=request.primary_loss_drift,
                volatility=request.primary_loss_volatility,
                time_horizon=1.0,
                time_steps=12,
                num_simulations=10000
            ),
            minimum_loss=request.primary_loss_min,
            maximum_loss=request.primary_loss_max
        )
        
        fair_params = FAIRParameters(
            threat_type=request.threat_type,
            threat_event_frequency=threat_frequency,
            primary_loss=primary_loss,
            vulnerability_score=request.vulnerability_score,
            threat_capability=request.threat_capability,
            organizational_resilience=request.organizational_resilience
        )
        
        # Run FAIR analysis
        result = fair_engine.run_fair_analysis(fair_params)
        
        response_data = {
            "fair_analysis": {
                "threat_type": result.threat_type,
                "annual_loss_expectancy": result.annual_loss_expectancy,
                "var_95": result.var_95,
                "var_99": result.var_99,
                "expected_shortfall": result.expected_shortfall,
                "risk_score": result.risk_score,
                "risk_rating": result.risk_rating,
                "confidence_interval": result.confidence_interval,
                "primary_loss_contribution": result.primary_loss_contribution,
                "secondary_loss_contribution": result.secondary_loss_contribution
            },
            "recommendations": result.recommendations,
            "metadata": result.simulation_metadata
        }
        
        return APIResponse(
            success=True,
            data=response_data,
            message="FAIR analysis completed successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"FAIR analysis failed: {str(e)}")

# Hubbard Estimation Endpoints

@router.post("/hubbard/estimate", response_model=APIResponse)
async def create_hubbard_estimate(
    request: HubbardEstimationRequest,
    estimator: HubbardEstimator = Depends(get_hubbard_estimator),
    current_user = Depends(get_current_user),
    _permission_check = Depends(require_permission("risk_estimation"))
):
    """Create Hubbard 5-point estimate"""
    
    try:
        # Ensure expert profile exists (create if needed)
        if request.expert_id not in estimator.expert_profiles:
            estimator.create_expert_profile(
                expert_id=request.expert_id,
                name=f"Expert {request.expert_id}",
                domain_expertise=["risk_analysis"],
                years_experience=5
            )
        
        # Run guided estimation session
        estimate = estimator.guided_estimation_session(
            expert_id=request.expert_id,
            parameter_name=request.parameter_name,
            estimation_type=request.estimation_type,
            context=request.context,
            confidence_level=request.confidence_level
        )
        
        response_data = {
            "estimate": {
                "parameter_name": estimate.parameter_name,
                "estimation_type": estimate.estimation_type,
                "confidence_interval": estimate.confidence_interval,
                "lower_bound": estimate.lower_bound,
                "upper_bound": estimate.upper_bound,
                "median": estimate.median,
                "confidence_lower": estimate.confidence_lower,
                "confidence_upper": estimate.confidence_upper,
                "units": estimate.units,
                "uncertainty_level": estimate.uncertainty_level
            },
            "expert_info": {
                "expert_id": estimate.estimator_id,
                "calibration_level": estimate.calibration_level
            }
        }
        
        return APIResponse(
            success=True,
            data=response_data,
            message="Hubbard estimate created successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hubbard estimation failed: {str(e)}")

# Portfolio Analytics Endpoints

@router.post("/portfolio/optimize", response_model=APIResponse)
async def optimize_portfolio(
    request: PortfolioOptimizationRequest,
    analyzer: PortfolioAnalyzer = Depends(get_portfolio_analyzer),
    current_user = Depends(get_current_user),
    _permission_check = Depends(require_permission("portfolio_optimization"))
):
    """Optimize portfolio allocation"""
    
    try:
        # Import required classes
        from .portfolio_analytics import AssetParameters, OptimizationConstraints, CorrelationMatrix, OptimizationEngine
        import numpy as np
        
        # Convert request to AssetParameters
        assets = []
        for asset_data in request.assets:
            asset = AssetParameters(
                asset_id=asset_data["asset_id"],
                asset_name=asset_data["asset_name"],
                expected_return=asset_data["expected_return"],
                volatility=asset_data["volatility"],
                current_weight=asset_data["current_weight"],
                min_weight=asset_data.get("min_weight", 0.0),
                max_weight=asset_data.get("max_weight", 1.0),
                sector=asset_data.get("sector")
            )
            assets.append(asset)
        
        # Create correlation matrix
        correlation_matrix = CorrelationMatrix(
            matrix=np.array(request.correlation_matrix),
            asset_ids=[asset.asset_id for asset in assets],
            estimation_method="historical",
            observation_period=252,
            confidence_level=0.95,
            eigenvalues=np.linalg.eigvals(np.array(request.correlation_matrix)).tolist(),
            condition_number=1.0,
            is_positive_definite=True
        )
        
        # Create constraints
        constraints = OptimizationConstraints()
        if request.constraints:
            constraints.min_weights = request.constraints.get("min_weights", {})
            constraints.max_weights = request.constraints.get("max_weights", {})
            constraints.target_return = request.constraints.get("target_return")
            constraints.max_variance = request.constraints.get("max_variance")
        
        # Run optimization
        optimizer = OptimizationEngine()
        result = optimizer.optimize_portfolio(
            assets=assets,
            correlation_matrix=correlation_matrix,
            objective=request.objective,
            constraints=constraints,
            risk_free_rate=request.risk_free_rate
        )
        
        response_data = {
            "optimization": {
                "objective": result.objective,
                "optimal_weights": result.optimal_weights,
                "expected_return": result.expected_return,
                "expected_volatility": result.expected_volatility,
                "sharpe_ratio": result.sharpe_ratio,
                "optimization_status": result.optimization_status,
                "turnover": result.turnover,
                "transaction_costs": result.transaction_costs
            },
            "risk_metrics": {
                "portfolio_var_95": result.risk_metrics.portfolio_var_95,
                "portfolio_var_99": result.risk_metrics.portfolio_var_99,
                "diversification_ratio": result.risk_metrics.diversification_ratio,
                "concentration_risk": result.risk_metrics.concentration_risk
            },
            "sensitivity_analysis": result.sensitivity_analysis
        }
        
        return APIResponse(
            success=True,
            data=response_data,
            message="Portfolio optimization completed successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Portfolio optimization failed: {str(e)}")

# Stress Testing Endpoints

@router.post("/stress-test/run", response_model=APIResponse)
async def run_stress_test(
    request: StressTestRequest,
    stress_tester: StressTester = Depends(get_stress_tester),
    current_user = Depends(get_current_user),
    _permission_check = Depends(require_permission("stress_testing"))
):
    """Run comprehensive stress testing"""
    
    try:
        # Convert scenarios
        scenarios = []
        for scenario_data in request.scenarios:
            scenario = StressScenario(
                scenario_id=scenario_data["scenario_id"],
                scenario_name=scenario_data["scenario_name"],
                description=scenario_data["description"],
                scenario_type=StressTestType(scenario_data["scenario_type"]),
                severity=ScenarioSeverity(scenario_data["severity"]),
                time_horizon=scenario_data["time_horizon"],
                shock_parameters=scenario_data["shock_parameters"],
                probability=scenario_data.get("probability")
            )
            scenarios.append(scenario)
        
        # Convert base case parameters
        base_params = {}
        from .gbm_simulator import GBMParameters
        
        for asset_id, param_data in request.base_case_parameters.items():
            params = GBMParameters(
                initial_price=param_data["initial_price"],
                drift=param_data["drift"],
                volatility=param_data["volatility"],
                time_horizon=param_data["time_horizon"],
                time_steps=param_data["time_steps"],
                num_simulations=param_data["num_simulations"]
            )
            base_params[asset_id] = params
        
        # Run stress test suite
        suite_result = stress_tester.run_stress_test_suite(
            scenarios=scenarios,
            portfolio_data=request.portfolio_data,
            base_case_params=base_params
        )
        
        # Format results
        scenario_results = []
        for result in suite_result.scenarios:
            scenario_results.append({
                "scenario_name": result.scenario.scenario_name,
                "severity": result.scenario.severity,
                "portfolio_loss": result.impact_analysis.get("portfolio_loss", 0),
                "portfolio_loss_pct": result.impact_analysis.get("portfolio_loss_pct", 0),
                "var_95_change": result.impact_analysis.get("var_95_change", 0),
                "breach_analysis": result.breach_analysis,
                "capital_impact": result.capital_impact
            })
        
        response_data = {
            "stress_test_suite": {
                "suite_name": suite_result.suite_name,
                "total_scenarios": len(scenario_results),
                "worst_case_scenario": suite_result.worst_case_scenario,
                "most_likely_scenario": suite_result.most_likely_scenario
            },
            "scenario_results": scenario_results,
            "aggregated_metrics": suite_result.aggregated_metrics,
            "regulatory_compliance": suite_result.regulatory_compliance
        }
        
        return APIResponse(
            success=True,
            data=response_data,
            message="Stress testing completed successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stress testing failed: {str(e)}")

# Model Validation Endpoints

@router.post("/validation/run", response_model=APIResponse)
async def run_model_validation(
    request: ValidationRequest,
    validator: ModelValidator = Depends(get_model_validator),
    current_user = Depends(get_current_user),
    _permission_check = Depends(require_permission("model_validation"))
):
    """Run comprehensive model validation"""
    
    try:
        # Create validation test suite
        from .validation_engine import create_validation_test_suite
        
        validation_tests = create_validation_test_suite(
            model_type=request.model_type,
            data=request.validation_data
        )
        
        # Generate validation report
        validation_report = validator.generate_validation_report(
            model_name=request.validation_data.get("model_name", "Unknown Model"),
            model_type=request.model_type,
            validation_tests=validation_tests
        )
        
        # Assess model risk
        from .validation_engine import assess_model_risk
        model_risk_assessment = assess_model_risk(validation_report)
        
        response_data = {
            "validation_report": {
                "model_name": validation_report.model_name,
                "model_type": validation_report.model_type,
                "overall_assessment": validation_report.overall_assessment,
                "validation_date": validation_report.validation_date.isoformat(),
                "performance_analysis": validation_report.performance_analysis,
                "regulatory_compliance": validation_report.regulatory_compliance,
                "recommendations": validation_report.recommendations
            },
            "test_results": [
                {
                    "test_name": test.test_name,
                    "result": test.result,
                    "p_value": test.p_value,
                    "description": test.description
                }
                for test in validation_tests
            ],
            "model_risk_assessment": model_risk_assessment
        }
        
        return APIResponse(
            success=True,
            data=response_data,
            message="Model validation completed successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model validation failed: {str(e)}")

# Utility Endpoints

@router.get("/scenarios/historical", response_model=APIResponse)
async def get_historical_scenarios(
    current_user = Depends(get_current_user),
    _permission_check = Depends(require_permission("risk_modeling"))
):
    """Get available historical stress scenarios"""
    
    try:
        generator = HistoricalScenarioGenerator()
        scenarios = generator.list_scenarios()
        
        scenario_details = []
        for scenario_id in scenarios:
            scenario = generator.get_scenario(scenario_id)
            if scenario:
                scenario_details.append({
                    "scenario_id": scenario.scenario_id,
                    "scenario_name": scenario.scenario_name,
                    "description": scenario.description,
                    "severity": scenario.severity,
                    "probability": scenario.probability,
                    "historical_precedent": scenario.historical_precedent
                })
        
        return APIResponse(
            success=True,
            data={"historical_scenarios": scenario_details},
            message="Historical scenarios retrieved successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve scenarios: {str(e)}")

@router.get("/health", response_model=APIResponse)
async def health_check():
    """Health check endpoint for GBM Risk Engine"""
    
    try:
        # Test core components
        simulator = GBMSimulator()
        calculator = RiskMetricsCalculator()
        
        # Run quick validation
        test_params = GBMParameters(
            initial_price=100.0,
            drift=0.05,
            volatility=0.2,
            time_horizon=1.0,
            time_steps=252,
            num_simulations=100
        )
        
        result = simulator.run_simulation(test_params)
        test_returns = result.path_statistics.returns[:10]
        
        if test_returns:
            metrics = calculator.calculate_comprehensive_metrics(test_returns)
            
        return APIResponse(
            success=True,
            data={
                "status": "healthy",
                "components": {
                    "gbm_simulator": "operational",
                    "risk_calculator": "operational", 
                    "fair_engine": "operational",
                    "validation_engine": "operational"
                },
                "test_simulation": {
                    "simulations_run": len(result.paths),
                    "execution_time": result.simulation_metadata.get("execution_time_seconds", 0)
                }
            },
            message="GBM Risk Engine is healthy and operational"
        )
        
    except Exception as e:
        return APIResponse(
            success=False,
            data={"status": "unhealthy", "error": str(e)},
            message="GBM Risk Engine health check failed"
        )