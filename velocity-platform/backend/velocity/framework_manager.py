"""
Framework Management Module for Velocity AI Platform
Handles framework configuration, enabling/disabling, and compliance status tracking
"""

from typing import Dict, List, Optional, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
import logging
import json

from models import (
    Framework, Organization, Agent, EvidenceItem, 
    AgentStatus, EvidenceStatus, Base
)
from database import SessionLocal
from validation import VelocityException

logger = logging.getLogger(__name__)

# Framework configurations and requirements
FRAMEWORK_CONFIGS = {
    Framework.SOC2: {
        "name": "SOC 2 Type II",
        "description": "Service Organization Control 2 - Security, Availability, Processing Integrity, Confidentiality, Privacy",
        "control_families": ["CC", "A", "C", "P", "PI"],
        "total_controls": 64,
        "audit_frequency": "annual",
        "evidence_refresh": 90,  # days
        "required_evidence_types": ["policies", "screenshots", "logs", "configs"],
        "automation_available": True,
        "ai_coverage": 0.95
    },
    Framework.ISO27001: {
        "name": "ISO 27001:2022",
        "description": "International standard for information security management systems",
        "control_families": ["A.5", "A.6", "A.7", "A.8", "A.9", "A.10", "A.11", "A.12", "A.13", "A.14", "A.15", "A.16", "A.17", "A.18"],
        "total_controls": 93,
        "audit_frequency": "annual",
        "evidence_refresh": 365,  # days
        "required_evidence_types": ["policies", "procedures", "records", "reviews"],
        "automation_available": True,
        "ai_coverage": 0.92
    },
    Framework.GDPR: {
        "name": "General Data Protection Regulation",
        "description": "EU data protection and privacy regulation",
        "control_families": ["Art.5", "Art.6", "Art.7", "Art.12-23", "Art.24-43", "Art.44-50"],
        "total_controls": 99,
        "audit_frequency": "continuous",
        "evidence_refresh": 30,  # days
        "required_evidence_types": ["privacy_notices", "consent_records", "data_maps", "dpia"],
        "automation_available": True,
        "ai_coverage": 0.88
    },
    Framework.HIPAA: {
        "name": "Health Insurance Portability and Accountability Act",
        "description": "US healthcare data privacy and security provisions",
        "control_families": ["Administrative", "Physical", "Technical", "Organizational"],
        "total_controls": 54,
        "audit_frequency": "annual",
        "evidence_refresh": 180,  # days
        "required_evidence_types": ["risk_assessments", "training_records", "access_logs", "encryption_configs"],
        "automation_available": True,
        "ai_coverage": 0.91
    },
    Framework.CIS_CONTROLS: {
        "name": "CIS Controls v8",
        "description": "Center for Internet Security critical security controls",
        "control_families": ["IG1", "IG2", "IG3"],
        "total_controls": 153,
        "audit_frequency": "quarterly",
        "evidence_refresh": 90,  # days
        "required_evidence_types": ["configs", "vulnerability_scans", "patches", "inventories"],
        "automation_available": True,
        "ai_coverage": 0.96
    },
    Framework.PCI_DSS: {
        "name": "Payment Card Industry Data Security Standard v4.0",
        "description": "Security standard for organizations handling credit cards",
        "control_families": ["Build", "Maintain", "Test", "Monitor", "Manage"],
        "total_controls": 264,
        "audit_frequency": "quarterly",
        "evidence_refresh": 90,  # days
        "required_evidence_types": ["network_diagrams", "scan_results", "configs", "policies"],
        "automation_available": True,
        "ai_coverage": 0.89
    }
}

