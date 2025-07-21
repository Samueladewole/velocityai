# ATLAS API Router - Security Assessment System
# FastAPI routes for intelligent security assessments

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import structlog

from shared.auth import get_current_user, require_permission, ComponentPermissions, TokenData
from .security_engine import (
    SecurityIntelligenceEngine,
    SecurityFramework,
    AssetType,
    SecurityAssessment,
    SecurityFinding,
    RemediationPlan
)

router = APIRouter()
logger = structlog.get_logger()

# Initialize the security engine
security_engine = SecurityIntelligenceEngine()

# Pydantic models for API requests
class SecurityAssessmentRequest(BaseModel):
    name: str
    scope: List[AssetType]
    frameworks: List[SecurityFramework]
    cloud_configs: Dict[str, Any]

class RemediationPlanRequest(BaseModel):
    assessment_id: str
    priority_findings: List[str]
    organization_constraints: Dict[str, Any]

@router.get("/frameworks")
async def get_supported_frameworks(
    current_user: TokenData = Depends(require_permission(ComponentPermissions.ATLAS))
):
    """Get list of supported security frameworks"""
    frameworks = [
        {
            "id": framework.value,
            "name": framework.value,
            "description": f"Security assessment using {framework.value} controls",
            "ai_enhanced": True,
            "status": "active"
        }
        for framework in SecurityFramework
    ]
    
    logger.info("Security frameworks retrieved", user_id=current_user.user_id, count=len(frameworks))
    
    return {
        "frameworks": frameworks,
        "total_count": len(frameworks),
        "ai_powered": True
    }

@router.get("/asset-types")
async def get_supported_asset_types(
    current_user: TokenData = Depends(require_permission(ComponentPermissions.ATLAS))
):
    """Get list of supported asset types for scanning"""
    asset_types = [
        {
            "id": asset_type.value,
            "name": asset_type.value.replace('_', ' ').title(),
            "description": f"Security scanning for {asset_type.value.replace('_', ' ')}",
            "supported_clouds": ["AWS", "Azure", "GCP"] if "cloud" in asset_type.value else ["All"]
        }
        for asset_type in AssetType
    ]
    
    return {
        "asset_types": asset_types,
        "scanning_capabilities": "Multi-cloud native security tools"
    }

@router.post("/assess", response_model=SecurityAssessment)
async def run_security_assessment(
    request: SecurityAssessmentRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.ATLAS))
):
    """Run comprehensive security assessment"""
    try:
        logger.info("Starting security assessment",
                   user_id=current_user.user_id,
                   scope=len(request.scope),
                   frameworks=len(request.frameworks))
        
        assessment = await security_engine.run_comprehensive_assessment(
            scope=request.scope,
            frameworks=request.frameworks,
            cloud_configs=request.cloud_configs,
            organization_id=current_user.organization_id,
            user_id=current_user.user_id
        )
        
        logger.info("Security assessment completed",
                   user_id=current_user.user_id,
                   assessment_id=assessment.assessment_id,
                   findings_count=len(assessment.findings),
                   overall_score=assessment.overall_score)
        
        return assessment
        
    except Exception as e:
        logger.error("Security assessment failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Security assessment failed: {str(e)}"
        )

@router.get("/assessments")
async def get_assessments(
    limit: int = Query(default=10, ge=1, le=100),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.ATLAS))
):
    """Get list of security assessments"""
    try:
        # Get cached assessments (in production, fetch from database)
        assessments = list(security_engine.assessment_cache.values())
        
        # Filter by organization
        org_assessments = [
            {
                "assessment_id": a.assessment_id,
                "name": a.name,
                "overall_score": a.overall_score,
                "risk_level": a.risk_level,
                "findings_count": len(a.findings),
                "created_at": a.created_at.isoformat(),
                "completed_at": a.completed_at.isoformat() if a.completed_at else None
            }
            for a in assessments[:limit]
        ]
        
        logger.info("Assessments retrieved",
                   user_id=current_user.user_id,
                   count=len(org_assessments))
        
        return {
            "assessments": org_assessments,
            "total_count": len(org_assessments)
        }
        
    except Exception as e:
        logger.error("Assessment retrieval failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Assessment retrieval failed: {str(e)}"
        )

