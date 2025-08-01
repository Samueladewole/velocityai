"""
Velocity AI Platform - Email API Routes
REST endpoints for email functionality
"""
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from database import get_db
from models import User
from auth import get_current_active_user
from rbac import Permission, require_permission
from validation import SuccessResponse
from email_service import (
    email_service,
    EmailRequest,
    EmailDeliveryResult,
    send_guide_download_email,
    send_welcome_email,
    send_evidence_report_email
)

logger = logging.getLogger(__name__)

router = APIRouter()

# Request Models
class GuideDownloadRequest(BaseModel):
    """Request to send guide download email"""
    email: EmailStr
    guide_type: str = Field(..., description="Type of guide: gdpr_transfer, iso27001, soc2")
    first_name: str
    last_name: str
    company_name: Optional[str] = None
    phone: Optional[str] = None
    job_title: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None

class WelcomeEmailRequest(BaseModel):
    """Request to send welcome email"""
    email: EmailStr
    user_name: str
    verification_link: Optional[str] = None

class EvidenceReportRequest(BaseModel):
    """Request to send evidence report email"""
    email: EmailStr
    user_name: str
    evidence_count: int
    trust_score: float
    frameworks: list[str]
    report_url: str

class CustomEmailRequest(BaseModel):
    """Request to send custom email"""
    to_email: EmailStr
    subject: str
    template_name: str
    template_data: Dict[str, Any] = Field(default_factory=dict)
    tags: list[str] = Field(default_factory=list)

# Response Models
class EmailSentResponse(BaseModel):
    """Email sent response"""
    success: bool
    message_id: Optional[str] = None
    message: str
    timestamp: datetime

class EmailStatsResponse(BaseModel):
    """Email statistics response"""
    total_sent: int
    total_delivered: int
    total_bounced: int
    total_complaints: int
    delivery_rate: float
    bounce_rate: float
    complaint_rate: float

@router.post("/send-guide-download", response_model=EmailSentResponse)
async def send_guide_download_email_endpoint(
    request: GuideDownloadRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Send guide download email to prospect
    
    This endpoint handles guide download requests from the website.
    It sends a personalized email with the download link and tracks
    the lead for marketing purposes.
    """
    try:
        # Generate download link (in production, this would create a secure token)
        download_link = f"https://velocity.eripapp.com/downloads/{request.guide_type}?token=secure_token"
        
        # Combine first and last name
        full_name = f"{request.first_name} {request.last_name}".strip()
        
        # Send email in background
        def send_email_task():
            import asyncio
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                result = loop.run_until_complete(
                    send_guide_download_email(
                        to_email=request.email,
                        guide_type=request.guide_type,
                        user_name=full_name,
                        download_link=download_link,
                        company_name=request.company_name
                    )
                )
                if not result.success:
                    logger.error(f"Failed to send guide email: {result.error}")
            finally:
                loop.close()
        
        background_tasks.add_task(send_email_task)
        
        # TODO: Store lead information in database
        # This would track the prospect for marketing automation
        
        return EmailSentResponse(
            success=True,
            message="Guide download email queued for delivery",
            timestamp=datetime.now(timezone.utc)
        )
        
    except Exception as e:
        logger.error(f"Failed to queue guide download email: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send guide download email: {str(e)}"
        )

@router.post("/send-welcome", response_model=EmailSentResponse)
async def send_welcome_email_endpoint(
    request: WelcomeEmailRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_permission(Permission.SEND_EMAILS))
):
    """
    Send welcome email to new user
    
    This endpoint is used internally when a new user signs up
    to send them a welcome email with onboarding information.
    """
    try:
        def send_email_task():
            import asyncio
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                result = loop.run_until_complete(
                    send_welcome_email(
                        to_email=request.email,
                        user_name=request.user_name,
                        verification_link=request.verification_link
                    )
                )
                if not result.success:
                    logger.error(f"Failed to send welcome email: {result.error}")
            finally:
                loop.close()
        
        background_tasks.add_task(send_email_task)
        
        return EmailSentResponse(
            success=True,
            message="Welcome email queued for delivery",
            timestamp=datetime.now(timezone.utc)
        )
        
    except Exception as e:
        logger.error(f"Failed to queue welcome email: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send welcome email: {str(e)}"
        )

@router.post("/send-evidence-report", response_model=EmailSentResponse)
async def send_evidence_report_email_endpoint(
    request: EvidenceReportRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_permission(Permission.SEND_EMAILS))
):
    """
    Send evidence collection report email
    
    This endpoint sends compliance evidence reports to users
    when their evidence collection is complete.
    """
    try:
        report_data = {
            'evidence_count': request.evidence_count,
            'trust_score': request.trust_score,
            'frameworks': request.frameworks,
            'report_url': request.report_url
        }
        
        def send_email_task():
            import asyncio
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                result = loop.run_until_complete(
                    send_evidence_report_email(
                        to_email=request.email,
                        user_name=request.user_name,
                        report_data=report_data
                    )
                )
                if not result.success:
                    logger.error(f"Failed to send report email: {result.error}")
            finally:
                loop.close()
        
        background_tasks.add_task(send_email_task)
        
        return EmailSentResponse(
            success=True,
            message="Evidence report email queued for delivery",
            timestamp=datetime.now(timezone.utc)
        )
        
    except Exception as e:
        logger.error(f"Failed to queue evidence report email: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send evidence report email: {str(e)}"
        )

@router.post("/send-custom", response_model=EmailSentResponse)
async def send_custom_email_endpoint(
    request: CustomEmailRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_permission(Permission.SEND_EMAILS))
):
    """
    Send custom email using template
    
    This endpoint allows sending custom emails using any
    available template with custom data.
    """
    try:
        email_request = EmailRequest(
            to_email=request.to_email,
            subject=request.subject,
            template_name=request.template_name,
            template_data=request.template_data,
            tags=request.tags
        )
        
        def send_email_task():
            import asyncio
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                result = loop.run_until_complete(
                    email_service.send_email(email_request)
                )
                if not result.success:
                    logger.error(f"Failed to send custom email: {result.error}")
            finally:
                loop.close()
        
        background_tasks.add_task(send_email_task)
        
        return EmailSentResponse(
            success=True,
            message="Custom email queued for delivery",
            timestamp=datetime.now(timezone.utc)
        )
        
    except Exception as e:
        logger.error(f"Failed to queue custom email: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send custom email: {str(e)}"
        )

@router.get("/templates", response_model=SuccessResponse)
async def get_email_templates(
    current_user: User = Depends(require_permission(Permission.SEND_EMAILS))
):
    """
    Get list of available email templates
    
    Returns all available email templates that can be used
    for sending custom emails.
    """
    try:
        templates = list(email_service.templates.keys())
        
        return SuccessResponse(
            success=True,
            data={
                "templates": templates,
                "total_count": len(templates)
            },
            message=f"Retrieved {len(templates)} email templates"
        )
        
    except Exception as e:
        logger.error(f"Failed to get email templates: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve email templates: {str(e)}"
        )

@router.get("/statistics", response_model=EmailStatsResponse)
async def get_email_statistics(
    current_user: User = Depends(require_permission(Permission.SEND_EMAILS))
):
    """
    Get email sending statistics
    
    Returns statistics about email delivery, bounces,
    complaints, and overall performance.
    """
    try:
        stats = await email_service.get_sending_statistics()
        
        if "error" in stats:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to retrieve statistics: {stats['error']}"
            )
        
        # Calculate metrics from SES data
        send_data_points = stats.get('send_data_points', [])
        
        total_sent = sum(point.get('Send', 0) for point in send_data_points)
        total_delivered = sum(point.get('DeliveryCount', 0) for point in send_data_points)
        total_bounced = sum(point.get('Bounce', 0) for point in send_data_points)
        total_complaints = sum(point.get('Complaint', 0) for point in send_data_points)
        
        delivery_rate = (total_delivered / total_sent * 100) if total_sent > 0 else 0
        bounce_rate = (total_bounced / total_sent * 100) if total_sent > 0 else 0
        complaint_rate = (total_complaints / total_sent * 100) if total_sent > 0 else 0
        
        return EmailStatsResponse(
            total_sent=total_sent,
            total_delivered=total_delivered,
            total_bounced=total_bounced,
            total_complaints=total_complaints,
            delivery_rate=round(delivery_rate, 2),
            bounce_rate=round(bounce_rate, 2),
            complaint_rate=round(complaint_rate, 2)
        )
        
    except Exception as e:
        logger.error(f"Failed to get email statistics: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve email statistics: {str(e)}"
        )

@router.post("/verify-address", response_model=SuccessResponse)
async def verify_email_address(
    email: EmailStr,
    current_user: User = Depends(require_permission(Permission.SEND_EMAILS))
):
    """
    Verify email address with SES
    
    Verifies an email address with AWS SES to enable
    sending emails from that address.
    """
    try:
        result = await email_service.verify_email_address(email)
        
        return SuccessResponse(
            success=result,
            data={"email": email, "verified": result},
            message=f"Email verification {'successful' if result else 'failed'}"
        )
        
    except Exception as e:
        logger.error(f"Failed to verify email address: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to verify email address: {str(e)}"
        )

@router.post("/webhook/ses", response_model=SuccessResponse)
async def handle_ses_webhook(
    notification: Dict[str, Any]
):
    """
    Handle SES bounce and complaint notifications
    
    This webhook endpoint receives notifications from AWS SES
    about bounced emails and complaints, and handles them
    appropriately by updating user preferences.
    """
    try:
        # Parse SNS notification
        message_type = notification.get('Type')
        
        if message_type == 'Notification':
            message = notification.get('Message', '{}')
            if isinstance(message, str):
                message = eval(message)  # Parse JSON string
            
            await email_service.handle_bounce_complaint(message)
        
        return SuccessResponse(
            success=True,
            message="SES notification processed successfully"
        )
        
    except Exception as e:
        logger.error(f"Failed to process SES webhook: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process SES notification: {str(e)}"
        )

@router.get("/health", response_model=SuccessResponse)
async def email_service_health():
    """
    Check email service health
    
    Returns the health status of the email service,
    including SES connectivity and template availability.
    """
    try:
        # Check if SES client is available
        ses_available = email_service.ses_client is not None
        
        # Check template count
        template_count = len(email_service.templates)
        
        # Test SMTP connectivity (basic check)
        smtp_available = (
            email_service.smtp_host is not None and
            email_service.smtp_username is not None and
            email_service.smtp_password is not None
        )
        
        health_status = {
            "ses_available": ses_available,
            "smtp_available": smtp_available,
            "template_count": template_count,
            "templates_loaded": template_count > 0,
            "service_status": "healthy" if (ses_available or smtp_available) and template_count > 0 else "degraded"
        }
        
        return SuccessResponse(
            success=True,
            data=health_status,
            message=f"Email service status: {health_status['service_status']}"
        )
        
    except Exception as e:
        logger.error(f"Email service health check failed: {e}")
        return SuccessResponse(
            success=False,
            data={"service_status": "unhealthy", "error": str(e)},
            message="Email service health check failed"
        )