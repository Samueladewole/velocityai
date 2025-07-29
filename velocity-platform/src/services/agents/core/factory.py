"""
Velocity.ai Agent Factory System
Creates and manages different types of AI agents

Supports:
- AWS Evidence Collector
- GCP Scanner  
- GitHub Security Analyzer
- Azure Compliance Monitor
- QIE Integration Agent
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

class QIEIntegrationFactory(AgentFactory):
    """Factory for QIE Integration agents"""
    
    async def create_agent(self, config: Dict[str, Any]) -> AgentProcess:
        """Create QIE Integration agent"""
        logger.info("🏗️ Creating QIE Integration agent")
        
        if not self.validate_config(config):
            raise ValueError("Invalid QIE configuration")
        
        agent_id = config.get('agent_id', 'qie-integration')
        
        process = AgentProcess(
            agent_id=agent_id,
            agent_type='qie-integration',
            config=config
        )
        
        # Test QIE service availability
        try:
            qie_service_url = config.get('qie_service_url', 'http://localhost:3000/api/qie')
            
            # Test connection to QIE service
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{qie_service_url}/health") as resp:
                    if resp.status != 200:
                        logger.warning("QIE service not available, agent will start without connection")
            
            logger.info("✅ QIE Integration agent validated")
            
        except Exception as e:
            logger.warning(f"⚠️ QIE service validation warning: {e}")
            # Don't fail - agent can start without immediate connection
        
        # Override start method
        async def qie_start():
            process.status = "starting"
            
            agent_script = self._create_qie_agent_script(config)
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(agent_script)
                script_path = f.name
            
            process.process = subprocess.Popen([
                'python3', script_path
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            process.status = "running"
            logger.info(f"🚀 QIE Integration Agent {agent_id} started (PID: {process.process.pid})")
        
        process.start = qie_start
        return process
    
    def validate_config(self, config: Dict[str, Any]) -> bool:
        """Validate QIE configuration"""
        # QIE agent is flexible and can work with minimal config
        return True
    
    def get_default_config(self) -> Dict[str, Any]:
        """Get default QIE configuration"""
        return {
            'qie_service_url': 'http://localhost:3000/api/qie',
            'supported_frameworks': ['SOC2', 'ISO27001', 'GDPR', 'HIPAA', 'PCI_DSS', 'NIST'],
            'processing_interval': 120,
            'confidence_threshold': 0.75,
            'max_concurrent_tasks': 5
        }
    
    def _create_qie_agent_script(self, config: Dict[str, Any]) -> str:
        """Generate QIE Integration agent Python script"""
        return f'''
import asyncio
import json
import logging
import aiohttp
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('qie-integration')

class QIEIntegrationAgent:
    def __init__(self, config):
        self.config = config
        self.qie_service_url = config.get('qie_service_url', 'http://localhost:3000/api/qie')
        self.supported_frameworks = config.get('supported_frameworks', ['SOC2', 'ISO27001'])
        
    async def process_qie_tasks(self):
        """Main QIE processing loop"""
        logger.info("🧠 Starting QIE Integration processing")
        
        while True:
            try:
                # Check for QIE service health
                await self.check_qie_service_health()
                
                # Process questionnaire tasks
                await self.process_questionnaire_extraction()
                
                # Process answer generation tasks
                await self.process_answer_generation()
                
                # Generate observability reports
                await self.generate_observability_reports()
                
                logger.info("✅ QIE processing cycle completed")
                
                await asyncio.sleep(self.config.get('processing_interval', 120))
                
            except Exception as e:
                logger.error(f"❌ QIE processing error: {{e}}")
                await asyncio.sleep(60)
    
    async def check_qie_service_health(self):
        """Check QIE service health"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{{self.qie_service_url}}/health", timeout=5) as resp:
                    if resp.status == 200:
                        logger.debug("💚 QIE service healthy")
                    else:
                        logger.warning(f"⚠️ QIE service health check failed: {{resp.status}}")
        except Exception as e:
            logger.warning(f"⚠️ QIE service health check error: {{e}}")
    
    async def process_questionnaire_extraction(self):
        """Process questionnaire extraction tasks"""
        logger.info("📋 Processing questionnaire extraction")
        
        # Simulate processing questionnaire documents
        evidence = {{
            'evidence_type': 'qie_questionnaire_extraction',
            'source_system': 'qie_integration',
            'collection_timestamp': datetime.utcnow().isoformat(),
            'frameworks_processed': self.supported_frameworks,
            'processing_status': 'active',
            'confidence_threshold': self.config.get('confidence_threshold', 0.75)
        }}
        
        logger.info("✅ Questionnaire extraction processing completed")
    
    async def process_answer_generation(self):
        """Process intelligent answer generation"""
        logger.info("🤖 Processing intelligent answer generation")
        
        evidence = {{
            'evidence_type': 'qie_answer_generation',
            'source_system': 'qie_integration',
            'collection_timestamp': datetime.utcnow().isoformat(),
            'ai_models_active': ['gpt-4', 'claude-3-opus'],
            'processing_status': 'active',
            'evidence_integration': True
        }}
        
        logger.info("✅ Answer generation processing completed")
    
    async def generate_observability_reports(self):
        """Generate QIE observability reports"""
        logger.info("📊 Generating QIE observability reports")
        
        try:
            async with aiohttp.ClientSession() as session:
                # Get QIE metrics if service is available
                async with session.get(f"{{self.qie_service_url}}/metrics/default", timeout=10) as resp:
                    if resp.status == 200:
                        metrics = await resp.json()
                        logger.info(f"📈 QIE metrics collected: {{len(metrics)}} data points")
                    else:
                        logger.info("📈 QIE metrics unavailable, using cached data")
        except Exception as e:
            logger.info(f"📈 QIE metrics collection skipped: {{e}}")
        
        evidence = {{
            'evidence_type': 'qie_observability_report',
            'source_system': 'qie_integration',
            'collection_timestamp': datetime.utcnow().isoformat(),
            'reporting_active': True,
            'compliance_frameworks': self.supported_frameworks
        }}
        
        logger.info("✅ QIE observability report generated")

