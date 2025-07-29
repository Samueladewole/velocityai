#!/usr/bin/env python3
"""
Velocity.ai Azure Compliance Monitor Agent
Real-time security monitoring and compliance assessment for Microsoft Azure

Features:
- Virtual Machine security configuration analysis
- Storage Account security and access control assessment
- SQL Database security configuration monitoring
- Azure Active Directory policy and user auditing
- Key Vault security and secret management analysis
- Network Security Group rule validation
- Azure Monitor and Log Analytics integration
- Real-time compliance scoring against SOC2, ISO27001, GDPR
"""

import asyncio
import json
import logging
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from azure.identity import DefaultAzureCredential, ClientSecretCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.compute import ComputeManagementClient
from azure.mgmt.storage import StorageManagementClient
from azure.mgmt.sql import SqlManagementClient
from azure.mgmt.keyvault import KeyVaultManagementClient
from azure.mgmt.network import NetworkManagementClient
from azure.mgmt.monitor import MonitorManagementClient
from azure.mgmt.authorization import AuthorizationManagementClient
import psycopg2
import psycopg2.extras
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('azure-monitor')

@dataclass
class AzureEvidence:
    """Evidence item collected from Azure"""
    evidence_id: str
    evidence_type: str
    resource_type: str
    resource_id: str
    subscription_id: str
    resource_group: Optional[str]
    location: Optional[str]
    data: Dict[str, Any]
    compliance_status: str
    risk_level: str
    frameworks: List[str]
    collection_timestamp: str
    evidence_hash: str

@dataclass
class ComplianceRule:
    """Azure compliance rule definition"""
    rule_id: str
    framework: str
    control_id: str
    description: str
    severity: str
    resource_types: List[str]
    check_function: str
    remediation: str

