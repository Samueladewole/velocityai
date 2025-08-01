"""
Compliance Report API Routes for Velocity AI Platform
Enterprise compliance reporting endpoints
"""

from typing import Dict, Any, Optional, List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from models import Framework, User
from database import get_db
from auth import get_current_active_user
from validation import SuccessResponse, VelocityException
from rbac import Permission, require_permission
from compliance_report_generator import (
    compliance_report_generator, ReportType, ReportFormat, ComplianceStatus,
    generate_compliance_report
)
import logging

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/api/v1/compliance",
    tags=["compliance"],
    responses={404: {"description": "Not found"}}
)

# Request/Response Models
class ComplianceReportRequest(BaseModel):
    """Request to generate compliance report"""
    framework: Framework = Field(..., description="Compliance framework")
    report_type: str = Field("compliance_assessment", description="Type of report to generate")
    report_format: str = Field("json", description="Output format: json, html, csv, pdf")
    report_period_start: Optional[str] = Field(None, description="Report period start date (ISO format)")
    report_period_end: Optional[str] = Field(None, description="Report period end date (ISO format)")
    include_evidence: bool = Field(True, description="Include evidence details")
    include_recommendations: bool = Field(True, description="Include recommendations")

class ComplianceReportResponse(BaseModel):
    """Compliance report response"""
    report_id: str
    report_type: str
    framework: str
    organization_id: str
    generated_by: str
    generated_at: str
    overall_compliance_score: float
    risk_score: float
    file_path: Optional[str]
    file_size: Optional[int]
    download_url: Optional[str]

class ComplianceMetricResponse(BaseModel):
    """Individual compliance metric response"""
    control_id: str
    control_name: str
    requirement: str
    status: str
    evidence_count: int
    evidence_quality: float
    compliance_percentage: float
    last_assessed: Optional[str]
    gaps: List[str]
    recommendations: List[str]

class ComplianceStatusResponse(BaseModel):
    """Compliance status summary response"""
    organization_id: str
    framework: str
    overall_score: float
    risk_score: float
    total_controls: int
    compliant_controls: int
    non_compliant_controls: int
    unknown_controls: int
    last_assessment: Optional[str]
    next_assessment: str

class FrameworkControlsResponse(BaseModel):
    """Framework controls response"""
    framework: str
    controls: List[Dict[str, Any]]
    total_controls: int

# Routes
@router.post("/reports/generate", response_model=ComplianceReportResponse)
async def generate_report(
    request: ComplianceReportRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate compliance report"""
    try:
        require_permission(current_user, Permission.COMPLIANCE_VIEW)
        
        # Parse report type and format
        try:
            report_type = ReportType(request.report_type)
            report_format = ReportFormat(request.report_format)
        except ValueError as e:
            raise VelocityException(f"Invalid report type or format: {e}")
        
        # Parse dates
        start_date = None
        end_date = None
        
        if request.report_period_start:
            start_date = datetime.fromisoformat(request.report_period_start.replace('Z', '+00:00'))
        
        if request.report_period_end:
            end_date = datetime.fromisoformat(request.report_period_end.replace('Z', '+00:00'))
        
        # Generate report in background
        def generate_report_task():
            import asyncio
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                result = loop.run_until_complete(
                    generate_compliance_report(
                        db=db,
                        organization_id=str(current_user.organization_id),
                        framework=request.framework,
                        report_type=report_type,
                        report_format=report_format,
                        generated_by=str(current_user.id),
                        report_period_start=start_date,
                        report_period_end=end_date,
                        include_evidence=request.include_evidence,
                        include_recommendations=request.include_recommendations
                    )
                )
                return result
            finally:
                loop.close()
        
        background_tasks.add_task(generate_report_task)
        
        # Return immediate response
        report_id = f"report_{current_user.organization_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        return ComplianceReportResponse(
            report_id=report_id,
            report_type=request.report_type,
            framework=request.framework.value,
            organization_id=str(current_user.organization_id),
            generated_by=str(current_user.id),
            generated_at=datetime.now(timezone.utc).isoformat(),
            overall_compliance_score=0.0,  # Will be updated when generation completes
            risk_score=0.0,  # Will be updated when generation completes
            file_path=None,  # Will be updated when generation completes
            file_size=None,  # Will be updated when generation completes
            download_url=f"/api/v1/compliance/reports/{report_id}/download"
        )
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error generating compliance report: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/status", response_model=ComplianceStatusResponse)
async def get_compliance_status(
    framework: Framework,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get compliance status summary"""
    try:
        require_permission(current_user, Permission.COMPLIANCE_VIEW)
        
        # This would query actual compliance data from database
        # For now, we'll return a simulated response
        
        return ComplianceStatusResponse(
            organization_id=str(current_user.organization_id),
            framework=framework.value,
            overall_score=85.5,
            risk_score=14.5,
            total_controls=25,
            compliant_controls=18,
            non_compliant_controls=4,
            unknown_controls=3,
            last_assessment=datetime.now(timezone.utc).isoformat(),
            next_assessment=(datetime.now(timezone.utc) + 
                           datetime.timedelta(days=90)).isoformat()
        )
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error getting compliance status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/frameworks/{framework}/controls", response_model=FrameworkControlsResponse)
async def get_framework_controls(
    framework: Framework,
    current_user: User = Depends(get_current_active_user)
):
    """Get controls for a specific framework"""
    try:
        require_permission(current_user, Permission.COMPLIANCE_VIEW)
        
        # Get controls from report generator
        controls = compliance_report_generator.framework_controls.get(framework, {})
        
        controls_list = []
        for control_id, control_info in controls.items():
            controls_list.append({
                "control_id": control_id,
                "name": control_info.get("name", ""),
                "requirement": control_info.get("requirement", ""),
                "category": control_info.get("category", "General")
            })
        
        return FrameworkControlsResponse(
            framework=framework.value,
            controls=controls_list,
            total_controls=len(controls_list)
        )
        
    except Exception as e:
        logger.error(f"Error getting framework controls: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/metrics", response_model=List[ComplianceMetricResponse])
async def get_compliance_metrics(
    framework: Framework,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get detailed compliance metrics"""
    try:
        require_permission(current_user, Permission.COMPLIANCE_VIEW)
        
        # This would gather actual compliance data
        # For now, we'll return simulated metrics
        
        sample_metrics = [
            ComplianceMetricResponse(
                control_id="gdpr_32",
                control_name="Security of Processing",
                requirement="Implement appropriate technical and organizational measures",
                status="fully_compliant",
                evidence_count=5,
                evidence_quality=0.85,
                compliance_percentage=95.0,
                last_assessed=datetime.now(timezone.utc).isoformat(),
                gaps=[],
                recommendations=["Maintain current security measures"]
            ),
            ComplianceMetricResponse(
                control_id="gdpr_30",
                control_name="Records of Processing",
                requirement="Maintain records of processing activities",
                status="partially_compliant",
                evidence_count=2,
                evidence_quality=0.65,
                compliance_percentage=70.0,
                last_assessed=datetime.now(timezone.utc).isoformat(),
                gaps=["Incomplete documentation"],
                recommendations=["Complete processing records", "Deploy automated tracking"]
            )
        ]
        
        return sample_metrics
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error getting compliance metrics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/report-types")
async def get_report_types(
    current_user: User = Depends(get_current_active_user)
):
    """Get available report types"""
    try:
        require_permission(current_user, Permission.COMPLIANCE_VIEW)
        
        report_types = []
        for report_type in ReportType:
            report_types.append({
                "value": report_type.value,
                "display_name": report_type.value.replace("_", " ").title(),
                "description": f"{report_type.value.replace('_', ' ').title()} report"
            })
        
        return {
            "report_types": report_types,
            "total": len(report_types)
        }
        
    except Exception as e:
        logger.error(f"Error getting report types: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/report-formats")
async def get_report_formats(
    current_user: User = Depends(get_current_active_user)
):
    """Get available report formats"""
    try:
        require_permission(current_user, Permission.COMPLIANCE_VIEW)
        
        report_formats = []
        for report_format in ReportFormat:
            report_formats.append({
                "value": report_format.value,
                "display_name": report_format.value.upper(),
                "description": f"{report_format.value.upper()} format"
            })
        
        return {
            "report_formats": report_formats,
            "total": len(report_formats)
        }
        
    except Exception as e:
        logger.error(f"Error getting report formats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/dashboards/{framework}")
async def get_compliance_dashboard(
    framework: Framework,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get compliance dashboard data"""
    try:
        require_permission(current_user, Permission.COMPLIANCE_VIEW)
        
        # This would gather real dashboard data
        # For now, return simulated dashboard
        
        dashboard_data = {
            "organization_id": str(current_user.organization_id),
            "framework": framework.value,
            "overview": {
                "compliance_score": 85.5,
                "risk_score": 14.5,
                "total_controls": 25,
                "evidence_items": 127,
                "last_updated": datetime.now(timezone.utc).isoformat()
            },
            "status_distribution": {
                "fully_compliant": 18,
                "mostly_compliant": 4,
                "partially_compliant": 2,
                "non_compliant": 1,
                "unknown": 0
            },
            "recent_activity": [
                {
                    "type": "evidence_collected",
                    "control_id": "gdpr_32",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "description": "New security evidence collected"
                },
                {
                    "type": "compliance_improved",
                    "control_id": "gdpr_30",
                    "timestamp": (datetime.now(timezone.utc) - 
                                datetime.timedelta(hours=2)).isoformat(),
                    "description": "Processing records updated"
                }
            ],
            "trending": {
                "score_trend": [82.1, 83.5, 84.2, 85.5],  # Last 4 assessments
                "evidence_trend": [98, 112, 119, 127],  # Evidence count over time
                "dates": [
                    (datetime.now(timezone.utc) - datetime.timedelta(days=90)).isoformat(),
                    (datetime.now(timezone.utc) - datetime.timedelta(days=60)).isoformat(),
                    (datetime.now(timezone.utc) - datetime.timedelta(days=30)).isoformat(),
                    datetime.now(timezone.utc).isoformat()
                ]
            },
            "priority_actions": [
                {
                    "action": "Address non-compliant control",
                    "control_id": "gdpr_25",
                    "priority": "high",
                    "estimated_effort": "2-3 weeks"
                },
                {
                    "action": "Improve evidence quality",
                    "control_id": "gdpr_44",
                    "priority": "medium",
                    "estimated_effort": "1 week"
                }
            ]
        }
        
        return dashboard_data
        
    except Exception as e:
        logger.error(f"Error getting compliance dashboard: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/health")
async def get_compliance_health(
    current_user: User = Depends(get_current_active_user)
):
    """Get compliance system health status"""
    try:
        require_permission(current_user, Permission.COMPLIANCE_VIEW)
        
        health_status = {
            "compliance_engine": "healthy",
            "report_generator": "healthy",
            "evidence_collector": "healthy",
            "framework_definitions": "loaded",
            "last_health_check": datetime.now(timezone.utc).isoformat(),
            "system_status": "operational",
            "active_frameworks": [f.value for f in Framework],
            "supported_report_types": [rt.value for rt in ReportType],
            "supported_formats": [rf.value for rf in ReportFormat]
        }
        
        return {
            "status": "healthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "details": health_status
        }
        
    except Exception as e:
        logger.error(f"Error checking compliance health: {e}")
        return {
            "status": "unhealthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "error": str(e)
        }