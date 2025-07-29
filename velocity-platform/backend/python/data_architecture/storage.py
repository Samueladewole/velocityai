"""
Data Lake Storage Architecture for ERIP
Reusable storage abstraction layer supporting multiple cloud providers and storage types
"""

from typing import Dict, List, Optional, Any, Union, Iterator, AsyncIterator
from datetime import datetime, timedelta
from abc import ABC, abstractmethod
import asyncio
import json
import os
import hashlib
from enum import Enum
import structlog
from pydantic import BaseModel, Field
import mimetypes
from pathlib import Path

from .cloud_connectors import CloudConnector, MultiCloudManager, CloudProvider

logger = structlog.get_logger()

class StorageType(str, Enum):
    """Storage layer types"""
    HOT = "hot"        # Frequently accessed data
    WARM = "warm"      # Occasionally accessed data
    COLD = "cold"      # Rarely accessed data
    ARCHIVE = "archive" # Long-term archival

class CompressionType(str, Enum):
    """Supported compression algorithms"""
    NONE = "none"
    GZIP = "gzip"
    BZIP2 = "bzip2"
    LZ4 = "lz4"
    SNAPPY = "snappy"

class PartitionStrategy(str, Enum):
    """Data partitioning strategies"""
    DATE = "date"           # Partition by date (year/month/day)
    HASH = "hash"           # Hash-based partitioning
    RANGE = "range"         # Range-based partitioning
    HYBRID = "hybrid"       # Combination of strategies

class DataFormat(str, Enum):
    """Supported data formats"""
    JSON = "json"
    PARQUET = "parquet"
    AVRO = "avro"
    CSV = "csv"
    BINARY = "binary"

class StorageConfig(BaseModel):
    """Reusable storage configuration"""
    storage_type: StorageType = StorageType.HOT
    compression: CompressionType = CompressionType.NONE
    encryption: bool = True
    replication_factor: int = 1
    retention_days: Optional[int] = None
    partition_strategy: PartitionStrategy = PartitionStrategy.DATE
    data_format: DataFormat = DataFormat.JSON
    
class DataObject(BaseModel):
    """Reusable data object representation"""
    object_id: str
    bucket: str
    key: str
    size: int
    content_type: str
    created_at: datetime
    modified_at: datetime
    tags: Dict[str, str] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    checksum: Optional[str] = None
    storage_class: StorageType = StorageType.HOT
    
class PartitionInfo(BaseModel):
    """Partition metadata"""
    partition_key: str
    partition_value: str
    partition_path: str
    record_count: int = 0
    size_bytes: int = 0
    created_at: datetime
    last_modified: datetime

class DataLakeStorage(ABC):
    """
    Abstract data lake storage interface
    Provides unified API across different storage backends
    """
    
    def __init__(self, config: StorageConfig):
        self.config = config
        self._connected = False
        
    @abstractmethod
    async def put_object(
        self, 
        bucket: str, 
        key: str, 
        data: Union[bytes, str], 
        metadata: Optional[Dict[str, str]] = None
    ) -> DataObject:
        """Store object in data lake"""
        pass
    
    @abstractmethod
    async def get_object(self, bucket: str, key: str) -> Optional[DataObject]:
        """Retrieve object from data lake"""
        pass
    
    @abstractmethod
    async def delete_object(self, bucket: str, key: str) -> bool:
        """Delete object from data lake"""
        pass
    
    @abstractmethod
    async def list_objects(
        self, 
        bucket: str, 
        prefix: Optional[str] = None,
        limit: Optional[int] = None
    ) -> List[DataObject]:
        """List objects in bucket"""
        pass
    
    @abstractmethod
    async def create_partition(
        self, 
        bucket: str, 
        partition_key: str, 
        partition_value: str
    ) -> PartitionInfo:
        """Create data partition"""
        pass
    
    @abstractmethod
    async def list_partitions(self, bucket: str) -> List[PartitionInfo]:
        """List all partitions in bucket"""
        pass

class MultiCloudDataLake(DataLakeStorage):
    """
    Multi-cloud data lake implementation
    Provides unified interface across AWS S3, Azure Blob, and Google Cloud Storage
    """
    
    def __init__(
        self, 
        config: StorageConfig, 
        cloud_manager: MultiCloudManager,
        primary_provider: CloudProvider = CloudProvider.AWS
    ):
        super().__init__(config)
        self.cloud_manager = cloud_manager
        self.primary_provider = primary_provider
        self.partitions: Dict[str, List[PartitionInfo]] = {}
        
    async def put_object(
        self, 
        bucket: str, 
        key: str, 
        data: Union[bytes, str], 
        metadata: Optional[Dict[str, str]] = None
    ) -> DataObject:
        """Store object with multi-cloud replication"""
        try:
            # Convert string to bytes if needed
            if isinstance(data, str):
                data = data.encode('utf-8')
            
            # Apply compression if configured
            compressed_data = await self._compress_data(data)
            
            # Generate object metadata
            object_id = hashlib.sha256(data).hexdigest()
            checksum = hashlib.md5(data).hexdigest()
            
            # Determine storage path based on partitioning strategy
            partitioned_key = await self._apply_partitioning(key)
            
            # Store in primary provider
            primary_connector = self.cloud_manager.get_connector(self.primary_provider)
            if not primary_connector:
                raise Exception(f"Primary provider {self.primary_provider} not available")
            
            success = await primary_connector.write_object(bucket, partitioned_key, compressed_data)
            if not success:
                raise Exception("Failed to write to primary storage")
            
            # Replicate to other providers if configured
            if self.config.replication_factor > 1:
                replication_providers = [p for p in self.cloud_manager.connectors.keys() if p != self.primary_provider]
                await self.cloud_manager.replicate_object(
                    self.primary_provider,
                    replication_providers[:self.config.replication_factor - 1],
                    bucket,
                    partitioned_key
                )
            
            # Create data object
            data_object = DataObject(
                object_id=object_id,
                bucket=bucket,
                key=partitioned_key,
                size=len(data),
                content_type=mimetypes.guess_type(key)[0] or 'application/octet-stream',
                created_at=datetime.utcnow(),
                modified_at=datetime.utcnow(),
                tags=metadata or {},
                checksum=checksum,
                storage_class=self.config.storage_type
            )
            
            logger.info("Object stored in data lake", 
                       bucket=bucket,
                       key=partitioned_key,
                       size=len(data))
            
            return data_object
            
        except Exception as e:
            logger.error("Failed to store object", 
                        bucket=bucket,
                        key=key,
                        error=str(e))
            raise
    
    async def get_object(self, bucket: str, key: str) -> Optional[DataObject]:
        """Retrieve object with fallback to replicas"""
        try:
            # Try primary provider first
            primary_connector = self.cloud_manager.get_connector(self.primary_provider)
            if primary_connector:
                try:
                    data = await primary_connector.read_object(bucket, key)
                    if data:
                        return await self._create_object_from_data(bucket, key, data)
                except Exception as e:
                    logger.warning("Primary storage read failed, trying replicas", error=str(e))
            
            # Try replica providers
            for provider in self.cloud_manager.connectors.keys():
                if provider != self.primary_provider:
                    connector = self.cloud_manager.get_connector(provider)
                    try:
                        data = await connector.read_object(bucket, key)
                        if data:
                            return await self._create_object_from_data(bucket, key, data)
                    except Exception:
                        continue
            
            logger.warning("Object not found in any storage provider", 
                          bucket=bucket, 
                          key=key)
            return None
            
        except Exception as e:
            logger.error("Failed to retrieve object", 
                        bucket=bucket,
                        key=key,
                        error=str(e))
            return None
    
    async def delete_object(self, bucket: str, key: str) -> bool:
        """Delete object from all replicas"""
        results = []
        
        for provider, connector in self.cloud_manager.connectors.items():
            try:
                success = await connector.delete_object(bucket, key)
                results.append(success)
            except Exception as e:
                logger.error("Failed to delete from provider", 
                           provider=provider,
                           error=str(e))
                results.append(False)
        
        return any(results)
    
    async def list_objects(
        self, 
        bucket: str, 
        prefix: Optional[str] = None,
        limit: Optional[int] = None
    ) -> List[DataObject]:
        """List objects from primary storage"""
        try:
            primary_connector = self.cloud_manager.get_connector(self.primary_provider)
            if not primary_connector:
                return []
            
            # This would need to be implemented in the cloud connectors
            # For now, return empty list
            logger.info("Object listing requested", 
                       bucket=bucket,
                       prefix=prefix)
            return []
            
        except Exception as e:
            logger.error("Failed to list objects", 
                        bucket=bucket,
                        error=str(e))
            return []
    
    async def create_partition(
        self, 
        bucket: str, 
        partition_key: str, 
        partition_value: str
    ) -> PartitionInfo:
        """Create logical data partition"""
        partition_path = f"{partition_key}={partition_value}"
        
        partition_info = PartitionInfo(
            partition_key=partition_key,
            partition_value=partition_value,
            partition_path=partition_path,
            created_at=datetime.utcnow(),
            last_modified=datetime.utcnow()
        )
        
        # Store partition metadata
        if bucket not in self.partitions:
            self.partitions[bucket] = []
        self.partitions[bucket].append(partition_info)
        
        logger.info("Partition created", 
                   bucket=bucket,
                   partition_path=partition_path)
        
        return partition_info
    
    async def list_partitions(self, bucket: str) -> List[PartitionInfo]:
        """List all partitions in bucket"""
        return self.partitions.get(bucket, [])
    
    async def _compress_data(self, data: bytes) -> bytes:
        """Apply compression if configured"""
        if self.config.compression == CompressionType.NONE:
            return data
        
        # Implement compression based on type
        if self.config.compression == CompressionType.GZIP:
            import gzip
            return gzip.compress(data)
        elif self.config.compression == CompressionType.BZIP2:
            import bz2
            return bz2.compress(data)
        # Add other compression types as needed
        
        return data
    
    async def _apply_partitioning(self, key: str) -> str:
        """Apply partitioning strategy to object key"""
        if self.config.partition_strategy == PartitionStrategy.DATE:
            now = datetime.utcnow()
            date_prefix = f"year={now.year}/month={now.month:02d}/day={now.day:02d}"
            return f"{date_prefix}/{key}"
        
        elif self.config.partition_strategy == PartitionStrategy.HASH:
            hash_value = hashlib.md5(key.encode()).hexdigest()[:2]
            return f"hash={hash_value}/{key}"
        
        return key
    
    async def _create_object_from_data(self, bucket: str, key: str, data: bytes) -> DataObject:
        """Create DataObject from raw data"""
        return DataObject(
            object_id=hashlib.sha256(data).hexdigest(),
            bucket=bucket,
            key=key,
            size=len(data),
            content_type=mimetypes.guess_type(key)[0] or 'application/octet-stream',
            created_at=datetime.utcnow(),
            modified_at=datetime.utcnow(),
            checksum=hashlib.md5(data).hexdigest()
        )

