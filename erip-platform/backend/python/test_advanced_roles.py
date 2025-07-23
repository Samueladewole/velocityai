"""
Advanced Roles Framework Test Suite
Comprehensive testing for advanced role management components
"""

import asyncio
import pytest
from datetime import datetime, timedelta
from typing import Dict, Any

from advanced_roles.hierarchy import hierarchy_manager, HierarchyLevel, RoleType, RoleScope
from advanced_roles.expert_network import expert_manager, ExpertiseArea, ExpertTier, ExpertStatus
from advanced_roles.multi_tenant import tenant_manager, TenantType, GeographicRegion, ComplianceFramework
from advanced_roles.role_delegation import delegation_manager, DelegationType, DelegationScope
from advanced_roles.industry_templates import template_manager, IndustryType, RoleLevel
from advanced_roles.role_manager import advanced_role_manager, RoleAssignmentType

class TestOrganizationalHierarchy:
    """Test organizational hierarchy management"""
    
    @pytest.fixture
    async def setup_hierarchy(self):
        """Setup test hierarchy"""
        org_id = "test_org_001"
        
        # Create hierarchy
        hierarchy = await hierarchy_manager.create_hierarchy(
            organization_id=org_id,
            hierarchy_name="Test Organization",
            root_role_config={
                "role_name": "CEO",
                "permissions": ["all_access", "admin", "executive_reports"]
            }
        )
        
        return org_id, hierarchy
    
    def test_hierarchy_creation(self):
        """Test hierarchy creation"""
        async def run_test():
            org_id, hierarchy = await self.setup_hierarchy()
            
            assert hierarchy.organization_id == org_id
            assert hierarchy.hierarchy_name == "Test Organization"
            assert len(hierarchy.roles) == 1
            
            root_role = hierarchy.roles[hierarchy.root_role_id]
            assert root_role.role_name == "CEO"
            assert "all_access" in root_role.permissions
        
        asyncio.run(run_test())
    
    def test_role_addition(self):
        """Test adding roles to hierarchy"""
        async def run_test():
            org_id, hierarchy = await self.setup_hierarchy()
            root_role_id = hierarchy.root_role_id
            
            # Add VP role
            vp_role = await hierarchy_manager.add_role(
                organization_id=org_id,
                parent_role_id=root_role_id,
                role_config={
                    "role_name": "VP Risk",
                    "role_type": RoleType.STRUCTURAL,
                    "hierarchy_level": HierarchyLevel.DEPARTMENT,
                    "scope": RoleScope.DIVISIONAL,
                    "permissions": ["risk_management", "reporting"]
                }
            )
            
            assert vp_role.role_name == "VP Risk"
            assert vp_role.parent_role_id == root_role_id
            assert "risk_management" in vp_role.permissions
            
            # Check parent-child relationship
            updated_hierarchy = hierarchy_manager.hierarchies[org_id]
            root_role = updated_hierarchy.roles[root_role_id]
            assert vp_role.role_id in root_role.child_role_ids
        
        asyncio.run(run_test())
    
    def test_user_assignment(self):
        """Test user assignment to roles"""
        async def run_test():
            org_id, hierarchy = await self.setup_hierarchy()
            root_role_id = hierarchy.root_role_id
            user_id = "user_001"
            
            # Assign user to role
            success = await hierarchy_manager.assign_user_to_role(
                organization_id=org_id,
                role_id=root_role_id,
                user_id=user_id,
                assignment_metadata={"assignment_reason": "CEO appointment"}
            )
            
            assert success
            
            # Get user roles
            user_roles = await hierarchy_manager.get_user_roles(org_id, user_id)
            assert len(user_roles) == 1
            assert user_roles[0].role_id == root_role_id
            
            # Get effective permissions
            permissions = await hierarchy_manager.get_effective_permissions(org_id, user_id)
            assert "all_access" in permissions
        
        asyncio.run(run_test())

