"""
OWASP Security Enhancement API Router
Enterprise security auditing, penetration testing, and compliance endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Query
from typing import Dict, List, Optional, Any
from datetime import datetime
import asyncio
import structlog

from .security_audit import SecurityAuditor, OWASPTop10Auditor, VulnerabilityScanner
from .penetration_testing import PenetrationTestFramework, AutomatedPenTest
from .vulnerability_scanner import ContinuousVulnerabilityScanner, CVEDatabase
from .compliance_framework import ComplianceManager, ComplianceFramework
from .security_middleware import SecurityMiddleware
from ..shared.auth import get_current_user, require_permission, TokenData
from ..shared.models import APIResponse
from pydantic import BaseModel

router = APIRouter(prefix="/security", tags=["OWASP Security"])
logger = structlog.get_logger()

# Initialize security components
security_auditor = SecurityAuditor()
vuln_scanner = ContinuousVulnerabilityScanner()
compliance_manager = ComplianceManager()
cve_database = CVEDatabase()

# Request/Response Models
class SecurityScanRequest(BaseModel):
    scan_type: str = "full"  # full, quick, targeted
    target_path: Optional[str] = "."
    include_dependencies: bool = True
    include_code_analysis: bool = True

class PenetrationTestRequest(BaseModel):
    target_urls: List[str] = ["http://localhost:8001"]
    test_categories: List[str] = ["authentication", "authorization", "input_validation"]
    intensity: str = "moderate"  # light, moderate, aggressive

class ComplianceAssessmentRequest(BaseModel):
    frameworks: List[str] = ["soc2", "iso27001"]
    assessment_scope: str = "full"  # full, controls_only, documentation_only

# Security Audit Endpoints
@router.post("/audit/run", response_model=Dict[str, Any])
async def run_security_audit(
    background_tasks: BackgroundTasks,
    scan_request: SecurityScanRequest = SecurityScanRequest(),
    current_user: TokenData = Depends(get_current_user)
):
    """
    Run comprehensive security audit
    
    Performs OWASP Top 10 security assessment including:
    - Code vulnerability analysis
    - Configuration security review
    - Authentication/authorization assessment
    - Input validation testing
    - Cryptographic implementation review
    """
    try:
        logger.info("Starting security audit", 
                   user_id=current_user.user_id,
                   scan_type=scan_request.scan_type)
        
        if scan_request.scan_type == "quick":
            # Run quick audit synchronously
            audit_results = await security_auditor.run_full_audit()
            return {
                "status": "completed",
                "audit_results": audit_results,
                "message": "Security audit completed successfully"
            }
        else:
            # Run full audit in background
            background_tasks.add_task(
                _run_background_audit,
                scan_request,
                current_user.user_id
            )
            return {
                "status": "started",
                "message": "Full security audit started in background",
                "estimated_completion": "5-10 minutes"
            }
            
    except Exception as e:
        logger.error("Security audit failed", error=str(e), user_id=current_user.user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Security audit failed: {str(e)}"
        )

@router.get("/audit/results", response_model=Dict[str, Any])
async def get_audit_results(
    limit: int = Query(10, ge=1, le=100),
    current_user: TokenData = Depends(get_current_user)
):
    """Get recent security audit results"""
    try:
        # In production, this would retrieve from database
        return {
            "audit_results": [],
            "total_audits": 0,
            "message": "No audit results available yet"
        }
        
    except Exception as e:
        logger.error("Failed to retrieve audit results", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve audit results: {str(e)}"
        )

# Penetration Testing Endpoints
@router.post("/pentest/run", response_model=Dict[str, Any])
async def run_penetration_test(
    background_tasks: BackgroundTasks,
    pentest_request: PenetrationTestRequest = PenetrationTestRequest(),
    current_user: TokenData = Depends(get_current_user)
):
    """
    Run automated penetration testing
    
    Performs comprehensive penetration testing including:
    - Authentication bypass attempts
    - SQL injection testing
    - XSS vulnerability scanning
    - Command injection detection
    - Authorization flaw identification
    - API security assessment
    """
    try:
        logger.info("Starting penetration test",
                   user_id=current_user.user_id,
                   targets=pentest_request.target_urls,
                   intensity=pentest_request.intensity)
        
        if pentest_request.intensity == "light":
            # Run light pentest synchronously
            pentest_framework = PenetrationTestFramework(pentest_request.target_urls[0])
            results = await pentest_framework.run_full_penetration_test()
            return {
                "status": "completed",
                "test_results": results,
                "message": "Penetration test completed successfully"
            }
        else:
            # Run comprehensive pentest in background
            background_tasks.add_task(
                _run_background_pentest,
                pentest_request,
                current_user.user_id
            )
            return {
                "status": "started",
                "message": "Penetration test started in background",
                "estimated_completion": "10-30 minutes"
            }
            
    except Exception as e:
        logger.error("Penetration test failed", error=str(e), user_id=current_user.user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Penetration test failed: {str(e)}"
        )

@router.get("/pentest/results", response_model=Dict[str, Any])
async def get_pentest_results(
    limit: int = Query(10, ge=1, le=100),
    current_user: TokenData = Depends(get_current_user)
):
    """Get recent penetration test results"""
    try:
        # In production, this would retrieve from database
        return {
            "test_results": [],
            "total_tests": 0,
            "message": "No penetration test results available yet"
        }
        
    except Exception as e:
        logger.error("Failed to retrieve pentest results", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve pentest results: {str(e)}"
        )

# Vulnerability Scanning Endpoints
@router.post("/vulnerability-scan/run", response_model=Dict[str, Any])
async def run_vulnerability_scan(
    background_tasks: BackgroundTasks,
    scan_request: SecurityScanRequest = SecurityScanRequest(),
    current_user: TokenData = Depends(get_current_user)
):
    """
    Run continuous vulnerability scanning
    
    Scans for:
    - Dependency vulnerabilities with CVE mapping
    - Code security vulnerabilities
    - Configuration security issues
    - Infrastructure vulnerabilities
    """
    try:
        logger.info("Starting vulnerability scan",
                   user_id=current_user.user_id,
                   include_dependencies=scan_request.include_dependencies,
                   include_code_analysis=scan_request.include_code_analysis)
        
        # Run vulnerability scan in background
        background_tasks.add_task(
            _run_background_vuln_scan,
            scan_request,
            current_user.user_id
        )
        
        return {
            "status": "started",
            "message": "Vulnerability scan started in background",
            "estimated_completion": "5-15 minutes"
        }
        
    except Exception as e:
        logger.error("Vulnerability scan failed", error=str(e), user_id=current_user.user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Vulnerability scan failed: {str(e)}"
        )

@router.get("/vulnerability-scan/results", response_model=Dict[str, Any])
async def get_vulnerability_results(
    limit: int = Query(10, ge=1, le=100),
    current_user: TokenData = Depends(get_current_user)
):
    """Get recent vulnerability scan results"""
    try:
        scan_history = vuln_scanner.get_scan_history(limit)
        return {
            "scan_results": scan_history,
            "total_scans": len(scan_history),
            "last_scan": scan_history[0] if scan_history else None
        }
        
    except Exception as e:
        logger.error("Failed to retrieve vulnerability results", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve vulnerability results: {str(e)}"
        )

@router.get("/cve/{cve_id}", response_model=Dict[str, Any])
async def get_cve_details(
    cve_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Get detailed CVE information"""
    try:
        cve_details = await cve_database.get_cve_details(cve_id)
        
        if not cve_details:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"CVE {cve_id} not found"
            )
        
        return {
            "cve_id": cve_id,
            "details": cve_details,
            "retrieved_at": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to retrieve CVE details", cve_id=cve_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve CVE details: {str(e)}"
        )

# Compliance Framework Endpoints
@router.post("/compliance/assess", response_model=Dict[str, Any])
async def run_compliance_assessment(
    background_tasks: BackgroundTasks,
    assessment_request: ComplianceAssessmentRequest = ComplianceAssessmentRequest(),
    current_user: TokenData = Depends(get_current_user)
):
    """
    Run compliance framework assessment
    
    Supports:
    - SOC2 Type II assessment
    - ISO 27001 compliance
    - NIST Framework alignment
    - Custom compliance frameworks
    """
    try:
        logger.info("Starting compliance assessment",
                   user_id=current_user.user_id,
                   frameworks=assessment_request.frameworks,
                   scope=assessment_request.assessment_scope)
        
        # Run compliance assessment in background
        background_tasks.add_task(
            _run_background_compliance_assessment,
            assessment_request,
            current_user.user_id
        )
        
        return {
            "status": "started",
            "message": "Compliance assessment started in background",
            "frameworks": assessment_request.frameworks,
            "estimated_completion": "10-20 minutes"
        }
        
    except Exception as e:
        logger.error("Compliance assessment failed", error=str(e), user_id=current_user.user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Compliance assessment failed: {str(e)}"
        )

@router.get("/compliance/results", response_model=Dict[str, Any])
async def get_compliance_results(
    framework: Optional[str] = Query(None),
    current_user: TokenData = Depends(get_current_user)
):
    """Get compliance assessment results"""
    try:
        if framework:
            try:
                framework_enum = ComplianceFramework(framework)
                results = compliance_manager.get_assessment_history(framework_enum)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unsupported compliance framework: {framework}"
                )
        else:
            results = compliance_manager.get_assessment_history()
        
        summary = compliance_manager.get_compliance_summary()
        
        return {
            "compliance_results": results,
            "summary": summary,
            "retrieved_at": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to retrieve compliance results", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve compliance results: {str(e)}"
        )

@router.get("/compliance/frameworks", response_model=List[Dict[str, str]])
async def get_supported_frameworks(
    current_user: TokenData = Depends(get_current_user)
):
    """Get list of supported compliance frameworks"""
    frameworks = [
        {"id": "soc2", "name": "SOC 2 Type II", "description": "Service Organization Control 2"},
        {"id": "iso27001", "name": "ISO 27001", "description": "Information Security Management"},
        {"id": "nist", "name": "NIST Framework", "description": "Cybersecurity Framework"},
        {"id": "pci_dss", "name": "PCI DSS", "description": "Payment Card Industry Data Security Standard"},
        {"id": "hipaa", "name": "HIPAA", "description": "Health Insurance Portability and Accountability Act"},
        {"id": "gdpr", "name": "GDPR", "description": "General Data Protection Regulation"}
    ]
    
    return frameworks

# Security Metrics and Monitoring
@router.get("/metrics", response_model=Dict[str, Any])
async def get_security_metrics(
    current_user: TokenData = Depends(get_current_user)
):
    """Get comprehensive security metrics and monitoring data"""
    try:
        # This would integrate with the security middleware
        return {
            "security_events": {
                "total_events": 0,
                "recent_events_1h": 0,
                "threat_level_distribution": {},
                "top_event_types": {},
                "blocked_ips_count": 0
            },
            "vulnerability_status": {
                "last_scan": None,
                "total_vulnerabilities": 0,
                "critical_vulnerabilities": 0,
                "high_vulnerabilities": 0
            },
            "compliance_status": compliance_manager.get_compliance_summary(),
            "audit_status": {
                "last_audit": None,
                "total_findings": 0,
                "critical_findings": 0
            },
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error("Failed to retrieve security metrics", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve security metrics: {str(e)}"
        )

@router.get("/health", response_model=Dict[str, Any])
async def security_health_check(
    current_user: TokenData = Depends(get_current_user)
):
    """Security system health check"""
    try:
        health_status = {
            "security_audit": "healthy",
            "vulnerability_scanner": "healthy",
            "compliance_manager": "healthy",
            "cve_database": "healthy",
            "overall_status": "healthy",
            "last_check": datetime.utcnow().isoformat()
        }
        
        # Perform basic health checks
        try:
            # Test security auditor
            await security_auditor._audit_authentication()
            
            # Test vulnerability scanner
            vuln_scanner.get_scan_history(1)
            
            # Test compliance manager
            compliance_manager.get_compliance_summary()
            
        except Exception as e:
            health_status["overall_status"] = "degraded"
            health_status["issues"] = [str(e)]
        
        return health_status
        
    except Exception as e:
        logger.error("Security health check failed", error=str(e))
        return {
            "overall_status": "unhealthy",
            "error": str(e),
            "last_check": datetime.utcnow().isoformat()
        }

# Background task functions
async def _run_background_audit(scan_request: SecurityScanRequest, user_id: str):
    """Run security audit in background"""
    try:
        logger.info("Background security audit started", user_id=user_id)
        audit_results = await security_auditor.run_full_audit()
        logger.info("Background security audit completed", 
                   user_id=user_id,
                   findings=audit_results.get("total_findings", 0))
        # In production, would store results in database and notify user
    except Exception as e:
        logger.error("Background security audit failed", user_id=user_id, error=str(e))

async def _run_background_pentest(pentest_request: PenetrationTestRequest, user_id: str):
    """Run penetration test in background"""
    try:
        logger.info("Background penetration test started", user_id=user_id)
        automated_pentest = AutomatedPenTest(pentest_request.target_urls)
        results = await automated_pentest.run_automated_tests()
        logger.info("Background penetration test completed",
                   user_id=user_id,
                   findings=results.get("total_findings", 0))
        # In production, would store results in database and notify user
    except Exception as e:
        logger.error("Background penetration test failed", user_id=user_id, error=str(e))

async def _run_background_vuln_scan(scan_request: SecurityScanRequest, user_id: str):
    """Run vulnerability scan in background"""
    try:
        logger.info("Background vulnerability scan started", user_id=user_id)
        scan_results = await vuln_scanner.run_full_scan()
        logger.info("Background vulnerability scan completed",
                   user_id=user_id,
                   vulnerabilities=scan_results.get("total_vulnerabilities", 0))
        # In production, would store results in database and notify user
    except Exception as e:
        logger.error("Background vulnerability scan failed", user_id=user_id, error=str(e))

async def _run_background_compliance_assessment(assessment_request: ComplianceAssessmentRequest, user_id: str):
    """Run compliance assessment in background"""
    try:
        logger.info("Background compliance assessment started", user_id=user_id)
        
        # Assess each requested framework
        results = {}
        for framework_name in assessment_request.frameworks:
            try:
                framework = ComplianceFramework(framework_name)
                assessment = await compliance_manager.assess_framework(framework)
                if assessment:
                    results[framework_name] = assessment
            except ValueError:
                logger.warning("Unsupported framework in background assessment", framework=framework_name)
        
        logger.info("Background compliance assessment completed",
                   user_id=user_id,
                   frameworks_assessed=len(results))
        # In production, would store results in database and notify user
    except Exception as e:
        logger.error("Background compliance assessment failed", user_id=user_id, error=str(e))