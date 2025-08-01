"""
ERIP Automated Proposal Generation Engine
AI-powered proposal creation for compliance-focused sales opportunities
"""

from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
import asyncio
import structlog
from anthropic import AsyncAnthropic
import json
from dataclasses import dataclass
from enum import Enum

logger = structlog.get_logger()

class ProposalType(str, Enum):
    """Types of proposals that can be generated"""
    RFP_RESPONSE = "rfp_response"
    EXECUTIVE_SUMMARY = "executive_summary"
    TECHNICAL_PROPOSAL = "technical_proposal"
    COMPLIANCE_ASSESSMENT = "compliance_assessment"
    ROI_BUSINESS_CASE = "roi_business_case"

class IndustryVertical(str, Enum):
    """Industry verticals with specific compliance needs"""
    FINANCIAL_SERVICES = "financial_services"
    HEALTHCARE = "healthcare"
    TECHNOLOGY = "technology"
    MANUFACTURING = "manufacturing"
    GOVERNMENT = "government"
    ENERGY = "energy"
    RETAIL = "retail"

@dataclass
class ComplianceFramework:
    """Compliance framework information for proposals"""
    name: str
    description: str
    key_requirements: List[str]
    erip_capabilities: List[str]
    implementation_timeline: str
    compliance_benefits: List[str]

class CustomerProfile(BaseModel):
    """Customer profile for proposal customization"""
    name: str
    industry: IndustryVertical
    size: str  # enterprise, mid-market, small
    geography: str
    current_compliance_challenges: List[str]
    regulatory_requirements: List[str]
    decision_makers: List[Dict[str, str]]
    competitive_situation: Optional[str] = None
    budget_range: Optional[Tuple[float, float]] = None
    timeline_requirements: Optional[str] = None

class ProposalSection(BaseModel):
    """Individual section of a proposal"""
    title: str
    content: str
    subsections: List['ProposalSection'] = Field(default_factory=list)
    charts_needed: List[str] = Field(default_factory=list)
    key_points: List[str] = Field(default_factory=list)

class GeneratedProposal(BaseModel):
    """Complete generated proposal"""
    proposal_id: str
    customer_name: str
    proposal_type: ProposalType
    created_date: datetime
    sections: List[ProposalSection]
    executive_summary: str
    total_investment: Optional[float] = None
    roi_projection: Optional[Dict[str, float]] = None
    implementation_timeline: Optional[Dict[str, str]] = None
    competitive_differentiators: List[str] = Field(default_factory=list)
    compliance_certifications: List[str] = Field(default_factory=list)

