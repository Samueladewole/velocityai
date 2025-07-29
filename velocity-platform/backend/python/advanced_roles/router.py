"""
Advanced Roles API Router
RESTful API endpoints for advanced role management
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from pydantic import BaseModel, Field

from .role_manager import advanced_role_manager, RoleAssignment, RoleValidation
from .hierarchy import hierarchy_manager, OrganizationHierarchy, RoleNode
from .expert_network import expert_manager, ExpertRole, ExpertEngagement
from .multi_tenant import tenant_manager, TenantConfiguration, RegionalRole
from .role_delegation import delegation_manager, RoleDelegation
from .industry_templates import template_manager, IndustryTemplate, IndustryType, RoleLevel

from ..shared.auth import get_current_user, require_permission, TokenData

router = APIRouter(prefix="/api/advanced-roles", tags=["advanced-roles"])

# Request/Response Models
class CreateHierarchyRequest(BaseModel):
    hierarchy_name: str
    root_role_config: Dict[str, Any]

class CreateRoleRequest(BaseModel):
    parent_role_id: str
    role_config: Dict[str, Any]

class RoleAssignmentRequest(BaseModel):
    role_id: str
    assignment_type: str
    assignment_config: Dict[str, Any]

class ExpertRequest(BaseModel):
    expert_config: Dict[str, Any]

class ConsultantRequest(BaseModel):
    consultant_config: Dict[str, Any]

class TenantRequest(BaseModel):
    tenant_name: str
    tenant_type: str
    geographic_regions: List[str]
    tenant_config: Optional[Dict[str, Any]] = None

class DelegationRequest(BaseModel):
    delegatee_user_id: str
    role_id: str
    delegation_config: Dict[str, Any]

class TemplateApplicationRequest(BaseModel):
    template_id: str
    role_config: Dict[str, Any]

# Organizational Hierarchy Endpoints

@router.post("/hierarchy", response_model=Dict[str, Any])
async def create_organizational_hierarchy(
    request: CreateHierarchyRequest,
    current_user: TokenData = Depends(require_permission("admin"))
):
    """Create new organizational hierarchy"""
    try:
        hierarchy = await hierarchy_manager.create_hierarchy(
            organization_id=current_user.organization_id,
            hierarchy_name=request.hierarchy_name,
            root_role_config=request.root_role_config
        )
        
        return {
            "success": True,
            "hierarchy_id": hierarchy.organization_id,
            "root_role_id": hierarchy.root_role_id,
            "message": "Organizational hierarchy created successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create hierarchy: {str(e)}"
        )

@router.post("/hierarchy/roles", response_model=Dict[str, Any])
async def add_role_to_hierarchy(
    request: CreateRoleRequest,
    current_user: TokenData = Depends(require_permission("admin"))
):
    """Add new role to organizational hierarchy"""
    try:
        role = await hierarchy_manager.add_role(
            organization_id=current_user.organization_id,
            parent_role_id=request.parent_role_id,
            role_config=request.role_config
        )
        
        return {
            "success": True,
            "role_id": role.role_id,
            "role_name": role.role_name,
            "message": "Role added to hierarchy successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to add role: {str(e)}"
        )

@router.get("/hierarchy", response_model=Dict[str, Any])
async def get_organizational_hierarchy(
    current_user: TokenData = Depends(get_current_user)
):
    """Get organizational hierarchy"""
    try:
        hierarchy = hierarchy_manager.hierarchies.get(current_user.organization_id)
        if not hierarchy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organizational hierarchy not found"
            )
        
        return {
            "hierarchy_id": hierarchy.organization_id,
            "hierarchy_name": hierarchy.hierarchy_name,
            "root_role_id": hierarchy.root_role_id,
            "total_roles": len(hierarchy.roles),
            "roles": [
                {
                    "role_id": role.role_id,
                    "role_name": role.role_name,
                    "role_type": role.role_type,
                    "hierarchy_level": role.hierarchy_level,
                    "parent_role_id": role.parent_role_id,
                    "child_role_count": len(role.child_role_ids),
                    "user_count": len(role.user_ids),
                    "is_active": role.is_active
                }
                for role in hierarchy.roles.values()
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get hierarchy: {str(e)}"
        )

@router.get("/hierarchy/roles/{role_id}/path", response_model=List[Dict[str, Any]])
async def get_role_hierarchy_path(
    role_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Get hierarchy path from root to role"""
    try:
        path = await hierarchy_manager.get_role_hierarchy_path(
            organization_id=current_user.organization_id,
            role_id=role_id
        )
        
        return [
            {
                "role_id": role.role_id,
                "role_name": role.role_name,
                "role_type": role.role_type,
                "hierarchy_level": role.hierarchy_level
            }
            for role in path
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to get hierarchy path: {str(e)}"
        )

# Expert Network Endpoints

