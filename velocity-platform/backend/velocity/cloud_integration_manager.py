"""
Velocity AI Platform - Comprehensive Cloud Integration Management System
Production-ready cloud platform integrations with enterprise security and compliance features
"""

import asyncio
import logging
import json
import time
from typing import Dict, List, Any, Optional, Union, Tuple
from datetime import datetime, timezone, timedelta
from enum import Enum
from dataclasses import dataclass, asdict
import uuid

logger = logging.getLogger(__name__)

# Third-party imports - with error handling for enterprise deployment
try:
    import boto3
    from botocore.exceptions import ClientError, NoCredentialsError
    AWS_AVAILABLE = True
except ImportError:
    logger.warning("AWS SDK not available")
    AWS_AVAILABLE = False

try:
    from google.cloud import storage
    from google.oauth2 import service_account
    GCP_AVAILABLE = True
except ImportError:
    logger.warning("GCP SDK not available") 
    GCP_AVAILABLE = False

try:
    from azure.identity import DefaultAzureCredential, ClientSecretCredential
    from azure.mgmt.resource import ResourceManagementClient
    AZURE_AVAILABLE = True
except ImportError:
    logger.warning("Azure SDK not available")
    AZURE_AVAILABLE = False

try:
    import httpx
    HTTP_AVAILABLE = True
except ImportError:
    logger.warning("HTTP client not available")
    HTTP_AVAILABLE = False
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

# Internal imports
from models import (
    Platform, Integration, IntegrationStatus, EvidenceItem, EvidenceType, 
    Framework, Organization, User
)
from security import encrypt_credentials, decrypt_credentials, EncryptionService
from validation import VelocityException, ResourceNotFoundException

logger = logging.getLogger(__name__)

# Configuration and Constants
CLOUD_PLATFORM_TIMEOUTS = {
    Platform.AWS: 30,
    Platform.GCP: 30,
    Platform.AZURE: 45,
    Platform.GITHUB: 15
}

RETRY_ATTEMPTS = 3
EVIDENCE_COLLECTION_BATCH_SIZE = 100
SYNC_FREQUENCY_MINUTES = 60

# Enums and Data Models