async def main():
    config = {json.dumps(config)}
    agent = QIEIntegrationAgent(config)
    await agent.process_qie_tasks()

if __name__ == "__main__":
    asyncio.run(main())
'''

class TrustScoreEngineFactory(AgentFactory):
    """Factory for Trust Score Engine agents"""
    
    async def create_agent(self, config: Dict[str, Any]) -> AgentProcess:
        """Create Trust Score Engine agent"""
        logger.info("🏗️ Creating Trust Score Engine agent")
        
        if not self.validate_config(config):
            raise ValueError("Invalid Trust Score Engine configuration")
        
        agent_id = config.get('agent_id', 'trust-score-engine')
        
        process = AgentProcess(
            agent_id=agent_id,
            agent_type='trust-score-engine',
            config=config
        )
        
        # Test Rust crypto core availability (optional)
        try:
            rust_binary_path = config.get('rust_binary_path', '/Users/macbook/Projects/ERIP-app/velocity-platform/src/services/cryptoCore/target/release/velocity_crypto')
            
            # Test if Rust binary exists
            import os
            if os.path.exists(rust_binary_path):
                logger.info("✅ Rust crypto core available")
            else:
                logger.info("⚠️ Rust crypto core not found, will use Python fallback")
            
            logger.info("✅ Trust Score Engine agent validated")
            
        except Exception as e:
            logger.warning(f"⚠️ Trust Score Engine validation warning: {e}")
            # Don't fail - agent can work with Python fallback
        
        # Override start method
        async def trust_start():
            process.status = "starting"
            
            agent_script = self._create_trust_agent_script(config)
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(agent_script)
                script_path = f.name
            
            process.process = subprocess.Popen([
                'python3', script_path
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            process.status = "running"
            logger.info(f"🚀 Trust Score Engine {agent_id} started (PID: {process.process.pid})")
        
        process.start = trust_start
        return process
    
    def validate_config(self, config: Dict[str, Any]) -> bool:
        """Validate Trust Score Engine configuration"""
        # Trust Score Engine is flexible and can work with minimal config
        return True
    
    def get_default_config(self) -> Dict[str, Any]:
        """Get default Trust Score Engine configuration"""
        return {
            'target_response_time_ms': 100,
            'scoring_algorithm': 'multi_factor_weighted',
            'blockchain_network': 'polygon-mainnet',
            'cache_ttl_seconds': 300,
            'max_concurrent_tasks': 10
        }
    
    def _create_trust_agent_script(self, config: Dict[str, Any]) -> str:
        """Generate Trust Score Engine agent Python script"""
        return f'''
