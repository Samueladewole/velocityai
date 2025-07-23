"""
Advanced Role Manager
Central coordination for all advanced role management features
"""

from typing import Dict, List, Optional, Set, Any, Union
from datetime import datetime, timedelta
from enum import Enum
from pydantic import BaseModel, Field
import structlog
import uuid

from .hierarchy import hierarchy_manager, OrganizationHierarchy, RoleNode
from .expert_network import expert_manager, ExpertRole, ExpertEngagement
from .multi_tenant import tenant_manager, TenantConfiguration, RegionalRole
from .role_delegation import delegation_manager, RoleDelegation
from .industry_templates import template_manager, IndustryTemplate

logger = structlog.get_logger()

class RoleAssignmentType(str, Enum):
    """Types of role assignments"""
    PERMANENT = "permanent"
    TEMPORARY = "temporary"
    DELEGATED = "delegated"
    EXPERT = "expert"
    CONSULTANT = "consultant"
    PROJECT = "project"

class AssignmentStatus(str, Enum):
    """Role assignment status"""
    ACTIVE = "active"
    PENDING = "pending"
    EXPIRED = "expired"
    REVOKED = "revoked"
    SUSPENDED = "suspended"

class RoleAssignment(BaseModel):
    """Comprehensive role assignment"""
    assignment_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    role_id: str
    assignment_type: RoleAssignmentType
    organization_id: str
    tenant_id: Optional[str] = None
    regional_role_id: Optional[str] = None
    delegation_id: Optional[str] = None
    expert_engagement_id: Optional[str] = None
    template_id: Optional[str] = None
    effective_permissions: List[str] = Field(default_factory=list)
    effective_components: List[str] = Field(default_factory=list)
    geographic_restrictions: List[str] = Field(default_factory=list)
    time_restrictions: Dict[str, Any] = Field(default_factory=dict)
    data_access_level: str = "standard"
    compliance_requirements: List[str] = Field(default_factory=list)
    start_date: datetime = Field(default_factory=datetime.utcnow)
    end_date: Optional[datetime] = None
    status: AssignmentStatus = AssignmentStatus.PENDING
    assignment_reason: str
    approved_by: Optional[str] = None
    approval_date: Optional[datetime] = None
    last_accessed: Optional[datetime] = None
    access_count: int = 0
    audit_trail: List[Dict[str, Any]] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RoleValidation(BaseModel):
    """Role assignment validation result"""
    is_valid: bool
    validation_errors: List[str] = Field(default_factory=list)
    validation_warnings: List[str] = Field(default_factory=list)
    compliance_issues: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    risk_assessment: Dict[str, Any] = Field(default_factory=dict)

