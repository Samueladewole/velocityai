"""
Financial Intelligence Module for ERIP
Real-time financial metrics storage and analysis with TimescaleDB integration
"""

__version__ = "1.0.0"
__author__ = "ERIP Development Team"

from .timescale_db import (
    TimescaleFinancialDB,
    TimescaleDBConfig,
    FinancialMetric,
    MetricType,
    AggregationInterval,
    MonteCarloResult,
    ROICalculation,
    ComplianceCostMetric,
    FinancialMetricsStreamer
)

from .real_time_integration import (
    RealTimeFinancialOrchestrator,
    create_real_time_orchestrator
)

from .router import (
    router,
    initialize_financial_intelligence,
    cleanup_financial_intelligence,
    ROICalculationRequest,
    MonteCarloRequest,
    ComplianceCostRequest,
    DashboardResponse
)

from .financial_engine import FinancialIntelligenceEngine
from .erp_integration import ERPIntegrationService

__all__ = [
    # Core TimescaleDB components
    "TimescaleFinancialDB",
    "TimescaleDBConfig", 
    "FinancialMetric",
    "MetricType",
    "AggregationInterval",
    "MonteCarloResult",
    "ROICalculation",
    "ComplianceCostMetric",
    "FinancialMetricsStreamer",
    
    # Real-time integration
    "RealTimeFinancialOrchestrator",
    "create_real_time_orchestrator",
    
    # FastAPI router and models
    "router",
    "initialize_financial_intelligence",
    "cleanup_financial_intelligence",
    "ROICalculationRequest",
    "MonteCarloRequest", 
    "ComplianceCostRequest",
    "DashboardResponse",
    
    # Financial engines
    "FinancialIntelligenceEngine",
    "ERPIntegrationService"
]

# Module metadata
MODULE_INFO = {
    "name": "Financial Intelligence",
    "version": __version__,
    "description": "Real-time financial metrics storage and analysis with TimescaleDB",
    "features": [
        "TimescaleDB time-series storage",
        "Real-time financial metrics streaming",
        "Monte Carlo risk analysis integration", 
        "ROI calculation and tracking",
        "Compliance cost management",
        "Trust score computation",
        "WebSocket dashboard streaming",
        "ERP system integration",
        "Multi-currency support",
        "Automated data compression and retention"
    ],
    "dependencies": [
        "asyncpg>=0.29.0",
        "timescaledb>=2.14.0",
        "fastapi>=0.104.0",
        "pydantic>=2.5.0",
        "structlog>=23.0.0"
    ]
}