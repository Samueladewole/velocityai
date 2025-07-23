"""
Expert Network Role Integration
External consultant and expert role management for specialized knowledge
"""

from typing import Dict, List, Optional, Set, Any, Union
from datetime import datetime, timedelta
from enum import Enum
from pydantic import BaseModel, Field
import structlog
import uuid

logger = structlog.get_logger()

class ExpertiseArea(str, Enum):
    """Areas of expertise for expert network"""
    RISK_MANAGEMENT = "risk_management"
    CYBERSECURITY = "cybersecurity"
    REGULATORY_COMPLIANCE = "regulatory_compliance"
    FINANCIAL_ANALYSIS = "financial_analysis"
    INDUSTRY_SPECIFIC = "industry_specific"
    TECHNOLOGY = "technology"
    GOVERNANCE = "governance"
    AUDIT = "audit"
    LEGAL = "legal"
    OPERATIONAL_RISK = "operational_risk"

class ExpertStatus(str, Enum):
    """Expert engagement status"""
    AVAILABLE = "available"
    ENGAGED = "engaged"
    ON_HOLD = "on_hold"
    INACTIVE = "inactive"
    BLACKLISTED = "blacklisted"

class ExpertTier(str, Enum):
    """Expert tier classification"""
    TIER_1 = "tier_1"      # Premium experts (former C-level, top consultants)
    TIER_2 = "tier_2"      # Senior experts (experienced professionals)
    TIER_3 = "tier_3"      # Standard experts (competent practitioners)
    SPECIALIST = "specialist" # Niche specialists

class EngagementType(str, Enum):
    """Types of expert engagements"""
    CONSULTATION = "consultation"     # One-time advice
    PROJECT = "project"              # Fixed-term project
    RETAINER = "retainer"           # Ongoing availability
    EMERGENCY = "emergency"         # Critical incident response
    AUDIT_SUPPORT = "audit_support" # Audit assistance
    TRAINING = "training"           # Knowledge transfer

class ExpertRole(BaseModel):
    """Expert role definition with specialized permissions"""
    expert_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    expert_name: str
    expertise_areas: List[ExpertiseArea]
    expert_tier: ExpertTier
    status: ExpertStatus = ExpertStatus.AVAILABLE
    hourly_rate: Optional[float] = None
    currency: str = "USD"
    max_hours_per_month: Optional[int] = None
    geographic_regions: List[str] = Field(default_factory=list)
    industry_experience: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)
    security_clearance: Optional[str] = None
    conflict_of_interest_companies: List[str] = Field(default_factory=list)
    availability_schedule: Dict[str, Any] = Field(default_factory=dict)
    contact_info: Dict[str, str] = Field(default_factory=dict)
    bio: Optional[str] = None
    linkedin_profile: Optional[str] = None
    permissions: List[str] = Field(default_factory=list)
    restricted_components: List[str] = Field(default_factory=list)
    data_access_level: str = "restricted"  # "full", "limited", "restricted"
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_engagement_date: Optional[datetime] = None