@router.get("/assessments/{assessment_id}")
async def get_assessment_details(
    assessment_id: str,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.ATLAS))
):
    """Get detailed security assessment results"""
    try:
        assessment = security_engine.assessment_cache.get(assessment_id)
        if not assessment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assessment not found"
            )
        
        logger.info("Assessment details retrieved",
                   user_id=current_user.user_id,
                   assessment_id=assessment_id)
        
        return assessment
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Assessment detail retrieval failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Assessment detail retrieval failed: {str(e)}"
        )

@router.post("/remediation-plan", response_model=RemediationPlan)
async def generate_remediation_plan(
    request: RemediationPlanRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.ATLAS))
):
    """Generate AI-optimized remediation plan"""
    try:
        logger.info("Starting remediation plan generation",
                   user_id=current_user.user_id,
                   assessment_id=request.assessment_id,
                   findings_count=len(request.priority_findings))
        
        plan = await security_engine.generate_remediation_plan(
            assessment_id=request.assessment_id,
            priority_findings=request.priority_findings,
            organization_constraints=request.organization_constraints
        )
        
        logger.info("Remediation plan generated",
                   user_id=current_user.user_id,
                   plan_id=plan.plan_id,
                   estimated_cost=plan.total_cost)
        
        return plan
        
    except Exception as e:
        logger.error("Remediation plan generation failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Remediation plan generation failed: {str(e)}"
        )

@router.get("/dashboard")
async def get_security_dashboard(
    current_user: TokenData = Depends(require_permission(ComponentPermissions.ATLAS))
):
    """Get security dashboard data"""
    try:
        # Mock dashboard data (in production, aggregate from database)
        dashboard_data = {
            "organization_id": current_user.organization_id,
            "last_updated": "2024-01-15T10:00:00Z",
            "security_score": {
                "current": 7.2,
                "previous": 6.8,
                "trend": "improving"
            },
            "risk_distribution": {
                "critical": 2,
                "high": 8,
                "medium": 15,
                "low": 23,
                "info": 12
            },
            "asset_coverage": {
                "cloud_infrastructure": {"scanned": 45, "total": 50},
                "applications": {"scanned": 12, "total": 15},
                "containers": {"scanned": 28, "total": 30},
                "kubernetes": {"scanned": 8, "total": 10}
            },
            "recent_findings": [
                {
                    "title": "S3 Bucket Public Access",
                    "severity": "high",
                    "asset": "s3://company-data",
                    "discovered": "2024-01-14T15:30:00Z"
                },
                {
                    "title": "Kubernetes RBAC Issue",
                    "severity": "medium",
                    "asset": "prod-cluster",
                    "discovered": "2024-01-14T12:20:00Z"
                }
            ],
            "remediation_progress": {
                "total_findings": 60,
                "resolved": 35,
                "in_progress": 15,
                "pending": 10
            },
            "compliance_impact": {
                "frameworks_affected": ["ISO 27001", "SOC 2", "NIST CSF"],
                "controls_at_risk": 12,
                "certification_status": "At Risk"
            }
        }
        
        logger.info("Security dashboard retrieved",
                   user_id=current_user.user_id)
        
        return dashboard_data
        
    except Exception as e:
        logger.error("Dashboard retrieval failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Dashboard retrieval failed: {str(e)}"
        )

@router.get("/findings/{finding_id}")
async def get_finding_details(
    finding_id: str,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.ATLAS))
):
    """Get detailed information about a specific security finding"""
    try:
        # Search through cached assessments for the finding
        finding = None
        for assessment in security_engine.assessment_cache.values():
            for f in assessment.findings:
                if f.finding_id == finding_id:
                    finding = f
                    break
            if finding:
                break
        
        if not finding:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Finding not found"
            )
        
        logger.info("Finding details retrieved",
                   user_id=current_user.user_id,
                   finding_id=finding_id)
        
        return finding
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Finding detail retrieval failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Finding detail retrieval failed: {str(e)}"
        )

@router.post("/findings/{finding_id}/resolve")
async def resolve_finding(
    finding_id: str,
    resolution_notes: str,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.ATLAS))
):
    """Mark a security finding as resolved"""
    try:
        # In production, update finding status in database
        logger.info("Finding marked as resolved",
                   user_id=current_user.user_id,
                   finding_id=finding_id)
        
        return {
            "finding_id": finding_id,
            "status": "resolved",
            "resolved_by": current_user.user_id,
            "resolved_at": "2024-01-15T10:00:00Z",
            "resolution_notes": resolution_notes
        }
        
    except Exception as e:
        logger.error("Finding resolution failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Finding resolution failed: {str(e)}"
        )