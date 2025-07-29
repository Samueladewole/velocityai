import boto3
from typing import Dict, List, Any, Optional
import json
from datetime import datetime
import asyncio
from concurrent.futures import ThreadPoolExecutor
import structlog
from ..core.celery_app import app
from ..tasks.browser_tasks import capture_evidence

logger = structlog.get_logger()

class AWSEvidenceCollector:
    """High-performance AWS evidence collection"""
    
    def __init__(self, access_key_id: str, secret_access_key: str, region: str = 'us-east-1'):
        self.session = boto3.Session(
            aws_access_key_id=access_key_id,
            aws_secret_access_key=secret_access_key,
            region_name=region
        )
        self.executor = ThreadPoolExecutor(max_workers=10)
    
    async def collect_all_evidence(self, customer_id: str, framework_id: str) -> Dict[str, Any]:
        """Collect all AWS evidence in parallel"""
        
        tasks = [
            self.collect_iam_evidence(customer_id, framework_id),
            self.collect_s3_evidence(customer_id, framework_id),
            self.collect_cloudtrail_evidence(customer_id, framework_id),
            self.collect_ec2_evidence(customer_id, framework_id),
            self.collect_rds_evidence(customer_id, framework_id),
            self.collect_lambda_evidence(customer_id, framework_id),
            self.collect_cloudwatch_evidence(customer_id, framework_id),
            self.collect_config_evidence(customer_id, framework_id)
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return {
            'iam': results[0] if not isinstance(results[0], Exception) else {'error': str(results[0])},
            's3': results[1] if not isinstance(results[1], Exception) else {'error': str(results[1])},
            'cloudtrail': results[2] if not isinstance(results[2], Exception) else {'error': str(results[2])},
            'ec2': results[3] if not isinstance(results[3], Exception) else {'error': str(results[3])},
            'rds': results[4] if not isinstance(results[4], Exception) else {'error': str(results[4])},
            'lambda': results[5] if not isinstance(results[5], Exception) else {'error': str(results[5])},
            'cloudwatch': results[6] if not isinstance(results[6], Exception) else {'error': str(results[6])},
            'config': results[7] if not isinstance(results[7], Exception) else {'error': str(results[7])}
        }
    
    async def collect_iam_evidence(self, customer_id: str, framework_id: str) -> Dict[str, Any]:
        """Collect IAM evidence efficiently"""
        
        loop = asyncio.get_event_loop()
        iam = self.session.client('iam')
        
        # Collect in parallel
        tasks = [
            loop.run_in_executor(self.executor, iam.get_account_password_policy),
            loop.run_in_executor(self.executor, iam.list_users),
            loop.run_in_executor(self.executor, iam.list_roles),
            loop.run_in_executor(self.executor, iam.list_policies, {'Scope': 'Local'}),
            loop.run_in_executor(self.executor, iam.get_account_summary),
            loop.run_in_executor(self.executor, iam.list_virtual_mfa_devices)
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        evidence = {
            'password_policy': self._extract_password_policy(results[0]),
            'users': self._extract_users_with_mfa(results[1], results[5]),
            'roles': self._extract_roles(results[2]),
            'policies': self._extract_policies(results[3]),
            'account_summary': results[4].get('SummaryMap', {}) if not isinstance(results[4], Exception) else {},
            'mfa_compliance': self._calculate_mfa_compliance(results[1], results[5])
        }
        
        # Map to compliance controls
        return self._map_iam_to_controls(evidence, framework_id)
    
    def _extract_password_policy(self, response: Any) -> Dict[str, Any]:
        """Extract password policy details"""
        if isinstance(response, Exception):
            return {'exists': False, 'error': str(response)}
        
        policy = response.get('PasswordPolicy', {})
        return {
            'exists': True,
            'minimum_length': policy.get('MinimumPasswordLength', 0),
            'require_uppercase': policy.get('RequireUppercaseCharacters', False),
            'require_lowercase': policy.get('RequireLowercaseCharacters', False),
            'require_numbers': policy.get('RequireNumbers', False),
            'require_symbols': policy.get('RequireSymbols', False),
            'max_age_days': policy.get('MaxPasswordAge', 0),
            'password_reuse_prevention': policy.get('PasswordReusePrevention', 0),
            'compliant': self._is_password_policy_compliant(policy)
        }
    
    def _is_password_policy_compliant(self, policy: Dict) -> bool:
        """Check if password policy meets compliance standards"""
        return (
            policy.get('MinimumPasswordLength', 0) >= 12 and
            policy.get('RequireUppercaseCharacters', False) and
            policy.get('RequireLowercaseCharacters', False) and
            policy.get('RequireNumbers', False) and
            policy.get('RequireSymbols', False) and
            policy.get('MaxPasswordAge', 0) <= 90 and
            policy.get('PasswordReusePrevention', 0) >= 5
        )
    
    def _extract_users_with_mfa(self, users_response: Any, mfa_response: Any) -> List[Dict]:
        """Extract user details with MFA status"""
        if isinstance(users_response, Exception):
            return []
        
        users = users_response.get('Users', [])
        mfa_devices = mfa_response.get('VirtualMFADevices', []) if not isinstance(mfa_response, Exception) else []
        
        user_details = []
        for user in users:
            user_name = user.get('UserName', '')
            has_mfa = any(d.get('User', {}).get('UserName') == user_name for d in mfa_devices)
            
            user_details.append({
                'user_name': user_name,
                'user_id': user.get('UserId', ''),
                'created_date': user.get('CreateDate', '').isoformat() if user.get('CreateDate') else '',
                'has_mfa': has_mfa,
                'has_access_keys': len(user.get('AccessKeys', [])) > 0,
                'password_last_used': user.get('PasswordLastUsed', '').isoformat() if user.get('PasswordLastUsed') else 'Never'
            })
        
        return user_details
    
    def _calculate_mfa_compliance(self, users_response: Any, mfa_response: Any) -> Dict[str, Any]:
        """Calculate MFA compliance percentage"""
        if isinstance(users_response, Exception):
            return {'error': str(users_response)}
        
        users = users_response.get('Users', [])
        mfa_devices = mfa_response.get('VirtualMFADevices', []) if not isinstance(mfa_response, Exception) else []
        
        total_users = len(users)
        users_with_mfa = sum(1 for user in users if any(
            d.get('User', {}).get('UserName') == user.get('UserName') for d in mfa_devices
        ))
        
        return {
            'total_users': total_users,
            'users_with_mfa': users_with_mfa,
            'compliance_percentage': (users_with_mfa / total_users * 100) if total_users > 0 else 0,
            'compliant': users_with_mfa == total_users
        }
    
    async def collect_s3_evidence(self, customer_id: str, framework_id: str) -> Dict[str, Any]:
        """Collect S3 evidence efficiently"""
        
        loop = asyncio.get_event_loop()
        s3 = self.session.client('s3')
        
        # List all buckets
        buckets_response = await loop.run_in_executor(self.executor, s3.list_buckets)
        buckets = buckets_response.get('Buckets', [])
        
        # Collect bucket details in parallel
        bucket_tasks = []
        for bucket in buckets[:50]:  # Limit to 50 buckets for performance
            bucket_name = bucket['Name']
            bucket_tasks.extend([
                loop.run_in_executor(self.executor, self._get_bucket_encryption, s3, bucket_name),
                loop.run_in_executor(self.executor, self._get_bucket_versioning, s3, bucket_name),
                loop.run_in_executor(self.executor, self._get_bucket_logging, s3, bucket_name),
                loop.run_in_executor(self.executor, self._get_bucket_public_access, s3, bucket_name)
            ])
        
        bucket_results = await asyncio.gather(*bucket_tasks, return_exceptions=True)
        
        # Process results
        bucket_evidence = []
        for i in range(0, len(bucket_results), 4):
            if i // 4 < len(buckets):
                bucket = buckets[i // 4]
                bucket_evidence.append({
                    'bucket_name': bucket['Name'],
                    'created_date': bucket.get('CreationDate', '').isoformat() if bucket.get('CreationDate') else '',
                    'encryption': bucket_results[i] if not isinstance(bucket_results[i], Exception) else {'error': str(bucket_results[i])},
                    'versioning': bucket_results[i+1] if not isinstance(bucket_results[i+1], Exception) else {'error': str(bucket_results[i+1])},
                    'logging': bucket_results[i+2] if not isinstance(bucket_results[i+2], Exception) else {'error': str(bucket_results[i+2])},
                    'public_access': bucket_results[i+3] if not isinstance(bucket_results[i+3], Exception) else {'error': str(bucket_results[i+3])}
                })
        
        return {
            'total_buckets': len(buckets),
            'buckets_analyzed': len(bucket_evidence),
            'bucket_details': bucket_evidence,
            'compliance_summary': self._calculate_s3_compliance(bucket_evidence)
        }
    
    def _get_bucket_encryption(self, s3_client, bucket_name: str) -> Dict[str, Any]:
        """Get bucket encryption configuration"""
        try:
            response = s3_client.get_bucket_encryption(Bucket=bucket_name)
            rules = response.get('ServerSideEncryptionConfiguration', {}).get('Rules', [])
            return {
                'enabled': len(rules) > 0,
                'algorithm': rules[0].get('ApplyServerSideEncryptionByDefault', {}).get('SSEAlgorithm') if rules else None
            }
        except s3_client.exceptions.NoSuchBucket:
            return {'error': 'Bucket not found'}
        except:
            return {'enabled': False}
    
    def _get_bucket_versioning(self, s3_client, bucket_name: str) -> Dict[str, Any]:
        """Get bucket versioning configuration"""
        try:
            response = s3_client.get_bucket_versioning(Bucket=bucket_name)
            return {
                'status': response.get('Status', 'Disabled'),
                'mfa_delete': response.get('MFADelete', 'Disabled')
            }
        except:
            return {'status': 'Unknown'}
    
    def _get_bucket_logging(self, s3_client, bucket_name: str) -> Dict[str, Any]:
        """Get bucket logging configuration"""
        try:
            response = s3_client.get_bucket_logging(Bucket=bucket_name)
            logging_enabled = 'LoggingEnabled' in response
            return {
                'enabled': logging_enabled,
                'target_bucket': response.get('LoggingEnabled', {}).get('TargetBucket') if logging_enabled else None
            }
        except:
            return {'enabled': False}
    
    def _get_bucket_public_access(self, s3_client, bucket_name: str) -> Dict[str, Any]:
        """Get bucket public access block configuration"""
        try:
            response = s3_client.get_public_access_block(Bucket=bucket_name)
            config = response.get('PublicAccessBlockConfiguration', {})
            return {
                'block_public_acls': config.get('BlockPublicAcls', False),
                'block_public_policy': config.get('BlockPublicPolicy', False),
                'ignore_public_acls': config.get('IgnorePublicAcls', False),
                'restrict_public_buckets': config.get('RestrictPublicBuckets', False),
                'all_blocked': all([
                    config.get('BlockPublicAcls', False),
                    config.get('BlockPublicPolicy', False),
                    config.get('IgnorePublicAcls', False),
                    config.get('RestrictPublicBuckets', False)
                ])
            }
        except:
            return {'all_blocked': False}
    
    def _calculate_s3_compliance(self, bucket_evidence: List[Dict]) -> Dict[str, Any]:
        """Calculate S3 compliance metrics"""
        total = len(bucket_evidence)
        if total == 0:
            return {'compliant': True, 'issues': []}
        
        encrypted = sum(1 for b in bucket_evidence if b.get('encryption', {}).get('enabled', False))
        versioned = sum(1 for b in bucket_evidence if b.get('versioning', {}).get('status') == 'Enabled')
        logged = sum(1 for b in bucket_evidence if b.get('logging', {}).get('enabled', False))
        public_blocked = sum(1 for b in bucket_evidence if b.get('public_access', {}).get('all_blocked', False))
        
        return {
            'encryption_percentage': (encrypted / total * 100),
            'versioning_percentage': (versioned / total * 100),
            'logging_percentage': (logged / total * 100),
            'public_access_blocked_percentage': (public_blocked / total * 100),
            'fully_compliant_buckets': sum(1 for b in bucket_evidence if all([
                b.get('encryption', {}).get('enabled', False),
                b.get('versioning', {}).get('status') == 'Enabled',
                b.get('logging', {}).get('enabled', False),
                b.get('public_access', {}).get('all_blocked', False)
            ])),
            'issues': self._identify_s3_issues(bucket_evidence)
        }
    
    def _identify_s3_issues(self, bucket_evidence: List[Dict]) -> List[Dict]:
        """Identify S3 compliance issues"""
        issues = []
        
        for bucket in bucket_evidence:
            bucket_name = bucket.get('bucket_name', 'Unknown')
            
            if not bucket.get('encryption', {}).get('enabled', False):
                issues.append({
                    'bucket': bucket_name,
                    'issue': 'Encryption not enabled',
                    'severity': 'high',
                    'remediation': 'Enable default encryption with AES-256 or KMS'
                })
            
            if bucket.get('versioning', {}).get('status') != 'Enabled':
                issues.append({
                    'bucket': bucket_name,
                    'issue': 'Versioning not enabled',
                    'severity': 'medium',
                    'remediation': 'Enable versioning for data recovery'
                })
            
            if not bucket.get('logging', {}).get('enabled', False):
                issues.append({
                    'bucket': bucket_name,
                    'issue': 'Access logging not enabled',
                    'severity': 'medium',
                    'remediation': 'Enable server access logging'
                })
            
            if not bucket.get('public_access', {}).get('all_blocked', False):
                issues.append({
                    'bucket': bucket_name,
                    'issue': 'Public access not fully blocked',
                    'severity': 'critical',
                    'remediation': 'Enable all public access block settings'
                })
        
        return issues
    
    def _map_iam_to_controls(self, evidence: Dict, framework_id: str) -> Dict[str, Any]:
        """Map IAM evidence to compliance framework controls"""
        
        control_mapping = {
            'SOC2': {
                'CC6.1': evidence.get('password_policy', {}).get('compliant', False),
                'CC6.2': evidence.get('mfa_compliance', {}).get('compliant', False),
                'CC6.3': len(evidence.get('roles', [])) > 0
            },
            'ISO27001': {
                'A.9.2.1': evidence.get('password_policy', {}).get('compliant', False),
                'A.9.2.4': evidence.get('mfa_compliance', {}).get('compliance_percentage', 0) >= 95,
                'A.9.2.2': len(evidence.get('users', [])) > 0
            }
        }
        
        return {
            'evidence': evidence,
            'framework_controls': control_mapping.get(framework_id, {}),
            'compliance_score': self._calculate_compliance_score(evidence)
        }
    
    def _calculate_compliance_score(self, evidence: Dict) -> float:
        """Calculate overall compliance score"""
        scores = []
        
        # Password policy score
        if evidence.get('password_policy', {}).get('exists'):
            scores.append(1.0 if evidence['password_policy'].get('compliant') else 0.5)
        else:
            scores.append(0.0)
        
        # MFA compliance score
        mfa_percentage = evidence.get('mfa_compliance', {}).get('compliance_percentage', 0)
        scores.append(mfa_percentage / 100)
        
        # Calculate average
        return sum(scores) / len(scores) if scores else 0.0

@app.task(name='agents.workflows.aws.collect_evidence')
def collect_aws_evidence(
    customer_id: str,
    aws_credentials: Dict[str, str],
    framework_id: str,
    controls: Optional[List[str]] = None
) -> Dict[str, Any]:
    """Celery task to collect AWS evidence"""
    
    collector = AWSEvidenceCollector(
        aws_credentials['access_key_id'],
        aws_credentials['secret_access_key'],
        aws_credentials.get('region', 'us-east-1')
    )
    
    # Run async collection in sync context
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        result = loop.run_until_complete(
            collector.collect_all_evidence(customer_id, framework_id)
        )
        return {
            'status': 'completed',
            'evidence': result,
            'collected_at': datetime.utcnow().isoformat()
        }
    finally:
        loop.close()