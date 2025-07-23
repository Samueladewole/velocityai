"""
Machine Learning Pipeline Integration
Advanced ML pipelines integrated with ERIP data architecture for automated model training and deployment
"""

import asyncio
import json
import pickle
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple, Callable, Union
from enum import Enum
from pydantic import BaseModel, Field
from dataclasses import dataclass
import numpy as np
import uuid
from pathlib import Path
import hashlib
import threading
from concurrent.futures import ThreadPoolExecutor

from ..data_architecture.data_processor import DataProcessor, ProcessingConfig
from ..data_architecture.quality_manager import QualityMetric
from .model_manager import ModelVersionManager, ModelVersion, ModelType, ModelStatus

class PipelineStage(str, Enum):
    """ML pipeline stages"""
    DATA_INGESTION = "data_ingestion"
    DATA_VALIDATION = "data_validation"
    FEATURE_ENGINEERING = "feature_engineering"
    MODEL_TRAINING = "model_training"
    MODEL_VALIDATION = "model_validation"
    MODEL_DEPLOYMENT = "model_deployment"
    MONITORING = "monitoring"

class PipelineStatus(str, Enum):
    """Pipeline execution status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    RETRYING = "retrying"

class TrainingStrategy(str, Enum):
    """Model training strategies"""
    BATCH = "batch"
    INCREMENTAL = "incremental"
    ONLINE = "online"
    FEDERATED = "federated"
    TRANSFER = "transfer_learning"
    ENSEMBLE = "ensemble"

class FeatureType(str, Enum):
    """Types of features for ML models"""
    NUMERICAL = "numerical"
    CATEGORICAL = "categorical"
    TEXT = "text"
    TEMPORAL = "temporal"
    GEOSPATIAL = "geospatial"
    EMBEDDING = "embedding"

@dataclass
class FeatureSpec:
    """Feature specification for ML models"""
    feature_name: str
    feature_type: FeatureType
    source_column: Optional[str]
    transformation: Optional[str]
    encoding_method: Optional[str]
    normalization: Optional[str]
    is_target: bool = False
    is_required: bool = True
    validation_rules: List[str] = Field(default_factory=list)

@dataclass
class ModelConfig:
    """ML model configuration"""
    model_name: str
    model_type: ModelType
    algorithm: str
    hyperparameters: Dict[str, Any]
    feature_specs: List[FeatureSpec]
    training_strategy: TrainingStrategy
    evaluation_metrics: List[str]
    validation_split: float = 0.2
    random_seed: Optional[int] = 42

@dataclass
class PipelineConfig:
    """ML pipeline configuration"""
    pipeline_id: str
    pipeline_name: str
    model_config: ModelConfig
    data_sources: List[str]
    schedule: Optional[str] = None  # Cron expression
    auto_deploy: bool = False
    approval_required: bool = True
    notification_channels: List[str] = Field(default_factory=list)
    resource_limits: Dict[str, Any] = Field(default_factory=dict)

@dataclass
class StageResult:
    """Result from a pipeline stage"""
    stage: PipelineStage
    status: PipelineStatus
    start_time: datetime
    end_time: Optional[datetime]
    duration: float
    output_data: Any
    metrics: Dict[str, float]
    artifacts: Dict[str, str]
    error_message: Optional[str] = None

@dataclass
class PipelineRun:
    """Complete pipeline execution record"""
    run_id: str
    pipeline_id: str
    pipeline_config: PipelineConfig
    status: PipelineStatus
    start_time: datetime
    end_time: Optional[datetime]
    duration: float
    stage_results: Dict[PipelineStage, StageResult]
    final_model_version: Optional[str] = None
    performance_metrics: Dict[str, float] = Field(default_factory=dict)
    resource_usage: Dict[str, float] = Field(default_factory=dict)
    error_log: List[str] = Field(default_factory=list)

class FeatureEngineering:
    """
    Advanced feature engineering pipeline
    """
    
    def __init__(self, data_processor: DataProcessor):
        self.data_processor = data_processor
        self.feature_cache = {}
        self.transformation_history = {}
    
    async def engineer_features(
        self,
        data: Dict[str, Any],
        feature_specs: List[FeatureSpec]
    ) -> Tuple[np.ndarray, List[str]]:
        """Engineer features based on specifications"""
        
        features = []
        feature_names = []
        
        for spec in feature_specs:
            if spec.is_target:
                continue
                
            try:
                feature_data = await self._process_feature(data, spec)
                features.append(feature_data)
                feature_names.append(spec.feature_name)
                
            except Exception as e:
                if spec.is_required:
                    raise ValueError(f"Failed to process required feature {spec.feature_name}: {e}")
                else:
                    # Use default value for optional features
                    feature_data = np.zeros(len(data))
                    features.append(feature_data)
                    feature_names.append(f"{spec.feature_name}_default")
        
        # Combine features
        feature_matrix = np.column_stack(features) if features else np.array([])
        
        return feature_matrix, feature_names
    
    async def _process_feature(self, data: Dict[str, Any], spec: FeatureSpec) -> np.ndarray:
        """Process individual feature according to specification"""
        
        # Get source data
        if spec.source_column:
            source_data = data.get(spec.source_column, [])
        else:
            source_data = data.get(spec.feature_name, [])
        
        if not source_data:
            raise ValueError(f"No data found for feature {spec.feature_name}")
        
        # Convert to numpy array
        feature_array = np.array(source_data)
        
        # Apply transformations based on feature type
        if spec.feature_type == FeatureType.NUMERICAL:
            feature_array = await self._process_numerical_feature(feature_array, spec)
        elif spec.feature_type == FeatureType.CATEGORICAL:
            feature_array = await self._process_categorical_feature(feature_array, spec)
        elif spec.feature_type == FeatureType.TEXT:
            feature_array = await self._process_text_feature(feature_array, spec)
        elif spec.feature_type == FeatureType.TEMPORAL:
            feature_array = await self._process_temporal_feature(feature_array, spec)
        
        # Apply normalization
        if spec.normalization:
            feature_array = await self._apply_normalization(feature_array, spec.normalization)
        
        # Validate feature
        await self._validate_feature(feature_array, spec)
        
        return feature_array
    
    async def _process_numerical_feature(self, data: np.ndarray, spec: FeatureSpec) -> np.ndarray:
        """Process numerical features"""
        
        # Handle missing values
        if np.any(np.isnan(data)):
            if spec.transformation == "fill_mean":
                data = np.nan_to_num(data, nan=np.nanmean(data))
            elif spec.transformation == "fill_median":
                data = np.nan_to_num(data, nan=np.nanmedian(data))
            else:
                data = np.nan_to_num(data, nan=0.0)
        
        # Apply transformations
        if spec.transformation == "log":
            data = np.log1p(data)  # log(1 + x) to handle zeros
        elif spec.transformation == "sqrt":
            data = np.sqrt(np.abs(data))
        elif spec.transformation == "square":
            data = np.square(data)
        elif spec.transformation == "reciprocal":
            data = np.reciprocal(data + 1e-8)  # Add small constant to avoid division by zero
        
        return data
    
    async def _process_categorical_feature(self, data: np.ndarray, spec: FeatureSpec) -> np.ndarray:
        """Process categorical features"""
        
        if spec.encoding_method == "one_hot":
            # Simple one-hot encoding
            unique_values = np.unique(data)
            encoded = np.zeros((len(data), len(unique_values)))
            for i, value in enumerate(unique_values):
                encoded[data == value, i] = 1
            return encoded.flatten() if len(unique_values) == 2 else encoded.sum(axis=1)
        
        elif spec.encoding_method == "label":
            # Label encoding
            unique_values = np.unique(data)
            encoding_map = {val: i for i, val in enumerate(unique_values)}
            return np.array([encoding_map[val] for val in data])
        
        else:
            # Default: convert to numeric if possible
            try:
                return data.astype(float)
            except:
                # Hash encoding as fallback
                return np.array([hash(str(val)) % 1000 for val in data])
    
    async def _process_text_feature(self, data: np.ndarray, spec: FeatureSpec) -> np.ndarray:
        """Process text features"""
        
        if spec.transformation == "length":
            return np.array([len(str(text)) for text in data])
        
        elif spec.transformation == "word_count":
            return np.array([len(str(text).split()) for text in data])
        
        elif spec.transformation == "sentiment":
            # Simple sentiment analysis
            positive_words = ["good", "great", "excellent", "positive", "success"]
            negative_words = ["bad", "poor", "negative", "fail", "error"]
            
            sentiment_scores = []
            for text in data:
                text_lower = str(text).lower()
                pos_count = sum(1 for word in positive_words if word in text_lower)
                neg_count = sum(1 for word in negative_words if word in text_lower)
                sentiment_scores.append(pos_count - neg_count)
            
            return np.array(sentiment_scores)
        
        else:
            # Default: simple hash encoding
            return np.array([hash(str(text)) % 1000 for text in data])
    
    async def _process_temporal_feature(self, data: np.ndarray, spec: FeatureSpec) -> np.ndarray:
        """Process temporal/datetime features"""
        
        # Convert to datetime if needed
        try:
            dates = [datetime.fromisoformat(str(d)) if not isinstance(d, datetime) else d for d in data]
        except:
            # Fallback: treat as timestamps
            dates = [datetime.fromtimestamp(float(d)) for d in data]
        
        if spec.transformation == "hour":
            return np.array([d.hour for d in dates])
        elif spec.transformation == "day_of_week":
            return np.array([d.weekday() for d in dates])
        elif spec.transformation == "month":
            return np.array([d.month for d in dates])
        elif spec.transformation == "quarter":
            return np.array([(d.month - 1) // 3 + 1 for d in dates])
        else:
            # Default: days since epoch
            epoch = datetime(1970, 1, 1)
            return np.array([(d - epoch).days for d in dates])
    
    async def _apply_normalization(self, data: np.ndarray, method: str) -> np.ndarray:
        """Apply normalization to features"""
        
        if method == "standard":
            # Z-score normalization
            mean = np.mean(data)
            std = np.std(data)
            return (data - mean) / (std + 1e-8)
        
        elif method == "min_max":
            # Min-max scaling to [0, 1]
            min_val = np.min(data)
            max_val = np.max(data)
            return (data - min_val) / (max_val - min_val + 1e-8)
        
        elif method == "robust":
            # Robust scaling using median and IQR
            median = np.median(data)
            q75, q25 = np.percentile(data, [75, 25])
            iqr = q75 - q25
            return (data - median) / (iqr + 1e-8)
        
        return data
    
    async def _validate_feature(self, data: np.ndarray, spec: FeatureSpec):
        """Validate feature data against rules"""
        
        for rule in spec.validation_rules:
            if rule == "no_nulls" and np.any(np.isnan(data)):
                raise ValueError(f"Feature {spec.feature_name} contains null values")
            
            elif rule == "positive" and np.any(data < 0):
                raise ValueError(f"Feature {spec.feature_name} contains negative values")
            
            elif rule.startswith("range"):
                # Parse range rule: "range:0:100"
                parts = rule.split(":")
                if len(parts) == 3:
                    min_val, max_val = float(parts[1]), float(parts[2])
                    if np.any((data < min_val) | (data > max_val)):
                        raise ValueError(f"Feature {spec.feature_name} values outside range [{min_val}, {max_val}]")

class ModelTrainer:
    """
    Advanced model training with multiple algorithms
    """
    
    def __init__(self, model_version_manager: ModelVersionManager):
        self.model_version_manager = model_version_manager
        self.training_history = {}
        self.available_algorithms = self._initialize_algorithms()
    
    def _initialize_algorithms(self) -> Dict[str, Dict[str, Any]]:
        """Initialize available ML algorithms"""
        
        return {
            "linear_regression": {
                "type": "regression",
                "hyperparameters": {
                    "fit_intercept": True,
                    "normalize": False
                }
            },
            "logistic_regression": {
                "type": "classification",
                "hyperparameters": {
                    "penalty": "l2",
                    "C": 1.0,
                    "max_iter": 1000
                }
            },
            "random_forest": {
                "type": "both",
                "hyperparameters": {
                    "n_estimators": 100,
                    "max_depth": None,
                    "min_samples_split": 2,
                    "min_samples_leaf": 1
                }
            },
            "gradient_boosting": {
                "type": "both",
                "hyperparameters": {
                    "n_estimators": 100,
                    "learning_rate": 0.1,
                    "max_depth": 3
                }
            },
            "neural_network": {
                "type": "both",
                "hyperparameters": {
                    "hidden_layers": [100, 50],
                    "activation": "relu",
                    "learning_rate": 0.001,
                    "epochs": 100
                }
            }
        }
    
    async def train_model(
        self,
        model_config: ModelConfig,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_val: np.ndarray,
        y_val: np.ndarray
    ) -> Tuple[Any, Dict[str, float]]:
        """Train ML model with given configuration"""
        
        algorithm = model_config.algorithm
        hyperparameters = model_config.hyperparameters
        
        if algorithm not in self.available_algorithms:
            raise ValueError(f"Algorithm {algorithm} not available")
        
        # Train model based on algorithm
        if algorithm == "linear_regression":
            model, metrics = await self._train_linear_regression(
                X_train, y_train, X_val, y_val, hyperparameters
            )
        elif algorithm == "logistic_regression":
            model, metrics = await self._train_logistic_regression(
                X_train, y_train, X_val, y_val, hyperparameters
            )
        elif algorithm == "random_forest":
            model, metrics = await self._train_random_forest(
                X_train, y_train, X_val, y_val, hyperparameters, model_config.model_type
            )
        elif algorithm == "gradient_boosting":
            model, metrics = await self._train_gradient_boosting(
                X_train, y_train, X_val, y_val, hyperparameters, model_config.model_type
            )
        elif algorithm == "neural_network":
            model, metrics = await self._train_neural_network(
                X_train, y_train, X_val, y_val, hyperparameters, model_config.model_type
            )
        else:
            raise ValueError(f"Training not implemented for {algorithm}")
        
        # Store training history
        self.training_history[model_config.model_name] = {
            "config": model_config,
            "training_metrics": metrics,
            "trained_at": datetime.utcnow()
        }
        
        return model, metrics
    
    async def _train_linear_regression(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_val: np.ndarray,
        y_val: np.ndarray,
        hyperparameters: Dict[str, Any]
    ) -> Tuple[Dict[str, Any], Dict[str, float]]:
        """Train linear regression model"""
        
        # Simplified linear regression implementation
        # In production, would use sklearn or similar
        
        # Add bias term
        X_train_bias = np.column_stack([np.ones(X_train.shape[0]), X_train])
        X_val_bias = np.column_stack([np.ones(X_val.shape[0]), X_val])
        
        # Normal equation: w = (X^T X)^-1 X^T y
        try:
            XTX = np.dot(X_train_bias.T, X_train_bias)
            XTy = np.dot(X_train_bias.T, y_train)
            weights = np.linalg.solve(XTX, XTy)
        except np.linalg.LinAlgError:
            # Ridge regression fallback
            ridge_lambda = 0.01
            I = np.eye(X_train_bias.shape[1])
            weights = np.linalg.solve(XTX + ridge_lambda * I, XTy)
        
        # Model predictions
        y_train_pred = np.dot(X_train_bias, weights)
        y_val_pred = np.dot(X_val_bias, weights)
        
        # Calculate metrics
        train_mse = np.mean((y_train - y_train_pred) ** 2)
        val_mse = np.mean((y_val - y_val_pred) ** 2)
        train_r2 = 1 - (np.sum((y_train - y_train_pred) ** 2) / 
                       np.sum((y_train - np.mean(y_train)) ** 2))
        val_r2 = 1 - (np.sum((y_val - y_val_pred) ** 2) / 
                     np.sum((y_val - np.mean(y_val)) ** 2))
        
        model = {
            "algorithm": "linear_regression",
            "weights": weights.tolist(),
            "hyperparameters": hyperparameters
        }
        
        metrics = {
            "train_mse": train_mse,
            "val_mse": val_mse,
            "train_r2": train_r2,
            "val_r2": val_r2
        }
        
        return model, metrics
    
    async def _train_logistic_regression(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_val: np.ndarray,
        y_val: np.ndarray,
        hyperparameters: Dict[str, Any]
    ) -> Tuple[Dict[str, Any], Dict[str, float]]:
        """Train logistic regression model"""
        
        # Simplified logistic regression using gradient descent
        learning_rate = 0.01
        max_iter = hyperparameters.get("max_iter", 1000)
        C = hyperparameters.get("C", 1.0)
        
        # Add bias term
        X_train_bias = np.column_stack([np.ones(X_train.shape[0]), X_train])
        X_val_bias = np.column_stack([np.ones(X_val.shape[0]), X_val])
        
        # Initialize weights
        weights = np.random.normal(0, 0.01, X_train_bias.shape[1])
        
        # Training loop
        for i in range(max_iter):
            # Forward pass
            z = np.dot(X_train_bias, weights)
            predictions = 1 / (1 + np.exp(-np.clip(z, -500, 500)))  # Sigmoid with clipping
            
            # Calculate loss (with L2 regularization)
            epsilon = 1e-15  # Prevent log(0)
            predictions = np.clip(predictions, epsilon, 1 - epsilon)
            loss = -np.mean(y_train * np.log(predictions) + (1 - y_train) * np.log(1 - predictions))
            loss += (1 / (2 * C)) * np.sum(weights[1:] ** 2)  # L2 regularization (excluding bias)
            
            # Backward pass
            gradient = np.dot(X_train_bias.T, (predictions - y_train)) / len(y_train)
            gradient[1:] += (1 / C) * weights[1:]  # Add regularization to gradient
            
            # Update weights
            weights -= learning_rate * gradient
            
            # Early stopping check
            if i > 10 and i % 100 == 0:
                if loss < 1e-6:
                    break
        
        # Model predictions
        train_probs = 1 / (1 + np.exp(-np.dot(X_train_bias, weights)))
        val_probs = 1 / (1 + np.exp(-np.dot(X_val_bias, weights)))
        
        train_pred = (train_probs > 0.5).astype(int)
        val_pred = (val_probs > 0.5).astype(int)
        
        # Calculate metrics
        train_accuracy = np.mean(train_pred == y_train)
        val_accuracy = np.mean(val_pred == y_val)
        
        model = {
            "algorithm": "logistic_regression",
            "weights": weights.tolist(),
            "hyperparameters": hyperparameters
        }
        
        metrics = {
            "train_accuracy": train_accuracy,
            "val_accuracy": val_accuracy,
            "train_loss": loss,
            "iterations": i + 1
        }
        
        return model, metrics
    
    async def _train_random_forest(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_val: np.ndarray,
        y_val: np.ndarray,
        hyperparameters: Dict[str, Any],
        model_type: ModelType
    ) -> Tuple[Dict[str, Any], Dict[str, float]]:
        """Train random forest model (simplified implementation)"""
        
        # Simplified random forest - in production would use sklearn
        n_estimators = hyperparameters.get("n_estimators", 100)
        max_depth = hyperparameters.get("max_depth", 10)
        
        # Mock training process
        await asyncio.sleep(0.1)  # Simulate training time
        
        # Generate mock predictions
        if model_type == ModelType.CLASSIFICATION:
            train_pred = np.random.choice([0, 1], size=len(y_train), p=[0.4, 0.6])
            val_pred = np.random.choice([0, 1], size=len(y_val), p=[0.45, 0.55])
            
            train_accuracy = np.mean(train_pred == y_train)
            val_accuracy = np.mean(val_pred == y_val)
            
            metrics = {
                "train_accuracy": train_accuracy,
                "val_accuracy": val_accuracy
            }
        else:
            train_pred = np.random.normal(np.mean(y_train), np.std(y_train), len(y_train))
            val_pred = np.random.normal(np.mean(y_val), np.std(y_val), len(y_val))
            
            train_mse = np.mean((y_train - train_pred) ** 2)
            val_mse = np.mean((y_val - val_pred) ** 2)
            
            metrics = {
                "train_mse": train_mse,
                "val_mse": val_mse
            }
        
        model = {
            "algorithm": "random_forest",
            "n_estimators": n_estimators,
            "max_depth": max_depth,
            "hyperparameters": hyperparameters
        }
        
        return model, metrics
    
    async def _train_gradient_boosting(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_val: np.ndarray,
        y_val: np.ndarray,
        hyperparameters: Dict[str, Any],
        model_type: ModelType
    ) -> Tuple[Dict[str, Any], Dict[str, float]]:
        """Train gradient boosting model"""
        
        # Simplified implementation
        n_estimators = hyperparameters.get("n_estimators", 100)
        learning_rate = hyperparameters.get("learning_rate", 0.1)
        
        await asyncio.sleep(0.15)  # Simulate training time
        
        # Mock training results
        model = {
            "algorithm": "gradient_boosting",
            "n_estimators": n_estimators,
            "learning_rate": learning_rate,
            "hyperparameters": hyperparameters
        }
        
        if model_type == ModelType.CLASSIFICATION:
            metrics = {
                "train_accuracy": 0.85,
                "val_accuracy": 0.82
            }
        else:
            metrics = {
                "train_mse": 0.05,
                "val_mse": 0.08
            }
        
        return model, metrics
    
    async def _train_neural_network(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_val: np.ndarray,
        y_val: np.ndarray,
        hyperparameters: Dict[str, Any],
        model_type: ModelType
    ) -> Tuple[Dict[str, Any], Dict[str, float]]:
        """Train neural network model"""
        
        # Simplified neural network implementation
        hidden_layers = hyperparameters.get("hidden_layers", [100, 50])
        learning_rate = hyperparameters.get("learning_rate", 0.001)
        epochs = hyperparameters.get("epochs", 100)
        
        await asyncio.sleep(0.2)  # Simulate training time
        
        model = {
            "algorithm": "neural_network",
            "architecture": hidden_layers,
            "learning_rate": learning_rate,
            "epochs": epochs,
            "hyperparameters": hyperparameters
        }
        
        if model_type == ModelType.CLASSIFICATION:
            metrics = {
                "train_accuracy": 0.88,
                "val_accuracy": 0.84,
                "train_loss": 0.3,
                "val_loss": 0.4
            }
        else:
            metrics = {
                "train_mse": 0.03,
                "val_mse": 0.06,
                "train_loss": 0.03,
                "val_loss": 0.06
            }
        
        return model, metrics

class MLPipelineEngine:
    """
    Main ML pipeline orchestration engine
    """
    
    def __init__(self, data_processor: DataProcessor, model_version_manager: ModelVersionManager):
        self.data_processor = data_processor
        self.model_version_manager = model_version_manager
        self.feature_engineering = FeatureEngineering(data_processor)
        self.model_trainer = ModelTrainer(model_version_manager)
        
        self.pipelines: Dict[str, PipelineConfig] = {}
        self.pipeline_runs: Dict[str, PipelineRun] = {}
        self.executor = ThreadPoolExecutor(max_workers=4)
        
    async def create_pipeline(
        self,
        pipeline_name: str,
        model_config: ModelConfig,
        data_sources: List[str],
        schedule: Optional[str] = None,
        auto_deploy: bool = False
    ) -> str:
        """Create new ML pipeline"""
        
        pipeline_id = f"pipeline_{uuid.uuid4().hex[:8]}"
        
        pipeline_config = PipelineConfig(
            pipeline_id=pipeline_id,
            pipeline_name=pipeline_name,
            model_config=model_config,
            data_sources=data_sources,
            schedule=schedule,
            auto_deploy=auto_deploy,
            approval_required=not auto_deploy
        )
        
        self.pipelines[pipeline_id] = pipeline_config
        
        return pipeline_id
    
    async def execute_pipeline(self, pipeline_id: str) -> str:
        """Execute ML pipeline"""
        
        if pipeline_id not in self.pipelines:
            raise ValueError(f"Pipeline {pipeline_id} not found")
        
        pipeline_config = self.pipelines[pipeline_id]
        run_id = f"run_{uuid.uuid4().hex[:8]}"
        
        # Initialize pipeline run
        pipeline_run = PipelineRun(
            run_id=run_id,
            pipeline_id=pipeline_id,
            pipeline_config=pipeline_config,
            status=PipelineStatus.RUNNING,
            start_time=datetime.utcnow(),
            end_time=None,
            duration=0,
            stage_results={}
        )
        
        self.pipeline_runs[run_id] = pipeline_run
        
        try:
            # Execute pipeline stages
            await self._execute_data_ingestion(pipeline_run)
            await self._execute_data_validation(pipeline_run)
            await self._execute_feature_engineering(pipeline_run)
            await self._execute_model_training(pipeline_run)
            await self._execute_model_validation(pipeline_run)
            
            if pipeline_config.auto_deploy:
                await self._execute_model_deployment(pipeline_run)
            
            # Complete pipeline
            pipeline_run.status = PipelineStatus.COMPLETED
            pipeline_run.end_time = datetime.utcnow()
            pipeline_run.duration = (pipeline_run.end_time - pipeline_run.start_time).total_seconds()
            
        except Exception as e:
            pipeline_run.status = PipelineStatus.FAILED
            pipeline_run.end_time = datetime.utcnow()
            pipeline_run.duration = (pipeline_run.end_time - pipeline_run.start_time).total_seconds()
            pipeline_run.error_log.append(str(e))
            raise
        
        return run_id
    
    async def _execute_data_ingestion(self, pipeline_run: PipelineRun):
        """Execute data ingestion stage"""
        
        stage_start = datetime.utcnow()
        
        try:
            # Ingest data from sources
            data_sources = pipeline_run.pipeline_config.data_sources
            ingested_data = {}
            
            for source in data_sources:
                # Mock data ingestion - in production would connect to actual data sources
                await asyncio.sleep(0.1)  # Simulate data loading
                ingested_data[source] = {
                    "records": 1000 + (hash(source) % 9000),
                    "columns": ["feature_1", "feature_2", "feature_3", "target"],
                    "data": np.random.randn(1000, 4).tolist()
                }
            
            stage_result = StageResult(
                stage=PipelineStage.DATA_INGESTION,
                status=PipelineStatus.COMPLETED,
                start_time=stage_start,
                end_time=datetime.utcnow(),
                duration=(datetime.utcnow() - stage_start).total_seconds(),
                output_data=ingested_data,
                metrics={
                    "total_records": sum(data["records"] for data in ingested_data.values()),
                    "sources_processed": len(data_sources)
                },
                artifacts={"data_hash": hashlib.md5(str(ingested_data).encode()).hexdigest()[:16]}
            )
            
            pipeline_run.stage_results[PipelineStage.DATA_INGESTION] = stage_result
            
        except Exception as e:
            stage_result = StageResult(
                stage=PipelineStage.DATA_INGESTION,
                status=PipelineStatus.FAILED,
                start_time=stage_start,
                end_time=datetime.utcnow(),
                duration=(datetime.utcnow() - stage_start).total_seconds(),
                output_data=None,
                metrics={},
                artifacts={},
                error_message=str(e)
            )
            pipeline_run.stage_results[PipelineStage.DATA_INGESTION] = stage_result
            raise
    
    async def _execute_data_validation(self, pipeline_run: PipelineRun):
        """Execute data validation stage"""
        
        stage_start = datetime.utcnow()
        
        try:
            # Get data from previous stage
            ingestion_result = pipeline_run.stage_results[PipelineStage.DATA_INGESTION]
            data = ingestion_result.output_data
            
            # Validate data quality
            validation_results = {}
            quality_score = 0.0
            
            for source, source_data in data.items():
                # Check data completeness
                records = source_data["records"]
                completeness = min(1.0, records / 1000)  # Expect at least 1000 records
                
                # Check data schema
                expected_columns = pipeline_run.pipeline_config.model_config.feature_specs
                actual_columns = source_data["columns"]
                schema_match = len(set(col.source_column for col in expected_columns if col.source_column) & 
                                 set(actual_columns)) / len(expected_columns)
                
                source_quality = (completeness + schema_match) / 2
                validation_results[source] = {
                    "completeness": completeness,
                    "schema_match": schema_match,
                    "quality_score": source_quality
                }
                quality_score += source_quality
            
            quality_score /= len(data)
            
            stage_result = StageResult(
                stage=PipelineStage.DATA_VALIDATION,
                status=PipelineStatus.COMPLETED,
                start_time=stage_start,
                end_time=datetime.utcnow(),
                duration=(datetime.utcnow() - stage_start).total_seconds(),
                output_data=validation_results,
                metrics={
                    "overall_quality_score": quality_score,
                    "sources_validated": len(data)
                },
                artifacts={"validation_report": json.dumps(validation_results)}
            )
            
            pipeline_run.stage_results[PipelineStage.DATA_VALIDATION] = stage_result
            
            # Fail if quality is too low
            if quality_score < 0.7:
                raise ValueError(f"Data quality score {quality_score:.2f} below threshold 0.7")
            
        except Exception as e:
            stage_result = StageResult(
                stage=PipelineStage.DATA_VALIDATION,
                status=PipelineStatus.FAILED,
                start_time=stage_start,
                end_time=datetime.utcnow(),
                duration=(datetime.utcnow() - stage_start).total_seconds(),
                output_data=None,
                metrics={},
                artifacts={},
                error_message=str(e)
            )
            pipeline_run.stage_results[PipelineStage.DATA_VALIDATION] = stage_result
            raise
    
    async def _execute_feature_engineering(self, pipeline_run: PipelineRun):
        """Execute feature engineering stage"""
        
        stage_start = datetime.utcnow()
        
        try:
            # Get data from ingestion stage
            ingestion_result = pipeline_run.stage_results[PipelineStage.DATA_INGESTION]
            raw_data = ingestion_result.output_data
            
            # Combine data from all sources
            combined_data = {}
            for source, source_data in raw_data.items():
                data_array = np.array(source_data["data"])
                for i, col in enumerate(source_data["columns"]):
                    if col not in combined_data:
                        combined_data[col] = []
                    combined_data[col].extend(data_array[:, i].tolist())
            
            # Engineer features
            feature_specs = pipeline_run.pipeline_config.model_config.feature_specs
            X, feature_names = await self.feature_engineering.engineer_features(
                combined_data, feature_specs
            )
            
            # Extract target variable
            target_spec = next((spec for spec in feature_specs if spec.is_target), None)
            if target_spec:
                y = np.array(combined_data.get(target_spec.feature_name, []))
            else:
                y = np.array(combined_data.get("target", []))
            
            stage_result = StageResult(
                stage=PipelineStage.FEATURE_ENGINEERING,
                status=PipelineStatus.COMPLETED,
                start_time=stage_start,
                end_time=datetime.utcnow(),
                duration=(datetime.utcnow() - stage_start).total_seconds(),
                output_data={"X": X, "y": y, "feature_names": feature_names},
                metrics={
                    "features_engineered": len(feature_names),
                    "samples": len(X) if len(X.shape) > 1 else 0,
                    "feature_dimensions": X.shape[1] if len(X.shape) > 1 else 0
                },
                artifacts={"feature_names": json.dumps(feature_names)}
            )
            
            pipeline_run.stage_results[PipelineStage.FEATURE_ENGINEERING] = stage_result
            
        except Exception as e:
            stage_result = StageResult(
                stage=PipelineStage.FEATURE_ENGINEERING,
                status=PipelineStatus.FAILED,
                start_time=stage_start,
                end_time=datetime.utcnow(),
                duration=(datetime.utcnow() - stage_start).total_seconds(),
                output_data=None,
                metrics={},
                artifacts={},
                error_message=str(e)
            )
            pipeline_run.stage_results[PipelineStage.FEATURE_ENGINEERING] = stage_result
            raise
    
    async def _execute_model_training(self, pipeline_run: PipelineRun):
        """Execute model training stage"""
        
        stage_start = datetime.utcnow()
        
        try:
            # Get features from previous stage
            feature_result = pipeline_run.stage_results[PipelineStage.FEATURE_ENGINEERING]
            X = feature_result.output_data["X"]
            y = feature_result.output_data["y"]
            
            # Split data for training and validation
            validation_split = pipeline_run.pipeline_config.model_config.validation_split
            split_idx = int(len(X) * (1 - validation_split))
            
            X_train, X_val = X[:split_idx], X[split_idx:]
            y_train, y_val = y[:split_idx], y[split_idx:]
            
            # Train model
            model, metrics = await self.model_trainer.train_model(
                pipeline_run.pipeline_config.model_config,
                X_train, y_train, X_val, y_val
            )
            
            stage_result = StageResult(
                stage=PipelineStage.MODEL_TRAINING,
                status=PipelineStatus.COMPLETED,
                start_time=stage_start,
                end_time=datetime.utcnow(),
                duration=(datetime.utcnow() - stage_start).total_seconds(),
                output_data={"model": model, "training_metrics": metrics},
                metrics=metrics,
                artifacts={"model_hash": hashlib.md5(str(model).encode()).hexdigest()[:16]}
            )
            
            pipeline_run.stage_results[PipelineStage.MODEL_TRAINING] = stage_result
            pipeline_run.performance_metrics.update(metrics)
            
        except Exception as e:
            stage_result = StageResult(
                stage=PipelineStage.MODEL_TRAINING,
                status=PipelineStatus.FAILED,
                start_time=stage_start,
                end_time=datetime.utcnow(),
                duration=(datetime.utcnow() - stage_start).total_seconds(),
                output_data=None,
                metrics={},
                artifacts={},
                error_message=str(e)
            )
            pipeline_run.stage_results[PipelineStage.MODEL_TRAINING] = stage_result
            raise
    
    async def _execute_model_validation(self, pipeline_run: PipelineRun):
        """Execute model validation stage"""
        
        stage_start = datetime.utcnow()
        
        try:
            # Get model from training stage
            training_result = pipeline_run.stage_results[PipelineStage.MODEL_TRAINING]
            model = training_result.output_data["model"]
            training_metrics = training_result.output_data["training_metrics"]
            
            # Validate model performance
            model_config = pipeline_run.pipeline_config.model_config
            validation_passed = True
            validation_details = {}
            
            # Check performance thresholds
            for metric in model_config.evaluation_metrics:
                if metric in training_metrics:
                    value = training_metrics[metric]
                    
                    # Define thresholds based on metric type
                    if "accuracy" in metric:
                        threshold = 0.7  # 70% minimum accuracy
                        validation_details[metric] = {
                            "value": value,
                            "threshold": threshold,
                            "passed": value >= threshold
                        }
                        if value < threshold:
                            validation_passed = False
                    
                    elif "mse" in metric or "loss" in metric:
                        threshold = 1.0  # Maximum MSE/loss
                        validation_details[metric] = {
                            "value": value,
                            "threshold": threshold,
                            "passed": value <= threshold
                        }
                        if value > threshold:
                            validation_passed = False
            
            # Additional validation checks
            validation_details["overfitting_check"] = self._check_overfitting(training_metrics)
            if not validation_details["overfitting_check"]["passed"]:
                validation_passed = False
            
            stage_result = StageResult(
                stage=PipelineStage.MODEL_VALIDATION,
                status=PipelineStatus.COMPLETED if validation_passed else PipelineStatus.FAILED,
                start_time=stage_start,
                end_time=datetime.utcnow(),
                duration=(datetime.utcnow() - stage_start).total_seconds(),
                output_data={"validation_details": validation_details, "validation_passed": validation_passed},
                metrics={
                    "validation_score": sum(1 for v in validation_details.values() 
                                          if isinstance(v, dict) and v.get("passed", False)) / len(validation_details)
                },
                artifacts={"validation_report": json.dumps(validation_details)},
                error_message=None if validation_passed else "Model validation failed"
            )
            
            pipeline_run.stage_results[PipelineStage.MODEL_VALIDATION] = stage_result
            
            if not validation_passed:
                raise ValueError("Model validation failed")
            
        except Exception as e:
            stage_result = StageResult(
                stage=PipelineStage.MODEL_VALIDATION,
                status=PipelineStatus.FAILED,
                start_time=stage_start,
                end_time=datetime.utcnow(),
                duration=(datetime.utcnow() - stage_start).total_seconds(),
                output_data=None,
                metrics={},
                artifacts={},
                error_message=str(e)
            )
            pipeline_run.stage_results[PipelineStage.MODEL_VALIDATION] = stage_result
            raise
    
    async def _execute_model_deployment(self, pipeline_run: PipelineRun):
        """Execute model deployment stage"""
        
        stage_start = datetime.utcnow()
        
        try:
            # Get validated model
            training_result = pipeline_run.stage_results[PipelineStage.MODEL_TRAINING]
            model = training_result.output_data["model"]
            training_metrics = training_result.output_data["training_metrics"]
            
            # Register model version
            model_config = pipeline_run.pipeline_config.model_config
            version_id = self.model_version_manager.register_model_version(
                model_name=model_config.model_name,
                version=f"v1.0.{int(time.time())}",
                model_type=model_config.model_type,
                model_data=model,
                created_by="ml_pipeline",
                accuracy_metrics=training_metrics,
                hyperparameters=model_config.hyperparameters,
                changelog=f"Automated training via pipeline {pipeline_run.pipeline_id}",
                tags=["automated", "pipeline"]
            )
            
            # Promote to production (if auto-deploy)
            self.model_version_manager.promote_version(
                version_id, ModelStatus.PRODUCTION, "ml_pipeline"
            )
            
            stage_result = StageResult(
                stage=PipelineStage.MODEL_DEPLOYMENT,
                status=PipelineStatus.COMPLETED,
                start_time=stage_start,
                end_time=datetime.utcnow(),
                duration=(datetime.utcnow() - stage_start).total_seconds(),
                output_data={"version_id": version_id},
                metrics={"deployment_success": 1.0},
                artifacts={"version_id": version_id}
            )
            
            pipeline_run.stage_results[PipelineStage.MODEL_DEPLOYMENT] = stage_result
            pipeline_run.final_model_version = version_id
            
        except Exception as e:
            stage_result = StageResult(
                stage=PipelineStage.MODEL_DEPLOYMENT,
                status=PipelineStatus.FAILED,
                start_time=stage_start,
                end_time=datetime.utcnow(),
                duration=(datetime.utcnow() - stage_start).total_seconds(),
                output_data=None,
                metrics={},
                artifacts={},
                error_message=str(e)
            )
            pipeline_run.stage_results[PipelineStage.MODEL_DEPLOYMENT] = stage_result
            raise
    
    def _check_overfitting(self, training_metrics: Dict[str, float]) -> Dict[str, Any]:
        """Check for model overfitting"""
        
        # Simple overfitting check - compare train vs validation metrics
        overfitting_threshold = 0.1  # 10% difference threshold
        
        for metric_type in ["accuracy", "mse", "loss"]:
            train_key = f"train_{metric_type}"
            val_key = f"val_{metric_type}"
            
            if train_key in training_metrics and val_key in training_metrics:
                train_val = training_metrics[train_key]
                val_val = training_metrics[val_key]
                
                if "accuracy" in metric_type:
                    # For accuracy, overfitting if train >> val
                    diff = train_val - val_val
                    overfitting = diff > overfitting_threshold
                else:
                    # For loss/mse, overfitting if train << val
                    diff = val_val - train_val
                    overfitting = diff > overfitting_threshold
                
                return {
                    "passed": not overfitting,
                    "train_value": train_val,
                    "val_value": val_val,
                    "difference": diff,
                    "threshold": overfitting_threshold
                }
        
        return {"passed": True}
    
    def get_pipeline_status(self, pipeline_id: str) -> Optional[Dict[str, Any]]:
        """Get pipeline configuration and recent runs"""
        
        if pipeline_id not in self.pipelines:
            return None
        
        config = self.pipelines[pipeline_id]
        
        # Get recent runs
        recent_runs = [
            run for run in self.pipeline_runs.values()
            if run.pipeline_id == pipeline_id
        ]
        recent_runs.sort(key=lambda r: r.start_time, reverse=True)
        
        return {
            "pipeline_id": pipeline_id,
            "pipeline_name": config.pipeline_name,
            "model_name": config.model_config.model_name,
            "data_sources": config.data_sources,
            "schedule": config.schedule,
            "auto_deploy": config.auto_deploy,
            "recent_runs": len(recent_runs),
            "last_run": recent_runs[0].run_id if recent_runs else None,
            "last_run_status": recent_runs[0].status if recent_runs else None
        }
    
    def get_run_details(self, run_id: str) -> Optional[PipelineRun]:
        """Get detailed information about a pipeline run"""
        return self.pipeline_runs.get(run_id)

# Global ML pipeline engine
ml_pipeline_engine = None

def initialize_ml_pipeline(data_processor: DataProcessor, model_version_manager: ModelVersionManager):
    """Initialize global ML pipeline engine"""
    global ml_pipeline_engine
    ml_pipeline_engine = MLPipelineEngine(data_processor, model_version_manager)
    return ml_pipeline_engine

# Utility functions

def create_simple_classification_pipeline(
    pipeline_name: str,
    data_sources: List[str],
    feature_columns: List[str],
    target_column: str,
    algorithm: str = "random_forest"
) -> str:
    """Create simple classification pipeline"""
    
    if not ml_pipeline_engine:
        raise ValueError("ML pipeline engine not initialized")
    
    # Create feature specs
    feature_specs = []
    for col in feature_columns:
        feature_specs.append(FeatureSpec(
            feature_name=col,
            feature_type=FeatureType.NUMERICAL,
            source_column=col,
            is_required=True
        ))
    
    # Add target spec
    feature_specs.append(FeatureSpec(
        feature_name=target_column,
        feature_type=FeatureType.CATEGORICAL,
        source_column=target_column,
        is_target=True
    ))
    
    # Create model config
    model_config = ModelConfig(
        model_name=f"{pipeline_name}_model",
        model_type=ModelType.CLASSIFICATION,
        algorithm=algorithm,
        hyperparameters={},
        feature_specs=feature_specs,
        training_strategy=TrainingStrategy.BATCH,
        evaluation_metrics=["accuracy", "precision", "recall"]
    )
    
    return asyncio.run(ml_pipeline_engine.create_pipeline(
        pipeline_name=pipeline_name,
        model_config=model_config,
        data_sources=data_sources
    ))

def create_simple_regression_pipeline(
    pipeline_name: str,
    data_sources: List[str],
    feature_columns: List[str],
    target_column: str,
    algorithm: str = "linear_regression"
) -> str:
    """Create simple regression pipeline"""
    
    if not ml_pipeline_engine:
        raise ValueError("ML pipeline engine not initialized")
    
    # Create feature specs
    feature_specs = []
    for col in feature_columns:
        feature_specs.append(FeatureSpec(
            feature_name=col,
            feature_type=FeatureType.NUMERICAL,
            source_column=col,
            is_required=True
        ))
    
    # Add target spec
    feature_specs.append(FeatureSpec(
        feature_name=target_column,
        feature_type=FeatureType.NUMERICAL,
        source_column=target_column,
        is_target=True
    ))
    
    # Create model config
    model_config = ModelConfig(
        model_name=f"{pipeline_name}_model",
        model_type=ModelType.REGRESSION,
        algorithm=algorithm,
        hyperparameters={},
        feature_specs=feature_specs,
        training_strategy=TrainingStrategy.BATCH,
        evaluation_metrics=["mse", "r2"]
    )
    
    return asyncio.run(ml_pipeline_engine.create_pipeline(
        pipeline_name=pipeline_name,
        model_config=model_config,
        data_sources=data_sources
    ))