@router.post("/expert-network", response_model=Dict[str, Any])
async def create_expert_network(
    network_name: str,
    network_config: Optional[Dict[str, Any]] = None,
    current_user: TokenData = Depends(require_permission("admin"))
):
    """Create expert network for organization"""
    try:
        if network_config is None:
            network_config = {}
        
        network = await expert_manager.create_expert_network(
            organization_id=current_user.organization_id,
            network_name=network_name,
            network_config=network_config
        )
        
        return {
            "success": True,
            "network_id": network.network_id,
            "message": "Expert network created successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create expert network: {str(e)}"
        )

@router.post("/experts", response_model=Dict[str, Any])
async def add_expert(
    request: ExpertRequest,
    current_user: TokenData = Depends(require_permission("expert_network"))
):
    """Add expert to network"""
    try:
        expert = await expert_manager.add_expert(
            organization_id=current_user.organization_id,
            expert_config=request.expert_config
        )
        
        return {
            "success": True,
            "expert_id": expert.expert_id,
            "expert_name": expert.expert_name,
            "message": "Expert added successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to add expert: {str(e)}"
        )

@router.get("/experts/search", response_model=List[Dict[str, Any]])
async def search_experts(
    expertise_area: Optional[str] = Query(None),
    min_tier: Optional[str] = Query(None),
    available_only: Optional[bool] = Query(True),
    geographic_region: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    max_hourly_rate: Optional[float] = Query(None),
    current_user: TokenData = Depends(require_permission("expert_network"))
):
    """Search for experts by criteria"""
    try:
        criteria = {}
        if expertise_area:
            criteria["expertise_area"] = expertise_area
        if min_tier:
            criteria["min_tier"] = min_tier
        if available_only is not None:
            criteria["available_only"] = available_only
        if geographic_region:
            criteria["geographic_region"] = geographic_region
        if industry:
            criteria["industry"] = industry
        if max_hourly_rate:
            criteria["max_hourly_rate"] = max_hourly_rate
        
        experts = await expert_manager.find_experts_by_criteria(
            organization_id=current_user.organization_id,
            criteria=criteria
        )
        
        return [
            {
                "expert_id": expert.expert_id,
                "expert_name": expert.expert_name,
                "expertise_areas": expert.expertise_areas,
                "expert_tier": expert.expert_tier,
                "hourly_rate": expert.hourly_rate,
                "status": expert.status,
                "geographic_regions": expert.geographic_regions,
                "industry_experience": expert.industry_experience
            }
            for expert in experts
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to search experts: {str(e)}"
        )

@router.post("/experts/{expert_id}/engage", response_model=Dict[str, Any])
async def create_expert_engagement(
    expert_id: str,
    engagement_config: Dict[str, Any],
    current_user: TokenData = Depends(require_permission("expert_network"))
):
    """Create expert engagement"""
    try:
        engagement = await expert_manager.create_engagement(
            organization_id=current_user.organization_id,
            expert_id=expert_id,
            engagement_config=engagement_config
        )
        
        return {
            "success": True,
            "engagement_id": engagement.engagement_id,
            "message": "Expert engagement created successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create engagement: {str(e)}"
        )

# Multi-Tenant Management Endpoints

@router.post("/tenants", response_model=Dict[str, Any])
async def create_tenant(
    request: TenantRequest,
    parent_tenant_id: Optional[str] = Query(None),
    current_user: TokenData = Depends(require_permission("tenant_management"))
):
    """Create new tenant"""
    try:
        tenant = await tenant_manager.create_tenant(
            tenant_name=request.tenant_name,
            tenant_type=request.tenant_type,
            geographic_regions=request.geographic_regions,
            parent_tenant_id=parent_tenant_id,
            tenant_config=request.tenant_config
        )
        
        return {
            "success": True,
            "tenant_id": tenant.tenant_id,
            "message": "Tenant created successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create tenant: {str(e)}"
        )

@router.get("/tenants/{tenant_id}/compliance", response_model=Dict[str, Any])
async def get_tenant_compliance_status(
    tenant_id: str,
    current_user: TokenData = Depends(require_permission("compliance"))
):
    """Get tenant compliance status"""
    try:
        compliance_status = await tenant_manager.get_tenant_compliance_status(tenant_id)
        return compliance_status
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to get compliance status: {str(e)}"
        )

# Role Delegation Endpoints

@router.post("/delegations", response_model=Dict[str, Any])
async def create_role_delegation(
    request: DelegationRequest,
    current_user: TokenData = Depends(require_permission("role_delegation"))
):
    """Create role delegation request"""
    try:
        delegation = await delegation_manager.create_delegation_request(
            delegator_user_id=current_user.user_id,
            delegatee_user_id=request.delegatee_user_id,
            role_id=request.role_id,
            delegation_config=request.delegation_config
        )
        
        return {
            "success": True,
            "delegation_id": delegation.delegation_id,
            "status": delegation.status,
            "message": "Delegation request created successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create delegation: {str(e)}"
        )

@router.delete("/delegations/{delegation_id}", response_model=Dict[str, Any])
async def revoke_role_delegation(
    delegation_id: str,
    reason: str,
    current_user: TokenData = Depends(require_permission("role_delegation"))
):
    """Revoke role delegation"""
    try:
        success = await delegation_manager.revoke_delegation(
            delegation_id=delegation_id,
            revoker_id=current_user.user_id,
            reason=reason
        )
        
        if success:
            return {
                "success": True,
                "message": "Delegation revoked successfully"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Delegation not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to revoke delegation: {str(e)}"
        )

