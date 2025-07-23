"""
GBM Risk Engine
Advanced Geometric Brownian Motion risk modeling and quantitative analysis framework
"""

from .gbm_simulator import (
    GBMSimulator,
    GBMParameters,
    GBMResult,
    MonteCarloEngine
)

from .risk_metrics import (
    RiskMetricsCalculator,
    VaRCalculator,
    RiskMetrics,
    PortfolioRiskMetrics
)

from .fair_integration import (
    FAIRRiskEngine,
    FAIRParameters,
    FAIRResult,
    ThreatEventModel
)

from .hubbard_estimation import (
    HubbardEstimator,
    HubbardEstimate,
    ExpertProfile,
    UncertaintyQuantification
)

from .portfolio_analytics import (
    PortfolioAnalyzer,
    CorrelationMatrix,
    DiversificationMetrics,
    OptimizationEngine
)

from .stress_testing import (
    StressTester,
    HistoricalScenarioGenerator,
    StressScenario,
    StressTestResult
)

from .validation_engine import (
    ModelValidator,
    BacktestResult,
    ValidationTestResult,
    ModelValidationReport
)

from .router import router

__version__ = "1.0.0"
__author__ = "ERIP Platform Team"
__description__ = "Advanced GBM risk modeling and quantitative analysis framework"

__all__ = [
    # Core GBM Simulation
    "GBMSimulator",
    "GBMParameters", 
    "GBMResult",
    "MonteCarloEngine",
    
    # Risk Metrics
    "RiskMetricsCalculator",
    "VaRCalculator",
    "RiskMetrics",
    "PortfolioRiskMetrics",
    
    # FAIR Integration
    "FAIRRiskEngine",
    "FAIRParameters",
    "FAIRResult", 
    "ThreatEventModel",
    
    # Hubbard Estimation
    "HubbardEstimator",
    "HubbardEstimate",
    "ExpertProfile",
    "UncertaintyQuantification",
    
    # Portfolio Analytics
    "PortfolioAnalyzer",
    "CorrelationMatrix",
    "DiversificationMetrics",
    "OptimizationEngine",
    
    # Stress Testing
    "StressTester",
    "HistoricalScenarioGenerator", 
    "StressScenario",
    "StressTestResult",
    
    # Validation
    "ModelValidator",
    "BacktestResult",
    "ValidationTestResult",
    "ModelValidationReport",
    
    # Router
    "router"
]

# Module features and capabilities
FEATURES = [
    "Geometric Brownian Motion Simulation",
    "Monte Carlo Risk Analysis", 
    "Value at Risk Calculations",
    "FAIR Risk Methodology",
    "Hubbard 5-Point Estimation",
    "Portfolio Optimization",
    "Stress Testing & Scenario Analysis", 
    "Model Validation & Backtesting",
    "Regulatory Compliance Testing",
    "Advanced Correlation Analysis"
]

def get_engine_info() -> dict:
    """Get comprehensive information about the GBM Risk Engine"""
    return {
        "name": "GBM Risk Engine",
        "version": __version__,
        "description": __description__,
        "features": FEATURES,
        "components": {
            "simulation": "Advanced Monte Carlo GBM simulation with variance reduction",
            "risk_metrics": "Comprehensive VaR, ES, and portfolio risk measures",
            "fair_analysis": "Factor Analysis of Information Risk methodology",
            "hubbard_estimation": "Calibrated expert estimation and uncertainty quantification",
            "portfolio_optimization": "Multi-objective portfolio optimization with constraints",
            "stress_testing": "Historical and hypothetical stress scenario analysis",
            "validation": "Statistical model validation and regulatory backtesting"
        }
    }