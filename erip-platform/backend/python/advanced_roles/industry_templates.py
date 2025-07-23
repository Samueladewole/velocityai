"""
Industry-Specific Role Templates
Pre-configured role templates for different industry sectors
"""

from typing import Dict, List, Optional, Set, Any, Union
from datetime import datetime, timedelta
from enum import Enum
from pydantic import BaseModel, Field
import structlog
import uuid

logger = structlog.get_logger()

class IndustryType(str, Enum):
    """Industry sectors"""
    FINANCIAL_SERVICES = "financial_services"
    HEALTHCARE = "healthcare"
    MANUFACTURING = "manufacturing"
    TECHNOLOGY = "technology"
    RETAIL = "retail"
    ENERGY = "energy"
    GOVERNMENT = "government"
    EDUCATION = "education"
    TELECOMMUNICATIONS = "telecommunications"
    AEROSPACE = "aerospace"
    AUTOMOTIVE = "automotive"
    PHARMACEUTICALS = "pharmaceuticals"

class RoleLevel(str, Enum):
    """Role hierarchy levels within industries"""
    C_LEVEL = "c_level"           # C-suite executives
    VP_LEVEL = "vp_level"         # Vice Presidents
    DIRECTOR = "director"         # Directors
    MANAGER = "manager"           # Managers
    SENIOR = "senior"             # Senior professionals
    ANALYST = "analyst"           # Analysts/Associates
    SPECIALIST = "specialist"     # Technical specialists
    COORDINATOR = "coordinator"   # Coordinators/Support

