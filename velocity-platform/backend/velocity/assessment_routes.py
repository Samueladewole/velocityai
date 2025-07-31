"""
Assessment Management API Routes for Velocity AI Platform
"""

from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from models import Framework, User
from database import get_db
from auth import get_current_active_user
from validation import SuccessResponse, VelocityException, PaginationParams
from rbac import Permission, check_permission
from assessment_manager import assessment_manager, AssessmentType, AssessmentStatus
import logging

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/api/v1/assessments",
    tags=["assessments"],
    responses={404: {"description": "Not found"}}
)

# Request/Response Models
class AssessmentCreateRequest(BaseModel):
    """Request to create a new assessment"""
    framework: Framework
    assessment_type: AssessmentType = Field(default=AssessmentType.INITIAL)
    name: Optional[str] = Field(None, description="Custom assessment name")
    description: Optional[str] = Field(None, description="Assessment description")
    scope: Optional[Dict[str, Any]] = Field(None, description="Assessment scope configuration")

class AssessmentCreateResponse(BaseModel):
    """Response for assessment creation"""
    assessment_id: str
    name: str
    framework: str
    status: str
    total_controls: int
    due_date: str
    message: str

class GapAnalysisResponse(BaseModel):
    """Response for gap analysis"""
    assessment_id: str
    framework: str
    analysis_date: str
    compliance_score: float
    total_controls: int
    covered_controls: int
    gap_summary: Dict[str, int]
    gaps: List[Dict[str, Any]]
    risk_analysis: Dict[str, Any]
    recommendations: List[Dict[str, Any]]
    next_assessment_due: str

class AssessmentReportResponse(BaseModel):
    """Response for assessment report"""
    report_metadata: Dict[str, Any]
    executive_summary: Dict[str, Any]
    assessment_details: Dict[str, Any]
    compliance_status: Dict[str, Any]
    gap_analysis: Dict[str, Any]
    recommendations: List[Dict[str, Any]]
    action_plan: Dict[str, Any]
    appendices: Dict[str, Any]

class AssessmentStatusResponse(BaseModel):
    """Assessment status response"""
    assessment_id: str
    name: str
    framework: str
    status: str
    progress: Dict[str, Any]
    created_at: str
    updated_at: str
    due_date: Optional[str] = None
    estimated_completion: Optional[str] = None

