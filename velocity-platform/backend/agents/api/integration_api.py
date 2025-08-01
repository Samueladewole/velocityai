"""
FastAPI endpoints for ERIP platform integration management.
Provides API for syncing AI agent data with Trust Equity, Compass, and Atlas.
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from datetime import datetime
import structlog
from ..core.erip_integration import erip_integration
from ..api.security_middleware import get_current_customer, require_permission

logger = structlog.get_logger()

app = FastAPI(title="ERIP Integration API", version="1.0.0")


# Pydantic models
class SyncRequest(BaseModel):
    customer_id: str = Field(..., description="Customer ID to sync")
    components: List[str] = Field(
        default=['trust_equity', 'compass', 'atlas'],
        description="Components to sync"
    )
    force_full_sync: bool = Field(default=False, description="Force complete resync")


class EvidenceSyncRequest(BaseModel):
    customer_id: str = Field(..., description="Customer ID")
    evidence_ids: List[str] = Field(..., description="Evidence record IDs to sync")


class TrustScoreRequest(BaseModel):
    customer_id: str = Field(..., description="Customer ID")


class PerformanceReportRequest(BaseModel):
    customer_id: str = Field(..., description="Customer ID")
    period_days: int = Field(default=30, description="Report period in days")


# Endpoints
@app.post("/sync/full", response_model=Dict[str, Any])
async def full_platform_sync(
    request: SyncRequest,
    background_tasks: BackgroundTasks,
    current_user: Dict = Depends(require_permission('agents:manage'))
):
    """Perform full synchronization with all ERIP components"""
    
    try:
        # Validate customer access
        if request.customer_id != current_user.get('customer_id'):
            raise HTTPException(status_code=403, detail="Access denied")
        
        if request.force_full_sync:
            # Schedule background full sync
            background_tasks.add_task(
                erip_integration.full_platform_sync,
                request.customer_id
            )
            
            return {
                'success': True,
                'message': 'Full sync scheduled in background',
                'customer_id': request.customer_id,
                'components': request.components
            }
        else:
            # Perform immediate sync
            result = await erip_integration.full_platform_sync(request.customer_id)
            return result
        
    except Exception as e:
        logger.error("full_sync_failed", customer_id=request.customer_id, error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/sync/evidence", response_model=Dict[str, Any])
async def sync_evidence_to_trust_equity(
    request: EvidenceSyncRequest,
    current_user: Dict = Depends(require_permission('evidence:manage'))
):
    """Sync specific evidence records to Trust Equity"""
    
    try:
        # Validate customer access
        if request.customer_id != current_user.get('customer_id'):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Mock evidence data - replace with actual database queries
        evidence_records = [
            {
                'id': eid,
                'framework': 'SOC2',
                'control_id': 'CC6.1', 
                'type': 'screenshot',
                'validation_score': 95.0,
                'ai_collected': True,
                'created_at': datetime.utcnow().isoformat(),
                'customer_id': request.customer_id
            }
            for eid in request.evidence_ids
        ]
        
        result = await erip_integration.sync_evidence_to_trust_equity(evidence_records)
        
        return {
            'success': result.get('success', False),
            'evidence_synced': len(request.evidence_ids),
            'trust_points_awarded': result.get('total_points', 0),
            'sync_result': result
        }
        
    except Exception as e:
        logger.error(
            "evidence_sync_failed", 
            customer_id=request.customer_id, 
            error=str(e)
        )
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/trust-score/{customer_id}", response_model=Dict[str, Any])
async def get_trust_score_update(
    customer_id: str,
    current_user: Dict = Depends(require_permission('billing:view'))
):
    """Get latest Trust Score from Trust Equity"""
    
    try:
        # Validate customer access
        if customer_id != current_user.get('customer_id'):
            raise HTTPException(status_code=403, detail="Access denied")
        
        result = await erip_integration.get_trust_score_update(customer_id)
        
        if not result.get('success'):
            raise HTTPException(status_code=404, detail=result.get('error'))
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("trust_score_fetch_failed", customer_id=customer_id, error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/reports/performance/{customer_id}", response_model=Dict[str, Any])
async def get_agent_performance_report(
    customer_id: str,
    period_days: int = 30,
    current_user: Dict = Depends(require_permission('billing:view'))
):
    """Get AI agent performance report"""
    
    try:
        # Validate customer access
        if customer_id != current_user.get('customer_id'):
            raise HTTPException(status_code=403, detail="Access denied")
        
        report = await erip_integration.create_agent_performance_report(
            customer_id, period_days
        )
        
        return report
        
    except Exception as e:
        logger.error(
            "performance_report_failed", 
            customer_id=customer_id, 
            error=str(e)
        )
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/sync/controls", response_model=Dict[str, Any])
async def sync_controls_with_compass(
    customer_id: str,
    current_user: Dict = Depends(require_permission('agents:manage'))
):
    """Sync control mappings and automation status with Compass"""
    
    try:
        # Validate customer access
        if customer_id != current_user.get('customer_id'):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Mock control data - replace with actual database queries
        framework_controls = [
            {
                'id': 'CC6.1',
                'framework': 'SOC2',
                'description': 'Logical access security measures',
                'evidence_artifacts': ['ev_001', 'ev_002'],
                'ai_automated': True
            },
            {
                'id': 'CC6.7',
                'framework': 'SOC2', 
                'description': 'System access monitoring',
                'evidence_artifacts': ['ev_003'],
                'ai_automated': True
            }
        ]
        
        result = await erip_integration.sync_controls_with_compass(
            customer_id, framework_controls
        )
        
        return result
        
    except Exception as e:
        logger.error(
            "controls_sync_failed", 
            customer_id=customer_id, 
            error=str(e)
        )
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/sync/risks", response_model=Dict[str, Any])
async def report_risks_to_atlas(
    customer_id: str,
    current_user: Dict = Depends(require_permission('agents:manage'))
):
    """Report detected risk events to Atlas"""
    
    try:
        # Validate customer access
        if customer_id != current_user.get('customer_id'):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Mock risk events - replace with actual risk detection
        risk_events = [
            {
                'id': 'risk_001',
                'type': 'configuration_drift',
                'severity': 'medium',
                'description': 'AWS security group rules modified',
                'affected_controls': ['CC6.1', 'CC6.7']
            },
            {
                'id': 'risk_002',
                'type': 'access_violation',
                'severity': 'high',
                'description': 'Unauthorized admin access detected',
                'affected_controls': ['CC6.2', 'CC6.3']
            }
        ]
        
        result = await erip_integration.report_risk_events_to_atlas(
            customer_id, risk_events
        )
        
        return result
        
    except Exception as e:
        logger.error(
            "risk_sync_failed", 
            customer_id=customer_id, 
            error=str(e)
        )
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/sync/status/{customer_id}", response_model=Dict[str, Any])
async def get_sync_status(
    customer_id: str,
    current_user: Dict = Depends(require_permission('billing:view'))
):
    """Get current synchronization status for customer"""
    
    try:
        # Validate customer access
        if customer_id != current_user.get('customer_id'):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Mock sync status - replace with actual tracking
        sync_status = {
            'customer_id': customer_id,
            'last_full_sync': '2025-01-15T10:30:00Z',
            'sync_frequency_minutes': 15,
            'components': {
                'trust_equity': {
                    'status': 'active',
                    'last_sync': '2025-01-15T10:30:00Z',
                    'records_synced': 1547,
                    'errors': 0
                },
                'compass': {
                    'status': 'active',
                    'last_sync': '2025-01-15T10:30:00Z',
                    'controls_synced': 64,
                    'errors': 0
                },
                'atlas': {
                    'status': 'active',
                    'last_sync': '2025-01-15T10:30:00Z',
                    'events_reported': 23,
                    'errors': 0
                }
            },
            'overall_health': 'healthy',
            'next_scheduled_sync': '2025-01-15T10:45:00Z'
        }
        
        return sync_status
        
    except Exception as e:
        logger.error("sync_status_failed", customer_id=customer_id, error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/sync/schedule", response_model=Dict[str, Any])
async def schedule_periodic_sync(
    customer_id: str,
    interval_minutes: int = 15,
    current_user: Dict = Depends(require_permission('agents:manage'))
):
    """Schedule periodic synchronization for customer"""
    
    try:
        # Validate customer access
        if customer_id != current_user.get('customer_id'):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Start periodic sync task (this would typically be managed by a task scheduler)
        # For now, just return configuration
        
        return {
            'success': True,
            'customer_id': customer_id,
            'sync_interval_minutes': interval_minutes,
            'scheduled_at': datetime.utcnow().isoformat(),
            'message': 'Periodic sync scheduled successfully'
        }
        
    except Exception as e:
        logger.error(
            "sync_schedule_failed", 
            customer_id=customer_id, 
            error=str(e)
        )
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/integration/health", response_model=Dict[str, Any])
async def check_integration_health():
    """Check health of ERIP component integrations"""
    
    try:
        # Mock health check - replace with actual service checks
        health_status = {
            'timestamp': datetime.utcnow().isoformat(),
            'overall_status': 'healthy',
            'components': {
                'trust_equity': {
                    'status': 'healthy',
                    'response_time_ms': 45,
                    'last_check': datetime.utcnow().isoformat()
                },
                'compass': {
                    'status': 'healthy',
                    'response_time_ms': 32,
                    'last_check': datetime.utcnow().isoformat()
                },
                'atlas': {
                    'status': 'healthy',
                    'response_time_ms': 28,
                    'last_check': datetime.utcnow().isoformat()
                }
            },
            'active_syncs': 47,
            'total_customers': 156
        }
        
        return health_status
        
    except Exception as e:
        logger.error("health_check_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


# Add CORS middleware
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://erip.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8006)