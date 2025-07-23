"""
Multi-Tenant and Geographic Compliance Framework
Enterprise-grade tenant isolation and regulatory compliance management
"""

from typing import Dict, List, Optional, Set, Any, Union
from datetime import datetime, timedelta
from enum import Enum
from pydantic import BaseModel, Field
import structlog
import uuid

logger = structlog.get_logger()

class TenantType(str, Enum):
    """Types of tenants in the system"""
    ENTERPRISE = "enterprise"        # Large enterprise with full isolation
    DIVISION = "division"           # Division within enterprise
    SUBSIDIARY = "subsidiary"       # Subsidiary company
    PARTNER = "partner"            # External partner with limited access
    GOVERNMENT = "government"      # Government entity
    MANAGED_SERVICE = "managed_service"  # Managed service provider

class GeographicRegion(str, Enum):
    """Geographic regions for compliance"""
    NORTH_AMERICA = "north_america"
    EUROPE = "europe"
    ASIA_PACIFIC = "asia_pacific"
    LATIN_AMERICA = "latin_america"
    MIDDLE_EAST = "middle_east"
    AFRICA = "africa"
    GLOBAL = "global"

class ComplianceFramework(str, Enum):
    """Compliance frameworks"""
    GDPR = "gdpr"                  # EU General Data Protection Regulation
    CCPA = "ccpa"                  # California Consumer Privacy Act
    HIPAA = "hipaa"                # Health Insurance Portability and Accountability Act
    SOX = "sox"                    # Sarbanes-Oxley Act
    PCI_DSS = "pci_dss"           # Payment Card Industry Data Security Standard
    ISO_27001 = "iso_27001"       # Information Security Management
    NIST = "nist"                 # NIST Cybersecurity Framework
    BASEL_III = "basel_iii"       # Basel III banking regulations
    MIFID_II = "mifid_ii"         # Markets in Financial Instruments Directive
    DODD_FRANK = "dodd_frank"     # Dodd-Frank financial reform
    FISMA = "fisma"               # Federal Information Security Modernization Act
    FERPA = "ferpa"               # Family Educational Rights and Privacy Act

class DataClassification(str, Enum):
    """Data classification levels"""
    PUBLIC = "public"
    INTERNAL = "internal"
    CONFIDENTIAL = "confidential"
    RESTRICTED = "restricted"
    TOP_SECRET = "top_secret"