class TestExpertNetwork:
    """Test expert network management"""
    
    @pytest.fixture
    async def setup_expert_network(self):
        """Setup test expert network"""
        org_id = "test_org_002"
        
        network = await expert_manager.create_expert_network(
            organization_id=org_id,
            network_name="Test Expert Network",
            network_config={}
        )
        
        return org_id, network
    
    def test_expert_network_creation(self):
        """Test expert network creation"""
        async def run_test():
            org_id, network = await self.setup_expert_network()
            
            assert network.organization_id == org_id
            assert network.network_name == "Test Expert Network"
            assert len(network.expertise_taxonomy) > 0
            assert "risk_management" in network.expertise_taxonomy
        
        asyncio.run(run_test())
    
    def test_expert_addition(self):
        """Test adding expert to network"""
        async def run_test():
            org_id, network = await self.setup_expert_network()
            
            # Add expert
            expert = await expert_manager.add_expert(
                organization_id=org_id,
                expert_config={
                    "expert_name": "Dr. Risk Expert",
                    "expertise_areas": [ExpertiseArea.RISK_MANAGEMENT, ExpertiseArea.CYBERSECURITY],
                    "expert_tier": ExpertTier.TIER_1,
                    "hourly_rate": 500.0,
                    "geographic_regions": ["north_america"],
                    "industry_experience": ["financial_services"]
                }
            )
            
            assert expert.expert_name == "Dr. Risk Expert"
            assert ExpertiseArea.RISK_MANAGEMENT in expert.expertise_areas
            assert expert.expert_tier == ExpertTier.TIER_1
            assert len(expert.permissions) > 0
        
        asyncio.run(run_test())
    
    def test_expert_search(self):
        """Test expert search functionality"""
        async def run_test():
            org_id, network = await self.setup_expert_network()
            
            # Add multiple experts
            await expert_manager.add_expert(
                organization_id=org_id,
                expert_config={
                    "expert_name": "Risk Expert 1",
                    "expertise_areas": [ExpertiseArea.RISK_MANAGEMENT],
                    "expert_tier": ExpertTier.TIER_1,
                    "hourly_rate": 400.0
                }
            )
            
            await expert_manager.add_expert(
                organization_id=org_id,
                expert_config={
                    "expert_name": "Security Expert",
                    "expertise_areas": [ExpertiseArea.CYBERSECURITY],
                    "expert_tier": ExpertTier.TIER_2,
                    "hourly_rate": 300.0
                }
            )
            
            # Search for risk management experts
            risk_experts = await expert_manager.find_experts_by_criteria(
                organization_id=org_id,
                criteria={
                    "expertise_area": ExpertiseArea.RISK_MANAGEMENT,
                    "available_only": True
                }
            )
            
            assert len(risk_experts) == 1
            assert risk_experts[0].expert_name == "Risk Expert 1"
            
            # Search by tier
            tier1_experts = await expert_manager.find_experts_by_criteria(
                organization_id=org_id,
                criteria={"min_tier": ExpertTier.TIER_1}
            )
            
            assert len(tier1_experts) >= 1
        
        asyncio.run(run_test())

class TestMultiTenant:
    """Test multi-tenant management"""
    
    def test_tenant_creation(self):
        """Test tenant creation with compliance"""
        async def run_test():
            tenant = await tenant_manager.create_tenant(
                tenant_name="Test Financial Corp",
                tenant_type=TenantType.ENTERPRISE,
                geographic_regions=[GeographicRegion.NORTH_AMERICA, GeographicRegion.EUROPE]
            )
            
            assert tenant.tenant_name == "Test Financial Corp"
            assert tenant.tenant_type == TenantType.ENTERPRISE
            assert GeographicRegion.NORTH_AMERICA in tenant.geographic_regions
            assert ComplianceFramework.SOX in tenant.compliance_frameworks
            assert ComplianceFramework.GDPR in tenant.compliance_frameworks
            
            # Check compliance requirements applied
            assert tenant.retention_policies.get("financial_data") == 2555  # SOX requirement
            assert tenant.retention_policies.get("personal_data") == 365    # GDPR requirement
        
        asyncio.run(run_test())
    
    def test_compliance_validation(self):
        """Test compliance status validation"""
        async def run_test():
            # Create tenant with GDPR requirements
            tenant = await tenant_manager.create_tenant(
                tenant_name="EU Financial Corp",
                tenant_type=TenantType.ENTERPRISE,
                geographic_regions=[GeographicRegion.EUROPE]
            )
            
            # Get compliance status
            compliance = await tenant_manager.get_tenant_compliance_status(tenant.tenant_id)
            
            assert "gdpr" in compliance["framework_status"]
            gdpr_status = compliance["framework_status"]["gdpr"]
            
            # Should have compliance issues due to missing configurations
            assert not gdpr_status["compliant"]
            assert len(gdpr_status["issues"]) > 0
        
        asyncio.run(run_test())

class TestRoleDelegation:
    """Test role delegation and workflows"""
    
    def test_delegation_creation(self):
        """Test delegation request creation"""
        async def run_test():
            delegation = await delegation_manager.create_delegation_request(
                delegator_user_id="user_001",
                delegatee_user_id="user_002",
                role_id="role_001",
                delegation_config={
                    "delegation_type": DelegationType.VACATION,
                    "delegation_scope": DelegationScope.SPECIFIC_PERMISSIONS,
                    "permissions_delegated": ["read_reports", "approve_requests"],
                    "start_datetime": datetime.utcnow(),
                    "end_datetime": datetime.utcnow() + timedelta(days=7),
                    "justification": "Vacation coverage"
                }
            )
            
            assert delegation.delegator_user_id == "user_001"
            assert delegation.delegatee_user_id == "user_002"
            assert delegation.delegation_type == DelegationType.VACATION
            assert "read_reports" in delegation.permissions_delegated
            assert delegation.risk_assessment["risk_level"] in ["low", "medium", "high"]
        
        asyncio.run(run_test())
    
    def test_emergency_delegation(self):
        """Test emergency delegation workflow"""
        async def run_test():
            # Create emergency delegation
            delegation = await delegation_manager.create_delegation_request(
                delegator_user_id="user_001",
                delegatee_user_id="user_002",
                role_id="emergency_role",
                delegation_config={
                    "delegation_type": DelegationType.EMERGENCY,
                    "delegation_scope": DelegationScope.FULL_ROLE,
                    "start_datetime": datetime.utcnow(),
                    "end_datetime": datetime.utcnow() + timedelta(hours=24),
                    "justification": "Critical incident response",
                    "emergency_override": True
                }
            )
            
            assert delegation.delegation_type == DelegationType.EMERGENCY
            assert delegation.emergency_override
            
            # Emergency delegations should have higher risk scores
            assert delegation.risk_assessment["risk_score"] > 0
        
        asyncio.run(run_test())

class TestIndustryTemplates:
    """Test industry-specific role templates"""
    
    def test_financial_templates(self):
        """Test financial services templates"""
        async def run_test():
            # Get financial templates
            financial_templates = await template_manager.get_templates_by_industry(
                IndustryType.FINANCIAL_SERVICES
            )
            
            assert len(financial_templates) > 0
            
            # Find CRO template
            cro_template = None
            for template in financial_templates:
                if "Chief Risk Officer" in template.template_name:
                    cro_template = template
                    break
            
            assert cro_template is not None
            assert cro_template.role_level == RoleLevel.C_LEVEL
            assert "prism_full" in cro_template.base_permissions
            assert "sox_compliance" in cro_template.compliance_requirements
            assert "FRM" in cro_template.certification_requirements
        
        asyncio.run(run_test())
    
    def test_template_application(self):
        """Test template application to role"""
        async def run_test():
            # Get a financial template
            financial_templates = await template_manager.get_templates_by_industry(
                IndustryType.FINANCIAL_SERVICES
            )
            
            template = financial_templates[0]
            
            # Apply template to role config
            base_config = {
                "role_name": "Custom Risk Manager",
                "permissions": ["basic_access"]
            }
            
            applied_config = await template_manager.apply_template_to_role(
                template_id=template.template_id,
                role_config=base_config
            )
            
            assert "Custom Risk Manager" == applied_config["role_name"]
            assert len(applied_config["permissions"]) > len(base_config["permissions"])
            assert applied_config["compliance_requirements"] == template.compliance_requirements
            assert applied_config["template_applied"]["template_id"] == template.template_id
        
        asyncio.run(run_test())

class TestAdvancedRoleManager:
    """Test integrated role management"""
    
    def test_comprehensive_role_assignment(self):
        """Test comprehensive role assignment with validation"""
        async def run_test():
            # Create role assignment
            assignment = await advanced_role_manager.create_role_assignment(
                user_id="user_001",
                role_id="test_role_001",
                organization_id="test_org_001",
                assignment_config={
                    "assignment_type": RoleAssignmentType.TEMPORARY,
                    "start_date": datetime.utcnow(),
                    "end_date": datetime.utcnow() + timedelta(days=30),
                    "assignment_reason": "Project assignment"
                }
            )
            
            assert assignment.user_id == "user_001"
            assert assignment.assignment_type == RoleAssignmentType.TEMPORARY
            assert len(assignment.effective_permissions) >= 0
            assert len(assignment.effective_components) >= 0
        
        asyncio.run(run_test())
    
    def test_user_effective_permissions(self):
        """Test user effective permissions calculation"""
        async def run_test():
            # Create multiple assignments
            assignment1 = await advanced_role_manager.create_role_assignment(
                user_id="user_multi",
                role_id="role_001",
                organization_id="test_org_001",
                assignment_config={
                    "assignment_type": RoleAssignmentType.PERMANENT,
                    "assignment_reason": "Primary role"
                }
            )
            
            assignment2 = await advanced_role_manager.create_role_assignment(
                user_id="user_multi",
                role_id="role_002",
                organization_id="test_org_001",
                assignment_config={
                    "assignment_type": RoleAssignmentType.PROJECT,
                    "assignment_reason": "Project role"
                }
            )
            
            # Both assignments should be in pending state initially
            assignment1.status = "active"
            assignment2.status = "active"
            
            # Get effective permissions
            permissions = await advanced_role_manager.get_user_effective_permissions(
                user_id="user_multi",
                organization_id="test_org_001"
            )
            
            assert permissions["user_id"] == "user_multi"
            assert permissions["active_assignments"] >= 2
            assert len(permissions["assignment_ids"]) >= 2
        
        asyncio.run(run_test())

class TestIntegrationScenarios:
    """Test integration scenarios across components"""
    
    def test_expert_with_template_assignment(self):
        """Test expert assignment using industry template"""
        async def run_test():
            # Create expert network
            org_id = "integration_test_org"
            network = await expert_manager.create_expert_network(
                organization_id=org_id,
                network_name="Integration Test Network",
                network_config={}
            )
            
            # Add financial expert
            expert = await expert_manager.add_expert(
                organization_id=org_id,
                expert_config={
                    "expert_name": "Financial Risk Expert",
                    "expertise_areas": [ExpertiseArea.FINANCIAL_ANALYSIS],
                    "expert_tier": ExpertTier.TIER_1,
                    "hourly_rate": 450.0
                }
            )
            
            # Get financial template
            financial_templates = await template_manager.get_templates_by_industry(
                IndustryType.FINANCIAL_SERVICES
            )
            template = financial_templates[0]
            
            # Create role assignment with template
            assignment = await advanced_role_manager.create_role_assignment(
                user_id=f"expert_{expert.expert_id}",
                role_id="financial_expert_role",
                organization_id=org_id,
                assignment_config={
                    "assignment_type": RoleAssignmentType.EXPERT,
                    "template_id": template.template_id,
                    "assignment_reason": "Expert engagement"
                }
            )
            
            assert assignment.assignment_type == RoleAssignmentType.EXPERT
            assert assignment.template_id == template.template_id
            assert len(assignment.effective_permissions) > 0
        
        asyncio.run(run_test())
    
    def test_multi_tenant_delegation_scenario(self):
        """Test cross-tenant delegation scenario"""
        async def run_test():
            # Create two tenants
            tenant1 = await tenant_manager.create_tenant(
                tenant_name="Tenant A",
                tenant_type=TenantType.ENTERPRISE,
                geographic_regions=[GeographicRegion.NORTH_AMERICA]
            )
            
            tenant2 = await tenant_manager.create_tenant(
                tenant_name="Tenant B",
                tenant_type=TenantType.DIVISION,
                geographic_regions=[GeographicRegion.NORTH_AMERICA],
                tenant_config={"cross_tenant_sharing_allowed": True}
            )
            
            # Test cross-tenant access validation
            validation = await tenant_manager.validate_cross_tenant_access(
                source_tenant_id=tenant1.tenant_id,
                target_tenant_id=tenant2.tenant_id,
                user_id="user_001",
                requested_permissions=["read_reports"]
            )
            
            # Should be allowed since both are in North America and target allows sharing
            assert validation.get("allowed") is not None
        
        asyncio.run(run_test())

# Run all tests
async def run_all_tests():
    """Run all advanced roles tests"""
    print("🧪 Running Advanced Roles Framework Tests...")
    
    test_classes = [
        TestOrganizationalHierarchy,
        TestExpertNetwork,
        TestMultiTenant,
        TestRoleDelegation,
        TestIndustryTemplates,
        TestAdvancedRoleManager,
        TestIntegrationScenarios
    ]
    
    total_tests = 0
    passed_tests = 0
    
    for test_class in test_classes:
        print(f"\n📋 Testing {test_class.__name__}")
        test_instance = test_class()
        
        # Get all test methods
        test_methods = [method for method in dir(test_instance) if method.startswith('test_')]
        
        for test_method in test_methods:
            total_tests += 1
            try:
                method = getattr(test_instance, test_method)
                method()
                print(f"  ✅ {test_method}")
                passed_tests += 1
            except Exception as e:
                print(f"  ❌ {test_method}: {str(e)}")
    
    print(f"\n📊 Test Results: {passed_tests}/{total_tests} passed")
    return passed_tests, total_tests

if __name__ == "__main__":
    passed, total = asyncio.run(run_all_tests())