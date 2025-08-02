"""
Supabase Authentication Service for Velocity AI Platform
Integrates Supabase Auth with our FastAPI backend and database models
"""

import os
import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, Tuple
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client
import jwt
import bcrypt

from database import get_db
from models import User, Organization, UserRole
from supabase_config import get_supabase_client

security = HTTPBearer()

# Pydantic Models
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    company_name: str
    tier: Optional[str] = "starter"
    role: Optional[UserRole] = UserRole.VIEWER

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    organization_id: str
    organization_name: str
    is_active: bool
    created_at: datetime

class SupabaseAuthService:
    """Handles authentication using Supabase Auth with custom user management"""
    
    def __init__(self):
        self.supabase = get_supabase_client()
        self.jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
    
    async def register_user(self, signup_data: SignupRequest, db: Session) -> TokenResponse:
        """Register a new user with Supabase Auth and create records in our database"""
        try:
            # 1. Create user in Supabase Auth
            auth_response = self.supabase.auth.sign_up({
                "email": signup_data.email,
                "password": signup_data.password,
                "options": {
                    "data": {
                        "name": signup_data.name,
                        "company": signup_data.company_name
                    }
                }
            })
            
            if auth_response.user is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to create user account"
                )
            
            supabase_user = auth_response.user
            
            # 2. Create organization in our database
            organization = Organization(
                id=uuid.uuid4(),
                name=signup_data.company_name,
                domain=signup_data.email.split('@')[1],
                tier=signup_data.tier,
                settings={},
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db.add(organization)
            db.flush()  # Get the organization ID
            
            # 3. Create user in our database
            user = User(
                id=uuid.UUID(supabase_user.id),
                email=signup_data.email,
                name=signup_data.name,
                password_hash=self._hash_password(signup_data.password),
                role=signup_data.role,
                organization_id=organization.id,
                is_active=True,
                is_verified=False,
                failed_login_attempts=0,
                mfa_enabled=False,
                timezone="UTC",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db.add(user)
            db.commit()
            
            # 4. Return tokens and user info
            return TokenResponse(
                access_token=auth_response.session.access_token,
                refresh_token=auth_response.session.refresh_token,
                expires_in=auth_response.session.expires_in,
                user={
                    "id": str(user.id),
                    "email": user.email,
                    "name": user.name,
                    "role": user.role.value,
                    "organization_id": str(user.organization_id),
                    "organization_name": organization.name
                }
            )
            
        except Exception as e:
            db.rollback()
            if "already registered" in str(e).lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Registration failed: {str(e)}"
            )
    
    async def login_user(self, login_data: LoginRequest, db: Session) -> TokenResponse:
        """Authenticate user with Supabase and return tokens"""
        try:
            # 1. Authenticate with Supabase
            auth_response = self.supabase.auth.sign_in_with_password({
                "email": login_data.email,
                "password": login_data.password
            })
            
            if auth_response.user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )
            
            supabase_user = auth_response.user
            
            # 2. Get user from our database
            user = db.query(User).filter(
                User.id == uuid.UUID(supabase_user.id)
            ).first()
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found in system"
                )
            
            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Account is deactivated"
                )
            
            # 3. Update last login
            user.last_login = datetime.now(timezone.utc)
            user.failed_login_attempts = 0
            db.commit()
            
            # 4. Get organization info
            organization = db.query(Organization).filter(
                Organization.id == user.organization_id
            ).first()
            
            return TokenResponse(
                access_token=auth_response.session.access_token,
                refresh_token=auth_response.session.refresh_token,
                expires_in=auth_response.session.expires_in,
                user={
                    "id": str(user.id),
                    "email": user.email,
                    "name": user.name,
                    "role": user.role.value,
                    "organization_id": str(user.organization_id),
                    "organization_name": organization.name if organization else "Unknown"
                }
            )
            
        except HTTPException:
            raise
        except Exception as e:
            # Handle failed login attempts
            user = db.query(User).filter(User.email == login_data.email).first()
            if user:
                user.failed_login_attempts += 1
                if user.failed_login_attempts >= 5:
                    user.locked_until = datetime.now(timezone.utc).replace(hour=23, minute=59, second=59)
                db.commit()
            
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
    
    async def verify_token(self, credentials: HTTPAuthorizationCredentials) -> Dict[str, Any]:
        """Verify JWT token from Supabase"""
        try:
            token = credentials.credentials
            
            # Verify with Supabase
            user_response = self.supabase.auth.get_user(token)
            
            if user_response.user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired token"
                )
            
            # Decode JWT to get claims
            payload = jwt.decode(
                token, 
                self.jwt_secret, 
                algorithms=["HS256"],
                options={"verify_aud": False}  # Supabase has custom audience
            )
            
            return {
                "user_id": payload.get("sub"),
                "email": payload.get("email"),
                "role": payload.get("role", "authenticated"),
                "exp": payload.get("exp")
            }
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token verification failed"
            )
    
    async def get_current_user(self, credentials: HTTPAuthorizationCredentials, db: Session) -> User:
        """Get current user from JWT token"""
        token_data = await self.verify_token(credentials)
        user_id = token_data["user_id"]
        
        user = db.query(User).filter(User.id == uuid.UUID(user_id)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated"
            )
        
        return user
    
    async def refresh_token(self, refresh_token: str) -> TokenResponse:
        """Refresh access token using refresh token"""
        try:
            auth_response = self.supabase.auth.refresh_session(refresh_token)
            
            if auth_response.session is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid refresh token"
                )
            
            return TokenResponse(
                access_token=auth_response.session.access_token,
                refresh_token=auth_response.session.refresh_token,
                expires_in=auth_response.session.expires_in,
                user={}  # Would need to fetch user data if needed
            )
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Failed to refresh token"
            )
    
    async def logout_user(self, token: str) -> bool:
        """Logout user by invalidating token"""
        try:
            await self.supabase.auth.sign_out()
            return True
        except Exception:
            return False
    
    def _hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def _verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# Dependency functions
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Dependency to get current authenticated user"""
    auth_service = SupabaseAuthService()
    return await auth_service.get_current_user(credentials, db)

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to get current active user"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    return current_user

def require_role(required_role: UserRole):
    """Dependency factory for role-based access control"""
    def role_checker(current_user: User = Depends(get_current_active_user)) -> User:
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required: {required_role.value}"
            )
        return current_user
    return role_checker

def require_min_role(min_role: UserRole):
    """Dependency factory for minimum role requirement"""
    def role_checker(current_user: User = Depends(get_current_active_user)) -> User:
        # Define role hierarchy (higher number = more permissions)
        role_hierarchy = {
            UserRole.VIEWER: 1,
            UserRole.AGENT_OPERATOR: 2,
            UserRole.EVIDENCE_REVIEWER: 3,
            UserRole.SECURITY_ANALYST: 4,
            UserRole.COMPLIANCE_OFFICER: 5,
            UserRole.RISK_ANALYST: 6,
            UserRole.AUDIT_MANAGER: 7,
            UserRole.SECURITY_LEAD: 8,
            UserRole.COMPLIANCE_MANAGER: 9,
            UserRole.ORG_ADMIN: 10,
            UserRole.ORG_OWNER: 11,
            UserRole.PLATFORM_ADMIN: 12,
            UserRole.SUPER_ADMIN: 13
        }
        
        user_level = role_hierarchy.get(current_user.role, 0)
        required_level = role_hierarchy.get(min_role, 999)
        
        if user_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required minimum: {min_role.value}"
            )
        return current_user
    return role_checker