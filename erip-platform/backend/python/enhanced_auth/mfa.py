"""
Multi-Factor Authentication (MFA) Implementation
TOTP (Time-based One-Time Password) support for authenticator apps
"""

import pyotp
import qrcode
import io
import base64
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from enum import Enum
from pydantic import BaseModel, Field
import structlog
import secrets
import hashlib

logger = structlog.get_logger()

class MFAMethod(str, Enum):
    """Supported MFA methods"""
    TOTP = "totp"          # Authenticator app (Google Authenticator, Authy)
    SMS = "sms"            # SMS verification code
    EMAIL = "email"        # Email verification code
    BACKUP_CODES = "backup_codes"  # One-time backup codes

class MFAChallenge(BaseModel):
    """MFA challenge details"""
    challenge_id: str
    user_id: str
    method: MFAMethod
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
    attempts: int = 0
    max_attempts: int = 3
    metadata: Dict[str, Any] = Field(default_factory=dict)

class MFAEnrollment(BaseModel):
    """User MFA enrollment details"""
    user_id: str
    method: MFAMethod
    secret: Optional[str] = None  # TOTP secret
    phone_number: Optional[str] = None  # SMS number
    email: Optional[str] = None  # Email address
    backup_codes: List[str] = Field(default_factory=list)
    enrolled_at: datetime = Field(default_factory=datetime.utcnow)
    is_verified: bool = False
    is_active: bool = True

class TOTPManager:
    """
    Time-based One-Time Password (TOTP) manager for authenticator apps
    Compatible with Google Authenticator, Authy, Microsoft Authenticator
    """
    
    def __init__(self, issuer_name: str = "ERIP Platform"):
        self.issuer_name = issuer_name
        self.window = 1  # Allow 1 step (30 seconds) of time drift
        
    def generate_secret(self) -> str:
        """Generate a new TOTP secret for user enrollment"""
        return pyotp.random_base32()
    
    def generate_qr_code(self, user_email: str, secret: str) -> str:
        """Generate QR code for easy authenticator app setup"""
        try:
            # Create TOTP URI
            totp = pyotp.TOTP(secret)
            provisioning_uri = totp.provisioning_uri(
                name=user_email,
                issuer_name=self.issuer_name
            )
            
            # Generate QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4
            )
            qr.add_data(provisioning_uri)
            qr.make(fit=True)
            
            # Convert to base64 image
            img = qr.make_image(fill_color="black", back_color="white")
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            img_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            logger.info("TOTP QR code generated", user_email=user_email)
            return f"data:image/png;base64,{img_base64}"
            
        except Exception as e:
            logger.error("Failed to generate QR code", error=str(e))
            raise
    
    def verify_totp(self, secret: str, token: str) -> bool:
        """Verify TOTP token against secret"""
        try:
            totp = pyotp.TOTP(secret)
            is_valid = totp.verify(token, valid_window=self.window)
            
            logger.info("TOTP verification", 
                       token_valid=is_valid,
                       window=self.window)
            
            return is_valid
            
        except Exception as e:
            logger.error("TOTP verification failed", error=str(e))
            return False
    
    def get_current_totp(self, secret: str) -> str:
        """Get current TOTP token (for testing/debugging)"""
        totp = pyotp.TOTP(secret)
        return totp.now()

