# NEXUS API Router - Advanced Intelligence Platform
# FastAPI routes for threat intelligence and expert network

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime
import structlog

from shared.auth import get_current_user, require_permission, ComponentPermissions, TokenData
from .intelligence_engine import (
    AdvancedIntelligenceEngine,
    ThreatCategory,
    IntelligenceSource,
    ThreatIntelligence,
    IndustryBenchmark,
    ExpertProfile,
    ResearchPaper,
    CollaborationRequest
)

router = APIRouter()
logger = structlog.get_logger()

# Initialize the intelligence engine
intelligence_engine = AdvancedIntelligenceEngine()

# Pydantic models for API requests
class ThreatIntelRequest(BaseModel):
    categories: List[ThreatCategory]
    industries: List[str]
    time_range_days: int = 7

class BenchmarkRequest(BaseModel):
    industry: str
    metrics: List[str]
    organization_data: Dict[str, float]

class ResearchSearchRequest(BaseModel):
    keywords: List[str]
    topic_area: str
    limit: int = 10

class ExpertSearchRequest(BaseModel):
    expertise_areas: List[str]
    min_experience: Optional[int] = None
    location_preference: Optional[str] = None
    max_rate: Optional[float] = None

class ConsultationRequest(BaseModel):
    topic: str
    description: str
    expertise_needed: List[str]
    timeline: str
    budget_range: Optional[str] = None

@router.get("/threat-intelligence")
async def get_threat_intelligence(
    categories: List[ThreatCategory] = Query(default=[ThreatCategory.MALWARE]),
    industries: List[str] = Query(default=["Technology"]),
    days: int = Query(default=7, ge=1, le=30),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.NEXUS))
):
    """Get latest threat intelligence for specified categories and industries"""
    try:
        logger.info("Collecting threat intelligence",
                   user_id=current_user.user_id,
                   categories=len(categories),
                   industries=len(industries))
        
        threat_intel = await intelligence_engine.collect_threat_intelligence(
            categories=categories,
            industries=industries,
            time_range=days
        )
        
        logger.info("Threat intelligence collected",
                   user_id=current_user.user_id,
                   intel_count=len(threat_intel))
        
        return {
            "threat_intelligence": threat_intel,
            "total_count": len(threat_intel),
            "collection_date": "2024-01-15T10:00:00Z",
            "next_update": "2024-01-16T10:00:00Z"
        }
        
    except Exception as e:
        logger.error("Threat intelligence collection failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Threat intelligence collection failed: {str(e)}"
        )

@router.post("/threat-intelligence/analyze")
async def analyze_threat_intelligence(
    request: ThreatIntelRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.NEXUS))
):
    """Analyze threat intelligence with AI enhancement"""
    try:
        logger.info("Starting threat intelligence analysis",
                   user_id=current_user.user_id,
                   categories=len(request.categories))
        
        threat_intel = await intelligence_engine.collect_threat_intelligence(
            categories=request.categories,
            industries=request.industries,
            time_range=request.time_range_days
        )
        
        # Generate summary analysis
        analysis_summary = {
            "total_threats": len(threat_intel),
            "severity_distribution": {
                "critical": len([t for t in threat_intel if t.severity == "critical"]),
                "high": len([t for t in threat_intel if t.severity == "high"]),
                "medium": len([t for t in threat_intel if t.severity == "medium"]),
                "low": len([t for t in threat_intel if t.severity == "low"])
            },
            "category_breakdown": {
                category.value: len([t for t in threat_intel if t.category == category])
                for category in request.categories
            },
            "top_threats": sorted(threat_intel, key=lambda x: x.confidence_level, reverse=True)[:5],
            "recommended_actions": [
                "Review and update security controls based on latest threats",
                "Enhance monitoring for identified indicators of compromise",
                "Conduct threat hunting exercises targeting new attack vectors",
                "Update incident response procedures for emerging threats"
            ]
        }
        
        logger.info("Threat intelligence analysis completed",
                   user_id=current_user.user_id,
                   threats_analyzed=len(threat_intel))
        
        return {
            "analysis_summary": analysis_summary,
            "detailed_intelligence": threat_intel,
            "analysis_date": "2024-01-15T10:00:00Z"
        }
        
    except Exception as e:
        logger.error("Threat intelligence analysis failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Threat intelligence analysis failed: {str(e)}"
        )

@router.post("/benchmarks", response_model=List[IndustryBenchmark])
async def generate_industry_benchmarks(
    request: BenchmarkRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.NEXUS))
):
    """Generate industry benchmarks and peer comparisons"""
    try:
        logger.info("Generating industry benchmarks",
                   user_id=current_user.user_id,
                   industry=request.industry,
                   metrics=len(request.metrics))
        
        benchmarks = await intelligence_engine.generate_industry_benchmarks(
            industry=request.industry,
            metrics=request.metrics,
            organization_data=request.organization_data
        )
        
        logger.info("Industry benchmarks generated",
                   user_id=current_user.user_id,
                   benchmarks_count=len(benchmarks))
        
        return benchmarks
        
    except Exception as e:
        logger.error("Benchmark generation failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Benchmark generation failed: {str(e)}"
        )

@router.post("/research/search", response_model=List[ResearchPaper])
async def search_academic_research(
    request: ResearchSearchRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.NEXUS))
):
    """Search academic research papers using Semantic Scholar integration"""
    try:
        logger.info("Searching academic research",
                   user_id=current_user.user_id,
                   keywords=len(request.keywords),
                   topic=request.topic_area)
        
        research_papers = await intelligence_engine.search_academic_research(
            keywords=request.keywords,
            topic_area=request.topic_area,
            limit=request.limit
        )
        
        logger.info("Academic research search completed",
                   user_id=current_user.user_id,
                   papers_found=len(research_papers))
        
        return research_papers
        
    except Exception as e:
        logger.error("Academic research search failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Academic research search failed: {str(e)}"
        )

@router.post("/experts/search", response_model=List[ExpertProfile])
async def search_expert_network(
    request: ExpertSearchRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.NEXUS))
):
    """Search expert network for consultations"""
    try:
        logger.info("Searching expert network",
                   user_id=current_user.user_id,
                   expertise_areas=len(request.expertise_areas))
        
        search_criteria = {
            "expertise_areas": request.expertise_areas
        }
        
        if request.min_experience:
            search_criteria["min_experience"] = request.min_experience
        
        experts = await intelligence_engine.manage_expert_network(
            action="search_experts",
            expert_criteria=search_criteria
        )
        
        # Filter by additional criteria
        if request.max_rate:
            experts = [e for e in experts if (e.consultation_rate or 0) <= request.max_rate]
        
        logger.info("Expert network search completed",
                   user_id=current_user.user_id,
                   experts_found=len(experts))
        
        return experts
        
    except Exception as e:
        logger.error("Expert network search failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Expert network search failed: {str(e)}"
        )

@router.post("/experts/consultation")
async def request_expert_consultation(
    request: ConsultationRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.NEXUS))
):
    """Request expert consultation"""
    try:
        logger.info("Requesting expert consultation",
                   user_id=current_user.user_id,
                   topic=request.topic)
        
        consultation_result = await intelligence_engine.manage_expert_network(
            action="request_consultation",
            consultation_topic=request.topic,
            expert_criteria={"expertise_areas": request.expertise_needed}
        )
        
        consultation_response = {
            "request_id": f"consult_{current_user.user_id}_{int(datetime.utcnow().timestamp())}",
            "status": "submitted",
            "topic": request.topic,
            "estimated_response_time": "24-48 hours",
            "matched_experts": 3,
            "estimated_cost": "$500-2000",
            "next_steps": [
                "Expert matching in progress",
                "You will receive expert profiles within 24 hours",
                "Schedule consultation calls with selected experts"
            ]
        }
        
        logger.info("Expert consultation requested",
                   user_id=current_user.user_id,
                   request_id=consultation_response["request_id"])
        
        return consultation_response
        
    except Exception as e:
        logger.error("Expert consultation request failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Expert consultation request failed: {str(e)}"
        )

@router.get("/collaboration/opportunities")
async def get_collaboration_opportunities(
    expertise_area: Optional[str] = None,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.NEXUS))
):
    """Get peer collaboration opportunities"""
    try:
        # Mock collaboration opportunities
        opportunities = [
            {
                "opportunity_id": "collab_001",
                "title": "Joint Research on Zero Trust Implementation",
                "description": "Collaborative research project on zero trust architecture implementation challenges",
                "expertise_needed": ["Zero Trust", "Network Security", "Enterprise Architecture"],
                "collaboration_type": "joint_research",
                "timeline": "3-6 months",
                "participants_needed": 2,
                "current_participants": 1,
                "organization_types": ["Enterprise", "Research Institution"],
                "benefits": ["Shared research costs", "Cross-industry insights", "Publication opportunities"]
            },
            {
                "opportunity_id": "collab_002", 
                "title": "Cloud Security Best Practices Working Group",
                "description": "Industry working group developing cloud security best practices and standards",
                "expertise_needed": ["Cloud Security", "Compliance", "Risk Management"],
                "collaboration_type": "working_group",
                "timeline": "Ongoing",
                "participants_needed": 5,
                "current_participants": 7,
                "organization_types": ["All Industries"],
                "benefits": ["Industry networking", "Standard development", "Thought leadership"]
            }
        ]
        
        # Filter by expertise area if provided
        if expertise_area:
            opportunities = [
                opp for opp in opportunities 
                if expertise_area.lower() in [exp.lower() for exp in opp["expertise_needed"]]
            ]
        
        logger.info("Collaboration opportunities retrieved",
                   user_id=current_user.user_id,
                   opportunities_count=len(opportunities))
        
        return {
            "opportunities": opportunities,
            "total_count": len(opportunities),
            "participation_benefits": [
                "Access to industry insights and best practices",
                "Networking with security professionals",
                "Collaborative research and development",
                "Shared resources and expertise"
            ]
        }
        
    except Exception as e:
        logger.error("Collaboration opportunities retrieval failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Collaboration opportunities retrieval failed: {str(e)}"
        )

@router.get("/dashboard")
async def get_intelligence_dashboard(
    current_user: TokenData = Depends(require_permission(ComponentPermissions.NEXUS))
):
    """Get intelligence platform dashboard"""
    try:
        dashboard_data = {
            "organization_id": current_user.organization_id,
            "last_updated": "2024-01-15T10:00:00Z",
            "threat_intelligence": {
                "active_threats": 23,
                "high_severity": 5,
                "threats_this_week": 8,
                "industry_specific": 12,
                "confidence_avg": 0.87
            },
            "industry_position": {
                "security_score_percentile": 78,
                "peer_ranking": "Above Average",
                "improvement_areas": ["Incident Response", "Third-party Risk"],
                "strengths": ["Access Controls", "Data Protection"]
            },
            "expert_network": {
                "available_experts": 156,
                "consultation_requests": 3,
                "ongoing_collaborations": 2,
                "expert_ratings_avg": 4.7
            },
            "research_insights": {
                "relevant_papers": 45,
                "trending_topics": ["Zero Trust", "AI Security", "Quantum Cryptography"],
                "recent_publications": 12,
                "citation_impact": "High"
            },
            "intelligence_sources": {
                "threat_feeds": 8,
                "research_databases": 3,
                "expert_contributors": 156,
                "peer_organizations": 23
            }
        }
        
        logger.info("Intelligence dashboard retrieved",
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