"""
Real-time Compliance Monitoring Service
Provides live monitoring of compliance status, evidence collection, and agent activities
"""

import asyncio
import json
import time
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional, Set
from enum import Enum
from dataclasses import dataclass, field
from collections import defaultdict, deque
import logging

from pydantic import BaseModel
import structlog
import redis.asyncio as redis
from sqlalchemy.orm import Session
from sqlalchemy import desc, func, and_

from models import (
    Organization, Agent, EvidenceItem, TrustScore, AgentExecutionLog,
    AgentStatus, EvidenceStatus, Platform, Framework
)
from database import SessionLocal
from agent_communication import communication_hub, AgentMessage, MessageType, MessagePriority
from websocket_manager import WebSocketManager

logger = structlog.get_logger()

class MonitoringEventType(Enum):
    """Types of monitoring events"""
    EVIDENCE_COLLECTED = "evidence_collected"
    AGENT_STATUS_CHANGE = "agent_status_change"
    TRUST_SCORE_UPDATE = "trust_score_update"
    COMPLIANCE_ALERT = "compliance_alert"
    FRAMEWORK_STATUS_CHANGE = "framework_status_change"
    INTEGRATION_STATUS = "integration_status"
    THRESHOLD_BREACH = "threshold_breach"
    AUDIT_EVENT = "audit_event"

