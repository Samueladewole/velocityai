"""
Role-Based Access Control (RBAC) System for Velocity AI Platform
Defines user roles, permissions, and access control mechanisms
"""

from enum import Enum
from typing import Dict, List, Set, Optional, Any
from dataclasses import dataclass
from datetime import datetime, timezone
import json

class UserRole(Enum):
    """
    Hierarchical user roles in the Velocity AI platform
    Each role inherits permissions from lower roles
    """
    # System-level roles
    SUPER_ADMIN = "super_admin"           # Full system access, multi-tenant management
    PLATFORM_ADMIN = "platform_admin"     # Platform-wide administration
    
    # Organization-level roles
    ORG_OWNER = "org_owner"               # Organization owner with full control
    ORG_ADMIN = "org_admin"               # Organization administrator
    COMPLIANCE_MANAGER = "compliance_manager"  # Compliance oversight and management
    
    # Department-level roles
    SECURITY_LEAD = "security_lead"       # Security team leadership
    AUDIT_MANAGER = "audit_manager"       # Audit process management
    RISK_ANALYST = "risk_analyst"         # Risk assessment and analysis
    
    # Operational roles
    COMPLIANCE_OFFICER = "compliance_officer"  # Day-to-day compliance operations
    SECURITY_ANALYST = "security_analyst"      # Security monitoring and analysis
    EVIDENCE_REVIEWER = "evidence_reviewer"    # Evidence validation and review
    
    # Limited access roles
    AGENT_OPERATOR = "agent_operator"     # Agent management and monitoring
    VIEWER = "viewer"                     # Read-only access
    EXTERNAL_AUDITOR = "external_auditor" # Limited audit-specific access

class Permission(Enum):
    """
    Granular permissions for platform features and resources
    Format: RESOURCE_ACTION (e.g., AGENT_CREATE, EVIDENCE_VALIDATE)
    """
    # System Management
    SYSTEM_ADMIN = "system:admin"
    PLATFORM_CONFIG = "platform:config"
    TENANT_MANAGE = "tenant:manage"
    
    # Organization Management
    ORG_MANAGE = "org:manage"
    ORG_SETTINGS = "org:settings"
    ORG_BILLING = "org:billing"
    ORG_USERS = "org:users"
    
    # User Management
    USER_CREATE = "user:create"
    USER_UPDATE = "user:update"
    USER_DELETE = "user:delete"
    USER_VIEW = "user:view"
    ROLE_ASSIGN = "role:assign"
    
    # Agent Management
    AGENT_CREATE = "agent:create"
    AGENT_UPDATE = "agent:update"
    AGENT_DELETE = "agent:delete"
    AGENT_VIEW = "agent:view"
    AGENT_RUN = "agent:run"
    AGENT_STOP = "agent:stop"
    AGENT_CONFIGURE = "agent:configure"
    
    # Evidence Management
    EVIDENCE_CREATE = "evidence:create"
    EVIDENCE_UPDATE = "evidence:update"
    EVIDENCE_DELETE = "evidence:delete"
    EVIDENCE_VIEW = "evidence:view"
    EVIDENCE_VALIDATE = "evidence:validate"
    EVIDENCE_EXPORT = "evidence:export"
    
    # Framework Management
    MANAGE_FRAMEWORKS = "frameworks:manage"
    VIEW_COMPLIANCE_STATUS = "compliance:view_status"
    CONFIGURE_FRAMEWORKS = "frameworks:configure"
    
    # Assessment Management
    ASSESSMENT_CREATE = "assessment:create"
    ASSESSMENT_VIEW = "assessment:view"
    ASSESSMENT_DELETE = "assessment:delete"
    ASSESSMENT_APPROVE = "assessment:approve"
    
    # Integration Management
    INTEGRATION_CREATE = "integration:create"
    INTEGRATION_UPDATE = "integration:update"
    INTEGRATION_DELETE = "integration:delete"
    INTEGRATION_VIEW = "integration:view"
    INTEGRATION_CONNECT = "integration:connect"
    
    # Reporting and Analytics
    REPORT_VIEW = "report:view"
    REPORT_CREATE = "report:create"
    REPORT_EXPORT = "report:export"
    ANALYTICS_VIEW = "analytics:view"
    METRICS_VIEW = "metrics:view"
    
    # Compliance Framework
    FRAMEWORK_MANAGE = "framework:manage"
    CONTROL_MANAGE = "control:manage"
    
    # Trust Score Management
    TRUST_SCORE_VIEW = "trust_score:view"
    TRUST_SCORE_CONFIGURE = "trust_score:configure"
    
    # Audit and Monitoring
    AUDIT_LOG_VIEW = "audit_log:view"
    SECURITY_LOG_VIEW = "security_log:view"
    SYSTEM_MONITOR = "system:monitor"
    
    # Data Management
    DATA_EXPORT = "data:export"
    DATA_IMPORT = "data:import"
    BACKUP_MANAGE = "backup:manage"
    
    # Document Management
    EXPORT_DOCUMENTS = "documents:export"
    UPLOAD_DOCUMENTS = "documents:upload"
    MANAGE_DOCUMENTS = "documents:manage"
    DELETE_DOCUMENTS = "documents:delete"
    SEND_EMAILS = "emails:send"

