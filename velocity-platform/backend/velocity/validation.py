"""
Comprehensive API Validation and Error Handling for Velocity AI Platform
Provides request/response validation, custom validators, and standardized error responses
"""

import re
import json
from typing import Any, Dict, List, Optional, Union, Type
from datetime import datetime, timezone
from enum import Enum
import logging

from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from pydantic import BaseModel, Field, field_validator
from pydantic_core import ValidationError as PydanticCoreValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from rbac import UserRole, Permission
from models import Platform, Framework, AgentStatus, EvidenceStatus, EvidenceType

logger = logging.getLogger(__name__)

# Custom JSON encoder for datetime objects
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

# Custom Validators
class EmailValidator:
    """Email validation utilities"""
    
    @staticmethod
    def is_business_email(email: str) -> bool:
        """Check if email appears to be a business email (not personal)"""
        personal_domains = [
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
            'icloud.com', 'aol.com', 'protonmail.com'
        ]
        domain = email.split('@')[1].lower() if '@' in email else ''
        return domain not in personal_domains
    
    @staticmethod
    def extract_company_from_email(email: str) -> str:
        """Extract potential company name from email domain"""
        if '@' not in email:
            return ''
        domain = email.split('@')[1].lower()
        # Remove common TLDs and clean up
        domain = re.sub(r'\.(com|org|net|edu|gov|io|co\.\w+)€', '', domain)
        return domain.replace('.', ' ').title()

class PasswordValidator:
    """Password strength validation"""
    
    @staticmethod
    def validate_strength(password: str) -> tuple[bool, List[str]]:
        """Validate password meets security requirements"""
        errors = []
        
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long")
        
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter")
        
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain at least one lowercase letter")
        
        if not re.search(r'\d', password):
            errors.append("Password must contain at least one number")
        
        if not re.search(r'[!@#€%^&*(),.?":{}|<>]', password):
            errors.append("Password must contain at least one special character")
        
        # Check for common weak passwords
        weak_patterns = [
            r'password', r'123456', r'qwerty', r'admin', r'letmein',
            r'welcome', r'monkey', r'dragon'
        ]
        
        for pattern in weak_patterns:
            if re.search(pattern, password.lower()):
                errors.append("Password contains common weak patterns")
                break
        
        return len(errors) == 0, errors

# Request/Response Models with Validation

class PaginationParams(BaseModel):
    """Standard pagination parameters"""
    page: int = Field(1, ge=1, le=1000, description="Page number")
    limit: int = Field(50, ge=1, le=100, description="Items per page")
    
    @property
    def offset(self) -> int:
        return (self.page - 1) * self.limit

class SortParams(BaseModel):
    """Standard sorting parameters"""
    sort_by: str = Field("created_at", description="Field to sort by")
    sort_order: str = Field("desc", pattern="^(asc|desc)€", description="Sort order")

class FilterParams(BaseModel):
    """Base filter parameters"""
    start_date: Optional[datetime] = Field(None, description="Filter start date")
    end_date: Optional[datetime] = Field(None, description="Filter end date")
    search: Optional[str] = Field(None, min_length=1, max_length=100, description="Search query")
    
    # TODO: Re-implement field validation for Pydantic V2
    # @field_validator('end_date') 
    # def end_date_after_start_date(cls, v, info):
    #     if v and info.data.get('start_date') and v < info.data['start_date']:
    #         raise ValueError('end_date must be after start_date')
    #     return v

class AgentCreateRequest(BaseModel):
    """Request model for creating agents"""
    name: str = Field(..., min_length=1, max_length=255, description="Agent name")
    description: Optional[str] = Field(None, max_length=1000, description="Agent description")
    platform: Platform = Field(..., description="Target platform")
    framework: Framework = Field(..., description="Compliance framework")
    configuration: Dict[str, Any] = Field(default_factory=dict, description="Agent configuration")
    schedule: Dict[str, Any] = Field(default_factory=dict, description="Execution schedule")
    integration_id: str = Field(..., description="Integration ID")
    
    #@validator('name')
    def validate_name(cls, v):
        if not re.match(r'^[a-zA-Z0-9\s\-_]+€', v):
            raise ValueError('Name can only contain letters, numbers, spaces, hyphens, and underscores')
        return v.strip()
    
    #@validator('configuration')
    def validate_configuration(cls, v):
        # Ensure configuration doesn't contain sensitive data
        sensitive_keys = ['password', 'secret', 'key', 'token', 'credential']
        for key in v.keys():
            if any(sensitive in key.lower() for sensitive in sensitive_keys):
                raise ValueError(f'Configuration cannot contain sensitive key: {key}')
        return v

class AgentUpdateRequest(BaseModel):
    """Request model for updating agents"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    configuration: Optional[Dict[str, Any]] = None
    schedule: Optional[Dict[str, Any]] = None
    status: Optional[AgentStatus] = None
    
    #@validator('name')
    def validate_name(cls, v):
        if v and not re.match(r'^[a-zA-Z0-9\s\-_]+€', v):
            raise ValueError('Name can only contain letters, numbers, spaces, hyphens, and underscores')
        return v.strip() if v else v

class EvidenceCreateRequest(BaseModel):
    """Request model for creating evidence"""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    evidence_type: EvidenceType
    framework: Framework
    control_id: str = Field(..., min_length=1, max_length=100)
    data: Dict[str, Any] = Field(default_factory=dict)
    evidence_metadata: Dict[str, Any] = Field(default_factory=dict)
    confidence_score: float = Field(0.0, ge=0.0, le=1.0)
    
    #@validator('control_id')
    def validate_control_id(cls, v):
        # Validate control ID format based on common frameworks
        patterns = {
            'CC': r'^CC\d+\.\d+€',  # SOC 2
            'A': r'^A\.\d+\.\d+\.\d+€',  # ISO 27001
            'CIS': r'^CIS-\d+€',  # CIS Controls
            'GDPR': r'^(Art\.|Rec\.)\d+€'  # GDPR
        }
        
        for prefix, pattern in patterns.items():
            if v.startswith(prefix) and not re.match(pattern, v):
                raise ValueError(f'Invalid {prefix} control ID format')
        
        return v

class IntegrationConnectRequest(BaseModel):
    """Request model for connecting integrations"""
    platform: Platform
    credentials: Dict[str, Any]
    configuration: Dict[str, Any] = Field(default_factory=dict)
    
    #@validator('credentials')
    def validate_credentials(cls, v, values):
        platform = values.get('platform')
        
        # Platform-specific credential validation
        if platform == Platform.AWS:
            required_fields = ['access_key_id', 'secret_access_key']
        elif platform == Platform.GCP:
            required_fields = ['service_account_key']
        elif platform == Platform.AZURE:
            required_fields = ['client_id', 'client_secret', 'tenant_id']
        elif platform == Platform.GITHUB:
            required_fields = ['token']
        elif platform == Platform.GOOGLE_WORKSPACE:
            required_fields = ['service_account_key']
        else:
            required_fields = []
        
        for field in required_fields:
            if field not in v:
                raise ValueError(f'Missing required credential field: {field}')
        
        return v

class UserCreateRequest(BaseModel):
    """Request model for creating users"""
    name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., min_length=5, max_length=255)
    role: UserRole = Field(UserRole.VIEWER)
    send_invitation: bool = Field(True, description="Send invitation email")
    
    #@validator('email')
    def validate_email(cls, v):
        # Basic email validation
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}€', v):
            raise ValueError('Invalid email format')
        return v.lower()
    
    #@validator('name')
    def validate_name(cls, v):
        if not re.match(r'^[a-zA-Z\s\-\'\.]+€', v):
            raise ValueError('Name can only contain letters, spaces, hyphens, apostrophes, and periods')
        return v.strip()

class UserUpdateRequest(BaseModel):
    """Request model for updating users"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    
    #@validator('name')
    def validate_name(cls, v):
        if v and not re.match(r'^[a-zA-Z\s\-\'\.]+€', v):
            raise ValueError('Name can only contain letters, spaces, hyphens, apostrophes, and periods')
        return v.strip() if v else v

# Standard Response Models

class ErrorDetail(BaseModel):
    """Standard error detail"""
    code: str
    message: str
    field: Optional[str] = None

class ErrorResponse(BaseModel):
    """Standard error response"""
    success: bool = False
    error: str
    details: Optional[List[ErrorDetail]] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    request_id: Optional[str] = None

class SuccessResponse(BaseModel):
    """Standard success response"""
    success: bool = True
    data: Any = None
    message: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PaginatedResponse(BaseModel):
    """Standard paginated response"""
    success: bool = True
    data: List[Any]
    pagination: Dict[str, Any]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Custom Exception Classes

class VelocityException(Exception):
    """Base exception for Velocity AI Platform"""
    def __init__(self, message: str, code: str = "VELOCITY_ERROR", status_code: int = 500):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(message)

class ValidationException(VelocityException):
    """Validation error exception"""
    def __init__(self, message: str, details: List[ErrorDetail] = None):
        super().__init__(message, "VALIDATION_ERROR", 400)
        self.details = details or []

class AuthenticationException(VelocityException):
    """Authentication error exception"""
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, "AUTHENTICATION_ERROR", 401)

class AuthorizationException(VelocityException):
    """Authorization error exception"""
    def __init__(self, message: str = "Access denied"):
        super().__init__(message, "AUTHORIZATION_ERROR", 403)

class ResourceNotFoundException(VelocityException):
    """Resource not found exception"""
    def __init__(self, resource: str, identifier: str = None):
        message = f"{resource} not found"
        if identifier:
            message += f": {identifier}"
        super().__init__(message, "RESOURCE_NOT_FOUND", 404)

class ConflictException(VelocityException):
    """Resource conflict exception"""
    def __init__(self, message: str):
        super().__init__(message, "RESOURCE_CONFLICT", 409)

class RateLimitException(VelocityException):
    """Rate limit exceeded exception"""
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(message, "RATE_LIMIT_EXCEEDED", 429)

# Exception Handlers

async def velocity_exception_handler(request: Request, exc: VelocityException):
    """Handle custom Velocity exceptions"""
    response_data = ErrorResponse(
        error=exc.message,
        details=getattr(exc, 'details', None)
    )
    
    logger.error(f"Velocity exception: {exc.code} - {exc.message}")
    
    # Use custom encoder for datetime serialization
    content = json.loads(json.dumps(response_data.model_dump(), cls=DateTimeEncoder))
    return JSONResponse(
        status_code=exc.status_code,
        content=content
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors"""
    details = []
    for error in exc.errors():
        details.append(ErrorDetail(
            code="VALIDATION_ERROR",
            message=error['msg'],
            field='.'.join(str(x) for x in error['loc'])
        ))
    
    response_data = ErrorResponse(
        error="Validation failed",
        details=details
    )
    
    logger.warning(f"Validation error: {exc}")
    
    # Use custom encoder for datetime serialization
    content = json.loads(json.dumps(response_data.model_dump(), cls=DateTimeEncoder))
    return JSONResponse(
        status_code=400,
        content=content
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle HTTP exceptions"""
    response_data = ErrorResponse(
        error=exc.detail if hasattr(exc, 'detail') else "HTTP error"
    )
    
    # Use custom encoder for datetime serialization
    content = json.loads(json.dumps(response_data.model_dump(), cls=DateTimeEncoder))
    return JSONResponse(
        status_code=exc.status_code,
        content=content
    )

async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    logger.error(f"Unexpected error: {exc}", exc_info=True)
    
    response_data = ErrorResponse(
        error="Internal server error"
    )
    
    # Use custom encoder for datetime serialization
    content = json.loads(json.dumps(response_data.model_dump(), cls=DateTimeEncoder))
    return JSONResponse(
        status_code=500,
        content=content
    )

# Validation Utilities

def validate_uuid(value: str) -> bool:
    """Validate UUID format"""
    import uuid
    try:
        uuid.UUID(value)
        return True
    except ValueError:
        return False

def validate_cron_expression(expression: str) -> bool:
    """Validate cron expression format"""
    try:
        from croniter import croniter
        return croniter.is_valid(expression)
    except ImportError:
        # Basic validation if croniter not available
        parts = expression.split()
        return len(parts) == 5
    except:
        return False

def validate_json_schema(data: Dict[str, Any], schema: Dict[str, Any]) -> tuple[bool, List[str]]:
    """Validate data against JSON schema"""
    try:
        import jsonschema
        jsonschema.validate(data, schema)
        return True, []
    except ImportError:
        return True, ["JSON schema validation not available"]
    except jsonschema.ValidationError as e:
        return False, [str(e)]

def sanitize_input(value: str, max_length: int = 1000) -> str:
    """Sanitize string input"""
    if not value:
        return ""
    
    # Remove potential XSS patterns
    value = re.sub(r'<script[^>]*>.*?</script>', '', value, flags=re.IGNORECASE | re.DOTALL)
    value = re.sub(r'javascript:', '', value, flags=re.IGNORECASE)
    value = re.sub(r'on\w+\s*=', '', value, flags=re.IGNORECASE)
    
    # Limit length
    if len(value) > max_length:
        value = value[:max_length]
    
    return value.strip()

# Response Helpers

def create_success_response(data: Any = None, message: str = None) -> SuccessResponse:
    """Create standardized success response"""
    return SuccessResponse(data=data, message=message)

def create_paginated_response(
    data: List[Any],
    page: int,
    limit: int,
    total_count: int
) -> PaginatedResponse:
    """Create standardized paginated response"""
    total_pages = (total_count + limit - 1) // limit
    
    pagination = {
        "page": page,
        "limit": limit,
        "total_count": total_count,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1
    }
    
    return PaginatedResponse(data=data, pagination=pagination)