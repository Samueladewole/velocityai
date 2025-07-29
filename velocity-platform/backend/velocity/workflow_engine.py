"""
Intelligent Workflow Automation Engine for Velocity AI Platform
Coordinates complex multi-agent workflows with smart scheduling and optimization
"""

import asyncio
import json
import uuid
import time
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional, Union, Callable, Set, Tuple
from enum import Enum
from dataclasses import dataclass, field, asdict
from collections import defaultdict, deque
import logging

from pydantic import BaseModel, Field
import structlog
from sqlalchemy.orm import Session

from agent_orchestration import AgentType, TaskType, TaskStatus, AgentTask, orchestrator
from agent_communication import AgentMessage, MessageType, MessagePriority, communication_hub
from ml_pipeline import MLPipeline, get_ml_pipeline
from models import User, Organization, Framework, Platform

logger = structlog.get_logger()

class WorkflowType(Enum):
    """Types of automated workflows"""
    COMPLIANCE_AUDIT = "compliance_audit"
    EVIDENCE_COLLECTION = "evidence_collection"
    RISK_ASSESSMENT = "risk_assessment"
    POLICY_VALIDATION = "policy_validation"
    SECURITY_REVIEW = "security_review"
    CONTINUOUS_MONITORING = "continuous_monitoring"
    INCIDENT_RESPONSE = "incident_response"
    CERTIFICATION_PREP = "certification_prep"

class WorkflowStatus(Enum):
    """Workflow execution status"""
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    WAITING_APPROVAL = "waiting_approval"

class WorkflowTrigger(Enum):
    """What triggers a workflow"""
    MANUAL = "manual"
    SCHEDULED = "scheduled"
    EVENT_BASED = "event_based"
    CONDITIONAL = "conditional"
    API_CALL = "api_call"
    INTEGRATION_UPDATE = "integration_update"

class AutomationLevel(Enum):
    """Level of automation for tasks"""
    MANUAL = "manual"              # Requires human intervention
    SEMI_AUTOMATED = "semi_auto"   # AI suggests, human approves
    FULLY_AUTOMATED = "auto"       # AI executes autonomously
    ADAPTIVE = "adaptive"          # AI learns and improves over time

@dataclass
class WorkflowStep:
    """Individual step in a workflow"""
    step_id: str
    name: str
    description: str
    
    # Task configuration
    task_type: TaskType
    target_agent: Optional[AgentType] = None
    automation_level: AutomationLevel = AutomationLevel.SEMI_AUTOMATED
    
    # Dependencies and conditions
    depends_on: List[str] = field(default_factory=list)
    conditions: Dict[str, Any] = field(default_factory=dict)
    
    # Execution parameters
    input_template: Dict[str, Any] = field(default_factory=dict)
    output_requirements: List[str] = field(default_factory=list)
    timeout_minutes: int = 30
    retry_count: int = 3
    
    # Approval requirements
    requires_approval: bool = False
    approval_roles: List[str] = field(default_factory=list)
    
    # Status tracking
    status: TaskStatus = TaskStatus.PENDING
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    output_data: Dict[str, Any] = field(default_factory=dict)
    error_message: Optional[str] = None

@dataclass
class WorkflowTemplate:
    """Template for creating workflows"""
    template_id: str
    name: str
    description: str
    workflow_type: WorkflowType
    
    # Workflow structure
    steps: List[WorkflowStep]
    parallel_groups: List[List[str]] = field(default_factory=list)
    success_criteria: Dict[str, Any] = field(default_factory=dict)
    
    # Automation settings
    default_automation_level: AutomationLevel = AutomationLevel.SEMI_AUTOMATED
    auto_retry_failed_steps: bool = True
    enable_adaptive_learning: bool = True
    
    # Compliance context
    applicable_frameworks: List[Framework] = field(default_factory=list)
    applicable_platforms: List[Platform] = field(default_factory=list)
    compliance_controls: List[str] = field(default_factory=list)
    
    # Metadata
    created_by: str = ""
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    version: str = "1.0"
    is_active: bool = True

@dataclass
class WorkflowInstance:
    """Running instance of a workflow"""
    instance_id: str
    template_id: str
    name: str
    organization_id: str
    
    # Execution context
    trigger: WorkflowTrigger
    triggered_by: str
    trigger_data: Dict[str, Any] = field(default_factory=dict)
    
    # Current state
    status: WorkflowStatus = WorkflowStatus.SCHEDULED
    current_step: Optional[str] = None
    steps: List[WorkflowStep] = field(default_factory=list)
    
    # Timing
    scheduled_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    estimated_duration: Optional[float] = None
    actual_duration: Optional[float] = None
    
    # Results and metrics
    success_rate: float = 0.0
    evidence_collected: int = 0
    controls_validated: int = 0
    issues_found: int = 0
    
    # Output data
    results: Dict[str, Any] = field(default_factory=dict)
    artifacts: List[str] = field(default_factory=list)
    
    # Metadata
    priority: int = 3  # 1=critical, 5=low
    tags: List[str] = field(default_factory=list)
    notes: str = ""

class WorkflowScheduler:
    """Intelligent scheduler for workflow execution"""
    
    def __init__(self):
        self.scheduled_workflows: Dict[str, WorkflowInstance] = {}
        self.recurring_schedules: Dict[str, Dict[str, Any]] = {}
        self.schedule_queue: deque = deque()
        
        # Optimization parameters
        self.max_concurrent_workflows = 10
        self.resource_utilization_threshold = 0.8
        self.priority_weights = {1: 1.0, 2: 0.8, 3: 0.6, 4: 0.4, 5: 0.2}
    
    async def schedule_workflow(
        self, 
        workflow: WorkflowInstance, 
        schedule_time: Optional[datetime] = None
    ) -> bool:
        """Schedule a workflow for execution"""
        
        if schedule_time is None:
            schedule_time = datetime.now(timezone.utc)
        
        workflow.scheduled_at = schedule_time
        workflow.status = WorkflowStatus.SCHEDULED
        
        # Add to schedule queue with priority sorting
        self.schedule_queue.append((schedule_time, workflow.priority, workflow))
        self._sort_schedule_queue()
        
        self.scheduled_workflows[workflow.instance_id] = workflow
        
        logger.info(
            "Workflow scheduled",
            workflow_id=workflow.instance_id,
            name=workflow.name,
            scheduled_at=schedule_time.isoformat(),
            priority=workflow.priority
        )
        
        return True
    
    async def create_recurring_schedule(
        self,
        template_id: str,
        organization_id: str,
        cron_expression: str,
        parameters: Dict[str, Any] = None
    ) -> str:
        """Create a recurring workflow schedule"""
        
        schedule_id = str(uuid.uuid4())
        
        self.recurring_schedules[schedule_id] = {
            "template_id": template_id,
            "organization_id": organization_id,
            "cron_expression": cron_expression,
            "parameters": parameters or {},
            "is_active": True,
            "last_run": None,
            "next_run": self._calculate_next_run(cron_expression),
            "created_at": datetime.now(timezone.utc)
        }
        
        logger.info(
            "Recurring schedule created",
            schedule_id=schedule_id,
            template_id=template_id,
            cron_expression=cron_expression
        )
        
        return schedule_id
    
    def _sort_schedule_queue(self):
        """Sort schedule queue by time and priority"""
        self.schedule_queue = deque(sorted(
            self.schedule_queue,
            key=lambda x: (x[0], -x[1])  # Sort by time, then priority (descending)
        ))
    
    def _calculate_next_run(self, cron_expression: str) -> datetime:
        """Calculate next run time from cron expression"""
        from croniter import croniter
        
        base_time = datetime.now(timezone.utc)
        cron = croniter(cron_expression, base_time)
        return cron.get_next(datetime)
    
    async def get_next_scheduled_workflow(self) -> Optional[WorkflowInstance]:
        """Get the next workflow ready for execution"""
        current_time = datetime.now(timezone.utc)
        
        while self.schedule_queue:
            schedule_time, priority, workflow = self.schedule_queue[0]
            
            if schedule_time <= current_time:
                self.schedule_queue.popleft()
                return workflow
            else:
                break
        
        return None
    
    async def check_recurring_schedules(self):
        """Check and create instances for recurring schedules"""
        current_time = datetime.now(timezone.utc)
        
        for schedule_id, schedule in self.recurring_schedules.items():
            if not schedule["is_active"]:
                continue
            
            next_run = schedule["next_run"]
            if next_run <= current_time:
                # Create workflow instance
                await self._create_recurring_instance(schedule_id, schedule)
                
                # Update next run time
                schedule["last_run"] = current_time
                schedule["next_run"] = self._calculate_next_run(schedule["cron_expression"])
    
    async def _create_recurring_instance(self, schedule_id: str, schedule: Dict[str, Any]):
        """Create workflow instance from recurring schedule"""
        # This would create a new WorkflowInstance from the template
        # Implementation depends on workflow template registry
        pass

class WorkflowExecutor:
    """Executes workflow instances with intelligent coordination"""
    
    def __init__(self, ml_pipeline: MLPipeline):
        self.ml_pipeline = ml_pipeline
        self.active_workflows: Dict[str, WorkflowInstance] = {}
        self.step_handlers: Dict[TaskType, Callable] = {}
        
        # Execution statistics
        self.execution_stats = {
            "workflows_executed": 0,
            "workflows_succeeded": 0,
            "workflows_failed": 0,
            "average_duration": 0.0,
            "total_evidence_collected": 0
        }
        
        # Learning and optimization
        self.performance_history: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        self.optimization_models: Dict[str, Any] = {}
    
    async def execute_workflow(self, workflow: WorkflowInstance) -> bool:
        """Execute a complete workflow"""
        
        workflow.status = WorkflowStatus.RUNNING
        workflow.started_at = datetime.now(timezone.utc)
        self.active_workflows[workflow.instance_id] = workflow
        
        logger.info(
            "Starting workflow execution",
            workflow_id=workflow.instance_id,
            name=workflow.name,
            steps_count=len(workflow.steps)
        )
        
        try:
            # Execute workflow steps
            success = await self._execute_workflow_steps(workflow)
            
            if success:
                workflow.status = WorkflowStatus.COMPLETED
                workflow.success_rate = self._calculate_success_rate(workflow)
                self.execution_stats["workflows_succeeded"] += 1
            else:
                workflow.status = WorkflowStatus.FAILED
                self.execution_stats["workflows_failed"] += 1
            
            workflow.completed_at = datetime.now(timezone.utc)
            if workflow.started_at:
                workflow.actual_duration = (
                    workflow.completed_at - workflow.started_at
                ).total_seconds()
            
            # Record performance data for learning
            await self._record_performance_data(workflow)
            
            # Update statistics
            self.execution_stats["workflows_executed"] += 1
            self._update_average_duration(workflow.actual_duration or 0)
            
            # Clean up
            del self.active_workflows[workflow.instance_id]
            
            logger.info(
                "Workflow execution completed",
                workflow_id=workflow.instance_id,
                status=workflow.status.value,
                duration=workflow.actual_duration,
                success_rate=workflow.success_rate
            )
            
            return success
            
        except Exception as e:
            workflow.status = WorkflowStatus.FAILED
            workflow.completed_at = datetime.now(timezone.utc)
            
            logger.error(
                "Workflow execution failed",
                workflow_id=workflow.instance_id,
                error=str(e)
            )
            
            return False
    
    async def _execute_workflow_steps(self, workflow: WorkflowInstance) -> bool:
        """Execute all steps in a workflow with dependency resolution"""
        
        completed_steps: Set[str] = set()
        failed_steps: Set[str] = set()
        
        # Create dependency graph
        dependency_graph = self._build_dependency_graph(workflow.steps)
        
        while len(completed_steps) < len(workflow.steps):
            # Find steps ready to execute
            ready_steps = []
            for step in workflow.steps:
                if (step.step_id not in completed_steps and 
                    step.step_id not in failed_steps and
                    all(dep in completed_steps for dep in step.depends_on)):
                    ready_steps.append(step)
            
            if not ready_steps:
                # Check if we have failed dependencies
                if failed_steps:
                    logger.warning(
                        "Workflow stopped due to failed dependencies",
                        workflow_id=workflow.instance_id,
                        failed_steps=list(failed_steps)
                    )
                    return False
                break
            
            # Execute ready steps (potentially in parallel)
            execution_results = await self._execute_steps_batch(ready_steps, workflow)
            
            # Process results
            for step, success in execution_results.items():
                if success:
                    completed_steps.add(step.step_id)
                    workflow.current_step = step.step_id
                else:
                    failed_steps.add(step.step_id)
                    
                    # Check if this step is critical
                    if not self._can_continue_without_step(step, workflow):
                        return False
        
        return len(failed_steps) == 0
    
    async def _execute_steps_batch(
        self, 
        steps: List[WorkflowStep], 
        workflow: WorkflowInstance
    ) -> Dict[WorkflowStep, bool]:
        """Execute a batch of steps, potentially in parallel"""
        
        results = {}
        
        # Separate steps by automation level
        automated_steps = [s for s in steps if s.automation_level == AutomationLevel.FULLY_AUTOMATED]
        manual_steps = [s for s in steps if s.automation_level in [AutomationLevel.MANUAL, AutomationLevel.SEMI_AUTOMATED]]
        
        # Execute automated steps in parallel
        if automated_steps:
            automated_results = await asyncio.gather(
                *[self._execute_single_step(step, workflow) for step in automated_steps],
                return_exceptions=True
            )
            
            for step, result in zip(automated_steps, automated_results):
                results[step] = not isinstance(result, Exception) and result
        
        # Handle manual/semi-automated steps
        for step in manual_steps:
            if step.automation_level == AutomationLevel.SEMI_AUTOMATED:
                # AI suggests, then wait for approval if required
                suggestion = await self._generate_step_suggestion(step, workflow)
                
                if step.requires_approval:
                    await self._request_approval(step, workflow, suggestion)
                    # For now, assume approval (would integrate with approval system)
                
                results[step] = await self._execute_single_step(step, workflow)
            else:
                # Pure manual step - create task for human
                await self._create_manual_task(step, workflow)
                results[step] = True  # Assume will be completed manually
        
        return results
    
    async def _execute_single_step(self, step: WorkflowStep, workflow: WorkflowInstance) -> bool:
        """Execute a single workflow step"""
        
        step.status = TaskStatus.IN_PROGRESS
        step.started_at = datetime.now(timezone.utc)
        
        try:
            # Prepare input data
            input_data = await self._prepare_step_input(step, workflow)
            
            # Create agent task
            agent_task = AgentTask(
                task_id=str(uuid.uuid4()),
                task_type=step.task_type,
                priority=self._convert_workflow_priority(workflow.priority),
                target_agent=step.target_agent,
                organization_id=workflow.organization_id,
                input_data=input_data,
                configuration=step.input_template,
                estimated_duration=step.timeout_minutes * 60,
                context={
                    "workflow_id": workflow.instance_id,
                    "step_id": step.step_id,
                    "automation_level": step.automation_level.value
                }
            )
            
            # Submit task to orchestrator
            task_id = await orchestrator.submit_task(agent_task)
            
            # Wait for completion
            success = await self._wait_for_task_completion(task_id, step.timeout_minutes * 60)
            
            if success:
                # Get task results
                completed_task = orchestrator.completed_tasks.get(task_id)
                if completed_task:
                    step.output_data = completed_task.output_data
                    workflow.results[step.step_id] = completed_task.output_data
                    
                    # Update workflow metrics
                    self._update_workflow_metrics(workflow, step, completed_task.output_data)
                
                step.status = TaskStatus.COMPLETED
                step.completed_at = datetime.now(timezone.utc)
                
                logger.info(
                    "Workflow step completed",
                    workflow_id=workflow.instance_id,
                    step_id=step.step_id,
                    task_id=task_id
                )
                
                return True
            else:
                step.status = TaskStatus.FAILED
                step.error_message = "Task execution timeout or failure"
                step.completed_at = datetime.now(timezone.utc)
                
                logger.error(
                    "Workflow step failed",
                    workflow_id=workflow.instance_id,
                    step_id=step.step_id,
                    error=step.error_message
                )
                
                return False
                
        except Exception as e:
            step.status = TaskStatus.FAILED
            step.error_message = str(e)
            step.completed_at = datetime.now(timezone.utc)
            
            logger.error(
                "Workflow step execution error",
                workflow_id=workflow.instance_id,
                step_id=step.step_id,
                error=str(e)
            )
            
            return False
    
    async def _wait_for_task_completion(self, task_id: str, timeout_seconds: float) -> bool:
        """Wait for an agent task to complete"""
        
        start_time = time.time()
        
        while time.time() - start_time < timeout_seconds:
            if task_id in orchestrator.completed_tasks:
                completed_task = orchestrator.completed_tasks[task_id]
                return completed_task.status == TaskStatus.COMPLETED
            
            await asyncio.sleep(5)  # Check every 5 seconds
        
        return False
    
    def _build_dependency_graph(self, steps: List[WorkflowStep]) -> Dict[str, List[str]]:
        """Build dependency graph from workflow steps"""
        graph = {}
        for step in steps:
            graph[step.step_id] = step.depends_on.copy()
        return graph
    
    def _can_continue_without_step(self, failed_step: WorkflowStep, workflow: WorkflowInstance) -> bool:
        """Determine if workflow can continue without a failed step"""
        # Check if any remaining steps depend on this failed step
        for step in workflow.steps:
            if failed_step.step_id in step.depends_on:
                return False
        return True
    
    async def _prepare_step_input(self, step: WorkflowStep, workflow: WorkflowInstance) -> Dict[str, Any]:
        """Prepare input data for a workflow step"""
        input_data = step.input_template.copy()
        
        # Merge data from previous steps
        for dep_step_id in step.depends_on:
            if dep_step_id in workflow.results:
                input_data.update(workflow.results[dep_step_id])
        
        # Add workflow context
        input_data.update({
            "workflow_id": workflow.instance_id,
            "organization_id": workflow.organization_id,
            "trigger_data": workflow.trigger_data
        })
        
        return input_data
    
    def _convert_workflow_priority(self, workflow_priority: int) -> 'TaskPriority':
        """Convert workflow priority to task priority"""
        from agent_orchestration import TaskPriority
        
        priority_mapping = {
            1: TaskPriority.CRITICAL,
            2: TaskPriority.HIGH,
            3: TaskPriority.MEDIUM,
            4: TaskPriority.LOW,
            5: TaskPriority.BACKGROUND
        }
        
        return priority_mapping.get(workflow_priority, TaskPriority.MEDIUM)
    
    def _update_workflow_metrics(self, workflow: WorkflowInstance, step: WorkflowStep, output_data: Dict[str, Any]):
        """Update workflow metrics based on step results"""
        
        # Count evidence collected
        if "evidence_items" in output_data:
            evidence_count = len(output_data["evidence_items"])
            workflow.evidence_collected += evidence_count
            self.execution_stats["total_evidence_collected"] += evidence_count
        
        # Count controls validated
        if "controls_validated" in output_data:
            workflow.controls_validated += output_data["controls_validated"]
        
        # Count issues found
        if "issues" in output_data:
            workflow.issues_found += len(output_data["issues"])
    
    def _calculate_success_rate(self, workflow: WorkflowInstance) -> float:
        """Calculate success rate for workflow"""
        completed_steps = sum(1 for step in workflow.steps if step.status == TaskStatus.COMPLETED)
        total_steps = len(workflow.steps)
        
        return completed_steps / total_steps if total_steps > 0 else 0.0
    
    def _update_average_duration(self, duration: float):
        """Update average execution duration"""
        current_avg = self.execution_stats["average_duration"]
        total_executed = self.execution_stats["workflows_executed"]
        
        if total_executed == 1:
            self.execution_stats["average_duration"] = duration
        else:
            self.execution_stats["average_duration"] = (
                (current_avg * (total_executed - 1) + duration) / total_executed
            )
    
    async def _record_performance_data(self, workflow: WorkflowInstance):
        """Record performance data for machine learning"""
        
        performance_record = {
            "workflow_id": workflow.instance_id,
            "template_id": workflow.template_id,
            "duration": workflow.actual_duration,
            "success_rate": workflow.success_rate,
            "evidence_collected": workflow.evidence_collected,
            "controls_validated": workflow.controls_validated,
            "issues_found": workflow.issues_found,
            "step_count": len(workflow.steps),
            "organization_id": workflow.organization_id,
            "completed_at": workflow.completed_at.isoformat() if workflow.completed_at else None
        }
        
        self.performance_history[workflow.template_id].append(performance_record)
        
        # Limit history size
        if len(self.performance_history[workflow.template_id]) > 100:
            self.performance_history[workflow.template_id] = \
                self.performance_history[workflow.template_id][-100:]
    
    async def _generate_step_suggestion(self, step: WorkflowStep, workflow: WorkflowInstance) -> Dict[str, Any]:
        """Generate AI suggestion for semi-automated step"""
        
        # Use ML pipeline to generate suggestions
        try:
            model_id = f"workflow_optimization_{step.task_type.value}"
            input_data = {
                "step_type": step.task_type.value,
                "workflow_context": workflow.trigger_data,
                "organization_id": workflow.organization_id,
                "historical_performance": self.performance_history.get(workflow.template_id, [])
            }
            
            suggestion = await self.ml_pipeline.predict(model_id, input_data)
            
            return {
                "suggested_action": suggestion,
                "confidence": 0.8,  # Would come from model
                "reasoning": f"Based on {step.task_type.value} historical patterns"
            }
            
        except Exception as e:
            logger.warning(f"Failed to generate AI suggestion: {e}")
            return {
                "suggested_action": "manual_review_required",
                "confidence": 0.0,
                "reasoning": "AI suggestion unavailable"
            }
    
    async def _request_approval(self, step: WorkflowStep, workflow: WorkflowInstance, suggestion: Dict[str, Any]):
        """Request human approval for step execution"""
        
        approval_request = {
            "workflow_id": workflow.instance_id,
            "step_id": step.step_id,
            "step_name": step.name,
            "suggestion": suggestion,
            "required_roles": step.approval_roles,
            "timeout_minutes": step.timeout_minutes
        }
        
        # Send approval request via communication hub
        message = AgentMessage(
            message_id=str(uuid.uuid4()),
            sender=AgentType.NEXUS,  # Workflow engine
            recipient="approval_channel",
            message_type=MessageType.WORKFLOW_SIGNAL,
            priority=MessagePriority.HIGH,
            payload=approval_request
        )
        
        await communication_hub.send_message(message)
    
    async def _create_manual_task(self, step: WorkflowStep, workflow: WorkflowInstance):
        """Create manual task for human completion"""
        
        manual_task = {
            "workflow_id": workflow.instance_id,
            "step_id": step.step_id,
            "task_name": step.name,
            "description": step.description,
            "requirements": step.output_requirements,
            "assigned_roles": step.approval_roles,
            "due_date": (datetime.now(timezone.utc) + timedelta(minutes=step.timeout_minutes)).isoformat()
        }
        
        # Send to task management system
        message = AgentMessage(
            message_id=str(uuid.uuid4()),
            sender=AgentType.NEXUS,
            recipient="task_management",
            message_type=MessageType.TASK_REQUEST,
            priority=MessagePriority.NORMAL,
            payload=manual_task
        )
        
        await communication_hub.send_message(message)

