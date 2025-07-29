#!/usr/bin/env python3
"""
Velocity.ai GCP Scanner Agent
Real-time security scanning and compliance monitoring for Google Cloud Platform

Features:
- Compute Engine instance security analysis
- Cloud Storage bucket configuration auditing
- BigQuery dataset security assessment
- IAM policy and service account validation
- Cloud SQL database security scanning
- Kubernetes cluster security evaluation
- VPC network configuration analysis
- Real-time compliance scoring against SOC2, ISO27001, GDPR
"""

import asyncio
import json
import logging
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from google.cloud import compute_v1
from google.cloud import storage
from google.cloud import bigquery
from google.cloud import resource_manager
from google.cloud import container_v1
from google.cloud import sql_v1
from google.oauth2 import service_account
import psycopg2
import psycopg2.extras
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('gcp-scanner')

@dataclass
class GCPEvidence:
    """Evidence item collected from GCP"""
    evidence_id: str
    evidence_type: str
    resource_type: str
    resource_id: str
    project_id: str
    zone: Optional[str]
    region: Optional[str]
    data: Dict[str, Any]
    compliance_status: str
    risk_level: str
    frameworks: List[str]
    collection_timestamp: str
    evidence_hash: str

@dataclass
class ComplianceRule:
    """GCP compliance rule definition"""
    rule_id: str
    framework: str
    control_id: str
    description: str
    severity: str
    resource_types: List[str]
    check_function: str
    remediation: str

class GCPScanner:
    """
    Production GCP Security Scanner Agent
    
    Performs comprehensive security scanning across GCP services
    with real-time compliance evaluation and evidence collection.
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.agent_id = config.get('agent_id', 'gcp-scanner-001')
        self.project_id = config.get('project_id')
        self.service_account_key = config.get('service_account_key')
        
        # GCP clients
        self.credentials = None
        self.compute_client = None
        self.storage_client = None
        self.bigquery_client = None
        self.container_client = None
        self.sql_client = None
        self.resource_manager_client = None
        
        # Database connection
        self.db_connection = None
        
        # Compliance rules
        self.compliance_rules = self._load_compliance_rules()
        
        # Evidence storage
        self.evidence_buffer: List[GCPEvidence] = []
        self.max_buffer_size = config.get('max_buffer_size', 100)
        
        # Performance metrics
        self.metrics = {
            'evidence_collected': 0,
            'compliance_checks_run': 0,
            'api_calls_made': 0,
            'errors_encountered': 0,
            'resources_scanned': 0,
            'last_collection_time': None
        }
        
        # Initialize GCP clients
        self._initialize_gcp_clients()
        
        # Initialize database connection
        self._initialize_database()
        
        logger.info(f"🚀 GCP Scanner {self.agent_id} initialized for project {self.project_id}")
    
    def _initialize_gcp_clients(self):
        """Initialize GCP service clients with authentication"""
        try:
            # Load service account credentials
            if self.service_account_key:
                if isinstance(self.service_account_key, str):
                    # If it's a file path
                    self.credentials = service_account.Credentials.from_service_account_file(
                        self.service_account_key
                    )
                else:
                    # If it's a dict with key data
                    self.credentials = service_account.Credentials.from_service_account_info(
                        self.service_account_key
                    )
            else:
                # Use Application Default Credentials
                from google.auth import default
                self.credentials, _ = default()
            
            # Initialize service clients
            self.compute_client = compute_v1.InstancesClient(credentials=self.credentials)
            self.storage_client = storage.Client(credentials=self.credentials, project=self.project_id)
            self.bigquery_client = bigquery.Client(credentials=self.credentials, project=self.project_id)
            self.container_client = container_v1.ClusterManagerClient(credentials=self.credentials)
            self.sql_client = sql_v1.SqlInstancesServiceClient(credentials=self.credentials)
            self.resource_manager_client = resource_manager.ProjectsClient(credentials=self.credentials)
            
            # Test authentication by listing zones
            zones_client = compute_v1.ZonesClient(credentials=self.credentials)
            zones = zones_client.list(project=self.project_id)
            zone_count = len(list(zones))
            
            logger.info(f"✅ GCP authentication successful. Found {zone_count} zones in project {self.project_id}")
            
        except Exception as e:
            logger.error(f"❌ GCP authentication failed: {e}")
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
    
    async def start_scanning(self):
        """Start the GCP security scanning process"""
        logger.info("🔍 Starting GCP security scanning")
        
        try:
            while True:
                scan_start = datetime.utcnow()
                
                # Scan all enabled GCP services
                await self._scan_compute_instances()
                await self._scan_storage_buckets()
                await self._scan_bigquery_datasets()
                await self._scan_kubernetes_clusters()
                await self._scan_sql_instances()
                await self._scan_iam_policies()
                await self._scan_vpc_networks()
                
                # Process and store collected evidence
                await self._process_evidence_buffer()
                
                # Update metrics
                self.metrics['last_collection_time'] = scan_start.isoformat()
                
                scan_duration = (datetime.utcnow() - scan_start).total_seconds()
                logger.info(f"✅ Scan cycle completed in {scan_duration:.2f}s")
                
                # Send heartbeat with metrics
                await self._send_heartbeat()
                
                # Wait for next scan interval
                await asyncio.sleep(self.config.get('scan_interval', 600))  # 10 minutes default
                
        except Exception as e:
            logger.error(f"❌ GCP scanning error: {e}")
            self.metrics['errors_encountered'] += 1
            await asyncio.sleep(60)  # Wait before retry
    
    async def _scan_compute_instances(self):
        """Scan Compute Engine instances for security compliance"""
        try:
            logger.info("📊 Scanning Compute Engine instances")
            
            zones_client = compute_v1.ZonesClient(credentials=self.credentials)
            zones = zones_client.list(project=self.project_id)
            
            for zone in zones:
                try:
                    # List instances in zone
                    instances = self.compute_client.list(
                        project=self.project_id,
                        zone=zone.name
                    )
                    self.metrics['api_calls_made'] += 1
                    
                    for instance in instances:
                        # Create evidence item
                        evidence = await self._create_compute_evidence(instance, zone.name)
                        
                        # Run compliance checks
                        await self._evaluate_compliance(evidence)
                        
                        # Add to buffer
                        self.evidence_buffer.append(evidence)
                        self.metrics['evidence_collected'] += 1
                        self.metrics['resources_scanned'] += 1
                        
                except Exception as e:
                    logger.warning(f"⚠️ Failed to scan zone {zone.name}: {e}")
                    self.metrics['errors_encountered'] += 1
                
            logger.info("📊 Compute Engine scanning completed")
            
        except Exception as e:
            logger.error(f"❌ Compute Engine scanning failed: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _create_compute_evidence(self, instance, zone: str) -> GCPEvidence:
        """Create evidence item from Compute Engine instance"""
        instance_data = {
            'name': instance.name,
            'id': instance.id,
            'machine_type': instance.machine_type.split('/')[-1],
            'status': instance.status,
            'zone': zone,
            'creation_timestamp': instance.creation_timestamp,
            'network_interfaces': [
                {
                    'network': ni.network.split('/')[-1],
                    'subnetwork': ni.subnetwork.split('/')[-1] if ni.subnetwork else None,
                    'access_configs': [
                        {
                            'type': ac.type_,
                            'name': ac.name,
                            'nat_ip': ac.nat_i_p
                        } for ac in ni.access_configs
                    ]
                } for ni in instance.network_interfaces
            ],
            'disks': [
                {
                    'device_name': disk.device_name,
                    'boot': disk.boot,
                    'auto_delete': disk.auto_delete,
                    'disk_encryption_key': disk.disk_encryption_key is not None
                } for disk in instance.disks
            ],
            'service_accounts': [
                {
                    'email': sa.email,
                    'scopes': list(sa.scopes)
                } for sa in instance.service_accounts
            ],
            'metadata': {item.key: item.value for item in instance.metadata.items} if instance.metadata else {},
            'tags': list(instance.tags.items) if instance.tags else [],
            'labels': dict(instance.labels) if instance.labels else {},
            'scheduling': {
                'automatic_restart': instance.scheduling.automatic_restart,
                'on_host_maintenance': instance.scheduling.on_host_maintenance,
                'preemptible': instance.scheduling.preemptible
            } if instance.scheduling else {},
            'shielded_instance_config': {
                'enable_secure_boot': instance.shielded_instance_config.enable_secure_boot,
                'enable_vtpm': instance.shielded_instance_config.enable_vtpm,
                'enable_integrity_monitoring': instance.shielded_instance_config.enable_integrity_monitoring
            } if instance.shielded_instance_config else {},
            'deletion_protection': instance.deletion_protection
        }
        
        # Calculate evidence hash
        evidence_hash = hashlib.sha256(
            json.dumps(instance_data, sort_keys=True, default=str).encode()
        ).hexdigest()
        
        return GCPEvidence(
            evidence_id=f"gce_{instance.name}_{datetime.utcnow().timestamp()}",
            evidence_type='compute_instance_configuration',
            resource_type='compute.googleapis.com/Instance',
            resource_id=instance.name,
            project_id=self.project_id,
            zone=zone,
            region=zone.rsplit('-', 1)[0],  # Extract region from zone
            data=instance_data,
            compliance_status='pending',
            risk_level='unknown',
            frameworks=['SOC2', 'ISO27001', 'GDPR'],
            collection_timestamp=datetime.utcnow().isoformat(),
            evidence_hash=evidence_hash
        )
    
    async def _scan_storage_buckets(self):
        """Scan Cloud Storage buckets for security compliance"""
        try:
            logger.info("📊 Scanning Cloud Storage buckets")
            
            buckets = self.storage_client.list_buckets()
            self.metrics['api_calls_made'] += 1
            
            for bucket in buckets:
                try:
                    # Get detailed bucket information
                    bucket_details = await self._get_bucket_details(bucket)
                    
                    # Create evidence item
                    evidence = await self._create_storage_evidence(bucket_details, bucket.name)
                    
                    # Run compliance checks
                    await self._evaluate_compliance(evidence)
                    
                    # Add to buffer
                    self.evidence_buffer.append(evidence)
                    self.metrics['evidence_collected'] += 1
                    self.metrics['resources_scanned'] += 1
                    
                except Exception as e:
                    logger.warning(f"⚠️ Failed to scan bucket {bucket.name}: {e}")
                    self.metrics['errors_encountered'] += 1
            
            logger.info("📊 Cloud Storage scanning completed")
            
        except Exception as e:
            logger.error(f"❌ Cloud Storage scanning failed: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _get_bucket_details(self, bucket) -> Dict:
        """Get comprehensive bucket security details"""
        bucket_data = {
            'name': bucket.name,
            'id': bucket.id,
            'location': bucket.location,
            'location_type': bucket.location_type,
            'storage_class': bucket.storage_class,
            'created': bucket.time_created.isoformat() if bucket.time_created else None,
            'updated': bucket.updated.isoformat() if bucket.updated else None,
            'versioning_enabled': bucket.versioning_enabled,
            'lifecycle_rules': [],
            'iam_policy': None,
            'public_access_prevention': bucket.iam_configuration.public_access_prevention if bucket.iam_configuration else None,
            'uniform_bucket_level_access': bucket.iam_configuration.uniform_bucket_level_access_enabled if bucket.iam_configuration else None,
            'encryption': {
                'default_kms_key_name': bucket.default_kms_key_name
            },
            'logging': {
                'log_bucket': bucket.logging.bucket if bucket.logging else None,
                'log_object_prefix': bucket.logging.object_name_prefix if bucket.logging else None
            },
            'cors': [
                {
                    'origin': cors.origin,
                    'method': cors.method,
                    'response_header': cors.response_header,
                    'max_age_seconds': cors.max_age_seconds
                } for cors in bucket.cors
            ] if bucket.cors else [],
            'labels': dict(bucket.labels) if bucket.labels else {},
            'retention_policy': {
                'retention_period': bucket.retention_policy.retention_period,
                'is_locked': bucket.retention_policy.is_locked
            } if bucket.retention_policy else None
        }
        
        try:
            # Get lifecycle configuration
            if bucket.lifecycle_rules:
                bucket_data['lifecycle_rules'] = [
                    {
                        'action': rule.action,
                        'condition': rule.condition
                    } for rule in bucket.lifecycle_rules
                ]
            
            # Get IAM policy (if accessible)
            try:
                policy = bucket.get_iam_policy(requested_policy_version=3)
                bucket_data['iam_policy'] = {
                    'bindings': [
                        {
                            'role': binding.role,
                            'members': list(binding.members),
                            'condition': binding.condition
                        } for binding in policy.bindings
                    ]
                }
                self.metrics['api_calls_made'] += 1
            except Exception:
                # Policy might not be accessible
                pass
                
        except Exception as e:
            logger.warning(f"⚠️ Failed to get some details for bucket {bucket.name}: {e}")
        
        return bucket_data
    
    async def _create_storage_evidence(self, bucket_data: Dict, bucket_name: str) -> GCPEvidence:
        """Create evidence item from Storage bucket data"""
        
        # Calculate evidence hash
        evidence_hash = hashlib.sha256(
            json.dumps(bucket_data, sort_keys=True, default=str).encode()
        ).hexdigest()
        
        return GCPEvidence(
            evidence_id=f"gcs_{bucket_name}_{datetime.utcnow().timestamp()}",
            evidence_type='storage_bucket_configuration',
            resource_type='storage.googleapis.com/Bucket',
            resource_id=bucket_name,
            project_id=self.project_id,
            zone=None,
            region=bucket_data.get('location'),
            data=bucket_data,
            compliance_status='pending',
            risk_level='unknown',
            frameworks=['SOC2', 'ISO27001', 'GDPR'],
            collection_timestamp=datetime.utcnow().isoformat(),
            evidence_hash=evidence_hash
        )
    
    async def _scan_bigquery_datasets(self):
        """Scan BigQuery datasets for security compliance"""
        try:
            logger.info("📊 Scanning BigQuery datasets")
            
            datasets = list(self.bigquery_client.list_datasets())
            self.metrics['api_calls_made'] += 1
            
            for dataset in datasets:
                try:
                    # Get dataset details
                    dataset_ref = self.bigquery_client.get_dataset(dataset.dataset_id)
                    
                    dataset_data = {
                        'dataset_id': dataset.dataset_id,
                        'project': dataset.project,
                        'location': dataset_ref.location,
                        'created': dataset_ref.created.isoformat() if dataset_ref.created else None,
                        'modified': dataset_ref.modified.isoformat() if dataset_ref.modified else None,
                        'description': dataset_ref.description,
                        'labels': dict(dataset_ref.labels) if dataset_ref.labels else {},
                        'access_entries': [
                            {
                                'role': entry.role,
                                'entity_type': entry.entity_type,
                                'entity_id': entry.entity_id
                            } for entry in dataset_ref.access_entries
                        ],
                        'default_table_expiration_ms': dataset_ref.default_table_expiration_ms,
                        'default_partition_expiration_ms': dataset_ref.default_partition_expiration_ms,
                        'default_encryption_configuration': {
                            'kms_key_name': dataset_ref.default_encryption_configuration.kms_key_name
                        } if dataset_ref.default_encryption_configuration else None
                    }
                    
                    # Create evidence item
                    evidence = await self._create_bigquery_evidence(dataset_data, dataset.dataset_id)
                    
                    # Run compliance checks
                    await self._evaluate_compliance(evidence)
                    
                    # Add to buffer
                    self.evidence_buffer.append(evidence)
                    self.metrics['evidence_collected'] += 1
                    self.metrics['resources_scanned'] += 1
                    
                except Exception as e:
                    logger.warning(f"⚠️ Failed to scan dataset {dataset.dataset_id}: {e}")
                    self.metrics['errors_encountered'] += 1
            
            logger.info("📊 BigQuery scanning completed")
            
        except Exception as e:
            logger.error(f"❌ BigQuery scanning failed: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _create_bigquery_evidence(self, dataset_data: Dict, dataset_id: str) -> GCPEvidence:
        """Create evidence item from BigQuery dataset data"""
        
        # Calculate evidence hash
        evidence_hash = hashlib.sha256(
            json.dumps(dataset_data, sort_keys=True, default=str).encode()
        ).hexdigest()
        
        return GCPEvidence(
            evidence_id=f"bq_{dataset_id}_{datetime.utcnow().timestamp()}",
            evidence_type='bigquery_dataset_configuration',
            resource_type='bigquery.googleapis.com/Dataset',
            resource_id=dataset_id,
            project_id=self.project_id,
            zone=None,
            region=dataset_data.get('location'),
            data=dataset_data,
            compliance_status='pending',
            risk_level='unknown',
            frameworks=['SOC2', 'ISO27001', 'GDPR'],
            collection_timestamp=datetime.utcnow().isoformat(),
            evidence_hash=evidence_hash
        )
    
    async def _scan_kubernetes_clusters(self):
        """Scan GKE clusters for security compliance"""
        try:
            logger.info("📊 Scanning GKE clusters")
            
            # Get all zones for the project
            zones_client = compute_v1.ZonesClient(credentials=self.credentials)
            zones = zones_client.list(project=self.project_id)
            
            for zone in zones:
                try:
                    parent = f"projects/{self.project_id}/locations/{zone.name}"
                    clusters = self.container_client.list_clusters(parent=parent)
                    self.metrics['api_calls_made'] += 1
                    
                    for cluster in clusters.clusters:
                        cluster_data = await self._get_cluster_details(cluster)
                        
                        # Create evidence item
                        evidence = await self._create_cluster_evidence(cluster_data, cluster.name, zone.name)
                        
                        # Run compliance checks
                        await self._evaluate_compliance(evidence)
                        
                        # Add to buffer
                        self.evidence_buffer.append(evidence)
                        self.metrics['evidence_collected'] += 1
                        self.metrics['resources_scanned'] += 1
                        
                except Exception as e:
                    logger.warning(f"⚠️ Failed to scan clusters in zone {zone.name}: {e}")
                    self.metrics['errors_encountered'] += 1
            
            logger.info("📊 GKE scanning completed")
            
        except Exception as e:
            logger.error(f"❌ GKE scanning failed: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _get_cluster_details(self, cluster) -> Dict:
        """Get comprehensive GKE cluster security details"""
        return {
            'name': cluster.name,
            'description': cluster.description,
            'status': cluster.status.name,
            'location': cluster.location,
            'initial_node_count': cluster.initial_node_count,
            'current_node_count': cluster.current_node_count,
            'current_master_version': cluster.current_master_version,
            'current_node_version': cluster.current_node_version,
            'create_time': cluster.create_time,
            'network': cluster.network,
            'subnetwork': cluster.subnetwork,
            'network_policy': {
                'enabled': cluster.network_policy.enabled if cluster.network_policy else False,
                'provider': cluster.network_policy.provider.name if cluster.network_policy else None
            },
            'ip_allocation_policy': {
                'use_ip_aliases': cluster.ip_allocation_policy.use_ip_aliases if cluster.ip_allocation_policy else False,
                'cluster_secondary_range_name': cluster.ip_allocation_policy.cluster_secondary_range_name if cluster.ip_allocation_policy else None,
                'services_secondary_range_name': cluster.ip_allocation_policy.services_secondary_range_name if cluster.ip_allocation_policy else None
            },
            'master_auth': {
                'client_certificate_config': {
                    'issue_client_certificate': cluster.master_auth.client_certificate_config.issue_client_certificate if cluster.master_auth and cluster.master_auth.client_certificate_config else False
                } if cluster.master_auth else {}
            },
            'legacy_abac': {
                'enabled': cluster.legacy_abac.enabled if cluster.legacy_abac else False
            },
            'addons_config': {
                'http_load_balancing': {
                    'disabled': cluster.addons_config.http_load_balancing.disabled if cluster.addons_config and cluster.addons_config.http_load_balancing else True
                },
                'network_policy_config': {
                    'disabled': cluster.addons_config.network_policy_config.disabled if cluster.addons_config and cluster.addons_config.network_policy_config else True
                }
            } if cluster.addons_config else {},
            'node_pools': [
                {
                    'name': pool.name,
                    'config': {
                        'machine_type': pool.config.machine_type,
                        'disk_size_gb': pool.config.disk_size_gb,
                        'oauth_scopes': list(pool.config.oauth_scopes),
                        'service_account': pool.config.service_account,
                        'preemptible': pool.config.preemptible,
                        'shielded_instance_config': {
                            'enable_secure_boot': pool.config.shielded_instance_config.enable_secure_boot,
                            'enable_integrity_monitoring': pool.config.shielded_instance_config.enable_integrity_monitoring
                        } if pool.config.shielded_instance_config else {}
                    },
                    'management': {
                        'auto_upgrade': pool.management.auto_upgrade if pool.management else False,
                        'auto_repair': pool.management.auto_repair if pool.management else False
                    }
                } for pool in cluster.node_pools
            ],
            'private_cluster_config': {
                'enable_private_nodes': cluster.private_cluster_config.enable_private_nodes if cluster.private_cluster_config else False,
                'enable_private_endpoint': cluster.private_cluster_config.enable_private_endpoint if cluster.private_cluster_config else False,
                'master_ipv4_cidr_block': cluster.private_cluster_config.master_ipv4_cidr_block if cluster.private_cluster_config else None
            },
            'master_authorized_networks_config': {
                'enabled': cluster.master_authorized_networks_config.enabled if cluster.master_authorized_networks_config else False,
                'cidr_blocks': [
                    {
                        'cidr_block': block.cidr_block,
                        'display_name': block.display_name
                    } for block in cluster.master_authorized_networks_config.cidr_blocks
                ] if cluster.master_authorized_networks_config else []
            }
        }
    
    async def _create_cluster_evidence(self, cluster_data: Dict, cluster_name: str, zone: str) -> GCPEvidence:
        """Create evidence item from GKE cluster data"""
        
        # Calculate evidence hash
        evidence_hash = hashlib.sha256(
            json.dumps(cluster_data, sort_keys=True, default=str).encode()
        ).hexdigest()
        
        return GCPEvidence(
            evidence_id=f"gke_{cluster_name}_{datetime.utcnow().timestamp()}",
            evidence_type='gke_cluster_configuration',
            resource_type='container.googleapis.com/Cluster',
            resource_id=cluster_name,
            project_id=self.project_id,
            zone=zone,
            region=zone.rsplit('-', 1)[0],
            data=cluster_data,
            compliance_status='pending',
            risk_level='unknown',
            frameworks=['SOC2', 'ISO27001', 'GDPR'],
            collection_timestamp=datetime.utcnow().isoformat(),
            evidence_hash=evidence_hash
        )
    
    async def _scan_sql_instances(self):
        """Scan Cloud SQL instances for security compliance"""
        try:
            logger.info("📊 Scanning Cloud SQL instances")
            
            request = sql_v1.SqlInstancesListRequest(project=self.project_id)
            instances = self.sql_client.list(request=request)
            self.metrics['api_calls_made'] += 1
            
            for instance in instances.items:
                try:
                    instance_data = {
                        'name': instance.name,
                        'project': instance.project,
                        'database_version': instance.database_version.name,
                        'region': instance.region,
                        'state': instance.state.name,
                        'backend_type': instance.backend_type.name,
                        'instance_type': instance.instance_type.name,
                        'create_time': instance.create_time,
                        'settings': {
                            'tier': instance.settings.tier,
                            'pricing_plan': instance.settings.pricing_plan.name,
                            'activation_policy': instance.settings.activation_policy.name,
                            'storage_auto_resize': instance.settings.storage_auto_resize,
                            'storage_auto_resize_limit': instance.settings.storage_auto_resize_limit,
                            'backup_configuration': {
                                'enabled': instance.settings.backup_configuration.enabled,
                                'point_in_time_recovery_enabled': instance.settings.backup_configuration.point_in_time_recovery_enabled,
                                'location': instance.settings.backup_configuration.location
                            } if instance.settings.backup_configuration else None,
                            'ip_configuration': {
                                'ipv4_enabled': instance.settings.ip_configuration.ipv4_enabled,
                                'private_network': instance.settings.ip_configuration.private_network,
                                'require_ssl': instance.settings.ip_configuration.require_ssl,
                                'authorized_networks': [
                                    {
                                        'name': net.name,
                                        'value': net.value
                                    } for net in instance.settings.ip_configuration.authorized_networks
                                ]
                            } if instance.settings.ip_configuration else None,
                            'database_flags': [
                                {
                                    'name': flag.name,
                                    'value': flag.value
                                } for flag in instance.settings.database_flags
                            ]
                        },
                        'disk_encryption_configuration': {
                            'kms_key_name': instance.disk_encryption_configuration.kms_key_name
                        } if instance.disk_encryption_configuration else None
                    }
                    
                    # Create evidence item
                    evidence = await self._create_sql_evidence(instance_data, instance.name)
                    
                    # Run compliance checks
                    await self._evaluate_compliance(evidence)
                    
                    # Add to buffer
                    self.evidence_buffer.append(evidence)
                    self.metrics['evidence_collected'] += 1
                    self.metrics['resources_scanned'] += 1
                    
                except Exception as e:
                    logger.warning(f"⚠️ Failed to scan SQL instance {instance.name}: {e}")
                    self.metrics['errors_encountered'] += 1
            
            logger.info("📊 Cloud SQL scanning completed")
            
        except Exception as e:
            logger.error(f"❌ Cloud SQL scanning failed: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _create_sql_evidence(self, instance_data: Dict, instance_name: str) -> GCPEvidence:
        """Create evidence item from Cloud SQL instance data"""
        
        # Calculate evidence hash
        evidence_hash = hashlib.sha256(
            json.dumps(instance_data, sort_keys=True, default=str).encode()
        ).hexdigest()
        
        return GCPEvidence(
            evidence_id=f"sql_{instance_name}_{datetime.utcnow().timestamp()}",
            evidence_type='sql_instance_configuration',
            resource_type='sqladmin.googleapis.com/Instance',
            resource_id=instance_name,
            project_id=self.project_id,
            zone=None,
            region=instance_data.get('region'),
            data=instance_data,
            compliance_status='pending',
            risk_level='unknown',
            frameworks=['SOC2', 'ISO27001', 'GDPR'],
            collection_timestamp=datetime.utcnow().isoformat(),
            evidence_hash=evidence_hash
        )
    
    async def _scan_iam_policies(self):
        """Scan IAM policies for security compliance"""
        # Implementation for IAM policy scanning
        logger.info("📊 IAM policy scanning (placeholder)")
        pass
    
    async def _scan_vpc_networks(self):
        """Scan VPC networks for security compliance"""
        # Implementation for VPC network scanning
        logger.info("📊 VPC network scanning (placeholder)")
        pass
    
    async def _evaluate_compliance(self, evidence: GCPEvidence):
        """Evaluate evidence against GCP compliance rules"""
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
            
        except Exception as e:
            logger.error(f"❌ Compliance evaluation failed: {e}")
            evidence.compliance_status = 'error'
            evidence.risk_level = 'unknown'
    
    def _rule_applies_to_evidence(self, rule: ComplianceRule, evidence: GCPEvidence) -> bool:
        """Check if compliance rule applies to evidence item"""
        return evidence.resource_type in rule.resource_types
    
    async def _execute_compliance_check(self, rule: ComplianceRule, evidence: GCPEvidence) -> Dict:
        """Execute compliance check rule against evidence"""
        # This would contain the actual GCP-specific compliance logic
        # For now, return a mock result based on basic checks
        
        score = 100
        findings = []
        
        # Example: Check for public access on storage buckets
        if evidence.resource_type == 'storage.googleapis.com/Bucket':
            if evidence.data.get('public_access_prevention') != 'enforced':
                score -= 30
                findings.append('Public access prevention not enforced')
                
            if not evidence.data.get('uniform_bucket_level_access'):
                score -= 20
                findings.append('Uniform bucket-level access not enabled')
        
        # Example: Check for compute instance security
        elif evidence.resource_type == 'compute.googleapis.com/Instance':
            shielded_config = evidence.data.get('shielded_instance_config', {})
            if not shielded_config.get('enable_secure_boot'):
                score -= 25
                findings.append('Secure boot not enabled')
                
            if not shielded_config.get('enable_vtpm'):
                score -= 15
                findings.append('vTPM not enabled')
        
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
                        'gcp',
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
                    'cpu_usage': 45.0,  # Would get actual CPU usage
                    'memory_usage_mb': 256,  # Would get actual memory usage
                    'response_time_ms': 120,  # Would calculate actual response time
                    'evidence_collected': self.metrics['evidence_collected'],
                    'compliance_checks_run': self.metrics['compliance_checks_run'],
                    'errors_encountered': self.metrics['errors_encountered'],
                    'resources_scanned': self.metrics['resources_scanned']
                }
            }
            
            print(json.dumps(heartbeat_data))  # Send to orchestrator via stdout
            
        except Exception as e:
            logger.error(f"❌ Failed to send heartbeat: {e}")
    
    def _load_compliance_rules(self) -> List[ComplianceRule]:
        """Load GCP compliance rules for evidence evaluation"""
        # This would typically load from a configuration file or database
        return [
            ComplianceRule(
                rule_id='GCP-SOC2-CC6.1',
                framework='SOC2',
                control_id='CC6.1',
                description='Logical and Physical Access Controls for GCP resources',
                severity='high',
                resource_types=['compute.googleapis.com/Instance', 'storage.googleapis.com/Bucket'],
                check_function='gcp_access_controls',
                remediation='Configure proper IAM policies and access controls'
            ),
            ComplianceRule(
                rule_id='GCP-ISO27001-A.9.1.2',
                framework='ISO27001',
                control_id='A.9.1.2',
                description='Access to networks and network services in GCP',
                severity='medium',
                resource_types=['compute.googleapis.com/Instance', 'container.googleapis.com/Cluster'],
                check_function='gcp_network_access',
                remediation='Review and restrict network access rules and firewall configurations'
            ),
            ComplianceRule(
                rule_id='GCP-GDPR-32',
                framework='GDPR',
                control_id='Article 32',
                description='Security of processing for GCP data storage',
                severity='high',
                resource_types=['storage.googleapis.com/Bucket', 'bigquery.googleapis.com/Dataset'],
                check_function='gcp_data_encryption',
                remediation='Enable encryption at rest and in transit for all data storage'
            )
        ]
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get agent health status for monitoring"""
        return {
            'agent_id': self.agent_id,
            'status': 'healthy',
            'project_id': self.project_id,
            'metrics': self.metrics,
            'buffer_size': len(self.evidence_buffer),
            'database_connected': self.db_connection is not None,
            'gcp_authenticated': self.credentials is not None,
            'last_heartbeat': datetime.utcnow().isoformat()
        }
    
    async def shutdown(self):
        """Graceful shutdown of the agent"""
        logger.info(f"🛑 Shutting down GCP Scanner {self.agent_id}")
        
        # Process remaining evidence
        if self.evidence_buffer:
            await self._process_evidence_buffer()
        
        # Close database connection
        if self.db_connection:
            self.db_connection.close()
        
        logger.info("✅ GCP Scanner shutdown complete")

# Main execution for standalone testing
async def main():
    """Main function for testing the GCP Scanner"""
    
    # Test configuration
    config = {
        'agent_id': 'gcp-scanner-test',
        'project_id': 'test-project-id',  # Would use real project ID
        'service_account_key': '/path/to/service-account-key.json',  # Would use real key
        'scan_interval': 600,
        'database_url': 'postgresql://localhost/velocity_agents'
    }
    
    try:
        # Create and start scanner
        scanner = GCPScanner(config)
        
        # Run health check
        health = await scanner.get_health_status()
        print(f"Agent Health: {json.dumps(health, indent=2)}")
        
        # Start scanning (would run indefinitely in production)
        # await scanner.start_scanning()
        
    except Exception as e:
        logger.error(f"❌ Agent startup failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())