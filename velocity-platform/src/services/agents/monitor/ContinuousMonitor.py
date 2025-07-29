#!/usr/bin/env python3
"""
Continuous Monitor Agent - Velocity.ai Multi-Agent System
Real-time Compliance Monitoring and Drift Detection

This agent provides continuous monitoring of compliance posture across all
integrated systems, detecting configuration drift, policy changes, and
compliance violations in real-time with automated remediation capabilities.
"""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional, Set, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from enum import Enum
import statistics
import hashlib

from ..core.base_agent import BaseAgent, AgentConfig, TaskResult, Evidence
from ..core.agent_types import AgentType, TaskPriority
from ...database.evidence_store import EvidenceStore

# Configure logging
logger = logging.getLogger(__name__)

class MonitoringLevel(Enum):
    """Monitoring sensitivity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ComplianceStatus(Enum):
    """Compliance status types"""
    COMPLIANT = "compliant"
    NON_COMPLIANT = "non_compliant"
    DEGRADED = "degraded"
    UNKNOWN = "unknown"

@dataclass
class MonitoringRule:
    """Monitoring rule definition"""
    rule_id: str
    name: str
    description: str
    framework: str
    category: str
    severity: MonitoringLevel
    check_interval_seconds: int
    enabled: bool
    conditions: Dict[str, Any]
    remediation_actions: List[str]
    alert_thresholds: Dict[str, float]

@dataclass
class ComplianceViolation:
    """Compliance violation record"""
    violation_id: str
    rule_id: str
    entity_id: str
    entity_type: str
    violation_type: str
    severity: MonitoringLevel
    detected_at: datetime
    description: str
    current_value: Any
    expected_value: Any
    remediation_suggested: List[str]
    auto_remediable: bool

@dataclass
class DriftEvent:
    """Configuration drift event"""
    drift_id: str
    entity_id: str
    entity_type: str
    property_path: str
    previous_value: Any
    current_value: Any
    detected_at: datetime
    drift_magnitude: float
    impact_assessment: str

class ContinuousMonitorConfig(AgentConfig):
    """Configuration for Continuous Monitor Agent"""
    
    def __init__(self):
        super().__init__(
            agent_id="continuous-monitor",
            name="Continuous Monitor",
            agent_type=AgentType.MONITORING,
            description="Real-time compliance monitoring and drift detection",
            capabilities=[
                "real_time_monitoring",
                "drift_detection",
                "compliance_validation",
                "automated_remediation",
                "alert_management",
                "trend_analysis"
            ],
            required_permissions=[
                "monitor:read",
                "compliance:validate",
                "evidence:analyze",
                "alerts:create",
                "remediation:suggest"
            ],
            max_concurrent_tasks=20,  # High concurrency for monitoring
            task_timeout=60,  # 1 minute per monitoring task
            priority=TaskPriority.HIGH
        )
        
        # Monitoring configuration
        self.default_check_interval = 300  # 5 minutes
        self.drift_detection_threshold = 0.1  # 10% change threshold
        self.supported_frameworks = [
            "SOC2", "ISO27001", "GDPR", "HIPAA", "PCI_DSS", "NIST"
        ]
        
        # Alert configuration
        self.alert_cooldown_seconds = 3600  # 1 hour cooldown per rule
        self.max_alerts_per_hour = 50
        self.escalation_thresholds = {
            MonitoringLevel.LOW: timedelta(hours=24),
            MonitoringLevel.MEDIUM: timedelta(hours=4),
            MonitoringLevel.HIGH: timedelta(hours=1),
            MonitoringLevel.CRITICAL: timedelta(minutes=15)
        }

class ContinuousMonitor(BaseAgent):
    """
    Continuous Monitor Agent
    
    Provides real-time monitoring of compliance posture with drift detection,
    automated alerting, and remediation suggestions.
    """
    
    def __init__(self, config: ContinuousMonitorConfig):
        super().__init__(config)
        self.config = config
        self.evidence_store = EvidenceStore()
        
        # Monitoring state
        self.monitoring_rules: Dict[str, MonitoringRule] = {}
        self.active_violations: Dict[str, ComplianceViolation] = {}
        self.drift_events: Dict[str, DriftEvent] = {}
        self.entity_baselines: Dict[str, Dict[str, Any]] = {}
        self.alert_history: Dict[str, datetime] = {}
        
        # Performance metrics
        self.metrics = {
            "total_checks_performed": 0,
            "violations_detected": 0,
            "drift_events_detected": 0,
            "alerts_sent": 0,
            "auto_remediations_attempted": 0,
            "successful_remediations": 0,
            "average_check_time": 0.0,
            "monitoring_uptime": 0.0
        }
        
        # Monitoring tasks
        self.monitoring_tasks: Set[asyncio.Task] = set()
        self.monitoring_active = False
        
        logger.info(f"Continuous Monitor initialized: {self.config.agent_id}")
    
    async def start(self) -> bool:
        """Start the Continuous Monitor Agent"""
        try:
            await super().start()
            
            # Load monitoring rules
            await self._load_monitoring_rules()
            
            # Initialize entity baselines
            await self._initialize_baselines()
            
            # Start continuous monitoring
            await self._start_continuous_monitoring()
            
            logger.info("Continuous Monitor started successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start Continuous Monitor: {e}")
            return False
    
    async def stop(self) -> bool:
        """Stop the Continuous Monitor Agent"""
        try:
            # Stop monitoring tasks
            await self._stop_continuous_monitoring()
            
            # Log final metrics
            await self._log_monitoring_summary()
            
            await super().stop()
            logger.info("Continuous Monitor stopped successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error stopping Continuous Monitor: {e}")
            return False
    
    async def process_task(self, task_data: Dict[str, Any]) -> TaskResult:
        """Process monitoring tasks"""
        task_type = task_data.get("type")
        start_time = datetime.now()
        
        try:
            if task_type == "check_compliance":
                result = await self._check_compliance(task_data)
            elif task_type == "detect_drift":
                result = await self._detect_drift(task_data)
            elif task_type == "create_monitoring_rule":
                result = await self._create_monitoring_rule(task_data)
            elif task_type == "remediate_violation":
                result = await self._remediate_violation(task_data)
            elif task_type == "generate_monitoring_report":
                result = await self._generate_monitoring_report(task_data)
            elif task_type == "update_baselines":
                result = await self._update_baselines(task_data)
            else:
                return TaskResult(
                    success=False,
                    error=f"Unknown task type: {task_type}",
                    task_type=task_type
                )
            
            # Update metrics
            processing_time = (datetime.now() - start_time).total_seconds()
            await self._update_monitoring_metrics(processing_time)
            
            return result
            
        except Exception as e:
            logger.error(f"Monitoring task processing failed: {e}")
            return TaskResult(
                success=False,
                error=str(e),
                task_type=task_type,
                processing_time=(datetime.now() - start_time).total_seconds()
            )
    
    async def _check_compliance(self, task_data: Dict[str, Any]) -> TaskResult:
        """Check compliance against monitoring rules"""
        try:
            entity_id = task_data.get("entity_id")
            organization_id = task_data.get("organization_id")
            rule_ids = task_data.get("rule_ids", [])
            
            if not entity_id or not organization_id:
                raise ValueError("Missing required parameters: entity_id, organization_id")
            
            check_start = datetime.now()
            
            # Get current evidence for entity
            current_evidence = await self.evidence_store.get_evidence_for_entity(
                organization_id, entity_id
            )
            
            if not current_evidence:
                return TaskResult(
                    success=True,
                    data={
                        "entity_id": entity_id,
                        "compliance_status": ComplianceStatus.UNKNOWN.value,
                        "reason": "no_evidence_available",
                        "violations": [],
                        "recommendations": ["Collect evidence for this entity to enable compliance monitoring"]
                    },
                    task_type="check_compliance"
                )
            
            # Apply monitoring rules
            rules_to_check = rule_ids if rule_ids else list(self.monitoring_rules.keys())
            violations_found = []
            compliance_scores = []
            
            for rule_id in rules_to_check:
                if rule_id not in self.monitoring_rules:
                    continue
                
                rule = self.monitoring_rules[rule_id]
                if not rule.enabled:
                    continue
                
                # Apply rule conditions
                violation = await self._apply_monitoring_rule(rule, entity_id, current_evidence)
                if violation:
                    violations_found.append(violation)
                    
                    # Store violation
                    self.active_violations[violation.violation_id] = violation
                    
                    # Check if alert is needed
                    await self._process_violation_alert(violation, organization_id)
                else:
                    compliance_scores.append(1.0)  # Compliant
            
            # Calculate overall compliance status
            if not violations_found:
                compliance_status = ComplianceStatus.COMPLIANT
                overall_score = 1.0
            else:
                critical_violations = [v for v in violations_found if v.severity == MonitoringLevel.CRITICAL]
                high_violations = [v for v in violations_found if v.severity == MonitoringLevel.HIGH]
                
                if critical_violations:
                    compliance_status = ComplianceStatus.NON_COMPLIANT
                    overall_score = 0.0
                elif high_violations:
                    compliance_status = ComplianceStatus.DEGRADED
                    overall_score = 0.5
                else:
                    compliance_status = ComplianceStatus.DEGRADED
                    overall_score = 0.7
            
            check_time = (datetime.now() - check_start).total_seconds() * 1000
            
            # Create compliance check evidence
            evidence_content = {
                "entity_id": entity_id,
                "compliance_status": compliance_status.value,
                "overall_score": overall_score,
                "rules_checked": len(rules_to_check),
                "violations_count": len(violations_found),
                "violations": [asdict(v) for v in violations_found],
                "check_timestamp": datetime.now().isoformat(),
                "check_duration_ms": check_time
            }
            
            # Generate evidence hash
            evidence_hash = self._generate_evidence_hash(evidence_content)
            
            evidence = Evidence(
                source="continuous_monitor",
                evidence_type="compliance_check",
                content=evidence_content,
                confidence_score=0.9,
                collected_at=datetime.now(),
                hash_value=evidence_hash,
                metadata={
                    "agent_id": self.config.agent_id,
                    "check_type": "compliance_validation",
                    "rules_applied": len(rules_to_check),
                    "processing_time_ms": check_time
                }
            )
            
            # Store evidence
            evidence_id = await self.evidence_store.store_evidence(evidence, organization_id)
            
            # Update metrics
            self.metrics["total_checks_performed"] += 1
            self.metrics["violations_detected"] += len(violations_found)
            
            return TaskResult(
                success=True,
                data={
                    "entity_id": entity_id,
                    "compliance_status": compliance_status.value,
                    "overall_score": overall_score,
                    "violations": [asdict(v) for v in violations_found],
                    "rules_checked": len(rules_to_check),
                    "check_duration_ms": check_time,
                    "evidence_id": evidence_id,
                    "evidence_hash": evidence_hash
                },
                evidence=[evidence],
                task_type="check_compliance"
            )
            
        except Exception as e:
            logger.error(f"Compliance check failed: {e}")
            raise
    
    async def _detect_drift(self, task_data: Dict[str, Any]) -> TaskResult:
        """Detect configuration drift for entities"""
        try:
            entity_id = task_data.get("entity_id")
            organization_id = task_data.get("organization_id")
            
            if not entity_id or not organization_id:
                raise ValueError("Missing required parameters: entity_id, organization_id")
            
            drift_start = datetime.now()
            
            # Get current evidence
            current_evidence = await self.evidence_store.get_evidence_for_entity(
                organization_id, entity_id
            )
            
            if not current_evidence:
                return TaskResult(
                    success=True,
                    data={
                        "entity_id": entity_id,
                        "drift_events": [],
                        "message": "No evidence available for drift detection"
                    },
                    task_type="detect_drift"
                )
            
            # Get baseline for comparison
            baseline = self.entity_baselines.get(entity_id, {})
            if not baseline:
                # Initialize baseline with current state
                await self._create_baseline(entity_id, current_evidence)
                return TaskResult(
                    success=True,
                    data={
                        "entity_id": entity_id,
                        "drift_events": [],
                        "message": "Baseline created for future drift detection"
                    },
                    task_type="detect_drift"
                )
            
            # Detect drift events
            drift_events = []
            
            # Compare current evidence against baseline
            current_config = self._extract_configuration(current_evidence)
            baseline_config = baseline.get("configuration", {})
            
            for property_path, current_value in current_config.items():
                baseline_value = baseline_config.get(property_path)
                
                if baseline_value is None:
                    # New property detected
                    drift_event = DriftEvent(
                        drift_id=f"drift_{entity_id}_{property_path}_{int(datetime.now().timestamp())}",
                        entity_id=entity_id,
                        entity_type=self._get_entity_type(current_evidence),
                        property_path=property_path,
                        previous_value=None,
                        current_value=current_value,
                        detected_at=datetime.now(),
                        drift_magnitude=1.0,  # New property = 100% drift
                        impact_assessment="new_property_detected"
                    )
                    drift_events.append(drift_event)
                    
                elif self._values_differ(baseline_value, current_value):
                    # Property changed
                    drift_magnitude = self._calculate_drift_magnitude(baseline_value, current_value)
                    
                    if drift_magnitude >= self.config.drift_detection_threshold:
                        drift_event = DriftEvent(
                            drift_id=f"drift_{entity_id}_{property_path}_{int(datetime.now().timestamp())}",
                            entity_id=entity_id,
                            entity_type=self._get_entity_type(current_evidence),
                            property_path=property_path,
                            previous_value=baseline_value,
                            current_value=current_value,
                            detected_at=datetime.now(),
                            drift_magnitude=drift_magnitude,
                            impact_assessment=self._assess_drift_impact(property_path, drift_magnitude)
                        )
                        drift_events.append(drift_event)
            
            # Store drift events
            for drift_event in drift_events:
                self.drift_events[drift_event.drift_id] = drift_event
            
            drift_time = (datetime.now() - drift_start).total_seconds() * 1000
            
            # Create drift detection evidence
            evidence_content = {
                "entity_id": entity_id,
                "drift_events_detected": len(drift_events),
                "drift_events": [asdict(event) for event in drift_events],
                "baseline_timestamp": baseline.get("created_at"),
                "detection_timestamp": datetime.now().isoformat(),
                "detection_duration_ms": drift_time,
                "drift_threshold": self.config.drift_detection_threshold
            }
            
            evidence_hash = self._generate_evidence_hash(evidence_content)
            
            evidence = Evidence(
                source="continuous_monitor",
                evidence_type="drift_detection",
                content=evidence_content,
                confidence_score=0.85,
                collected_at=datetime.now(),
                hash_value=evidence_hash,
                metadata={
                    "agent_id": self.config.agent_id,
                    "detection_type": "configuration_drift",
                    "drift_events_count": len(drift_events)
                }
            )
            
            # Store evidence
            evidence_id = await self.evidence_store.store_evidence(evidence, organization_id)
            
            # Update metrics
            self.metrics["drift_events_detected"] += len(drift_events)
            
            return TaskResult(
                success=True,
                data={
                    "entity_id": entity_id,
                    "drift_events": [asdict(event) for event in drift_events],
                    "drift_events_count": len(drift_events),
                    "detection_duration_ms": drift_time,
                    "evidence_id": evidence_id,
                    "evidence_hash": evidence_hash
                },
                evidence=[evidence],
                task_type="detect_drift"
            )
            
        except Exception as e:
            logger.error(f"Drift detection failed: {e}")
            raise
    
    async def _create_monitoring_rule(self, task_data: Dict[str, Any]) -> TaskResult:
        """Create a new monitoring rule"""
        try:
            rule_data = task_data.get("rule")
            if not rule_data:
                raise ValueError("Missing rule data")
            
            # Create monitoring rule
            rule = MonitoringRule(
                rule_id=rule_data.get("rule_id", f"rule_{int(datetime.now().timestamp())}"),
                name=rule_data.get("name"),
                description=rule_data.get("description"),
                framework=rule_data.get("framework"),
                category=rule_data.get("category"),
                severity=MonitoringLevel(rule_data.get("severity", "medium")),
                check_interval_seconds=rule_data.get("check_interval_seconds", self.config.default_check_interval),
                enabled=rule_data.get("enabled", True),
                conditions=rule_data.get("conditions", {}),
                remediation_actions=rule_data.get("remediation_actions", []),
                alert_thresholds=rule_data.get("alert_thresholds", {})
            )
            
            # Store rule
            self.monitoring_rules[rule.rule_id] = rule
            
            # Start monitoring task for this rule if enabled
            if rule.enabled:
                await self._start_rule_monitoring(rule)
            
            return TaskResult(
                success=True,
                data={
                    "rule_id": rule.rule_id,
                    "rule": asdict(rule),
                    "status": "created_and_active" if rule.enabled else "created_inactive"
                },
                task_type="create_monitoring_rule"
            )
            
        except Exception as e:
            logger.error(f"Failed to create monitoring rule: {e}")
            raise
    
    async def _generate_monitoring_report(self, task_data: Dict[str, Any]) -> TaskResult:
        """Generate comprehensive monitoring report"""
        try:
            organization_id = task_data.get("organization_id")
            time_range_hours = task_data.get("time_range_hours", 24)
            
            if not organization_id:
                raise ValueError("Missing organization_id")
            
            report_start = datetime.now()
            end_time = report_start
            start_time = end_time - timedelta(hours=time_range_hours)
            
            # Get monitoring evidence from time range
            monitoring_evidence = await self.evidence_store.get_evidence_by_time_range(
                organization_id, start_time, end_time, evidence_type="compliance_check"
            )
            
            drift_evidence = await self.evidence_store.get_evidence_by_time_range(
                organization_id, start_time, end_time, evidence_type="drift_detection"
            )
            
            # Analyze monitoring data
            total_checks = len(monitoring_evidence)
            total_violations = sum(
                len(evidence.content.get("violations", []))
                for evidence in monitoring_evidence
            )
            
            total_drift_events = sum(
                evidence.content.get("drift_events_detected", 0)
                for evidence in drift_evidence
            )
            
            # Calculate compliance trends
            compliance_scores = []
            for evidence in monitoring_evidence:
                score = evidence.content.get("overall_score", 0)
                compliance_scores.append(score)
            
            avg_compliance = statistics.mean(compliance_scores) if compliance_scores else 0
            
            # Generate report
            monitoring_report = {
                "organization_id": organization_id,
                "report_period": {
                    "start_time": start_time.isoformat(),
                    "end_time": end_time.isoformat(),
                    "duration_hours": time_range_hours
                },
                "monitoring_summary": {
                    "total_compliance_checks": total_checks,
                    "total_violations_detected": total_violations,
                    "total_drift_events": total_drift_events,
                    "average_compliance_score": avg_compliance,
                    "active_monitoring_rules": len([r for r in self.monitoring_rules.values() if r.enabled]),
                    "monitored_entities": len(set(
                        evidence.content.get("entity_id")
                        for evidence in monitoring_evidence
                        if evidence.content.get("entity_id")
                    ))
                },
                "performance_metrics": {
                    "agent_metrics": self.metrics,
                    "average_check_duration": statistics.mean([
                        evidence.content.get("check_duration_ms", 0)
                        for evidence in monitoring_evidence
                    ]) if monitoring_evidence else 0
                },
                "top_violations": self._get_top_violations(monitoring_evidence),
                "compliance_trend": self._calculate_compliance_trend(compliance_scores),
                "recommendations": self._generate_monitoring_recommendations(
                    total_checks, total_violations, total_drift_events, avg_compliance
                )
            }
            
            report_time = (datetime.now() - report_start).total_seconds() * 1000
            
            return TaskResult(
                success=True,
                data={
                    "report": monitoring_report,
                    "report_generation_time_ms": report_time
                },
                task_type="generate_monitoring_report"
            )
            
        except Exception as e:
            logger.error(f"Monitoring report generation failed: {e}")
            raise
    
    async def _start_continuous_monitoring(self):
        """Start continuous monitoring tasks"""
        self.monitoring_active = True
        
        # Start monitoring task for each enabled rule
        for rule in self.monitoring_rules.values():
            if rule.enabled:
                task = asyncio.create_task(self._rule_monitoring_loop(rule))
                self.monitoring_tasks.add(task)
        
        logger.info(f"Started continuous monitoring with {len(self.monitoring_tasks)} active rules")
    
    async def _stop_continuous_monitoring(self):
        """Stop continuous monitoring tasks"""
        self.monitoring_active = False
        
        # Cancel all monitoring tasks
        for task in self.monitoring_tasks:
            task.cancel()
        
        # Wait for tasks to complete
        if self.monitoring_tasks:
            await asyncio.gather(*self.monitoring_tasks, return_exceptions=True)
        
        self.monitoring_tasks.clear()
        logger.info("Continuous monitoring stopped")
    
    async def _rule_monitoring_loop(self, rule: MonitoringRule):
        """Continuous monitoring loop for a specific rule"""
        logger.info(f"Starting monitoring loop for rule: {rule.name}")
        
        while self.monitoring_active:
            try:
                # Wait for check interval
                await asyncio.sleep(rule.check_interval_seconds)
                
                if not self.monitoring_active or not rule.enabled:
                    break
                
                # Perform monitoring check
                # Note: This would integrate with actual evidence collection
                logger.debug(f"Executing monitoring rule: {rule.rule_id}")
                
                # Placeholder for rule execution
                # In production, this would:
                # 1. Get entities matching rule criteria
                # 2. Apply rule conditions
                # 3. Detect violations
                # 4. Generate alerts
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in monitoring loop for rule {rule.rule_id}: {e}")
                await asyncio.sleep(60)  # Wait before retry
        
        logger.info(f"Monitoring loop stopped for rule: {rule.name}")
    
    async def _apply_monitoring_rule(self, rule: MonitoringRule, entity_id: str, evidence: List[Evidence]) -> Optional[ComplianceViolation]:
        """Apply monitoring rule to entity evidence"""
        try:
            # Extract relevant data from evidence
            entity_data = self._extract_entity_data(evidence)
            
            # Apply rule conditions
            conditions = rule.conditions
            for condition_key, condition_value in conditions.items():
                actual_value = entity_data.get(condition_key)
                
                if not self._condition_matches(actual_value, condition_value, condition_key):
                    # Violation detected
                    violation = ComplianceViolation(
                        violation_id=f"violation_{rule.rule_id}_{entity_id}_{int(datetime.now().timestamp())}",
                        rule_id=rule.rule_id,
                        entity_id=entity_id,
                        entity_type=self._get_entity_type(evidence),
                        violation_type=f"{rule.framework}_{rule.category}",
                        severity=rule.severity,
                        detected_at=datetime.now(),
                        description=f"Rule '{rule.name}' violated: {condition_key} is {actual_value}, expected {condition_value}",
                        current_value=actual_value,
                        expected_value=condition_value,
                        remediation_suggested=rule.remediation_actions,
                        auto_remediable=len(rule.remediation_actions) > 0
                    )
                    
                    return violation
            
            return None  # No violation
            
        except Exception as e:
            logger.error(f"Error applying monitoring rule {rule.rule_id}: {e}")
            return None
    
    def _condition_matches(self, actual_value: Any, expected_value: Any, condition_key: str) -> bool:
        """Check if actual value matches expected condition"""
        if expected_value is None:
            return actual_value is None
        
        # Handle different condition types
        if isinstance(expected_value, dict):
            operator = expected_value.get("operator", "equals")
            value = expected_value.get("value")
            
            if operator == "equals":
                return actual_value == value
            elif operator == "not_equals":
                return actual_value != value
            elif operator == "greater_than":
                return actual_value > value if actual_value is not None else False
            elif operator == "less_than":
                return actual_value < value if actual_value is not None else False
            elif operator == "contains":
                return value in actual_value if actual_value is not None else False
            elif operator == "not_contains":
                return value not in actual_value if actual_value is not None else True
            else:
                return actual_value == expected_value
        else:
            return actual_value == expected_value
    
    def _extract_entity_data(self, evidence: List[Evidence]) -> Dict[str, Any]:
        """Extract entity data from evidence for rule evaluation"""
        entity_data = {}
        
        for evidence_item in evidence:
            content = evidence_item.content
            if isinstance(content, dict):
                entity_data.update(content)
        
        return entity_data
    
    def _get_entity_type(self, evidence: List[Evidence]) -> str:
        """Determine entity type from evidence"""
        for evidence_item in evidence:
            if evidence_item.evidence_type:
                if "aws" in evidence_item.evidence_type.lower():
                    return "aws_resource"
                elif "gcp" in evidence_item.evidence_type.lower():
                    return "gcp_resource"
                elif "github" in evidence_item.evidence_type.lower():
                    return "github_repository"
                elif "azure" in evidence_item.evidence_type.lower():
                    return "azure_resource"
        
        return "unknown"
    
    def _generate_evidence_hash(self, content: Dict[str, Any]) -> str:
        """Generate cryptographic hash for evidence integrity"""
        content_str = json.dumps(content, sort_keys=True)
        return hashlib.sha256(content_str.encode()).hexdigest()
    
    async def _load_monitoring_rules(self):
        """Load default monitoring rules for supported frameworks"""
        # SOC2 Rules
        soc2_rules = [
            {
                "rule_id": "soc2_access_control_001",
                "name": "Multi-Factor Authentication Required",
                "description": "All user accounts must have MFA enabled",
                "framework": "SOC2",
                "category": "Access Control",
                "severity": "high",
                "conditions": {"mfa_enabled": True},
                "remediation_actions": ["Enable MFA for user account"],
                "alert_thresholds": {"violation_count": 1}
            },
            {
                "rule_id": "soc2_monitoring_001", 
                "name": "Logging and Monitoring Active",
                "description": "System logging and monitoring must be active",
                "framework": "SOC2",
                "category": "Monitoring",
                "severity": "medium",
                "conditions": {"logging_enabled": True, "monitoring_active": True},
                "remediation_actions": ["Enable system logging", "Activate monitoring systems"],
                "alert_thresholds": {"violation_count": 1}
            }
        ]
        
        # ISO27001 Rules
        iso_rules = [
            {
                "rule_id": "iso27001_crypto_001",
                "name": "Data Encryption in Transit",
                "description": "All data in transit must be encrypted",
                "framework": "ISO27001",
                "category": "Cryptography",
                "severity": "high",
                "conditions": {"encryption_in_transit": True},
                "remediation_actions": ["Enable TLS/SSL encryption"],
                "alert_thresholds": {"violation_count": 1}
            }
        ]
        
        # Create monitoring rules
        all_rules = soc2_rules + iso_rules
        
        for rule_data in all_rules:
            rule = MonitoringRule(
                rule_id=rule_data["rule_id"],
                name=rule_data["name"],
                description=rule_data["description"],
                framework=rule_data["framework"],
                category=rule_data["category"],
                severity=MonitoringLevel(rule_data["severity"]),
                check_interval_seconds=self.config.default_check_interval,
                enabled=True,
                conditions=rule_data["conditions"],
                remediation_actions=rule_data["remediation_actions"],
                alert_thresholds=rule_data["alert_thresholds"]
            )
            
            self.monitoring_rules[rule.rule_id] = rule
        
        logger.info(f"Loaded {len(self.monitoring_rules)} monitoring rules")
    
    async def _initialize_baselines(self):
        """Initialize entity baselines for drift detection"""
        # Placeholder - would load existing baselines from database
        logger.info("Entity baselines initialized")
    
    async def _update_monitoring_metrics(self, processing_time: float):
        """Update monitoring performance metrics"""
        current_avg = self.metrics["average_check_time"]
        total_checks = self.metrics["total_checks_performed"]
        
        if total_checks > 0:
            self.metrics["average_check_time"] = (
                (current_avg * (total_checks - 1) + processing_time) / total_checks
            )
    
    async def _log_monitoring_summary(self):
        """Log monitoring summary on shutdown"""
        logger.info("🔍 Continuous Monitor Performance Summary:")
        logger.info(f"  Total checks: {self.metrics['total_checks_performed']}")
        logger.info(f"  Violations detected: {self.metrics['violations_detected']}")
        logger.info(f"  Drift events: {self.metrics['drift_events_detected']}")
        logger.info(f"  Alerts sent: {self.metrics['alerts_sent']}")
        logger.info(f"  Average check time: {self.metrics['average_check_time']:.2f}s")
    
    def _get_top_violations(self, evidence: List[Evidence]) -> List[Dict[str, Any]]:
        """Get top violations from monitoring evidence"""
        # Placeholder implementation
        return []
    
    def _calculate_compliance_trend(self, scores: List[float]) -> str:
        """Calculate compliance trend from scores"""
        if len(scores) < 2:
            return "insufficient_data"
        
        recent_avg = statistics.mean(scores[-5:]) if len(scores) >= 5 else statistics.mean(scores[-2:])
        older_avg = statistics.mean(scores[:-5]) if len(scores) >= 5 else statistics.mean(scores[:-2])
        
        if recent_avg > older_avg * 1.05:
            return "improving"
        elif recent_avg < older_avg * 0.95:
            return "declining"
        else:
            return "stable"
    
    def _generate_monitoring_recommendations(self, checks: int, violations: int, drift_events: int, avg_compliance: float) -> List[str]:
        """Generate monitoring recommendations"""
        recommendations = []
        
        if avg_compliance < 0.8:
            recommendations.append("Compliance score is below 80% - increase monitoring frequency")
        
        if violations > checks * 0.1:
            recommendations.append("High violation rate detected - review and strengthen controls")
        
        if drift_events > 0:
            recommendations.append("Configuration drift detected - implement change management controls")
        
        return recommendations
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get agent health status"""
        base_status = await super().get_health_status()
        
        base_status.update({
            "monitoring_active": self.monitoring_active,
            "active_rules": len([r for r in self.monitoring_rules.values() if r.enabled]),
            "total_rules": len(self.monitoring_rules),
            "active_violations": len(self.active_violations),
            "drift_events": len(self.drift_events),
            "monitoring_tasks": len(self.monitoring_tasks),
            "total_checks_performed": self.metrics["total_checks_performed"],
            "violations_detected": self.metrics["violations_detected"]
        })
        
        return base_status

# Factory function for agent creation
def create_continuous_monitor() -> ContinuousMonitor:
    """Create a Continuous Monitor instance"""
    config = ContinuousMonitorConfig()
    return ContinuousMonitor(config)

if __name__ == "__main__":
    # Test the agent
    async def test_agent():
        agent = create_continuous_monitor()
        await agent.start()
        
        # Test compliance check
        test_task = {
            "type": "check_compliance",
            "entity_id": "test-entity-123",
            "organization_id": "test-org"
        }
        
        result = await agent.process_task(test_task)
        print(f"Compliance check result: {result.success}")
        print(f"Compliance status: {result.data.get('compliance_status') if result.success else 'N/A'}")
        
        # Test monitoring report
        report_task = {
            "type": "generate_monitoring_report",
            "organization_id": "test-org",
            "time_range_hours": 24
        }
        
        report_result = await agent.process_task(report_task)
        print(f"Monitoring report result: {report_result.success}")
        
        await agent.stop()
    
    asyncio.run(test_agent())