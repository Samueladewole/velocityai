"""
Assessment Management Module for Velocity AI Platform
Handles compliance assessments, gap analysis, and reporting
"""

import uuid
import json
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
import logging
from enum import Enum

from models import (
    Framework, Organization, User, Agent, EvidenceItem, TrustScore,
    AgentStatus, EvidenceStatus, EvidenceType, Base
)
from database import SessionLocal
from validation import VelocityException

logger = logging.getLogger(__name__)

class AssessmentStatus(Enum):
    """Assessment status enumeration"""
    DRAFT = "draft"
    IN_PROGRESS = "in_progress" 
    COMPLETED = "completed"
    FAILED = "failed"
    ARCHIVED = "archived"

class AssessmentType(Enum):
    """Assessment type enumeration"""
    INITIAL = "initial"
    PERIODIC = "periodic"
    PRE_AUDIT = "pre_audit"
    POST_INCIDENT = "post_incident"
    CUSTOM = "custom"

class GapSeverity(Enum):
    """Gap severity levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

# Assessment Configuration
ASSESSMENT_CONFIG = {
    "frameworks": {
        Framework.SOC2: {
            "total_controls": 64,
            "control_families": ["CC", "A", "C", "P", "PI"],
            "mandatory_evidence": ["access_logs", "policies", "procedures", "reviews"],
            "risk_areas": ["access_control", "system_operations", "change_management", "risk_mitigation", "monitoring"],
            "assessment_frequency": 365,  # days
            "critical_controls": ["CC6.1", "CC6.2", "CC7.1", "CC7.2"]
        },
        Framework.ISO27001: {
            "total_controls": 93,
            "control_families": ["A.5", "A.6", "A.7", "A.8", "A.9", "A.10", "A.11", "A.12", "A.13", "A.14", "A.15", "A.16", "A.17", "A.18"],
            "mandatory_evidence": ["isms_policy", "risk_register", "soa", "management_review"],
            "risk_areas": ["information_security_policies", "organization_security", "human_resource_security", "asset_management", "access_control"],
            "assessment_frequency": 365,
            "critical_controls": ["A.5.1.1", "A.6.1.1", "A.8.1.1", "A.9.1.1"]
        },
        Framework.GDPR: {
            "total_controls": 99,
            "control_families": ["Art.5", "Art.6", "Art.7", "Art.12-23", "Art.24-43", "Art.44-50"],
            "mandatory_evidence": ["privacy_notices", "consent_records", "dpia", "data_inventory"],
            "risk_areas": ["lawfulness", "transparency", "data_minimization", "accuracy", "storage_limitation", "security"],
            "assessment_frequency": 180,
            "critical_controls": ["Art.5", "Art.6", "Art.32", "Art.33"]
        },
        Framework.HIPAA: {
            "total_controls": 54,
            "control_families": ["Administrative", "Physical", "Technical", "Organizational"],
            "mandatory_evidence": ["risk_assessment", "workforce_training", "access_logs", "encryption_keys"],
            "risk_areas": ["administrative_safeguards", "physical_safeguards", "technical_safeguards", "breach_notification"],
            "assessment_frequency": 365,
            "critical_controls": ["164.308(a)(1)", "164.310(a)(1)", "164.312(a)(1)"]
        },
        Framework.CIS_CONTROLS: {
            "total_controls": 153,
            "control_families": ["IG1", "IG2", "IG3"],
            "mandatory_evidence": ["asset_inventory", "software_inventory", "configuration_standards", "vulnerability_scans"],
            "risk_areas": ["inventory_control", "configuration_management", "vulnerability_management", "access_control", "monitoring"],
            "assessment_frequency": 90,
            "critical_controls": ["CIS-1.1", "CIS-2.1", "CIS-4.1", "CIS-5.1"]
        }
    }
}

class AssessmentManager:
    """Manages compliance assessments and gap analysis"""
    
    def __init__(self):
        self.config = ASSESSMENT_CONFIG
        
    def create_assessment(
        self,
        db: Session,
        organization_id: str,
        user_id: str,
        framework: Framework,
        assessment_type: AssessmentType = AssessmentType.INITIAL,
        name: Optional[str] = None,
        description: Optional[str] = None,
        scope: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create a new compliance assessment"""
        try:
            assessment_id = str(uuid.uuid4())
            framework_config = self.config["frameworks"].get(framework, {})
            
            # Generate assessment name if not provided
            if not name:
                timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d")
                name = f"{framework.value.upper()} {assessment_type.value.title()} Assessment - {timestamp}"
            
            assessment_data = {
                "id": assessment_id,
                "name": name,
                "description": description or f"Automated {framework.value} compliance assessment",
                "framework": framework.value,
                "assessment_type": assessment_type.value,
                "status": AssessmentStatus.DRAFT.value,
                "organization_id": organization_id,
                "created_by": user_id,
                "scope": scope or {
                    "include_all_systems": True,
                    "control_families": framework_config.get("control_families", []),
                    "risk_areas": framework_config.get("risk_areas", [])
                },
                "metadata": {
                    "total_controls": framework_config.get("total_controls", 0),
                    "mandatory_evidence": framework_config.get("mandatory_evidence", []),
                    "critical_controls": framework_config.get("critical_controls", []),
                    "assessment_frequency": framework_config.get("assessment_frequency", 365)
                },
                "progress": {
                    "controls_assessed": 0,
                    "evidence_collected": 0,
                    "gaps_identified": 0,
                    "completion_percentage": 0.0
                },
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "due_date": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
                "estimated_completion": None
            }
            
            # Store assessment data
            self._store_assessment(assessment_data)
            
            logger.info(f"Created assessment {assessment_id} for framework {framework.value}")
            
            return {
                "assessment_id": assessment_id,
                "name": name,
                "framework": framework.value,
                "status": AssessmentStatus.DRAFT.value,
                "total_controls": framework_config.get("total_controls", 0),
                "due_date": assessment_data["due_date"],
                "message": "Assessment created successfully"
            }
            
        except Exception as e:
            logger.error(f"Error creating assessment: {e}")
            raise VelocityException(f"Failed to create assessment: {str(e)}")
    
    def start_assessment(
        self,
        db: Session,
        assessment_id: str,
        user_id: str
    ) -> Dict[str, Any]:
        """Start an assessment and begin automated data collection"""
        try:
            assessment = self._get_assessment(assessment_id)
            if not assessment:
                raise VelocityException(f"Assessment not found: {assessment_id}")
            
            if assessment["status"] != AssessmentStatus.DRAFT.value:
                raise VelocityException(f"Assessment is not in draft status: {assessment['status']}")
            
            framework = Framework(assessment["framework"])
            organization_id = assessment["organization_id"]
            
            # Update status
            assessment["status"] = AssessmentStatus.IN_PROGRESS.value
            assessment["started_at"] = datetime.now(timezone.utc).isoformat()
            assessment["started_by"] = user_id
            
            # Initialize assessment data collection
            collection_results = self._initialize_data_collection(db, assessment_id, framework, organization_id)
            
            # Update progress
            assessment["progress"]["data_collection_started"] = True
            assessment["progress"]["last_updated"] = datetime.now(timezone.utc).isoformat()
            
            # Store updated assessment
            self._store_assessment(assessment)
            
            logger.info(f"Started assessment {assessment_id}")
            
            return {
                "assessment_id": assessment_id,
                "status": AssessmentStatus.IN_PROGRESS.value,
                "started_at": assessment["started_at"],
                "collection_results": collection_results,
                "message": "Assessment started successfully"
            }
            
        except Exception as e:
            logger.error(f"Error starting assessment: {e}")
            raise VelocityException(f"Failed to start assessment: {str(e)}")
    
    def perform_gap_analysis(
        self,
        db: Session,
        assessment_id: str,
        include_recommendations: bool = True
    ) -> Dict[str, Any]:
        """Perform comprehensive gap analysis for an assessment"""
        try:
            assessment = self._get_assessment(assessment_id)
            if not assessment:
                raise VelocityException(f"Assessment not found: {assessment_id}")
            
            framework = Framework(assessment["framework"])
            organization_id = assessment["organization_id"]
            framework_config = self.config["frameworks"].get(framework, {})
            
            # Get current evidence and controls
            evidence_items = db.query(EvidenceItem).filter(
                and_(
                    EvidenceItem.organization_id == organization_id,
                    EvidenceItem.framework == framework
                )
            ).all()
            
            # Analyze gaps
            gaps = self._analyze_compliance_gaps(
                evidence_items,
                framework_config,
                assessment["scope"]
            )
            
            # Calculate risk scores
            risk_analysis = self._calculate_risk_scores(gaps, framework_config)
            
            # Generate recommendations if requested
            recommendations = []
            if include_recommendations:
                recommendations = self._generate_recommendations(gaps, framework_config)
            
            # Calculate overall compliance score
            total_controls = framework_config.get("total_controls", 0)
            covered_controls = len([e for e in evidence_items if e.status == EvidenceStatus.VERIFIED])
            compliance_score = (covered_controls / total_controls * 100) if total_controls > 0 else 0
            
            gap_analysis = {
                "assessment_id": assessment_id,
                "framework": framework.value,
                "analysis_date": datetime.now(timezone.utc).isoformat(),
                "compliance_score": round(compliance_score, 2),
                "total_controls": total_controls,
                "covered_controls": covered_controls,
                "gap_summary": {
                    "total_gaps": len(gaps),
                    "critical": len([g for g in gaps if g["severity"] == GapSeverity.CRITICAL.value]),
                    "high": len([g for g in gaps if g["severity"] == GapSeverity.HIGH.value]),
                    "medium": len([g for g in gaps if g["severity"] == GapSeverity.MEDIUM.value]),
                    "low": len([g for g in gaps if g["severity"] == GapSeverity.LOW.value])
                },
                "gaps": gaps,
                "risk_analysis": risk_analysis,
                "recommendations": recommendations,
                "next_assessment_due": (
                    datetime.now(timezone.utc) + 
                    timedelta(days=framework_config.get("assessment_frequency", 365))
                ).isoformat()
            }
            
            # Update assessment with gap analysis results
            assessment["gap_analysis"] = gap_analysis
            assessment["progress"]["gap_analysis_completed"] = True
            assessment["progress"]["completion_percentage"] = min(90.0, compliance_score)
            assessment["updated_at"] = datetime.now(timezone.utc).isoformat()
            
            self._store_assessment(assessment)
            
            logger.info(f"Completed gap analysis for assessment {assessment_id}")
            
            return gap_analysis
            
        except Exception as e:
            logger.error(f"Error performing gap analysis: {e}")
            raise VelocityException(f"Failed to perform gap analysis: {str(e)}")
    
    def generate_assessment_report(
        self,
        db: Session,
        assessment_id: str,
        report_format: str = "json",
        include_evidence: bool = False
    ) -> Dict[str, Any]:
        """Generate comprehensive assessment report"""
        try:
            assessment = self._get_assessment(assessment_id)
            if not assessment:
                raise VelocityException(f"Assessment not found: {assessment_id}")
            
            framework = Framework(assessment["framework"])
            organization_id = assessment["organization_id"]
            
            # Get organization details
            org = db.query(Organization).filter(Organization.id == organization_id).first()
            org_name = org.name if org else "Unknown Organization"
            
            # Build comprehensive report
            report = {
                "report_metadata": {
                    "report_id": str(uuid.uuid4()),
                    "assessment_id": assessment_id,
                    "generated_at": datetime.now(timezone.utc).isoformat(),
                    "format": report_format,
                    "organization": org_name,
                    "framework": framework.value
                },
                "executive_summary": self._generate_executive_summary(assessment),
                "assessment_details": {
                    "name": assessment["name"],
                    "description": assessment["description"],
                    "type": assessment["assessment_type"],
                    "scope": assessment["scope"],
                    "duration": self._calculate_assessment_duration(assessment),
                    "assessor": assessment.get("created_by", "System"),
                    "status": assessment["status"]
                },
                "compliance_status": self._generate_compliance_status(assessment),
                "gap_analysis": assessment.get("gap_analysis", {}),
                "recommendations": self._prioritize_recommendations(assessment),
                "action_plan": self._generate_action_plan(assessment),
                "appendices": {
                    "control_details": self._generate_control_details(db, assessment),
                    "evidence_summary": self._generate_evidence_summary(db, assessment) if include_evidence else {},
                    "methodology": self._get_assessment_methodology(framework)
                }
            }
            
            # Mark assessment as completed if not already
            if assessment["status"] == AssessmentStatus.IN_PROGRESS.value:
                assessment["status"] = AssessmentStatus.COMPLETED.value
                assessment["completed_at"] = datetime.now(timezone.utc).isoformat()
                assessment["progress"]["completion_percentage"] = 100.0
                self._store_assessment(assessment)
            
            logger.info(f"Generated assessment report for {assessment_id}")
            
            return report
            
        except Exception as e:
            logger.error(f"Error generating assessment report: {e}")
            raise VelocityException(f"Failed to generate assessment report: {str(e)}")
    
    def list_assessments(
        self,
        organization_id: str,
        framework: Optional[Framework] = None,
        status: Optional[AssessmentStatus] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Dict[str, Any]:
        """List assessments for an organization"""
        try:
            # Get assessments from storage (implement based on your storage strategy)
            assessments = self._list_assessments_from_storage(
                organization_id, framework, status, limit, offset
            )
            
            return {
                "assessments": assessments,
                "total": len(assessments),
                "limit": limit,
                "offset": offset
            }
            
        except Exception as e:
            logger.error(f"Error listing assessments: {e}")
            raise VelocityException(f"Failed to list assessments: {str(e)}")
    
    def get_assessment_status(
        self,
        assessment_id: str
    ) -> Dict[str, Any]:
        """Get current status of an assessment"""
        try:
            assessment = self._get_assessment(assessment_id)
            if not assessment:
                raise VelocityException(f"Assessment not found: {assessment_id}")
            
            return {
                "assessment_id": assessment_id,
                "name": assessment["name"],
                "framework": assessment["framework"],
                "status": assessment["status"],
                "progress": assessment["progress"],
                "created_at": assessment["created_at"],
                "updated_at": assessment["updated_at"],
                "due_date": assessment.get("due_date"),
                "estimated_completion": assessment.get("estimated_completion")
            }
            
        except Exception as e:
            logger.error(f"Error getting assessment status: {e}")
            raise VelocityException(f"Failed to get assessment status: {str(e)}")
    
    # Helper methods
    def _initialize_data_collection(
        self,
        db: Session,
        assessment_id: str,
        framework: Framework,
        organization_id: str
    ) -> Dict[str, Any]:
        """Initialize data collection for assessment"""
        try:
            # Get existing evidence
            evidence_count = db.query(EvidenceItem).filter(
                and_(
                    EvidenceItem.organization_id == organization_id,
                    EvidenceItem.framework == framework
                )
            ).count()
            
            # Get active agents
            agent_count = db.query(Agent).filter(
                and_(
                    Agent.organization_id == organization_id,
                    Agent.framework == framework,
                    Agent.status == AgentStatus.ACTIVE
                )
            ).count()
            
            return {
                "existing_evidence": evidence_count,
                "active_agents": agent_count,
                "collection_started": True
            }
            
        except Exception as e:
            logger.warning(f"Error initializing data collection: {e}")
            return {"collection_started": False, "error": str(e)}
    
    def _analyze_compliance_gaps(
        self,
        evidence_items: List[EvidenceItem],
        framework_config: Dict[str, Any],
        scope: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Analyze compliance gaps based on evidence"""
        gaps = []
        
        # Get required controls
        total_controls = framework_config.get("total_controls", 0)
        critical_controls = framework_config.get("critical_controls", [])
        mandatory_evidence = framework_config.get("mandatory_evidence", [])
        
        # Check for missing evidence types
        existing_evidence_types = set([item.evidence_type.value for item in evidence_items])
        
        for required_evidence in mandatory_evidence:
            if required_evidence not in existing_evidence_types:
                gaps.append({
                    "gap_id": str(uuid.uuid4()),
                    "type": "missing_evidence",
                    "category": required_evidence,
                    "severity": GapSeverity.HIGH.value,
                    "description": f"Missing required evidence type: {required_evidence}",
                    "impact": "High - Required for compliance",
                    "effort": "Medium",
                    "timeline": "2-4 weeks"
                })
        
        # Check for expired evidence
        for item in evidence_items:
            if item.expires_at and item.expires_at < datetime.now(timezone.utc):
                gaps.append({
                    "gap_id": str(uuid.uuid4()),
                    "type": "expired_evidence",
                    "category": item.control_id,
                    "severity": GapSeverity.MEDIUM.value,
                    "description": f"Evidence expired for control {item.control_id}",
                    "impact": "Medium - Evidence needs refresh",
                    "effort": "Low",
                    "timeline": "1-2 weeks"
                })
        
        # Check for low confidence evidence
        low_confidence_items = [item for item in evidence_items if item.confidence_score < 0.7]
        for item in low_confidence_items:
            gaps.append({
                "gap_id": str(uuid.uuid4()),
                "type": "low_confidence",
                "category": item.control_id,
                "severity": GapSeverity.MEDIUM.value,
                "description": f"Low confidence evidence for control {item.control_id}",
                "impact": "Medium - May require manual review",
                "effort": "Low",
                "timeline": "1 week"
            })
        
        return gaps
    
    def _calculate_risk_scores(
        self,
        gaps: List[Dict[str, Any]],
        framework_config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Calculate risk scores based on gaps"""
        severity_weights = {
            GapSeverity.CRITICAL.value: 4,
            GapSeverity.HIGH.value: 3,
            GapSeverity.MEDIUM.value: 2,
            GapSeverity.LOW.value: 1
        }
        
        total_risk_score = sum(severity_weights.get(gap["severity"], 0) for gap in gaps)
        max_possible_score = len(gaps) * 4 if gaps else 1
        
        risk_percentage = (total_risk_score / max_possible_score) * 100
        
        return {
            "overall_risk_score": total_risk_score,
            "risk_percentage": round(risk_percentage, 2),
            "risk_level": "Critical" if risk_percentage > 75 else "High" if risk_percentage > 50 else "Medium" if risk_percentage > 25 else "Low",
            "severity_breakdown": {
                "critical": len([g for g in gaps if g["severity"] == GapSeverity.CRITICAL.value]),
                "high": len([g for g in gaps if g["severity"] == GapSeverity.HIGH.value]),
                "medium": len([g for g in gaps if g["severity"] == GapSeverity.MEDIUM.value]),
                "low": len([g for g in gaps if g["severity"] == GapSeverity.LOW.value])
            }
        }
    
    def _generate_recommendations(
        self,
        gaps: List[Dict[str, Any]],
        framework_config: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Generate recommendations based on gaps"""
        recommendations = []
        
        # Group gaps by category
        gap_categories = {}
        for gap in gaps:
            category = gap["category"]
            if category not in gap_categories:
                gap_categories[category] = []
            gap_categories[category].append(gap)
        
        # Generate recommendations for each category
        for category, category_gaps in gap_categories.items():
            high_severity_gaps = [g for g in category_gaps if g["severity"] in [GapSeverity.CRITICAL.value, GapSeverity.HIGH.value]]
            
            if high_severity_gaps:
                recommendations.append({
                    "recommendation_id": str(uuid.uuid4()),
                    "category": category,
                    "priority": "High",
                    "title": f"Address {category} compliance gaps",
                    "description": f"Resolve {len(high_severity_gaps)} high/critical severity gaps in {category}",
                    "actions": [
                        f"Review and update {category} procedures",
                        f"Collect missing evidence for {category}",
                        f"Implement automated monitoring for {category}"
                    ],
                    "estimated_effort": "Medium",
                    "timeline": "2-4 weeks",
                    "impact": "High",
                    "related_gaps": [g["gap_id"] for g in high_severity_gaps]
                })
        
        return recommendations
    
    def _generate_executive_summary(self, assessment: Dict[str, Any]) -> Dict[str, Any]:
        """Generate executive summary for assessment"""
        gap_analysis = assessment.get("gap_analysis", {})
        compliance_score = gap_analysis.get("compliance_score", 0)
        
        return {
            "assessment_name": assessment["name"],
            "framework": assessment["framework"],
            "compliance_score": compliance_score,
            "status": "Compliant" if compliance_score >= 80 else "Partially Compliant" if compliance_score >= 60 else "Non-Compliant",
            "key_findings": [
                f"Overall compliance score: {compliance_score}%",
                f"Total gaps identified: {gap_analysis.get('gap_summary', {}).get('total_gaps', 0)}",
                f"Critical issues: {gap_analysis.get('gap_summary', {}).get('critical', 0)}"
            ],
            "recommendations_summary": f"{len(gap_analysis.get('recommendations', []))} recommendations for improvement"
        }
    
    def _generate_compliance_status(self, assessment: Dict[str, Any]) -> Dict[str, Any]:
        """Generate compliance status section"""
        gap_analysis = assessment.get("gap_analysis", {})
        
        return {
            "overall_score": gap_analysis.get("compliance_score", 0),
            "total_controls": gap_analysis.get("total_controls", 0),
            "covered_controls": gap_analysis.get("covered_controls", 0),
            "gap_summary": gap_analysis.get("gap_summary", {}),
            "risk_level": gap_analysis.get("risk_analysis", {}).get("risk_level", "Unknown")
        }
    
    # Storage methods (implement based on your storage strategy)
    def _store_assessment(self, assessment_data: Dict[str, Any]):
        """Store assessment data"""
        # Implement storage (database, Redis, etc.)
        pass
    
    def _get_assessment(self, assessment_id: str) -> Optional[Dict[str, Any]]:
        """Get assessment data"""
        # Implement retrieval
        return None
    
    def _list_assessments_from_storage(
        self,
        organization_id: str,
        framework: Optional[Framework],
        status: Optional[AssessmentStatus],
        limit: int,
        offset: int
    ) -> List[Dict[str, Any]]:
        """List assessments from storage"""
        # Implement assessment listing
        return []
    
    def _calculate_assessment_duration(self, assessment: Dict[str, Any]) -> str:
        """Calculate assessment duration"""
        if "started_at" in assessment and "completed_at" in assessment:
            start = datetime.fromisoformat(assessment["started_at"].replace('Z', '+00:00'))
            end = datetime.fromisoformat(assessment["completed_at"].replace('Z', '+00:00'))
            duration = end - start
            return f"{duration.days} days, {duration.seconds // 3600} hours"
        return "In progress"
    
    def _prioritize_recommendations(self, assessment: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Prioritize recommendations by impact and effort"""
        recommendations = assessment.get("gap_analysis", {}).get("recommendations", [])
        
        # Sort by priority: High > Medium > Low
        priority_order = {"High": 3, "Medium": 2, "Low": 1}
        return sorted(recommendations, key=lambda x: priority_order.get(x.get("priority", "Low"), 0), reverse=True)
    
    def _generate_action_plan(self, assessment: Dict[str, Any]) -> Dict[str, Any]:
        """Generate action plan based on recommendations"""
        recommendations = self._prioritize_recommendations(assessment)
        
        return {
            "immediate_actions": [r for r in recommendations[:3] if r.get("priority") == "High"],
            "short_term_actions": [r for r in recommendations if r.get("timeline", "").startswith("1-2")],
            "long_term_actions": [r for r in recommendations if "month" in r.get("timeline", "").lower()],
            "total_estimated_effort": "To be calculated based on specific recommendations"
        }
    
    def _generate_control_details(self, db: Session, assessment: Dict[str, Any]) -> Dict[str, Any]:
        """Generate detailed control analysis"""
        return {
            "control_summary": "Detailed control analysis",
            "implementation_status": {},
            "evidence_mapping": {}
        }
    
    def _generate_evidence_summary(self, db: Session, assessment: Dict[str, Any]) -> Dict[str, Any]:
        """Generate evidence summary"""
        return {
            "total_evidence_items": 0,
            "evidence_by_type": {},
            "evidence_freshness": {}
        }
    
    def _get_assessment_methodology(self, framework: Framework) -> Dict[str, Any]:
        """Get assessment methodology details"""
        return {
            "framework": framework.value,
            "approach": "Automated evidence collection with AI-powered gap analysis",
            "standards_referenced": f"{framework.value} official documentation",
            "tools_used": ["Velocity AI Platform", "Automated Evidence Collection", "Gap Analysis Engine"]
        }

# Global instance
assessment_manager = AssessmentManager()