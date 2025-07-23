"""
Enhanced Authentication Architecture for ERIP
Enterprise-grade authentication with MFA, SSO, and behavioral analytics
"""

from .mfa import (
    TOTPManager,
    MFAChallenge,
    MFAMethod,
    MFAEnrollment,
    verify_totp,
    generate_totp_secret
)

from .sms_email import (
    SMSProvider,
    EmailProvider,
    NotificationManager,
    send_verification_code,
    verify_code
)

from .sso import (
    SSOProvider,
    AzureADProvider,
    OktaProvider,
    SAMLResponse,
    OIDCToken
)

from .behavioral import (
    BehavioralAnalytics,
    UserBehavior,
    ThreatDetector,
    RiskScore,
    analyze_login_pattern
)

from .policies import (
    ABACPolicyEngine,
    AccessPolicy,
    PolicyRule,
    AttributeCondition,
    evaluate_access
)

__all__ = [
    # MFA
    "TOTPManager",
    "MFAChallenge", 
    "MFAMethod",
    "MFAEnrollment",
    "verify_totp",
    "generate_totp_secret",
    
    # SMS/Email
    "SMSProvider",
    "EmailProvider", 
    "NotificationManager",
    "send_verification_code",
    "verify_code",
    
    # SSO
    "SSOProvider",
    "AzureADProvider",
    "OktaProvider", 
    "SAMLResponse",
    "OIDCToken",
    
    # Behavioral Analytics
    "BehavioralAnalytics",
    "UserBehavior",
    "ThreatDetector",
    "RiskScore", 
    "analyze_login_pattern",
    
    # ABAC Policies
    "ABACPolicyEngine",
    "AccessPolicy",
    "PolicyRule",
    "AttributeCondition",
    "evaluate_access"
]