class ConsultantRole(BaseModel):
    """External consultant role with specific project access"""
    consultant_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    consultant_name: str
    company: str
    engagement_type: EngagementType
    project_ids: List[str] = Field(default_factory=list)
    start_date: datetime
    end_date: Optional[datetime] = None
    hourly_rate: float
    approved_budget: Optional[float] = None
    actual_spent: float = 0.0
    reporting_manager_id: str
    permissions: List[str] = Field(default_factory=list)
    component_access: List[str] = Field(default_factory=list)
    data_classification_access: List[str] = Field(default_factory=list)
    ip_restrictions: List[str] = Field(default_factory=list)
    nda_signed: bool = False
    background_check_completed: bool = False
    security_training_completed: bool = False
    access_request_id: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ExpertEngagement(BaseModel):
    """Expert engagement tracking"""
    engagement_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    expert_id: str
    organization_id: str
    engagement_type: EngagementType
    title: str
    description: str
    start_date: datetime
    end_date: Optional[datetime] = None
    estimated_hours: Optional[int] = None
    actual_hours: int = 0
    hourly_rate: float
    total_cost: float = 0.0
    status: str = "active"  # active, completed, cancelled, on_hold
    deliverables: List[str] = Field(default_factory=list)
    milestones: List[Dict[str, Any]] = Field(default_factory=list)
    assigned_components: List[str] = Field(default_factory=list)
    confidentiality_level: str = "high"
    created_by: str
    approved_by: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ExpertNetwork(BaseModel):
    """Expert network management structure"""
    network_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    organization_id: str
    network_name: str
    experts: Dict[str, ExpertRole] = Field(default_factory=dict)
    consultants: Dict[str, ConsultantRole] = Field(default_factory=dict)
    engagements: Dict[str, ExpertEngagement] = Field(default_factory=dict)
    expertise_taxonomy: Dict[str, List[str]] = Field(default_factory=dict)
    vetting_criteria: Dict[str, Any] = Field(default_factory=dict)
    engagement_policies: Dict[str, Any] = Field(default_factory=dict)
    budget_limits: Dict[str, float] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ExpertManager:
    """
    Expert Network Management System
    Handles external consultants, experts, and specialized role assignments
    """
    
    def __init__(self):
        self.networks: Dict[str, ExpertNetwork] = {}
        
    async def create_expert_network(
        self,
        organization_id: str,
        network_name: str,
        network_config: Dict[str, Any]
    ) -> ExpertNetwork:
        """Create new expert network for organization"""
        try:
            network = ExpertNetwork(
                organization_id=organization_id,
                network_name=network_name,
                **network_config
            )
            
            # Set default expertise taxonomy
            if not network.expertise_taxonomy:
                network.expertise_taxonomy = {
                    "risk_management": [
                        "enterprise_risk", "operational_risk", "credit_risk", 
                        "market_risk", "liquidity_risk", "model_risk"
                    ],
                    "cybersecurity": [
                        "threat_intelligence", "incident_response", "penetration_testing",
                        "security_architecture", "compliance_auditing"
                    ],
                    "regulatory_compliance": [
                        "sox_compliance", "gdpr_privacy", "pci_dss", "hipaa", 
                        "basel_iii", "mifid_ii", "dodd_frank"
                    ],
                    "financial_analysis": [
                        "financial_modeling", "valuation", "stress_testing",
                        "capital_planning", "budget_analysis"
                    ]
                }
            
            # Set default vetting criteria
            if not network.vetting_criteria:
                network.vetting_criteria = {
                    "min_years_experience": 5,
                    "required_certifications": [],
                    "background_check_required": True,
                    "reference_check_required": True,
                    "nda_required": True,
                    "security_training_required": True
                }
            
            self.networks[organization_id] = network
            
            logger.info("Expert network created",
                       organization_id=organization_id,
                       network_name=network_name,
                       network_id=network.network_id)
            
            return network
            
        except Exception as e:
            logger.error("Failed to create expert network",
                        organization_id=organization_id,
                        error=str(e))
            raise
    
    async def add_expert(
        self,
        organization_id: str,
        expert_config: Dict[str, Any]
    ) -> ExpertRole:
        """Add new expert to network"""
        try:
            network = self.networks.get(organization_id)
            if not network:
                raise ValueError(f"Expert network not found for organization {organization_id}")
            
            expert = ExpertRole(**expert_config)
            
            # Set permissions based on expertise and tier
            expert.permissions = await self._calculate_expert_permissions(expert)
            
            # Apply security restrictions
            await self._apply_security_restrictions(expert, network)
            
            network.experts[expert.expert_id] = expert
            network.updated_at = datetime.utcnow()
            
            logger.info("Expert added to network",
                       organization_id=organization_id,
                       expert_id=expert.expert_id,
                       expert_name=expert.expert_name)
            
            return expert
            
        except Exception as e:
            logger.error("Failed to add expert",
                        organization_id=organization_id,
                        error=str(e))
            raise
    
    async def _calculate_expert_permissions(self, expert: ExpertRole) -> List[str]:
        """Calculate permissions based on expertise areas and tier"""
        permissions = []
        
        # Base permissions for all experts
        base_permissions = [
            "read_dashboard",
            "create_reports",
            "access_knowledge_base"
        ]
        permissions.extend(base_permissions)
        
        # Expertise-based permissions
        expertise_permissions = {
            ExpertiseArea.RISK_MANAGEMENT: [
                "prism_read", "beacon_read", "clearance_read"
            ],
            ExpertiseArea.CYBERSECURITY: [
                "atlas_read", "pulse_read", "nexus_read"
            ],
            ExpertiseArea.REGULATORY_COMPLIANCE: [
                "compass_read", "atlas_read", "beacon_read"
            ],
            ExpertiseArea.FINANCIAL_ANALYSIS: [
                "prism_read", "prism_write", "beacon_read", "beacon_write"
            ],
            ExpertiseArea.AUDIT: [
                "compass_read", "atlas_read", "beacon_read", "clearance_read"
            ]
        }
        
        for area in expert.expertise_areas:
            if area in expertise_permissions:
                permissions.extend(expertise_permissions[area])
        
        # Tier-based permission enhancements
        if expert.expert_tier == ExpertTier.TIER_1:
            permissions.extend([
                "advanced_analytics", "executive_reports", "strategic_planning"
            ])
        elif expert.expert_tier == ExpertTier.TIER_2:
            permissions.extend([
                "detailed_analysis", "trend_reports"
            ])
        
        # Remove duplicates
        return list(set(permissions))
    
    async def _apply_security_restrictions(
        self,
        expert: ExpertRole,
        network: ExpertNetwork
    ):
        """Apply security restrictions based on data access level"""
        
        # Restrict components based on data access level
        if expert.data_access_level == "restricted":
            expert.restricted_components.extend([
                "cipher", "sensitive_data", "pii_data"
            ])
        elif expert.data_access_level == "limited":
            expert.restricted_components.extend([
                "cipher", "financial_details", "customer_data"
            ])
        
        # Apply geographic restrictions if specified
        if expert.geographic_regions:
            expert.metadata["geographic_data_restrictions"] = [
                region for region in expert.geographic_regions
            ]
    
    async def create_engagement(
        self,
        organization_id: str,
        expert_id: str,
        engagement_config: Dict[str, Any]
    ) -> ExpertEngagement:
        """Create new expert engagement"""
        try:
            network = self.networks.get(organization_id)
            if not network:
                raise ValueError(f"Expert network not found for organization {organization_id}")
            
            expert = network.experts.get(expert_id)
            if not expert:
                raise ValueError(f"Expert {expert_id} not found in network")
            
            if expert.status != ExpertStatus.AVAILABLE:
                raise ValueError(f"Expert {expert_id} is not available for engagement")
            
            engagement = ExpertEngagement(
                expert_id=expert_id,
                organization_id=organization_id,
                **engagement_config
            )
            
            # Update expert status
            expert.status = ExpertStatus.ENGAGED
            expert.last_engagement_date = datetime.utcnow()
            
            # Store engagement
            network.engagements[engagement.engagement_id] = engagement
            network.updated_at = datetime.utcnow()
            
            logger.info("Expert engagement created",
                       organization_id=organization_id,
                       expert_id=expert_id,
                       engagement_id=engagement.engagement_id)
            
            return engagement
            
        except Exception as e:
            logger.error("Failed to create expert engagement",
                        organization_id=organization_id,
                        expert_id=expert_id,
                        error=str(e))
            raise
    
    async def add_consultant(
        self,
        organization_id: str,
        consultant_config: Dict[str, Any]
    ) -> ConsultantRole:
        """Add external consultant with project-specific access"""
        try:
            network = self.networks.get(organization_id)
            if not network:
                raise ValueError(f"Expert network not found for organization {organization_id}")
            
            consultant = ConsultantRole(**consultant_config)
            
            # Set permissions based on engagement type and components
            consultant.permissions = await self._calculate_consultant_permissions(
                consultant, network
            )
            
            # Apply security controls
            await self._apply_consultant_security_controls(consultant, network)
            
            network.consultants[consultant.consultant_id] = consultant
            network.updated_at = datetime.utcnow()
            
            logger.info("Consultant added to network",
                       organization_id=organization_id,
                       consultant_id=consultant.consultant_id,
                       consultant_name=consultant.consultant_name)
            
            return consultant
            
        except Exception as e:
            logger.error("Failed to add consultant",
                        organization_id=organization_id,
                        error=str(e))
            raise
    
    async def _calculate_consultant_permissions(
        self,
        consultant: ConsultantRole,
        network: ExpertNetwork
    ) -> List[str]:
        """Calculate consultant permissions based on engagement"""
        permissions = []
        
        # Base consultant permissions
        base_permissions = [
            "read_assigned_projects",
            "create_project_reports",
            "access_project_data"
        ]
        permissions.extend(base_permissions)
        
        # Component-specific permissions
        for component in consultant.component_access:
            permissions.extend([
                f"{component}_read",
                f"{component}_project_write"
            ])
        
        # Engagement type specific permissions
        if consultant.engagement_type == EngagementType.AUDIT_SUPPORT:
            permissions.extend([
                "audit_trail_access",
                "compliance_data_read",
                "evidence_collection"
            ])
        elif consultant.engagement_type == EngagementType.EMERGENCY:
            permissions.extend([
                "emergency_access",
                "incident_response",
                "escalation_authority"
            ])
        
        return list(set(permissions))
    
    async def _apply_consultant_security_controls(
        self,
        consultant: ConsultantRole,
        network: ExpertNetwork
    ):
        """Apply security controls for consultant access"""
        
        # Enforce mandatory security requirements
        required_checks = network.vetting_criteria
        
        if required_checks.get("background_check_required", True):
            if not consultant.background_check_completed:
                consultant.permissions = ["pending_background_check"]
        
        if required_checks.get("nda_required", True):
            if not consultant.nda_signed:
                consultant.permissions = ["pending_nda"]
        
        if required_checks.get("security_training_required", True):
            if not consultant.security_training_completed:
                consultant.permissions = ["pending_security_training"]
        
        # Apply IP restrictions if specified
        if consultant.ip_restrictions:
            consultant.metadata["ip_whitelist"] = consultant.ip_restrictions
    
    async def find_experts_by_criteria(
        self,
        organization_id: str,
        criteria: Dict[str, Any]
    ) -> List[ExpertRole]:
        """Find experts matching specific criteria"""
        try:
            network = self.networks.get(organization_id)
            if not network:
                return []
            
            matching_experts = []
            
            for expert in network.experts.values():
                if expert.status == ExpertStatus.BLACKLISTED:
                    continue
                
                match = True
                
                # Check expertise areas
                if "expertise_area" in criteria:
                    required_area = criteria["expertise_area"]
                    if required_area not in expert.expertise_areas:
                        match = False
                
                # Check tier
                if "min_tier" in criteria:
                    tier_order = [ExpertTier.TIER_3, ExpertTier.TIER_2, ExpertTier.TIER_1, ExpertTier.SPECIALIST]
                    min_tier_index = tier_order.index(criteria["min_tier"])
                    expert_tier_index = tier_order.index(expert.expert_tier)
                    if expert_tier_index < min_tier_index:
                        match = False
                
                # Check availability
                if "available_only" in criteria and criteria["available_only"]:
                    if expert.status != ExpertStatus.AVAILABLE:
                        match = False
                
                # Check geographic region
                if "geographic_region" in criteria:
                    region = criteria["geographic_region"]
                    if expert.geographic_regions and region not in expert.geographic_regions:
                        match = False
                
                # Check industry experience
                if "industry" in criteria:
                    industry = criteria["industry"]
                    if expert.industry_experience and industry not in expert.industry_experience:
                        match = False
                
                # Check hourly rate budget
                if "max_hourly_rate" in criteria:
                    if expert.hourly_rate and expert.hourly_rate > criteria["max_hourly_rate"]:
                        match = False
                
                if match:
                    matching_experts.append(expert)
            
            # Sort by tier and rate
            matching_experts.sort(
                key=lambda x: (
                    [ExpertTier.TIER_1, ExpertTier.SPECIALIST, ExpertTier.TIER_2, ExpertTier.TIER_3].index(x.expert_tier),
                    x.hourly_rate or 0
                )
            )
            
            return matching_experts
            
        except Exception as e:
            logger.error("Failed to find experts by criteria",
                        organization_id=organization_id,
                        criteria=criteria,
                        error=str(e))
            return []
    
    async def get_expert_utilization(
        self,
        organization_id: str,
        expert_id: str,
        period_days: int = 30
    ) -> Dict[str, Any]:
        """Get expert utilization metrics"""
        try:
            network = self.networks.get(organization_id)
            if not network:
                return {}
            
            expert = network.experts.get(expert_id)
            if not expert:
                return {}
            
            # Calculate utilization over specified period
            cutoff_date = datetime.utcnow() - timedelta(days=period_days)
            
            relevant_engagements = [
                eng for eng in network.engagements.values()
                if eng.expert_id == expert_id and eng.start_date >= cutoff_date
            ]
            
            total_hours = sum(eng.actual_hours for eng in relevant_engagements)
            total_revenue = sum(eng.total_cost for eng in relevant_engagements)
            active_engagements = len([
                eng for eng in relevant_engagements if eng.status == "active"
            ])
            
            utilization = {
                "expert_id": expert_id,
                "expert_name": expert.expert_name,
                "period_days": period_days,
                "total_hours": total_hours,
                "total_revenue": total_revenue,
                "active_engagements": active_engagements,
                "completed_engagements": len(relevant_engagements) - active_engagements,
                "average_hourly_rate": total_revenue / total_hours if total_hours > 0 else 0,
                "utilization_percentage": (total_hours / (period_days * 8)) * 100 if expert.max_hours_per_month else None
            }
            
            return utilization
            
        except Exception as e:
            logger.error("Failed to get expert utilization",
                        organization_id=organization_id,
                        expert_id=expert_id,
                        error=str(e))
            return {}

# Global expert manager instance
expert_manager = ExpertManager()