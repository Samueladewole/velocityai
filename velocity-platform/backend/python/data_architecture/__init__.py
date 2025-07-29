"""
ERIP Advanced Data Architecture Module
Multi-cloud data connectivity, real-time streaming, and enterprise-grade data infrastructure
"""

from .cloud_connectors import (
    CloudConnector,
    AWSConnector,
    AzureConnector,
    GCPConnector,
    MultiCloudManager,
    CloudProvider
)

from .streaming import (
    StreamingPipeline,
    RedisStreamProcessor,
    KafkaStreamProcessor,
    EventProcessor,
    StreamConfig
)

from .storage import (
    DataLakeStorage,
    StorageManager,
    DataPartitioner,
    LifecycleManager
)

from .etl import (
    ETLPipeline,
    DataValidator,
    DataTransformer,
    BatchProcessor,
    ScheduleManager
)

from .governance import (
    DataCatalog,
    LineageTracker,
    PrivacyController,
    AccessController,
    DataClassifier
)

from .quality import (
    DataQualityMonitor,
    ValidationRule,
    AnomalyDetector,
    QualityMetric
)

from .router import router

__all__ = [
    # Cloud Connectors
    "CloudConnector",
    "AWSConnector", 
    "AzureConnector",
    "GCPConnector",
    "MultiCloudManager",
    "CloudProvider",
    
    # Streaming
    "StreamingPipeline",
    "RedisStreamProcessor",
    "KafkaStreamProcessor", 
    "EventProcessor",
    "StreamConfig",
    
    # Storage
    "DataLakeStorage",
    "StorageManager",
    "DataPartitioner",
    "LifecycleManager",
    
    # ETL
    "ETLPipeline",
    "DataValidator",
    "DataTransformer",
    "BatchProcessor",
    "ScheduleManager",
    
    # Governance
    "DataCatalog",
    "LineageTracker",
    "PrivacyController",
    "AccessController",
    "DataClassifier",
    
    # Quality
    "DataQualityMonitor",
    "ValidationRule",
    "AnomalyDetector",
    "QualityMetric",
    
    # Router
    "router"
]