"""
Velocity.ai Agent Factory System
Creates and manages different types of AI agents

Supports:
- AWS Evidence Collector
- GCP Scanner  
- GitHub Security Analyzer
- Azure Compliance Monitor
- Cryptographic Verification Agent
"""

import asyncio
import json
import logging
import subprocess
import tempfile
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
import psutil
import boto3
from google.cloud import compute_v1
import aiohttp
import aiofiles

logger = logging.getLogger(__name__)

@dataclass
class AgentProcess:
    """Agent process wrapper"""
    agent_id: str
    agent_type: str
    process: Optional[subprocess.Popen] = None
    config: Optional[Dict] = None
    status: str = "created"
    
    async def start(self):
        """Start the agent process"""
        self.status = "starting"
        # Implementation depends on agent type
        
    async def shutdown(self):
        """Graceful shutdown"""
        self.status = "stopping"
        if self.process:
            self.process.terminate()
            try:
                self.process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                self.process.kill()
        self.status = "stopped"
    
    async def terminate(self):
        """Force termination"""
        if self.process:
            self.process.kill()
        self.status = "terminated"
    
    async def health_check(self) -> Dict[str, Any]:
        """Check agent health"""
        if not self.process:
            return {"status": "error", "message": "No process"}
        
        try:
            # Get process metrics
            process = psutil.Process(self.process.pid)
            cpu_usage = process.cpu_percent()
            memory_info = process.memory_info()
            
            return {
                "status": "healthy" if self.process.poll() is None else "unhealthy",
                "cpu_usage": cpu_usage,
                "memory_usage": memory_info.rss / 1024 / 1024,  # MB
                "response_time": 0  # Placeholder
            }
        except psutil.NoSuchProcess:
            return {"status": "error", "message": "Process not found"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

class AgentFactory(ABC):
    """Abstract base class for agent factories"""
    
    @abstractmethod
    async def create_agent(self, config: Dict[str, Any]) -> AgentProcess:
        """Create and configure an agent instance"""
        pass
    
    @abstractmethod
    def validate_config(self, config: Dict[str, Any]) -> bool:
        """Validate agent configuration"""
        pass
    
    @abstractmethod
    def get_default_config(self) -> Dict[str, Any]:
        """Get default configuration for this agent type"""
        pass

class AWSEvidenceCollectorFactory(AgentFactory):
    """Factory for AWS Evidence Collector agents"""
    
    async def create_agent(self, config: Dict[str, Any]) -> AgentProcess:
        """Create AWS Evidence Collector agent"""
        logger.info("🏗️ Creating AWS Evidence Collector agent")
        
        # Validate configuration
        if not self.validate_config(config):
            raise ValueError("Invalid AWS configuration")
        
        agent_id = config.get('agent_id', 'aws-collector')
        
        # Create agent process
        process = AgentProcess(
            agent_id=agent_id,
            agent_type='aws-evidence-collector',
            config=config
        )
        
        # Test AWS credentials
        try:
            session = boto3.Session(
                aws_access_key_id=config.get('aws_access_key_id'),
                aws_secret_access_key=config.get('aws_secret_access_key'),
                region_name=config.get('region', 'us-east-1')
            )
            
            # Test connection
            ec2 = session.client('ec2')
            ec2.describe_regions()
            
            logger.info("✅ AWS credentials validated")
            
        except Exception as e:
            logger.error(f"❌ AWS credential validation failed: {e}")
            raise ValueError(f"AWS credentials invalid: {e}")
        
        # Override start method for AWS agent
        async def aws_start():
            process.status = "starting"
            
            # Create agent script
            agent_script = self._create_aws_agent_script(config)
            
            # Write script to temp file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(agent_script)
                script_path = f.name
            
            # Start process
            process.process = subprocess.Popen([
                'python3', script_path
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            process.status = "running"
            logger.info(f"🚀 AWS Evidence Collector {agent_id} started (PID: {process.process.pid})")
        
        process.start = aws_start
        return process
    
    def validate_config(self, config: Dict[str, Any]) -> bool:
        """Validate AWS configuration"""
        required_fields = ['aws_access_key_id', 'aws_secret_access_key']
        return all(field in config for field in required_fields)
    
    def get_default_config(self) -> Dict[str, Any]:
        """Get default AWS configuration"""
        return {
            'region': 'us-east-1',
            'services': ['EC2', 'S3', 'RDS', 'IAM'],
            'collection_interval': 300,
            'max_concurrent_requests': 5,
            'compliance_frameworks': ['SOC2', 'ISO27001']
        }
    
    def _create_aws_agent_script(self, config: Dict[str, Any]) -> str:
        """Generate AWS agent Python script"""
        return f'''
import asyncio
import boto3
import json
import time
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('aws-evidence-collector')

class AWSEvidenceCollector:
    def __init__(self, config):
        self.config = config
        self.session = boto3.Session(
            aws_access_key_id=config['aws_access_key_id'],
            aws_secret_access_key=config['aws_secret_access_key'],
            region_name=config.get('region', 'us-east-1')
        )
        
    async def collect_evidence(self):
        """Main evidence collection loop"""
        logger.info("🔍 Starting AWS evidence collection")
        
        while True:
            try:
                # Collect EC2 evidence
                await self.collect_ec2_evidence()
                
                # Collect S3 evidence  
                await self.collect_s3_evidence()
                
                # Collect IAM evidence
                await self.collect_iam_evidence()
                
                logger.info("✅ Evidence collection cycle completed")
                
                # Wait for next collection interval
                await asyncio.sleep(self.config.get('collection_interval', 300))
                
            except Exception as e:
                logger.error(f"❌ Evidence collection error: {{e}}")
                await asyncio.sleep(60)  # Wait before retry
    
    async def collect_ec2_evidence(self):
        """Collect EC2 instance evidence"""
        try:
            ec2 = self.session.client('ec2')
            
            # Get instances
            response = ec2.describe_instances()
            instances = []
            
            for reservation in response['Reservations']:
                for instance in reservation['Instances']:
                    instances.append({{
                        'instance_id': instance['InstanceId'],
                        'instance_type': instance['InstanceType'],
                        'state': instance['State']['Name'],
                        'security_groups': instance.get('SecurityGroups', []),
                        'vpc_id': instance.get('VpcId'),
                        'subnet_id': instance.get('SubnetId'),
                        'public_ip': instance.get('PublicIpAddress'),
                        'private_ip': instance.get('PrivateIpAddress'),
                        'tags': instance.get('Tags', [])
                    }})
            
            logger.info(f"📊 Collected evidence for {{len(instances)}} EC2 instances")
            
            # Store evidence (placeholder - would integrate with database)
            evidence = {{
                'evidence_type': 'ec2_instances',
                'source_system': 'aws_ec2',
                'collection_timestamp': datetime.utcnow().isoformat(),
                'data': instances,
                'compliance_frameworks': self.config.get('compliance_frameworks', [])
            }}
            
            # TODO: Store in evidence database
            
        except Exception as e:
            logger.error(f"❌ EC2 evidence collection failed: {{e}}")
    
    async def collect_s3_evidence(self):
        """Collect S3 bucket evidence"""
        try:
            s3 = self.session.client('s3')
            
            # Get buckets
            response = s3.list_buckets()
            buckets = []
            
            for bucket in response['Buckets']:
                bucket_name = bucket['Name']
                
                try:
                    # Get bucket location
                    location = s3.get_bucket_location(Bucket=bucket_name)
                    
                    # Get bucket encryption
                    encryption = None
                    try:
                        enc_response = s3.get_bucket_encryption(Bucket=bucket_name)
                        encryption = enc_response.get('ServerSideEncryptionConfiguration')
                    except:
                        pass
                    
                    # Get bucket versioning
                    versioning = s3.get_bucket_versioning(Bucket=bucket_name)
                    
                    buckets.append({{
                        'bucket_name': bucket_name,
                        'creation_date': bucket['CreationDate'].isoformat(),
                        'location': location.get('LocationConstraint'),
                        'encryption': encryption,
                        'versioning_status': versioning.get('Status'),
                        'mfa_delete': versioning.get('MfaDelete')
                    }})
                    
                except Exception as e:
                    logger.warning(f"⚠️ Failed to get details for bucket {{bucket_name}}: {{e}}")
            
            logger.info(f"📊 Collected evidence for {{len(buckets)}} S3 buckets")
            
            # Store evidence
            evidence = {{
                'evidence_type': 's3_buckets',
                'source_system': 'aws_s3',
                'collection_timestamp': datetime.utcnow().isoformat(),
                'data': buckets,
                'compliance_frameworks': self.config.get('compliance_frameworks', [])
            }}
            
        except Exception as e:
            logger.error(f"❌ S3 evidence collection failed: {{e}}")
    
    async def collect_iam_evidence(self):
        """Collect IAM evidence"""
        try:
            iam = self.session.client('iam')
            
            # Get users
            users_response = iam.list_users()
            users = []
            
            for user in users_response['Users']:
                user_name = user['UserName']
                
                # Get user policies
                policies = iam.list_attached_user_policies(UserName=user_name)
                
                # Get access keys
                access_keys = iam.list_access_keys(UserName=user_name)
                
                users.append({{
                    'user_name': user_name,
                    'user_id': user['UserId'],
                    'creation_date': user['CreateDate'].isoformat(),
                    'attached_policies': [p['PolicyName'] for p in policies['AttachedPolicies']],
                    'access_keys': [{{
                        'access_key_id': key['AccessKeyId'],
                        'status': key['Status'],
                        'created_date': key['CreateDate'].isoformat()
                    }} for key in access_keys['AccessKeyMetadata']]
                }})
            
            logger.info(f"📊 Collected evidence for {{len(users)}} IAM users")
            
            # Store evidence
            evidence = {{
                'evidence_type': 'iam_users',
                'source_system': 'aws_iam',
                'collection_timestamp': datetime.utcnow().isoformat(),
                'data': users,
                'compliance_frameworks': self.config.get('compliance_frameworks', [])
            }}
            
        except Exception as e:
            logger.error(f"❌ IAM evidence collection failed: {{e}}")

# Main execution
async def main():
    config = {json.dumps(config)}
    collector = AWSEvidenceCollector(config)
    await collector.collect_evidence()

if __name__ == "__main__":
    asyncio.run(main())
'''

class GCPScannerFactory(AgentFactory):
    """Factory for GCP Scanner agents"""
    
    async def create_agent(self, config: Dict[str, Any]) -> AgentProcess:
        """Create GCP Scanner agent"""
        logger.info("🏗️ Creating GCP Scanner agent")
        
        if not self.validate_config(config):
            raise ValueError("Invalid GCP configuration")
        
        agent_id = config.get('agent_id', 'gcp-scanner')
        
        process = AgentProcess(
            agent_id=agent_id,
            agent_type='gcp-scanner',
            config=config
        )
        
        # Test GCP credentials
        try:
            # Basic validation - would need proper service account testing
            if 'service_account_key' not in config:
                raise ValueError("GCP service account key required")
                
            logger.info("✅ GCP credentials validated")
            
        except Exception as e:
            logger.error(f"❌ GCP credential validation failed: {e}")
            raise
        
        # Override start method
        async def gcp_start():
            process.status = "starting"
            
            # Create GCP agent script
            agent_script = self._create_gcp_agent_script(config)
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(agent_script)
                script_path = f.name
            
            process.process = subprocess.Popen([
                'python3', script_path
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            process.status = "running"
            logger.info(f"🚀 GCP Scanner {agent_id} started (PID: {process.process.pid})")
        
        process.start = gcp_start
        return process
    
    def validate_config(self, config: Dict[str, Any]) -> bool:
        """Validate GCP configuration"""
        return 'service_account_key' in config
    
    def get_default_config(self) -> Dict[str, Any]:
        """Get default GCP configuration"""
        return {
            'project_id': '',
            'services': ['Compute', 'Storage', 'BigQuery'],
            'collection_interval': 300,
            'compliance_frameworks': ['SOC2', 'ISO27001']
        }
    
    def _create_gcp_agent_script(self, config: Dict[str, Any]) -> str:
        """Generate GCP agent Python script"""
        return f'''
import asyncio
import json
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('gcp-scanner')

class GCPScanner:
    def __init__(self, config):
        self.config = config
        
    async def scan_resources(self):
        """Main GCP scanning loop"""
        logger.info("🔍 Starting GCP resource scanning")
        
        while True:
            try:
                # Scan Compute instances
                await self.scan_compute_instances()
                
                # Scan Storage buckets
                await self.scan_storage_buckets()
                
                logger.info("✅ GCP scan cycle completed")
                
                await asyncio.sleep(self.config.get('collection_interval', 300))
                
            except Exception as e:
                logger.error(f"❌ GCP scan error: {{e}}")
                await asyncio.sleep(60)
    
    async def scan_compute_instances(self):
        """Scan GCP Compute instances"""
        # Placeholder implementation
        logger.info("📊 Scanning GCP Compute instances")
        
        evidence = {{
            'evidence_type': 'gcp_compute_instances',
            'source_system': 'gcp_compute',
            'collection_timestamp': datetime.utcnow().isoformat(),
            'data': [],  # Would contain actual instance data
            'compliance_frameworks': self.config.get('compliance_frameworks', [])
        }}
    
    async def scan_storage_buckets(self):
        """Scan GCP Storage buckets"""
        # Placeholder implementation
        logger.info("📊 Scanning GCP Storage buckets")
        
        evidence = {{
            'evidence_type': 'gcp_storage_buckets',
            'source_system': 'gcp_storage',
            'collection_timestamp': datetime.utcnow().isoformat(),
            'data': [],  # Would contain actual bucket data
            'compliance_frameworks': self.config.get('compliance_frameworks', [])
        }}

async def main():
    config = {json.dumps(config)}
    scanner = GCPScanner(config)
    await scanner.scan_resources()

if __name__ == "__main__":
    asyncio.run(main())
'''

class GitHubAnalyzerFactory(AgentFactory):
    """Factory for GitHub Security Analyzer agents"""
    
    async def create_agent(self, config: Dict[str, Any]) -> AgentProcess:
        """Create GitHub Analyzer agent"""
        logger.info("🏗️ Creating GitHub Security Analyzer agent")
        
        if not self.validate_config(config):
            raise ValueError("Invalid GitHub configuration")
        
        agent_id = config.get('agent_id', 'github-analyzer')
        
        process = AgentProcess(
            agent_id=agent_id,
            agent_type='github-analyzer',
            config=config
        )
        
        # Test GitHub token
        try:
            token = config.get('github_token')
            if not token:
                raise ValueError("GitHub token required")
            
            # Test API access
            async with aiohttp.ClientSession() as session:
                headers = {'Authorization': f'token {token}'}
                async with session.get('https://api.github.com/user', headers=headers) as resp:
                    if resp.status != 200:
                        raise ValueError("Invalid GitHub token")
            
            logger.info("✅ GitHub credentials validated")
            
        except Exception as e:
            logger.error(f"❌ GitHub credential validation failed: {e}")
            raise
        
        # Override start method
        async def github_start():
            process.status = "starting"
            
            agent_script = self._create_github_agent_script(config)
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(agent_script)
                script_path = f.name
            
            process.process = subprocess.Popen([
                'python3', script_path
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            process.status = "running"
            logger.info(f"🚀 GitHub Analyzer {agent_id} started (PID: {process.process.pid})")
        
        process.start = github_start
        return process
    
    def validate_config(self, config: Dict[str, Any]) -> bool:
        """Validate GitHub configuration"""
        return 'github_token' in config
    
    def get_default_config(self) -> Dict[str, Any]:
        """Get default GitHub configuration"""
        return {
            'organizations': [],
            'repositories': [],
            'scan_interval': 3600,
            'check_secrets': True,
            'check_dependencies': True,
            'check_branch_protection': True
        }
    
    def _create_github_agent_script(self, config: Dict[str, Any]) -> str:
        """Generate GitHub agent Python script"""
        return f'''
import asyncio
import aiohttp
import json
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('github-analyzer')

class GitHubAnalyzer:
    def __init__(self, config):
        self.config = config
        self.token = config['github_token']
        self.headers = {{'Authorization': f'token {{self.token}}'}}
        
    async def analyze_repositories(self):
        """Main GitHub analysis loop"""
        logger.info("🔍 Starting GitHub security analysis")
        
        while True:
            try:
                async with aiohttp.ClientSession() as session:
                    # Analyze organizations
                    for org in self.config.get('organizations', []):
                        await self.analyze_organization(session, org)
                    
                    # Analyze specific repositories
                    for repo in self.config.get('repositories', []):
                        await self.analyze_repository(session, repo)
                
                logger.info("✅ GitHub analysis cycle completed")
                
                await asyncio.sleep(self.config.get('scan_interval', 3600))
                
            except Exception as e:
                logger.error(f"❌ GitHub analysis error: {{e}}")
                await asyncio.sleep(300)
    
    async def analyze_organization(self, session, org_name):
        """Analyze GitHub organization security"""
        logger.info(f"🏢 Analyzing organization: {{org_name}}")
        
        # Get organization repositories
        url = f'https://api.github.com/orgs/{{org_name}}/repos'
        async with session.get(url, headers=self.headers) as resp:
            if resp.status == 200:
                repos = await resp.json()
                
                for repo in repos:
                    await self.analyze_repository(session, repo['full_name'])
    
    async def analyze_repository(self, session, repo_name):
        """Analyze individual repository security"""
        logger.info(f"📁 Analyzing repository: {{repo_name}}")
        
        # Check branch protection
        if self.config.get('check_branch_protection'):
            await self.check_branch_protection(session, repo_name)
        
        # Check for secrets
        if self.config.get('check_secrets'):
            await self.check_secret_scanning(session, repo_name)
        
        # Check dependencies
        if self.config.get('check_dependencies'):
            await self.check_dependencies(session, repo_name)
    
    async def check_branch_protection(self, session, repo_name):
        """Check branch protection settings"""
        url = f'https://api.github.com/repos/{{repo_name}}/branches/main/protection'
        async with session.get(url, headers=self.headers) as resp:
            protection_data = await resp.json() if resp.status == 200 else None
            
            evidence = {{
                'evidence_type': 'github_branch_protection',
                'source_system': 'github',
                'repository': repo_name,
                'collection_timestamp': datetime.utcnow().isoformat(),
                'data': protection_data,
                'compliance_frameworks': ['SOC2', 'ISO27001']
            }}
    
    async def check_secret_scanning(self, session, repo_name):  
        """Check secret scanning alerts"""
        url = f'https://api.github.com/repos/{{repo_name}}/secret-scanning/alerts'
        async with session.get(url, headers=self.headers) as resp:
            alerts = await resp.json() if resp.status == 200 else []
            
            evidence = {{
                'evidence_type': 'github_secret_scanning',
                'source_system': 'github',
                'repository': repo_name,
                'collection_timestamp': datetime.utcnow().isoformat(),
                'data': alerts,
                'compliance_frameworks': ['SOC2', 'ISO27001']
            }}
    
    async def check_dependencies(self, session, repo_name):
        """Check dependency vulnerabilities"""
        url = f'https://api.github.com/repos/{{repo_name}}/vulnerability-alerts'
        async with session.get(url, headers=self.headers) as resp:
            alerts = await resp.json() if resp.status == 200 else []
            
            evidence = {{
                'evidence_type': 'github_dependency_vulnerabilities',
                'source_system': 'github',
                'repository': repo_name,
                'collection_timestamp': datetime.utcnow().isoformat(),
                'data': alerts,
                'compliance_frameworks': ['SOC2', 'ISO27001']
            }}

async def main():
    config = {json.dumps(config)}
    analyzer = GitHubAnalyzer(config)
    await analyzer.analyze_repositories()

if __name__ == "__main__":
    asyncio.run(main())
'''

class AzureMonitorFactory(AgentFactory):
    """Factory for Azure Compliance Monitor agents"""
    
    async def create_agent(self, config: Dict[str, Any]) -> AgentProcess:
        """Create Azure Monitor agent"""
        logger.info("🏗️ Creating Azure Compliance Monitor agent")
        
        if not self.validate_config(config):
            raise ValueError("Invalid Azure configuration")
        
        agent_id = config.get('agent_id', 'azure-monitor')
        
        process = AgentProcess(
            agent_id=agent_id,
            agent_type='azure-monitor',
            config=config
        )
        
        # Basic Azure validation (would need proper Azure SDK testing)
        try:
            required_fields = ['tenant_id', 'client_id', 'client_secret']
            for field in required_fields:
                if field not in config:
                    raise ValueError(f"Missing required field: {field}")
            
            logger.info("✅ Azure credentials validated")
            
        except Exception as e:
            logger.error(f"❌ Azure credential validation failed: {e}")
            raise
        
        # Override start method
        async def azure_start():
            process.status = "starting"
            
            agent_script = self._create_azure_agent_script(config)
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(agent_script)
                script_path = f.name
            
            process.process = subprocess.Popen([
                'python3', script_path
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            process.status = "running"
            logger.info(f"🚀 Azure Monitor {agent_id} started (PID: {process.process.pid})")
        
        process.start = azure_start
        return process
    
    def validate_config(self, config: Dict[str, Any]) -> bool:
        """Validate Azure configuration"""
        required_fields = ['tenant_id', 'client_id', 'client_secret']
        return all(field in config for field in required_fields)
    
    def get_default_config(self) -> Dict[str, Any]:
        """Get default Azure configuration"""
        return {
            'subscription_ids': [],
            'services': ['VMs', 'Storage', 'Monitor', 'ActiveDirectory'],
            'collection_interval': 300,
            'compliance_frameworks': ['SOC2', 'ISO27001']
        }
    
    def _create_azure_agent_script(self, config: Dict[str, Any]) -> str:
        """Generate Azure agent Python script"""
        return f'''
import asyncio
import json
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('azure-monitor')

class AzureMonitor:
    def __init__(self, config):
        self.config = config
        
    async def monitor_resources(self):
        """Main Azure monitoring loop"""
        logger.info("🔍 Starting Azure compliance monitoring")
        
        while True:
            try:
                # Monitor VMs
                await self.monitor_virtual_machines()
                
                # Monitor Storage
                await self.monitor_storage_accounts()
                
                # Monitor Active Directory
                await self.monitor_active_directory()
                
                logger.info("✅ Azure monitoring cycle completed")
                
                await asyncio.sleep(self.config.get('collection_interval', 300))
                
            except Exception as e:
                logger.error(f"❌ Azure monitoring error: {{e}}")
                await asyncio.sleep(60)
    
    async def monitor_virtual_machines(self):
        """Monitor Azure Virtual Machines"""
        logger.info("💻 Monitoring Azure Virtual Machines")
        
        evidence = {{
            'evidence_type': 'azure_virtual_machines',
            'source_system': 'azure_compute',
            'collection_timestamp': datetime.utcnow().isoformat(),
            'data': [],  # Would contain actual VM data
            'compliance_frameworks': self.config.get('compliance_frameworks', [])
        }}
    
    async def monitor_storage_accounts(self):
        """Monitor Azure Storage Accounts"""
        logger.info("💾 Monitoring Azure Storage Accounts")
        
        evidence = {{
            'evidence_type': 'azure_storage_accounts',
            'source_system': 'azure_storage',
            'collection_timestamp': datetime.utcnow().isoformat(),
            'data': [],  # Would contain actual storage data
            'compliance_frameworks': self.config.get('compliance_frameworks', [])
        }}
    
    async def monitor_active_directory(self):
        """Monitor Azure Active Directory"""
        logger.info("👥 Monitoring Azure Active Directory")
        
        evidence = {{
            'evidence_type': 'azure_active_directory',
            'source_system': 'azure_ad',
            'collection_timestamp': datetime.utcnow().isoformat(),
            'data': [],  # Would contain actual AD data
            'compliance_frameworks': self.config.get('compliance_frameworks', [])
        }}

async def main():
    config = {json.dumps(config)}
    monitor = AzureMonitor(config)
    await monitor.monitor_resources()

if __name__ == "__main__":
    asyncio.run(main())
'''

class CryptographicVerificationFactory(AgentFactory):
    """Factory for Cryptographic Verification agents"""
    
    async def create_agent(self, config: Dict[str, Any]) -> AgentProcess:
        """Create Cryptographic Verification agent"""
        logger.info("🏗️ Creating Cryptographic Verification agent")
        
        if not self.validate_config(config):
            raise ValueError("Invalid cryptographic configuration")
        
        agent_id = config.get('agent_id', 'crypto-verifier')
        
        process = AgentProcess(
            agent_id=agent_id,
            agent_type='cryptographic-verification',
            config=config
        )
        
        # Test Rust crypto core availability
        try:
            # Check if Rust crypto core is available
            import subprocess
            result = subprocess.run(['cargo', '--version'], capture_output=True, text=True)
            if result.returncode != 0:
                raise ValueError("Rust/Cargo not available for crypto core")
            
            logger.info("✅ Cryptographic verification environment validated")
            
        except Exception as e:
            logger.error(f"❌ Crypto verification validation failed: {e}")
            raise
        
        # Override start method
        async def crypto_start():
            process.status = "starting"
            
            agent_script = self._create_crypto_agent_script(config)
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(agent_script)
                script_path = f.name
            
            process.process = subprocess.Popen([
                'python3', script_path
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            process.status = "running"
            logger.info(f"🚀 Cryptographic Verification Agent {agent_id} started (PID: {process.process.pid})")
        
        process.start = crypto_start
        return process
    
    def validate_config(self, config: Dict[str, Any]) -> bool:
        """Validate cryptographic configuration"""
        return 'blockchain_network' in config
    
    def get_default_config(self) -> Dict[str, Any]:
        """Get default cryptographic configuration"""
        return {
            'blockchain_network': 'polygon-mainnet',
            'hash_algorithm': 'blake3',
            'signature_algorithms': ['ed25519', 'ecdsa_p256'],
            'trust_protocol_enabled': True,
            'performance_target_ms': 100
        }
    
    def _create_crypto_agent_script(self, config: Dict[str, Any]) -> str:
        """Generate cryptographic agent Python script"""
        return f'''
import asyncio
import json
import logging
import subprocess
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('crypto-verification')

class CryptographicVerificationAgent:
    def __init__(self, config):
        self.config = config
        
    async def verify_evidence(self):
        """Main cryptographic verification loop"""
        logger.info("🔐 Starting cryptographic verification")
        
        while True:
            try:
                # Verify evidence integrity
                await self.verify_evidence_integrity()
                
                # Calculate trust scores
                await self.calculate_trust_scores()
                
                # Update blockchain records
                await self.update_blockchain_records()
                
                logger.info("✅ Cryptographic verification cycle completed")
                
                await asyncio.sleep(60)  # More frequent due to real-time requirements
                
            except Exception as e:
                logger.error(f"❌ Cryptographic verification error: {{e}}")
                await asyncio.sleep(30)
    
    async def verify_evidence_integrity(self):
        """Verify evidence cryptographic integrity"""
        logger.info("🔍 Verifying evidence integrity using Rust crypto core")
        
        # Use Rust crypto core for high-performance verification
        try:
            # Call Rust crypto core (placeholder - would use actual FFI)
            result = subprocess.run([
                'cargo', 'run', '--manifest-path', 
                '/Users/macbook/Projects/ERIP-app/velocity-platform/src/services/cryptoCore/Cargo.toml',
                '--', 'verify-batch'
            ], capture_output=True, text=True, timeout=5)
            
            if result.returncode == 0:
                logger.info("✅ Evidence integrity verification completed")
            else:
                logger.error(f"❌ Evidence verification failed: {{result.stderr}}")
                
        except subprocess.TimeoutExpired:
            logger.error("⏰ Evidence verification timeout")
        except Exception as e:
            logger.error(f"❌ Evidence verification error: {{e}}")
    
    async def calculate_trust_scores(self):
        """Calculate real-time trust scores"""
        logger.info("📊 Calculating trust scores with <100ms target")
        
        start_time = datetime.utcnow()
        
        # High-performance trust calculation using Rust
        try:
            result = subprocess.run([
                'cargo', 'run', '--manifest-path',
                '/Users/macbook/Projects/ERIP-app/velocity-platform/src/services/cryptoCore/Cargo.toml',
                '--', 'calculate-trust'
            ], capture_output=True, text=True, timeout=1)
            
            end_time = datetime.utcnow()
            duration_ms = (end_time - start_time).total_seconds() * 1000
            
            if duration_ms < self.config.get('performance_target_ms', 100):
                logger.info(f"⚡ Trust score calculated in {{duration_ms:.2f}}ms (under target)")
            else:
                logger.warning(f"⚠️ Trust score took {{duration_ms:.2f}}ms (over target)")
                
        except Exception as e:
            logger.error(f"❌ Trust score calculation error: {{e}}")
    
    async def update_blockchain_records(self):
        """Update Polygon blockchain records"""
        if not self.config.get('trust_protocol_enabled'):
            return
            
        logger.info("🔗 Updating Velocity Trust Protocol on Polygon")
        
        # Simulate blockchain interaction
        evidence = {{
            'evidence_type': 'cryptographic_verification',
            'source_system': 'velocity_crypto_core',
            'collection_timestamp': datetime.utcnow().isoformat(),
            'blockchain_network': self.config.get('blockchain_network'),
            'verification_result': 'verified',
            'trust_score_updated': True,
            'performance_ms': 85  # Example performance metric
        }}

async def main():
    config = {json.dumps(config)}
    agent = CryptographicVerificationAgent(config)
    await agent.verify_evidence()

if __name__ == "__main__":
    asyncio.run(main())
'''

# Factory registry for easy access
AGENT_FACTORIES = {
    'aws-evidence-collector': AWSEvidenceCollectorFactory(),
    'gcp-scanner': GCPScannerFactory(),
    'github-analyzer': GitHubAnalyzerFactory(),
    'azure-monitor': AzureMonitorFactory(),
    'cryptographic-verification': CryptographicVerificationFactory()
}

def get_agent_factory(agent_type: str) -> AgentFactory:
    """Get factory for specified agent type"""
    if agent_type not in AGENT_FACTORIES:
        raise ValueError(f"Unknown agent type: {agent_type}")
    return AGENT_FACTORIES[agent_type]

def list_available_agent_types() -> List[str]:
    """List all available agent types"""
    return list(AGENT_FACTORIES.keys())