class LifecycleRule(BaseModel):
    """Data lifecycle management rule"""
    rule_id: str
    name: str
    enabled: bool = True
    prefix: Optional[str] = None
    tags: Dict[str, str] = Field(default_factory=dict)
    
    # Transition rules
    transition_to_warm: Optional[int] = None  # days
    transition_to_cold: Optional[int] = None  # days
    transition_to_archive: Optional[int] = None  # days
    
    # Expiration rules
    expiration_days: Optional[int] = None
    delete_incomplete_uploads_days: Optional[int] = 7

class LifecycleManager:
    """
    Reusable data lifecycle management
    Automates data tiering and retention policies
    """
    
    def __init__(self, storage: DataLakeStorage):
        self.storage = storage
        self.rules: Dict[str, LifecycleRule] = {}
        
    def add_rule(self, rule: LifecycleRule) -> None:
        """Add lifecycle rule"""
        self.rules[rule.rule_id] = rule
        logger.info("Lifecycle rule added", rule_id=rule.rule_id)
    
    def remove_rule(self, rule_id: str) -> bool:
        """Remove lifecycle rule"""
        if rule_id in self.rules:
            del self.rules[rule_id]
            logger.info("Lifecycle rule removed", rule_id=rule_id)
            return True
        return False
    
    async def apply_lifecycle_policies(self, bucket: str) -> Dict[str, Any]:
        """Apply all lifecycle policies to bucket"""
        results = {
            "objects_processed": 0,
            "objects_transitioned": 0,
            "objects_deleted": 0,
            "errors": []
        }
        
        # Get all objects in bucket
        objects = await self.storage.list_objects(bucket)
        
        for obj in objects:
            try:
                # Check each rule
                for rule in self.rules.values():
                    if not rule.enabled:
                        continue
                    
                    # Check if object matches rule criteria
                    if not await self._object_matches_rule(obj, rule):
                        continue
                    
                    # Calculate object age
                    age_days = (datetime.utcnow() - obj.created_at).days
                    
                    # Apply expiration
                    if rule.expiration_days and age_days >= rule.expiration_days:
                        if await self.storage.delete_object(obj.bucket, obj.key):
                            results["objects_deleted"] += 1
                        continue
                    
                    # Apply transitions
                    new_storage_class = await self._get_target_storage_class(obj, rule, age_days)
                    if new_storage_class and new_storage_class != obj.storage_class:
                        # This would require storage class transition implementation
                        logger.info("Storage class transition", 
                                   object_key=obj.key,
                                   from_class=obj.storage_class,
                                   to_class=new_storage_class)
                        results["objects_transitioned"] += 1
                
                results["objects_processed"] += 1
                
            except Exception as e:
                results["errors"].append(f"Error processing {obj.key}: {str(e)}")
                logger.error("Lifecycle policy error", 
                           object_key=obj.key,
                           error=str(e))
        
        logger.info("Lifecycle policies applied", 
                   bucket=bucket,
                   results=results)
        
        return results
    
    async def _object_matches_rule(self, obj: DataObject, rule: LifecycleRule) -> bool:
        """Check if object matches lifecycle rule criteria"""
        # Check prefix
        if rule.prefix and not obj.key.startswith(rule.prefix):
            return False
        
        # Check tags
        for tag_key, tag_value in rule.tags.items():
            if obj.tags.get(tag_key) != tag_value:
                return False
        
        return True
    
    async def _get_target_storage_class(
        self, 
        obj: DataObject, 
        rule: LifecycleRule, 
        age_days: int
    ) -> Optional[StorageType]:
        """Determine target storage class based on age"""
        if rule.transition_to_archive and age_days >= rule.transition_to_archive:
            return StorageType.ARCHIVE
        elif rule.transition_to_cold and age_days >= rule.transition_to_cold:
            return StorageType.COLD
        elif rule.transition_to_warm and age_days >= rule.transition_to_warm:
            return StorageType.WARM
        
        return None

