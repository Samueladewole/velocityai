"""
ERIP Privacy Management Suite Backend
Handles Shadow IT Discovery, DSAR Automation, RoPA Management, and DPIA processing
"""

import sqlite3
import json
import logging
import asyncio
import aiohttp
import re
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum
import hashlib
import uuid
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RiskLevel(Enum):
    LOW = "low"
    MEDIUM = "medium" 
    HIGH = "high"
    CRITICAL = "critical"

class DSARType(Enum):
    ACCESS = "access"
    PORTABILITY = "portability"
    DELETION = "deletion"
    RECTIFICATION = "rectification"
    RESTRICTION = "restriction"

class DSARStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    OVERDUE = "overdue"

@dataclass
class ShadowITApp:
    id: str
    name: str
    category: str
    risk_level: RiskLevel
    data_types: List[str]
    users: int
    last_seen: str
    compliance: Dict[str, bool]
    trust_impact: int
    discovery_method: str = "network_scan"
    domain: Optional[str] = None
    
@dataclass
class DSARRequest:
    id: str
    request_type: DSARType
    requester_email: str
    submission_date: str
    due_date: str
    status: DSARStatus
    data_subjects: List[str]
    estimated_records: int
    trust_points: int
    processing_notes: Optional[str] = None
    completion_date: Optional[str] = None

@dataclass
class RoPARecord:
    id: str
    processing_activity: str
    purpose: List[str]
    data_categories: List[str]
    data_subjects: List[str]
    recipients: List[str]
    retention_period: str
    legal_basis: str
    risk_assessment: RiskLevel
    last_reviewed: str
    status: str
    cross_border_transfers: List[str] = None
    technical_measures: List[str] = None
    organizational_measures: List[str] = None

@dataclass
class DPIARisk:
    category: str
    likelihood: int  # 1-5 scale
    impact: int     # 1-5 scale
    mitigation: str
    residual_risk: int = 0

@dataclass
class DPIAAssessment:
    id: str
    project_name: str
    assessment_type: str  # mandatory/voluntary
    risk_level: RiskLevel
    status: str
    created_date: str
    completion_percentage: int
    risks: List[DPIARisk]
    trust_equity_impact: int
    data_flows: List[Dict] = None
    stakeholders: List[str] = None

class PrivacyManager:
    def __init__(self, db_path: str = "privacy_management.db"):
        self.db_path = db_path
        self.init_database()
        
    def init_database(self):
        """Initialize SQLite database with all required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Shadow IT Apps table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS shadow_it_apps (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT,
                risk_level TEXT,
                data_types TEXT,  -- JSON array
                users INTEGER,
                last_seen TEXT,
                compliance TEXT,  -- JSON object
                trust_impact INTEGER,
                discovery_method TEXT,
                domain TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # DSAR Requests table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS dsar_requests (
                id TEXT PRIMARY KEY,
                request_type TEXT NOT NULL,
                requester_email TEXT NOT NULL,
                submission_date TEXT,
                due_date TEXT,
                status TEXT,
                data_subjects TEXT,  -- JSON array
                estimated_records INTEGER,
                trust_points INTEGER,
                processing_notes TEXT,
                completion_date TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # RoPA Records table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ropa_records (
                id TEXT PRIMARY KEY,
                processing_activity TEXT NOT NULL,
                purpose TEXT,  -- JSON array
                data_categories TEXT,  -- JSON array
                data_subjects TEXT,  -- JSON array
                recipients TEXT,  -- JSON array
                retention_period TEXT,
                legal_basis TEXT,
                risk_assessment TEXT,
                last_reviewed TEXT,
                status TEXT,
                cross_border_transfers TEXT,  -- JSON array
                technical_measures TEXT,  -- JSON array
                organizational_measures TEXT,  -- JSON array
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # DPIA Assessments table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS dpia_assessments (
                id TEXT PRIMARY KEY,
                project_name TEXT NOT NULL,
                assessment_type TEXT,
                risk_level TEXT,
                status TEXT,
                created_date TEXT,
                completion_percentage INTEGER,
                risks TEXT,  -- JSON array
                trust_equity_impact INTEGER,
                data_flows TEXT,  -- JSON array
                stakeholders TEXT,  -- JSON array
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Trust Equity tracking table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS trust_equity_events (
                id TEXT PRIMARY KEY,
                event_type TEXT NOT NULL,  -- shadow_it, dsar, ropa, dpia
                entity_id TEXT NOT NULL,
                points_earned INTEGER,
                description TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully")

    async def discover_shadow_it(self, domain: str = None) -> List[ShadowITApp]:
        """
        Advanced Shadow IT discovery using multiple methods:
        1. Network traffic analysis
        2. DNS query monitoring  
        3. Browser extension data
        4. Email pattern analysis
        5. OAuth app enumeration
        """
        discovered_apps = []
        
        try:
            # Method 1: DNS-based discovery
            dns_apps = await self._discover_via_dns(domain)
            discovered_apps.extend(dns_apps)
            
            # Method 2: Common SaaS pattern detection
            pattern_apps = await self._discover_via_patterns()
            discovered_apps.extend(pattern_apps)
            
            # Method 3: OAuth app enumeration (simulated)
            oauth_apps = await self._discover_oauth_apps()
            discovered_apps.extend(oauth_apps)
            
            # Store discoveries in database
            for app in discovered_apps:
                await self._store_shadow_it_app(app)
                
            logger.info(f"Shadow IT discovery complete: {len(discovered_apps)} apps found")
            return discovered_apps
            
        except Exception as e:
            logger.error(f"Shadow IT discovery failed: {e}")
            return []

    async def _discover_via_dns(self, domain: str) -> List[ShadowITApp]:
        """Simulate DNS-based SaaS discovery"""
        # Common SaaS domains to check for
        saas_domains = [
            "notion.so", "figma.com", "slack.com", "zoom.us", "dropbox.com",
            "github.com", "gitlab.com", "jira.atlassian.com", "trello.com",
            "asana.com", "monday.com", "airtable.com", "canva.com"
        ]
        
        discovered = []
        for saas_domain in saas_domains[:3]:  # Simulate finding first 3
            app_id = str(uuid.uuid4())
            risk_level = self._assess_risk_level(saas_domain)
            
            app = ShadowITApp(
                id=app_id,
                name=saas_domain.split('.')[0].title(),
                category=self._categorize_app(saas_domain),
                risk_level=risk_level,
                data_types=self._identify_data_types(saas_domain),
                users=self._estimate_users(),
                last_seen=datetime.now().isoformat(),
                compliance=self._check_compliance(saas_domain),
                trust_impact=self._calculate_trust_impact(risk_level),
                discovery_method="dns_analysis",
                domain=saas_domain
            )
            discovered.append(app)
            
        return discovered

    async def _discover_via_patterns(self) -> List[ShadowITApp]:
        """Pattern-based discovery of unknown tools"""
        # Simulate discovering unknown/risky tools
        unknown_tools = [
            {
                "name": "UnverifiedTool",
                "domain": "unknown-saas.com",
                "risk": RiskLevel.CRITICAL,
                "category": "Unknown"
            }
        ]
        
        discovered = []
        for tool in unknown_tools:
            app_id = str(uuid.uuid4())
            app = ShadowITApp(
                id=app_id,
                name=tool["name"],
                category=tool["category"],
                risk_level=tool["risk"],
                data_types=["Personal Data", "Business Data"],
                users=5,
                last_seen=datetime.now().isoformat(),
                compliance={"gdpr": False, "soc2": False, "iso27001": False},
                trust_impact=-50,
                discovery_method="pattern_analysis",
                domain=tool["domain"]
            )
            discovered.append(app)
            
        return discovered

    async def _discover_oauth_apps(self) -> List[ShadowITApp]:
        """Simulate OAuth app discovery"""
        # In real implementation, this would connect to Azure AD, Google Workspace etc.
        oauth_apps = []
        return oauth_apps

    def _assess_risk_level(self, domain: str) -> RiskLevel:
        """Assess risk level based on domain and compliance data"""
        # Known safe domains
        safe_domains = ["github.com", "figma.com", "notion.so"]
        if domain in safe_domains:
            return RiskLevel.LOW
        
        # Medium risk for established SaaS
        if any(known in domain for known in ["slack", "zoom", "dropbox"]):
            return RiskLevel.MEDIUM
            
        # High risk for unknown domains
        return RiskLevel.HIGH

    def _categorize_app(self, domain: str) -> str:
        """Categorize application based on domain"""
        categories = {
            "notion": "Productivity",
            "figma": "Design", 
            "slack": "Communication",
            "github": "Development",
            "zoom": "Communication",
            "dropbox": "File Storage"
        }
        
        for key, category in categories.items():
            if key in domain:
                return category
                
        return "Unknown"

    def _identify_data_types(self, domain: str) -> List[str]:
        """Identify potential data types processed"""
        high_risk_domains = ["crm", "hr", "payroll", "finance"]
        if any(risk_domain in domain.lower() for risk_domain in high_risk_domains):
            return ["Personal Data", "Financial Data", "Business Data"]
            
        return ["Business Data", "Personal Data"]

    def _estimate_users(self) -> int:
        """Estimate number of users (simplified)"""
        import random
        return random.randint(1, 50)

    def _check_compliance(self, domain: str) -> Dict[str, bool]:
        """Check compliance status for known domains"""
        # Simplified compliance check
        compliant_domains = ["github.com", "notion.so", "figma.com"]
        is_compliant = domain in compliant_domains
        
        return {
            "gdpr": is_compliant,
            "soc2": is_compliant,
            "iso27001": is_compliant
        }

    def _calculate_trust_impact(self, risk_level: RiskLevel) -> int:
        """Calculate Trust Equity impact"""
        impacts = {
            RiskLevel.LOW: -5,
            RiskLevel.MEDIUM: -15,
            RiskLevel.HIGH: -30,
            RiskLevel.CRITICAL: -50
        }
        return impacts.get(risk_level, -25)

    async def _store_shadow_it_app(self, app: ShadowITApp):
        """Store Shadow IT app in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO shadow_it_apps 
            (id, name, category, risk_level, data_types, users, last_seen, 
             compliance, trust_impact, discovery_method, domain)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            app.id, app.name, app.category, app.risk_level.value,
            json.dumps(app.data_types), app.users, app.last_seen,
            json.dumps(app.compliance), app.trust_impact,
            app.discovery_method, app.domain
        ))
        
        conn.commit()
        conn.close()

    async def process_dsar_request(self, request: DSARRequest) -> Dict[str, Any]:
        """
        Automated DSAR processing with 30-day compliance tracking
        """
        try:
            # Store DSAR request
            await self._store_dsar_request(request)
            
            # Start automated processing
            processing_result = await self._automated_dsar_processing(request)
            
            # Award Trust Equity points
            await self._award_trust_points("dsar", request.id, request.trust_points)
            
            logger.info(f"DSAR {request.id} processed successfully")
            return {
                "success": True,
                "request_id": request.id,
                "estimated_completion": processing_result["completion_date"],
                "trust_points_earned": request.trust_points
            }
            
        except Exception as e:
            logger.error(f"DSAR processing failed: {e}")
            return {"success": False, "error": str(e)}

    async def _automated_dsar_processing(self, request: DSARRequest) -> Dict[str, Any]:
        """Automated DSAR data collection and processing"""
        
        # Simulate data discovery across systems
        data_sources = await self._discover_personal_data(request.requester_email)
        
        # Estimate processing time based on data volume
        processing_days = min(25, len(data_sources) * 2)  # Max 25 days for GDPR compliance
        completion_date = (datetime.now() + timedelta(days=processing_days)).isoformat()
        
        # Create processing workflow
        workflow = {
            "data_sources": data_sources,
            "processing_steps": [
                "Data Discovery Complete",
                "Legal Review Pending", 
                "Data Extraction In Progress",
                "Quality Assurance Pending",
                "Delivery Preparation"
            ],
            "completion_date": completion_date,
            "automated_percentage": 85  # 85% automated processing
        }
        
        return workflow

    async def _discover_personal_data(self, email: str) -> List[Dict[str, Any]]:
        """Discover personal data across integrated systems"""
        # Simulate data discovery in various systems
        data_sources = [
            {"system": "CRM", "records": 156, "confidence": 0.95},
            {"system": "Email System", "records": 1247, "confidence": 0.90},
            {"system": "HR System", "records": 23, "confidence": 0.98},
            {"system": "Support Tickets", "records": 89, "confidence": 0.87}
        ]
        
        return data_sources

    async def _store_dsar_request(self, request: DSARRequest):
        """Store DSAR request in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO dsar_requests 
            (id, request_type, requester_email, submission_date, due_date, 
             status, data_subjects, estimated_records, trust_points)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            request.id, request.request_type.value, request.requester_email,
            request.submission_date, request.due_date, request.status.value,
            json.dumps(request.data_subjects), request.estimated_records,
            request.trust_points
        ))
        
        conn.commit()
        conn.close()

    async def generate_ropa_record(self, processing_activity: str, 
                                 purpose: List[str]) -> RoPARecord:
        """
        AI-powered RoPA record generation with GDPR Article 30 compliance
        """
        record_id = str(uuid.uuid4())
        
        # Use AI to determine data categories, subjects, and legal basis
        ai_analysis = await self._ai_analyze_processing_activity(processing_activity, purpose)
        
        record = RoPARecord(
            id=record_id,
            processing_activity=processing_activity,
            purpose=purpose,
            data_categories=ai_analysis["data_categories"],
            data_subjects=ai_analysis["data_subjects"],
            recipients=ai_analysis["recipients"],
            retention_period=ai_analysis["retention_period"],
            legal_basis=ai_analysis["legal_basis"],
            risk_assessment=RiskLevel(ai_analysis["risk_level"]),
            last_reviewed=datetime.now().isoformat(),
            status="compliant",
            cross_border_transfers=ai_analysis.get("cross_border_transfers", []),
            technical_measures=ai_analysis.get("technical_measures", []),
            organizational_measures=ai_analysis.get("organizational_measures", [])
        )
        
        # Store in database
        await self._store_ropa_record(record)
        
        # Award Trust Equity points
        await self._award_trust_points("ropa", record.id, 30)
        
        return record

    async def _ai_analyze_processing_activity(self, activity: str, 
                                            purposes: List[str]) -> Dict[str, Any]:
        """AI analysis of processing activity for RoPA generation"""
        
        # Simplified AI analysis (in production, use LLM API)
        analysis_templates = {
            "customer": {
                "data_categories": ["Contact Information", "Transaction History", "Preferences"],
                "data_subjects": ["Customers", "Prospects"],
                "recipients": ["Sales Team", "Support Team", "Marketing"],
                "retention_period": "7 years after contract end",
                "legal_basis": "Contract Performance (Art. 6(1)(b))",
                "risk_level": "medium",
                "technical_measures": ["Encryption at rest", "Access controls", "Audit logging"],
                "organizational_measures": ["Staff training", "Data access policies", "Incident response"]
            },
            "employee": {
                "data_categories": ["Personal Details", "Employment Records", "Performance Data"],
                "data_subjects": ["Employees", "Job Applicants"],
                "recipients": ["HR Team", "Payroll Provider", "Management"],
                "retention_period": "10 years after employment end",
                "legal_basis": "Contract Performance (Art. 6(1)(b))",
                "risk_level": "high",
                "technical_measures": ["Role-based access", "Encryption", "Regular backups"],
                "organizational_measures": ["HR policies", "Manager training", "Regular reviews"]
            }
        }
        
        # Determine template based on activity keywords
        if any(keyword in activity.lower() for keyword in ["customer", "client", "crm"]):
            return analysis_templates["customer"]
        elif any(keyword in activity.lower() for keyword in ["employee", "hr", "staff"]):
            return analysis_templates["employee"]
        else:
            # Default template
            return analysis_templates["customer"]

    async def _store_ropa_record(self, record: RoPARecord):
        """Store RoPA record in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO ropa_records 
            (id, processing_activity, purpose, data_categories, data_subjects,
             recipients, retention_period, legal_basis, risk_assessment,
             last_reviewed, status, cross_border_transfers, technical_measures,
             organizational_measures)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            record.id, record.processing_activity, json.dumps(record.purpose),
            json.dumps(record.data_categories), json.dumps(record.data_subjects),
            json.dumps(record.recipients), record.retention_period,
            record.legal_basis, record.risk_assessment.value,
            record.last_reviewed, record.status,
            json.dumps(record.cross_border_transfers or []),
            json.dumps(record.technical_measures or []),
            json.dumps(record.organizational_measures or [])
        ))
        
        conn.commit()
        conn.close()

    async def conduct_dpia(self, project_name: str, 
                          processing_description: str) -> DPIAAssessment:
        """
        Automated DPIA with risk assessment and mitigation recommendations
        """
        assessment_id = str(uuid.uuid4())
        
        # AI-powered risk analysis
        risk_analysis = await self._ai_risk_assessment(project_name, processing_description)
        
        assessment = DPIAAssessment(
            id=assessment_id,
            project_name=project_name,
            assessment_type="mandatory" if risk_analysis["high_risk"] else "voluntary",
            risk_level=RiskLevel(risk_analysis["overall_risk"]),
            status="draft",
            created_date=datetime.now().isoformat(),
            completion_percentage=0,
            risks=risk_analysis["risks"],
            trust_equity_impact=risk_analysis["trust_impact"],
            data_flows=risk_analysis.get("data_flows", []),
            stakeholders=risk_analysis.get("stakeholders", [])
        )
        
        # Store assessment
        await self._store_dpia_assessment(assessment)
        
        return assessment

    async def _ai_risk_assessment(self, project_name: str, 
                                description: str) -> Dict[str, Any]:
        """AI-powered privacy risk assessment"""
        
        # Simplified risk assessment (in production, use advanced NLP/ML)
        high_risk_keywords = ["ai", "machine learning", "profiling", "automated", 
                             "biometric", "location", "children", "health"]
        
        is_high_risk = any(keyword in description.lower() for keyword in high_risk_keywords)
        
        # Generate risks based on project type
        risks = []
        if "ai" in description.lower() or "machine learning" in description.lower():
            risks.extend([
                DPIARisk(
                    category="Algorithmic Bias",
                    likelihood=4,
                    impact=4,
                    mitigation="Implement bias testing and diverse training data"
                ),
                DPIARisk(
                    category="Automated Decision Making",
                    likelihood=5,
                    impact=3,
                    mitigation="Provide human review mechanisms and explanation rights"
                )
            ])
        
        if any(keyword in description.lower() for keyword in ["personal", "customer", "user"]):
            risks.append(
                DPIARisk(
                    category="Data Subject Rights",
                    likelihood=3,
                    impact=4,
                    mitigation="Implement automated consent management and data portability"
                )
            )
        
        # Calculate overall risk and trust impact
        if risks:
            avg_risk = sum((r.likelihood * r.impact) for r in risks) / len(risks)
            if avg_risk >= 15:
                overall_risk = "high"
                trust_impact = 200
            elif avg_risk >= 10:
                overall_risk = "medium"  
                trust_impact = 120
            else:
                overall_risk = "low"
                trust_impact = 80
        else:
            overall_risk = "low"
            trust_impact = 50
            
        return {
            "high_risk": is_high_risk,
            "overall_risk": overall_risk,
            "risks": risks,
            "trust_impact": trust_impact,
            "data_flows": [],
            "stakeholders": ["Data Protection Officer", "Project Manager", "Legal Team"]
        }

    async def _store_dpia_assessment(self, assessment: DPIAAssessment):
        """Store DPIA assessment in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Convert risks to JSON
        risks_json = json.dumps([asdict(risk) for risk in assessment.risks])
        
        cursor.execute('''
            INSERT OR REPLACE INTO dpia_assessments 
            (id, project_name, assessment_type, risk_level, status,
             created_date, completion_percentage, risks, trust_equity_impact,
             data_flows, stakeholders)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            assessment.id, assessment.project_name, assessment.assessment_type,
            assessment.risk_level.value, assessment.status,
            assessment.created_date, assessment.completion_percentage,
            risks_json, assessment.trust_equity_impact,
            json.dumps(assessment.data_flows or []),
            json.dumps(assessment.stakeholders or [])
        ))
        
        conn.commit()
        conn.close()

    async def _award_trust_points(self, event_type: str, entity_id: str, points: int):
        """Award Trust Equity points for privacy activities"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        event_id = str(uuid.uuid4())
        description = f"Privacy management activity: {event_type}"
        
        cursor.execute('''
            INSERT INTO trust_equity_events 
            (id, event_type, entity_id, points_earned, description)
            VALUES (?, ?, ?, ?, ?)
        ''', (event_id, event_type, entity_id, points, description))
        
        conn.commit()
        conn.close()
        
        logger.info(f"Awarded {points} Trust Equity points for {event_type}")

    def get_privacy_dashboard_data(self) -> Dict[str, Any]:
        """Get comprehensive privacy dashboard data"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get counts and stats
        cursor.execute("SELECT COUNT(*), risk_level FROM shadow_it_apps GROUP BY risk_level")
        shadow_it_stats = dict(cursor.fetchall())
        
        cursor.execute("SELECT COUNT(*), status FROM dsar_requests GROUP BY status")
        dsar_stats = dict(cursor.fetchall())
        
        cursor.execute("SELECT COUNT(*), status FROM ropa_records GROUP BY status")
        ropa_stats = dict(cursor.fetchall())
        
        cursor.execute("SELECT COUNT(*), status FROM dpia_assessments GROUP BY status")
        dpia_stats = dict(cursor.fetchall())
        
        # Calculate total Trust Equity points from privacy activities
        cursor.execute("SELECT SUM(points_earned) FROM trust_equity_events")
        total_trust_points = cursor.fetchone()[0] or 0
        
        conn.close()
        
        return {
            "shadow_it": shadow_it_stats,
            "dsar": dsar_stats, 
            "ropa": ropa_stats,
            "dpia": dpia_stats,
            "total_trust_points": total_trust_points,
            "compliance_score": self._calculate_privacy_compliance_score()
        }

    def _calculate_privacy_compliance_score(self) -> int:
        """Calculate overall privacy compliance score"""
        # Simplified scoring algorithm
        # In production, this would be more sophisticated
        base_score = 85
        
        # Bonus points for proactive privacy management
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Deduct points for high-risk Shadow IT
        cursor.execute("SELECT COUNT(*) FROM shadow_it_apps WHERE risk_level IN ('high', 'critical')")
        high_risk_apps = cursor.fetchone()[0]
        score_deduction = high_risk_apps * 5
        
        # Add points for completed DPIAs
        cursor.execute("SELECT COUNT(*) FROM dpia_assessments WHERE status = 'approved'")
        completed_dpias = cursor.fetchone()[0]
        score_bonus = completed_dpias * 10
        
        conn.close()
        
        final_score = min(100, max(0, base_score - score_deduction + score_bonus))
        return final_score

# API Endpoints for FastAPI integration
async def main():
    """Example usage of Privacy Management Suite"""
    privacy_manager = PrivacyManager()
    
    # Test Shadow IT discovery
    print("Running Shadow IT discovery...")
    shadow_apps = await privacy_manager.discover_shadow_it("company.com")
    print(f"Found {len(shadow_apps)} Shadow IT applications")
    
    # Test DSAR processing
    print("\nProcessing DSAR request...")
    dsar_request = DSARRequest(
        id=str(uuid.uuid4()),
        request_type=DSARType.ACCESS,
        requester_email="test@example.com",
        submission_date=datetime.now().isoformat(),
        due_date=(datetime.now() + timedelta(days=30)).isoformat(),
        status=DSARStatus.PENDING,
        data_subjects=["test@example.com"],
        estimated_records=1000,
        trust_points=25
    )
    
    result = await privacy_manager.process_dsar_request(dsar_request)
    print(f"DSAR processing result: {result}")
    
    # Test RoPA generation
    print("\nGenerating RoPA record...")
    ropa_record = await privacy_manager.generate_ropa_record(
        "Customer Data Management",
        ["Contract Performance", "Customer Service"]
    )
    print(f"Generated RoPA record: {ropa_record.id}")
    
    # Test DPIA
    print("\nConducting DPIA...")
    dpia = await privacy_manager.conduct_dpia(
        "AI-Powered Customer Analytics",
        "Machine learning system for customer behavior analysis and personalized recommendations"
    )
    print(f"DPIA created: {dpia.id} with {len(dpia.risks)} risks identified")
    
    # Get dashboard data
    print("\nPrivacy Dashboard Summary:")
    dashboard_data = privacy_manager.get_privacy_dashboard_data()
    print(f"Privacy compliance score: {dashboard_data['compliance_score']}%")
    print(f"Total Trust Equity points: {dashboard_data['total_trust_points']}")

if __name__ == "__main__":
    asyncio.run(main())