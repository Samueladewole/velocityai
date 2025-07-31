#!/usr/bin/env python3
"""
ISAE 3000 Evidence Agent - Velocity.ai Specialized Agent
Automated evidence collection and categorization for ISAE 3000 assurance engagements

Features:
- Multi-system evidence collection and integration
- Automated control testing and validation
- Real-time audit trail generation
- Banking-specific control frameworks (CC1-CC9)
- Continuous compliance monitoring
- Audit-ready evidence packages
- Cross-framework evidence mapping
"""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional, Set, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from enum import Enum
import uuid
import hashlib
import sqlite3
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('isae3000-evidence-agent')

class ControlCategory(Enum):
    CC1 = "Control Environment"
    CC2 = "Communication and Information" 
    CC3 = "Risk Assessment"
    CC4 = "Monitoring Activities"
    CC5 = "Control Activities"
    CC6 = "Logical and Physical Access Controls"
    CC7 = "System Operations"
    CC8 = "Change Management"
    CC9 = "Risk Mitigation"

class EvidenceType(Enum):
    POLICY_DOCUMENT = "policy-document"
    SYSTEM_CONFIGURATION = "system-configuration"
    ACCESS_LOG = "access-log"
    TRANSACTION_LOG = "transaction-log"
    RECONCILIATION = "reconciliation"
    APPROVAL_WORKFLOW = "approval-workflow"
    TRAINING_RECORD = "training-record"
    AUDIT_REPORT = "audit-report"
    RISK_ASSESSMENT = "risk-assessment"
    CHANGE_REQUEST = "change-request"
    EXCEPTION_REPORT = "exception-report"
    MONITORING_REPORT = "monitoring-report"

class TestingResult(Enum):
    PASSED = "passed"
    FAILED = "failed"
    NOT_APPLICABLE = "not-applicable"
    MANUAL_REVIEW = "manual-review"

@dataclass
class EvidenceItem:
    """Individual piece of evidence for ISAE 3000 controls"""
    id: str
    source_system: str
    evidence_type: EvidenceType
    control_ids: List[str]
    collection_timestamp: datetime
    evidence_hash: str
    description: str
    file_path: Optional[str]
    metadata: Dict[str, Any]
    validation_status: str
    risk_level: str
    automated_testing_result: Optional[TestingResult]
    manual_review_required: bool
    audit_trail: List[Dict[str, Any]]

@dataclass
class ControlTest:
    """ISAE 3000 control testing definition and results"""
    id: str
    control_id: str
    control_category: ControlCategory
    test_name: str
    test_description: str
    test_procedure: str
    frequency: str  # continuous, daily, weekly, monthly, quarterly, annually
    expected_result: str
    actual_result: Optional[str]
    test_status: TestingResult
    last_test_date: Optional[datetime]
    next_test_date: Optional[datetime]
    evidence_items: List[str]  # Evidence item IDs
    exceptions: List[Dict[str, Any]]
    automation_level: float  # 0.0 to 1.0

@dataclass
class BankingControl:
    """Banking-specific ISAE 3000 control definition"""
    id: str
    category: ControlCategory
    subcategory: str
    title: str
    description: str
    banking_specific: bool
    regulatory_requirements: List[str]
    risk_level: str
    control_activities: List[str]
    expected_evidence: List[EvidenceType]
    automation_percentage: float
    testing_frequency: str
    responsible_parties: List[str]

