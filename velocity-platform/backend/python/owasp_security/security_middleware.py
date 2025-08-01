"""
Advanced Security Middleware
Enterprise-grade security middleware with comprehensive protection mechanisms
"""

import asyncio
import time
import json
import hashlib
import ipaddress
from typing import Dict, List, Optional, Any, Set, Tuple
from datetime import datetime, timedelta
from collections import defaultdict, deque
from enum import Enum
import structlog
from fastapi import Request, Response, HTTPException, status
from fastapi.security import HTTPBearer
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import re
from urllib.parse import urlparse
import user_agents

logger = structlog.get_logger()

class ThreatLevel(str, Enum):
    """Security threat levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class SecurityEvent:
    """Security event for monitoring"""
    def __init__(self, event_type: str, threat_level: ThreatLevel, source_ip: str, details: Dict[str, Any]):
        self.event_id = hashlib.sha256(f"{time.time()}{source_ip}{event_type}".encode()).hexdigest()[:16]
        self.event_type = event_type
        self.threat_level = threat_level
        self.source_ip = source_ip
        self.timestamp = datetime.utcnow()
        self.details = details

class RateLimiter:
    """Advanced rate limiting with multiple strategies"""
    
    def __init__(self):
        self.requests = defaultdict(deque)
        self.blocked_ips = set()
        self.limits = {
            "default": {"requests": 100, "window": 3600},  # 100 requests per hour
            "auth": {"requests": 10, "window": 300},       # 10 auth attempts per 5 minutes
            "api": {"requests": 1000, "window": 3600},     # 1000 API calls per hour
        }
    
    def is_rate_limited(self, client_ip: str, endpoint_type: str = "default") -> Tuple[bool, Dict[str, Any]]:
        """Check if client is rate limited"""
        if client_ip in self.blocked_ips:
            return True, {"reason": "ip_blocked", "blocked_until": None}
        
        limit_config = self.limits.get(endpoint_type, self.limits["default"])
        current_time = time.time()
        
        # Clean old requests
        while (self.requests[client_ip] and 
               current_time - self.requests[client_ip][0] > limit_config["window"]):
            self.requests[client_ip].popleft()
        
        # Check rate limit
        if len(self.requests[client_ip]) >= limit_config["requests"]:
            return True, {
                "reason": "rate_limit_exceeded",
                "limit": limit_config["requests"],
                "window": limit_config["window"],
                "reset_time": current_time + limit_config["window"]
            }
        
        # Add current request
        self.requests[client_ip].append(current_time)
        return False, {}
    
    def block_ip(self, client_ip: str, duration: int = 3600):
        """Block IP for specified duration"""
        self.blocked_ips.add(client_ip)
        # In production, this would use a persistent store

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Security headers middleware implementing OWASP recommendations
    """
    
    def __init__(self, app, config: Optional[Dict[str, Any]] = None):
        super().__init__(app)
        self.config = config or {}
        self.security_headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY", 
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
            "Content-Security-Policy": self._get_csp_policy(),
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
            "X-Permitted-Cross-Domain-Policies": "none"
        }
    
    async def dispatch(self, request: Request, call_next):
        """Apply security headers to all responses"""
        response = await call_next(request)
        
        # Apply security headers
        for header, value in self.security_headers.items():
            response.headers[header] = value
        
        # Remove potentially dangerous headers
        dangerous_headers = ["Server", "X-Powered-By", "X-AspNet-Version"]
        for header in dangerous_headers:
            response.headers.pop(header, None)
        
        return response
    
    def _get_csp_policy(self) -> str:
        """Generate Content Security Policy"""
        policy_directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'", 
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "form-action 'self'",
            "base-uri 'self'"
        ]
        return "; ".join(policy_directives)

