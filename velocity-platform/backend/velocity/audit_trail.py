"""
Velocity AI Platform - Audit Trail and Logging System
Enterprise-grade audit logging for compliance and security
"""

import os
import json
import logging
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional, Union
from enum import Enum
from dataclasses import dataclass, asdict
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func, text
import uuid

from models import User, Organization, Agent, EvidenceItem, Framework
from database import SessionLocal
from validation import VelocityException

logger = logging.getLogger(__name__)

class AuditEventType(Enum):
    """Audit event types for comprehensive logging"""
    # User Actions
    USER_LOGIN = "user_login"
    USER_LOGOUT = "user_logout"
    USER_CREATED = "user_created"
    USER_UPDATED = "user_updated"
    USER_DELETED = "user_deleted"
    PASSWORD_CHANGED = "password_changed"
    
    # Organization Actions
    ORG_CREATED = "org_created"
    ORG_UPDATED = "org_updated"
    ORG_SETTINGS_CHANGED = "org_settings_changed"
    
    # Agent Actions
    AGENT_STARTED = "agent_started"
    AGENT_COMPLETED = "agent_completed"
    AGENT_FAILED = "agent_failed"
    AGENT_CONFIGURED = "agent_configured"
    
    # Evidence Actions
    EVIDENCE_UPLOADED = "evidence_uploaded"
    EVIDENCE_APPROVED = "evidence_approved"
    EVIDENCE_REJECTED = "evidence_rejected"
    EVIDENCE_RENEWED = "evidence_renewed"
    EVIDENCE_DELETED = "evidence_deleted"
    EVIDENCE_DOWNLOADED = "evidence_downloaded"
    
    # Trust Score Actions
    TRUST_SCORE_CALCULATED = "trust_score_calculated"
    TRUST_SCORE_UPDATED = "trust_score_updated"
    
    # Compliance Actions
    COMPLIANCE_REPORT_GENERATED = "compliance_report_generated"
    COMPLIANCE_REPORT_EXPORTED = "compliance_report_exported"
    FRAMEWORK_ASSESSMENT_STARTED = "framework_assessment_started"
    FRAMEWORK_ASSESSMENT_COMPLETED = "framework_assessment_completed"
    
    # Security Actions
    UNAUTHORIZED_ACCESS_ATTEMPT = "unauthorized_access_attempt"
    PERMISSION_DENIED = "permission_denied"
    API_KEY_CREATED = "api_key_created"
    API_KEY_REVOKED = "api_key_revoked"
    
    # System Actions
    SYSTEM_BACKUP_CREATED = "system_backup_created"
    SYSTEM_MAINTENANCE = "system_maintenance"
    SYSTEM_ERROR = "system_error"
    
    # Data Actions
    DATA_EXPORT = "data_export"
    DATA_IMPORT = "data_import"
    DATA_PURGED = "data_purged"

class AuditSeverity(Enum):
    """Audit event severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class AuditEvent:
    """Audit event data structure"""
    event_id: str
    event_type: AuditEventType
    severity: AuditSeverity
    timestamp: datetime
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

class AuditTrailManager:
    """
    Enterprise audit trail and logging system
    
    Features:
    - Comprehensive event logging
    - Compliance audit trails
    - Security event monitoring
    - Data retention management
    - Export capabilities for auditors
    - Real-time alerting for critical events
    """
    
    def __init__(self):
        self.log_dir = "logs/audit"
        os.makedirs(self.log_dir, exist_ok=True)
        
        # Configure audit logger
        self.audit_logger = logging.getLogger("velocity.audit")
        self.audit_logger.setLevel(logging.INFO)
        
        # Create file handler for audit logs
        audit_handler = logging.FileHandler(f"{self.log_dir}/audit.log")
        audit_handler.setFormatter(
            logging.Formatter('%(asctime)s | %(levelname)s | %(message)s')
        )
        self.audit_logger.addHandler(audit_handler)
        
        # Security events require separate logging
        self.security_logger = logging.getLogger("velocity.security")
        security_handler = logging.FileHandler(f"{self.log_dir}/security.log")
        security_handler.setFormatter(
            logging.Formatter('%(asctime)s | SECURITY | %(message)s')
        )
        self.security_logger.addHandler(security_handler)
    
    async def log_event(
        self,
        event_type: AuditEventType,
        severity: AuditSeverity,
        action: str,
        details: Dict[str, Any],
        user_id: Optional[str] = None,
        organization_id: Optional[str] = None,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        session_id: Optional[str] = None,
        correlation_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Log audit event"""
        try:
            event_id = str(uuid.uuid4())
            timestamp = datetime.now(timezone.utc)
            
            audit_event = AuditEvent(
                event_id=event_id,
                event_type=event_type,
                severity=severity,
                timestamp=timestamp,
                user_id=user_id,
                organization_id=organization_id,
                resource_type=resource_type,
                resource_id=resource_id,
                action=action,
                details=details,
                ip_address=ip_address,
                user_agent=user_agent,
                session_id=session_id,
                correlation_id=correlation_id,
                metadata=metadata or {}
            )
            
            # Convert to JSON for logging
            event_json = json.dumps(asdict(audit_event), default=str, indent=None)
            
            # Log to appropriate logger
            if event_type in [
                AuditEventType.UNAUTHORIZED_ACCESS_ATTEMPT,
                AuditEventType.PERMISSION_DENIED,
                AuditEventType.API_KEY_CREATED,
                AuditEventType.API_KEY_REVOKED
            ]:
                self.security_logger.warning(event_json)
            elif severity == AuditSeverity.CRITICAL:
                self.audit_logger.critical(event_json)
            elif severity == AuditSeverity.HIGH:
                self.audit_logger.error(event_json)
            else:
                self.audit_logger.info(event_json)
            
            # Store in database for querying
            await self._store_in_database(audit_event)
            
            # Send alerts for critical events
            if severity == AuditSeverity.CRITICAL:
                await self._send_critical_alert(audit_event)
            
            return event_id
            
        except Exception as e:
            logger.error(f"Failed to log audit event: {e}")
            # Fallback logging
            fallback_logger = logging.getLogger("velocity.audit.fallback")
            fallback_logger.error(f"AUDIT_LOG_FAILURE: {event_type.value} - {action} - {str(e)}")
            raise VelocityException(f"Audit logging failed: {str(e)}")
    
    async def log_user_action(
        self,
        user_id: str,
        organization_id: str,
        action: str,
        details: Dict[str, Any],
        event_type: AuditEventType = AuditEventType.USER_LOGIN,
        severity: AuditSeverity = AuditSeverity.LOW,
        **kwargs
    ) -> str:
        """Log user action with context"""
        return await self.log_event(
            event_type=event_type,
            severity=severity,
            action=action,
            details=details,
            user_id=user_id,
            organization_id=organization_id,
            resource_type="user",
            resource_id=user_id,
            **kwargs
        )
    
    async def log_agent_action(
        self,
        agent_id: str,
        user_id: str,
        organization_id: str,
        action: str,
        details: Dict[str, Any],
        event_type: AuditEventType,
        severity: AuditSeverity = AuditSeverity.MEDIUM,
        **kwargs
    ) -> str:
        """Log agent action"""
        return await self.log_event(
            event_type=event_type,
            severity=severity,
            action=action,
            details=details,
            user_id=user_id,
            organization_id=organization_id,
            resource_type="agent",
            resource_id=agent_id,
            **kwargs
        )
    
    async def log_evidence_action(
        self,
        evidence_id: str,
        user_id: str,
        organization_id: str,
        action: str,
        details: Dict[str, Any],
        event_type: AuditEventType,
        severity: AuditSeverity = AuditSeverity.MEDIUM,
        **kwargs
    ) -> str:
        """Log evidence action"""
        return await self.log_event(
            event_type=event_type,
            severity=severity,
            action=action,
            details=details,
            user_id=user_id,
            organization_id=organization_id,
            resource_type="evidence",
            resource_id=evidence_id,
            **kwargs
        )
    
    async def log_security_event(
        self,
        action: str,
        details: Dict[str, Any],
        event_type: AuditEventType,
        severity: AuditSeverity = AuditSeverity.HIGH,
        **kwargs
    ) -> str:
        """Log security event"""
        return await self.log_event(
            event_type=event_type,
            severity=severity,
            action=action,
            details=details,
            **kwargs
        )
    
    async def get_audit_trail(
        self,
        organization_id: Optional[str] = None,
        user_id: Optional[str] = None,
        event_type: Optional[AuditEventType] = None,
        severity: Optional[AuditSeverity] = None,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Retrieve audit trail with filters"""
        try:
            # This would query the database audit table
            # For now, we'll simulate the response structure
            audit_records = []
            
            # In production, this would be a proper database query
            # query = db.query(AuditLog)
            # if organization_id:
            #     query = query.filter(AuditLog.organization_id == organization_id)
            # ... etc
            
            return {
                "records": audit_records,
                "total_count": len(audit_records),
                "filtered_count": len(audit_records),
                "limit": limit,
                "offset": offset,
                "filters_applied": {
                    "organization_id": organization_id,
                    "user_id": user_id,
                    "event_type": event_type.value if event_type else None,
                    "severity": severity.value if severity else None,
                    "resource_type": resource_type,
                    "resource_id": resource_id,
                    "time_range": {
                        "start": start_time.isoformat() if start_time else None,
                        "end": end_time.isoformat() if end_time else None
                    }
                }
            }
            
        except Exception as e:
            logger.error(f"Failed to retrieve audit trail: {e}")
            raise VelocityException(f"Audit trail retrieval failed: {str(e)}")
    
    async def export_audit_logs(
        self,
        organization_id: str,
        export_format: str = "json",
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        event_types: Optional[List[AuditEventType]] = None
    ) -> Dict[str, Any]:
        """Export audit logs for compliance reporting"""
        try:
            export_id = str(uuid.uuid4())
            
            # Get audit records
            audit_data = await self.get_audit_trail(
                organization_id=organization_id,
                start_time=start_date,
                end_time=end_date,
                limit=10000  # Large limit for export
            )
            
            # Generate export file
            export_filename = f"audit_export_{organization_id}_{export_id}.{export_format}"
            export_path = os.path.join(self.log_dir, "exports", export_filename)
            os.makedirs(os.path.dirname(export_path), exist_ok=True)
            
            if export_format.lower() == "json":
                with open(export_path, 'w') as f:
                    json.dump(audit_data, f, indent=2, default=str)
            elif export_format.lower() == "csv":
                import csv
                with open(export_path, 'w', newline='') as f:
                    if audit_data["records"]:
                        fieldnames = audit_data["records"][0].keys()
                        writer = csv.DictWriter(f, fieldnames=fieldnames)
                        writer.writeheader()
                        writer.writerows(audit_data["records"])
            
            # Log the export action
            await self.log_event(
                event_type=AuditEventType.DATA_EXPORT,
                severity=AuditSeverity.MEDIUM,
                action="audit_logs_exported",
                details={
                    "export_id": export_id,
                    "format": export_format,
                    "record_count": audit_data["total_count"],
                    "date_range": {
                        "start": start_date.isoformat() if start_date else None,
                        "end": end_date.isoformat() if end_date else None
                    }
                },
                organization_id=organization_id,
                resource_type="audit_export",
                resource_id=export_id
            )
            
            return {
                "export_id": export_id,
                "filename": export_filename,
                "file_path": export_path,
                "format": export_format,
                "record_count": audit_data["total_count"],
                "file_size": os.path.getsize(export_path) if os.path.exists(export_path) else 0,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "expires_at": (datetime.now(timezone.utc) + 
                             datetime.timedelta(days=7)).isoformat()  # Export expires in 7 days
            }
            
        except Exception as e:
            logger.error(f"Failed to export audit logs: {e}")
            raise VelocityException(f"Audit log export failed: {str(e)}")
    
    async def get_compliance_report(
        self,
        organization_id: str,
        framework: Framework,
        start_date: datetime,
        end_date: datetime
    ) -> Dict[str, Any]:
        """Generate compliance audit report"""
        try:
            # Get relevant audit events for compliance
            compliance_events = await self.get_audit_trail(
                organization_id=organization_id,
                start_time=start_date,
                end_time=end_date,
                limit=5000
            )
            
            # Categorize events for compliance reporting
            report_data = {
                "organization_id": organization_id,
                "framework": framework.value,
                "report_period": {
                    "start": start_date.isoformat(),
                    "end": end_date.isoformat()
                },
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "summary": {
                    "total_events": compliance_events["total_count"],
                    "security_events": 0,
                    "compliance_events": 0,
                    "evidence_events": 0,
                    "agent_executions": 0
                },
                "event_breakdown": {},
                "security_incidents": [],
                "compliance_activities": [],
                "evidence_management": [],
                "recommendations": []
            }
            
            # Process events for compliance insights
            for record in compliance_events["records"]:
                event_type = record.get("event_type")
                
                if event_type in ["unauthorized_access_attempt", "permission_denied"]:
                    report_data["summary"]["security_events"] += 1
                    report_data["security_incidents"].append(record)
                elif event_type in ["evidence_uploaded", "evidence_approved", "evidence_rejected"]:
                    report_data["summary"]["evidence_events"] += 1
                    report_data["evidence_management"].append(record)
                elif event_type in ["agent_started", "agent_completed"]:
                    report_data["summary"]["agent_executions"] += 1
                
                # Count by event type
                report_data["event_breakdown"][event_type] = \
                    report_data["event_breakdown"].get(event_type, 0) + 1
            
            # Add compliance recommendations
            if report_data["summary"]["security_events"] > 10:
                report_data["recommendations"].append({
                    "type": "security",
                    "priority": "high",
                    "description": "Multiple security events detected. Review access controls and user permissions."
                })
            
            if report_data["summary"]["evidence_events"] < 5:
                report_data["recommendations"].append({
                    "type": "compliance",
                    "priority": "medium",
                    "description": "Low evidence collection activity. Ensure agents are running regularly."
                })
            
            return report_data
            
        except Exception as e:
            logger.error(f"Failed to generate compliance report: {e}")
            raise VelocityException(f"Compliance report generation failed: {str(e)}")
    
    # Helper methods
    async def _store_in_database(self, audit_event: AuditEvent):
        """Store audit event in database"""
        try:
            # In production, this would store in an AuditLog table
            # For now, we'll just log that it would be stored
            logger.debug(f"Would store audit event {audit_event.event_id} in database")
        except Exception as e:
            logger.warning(f"Failed to store audit event in database: {e}")
    
    async def _send_critical_alert(self, audit_event: AuditEvent):
        """Send alert for critical audit events"""
        try:
            # In production, this would send alerts via email, Slack, PagerDuty, etc.
            logger.critical(f"CRITICAL AUDIT EVENT: {audit_event.event_type.value} - {audit_event.action}")
            
            # For now, just log the alert
            alert_message = f"""
            CRITICAL SECURITY ALERT
            Event: {audit_event.event_type.value}
            Action: {audit_event.action}
            User: {audit_event.user_id}
            Organization: {audit_event.organization_id}
            Time: {audit_event.timestamp}
            Details: {json.dumps(audit_event.details, indent=2)}
            """
            
            self.security_logger.critical(alert_message)
            
        except Exception as e:
            logger.error(f"Failed to send critical alert: {e}")

# Global audit trail manager instance
audit_trail_manager = AuditTrailManager()

# Convenience functions for common audit operations
async def log_user_login(user_id: str, organization_id: str, ip_address: str, user_agent: str, session_id: str):
    """Log user login event"""
    return await audit_trail_manager.log_user_action(
        user_id=user_id,
        organization_id=organization_id,
        action="user_login_successful",
        details={"login_method": "email_password"},
        event_type=AuditEventType.USER_LOGIN,
        severity=AuditSeverity.LOW,
        ip_address=ip_address,
        user_agent=user_agent,
        session_id=session_id
    )

async def log_agent_execution(agent_id: str, user_id: str, organization_id: str, execution_details: Dict[str, Any]):
    """Log agent execution"""
    return await audit_trail_manager.log_agent_action(
        agent_id=agent_id,
        user_id=user_id,
        organization_id=organization_id,
        action="agent_execution_started",
        details=execution_details,
        event_type=AuditEventType.AGENT_STARTED,
        severity=AuditSeverity.MEDIUM
    )

async def log_evidence_upload(evidence_id: str, user_id: str, organization_id: str, evidence_details: Dict[str, Any]):
    """Log evidence upload"""
    return await audit_trail_manager.log_evidence_action(
        evidence_id=evidence_id,
        user_id=user_id,
        organization_id=organization_id,
        action="evidence_uploaded",
        details=evidence_details,
        event_type=AuditEventType.EVIDENCE_UPLOADED,
        severity=AuditSeverity.MEDIUM
    )

async def log_security_violation(action: str, details: Dict[str, Any], **kwargs):
    """Log security violation"""
    return await audit_trail_manager.log_security_event(
        action=action,
        details=details,
        event_type=AuditEventType.UNAUTHORIZED_ACCESS_ATTEMPT,
        severity=AuditSeverity.HIGH,
        **kwargs
    )