"""
Dynamic Role Delegation and Approval Workflows
Temporary role assignments, delegation chains, and approval management
"""

from typing import Dict, List, Optional, Set, Any, Union, Callable
from datetime import datetime, timedelta
from enum import Enum
from pydantic import BaseModel, Field
import structlog
import uuid
from abc import ABC, abstractmethod

logger = structlog.get_logger()

class DelegationType(str, Enum):
    """Types of role delegation"""
    TEMPORARY = "temporary"           # Time-limited delegation
    CONDITIONAL = "conditional"       # Condition-based delegation
    EMERGENCY = "emergency"          # Emergency delegation
    VACATION = "vacation"            # Vacation coverage
    PROJECT = "project"              # Project-specific delegation
    ESCALATION = "escalation"        # Escalation-based delegation

class ApprovalStatus(str, Enum):
    """Approval workflow status"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    IN_PROGRESS = "in_progress"

class WorkflowStepType(str, Enum):
    """Types of workflow steps"""
    APPROVAL = "approval"
    NOTIFICATION = "notification"
    CONDITION_CHECK = "condition_check"
    AUTOMATIC = "automatic"
    MANUAL_REVIEW = "manual_review"
    ESCALATION = "escalation"

class DelegationScope(str, Enum):
    """Scope of delegation"""
    FULL_ROLE = "full_role"          # Complete role delegation
    SPECIFIC_PERMISSIONS = "specific_permissions"  # Only specific permissions
    COMPONENT_ACCESS = "component_access"  # Component-specific access
    EMERGENCY_ONLY = "emergency_only"  # Emergency situations only
    READ_ONLY = "read_only"          # Read-only access

class RoleDelegation(BaseModel):
    """Role delegation configuration"""
    delegation_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    delegator_user_id: str
    delegatee_user_id: str
    role_id: str
    delegation_type: DelegationType
    delegation_scope: DelegationScope
    permissions_delegated: List[str] = Field(default_factory=list)
    conditions: Dict[str, Any] = Field(default_factory=dict)
    start_datetime: datetime
    end_datetime: Optional[datetime] = None
    max_duration_hours: Optional[int] = None
    requires_approval: bool = True
    approval_chain: List[str] = Field(default_factory=list)
    emergency_override: bool = False
    notification_users: List[str] = Field(default_factory=list)
    audit_trail: List[Dict[str, Any]] = Field(default_factory=list)
    usage_restrictions: Dict[str, Any] = Field(default_factory=dict)
    budget_limits: Dict[str, float] = Field(default_factory=dict)
    geographic_restrictions: List[str] = Field(default_factory=list)
    time_restrictions: Dict[str, Any] = Field(default_factory=dict)
    justification: str
    business_case: Optional[str] = None
    risk_assessment: Dict[str, Any] = Field(default_factory=dict)
    status: ApprovalStatus = ApprovalStatus.PENDING
    approval_workflow_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = False

class WorkflowStep(BaseModel):
    """Individual workflow step"""
    step_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    step_order: int
    step_type: WorkflowStepType
    step_name: str
    description: str
    assigned_users: List[str] = Field(default_factory=list)
    assigned_roles: List[str] = Field(default_factory=list)
    conditions: Dict[str, Any] = Field(default_factory=dict)
    timeout_hours: Optional[int] = None
    escalation_users: List[str] = Field(default_factory=list)
    auto_approve_conditions: Dict[str, Any] = Field(default_factory=dict)
    rejection_conditions: Dict[str, Any] = Field(default_factory=dict)
    parallel_execution: bool = False
    required_consensus: Optional[int] = None  # Number of approvals needed
    custom_logic: Optional[str] = None  # Python code for custom logic
    metadata: Dict[str, Any] = Field(default_factory=dict)

class ApprovalWorkflow(BaseModel):
    """Approval workflow definition"""
    workflow_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    workflow_name: str
    description: str
    organization_id: str
    workflow_type: str  # delegation, access_request, role_assignment, etc.
    steps: List[WorkflowStep] = Field(default_factory=list)
    triggers: Dict[str, Any] = Field(default_factory=dict)
    default_timeout_hours: int = 24
    escalation_policy: Dict[str, Any] = Field(default_factory=dict)
    notification_templates: Dict[str, str] = Field(default_factory=dict)
    is_active: bool = True
    version: int = 1
    created_by: str
    approved_by: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class WorkflowExecution(BaseModel):
    """Workflow execution instance"""
    execution_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    workflow_id: str
    delegation_id: str
    current_step_id: Optional[str] = None
    status: ApprovalStatus = ApprovalStatus.IN_PROGRESS
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    step_executions: Dict[str, Dict[str, Any]] = Field(default_factory=dict)
    approvers: List[Dict[str, Any]] = Field(default_factory=list)
    comments: List[Dict[str, Any]] = Field(default_factory=list)
    escalations: List[Dict[str, Any]] = Field(default_factory=list)
    notifications_sent: List[Dict[str, Any]] = Field(default_factory=list)
    metrics: Dict[str, Any] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class IWorkflowEngine(ABC):
    """Abstract workflow engine interface"""
    
    @abstractmethod
    async def execute_step(
        self, 
        execution: WorkflowExecution, 
        step: WorkflowStep
    ) -> Dict[str, Any]:
        """Execute a workflow step"""
        pass
    
    @abstractmethod
    async def evaluate_conditions(
        self, 
        conditions: Dict[str, Any], 
        context: Dict[str, Any]
    ) -> bool:
        """Evaluate step conditions"""
        pass

class WorkflowEngine(IWorkflowEngine):
    """
    Workflow execution engine for role delegation and approval processes
    """
    
    def __init__(self):
        self.active_executions: Dict[str, WorkflowExecution] = {}
        self.condition_evaluators: Dict[str, Callable] = {}
        self._register_default_evaluators()
    
    def _register_default_evaluators(self):
        """Register default condition evaluators"""
        
        def user_in_role(context: Dict[str, Any], role: str) -> bool:
            user_roles = context.get("user_roles", [])
            return role in user_roles
        
        def budget_within_limit(context: Dict[str, Any], limit: float) -> bool:
            requested_budget = context.get("requested_budget", 0)
            return requested_budget <= limit
        
        def time_within_hours(context: Dict[str, Any], hours: int) -> bool:
            current_hour = datetime.utcnow().hour
            start_hour = context.get("start_hour", 9)
            end_hour = context.get("end_hour", 17)
            return start_hour <= current_hour <= end_hour
        
        def emergency_conditions_met(context: Dict[str, Any]) -> bool:
            return context.get("is_emergency", False)
        
        self.condition_evaluators.update({
            "user_in_role": user_in_role,
            "budget_within_limit": budget_within_limit,
            "time_within_hours": time_within_hours,
            "emergency_conditions_met": emergency_conditions_met
        })
    
    async def execute_step(
        self, 
        execution: WorkflowExecution, 
        step: WorkflowStep
    ) -> Dict[str, Any]:
        """Execute individual workflow step"""
        try:
            step_result = {
                "step_id": step.step_id,
                "status": ApprovalStatus.IN_PROGRESS,
                "started_at": datetime.utcnow(),
                "messages": [],
                "data": {}
            }
            
            # Evaluate step conditions
            if step.conditions:
                conditions_met = await self.evaluate_conditions(
                    step.conditions, 
                    execution.metadata
                )
                if not conditions_met:
                    step_result.update({
                        "status": ApprovalStatus.CANCELLED,
                        "messages": ["Step conditions not met"]
                    })
                    return step_result
            
            # Execute based on step type
            if step.step_type == WorkflowStepType.APPROVAL:
                result = await self._execute_approval_step(execution, step)
            elif step.step_type == WorkflowStepType.NOTIFICATION:
                result = await self._execute_notification_step(execution, step)
            elif step.step_type == WorkflowStepType.CONDITION_CHECK:
                result = await self._execute_condition_check_step(execution, step)
            elif step.step_type == WorkflowStepType.AUTOMATIC:
                result = await self._execute_automatic_step(execution, step)
            elif step.step_type == WorkflowStepType.ESCALATION:
                result = await self._execute_escalation_step(execution, step)
            else:
                result = {"status": ApprovalStatus.APPROVED, "messages": ["Default approval"]}
            
            step_result.update(result)
            step_result["completed_at"] = datetime.utcnow()
            
            # Store step execution result
            execution.step_executions[step.step_id] = step_result
            
            return step_result
            
        except Exception as e:
            logger.error("Failed to execute workflow step",
                        execution_id=execution.execution_id,
                        step_id=step.step_id,
                        error=str(e))
            return {
                "step_id": step.step_id,
                "status": ApprovalStatus.REJECTED,
                "messages": [f"Step execution error: {str(e)}"]
            }
    
    async def _execute_approval_step(
        self, 
        execution: WorkflowExecution, 
        step: WorkflowStep
    ) -> Dict[str, Any]:
        """Execute approval step"""
        
        # Check for auto-approval conditions
        if step.auto_approve_conditions:
            auto_approve = await self.evaluate_conditions(
                step.auto_approve_conditions,
                execution.metadata
            )
            if auto_approve:
                return {
                    "status": ApprovalStatus.APPROVED,
                    "messages": ["Auto-approved based on conditions"],
                    "auto_approved": True
                }
        
        # Send approval requests to assigned users/roles
        approval_requests = []
        for user_id in step.assigned_users:
            approval_requests.append({
                "user_id": user_id,
                "requested_at": datetime.utcnow(),
                "status": "pending"
            })
        
        # For role-based assignments, resolve to actual users
        # This would typically query the role system to get users
        for role in step.assigned_roles:
            # Placeholder: would resolve role to users
            approval_requests.append({
                "role": role,
                "requested_at": datetime.utcnow(),
                "status": "pending"
            })
        
        return {
            "status": ApprovalStatus.PENDING,
            "messages": ["Approval requests sent"],
            "approval_requests": approval_requests,
            "timeout_at": datetime.utcnow() + timedelta(hours=step.timeout_hours or 24)
        }
    
    async def _execute_notification_step(
        self, 
        execution: WorkflowExecution, 
        step: WorkflowStep
    ) -> Dict[str, Any]:
        """Execute notification step"""
        
        notifications_sent = []
        for user_id in step.assigned_users:
            # Placeholder: would send actual notification
            notifications_sent.append({
                "user_id": user_id,
                "notification_type": "delegation_notification",
                "sent_at": datetime.utcnow()
            })
        
        return {
            "status": ApprovalStatus.APPROVED,
            "messages": ["Notifications sent"],
            "notifications_sent": notifications_sent
        }
    
    async def _execute_condition_check_step(
        self, 
        execution: WorkflowExecution, 
        step: WorkflowStep
    ) -> Dict[str, Any]:
        """Execute condition check step"""
        
        conditions_met = await self.evaluate_conditions(
            step.conditions,
            execution.metadata
        )
        
        if conditions_met:
            return {
                "status": ApprovalStatus.APPROVED,
                "messages": ["Conditions satisfied"]
            }
        else:
            return {
                "status": ApprovalStatus.REJECTED,
                "messages": ["Conditions not satisfied"]
            }
    
    async def _execute_automatic_step(
        self, 
        execution: WorkflowExecution, 
        step: WorkflowStep
    ) -> Dict[str, Any]:
        """Execute automatic step"""
        
        # Execute custom logic if provided
        if step.custom_logic:
            # Placeholder: would execute custom Python code safely
            pass
        
        return {
            "status": ApprovalStatus.APPROVED,
            "messages": ["Automatic step completed"]
        }
    
    async def _execute_escalation_step(
        self, 
        execution: WorkflowExecution, 
        step: WorkflowStep
    ) -> Dict[str, Any]:
        """Execute escalation step"""
        
        escalation_requests = []
        for user_id in step.escalation_users:
            escalation_requests.append({
                "user_id": user_id,
                "escalated_at": datetime.utcnow(),
                "reason": "Workflow escalation"
            })
        
        return {
            "status": ApprovalStatus.PENDING,
            "messages": ["Escalated to higher authority"],
            "escalation_requests": escalation_requests
        }
    
    async def evaluate_conditions(
        self, 
        conditions: Dict[str, Any], 
        context: Dict[str, Any]
    ) -> bool:
        """Evaluate workflow conditions"""
        try:
            for condition_name, condition_params in conditions.items():
                evaluator = self.condition_evaluators.get(condition_name)
                if not evaluator:
                    logger.warning("Unknown condition evaluator",
                                  condition_name=condition_name)
                    continue
                
                if not evaluator(context, **condition_params):
                    return False
            
            return True
            
        except Exception as e:
            logger.error("Failed to evaluate conditions",
                        conditions=conditions,
                        error=str(e))
            return False

class DelegationManager:
    """
    Dynamic Role Delegation Manager
    Manages temporary role assignments and approval workflows
    """
    
    def __init__(self):
        self.delegations: Dict[str, RoleDelegation] = {}
        self.workflows: Dict[str, ApprovalWorkflow] = {}
        self.workflow_engine = WorkflowEngine()
        self._initialize_default_workflows()
    
    def _initialize_default_workflows(self):
        """Initialize default approval workflows"""
        
        # Standard delegation workflow
        standard_workflow = ApprovalWorkflow(
            workflow_name="Standard Role Delegation",
            description="Standard approval workflow for role delegation",
            organization_id="default",
            workflow_type="delegation",
            created_by="system",
            steps=[
                WorkflowStep(
                    step_order=1,
                    step_type=WorkflowStepType.CONDITION_CHECK,
                    step_name="Risk Assessment",
                    description="Assess delegation risk level",
                    conditions={
                        "budget_within_limit": {"limit": 10000}
                    }
                ),
                WorkflowStep(
                    step_order=2,
                    step_type=WorkflowStepType.APPROVAL,
                    step_name="Manager Approval",
                    description="Direct manager approval",
                    assigned_roles=["direct_manager"],
                    timeout_hours=24
                ),
                WorkflowStep(
                    step_order=3,
                    step_type=WorkflowStepType.APPROVAL,
                    step_name="Security Review",
                    description="Security team review for sensitive roles",
                    assigned_roles=["security_team"],
                    conditions={
                        "high_risk_role": {"required": True}
                    },
                    timeout_hours=48
                ),
                WorkflowStep(
                    step_order=4,
                    step_type=WorkflowStepType.NOTIFICATION,
                    step_name="Delegation Notification",
                    description="Notify relevant parties of delegation",
                    assigned_users=[]  # Will be populated with notification list
                )
            ]
        )
        
        # Emergency delegation workflow
        emergency_workflow = ApprovalWorkflow(
            workflow_name="Emergency Role Delegation",
            description="Fast-track approval for emergency situations",
            organization_id="default",
            workflow_type="emergency_delegation",
            created_by="system",
            default_timeout_hours=2,
            steps=[
                WorkflowStep(
                    step_order=1,
                    step_type=WorkflowStepType.CONDITION_CHECK,
                    step_name="Emergency Validation",
                    description="Validate emergency conditions",
                    conditions={
                        "emergency_conditions_met": {}
                    }
                ),
                WorkflowStep(
                    step_order=2,
                    step_type=WorkflowStepType.APPROVAL,
                    step_name="Emergency Approval",
                    description="Emergency approver review",
                    assigned_roles=["emergency_approver"],
                    timeout_hours=1,
                    auto_approve_conditions={
                        "severity_level": {"level": "critical"}
                    }
                )
            ]
        )
        
        self.workflows[standard_workflow.workflow_id] = standard_workflow
        self.workflows[emergency_workflow.workflow_id] = emergency_workflow
    
    async def create_delegation_request(
        self,
        delegator_user_id: str,
        delegatee_user_id: str,
        role_id: str,
        delegation_config: Dict[str, Any]
    ) -> RoleDelegation:
        """Create new role delegation request"""
        try:
            delegation = RoleDelegation(
                delegator_user_id=delegator_user_id,
                delegatee_user_id=delegatee_user_id,
                role_id=role_id,
                **delegation_config
            )
            
            # Perform initial validation
            validation_result = await self._validate_delegation_request(delegation)
            if not validation_result["valid"]:
                raise ValueError(f"Delegation validation failed: {validation_result['reason']}")
            
            # Calculate risk assessment
            delegation.risk_assessment = await self._assess_delegation_risk(delegation)
            
            # Determine appropriate workflow
            workflow_id = await self._select_approval_workflow(delegation)
            delegation.approval_workflow_id = workflow_id
            
            # Store delegation
            self.delegations[delegation.delegation_id] = delegation
            
            # Start approval workflow if required
            if delegation.requires_approval:
                await self._start_approval_workflow(delegation)
            else:
                # Auto-approve for low-risk delegations
                await self._approve_delegation(delegation.delegation_id, "system", "Auto-approved")
            
            logger.info("Delegation request created",
                       delegation_id=delegation.delegation_id,
                       delegator=delegator_user_id,
                       delegatee=delegatee_user_id,
                       role_id=role_id)
            
            return delegation
            
        except Exception as e:
            logger.error("Failed to create delegation request",
                        delegator=delegator_user_id,
                        delegatee=delegatee_user_id,
                        role_id=role_id,
                        error=str(e))
            raise
    
    async def _validate_delegation_request(
        self, 
        delegation: RoleDelegation
    ) -> Dict[str, Any]:
        """Validate delegation request"""
        
        # Check if delegator has authority to delegate
        if delegation.delegator_user_id == delegation.delegatee_user_id:
            return {
                "valid": False,
                "reason": "Cannot delegate role to yourself"
            }
        
        # Check delegation duration
        if delegation.end_datetime:
            duration = delegation.end_datetime - delegation.start_datetime
            if duration.total_seconds() < 3600:  # Less than 1 hour
                return {
                    "valid": False,
                    "reason": "Minimum delegation duration is 1 hour"
                }
            
            if delegation.max_duration_hours:
                max_duration = timedelta(hours=delegation.max_duration_hours)
                if duration > max_duration:
                    return {
                        "valid": False,
                        "reason": f"Delegation duration exceeds maximum of {delegation.max_duration_hours} hours"
                    }
        
        # Check conflict of interest
        # This would typically check against business rules
        
        return {"valid": True}
    
    async def _assess_delegation_risk(
        self, 
        delegation: RoleDelegation
    ) -> Dict[str, Any]:
        """Assess risk level of delegation"""
        
        risk_score = 0
        risk_factors = []
        
        # Permission-based risk assessment
        high_risk_permissions = [
            "admin", "delete", "financial", "security", "executive"
        ]
        
        for permission in delegation.permissions_delegated:
            if any(risk_term in permission.lower() for risk_term in high_risk_permissions):
                risk_score += 2
                risk_factors.append(f"High-risk permission: {permission}")
        
        # Duration-based risk
        if delegation.end_datetime:
            duration_hours = (delegation.end_datetime - delegation.start_datetime).total_seconds() / 3600
            if duration_hours > 168:  # More than a week
                risk_score += 1
                risk_factors.append("Long-duration delegation")
        else:
            risk_score += 3
            risk_factors.append("Indefinite delegation")
        
        # Delegation type risk
        if delegation.delegation_type == DelegationType.EMERGENCY:
            risk_score += 1
            risk_factors.append("Emergency delegation")
        
        # Scope risk
        if delegation.delegation_scope == DelegationScope.FULL_ROLE:
            risk_score += 2
            risk_factors.append("Full role delegation")
        
        # Determine risk level
        if risk_score >= 6:
            risk_level = "high"
        elif risk_score >= 3:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        return {
            "risk_level": risk_level,
            "risk_score": risk_score,
            "risk_factors": risk_factors
        }
    
    async def _select_approval_workflow(
        self, 
        delegation: RoleDelegation
    ) -> str:
        """Select appropriate approval workflow"""
        
        if delegation.delegation_type == DelegationType.EMERGENCY:
            # Find emergency workflow
            for workflow in self.workflows.values():
                if workflow.workflow_type == "emergency_delegation":
                    return workflow.workflow_id
        
        # Default to standard workflow
        for workflow in self.workflows.values():
            if workflow.workflow_type == "delegation":
                return workflow.workflow_id
        
        # Fallback
        return list(self.workflows.keys())[0]
    
    async def _start_approval_workflow(self, delegation: RoleDelegation):
        """Start approval workflow for delegation"""
        
        if not delegation.approval_workflow_id:
            return
        
        workflow = self.workflows.get(delegation.approval_workflow_id)
        if not workflow:
            logger.error("Workflow not found",
                        workflow_id=delegation.approval_workflow_id)
            return
        
        # Create workflow execution
        execution = WorkflowExecution(
            workflow_id=workflow.workflow_id,
            delegation_id=delegation.delegation_id,
            metadata={
                "delegation": delegation.dict(),
                "risk_assessment": delegation.risk_assessment
            }
        )
        
        # Start workflow execution
        self.workflow_engine.active_executions[execution.execution_id] = execution
        
        # Execute first step
        if workflow.steps:
            first_step = min(workflow.steps, key=lambda s: s.step_order)
            await self.workflow_engine.execute_step(execution, first_step)
    
    async def _approve_delegation(
        self, 
        delegation_id: str, 
        approver_id: str, 
        comment: str
    ) -> bool:
        """Approve delegation and activate it"""
        
        delegation = self.delegations.get(delegation_id)
        if not delegation:
            return False
        
        delegation.status = ApprovalStatus.APPROVED
        delegation.is_active = True
        delegation.updated_at = datetime.utcnow()
        
        # Add to audit trail
        delegation.audit_trail.append({
            "action": "approved",
            "user_id": approver_id,
            "comment": comment,
            "timestamp": datetime.utcnow()
        })
        
        logger.info("Delegation approved",
                   delegation_id=delegation_id,
                   approver=approver_id)
        
        return True
    
    async def revoke_delegation(
        self, 
        delegation_id: str, 
        revoker_id: str, 
        reason: str
    ) -> bool:
        """Revoke active delegation"""
        
        delegation = self.delegations.get(delegation_id)
        if not delegation:
            return False
        
        delegation.is_active = False
        delegation.status = ApprovalStatus.CANCELLED
        delegation.updated_at = datetime.utcnow()
        
        # Add to audit trail
        delegation.audit_trail.append({
            "action": "revoked",
            "user_id": revoker_id,
            "reason": reason,
            "timestamp": datetime.utcnow()
        })
        
        logger.info("Delegation revoked",
                   delegation_id=delegation_id,
                   revoker=revoker_id,
                   reason=reason)
        
        return True

# Global delegation manager instance
delegation_manager = DelegationManager()