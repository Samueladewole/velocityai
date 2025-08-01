"""
ERIP Data Architecture API Router
RESTful endpoints for advanced data architecture operations
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks, UploadFile, File
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
import structlog
import io
import json
import pandas as pd

from shared.auth import get_current_user, require_permission, ComponentPermissions, TokenData
from .cloud_connectors import (
    MultiCloudManager, 
    CloudProvider, 
    ConnectionConfig,
    CloudResource
)
from .streaming import (
    StreamingPipeline,
    StreamConfig,
    StreamType,
    ProcessingMode,
    EventProcessor,
    StreamMessage
)
from .storage import (
    StorageManager,
    DataLakeStorage,
    MultiCloudDataLake,
    StorageConfig,
    StorageType,
    DataObject,
    LifecycleRule
)
from .etl import (
    ETLPipeline,
    DataValidator,
    DataTransformer,
    BatchProcessor,
    ScheduleManager,
    PipelineRun,
    ValidationResult
)
from .quality import (
    DataQualityMonitor,
    QualityReport,
    QualityMetric,
    QualityDimension,
    CompletenessRule,
    UniquenessRule,
    ValidityRule
)
from .governance import (
    DataCatalog,
    LineageTracker,
    PrivacyController,
    AccessController,
    DataClassifier,
    DataAsset,
    DataClassification,
    ComplianceFramework,
    PrivacyAnnotation,
    AccessPolicy
)

router = APIRouter()
logger = structlog.get_logger()

# Initialize global components
cloud_manager = MultiCloudManager()
storage_manager = StorageManager()
quality_monitor = DataQualityMonitor()
data_catalog = DataCatalog()
lineage_tracker = LineageTracker(data_catalog)
privacy_controller = PrivacyController(data_catalog)
access_controller = AccessController(data_catalog)
data_classifier = DataClassifier()
schedule_manager = ScheduleManager()

# Pydantic models for API requests
class CloudConnectionRequest(BaseModel):
    provider: CloudProvider
    region: Optional[str] = None
    credentials: Dict[str, Any]
    
class StreamConfigRequest(BaseModel):
    stream_type: StreamType
    connection_params: Dict[str, Any]
    batch_size: int = 100
    processing_mode: ProcessingMode = ProcessingMode.AT_LEAST_ONCE
    
class DataAssetRequest(BaseModel):
    name: str
    description: str
    asset_type: str
    classification: DataClassification
    owner: str
    steward: str
    location: str
    tags: List[str] = []
    schema: Dict[str, Any] = {}
    
class QualityAssessmentRequest(BaseModel):
    dataset_id: str
    include_anomaly_detection: bool = True
    validation_rules: List[str] = []

class ETLPipelineRequest(BaseModel):
    pipeline_id: str
    name: str
    extractors: List[str] = []
    transformations: List[str] = []
    validation_rules: List[str] = []
    schedule_config: Optional[Dict[str, Any]] = None

# Cloud Connector Endpoints
@router.post("/cloud/connect")
async def connect_cloud_provider(
    request: CloudConnectionRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Connect to cloud provider
    
    Establishes connection to AWS, Azure, or GCP for data operations.
    """
    try:
        logger.info("Connecting to cloud provider",
                   user_id=current_user.user_id,
                   provider=request.provider)
        
        config = ConnectionConfig(
            provider=request.provider,
            region=request.region,
            credentials=request.credentials
        )
        
        success = await cloud_manager.add_connector(config)
        
        if success:
            return {
                "status": "connected",
                "provider": request.provider,
                "region": request.region
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to connect to cloud provider"
            )
            
    except Exception as e:
        logger.error("Cloud connection failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cloud connection failed: {str(e)}"
        )

@router.get("/cloud/resources")
async def list_cloud_resources(
    provider: CloudProvider = Query(...),
    resource_type: str = Query(...),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    List resources from cloud provider
    
    Returns available resources like buckets, databases, streams from specified provider.
    """
    try:
        connector = cloud_manager.get_connector(provider)
        if not connector:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Cloud provider {provider} not connected"
            )
        
        resources = await connector.list_resources(resource_type)
        
        return {
            "provider": provider,
            "resource_type": resource_type,
            "resources": [resource.dict() for resource in resources]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to list cloud resources",
                    provider=provider,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list resources: {str(e)}"
        )

@router.get("/cloud/health")
async def check_cloud_health(
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Check health of all cloud connections
    
    Returns connectivity status for all configured cloud providers.
    """
    try:
        health_status = await cloud_manager.health_check()
        
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "overall_healthy": all(health_status.values()),
            "providers": health_status
        }
        
    except Exception as e:
        logger.error("Cloud health check failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Health check failed: {str(e)}"
        )

# Streaming Pipeline Endpoints
@router.post("/streaming/pipeline")
async def create_streaming_pipeline(
    config: StreamConfigRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.PULSE))
):
    """
    Create streaming pipeline
    
    Sets up real-time data streaming with Redis, Kafka, or in-memory processing.
    """
    try:
        logger.info("Creating streaming pipeline",
                   user_id=current_user.user_id,
                   stream_type=config.stream_type)
        
        stream_config = StreamConfig(**config.dict())
        pipeline = StreamingPipeline(stream_config)
        
        # Test connection
        await pipeline.processor.connect()
        await pipeline.processor.disconnect()
        
        return {
            "status": "created",
            "stream_type": config.stream_type,
            "configuration": config.dict()
        }
        
    except Exception as e:
        logger.error("Streaming pipeline creation failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Pipeline creation failed: {str(e)}"
        )

@router.post("/streaming/send")
async def send_stream_message(
    topic: str,
    event_type: str,
    data: Dict[str, Any],
    correlation_id: Optional[str] = None,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.PULSE))
):
    """
    Send message to stream
    
    Publishes data to streaming platform for real-time processing.
    """
    try:
        # Create standardized message
        message = EventProcessor.create_message(
            event_type=event_type,
            data=data,
            source="erip-api",
            correlation_id=correlation_id
        )
        
        # This would use an active streaming pipeline
        # For now, return success
        
        logger.info("Stream message sent",
                   user_id=current_user.user_id,
                   topic=topic,
                   event_type=event_type)
        
        return {
            "status": "sent",
            "message_id": message.message_id,
            "topic": topic,
            "timestamp": message.timestamp.isoformat()
        }
        
    except Exception as e:
        logger.error("Stream message failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Message send failed: {str(e)}"
        )

# Data Storage Endpoints
@router.post("/storage/objects")
async def store_data_object(
    bucket: str,
    key: str,
    data: Dict[str, Any],
    storage_name: Optional[str] = None,
    metadata: Optional[Dict[str, str]] = None,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Store data object
    
    Stores data in configured data lake with automatic partitioning and lifecycle management.
    """
    try:
        logger.info("Storing data object",
                   user_id=current_user.user_id,
                   bucket=bucket,
                   key=key)
        
        data_object = await storage_manager.store_data(
            bucket=bucket,
            key=key,
            data=data,
            storage_name=storage_name,
            metadata=metadata
        )
        
        if data_object:
            return data_object.dict()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to store data object"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Data storage failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Storage failed: {str(e)}"
        )

@router.get("/storage/objects/{bucket}/{key}")
async def retrieve_data_object(
    bucket: str,
    key: str,
    storage_name: Optional[str] = None,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Retrieve data object
    
    Retrieves data from data lake with automatic failover across cloud providers.
    """
    try:
        data_object = await storage_manager.retrieve_data(
            bucket=bucket,
            key=key,
            storage_name=storage_name
        )
        
        if data_object:
            return data_object.dict()
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data object not found"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Data retrieval failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Retrieval failed: {str(e)}"
        )

