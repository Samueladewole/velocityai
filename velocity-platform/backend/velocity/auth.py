"""
Enhanced Authentication Module for Velocity AI Platform
Provides JWT token management, password hashing, and secure authentication
"""

import os
import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, List
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from database import get_db
from models import User, Organization
from rbac import UserRole, rbac_manager

# Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour
REFRESH_TOKEN_EXPIRE_DAYS = 30    # 30 days

security = HTTPBearer()

# Pydantic Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    company: str
    tier: Optional[str] = "starter"
    role: Optional[UserRole] = UserRole.VIEWER

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    company: str
    role: str
    tier: str
    permissions: List[str]
    mfa_enabled: bool = False
    is_verified: bool = False
    created_at: str

class AuthResponse(BaseModel):
    success: bool
    data: Dict[str, Any]

# Password Hashing
def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

# JWT Token Management
def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: Dict[str, Any]) -> str:
    """Create a JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str, token_type: str = "access") -> Dict[str, Any]:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != token_type:
            raise HTTPException(status_code=401, detail="Invalid token type")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def create_tokens(user: User, organization: Organization) -> TokenResponse:
    """Create both access and refresh tokens for a user"""
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "name": user.name,
        "role": user.role.value,
        "org_id": str(user.organization_id),
        "org_name": organization.name,
        "tier": organization.tier,
        "permissions": user.get_permissions()
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token({"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

# Authentication Dependencies
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get the current authenticated user from JWT token"""
    token = credentials.credentials
    payload = verify_token(token)
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get the current active user (additional checks can be added here)"""
    # Add checks for user status, organization status, etc.
    return current_user

# Authentication Service Functions
async def authenticate_user(email: str, password: str, db: Session) -> Optional[User]:
    """Authenticate a user with email and password with security checks"""
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.password_hash:
        return None
    
    # Check if account is locked
    if user.is_locked():
        raise HTTPException(
            status_code=423, 
            detail=f"Account locked until {user.locked_until.isoformat()}"
        )
    
    # Check if account is active and verified
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")
    
    # Verify password
    if not verify_password(password, user.password_hash):
        # Increment failed login attempts
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= 5:  # Lock after 5 failed attempts
            user.lock_account()
            db.commit()
            raise HTTPException(
                status_code=423,
                detail="Account locked due to too many failed login attempts"
            )
        db.commit()
        return None
    
    # Reset failed attempts on successful login
    user.failed_login_attempts = 0
    user.last_login = datetime.now(timezone.utc)
    db.commit()
    
    return user

async def create_user(signup_data: SignupRequest, db: Session) -> User:
    """Create a new user account"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == signup_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Get or create organization
    org = db.query(Organization).filter(Organization.domain == signup_data.company.lower()).first()
    if not org:
        org = Organization(
            name=signup_data.company,
            domain=signup_data.company.lower().replace(" ", ""),
            tier=signup_data.tier
        )
        db.add(org)
        db.commit()
        db.refresh(org)
    
    # Hash password
    password_hash = hash_password(signup_data.password)
    
    # Determine role - first user in org becomes ORG_OWNER, others get requested role
    user_count = db.query(User).filter(User.organization_id == org.id).count()
    if user_count == 0:
        role = UserRole.ORG_OWNER  # First user becomes organization owner
    else:
        role = signup_data.role or UserRole.VIEWER
    
    # Create user
    user = User(
        name=signup_data.name,
        email=signup_data.email,
        password_hash=password_hash,
        role=role,
        organization_id=org.id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

def create_user_response(user: User, organization: Organization) -> UserResponse:
    """Create a user response object"""
    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        company=organization.name,
        role=user.role.value,
        tier=organization.tier,
        permissions=user.get_permissions(),
        mfa_enabled=user.mfa_enabled,
        is_verified=user.is_verified,
        created_at=user.created_at.isoformat()
    )