class FrameworkManager:
    """Manages framework configuration and status for organizations"""
    
    def __init__(self):
        self.framework_configs = FRAMEWORK_CONFIGS
        
    def get_framework_info(self, framework: Framework) -> Dict[str, Any]:
        """Get detailed information about a framework"""
        return self.framework_configs.get(framework, {})
    
    def get_all_frameworks(self) -> List[Dict[str, Any]]:
        """Get information about all available frameworks"""
        frameworks = []
        for fw in Framework:
            info = self.get_framework_info(fw)
            if info:
                frameworks.append({
                    "id": fw.value,
                    "name": info["name"],
                    "description": info["description"],
                    "total_controls": info["total_controls"],
                    "automation_available": info["automation_available"],
                    "ai_coverage": info["ai_coverage"]
                })
        return frameworks
    
    def enable_framework(
        self, 
        db: Session,
        organization_id: str,
        framework: Framework,
        configuration: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Enable a framework for an organization"""
        try:
            # Check if framework is already enabled
            existing_agents = db.query(Agent).filter(
                and_(
                    Agent.organization_id == organization_id,
                    Agent.framework == framework
                )
            ).all()
            
            if existing_agents:
                # Update configuration if provided
                if configuration:
                    for agent in existing_agents:
                        agent.configuration.update(configuration)
                    db.commit()
                
                return {
                    "framework": framework.value,
                    "status": "already_enabled",
                    "agents": len(existing_agents),
                    "message": f"{framework.value} is already enabled with {len(existing_agents)} agents"
                }
            
            # Create framework-specific agents
            framework_info = self.get_framework_info(framework)
            agents_created = []
            
            # Create evidence collection agent
            evidence_agent = Agent(
                name=f"{framework.value}_evidence_collector",
                description=f"Automated evidence collection for {framework_info['name']}",
                agent_type="evidence_collector",
                platform=None,  # Multi-platform
                framework=framework,
                status=AgentStatus.IDLE,
                configuration=configuration or {
                    "auto_collect": True,
                    "collection_frequency": "daily",
                    "evidence_types": framework_info["required_evidence_types"]
                },
                organization_id=organization_id
            )
            db.add(evidence_agent)
            agents_created.append(evidence_agent)
            
            # Create compliance monitoring agent
            monitor_agent = Agent(
                name=f"{framework.value}_compliance_monitor",
                description=f"Continuous compliance monitoring for {framework_info['name']}",
                agent_type="compliance_monitor",
                platform=None,
                framework=framework,
                status=AgentStatus.IDLE,
                configuration=configuration or {
                    "monitoring_enabled": True,
                    "alert_threshold": 0.8,
                    "check_frequency": "hourly"
                },
                organization_id=organization_id
            )
            db.add(monitor_agent)
            agents_created.append(monitor_agent)
            
            # Create gap analysis agent
            gap_agent = Agent(
                name=f"{framework.value}_gap_analyzer",
                description=f"Gap analysis and recommendations for {framework_info['name']}",
                agent_type="gap_analyzer",
                platform=None,
                framework=framework,
                status=AgentStatus.IDLE,
                configuration=configuration or {
                    "analysis_depth": "comprehensive",
                    "recommendation_priority": "risk_based"
                },
                organization_id=organization_id
            )
            db.add(gap_agent)
            agents_created.append(gap_agent)
            
            db.commit()
            
            # Update organization settings
            org = db.query(Organization).filter(Organization.id == organization_id).first()
            if org:
                if not org.settings:
                    org.settings = {}
                if "enabled_frameworks" not in org.settings:
                    org.settings["enabled_frameworks"] = []
                if framework.value not in org.settings["enabled_frameworks"]:
                    org.settings["enabled_frameworks"].append(framework.value)
                db.commit()
            
            logger.info(f"Enabled {framework.value} for organization {organization_id}")
            
            return {
                "framework": framework.value,
                "status": "enabled",
                "agents_created": len(agents_created),
                "agent_ids": [str(agent.id) for agent in agents_created],
                "message": f"Successfully enabled {framework_info['name']} with {len(agents_created)} agents"
            }
            
        except Exception as e:
            logger.error(f"Error enabling framework: {e}")
            db.rollback()
            raise VelocityException(f"Failed to enable framework: {str(e)}")
    
    def disable_framework(
        self,
        db: Session,
        organization_id: str,
        framework: Framework
    ) -> Dict[str, Any]:
        """Disable a framework for an organization"""
        try:
            # Find all agents for this framework
            agents = db.query(Agent).filter(
                and_(
                    Agent.organization_id == organization_id,
                    Agent.framework == framework
                )
            ).all()
            
            if not agents:
                return {
                    "framework": framework.value,
                    "status": "not_enabled",
                    "message": f"{framework.value} is not currently enabled"
                }
            
            # Set all agents to inactive
            for agent in agents:
                agent.status = AgentStatus.INACTIVE
            
            # Update organization settings
            org = db.query(Organization).filter(Organization.id == organization_id).first()
            if org and org.settings and "enabled_frameworks" in org.settings:
                if framework.value in org.settings["enabled_frameworks"]:
                    org.settings["enabled_frameworks"].remove(framework.value)
            
            db.commit()
            
            logger.info(f"Disabled {framework.value} for organization {organization_id}")
            
            return {
                "framework": framework.value,
                "status": "disabled",
                "agents_deactivated": len(agents),
                "message": f"Successfully disabled {framework.value} and deactivated {len(agents)} agents"
            }
            
        except Exception as e:
            logger.error(f"Error disabling framework: {e}")
            db.rollback()
            raise VelocityException(f"Failed to disable framework: {str(e)}")
    
    def get_framework_status(
        self,
        db: Session,
        organization_id: str,
        framework: Optional[Framework] = None
    ) -> Dict[str, Any]:
        """Get framework compliance status for an organization"""
        try:
            if framework:
                # Get status for specific framework
                return self._get_single_framework_status(db, organization_id, framework)
            else:
                # Get status for all frameworks
                statuses = {}
                for fw in Framework:
                    statuses[fw.value] = self._get_single_framework_status(db, organization_id, fw)
                return statuses
                
        except Exception as e:
            logger.error(f"Error getting framework status: {e}")
            raise VelocityException(f"Failed to get framework status: {str(e)}")
    
    def _get_single_framework_status(
        self,
        db: Session,
        organization_id: str,
        framework: Framework
    ) -> Dict[str, Any]:
        """Get status for a single framework"""
        # Check if framework is enabled
        org = db.query(Organization).filter(Organization.id == organization_id).first()
        enabled = False
        if org and org.settings and "enabled_frameworks" in org.settings:
            enabled = framework.value in org.settings["enabled_frameworks"]
        
        if not enabled:
            return {
                "enabled": False,
                "compliance_score": 0,
                "message": "Framework not enabled"
            }
        
        # Get framework info
        framework_info = self.get_framework_info(framework)
        
        # Get agents status
        agents = db.query(Agent).filter(
            and_(
                Agent.organization_id == organization_id,
                Agent.framework == framework
            )
        ).all()
        
        active_agents = [a for a in agents if a.status == AgentStatus.ACTIVE]
        
        # Get evidence status
        evidence_items = db.query(EvidenceItem).filter(
            and_(
                EvidenceItem.organization_id == organization_id,
                EvidenceItem.framework == framework
            )
        ).all()
        
        verified_evidence = [e for e in evidence_items if e.status == EvidenceStatus.VERIFIED]
        pending_evidence = [e for e in evidence_items if e.status == EvidenceStatus.PENDING]
        
        # Calculate compliance score
        total_controls = framework_info["total_controls"]
        covered_controls = len(set([e.control_id for e in verified_evidence]))
        compliance_score = (covered_controls / total_controls) * 100 if total_controls > 0 else 0
        
        # Check for expiring evidence
        expiring_soon = []
        for evidence in verified_evidence:
            if evidence.expires_at:
                days_until_expiry = (evidence.expires_at - datetime.now(timezone.utc)).days
                if days_until_expiry <= 30:
                    expiring_soon.append({
                        "control_id": evidence.control_id,
                        "days_until_expiry": days_until_expiry
                    })
        
        return {
            "enabled": True,
            "framework_name": framework_info["name"],
            "compliance_score": round(compliance_score, 2),
            "total_controls": total_controls,
            "covered_controls": covered_controls,
            "agents": {
                "total": len(agents),
                "active": len(active_agents)
            },
            "evidence": {
                "total": len(evidence_items),
                "verified": len(verified_evidence),
                "pending": len(pending_evidence),
                "expiring_soon": len(expiring_soon)
            },
            "ai_coverage": framework_info["ai_coverage"],
            "audit_frequency": framework_info["audit_frequency"],
            "last_updated": datetime.now(timezone.utc).isoformat()
        }
    
    def configure_framework(
        self,
        db: Session,
        organization_id: str,
        framework: Framework,
        configuration: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update framework configuration"""
        try:
            # Get all agents for this framework
            agents = db.query(Agent).filter(
                and_(
                    Agent.organization_id == organization_id,
                    Agent.framework == framework
                )
            ).all()
            
            if not agents:
                raise VelocityException(f"Framework {framework.value} is not enabled")
            
            # Update agent configurations
            for agent in agents:
                if not agent.configuration:
                    agent.configuration = {}
                agent.configuration.update(configuration)
            
            # Update organization settings
            org = db.query(Organization).filter(Organization.id == organization_id).first()
            if org:
                if not org.settings:
                    org.settings = {}
                if "framework_configs" not in org.settings:
                    org.settings["framework_configs"] = {}
                org.settings["framework_configs"][framework.value] = configuration
            
            db.commit()
            
            logger.info(f"Updated configuration for {framework.value}")
            
            return {
                "framework": framework.value,
                "status": "configured",
                "configuration": configuration,
                "agents_updated": len(agents),
                "message": f"Successfully updated configuration for {framework.value}"
            }
            
        except Exception as e:
            logger.error(f"Error configuring framework: {e}")
            db.rollback()
            raise VelocityException(f"Failed to configure framework: {str(e)}")

# Global instance
framework_manager = FrameworkManager()