# Industry Templates Endpoints

@router.get("/templates/industries", response_model=List[str])
async def get_available_industries():
    """Get list of available industry types"""
    return [industry.value for industry in IndustryType]

@router.get("/templates/role-levels", response_model=List[str])
async def get_available_role_levels():
    """Get list of available role levels"""
    return [level.value for level in RoleLevel]

@router.get("/templates", response_model=List[Dict[str, Any]])
async def get_industry_templates(
    industry_type: Optional[str] = Query(None),
    role_level: Optional[str] = Query(None),
    current_user: TokenData = Depends(get_current_user)
):
    """Get industry templates"""
    try:
        if industry_type:
            templates = await template_manager.get_templates_by_industry(
                IndustryType(industry_type)
            )
        else:
            # Get all templates and filter if needed
            criteria = {}
            if role_level:
                criteria["role_level"] = RoleLevel(role_level)
            
            templates = await template_manager.find_templates(criteria)
        
        return [
            {
                "template_id": template.template_id,
                "template_name": template.template_name,
                "industry_type": template.industry_type,
                "role_level": template.role_level,
                "description": template.description,
                "permissions_count": len(template.base_permissions),
                "components_count": len(template.component_access),
                "compliance_requirements": template.compliance_requirements,
                "certification_requirements": template.certification_requirements
            }
            for template in templates
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to get templates: {str(e)}"
        )

@router.get("/templates/{template_id}", response_model=Dict[str, Any])
async def get_template_details(
    template_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Get detailed template information"""
    try:
        template = await template_manager.get_template_by_id(template_id)
        if not template:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found"
            )
        
        return template.dict()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to get template details: {str(e)}"
        )

@router.post("/templates/{template_id}/apply", response_model=Dict[str, Any])
async def apply_industry_template(
    template_id: str,
    request: TemplateApplicationRequest,
    current_user: TokenData = Depends(require_permission("admin"))
):
    """Apply industry template to role configuration"""
    try:
        applied_config = await template_manager.apply_template_to_role(
            template_id=template_id,
            role_config=request.role_config
        )
        
        return {
            "success": True,
            "applied_config": applied_config,
            "message": "Template applied successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to apply template: {str(e)}"
        )

# Advanced Role Management Endpoints

@router.post("/assignments", response_model=Dict[str, Any])
async def create_role_assignment(
    request: RoleAssignmentRequest,
    current_user: TokenData = Depends(require_permission("role_management"))
):
    """Create comprehensive role assignment"""
    try:
        assignment = await advanced_role_manager.create_role_assignment(
            user_id=current_user.user_id,
            role_id=request.role_id,
            organization_id=current_user.organization_id,
            assignment_config=request.assignment_config
        )
        
        return {
            "success": True,
            "assignment_id": assignment.assignment_id,
            "status": assignment.status,
            "effective_permissions": assignment.effective_permissions,
            "effective_components": assignment.effective_components,
            "message": "Role assignment created successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create assignment: {str(e)}"
        )

@router.get("/users/{user_id}/permissions", response_model=Dict[str, Any])
async def get_user_effective_permissions(
    user_id: str,
    current_user: TokenData = Depends(require_permission("role_management"))
):
    """Get user's effective permissions across all assignments"""
    try:
        permissions = await advanced_role_manager.get_user_effective_permissions(
            user_id=user_id,
            organization_id=current_user.organization_id
        )
        
        return permissions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to get permissions: {str(e)}"
        )

@router.delete("/assignments/{assignment_id}", response_model=Dict[str, Any])
async def revoke_role_assignment(
    assignment_id: str,
    reason: str,
    current_user: TokenData = Depends(require_permission("role_management"))
):
    """Revoke role assignment"""
    try:
        success = await advanced_role_manager.revoke_role_assignment(
            assignment_id=assignment_id,
            revoker_id=current_user.user_id,
            reason=reason
        )
        
        if success:
            return {
                "success": True,
                "message": "Role assignment revoked successfully"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignment not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to revoke assignment: {str(e)}"
        )

# Statistics and Analytics Endpoints

@router.get("/analytics/templates", response_model=Dict[str, Any])
async def get_template_analytics(
    current_user: TokenData = Depends(require_permission("analytics"))
):
    """Get template usage analytics"""
    try:
        stats = await template_manager.get_industry_statistics()
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to get template analytics: {str(e)}"
        )

@router.get("/analytics/experts/{expert_id}/utilization", response_model=Dict[str, Any])
async def get_expert_utilization(
    expert_id: str,
    period_days: int = Query(30, ge=1, le=365),
    current_user: TokenData = Depends(require_permission("expert_network"))
):
    """Get expert utilization metrics"""
    try:
        utilization = await expert_manager.get_expert_utilization(
            organization_id=current_user.organization_id,
            expert_id=expert_id,
            period_days=period_days
        )
        
        return utilization
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to get expert utilization: {str(e)}"
        )