# Permission helper functions
def require_permission(permission: Permission):
    """Dependency to require specific permission"""
    from fastapi import Depends
    from auth import get_current_active_user, User
    from validation import AuthorizationException
    
    def check_permission_dependency(current_user: User = Depends(get_current_active_user)):
        if not current_user.has_permission(permission.value):
            raise AuthorizationException(f"Permission required: {permission.value}")
        return current_user
    return check_permission_dependency

@dataclass
class RoleDefinition:
    """Complete role definition with metadata"""
    name: UserRole
    display_name: str
    description: str
    permissions: Set[Permission]
    inherits_from: Optional[UserRole] = None
    is_system_role: bool = False
    requires_approval: bool = False
    max_users: Optional[int] = None

class RBACManager:
    """
    Role-Based Access Control Manager
    Handles role definitions, permission checks, and access control
    """
    
    def __init__(self):
        self._role_definitions = self._initialize_role_definitions()
        self._role_hierarchy = self._build_role_hierarchy()
    
    def _initialize_role_definitions(self) -> Dict[UserRole, RoleDefinition]:
        """Initialize all role definitions with their permissions"""
        
        roles = {
            # System-level roles
            UserRole.SUPER_ADMIN: RoleDefinition(
                name=UserRole.SUPER_ADMIN,
                display_name="Super Administrator",
                description="Complete system access across all tenants and platform features",
                permissions=set(Permission),  # All permissions
                is_system_role=True,
                requires_approval=True,
                max_users=3
            ),
            
            UserRole.PLATFORM_ADMIN: RoleDefinition(
                name=UserRole.PLATFORM_ADMIN,
                display_name="Platform Administrator",
                description="Platform-wide administration and configuration",
                permissions={
                    Permission.PLATFORM_CONFIG, Permission.SYSTEM_MONITOR,
                    Permission.AUDIT_LOG_VIEW, Permission.SECURITY_LOG_VIEW,
                    Permission.BACKUP_MANAGE, Permission.METRICS_VIEW
                },
                is_system_role=True,
                requires_approval=True
            ),
            
            # Organization-level roles
            UserRole.ORG_OWNER: RoleDefinition(
                name=UserRole.ORG_OWNER,
                display_name="Organization Owner",
                description="Complete control over organization resources and settings",
                permissions={
                    Permission.ORG_MANAGE, Permission.ORG_SETTINGS, Permission.ORG_BILLING,
                    Permission.ORG_USERS, Permission.USER_CREATE, Permission.USER_UPDATE,
                    Permission.USER_DELETE, Permission.USER_VIEW, Permission.ROLE_ASSIGN,
                    Permission.AGENT_CREATE, Permission.AGENT_UPDATE, Permission.AGENT_DELETE,
                    Permission.AGENT_VIEW, Permission.AGENT_RUN, Permission.AGENT_STOP,
                    Permission.AGENT_CONFIGURE, Permission.INTEGRATION_CREATE,
                    Permission.INTEGRATION_UPDATE, Permission.INTEGRATION_DELETE,
                    Permission.INTEGRATION_VIEW, Permission.INTEGRATION_CONNECT,
                    Permission.EVIDENCE_CREATE, Permission.EVIDENCE_UPDATE,
                    Permission.EVIDENCE_DELETE, Permission.EVIDENCE_VIEW,
                    Permission.EVIDENCE_VALIDATE, Permission.EVIDENCE_EXPORT,
                    Permission.REPORT_VIEW, Permission.REPORT_CREATE, Permission.REPORT_EXPORT,
                    Permission.ANALYTICS_VIEW, Permission.METRICS_VIEW,
                    Permission.FRAMEWORK_MANAGE, Permission.CONTROL_MANAGE,
                    Permission.MANAGE_FRAMEWORKS, Permission.VIEW_COMPLIANCE_STATUS,
                    Permission.CONFIGURE_FRAMEWORKS,
                    Permission.ASSESSMENT_CREATE, Permission.ASSESSMENT_APPROVE,
                    Permission.TRUST_SCORE_VIEW, Permission.TRUST_SCORE_CONFIGURE,
                    Permission.DATA_EXPORT, Permission.DATA_IMPORT
                },
                max_users=1
            ),
            
            UserRole.ORG_ADMIN: RoleDefinition(
                name=UserRole.ORG_ADMIN,
                display_name="Organization Administrator",
                description="Administrative access to organization resources",
                permissions={
                    Permission.ORG_SETTINGS, Permission.ORG_USERS, Permission.USER_CREATE,
                    Permission.USER_UPDATE, Permission.USER_VIEW, Permission.ROLE_ASSIGN,
                    Permission.AGENT_CREATE, Permission.AGENT_UPDATE, Permission.AGENT_DELETE,
                    Permission.AGENT_VIEW, Permission.AGENT_RUN, Permission.AGENT_CONFIGURE,
                    Permission.INTEGRATION_CREATE, Permission.INTEGRATION_UPDATE,
                    Permission.INTEGRATION_VIEW, Permission.INTEGRATION_CONNECT,
                    Permission.EVIDENCE_VIEW, Permission.EVIDENCE_VALIDATE,
                    Permission.EVIDENCE_EXPORT, Permission.REPORT_VIEW,
                    Permission.MANAGE_FRAMEWORKS, Permission.VIEW_COMPLIANCE_STATUS,
                    Permission.CONFIGURE_FRAMEWORKS,
                    Permission.REPORT_CREATE, Permission.ANALYTICS_VIEW,
                    Permission.FRAMEWORK_MANAGE, Permission.ASSESSMENT_CREATE,
                    Permission.TRUST_SCORE_VIEW, Permission.DATA_EXPORT
                },
                inherits_from=UserRole.COMPLIANCE_MANAGER
            ),
            
            UserRole.COMPLIANCE_MANAGER: RoleDefinition(
                name=UserRole.COMPLIANCE_MANAGER,
                display_name="Compliance Manager",
                description="Oversight of compliance processes and frameworks",
                permissions={
                    Permission.AGENT_VIEW, Permission.AGENT_RUN, Permission.AGENT_CONFIGURE,
                    Permission.EVIDENCE_VIEW, Permission.EVIDENCE_VALIDATE,
                    Permission.EVIDENCE_EXPORT, Permission.REPORT_VIEW,
                    Permission.REPORT_CREATE, Permission.ANALYTICS_VIEW,
                    Permission.FRAMEWORK_MANAGE, Permission.CONTROL_MANAGE,
                    Permission.ASSESSMENT_CREATE, Permission.ASSESSMENT_APPROVE,
                    Permission.TRUST_SCORE_VIEW, Permission.TRUST_SCORE_CONFIGURE
                },
                inherits_from=UserRole.SECURITY_LEAD
            ),
            
            # Department-level roles
            UserRole.SECURITY_LEAD: RoleDefinition(
                name=UserRole.SECURITY_LEAD,
                display_name="Security Lead",
                description="Leadership of security operations and monitoring",
                permissions={
                    Permission.AGENT_VIEW, Permission.AGENT_RUN, Permission.AGENT_CONFIGURE,
                    Permission.EVIDENCE_VIEW, Permission.EVIDENCE_VALIDATE,
                    Permission.INTEGRATION_VIEW, Permission.REPORT_VIEW,
                    Permission.ANALYTICS_VIEW, Permission.METRICS_VIEW,
                    Permission.ASSESSMENT_CREATE, Permission.TRUST_SCORE_VIEW,
                    Permission.AUDIT_LOG_VIEW, Permission.SECURITY_LOG_VIEW
                },
                inherits_from=UserRole.AUDIT_MANAGER
            ),
            
            UserRole.AUDIT_MANAGER: RoleDefinition(
                name=UserRole.AUDIT_MANAGER,
                display_name="Audit Manager",
                description="Management of audit processes and evidence review",
                permissions={
                    Permission.AGENT_VIEW, Permission.EVIDENCE_VIEW,
                    Permission.EVIDENCE_VALIDATE, Permission.EVIDENCE_EXPORT,
                    Permission.REPORT_VIEW, Permission.REPORT_CREATE,
                    Permission.ASSESSMENT_CREATE, Permission.TRUST_SCORE_VIEW,
                    Permission.AUDIT_LOG_VIEW
                },
                inherits_from=UserRole.RISK_ANALYST
            ),
            
            UserRole.RISK_ANALYST: RoleDefinition(
                name=UserRole.RISK_ANALYST,
                display_name="Risk Analyst",
                description="Risk assessment and analysis capabilities",
                permissions={
                    Permission.AGENT_VIEW, Permission.EVIDENCE_VIEW,
                    Permission.REPORT_VIEW, Permission.ANALYTICS_VIEW,
                    Permission.METRICS_VIEW, Permission.ASSESSMENT_CREATE,
                    Permission.TRUST_SCORE_VIEW
                },
                inherits_from=UserRole.COMPLIANCE_OFFICER
            ),
            
            # Operational roles
            UserRole.COMPLIANCE_OFFICER: RoleDefinition(
                name=UserRole.COMPLIANCE_OFFICER,
                display_name="Compliance Officer",
                description="Day-to-day compliance operations and monitoring",
                permissions={
                    Permission.AGENT_VIEW, Permission.AGENT_RUN,
                    Permission.EVIDENCE_VIEW, Permission.EVIDENCE_VALIDATE,
                    Permission.REPORT_VIEW, Permission.ASSESSMENT_CREATE,
                    Permission.TRUST_SCORE_VIEW
                },
                inherits_from=UserRole.SECURITY_ANALYST
            ),
            
            UserRole.SECURITY_ANALYST: RoleDefinition(
                name=UserRole.SECURITY_ANALYST,
                display_name="Security Analyst",
                description="Security monitoring and analysis",
                permissions={
                    Permission.AGENT_VIEW, Permission.EVIDENCE_VIEW,
                    Permission.REPORT_VIEW, Permission.ANALYTICS_VIEW,
                    Permission.METRICS_VIEW, Permission.TRUST_SCORE_VIEW,
                    Permission.SECURITY_LOG_VIEW
                },
                inherits_from=UserRole.EVIDENCE_REVIEWER
            ),
            
            UserRole.EVIDENCE_REVIEWER: RoleDefinition(
                name=UserRole.EVIDENCE_REVIEWER,
                display_name="Evidence Reviewer",
                description="Evidence validation and review",
                permissions={
                    Permission.EVIDENCE_VIEW, Permission.EVIDENCE_VALIDATE,
                    Permission.REPORT_VIEW, Permission.TRUST_SCORE_VIEW
                },
                inherits_from=UserRole.AGENT_OPERATOR
            ),
            
            # Limited access roles
            UserRole.AGENT_OPERATOR: RoleDefinition(
                name=UserRole.AGENT_OPERATOR,
                display_name="Agent Operator",
                description="Agent management and monitoring",
                permissions={
                    Permission.AGENT_VIEW, Permission.AGENT_RUN,
                    Permission.EVIDENCE_VIEW, Permission.REPORT_VIEW,
                    Permission.METRICS_VIEW
                },
                inherits_from=UserRole.VIEWER
            ),
            
            UserRole.VIEWER: RoleDefinition(
                name=UserRole.VIEWER,
                display_name="Viewer",
                description="Read-only access to basic platform features",
                permissions={
                    Permission.AGENT_VIEW, Permission.EVIDENCE_VIEW,
                    Permission.REPORT_VIEW, Permission.TRUST_SCORE_VIEW
                }
            ),
            
            UserRole.EXTERNAL_AUDITOR: RoleDefinition(
                name=UserRole.EXTERNAL_AUDITOR,
                display_name="External Auditor",
                description="Limited audit-specific access for external auditors",
                permissions={
                    Permission.EVIDENCE_VIEW, Permission.REPORT_VIEW,
                    Permission.TRUST_SCORE_VIEW, Permission.AUDIT_LOG_VIEW
                },
                requires_approval=True
            )
        }
        
        return roles
    
    def _build_role_hierarchy(self) -> Dict[UserRole, Set[UserRole]]:
        """Build role inheritance hierarchy"""
        hierarchy = {}
        
        for role, definition in self._role_definitions.items():
            inherited_roles = set()
            
            # Add direct inheritance
            if definition.inherits_from:
                inherited_roles.add(definition.inherits_from)
                
                # Add transitive inheritance
                current_role = definition.inherits_from
                while current_role and current_role in self._role_definitions:
                    parent_def = self._role_definitions[current_role]
                    if parent_def.inherits_from and parent_def.inherits_from not in inherited_roles:
                        inherited_roles.add(parent_def.inherits_from)
                        current_role = parent_def.inherits_from
                    else:
                        break
            
            hierarchy[role] = inherited_roles
        
        return hierarchy
    
    def get_role_permissions(self, role: UserRole) -> Set[Permission]:
        """Get all permissions for a role including inherited permissions"""
        if role not in self._role_definitions:
            return set()
        
        permissions = self._role_definitions[role].permissions.copy()
        
        # Add inherited permissions
        if role in self._role_hierarchy:
            for inherited_role in self._role_hierarchy[role]:
                permissions.update(self.get_role_permissions(inherited_role))
        
        return permissions
    
    def has_permission(self, user_role: UserRole, required_permission: Permission) -> bool:
        """Check if a role has a specific permission"""
        role_permissions = self.get_role_permissions(user_role)
        return required_permission in role_permissions
    
    def can_access_resource(self, user_role: UserRole, resource: str, action: str) -> bool:
        """Check if a role can perform an action on a resource"""
        try:
            permission = Permission(f"{resource}:{action}")
            return self.has_permission(user_role, permission)
        except ValueError:
            return False
    
    def get_role_definition(self, role: UserRole) -> Optional[RoleDefinition]:
        """Get complete role definition"""
        return self._role_definitions.get(role)
    
    def get_available_roles(self, requesting_user_role: UserRole) -> List[UserRole]:
        """Get roles that can be assigned by the requesting user"""
        if requesting_user_role == UserRole.SUPER_ADMIN:
            return list(UserRole)
        
        if requesting_user_role in [UserRole.ORG_OWNER, UserRole.ORG_ADMIN]:
            # Can assign all non-system roles below their level
            assignable_roles = []
            for role in UserRole:
                role_def = self._role_definitions.get(role)
                if role_def and not role_def.is_system_role:
                    if self._is_role_below_or_equal(role, requesting_user_role):
                        assignable_roles.append(role)
            return assignable_roles
        
        return []
    
    def _is_role_below_or_equal(self, role_to_check: UserRole, reference_role: UserRole) -> bool:
        """Check if a role is below or equal to another role in hierarchy"""
        if role_to_check == reference_role:
            return True
        
        # Check if reference_role has more permissions than role_to_check
        reference_permissions = self.get_role_permissions(reference_role)
        check_permissions = self.get_role_permissions(role_to_check)
        
        return check_permissions.issubset(reference_permissions)
    
    def validate_role_assignment(self, assigner_role: UserRole, target_role: UserRole, organization_id: str) -> tuple[bool, str]:
        """Validate if a role can be assigned"""
        # Check if assigner can assign this role
        available_roles = self.get_available_roles(assigner_role)
        if target_role not in available_roles:
            return False, f"Role {assigner_role.value} cannot assign {target_role.value}"
        
        # Check role-specific restrictions
        role_def = self.get_role_definition(target_role)
        if not role_def:
            return False, "Invalid role"
        
        if role_def.requires_approval:
            return False, f"Role {target_role.value} requires system administrator approval"
        
        # TODO: Check max_users constraint (requires database query)
        
        return True, "Valid assignment"
    
    def get_role_hierarchy_json(self) -> str:
        """Get role hierarchy as JSON for frontend consumption"""
        hierarchy_data = {}
        
        for role, definition in self._role_definitions.items():
            hierarchy_data[role.value] = {
                "display_name": definition.display_name,
                "description": definition.description,
                "permissions": [p.value for p in self.get_role_permissions(role)],
                "inherits_from": definition.inherits_from.value if definition.inherits_from else None,
                "is_system_role": definition.is_system_role,
                "requires_approval": definition.requires_approval,
                "max_users": definition.max_users
            }
        
        return json.dumps(hierarchy_data, indent=2)

# Global RBAC manager instance
rbac_manager = RBACManager()

# Convenience functions
def check_permission(user_role: UserRole, permission: Permission) -> bool:
    """Quick permission check"""
    return rbac_manager.has_permission(user_role, permission)

def check_resource_access(user_role: UserRole, resource: str, action: str) -> bool:
    """Quick resource access check"""
    return rbac_manager.can_access_resource(user_role, resource, action)

def get_user_permissions(user_role: UserRole) -> List[str]:
    """Get all permissions for a user role as strings"""
    permissions = rbac_manager.get_role_permissions(user_role)
    return [p.value for p in permissions]