"""
FastAPI Router for Real-Time Financial Intelligence
Provides REST and WebSocket endpoints for financial metrics and dashboard streaming
"""

from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from decimal import Decimal
import json
import structlog
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Depends, Query, Path
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from .timescale_db import (
    TimescaleDBConfig,
    MetricType,
    AggregationInterval,
    FinancialMetric,
    ROICalculation,
    ComplianceCostMetric
)
from .real_time_integration import RealTimeFinancialOrchestrator, create_real_time_orchestrator
from .financial_engine import FinancialIntelligenceEngine
from ..beacon.enhanced_roi_calculator import EnhancedROICalculator
from ..prism.monte_carlo import MonteCarloRiskEngine
from ..shared.auth import get_current_user, User

logger = structlog.get_logger()

# Request/Response Models
class ROICalculationRequest(BaseModel):
    """ROI calculation request"""
    investment_amount: float = Field(..., description="Initial investment amount in EUR")
    compliance_costs: List[float] = Field(..., description="Annual compliance costs")
    risk_reduction_factors: Dict[str, float] = Field(..., description="Risk reduction factors by category")
    projection_months: int = Field(36, description="Projection period in months")
    discount_rate: float = Field(0.08, description="Discount rate for NPV calculation")

class MonteCarloRequest(BaseModel):
    """Monte Carlo analysis request"""
    scenarios: List[Dict[str, Any]] = Field(..., description="Scenarios to analyze")
    iterations: int = Field(10000, description="Number of Monte Carlo iterations")
    confidence_levels: List[float] = Field([0.95, 0.99], description="Confidence levels for VaR")

class ComplianceCostRequest(BaseModel):
    """Compliance cost tracking request"""
    framework: str = Field(..., description="Compliance framework (GDPR, NIS2, DORA, etc.)")
    cost_category: str = Field(..., description="Cost category (personnel, tools, audits)")
    amount: float = Field(..., description="Cost amount")
    currency: str = Field("EUR", description="Currency code")
    period_start: datetime = Field(..., description="Cost period start")
    period_end: datetime = Field(..., description="Cost period end")
    is_recurring: bool = Field(False, description="Whether cost is recurring")
    cost_center: Optional[str] = Field(None, description="Cost center")

class MetricsQuery(BaseModel):
    """Metrics query parameters"""
    metric_types: Optional[List[MetricType]] = Field(None, description="Metric types to filter")
    start_time: Optional[datetime] = Field(None, description="Start time filter")
    end_time: Optional[datetime] = Field(None, description="End time filter")
    limit: int = Field(1000, description="Maximum number of results")

class DashboardResponse(BaseModel):
    """Dashboard response model"""
    customer_id: str
    last_updated: datetime
    roi: Dict[str, Any]
    savings: Dict[str, Any]
    risk: Dict[str, Any]
    trust: Dict[str, Any]
    trends: Dict[str, Any]
    status: str

# Global orchestrator instance (will be initialized on startup)
orchestrator: Optional[RealTimeFinancialOrchestrator] = None

# Create router
router = APIRouter(prefix="/api/v1/financial-intelligence", tags=["Financial Intelligence"])

async def get_orchestrator() -> RealTimeFinancialOrchestrator:
    """Dependency to get orchestrator instance"""
    global orchestrator
    if not orchestrator:
        raise HTTPException(status_code=503, detail="Financial intelligence service not initialized")
    return orchestrator

# REST Endpoints

