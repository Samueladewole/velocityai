"""
Velocity AI Platform - AWS SES Email Service
Enterprise-grade email delivery with templates and tracking
"""
import os
import logging
import asyncio
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import jinja2
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
import aiosmtplib
from pydantic import BaseModel, EmailStr, Field

logger = logging.getLogger(__name__)

class EmailRequest(BaseModel):
    """Email request model"""
    to_email: EmailStr
    subject: str
    template_name: str
    template_data: Dict[str, Any] = Field(default_factory=dict)
    attachments: List[Dict[str, Any]] = Field(default_factory=list)
    reply_to: Optional[EmailStr] = None
    tags: List[str] = Field(default_factory=list)

class EmailDeliveryResult(BaseModel):
    """Email delivery result"""
    success: bool
    message_id: Optional[str] = None
    error: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VelocityEmailService:
    """
    Enterprise email service using AWS SES
    
    Features:
    - Template-based emails with Jinja2
    - AWS SES integration with fallback SMTP
    - Attachment support
    - Email tracking and analytics
    - Bounce and complaint handling
    - Template management
    """
    
    def __init__(self):
        self.ses_client = None
        self.smtp_client = None
        self.templates = {}
        self.template_loader = jinja2.FileSystemLoader('templates/email')
        self.jinja_env = jinja2.Environment(loader=self.template_loader)
        
        # Configuration
        self.aws_region = os.getenv('AWS_SES_REGION', 'us-east-1')
        self.from_email = os.getenv('FROM_EMAIL', 'noreply@velocity.eripapp.com')
        self.reply_to_email = os.getenv('REPLY_TO_EMAIL', 'support@velocity.eripapp.com')
        
        # SMTP fallback configuration
        self.smtp_host = os.getenv('SMTP_HOST', 'email-smtp.us-east-1.amazonaws.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_username = os.getenv('SES_SMTP_USERNAME')
        self.smtp_password = os.getenv('SES_SMTP_PASSWORD')
        
        self._initialize_clients()
        self._load_email_templates()
    
    def _initialize_clients(self):
        """Initialize AWS SES and SMTP clients"""
        try:
            # Initialize AWS SES client
            self.ses_client = boto3.client(
                'ses',
                region_name=self.aws_region,
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
            )
            logger.info("AWS SES client initialized successfully")
            
        except Exception as e:
            logger.warning(f"Failed to initialize SES client: {e}")
            self.ses_client = None
    
    def _load_email_templates(self):
        """Load email templates from filesystem"""
        self.templates = {
            'welcome': {
                'subject': 'Welcome to Velocity AI Platform',
                'html_template': 'welcome.html',
                'text_template': 'welcome.txt'
            },
            'gdpr_transfer_guide': {
                'subject': 'Your GDPR International Transfer Compliance Guide',
                'html_template': 'gdpr_transfer_guide.html',
                'text_template': 'gdpr_transfer_guide.txt'
            },
            'iso27001_guide': {
                'subject': 'Your ISO 27001 Compliance Guide',
                'html_template': 'iso27001_guide.html',
                'text_template': 'iso27001_guide.txt'
            },
            'soc2_guide': {
                'subject': 'Your SOC 2 Compliance Guide',
                'html_template': 'soc2_guide.html',
                'text_template': 'soc2_guide.txt'
            },
            'evidence_report': {
                'subject': 'Your Compliance Evidence Report is Ready',
                'html_template': 'evidence_report.html',
                'text_template': 'evidence_report.txt'
            },
            'trust_score_update': {
                'subject': 'Your Trust Score Has Been Updated',
                'html_template': 'trust_score_update.html',
                'text_template': 'trust_score_update.txt'
            },
            'agent_completion': {
                'subject': 'Agent Execution Completed',
                'html_template': 'agent_completion.html',
                'text_template': 'agent_completion.txt'
            },
            'password_reset': {
                'subject': 'Reset Your Velocity Platform Password',
                'html_template': 'password_reset.html',
                'text_template': 'password_reset.txt'
            }
        }
        logger.info(f"Loaded {len(self.templates)} email templates")
    
    async def send_email(self, email_request: EmailRequest) -> EmailDeliveryResult:
        """
        Send email using AWS SES with SMTP fallback
        """
        try:
            # Get template configuration
            if email_request.template_name not in self.templates:
                raise ValueError(f"Unknown template: {email_request.template_name}")
            
            template_config = self.templates[email_request.template_name]
            
            # Render email content
            subject = email_request.subject or template_config['subject']
            html_content = await self._render_template(
                template_config['html_template'], 
                email_request.template_data
            )
            text_content = await self._render_template(
                template_config['text_template'], 
                email_request.template_data
            )
            
            # Try AWS SES first
            if self.ses_client:
                try:
                    result = await self._send_via_ses(
                        email_request.to_email,
                        subject,
                        html_content,
                        text_content,
                        email_request.attachments,
                        email_request.reply_to or self.reply_to_email,
                        email_request.tags
                    )
                    if result.success:
                        return result
                except Exception as e:
                    logger.warning(f"SES delivery failed, trying SMTP: {e}")
            
            # Fallback to SMTP
            return await self._send_via_smtp(
                email_request.to_email,
                subject,
                html_content,
                text_content,
                email_request.attachments,
                email_request.reply_to or self.reply_to_email
            )
            
        except Exception as e:
            logger.error(f"Email delivery failed: {e}")
            return EmailDeliveryResult(
                success=False,
                error=str(e)
            )
    
    async def _render_template(self, template_name: str, template_data: Dict[str, Any]) -> str:
        """Render email template with data"""
        try:
            template = self.jinja_env.get_template(template_name)
            return template.render(**template_data)
        except Exception as e:
            logger.error(f"Template rendering failed for {template_name}: {e}")
            return f"Error rendering template: {template_name}"
    
    async def _send_via_ses(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: str,
        attachments: List[Dict[str, Any]],
        reply_to: str,
        tags: List[str]
    ) -> EmailDeliveryResult:
        """Send email via AWS SES"""
        try:
            # Prepare message body
            body = {
                'Text': {'Data': text_content, 'Charset': 'UTF-8'},
                'Html': {'Data': html_content, 'Charset': 'UTF-8'}
            }
            
            # Prepare message
            message = {
                'Subject': {'Data': subject, 'Charset': 'UTF-8'},
                'Body': body
            }
            
            # Send email
            response = self.ses_client.send_email(
                Source=self.from_email,
                Destination={'ToAddresses': [to_email]},
                Message=message,
                ReplyToAddresses=[reply_to],
                Tags=[{'Name': tag, 'Value': 'true'} for tag in tags]
            )
            
            message_id = response['MessageId']
            logger.info(f"Email sent via SES: {message_id}")
            
            return EmailDeliveryResult(
                success=True,
                message_id=message_id
            )
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            logger.error(f"SES error {error_code}: {error_message}")
            
            return EmailDeliveryResult(
                success=False,
                error=f"SES {error_code}: {error_message}"
            )
    
    async def _send_via_smtp(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: str,
        attachments: List[Dict[str, Any]],
        reply_to: str
    ) -> EmailDeliveryResult:
        """Send email via SMTP"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = subject
            msg['Reply-To'] = reply_to
            
            # Add text and HTML parts
            text_part = MIMEText(text_content, 'plain', 'utf-8')
            html_part = MIMEText(html_content, 'html', 'utf-8')
            
            msg.attach(text_part)
            msg.attach(html_part)
            
            # Add attachments
            for attachment in attachments:
                await self._add_attachment(msg, attachment)
            
            # Send via SMTP
            smtp = aiosmtplib.SMTP(hostname=self.smtp_host, port=self.smtp_port)
            await smtp.connect()
            await smtp.starttls()
            await smtp.login(self.smtp_username, self.smtp_password)
            await smtp.send_message(msg)
            await smtp.quit()
            
            logger.info(f"Email sent via SMTP to {to_email}")
            
            return EmailDeliveryResult(
                success=True,
                message_id=f"smtp-{datetime.now().timestamp()}"
            )
            
        except Exception as e:
            logger.error(f"SMTP delivery failed: {e}")
            return EmailDeliveryResult(
                success=False,
                error=str(e)
            )
    
    async def _add_attachment(self, msg: MIMEMultipart, attachment: Dict[str, Any]):
        """Add attachment to email message"""
        try:
            filename = attachment['filename']
            content = attachment['content']
            content_type = attachment.get('content_type', 'application/octet-stream')
            
            part = MIMEBase(*content_type.split('/'))
            part.set_payload(content)
            encoders.encode_base64(part)
            
            part.add_header(
                'Content-Disposition',
                f'attachment; filename= {filename}'
            )
            
            msg.attach(part)
            
        except Exception as e:
            logger.error(f"Failed to add attachment {attachment.get('filename', 'unknown')}: {e}")
    
    async def send_guide_download_email(
        self,
        to_email: str,
        guide_type: str,
        user_name: str,
        download_link: str,
        company_name: Optional[str] = None
    ) -> EmailDeliveryResult:
        """
        Send guide download email with personalized content
        """
        # Map guide types to templates
        template_mapping = {
            'gdpr_transfer': 'gdpr_transfer_guide',
            'iso27001': 'iso27001_guide',
            'soc2': 'soc2_guide'
        }
        
        template_name = template_mapping.get(guide_type, 'gdpr_transfer_guide')
        
        # Prepare template data
        template_data = {
            'user_name': user_name,
            'company_name': company_name or 'your organization',
            'download_link': download_link,
            'guide_type': guide_type.upper().replace('_', ' '),
            'current_year': datetime.now().year,
            'platform_url': 'https://velocity.eripapp.com',
            'support_email': 'support@velocity.eripapp.com',
            'unsubscribe_link': f'https://velocity.eripapp.com/unsubscribe?email={to_email}'
        }
        
        # Create email request
        email_request = EmailRequest(
            to_email=to_email,
            template_name=template_name,
            template_data=template_data,
            tags=['guide_download', guide_type, 'marketing']
        )
        
        return await self.send_email(email_request)
    
    async def send_welcome_email(
        self,
        to_email: str,
        user_name: str,
        verification_link: Optional[str] = None
    ) -> EmailDeliveryResult:
        """Send welcome email to new users"""
        template_data = {
            'user_name': user_name,
            'verification_link': verification_link,
            'platform_url': 'https://velocity.eripapp.com',
            'dashboard_url': 'https://velocity.eripapp.com/app/dashboard',
            'support_email': 'support@velocity.eripapp.com',
            'current_year': datetime.now().year
        }
        
        email_request = EmailRequest(
            to_email=to_email,
            template_name='welcome',
            template_data=template_data,
            tags=['welcome', 'onboarding']
        )
        
        return await self.send_email(email_request)
    
    async def send_evidence_report_email(
        self,
        to_email: str,
        user_name: str,
        report_data: Dict[str, Any]
    ) -> EmailDeliveryResult:
        """Send evidence collection report"""
        template_data = {
            'user_name': user_name,
            'evidence_count': report_data.get('evidence_count', 0),
            'trust_score': report_data.get('trust_score', 0),
            'frameworks': report_data.get('frameworks', []),
            'report_url': report_data.get('report_url'),
            'generated_at': datetime.now().strftime('%B %d, %Y'),
            'platform_url': 'https://velocity.eripapp.com'
        }
        
        email_request = EmailRequest(
            to_email=to_email,
            template_name='evidence_report',
            template_data=template_data,
            tags=['evidence_report', 'compliance']
        )
        
        return await self.send_email(email_request)
    
    async def get_sending_statistics(self) -> Dict[str, Any]:
        """Get SES sending statistics"""
        try:
            if not self.ses_client:
                return {"error": "SES client not available"}
            
            response = self.ses_client.get_send_statistics()
            return {
                "send_data_points": response.get('SendDataPoints', []),
                "last_updated": datetime.now(timezone.utc).isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get sending statistics: {e}")
            return {"error": str(e)}
    
    async def verify_email_address(self, email: str) -> bool:
        """Verify email address with SES"""
        try:
            if not self.ses_client:
                return False
            
            self.ses_client.verify_email_identity(EmailAddress=email)
            return True
            
        except Exception as e:
            logger.error(f"Failed to verify email {email}: {e}")
            return False
    
    async def handle_bounce_complaint(self, message: Dict[str, Any]):
        """Handle SES bounce and complaint notifications"""
        try:
            message_type = message.get('Type')
            
            if message_type == 'Bounce':
                bounce_info = message.get('Bounce', {})
                bounced_recipients = bounce_info.get('BouncedRecipients', [])
                
                for recipient in bounced_recipients:
                    email = recipient.get('EmailAddress')
                    bounce_type = bounce_info.get('BounceType')
                    
                    logger.warning(f"Email bounced: {email} ({bounce_type})")
                    
                    # Handle permanent bounces by marking email as invalid
                    if bounce_type == 'Permanent':
                        await self._mark_email_invalid(email)
            
            elif message_type == 'Complaint':
                complaint_info = message.get('Complaint', {})
                complained_recipients = complaint_info.get('ComplainedRecipients', [])
                
                for recipient in complained_recipients:
                    email = recipient.get('EmailAddress')
                    logger.warning(f"Complaint received for: {email}")
                    
                    # Handle complaints by unsubscribing user
                    await self._unsubscribe_email(email)
                    
        except Exception as e:
            logger.error(f"Failed to handle bounce/complaint: {e}")
    
    async def _mark_email_invalid(self, email: str):
        """Mark email as invalid in database"""
        # This would update the user record in database
        # Implementation depends on your database schema
        logger.info(f"Marking email as invalid: {email}")
    
    async def _unsubscribe_email(self, email: str):
        """Unsubscribe email from marketing communications"""
        # This would update the user preferences in database
        # Implementation depends on your database schema
        logger.info(f"Unsubscribing email: {email}")

# Global email service instance
email_service = VelocityEmailService()

# Convenience functions for common email operations
async def send_guide_download_email(
    to_email: str,
    guide_type: str,
    user_name: str,
    download_link: str,
    company_name: Optional[str] = None
) -> EmailDeliveryResult:
    """Send guide download email"""
    return await email_service.send_guide_download_email(
        to_email, guide_type, user_name, download_link, company_name
    )

async def send_welcome_email(
    to_email: str,
    user_name: str,
    verification_link: Optional[str] = None
) -> EmailDeliveryResult:
    """Send welcome email"""
    return await email_service.send_welcome_email(to_email, user_name, verification_link)

async def send_evidence_report_email(
    to_email: str,
    user_name: str,
    report_data: Dict[str, Any]
) -> EmailDeliveryResult:
    """Send evidence report email"""
    return await email_service.send_evidence_report_email(to_email, user_name, report_data)