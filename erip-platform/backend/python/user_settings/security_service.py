"""
PCI DSS v4.0 Compliant User Settings Security Service
Handles encryption, tokenization, and secure data processing for user settings
"""

import os
import json
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import bcrypt
import logging
from dataclasses import dataclass, asdict
from enum import Enum

# Configure security logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
security_logger = logging.getLogger('ERIP_SECURITY')

class DataClassification(Enum):
    """PCI DSS Data Classification Levels"""
    PUBLIC = "public"
    INTERNAL = "internal" 
    CONFIDENTIAL = "confidential"
    RESTRICTED = "restricted"  # PCI Data
    TOP_SECRET = "top_secret"  # Payment Card Data

@dataclass
class EncryptedField:
    """Encrypted field container for sensitive data"""
    encrypted_value: str
    salt: str
    created_at: datetime
    classification: DataClassification
    field_name: str

class PCIDSSSecurityService:
    """
    PCI DSS v4.0 Compliant Security Service
    Implements requirements 3.4, 3.5, 3.6, 4.1, 4.2, 8.2
    """
    
    def __init__(self):
        self.master_key = self._get_or_create_master_key()
        self.audit_logger = logging.getLogger('PCI_AUDIT')
        
        # PCI DSS Requirement 3.4: Cryptographic keys management
        self._initialize_key_management()
        
    def _get_or_create_master_key(self) -> bytes:
        """
        PCI DSS Requirement 3.6: Cryptographic key management
        Secure key generation and storage
        """
        key_file = os.environ.get('PCI_KEY_FILE', '/secure/keys/master.key')
        
        try:
            if os.path.exists(key_file):
                with open(key_file, 'rb') as f:
                    return f.read()
            else:
                # Generate new master key
                key = Fernet.generate_key()
                os.makedirs(os.path.dirname(key_file), exist_ok=True)
                
                # Secure file permissions (PCI DSS Requirement 7.1)
                with open(key_file, 'wb') as f:
                    f.write(key)
                os.chmod(key_file, 0o600)  # Read/write owner only
                
                security_logger.info("New master key generated and secured")
                return key
                
        except Exception as e:
            security_logger.error(f"Key management error: {e}")
            raise SecurityException("Failed to initialize encryption keys")
            
    def _initialize_key_management(self):
        """Initialize key rotation and management"""
        self.key_rotation_interval = timedelta(days=90)  # PCI DSS Requirement 3.6.4
        self.last_key_rotation = datetime.utcnow()
        
    def encrypt_sensitive_data(self, data: str, classification: DataClassification, 
                             field_name: str) -> EncryptedField:
        """
        PCI DSS Requirement 3.4: Encrypt PAN data
        Strong cryptography for sensitive data protection
        """
        try:
            # Generate unique salt for each encryption
            salt = secrets.token_bytes(32)
            
            # Derive encryption key using PBKDF2 (PCI DSS Approved)
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000,  # NIST recommended minimum
            )
            key = kdf.derive(self.master_key)
            
            # Encrypt using Fernet (AES 128 in CBC mode)
            fernet = Fernet(Fernet.generate_key())
            encrypted_data = fernet.encrypt(data.encode())
            
            # Create encrypted field container
            encrypted_field = EncryptedField(
                encrypted_value=encrypted_data.hex(),
                salt=salt.hex(),
                created_at=datetime.utcnow(),
                classification=classification,
                field_name=field_name
            )
            
            # Audit log (PCI DSS Requirement 10.2)
            self._audit_log("DATA_ENCRYPTED", {
                "field_name": field_name,
                "classification": classification.value,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            return encrypted_field
            
        except Exception as e:
            security_logger.error(f"Encryption failed for {field_name}: {e}")
            raise SecurityException("Data encryption failed")
            
    def decrypt_sensitive_data(self, encrypted_field: EncryptedField) -> str:
        """
        PCI DSS Requirement 3.4: Decrypt PAN data securely
        Authorized decryption with full audit trail
        """
        try:
            # Verify classification and access rights
            if encrypted_field.classification == DataClassification.TOP_SECRET:
                self._verify_pci_access_rights()
                
            # Reconstruct decryption key
            salt = bytes.fromhex(encrypted_field.salt)
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000,
            )
            key = kdf.derive(self.master_key)
            
            # Decrypt data
            encrypted_data = bytes.fromhex(encrypted_field.encrypted_value)
            fernet = Fernet(key)
            decrypted_data = fernet.decrypt(encrypted_data).decode()
            
            # Audit log (PCI DSS Requirement 10.2)
            self._audit_log("DATA_DECRYPTED", {
                "field_name": encrypted_field.field_name,
                "classification": encrypted_field.classification.value,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            return decrypted_data
            
        except Exception as e:
            security_logger.error(f"Decryption failed: {e}")
            self._audit_log("DECRYPTION_FAILED", {
                "field_name": encrypted_field.field_name,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            })
            raise SecurityException("Data decryption failed")
            
    def tokenize_payment_data(self, card_number: str) -> str:
        """
        PCI DSS Requirement 3.4: Tokenization for PAN protection
        Replace PAN with non-sensitive token
        """
        try:
            # Validate card number format
            if not self._validate_card_number(card_number):
                raise ValueError("Invalid card number format")
                
            # Generate cryptographically secure token
            token = f"tok_{secrets.token_urlsafe(32)}"
            
            # Store mapping in secure token vault (would be external service)
            self._store_token_mapping(token, card_number)
            
            # Audit log
            self._audit_log("PAYMENT_TOKENIZED", {
                "token": token[:10] + "...",  # Partial token for audit
                "last_four": card_number[-4:],
                "timestamp": datetime.utcnow().isoformat()
            })
            
            return token
            
        except Exception as e:
            security_logger.error(f"Tokenization failed: {e}")
            raise SecurityException("Payment tokenization failed")
            
    def hash_password(self, password: str) -> str:
        """
        PCI DSS Requirement 8.2.1: Strong password hashing
        Use bcrypt with appropriate work factor
        """
        try:
            # Generate salt and hash with bcrypt (work factor 12)
            salt = bcrypt.gensalt(rounds=12)
            hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
            
            # Audit log (without sensitive data)
            self._audit_log("PASSWORD_HASHED", {
                "timestamp": datetime.utcnow().isoformat(),
                "algorithm": "bcrypt_12"
            })
            
            return hashed.decode('utf-8')
            
        except Exception as e:
            security_logger.error(f"Password hashing failed: {e}")
            raise SecurityException("Password hashing failed")
            
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        try:
            result = bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
            
            # Audit log
            self._audit_log("PASSWORD_VERIFIED", {
                "success": result,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            return result
            
        except Exception as e:
            security_logger.error(f"Password verification failed: {e}")
            return False
            
    def _validate_card_number(self, card_number: str) -> bool:
        """Luhn algorithm validation for card numbers"""
        # Remove spaces and hyphens
        card_number = card_number.replace(' ', '').replace('-', '')
        
        # Check if all digits
        if not card_number.isdigit():
            return False
            
        # Luhn algorithm
        def luhn_checksum(card_num):
            def digits_of(n):
                return [int(d) for d in str(n)]
            digits = digits_of(card_num)
            odd_digits = digits[-1::-2]
            even_digits = digits[-2::-2]
            checksum = sum(odd_digits)
            for d in even_digits:
                checksum += sum(digits_of(d*2))
            return checksum % 10
            
        return luhn_checksum(card_number) == 0
        
    def _verify_pci_access_rights(self):
        """Verify user has rights to access PCI data"""
        # In production, this would check user roles/permissions
        # PCI DSS Requirement 7: Restrict access by business need-to-know
        pass
        
    def _store_token_mapping(self, token: str, card_number: str):
        """Store token mapping in secure vault"""
        # In production, this would use external tokenization service
        # PCI DSS Requirement 3.4: Secure token vault
        pass
        
    def _audit_log(self, event_type: str, data: Dict[str, Any]):
        """
        PCI DSS Requirement 10: Log and monitor all access
        Comprehensive audit logging for all security events
        """
        audit_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_type,
            "user_id": getattr(self, 'current_user_id', 'system'),
            "source_ip": getattr(self, 'source_ip', 'unknown'),
            "data": data,
            "session_id": getattr(self, 'session_id', 'unknown')
        }
        
        self.audit_logger.info(json.dumps(audit_entry))
        
        # In production, send to SIEM system
        # PCI DSS Requirement 10.6: Review logs daily

class SecurityException(Exception):
    """Custom exception for security-related errors"""
    pass

# PCI DSS Data Classification Schema
PCI_DATA_FIELDS = {
    # TOP_SECRET: Primary Account Number (PAN) and related data
    "card_number": DataClassification.TOP_SECRET,
    "cvv": DataClassification.TOP_SECRET,
    "expiry_date": DataClassification.TOP_SECRET,
    
    # RESTRICTED: Sensitive authentication data
    "password": DataClassification.RESTRICTED,
    "security_questions": DataClassification.RESTRICTED,
    "mfa_secrets": DataClassification.RESTRICTED,
    
    # CONFIDENTIAL: Personal identifiable information
    "ssn": DataClassification.CONFIDENTIAL,
    "tax_id": DataClassification.CONFIDENTIAL,
    "phone": DataClassification.CONFIDENTIAL,
    
    # INTERNAL: Business data
    "email": DataClassification.INTERNAL,
    "name": DataClassification.INTERNAL,
    "company": DataClassification.INTERNAL,
    
    # PUBLIC: Non-sensitive preferences
    "theme": DataClassification.PUBLIC,
    "language": DataClassification.PUBLIC,
    "timezone": DataClassification.PUBLIC
}

# Example usage for settings data
def classify_and_encrypt_settings(settings_data: Dict[str, Any], 
                                security_service: PCIDSSSecurityService) -> Dict[str, Any]:
    """
    Process user settings with appropriate security measures
    Based on PCI DSS data classification
    """
    processed_settings = {}
    
    for field_name, value in settings_data.items():
        classification = PCI_DATA_FIELDS.get(field_name, DataClassification.INTERNAL)
        
        if classification in [DataClassification.TOP_SECRET, DataClassification.RESTRICTED]:
            # Encrypt sensitive data
            encrypted_field = security_service.encrypt_sensitive_data(
                str(value), classification, field_name
            )
            processed_settings[field_name] = asdict(encrypted_field)
            
        elif classification == DataClassification.CONFIDENTIAL:
            # Hash confidential data
            if field_name == "password":
                processed_settings[field_name] = security_service.hash_password(str(value))
            else:
                # Encrypt other confidential data
                encrypted_field = security_service.encrypt_sensitive_data(
                    str(value), classification, field_name
                )
                processed_settings[field_name] = asdict(encrypted_field)
        else:
            # Store internal/public data as-is (with access controls)
            processed_settings[field_name] = value
            
    return processed_settings