class IndustryTemplate(BaseModel):
    """Industry-specific role template"""
    template_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    template_name: str
    industry_type: IndustryType
    role_level: RoleLevel
    description: str
    base_permissions: List[str] = Field(default_factory=list)
    component_access: List[str] = Field(default_factory=list)
    compliance_requirements: List[str] = Field(default_factory=list)
    certification_requirements: List[str] = Field(default_factory=list)
    reporting_requirements: List[str] = Field(default_factory=list)
    data_classification_access: List[str] = Field(default_factory=list)
    geographic_restrictions: List[str] = Field(default_factory=list)
    time_restrictions: Dict[str, Any] = Field(default_factory=dict)
    approval_authorities: List[str] = Field(default_factory=list)
    delegation_permissions: List[str] = Field(default_factory=list)
    mandatory_training: List[str] = Field(default_factory=list)
    background_check_level: Optional[str] = None
    security_clearance_required: Optional[str] = None
    industry_specific_attributes: Dict[str, Any] = Field(default_factory=dict)
    role_relationships: Dict[str, List[str]] = Field(default_factory=dict)
    kpis_and_metrics: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class FinancialRoles:
    """Financial Services industry role templates"""
    
    @staticmethod
    def get_templates() -> Dict[str, IndustryTemplate]:
        templates = {}
        
        # Chief Risk Officer
        templates["financial_cro"] = IndustryTemplate(
            template_name="Chief Risk Officer",
            industry_type=IndustryType.FINANCIAL_SERVICES,
            role_level=RoleLevel.C_LEVEL,
            description="Senior executive responsible for enterprise risk management",
            base_permissions=[
                "prism_full", "beacon_full", "clearance_full", "compass_full",
                "atlas_full", "nexus_read", "executive_reporting", "strategic_planning",
                "budget_approval", "policy_creation", "risk_appetite_setting"
            ],
            component_access=[
                "prism", "beacon", "clearance", "compass", "atlas", "nexus"
            ],
            compliance_requirements=[
                "sox_compliance", "basel_iii", "mifid_ii", "dodd_frank", "ccar",
                "stress_testing", "risk_governance", "capital_planning"
            ],
            certification_requirements=[
                "FRM", "PRM", "CFA", "MBA_preferred"
            ],
            reporting_requirements=[
                "board_risk_reports", "regulatory_submissions", "stress_test_results",
                "risk_appetite_monitoring", "capital_adequacy_reports"
            ],
            data_classification_access=[
                "public", "internal", "confidential", "restricted"
            ],
            approval_authorities=[
                "risk_limit_approval", "policy_approval", "methodology_approval",
                "major_risk_decisions", "capital_allocation"
            ],
            delegation_permissions=[
                "risk_committee_authority", "regulatory_interaction", "board_reporting"
            ],
            mandatory_training=[
                "advanced_risk_management", "regulatory_compliance", "leadership",
                "basel_framework", "stress_testing_methodologies"
            ],
            background_check_level="executive",
            security_clearance_required="secret",
            industry_specific_attributes={
                "regulatory_experience_years": 10,
                "risk_management_experience_years": 15,
                "financial_institution_experience": True,
                "board_interaction_experience": True,
                "regulatory_examination_experience": True
            },
            role_relationships={
                "reports_to": ["ceo", "board_risk_committee"],
                "manages": ["vp_risk", "director_credit_risk", "director_market_risk", "director_operational_risk"],
                "collaborates_with": ["cfo", "cco", "ciso", "head_audit"]
            },
            kpis_and_metrics=[
                "risk_adjusted_return", "var_utilization", "stress_test_performance",
                "regulatory_exam_ratings", "risk_appetite_adherence"
            ]
        )
        
        # VP Credit Risk
        templates["financial_vp_credit"] = IndustryTemplate(
            template_name="VP Credit Risk",
            industry_type=IndustryType.FINANCIAL_SERVICES,
            role_level=RoleLevel.VP_LEVEL,
            description="Senior manager for credit risk assessment and management",
            base_permissions=[
                "prism_full", "beacon_read", "clearance_read", "compass_read",
                "credit_modeling", "portfolio_analysis", "limit_management",
                "exception_approval"
            ],
            component_access=[
                "prism", "beacon", "compass"
            ],
            compliance_requirements=[
                "credit_risk_regulations", "fair_lending", "cra_compliance",
                "loan_loss_provisioning", "concentration_limits"
            ],
            certification_requirements=[
                "FRM", "CFA", "Credit_Risk_Certification"
            ],
            reporting_requirements=[
                "credit_risk_reports", "portfolio_performance", "concentration_analysis",
                "early_warning_indicators", "credit_loss_forecasting"
            ],
            data_classification_access=[
                "public", "internal", "confidential"
            ],
            approval_authorities=[
                "credit_limit_approval", "portfolio_strategy", "model_validation",
                "credit_policy_exceptions"
            ],
            mandatory_training=[
                "credit_risk_fundamentals", "basel_credit_risk", "ifrs9_impairment",
                "stress_testing", "model_risk_management"
            ],
            industry_specific_attributes={
                "credit_analysis_experience_years": 8,
                "portfolio_management_experience": True,
                "regulatory_capital_knowledge": True,
                "credit_modeling_expertise": True
            },
            role_relationships={
                "reports_to": ["cro"],
                "manages": ["director_credit_analysis", "senior_credit_analyst"],
                "collaborates_with": ["vp_market_risk", "head_lending", "model_validation"]
            }
        )
        
        # Compliance Officer
        templates["financial_compliance"] = IndustryTemplate(
            template_name="Compliance Officer",
            industry_type=IndustryType.FINANCIAL_SERVICES,
            role_level=RoleLevel.DIRECTOR,
            description="Ensures adherence to financial regulations and internal policies",
            base_permissions=[
                "compass_full", "atlas_read", "beacon_read", "compliance_monitoring",
                "policy_management", "training_coordination", "investigation_authority"
            ],
            component_access=[
                "compass", "atlas", "beacon"
            ],
            compliance_requirements=[
                "aml_bsa", "kyc_cdd", "ofac_sanctions", "fair_lending", "cra",
                "privacy_regulations", "consumer_protection", "market_conduct"
            ],
            certification_requirements=[
                "CAMS", "CRCM", "ACAMS", "Series_7", "Series_66"
            ],
            reporting_requirements=[
                "regulatory_reports", "compliance_monitoring_reports", "training_completion",
                "investigation_summaries", "policy_exception_reports"
            ],
            data_classification_access=[
                "public", "internal", "confidential"
            ],
            approval_authorities=[
                "compliance_investigations", "policy_exceptions", "training_programs",
                "vendor_compliance_assessments"
            ],
            mandatory_training=[
                "aml_bsa_fundamentals", "fair_lending_practices", "consumer_protection",
                "investigation_techniques", "regulatory_change_management"
            ],
            industry_specific_attributes={
                "regulatory_compliance_years": 5,
                "financial_services_experience": True,
                "investigation_experience": True,
                "regulatory_examination_participation": True
            }
        )
        
        return templates

