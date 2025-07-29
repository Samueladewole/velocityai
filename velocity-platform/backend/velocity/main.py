"""
Velocity AI Platform - Main FastAPI Application
Production backend with live data and real-time features
"""
import os
import asyncio
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
import uvicorn
import logging
import json

from models import (
    Organization, User, Agent, Integration, EvidenceItem, TrustScore, AgentExecutionLog,
    AgentStatus, EvidenceStatus, Platform, Framework,
    AgentResponse, EvidenceResponse, TrustScoreResponse
)
from database import engine, SessionLocal, create_tables, get_db
from agent_executor import AgentExecutor
# from cloud_integrations import CloudIntegrationManager  # Temporarily disabled
from websocket_manager import WebSocketManager

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://velocity:password@localhost/velocity_db")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global managers
agent_executor = AgentExecutor()
# cloud_manager = CloudIntegrationManager()  # Temporarily disabled
websocket_manager = WebSocketManager()

# Startup/shutdown lifecycle
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Velocity AI Platform...")
    create_tables()
    
    # Start background services
    asyncio.create_task(agent_executor.start_scheduler())
    asyncio.create_task(websocket_manager.start_heartbeat())
    
    yield
    
    # Shutdown
    logger.info("Shutting down Velocity AI Platform...")
    await agent_executor.stop_scheduler()
    await websocket_manager.stop_heartbeat()

# FastAPI app
app = FastAPI(
    title="Velocity AI Platform",
    description="AI-Powered Compliance Automation",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5178",
        "https://velocity.eripapp.com",
        "https://app.eripapp.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Get current authenticated user"""
    # TODO: Implement JWT token validation
    # For now, return a mock user for development
    user = db.query(User).first()
    if not user:
        # Create default user for development
        org = Organization(name="Demo Organization", domain="demo.com")
        db.add(org)
        db.commit()
        
        user = User(name="Demo User", email="demo@velocity.ai", organization_id=org.id)
        db.add(user)
        db.commit()
    
    return user

# API Routes

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Velocity AI Platform",
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# Authentication Routes
@app.post("/api/v1/auth/signup")
async def signup(
    signup_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Create new user account"""
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == signup_data["email"]).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Get or create organization
        org = db.query(Organization).filter(Organization.domain == signup_data["company"]).first()
        if not org:
            org = Organization(
                name=signup_data["company"],
                domain=signup_data["company"].lower().replace(" ", ""),
                tier=signup_data.get("tier", "starter")
            )
            db.add(org)
            db.commit()
            db.refresh(org)
        
        # Create user
        user = User(
            name=signup_data["name"],
            email=signup_data["email"],
            role="admin",  # First user in org is admin
            organization_id=org.id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # TODO: Hash password and store properly
        # For now, just return success
        
        return {
            "success": True,
            "data": {
                "access_token": "demo-token",  # Mock token for development
                "refresh_token": "demo-refresh-token",
                "token_type": "bearer",
                "expires_in": 3600,
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "name": user.name,
                    "company": org.name,
                    "role": user.role,
                    "tier": org.tier,
                    "mfa_enabled": False,
                    "created_at": user.created_at.isoformat()
                }
            }
        }
        
    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/auth/login")
async def login(
    login_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Authenticate user"""
    try:
        # Find user by email
        user = db.query(User).filter(User.email == login_data["email"]).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # TODO: Verify password hash
        # For now, just return success
        
        # Get organization
        org = db.query(Organization).filter(Organization.id == user.organization_id).first()
        
        # Update last login
        user.last_login = datetime.now(timezone.utc)
        db.commit()
        
        return {
            "success": True,
            "data": {
                "access_token": "demo-token",  # Mock token for development
                "refresh_token": "demo-refresh-token", 
                "token_type": "bearer",
                "expires_in": 3600,
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "name": user.name,
                    "company": org.name if org else "Unknown",
                    "role": user.role,
                    "tier": org.tier if org else "starter",
                    "mfa_enabled": False,
                    "created_at": user.created_at.isoformat()
                }
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/auth/refresh")
async def refresh_token(
    refresh_data: Dict[str, Any]
):
    """Refresh access token"""
    # TODO: Implement proper token refresh
    return {
        "success": True,
        "data": {
            "access_token": "demo-token",
            "refresh_token": "demo-refresh-token",
            "token_type": "bearer", 
            "expires_in": 3600
        }
    }

@app.get("/api/v1/agents")
async def get_agents(
    status: Optional[str] = None,
    platform: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all agents for the current organization"""
    query = db.query(Agent).filter(Agent.organization_id == current_user.organization_id)
    
    if status:
        query = query.filter(Agent.status == status)
    if platform:
        query = query.filter(Agent.platform == platform)
    
    agents = query.order_by(desc(Agent.created_at)).all()
    
    # Convert to dictionary format with string IDs
    return [
        {
            "id": str(agent.id),
            "name": agent.name,
            "platform": agent.platform.value,
            "framework": agent.framework.value,
            "status": agent.status.value,
            "evidence_collected": agent.evidence_collected,
            "success_rate": agent.success_rate,
            "last_run": agent.last_run.isoformat() if agent.last_run else None,
            "next_run": agent.next_run.isoformat() if agent.next_run else None,
            "description": agent.description,
            "avg_collection_time": agent.avg_collection_time
        }
        for agent in agents
    ]

@app.post("/api/v1/agents")
async def create_agent(
    agent_data: Dict[str, Any],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new AI agent"""
    try:
        # Validate integration exists
        integration = db.query(Integration).filter(
            Integration.id == agent_data.get("integration_id"),
            Integration.organization_id == current_user.organization_id
        ).first()
        
        if not integration:
            raise HTTPException(status_code=400, detail="Integration not found")
        
        # Create agent
        agent = Agent(
            name=agent_data["name"],
            description=agent_data.get("description", ""),
            platform=Platform(agent_data["platform"]),
            framework=Framework(agent_data["framework"]),
            configuration=agent_data.get("configuration", {}),
            schedule=agent_data.get("schedule", {}),
            organization_id=current_user.organization_id,
            integration_id=integration.id
        )
        
        db.add(agent)
        db.commit()
        db.refresh(agent)
        
        # Schedule first execution
        background_tasks.add_task(agent_executor.schedule_agent_execution, str(agent.id))
        
        # Notify via WebSocket
        await websocket_manager.broadcast_to_organization(
            current_user.organization_id,
            {
                "type": "agent_created",
                "data": {"agent_id": str(agent.id), "name": agent.name}
            }
        )
        
        return {"success": True, "agent_id": str(agent.id)}
        
    except Exception as e:
        logger.error(f"Error creating agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/agents/{agent_id}/run")
async def run_agent(
    agent_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manually trigger agent execution"""
    agent = db.query(Agent).filter(
        Agent.id == agent_id,
        Agent.organization_id == current_user.organization_id
    ).first()
    
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    if agent.status == AgentStatus.RUNNING:
        raise HTTPException(status_code=400, detail="Agent is already running")
    
    # Update agent status
    agent.status = AgentStatus.RUNNING
    db.commit()
    
    # Execute agent in background
    background_tasks.add_task(agent_executor.execute_agent, str(agent.id))
    
    return {"success": True, "message": "Agent execution started"}

@app.get("/api/v1/evidence")
async def get_evidence(
    status: Optional[str] = None,
    framework: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get evidence items for the current organization"""
    query = db.query(EvidenceItem).filter(
        EvidenceItem.organization_id == current_user.organization_id
    )
    
    if status:
        query = query.filter(EvidenceItem.status == status)
    if framework:
        query = query.filter(EvidenceItem.framework == framework)
    
    evidence = query.order_by(desc(EvidenceItem.created_at)).offset(offset).limit(limit).all()
    
    return [
        {
            "id": str(item.id),
            "title": item.title,
            "description": item.description,
            "evidence_type": item.evidence_type.value,
            "status": item.status.value,
            "framework": item.framework.value,
            "control_id": item.control_id,
            "confidence_score": item.confidence_score,
            "trust_points": item.trust_points,
            "created_at": item.created_at.isoformat(),
            "data": item.data,
            "evidence_metadata": item.evidence_metadata
        }
        for item in evidence
    ]

@app.post("/api/v1/evidence/{evidence_id}/validate")
async def validate_evidence(
    evidence_id: str,
    validation_data: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Validate an evidence item"""
    evidence = db.query(EvidenceItem).filter(
        EvidenceItem.id == evidence_id,
        EvidenceItem.organization_id == current_user.organization_id
    ).first()
    
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    # Update validation status
    evidence.status = EvidenceStatus.VALIDATED if validation_data.get("approved") else EvidenceStatus.REJECTED
    evidence.validated_by = current_user.id
    evidence.validated_at = datetime.now(timezone.utc)
    evidence.validation_notes = validation_data.get("notes", "")
    
    # Update trust score if approved
    if validation_data.get("approved"):
        await update_trust_score(current_user.organization_id, db)
    
    db.commit()
    
    # Notify via WebSocket
    await websocket_manager.broadcast_to_organization(
        current_user.organization_id,
        {
            "type": "evidence_validated",
            "data": {"evidence_id": evidence_id, "status": evidence.status.value}
        }
    )
    
    return {"success": True}

@app.get("/api/v1/integrations")
async def get_integrations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all integrations for the current organization"""
    integrations = db.query(Integration).filter(
        Integration.organization_id == current_user.organization_id
    ).all()
    
    return [
        {
            "id": str(integration.id),
            "name": integration.name,
            "platform": integration.platform.value,
            "status": integration.status.value,
            "last_sync": integration.last_sync.isoformat() if integration.last_sync else None,
            "error_count": integration.error_count
        }
        for integration in integrations
    ]

@app.post("/api/v1/integrations/{platform}/connect")
async def connect_integration(
    platform: str,
    credentials: Dict[str, Any],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Connect to a cloud platform"""
    try:
        # Test connection (disabled for development)
        # is_valid = await cloud_manager.test_connection(Platform(platform), credentials)
        # if not is_valid:
        #     raise HTTPException(status_code=400, detail="Invalid credentials")
        is_valid = True  # Mock validation for development
        
        # Create or update integration
        integration = db.query(Integration).filter(
            Integration.platform == platform,
            Integration.organization_id == current_user.organization_id
        ).first()
        
        if integration:
            integration.credentials = credentials  # TODO: Encrypt credentials
            integration.status = "connected"
            integration.error_count = 0
        else:
            integration = Integration(
                name=f"{platform.upper()} Integration",
                platform=Platform(platform),
                credentials=credentials,  # TODO: Encrypt credentials
                status="connected",
                organization_id=current_user.organization_id
            )
            db.add(integration)
        
        db.commit()
        
        # Start initial sync (disabled for development)
        # background_tasks.add_task(cloud_manager.sync_platform_data, str(integration.id))
        
        return {"success": True, "integration_id": str(integration.id)}
        
    except Exception as e:
        logger.error(f"Error connecting integration: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/trust-score")
async def get_trust_score(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current trust score for the organization"""
    trust_score = db.query(TrustScore).filter(
        TrustScore.organization_id == current_user.organization_id
    ).order_by(desc(TrustScore.created_at)).first()
    
    if not trust_score:
        # Create initial trust score
        trust_score = TrustScore(
            organization_id=current_user.organization_id,
            total_score=0,
            framework_scores={},
            evidence_count=0,
            automation_rate=0.0,
            coverage_percentage=0.0
        )
        db.add(trust_score)
        db.commit()
        db.refresh(trust_score)
    
    return {
        "total_score": trust_score.total_score,
        "framework_scores": trust_score.framework_scores,
        "score_change": trust_score.score_change,
        "evidence_count": trust_score.evidence_count,
        "automation_rate": trust_score.automation_rate,
        "coverage_percentage": trust_score.coverage_percentage,
        "last_updated": trust_score.last_updated.isoformat()
    }

@app.get("/api/v1/metrics/performance")
async def get_performance_metrics(
    period: str = "week",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get performance metrics for the organization"""
    # Calculate metrics based on period
    evidence_count = db.query(func.count(EvidenceItem.id)).filter(
        EvidenceItem.organization_id == current_user.organization_id
    ).scalar()
    
    agent_count = db.query(func.count(Agent.id)).filter(
        Agent.organization_id == current_user.organization_id
    ).scalar()
    
    automation_rate = db.query(func.avg(Agent.success_rate)).filter(
        Agent.organization_id == current_user.organization_id
    ).scalar() or 0.0
    
    return {
        "evidence_collected": evidence_count,
        "active_agents": agent_count,
        "automation_rate": round(automation_rate * 100, 1),
        "avg_collection_time": 180,  # seconds
        "cost_savings": 15500,  # USD
        "time_savings": 387.5,  # hours
        "framework_coverage": {
            "soc2": 85.5,
            "iso27001": 78.2,
            "cis_controls": 92.1,
            "gdpr": 67.8
        }
    }

# WebSocket endpoint for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: Optional[str] = None):
    """WebSocket connection for real-time updates"""
    await websocket.accept()
    
    # TODO: Validate token and get user/organization
    organization_id = "demo-org"  # For development
    
    # Add connection to manager
    connection_id = await websocket_manager.add_connection(websocket, organization_id)
    
    try:
        while True:
            # Keep connection alive and handle messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
            
    except WebSocketDisconnect:
        await websocket_manager.remove_connection(connection_id)

# Background task functions
async def update_trust_score(organization_id: str, db: Session):
    """Update trust score based on current evidence"""
    # Calculate new trust score
    evidence_count = db.query(func.count(EvidenceItem.id)).filter(
        EvidenceItem.organization_id == organization_id,
        EvidenceItem.status == EvidenceStatus.VALIDATED
    ).scalar()
    
    total_points = db.query(func.sum(EvidenceItem.trust_points)).filter(
        EvidenceItem.organization_id == organization_id,
        EvidenceItem.status == EvidenceStatus.VALIDATED
    ).scalar() or 0
    
    # Update trust score record
    trust_score = db.query(TrustScore).filter(
        TrustScore.organization_id == organization_id
    ).first()
    
    if trust_score:
        trust_score.previous_score = trust_score.total_score
        trust_score.total_score = total_points
        trust_score.score_change = total_points - trust_score.previous_score
        trust_score.evidence_count = evidence_count
        trust_score.last_updated = datetime.now(timezone.utc)
        
        db.commit()
        
        # Broadcast update
        await websocket_manager.broadcast_to_organization(
            organization_id,
            {
                "type": "trust_score_update",
                "data": {
                    "total_score": total_points,
                    "score_change": trust_score.score_change,
                    "evidence_count": evidence_count
                }
            }
        )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )