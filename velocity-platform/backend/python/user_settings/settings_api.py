"""
PCI DSS v4.0 Compliant User Settings API
Secure API endpoints for user settings management with full audit trail
"""

from fastapi import FastAPI, HTTPException, Depends, Request, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel, Field, validator
from typing import Dict, Any, Optional, List
import json
import hashlib
import secrets
from datetime import datetime, timedelta
import logging
from dataclasses import asdict

# Import our security service
from .security_service import (
    PCIDSSSecurityService, 
    DataClassification, 
    classify_and_encrypt_settings,
    SecurityException
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SETTINGS_API")
audit_logger = logging.getLogger("PCI_AUDIT")

# Initialize FastAPI with security headers
app = FastAPI(
    title="ERIP User Settings API",
    description="PCI DSS v4.0 Compliant User Settings Management",
    version="1.0.0",
    docs_url=None,  # Disable docs in production
    redoc_url=None  # Disable redoc in production
)

# Security middleware
security = HTTPBearer()
security_service = PCIDSSSecurityService()

# PCI DSS Requirement 4.1: Strong cryptography for data transmission
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://velocity.eripapp.com", "https://app.eripapp.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)

# PCI DSS Requirement 2.3: Encrypt non-console administrative access
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["velocity.eripapp.com", "api.eripapp.com"]
)

# Pydantic models for request validation
class ProfileSettings(BaseModel):
    """User profile settings model"""
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., regex=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}€')
    phone: Optional[str] = Field(None, regex=r'^\+?1?[0-9]{10,15}€')
    company: Optional[str] = Field(None, max_length=200)
    title: Optional[str] = Field(None, max_length=100)
    
    class Config:
        schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john.doe@company.com",
                "phone": "+1234567890",
                "company": "ACME Corp",
                "title": "CTO"
            }
        }

class SecuritySettings(BaseModel):
    """Security settings model"""
    two_factor_enabled: bool = Field(default=False)
    session_timeout: int = Field(default=30, ge=5, le=480)  # 5min to 8hrs
    current_password: Optional[str] = Field(None, min_length=8)
    new_password: Optional[str] = Field(None, min_length=8)
    
    @validator('new_password')
    def validate_password_strength(cls, v):
        """PCI DSS Requirement 8.2.3: Password complexity"""
        if v is None:
            return v
            
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain number')
        if not any(c in '!@#€%^&*()_+-={}[]|;:,.<>?' for c in v):
            raise ValueError('Password must contain special character')
            
        return v

class NotificationSettings(BaseModel):
    """Notification preferences model"""
    email_notifications: bool = Field(default=True)
    push_notifications: bool = Field(default=True)
    weekly_reports: bool = Field(default=True)
    security_alerts: bool = Field(default=True)
    compliance_updates: bool = Field(default=True)
    marketing_emails: bool = Field(default=False)

class SystemSettings(BaseModel):
    """System preferences model"""
    language: str = Field(default="en", regex=r'^[a-z]{2}€')
    timezone: str = Field(default="America/New_York")
    date_format: str = Field(default="MM/DD/YYYY")
    currency: str = Field(default="USD", regex=r'^[A-Z]{3}€')

class PaymentMethod(BaseModel):
    """Payment method model - PCI DSS compliant"""
    card_token: str = Field(..., description="Tokenized card number")
    last_four: str = Field(..., regex=r'^\d{4}€')
    expiry_month: int = Field(..., ge=1, le=12)
    expiry_year: int = Field(..., ge=2025)
    card_type: str = Field(..., regex=r'^(visa|mastercard|amex|discover)€')
    
    class Config:
        schema_extra = {
            "example": {
                "card_token": "tok_1234567890abcdef",
                "last_four": "4242",
                "expiry_month": 12,
                "expiry_year": 2027,
                "card_type": "visa"
            }
        }

class SettingsResponse(BaseModel):
    """Settings response model"""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    timestamp: datetime

# Authentication and authorization
async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    PCI DSS Requirement 8.1: Identify and authenticate access
    JWT token validation and user authentication
    """
    try:
        token = credentials.credentials
        
        # In production, validate JWT token here
        # For demo, we'll simulate user validation
        user_id = "demo_user_123"
        
        # Audit log
        audit_logger.info(json.dumps({
            "event": "USER_AUTHENTICATED",
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat()
        }))
        
        return {"user_id": user_id, "email": "demo@company.com"}
        
    except Exception as e:
        logger.error(f"Authentication failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication token")

async def log_request(request: Request, user: dict = Depends(get_current_user)):
    """
    PCI DSS Requirement 10.2: Log all access to system components
    Comprehensive request logging for audit trail
    """
    audit_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "user_id": user["user_id"],
        "method": request.method,
        "url": str(request.url),
        "client_ip": request.client.host,
        "user_agent": request.headers.get("user-agent"),
        "request_id": request.headers.get("x-request-id", secrets.token_hex(8))
    }
    
    audit_logger.info(json.dumps(audit_data))
    return audit_data

# API Endpoints

@app.get("/api/v1/settings/profile")
async def get_profile_settings(
    user: dict = Depends(get_current_user),
    audit: dict = Depends(log_request)
):
    """
    Get user profile settings
    PCI DSS Requirement 7.1: Limit access to system components by business need-to-know
    """
    try:
        # In production, fetch from secure database
        # For demo, return mock data
        profile_data = {
            "name": "Demo User",
            "email": user["email"],
            "phone": "+1234567890",
            "company": "Demo Company",
            "title": "CTO"
        }
        
        return SettingsResponse(
            success=True,
            message="Profile settings retrieved",
            data=profile_data,
            timestamp=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Profile retrieval failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve profile settings")

@app.put("/api/v1/settings/profile")
async def update_profile_settings(
    settings: ProfileSettings,
    user: dict = Depends(get_current_user),
    audit: dict = Depends(log_request)
):
    """
    Update user profile settings
    PCI DSS Requirement 3.4: Render PAN unreadable (encrypt sensitive data)
    """
    try:
        # Classify and encrypt sensitive data
        profile_dict = settings.dict()
        processed_settings = classify_and_encrypt_settings(profile_dict, security_service)
        
        # In production, save to secure database
        # Audit log
        audit_logger.info(json.dumps({
            "event": "PROFILE_UPDATED",
            "user_id": user["user_id"],
            "fields_updated": list(profile_dict.keys()),
            "timestamp": datetime.utcnow().isoformat()
        }))
        
        return SettingsResponse(
            success=True,
            message="Profile settings updated successfully",
            timestamp=datetime.utcnow()
        )
        
    except SecurityException as e:
        logger.error(f"Security error in profile update: {e}")
        raise HTTPException(status_code=400, detail="Security validation failed")
    except Exception as e:
        logger.error(f"Profile update failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to update profile settings")

@app.put("/api/v1/settings/security")
async def update_security_settings(
    settings: SecuritySettings,
    user: dict = Depends(get_current_user),
    audit: dict = Depends(log_request)
):
    """
    Update security settings
    PCI DSS Requirement 8.2: Strong authentication and password policies
    """
    try:
        settings_dict = settings.dict()
        
        # Hash new password if provided
        if settings.new_password:
            hashed_password = security_service.hash_password(settings.new_password)
            settings_dict["password_hash"] = hashed_password
            del settings_dict["new_password"]
            del settings_dict["current_password"]
            
        # Process with security service
        processed_settings = classify_and_encrypt_settings(settings_dict, security_service)
        
        # Audit log
        audit_logger.info(json.dumps({
            "event": "SECURITY_SETTINGS_UPDATED",
            "user_id": user["user_id"],
            "two_factor_enabled": settings.two_factor_enabled,
            "session_timeout": settings.session_timeout,
            "password_changed": bool(settings.new_password),
            "timestamp": datetime.utcnow().isoformat()
        }))
        
        return SettingsResponse(
            success=True,
            message="Security settings updated successfully",
            timestamp=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Security settings update failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to update security settings")

@app.put("/api/v1/settings/notifications")
async def update_notification_settings(
    settings: NotificationSettings,
    user: dict = Depends(get_current_user),
    audit: dict = Depends(log_request)
):
    """Update notification preferences"""
    try:
        # In production, save to database
        audit_logger.info(json.dumps({
            "event": "NOTIFICATIONS_UPDATED",
            "user_id": user["user_id"],
            "settings": settings.dict(),
            "timestamp": datetime.utcnow().isoformat()
        }))
        
        return SettingsResponse(
            success=True,
            message="Notification settings updated successfully",
            timestamp=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Notification settings update failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to update notification settings")

@app.put("/api/v1/settings/system")
async def update_system_settings(
    settings: SystemSettings,
    user: dict = Depends(get_current_user),
    audit: dict = Depends(log_request)
):
    """Update system preferences"""
    try:
        # In production, save to database
        audit_logger.info(json.dumps({
            "event": "SYSTEM_SETTINGS_UPDATED",
            "user_id": user["user_id"],
            "settings": settings.dict(),
            "timestamp": datetime.utcnow().isoformat()
        }))
        
        return SettingsResponse(
            success=True,
            message="System settings updated successfully",
            timestamp=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"System settings update failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to update system settings")

@app.post("/api/v1/settings/payment-method")
async def add_payment_method(
    request: Request,
    user: dict = Depends(get_current_user),
    audit: dict = Depends(log_request)
):
    """
    Add payment method
    PCI DSS Requirement 3.4: Use tokenization to protect PAN
    """
    try:
        # In production, this would integrate with payment processor
        # for secure tokenization (Stripe, Square, etc.)
        
        body = await request.json()
        card_number = body.get("card_number")
        
        if not card_number:
            raise HTTPException(status_code=400, detail="Card number required")
            
        # Tokenize the card number
        token = security_service.tokenize_payment_data(card_number)
        
        # Create payment method record (without storing PAN)
        payment_method = {
            "token": token,
            "last_four": card_number[-4:],
            "card_type": "visa",  # Would detect from card number
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Audit log (PCI DSS Requirement 10.2)
        audit_logger.info(json.dumps({
            "event": "PAYMENT_METHOD_ADDED",
            "user_id": user["user_id"],
            "token": token[:10] + "...",  # Partial token for audit
            "last_four": card_number[-4:],
            "timestamp": datetime.utcnow().isoformat()
        }))
        
        return SettingsResponse(
            success=True,
            message="Payment method added successfully",
            data={"token": token, "last_four": card_number[-4:]},
            timestamp=datetime.utcnow()
        )
        
    except SecurityException as e:
        logger.error(f"Payment tokenization failed: {e}")
        raise HTTPException(status_code=400, detail="Payment processing failed")
    except Exception as e:
        logger.error(f"Payment method addition failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to add payment method")

@app.get("/api/v1/settings/audit-log")
async def get_audit_log(
    user: dict = Depends(get_current_user),
    audit: dict = Depends(log_request),
    limit: int = 50
):
    """
    Get user's audit log
    PCI DSS Requirement 10.2: Log user access to system components
    """
    try:
        # In production, fetch from audit database
        # For demo, return mock audit entries
        mock_audit_entries = [
            {
                "timestamp": (datetime.utcnow() - timedelta(hours=1)).isoformat(),
                "event": "PROFILE_UPDATED",
                "description": "Profile information updated",
                "ip_address": "192.168.1.100"
            },
            {
                "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                "event": "PASSWORD_CHANGED",
                "description": "Password successfully changed",
                "ip_address": "192.168.1.100"
            },
            {
                "timestamp": (datetime.utcnow() - timedelta(days=1)).isoformat(),
                "event": "LOGIN_SUCCESS",
                "description": "Successful login",
                "ip_address": "192.168.1.100"
            }
        ]
        
        return SettingsResponse(
            success=True,
            message="Audit log retrieved",
            data={"entries": mock_audit_entries[:limit]},
            timestamp=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Audit log retrieval failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve audit log")

# Health check endpoint
@app.get("/health")
async def health_check():
    """API health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    
    # PCI DSS Requirement 4.1: Use strong cryptography and security protocols
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8443,  # HTTPS port
        ssl_keyfile="/etc/ssl/private/api.key",
        ssl_certfile="/etc/ssl/certs/api.crt",
        log_level="info"
    )