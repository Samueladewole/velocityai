"""
AI Agent Orchestration System for Velocity AI Platform
Coordinates the 10-agent AI compliance system with intelligent workflow management
"""

import asyncio
import json
import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional, Callable, Union
from enum import Enum
from dataclasses import dataclass, field, asdict
from collections import defaultdict, deque
import logging

from pydantic import BaseModel, Field
import structlog
from sqlalchemy.orm import Session

from models import User, Agent, Organization, Framework, Platform
from rbac import UserRole, Permission

logger = structlog.get_logger()

# Agent Types - The 10 Specialized AI Agents
class AgentType(Enum):
    """The 10 specialized AI agents in the Velocity platform"""
    COMPASS = "compass"                    # Agent 1: Regulatory Intelligence Engine
    ATLAS = "atlas"                        # Agent 2: Security Assessment System
    NEXUS = "nexus"                        # Agent 3: Advanced Intelligence Platform
    BEACON = "beacon"                      # Agent 4: Value Demonstration Platform
    PRISM = "prism"                        # Agent 5: Risk Quantification Engine
    PULSE = "pulse"                        # Agent 6: Real-time Analytics
    CIPHER = "cipher"                      # Agent 7: Policy Automation
    CLEARANCE = "clearance"                # Agent 8: Evidence Collection & Validation
    NEXUS_INTELLIGENCE = "nexus_intel"     # Agent 9: Advanced Intelligence Platform
    CRYPTO_VERIFICATION = "crypto_verify"  # Agent 10: Cryptographic Verification

class TaskType(Enum):
    """Types of tasks agents can perform"""
    EVIDENCE_COLLECTION = "evidence_collection"
    RISK_ASSESSMENT = "risk_assessment"
    COMPLIANCE_CHECK = "compliance_check"
    POLICY_ANALYSIS = "policy_analysis"
    SECURITY_SCAN = "security_scan"
    REPORT_GENERATION = "report_generation"
    DATA_VALIDATION = "data_validation"
    PREDICTIVE_ANALYSIS = "predictive_analysis"
    WORKFLOW_ORCHESTRATION = "workflow_orchestration"
    CRYPTO_VERIFICATION = "crypto_verification"

class TaskStatus(Enum):
    """Task execution status"""
    PENDING = "pending"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    WAITING_DEPENDENCIES = "waiting_dependencies"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    RETRY = "retry"

class TaskPriority(Enum):
    """Task priority levels"""
    CRITICAL = 1
    HIGH = 2
    MEDIUM = 3
    LOW = 4
    BACKGROUND = 5

@dataclass
class AgentCapability:
    """Defines what an agent can do"""
    agent_type: AgentType
    supported_tasks: List[TaskType]
    supported_platforms: List[Platform]
    supported_frameworks: List[Framework]
    max_concurrent_tasks: int = 3
    average_execution_time: float = 60.0  # seconds
    specialization_score: Dict[TaskType, float] = field(default_factory=dict)
    dependencies: List[AgentType] = field(default_factory=list)
    outputs: List[str] = field(default_factory=list)

@dataclass
class AgentTask:
    """A task that can be executed by an agent"""
    task_id: str
    task_type: TaskType
    priority: TaskPriority
    target_agent: Optional[AgentType] = None
    organization_id: str = ""
    user_id: str = ""
    
    # Task configuration
    input_data: Dict[str, Any] = field(default_factory=dict)
    configuration: Dict[str, Any] = field(default_factory=dict)
    dependencies: List[str] = field(default_factory=list)  # Task IDs this task depends on
    
    # Execution tracking
    status: TaskStatus = TaskStatus.PENDING
    assigned_agent: Optional[str] = None  # Agent instance ID
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    # Results
    output_data: Dict[str, Any] = field(default_factory=dict)
    error_message: Optional[str] = None
    retry_count: int = 0
    max_retries: int = 3
    
    # Metadata
    estimated_duration: float = 60.0  # seconds
    actual_duration: Optional[float] = None
    context: Dict[str, Any] = field(default_factory=dict)

@dataclass
class AgentInstance:
    """A running instance of an AI agent"""
    instance_id: str
    agent_type: AgentType
    organization_id: str
    
    # Status
    is_active: bool = True
    current_tasks: List[str] = field(default_factory=list)  # Task IDs
    capacity_used: int = 0
    max_capacity: int = 3
    
    # Performance
    total_tasks_completed: int = 0
    total_execution_time: float = 0.0
    success_rate: float = 1.0
    last_activity: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Health
    health_status: str = "healthy"  # healthy, degraded, unhealthy
    error_count: int = 0
    last_error: Optional[str] = None

