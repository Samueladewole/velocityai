# BEACON API Router - Value Demonstration Platform
# FastAPI routes for ROI measurement and business impact reporting

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime
import structlog

from shared.auth import get_current_user, require_permission, ComponentPermissions, TokenData
from .value_engine import (
    ValueDemonstrationEngine,
    MetricCategory,
    ROITimeframe,
    MaturityLevel,
    ROIMetric,
    BusinessImpactReport,
    MaturityAssessment
)

router = APIRouter()
logger = structlog.get_logger()

# Initialize the value engine
value_engine = ValueDemonstrationEngine()

# Pydantic models for API requests
class ROICalculationRequest(BaseModel):
    baseline_data: Dict[str, float]
    current_data: Dict[str, float]
    investment_data: Dict[str, float]
    timeframe: ROITimeframe

class ImpactReportRequest(BaseModel):
    reporting_period: str
    include_projections: bool = True
    custom_metrics: Optional[List[str]] = None

class MaturityAssessmentRequest(BaseModel):
    current_capabilities: Dict[str, float]
    industry_benchmarks: Optional[Dict[str, float]] = None

class BenchmarkComparisonRequest(BaseModel):
    organization_metrics: Dict[str, float]
    peer_group: str
    industry: str

@router.post("/roi/calculate", response_model=List[ROIMetric])
async def calculate_roi_metrics(
    request: ROICalculationRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """Calculate comprehensive ROI metrics"""
    try:
        logger.info("Starting ROI calculation",
                   user_id=current_user.user_id,
                   timeframe=request.timeframe.value)
        
        roi_metrics = await value_engine.calculate_roi_metrics(
            organization_id=current_user.organization_id,
            baseline_data=request.baseline_data,
            current_data=request.current_data,
            investment_data=request.investment_data,
            timeframe=request.timeframe
        )
        
        total_impact = sum(metric.financial_impact for metric in roi_metrics)
        
        logger.info("ROI calculation completed",
                   user_id=current_user.user_id,
                   metrics_count=len(roi_metrics),
                   total_impact=total_impact)
        
        return roi_metrics
        
    except Exception as e:
        logger.error("ROI calculation failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ROI calculation failed: {str(e)}"
        )

@router.post("/reports/generate", response_model=BusinessImpactReport)
async def generate_business_impact_report(
    request: ImpactReportRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """Generate comprehensive business impact report"""
    try:
        logger.info("Generating business impact report",
                   user_id=current_user.user_id,
                   period=request.reporting_period)
        
        # First calculate current ROI metrics
        sample_roi_request = ROICalculationRequest(
            baseline_data={
                "security_score": 6.0,
                "incident_costs": 100000,
                "compliance_costs": 200000,
                "automated_processes": 5,
                "critical_vulnerabilities": 50,
                "mttd_hours": 72,
                "automation_percentage": 15,
                "compliance_score": 68,
                "audit_prep_days": 45
            },
            current_data={
                "security_score": 7.5,
                "incident_costs": 50000,
                "compliance_costs": 120000,
                "automated_processes": 15,
                "critical_vulnerabilities": 15,
                "mttd_hours": 24,
                "automation_percentage": 40,
                "compliance_score": 85,
                "audit_prep_days": 15
            },
            investment_data={
                "erip_platform_cost": 96000,  # Annual cost
                "implementation_cost": 50000,
                "training_cost": 15000
            },
            timeframe=ROITimeframe.ANNUALLY
        )
        
        metrics = await value_engine.calculate_roi_metrics(
            organization_id=current_user.organization_id,
            baseline_data=sample_roi_request.baseline_data,
            current_data=sample_roi_request.current_data,
            investment_data=sample_roi_request.investment_data,
            timeframe=sample_roi_request.timeframe
        )
        
        # Generate comprehensive report
        report = await value_engine.generate_business_impact_report(
            organization_id=current_user.organization_id,
            metrics=metrics,
            reporting_period=request.reporting_period
        )
        
        logger.info("Business impact report generated",
                   user_id=current_user.user_id,
                   report_id=report.report_id,
                   total_roi=report.total_roi)
        
        return report
        
    except Exception as e:
        logger.error("Business impact report generation failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Business impact report generation failed: {str(e)}"
        )

@router.post("/maturity/assess", response_model=MaturityAssessment)
async def assess_security_maturity(
    request: MaturityAssessmentRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """Assess organizational security maturity"""
    try:
        logger.info("Starting maturity assessment",
                   user_id=current_user.user_id)
        
        # Use industry benchmarks if not provided
        industry_benchmarks = request.industry_benchmarks or {
            "governance": 3.5,
            "risk_management": 3.8,
            "security_operations": 4.0,
            "incident_response": 3.2,
            "compliance": 4.1,
            "threat_intelligence": 2.9
        }
        
        assessment = await value_engine.assess_security_maturity(
            organization_id=current_user.organization_id,
            current_capabilities=request.current_capabilities,
            industry_benchmarks=industry_benchmarks
        )
        
        logger.info("Maturity assessment completed",
                   user_id=current_user.user_id,
                   assessment_id=assessment.assessment_id,
                   overall_maturity=assessment.overall_maturity.value)
        
        return assessment
        
    except Exception as e:
        logger.error("Maturity assessment failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Maturity assessment failed: {str(e)}"
        )

@router.get("/dashboard")
async def get_value_dashboard(
    timeframe: ROITimeframe = Query(default=ROITimeframe.QUARTERLY),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """Get value demonstration dashboard"""
    try:
        # Mock dashboard data based on calculations
        dashboard_data = {
            "organization_id": current_user.organization_id,
            "last_updated": datetime.utcnow().isoformat(),
            "timeframe": timeframe.value,
            "roi_summary": {
                "total_roi": 847500,
                "roi_percentage": 525.8,
                "payback_period_months": 4.2,
                "cost_savings": 280000,
                "cost_avoidance": 375000,
                "productivity_gains": 192500
            },
            "key_metrics": [
                {
                    "name": "Security Incident Cost Reduction",
                    "value": 50000,
                    "improvement": 50.0,
                    "category": "financial"
                },
                {
                    "name": "Compliance Cost Optimization", 
                    "value": 80000,
                    "improvement": 40.0,
                    "category": "financial"
                },
                {
                    "name": "Security Posture Improvement",
                    "value": 7.5,
                    "improvement": 25.0,
                    "category": "security"
                },
                {
                    "name": "Critical Vulnerability Reduction",
                    "value": 15,
                    "improvement": 70.0,
                    "category": "security"
                }
            ],
            "success_highlights": [
                "Achieved 525% ROI within first year of ERIP implementation",
                "Reduced security incident costs by $50,000 annually",
                "Improved compliance efficiency, saving 30 days of audit preparation",
                "Enhanced security posture score from 6.0 to 7.5 (+25%)"
            ],
            "industry_comparison": {
                "percentile_rank": 78,
                "peer_average_roi": 245.0,
                "our_roi": 525.8,
                "competitive_advantage": "Strong"
            },
            "maturity_progress": {
                "current_level": "managed",
                "target_level": "optimizing",
                "progress_percentage": 72,
                "next_milestone": "Enhanced threat intelligence capabilities"
            },
            "investment_breakdown": {
                "platform_costs": 96000,
                "implementation": 50000,
                "training": 15000,
                "ongoing_support": 24000,
                "total_investment": 185000
            }
        }
        
        logger.info("Value dashboard retrieved",
                   user_id=current_user.user_id,
                   roi_percentage=dashboard_data["roi_summary"]["roi_percentage"])
        
        return dashboard_data
        
    except Exception as e:
        logger.error("Dashboard retrieval failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Dashboard retrieval failed: {str(e)}"
        )

@router.get("/reports")
async def get_business_reports(
    limit: int = Query(default=10, ge=1, le=50),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """Get list of business impact reports"""
    try:
        # Get cached reports (in production, fetch from database)
        reports = list(value_engine.impact_reports.values())
        
        report_summaries = [
            {
                "report_id": r.report_id,
                "title": r.title,
                "reporting_period": r.reporting_period,
                "total_roi": r.total_roi,
                "cost_savings": r.cost_savings,
                "generated_at": r.generated_at.isoformat(),
                "metrics_count": len(r.metrics)
            }
            for r in reports[:limit]
        ]
        
        logger.info("Business reports retrieved",
                   user_id=current_user.user_id,
                   reports_count=len(report_summaries))
        
        return {
            "reports": report_summaries,
            "total_count": len(report_summaries)
        }
        
    except Exception as e:
        logger.error("Reports retrieval failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Reports retrieval failed: {str(e)}"
        )

@router.get("/benchmarks/industry")
async def get_industry_benchmarks(
    industry: str = Query(default="technology"),
    metric_category: Optional[MetricCategory] = None,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """Get industry benchmarks for comparison"""
    try:
        # Mock industry benchmark data
        benchmarks = {
            "industry": industry,
            "data_source": "Industry Analysis Platform",
            "sample_size": 247,
            "last_updated": "2024-01-15T00:00:00Z",
            "metrics": {
                "security_score": {
                    "industry_average": 6.8,
                    "top_quartile": 8.2,
                    "median": 6.5,
                    "bottom_quartile": 5.1
                },
                "roi_percentage": {
                    "industry_average": 245.0,
                    "top_quartile": 450.0,
                    "median": 225.0,
                    "bottom_quartile": 125.0
                },
                "incident_response_time": {
                    "industry_average": 36.5,
                    "top_quartile": 12.0,
                    "median": 24.0,
                    "bottom_quartile": 72.0
                },
                "compliance_score": {
                    "industry_average": 76.2,
                    "top_quartile": 92.0,
                    "median": 78.0,
                    "bottom_quartile": 62.0
                }
            },
            "trends": [
                "Security ROI increasing 15% year-over-year",
                "Incident response times improving across industry",
                "Compliance automation adoption accelerating",
                "AI-powered security tools showing highest ROI"
            ]
        }
        
        # Filter by category if specified
        if metric_category:
            filtered_metrics = {}
            for metric, data in benchmarks["metrics"].items():
                if metric_category.value in metric:
                    filtered_metrics[metric] = data
            benchmarks["metrics"] = filtered_metrics
        
        logger.info("Industry benchmarks retrieved",
                   user_id=current_user.user_id,
                   industry=industry,
                   metrics_count=len(benchmarks["metrics"]))
        
        return benchmarks
        
    except Exception as e:
        logger.error("Benchmark retrieval failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Benchmark retrieval failed: {str(e)}"
        )

@router.post("/success-stories/generate")
async def generate_success_story(
    metric_ids: List[str],
    template_type: str = Query(default="executive"),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """Generate success story from specific metrics"""
    try:
        logger.info("Generating success story",
                   user_id=current_user.user_id,
                   metric_count=len(metric_ids),
                   template=template_type)
        
        # Mock success story generation
        success_story = {
            "story_id": f"story_{current_user.user_id}_{int(datetime.utcnow().timestamp())}",
            "title": "ERIP Implementation Delivers Outstanding ROI",
            "executive_summary": "Within 12 months of implementing ERIP, the organization achieved a 525% ROI, reduced security incident costs by 50%, and improved compliance efficiency by 40%.",
            "challenge": "The organization faced increasing cybersecurity threats, complex compliance requirements, and inefficient manual security processes that were consuming significant resources.",
            "solution": "ERIP's comprehensive platform provided AI-powered regulatory intelligence, automated security assessments, and integrated risk quantification to transform security operations.",
            "results": {
                "financial": "Generated $847,500 in total business value with 525% ROI",
                "operational": "Reduced incident response time from 72 to 24 hours",
                "compliance": "Streamlined audit preparation from 45 to 15 days",
                "security": "Improved security posture score by 25%"
            },
            "metrics_used": metric_ids,
            "template_type": template_type,
            "generated_at": datetime.utcnow().isoformat(),
            "stakeholder_quotes": [
                "ERIP transformed our approach to cybersecurity from reactive to proactive, delivering measurable business value. - Chief Information Security Officer",
                "The ROI we've achieved with ERIP exceeded our expectations and justified the investment within months. - Chief Financial Officer"
            ]
        }
        
        logger.info("Success story generated",
                   user_id=current_user.user_id,
                   story_id=success_story["story_id"])
        
        return success_story
        
    except Exception as e:
        logger.error("Success story generation failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Success story generation failed: {str(e)}"
        )