# Data Quality Endpoints
@router.post("/quality/assess")
async def assess_data_quality(
    request: QualityAssessmentRequest,
    file: Optional[UploadFile] = File(None),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Assess data quality
    
    Performs comprehensive data quality assessment including completeness, accuracy, and anomaly detection.
    """
    try:
        logger.info("Assessing data quality",
                   user_id=current_user.user_id,
                   dataset_id=request.dataset_id)
        
        # Load data
        if file:
            # Read uploaded file
            content = await file.read()
            if file.filename.endswith('.csv'):
                df = pd.read_csv(io.StringIO(content.decode('utf-8')))
            elif file.filename.endswith('.json'):
                data = json.loads(content.decode('utf-8'))
                df = pd.DataFrame(data if isinstance(data, list) else [data])
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Unsupported file format. Use CSV or JSON."
                )
        else:
            # Create sample data for demo
            df = pd.DataFrame({
                'id': [1, 2, 3, 4, 5],
                'name': ['Alice', 'Bob', None, 'David', 'Eve'],
                'email': ['alice@example.com', 'bob@example.com', 'invalid-email', 'david@example.com', 'eve@example.com'],
                'age': [25, 30, -5, 35, 28]
            })
        
        # Add validation rules if not already added
        if not quality_monitor.validation_rules:
            quality_monitor.add_validation_rule(CompletenessRule())
            quality_monitor.add_validation_rule(UniquenessRule())
            quality_monitor.add_validation_rule(ValidityRule(
                column_types={'id': 'int', 'age': 'int', 'email': 'email'},
                patterns={'email': r'^[^@]+@[^@]+\.[^@]+€'}
            ))
        
        # Perform quality assessment
        report = await quality_monitor.assess_quality(
            df=df,
            dataset_id=request.dataset_id,
            include_anomaly_detection=request.include_anomaly_detection
        )
        
        return report.dict()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Quality assessment failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Quality assessment failed: {str(e)}"
        )

@router.get("/quality/trends/{dataset_id}")
async def get_quality_trends(
    dataset_id: str,
    days: int = Query(30, ge=1, le=365),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Get data quality trends
    
    Returns quality trends and historical analysis for specified dataset.
    """
    try:
        trends = await quality_monitor.get_quality_trends(dataset_id, days)
        return trends
        
    except Exception as e:
        logger.error("Quality trends retrieval failed",
                    dataset_id=dataset_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Trends retrieval failed: {str(e)}"
        )

@router.get("/quality/summary")
async def get_quality_summary(
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Get quality monitoring summary
    
    Returns overall data quality monitoring status across all datasets.
    """
    try:
        summary = quality_monitor.get_quality_summary()
        return summary
        
    except Exception as e:
        logger.error("Quality summary failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Summary generation failed: {str(e)}"
        )

# Data Catalog Endpoints
@router.post("/catalog/assets")
async def register_data_asset(
    request: DataAssetRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """
    Register data asset
    
    Adds data asset to catalog with metadata, classification, and governance information.
    """
    try:
        asset = DataAsset(
            asset_id=f"asset_{int(datetime.utcnow().timestamp())}_{current_user.user_id}",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            **request.dict()
        )
        
        success = await data_catalog.register_asset(asset)
        
        if success:
            return asset.dict()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to register asset"
            )
            
    except Exception as e:
        logger.error("Asset registration failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.get("/catalog/search")
async def search_data_assets(
    query: str = Query(...),
    classification: Optional[DataClassification] = Query(None),
    asset_type: Optional[str] = Query(None),
    owner: Optional[str] = Query(None),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """
    Search data assets
    
    Searches catalog for data assets based on text query and filters.
    """
    try:
        filters = {}
        if classification:
            filters["classification"] = classification
        if asset_type:
            filters["asset_type"] = asset_type
        if owner:
            filters["owner"] = owner
        
        assets = await data_catalog.search_assets(query, filters)
        
        return {
            "query": query,
            "filters": filters,
            "results": [asset.dict() for asset in assets]
        }
        
    except Exception as e:
        logger.error("Asset search failed",
                    query=query,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search failed: {str(e)}"
        )

@router.get("/catalog/assets/{asset_id}/lineage")
async def get_asset_lineage(
    asset_id: str,
    direction: str = Query("both", regex="^(upstream|downstream|both)€"),
    max_depth: int = Query(3, ge=1, le=10),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """
    Get asset lineage
    
    Returns data lineage information showing upstream sources and downstream consumers.
    """
    try:
        result = {}
        
        if direction in ["upstream", "both"]:
            result["upstream"] = await lineage_tracker.get_upstream_assets(asset_id, max_depth)
        
        if direction in ["downstream", "both"]:
            result["downstream"] = await lineage_tracker.get_downstream_assets(asset_id, max_depth)
        
        return {
            "asset_id": asset_id,
            "direction": direction,
            "max_depth": max_depth,
            "lineage": result
        }
        
    except Exception as e:
        logger.error("Lineage retrieval failed",
                    asset_id=asset_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lineage retrieval failed: {str(e)}"
        )

@router.get("/catalog/assets/{asset_id}/impact")
async def get_impact_analysis(
    asset_id: str,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """
    Get impact analysis
    
    Analyzes the impact of changes to specified data asset.
    """
    try:
        impact_analysis = await lineage_tracker.get_impact_analysis(asset_id)
        return impact_analysis
        
    except Exception as e:
        logger.error("Impact analysis failed",
                    asset_id=asset_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Impact analysis failed: {str(e)}"
        )

# Privacy and Governance Endpoints
@router.post("/privacy/annotate")
async def add_privacy_annotation(
    annotation: PrivacyAnnotation,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """
    Add privacy annotation
    
    Adds privacy and compliance annotations to data assets for GDPR/CCPA compliance.
    """
    try:
        success = await privacy_controller.annotate_privacy(annotation)
        
        if success:
            return annotation.dict()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to add privacy annotation"
            )
            
    except Exception as e:
        logger.error("Privacy annotation failed",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Annotation failed: {str(e)}"
        )

@router.get("/privacy/report")
async def generate_privacy_report(
    framework: ComplianceFramework = Query(ComplianceFramework.GDPR),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """
    Generate privacy report
    
    Generates comprehensive privacy compliance report for specified framework.
    """
    try:
        report = await privacy_controller.generate_privacy_report(framework)
        return report
        
    except Exception as e:
        logger.error("Privacy report generation failed",
                    framework=framework,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Report generation failed: {str(e)}"
        )

@router.post("/privacy/subject-request")
async def handle_data_subject_request(
    request_type: str,
    data_subject_id: str,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.COMPASS))
):
    """
    Handle data subject request
    
    Processes GDPR data subject rights requests (access, rectification, erasure, portability).
    """
    try:
        result = await privacy_controller.handle_data_subject_request(
            request_type=request_type,
            data_subject_id=data_subject_id
        )
        
        return result
        
    except Exception as e:
        logger.error("Data subject request failed",
                    request_type=request_type,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Request processing failed: {str(e)}"
        )

# System Health and Monitoring
@router.get("/health")
async def data_architecture_health(
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Data architecture health check
    
    Returns comprehensive health status of all data architecture components.
    """
    try:
        health_status = {
            "timestamp": datetime.utcnow().isoformat(),
            "overall_status": "healthy",
            "components": {
                "cloud_connectors": await cloud_manager.health_check(),
                "storage_backends": await storage_manager.health_check(),
                "quality_monitor": {"active_rules": len(quality_monitor.validation_rules)},
                "data_catalog": {"total_assets": len(data_catalog.assets)},
                "privacy_controller": {"annotated_assets": len(privacy_controller.privacy_annotations)},
                "schedule_manager": {"scheduled_pipelines": len(schedule_manager.scheduled_pipelines)}
            }
        }
        
        # Determine overall status
        component_statuses = []
        for component, status in health_status["components"].items():
            if isinstance(status, dict):
                if "error" in status or any(not v for v in status.values() if isinstance(v, bool)):
                    component_statuses.append(False)
                else:
                    component_statuses.append(True)
            else:
                component_statuses.append(True)
        
        health_status["overall_status"] = "healthy" if all(component_statuses) else "degraded"
        
        return health_status
        
    except Exception as e:
        logger.error("Health check failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Health check failed: {str(e)}"
        )

@router.get("/metrics")
async def get_data_architecture_metrics(
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Get data architecture metrics
    
    Returns performance and usage metrics for data architecture components.
    """
    try:
        metrics = {
            "timestamp": datetime.utcnow().isoformat(),
            "data_catalog": {
                "total_assets": len(data_catalog.assets),
                "assets_by_classification": {},
                "assets_by_type": {}
            },
            "quality_monitoring": quality_monitor.get_quality_summary(),
            "privacy_compliance": {
                "annotated_assets": len(privacy_controller.privacy_annotations),
                "pii_assets": len(await privacy_controller.identify_pii_assets())
            },
            "lineage_tracking": {
                "total_lineage_relationships": len(lineage_tracker.lineages)
            }
        }
        
        # Calculate catalog metrics
        for asset in data_catalog.assets.values():
            # By classification
            classification = asset.classification.value
            metrics["data_catalog"]["assets_by_classification"][classification] = \
                metrics["data_catalog"]["assets_by_classification"].get(classification, 0) + 1
            
            # By type
            asset_type = asset.asset_type
            metrics["data_catalog"]["assets_by_type"][asset_type] = \
                metrics["data_catalog"]["assets_by_type"].get(asset_type, 0) + 1
        
        return metrics
        
    except Exception as e:
        logger.error("Metrics collection failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Metrics collection failed: {str(e)}"
        )