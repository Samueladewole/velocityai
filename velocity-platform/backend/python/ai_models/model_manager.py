"""
Advanced AI Model Management System
Enterprise-grade model versioning, deployment, and lifecycle management
"""

import asyncio
import time
import json
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple, Union
from enum import Enum
from pydantic import BaseModel, Field
from dataclasses import dataclass
import numpy as np
from pathlib import Path
import pickle
import uuid

class ModelStatus(str, Enum):
    """Model deployment status"""
    TRAINING = "training"
    TESTING = "testing"
    STAGING = "staging"
    PRODUCTION = "production"
    DEPRECATED = "deprecated"
    RETIRED = "retired"

class ModelType(str, Enum):
    """Types of AI models"""
    LLM = "large_language_model"
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    NLP = "natural_language_processing"
    COMPUTER_VISION = "computer_vision"
    TIME_SERIES = "time_series"
    ENSEMBLE = "ensemble"

class DeploymentStrategy(str, Enum):
    """Model deployment strategies"""
    BLUE_GREEN = "blue_green"
    CANARY = "canary"
    A_B_TEST = "a_b_test"
    SHADOW = "shadow"
    ROLLING = "rolling"

@dataclass
class ModelVersion:
    """Model version metadata"""
    version_id: str
    model_name: str
    version: str
    model_type: ModelType
    status: ModelStatus
    created_at: datetime
    created_by: str
    model_hash: str
    size_mb: float
    accuracy_metrics: Dict[str, float]
    performance_metrics: Dict[str, float]
    training_data_hash: str
    hyperparameters: Dict[str, Any]
    dependencies: Dict[str, str]
    changelog: str
    tags: List[str]

@dataclass
class DeploymentConfig:
    """Model deployment configuration"""
    strategy: DeploymentStrategy
    traffic_split: Dict[str, float]  # version_id -> traffic percentage
    rollout_duration: int  # minutes
    success_criteria: Dict[str, float]
    rollback_criteria: Dict[str, float]
    monitoring_metrics: List[str]
    auto_rollback: bool = True

@dataclass
class ModelPerformance:
    """Real-time model performance metrics"""
    version_id: str
    timestamp: datetime
    request_count: int
    average_latency: float
    error_rate: float
    accuracy_score: float
    throughput: float
    memory_usage: float
    cpu_usage: float
    cost_per_request: float

