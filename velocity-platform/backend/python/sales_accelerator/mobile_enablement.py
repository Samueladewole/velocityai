"""
ERIP Mobile Sales Enablement
Mobile-first compliance intelligence for sales teams
"""

from typing import Dict, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field
import structlog
from enum import Enum

logger = structlog.get_logger()

class MobileDeviceType(str, Enum):
    """Supported mobile device types"""
    IOS = "ios"
    ANDROID = "android"
    WEB_MOBILE = "web_mobile"

class NotificationPriority(str, Enum):
    """Mobile notification priorities"""
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"

class MobileComplianceCard(BaseModel):
    """Mobile-optimized compliance information card"""
    id: str
    title: str
    summary: str
    framework: str
    confidence_score: float
    key_points: List[str]
    action_required: bool = False
    urgent: bool = False
    created_at: datetime

class MobileCustomerContext(BaseModel):
    """Mobile customer context for quick reference"""
    customer_name: str
    industry: str
    key_compliance_needs: List[str]
    current_stage: str
    next_action: str
    contact_info: Dict[str, str]
    meeting_notes: List[str] = Field(default_factory=list)

class MobileDashboard(BaseModel):
    """Mobile sales dashboard optimized for small screens"""
    active_deals: int
    compliance_questions_today: int
    upcoming_meetings: List[Dict[str, str]]
    urgent_actions: List[str]
    recent_wins: List[Dict[str, str]]
    quick_stats: Dict[str, Any]

class VoiceQuery(BaseModel):
    """Voice-activated compliance query"""
    query_id: str
    transcript: str
    customer_context: Optional[str] = None
    urgency: str = "normal"
    response_format: str = "voice"  # voice, text, card

class MobileSalesEnablementEngine:
    """
    Mobile-optimized sales enablement engine
    Provides instant compliance intelligence optimized for mobile usage
    """
    
    def __init__(self):
        self.device_capabilities = self._initialize_device_capabilities()
        self.quick_responses = self._initialize_quick_responses()
        self.mobile_templates = self._initialize_mobile_templates()
    
    def _initialize_device_capabilities(self) -> Dict[MobileDeviceType, Dict[str, bool]]:
        """Initialize device-specific capabilities"""
        return {
            MobileDeviceType.IOS: {
                "voice_input": True,
                "push_notifications": True,
                "biometric_auth": True,
                "offline_cache": True,
                "camera_integration": True,
                "siri_shortcuts": True
            },
            MobileDeviceType.ANDROID: {
                "voice_input": True,
                "push_notifications": True,
                "biometric_auth": True,
                "offline_cache": True,
                "camera_integration": True,
                "google_assistant": True
            },
            MobileDeviceType.WEB_MOBILE: {
                "voice_input": True,
                "push_notifications": True,
                "biometric_auth": False,
                "offline_cache": True,
                "camera_integration": True,
                "pwa_features": True
            }
        }
    
    def _initialize_quick_responses(self) -> Dict[str, str]:
        """Initialize common quick response templates"""
        return {
            "gdpr_overview": "GDPR requires lawful basis for data processing, data subject rights, and privacy by design. ERIP automates all key requirements with 95% accuracy.",
            "sox_controls": "SOX requires internal financial controls and CEO/CFO certification. ERIP provides automated control testing and real-time monitoring.",
            "hipaa_phi": "HIPAA requires PHI protection through administrative, physical, and technical safeguards. ERIP automates all safeguard categories.",
            "implementation_time": "ERIP implementation typically takes 4-6 weeks vs 6-12 months for traditional solutions, with immediate ROI.",
            "roi_summary": "ERIP delivers 525% ROI through compliance automation, cost avoidance, and efficiency gains, with 4-month payback period."
        }
    
    def _initialize_mobile_templates(self) -> Dict[str, Any]:
        """Initialize mobile-optimized content templates"""
        return {
            "compliance_card": {
                "max_summary_length": 120,
                "max_key_points": 3,
                "priority_indicators": True
            },
            "customer_context": {
                "max_notes": 5,
                "key_info_only": True,
                "action_oriented": True
            },
            "quick_stats": {
                "visual_indicators": True,
                "trend_arrows": True,
                "color_coding": True
            }
        }
    
    async def get_mobile_dashboard(
        self, 
        user_id: str, 
        device_type: MobileDeviceType
    ) -> MobileDashboard:
        """Generate mobile-optimized dashboard for sales rep"""
        
        try:
            # Mock mobile dashboard data optimized for small screens
            dashboard = MobileDashboard(
                active_deals=12,
                compliance_questions_today=8,
                upcoming_meetings=[
                    {
                        "customer": "TechCorp",
                        "time": "2:00 PM",
                        "topic": "GDPR compliance demo",
                        "prep_note": "Focus on automated privacy impact assessments"
                    },
                    {
                        "customer": "HealthSystem",
                        "time": "4:30 PM", 
                        "topic": "HIPAA BAA discussion",
                        "prep_note": "Highlight Business Associate Agreement automation"
                    }
                ],
                urgent_actions=[
                    "Follow up with FinanceBank on SOX proposal",
                    "Send GDPR assessment to EuroTech",
                    "Prepare competitive battlecard for ServiceNow deal"
                ],
                recent_wins=[
                    {
                        "customer": "GlobalHealth",
                        "value": "€340K",
                        "key_factor": "HIPAA automation capabilities"
                    },
                    {
                        "customer": "FinTech Solutions", 
                        "value": "€125K",
                        "key_factor": "Real-time regulatory monitoring"
                    }
                ],
                quick_stats={
                    "win_rate": {"value": "68%", "trend": "up", "color": "green"},
                    "cycle_time": {"value": "45 days", "trend": "down", "color": "green"},
                    "pipeline": {"value": "€2.4M", "trend": "up", "color": "blue"},
                    "compliance_score": {"value": "92%", "trend": "stable", "color": "green"}
                }
            )
            
            logger.info("Mobile dashboard generated",
                       user_id=user_id,
                       device_type=device_type.value,
                       active_deals=dashboard.active_deals)
            
            return dashboard
            
        except Exception as e:
            logger.error("Failed to generate mobile dashboard",
                        user_id=user_id,
                        error=str(e))
            raise
    
    async def process_voice_query(
        self,
        voice_query: VoiceQuery,
        user_id: str
    ) -> Dict[str, Any]:
        """Process voice-activated compliance query"""
        
        try:
            # Analyze voice transcript for compliance keywords
            transcript_lower = voice_query.transcript.lower()
            
            # Quick response matching
            response_content = None
            confidence = 0.8
            
            if "gdpr" in transcript_lower:
                response_content = self.quick_responses["gdpr_overview"]
            elif "sox" in transcript_lower or "sarbanes" in transcript_lower:
                response_content = self.quick_responses["sox_controls"]
            elif "hipaa" in transcript_lower:
                response_content = self.quick_responses["hipaa_phi"]
            elif "implementation" in transcript_lower or "timeline" in transcript_lower:
                response_content = self.quick_responses["implementation_time"]
            elif "roi" in transcript_lower or "return" in transcript_lower:
                response_content = self.quick_responses["roi_summary"]
            else:
                # Fallback to general compliance response
                response_content = "I'll help you with that compliance question. Let me get the latest regulatory guidance for you."
                confidence = 0.6
            
            # Format response based on requested format
            if voice_query.response_format == "voice":
                # Optimize for voice response (shorter, more conversational)
                response_content = self._optimize_for_voice(response_content)
            elif voice_query.response_format == "card":
                # Format as mobile card
                return self._format_as_mobile_card(response_content, voice_query)
            
            response = {
                "query_id": voice_query.query_id,
                "response": response_content,
                "confidence": confidence,
                "response_format": voice_query.response_format,
                "follow_up_suggestions": [
                    "Would you like a detailed compliance assessment?",
                    "Should I prepare talking points for your customer meeting?",
                    "Do you need competitive positioning guidance?"
                ],
                "processing_time_ms": 350  # Fast mobile response
            }
            
            logger.info("Voice query processed",
                       user_id=user_id,
                       query_id=voice_query.query_id,
                       confidence=confidence)
            
            return response
            
        except Exception as e:
            logger.error("Voice query processing failed",
                        user_id=user_id,
                        query_id=voice_query.query_id,
                        error=str(e))
            
            return {
                "query_id": voice_query.query_id,
                "response": "I'm having trouble processing that request. Let me connect you with a compliance expert.",
                "confidence": 0.0,
                "escalation_needed": True,
                "processing_time_ms": 100
            }
    
    def _optimize_for_voice(self, content: str) -> str:
        """Optimize content for voice response"""
        # Shorten for voice delivery
        sentences = content.split('. ')
        if len(sentences) > 2:
            # Take first two sentences for voice
            return '. '.join(sentences[:2]) + '.'
        return content
    
    def _format_as_mobile_card(self, content: str, query: VoiceQuery) -> Dict[str, Any]:
        """Format response as mobile compliance card"""
        
        # Extract key framework from query
        framework = "General"
        if "gdpr" in query.transcript.lower():
            framework = "GDPR"
        elif "sox" in query.transcript.lower():
            framework = "SOX"
        elif "hipaa" in query.transcript.lower():
            framework = "HIPAA"
        
        # Create mobile card
        card = MobileComplianceCard(
            id=f"card_{query.query_id}",
            title=f"{framework} Compliance Guidance",
            summary=content[:120] + "..." if len(content) > 120 else content,
            framework=framework,
            confidence_score=0.9,
            key_points=[
                "Automated compliance monitoring",
                "Real-time regulatory updates", 
                "Expert validation available"
            ],
            action_required=False,
            urgent=query.urgency == "urgent",
            created_at=datetime.utcnow()
        )
        
        return {
            "type": "mobile_card",
            "card": card.dict(),
            "actions": [
                {"label": "Get Details", "action": "expand_details"},
                {"label": "Schedule Demo", "action": "schedule_demo"},
                {"label": "Share with Customer", "action": "share_content"}
            ]
        }
    
    async def get_customer_context_mobile(
        self,
        customer_name: str,
        user_id: str
    ) -> MobileCustomerContext:
        """Get mobile-optimized customer context"""
        
        try:
            # Mock customer context optimized for mobile
            context = MobileCustomerContext(
                customer_name=customer_name,
                industry="Financial Services",
                key_compliance_needs=["SOX compliance", "Basel III", "GDPR"],
                current_stage="Technical Evaluation",
                next_action="Schedule SOX compliance demo",
                contact_info={
                    "primary": "John Smith, CISO",
                    "email": "j.smith@customer.com",
                    "phone": "+1-555-0123"
                },
                meeting_notes=[
                    "Interested in automated control testing",
                    "Current solution takes 6 months to implement",
                    "Budget approved for Q1 implementation",
                    "Competing against ServiceNow GRC",
                    "Decision timeline: end of month"
                ]
            )
            
            logger.info("Mobile customer context retrieved",
                       customer=customer_name,
                       user_id=user_id)
            
            return context
            
        except Exception as e:
            logger.error("Failed to get mobile customer context",
                        customer=customer_name,
                        user_id=user_id,
                        error=str(e))
            raise
    
    async def send_mobile_notification(
        self,
        user_id: str,
        title: str,
        message: str,
        priority: NotificationPriority = NotificationPriority.NORMAL,
        action_url: Optional[str] = None
    ) -> bool:
        """Send push notification to mobile device"""
        
        try:
            # Mock mobile notification sending
            notification_data = {
                "user_id": user_id,
                "title": title,
                "message": message,
                "priority": priority.value,
                "action_url": action_url,
                "timestamp": datetime.utcnow().isoformat(),
                "badge_count": 1
            }
            
            # In production, would integrate with FCM/APNS
            logger.info("Mobile notification sent",
                       user_id=user_id,
                       title=title,
                       priority=priority.value)
            
            return True
            
        except Exception as e:
            logger.error("Failed to send mobile notification",
                        user_id=user_id,
                        title=title,
                        error=str(e))
            return False
    
    async def get_offline_compliance_data(
        self,
        user_id: str,
        device_type: MobileDeviceType
    ) -> Dict[str, Any]:
        """Get compliance data for offline mobile usage"""
        
        try:
            # Prepare essential compliance data for offline use
            offline_data = {
                "frameworks": {
                    "gdpr": {
                        "name": "GDPR",
                        "key_points": [
                            "Lawful basis required for data processing",
                            "Data subject rights must be honored",
                            "Privacy by design mandatory",
                            "Fines up to 4% of annual revenue"
                        ],
                        "erip_benefits": [
                            "Automated privacy impact assessments",
                            "Real-time consent management",
                            "Automated breach detection"
                        ]
                    },
                    "sox": {
                        "name": "SOX",
                        "key_points": [
                            "Internal financial controls required",
                            "Management assessment mandatory",
                            "CEO/CFO certification required",
                            "External auditor attestation needed"
                        ],
                        "erip_benefits": [
                            "Automated control testing",
                            "Real-time monitoring",
                            "Audit trail automation"
                        ]
                    },
                    "hipaa": {
                        "name": "HIPAA",
                        "key_points": [
                            "Administrative safeguards required",
                            "Physical safeguards mandatory",
                            "Technical safeguards needed",
                            "Business Associate Agreements required"
                        ],
                        "erip_benefits": [
                            "Automated PHI protection",
                            "Real-time access monitoring",
                            "BAA automation"
                        ]
                    }
                },
                "quick_responses": self.quick_responses,
                "competitive_talking_points": {
                    "servicenow": [
                        "ERIP implements in 30 days vs 6-12 months",
                        "AI-powered vs manual processes",
                        "Sales-native vs IT-focused design"
                    ],
                    "archer": [
                        "Modern cloud architecture vs legacy system",
                        "Instant compliance answers vs complex workflows",
                        "525% ROI vs high total cost of ownership"
                    ]
                },
                "customer_success_stories": [
                    {
                        "customer": "Global Financial Corp",
                        "challenge": "SOX compliance automation",
                        "result": "Reduced audit costs by 60%, 4-week implementation"
                    },
                    {
                        "customer": "Healthcare Innovation",
                        "challenge": "HIPAA compliance streamlining",
                        "result": "Automated PHI protection, 95% risk reduction"
                    }
                ],
                "last_updated": datetime.utcnow().isoformat(),
                "cache_version": "1.0"
            }
            
            logger.info("Offline compliance data prepared",
                       user_id=user_id,
                       device_type=device_type.value,
                       data_size=len(str(offline_data)))
            
            return offline_data
            
        except Exception as e:
            logger.error("Failed to prepare offline compliance data",
                        user_id=user_id,
                        error=str(e))
            return {"error": "Failed to prepare offline data"}
    
    async def track_mobile_usage(
        self,
        user_id: str,
        action: str,
        context: Dict[str, Any]
    ) -> bool:
        """Track mobile app usage for analytics"""
        
        try:
            usage_event = {
                "user_id": user_id,
                "action": action,
                "context": context,
                "timestamp": datetime.utcnow().isoformat(),
                "platform": "mobile"
            }
            
            # In production, would send to analytics platform
            logger.info("Mobile usage tracked",
                       user_id=user_id,
                       action=action)
            
            return True
            
        except Exception as e:
            logger.error("Failed to track mobile usage",
                        user_id=user_id,
                        action=action,
                        error=str(e))
            return False