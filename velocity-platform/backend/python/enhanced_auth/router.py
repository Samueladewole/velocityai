"""
Enhanced Authentication API Router
MFA, SSO, and advanced authentication endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime
import structlog

from shared.auth import get_current_user, TokenData
from .mfa import (
    mfa_manager,
    MFAMethod,
    generate_totp_secret,
    verify_totp,
    create_mfa_challenge,
    verify_mfa_challenge
)

router = APIRouter()
logger = structlog.get_logger()

# Pydantic models for API requests
class TOTPEnrollmentRequest(BaseModel):
    user_email: str

class TOTPVerificationRequest(BaseModel):
    token: str

class MFAChallengeRequest(BaseModel):
    method: MFAMethod = MFAMethod.TOTP

class MFAChallengeVerificationRequest(BaseModel):
    challenge_id: str
    token: str

class MFAMethodDisableRequest(BaseModel):
    method: MFAMethod

# TOTP/MFA Enrollment Endpoints
@router.post("/mfa/totp/enroll")
async def enroll_totp(
    request: TOTPEnrollmentRequest,
    current_user: TokenData = Depends(get_current_user)
):
    """
    Enroll user in TOTP (authenticator app) MFA
    
    Returns QR code and manual entry key for authenticator app setup
    """
    try:
        logger.info("TOTP enrollment started", 
                   user_id=current_user.user_id,
                   email=request.user_email)
        
        enrollment_data = await generate_totp_secret(
            current_user.user_id, 
            request.user_email
        )
        
        return {
            "status": "enrollment_started",
            "qr_code": enrollment_data["qr_code"],
            "manual_entry_key": enrollment_data["manual_entry_key"],
            "issuer": enrollment_data["issuer"],
            "account_name": enrollment_data["account_name"],
            "instructions": [
                "1. Open your authenticator app (Google Authenticator, Authy, etc.)",
                "2. Scan the QR code or manually enter the key",
                "3. Enter the 6-digit code from your app to verify enrollment"
            ]
        }
        
    except Exception as e:
        logger.error("TOTP enrollment failed", 
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"TOTP enrollment failed: {str(e)}"
        )

@router.post("/mfa/totp/verify-enrollment")
async def verify_totp_enrollment(
    request: TOTPVerificationRequest,
    current_user: TokenData = Depends(get_current_user)
):
    """
    Verify TOTP token to complete enrollment
    
    User provides 6-digit code from authenticator app
    """
    try:
        is_valid = await mfa_manager.verify_totp_enrollment(
            current_user.user_id,
            request.token
        )
        
        if is_valid:
            # Get backup codes
            enrollments = mfa_manager.user_enrollments.get(current_user.user_id, [])
            totp_enrollment = next(
                (e for e in enrollments if e.method == MFAMethod.TOTP and e.is_verified),
                None
            )
            
            backup_codes = totp_enrollment.backup_codes if totp_enrollment else []
            
            logger.info("TOTP enrollment completed", 
                       user_id=current_user.user_id)
            
            return {
                "status": "enrollment_completed",
                "message": "TOTP MFA successfully enrolled",
                "backup_codes": backup_codes,
                "backup_codes_warning": "Save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device."
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid TOTP token. Please check your authenticator app and try again."
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error("TOTP enrollment verification failed", 
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"TOTP verification failed: {str(e)}"
        )

# MFA Challenge Endpoints (for login flow)
@router.post("/mfa/challenge/create")
async def create_mfa_challenge_endpoint(
    request: MFAChallengeRequest,
    current_user: TokenData = Depends(get_current_user)
):
    """
    Create MFA challenge for authentication
    
    Used during login flow when MFA is required
    """
    try:
        challenge = await create_mfa_challenge(current_user.user_id, request.method)
        
        if challenge:
            logger.info("MFA challenge created", 
                       user_id=current_user.user_id,
                       method=request.method,
                       challenge_id=challenge.challenge_id)
            
            return {
                "challenge_id": challenge.challenge_id,
                "method": challenge.method,
                "expires_at": challenge.expires_at.isoformat(),
                "max_attempts": challenge.max_attempts,
                "instructions": {
                    MFAMethod.TOTP: "Enter the 6-digit code from your authenticator app",
                    MFAMethod.SMS: "Enter the code sent to your phone",
                    MFAMethod.EMAIL: "Enter the code sent to your email",
                    MFAMethod.BACKUP_CODES: "Enter one of your backup codes"
                }.get(request.method, "Enter your verification code")
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User not enrolled in {request.method} MFA method"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error("MFA challenge creation failed", 
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"MFA challenge creation failed: {str(e)}"
        )

@router.post("/mfa/challenge/verify")
async def verify_mfa_challenge_endpoint(
    request: MFAChallengeVerificationRequest,
    current_user: TokenData = Depends(get_current_user)
):
    """
    Verify MFA challenge with provided token
    
    Completes MFA authentication process
    """
    try:
        is_valid = await verify_mfa_challenge(request.challenge_id, request.token)
        
        if is_valid:
            logger.info("MFA challenge verified", 
                       user_id=current_user.user_id,
                       challenge_id=request.challenge_id)
            
            return {
                "status": "verified",
                "message": "MFA challenge successfully verified",
                "timestamp": datetime.utcnow().isoformat()
            }
        else:
            logger.warning("MFA challenge verification failed", 
                          user_id=current_user.user_id,
                          challenge_id=request.challenge_id)
            
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification code or expired challenge"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error("MFA challenge verification error", 
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"MFA verification failed: {str(e)}"
        )

# MFA Management Endpoints
@router.get("/mfa/methods")
async def get_user_mfa_methods(
    current_user: TokenData = Depends(get_current_user)
):
    """
    Get user's enrolled MFA methods
    
    Returns list of active MFA methods for the user
    """
    try:
        methods = await mfa_manager.get_user_mfa_methods(current_user.user_id)
        
        return {
            "user_id": current_user.user_id,
            "enrolled_methods": methods,
            "available_methods": [
                {
                    "method": MFAMethod.TOTP,
                    "name": "Authenticator App",
                    "description": "Use Google Authenticator, Authy, or similar apps"
                },
                {
                    "method": MFAMethod.SMS,
                    "name": "SMS Verification",
                    "description": "Receive codes via text message"
                },
                {
                    "method": MFAMethod.EMAIL,
                    "name": "Email Verification", 
                    "description": "Receive codes via email"
                }
            ]
        }
        
    except Exception as e:
        logger.error("Failed to get MFA methods", 
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve MFA methods: {str(e)}"
        )

@router.post("/mfa/methods/disable")
async def disable_mfa_method(
    request: MFAMethodDisableRequest,
    current_user: TokenData = Depends(get_current_user)
):
    """
    Disable MFA method for user
    
    Removes the specified MFA method from user's account
    """
    try:
        success = await mfa_manager.disable_mfa_method(
            current_user.user_id,
            request.method
        )
        
        if success:
            logger.info("MFA method disabled", 
                       user_id=current_user.user_id,
                       method=request.method)
            
            return {
                "status": "disabled",
                "method": request.method,
                "message": f"{request.method} MFA method has been disabled"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"MFA method {request.method} not found or already disabled"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to disable MFA method", 
                    user_id=current_user.user_id,
                    method=request.method,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to disable MFA method: {str(e)}"
        )

# MFA Status and Statistics
@router.get("/mfa/status")
async def get_mfa_status(
    current_user: TokenData = Depends(get_current_user)
):
    """
    Get comprehensive MFA status for user
    
    Returns enrollment status, security recommendations, and statistics
    """
    try:
        methods = await mfa_manager.get_user_mfa_methods(current_user.user_id)
        
        has_totp = any(m["method"] == MFAMethod.TOTP for m in methods)
        has_sms = any(m["method"] == MFAMethod.SMS for m in methods)
        has_email = any(m["method"] == MFAMethod.EMAIL for m in methods)
        
        # Security recommendations
        recommendations = []
        if not methods:
            recommendations.append("Enable at least one MFA method to secure your account")
        if not has_totp:
            recommendations.append("Consider setting up authenticator app for stronger security")
        if len(methods) == 1:
            recommendations.append("Enable a backup MFA method in case you lose access to your primary method")
        
        # Security score (0-100)
        security_score = 0
        if has_totp:
            security_score += 60  # TOTP is most secure
        if has_sms or has_email:
            security_score += 30  # SMS/Email as backup
        if len(methods) >= 2:
            security_score += 10  # Multiple methods bonus
        
        return {
            "user_id": current_user.user_id,
            "mfa_enabled": len(methods) > 0,
            "enrolled_methods_count": len(methods),
            "enrolled_methods": methods,
            "security_score": min(security_score, 100),
            "recommendations": recommendations,
            "compliance": {
                "enterprise_ready": has_totp,
                "backup_method_available": len(methods) >= 2,
                "strong_authentication": has_totp
            }
        }
        
    except Exception as e:
        logger.error("Failed to get MFA status", 
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve MFA status: {str(e)}"
        )