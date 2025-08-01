"""
Automated Penetration Testing Framework
Enterprise-grade penetration testing automation for ERIP platform
"""

import asyncio
import aiohttp
import json
import base64
import hashlib
import random
import string
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, asdict
import structlog
from urllib.parse import urljoin, urlparse
import subprocess
import tempfile
import os

logger = structlog.get_logger()

class TestSeverity(str, Enum):
    """Penetration test finding severity"""
    CRITICAL = "critical"
    HIGH = "high" 
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

class TestCategory(str, Enum):
    """Penetration test categories"""
    AUTHENTICATION = "authentication"
    AUTHORIZATION = "authorization" 
    INPUT_VALIDATION = "input_validation"
    SESSION_MANAGEMENT = "session_management"
    CRYPTOGRAPHY = "cryptography"
    BUSINESS_LOGIC = "business_logic"
    API_SECURITY = "api_security"
    INFRASTRUCTURE = "infrastructure"

@dataclass
class PenTestFinding:
    """Penetration test finding"""
    finding_id: str
    test_name: str
    description: str
    severity: TestSeverity
    category: TestCategory
    target_url: str
    request_data: Optional[Dict[str, Any]] = None
    response_data: Optional[Dict[str, Any]] = None
    proof_of_concept: Optional[str] = None
    remediation: str = ""
    cvss_score: Optional[float] = None
    timestamp: str = ""
    
    def __post_init__(self):
        if not self.timestamp:
            self.timestamp = datetime.utcnow().isoformat()

class PenetrationTestFramework:
    """
    Automated penetration testing framework
    
    Features:
    - Automated API security testing
    - Authentication bypass attempts
    - SQL injection detection
    - XSS vulnerability scanning
    - Authorization flaws detection
    - Business logic testing
    """
    
    def __init__(self, base_url: str = "http://localhost:8001"):
        self.base_url = base_url
        self.session = None
        self.findings: List[PenTestFinding] = []
        self.test_vectors: Dict[str, List[str]] = self._load_test_vectors()
        
    async def run_full_penetration_test(self) -> Dict[str, Any]:
        """Execute comprehensive penetration test suite"""
        logger.info("Starting automated penetration testing", base_url=self.base_url)
        
        async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=30)) as session:
            self.session = session
            
            # Execute test categories
            test_suites = [
                self._test_authentication_security(),
                self._test_authorization_flaws(),
                self._test_input_validation(),
                self._test_api_security(),
                self._test_session_management(),
                self._test_business_logic(),
                self._test_cryptography(),
                self._test_infrastructure()
            ]
            
            results = await asyncio.gather(*test_suites, return_exceptions=True)
            
        # Compile penetration test report
        report = {
            "test_id": hashlib.sha256(f"{self.base_url}{datetime.utcnow()}".encode()).hexdigest()[:16],
            "target": self.base_url,
            "timestamp": datetime.utcnow().isoformat(),
            "total_findings": len(self.findings),
            "findings_by_severity": self._categorize_by_severity(),
            "findings_by_category": self._categorize_by_category(),
            "detailed_findings": [asdict(f) for f in self.findings],
            "test_coverage": self._analyze_test_coverage(),
            "risk_assessment": self._assess_overall_risk(),
            "executive_summary": self._generate_executive_summary()
        }
        
        logger.info("Penetration testing completed",
                   findings=len(self.findings),
                   critical=report["findings_by_severity"].get("critical", 0))
        
        return report
    
    async def _test_authentication_security(self) -> None:
        """Test authentication mechanisms for vulnerabilities"""
        logger.info("Testing authentication security")
        
        # Test login endpoint
        login_endpoints = ["/auth/login", "/api/auth/login", "/login"]
        
        for endpoint in login_endpoints:
            url = urljoin(self.base_url, endpoint)
            
            try:
                # Test for SQL injection in login
                await self._test_sql_injection_login(url)
                
                # Test for authentication bypass
                await self._test_auth_bypass(url)
                
                # Test for brute force protection
                await self._test_brute_force_protection(url)
                
                # Test for timing attacks
                await self._test_timing_attacks(url)
                
            except Exception as e:
                logger.debug("Error testing authentication endpoint", url=url, error=str(e))
    
    async def _test_sql_injection_login(self, url: str) -> None:
        """Test login for SQL injection vulnerabilities"""
        sql_payloads = [
            "admin' OR '1'='1",
            "admin'/*",
            "admin' OR 1=1--",
            "admin' OR 1=1#",
            "admin'||'a'='a",
            "') OR ('1'='1",
            "admin' UNION SELECT * FROM users--"
        ]
        
        for payload in sql_payloads:
            try:
                login_data = {
                    "email": payload,
                    "password": "test123"
                }
                
                async with self.session.post(url, json=login_data) as response:
                    if response.status == 200:
                        response_text = await response.text()
                        
                        # Check for successful login indicators
                        success_indicators = ["token", "access", "success", "welcome"]
                        if any(indicator in response_text.lower() for indicator in success_indicators):
                            self._add_finding(
                                "SQL_INJECTION_LOGIN",
                                "SQL Injection in Authentication",
                                f"Login endpoint vulnerable to SQL injection with payload: {payload}",
                                TestSeverity.CRITICAL,
                                TestCategory.AUTHENTICATION,
                                url,
                                request_data=login_data,
                                proof_of_concept=f"Payload '{payload}' bypassed authentication",
                                remediation="Use parameterized queries and input validation"
                            )
                            break
                            
            except Exception as e:
                logger.debug("SQL injection test error", payload=payload, error=str(e))
    
    async def _test_auth_bypass(self, url: str) -> None:
        """Test for authentication bypass vulnerabilities"""
        bypass_payloads = [
            {"email": "admin", "password": {"€ne": None}},  # NoSQL injection
            {"email": "admin", "password": {"€gt": ""}},
            {"email": {"€regex": ".*"}, "password": {"€regex": ".*"}},
        ]
        
        for payload in bypass_payloads:
            try:
                async with self.session.post(url, json=payload) as response:
                    if response.status == 200:
                        response_text = await response.text()
                        if "token" in response_text.lower():
                            self._add_finding(
                                "AUTH_BYPASS",
                                "Authentication Bypass",
                                "Authentication can be bypassed using NoSQL injection",
                                TestSeverity.CRITICAL,
                                TestCategory.AUTHENTICATION,
                                url,
                                request_data=payload,
                                remediation="Implement proper input validation and query sanitization"
                            )
                            
            except Exception as e:
                logger.debug("Auth bypass test error", error=str(e))
    
    async def _test_brute_force_protection(self, url: str) -> None:
        """Test for brute force protection"""
        # Attempt multiple failed logins
        failed_attempts = 0
        
        for i in range(10):
            login_data = {
                "email": "admin@example.com",
                "password": f"wrongpassword{i}"
            }
            
            try:
                async with self.session.post(url, json=login_data) as response:
                    if response.status in [401, 403]:
                        failed_attempts += 1
                    elif response.status == 429:  # Rate limited
                        return  # Good - rate limiting is working
                        
            except Exception as e:
                logger.debug("Brute force test error", error=str(e))
        
        # If we can make 10 failed attempts without rate limiting
        if failed_attempts >= 10:
            self._add_finding(
                "NO_BRUTE_FORCE_PROTECTION",
                "Missing Brute Force Protection",
                "Login endpoint lacks brute force protection mechanisms",
                TestSeverity.MEDIUM,
                TestCategory.AUTHENTICATION,
                url,
                remediation="Implement account lockout and rate limiting"
            )
    
    async def _test_timing_attacks(self, url: str) -> None:
        """Test for timing attack vulnerabilities"""
        # This would test for timing differences in authentication
        pass
    
    async def _test_authorization_flaws(self) -> None:
        """Test for authorization and access control flaws"""
        logger.info("Testing authorization flaws")
        
        # Test common endpoints for missing authorization
        test_endpoints = [
            "/api/users",
            "/api/admin",
            "/api/config",
            "/health",
            "/docs",
            "/redoc"
        ]
        
        for endpoint in test_endpoints:
            url = urljoin(self.base_url, endpoint)
            
            try:
                # Test without authentication
                async with self.session.get(url) as response:
                    if response.status == 200:
                        response_text = await response.text()
                        
                        # Check if sensitive data is exposed
                        sensitive_patterns = ["password", "token", "secret", "key", "admin"]
                        if any(pattern in response_text.lower() for pattern in sensitive_patterns):
                            self._add_finding(
                                "UNAUTHORIZED_ACCESS",
                                "Unauthorized Access to Sensitive Data",
                                f"Endpoint {endpoint} accessible without authentication and contains sensitive data",
                                TestSeverity.HIGH,
                                TestCategory.AUTHORIZATION,
                                url,
                                remediation="Implement proper authentication and authorization controls"
                            )
                
                # Test privilege escalation
                await self._test_privilege_escalation(url)
                
            except Exception as e:
                logger.debug("Authorization test error", url=url, error=str(e))
    
    async def _test_privilege_escalation(self, url: str) -> None:
        """Test for privilege escalation vulnerabilities"""
        # Test parameter manipulation for privilege escalation
        escalation_params = [
            {"admin": "true"},
            {"role": "admin"},
            {"user_type": "administrator"},
            {"is_admin": 1}
        ]
        
        for params in escalation_params:
            try:
                async with self.session.get(url, params=params) as response:
                    if response.status == 200:
                        response_text = await response.text()
                        if "admin" in response_text.lower():
                            self._add_finding(
                                "PRIVILEGE_ESCALATION",
                                "Privilege Escalation",
                                "Parameters can be manipulated to escalate privileges",
                                TestSeverity.HIGH,
                                TestCategory.AUTHORIZATION,
                                url,
                                request_data={"params": params},
                                remediation="Implement server-side authorization checks"
                            )
                            
            except Exception as e:
                logger.debug("Privilege escalation test error", error=str(e))
    
    async def _test_input_validation(self) -> None:
        """Test input validation vulnerabilities"""
        logger.info("Testing input validation")
        
        # Test common API endpoints
        test_endpoints = [
            "/api/users",
            "/api/search",
            "/api/data"
        ]
        
        for endpoint in test_endpoints:
            await self._test_xss_vulnerabilities(endpoint)
            await self._test_command_injection(endpoint)
            await self._test_path_traversal(endpoint)
    
    async def _test_xss_vulnerabilities(self, endpoint: str) -> None:
        """Test for XSS vulnerabilities"""
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<img src=x onerror=alert('XSS')>",
            "'\"><script>alert('XSS')</script>",
            "<svg onload=alert('XSS')>"
        ]
        
        url = urljoin(self.base_url, endpoint)
        
        for payload in xss_payloads:
            try:
                # Test GET parameters
                async with self.session.get(url, params={"q": payload}) as response:
                    if response.status == 200:
                        response_text = await response.text()
                        if payload in response_text:
                            self._add_finding(
                                "XSS_VULNERABILITY",
                                "Cross-Site Scripting (XSS)",
                                f"XSS vulnerability found with payload: {payload}",
                                TestSeverity.MEDIUM,
                                TestCategory.INPUT_VALIDATION,
                                url,
                                request_data={"payload": payload},
                                remediation="Implement proper output encoding and input validation"
                            )
                
                # Test POST data
                test_data = {"input": payload, "comment": payload}
                async with self.session.post(url, json=test_data) as response:
                    if response.status in [200, 201]:
                        response_text = await response.text()
                        if payload in response_text:
                            self._add_finding(
                                "XSS_VULNERABILITY_POST",
                                "Cross-Site Scripting (XSS) in POST",
                                f"XSS vulnerability in POST data with payload: {payload}",
                                TestSeverity.MEDIUM,
                                TestCategory.INPUT_VALIDATION,
                                url,
                                request_data=test_data,
                                remediation="Implement proper output encoding and input validation"
                            )
                            
            except Exception as e:
                logger.debug("XSS test error", payload=payload, error=str(e))
    
    async def _test_command_injection(self, endpoint: str) -> None:
        """Test for command injection vulnerabilities"""
        command_payloads = [
            "; ls -la",
            "| whoami",
            "& ping -c 1 127.0.0.1",
            "`id`",
            "€(whoami)",
            "; cat /etc/passwd"
        ]
        
        url = urljoin(self.base_url, endpoint)
        
        for payload in command_payloads:
            try:
                test_data = {"filename": payload, "path": payload, "command": payload}
                async with self.session.post(url, json=test_data) as response:
                    response_text = await response.text()
                    
                    # Look for command output indicators
                    command_indicators = ["uid=", "gid=", "root:", "bin:", "etc/passwd"]
                    if any(indicator in response_text for indicator in command_indicators):
                        self._add_finding(
                            "COMMAND_INJECTION",
                            "Command Injection",
                            f"Command injection vulnerability with payload: {payload}",
                            TestSeverity.CRITICAL,
                            TestCategory.INPUT_VALIDATION,
                            url,
                            request_data=test_data,
                            remediation="Validate and sanitize all user inputs, avoid system commands"
                        )
                        
            except Exception as e:
                logger.debug("Command injection test error", error=str(e))
    
    async def _test_path_traversal(self, endpoint: str) -> None:
        """Test for path traversal vulnerabilities"""
        traversal_payloads = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts",
            "....//....//....//etc/passwd",
            "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd"
        ]
        
        url = urljoin(self.base_url, endpoint)
        
        for payload in traversal_payloads:
            try:
                async with self.session.get(url, params={"file": payload, "path": payload}) as response:
                    if response.status == 200:
                        response_text = await response.text()
                        
                        # Look for system file content
                        system_file_indicators = ["root:", "daemon:", "localhost", "[hosts]"]
                        if any(indicator in response_text for indicator in system_file_indicators):
                            self._add_finding(
                                "PATH_TRAVERSAL",
                                "Path Traversal",
                                f"Path traversal vulnerability with payload: {payload}",
                                TestSeverity.HIGH,
                                TestCategory.INPUT_VALIDATION,
                                url,
                                request_data={"payload": payload},
                                remediation="Validate file paths and implement proper access controls"
                            )
                            
            except Exception as e:
                logger.debug("Path traversal test error", error=str(e))
    
    async def _test_api_security(self) -> None:
        """Test API-specific security issues"""
        logger.info("Testing API security")
        
        # Test for API documentation exposure
        api_docs = ["/docs", "/redoc", "/swagger", "/api-docs", "/api/docs"]
        for doc_endpoint in api_docs:
            url = urljoin(self.base_url, doc_endpoint)
            try:
                async with self.session.get(url) as response:
                    if response.status == 200:
                        self._add_finding(
                            "API_DOCS_EXPOSED",
                            "API Documentation Exposed",
                            f"API documentation accessible at {doc_endpoint}",
                            TestSeverity.LOW,
                            TestCategory.API_SECURITY,
                            url,
                            remediation="Restrict access to API documentation in production"
                        )
            except Exception as e:
                logger.debug("API docs test error", error=str(e))
        
        # Test for HTTP method tampering
        await self._test_http_method_tampering()
    
    async def _test_http_method_tampering(self) -> None:
        """Test for HTTP method tampering vulnerabilities"""
        test_url = urljoin(self.base_url, "/api/users/1")
        
        # Test if GET endpoint accepts other methods
        methods = ["PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]
        
        for method in methods:
            try:
                async with self.session.request(method, test_url) as response:
                    if response.status in [200, 201, 204]:
                        self._add_finding(
                            "HTTP_METHOD_TAMPERING",
                            "HTTP Method Tampering",
                            f"Endpoint accepts unexpected HTTP method: {method}",
                            TestSeverity.MEDIUM,
                            TestCategory.API_SECURITY,
                            test_url,
                            remediation="Implement proper HTTP method validation"
                        )
                        
            except Exception as e:
                logger.debug("HTTP method test error", method=method, error=str(e))
    
    async def _test_session_management(self) -> None:
        """Test session management security"""
        logger.info("Testing session management")
        # Session fixation, session hijacking tests would go here
        pass
    
    async def _test_business_logic(self) -> None:
        """Test business logic vulnerabilities"""
        logger.info("Testing business logic")
        # Business logic specific tests would go here
        pass
    
    async def _test_cryptography(self) -> None:
        """Test cryptographic implementations"""
        logger.info("Testing cryptography")
        # Crypto-specific tests would go here
        pass
    
    async def _test_infrastructure(self) -> None:
        """Test infrastructure security"""
        logger.info("Testing infrastructure")
        # Infrastructure tests would go here
        pass
    
    def _load_test_vectors(self) -> Dict[str, List[str]]:
        """Load test vectors for various vulnerability types"""
        return {
            "sql_injection": [
                "' OR '1'='1",
                "'; DROP TABLE users; --",
                "' UNION SELECT * FROM users--"
            ],
            "xss": [
                "<script>alert('XSS')</script>",
                "javascript:alert('XSS')",
                "<img src=x onerror=alert('XSS')>"
            ],
            "command_injection": [
                "; ls -la",
                "| whoami", 
                "& ping 127.0.0.1"
            ]
        }
    
    def _add_finding(
        self,
        finding_id: str,
        test_name: str,
        description: str,
        severity: TestSeverity,
        category: TestCategory,
        target_url: str,
        request_data: Optional[Dict[str, Any]] = None,
        response_data: Optional[Dict[str, Any]] = None,
        proof_of_concept: Optional[str] = None,
        remediation: str = ""
    ):
        """Add penetration test finding"""
        finding = PenTestFinding(
            finding_id=f"{finding_id}_{len(self.findings):04d}",
            test_name=test_name,
            description=description,
            severity=severity,
            category=category,
            target_url=target_url,
            request_data=request_data,
            response_data=response_data,
            proof_of_concept=proof_of_concept,
            remediation=remediation
        )
        self.findings.append(finding)
    
    def _categorize_by_severity(self) -> Dict[str, int]:
        """Categorize findings by severity"""
        categories = {}
        for finding in self.findings:
            severity = finding.severity.value
            categories[severity] = categories.get(severity, 0) + 1
        return categories
    
    def _categorize_by_category(self) -> Dict[str, int]:
        """Categorize findings by test category"""
        categories = {}
        for finding in self.findings:
            category = finding.category.value
            categories[category] = categories.get(category, 0) + 1
        return categories
    
    def _analyze_test_coverage(self) -> Dict[str, bool]:
        """Analyze test coverage across categories"""
        categories = list(TestCategory)
        coverage = {}
        
        for category in categories:
            coverage[category.value] = any(f.category == category for f in self.findings)
        
        return coverage
    
    def _assess_overall_risk(self) -> Dict[str, Any]:
        """Assess overall security risk"""
        critical_count = len([f for f in self.findings if f.severity == TestSeverity.CRITICAL])
        high_count = len([f for f in self.findings if f.severity == TestSeverity.HIGH])
        
        if critical_count > 0:
            risk_level = "critical"
        elif high_count > 2:
            risk_level = "high"
        elif high_count > 0:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        return {
            "overall_risk": risk_level,
            "critical_issues": critical_count,
            "high_issues": high_count,
            "total_issues": len(self.findings)
        }
    
    def _generate_executive_summary(self) -> Dict[str, Any]:
        """Generate executive summary"""
        return {
            "test_scope": f"Automated penetration testing of {self.base_url}",
            "key_findings": len([f for f in self.findings if f.severity in [TestSeverity.CRITICAL, TestSeverity.HIGH]]),
            "security_posture": self._assess_overall_risk()["overall_risk"],
            "immediate_actions": len([f for f in self.findings if f.severity == TestSeverity.CRITICAL]),
            "recommendations": "Address critical and high-severity findings immediately"
        }


class AutomatedPenTest:
    """Automated penetration testing orchestrator"""
    
    def __init__(self, targets: List[str] = None):
        self.targets = targets or ["http://localhost:8001"]
        
    async def run_automated_tests(self) -> Dict[str, Any]:
        """Run automated penetration tests against all targets"""
        all_results = {}
        
        for target in self.targets:
            framework = PenetrationTestFramework(target)
            results = await framework.run_full_penetration_test()
            all_results[target] = results
        
        return {
            "test_suite_id": hashlib.sha256(str(datetime.utcnow()).encode()).hexdigest()[:16],
            "targets_tested": len(self.targets),
            "total_findings": sum(result["total_findings"] for result in all_results.values()),
            "results_by_target": all_results,
            "overall_risk": self._assess_combined_risk(all_results)
        }
    
    def _assess_combined_risk(self, results: Dict[str, Any]) -> str:
        """Assess combined risk across all targets"""
        critical_total = sum(
            result["findings_by_severity"].get("critical", 0) 
            for result in results.values()
        )
        
        if critical_total > 0:
            return "critical"
        
        high_total = sum(
            result["findings_by_severity"].get("high", 0)
            for result in results.values()
        )
        
        if high_total > 5:
            return "high"
        elif high_total > 0:
            return "medium"
        else:
            return "low"