@router.post("/roi/calculate")
async def calculate_roi(
    request: ROICalculationRequest,
    current_user: User = Depends(get_current_user),
    orch: RealTimeFinancialOrchestrator = Depends(get_orchestrator)
) -> Dict[str, Any]:
    """
    Calculate comprehensive ROI analysis
    
    Returns detailed ROI metrics including:
    - ROI percentage
    - Net Present Value (NPV)
    - Internal Rate of Return (IRR)
    - Payback period
    - Risk-adjusted returns
    """
    try:
        roi_calculation = await orch.calculate_and_store_roi(
            customer_id=current_user.customer_id,
            investment_amount=Decimal(str(request.investment_amount)),
            compliance_costs=[Decimal(str(cost)) for cost in request.compliance_costs],
            risk_reduction_factors=request.risk_reduction_factors
        )
        
        return {
            "calculation_id": roi_calculation.calculation_id,
            "customer_id": roi_calculation.customer_id,
            "investment_amount": float(roi_calculation.investment_amount),
            "savings_amount": float(roi_calculation.savings_amount),
            "roi_percentage": float(roi_calculation.roi_percentage),
            "npv": float(roi_calculation.npv),
            "irr": float(roi_calculation.irr),
            "payback_months": roi_calculation.payback_months,
            "calculation_date": roi_calculation.calculation_date.isoformat(),
            "projection_months": roi_calculation.projection_months,
            "discount_rate": roi_calculation.discount_rate
        }
        
    except Exception as e:
        logger.error("ROI calculation failed", 
                    customer_id=current_user.customer_id,
                    error=str(e))
        raise HTTPException(status_code=500, detail=f"ROI calculation failed: {str(e)}")

@router.post("/monte-carlo/analyze")
async def run_monte_carlo_analysis(
    request: MonteCarloRequest,
    current_user: User = Depends(get_current_user),
    orch: RealTimeFinancialOrchestrator = Depends(get_orchestrator)
) -> Dict[str, Any]:
    """
    Run Monte Carlo risk analysis
    
    Performs comprehensive risk analysis across multiple scenarios
    with statistical confidence intervals and risk metrics.
    """
    try:
        simulation_id = await orch.run_monte_carlo_analysis(
            customer_id=current_user.customer_id,
            scenarios=request.scenarios,
            iterations=request.iterations
        )
        
        # Get analysis results
        analysis_results = await orch.timescale_db.get_monte_carlo_analysis(
            customer_id=current_user.customer_id,
            simulation_id=simulation_id
        )
        
        return {
            "simulation_id": simulation_id,
            "customer_id": current_user.customer_id,
            "iterations": request.iterations,
            "scenarios_analyzed": len(request.scenarios),
            "analysis_results": analysis_results,
            "confidence_levels": request.confidence_levels,
            "completed_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error("Monte Carlo analysis failed", 
                    customer_id=current_user.customer_id,
                    error=str(e))
        raise HTTPException(status_code=500, detail=f"Monte Carlo analysis failed: {str(e)}")

@router.post("/compliance-costs/track")
async def track_compliance_cost(
    request: ComplianceCostRequest,
    current_user: User = Depends(get_current_user),
    orch: RealTimeFinancialOrchestrator = Depends(get_orchestrator)
) -> Dict[str, Any]:
    """
    Track compliance costs by framework
    
    Records compliance costs for specific frameworks like GDPR, NIS2, DORA
    and categorizes by cost type (personnel, tools, audits, etc.).
    """
    try:
        cost_data = {
            "category": request.cost_category,
            "amount": request.amount,
            "currency": request.currency,
            "period_start": request.period_start,
            "period_end": request.period_end,
            "is_recurring": request.is_recurring,
            "cost_center": request.cost_center
        }
        
        await orch.track_compliance_costs(
            customer_id=current_user.customer_id,
            framework=request.framework,
            cost_data=cost_data
        )
        
        return {
            "message": "Compliance cost tracked successfully",
            "customer_id": current_user.customer_id,
            "framework": request.framework,
            "amount": request.amount,
            "currency": request.currency,
            "tracked_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error("Compliance cost tracking failed", 
                    customer_id=current_user.customer_id,
                    framework=request.framework,
                    error=str(e))
        raise HTTPException(status_code=500, detail=f"Compliance cost tracking failed: {str(e)}")

