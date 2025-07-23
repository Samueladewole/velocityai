# COMPASS API Router - Regulatory Intelligence Engine
# FastAPI routes for regulatory analysis and compliance management

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import structlog

from shared.auth import get_current_user, require_permission, ComponentPermissions, TokenData
from .regulatory_engine import (
    RegulatoryIntelligenceEngine, 
    ComplianceFramework,
    RegulationAnalysis,
    ComplianceGap,
    ImplementationRoadmap
)

router = APIRouter()
logger = structlog.get_logger()

# Initialize the regulatory engine
regulatory_engine = RegulatoryIntelligenceEngine()

# Pydantic models for API requests
class RegulationAnalysisRequest(BaseModel):
    regulation_text: str
    framework: ComplianceFramework
    organization_context: Dict[str, Any]

class ComplianceAssessmentRequest(BaseModel):
    framework: ComplianceFramework
    current_controls: Dict[str, Any]

class RoadmapGenerationRequest(BaseModel):
    framework: ComplianceFramework
    organization_constraints: Dict[str, Any]
    priority_gaps_only: bool = False

class EvidenceGenerationRequest(BaseModel):
    framework: ComplianceFramework
    control_id: str
    implementation_data: Dict[str, Any]

@router.get("/frameworks")
async def get_supported_frameworks(
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """Get list of supported compliance frameworks"""
    frameworks = [
        {
            "id": framework.value,
            "name": framework.value,
            "description": f"Comprehensive {framework.value} compliance analysis",
            "ai_enhanced": True,
            "status": "active"
        }
        for framework in ComplianceFramework
    ]
    
    logger.info("Frameworks retrieved", user_id=current_user.user_id, count=len(frameworks))
    
    return {
        "frameworks": frameworks,
        "total_count": len(frameworks),
        "ai_powered": True
    }

@router.post("/analyze-regulation", response_model=RegulationAnalysis)
async def analyze_regulation(
    request: RegulationAnalysisRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """Analyze regulation text using AI-powered intelligence"""
    try:
        logger.info("Starting regulation analysis",
                   user_id=current_user.user_id,
                   framework=request.framework.value)
        
        analysis = await regulatory_engine.analyze_regulation(
            regulation_text=request.regulation_text,
            framework=request.framework,
            organization_context=request.organization_context
        )
        
        logger.info("Regulation analysis completed",
                   user_id=current_user.user_id,
                   regulation_id=analysis.regulation_id,
                   confidence=analysis.ai_confidence)
        
        return analysis
        
    except Exception as e:
        logger.error("Regulation analysis failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Regulation analysis failed: {str(e)}"
        )

@router.post("/assess-compliance", response_model=List[ComplianceGap])
async def assess_compliance_gaps(
    request: ComplianceAssessmentRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """Assess compliance gaps using AI analysis"""
    try:
        logger.info("Starting compliance assessment",
                   user_id=current_user.user_id,
                   framework=request.framework.value)
        
        gaps = await regulatory_engine.assess_compliance_gaps(
            framework=request.framework,
            current_controls=request.current_controls,
            organization_id=current_user.organization_id
        )
        
        logger.info("Compliance assessment completed",
                   user_id=current_user.user_id,
                   gaps_found=len(gaps),
                   high_priority=len([g for g in gaps if g.priority == "high"]))
        
        return gaps
        
    except Exception as e:
        logger.error("Compliance assessment failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Compliance assessment failed: {str(e)}"
        )

@router.post("/generate-roadmap", response_model=ImplementationRoadmap)
async def generate_implementation_roadmap(
    request: RoadmapGenerationRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """Generate AI-optimized implementation roadmap"""
    try:
        logger.info("Starting roadmap generation",
                   user_id=current_user.user_id,
                   framework=request.framework.value)
        
        # First assess gaps if not provided
        gaps = await regulatory_engine.assess_compliance_gaps(
            framework=request.framework,
            current_controls={},  # Would be provided in real implementation
            organization_id=current_user.organization_id
        )
        
        # Filter to high priority gaps if requested
        if request.priority_gaps_only:
            gaps = [gap for gap in gaps if gap.priority == "high"]
        
        roadmap = await regulatory_engine.generate_implementation_roadmap(
            framework=request.framework,
            gaps=gaps,
            organization_constraints=request.organization_constraints
        )
        
        logger.info("Roadmap generation completed",
                   user_id=current_user.user_id,
                   roadmap_id=roadmap.roadmap_id,
                   estimated_months=roadmap.total_effort_months)
        
        return roadmap
        
    except Exception as e:
        logger.error("Roadmap generation failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Roadmap generation failed: {str(e)}"
        )

@router.get("/regulatory-updates")
async def get_regulatory_updates(
    frameworks: List[ComplianceFramework] = Query(default=[ComplianceFramework.ISO27001]),
    days: int = Query(default=30, ge=1, le=90),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """Get latest regulatory updates and changes"""
    try:
        logger.info("Retrieving regulatory updates",
                   user_id=current_user.user_id,
                   frameworks=len(frameworks))
        
        updates = await regulatory_engine.monitor_regulatory_changes(
            frameworks=frameworks,
            organization_id=current_user.organization_id
        )
        
        logger.info("Regulatory updates retrieved",
                   user_id=current_user.user_id,
                   updates_count=len(updates))
        
        return {
            "updates": updates,
            "monitored_frameworks": [f.value for f in frameworks],
            "last_updated": "2024-01-15T10:00:00Z",
            "next_check": "2024-01-16T10:00:00Z"
        }
        
    except Exception as e:
        logger.error("Regulatory updates retrieval failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Regulatory updates retrieval failed: {str(e)}"
        )

@router.post("/generate-evidence")
async def generate_compliance_evidence(
    request: EvidenceGenerationRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """Generate compliance evidence documentation"""
    try:
        logger.info("Starting evidence generation",
                   user_id=current_user.user_id,
                   framework=request.framework.value,
                   control_id=request.control_id)
        
        evidence = await regulatory_engine.generate_compliance_evidence(
            framework=request.framework,
            control_id=request.control_id,
            implementation_data=request.implementation_data
        )
        
        logger.info("Evidence generation completed",
                   user_id=current_user.user_id,
                   control_id=request.control_id)
        
        return evidence
        
    except Exception as e:
        logger.error("Evidence generation failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Evidence generation failed: {str(e)}"
        )

@router.get("/compliance-dashboard")
async def get_compliance_dashboard(
    framework: Optional[ComplianceFramework] = None,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """Get compliance dashboard data"""
    try:
        # Mock dashboard data (in production, aggregate from database)
        dashboard_data = {
            "organization_id": current_user.organization_id,
            "last_updated": "2024-01-15T10:00:00Z",
            "overall_compliance": {
                "score": 78,
                "status": "Good",
                "trend": "improving"
            },
            "frameworks": [
                {
                    "framework": "ISO 27001",
                    "compliance_percentage": 82,
                    "controls_total": 114,
                    "controls_compliant": 94,
                    "gaps_high": 3,
                    "gaps_medium": 8,
                    "gaps_low": 9
                },
                {
                    "framework": "SOC 2",
                    "compliance_percentage": 91,
                    "controls_total": 64,
                    "controls_compliant": 58,
                    "gaps_high": 1,
                    "gaps_medium": 3,
                    "gaps_low": 2
                }
            ],
            "recent_activities": [
                {
                    "activity": "MFA implementation completed",
                    "framework": "ISO 27001",
                    "date": "2024-01-14",
                    "impact": "3 gaps resolved"
                },
                {
                    "activity": "Data classification review",
                    "framework": "GDPR",
                    "date": "2024-01-12",
                    "impact": "Compliance improved"
                }
            ],
            "upcoming_deadlines": [
                {
                    "task": "SOC 2 audit preparation",
                    "deadline": "2024-02-15",
                    "priority": "high"
                },
                {
                    "task": "ISO 27001 surveillance audit",
                    "deadline": "2024-03-30",
                    "priority": "medium"
                }
            ]
        }
        
        logger.info("Compliance dashboard retrieved",
                   user_id=current_user.user_id,
                   frameworks_count=len(dashboard_data["frameworks"]))
        
        return dashboard_data
        
    except Exception as e:
        logger.error("Dashboard retrieval failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Dashboard retrieval failed: {str(e)}"
        )