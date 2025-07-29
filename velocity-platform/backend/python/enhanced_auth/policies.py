"""
Attribute-Based Access Control (ABAC) Policy Engine
Advanced access control policies and rules
"""

from typing import Dict, Any, List, Optional, Union
from datetime import datetime, time
from enum import Enum
from pydantic import BaseModel
import structlog

logger = structlog.get_logger()

class PolicyEffect(str, Enum):
    """Policy decision effects"""
    ALLOW = "allow"
    DENY = "deny"

class AttributeType(str, Enum):
    """Types of attributes for ABAC"""
    USER = "user"
    RESOURCE = "resource"
    ENVIRONMENT = "environment"
    ACTION = "action"

class ComparisonOperator(str, Enum):
    """Comparison operators for conditions"""
    EQUALS = "equals"
    NOT_EQUALS = "not_equals"
    IN = "in"
    NOT_IN = "not_in"
    GREATER_THAN = "greater_than"
    LESS_THAN = "less_than"
    CONTAINS = "contains"
    STARTS_WITH = "starts_with"

class AttributeCondition(BaseModel):
    """Individual attribute condition"""
    attribute_type: AttributeType
    attribute_name: str
    operator: ComparisonOperator
    value: Union[str, int, float, List[str], bool]

class PolicyRule(BaseModel):
    """ABAC policy rule"""
    rule_id: str
    name: str
    description: str
    effect: PolicyEffect
    conditions: List[AttributeCondition]
    priority: int = 100  # Higher number = higher priority

class AccessPolicy(BaseModel):
    """Complete access policy"""
    policy_id: str
    name: str
    description: str
    rules: List[PolicyRule]
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

class AccessRequest(BaseModel):
    """Access request with attributes"""
    user_attributes: Dict[str, Any]
    resource_attributes: Dict[str, Any]
    environment_attributes: Dict[str, Any]
    action: str

class PolicyDecision(BaseModel):
    """Policy evaluation decision"""
    decision: PolicyEffect
    applicable_rules: List[str]
    evaluation_details: Dict[str, Any]
    timestamp: datetime

