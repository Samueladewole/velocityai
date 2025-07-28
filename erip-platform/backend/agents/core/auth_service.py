"""
Authentication and Authorization Service for ERIP Velocity Tier
Implements OWASP-compliant security with role-based access control, 
multi-factor authentication, and comprehensive audit logging.
"""

import os
import jwt
import bcrypt
import pyotp
import redis
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import structlog
from cryptography.fernet import Fernet
import hashlib
import secrets
import time

logger = structlog.get_logger()

class UserRole(Enum):
    ADMIN = "ADMIN"
    CISO = "CISO"
    COMPLIANCE_MANAGER = "COMPLIANCE_MANAGER"
    SECURITY_ARCHITECT = "SECURITY_ARCHITECT"
    EXECUTIVE = "EXECUTIVE"
    AUDITOR = "AUDITOR"
    USER = "USER"

class Permission(Enum):
    # Velocity-specific permissions
    VELOCITY_READ = "velocity:read"
    VELOCITY_WRITE = "velocity:write"
    VELOCITY_ADMIN = "velocity:admin"
    
    # Agent management
    AGENTS_CREATE = "agents:create"
    AGENTS_READ = "agents:read"
    AGENTS_UPDATE = "agents:update"
    AGENTS_DELETE = "agents:delete"
    AGENTS_EXECUTE = "agents:execute"
    
    # Evidence management
    EVIDENCE_READ = "evidence:read"
    EVIDENCE_VALIDATE = "evidence:validate"
    EVIDENCE_DELETE = "evidence:delete"
    
    # System administration
    SYSTEM_CONFIG = "system:config"
    SYSTEM_MONITOR = "system:monitor"
    SYSTEM_AUDIT = "system:audit"
    
    # Customer data access
    CUSTOMER_DATA_READ = "customer:data:read"
    CUSTOMER_DATA_WRITE = "customer:data:write"

@dataclass
class User:
    id: str
    email: str
    name: str
    customer_id: str
    role: UserRole
    permissions: List[Permission]
    is_active: bool = True
    mfa_enabled: bool = False
    mfa_secret: Optional[str] = None
    created_at: datetime = None
    last_login: Optional[datetime] = None
    failed_login_attempts: int = 0
    locked_until: Optional[datetime] = None

@dataclass
class Session:
    session_id: str
    user_id: str
    customer_id: str
    permissions: List[Permission]
    created_at: datetime
    expires_at: datetime
    ip_address: str
    user_agent: str
    is_active: bool = True

@dataclass
class SecurityEvent:
    event_id: str
    event_type: str
    user_id: Optional[str]
    customer_id: Optional[str]
    ip_address: str
    user_agent: str
    timestamp: datetime
    details: Dict
    severity: str = "INFO"

