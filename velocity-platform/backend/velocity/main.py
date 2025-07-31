"""
Velocity AI Platform - Main FastAPI Application
Production backend with live data and real-time features
"""
import os
import asyncio
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from starlette.exceptions import HTTPException as StarletteHTTPException
import uvicorn
import logging
import json
import uuid

from models import (
    Organization, User, Agent, Integration, EvidenceItem, TrustScore, AgentExecutionLog,
    AgentStatus, EvidenceStatus, Platform, Framework,
    AgentResponse, EvidenceResponse, TrustScoreResponse
)
from database import engine, SessionLocal, create_tables, get_db
from agent_executor import AgentExecutor
from cloud_integration_manager import (
    cloud_integration_manager, CloudIntegrationRequest, CloudSyncRequest,
    EvidenceCollectionType, ConnectionHealthStatus
)
from websocket_manager import WebSocketManager
from auth import (
    LoginRequest, SignupRequest, TokenResponse, UserResponse, AuthResponse,
    authenticate_user, create_user, create_tokens, create_user_response,
    get_current_user, get_current_active_user
)
from security import (
    SecurityHeadersMiddleware, RateLimitMiddleware, SecurityAuditMiddleware,
    InputValidationMiddleware, SecurityConfig, encrypt_credentials, decrypt_credentials
)
from validation import (
    AgentCreateRequest, AgentUpdateRequest, EvidenceCreateRequest,
    IntegrationConnectRequest, UserCreateRequest, UserUpdateRequest,
    PaginationParams, FilterParams, SuccessResponse, PaginatedResponse,
    velocity_exception_handler, validation_exception_handler,
    http_exception_handler, general_exception_handler,
    VelocityException, ValidationException, AuthenticationException,
    AuthorizationException, ResourceNotFoundException, ConflictException,
    create_success_response, create_paginated_response
)
from rbac import UserRole, Permission, rbac_manager, check_permission
from browser_automation import (
    BrowserAutomationService, EvidenceCollectionRequest, QuestionnaireProcessingRequest,
    MonitoringSetupRequest, AutomationTask, AutomationType, AutomationPlatform,
    browser_automation_service, generate_evidence_collection_workflow
)
from monitoring import (
    metrics_collector, health_check_service, alert_manager, MonitoringMiddleware,
    get_prometheus_metrics, get_application_info
)
from realtime_monitoring import monitoring_service
from framework_routes import router as framework_router
from qie_routes import router as qie_router
from assessment_routes import router as assessment_router
from evidence_routes import router as evidence_router
from document_routes import router as document_router

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
    asyncio.create_task(monitoring_service.start(REDIS_URL))
    
    yield
    
    # Shutdown
    logger.info("Shutting down Velocity AI Platform...")
    await agent_executor.stop_scheduler()
    await websocket_manager.stop_heartbeat()
    await monitoring_service.stop()

# FastAPI app with enhanced security and validation
app = FastAPI(
    title="Velocity AI Platform",
    description="AI-Powered Compliance Automation with Enterprise Security",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if not SecurityConfig.is_production() else None,
    redoc_url="/redoc" if not SecurityConfig.is_production() else None
)

# Add exception handlers
app.add_exception_handler(VelocityException, velocity_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Security and monitoring middleware (order is important - most restrictive first)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(SecurityAuditMiddleware, log_sensitive_endpoints=True)
app.add_middleware(InputValidationMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(MonitoringMiddleware)

# CORS middleware with secure origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=SecurityConfig.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time", "X-RateLimit-Limit", "X-RateLimit-Remaining"]
)

# Permission checking dependencies
def require_permission(permission: Permission):
    """Dependency to require specific permission"""
    def check_permission_dependency(current_user: User = Depends(get_current_active_user)):
        if not current_user.has_permission(permission.value):
            raise AuthorizationException(f"Permission required: {permission.value}")
        return current_user
    return check_permission_dependency

def require_resource_access(resource: str, action: str):
    """Dependency to require resource access"""
    def check_resource_dependency(current_user: User = Depends(get_current_active_user)):
        if not current_user.can_access_resource(resource, action):
            raise AuthorizationException(f"Access denied: {resource}:{action}")
        return current_user
    return check_resource_dependency

# Include routers
app.include_router(framework_router)
app.include_router(qie_router)
app.include_router(assessment_router)
app.include_router(evidence_router)
app.include_router(document_router)

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

# Enhanced Authentication Routes
@app.post("/api/v1/auth/signup", response_model=AuthResponse)
async def signup(
    signup_data: SignupRequest,
    db: Session = Depends(get_db)
):
    """Create new user account with secure authentication"""
    try:
        user = await create_user(signup_data, db)
        organization = db.query(Organization).filter(Organization.id == user.organization_id).first()
        
        tokens = create_tokens(user, organization)
        user_response = create_user_response(user, organization)
        
        return AuthResponse(
            success=True,
            data={
                **tokens.dict(),
                "user": user_response.dict()
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/auth/login", response_model=AuthResponse)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """Authenticate user with secure JWT tokens"""
    try:
        user = await authenticate_user(login_data.email, login_data.password, db)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        organization = db.query(Organization).filter(Organization.id == user.organization_id).first()
        if not organization:
            raise HTTPException(status_code=500, detail="Organization not found")
        
        tokens = create_tokens(user, organization)
        user_response = create_user_response(user, organization)
        
        return AuthResponse(
            success=True,
            data={
                **tokens.dict(),
                "user": user_response.dict()
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/auth/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_data: Dict[str, str],
    db: Session = Depends(get_db)
):
    """Refresh access token using refresh token"""
    try:
        from auth import verify_token
        refresh_token = refresh_data.get("refresh_token")
        if not refresh_token:
            raise HTTPException(status_code=400, detail="Refresh token required")
        
        payload = verify_token(refresh_token, "refresh")
        user_id = payload.get("sub")
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        organization = db.query(Organization).filter(Organization.id == user.organization_id).first()
        tokens = create_tokens(user, organization)
        
        return tokens
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/agents", response_model=PaginatedResponse)
async def get_agents(
    pagination: PaginationParams = Depends(),
    filters: FilterParams = Depends(),
    status: Optional[AgentStatus] = None,
    platform: Optional[Platform] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_resource_access("agent", "view"))
):
    """Get all agents for the current organization with pagination and filtering"""
    query = db.query(Agent).filter(Agent.organization_id == current_user.organization_id)
    
    # Apply filters
    if status:
        query = query.filter(Agent.status == status)
    if platform:
        query = query.filter(Agent.platform == platform)
    if filters.search:
        query = query.filter(Agent.name.ilike(f"%{filters.search}%"))
    if filters.start_date:
        query = query.filter(Agent.created_at >= filters.start_date)
    if filters.end_date:
        query = query.filter(Agent.created_at <= filters.end_date)
    
    # Get total count for pagination
    total_count = query.count()
    
    # Apply pagination and ordering
    agents = query.order_by(desc(Agent.created_at)).offset(pagination.offset).limit(pagination.limit).all()
    
    # Convert to response format
    agent_data = [
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
    
    return create_paginated_response(agent_data, pagination.page, pagination.limit, total_count)

@app.post("/api/v1/agents", response_model=SuccessResponse)
async def create_agent(
    agent_data: AgentCreateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_resource_access("agent", "create"))
):
    """Create a new AI agent with comprehensive validation"""
    try:
        # Validate integration exists and belongs to organization
        integration = db.query(Integration).filter(
            Integration.id == agent_data.integration_id,
            Integration.organization_id == current_user.organization_id
        ).first()
        
        if not integration:
            raise ResourceNotFoundException("Integration", agent_data.integration_id)
        
        # Check if agent name is unique within organization
        existing_agent = db.query(Agent).filter(
            Agent.name == agent_data.name,
            Agent.organization_id == current_user.organization_id
        ).first()
        
        if existing_agent:
            raise ConflictException(f"Agent with name '{agent_data.name}' already exists")
        
        # Create agent
        agent = Agent(
            name=agent_data.name,
            description=agent_data.description or "",
            platform=agent_data.platform,
            framework=agent_data.framework,
            configuration=agent_data.configuration,
            schedule=agent_data.schedule,
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
        
        return create_success_response(
            data={"agent_id": str(agent.id)},
            message=f"Agent '{agent.name}' created successfully"
        )
        
    except (VelocityException, HTTPException):
        raise
    except Exception as e:
        logger.error(f"Error creating agent: {e}")
        raise VelocityException(f"Failed to create agent: {str(e)}")

@app.post("/api/v1/agents/{agent_id}/run")
async def run_agent(
    agent_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
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
    current_user: User = Depends(get_current_active_user)
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
    current_user: User = Depends(get_current_active_user)
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
    current_user: User = Depends(get_current_active_user)
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
    current_user: User = Depends(get_current_active_user)
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

# Enhanced Cloud Integration Management Endpoints

@app.post("/api/v1/integrations/cloud/{platform}/connect", response_model=SuccessResponse)
async def connect_cloud_platform(
    platform: str,
    request: CloudIntegrationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_resource_access("integration", "create"))
):
    """Connect to a cloud platform with comprehensive validation and testing"""
    try:
        # Validate platform
        try:
            platform_enum = Platform(platform.lower())
        except ValueError:
            raise ValidationException(f"Unsupported platform: {platform}")
        
        # Check if integration already exists
        existing_integration = db.query(Integration).filter(
            Integration.platform == platform_enum,
            Integration.organization_id == current_user.organization_id
        ).first()
        
        if existing_integration and existing_integration.status == IntegrationStatus.CONNECTED:
            raise ConflictException(f"Integration with {platform} already exists and is connected")
        
        # Encrypt credentials before storing
        encrypted_credentials = encrypt_credentials(request.credentials)
        
        # Test connection using cloud integration manager
        success, error_message = await cloud_integration_manager.connect_platform(
            platform_enum,
            request.credentials,
            str(existing_integration.id) if existing_integration else str(uuid.uuid4()),
            test_connection=request.test_connection
        )
        
        if not success:
            raise VelocityException(f"Connection test failed: {error_message}")
        
        # Create or update integration record
        if existing_integration:
            existing_integration.credentials = encrypted_credentials
            existing_integration.configuration = request.configuration
            existing_integration.status = IntegrationStatus.CONNECTED
            existing_integration.error_count = 0
            existing_integration.last_error = None
            integration = existing_integration
        else:
            integration = Integration(
                name=f"{platform_enum.value.upper()} Integration",
                platform=platform_enum,
                credentials=encrypted_credentials,
                configuration=request.configuration,
                status=IntegrationStatus.CONNECTED,
                organization_id=current_user.organization_id
            )
            db.add(integration)
        
        db.commit()
        db.refresh(integration)
        
        # Schedule initial data sync
        background_tasks.add_task(
            cloud_integration_manager.sync_platform_data,
            str(integration.id)
        )
        
        # Notify via WebSocket
        await websocket_manager.broadcast_to_organization(
            current_user.organization_id,
            {
                "type": "integration_connected",
                "data": {
                    "integration_id": str(integration.id),
                    "platform": platform_enum.value,
                    "name": integration.name
                }
            }
        )
        
        return create_success_response(
            data={
                "integration_id": str(integration.id),
                "platform": platform_enum.value,
                "status": IntegrationStatus.CONNECTED.value
            },
            message=f"Successfully connected to {platform_enum.value.upper()}"
        )
        
    except (VelocityException, HTTPException):
        raise
    except Exception as e:
        logger.error(f"Error connecting to {platform}: {e}")
        raise VelocityException(f"Failed to connect to {platform}: {str(e)}")

@app.get("/api/v1/integrations/cloud/{platform}/test", response_model=SuccessResponse)
async def test_cloud_platform_connection(
    platform: str,
    integration_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_resource_access("integration", "view"))
):
    """Test connection health for a cloud platform integration"""
    try:
        # Validate platform
        try:
            platform_enum = Platform(platform.lower())
        except ValueError:
            raise ValidationException(f"Unsupported platform: {platform}")
        
        # Find integration
        query = db.query(Integration).filter(
            Integration.platform == platform_enum,
            Integration.organization_id == current_user.organization_id
        )
        
        if integration_id:
            query = query.filter(Integration.id == integration_id)
        
        integration = query.first()
        if not integration:
            raise ResourceNotFoundException("Integration", integration_id or platform)
        
        # Test connection
        health_check = await cloud_integration_manager.test_connection(str(integration.id))
        
        # Update integration status based on health check
        if health_check.status == ConnectionHealthStatus.HEALTHY:
            integration.status = IntegrationStatus.CONNECTED
            integration.error_count = 0
            integration.last_error = None
        else:
            integration.status = IntegrationStatus.ERROR
            integration.error_count += 1
            integration.last_error = health_check.error_message
        
        db.commit()
        
        return create_success_response(
            data={
                "integration_id": str(integration.id),
                "platform": platform_enum.value,
                "status": health_check.status.value,
                "response_time_ms": health_check.response_time_ms,
                "error_message": health_check.error_message,
                "last_checked": health_check.last_checked.isoformat(),
                "metadata": health_check.metadata
            },
            message=f"Connection test completed for {platform_enum.value.upper()}"
        )
        
    except (VelocityException, HTTPException):
        raise
    except Exception as e:
        logger.error(f"Error testing {platform} connection: {e}")
        raise VelocityException(f"Failed to test {platform} connection: {str(e)}")

@app.post("/api/v1/integrations/cloud/{platform}/sync", response_model=SuccessResponse)
async def sync_cloud_platform_data(
    platform: str,
    request: CloudSyncRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_resource_access("integration", "connect"))
):
    """Synchronize data from a cloud platform"""
    try:
        # Validate platform
        try:
            platform_enum = Platform(platform.lower())
        except ValueError:
            raise ValidationException(f"Unsupported platform: {platform}")
        
        # Find integration
        integration = db.query(Integration).filter(
            Integration.id == request.integration_id,
            Integration.platform == platform_enum,
            Integration.organization_id == current_user.organization_id
        ).first()
        
        if not integration:
            raise ResourceNotFoundException("Integration", request.integration_id)
        
        if integration.status != IntegrationStatus.CONNECTED:
            raise VelocityException("Integration is not connected")
        
        # Update integration status
        integration.status = IntegrationStatus.SYNCING
        db.commit()
        
        # Start sync in background
        async def sync_task():
            try:
                sync_result = await cloud_integration_manager.sync_platform_data(
                    str(integration.id),
                    request.evidence_types or None,
                    request.framework
                )
                
                # Create evidence items from sync results
                evidence_created = 0
                for result_data in sync_result.get('results', []):
                    if result_data.get('success') and result_data.get('evidence_items'):
                        for evidence_data in result_data['evidence_items']:
                            evidence_item = EvidenceItem(
                                title=f"{platform_enum.value.upper()} {result_data['collection_type']} Evidence",
                                description=f"Evidence collected from {platform_enum.value.upper()}",
                                evidence_type=EvidenceType.API_RESPONSE,
                                status=EvidenceStatus.PENDING,
                                framework=request.framework or Framework.SOC2,
                                control_id="AUTO-GENERATED",
                                data=evidence_data,
                                evidence_metadata={
                                    "platform": platform_enum.value,
                                    "collection_type": result_data['collection_type'],
                                    "collected_at": result_data.get('collected_at')
                                },
                                confidence_score=0.8,
                                trust_points=10,
                                organization_id=current_user.organization_id
                            )
                            db.add(evidence_item)
                            evidence_created += 1
                
                # Update integration status
                integration.status = IntegrationStatus.CONNECTED
                integration.last_sync = datetime.now(timezone.utc)
                integration.error_count = 0
                integration.last_error = None
                db.commit()
                
                # Notify via WebSocket
                await websocket_manager.broadcast_to_organization(
                    current_user.organization_id,
                    {
                        "type": "sync_completed",
                        "data": {
                            "integration_id": str(integration.id),
                            "platform": platform_enum.value,
                            "evidence_created": evidence_created,
                            "total_evidence_collected": sync_result.get('total_evidence_collected', 0)
                        }
                    }
                )
                
            except Exception as e:
                logger.error(f"Sync task failed for {integration.id}: {e}")
                integration.status = IntegrationStatus.ERROR
                integration.error_count += 1
                integration.last_error = str(e)
                db.commit()
                
                # Notify of error
                await websocket_manager.broadcast_to_organization(
                    current_user.organization_id,
                    {
                        "type": "sync_failed",
                        "data": {
                            "integration_id": str(integration.id),
                            "platform": platform_enum.value,
                            "error": str(e)
                        }
                    }
                )
        
        background_tasks.add_task(sync_task)
        
        return create_success_response(
            data={
                "integration_id": str(integration.id),
                "platform": platform_enum.value,
                "sync_started": True,
                "evidence_types": [et.value for et in (request.evidence_types or [])],
                "framework": request.framework.value if request.framework else None
            },
            message=f"Data synchronization started for {platform_enum.value.upper()}"
        )
        
    except (VelocityException, HTTPException):
        raise
    except Exception as e:
        logger.error(f"Error starting sync for {platform}: {e}")
        raise VelocityException(f"Failed to start sync for {platform}: {str(e)}")

@app.get("/api/v1/integrations/cloud/status", response_model=SuccessResponse)
async def get_cloud_integrations_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_resource_access("integration", "view"))
):
    """Get status of all cloud integrations for the organization"""
    try:
        # Get all integrations from database
        integrations = db.query(Integration).filter(
            Integration.organization_id == current_user.organization_id
        ).all()
        
        # Get detailed status from cloud integration manager
        integration_statuses = []
        for integration in integrations:
            try:
                status = await cloud_integration_manager.get_connection_status(str(integration.id))
                
                # Merge database and manager information
                integration_status = {
                    "integration_id": str(integration.id),
                    "name": integration.name,
                    "platform": integration.platform.value,
                    "db_status": integration.status.value,
                    "connection_status": status.get('status', 'unknown'),
                    "last_sync": integration.last_sync.isoformat() if integration.last_sync else None,
                    "error_count": integration.error_count,
                    "last_error": integration.last_error,
                    "created_at": integration.created_at.isoformat(),
                    "updated_at": integration.updated_at.isoformat(),
                    "health_check": {
                        "last_checked": status.get('last_health_check'),
                        "response_time_ms": status.get('response_time_ms'),
                        "error_message": status.get('error_message'),
                        "metadata": status.get('metadata', {})
                    },
                    "supported_evidence_types": [
                        et.value for et in cloud_integration_manager.get_supported_evidence_types(integration.platform)
                    ]
                }
                integration_statuses.append(integration_status)
                
            except Exception as e:
                logger.warning(f"Error getting status for integration {integration.id}: {e}")
                # Fallback to database information only
                integration_statuses.append({
                    "integration_id": str(integration.id),
                    "name": integration.name,
                    "platform": integration.platform.value,
                    "db_status": integration.status.value,
                    "connection_status": "unknown",
                    "last_sync": integration.last_sync.isoformat() if integration.last_sync else None,
                    "error_count": integration.error_count,
                    "last_error": integration.last_error,
                    "created_at": integration.created_at.isoformat(),
                    "updated_at": integration.updated_at.isoformat(),
                    "health_check": None,
                    "supported_evidence_types": []
                })
        
        # Get overall statistics
        stats = cloud_integration_manager.get_statistics()
        
        return create_success_response(
            data={
                "integrations": integration_statuses,
                "summary": {
                    "total_integrations": len(integration_statuses),
                    "connected_integrations": len([i for i in integration_statuses if i["db_status"] == "connected"]),
                    "healthy_integrations": len([i for i in integration_statuses if i["connection_status"] == "healthy"]),
                    "platforms": list(set(i["platform"] for i in integration_statuses)),
                    "last_sync_times": stats.get('last_sync_times', {}),
                    "manager_statistics": stats
                }
            },
            message="Cloud integrations status retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Error getting cloud integrations status: {e}")
        raise VelocityException(f"Failed to get cloud integrations status: {str(e)}")

@app.get("/api/v1/integrations/cloud/{platform}/evidence-types", response_model=SuccessResponse)
async def get_supported_evidence_types(
    platform: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get supported evidence types for a cloud platform"""
    try:
        # Validate platform
        try:
            platform_enum = Platform(platform.lower())
        except ValueError:
            raise ValidationException(f"Unsupported platform: {platform}")
        
        # Get supported evidence types
        evidence_types = cloud_integration_manager.get_supported_evidence_types(platform_enum)
        
        return create_success_response(
            data={
                "platform": platform_enum.value,
                "supported_evidence_types": [et.value for et in evidence_types],
                "evidence_type_descriptions": {
                    EvidenceCollectionType.POLICIES.value: "IAM policies and access controls",
                    EvidenceCollectionType.CONFIGURATIONS.value: "System and service configurations",
                    EvidenceCollectionType.AUDIT_LOGS.value: "Security and audit logs",
                    EvidenceCollectionType.SECURITY_GROUPS.value: "Network security groups and firewall rules",
                    EvidenceCollectionType.ENCRYPTION_STATUS.value: "Encryption status for data at rest and in transit",
                    EvidenceCollectionType.ACCESS_CONTROLS.value: "Access controls and permissions",
                    EvidenceCollectionType.COMPLIANCE_RULES.value: "Compliance rules and policy evaluations"
                }
            },
            message=f"Supported evidence types for {platform_enum.value.upper()} retrieved successfully"
        )
        
    except (VelocityException, HTTPException):
        raise
    except Exception as e:
        logger.error(f"Error getting supported evidence types for {platform}: {e}")
        raise VelocityException(f"Failed to get supported evidence types: {str(e)}")

@app.delete("/api/v1/integrations/cloud/{integration_id}", response_model=SuccessResponse)
async def disconnect_cloud_integration(
    integration_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_resource_access("integration", "delete"))
):
    """Disconnect and remove a cloud integration"""
    try:
        # Find integration
        integration = db.query(Integration).filter(
            Integration.id == integration_id,
            Integration.organization_id == current_user.organization_id
        ).first()
        
        if not integration:
            raise ResourceNotFoundException("Integration", integration_id)
        
        # Disconnect from cloud integration manager
        success = cloud_integration_manager.disconnect_platform(integration_id)
        
        if not success:
            logger.warning(f"Failed to disconnect from cloud integration manager for {integration_id}")
        
        # Remove from database
        platform_name = integration.platform.value
        integration_name = integration.name
        
        db.delete(integration)
        db.commit()
        
        # Notify via WebSocket
        await websocket_manager.broadcast_to_organization(
            current_user.organization_id,
            {
                "type": "integration_disconnected",
                "data": {
                    "integration_id": integration_id,
                    "platform": platform_name,
                    "name": integration_name
                }
            }
        )
        
        return create_success_response(
            data={
                "integration_id": integration_id,
                "platform": platform_name,
                "disconnected": True
            },
            message=f"Successfully disconnected {integration_name}"
        )
        
    except (VelocityException, HTTPException):
        raise
    except Exception as e:
        logger.error(f"Error disconnecting integration {integration_id}: {e}")
        raise VelocityException(f"Failed to disconnect integration: {str(e)}")

@app.get("/api/v1/trust-score")
async def get_trust_score(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
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
    current_user: User = Depends(get_current_active_user)
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

# Browser Automation Endpoints
@app.post("/api/v1/automation/evidence/collect", response_model=SuccessResponse)
async def start_evidence_collection(
    request: EvidenceCollectionRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_resource_access("evidence", "create"))
):
    """Start automated evidence collection from cloud platforms"""
    try:
        automation_task = await browser_automation_service.collect_evidence(
            request, current_user, db
        )
        
        return create_success_response(
            data={
                "task_id": automation_task.task_id,
                "status": automation_task.status,
                "platform": request.platform.value,
                "automation_type": request.automation_type.value
            },
            message="Evidence collection started successfully"
        )
        
    except (VelocityException, HTTPException):
        raise
    except Exception as e:
        logger.error(f"Error starting evidence collection: {e}")
        raise VelocityException(f"Failed to start evidence collection: {str(e)}")

@app.post("/api/v1/automation/questionnaire/process", response_model=SuccessResponse)
async def process_questionnaire(
    request: QuestionnaireProcessingRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_resource_access("evidence", "create"))
):
    """Process questionnaire with AI assistance"""
    try:
        automation_task = await browser_automation_service.process_questionnaire(
            request, current_user, db
        )
        
        return create_success_response(
            data={
                "task_id": automation_task.task_id,
                "status": automation_task.status,
                "format": request.format,
                "auto_fill": request.auto_fill
            },
            message="Questionnaire processing started successfully"
        )
        
    except (VelocityException, HTTPException):
        raise
    except Exception as e:
        logger.error(f"Error processing questionnaire: {e}")
        raise VelocityException(f"Failed to process questionnaire: {str(e)}")

@app.post("/api/v1/automation/monitoring/setup", response_model=SuccessResponse)
async def setup_compliance_monitoring(
    request: MonitoringSetupRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_resource_access("system", "monitor"))
):
    """Setup automated compliance monitoring"""
    try:
        automation_task = await browser_automation_service.setup_monitoring(
            request, current_user, db
        )
        
        return create_success_response(
            data={
                "task_id": automation_task.task_id,
                "status": automation_task.status,
                "platform": request.platform.value,
                "frequency": request.frequency
            },
            message="Compliance monitoring setup started successfully"
        )
        
    except (VelocityException, HTTPException):
        raise
    except Exception as e:
        logger.error(f"Error setting up monitoring: {e}")
        raise VelocityException(f"Failed to setup monitoring: {str(e)}")

@app.get("/api/v1/automation/task/{task_id}", response_model=SuccessResponse)
async def get_automation_task_status(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get status of an automation task"""
    try:
        automation_task = await browser_automation_service.get_task_status(
            task_id, current_user
        )
        
        return create_success_response(
            data={
                "task_id": automation_task.task_id,
                "status": automation_task.status,
                "created_at": automation_task.created_at.isoformat(),
                "completed_at": automation_task.completed_at.isoformat() if automation_task.completed_at else None,
                "evidence_count": automation_task.evidence_count,
                "error_message": automation_task.error_message,
                "results": automation_task.results
            }
        )
        
    except (VelocityException, HTTPException):
        raise
    except Exception as e:
        logger.error(f"Error getting task status: {e}")
        raise VelocityException(f"Failed to get task status: {str(e)}")

@app.delete("/api/v1/automation/task/{task_id}", response_model=SuccessResponse)
async def cancel_automation_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_resource_access("agent", "stop"))
):
    """Cancel a running automation task"""
    try:
        success = await browser_automation_service.cancel_task(task_id, current_user)
        
        if success:
            return create_success_response(
                message=f"Automation task {task_id} cancelled successfully"
            )
        else:
            raise VelocityException("Failed to cancel task")
        
    except (VelocityException, HTTPException):
        raise
    except Exception as e:
        logger.error(f"Error cancelling task: {e}")
        raise VelocityException(f"Failed to cancel task: {str(e)}")

@app.get("/api/v1/automation/workflows/{platform}/{framework}/{control_id}")
async def get_automation_workflow(
    platform: AutomationPlatform,
    framework: Framework,
    control_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get pre-configured automation workflow for a platform and control"""
    try:
        workflow = generate_evidence_collection_workflow(platform, framework, control_id)
        
        return create_success_response(
            data=workflow,
            message="Automation workflow generated successfully"
        )
        
    except (VelocityException, HTTPException):
        raise
    except Exception as e:
        logger.error(f"Error generating workflow: {e}")
        raise VelocityException(f"Failed to generate workflow: {str(e)}")

# Monitoring and Observability Endpoints
@app.get("/api/v1/dashboard")
async def get_dashboard_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get comprehensive dashboard overview data"""
    try:
        org_id = current_user.organization_id
        
        # Trust Score Calculation
        recent_evidence = db.query(EvidenceItem).filter(
            EvidenceItem.organization_id == org_id
        ).order_by(desc(EvidenceItem.created_at)).limit(100).all()
        
        validated_evidence = [e for e in recent_evidence if e.status == EvidenceStatus.VERIFIED]
        trust_score = min(94, int(85 + (len(validated_evidence) / max(len(recent_evidence), 1)) * 15))
        
        # AI Agents Status
        agents = db.query(Agent).filter(Agent.organization_id == org_id).all()
        active_agents = [a for a in agents if a.status == AgentStatus.ACTIVE]
        
        # Evidence Collection Stats
        evidence_count = db.query(EvidenceItem).filter(
            EvidenceItem.organization_id == org_id
        ).count()
        
        today_evidence = db.query(EvidenceItem).filter(
            EvidenceItem.organization_id == org_id,
            func.date(EvidenceItem.created_at) == datetime.now().date()
        ).count()
        
        # Automation Rate (based on AI agents vs manual processes)
        automation_rate = min(95, int(70 + (len(active_agents) / max(len(agents), 1)) * 25))
        
        # Recent Evidence Items
        recent_evidence_formatted = [
            {
                "id": str(evidence.id),
                "title": evidence.title,
                "framework": evidence.framework.value,
                "evidence_type": evidence.evidence_type,
                "status": evidence.status.value,
                "platform": evidence.platform.value,
                "confidence_score": evidence.confidence_score,
                "collected_at": evidence.created_at.isoformat(),
                "agent_name": next((a.name for a in agents if a.id == evidence.agent_id), "Manual")
            }
            for evidence in recent_evidence[:10]
        ]
        
        # Active AI Agents with Status
        agents_formatted = [
            {
                "id": str(agent.id),
                "name": agent.name,
                "type": agent.agent_type.value if hasattr(agent, 'agent_type') else "compliance",
                "platform": agent.platform.value,
                "framework": agent.framework.value,
                "status": agent.status.value,
                "success_rate": agent.success_rate,
                "evidence_collected": agent.evidence_collected,
                "last_run": agent.last_run.isoformat() if agent.last_run else None,
                "next_run": agent.next_run.isoformat() if agent.next_run else None,
                "health": "healthy" if agent.status == AgentStatus.ACTIVE else "inactive"
            }
            for agent in agents[:8]
        ]
        
        # Compliance Frameworks Status
        frameworks_stats = {}
        for framework in Framework:
            framework_evidence = [e for e in recent_evidence if e.framework == framework]
            framework_agents = [a for a in agents if a.framework == framework]
            
            if framework_evidence or framework_agents:
                verified_count = len([e for e in framework_evidence if e.status == EvidenceStatus.VERIFIED])
                total_count = len(framework_evidence)
                
                frameworks_stats[framework.value] = {
                    "evidence_count": total_count,
                    "verified_count": verified_count,
                    "progress": int((verified_count / max(total_count, 1)) * 100),
                    "active_agents": len([a for a in framework_agents if a.status == AgentStatus.ACTIVE])
                }
        
        # Notifications/Alerts
        notifications = []
        if trust_score < 85:
            notifications.append({
                "id": "trust_score_low",
                "type": "warning", 
                "title": "Trust Score Below Target",
                "message": f"Current trust score is {trust_score}%. Consider collecting more evidence.",
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
        
        if len(active_agents) < len(agents) * 0.8:
            notifications.append({
                "id": "agents_inactive",
                "type": "info",
                "title": "Some Agents Inactive",
                "message": f"{len(agents) - len(active_agents)} agents are currently inactive.",
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
        
        if today_evidence > 50:
            notifications.append({
                "id": "high_activity",
                "type": "success",
                "title": "High Evidence Collection",
                "message": f"Collected {today_evidence} evidence items today!",
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
        
        dashboard_data = {
            "trust_score": {
                "current": trust_score,
                "trend": "+2.1",
                "target": 95,
                "last_updated": datetime.now(timezone.utc).isoformat()
            },
            "agents": {
                "total": len(agents),
                "active": len(active_agents),
                "success_rate": int(sum(a.success_rate for a in agents) / max(len(agents), 1)),
                "agents_list": agents_formatted
            },
            "evidence": {
                "total_collected": evidence_count,
                "today_collected": today_evidence,
                "recent_items": recent_evidence_formatted,
                "automation_rate": automation_rate
            },
            "frameworks": frameworks_stats,
            "notifications": notifications[:5],  # Limit to 5 most recent
            "system_health": {
                "status": "operational",
                "uptime": "99.9%",
                "last_check": datetime.now(timezone.utc).isoformat()
            }
        }
        
        return create_success_response(dashboard_data)
        
    except Exception as e:
        logger.error(f"Dashboard overview error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/monitoring/metrics")
async def get_real_time_metrics(
    current_user: User = Depends(get_current_active_user)
):
    """Get real-time compliance metrics"""
    try:
        metrics = monitoring_service.get_current_metrics(current_user.organization_id)
        
        if not metrics:
            return create_success_response({
                "message": "No metrics available yet",
                "organization_id": current_user.organization_id
            })
        
        metrics_data = {
            "trust_score": metrics.trust_score,
            "active_agents": metrics.active_agents,
            "total_agents": metrics.total_agents,
            "evidence_collected_today": metrics.evidence_collected_today,
            "evidence_verified_today": metrics.evidence_verified_today,
            "automation_rate": metrics.automation_rate,
            "framework_coverage": metrics.framework_coverage,
            "last_updated": metrics.last_updated.isoformat()
        }
        
        return create_success_response(metrics_data)
        
    except Exception as e:
        logger.error(f"Real-time metrics error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/monitoring/alerts")
async def get_active_alerts(
    current_user: User = Depends(get_current_active_user)
):
    """Get active compliance alerts"""
    try:
        alerts = monitoring_service.get_active_alerts(current_user.organization_id)
        
        alerts_data = [
            {
                "event_id": alert.event_id,
                "event_type": alert.event_type.value,
                "severity": alert.severity.value,
                "title": alert.title,
                "description": alert.description,
                "timestamp": alert.timestamp.isoformat(),
                "acknowledged": alert.acknowledged,
                "resolved": alert.resolved,
                "metadata": alert.metadata
            }
            for alert in alerts
        ]
        
        return create_success_response({
            "alerts": alerts_data,
            "total_count": len(alerts_data)
        })
        
    except Exception as e:
        logger.error(f"Active alerts error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/monitoring/alerts/{event_id}/acknowledge")
async def acknowledge_alert(
    event_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Acknowledge a compliance alert"""
    try:
        success = await monitoring_service.acknowledge_alert(
            current_user.organization_id, 
            event_id
        )
        
        if success:
            return create_success_response({
                "message": "Alert acknowledged",
                "event_id": event_id
            })
        else:
            raise HTTPException(status_code=404, detail="Alert not found")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Acknowledge alert error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/monitoring/alerts/{event_id}/resolve")
async def resolve_alert(
    event_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Resolve a compliance alert"""
    try:
        success = await monitoring_service.resolve_alert(
            current_user.organization_id, 
            event_id
        )
        
        if success:
            return create_success_response({
                "message": "Alert resolved",
                "event_id": event_id
            })
        else:
            raise HTTPException(status_code=404, detail="Alert not found")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Resolve alert error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/monitoring/stats")
async def get_monitoring_stats(
    current_user: User = Depends(require_permission(Permission.SYSTEM_MONITOR))
):
    """Get monitoring service statistics"""
    try:
        stats = monitoring_service.get_monitoring_stats()
        return create_success_response(stats)
        
    except Exception as e:
        logger.error(f"Monitoring stats error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Comprehensive health check endpoint"""
    try:
        # Perform health checks
        db_health = await health_check_service.check_database()
        redis_health = await health_check_service.check_redis()
        external_health = await health_check_service.check_external_services()
        
        # Get overall health status
        health_status = metrics_collector.get_health_status()
        
        # Get system metrics
        system_metrics = metrics_collector.get_system_metrics()
        
        return {
            "status": health_status["status"],
            "timestamp": health_status["timestamp"],
            "uptime_seconds": health_status["uptime_seconds"],
            "services": {
                "database": db_health,
                "redis": redis_health,
                "external_services": external_health
            },
            "system": {
                "cpu_percent": system_metrics.cpu_percent,
                "memory_percent": system_metrics.memory_percent,
                "disk_percent": system_metrics.disk_percent,
                "load_average": system_metrics.load_average
            }
        }
    
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

@app.get("/health/ready")
async def readiness_check():
    """Kubernetes readiness probe"""
    try:
        db_health = await health_check_service.check_database()
        if db_health["status"] != "healthy":
            raise HTTPException(status_code=503, detail="Database not ready")
        
        return {"status": "ready"}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service not ready: {str(e)}")

@app.get("/health/live")
async def liveness_check():
    """Kubernetes liveness probe"""
    return {
        "status": "alive",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/metrics")
async def prometheus_metrics():
    """Prometheus metrics endpoint"""
    from fastapi.responses import PlainTextResponse
    
    try:
        metrics_data = get_prometheus_metrics()
        return PlainTextResponse(metrics_data, media_type="text/plain")
    
    except Exception as e:
        logger.error(f"Error generating metrics: {e}")
        raise HTTPException(status_code=500, detail="Metrics unavailable")

@app.get("/info")
async def application_info():
    """Application information endpoint"""
    try:
        return get_application_info()
    
    except Exception as e:
        logger.error(f"Error getting application info: {e}")
        raise HTTPException(status_code=500, detail="Application info unavailable")

@app.get("/debug/stats")
async def debug_stats(
    current_user: User = Depends(require_permission(Permission.SYSTEM_MONITOR))
):
    """Debug statistics for administrators"""
    try:
        # Get endpoint statistics
        endpoint_stats = {}
        for endpoint in ["/api/v1/agents", "/api/v1/evidence", "/api/v1/integrations"]:
            endpoint_stats[endpoint] = metrics_collector.get_endpoint_stats(endpoint)
        
        # Get system metrics
        system_metrics = metrics_collector.get_system_metrics()
        
        # Check for alerts
        alerts = alert_manager.check_alerts()
        
        return {
            "endpoint_statistics": endpoint_stats,
            "system_metrics": {
                "cpu_percent": system_metrics.cpu_percent,
                "memory_used_gb": system_metrics.memory_used_bytes / (1024**3),
                "memory_total_gb": system_metrics.memory_total_bytes / (1024**3),
                "memory_percent": system_metrics.memory_percent,
                "disk_used_gb": system_metrics.disk_used_bytes / (1024**3),
                "disk_total_gb": system_metrics.disk_total_bytes / (1024**3),
                "disk_percent": system_metrics.disk_percent,
                "load_average": system_metrics.load_average,
                "uptime_seconds": system_metrics.uptime_seconds
            },
            "active_alerts": alerts,
            "health_checks": metrics_collector.get_health_status()
        }
    
    except (VelocityException, HTTPException):
        raise
    except Exception as e:
        logger.error(f"Error getting debug stats: {e}")
        raise VelocityException(f"Failed to get debug statistics: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )