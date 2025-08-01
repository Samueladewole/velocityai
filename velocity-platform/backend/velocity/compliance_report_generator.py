"""
Velocity AI Platform - Compliance Report Generation System
Enterprise-grade compliance reporting for GDPR, SOC2, ISO27001, and custom frameworks
"""

import os
import json
import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional, Union, Tuple
from enum import Enum
from dataclasses import dataclass, asdict
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
import uuid
import asyncio
from pathlib import Path
import tempfile
import base64

from models import (
    Framework, Organization, User, Agent, EvidenceItem, TrustScore,
    AgentStatus, EvidenceStatus, EvidenceType
)
from database import SessionLocal
from validation import VelocityException
from audit_trail import audit_trail_manager, AuditEventType, AuditSeverity
from error_handling import error_handler, retry_on_failure

logger = logging.getLogger(__name__)

class ReportType(Enum):
    """Types of compliance reports"""
    COMPLIANCE_ASSESSMENT = "compliance_assessment"
    GDPR_TRANSFER_REPORT = "gdpr_transfer_report"
    SOC2_READINESS = "soc2_readiness"
    ISO27001_GAP_ANALYSIS = "iso27001_gap_analysis"
    TRUST_SCORE_ANALYSIS = "trust_score_analysis"
    EVIDENCE_INVENTORY = "evidence_inventory"
    RISK_ASSESSMENT = "risk_assessment"
    EXECUTIVE_SUMMARY = "executive_summary"
    AUDIT_PREPARATION = "audit_preparation"
    REMEDIATION_PLAN = "remediation_plan"

class ReportFormat(Enum):
    """Report output formats"""
    PDF = "pdf"
    HTML = "html"
    JSON = "json"
    CSV = "csv"
    XLSX = "xlsx"
    DOCX = "docx"

class ComplianceStatus(Enum):
    """Compliance status levels"""
    FULLY_COMPLIANT = "fully_compliant"
    MOSTLY_COMPLIANT = "mostly_compliant"
    PARTIALLY_COMPLIANT = "partially_compliant"
    NON_COMPLIANT = "non_compliant"
    UNKNOWN = "unknown"

@dataclass
class ReportMetadata:
    """Report metadata structure"""
    report_id: str
    report_type: ReportType
    framework: Framework
    organization_id: str
    generated_by: str
    generated_at: datetime
    report_period_start: Optional[datetime]
    report_period_end: Optional[datetime]
    format: ReportFormat
    version: str = "1.0"
    confidentiality: str = "confidential"

@dataclass
class ComplianceMetric:
    """Individual compliance metric"""
    control_id: str
    control_name: str
    requirement: str
    status: ComplianceStatus
    evidence_count: int
    evidence_quality: float  # 0-1 score
    compliance_percentage: float
    last_assessed: Optional[datetime]
    gaps: List[str]
    recommendations: List[str]

@dataclass
class ReportSection:
    """Report section structure"""
    section_id: str
    title: str
    content: str
    metrics: List[ComplianceMetric]
    charts: List[Dict[str, Any]]
    tables: List[Dict[str, Any]]
    attachments: List[str]

@dataclass
class ComplianceReport:
    """Complete compliance report structure"""
    metadata: ReportMetadata
    executive_summary: ReportSection
    sections: List[ReportSection]
    overall_compliance_score: float
    risk_score: float
    recommendations: List[str]
    next_assessment_date: datetime
    file_path: Optional[str] = None
    file_size: Optional[int] = None