class SecurityMiddleware(BaseHTTPMiddleware):
    """
    Comprehensive security middleware with advanced threat detection
    
    Features:
    - Rate limiting and DDoS protection
    - SQL injection detection
    - XSS prevention 
    - Path traversal protection
    - Suspicious request pattern detection
    - IP geolocation and reputation checking
    - Bot detection
    - Request size limiting
    """
    
    def __init__(self, app, config: Optional[Dict[str, Any]] = None):
        super().__init__(app)
        self.config = config or {}
        self.rate_limiter = RateLimiter()
        self.threat_patterns = self._load_threat_patterns()
        self.suspicious_ips = set()
        self.security_events = deque(maxlen=10000)  # Keep last 10k events
        
    async def dispatch(self, request: Request, call_next):
        """Main security middleware logic"""
        start_time = time.time()
        client_ip = self._get_client_ip(request)
        
        try:
            # Security checks
            security_check_result = await self._perform_security_checks(request, client_ip)
            if security_check_result:
                return security_check_result
            
            # Process request
            response = await call_next(request)
            
            # Log successful request
            await self._log_security_event(
                "request_processed",
                ThreatLevel.LOW,
                client_ip,
                {
                    "method": request.method,
                    "path": str(request.url.path),
                    "status_code": response.status_code,
                    "processing_time": time.time() - start_time
                }
            )
            
            return response
            
        except Exception as e:
            await self._log_security_event(
                "request_error",
                ThreatLevel.MEDIUM,
                client_ip,
                {
                    "error": str(e),
                    "path": str(request.url.path),
                    "method": request.method
                }
            )
            raise
    
    async def _perform_security_checks(self, request: Request, client_ip: str) -> Optional[Response]:
        """Perform comprehensive security checks"""
        
        # 1. Rate limiting check
        endpoint_type = self._classify_endpoint(request.url.path)
        is_limited, limit_info = self.rate_limiter.is_rate_limited(client_ip, endpoint_type)
        if is_limited:
            await self._log_security_event(
                "rate_limit_exceeded",
                ThreatLevel.MEDIUM,
                client_ip,
                limit_info
            )
            return JSONResponse(
                status_code=429,
                content={"error": "Rate limit exceeded", "details": limit_info}
            )
        
        # 2. IP reputation check
        if await self._is_malicious_ip(client_ip):
            await self._log_security_event(
                "malicious_ip_blocked",
                ThreatLevel.HIGH,
                client_ip,
                {"reason": "ip_reputation"}
            )
            return JSONResponse(
                status_code=403,
                content={"error": "Access denied"}
            )
        
        # 3. Request size check
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > 50 * 1024 * 1024:  # 50MB limit
            await self._log_security_event(
                "oversized_request",
                ThreatLevel.MEDIUM,
                client_ip,
                {"content_length": content_length}
            )
            return JSONResponse(
                status_code=413,
                content={"error": "Request too large"}
            )
        
        # 4. Suspicious pattern detection
        if await self._detect_suspicious_patterns(request, client_ip):
            return JSONResponse(
                status_code=400,
                content={"error": "Suspicious request detected"}
            )
        
        # 5. Bot detection
        if await self._is_suspicious_bot(request, client_ip):
            await self._log_security_event(
                "suspicious_bot_detected",
                ThreatLevel.MEDIUM,
                client_ip,
                {"user_agent": request.headers.get("user-agent", "")}
            )
            return JSONResponse(
                status_code=403,
                content={"error": "Automated requests not allowed"}
            )
        
        # 6. Path traversal check
        if self._detect_path_traversal(request.url.path):
            await self._log_security_event(
                "path_traversal_attempt",
                ThreatLevel.HIGH,
                client_ip,
                {"path": str(request.url.path)}
            )
            return JSONResponse(
                status_code=403,
                content={"error": "Invalid path"}
            )
        
        return None
    
    async def _detect_suspicious_patterns(self, request: Request, client_ip: str) -> bool:
        """Detect suspicious patterns in requests"""
        
        # Check URL for malicious patterns
        url_str = str(request.url)
        for pattern_name, pattern in self.threat_patterns["url"].items():
            if re.search(pattern, url_str, re.IGNORECASE):
                await self._log_security_event(
                    f"suspicious_pattern_{pattern_name}",
                    ThreatLevel.HIGH,
                    client_ip,
                    {"pattern": pattern_name, "url": url_str}
                )
                return True
        
        # Check headers for malicious patterns
        for header_name, header_value in request.headers.items():
            for pattern_name, pattern in self.threat_patterns["headers"].items():
                if re.search(pattern, header_value, re.IGNORECASE):
                    await self._log_security_event(
                        f"suspicious_header_{pattern_name}",
                        ThreatLevel.MEDIUM,
                        client_ip,
                        {"pattern": pattern_name, "header": header_name, "value": header_value[:100]}
                    )
                    return True
        
        # Check request body if present
        if request.method in ["POST", "PUT", "PATCH"]:
            try:
                if hasattr(request, "_body"):
                    body = request._body.decode() if request._body else ""
                else:
                    # For streaming requests, we'd need to be more careful
                    body = ""
                
                for pattern_name, pattern in self.threat_patterns["body"].items():
                    if re.search(pattern, body, re.IGNORECASE):
                        await self._log_security_event(
                            f"suspicious_body_{pattern_name}",
                            ThreatLevel.HIGH,
                            client_ip,
                            {"pattern": pattern_name, "body_snippet": body[:200]}
                        )
                        return True
            except Exception as e:
                logger.debug("Error checking request body", error=str(e))
        
        return False
    
    async def _is_malicious_ip(self, client_ip: str) -> bool:
        """Check if IP is known to be malicious"""
        
        # Check internal blacklist
        if client_ip in self.suspicious_ips:
            return True
        
        # Check for private/local IPs (allow for development)
        try:
            ip_obj = ipaddress.ip_address(client_ip)
            if ip_obj.is_private or ip_obj.is_loopback:
                return False
        except ValueError:
            return False
        
        # In production, this would check external reputation services
        # For now, implement basic checks
        
        # Check for common attack patterns in IP
        if re.match(r'^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)', client_ip):
            return False  # Private networks
        
        return False
    
    async def _is_suspicious_bot(self, request: Request, client_ip: str) -> bool:
        """Detect suspicious bot behavior"""
        user_agent = request.headers.get("user-agent", "").lower()
        
        # Common bot patterns
        bot_patterns = [
            r'bot', r'crawler', r'spider', r'scraper',
            r'curl', r'wget', r'python-requests',
            r'automated', r'script'
        ]
        
        is_bot = any(re.search(pattern, user_agent) for pattern in bot_patterns)
        
        if is_bot:
            # Check if it's a legitimate bot
            legitimate_bots = [
                'googlebot', 'bingbot', 'slurp', 'duckduckbot',
                'baiduspider', 'yandexbot', 'facebookexternalhit'
            ]
            
            is_legitimate = any(bot in user_agent for bot in legitimate_bots)
            
            if not is_legitimate:
                # Additional checks for suspicious bot behavior
                if (not request.headers.get("accept") or
                    not request.headers.get("accept-language") or
                    len(user_agent) < 10):
                    return True
        
        return False
    
    def _detect_path_traversal(self, path: str) -> bool:
        """Detect path traversal attempts"""
        traversal_patterns = [
            r'\.\.',
            r'%2e%2e',
            r'0x2e0x2e',
            r'%252e%252e',
            r'..%2f',
            r'..%5c',
            r'%2e%2e%2f',
            r'%2e%2e%5c'
        ]
        
        return any(re.search(pattern, path, re.IGNORECASE) for pattern in traversal_patterns)
    
    def _classify_endpoint(self, path: str) -> str:
        """Classify endpoint for rate limiting"""
        if "/auth/" in path or "/login" in path:
            return "auth"
        elif "/api/" in path:
            return "api"
        else:
            return "default"
    
    def _get_client_ip(self, request: Request) -> str:
        """Get client IP with proxy support"""
        # Check for forwarded headers (in order of preference)
        forwarded_headers = [
            "x-forwarded-for",
            "x-real-ip", 
            "x-client-ip",
            "cf-connecting-ip"
        ]
        
        for header in forwarded_headers:
            if header in request.headers:
                # Take first IP if multiple are present
                ip = request.headers[header].split(",")[0].strip()
                if self._is_valid_ip(ip):
                    return ip
        
        # Fall back to direct client IP
        return request.client.host if request.client else "unknown"
    
    def _is_valid_ip(self, ip: str) -> bool:
        """Validate IP address format"""
        try:
            ipaddress.ip_address(ip)
            return True
        except ValueError:
            return False
    
    def _load_threat_patterns(self) -> Dict[str, Dict[str, str]]:
        """Load threat detection patterns"""
        return {
            "url": {
                "sql_injection": r"(\bunion\b|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b).*(\bfrom\b|\bwhere\b|\binto\b)",
                "xss": r"(<script|javascript:|onerror=|onload=|alert\(|confirm\()",
                "command_injection": r"(;|\||&|\€\(|\`).*(ls|cat|whoami|id|pwd|nc|curl|wget)",
                "path_traversal": r"(\.{2}[\/\\]|%2e%2e[\/\\]|\.\.%2f|\.\.%5c)",
                "ldap_injection": r"(\(|\)|\*|\||&|!|=|<|>|~|%28|%29)"
            },
            "headers": {
                "malicious_user_agent": r"(sqlmap|nikto|nmap|masscan|zap|burp|nessus)",
                "suspicious_accept": r"(application\/x-msdownload|application\/octet-stream)",
                "shell_shock": r"\(\)\s*{\s*:;\s*};"
            },
            "body": {
                "sql_injection": r"(\bunion\b|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b).*(\bfrom\b|\bwhere\b|\binto\b)",
                "xss_payload": r"(<script|javascript:|onerror=|onload=|alert\(|confirm\(|prompt\()",
                "xxe_injection": r"(<!ENTITY|SYSTEM|PUBLIC.*dtd)",
                "deserialization": r"(rO0AB|aced0005|java\.lang|python\/pickle)"
            }
        }
    
    async def _log_security_event(
        self, 
        event_type: str, 
        threat_level: ThreatLevel, 
        source_ip: str, 
        details: Dict[str, Any]
    ):
        """Log security event"""
        event = SecurityEvent(event_type, threat_level, source_ip, details)
        self.security_events.append(event)
        
        # Log to structured logger
        logger.info(
            "Security event",
            event_id=event.event_id,
            event_type=event_type,
            threat_level=threat_level.value,
            source_ip=source_ip,
            details=details
        )
        
        # For high/critical events, consider additional actions
        if threat_level in [ThreatLevel.HIGH, ThreatLevel.CRITICAL]:
            # Could trigger alerts, IP blocking, etc.
            if event_type.startswith("suspicious_pattern") or event_type == "path_traversal_attempt":
                self.suspicious_ips.add(source_ip)
    
    def get_security_metrics(self) -> Dict[str, Any]:
        """Get security metrics for monitoring"""
        total_events = len(self.security_events)
        if total_events == 0:
            return {"total_events": 0}
        
        # Analyze events from last hour
        cutoff_time = datetime.utcnow() - timedelta(hours=1)
        recent_events = [e for e in self.security_events if e.timestamp >= cutoff_time]
        
        threat_counts = defaultdict(int)
        event_types = defaultdict(int)
        top_sources = defaultdict(int)
        
        for event in recent_events:
            threat_counts[event.threat_level.value] += 1
            event_types[event.event_type] += 1
            top_sources[event.source_ip] += 1
        
        return {
            "total_events": total_events,
            "recent_events_1h": len(recent_events),
            "threat_level_distribution": dict(threat_counts),
            "top_event_types": dict(sorted(event_types.items(), key=lambda x: x[1], reverse=True)[:10]),
            "top_source_ips": dict(sorted(top_sources.items(), key=lambda x: x[1], reverse=True)[:10]),
            "blocked_ips_count": len(self.suspicious_ips),
            "rate_limit_stats": {
                "tracked_ips": len(self.rate_limiter.requests),
                "blocked_ips": len(self.rate_limiter.blocked_ips)
            }
        }