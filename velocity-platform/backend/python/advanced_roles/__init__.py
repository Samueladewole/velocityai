"""
ERIP Advanced User Roles Framework
Complex organizational hierarchy, expert networks, and enterprise role management
"""

from .hierarchy import (
    OrganizationHierarchy,
    RoleNode,
    HierarchyManager,
    RoleInheritance
)

from .expert_network import (
    ExpertRole,
    ExpertNetwork,
    ExpertManager,
    ConsultantRole
)

from .multi_tenant import (
    TenantManager,
    GeographicCompliance,
    RegionalRole,
    ComplianceFramework
)

from .role_delegation import (
    RoleDelegation,
    ApprovalWorkflow,
    DelegationManager,
    WorkflowEngine
)

from .industry_templates import (
    IndustryTemplate,
    FinancialRoles,
    HealthcareRoles,
    ManufacturingRoles,
    TemplateManager
)

from .role_manager import (
    AdvancedRoleManager,
    RoleAssignment,
    RoleValidation
)

from .router import router

__all__ = [
    # Hierarchy
    "OrganizationHierarchy",
    "RoleNode", 
    "HierarchyManager",
    "RoleInheritance",
    
    # Expert Network
    "ExpertRole",
    "ExpertNetwork",
    "ExpertManager", 
    "ConsultantRole",
    
    # Multi-tenant
    "TenantManager",
    "GeographicCompliance",
    "RegionalRole",
    "ComplianceFramework",
    
    # Delegation
    "RoleDelegation",
    "ApprovalWorkflow", 
    "DelegationManager",
    "WorkflowEngine",
    
    # Industry Templates
    "IndustryTemplate",
    "FinancialRoles",
    "HealthcareRoles",
    "ManufacturingRoles",
    "TemplateManager",
    
    # Role Manager
    "AdvancedRoleManager",
    "RoleAssignment",
    "RoleValidation",
    
    # Router
    "router"
]