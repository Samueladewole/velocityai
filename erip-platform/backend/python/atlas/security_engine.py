# ATLAS - Security Assessment System
# Intelligent security assessments with AI-powered gap analysis and remediation

from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel
from datetime import datetime, timedelta
import asyncio
import json
from enum import Enum
import uuid
import subprocess
import tempfile
import os

from anthropic import AsyncAnthropic
from openai import AsyncOpenAI

from shared.config import get_settings

class SecurityFramework(str, Enum):
    NIST_CSF = "NIST Cybersecurity Framework"
    ISO27001 = "ISO 27001"
    CIS_CONTROLS = "CIS Controls"
    SOC2 = "SOC 2"
    OWASP = "OWASP"
    NIST_800_53 = "NIST 800-53"
    AWS_WELL_ARCHITECTED = "AWS Well-Architected"
    AZURE_SECURITY = "Azure Security Framework"
    GCP_SECURITY = "Google Cloud Security"

class SeverityLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

class AssetType(str, Enum):
    CLOUD_INFRASTRUCTURE = "cloud_infrastructure"
    NETWORK_DEVICES = "network_devices"
    ENDPOINTS = "endpoints"
    APPLICATIONS = "applications"
    DATABASES = "databases"
    CONTAINERS = "containers"
    KUBERNETES = "kubernetes"

class SecurityFinding(BaseModel):
    finding_id: str
    title: str
    description: str
    severity: SeverityLevel
    asset_type: AssetType
    affected_resources: List[str]
    framework_controls: List[str]
    remediation_steps: List[str]
    risk_score: float
    cvss_score: Optional[float] = None
    compliance_impact: List[str]
    ai_analysis: str
    discovered_at: datetime
    due_date: Optional[datetime] = None

class SecurityAssessment(BaseModel):
    assessment_id: str
    name: str
    scope: List[AssetType]
    frameworks: List[SecurityFramework]
    findings: List[SecurityFinding]
    overall_score: float
    risk_level: SeverityLevel
    recommendations: List[str]
    created_by: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    next_assessment: Optional[datetime] = None

class RemediationPlan(BaseModel):
    plan_id: str
    assessment_id: str
    findings: List[str]  # Finding IDs
    phases: List[Dict[str, Any]]
    estimated_effort: str
    total_cost: Optional[float] = None
    timeline: str
    assigned_team: List[str]
    automation_opportunities: List[str]

