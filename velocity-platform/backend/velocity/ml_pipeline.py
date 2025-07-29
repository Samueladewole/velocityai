"""
Machine Learning Pipeline Infrastructure for Velocity AI Platform
Provides ML model training, inference, and optimization for the 10-agent system
"""

import asyncio
import json
import pickle
import numpy as np
import pandas as pd
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional, Union, Tuple, Callable
from enum import Enum
from dataclasses import dataclass, field, asdict
from pathlib import Path
import logging
import hashlib
import os

from pydantic import BaseModel, Field
import structlog
from sqlalchemy.orm import Session
import joblib

# ML Libraries
import sklearn
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import torch
import torch.nn as nn
import transformers

from agent_orchestration import AgentType, TaskType
from models import User, Organization, Agent, EvidenceItem

logger = structlog.get_logger()

class ModelType(Enum):
    """Types of ML models"""
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    CLUSTERING = "clustering"
    ANOMALY_DETECTION = "anomaly_detection"
    NLP = "nlp"
    TIME_SERIES = "time_series"
    REINFORCEMENT_LEARNING = "reinforcement_learning"

class ModelStatus(Enum):
    """Model lifecycle status"""
    TRAINING = "training"
    TRAINED = "trained"
    DEPLOYED = "deployed"
    DEPRECATED = "deprecated"
    FAILED = "failed"

class InferenceMode(Enum):
    """Model inference modes"""
    BATCH = "batch"
    STREAMING = "streaming"
    REALTIME = "realtime"

@dataclass
class ModelMetadata:
    """Metadata for ML models"""
    model_id: str
    name: str
    version: str
    model_type: ModelType
    framework: str  # sklearn, pytorch, transformers, etc.
    
    # Training information
    trained_at: datetime
    training_data_size: int
    training_duration: float
    hyperparameters: Dict[str, Any] = field(default_factory=dict)
    
    # Performance metrics
    metrics: Dict[str, float] = field(default_factory=dict)
    validation_score: float = 0.0
    test_score: float = 0.0
    
    # Deployment information
    status: ModelStatus = ModelStatus.TRAINING
    deployment_config: Dict[str, Any] = field(default_factory=dict)
    inference_mode: InferenceMode = InferenceMode.BATCH
    
    # Resource requirements
    memory_mb: int = 512
    cpu_cores: float = 1.0
    gpu_required: bool = False
    
    # Business context
    use_case: str = ""
    target_agents: List[AgentType] = field(default_factory=list)
    organization_id: Optional[str] = None

@dataclass
class TrainingJob:
    """ML model training job"""
    job_id: str
    model_id: str
    dataset_id: str
    
    # Configuration
    model_config: Dict[str, Any] = field(default_factory=dict)
    training_config: Dict[str, Any] = field(default_factory=dict)
    
    # Status
    status: str = "pending"  # pending, running, completed, failed
    progress: float = 0.0
    
    # Results
    metrics: Dict[str, float] = field(default_factory=dict)
    artifacts: Dict[str, str] = field(default_factory=dict)
    
    # Timing
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    # Error handling
    error_message: Optional[str] = None
    retry_count: int = 0

