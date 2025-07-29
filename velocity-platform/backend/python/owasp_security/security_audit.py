"""
OWASP Security Auditor
Comprehensive security audit system based on OWASP Top 10 and enterprise security standards
"""

import asyncio
import inspect
import ast
import os
import re
import hashlib
import json
from typing import Dict, List, Optional, Any, Set, Tuple, Union
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, asdict
import structlog
from pathlib import Path

logger = structlog.get_logger()

class SecuritySeverity(str, Enum):
    """Security finding severity levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium" 
    LOW = "low"
    INFO = "info"

class OWASPCategory(str, Enum):
    """OWASP Top 10 2021 Categories"""
    A01_BROKEN_ACCESS_CONTROL = "A01:2021 – Broken Access Control"
    A02_CRYPTOGRAPHIC_FAILURES = "A02:2021 – Cryptographic Failures" 
    A03_INJECTION = "A03:2021 – Injection"
    A04_INSECURE_DESIGN = "A04:2021 – Insecure Design"
    A05_SECURITY_MISCONFIGURATION = "A05:2021 – Security Misconfiguration"
    A06_VULNERABLE_COMPONENTS = "A06:2021 – Vulnerable and Outdated Components"
    A07_IDENTIFICATION_FAILURES = "A07:2021 – Identification and Authentication Failures"
    A08_SOFTWARE_INTEGRITY_FAILURES = "A08:2021 – Software and Data Integrity Failures"
    A09_LOGGING_FAILURES = "A09:2021 – Security Logging and Monitoring Failures"
    A10_SSRF = "A10:2021 – Server-Side Request Forgery (SSRF)"

@dataclass
class SecurityFinding:
    """Security audit finding"""
    finding_id: str
    title: str
    description: str
    severity: SecuritySeverity
    owasp_category: OWASPCategory
    file_path: str
    line_number: Optional[int] = None
    code_snippet: Optional[str] = None
    recommendation: str = ""
    cwe_id: Optional[str] = None
    cvss_score: Optional[float] = None
    remediation_effort: str = "medium"
    compliance_impact: List[str] = None
    
    def __post_init__(self):
        if self.compliance_impact is None:
            self.compliance_impact = []

class SecurityAuditor:
    """
    Comprehensive security auditor for ERIP platform
    
    Performs automated security analysis across:
    - Code vulnerabilities
    - Configuration issues
    - Authentication/authorization flaws
    - Input validation problems
    - Cryptographic weaknesses
    """
    
    def __init__(self, base_path: str = "."):
        self.base_path = Path(base_path)
        self.findings: List[SecurityFinding] = []
        self.scan_results: Dict[str, Any] = {}
        
    async def run_full_audit(self) -> Dict[str, Any]:
        """Run complete security audit"""
        logger.info("Starting comprehensive security audit")
        
        audit_tasks = [
            self._audit_authentication(),
            self._audit_authorization(), 
            self._audit_input_validation(),
            self._audit_cryptography(),
            self._audit_session_management(),
            self._audit_error_handling(),
            self._audit_logging(),
            self._audit_configuration(),
            self._audit_dependencies(),
            self._audit_api_security()
        ]
        
        results = await asyncio.gather(*audit_tasks, return_exceptions=True)
        
        # Compile audit report
        audit_report = {
            "audit_id": hashlib.sha256(str(datetime.utcnow()).encode()).hexdigest()[:16],
            "timestamp": datetime.utcnow().isoformat(),
            "total_findings": len(self.findings),
            "findings_by_severity": self._categorize_by_severity(),
            "owasp_coverage": self._analyze_owasp_coverage(),
            "compliance_impact": self._analyze_compliance_impact(),
            "detailed_findings": [asdict(f) for f in self.findings],
            "recommendations": self._generate_recommendations(),
            "risk_score": self._calculate_risk_score()
        }
        
        logger.info("Security audit completed", 
                   findings=len(self.findings),
                   critical=audit_report["findings_by_severity"].get("critical", 0))
        
        return audit_report
    
    async def _audit_authentication(self) -> None:
        """Audit authentication mechanisms"""
        auth_files = self._find_files_with_patterns(["auth", "login", "password", "jwt"])
        
        for file_path in auth_files:
            try:
                content = self._read_file_safely(file_path)
                if not content:
                    continue
                
                # Check for weak password policies
                if re.search(r'password.*=.*["\'][^"\']{1,7}["\']', content, re.IGNORECASE):
                    self._add_finding(
                        "WEAK_PASSWORD_POLICY",
                        "Weak password policy detected", 
                        "Password requirements appear insufficient",
                        SecuritySeverity.MEDIUM,
                        OWASPCategory.A07_IDENTIFICATION_FAILURES,
                        str(file_path),
                        recommendation="Implement strong password policy with min 12 characters, complexity requirements"
                    )
                
                # Check for hardcoded secrets
                secret_patterns = [
                    r'(secret|password|key|token).*=.*["\'][^"\']{8,}["\']',
                    r'["\'][A-Za-z0-9+/]{40,}={0,2}["\']',  # Base64 tokens
                    r'["\'][a-f0-9]{32,}["\']'  # Hex keys
                ]
                
                for pattern in secret_patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        self._add_finding(
                            "HARDCODED_SECRET",
                            "Hardcoded secret detected",
                            "Secrets should not be hardcoded in source code",
                            SecuritySeverity.HIGH,
                            OWASPCategory.A02_CRYPTOGRAPHIC_FAILURES,
                            str(file_path),
                            recommendation="Use environment variables or secure key management system"
                        )
                
                # Check for weak JWT configuration
                if "jwt" in content.lower():
                    if re.search(r'algorithm.*=.*["\']none["\']', content, re.IGNORECASE):
                        self._add_finding(
                            "WEAK_JWT_ALGORITHM",
                            "Weak JWT algorithm configuration",
                            "JWT 'none' algorithm allows token forgery",
                            SecuritySeverity.CRITICAL,
                            OWASPCategory.A02_CRYPTOGRAPHIC_FAILURES,
                            str(file_path),
                            recommendation="Use strong algorithms like HS256, RS256, or ES256"
                        )
                
            except Exception as e:
                logger.warning("Error auditing authentication file", file=str(file_path), error=str(e))
    
    async def _audit_authorization(self) -> None:
        """Audit authorization and access control"""
        auth_files = self._find_files_with_patterns(["permission", "role", "access", "auth"])
        
        for file_path in auth_files:
            try:
                content = self._read_file_safely(file_path)
                if not content:
                    continue
                
                # Check for missing authorization checks
                if re.search(r'@router\.(get|post|put|delete)', content):
                    # Look for endpoints without proper authorization
                    endpoint_matches = re.finditer(r'@router\.(get|post|put|delete)\([^)]*\)\s*\n\s*async def\s+([^(]+)', content)
                    for match in endpoint_matches:
                        func_start = match.end()
                        func_lines = content[func_start:func_start + 500]
                        
                        if not re.search(r'Depends\([^)]*auth[^)]*\)', func_lines):
                            self._add_finding(
                                "MISSING_AUTHORIZATION",
                                "Missing authorization check",
                                f"Endpoint {match.group(2)} may lack proper authorization",
                                SecuritySeverity.HIGH,
                                OWASPCategory.A01_BROKEN_ACCESS_CONTROL,
                                str(file_path),
                                recommendation="Add proper authorization dependency to endpoint"
                            )
                
                # Check for overly permissive CORS
                cors_match = re.search(r'allow_origins.*=.*\["?\*"?\]', content)
                if cors_match:
                    self._add_finding(
                        "PERMISSIVE_CORS",
                        "Overly permissive CORS configuration",
                        "Wildcard CORS origin allows requests from any domain",
                        SecuritySeverity.MEDIUM,
                        OWASPCategory.A05_SECURITY_MISCONFIGURATION,
                        str(file_path),
                        recommendation="Specify explicit allowed origins instead of wildcard"
                    )
                
            except Exception as e:
                logger.warning("Error auditing authorization file", file=str(file_path), error=str(e))
    
    async def _audit_input_validation(self) -> None:
        """Audit input validation and injection vulnerabilities"""
        code_files = self._find_files_with_patterns(["router", "api", "endpoint"], extensions=[".py"])
        
        for file_path in code_files:
            try:
                content = self._read_file_safely(file_path)
                if not content:
                    continue
                
                # Check for SQL injection risks
                sql_patterns = [
                    r'execute\([^)]*\+[^)]*\)',  # String concatenation in SQL
                    r'query\([^)]*%[^)]*\)',     # String formatting in SQL  
                    r'f["\'][^"\']*SELECT[^"\']*{[^}]*}',  # F-string in SQL
                ]
                
                for pattern in sql_patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        self._add_finding(
                            "SQL_INJECTION_RISK",
                            "Potential SQL injection vulnerability",
                            "Dynamic SQL query construction detected",
                            SecuritySeverity.HIGH,
                            OWASPCategory.A03_INJECTION,
                            str(file_path),
                            recommendation="Use parameterized queries or ORM methods"
                        )
                
                # Check for command injection
                command_patterns = [
                    r'os\.system\([^)]*\+[^)]*\)',
                    r'subprocess\.[^(]+\([^)]*\+[^)]*\)',
                    r'exec\([^)]*\+[^)]*\)'
                ]
                
                for pattern in command_patterns:
                    if re.search(pattern, content):
                        self._add_finding(
                            "COMMAND_INJECTION_RISK", 
                            "Potential command injection vulnerability",
                            "Dynamic command execution detected",
                            SecuritySeverity.CRITICAL,
                            OWASPCategory.A03_INJECTION,
                            str(file_path),
                            recommendation="Validate and sanitize all user inputs used in commands"
                        )
                
                # Check for XSS vulnerabilities in templates
                if re.search(r'\{\{[^}]*\|safe[^}]*\}\}', content):
                    self._add_finding(
                        "XSS_RISK",
                        "Potential XSS vulnerability", 
                        "Template marked as safe without proper escaping",
                        SecuritySeverity.MEDIUM,
                        OWASPCategory.A03_INJECTION,
                        str(file_path),
                        recommendation="Ensure proper output encoding and validation"
                    )
                
            except Exception as e:
                logger.warning("Error auditing input validation", file=str(file_path), error=str(e))
    
    async def _audit_cryptography(self) -> None:
        """Audit cryptographic implementations"""
        crypto_files = self._find_files_with_patterns(["crypt", "hash", "encrypt", "cipher", "ssl", "tls"])
        
        for file_path in crypto_files:
            try:
                content = self._read_file_safely(file_path)
                if not content:
                    continue
                
                # Check for weak cryptographic algorithms
                weak_algorithms = [
                    r'MD5|md5',
                    r'SHA1|sha1', 
                    r'DES|des',
                    r'RC4|rc4',
                    r'ECB'
                ]
                
                for algo_pattern in weak_algorithms:
                    if re.search(algo_pattern, content):
                        self._add_finding(
                            "WEAK_CRYPTOGRAPHY",
                            "Weak cryptographic algorithm detected",
                            f"Usage of weak cryptographic algorithm found",
                            SecuritySeverity.HIGH,
                            OWASPCategory.A02_CRYPTOGRAPHIC_FAILURES,
                            str(file_path),
                            recommendation="Use strong algorithms like SHA-256, AES-256, RSA-2048+"
                        )
                
                # Check for insufficient key lengths
                key_patterns = [
                    r'key_size.*=.*\b(512|768|1024)\b',
                    r'keysize.*=.*\b(512|768|1024)\b'
                ]
                
                for pattern in key_patterns:
                    if re.search(pattern, content):
                        self._add_finding(
                            "WEAK_KEY_SIZE",
                            "Insufficient cryptographic key size",
                            "Key size below current security standards",
                            SecuritySeverity.MEDIUM,
                            OWASPCategory.A02_CRYPTOGRAPHIC_FAILURES,
                            str(file_path),
                            recommendation="Use minimum 2048-bit RSA or 256-bit ECC keys"
                        )
                
            except Exception as e:
                logger.warning("Error auditing cryptography", file=str(file_path), error=str(e))
    
    async def _audit_session_management(self) -> None:
        """Audit session management security"""
        session_files = self._find_files_with_patterns(["session", "cookie", "token"])
        
        for file_path in session_files:
            try:
                content = self._read_file_safely(file_path)
                if not content:
                    continue
                
                # Check for insecure cookie settings
                if re.search(r'secure.*=.*False', content, re.IGNORECASE):
                    self._add_finding(
                        "INSECURE_COOKIE",
                        "Insecure cookie configuration",
                        "Cookies not marked as secure",
                        SecuritySeverity.MEDIUM, 
                        OWASPCategory.A05_SECURITY_MISCONFIGURATION,
                        str(file_path),
                        recommendation="Set secure flag on all session cookies"
                    )
                
                # Check for missing HttpOnly flag
                if re.search(r'httponly.*=.*False', content, re.IGNORECASE):
                    self._add_finding(
                        "MISSING_HTTPONLY",
                        "Missing HttpOnly flag on cookies",
                        "Cookies accessible via JavaScript",
                        SecuritySeverity.MEDIUM,
                        OWASPCategory.A05_SECURITY_MISCONFIGURATION, 
                        str(file_path),
                        recommendation="Set HttpOnly flag on session cookies"
                    )
                
            except Exception as e:
                logger.warning("Error auditing session management", file=str(file_path), error=str(e))
    
    async def _audit_error_handling(self) -> None:
        """Audit error handling for information disclosure"""
        code_files = self._find_files_with_patterns(["exception", "error", "try", "catch"], extensions=[".py"])
        
        for file_path in code_files:
            try:
                content = self._read_file_safely(file_path)
                if not content:
                    continue
                
                # Check for detailed error messages in production
                if re.search(r'raise.*Exception\([^)]*traceback', content):
                    self._add_finding(
                        "INFORMATION_DISCLOSURE",
                        "Potential information disclosure in error handling",
                        "Detailed error messages may expose sensitive information",
                        SecuritySeverity.LOW,
                        OWASPCategory.A09_LOGGING_FAILURES,
                        str(file_path),
                        recommendation="Sanitize error messages in production environment"
                    )
                
            except Exception as e:
                logger.warning("Error auditing error handling", file=str(file_path), error=str(e))
    
    async def _audit_logging(self) -> None:
        """Audit security logging and monitoring"""
        # This would be implemented to check logging configurations
        pass
    
    async def _audit_configuration(self) -> None:
        """Audit security configuration"""
        config_files = self._find_files_with_patterns(["config", "settings"], extensions=[".py", ".json", ".yml", ".yaml"])
        
        for file_path in config_files:
            try:
                content = self._read_file_safely(file_path)
                if not content:
                    continue
                
                # Check for debug mode in production
                if re.search(r'debug.*=.*True', content, re.IGNORECASE):
                    self._add_finding(
                        "DEBUG_MODE_ENABLED",
                        "Debug mode enabled",
                        "Debug mode may expose sensitive information",
                        SecuritySeverity.MEDIUM,
                        OWASPCategory.A05_SECURITY_MISCONFIGURATION,
                        str(file_path),
                        recommendation="Disable debug mode in production"
                    )
                
            except Exception as e:
                logger.warning("Error auditing configuration", file=str(file_path), error=str(e))
    
    async def _audit_dependencies(self) -> None:
        """Audit dependencies for known vulnerabilities"""
        # Check requirements files for outdated packages
        req_files = ["requirements.txt", "requirements-minimal.txt", "pyproject.toml"]
        
        for req_file in req_files:
            file_path = self.base_path / req_file
            if file_path.exists():
                # This would integrate with vulnerability databases
                # For now, just flag very old versions
                pass
    
    async def _audit_api_security(self) -> None:
        """Audit API security configurations"""
        api_files = self._find_files_with_patterns(["router", "api", "endpoint"], extensions=[".py"])
        
        for file_path in api_files:
            try:
                content = self._read_file_safely(file_path)
                if not content:
                    continue
                
                # Check for missing rate limiting
                if re.search(r'@router\.(get|post|put|delete)', content):
                    if not re.search(r'rate.*limit|throttle', content, re.IGNORECASE):
                        self._add_finding(
                            "MISSING_RATE_LIMITING",
                            "Missing rate limiting on API endpoints", 
                            "API endpoints may be vulnerable to abuse",
                            SecuritySeverity.MEDIUM,
                            OWASPCategory.A04_INSECURE_DESIGN,
                            str(file_path),
                            recommendation="Implement rate limiting on all public endpoints"
                        )
                
            except Exception as e:
                logger.warning("Error auditing API security", file=str(file_path), error=str(e))
    
    def _find_files_with_patterns(self, patterns: List[str], extensions: List[str] = None) -> List[Path]:
        """Find files containing specific patterns"""
        if extensions is None:
            extensions = [".py"]
        
        found_files = []
        for ext in extensions:
            for file_path in self.base_path.rglob(f"*{ext}"):
                if any(pattern in str(file_path).lower() for pattern in patterns):
                    found_files.append(file_path)
        
        return found_files
    
    def _read_file_safely(self, file_path: Path) -> Optional[str]:
        """Safely read file content"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            logger.warning("Could not read file", file=str(file_path), error=str(e))
            return None
    
    def _add_finding(
        self, 
        finding_id: str,
        title: str, 
        description: str,
        severity: SecuritySeverity,
        owasp_category: OWASPCategory,
        file_path: str,
        line_number: Optional[int] = None,
        recommendation: str = ""
    ):
        """Add security finding"""
        finding = SecurityFinding(
            finding_id=f"{finding_id}_{len(self.findings):04d}",
            title=title,
            description=description, 
            severity=severity,
            owasp_category=owasp_category,
            file_path=file_path,
            line_number=line_number,
            recommendation=recommendation
        )
        self.findings.append(finding)
    
    def _categorize_by_severity(self) -> Dict[str, int]:
        """Categorize findings by severity"""
        categories = {}
        for finding in self.findings:
            severity = finding.severity.value
            categories[severity] = categories.get(severity, 0) + 1
        return categories
    
    def _analyze_owasp_coverage(self) -> Dict[str, int]:
        """Analyze OWASP Top 10 coverage"""
        owasp_coverage = {}
        for finding in self.findings:
            category = finding.owasp_category.value
            owasp_coverage[category] = owasp_coverage.get(category, 0) + 1
        return owasp_coverage
    
    def _analyze_compliance_impact(self) -> Dict[str, List[str]]:
        """Analyze compliance framework impacts"""
        return {
            "SOC2": [f.finding_id for f in self.findings if f.severity in [SecuritySeverity.CRITICAL, SecuritySeverity.HIGH]],
            "ISO27001": [f.finding_id for f in self.findings if f.severity in [SecuritySeverity.CRITICAL, SecuritySeverity.HIGH, SecuritySeverity.MEDIUM]],
            "NIST": [f.finding_id for f in self.findings]
        }
    
    def _generate_recommendations(self) -> List[Dict[str, Any]]:
        """Generate prioritized remediation recommendations"""
        recommendations = []
        
        # Group by severity and provide action items
        critical_findings = [f for f in self.findings if f.severity == SecuritySeverity.CRITICAL]
        if critical_findings:
            recommendations.append({
                "priority": "immediate",
                "action": "Address critical security vulnerabilities",
                "findings_count": len(critical_findings),
                "estimated_effort": "high"
            })
        
        high_findings = [f for f in self.findings if f.severity == SecuritySeverity.HIGH] 
        if high_findings:
            recommendations.append({
                "priority": "high",
                "action": "Remediate high-severity security issues",
                "findings_count": len(high_findings),
                "estimated_effort": "medium"
            })
        
        return recommendations
    
    def _calculate_risk_score(self) -> float:
        """Calculate overall risk score (0-100)"""
        if not self.findings:
            return 0.0
        
        severity_weights = {
            SecuritySeverity.CRITICAL: 10.0,
            SecuritySeverity.HIGH: 7.0,
            SecuritySeverity.MEDIUM: 4.0,
            SecuritySeverity.LOW: 2.0,
            SecuritySeverity.INFO: 1.0
        }
        
        total_score = sum(severity_weights.get(f.severity, 1.0) for f in self.findings)
        max_possible = len(self.findings) * severity_weights[SecuritySeverity.CRITICAL]
        
        return min(100.0, (total_score / max_possible) * 100) if max_possible > 0 else 0.0


class OWASPTop10Auditor(SecurityAuditor):
    """Specialized auditor focused on OWASP Top 10 compliance"""
    
    async def run_owasp_audit(self) -> Dict[str, Any]:
        """Run OWASP Top 10 focused audit"""
        return await self.run_full_audit()


class VulnerabilityScanner:
    """Automated vulnerability scanner"""
    
    def __init__(self):
        self.vulnerabilities: List[Dict[str, Any]] = []
    
    async def scan_dependencies(self) -> Dict[str, Any]:
        """Scan dependencies for known vulnerabilities"""
        # This would integrate with CVE databases
        return {
            "scan_type": "dependency_vulnerability",
            "vulnerabilities_found": len(self.vulnerabilities),
            "scan_timestamp": datetime.utcnow().isoformat()
        }
    
    async def scan_network_services(self) -> Dict[str, Any]:
        """Scan network services for vulnerabilities"""
        # This would perform network scanning
        return {
            "scan_type": "network_vulnerability", 
            "services_scanned": 0,
            "vulnerabilities_found": 0
        }