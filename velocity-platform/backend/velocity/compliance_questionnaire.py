"""
Velocity.ai Compliance Assessment Questionnaire
Provides immediate value through AI-powered gap analysis without integrations
"""

from typing import Dict, List, Optional, Tuple
from enum import Enum
from dataclasses import dataclass, field
from datetime import datetime
import json

class ComplianceFramework(Enum):
    SOC2_TYPE_I = "soc2_type_i"
    SOC2_TYPE_II = "soc2_type_ii"
    GDPR = "gdpr"
    HIPAA = "hipaa"
    ISO_27001 = "iso_27001"
    PCI_DSS = "pci_dss"
    NIST_CSF = "nist_csf"
    AI_ACT = "ai_act"
    DORA = "dora"

class QuestionType(Enum):
    BOOLEAN = "boolean"
    MULTIPLE_CHOICE = "multiple_choice"
    SCALE = "scale"  # 1-5 rating
    TEXT_INPUT = "text_input"
    CHECKLIST = "checklist"

class RiskLevel(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

@dataclass
class Question:
    id: str
    framework: ComplianceFramework
    category: str
    question: str
    question_type: QuestionType
    required: bool = True
    options: List[str] = field(default_factory=list)
    help_text: str = ""
    control_reference: str = ""

@dataclass
class Answer:
    question_id: str
    value: any
    confidence: int = 100  # AI confidence in answer interpretation
    notes: str = ""

@dataclass
class GapAnalysis:
    control_id: str
    control_name: str
    framework: ComplianceFramework
    current_state: str
    required_state: str
    risk_level: RiskLevel
    estimated_effort: str  # "1-2 weeks", "1-3 months", etc.
    priority: int  # 1-10
    recommendations: List[str]
    cost_estimate: Optional[str] = None

@dataclass
class ComplianceAssessment:
    organization_id: str
    framework: ComplianceFramework
    assessment_date: datetime
    questions: List[Question]
    answers: List[Answer] = field(default_factory=list)
    gaps: List[GapAnalysis] = field(default_factory=list)
    overall_score: float = 0.0
    trust_score_impact: int = 0
    completion_timeline: str = ""

class ComplianceQuestionnaire:
    """AI-powered compliance questionnaire that provides immediate value"""
    
    def __init__(self):
        self.questions = self._load_questions()
        self.framework_weights = self._load_framework_weights()
    
    def _load_questions(self) -> Dict[ComplianceFramework, List[Question]]:
        """Load framework-specific questions"""
        return {
            ComplianceFramework.SOC2_TYPE_I: self._get_soc2_questions(),
            ComplianceFramework.GDPR: self._get_gdpr_questions(),
            ComplianceFramework.HIPAA: self._get_hipaa_questions(),
            ComplianceFramework.ISO_27001: self._get_iso27001_questions(),
            ComplianceFramework.AI_ACT: self._get_ai_act_questions()
        }
    
    def _get_soc2_questions(self) -> List[Question]:
        """SOC 2 Type I assessment questions"""
        return [
            # Security Principle
            Question(
                id="soc2_s1_access_control",
                framework=ComplianceFramework.SOC2_TYPE_I,
                category="Security - Access Controls",
                question="Do you have documented policies for user access provisioning and deprovisioning?",
                question_type=QuestionType.BOOLEAN,
                help_text="SOC 2 requires formal access control policies and procedures",
                control_reference="CC6.1"
            ),
            Question(
                id="soc2_s2_mfa",
                framework=ComplianceFramework.SOC2_TYPE_I,
                category="Security - Authentication",
                question="What percentage of your systems require multi-factor authentication?",
                question_type=QuestionType.SCALE,
                options=["0%", "25%", "50%", "75%", "100%"],
                control_reference="CC6.1"
            ),
            Question(
                id="soc2_s3_encryption",
                framework=ComplianceFramework.SOC2_TYPE_I,
                category="Security - Data Protection",
                question="Which types of data encryption do you currently implement?",
                question_type=QuestionType.CHECKLIST,
                options=[
                    "Data at rest encryption",
                    "Data in transit encryption", 
                    "Database encryption",
                    "Backup encryption",
                    "Key management system"
                ],
                control_reference="CC6.7"
            ),
            Question(
                id="soc2_s4_monitoring",
                framework=ComplianceFramework.SOC2_TYPE_I,
                category="Security - Monitoring",
                question="Do you have automated security monitoring and alerting systems?",
                question_type=QuestionType.BOOLEAN,
                help_text="Continuous monitoring is essential for SOC 2 compliance",
                control_reference="CC7.1"
            ),
            Question(
                id="soc2_s5_incident_response",
                framework=ComplianceFramework.SOC2_TYPE_I,
                category="Security - Incident Response",
                question="How quickly can you detect and respond to security incidents?",
                question_type=QuestionType.MULTIPLE_CHOICE,
                options=[
                    "Real-time (< 1 hour)",
                    "Same day (< 24 hours)",
                    "Within 72 hours",
                    "Within 1 week",
                    "No formal process"
                ],
                control_reference="CC7.4"
            ),
            
            # Availability Principle
            Question(
                id="soc2_a1_backup",
                framework=ComplianceFramework.SOC2_TYPE_I,
                category="Availability - Backup & Recovery",
                question="How frequently do you test your backup and recovery procedures?",
                question_type=QuestionType.MULTIPLE_CHOICE,
                options=[
                    "Monthly",
                    "Quarterly", 
                    "Semi-annually",
                    "Annually",
                    "Never/Rarely"
                ],
                control_reference="A1.2"
            ),
            Question(
                id="soc2_a2_uptime",
                framework=ComplianceFramework.SOC2_TYPE_I,
                category="Availability - System Reliability",
                question="What is your target system uptime commitment?",
                question_type=QuestionType.MULTIPLE_CHOICE,
                options=[
                    "99.9% (8.77 hours downtime/year)",
                    "99.5% (43.83 hours downtime/year)",
                    "99% (87.66 hours downtime/year)",
                    "95% (438.3 hours downtime/year)",
                    "No formal SLA"
                ],
                control_reference="A1.1"
            ),
            
            # Processing Integrity
            Question(
                id="soc2_p1_data_validation",
                framework=ComplianceFramework.SOC2_TYPE_I,
                category="Processing Integrity - Data Quality",
                question="Do you have automated data validation and integrity checks?",
                question_type=QuestionType.BOOLEAN,
                help_text="Processing integrity requires systematic data validation",
                control_reference="PI1.1"
            ),
            
            # Confidentiality
            Question(
                id="soc2_c1_data_classification",
                framework=ComplianceFramework.SOC2_TYPE_I,
                category="Confidentiality - Data Handling",
                question="Do you have a formal data classification and handling policy?",
                question_type=QuestionType.BOOLEAN,
                control_reference="C1.1"
            ),
            
            # Privacy
            Question(
                id="soc2_pr1_privacy_notice",
                framework=ComplianceFramework.SOC2_TYPE_I,
                category="Privacy - Notice & Consent",
                question="Do you provide clear privacy notices and obtain consent for data collection?",
                question_type=QuestionType.BOOLEAN,
                control_reference="P1.1"
            )
        ]
    
    def _get_gdpr_questions(self) -> List[Question]:
        """GDPR assessment questions"""
        return [
            Question(
                id="gdpr_1_dpo",
                framework=ComplianceFramework.GDPR,
                category="Governance - Data Protection Officer",
                question="Have you appointed a Data Protection Officer (DPO)?",
                question_type=QuestionType.BOOLEAN,
                help_text="Required if you process personal data on a large scale",
                control_reference="Article 37"
            ),
            Question(
                id="gdpr_2_lawful_basis",
                framework=ComplianceFramework.GDPR,
                category="Legal Basis - Processing Justification",
                question="For what lawful bases do you process personal data?",
                question_type=QuestionType.CHECKLIST,
                options=[
                    "Consent",
                    "Contract performance",
                    "Legal obligation",
                    "Vital interests",
                    "Public task",
                    "Legitimate interests"
                ],
                control_reference="Article 6"
            ),
            Question(
                id="gdpr_3_consent_mechanism",
                framework=ComplianceFramework.GDPR,
                category="Consent - User Rights",
                question="How do users withdraw consent in your systems?",
                question_type=QuestionType.MULTIPLE_CHOICE,
                options=[
                    "Self-service dashboard",
                    "Email request",
                    "Contact form",
                    "Phone support",
                    "No mechanism available"
                ],
                control_reference="Article 7"
            ),
            Question(
                id="gdpr_4_data_retention",
                framework=ComplianceFramework.GDPR,
                category="Data Minimization - Retention",
                question="Do you have automated data retention and deletion policies?",
                question_type=QuestionType.BOOLEAN,
                help_text="GDPR requires data to be kept only as long as necessary",
                control_reference="Article 5"
            ),
            Question(
                id="gdpr_5_breach_notification",
                framework=ComplianceFramework.GDPR,
                category="Security - Breach Response",
                question="Can you notify supervisory authorities within 72 hours of a breach?",
                question_type=QuestionType.BOOLEAN,
                help_text="GDPR requires breach notification within 72 hours",
                control_reference="Article 33"
            )
        ]
    
    def _get_hipaa_questions(self) -> List[Question]:
        """HIPAA assessment questions"""
        return [
            Question(
                id="hipaa_1_baa",
                framework=ComplianceFramework.HIPAA,
                category="Administrative - Business Associates",
                question="Do you have signed Business Associate Agreements (BAAs) with all vendors?",
                question_type=QuestionType.BOOLEAN,
                help_text="Required for all third parties handling PHI",
                control_reference="§164.308(b)"
            ),
            Question(
                id="hipaa_2_access_controls",
                framework=ComplianceFramework.HIPAA,
                category="Technical - Access Controls",
                question="How do you control access to Protected Health Information (PHI)?",
                question_type=QuestionType.CHECKLIST,
                options=[
                    "Role-based access control",
                    "User authentication",
                    "Access logging",
                    "Regular access reviews",
                    "Automatic session timeouts"
                ],
                control_reference="§164.312(a)"
            ),
            Question(
                id="hipaa_3_encryption",
                framework=ComplianceFramework.HIPAA,
                category="Technical - Encryption",
                question="Is all PHI encrypted at rest and in transit?",
                question_type=QuestionType.BOOLEAN,
                help_text="Encryption is addressable under HIPAA Security Rule",
                control_reference="§164.312(a)(2)(iv)"
            ),
            Question(
                id="hipaa_4_audit_logs",
                framework=ComplianceFramework.HIPAA,
                category="Technical - Audit Controls",
                question="Do you maintain comprehensive audit logs for PHI access?",
                question_type=QuestionType.BOOLEAN,
                control_reference="§164.312(b)"
            ),
            Question(
                id="hipaa_5_training",
                framework=ComplianceFramework.HIPAA,
                category="Administrative - Workforce Training",
                question="How often do you conduct HIPAA privacy and security training?",
                question_type=QuestionType.MULTIPLE_CHOICE,
                options=[
                    "Upon hire and annually",
                    "Upon hire only",
                    "Annually only",
                    "As needed basis",
                    "No formal training"
                ],
                control_reference="§164.308(a)(5)"
            )
        ]
    
    def _get_iso27001_questions(self) -> List[Question]:
        """ISO 27001 assessment questions"""
        return [
            Question(
                id="iso27001_1_isms",
                framework=ComplianceFramework.ISO_27001,
                category="Governance - ISMS",
                question="Have you established an Information Security Management System (ISMS)?",
                question_type=QuestionType.BOOLEAN,
                help_text="ISMS is the foundation of ISO 27001",
                control_reference="Clause 4"
            ),
            Question(
                id="iso27001_2_risk_assessment",
                framework=ComplianceFramework.ISO_27001,
                category="Risk Management - Assessment",
                question="How frequently do you conduct information security risk assessments?",
                question_type=QuestionType.MULTIPLE_CHOICE,
                options=[
                    "Continuously",
                    "Quarterly",
                    "Semi-annually",
                    "Annually",
                    "Ad-hoc basis"
                ],
                control_reference="Clause 6.1.2"
            ),
            Question(
                id="iso27001_3_controls",
                framework=ComplianceFramework.ISO_27001,
                category="Controls - Implementation",
                question="Which Annex A controls have you implemented?",
                question_type=QuestionType.SCALE,
                options=["0-20%", "21-40%", "41-60%", "61-80%", "81-100%"],
                help_text="ISO 27001 has 114 controls in Annex A",
                control_reference="Annex A"
            )
        ]
    
    def _get_ai_act_questions(self) -> List[Question]:
        """EU AI Act assessment questions"""
        return [
            Question(
                id="ai_act_1_system_classification",
                framework=ComplianceFramework.AI_ACT,
                category="Classification - Risk Assessment",
                question="How would you classify your AI systems?",
                question_type=QuestionType.CHECKLIST,
                options=[
                    "Prohibited AI practices",
                    "High-risk AI systems",
                    "Limited risk AI systems",
                    "Minimal risk AI systems",
                    "General-purpose AI models"
                ],
                help_text="AI Act classification determines compliance requirements",
                control_reference="Article 6-7"
            ),
            Question(
                id="ai_act_2_conformity_assessment",
                framework=ComplianceFramework.AI_ACT,
                category="Compliance - Conformity Assessment",
                question="Have you completed conformity assessments for high-risk AI systems?",
                question_type=QuestionType.BOOLEAN,
                help_text="Required before placing high-risk AI systems on the market",
                control_reference="Article 43"
            ),
            Question(
                id="ai_act_3_human_oversight",
                framework=ComplianceFramework.AI_ACT,
                category="Governance - Human Oversight",
                question="Do your AI systems include meaningful human oversight mechanisms?",
                question_type=QuestionType.BOOLEAN,
                help_text="Human oversight is required for high-risk AI systems",
                control_reference="Article 14"
            ),
            Question(
                id="ai_act_4_transparency",
                framework=ComplianceFramework.AI_ACT,
                category="Transparency - User Information",
                question="Do you clearly inform users when they interact with AI systems?",
                question_type=QuestionType.BOOLEAN,
                control_reference="Article 52"
            )
        ]
    
    def _load_framework_weights(self) -> Dict[ComplianceFramework, Dict[str, float]]:
        """Load scoring weights for different frameworks"""
        return {
            ComplianceFramework.SOC2_TYPE_I: {
                "Security": 0.4,
                "Availability": 0.2,
                "Processing Integrity": 0.15,
                "Confidentiality": 0.15,
                "Privacy": 0.1
            },
            ComplianceFramework.GDPR: {
                "Governance": 0.3,
                "Legal Basis": 0.25,
                "Consent": 0.2,
                "Data Minimization": 0.15,
                "Security": 0.1
            },
            ComplianceFramework.HIPAA: {
                "Administrative": 0.4,
                "Technical": 0.4,
                "Physical": 0.2
            }
        }
    
    def start_assessment(self, organization_id: str, framework: ComplianceFramework) -> ComplianceAssessment:
        """Initialize a new compliance assessment"""
        questions = self.questions.get(framework, [])
        
        return ComplianceAssessment(
            organization_id=organization_id,
            framework=framework,
            assessment_date=datetime.now(),
            questions=questions
        )
    
    def answer_question(self, assessment: ComplianceAssessment, question_id: str, value: any, notes: str = "") -> None:
        """Record an answer to a question"""
        answer = Answer(
            question_id=question_id,
            value=value,
            notes=notes
        )
        
        # Remove any existing answer for this question
        assessment.answers = [a for a in assessment.answers if a.question_id != question_id]
        assessment.answers.append(answer)
    
    def analyze_compliance_gaps(self, assessment: ComplianceAssessment) -> List[GapAnalysis]:
        """Perform AI-powered gap analysis based on answers"""
        gaps = []
        
        if assessment.framework == ComplianceFramework.SOC2_TYPE_I:
            gaps.extend(self._analyze_soc2_gaps(assessment))
        elif assessment.framework == ComplianceFramework.GDPR:
            gaps.extend(self._analyze_gdpr_gaps(assessment))
        elif assessment.framework == ComplianceFramework.HIPAA:
            gaps.extend(self._analyze_hipaa_gaps(assessment))
        
        # Sort gaps by priority
        gaps.sort(key=lambda x: x.priority, reverse=True)
        assessment.gaps = gaps
        
        return gaps
    
    def _analyze_soc2_gaps(self, assessment: ComplianceAssessment) -> List[GapAnalysis]:
        """Analyze SOC 2 compliance gaps"""
        gaps = []
        answers_dict = {a.question_id: a.value for a in assessment.answers}
        
        # Access Control Gap Analysis
        if not answers_dict.get("soc2_s1_access_control", False):
            gaps.append(GapAnalysis(
                control_id="CC6.1",
                control_name="Access Control Policies",
                framework=ComplianceFramework.SOC2_TYPE_I,
                current_state="No documented access control policies",
                required_state="Formal access provisioning/deprovisioning procedures",
                risk_level=RiskLevel.CRITICAL,
                estimated_effort="2-4 weeks",
                priority=10,
                recommendations=[
                    "Document user access provisioning procedures",
                    "Implement access request workflow",
                    "Create deprovisioning checklist",
                    "Establish periodic access reviews"
                ],
                cost_estimate="$5,000 - $15,000"
            ))
        
        # MFA Gap Analysis
        mfa_coverage = answers_dict.get("soc2_s2_mfa", "0%")
        if mfa_coverage in ["0%", "25%", "50%"]:
            risk_level = RiskLevel.CRITICAL if mfa_coverage == "0%" else RiskLevel.HIGH
            gaps.append(GapAnalysis(
                control_id="CC6.1",
                control_name="Multi-Factor Authentication",
                framework=ComplianceFramework.SOC2_TYPE_I,
                current_state=f"MFA enabled for {mfa_coverage} of systems",
                required_state="MFA required for all critical systems (minimum 90%)",
                risk_level=risk_level,
                estimated_effort="1-2 months",
                priority=9,
                recommendations=[
                    "Implement SSO with MFA enforcement",
                    "Enable MFA for all administrative accounts",
                    "Configure conditional access policies",
                    "Provide MFA training to users"
                ],
                cost_estimate="$10,000 - $25,000"
            ))
        
        # Monitoring Gap Analysis
        if not answers_dict.get("soc2_s4_monitoring", False):
            gaps.append(GapAnalysis(
                control_id="CC7.1",
                control_name="Security Monitoring",
                framework=ComplianceFramework.SOC2_TYPE_I,
                current_state="No automated security monitoring",
                required_state="24/7 security monitoring and alerting",
                risk_level=RiskLevel.HIGH,
                estimated_effort="1-3 months",
                priority=8,
                recommendations=[
                    "Implement SIEM solution",
                    "Configure security event alerting",
                    "Establish incident response procedures",
                    "Set up log aggregation and analysis"
                ],
                cost_estimate="$15,000 - $50,000"
            ))
        
        return gaps
    
    def _analyze_gdpr_gaps(self, assessment: ComplianceAssessment) -> List[GapAnalysis]:
        """Analyze GDPR compliance gaps"""
        gaps = []
        answers_dict = {a.question_id: a.value for a in assessment.answers}
        
        # DPO Gap Analysis
        if not answers_dict.get("gdpr_1_dpo", False):
            gaps.append(GapAnalysis(
                control_id="Article 37",
                control_name="Data Protection Officer",
                framework=ComplianceFramework.GDPR,
                current_state="No designated DPO",
                required_state="Qualified DPO appointed and operational",
                risk_level=RiskLevel.HIGH,
                estimated_effort="2-4 weeks",
                priority=8,
                recommendations=[
                    "Appoint qualified DPO (internal or external)",
                    "Provide DPO with necessary resources",
                    "Establish DPO independence",
                    "Integrate DPO into decision-making processes"
                ],
                cost_estimate="$30,000 - $100,000 annually"
            ))
        
        # Consent Mechanism Gap
        if answers_dict.get("gdpr_3_consent_mechanism") == "No mechanism available":
            gaps.append(GapAnalysis(
                control_id="Article 7",
                control_name="Consent Withdrawal",
                framework=ComplianceFramework.GDPR,
                current_state="No consent withdrawal mechanism",
                required_state="Easy consent withdrawal as easy as giving consent",
                risk_level=RiskLevel.CRITICAL,
                estimated_effort="2-6 weeks",
                priority=10,
                recommendations=[
                    "Implement self-service consent management",
                    "Provide clear consent withdrawal options",
                    "Automate consent status tracking",
                    "Update privacy notices with withdrawal instructions"
                ],
                cost_estimate="$8,000 - $20,000"
            ))
        
        return gaps
    
    def _analyze_hipaa_gaps(self, assessment: ComplianceAssessment) -> List[GapAnalysis]:
        """Analyze HIPAA compliance gaps"""
        gaps = []
        answers_dict = {a.question_id: a.value for a in assessment.answers}
        
        # BAA Gap Analysis
        if not answers_dict.get("hipaa_1_baa", False):
            gaps.append(GapAnalysis(
                control_id="§164.308(b)",
                control_name="Business Associate Agreements",
                framework=ComplianceFramework.HIPAA,
                current_state="Missing BAAs with vendors",
                required_state="Signed BAAs with all PHI-handling vendors",
                risk_level=RiskLevel.CRITICAL,
                estimated_effort="1-2 months",
                priority=10,
                recommendations=[
                    "Inventory all vendors handling PHI",
                    "Execute BAAs with all business associates",
                    "Review and update existing BAAs",
                    "Establish BAA management process"
                ],
                cost_estimate="$5,000 - $15,000"
            ))
        
        # Encryption Gap Analysis
        if not answers_dict.get("hipaa_3_encryption", False):
            gaps.append(GapAnalysis(
                control_id="§164.312(a)(2)(iv)",
                control_name="Encryption and Decryption",
                framework=ComplianceFramework.HIPAA,
                current_state="PHI not fully encrypted",
                required_state="All PHI encrypted at rest and in transit",
                risk_level=RiskLevel.CRITICAL,
                estimated_effort="1-3 months",
                priority=9,
                recommendations=[
                    "Implement database encryption",
                    "Enable TLS for all data transmission",
                    "Encrypt backup files",
                    "Implement key management system"
                ],
                cost_estimate="$10,000 - $30,000"
            ))
        
        return gaps
    
    def calculate_compliance_score(self, assessment: ComplianceAssessment) -> float:
        """Calculate overall compliance score (0-100)"""
        if not assessment.answers:
            return 0.0
        
        total_questions = len(assessment.questions)
        answered_questions = len(assessment.answers)
        
        # Completion score (0-30 points)
        completion_score = (answered_questions / total_questions) * 30
        
        # Compliance score based on answers (0-70 points)
        compliance_points = 0
        for answer in assessment.answers:
            question = next((q for q in assessment.questions if q.id == answer.question_id), None)
            if question:
                if question.question_type == QuestionType.BOOLEAN:
                    compliance_points += 70 / total_questions if answer.value else 0
                elif question.question_type == QuestionType.SCALE:
                    # Scale questions: award points based on answer index
                    if isinstance(answer.value, str) and answer.value in question.options:
                        scale_value = question.options.index(answer.value) + 1
                        max_scale = len(question.options)
                        compliance_points += (scale_value / max_scale) * (70 / total_questions)
                elif question.question_type == QuestionType.CHECKLIST:
                    # Checklist: award points based on number of items selected
                    if isinstance(answer.value, list):
                        checklist_score = len(answer.value) / len(question.options)
                        compliance_points += checklist_score * (70 / total_questions)
        
        overall_score = completion_score + compliance_points
        assessment.overall_score = min(100.0, overall_score)
        
        return assessment.overall_score
    
    def generate_compliance_roadmap(self, assessment: ComplianceAssessment) -> Dict[str, any]:
        """Generate AI-powered compliance roadmap"""
        gaps = self.analyze_compliance_gaps(assessment)
        score = self.calculate_compliance_score(assessment)
        
        # Categorize gaps by timeline
        immediate_actions = [g for g in gaps if g.priority >= 8]
        short_term_actions = [g for g in gaps if 5 <= g.priority < 8]
        long_term_actions = [g for g in gaps if g.priority < 5]
        
        # Calculate estimated timeline to compliance
        critical_gaps = [g for g in gaps if g.risk_level == RiskLevel.CRITICAL]
        if critical_gaps:
            timeline = "6-12 months (critical gaps must be addressed)"
        elif len(gaps) > 10:
            timeline = "3-6 months (multiple gaps to address)"
        elif len(gaps) > 5:
            timeline = "2-3 months (several improvements needed)"
        else:
            timeline = "1-2 months (minor adjustments required)"
        
        assessment.completion_timeline = timeline
        
        # Trust score impact
        assessment.trust_score_impact = int(score / 10)  # 0-10 trust score points
        
        return {
            "current_score": score,
            "target_score": 85.0,  # Industry standard for compliance
            "completion_timeline": timeline,
            "trust_score_impact": assessment.trust_score_impact,
            "immediate_actions": [
                {
                    "control": gap.control_name,
                    "risk_level": gap.risk_level.value,
                    "effort": gap.estimated_effort,
                    "cost": gap.cost_estimate,
                    "recommendations": gap.recommendations
                }
                for gap in immediate_actions
            ],
            "short_term_actions": [
                {
                    "control": gap.control_name,
                    "effort": gap.estimated_effort,
                    "cost": gap.cost_estimate
                }
                for gap in short_term_actions
            ],
            "long_term_actions": [
                {
                    "control": gap.control_name,
                    "effort": gap.estimated_effort
                }
                for gap in long_term_actions
            ],
            "total_investment_estimate": self._calculate_total_investment(gaps),
            "roi_projection": {
                "annual_compliance_costs_avoided": "$50,000 - $200,000",
                "audit_time_savings": "60-80% reduction",
                "security_incident_risk_reduction": "70-90%",
                "trust_score_improvement": f"+{assessment.trust_score_impact} points"
            }
        }
    
    def _calculate_total_investment(self, gaps: List[GapAnalysis]) -> str:
        """Calculate total estimated investment for compliance"""
        # Simple calculation based on number and severity of gaps
        total_gaps = len(gaps)
        critical_gaps = len([g for g in gaps if g.risk_level == RiskLevel.CRITICAL])
        high_gaps = len([g for g in gaps if g.risk_level == RiskLevel.HIGH])
        
        base_cost = 10000  # Base implementation cost
        critical_cost = critical_gaps * 15000
        high_cost = high_gaps * 8000
        medium_cost = (total_gaps - critical_gaps - high_gaps) * 3000
        
        total_min = base_cost + critical_cost + high_cost + medium_cost
        total_max = int(total_min * 1.5)  # Add 50% buffer
        
        return f"${total_min:,} - ${total_max:,}"
    
    def export_assessment_report(self, assessment: ComplianceAssessment) -> str:
        """Export comprehensive assessment report"""
        roadmap = self.generate_compliance_roadmap(assessment)
        
        report = {
            "assessment_summary": {
                "organization_id": assessment.organization_id,
                "framework": assessment.framework.value,
                "assessment_date": assessment.assessment_date.isoformat(),
                "overall_score": assessment.overall_score,
                "completion_timeline": assessment.completion_timeline,
                "trust_score_impact": assessment.trust_score_impact
            },
            "gap_analysis": [
                {
                    "control_id": gap.control_id,
                    "control_name": gap.control_name,
                    "current_state": gap.current_state,
                    "required_state": gap.required_state,
                    "risk_level": gap.risk_level.value,
                    "estimated_effort": gap.estimated_effort,
                    "priority": gap.priority,
                    "recommendations": gap.recommendations,
                    "cost_estimate": gap.cost_estimate
                }
                for gap in assessment.gaps
            ],
            "compliance_roadmap": roadmap,
            "questions_and_answers": [
                {
                    "question_id": answer.question_id,
                    "question": next((q.question for q in assessment.questions if q.id == answer.question_id), ""),
                    "answer": answer.value,
                    "notes": answer.notes
                }
                for answer in assessment.answers
            ]
        }
        
        return json.dumps(report, indent=2, default=str)

# Demo usage showing immediate value without integrations
def demo_compliance_questionnaire():
    """Demonstrate the questionnaire providing immediate value"""
    questionnaire = ComplianceQuestionnaire()
    
    # Start SOC 2 assessment for demo organization
    assessment = questionnaire.start_assessment("demo_org_001", ComplianceFramework.SOC2_TYPE_I)
    
    # Simulate answering questions (would come from user input)
    demo_answers = {
        "soc2_s1_access_control": False,
        "soc2_s2_mfa": "25%",
        "soc2_s3_encryption": ["Data in transit encryption", "Database encryption"],
        "soc2_s4_monitoring": False,
        "soc2_s5_incident_response": "Within 1 week",
        "soc2_a1_backup": "Semi-annually",
        "soc2_a2_uptime": "99%",
        "soc2_p1_data_validation": True,
        "soc2_c1_data_classification": False,
        "soc2_pr1_privacy_notice": True
    }
    
    for question_id, answer_value in demo_answers.items():
        questionnaire.answer_question(assessment, question_id, answer_value)
    
    # Generate comprehensive analysis
    roadmap = questionnaire.generate_compliance_roadmap(assessment)
    
    print("=== VELOCITY.AI COMPLIANCE ASSESSMENT RESULTS ===")
    print(f"Overall Compliance Score: {assessment.overall_score:.1f}/100")
    print(f"Time to Compliance: {assessment.completion_timeline}")
    print(f"Trust Score Impact: +{assessment.trust_score_impact} points")
    print(f"Total Investment Estimate: {roadmap['total_investment_estimate']}")
    
    print("\n=== IMMEDIATE ACTION ITEMS ===")
    for action in roadmap['immediate_actions'][:3]:
        print(f"• {action['control']} ({action['risk_level']}) - {action['effort']}")
        print(f"  Cost: {action['cost']}")
        print(f"  Key Actions: {', '.join(action['recommendations'][:2])}")
        print()
    
    return assessment, roadmap

if __name__ == "__main__":
    demo_compliance_questionnaire()