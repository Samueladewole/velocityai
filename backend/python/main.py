"""
ERIP Python Backend - High-Performance Computational Services
Optimized for mathematical operations, AI model serving, and data processing
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import uvicorn
import structlog
from contextlib import asynccontextmanager
import time

# Import service modules
from compass.router import router as compass_router
from atlas.router import router as atlas_router
from nexus.router import router as nexus_router
from beacon.router import router as beacon_router
from shared.integration_router import router as integration_router
from prism.monte_carlo import router as prism_router
from prism.risk_quantification import router as risk_router
from pulse.monitoring import router as pulse_router
from pulse.analytics import router as analytics_router
from cipher.policy_engine import router as cipher_router
from ai_models.model_server import router as ai_router
from shared.database import init_db, close_db
from shared.config import get_settings
from shared.auth import authenticate_user, create_auth_tokens, get_current_user, AuthTokens
from pydantic import BaseModel

# Configure structured logging
logger = structlog.get_logger()

# Pydantic models for authentication
class LoginRequest(BaseModel):
    email: str
    password: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup/shutdown events"""
    # Startup
    logger.info("Starting ERIP Python Backend")
    await init_db()
    logger.info("Database connection initialized")
    
    yield
    
    # Shutdown
    logger.info("Shutting down ERIP Python Backend")
    await close_db()

# Initialize FastAPI app with lifespan management
app = FastAPI(
    title="ERIP Python Backend",
    description="High-performance computational services for Enterprise Risk Intelligence Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Performance monitoring middleware
@app.middleware("http")
async def performance_monitoring(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        "request_processed",
        method=request.method,
        url=str(request.url),
        status_code=response.status_code,
        process_time=f"{process_time:.4f}s"
    )
    
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for load balancers"""
    return {
        "status": "healthy",
        "service": "erip-python-backend",
        "timestamp": time.time()
    }

@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "service": "ERIP Python Backend",
        "version": "1.0.0",
        "description": "High-performance computational services",
        "components": [
            "COMPASS - Regulatory Intelligence Engine",
            "ATLAS - Security Assessment System", 
            "NEXUS - Advanced Intelligence Platform",
            "BEACON - Value Demonstration Platform",
            "Cross-Component Integration Engine",
            "PRISM - Risk Quantification Engine",
            "PULSE - Real-time Analytics",
            "CIPHER - Policy Automation",
            "AI Models - Model Serving"
        ],
        "docs": "/docs"
    }

# Authentication endpoints
@app.post("/auth/login", response_model=AuthTokens)
async def login(request: LoginRequest):
    """Authenticate user and return JWT tokens"""
    try:
        user = await authenticate_user(request.email, request.password)
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
        
        tokens = create_auth_tokens(user)
        logger.info("User login successful", user_id=user["id"], email=user["email"])
        
        return tokens
        
    except Exception as e:
        logger.error("Login failed", error=str(e), email=request.email)
        raise HTTPException(
            status_code=500,
            detail="Authentication service error"
        )

@app.get("/auth/me")
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current user information"""
    return {
        "user_id": current_user.user_id,
        "email": current_user.email,
        "role": current_user.role,
        "permissions": current_user.permissions,
        "organization_id": current_user.organization_id
    }

# Include routers for each service
app.include_router(compass_router, prefix="/compass", tags=["COMPASS - Regulatory Intelligence"])
app.include_router(atlas_router, prefix="/atlas", tags=["ATLAS - Security Assessment"])
app.include_router(nexus_router, prefix="/nexus", tags=["NEXUS - Intelligence Platform"])
app.include_router(beacon_router, prefix="/beacon", tags=["BEACON - Value Demonstration"])
app.include_router(integration_router, prefix="/integration", tags=["Cross-Component Integration"])
app.include_router(prism_router, prefix="/prism", tags=["PRISM - Risk Quantification"])
app.include_router(risk_router, prefix="/risk", tags=["Risk Analysis"])
app.include_router(pulse_router, prefix="/pulse", tags=["PULSE - Monitoring"])
app.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
app.include_router(cipher_router, prefix="/cipher", tags=["CIPHER - Policy Engine"])
app.include_router(ai_router, prefix="/ai", tags=["AI Model Serving"])

# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error("unhandled_exception", exc_info=exc)
    return HTTPException(
        status_code=500,
        detail="Internal server error. Please try again later."
    )

if __name__ == "__main__":
    settings = get_settings()
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,  # Different port from TypeScript API
        reload=settings.debug,
        workers=1 if settings.debug else 4,
        log_level="info"
    )