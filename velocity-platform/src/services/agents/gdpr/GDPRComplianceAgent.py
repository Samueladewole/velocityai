#!/usr/bin/env python3
"""
GDPR Compliance Agent - Velocity.ai Specialized Agent
Automated GDPR Records of Processing Activities (RoPA) generation and compliance monitoring

Features:
- Automated RoPA discovery and generation per Article 30
- Real-time data flow mapping and analysis
- Data subject request automation (Articles 15-22)
- Breach detection and 72-hour notification automation
- Privacy impact assessment (PIA) automation
- Cross-border transfer compliance monitoring
- Consent management and withdrawal processing
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

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('gdpr-compliance-agent')

class LegalBasis(Enum):
    CONSENT = "consent"
    CONTRACT = "contract"
    LEGAL_OBLIGATION = "legal-obligation"
    VITAL_INTERESTS = "vital-interests"
    PUBLIC_TASK = "public-task"
    LEGITIMATE_INTERESTS = "legitimate-interests"

class DataCategory(Enum):
    IDENTITY = "identity"
    CONTACT = "contact"
    FINANCIAL = "financial"
    BEHAVIORAL = "behavioral"
    BIOMETRIC = "biometric"
    HEALTH = "health"
    LOCATION = "location"
    TECHNICAL = "technical"

class ProcessingPurpose(Enum):
    ACCOUNT_MANAGEMENT = "account-management"
    PAYMENT_PROCESSING = "payment-processing"
    MARKETING = "marketing"
    ANALYTICS = "analytics"
    SECURITY = "security"
    COMPLIANCE = "compliance"
    CUSTOMER_SERVICE = "customer-service"

@dataclass
class DataProcessingActivity:
    """GDPR Article 30 Records of Processing Activities"""
    id: str
    name: str
    description: str
    controller: str
    joint_controllers: List[str]
    dpo_contact: str
    categories_of_data_subjects: List[str]
    categories_of_personal_data: List[DataCategory]
    purposes: List[ProcessingPurpose]
    legal_bases: List[LegalBasis]
    recipients: List[str]
    third_country_transfers: List[Dict[str, Any]]
    retention_period: str
    technical_measures: List[str]
    organizational_measures: List[str]
    created_at: datetime
    last_updated: datetime
    compliance_score: float
    risk_assessment: Dict[str, Any]

@dataclass
class DataSubjectRequest:
    """Data Subject Rights (Articles 15-22)"""
    id: str
    request_type: str  # access, rectification, erasure, portability, restriction, objection
    data_subject_id: str
    submitted_at: datetime
    deadline: datetime
    status: str  # received, processing, completed, rejected, extended
    automated_response: bool
    response_data: Optional[Dict[str, Any]]
    evidence_collected: List[str]
    processing_time_minutes: int

@dataclass
class BreachIncident:
    """Personal Data Breach (Articles 33-34)"""
    id: str
    detected_at: datetime
    category: str  # confidentiality, integrity, availability
    severity: str  # low, medium, high, critical
    affected_subjects: int
    description: str
    cause: str
    personal_data_involved: List[DataCategory]
    likely_consequences: str
    containment_measures: List[str]
    notification_required_dpa: bool
    notification_required_subjects: bool
    notification_sent_dpa: bool
    notification_sent_subjects: bool
    lessons_learned: List[str]
    
@dataclass
class ConsentRecord:
    """Consent Management"""
    id: str
    data_subject_id: str
    purpose: ProcessingPurpose
    consent_given: bool
    consent_timestamp: datetime
    withdrawal_timestamp: Optional[datetime]
    consent_mechanism: str
    evidence: List[str]
    granular_consents: Dict[str, bool]

class GDPRComplianceAgent:
    """Specialized AI Agent for GDPR Compliance Automation"""
    
    def __init__(self, config: Dict[str, Any]):
        self.agent_id = config.get('agent_id', f'gdpr-agent-{uuid.uuid4().hex[:8]}')
        self.config = config
        self.processing_activities: Dict[str, DataProcessingActivity] = {}
        self.data_subject_requests: Dict[str, DataSubjectRequest] = {}
        self.breach_incidents: Dict[str, BreachIncident] = {}
        self.consent_records: Dict[str, ConsentRecord] = {}
        self.monitoring_active = False
        
        # GDPR-specific configurations
        self.notification_deadline_hours = 72  # Article 33
        self.request_response_days = 30  # Article 12
        self.automation_confidence_threshold = 0.9
        
        logger.info(f"🛡️ GDPR Compliance Agent {self.agent_id} initialized")

    async def start_monitoring(self):
        """Start continuous GDPR compliance monitoring"""
        self.monitoring_active = True
        logger.info("🔍 Starting GDPR compliance monitoring")
        
        # Start monitoring tasks
        tasks = [
            self.monitor_data_processing_activities(),
            self.monitor_breach_detection(),
            self.process_data_subject_requests(),
            self.monitor_consent_status(),
            self.monitor_cross_border_transfers(),
            self.generate_compliance_reports()
        ]
        
        await asyncio.gather(*tasks)

    async def discover_processing_activities(self, systems: List[str]) -> List[DataProcessingActivity]:
        """Automatically discover and catalog data processing activities (Article 30)"""
        logger.info(f"🔍 Discovering processing activities across {len(systems)} systems")
        
        discovered_activities = []
        
        for system in systems:
            try:
                # Simulate system scanning and data flow analysis
                activities = await self._scan_system_for_processing(system)
                discovered_activities.extend(activities)
                
                logger.info(f"📊 Discovered {len(activities)} processing activities in {system}")
                
            except Exception as e:
                logger.error(f"❌ Failed to scan {system}: {e}")
        
        # Store discovered activities
        for activity in discovered_activities:
            self.processing_activities[activity.id] = activity
        
        return discovered_activities

    async def _scan_system_for_processing(self, system: str) -> List[DataProcessingActivity]:
        """Scan individual system for data processing activities"""
        # Simulate AI-powered system analysis
        await asyncio.sleep(0.5)  # Simulate processing time
        
        # Banking-specific processing activities
        if 'banking' in system.lower() or 'core' in system.lower():
            return [
                DataProcessingActivity(
                    id=f"activity-{system}-{uuid.uuid4().hex[:8]}",
                    name=f"Customer Account Management - {system}",
                    description=f"Processing of customer personal data for account opening and maintenance in {system}",
                    controller="Velocity Bank Ltd",
                    joint_controllers=[],
                    dpo_contact="dpo@velocitybank.com",
                    categories_of_data_subjects=["bank customers", "account holders", "loan applicants"],
                    categories_of_personal_data=[DataCategory.IDENTITY, DataCategory.CONTACT, DataCategory.FINANCIAL],
                    purposes=[ProcessingPurpose.ACCOUNT_MANAGEMENT, ProcessingPurpose.COMPLIANCE],
                    legal_bases=[LegalBasis.CONTRACT, LegalBasis.LEGAL_OBLIGATION],
                    recipients=["Credit reference agencies", "Regulatory authorities", "Audit firms"],
                    third_country_transfers=[
                        {
                            "recipient": "US Payment Processor",
                            "country": "United States",
                            "adequacy_decision": False,
                            "safeguards": ["Standard Contractual Clauses", "Additional security measures"]
                        }
                    ],
                    retention_period="10 years after account closure for regulatory compliance",
                    technical_measures=["AES-256 encryption", "TLS 1.3 transmission", "Database access controls"],
                    organizational_measures=["Staff training", "Access management", "Regular audits"],
                    created_at=datetime.now(),
                    last_updated=datetime.now(),
                    compliance_score=0.92,
                    risk_assessment={
                        "overall_risk": "medium",
                        "likelihood": 3,
                        "impact": 4,
                        "mitigation_measures": ["Strong encryption", "Access controls", "Regular monitoring"]
                    }
                )
            ]
        
        # Payment processing activities
        elif 'payment' in system.lower():
            return [
                DataProcessingActivity(
                    id=f"activity-{system}-{uuid.uuid4().hex[:8]}",
                    name=f"Payment Transaction Processing - {system}",
                    description=f"Processing of payment and transaction data in {system}",
                    controller="Velocity Bank Ltd",
                    joint_controllers=["Payment network providers"],
                    dpo_contact="dpo@velocitybank.com",
                    categories_of_data_subjects=["payment users", "cardholders", "merchants"],
                    categories_of_personal_data=[DataCategory.FINANCIAL, DataCategory.TECHNICAL, DataCategory.BEHAVIORAL],
                    purposes=[ProcessingPurpose.PAYMENT_PROCESSING, ProcessingPurpose.SECURITY],
                    legal_bases=[LegalBasis.CONTRACT, LegalBasis.LEGITIMATE_INTERESTS],
                    recipients=["Payment processors", "Card networks", "Fraud prevention providers"],
                    third_country_transfers=[
                        {
                            "recipient": "Global Payment Network",
                            "country": "United States",
                            "adequacy_decision": False,
                            "safeguards": ["Standard Contractual Clauses"]
                        }
                    ],
                    retention_period="7 years from transaction date",
                    technical_measures=["Tokenization", "End-to-end encryption", "Real-time monitoring"],
                    organizational_measures=["PCI DSS compliance", "Fraud detection training", "Incident response"],
                    created_at=datetime.now(),
                    last_updated=datetime.now(),
                    compliance_score=0.95,
                    risk_assessment={
                        "overall_risk": "high",
                        "likelihood": 4,
                        "impact": 5,
                        "mitigation_measures": ["Tokenization", "Fraud monitoring", "PCI DSS controls"]
                    }
                )
            ]
        
        # Default system processing
        else:
            return [
                DataProcessingActivity(
                    id=f"activity-{system}-{uuid.uuid4().hex[:8]}",
                    name=f"System Operations - {system}",
                    description=f"Standard system operations and user management in {system}",
                    controller="Velocity Bank Ltd",
                    joint_controllers=[],
                    dpo_contact="dpo@velocitybank.com",
                    categories_of_data_subjects=["employees", "users", "visitors"],
                    categories_of_personal_data=[DataCategory.IDENTITY, DataCategory.TECHNICAL],
                    purposes=[ProcessingPurpose.ACCOUNT_MANAGEMENT, ProcessingPurpose.SECURITY],
                    legal_bases=[LegalBasis.LEGITIMATE_INTERESTS],
                    recipients=["IT service providers", "Security providers"],
                    third_country_transfers=[],
                    retention_period="3 years from last activity",
                    technical_measures=["Access logging", "Encryption", "Backup systems"],
                    organizational_measures=["Access policies", "Staff training", "Regular reviews"],
                    created_at=datetime.now(),
                    last_updated=datetime.now(),
                    compliance_score=0.88,
                    risk_assessment={
                        "overall_risk": "low",
                        "likelihood": 2,
                        "impact": 3,
                        "mitigation_measures": ["Access controls", "Regular monitoring", "Staff training"]
                    }
                )
            ]

    async def generate_ropa_records(self) -> Dict[str, Any]:
        """Generate Article 30 compliant Records of Processing Activities"""
        logger.info("📋 Generating GDPR Article 30 RoPA records")
        
        ropa_records = {
            "organization": {
                "name": "Velocity Bank Ltd",
                "contact_details": {
                    "address": "123 Banking Street, Financial District",
                    "phone": "+1-555-BANK-001",
                    "email": "privacy@velocitybank.com"
                },
                "dpo": {
                    "name": "Chief Privacy Officer",
                    "contact": "dpo@velocitybank.com",
                    "phone": "+1-555-DPO-001"
                }
            },
            "processing_activities": [],
            "summary": {
                "total_activities": len(self.processing_activities),
                "high_risk_activities": 0,
                "cross_border_transfers": 0,
                "last_updated": datetime.now().isoformat()
            },
            "compliance_assessment": {
                "overall_score": 0.0,
                "recommendations": []
            }
        }
        
        high_risk_count = 0
        cross_border_count = 0
        total_score = 0.0
        
        for activity in self.processing_activities.values():
            # Convert to RoPA format
            ropa_activity = {
                "id": activity.id,
                "name": activity.name,
                "description": activity.description,
                "controller": activity.controller,
                "joint_controllers": activity.joint_controllers,
                "dpo_contact": activity.dpo_contact,
                "categories_of_data_subjects": activity.categories_of_data_subjects,
                "categories_of_personal_data": [cat.value for cat in activity.categories_of_personal_data],
                "purposes": [purpose.value for purpose in activity.purposes],
                "legal_bases": [basis.value for basis in activity.legal_bases],
                "recipients": activity.recipients,
                "third_country_transfers": activity.third_country_transfers,
                "retention_period": activity.retention_period,
                "technical_measures": activity.technical_measures,
                "organizational_measures": activity.organizational_measures,
                "last_updated": activity.last_updated.isoformat(),
                "compliance_score": activity.compliance_score,
                "risk_level": activity.risk_assessment.get("overall_risk", "unknown")
            }
            
            ropa_records["processing_activities"].append(ropa_activity)
            
            # Update counters
            if activity.risk_assessment.get("overall_risk") in ["high", "very-high"]:
                high_risk_count += 1
            
            if activity.third_country_transfers:
                cross_border_count += 1
            
            total_score += activity.compliance_score
        
        # Update summary
        ropa_records["summary"]["high_risk_activities"] = high_risk_count
        ropa_records["summary"]["cross_border_transfers"] = cross_border_count
        
        if self.processing_activities:
            avg_score = total_score / len(self.processing_activities)
            ropa_records["compliance_assessment"]["overall_score"] = round(avg_score, 2)
            
            # Generate recommendations
            recommendations = []
            if high_risk_count > 0:
                recommendations.append(f"Review {high_risk_count} high-risk processing activities")
            if cross_border_count > 0:
                recommendations.append(f"Validate safeguards for {cross_border_count} cross-border transfers")
            if avg_score < 0.9:
                recommendations.append("Improve technical and organizational measures")
            
            ropa_records["compliance_assessment"]["recommendations"] = recommendations
        
        logger.info(f"✅ Generated RoPA with {len(self.processing_activities)} activities")
        return ropa_records

    async def process_data_subject_request(self, request_data: Dict[str, Any]) -> DataSubjectRequest:
        """Automate data subject request processing (Articles 15-22)"""
        request_id = f"dsr-{uuid.uuid4().hex[:8]}"
        request_type = request_data.get('request_type', 'access')
        data_subject_id = request_data.get('data_subject_id')
        
        logger.info(f"📨 Processing {request_type} request {request_id} for subject {data_subject_id}")
        
        start_time = datetime.now()
        deadline = start_time + timedelta(days=self.request_response_days)
        
        # Create request record
        dsr = DataSubjectRequest(
            id=request_id,
            request_type=request_type,
            data_subject_id=data_subject_id,
            submitted_at=start_time,
            deadline=deadline,
            status="processing",
            automated_response=False,
            response_data=None,
            evidence_collected=[],
            processing_time_minutes=0
        )
        
        try:
            # Process based on request type
            if request_type == "access":
                response_data = await self._process_access_request(data_subject_id)
                dsr.automated_response = True
            elif request_type == "erasure":
                response_data = await self._process_erasure_request(data_subject_id)
                dsr.automated_response = True
            elif request_type == "portability":
                response_data = await self._process_portability_request(data_subject_id)
                dsr.automated_response = True
            elif request_type == "rectification":
                response_data = await self._process_rectification_request(data_subject_id, request_data)
                dsr.automated_response = True
            else:
                response_data = {"message": "Request requires manual review"}
                dsr.automated_response = False
            
            dsr.response_data = response_data
            dsr.status = "completed"
            
            # Calculate processing time
            processing_time = datetime.now() - start_time
            dsr.processing_time_minutes = int(processing_time.total_seconds() / 60)
            
            logger.info(f"✅ Completed {request_type} request in {dsr.processing_time_minutes} minutes")
            
        except Exception as e:
            logger.error(f"❌ Failed to process request {request_id}: {e}")
            dsr.status = "failed"
            dsr.response_data = {"error": str(e)}
        
        # Store request
        self.data_subject_requests[request_id] = dsr
        
        return dsr

    async def _process_access_request(self, data_subject_id: str) -> Dict[str, Any]:
        """Process Article 15 Subject Access Request"""
        logger.info(f"🔍 Processing access request for {data_subject_id}")
        
        # Simulate data discovery across systems
        await asyncio.sleep(0.3)
        
        # Find all processing activities involving this data subject
        relevant_activities = []
        for activity in self.processing_activities.values():
            # Simulate checking if data subject is involved
            relevant_activities.append({
                "activity_name": activity.name,
                "purposes": [p.value for p in activity.purposes],
                "legal_bases": [b.value for b in activity.legal_bases],
                "data_categories": [c.value for c in activity.categories_of_personal_data],
                "retention_period": activity.retention_period
            })
        
        return {
            "data_subject_id": data_subject_id,
            "personal_data_processed": relevant_activities,
            "sources": ["Core banking system", "Payment processing", "Customer portal"],
            "recipients": ["Credit agencies", "Regulatory authorities"],
            "storage_period": "Varies by data type (3-10 years)",
            "rights_information": {
                "rectification": "You can request correction of inaccurate data",
                "erasure": "You can request deletion in certain circumstances",
                "restriction": "You can request processing restriction",
                "portability": "You can request data in machine-readable format",
                "objection": "You can object to processing based on legitimate interests"
            },
            "contact_information": {
                "dpo": "dpo@velocitybank.com",
                "privacy_team": "privacy@velocitybank.com"
            },
            "generated_at": datetime.now().isoformat()
        }

    async def _process_erasure_request(self, data_subject_id: str) -> Dict[str, Any]:
        """Process Article 17 Right to Erasure (Right to be Forgotten)"""
        logger.info(f"🗑️ Processing erasure request for {data_subject_id}")
        
        # Simulate erasure process
        await asyncio.sleep(0.5)
        
        # Check legal grounds for erasure
        erasure_possible = await self._check_erasure_grounds(data_subject_id)
        
        if erasure_possible:
            # Simulate data deletion across systems
            deleted_systems = ["Customer database", "Marketing system", "Analytics platform"]
            retained_systems = ["Transaction logs (regulatory requirement)", "Fraud detection (legal obligation)"]
            
            return {
                "erasure_status": "partial",
                "deleted_from": deleted_systems,
                "retained_in": retained_systems,
                "retention_reasons": [
                    "Legal obligation for transaction records (7 years)",
                    "Fraud prevention legitimate interests"
                ],
                "erasure_date": datetime.now().isoformat(),
                "verification_hash": hashlib.sha256(f"erasure-{data_subject_id}-{datetime.now()}".encode()).hexdigest()
            }
        else:
            return {
                "erasure_status": "denied",
                "reason": "Legal obligation to retain data for regulatory compliance",
                "retention_period": "7 years from last transaction",
                "next_review": (datetime.now() + timedelta(days=365)).isoformat()
            }

    async def _process_portability_request(self, data_subject_id: str) -> Dict[str, Any]:
        """Process Article 20 Data Portability Request"""
        logger.info(f"📦 Processing portability request for {data_subject_id}")
        
        # Simulate data export
        await asyncio.sleep(0.4)
        
        # Generate machine-readable data export
        export_data = {
            "personal_information": {
                "name": "John Doe",
                "email": "john.doe@example.com",
                "phone": "+1-555-0123",
                "address": "123 Main St, City, State 12345"
            },
            "account_information": {
                "account_number": "****1234",
                "account_type": "Checking",
                "opening_date": "2020-01-15",
                "status": "Active"
            },
            "transaction_history": [
                {
                    "date": "2025-01-15",
                    "description": "ATM Withdrawal",
                    "amount": -100.00,
                    "balance": 1500.00
                }
                # More transactions would be included
            ],
            "preferences": {
                "marketing_consent": False,
                "paper_statements": True,
                "mobile_notifications": True
            }
        }
        
        return {
            "export_format": "JSON",
            "data_export": export_data,
            "export_date": datetime.now().isoformat(),
            "verification_hash": hashlib.sha256(json.dumps(export_data, sort_keys=True).encode()).hexdigest(),
            "instructions": "This data can be imported into compatible banking systems",
            "validity_period": "30 days from export date"
        }

    async def _process_rectification_request(self, data_subject_id: str, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process Article 16 Right to Rectification"""
        logger.info(f"✏️ Processing rectification request for {data_subject_id}")
        
        corrections = request_data.get('corrections', {})
        
        # Simulate data update process
        await asyncio.sleep(0.2)
        
        updated_fields = []
        for field, new_value in corrections.items():
            updated_fields.append({
                "field": field,
                "old_value": "[REDACTED]",
                "new_value": new_value,
                "updated_at": datetime.now().isoformat()
            })
        
        return {
            "rectification_status": "completed",
            "updated_fields": updated_fields,
            "systems_updated": ["Core banking", "Customer portal", "Marketing database"],
            "verification_required": True,
            "verification_deadline": (datetime.now() + timedelta(days=5)).isoformat()
        }

    async def _check_erasure_grounds(self, data_subject_id: str) -> bool:
        """Check legal grounds for data erasure"""
        # Simulate checking erasure conditions
        await asyncio.sleep(0.1)
        
        # In banking, erasure is often limited due to regulatory requirements
        # This would check actual business rules
        return True  # Simplified for demo

    async def detect_and_report_breach(self, incident_data: Dict[str, Any]) -> BreachIncident:
        """Detect and handle personal data breaches (Articles 33-34)"""
        incident_id = f"breach-{uuid.uuid4().hex[:8]}"
        
        logger.info(f"🚨 Processing breach incident {incident_id}")
        
        breach = BreachIncident(
            id=incident_id,
            detected_at=datetime.now(),
            category=incident_data.get('category', 'confidentiality'),
            severity=incident_data.get('severity', 'medium'),
            affected_subjects=incident_data.get('affected_subjects', 0),
            description=incident_data.get('description', ''),
            cause=incident_data.get('cause', 'Unknown'),
            personal_data_involved=[DataCategory.IDENTITY],  # Would be determined from incident
            likely_consequences=incident_data.get('consequences', ''),
            containment_measures=[],
            notification_required_dpa=False,
            notification_required_subjects=False,
            notification_sent_dpa=False,
            notification_sent_subjects=False,
            lessons_learned=[]
        )
        
        # Assess notification requirements
        breach.notification_required_dpa = await self._assess_dpa_notification_requirement(breach)
        breach.notification_required_subjects = await self._assess_subject_notification_requirement(breach)
        
        # Auto-send notifications if required and confidence is high
        if breach.notification_required_dpa:
            await self._send_dpa_notification(breach)
            breach.notification_sent_dpa = True
        
        if breach.notification_required_subjects:
            await self._send_subject_notifications(breach)
            breach.notification_sent_subjects = True
        
        # Store incident
        self.breach_incidents[incident_id] = breach
        
        logger.info(f"✅ Processed breach {incident_id} - DPA: {breach.notification_sent_dpa}, Subjects: {breach.notification_sent_subjects}")
        
        return breach

    async def _assess_dpa_notification_requirement(self, breach: BreachIncident) -> bool:
        """Assess if Data Protection Authority notification is required (Article 33)"""
        # Notification required unless unlikely to result in risk to rights and freedoms
        return breach.severity in ['medium', 'high', 'critical']

    async def _assess_subject_notification_requirement(self, breach: BreachIncident) -> bool:
        """Assess if data subject notification is required (Article 34)"""
        # Notification required if likely to result in high risk to rights and freedoms
        return breach.severity in ['high', 'critical']

    async def _send_dpa_notification(self, breach: BreachIncident):
        """Send 72-hour notification to Data Protection Authority"""
        logger.info(f"📧 Sending DPA notification for breach {breach.id}")
        # In production, this would send actual notification
        await asyncio.sleep(0.1)

    async def _send_subject_notifications(self, breach: BreachIncident):
        """Send notifications to affected data subjects"""
        logger.info(f"📧 Sending subject notifications for breach {breach.id}")
        # In production, this would send actual notifications
        await asyncio.sleep(0.1)

    async def monitor_data_processing_activities(self):
        """Continuous monitoring of data processing activities"""
        while self.monitoring_active:
            try:
                # Check for new processing activities
                # Update existing activities
                # Monitor compliance drift
                await asyncio.sleep(60)  # Check every minute
            except Exception as e:
                logger.error(f"❌ Monitoring error: {e}")
                await asyncio.sleep(60)

    async def monitor_breach_detection(self):
        """Continuous monitoring for potential breaches"""
        while self.monitoring_active:
            try:
                # Monitor system logs
                # Detect anomalies
                # Trigger breach response if needed
                await asyncio.sleep(30)  # Check every 30 seconds
            except Exception as e:
                logger.error(f"❌ Breach monitoring error: {e}")
                await asyncio.sleep(30)

    async def process_data_subject_requests(self):
        """Continuous processing of data subject requests"""
        while self.monitoring_active:
            try:
                # Check for new requests
                # Process pending requests
                # Send reminders for deadlines
                await asyncio.sleep(300)  # Check every 5 minutes
            except Exception as e:
                logger.error(f"❌ DSR processing error: {e}")
                await asyncio.sleep(300)

    async def monitor_consent_status(self):
        """Monitor consent status and withdrawals"""
        while self.monitoring_active:
            try:
                # Check consent validity
                # Process consent withdrawals
                # Update processing activities
                await asyncio.sleep(600)  # Check every 10 minutes
            except Exception as e:
                logger.error(f"❌ Consent monitoring error: {e}")
                await asyncio.sleep(600)

    async def monitor_cross_border_transfers(self):
        """Monitor cross-border data transfers compliance"""
        while self.monitoring_active:
            try:
                # Check adequacy decisions
                # Validate safeguards
                # Monitor transfer patterns
                await asyncio.sleep(1800)  # Check every 30 minutes
            except Exception as e:
                logger.error(f"❌ Transfer monitoring error: {e}")
                await asyncio.sleep(1800)

    async def generate_compliance_reports(self):
        """Generate periodic compliance reports"""
        while self.monitoring_active:
            try:
                # Generate daily reports
                # Calculate compliance metrics
                # Send alerts for issues
                await asyncio.sleep(86400)  # Daily reports
            except Exception as e:
                logger.error(f"❌ Reporting error: {e}")
                await asyncio.sleep(86400)

    def get_metrics(self) -> Dict[str, Any]:
        """Get current GDPR compliance metrics"""
        return {
            "agent_id": self.agent_id,
            "processing_activities": len(self.processing_activities),
            "data_subject_requests": len(self.data_subject_requests),
            "breach_incidents": len(self.breach_incidents),
            "consent_records": len(self.consent_records),
            "automated_dsr_rate": sum(1 for dsr in self.data_subject_requests.values() if dsr.automated_response) / max(1, len(self.data_subject_requests)) * 100,
            "average_dsr_processing_time": sum(dsr.processing_time_minutes for dsr in self.data_subject_requests.values()) / max(1, len(self.data_subject_requests)),
            "compliance_score": sum(activity.compliance_score for activity in self.processing_activities.values()) / max(1, len(self.processing_activities)),
            "monitoring_active": self.monitoring_active,
            "last_updated": datetime.now().isoformat()
        }

