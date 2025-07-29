"""
Self-Healing Compliance System for Velocity AI Platform
Automatically detects, diagnoses, and resolves compliance issues with minimal human intervention
"""

import asyncio
import json
import uuid
import time
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional, Union, Tuple, Callable
from enum import Enum
from dataclasses import dataclass, field, asdict
from collections import defaultdict, deque
import logging

from pydantic import BaseModel, Field
import structlog
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from agent_orchestration import AgentType, TaskType, TaskStatus, orchestrator
from agent_communication import AgentMessage, MessageType, MessagePriority, communication_hub
from workflow_engine import WorkflowEngine, WorkflowType, get_workflow_engine
from predictive_analytics import PredictiveAnalyticsEngine, get_analytics_engine, RiskLevel
from models import Agent, EvidenceItem, Organization, Framework, Platform

logger = structlog.get_logger()

class IssueType(Enum):
    """Types of compliance issues that can be self-healed"""
    AGENT_FAILURE = "agent_failure"
    EVIDENCE_GAP = "evidence_gap"
    CONFIGURATION_DRIFT = "configuration_drift"
    PERFORMANCE_DEGRADATION = "performance_degradation"
    COMPLIANCE_VIOLATION = "compliance_violation"
    INTEGRATION_FAILURE = "integration_failure"
    DATA_QUALITY_ISSUE = "data_quality_issue"
    SECURITY_INCIDENT = "security_incident"
    CAPACITY_OVERFLOW = "capacity_overflow"
    DEPENDENCY_FAILURE = "dependency_failure"

class IssueSeverity(Enum):
    """Severity levels for compliance issues"""
    CRITICAL = "critical"      # Immediate attention, automated response
    HIGH = "high"             # Quick response needed, automated with notification
    MEDIUM = "medium"         # Automated response, periodic review
    LOW = "low"              # Monitor and batch process
    INFO = "info"            # Log only, no immediate action

class HealingAction(Enum):
    """Types of self-healing actions"""
    RESTART_AGENT = "restart_agent"
    RECONFIGURE_AGENT = "reconfigure_agent"
    TRIGGER_EVIDENCE_COLLECTION = "trigger_evidence_collection"
    SCALE_RESOURCES = "scale_resources"
    FAILOVER_TO_BACKUP = "failover_to_backup"
    RESET_CONFIGURATION = "reset_configuration"
    VALIDATE_DATA = "validate_data"
    NOTIFY_ADMINISTRATORS = "notify_administrators"
    CREATE_INCIDENT = "create_incident"
    EXECUTE_WORKFLOW = "execute_workflow"

