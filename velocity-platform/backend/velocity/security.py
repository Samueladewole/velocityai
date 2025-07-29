"""
Enhanced Security Module for Velocity AI Platform
Implements comprehensive security measures including encryption, rate limiting, and audit logging
"""

import os
import hashlib
import secrets
import time
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any, List
from collections import defaultdict
import json
import logging

from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64

logger = logging.getLogger(__name__)

# Configuration
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", Fernet.generate_key().decode())
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", "60"))  # seconds
MAX_REQUEST_SIZE = int(os.getenv("MAX_REQUEST_SIZE", "10485760"))  # 10MB

class EncryptionService:
    """Handles encryption/decryption of sensitive data"""
    
    def __init__(self, key: Optional[str] = None):
        if key:
            self.fernet = Fernet(key.encode() if isinstance(key, str) else key)
        else:
            self.fernet = Fernet(ENCRYPTION_KEY.encode())
    
    def encrypt(self, data: str) -> str:
        """Encrypt sensitive data"""
        if not data:
            return data
        return self.fernet.encrypt(data.encode()).decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt sensitive data"""
        if not encrypted_data:
            return encrypted_data
        try:
            return self.fernet.decrypt(encrypted_data.encode()).decode()
        except Exception as e:
            logger.error(f"Decryption failed: {e}")
            raise ValueError("Invalid encrypted data")
    
    def encrypt_dict(self, data: Dict[str, Any], fields: List[str]) -> Dict[str, Any]:
        """Encrypt specific fields in a dictionary"""
        encrypted_data = data.copy()
        for field in fields:
            if field in encrypted_data and encrypted_data[field]:
                encrypted_data[field] = self.encrypt(str(encrypted_data[field]))
        return encrypted_data
    
    def decrypt_dict(self, data: Dict[str, Any], fields: List[str]) -> Dict[str, Any]:
        """Decrypt specific fields in a dictionary"""
        decrypted_data = data.copy()
        for field in fields:
            if field in decrypted_data and decrypted_data[field]:
                decrypted_data[field] = self.decrypt(decrypted_data[field])
        return decrypted_data

# Global encryption service instance
encryption_service = EncryptionService()

class RateLimiter:
    """In-memory rate limiter for API requests"""
    
    def __init__(self, max_requests: int = RATE_LIMIT_REQUESTS, window_seconds: int = RATE_LIMIT_WINDOW):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)
    
    def is_allowed(self, identifier: str) -> bool:
        """Check if request is allowed for given identifier"""
        now = time.time()
        # Clean old requests
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if now - req_time < self.window_seconds
        ]
        
        # Check if under limit
        if len(self.requests[identifier]) >= self.max_requests:
            return False
        
        # Add current request
        self.requests[identifier].append(now)
        return True
    
    def get_reset_time(self, identifier: str) -> int:
        """Get when the rate limit resets for identifier"""
        if not self.requests[identifier]:
            return int(time.time())
        
        oldest_request = min(self.requests[identifier])
        return int(oldest_request + self.window_seconds)

# Global rate limiter instance
rate_limiter = RateLimiter()

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds security headers to all responses"""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
        
        # Remove server identification
        response.headers.pop("Server", None)
        
        return response

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware"""
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)
        
        # Use IP address as identifier (in production, consider using user ID for authenticated requests)
        client_ip = request.client.host if request.client else "unknown"
        identifier = f"{client_ip}:{request.url.path}"
        
        if not rate_limiter.is_allowed(identifier):
            reset_time = rate_limiter.get_reset_time(identifier)
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "Rate limit exceeded",
                    "message": f"Too many requests. Limit: {rate_limiter.max_requests} per {rate_limiter.window_seconds} seconds",
                    "reset_time": reset_time
                },
                headers={
                    "X-RateLimit-Limit": str(rate_limiter.max_requests),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(reset_time),
                    "Retry-After": str(rate_limiter.window_seconds)
                }
            )
        
        return await call_next(request)

class SecurityAuditMiddleware(BaseHTTPMiddleware):
    """Security audit logging middleware"""
    
    def __init__(self, app, log_sensitive_endpoints: bool = True):
        super().__init__(app)
        self.log_sensitive_endpoints = log_sensitive_endpoints
        self.sensitive_paths = ["/api/v1/auth/", "/api/v1/integrations/", "/api/v1/agents/"]
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Extract request details
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        method = request.method
        path = request.url.path
        
        # Check if this is a sensitive endpoint
        is_sensitive = any(sensitive_path in path for sensitive_path in self.sensitive_paths)
        
        try:
            response = await call_next(request)
            status_code = response.status_code
            process_time = time.time() - start_time
            
            # Log security events
            if is_sensitive or status_code >= 400:
                audit_data = {
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "client_ip": client_ip,
                    "user_agent": user_agent,
                    "method": method,
                    "path": path,
                    "status_code": status_code,
                    "process_time": round(process_time, 4),
                    "is_sensitive": is_sensitive
                }
                
                if status_code >= 400:
                    audit_data["severity"] = "ERROR" if status_code >= 500 else "WARNING"
                    logger.warning(f"Security audit: {json.dumps(audit_data)}")
                else:
                    logger.info(f"Security audit: {json.dumps(audit_data)}")
            
            return response
            
        except Exception as e:
            # Log security exceptions
            audit_data = {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "client_ip": client_ip,
                "user_agent": user_agent,
                "method": method,
                "path": path,
                "exception": str(e),
                "severity": "CRITICAL",
                "is_sensitive": is_sensitive
            }
            logger.error(f"Security audit exception: {json.dumps(audit_data)}")
            raise

class InputValidationMiddleware(BaseHTTPMiddleware):
    """Input validation and sanitization middleware"""
    
    async def dispatch(self, request: Request, call_next):
        # Check request size
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > MAX_REQUEST_SIZE:
            return JSONResponse(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                content={"error": "Request too large", "max_size": MAX_REQUEST_SIZE}
            )
        
        # Check for suspicious patterns in headers
        suspicious_patterns = ["<script", "javascript:", "data:text/html", "vbscript:", "onload="]
        for header_name, header_value in request.headers.items():
            if any(pattern in header_value.lower() for pattern in suspicious_patterns):
                logger.warning(f"Suspicious header detected: {header_name}={header_value} from IP: {request.client.host}")
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"error": "Invalid request headers"}
                )
        
        return await call_next(request)

def generate_secure_token(length: int = 32) -> str:
    """Generate a cryptographically secure random token"""
    return secrets.token_urlsafe(length)

def hash_sensitive_data(data: str, salt: Optional[str] = None) -> tuple[str, str]:
    """Hash sensitive data with salt"""
    if not salt:
        salt = secrets.token_hex(16)
    
    # Create hash
    hash_obj = hashlib.pbkdf2_hmac('sha256', data.encode(), salt.encode(), 100000)
    hashed = base64.b64encode(hash_obj).decode()
    
    return hashed, salt

def verify_sensitive_data(data: str, hashed: str, salt: str) -> bool:
    """Verify sensitive data against hash"""
    try:
        new_hash, _ = hash_sensitive_data(data, salt)
        return secrets.compare_digest(new_hash, hashed)
    except Exception:
        return False

class SecurityConfig:
    """Security configuration and utilities"""
    
    @staticmethod
    def get_cors_origins() -> List[str]:
        """Get allowed CORS origins from environment"""
        origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
        return [origin.strip() for origin in origins.split(",")]
    
    @staticmethod
    def is_production() -> bool:
        """Check if running in production environment"""
        return os.getenv("ENVIRONMENT", "development").lower() == "production"
    
    @staticmethod
    def get_jwt_secret() -> str:
        """Get JWT secret with validation"""
        secret = os.getenv("JWT_SECRET")
        if not secret or len(secret) < 32:
            if SecurityConfig.is_production():
                raise ValueError("JWT_SECRET must be set and at least 32 characters in production")
            logger.warning("Using weak JWT secret in development")
            return "dev-secret-key-change-in-production-" + secrets.token_hex(16)
        return secret

# Utility functions for credential encryption
def encrypt_credentials(credentials: Dict[str, Any]) -> Dict[str, Any]:
    """Encrypt sensitive credential fields"""
    sensitive_fields = ["password", "api_key", "secret", "token", "private_key", "client_secret"]
    return encryption_service.encrypt_dict(credentials, sensitive_fields)

def decrypt_credentials(encrypted_credentials: Dict[str, Any]) -> Dict[str, Any]:
    """Decrypt sensitive credential fields"""
    sensitive_fields = ["password", "api_key", "secret", "token", "private_key", "client_secret"]
    return encryption_service.decrypt_dict(encrypted_credentials, sensitive_fields)