# Routes
@router.post("/create", response_model=AssessmentCreateResponse)
async def create_assessment(
    request: AssessmentCreateRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new compliance assessment"""
    try:
        check_permission(current_user, Permission.ASSESSMENT_CREATE)
        
        result = assessment_manager.create_assessment(
            db=db,
            organization_id=str(current_user.organization_id),
            user_id=str(current_user.id),
            framework=request.framework,
            assessment_type=request.assessment_type,
            name=request.name,
            description=request.description,
            scope=request.scope
        )
        
        return AssessmentCreateResponse(**result)
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error creating assessment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/{assessment_id}/start", response_model=SuccessResponse)
async def start_assessment(
    assessment_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Start an assessment and begin data collection"""
    try:
        check_permission(current_user, Permission.ASSESSMENT_CREATE)
        
        result = assessment_manager.start_assessment(
            db=db,
            assessment_id=assessment_id,
            user_id=str(current_user.id)
        )
        
        return SuccessResponse(
            success=True,
            message=result["message"],
            data=result
        )
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error starting assessment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{assessment_id}/gaps", response_model=GapAnalysisResponse)
async def get_gap_analysis(
    assessment_id: str,
    include_recommendations: bool = True,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get gap analysis for an assessment"""
    try:
        check_permission(current_user, Permission.ANALYTICS_VIEW)
        
        gap_analysis = assessment_manager.perform_gap_analysis(
            db=db,
            assessment_id=assessment_id,
            include_recommendations=include_recommendations
        )
        
        return GapAnalysisResponse(**gap_analysis)
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error getting gap analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/{assessment_id}/gaps/analyze", response_model=SuccessResponse)
async def perform_gap_analysis(
    assessment_id: str,
    background_tasks: BackgroundTasks,
    include_recommendations: bool = True,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Perform gap analysis for an assessment"""
    try:
        check_permission(current_user, Permission.ANALYTICS_VIEW)
        
        # Run gap analysis in background
        background_tasks.add_task(
            assessment_manager.perform_gap_analysis,
            db,
            assessment_id,
            include_recommendations
        )
        
        return SuccessResponse(
            success=True,
            message="Gap analysis started",
            data={
                "assessment_id": assessment_id,
                "include_recommendations": include_recommendations,
                "status": "analysis_started"
            }
        )
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error performing gap analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{assessment_id}/report", response_model=AssessmentReportResponse)
async def generate_assessment_report(
    assessment_id: str,
    report_format: str = "json",
    include_evidence: bool = False,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate comprehensive assessment report"""
    try:
        check_permission(current_user, Permission.REPORT_VIEW)
        
        report = assessment_manager.generate_assessment_report(
            db=db,
            assessment_id=assessment_id,
            report_format=report_format,
            include_evidence=include_evidence
        )
        
        return AssessmentReportResponse(**report)
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error generating assessment report: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/{assessment_id}/report/generate", response_model=SuccessResponse)
async def generate_report_async(
    assessment_id: str,
    background_tasks: BackgroundTasks,
    report_format: str = "json",
    include_evidence: bool = False,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate assessment report asynchronously"""
    try:
        check_permission(current_user, Permission.REPORT_CREATE)
        
        # Generate report in background
        background_tasks.add_task(
            assessment_manager.generate_assessment_report,
            db,
            assessment_id,
            report_format,
            include_evidence
        )
        
        return SuccessResponse(
            success=True,
            message="Report generation started",
            data={
                "assessment_id": assessment_id,
                "format": report_format,
                "include_evidence": include_evidence,
                "status": "generation_started"
            }
        )
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error starting report generation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{assessment_id}/status", response_model=AssessmentStatusResponse)
async def get_assessment_status(
    assessment_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get current status of an assessment"""
    try:
        check_permission(current_user, Permission.ANALYTICS_VIEW)
        
        status_info = assessment_manager.get_assessment_status(assessment_id)
        
        return AssessmentStatusResponse(**status_info)
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error getting assessment status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/", response_model=Dict[str, Any])
async def list_assessments(
    framework: Optional[Framework] = None,
    status: Optional[AssessmentStatus] = None,
    pagination: PaginationParams = Depends(),
    current_user: User = Depends(get_current_active_user)
):
    """List assessments for the current organization"""
    try:
        check_permission(current_user, Permission.ANALYTICS_VIEW)
        
        assessments = assessment_manager.list_assessments(
            organization_id=str(current_user.organization_id),
            framework=framework,
            status=status,
            limit=pagination.limit,
            offset=pagination.offset
        )
        
        return assessments
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error listing assessments: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/{assessment_id}", response_model=SuccessResponse)
async def delete_assessment(
    assessment_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Delete an assessment"""
    try:
        check_permission(current_user, Permission.ASSESSMENT_DELETE)
        
        # TODO: Implement assessment deletion
        # assessment_manager.delete_assessment(assessment_id, str(current_user.id))
        
        return SuccessResponse(
            success=True,
            message="Assessment deletion not yet implemented",
            data={"assessment_id": assessment_id}
        )
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error deleting assessment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/templates")
async def get_assessment_templates(
    framework: Optional[Framework] = None,
    current_user: User = Depends(get_current_active_user)
):
    """Get assessment templates for different frameworks"""
    try:
        templates = []
        
        frameworks_to_include = [framework] if framework else list(Framework)
        
        for fw in frameworks_to_include:
            templates.append({
                "framework": fw.value,
                "template_name": f"{fw.value.upper()} Standard Assessment",
                "description": f"Standard compliance assessment template for {fw.value.upper()}",
                "assessment_type": "initial",
                "estimated_duration": "2-4 weeks",
                "scope": {
                    "include_all_systems": True,
                    "automated_evidence_collection": True,
                    "manual_review_required": False
                }
            })
        
        return {
            "templates": templates,
            "total": len(templates)
        }
        
    except Exception as e:
        logger.error(f"Error getting assessment templates: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/statistics")
async def get_assessment_statistics(
    current_user: User = Depends(get_current_active_user)
):
    """Get assessment statistics for the organization"""
    try:
        check_permission(current_user, Permission.ANALYTICS_VIEW)
        
        # TODO: Implement actual statistics collection
        return {
            "organization_id": str(current_user.organization_id),
            "total_assessments": 0,
            "assessment_stats": {
                "completed": 0,
                "in_progress": 0,
                "draft": 0,
                "failed": 0
            },
            "framework_distribution": {},
            "average_compliance_score": 0.0,
            "total_gaps_identified": 0,
            "average_assessment_duration": "0 days"
        }
        
    except Exception as e:
        logger.error(f"Error getting assessment statistics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )