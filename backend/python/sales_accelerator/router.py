# ERIP Sales Accelerator API Router
# FastAPI routes for compliance-driven sales acceleration

from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime
import structlog

from shared.auth import get_current_user, require_permission, ComponentPermissions, TokenData
from .intelligence_engine import (
    SalesIntelligenceEngine,
    ComplianceQuestion,
    ComplianceAnswer
)

router = APIRouter()
logger = structlog.get_logger()

# Initialize the sales intelligence engine
sales_engine = SalesIntelligenceEngine()

# Pydantic models for API requests
class ComplianceQuestionRequest(BaseModel):
    question: str
    customer_context: Optional[str] = None
    urgency: str = "normal"
    component_context: Optional[str] = None

class CompetitiveIntelligenceRequest(BaseModel):
    competitor: str
    compliance_area: str
    customer_context: Optional[str] = None

class ProposalGenerationRequest(BaseModel):
    customer_name: str
    industry: str
    compliance_requirements: List[str]
    deal_value: Optional[float] = None

class SalesMetricsRequest(BaseModel):
    time_period: str = "last_30_days"
    sales_rep_id: Optional[str] = None

@router.post("/compliance/ask", response_model=ComplianceAnswer)
async def ask_compliance_question(
    request: ComplianceQuestionRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """
    Natural language compliance Q&A for sales teams
    
    Provides instant, AI-powered answers to compliance questions during customer engagements.
    Includes confidence scoring and automatic expert escalation for complex scenarios.
    """
    try:
        logger.info("Processing sales compliance question",
                   user_id=current_user.user_id,
                   question=request.question[:50],
                   urgency=request.urgency)
        
        # Create compliance question object
        question = ComplianceQuestion(
            question=request.question,
            customer_context=request.customer_context,
            urgency=request.urgency,
            component_context=request.component_context,
            asked_by=current_user.user_id,
            organization_id=current_user.organization_id
        )
        
        # Get AI-powered answer
        answer = await sales_engine.answer_compliance_question(question)
        
        logger.info("Compliance question answered successfully",
                   user_id=current_user.user_id,
                   confidence=answer.confidence_score,
                   response_time_ms=answer.response_time_ms,
                   escalation_needed=answer.escalation_needed)
        
        return answer
        
    except Exception as e:
        logger.error("Failed to process compliance question",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process compliance question: {str(e)}"
        )

@router.post("/competitive/intelligence")
async def get_competitive_intelligence(
    request: CompetitiveIntelligenceRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.NEXUS))
):
    """
    Generate competitive intelligence for compliance-focused sales scenarios
    
    Provides talking points, proof points, and competitive positioning for sales teams
    when competing against traditional GRC solutions or compliance consultants.
    """
    try:
        logger.info("Generating competitive intelligence",
                   user_id=current_user.user_id,
                   competitor=request.competitor,
                   compliance_area=request.compliance_area)
        
        intelligence = await sales_engine.get_competitive_intelligence(
            competitor=request.competitor,
            compliance_area=request.compliance_area,
            customer_context=request.customer_context
        )
        
        logger.info("Competitive intelligence generated",
                   user_id=current_user.user_id,
                   competitor=request.competitor)
        
        return intelligence
        
    except Exception as e:
        logger.error("Failed to generate competitive intelligence",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate competitive intelligence: {str(e)}"
        )

@router.post("/proposals/generate")
async def generate_proposal_content(
    request: ProposalGenerationRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Generate automated proposal content for compliance-focused deals
    
    Creates executive summaries, compliance solutions, ROI projections, and implementation
    timelines tailored to customer requirements and industry context.
    """
    try:
        logger.info("Generating proposal content",
                   user_id=current_user.user_id,
                   customer=request.customer_name,
                   industry=request.industry)
        
        proposal = await sales_engine.generate_proposal_content(
            customer_name=request.customer_name,
            industry=request.industry,
            compliance_requirements=request.compliance_requirements,
            deal_value=request.deal_value
        )
        
        logger.info("Proposal content generated",
                   user_id=current_user.user_id,
                   customer=request.customer_name)
        
        return proposal
        
    except Exception as e:
        logger.error("Failed to generate proposal content",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate proposal content: {str(e)}"
        )

@router.get("/dashboard")
async def get_sales_dashboard(
    timeframe: str = Query(default="last_30_days"),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Get sales acceleration dashboard with compliance-driven metrics
    
    Provides sales performance metrics, question analytics, and ROI tracking
    for compliance-driven sales activities.
    """
    try:
        # Mock dashboard data based on sales accelerator metrics
        dashboard_data = {
            "organization_id": current_user.organization_id,
            "timeframe": timeframe,
            "last_updated": datetime.utcnow().isoformat(),
            
            "sales_acceleration_metrics": {
                "questions_answered": 1247,
                "average_response_time_ms": 850,
                "confidence_score_average": 0.92,
                "expert_escalation_rate": 8.5,
                "sales_cycle_reduction": 45.2,
                "win_rate_improvement": 28.7
            },
            
            "compliance_intelligence": {
                "active_frameworks": ["GDPR", "SOX", "HIPAA", "eIDAS", "SOC2"],
                "questions_by_framework": {
                    "GDPR": 342,
                    "SOX": 189,
                    "HIPAA": 156,
                    "eIDAS": 98,
                    "SOC2": 234
                },
                "trending_topics": [
                    "AI governance requirements",
                    "Cross-border data transfers",
                    "Automated audit evidence",
                    "Real-time compliance monitoring"
                ]
            },
            
            "competitive_insights": {
                "wins_vs_traditional_grc": 23,
                "wins_vs_consulting": 17,
                "average_deal_size_increase": 125000,
                "compliance_premium_achieved": 18.5,
                "top_differentiators": [
                    "AI-powered instant answers",
                    "Sales-native compliance intelligence",
                    "30-day implementation vs 6-month traditional",
                    "Real-time regulatory monitoring"
                ]
            },
            
            "roi_impact": {
                "deals_accelerated": 89,
                "total_pipeline_value": 12400000,
                "compliance_driven_revenue": 3100000,
                "average_cycle_reduction_days": 67,
                "customer_satisfaction_score": 4.7
            },
            
            "upcoming_opportunities": [
                {
                    "customer": "Global Financial Corp",
                    "compliance_focus": "Basel III compliance automation",
                    "deal_value": 850000,
                    "stage": "Technical evaluation",
                    "ai_recommendation": "Emphasize real-time risk calculation capabilities"
                },
                {
                    "customer": "Healthcare Innovation",
                    "compliance_focus": "HIPAA automation and PHI protection",
                    "deal_value": 340000,
                    "stage": "Compliance validation",
                    "ai_recommendation": "Schedule HIPAA compliance demonstration"
                },
                {
                    "customer": "TechStart Europe",
                    "compliance_focus": "GDPR and eIDAS integration",
                    "deal_value": 125000,
                    "stage": "Proposal development",
                    "ai_recommendation": "Highlight EU regulatory expertise and automation"
                }
            ],
            
            "team_performance": {
                "top_performers": [
                    {"rep": "Sarah Chen", "deals_closed": 8, "compliance_wins": 6},
                    {"rep": "Michael Rodriguez", "deals_closed": 7, "compliance_wins": 5},
                    {"rep": "Emma Thompson", "deals_closed": 6, "compliance_wins": 4}
                ],
                "training_recommendations": [
                    "Advanced GDPR positioning workshop",
                    "Financial services compliance masterclass",
                    "Competitive battlecard training"
                ]
            }
        }
        
        logger.info("Sales dashboard retrieved",
                   user_id=current_user.user_id,
                   timeframe=timeframe)
        
        return dashboard_data
        
    except Exception as e:
        logger.error("Failed to retrieve sales dashboard",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve sales dashboard: {str(e)}"
        )

@router.get("/analytics/questions")
async def get_question_analytics(
    timeframe: str = Query(default="last_30_days"),
    framework: Optional[str] = Query(default=None),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """
    Get analytics on compliance questions asked by sales teams
    
    Provides insights into question patterns, response quality, and knowledge gaps
    to optimize sales enablement and training programs.
    """
    try:
        # Mock analytics data
        analytics = {
            "timeframe": timeframe,
            "framework_filter": framework,
            "total_questions": 1247,
            "unique_askers": 34,
            
            "question_categories": {
                "data_privacy": 387,
                "financial_controls": 298,
                "security_standards": 234,
                "industry_specific": 189,
                "implementation": 139
            },
            
            "response_quality": {
                "average_confidence": 0.92,
                "high_confidence_rate": 78.5,
                "expert_escalation_rate": 8.5,
                "customer_satisfaction": 4.6
            },
            
            "trending_questions": [
                {
                    "question": "How does ERIP handle GDPR Article 25 privacy by design requirements?",
                    "frequency": 23,
                    "confidence": 0.94,
                    "framework": "GDPR"
                },
                {
                    "question": "What automated controls does ERIP provide for SOX Section 404 compliance?",
                    "frequency": 19,
                    "confidence": 0.89,
                    "framework": "SOX"
                },
                {
                    "question": "How does the platform demonstrate HIPAA Safeguards Rule compliance?",
                    "frequency": 17,
                    "confidence": 0.91,
                    "framework": "HIPAA"
                }
            ],
            
            "knowledge_gaps": [
                {
                    "topic": "AI governance and algorithmic accountability",
                    "question_count": 45,
                    "low_confidence_rate": 32.1,
                    "recommendation": "Develop AI governance knowledge base content"
                },
                {
                    "topic": "Cross-border data transfer mechanisms",
                    "question_count": 38,
                    "low_confidence_rate": 28.7,
                    "recommendation": "Update international transfer guidance"
                }
            ],
            
            "improvement_opportunities": [
                "Enhance AI governance content for emerging regulations",
                "Create industry-specific compliance playbooks",
                "Develop competitive positioning against niche solutions",
                "Build customer success story database for social proof"
            ]
        }
        
        logger.info("Question analytics retrieved",
                   user_id=current_user.user_id,
                   timeframe=timeframe,
                   framework=framework)
        
        return analytics
        
    except Exception as e:
        logger.error("Failed to retrieve question analytics",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve question analytics: {str(e)}"
        )

@router.post("/training/recommend")
async def recommend_training(
    sales_rep_id: Optional[str] = None,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Generate personalized training recommendations for sales teams
    
    Analyzes individual performance and question patterns to recommend
    targeted compliance training and enablement content.
    """
    try:
        target_rep = sales_rep_id or current_user.user_id
        
        # Mock training recommendations based on performance analysis
        recommendations = {
            "sales_rep_id": target_rep,
            "assessment_date": datetime.utcnow().isoformat(),
            
            "performance_summary": {
                "questions_asked": 89,
                "deals_influenced": 12,
                "compliance_win_rate": 66.7,
                "areas_of_strength": ["GDPR positioning", "ROI articulation"],
                "improvement_areas": ["Technical implementation", "Competitive positioning"]
            },
            
            "recommended_training": [
                {
                    "module": "Advanced Technical Implementation Workshop",
                    "priority": "high",
                    "duration": "4 hours",
                    "topics": ["API integrations", "Data flow architecture", "Performance optimization"],
                    "reason": "Frequent technical questions with lower confidence scores"
                },
                {
                    "module": "Competitive Battlecard Mastery",
                    "priority": "medium",
                    "duration": "2 hours",
                    "topics": ["Traditional GRC weaknesses", "ERIP differentiators", "Objection handling"],
                    "reason": "Competitive deals requiring stronger positioning"
                },
                {
                    "module": "Industry-Specific Compliance Deep Dive",
                    "priority": "medium",
                    "duration": "3 hours",
                    "topics": ["Financial services regulations", "Healthcare compliance", "Manufacturing standards"],
                    "reason": "Expanding into new industry verticals"
                }
            ],
            
            "knowledge_resources": [
                {
                    "title": "ERIP Compliance Framework Quick Reference",
                    "type": "cheat_sheet",
                    "url": "/resources/compliance-frameworks-guide.pdf"
                },
                {
                    "title": "Customer Success Stories Database",
                    "type": "case_studies",
                    "url": "/resources/customer-success-stories"
                },
                {
                    "title": "ROI Calculator and Business Case Templates",
                    "type": "tools",
                    "url": "/resources/roi-calculator"
                }
            ],
            
            "practice_scenarios": [
                {
                    "scenario": "Healthcare prospect asking about HIPAA BAA requirements",
                    "difficulty": "intermediate",
                    "key_points": ["Business Associate Agreement automation", "PHI protection", "Audit trails"]
                },
                {
                    "scenario": "Financial services competitive situation vs ServiceNow GRC",
                    "difficulty": "advanced",
                    "key_points": ["Implementation speed", "AI automation", "Cost efficiency"]
                }
            ]
        }
        
        logger.info("Training recommendations generated",
                   user_id=current_user.user_id,
                   target_rep=target_rep)
        
        return recommendations
        
    except Exception as e:
        logger.error("Failed to generate training recommendations",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate training recommendations: {str(e)}"
        )