class HealthcareRoles:
    """Healthcare industry role templates"""
    
    @staticmethod
    def get_templates() -> Dict[str, IndustryTemplate]:
        templates = {}
        
        # Chief Information Security Officer (Healthcare)
        templates["healthcare_ciso"] = IndustryTemplate(
            template_name="Healthcare CISO",
            industry_type=IndustryType.HEALTHCARE,
            role_level=RoleLevel.C_LEVEL,
            description="Senior executive responsible for healthcare information security",
            base_permissions=[
                "atlas_full", "cipher_full", "pulse_full", "nexus_full",
                "security_policy", "incident_response", "vulnerability_management",
                "compliance_oversight", "vendor_security_assessment"
            ],
            component_access=[
                "atlas", "cipher", "pulse", "nexus"
            ],
            compliance_requirements=[
                "hipaa_security", "hitech_act", "gdpr_health", "state_privacy_laws",
                "fda_cybersecurity", "joint_commission", "cms_security"
            ],
            certification_requirements=[
                "CISSP", "CISM", "CISA", "HCISPP", "Healthcare_Security_Certification"
            ],
            reporting_requirements=[
                "security_metrics", "incident_reports", "compliance_assessments",
                "vendor_security_reports", "board_security_briefings"
            ],
            data_classification_access=[
                "public", "internal", "confidential", "restricted", "phi_protected"
            ],
            approval_authorities=[
                "security_policies", "incident_response_actions", "security_investments",
                "vendor_security_approvals", "breach_notifications"
            ],
            mandatory_training=[
                "hipaa_security_rule", "healthcare_cybersecurity", "incident_response",
                "medical_device_security", "cloud_security_healthcare"
            ],
            background_check_level="healthcare_sensitive",
            industry_specific_attributes={
                "healthcare_security_years": 7,
                "medical_device_security_experience": True,
                "hipaa_compliance_expertise": True,
                "healthcare_incident_response": True,
                "ehr_security_knowledge": True
            },
            role_relationships={
                "reports_to": ["ceo", "cio"],
                "manages": ["security_architects", "security_analysts", "privacy_officers"],
                "collaborates_with": ["cmo", "cno", "compliance_officer", "legal_counsel"]
            },
            kpis_and_metrics=[
                "security_incident_reduction", "compliance_audit_scores", "mean_time_to_detection",
                "vulnerability_remediation_time", "security_awareness_completion"
            ]
        )
        
        # Privacy Officer
        templates["healthcare_privacy"] = IndustryTemplate(
            template_name="Healthcare Privacy Officer",
            industry_type=IndustryType.HEALTHCARE,
            role_level=RoleLevel.DIRECTOR,
            description="Manages patient privacy and HIPAA compliance programs",
            base_permissions=[
                "compass_full", "cipher_read", "privacy_management", "audit_trail_access",
                "policy_development", "training_management", "incident_investigation"
            ],
            component_access=[
                "compass", "cipher"
            ],
            compliance_requirements=[
                "hipaa_privacy_rule", "hitech_act", "state_privacy_laws",
                "patient_rights", "minimum_necessary", "business_associate_agreements"
            ],
            certification_requirements=[
                "CHPS", "HCCA", "Privacy_Certification", "AHIMA_Certification"
            ],
            reporting_requirements=[
                "privacy_incident_reports", "training_completion", "audit_results",
                "breach_notifications", "patient_complaint_summaries"
            ],
            data_classification_access=[
                "internal", "confidential", "phi_protected"
            ],
            approval_authorities=[
                "privacy_policies", "data_use_agreements", "research_data_access",
                "minimum_necessary_determinations"
            ],
            mandatory_training=[
                "hipaa_privacy_rule_comprehensive", "patient_rights", "breach_response",
                "data_governance", "healthcare_ethics"
            ],
            industry_specific_attributes={
                "hipaa_experience_years": 5,
                "healthcare_operations_knowledge": True,
                "legal_compliance_background": True,
                "patient_advocacy_experience": True
            }
        )
        
        return templates

class ManufacturingRoles:
    """Manufacturing industry role templates"""
    
    @staticmethod
    def get_templates() -> Dict[str, IndustryTemplate]:
        templates = {}
        
        # Plant Safety Manager
        templates["manufacturing_safety"] = IndustryTemplate(
            template_name="Plant Safety Manager",
            industry_type=IndustryType.MANUFACTURING,
            role_level=RoleLevel.MANAGER,
            description="Manages workplace safety and environmental compliance",
            base_permissions=[
                "atlas_full", "pulse_read", "safety_monitoring", "incident_management",
                "compliance_tracking", "audit_management", "training_coordination"
            ],
            component_access=[
                "atlas", "pulse"
            ],
            compliance_requirements=[
                "osha_standards", "epa_regulations", "iso_45001", "iso_14001",
                "hazmat_regulations", "process_safety_management", "environmental_compliance"
            ],
            certification_requirements=[
                "CSP", "CIH", "PE_Safety", "OHSAS_18001_Lead_Auditor"
            ],
            reporting_requirements=[
                "safety_metrics", "incident_reports", "compliance_audits",
                "training_records", "environmental_monitoring"
            ],
            data_classification_access=[
                "public", "internal", "confidential"
            ],
            approval_authorities=[
                "safety_procedures", "incident_investigations", "training_programs",
                "contractor_safety_requirements"
            ],
            mandatory_training=[
                "osha_compliance", "process_safety", "environmental_regulations",
                "incident_investigation", "safety_leadership"
            ],
            industry_specific_attributes={
                "manufacturing_safety_years": 5,
                "osha_compliance_expertise": True,
                "process_safety_knowledge": True,
                "environmental_regulations_knowledge": True
            },
            role_relationships={
                "reports_to": ["plant_manager"],
                "manages": ["safety_coordinators", "environmental_specialists"],
                "collaborates_with": ["operations_manager", "maintenance_manager", "hr_manager"]
            }
        )
        
        # Quality Assurance Manager
        templates["manufacturing_qa"] = IndustryTemplate(
            template_name="Quality Assurance Manager",
            industry_type=IndustryType.MANUFACTURING,
            role_level=RoleLevel.MANAGER,
            description="Oversees quality control and continuous improvement processes",
            base_permissions=[
                "prism_read", "beacon_read", "quality_monitoring", "process_analysis",
                "corrective_actions", "supplier_quality", "audit_coordination"
            ],
            component_access=[
                "prism", "beacon"
            ],
            compliance_requirements=[
                "iso_9001", "six_sigma", "lean_manufacturing", "statistical_process_control",
                "supplier_quality_management", "customer_quality_requirements"
            ],
            certification_requirements=[
                "ASQ_CQE", "Six_Sigma_Black_Belt", "ISO_9001_Lead_Auditor", "CQA"
            ],
            reporting_requirements=[
                "quality_metrics", "customer_satisfaction", "process_capability",
                "corrective_action_status", "supplier_performance"
            ],
            approval_authorities=[
                "quality_procedures", "corrective_actions", "supplier_approvals",
                "process_changes"
            ],
            mandatory_training=[
                "iso_9001_requirements", "statistical_process_control", "root_cause_analysis",
                "supplier_quality_management", "continuous_improvement"
            ],
            industry_specific_attributes={
                "quality_management_years": 5,
                "iso_9001_experience": True,
                "six_sigma_expertise": True,
                "supplier_quality_experience": True
            }
        )
        
        return templates

