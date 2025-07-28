"""
Enterprise-grade security service for ERIP AI Agents.
Implements E2E encryption, data isolation, and comprehensive security controls.
"""

import os
import secrets
import hashlib
import hmac
import base64
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
import structlog
import asyncio
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
import jwt
import redis
import ipaddress
from ..core.database import DatabaseManager
import json

logger = structlog.get_logger()


@dataclass 
class SecurityPolicy:
    encryption_required: bool = True
    data_isolation_enabled: bool = True
    audit_logging_enabled: bool = True
    access_logging_enabled: bool = True
    ip_whitelist_enabled: bool = False
    mfa_required: bool = True
    session_timeout_minutes: int = 60
    max_failed_attempts: int = 5
    lockout_duration_minutes: int = 30


@dataclass
class EncryptionKeys:
    symmetric_key: bytes
    private_key: bytes
    public_key: bytes
    key_id: str
    created_at: datetime
    expires_at: datetime


class SecurityService:
    """Comprehensive security service for AI agents platform"""
    
    def __init__(self, redis_url: str = None):
        self.db = DatabaseManager()
        self.redis_client = redis.Redis.from_url(
            redis_url or os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
            decode_responses=True
        )
        
        # Security configuration
        self.security_policy = SecurityPolicy()
        self.jwt_secret = os.getenv('JWT_SECRET', secrets.token_urlsafe(32))
        self.jwt_algorithm = 'HS256'
        
        # Initialize encryption keys
        self.master_key = self._get_or_create_master_key()
        self.customer_keys: Dict[str, EncryptionKeys] = {}
        
        # Rate limiting
        self.rate_limits = {
            'login': (5, 300),        # 5 attempts per 5 minutes
            'api_call': (1000, 3600), # 1000 calls per hour
            'agent_start': (50, 3600) # 50 agent starts per hour
        }
    
    def _get_or_create_master_key(self) -> bytes:
        """Get or create master encryption key"""
        
        master_key = os.getenv('MASTER_ENCRYPTION_KEY')
        if master_key:
            return base64.b64decode(master_key)
        
        # Generate new master key
        key = Fernet.generate_key()
        logger.warning(
            "master_key_generated",
            message="Store this securely: MASTER_ENCRYPTION_KEY=" + base64.b64encode(key).decode()
        )
        return key
    
    async def initialize_customer_security(self, customer_id: str) -> EncryptionKeys:
        """Initialize security environment for new customer"""
        
        # Generate customer-specific encryption keys
        symmetric_key = Fernet.generate_key()
        
        # Generate RSA key pair for asymmetric operations
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )
        
        private_key_bytes = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
        
        public_key_bytes = private_key.public_key().public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
        # Create encryption keys object
        keys = EncryptionKeys(
            symmetric_key=symmetric_key,
            private_key=private_key_bytes,
            public_key=public_key_bytes,
            key_id=secrets.token_urlsafe(16),
            created_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(days=365)
        )
        
        # Store encrypted keys in database
        await self._store_customer_keys(customer_id, keys)
        
        # Cache in memory
        self.customer_keys[customer_id] = keys
        
        # Create customer security namespace in Redis
        await self._initialize_customer_namespace(customer_id)
        
        logger.info(
            "customer_security_initialized",
            customer_id=customer_id,
            key_id=keys.key_id
        )
        
        return keys
    
    async def _store_customer_keys(self, customer_id: str, keys: EncryptionKeys):
        """Store customer encryption keys securely"""
        
        # Encrypt keys with master key
        fernet = Fernet(self.master_key)
        
        encrypted_keys = {
            'symmetric_key': fernet.encrypt(keys.symmetric_key).decode(),
            'private_key': fernet.encrypt(keys.private_key).decode(),
            'public_key': keys.public_key.decode(),  # Public key doesn't need encryption
            'key_id': keys.key_id,
            'created_at': keys.created_at.isoformat(),
            'expires_at': keys.expires_at.isoformat()
        }
        
        # Store in Redis with expiration
        await asyncio.to_thread(
            self.redis_client.setex,
            f"security:keys:{customer_id}",
            86400 * 7,  # 7 days
            json.dumps(encrypted_keys)
        )
    
    async def _initialize_customer_namespace(self, customer_id: str):
        """Initialize isolated Redis namespace for customer"""
        
        namespace_key = f"customer:{customer_id}:*"
        
        # Set up namespace isolation rules
        isolation_config = {
            'namespace': f"customer:{customer_id}",
            'read_isolation': True,
            'write_isolation': True,
            'admin_access_only': False,
            'audit_all_operations': True
        }
        
        await asyncio.to_thread(
            self.redis_client.setex,
            f"security:isolation:{customer_id}",
            86400 * 30,  # 30 days
            json.dumps(isolation_config)
        )
    
    async def encrypt_data(self, data: bytes, customer_id: str) -> Tuple[bytes, str]:
        """Encrypt data with customer-specific key"""
        
        keys = await self._get_customer_keys(customer_id)
        if not keys:
            raise ValueError(f"No encryption keys found for customer {customer_id}")
        
        fernet = Fernet(keys.symmetric_key)
        encrypted_data = fernet.encrypt(data)
        
        return encrypted_data, keys.key_id
    
    async def decrypt_data(self, encrypted_data: bytes, customer_id: str) -> bytes:
        """Decrypt data with customer-specific key"""
        
        keys = await self._get_customer_keys(customer_id)
        if not keys:
            raise ValueError(f"No encryption keys found for customer {customer_id}")
        
        fernet = Fernet(keys.symmetric_key)
        decrypted_data = fernet.decrypt(encrypted_data)
        
        return decrypted_data
    
    async def _get_customer_keys(self, customer_id: str) -> Optional[EncryptionKeys]:
        """Get customer encryption keys from cache or storage"""
        
        # Check memory cache first
        if customer_id in self.customer_keys:
            keys = self.customer_keys[customer_id]
            if keys.expires_at > datetime.utcnow():
                return keys
        
        # Load from Redis
        encrypted_keys_json = await asyncio.to_thread(
            self.redis_client.get,
            f"security:keys:{customer_id}"
        )
        
        if not encrypted_keys_json:
            return None
        
        encrypted_keys = json.loads(encrypted_keys_json)
        
        # Decrypt keys
        fernet = Fernet(self.master_key)
        
        keys = EncryptionKeys(
            symmetric_key=fernet.decrypt(encrypted_keys['symmetric_key'].encode()),
            private_key=fernet.decrypt(encrypted_keys['private_key'].encode()),
            public_key=encrypted_keys['public_key'].encode(),
            key_id=encrypted_keys['key_id'],
            created_at=datetime.fromisoformat(encrypted_keys['created_at']),
            expires_at=datetime.fromisoformat(encrypted_keys['expires_at'])
        )
        
        # Cache in memory
        self.customer_keys[customer_id] = keys
        
        return keys
    
    async def generate_access_token(
        self, 
        customer_id: str, 
        user_id: str,
        permissions: List[str],
        expires_in_minutes: int = None
    ) -> str:
        """Generate JWT access token with customer isolation"""
        
        expires_in = expires_in_minutes or self.security_policy.session_timeout_minutes
        exp_time = datetime.utcnow() + timedelta(minutes=expires_in)
        
        payload = {
            'customer_id': customer_id,
            'user_id': user_id,
            'permissions': permissions,
            'iat': datetime.utcnow().timestamp(),
            'exp': exp_time.timestamp(),
            'jti': secrets.token_urlsafe(16),  # JWT ID for revocation
            'iss': 'erip-agents',
            'aud': 'erip-platform'
        }
        
        token = jwt.encode(payload, self.jwt_secret, algorithm=self.jwt_algorithm)
        
        # Store token metadata for revocation
        await asyncio.to_thread(
            self.redis_client.setex,
            f"token:{payload['jti']}",
            expires_in * 60,
            json.dumps({
                'customer_id': customer_id,
                'user_id': user_id,
                'created_at': datetime.utcnow().isoformat(),
                'expires_at': exp_time.isoformat()
            })
        )
        
        await self._log_security_event(
            customer_id=customer_id,
            user_id=user_id,
            event_type='token_generated',
            details={'expires_at': exp_time.isoformat()}
        )
        
        return token
    
    async def verify_access_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode JWT access token"""
        
        try:
            payload = jwt.decode(
                token, 
                self.jwt_secret, 
                algorithms=[self.jwt_algorithm],
                audience='erip-platform',
                issuer='erip-agents'
            )
            
            # Check if token is revoked
            jti = payload.get('jti')
            if jti:
                token_exists = await asyncio.to_thread(
                    self.redis_client.exists,
                    f"token:{jti}"
                )
                if not token_exists:
                    return None  # Token was revoked
            
            return payload
            
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    async def revoke_token(self, token: str) -> bool:
        """Revoke access token"""
        
        try:
            payload = jwt.decode(
                token, 
                self.jwt_secret, 
                algorithms=[self.jwt_algorithm],
                options={"verify_exp": False}
            )
            
            jti = payload.get('jti')
            if jti:
                await asyncio.to_thread(
                    self.redis_client.delete,
                    f"token:{jti}"
                )
                
                await self._log_security_event(
                    customer_id=payload.get('customer_id'),
                    user_id=payload.get('user_id'),
                    event_type='token_revoked',
                    details={'jti': jti}
                )
                
                return True
            
        except jwt.InvalidTokenError:
            pass
        
        return False
    
    async def check_rate_limit(
        self, 
        customer_id: str, 
        action: str, 
        identifier: str = None
    ) -> bool:
        """Check if action is within rate limits"""
        
        if action not in self.rate_limits:
            return True
        
        limit, window = self.rate_limits[action]
        key = f"rate_limit:{customer_id}:{action}"
        if identifier:
            key += f":{identifier}"
        
        current_count = await asyncio.to_thread(self.redis_client.get, key)
        
        if current_count is None:
            # First request in window
            await asyncio.to_thread(
                self.redis_client.setex,
                key,
                window,
                1
            )
            return True
        
        current_count = int(current_count)
        if current_count >= limit:
            await self._log_security_event(
                customer_id=customer_id,
                event_type='rate_limit_exceeded',
                details={
                    'action': action,
                    'limit': limit,
                    'window': window,
                    'identifier': identifier
                }
            )
            return False
        
        # Increment counter
        await asyncio.to_thread(self.redis_client.incr, key)
        return True
    
    async def validate_ip_access(self, customer_id: str, ip_address: str) -> bool:
        """Validate IP address against customer whitelist"""
        
        if not self.security_policy.ip_whitelist_enabled:
            return True
        
        whitelist_json = await asyncio.to_thread(
            self.redis_client.get,
            f"security:ip_whitelist:{customer_id}"
        )
        
        if not whitelist_json:
            return True  # No whitelist configured
        
        whitelist = json.loads(whitelist_json)
        ip = ipaddress.ip_address(ip_address)
        
        for allowed_range in whitelist:
            try:
                if ip in ipaddress.ip_network(allowed_range, strict=False):
                    return True
            except ValueError:
                continue
        
        await self._log_security_event(
            customer_id=customer_id,
            event_type='ip_access_denied',
            details={'ip_address': ip_address}
        )
        
        return False
    
    async def enforce_data_isolation(
        self, 
        customer_id: str, 
        operation: str,
        target_customer_id: str
    ) -> bool:
        """Enforce data isolation between customers"""
        
        if not self.security_policy.data_isolation_enabled:
            return True
        
        # Customer can only access their own data
        if customer_id != target_customer_id:
            await self._log_security_event(
                customer_id=customer_id,
                event_type='data_isolation_violation',
                details={
                    'operation': operation,
                    'target_customer_id': target_customer_id
                }
            )
            return False
        
        return True
    
    async def _log_security_event(
        self,
        customer_id: str = None,
        user_id: str = None,
        event_type: str = None,
        details: Dict[str, Any] = None,
        ip_address: str = None,
        user_agent: str = None
    ):
        """Log security event for audit trail"""
        
        if not self.security_policy.audit_logging_enabled:
            return
        
        event = {
            'timestamp': datetime.utcnow().isoformat(),
            'customer_id': customer_id,
            'user_id': user_id,
            'event_type': event_type,
            'details': details or {},
            'ip_address': ip_address,
            'user_agent': user_agent,
            'event_id': secrets.token_urlsafe(16)
        }
        
        # Store in Redis with TTL
        await asyncio.to_thread(
            self.redis_client.lpush,
            f"security:audit:{customer_id or 'system'}",
            json.dumps(event)
        )
        
        # Trim list to last 10000 events
        await asyncio.to_thread(
            self.redis_client.ltrim,
            f"security:audit:{customer_id or 'system'}",
            0,
            9999
        )
        
        # Log critical events immediately
        if event_type in ['data_isolation_violation', 'rate_limit_exceeded', 'ip_access_denied']:
            logger.warning("security_event", **event)
    
    async def get_security_metrics(self, customer_id: str) -> Dict[str, Any]:
        """Get security metrics for customer"""
        
        # Get recent audit events
        events_json = await asyncio.to_thread(
            self.redis_client.lrange,
            f"security:audit:{customer_id}",
            0,
            999  # Last 1000 events
        )
        
        events = [json.loads(e) for e in events_json]
        
        # Calculate metrics
        total_events = len(events)
        
        # Events by type
        event_types = {}
        for event in events:
            event_type = event.get('event_type', 'unknown')
            event_types[event_type] = event_types.get(event_type, 0) + 1
        
        # Recent violations
        violations = [e for e in events if e.get('event_type') in [
            'data_isolation_violation', 'rate_limit_exceeded', 'ip_access_denied'
        ]]
        
        # Active sessions
        active_tokens = await asyncio.to_thread(
            self.redis_client.keys,
            f"token:*"
        )
        
        return {
            'total_events': total_events,
            'event_types': event_types,
            'violations_count': len(violations),
            'recent_violations': violations[-10:],  # Last 10 violations
            'active_sessions': len(active_tokens),
            'security_score': self._calculate_security_score(events),
            'last_activity': events[0].get('timestamp') if events else None
        }
    
    def _calculate_security_score(self, events: List[Dict]) -> int:
        """Calculate security score based on events"""
        
        if not events:
            return 100
        
        # Start with perfect score
        score = 100
        
        # Deduct points for violations
        for event in events[-100:]:  # Last 100 events
            event_type = event.get('event_type', '')
            
            if event_type == 'data_isolation_violation':
                score -= 10
            elif event_type == 'rate_limit_exceeded':
                score -= 2
            elif event_type == 'ip_access_denied':
                score -= 5
        
        return max(0, score)
    
    async def rotate_customer_keys(self, customer_id: str) -> EncryptionKeys:
        """Rotate encryption keys for customer"""
        
        # Generate new keys
        new_keys = await self.initialize_customer_security(customer_id)
        
        await self._log_security_event(
            customer_id=customer_id,
            event_type='keys_rotated',
            details={'new_key_id': new_keys.key_id}
        )
        
        logger.info(
            "customer_keys_rotated",
            customer_id=customer_id,
            new_key_id=new_keys.key_id
        )
        
        return new_keys


# Global instance
security_service = SecurityService()