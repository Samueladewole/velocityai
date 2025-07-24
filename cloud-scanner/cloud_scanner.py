"""
Cloud Environment Scanner
Multi-cloud security and compliance scanning for AWS, Azure, and GCP
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum
import boto3
import azure.identity
import azure.mgmt.resource
import azure.mgmt.security
from google.cloud import asset_v1
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CloudProvider(Enum):
    AWS = "aws"
    AZURE = "azure"
    GCP = "gcp"

class RiskLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class CloudResource:
    id: str
    name: str
    type: str
    region: str
    provider: CloudProvider
    tags: Dict[str, str]
    created_date: datetime
    last_modified: datetime
    compliance_status: Dict[str, bool]
    security_findings: List[Dict[str, Any]]
    risk_level: RiskLevel
    trust_points: int

@dataclass
class ComplianceRule:
    id: str
    name: str
    description: str
    framework: str  # ISO27001, SOC2, GDPR, etc.
    severity: RiskLevel
    check_function: str
    remediation: str
    trust_points_penalty: int

@dataclass
class SecurityFinding:
    id: str
    title: str
    description: str
    severity: RiskLevel
    resource_id: str
    resource_type: str
    provider: CloudProvider
    region: str
    compliance_rules: List[str]
    remediation_steps: List[str]
    trust_points_impact: int
    first_detected: datetime
    last_updated: datetime

class CloudScanner:
    """Multi-cloud security and compliance scanner"""
    
    def __init__(self):
        self.compliance_rules = self._load_compliance_rules()
        self.aws_client = None
        self.azure_credential = None
        self.gcp_client = None
        
    def _load_compliance_rules(self) -> List[ComplianceRule]:
        """Load compliance rules for different frameworks"""
        return [
            ComplianceRule(
                id="aws-s3-public-read",
                name="S3 Bucket Public Read Access",
                description="S3 bucket allows public read access",
                framework="ISO27001",
                severity=RiskLevel.HIGH,
                check_function="check_s3_public_access",
                remediation="Remove public read permissions from S3 bucket policy",
                trust_points_penalty=50
            ),
            ComplianceRule(
                id="aws-ec2-unencrypted-ebs",
                name="Unencrypted EBS Volumes",
                description="EC2 instance has unencrypted EBS volumes",
                framework="SOC2",
                severity=RiskLevel.MEDIUM,
                check_function="check_ebs_encryption",
                remediation="Enable encryption for EBS volumes",
                trust_points_penalty=30
            ),
            ComplianceRule(
                id="azure-vm-no-disk-encryption",
                name="VM Disk Encryption Disabled",
                description="Virtual machine disk encryption is not enabled",
                framework="ISO27001",
                severity=RiskLevel.HIGH,
                check_function="check_azure_disk_encryption",
                remediation="Enable Azure Disk Encryption for virtual machines",
                trust_points_penalty=45
            ),
            ComplianceRule(
                id="gcp-compute-no-shielded-vm",
                name="Compute Instance Without Shielded VM",
                description="Compute instance does not have Shielded VM features enabled",
                framework="SOC2",
                severity=RiskLevel.MEDIUM,
                check_function="check_gcp_shielded_vm",
                remediation="Enable Shielded VM features for compute instances",
                trust_points_penalty=25
            ),
            ComplianceRule(
                id="aws-rds-public-access",
                name="RDS Instance Public Access",
                description="RDS database instance is publicly accessible",
                framework="GDPR",
                severity=RiskLevel.CRITICAL,
                check_function="check_rds_public_access",
                remediation="Disable public accessibility for RDS instances",
                trust_points_penalty=75
            ),
            ComplianceRule(
                id="azure-storage-https-only",
                name="Storage Account HTTPS Only",
                description="Storage account does not enforce HTTPS-only access",
                framework="SOC2",
                severity=RiskLevel.MEDIUM,
                check_function="check_azure_storage_https",
                remediation="Enable 'Secure transfer required' for storage accounts",
                trust_points_penalty=35
            )
        ]
    
    async def initialize_aws(self, access_key: str, secret_key: str, region: str = 'us-east-1'):
        """Initialize AWS clients"""
        try:
            self.aws_session = boto3.Session(
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
                region_name=region
            )
            logger.info("AWS client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize AWS client: {e}")
            raise
    
    async def initialize_azure(self, subscription_id: str):
        """Initialize Azure clients"""
        try:
            self.azure_credential = azure.identity.DefaultAzureCredential()
            self.azure_subscription_id = subscription_id
            logger.info("Azure client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Azure client: {e}")
            raise
    
    async def initialize_gcp(self, project_id: str, service_account_path: str):
        """Initialize GCP clients"""
        try:
            import os
            os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = service_account_path
            self.gcp_project_id = project_id
            logger.info("GCP client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize GCP client: {e}")
            raise
    
    async def scan_aws_environment(self) -> List[CloudResource]:
        """Scan AWS environment for resources and compliance"""
        resources = []
        
        try:
            # Scan EC2 instances
            ec2 = self.aws_session.client('ec2')
            instances = ec2.describe_instances()
            
            for reservation in instances['Reservations']:
                for instance in reservation['Instances']:
                    resource = await self._process_aws_ec2_instance(instance)
                    resources.append(resource)
            
            # Scan S3 buckets
            s3 = self.aws_session.client('s3')
            buckets = s3.list_buckets()
            
            for bucket in buckets['Buckets']:
                resource = await self._process_aws_s3_bucket(bucket, s3)
                resources.append(resource)
            
            # Scan RDS instances
            rds = self.aws_session.client('rds')
            db_instances = rds.describe_db_instances()
            
            for db_instance in db_instances['DBInstances']:
                resource = await self._process_aws_rds_instance(db_instance)
                resources.append(resource)
                
        except Exception as e:
            logger.error(f"Error scanning AWS environment: {e}")
            
        return resources
    
    async def scan_azure_environment(self) -> List[CloudResource]:
        """Scan Azure environment for resources and compliance"""
        resources = []
        
        try:
            # Scan Virtual Machines
            from azure.mgmt.compute import ComputeManagementClient
            compute_client = ComputeManagementClient(
                self.azure_credential, 
                self.azure_subscription_id
            )
            
            vms = compute_client.virtual_machines.list_all()
            for vm in vms:
                resource = await self._process_azure_vm(vm)
                resources.append(resource)
            
            # Scan Storage Accounts
            from azure.mgmt.storage import StorageManagementClient
            storage_client = StorageManagementClient(
                self.azure_credential,
                self.azure_subscription_id
            )
            
            storage_accounts = storage_client.storage_accounts.list()
            for storage_account in storage_accounts:
                resource = await self._process_azure_storage_account(storage_account)
                resources.append(resource)
                
        except Exception as e:
            logger.error(f"Error scanning Azure environment: {e}")
            
        return resources
    
    async def scan_gcp_environment(self) -> List[CloudResource]:
        """Scan GCP environment for resources and compliance"""
        resources = []
        
        try:
            # Scan Compute Instances
            from google.cloud import compute_v1
            instances_client = compute_v1.InstancesClient()
            
            # List all zones and scan instances in each
            zones_client = compute_v1.ZonesClient()
            zones = zones_client.list(project=self.gcp_project_id)
            
            for zone in zones:
                instances = instances_client.list(
                    project=self.gcp_project_id,
                    zone=zone.name
                )
                
                for instance in instances:
                    resource = await self._process_gcp_compute_instance(instance, zone.name)
                    resources.append(resource)
            
            # Scan Cloud Storage buckets
            from google.cloud import storage
            storage_client = storage.Client(project=self.gcp_project_id)
            buckets = storage_client.list_buckets()
            
            for bucket in buckets:
                resource = await self._process_gcp_storage_bucket(bucket)
                resources.append(resource)
                
        except Exception as e:
            logger.error(f"Error scanning GCP environment: {e}")
            
        return resources
    
    async def _process_aws_ec2_instance(self, instance: Dict) -> CloudResource:
        """Process AWS EC2 instance and check compliance"""
        findings = []
        compliance_status = {}
        risk_level = RiskLevel.LOW
        trust_points = 100
        
        # Check EBS encryption
        for block_device in instance.get('BlockDeviceMappings', []):
            if 'Ebs' in block_device:
                encrypted = block_device['Ebs'].get('Encrypted', False)
                if not encrypted:
                    finding = SecurityFinding(
                        id=f"ebs-unencrypted-{instance['InstanceId']}",
                        title="Unencrypted EBS Volume",
                        description="EBS volume is not encrypted",
                        severity=RiskLevel.MEDIUM,
                        resource_id=instance['InstanceId'],
                        resource_type="EC2 Instance",
                        provider=CloudProvider.AWS,
                        region=instance.get('Placement', {}).get('AvailabilityZone', 'unknown'),
                        compliance_rules=["aws-ec2-unencrypted-ebs"],
                        remediation_steps=["Enable encryption for EBS volumes"],
                        trust_points_impact=30,
                        first_detected=datetime.now(),
                        last_updated=datetime.now()
                    )
                    findings.append(asdict(finding))
                    risk_level = RiskLevel.MEDIUM
                    trust_points -= 30
        
        # Check security groups
        for sg in instance.get('SecurityGroups', []):
            # This would typically check for overly permissive rules
            compliance_status[f"security-group-{sg['GroupId']}"] = True
        
        return CloudResource(
            id=instance['InstanceId'],
            name=next((tag['Value'] for tag in instance.get('Tags', []) if tag['Key'] == 'Name'), instance['InstanceId']),
            type="EC2 Instance",
            region=instance.get('Placement', {}).get('AvailabilityZone', 'unknown'),
            provider=CloudProvider.AWS,
            tags={tag['Key']: tag['Value'] for tag in instance.get('Tags', [])},
            created_date=instance.get('LaunchTime', datetime.now()),
            last_modified=datetime.now(),
            compliance_status=compliance_status,
            security_findings=findings,
            risk_level=risk_level,
            trust_points=trust_points
        )
    
    async def _process_aws_s3_bucket(self, bucket: Dict, s3_client) -> CloudResource:
        """Process AWS S3 bucket and check compliance"""
        findings = []
        compliance_status = {}
        risk_level = RiskLevel.LOW
        trust_points = 100
        
        bucket_name = bucket['Name']
        
        try:
            # Check bucket policy for public access
            try:
                bucket_policy = s3_client.get_bucket_policy(Bucket=bucket_name)
                policy = json.loads(bucket_policy['Policy'])
                
                # Simple check for public access (would be more sophisticated in production)
                for statement in policy.get('Statement', []):
                    if statement.get('Principal') == '*':
                        finding = SecurityFinding(
                            id=f"s3-public-access-{bucket_name}",
                            title="S3 Bucket Public Access",
                            description="S3 bucket allows public access",
                            severity=RiskLevel.HIGH,
                            resource_id=bucket_name,
                            resource_type="S3 Bucket",
                            provider=CloudProvider.AWS,
                            region="global",
                            compliance_rules=["aws-s3-public-read"],
                            remediation_steps=["Remove public access from bucket policy"],
                            trust_points_impact=50,
                            first_detected=datetime.now(),
                            last_updated=datetime.now()
                        )
                        findings.append(asdict(finding))
                        risk_level = RiskLevel.HIGH
                        trust_points -= 50
                        
            except s3_client.exceptions.NoSuchBucketPolicy:
                # No bucket policy is generally good
                compliance_status['bucket-policy'] = True
            
            # Check encryption
            try:
                encryption = s3_client.get_bucket_encryption(Bucket=bucket_name)
                compliance_status['encryption'] = True
            except s3_client.exceptions.ClientError:
                compliance_status['encryption'] = False
                if risk_level == RiskLevel.LOW:
                    risk_level = RiskLevel.MEDIUM
                trust_points -= 20
                
        except Exception as e:
            logger.error(f"Error checking S3 bucket {bucket_name}: {e}")
        
        return CloudResource(
            id=bucket_name,
            name=bucket_name,
            type="S3 Bucket",
            region="global",
            provider=CloudProvider.AWS,
            tags={},
            created_date=bucket['CreationDate'],
            last_modified=datetime.now(),
            compliance_status=compliance_status,
            security_findings=findings,
            risk_level=risk_level,
            trust_points=trust_points
        )
    
    async def _process_aws_rds_instance(self, db_instance: Dict) -> CloudResource:
        """Process AWS RDS instance and check compliance"""
        findings = []
        compliance_status = {}
        risk_level = RiskLevel.LOW
        trust_points = 100
        
        # Check public accessibility
        if db_instance.get('PubliclyAccessible', False):
            finding = SecurityFinding(
                id=f"rds-public-{db_instance['DBInstanceIdentifier']}",
                title="RDS Instance Publicly Accessible",
                description="RDS database instance is publicly accessible",
                severity=RiskLevel.CRITICAL,
                resource_id=db_instance['DBInstanceIdentifier'],
                resource_type="RDS Instance",
                provider=CloudProvider.AWS,
                region=db_instance.get('AvailabilityZone', 'unknown'),
                compliance_rules=["aws-rds-public-access"],
                remediation_steps=["Disable public accessibility for RDS instance"],
                trust_points_impact=75,
                first_detected=datetime.now(),
                last_updated=datetime.now()
            )
            findings.append(asdict(finding))
            risk_level = RiskLevel.CRITICAL
            trust_points -= 75
        
        # Check encryption
        if db_instance.get('StorageEncrypted', False):
            compliance_status['encryption'] = True
        else:
            compliance_status['encryption'] = False
            if risk_level == RiskLevel.LOW:
                risk_level = RiskLevel.MEDIUM
            trust_points -= 25
        
        return CloudResource(
            id=db_instance['DBInstanceIdentifier'],
            name=db_instance['DBInstanceIdentifier'],
            type="RDS Instance",
            region=db_instance.get('AvailabilityZone', 'unknown'),
            provider=CloudProvider.AWS,
            tags={tag['Key']: tag['Value'] for tag in db_instance.get('TagList', [])},
            created_date=db_instance.get('InstanceCreateTime', datetime.now()),
            last_modified=datetime.now(),
            compliance_status=compliance_status,
            security_findings=findings,
            risk_level=risk_level,
            trust_points=trust_points
        )
    
    async def _process_azure_vm(self, vm) -> CloudResource:
        """Process Azure VM and check compliance"""
        findings = []
        compliance_status = {}
        risk_level = RiskLevel.LOW
        trust_points = 100
        
        # Check disk encryption (simplified)
        # In a real implementation, this would check Azure Disk Encryption status
        compliance_status['disk-encryption'] = False  # Assuming not encrypted for demo
        
        if not compliance_status['disk-encryption']:
            finding = SecurityFinding(
                id=f"azure-vm-encryption-{vm.name}",
                title="VM Disk Encryption Disabled",
                description="Virtual machine disk encryption is not enabled",
                severity=RiskLevel.HIGH,
                resource_id=vm.name,
                resource_type="Virtual Machine",
                provider=CloudProvider.AZURE,
                region=vm.location,
                compliance_rules=["azure-vm-no-disk-encryption"],
                remediation_steps=["Enable Azure Disk Encryption"],
                trust_points_impact=45,
                first_detected=datetime.now(),
                last_updated=datetime.now()
            )
            findings.append(asdict(finding))
            risk_level = RiskLevel.HIGH
            trust_points -= 45
        
        return CloudResource(
            id=vm.vm_id,
            name=vm.name,
            type="Virtual Machine",
            region=vm.location,
            provider=CloudProvider.AZURE,
            tags=vm.tags or {},
            created_date=datetime.now(),  # Would get from Azure API
            last_modified=datetime.now(),
            compliance_status=compliance_status,
            security_findings=findings,
            risk_level=risk_level,
            trust_points=trust_points
        )
    
    async def _process_azure_storage_account(self, storage_account) -> CloudResource:
        """Process Azure Storage Account and check compliance"""
        findings = []
        compliance_status = {}
        risk_level = RiskLevel.LOW
        trust_points = 100
        
        # Check HTTPS-only enforcement
        https_only = getattr(storage_account, 'enable_https_traffic_only', False)
        compliance_status['https-only'] = https_only
        
        if not https_only:
            finding = SecurityFinding(
                id=f"azure-storage-https-{storage_account.name}",
                title="Storage Account HTTPS Not Enforced",
                description="Storage account does not enforce HTTPS-only access",
                severity=RiskLevel.MEDIUM,
                resource_id=storage_account.name,
                resource_type="Storage Account",
                provider=CloudProvider.AZURE,
                region=storage_account.location,
                compliance_rules=["azure-storage-https-only"],
                remediation_steps=["Enable 'Secure transfer required'"],
                trust_points_impact=35,
                first_detected=datetime.now(),
                last_updated=datetime.now()
            )
            findings.append(asdict(finding))
            risk_level = RiskLevel.MEDIUM
            trust_points -= 35
        
        return CloudResource(
            id=storage_account.name,
            name=storage_account.name,
            type="Storage Account",
            region=storage_account.location,
            provider=CloudProvider.AZURE,
            tags=storage_account.tags or {},
            created_date=datetime.now(),  # Would get from Azure API
            last_modified=datetime.now(),
            compliance_status=compliance_status,
            security_findings=findings,
            risk_level=risk_level,
            trust_points=trust_points
        )
    
    async def _process_gcp_compute_instance(self, instance, zone: str) -> CloudResource:
        """Process GCP Compute Instance and check compliance"""
        findings = []
        compliance_status = {}
        risk_level = RiskLevel.LOW
        trust_points = 100
        
        # Check Shielded VM features
        shielded_instance_config = getattr(instance, 'shielded_instance_config', None)
        if not shielded_instance_config or not shielded_instance_config.enable_secure_boot:
            finding = SecurityFinding(
                id=f"gcp-shielded-vm-{instance.name}",
                title="Shielded VM Features Disabled",
                description="Compute instance does not have Shielded VM features enabled",
                severity=RiskLevel.MEDIUM,
                resource_id=str(instance.id),
                resource_type="Compute Instance",
                provider=CloudProvider.GCP,
                region=zone,
                compliance_rules=["gcp-compute-no-shielded-vm"],
                remediation_steps=["Enable Shielded VM features"],
                trust_points_impact=25,
                first_detected=datetime.now(),
                last_updated=datetime.now()
            )
            findings.append(asdict(finding))
            risk_level = RiskLevel.MEDIUM
            trust_points -= 25
        
        return CloudResource(
            id=str(instance.id),
            name=instance.name,
            type="Compute Instance",
            region=zone,
            provider=CloudProvider.GCP,
            tags=getattr(instance, 'labels', {}) or {},
            created_date=datetime.now(),  # Would parse from GCP timestamp
            last_modified=datetime.now(),
            compliance_status=compliance_status,
            security_findings=findings,
            risk_level=risk_level,
            trust_points=trust_points
        )
    
    async def _process_gcp_storage_bucket(self, bucket) -> CloudResource:
        """Process GCP Storage Bucket and check compliance"""
        findings = []
        compliance_status = {}
        risk_level = RiskLevel.LOW
        trust_points = 100
        
        # Check bucket permissions (simplified)
        # In reality, this would check IAM policies for public access
        compliance_status['public-access'] = True  # Assuming secure for demo
        
        return CloudResource(
            id=bucket.name,
            name=bucket.name,
            type="Storage Bucket",
            region=bucket.location,
            provider=CloudProvider.GCP,
            tags={},
            created_date=bucket.time_created,
            last_modified=bucket.updated,
            compliance_status=compliance_status,
            security_findings=findings,
            risk_level=risk_level,
            trust_points=trust_points
        )
    
    async def generate_compliance_report(self, resources: List[CloudResource]) -> Dict[str, Any]:
        """Generate comprehensive compliance report"""
        total_resources = len(resources)
        critical_findings = sum(1 for r in resources if r.risk_level == RiskLevel.CRITICAL)
        high_findings = sum(1 for r in resources if r.risk_level == RiskLevel.HIGH)
        medium_findings = sum(1 for r in resources if r.risk_level == RiskLevel.MEDIUM)
        
        total_trust_points = sum(r.trust_points for r in resources)
        max_possible_points = total_resources * 100
        trust_score_percentage = (total_trust_points / max_possible_points) * 100 if max_possible_points > 0 else 0
        
        # Framework compliance
        framework_compliance = {}
        for rule in self.compliance_rules:
            framework = rule.framework
            if framework not in framework_compliance:
                framework_compliance[framework] = {'compliant': 0, 'total': 0}
            
            # Count resources that pass this rule
            for resource in resources:
                framework_compliance[framework]['total'] += 1
                # Check if resource has findings for this rule
                has_violation = any(
                    rule.id in finding.get('compliance_rules', [])
                    for finding in resource.security_findings
                )
                if not has_violation:
                    framework_compliance[framework]['compliant'] += 1
        
        # Calculate compliance percentages
        for framework in framework_compliance:
            total = framework_compliance[framework]['total']
            compliant = framework_compliance[framework]['compliant']
            framework_compliance[framework]['percentage'] = (compliant / total * 100) if total > 0 else 0
        
        return {
            'scan_timestamp': datetime.now().isoformat(),
            'summary': {
                'total_resources': total_resources,
                'critical_findings': critical_findings,
                'high_findings': high_findings,
                'medium_findings': medium_findings,
                'trust_score': round(trust_score_percentage, 2),
                'total_trust_points': total_trust_points,
                'max_possible_points': max_possible_points
            },
            'framework_compliance': framework_compliance,
            'resources_by_provider': {
                provider.value: len([r for r in resources if r.provider == provider])
                for provider in CloudProvider
            },
            'risk_distribution': {
                'critical': critical_findings,
                'high': high_findings,
                'medium': medium_findings,
                'low': total_resources - (critical_findings + high_findings + medium_findings)
            },
            'top_findings': sorted([
                finding for resource in resources for finding in resource.security_findings
            ], key=lambda x: x.get('trust_points_impact', 0), reverse=True)[:10],
            'recommendations': self._generate_recommendations(resources)
        }
    
    def _generate_recommendations(self, resources: List[CloudResource]) -> List[Dict[str, Any]]:
        """Generate prioritized remediation recommendations"""
        recommendations = []
        
        # Count findings by type
        finding_counts = {}
        for resource in resources:
            for finding in resource.security_findings:
                finding_title = finding.get('title', 'Unknown')
                if finding_title not in finding_counts:
                    finding_counts[finding_title] = {
                        'count': 0,
                        'total_impact': 0,
                        'example_remediation': finding.get('remediation_steps', [])
                    }
                finding_counts[finding_title]['count'] += 1
                finding_counts[finding_title]['total_impact'] += finding.get('trust_points_impact', 0)
        
        # Sort by total impact
        for finding_title, data in sorted(finding_counts.items(), 
                                        key=lambda x: x[1]['total_impact'], 
                                        reverse=True):
            recommendations.append({
                'title': f"Fix {finding_title}",
                'affected_resources': data['count'],
                'trust_points_gain': data['total_impact'],
                'priority': 'High' if data['total_impact'] > 100 else 'Medium' if data['total_impact'] > 50 else 'Low',
                'remediation_steps': data['example_remediation']
            })
        
        return recommendations[:10]  # Top 10 recommendations

# Example usage and testing functions
async def main():
    """Example usage of the Cloud Scanner"""
    scanner = CloudScanner()
    
    print("🔍 ERIP Cloud Environment Scanner")
    print("=" * 50)
    
    # In a real implementation, these would come from secure configuration
    # await scanner.initialize_aws("your-access-key", "your-secret-key")
    # await scanner.initialize_azure("your-subscription-id")
    # await scanner.initialize_gcp("your-project-id", "path-to-service-account.json")
    
    # For demo purposes, create sample resources
    sample_resources = [
        CloudResource(
            id="i-1234567890abcdef0",
            name="web-server-01",
            type="EC2 Instance",
            region="us-east-1a",
            provider=CloudProvider.AWS,
            tags={"Environment": "Production", "Team": "WebDev"},
            created_date=datetime.now() - timedelta(days=30),
            last_modified=datetime.now(),
            compliance_status={"encryption": False, "security-groups": True},
            security_findings=[{
                'id': 'ebs-unencrypted-i-1234567890abcdef0',
                'title': 'Unencrypted EBS Volume',
                'description': 'EBS volume is not encrypted',
                'severity': 'medium',
                'compliance_rules': ['aws-ec2-unencrypted-ebs'],
                'trust_points_impact': 30
            }],
            risk_level=RiskLevel.MEDIUM,
            trust_points=70
        ),
        CloudResource(
            id="public-bucket-123",
            name="public-bucket-123",
            type="S3 Bucket",
            region="global",
            provider=CloudProvider.AWS,
            tags={"Project": "Marketing"},
            created_date=datetime.now() - timedelta(days=60),
            last_modified=datetime.now(),
            compliance_status={"encryption": True, "public-access": False},
            security_findings=[{
                'id': 's3-public-access-public-bucket-123',
                'title': 'S3 Bucket Public Access',
                'description': 'S3 bucket allows public access',
                'severity': 'high',
                'compliance_rules': ['aws-s3-public-read'],
                'trust_points_impact': 50
            }],
            risk_level=RiskLevel.HIGH,
            trust_points=50
        )
    ]
    
    # Generate compliance report
    report = await scanner.generate_compliance_report(sample_resources)
    
    print(f"📊 Scan Results:")
    print(f"   Total Resources: {report['summary']['total_resources']}")
    print(f"   Trust Score: {report['summary']['trust_score']:.1f}%")
    print(f"   Critical Findings: {report['summary']['critical_findings']}")
    print(f"   High Findings: {report['summary']['high_findings']}")
    print(f"   Medium Findings: {report['summary']['medium_findings']}")
    
    print(f"\n🎯 Framework Compliance:")
    for framework, data in report['framework_compliance'].items():
        print(f"   {framework}: {data['percentage']:.1f}% compliant")
    
    print(f"\n💡 Top Recommendations:")
    for i, rec in enumerate(report['recommendations'][:3], 1):
        print(f"   {i}. {rec['title']} ({rec['affected_resources']} resources, +{rec['trust_points_gain']} Trust Points)")
    
    print(f"\n✅ Cloud Environment Scanning Complete!")
    return report

if __name__ == "__main__":
    asyncio.run(main())