class ModelVersionManager:
    """
    Advanced model version management with enterprise features
    """
    
    def __init__(self):
        self.versions: Dict[str, ModelVersion] = {}
        self.active_deployments: Dict[str, DeploymentConfig] = {}
        self.performance_history: List[ModelPerformance] = []
        self.ab_tests: Dict[str, Dict[str, Any]] = {}
        
    def register_model_version(
        self,
        model_name: str,
        version: str,
        model_type: ModelType,
        model_data: Any,
        created_by: str,
        accuracy_metrics: Dict[str, float],
        hyperparameters: Dict[str, Any],
        changelog: str = "",
        tags: List[str] = None
    ) -> str:
        """Register a new model version"""
        
        version_id = f"{model_name}:{version}:{uuid.uuid4().hex[:8]}"
        
        # Calculate model hash for integrity verification
        model_hash = self._calculate_model_hash(model_data)
        
        # Estimate model size (simplified)
        model_size = self._estimate_model_size(model_data)
        
        # Create version metadata
        model_version = ModelVersion(
            version_id=version_id,
            model_name=model_name,
            version=version,
            model_type=model_type,
            status=ModelStatus.TESTING,
            created_at=datetime.utcnow(),
            created_by=created_by,
            model_hash=model_hash,
            size_mb=model_size,
            accuracy_metrics=accuracy_metrics,
            performance_metrics={},
            training_data_hash="",  # Would be calculated from training data
            hyperparameters=hyperparameters,
            dependencies={},  # Would be extracted from environment
            changelog=changelog,
            tags=tags or []
        )
        
        self.versions[version_id] = model_version
        
        return version_id
    
    def promote_version(
        self,
        version_id: str,
        target_status: ModelStatus,
        approval_by: str
    ) -> bool:
        """Promote model version through deployment stages"""
        
        if version_id not in self.versions:
            raise ValueError(f"Version {version_id} not found")
        
        version = self.versions[version_id]
        
        # Validate promotion path
        valid_promotions = {
            ModelStatus.TESTING: [ModelStatus.STAGING],
            ModelStatus.STAGING: [ModelStatus.PRODUCTION],
            ModelStatus.PRODUCTION: [ModelStatus.DEPRECATED],
            ModelStatus.DEPRECATED: [ModelStatus.RETIRED]
        }
        
        if target_status not in valid_promotions.get(version.status, []):
            raise ValueError(f"Cannot promote from {version.status} to {target_status}")
        
        # Update version status
        version.status = target_status
        
        # Log promotion event
        print(f"Model {version_id} promoted to {target_status} by {approval_by}")
        
        return True
    
    def deploy_version(
        self,
        version_id: str,
        deployment_config: DeploymentConfig
    ) -> str:
        """Deploy model version with specified strategy"""
        
        if version_id not in self.versions:
            raise ValueError(f"Version {version_id} not found")
        
        version = self.versions[version_id]
        
        if version.status != ModelStatus.PRODUCTION:
            raise ValueError("Only production versions can be deployed")
        
        deployment_id = f"deploy_{uuid.uuid4().hex[:8]}"
        
        # Store deployment configuration
        self.active_deployments[deployment_id] = deployment_config
        
        # Execute deployment based on strategy
        if deployment_config.strategy == DeploymentStrategy.BLUE_GREEN:
            self._execute_blue_green_deployment(version_id, deployment_config)
        elif deployment_config.strategy == DeploymentStrategy.CANARY:
            self._execute_canary_deployment(version_id, deployment_config)
        elif deployment_config.strategy == DeploymentStrategy.A_B_TEST:
            self._execute_ab_test_deployment(version_id, deployment_config)
        
        return deployment_id
    
    def create_ab_test(
        self,
        test_name: str,
        version_a: str,
        version_b: str,
        traffic_split: float = 0.5,
        duration_hours: int = 24,
        success_metric: str = "accuracy_score",
        minimum_requests: int = 1000
    ) -> str:
        """Create A/B test between two model versions"""
        
        if version_a not in self.versions or version_b not in self.versions:
            raise ValueError("Both versions must be registered")
        
        test_id = f"ab_test_{uuid.uuid4().hex[:8]}"
        
        ab_test = {
            "test_id": test_id,
            "test_name": test_name,
            "version_a": version_a,
            "version_b": version_b,
            "traffic_split": traffic_split,
            "start_time": datetime.utcnow(),
            "end_time": datetime.utcnow() + timedelta(hours=duration_hours),
            "success_metric": success_metric,
            "minimum_requests": minimum_requests,
            "status": "running",
            "results": {
                "version_a": {"requests": 0, "metrics": {}},
                "version_b": {"requests": 0, "metrics": {}}
            }
        }
        
        self.ab_tests[test_id] = ab_test
        
        return test_id
    
    def get_version_info(self, version_id: str) -> Optional[ModelVersion]:
        """Get detailed version information"""
        return self.versions.get(version_id)
    
    def list_versions(
        self,
        model_name: Optional[str] = None,
        status: Optional[ModelStatus] = None
    ) -> List[ModelVersion]:
        """List model versions with optional filtering"""
        
        versions = list(self.versions.values())
        
        if model_name:
            versions = [v for v in versions if v.model_name == model_name]
        
        if status:
            versions = [v for v in versions if v.status == status]
        
        return sorted(versions, key=lambda x: x.created_at, reverse=True)
    
    def record_performance(self, performance: ModelPerformance):
        """Record model performance metrics"""
        self.performance_history.append(performance)
        
        # Trigger alerts if performance degrades
        self._check_performance_alerts(performance)
    
    def get_performance_metrics(
        self,
        version_id: str,
        time_range_hours: int = 24
    ) -> List[ModelPerformance]:
        """Get performance metrics for a version"""
        
        cutoff_time = datetime.utcnow() - timedelta(hours=time_range_hours)
        
        return [
            p for p in self.performance_history
            if p.version_id == version_id and p.timestamp >= cutoff_time
        ]
    
    def _calculate_model_hash(self, model_data: Any) -> str:
        """Calculate hash for model integrity verification"""
        # Simplified hash calculation
        model_str = str(model_data) if model_data else ""
        return hashlib.sha256(model_str.encode()).hexdigest()[:16]
    
    def _estimate_model_size(self, model_data: Any) -> float:
        """Estimate model size in MB"""
        # Simplified size estimation
        if hasattr(model_data, '__sizeof__'):
            return model_data.__sizeof__() / (1024 * 1024)
        return 10.0  # Default estimate
    
    def _execute_blue_green_deployment(
        self,
        version_id: str,
        config: DeploymentConfig
    ):
        """Execute blue-green deployment"""
        print(f"Executing blue-green deployment for {version_id}")
        # Implementation would switch traffic atomically
    
    def _execute_canary_deployment(
        self,
        version_id: str,
        config: DeploymentConfig
    ):
        """Execute canary deployment"""
        print(f"Executing canary deployment for {version_id}")
        # Implementation would gradually increase traffic
    
    def _execute_ab_test_deployment(
        self,
        version_id: str,
        config: DeploymentConfig
    ):
        """Execute A/B test deployment"""
        print(f"Executing A/B test deployment for {version_id}")
        # Implementation would split traffic for testing
    
    def _check_performance_alerts(self, performance: ModelPerformance):
        """Check for performance degradation alerts"""
        
        alerts = []
        
        if performance.error_rate > 0.05:  # 5% error rate threshold
            alerts.append(f"High error rate: {performance.error_rate:.2%}")
        
        if performance.average_latency > 2.0:  # 2 second latency threshold
            alerts.append(f"High latency: {performance.average_latency:.2f}s")
        
        if performance.accuracy_score < 0.85:  # 85% accuracy threshold
            alerts.append(f"Low accuracy: {performance.accuracy_score:.2%}")
        
        if alerts:
            print(f"Performance alerts for {performance.version_id}: {', '.join(alerts)}")

