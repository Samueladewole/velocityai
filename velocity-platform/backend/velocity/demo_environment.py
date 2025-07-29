"""
Demo Environment Generator for Velocity AI Platform
Creates realistic demo data to showcase platform capabilities without requiring real integrations
"""

import asyncio
import json
import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional
from enum import Enum
import random

from sqlalchemy.orm import Session
from models import (
    Organization, User, Agent, EvidenceItem, TrustScore, 
    Framework, Platform, AgentStatus, EvidenceStatus, EvidenceType
)

class DemoScenario(Enum):
    """Types of demo scenarios"""
    STARTUP_SOC2 = "startup_soc2"
    ENTERPRISE_MULTI_FRAMEWORK = "enterprise_multi_framework"
    HEALTHCARE_HIPAA = "healthcare_hipaa"
    FINTECH_COMPREHENSIVE = "fintech_comprehensive"
    SAAS_GROWTH = "saas_growth"

class DemoEnvironmentGenerator:
    """Generates realistic demo environments for different customer scenarios"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.demo_data = {
            "organizations": [],
            "users": [],
            "agents": [],
            "evidence": [],
            "trust_scores": []
        }
    
    async def create_demo_scenario(self, scenario: DemoScenario) -> Dict[str, Any]:
        """Create a complete demo scenario"""
        
        if scenario == DemoScenario.STARTUP_SOC2:
            return await self._create_startup_soc2_demo()
        elif scenario == DemoScenario.ENTERPRISE_MULTI_FRAMEWORK:
            return await self._create_enterprise_demo()
        elif scenario == DemoScenario.HEALTHCARE_HIPAA:
            return await self._create_healthcare_demo()
        elif scenario == DemoScenario.FINTECH_COMPREHENSIVE:
            return await self._create_fintech_demo()
        elif scenario == DemoScenario.SAAS_GROWTH:
            return await self._create_saas_growth_demo()
        
        raise ValueError(f"Unknown demo scenario: {scenario}")
    
    async def _create_startup_soc2_demo(self) -> Dict[str, Any]:
        """Create demo for fast-growing SaaS startup pursuing SOC 2"""
        
        # Create demo organization
        org = Organization(
            name="TechFlow Solutions",
            domain="techflow.com",
            tier="growth",
            industry="SaaS",
            employee_count=85,
            description="Fast-growing B2B SaaS platform for project management",
            compliance_requirements=["SOC2_TYPE_II", "GDPR"],
            current_frameworks=[]
        )
        self.db.add(org)
        self.db.commit()
        self.db.refresh(org)
        
        # Create demo users
        users = [
            User(
                name="Sarah Chen",
                email="sarah.chen@techflow.com",
                role="compliance_manager",
                organization_id=org.id,
                department="Security & Compliance",
                title="Head of Compliance"
            ),
            User(
                name="Marcus Rodriguez", 
                email="marcus.rodriguez@techflow.com",
                role="admin",
                organization_id=org.id,
                department="Engineering",
                title="CTO"
            ),
            User(
                name="Jennifer Kim",
                email="jennifer.kim@techflow.com", 
                role="security_analyst",
                organization_id=org.id,
                department="Security & Compliance",
                title="Security Analyst"
            )
        ]
        
        for user in users:
            self.db.add(user)
        self.db.commit()
        
        # Create demo agents for SOC 2 compliance
        agents = await self._create_soc2_agents(org.id)
        
        # Generate realistic evidence
        evidence_items = await self._create_soc2_evidence(org.id, agents)
        
        # Create trust score progression
        trust_scores = await self._create_trust_score_progression(org.id, "soc2_startup")
        
        return {
            "scenario": "startup_soc2",
            "organization": {
                "id": str(org.id),
                "name": org.name,
                "description": "85-person SaaS startup 6 months into SOC 2 Type II preparation",
                "challenges": [
                    "First-time SOC 2 compliance",
                    "Limited compliance team (2 people)",
                    "Rapid growth making compliance complex",
                    "Tight timeline for customer requirements"
                ],
                "current_status": "60% SOC 2 ready, need evidence automation"
            },
            "users": len(users),
            "agents": len(agents), 
            "evidence_items": len(evidence_items),
            "compliance_progress": "60%",
            "projected_completion": "8 weeks with Velocity automation"
        }
    
    async def _create_enterprise_demo(self) -> Dict[str, Any]:
        """Create demo for large enterprise with multiple frameworks"""
        
        org = Organization(
            name="GlobalTech Enterprises",
            domain="globaltech.com",
            tier="enterprise",
            industry="Technology Services",
            employee_count=2500,
            description="Global technology services company serving Fortune 500 clients",
            compliance_requirements=["SOC2_TYPE_II", "ISO27001", "GDPR", "CCPA"],
            current_frameworks=["SOC2_TYPE_I"]
        )
        self.db.add(org)
        self.db.commit()
        self.db.refresh(org)
        
        # Create enterprise team structure
        users = [
            User(
                name="David Thompson",
                email="david.thompson@globaltech.com",
                role="admin",
                organization_id=org.id,
                department="Information Security",
                title="CISO"
            ),
            User(
                name="Maria Gonzalez",
                email="maria.gonzalez@globaltech.com",
                role="compliance_manager", 
                organization_id=org.id,
                department="Governance, Risk & Compliance",
                title="Director of Compliance"
            ),
            User(
                name="James Wilson",
                email="james.wilson@globaltech.com",
                role="security_analyst",
                organization_id=org.id,
                department="Information Security",
                title="Senior Security Architect"
            ),
            User(
                name="Lisa Park",
                email="lisa.park@globaltech.com",
                role="auditor",
                organization_id=org.id,
                department="Internal Audit",
                title="IT Audit Manager"
            )
        ]
        
        for user in users:
            self.db.add(user)
        self.db.commit()
        
        # Create comprehensive agent suite
        agents = await self._create_multi_framework_agents(org.id)
        
        # Generate extensive evidence across frameworks
        evidence_items = await self._create_multi_framework_evidence(org.id, agents)
        
        # Create trust score for mature organization
        trust_scores = await self._create_trust_score_progression(org.id, "enterprise")
        
        return {
            "scenario": "enterprise_multi_framework",
            "organization": {
                "id": str(org.id),
                "name": org.name,
                "description": "2,500-person enterprise managing multiple compliance frameworks",
                "challenges": [
                    "Multiple simultaneous compliance requirements",
                    "Complex multi-cloud environment",
                    "Distributed team across 12 countries",
                    "Legacy systems requiring special handling"
                ],
                "current_status": "SOC 2 certified, pursuing ISO 27001 and enhanced GDPR"
            },
            "users": len(users),
            "agents": len(agents),
            "evidence_items": len(evidence_items),
            "frameworks": ["SOC 2", "ISO 27001", "GDPR", "CCPA"],
            "compliance_maturity": "Advanced"
        }
    
    async def _create_healthcare_demo(self) -> Dict[str, Any]:
        """Create demo for healthcare organization with HIPAA requirements"""
        
        org = Organization(
            name="MedSecure Health Systems",
            domain="medsecure.health",
            tier="enterprise",
            industry="Healthcare",
            employee_count=450,
            description="Regional healthcare provider with digital health platform",
            compliance_requirements=["HIPAA", "SOC2_TYPE_II", "GDPR"],
            current_frameworks=["HIPAA_BASIC"]
        )
        self.db.add(org)
        self.db.commit()
        self.db.refresh(org)
        
        users = [
            User(
                name="Dr. Patricia Adams",
                email="patricia.adams@medsecure.health",
                role="admin",
                organization_id=org.id,
                department="Information Technology",
                title="Chief Medical Information Officer"
            ),
            User(
                name="Robert Chen",
                email="robert.chen@medsecure.health",
                role="compliance_manager",
                organization_id=org.id,
                department="Compliance & Privacy",
                title="HIPAA Compliance Officer"
            ),
            User(
                name="Amanda Foster",
                email="amanda.foster@medsecure.health",
                role="security_analyst",
                organization_id=org.id,
                department="Information Security",
                title="Healthcare Security Analyst"
            )
        ]
        
        for user in users:
            self.db.add(user)
        self.db.commit()
        
        # Create healthcare-specific agents
        agents = await self._create_healthcare_agents(org.id)
        evidence_items = await self._create_healthcare_evidence(org.id, agents)
        trust_scores = await self._create_trust_score_progression(org.id, "healthcare")
        
        return {
            "scenario": "healthcare_hipaa",
            "organization": {
                "id": str(org.id),
                "name": org.name,
                "description": "450-person healthcare system securing patient data and digital health platforms",
                "challenges": [
                    "PHI protection across multiple systems",
                    "Legacy EMR system integration",
                    "Mobile health app security",
                    "Vendor risk management for healthcare tech"
                ],
                "current_status": "Basic HIPAA compliance, seeking enhanced digital health security"
            },
            "users": len(users),
            "agents": len(agents),
            "evidence_items": len(evidence_items),
            "specialized_focus": "Healthcare data protection and patient privacy"
        }
    
    async def _create_fintech_demo(self) -> Dict[str, Any]:
        """Create demo for fintech company with comprehensive compliance needs"""
        
        org = Organization(
            name="FinanceFlow Technologies",
            domain="financeflow.com", 
            tier="enterprise",
            industry="Financial Services",
            employee_count=320,
            description="Digital banking platform serving small and medium businesses",
            compliance_requirements=["SOC2_TYPE_II", "PCI_DSS", "GDPR", "CCPA", "DORA"],
            current_frameworks=["SOC2_TYPE_I", "PCI_DSS_L1"]
        )
        self.db.add(org)
        self.db.commit()
        self.db.refresh(org)
        
        users = [
            User(
                name="Michael Chang",
                email="michael.chang@financeflow.com",
                role="admin",
                organization_id=org.id,
                department="Risk Management",
                title="Chief Risk Officer"
            ),
            User(
                name="Sarah Okafor",
                email="sarah.okafor@financeflow.com",
                role="compliance_manager",
                organization_id=org.id,
                department="Regulatory Compliance",
                title="Head of Regulatory Affairs"
            ),
            User(
                name="Thomas Müller",
                email="thomas.mueller@financeflow.com",
                role="security_analyst",
                organization_id=org.id,
                department="Cybersecurity",
                title="Senior Security Engineer"
            )
        ]
        
        for user in users:
            self.db.add(user)
        self.db.commit()
        
        # Create fintech-specific agents
        agents = await self._create_fintech_agents(org.id)
        evidence_items = await self._create_fintech_evidence(org.id, agents)
        trust_scores = await self._create_trust_score_progression(org.id, "fintech")
        
        return {
            "scenario": "fintech_comprehensive",
            "organization": {
                "id": str(org.id),
                "name": org.name,
                "description": "320-person fintech managing comprehensive financial services compliance",
                "challenges": [
                    "DORA compliance deadline pressure (January 2025)",
                    "PCI DSS Level 1 maintenance",
                    "Cross-border data transfer compliance",
                    "Real-time transaction monitoring",
                    "Regulatory change management"
                ],
                "current_status": "SOC 2 Type I certified, working toward DORA and enhanced frameworks"
            },
            "users": len(users),
            "agents": len(agents),
            "evidence_items": len(evidence_items),
            "regulatory_focus": "Financial services with EU DORA preparation"
        }
    
    async def _create_saas_growth_demo(self) -> Dict[str, Any]:
        """Create demo for rapidly growing SaaS company"""
        
        org = Organization(
            name="CloudScale Analytics",
            domain="cloudscale.io",
            tier="growth",
            industry="SaaS",  
            employee_count=150,
            description="B2B analytics platform experiencing 300% YoY growth",
            compliance_requirements=["SOC2_TYPE_II", "GDPR", "ISO27001"],
            current_frameworks=[]
        )
        self.db.add(org)
        self.db.commit()
        self.db.refresh(org)
        
        users = [
            User(
                name="Alex Rodriguez",
                email="alex@cloudscale.io",
                role="admin",
                organization_id=org.id,
                department="Engineering",
                title="VP of Engineering"
            ),
            User(
                name="Emma Taylor",
                email="emma@cloudscale.io",
                role="compliance_manager",
                organization_id=org.id,
                department="Operations",
                title="Head of Trust & Safety"
            )
        ]
        
        for user in users:
            self.db.add(user)
        self db.commit()
        
        # Create growth-stage agents
        agents = await self._create_growth_stage_agents(org.id)
        evidence_items = await self._create_growth_stage_evidence(org.id, agents)
        trust_scores = await self._create_trust_score_progression(org.id, "growth")
        
        return {
            "scenario": "saas_growth",
            "organization": {
                "id": str(org.id),
                "name": org.name,
                "description": "150-person SaaS company scaling rapidly and establishing compliance foundation",
                "challenges": [
                    "Rapid scaling outpacing security measures",
                    "Customer-driven compliance requirements", 
                    "Limited dedicated compliance resources",
                    "Multi-cloud architecture complexity"
                ],
                "current_status": "Building compliance program while maintaining growth velocity"
            },
            "users": len(users),
            "agents": len(agents),
            "evidence_items": len(evidence_items),
            "growth_context": "300% YoY growth requiring scalable compliance automation"
        }
    
    async def _create_soc2_agents(self, org_id: str) -> List[Agent]:
        """Create agents optimized for SOC 2 compliance"""
        
        agents = [
            Agent(
                name="SOC 2 Security Agent",
                description="Automated security control monitoring for SOC 2 Type II",
                platform=Platform.AWS,
                framework=Framework.SOC2,
                status=AgentStatus.ACTIVE,
                organization_id=org_id,
                configuration={
                    "controls": ["CC1.1", "CC1.2", "CC1.3", "CC6.1", "CC6.2", "CC6.3"],
                    "evidence_types": ["security_configurations", "access_logs", "network_security"],
                    "collection_frequency": "daily"
                },
                success_rate=0.94,
                evidence_collected=156,
                avg_collection_time=145.0
            ),
            Agent(
                name="Access Control Monitor",
                description="Monitors user access and authentication controls",
                platform=Platform.GCP,
                framework=Framework.SOC2,
                status=AgentStatus.ACTIVE,
                organization_id=org_id,
                configuration={
                    "controls": ["CC6.1", "CC6.2", "CC6.7"],
                    "evidence_types": ["user_provisioning", "access_reviews", "mfa_enforcement"],
                    "collection_frequency": "daily"
                },
                success_rate=0.91,
                evidence_collected=203,
                avg_collection_time=98.5
            ),
            Agent(
                name="Data Protection Agent",
                description="Monitors data classification and protection controls",
                platform=Platform.AZURE,
                framework=Framework.SOC2,
                status=AgentStatus.ACTIVE,
                organization_id=org_id,
                configuration={
                    "controls": ["CC6.5", "CC7.1", "CC7.2"],
                    "evidence_types": ["encryption_status", "data_classification", "backup_verification"],
                    "collection_frequency": "daily"
                },
                success_rate=0.89,
                evidence_collected=134,
                avg_collection_time=187.3
            )
        ]
        
        for agent in agents:
            self.db.add(agent)
        self.db.commit()
        
        return agents
    
    async def _create_soc2_evidence(self, org_id: str, agents: List[Agent]) -> List[EvidenceItem]:
        """Create realistic SOC 2 evidence items"""
        
        evidence_templates = [
            {
                "title": "Multi-Factor Authentication Configuration",
                "control_id": "CC6.1",
                "evidence_type": EvidenceType.CONFIGURATION,
                "confidence_score": 0.95,
                "trust_points": 15,
                "data": {
                    "mfa_enabled": True,
                    "enforcement_policy": "Required for all users",
                    "supported_methods": ["TOTP", "SMS", "Hardware tokens"],
                    "compliance_rate": "98.5%"
                }
            },
            {
                "title": "Encryption at Rest Implementation",
                "control_id": "CC6.5",
                "evidence_type": EvidenceType.CONFIGURATION,
                "confidence_score": 0.92,
                "trust_points": 20,
                "data": {
                    "encryption_enabled": True,
                    "algorithm": "AES-256",
                    "key_management": "AWS KMS",
                    "coverage": "All production databases and file systems"
                }
            },
            {
                "title": "Network Security Group Rules",
                "control_id": "CC6.1",
                "evidence_type": EvidenceType.CONFIGURATION,
                "confidence_score": 0.88,
                "trust_points": 12,
                "data": {
                    "default_deny": True,
                    "ingress_rules": 23,
                    "egress_rules": 15,
                    "last_reviewed": "2024-07-15"
                }
            },
            {
                "title": "Access Review Results - Q3 2024",
                "control_id": "CC6.2",
                "evidence_type": EvidenceType.POLICY_DOCUMENT,
                "confidence_score": 0.96,
                "trust_points": 18,
                "data": {
                    "review_completion": "100%",
                    "users_reviewed": 85,
                    "access_removed": 12,
                    "exceptions_approved": 3,
                    "next_review_date": "2025-01-15"
                }
            },
            {
                "title": "Backup Verification Test Results",
                "control_id": "CC7.2",
                "evidence_type": EvidenceType.SCAN_RESULT,
                "confidence_score": 0.87,
                "trust_points": 14,
                "data": {
                    "backup_success_rate": "99.2%",
                    "restore_test_passed": True,
                    "rto_target": "4 hours",
                    "rpo_target": "1 hour",
                    "last_tested": "2024-07-20"
                }
            }
        ]
        
        evidence_items = []
        
        for i, template in enumerate(evidence_templates):
            # Create multiple instances with realistic dates
            for days_ago in [1, 7, 14, 30, 60]:
                evidence = EvidenceItem(
                    title=f"{template['title']} - {days_ago} days ago",
                    description=f"Automated evidence collection for {template['control_id']}",
                    evidence_type=template['evidence_type'],
                    framework=Framework.SOC2,
                    control_id=template['control_id'],
                    status=EvidenceStatus.VALIDATED,
                    confidence_score=template['confidence_score'] + random.uniform(-0.05, 0.05),
                    trust_points=template['trust_points'] + random.randint(-2, 2),
                    organization_id=org_id,
                    agent_id=agents[i % len(agents)].id,
                    data=template['data'],
                    evidence_metadata={
                        "collection_method": "automated",
                        "agent_version": "1.0.0",
                        "collection_duration": random.uniform(30, 180)
                    },
                    created_at=datetime.now(timezone.utc) - timedelta(days=days_ago),
                    validated_at=datetime.now(timezone.utc) - timedelta(days=days_ago-1) if days_ago > 1 else None
                )
                evidence_items.append(evidence)
                self.db.add(evidence)
        
        self.db.commit()
        return evidence_items
    
    async def _create_multi_framework_agents(self, org_id: str) -> List[Agent]:
        """Create comprehensive agent suite for enterprise multi-framework compliance"""
        
        agents = [
            Agent(
                name="Enterprise Security Orchestrator",
                description="Coordinates security controls across SOC 2 and ISO 27001",
                platform=Platform.AWS,
                framework=Framework.SOC2,
                status=AgentStatus.ACTIVE,
                organization_id=org_id,
                success_rate=0.96,
                evidence_collected=324
            ),
            Agent(
                name="GDPR Privacy Guardian",
                description="Monitors data processing and privacy controls",
                platform=Platform.GCP,
                framework=Framework.GDPR,
                status=AgentStatus.ACTIVE,
                organization_id=org_id,
                success_rate=0.93,
                evidence_collected=189
            ),
            Agent(
                name="ISO 27001 Risk Assessor", 
                description="Continuous risk assessment and treatment monitoring",
                platform=Platform.AZURE,
                framework=Framework.ISO27001,
                status=AgentStatus.ACTIVE,
                organization_id=org_id,
                success_rate=0.91,
                evidence_collected=267
            ),
            Agent(
                name="Multi-Cloud Configuration Scanner",
                description="Scans security configurations across all cloud platforms",
                platform=Platform.AWS,
                framework=Framework.SOC2,
                status=AgentStatus.ACTIVE,
                organization_id=org_id,
                success_rate=0.89,
                evidence_collected=445
            )
        ]
        
        for agent in agents:
            self.db.add(agent)
        self.db.commit()
        
        return agents
    
    async def _create_multi_framework_evidence(self, org_id: str, agents: List[Agent]) -> List[EvidenceItem]:
        """Create evidence across multiple compliance frameworks"""
        
        # This would create comprehensive evidence across SOC 2, ISO 27001, GDPR
        # Simplified for demo purposes
        evidence_items = []
        
        frameworks = [Framework.SOC2, Framework.ISO27001, Framework.GDPR]
        
        for framework in frameworks:
            for i in range(50):  # 50 evidence items per framework
                evidence = EvidenceItem(
                    title=f"{framework.value} Control Evidence #{i+1}",
                    description=f"Automated evidence for {framework.value} compliance",
                    evidence_type=random.choice(list(EvidenceType)),
                    framework=framework,
                    control_id=f"{framework.value}_CTRL_{i+1:03d}",
                    status=random.choice([EvidenceStatus.VALIDATED, EvidenceStatus.PENDING, EvidenceStatus.REJECTED]),
                    confidence_score=random.uniform(0.7, 0.98),
                    trust_points=random.randint(8, 25),
                    organization_id=org_id,
                    agent_id=random.choice(agents).id,
                    created_at=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 90))
                )
                evidence_items.append(evidence)
                self.db.add(evidence)
        
        self.db.commit()
        return evidence_items
    
    async def _create_healthcare_agents(self, org_id: str) -> List[Agent]:
        """Create healthcare-specific compliance agents"""
        
        agents = [
            Agent(
                name="HIPAA Privacy Protector",
                description="Monitors PHI access and privacy controls",
                platform=Platform.AWS,
                framework=Framework.HIPAA,
                status=AgentStatus.ACTIVE,
                organization_id=org_id,
                success_rate=0.97,
                evidence_collected=156
            ),
            Agent(
                name="Healthcare Security Scanner",
                description="Specialized security scanning for healthcare environments",
                platform=Platform.AZURE,
                framework=Framework.HIPAA,
                status=AgentStatus.ACTIVE,
                organization_id=org_id,
                success_rate=0.94,
                evidence_collected=203
            )
        ]
        
        for agent in agents:
            self.db.add(agent)
        self.db.commit()
        
        return agents
    
    async def _create_healthcare_evidence(self, org_id: str, agents: List[Agent]) -> List[EvidenceItem]:
        """Create healthcare-specific evidence"""
        
        evidence_items = []
        
        # Healthcare-specific evidence templates
        healthcare_templates = [
            {
                "title": "PHI Access Audit Log",
                "control_id": "164.308(a)(1)(ii)(D)",
                "evidence_type": EvidenceType.LOG_ENTRY,
                "data": {"phi_access_events": 1247, "unauthorized_attempts": 0}
            },
            {
                "title": "Encryption of PHI at Rest",
                "control_id": "164.312(a)(2)(iv)",
                "evidence_type": EvidenceType.CONFIGURATION,
                "data": {"encryption_standard": "AES-256", "phi_encrypted": True}
            }
        ]
        
        for template in healthcare_templates:
            for i in range(20):
                evidence = EvidenceItem(
                    title=f"{template['title']} - Week {i+1}",
                    description=f"HIPAA compliance evidence for {template['control_id']}",
                    evidence_type=template['evidence_type'],
                    framework=Framework.HIPAA,
                    control_id=template['control_id'],
                    status=EvidenceStatus.VALIDATED,
                    confidence_score=random.uniform(0.85, 0.98),
                    trust_points=random.randint(12, 22),
                    organization_id=org_id,
                    agent_id=random.choice(agents).id,
                    data=template['data'],
                    created_at=datetime.now(timezone.utc) - timedelta(weeks=i)
                )
                evidence_items.append(evidence)
                self.db.add(evidence)
        
        self.db.commit()
        return evidence_items
    
    async def _create_fintech_agents(self, org_id: str) -> List[Agent]:
        """Create fintech-specific compliance agents"""
        
        agents = [
            Agent(
                name="DORA Resilience Monitor",
                description="Monitors digital operational resilience for DORA compliance",
                platform=Platform.AWS,
                framework=Framework.DORA,
                status=AgentStatus.ACTIVE,
                organization_id=org_id,
                success_rate=0.91,
                evidence_collected=278
            ),
            Agent(
                name="PCI DSS Payment Security Guardian", 
                description="Ensures payment card industry security compliance",
                platform=Platform.GCP,
                framework=Framework.PCI_DSS,
                status=AgentStatus.ACTIVE,
                organization_id=org_id,
                success_rate=0.95,
                evidence_collected=189
            )
        ]
        
        for agent in agents:
            self.db.add(agent)
        self.db.commit()
        
        return agents
    
    async def _create_fintech_evidence(self, org_id: str, agents: List[Agent]) -> List[EvidenceItem]:
        """Create fintech-specific evidence"""
        
        evidence_items = []
        
        # DORA and PCI DSS specific evidence
        fintech_templates = [
            {
                "title": "ICT Risk Management Framework",
                "control_id": "DORA_ART_5",
                "evidence_type": EvidenceType.POLICY_DOCUMENT,
                "data": {"framework_status": "implemented", "last_review": "2024-06-15"}
            },
            {
                "title": "Payment Processing Security Scan",
                "control_id": "PCI_DSS_11.2",
                "evidence_type": EvidenceType.SCAN_RESULT,
                "data": {"vulnerabilities_found": 0, "scan_passed": True}
            }
        ]
        
        for template in fintech_templates:
            for i in range(30):
                evidence = EvidenceItem(
                    title=f"{template['title']} - {i+1}",
                    description=f"Financial services compliance evidence",
                    evidence_type=template['evidence_type'],
                    framework=Framework.SOC2,  # Using SOC2 as placeholder
                    control_id=template['control_id'],
                    status=EvidenceStatus.VALIDATED,
                    confidence_score=random.uniform(0.88, 0.99),
                    trust_points=random.randint(15, 28),
                    organization_id=org_id,
                    agent_id=random.choice(agents).id,
                    data=template['data'],
                    created_at=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 60))
                )
                evidence_items.append(evidence)
                self.db.add(evidence)
        
        self.db.commit()
        return evidence_items
    
    async def _create_growth_stage_agents(self, org_id: str) -> List[Agent]:
        """Create agents for rapidly growing SaaS company"""
        
        agents = [
            Agent(
                name="Rapid Growth Security Agent",
                description="Scales security monitoring with company growth",
                platform=Platform.AWS,
                framework=Framework.SOC2,
                status=AgentStatus.ACTIVE,
                organization_id=org_id,
                success_rate=0.88,
                evidence_collected=92
            ),
            Agent(
                name="Customer Trust Builder",
                description="Builds customer confidence through compliance automation",
                platform=Platform.GCP,
                framework=Framework.SOC2,
                status=AgentStatus.ACTIVE,
                organization_id=org_id,
                success_rate=0.93,
                evidence_collected=134
            )
        ]
        
        for agent in agents:
            self.db.add(agent)
        self.db.commit()
        
        return agents
    
    async def _create_growth_stage_evidence(self, org_id: str, agents: List[Agent]) -> List[EvidenceItem]:
        """Create evidence showing compliance journey for growing company"""
        
        evidence_items = []
        
        # Show progression from basic to advanced compliance
        growth_progression = [
            {"week": 1, "maturity": "basic", "evidence_count": 5, "confidence": 0.70},
            {"week": 4, "maturity": "developing", "evidence_count": 15, "confidence": 0.78},
            {"week": 8, "maturity": "advancing", "evidence_count": 35, "confidence": 0.85},
            {"week": 12, "maturity": "mature", "evidence_count": 65, "confidence": 0.92}
        ]
        
        for stage in growth_progression:
            for i in range(stage["evidence_count"]):
                evidence = EvidenceItem(
                    title=f"SOC 2 Evidence - Week {stage['week']} #{i+1}",
                    description=f"Compliance evidence during {stage['maturity']} stage",
                    evidence_type=random.choice(list(EvidenceType)),
                    framework=Framework.SOC2,
                    control_id=f"CC{random.randint(1,8)}.{random.randint(1,8)}",
                    status=EvidenceStatus.VALIDATED,
                    confidence_score=stage["confidence"] + random.uniform(-0.05, 0.05),
                    trust_points=random.randint(8, 18),
                    organization_id=org_id,
                    agent_id=random.choice(agents).id,
                    created_at=datetime.now(timezone.utc) - timedelta(weeks=12-stage["week"])
                )
                evidence_items.append(evidence)
                self.db.add(evidence)
        
        self.db.commit()
        return evidence_items
    
    async def _create_trust_score_progression(self, org_id: str, scenario_type: str) -> List[TrustScore]:
        """Create realistic trust score progression"""
        
        trust_scores = []
        
        # Define progression patterns for different scenarios
        if scenario_type == "soc2_startup":
            # Startup SOC 2 journey
            progression = [
                {"weeks_ago": 12, "score": 25, "evidence": 15},
                {"weeks_ago": 8, "score": 45, "evidence": 45},
                {"weeks_ago": 4, "score": 65, "evidence": 85},
                {"weeks_ago": 0, "score": 75, "evidence": 156}
            ]
        elif scenario_type == "enterprise":
            # Mature enterprise progression
            progression = [
                {"weeks_ago": 24, "score": 65, "evidence": 200},
                {"weeks_ago": 16, "score": 78, "evidence": 350},
                {"weeks_ago": 8, "score": 85, "evidence": 500},
                {"weeks_ago": 0, "score": 92, "evidence": 678}
            ]
        elif scenario_type == "healthcare":
            # Healthcare compliance journey
            progression = [
                {"weeks_ago": 16, "score": 55, "evidence": 80},
                {"weeks_ago": 12, "score": 72, "evidence": 150},
                {"weeks_ago": 6, "score": 84, "evidence": 220},
                {"weeks_ago": 0, "score": 88, "evidence": 289}
            ]
        elif scenario_type == "fintech":
            # Fintech regulatory compliance
            progression = [
                {"weeks_ago": 20, "score": 70, "evidence": 180},
                {"weeks_ago": 12, "score": 82, "evidence": 280},
                {"weeks_ago": 6, "score": 89, "evidence": 380},
                {"weeks_ago": 0, "score": 94, "evidence": 445}
            ]
        else:  # growth
            # Rapid growth company
            progression = [
                {"weeks_ago": 8, "score": 35, "evidence": 25},
                {"weeks_ago": 6, "score": 52, "evidence": 55},
                {"weeks_ago": 3, "score": 68, "evidence": 95},
                {"weeks_ago": 0, "score": 78, "evidence": 134}
            ]
        
        for point in progression:
            trust_score = TrustScore(
                organization_id=org_id,
                total_score=point["score"],
                framework_scores={
                    "soc2": point["score"] * 0.9,
                    "gdpr": point["score"] * 0.8 if scenario_type != "soc2_startup" else 0,
                    "iso27001": point["score"] * 0.85 if scenario_type == "enterprise" else 0
                },
                evidence_count=point["evidence"],
                automation_rate=min(point["score"] / 100.0, 0.95),
                coverage_percentage=min(point["score"] * 1.1, 100),
                score_change=5.0 if point != progression[0] else 0.0,
                created_at=datetime.now(timezone.utc) - timedelta(weeks=point["weeks_ago"]),
                last_updated=datetime.now(timezone.utc) - timedelta(weeks=point["weeks_ago"])
            )
            trust_scores.append(trust_score)
            self.db.add(trust_score)
        
        self.db.commit()
        return trust_scores
    
    async def get_demo_scenario_summary(self, scenario: DemoScenario) -> Dict[str, Any]:
        """Get a summary of available demo scenarios"""
        
        scenarios = {
            DemoScenario.STARTUP_SOC2: {
                "name": "Fast-Growing SaaS Startup",
                "description": "85-person SaaS company pursuing first SOC 2 certification",
                "industry": "Technology",
                "compliance_focus": "SOC 2 Type II",
                "key_challenges": [
                    "Limited compliance expertise",
                    "Rapid growth complexity",
                    "Customer requirement pressure",
                    "Resource constraints"
                ],
                "demo_highlights": [
                    "60% compliance progress visualization",
                    "Automated evidence collection showcase",
                    "8-week certification timeline projection",
                    "Cost savings calculation"
                ]
            },
            
            DemoScenario.ENTERPRISE_MULTI_FRAMEWORK: {
                "name": "Global Enterprise Corporation",
                "description": "2,500-person enterprise managing multiple frameworks",
                "industry": "Technology Services",
                "compliance_focus": "SOC 2, ISO 27001, GDPR, CCPA",
                "key_challenges": [
                    "Multiple simultaneous requirements",
                    "Complex multi-cloud environment",
                    "Global team coordination",
                    "Legacy system integration"
                ],
                "demo_highlights": [
                    "Multi-framework orchestration",
                    "Enterprise-scale evidence management",
                    "Cross-framework control mapping",
                    "Advanced analytics and reporting"
                ]
            },
            
            DemoScenario.HEALTHCARE_HIPAA: {
                "name": "Regional Healthcare System",
                "description": "450-person healthcare provider with digital platforms",
                "industry": "Healthcare",
                "compliance_focus": "HIPAA, SOC 2, GDPR",
                "key_challenges": [
                    "PHI protection requirements",
                    "Legacy EMR integration",
                    "Mobile health app security",
                    "Vendor risk management"
                ],
                "demo_highlights": [
                    "Healthcare-specific security monitoring",
                    "PHI access tracking automation",
                    "Medical device compliance integration",
                    "Patient privacy protection showcase"
                ]
            },
            
            DemoScenario.FINTECH_COMPREHENSIVE: {
                "name": "Digital Banking Platform",
                "description": "320-person fintech with comprehensive compliance needs",
                "industry": "Financial Services",
                "compliance_focus": "SOC 2, PCI DSS, GDPR, DORA",
                "key_challenges": [
                    "DORA compliance timeline pressure",
                    "PCI DSS Level 1 requirements",
                    "Cross-border regulatory compliance",
                    "Real-time transaction monitoring"
                ],
                "demo_highlights": [
                    "Financial services regulatory automation",
                    "DORA preparation and compliance tracking",
                    "Payment security monitoring",
                    "Regulatory change management"
                ]
            },
            
            DemoScenario.SAAS_GROWTH: {
                "name": "Rapidly Scaling Analytics Platform",
                "description": "150-person SaaS experiencing 300% YoY growth",
                "industry": "SaaS",
                "compliance_focus": "SOC 2, GDPR, ISO 27001",
                "key_challenges": [
                    "Growth outpacing security measures",
                    "Customer-driven compliance demands",
                    "Limited compliance resources",
                    "Multi-cloud complexity"
                ],
                "demo_highlights": [
                    "Scalable compliance automation",
                    "Growth-stage security progression",
                    "Customer trust building metrics",
                    "Compliance velocity optimization"
                ]
            }
        }
        
        return scenarios.get(scenario, {})
    
    async def cleanup_demo_data(self, organization_id: str):
        """Clean up demo data for a specific organization"""
        
        # Delete in reverse dependency order
        self.db.query(TrustScore).filter(TrustScore.organization_id == organization_id).delete()
        self.db.query(EvidenceItem).filter(EvidenceItem.organization_id == organization_id).delete()
        self.db.query(Agent).filter(Agent.organization_id == organization_id).delete()
        self.db.query(User).filter(User.organization_id == organization_id).delete()
        self.db.query(Organization).filter(Organization.id == organization_id).delete()
        
        self.db.commit()

# Demo environment factory
demo_generator = None

def get_demo_generator(db: Session) -> DemoEnvironmentGenerator:
    """Get or create demo environment generator"""
    global demo_generator
    if demo_generator is None:
        demo_generator = DemoEnvironmentGenerator(db)
    return demo_generator