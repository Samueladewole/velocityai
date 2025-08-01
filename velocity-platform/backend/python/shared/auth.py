# ERIP Authentication and Security Infrastructure
# Enterprise-grade authentication with JWT tokens and role-based access control

from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import uuid
import os
from .config import get_settings

# Security Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "erip-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

class UserRole:
    """Enterprise role definitions for ERIP platform"""
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    RISK_MANAGER = "risk_manager"
    COMPLIANCE_OFFICER = "compliance_officer"
    SECURITY_ANALYST = "security_analyst"
    EXECUTIVE = "executive"
    AUDITOR = "auditor"
    READONLY = "readonly"

class ComponentPermissions:
    """Permissions mapping for each ERIP component"""
    COMPASS = "compass"
    ATLAS = "atlas"
    PRISM = "prism"
    PULSE = "pulse"
    CIPHER = "cipher"
    NEXUS = "nexus"
    BEACON = "beacon"
    CLEARANCE = "clearance"

# Role-based permissions matrix
ROLE_PERMISSIONS = {
    UserRole.SUPER_ADMIN: [
        ComponentPermissions.COMPASS, ComponentPermissions.ATLAS, 
        ComponentPermissions.PRISM, ComponentPermissions.PULSE,
        ComponentPermissions.CIPHER, ComponentPermissions.NEXUS,
        ComponentPermissions.BEACON, ComponentPermissions.CLEARANCE
    ],
    UserRole.ADMIN: [
        ComponentPermissions.COMPASS, ComponentPermissions.ATLAS,
        ComponentPermissions.PRISM, ComponentPermissions.PULSE,
        ComponentPermissions.NEXUS, ComponentPermissions.BEACON
    ],
    UserRole.RISK_MANAGER: [
        ComponentPermissions.COMPASS, ComponentPermissions.PRISM,
        ComponentPermissions.PULSE, ComponentPermissions.BEACON,
        ComponentPermissions.CLEARANCE
    ],
    UserRole.COMPLIANCE_OFFICER: [
        ComponentPermissions.COMPASS, ComponentPermissions.ATLAS,
        ComponentPermissions.CIPHER, ComponentPermissions.BEACON
    ],
    UserRole.SECURITY_ANALYST: [
        ComponentPermissions.ATLAS, ComponentPermissions.PULSE,
        ComponentPermissions.NEXUS
    ],
    UserRole.EXECUTIVE: [
        ComponentPermissions.PRISM, ComponentPermissions.BEACON,
        ComponentPermissions.CLEARANCE
    ],
    UserRole.AUDITOR: [
        ComponentPermissions.COMPASS, ComponentPermissions.ATLAS,
        ComponentPermissions.BEACON
    ],
    UserRole.READONLY: []  # Read-only access to dashboards
}

class TokenData(BaseModel):
    user_id: str
    email: str
    role: str
    permissions: List[str]
    organization_id: str
    session_id: str

class User(BaseModel):
    id: str
    email: str
    name: str
    role: str
    organization_id: str
    is_active: bool = True
    created_at: datetime
    last_login: Optional[datetime] = None

