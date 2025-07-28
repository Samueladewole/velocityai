"""
Simple Velocity Backend - Direct connections to avoid caching issues
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import asyncpg
import structlog
import os
from datetime import datetime, timedelta
import jwt
import hashlib
import uuid
import json

# Configure logging
logger = structlog.get_logger()

# JWT Configuration
JWT_SECRET = "velocity-ai-platform-secret-key"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Database Configuration
DATABASE_URL = "postgresql://macbook@localhost:5432/velocity"

# Security
security = HTTPBearer()

app = FastAPI(
    title="Velocity AI Platform API",
    description="Simple backend for customer testing",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://velocity.eripapp.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    company: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AgentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    platform: str
    framework: str
    automation_level: float = 75.0

# Utility functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_access_token(user_data: dict) -> str:
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode = {"exp": expire, **user_data}
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user_id, "email": payload.get("email")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# API Routes
@app.post("/auth/signup")
async def signup(user: UserCreate):
    """User registration"""
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        # Check if user already exists
        existing = await conn.fetchrow("SELECT id FROM users WHERE email = $1", user.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user
        hashed_password = hash_password(user.password)
        user_id = await conn.fetchval("""
            INSERT INTO users (email, hashed_password, first_name, last_name, company)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        """, user.email, hashed_password, user.first_name, user.last_name, user.company)
        
        # Create access token
        token = create_access_token({
            "user_id": str(user_id),
            "email": user.email,
            "name": f"{user.first_name} {user.last_name}"
        })
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": str(user_id),
                "email": user.email,
                "name": f"{user.first_name} {user.last_name}",
                "company": user.company
            }
        }
    finally:
        await conn.close()

@app.post("/auth/login")
async def login(credentials: UserLogin):
    """User login"""
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        user = await conn.fetchrow("""
            SELECT id, email, hashed_password, first_name, last_name, company
            FROM users WHERE email = $1 AND is_active = TRUE
        """, credentials.email)
        
        if not user or not verify_password(credentials.password, user['hashed_password']):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Create access token
        token = create_access_token({
            "user_id": str(user['id']),
            "email": user['email'],
            "name": f"{user['first_name']} {user['last_name']}"
        })
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": str(user['id']),
                "email": user['email'],
                "name": f"{user['first_name']} {user['last_name']}",
                "company": user['company']
            }
        }
    finally:
        await conn.close()

@app.get("/auth/me")
async def get_me(current_user = Depends(get_current_user)):
    """Get current user profile"""
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        user = await conn.fetchrow("""
            SELECT id, email, first_name, last_name, company, created_at
            FROM users WHERE id = $1
        """, uuid.UUID(current_user["user_id"]))
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": str(user['id']),
            "email": user['email'],
            "name": f"{user['first_name']} {user['last_name']}",
            "company": user['company'],
            "created_at": user['created_at']
        }
    finally:
        await conn.close()

@app.post("/agents")
async def create_agent(agent: AgentCreate, current_user = Depends(get_current_user)):
    """Create a new compliance agent"""
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        agent_id = await conn.fetchval("""
            INSERT INTO agents (user_id, name, description, platform, framework, automation_level)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        """, uuid.UUID(current_user["user_id"]), agent.name, agent.description, 
            agent.platform, agent.framework, agent.automation_level)
        
        # Generate some mock evidence for demonstration
        evidence_templates = [
            ("CC6.1", "Logical and Physical Access Controls", "configuration"),
            ("CC6.2", "Prior to Issuing System Credentials", "log"),
            ("CC6.3", "System Credentials", "document"),
            ("CC7.1", "Detection of Unauthorized Changes", "metric"),
        ]
        
        for control_id, control_name, evidence_type in evidence_templates:
            await conn.execute("""
                INSERT INTO evidence (agent_id, control_id, control_name, evidence_type, data)
                VALUES ($1, $2, $3, $4, $5)
            """, agent_id, control_id, control_name, evidence_type, json.dumps({
                "source": f"Mock {evidence_type} data for {control_id}",
                "compliance_status": "compliant",
                "details": f"Automated collection from {agent.platform}"
            }))
        
        # Get the created agent with evidence count
        agent_data = await conn.fetchrow("""
            SELECT a.*, COUNT(e.id) as evidence_count
            FROM agents a
            LEFT JOIN evidence e ON a.id = e.agent_id
            WHERE a.id = $1
            GROUP BY a.id
        """, agent_id)
        
        return {
            "id": str(agent_data['id']),
            "name": agent_data['name'],
            "description": agent_data['description'],
            "platform": agent_data['platform'],
            "framework": agent_data['framework'],
            "automation_level": agent_data['automation_level'],
            "status": agent_data['status'],
            "created_at": agent_data['created_at'],
            "evidence_count": agent_data['evidence_count'],
            "success_rate": 98.5
        }
    finally:
        await conn.close()

@app.get("/agents")
async def get_agents(current_user = Depends(get_current_user)):
    """Get all agents for current user"""
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        agents = await conn.fetch("""
            SELECT a.*, COUNT(e.id) as evidence_count
            FROM agents a
            LEFT JOIN evidence e ON a.id = e.agent_id
            WHERE a.user_id = $1
            GROUP BY a.id
            ORDER BY a.created_at DESC
        """, uuid.UUID(current_user["user_id"]))
        
        return [{
            "id": str(agent['id']),
            "name": agent['name'],
            "description": agent['description'],
            "platform": agent['platform'],
            "framework": agent['framework'],
            "automation_level": agent['automation_level'],
            "status": agent['status'],
            "created_at": agent['created_at'],
            "evidence_count": agent['evidence_count'],
            "success_rate": 98.5
        } for agent in agents]
    finally:
        await conn.close()

@app.get("/dashboard/stats")
async def get_dashboard_stats(current_user = Depends(get_current_user)):
    """Get dashboard statistics"""
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        stats = await conn.fetchrow("""
            SELECT 
                COUNT(DISTINCT a.id) as total_agents,
                COUNT(DISTINCT e.id) as total_evidence,
                AVG(a.automation_level) as avg_automation,
                COUNT(DISTINCT CASE WHEN a.status = 'active' THEN a.id END) as active_agents
            FROM agents a
            LEFT JOIN evidence e ON a.id = e.agent_id
            WHERE a.user_id = $1
        """, uuid.UUID(current_user["user_id"]))
        
        return {
            "total_agents": stats['total_agents'] or 0,
            "total_evidence": stats['total_evidence'] or 0,
            "avg_automation": round(stats['avg_automation'] or 75.0, 1),
            "active_agents": stats['active_agents'] or 0,
            "trust_score": 92.5,
            "compliance_coverage": 78.3
        }
    finally:
        await conn.close()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "velocity-ai-platform"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)