class AzureMonitor:
    """
    Production Azure Compliance Monitor Agent
    
    Performs comprehensive security monitoring across Azure services
    with real-time compliance evaluation and evidence collection.
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.agent_id = config.get('agent_id', 'azure-monitor-001')
        self.subscription_id = config.get('subscription_id')
        self.tenant_id = config.get('tenant_id')
        self.client_id = config.get('client_id')
        self.client_secret = config.get('client_secret')
        
        # Azure clients
        self.credential = None
        self.resource_client = None
        self.compute_client = None
        self.storage_client = None
        self.sql_client = None
        self.keyvault_client = None
        self.network_client = None
        self.monitor_client = None
        self.auth_client = None
        
        # Database connection
        self.db_connection = None
        
        # Compliance rules
        self.compliance_rules = self._load_compliance_rules()
        
        # Evidence storage
        self.evidence_buffer: List[AzureEvidence] = []
        self.max_buffer_size = config.get('max_buffer_size', 100)
        
        # Performance metrics
        self.metrics = {
            'resources_monitored': 0,
            'evidence_collected': 0,
            'compliance_checks_run': 0,
            'api_calls_made': 0,
            'errors_encountered': 0,
            'security_findings': 0,
            'last_monitoring_time': None
        }
        
        # Initialize Azure clients
        self._initialize_azure_clients()
        
        # Initialize database connection
        self._initialize_database()
        
        logger.info(f"🚀 Azure Monitor {self.agent_id} initialized for subscription {self.subscription_id}")
    
    def _initialize_azure_clients(self):
        """Initialize Azure service clients with authentication"""
        try:
            # Initialize credential
            if self.client_id and self.client_secret and self.tenant_id:
                self.credential = ClientSecretCredential(
                    tenant_id=self.tenant_id,
                    client_id=self.client_id,
                    client_secret=self.client_secret
                )
            else:
                # Use default credential (managed identity, Azure CLI, etc.)
                self.credential = DefaultAzureCredential()
            
            # Initialize service clients
            self.resource_client = ResourceManagementClient(
                self.credential, self.subscription_id
            )
            self.compute_client = ComputeManagementClient(
                self.credential, self.subscription_id
            )
            self.storage_client = StorageManagementClient(
                self.credential, self.subscription_id
            )
            self.sql_client = SqlManagementClient(
                self.credential, self.subscription_id
            )
            self.keyvault_client = KeyVaultManagementClient(
                self.credential, self.subscription_id
            )
            self.network_client = NetworkManagementClient(
                self.credential, self.subscription_id
            )
            self.monitor_client = MonitorManagementClient(
                self.credential, self.subscription_id
            )
            self.auth_client = AuthorizationManagementClient(
                self.credential, self.subscription_id
            )
            
            # Test authentication by listing resource groups
            resource_groups = list(self.resource_client.resource_groups.list())
            logger.info(f"✅ Azure authentication successful. Found {len(resource_groups)} resource groups")
            
        except Exception as e:
            logger.error(f"❌ Azure authentication failed: {e}")
            raise
    
    def _initialize_database(self):
        """Initialize database connection for evidence storage"""
        try:
            self.db_connection = psycopg2.connect(
                self.config.get('database_url', 'postgresql://localhost/velocity_agents'),
                cursor_factory=psycopg2.extras.RealDictCursor
            )
            self.db_connection.autocommit = True
            logger.info("✅ Database connection established")
            
        except Exception as e:
            logger.error(f"❌ Database connection failed: {e}")
            raise
    
    async def start_monitoring(self):
        """Start the Azure security monitoring process"""
        logger.info("🔍 Starting Azure security monitoring")
        
        try:
            while True:
                monitoring_start = datetime.utcnow()
                
                # Monitor all enabled Azure services
                await self._monitor_virtual_machines()
                await self._monitor_storage_accounts()
                await self._monitor_sql_databases()
                await self._monitor_key_vaults()
                await self._monitor_network_security_groups()
                await self._monitor_azure_ad_policies()
                await self._monitor_resource_compliance()
                
                # Process and store collected evidence
                await self._process_evidence_buffer()
                
                # Update metrics
                self.metrics['last_monitoring_time'] = monitoring_start.isoformat()
                
                monitoring_duration = (datetime.utcnow() - monitoring_start).total_seconds()
                logger.info(f"✅ Monitoring cycle completed in {monitoring_duration:.2f}s")
                
                # Send heartbeat with metrics
                await self._send_heartbeat()
                
                # Wait for next monitoring interval
                await asyncio.sleep(self.config.get('monitoring_interval', 900))  # 15 minutes default
                
        except Exception as e:
            logger.error(f"❌ Azure monitoring error: {e}")
            self.metrics['errors_encountered'] += 1
            await asyncio.sleep(120)  # Wait before retry
    
    async def _monitor_virtual_machines(self):
        """Monitor Virtual Machine security configurations"""
        try:
            logger.info("📊 Monitoring Virtual Machines")
            
            # Get all VMs
            vms = self.compute_client.virtual_machines.list_all()
            self.metrics['api_calls_made'] += 1
            
            for vm in vms:
                try:
                    # Get detailed VM information
                    vm_details = await self._get_vm_details(vm)
                    
                    # Create evidence item
                    evidence = await self._create_vm_evidence(vm_details, vm.name)
                    
                    # Run compliance checks
                    await self._evaluate_compliance(evidence)
                    
                    # Add to buffer
                    self.evidence_buffer.append(evidence)
                    self.metrics['evidence_collected'] += 1
                    self.metrics['resources_monitored'] += 1
                    
                except Exception as e:
                    logger.warning(f"⚠️ Failed to monitor VM {vm.name}: {e}")
                    self.metrics['errors_encountered'] += 1
            
            logger.info("📊 Virtual Machine monitoring completed")
            
        except Exception as e:
            logger.error(f"❌ Virtual Machine monitoring failed: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _get_vm_details(self, vm) -> Dict:
        """Get comprehensive VM security details"""
        vm_data = {
            'name': vm.name,
            'id': vm.id,
            'location': vm.location,
            'vm_size': vm.hardware_profile.vm_size if vm.hardware_profile else None,
            'resource_group': vm.id.split('/')[4] if vm.id else None,
            'os_profile': {
                'computer_name': vm.os_profile.computer_name if vm.os_profile else None,
                'admin_username': vm.os_profile.admin_username if vm.os_profile else None,
                'disable_password_authentication': vm.os_profile.linux_configuration.disable_password_authentication if (vm.os_profile and vm.os_profile.linux_configuration) else None,
                'enable_automatic_updates': vm.os_profile.windows_configuration.enable_automatic_updates if (vm.os_profile and vm.os_profile.windows_configuration) else None
            },
            'network_interfaces': [],
            'storage_profile': {
                'os_disk': {
                    'name': vm.storage_profile.os_disk.name if vm.storage_profile else None,
                    'disk_size_gb': vm.storage_profile.os_disk.disk_size_gb if vm.storage_profile else None,
                    'managed_disk': vm.storage_profile.os_disk.managed_disk.id if (vm.storage_profile and vm.storage_profile.os_disk.managed_disk) else None,
                    'encryption_settings': vm.storage_profile.os_disk.encryption_settings if vm.storage_profile else None
                },
                'data_disks': [
                    {
                        'name': disk.name,
                        'disk_size_gb': disk.disk_size_gb,
                        'managed_disk': disk.managed_disk.id if disk.managed_disk else None
                    } for disk in vm.storage_profile.data_disks
                ] if vm.storage_profile else []
            },
            'provisioning_state': vm.provisioning_state,
            'vm_id': vm.vm_id,
            'tags': dict(vm.tags) if vm.tags else {},
            'zones': vm.zones,
            'security_profile': {
                'security_type': vm.security_profile.security_type if vm.security_profile else None,
                'encryption_identity': vm.security_profile.encryption_identity if vm.security_profile else None
            },
            'diagnostics_profile': {
                'boot_diagnostics': {
                    'enabled': vm.diagnostics_profile.boot_diagnostics.enabled if (vm.diagnostics_profile and vm.diagnostics_profile.boot_diagnostics) else False,
                    'storage_uri': vm.diagnostics_profile.boot_diagnostics.storage_uri if (vm.diagnostics_profile and vm.diagnostics_profile.boot_diagnostics) else None
                }
            } if vm.diagnostics_profile else {}
        }
        
        try:
            # Get network interface details
            if vm.network_profile and vm.network_profile.network_interfaces:
                for nic_ref in vm.network_profile.network_interfaces:
                    nic_id = nic_ref.id
                    resource_group = nic_id.split('/')[4]
                    nic_name = nic_id.split('/')[-1]
                    
                    nic = self.network_client.network_interfaces.get(resource_group, nic_name)
                    self.metrics['api_calls_made'] += 1
                    
                    vm_data['network_interfaces'].append({
                        'name': nic.name,
                        'id': nic.id,
                        'location': nic.location,
                        'ip_configurations': [
                            {
                                'name': ip_config.name,
                                'private_ip_address': ip_config.private_ip_address,
                                'private_ip_allocation_method': ip_config.private_ip_allocation_method,
                                'public_ip': ip_config.public_ip_address.id if ip_config.public_ip_address else None,
                                'subnet': ip_config.subnet.id if ip_config.subnet else None
                            } for ip_config in nic.ip_configurations
                        ] if nic.ip_configurations else [],
                        'network_security_group': nic.network_security_group.id if nic.network_security_group else None,
                        'enable_ip_forwarding': nic.enable_ip_forwarding,
                        'enable_accelerated_networking': nic.enable_accelerated_networking
                    })
                    
        except Exception as e:
            logger.warning(f"⚠️ Failed to get network details for VM {vm.name}: {e}")
        
        return vm_data
    
    async def _create_vm_evidence(self, vm_data: Dict, vm_name: str) -> AzureEvidence:
        """Create evidence item from VM data"""
        
        # Calculate evidence hash
        evidence_hash = hashlib.sha256(
            json.dumps(vm_data, sort_keys=True, default=str).encode()
        ).hexdigest()
        
        return AzureEvidence(
            evidence_id=f"azure_vm_{vm_name}_{datetime.utcnow().timestamp()}",
            evidence_type='azure_vm_configuration',
            resource_type='Microsoft.Compute/virtualMachines',
            resource_id=vm_name,
            subscription_id=self.subscription_id,
            resource_group=vm_data.get('resource_group'),
            location=vm_data.get('location'),
            data=vm_data,
            compliance_status='pending',
            risk_level='unknown',
            frameworks=['SOC2', 'ISO27001', 'GDPR'],
            collection_timestamp=datetime.utcnow().isoformat(),
            evidence_hash=evidence_hash
        )
    
    async def _monitor_storage_accounts(self):
        """Monitor Storage Account security configurations"""
        try:
            logger.info("📊 Monitoring Storage Accounts")
            
            # Get all storage accounts
            storage_accounts = self.storage_client.storage_accounts.list()
            self.metrics['api_calls_made'] += 1
            
            for account in storage_accounts:
                try:
                    # Get detailed storage account information
                    account_details = await self._get_storage_account_details(account)
                    
                    # Create evidence item
                    evidence = await self._create_storage_evidence(account_details, account.name)
                    
                    # Run compliance checks
                    await self._evaluate_compliance(evidence)
                    
                    # Add to buffer
                    self.evidence_buffer.append(evidence)
                    self.metrics['evidence_collected'] += 1
                    self.metrics['resources_monitored'] += 1
                    
                except Exception as e:
                    logger.warning(f"⚠️ Failed to monitor Storage Account {account.name}: {e}")
                    self.metrics['errors_encountered'] += 1
            
            logger.info("📊 Storage Account monitoring completed")
            
        except Exception as e:
            logger.error(f"❌ Storage Account monitoring failed: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _get_storage_account_details(self, account) -> Dict:
        """Get comprehensive storage account security details"""
        resource_group = account.id.split('/')[4]
        
        account_data = {
            'name': account.name,
            'id': account.id,
            'location': account.location,
            'resource_group': resource_group,
            'sku': {
                'name': account.sku.name,
                'tier': account.sku.tier
            } if account.sku else {},
            'kind': account.kind,
            'provisioning_state': account.provisioning_state,
            'creation_time': account.creation_time.isoformat() if account.creation_time else None,
            'primary_location': account.primary_location,
            'secondary_location': account.secondary_location,
            'status_of_primary': account.status_of_primary,
            'status_of_secondary': account.status_of_secondary,
            'enable_https_traffic_only': account.enable_https_traffic_only,
            'network_rule_set': {
                'default_action': account.network_rule_set.default_action if account.network_rule_set else None,
                'bypass': account.network_rule_set.bypass if account.network_rule_set else None,
                'ip_rules': [
                    {
                        'ip_address_or_range': rule.ip_address_or_range,
                        'action': rule.action
                    } for rule in account.network_rule_set.ip_rules
                ] if account.network_rule_set and account.network_rule_set.ip_rules else [],
                'virtual_network_rules': [
                    {
                        'virtual_network_resource_id': rule.virtual_network_resource_id,
                        'action': rule.action,
                        'state': rule.state
                    } for rule in account.network_rule_set.virtual_network_rules
                ] if account.network_rule_set and account.network_rule_set.virtual_network_rules else []
            },
            'access_tier': account.access_tier,
            'azure_files_identity_based_authentication': account.azure_files_identity_based_authentication,
            'enable_nfs_v3': account.enable_nfs_v3,
            'allow_blob_public_access': account.allow_blob_public_access,
            'minimum_tls_version': account.minimum_tls_version,
            'allow_shared_key_access': account.allow_shared_key_access,
            'tags': dict(account.tags) if account.tags else {}
        }
        
        try:
            # Get encryption settings
            encryption_details = self.storage_client.storage_accounts.get_properties(
                resource_group, account.name
            )
            self.metrics['api_calls_made'] += 1
            
            account_data['encryption'] = {
                'services': {
                    'blob': {
                        'enabled': encryption_details.encryption.services.blob.enabled if (encryption_details.encryption and encryption_details.encryption.services and encryption_details.encryption.services.blob) else False,
                        'key_type': encryption_details.encryption.services.blob.key_type if (encryption_details.encryption and encryption_details.encryption.services and encryption_details.encryption.services.blob) else None
                    },
                    'file': {
                        'enabled': encryption_details.encryption.services.file.enabled if (encryption_details.encryption and encryption_details.encryption.services and encryption_details.encryption.services.file) else False,
                        'key_type': encryption_details.encryption.services.file.key_type if (encryption_details.encryption and encryption_details.encryption.services and encryption_details.encryption.services.file) else None
                    }
                } if encryption_details.encryption else {},
                'key_source': encryption_details.encryption.key_source if encryption_details.encryption else None,
                'key_vault_properties': encryption_details.encryption.key_vault_properties if (encryption_details.encryption and encryption_details.encryption.key_vault_properties) else None
            }
            
        except Exception as e:
            logger.warning(f"⚠️ Failed to get encryption details for storage account {account.name}: {e}")
        
        return account_data
    
    async def _create_storage_evidence(self, account_data: Dict, account_name: str) -> AzureEvidence:
        """Create evidence item from storage account data"""
        
        # Calculate evidence hash
        evidence_hash = hashlib.sha256(
            json.dumps(account_data, sort_keys=True, default=str).encode()
        ).hexdigest()
        
        return AzureEvidence(
            evidence_id=f"azure_storage_{account_name}_{datetime.utcnow().timestamp()}",
            evidence_type='azure_storage_configuration',
            resource_type='Microsoft.Storage/storageAccounts',
            resource_id=account_name,
            subscription_id=self.subscription_id,
            resource_group=account_data.get('resource_group'),
            location=account_data.get('location'),
            data=account_data,
            compliance_status='pending',
            risk_level='unknown',
            frameworks=['SOC2', 'ISO27001', 'GDPR'],
            collection_timestamp=datetime.utcnow().isoformat(),
            evidence_hash=evidence_hash
        )
    
    async def _monitor_sql_databases(self):
        """Monitor SQL Database security configurations"""
        try:
            logger.info("📊 Monitoring SQL Databases")
            
            # Get all SQL servers
            sql_servers = self.sql_client.servers.list()
            self.metrics['api_calls_made'] += 1
            
            for server in sql_servers:
                try:
                    # Get databases for this server
                    resource_group = server.id.split('/')[4]
                    databases = self.sql_client.databases.list_by_server(resource_group, server.name)
                    self.metrics['api_calls_made'] += 1
                    
                    for db in databases:
                        if db.name != 'master':  # Skip master database
                            db_details = await self._get_sql_database_details(server, db, resource_group)
                            
                            # Create evidence item
                            evidence = await self._create_sql_evidence(db_details, f"{server.name}/{db.name}")
                            
                            # Run compliance checks
                            await self._evaluate_compliance(evidence)
                            
                            # Add to buffer
                            self.evidence_buffer.append(evidence)
                            self.metrics['evidence_collected'] += 1
                            self.metrics['resources_monitored'] += 1
                    
                except Exception as e:
                    logger.warning(f"⚠️ Failed to monitor SQL Server {server.name}: {e}")
                    self.metrics['errors_encountered'] += 1
            
            logger.info("📊 SQL Database monitoring completed")
            
        except Exception as e:
            logger.error(f"❌ SQL Database monitoring failed: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _get_sql_database_details(self, server, database, resource_group: str) -> Dict:
        """Get comprehensive SQL database security details"""
        
        db_data = {
            'server_name': server.name,
            'database_name': database.name,
            'server_id': server.id,
            'database_id': database.id,
            'location': database.location,
            'resource_group': resource_group,
            'server_version': server.version,
            'database_edition': database.edition,
            'service_tier': database.service_level_objective,
            'collation': database.collation,
            'creation_date': database.creation_date.isoformat() if database.creation_date else None,
            'status': database.status,
            'database_size': database.current_service_objective_id,
            'server_admin_login': server.administrator_login,
            'server_state': server.state,
            'tags': dict(database.tags) if database.tags else {}
        }
        
        try:
            # Get transparent data encryption status
            tde_config = self.sql_client.transparent_data_encryptions.get(
                resource_group, server.name, database.name
            )
            self.metrics['api_calls_made'] += 1
            
            db_data['transparent_data_encryption'] = {
                'status': tde_config.status if tde_config else None
            }
            
            # Get auditing policy
            auditing_policy = self.sql_client.database_blob_auditing_policies.get(
                resource_group, server.name, database.name
            )
            self.metrics['api_calls_made'] += 1
            
            db_data['auditing_policy'] = {
                'state': auditing_policy.state if auditing_policy else None,
                'storage_endpoint': auditing_policy.storage_endpoint if auditing_policy else None,
                'retention_days': auditing_policy.retention_days if auditing_policy else None,
                'audit_actions_and_groups': auditing_policy.audit_actions_and_groups if auditing_policy else []
            }
            
            # Get threat detection policy
            threat_detection = self.sql_client.database_threat_detection_policies.get(
                resource_group, server.name, database.name
            )
            self.metrics['api_calls_made'] += 1
            
            db_data['threat_detection'] = {
                'state': threat_detection.state if threat_detection else None,
                'disabled_alerts': threat_detection.disabled_alerts if threat_detection else [],
                'email_addresses': threat_detection.email_addresses if threat_detection else [],
                'email_account_admins': threat_detection.email_account_admins if threat_detection else None,
                'retention_days': threat_detection.retention_days if threat_detection else None
            }
            
        except Exception as e:
            logger.warning(f"⚠️ Failed to get security details for database {database.name}: {e}")
        
        return db_data
    
    async def _create_sql_evidence(self, db_data: Dict, db_identifier: str) -> AzureEvidence:
        """Create evidence item from SQL database data"""
        
        # Calculate evidence hash
        evidence_hash = hashlib.sha256(
            json.dumps(db_data, sort_keys=True, default=str).encode()
        ).hexdigest()
        
        return AzureEvidence(
            evidence_id=f"azure_sql_{db_identifier.replace('/', '_')}_{datetime.utcnow().timestamp()}",
            evidence_type='azure_sql_configuration',
            resource_type='Microsoft.Sql/servers/databases',
            resource_id=db_identifier,
            subscription_id=self.subscription_id,
            resource_group=db_data.get('resource_group'),
            location=db_data.get('location'),
            data=db_data,
            compliance_status='pending',
            risk_level='unknown',
            frameworks=['SOC2', 'ISO27001', 'GDPR'],
            collection_timestamp=datetime.utcnow().isoformat(),
            evidence_hash=evidence_hash
        )
    
    async def _monitor_key_vaults(self):
        """Monitor Key Vault security configurations"""
        try:
            logger.info("📊 Monitoring Key Vaults")
            
            # Get all key vaults
            key_vaults = self.keyvault_client.vaults.list_by_subscription()
            self.metrics['api_calls_made'] += 1
            
            for vault in key_vaults:
                try:
                    vault_details = await self._get_key_vault_details(vault)
                    
                    # Create evidence item
                    evidence = await self._create_keyvault_evidence(vault_details, vault.name)
                    
                    # Run compliance checks
                    await self._evaluate_compliance(evidence)
                    
                    # Add to buffer
                    self.evidence_buffer.append(evidence)
                    self.metrics['evidence_collected'] += 1
                    self.metrics['resources_monitored'] += 1
                    
                except Exception as e:
                    logger.warning(f"⚠️ Failed to monitor Key Vault {vault.name}: {e}")
                    self.metrics['errors_encountered'] += 1
            
            logger.info("📊 Key Vault monitoring completed")
            
        except Exception as e:
            logger.error(f"❌ Key Vault monitoring failed: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _get_key_vault_details(self, vault) -> Dict:
        """Get comprehensive Key Vault security details"""
        
        vault_data = {
            'name': vault.name,
            'id': vault.id,
            'location': vault.location,
            'resource_group': vault.id.split('/')[4] if vault.id else None,
            'vault_uri': vault.properties.vault_uri if vault.properties else None,
            'tenant_id': vault.properties.tenant_id if vault.properties else None,
            'sku': {
                'name': vault.properties.sku.name,
                'family': vault.properties.sku.family
            } if vault.properties and vault.properties.sku else {},
            'access_policies': [
                {
                    'tenant_id': policy.tenant_id,
                    'object_id': policy.object_id,
                    'permissions': {
                        'keys': policy.permissions.keys if policy.permissions else [],
                        'secrets': policy.permissions.secrets if policy.permissions else [],
                        'certificates': policy.permissions.certificates if policy.permissions else []
                    }
                } for policy in vault.properties.access_policies
            ] if vault.properties and vault.properties.access_policies else [],
            'enabled_for_deployment': vault.properties.enabled_for_deployment if vault.properties else None,
            'enabled_for_disk_encryption': vault.properties.enabled_for_disk_encryption if vault.properties else None,
            'enabled_for_template_deployment': vault.properties.enabled_for_template_deployment if vault.properties else None,
            'enable_soft_delete': vault.properties.enable_soft_delete if vault.properties else None,
            'soft_delete_retention_in_days': vault.properties.soft_delete_retention_in_days if vault.properties else None,
            'enable_purge_protection': vault.properties.enable_purge_protection if vault.properties else None,
            'network_acls': {
                'bypass': vault.properties.network_acls.bypass if (vault.properties and vault.properties.network_acls) else None,
                'default_action': vault.properties.network_acls.default_action if (vault.properties and vault.properties.network_acls) else None,
                'ip_rules': [
                    {'value': rule.value} for rule in vault.properties.network_acls.ip_rules
                ] if vault.properties and vault.properties.network_acls and vault.properties.network_acls.ip_rules else [],
                'virtual_network_rules': [
                    {'id': rule.id} for rule in vault.properties.network_acls.virtual_network_rules
                ] if vault.properties and vault.properties.network_acls and vault.properties.network_acls.virtual_network_rules else []
            },
            'tags': dict(vault.tags) if vault.tags else {}
        }
        
        return vault_data
    
    async def _create_keyvault_evidence(self, vault_data: Dict, vault_name: str) -> AzureEvidence:
        """Create evidence item from Key Vault data"""
        
        # Calculate evidence hash
        evidence_hash = hashlib.sha256(
            json.dumps(vault_data, sort_keys=True, default=str).encode()
        ).hexdigest()
        
        return AzureEvidence(
            evidence_id=f"azure_keyvault_{vault_name}_{datetime.utcnow().timestamp()}",
            evidence_type='azure_keyvault_configuration',
            resource_type='Microsoft.KeyVault/vaults',
            resource_id=vault_name,
            subscription_id=self.subscription_id,
            resource_group=vault_data.get('resource_group'),
            location=vault_data.get('location'),
            data=vault_data,
            compliance_status='pending',
            risk_level='unknown',
            frameworks=['SOC2', 'ISO27001', 'GDPR'],
            collection_timestamp=datetime.utcnow().isoformat(),
            evidence_hash=evidence_hash
        )
    
    async def _monitor_network_security_groups(self):
        """Monitor Network Security Group configurations"""
        try:
            logger.info("📊 Monitoring Network Security Groups")
            
            # Get all NSGs
            nsgs = self.network_client.network_security_groups.list_all()
            self.metrics['api_calls_made'] += 1
            
            for nsg in nsgs:
                try:
                    nsg_details = await self._get_nsg_details(nsg)
                    
                    # Create evidence item
                    evidence = await self._create_nsg_evidence(nsg_details, nsg.name)
                    
                    # Run compliance checks
                    await self._evaluate_compliance(evidence)
                    
                    # Add to buffer
                    self.evidence_buffer.append(evidence)
                    self.metrics['evidence_collected'] += 1
                    self.metrics['resources_monitored'] += 1
                    
                except Exception as e:
                    logger.warning(f"⚠️ Failed to monitor NSG {nsg.name}: {e}")
                    self.metrics['errors_encountered'] += 1
            
            logger.info("📊 Network Security Group monitoring completed")
            
        except Exception as e:
            logger.error(f"❌ Network Security Group monitoring failed: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _get_nsg_details(self, nsg) -> Dict:
        """Get comprehensive NSG security details"""
        
        nsg_data = {
            'name': nsg.name,
            'id': nsg.id,
            'location': nsg.location,
            'resource_group': nsg.id.split('/')[4] if nsg.id else None,
            'provisioning_state': nsg.provisioning_state,
            'security_rules': [
                {
                    'name': rule.name,
                    'protocol': rule.protocol,
                    'source_port_range': rule.source_port_range,
                    'destination_port_range': rule.destination_port_range,
                    'source_address_prefix': rule.source_address_prefix,
                    'destination_address_prefix': rule.destination_address_prefix,
                    'access': rule.access,
                    'priority': rule.priority,
                    'direction': rule.direction,
                    'source_port_ranges': rule.source_port_ranges,
                    'destination_port_ranges': rule.destination_port_ranges,
                    'source_address_prefixes': rule.source_address_prefixes,
                    'destination_address_prefixes': rule.destination_address_prefixes
                } for rule in nsg.security_rules
            ] if nsg.security_rules else [],
            'default_security_rules': [
                {
                    'name': rule.name,
                    'protocol': rule.protocol,
                    'source_port_range': rule.source_port_range,
                    'destination_port_range': rule.destination_port_range,
                    'source_address_prefix': rule.source_address_prefix,
                    'destination_address_prefix': rule.destination_address_prefix,
                    'access': rule.access,
                    'priority': rule.priority,
                    'direction': rule.direction
                } for rule in nsg.default_security_rules
            ] if nsg.default_security_rules else [],
            'network_interfaces': [ni.id for ni in nsg.network_interfaces] if nsg.network_interfaces else [],
            'subnets': [subnet.id for subnet in nsg.subnets] if nsg.subnets else [],
            'tags': dict(nsg.tags) if nsg.tags else {}
        }
        
        return nsg_data
    
    async def _create_nsg_evidence(self, nsg_data: Dict, nsg_name: str) -> AzureEvidence:
        """Create evidence item from NSG data"""
        
        # Calculate evidence hash
        evidence_hash = hashlib.sha256(
            json.dumps(nsg_data, sort_keys=True, default=str).encode()
        ).hexdigest()
        
        return AzureEvidence(
            evidence_id=f"azure_nsg_{nsg_name}_{datetime.utcnow().timestamp()}",
            evidence_type='azure_nsg_configuration',
            resource_type='Microsoft.Network/networkSecurityGroups',
            resource_id=nsg_name,
            subscription_id=self.subscription_id,
            resource_group=nsg_data.get('resource_group'),
            location=nsg_data.get('location'),
            data=nsg_data,
            compliance_status='pending',
            risk_level='unknown',
            frameworks=['SOC2', 'ISO27001', 'GDPR'],
            collection_timestamp=datetime.utcnow().isoformat(),
            evidence_hash=evidence_hash
        )
    
    async def _monitor_azure_ad_policies(self):
        """Monitor Azure AD policies and user configurations"""
        try:
            logger.info("📊 Monitoring Azure AD policies")
            
            # Get role assignments
            role_assignments = self.auth_client.role_assignments.list()
            self.metrics['api_calls_made'] += 1
            
            ad_policy_data = {
                'role_assignments': [
                    {
                        'id': assignment.id,
                        'name': assignment.name,
                        'scope': assignment.scope,
                        'role_definition_id': assignment.role_definition_id,
                        'principal_id': assignment.principal_id,
                        'principal_type': assignment.principal_type
                    } for assignment in list(role_assignments)[:50]  # Limit to first 50
                ],
                'subscription_id': self.subscription_id,
                'collection_timestamp': datetime.utcnow().isoformat()
            }
            
            # Create evidence item
            evidence = await self._create_ad_evidence(ad_policy_data, 'azure_ad_policies')
            
            # Run compliance checks
            await self._evaluate_compliance(evidence)
            
            # Add to buffer
            self.evidence_buffer.append(evidence)
            self.metrics['evidence_collected'] += 1
            self.metrics['resources_monitored'] += 1
            
            logger.info("📊 Azure AD policy monitoring completed")
            
        except Exception as e:
            logger.error(f"❌ Azure AD policy monitoring failed: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _create_ad_evidence(self, ad_data: Dict, resource_name: str) -> AzureEvidence:
        """Create evidence item from Azure AD data"""
        
        # Calculate evidence hash
        evidence_hash = hashlib.sha256(
            json.dumps(ad_data, sort_keys=True, default=str).encode()
        ).hexdigest()
        
        return AzureEvidence(
            evidence_id=f"azure_ad_{resource_name}_{datetime.utcnow().timestamp()}",
            evidence_type='azure_ad_configuration',
            resource_type='Microsoft.Authorization/roleAssignments',
            resource_id=resource_name,
            subscription_id=self.subscription_id,
            resource_group=None,
            location='global',
            data=ad_data,
            compliance_status='pending',
            risk_level='unknown',
            frameworks=['SOC2', 'ISO27001', 'GDPR'],
            collection_timestamp=datetime.utcnow().isoformat(),
            evidence_hash=evidence_hash
        )
    
    async def _monitor_resource_compliance(self):
        """Monitor overall resource compliance and policies"""
        # Implementation for resource compliance monitoring
        logger.info("📊 Resource compliance monitoring (placeholder)")
        pass
    
    async def _evaluate_compliance(self, evidence: AzureEvidence):
        """Evaluate evidence against Azure compliance rules"""
        try:
            compliance_results = []
            
            for rule in self.compliance_rules:
                if self._rule_applies_to_evidence(rule, evidence):
                    result = await self._execute_compliance_check(rule, evidence)
                    compliance_results.append(result)
                    self.metrics['compliance_checks_run'] += 1
            
            # Calculate overall compliance status and risk level
            evidence.compliance_status = self._calculate_compliance_status(compliance_results)
            evidence.risk_level = self._calculate_risk_level(compliance_results)
            
            # Count security findings
            non_compliant_results = [r for r in compliance_results if r['status'] != 'compliant']
            self.metrics['security_findings'] += len(non_compliant_results)
            
        except Exception as e:
            logger.error(f"❌ Compliance evaluation failed: {e}")
            evidence.compliance_status = 'error'
            evidence.risk_level = 'unknown'
    
    def _rule_applies_to_evidence(self, rule: ComplianceRule, evidence: AzureEvidence) -> bool:
        """Check if compliance rule applies to evidence item"""
        return evidence.resource_type in rule.resource_types
    
    async def _execute_compliance_check(self, rule: ComplianceRule, evidence: AzureEvidence) -> Dict:
        """Execute compliance check rule against evidence"""
        # Azure-specific compliance logic
        score = 100
        findings = []
        
        # Example: Check for VM security configurations
        if evidence.resource_type == 'Microsoft.Compute/virtualMachines':
            vm_data = evidence.data
            
            # Check for boot diagnostics
            boot_diag = vm_data.get('diagnostics_profile', {}).get('boot_diagnostics', {})
            if not boot_diag.get('enabled'):
                score -= 20
                findings.append('Boot diagnostics not enabled')
            
            # Check for managed disks
            os_disk = vm_data.get('storage_profile', {}).get('os_disk', {})
            if not os_disk.get('managed_disk'):
                score -= 25
                findings.append('Unmanaged OS disk detected')
            
            # Check for disk encryption
            if not os_disk.get('encryption_settings'):
                score -= 30
                findings.append('Disk encryption not configured')
        
        # Example: Check for storage account security
        elif evidence.resource_type == 'Microsoft.Storage/storageAccounts':
            storage_data = evidence.data
            
            # Check for HTTPS only
            if not storage_data.get('enable_https_traffic_only'):
                score -= 40
                findings.append('HTTPS-only traffic not enforced')
            
            # Check for minimum TLS version
            if storage_data.get('minimum_tls_version') != 'TLS1_2':
                score -= 20
                findings.append('Minimum TLS version not set to 1.2')
            
            # Check for public access
            if storage_data.get('allow_blob_public_access'):
                score -= 35
                findings.append('Public blob access allowed')
        
        # Example: Check for SQL database security
        elif evidence.resource_type == 'Microsoft.Sql/servers/databases':
            sql_data = evidence.data
            
            # Check for transparent data encryption
            tde = sql_data.get('transparent_data_encryption', {})
            if tde.get('status') != 'Enabled':
                score -= 40
                findings.append('Transparent Data Encryption not enabled')
            
            # Check for auditing
            auditing = sql_data.get('auditing_policy', {})
            if auditing.get('state') != 'Enabled':
                score -= 30
                findings.append('Database auditing not enabled')
            
            # Check for threat detection
            threat_detection = sql_data.get('threat_detection', {})
            if threat_detection.get('state') != 'Enabled':
                score -= 25
                findings.append('Threat detection not enabled')
        
        return {
            'rule_id': rule.rule_id,
            'status': 'compliant' if score >= 80 else 'non_compliant',
            'findings': findings,
            'score': max(0, score)
        }
    
    def _calculate_compliance_status(self, results: List[Dict]) -> str:
        """Calculate overall compliance status from rule results"""
        if not results:
            return 'unknown'
        
        non_compliant = sum(1 for r in results if r['status'] != 'compliant')
        if non_compliant == 0:
            return 'compliant'
        elif non_compliant < len(results) / 2:
            return 'partial'
        else:
            return 'non_compliant'
    
    def _calculate_risk_level(self, results: List[Dict]) -> str:
        """Calculate risk level from compliance results"""
        if not results:
            return 'unknown'
        
        avg_score = sum(r['score'] for r in results) / len(results)
        
        if avg_score >= 90:
            return 'low'
        elif avg_score >= 70:
            return 'medium'
        elif avg_score >= 50:
            return 'high'
        else:
            return 'critical'
    
    async def _process_evidence_buffer(self):
        """Process and store evidence buffer to database"""
        if not self.evidence_buffer:
            return
        
        try:
            with self.db_connection.cursor() as cursor:
                for evidence in self.evidence_buffer:
                    # Store evidence in database
                    cursor.execute("""
                        INSERT INTO evidence_collection 
                        (id, agent_id, evidence_type, source_system, collection_timestamp, 
                         evidence_hash, evidence_size, compliance_framework, 
                         verification_status, metadata)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (evidence_hash) DO UPDATE SET
                        collection_timestamp = EXCLUDED.collection_timestamp,
                        metadata = EXCLUDED.metadata
                    """, (
                        evidence.evidence_id,
                        self.agent_id,
                        evidence.evidence_type,
                        'azure',
                        evidence.collection_timestamp,
                        evidence.evidence_hash,
                        len(json.dumps(evidence.data)),
                        ','.join(evidence.frameworks),
                        evidence.compliance_status,
                        json.dumps(asdict(evidence))
                    ))
            
            logger.info(f"📦 Stored {len(self.evidence_buffer)} evidence items to database")
            
            # Clear buffer
            self.evidence_buffer.clear()
            
        except Exception as e:
            logger.error(f"❌ Failed to store evidence: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _send_heartbeat(self):
        """Send heartbeat with metrics to orchestrator"""
        try:
            heartbeat_data = {
                'type': 'heartbeat',
                'agent_id': self.agent_id,
                'timestamp': datetime.utcnow().isoformat(),
                'metrics': {
                    'cpu_usage': 40.0,  # Would get actual CPU usage
                    'memory_usage_mb': 320,  # Would get actual memory usage
                    'response_time_ms': 180,  # Would calculate actual response time
                    'resources_monitored': self.metrics['resources_monitored'],
                    'evidence_collected': self.metrics['evidence_collected'],
                    'compliance_checks_run': self.metrics['compliance_checks_run'],
                    'security_findings': self.metrics['security_findings'],
                    'errors_encountered': self.metrics['errors_encountered']
                }
            }
            
            print(json.dumps(heartbeat_data))  # Send to orchestrator via stdout
            
        except Exception as e:
            logger.error(f"❌ Failed to send heartbeat: {e}")
    
    def _load_compliance_rules(self) -> List[ComplianceRule]:
        """Load Azure compliance rules for evidence evaluation"""
        # This would typically load from a configuration file or database
        return [
            ComplianceRule(
                rule_id='AZURE-SOC2-CC6.1',
                framework='SOC2',
                control_id='CC6.1',
                description='Logical and Physical Access Controls for Azure resources',
                severity='high',
                resource_types=['Microsoft.Compute/virtualMachines', 'Microsoft.Storage/storageAccounts'],
                check_function='azure_access_controls',
                remediation='Configure proper RBAC and network security groups'
            ),
            ComplianceRule(
                rule_id='AZURE-ISO27001-A.10.1.1',
                framework='ISO27001',
                control_id='A.10.1.1',
                description='Cryptographic controls for Azure data protection',
                severity='high',
                resource_types=['Microsoft.Storage/storageAccounts', 'Microsoft.Sql/servers/databases'],
                check_function='azure_encryption',
                remediation='Enable encryption at rest and in transit for all data storage'
            ),
            ComplianceRule(
                rule_id='AZURE-GDPR-32',
                framework='GDPR',
                control_id='Article 32',
                description='Security of processing for Azure data storage',
                severity='high',
                resource_types=['Microsoft.Storage/storageAccounts', 'Microsoft.Sql/servers/databases', 'Microsoft.KeyVault/vaults'],
                check_function='azure_data_security',
                remediation='Implement appropriate technical and organizational measures'
            )
        ]
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get agent health status for monitoring"""
        return {
            'agent_id': self.agent_id,
            'status': 'healthy',
            'subscription_id': self.subscription_id,
            'metrics': self.metrics,
            'buffer_size': len(self.evidence_buffer),
            'database_connected': self.db_connection is not None,
            'azure_authenticated': self.credential is not None,
            'last_heartbeat': datetime.utcnow().isoformat()
        }
    
    async def shutdown(self):
        """Graceful shutdown of the agent"""
        logger.info(f"🛑 Shutting down Azure Monitor {self.agent_id}")
        
        # Process remaining evidence
        if self.evidence_buffer:
            await self._process_evidence_buffer()
        
        # Close database connection
        if self.db_connection:
            self.db_connection.close()
        
        logger.info("✅ Azure Monitor shutdown complete")

# Main execution for standalone testing
async def main():
    """Main function for testing the Azure Monitor"""
    
    # Test configuration
    config = {
        'agent_id': 'azure-monitor-test',
        'subscription_id': 'test-subscription-id',  # Would use real subscription ID
        'tenant_id': 'test-tenant-id',  # Would use real tenant ID
        'client_id': 'test-client-id',  # Would use real client ID
        'client_secret': 'test-client-secret',  # Would use real client secret
        'monitoring_interval': 900,
        'database_url': 'postgresql://localhost/velocity_agents'
    }
    
    try:
        # Create and start monitor
        monitor = AzureMonitor(config)
        
        # Run health check
        health = await monitor.get_health_status()
        print(f"Agent Health: {json.dumps(health, indent=2)}")
        
        # Start monitoring (would run indefinitely in production)
        # await monitor.start_monitoring()
        
    except Exception as e:
        logger.error(f"❌ Agent startup failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())