class ABACPolicyEngine:
    """Attribute-Based Access Control policy evaluation engine"""
    
    def __init__(self):
        self.policies: Dict[str, AccessPolicy] = {}
        self._load_default_policies()
    
    def _load_default_policies(self):
        """Load default ERIP access policies"""
        # Executive access policy
        executive_policy = AccessPolicy(
            policy_id="executive_access",
            name="Executive Access Policy",
            description="Access control for executive users",
            rules=[
                PolicyRule(
                    rule_id="exec_beacon_access",
                    name="Executive BEACON Access",
                    description="Allow executives to access BEACON dashboard",
                    effect=PolicyEffect.ALLOW,
                    conditions=[
                        AttributeCondition(
                            attribute_type=AttributeType.USER,
                            attribute_name="role",
                            operator=ComparisonOperator.EQUALS,
                            value="executive"
                        ),
                        AttributeCondition(
                            attribute_type=AttributeType.RESOURCE,
                            attribute_name="component",
                            operator=ComparisonOperator.EQUALS,
                            value="beacon"
                        )
                    ],
                    priority=200
                )
            ],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Time-based access policy
        business_hours_policy = AccessPolicy(
            policy_id="business_hours",
            name="Business Hours Access Policy", 
            description="Restrict access outside business hours",
            rules=[
                PolicyRule(
                    rule_id="after_hours_restriction",
                    name="After Hours Access Restriction",
                    description="Deny access to sensitive components after hours",
                    effect=PolicyEffect.DENY,
                    conditions=[
                        AttributeCondition(
                            attribute_type=AttributeType.ENVIRONMENT,
                            attribute_name="current_hour",
                            operator=ComparisonOperator.GREATER_THAN,
                            value=18
                        ),
                        AttributeCondition(
                            attribute_type=AttributeType.RESOURCE,
                            attribute_name="sensitivity",
                            operator=ComparisonOperator.EQUALS,
                            value="high"
                        )
                    ],
                    priority=300
                )
            ],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        self.policies[executive_policy.policy_id] = executive_policy
        self.policies[business_hours_policy.policy_id] = business_hours_policy
    
    async def evaluate_access(self, request: AccessRequest) -> PolicyDecision:
        """Evaluate access request against all policies"""
        try:
            applicable_rules = []
            evaluation_details = {}
            final_decision = PolicyEffect.DENY  # Default deny
            
            # Collect all applicable rules from all active policies
            all_rules = []
            for policy in self.policies.values():
                if policy.is_active:
                    for rule in policy.rules:
                        if self._rule_applies(rule, request):
                            all_rules.append(rule)
                            applicable_rules.append(rule.rule_id)
            
            # Sort rules by priority (higher number = higher priority)
            all_rules.sort(key=lambda r: r.priority, reverse=True)
            
            # Evaluate rules in priority order
            for rule in all_rules:
                if rule.effect == PolicyEffect.ALLOW:
                    final_decision = PolicyEffect.ALLOW
                    evaluation_details[rule.rule_id] = "ALLOW - Rule matched"
                    break  # First ALLOW wins
                elif rule.effect == PolicyEffect.DENY:
                    final_decision = PolicyEffect.DENY
                    evaluation_details[rule.rule_id] = "DENY - Rule matched"
                    break  # First DENY wins
            
            decision = PolicyDecision(
                decision=final_decision,
                applicable_rules=applicable_rules,
                evaluation_details=evaluation_details,
                timestamp=datetime.utcnow()
            )
            
            logger.info("ABAC policy evaluation completed",
                       decision=final_decision.value,
                       applicable_rules_count=len(applicable_rules))
            
            return decision
            
        except Exception as e:
            logger.error("ABAC policy evaluation failed", error=str(e))
            # Fail secure - deny access on error
            return PolicyDecision(
                decision=PolicyEffect.DENY,
                applicable_rules=[],
                evaluation_details={"error": str(e)},
                timestamp=datetime.utcnow()
            )
    
    def _rule_applies(self, rule: PolicyRule, request: AccessRequest) -> bool:
        """Check if rule applies to the access request"""
        try:
            for condition in rule.conditions:
                if not self._evaluate_condition(condition, request):
                    return False
            return True
        except Exception as e:
            logger.error("Rule evaluation error", 
                        rule_id=rule.rule_id, 
                        error=str(e))
            return False
    
    def _evaluate_condition(self, condition: AttributeCondition, request: AccessRequest) -> bool:
        """Evaluate individual condition"""
        # Get attribute value based on type
        if condition.attribute_type == AttributeType.USER:
            actual_value = request.user_attributes.get(condition.attribute_name)
        elif condition.attribute_type == AttributeType.RESOURCE:
            actual_value = request.resource_attributes.get(condition.attribute_name)
        elif condition.attribute_type == AttributeType.ENVIRONMENT:
            actual_value = request.environment_attributes.get(condition.attribute_name)
        elif condition.attribute_type == AttributeType.ACTION:
            actual_value = request.action
        else:
            return False
        
        if actual_value is None:
            return False
        
        # Evaluate based on operator
        if condition.operator == ComparisonOperator.EQUALS:
            return actual_value == condition.value
        elif condition.operator == ComparisonOperator.NOT_EQUALS:
            return actual_value != condition.value
        elif condition.operator == ComparisonOperator.IN:
            return actual_value in condition.value
        elif condition.operator == ComparisonOperator.NOT_IN:
            return actual_value not in condition.value
        elif condition.operator == ComparisonOperator.GREATER_THAN:
            return actual_value > condition.value
        elif condition.operator == ComparisonOperator.LESS_THAN:
            return actual_value < condition.value
        elif condition.operator == ComparisonOperator.CONTAINS:
            return str(condition.value) in str(actual_value)
        elif condition.operator == ComparisonOperator.STARTS_WITH:
            return str(actual_value).startswith(str(condition.value))
        
        return False
    
    async def add_policy(self, policy: AccessPolicy) -> bool:
        """Add new access policy"""
        try:
            self.policies[policy.policy_id] = policy
            logger.info("ABAC policy added", policy_id=policy.policy_id)
            return True
        except Exception as e:
            logger.error("Failed to add ABAC policy", 
                        policy_id=policy.policy_id,
                        error=str(e))
            return False
    
    async def remove_policy(self, policy_id: str) -> bool:
        """Remove access policy"""
        try:
            if policy_id in self.policies:
                del self.policies[policy_id]
                logger.info("ABAC policy removed", policy_id=policy_id)
                return True
            return False
        except Exception as e:
            logger.error("Failed to remove ABAC policy",
                        policy_id=policy_id,
                        error=str(e))
            return False
    
    async def get_policies(self) -> List[AccessPolicy]:
        """Get all policies"""
        return list(self.policies.values())

# Global policy engine instance
policy_engine = ABACPolicyEngine()

# Convenience function
async def evaluate_access(
    user_attributes: Dict[str, Any],
    resource_attributes: Dict[str, Any],
    action: str,
    environment_attributes: Optional[Dict[str, Any]] = None
) -> PolicyDecision:
    """Evaluate access request using ABAC policies"""
    if environment_attributes is None:
        environment_attributes = {
            "current_hour": datetime.utcnow().hour,
            "current_day": datetime.utcnow().strftime("%A").lower(),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    request = AccessRequest(
        user_attributes=user_attributes,
        resource_attributes=resource_attributes,
        environment_attributes=environment_attributes,
        action=action
    )
    
    return await policy_engine.evaluate_access(request)