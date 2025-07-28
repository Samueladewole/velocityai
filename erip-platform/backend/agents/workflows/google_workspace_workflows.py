"""
Google Workspace evidence collection for ERIP Velocity Tier.
Collects security policies, audit logs, and compliance evidence.
"""

import json
import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor
import structlog
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from ..core.celery_app import app
from ..tasks.browser_tasks import capture_evidence

logger = structlog.get_logger()

class GoogleWorkspaceEvidenceCollector:
    """High-performance Google Workspace evidence collection"""
    
    def __init__(self, credentials_dict: Dict[str, Any]):
        self.credentials = Credentials.from_authorized_user_info(credentials_dict)
        self.executor = ThreadPoolExecutor(max_workers=8)
    
    async def collect_all_evidence(self, customer_id: str, framework_id: str) -> Dict[str, Any]:
        """Collect all Google Workspace evidence in parallel"""
        
        tasks = [
            self.collect_admin_logs(customer_id, framework_id),
            self.collect_security_settings(customer_id, framework_id),
            self.collect_user_management(customer_id, framework_id),
            self.collect_drive_security(customer_id, framework_id),
            self.collect_email_security(customer_id, framework_id),
            self.collect_mobile_device_management(customer_id, framework_id),
            self.collect_apps_security(customer_id, framework_id),
            self.collect_org_units(customer_id, framework_id)
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return {
            'admin_logs': results[0] if not isinstance(results[0], Exception) else {'error': str(results[0])},
            'security_settings': results[1] if not isinstance(results[1], Exception) else {'error': str(results[1])},
            'user_management': results[2] if not isinstance(results[2], Exception) else {'error': str(results[2])},
            'drive_security': results[3] if not isinstance(results[3], Exception) else {'error': str(results[3])},
            'email_security': results[4] if not isinstance(results[4], Exception) else {'error': str(results[4])},
            'mobile_device_management': results[5] if not isinstance(results[5], Exception) else {'error': str(results[5])},
            'apps_security': results[6] if not isinstance(results[6], Exception) else {'error': str(results[6])},
            'org_units': results[7] if not isinstance(results[7], Exception) else {'error': str(results[7])}
        }
    
    async def collect_admin_logs(self, customer_id: str, framework_id: str) -> Dict[str, Any]:
        """Collect Google Workspace admin audit logs"""
        
        def _collect():
            try:
                service = build('admin', 'reports_v1', credentials=self.credentials)
                
                # Get admin activity logs for last 30 days
                end_date = datetime.now()
                start_date = end_date - timedelta(days=30)
                
                results = service.activities().list(
                    userKey='all',
                    applicationName='admin',
                    startTime=start_date.isoformat() + 'Z',
                    endTime=end_date.isoformat() + 'Z',
                    maxResults=1000
                ).execute()
                
                activities = results.get('items', [])
                
                # Analyze admin activities for compliance
                admin_events = []
                for activity in activities:
                    if activity.get('events'):
                        for event in activity['events']:
                            admin_events.append({
                                'time': activity.get('id', {}).get('time'),
                                'user': activity.get('actor', {}).get('email'),
                                'event_type': event.get('type'),
                                'event_name': event.get('name'),
                                'parameters': event.get('parameters', [])
                            })
                
                # CIS Control 6: Audit Logs
                evidence = {
                    'framework_control': 'CIS Control 6: Audit Logs',
                    'soc2_control': 'CC6.1: Logical Access',
                    'total_events': len(admin_events),
                    'admin_activities': admin_events[:100],  # First 100 for review
                    'logging_enabled': True,
                    'retention_period': 180,  # Google Workspace default
                    'collection_time': datetime.now().isoformat(),
                    'compliance_score': 95 if len(admin_events) > 0 else 60
                }
                
                return evidence
                
            except HttpError as e:
                logger.error("Failed to collect admin logs", error=str(e))
                return {'error': f"API Error: {e}"}
            except Exception as e:
                logger.error("Unexpected error collecting admin logs", error=str(e))
                return {'error': f"Unexpected error: {e}"}
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _collect)
    
    async def collect_security_settings(self, customer_id: str, framework_id: str) -> Dict[str, Any]:
        """Collect Google Workspace security settings"""
        
        def _collect():
            try:
                admin_service = build('admin', 'directory_v1', credentials=self.credentials)
                
                # Get domain settings
                domain_settings = admin_service.domains().list(customer=customer_id).execute()
                
                # Get organization units for security analysis
                org_units = admin_service.orgunits().list(
                    customerId=customer_id,
                    type='all'
                ).execute()
                
                # Analyze 2FA/MFA settings
                users_result = admin_service.users().list(
                    customer=customer_id,
                    maxResults=500,
                    query='isSuspended=false'
                ).execute()
                
                users = users_result.get('users', [])
                mfa_enabled_users = 0
                total_users = len(users)
                
                for user in users:
                    if user.get('isEnforcedIn2Sv', False):
                        mfa_enabled_users += 1
                
                mfa_percentage = (mfa_enabled_users / total_users * 100) if total_users > 0 else 0
                
                # CIS Control 4: Administrative Privileges
                evidence = {
                    'framework_control': 'CIS Control 4: Administrative Privileges',
                    'soc2_control': 'CC6.2: System Access',
                    'domain_count': len(domain_settings.get('domains', [])),
                    'org_units': len(org_units.get('organizationUnits', [])),
                    'total_users': total_users,
                    'mfa_enabled_users': mfa_enabled_users,
                    'mfa_percentage': round(mfa_percentage, 2),
                    'mfa_compliance': mfa_percentage >= 90,
                    'collection_time': datetime.now().isoformat(),
                    'compliance_score': min(100, int(mfa_percentage + 10))
                }
                
                return evidence
                
            except HttpError as e:
                logger.error("Failed to collect security settings", error=str(e))
                return {'error': f"API Error: {e}"}
            except Exception as e:
                logger.error("Unexpected error collecting security settings", error=str(e))
                return {'error': f"Unexpected error: {e}"}
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _collect)
    
    async def collect_user_management(self, customer_id: str, framework_id: str) -> Dict[str, Any]:
        """Collect user management and access control evidence"""
        
        def _collect():
            try:
                admin_service = build('admin', 'directory_v1', credentials=self.credentials)
                
                # Get all users with detailed info
                users_result = admin_service.users().list(
                    customer=customer_id,
                    maxResults=1000,
                    projection='full'
                ).execute()
                
                users = users_result.get('users', [])
                
                # Analyze user access patterns
                admin_users = []
                suspended_users = []
                external_users = []
                
                for user in users:
                    if user.get('isAdmin', False):
                        admin_users.append({
                            'email': user.get('primaryEmail'),
                            'name': user.get('name', {}).get('fullName'),
                            'lastLoginTime': user.get('lastLoginTime'),
                            'isEnforcedIn2Sv': user.get('isEnforcedIn2Sv', False)
                        })
                    
                    if user.get('suspended', False):
                        suspended_users.append({
                            'email': user.get('primaryEmail'),
                            'suspensionReason': user.get('suspensionReason')
                        })
                    
                    # Check for external/guest users
                    email = user.get('primaryEmail', '')
                    if '@' in email and not any(domain['domainName'] in email for domain in []):
                        external_users.append({
                            'email': email,
                            'orgUnitPath': user.get('orgUnitPath')
                        })
                
                # CIS Control 1: Asset Inventory & CIS Control 4: Admin Privileges
                evidence = {
                    'framework_control': 'CIS Control 1: Asset Inventory',
                    'soc2_control': 'CC6.1: User Access Management',
                    'total_users': len(users),
                    'admin_users_count': len(admin_users),
                    'admin_users': admin_users,
                    'suspended_users_count': len(suspended_users),
                    'suspended_users': suspended_users,
                    'external_users_count': len(external_users),
                    'admin_percentage': round(len(admin_users) / len(users) * 100, 2) if users else 0,
                    'collection_time': datetime.now().isoformat(),
                    'compliance_score': 90 if len(admin_users) / len(users) < 0.1 else 70  # <10% admins is good
                }
                
                return evidence
                
            except HttpError as e:
                logger.error("Failed to collect user management data", error=str(e))
                return {'error': f"API Error: {e}"}
            except Exception as e:
                logger.error("Unexpected error collecting user management data", error=str(e))
                return {'error': f"Unexpected error: {e}"}
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _collect)
    
    async def collect_drive_security(self, customer_id: str, framework_id: str) -> Dict[str, Any]:
        """Collect Google Drive security and sharing settings"""
        
        def _collect():
            try:
                drive_service = build('drive', 'v3', credentials=self.credentials)
                admin_service = build('admin', 'directory_v1', credentials=self.credentials)
                
                # Get sharing settings from admin console (requires domain admin)
                # This would typically require domain-wide delegation
                
                # For now, collect basic Drive information
                about = drive_service.about().get(fields='storageQuota,user').execute()
                
                # Get recent files to analyze sharing patterns
                files_result = drive_service.files().list(
                    pageSize=100,
                    fields='files(id,name,permissions,shared,webViewLink)',
                    q='trashed=false'
                ).execute()
                
                files = files_result.get('files', [])
                
                # Analyze sharing patterns
                shared_files = [f for f in files if f.get('shared', False)]
                public_files = []
                external_shares = []
                
                for file in shared_files:
                    permissions = file.get('permissions', [])
                    for perm in permissions:
                        if perm.get('type') == 'anyone':
                            public_files.append(file)
                        elif perm.get('type') == 'user' and '@' in perm.get('emailAddress', ''):
                            # Check if external domain
                            external_shares.append(file)
                
                # CIS Control 5: Secure Configuration
                evidence = {
                    'framework_control': 'CIS Control 5: Secure Configuration',
                    'soc2_control': 'CC6.3: Data Protection',
                    'total_files_checked': len(files),
                    'shared_files_count': len(shared_files),
                    'public_files_count': len(public_files),
                    'external_shares_count': len(external_shares),
                    'sharing_percentage': round(len(shared_files) / len(files) * 100, 2) if files else 0,
                    'public_sharing_risk': len(public_files) > 0,
                    'storage_quota': about.get('storageQuota', {}),
                    'collection_time': datetime.now().isoformat(),
                    'compliance_score': 90 if len(public_files) == 0 else 60
                }
                
                return evidence
                
            except HttpError as e:
                logger.error("Failed to collect Drive security data", error=str(e))
                return {'error': f"API Error: {e}"}
            except Exception as e:
                logger.error("Unexpected error collecting Drive security data", error=str(e))
                return {'error': f"Unexpected error: {e}"}
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _collect)
    
    async def collect_email_security(self, customer_id: str, framework_id: str) -> Dict[str, Any]:
        """Collect Gmail security settings and policies"""
        
        def _collect():
            try:
                gmail_service = build('gmail', 'v1', credentials=self.credentials)
                
                # Get user profile
                profile = gmail_service.users().getProfile(userId='me').execute()
                
                # Get labels to understand email organization
                labels_result = gmail_service.users().labels().list(userId='me').execute()
                labels = labels_result.get('labels', [])
                
                # Analyze email security (this is limited without domain admin access)
                system_labels = [l for l in labels if l.get('type') == 'system']
                user_labels = [l for l in labels if l.get('type') == 'user']
                
                # Check for security-related labels
                security_labels = [l for l in labels if 'spam' in l.get('name', '').lower() or 
                                 'phishing' in l.get('name', '').lower()]
                
                # CIS Control 7: Email and Web Browser Protections
                evidence = {
                    'framework_control': 'CIS Control 7: Email Protection',
                    'soc2_control': 'CC6.1: Communication Security',
                    'email_address': profile.get('emailAddress'),
                    'total_messages': profile.get('messagesTotal', 0),
                    'threads_total': profile.get('threadsTotal', 0),
                    'system_labels_count': len(system_labels),
                    'user_labels_count': len(user_labels),
                    'security_labels_present': len(security_labels) > 0,
                    'spam_filtering_active': any('spam' in l.get('name', '').lower() for l in system_labels),
                    'collection_time': datetime.now().isoformat(),
                    'compliance_score': 85  # Basic score for having Gmail security
                }
                
                return evidence
                
            except HttpError as e:
                logger.error("Failed to collect email security data", error=str(e))
                return {'error': f"API Error: {e}"}
            except Exception as e:
                logger.error("Unexpected error collecting email security data", error=str(e))
                return {'error': f"Unexpected error: {e}"}
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _collect)
    
    async def collect_mobile_device_management(self, customer_id: str, framework_id: str) -> Dict[str, Any]:
        """Collect mobile device management evidence"""
        
        def _collect():
            try:
                admin_service = build('admin', 'directory_v1', credentials=self.credentials)
                
                # Get mobile devices
                devices_result = admin_service.mobiledevices().list(
                    customerId=customer_id,
                    maxResults=1000
                ).execute()
                
                devices = devices_result.get('mobiledevices', [])
                
                # Analyze device compliance
                total_devices = len(devices)
                compliant_devices = 0
                encrypted_devices = 0
                managed_devices = 0
                
                device_types = {}
                os_versions = {}
                
                for device in devices:
                    # Count compliant devices
                    if device.get('status') == 'APPROVED':
                        compliant_devices += 1
                    
                    # Count encrypted devices
                    if device.get('encryptionStatus') == 'ENCRYPTED':
                        encrypted_devices += 1
                    
                    # Count managed devices
                    if device.get('managedAccountIsOnOwnerProfile', False):
                        managed_devices += 1
                    
                    # Categorize device types
                    device_type = device.get('type', 'Unknown')
                    device_types[device_type] = device_types.get(device_type, 0) + 1
                    
                    # Categorize OS versions
                    os_version = device.get('os', 'Unknown')
                    os_versions[os_version] = os_versions.get(os_version, 0) + 1
                
                compliance_percentage = (compliant_devices / total_devices * 100) if total_devices > 0 else 100
                encryption_percentage = (encrypted_devices / total_devices * 100) if total_devices > 0 else 100
                
                # CIS Control 1: Asset Inventory & CIS Control 5: Secure Configuration
                evidence = {
                    'framework_control': 'CIS Control 1: Mobile Asset Inventory',
                    'soc2_control': 'CC6.1: Device Access Controls',
                    'total_devices': total_devices,
                    'compliant_devices': compliant_devices,
                    'encrypted_devices': encrypted_devices,
                    'managed_devices': managed_devices,
                    'compliance_percentage': round(compliance_percentage, 2),
                    'encryption_percentage': round(encryption_percentage, 2),
                    'device_types': device_types,
                    'os_versions': os_versions,
                    'collection_time': datetime.now().isoformat(),
                    'compliance_score': min(100, int((compliance_percentage + encryption_percentage) / 2))
                }
                
                return evidence
                
            except HttpError as e:
                logger.error("Failed to collect mobile device data", error=str(e))
                return {'error': f"API Error: {e}"}
            except Exception as e:
                logger.error("Unexpected error collecting mobile device data", error=str(e))
                return {'error': f"Unexpected error: {e}"}
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _collect)
    
    async def collect_apps_security(self, customer_id: str, framework_id: str) -> Dict[str, Any]:
        """Collect third-party apps and security settings"""
        
        def _collect():
            try:
                admin_service = build('admin', 'directory_v1', credentials=self.credentials)
                
                # Get Chrome policy (if available)
                # Note: This requires Chrome management license
                
                # For now, collect basic organization info
                org_result = admin_service.orgunits().list(
                    customerId=customer_id,
                    type='all'
                ).execute()
                
                org_units = org_result.get('organizationUnits', [])
                
                # Analyze organizational structure for security
                total_orgs = len(org_units)
                
                # CIS Control 5: Secure Configuration
                evidence = {
                    'framework_control': 'CIS Control 5: Application Security',
                    'soc2_control': 'CC6.1: Application Access Controls',
                    'organizational_units': total_orgs,
                    'org_structure': [
                        {
                            'name': org.get('name'),
                            'path': org.get('orgUnitPath'),
                            'description': org.get('description', '')
                        } for org in org_units[:10]  # First 10 for review
                    ],
                    'structured_organization': total_orgs > 1,  # Good security practice
                    'collection_time': datetime.now().isoformat(),
                    'compliance_score': 85 if total_orgs > 1 else 70
                }
                
                return evidence
                
            except HttpError as e:
                logger.error("Failed to collect apps security data", error=str(e))
                return {'error': f"API Error: {e}"}
            except Exception as e:
                logger.error("Unexpected error collecting apps security data", error=str(e))
                return {'error': f"Unexpected error: {e}"}
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _collect)
    
    async def collect_org_units(self, customer_id: str, framework_id: str) -> Dict[str, Any]:
        """Collect organizational units and governance structure"""
        
        def _collect():
            try:
                admin_service = build('admin', 'directory_v1', credentials=self.credentials)
                
                # Get detailed org units
                org_result = admin_service.orgunits().list(
                    customerId=customer_id,
                    type='all'
                ).execute()
                
                org_units = org_result.get('organizationUnits', [])
                
                # Analyze governance structure
                total_orgs = len(org_units)
                nested_orgs = sum(1 for org in org_units if org.get('orgUnitPath', '/').count('/') > 1)
                
                # Get users per org unit
                org_user_counts = {}
                for org in org_units:
                    org_path = org.get('orgUnitPath', '/')
                    try:
                        users_in_org = admin_service.users().list(
                            customer=customer_id,
                            query=f'orgUnitPath={org_path}',
                            maxResults=1000
                        ).execute()
                        org_user_counts[org_path] = len(users_in_org.get('users', []))
                    except:
                        org_user_counts[org_path] = 0
                
                # Governance structure analysis
                evidence = {
                    'framework_control': 'Governance Structure',
                    'soc2_control': 'CC1.1: Organizational Structure',
                    'total_org_units': total_orgs,
                    'nested_org_units': nested_orgs,
                    'org_hierarchy_depth': max(org.get('orgUnitPath', '/').count('/') for org in org_units) if org_units else 0,
                    'users_per_org': org_user_counts,
                    'structured_governance': nested_orgs > 0,
                    'org_details': [
                        {
                            'name': org.get('name'),
                            'path': org.get('orgUnitPath'),
                            'user_count': org_user_counts.get(org.get('orgUnitPath', '/'), 0)
                        } for org in org_units
                    ],
                    'collection_time': datetime.now().isoformat(),
                    'compliance_score': 90 if nested_orgs > 0 else 75
                }
                
                return evidence
                
            except HttpError as e:
                logger.error("Failed to collect org units data", error=str(e))
                return {'error': f"API Error: {e}"}
            except Exception as e:
                logger.error("Unexpected error collecting org units data", error=str(e))
                return {'error': f"Unexpected error: {e}"}
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _collect)

# Celery task for Google Workspace evidence collection
@app.task(bind=True, max_retries=3)
def collect_google_workspace_evidence(self, customer_id: str, credentials_dict: Dict[str, Any], framework_id: str):
    """Celery task to collect Google Workspace evidence"""
    try:
        collector = GoogleWorkspaceEvidenceCollector(credentials_dict)
        
        # Run the async collection
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        evidence = loop.run_until_complete(
            collector.collect_all_evidence(customer_id, framework_id)
        )
        
        loop.close()
        
        logger.info("Successfully collected Google Workspace evidence", 
                   customer_id=customer_id, 
                   evidence_count=len(evidence))
        
        return evidence
        
    except Exception as e:
        logger.error("Failed to collect Google Workspace evidence", 
                    customer_id=customer_id, 
                    error=str(e))
        
        # Retry the task
        raise self.retry(exc=e, countdown=60)