"""
Velocity Demo Backend - Simplified version for customer demonstrations
Provides essential API endpoints without complex dependencies
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any
from datetime import datetime, timedelta
import asyncio
import random
import uuid

# Initialize FastAPI app
app = FastAPI(
    title="Velocity Demo Backend",
    description="AI-Powered Compliance Automation Platform - Demo API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================================
# DATA MODELS
# ===================================


class SecurityFinding(BaseModel):
    finding_id: str
    title: str
    description: str
    severity: str
    affected_resources: List[str]
    risk_score: float
    remediation_steps: List[str]
    discovered_at: datetime


class RiskAnalysis(BaseModel):
    analysis_id: str
    risk_type: str
    probability: float
    impact: float
    risk_score: float
    mitigation_cost: float
    business_impact: str


class FinancialMetric(BaseModel):
    metric_id: str
    metric_name: str
    value: float
    currency: str
    timestamp: datetime
    trend: str

# ===================================
# DEMO DATA GENERATORS
# ===================================


def generate_security_findings(count: int = 5) -> List[SecurityFinding]:
    """Generate realistic security findings for demos"""
    findings_data = [
        {
            "title": "S3 Bucket Public Read Access",
            "description": (
                "Production S3 bucket 'company-data-prod' has public read "
                "access enabled, exposing sensitive customer data"
            ),
            "severity": "CRITICAL",
            "affected_resources": [
                "s3://company-data-prod", "s3://backup-bucket-2025"
            ],
            "risk_score": 9.2,
            "remediation_steps": [
                "Remove public read access from S3 bucket immediately",
                "Implement bucket policies with least privilege access",
                "Enable CloudTrail logging for bucket access monitoring",
                "Review and audit all existing S3 bucket permissions"
            ]
        },
        {
            "title": "RDS Database Public Access",
            "description": (
                "Production PostgreSQL database instance is publicly "
                "accessible from the internet"
            ),
            "severity": "CRITICAL",
            "affected_resources": ["rds-prod-postgres-01"],
            "risk_score": 9.5,
            "remediation_steps": [
                "Disable public accessibility for RDS instance",
                "Move database to private subnet with VPC endpoints",
                "Implement database firewall rules",
                "Enable encryption at rest and in transit"
            ]
        },
        {
            "title": "EC2 Instance Overprivileged IAM Role",
            "description": (
                "EC2 instances running with overly permissive IAM roles "
                "including admin access"
            ),
            "severity": "HIGH",
            "affected_resources": [
                "i-0123456789abcdef0", "i-0987654321fedcba0"
            ],
            "risk_score": 7.8,
            "remediation_steps": [
                "Review and reduce IAM role permissions to minimum required",
                "Implement principle of least privilege",
                "Use AWS IAM Access Analyzer to identify unused permissions",
                "Regular audit of EC2 instance IAM roles"
            ]
        },
        {
            "title": "Unencrypted EBS Volumes",
            "description": (
                "Multiple EBS volumes containing sensitive data are not "
                "encrypted"
            ),
            "severity": "MEDIUM",
            "affected_resources": [
                "vol-0123456789abcdef0", "vol-0987654321fedcba0"
            ],
            "risk_score": 6.5,
            "remediation_steps": [
                "Enable encryption for all new EBS volumes",
                "Migrate data from unencrypted to encrypted volumes",
                "Implement encryption by default policy",
                "Regular compliance scanning for encryption status"
            ]
        },
        {
            "title": "Security Group with Wide Open Rules",
            "description": (
                "Security group allows SSH access from 0.0.0.0/0 "
                "(anywhere on the internet)"
            ),
            "severity": "HIGH",
            "affected_resources": ["sg-0123456789abcdef0"],
            "risk_score": 8.1,
            "remediation_steps": [
                "Restrict SSH access to specific IP ranges or VPN",
                "Implement bastion host for secure access",
                "Regular review of security group rules",
                "Use AWS Systems Manager Session Manager instead of direct SSH"
            ]
        }
    ]

    results = []
    for i in range(min(count, len(findings_data))):
        finding_data = findings_data[i]
        results.append(SecurityFinding(
            finding_id=str(uuid.uuid4()),
            title=finding_data["title"],
            description=finding_data["description"],
            severity=finding_data["severity"],
            affected_resources=finding_data["affected_resources"],
            risk_score=finding_data["risk_score"],
            remediation_steps=finding_data["remediation_steps"],
            discovered_at=(
                datetime.utcnow() - timedelta(hours=random.randint(1, 72))
            )
        ))

    return results


def generate_risk_analysis(count: int = 3) -> List[RiskAnalysis]:
    """Generate risk analysis data for demos"""
    risk_scenarios = [
        {
            "risk_type": "Data Breach via S3 Misconfiguration",
            "probability": 0.15,
            "impact": 8.5,
            "mitigation_cost": 125000,
            "business_impact": (
                "Potential €2.3M in regulatory fines, customer churn, "
                "and reputation damage"
            )
        },
        {
            "risk_type": "Ransomware Attack on Unpatched Systems",
            "probability": 0.08,
            "impact": 9.2,
            "mitigation_cost": 85000,
            "business_impact": (
                "Estimated €4.1M in downtime, data recovery, and ransom "
                "payments"
            )
        },
        {
            "risk_type": "Insider Threat - Privileged User Abuse",
            "probability": 0.05,
            "impact": 7.8,
            "mitigation_cost": 65000,
            "business_impact": (
                "Potential €1.8M in IP theft and competitive intelligence "
                "loss"
            )
        }
    ]

    results = []
    for i in range(min(count, len(risk_scenarios))):
        scenario = risk_scenarios[i]
        risk_score = scenario["probability"] * scenario["impact"]
        results.append(RiskAnalysis(
            analysis_id=str(uuid.uuid4()),
            risk_type=scenario["risk_type"],
            probability=scenario["probability"],
            impact=scenario["impact"],
            risk_score=round(risk_score, 2),
            mitigation_cost=scenario["mitigation_cost"],
            business_impact=scenario["business_impact"]
        ))

    return results


def generate_financial_metrics() -> List[FinancialMetric]:
    """Generate financial metrics for demos"""
    metrics = [
        {
            "name": "Total Risk Exposure",
            "value": 7.2,
            "currency": "M_USD",
            "trend": "decreasing"
        },
        {
            "name": "Security Investment ROI",
            "value": 245.0,
            "currency": "PERCENT",
            "trend": "increasing"
        },
        {
            "name": "Compliance Cost Savings",
            "value": 1.8,
            "currency": "M_USD",
            "trend": "increasing"
        },
        {
            "name": "Mean Time to Remediation",
            "value": 4.2,
            "currency": "DAYS",
            "trend": "decreasing"
        },
        {
            "name": "Security Score",
            "value": 8.7,
            "currency": "SCORE",
            "trend": "increasing"
        },
    ]

    results = []
    for metric in metrics:
        results.append(FinancialMetric(
            metric_id=str(uuid.uuid4()),
            metric_name=metric["name"],
            value=metric["value"],
            currency=metric["currency"],
            timestamp=datetime.utcnow(),
            trend=metric["trend"]
        ))

    return results

# ===================================
# ATLAS - SECURITY ASSESSMENT APIS
# ===================================


@app.get("/atlas/health")
async def atlas_health():
    """Health check for ATLAS security engine"""
    return {
        "status": "healthy",
        "component": "ATLAS Security Engine",
        "version": "1.6.0"
    }


@app.post("/atlas/security-assessment")
async def run_security_assessment(assessment_request: Dict[str, Any]):
    """Run comprehensive security assessment"""
    # Simulate assessment processing time
    await asyncio.sleep(2)

    findings = generate_security_findings(5)

    overall_score = 10.0 - (
        sum(f.risk_score for f in findings) / len(findings)
    )

    return {
        "assessment_id": str(uuid.uuid4()),
        "status": "completed",
        "overall_score": round(max(0, overall_score), 1),
        "findings_count": len(findings),
        "critical_findings": len(
            [f for f in findings if f.severity == "CRITICAL"]
        ),
        "high_findings": len([f for f in findings if f.severity == "HIGH"]),
        "findings": [f.dict() for f in findings],
        "recommendations": [
            "Implement immediate remediation for critical vulnerabilities",
            "Establish regular security scanning schedule",
            "Deploy automated security monitoring",
            "Enhance cloud security posture management"
        ],
        "completed_at": datetime.utcnow().isoformat()
    }


@app.get("/atlas/cloud-resources")
async def list_cloud_resources():
    """List cloud resources for scanning"""
    return {
        "aws_resources": {
            "s3_buckets": 23,
            "ec2_instances": 15,
            "rds_instances": 4,
            "iam_roles": 67
        },
        "azure_resources": {
            "storage_accounts": 8,
            "virtual_machines": 12,
            "databases": 3
        },
        "gcp_resources": {
            "storage_buckets": 5,
            "compute_instances": 7,
            "databases": 2
        },
        "total_resources": 146
    }

# ===================================
# PRISM - RISK QUANTIFICATION APIS
# ===================================


@app.get("/prism/health")
async def prism_health():
    """Health check for PRISM risk engine"""
    return {
        "status": "healthy",
        "component": "PRISM Risk Quantification",
        "version": "1.6.0"
    }


@app.post("/prism/monte-carlo-analysis")
async def run_monte_carlo_analysis(analysis_request: Dict[str, Any]):
    """Run Monte Carlo risk analysis"""
    # Simulate processing time
    await asyncio.sleep(3)

    risk_analyses = generate_risk_analysis(3)

    # Simulate Monte Carlo results
    iterations = analysis_request.get("iterations", 50000)
    confidence_levels = [0.95, 0.99]

    var_results = {}
    for confidence in confidence_levels:
        # Simulate VaR calculation
        base_var = sum(
            r.risk_score * r.mitigation_cost for r in risk_analyses
        ) / 1000000
        var_results[f"var_{int(confidence*100)}"] = round(
            base_var * confidence, 2
        )

    return {
        "analysis_id": str(uuid.uuid4()),
        "iterations": iterations,
        "risk_scenarios": [r.dict() for r in risk_analyses],
        "var_results": var_results,
        "expected_loss": round(
            sum(r.probability * r.mitigation_cost for r in risk_analyses), 0
        ),
        "total_risk_exposure": round(
            sum(r.risk_score * r.mitigation_cost for r in risk_analyses)
            / 1000000, 2
        ),
        "recommendations": [
            "Prioritize high-impact, high-probability scenarios",
            "Implement layered security controls",
            "Establish incident response procedures",
            "Regular risk assessment updates"
        ],
        "completed_at": datetime.utcnow().isoformat()
    }


@app.get("/prism/portfolio-analysis")
async def get_portfolio_analysis():
    """Get portfolio risk analysis"""
    return {
        "portfolio_id": str(uuid.uuid4()),
        "total_value": 50000000,
        "currency": "USD",
        "risk_metrics": {
            "var_95": 2100000,
            "var_99": 3500000,
            "expected_shortfall": 4200000,
            "sharpe_ratio": 1.47,
            "max_drawdown": 0.18
        },
        "sector_exposure": {
            "technology": 0.35,
            "financial": 0.25,
            "healthcare": 0.20,
            "industrial": 0.15,
            "other": 0.05
        },
        "last_updated": datetime.utcnow().isoformat()
    }

# ===================================
# FINANCIAL INTELLIGENCE APIS
# ===================================


@app.get("/financial-intelligence/health")
async def financial_intelligence_health():
    """Health check for Financial Intelligence engine"""
    return {
        "status": "healthy",
        "component": "Financial Intelligence Platform",
        "version": "1.6.0"
    }


@app.get("/financial-intelligence/metrics")
async def get_financial_metrics():
    """Get real-time financial metrics"""
    metrics = generate_financial_metrics()

    return {
        "metrics": [m.dict() for m in metrics],
        "summary": {
            "total_risk_exposure": "7.2M USD",
            "investment_roi": "245%",
            "cost_savings": "1.8M USD",
            "security_score": "8.7/10"
        },
        "trend_analysis": {
            "risk_trend": "Decreasing (↓ 15% this month)",
            "roi_trend": "Increasing (↑ 23% this quarter)",
            "compliance_trend": "Stable (98% compliance rate)"
        },
        "last_updated": datetime.utcnow().isoformat()
    }


@app.post("/financial-intelligence/roi-calculation")
async def calculate_roi(roi_request: Dict[str, Any]):
    """Calculate ROI for security investments"""
    investment = roi_request.get("investment_amount", 500000)

    # Simulate comprehensive ROI calculation
    await asyncio.sleep(1.5)

    annual_savings = investment * 2.45  # 245% ROI
    payback_period = investment / (annual_savings / 12)  # Months

    return {
        "calculation_id": str(uuid.uuid4()),
        "investment_amount": investment,
        "annual_savings": round(annual_savings, 0),
        "roi_percentage": 245.0,
        "payback_period_months": round(payback_period, 1),
        "npv_5_years": round(annual_savings * 5 - investment, 0),
        "irr": 0.28,
        "risk_adjusted_return": "22.3%",
        "confidence_interval": "95%",
        "breakdown": {
            "breach_prevention_savings": round(annual_savings * 0.6, 0),
            "compliance_cost_reduction": round(annual_savings * 0.25, 0),
            "operational_efficiency": round(annual_savings * 0.15, 0)
        },
        "calculated_at": datetime.utcnow().isoformat()
    }

# ===================================
# COMPASS - REGULATORY INTELLIGENCE
# ===================================


@app.get("/compass/health")
async def compass_health():
    """Health check for COMPASS regulatory engine"""
    return {
        "status": "healthy",
        "component": "COMPASS Regulatory Intelligence",
        "version": "1.6.0"
    }


@app.get("/compass/frameworks")
async def get_regulatory_frameworks():
    """Get available regulatory frameworks"""
    return {
        "frameworks": [
            {
                "id": "gdpr",
                "name": "General Data Protection Regulation (GDPR)",
                "region": "EU",
                "compliance_status": "98%",
                "last_assessment": "2025-01-20",
                "critical_gaps": 2
            },
            {
                "id": "nist_csf",
                "name": "NIST Cybersecurity Framework",
                "region": "US",
                "compliance_status": "92%",
                "last_assessment": "2025-01-18",
                "critical_gaps": 3
            },
            {
                "id": "iso27001",
                "name": "ISO 27001 Information Security",
                "region": "Global",
                "compliance_status": "87%",
                "last_assessment": "2025-01-15",
                "critical_gaps": 5
            },
            {
                "id": "sox",
                "name": "Sarbanes-Oxley Act",
                "region": "US",
                "compliance_status": "95%",
                "last_assessment": "2025-01-22",
                "critical_gaps": 1
            }
        ],
        "overall_compliance": "93%",
        "trending": "improving"
    }


@app.post("/compass/compliance-assessment")
async def run_compliance_assessment(assessment_request: Dict[str, Any]):
    """Run AI-powered compliance assessment"""
    framework = assessment_request.get("framework", "gdpr")

    # Simulate AI processing time
    await asyncio.sleep(2.5)

    gaps = [
        {
            "control_id": "A.12.1.2",
            "title": "Change Management Procedure",
            "description": (
                "Formal change management procedures are not fully "
                "documented for all system modifications"
            ),
            "severity": "Medium",
            "framework_section": "Operations Security",
            "remediation_effort": "2-3 weeks",
            "business_impact": "€50K potential audit findings"
        },
        {
            "control_id": "A.9.2.3",
            "title": "Management of Privileged Access Rights",
            "description": (
                "Privileged access is not regularly reviewed and some "
                "accounts have excessive permissions"
            ),
            "severity": "High",
            "framework_section": "Access Control",
            "remediation_effort": "4-6 weeks",
            "business_impact": "€200K potential security incident"
        }
    ]

    return {
        "assessment_id": str(uuid.uuid4()),
        "framework": framework.upper(),
        "compliance_score": 94.5,
        "total_controls": 114,
        "compliant_controls": 108,
        "gap_count": len(gaps),
        "gaps": gaps,
        "recommendations": [
            "Implement automated privilege access review process",
            "Establish formal change management documentation",
            "Deploy continuous compliance monitoring tools",
            "Schedule quarterly compliance assessments"
        ],
        "next_assessment_due": (
            datetime.utcnow() + timedelta(days=90)
        ).isoformat(),
        "completed_at": datetime.utcnow().isoformat()
    }

# ===================================
# INTEGRATION AND GENERAL APIS
# ===================================


@app.get("/health")
async def overall_health():
    """Overall platform health check"""
    return {
        "status": "healthy",
        "platform": "ERIP - Enterprise Risk Intelligence Platform",
        "version": "1.6.0",
        "components": {
            "atlas": "healthy",
            "prism": "healthy",
            "financial_intelligence": "healthy",
            "compass": "healthy"
        },
        "uptime": "99.97%",
        "last_check": datetime.utcnow().isoformat()
    }


@app.get("/demo/dashboard-summary")
async def get_dashboard_summary():
    """Get comprehensive dashboard summary for demos"""
    return {
        "security_posture": {
            "overall_score": 8.7,
            "critical_findings": 2,
            "high_findings": 3,
            "trend": "improving"
        },
        "risk_metrics": {
            "total_exposure": "7.2M USD",
            "var_95": "2.1M USD",
            "expected_loss": "850K USD",
            "risk_appetite": "within limits"
        },
        "financial_performance": {
            "security_roi": "245%",
            "cost_savings": "1.8M USD",
            "payback_period": "4.2 months",
            "trend": "exceeding targets"
        },
        "compliance_status": {
            "overall_compliance": "93%",
            "gdpr_compliance": "98%",
            "nist_compliance": "92%",
            "critical_gaps": 8
        },
        "recent_activities": [
            "Security assessment completed - 5 findings identified",
            "Monte Carlo analysis updated - VaR decreased 12%",
            "GDPR compliance review passed - 98% compliant",
            "Financial ROI calculation - 245% return validated"
        ],
        "generated_at": datetime.utcnow().isoformat()
    }

# ===================================
# STARTUP CONFIGURATION
# ===================================

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting ERIP Demo Backend...")
    print("📊 Available endpoints:")
    print("   • http://localhost:8001/health - Platform health")
    print("   • http://localhost:8001/atlas/* - Security assessment APIs")
    print("   • http://localhost:8001/prism/* - Risk quantification APIs")
    print(
        "   • http://localhost:8001/financial-intelligence/* - "
        "Financial metrics APIs"
    )
    print("   • http://localhost:8001/compass/* - Regulatory compliance APIs")
    print("   • http://localhost:8001/docs - Interactive API documentation")
    print("")

    uvicorn.run(
        "demo_main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )

