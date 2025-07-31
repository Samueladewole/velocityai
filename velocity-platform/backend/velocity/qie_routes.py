"""
QIE (Questionnaire Intelligence Engine) API Routes for Velocity AI Platform
"""

from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from models import Framework, User
from database import get_db
from auth import get_current_active_user
from validation import SuccessResponse, VelocityException, PaginationParams
from rbac import Permission, check_permission
from qie_integration import questionnaire_processor
import logging
import json

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/api/v1/qie",
    tags=["qie", "questionnaires"],
    responses={404: {"description": "Not found"}}
)

# Request/Response Models
class QuestionnaireUploadResponse(BaseModel):
    """Response for questionnaire upload"""
    questionnaire_id: str
    status: str
    filename: str
    file_size: int
    question_count: int
    detected_frameworks: List[str]
    message: str

class QuestionnaireProcessRequest(BaseModel):
    """Request to process a questionnaire"""
    frameworks: Optional[List[Framework]] = Field(
        default=None,
        description="Frameworks to process for (auto-detected if not specified)"
    )
    auto_fill: bool = Field(
        default=True,
        description="Whether to automatically fill responses using AI"
    )
    confidence_threshold: float = Field(
        default=0.8,
        ge=0.0,
        le=1.0,
        description="Minimum confidence threshold for AI responses"
    )

class QuestionnaireListResponse(BaseModel):
    """Response for listing questionnaires"""
    questionnaires: List[Dict[str, Any]]
    total: int
    limit: int
    offset: int

class ProcessingStatusResponse(BaseModel):
    """Processing status response"""
    questionnaire_id: str
    status: str
    progress: Optional[float] = None
    message: Optional[str] = None
    estimated_completion: Optional[str] = None

