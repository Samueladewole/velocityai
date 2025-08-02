"""
Enhanced Middleware Components for Velocity AI Platform
Content Security Policy, API Versioning, Enhanced Logging, and Session Management
"""

import time
import json
import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional, List, Callable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from fastapi import FastAPI, HTTPException
from fastapi.security import HTTPBearer
import re

logger = logging.getLogger(__name__)

class ContentSecurityPolicyMiddleware(BaseHTTPMiddleware):
    """Content Security Policy middleware for enhanced security"""
    
    def __init__(self, app, csp_directives: Optional[Dict[str, str]] = None):
        super().__init__(app)
        
        # Default CSP directives for production security
        self.csp_directives = csp_directives or {
            "default-src": "'self'",
            "script-src": "'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com",
            "style-src": "'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src": "'self' https://fonts.gstatic.com",
            "img-src": "'self' data: https:",
            "connect-src": "'self' wss: https:",
            "frame-ancestors": "'none'",
            "base-uri": "'self'",
            "form-action": "'self'",
            "upgrade-insecure-requests": "",
            "block-all-mixed-content": ""
        }
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Build CSP header value
        csp_value = "; ".join([
            f"{directive} {value}" if value else directive
            for directive, value in self.csp_directives.items()
        ])
        
        # Add CSP headers
        response.headers["Content-Security-Policy"] = csp_value
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        return response

class APIVersioningMiddleware(BaseHTTPMiddleware):
    """API versioning middleware with backward compatibility"""
    
    def __init__(self, app, default_version: str = "v1", supported_versions: List[str] = None):
        super().__init__(app)
        self.default_version = default_version
        self.supported_versions = supported_versions or ["v1"]
        self.version_pattern = re.compile(r'/api/v(\d+)/')
    
    async def dispatch(self, request: Request, call_next):
        # Extract version from URL
        version_match = self.version_pattern.search(str(request.url.path))
        
        if version_match:
            requested_version = f"v{version_match.group(1)}"
            
            # Check if version is supported
            if requested_version not in self.supported_versions:
                return Response(
                    content=json.dumps({
                        "error": "Unsupported API version",
                        "requested_version": requested_version,
                        "supported_versions": self.supported_versions,
                        "default_version": self.default_version
                    }),
                    status_code=400,
                    media_type="application/json"
                )
            
            # Add version info to request state
            request.state.api_version = requested_version
        else:
            # Use default version for non-API requests
            request.state.api_version = self.default_version
        
        response = await call_next(request)
        
        # Add version headers
        response.headers["API-Version"] = request.state.api_version
        response.headers["Supported-Versions"] = ", ".join(self.supported_versions)
        
        return response

class EnhancedLoggingMiddleware(BaseHTTPMiddleware):
    """Enhanced logging middleware with structured logging and performance metrics"""
    
    def __init__(self, app, 
                 log_level: str = "INFO",
                 log_sensitive_headers: bool = False,
                 log_request_body: bool = False,
                 performance_threshold_ms: float = 1000.0):
        super().__init__(app)
        self.log_level = getattr(logging, log_level.upper())
        self.log_sensitive_headers = log_sensitive_headers
        self.log_request_body = log_request_body
        self.performance_threshold_ms = performance_threshold_ms
        
        # Configure structured logger
        self.logger = logging.getLogger("velocity.requests")
        self.logger.setLevel(self.log_level)
        
        # Sensitive headers to filter
        self.sensitive_headers = {
            "authorization", "cookie", "x-api-key", "x-auth-token"
        }
    
    async def dispatch(self, request: Request, call_next):
        # Generate request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Start timing
        start_time = time.time()
        
        # Log request
        await self._log_request(request, request_id)
        
        # Process request
        try:
            response = await call_next(request)
            
            # Calculate processing time
            process_time = (time.time() - start_time) * 1000
            
            # Log response
            await self._log_response(request, response, request_id, process_time)
            
            # Add request ID and timing headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
            
            # Log performance warning if threshold exceeded
            if process_time > self.performance_threshold_ms:
                self.logger.warning(
                    "Slow request detected",
                    extra={
                        "request_id": request_id,
                        "method": request.method,
                        "path": str(request.url.path),
                        "process_time_ms": process_time,
                        "threshold_ms": self.performance_threshold_ms
                    }
                )
            
            return response
            
        except Exception as e:
            process_time = (time.time() - start_time) * 1000
            
            # Log error
            self.logger.error(
                "Request failed with exception",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": str(request.url.path),
                    "process_time_ms": process_time,
                    "error": str(e),
                    "error_type": type(e).__name__
                }
            )
            
            raise
    
    async def _log_request(self, request: Request, request_id: str):
        """Log incoming request details"""
        # Filter headers
        headers = dict(request.headers)
        if not self.log_sensitive_headers:
            headers = {
                k: "***FILTERED***" if k.lower() in self.sensitive_headers else v
                for k, v in headers.items()
            }
        
        # Log request body if enabled and safe
        body_info = {}
        if self.log_request_body and request.method in ["POST", "PUT", "PATCH"]:
            try:
                # Only log if content-type is safe
                content_type = request.headers.get("content-type", "")
                if "application/json" in content_type:
                    # Note: This is a simplified approach
                    # In production, you'd want to carefully handle body reading
                    body_info["has_body"] = True
                    body_info["content_type"] = content_type
            except Exception:
                body_info["body_read_error"] = True
        
        log_data = {
            "request_id": request_id,
            "method": request.method,
            "path": str(request.url.path),
            "query_params": dict(request.query_params),
            "headers": headers,
            "client_ip": request.client.host if request.client else None,
            "user_agent": request.headers.get("user-agent"),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            **body_info
        }
        
        self.logger.info("Incoming request", extra=log_data)
    
    async def _log_response(self, request: Request, response: Response, 
                          request_id: str, process_time: float):
        """Log response details"""
        log_data = {
            "request_id": request_id,
            "method": request.method,
            "path": str(request.url.path),
            "status_code": response.status_code,
            "process_time_ms": process_time,
            "response_headers": dict(response.headers),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Log level based on status code
        if response.status_code >= 500:
            self.logger.error("Response (Server Error)", extra=log_data)
        elif response.status_code >= 400:
            self.logger.warning("Response (Client Error)", extra=log_data)
        else:
            self.logger.info("Response (Success)", extra=log_data)

class SessionManagementMiddleware(BaseHTTPMiddleware):
    """Enhanced session management with JWT and refresh token handling"""
    
    def __init__(self, app, 
                 session_timeout_minutes: int = 60,
                 refresh_threshold_minutes: int = 15,
                 max_sessions_per_user: int = 5):
        super().__init__(app)
        self.session_timeout_minutes = session_timeout_minutes
        self.refresh_threshold_minutes = refresh_threshold_minutes
        self.max_sessions_per_user = max_sessions_per_user
        
        # In-memory session store (use Redis in production)
        self.active_sessions: Dict[str, Dict[str, Any]] = {}
    
    async def dispatch(self, request: Request, call_next):
        # Skip session management for certain paths
        skip_paths = ["/health", "/metrics", "/docs", "/redoc", "/openapi.json"]
        if any(request.url.path.startswith(path) for path in skip_paths):
            return await call_next(request)
        
        # Extract authorization header
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
            # Validate and refresh session if needed
            session_info = await self._validate_session(token)
            if session_info:
                request.state.session = session_info
                
                # Check if token needs refresh
                if await self._should_refresh_token(session_info):
                    # Add refresh hint to response (handled by auth system)
                    request.state.needs_token_refresh = True
        
        response = await call_next(request)
        
        # Add session management headers
        if hasattr(request.state, "session"):
            response.headers["X-Session-Valid"] = "true"
            
            if hasattr(request.state, "needs_token_refresh"):
                response.headers["X-Token-Refresh-Needed"] = "true"
        
        return response
    
    async def _validate_session(self, token: str) -> Optional[Dict[str, Any]]:
        """Validate session token and return session info"""
        try:
            # This would integrate with your JWT validation logic
            # For now, return mock session info
            from auth import verify_token
            
            payload = verify_token(token, "access")
            if payload:
                user_id = payload.get("sub")
                session_id = payload.get("session_id")
                
                # Check if session is active
                if session_id in self.active_sessions:
                    session = self.active_sessions[session_id]
                    
                    # Check if session is expired
                    if self._is_session_expired(session):
                        del self.active_sessions[session_id]
                        return None
                    
                    # Update last activity
                    session["last_activity"] = datetime.now(timezone.utc)
                    
                    return {
                        "user_id": user_id,
                        "session_id": session_id,
                        "created_at": session["created_at"],
                        "last_activity": session["last_activity"]
                    }
            
            return None
            
        except Exception as e:
            logger.warning(f"Session validation failed: {e}")
            return None
    
    def _is_session_expired(self, session: Dict[str, Any]) -> bool:
        """Check if session is expired"""
        last_activity = session.get("last_activity")
        if not last_activity:
            return True
        
        now = datetime.now(timezone.utc)
        timeout_delta = timedelta(minutes=self.session_timeout_minutes)
        
        return (now - last_activity) > timeout_delta
    
    async def _should_refresh_token(self, session_info: Dict[str, Any]) -> bool:
        """Check if token should be refreshed"""
        last_activity = session_info.get("last_activity")
        if not last_activity:
            return True
        
        now = datetime.now(timezone.utc)
        refresh_delta = timedelta(minutes=self.refresh_threshold_minutes)
        
        return (now - last_activity) > refresh_delta
    
    async def create_session(self, user_id: str, session_id: str) -> Dict[str, Any]:
        """Create new session"""
        # Clean up old sessions for user (enforce max sessions)
        user_sessions = [
            sid for sid, session in self.active_sessions.items()
            if session.get("user_id") == user_id
        ]
        
        if len(user_sessions) >= self.max_sessions_per_user:
            # Remove oldest session
            oldest_session = min(
                user_sessions,
                key=lambda sid: self.active_sessions[sid]["created_at"]
            )
            del self.active_sessions[oldest_session]
        
        # Create new session
        session = {
            "user_id": user_id,
            "session_id": session_id,
            "created_at": datetime.now(timezone.utc),
            "last_activity": datetime.now(timezone.utc)
        }
        
        self.active_sessions[session_id] = session
        return session
    
    async def destroy_session(self, session_id: str) -> bool:
        """Destroy session"""
        if session_id in self.active_sessions:
            del self.active_sessions[session_id]
            return True
        return False

class RequestCorrelationMiddleware(BaseHTTPMiddleware):
    """Request correlation and tracing middleware"""
    
    def __init__(self, app, header_name: str = "X-Correlation-ID"):
        super().__init__(app)
        self.header_name = header_name
    
    async def dispatch(self, request: Request, call_next):
        # Get or generate correlation ID
        correlation_id = request.headers.get(self.header_name) or str(uuid.uuid4())
        
        # Add to request state
        request.state.correlation_id = correlation_id
        
        # Process request
        response = await call_next(request)
        
        # Add correlation ID to response
        response.headers[self.header_name] = correlation_id
        
        return response

# Factory function to create and configure all middleware
def setup_enhanced_middleware(app: FastAPI, config: Optional[Dict[str, Any]] = None) -> FastAPI:
    """Setup all enhanced middleware components"""
    
    config = config or {}
    
    # Content Security Policy
    if config.get("enable_csp", True):
        app.add_middleware(
            ContentSecurityPolicyMiddleware,
            csp_directives=config.get("csp_directives")
        )
    
    # API Versioning
    if config.get("enable_api_versioning", True):
        app.add_middleware(
            APIVersioningMiddleware,
            default_version=config.get("default_api_version", "v1"),
            supported_versions=config.get("supported_api_versions", ["v1"])
        )
    
    # Enhanced Logging
    if config.get("enable_enhanced_logging", True):
        app.add_middleware(
            EnhancedLoggingMiddleware,
            log_level=config.get("log_level", "INFO"),
            log_sensitive_headers=config.get("log_sensitive_headers", False),
            log_request_body=config.get("log_request_body", False),
            performance_threshold_ms=config.get("performance_threshold_ms", 1000.0)
        )
    
    # Session Management
    if config.get("enable_session_management", True):
        app.add_middleware(
            SessionManagementMiddleware,
            session_timeout_minutes=config.get("session_timeout_minutes", 60),
            refresh_threshold_minutes=config.get("refresh_threshold_minutes", 15),
            max_sessions_per_user=config.get("max_sessions_per_user", 5)
        )
    
    # Request Correlation
    if config.get("enable_request_correlation", True):
        app.add_middleware(
            RequestCorrelationMiddleware,
            header_name=config.get("correlation_header", "X-Correlation-ID")
        )
    
    return app

# Middleware configuration for different environments
MIDDLEWARE_CONFIGS = {
    "development": {
        "enable_csp": False,  # Relaxed for development
        "log_level": "DEBUG",
        "log_sensitive_headers": True,
        "log_request_body": True,
        "performance_threshold_ms": 2000.0
    },
    "staging": {
        "enable_csp": True,
        "log_level": "INFO",
        "log_sensitive_headers": False,
        "log_request_body": False,
        "performance_threshold_ms": 1000.0
    },
    "production": {
        "enable_csp": True,
        "log_level": "WARNING",
        "log_sensitive_headers": False,
        "log_request_body": False,
        "performance_threshold_ms": 500.0
    }
}

def get_middleware_config(environment: str = "production") -> Dict[str, Any]:
    """Get middleware configuration for environment"""
    return MIDDLEWARE_CONFIGS.get(environment, MIDDLEWARE_CONFIGS["production"])