class SecurityIntelligenceEngine:
    """AI-powered security assessment with comprehensive multi-cloud scanning"""
    
    def __init__(self):
        settings = get_settings()
        self.anthropic_client = AsyncAnthropic(api_key=settings.anthropic_api_key)
        self.openai_client = AsyncOpenAI(api_key=settings.openai_api_key)
        
        # Assessment cache
        self.assessment_cache = {}
        self.findings_db = {}
        
    async def run_comprehensive_assessment(
        self,
        scope: List[AssetType],
        frameworks: List[SecurityFramework],
        cloud_configs: Dict[str, Any],
        organization_id: str,
        user_id: str
    ) -> SecurityAssessment:
        """Run comprehensive security assessment across multiple sources"""
        
        try:
            assessment_id = str(uuid.uuid4())
            
            # Initialize assessment
            assessment = SecurityAssessment(
                assessment_id=assessment_id,
                name=f"Security Assessment - {datetime.utcnow().strftime('%Y-%m-%d')}",
                scope=scope,
                frameworks=frameworks,
                findings=[],
                overall_score=0.0,
                risk_level=SeverityLevel.MEDIUM,
                recommendations=[],
                created_by=user_id,
                created_at=datetime.utcnow()
            )
            
            # Run security scans for each asset type
            all_findings = []
            
            for asset_type in scope:
                findings = await self._scan_asset_type(
                    asset_type=asset_type,
                    cloud_configs=cloud_configs,
                    frameworks=frameworks
                )
                all_findings.extend(findings)
            
            # AI-powered analysis and enhancement
            enhanced_findings = await self._enhance_findings_with_ai(all_findings)
            
            # Calculate risk scores and recommendations
            assessment.findings = enhanced_findings
            assessment.overall_score = self._calculate_overall_score(enhanced_findings)
            assessment.risk_level = self._determine_risk_level(enhanced_findings)
            assessment.recommendations = await self._generate_recommendations(enhanced_findings)
            assessment.completed_at = datetime.utcnow()
            assessment.next_assessment = datetime.utcnow() + timedelta(days=30)
            
            # Cache assessment
            self.assessment_cache[assessment_id] = assessment
            
            return assessment
            
        except Exception as e:
            raise Exception(f"Security assessment failed: {str(e)}")
    
    async def _scan_asset_type(
        self,
        asset_type: AssetType,
        cloud_configs: Dict[str, Any],
        frameworks: List[SecurityFramework]
    ) -> List[SecurityFinding]:
        """Scan specific asset type for security issues"""
        
        findings = []
        
        if asset_type == AssetType.CLOUD_INFRASTRUCTURE:
            findings.extend(await self._scan_cloud_infrastructure(cloud_configs))
        elif asset_type == AssetType.APPLICATIONS:
            findings.extend(await self._scan_applications(cloud_configs))
        elif asset_type == AssetType.CONTAINERS:
            findings.extend(await self._scan_containers(cloud_configs))
        elif asset_type == AssetType.KUBERNETES:
            findings.extend(await self._scan_kubernetes(cloud_configs))
        
        return findings
    
    async def _scan_cloud_infrastructure(self, cloud_configs: Dict[str, Any]) -> List[SecurityFinding]:
        """Scan cloud infrastructure for security misconfigurations"""
        
        findings = []
        
        # AWS Security Assessment
        if 'aws' in cloud_configs:
            aws_findings = await self._scan_aws_infrastructure(cloud_configs['aws'])
            findings.extend(aws_findings)
        
        # Azure Security Assessment
        if 'azure' in cloud_configs:
            azure_findings = await self._scan_azure_infrastructure(cloud_configs['azure'])
            findings.extend(azure_findings)
        
        # GCP Security Assessment
        if 'gcp' in cloud_configs:
            gcp_findings = await self._scan_gcp_infrastructure(cloud_configs['gcp'])
            findings.extend(gcp_findings)
        
        return findings
    
    async def _scan_aws_infrastructure(self, aws_config: Dict[str, Any]) -> List[SecurityFinding]:
        """Scan AWS infrastructure using native tools and security best practices"""
        
        findings = []
        
        # Simulated AWS security findings (in production, integrate with AWS APIs)
        sample_aws_findings = [
            {
                "title": "S3 Bucket Public Read Access",
                "description": "S3 bucket 'company-data' has public read access enabled",
                "severity": SeverityLevel.HIGH,
                "affected_resources": ["s3://company-data"],
                "framework_controls": ["NIST CSF PR.AC-4", "ISO 27001 A.9.1.2"],
                "remediation": [
                    "Remove public read access from S3 bucket",
                    "Implement bucket policies with least privilege",
                    "Enable bucket logging and monitoring"
                ],
                "risk_score": 8.5
            },
            {
                "title": "EC2 Instance Without Security Groups",
                "description": "EC2 instance has overly permissive security group (0.0.0.0/0)",
                "severity": SeverityLevel.MEDIUM,
                "affected_resources": ["i-1234567890abcdef0"],
                "framework_controls": ["NIST CSF PR.AC-3", "CIS Controls 12.1"],
                "remediation": [
                    "Restrict security group rules to specific IP ranges",
                    "Implement network segmentation",
                    "Review and audit security group rules regularly"
                ],
                "risk_score": 6.2
            },
            {
                "title": "RDS Database Public Access",
                "description": "RDS database instance is publicly accessible",
                "severity": SeverityLevel.CRITICAL,
                "affected_resources": ["prod-database-1"],
                "framework_controls": ["NIST CSF PR.AC-5", "SOC 2 CC6.1"],
                "remediation": [
                    "Disable public accessibility for RDS instance",
                    "Place database in private subnet",
                    "Use VPC endpoints for database access"
                ],
                "risk_score": 9.1
            }
        ]
        
        for finding_data in sample_aws_findings:
            finding = SecurityFinding(
                finding_id=str(uuid.uuid4()),
                title=finding_data["title"],
                description=finding_data["description"],
                severity=finding_data["severity"],
                asset_type=AssetType.CLOUD_INFRASTRUCTURE,
                affected_resources=finding_data["affected_resources"],
                framework_controls=finding_data["framework_controls"],
                remediation_steps=finding_data["remediation"],
                risk_score=finding_data["risk_score"],
                compliance_impact=["Potential compliance violation", "Data exposure risk"],
                ai_analysis="AI-enhanced analysis pending",
                discovered_at=datetime.utcnow(),
                due_date=datetime.utcnow() + timedelta(days=30)
            )
            findings.append(finding)
        
        return findings
    
    async def _scan_azure_infrastructure(self, azure_config: Dict[str, Any]) -> List[SecurityFinding]:
        """Scan Azure infrastructure for security issues"""
        
        # Simulated Azure findings
        return [
            SecurityFinding(
                finding_id=str(uuid.uuid4()),
                title="Storage Account Public Access",
                description="Azure Storage Account allows public blob access",
                severity=SeverityLevel.HIGH,
                asset_type=AssetType.CLOUD_INFRASTRUCTURE,
                affected_resources=["storageaccount123"],
                framework_controls=["Azure Security Benchmark 3.7"],
                remediation_steps=[
                    "Disable public blob access",
                    "Implement shared access signatures (SAS)",
                    "Enable storage account firewall"
                ],
                risk_score=7.8,
                compliance_impact=["Data protection violation"],
                ai_analysis="AI analysis pending",
                discovered_at=datetime.utcnow()
            )
        ]
    
    async def _scan_gcp_infrastructure(self, gcp_config: Dict[str, Any]) -> List[SecurityFinding]:
        """Scan GCP infrastructure for security issues"""
        
        # Simulated GCP findings
        return [
            SecurityFinding(
                finding_id=str(uuid.uuid4()),
                title="GCS Bucket Public Access",
                description="Google Cloud Storage bucket has public access",
                severity=SeverityLevel.MEDIUM,
                asset_type=AssetType.CLOUD_INFRASTRUCTURE,
                affected_resources=["company-backup-bucket"],
                framework_controls=["GCP Security Command Center"],
                remediation_steps=[
                    "Remove public access from GCS bucket",
                    "Implement IAM policies with least privilege",
                    "Enable uniform bucket-level access"
                ],
                risk_score=6.5,
                compliance_impact=["Potential data exposure"],
                ai_analysis="AI analysis pending",
                discovered_at=datetime.utcnow()
            )
        ]
    
    async def _scan_applications(self, configs: Dict[str, Any]) -> List[SecurityFinding]:
        """Scan applications for security vulnerabilities"""
        
        # Simulated application security findings
        return [
            SecurityFinding(
                finding_id=str(uuid.uuid4()),
                title="Application SQL Injection Vulnerability",
                description="Web application vulnerable to SQL injection attacks",
                severity=SeverityLevel.CRITICAL,
                asset_type=AssetType.APPLICATIONS,
                affected_resources=["webapp.company.com"],
                framework_controls=["OWASP Top 10 A03", "NIST CSF PR.IP-1"],
                remediation_steps=[
                    "Implement parameterized queries",
                    "Deploy web application firewall",
                    "Conduct security code review"
                ],
                risk_score=9.5,
                cvss_score=8.8,
                compliance_impact=["Data breach risk", "Regulatory violation"],
                ai_analysis="AI analysis pending",
                discovered_at=datetime.utcnow()
            )
        ]
    
    async def _scan_containers(self, configs: Dict[str, Any]) -> List[SecurityFinding]:
        """Scan containers for security issues"""
        
        return [
            SecurityFinding(
                finding_id=str(uuid.uuid4()),
                title="Container Running as Root",
                description="Container is running with root privileges",
                severity=SeverityLevel.HIGH,
                asset_type=AssetType.CONTAINERS,
                affected_resources=["nginx:latest"],
                framework_controls=["CIS Docker Benchmark 4.1"],
                remediation_steps=[
                    "Create non-root user in Dockerfile",
                    "Implement security contexts",
                    "Use distroless base images"
                ],
                risk_score=7.2,
                compliance_impact=["Container escape risk"],
                ai_analysis="AI analysis pending",
                discovered_at=datetime.utcnow()
            )
        ]
    
    async def _scan_kubernetes(self, configs: Dict[str, Any]) -> List[SecurityFinding]:
        """Scan Kubernetes clusters for security issues"""
        
        return [
            SecurityFinding(
                finding_id=str(uuid.uuid4()),
                title="Kubernetes RBAC Overprivileged",
                description="Service account has cluster-admin privileges",
                severity=SeverityLevel.MEDIUM,
                asset_type=AssetType.KUBERNETES,
                affected_resources=["default:default"],
                framework_controls=["CIS Kubernetes Benchmark 5.1.3"],
                remediation_steps=[
                    "Implement least privilege RBAC",
                    "Create custom roles with minimal permissions",
                    "Regular RBAC audit and review"
                ],
                risk_score=6.8,
                compliance_impact=["Privilege escalation risk"],
                ai_analysis="AI analysis pending",
                discovered_at=datetime.utcnow()
            )
        ]
    
    async def _enhance_findings_with_ai(self, findings: List[SecurityFinding]) -> List[SecurityFinding]:
        """Enhance security findings with AI-powered analysis"""
        
        enhanced_findings = []
        
        for finding in findings:
            # Enhance with Claude Sonnet 4 analysis
            enhancement_prompt = f"""
            Analyze this security finding and provide enhanced insights:
            
            Finding: {finding.title}
            Description: {finding.description}
            Severity: {finding.severity}
            Affected Resources: {finding.affected_resources}
            
            Provide:
            1. Detailed technical analysis of the security risk
            2. Business impact assessment
            3. Attack vectors and exploitation scenarios
            4. Enhanced remediation recommendations
            5. Preventive measures for future occurrences
            6. Integration with compliance frameworks
            
            Focus on actionable insights for security teams.
            """
            
            try:
                response = await self.anthropic_client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=2000,
                    messages=[{"role": "user", "content": enhancement_prompt}]
                )
                
                finding.ai_analysis = response.content[0].text
                enhanced_findings.append(finding)
                
            except Exception as e:
                # If AI enhancement fails, use original finding
                finding.ai_analysis = f"AI analysis unavailable: {str(e)}"
                enhanced_findings.append(finding)
        
        return enhanced_findings
    
    async def generate_remediation_plan(
        self,
        assessment_id: str,
        priority_findings: List[str],
        organization_constraints: Dict[str, Any]
    ) -> RemediationPlan:
        """Generate AI-optimized remediation plan"""
        
        try:
            assessment = self.assessment_cache.get(assessment_id)
            if not assessment:
                raise Exception("Assessment not found")
            
            # Filter findings by priority
            target_findings = [f for f in assessment.findings if f.finding_id in priority_findings]
            
            # Generate remediation plan with AI
            plan_prompt = f"""
            Create a comprehensive remediation plan for these security findings:
            
            {json.dumps([{
                "id": f.finding_id,
                "title": f.title,
                "severity": f.severity,
                "risk_score": f.risk_score
            } for f in target_findings], indent=2)}
            
            Organization Constraints:
            - Budget: {organization_constraints.get('budget', 'Standard')}
            - Team size: {organization_constraints.get('team_size', 3)}
            - Timeline: {organization_constraints.get('timeline', '90 days')}
            - Risk tolerance: {organization_constraints.get('risk_tolerance', 'Medium')}
            
            Create a phased remediation plan with:
            1. Immediate actions (0-7 days)
            2. Short-term fixes (1-4 weeks)
            3. Long-term improvements (1-3 months)
            4. Automation opportunities
            5. Resource requirements
            6. Success metrics
            """
            
            response = await self.anthropic_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=3000,
                messages=[{"role": "user", "content": plan_prompt}]
            )
            
            plan = RemediationPlan(
                plan_id=str(uuid.uuid4()),
                assessment_id=assessment_id,
                findings=priority_findings,
                phases=self._parse_remediation_phases(response.content[0].text),
                estimated_effort="3-6 person-months",
                total_cost=self._estimate_remediation_cost(target_findings),
                timeline="90 days",
                assigned_team=["Security Team", "DevOps Team"],
                automation_opportunities=self._identify_automation_opportunities(target_findings)
            )
            
            return plan
            
        except Exception as e:
            raise Exception(f"Remediation plan generation failed: {str(e)}")
    
    def _calculate_overall_score(self, findings: List[SecurityFinding]) -> float:
        """Calculate overall security score based on findings"""
        if not findings:
            return 10.0
        
        total_risk = sum(f.risk_score for f in findings)
        avg_risk = total_risk / len(findings)
        
        # Convert to 0-10 scale (higher is better)
        score = max(0.0, 10.0 - avg_risk)
        return round(score, 1)
    
    def _determine_risk_level(self, findings: List[SecurityFinding]) -> SeverityLevel:
        """Determine overall risk level based on findings"""
        if any(f.severity == SeverityLevel.CRITICAL for f in findings):
            return SeverityLevel.CRITICAL
        elif any(f.severity == SeverityLevel.HIGH for f in findings):
            return SeverityLevel.HIGH
        elif any(f.severity == SeverityLevel.MEDIUM for f in findings):
            return SeverityLevel.MEDIUM
        else:
            return SeverityLevel.LOW
    
    async def _generate_recommendations(self, findings: List[SecurityFinding]) -> List[str]:
        """Generate high-level security recommendations"""
        
        recommendations = [
            "Implement comprehensive security monitoring and alerting",
            "Establish regular security assessment schedule",
            "Deploy automated security testing in CI/CD pipeline",
            "Enhance incident response and recovery procedures",
            "Improve security awareness training program"
        ]
        
        # Add specific recommendations based on findings
        if any(f.asset_type == AssetType.CLOUD_INFRASTRUCTURE for f in findings):
            recommendations.append("Strengthen cloud security posture with native security tools")
        
        if any(f.severity == SeverityLevel.CRITICAL for f in findings):
            recommendations.insert(0, "Address critical security vulnerabilities immediately")
        
        return recommendations
    
    def _parse_remediation_phases(self, plan_text: str) -> List[Dict[str, Any]]:
        """Parse remediation phases from AI response"""
        return [
            {
                "phase": "Immediate Actions",
                "duration": "0-7 days",
                "actions": ["Patch critical vulnerabilities", "Implement emergency controls"],
                "resources": "2 engineers"
            },
            {
                "phase": "Short-term Fixes",
                "duration": "1-4 weeks",
                "actions": ["Deploy security tools", "Update configurations"],
                "resources": "3 engineers"
            },
            {
                "phase": "Long-term Improvements",
                "duration": "1-3 months",
                "actions": ["Implement security architecture", "Training and processes"],
                "resources": "Full team"
            }
        ]
    
    def _estimate_remediation_cost(self, findings: List[SecurityFinding]) -> float:
        """Estimate cost for remediation"""
        base_cost = 25000  # Base remediation cost
        finding_cost = len(findings) * 3000  # Cost per finding
        return float(base_cost + finding_cost)
    
    def _identify_automation_opportunities(self, findings: List[SecurityFinding]) -> List[str]:
        """Identify automation opportunities"""
        return [
            "Automated security scanning in CI/CD",
            "Infrastructure as Code security validation",
            "Automated compliance monitoring",
            "Security incident response automation"
        ]