class DataPartitioner:
    """
    Reusable data partitioning utilities
    Optimizes query performance through intelligent data organization
    """
    
    @staticmethod
    def create_date_partition(date: datetime) -> str:
        """Create date-based partition path"""
        return f"year={date.year}/month={date.month:02d}/day={date.day:02d}"
    
    @staticmethod
    def create_hash_partition(value: str, num_partitions: int = 100) -> str:
        """Create hash-based partition path"""
        hash_value = int(hashlib.md5(value.encode()).hexdigest(), 16)
        partition_id = hash_value % num_partitions
        return f"hash={partition_id:03d}"
    
    @staticmethod
    def create_range_partition(value: Union[int, float], ranges: List[tuple]) -> str:
        """Create range-based partition path"""
        for i, (min_val, max_val) in enumerate(ranges):
            if min_val <= value < max_val:
                return f"range={i:03d}"
        return "range=999"  # Default for values outside all ranges
    
    @staticmethod
    def extract_partition_info(key: str) -> Dict[str, str]:
        """Extract partition information from object key"""
        partitions = {}
        parts = key.split('/')
        
        for part in parts:
            if '=' in part:
                partition_key, partition_value = part.split('=', 1)
                partitions[partition_key] = partition_value
        
        return partitions

class StorageManager:
    """
    High-level storage management orchestrator
    Coordinates data lake operations across multiple storage backends
    """
    
    def __init__(self):
        self.storages: Dict[str, DataLakeStorage] = {}
        self.lifecycle_managers: Dict[str, LifecycleManager] = {}
        self.default_storage: Optional[str] = None
        
    def add_storage(self, name: str, storage: DataLakeStorage, set_default: bool = False) -> None:
        """Add storage backend"""
        self.storages[name] = storage
        self.lifecycle_managers[name] = LifecycleManager(storage)
        
        if set_default or not self.default_storage:
            self.default_storage = name
        
        logger.info("Storage backend added", name=name, is_default=set_default)
    
    def get_storage(self, name: Optional[str] = None) -> Optional[DataLakeStorage]:
        """Get storage backend"""
        storage_name = name or self.default_storage
        return self.storages.get(storage_name) if storage_name else None
    
    def get_lifecycle_manager(self, name: Optional[str] = None) -> Optional[LifecycleManager]:
        """Get lifecycle manager"""
        storage_name = name or self.default_storage
        return self.lifecycle_managers.get(storage_name) if storage_name else None
    
    async def store_data(
        self,
        bucket: str,
        key: str,
        data: Union[bytes, str, Dict[str, Any]],
        storage_name: Optional[str] = None,
        metadata: Optional[Dict[str, str]] = None
    ) -> Optional[DataObject]:
        """Store data using specified or default storage"""
        storage = self.get_storage(storage_name)
        if not storage:
            logger.error("Storage backend not found", storage_name=storage_name)
            return None
        
        # Convert dict to JSON if needed
        if isinstance(data, dict):
            data = json.dumps(data, default=str)
        
        return await storage.put_object(bucket, key, data, metadata)
    
    async def retrieve_data(
        self,
        bucket: str,
        key: str,
        storage_name: Optional[str] = None
    ) -> Optional[DataObject]:
        """Retrieve data using specified or default storage"""
        storage = self.get_storage(storage_name)
        if not storage:
            logger.error("Storage backend not found", storage_name=storage_name)
            return None
        
        return await storage.get_object(bucket, key)
    
    async def delete_data(
        self,
        bucket: str,
        key: str,
        storage_name: Optional[str] = None
    ) -> bool:
        """Delete data using specified or default storage"""
        storage = self.get_storage(storage_name)
        if not storage:
            logger.error("Storage backend not found", storage_name=storage_name)
            return False
        
        return await storage.delete_object(bucket, key)
    
    async def run_lifecycle_policies(self, bucket: str, storage_name: Optional[str] = None) -> Dict[str, Any]:
        """Run lifecycle policies for bucket"""
        lifecycle_manager = self.get_lifecycle_manager(storage_name)
        if not lifecycle_manager:
            logger.error("Lifecycle manager not found", storage_name=storage_name)
            return {"error": "Lifecycle manager not found"}
        
        return await lifecycle_manager.apply_lifecycle_policies(bucket)
    
    async def health_check(self) -> Dict[str, bool]:
        """Check health of all storage backends"""
        results = {}
        
        for name, storage in self.storages.items():
            try:
                # Simple health check - try to list objects
                await storage.list_objects("health-check-bucket", limit=1)
                results[name] = True
            except Exception as e:
                logger.error("Storage health check failed", 
                           storage_name=name,
                           error=str(e))
                results[name] = False
        
        return results