class MFAManager:
    """
    Comprehensive MFA management system
    Handles enrollment, challenges, and verification
    """
    
    def __init__(self):
        self.totp_manager = TOTPManager()
        self.active_challenges: Dict[str, MFAChallenge] = {}
        self.user_enrollments: Dict[str, List[MFAEnrollment]] = {}
        
    async def enroll_totp(self, user_id: str, user_email: str) -> Dict[str, Any]:
        """Start TOTP enrollment process"""
        try:
            # Generate secret
            secret = self.totp_manager.generate_secret()
            
            # Generate QR code
            qr_code = self.totp_manager.generate_qr_code(user_email, secret)
            
            # Create enrollment record (not verified yet)
            enrollment = MFAEnrollment(
                user_id=user_id,
                method=MFAMethod.TOTP,
                secret=secret,
                is_verified=False
            )
            
            # Store enrollment
            if user_id not in self.user_enrollments:
                self.user_enrollments[user_id] = []
            
            # Remove any existing TOTP enrollment
            self.user_enrollments[user_id] = [
                e for e in self.user_enrollments[user_id] 
                if e.method != MFAMethod.TOTP
            ]
            self.user_enrollments[user_id].append(enrollment)
            
            logger.info("TOTP enrollment started", 
                       user_id=user_id, 
                       user_email=user_email)
            
            return {
                "secret": secret,
                "qr_code": qr_code,
                "manual_entry_key": secret,
                "issuer": self.totp_manager.issuer_name,
                "account_name": user_email
            }
            
        except Exception as e:
            logger.error("TOTP enrollment failed", 
                        user_id=user_id, 
                        error=str(e))
            raise
    
    async def verify_totp_enrollment(self, user_id: str, token: str) -> bool:
        """Verify TOTP token to complete enrollment"""
        try:
            # Find pending TOTP enrollment
            enrollments = self.user_enrollments.get(user_id, [])
            totp_enrollment = next(
                (e for e in enrollments if e.method == MFAMethod.TOTP and not e.is_verified),
                None
            )
            
            if not totp_enrollment:
                logger.warning("No pending TOTP enrollment found", user_id=user_id)
                return False
            
            # Verify token
            is_valid = self.totp_manager.verify_totp(totp_enrollment.secret, token)
            
            if is_valid:
                # Mark as verified and active
                totp_enrollment.is_verified = True
                totp_enrollment.is_active = True
                
                # Generate backup codes
                backup_codes = self._generate_backup_codes()
                totp_enrollment.backup_codes = backup_codes
                
                logger.info("TOTP enrollment completed", user_id=user_id)
                return True
            else:
                logger.warning("Invalid TOTP token during enrollment", user_id=user_id)
                return False
                
        except Exception as e:
            logger.error("TOTP enrollment verification failed", 
                        user_id=user_id, 
                        error=str(e))
            return False
    
    async def create_mfa_challenge(self, user_id: str, method: MFAMethod) -> Optional[MFAChallenge]:
        """Create MFA challenge for user authentication"""
        try:
            # Check if user has enrolled method
            enrollments = self.user_enrollments.get(user_id, [])
            enrollment = next(
                (e for e in enrollments if e.method == method and e.is_verified and e.is_active),
                None
            )
            
            if not enrollment:
                logger.warning("User not enrolled in MFA method", 
                             user_id=user_id, 
                             method=method)
                return None
            
            # Create challenge
            challenge_id = secrets.token_urlsafe(32)
            challenge = MFAChallenge(
                challenge_id=challenge_id,
                user_id=user_id,
                method=method,
                expires_at=datetime.utcnow() + timedelta(minutes=5)
            )
            
            self.active_challenges[challenge_id] = challenge
            
            logger.info("MFA challenge created", 
                       user_id=user_id, 
                       method=method,
                       challenge_id=challenge_id)
            
            return challenge
            
        except Exception as e:
            logger.error("Failed to create MFA challenge", 
                        user_id=user_id, 
                        error=str(e))
            return None
    
    async def verify_mfa_challenge(self, challenge_id: str, token: str) -> bool:
        """Verify MFA challenge with provided token"""
        try:
            challenge = self.active_challenges.get(challenge_id)
            if not challenge:
                logger.warning("Invalid challenge ID", challenge_id=challenge_id)
                return False
            
            # Check if challenge expired
            if datetime.utcnow() > challenge.expires_at:
                logger.warning("Challenge expired", challenge_id=challenge_id)
                del self.active_challenges[challenge_id]
                return False
            
            # Check attempt limit
            if challenge.attempts >= challenge.max_attempts:
                logger.warning("Max attempts exceeded", challenge_id=challenge_id)
                del self.active_challenges[challenge_id]
                return False
            
            challenge.attempts += 1
            
            # Find user enrollment
            enrollments = self.user_enrollments.get(challenge.user_id, [])
            enrollment = next(
                (e for e in enrollments if e.method == challenge.method and e.is_verified),
                None
            )
            
            if not enrollment:
                logger.error("Enrollment not found for challenge", 
                           challenge_id=challenge_id)
                return False
            
            # Verify based on method
            is_valid = False
            if challenge.method == MFAMethod.TOTP:
                is_valid = self.totp_manager.verify_totp(enrollment.secret, token)
            elif challenge.method == MFAMethod.BACKUP_CODES:
                is_valid = self._verify_backup_code(enrollment, token)
            
            if is_valid:
                # Remove challenge after successful verification
                del self.active_challenges[challenge_id]
                logger.info("MFA challenge verified successfully", 
                           challenge_id=challenge_id)
            else:
                logger.warning("MFA challenge verification failed", 
                             challenge_id=challenge_id,
                             attempt=challenge.attempts)
            
            return is_valid
            
        except Exception as e:
            logger.error("MFA challenge verification error", 
                        challenge_id=challenge_id, 
                        error=str(e))
            return False
    
    def _generate_backup_codes(self, count: int = 10) -> List[str]:
        """Generate backup codes for MFA recovery"""
        codes = []
        for _ in range(count):
            # Generate 8-character code
            code = secrets.token_hex(4).upper()
            codes.append(f"{code[:4]}-{code[4:]}")
        return codes
    
    def _verify_backup_code(self, enrollment: MFAEnrollment, code: str) -> bool:
        """Verify and consume backup code"""
        if code in enrollment.backup_codes:
            # Remove used backup code
            enrollment.backup_codes.remove(code)
            return True
        return False
    
    async def get_user_mfa_methods(self, user_id: str) -> List[Dict[str, Any]]:
        """Get enrolled MFA methods for user"""
        enrollments = self.user_enrollments.get(user_id, [])
        
        methods = []
        for enrollment in enrollments:
            if enrollment.is_verified and enrollment.is_active:
                method_info = {
                    "method": enrollment.method,
                    "enrolled_at": enrollment.enrolled_at.isoformat(),
                    "backup_codes_remaining": len(enrollment.backup_codes) if enrollment.backup_codes else 0
                }
                
                if enrollment.method == MFAMethod.SMS and enrollment.phone_number:
                    method_info["masked_phone"] = f"***-***-{enrollment.phone_number[-4:]}"
                elif enrollment.method == MFAMethod.EMAIL and enrollment.email:
                    email_parts = enrollment.email.split('@')
                    method_info["masked_email"] = f"{email_parts[0][:2]}***@{email_parts[1]}"
                
                methods.append(method_info)
        
        return methods
    
    async def disable_mfa_method(self, user_id: str, method: MFAMethod) -> bool:
        """Disable MFA method for user"""
        try:
            enrollments = self.user_enrollments.get(user_id, [])
            for enrollment in enrollments:
                if enrollment.method == method:
                    enrollment.is_active = False
                    logger.info("MFA method disabled", 
                               user_id=user_id, 
                               method=method)
                    return True
            
            logger.warning("MFA method not found for disable", 
                          user_id=user_id, 
                          method=method)
            return False
            
        except Exception as e:
            logger.error("Failed to disable MFA method", 
                        user_id=user_id, 
                        method=method, 
                        error=str(e))
            return False

# Global MFA manager instance
mfa_manager = MFAManager()

# Convenience functions
async def generate_totp_secret(user_id: str, user_email: str) -> Dict[str, Any]:
    """Generate TOTP secret and QR code for user enrollment"""
    return await mfa_manager.enroll_totp(user_id, user_email)

async def verify_totp(user_id: str, token: str) -> bool:
    """Verify TOTP token for enrolled user"""
    return await mfa_manager.verify_totp_enrollment(user_id, token)

async def create_mfa_challenge(user_id: str, method: MFAMethod = MFAMethod.TOTP) -> Optional[MFAChallenge]:
    """Create MFA challenge for authentication"""
    return await mfa_manager.create_mfa_challenge(user_id, method)

async def verify_mfa_challenge(challenge_id: str, token: str) -> bool:
    """Verify MFA challenge"""
    return await mfa_manager.verify_mfa_challenge(challenge_id, token)