class ConnectionHealthStatus(Enum):
    """Health status for cloud connections"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"

class EvidenceCollectionType(Enum):
    """Types of evidence that can be collected"""
    POLICIES = "policies"
    CONFIGURATIONS = "configurations"
    AUDIT_LOGS = "audit_logs"
    SECURITY_GROUPS = "security_groups"
    ENCRYPTION_STATUS = "encryption_status"
    ACCESS_CONTROLS = "access_controls"
    COMPLIANCE_RULES = "compliance_rules"

@dataclass
class CloudCredentials:
    """Base class for cloud credentials"""
    platform: Platform
    created_at: datetime = None
    expires_at: Optional[datetime] = None
    
    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now(timezone.utc)
    
    def is_expired(self) -> bool:
        """Check if credentials are expired"""
        if not self.expires_at:
            return False
        return datetime.now(timezone.utc) > self.expires_at

@dataclass
class AWSCredentials(CloudCredentials):
    """AWS-specific credentials"""
    access_key_id: str = ""
    secret_access_key: str = ""
    region: str = "us-east-1"
    session_token: Optional[str] = None
    
    def __post_init__(self):
        super().__post_init__()
        self.platform = Platform.AWS

@dataclass
class GCPCredentials(CloudCredentials):
    """GCP-specific credentials"""
    service_account_key: Dict[str, Any] = None
    project_id: str = ""
    
    def __post_init__(self):
        super().__post_init__()
        if not self.service_account_key:
            self.service_account_key = {}
        self.platform = Platform.GCP

@dataclass
class AzureCredentials(CloudCredentials):
    """Azure-specific credentials"""
    tenant_id: str = ""
    client_id: str = ""
    client_secret: str = ""
    subscription_id: str = ""
    
    def __post_init__(self):
        super().__post_init__()
        self.platform = Platform.AZURE

@dataclass
class GitHubCredentials(CloudCredentials):
    """GitHub-specific credentials"""
    token: str = ""
    username: str = ""
    organization: Optional[str] = None
    
    def __post_init__(self):
        super().__post_init__()
        self.platform = Platform.GITHUB

@dataclass
class ConnectionHealthCheck:
    """Health check result for a cloud connection"""
    platform: Platform
    status: ConnectionHealthStatus
    response_time_ms: float
    error_message: Optional[str] = None
    last_checked: datetime = None
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if not self.last_checked:
            self.last_checked = datetime.now(timezone.utc)
        if not self.metadata:
            self.metadata = {}

@dataclass
class EvidenceCollectionResult:
    """Result of evidence collection operation"""
    platform: Platform
    collection_type: EvidenceCollectionType
    evidence_count: int
    success: bool
    error_message: Optional[str] = None
    collected_at: datetime = None
    evidence_items: List[Dict[str, Any]] = None
    
    def __post_init__(self):
        if not self.collected_at:
            self.collected_at = datetime.now(timezone.utc)
        if not self.evidence_items:
            self.evidence_items = []

class CloudIntegrationRequest(BaseModel):
    """Request model for cloud integration"""
    platform: Platform
    credentials: Dict[str, Any]
    configuration: Dict[str, Any] = Field(default_factory=dict)
    test_connection: bool = Field(True, description="Test connection before saving")

class CloudSyncRequest(BaseModel):
    """Request model for cloud data synchronization"""
    integration_id: str
    evidence_types: List[EvidenceCollectionType] = Field(default_factory=list)
    framework: Optional[Framework] = None

# Cloud Platform Clients

class BaseCloudClient:
    """Base class for cloud platform clients"""
    
    def __init__(self, credentials: CloudCredentials, encryption_service: EncryptionService):
        self.credentials = credentials
        self.encryption_service = encryption_service
        self.platform = credentials.platform
        self.last_health_check: Optional[ConnectionHealthCheck] = None
        self._client_cache = {}
    
    async def test_connection(self) -> ConnectionHealthCheck:
        """Test connection to the cloud platform"""
        raise NotImplementedError("Subclasses must implement test_connection")
    
    async def collect_evidence(
        self, 
        evidence_types: List[EvidenceCollectionType],
        framework: Optional[Framework] = None
    ) -> List[EvidenceCollectionResult]:
        """Collect evidence from the cloud platform"""
        raise NotImplementedError("Subclasses must implement collect_evidence")
    
    async def sync_data(self) -> Dict[str, Any]:
        """Synchronize data from the cloud platform"""
        raise NotImplementedError("Subclasses must implement sync_data")

class AWSClient(BaseCloudClient):
    """AWS cloud platform client"""
    
    def __init__(self, credentials: AWSCredentials, encryption_service: EncryptionService):
        super().__init__(credentials, encryption_service)
        self.aws_credentials = credentials
        self._session = None
    
    def _get_session(self) -> boto3.Session:
        """Get or create AWS session"""
        if not self._session:
            self._session = boto3.Session(
                aws_access_key_id=self.aws_credentials.access_key_id,
                aws_secret_access_key=self.aws_credentials.secret_access_key,
                region_name=self.aws_credentials.region,
                aws_session_token=self.aws_credentials.session_token
            )
        return self._session
    
    def _get_client(self, service_name: str):
        """Get AWS service client with caching"""
        cache_key = f"{service_name}_{self.aws_credentials.region}"
        if cache_key not in self._client_cache:
            session = self._get_session()
            self._client_cache[cache_key] = session.client(service_name)
        return self._client_cache[cache_key]
    
    async def test_connection(self) -> ConnectionHealthCheck:
        """Test AWS connection"""
        start_time = time.time()
        
        try:
            # Test basic connectivity with STS
            sts_client = self._get_client('sts')
            response = sts_client.get_caller_identity()
            
            response_time = (time.time() - start_time) * 1000
            
            self.last_health_check = ConnectionHealthCheck(
                platform=Platform.AWS,
                status=ConnectionHealthStatus.HEALTHY,
                response_time_ms=response_time,
                metadata={
                    'account_id': response.get('Account'),
                    'user_id': response.get('UserId'),
                    'arn': response.get('Arn')
                }
            )
            
        except NoCredentialsError as e:
            self.last_health_check = ConnectionHealthCheck(
                platform=Platform.AWS,
                status=ConnectionHealthStatus.UNHEALTHY,
                response_time_ms=(time.time() - start_time) * 1000,
                error_message="Invalid AWS credentials"
            )
        except ClientError as e:
            error_code = e.response['Error']['Code']
            self.last_health_check = ConnectionHealthCheck(
                platform=Platform.AWS,
                status=ConnectionHealthStatus.UNHEALTHY,
                response_time_ms=(time.time() - start_time) * 1000,
                error_message=f"AWS Error: {error_code} - {e.response['Error']['Message']}"
            )
        except Exception as e:
            self.last_health_check = ConnectionHealthCheck(
                platform=Platform.AWS,
                status=ConnectionHealthStatus.UNHEALTHY,
                response_time_ms=(time.time() - start_time) * 1000,
                error_message=f"Connection error: {str(e)}"
            )
        
        return self.last_health_check
    
    async def collect_evidence(
        self, 
        evidence_types: List[EvidenceCollectionType],
        framework: Optional[Framework] = None
    ) -> List[EvidenceCollectionResult]:
        """Collect evidence from AWS"""
        results = []
        
        for evidence_type in evidence_types:
            try:
                if evidence_type == EvidenceCollectionType.POLICIES:
                    result = await self._collect_iam_policies()
                elif evidence_type == EvidenceCollectionType.SECURITY_GROUPS:
                    result = await self._collect_security_groups()
                elif evidence_type == EvidenceCollectionType.ENCRYPTION_STATUS:
                    result = await self._collect_encryption_status()
                elif evidence_type == EvidenceCollectionType.AUDIT_LOGS:
                    result = await self._collect_cloudtrail_logs()
                elif evidence_type == EvidenceCollectionType.COMPLIANCE_RULES:
                    result = await self._collect_config_rules()
                else:
                    result = EvidenceCollectionResult(
                        platform=Platform.AWS,
                        collection_type=evidence_type,
                        evidence_count=0,
                        success=False,
                        error_message=f"Evidence type {evidence_type} not supported for AWS"
                    )
                
                results.append(result)
                
            except Exception as e:
                logger.error(f"Error collecting {evidence_type} from AWS: {e}")
                results.append(EvidenceCollectionResult(
                    platform=Platform.AWS,
                    collection_type=evidence_type,
                    evidence_count=0,
                    success=False,
                    error_message=str(e)
                ))
        
        return results
    
    async def _collect_iam_policies(self) -> EvidenceCollectionResult:
        """Collect IAM policies"""
        try:
            iam_client = self._get_client('iam')
            response = iam_client.list_policies(Scope='All', MaxItems=EVIDENCE_COLLECTION_BATCH_SIZE)
            
            policies = response.get('Policies', [])
            evidence_items = []
            
            for policy in policies:
                evidence_items.append({
                    'policy_name': policy.get('PolicyName'),
                    'policy_arn': policy.get('Arn'),
                    'description': policy.get('Description'),
                    'create_date': policy.get('CreateDate').isoformat() if policy.get('CreateDate') else None,
                    'update_date': policy.get('UpdateDate').isoformat() if policy.get('UpdateDate') else None,
                    'attachment_count': policy.get('AttachmentCount', 0),
                    'is_aws_managed': policy.get('Arn', '').startswith('arn:aws:iam::aws:')
                })
            
            return EvidenceCollectionResult(
                platform=Platform.AWS,
                collection_type=EvidenceCollectionType.POLICIES,
                evidence_count=len(evidence_items),
                success=True,
                evidence_items=evidence_items
            )
            
        except Exception as e:
            return EvidenceCollectionResult(
                platform=Platform.AWS,
                collection_type=EvidenceCollectionType.POLICIES,
                evidence_count=0,
                success=False,
                error_message=str(e)
            )
    
    async def _collect_security_groups(self) -> EvidenceCollectionResult:
        """Collect EC2 security groups"""
        try:
            ec2_client = self._get_client('ec2')
            response = ec2_client.describe_security_groups(MaxResults=EVIDENCE_COLLECTION_BATCH_SIZE)
            
            security_groups = response.get('SecurityGroups', [])
            evidence_items = []
            
            for sg in security_groups:
                evidence_items.append({
                    'group_id': sg.get('GroupId'),
                    'group_name': sg.get('GroupName'),
                    'description': sg.get('Description'),
                    'vpc_id': sg.get('VpcId'),
                    'owner_id': sg.get('OwnerId'),
                    'inbound_rules': sg.get('IpPermissions', []),
                    'outbound_rules': sg.get('IpPermissionsEgress', []),
                    'tags': sg.get('Tags', [])
                })
            
            return EvidenceCollectionResult(
                platform=Platform.AWS,
                collection_type=EvidenceCollectionType.SECURITY_GROUPS,
                evidence_count=len(evidence_items),
                success=True,
                evidence_items=evidence_items
            )
            
        except Exception as e:
            return EvidenceCollectionResult(
                platform=Platform.AWS,
                collection_type=EvidenceCollectionType.SECURITY_GROUPS,
                evidence_count=0,
                success=False,
                error_message=str(e)
            )
    
    async def _collect_encryption_status(self) -> EvidenceCollectionResult:
        """Collect S3 bucket encryption status"""
        try:
            s3_client = self._get_client('s3')
            response = s3_client.list_buckets()
            
            buckets = response.get('Buckets', [])
            evidence_items = []
            
            for bucket in buckets:
                bucket_name = bucket.get('Name')
                try:
                    encryption_response = s3_client.get_bucket_encryption(Bucket=bucket_name)
                    encryption_config = encryption_response.get('ServerSideEncryptionConfiguration', {})
                    encrypted = True
                except ClientError as e:
                    if e.response['Error']['Code'] == 'ServerSideEncryptionConfigurationNotFoundError':
                        encryption_config = {}
                        encrypted = False
                    else:
                        continue
                
                evidence_items.append({
                    'bucket_name': bucket_name,
                    'creation_date': bucket.get('CreationDate').isoformat() if bucket.get('CreationDate') else None,
                    'encrypted': encrypted,
                    'encryption_config': encryption_config
                })
            
            return EvidenceCollectionResult(
                platform=Platform.AWS,
                collection_type=EvidenceCollectionType.ENCRYPTION_STATUS,
                evidence_count=len(evidence_items),
                success=True,
                evidence_items=evidence_items
            )
            
        except Exception as e:
            return EvidenceCollectionResult(
                platform=Platform.AWS,
                collection_type=EvidenceCollectionType.ENCRYPTION_STATUS,
                evidence_count=0,
                success=False,
                error_message=str(e)
            )
    
    async def _collect_cloudtrail_logs(self) -> EvidenceCollectionResult:
        """Collect CloudTrail audit logs"""
        try:
            cloudtrail_client = self._get_client('cloudtrail')
            
            # Get recent events (last 24 hours)
            end_time = datetime.now(timezone.utc)
            start_time = end_time - timedelta(days=1)
            
            response = cloudtrail_client.lookup_events(
                StartTime=start_time,
                EndTime=end_time,
                MaxItems=EVIDENCE_COLLECTION_BATCH_SIZE
            )
            
            events = response.get('Events', [])
            evidence_items = []
            
            for event in events:
                evidence_items.append({
                    'event_id': event.get('EventId'),
                    'event_name': event.get('EventName'),
                    'event_time': event.get('EventTime').isoformat() if event.get('EventTime') else None,
                    'username': event.get('Username'),
                    'source_ip_address': event.get('SourceIPAddress'),
                    'user_agent': event.get('UserAgent'),
                    'aws_region': event.get('AwsRegion'),
                    'resources': event.get('Resources', [])
                })
            
            return EvidenceCollectionResult(
                platform=Platform.AWS,
                collection_type=EvidenceCollectionType.AUDIT_LOGS,
                evidence_count=len(evidence_items),
                success=True,
                evidence_items=evidence_items
            )
            
        except Exception as e:
            return EvidenceCollectionResult(
                platform=Platform.AWS,
                collection_type=EvidenceCollectionType.AUDIT_LOGS,
                evidence_count=0,
                success=False,
                error_message=str(e)
            )
    
    async def _collect_config_rules(self) -> EvidenceCollectionResult:
        """Collect AWS Config compliance rules"""
        try:
            config_client = self._get_client('config')
            response = config_client.describe_config_rules(MaxResults=EVIDENCE_COLLECTION_BATCH_SIZE)
            
            config_rules = response.get('ConfigRules', [])
            evidence_items = []
            
            for rule in config_rules:
                # Get compliance status for each rule
                try:
                    compliance_response = config_client.get_compliance_details_by_config_rule(
                        ConfigRuleName=rule.get('ConfigRuleName')
                    )
                    compliance_results = compliance_response.get('EvaluationResults', [])
                except:
                    compliance_results = []
                
                evidence_items.append({
                    'rule_name': rule.get('ConfigRuleName'),
                    'description': rule.get('Description'),
                    'source': rule.get('Source', {}),
                    'config_rule_state': rule.get('ConfigRuleState'),
                    'compliance_results': compliance_results[:10]  # Limit to first 10 results
                })
            
            return EvidenceCollectionResult(
                platform=Platform.AWS,
                collection_type=EvidenceCollectionType.COMPLIANCE_RULES,
                evidence_count=len(evidence_items),
                success=True,
                evidence_items=evidence_items
            )
            
        except Exception as e:
            return EvidenceCollectionResult(
                platform=Platform.AWS,
                collection_type=EvidenceCollectionType.COMPLIANCE_RULES,
                evidence_count=0,
                success=False,
                error_message=str(e)
            )
    
    async def sync_data(self) -> Dict[str, Any]:
        """Synchronize AWS data"""
        # Collect all evidence types
        evidence_types = [
            EvidenceCollectionType.POLICIES,
            EvidenceCollectionType.SECURITY_GROUPS,
            EvidenceCollectionType.ENCRYPTION_STATUS,
            EvidenceCollectionType.AUDIT_LOGS,
            EvidenceCollectionType.COMPLIANCE_RULES
        ]
        
        results = await self.collect_evidence(evidence_types)
        
        return {
            'sync_time': datetime.now(timezone.utc).isoformat(),
            'platform': Platform.AWS.value,
            'results': [asdict(result) for result in results],
            'total_evidence_collected': sum(r.evidence_count for r in results),
            'successful_collections': len([r for r in results if r.success])
        }

class GCPClient(BaseCloudClient):
    """Google Cloud Platform client"""
    
    def __init__(self, credentials: GCPCredentials, encryption_service: EncryptionService):
        super().__init__(credentials, encryption_service)
        self.gcp_credentials = credentials
        self._service_account_info = None
        self._credentials_obj = None
    
    def _get_credentials(self):
        """Get GCP credentials object"""
        if not self._credentials_obj:
            self._service_account_info = self.gcp_credentials.service_account_key
            self._credentials_obj = service_account.Credentials.from_service_account_info(
                self._service_account_info
            )
        return self._credentials_obj
    
    async def test_connection(self) -> ConnectionHealthCheck:
        """Test GCP connection"""
        start_time = time.time()
        
        try:
            credentials = self._get_credentials()
            client = resource_manager.Client(credentials=credentials)
            
            # Test by listing projects
            projects = list(client.list_projects())
            
            response_time = (time.time() - start_time) * 1000
            
            self.last_health_check = ConnectionHealthCheck(
                platform=Platform.GCP,
                status=ConnectionHealthStatus.HEALTHY,
                response_time_ms=response_time,
                metadata={
                    'project_id': self.gcp_credentials.project_id,
                    'projects_accessible': len(projects),
                    'service_account_email': self._service_account_info.get('client_email')
                }
            )
            
        except GoogleAPIError as e:
            self.last_health_check = ConnectionHealthCheck(
                platform=Platform.GCP,
                status=ConnectionHealthStatus.UNHEALTHY,
                response_time_ms=(time.time() - start_time) * 1000,
                error_message=f"GCP API Error: {str(e)}"
            )
        except Exception as e:
            self.last_health_check = ConnectionHealthCheck(
                platform=Platform.GCP,
                status=ConnectionHealthStatus.UNHEALTHY,
                response_time_ms=(time.time() - start_time) * 1000,
                error_message=f"Connection error: {str(e)}"
            )
        
        return self.last_health_check
    
    async def collect_evidence(
        self, 
        evidence_types: List[EvidenceCollectionType],
        framework: Optional[Framework] = None
    ) -> List[EvidenceCollectionResult]:
        """Collect evidence from GCP"""
        results = []
        
        for evidence_type in evidence_types:
            try:
                if evidence_type == EvidenceCollectionType.POLICIES:
                    result = await self._collect_iam_policies()
                elif evidence_type == EvidenceCollectionType.CONFIGURATIONS:
                    result = await self._collect_project_configs()
                else:
                    result = EvidenceCollectionResult(
                        platform=Platform.GCP,
                        collection_type=evidence_type,
                        evidence_count=0,
                        success=False,
                        error_message=f"Evidence type {evidence_type} not supported for GCP"
                    )
                
                results.append(result)
                
            except Exception as e:
                logger.error(f"Error collecting {evidence_type} from GCP: {e}")
                results.append(EvidenceCollectionResult(
                    platform=Platform.GCP,
                    collection_type=evidence_type,
                    evidence_count=0,
                    success=False,
                    error_message=str(e)
                ))
        
        return results
    
    async def _collect_iam_policies(self) -> EvidenceCollectionResult:
        """Collect GCP IAM policies"""
        try:
            credentials = self._get_credentials()
            client = resource_manager.Client(credentials=credentials)
            project = client.fetch_project(self.gcp_credentials.project_id)
            
            # Get IAM policy for the project
            policy = project.get_iam_policy()
            
            evidence_items = [{
                'project_id': self.gcp_credentials.project_id,
                'bindings': [
                    {
                        'role': binding.role,
                        'members': list(binding.members)
                    }
                    for binding in policy.bindings
                ],
                'etag': policy.etag,
                'version': policy.version
            }]
            
            return EvidenceCollectionResult(
                platform=Platform.GCP,
                collection_type=EvidenceCollectionType.POLICIES,
                evidence_count=len(evidence_items),
                success=True,
                evidence_items=evidence_items
            )
            
        except Exception as e:
            return EvidenceCollectionResult(
                platform=Platform.GCP,
                collection_type=EvidenceCollectionType.POLICIES,
                evidence_count=0,
                success=False,
                error_message=str(e)
            )
    
    async def _collect_project_configs(self) -> EvidenceCollectionResult:
        """Collect GCP project configurations"""
        try:
            credentials = self._get_credentials()
            client = resource_manager.Client(credentials=credentials)
            project = client.fetch_project(self.gcp_credentials.project_id)
            
            evidence_items = [{
                'project_id': project.project_id,
                'name': project.name,
                'lifecycle_state': project.lifecycle_state.name if project.lifecycle_state else None,
                'create_time': project.create_time.isoformat() if project.create_time else None,
                'labels': dict(project.labels) if project.labels else {}
            }]
            
            return EvidenceCollectionResult(
                platform=Platform.GCP,
                collection_type=EvidenceCollectionType.CONFIGURATIONS,
                evidence_count=len(evidence_items),
                success=True,
                evidence_items=evidence_items
            )
            
        except Exception as e:
            return EvidenceCollectionResult(
                platform=Platform.GCP,
                collection_type=EvidenceCollectionType.CONFIGURATIONS,
                evidence_count=0,
                success=False,
                error_message=str(e)
            )
    
    async def sync_data(self) -> Dict[str, Any]:
        """Synchronize GCP data"""
        evidence_types = [
            EvidenceCollectionType.POLICIES,
            EvidenceCollectionType.CONFIGURATIONS
        ]
        
        results = await self.collect_evidence(evidence_types)
        
        return {
            'sync_time': datetime.now(timezone.utc).isoformat(),
            'platform': Platform.GCP.value,
            'results': [asdict(result) for result in results],
            'total_evidence_collected': sum(r.evidence_count for r in results),
            'successful_collections': len([r for r in results if r.success])
        }

class AzureClient(BaseCloudClient):
    """Microsoft Azure cloud platform client"""
    
    def __init__(self, credentials: AzureCredentials, encryption_service: EncryptionService):
        super().__init__(credentials, encryption_service)
        self.azure_credentials = credentials
        self._credential_obj = None
    
    def _get_credentials(self):
        """Get Azure credentials object"""
        if not self._credential_obj:
            self._credential_obj = ClientSecretCredential(
                tenant_id=self.azure_credentials.tenant_id,
                client_id=self.azure_credentials.client_id,
                client_secret=self.azure_credentials.client_secret
            )
        return self._credential_obj
    
    async def test_connection(self) -> ConnectionHealthCheck:
        """Test Azure connection"""
        start_time = time.time()
        
        try:
            credential = self._get_credentials()
            resource_client = ResourceManagementClient(
                credential, 
                self.azure_credentials.subscription_id
            )
            
            # Test by listing resource groups
            resource_groups = list(resource_client.resource_groups.list())
            
            response_time = (time.time() - start_time) * 1000
            
            self.last_health_check = ConnectionHealthCheck(
                platform=Platform.AZURE,
                status=ConnectionHealthStatus.HEALTHY,
                response_time_ms=response_time,
                metadata={
                    'subscription_id': self.azure_credentials.subscription_id,
                    'tenant_id': self.azure_credentials.tenant_id,
                    'resource_groups_count': len(resource_groups)
                }
            )
            
        except AzureError as e:
            self.last_health_check = ConnectionHealthCheck(
                platform=Platform.AZURE,
                status=ConnectionHealthStatus.UNHEALTHY,
                response_time_ms=(time.time() - start_time) * 1000,
                error_message=f"Azure Error: {str(e)}"
            )
        except Exception as e:
            self.last_health_check = ConnectionHealthCheck(
                platform=Platform.AZURE,
                status=ConnectionHealthStatus.UNHEALTHY,
                response_time_ms=(time.time() - start_time) * 1000,
                error_message=f"Connection error: {str(e)}"
            )
        
        return self.last_health_check
    
    async def collect_evidence(
        self, 
        evidence_types: List[EvidenceCollectionType],
        framework: Optional[Framework] = None
    ) -> List[EvidenceCollectionResult]:
        """Collect evidence from Azure"""
        results = []
        
        for evidence_type in evidence_types:
            try:
                if evidence_type == EvidenceCollectionType.CONFIGURATIONS:
                    result = await self._collect_resource_groups()
                else:
                    result = EvidenceCollectionResult(
                        platform=Platform.AZURE,
                        collection_type=evidence_type,
                        evidence_count=0,
                        success=False,
                        error_message=f"Evidence type {evidence_type} not supported for Azure"
                    )
                
                results.append(result)
                
            except Exception as e:
                logger.error(f"Error collecting {evidence_type} from Azure: {e}")
                results.append(EvidenceCollectionResult(
                    platform=Platform.AZURE,
                    collection_type=evidence_type,
                    evidence_count=0,
                    success=False,
                    error_message=str(e)
                ))
        
        return results
    
    async def _collect_resource_groups(self) -> EvidenceCollectionResult:
        """Collect Azure resource groups"""
        try:
            credential = self._get_credentials()
            resource_client = ResourceManagementClient(
                credential, 
                self.azure_credentials.subscription_id
            )
            
            resource_groups = list(resource_client.resource_groups.list())
            evidence_items = []
            
            for rg in resource_groups:
                evidence_items.append({
                    'name': rg.name,
                    'location': rg.location,
                    'provisioning_state': rg.provisioning_state,
                    'managed_by': rg.managed_by,
                    'tags': dict(rg.tags) if rg.tags else {}
                })
            
            return EvidenceCollectionResult(
                platform=Platform.AZURE,
                collection_type=EvidenceCollectionType.CONFIGURATIONS,
                evidence_count=len(evidence_items),
                success=True,
                evidence_items=evidence_items
            )
            
        except Exception as e:
            return EvidenceCollectionResult(
                platform=Platform.AZURE,
                collection_type=EvidenceCollectionType.CONFIGURATIONS,
                evidence_count=0,
                success=False,
                error_message=str(e)
            )
    
    async def sync_data(self) -> Dict[str, Any]:
        """Synchronize Azure data"""
        evidence_types = [EvidenceCollectionType.CONFIGURATIONS]
        results = await self.collect_evidence(evidence_types)
        
        return {
            'sync_time': datetime.now(timezone.utc).isoformat(),
            'platform': Platform.AZURE.value,
            'results': [asdict(result) for result in results],
            'total_evidence_collected': sum(r.evidence_count for r in results),
            'successful_collections': len([r for r in results if r.success])
        }

class GitHubClient(BaseCloudClient):
    """GitHub platform client"""
    
    def __init__(self, credentials: GitHubCredentials, encryption_service: EncryptionService):
        super().__init__(credentials, encryption_service)
        self.github_credentials = credentials
        self.headers = {
            'Authorization': f"token {credentials.token}",
            'Accept': 'application/vnd.github.v3+json'
        }
    
    async def test_connection(self) -> ConnectionHealthCheck:
        """Test GitHub connection"""
        start_time = time.time()
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    'https://api.github.com/user',
                    headers=self.headers,
                    timeout=CLOUD_PLATFORM_TIMEOUTS[Platform.GITHUB]
                )
                
                response_time = (time.time() - start_time) * 1000
                
                if response.status_code == 200:
                    user_data = response.json()
                    self.last_health_check = ConnectionHealthCheck(
                        platform=Platform.GITHUB,
                        status=ConnectionHealthStatus.HEALTHY,
                        response_time_ms=response_time,
                        metadata={
                            'login': user_data.get('login'),
                            'type': user_data.get('type'),
                            'company': user_data.get('company'),
                            'public_repos': user_data.get('public_repos'),
                            'private_repos': user_data.get('total_private_repos')
                        }
                    )
                else:
                    self.last_health_check = ConnectionHealthCheck(
                        platform=Platform.GITHUB,
                        status=ConnectionHealthStatus.UNHEALTHY,
                        response_time_ms=response_time,
                        error_message=f"HTTP {response.status_code}: {response.text}"
                    )
                    
        except Exception as e:
            self.last_health_check = ConnectionHealthCheck(
                platform=Platform.GITHUB,
                status=ConnectionHealthStatus.UNHEALTHY,
                response_time_ms=(time.time() - start_time) * 1000,
                error_message=f"Connection error: {str(e)}"
            )
        
        return self.last_health_check
    
    async def collect_evidence(
        self, 
        evidence_types: List[EvidenceCollectionType],
        framework: Optional[Framework] = None
    ) -> List[EvidenceCollectionResult]:
        """Collect evidence from GitHub"""
        results = []
        
        for evidence_type in evidence_types:
            try:
                if evidence_type == EvidenceCollectionType.CONFIGURATIONS:
                    result = await self._collect_repositories()
                elif evidence_type == EvidenceCollectionType.SECURITY_GROUPS:
                    result = await self._collect_branch_protection()
                else:
                    result = EvidenceCollectionResult(
                        platform=Platform.GITHUB,
                        collection_type=evidence_type,
                        evidence_count=0,
                        success=False,
                        error_message=f"Evidence type {evidence_type} not supported for GitHub"
                    )
                
                results.append(result)
                
            except Exception as e:
                logger.error(f"Error collecting {evidence_type} from GitHub: {e}")
                results.append(EvidenceCollectionResult(
                    platform=Platform.GITHUB,
                    collection_type=evidence_type,
                    evidence_count=0,
                    success=False,
                    error_message=str(e)
                ))
        
        return results
    
    async def _collect_repositories(self) -> EvidenceCollectionResult:
        """Collect GitHub repositories"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    'https://api.github.com/user/repos',
                    headers=self.headers,
                    params={'per_page': EVIDENCE_COLLECTION_BATCH_SIZE, 'sort': 'updated'},
                    timeout=CLOUD_PLATFORM_TIMEOUTS[Platform.GITHUB]
                )
                
                if response.status_code == 200:
                    repos = response.json()
                    evidence_items = []
                    
                    for repo in repos:
                        evidence_items.append({
                            'name': repo.get('name'),
                            'full_name': repo.get('full_name'),
                            'private': repo.get('private'),
                            'description': repo.get('description'),
                            'created_at': repo.get('created_at'),
                            'updated_at': repo.get('updated_at'),
                            'language': repo.get('language'),
                            'default_branch': repo.get('default_branch'),
                            'archived': repo.get('archived'),
                            'disabled': repo.get('disabled'),
                            'topics': repo.get('topics', [])
                        })
                    
                    return EvidenceCollectionResult(
                        platform=Platform.GITHUB,
                        collection_type=EvidenceCollectionType.CONFIGURATIONS,
                        evidence_count=len(evidence_items),
                        success=True,
                        evidence_items=evidence_items
                    )
                else:
                    return EvidenceCollectionResult(
                        platform=Platform.GITHUB,
                        collection_type=EvidenceCollectionType.CONFIGURATIONS,
                        evidence_count=0,
                        success=False,
                        error_message=f"GitHub API error: {response.status_code}"
                    )
                    
        except Exception as e:
            return EvidenceCollectionResult(
                platform=Platform.GITHUB,
                collection_type=EvidenceCollectionType.CONFIGURATIONS,
                evidence_count=0,
                success=False,
                error_message=str(e)
            )
    
    async def _collect_branch_protection(self) -> EvidenceCollectionResult:
        """Collect branch protection rules"""
        try:
            # First get repositories
            repos_result = await self._collect_repositories()
            if not repos_result.success:
                return EvidenceCollectionResult(
                    platform=Platform.GITHUB,
                    collection_type=EvidenceCollectionType.SECURITY_GROUPS,
                    evidence_count=0,
                    success=False,
                    error_message="Failed to get repositories for branch protection check"
                )
            
            evidence_items = []
            
            async with httpx.AsyncClient() as client:
                for repo in repos_result.evidence_items[:10]:  # Limit to first 10 repos
                    repo_name = repo['full_name']
                    default_branch = repo.get('default_branch', 'main')
                    
                    try:
                        # Get branch protection for default branch
                        response = await client.get(
                            f'https://api.github.com/repos/{repo_name}/branches/{default_branch}/protection',
                            headers=self.headers,
                            timeout=CLOUD_PLATFORM_TIMEOUTS[Platform.GITHUB]
                        )
                        
                        if response.status_code == 200:
                            protection_data = response.json()
                            evidence_items.append({
                                'repository': repo_name,
                                'branch': default_branch,
                                'protected': True,
                                'protection_rules': protection_data
                            })
                        elif response.status_code == 404:
                            evidence_items.append({
                                'repository': repo_name,
                                'branch': default_branch,
                                'protected': False,
                                'protection_rules': None
                            })
                    except:
                        continue  # Skip repos that error
            
            return EvidenceCollectionResult(
                platform=Platform.GITHUB,
                collection_type=EvidenceCollectionType.SECURITY_GROUPS,
                evidence_count=len(evidence_items),
                success=True,
                evidence_items=evidence_items
            )
            
        except Exception as e:
            return EvidenceCollectionResult(
                platform=Platform.GITHUB,
                collection_type=EvidenceCollectionType.SECURITY_GROUPS,
                evidence_count=0,
                success=False,
                error_message=str(e)
            )
    
    async def sync_data(self) -> Dict[str, Any]:
        """Synchronize GitHub data"""
        evidence_types = [
            EvidenceCollectionType.CONFIGURATIONS,
            EvidenceCollectionType.SECURITY_GROUPS
        ]
        
        results = await self.collect_evidence(evidence_types)
        
        return {
            'sync_time': datetime.now(timezone.utc).isoformat(),
            'platform': Platform.GITHUB.value,
            'results': [asdict(result) for result in results],
            'total_evidence_collected': sum(r.evidence_count for r in results),
            'successful_collections': len([r for r in results if r.success])
        }