# Example usage and testing
async def main():
    """Example usage of GDPR Compliance Agent"""
    config = {
        "agent_id": "gdpr-agent-demo",
        "systems_to_monitor": ["core-banking", "payment-processing", "customer-portal"],
        "automation_level": "high"
    }
    
    agent = GDPRComplianceAgent(config)
    
    # Discover processing activities
    systems = ["core-banking-system", "payment-processing-system", "analytics-platform"]
    activities = await agent.discover_processing_activities(systems)
    
    # Generate RoPA
    ropa = await agent.generate_ropa_records()
    print("📋 Generated RoPA:")
    print(json.dumps(ropa, indent=2))
    
    # Process a data subject request
    request_data = {
        "request_type": "access",
        "data_subject_id": "customer-12345"
    }
    dsr = await agent.process_data_subject_request(request_data)
    print(f"\n📨 Processed DSR: {dsr.id} - Status: {dsr.status}")
    
    # Simulate breach detection
    breach_data = {
        "category": "confidentiality",
        "severity": "high",
        "affected_subjects": 150,
        "description": "Unauthorized access to customer database",
        "cause": "Misconfigured access controls"
    }
    breach = await agent.detect_and_report_breach(breach_data)
    print(f"\n🚨 Processed breach: {breach.id} - DPA notified: {breach.notification_sent_dpa}")
    
    # Get metrics
    metrics = agent.get_metrics()
    print(f"\n📊 Agent metrics:")
    print(json.dumps(metrics, indent=2))

if __name__ == "__main__":
    asyncio.run(main())