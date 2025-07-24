#!/usr/bin/env python3
"""
Industry-Specific Certification Management System
Supports TISAX (automotive), ISO 27701 (privacy), and extensible framework
"""

import json
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import hashlib
import os
from dataclasses import dataclass, asdict
from enum import Enum
import pandas as pd
import numpy as np


class CertificationStatus(Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    UNDER_REVIEW = "under_review"
    CERTIFIED = "certified"
    EXPIRED = "expired"
    SUSPENDED = "suspended"


class ControlStatus(Enum):
    NOT_IMPLEMENTED = "not_implemented"
    PARTIALLY_IMPLEMENTED = "partially_implemented"
    FULLY_IMPLEMENTED = "fully_implemented"
    NOT_APPLICABLE = "not_applicable"


@dataclass
class CertificationControl:
    id: str
    name: str
    description: str
    category: str
    requirement_level: str  # mandatory, recommended, optional
    status: ControlStatus
    evidence_required: List[str]
    automation_available: bool
    trust_impact: int  # 1-10 scale


@dataclass
class CertificationRequirement:
    id: str
    certification: str
    domain: str
    controls: List[CertificationControl]
    maturity_level_required: int
    compliance_percentage: float


class CertificationManager:
    def __init__(self, db_path: str = "certifications.db"):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self.init_database()
        self.load_certification_frameworks()
    
    def init_database(self):
        """Initialize certification database schema"""
        cursor = self.conn.cursor()
        
        # Organizations table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS organizations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                industry TEXT NOT NULL,
                size TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Certifications table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS certifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                org_id INTEGER,
                certification_type TEXT NOT NULL,
                status TEXT NOT NULL,
                start_date DATE,
                certification_date DATE,
                expiry_date DATE,
                compliance_score REAL,
                trust_equity_score REAL,
                FOREIGN KEY (org_id) REFERENCES organizations (id)
            )
        ''')
        
        # Controls assessment table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS control_assessments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cert_id INTEGER,
                control_id TEXT NOT NULL,
                status TEXT NOT NULL,
                evidence_path TEXT,
                assessed_date DATE,
                assessor TEXT,
                notes TEXT,
                automation_used BOOLEAN DEFAULT 0,
                FOREIGN KEY (cert_id) REFERENCES certifications (id)
            )
        ''')
        
        # Audit trail table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audit_trail (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cert_id INTEGER,
                action TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user TEXT,
                details TEXT,
                FOREIGN KEY (cert_id) REFERENCES certifications (id)
            )
        ''')
        
        self.conn.commit()
    
    def load_certification_frameworks(self):
        """Load certification framework definitions"""
        self.frameworks = {
            "TISAX": self._load_tisax_framework(),
            "ISO27701": self._load_iso27701_framework(),
            "SOC2": self._load_soc2_framework(),
            "HIPAA": self._load_hipaa_framework()
        }
    
    def _load_tisax_framework(self) -> Dict:
        """Load TISAX (Trusted Information Security Assessment Exchange) framework"""
        return {
            "name": "TISAX",
            "full_name": "Trusted Information Security Assessment Exchange",
            "industry": "Automotive",
            "version": "5.1",
            "domains": {
                "information_security": {
                    "name": "Information Security",
                    "weight": 0.4,
                    "controls": [
                        CertificationControl(
                            id="IS.1.1",
                            name="Information Security Policies",
                            description="Establish and maintain information security policies",
                            category="Governance",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["Policy documents", "Approval records", "Communication evidence"],
                            automation_available=True,
                            trust_impact=8
                        ),
                        CertificationControl(
                            id="IS.1.2",
                            name="Risk Management",
                            description="Implement risk assessment and treatment processes",
                            category="Risk",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["Risk register", "Risk assessments", "Treatment plans"],
                            automation_available=True,
                            trust_impact=9
                        ),
                        CertificationControl(
                            id="IS.2.1",
                            name="Access Control",
                            description="Implement access control for information and systems",
                            category="Technical",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["Access control matrix", "User provisioning logs", "Review records"],
                            automation_available=True,
                            trust_impact=9
                        ),
                        CertificationControl(
                            id="IS.3.1",
                            name="Cryptography",
                            description="Use cryptographic controls to protect information",
                            category="Technical",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["Encryption policies", "Key management procedures", "Implementation evidence"],
                            automation_available=True,
                            trust_impact=8
                        )
                    ]
                },
                "prototype_protection": {
                    "name": "Prototype Protection",
                    "weight": 0.3,
                    "controls": [
                        CertificationControl(
                            id="PP.1.1",
                            name="Prototype Handling",
                            description="Secure handling and storage of prototypes",
                            category="Physical",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["Handling procedures", "Storage logs", "Access records"],
                            automation_available=False,
                            trust_impact=7
                        ),
                        CertificationControl(
                            id="PP.2.1",
                            name="Prototype Disposal",
                            description="Secure disposal of prototype components",
                            category="Physical",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["Disposal procedures", "Destruction certificates"],
                            automation_available=False,
                            trust_impact=6
                        )
                    ]
                },
                "data_protection": {
                    "name": "Data Protection",
                    "weight": 0.3,
                    "controls": [
                        CertificationControl(
                            id="DP.1.1",
                            name="Data Classification",
                            description="Classify and label automotive data",
                            category="Data",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["Classification scheme", "Labeling examples", "Training records"],
                            automation_available=True,
                            trust_impact=8
                        ),
                        CertificationControl(
                            id="DP.2.1",
                            name="Data Privacy",
                            description="Ensure privacy of personal and vehicle data",
                            category="Privacy",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["Privacy policies", "Consent mechanisms", "Data flow diagrams"],
                            automation_available=True,
                            trust_impact=9
                        )
                    ]
                }
            },
            "assessment_levels": {
                "basic": {"min_score": 70, "maturity": 1},
                "standard": {"min_score": 80, "maturity": 2},
                "high": {"min_score": 90, "maturity": 3}
            }
        }
    
    def _load_iso27701_framework(self) -> Dict:
        """Load ISO 27701 Privacy Information Management framework"""
        return {
            "name": "ISO27701",
            "full_name": "ISO/IEC 27701:2019 Privacy Information Management",
            "industry": "All",
            "version": "2019",
            "domains": {
                "privacy_governance": {
                    "name": "Privacy Governance",
                    "weight": 0.25,
                    "controls": [
                        CertificationControl(
                            id="PG.1.1",
                            name="Privacy Policy",
                            description="Establish and communicate privacy policy",
                            category="Governance",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["Privacy policy", "Communication records", "Acknowledgments"],
                            automation_available=True,
                            trust_impact=9
                        ),
                        CertificationControl(
                            id="PG.2.1",
                            name="Privacy Roles",
                            description="Define privacy roles and responsibilities",
                            category="Governance",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["RACI matrix", "Job descriptions", "Appointment letters"],
                            automation_available=False,
                            trust_impact=7
                        )
                    ]
                },
                "data_subject_rights": {
                    "name": "Data Subject Rights",
                    "weight": 0.25,
                    "controls": [
                        CertificationControl(
                            id="DSR.1.1",
                            name="Rights Management",
                            description="Process for handling data subject requests",
                            category="Process",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["Request procedures", "Response templates", "Processing logs"],
                            automation_available=True,
                            trust_impact=9
                        ),
                        CertificationControl(
                            id="DSR.2.1",
                            name="Consent Management",
                            description="Obtain and manage consent for data processing",
                            category="Legal",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["Consent forms", "Consent database", "Withdrawal procedures"],
                            automation_available=True,
                            trust_impact=9
                        )
                    ]
                },
                "privacy_by_design": {
                    "name": "Privacy by Design",
                    "weight": 0.25,
                    "controls": [
                        CertificationControl(
                            id="PBD.1.1",
                            name="Privacy Impact Assessment",
                            description="Conduct PIAs for new processing activities",
                            category="Assessment",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["PIA templates", "Completed PIAs", "Risk mitigation plans"],
                            automation_available=True,
                            trust_impact=8
                        ),
                        CertificationControl(
                            id="PBD.2.1",
                            name="Data Minimization",
                            description="Minimize personal data collection and retention",
                            category="Principle",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["Data inventory", "Retention schedules", "Deletion logs"],
                            automation_available=True,
                            trust_impact=8
                        )
                    ]
                },
                "breach_management": {
                    "name": "Breach Management",
                    "weight": 0.25,
                    "controls": [
                        CertificationControl(
                            id="BM.1.1",
                            name="Breach Response",
                            description="Privacy breach response procedures",
                            category="Incident",
                            requirement_level="mandatory",
                            status=ControlStatus.NOT_IMPLEMENTED,
                            evidence_required=["Response plan", "Notification templates", "Test results"],
                            automation_available=True,
                            trust_impact=9
                        )
                    ]
                }
            }
        }
    
    def _load_soc2_framework(self) -> Dict:
        """Load SOC 2 framework - placeholder for extension"""
        return {
            "name": "SOC2",
            "full_name": "Service Organization Control 2",
            "industry": "Technology/Services",
            "version": "2017",
            "domains": {}
        }
    
    def _load_hipaa_framework(self) -> Dict:
        """Load HIPAA framework - placeholder for extension"""
        return {
            "name": "HIPAA",
            "full_name": "Health Insurance Portability and Accountability Act",
            "industry": "Healthcare",
            "version": "2013",
            "domains": {}
        }
    
    def calculate_trust_equity_score(self, certification_type: str, control_assessments: List[Dict]) -> float:
        """
        Calculate Trust Equity score based on certification compliance
        Uses weighted scoring based on control importance and implementation status
        """
        framework = self.frameworks.get(certification_type)
        if not framework:
            return 0.0
        
        total_score = 0.0
        total_weight = 0.0
        
        for domain_key, domain in framework["domains"].items():
            domain_score = 0.0
            domain_controls = len(domain["controls"])
            
            for control in domain["controls"]:
                # Find assessment for this control
                assessment = next(
                    (a for a in control_assessments if a["control_id"] == control.id),
                    None
                )
                
                if assessment:
                    status_score = {
                        "not_implemented": 0,
                        "partially_implemented": 0.5,
                        "fully_implemented": 1.0,
                        "not_applicable": 1.0  # NA controls don't penalize score
                    }.get(assessment["status"], 0)
                    
                    # Weight by trust impact
                    control_score = status_score * (control.trust_impact / 10)
                    
                    # Bonus for automation
                    if assessment.get("automation_used") and control.automation_available:
                        control_score *= 1.1  # 10% bonus for automation
                    
                    domain_score += control_score
            
            # Normalize domain score
            if domain_controls > 0:
                domain_score = (domain_score / domain_controls) * 100
                total_score += domain_score * domain["weight"]
                total_weight += domain["weight"]
        
        # Calculate final Trust Equity score
        if total_weight > 0:
            trust_equity = total_score / total_weight
            
            # Apply certification-specific adjustments
            if certification_type == "TISAX":
                # TISAX gets bonus for automotive industry criticality
                trust_equity *= 1.05
            elif certification_type == "ISO27701":
                # ISO 27701 gets bonus for privacy focus
                trust_equity *= 1.08
            
            return min(trust_equity, 100.0)  # Cap at 100
        
        return 0.0
    
    def generate_gap_analysis(self, org_id: int, certification_type: str) -> Dict:
        """
        Generate gap analysis for certification readiness
        Returns detailed analysis with recommendations
        """
        framework = self.frameworks.get(certification_type)
        if not framework:
            return {"error": "Unknown certification type"}
        
        gaps = {
            "certification": certification_type,
            "domains": {},
            "overall_readiness": 0,
            "estimated_effort_days": 0,
            "priority_actions": [],
            "automation_opportunities": []
        }
        
        total_controls = 0
        implemented_controls = 0
        
        for domain_key, domain in framework["domains"].items():
            domain_gaps = {
                "name": domain["name"],
                "controls_total": len(domain["controls"]),
                "controls_implemented": 0,
                "gaps": []
            }
            
            for control in domain["controls"]:
                total_controls += 1
                
                if control.status == ControlStatus.FULLY_IMPLEMENTED:
                    implemented_controls += 1
                    domain_gaps["controls_implemented"] += 1
                else:
                    gap = {
                        "control_id": control.id,
                        "control_name": control.name,
                        "current_status": control.status.value,
                        "effort_days": self._estimate_implementation_effort(control),
                        "automation_available": control.automation_available,
                        "trust_impact": control.trust_impact
                    }
                    domain_gaps["gaps"].append(gap)
                    gaps["estimated_effort_days"] += gap["effort_days"]
                    
                    if control.automation_available:
                        gaps["automation_opportunities"].append({
                            "control_id": control.id,
                            "control_name": control.name,
                            "estimated_time_savings": f"{gap['effort_days'] * 0.7:.1f} days"
                        })
            
            gaps["domains"][domain_key] = domain_gaps
        
        # Calculate overall readiness
        gaps["overall_readiness"] = (implemented_controls / total_controls * 100) if total_controls > 0 else 0
        
        # Generate priority actions based on trust impact and effort
        all_gaps = []
        for domain_gaps in gaps["domains"].values():
            all_gaps.extend(domain_gaps["gaps"])
        
        # Sort by trust impact (descending) and effort (ascending) for quick wins
        priority_gaps = sorted(
            all_gaps,
            key=lambda x: (x["trust_impact"], -x["effort_days"]),
            reverse=True
        )[:5]
        
        gaps["priority_actions"] = [
            {
                "action": f"Implement {gap['control_name']}",
                "control_id": gap["control_id"],
                "impact": "High" if gap["trust_impact"] >= 8 else "Medium" if gap["trust_impact"] >= 5 else "Low",
                "effort": f"{gap['effort_days']} days",
                "automation": "Available" if gap["automation_available"] else "Manual"
            }
            for gap in priority_gaps
        ]
        
        return gaps
    
    def _estimate_implementation_effort(self, control: CertificationControl) -> float:
        """Estimate implementation effort in days based on control characteristics"""
        base_effort = {
            "mandatory": 5,
            "recommended": 3,
            "optional": 2
        }.get(control.requirement_level, 3)
        
        # Adjust for category
        category_multiplier = {
            "Governance": 1.5,  # Policy work takes time
            "Technical": 1.0,   # Can be automated
            "Physical": 1.2,    # Requires physical changes
            "Process": 1.3,     # Process changes need training
            "Legal": 1.4,       # Legal review needed
            "Assessment": 1.1,  # Mainly documentation
            "Data": 1.2,        # Data handling complexity
            "Privacy": 1.5,     # Privacy requires careful implementation
            "Risk": 1.3,        # Risk assessment is thorough
            "Incident": 1.2,    # Incident response needs testing
            "Principle": 1.0    # Conceptual implementation
        }.get(control.category, 1.0)
        
        effort = base_effort * category_multiplier
        
        # Reduce effort if automation is available
        if control.automation_available:
            effort *= 0.7
        
        # Adjust for current status
        if control.status == ControlStatus.PARTIALLY_IMPLEMENTED:
            effort *= 0.5
        
        return round(effort, 1)
    
    def create_certification_roadmap(self, org_id: int, certification_type: str, 
                                    target_date: str) -> Dict:
        """
        Create implementation roadmap for certification
        Returns phased approach with milestones
        """
        gap_analysis = self.generate_gap_analysis(org_id, certification_type)
        target_dt = datetime.strptime(target_date, "%Y-%m-%d")
        today = datetime.now()
        available_days = (target_dt - today).days
        
        roadmap = {
            "certification": certification_type,
            "start_date": today.strftime("%Y-%m-%d"),
            "target_date": target_date,
            "available_days": available_days,
            "required_effort_days": gap_analysis["estimated_effort_days"],
            "feasibility": "Feasible" if available_days > gap_analysis["estimated_effort_days"] * 1.2 else "Challenging",
            "phases": []
        }
        
        # Create phases based on domain structure
        framework = self.frameworks.get(certification_type)
        phase_duration = available_days / 4  # 4 phases
        
        # Phase 1: Foundation (Governance and Assessment)
        phase1 = {
            "phase": 1,
            "name": "Foundation & Governance",
            "duration_days": int(phase_duration),
            "start_date": today.strftime("%Y-%m-%d"),
            "end_date": (today + timedelta(days=phase_duration)).strftime("%Y-%m-%d"),
            "focus_areas": ["Governance", "Policy", "Risk Assessment"],
            "key_deliverables": [
                "Certification governance structure",
                "Policy framework",
                "Initial risk assessment"
            ],
            "controls": []
        }
        
        # Phase 2: Technical Implementation
        phase2 = {
            "phase": 2,
            "name": "Technical Controls",
            "duration_days": int(phase_duration),
            "start_date": (today + timedelta(days=phase_duration)).strftime("%Y-%m-%d"),
            "end_date": (today + timedelta(days=phase_duration*2)).strftime("%Y-%m-%d"),
            "focus_areas": ["Technical", "Data", "Security"],
            "key_deliverables": [
                "Technical controls implementation",
                "Automation deployment",
                "Security measures"
            ],
            "controls": []
        }
        
        # Phase 3: Process & Operational
        phase3 = {
            "phase": 3,
            "name": "Process Implementation",
            "duration_days": int(phase_duration),
            "start_date": (today + timedelta(days=phase_duration*2)).strftime("%Y-%m-%d"),
            "end_date": (today + timedelta(days=phase_duration*3)).strftime("%Y-%m-%d"),
            "focus_areas": ["Process", "Operations", "Training"],
            "key_deliverables": [
                "Operational procedures",
                "Staff training",
                "Process documentation"
            ],
            "controls": []
        }
        
        # Phase 4: Assessment & Certification
        phase4 = {
            "phase": 4,
            "name": "Assessment & Certification",
            "duration_days": int(phase_duration),
            "start_date": (today + timedelta(days=phase_duration*3)).strftime("%Y-%m-%d"),
            "end_date": target_date,
            "focus_areas": ["Assessment", "Audit", "Certification"],
            "key_deliverables": [
                "Internal assessment",
                "Gap remediation",
                "External audit",
                "Certification achievement"
            ],
            "controls": []
        }
        
        roadmap["phases"] = [phase1, phase2, phase3, phase4]
        
        # Add automation recommendations
        roadmap["automation_strategy"] = {
            "total_automation_opportunities": len(gap_analysis["automation_opportunities"]),
            "estimated_time_savings_days": sum(
                float(opp["estimated_time_savings"].split()[0]) 
                for opp in gap_analysis["automation_opportunities"]
            ),
            "recommended_tools": [
                "ERIP Compliance Automation Suite",
                "AI-powered evidence collection",
                "Continuous control monitoring",
                "Automated documentation generation"
            ]
        }
        
        return roadmap
    
    def export_certification_data(self, cert_id: int, format: str = "json") -> str:
        """Export certification data in various formats"""
        cursor = self.conn.cursor()
        
        # Get certification details
        cursor.execute('''
            SELECT c.*, o.name as org_name, o.industry
            FROM certifications c
            JOIN organizations o ON c.org_id = o.id
            WHERE c.id = ?
        ''', (cert_id,))
        
        cert_data = cursor.fetchone()
        if not cert_data:
            return json.dumps({"error": "Certification not found"})
        
        # Get control assessments
        cursor.execute('''
            SELECT * FROM control_assessments
            WHERE cert_id = ?
        ''', (cert_id,))
        
        assessments = cursor.fetchall()
        
        # Get audit trail
        cursor.execute('''
            SELECT * FROM audit_trail
            WHERE cert_id = ?
            ORDER BY timestamp DESC
            LIMIT 100
        ''', (cert_id,))
        
        audit_trail = cursor.fetchall()
        
        # Prepare export data
        export_data = {
            "certification": {
                "id": cert_data[0],
                "organization": cert_data[10],
                "industry": cert_data[11],
                "type": cert_data[2],
                "status": cert_data[3],
                "start_date": cert_data[4],
                "certification_date": cert_data[5],
                "expiry_date": cert_data[6],
                "compliance_score": cert_data[7],
                "trust_equity_score": cert_data[8]
            },
            "assessments": [
                {
                    "control_id": a[2],
                    "status": a[3],
                    "evidence_path": a[4],
                    "assessed_date": a[5],
                    "assessor": a[6],
                    "notes": a[7],
                    "automation_used": bool(a[8])
                }
                for a in assessments
            ],
            "audit_trail": [
                {
                    "action": a[2],
                    "timestamp": a[3],
                    "user": a[4],
                    "details": a[5]
                }
                for a in audit_trail
            ],
            "export_timestamp": datetime.now().isoformat()
        }
        
        if format == "json":
            return json.dumps(export_data, indent=2)
        elif format == "csv":
            # Convert to CSV format (simplified)
            df = pd.DataFrame(export_data["assessments"])
            return df.to_csv(index=False)
        else:
            return json.dumps({"error": "Unsupported format"})


# API Functions for integration with frontend
def create_certification_assessment(org_name: str, industry: str, certification_type: str) -> Dict:
    """Create new certification assessment"""
    manager = CertificationManager()
    
    # Create organization
    cursor = manager.conn.cursor()
    cursor.execute('''
        INSERT INTO organizations (name, industry, size)
        VALUES (?, ?, ?)
    ''', (org_name, industry, "Enterprise"))
    org_id = cursor.lastrowid
    
    # Create certification record
    cursor.execute('''
        INSERT INTO certifications (org_id, certification_type, status, start_date)
        VALUES (?, ?, ?, ?)
    ''', (org_id, certification_type, CertificationStatus.IN_PROGRESS.value, datetime.now().date()))
    cert_id = cursor.lastrowid
    
    manager.conn.commit()
    
    # Generate initial gap analysis
    gap_analysis = manager.generate_gap_analysis(org_id, certification_type)
    
    # Create roadmap
    target_date = (datetime.now() + timedelta(days=180)).strftime("%Y-%m-%d")
    roadmap = manager.create_certification_roadmap(org_id, certification_type, target_date)
    
    return {
        "success": True,
        "certification_id": cert_id,
        "organization_id": org_id,
        "gap_analysis": gap_analysis,
        "roadmap": roadmap
    }


def update_control_assessment(cert_id: int, control_id: str, status: str, 
                            evidence_path: str = None, notes: str = None) -> Dict:
    """Update control assessment status"""
    manager = CertificationManager()
    cursor = manager.conn.cursor()
    
    # Check if assessment exists
    cursor.execute('''
        SELECT id FROM control_assessments
        WHERE cert_id = ? AND control_id = ?
    ''', (cert_id, control_id))
    
    existing = cursor.fetchone()
    
    if existing:
        # Update existing
        cursor.execute('''
            UPDATE control_assessments
            SET status = ?, evidence_path = ?, notes = ?, assessed_date = ?
            WHERE cert_id = ? AND control_id = ?
        ''', (status, evidence_path, notes, datetime.now().date(), cert_id, control_id))
    else:
        # Insert new
        cursor.execute('''
            INSERT INTO control_assessments 
            (cert_id, control_id, status, evidence_path, notes, assessed_date)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (cert_id, control_id, status, evidence_path, notes, datetime.now().date()))
    
    # Add to audit trail
    cursor.execute('''
        INSERT INTO audit_trail (cert_id, action, user, details)
        VALUES (?, ?, ?, ?)
    ''', (cert_id, f"Updated control {control_id}", "System", f"Status: {status}"))
    
    manager.conn.commit()
    
    # Recalculate scores
    cursor.execute('SELECT certification_type FROM certifications WHERE id = ?', (cert_id,))
    cert_type = cursor.fetchone()[0]
    
    cursor.execute('SELECT * FROM control_assessments WHERE cert_id = ?', (cert_id,))
    assessments = [
        {
            "control_id": row[2],
            "status": row[3],
            "automation_used": bool(row[8])
        }
        for row in cursor.fetchall()
    ]
    
    trust_score = manager.calculate_trust_equity_score(cert_type, assessments)
    
    # Update certification record
    cursor.execute('''
        UPDATE certifications
        SET trust_equity_score = ?
        WHERE id = ?
    ''', (trust_score, cert_id))
    
    manager.conn.commit()
    
    return {
        "success": True,
        "control_id": control_id,
        "new_status": status,
        "updated_trust_score": trust_score
    }


if __name__ == "__main__":
    # Example usage
    result = create_certification_assessment(
        org_name="Automotive Corp",
        industry="Automotive",
        certification_type="TISAX"
    )
    
    print("TISAX Certification Assessment Created:")
    print(f"Certification ID: {result['certification_id']}")
    print(f"Overall Readiness: {result['gap_analysis']['overall_readiness']:.1f}%")
    print(f"Estimated Effort: {result['gap_analysis']['estimated_effort_days']} days")
    print(f"Feasibility: {result['roadmap']['feasibility']}")
    print("\nPriority Actions:")
    for action in result['gap_analysis']['priority_actions'][:3]:
        print(f"- {action['action']} (Impact: {action['impact']}, Effort: {action['effort']})")