# Main Cloud Integration Manager

class CloudIntegrationManager:
    """
    Comprehensive cloud integration management system
    Handles AWS, GCP, Azure, and GitHub integrations with enterprise security
    """
    
    def __init__(self, encryption_service: Optional[EncryptionService] = None):
        self.encryption_service = encryption_service or EncryptionService()
        self.clients: Dict[str, BaseCloudClient] = {}
        self.health_checks: Dict[str, ConnectionHealthCheck] = {}
        self.last_sync_times: Dict[str, datetime] = {}
        
        logger.info("CloudIntegrationManager initialized")
    
    def _create_credentials(self, platform: Platform, raw_credentials: Dict[str, Any]) -> CloudCredentials:
        """Create platform-specific credentials object"""
        created_at = datetime.now(timezone.utc)
        
        if platform == Platform.AWS:
            return AWSCredentials(
                platform=platform,
                access_key_id=raw_credentials['access_key_id'],
                secret_access_key=raw_credentials['secret_access_key'],
                region=raw_credentials.get('region', 'us-east-1'),
                session_token=raw_credentials.get('session_token'),
                created_at=created_at
            )
        elif platform == Platform.GCP:
            return GCPCredentials(
                platform=platform,
                service_account_key=raw_credentials['service_account_key'],
                project_id=raw_credentials['project_id'],
                created_at=created_at
            )
        elif platform == Platform.AZURE:
            return AzureCredentials(
                platform=platform,
                tenant_id=raw_credentials['tenant_id'],
                client_id=raw_credentials['client_id'],
                client_secret=raw_credentials['client_secret'],
                subscription_id=raw_credentials['subscription_id'],
                created_at=created_at
            )
        elif platform == Platform.GITHUB:
            return GitHubCredentials(
                platform=platform,
                token=raw_credentials['token'],
                username=raw_credentials['username'],
                organization=raw_credentials.get('organization'),
                created_at=created_at
            )
        else:
            raise VelocityException(f"Unsupported platform: {platform}")
    
    def _create_client(self, credentials: CloudCredentials) -> BaseCloudClient:
        """Create platform-specific client"""
        if isinstance(credentials, AWSCredentials):
            return AWSClient(credentials, self.encryption_service)
        elif isinstance(credentials, GCPCredentials):
            return GCPClient(credentials, self.encryption_service)
        elif isinstance(credentials, AzureCredentials):
            return AzureClient(credentials, self.encryption_service)
        elif isinstance(credentials, GitHubCredentials):
            return GitHubClient(credentials, self.encryption_service)
        else:
            raise VelocityException(f"Unsupported credentials type: {type(credentials)}")
    
    async def connect_platform(
        self, 
        platform: Platform, 
        credentials: Dict[str, Any],
        integration_id: str,
        test_connection: bool = True
    ) -> Tuple[bool, Optional[str]]:
        """
        Connect to a cloud platform
        
        Args:
            platform: The cloud platform to connect to
            credentials: Platform-specific credentials
            integration_id: Unique integration identifier
            test_connection: Whether to test the connection before saving
            
        Returns:
            Tuple of (success, error_message)
        """
        try:
            # Create credentials object
            creds = self._create_credentials(platform, credentials)
            
            # Create client
            client = self._create_client(creds)
            
            # Test connection if requested
            if test_connection:
                health_check = await client.test_connection()
                if health_check.status != ConnectionHealthStatus.HEALTHY:
                    return False, health_check.error_message
                
                self.health_checks[integration_id] = health_check
            
            # Store client
            self.clients[integration_id] = client
            
            logger.info(f"Successfully connected to {platform.value} for integration {integration_id}")
            return True, None
            
        except Exception as e:
            error_msg = f"Failed to connect to {platform.value}: {str(e)}"
            logger.error(error_msg)
            return False, error_msg
    
    async def test_connection(self, integration_id: str) -> ConnectionHealthCheck:
        """
        Test connection health for an integration
        
        Args:
            integration_id: The integration identifier
            
        Returns:
            ConnectionHealthCheck result
        """
        if integration_id not in self.clients:
            return ConnectionHealthCheck(
                platform=Platform.AWS,  # Default, will be overridden
                status=ConnectionHealthStatus.UNKNOWN,
                response_time_ms=0,
                error_message="Integration not found"
            )
        
        client = self.clients[integration_id]
        health_check = await client.test_connection()
        self.health_checks[integration_id] = health_check
        
        return health_check
    
    async def sync_platform_data(
        self, 
        integration_id: str,
        evidence_types: Optional[List[EvidenceCollectionType]] = None,
        framework: Optional[Framework] = None
    ) -> Dict[str, Any]:
        """
        Sync data from a cloud platform
        
        Args:
            integration_id: The integration identifier
            evidence_types: Specific evidence types to collect
            framework: Compliance framework context
            
        Returns:
            Synchronization results
        """
        if integration_id not in self.clients:
            raise ResourceNotFoundException("Integration", integration_id)
        
        client = self.clients[integration_id]
        
        # Use all available evidence types if none specified
        if evidence_types is None:
            evidence_types = list(EvidenceCollectionType)
        
        try:
            # Perform sync
            sync_result = await client.sync_data()
            self.last_sync_times[integration_id] = datetime.now(timezone.utc)
            
            logger.info(f"Successfully synced data for integration {integration_id}")
            return sync_result
            
        except Exception as e:
            error_msg = f"Failed to sync data for integration {integration_id}: {str(e)}"
            logger.error(error_msg)
            raise VelocityException(error_msg)
    
    async def collect_evidence(
        self,
        integration_id: str,
        evidence_types: List[EvidenceCollectionType],
        framework: Optional[Framework] = None
    ) -> List[EvidenceCollectionResult]:
        """
        Collect specific evidence from a cloud platform
        
        Args:
            integration_id: The integration identifier
            evidence_types: Types of evidence to collect
            framework: Compliance framework context
            
        Returns:
            List of evidence collection results
        """
        if integration_id not in self.clients:
            raise ResourceNotFoundException("Integration", integration_id)
        
        client = self.clients[integration_id]
        return await client.collect_evidence(evidence_types, framework)
    
    async def get_connection_status(self, integration_id: str) -> Dict[str, Any]:
        """
        Get connection status for an integration
        
        Args:
            integration_id: The integration identifier
            
        Returns:
            Connection status information
        """
        if integration_id not in self.clients:
            return {
                'integration_id': integration_id,
                'status': 'not_found',
                'error': 'Integration not found'
            }
        
        client = self.clients[integration_id]
        health_check = self.health_checks.get(integration_id)
        last_sync = self.last_sync_times.get(integration_id)
        
        return {
            'integration_id': integration_id,
            'platform': client.platform.value,
            'status': health_check.status.value if health_check else 'unknown',
            'last_health_check': health_check.last_checked.isoformat() if health_check else None,
            'response_time_ms': health_check.response_time_ms if health_check else None,
            'error_message': health_check.error_message if health_check else None,
            'last_sync': last_sync.isoformat() if last_sync else None,
            'metadata': health_check.metadata if health_check else {}
        }
    
    async def get_all_connection_statuses(self) -> List[Dict[str, Any]]:
        """Get connection status for all integrations"""
        statuses = []
        for integration_id in self.clients.keys():
            status = await self.get_connection_status(integration_id)
            statuses.append(status)
        return statuses
    
    def disconnect_platform(self, integration_id: str) -> bool:
        """
        Disconnect from a cloud platform
        
        Args:
            integration_id: The integration identifier
            
        Returns:
            True if successfully disconnected
        """
        try:
            if integration_id in self.clients:
                del self.clients[integration_id]
            if integration_id in self.health_checks:
                del self.health_checks[integration_id]
            if integration_id in self.last_sync_times:
                del self.last_sync_times[integration_id]
            
            logger.info(f"Successfully disconnected integration {integration_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to disconnect integration {integration_id}: {e}")
            return False
    
    async def perform_health_checks(self) -> Dict[str, ConnectionHealthCheck]:
        """Perform health checks on all connected integrations"""
        health_results = {}
        
        for integration_id, client in self.clients.items():
            try:
                health_check = await client.test_connection()
                health_results[integration_id] = health_check
                self.health_checks[integration_id] = health_check
            except Exception as e:
                health_results[integration_id] = ConnectionHealthCheck(
                    platform=client.platform,
                    status=ConnectionHealthStatus.UNHEALTHY,
                    response_time_ms=0,
                    error_message=f"Health check failed: {str(e)}"
                )
        
        return health_results
    
    def get_supported_evidence_types(self, platform: Platform) -> List[EvidenceCollectionType]:
        """Get supported evidence types for a platform"""
        if platform == Platform.AWS:
            return [
                EvidenceCollectionType.POLICIES,
                EvidenceCollectionType.SECURITY_GROUPS,
                EvidenceCollectionType.ENCRYPTION_STATUS,
                EvidenceCollectionType.AUDIT_LOGS,
                EvidenceCollectionType.COMPLIANCE_RULES
            ]
        elif platform == Platform.GCP:
            return [
                EvidenceCollectionType.POLICIES,
                EvidenceCollectionType.CONFIGURATIONS
            ]
        elif platform == Platform.AZURE:
            return [
                EvidenceCollectionType.CONFIGURATIONS
            ]
        elif platform == Platform.GITHUB:
            return [
                EvidenceCollectionType.CONFIGURATIONS,
                EvidenceCollectionType.SECURITY_GROUPS
            ]
        else:
            return []
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get CloudIntegrationManager statistics"""
        connected_platforms = {}
        for client in self.clients.values():
            platform = client.platform.value
            connected_platforms[platform] = connected_platforms.get(platform, 0) + 1
        
        healthy_connections = sum(
            1 for hc in self.health_checks.values()
            if hc.status == ConnectionHealthStatus.HEALTHY
        )
        
        return {
            'total_integrations': len(self.clients),
            'connected_platforms': connected_platforms,
            'healthy_connections': healthy_connections,
            'unhealthy_connections': len(self.clients) - healthy_connections,
            'last_health_check_times': {
                integration_id: hc.last_checked.isoformat()
                for integration_id, hc in self.health_checks.items()
            },
            'last_sync_times': {
                integration_id: sync_time.isoformat()
                for integration_id, sync_time in self.last_sync_times.items()
            }
        }

# Global instance
cloud_integration_manager = CloudIntegrationManager()