class ComplianceDataProcessor:
    """Processes compliance data for ML training"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.preprocessors = {}
    
    async def create_training_dataset(
        self, 
        organization_id: str, 
        task_type: TaskType,
        lookback_days: int = 90
    ) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        """Create training dataset for a specific task type"""
        
        # Query relevant data
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=lookback_days)
        
        if task_type == TaskType.RISK_ASSESSMENT:
            return await self._create_risk_assessment_dataset(organization_id, cutoff_date)
        elif task_type == TaskType.EVIDENCE_COLLECTION:
            return await self._create_evidence_collection_dataset(organization_id, cutoff_date)
        elif task_type == TaskType.COMPLIANCE_CHECK:
            return await self._create_compliance_check_dataset(organization_id, cutoff_date)
        else:
            raise ValueError(f"Unsupported task type for training: {task_type}")
    
    async def _create_risk_assessment_dataset(
        self, 
        organization_id: str, 
        cutoff_date: datetime
    ) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        """Create dataset for risk assessment model training"""
        
        # Query evidence data
        evidence_items = self.db.query(EvidenceItem).filter(
            EvidenceItem.organization_id == organization_id,
            EvidenceItem.created_at >= cutoff_date
        ).all()
        
        # Create feature matrix
        features = []
        labels = []
        
        for evidence in evidence_items:
            feature_vector = {
                'framework': evidence.framework.value,
                'evidence_type': evidence.evidence_type.value,
                'confidence_score': evidence.confidence_score or 0.0,
                'trust_points': evidence.trust_points or 0,
                'control_category': self._extract_control_category(evidence.control_id),
                'data_completeness': self._calculate_data_completeness(evidence.data),
                'metadata_richness': len(evidence.evidence_metadata) if evidence.evidence_metadata else 0,
                'validation_status': evidence.status.value,
                'days_since_creation': (datetime.now(timezone.utc) - evidence.created_at).days
            }
            
            # Risk label (derived from trust points and confidence)
            risk_score = self._calculate_risk_score(evidence)
            
            features.append(feature_vector)
            labels.append(risk_score)
        
        df = pd.DataFrame(features)
        df['risk_score'] = labels
        
        metadata = {
            'feature_columns': list(df.columns[:-1]),
            'target_column': 'risk_score',
            'sample_count': len(df),
            'organization_id': organization_id,
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        return df, metadata
    
    async def _create_evidence_collection_dataset(
        self, 
        organization_id: str, 
        cutoff_date: datetime
    ) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        """Create dataset for evidence collection optimization"""
        
        # Query agent execution data
        agents = self.db.query(Agent).filter(
            Agent.organization_id == organization_id
        ).all()
        
        features = []
        labels = []
        
        for agent in agents:
            feature_vector = {
                'platform': agent.platform.value,
                'framework': agent.framework.value,
                'config_complexity': len(agent.configuration) if agent.configuration else 0,
                'avg_collection_time': agent.avg_collection_time or 0.0,
                'success_rate': agent.success_rate or 0.0,
                'evidence_collected': agent.evidence_collected or 0,
                'days_active': (datetime.now(timezone.utc) - agent.created_at).days
            }
            
            # Efficiency label
            efficiency_score = self._calculate_efficiency_score(agent)
            
            features.append(feature_vector)
            labels.append(efficiency_score)
        
        df = pd.DataFrame(features)
        df['efficiency_score'] = labels
        
        metadata = {
            'feature_columns': list(df.columns[:-1]),
            'target_column': 'efficiency_score',
            'sample_count': len(df),
            'organization_id': organization_id,
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        return df, metadata
    
    def _extract_control_category(self, control_id: str) -> str:
        """Extract control category from control ID"""
        if not control_id:
            return "unknown"
        
        # SOC 2 categories
        if control_id.startswith("CC"):
            return "common_criteria"
        elif control_id.startswith("A1"):
            return "additional_criteria_1"
        
        # ISO 27001 categories
        elif control_id.startswith("A."):
            parts = control_id.split(".")
            if len(parts) >= 2:
                return f"iso_category_{parts[1]}"
        
        return "other"
    
    def _calculate_data_completeness(self, data: Dict[str, Any]) -> float:
        """Calculate completeness score for evidence data"""
        if not data:
            return 0.0
        
        total_fields = len(data)
        complete_fields = sum(1 for v in data.values() if v is not None and v != "")
        
        return complete_fields / total_fields if total_fields > 0 else 0.0
    
    def _calculate_risk_score(self, evidence: EvidenceItem) -> float:
        """Calculate risk score from evidence"""
        base_score = 1.0 - (evidence.confidence_score or 0.0)
        
        # Adjust based on evidence type
        type_weights = {
            'SCREENSHOT': 0.3,
            'API_RESPONSE': 0.8,
            'CONFIGURATION': 0.9,
            'LOG_ENTRY': 0.7,
            'POLICY_DOCUMENT': 0.6,
            'SCAN_RESULT': 0.8
        }
        
        type_weight = type_weights.get(evidence.evidence_type.value, 0.5)
        risk_score = base_score * type_weight
        
        return min(max(risk_score, 0.0), 1.0)
    
    def _calculate_efficiency_score(self, agent: Agent) -> float:
        """Calculate efficiency score for agent"""
        success_rate = agent.success_rate or 0.0
        collection_speed = 1.0 / (agent.avg_collection_time or 1.0)  # Inverse of time
        evidence_rate = (agent.evidence_collected or 0) / max((datetime.now(timezone.utc) - agent.created_at).days, 1)
        
        # Weighted combination
        efficiency = (success_rate * 0.4 + 
                     min(collection_speed, 1.0) * 0.3 + 
                     min(evidence_rate / 10.0, 1.0) * 0.3)
        
        return min(max(efficiency, 0.0), 1.0)

class ModelTrainer:
    """Trains ML models for different compliance tasks"""
    
    def __init__(self, model_storage_path: str = "/tmp/velocity_models"):
        self.storage_path = Path(model_storage_path)
        self.storage_path.mkdir(exist_ok=True)
        self.active_jobs: Dict[str, TrainingJob] = {}
    
    async def train_model(
        self, 
        model_metadata: ModelMetadata,
        training_data: pd.DataFrame,
        dataset_metadata: Dict[str, Any]
    ) -> TrainingJob:
        """Train a machine learning model"""
        
        job_id = f"job_{model_metadata.model_id}_{int(time.time())}"
        
        job = TrainingJob(
            job_id=job_id,
            model_id=model_metadata.model_id,
            dataset_id=hashlib.md5(str(dataset_metadata).encode()).hexdigest()[:8],
            model_config=model_metadata.hyperparameters,
            training_config={
                'test_size': 0.2,
                'random_state': 42,
                'cross_validation_folds': 5
            }
        )
        
        self.active_jobs[job_id] = job
        
        # Start training in background
        asyncio.create_task(self._execute_training_job(job, model_metadata, training_data, dataset_metadata))
        
        return job
    
    async def _execute_training_job(
        self,
        job: TrainingJob,
        metadata: ModelMetadata,
        data: pd.DataFrame,
        dataset_metadata: Dict[str, Any]
    ):
        """Execute the actual training job"""
        try:
            job.status = "running"
            job.started_at = datetime.now(timezone.utc)
            job.progress = 0.1
            
            logger.info(f"Starting training job {job.job_id} for model {metadata.name}")
            
            # Prepare data
            X, y = await self._prepare_training_data(data, dataset_metadata)
            job.progress = 0.2
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, 
                test_size=job.training_config['test_size'],
                random_state=job.training_config['random_state']
            )
            job.progress = 0.3
            
            # Train model
            model = await self._create_model(metadata)
            job.progress = 0.4
            
            # Fit model
            model.fit(X_train, y_train)
            job.progress = 0.7
            
            # Evaluate model
            metrics = await self._evaluate_model(model, X_test, y_test, metadata.model_type)
            job.metrics = metrics
            job.progress = 0.9
            
            # Save model
            model_path = await self._save_model(model, metadata, metrics)
            job.artifacts['model_path'] = str(model_path)
            job.progress = 1.0
            
            # Update metadata
            metadata.metrics = metrics
            metadata.status = ModelStatus.TRAINED
            metadata.trained_at = datetime.now(timezone.utc)
            metadata.training_data_size = len(data)
            
            job.status = "completed"
            job.completed_at = datetime.now(timezone.utc)
            
            logger.info(f"Training job {job.job_id} completed successfully")
            
        except Exception as e:
            job.status = "failed"
            job.error_message = str(e)
            job.completed_at = datetime.now(timezone.utc)
            
            logger.error(f"Training job {job.job_id} failed: {e}")
    
    async def _prepare_training_data(
        self, 
        data: pd.DataFrame, 
        metadata: Dict[str, Any]
    ) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare data for training"""
        
        feature_columns = metadata['feature_columns']
        target_column = metadata['target_column']
        
        # Handle categorical variables
        categorical_columns = data[feature_columns].select_dtypes(include=['object']).columns
        
        X = data[feature_columns].copy()
        
        # Encode categorical variables
        for col in categorical_columns:
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str))
        
        # Scale numerical features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        y = data[target_column].values
        
        return X_scaled, y
    
    async def _create_model(self, metadata: ModelMetadata):
        """Create model based on metadata"""
        
        if metadata.model_type == ModelType.CLASSIFICATION:
            if metadata.framework == "sklearn":
                return RandomForestClassifier(
                    **metadata.hyperparameters,
                    random_state=42
                )
        
        elif metadata.model_type == ModelType.REGRESSION:
            if metadata.framework == "sklearn":
                return GradientBoostingRegressor(
                    **metadata.hyperparameters,
                    random_state=42
                )
        
        # Default to random forest
        return RandomForestClassifier(random_state=42)
    
    async def _evaluate_model(
        self, 
        model, 
        X_test: np.ndarray, 
        y_test: np.ndarray, 
        model_type: ModelType
    ) -> Dict[str, float]:
        """Evaluate trained model"""
        
        predictions = model.predict(X_test)
        
        if model_type == ModelType.CLASSIFICATION:
            return {
                'accuracy': accuracy_score(y_test, predictions),
                'precision': precision_score(y_test, predictions, average='weighted'),
                'recall': recall_score(y_test, predictions, average='weighted'),
                'f1_score': f1_score(y_test, predictions, average='weighted')
            }
        
        elif model_type == ModelType.REGRESSION:
            from sklearn.metrics import mean_squared_error, r2_score
            return {
                'mse': mean_squared_error(y_test, predictions),
                'rmse': np.sqrt(mean_squared_error(y_test, predictions)),
                'r2_score': r2_score(y_test, predictions)
            }
        
        return {}
    
    async def _save_model(
        self, 
        model, 
        metadata: ModelMetadata, 
        metrics: Dict[str, float]
    ) -> Path:
        """Save trained model to disk"""
        
        model_dir = self.storage_path / metadata.model_id
        model_dir.mkdir(exist_ok=True)
        
        # Save model
        model_path = model_dir / f"model_v{metadata.version}.pkl"
        joblib.dump(model, model_path)
        
        # Save metadata
        metadata_path = model_dir / f"metadata_v{metadata.version}.json"
        with open(metadata_path, 'w') as f:
            json.dump({
                **asdict(metadata),
                'metrics': metrics,
                'saved_at': datetime.now(timezone.utc).isoformat()
            }, f, indent=2, default=str)
        
        return model_path

