#!/usr/bin/env python3
"""
Demo Data Population Script
Creates sample data for Velocity AI Platform demo
"""
import asyncio
from datetime import datetime, timezone, timedelta
from database import SessionLocal, create_tables
from models import (
    Organization, User, Agent, Integration, EvidenceItem, TrustScore,
    AgentStatus, EvidenceStatus, Platform, Framework, EvidenceType,
    IntegrationStatus
)

async def populate_demo_data():
    """Populate database with demo data"""
    db = SessionLocal()
    
    try:
        print("Creating demo data...")
        
        # Create organization
        org = db.query(Organization).first()
        if not org:
            org = Organization(
                name="Demo Organization",
                domain="demo.com",
                tier="growth",
                settings={"demo": True}
            )
            db.add(org)
            db.commit()
            db.refresh(org)
            print(f"Created organization: {org.name}")
        
        # Create user
        user = db.query(User).first()
        if not user:
            user = User(
                email="demo@velocity.ai",
                name="Demo User",
                role="admin",
                organization_id=org.id
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created user: {user.name}")
        
        # Create integrations
        platforms = [Platform.AWS, Platform.GCP, Platform.AZURE, Platform.GITHUB]
        integrations = []
        
        for platform in platforms:
            existing = db.query(Integration).filter(
                Integration.platform == platform,
                Integration.organization_id == org.id
            ).first()
            
            if not existing:
                integration = Integration(
                    name=f"{platform.value.upper()} Integration",
                    platform=platform,
                    status=IntegrationStatus.CONNECTED,
                    credentials={"demo": True},
                    organization_id=org.id,
                    last_sync=datetime.now(timezone.utc)
                )
                db.add(integration)
                integrations.append(integration)
        
        db.commit()
        print(f"Created {len(integrations)} integrations")
        
        # Refresh integrations from DB
        all_integrations = db.query(Integration).filter(
            Integration.organization_id == org.id
        ).all()
        
        # Create agents
        agent_configs = [
            {
                "name": "SOC 2 AWS Monitor",
                "description": "Monitors AWS infrastructure for SOC 2 compliance",
                "platform": Platform.AWS,
                "framework": Framework.SOC2,
                "status": AgentStatus.RUNNING,
                "evidence_collected": 45,
                "success_rate": 0.96
            },
            {
                "name": "ISO 27001 GCP Scanner",
                "description": "Scans GCP resources for ISO 27001 compliance",
                "platform": Platform.GCP,
                "framework": Framework.ISO27001,
                "status": AgentStatus.IDLE,
                "evidence_collected": 32,
                "success_rate": 0.94
            },
            {
                "name": "CIS Controls Azure Agent",
                "description": "Collects CIS Controls evidence from Azure",
                "platform": Platform.AZURE,
                "framework": Framework.CIS_CONTROLS,
                "status": AgentStatus.COMPLETED,
                "evidence_collected": 67,
                "success_rate": 0.98
            },
            {
                "name": "GDPR GitHub Monitor",
                "description": "Monitors GitHub repositories for GDPR compliance",
                "platform": Platform.GITHUB,
                "framework": Framework.GDPR,
                "status": AgentStatus.RUNNING,
                "evidence_collected": 23,
                "success_rate": 0.91
            }
        ]
        
        agents = []
        for config in agent_configs:
            existing = db.query(Agent).filter(
                Agent.name == config["name"],
                Agent.organization_id == org.id
            ).first()
            
            if not existing:
                # Find matching integration
                integration = next(
                    (i for i in all_integrations if i.platform == config["platform"]),
                    None
                )
                
                agent = Agent(
                    name=config["name"],
                    description=config["description"],
                    platform=config["platform"],
                    framework=config["framework"],
                    status=config["status"],
                    evidence_collected=config["evidence_collected"],
                    success_rate=config["success_rate"],
                    avg_collection_time=120.0,  # 2 minutes
                    last_run=datetime.now(timezone.utc) - timedelta(hours=2),
                    next_run=datetime.now(timezone.utc) + timedelta(hours=6),
                    organization_id=org.id,
                    integration_id=integration.id if integration else None,
                    configuration={"demo": True},
                    schedule={"interval_hours": 6}
                )
                db.add(agent)
                agents.append(agent)
        
        db.commit()
        print(f"Created {len(agents)} agents")
        
        # Refresh agents from DB
        all_agents = db.query(Agent).filter(Agent.organization_id == org.id).all()
        
        # Create evidence items
        evidence_configs = [
            {
                "title": "IAM Policy: PowerUserAccess",
                "description": "AWS IAM policy configuration for access control",
                "evidence_type": EvidenceType.API_RESPONSE,
                "framework": Framework.SOC2,
                "control_id": "CC6.1",
                "confidence_score": 0.95,
                "trust_points": 15
            },
            {
                "title": "S3 Bucket Encryption: prod-data-bucket",
                "description": "S3 bucket encryption configuration for data protection",
                "evidence_type": EvidenceType.CONFIGURATION,
                "framework": Framework.ISO27001,
                "control_id": "A.10.1.1",
                "confidence_score": 0.92,
                "trust_points": 18
            },
            {
                "title": "Azure Security Group: web-tier-sg",
                "description": "Network security group configuration for access control",
                "evidence_type": EvidenceType.CONFIGURATION,
                "framework": Framework.CIS_CONTROLS,
                "control_id": "4.1",
                "confidence_score": 0.88,
                "trust_points": 12
            },
            {
                "title": "GitHub Repository Access Log",
                "description": "Repository access logs for data access monitoring",
                "evidence_type": EvidenceType.LOG_ENTRY,
                "framework": Framework.GDPR,
                "control_id": "Art. 32",
                "confidence_score": 0.90,
                "trust_points": 20
            },
            {
                "title": "CloudTrail Event Logs",
                "description": "AWS CloudTrail logs for system monitoring",
                "evidence_type": EvidenceType.LOG_ENTRY,
                "framework": Framework.SOC2,
                "control_id": "CC7.1",
                "confidence_score": 0.89,
                "trust_points": 22
            }
        ]
        
        evidence_items = []
        for i, config in enumerate(evidence_configs):
            existing = db.query(EvidenceItem).filter(
                EvidenceItem.title == config["title"],
                EvidenceItem.organization_id == org.id
            ).first()
            
            if not existing:
                # Find matching agent
                agent = next(
                    (a for a in all_agents if a.framework == config["framework"]),
                    all_agents[0] if all_agents else None
                )
                
                evidence = EvidenceItem(
                    title=config["title"],
                    description=config["description"],
                    evidence_type=config["evidence_type"],
                    status=EvidenceStatus.VALIDATED if i < 3 else EvidenceStatus.PENDING,
                    framework=config["framework"],
                    control_id=config["control_id"],
                    confidence_score=config["confidence_score"],
                    trust_points=config["trust_points"],
                    agent_id=agent.id if agent else None,
                    organization_id=org.id,
                    data={"demo": True, "evidence_id": i + 1},
                    evidence_metadata={
                        "collection_method": "api",
                        "source": "demo",
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    },
                    created_at=datetime.now(timezone.utc) - timedelta(hours=i)
                )
                db.add(evidence)
                evidence_items.append(evidence)
        
        db.commit()
        print(f"Created {len(evidence_items)} evidence items")
        
        # Create trust score
        existing_score = db.query(TrustScore).filter(
            TrustScore.organization_id == org.id
        ).first()
        
        if not existing_score:
            total_points = sum(e.trust_points for e in db.query(EvidenceItem).filter(
                EvidenceItem.organization_id == org.id,
                EvidenceItem.status == EvidenceStatus.VALIDATED
            ).all())
            
            trust_score = TrustScore(
                organization_id=org.id,
                total_score=total_points,
                framework_scores={
                    "soc2": 37,
                    "iso27001": 18,
                    "cis_controls": 12,
                    "gdpr": 20
                },
                previous_score=total_points - 10,
                score_change=10,
                evidence_count=len(evidence_items),
                automation_rate=0.95,
                coverage_percentage=0.87
            )
            db.add(trust_score)
            db.commit()
            print(f"Created trust score: {total_points} points")
        
        print("Demo data population completed successfully!")
        
    except Exception as e:
        print(f"Error populating demo data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    # Create tables first
    create_tables()
    
    # Populate demo data
    asyncio.run(populate_demo_data())