class WorkflowDefinition(BaseModel):
    """Defines a multi-agent workflow"""
    workflow_id: str
    name: str
    description: str
    framework: Framework
    
    # Workflow structure
    tasks: List[Dict[str, Any]]  # Task definitions
    dependencies: Dict[str, List[str]]  # Task dependencies
    parallel_groups: List[List[str]] = []  # Tasks that can run in parallel
    
    # Configuration
    timeout_minutes: int = 60
    retry_policy: Dict[str, Any] = {}
    success_criteria: Dict[str, Any] = {}
    
    # Metadata
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    version: str = "1.0"

class AgentOrchestrator:
    """Main orchestration engine for the 10-agent AI system"""
    
    def __init__(self):
        self.agent_capabilities = self._initialize_agent_capabilities()
        self.agent_instances: Dict[str, AgentInstance] = {}
        self.task_queue: Dict[TaskPriority, deque] = {
            priority: deque() for priority in TaskPriority
        }
        self.active_tasks: Dict[str, AgentTask] = {}
        self.completed_tasks: Dict[str, AgentTask] = {}
        self.workflows: Dict[str, WorkflowDefinition] = {}
        
        # Communication system
        self.message_bus = AsyncMessageBus()
        self.context_manager = AgentContextManager()
        
        # Performance tracking
        self.performance_metrics = defaultdict(list)
        self.optimization_history = []
        
        # Background tasks
        self._running = False
        self._orchestration_task = None
    
    def _initialize_agent_capabilities(self) -> Dict[AgentType, AgentCapability]:
        """Initialize the capabilities of each specialized agent"""
        return {
            AgentType.COMPASS: AgentCapability(
                agent_type=AgentType.COMPASS,
                supported_tasks=[
                    TaskType.COMPLIANCE_CHECK,
                    TaskType.POLICY_ANALYSIS,
                    TaskType.REPORT_GENERATION
                ],
                supported_platforms=[Platform.AWS, Platform.GCP, Platform.AZURE],
                supported_frameworks=[Framework.SOC2, Framework.ISO27001, Framework.GDPR],
                max_concurrent_tasks=5,
                average_execution_time=45.0,
                specialization_score={
                    TaskType.COMPLIANCE_CHECK: 0.95,
                    TaskType.POLICY_ANALYSIS: 0.90,
                    TaskType.REPORT_GENERATION: 0.85
                },
                outputs=["compliance_report", "policy_recommendations", "regulatory_updates"]
            ),
            
            AgentType.ATLAS: AgentCapability(
                agent_type=AgentType.ATLAS,
                supported_tasks=[
                    TaskType.SECURITY_SCAN,
                    TaskType.EVIDENCE_COLLECTION,
                    TaskType.DATA_VALIDATION
                ],
                supported_platforms=[Platform.AWS, Platform.GCP, Platform.AZURE, Platform.GITHUB],
                supported_frameworks=[Framework.ISO27001, Framework.CIS_CONTROLS],
                max_concurrent_tasks=4,
                average_execution_time=120.0,
                specialization_score={
                    TaskType.SECURITY_SCAN: 0.95,
                    TaskType.EVIDENCE_COLLECTION: 0.90,
                    TaskType.DATA_VALIDATION: 0.85
                },
                outputs=["security_assessment", "vulnerability_report", "evidence_package"]
            ),
            
            AgentType.PRISM: AgentCapability(
                agent_type=AgentType.PRISM,
                supported_tasks=[
                    TaskType.RISK_ASSESSMENT,
                    TaskType.PREDICTIVE_ANALYSIS,
                    TaskType.DATA_VALIDATION
                ],
                supported_platforms=[Platform.AWS, Platform.GCP, Platform.AZURE],
                supported_frameworks=[Framework.SOC2, Framework.ISO27001],
                max_concurrent_tasks=3,
                average_execution_time=180.0,
                specialization_score={
                    TaskType.RISK_ASSESSMENT: 0.95,
                    TaskType.PREDICTIVE_ANALYSIS: 0.90,
                    TaskType.DATA_VALIDATION: 0.80
                },
                dependencies=[AgentType.ATLAS, AgentType.CLEARANCE],
                outputs=["risk_score", "risk_forecast", "mitigation_plan"]
            ),
            
            AgentType.CLEARANCE: AgentCapability(
                agent_type=AgentType.CLEARANCE,
                supported_tasks=[
                    TaskType.EVIDENCE_COLLECTION,
                    TaskType.DATA_VALIDATION,
                    TaskType.WORKFLOW_ORCHESTRATION
                ],
                supported_platforms=[Platform.AWS, Platform.GCP, Platform.AZURE, Platform.GITHUB],
                supported_frameworks=list(Framework),
                max_concurrent_tasks=6,
                average_execution_time=90.0,
                specialization_score={
                    TaskType.EVIDENCE_COLLECTION: 0.95,
                    TaskType.DATA_VALIDATION: 0.90,
                    TaskType.WORKFLOW_ORCHESTRATION: 0.85
                },
                outputs=["evidence_items", "validation_report", "workflow_status"]
            ),
            
            AgentType.CRYPTO_VERIFICATION: AgentCapability(
                agent_type=AgentType.CRYPTO_VERIFICATION,
                supported_tasks=[
                    TaskType.CRYPTO_VERIFICATION,
                    TaskType.DATA_VALIDATION,
                    TaskType.EVIDENCE_COLLECTION
                ],
                supported_platforms=[Platform.AWS, Platform.GCP, Platform.AZURE],
                supported_frameworks=[Framework.SOC2, Framework.ISO27001],
                max_concurrent_tasks=2,
                average_execution_time=300.0,
                specialization_score={
                    TaskType.CRYPTO_VERIFICATION: 0.98,
                    TaskType.DATA_VALIDATION: 0.90,
                    TaskType.EVIDENCE_COLLECTION: 0.75
                },
                dependencies=[AgentType.CLEARANCE],
                outputs=["crypto_proof", "verification_certificate", "trust_score"]
            )
        }
    
    async def start(self):
        """Start the orchestration engine"""
        self._running = True
        self._orchestration_task = asyncio.create_task(self._orchestration_loop())
        await self.message_bus.start()
        
        logger.info("Agent orchestrator started")
    
    async def stop(self):
        """Stop the orchestration engine"""
        self._running = False
        if self._orchestration_task:
            await self._orchestration_task
        await self.message_bus.stop()
        
        logger.info("Agent orchestrator stopped")
    
    async def _orchestration_loop(self):
        """Main orchestration loop"""
        while self._running:
            try:
                # Process task queue
                await self._process_task_queue()
                
                # Check task dependencies
                await self._check_task_dependencies()
                
                # Monitor agent health
                await self._monitor_agent_health()
                
                # Optimize task assignments
                await self._optimize_task_assignments()
                
                # Clean up completed tasks
                await self._cleanup_completed_tasks()
                
                await asyncio.sleep(1)  # Process every second
                
            except Exception as e:
                logger.error("Orchestration loop error", error=str(e))
                await asyncio.sleep(5)  # Back off on error
    
    async def submit_task(self, task: AgentTask) -> str:
        """Submit a task for execution"""
        task.task_id = task.task_id or str(uuid.uuid4())
        
        # Add to appropriate priority queue
        self.task_queue[task.priority].append(task)
        self.active_tasks[task.task_id] = task
        
        logger.info(
            "Task submitted",
            task_id=task.task_id,
            task_type=task.task_type.value,
            priority=task.priority.value
        )
        
        return task.task_id
    
    async def submit_workflow(self, workflow: WorkflowDefinition) -> str:
        """Submit a multi-agent workflow"""
        self.workflows[workflow.workflow_id] = workflow
        
        # Create tasks from workflow definition
        tasks = []
        for task_def in workflow.tasks:
            task = AgentTask(
                task_id=str(uuid.uuid4()),
                task_type=TaskType(task_def["type"]),
                priority=TaskPriority(task_def.get("priority", TaskPriority.MEDIUM.value)),
                organization_id=task_def.get("organization_id", ""),
                user_id=task_def.get("user_id", ""),
                input_data=task_def.get("input_data", {}),
                configuration=task_def.get("configuration", {}),
                dependencies=workflow.dependencies.get(task_def["id"], []),
                context={"workflow_id": workflow.workflow_id}
            )
            tasks.append(task)
            await self.submit_task(task)
        
        logger.info(
            "Workflow submitted",
            workflow_id=workflow.workflow_id,
            task_count=len(tasks)
        )
        
        return workflow.workflow_id
    
    async def _process_task_queue(self):
        """Process tasks from the priority queue"""
        for priority in TaskPriority:
            queue = self.task_queue[priority]
            if not queue:
                continue
            
            # Process up to 10 tasks from this priority level
            for _ in range(min(len(queue), 10)):
                task = queue.popleft()
                
                # Find best agent for this task
                best_agent = await self._find_best_agent(task)
                if best_agent:
                    await self._assign_task(task, best_agent)
                else:
                    # No available agent, put back in queue
                    queue.append(task)
                    break
    
    async def _find_best_agent(self, task: AgentTask) -> Optional[str]:
        """Find the best available agent for a task"""
        suitable_agents = []
        
        # Find agents that can handle this task type
        for agent_type, capability in self.agent_capabilities.items():
            if task.task_type in capability.supported_tasks:
                # Find available instances of this agent type
                for instance_id, instance in self.agent_instances.items():
                    if (instance.agent_type == agent_type and 
                        instance.is_active and 
                        instance.capacity_used < instance.max_capacity and
                        instance.organization_id == task.organization_id):
                        
                        # Calculate suitability score
                        specialization = capability.specialization_score.get(task.task_type, 0.5)
                        load_factor = 1.0 - (instance.capacity_used / instance.max_capacity)
                        success_factor = instance.success_rate
                        
                        score = specialization * 0.5 + load_factor * 0.3 + success_factor * 0.2
                        suitable_agents.append((instance_id, score))
        
        # Return best agent
        if suitable_agents:
            suitable_agents.sort(key=lambda x: x[1], reverse=True)
            return suitable_agents[0][0]
        
        return None
    
    async def _assign_task(self, task: AgentTask, agent_instance_id: str):
        """Assign a task to an agent instance"""
        instance = self.agent_instances[agent_instance_id]
        
        task.status = TaskStatus.ASSIGNED
        task.assigned_agent = agent_instance_id
        task.started_at = datetime.now(timezone.utc)
        
        instance.current_tasks.append(task.task_id)
        instance.capacity_used += 1
        instance.last_activity = datetime.now(timezone.utc)
        
        # Send task to agent via message bus
        await self.message_bus.send_message(
            agent_instance_id,
            {
                "type": "task_assignment",
                "task": asdict(task)
            }
        )
        
        logger.info(
            "Task assigned",
            task_id=task.task_id,
            agent_instance=agent_instance_id,
            agent_type=instance.agent_type.value
        )
    
    async def _check_task_dependencies(self):
        """Check and resolve task dependencies"""
        for task_id, task in self.active_tasks.items():
            if task.status == TaskStatus.WAITING_DEPENDENCIES:
                dependencies_met = all(
                    dep_id in self.completed_tasks and 
                    self.completed_tasks[dep_id].status == TaskStatus.COMPLETED
                    for dep_id in task.dependencies
                )
                
                if dependencies_met:
                    task.status = TaskStatus.PENDING
                    self.task_queue[task.priority].append(task)
    
    async def register_agent_instance(self, instance: AgentInstance):
        """Register a new agent instance"""
        self.agent_instances[instance.instance_id] = instance
        
        logger.info(
            "Agent instance registered",
            instance_id=instance.instance_id,
            agent_type=instance.agent_type.value,
            organization_id=instance.organization_id
        )
    
    async def task_completed(self, task_id: str, result: Dict[str, Any]):
        """Handle task completion"""
        if task_id not in self.active_tasks:
            return
        
        task = self.active_tasks[task_id]
        task.status = TaskStatus.COMPLETED
        task.completed_at = datetime.now(timezone.utc)
        task.output_data = result
        
        if task.started_at:
            task.actual_duration = (task.completed_at - task.started_at).total_seconds()
        
        # Update agent instance
        if task.assigned_agent:
            instance = self.agent_instances[task.assigned_agent]
            instance.current_tasks.remove(task_id)
            instance.capacity_used -= 1
            instance.total_tasks_completed += 1
            instance.total_execution_time += task.actual_duration or 0
            instance.last_activity = datetime.now(timezone.utc)
        
        # Move to completed tasks
        self.completed_tasks[task_id] = task
        del self.active_tasks[task_id]
        
        # Share results with other agents if needed
        await self.context_manager.share_task_result(task_id, result)
        
        logger.info(
            "Task completed",
            task_id=task_id,
            duration=task.actual_duration
        )
    
    async def task_failed(self, task_id: str, error: str):
        """Handle task failure"""
        if task_id not in self.active_tasks:
            return
        
        task = self.active_tasks[task_id]
        task.error_message = error
        task.retry_count += 1
        
        # Update agent instance
        if task.assigned_agent:
            instance = self.agent_instances[task.assigned_agent]
            instance.current_tasks.remove(task_id)
            instance.capacity_used -= 1
            instance.error_count += 1
            instance.last_error = error
        
        # Retry or fail permanently
        if task.retry_count < task.max_retries:
            task.status = TaskStatus.RETRY
            task.assigned_agent = None
            self.task_queue[task.priority].append(task)
            
            logger.warning(
                "Task failed, retrying",
                task_id=task_id,
                retry_count=task.retry_count,
                error=error
            )
        else:
            task.status = TaskStatus.FAILED
            task.completed_at = datetime.now(timezone.utc)
            self.completed_tasks[task_id] = task
            del self.active_tasks[task_id]
            
            logger.error(
                "Task failed permanently",
                task_id=task_id,
                error=error
            )
    
    async def _monitor_agent_health(self):
        """Monitor agent health and performance"""
        current_time = datetime.now(timezone.utc)
        
        for instance_id, instance in self.agent_instances.items():
            # Check if agent is responding
            time_since_activity = (current_time - instance.last_activity).total_seconds()
            
            if time_since_activity > 300:  # 5 minutes
                instance.health_status = "degraded"
            elif time_since_activity > 600:  # 10 minutes
                instance.health_status = "unhealthy"
                instance.is_active = False
    
    async def _optimize_task_assignments(self):
        """Optimize task assignments based on performance"""
        # This could include ML-based optimization
        pass
    
    async def _cleanup_completed_tasks(self):
        """Clean up old completed tasks"""
        cutoff_time = datetime.now(timezone.utc) - timedelta(hours=24)
        
        to_remove = [
            task_id for task_id, task in self.completed_tasks.items()
            if task.completed_at and task.completed_at < cutoff_time
        ]
        
        for task_id in to_remove:
            del self.completed_tasks[task_id]
    
    def get_orchestrator_status(self) -> Dict[str, Any]:
        """Get current orchestrator status"""
        return {
            "running": self._running,
            "active_tasks": len(self.active_tasks),
            "completed_tasks": len(self.completed_tasks),
            "agent_instances": len(self.agent_instances),
            "queue_sizes": {
                priority.name: len(queue) 
                for priority, queue in self.task_queue.items()
            },
            "workflows": len(self.workflows)
        }

