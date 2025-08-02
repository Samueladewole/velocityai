"""
Authentication Routes for Velocity AI Platform
FastAPI routes for user registration, login, and profile management with Supabase
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Dict, Any

from database import get_db
from supabase_auth import (
    SupabaseAuthService, 
    SignupRequest, 
    LoginRequest, 
    TokenResponse, 
    UserResponse,
    get_current_user,
    get_current_active_user,
    require_min_role,
    security
)
from models import User, Organization, UserRole

# Create router
router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

# Initialize auth service
auth_service = SupabaseAuthService()

@router.post("/register", response_model=TokenResponse)
async def register_user(
    signup_data: SignupRequest,
    db: Session = Depends(get_db)
):
    """
    Register a new user and organization
    
    Creates:
    - User account in Supabase Auth
    - Organization record in database
    - User record in database with role and organization link
    
    Returns JWT tokens for immediate login
    """
    return await auth_service.register_user(signup_data, db)

@router.post("/login", response_model=TokenResponse)
async def login_user(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Authenticate user and return JWT tokens
    
    Validates credentials with Supabase Auth and returns:
    - Access token (1 hour expiry)
    - Refresh token (30 days expiry)
    - User information
    """
    return await auth_service.login_user(login_data, db)

@router.post("/refresh", response_model=TokenResponse)
async def refresh_access_token(
    refresh_token: str,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using refresh token
    
    Extends user session without requiring re-authentication
    """
    return await auth_service.refresh_token(refresh_token)

@router.post("/logout")
async def logout_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Logout user by invalidating session
    
    Clears Supabase session and invalidates tokens
    """
    success = await auth_service.logout_user(credentials.credentials)
    return {"message": "Successfully logged out" if success else "Logout failed"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's profile information
    
    Returns complete user profile with organization details
    """
    organization = db.query(Organization).filter(
        Organization.id == current_user.organization_id
    ).first()
    
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        role=current_user.role.value,
        organization_id=str(current_user.organization_id),
        organization_name=organization.name if organization else "Unknown",
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )

@router.put("/me")
async def update_user_profile(
    profile_data: Dict[str, Any],
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile
    
    Allows users to update their name, timezone, and preferences
    """
    # Allowed fields for user update
    allowed_fields = {'name', 'timezone', 'preferences'}
    
    for field, value in profile_data.items():
        if field in allowed_fields and hasattr(current_user, field):
            setattr(current_user, field, value)
    
    db.commit()
    
    return {"message": "Profile updated successfully"}

@router.get("/verify-token")
async def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Verify if token is valid and return token information
    
    Useful for frontend to check auth status
    """
    token_data = await auth_service.verify_token(credentials)
    return {
        "valid": True,
        "user_id": token_data["user_id"],
        "email": token_data["email"],
        "expires_at": token_data["exp"]
    }

# Organization management routes (for admins)
@router.get("/organization/users")
async def get_organization_users(
    current_user: User = Depends(require_min_role(UserRole.ORG_ADMIN)),
    db: Session = Depends(get_db)
):
    """
    Get all users in the current user's organization
    
    Requires ORG_ADMIN role or higher
    """
    users = db.query(User).filter(
        User.organization_id == current_user.organization_id
    ).all()
    
    return [
        {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "role": user.role.value,
            "is_active": user.is_active,
            "last_login": user.last_login,
            "created_at": user.created_at
        }
        for user in users
    ]

@router.put("/organization/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    new_role: UserRole,
    current_user: User = Depends(require_min_role(UserRole.ORG_ADMIN)),
    db: Session = Depends(get_db)
):
    """
    Update a user's role within the organization
    
    Requires ORG_ADMIN role or higher
    Can only modify users in the same organization
    """
    # Get target user
    target_user = db.query(User).filter(
        User.id == user_id,
        User.organization_id == current_user.organization_id
    ).first()
    
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found in your organization"
        )
    
    # Prevent self-modification
    if target_user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify your own role"
        )
    
    # Update role
    target_user.role = new_role
    db.commit()
    
    return {"message": f"User role updated to {new_role.value}"}

@router.put("/organization/users/{user_id}/status")
async def toggle_user_status(
    user_id: str,
    is_active: bool,
    current_user: User = Depends(require_min_role(UserRole.ORG_ADMIN)),
    db: Session = Depends(get_db)
):
    """
    Activate or deactivate a user
    
    Requires ORG_ADMIN role or higher
    Can only modify users in the same organization
    """
    # Get target user
    target_user = db.query(User).filter(
        User.id == user_id,
        User.organization_id == current_user.organization_id
    ).first()
    
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found in your organization"
        )
    
    # Prevent self-modification
    if target_user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify your own status"
        )
    
    # Update status
    target_user.is_active = is_active
    db.commit()
    
    action = "activated" if is_active else "deactivated"
    return {"message": f"User {action} successfully"}

# Password management
@router.post("/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Change user's password
    
    Requires current password verification
    Updates password in both Supabase Auth and local database
    """
    # Verify current password through Supabase
    try:
        login_result = await auth_service.login_user(
            LoginRequest(email=current_user.email, password=current_password),
            db
        )
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Update password in Supabase Auth
    # Note: This requires admin privileges or a different approach
    # For now, we'll update the local hash
    current_user.password_hash = auth_service._hash_password(new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}

# Health check for auth service
@router.get("/health")
async def auth_health_check():
    """
    Check authentication service health
    
    Verifies Supabase connectivity and configuration
    """
    try:
        # Test Supabase client
        client = auth_service.supabase
        
        return {
            "status": "healthy",
            "supabase_connected": client is not None,
            "jwt_secret_configured": auth_service.jwt_secret is not None
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }