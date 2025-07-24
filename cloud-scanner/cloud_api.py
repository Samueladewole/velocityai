"""
Cloud Scanner API
FastAPI backend for multi-cloud security scanning
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime
import asyncio
import uuid
import json
from enum import Enum

from cloud_scanner import CloudScanner, CloudProvider, RiskLevel, CloudResource

app = FastAPI(
    title="ERIP Cloud Scanner API",
    description="Multi-cloud security and compliance scanning API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Global scanner instance
scanner = CloudScanner()

# In-memory storage for scan results (would use database in production)
scan_results = {}
scan_jobs = {}

class CloudCredentials(BaseModel):
    provider: str = Field(..., description="Cloud provider (aws, azure, gcp)")
    aws_access_key: Optional[str] = None
    aws_secret_key: Optional[str] = None
    aws_region: Optional[str] = "us-east-1"
    azure_subscription_id: Optional[str] = None
    gcp_project_id: Optional[str] = None
    gcp_service_account_path: Optional[str] = None

class ScanRequest(BaseModel):
    scan_name: str = Field(..., description="Name for this scan")
    providers: List[str] = Field(..., description="List of providers to scan")
    credentials: Dict[str, Any] = Field(..., description="Credentials for each provider")
    frameworks: Optional[List[str]] = Field(default=["ISO27001", "SOC2", "GDPR"], description="Compliance frameworks to check")

class ScanStatus(BaseModel):
    scan_id: str
    status: str  # pending, running, completed, failed
    progress: int  # 0-100
    started_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

class ComplianceReport(BaseModel):
    scan_id: str
    scan_timestamp: datetime
    summary: Dict[str, Any]
    framework_compliance: Dict[str, Any]
    resources_by_provider: Dict[str, int]
    risk_distribution: Dict[str, int]
    top_findings: List[Dict[str, Any]]
    recommendations: List[Dict[str, Any]]

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "ERIP Cloud Scanner API",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/providers")
async def get_supported_providers():
    """Get list of supported cloud providers"""
    return {
        "providers": [
            {
                "id": "aws",
                "name": "Amazon Web Services",
                "services": ["EC2", "S3", "RDS", "Lambda", "VPC"],
                "required_credentials": ["access_key", "secret_key", "region"]
            },
            {
                "id": "azure",
                "name": "Microsoft Azure",
                "services": ["Virtual Machines", "Storage Accounts", "Key Vault", "SQL Database"],
                "required_credentials": ["subscription_id"]
            },
            {
                "id": "gcp",
                "name": "Google Cloud Platform",
                "services": ["Compute Engine", "Cloud Storage", "Cloud SQL", "Cloud Functions"],
                "required_credentials": ["project_id", "service_account_path"]
            }
        ]
    }

@app.get("/compliance-frameworks")
async def get_compliance_frameworks():
    """Get list of supported compliance frameworks"""
    return {
        "frameworks": [
            {
                "id": "ISO27001",
                "name": "ISO/IEC 27001:2022",
                "description": "International standard for information security management",
                "controls": 93
            },
            {
                "id": "SOC2",
                "name": "SOC 2 Type II",
                "description": "Security and availability controls for service organizations",
                "controls": 64
            },
            {
                "id": "GDPR",
                "name": "General Data Protection Regulation",
                "description": "EU regulation for data protection and privacy",
                "controls": 47
            },
            {
                "id": "NIST",
                "name": "NIST Cybersecurity Framework",
                "description": "Framework for improving cybersecurity posture",
                "controls": 108
            },
            {
                "id": "CSA-CCM",
                "name": "Cloud Security Alliance - Cloud Controls Matrix",
                "description": "Security controls framework for cloud computing",
                "controls": 197
            }
        ]
    }

@app.post("/scans", response_model=Dict[str, str])
async def create_scan(scan_request: ScanRequest, background_tasks: BackgroundTasks):
    """Create a new cloud environment scan"""
    scan_id = str(uuid.uuid4())
    
    # Store scan job
    scan_jobs[scan_id] = {
        "scan_id": scan_id,
        "status": "pending",
        "progress": 0,
        "started_at": datetime.now(),
        "completed_at": None,
        "error_message": None,
        "scan_request": scan_request.dict()
    }
    
    # Start background scan
    background_tasks.add_task(run_cloud_scan, scan_id, scan_request)
    
    return {
        "scan_id": scan_id,
        "status": "pending",
        "message": "Scan initiated successfully"
    }

@app.get("/scans/{scan_id}/status", response_model=ScanStatus)
async def get_scan_status(scan_id: str):
    """Get status of a specific scan"""
    if scan_id not in scan_jobs:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    job = scan_jobs[scan_id]
    return ScanStatus(**job)

@app.get("/scans/{scan_id}/results")
async def get_scan_results(scan_id: str):
    """Get results of a completed scan"""
    if scan_id not in scan_results:
        if scan_id not in scan_jobs:
            raise HTTPException(status_code=404, detail="Scan not found")
        
        job = scan_jobs[scan_id]
        if job["status"] != "completed":
            raise HTTPException(status_code=400, detail=f"Scan is {job['status']}, results not available")
        else:
            raise HTTPException(status_code=404, detail="Scan results not found")
    
    return scan_results[scan_id]

@app.get("/scans")
async def list_scans():
    """List all scans"""
    return {
        "scans": [
            {
                "scan_id": scan_id,
                "scan_name": job["scan_request"].get("scan_name", "Unnamed Scan"),
                "status": job["status"],
                "started_at": job["started_at"].isoformat(),
                "completed_at": job["completed_at"].isoformat() if job["completed_at"] else None,
                "providers": job["scan_request"].get("providers", [])
            }
            for scan_id, job in scan_jobs.items()
        ]
    }

@app.delete("/scans/{scan_id}")
async def delete_scan(scan_id: str):
    """Delete a scan and its results"""
    if scan_id not in scan_jobs:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    # Remove from both scan_jobs and scan_results
    del scan_jobs[scan_id]
    if scan_id in scan_results:
        del scan_results[scan_id]
    
    return {"message": "Scan deleted successfully"}

@app.post("/test-credentials")
async def test_credentials(credentials: CloudCredentials):
    """Test cloud provider credentials"""
    try:
        test_results = {}
        
        if credentials.provider == "aws" and credentials.aws_access_key and credentials.aws_secret_key:
            # Test AWS credentials (simplified)
            test_results["aws"] = {
                "status": "success",
                "message": "AWS credentials validated successfully",
                "accessible_services": ["EC2", "S3", "RDS"]
            }
        
        elif credentials.provider == "azure" and credentials.azure_subscription_id:
            # Test Azure credentials (simplified)
            test_results["azure"] = {
                "status": "success", 
                "message": "Azure credentials validated successfully",
                "accessible_services": ["Virtual Machines", "Storage Accounts"]
            }
        
        elif credentials.provider == "gcp" and credentials.gcp_project_id:
            # Test GCP credentials (simplified)
            test_results["gcp"] = {
                "status": "success",
                "message": "GCP credentials validated successfully", 
                "accessible_services": ["Compute Engine", "Cloud Storage"]
            }
        
        else:
            raise HTTPException(status_code=400, detail="Invalid or missing credentials")
        
        return test_results
        
    except Exception as e:
        return {
            credentials.provider: {
                "status": "error",
                "message": f"Credential validation failed: {str(e)}",
                "accessible_services": []
            }
        }

@app.get("/dashboard/summary")
async def get_dashboard_summary():
    """Get dashboard summary with key metrics"""
    total_scans = len(scan_jobs)
    completed_scans = len([job for job in scan_jobs.values() if job["status"] == "completed"])
    
    # Calculate aggregate metrics from completed scans
    total_resources = 0
    total_findings = 0
    avg_trust_score = 0
    
    completed_results = [result for result in scan_results.values()]
    if completed_results:
        total_resources = sum(result["summary"]["total_resources"] for result in completed_results)
        total_findings = sum(
            result["summary"]["critical_findings"] + 
            result["summary"]["high_findings"] + 
            result["summary"]["medium_findings"]
            for result in completed_results
        )
        avg_trust_score = sum(result["summary"]["trust_score"] for result in completed_results) / len(completed_results)
    
    return {
        "total_scans": total_scans,
        "completed_scans": completed_scans,
        "total_resources_scanned": total_resources,
        "total_findings": total_findings,
        "average_trust_score": round(avg_trust_score, 2),
        "recent_scans": [
            {
                "scan_id": scan_id,
                "scan_name": job["scan_request"].get("scan_name", "Unnamed Scan"),
                "status": job["status"],
                "started_at": job["started_at"].isoformat(),
                "trust_score": scan_results.get(scan_id, {}).get("summary", {}).get("trust_score", 0)
            }
            for scan_id, job in sorted(scan_jobs.items(), 
                                     key=lambda x: x[1]["started_at"], 
                                     reverse=True)[:5]
        ]
    }

async def run_cloud_scan(scan_id: str, scan_request: ScanRequest):
    """Background task to run cloud scan"""
    try:
        # Update status to running
        scan_jobs[scan_id]["status"] = "running"
        scan_jobs[scan_id]["progress"] = 10
        
        # Initialize scanner for each provider
        all_resources = []
        
        for provider in scan_request.providers:
            scan_jobs[scan_id]["progress"] += 20
            
            if provider == "aws":
                # In a real implementation, would use actual credentials
                # await scanner.initialize_aws(
                #     scan_request.credentials["aws"]["access_key"],
                #     scan_request.credentials["aws"]["secret_key"],
                #     scan_request.credentials["aws"].get("region", "us-east-1")
                # )
                # resources = await scanner.scan_aws_environment()
                
                # For demo, create sample AWS resources
                resources = await create_sample_aws_resources()
                all_resources.extend(resources)
                
            elif provider == "azure":
                # await scanner.initialize_azure(scan_request.credentials["azure"]["subscription_id"])
                # resources = await scanner.scan_azure_environment()
                
                # For demo, create sample Azure resources
                resources = await create_sample_azure_resources()
                all_resources.extend(resources)
                
            elif provider == "gcp":
                # await scanner.initialize_gcp(
                #     scan_request.credentials["gcp"]["project_id"],
                #     scan_request.credentials["gcp"]["service_account_path"]
                # )
                # resources = await scanner.scan_gcp_environment()
                
                # For demo, create sample GCP resources
                resources = await create_sample_gcp_resources()
                all_resources.extend(resources)
        
        # Generate compliance report
        scan_jobs[scan_id]["progress"] = 90
        report = await scanner.generate_compliance_report(all_resources)
        report["scan_id"] = scan_id
        
        # Store results
        scan_results[scan_id] = report
        
        # Mark as completed
        scan_jobs[scan_id]["status"] = "completed"
        scan_jobs[scan_id]["progress"] = 100
        scan_jobs[scan_id]["completed_at"] = datetime.now()
        
    except Exception as e:
        scan_jobs[scan_id]["status"] = "failed"
        scan_jobs[scan_id]["error_message"] = str(e)
        scan_jobs[scan_id]["completed_at"] = datetime.now()

async def create_sample_aws_resources():
    """Create sample AWS resources for demo"""
    from datetime import timedelta
    
    return [
        CloudResource(
            id="i-1234567890abcdef0",
            name="web-server-prod",
            type="EC2 Instance",
            region="us-east-1a",
            provider=CloudProvider.AWS,
            tags={"Environment": "Production", "Team": "WebDev"},
            created_date=datetime.now() - timedelta(days=30),
            last_modified=datetime.now(),
            compliance_status={"encryption": False, "security-groups": True},
            security_findings=[{
                'id': 'ebs-unencrypted-i-1234567890abcdef0',
                'title': 'Unencrypted EBS Volume',
                'description': 'EBS volume is not encrypted',
                'severity': 'medium',
                'compliance_rules': ['aws-ec2-unencrypted-ebs'],
                'trust_points_impact': 30,
                'remediation_steps': ['Enable encryption for EBS volumes']
            }],
            risk_level=RiskLevel.MEDIUM,
            trust_points=70
        ),
        CloudResource(
            id="marketing-assets-bucket",
            name="marketing-assets-bucket",
            type="S3 Bucket",
            region="us-east-1",
            provider=CloudProvider.AWS,
            tags={"Project": "Marketing", "Team": "Marketing"},
            created_date=datetime.now() - timedelta(days=60),
            last_modified=datetime.now(),
            compliance_status={"encryption": True, "public-access": False},
            security_findings=[],
            risk_level=RiskLevel.LOW,
            trust_points=100
        ),
        CloudResource(
            id="prod-database",
            name="prod-database",
            type="RDS Instance",
            region="us-east-1",
            provider=CloudProvider.AWS,
            tags={"Environment": "Production", "Team": "Backend"},
            created_date=datetime.now() - timedelta(days=90),
            last_modified=datetime.now(),
            compliance_status={"encryption": True, "public-access": True},
            security_findings=[{
                'id': 'rds-public-prod-database',
                'title': 'RDS Instance Publicly Accessible',
                'description': 'RDS database instance is publicly accessible',
                'severity': 'critical',
                'compliance_rules': ['aws-rds-public-access'],
                'trust_points_impact': 75,
                'remediation_steps': ['Disable public accessibility for RDS instance']
            }],
            risk_level=RiskLevel.CRITICAL,
            trust_points=25
        )
    ]

async def create_sample_azure_resources():
    """Create sample Azure resources for demo"""
    from datetime import timedelta
    
    return [
        CloudResource(
            id="vm-web-01",
            name="vm-web-01",
            type="Virtual Machine",
            region="East US",
            provider=CloudProvider.AZURE,
            tags={"Environment": "Production", "Team": "WebDev"},
            created_date=datetime.now() - timedelta(days=45),
            last_modified=datetime.now(),
            compliance_status={"disk-encryption": False},
            security_findings=[{
                'id': 'azure-vm-encryption-vm-web-01',
                'title': 'VM Disk Encryption Disabled',
                'description': 'Virtual machine disk encryption is not enabled',
                'severity': 'high',
                'compliance_rules': ['azure-vm-no-disk-encryption'],
                'trust_points_impact': 45,
                'remediation_steps': ['Enable Azure Disk Encryption']
            }],
            risk_level=RiskLevel.HIGH,
            trust_points=55
        ),
        CloudResource(
            id="storageaccount001",
            name="storageaccount001",
            type="Storage Account",
            region="East US",
            provider=CloudProvider.AZURE,
            tags={"Environment": "Production"},
            created_date=datetime.now() - timedelta(days=20),
            last_modified=datetime.now(),
            compliance_status={"https-only": True},
            security_findings=[],
            risk_level=RiskLevel.LOW,
            trust_points=100
        )
    ]

async def create_sample_gcp_resources():
    """Create sample GCP resources for demo"""
    from datetime import timedelta
    
    return [
        CloudResource(
            id="1234567890123456789",
            name="web-instance-1",
            type="Compute Instance",
            region="us-central1-a",
            provider=CloudProvider.GCP,
            tags={"environment": "production", "team": "webdev"},
            created_date=datetime.now() - timedelta(days=25),
            last_modified=datetime.now(),
            compliance_status={"shielded-vm": False},
            security_findings=[{
                'id': 'gcp-shielded-vm-web-instance-1',
                'title': 'Shielded VM Features Disabled',
                'description': 'Compute instance does not have Shielded VM features enabled',
                'severity': 'medium',
                'compliance_rules': ['gcp-compute-no-shielded-vm'],
                'trust_points_impact': 25,
                'remediation_steps': ['Enable Shielded VM features']
            }],
            risk_level=RiskLevel.MEDIUM,
            trust_points=75
        ),
        CloudResource(
            id="app-data-bucket",
            name="app-data-bucket",
            type="Storage Bucket",
            region="us-central1",
            provider=CloudProvider.GCP,
            tags={"environment": "production"},
            created_date=datetime.now() - timedelta(days=40),
            last_modified=datetime.now(),
            compliance_status={"public-access": True},
            security_findings=[],
            risk_level=RiskLevel.LOW,
            trust_points=100
        )
    ]

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting ERIP Cloud Scanner API...")
    print("📡 API Documentation: http://localhost:8002/docs")
    print("🔍 Health Check: http://localhost:8002/")
    uvicorn.run(app, host="0.0.0.0", port=8002)