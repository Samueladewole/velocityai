"""
Security middleware for ERIP AI Agents API.
Implements authentication, authorization, rate limiting, and data isolation.
"""

from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
from typing import Dict, List, Any, Optional, Callable
import structlog
import asyncio
import time
from ..core.security_service import security_service
import json

logger = structlog.get_logger()

security = HTTPBearer()


class SecurityMiddleware(BaseHTTPMiddleware):
    """Comprehensive security middleware for AI agents API"""
    
    def __init__(self, app: FastAPI, exclude_paths: List[str] = None):
        super().__init__(app)
        self.exclude_paths = exclude_paths or [
            '/health',
            '/metrics',
            '/docs',
            '/openapi.json',
            '/webhooks/stripe'
        ]
    
    async def dispatch(self, request: Request, call_next: Callable):
        start_time = time.time()
        
        # Skip security for excluded paths
        if any(request.url.path.startswith(path) for path in self.exclude_paths):
            return await call_next(request)
        
        try:
            # Extract client info
            client_ip = self._get_client_ip(request)
            user_agent = request.headers.get('user-agent', '')
            
            # Get token from header
            auth_header = request.headers.get('authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return JSONResponse(
                    status_code=401,
                    content={'error': 'Missing or invalid authorization header'}
                )
            
            token = auth_header.split(' ')[1]
            
            # Verify token
            payload = await security_service.verify_access_token(token)
            if not payload:
                return JSONResponse(
                    status_code=401,
                    content={'error': 'Invalid or expired token'}
                )
            
            customer_id = payload.get('customer_id')
            user_id = payload.get('user_id')
            permissions = payload.get('permissions', [])
            
            # Validate IP access
            if not await security_service.validate_ip_access(customer_id, client_ip):
                return JSONResponse(
                    status_code=403,
                    content={'error': 'IP address not allowed'}
                )
            
            # Check rate limits
            action = self._get_action_from_path(request.url.path, request.method)
            if not await security_service.check_rate_limit(customer_id, action, user_id):
                return JSONResponse(
                    status_code=429,
                    content={'error': 'Rate limit exceeded'}
                )
            
            # Add security context to request
            request.state.security = {
                'customer_id': customer_id,
                'user_id': user_id,
                'permissions': permissions,
                'client_ip': client_ip,
                'user_agent': user_agent
            }
            
            # Process request
            response = await call_next(request)
            
            # Log access
            processing_time = time.time() - start_time
            await self._log_access(
                customer_id=customer_id,
                user_id=user_id,
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                processing_time=processing_time,
                client_ip=client_ip,
                user_agent=user_agent
            )
            
            return response
            
        except Exception as e:
            logger.error("security_middleware_error", error=str(e))
            return JSONResponse(
                status_code=500,
                content={'error': 'Security validation failed'}
            )
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP address from request"""
        
        # Check for forwarded headers first
        forwarded_for = request.headers.get('x-forwarded-for')
        if forwarded_for:
            return forwarded_for.split(',')[0].strip()
        
        forwarded = request.headers.get('x-forwarded')
        if forwarded:
            return forwarded.split(',')[0].strip()
        
        real_ip = request.headers.get('x-real-ip')
        if real_ip:
            return real_ip
        
        # Fallback to request client
        return request.client.host if request.client else '127.0.0.1'
    
    def _get_action_from_path(self, path: str, method: str) -> str:
        """Map API path to rate limit action"""
        
        if '/subscriptions' in path:
            return 'billing_api'
        elif '/agents' in path and method == 'POST':
            return 'agent_start'
        elif '/evidence' in path:
            return 'evidence_api'
        else:
            return 'api_call'
    
    async def _log_access(
        self,
        customer_id: str,
        user_id: str,
        method: str,
        path: str,
        status_code: int,
        processing_time: float,
        client_ip: str,
        user_agent: str
    ):
        """Log API access for audit"""
        
        await security_service._log_security_event(
            customer_id=customer_id,
            user_id=user_id,
            event_type='api_access',
            details={
                'method': method,
                'path': path,
                'status_code': status_code,
                'processing_time_ms': round(processing_time * 1000, 2)
            },
            ip_address=client_ip,
            user_agent=user_agent
        )


async def get_current_customer(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Dependency to get current customer from token"""
    
    payload = await security_service.verify_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return payload


async def require_permission(required_permission: str):
    """Dependency factory for permission-based access control"""
    
    async def check_permission(current_customer: Dict = Depends(get_current_customer)):
        permissions = current_customer.get('permissions', [])
        
        if required_permission not in permissions and 'admin' not in permissions:
            raise HTTPException(
                status_code=403,
                detail=f"Permission '{required_permission}' required"
            )
        
        return current_customer
    
    return check_permission


