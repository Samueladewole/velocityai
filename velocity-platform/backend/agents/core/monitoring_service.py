"""
Performance monitoring and alerting service for ERIP AI Agents.
Tracks system health, performance metrics, and sends alerts for issues.
"""

import asyncio
import psutil
import time
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from enum import Enum
import structlog
import json
import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
import aiohttp
import redis
from .database import DatabaseManager

logger = structlog.get_logger()


class AlertSeverity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class MetricType(Enum):
    SYSTEM = "system"
    APPLICATION = "application"
    BUSINESS = "business"


@dataclass
class PerformanceMetric:
    timestamp: datetime
    metric_name: str
    metric_type: MetricType
    value: float
    unit: str
    customer_id: Optional[str] = None
    agent_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class Alert:
    alert_id: str
    severity: AlertSeverity
    title: str
    description: str
    metric_name: str
    threshold_value: float
    current_value: float
    customer_id: Optional[str]
    created_at: datetime
    resolved_at: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class AlertRule:
    rule_id: str
    metric_name: str
    operator: str  # '>', '<', '>=', '<=', '=='
    threshold: float
    severity: AlertSeverity
    enabled: bool
    customer_id: Optional[str] = None  # None for global rules


class PerformanceMonitoringService:
    """Comprehensive monitoring service for AI agents platform"""
    
    def __init__(self, redis_url: str = None):
        self.db = DatabaseManager()
        self.redis_client = redis.Redis.from_url(
            redis_url or "redis://localhost:6379/0",
            decode_responses=True
        )
        
        # Monitoring configuration
        self.metrics_retention_days = 30
        self.alert_retention_days = 90
        self.collection_interval_seconds = 60
        
        # Performance thresholds
        self.default_alert_rules = [
            AlertRule(
                rule_id="cpu_high",
                metric_name="system.cpu_percent",
                operator=">",
                threshold=80.0,
                severity=AlertSeverity.HIGH,
                enabled=True
            ),
            AlertRule(
                rule_id="memory_high",
                metric_name="system.memory_percent",
                operator=">",
                threshold=85.0,
                severity=AlertSeverity.HIGH,
                enabled=True
            ),
            AlertRule(
                rule_id="disk_high",
                metric_name="system.disk_percent",
                operator=">",
                threshold=90.0,
                severity=AlertSeverity.CRITICAL,
                enabled=True
            ),
            AlertRule(
                rule_id="agent_error_rate",
                metric_name="agents.error_rate",
                operator=">",
                threshold=5.0,
                severity=AlertSeverity.MEDIUM,
                enabled=True
            ),
            AlertRule(
                rule_id="evidence_processing_time",
                metric_name="agents.evidence_processing_time",
                operator=">",
                threshold=300.0,  # 5 minutes
                severity=AlertSeverity.MEDIUM,
                enabled=True
            )
        ]
        
        # Active alerts tracking
        self.active_alerts: Dict[str, Alert] = {}
        
        # Email configuration
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.email_user = "alerts@erip.io"
        self.email_password = "your_email_password"  # Use environment variable
    
    async def collect_system_metrics(self) -> List[PerformanceMetric]:
        """Collect system performance metrics"""
        
        timestamp = datetime.utcnow()
        metrics = []
        
        # CPU metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        metrics.append(PerformanceMetric(
            timestamp=timestamp,
            metric_name="system.cpu_percent",
            metric_type=MetricType.SYSTEM,
            value=cpu_percent,
            unit="percent"
        ))
        
        # Memory metrics
        memory = psutil.virtual_memory()
        metrics.append(PerformanceMetric(
            timestamp=timestamp,
            metric_name="system.memory_percent",
            metric_type=MetricType.SYSTEM,
            value=memory.percent,
            unit="percent"
        ))
        
        metrics.append(PerformanceMetric(
            timestamp=timestamp,
            metric_name="system.memory_available_gb",
            metric_type=MetricType.SYSTEM,
            value=memory.available / (1024**3),
            unit="gigabytes"
        ))
        
        # Disk metrics
        disk = psutil.disk_usage('/')
        disk_percent = (disk.used / disk.total) * 100
        metrics.append(PerformanceMetric(
            timestamp=timestamp,
            metric_name="system.disk_percent",
            metric_type=MetricType.SYSTEM,
            value=disk_percent,
            unit="percent"
        ))
        
        # Network metrics
        network = psutil.net_io_counters()
        metrics.append(PerformanceMetric(
            timestamp=timestamp,
            metric_name="system.network_bytes_sent",
            metric_type=MetricType.SYSTEM,
            value=network.bytes_sent,
            unit="bytes"
        ))
        
        metrics.append(PerformanceMetric(
            timestamp=timestamp,
            metric_name="system.network_bytes_recv",
            metric_type=MetricType.SYSTEM,
            value=network.bytes_recv,
            unit="bytes"
        ))
        
        return metrics
    
    async def collect_application_metrics(self) -> List[PerformanceMetric]:
        """Collect application-specific metrics"""
        
        timestamp = datetime.utcnow()
        metrics = []
        
        # Redis connection metrics
        try:
            redis_info = self.redis_client.info()
            
            metrics.append(PerformanceMetric(
                timestamp=timestamp,
                metric_name="redis.connected_clients",
                metric_type=MetricType.APPLICATION,
                value=redis_info.get('connected_clients', 0),
                unit="count"
            ))
            
            metrics.append(PerformanceMetric(
                timestamp=timestamp,
                metric_name="redis.used_memory_mb",
                metric_type=MetricType.APPLICATION,
                value=redis_info.get('used_memory', 0) / (1024*1024),
                unit="megabytes"
            ))
            
        except Exception as e:
            logger.error("redis_metrics_failed", error=str(e))
        
        # Mock agent metrics - replace with actual data
        active_agents = 15
        total_evidence_items = 1547
        processing_queue_size = 23
        
        metrics.extend([
            PerformanceMetric(
                timestamp=timestamp,
                metric_name="agents.active_count",
                metric_type=MetricType.APPLICATION,
                value=active_agents,
                unit="count"
            ),
            PerformanceMetric(
                timestamp=timestamp,
                metric_name="agents.total_evidence_items",
                metric_type=MetricType.APPLICATION,
                value=total_evidence_items,
                unit="count"
            ),
            PerformanceMetric(
                timestamp=timestamp,
                metric_name="agents.processing_queue_size",
                metric_type=MetricType.APPLICATION,
                value=processing_queue_size,
                unit="count"
            )
        ])
        
        return metrics
    
    async def collect_business_metrics(self, customer_id: str = None) -> List[PerformanceMetric]:
        """Collect business performance metrics"""
        
        timestamp = datetime.utcnow()
        metrics = []
        
        # Mock business metrics - replace with actual calculations
        evidence_collection_rate = 95.1  # % automation
        trust_score_improvement = 22.4
        time_to_onboard_minutes = 28.5
        
        base_metrics = [
            PerformanceMetric(
                timestamp=timestamp,
                metric_name="business.evidence_automation_rate",
                metric_type=MetricType.BUSINESS,
                value=evidence_collection_rate,
                unit="percent",
                customer_id=customer_id
            ),
            PerformanceMetric(
                timestamp=timestamp,
                metric_name="business.trust_score_improvement",
                metric_type=MetricType.BUSINESS,
                value=trust_score_improvement,
                unit="points",
                customer_id=customer_id
            ),
            PerformanceMetric(
                timestamp=timestamp,
                metric_name="business.onboarding_time_minutes",
                metric_type=MetricType.BUSINESS,
                value=time_to_onboard_minutes,
                unit="minutes",
                customer_id=customer_id
            )
        ]
        
        metrics.extend(base_metrics)
        return metrics
    
    async def store_metrics(self, metrics: List[PerformanceMetric]):
        """Store metrics in Redis with TTL"""
        
        for metric in metrics:
            # Create metric key
            key_parts = [
                "metrics",
                metric.metric_type.value,
                metric.metric_name,
                metric.timestamp.strftime("%Y%m%d%H%M")
            ]
            
            if metric.customer_id:
                key_parts.insert(-1, metric.customer_id)
            
            key = ":".join(key_parts)
            
            # Store metric data
            metric_data = {
                "value": metric.value,
                "unit": metric.unit,
                "timestamp": metric.timestamp.isoformat(),
                "metadata": json.dumps(metric.metadata or {})
            }
            
            # Store with TTL
            ttl_seconds = self.metrics_retention_days * 24 * 3600
            await asyncio.to_thread(
                self.redis_client.setex,
                key,
                ttl_seconds,
                json.dumps(metric_data)
            )
    
    async def check_alert_rules(self, metrics: List[PerformanceMetric]):
        """Check metrics against alert rules and trigger alerts"""
        
        for metric in metrics:
            # Find applicable rules
            applicable_rules = [
                rule for rule in self.default_alert_rules
                if rule.metric_name == metric.metric_name and
                rule.enabled and
                (rule.customer_id is None or rule.customer_id == metric.customer_id)
            ]
            
            for rule in applicable_rules:
                # Evaluate condition
                triggered = self._evaluate_alert_condition(
                    metric.value, rule.operator, rule.threshold
                )
                
                if triggered:
                    await self._trigger_alert(metric, rule)
                else:
                    # Check if we should resolve an existing alert
                    await self._resolve_alert_if_exists(metric, rule)
    
    def _evaluate_alert_condition(self, value: float, operator: str, threshold: float) -> bool:
        """Evaluate alert condition"""
        
        if operator == ">":
            return value > threshold
        elif operator == "<":
            return value < threshold
        elif operator == ">=":
            return value >= threshold
        elif operator == "<=":
            return value <= threshold
        elif operator == "==":
            return value == threshold
        else:
            return False
    
    async def _trigger_alert(self, metric: PerformanceMetric, rule: AlertRule):
        """Trigger an alert"""
        
        alert_key = f"{rule.rule_id}:{metric.customer_id or 'global'}"
        
        # Check if alert is already active
        if alert_key in self.active_alerts:
            return
        
        # Create new alert
        alert = Alert(
            alert_id=alert_key,
            severity=rule.severity,
            title=f"Alert: {metric.metric_name}",
            description=f"{metric.metric_name} value {metric.value} {rule.operator} {rule.threshold}",
            metric_name=metric.metric_name,
            threshold_value=rule.threshold,
            current_value=metric.value,
            customer_id=metric.customer_id,
            created_at=datetime.utcnow(),
            metadata={
                "rule_id": rule.rule_id,
                "metric_unit": metric.unit
            }
        )
        
        # Store alert
        self.active_alerts[alert_key] = alert
        
        # Persist to Redis
        await asyncio.to_thread(
            self.redis_client.setex,
            f"alert:{alert_key}",
            self.alert_retention_days * 24 * 3600,
            json.dumps(asdict(alert), default=str)
        )
        
        # Send alert notification
        await self._send_alert_notification(alert)
        
        logger.warning(
            "alert_triggered",
            alert_id=alert.alert_id,
            severity=alert.severity.value,
            metric=metric.metric_name,
            value=metric.value,
            threshold=rule.threshold
        )
    
    async def _resolve_alert_if_exists(self, metric: PerformanceMetric, rule: AlertRule):
        """Resolve alert if it exists and condition is no longer met"""
        
        alert_key = f"{rule.rule_id}:{metric.customer_id or 'global'}"
        
        if alert_key in self.active_alerts:
            alert = self.active_alerts[alert_key]
            alert.resolved_at = datetime.utcnow()
            
            # Update in Redis
            await asyncio.to_thread(
                self.redis_client.setex,
                f"alert:{alert_key}",
                self.alert_retention_days * 24 * 3600,
                json.dumps(asdict(alert), default=str)
            )
            
            # Remove from active alerts
            del self.active_alerts[alert_key]
            
            # Send resolution notification
            await self._send_alert_resolution(alert)
            
            logger.info(
                "alert_resolved",
                alert_id=alert.alert_id,
                metric=metric.metric_name,
                value=metric.value
            )
    
    async def _send_alert_notification(self, alert: Alert):
        """Send alert notification via email"""
        
        try:
            # Prepare email
            subject = f"[ERIP Alert - {alert.severity.value.upper()}] {alert.title}"
            
            body = f"""
            Alert Details:
            - Severity: {alert.severity.value.upper()}
            - Metric: {alert.metric_name}
            - Current Value: {alert.current_value}
            - Threshold: {alert.threshold_value}
            - Customer: {alert.customer_id or 'Global'}
            - Time: {alert.created_at}
            
            Description: {alert.description}
            """
            
            # Send to multiple recipients based on severity
            recipients = self._get_alert_recipients(alert.severity)
            
            for recipient in recipients:
                await self._send_email(recipient, subject, body)
                
        except Exception as e:
            logger.error("alert_notification_failed", error=str(e))
    
    async def _send_alert_resolution(self, alert: Alert):
        """Send alert resolution notification"""
        
        try:
            subject = f"[ERIP Alert RESOLVED] {alert.title}"
            
            body = f"""
            Alert Resolved:
            - Metric: {alert.metric_name}
            - Customer: {alert.customer_id or 'Global'}
            - Resolved At: {alert.resolved_at}
            - Duration: {alert.resolved_at - alert.created_at}
            """
            
            recipients = self._get_alert_recipients(alert.severity)
            
            for recipient in recipients:
                await self._send_email(recipient, subject, body)
                
        except Exception as e:
            logger.error("alert_resolution_notification_failed", error=str(e))
    
    def _get_alert_recipients(self, severity: AlertSeverity) -> List[str]:
        """Get email recipients based on alert severity"""
        
        base_recipients = ["ops@erip.io"]
        
        if severity in [AlertSeverity.HIGH, AlertSeverity.CRITICAL]:
            base_recipients.extend([
                "engineering@erip.io",
                "leadership@erip.io"
            ])
        
        return base_recipients
    
    async def _send_email(self, to_email: str, subject: str, body: str):
        """Send email notification"""
        
        try:
            msg = MimeMultipart()
            msg['From'] = self.email_user
            msg['To'] = to_email
            msg['Subject'] = subject
            
            msg.attach(MimeText(body, 'plain'))
            
            # Send email using thread pool
            await asyncio.to_thread(self._send_smtp_email, msg, to_email)
            
        except Exception as e:
            logger.error("email_send_failed", to=to_email, error=str(e))
    
    def _send_smtp_email(self, msg: MimeMultipart, to_email: str):
        """Send email via SMTP (blocking operation)"""
        
        server = smtplib.SMTP(self.smtp_server, self.smtp_port)
        server.starttls()
        server.login(self.email_user, self.email_password)
        
        text = msg.as_string()
        server.sendmail(self.email_user, to_email, text)
        server.quit()
    
    async def get_metrics_summary(
        self,
        customer_id: str = None,
        hours: int = 24
    ) -> Dict[str, Any]:
        """Get metrics summary for the specified time period"""
        
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(hours=hours)
        
        # Mock summary - replace with actual Redis queries
        summary = {
            "period": {
                "start": start_time.isoformat(),
                "end": end_time.isoformat(),
                "hours": hours
            },
            "system_metrics": {
                "avg_cpu_percent": 45.2,
                "max_cpu_percent": 78.3,
                "avg_memory_percent": 62.1,
                "max_memory_percent": 84.7,
                "avg_disk_percent": 35.8
            },
            "application_metrics": {
                "active_agents": 15,
                "total_evidence_collected": 156,
                "avg_processing_time_seconds": 23.4,
                "error_rate_percent": 1.2
            },
            "business_metrics": {
                "automation_rate_percent": 95.1,
                "onboarding_completions": 3,
                "trust_score_improvements": 12.4
            },
            "alerts": {
                "total_triggered": 2,
                "by_severity": {
                    "low": 0,
                    "medium": 1,
                    "high": 1,
                    "critical": 0
                },
                "total_resolved": 1
            }
        }
        
        return summary
    
    async def start_monitoring(self):
        """Start the monitoring service"""
        
        logger.info("performance_monitoring_started")
        
        while True:
            try:
                # Collect all metrics
                system_metrics = await self.collect_system_metrics()
                app_metrics = await self.collect_application_metrics()
                business_metrics = await self.collect_business_metrics()
                
                all_metrics = system_metrics + app_metrics + business_metrics
                
                # Store metrics
                await self.store_metrics(all_metrics)
                
                # Check alert rules
                await self.check_alert_rules(all_metrics)
                
                # Log metrics collection
                logger.info(
                    "metrics_collected",
                    count=len(all_metrics),
                    system=len(system_metrics),
                    application=len(app_metrics),
                    business=len(business_metrics)
                )
                
                # Wait for next collection interval
                await asyncio.sleep(self.collection_interval_seconds)
                
            except asyncio.CancelledError:
                logger.info("monitoring_cancelled")
                break
            except Exception as e:
                logger.error("monitoring_cycle_failed", error=str(e))
                await asyncio.sleep(30)  # Wait 30 seconds before retry


# Global instance
monitoring_service = PerformanceMonitoringService()