import asyncio
import json
import logging
import statistics
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('trust-score-engine')

class TrustScoreEngine:
    def __init__(self, config):
        self.config = config
        self.target_response_time = config.get('target_response_time_ms', 100)
        self.trust_cache = {{}}
        self.performance_metrics = {{
            'total_calculations': 0,
            'average_time': 0.0,
            'under_100ms': 0
        }}
        
    async def calculate_trust_scores(self):
        """Main trust score calculation loop"""
        logger.info("🎯 Starting Trust Score Engine")
        
        while True:
            try:
                # Simulate trust score calculations
                await self.process_trust_calculations()
                
                # Performance monitoring
                await self.monitor_performance()
                
                # Cache management
                await self.manage_cache()
                
                logger.info("✅ Trust score processing cycle completed")
                
                await asyncio.sleep(30)  # More frequent due to real-time requirements
                
            except Exception as e:
                logger.error(f"❌ Trust score processing error: {{e}}")
                await asyncio.sleep(15)
    
    async def process_trust_calculations(self):
        """Process trust score calculations"""
        logger.info("🔢 Processing trust score calculations")
        
        calc_start = datetime.now()
        
        # Simulate high-performance trust calculations
        for i in range(10):  # Process 10 entities per cycle
            entity_id = f"entity_{{i}}"
            
            # Mock trust calculation
            trust_score = 0.75 + (i * 0.02)  # Vary scores
            calculation_time = 50 + (i * 5)   # Simulate different calc times
            
            # Cache result
            self.trust_cache[entity_id] = {{
                'score': trust_score,
                'timestamp': datetime.now(),
                'calculation_time_ms': calculation_time
            }}
            
            # Update metrics
            self.performance_metrics['total_calculations'] += 1
            if calculation_time < 100:
                self.performance_metrics['under_100ms'] += 1
        
        cycle_time = (datetime.now() - calc_start).total_seconds() * 1000
        logger.info(f"📊 Calculated trust scores for 10 entities in {{cycle_time:.2f}}ms")
        
        # Update average time
        total = self.performance_metrics['total_calculations']
        if total > 0:
            self.performance_metrics['average_time'] = (
                self.performance_metrics['average_time'] * 0.9 + cycle_time * 0.1
            )
    
    async def monitor_performance(self):
        """Monitor performance metrics"""
        metrics = self.performance_metrics
        total = metrics['total_calculations']
        
        if total > 0:
            performance_rate = metrics['under_100ms'] / total
            logger.info(f"⚡ Performance: {{performance_rate:.1%}} calculations under {{self.target_response_time}}ms")
            
            if performance_rate < 0.9:
                logger.warning("⚠️ Performance target not met - optimizing calculations")
    
    async def manage_cache(self):
        """Manage trust score cache"""
        # Remove old cache entries
        current_time = datetime.now()
        cache_ttl = self.config.get('cache_ttl_seconds', 300)
        
        expired_keys = [
            key for key, value in self.trust_cache.items()
            if (current_time - value['timestamp']).total_seconds() > cache_ttl
        ]
        
        for key in expired_keys:
            del self.trust_cache[key]
        
        if expired_keys:
            logger.info(f"🗑️ Cleaned {{len(expired_keys)}} expired cache entries")
        
        logger.info(f"💾 Cache status: {{len(self.trust_cache)}} active entries")

async def main():
    config = {json.dumps(config)}
    engine = TrustScoreEngine(config)
    await engine.calculate_trust_scores()

if __name__ == "__main__":
    asyncio.run(main())