class AlertSeverity(Enum):
    """Alert severity levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

@dataclass
class MonitoringEvent:
    """Real-time monitoring event"""
    event_id: str
    event_type: MonitoringEventType
    organization_id: str
    severity: AlertSeverity
    
    title: str
    description: str
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    acknowledged: bool = False
    resolved: bool = False

@dataclass
class ComplianceMetrics:
    """Current compliance metrics for an organization"""
    organization_id: str
    trust_score: int
    active_agents: int
    total_agents: int
    evidence_collected_today: int
    evidence_verified_today: int
    automation_rate: float
    framework_coverage: Dict[str, float]
    
    last_updated: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

class RealTimeMonitoringService:
    """Real-time compliance monitoring service"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_client = None
        self.monitoring_active = False
        self.metrics_cache: Dict[str, ComplianceMetrics] = {}
        self.active_alerts: Dict[str, List[MonitoringEvent]] = defaultdict(list)
        self.event_history: deque = deque(maxlen=10000)
        
        # Monitoring thresholds
        self.thresholds = {
            "trust_score_minimum": 80,
            "agent_downtime_minutes": 30,
            "evidence_collection_daily_minimum": 10,
            "automation_rate_minimum": 70,
            "framework_coverage_minimum": 60
        }
        
        # WebSocket manager for real-time updates
        self.websocket_manager = None
        
    async def start(self, redis_url: str = "redis://localhost:6379"):
        """Start the monitoring service"""
        self.redis_client = redis.from_url(redis_url)
        self.websocket_manager = WebSocketManager()
        self.monitoring_active = True
        
        # Start background monitoring tasks
        asyncio.create_task(self._continuous_monitoring_loop())
        asyncio.create_task(self._metrics_aggregation_loop())
        asyncio.create_task(self._alert_processing_loop())
        
        logger.info("Real-time monitoring service started")
    
    async def stop(self):
        """Stop the monitoring service"""
        self.monitoring_active = False
        
        if self.redis_client:
            await self.redis_client.close()
        
        logger.info("Real-time monitoring service stopped")
    
    async def _continuous_monitoring_loop(self):
        """Main monitoring loop"""
        while self.monitoring_active:
            try:
                db = SessionLocal()
                
                # Get all organizations
                organizations = db.query(Organization).all()
                
                for org in organizations:
                    await self._monitor_organization(db, org.id)
                
                db.close()
                
                # Wait before next monitoring cycle
                await asyncio.sleep(30)  # Monitor every 30 seconds
                
            except Exception as e:
                logger.error("Error in monitoring loop", error=str(e))
                await asyncio.sleep(60)  # Longer wait on error
    
    async def _monitor_organization(self, db: Session, org_id: str):
        """Monitor a specific organization"""
        try:
            # Collect current metrics
            metrics = await self._collect_metrics(db, org_id)
            self.metrics_cache[org_id] = metrics
            
            # Check thresholds and generate alerts
            await self._check_thresholds(org_id, metrics)
            
            # Monitor agent status changes
            await self._monitor_agent_status_changes(db, org_id)
            
            # Monitor evidence collection patterns
            await self._monitor_evidence_patterns(db, org_id)
            
            # Broadcast metrics update via WebSocket
            await self._broadcast_metrics_update(org_id, metrics)
            
        except Exception as e:
            logger.error(
                "Error monitoring organization",
                organization_id=org_id,
                error=str(e)
            )
    
    async def _collect_metrics(self, db: Session, org_id: str) -> ComplianceMetrics:
        """Collect current compliance metrics for an organization"""
        # Trust score calculation
        recent_evidence = db.query(EvidenceItem).filter(
            EvidenceItem.organization_id == org_id
        ).order_by(desc(EvidenceItem.created_at)).limit(100).all()
        
        validated_evidence = [e for e in recent_evidence if e.status == EvidenceStatus.VERIFIED]
        trust_score = min(94, int(85 + (len(validated_evidence) / max(len(recent_evidence), 1)) * 15))
        
        # Agent metrics
        agents = db.query(Agent).filter(Agent.organization_id == org_id).all()
        active_agents = len([a for a in agents if a.status == AgentStatus.ACTIVE])
        
        # Evidence metrics for today
        today = datetime.now().date()
        evidence_today = db.query(EvidenceItem).filter(
            EvidenceItem.organization_id == org_id,
            func.date(EvidenceItem.created_at) == today
        ).all()
        
        verified_today = len([e for e in evidence_today if e.status == EvidenceStatus.VERIFIED])
        
        # Automation rate
        automation_rate = (active_agents / max(len(agents), 1)) * 100
        
        # Framework coverage
        framework_coverage = {}
        for framework in Framework:
            framework_evidence = [e for e in recent_evidence if e.framework == framework]
            if framework_evidence:
                verified_count = len([e for e in framework_evidence if e.status == EvidenceStatus.VERIFIED])
                coverage = (verified_count / len(framework_evidence)) * 100
                framework_coverage[framework.value] = coverage
        
        return ComplianceMetrics(
            organization_id=org_id,
            trust_score=trust_score,
            active_agents=active_agents,
            total_agents=len(agents),
            evidence_collected_today=len(evidence_today),
            evidence_verified_today=verified_today,
            automation_rate=automation_rate,
            framework_coverage=framework_coverage
        )
    
    async def _check_thresholds(self, org_id: str, metrics: ComplianceMetrics):
        """Check if any thresholds are breached and generate alerts"""
        alerts = []
        
        # Trust score threshold
        if metrics.trust_score < self.thresholds["trust_score_minimum"]:
            alerts.append(MonitoringEvent(
                event_id=f"trust_score_{org_id}_{int(time.time())}",
                event_type=MonitoringEventType.THRESHOLD_BREACH,
                organization_id=org_id,
                severity=AlertSeverity.HIGH,
                title="Trust Score Below Threshold",
                description=f"Trust score ({metrics.trust_score}%) is below minimum ({self.thresholds['trust_score_minimum']}%)",
                metadata={
                    "current_score": metrics.trust_score,
                    "threshold": self.thresholds["trust_score_minimum"],
                    "metric_type": "trust_score"
                }
            ))
        
        # Evidence collection threshold
        if metrics.evidence_collected_today < self.thresholds["evidence_collection_daily_minimum"]:
            alerts.append(MonitoringEvent(
                event_id=f"evidence_low_{org_id}_{int(time.time())}",
                event_type=MonitoringEventType.THRESHOLD_BREACH,
                organization_id=org_id,
                severity=AlertSeverity.MEDIUM,
                title="Low Evidence Collection",
                description=f"Only {metrics.evidence_collected_today} evidence items collected today (minimum: {self.thresholds['evidence_collection_daily_minimum']})",
                metadata={
                    "collected_today": metrics.evidence_collected_today,
                    "threshold": self.thresholds["evidence_collection_daily_minimum"],
                    "metric_type": "evidence_collection"
                }
            ))
        
        # Automation rate threshold
        if metrics.automation_rate < self.thresholds["automation_rate_minimum"]:
            alerts.append(MonitoringEvent(
                event_id=f"automation_low_{org_id}_{int(time.time())}",
                event_type=MonitoringEventType.THRESHOLD_BREACH,
                organization_id=org_id,
                severity=AlertSeverity.MEDIUM,
                title="Low Automation Rate",
                description=f"Automation rate ({metrics.automation_rate:.1f}%) is below minimum ({self.thresholds['automation_rate_minimum']}%)",
                metadata={
                    "current_rate": metrics.automation_rate,
                    "threshold": self.thresholds["automation_rate_minimum"],
                    "metric_type": "automation_rate"
                }
            ))
        
        # Process alerts
        for alert in alerts:
            await self._process_alert(alert)
    
    async def _monitor_agent_status_changes(self, db: Session, org_id: str):
        """Monitor for agent status changes"""
        # This would track recent status changes and generate events
        # For now, we'll check for agents that have been inactive too long
        
        inactive_threshold = datetime.now() - timedelta(minutes=self.thresholds["agent_downtime_minutes"])
        
        inactive_agents = db.query(Agent).filter(
            Agent.organization_id == org_id,
            Agent.status != AgentStatus.ACTIVE,
            Agent.last_run < inactive_threshold
        ).all()
        
        for agent in inactive_agents:
            event = MonitoringEvent(
                event_id=f"agent_inactive_{agent.id}_{int(time.time())}",
                event_type=MonitoringEventType.AGENT_STATUS_CHANGE,
                organization_id=org_id,
                severity=AlertSeverity.MEDIUM,
                title=f"Agent {agent.name} Inactive",
                description=f"Agent has been inactive for more than {self.thresholds['agent_downtime_minutes']} minutes",
                metadata={
                    "agent_id": str(agent.id),
                    "agent_name": agent.name,
                    "status": agent.status.value,
                    "last_run": agent.last_run.isoformat() if agent.last_run else None
                }
            )
            
            await self._process_alert(event)
    
    async def _monitor_evidence_patterns(self, db: Session, org_id: str):
        """Monitor evidence collection patterns for anomalies"""
        # Check for evidence collection spikes or drops
        
        # Get evidence collection for last 7 days
        week_ago = datetime.now() - timedelta(days=7)
        recent_evidence = db.query(EvidenceItem).filter(
            EvidenceItem.organization_id == org_id,
            EvidenceItem.created_at >= week_ago
        ).all()
        
        # Group by day
        daily_counts = defaultdict(int)
        for evidence in recent_evidence:
            day = evidence.created_at.date()
            daily_counts[day] += 1
        
        # Calculate average and detect anomalies
        if len(daily_counts) > 3:
            counts = list(daily_counts.values())
            avg_daily = sum(counts) / len(counts)
            
            today_count = daily_counts.get(datetime.now().date(), 0)
            
            # Check for significant drop (less than 50% of average)
            if today_count < avg_daily * 0.5 and avg_daily > 5:
                event = MonitoringEvent(
                    event_id=f"evidence_drop_{org_id}_{int(time.time())}",
                    event_type=MonitoringEventType.COMPLIANCE_ALERT,
                    organization_id=org_id,
                    severity=AlertSeverity.MEDIUM,
                    title="Evidence Collection Drop",
                    description=f"Today's evidence collection ({today_count}) is significantly below average ({avg_daily:.1f})",
                    metadata={
                        "today_count": today_count,
                        "weekly_average": avg_daily,
                        "drop_percentage": ((avg_daily - today_count) / avg_daily) * 100
                    }
                )
                
                await self._process_alert(event)
    
    async def _process_alert(self, event: MonitoringEvent):
        """Process and store an alert"""
        # Store in active alerts
        self.active_alerts[event.organization_id].append(event)
        
        # Add to event history
        self.event_history.append(event)
        
        # Broadcast to WebSocket clients
        await self._broadcast_alert(event)
        
        # Log the alert
        logger.warning(
            "Compliance alert generated",
            event_id=event.event_id,
            organization_id=event.organization_id,
            severity=event.severity.value,
            title=event.title
        )
    
    async def _metrics_aggregation_loop(self):
        """Aggregate and cache metrics periodically"""
        while self.monitoring_active:
            try:
                # Store aggregated metrics in Redis for fast access
                for org_id, metrics in self.metrics_cache.items():
                    metrics_data = {
                        "trust_score": metrics.trust_score,
                        "active_agents": metrics.active_agents,
                        "total_agents": metrics.total_agents,
                        "evidence_collected_today": metrics.evidence_collected_today,
                        "evidence_verified_today": metrics.evidence_verified_today,
                        "automation_rate": metrics.automation_rate,
                        "framework_coverage": metrics.framework_coverage,
                        "last_updated": metrics.last_updated.isoformat()
                    }
                    
                    await self.redis_client.setex(
                        f"compliance_metrics:{org_id}",
                        300,  # 5 minutes TTL
                        json.dumps(metrics_data)
                    )
                
                await asyncio.sleep(60)  # Aggregate every minute
                
            except Exception as e:
                logger.error("Error in metrics aggregation", error=str(e))
                await asyncio.sleep(120)
    
    async def _alert_processing_loop(self):
        """Process and clean up alerts"""
        while self.monitoring_active:
            try:
                # Clean up old resolved alerts
                cutoff_time = datetime.now(timezone.utc) - timedelta(hours=24)
                
                for org_id, alerts in self.active_alerts.items():
                    # Remove old resolved alerts
                    active_alerts = []
                    for alert in alerts:
                        if not alert.resolved or alert.timestamp > cutoff_time:
                            active_alerts.append(alert)
                    
                    self.active_alerts[org_id] = active_alerts
                
                await asyncio.sleep(300)  # Clean up every 5 minutes
                
            except Exception as e:
                logger.error("Error in alert processing", error=str(e))
                await asyncio.sleep(600)
    
    async def _broadcast_metrics_update(self, org_id: str, metrics: ComplianceMetrics):
        """Broadcast metrics update via WebSocket"""
        if self.websocket_manager:
            message = {
                "type": "metrics_update",
                "organization_id": org_id,
                "data": {
                    "trust_score": metrics.trust_score,
                    "active_agents": metrics.active_agents,
                    "evidence_collected_today": metrics.evidence_collected_today,
                    "automation_rate": metrics.automation_rate,
                    "timestamp": metrics.last_updated.isoformat()
                }
            }
            
            await self.websocket_manager.broadcast_to_organization(org_id, json.dumps(message))
    
    async def _broadcast_alert(self, event: MonitoringEvent):
        """Broadcast alert via WebSocket"""
        if self.websocket_manager:
            message = {
                "type": "compliance_alert",
                "data": {
                    "event_id": event.event_id,
                    "event_type": event.event_type.value,
                    "severity": event.severity.value,
                    "title": event.title,
                    "description": event.description,
                    "timestamp": event.timestamp.isoformat(),
                    "metadata": event.metadata
                }
            }
            
            await self.websocket_manager.broadcast_to_organization(
                event.organization_id, 
                json.dumps(message)
            )
    
    def get_current_metrics(self, org_id: str) -> Optional[ComplianceMetrics]:
        """Get current cached metrics for an organization"""
        return self.metrics_cache.get(org_id)
    
    def get_active_alerts(self, org_id: str) -> List[MonitoringEvent]:
        """Get active alerts for an organization"""
        alerts = self.active_alerts.get(org_id, [])
        return [alert for alert in alerts if not alert.resolved]
    
    async def acknowledge_alert(self, org_id: str, event_id: str) -> bool:
        """Acknowledge an alert"""
        alerts = self.active_alerts.get(org_id, [])
        for alert in alerts:
            if alert.event_id == event_id:
                alert.acknowledged = True
                return True
        return False
    
    async def resolve_alert(self, org_id: str, event_id: str) -> bool:
        """Resolve an alert"""
        alerts = self.active_alerts.get(org_id, [])
        for alert in alerts:
            if alert.event_id == event_id:
                alert.resolved = True
                alert.acknowledged = True
                return True
        return False
    
    def get_monitoring_stats(self) -> Dict[str, Any]:
        """Get monitoring service statistics"""
        total_alerts = sum(len(alerts) for alerts in self.active_alerts.values())
        active_alerts = sum(
            len([a for a in alerts if not a.resolved]) 
            for alerts in self.active_alerts.values()
        )
        
        return {
            "monitoring_active": self.monitoring_active,
            "organizations_monitored": len(self.metrics_cache),
            "total_alerts": total_alerts,
            "active_alerts": active_alerts,
            "event_history_size": len(self.event_history),
            "last_monitoring_cycle": datetime.now(timezone.utc).isoformat()
        }

# Global monitoring service instance
monitoring_service = RealTimeMonitoringService()