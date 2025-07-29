#!/usr/bin/env python3
"""
Observability Specialist Agent - Velocity.ai Multi-Agent System
Enterprise-Grade AI Monitoring and Analytics

This agent provides comprehensive observability across the entire Velocity.ai
platform, monitoring AI agent performance, system health, compliance metrics,
and providing actionable insights for optimization and troubleshooting.
"""

import asyncio
import json
import logging
import statistics
from typing import Dict, List, Any, Optional, Tuple, Set
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from enum import Enum
import math

from ..core.base_agent import BaseAgent, AgentConfig, TaskResult, Evidence
from ..core.agent_types import AgentType, TaskPriority
from ...database.evidence_store import EvidenceStore

# Configure logging
logger = logging.getLogger(__name__)

class MetricSeverity(Enum):
    """Metric severity levels"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

class ObservabilityDomain(Enum):
    """Observability monitoring domains"""
    AGENT_PERFORMANCE = "agent_performance"
    SYSTEM_HEALTH = "system_health"
    COMPLIANCE_METRICS = "compliance_metrics"
    SECURITY_EVENTS = "security_events"
    USER_EXPERIENCE = "user_experience"
    BUSINESS_KPI = "business_kpi"

@dataclass
class MetricDefinition:
    """Metric definition structure"""
    metric_id: str
    name: str
    description: str
    domain: ObservabilityDomain
    unit: str
    collection_interval_seconds: int
    thresholds: Dict[str, float]
    aggregation_method: str
    retention_days: int
    enabled: bool

@dataclass
class ObservabilityAlert:
    """Observability alert structure"""
    alert_id: str
    metric_id: str
    severity: MetricSeverity
    title: str
    description: str
    current_value: float
    threshold_value: float
    triggered_at: datetime
    resolved_at: Optional[datetime]
    remediation_suggestions: List[str]
    affected_components: List[str]

@dataclass
class PerformanceInsight:
    """Performance insight structure"""
    insight_id: str
    category: str
    title: str
    description: str
    impact_score: float
    confidence_level: float
    recommendations: List[str]
    supporting_data: Dict[str, Any]
    generated_at: datetime

class ObservabilitySpecialistConfig(AgentConfig):
    """Configuration for Observability Specialist Agent"""
    
    def __init__(self):
        super().__init__(
            agent_id="observability-specialist",
            name="Observability Specialist",
            agent_type=AgentType.ANALYTICS,
            description="Enterprise-grade AI monitoring and analytics",
            capabilities=[
                "performance_monitoring",
                "anomaly_detection",
                "predictive_analytics",
                "alert_management",
                "insight_generation",
                "dashboard_automation",
                "compliance_reporting"
            ],
            required_permissions=[
                "metrics:read",
                "metrics:write",
                "alerts:manage",
                "analytics:analyze",
                "reports:generate"
            ],
            max_concurrent_tasks=15,
            task_timeout=300,  # 5 minutes for complex analytics
            priority=TaskPriority.HIGH
        )
        
        # Observability configuration
        self.metric_collection_interval = 60  # 1 minute
        self.anomaly_detection_window_hours = 24
        self.performance_percentiles = [50, 75, 90, 95, 99]
        self.insight_generation_interval = 3600  # 1 hour
        
        # Alert configuration
        self.alert_deduplication_window = 300  # 5 minutes
        self.max_alerts_per_metric_per_hour = 10
        self.escalation_delays = {
            MetricSeverity.INFO: timedelta(hours=12),
            MetricSeverity.WARNING: timedelta(hours=2),
            MetricSeverity.ERROR: timedelta(minutes=30),
            MetricSeverity.CRITICAL: timedelta(minutes=5)
        }

class ObservabilitySpecialist(BaseAgent):
    """
    Observability Specialist Agent
    
    Provides comprehensive monitoring, analytics, and insights across the
    entire Velocity.ai platform with enterprise-grade observability capabilities.
    """
    
    def __init__(self, config: ObservabilitySpecialistConfig):
        super().__init__(config)
        self.config = config
        self.evidence_store = EvidenceStore()
        
        # Observability state
        self.metric_definitions: Dict[str, MetricDefinition] = {}
        self.active_alerts: Dict[str, ObservabilityAlert] = {}
        self.performance_insights: Dict[str, PerformanceInsight] = {}
        self.metric_data: Dict[str, List[Dict[str, Any]]] = {}
        
        # Analytics state
        self.anomaly_models: Dict[str, Dict[str, Any]] = {}
        self.performance_baselines: Dict[str, Dict[str, float]] = {}
        self.trend_analysis: Dict[str, Dict[str, Any]] = {}
        
        # Observability metrics
        self.observability_metrics = {
            "metrics_collected": 0,
            "alerts_generated": 0,
            "insights_created": 0,
            "anomalies_detected": 0,
            "reports_generated": 0,
            "dashboard_updates": 0,
            "average_processing_time": 0.0,
            "data_points_analyzed": 0
        }
        
        # Monitoring tasks
        self.monitoring_tasks: Set[asyncio.Task] = set()
        self.monitoring_active = False
        
        logger.info(f"Observability Specialist initialized: {self.config.agent_id}")
    
    async def start(self) -> bool:
        """Start the Observability Specialist Agent"""
        try:
            await super().start()
            
            # Initialize metric definitions
            await self._initialize_metric_definitions()
            
            # Initialize performance baselines
            await self._initialize_performance_baselines()
            
            # Start observability monitoring
            await self._start_observability_monitoring()
            
            logger.info("Observability Specialist started successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start Observability Specialist: {e}")
            return False
    
    async def stop(self) -> bool:
        """Stop the Observability Specialist Agent"""
        try:
            # Stop monitoring tasks
            await self._stop_observability_monitoring()
            
            # Generate final observability report
            await self._generate_final_report()
            
            await super().stop()
            logger.info("Observability Specialist stopped successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error stopping Observability Specialist: {e}")
            return False
    
    async def process_task(self, task_data: Dict[str, Any]) -> TaskResult:
        """Process observability tasks"""
        task_type = task_data.get("type")
        start_time = datetime.now()
        
        try:
            if task_type == "collect_metrics":
                result = await self._collect_metrics(task_data)
            elif task_type == "detect_anomalies":
                result = await self._detect_anomalies(task_data)
            elif task_type == "generate_insights":
                result = await self._generate_insights(task_data)
            elif task_type == "create_dashboard":
                result = await self._create_dashboard(task_data)
            elif task_type == "performance_analysis":
                result = await self._analyze_performance(task_data)
            elif task_type == "compliance_report":
                result = await self._generate_compliance_report(task_data)
            elif task_type == "alert_management":
                result = await self._manage_alerts(task_data)
            else:
                return TaskResult(
                    success=False,
                    error=f"Unknown task type: {task_type}",
                    task_type=task_type
                )
            
            # Update observability metrics
            processing_time = (datetime.now() - start_time).total_seconds()
            await self._update_observability_metrics(processing_time)
            
            return result
            
        except Exception as e:
            logger.error(f"Observability task processing failed: {e}")
            return TaskResult(
                success=False,
                error=str(e),
                task_type=task_type,
                processing_time=(datetime.now() - start_time).total_seconds()
            )
    
    async def _collect_metrics(self, task_data: Dict[str, Any]) -> TaskResult:
        """Collect metrics from all monitored systems"""
        try:
            organization_id = task_data.get("organization_id")
            metric_ids = task_data.get("metric_ids", [])
            
            if not organization_id:
                raise ValueError("Missing organization_id")
            
            collection_start = datetime.now()
            
            # Get metrics to collect
            metrics_to_collect = metric_ids if metric_ids else list(self.metric_definitions.keys())
            collected_metrics = []
            
            for metric_id in metrics_to_collect:
                if metric_id not in self.metric_definitions:
                    continue
                
                metric_def = self.metric_definitions[metric_id]
                if not metric_def.enabled:
                    continue
                
                # Collect metric data based on domain
                metric_value = await self._collect_domain_metric(metric_def, organization_id)
                
                if metric_value is not None:
                    metric_data = {
                        "metric_id": metric_id,
                        "value": metric_value,
                        "timestamp": datetime.now().isoformat(),
                        "unit": metric_def.unit,
                        "domain": metric_def.domain.value
                    }
                    
                    collected_metrics.append(metric_data)
                    
                    # Store in metric data history
                    if metric_id not in self.metric_data:
                        self.metric_data[metric_id] = []
                    
                    self.metric_data[metric_id].append(metric_data)
                    
                    # Keep only recent data (based on retention)
                    retention_cutoff = datetime.now() - timedelta(days=metric_def.retention_days)
                    self.metric_data[metric_id] = [
                        m for m in self.metric_data[metric_id]
                        if datetime.fromisoformat(m["timestamp"]) > retention_cutoff
                    ]
                    
                    # Check thresholds for alerting
                    await self._check_metric_thresholds(metric_def, metric_value)
            
            collection_time = (datetime.now() - collection_start).total_seconds() * 1000
            
            # Create metrics collection evidence
            evidence_content = {
                "organization_id": organization_id,
                "metrics_collected": len(collected_metrics),
                "collection_timestamp": datetime.now().isoformat(),
                "collection_duration_ms": collection_time,
                "metrics_data": collected_metrics,
                "collection_summary": {
                    "total_metrics_available": len(self.metric_definitions),
                    "enabled_metrics": len([m for m in self.metric_definitions.values() if m.enabled]),
                    "successful_collections": len(collected_metrics)
                }
            }
            
            evidence_hash = self._generate_evidence_hash(evidence_content)
            
            evidence = Evidence(
                source="observability_specialist",
                evidence_type="metrics_collection",
                content=evidence_content,
                confidence_score=0.95,
                collected_at=datetime.now(),
                hash_value=evidence_hash,
                metadata={
                    "agent_id": self.config.agent_id,
                    "collection_type": "automated_metrics",
                    "metrics_count": len(collected_metrics)
                }
            )
            
            # Store evidence
            evidence_id = await self.evidence_store.store_evidence(evidence, organization_id)
            
            # Update metrics
            self.observability_metrics["metrics_collected"] += len(collected_metrics)
            self.observability_metrics["data_points_analyzed"] += len(collected_metrics)
            
            return TaskResult(
                success=True,
                data={
                    "metrics_collected": len(collected_metrics),
                    "collection_duration_ms": collection_time,
                    "metrics_data": collected_metrics,
                    "evidence_id": evidence_id,
                    "evidence_hash": evidence_hash
                },
                evidence=[evidence],
                task_type="collect_metrics"
            )
            
        except Exception as e:
            logger.error(f"Metrics collection failed: {e}")
            raise
    
    async def _detect_anomalies(self, task_data: Dict[str, Any]) -> TaskResult:
        """Detect anomalies in collected metrics"""
        try:
            organization_id = task_data.get("organization_id")
            metric_ids = task_data.get("metric_ids", [])
            detection_window_hours = task_data.get("window_hours", self.config.anomaly_detection_window_hours)
            
            if not organization_id:
                raise ValueError("Missing organization_id")
            
            detection_start = datetime.now()
            
            # Get metrics to analyze
            metrics_to_analyze = metric_ids if metric_ids else list(self.metric_data.keys())
            anomalies_detected = []
            
            for metric_id in metrics_to_analyze:
                if metric_id not in self.metric_data:
                    continue
                
                metric_history = self.metric_data[metric_id]
                if len(metric_history) < 10:  # Need minimum data points
                    continue
                
                # Get recent data for analysis
                cutoff_time = datetime.now() - timedelta(hours=detection_window_hours)
                recent_data = [
                    m for m in metric_history
                    if datetime.fromisoformat(m["timestamp"]) > cutoff_time
                ]
                
                if len(recent_data) < 5:
                    continue
                
                # Perform anomaly detection
                anomaly = await self._analyze_metric_anomaly(metric_id, recent_data)
                if anomaly:
                    anomalies_detected.append(anomaly)
            
            detection_time = (datetime.now() - detection_start).total_seconds() * 1000
            
            # Create anomaly detection evidence
            evidence_content = {
                "organization_id": organization_id,
                "detection_window_hours": detection_window_hours,
                "metrics_analyzed": len(metrics_to_analyze),
                "anomalies_detected": len(anomalies_detected),
                "anomaly_details": anomalies_detected,
                "detection_timestamp": datetime.now().isoformat(),
                "detection_duration_ms": detection_time,
                "detection_algorithm": "statistical_threshold_analysis"
            }
            
            evidence_hash = self._generate_evidence_hash(evidence_content)
            
            evidence = Evidence(
                source="observability_specialist",
                evidence_type="anomaly_detection",
                content=evidence_content,
                confidence_score=0.88,
                collected_at=datetime.now(),
                hash_value=evidence_hash,
                metadata={
                    "agent_id": self.config.agent_id,
                    "detection_type": "automated_anomaly_detection",
                    "anomalies_count": len(anomalies_detected)
                }
            )
            
            # Store evidence
            evidence_id = await self.evidence_store.store_evidence(evidence, organization_id)
            
            # Update metrics
            self.observability_metrics["anomalies_detected"] += len(anomalies_detected)
            
            return TaskResult(
                success=True,
                data={
                    "anomalies_detected": len(anomalies_detected),
                    "anomaly_details": anomalies_detected,
                    "detection_duration_ms": detection_time,
                    "evidence_id": evidence_id,
                    "evidence_hash": evidence_hash
                },
                evidence=[evidence],
                task_type="detect_anomalies"
            )
            
        except Exception as e:
            logger.error(f"Anomaly detection failed: {e}")
            raise
    
    async def _generate_insights(self, task_data: Dict[str, Any]) -> TaskResult:
        """Generate performance insights and recommendations"""
        try:
            organization_id = task_data.get("organization_id")
            analysis_period_hours = task_data.get("analysis_period_hours", 24)
            
            if not organization_id:
                raise ValueError("Missing organization_id")
            
            insight_start = datetime.now()
            
            # Analyze different categories of insights
            insights_generated = []
            
            # Performance insights
            performance_insights = await self._analyze_performance_insights(organization_id, analysis_period_hours)
            insights_generated.extend(performance_insights)
            
            # Resource utilization insights
            resource_insights = await self._analyze_resource_utilization(organization_id, analysis_period_hours)
            insights_generated.extend(resource_insights)
            
            # Compliance insights
            compliance_insights = await self._analyze_compliance_trends(organization_id, analysis_period_hours)
            insights_generated.extend(compliance_insights)
            
            # Cost optimization insights
            cost_insights = await self._analyze_cost_optimization(organization_id, analysis_period_hours)
            insights_generated.extend(cost_insights)
            
            # Store insights
            for insight in insights_generated:
                self.performance_insights[insight["insight_id"]] = PerformanceInsight(**insight)
            
            insight_time = (datetime.now() - insight_start).total_seconds() * 1000
            
            # Create insights evidence
            evidence_content = {
                "organization_id": organization_id,
                "analysis_period_hours": analysis_period_hours,
                "insights_generated": len(insights_generated),
                "insight_categories": list(set(i["category"] for i in insights_generated)),
                "insights_data": insights_generated,
                "generation_timestamp": datetime.now().isoformat(),
                "generation_duration_ms": insight_time,
                "high_impact_insights": len([i for i in insights_generated if i["impact_score"] > 0.8])
            }
            
            evidence_hash = self._generate_evidence_hash(evidence_content)
            
            evidence = Evidence(
                source="observability_specialist",
                evidence_type="performance_insights",
                content=evidence_content,
                confidence_score=0.92,
                collected_at=datetime.now(),
                hash_value=evidence_hash,
                metadata={
                    "agent_id": self.config.agent_id,
                    "analysis_type": "automated_insight_generation",
                    "insights_count": len(insights_generated)
                }
            )
            
            # Store evidence
            evidence_id = await self.evidence_store.store_evidence(evidence, organization_id)
            
            # Update metrics
            self.observability_metrics["insights_created"] += len(insights_generated)
            
            return TaskResult(
                success=True,
                data={
                    "insights_generated": len(insights_generated),
                    "insights_data": insights_generated,
                    "high_impact_insights": len([i for i in insights_generated if i["impact_score"] > 0.8]),
                    "generation_duration_ms": insight_time,
                    "evidence_id": evidence_id,
                    "evidence_hash": evidence_hash
                },
                evidence=[evidence],
                task_type="generate_insights"
            )
            
        except Exception as e:
            logger.error(f"Insight generation failed: {e}")
            raise
    
    async def _analyze_performance(self, task_data: Dict[str, Any]) -> TaskResult:
        """Analyze system and agent performance"""
        try:
            organization_id = task_data.get("organization_id")
            analysis_type = task_data.get("analysis_type", "comprehensive")
            time_range_hours = task_data.get("time_range_hours", 24)
            
            if not organization_id:
                raise ValueError("Missing organization_id")
            
            analysis_start = datetime.now()
            
            # Get performance evidence from the time range
            end_time = analysis_start
            start_time = end_time - timedelta(hours=time_range_hours)
            
            # Analyze different aspects of performance
            performance_analysis = {
                "organization_id": organization_id,
                "analysis_type": analysis_type,
                "time_range": {
                    "start_time": start_time.isoformat(),
                    "end_time": end_time.isoformat(),
                    "duration_hours": time_range_hours
                },
                "agent_performance": await self._analyze_agent_performance(organization_id, start_time, end_time),
                "system_health": await self._analyze_system_health(organization_id, start_time, end_time),
                "response_times": await self._analyze_response_times(organization_id, start_time, end_time),
                "throughput_analysis": await self._analyze_throughput(organization_id, start_time, end_time),
                "error_rates": await self._analyze_error_rates(organization_id, start_time, end_time),
                "resource_utilization": await self._analyze_resource_usage(organization_id, start_time, end_time),
                "performance_trends": await self._analyze_performance_trends(organization_id, start_time, end_time),
                "bottleneck_analysis": await self._identify_bottlenecks(organization_id, start_time, end_time),
                "recommendations": await self._generate_performance_recommendations(organization_id, start_time, end_time)
            }
            
            analysis_time = (datetime.now() - analysis_start).total_seconds() * 1000
            performance_analysis["analysis_duration_ms"] = analysis_time
            
            return TaskResult(
                success=True,
                data=performance_analysis,
                task_type="performance_analysis"
            )
            
        except Exception as e:
            logger.error(f"Performance analysis failed: {e}")
            raise
    
    async def _generate_compliance_report(self, task_data: Dict[str, Any]) -> TaskResult:
        """Generate comprehensive compliance observability report"""
        try:
            organization_id = task_data.get("organization_id")
            frameworks = task_data.get("frameworks", ["SOC2", "ISO27001", "GDPR"])
            report_period_days = task_data.get("report_period_days", 30)
            
            if not organization_id:
                raise ValueError("Missing organization_id")
            
            report_start = datetime.now()
            
            # Generate compliance report sections
            compliance_report = {
                "organization_id": organization_id,
                "report_period_days": report_period_days,
                "frameworks": frameworks,
                "generation_timestamp": datetime.now().isoformat(),
                "executive_summary": await self._generate_compliance_executive_summary(organization_id, frameworks, report_period_days),
                "framework_compliance": {},
                "observability_metrics": await self._get_compliance_observability_metrics(organization_id, report_period_days),
                "audit_trail": await self._generate_audit_trail_summary(organization_id, report_period_days),
                "recommendations": await self._generate_compliance_recommendations(organization_id, frameworks),
                "trend_analysis": await self._analyze_compliance_trends_detailed(organization_id, frameworks, report_period_days)
            }
            
            # Framework-specific analysis
            for framework in frameworks:
                compliance_report["framework_compliance"][framework] = await self._analyze_framework_compliance(
                    organization_id, framework, report_period_days
                )
            
            report_time = (datetime.now() - report_start).total_seconds() * 1000
            compliance_report["report_generation_time_ms"] = report_time
            
            # Update metrics
            self.observability_metrics["reports_generated"] += 1
            
            return TaskResult(
                success=True,
                data={
                    "compliance_report": compliance_report,
                    "report_generation_time_ms": report_time
                },
                task_type="compliance_report"
            )
            
        except Exception as e:
            logger.error(f"Compliance report generation failed: {e}")
            raise
    
    async def _collect_domain_metric(self, metric_def: MetricDefinition, organization_id: str) -> Optional[float]:
        """Collect metric based on its domain"""
        try:
            if metric_def.domain == ObservabilityDomain.AGENT_PERFORMANCE:
                return await self._collect_agent_performance_metric(metric_def, organization_id)
            elif metric_def.domain == ObservabilityDomain.SYSTEM_HEALTH:
                return await self._collect_system_health_metric(metric_def, organization_id)
            elif metric_def.domain == ObservabilityDomain.COMPLIANCE_METRICS:
                return await self._collect_compliance_metric(metric_def, organization_id)
            elif metric_def.domain == ObservabilityDomain.SECURITY_EVENTS:
                return await self._collect_security_metric(metric_def, organization_id)
            elif metric_def.domain == ObservabilityDomain.USER_EXPERIENCE:
                return await self._collect_user_experience_metric(metric_def, organization_id)
            elif metric_def.domain == ObservabilityDomain.BUSINESS_KPI:
                return await self._collect_business_kpi_metric(metric_def, organization_id)
            else:
                return None
                
        except Exception as e:
            logger.error(f"Failed to collect metric {metric_def.metric_id}: {e}")
            return None
    
    async def _collect_agent_performance_metric(self, metric_def: MetricDefinition, organization_id: str) -> float:
        """Collect agent performance metrics"""
        # Mock implementation - would integrate with actual agent monitoring
        import random
        
        if "response_time" in metric_def.metric_id:
            return random.uniform(50, 200)  # ms
        elif "throughput" in metric_def.metric_id:
            return random.uniform(100, 1000)  # requests/sec
        elif "error_rate" in metric_def.metric_id:
            return random.uniform(0, 5)  # percentage
        elif "cpu_usage" in metric_def.metric_id:  
            return random.uniform(10, 80)  # percentage
        else:
            return random.uniform(0, 100)
    
    async def _collect_system_health_metric(self, metric_def: MetricDefinition, organization_id: str) -> float:
        """Collect system health metrics"""
        import random
        
        if "memory_usage" in metric_def.metric_id:
            return random.uniform(30, 85)  # percentage
        elif "disk_usage" in metric_def.metric_id:
            return random.uniform(40, 90)  # percentage
        elif "network_latency" in metric_def.metric_id:
            return random.uniform(10, 100)  # ms
        else:
            return random.uniform(0, 100)
    
    async def _collect_compliance_metric(self, metric_def: MetricDefinition, organization_id: str) -> float:
        """Collect compliance metrics"""
        import random
        
        if "compliance_score" in metric_def.metric_id:
            return random.uniform(80, 98)  # percentage
        elif "violations" in metric_def.metric_id:
            return random.randint(0, 5)  # count
        else:
            return random.uniform(0, 100)
    
    async def _collect_security_metric(self, metric_def: MetricDefinition, organization_id: str) -> float:
        """Collect security metrics"""
        import random
        return random.uniform(0, 10)  # Mock security events
    
    async def _collect_user_experience_metric(self, metric_def: MetricDefinition, organization_id: str) -> float:
        """Collect user experience metrics"""
        import random
        return random.uniform(3, 5)  # Mock satisfaction score
    
    async def _collect_business_kpi_metric(self, metric_def: MetricDefinition, organization_id: str) -> float:
        """Collect business KPI metrics"""
        import random
        return random.uniform(100, 1000)  # Mock business metric
    
    def _generate_evidence_hash(self, content: Dict[str, Any]) -> str:
        """Generate cryptographic hash for evidence integrity"""
        import hashlib
        content_str = json.dumps(content, sort_keys=True)
        return hashlib.sha256(content_str.encode()).hexdigest()
    
    async def _initialize_metric_definitions(self):
        """Initialize standard metric definitions"""
        metrics = [
            # Agent Performance Metrics
            {
                "metric_id": "agent_response_time_avg",
                "name": "Agent Average Response Time",
                "description": "Average response time across all agents",
                "domain": ObservabilityDomain.AGENT_PERFORMANCE,
                "unit": "milliseconds",
                "thresholds": {"warning": 200, "critical": 500},
                "aggregation_method": "average"
            },
            {
                "metric_id": "agent_throughput",
                "name": "Agent Task Throughput",
                "description": "Number of tasks processed per second",
                "domain": ObservabilityDomain.AGENT_PERFORMANCE,
                "unit": "tasks/second",
                "thresholds": {"warning": 10, "critical": 5},
                "aggregation_method": "sum"
            },
            # System Health Metrics
            {
                "metric_id": "system_memory_usage",
                "name": "System Memory Usage",
                "description": "Overall system memory utilization",
                "domain": ObservabilityDomain.SYSTEM_HEALTH,
                "unit": "percentage",
                "thresholds": {"warning": 80, "critical": 95},
                "aggregation_method": "average"
            },
            # Compliance Metrics
            {
                "metric_id": "compliance_score_overall",
                "name": "Overall Compliance Score",
                "description": "Aggregate compliance score across all frameworks",
                "domain": ObservabilityDomain.COMPLIANCE_METRICS,
                "unit": "percentage",
                "thresholds": {"warning": 85, "critical": 70},
                "aggregation_method": "weighted_average"
            }
        ]
        
        for metric_data in metrics:
            metric = MetricDefinition(
                metric_id=metric_data["metric_id"],
                name=metric_data["name"],
                description=metric_data["description"],
                domain=metric_data["domain"],
                unit=metric_data["unit"],
                collection_interval_seconds=self.config.metric_collection_interval,
                thresholds=metric_data["thresholds"],
                aggregation_method=metric_data["aggregation_method"],
                retention_days=30,
                enabled=True
            )
            
            self.metric_definitions[metric.metric_id] = metric
        
        logger.info(f"Initialized {len(self.metric_definitions)} metric definitions")
    
    async def _initialize_performance_baselines(self):
        """Initialize performance baselines for anomaly detection"""
        # Placeholder - would load historical data to establish baselines
        logger.info("Performance baselines initialized")
    
    async def _start_observability_monitoring(self):
        """Start continuous observability monitoring"""
        self.monitoring_active = True
        
        # Start metric collection task
        task = asyncio.create_task(self._continuous_metric_collection())
        self.monitoring_tasks.add(task)
        
        # Start insight generation task
        task = asyncio.create_task(self._continuous_insight_generation())
        self.monitoring_tasks.add(task)
        
        logger.info(f"Started observability monitoring with {len(self.monitoring_tasks)} tasks")
    
    async def _stop_observability_monitoring(self):
        """Stop observability monitoring"""
        self.monitoring_active = False
        
        for task in self.monitoring_tasks:
            task.cancel()
        
        if self.monitoring_tasks:
            await asyncio.gather(*self.monitoring_tasks, return_exceptions=True)
        
        self.monitoring_tasks.clear()
        logger.info("Observability monitoring stopped")
    
    async def _continuous_metric_collection(self):
        """Continuous metric collection loop"""
        while self.monitoring_active:
            try:
                # Collect metrics for all organizations
                # This is simplified - would have organization context
                await self._collect_metrics({"organization_id": "default"})
                
                await asyncio.sleep(self.config.metric_collection_interval)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in continuous metric collection: {e}")
                await asyncio.sleep(60)
    
    async def _continuous_insight_generation(self):
        """Continuous insight generation loop"""
        while self.monitoring_active:
            try:
                # Generate insights periodically
                await self._generate_insights({"organization_id": "default"})
                
                await asyncio.sleep(self.config.insight_generation_interval)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in continuous insight generation: {e}")
                await asyncio.sleep(300)
    
    async def _update_observability_metrics(self, processing_time: float):
        """Update observability performance metrics"""
        current_avg = self.observability_metrics["average_processing_time"]
        total_processed = (
            self.observability_metrics["metrics_collected"] +
            self.observability_metrics["alerts_generated"] +
            self.observability_metrics["insights_created"]
        )
        
        if total_processed > 0:
            self.observability_metrics["average_processing_time"] = (
                (current_avg * (total_processed - 1) + processing_time) / total_processed
            )
    
    async def _generate_final_report(self):
        """Generate final observability report on shutdown"""
        logger.info("📊 Observability Specialist Final Report:")
        logger.info(f"  Metrics collected: {self.observability_metrics['metrics_collected']}")
        logger.info(f"  Alerts generated: {self.observability_metrics['alerts_generated']}")
        logger.info(f"  Insights created: {self.observability_metrics['insights_created']}")
        logger.info(f"  Anomalies detected: {self.observability_metrics['anomalies_detected']}")
        logger.info(f"  Reports generated: {self.observability_metrics['reports_generated']}")
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get agent health status"""
        base_status = await super().get_health_status()
        
        base_status.update({
            "monitoring_active": self.monitoring_active,
            "active_metrics": len([m for m in self.metric_definitions.values() if m.enabled]),
            "total_metrics_defined": len(self.metric_definitions),
            "active_alerts": len(self.active_alerts),
            "performance_insights": len(self.performance_insights),
            "monitoring_tasks": len(self.monitoring_tasks),
            "data_points_collected": self.observability_metrics["data_points_analyzed"],
            "observability_metrics": self.observability_metrics
        })
        
        return base_status

# Factory function for agent creation
def create_observability_specialist() -> ObservabilitySpecialist:
    """Create an Observability Specialist instance"""
    config = ObservabilitySpecialistConfig()
    return ObservabilitySpecialist(config)

if __name__ == "__main__":
    # Test the agent
    async def test_agent():
        agent = create_observability_specialist()
        await agent.start()
        
        # Test metrics collection
        test_task = {
            "type": "collect_metrics",
            "organization_id": "test-org"
        }
        
        result = await agent.process_task(test_task)
        print(f"Metrics collection result: {result.success}")
        if result.success:
            print(f"Metrics collected: {result.data.get('metrics_collected')}")
        
        # Test insight generation
        insight_task = {
            "type": "generate_insights",
            "organization_id": "test-org",
            "analysis_period_hours": 24
        }
        
        insight_result = await agent.process_task(insight_task)
        print(f"Insight generation result: {insight_result.success}")
        if insight_result.success:
            print(f"Insights generated: {insight_result.data.get('insights_generated')}")
        
        await agent.stop()
    
    asyncio.run(test_agent())