class WorkflowTemplateLibrary:
    """Library of pre-built workflow templates"""
    
    def __init__(self):
        self.templates: Dict[str, WorkflowTemplate] = {}
        self._initialize_default_templates()
    
    def _initialize_default_templates(self):
        """Initialize default workflow templates"""
        
        # SOC 2 Type II Audit Workflow
        soc2_audit = WorkflowTemplate(
            template_id="soc2_type2_audit",
            name="SOC 2 Type II Audit",
            description="Comprehensive SOC 2 Type II audit workflow with automated evidence collection",
            workflow_type=WorkflowType.COMPLIANCE_AUDIT,
            steps=[
                WorkflowStep(
                    step_id="planning",
                    name="Audit Planning",
                    description="Plan audit scope and timeline",
                    task_type=TaskType.POLICY_ANALYSIS,
                    target_agent=AgentType.COMPASS,
                    automation_level=AutomationLevel.SEMI_AUTOMATED,
                    timeout_minutes=60
                ),
                WorkflowStep(
                    step_id="security_assessment",
                    name="Security Controls Assessment",
                    description="Assess security controls implementation",
                    task_type=TaskType.SECURITY_SCAN,
                    target_agent=AgentType.ATLAS,
                    depends_on=["planning"],
                    automation_level=AutomationLevel.FULLY_AUTOMATED,
                    timeout_minutes=120
                ),
                WorkflowStep(
                    step_id="evidence_collection",
                    name="Evidence Collection",
                    description="Collect evidence for all SOC 2 controls",
                    task_type=TaskType.EVIDENCE_COLLECTION,
                    target_agent=AgentType.CLEARANCE,
                    depends_on=["security_assessment"],
                    automation_level=AutomationLevel.FULLY_AUTOMATED,
                    timeout_minutes=180
                ),
                WorkflowStep(
                    step_id="risk_analysis",
                    name="Risk Analysis",
                    description="Analyze risks and control effectiveness",
                    task_type=TaskType.RISK_ASSESSMENT,
                    target_agent=AgentType.PRISM,
                    depends_on=["evidence_collection"],
                    automation_level=AutomationLevel.FULLY_AUTOMATED,
                    timeout_minutes=90
                ),
                WorkflowStep(
                    step_id="report_generation",
                    name="Audit Report Generation",
                    description="Generate comprehensive audit report",
                    task_type=TaskType.REPORT_GENERATION,
                    target_agent=AgentType.COMPASS,
                    depends_on=["risk_analysis"],
                    automation_level=AutomationLevel.SEMI_AUTOMATED,
                    requires_approval=True,
                    approval_roles=["compliance_manager", "auditor"],
                    timeout_minutes=120
                )
            ],
            applicable_frameworks=[Framework.SOC2],
            applicable_platforms=[Platform.AWS, Platform.GCP, Platform.AZURE]
        )
        
        # Continuous Monitoring Workflow
        continuous_monitoring = WorkflowTemplate(
            template_id="continuous_monitoring",
            name="Continuous Compliance Monitoring",
            description="Automated continuous monitoring of compliance controls",
            workflow_type=WorkflowType.CONTINUOUS_MONITORING,
            steps=[
                WorkflowStep(
                    step_id="daily_scan",
                    name="Daily Security Scan",
                    description="Automated daily security scanning",
                    task_type=TaskType.SECURITY_SCAN,
                    target_agent=AgentType.ATLAS,
                    automation_level=AutomationLevel.FULLY_AUTOMATED,
                    timeout_minutes=30
                ),
                WorkflowStep(
                    step_id="evidence_validation",
                    name="Evidence Validation",
                    description="Validate collected evidence",
                    task_type=TaskType.DATA_VALIDATION,
                    target_agent=AgentType.CLEARANCE,
                    depends_on=["daily_scan"],
                    automation_level=AutomationLevel.FULLY_AUTOMATED,
                    timeout_minutes=15
                ),
                WorkflowStep(
                    step_id="anomaly_detection",
                    name="Anomaly Detection",
                    description="Detect compliance anomalies",
                    task_type=TaskType.PREDICTIVE_ANALYSIS,
                    target_agent=AgentType.PRISM,
                    depends_on=["evidence_validation"],
                    automation_level=AutomationLevel.FULLY_AUTOMATED,
                    timeout_minutes=20
                ),
                WorkflowStep(
                    step_id="alert_generation",
                    name="Generate Alerts",
                    description="Generate alerts for critical issues",
                    task_type=TaskType.REPORT_GENERATION,
                    target_agent=AgentType.COMPASS,
                    depends_on=["anomaly_detection"],
                    automation_level=AutomationLevel.FULLY_AUTOMATED,
                    timeout_minutes=10
                )
            ],
            applicable_frameworks=list(Framework),
            applicable_platforms=list(Platform),
            default_automation_level=AutomationLevel.FULLY_AUTOMATED
        )
        
        self.templates["soc2_type2_audit"] = soc2_audit
        self.templates["continuous_monitoring"] = continuous_monitoring
    
    def get_template(self, template_id: str) -> Optional[WorkflowTemplate]:
        """Get workflow template by ID"""
        return self.templates.get(template_id)
    
    def list_templates(
        self, 
        workflow_type: Optional[WorkflowType] = None,
        framework: Optional[Framework] = None
    ) -> List[WorkflowTemplate]:
        """List available templates with optional filtering"""
        
        templates = list(self.templates.values())
        
        if workflow_type:
            templates = [t for t in templates if t.workflow_type == workflow_type]
        
        if framework:
            templates = [t for t in templates if framework in t.applicable_frameworks]
        
        return templates
    
    def create_custom_template(self, template: WorkflowTemplate) -> bool:
        """Create custom workflow template"""
        try:
            self.templates[template.template_id] = template
            return True
        except Exception as e:
            logger.error(f"Failed to create custom template: {e}")
            return False

