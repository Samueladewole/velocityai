"""
Organizational Hierarchy and Role Structure Management
Complex nested role hierarchies with inheritance and delegation
"""

from typing import Dict, List, Optional, Set, Any, Union
from datetime import datetime, timedelta
from enum import Enum
from pydantic import BaseModel, Field
from abc import ABC, abstractmethod
import structlog
import uuid

logger = structlog.get_logger()

class HierarchyLevel(str, Enum):
    """Organizational hierarchy levels"""
    ENTERPRISE = "enterprise"
    DIVISION = "division"
    DEPARTMENT = "department"
    TEAM = "team"
    INDIVIDUAL = "individual"

class RoleType(str, Enum):
    """Types of roles in the organization"""
    STRUCTURAL = "structural"  # Org chart roles (Manager, Director, etc.)
    FUNCTIONAL = "functional"  # Job function roles (Risk Manager, Analyst, etc.)
    PROJECT = "project"       # Temporary project roles
    EXPERT = "expert"         # Expert network roles
    DELEGATED = "delegated"   # Temporarily delegated roles

class RoleScope(str, Enum):
    """Scope of role authority"""
    GLOBAL = "global"         # Enterprise-wide authority
    REGIONAL = "regional"     # Geographic region authority
    DIVISIONAL = "divisional" # Division-specific authority
    DEPARTMENTAL = "departmental" # Department-specific authority
    TEAM = "team"            # Team-specific authority
    INDIVIDUAL = "individual" # Individual-specific authority

class RoleNode(BaseModel):
    """Individual role node in organizational hierarchy"""
    role_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role_name: str
    role_type: RoleType
    hierarchy_level: HierarchyLevel
    scope: RoleScope
    parent_role_id: Optional[str] = None
    child_role_ids: List[str] = Field(default_factory=list)
    user_ids: List[str] = Field(default_factory=list)
    permissions: List[str] = Field(default_factory=list)
    inherited_permissions: List[str] = Field(default_factory=list)
    delegation_authority: bool = False
    approval_authority: bool = False
    budget_authority: Optional[float] = None
    geographic_restrictions: List[str] = Field(default_factory=list)
    industry_specialization: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class RoleInheritance(BaseModel):
    """Role inheritance configuration"""
    parent_role_id: str
    child_role_id: str
    inheritance_type: str  # "full", "partial", "restricted"
    inherited_permissions: List[str]
    restrictions: Dict[str, Any] = Field(default_factory=dict)
    effective_from: datetime = Field(default_factory=datetime.utcnow)
    effective_until: Optional[datetime] = None

