"""
Behavioral Analytics and Threat Detection
User behavior analysis for security monitoring
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from enum import Enum
from pydantic import BaseModel
import structlog

logger = structlog.get_logger()

class RiskLevel(str, Enum):
    """Risk assessment levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class UserBehavior(BaseModel):
    """User behavior tracking data"""
    user_id: str
    session_id: str
    ip_address: str
    user_agent: str
    login_time: datetime
    location: Optional[Dict[str, str]] = None
    device_fingerprint: Optional[str] = None

class RiskScore(BaseModel):
    """Risk assessment result"""
    user_id: str
    session_id: str
    risk_level: RiskLevel
    score: float  # 0.0 to 1.0
    factors: List[str]
    recommendations: List[str]

class ThreatDetector:
    """Behavioral threat detection engine"""
    
    def __init__(self):
        self.user_sessions: Dict[str, List[UserBehavior]] = {}
    
    async def analyze_login(self, behavior: UserBehavior) -> RiskScore:
        """Analyze login behavior for threats"""
        risk_factors = []
        score = 0.0
        
        # Store behavior data
        if behavior.user_id not in self.user_sessions:
            self.user_sessions[behavior.user_id] = []
        self.user_sessions[behavior.user_id].append(behavior)
        
        # Analyze patterns (placeholder logic)
        recent_sessions = self._get_recent_sessions(behavior.user_id, hours=24)
        
        # Check for unusual IP addresses
        if self._is_unusual_ip(behavior, recent_sessions):
            risk_factors.append("Unusual IP address")
            score += 0.3
        
        # Check for unusual times
        if self._is_unusual_time(behavior, recent_sessions):
            risk_factors.append("Unusual login time")
            score += 0.2
        
        # Determine risk level
        if score >= 0.7:
            risk_level = RiskLevel.CRITICAL
        elif score >= 0.5:
            risk_level = RiskLevel.HIGH
        elif score >= 0.3:
            risk_level = RiskLevel.MEDIUM
        else:
            risk_level = RiskLevel.LOW
        
        return RiskScore(
            user_id=behavior.user_id,
            session_id=behavior.session_id,
            risk_level=risk_level,
            score=min(score, 1.0),
            factors=risk_factors,
            recommendations=self._get_recommendations(risk_level)
        )
    
    def _get_recent_sessions(self, user_id: str, hours: int) -> List[UserBehavior]:
        """Get recent user sessions"""
        cutoff = datetime.utcnow() - timedelta(hours=hours)
        sessions = self.user_sessions.get(user_id, [])
        return [s for s in sessions if s.login_time >= cutoff]
    
    def _is_unusual_ip(self, current: UserBehavior, recent: List[UserBehavior]) -> bool:
        """Check if IP address is unusual"""
        if not recent:
            return False
        recent_ips = {s.ip_address for s in recent}
        return current.ip_address not in recent_ips
    
    def _is_unusual_time(self, current: UserBehavior, recent: List[UserBehavior]) -> bool:
        """Check if login time is unusual"""
        # Placeholder: consider hours outside 9-17 as unusual
        hour = current.login_time.hour
        return hour < 9 or hour > 17
    
    def _get_recommendations(self, risk_level: RiskLevel) -> List[str]:
        """Get security recommendations based on risk level"""
        recommendations = {
            RiskLevel.LOW: ["Continue monitoring"],
            RiskLevel.MEDIUM: ["Consider additional verification", "Monitor session closely"],
            RiskLevel.HIGH: ["Require MFA verification", "Limit session duration"],
            RiskLevel.CRITICAL: ["Block session", "Require admin approval", "Force password reset"]
        }
        return recommendations.get(risk_level, [])

class BehavioralAnalytics:
    """Main behavioral analytics system"""
    
    def __init__(self):
        self.threat_detector = ThreatDetector()
    
    async def analyze_user_session(
        self, 
        user_id: str,
        ip_address: str,
        user_agent: str,
        session_id: str
    ) -> RiskScore:
        """Analyze user session for behavioral threats"""
        behavior = UserBehavior(
            user_id=user_id,
            session_id=session_id,
            ip_address=ip_address,
            user_agent=user_agent,
            login_time=datetime.utcnow()
        )
        
        return await self.threat_detector.analyze_login(behavior)

# Convenience function
async def analyze_login_pattern(
    user_id: str,
    ip_address: str,
    user_agent: str,
    session_id: str
) -> RiskScore:
    """Analyze login pattern for threats"""
    analytics = BehavioralAnalytics()
    return await analytics.analyze_user_session(user_id, ip_address, user_agent, session_id)