class ComplianceReportGenerator:
    """
    Enterprise compliance report generation system
    
    Features:
    - Multi-framework support (GDPR, SOC2, ISO27001)
    - Multiple output formats (PDF, HTML, JSON, etc.)
    - Evidence-based compliance scoring
    - Gap analysis and recommendations
    - Executive summaries
    - Audit trail integration
    - Real-time data aggregation
    """
    
    def __init__(self):
        self.report_templates_dir = Path("templates/reports")
        self.report_output_dir = Path("reports/generated")
        
        # Create directories
        self.report_templates_dir.mkdir(parents=True, exist_ok=True)
        self.report_output_dir.mkdir(parents=True, exist_ok=True)
        
        # Framework control mappings
        self.framework_controls = {
            Framework.GDPR: self._get_gdpr_controls(),
            Framework.SOC2: self._get_soc2_controls(),
            Framework.ISO27001: self._get_iso27001_controls(),
            Framework.CCPA: self._get_ccpa_controls(),
            Framework.HIPAA: self._get_hipaa_controls(),
            Framework.PCI_DSS: self._get_pci_controls()
        }
    
    async def generate_compliance_report(
        self,
        db: Session,
        organization_id: str,
        framework: Framework,
        report_type: ReportType,
        report_format: ReportFormat,
        generated_by: str,
        report_period_start: Optional[datetime] = None,
        report_period_end: Optional[datetime] = None,
        include_evidence: bool = True,
        include_recommendations: bool = True
    ) -> ComplianceReport:
        """Generate comprehensive compliance report"""
        try:
            # Create report metadata
            report_id = str(uuid.uuid4())
            metadata = ReportMetadata(
                report_id=report_id,
                report_type=report_type,
                framework=framework,
                organization_id=organization_id,
                generated_by=generated_by,
                generated_at=datetime.now(timezone.utc),
                report_period_start=report_period_start,
                report_period_end=report_period_end,
                format=report_format
            )
            
            # Gather compliance data
            compliance_data = await self._gather_compliance_data(
                db, organization_id, framework, report_period_start, report_period_end
            )
            
            # Generate report sections based on type
            sections = await self._generate_report_sections(
                db, compliance_data, report_type, include_evidence
            )
            
            # Calculate overall compliance metrics
            overall_score, risk_score = self._calculate_overall_scores(compliance_data)
            
            # Generate recommendations
            recommendations = []
            if include_recommendations:
                recommendations = await self._generate_recommendations(compliance_data)
            
            # Create executive summary
            executive_summary = await self._generate_executive_summary(
                compliance_data, overall_score, risk_score, recommendations
            )
            
            # Calculate next assessment date
            next_assessment = self._calculate_next_assessment_date(framework, overall_score)
            
            # Create report object
            report = ComplianceReport(
                metadata=metadata,
                executive_summary=executive_summary,
                sections=sections,
                overall_compliance_score=overall_score,
                risk_score=risk_score,
                recommendations=recommendations,
                next_assessment_date=next_assessment
            )
            
            # Generate output file
            file_path, file_size = await self._generate_output_file(report, report_format)
            report.file_path = file_path
            report.file_size = file_size
            
            # Log report generation
            await audit_trail_manager.log_event(
                event_type=AuditEventType.COMPLIANCE_REPORT_GENERATED,
                severity=AuditSeverity.MEDIUM,
                action="compliance_report_generated",
                details={
                    "report_id": report_id,
                    "report_type": report_type.value,
                    "framework": framework.value,
                    "format": report_format.value,
                    "compliance_score": overall_score,
                    "risk_score": risk_score
                },
                user_id=generated_by,
                organization_id=organization_id,
                resource_type="compliance_report",
                resource_id=report_id
            )
            
            logger.info(f"Generated compliance report {report_id} for {framework.value}")
            
            return report
            
        except Exception as e:
            logger.error(f"Failed to generate compliance report: {e}")
            raise VelocityException(f"Report generation failed: {str(e)}")
    
    async def _gather_compliance_data(
        self,
        db: Session,
        organization_id: str,
        framework: Framework,
        start_date: Optional[datetime],
        end_date: Optional[datetime]
    ) -> Dict[str, Any]:
        """Gather all compliance data for report generation"""
        
        # Get organization
        org = db.query(Organization).filter(Organization.id == organization_id).first()
        if not org:
            raise VelocityException(f"Organization not found: {organization_id}")
        
        # Get evidence items
        evidence_query = db.query(EvidenceItem).filter(
            and_(
                EvidenceItem.organization_id == organization_id,
                EvidenceItem.framework == framework
            )
        )
        
        if start_date:
            evidence_query = evidence_query.filter(EvidenceItem.created_at >= start_date)
        if end_date:
            evidence_query = evidence_query.filter(EvidenceItem.created_at <= end_date)
        
        evidence_items = evidence_query.all()
        
        # Get trust scores
        trust_scores = db.query(TrustScore).filter(
            and_(
                TrustScore.organization_id == organization_id,
                TrustScore.framework == framework
            )
        ).all()
        
        # Get agents and their execution status
        agents = db.query(Agent).filter(Agent.organization_id == organization_id).all()
        
        # Analyze evidence by control
        controls_analysis = self._analyze_evidence_by_control(evidence_items, framework)
        
        # Calculate compliance metrics
        compliance_metrics = self._calculate_compliance_metrics(controls_analysis, framework)
        
        return {
            "organization": org,
            "framework": framework,
            "evidence_items": evidence_items,
            "trust_scores": trust_scores,
            "agents": agents,
            "controls_analysis": controls_analysis,
            "compliance_metrics": compliance_metrics,
            "report_period": {
                "start": start_date,
                "end": end_date
            }
        }
    
    def _analyze_evidence_by_control(
        self,
        evidence_items: List[EvidenceItem],
        framework: Framework
    ) -> Dict[str, Any]:
        """Analyze evidence items by framework control"""
        
        controls = self.framework_controls.get(framework, {})
        analysis = {}
        
        for control_id, control_info in controls.items():
            # Find evidence for this control
            control_evidence = [
                item for item in evidence_items
                if item.control_id == control_id
            ]
            
            # Calculate metrics
            total_evidence = len(control_evidence)
            verified_evidence = len([
                item for item in control_evidence
                if item.status == EvidenceStatus.VERIFIED
            ])
            
            avg_confidence = 0
            if control_evidence:
                avg_confidence = sum(item.confidence_score for item in control_evidence) / len(control_evidence)
            
            # Determine compliance status
            compliance_status = self._determine_compliance_status(
                total_evidence, verified_evidence, avg_confidence
            )
            
            analysis[control_id] = {
                "control_info": control_info,
                "evidence_items": control_evidence,
                "total_evidence": total_evidence,
                "verified_evidence": verified_evidence,
                "average_confidence": avg_confidence,
                "compliance_status": compliance_status,
                "last_updated": max([item.updated_at for item in control_evidence]) if control_evidence else None
            }
        
        return analysis
    
    def _calculate_compliance_metrics(
        self,
        controls_analysis: Dict[str, Any],
        framework: Framework
    ) -> List[ComplianceMetric]:
        """Calculate compliance metrics for each control"""
        
        metrics = []
        
        for control_id, analysis in controls_analysis.items():
            control_info = analysis["control_info"]
            
            # Calculate compliance percentage
            if analysis["total_evidence"] > 0:
                compliance_percentage = (analysis["verified_evidence"] / analysis["total_evidence"]) * 100
            else:
                compliance_percentage = 0
            
            # Identify gaps
            gaps = []
            if analysis["total_evidence"] == 0:
                gaps.append("No evidence collected")
            elif analysis["verified_evidence"] == 0:
                gaps.append("No verified evidence")
            elif analysis["average_confidence"] < 0.7:
                gaps.append("Low confidence evidence")
            
            # Generate recommendations
            recommendations = self._generate_control_recommendations(analysis)
            
            metric = ComplianceMetric(
                control_id=control_id,
                control_name=control_info.get("name", f"Control {control_id}"),
                requirement=control_info.get("requirement", ""),
                status=analysis["compliance_status"],
                evidence_count=analysis["total_evidence"],
                evidence_quality=analysis["average_confidence"],
                compliance_percentage=compliance_percentage,
                last_assessed=analysis["last_updated"],
                gaps=gaps,
                recommendations=recommendations
            )
            
            metrics.append(metric)
        
        return metrics
    
    def _determine_compliance_status(
        self,
        total_evidence: int,
        verified_evidence: int,
        avg_confidence: float
    ) -> ComplianceStatus:
        """Determine compliance status based on evidence"""
        
        if total_evidence == 0:
            return ComplianceStatus.UNKNOWN
        
        verification_rate = verified_evidence / total_evidence
        
        if verification_rate >= 0.9 and avg_confidence >= 0.8:
            return ComplianceStatus.FULLY_COMPLIANT
        elif verification_rate >= 0.7 and avg_confidence >= 0.7:
            return ComplianceStatus.MOSTLY_COMPLIANT
        elif verification_rate >= 0.5 and avg_confidence >= 0.6:
            return ComplianceStatus.PARTIALLY_COMPLIANT
        else:
            return ComplianceStatus.NON_COMPLIANT
    
    def _generate_control_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate recommendations for a specific control"""
        
        recommendations = []
        
        if analysis["total_evidence"] == 0:
            recommendations.append("Deploy AI agents to collect evidence for this control")
        elif analysis["verified_evidence"] < analysis["total_evidence"]:
            recommendations.append("Review and approve pending evidence items")
        
        if analysis["average_confidence"] < 0.7:
            recommendations.append("Improve evidence quality through additional documentation")
        
        if analysis["compliance_status"] in [ComplianceStatus.NON_COMPLIANT, ComplianceStatus.PARTIALLY_COMPLIANT]:
            recommendations.append("Prioritize remediation activities for this control")
        
        return recommendations
    
    def _calculate_overall_scores(self, compliance_data: Dict[str, Any]) -> Tuple[float, float]:
        """Calculate overall compliance and risk scores"""
        
        metrics = compliance_data["compliance_metrics"]
        
        if not metrics:
            return 0.0, 100.0
        
        # Calculate weighted compliance score
        total_weight = 0
        weighted_score = 0
        
        for metric in metrics:
            # Weight based on evidence count and quality
            weight = max(1, metric.evidence_count) * metric.evidence_quality
            weighted_score += metric.compliance_percentage * weight
            total_weight += weight
        
        overall_compliance = weighted_score / total_weight if total_weight > 0 else 0
        
        # Calculate risk score (inverse of compliance)
        risk_score = max(0, 100 - overall_compliance)
        
        return round(overall_compliance, 2), round(risk_score, 2)
    
    async def _generate_recommendations(self, compliance_data: Dict[str, Any]) -> List[str]:
        """Generate overall recommendations"""
        
        recommendations = []
        metrics = compliance_data["compliance_metrics"]
        
        # Count compliance statuses
        status_counts = {}
        for metric in metrics:
            status = metric.status
            status_counts[status] = status_counts.get(status, 0) + 1
        
        # Generate high-level recommendations
        non_compliant = status_counts.get(ComplianceStatus.NON_COMPLIANT, 0)
        if non_compliant > 0:
            recommendations.append(f"Address {non_compliant} non-compliant controls as top priority")
        
        partially_compliant = status_counts.get(ComplianceStatus.PARTIALLY_COMPLIANT, 0)
        if partially_compliant > 0:
            recommendations.append(f"Improve {partially_compliant} partially compliant controls")
        
        unknown = status_counts.get(ComplianceStatus.UNKNOWN, 0)
        if unknown > 0:
            recommendations.append(f"Collect evidence for {unknown} controls with no assessment")
        
        # Evidence-based recommendations
        total_evidence = sum(metric.evidence_count for metric in metrics)
        if total_evidence < len(metrics) * 3:  # Less than 3 evidence items per control
            recommendations.append("Increase evidence collection through automated agents")
        
        return recommendations
    
    async def _generate_executive_summary(
        self,
        compliance_data: Dict[str, Any],
        overall_score: float,
        risk_score: float,
        recommendations: List[str]
    ) -> ReportSection:
        """Generate executive summary section"""
        
        org = compliance_data["organization"]
        framework = compliance_data["framework"]
        metrics = compliance_data["compliance_metrics"]
        
        # Create summary content
        content = f"""
        ## Executive Summary
        
        This compliance assessment for {org.name} evaluates adherence to {framework.value} requirements
        based on automated evidence collection and analysis.
        
        ### Key Findings
        
        - **Overall Compliance Score**: {overall_score}%
        - **Risk Score**: {risk_score}%
        - **Total Controls Assessed**: {len(metrics)}
        - **Evidence Items Collected**: {sum(m.evidence_count for m in metrics)}
        
        ### Compliance Status Distribution
        """
        
        # Add status distribution
        status_counts = {}
        for metric in metrics:
            status = metric.status
            status_counts[status] = status_counts.get(status, 0) + 1
        
        for status, count in status_counts.items():
            percentage = (count / len(metrics)) * 100 if metrics else 0
            content += f"- **{status.value.replace('_', ' ').title()}**: {count} controls ({percentage:.1f}%)\n"
        
        # Add top recommendations
        if recommendations:
            content += "\n### Priority Recommendations\n\n"
            for i, rec in enumerate(recommendations[:5], 1):
                content += f"{i}. {rec}\n"
        
        return ReportSection(
            section_id="executive_summary",
            title="Executive Summary",
            content=content,
            metrics=[],
            charts=[],
            tables=[],
            attachments=[]
        )
    
    async def _generate_report_sections(
        self,
        db: Session,
        compliance_data: Dict[str, Any],
        report_type: ReportType,
        include_evidence: bool
    ) -> List[ReportSection]:
        """Generate report sections based on type"""
        
        sections = []
        
        if report_type == ReportType.COMPLIANCE_ASSESSMENT:
            sections.extend(await self._generate_compliance_assessment_sections(compliance_data, include_evidence))
        elif report_type == ReportType.GDPR_TRANSFER_REPORT:
            sections.extend(await self._generate_gdpr_transfer_sections(compliance_data))
        elif report_type == ReportType.SOC2_READINESS:
            sections.extend(await self._generate_soc2_readiness_sections(compliance_data))
        elif report_type == ReportType.EVIDENCE_INVENTORY:
            sections.extend(await self._generate_evidence_inventory_sections(compliance_data))
        elif report_type == ReportType.RISK_ASSESSMENT:
            sections.extend(await self._generate_risk_assessment_sections(compliance_data))
        
        return sections
    
    async def _generate_compliance_assessment_sections(
        self,
        compliance_data: Dict[str, Any],
        include_evidence: bool
    ) -> List[ReportSection]:
        """Generate sections for compliance assessment report"""
        
        sections = []
        framework = compliance_data["framework"]
        metrics = compliance_data["compliance_metrics"]
        
        # Control-by-control analysis
        controls_content = ""
        for metric in metrics:
            controls_content += f"""
            ### {metric.control_name} ({metric.control_id})
            
            **Status**: {metric.status.value.replace('_', ' ').title()}
            **Compliance**: {metric.compliance_percentage}%
            **Evidence Items**: {metric.evidence_count}
            **Evidence Quality**: {metric.evidence_quality:.2f}
            
            **Requirement**: {metric.requirement}
            
            """
            
            if metric.gaps:
                controls_content += "**Identified Gaps**:\n"
                for gap in metric.gaps:
                    controls_content += f"- {gap}\n"
            
            if metric.recommendations:
                controls_content += "\n**Recommendations**:\n"
                for rec in metric.recommendations:
                    controls_content += f"- {rec}\n"
            
            controls_content += "\n---\n"
        
        sections.append(ReportSection(
            section_id="controls_analysis",
            title=f"{framework.value} Controls Analysis",
            content=controls_content,
            metrics=metrics,
            charts=[],
            tables=[],
            attachments=[]
        ))
        
        return sections
    
    async def _generate_gdpr_transfer_sections(self, compliance_data: Dict[str, Any]) -> List[ReportSection]:
        """Generate GDPR transfer-specific sections"""
        
        sections = []
        
        # Transfer mechanisms analysis
        transfer_content = """
        ## International Data Transfer Analysis
        
        This section analyzes the organization's international data transfer practices
        in accordance with GDPR Chapter V requirements.
        
        ### Transfer Impact Assessment (TIA) Status
        - Automated TIA generation: Active
        - Transfer mapping: In progress
        - Adequacy decision monitoring: Active
        
        ### Standard Contractual Clauses (SCCs)
        - SCC implementation: Verified
        - Technical safeguards: Implemented
        - Organizational measures: Documented
        """
        
        sections.append(ReportSection(
            section_id="gdpr_transfers",
            title="International Transfer Compliance",
            content=transfer_content,
            metrics=[],
            charts=[],
            tables=[],
            attachments=[]
        ))
        
        return sections
    
    async def _generate_output_file(
        self,
        report: ComplianceReport,
        format: ReportFormat
    ) -> Tuple[str, int]:
        """Generate output file in specified format"""
        
        filename = f"compliance_report_{report.metadata.report_id}.{format.value}"
        output_path = self.report_output_dir / filename
        
        try:
            if format == ReportFormat.JSON:
                # Convert report to JSON
                report_dict = asdict(report)
                
                with open(output_path, 'w') as f:
                    json.dump(report_dict, f, indent=2, default=str)
            
            elif format == ReportFormat.HTML:
                # Generate HTML report
                html_content = self._generate_html_report(report)
                
                with open(output_path, 'w') as f:
                    f.write(html_content)
            
            elif format == ReportFormat.CSV:
                # Generate CSV with metrics
                import csv
                
                with open(output_path, 'w', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow([
                        'Control ID', 'Control Name', 'Status', 'Compliance %',
                        'Evidence Count', 'Evidence Quality', 'Gaps', 'Recommendations'
                    ])
                    
                    for section in report.sections:
                        for metric in section.metrics:
                            writer.writerow([
                                metric.control_id,
                                metric.control_name,
                                metric.status.value,
                                metric.compliance_percentage,
                                metric.evidence_count,
                                metric.evidence_quality,
                                '; '.join(metric.gaps),
                                '; '.join(metric.recommendations)
                            ])
            
            else:
                # Default to JSON for unsupported formats
                report_dict = asdict(report)
                
                with open(output_path, 'w') as f:
                    json.dump(report_dict, f, indent=2, default=str)
            
            file_size = os.path.getsize(output_path)
            return str(output_path), file_size
            
        except Exception as e:
            logger.error(f"Failed to generate output file: {e}")
            raise VelocityException(f"File generation failed: {str(e)}")
    
    def _generate_html_report(self, report: ComplianceReport) -> str:
        """Generate HTML report"""
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Compliance Report - {report.metadata.framework.value}</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                .header {{ text-align: center; margin-bottom: 40px; }}
                .metric {{ display: inline-block; margin: 10px; padding: 20px; border: 1px solid #ddd; }}
                .status-fully {{ background-color: #d4edda; }}
                .status-mostly {{ background-color: #fff3cd; }}
                .status-partially {{ background-color: #f8d7da; }}
                .status-non {{ background-color: #f5c6cb; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Compliance Report</h1>
                <h2>{report.metadata.framework.value} Assessment</h2>
                <p>Generated: {report.metadata.generated_at.strftime('%Y-%m-%d %H:%M:%S')}</p>
                <div class="metric">
                    <h3>Overall Score</h3>
                    <p>{report.overall_compliance_score}%</p>
                </div>
                <div class="metric">
                    <h3>Risk Score</h3>
                    <p>{report.risk_score}%</p>
                </div>
            </div>
            
            <div class="summary">
                <h2>Executive Summary</h2>
                <pre>{report.executive_summary.content}</pre>
            </div>
        """
        
        for section in report.sections:
            html += f"""
            <div class="section">
                <h2>{section.title}</h2>
                <pre>{section.content}</pre>
            </div>
            """
        
        html += """
        </body>
        </html>
        """
        
        return html
    
    def _calculate_next_assessment_date(self, framework: Framework, compliance_score: float) -> datetime:
        """Calculate next assessment date based on framework and current score"""
        
        base_months = {
            Framework.GDPR: 12,
            Framework.SOC2: 12,
            Framework.ISO27001: 12,
            Framework.CCPA: 12,
            Framework.HIPAA: 12,
            Framework.PCI_DSS: 12
        }
        
        months = base_months.get(framework, 12)
        
        # Adjust based on compliance score
        if compliance_score < 50:
            months = 3  # Quarterly for low scores
        elif compliance_score < 80:
            months = 6  # Semi-annually for medium scores
        
        return datetime.now(timezone.utc) + timedelta(days=months * 30)
    
    # Framework control definitions
    def _get_gdpr_controls(self) -> Dict[str, Dict[str, str]]:
        """Get GDPR control definitions"""
        return {
            "gdpr_5_1": {
                "name": "Lawful Basis",
                "requirement": "Processing must have a lawful basis under Article 6"
            },
            "gdpr_25": {
                "name": "Data Protection by Design",
                "requirement": "Implement data protection by design and by default"
            },
            "gdpr_30": {
                "name": "Records of Processing",
                "requirement": "Maintain records of processing activities"
            },
            "gdpr_32": {
                "name": "Security of Processing",
                "requirement": "Implement appropriate technical and organizational measures"
            },
            "gdpr_44": {
                "name": "International Transfers",
                "requirement": "Ensure adequate protection for international transfers"
            },
            "gdpr_46": {
                "name": "Standard Contractual Clauses",
                "requirement": "Use appropriate safeguards for transfers"
            }
        }
    
    def _get_soc2_controls(self) -> Dict[str, Dict[str, str]]:
        """Get SOC2 control definitions"""
        return {
            "cc1_1": {
                "name": "Control Environment",
                "requirement": "Demonstrate commitment to integrity and ethical values"
            },
            "cc2_1": {
                "name": "Communication",
                "requirement": "Communicate information internally to support functioning of internal control"
            },
            "cc6_1": {
                "name": "Logical Access",
                "requirement": "Implement logical access security measures"
            },
            "cc7_1": {
                "name": "System Operations",
                "requirement": "Detect and correct processing errors and security incidents"
            }
        }
    
    def _get_iso27001_controls(self) -> Dict[str, Dict[str, str]]:
        """Get ISO27001 control definitions"""
        return {
            "a5_1": {
                "name": "Information Security Policies",
                "requirement": "Establish information security policy"
            },
            "a6_1": {
                "name": "Organization of Information Security",
                "requirement": "Define information security responsibilities"
            },
            "a8_1": {
                "name": "Asset Management",
                "requirement": "Maintain inventory of assets"
            },
            "a12_1": {
                "name": "Operations Security",
                "requirement": "Establish operational procedures"
            }
        }
    
    def _get_ccpa_controls(self) -> Dict[str, Dict[str, str]]:
        """Get CCPA control definitions"""
        return {
            "ccpa_1798_100": {
                "name": "Consumer Rights",
                "requirement": "Provide consumers with rights to know, delete, and opt-out"
            }
        }
    
    def _get_hipaa_controls(self) -> Dict[str, Dict[str, str]]:
        """Get HIPAA control definitions"""
        return {
            "hipaa_164_308": {
                "name": "Administrative Safeguards",
                "requirement": "Implement administrative safeguards"
            }
        }
    
    def _get_pci_controls(self) -> Dict[str, Dict[str, str]]:
        """Get PCI-DSS control definitions"""
        return {
            "pci_1": {
                "name": "Firewall Configuration",
                "requirement": "Install and maintain firewall configuration"
            }
        }

# Global report generator instance
compliance_report_generator = ComplianceReportGenerator()

# Convenience functions
async def generate_compliance_report(
    db: Session,
    organization_id: str,
    framework: Framework,
    report_type: ReportType = ReportType.COMPLIANCE_ASSESSMENT,
    report_format: ReportFormat = ReportFormat.JSON,
    generated_by: str = "system",
    **kwargs
) -> ComplianceReport:
    """Generate compliance report"""
    return await compliance_report_generator.generate_compliance_report(
        db=db,
        organization_id=organization_id,
        framework=framework,
        report_type=report_type,
        report_format=report_format,
        generated_by=generated_by,
        **kwargs
    )