class AdvancedRoleManager:
    """
    Advanced Role Management System
    Central coordinator for all role management features
    """
    
    def __init__(self):
        self.role_assignments: Dict[str, RoleAssignment] = {}
        self.hierarchy_manager = hierarchy_manager
        self.expert_manager = expert_manager
        self.tenant_manager = tenant_manager
        self.delegation_manager = delegation_manager
        self.template_manager = template_manager
    
    async def create_role_assignment(
        self,
        user_id: str,
        role_id: str,
        organization_id: str,
        assignment_config: Dict[str, Any]
    ) -> RoleAssignment:
        """Create comprehensive role assignment"""
        try:
            assignment = RoleAssignment(
                user_id=user_id,
                role_id=role_id,
                organization_id=organization_id,
                **assignment_config
            )
            
            # Validate assignment
            validation = await self.validate_role_assignment(assignment)
            if not validation.is_valid:
                raise ValueError(f"Role assignment validation failed: {validation.validation_errors}")
            
            # Calculate effective permissions
            assignment.effective_permissions = await self._calculate_effective_permissions(assignment)
            assignment.effective_components = await self._calculate_effective_components(assignment)
            
            # Apply restrictions
            await self._apply_assignment_restrictions(assignment)
            
            # Store assignment
            self.role_assignments[assignment.assignment_id] = assignment
            
            # Update underlying systems
            await self._sync_assignment_to_systems(assignment)
            
            # Add to audit trail
            assignment.audit_trail.append({
                "action": "created",
                "timestamp": datetime.utcnow(),
                "details": "Role assignment created"
            })
            
            logger.info("Role assignment created",
                       assignment_id=assignment.assignment_id,
                       user_id=user_id,
                       role_id=role_id,
                       assignment_type=assignment.assignment_type)
            
            return assignment
            
        except Exception as e:
            logger.error("Failed to create role assignment",
                        user_id=user_id,
                        role_id=role_id,
                        error=str(e))
            raise
    
    async def validate_role_assignment(
        self,
        assignment: RoleAssignment
    ) -> RoleValidation:
        """Comprehensive role assignment validation"""
        try:
            validation = RoleValidation(is_valid=True)
            
            # Basic validation
            if assignment.user_id == assignment.role_id:
                validation.validation_errors.append("User ID cannot be same as role ID")
                validation.is_valid = False
            
            # Check organization hierarchy
            hierarchy = self.hierarchy_manager.hierarchies.get(assignment.organization_id)
            if not hierarchy:
                validation.validation_errors.append("Organization hierarchy not found")
                validation.is_valid = False
                return validation
            
            role_node = hierarchy.roles.get(assignment.role_id)
            if not role_node or not role_node.is_active:
                validation.validation_errors.append("Role not found or inactive")
                validation.is_valid = False
            
            # Validate assignment type specific requirements
            if assignment.assignment_type == RoleAssignmentType.TEMPORARY:
                if not assignment.end_date:
                    validation.validation_errors.append("Temporary assignments require end date")
                    validation.is_valid = False
                elif assignment.end_date <= assignment.start_date:
                    validation.validation_errors.append("End date must be after start date")
                    validation.is_valid = False
            
            elif assignment.assignment_type == RoleAssignmentType.DELEGATED:
                if not assignment.delegation_id:
                    validation.validation_errors.append("Delegated assignments require delegation ID")
                    validation.is_valid = False
            
            elif assignment.assignment_type == RoleAssignmentType.EXPERT:
                if not assignment.expert_engagement_id:
                    validation.validation_errors.append("Expert assignments require engagement ID")
                    validation.is_valid = False
            
            # Check for conflicting assignments
            conflicts = await self._check_assignment_conflicts(assignment)
            if conflicts:
                validation.validation_warnings.extend(conflicts)
            
            # Validate tenant permissions
            if assignment.tenant_id:
                tenant_validation = await self._validate_tenant_permissions(assignment)
                if tenant_validation:
                    validation.compliance_issues.extend(tenant_validation)
            
            # Validate compliance requirements
            compliance_validation = await self._validate_compliance_requirements(assignment)
            if compliance_validation:
                validation.compliance_issues.extend(compliance_validation)
            
            # Risk assessment
            validation.risk_assessment = await self._assess_assignment_risk(assignment)
            
            # Generate recommendations
            validation.recommendations = await self._generate_assignment_recommendations(
                assignment, validation
            )
            
            # Final validation check
            if validation.compliance_issues:
                critical_issues = [
                    issue for issue in validation.compliance_issues
                    if "critical" in issue.lower()
                ]
                if critical_issues:
                    validation.is_valid = False
                    validation.validation_errors.extend(critical_issues)
            
            return validation
            
        except Exception as e:
            logger.error("Failed to validate role assignment",
                        assignment_id=getattr(assignment, 'assignment_id', 'unknown'),
                        error=str(e))
            return RoleValidation(
                is_valid=False,
                validation_errors=[f"Validation error: {str(e)}"]
            )
    
    async def _calculate_effective_permissions(
        self,
        assignment: RoleAssignment
    ) -> List[str]:
        """Calculate effective permissions for assignment"""
        try:
            permissions = set()
            
            # Get base role permissions
            hierarchy = self.hierarchy_manager.hierarchies.get(assignment.organization_id)
            if hierarchy:
                role_node = hierarchy.roles.get(assignment.role_id)
                if role_node:
                    permissions.update(role_node.permissions)
                    permissions.update(role_node.inherited_permissions)
            
            # Apply template permissions
            if assignment.template_id:
                template = await self.template_manager.get_template_by_id(assignment.template_id)
                if template:
                    permissions.update(template.base_permissions)
            
            # Apply delegation restrictions
            if assignment.assignment_type == RoleAssignmentType.DELEGATED and assignment.delegation_id:
                delegation = delegation_manager.delegations.get(assignment.delegation_id)
                if delegation:
                    if delegation.delegation_scope == "specific_permissions":
                        # Only allow delegated permissions
                        permissions = permissions.intersection(set(delegation.permissions_delegated))
                    elif delegation.delegation_scope == "read_only":
                        # Filter to read-only permissions
                        permissions = {p for p in permissions if "read" in p.lower()}
            
            # Apply expert network restrictions
            if assignment.assignment_type == RoleAssignmentType.EXPERT:
                # Apply expert-specific restrictions based on data access level
                if assignment.data_access_level == "restricted":
                    permissions = {p for p in permissions if "sensitive" not in p.lower()}
            
            # Apply tenant-specific permissions
            if assignment.tenant_id:
                tenant = tenant_manager.tenants.get(assignment.tenant_id)
                if tenant:
                    # Apply tenant feature flags
                    if not tenant.feature_flags.get("api_access", False):
                        permissions = {p for p in permissions if "api" not in p.lower()}
                    
                    if not tenant.feature_flags.get("advanced_analytics", False):
                        permissions = {p for p in permissions if "advanced" not in p.lower()}
            
            return list(permissions)
            
        except Exception as e:
            logger.error("Failed to calculate effective permissions",
                        assignment_id=assignment.assignment_id,
                        error=str(e))
            return []
    
    async def _calculate_effective_components(
        self,
        assignment: RoleAssignment
    ) -> List[str]:
        """Calculate effective component access for assignment"""
        try:
            components = set()
            
            # Get base role component access
            hierarchy = self.hierarchy_manager.hierarchies.get(assignment.organization_id)
            if hierarchy:
                role_node = hierarchy.roles.get(assignment.role_id)
                if role_node:
                    # Derive components from permissions
                    for permission in assignment.effective_permissions:
                        if "_" in permission:
                            component = permission.split("_")[0]
                            components.add(component)
            
            # Apply template component access
            if assignment.template_id:
                template = await self.template_manager.get_template_by_id(assignment.template_id)
                if template:
                    components.update(template.component_access)
            
            # Apply delegation restrictions
            if assignment.assignment_type == RoleAssignmentType.DELEGATED and assignment.delegation_id:
                delegation = delegation_manager.delegations.get(assignment.delegation_id)
                if delegation and delegation.delegation_scope == "component_access":
                    # Only allow specific components
                    allowed_components = delegation.metadata.get("allowed_components", [])
                    components = components.intersection(set(allowed_components))
            
            return list(components)
            
        except Exception as e:
            logger.error("Failed to calculate effective components",
                        assignment_id=assignment.assignment_id,
                        error=str(e))
            return []
    
    async def _apply_assignment_restrictions(self, assignment: RoleAssignment):
        """Apply various restrictions to assignment"""
        try:
            # Apply geographic restrictions
            if assignment.regional_role_id:
                regional_roles = tenant_manager.regional_roles
                regional_role = regional_roles.get(assignment.regional_role_id)
                if regional_role:
                    assignment.geographic_restrictions.extend(regional_role.cross_border_restrictions)
            
            # Apply tenant restrictions
            if assignment.tenant_id:
                tenant = tenant_manager.tenants.get(assignment.tenant_id)
                if tenant:
                    # Apply data residency requirements
                    if tenant.data_residency_requirements:
                        assignment.metadata["data_residency"] = tenant.data_residency_requirements
                    
                    # Apply resource limits
                    if tenant.resource_limits:
                        assignment.metadata["resource_limits"] = tenant.resource_limits
            
            # Apply time restrictions based on role type
            hierarchy = self.hierarchy_manager.hierarchies.get(assignment.organization_id)
            if hierarchy:
                role_node = hierarchy.roles.get(assignment.role_id)
                if role_node and role_node.role_type.value == "expert":
                    # Apply expert-specific time restrictions
                    assignment.time_restrictions = {
                        "business_hours_only": True,
                        "max_session_hours": 8,
                        "timezone_restrictions": assignment.geographic_restrictions
                    }
            
        except Exception as e:
            logger.error("Failed to apply assignment restrictions",
                        assignment_id=assignment.assignment_id,
                        error=str(e))
    
    async def _sync_assignment_to_systems(self, assignment: RoleAssignment):
        """Sync assignment to underlying role management systems"""
        try:
            # Sync to hierarchy manager
            if assignment.assignment_type in [RoleAssignmentType.PERMANENT, RoleAssignmentType.TEMPORARY]:
                await self.hierarchy_manager.assign_user_to_role(
                    assignment.organization_id,
                    assignment.role_id,
                    assignment.user_id,
                    {
                        "assignment_id": assignment.assignment_id,
                        "assignment_type": assignment.assignment_type.value,
                        "start_date": assignment.start_date.isoformat(),
                        "end_date": assignment.end_date.isoformat() if assignment.end_date else None
                    }
                )
            
            # Sync expert assignments
            if assignment.assignment_type == RoleAssignmentType.EXPERT and assignment.expert_engagement_id:
                # Update expert status in expert manager
                network = expert_manager.networks.get(assignment.organization_id)
                if network and assignment.expert_engagement_id in network.engagements:
                    engagement = network.engagements[assignment.expert_engagement_id]
                    engagement.metadata["role_assignment_id"] = assignment.assignment_id
            
            # Sync delegation assignments
            if assignment.assignment_type == RoleAssignmentType.DELEGATED and assignment.delegation_id:
                delegation = delegation_manager.delegations.get(assignment.delegation_id)
                if delegation:
                    delegation.metadata["role_assignment_id"] = assignment.assignment_id
            
        except Exception as e:
            logger.error("Failed to sync assignment to systems",
                        assignment_id=assignment.assignment_id,
                        error=str(e))
    
    async def _check_assignment_conflicts(
        self,
        assignment: RoleAssignment
    ) -> List[str]:
        """Check for conflicting role assignments"""
        conflicts = []
        
        try:
            # Check for overlapping assignments
            user_assignments = [
                a for a in self.role_assignments.values()
                if a.user_id == assignment.user_id and a.status == AssignmentStatus.ACTIVE
            ]
            
            for existing in user_assignments:
                # Check time overlap
                if assignment.end_date and existing.end_date:
                    if (assignment.start_date <= existing.end_date and
                        assignment.end_date >= existing.start_date):
                        conflicts.append(
                            f"Time overlap with assignment {existing.assignment_id}"
                        )
                
                # Check role hierarchy conflicts
                hierarchy = self.hierarchy_manager.hierarchies.get(assignment.organization_id)
                if hierarchy:
                    role_node = hierarchy.roles.get(assignment.role_id)
                    existing_role_node = hierarchy.roles.get(existing.role_id)
                    
                    if (role_node and existing_role_node and
                        role_node.hierarchy_level == existing_role_node.hierarchy_level and
                        role_node.scope == existing_role_node.scope):
                        conflicts.append(
                            f"Hierarchy conflict with assignment {existing.assignment_id}"
                        )
            
        except Exception as e:
            logger.error("Failed to check assignment conflicts",
                        assignment_id=getattr(assignment, 'assignment_id', 'unknown'),
                        error=str(e))
        
        return conflicts
    
    async def _validate_tenant_permissions(
        self,
        assignment: RoleAssignment
    ) -> List[str]:
        """Validate tenant-specific permissions"""
        issues = []
        
        try:
            tenant = tenant_manager.tenants.get(assignment.tenant_id)
            if not tenant:
                issues.append("Tenant not found")
                return issues
            
            # Check cross-tenant restrictions
            if not tenant.cross_tenant_sharing_allowed:
                # Check if role requires cross-tenant access
                for permission in assignment.effective_permissions:
                    if "cross_tenant" in permission.lower():
                        issues.append("Cross-tenant access not allowed for this tenant")
            
            # Check external access restrictions
            if not tenant.external_access_allowed:
                if assignment.assignment_type in [RoleAssignmentType.EXPERT, RoleAssignmentType.CONSULTANT]:
                    issues.append("External access not allowed for this tenant")
            
            # Check compliance framework requirements
            for framework in tenant.compliance_frameworks:
                if framework.value == "gdpr":
                    # Check GDPR-specific requirements
                    if "personal_data" in assignment.effective_permissions:
                        if assignment.geographic_restrictions:
                            eu_regions = ["europe", "eu"]
                            if not any(region in assignment.geographic_restrictions for region in eu_regions):
                                issues.append("GDPR requires EU data residency for personal data access")
                
                elif framework.value == "hipaa":
                    # Check HIPAA-specific requirements
                    if "health_data" in assignment.effective_permissions:
                        if assignment.assignment_type == RoleAssignmentType.EXPERT:
                            if assignment.data_access_level != "restricted":
                                issues.append("HIPAA requires restricted access for external experts")
            
        except Exception as e:
            logger.error("Failed to validate tenant permissions",
                        assignment_id=getattr(assignment, 'assignment_id', 'unknown'),
                        error=str(e))
            issues.append(f"Tenant validation error: {str(e)}")
        
        return issues
    
    async def _validate_compliance_requirements(
        self,
        assignment: RoleAssignment
    ) -> List[str]:
        """Validate compliance requirements"""
        issues = []
        
        try:
            # Check template compliance requirements
            if assignment.template_id:
                template = await self.template_manager.get_template_by_id(assignment.template_id)
                if template:
                    # Check if user meets certification requirements
                    for cert in template.certification_requirements:
                        # This would typically check against user profile
                        # For now, just add to compliance requirements
                        assignment.compliance_requirements.append(cert)
                    
                    # Check background check requirements
                    if template.background_check_level:
                        if assignment.metadata.get("background_check_level") != template.background_check_level:
                            issues.append(
                                f"Background check level {template.background_check_level} required"
                            )
                    
                    # Check security clearance requirements
                    if template.security_clearance_required:
                        if assignment.metadata.get("security_clearance") != template.security_clearance_required:
                            issues.append(
                                f"Security clearance {template.security_clearance_required} required"
                            )
            
        except Exception as e:
            logger.error("Failed to validate compliance requirements",
                        assignment_id=getattr(assignment, 'assignment_id', 'unknown'),
                        error=str(e))
            issues.append(f"Compliance validation error: {str(e)}")
        
        return issues
    
    async def _assess_assignment_risk(
        self,
        assignment: RoleAssignment
    ) -> Dict[str, Any]:
        """Assess risk level of role assignment"""
        risk_assessment = {
            "risk_level": "low",
            "risk_score": 0,
            "risk_factors": []
        }
        
        try:
            risk_score = 0
            risk_factors = []
            
            # Assignment type risk
            if assignment.assignment_type == RoleAssignmentType.EXPERT:
                risk_score += 2
                risk_factors.append("External expert access")
            elif assignment.assignment_type == RoleAssignmentType.CONSULTANT:
                risk_score += 3
                risk_factors.append("External consultant access")
            elif assignment.assignment_type == RoleAssignmentType.DELEGATED:
                risk_score += 1
                risk_factors.append("Delegated role assignment")
            
            # Permission risk
            high_risk_permissions = ["admin", "delete", "financial", "executive", "sensitive"]
            risky_permissions = [
                p for p in assignment.effective_permissions
                if any(risk_term in p.lower() for risk_term in high_risk_permissions)
            ]
            
            risk_score += len(risky_permissions)
            if risky_permissions:
                risk_factors.append(f"High-risk permissions: {', '.join(risky_permissions[:3])}")
            
            # Duration risk
            if assignment.end_date:
                duration = assignment.end_date - assignment.start_date
                if duration.days > 30:
                    risk_score += 1
                    risk_factors.append("Long-term assignment")
            else:
                risk_score += 2
                risk_factors.append("Permanent assignment")
            
            # Geographic risk
            if assignment.geographic_restrictions:
                if len(assignment.geographic_restrictions) > 3:
                    risk_score += 1
                    risk_factors.append("Multiple geographic regions")
            
            # Determine risk level
            if risk_score >= 6:
                risk_level = "critical"
            elif risk_score >= 4:
                risk_level = "high"
            elif risk_score >= 2:
                risk_level = "medium"
            else:
                risk_level = "low"
            
            risk_assessment.update({
                "risk_level": risk_level,
                "risk_score": risk_score,
                "risk_factors": risk_factors
            })
            
        except Exception as e:
            logger.error("Failed to assess assignment risk",
                        assignment_id=getattr(assignment, 'assignment_id', 'unknown'),
                        error=str(e))
        
        return risk_assessment
    
    async def _generate_assignment_recommendations(
        self,
        assignment: RoleAssignment,
        validation: RoleValidation
    ) -> List[str]:
        """Generate recommendations for role assignment"""
        recommendations = []
        
        try:
            # Risk-based recommendations
            risk_level = validation.risk_assessment.get("risk_level", "low")
            
            if risk_level in ["high", "critical"]:
                recommendations.append("Consider additional approval requirements")
                recommendations.append("Implement enhanced monitoring")
                recommendations.append("Set up automated access reviews")
            
            if risk_level == "critical":
                recommendations.append("Require emergency contact information")
                recommendations.append("Enable real-time activity monitoring")
            
            # Assignment type recommendations
            if assignment.assignment_type == RoleAssignmentType.EXPERT:
                recommendations.append("Ensure NDA is signed")
                recommendations.append("Provide security training")
                recommendations.append("Set up regular engagement reviews")
            
            elif assignment.assignment_type == RoleAssignmentType.CONSULTANT:
                recommendations.append("Verify background check completion")
                recommendations.append("Establish project-specific access controls")
                recommendations.append("Define clear deliverable expectations")
            
            # Compliance recommendations
            if validation.compliance_issues:
                recommendations.append("Address compliance issues before activation")
                recommendations.append("Schedule compliance training")
            
            # Duration recommendations
            if not assignment.end_date:
                recommendations.append("Consider setting an end date for review")
                recommendations.append("Schedule periodic access reviews")
            
        except Exception as e:
            logger.error("Failed to generate assignment recommendations",
                        assignment_id=getattr(assignment, 'assignment_id', 'unknown'),
                        error=str(e))
        
        return recommendations
    
    async def get_user_effective_permissions(
        self,
        user_id: str,
        organization_id: str
    ) -> Dict[str, Any]:
        """Get all effective permissions for a user across all assignments"""
        try:
            user_assignments = [
                assignment for assignment in self.role_assignments.values()
                if (assignment.user_id == user_id and 
                    assignment.organization_id == organization_id and
                    assignment.status == AssignmentStatus.ACTIVE)
            ]
            
            all_permissions = set()
            all_components = set()
            restrictions = {
                "geographic": set(),
                "time": {},
                "data_access": "standard"
            }
            
            for assignment in user_assignments:
                all_permissions.update(assignment.effective_permissions)
                all_components.update(assignment.effective_components)
                
                # Collect restrictions (most restrictive wins)
                restrictions["geographic"].update(assignment.geographic_restrictions)
                
                if assignment.time_restrictions:
                    restrictions["time"].update(assignment.time_restrictions)
                
                if assignment.data_access_level == "restricted":
                    restrictions["data_access"] = "restricted"
                elif assignment.data_access_level == "limited" and restrictions["data_access"] != "restricted":
                    restrictions["data_access"] = "limited"
            
            return {
                "user_id": user_id,
                "organization_id": organization_id,
                "effective_permissions": list(all_permissions),
                "effective_components": list(all_components),
                "restrictions": {
                    "geographic": list(restrictions["geographic"]),
                    "time": restrictions["time"],
                    "data_access_level": restrictions["data_access"]
                },
                "active_assignments": len(user_assignments),
                "assignment_ids": [a.assignment_id for a in user_assignments]
            }
            
        except Exception as e:
            logger.error("Failed to get user effective permissions",
                        user_id=user_id,
                        organization_id=organization_id,
                        error=str(e))
            return {}
    
    async def revoke_role_assignment(
        self,
        assignment_id: str,
        revoker_id: str,
        reason: str
    ) -> bool:
        """Revoke role assignment"""
        try:
            assignment = self.role_assignments.get(assignment_id)
            if not assignment:
                return False
            
            assignment.status = AssignmentStatus.REVOKED
            assignment.updated_at = datetime.utcnow()
            
            # Add to audit trail
            assignment.audit_trail.append({
                "action": "revoked",
                "user_id": revoker_id,
                "reason": reason,
                "timestamp": datetime.utcnow()
            })
            
            # Sync to underlying systems
            await self._sync_revocation_to_systems(assignment)
            
            logger.info("Role assignment revoked",
                       assignment_id=assignment_id,
                       revoker=revoker_id,
                       reason=reason)
            
            return True
            
        except Exception as e:
            logger.error("Failed to revoke role assignment",
                        assignment_id=assignment_id,
                        error=str(e))
            return False
    
    async def _sync_revocation_to_systems(self, assignment: RoleAssignment):
        """Sync revocation to underlying systems"""
        try:
            # Remove from hierarchy manager
            hierarchy = self.hierarchy_manager.hierarchies.get(assignment.organization_id)
            if hierarchy:
                role_node = hierarchy.roles.get(assignment.role_id)
                if role_node and assignment.user_id in role_node.user_ids:
                    role_node.user_ids.remove(assignment.user_id)
            
            # Handle delegation revocation
            if assignment.delegation_id:
                await delegation_manager.revoke_delegation(
                    assignment.delegation_id,
                    "system",
                    "Role assignment revoked"
                )
            
        except Exception as e:
            logger.error("Failed to sync revocation to systems",
                        assignment_id=assignment.assignment_id,
                        error=str(e))

# Global advanced role manager instance
advanced_role_manager = AdvancedRoleManager()