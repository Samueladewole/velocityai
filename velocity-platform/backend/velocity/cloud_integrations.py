"""
Velocity AI Platform - Cloud Integrations Manager
Real cloud platform API integrations for evidence collection
"""
import asyncio
import logging
from typing import Dict, List, Any, Optional
import boto3
from google.cloud import resource_manager
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient
import httpx
import json
from datetime import datetime, timedelta

from models import Platform, IntegrationStatus

logger = logging.getLogger(__name__)

class CloudIntegrationManager:
    """Manages connections to cloud platforms"""
    
    def __init__(self):
        self.aws_clients: Dict[str, Any] = {}
        self.gcp_clients: Dict[str, Any] = {}
        self.azure_clients: Dict[str, Any] = {}
        self.github_clients: Dict[str, Any] = {}
    
    async def test_connection(self, platform: Platform, credentials: Dict[str, Any]) -> bool:
        """Test connection to a cloud platform"""
        try:
            if platform == Platform.AWS:
                return await self._test_aws_connection(credentials)
            elif platform == Platform.GCP:
                return await self._test_gcp_connection(credentials)
            elif platform == Platform.AZURE:
                return await self._test_azure_connection(credentials)
            elif platform == Platform.GITHUB:
                return await self._test_github_connection(credentials)
            else:
                return False
        except Exception as e:
            logger.error(f"Connection test failed for {platform}: {e}")
            return False
    
    async def get_aws_client(self, credentials: Dict[str, Any]) -> 'AWSClient':
        """Get AWS client with credentials"""
        client_key = f"{credentials.get('access_key_id', '')[:8]}"
        
        if client_key not in self.aws_clients:
            self.aws_clients[client_key] = AWSClient(credentials)
        
        return self.aws_clients[client_key]
    
    async def get_gcp_client(self, credentials: Dict[str, Any]) -> 'GCPClient':
        """Get GCP client with credentials"""
        client_key = f"{credentials.get('project_id', '')}"
        
        if client_key not in self.gcp_clients:
            self.gcp_clients[client_key] = GCPClient(credentials)
        
        return self.gcp_clients[client_key]
    
    async def get_azure_client(self, credentials: Dict[str, Any]) -> 'AzureClient':
        """Get Azure client with credentials"""
        client_key = f"{credentials.get('subscription_id', '')[:8]}"
        
        if client_key not in self.azure_clients:
            self.azure_clients[client_key] = AzureClient(credentials)
        
        return self.azure_clients[client_key]
    
    async def get_github_client(self, credentials: Dict[str, Any]) -> 'GitHubClient':
        """Get GitHub client with credentials"""
        client_key = f"{credentials.get('username', '')}"
        
        if client_key not in self.github_clients:
            self.github_clients[client_key] = GitHubClient(credentials)
        
        return self.github_clients[client_key]
    
    async def sync_platform_data(self, integration_id: str):
        """Sync data from a platform integration"""
        # This would be called periodically to sync data
        logger.info(f"Starting data sync for integration {integration_id}")
        # Implementation would depend on the specific platform and data requirements
    
    async def _test_aws_connection(self, credentials: Dict[str, Any]) -> bool:
        """Test AWS connection"""
        try:
            session = boto3.Session(
                aws_access_key_id=credentials.get('access_key_id'),
                aws_secret_access_key=credentials.get('secret_access_key'),
                region_name=credentials.get('region', 'us-east-1')
            )
            
            # Test connection by listing IAM policies
            iam = session.client('iam')
            iam.list_policies(MaxItems=1)
            
            return True
        except Exception as e:
            logger.error(f"AWS connection test failed: {e}")
            return False
    
    async def _test_gcp_connection(self, credentials: Dict[str, Any]) -> bool:
        """Test GCP connection"""
        try:
            # Test with resource manager API
            client = resource_manager.Client()
            projects = list(client.list_projects())
            return True
        except Exception as e:
            logger.error(f"GCP connection test failed: {e}")
            return False
    
    async def _test_azure_connection(self, credentials: Dict[str, Any]) -> bool:
        """Test Azure connection"""
        try:
            credential = DefaultAzureCredential()
            resource_client = ResourceManagementClient(
                credential, 
                credentials.get('subscription_id')
            )
            
            # Test by listing resource groups
            list(resource_client.resource_groups.list())
            return True
        except Exception as e:
            logger.error(f"Azure connection test failed: {e}")
            return False
    
    async def _test_github_connection(self, credentials: Dict[str, Any]) -> bool:
        """Test GitHub connection"""
        try:
            async with httpx.AsyncClient() as client:
                headers = {
                    'Authorization': f"token {credentials.get('token')}",
                    'Accept': 'application/vnd.github.v3+json'
                }
                
                response = await client.get(
                    'https://api.github.com/user',
                    headers=headers
                )
                
                return response.status_code == 200
        except Exception as e:
            logger.error(f"GitHub connection test failed: {e}")
            return False

class AWSClient:
    """AWS API client wrapper"""
    
    def __init__(self, credentials: Dict[str, Any]):
        self.session = boto3.Session(
            aws_access_key_id=credentials.get('access_key_id'),
            aws_secret_access_key=credentials.get('secret_access_key'),
            region_name=credentials.get('region', 'us-east-1')
        )
        
        self.iam = self.session.client('iam')
        self.s3 = self.session.client('s3')
        self.ec2 = self.session.client('ec2')
        self.cloudtrail = self.session.client('cloudtrail')
        self.config = self.session.client('config')
    
    async def list_policies(self) -> List[Dict[str, Any]]:
        """List IAM policies"""
        try:
            response = self.iam.list_policies(MaxItems=20)
            return response.get('Policies', [])
        except Exception as e:
            logger.error(f"Error listing IAM policies: {e}")
            return []
    
    async def get_cloudtrail_events(self, hours: int = 24) -> List[Dict[str, Any]]:
        """Get CloudTrail events from the last N hours"""
        try:
            end_time = datetime.now()
            start_time = end_time - timedelta(hours=hours)
            
            response = self.cloudtrail.lookup_events(
                LookupAttributes=[
                    {
                        'AttributeKey': 'EventName',
                        'AttributeValue': 'ConsoleLogin'
                    }
                ],
                StartTime=start_time,
                EndTime=end_time,
                MaxItems=50
            )
            
            return response.get('Events', [])
        except Exception as e:
            logger.error(f"Error getting CloudTrail events: {e}")
            return []
    
    async def list_s3_buckets(self) -> List[Dict[str, Any]]:
        """List S3 buckets"""
        try:
            response = self.s3.list_buckets()
            return response.get('Buckets', [])
        except Exception as e:
            logger.error(f"Error listing S3 buckets: {e}")
            return []
    
    async def get_bucket_encryption(self, bucket_name: str) -> Dict[str, Any]:
        """Get S3 bucket encryption configuration"""
        try:
            response = self.s3.get_bucket_encryption(Bucket=bucket_name)
            return response.get('ServerSideEncryptionConfiguration', {})
        except Exception as e:
            logger.warning(f"No encryption found for bucket {bucket_name}: {e}")
            return {}
    
    async def describe_security_groups(self) -> List[Dict[str, Any]]:
        """Describe EC2 security groups"""
        try:
            response = self.ec2.describe_security_groups(MaxResults=20)
            return response.get('SecurityGroups', [])
        except Exception as e:
            logger.error(f"Error describing security groups: {e}")
            return []
    
    async def get_config_rules(self) -> List[Dict[str, Any]]:
        """Get AWS Config rules"""
        try:
            response = self.config.describe_config_rules(MaxResults=20)
            return response.get('ConfigRules', [])
        except Exception as e:
            logger.error(f"Error getting Config rules: {e}")
            return []

class GCPClient:
    """GCP API client wrapper"""
    
    def __init__(self, credentials: Dict[str, Any]):
        self.project_id = credentials.get('project_id')
        self.credentials_json = credentials.get('credentials_json')
    
    async def list_projects(self) -> List[Dict[str, Any]]:
        """List GCP projects"""
        try:
            client = resource_manager.Client()
            projects = []
            for project in client.list_projects():
                projects.append({
                    'project_id': project.project_id,
                    'name': project.name,
                    'lifecycle_state': project.lifecycle_state
                })
            return projects
        except Exception as e:
            logger.error(f"Error listing GCP projects: {e}")
            return []
    
    async def get_iam_policies(self) -> List[Dict[str, Any]]:
        """Get IAM policies"""
        # Placeholder - would implement actual GCP IAM API calls
        return []
    
    async def get_cloud_storage_buckets(self) -> List[Dict[str, Any]]:
        """Get Cloud Storage buckets"""
        # Placeholder - would implement actual Cloud Storage API calls
        return []

class AzureClient:
    """Azure API client wrapper"""
    
    def __init__(self, credentials: Dict[str, Any]):
        self.subscription_id = credentials.get('subscription_id')
        self.credential = DefaultAzureCredential()
    
    async def list_resource_groups(self) -> List[Dict[str, Any]]:
        """List Azure resource groups"""
        try:
            resource_client = ResourceManagementClient(
                self.credential, 
                self.subscription_id
            )
            
            groups = []
            for group in resource_client.resource_groups.list():
                groups.append({
                    'name': group.name,
                    'location': group.location,
                    'provisioning_state': group.provisioning_state
                })
            return groups
        except Exception as e:
            logger.error(f"Error listing Azure resource groups: {e}")
            return []
    
    async def get_key_vault_keys(self) -> List[Dict[str, Any]]:
        """Get Key Vault keys"""
        # Placeholder - would implement actual Key Vault API calls
        return []
    
    async def get_security_center_alerts(self) -> List[Dict[str, Any]]:
        """Get Security Center alerts"""
        # Placeholder - would implement actual Security Center API calls
        return []

class GitHubClient:
    """GitHub API client wrapper"""
    
    def __init__(self, credentials: Dict[str, Any]):
        self.token = credentials.get('token')
        self.username = credentials.get('username')
        self.headers = {
            'Authorization': f"token {self.token}",
            'Accept': 'application/vnd.github.v3+json'
        }
    
    async def list_repositories(self) -> List[Dict[str, Any]]:
        """List GitHub repositories"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f'https://api.github.com/user/repos',
                    headers=self.headers,
                    params={'per_page': 20}
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"GitHub API error: {response.status_code}")
                    return []
        except Exception as e:
            logger.error(f"Error listing GitHub repositories: {e}")
            return []
    
    async def get_repository_security_alerts(self, repo_name: str) -> List[Dict[str, Any]]:
        """Get security alerts for a repository"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f'https://api.github.com/repos/{self.username}/{repo_name}/vulnerability-alerts',
                    headers=self.headers
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    return []
        except Exception as e:
            logger.error(f"Error getting security alerts: {e}")
            return []
    
    async def get_branch_protection_rules(self, repo_name: str) -> List[Dict[str, Any]]:
        """Get branch protection rules"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f'https://api.github.com/repos/{self.username}/{repo_name}/branches',
                    headers=self.headers
                )
                
                if response.status_code == 200:
                    branches = response.json()
                    protected_branches = []
                    
                    for branch in branches:
                        if branch.get('protected'):
                            protected_branches.append(branch)
                    
                    return protected_branches
                else:
                    return []
        except Exception as e:
            logger.error(f"Error getting branch protection rules: {e}")
            return []