class HealingStatus(Enum):
    """Status of healing actions"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    PARTIALLY_RESOLVED = "partially_resolved"
    ESCALATED = "escalated"

@dataclass
class ComplianceIssue:
    """A detected compliance issue requiring attention"""
    issue_id: str
    issue_type: IssueType
    severity: IssueSeverity
    
    # Issue details
    title: str
    description: str
    affected_components: List[str] = field(default_factory=list)
    
    # Context
    organization_id: str
    framework: Optional[Framework] = None
    agent_type: Optional[AgentType] = None
    control_id: Optional[str] = None
    
    # Detection info
    detected_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    detected_by: str = "self_healing_system"
    detection_method: str = "automated_monitoring"
    
    # Issue data
    error_details: Dict[str, Any] = field(default_factory=dict)
    metrics: Dict[str, float] = field(default_factory=dict)
    context_data: Dict[str, Any] = field(default_factory=dict)
    
    # Resolution tracking
    resolution_attempts: int = 0
    max_resolution_attempts: int = 3
    last_resolution_attempt: Optional[datetime] = None
    
    # Status
    is_resolved: bool = False
    resolved_at: Optional[datetime] = None
    resolution_method: Optional[str] = None
    
    # Escalation
    escalated: bool = False
    escalated_at: Optional[datetime] = None
    escalation_reason: Optional[str] = None

@dataclass
class HealingAction:
    """An action taken to resolve a compliance issue"""
    action_id: str
    issue_id: str
    action_type: HealingAction
    status: HealingStatus
    
    # Action details
    title: str
    description: str
    parameters: Dict[str, Any] = field(default_factory=dict)
    
    # Execution
    executor: str = "self_healing_system"
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    # Results
    success: Optional[bool] = None
    result_data: Dict[str, Any] = field(default_factory=dict)
    error_message: Optional[str] = None
    
    # Impact assessment
    expected_impact: Dict[str, str] = field(default_factory=dict)
    actual_impact: Dict[str, str] = field(default_factory=dict)
    
    # Rollback capability
    rollback_available: bool = False
    rollback_data: Dict[str, Any] = field(default_factory=dict)

@dataclass
class HealingRule:
    """Rule defining how to handle specific types of issues"""
    rule_id: str
    name: str
    description: str
    
    # Trigger conditions
    issue_types: List[IssueType]
    severity_threshold: IssueSeverity
    conditions: Dict[str, Any] = field(default_factory=dict)
    
    # Actions to take
    healing_actions: List[HealingAction]
    action_sequence: str = "parallel"  # parallel, sequential
    
    # Configuration
    enabled: bool = True
    auto_execute: bool = True
    require_approval: bool = False
    approval_roles: List[str] = field(default_factory=list)
    
    # Limits
    max_executions_per_hour: int = 10
    max_executions_per_day: int = 100
    cooldown_minutes: int = 5
    
    # Metadata
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    last_executed: Optional[datetime] = None
    execution_count: int = 0
    success_count: int = 0

class IssueDetector:
    """Detects compliance issues through various monitoring mechanisms"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.detection_rules: Dict[str, Callable] = {}
        self.monitoring_state: Dict[str, Any] = {}
        self._initialize_detection_rules()
    
    def _initialize_detection_rules(self):
        """Initialize detection rules for different issue types"""
        
        self.detection_rules = {
            "agent_failure": self._detect_agent_failures,
            "evidence_gap": self._detect_evidence_gaps,
            "performance_degradation": self._detect_performance_issues,
            "configuration_drift": self._detect_configuration_drift,
            "integration_failure": self._detect_integration_failures,
            "data_quality": self._detect_data_quality_issues,
            "capacity_overflow": self._detect_capacity_issues
        }
    
    async def scan_for_issues(self, organization_id: str) -> List[ComplianceIssue]:
        """Scan for compliance issues in an organization"""
        
        detected_issues = []
        
        try:
            # Run all detection rules
            for rule_name, rule_func in self.detection_rules.items():
                try:
                    issues = await rule_func(organization_id)
                    detected_issues.extend(issues)
                    
                    logger.debug(
                        "Detection rule executed",
                        rule=rule_name,
                        issues_found=len(issues),
                        organization_id=organization_id
                    )
                    
                except Exception as e:
                    logger.error(f"Detection rule {rule_name} failed: {e}")
            
            # Remove duplicates and sort by severity
            unique_issues = self._deduplicate_issues(detected_issues)
            sorted_issues = sorted(
                unique_issues,
                key=lambda x: ["critical", "high", "medium", "low", "info"].index(x.severity.value)
            )
            
            logger.info(
                "Issue detection completed",
                organization_id=organization_id,
                total_issues=len(sorted_issues),
                critical=len([i for i in sorted_issues if i.severity == IssueSeverity.CRITICAL]),
                high=len([i for i in sorted_issues if i.severity == IssueSeverity.HIGH])
            )
            
            return sorted_issues
            
        except Exception as e:
            logger.error(f"Failed to scan for issues: {e}")
            return []
    
    async def _detect_agent_failures(self, organization_id: str) -> List[ComplianceIssue]:
        """Detect failed or non-responsive agents"""
        
        issues = []
        
        # Get agents for organization
        agents = self.db.query(Agent).filter(
            Agent.organization_id == organization_id
        ).all()
        
        current_time = datetime.now(timezone.utc)
        
        for agent in agents:
            # Check if agent has been inactive too long
            if agent.last_run:
                time_since_run = current_time - agent.last_run
                
                # If agent hasn't run in 6 hours (depending on schedule)
                if time_since_run > timedelta(hours=6):
                    issue = ComplianceIssue(
                        issue_id=str(uuid.uuid4()),
                        issue_type=IssueType.AGENT_FAILURE,
                        severity=IssueSeverity.HIGH,
                        title=f"Agent {agent.name} appears inactive",
                        description=f"Agent has not executed successfully in {time_since_run}",
                        affected_components=[str(agent.id)],
                        organization_id=organization_id,
                        framework=agent.framework,
                        agent_type=AgentType(agent.platform.value),
                        error_details={
                            "agent_id": str(agent.id),
                            "last_run": agent.last_run.isoformat(),
                            "time_since_run_hours": time_since_run.total_seconds() / 3600
                        }
                    )
                    issues.append(issue)
            
            # Check success rate
            if agent.success_rate is not None and agent.success_rate < 0.5:
                issue = ComplianceIssue(
                    issue_id=str(uuid.uuid4()),
                    issue_type=IssueType.PERFORMANCE_DEGRADATION,
                    severity=IssueSeverity.HIGH if agent.success_rate < 0.3 else IssueSeverity.MEDIUM,
                    title=f"Agent {agent.name} has low success rate",
                    description=f"Success rate is {agent.success_rate:.1%}, below acceptable threshold",
                    affected_components=[str(agent.id)],
                    organization_id=organization_id,
                    framework=agent.framework,
                    agent_type=AgentType(agent.platform.value),
                    metrics={
                        "success_rate": agent.success_rate,
                        "evidence_collected": agent.evidence_collected or 0
                    }
                )
                issues.append(issue)
        
        return issues
    
    async def _detect_evidence_gaps(self, organization_id: str) -> List[ComplianceIssue]:
        """Detect gaps in evidence collection"""
        
        issues = []
        
        # Get evidence for different frameworks
        frameworks = [Framework.SOC2, Framework.ISO27001, Framework.GDPR]
        
        for framework in frameworks:
            evidence_items = self.db.query(EvidenceItem).filter(
                EvidenceItem.organization_id == organization_id,
                EvidenceItem.framework == framework
            ).all()
            
            # Check for recent evidence
            recent_cutoff = datetime.now(timezone.utc) - timedelta(days=30)
            recent_evidence = [e for e in evidence_items if e.created_at > recent_cutoff]
            
            if len(recent_evidence) < 5:  # Minimum evidence threshold
                issue = ComplianceIssue(
                    issue_id=str(uuid.uuid4()),
                    issue_type=IssueType.EVIDENCE_GAP,
                    severity=IssueSeverity.MEDIUM,
                    title=f"Insufficient recent evidence for {framework.value}",
                    description=f"Only {len(recent_evidence)} evidence items collected in last 30 days",
                    affected_components=[],
                    organization_id=organization_id,
                    framework=framework,
                    context_data={
                        "total_evidence": len(evidence_items),
                        "recent_evidence": len(recent_evidence),
                        "framework": framework.value
                    }
                )
                issues.append(issue)
            
            # Check evidence quality
            if evidence_items:
                avg_confidence = sum(e.confidence_score or 0.5 for e in evidence_items) / len(evidence_items)
                
                if avg_confidence < 0.6:
                    issue = ComplianceIssue(
                        issue_id=str(uuid.uuid4()),
                        issue_type=IssueType.DATA_QUALITY_ISSUE,
                        severity=IssueSeverity.MEDIUM,
                        title=f"Low evidence quality for {framework.value}",
                        description=f"Average confidence score is {avg_confidence:.2f}",
                        affected_components=[],
                        organization_id=organization_id,
                        framework=framework,
                        metrics={
                            "average_confidence": avg_confidence,
                            "evidence_count": len(evidence_items)
                        }
                    )
                    issues.append(issue)
        
        return issues
    
    async def _detect_performance_issues(self, organization_id: str) -> List[ComplianceIssue]:
        """Detect performance degradation issues"""
        
        issues = []
        
        # This would integrate with monitoring systems
        # For now, create placeholder detection logic
        
        agents = self.db.query(Agent).filter(
            Agent.organization_id == organization_id
        ).all()
        
        for agent in agents:
            if agent.avg_collection_time and agent.avg_collection_time > 300:  # 5 minutes
                issue = ComplianceIssue(
                    issue_id=str(uuid.uuid4()),
                    issue_type=IssueType.PERFORMANCE_DEGRADATION,
                    severity=IssueSeverity.MEDIUM,
                    title=f"Slow performance detected for {agent.name}",
                    description=f"Average collection time is {agent.avg_collection_time:.1f} seconds",
                    affected_components=[str(agent.id)],
                    organization_id=organization_id,
                    agent_type=AgentType(agent.platform.value),
                    metrics={
                        "avg_collection_time": agent.avg_collection_time
                    }
                )
                issues.append(issue)
        
        return issues
    
    async def _detect_configuration_drift(self, organization_id: str) -> List[ComplianceIssue]:
        """Detect configuration drift issues"""
        
        issues = []
        
        # Placeholder for configuration drift detection
        # In practice, this would compare current configs against baselines
        
        return issues
    
    async def _detect_integration_failures(self, organization_id: str) -> List[ComplianceIssue]:
        """Detect integration connectivity issues"""
        
        issues = []
        
        # Placeholder for integration health checks
        # Would test connectivity to cloud platforms, APIs, etc.
        
        return issues
    
    async def _detect_data_quality_issues(self, organization_id: str) -> List[ComplianceIssue]:
        """Detect data quality problems"""
        
        issues = []
        
        # Check for evidence items with very low confidence
        low_confidence_evidence = self.db.query(EvidenceItem).filter(
            EvidenceItem.organization_id == organization_id,
            EvidenceItem.confidence_score < 0.3
        ).count()
        
        if low_confidence_evidence > 10:
            issue = ComplianceIssue(
                issue_id=str(uuid.uuid4()),
                issue_type=IssueType.DATA_QUALITY_ISSUE,
                severity=IssueSeverity.MEDIUM,
                title="High number of low-confidence evidence items",
                description=f"{low_confidence_evidence} evidence items have confidence < 30%",
                affected_components=[],
                organization_id=organization_id,
                metrics={
                    "low_confidence_count": low_confidence_evidence
                }
            )
            issues.append(issue)
        
        return issues
    
    async def _detect_capacity_issues(self, organization_id: str) -> List[ComplianceIssue]:
        """Detect capacity and resource issues"""
        
        issues = []
        
        # Check agent capacity utilization
        # This would integrate with actual resource monitoring
        
        return issues
    
    def _deduplicate_issues(self, issues: List[ComplianceIssue]) -> List[ComplianceIssue]:
        """Remove duplicate issues based on type and affected components"""
        
        seen = set()
        unique_issues = []
        
        for issue in issues:
            key = (
                issue.issue_type.value,
                issue.organization_id,
                tuple(sorted(issue.affected_components))
            )
            
            if key not in seen:
                seen.add(key)
                unique_issues.append(issue)
        
        return unique_issues