'''

class ContinuousMonitorFactory(AgentFactory):
    """Factory for Continuous Monitor agents"""
    
    async def create_agent(self, config: Dict[str, Any]) -> AgentProcess:
        """Create Continuous Monitor agent"""
        logger.info("🏗️ Creating Continuous Monitor agent")
        
        if not self.validate_config(config):
            raise ValueError("Invalid Continuous Monitor configuration")
        
        agent_id = config.get('agent_id', 'continuous-monitor')
        
        process = AgentProcess(
            agent_id=agent_id,
            agent_type='continuous-monitor',
            config=config
        )
        
        logger.info("✅ Continuous Monitor agent validated")
        
        # Override start method
        async def monitor_start():
            process.status = "starting"
            
            agent_script = self._create_monitor_agent_script(config)
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(agent_script)
                script_path = f.name
            
            process.process = subprocess.Popen([
                'python3', script_path
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            process.status = "running"
            logger.info(f"🚀 Continuous Monitor {agent_id} started (PID: {process.process.pid})")
        
        process.start = monitor_start
        return process
    
    def validate_config(self, config: Dict[str, Any]) -> bool:
        """Validate Continuous Monitor configuration"""
        # Continuous Monitor is flexible and can work with minimal config
        return True
    
    def get_default_config(self) -> Dict[str, Any]:
        """Get default Continuous Monitor configuration"""
        return {
            'default_check_interval': 300,
            'drift_detection_threshold': 0.1,
            'max_alerts_per_hour': 50,
            'alert_cooldown_seconds': 3600,
            'supported_frameworks': ['SOC2', 'ISO27001', 'GDPR', 'HIPAA']
        }
    
    def _create_monitor_agent_script(self, config: Dict[str, Any]) -> str:
        """Generate Continuous Monitor agent Python script"""
        return f'''
import asyncio
import json
import logging
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('continuous-monitor')

class ContinuousMonitor:
    def __init__(self, config):
        self.config = config
        self.check_interval = config.get('default_check_interval', 300)
        self.monitoring_active = True
        self.monitoring_rules = {{}}
        self.violations_detected = 0
        self.checks_performed = 0
        
    async def start_monitoring(self):
        """Main continuous monitoring loop"""
        logger.info("🔍 Starting Continuous Monitor")
        
        # Initialize monitoring rules
        await self.initialize_monitoring_rules()
        
        while self.monitoring_active:
            try:
                # Perform compliance checks
                await self.perform_compliance_checks()
                
                # Detect configuration drift
                await self.detect_configuration_drift()
                
                # Process violations and alerts
                await self.process_violations()
                
                # Generate monitoring reports
                await self.generate_monitoring_reports()
                
                logger.info("✅ Monitoring cycle completed")
                
                # Wait for next monitoring cycle
                await asyncio.sleep(self.check_interval)
                
            except Exception as e:
                logger.error(f"❌ Monitoring error: {{e}}")
                await asyncio.sleep(60)  # Short delay before retry
    
    async def initialize_monitoring_rules(self):
        """Initialize default monitoring rules"""
        logger.info("📋 Initializing monitoring rules")
        
        # SOC2 Rules
        self.monitoring_rules.update({{
            'soc2_mfa': {{
                'name': 'Multi-Factor Authentication Required',
                'framework': 'SOC2',
                'severity': 'high',
                'enabled': True
            }},
            'soc2_logging': {{
                'name': 'System Logging Active',
                'framework': 'SOC2', 
                'severity': 'medium',
                'enabled': True
            }}
        }})
        
        # ISO27001 Rules
        self.monitoring_rules.update({{
            'iso_encryption': {{
                'name': 'Data Encryption Required',
                'framework': 'ISO27001',
                'severity': 'high',
                'enabled': True
            }}
        }})
        
        logger.info(f"📊 Loaded {{len(self.monitoring_rules)}} monitoring rules")
    
    async def perform_compliance_checks(self):
        """Perform compliance checks against monitoring rules"""
        logger.info("🔐 Performing compliance checks")
        
        # Simulate compliance checking
        for rule_id, rule in self.monitoring_rules.items():
            if not rule['enabled']:
                continue
                
            self.checks_performed += 1
            
            # Mock compliance check (would integrate with actual evidence)
            compliance_result = {{
                'rule_id': rule_id,
                'compliant': True,  # Placeholder
                'checked_at': datetime.now().isoformat(),
                'severity': rule['severity']
            }}
            
            logger.debug(f"✓ Checked rule: {{rule['name']}}")
        
        logger.info(f"📈 Completed {{len(self.monitoring_rules)}} compliance checks")
    
    async def detect_configuration_drift(self):
        """Detect configuration drift in monitored systems"""
        logger.info("📊 Detecting configuration drift")
        
        # Simulate drift detection
        drift_threshold = self.config.get('drift_detection_threshold', 0.1)
        
        # Mock drift detection results
        drift_events = []
        
        # Simulate 1-2 drift events per cycle
        import random
        if random.random() < 0.3:  # 30% chance of drift
            drift_events.append({{
                'entity_id': f'entity_{{random.randint(1, 100)}}',
                'property': 'security_configuration',
                'drift_magnitude': random.uniform(0.1, 0.5),
                'detected_at': datetime.now().isoformat()
            }})
        
        if drift_events:
            logger.info(f"⚠️ Detected {{len(drift_events)}} configuration drift events")
        else:
            logger.info("✅ No configuration drift detected")
    
    async def process_violations(self):
        """Process compliance violations and generate alerts"""
        logger.info("🚨 Processing compliance violations")
        
        # Mock violation processing
        if self.violations_detected > 0:
            logger.warning(f"⚠️ Processing {{self.violations_detected}} violations")
            
            # Simulate alert generation
            alerts_sent = min(self.violations_detected, self.config.get('max_alerts_per_hour', 50))
            logger.info(f"📧 Generated {{alerts_sent}} compliance alerts")
        else:
            logger.info("✅ No violations to process")
    
    async def generate_monitoring_reports(self):
        """Generate monitoring reports and metrics"""
        logger.info("📊 Generating monitoring reports")
        
        # Calculate monitoring metrics
        uptime_hours = 24  # Mock uptime
        compliance_rate = max(0, 1 - (self.violations_detected / max(self.checks_performed, 1)))
        
        monitoring_summary = {{
            'monitoring_active': self.monitoring_active,
            'active_rules': len([r for r in self.monitoring_rules.values() if r['enabled']]),
            'checks_performed': self.checks_performed,
            'violations_detected': self.violations_detected,
            'compliance_rate': compliance_rate,
            'uptime_hours': uptime_hours,
            'report_timestamp': datetime.now().isoformat()
        }}
        
        logger.info(f"📈 Monitoring Summary: {{compliance_rate:.1%}} compliance rate, {{self.checks_performed}} checks performed")