class AuthTokens(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(
    user_id: str,
    email: str,
    role: str,
    organization_id: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create JWT access token with user claims"""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    session_id = str(uuid.uuid4())
    permissions = ROLE_PERMISSIONS.get(role, [])
    
    to_encode = {
        "sub": user_id,
        "email": email,
        "role": role,
        "org_id": organization_id,
        "permissions": permissions,
        "session_id": session_id,
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    }
    
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(user_id: str, organization_id: str) -> str:
    """Create JWT refresh token"""
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode = {
        "sub": user_id,
        "org_id": organization_id,
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh"
    }
    
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> TokenData:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID"
            )
        
        token_type = payload.get("type", "access")
        if token_type != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        return TokenData(
            user_id=user_id,
            email=payload.get("email", ""),
            role=payload.get("role", ""),
            permissions=payload.get("permissions", []),
            organization_id=payload.get("org_id", ""),
            session_id=payload.get("session_id", "")
        )
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

def create_dev_user() -> TokenData:
    """Create a development user with full permissions for bypassing auth"""
    settings = get_settings()
    return TokenData(
        user_id="dev_user_001",
        email=settings.dev_mode_default_user,
        role=settings.dev_mode_default_role,
        permissions=ROLE_PERMISSIONS.get(settings.dev_mode_default_role, []),
        organization_id="dev_org_001",
        session_id="dev_session"
    )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> TokenData:
    """Dependency to get current authenticated user"""
    settings = get_settings()
    
    # Development mode: bypass authentication
    if settings.environment == "development" and settings.dev_mode_bypass_auth:
        return create_dev_user()
    
    # Production mode: require valid token
    return verify_token(credentials.credentials)

async def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> TokenData:
    """Dependency to get current user, allowing development mode bypass"""
    settings = get_settings()
    
    # Development mode: always return dev user
    if settings.environment == "development" and settings.dev_mode_bypass_auth:
        return create_dev_user()
    
    # Production mode: require authentication
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    return verify_token(credentials.credentials)

def require_permission(component: str):
    """Decorator to require specific component permission"""
    def permission_checker(current_user: TokenData = Depends(get_current_user)) -> TokenData:
        settings = get_settings()
        
        # Development mode: bypass permission checks
        if settings.environment == "development" and settings.dev_mode_bypass_auth:
            return current_user
        
        # Production mode: enforce permissions
        if component not in current_user.permissions and current_user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions for {component}"
            )
        return current_user
    return permission_checker

def require_role(required_role: str):
    """Decorator to require specific role"""
    def role_checker(current_user: TokenData = Depends(get_current_user)) -> TokenData:
        settings = get_settings()
        
        # Development mode: bypass role checks
        if settings.environment == "development" and settings.dev_mode_bypass_auth:
            return current_user
        
        # Production mode: enforce roles
        if current_user.role != required_role and current_user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role {required_role} required"
            )
        return current_user
    return role_checker

# Mock user database (replace with actual database in production)
MOCK_USERS = {
    "dev@erip.com": {
        "id": "dev_user_001",
        "email": "dev@erip.com",
        "name": "Development User",
        "hashed_password": hash_password("dev-password"),
        "role": UserRole.SUPER_ADMIN,
        "organization_id": "dev_org_001",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    "admin@erip.com": {
        "id": "user_001",
        "email": "admin@erip.com",
        "name": "ERIP Administrator",
        "hashed_password": hash_password("erip-admin-2025"),
        "role": UserRole.SUPER_ADMIN,
        "organization_id": "org_001",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    "risk@erip.com": {
        "id": "user_002",
        "email": "risk@erip.com",
        "name": "Risk Manager",
        "hashed_password": hash_password("risk-manager-2025"),
        "role": UserRole.RISK_MANAGER,
        "organization_id": "org_001",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    "compliance@erip.com": {
        "id": "user_003",
        "email": "compliance@erip.com",
        "name": "Compliance Officer",
        "hashed_password": hash_password("compliance-2025"),
        "role": UserRole.COMPLIANCE_OFFICER,
        "organization_id": "org_001",
        "is_active": True,
        "created_at": datetime.utcnow()
    }
}

async def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    """Authenticate user with email and password"""
    user = MOCK_USERS.get(email)
    if not user:
        return None
    
    if not verify_password(password, user["hashed_password"]):
        return None
    
    if not user["is_active"]:
        return None
    
    # Update last login
    user["last_login"] = datetime.utcnow()
    
    return user

def create_auth_tokens(user: Dict[str, Any]) -> AuthTokens:
    """Create both access and refresh tokens for user"""
    access_token = create_access_token(
        user_id=user["id"],
        email=user["email"],
        role=user["role"],
        organization_id=user["organization_id"]
    )
    
    refresh_token = create_refresh_token(
        user_id=user["id"],
        organization_id=user["organization_id"]
    )
    
    return AuthTokens(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )