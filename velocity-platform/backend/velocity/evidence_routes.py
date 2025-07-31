"""
Evidence Workflow API Routes for Velocity AI Platform
"""

from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from models import Framework, User, EvidenceType
from database import get_db
from auth import get_current_active_user
from validation import SuccessResponse, VelocityException, PaginationParams
from rbac import Permission, check_permission
from evidence_workflow import evidence_workflow_manager, EvidenceCategory, WorkflowStatus
import logging

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/api/v1/evidence",
    tags=["evidence"],
    responses={404: {"description": "Not found"}}
)

# Request/Response Models
class EvidenceUploadResponse(BaseModel):
    """Response for evidence upload"""
    evidence_id: str
    filename: str
    file_size: int
    status: str
    workflow_status: str
    control_id: str
    framework: str
    expires_at: str
    workflow_info: Dict[str, Any]
    message: str

class EvidenceApprovalRequest(BaseModel):
    """Request to approve evidence"""
    approval_notes: Optional[str] = Field(None, description="Approval notes")
    confidence_adjustment: Optional[float] = Field(None, ge=0.0, le=1.0, description="Confidence score adjustment")

class EvidenceRejectionRequest(BaseModel):
    """Request to reject evidence"""
    rejection_reason: str = Field(..., description="Reason for rejection")
    requires_revision: bool = Field(False, description="Whether evidence requires revision vs full rejection")

class EvidenceRenewalRequest(BaseModel):
    """Request to renew evidence"""
    new_expiry_date: Optional[str] = Field(None, description="New expiry date (ISO format)")
    extend_days: int = Field(365, description="Days to extend if no specific date provided")

class EvidenceStatusResponse(BaseModel):
    """Evidence status response"""
    evidence_id: str
    status: str
    workflow_status: str
    approved_by: Optional[str] = None
    approved_at: Optional[str] = None
    confidence_score: float
    message: str

class EvidenceRejectionResponse(BaseModel):
    """Evidence rejection response"""
    evidence_id: str
    status: str
    workflow_status: str
    rejected_by: str
    rejection_reason: str
    requires_revision: bool
    message: str

class ExpiringEvidenceResponse(BaseModel):
    """Expiring evidence response"""
    evidence_id: str
    control_id: str
    framework: str
    evidence_type: str
    filename: str
    expires_at: str
    days_until_expiry: int
    urgency: str
    description: str

class WorkflowStatusResponse(BaseModel):
    """Workflow status response"""
    organization_id: str
    framework: str
    total_evidence_items: int
    workflow_status_counts: Dict[str, int]
    evidence_status_counts: Dict[str, int]
    expiring_evidence: Dict[str, Any]
    summary: Dict[str, Any]