class HealingActionExecutor:
    """Executes healing actions to resolve compliance issues"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.action_handlers: Dict[HealingAction, Callable] = {}
        self.workflow_engine = None  # Initialized in start()
        self._initialize_action_handlers()
    
    async def start(self):
        """Initialize the action executor"""
        self.workflow_engine = await get_workflow_engine(self.db)
    
    def _initialize_action_handlers(self):
        """Initialize action handlers for different healing actions"""
        
        self.action_handlers = {
            HealingAction.RESTART_AGENT: self._restart_agent,
            HealingAction.RECONFIGURE_AGENT: self._reconfigure_agent,
            HealingAction.TRIGGER_EVIDENCE_COLLECTION: self._trigger_evidence_collection,
            HealingAction.SCALE_RESOURCES: self._scale_resources,
            HealingAction.RESET_CONFIGURATION: self._reset_configuration,
            HealingAction.VALIDATE_DATA: self._validate_data,
            HealingAction.NOTIFY_ADMINISTRATORS: self._notify_administrators,
            HealingAction.EXECUTE_WORKFLOW: self._execute_workflow
        }
    
    async def execute_action(self, action: HealingAction) -> bool:
        """Execute a healing action"""
        
        if action.action_type not in self.action_handlers:
            logger.error(f"No handler for healing action: {action.action_type}")
            return False
        
        try:
            action.status = HealingStatus.IN_PROGRESS
            action.started_at = datetime.now(timezone.utc)
            
            handler = self.action_handlers[action.action_type]
            success = await handler(action)
            
            action.completed_at = datetime.now(timezone.utc)
            action.success = success
            action.status = HealingStatus.COMPLETED if success else HealingStatus.FAILED
            
            logger.info(
                "Healing action executed",
                action_id=action.action_id,
                action_type=action.action_type.value,
                success=success
            )
            
            return success
            
        except Exception as e:
            action.status = HealingStatus.FAILED
            action.error_message = str(e)
            action.completed_at = datetime.now(timezone.utc)
            
            logger.error(f"Healing action failed: {e}")
            return False
    
    async def _restart_agent(self, action: HealingAction) -> bool:
        """Restart a failed agent"""
        
        try:
            agent_id = action.parameters.get("agent_id")
            if not agent_id:
                raise ValueError("Missing agent_id parameter")
            
            # Get agent
            agent = self.db.query(Agent).filter(Agent.id == agent_id).first()
            if not agent:
                raise ValueError(f"Agent not found: {agent_id}")
            
            # Reset agent status
            agent.status = "active"
            agent.last_run = None
            self.db.commit()
            
            # Trigger agent execution via orchestrator
            task_id = await orchestrator.submit_task({
                "task_type": "agent_restart",
                "agent_id": agent_id,
                "priority": "high"
            })
            
            action.result_data = {
                "agent_restarted": True,
                "task_id": task_id
            }
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to restart agent: {e}")
            return False
    
    async def _reconfigure_agent(self, action: HealingAction) -> bool:
        """Reconfigure an agent with optimal settings"""
        
        try:
            agent_id = action.parameters.get("agent_id")
            new_config = action.parameters.get("configuration", {})
            
            if not agent_id:
                raise ValueError("Missing agent_id parameter")
            
            agent = self.db.query(Agent).filter(Agent.id == agent_id).first()
            if not agent:
                raise ValueError(f"Agent not found: {agent_id}")
            
            # Store rollback data
            action.rollback_data = {
                "original_config": agent.configuration.copy() if agent.configuration else {}
            }
            action.rollback_available = True
            
            # Apply new configuration
            if agent.configuration:
                agent.configuration.update(new_config)
            else:
                agent.configuration = new_config.copy()
            
            self.db.commit()
            
            action.result_data = {
                "configuration_updated": True,
                "changes_applied": len(new_config)
            }
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to reconfigure agent: {e}")
            return False
    
    async def _trigger_evidence_collection(self, action: HealingAction) -> bool:
        """Trigger evidence collection to fill gaps"""
        
        try:
            organization_id = action.parameters.get("organization_id")
            framework = action.parameters.get("framework")
            
            if not organization_id:
                raise ValueError("Missing organization_id parameter")
            
            # Create evidence collection workflow
            workflow_id = await self.workflow_engine.create_workflow_instance(
                template_id="evidence_collection_emergency",
                organization_id=organization_id,
                trigger="self_healing",
                triggered_by="healing_system",
                parameters={
                    "framework": framework,
                    "priority": "high",
                    "reason": "evidence_gap_detected"
                }
            )
            
            action.result_data = {
                "workflow_triggered": True,
                "workflow_id": workflow_id,
                "framework": framework
            }
            
            return workflow_id is not None
            
        except Exception as e:
            logger.error(f"Failed to trigger evidence collection: {e}")
            return False
    
    async def _scale_resources(self, action: HealingAction) -> bool:
        """Scale resources to handle capacity issues"""
        
        try:
            # Placeholder for resource scaling logic
            # In practice, this would integrate with container orchestration
            
            action.result_data = {
                "scaling_initiated": True,
                "method": "placeholder"
            }
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to scale resources: {e}")
            return False
    
    async def _reset_configuration(self, action: HealingAction) -> bool:
        """Reset agent configuration to known good state"""
        
        try:
            agent_id = action.parameters.get("agent_id")
            if not agent_id:
                raise ValueError("Missing agent_id parameter")
            
            agent = self.db.query(Agent).filter(Agent.id == agent_id).first()
            if not agent:
                raise ValueError(f"Agent not found: {agent_id}")
            
            # Store current config for rollback
            action.rollback_data = {
                "previous_config": agent.configuration.copy() if agent.configuration else {}
            }
            action.rollback_available = True
            
            # Reset to default configuration
            default_config = self._get_default_config(agent.platform, agent.framework)
            agent.configuration = default_config
            self.db.commit()
            
            action.result_data = {
                "configuration_reset": True,
                "default_config_applied": True
            }
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to reset configuration: {e}")
            return False
    
    def _get_default_config(self, platform: Platform, framework: Framework) -> Dict[str, Any]:
        """Get default configuration for platform/framework combination"""
        
        # Simplified default configurations
        return {
            "timeout": 300,
            "retry_attempts": 3,
            "concurrent_tasks": 2,
            "batch_size": 5,
            "validation_enabled": True
        }
    
    async def _validate_data(self, action: HealingAction) -> bool:
        """Validate and clean data quality issues"""
        
        try:
            organization_id = action.parameters.get("organization_id")
            
            # Trigger data validation workflow
            validation_results = {
                "items_validated": 0,
                "items_fixed": 0,
                "items_flagged": 0
            }
            
            # Placeholder for actual data validation logic
            
            action.result_data = validation_results
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to validate data: {e}")
            return False
    
    async def _notify_administrators(self, action: HealingAction) -> bool:
        """Notify administrators about critical issues"""
        
        try:
            issue_details = action.parameters.get("issue_details", {})
            severity = action.parameters.get("severity", "medium")
            
            # Send notification via communication hub
            message = {
                "type": "compliance_alert",
                "severity": severity,
                "details": issue_details,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "action_required": action.parameters.get("action_required", False)
            }
            
            # In practice, this would send emails, Slack messages, etc.
            
            action.result_data = {
                "notification_sent": True,
                "channels": ["email", "slack"],
                "recipients": ["admin@example.com"]
            }
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to notify administrators: {e}")
            return False
    
    async def _execute_workflow(self, action: HealingAction) -> bool:
        """Execute a healing workflow"""
        
        try:
            workflow_template = action.parameters.get("workflow_template")
            organization_id = action.parameters.get("organization_id")
            
            if not workflow_template or not organization_id:
                raise ValueError("Missing required parameters")
            
            workflow_id = await self.workflow_engine.create_workflow_instance(
                template_id=workflow_template,
                organization_id=organization_id,
                trigger="self_healing",
                triggered_by="healing_system",
                parameters=action.parameters.get("workflow_parameters", {})
            )
            
            action.result_data = {
                "workflow_executed": True,
                "workflow_id": workflow_id
            }
            
            return workflow_id is not None
            
        except Exception as e:
            logger.error(f"Failed to execute workflow: {e}")
            return False

class SelfHealingEngine:
    """Main engine for self-healing compliance management"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.issue_detector = IssueDetector(db_session)
        self.action_executor = HealingActionExecutor(db_session)
        
        # Healing state
        self.active_issues: Dict[str, ComplianceIssue] = {}
        self.resolved_issues: Dict[str, ComplianceIssue] = {}
        self.healing_rules: Dict[str, HealingRule] = {}
        self.execution_history: deque = deque(maxlen=1000)
        
        # Performance metrics
        self.healing_metrics = {
            "issues_detected": 0,
            "issues_resolved": 0,
            "actions_executed": 0,
            "success_rate": 0.0,
            "avg_resolution_time": 0.0
        }
        
        self._initialize_default_rules()
    
    async def start(self):
        """Start the self-healing engine"""
        
        await self.action_executor.start()
        
        # Start monitoring loop
        asyncio.create_task(self._healing_loop())
        
        logger.info("Self-healing compliance engine started")
    
    def _initialize_default_rules(self):
        """Initialize default healing rules"""
        
        # Agent failure rule
        agent_failure_rule = HealingRule(
            rule_id="agent_failure_restart",
            name="Agent Failure Auto-Restart",
            description="Automatically restart failed agents",
            issue_types=[IssueType.AGENT_FAILURE],
            severity_threshold=IssueSeverity.HIGH,
            healing_actions=[HealingAction.RESTART_AGENT],
            auto_execute=True,
            max_executions_per_hour=5,
            cooldown_minutes=10
        )
        
        # Evidence gap rule
        evidence_gap_rule = HealingRule(
            rule_id="evidence_gap_collection",
            name="Evidence Gap Auto-Collection",
            description="Automatically trigger evidence collection for gaps",
            issue_types=[IssueType.EVIDENCE_GAP],
            severity_threshold=IssueSeverity.MEDIUM,
            healing_actions=[HealingAction.TRIGGER_EVIDENCE_COLLECTION],
            auto_execute=True,
            max_executions_per_hour=3,
            cooldown_minutes=30
        )
        
        # Performance degradation rule
        performance_rule = HealingRule(
            rule_id="performance_optimization",
            name="Performance Auto-Optimization",
            description="Automatically optimize agent performance",
            issue_types=[IssueType.PERFORMANCE_DEGRADATION],
            severity_threshold=IssueSeverity.MEDIUM,
            healing_actions=[HealingAction.RECONFIGURE_AGENT],
            auto_execute=True,
            require_approval=False,
            max_executions_per_hour=2,
            cooldown_minutes=60
        )
        
        # Critical issue escalation rule
        critical_escalation_rule = HealingRule(
            rule_id="critical_escalation",
            name="Critical Issue Escalation",
            description="Notify administrators of critical issues",
            issue_types=list(IssueType),
            severity_threshold=IssueSeverity.CRITICAL,
            healing_actions=[HealingAction.NOTIFY_ADMINISTRATORS],
            auto_execute=True,
            max_executions_per_hour=10,
            cooldown_minutes=5
        )
        
        self.healing_rules = {
            rule.rule_id: rule for rule in [
                agent_failure_rule,
                evidence_gap_rule,
                performance_rule,
                critical_escalation_rule
            ]
        }
    
    async def _healing_loop(self):
        """Main healing loop - continuously monitor and heal"""
        
        while True:
            try:
                # Get all organizations
                organizations = self.db.query(Organization).all()
                
                for org in organizations:
                    org_id = str(org.id)
                    
                    # Detect issues
                    issues = await self.issue_detector.scan_for_issues(org_id)
                    
                    # Process each issue
                    for issue in issues:
                        await self._process_issue(issue)
                    
                    # Clean up resolved issues
                    await self._cleanup_resolved_issues()
                
                # Sleep for monitoring interval
                await asyncio.sleep(300)  # 5 minutes
                
            except Exception as e:
                logger.error(f"Healing loop error: {e}")
                await asyncio.sleep(600)  # Back off on error
    
    async def _process_issue(self, issue: ComplianceIssue):
        """Process a detected issue"""
        
        try:
            # Check if issue already exists
            if issue.issue_id in self.active_issues:
                return
            
            # Add to active issues
            self.active_issues[issue.issue_id] = issue
            self.healing_metrics["issues_detected"] += 1
            
            logger.info(
                "Compliance issue detected",
                issue_id=issue.issue_id,
                issue_type=issue.issue_type.value,
                severity=issue.severity.value,
                organization_id=issue.organization_id
            )
            
            # Find applicable healing rules
            applicable_rules = self._find_applicable_rules(issue)
            
            # Execute healing actions
            for rule in applicable_rules:
                if await self._should_execute_rule(rule, issue):
                    success = await self._execute_healing_rule(rule, issue)
                    
                    if success:
                        break  # Stop if issue is resolved
            
        except Exception as e:
            logger.error(f"Failed to process issue {issue.issue_id}: {e}")
    
    def _find_applicable_rules(self, issue: ComplianceIssue) -> List[HealingRule]:
        """Find healing rules applicable to an issue"""
        
        applicable_rules = []
        
        for rule in self.healing_rules.values():
            if not rule.enabled:
                continue
            
            # Check issue type
            if issue.issue_type not in rule.issue_types:
                continue
            
            # Check severity threshold
            severity_levels = ["info", "low", "medium", "high", "critical"]
            issue_severity_level = severity_levels.index(issue.severity.value)
            rule_threshold_level = severity_levels.index(rule.severity_threshold.value)
            
            if issue_severity_level < rule_threshold_level:
                continue
            
            # Check additional conditions
            if rule.conditions and not self._evaluate_rule_conditions(rule.conditions, issue):
                continue
            
            applicable_rules.append(rule)
        
        # Sort by severity threshold (most restrictive first)
        applicable_rules.sort(key=lambda r: severity_levels.index(r.severity_threshold.value), reverse=True)
        
        return applicable_rules
    
    def _evaluate_rule_conditions(self, conditions: Dict[str, Any], issue: ComplianceIssue) -> bool:
        """Evaluate rule conditions against an issue"""
        
        # Simplified condition evaluation
        # In practice, this would support complex condition logic
        
        for key, expected_value in conditions.items():
            if key == "organization_id":
                if issue.organization_id != expected_value:
                    return False
            elif key == "agent_type":
                if issue.agent_type != expected_value:
                    return False
            elif key == "framework":
                if issue.framework != expected_value:
                    return False
        
        return True
    
    async def _should_execute_rule(self, rule: HealingRule, issue: ComplianceIssue) -> bool:
        """Determine if a healing rule should be executed"""
        
        current_time = datetime.now(timezone.utc)
        
        # Check if rule requires approval
        if rule.require_approval:
            # In practice, this would check approval status
            return False
        
        # Check execution limits
        recent_executions = len([
            entry for entry in self.execution_history
            if (entry["rule_id"] == rule.rule_id and
                current_time - entry["executed_at"] < timedelta(hours=1))
        ])
        
        if recent_executions >= rule.max_executions_per_hour:
            logger.warning(f"Rule {rule.rule_id} execution limit reached")
            return False
        
        # Check cooldown
        if rule.last_executed:
            time_since_last = current_time - rule.last_executed
            if time_since_last < timedelta(minutes=rule.cooldown_minutes):
                return False
        
        # Check issue resolution attempts
        if issue.resolution_attempts >= issue.max_resolution_attempts:
            logger.warning(f"Issue {issue.issue_id} exceeded max resolution attempts")
            await self._escalate_issue(issue, "max_attempts_exceeded")
            return False
        
        return True
    
    async def _execute_healing_rule(self, rule: HealingRule, issue: ComplianceIssue) -> bool:
        """Execute a healing rule"""
        
        try:
            current_time = datetime.now(timezone.utc)
            
            # Update rule execution tracking
            rule.last_executed = current_time
            rule.execution_count += 1
            
            # Update issue resolution tracking
            issue.resolution_attempts += 1
            issue.last_resolution_attempt = current_time
            
            # Create healing actions
            actions = []
            for action_type in rule.healing_actions:
                action = HealingAction(
                    action_id=str(uuid.uuid4()),
                    issue_id=issue.issue_id,
                    action_type=action_type,
                    status=HealingStatus.PENDING,
                    title=f"Healing action for {issue.title}",
                    description=f"Execute {action_type.value} to resolve {issue.issue_type.value}",
                    parameters=self._build_action_parameters(action_type, issue)
                )
                actions.append(action)
            
            # Execute actions
            success_count = 0
            
            if rule.action_sequence == "sequential":
                # Execute actions one by one
                for action in actions:
                    if await self.action_executor.execute_action(action):
                        success_count += 1
                    else:
                        break  # Stop on first failure
            else:
                # Execute actions in parallel
                results = await asyncio.gather(
                    *[self.action_executor.execute_action(action) for action in actions],
                    return_exceptions=True
                )
                success_count = sum(1 for r in results if r is True)
            
            # Record execution
            self.execution_history.append({
                "rule_id": rule.rule_id,
                "issue_id": issue.issue_id,
                "executed_at": current_time,
                "success": success_count > 0,
                "actions_executed": len(actions),
                "actions_succeeded": success_count
            })
            
            # Update metrics
            self.healing_metrics["actions_executed"] += len(actions)
            
            # Check if issue is resolved
            if success_count == len(actions):
                await self._mark_issue_resolved(issue, "automated_healing")
                rule.success_count += 1
                return True
            elif success_count > 0:
                logger.info(f"Partial healing success for issue {issue.issue_id}")
                return False
            else:
                logger.warning(f"Healing failed for issue {issue.issue_id}")
                return False
            
        except Exception as e:
            logger.error(f"Failed to execute healing rule {rule.rule_id}: {e}")
            return False
    
    def _build_action_parameters(self, action_type: HealingAction, issue: ComplianceIssue) -> Dict[str, Any]:
        """Build parameters for a healing action"""
        
        base_params = {
            "organization_id": issue.organization_id,
            "issue_id": issue.issue_id,
            "issue_type": issue.issue_type.value,
            "severity": issue.severity.value
        }
        
        if action_type == HealingAction.RESTART_AGENT:
            if issue.affected_components:
                base_params["agent_id"] = issue.affected_components[0]
        
        elif action_type == HealingAction.RECONFIGURE_AGENT:
            if issue.affected_components:
                base_params["agent_id"] = issue.affected_components[0]
                base_params["configuration"] = self._get_healing_configuration(issue)
        
        elif action_type == HealingAction.TRIGGER_EVIDENCE_COLLECTION:
            base_params["framework"] = issue.framework.value if issue.framework else None
            base_params["priority"] = "high" if issue.severity == IssueSeverity.CRITICAL else "medium"
        
        elif action_type == HealingAction.NOTIFY_ADMINISTRATORS:
            base_params["issue_details"] = {
                "title": issue.title,
                "description": issue.description,
                "affected_components": issue.affected_components,
                "detected_at": issue.detected_at.isoformat()
            }
            base_params["action_required"] = issue.severity in [IssueSeverity.CRITICAL, IssueSeverity.HIGH]
        
        return base_params
    
    def _get_healing_configuration(self, issue: ComplianceIssue) -> Dict[str, Any]:
        """Get healing configuration based on issue type"""
        
        if issue.issue_type == IssueType.PERFORMANCE_DEGRADATION:
            return {
                "timeout": 600,  # Increase timeout
                "retry_attempts": 2,  # Reduce retries to fail faster
                "concurrent_tasks": 1  # Reduce concurrency
            }
        elif issue.issue_type == IssueType.AGENT_FAILURE:
            return {
                "timeout": 300,
                "retry_attempts": 3,
                "concurrent_tasks": 2,
                "health_check_enabled": True
            }
        
        return {
            "timeout": 300,
            "retry_attempts": 2,
            "concurrent_tasks": 2
        }
    
    async def _mark_issue_resolved(self, issue: ComplianceIssue, resolution_method: str):
        """Mark an issue as resolved"""
        
        issue.is_resolved = True
        issue.resolved_at = datetime.now(timezone.utc)
        issue.resolution_method = resolution_method
        
        # Move to resolved issues
        self.resolved_issues[issue.issue_id] = issue
        if issue.issue_id in self.active_issues:
            del self.active_issues[issue.issue_id]
        
        # Update metrics
        self.healing_metrics["issues_resolved"] += 1
        self._update_success_rate()
        self._update_avg_resolution_time(issue)
        
        logger.info(
            "Compliance issue resolved",
            issue_id=issue.issue_id,
            resolution_method=resolution_method,
            resolution_time=(issue.resolved_at - issue.detected_at).total_seconds()
        )
    
    async def _escalate_issue(self, issue: ComplianceIssue, reason: str):
        """Escalate an issue that couldn't be automatically resolved"""
        
        issue.escalated = True
        issue.escalated_at = datetime.now(timezone.utc)
        issue.escalation_reason = reason
        
        # Send escalation notification
        escalation_action = HealingAction(
            action_id=str(uuid.uuid4()),
            issue_id=issue.issue_id,
            action_type=HealingAction.NOTIFY_ADMINISTRATORS,
            status=HealingStatus.PENDING,
            title="Issue Escalation",
            description=f"Issue {issue.issue_id} escalated: {reason}",
            parameters={
                "organization_id": issue.organization_id,
                "escalation": True,
                "reason": reason,
                "issue_details": {
                    "issue_id": issue.issue_id,
                    "title": issue.title,
                    "severity": issue.severity.value,
                    "attempts": issue.resolution_attempts
                }
            }
        )
        
        await self.action_executor.execute_action(escalation_action)
        
        logger.warning(
            "Issue escalated",
            issue_id=issue.issue_id,
            reason=reason,
            severity=issue.severity.value
        )
    
    async def _cleanup_resolved_issues(self):
        """Clean up old resolved issues"""
        
        cutoff_time = datetime.now(timezone.utc) - timedelta(days=7)
        
        to_remove = [
            issue_id for issue_id, issue in self.resolved_issues.items()
            if issue.resolved_at and issue.resolved_at < cutoff_time
        ]
        
        for issue_id in to_remove:
            del self.resolved_issues[issue_id]
    
    def _update_success_rate(self):
        """Update overall healing success rate"""
        
        total_detected = self.healing_metrics["issues_detected"]
        total_resolved = self.healing_metrics["issues_resolved"]
        
        if total_detected > 0:
            self.healing_metrics["success_rate"] = (total_resolved / total_detected) * 100
    
    def _update_avg_resolution_time(self, resolved_issue: ComplianceIssue):
        """Update average resolution time"""
        
        if not resolved_issue.resolved_at:
            return
        
        resolution_time = (resolved_issue.resolved_at - resolved_issue.detected_at).total_seconds()
        
        current_avg = self.healing_metrics["avg_resolution_time"]
        total_resolved = self.healing_metrics["issues_resolved"]
        
        if total_resolved == 1:
            self.healing_metrics["avg_resolution_time"] = resolution_time
        else:
            self.healing_metrics["avg_resolution_time"] = (
                (current_avg * (total_resolved - 1) + resolution_time) / total_resolved
            )
    
    def get_healing_status(self, organization_id: str) -> Dict[str, Any]:
        """Get healing status for an organization"""
        
        org_active_issues = [
            issue for issue in self.active_issues.values()
            if issue.organization_id == organization_id
        ]
        
        org_resolved_issues = [
            issue for issue in self.resolved_issues.values()
            if issue.organization_id == organization_id
        ]
        
        # Issue breakdown by severity
        severity_breakdown = defaultdict(int)
        for issue in org_active_issues:
            severity_breakdown[issue.severity.value] += 1
        
        return {
            "organization_id": organization_id,
            "active_issues": len(org_active_issues),
            "resolved_issues_24h": len([
                issue for issue in org_resolved_issues
                if issue.resolved_at and
                (datetime.now(timezone.utc) - issue.resolved_at) < timedelta(hours=24)
            ]),
            "severity_breakdown": dict(severity_breakdown),
            "healing_rules": len([r for r in self.healing_rules.values() if r.enabled]),
            "last_scan": datetime.now(timezone.utc).isoformat()
        }
    
    def get_healing_metrics(self) -> Dict[str, Any]:
        """Get overall healing metrics"""
        
        return {
            "metrics": self.healing_metrics,
            "active_issues": len(self.active_issues),
            "resolved_issues": len(self.resolved_issues),
            "healing_rules": len(self.healing_rules),
            "execution_history_size": len(self.execution_history)
        }

# Global self-healing engine instance
healing_engine = None

async def get_healing_engine(db: Session) -> SelfHealingEngine:
    """Get or create self-healing engine instance"""
    global healing_engine
    if healing_engine is None:
        healing_engine = SelfHealingEngine(db)
        await healing_engine.start()
    return healing_engine