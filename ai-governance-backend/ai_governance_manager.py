"""
ERIP AI Governance Module Backend
Handles ISO 42001, AI System Registry, Risk Assessments, and Training
Reuses common database and Trust Equity patterns from privacy_manager.py
"""

import sqlite3
import json
import logging
import asyncio
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum
import sys
import os

# Add parent directory to path to import shared modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import shared patterns from privacy backend
try:
    from privacy_backend.privacy_manager import RiskLevel
except ImportError:
    # Define locally if import fails
    class RiskLevel(Enum):
        LOW = "low"
        MEDIUM = "medium" 
        HIGH = "high"
        CRITICAL = "critical"

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AISystemType(Enum):
    ML_MODEL = "ml_model"
    LLM = "llm"
    COMPUTER_VISION = "computer_vision"
    NLP = "nlp"
    AUTOMATION = "automation"
    DECISION_SUPPORT = "decision_support"

class AIRiskCategory(Enum):
    MINIMAL = "minimal"
    LIMITED = "limited" 
    HIGH = "high"
    UNACCEPTABLE = "unacceptable"

class ImplementationStatus(Enum):
    NOT_IMPLEMENTED = "not_implemented"
    PARTIAL = "partial"
    IMPLEMENTED = "implemented"
    FULLY_COMPLIANT = "fully_compliant"

@dataclass
class AISystem:
    id: str
    name: str
    type: AISystemType
    risk_level: AIRiskCategory
    eu_ai_act_category: str
    owner: str
    department: str
    status: str  # development, testing, production, deprecated
    description: str
    data_types: List[str]
    business_impact: str
    compliance_score: int = 0
    trust_impact: int = 0
    last_assessed: Optional[str] = None

@dataclass
class ISO42001Control:
    id: str
    category: str
    control_id: str
    title: str
    description: str
    implementation: ImplementationStatus
    evidence: List[str]
    responsible_party: str
    last_reviewed: str
    next_review: str
    trust_points: int

@dataclass
class AIRiskAssessment:
    id: str
    ai_system_id: str
    assessment_type: str  # pre_deployment, periodic, incident_driven
    risks: List[Dict[str, Any]]
    overall_risk_level: RiskLevel
    assessment_date: str
    next_review: str
    approval_status: str  # pending, approved, rejected
    trust_equity_impact: int

@dataclass
class AITrainingModule:
    id: str
    title: str
    category: str  # ethics, technical, legal, bias_prevention, responsible_ai
    duration_minutes: int
    completion_rate: float
    participants: int
    last_updated: str
    trust_points: int
    mandatory: bool

