# ERIP Cross-Component Integration Engine
# Orchestrates data flows and integrations between all ERIP components

from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel
from datetime import datetime, timedelta
import asyncio
import json
from enum import Enum
import uuid
import structlog

# Import all component engines
from compass.regulatory_engine import RegulatoryIntelligenceEngine, ComplianceFramework
from atlas.security_engine import SecurityIntelligenceEngine, AssetType, SecurityFramework
from nexus.intelligence_engine import AdvancedIntelligenceEngine, ThreatCategory
from beacon.value_engine import ValueDemonstrationEngine, ROITimeframe

logger = structlog.get_logger()

class IntegrationEvent(str, Enum):
    COMPLIANCE_GAP_FOUND = "compliance_gap_found"
    SECURITY_FINDING_CREATED = "security_finding_created"
    THREAT_INTEL_UPDATED = "threat_intel_updated"
    ROI_CALCULATED = "roi_calculated"
    RISK_THRESHOLD_EXCEEDED = "risk_threshold_exceeded"
    AUDIT_DEADLINE_APPROACHING = "audit_deadline_approaching"

class DataFlow(BaseModel):
    flow_id: str
    source_component: str
    target_component: str
    data_type: str
    trigger_event: IntegrationEvent
    transformation_rules: List[str]
    created_at: datetime
    last_execution: Optional[datetime] = None
    execution_count: int = 0

class IntegrationResult(BaseModel):
    integration_id: str
    source_data: Dict[str, Any]
    enriched_data: Dict[str, Any]
    target_actions: List[str]
    execution_time: float
    success: bool
    error_message: Optional[str] = None

class ERIPIntegrationEngine:
    """Central integration engine for ERIP platform components"""
    
    def __init__(self):
        # Initialize all component engines
        self.compass_engine = RegulatoryIntelligenceEngine()
        self.atlas_engine = SecurityIntelligenceEngine()
        self.nexus_engine = AdvancedIntelligenceEngine()
        self.beacon_engine = ValueDemonstrationEngine()
        
        # Integration tracking
        self.data_flows = {}
        self.integration_history = {}
        
        # Configure default data flows
        self._setup_default_integrations()
    
    def _setup_default_integrations(self):
        """Setup default integration patterns between components"""
        
        # COMPASS → ATLAS: Regulatory requirements inform security assessments
        self.data_flows["compass_to_atlas"] = DataFlow(
            flow_id="compass_to_atlas",
            source_component="COMPASS",
            target_component="ATLAS",
            data_type="compliance_requirements",
            trigger_event=IntegrationEvent.COMPLIANCE_GAP_FOUND,
            transformation_rules=[
                "Map compliance controls to security controls",
                "Identify security assessment scope from compliance gaps",
                "Generate targeted security testing requirements"
            ],
            created_at=datetime.utcnow()
        )
        
        # ATLAS → COMPASS: Security findings inform compliance status
        self.data_flows["atlas_to_compass"] = DataFlow(
            flow_id="atlas_to_compass",
            source_component="ATLAS",
            target_component="COMPASS",
            data_type="security_findings",
            trigger_event=IntegrationEvent.SECURITY_FINDING_CREATED,
            transformation_rules=[
                "Map security findings to compliance controls",
                "Update compliance status based on security posture",
                "Generate compliance evidence from security assessments"
            ],
            created_at=datetime.utcnow()
        )
        
        # NEXUS → ATLAS: Threat intelligence updates security assessments
        self.data_flows["nexus_to_atlas"] = DataFlow(
            flow_id="nexus_to_atlas",
            source_component="NEXUS",
            target_component="ATLAS",
            data_type="threat_intelligence",
            trigger_event=IntegrationEvent.THREAT_INTEL_UPDATED,
            transformation_rules=[
                "Update security assessment scope based on new threats",
                "Prioritize security controls based on threat landscape",
                "Generate threat-specific security testing scenarios"
            ],
            created_at=datetime.utcnow()
        )
        
        # ATLAS → BEACON: Security improvements feed ROI calculations
        self.data_flows["atlas_to_beacon"] = DataFlow(
            flow_id="atlas_to_beacon",
            source_component="ATLAS",
            target_component="BEACON",
            data_type="security_metrics",
            trigger_event=IntegrationEvent.SECURITY_FINDING_CREATED,
            transformation_rules=[
                "Calculate financial impact of security improvements",
                "Track security posture changes over time",
                "Generate ROI metrics from security investments"
            ],
            created_at=datetime.utcnow()
        )
        
        # COMPASS → BEACON: Compliance improvements feed business value
        self.data_flows["compass_to_beacon"] = DataFlow(
            flow_id="compass_to_beacon",
            source_component="COMPASS",
            target_component="BEACON",
            data_type="compliance_metrics",
            trigger_event=IntegrationEvent.COMPLIANCE_GAP_FOUND,
            transformation_rules=[
                "Calculate compliance cost savings",
                "Track audit preparation efficiency gains",
                "Measure regulatory risk reduction value"
            ],
            created_at=datetime.utcnow()
        )
    
    async def execute_integration_flow(
        self,
        flow_id: str,
        source_data: Dict[str, Any],
        organization_id: str
    ) -> IntegrationResult:
        """Execute a specific integration flow between components"""
        
        start_time = datetime.utcnow()
        integration_id = str(uuid.uuid4())
        
        try:
            if flow_id not in self.data_flows:
                raise ValueError(f"Integration flow {flow_id} not found")
            
            flow = self.data_flows[flow_id]
            
            logger.info("Executing integration flow",
                       flow_id=flow_id,
                       source=flow.source_component,
                       target=flow.target_component)
            
            # Execute the integration based on flow type
            if flow_id == "compass_to_atlas":
                enriched_data = await self._compass_to_atlas_integration(source_data, organization_id)
            elif flow_id == "atlas_to_compass":
                enriched_data = await self._atlas_to_compass_integration(source_data, organization_id)
            elif flow_id == "nexus_to_atlas":
                enriched_data = await self._nexus_to_atlas_integration(source_data, organization_id)
            elif flow_id == "atlas_to_beacon":
                enriched_data = await self._atlas_to_beacon_integration(source_data, organization_id)
            elif flow_id == "compass_to_beacon":
                enriched_data = await self._compass_to_beacon_integration(source_data, organization_id)
            else:
                enriched_data = await self._generic_integration(source_data, flow)
            
            # Calculate execution time
            execution_time = (datetime.utcnow() - start_time).total_seconds()
            
            # Update flow statistics
            flow.last_execution = datetime.utcnow()
            flow.execution_count += 1
            
            result = IntegrationResult(
                integration_id=integration_id,
                source_data=source_data,
                enriched_data=enriched_data,
                target_actions=enriched_data.get("recommended_actions", []),
                execution_time=execution_time,
                success=True
            )
            
            # Cache the result
            self.integration_history[integration_id] = result
            
            logger.info("Integration flow completed successfully",
                       flow_id=flow_id,
                       integration_id=integration_id,
                       execution_time=execution_time)
            
            return result
            
        except Exception as e:
            execution_time = (datetime.utcnow() - start_time).total_seconds()
            
            result = IntegrationResult(
                integration_id=integration_id,
                source_data=source_data,
                enriched_data={},
                target_actions=[],
                execution_time=execution_time,
                success=False,
                error_message=str(e)
            )
            
            logger.error("Integration flow failed",
                        flow_id=flow_id,
                        integration_id=integration_id,
                        error=str(e))
            
            return result
    
    async def _compass_to_atlas_integration(
        self,
        compliance_data: Dict[str, Any],
        organization_id: str
    ) -> Dict[str, Any]:
        """Integrate COMPASS compliance data into ATLAS security assessments"""
        
        # Extract compliance gaps and requirements
        compliance_gaps = compliance_data.get("compliance_gaps", [])
        framework = compliance_data.get("framework", ComplianceFramework.ISO27001)
        
        # Map compliance controls to security assessment scope
        security_scope = []
        for gap in compliance_gaps:
            if "access" in gap.get("description", "").lower():
                security_scope.append(AssetType.ENDPOINTS)
            if "network" in gap.get("description", "").lower():
                security_scope.append(AssetType.NETWORK_DEVICES)
            if "data" in gap.get("description", "").lower():
                security_scope.append(AssetType.DATABASES)
            if "cloud" in gap.get("description", "").lower():
                security_scope.append(AssetType.CLOUD_INFRASTRUCTURE)
        
        # Generate targeted security assessment
        if security_scope:
            security_assessment = await self.atlas_engine.run_comprehensive_assessment(
                scope=list(set(security_scope)),  # Remove duplicates
                frameworks=[SecurityFramework.ISO27001],  # Map compliance framework
                cloud_configs={"aws": {}, "azure": {}, "gcp": {}},
                organization_id=organization_id,
                user_id="integration_engine"
            )
            
            return {
                "assessment_id": security_assessment.assessment_id,
                "findings_count": len(security_assessment.findings),
                "security_score": security_assessment.overall_score,
                "compliance_aligned": True,
                "recommended_actions": [
                    "Review security findings against compliance requirements",
                    "Prioritize remediation based on compliance deadlines",
                    "Generate compliance evidence from security controls"
                ],
                "integration_metadata": {
                    "source_compliance_gaps": len(compliance_gaps),
                    "mapped_security_scope": len(security_scope),
                    "compliance_framework": framework.value
                }
            }
        
        return {
            "message": "No security assessment scope identified from compliance data",
            "recommended_actions": ["Review compliance gaps for security implications"]
        }
    
    async def _atlas_to_compass_integration(
        self,
        security_data: Dict[str, Any],
        organization_id: str
    ) -> Dict[str, Any]:
        """Integrate ATLAS security findings into COMPASS compliance tracking"""
        
        # Extract security findings
        security_findings = security_data.get("findings", [])
        assessment_score = security_data.get("overall_score", 0)
        
        # Map security findings to compliance impact
        compliance_impact = []
        affected_frameworks = set()
        
        for finding in security_findings:
            # Map finding to compliance controls
            controls = finding.get("framework_controls", [])
            for control in controls:
                if "ISO 27001" in control:
                    affected_frameworks.add(ComplianceFramework.ISO27001)
                elif "SOC 2" in control:
                    affected_frameworks.add(ComplianceFramework.SOC2)
                elif "NIST" in control:
                    affected_frameworks.add(ComplianceFramework.NIST_CSF)
            
            compliance_impact.append({
                "finding_id": finding.get("finding_id"),
                "compliance_risk": finding.get("severity", "medium"),
                "affected_controls": controls,
                "remediation_impact": "Resolving this finding will improve compliance posture"
            })
        
        # Generate compliance evidence from security improvements
        evidence_items = []
        for framework in affected_frameworks:
            evidence = await self.compass_engine.generate_compliance_evidence(
                framework=framework,
                control_id="SECURITY_ASSESSMENT",
                implementation_data={
                    "security_score": assessment_score,
                    "findings_count": len(security_findings),
                    "assessment_date": datetime.utcnow().isoformat()
                }
            )
            evidence_items.append(evidence)
        
        return {
            "compliance_impact": compliance_impact,
            "affected_frameworks": [f.value for f in affected_frameworks],
            "evidence_generated": len(evidence_items),
            "security_score": assessment_score,
            "recommended_actions": [
                "Update compliance status based on security findings",
                "Generate remediation plan with compliance priorities",
                "Schedule compliance review of security improvements"
            ],
            "integration_metadata": {
                "source_findings": len(security_findings),
                "compliance_frameworks_affected": len(affected_frameworks),
                "evidence_items_created": len(evidence_items)
            }
        }
    
    async def _nexus_to_atlas_integration(
        self,
        threat_data: Dict[str, Any],
        organization_id: str
    ) -> Dict[str, Any]:
        """Integrate NEXUS threat intelligence into ATLAS security assessments"""
        
        # Extract threat intelligence
        threat_intel = threat_data.get("threat_intelligence", [])
        threat_categories = threat_data.get("categories", [])
        
        # Map threats to security assessment priorities
        assessment_priorities = []
        security_scope = set()
        
        for threat in threat_intel:
            category = threat.get("category", ThreatCategory.MALWARE)
            severity = threat.get("severity", "medium")
            
            # Map threat categories to asset types
            if category in [ThreatCategory.CLOUD_THREATS]:
                security_scope.add(AssetType.CLOUD_INFRASTRUCTURE)
            elif category in [ThreatCategory.MALWARE, ThreatCategory.RANSOMWARE]:
                security_scope.add(AssetType.ENDPOINTS)
            elif category in [ThreatCategory.APT]:
                security_scope.add(AssetType.NETWORK_DEVICES)
            elif category in [ThreatCategory.SUPPLY_CHAIN]:
                security_scope.add(AssetType.APPLICATIONS)
            
            assessment_priorities.append({
                "threat_id": threat.get("intel_id"),
                "priority": "high" if severity == "critical" else "medium",
                "assessment_focus": category.value,
                "indicators": threat.get("indicators", [])
            })
        
        # Generate threat-informed security assessment if high-priority threats exist
        high_priority_threats = [p for p in assessment_priorities if p["priority"] == "high"]
        
        assessment_data = {
            "threat_informed": True,
            "assessment_priorities": assessment_priorities,
            "security_scope": list(security_scope),
            "threat_count": len(threat_intel),
            "high_priority_threats": len(high_priority_threats),
            "recommended_actions": [
                "Conduct threat-informed security assessment",
                "Focus testing on threat-specific attack vectors",
                "Update security controls based on threat landscape",
                "Implement threat hunting for identified indicators"
            ],
            "integration_metadata": {
                "source_threats": len(threat_intel),
                "threat_categories": len(set(threat_categories)),
                "security_scope_identified": len(security_scope),
                "high_priority_assessments": len(high_priority_threats)
            }
        }
        
        return assessment_data
    
    async def _atlas_to_beacon_integration(
        self,
        security_data: Dict[str, Any],
        organization_id: str
    ) -> Dict[str, Any]:
        """Integrate ATLAS security metrics into BEACON ROI calculations"""
        
        # Extract security metrics
        security_score = security_data.get("overall_score", 0)
        findings_count = security_data.get("findings_count", 0)
        critical_findings = security_data.get("critical_findings", 0)
        
        # Create baseline and current data for ROI calculation
        baseline_data = {
            "security_score": max(1.0, security_score - 1.5),  # Simulate baseline
            "critical_vulnerabilities": critical_findings + 10,
            "incident_costs": 100000,
            "mttd_hours": 72
        }
        
        current_data = {
            "security_score": security_score,
            "critical_vulnerabilities": critical_findings,
            "incident_costs": max(25000, 100000 - (security_score * 10000)),
            "mttd_hours": max(12, 72 - (security_score * 6))
        }
        
        investment_data = {
            "security_tools": 50000,
            "assessment_costs": 25000,
            "remediation_costs": findings_count * 1000
        }
        
        # Calculate ROI metrics
        roi_metrics = await self.beacon_engine.calculate_roi_metrics(
            organization_id=organization_id,
            baseline_data=baseline_data,
            current_data=current_data,
            investment_data=investment_data,
            timeframe=ROITimeframe.ANNUALLY
        )
        
        total_value = sum(metric.financial_impact for metric in roi_metrics)
        
        return {
            "roi_calculated": True,
            "total_security_value": total_value,
            "metrics_count": len(roi_metrics),
            "security_score_impact": security_score,
            "recommended_actions": [
                "Include security improvements in business impact reporting",
                "Track security ROI metrics over time",
                "Present security value to executive leadership",
                "Use metrics to justify security investments"
            ],
            "integration_metadata": {
                "baseline_security_score": baseline_data["security_score"],
                "current_security_score": current_data["security_score"],
                "security_improvement": security_score - baseline_data["security_score"],
                "financial_impact": total_value
            }
        }
    
    async def _compass_to_beacon_integration(
        self,
        compliance_data: Dict[str, Any],
        organization_id: str
    ) -> Dict[str, Any]:
        """Integrate COMPASS compliance metrics into BEACON value calculations"""
        
        # Extract compliance metrics
        compliance_score = compliance_data.get("compliance_score", 0)
        gaps_resolved = compliance_data.get("gaps_resolved", 0)
        audit_prep_days = compliance_data.get("audit_prep_days", 30)
        
        # Calculate compliance value metrics
        baseline_data = {
            "compliance_score": max(50, compliance_score - 20),
            "compliance_costs": 200000,
            "audit_prep_days": audit_prep_days + 15
        }
        
        current_data = {
            "compliance_score": compliance_score,
            "compliance_costs": max(100000, 200000 - (gaps_resolved * 5000)),
            "audit_prep_days": audit_prep_days
        }
        
        investment_data = {
            "compliance_platform": 75000,
            "consulting_costs": 30000,
            "training_costs": 10000
        }
        
        # Calculate compliance ROI
        roi_metrics = await self.beacon_engine.calculate_roi_metrics(
            organization_id=organization_id,
            baseline_data=baseline_data,
            current_data=current_data,
            investment_data=investment_data,
            timeframe=ROITimeframe.ANNUALLY
        )
        
        compliance_value = sum(metric.financial_impact for metric in roi_metrics if metric.category.value == "compliance")
        
        return {
            "compliance_value_calculated": True,
            "total_compliance_value": compliance_value,
            "compliance_score": compliance_score,
            "gaps_resolved": gaps_resolved,
            "recommended_actions": [
                "Highlight compliance cost savings in business reports",
                "Track compliance efficiency improvements",
                "Demonstrate audit preparation time savings",
                "Quantify regulatory risk reduction value"
            ],
            "integration_metadata": {
                "baseline_compliance_score": baseline_data["compliance_score"],
                "current_compliance_score": current_data["compliance_score"],
                "compliance_improvement": compliance_score - baseline_data["compliance_score"],
                "cost_savings": compliance_value
            }
        }
    
    async def _generic_integration(
        self,
        source_data: Dict[str, Any],
        flow: DataFlow
    ) -> Dict[str, Any]:
        """Generic integration handler for custom flows"""
        
        return {
            "integration_type": "generic",
            "source_component": flow.source_component,
            "target_component": flow.target_component,
            "data_processed": True,
            "transformation_rules_applied": len(flow.transformation_rules),
            "recommended_actions": [
                f"Review {flow.source_component} data in {flow.target_component} context",
                "Apply custom transformation rules",
                "Validate integration results"
            ]
        }
    
    async def get_integration_status(self, organization_id: str) -> Dict[str, Any]:
        """Get overall integration status and health"""
        
        return {
            "organization_id": organization_id,
            "active_flows": len(self.data_flows),
            "total_executions": sum(flow.execution_count for flow in self.data_flows.values()),
            "recent_integrations": len([
                result for result in self.integration_history.values()
                if (datetime.utcnow() - datetime.fromisoformat(result.source_data.get("timestamp", "2025-01-01T00:00:00"))).days <= 7
            ]),
            "integration_health": "healthy",
            "flows": [
                {
                    "flow_id": flow.flow_id,
                    "source": flow.source_component,
                    "target": flow.target_component,
                    "executions": flow.execution_count,
                    "last_execution": flow.last_execution.isoformat() if flow.last_execution else None
                }
                for flow in self.data_flows.values()
            ]
        }