# Routes
@router.post("/questionnaires/upload", response_model=QuestionnaireUploadResponse)
async def upload_questionnaire(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Questionnaire file to upload"),
    metadata: Optional[str] = Form(None, description="Additional metadata as JSON string"),
    current_user: User = Depends(get_current_active_user)
):
    """Upload a questionnaire file for processing"""
    try:
        check_permission(current_user, Permission.EVIDENCE_CREATE)
        
        # Validate file
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No filename provided"
            )
        
        # Get file format from filename
        file_extension = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
        if not file_extension:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must have an extension"
            )
        
        # Read file content
        file_content = await file.read()
        
        # Parse metadata if provided
        parsed_metadata = None
        if metadata:
            try:
                parsed_metadata = json.loads(metadata)
            except json.JSONDecodeError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid metadata JSON"
                )
        
        # Upload questionnaire
        result = await questionnaire_processor.upload_questionnaire(
            file_content=file_content,
            filename=file.filename,
            user_id=str(current_user.id),
            organization_id=str(current_user.organization_id),
            file_format=file_extension,
            metadata=parsed_metadata
        )
        
        return QuestionnaireUploadResponse(**result)
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error uploading questionnaire: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/questionnaires/{questionnaire_id}/process", response_model=SuccessResponse)
async def process_questionnaire(
    questionnaire_id: str,
    request: QuestionnaireProcessRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user)
):
    """Process a questionnaire with AI assistance"""
    try:
        check_permission(current_user, Permission.AGENT_RUN)
        
        # Start processing in background
        background_tasks.add_task(
            questionnaire_processor.process_questionnaire,
            questionnaire_id,
            request.frameworks,
            request.auto_fill,
            request.confidence_threshold
        )
        
        return SuccessResponse(
            success=True,
            message=f"Questionnaire processing started for {questionnaire_id}",
            data={
                "questionnaire_id": questionnaire_id,
                "status": "processing_started",
                "frameworks": [fw.value for fw in request.frameworks] if request.frameworks else "auto_detected",
                "auto_fill": request.auto_fill,
                "confidence_threshold": request.confidence_threshold
            }
        )
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error starting questionnaire processing: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/questionnaires/{questionnaire_id}/results")
async def get_questionnaire_results(
    questionnaire_id: str,
    framework: Optional[Framework] = None,
    current_user: User = Depends(get_current_active_user)
):
    """Get processing results for a questionnaire"""
    try:
        check_permission(current_user, Permission.EVIDENCE_VIEW)
        
        results = await questionnaire_processor.get_questionnaire_results(
            questionnaire_id,
            framework
        )
        
        return results
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error getting questionnaire results: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/questionnaires/{questionnaire_id}/status", response_model=ProcessingStatusResponse)
async def get_processing_status(
    questionnaire_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get processing status for a questionnaire"""
    try:
        check_permission(current_user, Permission.EVIDENCE_VIEW)
        
        # Get basic results to determine status
        results = await questionnaire_processor.get_questionnaire_results(questionnaire_id)
        
        if not results:
            return ProcessingStatusResponse(
                questionnaire_id=questionnaire_id,
                status="not_found",
                message="Questionnaire not found"
            )
        
        status_value = results.get("status", "unknown")
        
        return ProcessingStatusResponse(
            questionnaire_id=questionnaire_id,
            status=status_value,
            progress=1.0 if status_value == "completed" else 0.5 if status_value == "processing" else 0.0,
            message=results.get("message", ""),
            estimated_completion=results.get("processed_at")
        )
        
    except Exception as e:
        logger.error(f"Error getting processing status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/questionnaires", response_model=QuestionnaireListResponse)
async def list_questionnaires(
    status: Optional[str] = None,
    framework: Optional[Framework] = None,
    pagination: PaginationParams = Depends(),
    current_user: User = Depends(get_current_active_user)
):
    """List questionnaires for the current organization"""
    try:
        check_permission(current_user, Permission.EVIDENCE_VIEW)
        
        results = await questionnaire_processor.list_questionnaires(
            organization_id=str(current_user.organization_id),
            status=status,
            framework=framework,
            limit=pagination.limit,
            offset=pagination.offset
        )
        
        return QuestionnaireListResponse(**results)
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error listing questionnaires: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/questionnaires/{questionnaire_id}", response_model=SuccessResponse)
async def delete_questionnaire(
    questionnaire_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Delete a questionnaire and its results"""
    try:
        check_permission(current_user, Permission.EVIDENCE_DELETE)
        
        result = await questionnaire_processor.delete_questionnaire(
            questionnaire_id,
            str(current_user.id)
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
        logger.error(f"Error deleting questionnaire: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/questionnaires/{questionnaire_id}/export")
async def export_questionnaire_results(
    questionnaire_id: str,
    format: str = "json",  # json, xlsx, pdf
    current_user: User = Depends(get_current_active_user)
):
    """Export questionnaire results in specified format"""
    try:
        check_permission(current_user, Permission.EVIDENCE_EXPORT)
        
        # Get results
        results = await questionnaire_processor.get_questionnaire_results(questionnaire_id)
        
        if not results:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Questionnaire results not found"
            )
        
        # For now, return JSON format
        # TODO: Implement actual export functionality for different formats
        if format.lower() == "json":
            return results
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Export format {format} not yet supported"
            )
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error exporting questionnaire results: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/supported-formats")
async def get_supported_formats(
    current_user: User = Depends(get_current_active_user)
):
    """Get list of supported questionnaire file formats"""
    return {
        "supported_formats": [
            {
                "format": "pdf",
                "description": "PDF documents",
                "max_size": "50MB"
            },
            {
                "format": "docx",
                "description": "Microsoft Word documents",
                "max_size": "50MB"
            },
            {
                "format": "xlsx",
                "description": "Microsoft Excel spreadsheets",
                "max_size": "50MB"
            },
            {
                "format": "csv",
                "description": "Comma-separated values",
                "max_size": "50MB"
            },
            {
                "format": "json",
                "description": "JSON format",
                "max_size": "50MB"
            }
        ],
        "max_file_size": "50MB",
        "supported_frameworks": [fw.value for fw in Framework]
    }

@router.get("/processing-stats")
async def get_processing_statistics(
    current_user: User = Depends(get_current_active_user)
):
    """Get QIE processing statistics for the organization"""
    try:
        check_permission(current_user, Permission.ANALYTICS_VIEW)
        
        # TODO: Implement actual statistics collection
        return {
            "organization_id": str(current_user.organization_id),
            "total_questionnaires": 0,
            "processing_stats": {
                "completed": 0,
                "processing": 0,
                "failed": 0,
                "pending": 0
            },
            "framework_distribution": {},
            "average_processing_time": "0 minutes",
            "success_rate": 0.0,
            "total_questions_processed": 0
        }
        
    except Exception as e:
        logger.error(f"Error getting processing statistics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )