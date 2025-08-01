#!/usr/bin/env python3
"""
Simple test server to validate basic functionality
"""
import os
import asyncio
from datetime import datetime, timezone
from typing import Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Velocity AI Test Server",
    description="Test server for validating basic functionality",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Mock data for testing
mock_agents = [
    {
        "id": "agent-1",
        "name": "AWS Evidence Collector",
        "platform": "aws",
        "framework": "soc2",
        "status": "active",
        "evidence_collected": 45,
        "success_rate": 0.92,
        "last_run": "2025-08-01T10:30:00Z",
        "next_run": "2025-08-01T14:30:00Z",
        "description": "Collects evidence from AWS services"
    },
    {
        "id": "agent-2", 
        "name": "Azure Security Monitor",
        "platform": "azure",
        "framework": "iso27001",
        "status": "running",
        "evidence_collected": 23,
        "success_rate": 0.88,
        "last_run": "2025-08-01T09:15:00Z",
        "next_run": "2025-08-01T13:15:00Z",
        "description": "Monitors Azure security configurations"
    }
]

mock_evidence = [
    {
        "id": "evidence-1",
        "title": "AWS IAM Policy Review",
        "description": "IAM policies for user access controls",
        "evidence_type": "policy",
        "status": "verified",
        "framework": "soc2",
        "control_id": "CC6.1",
        "confidence_score": 0.95,
        "trust_points": 25,
        "created_at": "2025-08-01T10:30:00Z",
        "platform": "aws",
        "data": {"policy_count": 12, "compliant_policies": 11}
    },
    {
        "id": "evidence-2",
        "title": "Azure Security Groups",
        "description": "Network security group configurations",
        "evidence_type": "configuration",
        "status": "pending",
        "framework": "iso27001",
        "control_id": "A.13.1.1",
        "confidence_score": 0.87,
        "trust_points": 20,
        "created_at": "2025-08-01T09:15:00Z",
        "platform": "azure",
        "data": {"security_groups": 8, "open_ports": 2}
    }
]

mock_integrations = [
    {
        "id": "integration-1",
        "name": "AWS Production",
        "platform": "aws",
        "status": "connected",
        "last_sync": "2025-08-01T10:30:00Z",
        "error_count": 0
    },
    {
        "id": "integration-2",
        "name": "Azure Development",
        "platform": "azure", 
        "status": "connected",
        "last_sync": "2025-08-01T09:15:00Z",
        "error_count": 1
    }
]

# Simulate WebSocket connections
websocket_connections = []

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Velocity AI Test Server",
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/health")
async def health_check():
    """Comprehensive health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "services": {
            "database": "mocked",
            "redis": "mocked",
            "external_services": "mocked"
        }
    }

@app.get("/api/v1/agents")
async def get_agents():
    """Get all agents"""
    return {
        "success": True,
        "data": mock_agents,
        "total": len(mock_agents)
    }

@app.post("/api/v1/agents/{agent_id}/run")
async def run_agent(agent_id: str):
    """Manually trigger agent execution"""
    agent = next((a for a in mock_agents if a["id"] == agent_id), None)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Simulate agent execution
    agent["status"] = "running"
    logger.info(f"Started execution for agent: {agent_id}")
    
    # Simulate evidence collection after a delay
    asyncio.create_task(simulate_evidence_collection(agent_id))
    
    return {"success": True, "message": "Agent execution started"}

async def simulate_evidence_collection(agent_id: str):
    """Simulate evidence collection process"""
    await asyncio.sleep(5)  # Simulate collection time
    
    # Update agent status
    agent = next((a for a in mock_agents if a["id"] == agent_id), None)
    if agent:
        agent["status"] = "active"
        agent["evidence_collected"] += 1
        agent["last_run"] = datetime.now(timezone.utc).isoformat()
        
        # Create new evidence item
        new_evidence = {
            "id": f"evidence-{len(mock_evidence) + 1}",
            "title": f"Evidence from {agent['name']}",
            "description": "Automated evidence collection",
            "evidence_type": "api_response",
            "status": "pending",
            "framework": agent["framework"],
            "control_id": "AUTO-GEN",
            "confidence_score": 0.9,
            "trust_points": 15,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "platform": agent["platform"],
            "data": {"collected_by": agent_id, "items": 5}
        }
        mock_evidence.append(new_evidence)
        
        logger.info(f"Evidence collected by agent {agent_id}: {new_evidence['id']}")
        
        # Simulate WebSocket notification
        await broadcast_websocket_message({
            "type": "evidence_collected",
            "data": {
                "agent_id": agent_id,
                "evidence_id": new_evidence["id"],
                "title": new_evidence["title"]
            }
        })

async def broadcast_websocket_message(message: Dict[str, Any]):
    """Simulate WebSocket broadcast"""
    logger.info(f"WebSocket broadcast: {message}")
    # In a real implementation, this would send to actual WebSocket connections

@app.get("/api/v1/evidence")
async def get_evidence():
    """Get evidence items"""
    return {
        "success": True,
        "data": mock_evidence,
        "total": len(mock_evidence)
    }

@app.get("/api/v1/integrations")
async def get_integrations():
    """Get all integrations"""
    return {
        "success": True,
        "data": mock_integrations,
        "total": len(mock_integrations)
    }

@app.post("/api/v1/integrations/{platform}/connect")
async def connect_integration(platform: str, credentials: Dict[str, Any]):
    """Connect to a cloud platform"""
    logger.info(f"Attempting to connect to {platform} with credentials: {list(credentials.keys())}")
    
    # Simulate connection test
    await asyncio.sleep(2)
    
    # Mock success for AWS, simulate error for others to test error handling
    if platform.lower() == "aws":
        integration = {
            "id": f"integration-{len(mock_integrations) + 1}",
            "name": f"{platform.upper()} Test Connection",
            "platform": platform.lower(),
            "status": "connected",
            "last_sync": datetime.now(timezone.utc).isoformat(),
            "error_count": 0
        }
        mock_integrations.append(integration)
        
        logger.info(f"Successfully connected to {platform}")
        return {"success": True, "integration_id": integration["id"]}
    else:
        logger.error(f"Connection failed for {platform}")
        raise HTTPException(status_code=400, detail=f"Connection test failed for {platform}")

@app.get("/api/v1/dashboard")
async def get_dashboard_overview():
    """Get dashboard overview data"""
    return {
        "success": True,
        "data": {
            "trust_score": {
                "current": 87,
                "trend": "+2.1",
                "target": 95,
                "last_updated": datetime.now(timezone.utc).isoformat()
            },
            "agents": {
                "total": len(mock_agents),
                "active": len([a for a in mock_agents if a["status"] == "active"]),
                "success_rate": 90,
                "agents_list": mock_agents
            },
            "evidence": {
                "total_collected": len(mock_evidence),
                "today_collected": 5,
                "recent_items": mock_evidence[-5:],
                "automation_rate": 85
            },
            "notifications": [
                {
                    "id": "test-notification",
                    "type": "info",
                    "title": "System Status",
                    "message": "All systems operational",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            ]
        }
    }

if __name__ == "__main__":
    logger.info("Starting Velocity AI Test Server...")
    uvicorn.run(
        "test_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )