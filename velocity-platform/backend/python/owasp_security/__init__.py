"""
ERIP OWASP Security Enhancement Module
Advanced security hardening, vulnerability scanning, and compliance framework
"""

from .security_audit import SecurityAuditor, OWASPTop10Auditor, VulnerabilityScanner
from .penetration_testing import PenetrationTestFramework, AutomatedPenTest
from .security_middleware import SecurityMiddleware, SecurityHeadersMiddleware
from .compliance_framework import ComplianceFramework, SOC2Validator, ISO27001Validator
from .security_monitoring import SecurityMonitor, ThreatDetection, SecurityEventLogger
from .vulnerability_scanner import ContinuousVulnerabilityScanner, CVEDatabase

__all__ = [
    "SecurityAuditor",
    "OWASPTop10Auditor", 
    "VulnerabilityScanner",
    "PenetrationTestFramework",
    "AutomatedPenTest",
    "SecurityMiddleware",
    "SecurityHeadersMiddleware", 
    "ComplianceFramework",
    "SOC2Validator",
    "ISO27001Validator",
    "SecurityMonitor",
    "ThreatDetection",
    "SecurityEventLogger",
    "ContinuousVulnerabilityScanner",
    "CVEDatabase"
]