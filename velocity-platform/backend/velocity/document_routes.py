"""
Document Management API Routes
Advanced document export, upload, and email delivery endpoints
"""
import os
import mimetypes
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from database import get_db
from auth import get_current_active_user
from models import User
from rbac import Permission, require_permission
from validation import SuccessResponse, create_success_response, VelocityException
from document_management import (
    document_manager, ExportRequest, EmailRequest, DocumentUploadRequest,
    ExportFormat, DocumentType, EmailPriority, ExportResult, EmailResult
)

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])

# Export Models
class QuickExportRequest(BaseModel):
    document_type: DocumentType
    format: ExportFormat
    title: str
    include_charts: bool = True
    include_raw_data: bool = False
    password_protect: bool = False
    password: Optional[str] = None

class BulkExportRequest(BaseModel):
    export_requests: List[QuickExportRequest]
    combine_into_single_file: bool = False
    email_when_complete: bool = False
    email_addresses: Optional[List[EmailStr]] = []

class ScheduledExportRequest(BaseModel):
    document_type: DocumentType
    format: ExportFormat
    title: str
    schedule_cron: str  # Cron expression
    email_addresses: List[EmailStr]
    enabled: bool = True

# Email Models
class QuickEmailRequest(BaseModel):
    to_addresses: List[EmailStr]
    subject: str
    template_name: str
    template_variables: Dict[str, Any] = {}
    attach_latest_report: bool = False
    priority: EmailPriority = EmailPriority.NORMAL

class BulkEmailRequest(BaseModel):
    recipient_groups: List[Dict[str, Any]]  # [{emails: [...], template_vars: {...}}]
    subject: str
    template_name: str
    common_variables: Dict[str, Any] = {}
    attachments: List[str] = []

# Response Models
class ExportStatusResponse(BaseModel):
    export_id: str
    status: str
    progress: int
    file_size: Optional[int] = None
    download_url: Optional[str] = None
    created_at: datetime
    expires_at: datetime

class EmailStatusResponse(BaseModel):
    email_id: str
    status: str
    sent_at: datetime
    recipients: List[str]
    bounce_count: int = 0
    open_count: int = 0

@router.post("/export", response_model=SuccessResponse)
async def export_document(
    request: ExportRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.EXPORT_DOCUMENTS))
):
    """Export document in specified format"""
    try:
        # Get current organization data
        org_data = await _get_organization_data(current_user, db)
        
        # Update request with organization data
        request.organization_id = current_user.organization_id
        if not request.data:
            request.data = org_data
        else:
            request.data.update(org_data)
        
        # Generate export
        result = await document_manager.export_document(request)
        
        return create_success_response(
            data={
                "export_id": result.export_id,
                "file_size": result.file_size,
                "format": result.format.value,
                "download_url": result.download_url,
                "expires_at": result.expires_at.isoformat()
            },
            message=f"Document exported successfully as {request.format.value.upper()}"
        )
        
    except Exception as e:
        raise VelocityException(f"Export failed: {str(e)}")

@router.post("/export/quick", response_model=SuccessResponse)
async def quick_export(
    request: QuickExportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.EXPORT_DOCUMENTS))
):
    """Quick export with current organization data"""
    try:
        # Get current organization data
        org_data = await _get_organization_data(current_user, db)
        
        # Create full export request
        export_request = ExportRequest(
            document_type=request.document_type,
            format=request.format,
            title=request.title,
            organization_id=current_user.organization_id,
            data=org_data,
            include_charts=request.include_charts,
            include_raw_data=request.include_raw_data,
            password_protect=request.password_protect,
            password=request.password
        )
        
        result = await document_manager.export_document(export_request)
        
        return create_success_response(
            data={
                "export_id": result.export_id,
                "download_url": result.download_url,
                "format": result.format.value,
                "file_size": result.file_size
            }
        )
        
    except Exception as e:
        raise VelocityException(f"Quick export failed: {str(e)}")

@router.post("/export/bulk", response_model=SuccessResponse)
async def bulk_export(
    request: BulkExportRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.EXPORT_DOCUMENTS))
):
    """Export multiple documents in different formats"""
    try:
        org_data = await _get_organization_data(current_user, db)
        export_results = []
        
        for quick_request in request.export_requests:
            export_request = ExportRequest(
                document_type=quick_request.document_type,
                format=quick_request.format,
                title=quick_request.title,
                organization_id=current_user.organization_id,
                data=org_data,
                include_charts=quick_request.include_charts,
                include_raw_data=quick_request.include_raw_data,
                password_protect=quick_request.password_protect,
                password=quick_request.password
            )
            
            result = await document_manager.export_document(export_request)
            export_results.append({
                "export_id": result.export_id,
                "format": result.format.value,
                "download_url": result.download_url,
                "file_size": result.file_size
            })
        
        # Send email notification if requested
        if request.email_when_complete and request.email_addresses:
            background_tasks.add_task(
                _send_export_complete_email,
                request.email_addresses,
                export_results,
                current_user.organization.name if current_user.organization else "Your Organization"
            )
        
        return create_success_response(
            data={
                "exports": export_results,
                "total_exports": len(export_results),
                "email_notification_sent": request.email_when_complete
            }
        )
        
    except Exception as e:
        raise VelocityException(f"Bulk export failed: {str(e)}")

@router.get("/export/{export_id}/status", response_model=ExportStatusResponse)
async def get_export_status(
    export_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get export status and progress"""
    result = document_manager.get_export_result(export_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Export not found")
    
    return ExportStatusResponse(
        export_id=export_id,
        status="completed" if os.path.exists(result.file_path) else "failed",
        progress=100,
        file_size=result.file_size,
        download_url=result.download_url,
        created_at=result.created_at,
        expires_at=result.expires_at
    )

@router.get("/download/{export_id}")
async def download_exported_document(
    export_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Download exported document"""
    result = document_manager.get_export_result(export_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Export not found")
    
    if not os.path.exists(result.file_path):
        raise HTTPException(status_code=404, detail="Export file not found")
    
    # Check if file has expired
    if datetime.now(timezone.utc) > result.expires_at:
        raise HTTPException(status_code=410, detail="Export has expired")
    
    # Determine media type
    media_type, _ = mimetypes.guess_type(result.file_path)
    if not media_type:
        media_type = 'application/octet-stream'
    
    # Get filename for download
    filename = f"{Path(result.file_path).stem}.{result.format.value}"
    
    return FileResponse(
        path=result.file_path,
        media_type=media_type,
        filename=filename,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.post("/email/send", response_model=SuccessResponse)
async def send_email(
    request: EmailRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_permission(Permission.SEND_EMAILS))
):
    """Send email with optional attachments"""
    try:
        result = await document_manager.send_email(request)
        
        return create_success_response(
            data={
                "email_id": result.email_id,
                "status": result.status,
                "recipients": result.recipients,
                "sent_at": result.sent_at.isoformat()
            }
        )
        
    except Exception as e:
        raise VelocityException(f"Email send failed: {str(e)}")

@router.post("/email/quick", response_model=SuccessResponse)
async def send_quick_email(
    request: QuickEmailRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.SEND_EMAILS))
):
    """Send quick email using template"""
    try:
        # Get organization data for template variables
        org_data = await _get_organization_data(current_user, db)
        
        # Merge template variables
        template_vars = {
            "organization_name": current_user.organization.name if current_user.organization else "Your Organization",
            "user_name": current_user.full_name or current_user.email,
            "dashboard_url": "https://app.velocity.ai/dashboard",
            "support_email": "support@velocity.ai",
            **org_data,
            **request.template_variables
        }
        
        # Prepare attachments
        attachments = []
        if request.attach_latest_report:
            # Find latest export for this organization
            # This is simplified - in production you'd query a database
            latest_export = None  # Implement lookup logic
            if latest_export:
                attachments.append(latest_export)
        
        email_request = EmailRequest(
            to_addresses=request.to_addresses,
            subject=request.subject,
            body="",  # Will be filled by template
            template_name=request.template_name,
            template_variables=template_vars,
            attachments=attachments,
            priority=request.priority
        )
        
        result = await document_manager.send_email(email_request)
        
        return create_success_response(
            data={
                "email_id": result.email_id,
                "status": result.status,
                "recipients": result.recipients
            }
        )
        
    except Exception as e:
        raise VelocityException(f"Quick email failed: {str(e)}")

@router.post("/email/bulk", response_model=SuccessResponse)
async def send_bulk_email(
    request: BulkEmailRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_permission(Permission.SEND_EMAILS))
):
    """Send bulk emails to multiple recipient groups"""
    try:
        email_results = []
        
        for group in request.recipient_groups:
            # Merge common variables with group-specific variables
            template_vars = {
                **request.common_variables,
                **group.get('template_vars', {})
            }
            
            email_request = EmailRequest(
                to_addresses=group['emails'],
                subject=request.subject,
                body="",
                template_name=request.template_name,
                template_variables=template_vars,
                attachments=request.attachments
            )
            
            result = await document_manager.send_email(email_request)
            email_results.append({
                "email_id": result.email_id,
                "status": result.status,
                "recipients": result.recipients
            })
        
        return create_success_response(
            data={
                "emails_sent": len(email_results),
                "results": email_results
            }
        )
        
    except Exception as e:
        raise VelocityException(f"Bulk email failed: {str(e)}")

@router.post("/upload", response_model=SuccessResponse)
async def upload_document(
    file: UploadFile = File(...),
    file_type: str = Form(...),
    document_type: Optional[str] = Form(None),
    extract_questions: bool = Form(True),
    auto_categorize: bool = Form(True),
    current_user: User = Depends(require_permission(Permission.UPLOAD_DOCUMENTS))
):
    """Upload document with AI processing"""
    try:
        # Validate file type
        allowed_types = [
            'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv', 'application/json'
        ]
        
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")
        
        # Create upload request
        upload_request = DocumentUploadRequest(
            file_type=file_type,
            original_filename=file.filename,
            organization_id=current_user.organization_id,
            document_type=DocumentType(document_type) if document_type else None,
            extract_questions=extract_questions,
            auto_categorize=auto_categorize
        )
        
        result = await document_manager.upload_document(file, upload_request)
        
        return create_success_response(
            data=result,
            message="Document uploaded and processed successfully"
        )
        
    except Exception as e:
        raise VelocityException(f"Document upload failed: {str(e)}")

@router.get("/templates/email", response_model=SuccessResponse)
async def get_email_templates(
    current_user: User = Depends(get_current_active_user)
):
    """Get available email templates"""
    templates = [
        {
            "name": "compliance_report",
            "display_name": "Compliance Report",
            "description": "Professional compliance report email with metrics",
            "variables": ["organization_name", "report_date", "trust_score", "evidence_count", "automation_rate", "custom_message", "dashboard_url"]
        },
        {
            "name": "assessment_complete",
            "display_name": "Assessment Complete",
            "description": "Notification when compliance assessment is completed",
            "variables": ["framework", "organization_name", "score", "report_url"]
        }
    ]
    
    return create_success_response(data={"templates": templates})

@router.get("/templates/export", response_model=SuccessResponse)
async def get_export_templates(
    current_user: User = Depends(get_current_active_user)
):
    """Get available export templates and formats"""
    formats = [
        {
            "format": "pdf",
            "display_name": "PDF Report",
            "description": "Professional PDF report with charts and tables",
            "supported_types": [dt.value for dt in DocumentType]
        },
        {
            "format": "xlsx",
            "display_name": "Excel Spreadsheet",
            "description": "Interactive Excel workbook with multiple sheets",
            "supported_types": [dt.value for dt in DocumentType]
        },
        {
            "format": "docx",
            "display_name": "Word Document",
            "description": "Formatted Word document",
            "supported_types": [dt.value for dt in DocumentType]
        },
        {
            "format": "pptx",
            "display_name": "PowerPoint Presentation",
            "description": "Executive presentation slides",
            "supported_types": ["compliance_report", "executive_summary"]
        },
        {
            "format": "html",
            "display_name": "HTML Report",
            "description": "Interactive web-based report",
            "supported_types": [dt.value for dt in DocumentType]
        }
    ]
    
    return create_success_response(data={"formats": formats})

@router.delete("/export/{export_id}", response_model=SuccessResponse)
async def delete_export(
    export_id: str,
    current_user: User = Depends(require_permission(Permission.DELETE_DOCUMENTS))
):
    """Delete exported document"""
    result = document_manager.get_export_result(export_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Export not found")
    
    try:
        if os.path.exists(result.file_path):
            os.remove(result.file_path)
        
        # Remove from cache
        if export_id in document_manager.export_cache:
            del document_manager.export_cache[export_id]
        
        return create_success_response(message="Export deleted successfully")
        
    except Exception as e:
        raise VelocityException(f"Failed to delete export: {str(e)}")

@router.post("/cleanup/expired", response_model=SuccessResponse)
async def cleanup_expired_exports(
    current_user: User = Depends(require_permission(Permission.SYSTEM_ADMIN))
):
    """Clean up expired export files"""
    try:
        document_manager.cleanup_expired_exports()
        return create_success_response(message="Expired exports cleaned up successfully")
        
    except Exception as e:
        raise VelocityException(f"Cleanup failed: {str(e)}")

# Helper functions
async def _get_organization_data(current_user: User, db: Session) -> Dict[str, Any]:
    """Get organization data for exports"""
    from models import Agent, EvidenceItem, TrustScore, Framework, AgentStatus, EvidenceStatus
    from sqlalchemy import func, desc
    
    org_id = current_user.organization_id
    
    # Get trust score
    trust_score_record = db.query(TrustScore).filter(
        TrustScore.organization_id == org_id
    ).order_by(desc(TrustScore.created_at)).first()
    
    trust_score = {
        "current": trust_score_record.total_score if trust_score_record else 85,
        "target": 95,
        "trend": "+2.1",
        "last_updated": trust_score_record.last_updated.isoformat() if trust_score_record else datetime.now().isoformat()
    }
    
    # Get agents
    agents = db.query(Agent).filter(Agent.organization_id == org_id).all()
    active_agents = [a for a in agents if a.status == AgentStatus.ACTIVE]
    
    agents_data = {
        "total": len(agents),
        "active": len(active_agents),
        "success_rate": int(sum(a.success_rate for a in agents) / max(len(agents), 1)) if agents else 0,
        "agents_list": [
            {
                "id": str(agent.id),
                "name": agent.name,
                "platform": agent.platform.value,
                "framework": agent.framework.value,
                "status": agent.status.value,
                "success_rate": agent.success_rate,
                "evidence_collected": agent.evidence_collected,
                "last_run": agent.last_run.isoformat() if agent.last_run else None,
                "next_run": agent.next_run.isoformat() if agent.next_run else None
            }
            for agent in agents
        ]
    }
    
    # Get evidence
    evidence_count = db.query(EvidenceItem).filter(
        EvidenceItem.organization_id == org_id
    ).count()
    
    today_evidence = db.query(EvidenceItem).filter(
        EvidenceItem.organization_id == org_id,
        func.date(EvidenceItem.created_at) == datetime.now().date()
    ).count()
    
    evidence_data = {
        "total_collected": evidence_count,
        "today_collected": today_evidence,
        "automation_rate": min(95, int(70 + (len(active_agents) / max(len(agents), 1)) * 25)) if agents else 70,
        "recent_items": []  # Could be populated with recent evidence
    }
    
    # Get framework status
    frameworks_data = {}
    for framework in Framework:
        framework_evidence = db.query(EvidenceItem).filter(
            EvidenceItem.organization_id == org_id,
            EvidenceItem.framework == framework
        ).all()
        
        framework_agents = db.query(Agent).filter(
            Agent.organization_id == org_id,
            Agent.framework == framework
        ).all()
        
        if framework_evidence or framework_agents:
            verified_count = len([e for e in framework_evidence if e.status == EvidenceStatus.VERIFIED])
            total_count = len(framework_evidence)
            
            frameworks_data[framework.value] = {
                "evidence_count": total_count,
                "verified_count": verified_count,
                "progress": int((verified_count / max(total_count, 1)) * 100),
                "active_agents": len([a for a in framework_agents if a.status == AgentStatus.ACTIVE])
            }
    
    return {
        "organization_name": current_user.organization.name if current_user.organization else "Your Organization",
        "organization_id": org_id,
        "trust_score": trust_score,
        "agents": agents_data,
        "evidence": evidence_data,
        "frameworks": frameworks_data,
        "generated_at": datetime.now().isoformat()
    }

async def _send_export_complete_email(email_addresses: List[str], export_results: List[Dict], org_name: str):
    """Send email notification when bulk export is complete"""
    try:
        email_request = EmailRequest(
            to_addresses=email_addresses,
            subject=f"Export Complete - {org_name}",
            body=f"""
            <h2>Your exports are ready!</h2>
            <p>We've successfully generated {len(export_results)} documents for {org_name}.</p>
            <h3>Generated Documents:</h3>
            <ul>
            """ + "\n".join([
                f'<li>{result["format"].upper()} - <a href="{result["download_url"]}">Download</a> ({result["file_size"]:,} bytes)</li>'
                for result in export_results
            ]) + """
            </ul>
            <p>These files will be available for download for 24 hours.</p>
            """,
            send_as_html=True
        )
        
        await document_manager.send_email(email_request)
        
    except Exception as e:
        # Log error but don't fail the main export process
        import logging
        logging.error(f"Failed to send export complete email: {e}")