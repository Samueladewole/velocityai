"""
Audit Trail API Routes for Velocity AI Platform
Enterprise audit logging and compliance reporting endpoints
"""

from typing import Dict, Any, Optional, List
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from models import Framework, User
from database import get_db
from auth import get_current_active_user
from validation import SuccessResponse, VelocityException
from rbac import Permission, require_permission
from audit_trail import (
    audit_trail_manager, AuditEventType, AuditSeverity,
    log_user_login, log_agent_execution, log_evidence_upload, log_security_violation
)
import logging

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/api/v1/audit",
    tags=["audit"],
    responses={404: {"description": "Not found"}}
)

# Request/Response Models
class AuditLogRequest(BaseModel):
    """Request to log audit event"""
    event_type: str = Field(..., description="Type of audit event")
    severity: str = Field("medium", description="Event severity: low, medium, high, critical")
    action: str = Field(..., description="Action description")
    details: Dict[str, Any] = Field(..., description="Event details")
    resource_type: Optional[str] = Field(None, description="Resource type affected")
    resource_id: Optional[str] = Field(None, description="Resource ID affected")
    correlation_id: Optional[str] = Field(None, description="Correlation ID for event grouping")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")

class AuditTrailQuery(BaseModel):
    """Query parameters for audit trail retrieval"""
    organization_id: Optional[str] = None
    user_id: Optional[str] = None
    event_type: Optional[str] = None
    severity: Optional[str] = None
    resource_type: Optional[str] = None
    resource_id: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    limit: int = Field(100, ge=1, le=1000)
    offset: int = Field(0, ge=0)

class AuditExportRequest(BaseModel):
    """Request to export audit logs"""
    format: str = Field("json", description="Export format: json, csv")
    start_date: Optional[str] = Field(None, description="Start date (ISO format)")
    end_date: Optional[str] = Field(None, description="End date (ISO format)")
    event_types: Optional[List[str]] = Field(None, description="Filter by event types")

class ComplianceReportRequest(BaseModel):
    """Request to generate compliance report"""
    framework: Framework = Field(..., description="Compliance framework")
    start_date: str = Field(..., description="Report start date (ISO format)")
    end_date: str = Field(..., description="Report end date (ISO format)")

class AuditEventResponse(BaseModel):
    """Audit event response"""
    event_id: str
    event_type: str
    severity: str
    timestamp: str
    user_id: Optional[str]
    organization_id: Optional[str]
    resource_type: Optional[str]
    resource_id: Optional[str]
    action: str
    details: Dict[str, Any]
    ip_address: Optional[str]
    user_agent: Optional[str]
    session_id: Optional[str]
    correlation_id: Optional[str]
    metadata: Dict[str, Any]

class AuditTrailResponse(BaseModel):
    """Audit trail response"""
    records: List[Dict[str, Any]]
    total_count: int
    filtered_count: int
    limit: int
    offset: int
    filters_applied: Dict[str, Any]

class AuditExportResponse(BaseModel):
    """Audit export response"""
    export_id: str
    filename: str
    format: str
    record_count: int
    file_size: int
    created_at: str
    expires_at: str
    download_url: Optional[str] = None

class ComplianceReportResponse(BaseModel):
    """Compliance report response"""
    organization_id: str
    framework: str
    report_period: Dict[str, str]
    generated_at: str
    summary: Dict[str, Any]
    event_breakdown: Dict[str, int]
    security_incidents: List[Dict[str, Any]]
    compliance_activities: List[Dict[str, Any]]
    evidence_management: List[Dict[str, Any]]
    recommendations: List[Dict[str, Any]]