@router.get("/dashboard")
async def get_financial_dashboard(
    current_user: User = Depends(get_current_user),
    orch: RealTimeFinancialOrchestrator = Depends(get_orchestrator)
) -> DashboardResponse:
    """
    Get comprehensive financial dashboard
    
    Returns real-time financial metrics including:
    - Current ROI and savings
    - Risk scores and trends
    - Trust score metrics
    - Historical data and trends
    """
    try:
        dashboard_data = await orch.get_real_time_dashboard(current_user.customer_id)
        
        if not dashboard_data:
            raise HTTPException(status_code=404, detail="Dashboard data not found")
        
        return DashboardResponse(**dashboard_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Dashboard retrieval failed", 
                    customer_id=current_user.customer_id,
                    error=str(e))
        raise HTTPException(status_code=500, detail=f"Dashboard retrieval failed: {str(e)}")

@router.get("/metrics")
async def get_financial_metrics(
    metric_types: Optional[List[MetricType]] = Query(None, description="Metric types to filter"),
    start_time: Optional[datetime] = Query(None, description="Start time filter"),
    end_time: Optional[datetime] = Query(None, description="End time filter"),
    limit: int = Query(1000, description="Maximum number of results"),
    current_user: User = Depends(get_current_user),
    orch: RealTimeFinancialOrchestrator = Depends(get_orchestrator)
) -> List[Dict[str, Any]]:
    """
    Get financial metrics with filtering
    
    Retrieve historical financial metrics with optional filtering
    by metric type, time range, and result limit.
    """
    try:
        metrics = await orch.timescale_db.get_financial_metrics(
            customer_id=current_user.customer_id,
            metric_types=metric_types,
            start_time=start_time,
            end_time=end_time,
            limit=limit
        )
        
        return [
            {
                "metric_id": metric.metric_id,
                "metric_type": metric.metric_type.value,
                "value": float(metric.value),
                "currency": metric.currency,
                "timestamp": metric.timestamp.isoformat(),
                "metadata": metric.metadata,
                "tags": metric.tags,
                "source_system": metric.source_system,
                "confidence_level": metric.confidence_level
            }
            for metric in metrics
        ]
        
    except Exception as e:
        logger.error("Metrics retrieval failed", 
                    customer_id=current_user.customer_id,
                    error=str(e))
        raise HTTPException(status_code=500, detail=f"Metrics retrieval failed: {str(e)}")

@router.get("/metrics/aggregated")
async def get_aggregated_metrics(
    interval: AggregationInterval = Query(..., description="Aggregation interval"),
    start_time: Optional[datetime] = Query(None, description="Start time filter"),
    end_time: Optional[datetime] = Query(None, description="End time filter"),
    current_user: User = Depends(get_current_user),
    orch: RealTimeFinancialOrchestrator = Depends(get_orchestrator)
) -> Dict[str, Any]:
    """
    Get aggregated financial metrics
    
    Retrieve time-series aggregated metrics for charting and trend analysis.
    Supports multiple aggregation intervals from minutes to years.
    """
    try:
        aggregated_data = await orch.timescale_db.get_aggregated_metrics(
            customer_id=current_user.customer_id,
            interval=interval,
            start_time=start_time,
            end_time=end_time
        )
        
        return aggregated_data
        
    except Exception as e:
        logger.error("Aggregated metrics retrieval failed", 
                    customer_id=current_user.customer_id,
                    error=str(e))
        raise HTTPException(status_code=500, detail=f"Aggregated metrics retrieval failed: {str(e)}")