# Reusable storage utilities
def calculate_object_checksum(data: bytes, algorithm: str = "md5") -> str:
    """Calculate checksum for data integrity verification"""
    if algorithm == "md5":
        return hashlib.md5(data).hexdigest()
    elif algorithm == "sha256":
        return hashlib.sha256(data).hexdigest()
    else:
        raise ValueError(f"Unsupported checksum algorithm: {algorithm}")

def estimate_storage_cost(
    size_bytes: int,
    storage_class: StorageType,
    provider: CloudProvider = CloudProvider.AWS
) -> float:
    """Estimate storage cost (simplified calculation)"""
    # Simplified cost calculation - would use actual pricing in production
    cost_per_gb_month = {
        StorageType.HOT: 0.023,     # ~AWS S3 Standard
        StorageType.WARM: 0.0125,   # ~AWS S3 IA
        StorageType.COLD: 0.004,    # ~AWS S3 Glacier
        StorageType.ARCHIVE: 0.001  # ~AWS S3 Deep Archive
    }
    
    size_gb = size_bytes / (1024 ** 3)
    monthly_cost = size_gb * cost_per_gb_month.get(storage_class, 0.023)
    
    return monthly_cost

def optimize_partition_strategy(
    access_patterns: Dict[str, Any],
    data_volume: int,
    query_types: List[str]
) -> PartitionStrategy:
    """Recommend optimal partitioning strategy based on usage patterns"""
    # Simplified recommendation logic
    if "time_series" in query_types and data_volume > 1000000:
        return PartitionStrategy.DATE
    elif "high_cardinality" in access_patterns:
        return PartitionStrategy.HASH
    elif "range_queries" in query_types:
        return PartitionStrategy.RANGE
    else:
        return PartitionStrategy.DATE  # Default to date partitioning