class ModelCacheManager:
    """
    Intelligent model caching and prediction optimization
    """
    
    def __init__(self, max_cache_size_mb: int = 1000):
        self.max_cache_size = max_cache_size_mb
        self.cache: Dict[str, Any] = {}
        self.cache_stats: Dict[str, Dict[str, Any]] = {}
        self.access_patterns: Dict[str, List[datetime]] = {}
    
    def get_cached_prediction(
        self,
        cache_key: str,
        input_hash: str
    ) -> Optional[Any]:
        """Get cached prediction if available"""
        
        full_key = f"{cache_key}:{input_hash}"
        
        if full_key in self.cache:
            # Update access pattern
            if full_key not in self.access_patterns:
                self.access_patterns[full_key] = []
            self.access_patterns[full_key].append(datetime.utcnow())
            
            # Update cache stats
            self._update_cache_stats(full_key, hit=True)
            
            return self.cache[full_key]
        
        self._update_cache_stats(full_key, hit=False)
        return None
    
    def cache_prediction(
        self,
        cache_key: str,
        input_hash: str,
        prediction: Any,
        ttl_minutes: int = 60
    ):
        """Cache prediction result"""
        
        full_key = f"{cache_key}:{input_hash}"
        
        # Store with expiration time
        self.cache[full_key] = {
            "prediction": prediction,
            "cached_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(minutes=ttl_minutes),
            "access_count": 0
        }
        
        # Clean expired entries if cache is full
        self._cleanup_expired_entries()
    
    def get_cache_statistics(self) -> Dict[str, Any]:
        """Get cache performance statistics"""
        
        total_requests = sum(stats["requests"] for stats in self.cache_stats.values())
        total_hits = sum(stats["hits"] for stats in self.cache_stats.values())
        
        hit_rate = (total_hits / total_requests) if total_requests > 0 else 0
        
        return {
            "hit_rate": hit_rate,
            "total_requests": total_requests,
            "total_hits": total_hits,
            "cache_size": len(self.cache),
            "memory_usage_mb": self._estimate_cache_size(),
            "top_cached_models": self._get_top_cached_models()
        }
    
    def _update_cache_stats(self, cache_key: str, hit: bool):
        """Update cache hit/miss statistics"""
        
        if cache_key not in self.cache_stats:
            self.cache_stats[cache_key] = {"requests": 0, "hits": 0}
        
        self.cache_stats[cache_key]["requests"] += 1
        if hit:
            self.cache_stats[cache_key]["hits"] += 1
    
    def _cleanup_expired_entries(self):
        """Remove expired cache entries"""
        
        now = datetime.utcnow()
        expired_keys = [
            key for key, value in self.cache.items()
            if value["expires_at"] < now
        ]
        
        for key in expired_keys:
            del self.cache[key]
    
    def _estimate_cache_size(self) -> float:
        """Estimate cache size in MB"""
        # Simplified size estimation
        return len(self.cache) * 0.1  # Assume 100KB per entry
    
    def _get_top_cached_models(self) -> List[Dict[str, Any]]:
        """Get most frequently cached models"""
        
        sorted_stats = sorted(
            self.cache_stats.items(),
            key=lambda x: x[1]["requests"],
            reverse=True
        )
        
        return [
            {"model": key, "requests": stats["requests"], "hit_rate": stats["hits"] / stats["requests"]}
            for key, stats in sorted_stats[:10]
        ]