@router.get("/trust-score")
async def get_trust_score(
    current_user: User = Depends(get_current_user),
    orch: RealTimeFinancialOrchestrator = Depends(get_orchestrator)
) -> Dict[str, Any]:
    """
    Calculate and retrieve current trust score
    
    Returns trust score based on financial performance,
    risk metrics, and compliance achievements.
    """
    try:
        trust_score = await orch.calculate_trust_score_impact(
            customer_id=current_user.customer_id,
            current_metrics={}
        )
        
        return {
            "customer_id": current_user.customer_id,
            "trust_score": float(trust_score),
            "calculated_at": datetime.utcnow().isoformat(),
            "score_range": {"min": 0, "max": 100},
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error("Trust score calculation failed", 
                    customer_id=current_user.customer_id,
                    error=str(e))
        raise HTTPException(status_code=500, detail=f"Trust score calculation failed: {str(e)}")

# WebSocket Endpoints

@router.websocket("/stream")
async def financial_metrics_stream(
    websocket: WebSocket,
    customer_id: str = Query(..., description="Customer ID for metrics stream")
):
    """
    Real-time financial metrics WebSocket stream
    
    Provides live updates for:
    - Financial metric changes
    - ROI calculations
    - Risk score updates
    - Trust score changes
    - Dashboard refreshes
    
    Message format:
    {
        "type": "metric_update|dashboard_update|roi_calculation_complete|error",
        "data": {...}
    }
    """
    try:
        # Get orchestrator
        orch = await get_orchestrator()
        
        # Start customer stream
        await orch.start_customer_stream(customer_id, websocket)
        
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected", customer_id=customer_id)
    except Exception as e:
        logger.error("WebSocket error", 
                    customer_id=customer_id,
                    error=str(e))
        try:
            await websocket.close(code=1011, reason=f"Internal error: {str(e)}")
        except:
            pass

# Health Check Endpoints

@router.get("/health")
async def health_check(
    orch: RealTimeFinancialOrchestrator = Depends(get_orchestrator)
) -> Dict[str, Any]:
    """
    Health check for financial intelligence service
    
    Returns status of all components including TimescaleDB,
    calculation engines, and streaming services.
    """
    try:
        # Check TimescaleDB health
        db_health = await orch.timescale_db.health_check() if orch.timescale_db else {}
        
        # Check active streams
        active_streams = len(orch.metrics_streamer.active_streams) if orch.metrics_streamer else 0
        
        # Check active calculations
        active_calculations = len(orch.active_calculations)
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "components": {
                "timescale_db": "healthy" if db_health else "unhealthy",
                "metrics_streamer": "healthy" if orch.metrics_streamer else "unhealthy",
                "calculation_engines": "healthy"
            },
            "active_streams": active_streams,
            "active_calculations": active_calculations,
            "database_connections": db_health
        }
        
    except Exception as e:
        logger.error("Health check failed", error=str(e))
        return {
            "status": "unhealthy",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }

# Initialization function
async def initialize_financial_intelligence(
    timescale_config: TimescaleDBConfig,
    financial_engine: FinancialIntelligenceEngine,
    roi_calculator: EnhancedROICalculator,
    monte_carlo_engine: MonteCarloRiskEngine
) -> bool:
    """Initialize financial intelligence orchestrator"""
    global orchestrator
    
    try:
        orchestrator = await create_real_time_orchestrator(
            timescale_config=timescale_config,
            financial_engine=financial_engine,
            roi_calculator=roi_calculator,
            monte_carlo_engine=monte_carlo_engine
        )
        
        logger.info("Financial intelligence service initialized successfully")
        return True
        
    except Exception as e:
        logger.error("Failed to initialize financial intelligence service", error=str(e))
        return False

# Cleanup function
async def cleanup_financial_intelligence():
    """Cleanup financial intelligence orchestrator"""
    global orchestrator
    
    if orchestrator:
        await orchestrator.close()
        orchestrator = None
        logger.info("Financial intelligence service cleaned up")

# Export router and utility functions
__all__ = [
    "router",
    "initialize_financial_intelligence",
    "cleanup_financial_intelligence",
    "ROICalculationRequest",
    "MonteCarloRequest",
    "ComplianceCostRequest",
    "DashboardResponse"
]