class VelocityAuthService:
    """OWASP-compliant authentication and authorization service"""
    
    def __init__(self, redis_client: redis.Redis, secret_key: str):
        self.redis = redis_client
        self.secret_key = secret_key
        self.fernet = Fernet(Fernet.generate_key())
        
        # Security configurations
        self.max_failed_attempts = 5
        self.lockout_duration = timedelta(minutes=30)
        self.session_duration = timedelta(hours=8)
        self.password_min_length = 12
        self.require_mfa = True
        
        # Role-based permissions mapping
        self.role_permissions = {
            UserRole.ADMIN: [p for p in Permission],  # All permissions
            UserRole.CISO: [
                Permission.VELOCITY_READ, Permission.VELOCITY_WRITE,
                Permission.AGENTS_READ, Permission.AGENTS_CREATE, Permission.AGENTS_UPDATE,
                Permission.EVIDENCE_READ, Permission.EVIDENCE_VALIDATE,
                Permission.SYSTEM_MONITOR, Permission.SYSTEM_AUDIT,
                Permission.CUSTOMER_DATA_READ, Permission.CUSTOMER_DATA_WRITE
            ],
            UserRole.COMPLIANCE_MANAGER: [
                Permission.VELOCITY_READ, Permission.VELOCITY_WRITE,
                Permission.AGENTS_READ, Permission.AGENTS_CREATE, Permission.AGENTS_UPDATE,
                Permission.EVIDENCE_READ, Permission.EVIDENCE_VALIDATE,
                Permission.CUSTOMER_DATA_READ, Permission.CUSTOMER_DATA_WRITE
            ],
            UserRole.SECURITY_ARCHITECT: [
                Permission.VELOCITY_READ,
                Permission.AGENTS_READ, Permission.AGENTS_CREATE, Permission.AGENTS_UPDATE,
                Permission.EVIDENCE_READ,
                Permission.CUSTOMER_DATA_READ
            ],
            UserRole.EXECUTIVE: [
                Permission.VELOCITY_READ,
                Permission.AGENTS_READ,
                Permission.EVIDENCE_READ,
                Permission.SYSTEM_MONITOR,
                Permission.CUSTOMER_DATA_READ
            ],
            UserRole.AUDITOR: [
                Permission.VELOCITY_READ,
                Permission.AGENTS_READ,
                Permission.EVIDENCE_READ,
                Permission.SYSTEM_AUDIT,
                Permission.CUSTOMER_DATA_READ
            ],
            UserRole.USER: [
                Permission.VELOCITY_READ,
                Permission.AGENTS_READ,
                Permission.EVIDENCE_READ,
                Permission.CUSTOMER_DATA_READ
            ]
        }
    
    async def register_user(self, email: str, password: str, name: str, 
                          customer_id: str, role: UserRole) -> User:
        """Register a new user with password validation and MFA setup"""
        
        # Validate password strength
        if not self._validate_password_strength(password):
            raise ValueError("Password does not meet security requirements")
        
        # Check if user already exists
        existing_user = await self._get_user_by_email(email)
        if existing_user:
            await self._log_security_event(
                "user_registration_failed",
                None, customer_id, None, None,
                {"reason": "Email already exists", "email": email}
            )
            raise ValueError("User with this email already exists")
        
        # Hash password
        password_hash = await self._hash_password(password)
        
        # Generate MFA secret
        mfa_secret = pyotp.random_base32() if self.require_mfa else None
        
        # Create user
        user_id = self._generate_secure_id()
        user = User(
            id=user_id,
            email=email,
            name=name,
            customer_id=customer_id,
            role=role,
            permissions=self.role_permissions.get(role, []),
            mfa_enabled=self.require_mfa,
            mfa_secret=mfa_secret,
            created_at=datetime.utcnow()
        )
        
        # Store user data (encrypted)
        await self._store_user(user, password_hash)
        
        await self._log_security_event(
            "user_registered",
            user_id, customer_id, None, None,
            {"email": email, "role": role.value}
        )
        
        logger.info("User registered successfully", user_id=user_id, email=email)
        return user
    
    async def authenticate(self, email: str, password: str, mfa_code: Optional[str],
                         ip_address: str, user_agent: str) -> Tuple[User, str]:
        """Authenticate user with password and optional MFA"""
        
        user = await self._get_user_by_email(email)
        if not user:
            await self._log_security_event(
                "login_failed",
                None, None, ip_address, user_agent,
                {"reason": "User not found", "email": email},
                severity="MEDIUM"
            )
            raise ValueError("Invalid credentials")
        
        # Check if account is locked
        if user.locked_until and user.locked_until > datetime.utcnow():
            await self._log_security_event(
                "login_failed",
                user.id, user.customer_id, ip_address, user_agent,
                {"reason": "Account locked", "locked_until": user.locked_until.isoformat()},
                severity="HIGH"
            )
            raise ValueError("Account is locked due to too many failed attempts")
        
        # Verify password
        stored_hash = await self._get_password_hash(user.id)
        if not await self._verify_password(password, stored_hash):
            await self._handle_failed_login(user, ip_address, user_agent)
            raise ValueError("Invalid credentials")
        
        # Verify MFA if enabled
        if user.mfa_enabled:
            if not mfa_code:
                raise ValueError("MFA code required")
            
            if not self._verify_mfa_code(user.mfa_secret, mfa_code):
                await self._handle_failed_login(user, ip_address, user_agent)
                raise ValueError("Invalid MFA code")
        
        # Reset failed attempts on successful login
        user.failed_login_attempts = 0
        user.locked_until = None
        user.last_login = datetime.utcnow()
        await self._store_user(user)
        
        # Create session
        session_token = await self._create_session(user, ip_address, user_agent)
        
        await self._log_security_event(
            "login_successful",
            user.id, user.customer_id, ip_address, user_agent,
            {"email": email, "mfa_used": user.mfa_enabled}
        )
        
        logger.info("User authenticated successfully", user_id=user.id, email=email)
        return user, session_token
    
    async def validate_session(self, session_token: str) -> Optional[Session]:
        """Validate session token and return session data"""
        
        try:
            # Decode JWT token
            payload = jwt.decode(session_token, self.secret_key, algorithms=['HS256'])
            session_id = payload.get('session_id')
            
            if not session_id:
                return None
            
            # Get session from Redis
            session_data = await self.redis.get(f"session:{session_id}")
            if not session_data:
                return None
            
            session = Session(**eval(session_data.decode()))
            
            # Check if session is expired
            if session.expires_at < datetime.utcnow():
                await self._revoke_session(session_id)
                return None
            
            return session
            
        except jwt.InvalidTokenError:
            return None
    
    async def check_permission(self, session_token: str, required_permission: Permission,
                             resource_id: Optional[str] = None) -> bool:
        """Check if user has required permission for resource"""
        
        session = await self.validate_session(session_token)
        if not session:
            return False
        
        # Check if user has the required permission
        if required_permission not in session.permissions:
            await self._log_security_event(
                "permission_denied",
                None, session.customer_id, None, None,
                {
                    "required_permission": required_permission.value,
                    "resource_id": resource_id,
                    "user_permissions": [p.value for p in session.permissions]
                },
                severity="MEDIUM"
            )
            return False
        
        # Check customer data isolation
        if resource_id and resource_id.startswith(('customer-', 'agent-', 'evidence-')):
            resource_customer_id = self._extract_customer_id_from_resource(resource_id)
            if resource_customer_id and resource_customer_id != session.customer_id:
                await self._log_security_event(
                    "data_isolation_violation",
                    None, session.customer_id, None, None,
                    {
                        "attempted_resource": resource_id,
                        "resource_customer_id": resource_customer_id,
                        "user_customer_id": session.customer_id
                    },
                    severity="HIGH"
                )
                return False
        
        return True
    
    async def revoke_session(self, session_token: str) -> bool:
        """Revoke a user session"""
        
        session = await self.validate_session(session_token)
        if not session:
            return False
        
        await self._revoke_session(session.session_id)
        
        await self._log_security_event(
            "session_revoked",
            None, session.customer_id, None, None,
            {"session_id": session.session_id}
        )
        
        return True
    
    async def change_password(self, user_id: str, old_password: str, 
                            new_password: str) -> bool:
        """Change user password with validation"""
        
        user = await self._get_user_by_id(user_id)
        if not user:
            return False
        
        # Verify old password
        stored_hash = await self._get_password_hash(user_id)
        if not await self._verify_password(old_password, stored_hash):
            await self._log_security_event(
                "password_change_failed",
                user_id, user.customer_id, None, None,
                {"reason": "Invalid old password"}
            )
            return False
        
        # Validate new password
        if not self._validate_password_strength(new_password):
            return False
        
        # Hash and store new password
        new_hash = await self._hash_password(new_password)
        await self._store_password_hash(user_id, new_hash)
        
        await self._log_security_event(
            "password_changed",
            user_id, user.customer_id, None, None,
            {"email": user.email}
        )
        
        logger.info("Password changed successfully", user_id=user_id)
        return True
    
    async def setup_mfa(self, user_id: str) -> str:
        """Setup MFA for user and return QR code URL"""
        
        user = await self._get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        # Generate new MFA secret
        mfa_secret = pyotp.random_base32()
        
        # Update user
        user.mfa_secret = mfa_secret
        user.mfa_enabled = True
        await self._store_user(user)
        
        # Generate QR code URL
        totp = pyotp.TOTP(mfa_secret)
        qr_url = totp.provisioning_uri(
            name=user.email,
            issuer_name="ERIP Velocity"
        )
        
        await self._log_security_event(
            "mfa_setup",
            user_id, user.customer_id, None, None,
            {"email": user.email}
        )
        
        return qr_url
    
    # Private helper methods
    
    def _validate_password_strength(self, password: str) -> bool:
        """Validate password meets security requirements"""
        
        if len(password) < self.password_min_length:
            return False
        
        # Check for character diversity
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        has_special = any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password)
        
        return has_upper and has_lower and has_digit and has_special
    
    async def _hash_password(self, password: str) -> str:
        """Hash password using bcrypt with salt"""
        
        salt = bcrypt.gensalt(rounds=12)
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    async def _verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def _verify_mfa_code(self, secret: str, code: str) -> bool:
        """Verify TOTP MFA code"""
        
        totp = pyotp.TOTP(secret)
        return totp.verify(code, valid_window=1)  # Allow 30-second window
    
    async def _create_session(self, user: User, ip_address: str, 
                            user_agent: str) -> str:
        """Create new user session"""
        
        session_id = self._generate_secure_id()
        expires_at = datetime.utcnow() + self.session_duration
        
        session = Session(
            session_id=session_id,
            user_id=user.id,
            customer_id=user.customer_id,
            permissions=user.permissions,
            created_at=datetime.utcnow(),
            expires_at=expires_at,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        # Store session in Redis
        await self.redis.setex(
            f"session:{session_id}",
            int(self.session_duration.total_seconds()),
            str(asdict(session))
        )
        
        # Create JWT token
        token_payload = {
            'session_id': session_id,
            'user_id': user.id,
            'customer_id': user.customer_id,
            'iat': datetime.utcnow(),
            'exp': expires_at
        }
        
        return jwt.encode(token_payload, self.secret_key, algorithm='HS256')
    
    async def _revoke_session(self, session_id: str) -> None:
        """Revoke session from Redis"""
        
        await self.redis.delete(f"session:{session_id}")
    
    async def _handle_failed_login(self, user: User, ip_address: str, 
                                 user_agent: str) -> None:
        """Handle failed login attempt"""
        
        user.failed_login_attempts += 1
        
        if user.failed_login_attempts >= self.max_failed_attempts:
            user.locked_until = datetime.utcnow() + self.lockout_duration
            
            await self._log_security_event(
                "account_locked",
                user.id, user.customer_id, ip_address, user_agent,
                {
                    "failed_attempts": user.failed_login_attempts,
                    "locked_until": user.locked_until.isoformat()
                },
                severity="HIGH"
            )
        else:
            await self._log_security_event(
                "login_failed",
                user.id, user.customer_id, ip_address, user_agent,
                {
                    "reason": "Invalid credentials",
                    "failed_attempts": user.failed_login_attempts
                },
                severity="MEDIUM"
            )
        
        await self._store_user(user)
    
    def _generate_secure_id(self) -> str:
        """Generate cryptographically secure random ID"""
        
        return secrets.token_urlsafe(32)
    
    def _extract_customer_id_from_resource(self, resource_id: str) -> Optional[str]:
        """Extract customer ID from resource identifier"""
        
        # Example: "customer-123-agent-456" -> "customer-123"
        if resource_id.startswith('customer-'):
            parts = resource_id.split('-')
            if len(parts) >= 2:
                return f"{parts[0]}-{parts[1]}"
        
        return None
    
    async def _store_user(self, user: User, password_hash: Optional[str] = None) -> None:
        """Store user data in encrypted format"""
        
        user_data = asdict(user)
        encrypted_data = self.fernet.encrypt(str(user_data).encode())
        
        await self.redis.set(f"user:{user.id}", encrypted_data)
        await self.redis.set(f"user_email:{user.email}", user.id)
        
        if password_hash:
            await self._store_password_hash(user.id, password_hash)
    
    async def _store_password_hash(self, user_id: str, password_hash: str) -> None:
        """Store password hash separately from user data"""
        
        encrypted_hash = self.fernet.encrypt(password_hash.encode())
        await self.redis.set(f"password:{user_id}", encrypted_hash)
    
    async def _get_password_hash(self, user_id: str) -> str:
        """Retrieve password hash for user"""
        
        encrypted_hash = await self.redis.get(f"password:{user_id}")
        if not encrypted_hash:
            raise ValueError("Password hash not found")
        
        return self.fernet.decrypt(encrypted_hash).decode()
    
    async def _get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email address"""
        
        user_id = await self.redis.get(f"user_email:{email}")
        if not user_id:
            return None
        
        return await self._get_user_by_id(user_id.decode())
    
    async def _get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        
        encrypted_data = await self.redis.get(f"user:{user_id}")
        if not encrypted_data:
            return None
        
        user_data = eval(self.fernet.decrypt(encrypted_data).decode())
        return User(**user_data)
    
    async def _log_security_event(self, event_type: str, user_id: Optional[str],
                                customer_id: Optional[str], ip_address: Optional[str],
                                user_agent: Optional[str], details: Dict,
                                severity: str = "INFO") -> None:
        """Log security event for audit trail"""
        
        event = SecurityEvent(
            event_id=self._generate_secure_id(),
            event_type=event_type,
            user_id=user_id,
            customer_id=customer_id,
            ip_address=ip_address or "unknown",
            user_agent=user_agent or "unknown",
            timestamp=datetime.utcnow(),
            details=details,
            severity=severity
        )
        
        # Store in Redis with TTL for audit retention
        await self.redis.setex(
            f"security_event:{event.event_id}",
            86400 * 90,  # 90 days retention
            str(asdict(event))
        )
        
        # Log structured event
        logger.info(
            f"Security event: {event_type}",
            event_id=event.event_id,
            user_id=user_id,
            customer_id=customer_id,
            severity=severity,
            **details
        )

# Global auth service instance
auth_service: Optional[VelocityAuthService] = None

async def get_auth_service() -> VelocityAuthService:
    """Get the global auth service instance"""
    global auth_service
    
    if auth_service is None:
        import redis.asyncio as redis
        redis_client = await redis.from_url('redis://localhost:6379/1')
        secret_key = os.getenv('VELOCITY_SECRET_KEY', secrets.token_urlsafe(64))
        
        auth_service = VelocityAuthService(redis_client, secret_key)
    
    return auth_service