class RegionalRole(BaseModel):
    """Regional role with geographic and compliance constraints"""
    regional_role_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role_name: str
    base_role_id: str
    geographic_regions: List[GeographicRegion]
    applicable_frameworks: List[ComplianceFramework]
    data_classification_access: List[DataClassification]
    cross_border_restrictions: List[str] = Field(default_factory=list)
    local_permissions: List[str] = Field(default_factory=list)
    restricted_permissions: List[str] = Field(default_factory=list)
    timezone_restrictions: List[str] = Field(default_factory=list)
    language_requirements: List[str] = Field(default_factory=list)
    local_reporting_requirements: Dict[str, Any] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class TenantConfiguration(BaseModel):
    """Multi-tenant configuration"""
    tenant_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tenant_name: str
    tenant_type: TenantType
    parent_tenant_id: Optional[str] = None
    child_tenant_ids: List[str] = Field(default_factory=list)
    geographic_regions: List[GeographicRegion]
    compliance_frameworks: List[ComplianceFramework]
    data_residency_requirements: Dict[str, str] = Field(default_factory=dict)
    encryption_requirements: Dict[str, str] = Field(default_factory=dict)
    retention_policies: Dict[str, int] = Field(default_factory=dict)  # days
    cross_tenant_sharing_allowed: bool = False
    external_access_allowed: bool = False
    audit_requirements: Dict[str, Any] = Field(default_factory=dict)
    backup_requirements: Dict[str, Any] = Field(default_factory=dict)
    disaster_recovery_requirements: Dict[str, Any] = Field(default_factory=dict)
    sla_requirements: Dict[str, Any] = Field(default_factory=dict)
    custom_branding: Dict[str, str] = Field(default_factory=dict)
    feature_flags: Dict[str, bool] = Field(default_factory=dict)
    resource_limits: Dict[str, int] = Field(default_factory=dict)
    billing_configuration: Dict[str, Any] = Field(default_factory=dict)
    contact_information: Dict[str, str] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class GeographicCompliance(BaseModel):
    """Geographic compliance rules and restrictions"""
    compliance_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    region: GeographicRegion
    frameworks: List[ComplianceFramework]
    data_localization_required: bool = False
    cross_border_transfer_allowed: bool = True
    allowed_transfer_regions: List[GeographicRegion] = Field(default_factory=list)
    encryption_requirements: Dict[str, str] = Field(default_factory=dict)
    access_time_restrictions: Dict[str, Any] = Field(default_factory=dict)
    mandatory_roles: List[str] = Field(default_factory=list)
    prohibited_roles: List[str] = Field(default_factory=list)
    audit_frequency_days: int = 30
    retention_period_days: Dict[str, int] = Field(default_factory=dict)
    right_to_deletion: bool = False
    consent_requirements: Dict[str, Any] = Field(default_factory=dict)
    breach_notification_hours: int = 72
    local_representative_required: bool = False
    certification_requirements: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TenantManager:
    """
    Multi-Tenant Management System
    Handles tenant isolation, geographic compliance, and regulatory requirements
    """
    
    def __init__(self):
        self.tenants: Dict[str, TenantConfiguration] = {}
        self.regional_roles: Dict[str, RegionalRole] = {}
        self.compliance_rules: Dict[str, GeographicCompliance] = {}
        self._initialize_compliance_frameworks()
    
    def _initialize_compliance_frameworks(self):
        """Initialize default compliance frameworks"""
        default_frameworks = {
            GeographicRegion.EUROPE: [
                ComplianceFramework.GDPR,
                ComplianceFramework.ISO_27001
            ],
            GeographicRegion.NORTH_AMERICA: [
                ComplianceFramework.CCPA,
                ComplianceFramework.HIPAA,
                ComplianceFramework.SOX,
                ComplianceFramework.NIST
            ],
            GeographicRegion.ASIA_PACIFIC: [
                ComplianceFramework.ISO_27001,
                ComplianceFramework.PCI_DSS
            ]
        }
        
        for region, frameworks in default_frameworks.items():
            compliance = GeographicCompliance(
                region=region,
                frameworks=frameworks
            )
            
            # Set region-specific requirements
            if region == GeographicRegion.EUROPE:
                compliance.data_localization_required = True
                compliance.right_to_deletion = True
                compliance.breach_notification_hours = 72
                compliance.consent_requirements = {
                    "explicit_consent_required": True,
                    "consent_withdrawal_allowed": True,
                    "purpose_limitation": True
                }
            elif region == GeographicRegion.NORTH_AMERICA:
                compliance.cross_border_transfer_allowed = True
                compliance.allowed_transfer_regions = [
                    GeographicRegion.NORTH_AMERICA,
                    GeographicRegion.EUROPE
                ]
            
            self.compliance_rules[region.value] = compliance
    
    async def create_tenant(
        self,
        tenant_name: str,
        tenant_type: TenantType,
        geographic_regions: List[GeographicRegion],
        parent_tenant_id: Optional[str] = None,
        tenant_config: Optional[Dict[str, Any]] = None
    ) -> TenantConfiguration:
        """Create new tenant with compliance configuration"""
        try:
            if tenant_config is None:
                tenant_config = {}
            
            # Determine applicable compliance frameworks
            applicable_frameworks = []
            for region in geographic_regions:
                region_compliance = self.compliance_rules.get(region.value)
                if region_compliance:
                    applicable_frameworks.extend(region_compliance.frameworks)
            
            # Remove duplicates
            applicable_frameworks = list(set(applicable_frameworks))
            
            tenant = TenantConfiguration(
                tenant_name=tenant_name,
                tenant_type=tenant_type,
                parent_tenant_id=parent_tenant_id,
                geographic_regions=geographic_regions,
                compliance_frameworks=applicable_frameworks,
                **tenant_config
            )
            
            # Set default configurations based on tenant type
            await self._configure_tenant_defaults(tenant)
            
            # Apply compliance requirements
            await self._apply_compliance_requirements(tenant)
            
            # Update parent-child relationships
            if parent_tenant_id and parent_tenant_id in self.tenants:
                parent = self.tenants[parent_tenant_id]
                parent.child_tenant_ids.append(tenant.tenant_id)
            
            self.tenants[tenant.tenant_id] = tenant
            
            logger.info("Tenant created",
                       tenant_id=tenant.tenant_id,
                       tenant_name=tenant_name,
                       tenant_type=tenant_type)
            
            return tenant
            
        except Exception as e:
            logger.error("Failed to create tenant",
                        tenant_name=tenant_name,
                        error=str(e))
            raise
    
    async def _configure_tenant_defaults(self, tenant: TenantConfiguration):
        """Configure default settings based on tenant type"""
        
        if tenant.tenant_type == TenantType.ENTERPRISE:
            tenant.feature_flags = {
                "advanced_analytics": True,
                "custom_branding": True,
                "api_access": True,
                "bulk_operations": True,
                "advanced_reporting": True
            }
            tenant.resource_limits = {
                "max_users": 10000,
                "max_storage_gb": 1000,
                "max_api_calls_per_hour": 10000
            }
        
        elif tenant.tenant_type == TenantType.DIVISION:
            tenant.feature_flags = {
                "advanced_analytics": True,
                "custom_branding": False,
                "api_access": True,
                "bulk_operations": True,
                "advanced_reporting": True
            }
            tenant.resource_limits = {
                "max_users": 1000,
                "max_storage_gb": 100,
                "max_api_calls_per_hour": 1000
            }
        
        elif tenant.tenant_type == TenantType.PARTNER:
            tenant.feature_flags = {
                "advanced_analytics": False,
                "custom_branding": False,
                "api_access": True,
                "bulk_operations": False,
                "advanced_reporting": False
            }
            tenant.resource_limits = {
                "max_users": 100,
                "max_storage_gb": 10,
                "max_api_calls_per_hour": 100
            }
            tenant.external_access_allowed = True
        
        elif tenant.tenant_type == TenantType.GOVERNMENT:
            tenant.feature_flags = {
                "advanced_analytics": True,
                "custom_branding": True,
                "api_access": True,
                "bulk_operations": True,
                "advanced_reporting": True
            }
            tenant.encryption_requirements = {
                "data_at_rest": "aes-256",
                "data_in_transit": "tls-1.3",
                "key_management": "fips-140-2-level-3"
            }
    
    async def _apply_compliance_requirements(self, tenant: TenantConfiguration):
        """Apply compliance requirements based on frameworks"""
        
        for framework in tenant.compliance_frameworks:
            if framework == ComplianceFramework.GDPR:
                tenant.retention_policies.update({
                    "personal_data": 365,
                    "sensitive_data": 30,
                    "audit_logs": 2555  # 7 years
                })
                tenant.encryption_requirements.update({
                    "personal_data": "aes-256",
                    "pseudonymization_required": "true"
                })
            
            elif framework == ComplianceFramework.HIPAA:
                tenant.retention_policies.update({
                    "health_data": 2190,  # 6 years
                    "audit_logs": 2190
                })
                tenant.encryption_requirements.update({
                    "health_data": "aes-256",
                    "access_logs": "required"
                })
            
            elif framework == ComplianceFramework.SOX:
                tenant.retention_policies.update({
                    "financial_data": 2555,  # 7 years
                    "audit_trails": 2555
                })
                tenant.audit_requirements.update({
                    "change_management": "required",
                    "access_reviews": "quarterly",
                    "financial_controls": "continuous"
                })
            
            elif framework == ComplianceFramework.PCI_DSS:
                tenant.encryption_requirements.update({
                    "payment_data": "aes-256",
                    "cardholder_data": "tokenization"
                })
                tenant.audit_requirements.update({
                    "vulnerability_scans": "quarterly",
                    "penetration_tests": "annual"
                })
    
    async def create_regional_role(
        self,
        base_role_id: str,
        role_name: str,
        geographic_regions: List[GeographicRegion],
        role_config: Optional[Dict[str, Any]] = None
    ) -> RegionalRole:
        """Create regional role with geographic constraints"""
        try:
            if role_config is None:
                role_config = {}
            
            # Determine applicable frameworks
            applicable_frameworks = []
            for region in geographic_regions:
                region_compliance = self.compliance_rules.get(region.value)
                if region_compliance:
                    applicable_frameworks.extend(region_compliance.frameworks)
            
            regional_role = RegionalRole(
                base_role_id=base_role_id,
                role_name=role_name,
                geographic_regions=geographic_regions,
                applicable_frameworks=list(set(applicable_frameworks)),
                **role_config
            )
            
            # Apply regional restrictions
            await self._apply_regional_restrictions(regional_role)
            
            self.regional_roles[regional_role.regional_role_id] = regional_role
            
            logger.info("Regional role created",
                       regional_role_id=regional_role.regional_role_id,
                       role_name=role_name,
                       regions=geographic_regions)
            
            return regional_role
            
        except Exception as e:
            logger.error("Failed to create regional role",
                        role_name=role_name,
                        error=str(e))
            raise
    
    async def _apply_regional_restrictions(self, regional_role: RegionalRole):
        """Apply regional restrictions based on compliance frameworks"""
        
        for region in regional_role.geographic_regions:
            region_compliance = self.compliance_rules.get(region.value)
            if not region_compliance:
                continue
            
            if region == GeographicRegion.EUROPE:
                # GDPR restrictions
                regional_role.restricted_permissions.extend([
                    "export_personal_data",
                    "automated_decision_making"
                ])
                regional_role.local_permissions.extend([
                    "data_subject_requests",
                    "consent_management"
                ])
                regional_role.cross_border_restrictions.extend([
                    "no_us_transfer_without_adequacy",
                    "schrems_ii_compliance"
                ])
            
            elif region == GeographicRegion.NORTH_AMERICA:
                # SOX/CCPA restrictions
                if ComplianceFramework.SOX in regional_role.applicable_frameworks:
                    regional_role.local_permissions.extend([
                        "financial_controls_review",
                        "audit_trail_access"
                    ])
                
                if ComplianceFramework.CCPA in regional_role.applicable_frameworks:
                    regional_role.local_permissions.extend([
                        "california_privacy_requests",
                        "consumer_data_deletion"
                    ])
    
    async def validate_cross_tenant_access(
        self,
        source_tenant_id: str,
        target_tenant_id: str,
        user_id: str,
        requested_permissions: List[str]
    ) -> Dict[str, Any]:
        """Validate if cross-tenant access is allowed"""
        try:
            source_tenant = self.tenants.get(source_tenant_id)
            target_tenant = self.tenants.get(target_tenant_id)
            
            if not source_tenant or not target_tenant:
                return {
                    "allowed": False,
                    "reason": "Tenant not found"
                }
            
            if not target_tenant.cross_tenant_sharing_allowed:
                return {
                    "allowed": False,
                    "reason": "Cross-tenant sharing not allowed"
                }
            
            # Check geographic restrictions
            source_regions = set(source_tenant.geographic_regions)
            target_regions = set(target_tenant.geographic_regions)
            
            for region in target_regions:
                region_compliance = self.compliance_rules.get(region.value)
                if region_compliance and not region_compliance.cross_border_transfer_allowed:
                    if not source_regions.intersection(target_regions):
                        return {
                            "allowed": False,
                            "reason": f"Cross-border transfer not allowed for {region.value}"
                        }
            
            # Check compliance framework compatibility
            source_frameworks = set(source_tenant.compliance_frameworks)
            target_frameworks = set(target_tenant.compliance_frameworks)
            
            incompatible_frameworks = []
            if ComplianceFramework.GDPR in target_frameworks:
                if GeographicRegion.NORTH_AMERICA in source_tenant.geographic_regions:
                    if not any(framework in source_frameworks for framework in [
                        ComplianceFramework.GDPR, ComplianceFramework.ISO_27001
                    ]):
                        incompatible_frameworks.append("GDPR adequacy required")
            
            if incompatible_frameworks:
                return {
                    "allowed": False,
                    "reason": f"Compliance incompatibility: {', '.join(incompatible_frameworks)}"
                }
            
            return {
                "allowed": True,
                "conditions": {
                    "audit_required": True,
                    "time_limit_hours": 24,
                    "permitted_permissions": requested_permissions
                }
            }
            
        except Exception as e:
            logger.error("Failed to validate cross-tenant access",
                        source_tenant_id=source_tenant_id,
                        target_tenant_id=target_tenant_id,
                        error=str(e))
            return {
                "allowed": False,
                "reason": f"Validation error: {str(e)}"
            }
    
    async def get_tenant_compliance_status(
        self,
        tenant_id: str
    ) -> Dict[str, Any]:
        """Get comprehensive compliance status for tenant"""
        try:
            tenant = self.tenants.get(tenant_id)
            if not tenant:
                return {}
            
            compliance_status = {
                "tenant_id": tenant_id,
                "tenant_name": tenant.tenant_name,
                "compliance_frameworks": tenant.compliance_frameworks,
                "geographic_regions": tenant.geographic_regions,
                "framework_status": {}
            }
            
            for framework in tenant.compliance_frameworks:
                status = {
                    "compliant": True,
                    "issues": [],
                    "recommendations": []
                }
                
                if framework == ComplianceFramework.GDPR:
                    # Check GDPR compliance
                    if not tenant.encryption_requirements.get("personal_data"):
                        status["compliant"] = False
                        status["issues"].append("Personal data encryption not configured")
                    
                    if not tenant.retention_policies.get("personal_data"):
                        status["compliant"] = False
                        status["issues"].append("Personal data retention policy not set")
                
                elif framework == ComplianceFramework.HIPAA:
                    # Check HIPAA compliance
                    if not tenant.encryption_requirements.get("health_data"):
                        status["compliant"] = False
                        status["issues"].append("Health data encryption not configured")
                    
                    if tenant.retention_policies.get("health_data", 0) < 2190:
                        status["compliant"] = False
                        status["issues"].append("Health data retention period insufficient")
                
                compliance_status["framework_status"][framework.value] = status
            
            return compliance_status
            
        except Exception as e:
            logger.error("Failed to get tenant compliance status",
                        tenant_id=tenant_id,
                        error=str(e))
            return {}

# Global tenant manager instance
tenant_manager = TenantManager()