class ModelGovernanceManager:
    """
    AI model governance, compliance, and security management
    """
    
    def __init__(self):
        self.governance_policies = self._initialize_governance_policies()
        self.audit_log: List[Dict[str, Any]] = []
        self.compliance_reports: List[Dict[str, Any]] = []
        
    def _initialize_governance_policies(self) -> Dict[str, Any]:
        """Initialize governance policies"""
        return {
            "model_approval": {
                "required_accuracy_threshold": 0.90,
                "required_approvers": 2,
                "max_bias_score": 0.10,
                "security_scan_required": True
            },
            "data_privacy": {
                "pii_detection_required": True,
                "data_retention_days": 90,
                "encryption_required": True,
                "audit_logging": True
            },
            "fairness": {
                "bias_testing_required": True,
                "demographic_parity_threshold": 0.05,
                "equalized_odds_threshold": 0.05,
                "fairness_metrics": ["demographic_parity", "equalized_odds", "calibration"]
            },
            "explainability": {
                "interpretability_required": True,
                "explanation_methods": ["lime", "shap", "attention_weights"],
                "human_review_threshold": 0.8
            }
        }
    
    def validate_model_compliance(
        self,
        version_id: str,
        compliance_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Validate model compliance against governance policies"""
        
        validation_results = {
            "version_id": version_id,
            "timestamp": datetime.utcnow(),
            "compliant": True,
            "violations": [],
            "warnings": [],
            "score": 0.0
        }
        
        # Check accuracy threshold
        accuracy = compliance_data.get("accuracy_score", 0.0)
        if accuracy < self.governance_policies["model_approval"]["required_accuracy_threshold"]:
            validation_results["violations"].append(
                f"Accuracy {accuracy:.2%} below threshold {self.governance_policies['model_approval']['required_accuracy_threshold']:.2%}"
            )
            validation_results["compliant"] = False
        
        # Check bias score
        bias_score = compliance_data.get("bias_score", 0.0)
        if bias_score > self.governance_policies["model_approval"]["max_bias_score"]:
            validation_results["violations"].append(
                f"Bias score {bias_score:.2%} exceeds maximum {self.governance_policies['model_approval']['max_bias_score']:.2%}"
            )
            validation_results["compliant"] = False
        
        # Check fairness metrics
        fairness_metrics = compliance_data.get("fairness_metrics", {})
        for metric in self.governance_policies["fairness"]["fairness_metrics"]:
            if metric in fairness_metrics:
                value = fairness_metrics[metric]
                threshold = self.governance_policies["fairness"][f"{metric}_threshold"]
                if value > threshold:
                    validation_results["warnings"].append(
                        f"Fairness metric {metric} value {value:.3f} exceeds threshold {threshold:.3f}"
                    )
        
        # Calculate compliance score
        violation_penalty = len(validation_results["violations"]) * 0.2
        warning_penalty = len(validation_results["warnings"]) * 0.1
        validation_results["score"] = max(0.0, 1.0 - violation_penalty - warning_penalty)
        
        # Log compliance check
        self.audit_log.append({
            "event": "compliance_validation",
            "version_id": version_id,
            "timestamp": datetime.utcnow(),
            "result": validation_results,
            "compliance_data": compliance_data
        })
        
        return validation_results
    
    def generate_governance_report(
        self,
        time_range_days: int = 30
    ) -> Dict[str, Any]:
        """Generate comprehensive governance report"""
        
        cutoff_date = datetime.utcnow() - timedelta(days=time_range_days)
        
        # Filter recent audit events
        recent_events = [
            event for event in self.audit_log
            if event["timestamp"] >= cutoff_date
        ]
        
        # Calculate compliance statistics
        compliance_events = [
            event for event in recent_events
            if event["event"] == "compliance_validation"
        ]
        
        compliant_models = [
            event for event in compliance_events
            if event["result"]["compliant"]
        ]
        
        compliance_rate = len(compliant_models) / len(compliance_events) if compliance_events else 0
        
        # Identify top violations
        all_violations = []
        for event in compliance_events:
            all_violations.extend(event["result"]["violations"])
        
        violation_counts = {}
        for violation in all_violations:
            violation_counts[violation] = violation_counts.get(violation, 0) + 1
        
        top_violations = sorted(
            violation_counts.items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]
        
        report = {
            "report_id": f"gov_report_{uuid.uuid4().hex[:8]}",
            "generated_at": datetime.utcnow(),
            "time_range_days": time_range_days,
            "summary": {
                "total_models_evaluated": len(compliance_events),
                "compliant_models": len(compliant_models),
                "compliance_rate": compliance_rate,
                "total_violations": len(all_violations),
                "total_warnings": sum(
                    len(event["result"]["warnings"])
                    for event in compliance_events
                )
            },
            "top_violations": [
                {"violation": violation, "count": count}
                for violation, count in top_violations
            ],
            "recommendations": self._generate_compliance_recommendations(
                compliance_rate, top_violations
            )
        }
        
        self.compliance_reports.append(report)
        
        return report
    
    def _generate_compliance_recommendations(
        self,
        compliance_rate: float,
        top_violations: List[Tuple[str, int]]
    ) -> List[str]:
        """Generate compliance improvement recommendations"""
        
        recommendations = []
        
        if compliance_rate < 0.8:
            recommendations.append(
                "Compliance rate below 80% - implement additional model validation processes"
            )
        
        for violation, count in top_violations[:3]:
            if "accuracy" in violation.lower():
                recommendations.append(
                    "Improve model training processes to meet accuracy thresholds"
                )
            elif "bias" in violation.lower():
                recommendations.append(
                    "Implement bias mitigation techniques in model development"
                )
            elif "fairness" in violation.lower():
                recommendations.append(
                    "Enhance fairness testing and demographic analysis"
                )
        
        if not recommendations:
            recommendations.append("Maintain current governance standards")
        
        return recommendations

# Global instances
model_version_manager = ModelVersionManager()
model_cache_manager = ModelCacheManager()
model_governance_manager = ModelGovernanceManager()

# Utility functions

def create_input_hash(input_data: Any) -> str:
    """Create hash of input data for caching"""
    input_str = json.dumps(input_data, sort_keys=True) if isinstance(input_data, dict) else str(input_data)
    return hashlib.md5(input_str.encode()).hexdigest()

def validate_model_deployment(version_id: str) -> bool:
    """Validate model is ready for deployment"""
    version = model_version_manager.get_version_info(version_id)
    
    if not version:
        return False
    
    if version.status != ModelStatus.PRODUCTION:
        return False
    
    # Check accuracy requirements
    if version.accuracy_metrics.get("accuracy", 0) < 0.85:
        return False
    
    return True

def get_optimal_model_version(
    model_name: str,
    task_requirements: Dict[str, Any]
) -> Optional[str]:
    """Get optimal model version based on requirements"""
    
    # Get all production versions of the model
    production_versions = model_version_manager.list_versions(
        model_name=model_name,
        status=ModelStatus.PRODUCTION
    )
    
    if not production_versions:
        return None
    
    # Score versions based on requirements
    best_version = None
    best_score = -1
    
    for version in production_versions:
        score = 0
        
        # Accuracy weight
        accuracy = version.accuracy_metrics.get("accuracy", 0)
        score += accuracy * task_requirements.get("accuracy_weight", 0.5)
        
        # Latency weight (inverse - lower is better)
        latency = version.performance_metrics.get("latency", 1.0)
        score += (1.0 / latency) * task_requirements.get("speed_weight", 0.3)
        
        # Cost weight (inverse - lower is better)
        cost = version.performance_metrics.get("cost_per_request", 0.01)
        score += (1.0 / cost) * task_requirements.get("cost_weight", 0.2)
        
        if score > best_score:
            best_score = score
            best_version = version.version_id
    
    return best_version