class ModelInferenceEngine:
    """Provides model inference capabilities"""
    
    def __init__(self, model_storage_path: str = "/tmp/velocity_models"):
        self.storage_path = Path(model_storage_path)
        self.loaded_models: Dict[str, Any] = {}
        self.model_metadata: Dict[str, ModelMetadata] = {}
        self.inference_stats: Dict[str, Dict[str, int]] = defaultdict(lambda: defaultdict(int))
    
    async def load_model(self, model_id: str, version: str = "latest") -> bool:
        """Load a trained model for inference"""
        try:
            model_dir = self.storage_path / model_id
            
            if version == "latest":
                # Find latest version
                model_files = list(model_dir.glob("model_v*.pkl"))
                if not model_files:
                    return False
                
                latest_file = max(model_files, key=lambda x: x.stat().st_mtime)
                version = latest_file.stem.split("_v")[1]
            
            model_path = model_dir / f"model_v{version}.pkl"
            metadata_path = model_dir / f"metadata_v{version}.json"
            
            if not model_path.exists() or not metadata_path.exists():
                return False
            
            # Load model
            model = joblib.load(model_path)
            
            # Load metadata
            with open(metadata_path, 'r') as f:
                metadata_dict = json.load(f)
                metadata = ModelMetadata(**{
                    k: v for k, v in metadata_dict.items() 
                    if k in ModelMetadata.__dataclass_fields__
                })
            
            key = f"{model_id}_v{version}"
            self.loaded_models[key] = model
            self.model_metadata[key] = metadata
            
            logger.info(f"Model {model_id} v{version} loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load model {model_id}: {e}")
            return False
    
    async def predict(
        self, 
        model_id: str, 
        input_data: Union[Dict[str, Any], List[Dict[str, Any]]],
        version: str = "latest"
    ) -> Union[float, List[float], Dict[str, Any]]:
        """Make predictions using a loaded model"""
        
        key = f"{model_id}_v{version}"
        
        if key not in self.loaded_models:
            # Try to load the model
            if not await self.load_model(model_id, version):
                raise ValueError(f"Model {model_id} v{version} not available")
        
        model = self.loaded_models[key]
        metadata = self.model_metadata[key]
        
        try:
            # Prepare input data
            if isinstance(input_data, dict):
                input_data = [input_data]
            
            # Convert to DataFrame for consistent processing
            df = pd.DataFrame(input_data)
            
            # Apply same preprocessing as training
            X = await self._preprocess_inference_data(df, metadata)
            
            # Make predictions
            predictions = model.predict(X)
            
            # Update stats
            self.inference_stats[key]["requests"] += 1
            self.inference_stats[key]["samples"] += len(predictions)
            
            # Return single prediction or list
            if len(predictions) == 1:
                return float(predictions[0])
            else:
                return predictions.tolist()
                
        except Exception as e:
            self.inference_stats[key]["errors"] += 1
            logger.error(f"Prediction failed for model {model_id}: {e}")
            raise
    
    async def predict_batch(
        self, 
        model_id: str, 
        batch_data: List[Dict[str, Any]],
        version: str = "latest"
    ) -> List[float]:
        """Make batch predictions"""
        return await self.predict(model_id, batch_data, version)
    
    async def _preprocess_inference_data(
        self, 
        data: pd.DataFrame, 
        metadata: ModelMetadata
    ) -> np.ndarray:
        """Preprocess data for inference (simplified)"""
        # This should match the preprocessing used during training
        # In practice, you'd save and load the preprocessing pipeline
        
        # Handle categorical variables (simplified)
        categorical_columns = data.select_dtypes(include=['object']).columns
        
        X = data.copy()
        
        # Basic encoding (in practice, use saved encoders)
        for col in categorical_columns:
            X[col] = pd.Categorical(X[col]).codes
        
        # Fill missing values
        X = X.fillna(0)
        
        return X.values
    
    def get_model_info(self, model_id: str, version: str = "latest") -> Optional[Dict[str, Any]]:
        """Get information about a loaded model"""
        key = f"{model_id}_v{version}"
        
        if key not in self.model_metadata:
            return None
        
        metadata = self.model_metadata[key]
        stats = self.inference_stats[key]
        
        return {
            "model_id": model_id,
            "version": version,
            "metadata": asdict(metadata),
            "inference_stats": dict(stats),
            "loaded": True
        }
    
    def get_inference_stats(self) -> Dict[str, Any]:
        """Get inference statistics"""
        return {
            "loaded_models": len(self.loaded_models),
            "total_requests": sum(stats["requests"] for stats in self.inference_stats.values()),
            "total_predictions": sum(stats["samples"] for stats in self.inference_stats.values()),
            "total_errors": sum(stats["errors"] for stats in self.inference_stats.values()),
            "model_stats": dict(self.inference_stats)
        }