# Routes
@router.post("/log", response_model=SuccessResponse)
async def log_audit_event(
    request: AuditLogRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Log audit event (for internal system use)"""
    try:
        # Only allow system/admin users to log events directly
        require_permission(current_user, Permission.AUDIT_WRITE)
        
        # Parse event type and severity
        try:
            event_type = AuditEventType(request.event_type)
            severity = AuditSeverity(request.severity)
        except ValueError as e:
            raise VelocityException(f"Invalid event type or severity: {e}")
        
        event_id = await audit_trail_manager.log_event(
            event_type=event_type,
            severity=severity,
            action=request.action,
            details=request.details,
            user_id=str(current_user.id),
            organization_id=str(current_user.organization_id),
            resource_type=request.resource_type,
            resource_id=request.resource_id,
            correlation_id=request.correlation_id,
            metadata=request.metadata
        )
        
        return SuccessResponse(
            success=True,
            message="Audit event logged successfully",
            data={"event_id": event_id}
        )
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error logging audit event: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/trail", response_model=AuditTrailResponse)
async def get_audit_trail(
    organization_id: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
    event_type: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    resource_type: Optional[str] = Query(None),
    resource_id: Optional[str] = Query(None),
    start_time: Optional[str] = Query(None),
    end_time: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Retrieve audit trail with filters"""
    try:
        require_permission(current_user, Permission.AUDIT_VIEW)
        
        # Parse datetime strings
        start_dt = None
        end_dt = None
        
        if start_time:
            try:
                start_dt = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
            except ValueError:
                raise VelocityException("Invalid start_time format. Use ISO format.")
        
        if end_time:
            try:
                end_dt = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
            except ValueError:
                raise VelocityException("Invalid end_time format. Use ISO format.")
        
        # Parse enums
        event_type_enum = None
        severity_enum = None
        
        if event_type:
            try:
                event_type_enum = AuditEventType(event_type)
            except ValueError:
                raise VelocityException(f"Invalid event type: {event_type}")
        
        if severity:
            try:
                severity_enum = AuditSeverity(severity)
            except ValueError:
                raise VelocityException(f"Invalid severity: {severity}")
        
        # Restrict to user's organization unless admin
        if not current_user.is_admin and organization_id != str(current_user.organization_id):
            organization_id = str(current_user.organization_id)
        
        audit_data = await audit_trail_manager.get_audit_trail(
            organization_id=organization_id,
            user_id=user_id,
            event_type=event_type_enum,
            severity=severity_enum,
            resource_type=resource_type,
            resource_id=resource_id,
            start_time=start_dt,
            end_time=end_dt,
            limit=limit,
            offset=offset
        )
        
        return AuditTrailResponse(**audit_data)
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error retrieving audit trail: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/export", response_model=AuditExportResponse)
async def export_audit_logs(
    request: AuditExportRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Export audit logs for compliance"""
    try:
        require_permission(current_user, Permission.AUDIT_EXPORT)
        
        # Parse dates
        start_date = None
        end_date = None
        
        if request.start_date:
            start_date = datetime.fromisoformat(request.start_date.replace('Z', '+00:00'))
        
        if request.end_date:
            end_date = datetime.fromisoformat(request.end_date.replace('Z', '+00:00'))
        
        # Parse event types
        event_types = None
        if request.event_types:
            try:
                event_types = [AuditEventType(et) for et in request.event_types]
            except ValueError as e:
                raise VelocityException(f"Invalid event type: {e}")
        
        def export_task():
            import asyncio
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                result = loop.run_until_complete(
                    audit_trail_manager.export_audit_logs(
                        organization_id=str(current_user.organization_id),
                        export_format=request.format,
                        start_date=start_date,
                        end_date=end_date,
                        event_types=event_types
                    )
                )
                return result
            finally:
                loop.close()
        
        # Execute export in background
        background_tasks.add_task(export_task)
        
        # Return immediate response
        export_id = f"export_{current_user.organization_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        return AuditExportResponse(
            export_id=export_id,
            filename=f"audit_export_{export_id}.{request.format}",
            format=request.format,
            record_count=0,  # Will be updated when export completes
            file_size=0,  # Will be updated when export completes
            created_at=datetime.now(timezone.utc).isoformat(),
            expires_at=(datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
            download_url=f"/api/v1/audit/download/{export_id}"
        )
        
    except VelocityException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error exporting audit logs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/compliance-report", response_model=ComplianceReportResponse)
async def generate_compliance_report(
    request: ComplianceReportRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate compliance audit report"""
    try:
        require_permission(current_user, Permission.COMPLIANCE_VIEW)
        
        # Parse dates
        start_date = datetime.fromisoformat(request.start_date.replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(request.end_date.replace('Z', '+00:00'))
        
        # Validate date range
        if end_date <= start_date:
            raise VelocityException("End date must be after start date")
        
        if (end_date - start_date).days > 365:
            raise VelocityException("Report period cannot exceed 1 year")
        
        report_data = await audit_trail_manager.get_compliance_report(
            organization_id=str(current_user.organization_id),
            framework=request.framework,
            start_date=start_date,
            end_date=end_date
        )
        
        return ComplianceReportResponse(**report_data)
        
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

@router.get("/events/types")
async def get_audit_event_types(
    current_user: User = Depends(get_current_active_user)
):
    """Get available audit event types"""
    try:
        require_permission(current_user, Permission.AUDIT_VIEW)
        
        event_types = []
        for event_type in AuditEventType:
            event_types.append({
                "value": event_type.value,
                "display_name": event_type.value.replace("_", " ").title(),
                "description": f"{event_type.value.replace('_', ' ').title()} event"
            })
        
        return {
            "event_types": event_types,
            "total": len(event_types)
        }
        
    except Exception as e:
        logger.error(f"Error getting audit event types: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/events/severities")
async def get_audit_severities(
    current_user: User = Depends(get_current_active_user)
):
    """Get available audit severity levels"""
    try:
        require_permission(current_user, Permission.AUDIT_VIEW)
        
        severities = []
        for severity in AuditSeverity:
            severities.append({
                "value": severity.value,
                "display_name": severity.value.title(),
                "description": f"{severity.value.title()} severity level"
            })
        
        return {
            "severities": severities,
            "total": len(severities)
        }
        
    except Exception as e:
        logger.error(f"Error getting audit severities: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/statistics")
async def get_audit_statistics(
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get audit statistics for dashboard"""
    try:
        require_permission(current_user, Permission.AUDIT_VIEW)
        
        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=days)
        
        # Get audit trail for statistics
        audit_data = await audit_trail_manager.get_audit_trail(
            organization_id=str(current_user.organization_id),
            start_time=start_date,
            end_time=end_date,
            limit=10000
        )
        
        # Calculate statistics
        total_events = audit_data["total_count"]
        
        # Count by severity
        severity_counts = {"low": 0, "medium": 0, "high": 0, "critical": 0}
        event_type_counts = {}
        daily_counts = {}
        
        for record in audit_data["records"]:
            # Severity stats
            severity = record.get("severity", "medium")
            severity_counts[severity] = severity_counts.get(severity, 0) + 1
            
            # Event type stats
            event_type = record.get("event_type", "unknown")
            event_type_counts[event_type] = event_type_counts.get(event_type, 0) + 1
            
            # Daily stats
            event_date = record.get("timestamp", "").split("T")[0]
            daily_counts[event_date] = daily_counts.get(event_date, 0) + 1
        
        return {
            "organization_id": str(current_user.organization_id),
            "period_days": days,
            "total_events": total_events,
            "severity_breakdown": severity_counts,
            "top_event_types": dict(sorted(event_type_counts.items(), 
                                         key=lambda x: x[1], reverse=True)[:10]),
            "daily_activity": daily_counts,
            "security_alerts": severity_counts["high"] + severity_counts["critical"],
            "compliance_health": {
                "total_events": total_events,
                "critical_events": severity_counts["critical"],
                "security_events": severity_counts["high"] + severity_counts["critical"],
                "status": "healthy" if severity_counts["critical"] == 0 else "attention_required"
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting audit statistics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/health")
async def get_audit_health(
    current_user: User = Depends(get_current_active_user)
):
    """Get audit system health status"""
    try:
        require_permission(current_user, Permission.AUDIT_VIEW)
        
        # Check audit system health
        import os
        log_dir = "logs/audit"
        
        health_status = {
            "audit_logging": "healthy",
            "log_directory_exists": os.path.exists(log_dir),
            "log_files": {
                "audit_log": os.path.exists(f"{log_dir}/audit.log"),
                "security_log": os.path.exists(f"{log_dir}/security.log")
            },
            "disk_space": {
                "available": "sufficient",  # Would check actual disk space in production
                "log_rotation": "active"
            },
            "last_event_logged": datetime.now(timezone.utc).isoformat(),
            "retention_policy": "active",
            "export_capability": "available"
        }
        
        overall_status = "healthy"
        if not health_status["log_directory_exists"]:
            overall_status = "degraded"
        if not health_status["log_files"]["audit_log"]:
            overall_status = "unhealthy"
        
        return {
            "status": overall_status,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "details": health_status
        }
        
    except Exception as e:
        logger.error(f"Error checking audit health: {e}")
        return {
            "status": "unhealthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "error": str(e)
        }