class OrganizationHierarchy(BaseModel):
    """Complete organizational hierarchy structure"""
    organization_id: str
    hierarchy_name: str
    root_role_id: str
    roles: Dict[str, RoleNode] = Field(default_factory=dict)
    inheritance_rules: List[RoleInheritance] = Field(default_factory=list)
    approval_chains: Dict[str, List[str]] = Field(default_factory=dict)
    delegation_policies: Dict[str, Any] = Field(default_factory=dict)
    geographic_mapping: Dict[str, List[str]] = Field(default_factory=dict)
    industry_mapping: Dict[str, List[str]] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class HierarchyManager:
    """
    Advanced organizational hierarchy management
    Handles complex nested structures with inheritance and delegation
    """
    
    def __init__(self):
        self.hierarchies: Dict[str, OrganizationHierarchy] = {}
        
    async def create_hierarchy(
        self,
        organization_id: str,
        hierarchy_name: str,
        root_role_config: Dict[str, Any]
    ) -> OrganizationHierarchy:
        """Create new organizational hierarchy"""
        try:
            # Create root role
            root_role = RoleNode(
                role_name=root_role_config.get("role_name", "Enterprise Administrator"),
                role_type=RoleType.STRUCTURAL,
                hierarchy_level=HierarchyLevel.ENTERPRISE,
                scope=RoleScope.GLOBAL,
                delegation_authority=True,
                approval_authority=True,
                permissions=root_role_config.get("permissions", []),
                **root_role_config
            )
            
            # Create hierarchy
            hierarchy = OrganizationHierarchy(
                organization_id=organization_id,
                hierarchy_name=hierarchy_name,
                root_role_id=root_role.role_id,
                roles={root_role.role_id: root_role}
            )
            
            self.hierarchies[organization_id] = hierarchy
            
            logger.info("Organizational hierarchy created",
                       organization_id=organization_id,
                       hierarchy_name=hierarchy_name,
                       root_role_id=root_role.role_id)
            
            return hierarchy
            
        except Exception as e:
            logger.error("Failed to create organizational hierarchy",
                        organization_id=organization_id,
                        error=str(e))
            raise
    
    async def add_role(
        self,
        organization_id: str,
        parent_role_id: str,
        role_config: Dict[str, Any]
    ) -> RoleNode:
        """Add new role to hierarchy"""
        try:
            hierarchy = self.hierarchies.get(organization_id)
            if not hierarchy:
                raise ValueError(f"Hierarchy not found for organization {organization_id}")
            
            parent_role = hierarchy.roles.get(parent_role_id)
            if not parent_role:
                raise ValueError(f"Parent role {parent_role_id} not found")
            
            # Create new role
            new_role = RoleNode(**role_config)
            new_role.parent_role_id = parent_role_id
            
            # Add to hierarchy
            hierarchy.roles[new_role.role_id] = new_role
            parent_role.child_role_ids.append(new_role.role_id)
            
            # Apply inheritance
            await self._apply_inheritance(hierarchy, new_role, parent_role)
            
            # Update hierarchy timestamp
            hierarchy.updated_at = datetime.utcnow()
            
            logger.info("Role added to hierarchy",
                       organization_id=organization_id,
                       role_id=new_role.role_id,
                       parent_role_id=parent_role_id)
            
            return new_role
            
        except Exception as e:
            logger.error("Failed to add role to hierarchy",
                        organization_id=organization_id,
                        error=str(e))
            raise
    
    async def _apply_inheritance(
        self,
        hierarchy: OrganizationHierarchy,
        child_role: RoleNode,
        parent_role: RoleNode
    ):
        """Apply role inheritance rules"""
        try:
            # Find applicable inheritance rules
            applicable_rules = [
                rule for rule in hierarchy.inheritance_rules
                if rule.parent_role_id == parent_role.role_id
            ]
            
            inherited_permissions = set()
            
            if applicable_rules:
                # Apply specific inheritance rules
                for rule in applicable_rules:
                    if rule.inheritance_type == "full":
                        inherited_permissions.update(parent_role.permissions)
                        inherited_permissions.update(parent_role.inherited_permissions)
                    elif rule.inheritance_type == "partial":
                        inherited_permissions.update(rule.inherited_permissions)
                    # "restricted" inheritance handled by restrictions
            else:
                # Default inheritance: inherit relevant permissions based on scope
                if child_role.scope in [RoleScope.GLOBAL, RoleScope.REGIONAL]:
                    inherited_permissions.update(parent_role.permissions)
                elif child_role.hierarchy_level == parent_role.hierarchy_level:
                    # Same level: inherit limited permissions
                    inherited_permissions.update([
                        perm for perm in parent_role.permissions
                        if "read" in perm.lower()
                    ])
            
            child_role.inherited_permissions = list(inherited_permissions)
            
        except Exception as e:
            logger.error("Failed to apply role inheritance",
                        child_role_id=child_role.role_id,
                        parent_role_id=parent_role.role_id,
                        error=str(e))
    
    async def assign_user_to_role(
        self,
        organization_id: str,
        role_id: str,
        user_id: str,
        assignment_metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Assign user to role with optional metadata"""
        try:
            hierarchy = self.hierarchies.get(organization_id)
            if not hierarchy:
                raise ValueError(f"Hierarchy not found for organization {organization_id}")
            
            role = hierarchy.roles.get(role_id)
            if not role:
                raise ValueError(f"Role {role_id} not found")
            
            if user_id not in role.user_ids:
                role.user_ids.append(user_id)
                
                # Store assignment metadata
                if assignment_metadata:
                    if "user_assignments" not in role.metadata:
                        role.metadata["user_assignments"] = {}
                    role.metadata["user_assignments"][user_id] = assignment_metadata
                
                hierarchy.updated_at = datetime.utcnow()
                
                logger.info("User assigned to role",
                           organization_id=organization_id,
                           role_id=role_id,
                           user_id=user_id)
                
                return True
            
            return False
            
        except Exception as e:
            logger.error("Failed to assign user to role",
                        organization_id=organization_id,
                        role_id=role_id,
                        user_id=user_id,
                        error=str(e))
            return False
    
    async def get_user_roles(
        self,
        organization_id: str,
        user_id: str
    ) -> List[RoleNode]:
        """Get all roles assigned to a user"""
        try:
            hierarchy = self.hierarchies.get(organization_id)
            if not hierarchy:
                return []
            
            user_roles = []
            for role in hierarchy.roles.values():
                if user_id in role.user_ids and role.is_active:
                    user_roles.append(role)
            
            return user_roles
            
        except Exception as e:
            logger.error("Failed to get user roles",
                        organization_id=organization_id,
                        user_id=user_id,
                        error=str(e))
            return []
    
    async def get_effective_permissions(
        self,
        organization_id: str,
        user_id: str
    ) -> Set[str]:
        """Get all effective permissions for a user across all roles"""
        try:
            user_roles = await self.get_user_roles(organization_id, user_id)
            
            effective_permissions = set()
            for role in user_roles:
                effective_permissions.update(role.permissions)
                effective_permissions.update(role.inherited_permissions)
            
            return effective_permissions
            
        except Exception as e:
            logger.error("Failed to get effective permissions",
                        organization_id=organization_id,
                        user_id=user_id,
                        error=str(e))
            return set()
    
    async def get_role_hierarchy_path(
        self,
        organization_id: str,
        role_id: str
    ) -> List[RoleNode]:
        """Get the full hierarchy path from root to role"""
        try:
            hierarchy = self.hierarchies.get(organization_id)
            if not hierarchy:
                return []
            
            role = hierarchy.roles.get(role_id)
            if not role:
                return []
            
            path = []
            current_role = role
            
            while current_role:
                path.insert(0, current_role)
                if current_role.parent_role_id:
                    current_role = hierarchy.roles.get(current_role.parent_role_id)
                else:
                    break
            
            return path
            
        except Exception as e:
            logger.error("Failed to get role hierarchy path",
                        organization_id=organization_id,
                        role_id=role_id,
                        error=str(e))
            return []
    
    async def find_roles_by_criteria(
        self,
        organization_id: str,
        criteria: Dict[str, Any]
    ) -> List[RoleNode]:
        """Find roles matching specific criteria"""
        try:
            hierarchy = self.hierarchies.get(organization_id)
            if not hierarchy:
                return []
            
            matching_roles = []
            
            for role in hierarchy.roles.values():
                if not role.is_active:
                    continue
                
                match = True
                
                # Check role type
                if "role_type" in criteria and role.role_type != criteria["role_type"]:
                    match = False
                
                # Check hierarchy level
                if "hierarchy_level" in criteria and role.hierarchy_level != criteria["hierarchy_level"]:
                    match = False
                
                # Check scope
                if "scope" in criteria and role.scope != criteria["scope"]:
                    match = False
                
                # Check permissions
                if "has_permission" in criteria:
                    required_permission = criteria["has_permission"]
                    if (required_permission not in role.permissions and 
                        required_permission not in role.inherited_permissions):
                        match = False
                
                # Check geographic restrictions
                if "geographic_region" in criteria:
                    region = criteria["geographic_region"]
                    if (role.geographic_restrictions and 
                        region not in role.geographic_restrictions):
                        match = False
                
                # Check industry specialization
                if "industry" in criteria:
                    industry = criteria["industry"]
                    if (role.industry_specialization and 
                        industry not in role.industry_specialization):
                        match = False
                
                if match:
                    matching_roles.append(role)
            
            return matching_roles
            
        except Exception as e:
            logger.error("Failed to find roles by criteria",
                        organization_id=organization_id,
                        criteria=criteria,
                        error=str(e))
            return []
    
    async def validate_role_assignment(
        self,
        organization_id: str,
        role_id: str,
        user_id: str
    ) -> Dict[str, Any]:
        """Validate if user can be assigned to role"""
        try:
            hierarchy = self.hierarchies.get(organization_id)
            if not hierarchy:
                return {"valid": False, "reason": "Hierarchy not found"}
            
            role = hierarchy.roles.get(role_id)
            if not role:
                return {"valid": False, "reason": "Role not found"}
            
            if not role.is_active:
                return {"valid": False, "reason": "Role is inactive"}
            
            # Check for conflicts with existing roles
            user_roles = await self.get_user_roles(organization_id, user_id)
            
            for existing_role in user_roles:
                # Check for hierarchy conflicts
                if (existing_role.hierarchy_level == role.hierarchy_level and
                    existing_role.scope == role.scope and
                    existing_role.role_type == RoleType.STRUCTURAL):
                    return {
                        "valid": False,
                        "reason": "Conflicts with existing structural role",
                        "conflicting_role": existing_role.role_id
                    }
            
            return {"valid": True, "reason": "Assignment valid"}
            
        except Exception as e:
            logger.error("Failed to validate role assignment",
                        organization_id=organization_id,
                        role_id=role_id,
                        user_id=user_id,
                        error=str(e))
            return {"valid": False, "reason": f"Validation error: {str(e)}"}

# Global hierarchy manager instance
hierarchy_manager = HierarchyManager()