class AIGovernanceManager:
    def __init__(self, db_path: str = "ai_governance.db"):
        self.db_path = db_path
        self.init_database()
        
    def init_database(self):
        """Initialize SQLite database with AI governance tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # AI Systems Registry table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ai_systems (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                risk_level TEXT NOT NULL,
                eu_ai_act_category TEXT,
                owner TEXT,
                department TEXT,
                status TEXT,
                description TEXT,
                data_types TEXT,  -- JSON array
                business_impact TEXT,
                compliance_score INTEGER DEFAULT 0,
                trust_impact INTEGER DEFAULT 0,
                last_assessed TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # ISO 42001 Controls table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS iso42001_controls (
                id TEXT PRIMARY KEY,
                category TEXT NOT NULL,
                control_id TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                implementation TEXT NOT NULL,
                evidence TEXT,  -- JSON array
                responsible_party TEXT,
                last_reviewed TEXT,
                next_review TEXT,
                trust_points INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # AI Risk Assessments table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ai_risk_assessments (
                id TEXT PRIMARY KEY,
                ai_system_id TEXT NOT NULL,
                assessment_type TEXT NOT NULL,
                risks TEXT,  -- JSON array
                overall_risk_level TEXT,
                assessment_date TEXT,
                next_review TEXT,
                approval_status TEXT,
                trust_equity_impact INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (ai_system_id) REFERENCES ai_systems (id)
            )
        ''')
        
        # AI Training Modules table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ai_training_modules (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                duration_minutes INTEGER,
                completion_rate REAL DEFAULT 0.0,
                participants INTEGER DEFAULT 0,
                last_updated TEXT,
                trust_points INTEGER DEFAULT 0,
                mandatory BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Trust Equity Events table (shared pattern)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ai_trust_equity_events (
                id TEXT PRIMARY KEY,
                event_type TEXT NOT NULL,
                entity_id TEXT NOT NULL,
                points_earned INTEGER,
                description TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("AI Governance database initialized successfully")

    async def register_ai_system(self, system: AISystem) -> Dict[str, Any]:
        """Register new AI system in the registry"""
        try:
            # Store AI system
            await self._store_ai_system(system)
            
            # Award Trust Equity points for registration
            await self._award_trust_points("ai_system_registration", system.id, 50)
            
            # Trigger initial risk assessment for high-risk systems
            if system.risk_level in [AIRiskCategory.HIGH, AIRiskCategory.UNACCEPTABLE]:
                await self._trigger_initial_risk_assessment(system)
            
            logger.info(f"AI System {system.name} registered successfully")
            return {
                "success": True,
                "system_id": system.id,
                "trust_points_earned": 50,
                "requires_risk_assessment": system.risk_level in [AIRiskCategory.HIGH, AIRiskCategory.UNACCEPTABLE]
            }
            
        except Exception as e:
            logger.error(f"AI system registration failed: {e}")
            return {"success": False, "error": str(e)}

    async def _store_ai_system(self, system: AISystem):
        """Store AI system in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO ai_systems 
            (id, name, type, risk_level, eu_ai_act_category, owner, department,
             status, description, data_types, business_impact, compliance_score,
             trust_impact, last_assessed)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            system.id, system.name, system.type.value, system.risk_level.value,
            system.eu_ai_act_category, system.owner, system.department,
            system.status, system.description, json.dumps(system.data_types),
            system.business_impact, system.compliance_score,
            system.trust_impact, system.last_assessed
        ))
        
        conn.commit()
        conn.close()

    async def discover_ai_systems(self) -> List[AISystem]:
        """
        Automated AI system discovery using multiple methods:
        1. Code repository scanning
        2. ML model registry integration
        3. Container/deployment scanning
        4. API endpoint analysis
        """
        discovered_systems = []
        
        try:
            # Method 1: Simulate ML framework detection
            ml_systems = await self._discover_ml_frameworks()
            discovered_systems.extend(ml_systems)
            
            # Method 2: Simulate API endpoint scanning for AI services
            api_systems = await self._discover_ai_apis()
            discovered_systems.extend(api_systems)
            
            # Method 3: Simulate container scanning for AI workloads
            container_systems = await self._discover_ai_containers()
            discovered_systems.extend(container_systems)
            
            # Store discovered systems
            for system in discovered_systems:
                await self._store_ai_system(system)
                
            logger.info(f"AI system discovery complete: {len(discovered_systems)} systems found")
            return discovered_systems
            
        except Exception as e:
            logger.error(f"AI system discovery failed: {e}")
            return []

    async def _discover_ml_frameworks(self) -> List[AISystem]:
        """Simulate discovery of ML frameworks and models"""
        # Common ML/AI frameworks to detect
        frameworks = [
            {"name": "Customer Service Chatbot", "type": AISystemType.LLM, "risk": AIRiskCategory.LIMITED},
            {"name": "Resume Screening AI", "type": AISystemType.ML_MODEL, "risk": AIRiskCategory.HIGH},
            {"name": "Fraud Detection System", "type": AISystemType.ML_MODEL, "risk": AIRiskCategory.HIGH}
        ]
        
        discovered = []
        for fw in frameworks:
            system_id = str(uuid.uuid4())
            system = AISystem(
                id=system_id,
                name=fw["name"],
                type=fw["type"],
                risk_level=fw["risk"],
                eu_ai_act_category=self._determine_eu_ai_act_category(fw["risk"]),
                owner="System Discovery",
                department="IT",
                status="production",
                description=f"Discovered {fw['type'].value} system",
                data_types=self._determine_data_types(fw["type"]),
                business_impact=self._assess_business_impact(fw["risk"]),
                compliance_score=70,
                trust_impact=self._calculate_trust_impact(fw["risk"]),
                last_assessed=datetime.now().isoformat()
            )
            discovered.append(system)
            
        return discovered

    async def _discover_ai_apis(self) -> List[AISystem]:
        """Simulate discovery of AI API endpoints"""
        # In production, this would scan API gateways, OpenAPI specs, etc.
        return []

    async def _discover_ai_containers(self) -> List[AISystem]:
        """Simulate discovery of AI containers and workloads"""
        # In production, this would scan container registries, Kubernetes, etc.
        return []

    def _determine_eu_ai_act_category(self, risk_level: AIRiskCategory) -> str:
        """Determine EU AI Act category based on risk level"""
        categories = {
            AIRiskCategory.MINIMAL: "Minimal Risk AI System",
            AIRiskCategory.LIMITED: "Limited Risk AI System", 
            AIRiskCategory.HIGH: "High Risk AI System",
            AIRiskCategory.UNACCEPTABLE: "Prohibited AI System"
        }
        return categories.get(risk_level, "Unclassified")

    def _determine_data_types(self, ai_type: AISystemType) -> List[str]:
        """Determine likely data types based on AI system type"""
        data_mapping = {
            AISystemType.LLM: ["Text Data", "User Interactions"],
            AISystemType.ML_MODEL: ["Personal Data", "Business Data"],
            AISystemType.COMPUTER_VISION: ["Image Data", "Video Data"],
            AISystemType.NLP: ["Text Data", "Communication Data"],
            AISystemType.AUTOMATION: ["Process Data", "System Data"],
            AISystemType.DECISION_SUPPORT: ["Business Data", "Analytics Data"]
        }
        return data_mapping.get(ai_type, ["Unknown Data"])

    def _assess_business_impact(self, risk_level: AIRiskCategory) -> str:
        """Assess business impact based on risk level"""
        impact_mapping = {
            AIRiskCategory.MINIMAL: "low",
            AIRiskCategory.LIMITED: "medium",
            AIRiskCategory.HIGH: "high", 
            AIRiskCategory.UNACCEPTABLE: "critical"
        }
        return impact_mapping.get(risk_level, "medium")

    def _calculate_trust_impact(self, risk_level: AIRiskCategory) -> int:
        """Calculate Trust Equity impact based on proper management"""
        impact_mapping = {
            AIRiskCategory.MINIMAL: 25,
            AIRiskCategory.LIMITED: 50,
            AIRiskCategory.HIGH: 100,
            AIRiskCategory.UNACCEPTABLE: 200  # High points for managing prohibited systems
        }
        return impact_mapping.get(risk_level, 50)

    async def _trigger_initial_risk_assessment(self, system: AISystem):
        """Trigger initial risk assessment for high-risk AI systems"""
        assessment_id = str(uuid.uuid4())
        
        # Generate initial risks based on system type and risk level
        risks = await self._generate_ai_risks(system)
        
        assessment = AIRiskAssessment(
            id=assessment_id,
            ai_system_id=system.id,
            assessment_type="pre_deployment",
            risks=risks,
            overall_risk_level=RiskLevel.HIGH if system.risk_level == AIRiskCategory.HIGH else RiskLevel.CRITICAL,
            assessment_date=datetime.now().isoformat(),
            next_review=(datetime.now() + timedelta(days=90)).isoformat(),
            approval_status="pending",
            trust_equity_impact=150
        )
        
        await self._store_risk_assessment(assessment)

    async def _generate_ai_risks(self, system: AISystem) -> List[Dict[str, Any]]:
        """Generate AI-specific risks based on system characteristics"""
        risks = []
        
        # Common AI risks based on system type
        if system.type in [AISystemType.ML_MODEL, AISystemType.LLM]:
            risks.append({
                "category": "Bias and Discrimination",
                "description": f"Potential algorithmic bias in {system.name}",
                "likelihood": 4,
                "impact": 4,
                "mitigation": "Bias testing, diverse training data, regular audits",
                "residual_risk": 2
            })
            
        if "Personal Data" in system.data_types:
            risks.append({
                "category": "Privacy Violation", 
                "description": "Processing of personal data without adequate safeguards",
                "likelihood": 3,
                "impact": 5,
                "mitigation": "Data minimization, encryption, access controls",
                "residual_risk": 2
            })
            
        if system.type == AISystemType.DECISION_SUPPORT:
            risks.append({
                "category": "Automated Decision Making",
                "description": "Lack of human oversight in automated decisions",
                "likelihood": 4,
                "impact": 3,
                "mitigation": "Human-in-the-loop design, explanation mechanisms",
                "residual_risk": 2
            })
            
        return risks

    async def implement_iso42001_control(self, control: ISO42001Control) -> Dict[str, Any]:
        """Implement ISO 42001 control with evidence tracking"""
        try:
            # Store control implementation
            await self._store_iso42001_control(control)
            
            # Award Trust Equity points based on implementation level
            points = self._calculate_control_points(control.implementation)
            await self._award_trust_points("iso42001_control", control.id, points)
            
            logger.info(f"ISO 42001 control {control.control_id} implemented")
            return {
                "success": True,
                "control_id": control.id,
                "trust_points_earned": points,
                "implementation_level": control.implementation.value
            }
            
        except Exception as e:
            logger.error(f"ISO 42001 control implementation failed: {e}")
            return {"success": False, "error": str(e)}

    def _calculate_control_points(self, implementation: ImplementationStatus) -> int:
        """Calculate Trust Equity points based on control implementation level"""
        points_mapping = {
            ImplementationStatus.NOT_IMPLEMENTED: 0,
            ImplementationStatus.PARTIAL: 25,
            ImplementationStatus.IMPLEMENTED: 50,
            ImplementationStatus.FULLY_COMPLIANT: 75
        }
        return points_mapping.get(implementation, 0)

    async def _store_iso42001_control(self, control: ISO42001Control):
        """Store ISO 42001 control in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO iso42001_controls 
            (id, category, control_id, title, description, implementation,
             evidence, responsible_party, last_reviewed, next_review, trust_points)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            control.id, control.category, control.control_id, control.title,
            control.description, control.implementation.value,
            json.dumps(control.evidence), control.responsible_party,
            control.last_reviewed, control.next_review, control.trust_points
        ))
        
        conn.commit()
        conn.close()

    async def _store_risk_assessment(self, assessment: AIRiskAssessment):
        """Store AI risk assessment in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO ai_risk_assessments 
            (id, ai_system_id, assessment_type, risks, overall_risk_level,
             assessment_date, next_review, approval_status, trust_equity_impact)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            assessment.id, assessment.ai_system_id, assessment.assessment_type,
            json.dumps(assessment.risks), assessment.overall_risk_level.value,
            assessment.assessment_date, assessment.next_review,
            assessment.approval_status, assessment.trust_equity_impact
        ))
        
        conn.commit()
        conn.close()

    async def create_training_module(self, module: AITrainingModule) -> Dict[str, Any]:
        """Create AI training module"""
        try:
            await self._store_training_module(module)
            
            # Award Trust Equity points for creating training
            await self._award_trust_points("ai_training_creation", module.id, 30)
            
            logger.info(f"AI training module {module.title} created")
            return {
                "success": True,
                "module_id": module.id,
                "trust_points_earned": 30
            }
            
        except Exception as e:
            logger.error(f"Training module creation failed: {e}")
            return {"success": False, "error": str(e)}

    async def _store_training_module(self, module: AITrainingModule):
        """Store training module in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO ai_training_modules 
            (id, title, category, duration_minutes, completion_rate,
             participants, last_updated, trust_points, mandatory)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            module.id, module.title, module.category, module.duration_minutes,
            module.completion_rate, module.participants, module.last_updated,
            module.trust_points, module.mandatory
        ))
        
        conn.commit()
        conn.close()

    async def _award_trust_points(self, event_type: str, entity_id: str, points: int):
        """Award Trust Equity points for AI governance activities"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        event_id = str(uuid.uuid4())
        description = f"AI governance activity: {event_type}"
        
        cursor.execute('''
            INSERT INTO ai_trust_equity_events 
            (id, event_type, entity_id, points_earned, description)
            VALUES (?, ?, ?, ?, ?)
        ''', (event_id, event_type, entity_id, points, description))
        
        conn.commit()
        conn.close()
        
        logger.info(f"Awarded {points} Trust Equity points for {event_type}")

    def get_ai_governance_dashboard(self) -> Dict[str, Any]:
        """Get comprehensive AI governance dashboard data"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # AI Systems stats
        cursor.execute("SELECT COUNT(*), risk_level FROM ai_systems GROUP BY risk_level")
        ai_systems_stats = dict(cursor.fetchall())
        
        # ISO 42001 Controls stats
        cursor.execute("SELECT COUNT(*), implementation FROM iso42001_controls GROUP BY implementation")
        controls_stats = dict(cursor.fetchall())
        
        # Risk Assessments stats
        cursor.execute("SELECT COUNT(*), approval_status FROM ai_risk_assessments GROUP BY approval_status")
        risk_stats = dict(cursor.fetchall())
        
        # Training stats
        cursor.execute("SELECT AVG(completion_rate), COUNT(*) FROM ai_training_modules")
        training_data = cursor.fetchone()
        
        # Total Trust Equity points
        cursor.execute("SELECT SUM(points_earned) FROM ai_trust_equity_events")
        total_trust_points = cursor.fetchone()[0] or 0
        
        conn.close()
        
        return {
            "ai_systems": ai_systems_stats,
            "iso42001_controls": controls_stats,
            "risk_assessments": risk_stats,
            "training": {
                "average_completion": training_data[0] or 0,
                "total_modules": training_data[1] or 0
            },
            "total_trust_points": total_trust_points,
            "ai_governance_score": self._calculate_ai_governance_score()
        }

    def _calculate_ai_governance_score(self) -> int:
        """Calculate overall AI governance maturity score"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        base_score = 80
        
        # Bonus for AI system registration
        cursor.execute("SELECT COUNT(*) FROM ai_systems")
        registered_systems = cursor.fetchone()[0]
        registration_bonus = min(20, registered_systems * 2)
        
        # Bonus for ISO 42001 implementation
        cursor.execute("SELECT COUNT(*) FROM iso42001_controls WHERE implementation IN ('implemented', 'fully_compliant')")
        implemented_controls = cursor.fetchone()[0]
        controls_bonus = min(15, implemented_controls * 3)
        
        # Bonus for completed risk assessments
        cursor.execute("SELECT COUNT(*) FROM ai_risk_assessments WHERE approval_status = 'approved'")
        approved_assessments = cursor.fetchone()[0]
        assessment_bonus = min(10, approved_assessments * 5)
        
        conn.close()
        
        final_score = min(100, base_score + registration_bonus + controls_bonus + assessment_bonus)
        return final_score

# Example usage
async def main():
    """Example usage of AI Governance Manager"""
    ai_gov = AIGovernanceManager()
    
    # Test AI system registration
    print("Registering AI system...")
    ai_system = AISystem(
        id=str(uuid.uuid4()),
        name="Customer Behavior Analytics",
        type=AISystemType.ML_MODEL,
        risk_level=AIRiskCategory.HIGH,
        eu_ai_act_category="High Risk AI System",
        owner="Data Science Team",
        department="Analytics",
        status="development",
        description="ML model for customer behavior prediction",
        data_types=["Personal Data", "Behavioral Data"],
        business_impact="high"
    )
    
    result = await ai_gov.register_ai_system(ai_system)
    print(f"Registration result: {result}")
    
    # Test AI system discovery
    print("\nRunning AI system discovery...")
    discovered = await ai_gov.discover_ai_systems()
    print(f"Discovered {len(discovered)} AI systems")
    
    # Get dashboard data
    print("\nAI Governance Dashboard:")
    dashboard = ai_gov.get_ai_governance_dashboard()
    print(f"AI Governance Score: {dashboard['ai_governance_score']}%")
    print(f"Total Trust Points: {dashboard['total_trust_points']}")

if __name__ == "__main__":
    asyncio.run(main())