# Routes
@router.post("/upload", response_model=EvidenceUploadResponse)
async def upload_evidence(
    file: UploadFile = File(...),
    framework: Framework = Form(...),
    control_id: str = Form(...),
    evidence_type: EvidenceType = Form(...),
    evidence_category: str = Form(...),
    description: Optional[str] = Form(None),
    metadata: Optional[str] = Form(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload evidence file"""
    try:
        check_permission(current_user, Permission.EVIDENCE_CREATE)
        
        # Read file content
        file_content = await file.read()
        
        # Parse evidence category
        try:
            evidence_cat = EvidenceCategory(evidence_category)
        except ValueError:
            raise VelocityException(f"Invalid evidence category: {evidence_category}")
        
        # Parse metadata if provided
        import json
        metadata_dict = None
        if metadata:
            try:
                metadata_dict = json.loads(metadata)
            except json.JSONDecodeError:
                raise VelocityException("Invalid metadata JSON format")
        
        result = await evidence_workflow_manager.upload_evidence(
            db=db,
            file_content=file_content,
            filename=file.filename,
            user_id=str(current_user.id),
            organization_id=str(current_user.organization_id),
            framework=framework,
            control_id=control_id,
            evidence_type=evidence_type,
            evidence_category=evidence_cat,
            description=description,
            metadata=metadata_dict
        )
        
        return EvidenceUploadResponse(**result)
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error uploading evidence: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/{evidence_id}/approve", response_model=EvidenceStatusResponse)
async def approve_evidence(
    evidence_id: str,
    request: EvidenceApprovalRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Approve evidence item"""
    try:
        check_permission(current_user, Permission.EVIDENCE_VALIDATE)
        
        result = await evidence_workflow_manager.approve_evidence(
            db=db,
            evidence_id=evidence_id,
            approver_id=str(current_user.id),
            approval_notes=request.approval_notes,
            confidence_adjustment=request.confidence_adjustment
        )
        
        return EvidenceStatusResponse(**result)
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error approving evidence: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/{evidence_id}/reject", response_model=EvidenceRejectionResponse)
async def reject_evidence(
    evidence_id: str,
    request: EvidenceRejectionRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Reject evidence item"""
    try:
        check_permission(current_user, Permission.EVIDENCE_VALIDATE)
        
        result = await evidence_workflow_manager.reject_evidence(
            db=db,
            evidence_id=evidence_id,
            reviewer_id=str(current_user.id),
            rejection_reason=request.rejection_reason,
            requires_revision=request.requires_revision
        )
        
        return EvidenceRejectionResponse(**result)
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error rejecting evidence: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/expiring", response_model=List[ExpiringEvidenceResponse])
async def get_expiring_evidence(
    days_ahead: int = 30,
    framework: Optional[Framework] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get evidence items expiring within specified days"""
    try:
        check_permission(current_user, Permission.EVIDENCE_VIEW)
        
        expiring_items = await evidence_workflow_manager.get_expiring_evidence(
            db=db,
            organization_id=str(current_user.organization_id),
            days_ahead=days_ahead,
            framework=framework
        )
        
        return [ExpiringEvidenceResponse(**item) for item in expiring_items]
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error getting expiring evidence: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/{evidence_id}/renew", response_model=SuccessResponse)
async def renew_evidence(
    evidence_id: str,
    request: EvidenceRenewalRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Renew evidence item"""
    try:
        check_permission(current_user, Permission.EVIDENCE_UPDATE)
        
        # Parse new expiry date if provided
        from datetime import datetime, timezone
        new_expiry_date = None
        if request.new_expiry_date:
            try:
                new_expiry_date = datetime.fromisoformat(request.new_expiry_date.replace('Z', '+00:00'))
            except ValueError:
                raise VelocityException("Invalid expiry date format. Use ISO format (YYYY-MM-DDTHH:MM:SSZ)")
        
        result = await evidence_workflow_manager.renew_evidence(
            db=db,
            evidence_id=evidence_id,
            user_id=str(current_user.id),
            new_expiry_date=new_expiry_date,
            extend_days=request.extend_days
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
        logger.error(f"Error renewing evidence: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/workflow/status", response_model=WorkflowStatusResponse)
async def get_workflow_status(
    framework: Optional[Framework] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get workflow status summary"""
    try:
        check_permission(current_user, Permission.EVIDENCE_VIEW)
        
        status_info = await evidence_workflow_manager.get_workflow_status(
            db=db,
            organization_id=str(current_user.organization_id),
            framework=framework
        )
        
        return WorkflowStatusResponse(**status_info)
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error getting workflow status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/categories")
async def get_evidence_categories(
    current_user: User = Depends(get_current_active_user)
):
    """Get available evidence categories"""
    try:
        categories = []
        for category in EvidenceCategory:
            categories.append({
                "value": category.value,
                "display_name": category.value.replace("_", " ").title(),
                "description": f"{category.value.replace('_', ' ').title()} evidence type"
            })
        
        return {
            "categories": categories,
            "total": len(categories)
        }
        
    except Exception as e:
        logger.error(f"Error getting evidence categories: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/workflow/statuses")
async def get_workflow_statuses(
    current_user: User = Depends(get_current_active_user)
):
    """Get available workflow statuses"""
    try:
        statuses = []
        for wf_status in WorkflowStatus:
            statuses.append({
                "value": wf_status.value,
                "display_name": wf_status.value.replace("_", " ").title(),
                "description": f"Evidence is {wf_status.value.replace('_', ' ')}"
            })
        
        return {
            "statuses": statuses,
            "total": len(statuses)
        }
        
    except Exception as e:
        logger.error(f"Error getting workflow statuses: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/configuration")
async def get_evidence_configuration(
    current_user: User = Depends(get_current_active_user)
):
    """Get evidence workflow configuration"""
    try:
        check_permission(current_user, Permission.EVIDENCE_VIEW)
        
        from evidence_workflow import EVIDENCE_CONFIG
        
        # Convert enum keys to strings for JSON serialization
        config_copy = {}
        for key, value in EVIDENCE_CONFIG.items():
            if key == "retention_periods":
                config_copy[key] = {cat.value: days for cat, days in value.items()}
            elif key == "approval_requirements":
                config_copy[key] = {cat.value: reqs for cat, reqs in value.items()}
            else:
                config_copy[key] = value
        
        return {
            "configuration": config_copy,
            "description": "Evidence workflow configuration including file limits, retention periods, and approval requirements"
        }
        
    except Exception as e:
        logger.error(f"Error getting evidence configuration: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/statistics")
async def get_evidence_statistics(
    framework: Optional[Framework] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get evidence statistics for the organization"""
    try:
        check_permission(current_user, Permission.ANALYTICS_VIEW)
        
        # Get workflow status to provide basic statistics
        status_info = await evidence_workflow_manager.get_workflow_status(
            db=db,
            organization_id=str(current_user.organization_id),
            framework=framework
        )
        
        return {
            "organization_id": str(current_user.organization_id),
            "framework": framework.value if framework else "all",
            "total_items": status_info["total_evidence_items"],
            "workflow_breakdown": status_info["workflow_status_counts"],
            "status_breakdown": status_info["evidence_status_counts"],
            "expiration_alerts": {
                "expiring_30_days": status_info["expiring_evidence"]["expiring_30_days"],
                "expiring_7_days": status_info["expiring_evidence"]["expiring_7_days"],
                "critical_items": len(status_info["expiring_evidence"]["critical_items"])
            },
            "compliance_health": {
                "pending_approval": status_info["summary"]["pending_approval"],
                "approved": status_info["summary"]["approved"],
                "requires_attention": status_info["summary"]["requires_attention"]
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting evidence statistics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/bulk-actions")
async def get_bulk_actions(
    current_user: User = Depends(get_current_active_user)
):
    """Get available bulk actions for evidence management"""
    try:
        actions = [
            {
                "action": "bulk_approve",
                "display_name": "Bulk Approve",
                "description": "Approve multiple evidence items at once",
                "required_permission": "evidence:validate"
            },
            {
                "action": "bulk_reject",
                "display_name": "Bulk Reject",
                "description": "Reject multiple evidence items at once",
                "required_permission": "evidence:validate"
            },
            {
                "action": "bulk_renew",
                "display_name": "Bulk Renew",
                "description": "Renew multiple evidence items at once",
                "required_permission": "evidence:update"
            },
            {
                "action": "bulk_export",
                "display_name": "Bulk Export",
                "description": "Export multiple evidence items",
                "required_permission": "evidence:export"
            }
        ]
        
        return {
            "bulk_actions": actions,
            "total": len(actions),
            "note": "Bulk actions are available for evidence management efficiency"
        }
        
    except Exception as e:
        logger.error(f"Error getting bulk actions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )