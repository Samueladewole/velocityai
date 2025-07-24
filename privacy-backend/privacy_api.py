"""
FastAPI server for ERIP Privacy Management Suite
RESTful API endpoints for Shadow IT, DSAR, RoPA, and DPIA management
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
import logging
import uuid

from privacy_manager import (
    PrivacyManager, 
    ShadowITApp, 
    DSARRequest, 
    DSARType, 
    DSARStatus,
    RoPARecord, 
    DPIAAssessment,
    RiskLevel
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="ERIP Privacy Management API",
    description="Comprehensive GDPR compliance with automated privacy tools",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Privacy Manager
privacy_manager = PrivacyManager()

# Pydantic models for API requests/responses

class ShadowITScanRequest(BaseModel):
    domain: Optional[str] = None
    scan_type: str = "full"  # full, quick, targeted

class DSARCreateRequest(BaseModel):
    request_type: str  # access, portability, deletion, rectification, restriction  
    requester_email: EmailStr
    data_subjects: List[str]
    description: Optional[str] = None

class RoPACreateRequest(BaseModel):
    processing_activity: str
    purpose: List[str]
    data_categories: Optional[List[str]] = None
    legal_basis: Optional[str] = None

class DPIACreateRequest(BaseModel):
    project_name: str
    processing_description: str
    high_risk_processing: bool = False
    stakeholders: Optional[List[str]] = None

class TrustEquityResponse(BaseModel):
    points_earned: int
    total_points: int
    activity_type: str
    description: str

# Shadow IT Discovery Endpoints

@app.post("/api/privacy/shadow-it/scan")
async def run_shadow_it_scan(
    request: ShadowITScanRequest,
    background_tasks: BackgroundTasks
):
    """
    Initiate Shadow IT discovery scan
    """
    try:
        scan_id = str(uuid.uuid4())
        
        # Run scan in background
        background_tasks.add_task(
            _background_shadow_it_scan,
            scan_id,
            request.domain,
            request.scan_type
        )
        
        return {
            "success": True,
            "scan_id": scan_id,
            "message": "Shadow IT scan initiated",
            "estimated_completion": (datetime.now() + timedelta(minutes=5)).isoformat()
        }
        
    except Exception as e:
        logger.error(f"Shadow IT scan failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def _background_shadow_it_scan(scan_id: str, domain: str, scan_type: str):
    """Background task for Shadow IT scanning"""
    try:
        apps = await privacy_manager.discover_shadow_it(domain)
        logger.info(f"Shadow IT scan {scan_id} completed: {len(apps)} apps discovered")
    except Exception as e:
        logger.error(f"Background Shadow IT scan failed: {e}")

@app.get("/api/privacy/shadow-it/apps")
async def get_shadow_it_apps():
    """
    Get all discovered Shadow IT applications
    """
    try:
        # Get apps from database
        import sqlite3
        conn = sqlite3.connect(privacy_manager.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, category, risk_level, data_types, users, 
                   last_seen, compliance, trust_impact, discovery_method, domain
            FROM shadow_it_apps
            ORDER BY last_seen DESC
        ''')
        
        apps = []
        for row in cursor.fetchall():
            import json
            apps.append({
                "id": row[0],
                "name": row[1], 
                "category": row[2],
                "risk_level": row[3],
                "data_types": json.loads(row[4]) if row[4] else [],
                "users": row[5],
                "last_seen": row[6],
                "compliance": json.loads(row[7]) if row[7] else {},
                "trust_impact": row[8],
                "discovery_method": row[9],
                "domain": row[10]
            })
        
        conn.close()
        
        return {
            "success": True,
            "apps": apps,
            "total_count": len(apps),
            "risk_summary": _calculate_risk_summary(apps)
        }
        
    except Exception as e:
        logger.error(f"Failed to get Shadow IT apps: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/privacy/shadow-it/apps/{app_id}/approve")
async def approve_shadow_it_app(app_id: str):
    """
    Approve a Shadow IT application, reducing its risk level
    """
    try:
        # Update app status and award Trust Equity points
        import sqlite3
        conn = sqlite3.connect(privacy_manager.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE shadow_it_apps 
            SET risk_level = 'low', trust_impact = 10
            WHERE id = ?
        ''', (app_id,))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="App not found")
        
        conn.commit()
        conn.close()
        
        # Award Trust Equity points
        await privacy_manager._award_trust_points("shadow_it_approval", app_id, 25)
        
        return {
            "success": True,
            "message": "Shadow IT app approved",
            "trust_points_earned": 25
        }
        
    except Exception as e:
        logger.error(f"Failed to approve Shadow IT app: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# DSAR Automation Endpoints

@app.post("/api/privacy/dsar/requests")
async def create_dsar_request(request: DSARCreateRequest):
    """
    Create and process a new DSAR request
    """
    try:
        # Create DSAR request object
        dsar_request = DSARRequest(
            id=str(uuid.uuid4()),
            request_type=DSARType(request.request_type.lower()),
            requester_email=request.requester_email,
            submission_date=datetime.now().isoformat(),
            due_date=(datetime.now() + timedelta(days=30)).isoformat(),
            status=DSARStatus.PENDING,
            data_subjects=request.data_subjects,
            estimated_records=0,  # Will be calculated during processing
            trust_points=25
        )
        
        # Process DSAR request
        result = await privacy_manager.process_dsar_request(dsar_request)
        
        return {
            "success": True,
            "dsar_id": dsar_request.id,
            "processing_result": result,
            "due_date": dsar_request.due_date,
            "trust_points_earned": dsar_request.trust_points
        }
        
    except Exception as e:
        logger.error(f"Failed to create DSAR request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/privacy/dsar/requests")
async def get_dsar_requests():
    """
    Get all DSAR requests with status and progress
    """
    try:
        import sqlite3
        import json
        
        conn = sqlite3.connect(privacy_manager.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, request_type, requester_email, submission_date, 
                   due_date, status, data_subjects, estimated_records, 
                   trust_points, processing_notes, completion_date
            FROM dsar_requests
            ORDER BY submission_date DESC
        ''')
        
        requests = []
        for row in cursor.fetchall():
            requests.append({
                "id": row[0],
                "request_type": row[1],
                "requester_email": row[2],
                "submission_date": row[3],
                "due_date": row[4],
                "status": row[5],
                "data_subjects": json.loads(row[6]) if row[6] else [],
                "estimated_records": row[7],
                "trust_points": row[8],
                "processing_notes": row[9],
                "completion_date": row[10]
            })
        
        conn.close()
        
        return {
            "success": True,
            "requests": requests,
            "summary": _calculate_dsar_summary(requests)
        }
        
    except Exception as e:
        logger.error(f"Failed to get DSAR requests: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/privacy/dsar/requests/{request_id}/complete")
async def complete_dsar_request(request_id: str):
    """
    Mark DSAR request as completed and award Trust Equity points
    """
    try:
        import sqlite3
        
        conn = sqlite3.connect(privacy_manager.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE dsar_requests 
            SET status = 'completed', completion_date = ?
            WHERE id = ?
        ''', (datetime.now().isoformat(), request_id))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="DSAR request not found")
        
        conn.commit()
        conn.close()
        
        # Award additional Trust Equity points for completion
        await privacy_manager._award_trust_points("dsar_completion", request_id, 50)
        
        return {
            "success": True,
            "message": "DSAR request completed",
            "trust_points_earned": 50
        }
        
    except Exception as e:
        logger.error(f"Failed to complete DSAR request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# RoPA Management Endpoints

@app.post("/api/privacy/ropa/records")
async def create_ropa_record(request: RoPACreateRequest):
    """
    Create a new RoPA record with AI-powered analysis
    """
    try:
        record = await privacy_manager.generate_ropa_record(
            request.processing_activity,
            request.purpose
        )
        
        return {
            "success": True,
            "record_id": record.id,
            "processing_activity": record.processing_activity,
            "risk_assessment": record.risk_assessment.value,
            "trust_points_earned": 30
        }
        
    except Exception as e:
        logger.error(f"Failed to create RoPA record: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/privacy/ropa/records")
async def get_ropa_records():
    """
    Get all RoPA records with compliance status
    """
    try:
        import sqlite3
        import json
        
        conn = sqlite3.connect(privacy_manager.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, processing_activity, purpose, data_categories, 
                   data_subjects, recipients, retention_period, legal_basis,
                   risk_assessment, last_reviewed, status, cross_border_transfers,
                   technical_measures, organizational_measures
            FROM ropa_records
            ORDER BY last_reviewed DESC
        ''')
        
        records = []
        for row in cursor.fetchall():
            records.append({
                "id": row[0],
                "processing_activity": row[1],
                "purpose": json.loads(row[2]) if row[2] else [],
                "data_categories": json.loads(row[3]) if row[3] else [],
                "data_subjects": json.loads(row[4]) if row[4] else [],
                "recipients": json.loads(row[5]) if row[5] else [],
                "retention_period": row[6],
                "legal_basis": row[7],
                "risk_assessment": row[8],
                "last_reviewed": row[9],
                "status": row[10],
                "cross_border_transfers": json.loads(row[11]) if row[11] else [],
                "technical_measures": json.loads(row[12]) if row[12] else [],
                "organizational_measures": json.loads(row[13]) if row[13] else []
            })
        
        conn.close()
        
        return {
            "success": True,
            "records": records,
            "summary": _calculate_ropa_summary(records)
        }
        
    except Exception as e:
        logger.error(f"Failed to get RoPA records: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# DPIA Management Endpoints

@app.post("/api/privacy/dpia/assessments")
async def create_dpia_assessment(request: DPIACreateRequest):
    """
    Create a new DPIA assessment with automated risk analysis
    """
    try:
        assessment = await privacy_manager.conduct_dpia(
            request.project_name,
            request.processing_description
        )
        
        return {
            "success": True,
            "assessment_id": assessment.id,
            "project_name": assessment.project_name,
            "risk_level": assessment.risk_level.value,
            "risks_identified": len(assessment.risks),
            "trust_equity_impact": assessment.trust_equity_impact
        }
        
    except Exception as e:
        logger.error(f"Failed to create DPIA assessment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/privacy/dpia/assessments")
async def get_dpia_assessments():
    """
    Get all DPIA assessments with risk analysis
    """
    try:
        import sqlite3
        import json
        
        conn = sqlite3.connect(privacy_manager.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, project_name, assessment_type, risk_level, status,
                   created_date, completion_percentage, risks, trust_equity_impact,
                   data_flows, stakeholders
            FROM dpia_assessments
            ORDER BY created_date DESC
        ''')
        
        assessments = []
        for row in cursor.fetchall():
            assessments.append({
                "id": row[0],
                "project_name": row[1],
                "assessment_type": row[2],
                "risk_level": row[3],
                "status": row[4],
                "created_date": row[5],
                "completion_percentage": row[6],
                "risks": json.loads(row[7]) if row[7] else [],
                "trust_equity_impact": row[8],
                "data_flows": json.loads(row[9]) if row[9] else [],
                "stakeholders": json.loads(row[10]) if row[10] else []
            })
        
        conn.close()
        
        return {
            "success": True,
            "assessments": assessments,
            "summary": _calculate_dpia_summary(assessments)
        }
        
    except Exception as e:
        logger.error(f"Failed to get DPIA assessments: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/privacy/dpia/assessments/{assessment_id}/approve")
async def approve_dpia_assessment(assessment_id: str):
    """
    Approve DPIA assessment and award Trust Equity points
    """
    try:
        import sqlite3
        
        conn = sqlite3.connect(privacy_manager.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE dpia_assessments 
            SET status = 'approved', completion_percentage = 100
            WHERE id = ?
        ''', (assessment_id,))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="DPIA assessment not found")
        
        # Get trust equity impact
        cursor.execute('SELECT trust_equity_impact FROM dpia_assessments WHERE id = ?', (assessment_id,))
        trust_impact = cursor.fetchone()[0]
        
        conn.commit()
        conn.close()
        
        # Award Trust Equity points
        await privacy_manager._award_trust_points("dpia_approval", assessment_id, trust_impact)
        
        return {
            "success": True,
            "message": "DPIA assessment approved",
            "trust_points_earned": trust_impact
        }
        
    except Exception as e:
        logger.error(f"Failed to approve DPIA assessment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Dashboard and Analytics Endpoints

@app.get("/api/privacy/dashboard")
async def get_privacy_dashboard():
    """
    Get comprehensive privacy management dashboard data
    """
    try:
        dashboard_data = privacy_manager.get_privacy_dashboard_data()
        
        return {
            "success": True,
            "dashboard": dashboard_data,
            "last_updated": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to get privacy dashboard: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/privacy/trust-equity")
async def get_trust_equity_summary():
    """
    Get Trust Equity points summary for privacy activities
    """
    try:
        import sqlite3
        
        conn = sqlite3.connect(privacy_manager.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT event_type, SUM(points_earned) as total_points, COUNT(*) as activities
            FROM trust_equity_events
            GROUP BY event_type
        ''')
        
        trust_equity_by_type = {}
        total_points = 0
        
        for row in cursor.fetchall():
            trust_equity_by_type[row[0]] = {
                "total_points": row[1],
                "activities": row[2]
            }
            total_points += row[1]
        
        conn.close()
        
        return {
            "success": True,
            "total_trust_points": total_points,
            "breakdown": trust_equity_by_type,
            "privacy_score": privacy_manager._calculate_privacy_compliance_score()
        }
        
    except Exception as e:
        logger.error(f"Failed to get Trust Equity summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/api/privacy/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ERIP Privacy Management API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

# Helper functions for summary calculations

def _calculate_risk_summary(apps: List[Dict]) -> Dict[str, int]:
    """Calculate risk summary for Shadow IT apps"""
    risk_counts = {"low": 0, "medium": 0, "high": 0, "critical": 0}
    for app in apps:
        risk_level = app.get("risk_level", "low")
        risk_counts[risk_level] = risk_counts.get(risk_level, 0) + 1
    return risk_counts

def _calculate_dsar_summary(requests: List[Dict]) -> Dict[str, Any]:
    """Calculate DSAR requests summary"""
    status_counts = {}
    overdue_count = 0
    
    for req in requests:
        status = req.get("status", "unknown")
        status_counts[status] = status_counts.get(status, 0) + 1
        
        # Check if overdue
        if status in ["pending", "processing"]:
            due_date = datetime.fromisoformat(req["due_date"])
            if datetime.now() > due_date:
                overdue_count += 1
    
    return {
        "by_status": status_counts,
        "overdue_count": overdue_count,
        "total_requests": len(requests)
    }

def _calculate_ropa_summary(records: List[Dict]) -> Dict[str, Any]:
    """Calculate RoPA records summary"""
    status_counts = {}
    risk_counts = {"low": 0, "medium": 0, "high": 0}
    
    for record in records:
        status = record.get("status", "unknown")
        status_counts[status] = status_counts.get(status, 0) + 1
        
        risk = record.get("risk_assessment", "low")
        risk_counts[risk] = risk_counts.get(risk, 0) + 1
    
    return {
        "by_status": status_counts,
        "by_risk": risk_counts,
        "total_records": len(records)
    }

def _calculate_dpia_summary(assessments: List[Dict]) -> Dict[str, Any]:
    """Calculate DPIA assessments summary"""
    status_counts = {}
    risk_counts = {"low": 0, "medium": 0, "high": 0}
    
    for assessment in assessments:
        status = assessment.get("status", "unknown")
        status_counts[status] = status_counts.get(status, 0) + 1
        
        risk = assessment.get("risk_level", "low")
        risk_counts[risk] = risk_counts.get(risk, 0) + 1
    
    return {
        "by_status": status_counts,
        "by_risk": risk_counts,
        "total_assessments": len(assessments)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)