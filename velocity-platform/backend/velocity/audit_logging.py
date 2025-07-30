"""
Velocity.ai Transparent Audit Logging and Security Practices
Comprehensive audit trail system with transparency and customer access
"""

from typing import Dict, List, Optional, Any, Union
from enum import Enum
from dataclasses import dataclass, field, asdict
from datetime import datetime, timedelta
import json
import hashlib
import hmac
import asyncio
from contextlib import asynccontextmanager

class LogLevel(Enum):
    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"
    SECURITY = "security"

class EventCategory(Enum):
    AUTHENTICATION = "authentication"
    AUTHORIZATION = "authorization"
    DATA_ACCESS = "data_access"
    SYSTEM_CHANGE = "system_change"
    AGENT_ACTIVITY = "agent_activity"
    COMPLIANCE_EVENT = "compliance_event"
    SECURITY_EVENT = "security_event"
    USER_ACTION = "user_action"
    API_REQUEST = "api_request"
    INTEGRATION_EVENT = "integration_event"

class AuditOutcome(Enum):
    SUCCESS = "success"
    FAILURE = "failure"
    PARTIAL = "partial"
    BLOCKED = "blocked"
    ERROR = "error"

@dataclass
class AuditEvent:
    event_id: str
    timestamp: datetime
    level: LogLevel
    category: EventCategory
    event_type: str
    outcome: AuditOutcome
    actor_id: str
    actor_type: str  # "user", "agent", "system", "api_client"
    organization_id: str
    resource_type: str
    resource_id: str
    action: str
    details: Dict[str, Any]
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    session_id: Optional[str] = None
    correlation_id: Optional[str] = None
    risk_score: int = 0  # 0-100
    compliance_frameworks: List[str] = field(default_factory=list)
    retention_period_days: int = 2555  # 7 years default
    customer_visible: bool = True
    data_classification: str = "internal"
    integrity_hash: Optional[str] = None

@dataclass
class AuditQuery:
    organization_id: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    categories: List[EventCategory] = field(default_factory=list)
    actor_id: Optional[str] = None
    resource_type: Optional[str] = None
    outcome: Optional[AuditOutcome] = None
    min_risk_score: int = 0
    max_results: int = 1000
    include_details: bool = True

class TransparentAuditLogger:
    """Main audit logging system with transparency and customer access"""
    
    def __init__(self, encryption_key: str, integrity_key: str):
        self.encryption_key = encryption_key
        self.integrity_key = integrity_key
        self.log_store = AuditLogStore()
        self.real_time_monitor = RealTimeSecurityMonitor()
        self.customer_portal = CustomerAuditPortal()
        self.compliance_reporter = ComplianceReporter()
        
    async def log_event(
        self,
        event_type: str,
        category: EventCategory,
        actor_id: str,
        actor_type: str,
        organization_id: str,
        resource_type: str,
        resource_id: str,
        action: str,
        outcome: AuditOutcome,
        details: Dict[str, Any],
        level: LogLevel = LogLevel.INFO,
        **kwargs
    ) -> str:
        """Log an audit event with comprehensive details"""
        
        event_id = self._generate_event_id()
        
        event = AuditEvent(
            event_id=event_id,
            timestamp=datetime.utcnow(),
            level=level,
            category=category,
            event_type=event_type,
            outcome=outcome,
            actor_id=actor_id,
            actor_type=actor_type,
            organization_id=organization_id,
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            details=self._sanitize_details(details),
            ip_address=kwargs.get('ip_address'),
            user_agent=kwargs.get('user_agent'),
            session_id=kwargs.get('session_id'),
            correlation_id=kwargs.get('correlation_id'),
            risk_score=kwargs.get('risk_score', 0),
            compliance_frameworks=kwargs.get('compliance_frameworks', []),
            customer_visible=kwargs.get('customer_visible', True)
        )
        
        # Calculate integrity hash
        event.integrity_hash = self._calculate_integrity_hash(event)
        
        # Store event
        await self.log_store.store_event(event)
        
        # Real-time processing
        await self._process_real_time_event(event)
        
        # Customer notification if high-risk
        if event.risk_score >= 70 and event.customer_visible:
            await self.customer_portal.notify_high_risk_event(event)
        
        return event_id
    
    def _generate_event_id(self) -> str:
        """Generate unique event ID"""
        timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S%f')
        return f"audit_{timestamp}_{hashlib.md5(timestamp.encode()).hexdigest()[:8]}"
    
    def _sanitize_details(self, details: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitize sensitive information from event details"""
        sensitive_keys = [
            'password', 'token', 'secret', 'key', 'credential',
            'authorization', 'cookie', 'session_token'
        ]
        
        sanitized = {}
        for key, value in details.items():
            if any(sensitive in key.lower() for sensitive in sensitive_keys):
                sanitized[key] = "[REDACTED]"
            elif isinstance(value, str) and len(value) > 500:
                sanitized[key] = value[:500] + "... [TRUNCATED]"
            else:
                sanitized[key] = value
        
        return sanitized
    
    def _calculate_integrity_hash(self, event: AuditEvent) -> str:
        """Calculate HMAC integrity hash for event"""
        # Create deterministic string representation
        event_data = {
            'event_id': event.event_id,
            'timestamp': event.timestamp.isoformat(),
            'category': event.category.value,
            'event_type': event.event_type,
            'actor_id': event.actor_id,
            'organization_id': event.organization_id,
            'resource_type': event.resource_type,
            'resource_id': event.resource_id,
            'action': event.action,
            'outcome': event.outcome.value,
            'details': json.dumps(event.details, sort_keys=True)
        }
        
        event_string = json.dumps(event_data, sort_keys=True)
        return hmac.new(
            self.integrity_key.encode(),
            event_string.encode(),
            hashlib.sha256
        ).hexdigest()
    
    async def _process_real_time_event(self, event: AuditEvent) -> None:
        """Process event for real-time monitoring and alerting"""
        
        # Security event processing
        if event.category == EventCategory.SECURITY_EVENT:
            await self.real_time_monitor.process_security_event(event)
        
        # High-risk event processing
        if event.risk_score >= 80:
            await self.real_time_monitor.process_high_risk_event(event)
        
        # Compliance event processing
        if event.compliance_frameworks:
            await self.compliance_reporter.process_compliance_event(event)
        
        # Failed authentication monitoring
        if (event.category == EventCategory.AUTHENTICATION and 
            event.outcome == AuditOutcome.FAILURE):
            await self.real_time_monitor.track_failed_authentication(event)
    
    async def query_events(self, query: AuditQuery) -> List[AuditEvent]:
        """Query audit events with filtering"""
        return await self.log_store.query_events(query)
    
    async def verify_event_integrity(self, event_id: str) -> bool:
        """Verify integrity of a specific event"""
        event = await self.log_store.get_event(event_id)
        if not event:
            return False
        
        calculated_hash = self._calculate_integrity_hash(event)
        return hmac.compare_digest(calculated_hash, event.integrity_hash or "")
    
    async def generate_audit_report(
        self, 
        organization_id: str,
        start_date: datetime,
        end_date: datetime,
        format_type: str = "json"
    ) -> Dict[str, Any]:
        """Generate comprehensive audit report"""
        
        query = AuditQuery(
            organization_id=organization_id,
            start_time=start_date,
            end_time=end_date
        )
        
        events = await self.query_events(query)
        
        # Calculate statistics
        stats = self._calculate_audit_statistics(events)
        
        # Group events by category
        events_by_category = {}
        for event in events:
            category = event.category.value
            if category not in events_by_category:
                events_by_category[category] = []
            events_by_category[category].append(event)
        
        report = {
            "report_metadata": {
                "organization_id": organization_id,
                "report_period": {
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat()
                },
                "generated_at": datetime.utcnow().isoformat(),
                "total_events": len(events),
                "format": format_type
            },
            "executive_summary": {
                "total_events": len(events),
                "security_events": len([e for e in events if e.category == EventCategory.SECURITY_EVENT]),
                "failed_events": len([e for e in events if e.outcome == AuditOutcome.FAILURE]),
                "high_risk_events": len([e for e in events if e.risk_score >= 70]),
                "compliance_events": len([e for e in events if e.compliance_frameworks])
            },
            "statistics": stats,
            "events_by_category": {
                category: len(events_list) 
                for category, events_list in events_by_category.items()
            },
            "risk_analysis": self._analyze_risk_trends(events),
            "compliance_summary": self._summarize_compliance_events(events),
            "recommendations": self._generate_security_recommendations(events)
        }
        
        if format_type == "detailed":
            report["detailed_events"] = [
                self._serialize_event_for_report(event) for event in events
            ]
        
        return report
    
    def _calculate_audit_statistics(self, events: List[AuditEvent]) -> Dict[str, Any]:
        """Calculate comprehensive statistics from audit events"""
        
        if not events:
            return {"message": "No events found for the specified period"}
        
        total_events = len(events)
        
        # Outcome statistics
        outcome_counts = {}
        for event in events:
            outcome = event.outcome.value
            outcome_counts[outcome] = outcome_counts.get(outcome, 0) + 1
        
        # Category statistics
        category_counts = {}
        for event in events:
            category = event.category.value
            category_counts[category] = category_counts.get(category, 0) + 1
        
        # Risk score distribution
        risk_distribution = {
            "low (0-30)": len([e for e in events if 0 <= e.risk_score <= 30]),
            "medium (31-60)": len([e for e in events if 31 <= e.risk_score <= 60]),
            "high (61-80)": len([e for e in events if 61 <= e.risk_score <= 80]),
            "critical (81-100)": len([e for e in events if 81 <= e.risk_score <= 100])
        }
        
        # Time-based patterns
        events_by_hour = {}
        for event in events:
            hour = event.timestamp.hour
            events_by_hour[hour] = events_by_hour.get(hour, 0) + 1
        
        return {
            "total_events": total_events,
            "outcome_distribution": outcome_counts,
            "category_distribution": category_counts,
            "risk_score_distribution": risk_distribution,
            "events_by_hour": events_by_hour,
            "unique_actors": len(set(event.actor_id for event in events)),
            "unique_resources": len(set(f"{event.resource_type}:{event.resource_id}" for event in events)),
            "average_risk_score": sum(event.risk_score for event in events) / total_events
        }
    
    def _analyze_risk_trends(self, events: List[AuditEvent]) -> Dict[str, Any]:
        """Analyze risk trends from audit events"""
        
        high_risk_events = [e for e in events if e.risk_score >= 70]
        
        if not high_risk_events:
            return {"status": "No high-risk events identified"}
        
        # Group high-risk events by type
        risk_by_type = {}
        for event in high_risk_events:
            event_type = event.event_type
            if event_type not in risk_by_type:
                risk_by_type[event_type] = []
            risk_by_type[event_type].append(event)
        
        # Identify patterns
        patterns = []
        for event_type, type_events in risk_by_type.items():
            if len(type_events) >= 3:  # Pattern threshold
                patterns.append({
                    "pattern_type": "repeated_high_risk_event",
                    "event_type": event_type,
                    "occurrences": len(type_events),
                    "recommendation": f"Investigate recurring {event_type} events"
                })
        
        return {
            "high_risk_event_count": len(high_risk_events),
            "risk_event_types": list(risk_by_type.keys()),
            "identified_patterns": patterns,
            "risk_trend": "stable"  # Would be calculated based on time series
        }
    
    def _summarize_compliance_events(self, events: List[AuditEvent]) -> Dict[str, Any]:
        """Summarize compliance-related events"""
        
        compliance_events = [e for e in events if e.compliance_frameworks]
        
        if not compliance_events:
            return {"status": "No compliance events recorded"}
        
        # Group by framework
        by_framework = {}
        for event in compliance_events:
            for framework in event.compliance_frameworks:
                if framework not in by_framework:
                    by_framework[framework] = []
                by_framework[framework].append(event)
        
        return {
            "total_compliance_events": len(compliance_events),
            "frameworks_involved": list(by_framework.keys()),
            "events_by_framework": {
                framework: len(events_list) 
                for framework, events_list in by_framework.items()
            },
            "compliance_success_rate": len([
                e for e in compliance_events 
                if e.outcome == AuditOutcome.SUCCESS
            ]) / len(compliance_events) * 100 if compliance_events else 0
        }
    
    def _generate_security_recommendations(self, events: List[AuditEvent]) -> List[Dict[str, str]]:
        """Generate security recommendations based on audit events"""
        
        recommendations = []
        
        # Check for authentication failures
        auth_failures = [
            e for e in events 
            if e.category == EventCategory.AUTHENTICATION and e.outcome == AuditOutcome.FAILURE
        ]
        
        if len(auth_failures) > 10:
            recommendations.append({
                "priority": "High",
                "category": "Authentication Security",
                "recommendation": "Implement additional authentication controls",
                "rationale": f"Detected {len(auth_failures)} authentication failures"
            })
        
        # Check for high-risk events
        high_risk_events = [e for e in events if e.risk_score >= 80]
        
        if high_risk_events:
            recommendations.append({
                "priority": "Critical",
                "category": "Risk Management",
                "recommendation": "Investigate and mitigate high-risk events",
                "rationale": f"Identified {len(high_risk_events)} critical risk events"
            })
        
        # Check for system changes without approval
        unauthorized_changes = [
            e for e in events
            if e.category == EventCategory.SYSTEM_CHANGE and "unauthorized" in str(e.details)
        ]
        
        if unauthorized_changes:
            recommendations.append({
                "priority": "Medium",
                "category": "Change Management",
                "recommendation": "Strengthen change management controls",
                "rationale": f"Detected {len(unauthorized_changes)} potentially unauthorized changes"
            })
        
        return recommendations
    
    def _serialize_event_for_report(self, event: AuditEvent) -> Dict[str, Any]:
        """Serialize event for reporting with sensitive data handling"""
        
        serialized = asdict(event)
        
        # Convert enums to strings
        serialized['level'] = event.level.value
        serialized['category'] = event.category.value
        serialized['outcome'] = event.outcome.value
        serialized['timestamp'] = event.timestamp.isoformat()
        
        # Remove integrity hash from customer reports
        serialized.pop('integrity_hash', None)
        
        return serialized

class AuditLogStore:
    """Secure storage for audit logs with encryption and integrity protection"""
    
    def __init__(self):
        self.events: Dict[str, AuditEvent] = {}  # In-memory for demo
        # In production, this would use encrypted database storage
    
    async def store_event(self, event: AuditEvent) -> None:
        """Store event with encryption and integrity protection"""
        # In production, this would encrypt the event before storage
        self.events[event.event_id] = event
    
    async def get_event(self, event_id: str) -> Optional[AuditEvent]:
        """Retrieve specific event"""
        return self.events.get(event_id)
    
    async def query_events(self, query: AuditQuery) -> List[AuditEvent]:
        """Query events with filtering"""
        results = []
        
        for event in self.events.values():
            # Filter by organization
            if event.organization_id != query.organization_id:
                continue
            
            # Filter by time range
            if query.start_time and event.timestamp < query.start_time:
                continue
            if query.end_time and event.timestamp > query.end_time:
                continue
            
            # Filter by categories
            if query.categories and event.category not in query.categories:
                continue
            
            # Filter by actor
            if query.actor_id and event.actor_id != query.actor_id:
                continue
            
            # Filter by resource type
            if query.resource_type and event.resource_type != query.resource_type:
                continue
            
            # Filter by outcome
            if query.outcome and event.outcome != query.outcome:
                continue
            
            # Filter by risk score
            if event.risk_score < query.min_risk_score:
                continue
            
            results.append(event)
            
            # Limit results
            if len(results) >= query.max_results:
                break
        
        # Sort by timestamp (newest first)
        results.sort(key=lambda x: x.timestamp, reverse=True)
        
        return results

class RealTimeSecurityMonitor:
    """Real-time security monitoring and alerting"""
    
    def __init__(self):
        self.alert_thresholds = {
            "failed_auth_threshold": 5,
            "high_risk_threshold": 80,
            "suspicious_activity_threshold": 10
        }
        self.active_monitors = {}
    
    async def process_security_event(self, event: AuditEvent) -> None:
        """Process security events for real-time monitoring"""
        
        # Create security alert if needed
        if event.risk_score >= self.alert_thresholds["high_risk_threshold"]:
            await self._create_security_alert(event, "High-risk security event detected")
        
        # Track suspicious patterns
        await self._track_suspicious_patterns(event)
    
    async def process_high_risk_event(self, event: AuditEvent) -> None:
        """Process high-risk events for immediate attention"""
        
        alert_message = f"Critical event: {event.event_type} by {event.actor_id}"
        await self._create_security_alert(event, alert_message)
        
        # Notify security team immediately
        await self._notify_security_team(event)
    
    async def track_failed_authentication(self, event: AuditEvent) -> None:
        """Track failed authentication attempts for brute force detection"""
        
        actor_key = f"failed_auth_{event.actor_id}_{event.ip_address}"
        
        if actor_key not in self.active_monitors:
            self.active_monitors[actor_key] = []
        
        self.active_monitors[actor_key].append(event.timestamp)
        
        # Clean old attempts (last hour only)
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        self.active_monitors[actor_key] = [
            ts for ts in self.active_monitors[actor_key] if ts > one_hour_ago
        ]
        
        # Check threshold
        if len(self.active_monitors[actor_key]) >= self.alert_thresholds["failed_auth_threshold"]:
            await self._create_security_alert(
                event, 
                f"Potential brute force attack from {event.ip_address}"
            )
    
    async def _create_security_alert(self, event: AuditEvent, message: str) -> None:
        """Create security alert"""
        print(f"🚨 SECURITY ALERT: {message}")
        print(f"   Event ID: {event.event_id}")
        print(f"   Actor: {event.actor_id}")
        print(f"   Risk Score: {event.risk_score}")
        print(f"   Timestamp: {event.timestamp}")
    
    async def _notify_security_team(self, event: AuditEvent) -> None:
        """Notify security team of critical events"""
        print(f"📧 Security team notified of critical event: {event.event_id}")
    
    async def _track_suspicious_patterns(self, event: AuditEvent) -> None:
        """Track patterns that might indicate suspicious activity"""
        # In production, this would implement pattern detection algorithms
        pass

class CustomerAuditPortal:
    """Customer-facing audit portal for transparency"""
    
    async def notify_high_risk_event(self, event: AuditEvent) -> None:
        """Notify customer of high-risk events affecting them"""
        if event.customer_visible and event.risk_score >= 70:
            print(f"📧 Customer notification sent for high-risk event: {event.event_id}")
    
    async def generate_customer_audit_dashboard(self, organization_id: str) -> Dict[str, Any]:
        """Generate customer audit dashboard data"""
        
        # In production, this would query real audit data
        return {
            "organization_id": organization_id,
            "dashboard_data": {
                "total_events_today": 1247,
                "security_events_today": 3,
                "compliance_score": 94.2,
                "recent_high_risk_events": 0,
                "authentication_success_rate": 99.7,
                "system_uptime": 99.98
            },
            "transparency_indicators": {
                "all_events_logged": True,
                "customer_data_access_logged": True,
                "security_incidents_disclosed": True,
                "audit_logs_tamper_proof": True
            }
        }

class ComplianceReporter:
    """Automated compliance reporting from audit logs"""
    
    async def process_compliance_event(self, event: AuditEvent) -> None:
        """Process events for compliance reporting"""
        
        for framework in event.compliance_frameworks:
            await self._update_compliance_metrics(framework, event)
    
    async def _update_compliance_metrics(self, framework: str, event: AuditEvent) -> None:
        """Update compliance metrics for specific framework"""
        print(f"📊 Updated {framework} compliance metrics for event {event.event_id}")

# Context manager for audit logging
@asynccontextmanager
async def audit_context(
    logger: TransparentAuditLogger,
    event_type: str,
    category: EventCategory,
    actor_id: str,
    organization_id: str,
    resource_type: str,
    resource_id: str,
    action: str,
    **kwargs
):
    """Context manager for automatic audit logging with exception handling"""
    
    start_time = datetime.utcnow()
    correlation_id = kwargs.get('correlation_id', f"ctx_{start_time.strftime('%Y%m%d%H%M%S%f')}")
    
    try:
        # Log start event
        await logger.log_event(
            event_type=f"{event_type}_started",
            category=category,
            actor_id=actor_id,
            actor_type=kwargs.get('actor_type', 'user'),
            organization_id=organization_id,
            resource_type=resource_type,
            resource_id=resource_id,
            action=f"{action}_started",
            outcome=AuditOutcome.SUCCESS,
            details={"started_at": start_time.isoformat()},
            correlation_id=correlation_id,
            **kwargs
        )
        
        yield correlation_id
        
        # Log success event
        end_time = datetime.utcnow()
        await logger.log_event(
            event_type=f"{event_type}_completed",
            category=category,
            actor_id=actor_id,
            actor_type=kwargs.get('actor_type', 'user'),
            organization_id=organization_id,
            resource_type=resource_type,
            resource_id=resource_id,
            action=f"{action}_completed",
            outcome=AuditOutcome.SUCCESS,
            details={
                "started_at": start_time.isoformat(),
                "completed_at": end_time.isoformat(),
                "duration_seconds": (end_time - start_time).total_seconds()
            },
            correlation_id=correlation_id,
            **kwargs
        )
        
    except Exception as e:
        # Log failure event
        end_time = datetime.utcnow()
        await logger.log_event(
            event_type=f"{event_type}_failed",
            category=category,
            actor_id=actor_id,
            actor_type=kwargs.get('actor_type', 'user'),
            organization_id=organization_id,
            resource_type=resource_type,
            resource_id=resource_id,
            action=f"{action}_failed",
            outcome=AuditOutcome.FAILURE,
            details={
                "started_at": start_time.isoformat(),
                "failed_at": end_time.isoformat(),
                "duration_seconds": (end_time - start_time).total_seconds(),
                "error_type": type(e).__name__,
                "error_message": str(e)
            },
            level=LogLevel.ERROR,
            risk_score=60,
            correlation_id=correlation_id,
            **kwargs
        )
        raise

# Demo function showing transparent audit logging
async def demo_audit_logging():
    """Demonstrate comprehensive audit logging system"""
    
    # Initialize audit logger
    logger = TransparentAuditLogger(
        encryption_key="demo_encryption_key_32_chars_long",
        integrity_key="demo_integrity_key_32_chars_long"
    )
    
    print("=== VELOCITY.AI TRANSPARENT AUDIT LOGGING DEMO ===")
    print("Comprehensive audit trail with customer transparency\n")
    
    # Demo various audit events
    
    # 1. User authentication
    await logger.log_event(
        event_type="user_login",
        category=EventCategory.AUTHENTICATION,
        actor_id="john.doe@securecorp.com",
        actor_type="user",
        organization_id="securecorp_001",
        resource_type="authentication_system",
        resource_id="velocity_auth_001",
        action="login",
        outcome=AuditOutcome.SUCCESS,
        details={
            "login_method": "sso_saml",
            "mfa_used": True,
            "device_trusted": True
        },
        ip_address="192.168.1.100",
        user_agent="Mozilla/5.0 (Chrome)",
        session_id="sess_123456",
        risk_score=10,
        compliance_frameworks=["SOC2", "ISO27001"]
    )
    
    # 2. Agent activity
    await logger.log_event(
        event_type="evidence_collection",
        category=EventCategory.AGENT_ACTIVITY,
        actor_id="agent_aws_compliance_001",
        actor_type="agent",
        organization_id="securecorp_001",
        resource_type="aws_integration",
        resource_id="aws_account_123456789",
        action="collect_iam_evidence",
        outcome=AuditOutcome.SUCCESS,
        details={
            "evidence_type": "iam_password_policy",
            "items_collected": 1,
            "automation_level": 95,
            "processing_time_seconds": 12.5
        },
        risk_score=5,
        compliance_frameworks=["SOC2"]
    )
    
    # 3. High-risk event
    await logger.log_event(
        event_type="unauthorized_access_attempt",
        category=EventCategory.SECURITY_EVENT,
        actor_id="unknown_actor",
        actor_type="external",
        organization_id="securecorp_001",
        resource_type="api_endpoint",
        resource_id="/api/v1/sensitive_data",
        action="access_denied",
        outcome=AuditOutcome.BLOCKED,
        details={
            "attempted_endpoint": "/api/v1/customer_data",
            "authentication_provided": False,
            "source_country": "Unknown",
            "blocked_by": "WAF_rule_001"
        },
        level=LogLevel.SECURITY,
        ip_address="203.0.113.42",
        risk_score=85,
        compliance_frameworks=["SOC2", "GDPR"]
    )
    
    # 4. Demo context manager usage
    async with audit_context(
        logger=logger,
        event_type="compliance_report_generation",
        category=EventCategory.COMPLIANCE_EVENT,
        actor_id="compliance.officer@securecorp.com",
        organization_id="securecorp_001",
        resource_type="compliance_system",
        resource_id="velocity_compliance_001",
        action="generate_soc2_report",
        actor_type="user",
        risk_score=20,
        compliance_frameworks=["SOC2"]
    ) as correlation_id:
        # Simulate report generation work
        await asyncio.sleep(0.1)
        print(f"📊 Generating SOC 2 report with correlation ID: {correlation_id}")
    
    # Generate audit report
    start_date = datetime.utcnow() - timedelta(days=1)
    end_date = datetime.utcnow()
    
    report = await logger.generate_audit_report(
        organization_id="securecorp_001",
        start_date=start_date,
        end_date=end_date,
        format_type="summary"
    )
    
    print(f"\n=== AUDIT REPORT SUMMARY ===")
    print(f"Report Period: {report['report_metadata']['report_period']['start_date'][:10]} to {report['report_metadata']['report_period']['end_date'][:10]}")
    print(f"Total Events: {report['executive_summary']['total_events']}")
    print(f"Security Events: {report['executive_summary']['security_events']}")
    print(f"High-Risk Events: {report['executive_summary']['high_risk_events']}")
    print(f"Failed Events: {report['executive_summary']['failed_events']}")
    
    print(f"\nEvents by Category:")
    for category, count in report['events_by_category'].items():
        print(f"  {category.title()}: {count}")
    
    print(f"\nRisk Analysis:")
    risk_analysis = report['risk_analysis']
    if 'high_risk_event_count' in risk_analysis:
        print(f"  High-Risk Events: {risk_analysis['high_risk_event_count']}")
        print(f"  Risk Event Types: {', '.join(risk_analysis.get('risk_event_types', []))}")
    
    print(f"\nCompliance Summary:")
    compliance = report['compliance_summary']
    if 'total_compliance_events' in compliance:
        print(f"  Compliance Events: {compliance['total_compliance_events']}")
        print(f"  Frameworks: {', '.join(compliance.get('frameworks_involved', []))}")
        print(f"  Success Rate: {compliance.get('compliance_success_rate', 0):.1f}%")
    
    print(f"\nSecurity Recommendations ({len(report['recommendations'])}):")
    for rec in report['recommendations'][:3]:
        print(f"  • [{rec['priority']}] {rec['recommendation']}")
    
    # Demo customer audit portal
    portal = CustomerAuditPortal()
    dashboard = await portal.generate_customer_audit_dashboard("securecorp_001")
    
    print(f"\n=== CUSTOMER AUDIT DASHBOARD ===")
    data = dashboard['dashboard_data']
    print(f"Total Events Today: {data['total_events_today']:,}")
    print(f"Security Events: {data['security_events_today']}")
    print(f"Compliance Score: {data['compliance_score']}%")
    print(f"Auth Success Rate: {data['authentication_success_rate']}%")
    print(f"System Uptime: {data['system_uptime']}%")
    
    print(f"\nTransparency Indicators:")
    transparency = dashboard['transparency_indicators']
    for indicator, status in transparency.items():
        emoji = "✅" if status else "❌"
        print(f"  {emoji} {indicator.replace('_', ' ').title()}")
    
    return logger, report, dashboard

if __name__ == "__main__":
    asyncio.run(demo_audit_logging())