class ISAE3000EvidenceAgent:
    """Specialized AI Agent for ISAE 3000 Evidence Collection and Testing"""
    
    def __init__(self, config: Dict[str, Any]):
        self.agent_id = config.get('agent_id', f'isae3000-agent-{uuid.uuid4().hex[:8]}')
        self.config = config
        self.evidence_items: Dict[str, EvidenceItem] = {}
        self.control_tests: Dict[str, ControlTest] = {}
        self.banking_controls: Dict[str, BankingControl] = {}
        self.connected_systems: Set[str] = set()
        self.monitoring_active = False
        
        # Initialize database for evidence storage
        self.db_path = config.get('database_path', f'/tmp/isae3000_evidence_{self.agent_id}.db')
        self._initialize_database()
        
        # Initialize banking-specific controls
        self._initialize_banking_controls()
        
        logger.info(f"🏛️ ISAE 3000 Evidence Agent {self.agent_id} initialized")

    def _initialize_database(self):
        """Initialize SQLite database for evidence storage"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS evidence_items (
                    id TEXT PRIMARY KEY,
                    source_system TEXT,
                    evidence_type TEXT,
                    control_ids TEXT,
                    collection_timestamp TEXT,
                    evidence_hash TEXT,
                    description TEXT,
                    file_path TEXT,
                    metadata TEXT,
                    validation_status TEXT,
                    risk_level TEXT,
                    automated_testing_result TEXT,
                    manual_review_required BOOLEAN,
                    audit_trail TEXT
                )
            ''')
            
            conn.execute('''
                CREATE TABLE IF NOT EXISTS control_tests (
                    id TEXT PRIMARY KEY,
                    control_id TEXT,
                    control_category TEXT,
                    test_name TEXT,
                    test_description TEXT,
                    test_procedure TEXT,
                    frequency TEXT,
                    expected_result TEXT,
                    actual_result TEXT,
                    test_status TEXT,
                    last_test_date TEXT,
                    next_test_date TEXT,
                    evidence_items TEXT,
                    exceptions TEXT,
                    automation_level REAL
                )
            ''')
            
            conn.commit()

    def _initialize_banking_controls(self):
        """Initialize banking-specific ISAE 3000 controls"""
        banking_controls = [
            BankingControl(
                id="CC1.1-Banking-Ethics",
                category=ControlCategory.CC1,
                subcategory="Integrity and Ethical Values",
                title="Banking Ethics and Conduct Framework",
                description="The entity demonstrates a commitment to integrity and ethical values in banking operations",
                banking_specific=True,
                regulatory_requirements=["Basel III", "Dodd-Frank", "MiFID II"],
                risk_level="high",
                control_activities=[
                    "Code of conduct specific to banking operations",
                    "Ethics training for banking personnel",
                    "Disciplinary procedures for ethical violations",
                    "Whistleblower protection programs"
                ],
                expected_evidence=[
                    EvidenceType.POLICY_DOCUMENT,
                    EvidenceType.TRAINING_RECORD,
                    EvidenceType.AUDIT_REPORT
                ],
                automation_percentage=0.85,
                testing_frequency="quarterly",
                responsible_parties=["Compliance Officer", "HR Department", "Legal Counsel"]
            ),
            
            BankingControl(
                id="CC2.1-Banking-Risk",
                category=ControlCategory.CC3,
                subcategory="Banking Risk Assessment",
                title="Comprehensive Banking Risk Assessment Framework",
                description="The entity identifies risks relevant to banking operations and business objectives",
                banking_specific=True,
                regulatory_requirements=["Basel III", "COSO", "FRBM"],
                risk_level="high",
                control_activities=[
                    "Credit risk assessment procedures",
                    "Operational risk identification frameworks", 
                    "Market risk evaluation processes",
                    "Liquidity risk monitoring systems"
                ],
                expected_evidence=[
                    EvidenceType.RISK_ASSESSMENT,
                    EvidenceType.MONITORING_REPORT,
                    EvidenceType.EXCEPTION_REPORT
                ],
                automation_percentage=0.92,
                testing_frequency="monthly",
                responsible_parties=["Chief Risk Officer", "Risk Management Committee"]
            ),
            
            BankingControl(
                id="CC6.1-Banking-Access",
                category=ControlCategory.CC6,
                subcategory="Banking System Access Controls",
                title="Core Banking System Access Controls",
                description="The entity restricts logical access to banking systems and customer data",
                banking_specific=True,
                regulatory_requirements=["PCI DSS", "SOX", "GLBA"],
                risk_level="high",
                control_activities=[
                    "Multi-factor authentication for banking systems",
                    "Role-based access controls for banking functions",
                    "Segregation of duties in transaction processing",
                    "Regular access reviews for banking personnel"
                ],
                expected_evidence=[
                    EvidenceType.ACCESS_LOG,
                    EvidenceType.SYSTEM_CONFIGURATION,
                    EvidenceType.AUDIT_REPORT
                ],
                automation_percentage=0.95,
                testing_frequency="continuous",
                responsible_parties=["IT Security Team", "Access Management Team"]
            ),
            
            BankingControl(
                id="CC7.1-Banking-Transactions",
                category=ControlCategory.CC7,
                subcategory="Banking Transaction Processing",
                title="Banking Transaction Processing Controls",
                description="The entity processes banking transactions in a controlled and secure manner",
                banking_specific=True,
                regulatory_requirements=["Fed regulations", "NACHA rules", "SWIFT standards"],
                risk_level="high",
                control_activities=[
                    "Automated transaction validation rules",
                    "Transaction limit controls and monitoring",
                    "Exception handling and escalation procedures",
                    "End-of-day processing reconciliation controls"
                ],
                expected_evidence=[
                    EvidenceType.TRANSACTION_LOG,
                    EvidenceType.RECONCILIATION,
                    EvidenceType.EXCEPTION_REPORT,
                    EvidenceType.MONITORING_REPORT
                ],
                automation_percentage=0.96,
                testing_frequency="continuous",
                responsible_parties=["Operations Team", "Transaction Processing Unit"]
            ),
            
            BankingControl(
                id="CC8.1-Banking-Changes",
                category=ControlCategory.CC8,
                subcategory="Banking System Change Management",
                title="Core Banking System Change Management",
                description="The entity manages changes to banking systems through appropriate controls",
                banking_specific=True,
                regulatory_requirements=["SOX", "Basel III", "OCC guidelines"],
                risk_level="medium",
                control_activities=[
                    "Change approval processes for banking systems",
                    "Testing requirements for banking system changes",
                    "Rollback procedures for failed changes",
                    "Regulatory notification for material changes"
                ],
                expected_evidence=[
                    EvidenceType.CHANGE_REQUEST,
                    EvidenceType.APPROVAL_WORKFLOW,
                    EvidenceType.AUDIT_REPORT
                ],
                automation_percentage=0.90,
                testing_frequency="monthly",
                responsible_parties=["Change Management Board", "IT Operations"]
            )
        ]
        
        for control in banking_controls:
            self.banking_controls[control.id] = control
            
        logger.info(f"📋 Initialized {len(banking_controls)} banking-specific controls")

    async def connect_to_systems(self, systems: List[str]) -> Dict[str, bool]:
        """Connect to multiple banking systems for evidence collection"""
        logger.info(f"🔌 Connecting to {len(systems)} systems for evidence collection")
        
        connection_results = {}
        
        for system in systems:
            try:
                # Simulate system connection
                await asyncio.sleep(0.1)
                
                if await self._test_system_connection(system):
                    self.connected_systems.add(system)
                    connection_results[system] = True
                    logger.info(f"✅ Connected to {system}")
                else:
                    connection_results[system] = False
                    logger.warning(f"❌ Failed to connect to {system}")
                    
            except Exception as e:
                logger.error(f"❌ Connection error for {system}: {e}")
                connection_results[system] = False
        
        logger.info(f"🔌 Connected to {len(self.connected_systems)}/{len(systems)} systems")
        return connection_results

    async def _test_system_connection(self, system: str) -> bool:
        """Test connection to individual system"""
        # Simulate connection test
        await asyncio.sleep(0.05)
        
        # Banking systems have higher complexity, simulate occasional failures
        if 'banking' in system.lower():
            return True  # Assume banking systems are well-maintained
        else:
            return True  # Simplified for demo

    async def collect_evidence_from_system(self, system_id: str, evidence_types: List[EvidenceType]) -> List[EvidenceItem]:
        """Collect specific types of evidence from a system"""
        if system_id not in self.connected_systems:
            raise ValueError(f"System {system_id} not connected")
        
        logger.info(f"📊 Collecting {len(evidence_types)} evidence types from {system_id}")
        
        collected_evidence = []
        
        for evidence_type in evidence_types:
            try:
                evidence_items = await self._extract_evidence_by_type(system_id, evidence_type)
                collected_evidence.extend(evidence_items)
                
                logger.info(f"📄 Collected {len(evidence_items)} {evidence_type.value} items from {system_id}")
                
            except Exception as e:
                logger.error(f"❌ Failed to collect {evidence_type.value} from {system_id}: {e}")
        
        # Store evidence in database
        await self._store_evidence_items(collected_evidence)
        
        return collected_evidence

    async def _extract_evidence_by_type(self, system_id: str, evidence_type: EvidenceType) -> List[EvidenceItem]:
        """Extract specific evidence type from system"""
        # Simulate evidence extraction
        await asyncio.sleep(0.2)
        
        evidence_items = []
        
        # Generate system-specific evidence based on type
        if evidence_type == EvidenceType.ACCESS_LOG:
            evidence_items = await self._generate_access_log_evidence(system_id)
        elif evidence_type == EvidenceType.TRANSACTION_LOG:
            evidence_items = await self._generate_transaction_log_evidence(system_id)
        elif evidence_type == EvidenceType.RECONCILIATION:
            evidence_items = await self._generate_reconciliation_evidence(system_id)
        elif evidence_type == EvidenceType.SYSTEM_CONFIGURATION:
            evidence_items = await self._generate_system_config_evidence(system_id)
        elif evidence_type == EvidenceType.POLICY_DOCUMENT:
            evidence_items = await self._generate_policy_evidence(system_id)
        else:
            # Generic evidence generation
            evidence_items = await self._generate_generic_evidence(system_id, evidence_type)
        
        return evidence_items

    async def _generate_access_log_evidence(self, system_id: str) -> List[EvidenceItem]:
        """Generate access log evidence for CC6 controls"""
        evidence_items = []
        
        # Simulate access log data
        for i in range(3):  # Generate 3 access log entries
            evidence_id = f"access-{system_id}-{uuid.uuid4().hex[:8]}"
            
            # Determine applicable controls
            control_ids = ["CC6.1-Banking-Access"]
            
            evidence = EvidenceItem(
                id=evidence_id,
                source_system=system_id,
                evidence_type=EvidenceType.ACCESS_LOG,
                control_ids=control_ids,
                collection_timestamp=datetime.now(),
                evidence_hash=hashlib.sha256(f"{evidence_id}-{datetime.now()}".encode()).hexdigest(),
                description=f"Access log entries from {system_id} showing user authentication and authorization",
                file_path=f"/evidence/access_logs/{evidence_id}.log",
                metadata={
                    "log_entries": 15000 + i * 1000,
                    "failed_attempts": 23 + i,
                    "successful_logins": 14500 + i * 950,
                    "privileged_access": 145 + i * 10,
                    "time_period": "24 hours",
                    "systems_covered": [system_id]
                },
                validation_status="validated",
                risk_level="high",
                automated_testing_result=TestingResult.PASSED,
                manual_review_required=False,
                audit_trail=[
                    {
                        "timestamp": datetime.now().isoformat(),
                        "action": "evidence_collected",
                        "agent": self.agent_id,
                        "details": f"Automated collection from {system_id}"
                    }
                ]
            )
            
            evidence_items.append(evidence)
        
        return evidence_items

    async def _generate_transaction_log_evidence(self, system_id: str) -> List[EvidenceItem]:
        """Generate transaction log evidence for CC7 controls"""
        evidence_items = []
        
        for i in range(2):  # Generate 2 transaction log entries
            evidence_id = f"txn-{system_id}-{uuid.uuid4().hex[:8]}"
            
            control_ids = ["CC7.1-Banking-Transactions"]
            
            evidence = EvidenceItem(
                id=evidence_id,
                source_system=system_id,
                evidence_type=EvidenceType.TRANSACTION_LOG,
                control_ids=control_ids,
                collection_timestamp=datetime.now(),
                evidence_hash=hashlib.sha256(f"{evidence_id}-{datetime.now()}".encode()).hexdigest(),
                description=f"Transaction processing logs from {system_id} showing control effectiveness",
                file_path=f"/evidence/transaction_logs/{evidence_id}.log",
                metadata={
                    "transactions_processed": 125000 + i * 10000,
                    "exceptions_detected": 15 + i,
                    "auto_validations_passed": 124800 + i * 9950,
                    "manual_reviews_required": 45 + i * 5,
                    "average_processing_time_ms": 150 + i * 10,
                    "time_period": "24 hours"
                },
                validation_status="validated",
                risk_level="high",
                automated_testing_result=TestingResult.PASSED,
                manual_review_required=False,
                audit_trail=[
                    {
                        "timestamp": datetime.now().isoformat(),
                        "action": "evidence_collected",
                        "agent": self.agent_id,
                        "details": f"Automated transaction log analysis from {system_id}"
                    }
                ]
            )
            
            evidence_items.append(evidence)
        
        return evidence_items

    async def _generate_reconciliation_evidence(self, system_id: str) -> List[EvidenceItem]:
        """Generate reconciliation evidence for CC5 controls"""
        evidence_items = []
        
        evidence_id = f"recon-{system_id}-{uuid.uuid4().hex[:8]}"
        
        control_ids = ["CC5.1-Financial-Controls", "CC7.1-Banking-Transactions"]
        
        evidence = EvidenceItem(
            id=evidence_id,
            source_system=system_id,
            evidence_type=EvidenceType.RECONCILIATION,
            control_ids=control_ids,
            collection_timestamp=datetime.now(),
            evidence_hash=hashlib.sha256(f"{evidence_id}-{datetime.now()}".encode()).hexdigest(),
            description=f"Daily reconciliation reports from {system_id} showing account balance validation",
            file_path=f"/evidence/reconciliations/{evidence_id}.xlsx",
            metadata={
                "accounts_reconciled": 2500,
                "discrepancies_found": 3,
                "discrepancies_resolved": 3,
                "reconciliation_accuracy": 99.88,
                "processing_time_minutes": 45,
                "approval_status": "approved",
                "approver": "Finance Manager"
            },
            validation_status="validated",
            risk_level="medium",
            automated_testing_result=TestingResult.PASSED,
            manual_review_required=False,
            audit_trail=[
                {
                    "timestamp": datetime.now().isoformat(),
                    "action": "evidence_collected",
                    "agent": self.agent_id,
                    "details": f"Automated reconciliation evidence from {system_id}"
                }
            ]
        )
        
        evidence_items.append(evidence)
        return evidence_items

    async def _generate_system_config_evidence(self, system_id: str) -> List[EvidenceItem]:
        """Generate system configuration evidence for IT General Controls"""
        evidence_items = []
        
        evidence_id = f"config-{system_id}-{uuid.uuid4().hex[:8]}"
        
        control_ids = ["CC6.1-Banking-Access", "CC8.1-Banking-Changes"]
        
        evidence = EvidenceItem(
            id=evidence_id,
            source_system=system_id,
            evidence_type=EvidenceType.SYSTEM_CONFIGURATION,
            control_ids=control_ids,
            collection_timestamp=datetime.now(),
            evidence_hash=hashlib.sha256(f"{evidence_id}-{datetime.now()}".encode()).hexdigest(),
            description=f"System configuration snapshot from {system_id} showing security controls",
            file_path=f"/evidence/configurations/{evidence_id}.json",
            metadata={
                "security_controls_enabled": 145,
                "access_control_policies": 23,
                "encryption_settings": "AES-256",
                "backup_configuration": "daily",
                "patch_level": "current",
                "last_security_scan": (datetime.now() - timedelta(days=1)).isoformat(),
                "compliance_score": 96.5
            },
            validation_status="validated",
            risk_level="medium",
            automated_testing_result=TestingResult.PASSED,
            manual_review_required=False,
            audit_trail=[
                {
                    "timestamp": datetime.now().isoformat(),
                    "action": "evidence_collected",
                    "agent": self.agent_id,
                    "details": f"Automated configuration snapshot from {system_id}"
                }
            ]
        )
        
        evidence_items.append(evidence)
        return evidence_items

    async def _generate_policy_evidence(self, system_id: str) -> List[EvidenceItem]:
        """Generate policy document evidence for CC1 controls"""
        evidence_items = []
        
        evidence_id = f"policy-{system_id}-{uuid.uuid4().hex[:8]}"
        
        control_ids = ["CC1.1-Banking-Ethics"]
        
        evidence = EvidenceItem(
            id=evidence_id,
            source_system=system_id,
            evidence_type=EvidenceType.POLICY_DOCUMENT,
            control_ids=control_ids,
            collection_timestamp=datetime.now(),
            evidence_hash=hashlib.sha256(f"{evidence_id}-{datetime.now()}".encode()).hexdigest(),
            description=f"Banking policies and procedures from {system_id} document management system",
            file_path=f"/evidence/policies/{evidence_id}.pdf",
            metadata={
                "policy_count": 45,
                "last_review_date": (datetime.now() - timedelta(days=90)).isoformat(),
                "next_review_date": (datetime.now() + timedelta(days=275)).isoformat(),
                "approval_status": "approved",
                "version": "2024.1",
                "applicable_regulations": ["Basel III", "SOX", "GDPR"]
            },
            validation_status="validated",
            risk_level="low",
            automated_testing_result=TestingResult.PASSED,
            manual_review_required=True,  # Policies typically need manual review
            audit_trail=[
                {
                    "timestamp": datetime.now().isoformat(),
                    "action": "evidence_collected",
                    "agent": self.agent_id,
                    "details": f"Policy document collection from {system_id}"
                }
            ]
        )
        
        evidence_items.append(evidence)
        return evidence_items

    async def _generate_generic_evidence(self, system_id: str, evidence_type: EvidenceType) -> List[EvidenceItem]:
        """Generate generic evidence for other types"""
        evidence_items = []
        
        evidence_id = f"generic-{evidence_type.value}-{system_id}-{uuid.uuid4().hex[:8]}"
        
        # Map evidence type to likely controls
        control_mapping = {
            EvidenceType.TRAINING_RECORD: ["CC1.1-Banking-Ethics"],
            EvidenceType.AUDIT_REPORT: ["CC4.1-Monitoring"],
            EvidenceType.RISK_ASSESSMENT: ["CC2.1-Banking-Risk"],
            EvidenceType.CHANGE_REQUEST: ["CC8.1-Banking-Changes"],
            EvidenceType.EXCEPTION_REPORT: ["CC7.1-Banking-Transactions"],
            EvidenceType.MONITORING_REPORT: ["CC4.1-Monitoring"],
            EvidenceType.APPROVAL_WORKFLOW: ["CC5.1-Financial-Controls"]
        }
        
        control_ids = control_mapping.get(evidence_type, ["CC5.1-Financial-Controls"])
        
        evidence = EvidenceItem(
            id=evidence_id,
            source_system=system_id,
            evidence_type=evidence_type,
            control_ids=control_ids,
            collection_timestamp=datetime.now(),
            evidence_hash=hashlib.sha256(f"{evidence_id}-{datetime.now()}".encode()).hexdigest(),
            description=f"{evidence_type.value.replace('-', ' ').title()} evidence from {system_id}",
            file_path=f"/evidence/{evidence_type.value}/{evidence_id}.dat",
            metadata={
                "source_system": system_id,
                "evidence_type": evidence_type.value,
                "automated_collection": True,
                "quality_score": 0.92
            },
            validation_status="pending",
            risk_level="medium",
            automated_testing_result=None,
            manual_review_required=True,
            audit_trail=[
                {
                    "timestamp": datetime.now().isoformat(),
                    "action": "evidence_collected",
                    "agent": self.agent_id,
                    "details": f"Generic evidence collection from {system_id}"
                }
            ]
        )
        
        evidence_items.append(evidence)
        return evidence_items

    async def _store_evidence_items(self, evidence_items: List[EvidenceItem]):
        """Store evidence items in database"""
        with sqlite3.connect(self.db_path) as conn:
            for evidence in evidence_items:
                conn.execute('''
                    INSERT OR REPLACE INTO evidence_items VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    evidence.id,
                    evidence.source_system,
                    evidence.evidence_type.value,
                    json.dumps(evidence.control_ids),
                    evidence.collection_timestamp.isoformat(),
                    evidence.evidence_hash,
                    evidence.description,
                    evidence.file_path,
                    json.dumps(evidence.metadata),
                    evidence.validation_status,
                    evidence.risk_level,
                    evidence.automated_testing_result.value if evidence.automated_testing_result else None,
                    evidence.manual_review_required,
                    json.dumps(evidence.audit_trail)
                ))
                
                # Store in memory
                self.evidence_items[evidence.id] = evidence
            
            conn.commit()

    async def run_automated_tests(self, control_ids: Optional[List[str]] = None) -> Dict[str, TestingResult]:
        """Run automated tests for specified controls or all controls"""
        if control_ids is None:
            control_ids = list(self.banking_controls.keys())
        
        logger.info(f"🧪 Running automated tests for {len(control_ids)} controls")
        
        test_results = {}
        
        for control_id in control_ids:
            try:
                result = await self._test_control(control_id)
                test_results[control_id] = result
                
                logger.info(f"{'✅' if result == TestingResult.PASSED else '❌'} Control {control_id}: {result.value}")
                
            except Exception as e:
                logger.error(f"❌ Failed to test control {control_id}: {e}")
                test_results[control_id] = TestingResult.FAILED
        
        return test_results

    async def _test_control(self, control_id: str) -> TestingResult:
        """Test individual control effectiveness"""
        control = self.banking_controls.get(control_id)
        if not control:
            return TestingResult.NOT_APPLICABLE
        
        # Simulate control testing
        await asyncio.sleep(0.1)
        
        # Find evidence for this control
        relevant_evidence = [
            evidence for evidence in self.evidence_items.values()
            if control_id in evidence.control_ids
        ]
        
        if not relevant_evidence:
            return TestingResult.MANUAL_REVIEW
        
        # Analyze evidence quality and completeness
        validation_rate = sum(1 for e in relevant_evidence if e.validation_status == "validated") / len(relevant_evidence)
        automation_rate = sum(1 for e in relevant_evidence if not e.manual_review_required) / len(relevant_evidence)
        
        # Simple testing logic
        if validation_rate >= 0.9 and automation_rate >= 0.7:
            return TestingResult.PASSED
        elif validation_rate >= 0.7:
            return TestingResult.MANUAL_REVIEW
        else:
            return TestingResult.FAILED

    async def generate_audit_package(self, control_ids: Optional[List[str]] = None) -> Dict[str, Any]:
        """Generate comprehensive audit package for ISAE 3000 engagement"""
        if control_ids is None:
            control_ids = list(self.banking_controls.keys())
        
        logger.info(f"📦 Generating audit package for {len(control_ids)} controls")
        
        audit_package = {
            "package_id": f"audit-pkg-{uuid.uuid4().hex[:8]}",
            "generated_at": datetime.now().isoformat(),
            "agent_id": self.agent_id,
            "scope": {
                "controls_included": len(control_ids),
                "systems_covered": list(self.connected_systems),
                "evidence_items": len(self.evidence_items),
                "period_covered": {
                    "start": (datetime.now() - timedelta(days=365)).isoformat(),
                    "end": datetime.now().isoformat()
                }
            },
            "controls": [],
            "evidence_summary": {},
            "testing_results": {},
            "compliance_assessment": {},
            "recommendations": []
        }
        
        # Process each control
        for control_id in control_ids:
            control = self.banking_controls.get(control_id)
            if not control:
                continue
            
            # Get evidence for this control
            control_evidence = [
                evidence for evidence in self.evidence_items.values()
                if control_id in evidence.control_ids
            ]
            
            # Run tests if not already done
            test_result = await self._test_control(control_id)
            
            control_info = {
                "control_id": control_id,
                "title": control.title,
                "category": control.category.value,
                "risk_level": control.risk_level,
                "banking_specific": control.banking_specific,
                "evidence_count": len(control_evidence),
                "test_result": test_result.value,
                "automation_percentage": control.automation_percentage,
                "evidence_items": [e.id for e in control_evidence]
            }
            
            audit_package["controls"].append(control_info)
            audit_package["testing_results"][control_id] = test_result.value
        
        # Generate evidence summary
        evidence_by_type = {}
        for evidence in self.evidence_items.values():
            ev_type = evidence.evidence_type.value
            if ev_type not in evidence_by_type:
                evidence_by_type[ev_type] = 0
            evidence_by_type[ev_type] += 1
        
        audit_package["evidence_summary"] = {
            "by_type": evidence_by_type,
            "by_system": {system: len([e for e in self.evidence_items.values() if e.source_system == system]) for system in self.connected_systems},
            "validation_status": {
                "validated": len([e for e in self.evidence_items.values() if e.validation_status == "validated"]),
                "pending": len([e for e in self.evidence_items.values() if e.validation_status == "pending"]),
                "failed": len([e for e in self.evidence_items.values() if e.validation_status == "failed"])
            }
        }
        
        # Compliance assessment
        passed_tests = sum(1 for result in audit_package["testing_results"].values() if result == "passed")
        total_tests = len(audit_package["testing_results"])
        
        audit_package["compliance_assessment"] = {
            "overall_score": (passed_tests / total_tests * 100) if total_tests > 0 else 0,
            "tests_passed": passed_tests,
            "tests_total": total_tests,
            "high_risk_controls_passed": sum(1 for control in audit_package["controls"] if control["risk_level"] == "high" and control["test_result"] == "passed"),
            "automation_coverage": sum(control["automation_percentage"] for control in audit_package["controls"]) / len(audit_package["controls"]) if audit_package["controls"] else 0
        }
        
        # Generate recommendations
        recommendations = []
        if audit_package["compliance_assessment"]["overall_score"] < 95:
            recommendations.append("Address failed control tests to improve overall compliance score")
        
        failed_controls = [control for control in audit_package["controls"] if control["test_result"] != "passed"]
        if failed_controls:
            recommendations.append(f"Review and remediate {len(failed_controls)} controls with testing issues")
        
        manual_review_evidence = [e for e in self.evidence_items.values() if e.manual_review_required]
        if manual_review_evidence:
            recommendations.append(f"Complete manual review of {len(manual_review_evidence)} evidence items")
        
        audit_package["recommendations"] = recommendations
        
        logger.info(f"✅ Generated audit package with {audit_package['compliance_assessment']['overall_score']:.1f}% compliance score")
        
        return audit_package

    async def start_monitoring(self):
        """Start continuous evidence collection and monitoring"""
        self.monitoring_active = True
        logger.info("🔍 Starting continuous ISAE 3000 evidence monitoring")
        
        tasks = [
            self.continuous_evidence_collection(),
            self.automated_control_testing(),
            self.evidence_validation_monitoring(),
            self.compliance_reporting()
        ]
        
        await asyncio.gather(*tasks)

    async def continuous_evidence_collection(self):
        """Continuously collect evidence from connected systems"""
        while self.monitoring_active:
            try:
                for system in self.connected_systems:
                    # Collect high-frequency evidence types
                    evidence_types = [EvidenceType.ACCESS_LOG, EvidenceType.TRANSACTION_LOG]
                    await self.collect_evidence_from_system(system, evidence_types)
                
                await asyncio.sleep(300)  # Every 5 minutes
                
            except Exception as e:
                logger.error(f"❌ Continuous collection error: {e}")
                await asyncio.sleep(300)

    async def automated_control_testing(self):
        """Run automated control tests periodically"""
        while self.monitoring_active:
            try:
                # Test high-risk controls more frequently
                high_risk_controls = [
                    control_id for control_id, control in self.banking_controls.items()
                    if control.risk_level == "high"
                ]
                
                await self.run_automated_tests(high_risk_controls)
                await asyncio.sleep(3600)  # Every hour
                
            except Exception as e:
                logger.error(f"❌ Automated testing error: {e}")
                await asyncio.sleep(3600)

    async def evidence_validation_monitoring(self):
        """Monitor and validate collected evidence"""
        while self.monitoring_active:
            try:
                # Validate pending evidence
                pending_evidence = [e for e in self.evidence_items.values() if e.validation_status == "pending"]
                
                for evidence in pending_evidence[:10]:  # Process 10 at a time
                    # Simulate validation
                    await asyncio.sleep(0.1)
                    evidence.validation_status = "validated"
                
                await asyncio.sleep(600)  # Every 10 minutes
                
            except Exception as e:
                logger.error(f"❌ Validation monitoring error: {e}")
                await asyncio.sleep(600)

    async def compliance_reporting(self):
        """Generate periodic compliance reports"""
        while self.monitoring_active:
            try:
                # Generate daily compliance report
                metrics = self.get_metrics()
                logger.info(f"📊 Daily metrics: {metrics['evidence_items']} evidence items, {metrics['compliance_score']:.1f}% compliance")
                
                await asyncio.sleep(86400)  # Daily
                
            except Exception as e:
                logger.error(f"❌ Reporting error: {e}")
                await asyncio.sleep(86400)

    def get_metrics(self) -> Dict[str, Any]:
        """Get current agent metrics"""
        validated_evidence = len([e for e in self.evidence_items.values() if e.validation_status == "validated"])
        automated_evidence = len([e for e in self.evidence_items.values() if not e.manual_review_required])
        
        return {
            "agent_id": self.agent_id,
            "connected_systems": len(self.connected_systems),
            "evidence_items": len(self.evidence_items),
            "banking_controls": len(self.banking_controls),
            "validated_evidence": validated_evidence,
            "automated_evidence": automated_evidence,
            "validation_rate": (validated_evidence / len(self.evidence_items) * 100) if self.evidence_items else 0,
            "automation_rate": (automated_evidence / len(self.evidence_items) * 100) if self.evidence_items else 0,
            "compliance_score": sum(control.automation_percentage for control in self.banking_controls.values()) / len(self.banking_controls) * 100 if self.banking_controls else 0,
            "monitoring_active": self.monitoring_active,
            "last_updated": datetime.now().isoformat()
        }

# Example usage and testing
async def main():
    """Example usage of ISAE 3000 Evidence Agent"""
    config = {
        "agent_id": "isae3000-agent-demo",
        "database_path": "/tmp/isae3000_demo.db"
    }
    
    agent = ISAE3000EvidenceAgent(config)
    
    # Connect to banking systems
    systems = ["core-banking-system", "payment-processing", "general-ledger", "risk-management"]
    connections = await agent.connect_to_systems(systems)
    print(f"🔌 System connections: {connections}")
    
    # Collect evidence from connected systems
    evidence_types = [EvidenceType.ACCESS_LOG, EvidenceType.TRANSACTION_LOG, EvidenceType.RECONCILIATION]
    
    for system in systems:
        if connections.get(system):
            evidence = await agent.collect_evidence_from_system(system, evidence_types)
            print(f"📊 Collected {len(evidence)} evidence items from {system}")
    
    # Run automated tests
    test_results = await agent.run_automated_tests()
    print(f"🧪 Test results: {test_results}")
    
    # Generate audit package
    audit_package = await agent.generate_audit_package()
    print(f"📦 Generated audit package with {audit_package['compliance_assessment']['overall_score']:.1f}% compliance")
    
    # Get metrics
    metrics = agent.get_metrics()
    print(f"📊 Agent metrics:")
    print(json.dumps(metrics, indent=2))

if __name__ == "__main__":
    asyncio.run(main())