class MLPipeline:
    """Main ML pipeline orchestrator"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.data_processor = ComplianceDataProcessor(db_session)
        self.trainer = ModelTrainer()
        self.inference_engine = ModelInferenceEngine()
        
        # Pipeline state
        self.active_pipelines: Dict[str, Dict[str, Any]] = {}
        self.model_registry: Dict[str, ModelMetadata] = {}
    
    async def start(self):
        """Start the ML pipeline"""
        # Load existing models
        await self._discover_existing_models()
        
        logger.info("ML Pipeline started")
    
    async def create_training_pipeline(
        self,
        organization_id: str,
        task_type: TaskType,
        model_name: str,
        model_config: Dict[str, Any] = None
    ) -> str:
        """Create a complete training pipeline"""
        
        pipeline_id = f"pipeline_{organization_id}_{task_type.value}_{int(time.time())}"
        
        # Create model metadata
        metadata = ModelMetadata(
            model_id=f"model_{task_type.value}_{organization_id}",
            name=model_name,
            version="1.0",
            model_type=self._get_model_type_for_task(task_type),
            framework="sklearn",
            hyperparameters=model_config or {},
            use_case=f"Automated {task_type.value} for compliance",
            target_agents=self._get_target_agents_for_task(task_type),
            organization_id=organization_id,
            trained_at=datetime.now(timezone.utc)
        )
        
        # Register pipeline
        self.active_pipelines[pipeline_id] = {
            "status": "preparing_data",
            "organization_id": organization_id,
            "task_type": task_type,
            "metadata": metadata,
            "created_at": datetime.now(timezone.utc)
        }
        
        # Start pipeline execution
        asyncio.create_task(self._execute_training_pipeline(pipeline_id))
        
        return pipeline_id
    
    async def _execute_training_pipeline(self, pipeline_id: str):
        """Execute the training pipeline"""
        try:
            pipeline = self.active_pipelines[pipeline_id]
            metadata = pipeline["metadata"]
            
            # 1. Prepare training data
            pipeline["status"] = "preparing_data"
            data, dataset_metadata = await self.data_processor.create_training_dataset(
                pipeline["organization_id"],
                pipeline["task_type"]
            )
            
            if len(data) < 10:  # Minimum data requirement
                pipeline["status"] = "failed"
                pipeline["error"] = "Insufficient training data"
                return
            
            # 2. Train model
            pipeline["status"] = "training"
            training_job = await self.trainer.train_model(metadata, data, dataset_metadata)
            
            # Wait for training completion
            while training_job.status in ["pending", "running"]:
                await asyncio.sleep(5)
            
            if training_job.status == "completed":
                # 3. Load model for inference
                pipeline["status"] = "loading_model"
                success = await self.inference_engine.load_model(metadata.model_id)
                
                if success:
                    # 4. Register model
                    self.model_registry[metadata.model_id] = metadata
                    pipeline["status"] = "completed"
                    
                    logger.info(f"Training pipeline {pipeline_id} completed successfully")
                else:
                    pipeline["status"] = "failed"
                    pipeline["error"] = "Failed to load trained model"
            else:
                pipeline["status"] = "failed"
                pipeline["error"] = training_job.error_message or "Training failed"
                
        except Exception as e:
            self.active_pipelines[pipeline_id]["status"] = "failed"
            self.active_pipelines[pipeline_id]["error"] = str(e)
            logger.error(f"Training pipeline {pipeline_id} failed: {e}")
    
    def _get_model_type_for_task(self, task_type: TaskType) -> ModelType:
        """Get appropriate model type for task"""
        task_model_mapping = {
            TaskType.RISK_ASSESSMENT: ModelType.REGRESSION,
            TaskType.COMPLIANCE_CHECK: ModelType.CLASSIFICATION,
            TaskType.EVIDENCE_COLLECTION: ModelType.REGRESSION,
            TaskType.SECURITY_SCAN: ModelType.ANOMALY_DETECTION,
            TaskType.POLICY_ANALYSIS: ModelType.NLP
        }
        
        return task_model_mapping.get(task_type, ModelType.CLASSIFICATION)
    
    def _get_target_agents_for_task(self, task_type: TaskType) -> List[AgentType]:
        """Get target agents for task type"""
        task_agent_mapping = {
            TaskType.RISK_ASSESSMENT: [AgentType.PRISM],
            TaskType.COMPLIANCE_CHECK: [AgentType.COMPASS],
            TaskType.EVIDENCE_COLLECTION: [AgentType.CLEARANCE, AgentType.ATLAS],
            TaskType.SECURITY_SCAN: [AgentType.ATLAS],
            TaskType.POLICY_ANALYSIS: [AgentType.CIPHER]
        }
        
        return task_agent_mapping.get(task_type, [])
    
    async def _discover_existing_models(self):
        """Discover and load existing models"""
        if not self.trainer.storage_path.exists():
            return
        
        for model_dir in self.trainer.storage_path.iterdir():
            if model_dir.is_dir():
                # Find latest metadata file
                metadata_files = list(model_dir.glob("metadata_v*.json"))
                if metadata_files:
                    latest_metadata = max(metadata_files, key=lambda x: x.stat().st_mtime)
                    
                    try:
                        with open(latest_metadata, 'r') as f:
                            metadata_dict = json.load(f)
                            metadata = ModelMetadata(**{
                                k: v for k, v in metadata_dict.items() 
                                if k in ModelMetadata.__dataclass_fields__
                            })
                        
                        self.model_registry[metadata.model_id] = metadata
                        await self.inference_engine.load_model(metadata.model_id)
                        
                    except Exception as e:
                        logger.warning(f"Failed to load existing model {model_dir.name}: {e}")
    
    def get_pipeline_status(self, pipeline_id: str) -> Optional[Dict[str, Any]]:
        """Get status of a training pipeline"""
        return self.active_pipelines.get(pipeline_id)
    
    def get_available_models(self) -> Dict[str, Dict[str, Any]]:
        """Get all available models"""
        return {
            model_id: asdict(metadata) 
            for model_id, metadata in self.model_registry.items()
        }
    
    async def predict(
        self, 
        model_id: str, 
        input_data: Union[Dict[str, Any], List[Dict[str, Any]]]
    ) -> Union[float, List[float]]:
        """Make predictions using a model"""
        return await self.inference_engine.predict(model_id, input_data)

# Global ML pipeline instance
ml_pipeline = None

async def get_ml_pipeline(db: Session) -> MLPipeline:
    """Get or create ML pipeline instance"""
    global ml_pipeline
    if ml_pipeline is None:
        ml_pipeline = MLPipeline(db)
        await ml_pipeline.start()
    return ml_pipeline