class WorkflowEngine:
    """Main workflow automation engine"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.scheduler = WorkflowScheduler()
        self.executor = None  # Will be initialized in start()
        self.template_library = WorkflowTemplateLibrary()
        
        # Engine state
        self.is_running = False
        self.engine_task = None
        
        # Performance tracking
        self.metrics = {
            "workflows_processed": 0,
            "average_success_rate": 0.0,
            "total_evidence_collected": 0,
            "automation_efficiency": 0.0
        }
    
    async def start(self):
        """Start the workflow engine"""
        
        # Initialize ML pipeline
        ml_pipeline = await get_ml_pipeline(self.db)
        self.executor = WorkflowExecutor(ml_pipeline)
        
        self.is_running = True
        self.engine_task = asyncio.create_task(self._engine_loop())
        
        logger.info("Workflow automation engine started")
    
    async def stop(self):
        """Stop the workflow engine"""
        self.is_running = False
        
        if self.engine_task:
            await self.engine_task
        
        logger.info("Workflow automation engine stopped")
    
    async def _engine_loop(self):
        """Main engine processing loop"""
        
        while self.is_running:
            try:
                # Check for recurring schedules
                await self.scheduler.check_recurring_schedules()
                
                # Get next scheduled workflow
                workflow = await self.scheduler.get_next_scheduled_workflow()
                
                if workflow:
                    # Execute workflow
                    success = await self.executor.execute_workflow(workflow)
                    
                    # Update metrics
                    self._update_engine_metrics(workflow, success)
                
                # Check for workflow optimization opportunities
                await self._optimize_workflows()
                
                await asyncio.sleep(10)  # Check every 10 seconds
                
            except Exception as e:
                logger.error(f"Workflow engine error: {e}")
                await asyncio.sleep(30)  # Back off on error
    
    async def create_workflow_instance(
        self,
        template_id: str,
        organization_id: str,
        trigger: WorkflowTrigger,
        triggered_by: str,
        parameters: Dict[str, Any] = None,
        schedule_time: Optional[datetime] = None
    ) -> Optional[str]:
        """Create and schedule workflow instance"""
        
        template = self.template_library.get_template(template_id)
        if not template:
            logger.error(f"Template not found: {template_id}")
            return None
        
        # Create workflow instance
        instance = WorkflowInstance(
            instance_id=str(uuid.uuid4()),
            template_id=template_id,
            name=template.name,
            organization_id=organization_id,
            trigger=trigger,
            triggered_by=triggered_by,
            trigger_data=parameters or {},
            steps=[step for step in template.steps]  # Deep copy steps
        )
        
        # Schedule workflow
        success = await self.scheduler.schedule_workflow(instance, schedule_time)
        
        if success:
            logger.info(
                "Workflow instance created and scheduled",
                instance_id=instance.instance_id,
                template_id=template_id,
                organization_id=organization_id
            )
            return instance.instance_id
        
        return None
    
    async def get_workflow_status(self, instance_id: str) -> Optional[Dict[str, Any]]:
        """Get status of workflow instance"""
        
        # Check active workflows
        if instance_id in self.executor.active_workflows:
            workflow = self.executor.active_workflows[instance_id]
            return self._serialize_workflow_status(workflow)
        
        # Check scheduled workflows
        if instance_id in self.scheduler.scheduled_workflows:
            workflow = self.scheduler.scheduled_workflows[instance_id]
            return self._serialize_workflow_status(workflow)
        
        return None
    
    def _serialize_workflow_status(self, workflow: WorkflowInstance) -> Dict[str, Any]:
        """Serialize workflow status for API response"""
        return {
            "instance_id": workflow.instance_id,
            "name": workflow.name,
            "status": workflow.status.value,
            "trigger": workflow.trigger.value,
            "progress": self._calculate_progress(workflow),
            "started_at": workflow.started_at.isoformat() if workflow.started_at else None,
            "estimated_completion": self._estimate_completion_time(workflow),
            "current_step": workflow.current_step,
            "steps": [
                {
                    "step_id": step.step_id,
                    "name": step.name,
                    "status": step.status.value,
                    "automation_level": step.automation_level.value
                }
                for step in workflow.steps
            ],
            "metrics": {
                "evidence_collected": workflow.evidence_collected,
                "controls_validated": workflow.controls_validated,
                "issues_found": workflow.issues_found
            }
        }
    
    def _calculate_progress(self, workflow: WorkflowInstance) -> float:
        """Calculate workflow progress percentage"""
        if not workflow.steps:
            return 0.0
        
        completed_steps = sum(1 for step in workflow.steps if step.status == TaskStatus.COMPLETED)
        return (completed_steps / len(workflow.steps)) * 100
    
    def _estimate_completion_time(self, workflow: WorkflowInstance) -> Optional[str]:
        """Estimate workflow completion time"""
        if workflow.status != WorkflowStatus.RUNNING or not workflow.started_at:
            return None
        
        completed_steps = sum(1 for step in workflow.steps if step.status == TaskStatus.COMPLETED)
        total_steps = len(workflow.steps)
        
        if completed_steps == 0:
            return None
        
        elapsed_time = (datetime.now(timezone.utc) - workflow.started_at).total_seconds()
        estimated_total_time = (elapsed_time / completed_steps) * total_steps
        estimated_completion = workflow.started_at + timedelta(seconds=estimated_total_time)
        
        return estimated_completion.isoformat()
    
    def _update_engine_metrics(self, workflow: WorkflowInstance, success: bool):
        """Update engine performance metrics"""
        self.metrics["workflows_processed"] += 1
        
        # Update success rate
        current_success_rate = self.metrics["average_success_rate"]
        total_processed = self.metrics["workflows_processed"]
        
        if total_processed == 1:
            self.metrics["average_success_rate"] = 1.0 if success else 0.0
        else:
            success_value = 1.0 if success else 0.0
            self.metrics["average_success_rate"] = (
                (current_success_rate * (total_processed - 1) + success_value) / total_processed
            )
        
        # Update evidence collected
        self.metrics["total_evidence_collected"] += workflow.evidence_collected
        
        # Calculate automation efficiency
        automated_steps = sum(
            1 for step in workflow.steps 
            if step.automation_level == AutomationLevel.FULLY_AUTOMATED and 
               step.status == TaskStatus.COMPLETED
        )
        total_steps = len(workflow.steps)
        
        if total_steps > 0:
            workflow_automation = automated_steps / total_steps
            current_efficiency = self.metrics["automation_efficiency"]
            
            self.metrics["automation_efficiency"] = (
                (current_efficiency * (total_processed - 1) + workflow_automation) / total_processed
            )
    
    async def _optimize_workflows(self):
        """Optimize workflow execution based on performance data"""
        
        # Analyze performance patterns
        if self.executor and len(self.executor.performance_history) > 0:
            # Find slow-performing templates
            for template_id, history in self.executor.performance_history.items():
                if len(history) >= 5:  # Need sufficient data
                    avg_duration = sum(record["duration"] for record in history[-5:]) / 5
                    avg_success_rate = sum(record["success_rate"] for record in history[-5:]) / 5
                    
                    # If performance is degrading, trigger optimization
                    if avg_success_rate < 0.8 or avg_duration > 3600:  # 1 hour
                        await self._trigger_workflow_optimization(template_id, history)
    
    async def _trigger_workflow_optimization(self, template_id: str, history: List[Dict[str, Any]]):
        """Trigger optimization for underperforming workflow"""
        
        logger.info(
            "Triggering workflow optimization",
            template_id=template_id,
            avg_success_rate=sum(r["success_rate"] for r in history[-5:]) / 5,
            avg_duration=sum(r["duration"] for r in history[-5:]) / 5
        )
        
        # This would trigger ML-based optimization
        # For now, log the optimization opportunity
        
    def get_engine_metrics(self) -> Dict[str, Any]:
        """Get engine performance metrics"""
        return {
            "metrics": self.metrics,
            "active_workflows": len(self.executor.active_workflows) if self.executor else 0,
            "scheduled_workflows": len(self.scheduler.scheduled_workflows),
            "recurring_schedules": len(self.scheduler.recurring_schedules),
            "available_templates": len(self.template_library.templates)
        }

# Global workflow engine instance
workflow_engine = None

async def get_workflow_engine(db: Session) -> WorkflowEngine:
    """Get or create workflow engine instance"""
    global workflow_engine
    if workflow_engine is None:
        workflow_engine = WorkflowEngine(db)
        await workflow_engine.start()
    return workflow_engine