class AsyncMessageBus:
    """Asynchronous message bus for agent communication"""
    
    def __init__(self):
        self.subscribers: Dict[str, List[Callable]] = defaultdict(list)
        self.message_queue: asyncio.Queue = asyncio.Queue()
        self._running = False
        self._message_task = None
    
    async def start(self):
        """Start the message bus"""
        self._running = True
        self._message_task = asyncio.create_task(self._process_messages())
    
    async def stop(self):
        """Stop the message bus"""
        self._running = False
        if self._message_task:
            await self._message_task
    
    async def send_message(self, recipient: str, message: Dict[str, Any]):
        """Send a message to a recipient"""
        await self.message_queue.put((recipient, message))
    
    async def _process_messages(self):
        """Process messages from the queue"""
        while self._running:
            try:
                recipient, message = await asyncio.wait_for(
                    self.message_queue.get(), timeout=1.0
                )
                
                # Deliver to subscribers
                for callback in self.subscribers.get(recipient, []):
                    try:
                        await callback(message)
                    except Exception as e:
                        logger.error(
                            "Message delivery failed",
                            recipient=recipient,
                            error=str(e)
                        )
                        
            except asyncio.TimeoutError:
                continue
            except Exception as e:
                logger.error("Message processing error", error=str(e))

class AgentContextManager:
    """Manages shared context and data between agents"""
    
    def __init__(self):
        self.shared_context: Dict[str, Dict[str, Any]] = defaultdict(dict)
        self.task_results: Dict[str, Dict[str, Any]] = {}
    
    async def share_task_result(self, task_id: str, result: Dict[str, Any]):
        """Share task result with other agents"""
        self.task_results[task_id] = result
    
    async def get_shared_context(self, organization_id: str) -> Dict[str, Any]:
        """Get shared context for an organization"""
        return self.shared_context[organization_id]
    
    async def update_shared_context(self, organization_id: str, key: str, value: Any):
        """Update shared context"""
        self.shared_context[organization_id][key] = value

# Global orchestrator instance
orchestrator = AgentOrchestrator()