class AutomatedProposalEngine:
    """
    AI-powered proposal generation engine for compliance-focused sales
    Creates customized, professional proposals with regulatory expertise
    """
    
    def __init__(self):
        self.anthropic_client = AsyncAnthropic()
        self.compliance_frameworks = self._initialize_compliance_frameworks()
        self.industry_templates = self._initialize_industry_templates()
        self.roi_models = self._initialize_roi_models()
        
    def _initialize_compliance_frameworks(self) -> Dict[str, ComplianceFramework]:
        """Initialize compliance framework database"""
        return {
            "gdpr": ComplianceFramework(
                name="General Data Protection Regulation (GDPR)",
                description="EU comprehensive data protection framework",
                key_requirements=[
                    "Lawful basis for data processing",
                    "Data subject rights implementation",
                    "Privacy by design and default",
                    "Data breach notification procedures",
                    "Data Protection Impact Assessments (DPIA)"
                ],
                erip_capabilities=[
                    "Automated privacy impact assessments",
                    "Real-time consent management",
                    "Automated breach detection and notification",
                    "Data subject rights automation",
                    "Cross-border transfer compliance"
                ],
                implementation_timeline="4-6 weeks",
                compliance_benefits=[
                    "Avoid fines up to 4% of annual revenue",
                    "Maintain EU market access",
                    "Build customer trust through transparency",
                    "Streamline privacy operations"
                ]
            ),
            "sox": ComplianceFramework(
                name="Sarbanes-Oxley Act (SOX)",
                description="Financial reporting and corporate governance compliance",
                key_requirements=[
                    "Internal financial controls documentation",
                    "Management assessment of controls",
                    "External auditor attestation",
                    "CEO/CFO certification",
                    "Real-time disclosure requirements"
                ],
                erip_capabilities=[
                    "Automated control testing and monitoring",
                    "Real-time financial reporting controls",
                    "Audit trail automation",
                    "Control deficiency tracking",
                    "Executive certification automation"
                ],
                implementation_timeline="6-8 weeks",
                compliance_benefits=[
                    "Reduce audit costs by 40-60%",
                    "Ensure continuous compliance monitoring",
                    "Accelerate quarter-end close processes",
                    "Minimize compliance risk exposure"
                ]
            ),
            "hipaa": ComplianceFramework(
                name="Health Insurance Portability and Accountability Act (HIPAA)",
                description="Healthcare data protection and privacy standards",
                key_requirements=[
                    "Administrative safeguards",
                    "Physical safeguards", 
                    "Technical safeguards",
                    "Business Associate Agreements",
                    "Breach notification procedures"
                ],
                erip_capabilities=[
                    "Automated PHI discovery and classification",
                    "Real-time access monitoring",
                    "Business Associate Agreement automation",
                    "Breach risk assessment",
                    "Audit log analysis and reporting"
                ],
                implementation_timeline="4-6 weeks",
                compliance_benefits=[
                    "Protect against penalties up to €1.5M per incident",
                    "Ensure patient trust and reputation protection",
                    "Streamline healthcare operations",
                    "Enable secure health information exchange"
                ]
            )
        }
    
    def _initialize_industry_templates(self) -> Dict[IndustryVertical, Dict[str, Any]]:
        """Initialize industry-specific proposal templates"""
        return {
            IndustryVertical.FINANCIAL_SERVICES: {
                "pain_points": [
                    "Complex multi-jurisdictional regulatory landscape",
                    "Frequent regulatory changes requiring rapid adaptation",
                    "High cost of compliance operations",
                    "Manual risk assessment processes",
                    "Siloed compliance data and reporting"
                ],
                "value_propositions": [
                    "Real-time regulatory change monitoring and impact assessment",
                    "Automated compliance reporting across all jurisdictions",
                    "Integrated risk quantification and capital allocation",
                    "AI-powered regulatory interpretation and guidance",
                    "Unified compliance dashboard for executives"
                ],
                "key_frameworks": ["sox", "basel", "mifid", "pci_dss", "gdpr"],
                "typical_roi": {"cost_savings": 2.5, "revenue_protection": 5.2, "efficiency_gains": 3.1}
            },
            IndustryVertical.HEALTHCARE: {
                "pain_points": [
                    "Protecting patient health information (PHI)",
                    "Complex Business Associate Agreement management",
                    "Interoperability and data sharing challenges",
                    "Frequent security risk assessments",
                    "Manual breach notification processes"
                ],
                "value_propositions": [
                    "Automated PHI protection and monitoring",
                    "Streamlined Business Associate Agreement workflows",
                    "Secure healthcare data interoperability",
                    "Continuous security risk monitoring",
                    "Automated breach detection and notification"
                ],
                "key_frameworks": ["hipaa", "hitech", "fda", "iso_13485"],
                "typical_roi": {"cost_savings": 2.1, "revenue_protection": 4.8, "efficiency_gains": 2.9}
            },
            IndustryVertical.TECHNOLOGY: {
                "pain_points": [
                    "Global privacy regulation compliance",
                    "Rapid product development vs compliance requirements",
                    "Customer data protection across multiple jurisdictions",
                    "Security certification maintenance",
                    "Scalable compliance for growth"
                ],
                "value_propositions": [
                    "Privacy-by-design automation for product development",
                    "Multi-jurisdictional compliance automation",
                    "Scalable security certification management",
                    "Real-time compliance monitoring for global operations",
                    "Developer-friendly compliance integration"
                ],
                "key_frameworks": ["gdpr", "ccpa", "iso_27001", "soc2"],
                "typical_roi": {"cost_savings": 3.2, "revenue_protection": 6.1, "efficiency_gains": 4.3}
            }
        }
    
    def _initialize_roi_models(self) -> Dict[str, Any]:
        """Initialize ROI calculation models"""
        return {
            "compliance_cost_avoidance": {
                "regulatory_penalties": {"multiplier": 0.05, "base": 1000000},
                "audit_costs": {"multiplier": 0.4, "base": 500000},
                "consulting_fees": {"multiplier": 0.7, "base": 200000},
                "manual_processes": {"multiplier": 0.6, "base": 300000}
            },
            "efficiency_gains": {
                "automated_reporting": {"time_saved_hours": 2000, "hourly_rate": 150},
                "reduced_manual_review": {"time_saved_hours": 1500, "hourly_rate": 120},
                "faster_audit_preparation": {"time_saved_hours": 800, "hourly_rate": 180}
            },
            "revenue_protection": {
                "market_access": {"revenue_at_risk": 0.15, "market_size": 10000000},
                "customer_trust": {"churn_reduction": 0.05, "customer_ltv": 250000},
                "competitive_advantage": {"deal_win_rate": 0.25, "average_deal": 500000}
            }
        }
    
    async def generate_proposal(
        self, 
        customer: CustomerProfile, 
        proposal_type: ProposalType,
        rfp_requirements: Optional[List[str]] = None
    ) -> GeneratedProposal:
        """
        Generate comprehensive AI-powered proposal for customer
        """
        try:
            logger.info("Starting proposal generation",
                       customer=customer.name,
                       proposal_type=proposal_type.value,
                       industry=customer.industry.value)
            
            # Generate proposal content using AI
            proposal_content = await self._generate_ai_proposal_content(
                customer, proposal_type, rfp_requirements
            )
            
            # Calculate ROI projections
            roi_projection = self._calculate_roi_projection(customer)
            
            # Generate implementation timeline
            timeline = self._generate_implementation_timeline(customer)
            
            # Create structured proposal
            proposal = GeneratedProposal(
                proposal_id=f"prop_{customer.name.replace(' ', '_').lower()}_{int(datetime.utcnow().timestamp())}",
                customer_name=customer.name,
                proposal_type=proposal_type,
                created_date=datetime.utcnow(),
                sections=proposal_content["sections"],
                executive_summary=proposal_content["executive_summary"],
                total_investment=roi_projection.get("total_investment"),
                roi_projection=roi_projection,
                implementation_timeline=timeline,
                competitive_differentiators=proposal_content["differentiators"],
                compliance_certifications=self._get_relevant_certifications(customer.industry)
            )
            
            logger.info("Proposal generation completed",
                       customer=customer.name,
                       proposal_id=proposal.proposal_id,
                       sections_count=len(proposal.sections))
            
            return proposal
            
        except Exception as e:
            logger.error("Proposal generation failed",
                        customer=customer.name,
                        error=str(e))
            raise
    
    async def _generate_ai_proposal_content(
        self,
        customer: CustomerProfile,
        proposal_type: ProposalType,
        rfp_requirements: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Generate AI-powered proposal content using Claude"""
        
        # Build context for AI generation
        industry_template = self.industry_templates.get(customer.industry, {})
        relevant_frameworks = [
            self.compliance_frameworks[fw] for fw in customer.regulatory_requirements
            if fw in self.compliance_frameworks
        ]
        
        context = {
            "customer": customer.dict(),
            "industry_template": industry_template,
            "compliance_frameworks": [fw.__dict__ for fw in relevant_frameworks],
            "rfp_requirements": rfp_requirements or []
        }
        
        # Create AI prompt for proposal generation
        prompt = f"""You are ERIP's expert proposal writer, creating a winning compliance-focused proposal.

CUSTOMER CONTEXT:
{json.dumps(context, indent=2, default=str)}

PROPOSAL TYPE: {proposal_type.value}

INSTRUCTIONS:
Create a professional, compelling proposal that demonstrates ERIP's unique value in transforming compliance from bottleneck to competitive advantage.

Key principles:
1. Lead with business outcomes and ROI, not features
2. Address specific industry pain points with targeted solutions
3. Showcase regulatory expertise and automation capabilities
4. Include competitive differentiation against traditional GRC solutions
5. Provide clear implementation timeline and success metrics

STRUCTURE YOUR RESPONSE AS:
{{
  "executive_summary": "2-3 paragraph executive summary focusing on business value",
  "sections": [
    {{
      "title": "Section Title",
      "content": "Detailed section content",
      "key_points": ["bullet point 1", "bullet point 2"],
      "charts_needed": ["chart description if visual needed"]
    }}
  ],
  "differentiators": ["key competitive advantages"],
  "success_metrics": ["measurable outcomes"]
}}

Focus on ERIP's unique positioning:
- AI-powered instant compliance intelligence
- 30-day implementation vs 6-month traditional
- 525% demonstrated ROI through automation
- Real-time regulatory monitoring and adaptation
- Sales-native compliance acceleration

Write for {customer.industry.value} industry decision makers who care about business results."""

        try:
            response = await self.anthropic_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                temperature=0.4,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Parse AI response
            ai_content = response.content[0].text
            
            # Extract JSON structure from AI response
            try:
                content_data = json.loads(ai_content)
            except json.JSONDecodeError:
                # Fallback parsing if JSON is malformed
                content_data = self._parse_fallback_content(ai_content, customer)
            
            # Convert to ProposalSection objects
            sections = []
            for section_data in content_data.get("sections", []):
                section = ProposalSection(
                    title=section_data.get("title", ""),
                    content=section_data.get("content", ""),
                    key_points=section_data.get("key_points", []),
                    charts_needed=section_data.get("charts_needed", [])
                )
                sections.append(section)
            
            return {
                "executive_summary": content_data.get("executive_summary", ""),
                "sections": sections,
                "differentiators": content_data.get("differentiators", []),
                "success_metrics": content_data.get("success_metrics", [])
            }
            
        except Exception as e:
            logger.error("AI proposal generation failed", error=str(e))
            # Return fallback content
            return self._generate_fallback_content(customer, proposal_type)
    
    def _parse_fallback_content(self, ai_content: str, customer: CustomerProfile) -> Dict[str, Any]:
        """Parse AI content when JSON parsing fails"""
        
        # Extract executive summary (usually first paragraph)
        lines = ai_content.split('\n')
        executive_summary = ""
        sections = []
        differentiators = []
        
        current_section = None
        for line in lines:
            line = line.strip()
            if line.startswith('Executive Summary') or line.startswith('EXECUTIVE SUMMARY'):
                executive_summary = line
            elif line.startswith('##') or line.startswith('**'):
                # New section
                if current_section:
                    sections.append(current_section)
                current_section = {
                    "title": line.replace('##', '').replace('**', '').strip(),
                    "content": "",
                    "key_points": [],
                    "charts_needed": []
                }
            elif current_section and line:
                current_section["content"] += line + "\n"
        
        if current_section:
            sections.append(current_section)
        
        return {
            "executive_summary": executive_summary,
            "sections": sections,
            "differentiators": differentiators,
            "success_metrics": []
        }
    
    def _generate_fallback_content(self, customer: CustomerProfile, proposal_type: ProposalType) -> Dict[str, Any]:
        """Generate fallback content when AI fails"""
        
        industry_template = self.industry_templates.get(customer.industry, {})
        
        sections = [
            ProposalSection(
                title="Executive Summary",
                content=f"ERIP transforms {customer.name}'s compliance challenges into competitive advantages through AI-powered automation.",
                key_points=[
                    "Reduce compliance costs by 60-80%",
                    "Accelerate regulatory responses by 90%",
                    "Achieve 525% ROI through automation"
                ]
            ),
            ProposalSection(
                title="Solution Overview",
                content="ERIP's comprehensive platform addresses your specific compliance requirements through intelligent automation.",
                key_points=industry_template.get("value_propositions", [])
            ),
            ProposalSection(
                title="Implementation Approach",
                content="Our proven 30-day implementation methodology ensures rapid time-to-value.",
                key_points=[
                    "Week 1-2: Platform setup and configuration",
                    "Week 3-4: Integration and testing",
                    "Week 5-6: Training and go-live",
                    "Week 7-8: Optimization and support"
                ]
            )
        ]
        
        return {
            "executive_summary": f"ERIP delivers transformational compliance automation for {customer.name}, reducing costs, accelerating compliance, and enabling sustainable growth.",
            "sections": sections,
            "differentiators": [
                "AI-powered instant compliance intelligence",
                "30-day implementation timeline",
                "525% demonstrated ROI",
                "Real-time regulatory monitoring"
            ],
            "success_metrics": [
                "60-80% reduction in compliance costs",
                "90% faster regulatory response times",
                "525% ROI within first year"
            ]
        }
    
    def _calculate_roi_projection(self, customer: CustomerProfile) -> Dict[str, float]:
        """Calculate ROI projection based on customer profile"""
        
        # Base investment estimation
        base_investment = 200000  # Starting point
        
        # Adjust based on company size
        size_multipliers = {"small": 0.5, "mid-market": 1.0, "enterprise": 2.0}
        size_multiplier = size_multipliers.get(customer.size, 1.0)
        
        total_investment = base_investment * size_multiplier
        
        # Calculate benefits using industry-specific models
        industry_template = self.industry_templates.get(customer.industry, {})
        roi_factors = industry_template.get("typical_roi", {"cost_savings": 2.0, "revenue_protection": 3.0, "efficiency_gains": 1.5})
        
        cost_savings = total_investment * roi_factors["cost_savings"]
        revenue_protection = total_investment * roi_factors["revenue_protection"] 
        efficiency_gains = total_investment * roi_factors["efficiency_gains"]
        
        total_benefits = cost_savings + revenue_protection + efficiency_gains
        net_roi = total_benefits - total_investment
        roi_percentage = (net_roi / total_investment) * 100
        
        return {
            "total_investment": total_investment,
            "cost_savings": cost_savings,
            "revenue_protection": revenue_protection,
            "efficiency_gains": efficiency_gains,
            "total_benefits": total_benefits,
            "net_roi": net_roi,
            "roi_percentage": roi_percentage,
            "payback_period_months": (total_investment / (total_benefits / 12))
        }
    
    def _generate_implementation_timeline(self, customer: CustomerProfile) -> Dict[str, str]:
        """Generate implementation timeline based on customer complexity"""
        
        base_timeline = {
            "week_1": "Platform setup, environment configuration, initial integrations",
            "week_2": "Compliance framework configuration, user setup, permissions",
            "week_3": "Data integration, testing, validation workflows",
            "week_4": "User training, pilot deployment, feedback integration",
            "week_5": "Full deployment, monitoring setup, optimization",
            "week_6": "Go-live support, performance tuning, success measurement"
        }
        
        # Adjust timeline based on complexity
        if customer.size == "enterprise" or len(customer.regulatory_requirements) > 3:
            base_timeline.update({
                "week_7": "Advanced feature implementation, custom reporting",
                "week_8": "Final optimization, handover to operations team"
            })
        
        return base_timeline
    
    def _get_relevant_certifications(self, industry: IndustryVertical) -> List[str]:
        """Get relevant certifications for industry"""
        
        certification_mapping = {
            IndustryVertical.FINANCIAL_SERVICES: ["SOC 2 Type II", "ISO 27001", "PCI DSS"],
            IndustryVertical.HEALTHCARE: ["HIPAA", "HITECH", "SOC 2 Type II"],
            IndustryVertical.TECHNOLOGY: ["SOC 2 Type II", "ISO 27001", "GDPR"],
            IndustryVertical.GOVERNMENT: ["FedRAMP", "FISMA", "SOC 2 Type II"],
            IndustryVertical.MANUFACTURING: ["ISO 27001", "NIST Framework", "SOC 2 Type II"]
        }
        
        return certification_mapping.get(industry, ["SOC 2 Type II", "ISO 27001"])
    
    async def generate_rfp_response(
        self,
        customer: CustomerProfile,
        rfp_sections: List[Dict[str, str]],
        evaluation_criteria: List[str]
    ) -> GeneratedProposal:
        """Generate specific RFP response with section-by-section answers"""
        
        try:
            # Process each RFP section
            rfp_requirements = []
            for section in rfp_sections:
                rfp_requirements.extend(section.get("requirements", []))
            
            # Generate proposal with RFP-specific content
            proposal = await self.generate_proposal(
                customer=customer,
                proposal_type=ProposalType.RFP_RESPONSE,
                rfp_requirements=rfp_requirements
            )
            
            # Add RFP-specific sections
            rfp_sections_content = []
            for i, section in enumerate(rfp_sections):
                rfp_section = await self._generate_rfp_section_response(
                    section, customer, evaluation_criteria
                )
                rfp_sections_content.append(rfp_section)
            
            # Insert RFP sections into proposal
            proposal.sections.extend(rfp_sections_content)
            
            logger.info("RFP response generated",
                       customer=customer.name,
                       sections_count=len(rfp_sections))
            
            return proposal
            
        except Exception as e:
            logger.error("RFP response generation failed",
                        customer=customer.name,
                        error=str(e))
            raise
    
    async def _generate_rfp_section_response(
        self,
        rfp_section: Dict[str, str],
        customer: CustomerProfile,
        evaluation_criteria: List[str]
    ) -> ProposalSection:
        """Generate response to specific RFP section"""
        
        section_title = rfp_section.get("title", "RFP Section")
        section_requirements = rfp_section.get("requirements", [])
        
        # Generate AI response for this specific section
        prompt = f"""Generate a comprehensive response to this RFP section for ERIP.

SECTION: {section_title}
REQUIREMENTS: {json.dumps(section_requirements)}
CUSTOMER: {customer.name} in {customer.industry.value}
EVALUATION CRITERIA: {json.dumps(evaluation_criteria)}

Provide a detailed response that:
1. Directly addresses each requirement
2. Demonstrates ERIP's capabilities and advantages
3. Includes specific examples and proof points
4. Shows understanding of customer's industry challenges
5. Aligns with evaluation criteria

Format as detailed paragraphs with clear structure."""
        
        try:
            response = await self.anthropic_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2000,
                temperature=0.3,
                messages=[{"role": "user", "content": prompt}]
            )
            
            content = response.content[0].text
            
            return ProposalSection(
                title=f"RFP Response: {section_title}",
                content=content,
                key_points=section_requirements,
                charts_needed=[]
            )
            
        except Exception as e:
            logger.error("RFP section response generation failed", error=str(e))
            
            # Fallback response
            return ProposalSection(
                title=f"RFP Response: {section_title}",
                content=f"ERIP addresses the requirements in {section_title} through our comprehensive compliance automation platform.",
                key_points=section_requirements,
                charts_needed=[]
            )