class TemplateManager:
    """
    Industry Template Management System
    Manages and applies industry-specific role templates
    """
    
    def __init__(self):
        self.templates: Dict[str, IndustryTemplate] = {}
        self._load_industry_templates()
    
    def _load_industry_templates(self):
        """Load all industry-specific templates"""
        
        # Load financial services templates
        financial_templates = FinancialRoles.get_templates()
        self.templates.update(financial_templates)
        
        # Load healthcare templates
        healthcare_templates = HealthcareRoles.get_templates()
        self.templates.update(healthcare_templates)
        
        # Load manufacturing templates
        manufacturing_templates = ManufacturingRoles.get_templates()
        self.templates.update(manufacturing_templates)
        
        logger.info("Industry templates loaded", 
                   total_templates=len(self.templates))
    
    async def get_templates_by_industry(
        self, 
        industry_type: IndustryType
    ) -> List[IndustryTemplate]:
        """Get all templates for specific industry"""
        try:
            industry_templates = [
                template for template in self.templates.values()
                if template.industry_type == industry_type and template.is_active
            ]
            
            # Sort by role level hierarchy
            level_order = [
                RoleLevel.C_LEVEL, RoleLevel.VP_LEVEL, RoleLevel.DIRECTOR,
                RoleLevel.MANAGER, RoleLevel.SENIOR, RoleLevel.ANALYST,
                RoleLevel.SPECIALIST, RoleLevel.COORDINATOR
            ]
            
            industry_templates.sort(
                key=lambda t: level_order.index(t.role_level) if t.role_level in level_order else 999
            )
            
            return industry_templates
            
        except Exception as e:
            logger.error("Failed to get templates by industry",
                        industry_type=industry_type,
                        error=str(e))
            return []
    
    async def get_template_by_id(self, template_id: str) -> Optional[IndustryTemplate]:
        """Get specific template by ID"""
        return self.templates.get(template_id)
    
    async def apply_template_to_role(
        self,
        template_id: str,
        role_config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Apply industry template to role configuration"""
        try:
            template = self.templates.get(template_id)
            if not template:
                raise ValueError(f"Template {template_id} not found")
            
            # Merge template with role config
            applied_config = role_config.copy()
            
            # Apply template permissions
            existing_permissions = set(applied_config.get("permissions", []))
            template_permissions = set(template.base_permissions)
            applied_config["permissions"] = list(existing_permissions | template_permissions)
            
            # Apply component access
            existing_components = set(applied_config.get("component_access", []))
            template_components = set(template.component_access)
            applied_config["component_access"] = list(existing_components | template_components)
            
            # Apply compliance requirements
            applied_config["compliance_requirements"] = template.compliance_requirements
            applied_config["certification_requirements"] = template.certification_requirements
            applied_config["mandatory_training"] = template.mandatory_training
            
            # Apply industry-specific attributes
            applied_config["industry_attributes"] = template.industry_specific_attributes
            applied_config["role_relationships"] = template.role_relationships
            
            # Apply access restrictions
            if template.data_classification_access:
                applied_config["data_classification_access"] = template.data_classification_access
            
            if template.time_restrictions:
                applied_config["time_restrictions"] = template.time_restrictions
            
            if template.geographic_restrictions:
                applied_config["geographic_restrictions"] = template.geographic_restrictions
            
            # Apply approval authorities
            if template.approval_authorities:
                applied_config["approval_authorities"] = template.approval_authorities
            
            # Apply background check requirements
            if template.background_check_level:
                applied_config["background_check_level"] = template.background_check_level
            
            if template.security_clearance_required:
                applied_config["security_clearance_required"] = template.security_clearance_required
            
            applied_config["template_applied"] = {
                "template_id": template_id,
                "template_name": template.template_name,
                "industry_type": template.industry_type.value,
                "applied_at": datetime.utcnow()
            }
            
            logger.info("Template applied to role",
                       template_id=template_id,
                       template_name=template.template_name)
            
            return applied_config
            
        except Exception as e:
            logger.error("Failed to apply template to role",
                        template_id=template_id,
                        error=str(e))
            raise
    
    async def find_templates(
        self,
        criteria: Dict[str, Any]
    ) -> List[IndustryTemplate]:
        """Find templates matching criteria"""
        try:
            matching_templates = []
            
            for template in self.templates.values():
                if not template.is_active:
                    continue
                
                match = True
                
                # Check industry type
                if "industry_type" in criteria:
                    if template.industry_type != criteria["industry_type"]:
                        match = False
                
                # Check role level
                if "role_level" in criteria:
                    if template.role_level != criteria["role_level"]:
                        match = False
                
                # Check required permissions
                if "requires_permissions" in criteria:
                    required_perms = set(criteria["requires_permissions"])
                    template_perms = set(template.base_permissions)
                    if not required_perms.issubset(template_perms):
                        match = False
                
                # Check compliance requirements
                if "compliance_framework" in criteria:
                    framework = criteria["compliance_framework"]
                    if framework not in template.compliance_requirements:
                        match = False
                
                # Check component access
                if "requires_component" in criteria:
                    component = criteria["requires_component"]
                    if component not in template.component_access:
                        match = False
                
                if match:
                    matching_templates.append(template)
            
            return matching_templates
            
        except Exception as e:
            logger.error("Failed to find templates",
                        criteria=criteria,
                        error=str(e))
            return []
    
    async def create_custom_template(
        self,
        template_config: Dict[str, Any]
    ) -> IndustryTemplate:
        """Create custom industry template"""
        try:
            template = IndustryTemplate(**template_config)
            
            self.templates[template.template_id] = template
            
            logger.info("Custom template created",
                       template_id=template.template_id,
                       template_name=template.template_name)
            
            return template
            
        except Exception as e:
            logger.error("Failed to create custom template",
                        error=str(e))
            raise
    
    async def get_industry_statistics(self) -> Dict[str, Any]:
        """Get statistics about industry templates"""
        try:
            stats = {
                "total_templates": len(self.templates),
                "by_industry": {},
                "by_role_level": {},
                "active_templates": 0
            }
            
            for template in self.templates.values():
                if template.is_active:
                    stats["active_templates"] += 1
                
                # Count by industry
                industry = template.industry_type.value
                if industry not in stats["by_industry"]:
                    stats["by_industry"][industry] = 0
                stats["by_industry"][industry] += 1
                
                # Count by role level
                level = template.role_level.value
                if level not in stats["by_role_level"]:
                    stats["by_role_level"][level] = 0
                stats["by_role_level"][level] += 1
            
            return stats
            
        except Exception as e:
            logger.error("Failed to get industry statistics",
                        error=str(e))
            return {}

# Global template manager instance
template_manager = TemplateManager()