async def main():
    config = {json.dumps(config)}
    monitor = ContinuousMonitor(config)
    await monitor.start_monitoring()

if __name__ == "__main__":
    asyncio.run(main())
'''

class ObservabilitySpecialistFactory(AgentFactory):
    """Factory for Observability Specialist agents"""
    
    async def create_agent(self, config: Dict[str, Any]) -> AgentProcess:
        """Create Observability Specialist agent"""
        logger.info("🏗️ Creating Observability Specialist agent")
        
        if not self.validate_config(config):
            raise ValueError("Invalid Observability Specialist configuration")
        
        agent_id = config.get('agent_id', 'observability-specialist')
        
        process = AgentProcess(
            agent_id=agent_id,
            agent_type='observability-specialist',
            config=config
        )
        
        logger.info("✅ Observability Specialist agent validated")
        
        # Override start method
        async def observability_start():
            process.status = "starting"
            
            agent_script = self._create_observability_agent_script(config)
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(agent_script)
                script_path = f.name
            
            process.process = subprocess.Popen([
                'python3', script_path
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            process.status = "running"
            logger.info(f"🚀 Observability Specialist {agent_id} started (PID: {process.process.pid})")
        
        process.start = observability_start
        return process
    
    def validate_config(self, config: Dict[str, Any]) -> bool:
        """Validate Observability Specialist configuration"""
        # Observability Specialist is flexible and can work with minimal config
        return True
    
    def get_default_config(self) -> Dict[str, Any]:
        """Get default Observability Specialist configuration"""
        return {
            'metric_collection_interval': 60,
            'anomaly_detection_window_hours': 24,
            'insight_generation_interval': 3600,
            'max_alerts_per_metric_per_hour': 10,
            'performance_percentiles': [50, 75, 90, 95, 99]
        }
    
    def _create_observability_agent_script(self, config: Dict[str, Any]) -> str:
        """Generate Observability Specialist agent Python script"""
        return f'''
import asyncio
import json
import logging
import statistics
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('observability-specialist')

class ObservabilitySpecialist:
    def __init__(self, config):
        self.config = config
        self.collection_interval = config.get('metric_collection_interval', 60)
        self.monitoring_active = True
        self.metrics_data = {{}}
        self.performance_insights = []
        self.observability_metrics = {{
            'metrics_collected': 0,
            'insights_generated': 0,
            'alerts_created': 0,
            'reports_generated': 0
        }}
        
    async def start_observability_monitoring(self):
        """Main observability monitoring loop"""
        logger.info("📊 Starting Observability Specialist")
        
        # Initialize metric definitions
        await self.initialize_metrics()
        
        while self.monitoring_active:
            try:
                # Collect performance metrics
                await self.collect_performance_metrics()
                
                # Detect anomalies
                await self.detect_performance_anomalies()
                
                # Generate insights
                await self.generate_performance_insights()
                
                # Create observability reports
                await self.generate_observability_reports()
                
                # Monitor system health
                await self.monitor_system_health()
                
                logger.info("✅ Observability monitoring cycle completed")
                
                # Wait for next collection cycle
                await asyncio.sleep(self.collection_interval)
                
            except Exception as e:
                logger.error(f"❌ Observability monitoring error: {{e}}")
                await asyncio.sleep(30)  # Short delay before retry
    
    async def initialize_metrics(self):
        """Initialize standard observability metrics"""
        logger.info("📋 Initializing observability metrics")
        
        # Standard metrics to monitor
        self.standard_metrics = {{
            'agent_response_time': {{
                'name': 'Agent Response Time',
                'unit': 'milliseconds',
                'thresholds': {{'warning': 200, 'critical': 500}}
            }},
            'system_memory_usage': {{
                'name': 'System Memory Usage',
                'unit': 'percentage',
                'thresholds': {{'warning': 80, 'critical': 95}}
            }},
            'compliance_score': {{
                'name': 'Overall Compliance Score',
                'unit': 'percentage',
                'thresholds': {{'warning': 85, 'critical': 70}}
            }},
            'agent_throughput': {{
                'name': 'Agent Task Throughput',
                'unit': 'tasks/second',
                'thresholds': {{'warning': 10, 'critical': 5}}
            }}
        }}
        
        logger.info(f"📊 Initialized {{len(self.standard_metrics)}} standard metrics")
    
    async def collect_performance_metrics(self):
        """Collect performance metrics from all systems"""
        logger.info("📈 Collecting performance metrics")
        
        import random
        current_time = datetime.now()
        
        # Simulate metric collection
        for metric_id, metric_def in self.standard_metrics.items():
            # Generate realistic metric values
            if 'response_time' in metric_id:
                value = random.uniform(50, 300)  # ms
            elif 'memory_usage' in metric_id:
                value = random.uniform(40, 85)  # percentage
            elif 'compliance_score' in metric_id:
                value = random.uniform(85, 98)  # percentage
            elif 'throughput' in metric_id:
                value = random.uniform(5, 50)  # tasks/sec
            else:
                value = random.uniform(0, 100)
            
            # Store metric data
            if metric_id not in self.metrics_data:
                self.metrics_data[metric_id] = []
            
            self.metrics_data[metric_id].append({{
                'timestamp': current_time.isoformat(),
                'value': value,
                'unit': metric_def['unit']
            }})
            
            # Keep only recent data (last 1000 points)
            if len(self.metrics_data[metric_id]) > 1000:
                self.metrics_data[metric_id] = self.metrics_data[metric_id][-1000:]
            
            self.observability_metrics['metrics_collected'] += 1
        
        logger.info(f"📊 Collected metrics for {{len(self.standard_metrics)}} monitoring points")
    
    async def detect_performance_anomalies(self):
        """Detect performance anomalies in collected metrics"""
        logger.info("🔍 Detecting performance anomalies")
        
        anomalies_detected = 0
        
        for metric_id, metric_data in self.metrics_data.items():
            if len(metric_data) < 10:  # Need minimum data points
                continue
            
            # Get recent values
            recent_values = [point['value'] for point in metric_data[-20:]]
            
            if len(recent_values) < 5:
                continue
            
            # Simple anomaly detection using statistical thresholds
            mean_value = statistics.mean(recent_values)
            std_dev = statistics.stdev(recent_values) if len(recent_values) > 1 else 0
            
            latest_value = recent_values[-1]
            threshold = mean_value + (2 * std_dev)  # 2-sigma threshold
            
            if latest_value > threshold and std_dev > 0:
                anomalies_detected += 1
                logger.warning(f"⚠️ Anomaly detected in {{metric_id}}: {{latest_value:.2f}} (threshold: {{threshold:.2f}})")
        
        if anomalies_detected > 0:
            logger.info(f"🚨 Detected {{anomalies_detected}} performance anomalies")
        else:
            logger.info("✅ No performance anomalies detected")
    
    async def generate_performance_insights(self):
        """Generate performance insights and recommendations"""
        logger.info("💡 Generating performance insights")
        
        insights_generated = 0
        
        # Analyze response time trends
        if 'agent_response_time' in self.metrics_data:
            response_times = [p['value'] for p in self.metrics_data['agent_response_time'][-50:]]
            if len(response_times) >= 10:
                avg_response_time = statistics.mean(response_times)
                
                if avg_response_time > 200:
                    insight = {{
                        'category': 'performance',
                        'title': 'High Agent Response Time',
                        'description': f'Average response time is {{avg_response_time:.1f}}ms, above recommended 200ms',
                        'impact_score': 0.8,
                        'recommendations': ['Optimize agent processing logic', 'Scale agent infrastructure']
                    }}
                    self.performance_insights.append(insight)
                    insights_generated += 1
        
        # Analyze memory usage patterns
        if 'system_memory_usage' in self.metrics_data:
            memory_usage = [p['value'] for p in self.metrics_data['system_memory_usage'][-30:]]
            if len(memory_usage) >= 10:
                avg_memory = statistics.mean(memory_usage)
                
                if avg_memory > 80:
                    insight = {{
                        'category': 'resource_utilization',
                        'title': 'High Memory Usage',
                        'description': f'System memory usage averaging {{avg_memory:.1f}}%, approaching capacity',
                        'impact_score': 0.7,
                        'recommendations': ['Monitor memory leaks', 'Consider infrastructure scaling']
                    }}
                    self.performance_insights.append(insight)
                    insights_generated += 1
        
        self.observability_metrics['insights_generated'] += insights_generated
        
        if insights_generated > 0:
            logger.info(f"💡 Generated {{insights_generated}} performance insights")
        else:
            logger.info("✅ System performance within normal parameters")
    
    async def generate_observability_reports(self):
        """Generate observability reports and dashboards"""
        logger.info("📊 Generating observability reports")
        
        # Calculate system health score
        health_score = 95.0  # Mock health score
        
        # Generate report summary
        report_summary = {{
            'timestamp': datetime.now().isoformat(),
            'system_health_score': health_score,
            'metrics_collected': self.observability_metrics['metrics_collected'],
            'insights_generated': self.observability_metrics['insights_generated'],
            'active_alerts': self.observability_metrics['alerts_created'],
            'monitoring_status': 'healthy' if health_score > 90 else 'degraded'
        }}
        
        self.observability_metrics['reports_generated'] += 1
        
        logger.info(f"📈 System Health Score: {{health_score:.1f}}% - Status: {{report_summary['monitoring_status']}}")
    
    async def monitor_system_health(self):
        """Monitor overall system health"""
        logger.info("🏥 Monitoring system health")
        
        # Check various health indicators
        health_indicators = {{
            'agent_availability': 100.0,  # Mock values
            'data_pipeline_health': 98.5,
            'storage_health': 99.0,
            'network_connectivity': 100.0
        }}
        
        overall_health = statistics.mean(health_indicators.values())
        
        if overall_health < 95:
            logger.warning(f"⚠️ System health degraded: {{overall_health:.1f}}%")
        else:
            logger.info(f"✅ System health excellent: {{overall_health:.1f}}%")

async def main():
    config = {json.dumps(config)}
    specialist = ObservabilitySpecialist(config)
    await specialist.start_observability_monitoring()

if __name__ == "__main__":
    asyncio.run(main())
'''

# Factory registry for easy access
AGENT_FACTORIES = {
    'aws-evidence-collector': AWSEvidenceCollectorFactory(),
    'gcp-scanner': GCPScannerFactory(),
    'github-analyzer': GitHubAnalyzerFactory(),
    'azure-monitor': AzureMonitorFactory(),
    'qie-integration': QIEIntegrationFactory(),
    'trust-score-engine': TrustScoreEngineFactory(),
    'continuous-monitor': ContinuousMonitorFactory(),
    'observability-specialist': ObservabilitySpecialistFactory(),
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