async def enforce_data_isolation(
    target_customer_id: str,
    current_customer: Dict = Depends(get_current_customer)
) -> bool:
    """Dependency to enforce data isolation"""
    
    customer_id = current_customer.get('customer_id')
    
    if not await security_service.enforce_data_isolation(
        customer_id=customer_id,
        operation='data_access',
        target_customer_id=target_customer_id
    ):
        raise HTTPException(
            status_code=403,
            detail="Data isolation violation: Access denied"
        )
    
    return True


class DataIsolationMiddleware(BaseHTTPMiddleware):
    """Middleware specifically for enforcing data isolation"""
    
    async def dispatch(self, request: Request, call_next: Callable):
        # Extract customer_id from path parameters
        path_params = request.path_params
        query_params = dict(request.query_params)
        
        # Check for customer_id in various places
        target_customer_id = (
            path_params.get('customer_id') or
            query_params.get('customer_id') or
            getattr(request.state, 'target_customer_id', None)
        )
        
        if target_customer_id and hasattr(request.state, 'security'):
            security_context = request.state.security
            customer_id = security_context.get('customer_id')
            
            # Enforce data isolation
            if not await security_service.enforce_data_isolation(
                customer_id=customer_id,
                operation=f"{request.method} {request.url.path}",
                target_customer_id=target_customer_id
            ):
                return JSONResponse(
                    status_code=403,
                    content={'error': 'Data isolation violation'}
                )
        
        return await call_next(request)


def create_security_config() -> Dict[str, Any]:
    """Create security configuration for the application"""
    
    return {
        'cors': {
            'allow_origins': [
                'http://localhost:5173',
                'https://erip.io',
                'https://*.erip.io'
            ],
            'allow_credentials': True,
            'allow_methods': ['*'],
            'allow_headers': ['*'],
            'expose_headers': ['X-Request-ID', 'X-Rate-Limit-Remaining']
        },
        'rate_limits': {
            'global': '1000/hour',
            'per_customer': '500/hour',
            'auth': '10/minute'
        },
        'security_headers': {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
    }


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""
    
    def __init__(self, app: FastAPI):
        super().__init__(app)
        self.config = create_security_config()
    
    async def dispatch(self, request: Request, call_next: Callable):
        response = await call_next(request)
        
        # Add security headers
        for header, value in self.config['security_headers'].items():
            response.headers[header] = value
        
        # Add request ID for tracking
        import uuid
        response.headers['X-Request-ID'] = str(uuid.uuid4())
        
        return response


# Authentication utilities
async def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    """Authenticate user credentials"""
    
    # This would integrate with your user management system
    # For now, return mock data
    
    if email == "admin@erip.io" and password == "demo_password":
        return {
            'user_id': 'demo_user',
            'customer_id': 'demo_customer',
            'email': email,
            'permissions': ['admin', 'agents:manage', 'billing:view', 'evidence:manage']
        }
    
    return None


async def generate_api_key(customer_id: str, name: str, permissions: List[str]) -> str:
    """Generate API key for programmatic access"""
    
    # Generate long-lived token (1 year)
    token = await security_service.generate_access_token(
        customer_id=customer_id,
        user_id=f"api_key_{name}",
        permissions=permissions,
        expires_in_minutes=525600  # 1 year
    )
    
    await security_service._log_security_event(
        customer_id=customer_id,
        event_type='api_key_generated',
        details={'name': name, 'permissions': permissions}
    )
    
    return token


async def revoke_api_key(token: str) -> bool:
    """Revoke API key"""
    
    success = await security_service.revoke_token(token)
    
    if success:
        payload = await security_service.verify_access_token(token)
        if payload:
            await security_service._log_security_event(
                customer_id=payload.get('customer_id'),
                event_type='api_key_revoked',
                details={'user_id': payload.get('user_id')}
            )
    
    return success


# Encryption utilities for request/response
async def encrypt_response_data(data: Dict[str, Any], customer_id: str) -> str:
    """Encrypt sensitive response data"""
    
    if not security_service.security_policy.encryption_required:
        return json.dumps(data)
    
    json_data = json.dumps(data).encode()
    encrypted_data, key_id = await security_service.encrypt_data(json_data, customer_id)
    
    return {
        'encrypted': True,
        'data': encrypted_data.hex(),
        'key_id': key_id
    }


async def decrypt_request_data(encrypted_data: str, customer_id: str) -> Dict[str, Any]:
    """Decrypt request data"""
    
    if isinstance(encrypted_data, dict) and encrypted_data.get('encrypted'):
        data_bytes = bytes.fromhex(encrypted_data['data'])
        decrypted_data = await security_service.decrypt_data(data_bytes, customer_id)
        return json.loads(decrypted_data.decode())
    
    # Data is not encrypted
    if isinstance(encrypted_data, str):
        return json.loads(encrypted_data)
    
    return encrypted_data