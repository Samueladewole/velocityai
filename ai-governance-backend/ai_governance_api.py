"""
ERIP AI Governance Module - FastAPI Backend
Provides REST API endpoints for AI governance functionality
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import asyncio
import logging
from datetime import datetime

from ai_governance_manager import AIGovernanceManager, AISystem, ISO42001Control, AIRiskAssessment, AITrainingModule
from ai_governance_manager import AISystemType, AIRiskCategory, ImplementationStatus, AssessmentType, TrainingCategory

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="ERIP AI Governance API",
    description="REST API for AI governance, ISO 42001 compliance, and responsible AI management",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Governance Manager
ai_gov_manager = AIGovernanceManager()

# Pydantic models for API requests
class AISystemRequest(BaseModel):
    name: str
    type: str
    risk_level: str
    eu_ai_act_category: str
    owner: str
    department: str
    status: str
    description: str
    data_types: List[str]
    business_impact: str

class ISO42001ControlRequest(BaseModel):
    category: str
    control_id: str
    title: str
    description: str
    implementation: str
    evidence: List[str]
    responsible_party: str
    trust_points: int

class AIRiskAssessmentRequest(BaseModel):
    ai_system_id: str
    assessment_type: str
    risks: List[Dict[str, Any]]
    overall_risk_level: str
    approval_status: str = "pending"
    trust_equity_impact: int

class AITrainingModuleRequest(BaseModel):
    title: str
    category: str
    duration_minutes: int
    completion_rate: float = 0.0
    participants: int = 0
    trust_points: int
    mandatory: bool = False

class ScanRequest(BaseModel):
    scan_type: str = "comprehensive"  # comprehensive, framework_only, containers_only
    include_apis: bool = True
    include_models: bool = True

# AI Systems Registry Endpoints
@app.post("/api/ai-governance/systems")
async def register_ai_system(request: AISystemRequest, background_tasks: BackgroundTasks):
    """Register new AI system in the registry"""
    try:
        import uuid
        system_id = str(uuid.uuid4())
        
        ai_system = AISystem(
            id=system_id,
            name=request.name,
            type=AISystemType(request.type),
            risk_level=AIRiskCategory(request.risk_level),
            eu_ai_act_category=request.eu_ai_act_category,
            owner=request.owner,
            department=request.department,
            status=request.status,
            description=request.description,
            data_types=request.data_types,
            business_impact=request.business_impact,
            compliance_score=70,  # Default starting score
            trust_impact=50,      # Default Trust Equity impact
            last_assessed=datetime.now().isoformat()
        )
        
        result = await ai_gov_manager.register_ai_system(ai_system)
        
        if result["success"]:
            return {
                "success": True,
                "message": "AI system registered successfully",
                "system_id": result["system_id"],
                "trust_points_earned": result["trust_points_earned"],
                "requires_risk_assessment": result["requires_risk_assessment"]
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"AI system registration failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai-governance/systems")
async def get_ai_systems():
    """Get all registered AI systems"""
    try:
        # In production, this would query the database
        # For now, return the sample data from the manager
        systems = await ai_gov_manager.discover_ai_systems()
        return {
            "success": True,
            "data": [system.__dict__ for system in systems],
            "total": len(systems)
        }
    except Exception as e:
        logger.error(f"Failed to get AI systems: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai-governance/systems/scan")
async def run_ai_system_scan(request: ScanRequest, background_tasks: BackgroundTasks):
    """Run automated AI system discovery scan"""
    try:
        background_tasks.add_task(_run_ai_discovery_scan, request.scan_type)
        
        return {
            "success": True,
            "message": "AI system discovery scan initiated",
            "scan_id": f"scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "estimated_duration": "2-5 minutes"
        }
    except Exception as e:
        logger.error(f"AI system scan failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def _run_ai_discovery_scan(scan_type: str):
    """Background task for AI system discovery"""
    try:
        logger.info(f"Starting AI system discovery scan: {scan_type}")
        discovered_systems = await ai_gov_manager.discover_ai_systems()
        logger.info(f"AI discovery scan complete: {len(discovered_systems)} systems found")
    except Exception as e:
        logger.error(f"AI discovery scan failed: {e}")

# ISO 42001 Controls Endpoints
@app.post("/api/ai-governance/iso42001/controls")
async def implement_iso42001_control(request: ISO42001ControlRequest):
    """Implement ISO 42001 control"""
    try:
        import uuid
        control_id = str(uuid.uuid4())
        
        control = ISO42001Control(
            id=control_id,
            category=request.category,
            control_id=request.control_id,
            title=request.title,
            description=request.description,
            implementation=ImplementationStatus(request.implementation),
            evidence=request.evidence,
            responsible_party=request.responsible_party,
            last_reviewed=datetime.now().isoformat(),
            next_review=datetime.now().isoformat(),  # Should be calculated
            trust_points=request.trust_points
        )
        
        result = await ai_gov_manager.implement_iso42001_control(control)
        
        if result["success"]:
            return {
                "success": True,
                "message": "ISO 42001 control implemented successfully",
                "control_id": result["control_id"],
                "trust_points_earned": result["trust_points_earned"],
                "implementation_level": result["implementation_level"]
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"ISO 42001 control implementation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai-governance/iso42001/controls")
async def get_iso42001_controls():
    """Get all ISO 42001 controls"""
    try:
        # Return sample ISO 42001 controls
        controls = [
            {
                "id": "iso42001-1",
                "category": "AI Management System",
                "control_id": "5.1",
                "title": "Leadership and Commitment",
                "description": "Top management demonstrates leadership and commitment to the AI management system",
                "implementation": "implemented",
                "evidence": ["AI Governance Policy", "Management Review Records"],
                "responsible_party": "Chief AI Officer",
                "trust_points": 50,
                "last_reviewed": "2024-01-15"
            },
            {
                "id": "iso42001-2", 
                "category": "AI Risk Management",
                "control_id": "7.3",
                "title": "AI System Risk Assessment",
                "description": "Systematic identification and assessment of AI system risks",
                "implementation": "partial",
                "evidence": ["Risk Assessment Template", "Preliminary Risk Analysis"],
                "responsible_party": "AI Risk Manager",
                "trust_points": 30,
                "last_reviewed": "2024-01-10"
            }
        ]
        
        return {
            "success": True,
            "data": controls,
            "total": len(controls)
        }
    except Exception as e:
        logger.error(f"Failed to get ISO 42001 controls: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Risk Assessment Endpoints
@app.post("/api/ai-governance/risk-assessments")
async def create_risk_assessment(request: AIRiskAssessmentRequest):
    """Create AI risk assessment"""
    try:
        import uuid
        assessment_id = str(uuid.uuid4())
        
        assessment = AIRiskAssessment(
            id=assessment_id,
            ai_system_id=request.ai_system_id,
            assessment_type=request.assessment_type,
            risks=request.risks,
            overall_risk_level=request.overall_risk_level,
            assessment_date=datetime.now().isoformat(),
            next_review=datetime.now().isoformat(),  # Should be calculated
            approval_status=request.approval_status,
            trust_equity_impact=request.trust_equity_impact
        )
        
        await ai_gov_manager._store_risk_assessment(assessment)
        
        return {
            "success": True,
            "message": "Risk assessment created successfully",
            "assessment_id": assessment_id,
            "trust_equity_impact": request.trust_equity_impact
        }
    except Exception as e:
        logger.error(f"Risk assessment creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai-governance/risk-assessments")
async def get_risk_assessments():
    """Get all AI risk assessments"""
    try:
        # Return sample risk assessments
        assessments = [
            {
                "id": "risk-1",
                "ai_system_id": "ai-2",
                "assessment_type": "pre_deployment",
                "overall_risk_level": "high",
                "assessment_date": "2024-01-18",
                "next_review": "2024-04-18",
                "approval_status": "pending",
                "trust_equity_impact": 120,
                "risks": [
                    {
                        "category": "Bias and Discrimination",
                        "description": "Potential bias in resume screening against protected groups",
                        "likelihood": 4,
                        "impact": 5,
                        "mitigation": "Bias testing, diverse training data, human oversight",
                        "residual_risk": 2
                    }
                ]
            }
        ]
        
        return {
            "success": True,
            "data": assessments,
            "total": len(assessments)
        }
    except Exception as e:
        logger.error(f"Failed to get risk assessments: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Training Module Endpoints
@app.post("/api/ai-governance/training/modules")
async def create_training_module(request: AITrainingModuleRequest):
    """Create AI training module"""
    try:
        import uuid
        module_id = str(uuid.uuid4())
        
        module = AITrainingModule(
            id=module_id,
            title=request.title,
            category=request.category,
            duration_minutes=request.duration_minutes,
            completion_rate=request.completion_rate,
            participants=request.participants,
            last_updated=datetime.now().isoformat(),
            trust_points=request.trust_points,
            mandatory=request.mandatory
        )
        
        result = await ai_gov_manager.create_training_module(module)
        
        if result["success"]:
            return {
                "success": True,
                "message": "Training module created successfully",
                "module_id": result["module_id"],
                "trust_points_earned": result["trust_points_earned"]
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Training module creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai-governance/training/modules")
async def get_training_modules():
    """Get all AI training modules"""
    try:
        # Return sample training modules
        modules = [
            {
                "id": "training-1",
                "title": "AI Ethics and Responsible AI",
                "category": "ethics",
                "duration_minutes": 45,
                "completion_rate": 87,
                "participants": 156,
                "trust_points": 25,
                "mandatory": True,
                "last_updated": "2024-01-15"
            },
            {
                "id": "training-2",
                "title": "Bias Prevention in AI Systems", 
                "category": "bias_prevention",
                "duration_minutes": 30,
                "completion_rate": 72,
                "participants": 98,
                "trust_points": 20,
                "mandatory": True,
                "last_updated": "2024-01-10"
            }
        ]
        
        return {
            "success": True,
            "data": modules,
            "total": len(modules)
        }
    except Exception as e:
        logger.error(f"Failed to get training modules: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Dashboard and Analytics Endpoints
@app.get("/api/ai-governance/dashboard")
async def get_ai_governance_dashboard():
    """Get comprehensive AI governance dashboard data"""
    try:
        dashboard_data = ai_gov_manager.get_ai_governance_dashboard()
        
        return {
            "success": True,
            "data": dashboard_data
        }
    except Exception as e:
        logger.error(f"Failed to get dashboard data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai-governance/trust-equity/events")
async def get_trust_equity_events(limit: int = 50):
    """Get recent Trust Equity events for AI governance"""
    try:
        # In production, this would query the database
        events = [
            {
                "id": "event-1",
                "event_type": "ai_system_registration",
                "entity_id": "ai-1",
                "points_earned": 50,
                "description": "AI governance activity: ai_system_registration",
                "timestamp": datetime.now().isoformat()
            },
            {
                "id": "event-2",
                "event_type": "iso42001_control",
                "entity_id": "iso42001-1",
                "points_earned": 75,
                "description": "AI governance activity: iso42001_control",
                "timestamp": datetime.now().isoformat()
            }
        ]
        
        return {
            "success": True,
            "data": events[:limit],
            "total": len(events)
        }
    except Exception as e:
        logger.error(f"Failed to get Trust Equity events: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/api/ai-governance/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ERIP AI Governance API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)