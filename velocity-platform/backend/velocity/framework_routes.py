"""
Framework Management API Routes for Velocity AI Platform
"""

from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from models import Framework, User
from database import get_db
from auth import get_current_active_user
from validation import SuccessResponse, VelocityException
from rbac import Permission, check_permission
from framework_manager import framework_manager
import logging

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/api/v1/frameworks",
    tags=["frameworks"],
    responses={404: {"description": "Not found"}}
)

# Request/Response Models
class FrameworkEnableRequest(BaseModel):
    """Request to enable a framework"""
    configuration: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional framework-specific configuration"
    )

class FrameworkConfigureRequest(BaseModel):
    """Request to configure a framework"""
    configuration: Dict[str, Any] = Field(
        ...,
        description="Framework-specific configuration"
    )

class FrameworkStatusResponse(BaseModel):
    """Framework status response"""
    enabled: bool
    framework_name: Optional[str] = None
    compliance_score: float = 0.0
    total_controls: int = 0
    covered_controls: int = 0
    agents: Dict[str, int] = {}
    evidence: Dict[str, int] = {}
    ai_coverage: float = 0.0
    audit_frequency: Optional[str] = None
    last_updated: Optional[str] = None

class FrameworkInfoResponse(BaseModel):
    """Framework information response"""
    id: str
    name: str
    description: str
    total_controls: int
    automation_available: bool
    ai_coverage: float

# Routes
@router.get("/", response_model=List[FrameworkInfoResponse])
async def list_frameworks(
    current_user: User = Depends(get_current_active_user)
):
    """Get list of all available frameworks"""
    try:
        frameworks = framework_manager.get_all_frameworks()
        return frameworks
    except Exception as e:
        logger.error(f"Error listing frameworks: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/status")
async def get_all_frameworks_status(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get compliance status for all frameworks"""
    try:
        check_permission(current_user, Permission.VIEW_COMPLIANCE_STATUS)
        
        status = framework_manager.get_framework_status(
            db, 
            str(current_user.organization_id)
        )
        
        return {
            "organization_id": str(current_user.organization_id),
            "frameworks": status
        }
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error getting frameworks status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{framework}/info", response_model=Dict[str, Any])
async def get_framework_info(
    framework: Framework,
    current_user: User = Depends(get_current_active_user)
):
    """Get detailed information about a specific framework"""
    try:
        info = framework_manager.get_framework_info(framework)
        if not info:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Framework {framework.value} not found"
            )
        
        return {
            "id": framework.value,
            **info
        }
    except Exception as e:
        logger.error(f"Error getting framework info: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{framework}/status", response_model=FrameworkStatusResponse)
async def get_framework_status(
    framework: Framework,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get compliance status for a specific framework"""
    try:
        check_permission(current_user, Permission.VIEW_COMPLIANCE_STATUS)
        
        status = framework_manager.get_framework_status(
            db, 
            str(current_user.organization_id),
            framework
        )
        
        return status
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error getting framework status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/{framework}/enable", response_model=SuccessResponse)
async def enable_framework(
    framework: Framework,
    request: FrameworkEnableRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Enable a framework for the organization"""
    try:
        check_permission(current_user, Permission.MANAGE_FRAMEWORKS)
        
        result = framework_manager.enable_framework(
            db,
            str(current_user.organization_id),
            framework,
            request.configuration
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
        logger.error(f"Error enabling framework: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/{framework}/disable", response_model=SuccessResponse)
async def disable_framework(
    framework: Framework,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Disable a framework for the organization"""
    try:
        check_permission(current_user, Permission.MANAGE_FRAMEWORKS)
        
        result = framework_manager.disable_framework(
            db,
            str(current_user.organization_id),
            framework
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
        logger.error(f"Error disabling framework: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/{framework}/configure", response_model=SuccessResponse)
async def configure_framework(
    framework: Framework,
    request: FrameworkConfigureRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update framework configuration"""
    try:
        check_permission(current_user, Permission.MANAGE_FRAMEWORKS)
        
        result = framework_manager.configure_framework(
            db,
            str(current_user.organization_id),
            framework,
            request.configuration
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
        logger.error(f"Error configuring framework: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/enable-all", response_model=SuccessResponse)
async def enable_all_frameworks(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Enable all available frameworks for the organization"""
    try:
        check_permission(current_user, Permission.MANAGE_FRAMEWORKS)
        
        results = []
        for framework in [Framework.SOC2, Framework.ISO27001, Framework.GDPR, Framework.HIPAA, Framework.CIS_CONTROLS]:
            try:
                result = framework_manager.enable_framework(
                    db,
                    str(current_user.organization_id),
                    framework
                )
                results.append(result)
            except Exception as e:
                logger.warning(f"Failed to enable {framework.value}: {e}")
                results.append({
                    "framework": framework.value,
                    "status": "failed",
                    "error": str(e)
                })
        
        successful = [r for r in results if r.get("status") in ["enabled", "already_enabled"]]
        
        return SuccessResponse(
            success=len(successful) > 0,
            message=f"Enabled {len(successful)} frameworks successfully",
            data={
                "results": results,
                "successful": len(successful),
                "failed": len(results) - len(successful)
            }
        )
    except Exception as e:
        logger.error(f"Error enabling all frameworks: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )