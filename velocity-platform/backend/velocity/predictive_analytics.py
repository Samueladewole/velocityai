"""
Predictive Compliance Analytics System for Velocity AI Platform
Provides AI-powered predictive insights for compliance management
"""

import asyncio
import json
import uuid
import time
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional, Union, Tuple
from enum import Enum
from dataclasses import dataclass, field, asdict
from collections import defaultdict, deque
import logging
import numpy as np
import pandas as pd

from pydantic import BaseModel, Field
import structlog
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

# ML libraries
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error
import joblib

from agent_orchestration import AgentType, TaskType
from models import Organization, User, EvidenceItem, Agent, TrustScore, Framework
from ml_pipeline import MLPipeline, get_ml_pipeline

logger = structlog.get_logger()

class PredictionType(Enum):
    """Types of predictions"""
    COMPLIANCE_SCORE = "compliance_score"
    RISK_LEVEL = "risk_level"
    EVIDENCE_GAP = "evidence_gap"
    CONTROL_FAILURE = "control_failure"
    AUDIT_READINESS = "audit_readiness"
    RESOURCE_DEMAND = "resource_demand"
    TIMELINE_ESTIMATION = "timeline_estimation"
    COST_PROJECTION = "cost_projection"

class RiskLevel(Enum):
    """Risk level classifications"""
    VERY_LOW = "very_low"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class TrendDirection(Enum):
    """Trend direction indicators"""
    IMPROVING = "improving"
    STABLE = "stable"
    DECLINING = "declining"
    VOLATILE = "volatile"

@dataclass
class Prediction:
    """Individual prediction result"""
    prediction_id: str
    prediction_type: PredictionType
    organization_id: str
    
    # Prediction data
    predicted_value: Union[float, str, Dict[str, Any]]
    confidence_score: float
    prediction_date: datetime
    valid_until: datetime
    
    # Context
    framework: Optional[Framework] = None
    agent_type: Optional[AgentType] = None
    control_id: Optional[str] = None
    
    # Supporting data
    features_used: List[str] = field(default_factory=list)
    model_version: str = "1.0"
    historical_accuracy: Optional[float] = None
    
    # Risk assessment
    risk_level: Optional[RiskLevel] = None
    trend_direction: Optional[TrendDirection] = None
    
    # Recommendations
    recommendations: List[str] = field(default_factory=list)
    action_items: List[Dict[str, Any]] = field(default_factory=list)
    
    # Metadata
    created_by: AgentType = AgentType.PRISM
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

@dataclass
class ComplianceHealthMetrics:
    """Comprehensive compliance health indicators"""
    organization_id: str
    assessment_date: datetime
    
    # Overall scores
    overall_health_score: float  # 0-100
    compliance_maturity: float   # 0-100
    automation_efficiency: float # 0-100
    
    # Framework-specific scores
    framework_scores: Dict[str, float] = field(default_factory=dict)
    
    # Trend indicators
    health_trend: TrendDirection = TrendDirection.STABLE
    improvement_velocity: float = 0.0  # Rate of improvement
    
    # Risk indicators
    high_risk_areas: List[str] = field(default_factory=list)
    emerging_risks: List[Dict[str, Any]] = field(default_factory=list)
    
    # Resource insights
    resource_utilization: float = 0.0
    efficiency_gaps: List[str] = field(default_factory=list)
    
    # Predictive insights
    projected_scores: Dict[str, float] = field(default_factory=dict)
    timeline_to_target: Optional[int] = None  # Days to reach target score

class ComplianceDataAnalyzer:
    """Analyzes historical compliance data for patterns"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.feature_cache: Dict[str, pd.DataFrame] = {}
        self.cache_expiry: Dict[str, datetime] = {}
    
    async def analyze_compliance_trends(
        self, 
        organization_id: str, 
        framework: Optional[Framework] = None,
        lookback_days: int = 90
    ) -> Dict[str, Any]:
        """Analyze compliance trends over time"""
        
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=lookback_days)
        
        # Get historical trust scores
        trust_scores = self.db.query(TrustScore).filter(
            TrustScore.organization_id == organization_id,
            TrustScore.created_at >= cutoff_date
        ).order_by(TrustScore.created_at).all()
        
        if len(trust_scores) < 2:
            return {
                "trend": TrendDirection.STABLE.value,
                "confidence": 0.0,
                "message": "Insufficient historical data"
            }
        
        # Convert to time series
        dates = [ts.created_at for ts in trust_scores]
        scores = [ts.total_score for ts in trust_scores]
        
        # Calculate trend
        trend_analysis = self._calculate_trend(dates, scores)
        
        # Framework-specific analysis
        framework_trends = {}
        if trust_scores[0].framework_scores:
            for fw_name in trust_scores[0].framework_scores.keys():
                fw_scores = [
                    ts.framework_scores.get(fw_name, 0) 
                    for ts in trust_scores 
                    if ts.framework_scores
                ]
                if fw_scores:
                    framework_trends[fw_name] = self._calculate_trend(dates, fw_scores)
        
        return {
            "overall_trend": trend_analysis,
            "framework_trends": framework_trends,
            "data_points": len(trust_scores),
            "analysis_period_days": lookback_days
        }
    
    def _calculate_trend(self, dates: List[datetime], values: List[float]) -> Dict[str, Any]:
        """Calculate trend from time series data"""
        
        if len(values) < 2:
            return {"direction": TrendDirection.STABLE.value, "slope": 0.0, "confidence": 0.0}
        
        # Convert dates to numeric values (days from first date)
        first_date = dates[0]
        x_values = [(d - first_date).days for d in dates]
        
        # Linear regression for trend
        X = np.array(x_values).reshape(-1, 1)
        y = np.array(values)
        
        model = LinearRegression()
        model.fit(X, y)
        
        slope = model.coef_[0]
        r_squared = model.score(X, y)
        
        # Determine trend direction
        if abs(slope) < 0.1:  # Threshold for stable
            direction = TrendDirection.STABLE
        elif slope > 0:
            direction = TrendDirection.IMPROVING
        else:
            direction = TrendDirection.DECLINING
        
        # Calculate volatility
        predictions = model.predict(X)
        residuals = y - predictions
        volatility = np.std(residuals)
        
        if volatility > np.std(y) * 0.5:  # High volatility threshold
            direction = TrendDirection.VOLATILE
        
        return {
            "direction": direction.value,
            "slope": float(slope),
            "confidence": float(r_squared),
            "volatility": float(volatility),
            "current_value": float(values[-1]),
            "predicted_next": float(model.predict([[x_values[-1] + 1]])[0])
        }
    
    async def identify_evidence_gaps(
        self, 
        organization_id: str, 
        framework: Framework
    ) -> List[Dict[str, Any]]:
        """Identify gaps in evidence collection"""
        
        # Get all evidence for the framework
        evidence_items = self.db.query(EvidenceItem).filter(
            EvidenceItem.organization_id == organization_id,
            EvidenceItem.framework == framework
        ).all()
        
        # Group by control
        control_evidence = defaultdict(list)
        for evidence in evidence_items:
            control_evidence[evidence.control_id].append(evidence)
        
        # Analyze gaps
        gaps = []
        
        # Expected controls for framework (simplified mapping)
        expected_controls = self._get_expected_controls(framework)
        
        for control_id in expected_controls:
            evidence_list = control_evidence.get(control_id, [])
            
            gap_analysis = {
                "control_id": control_id,
                "framework": framework.value,
                "evidence_count": len(evidence_list),
                "last_collected": None,
                "gap_severity": "low",
                "recommendations": []
            }
            
            if not evidence_list:
                gap_analysis["gap_severity"] = "critical"
                gap_analysis["recommendations"].append("Collect initial evidence")
            else:
                # Check recency
                latest_evidence = max(evidence_list, key=lambda e: e.created_at)
                gap_analysis["last_collected"] = latest_evidence.created_at.isoformat()
                
                days_since = (datetime.now(timezone.utc) - latest_evidence.created_at).days
                
                if days_since > 90:  # 3 months
                    gap_analysis["gap_severity"] = "high"
                    gap_analysis["recommendations"].append("Update evidence - data is stale")
                elif days_since > 30:  # 1 month
                    gap_analysis["gap_severity"] = "medium"
                    gap_analysis["recommendations"].append("Consider refreshing evidence")
                
                # Check evidence quality
                avg_confidence = np.mean([e.confidence_score or 0.5 for e in evidence_list])
                if avg_confidence < 0.7:
                    gap_analysis["gap_severity"] = "high"
                    gap_analysis["recommendations"].append("Improve evidence quality")
            
            if gap_analysis["gap_severity"] != "low":
                gaps.append(gap_analysis)
        
        return sorted(gaps, key=lambda x: {"critical": 0, "high": 1, "medium": 2, "low": 3}[x["gap_severity"]])
    
    def _get_expected_controls(self, framework: Framework) -> List[str]:
        """Get expected controls for a framework"""
        
        # Simplified control mappings
        control_mappings = {
            Framework.SOC2: [
                "CC1.1", "CC1.2", "CC1.3", "CC1.4",
                "CC2.1", "CC2.2", "CC2.3",
                "CC3.1", "CC3.2", "CC3.3", "CC3.4",
                "CC4.1", "CC4.2",
                "CC5.1", "CC5.2", "CC5.3",
                "CC6.1", "CC6.2", "CC6.3", "CC6.4", "CC6.5", "CC6.6", "CC6.7", "CC6.8",
                "CC7.1", "CC7.2", "CC7.3", "CC7.4", "CC7.5",
                "CC8.1"
            ],
            Framework.ISO27001: [
                "A.5.1.1", "A.5.1.2", "A.6.1.1", "A.6.1.2", "A.6.1.3",
                "A.7.1.1", "A.7.1.2", "A.7.2.1", "A.7.2.2", "A.7.2.3",
                "A.8.1.1", "A.8.1.2", "A.8.1.3", "A.8.2.1", "A.8.2.2", "A.8.2.3",
                "A.9.1.1", "A.9.1.2", "A.9.2.1", "A.9.2.2", "A.9.2.3", "A.9.2.4", "A.9.2.5", "A.9.2.6",
                "A.10.1.1", "A.10.1.2", "A.10.1.3", "A.10.1.4"
            ]
        }
        
        return control_mappings.get(framework, [])
    
    async def get_feature_matrix(
        self, 
        organization_id: str, 
        feature_types: List[str] = None
    ) -> pd.DataFrame:
        """Get feature matrix for ML predictions"""
        
        cache_key = f"{organization_id}:{':'.join(feature_types or [])}"
        
        # Check cache
        if (cache_key in self.feature_cache and 
            cache_key in self.cache_expiry and 
            datetime.now(timezone.utc) < self.cache_expiry[cache_key]):
            return self.feature_cache[cache_key]
        
        # Build feature matrix
        features = []
        
        # Agent performance features
        agents = self.db.query(Agent).filter(
            Agent.organization_id == organization_id
        ).all()
        
        for agent in agents:
            feature_row = {
                "agent_id": str(agent.id),
                "agent_type": agent.platform.value,
                "framework": agent.framework.value,
                "success_rate": agent.success_rate or 0.0,
                "evidence_collected": agent.evidence_collected or 0,
                "avg_collection_time": agent.avg_collection_time or 0.0,
                "days_active": (datetime.now(timezone.utc) - agent.created_at).days,
                "status": agent.status.value
            }
            features.append(feature_row)
        
        # Evidence quality features
        evidence_items = self.db.query(EvidenceItem).filter(
            EvidenceItem.organization_id == organization_id
        ).all()
        
        evidence_metrics = {
            "total_evidence": len(evidence_items),
            "avg_confidence": np.mean([e.confidence_score or 0.5 for e in evidence_items]) if evidence_items else 0.0,
            "avg_trust_points": np.mean([e.trust_points or 0 for e in evidence_items]) if evidence_items else 0.0,
            "validated_percentage": len([e for e in evidence_items if e.status.value == "validated"]) / len(evidence_items) if evidence_items else 0.0
        }
        
        # Trust score history
        trust_scores = self.db.query(TrustScore).filter(
            TrustScore.organization_id == organization_id
        ).order_by(desc(TrustScore.created_at)).limit(10).all()
        
        trust_metrics = {
            "current_score": trust_scores[0].total_score if trust_scores else 0,
            "score_trend": self._calculate_score_trend(trust_scores),
            "score_volatility": np.std([ts.total_score for ts in trust_scores]) if len(trust_scores) > 1 else 0.0,
            "automation_rate": trust_scores[0].automation_rate if trust_scores else 0.0
        }
        
        # Combine all features
        combined_features = {
            **evidence_metrics,
            **trust_metrics,
            "organization_id": organization_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        df = pd.DataFrame([combined_features])
        
        # Cache results
        self.feature_cache[cache_key] = df
        self.cache_expiry[cache_key] = datetime.now(timezone.utc) + timedelta(hours=1)
        
        return df
    
    def _calculate_score_trend(self, trust_scores: List[TrustScore]) -> float:
        """Calculate score trend from trust score history"""
        if len(trust_scores) < 2:
            return 0.0
        
        scores = [ts.total_score for ts in reversed(trust_scores)]  # Oldest to newest
        
        # Simple trend calculation
        recent_avg = np.mean(scores[-3:]) if len(scores) >= 3 else scores[-1]
        older_avg = np.mean(scores[:3]) if len(scores) >= 3 else scores[0]
        
        return recent_avg - older_avg

class PredictiveModels:
    """Collection of predictive models for compliance analytics"""
    
    def __init__(self, ml_pipeline: MLPipeline):
        self.ml_pipeline = ml_pipeline
        self.models: Dict[str, Any] = {}
        self.model_metadata: Dict[str, Dict[str, Any]] = {}
        self.scaler = StandardScaler()
    
    async def train_compliance_score_predictor(
        self, 
        organization_id: str, 
        features_df: pd.DataFrame
    ) -> bool:
        """Train model to predict future compliance scores"""
        
        try:
            if len(features_df) < 10:  # Need minimum data
                logger.warning("Insufficient data for compliance score prediction")
                return False
            
            # Prepare features and target
            feature_columns = [
                "total_evidence", "avg_confidence", "avg_trust_points",
                "validated_percentage", "score_trend", "score_volatility",
                "automation_rate"
            ]
            
            X = features_df[feature_columns].fillna(0)
            y = features_df["current_score"].fillna(0)
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X_scaled, y, test_size=0.2, random_state=42
            )
            
            # Train model
            model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42
            )
            
            model.fit(X_train, y_train)
            
            # Evaluate
            y_pred = model.predict(X_test)
            mse = mean_squared_error(y_test, y_pred)
            mae = mean_absolute_error(y_test, y_pred)
            
            # Store model
            model_key = f"compliance_score_{organization_id}"
            self.models[model_key] = model
            self.model_metadata[model_key] = {
                "type": "compliance_score_predictor",
                "mse": float(mse),
                "mae": float(mae),
                "feature_columns": feature_columns,
                "trained_at": datetime.now(timezone.utc).isoformat(),
                "training_samples": len(X_train)
            }
            
            logger.info(
                "Compliance score predictor trained",
                organization_id=organization_id,
                mse=mse,
                mae=mae
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to train compliance score predictor: {e}")
            return False
    
    async def predict_compliance_score(
        self, 
        organization_id: str, 
        features_df: pd.DataFrame,
        days_ahead: int = 30
    ) -> Optional[Prediction]:
        """Predict future compliance score"""
        
        model_key = f"compliance_score_{organization_id}"
        
        if model_key not in self.models:
            logger.warning(f"No trained model found for organization {organization_id}")
            return None
        
        try:
            model = self.models[model_key]
            metadata = self.model_metadata[model_key]
            
            # Prepare features
            feature_columns = metadata["feature_columns"]
            X = features_df[feature_columns].fillna(0)
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            predicted_score = model.predict(X_scaled)[0]
            
            # Calculate confidence based on model accuracy
            confidence = 1.0 - (metadata["mae"] / 100.0)  # Convert MAE to confidence
            confidence = max(0.1, min(0.95, confidence))  # Clamp between 10% and 95%
            
            # Determine risk level
            risk_level = self._score_to_risk_level(predicted_score)
            
            # Generate recommendations
            recommendations = self._generate_score_recommendations(
                predicted_score, 
                features_df.iloc[0].to_dict()
            )
            
            prediction = Prediction(
                prediction_id=str(uuid.uuid4()),
                prediction_type=PredictionType.COMPLIANCE_SCORE,
                organization_id=organization_id,
                predicted_value=float(predicted_score),
                confidence_score=confidence,
                prediction_date=datetime.now(timezone.utc),
                valid_until=datetime.now(timezone.utc) + timedelta(days=days_ahead),
                features_used=feature_columns,
                model_version="1.0",
                historical_accuracy=1.0 - metadata["mae"] / 100.0,
                risk_level=risk_level,
                recommendations=recommendations
            )
            
            return prediction
            
        except Exception as e:
            logger.error(f"Failed to predict compliance score: {e}")
            return None
    
    async def detect_anomalies(
        self, 
        organization_id: str, 
        features_df: pd.DataFrame
    ) -> List[Dict[str, Any]]:
        """Detect anomalies in compliance data"""
        
        try:
            # Prepare features
            numeric_columns = features_df.select_dtypes(include=[np.number]).columns
            X = features_df[numeric_columns].fillna(0)
            
            if len(X.columns) == 0:
                return []
            
            # Train isolation forest
            iso_forest = IsolationForest(
                contamination=0.1,  # Expect 10% anomalies
                random_state=42
            )
            
            anomaly_labels = iso_forest.fit_predict(X)
            anomaly_scores = iso_forest.decision_function(X)
            
            # Identify anomalies
            anomalies = []
            for i, (is_anomaly, score) in enumerate(zip(anomaly_labels, anomaly_scores)):
                if is_anomaly == -1:  # Anomaly detected
                    anomaly_data = {
                        "index": i,
                        "anomaly_score": float(score),
                        "severity": "high" if score < -0.5 else "medium",
                        "features": X.iloc[i].to_dict(),
                        "detected_at": datetime.now(timezone.utc).isoformat()
                    }
                    anomalies.append(anomaly_data)
            
            # Sort by anomaly score (most anomalous first)
            anomalies.sort(key=lambda x: x["anomaly_score"])
            
            return anomalies
            
        except Exception as e:
            logger.error(f"Failed to detect anomalies: {e}")
            return []
    
    def _score_to_risk_level(self, score: float) -> RiskLevel:
        """Convert compliance score to risk level"""
        if score >= 90:
            return RiskLevel.VERY_LOW
        elif score >= 80:
            return RiskLevel.LOW
        elif score >= 70:
            return RiskLevel.MEDIUM
        elif score >= 60:
            return RiskLevel.HIGH
        else:
            return RiskLevel.CRITICAL
    
    def _generate_score_recommendations(
        self, 
        predicted_score: float, 
        features: Dict[str, Any]
    ) -> List[str]:
        """Generate recommendations based on predicted score"""
        
        recommendations = []
        
        if predicted_score < 70:
            recommendations.append("Critical attention required - compliance score trending low")
            
            if features.get("avg_confidence", 0) < 0.7:
                recommendations.append("Focus on improving evidence quality and confidence scores")
            
            if features.get("validated_percentage", 0) < 0.8:
                recommendations.append("Increase evidence validation rate")
            
            if features.get("automation_rate", 0) < 0.6:
                recommendations.append("Implement more automated compliance processes")
        
        elif predicted_score < 80:
            recommendations.append("Monitor closely - compliance score needs improvement")
            
            if features.get("total_evidence", 0) < 50:
                recommendations.append("Increase evidence collection frequency")
            
            if features.get("score_volatility", 0) > 10:
                recommendations.append("Work on stabilizing compliance processes")
        
        else:
            recommendations.append("Maintain current compliance practices")
            recommendations.append("Consider optimizing for efficiency gains")
        
        return recommendations

class ComplianceHealthAnalyzer:
    """Analyzes overall compliance health and generates insights"""
    
    def __init__(self, data_analyzer: ComplianceDataAnalyzer, predictive_models: PredictiveModels):
        self.data_analyzer = data_analyzer
        self.predictive_models = predictive_models
    
    async def generate_health_assessment(
        self, 
        organization_id: str
    ) -> ComplianceHealthMetrics:
        """Generate comprehensive compliance health assessment"""
        
        try:
            # Get base features
            features_df = await self.data_analyzer.get_feature_matrix(organization_id)
            
            if features_df.empty:
                # Return default metrics for new organizations
                return ComplianceHealthMetrics(
                    organization_id=organization_id,
                    assessment_date=datetime.now(timezone.utc),
                    overall_health_score=50.0,
                    compliance_maturity=30.0,
                    automation_efficiency=20.0
                )
            
            features = features_df.iloc[0].to_dict()
            
            # Calculate health metrics
            health_metrics = ComplianceHealthMetrics(
                organization_id=organization_id,
                assessment_date=datetime.now(timezone.utc),
                overall_health_score=self._calculate_health_score(features),
                compliance_maturity=self._calculate_maturity_score(features),
                automation_efficiency=self._calculate_automation_efficiency(features)
            )
            
            # Analyze trends
            trend_analysis = await self.data_analyzer.analyze_compliance_trends(organization_id)
            health_metrics.health_trend = TrendDirection(
                trend_analysis.get("overall_trend", {}).get("direction", "stable")
            )
            health_metrics.improvement_velocity = trend_analysis.get("overall_trend", {}).get("slope", 0.0)
            
            # Identify risk areas
            health_metrics.high_risk_areas = await self._identify_risk_areas(organization_id, features)
            
            # Detect emerging risks
            anomalies = await self.predictive_models.detect_anomalies(organization_id, features_df)
            health_metrics.emerging_risks = [
                {
                    "type": "anomaly_detected",
                    "severity": anomaly["severity"],
                    "description": f"Unusual pattern detected in compliance metrics",
                    "anomaly_score": anomaly["anomaly_score"]
                }
                for anomaly in anomalies[:3]  # Top 3 anomalies
            ]
            
            # Resource insights
            health_metrics.resource_utilization = features.get("automation_rate", 0.0)
            health_metrics.efficiency_gaps = self._identify_efficiency_gaps(features)
            
            # Predictive insights
            compliance_prediction = await self.predictive_models.predict_compliance_score(
                organization_id, features_df, days_ahead=90
            )
            
            if compliance_prediction:
                health_metrics.projected_scores = {
                    "90_day_projection": compliance_prediction.predicted_value
                }
                
                # Estimate timeline to reach target (e.g., 85)
                if compliance_prediction.predicted_value < 85:
                    current_score = features.get("current_score", 0)
                    improvement_rate = health_metrics.improvement_velocity
                    
                    if improvement_rate > 0:
                        days_to_target = (85 - current_score) / improvement_rate
                        health_metrics.timeline_to_target = max(1, int(days_to_target))
            
            return health_metrics
            
        except Exception as e:
            logger.error(f"Failed to generate health assessment: {e}")
            
            # Return default metrics on error
            return ComplianceHealthMetrics(
                organization_id=organization_id,
                assessment_date=datetime.now(timezone.utc),
                overall_health_score=0.0,
                compliance_maturity=0.0,
                automation_efficiency=0.0
            )
    
    def _calculate_health_score(self, features: Dict[str, Any]) -> float:
        """Calculate overall compliance health score"""
        
        # Weighted combination of factors
        current_score = features.get("current_score", 0) * 0.4
        evidence_quality = features.get("avg_confidence", 0) * 100 * 0.2
        validation_rate = features.get("validated_percentage", 0) * 100 * 0.2
        automation_rate = features.get("automation_rate", 0) * 100 * 0.1
        trend_bonus = max(0, features.get("score_trend", 0)) * 0.1
        
        health_score = current_score + evidence_quality + validation_rate + automation_rate + trend_bonus
        
        return min(100.0, max(0.0, health_score))
    
    def _calculate_maturity_score(self, features: Dict[str, Any]) -> float:
        """Calculate compliance program maturity score"""
        
        # Factors indicating maturity
        automation_factor = features.get("automation_rate", 0) * 30
        evidence_volume = min(100, features.get("total_evidence", 0)) * 0.3
        process_stability = max(0, 100 - features.get("score_volatility", 0) * 10) * 0.4
        
        maturity_score = automation_factor + evidence_volume + process_stability
        
        return min(100.0, max(0.0, maturity_score))
    
    def _calculate_automation_efficiency(self, features: Dict[str, Any]) -> float:
        """Calculate automation efficiency score"""
        
        automation_rate = features.get("automation_rate", 0) * 100
        
        # Adjust based on evidence collection efficiency
        if features.get("total_evidence", 0) > 0:
            evidence_per_day = features.get("total_evidence", 0) / max(1, features.get("days_active", 1))
            efficiency_bonus = min(20, evidence_per_day * 2)  # Bonus for high collection rate
            automation_rate += efficiency_bonus
        
        return min(100.0, max(0.0, automation_rate))
    
    async def _identify_risk_areas(self, organization_id: str, features: Dict[str, Any]) -> List[str]:
        """Identify high-risk areas requiring attention"""
        
        risk_areas = []
        
        if features.get("avg_confidence", 0) < 0.6:
            risk_areas.append("Evidence Quality - Low confidence scores")
        
        if features.get("validated_percentage", 0) < 0.7:
            risk_areas.append("Evidence Validation - High percentage of unvalidated evidence")
        
        if features.get("score_volatility", 0) > 15:
            risk_areas.append("Process Stability - High score volatility indicates unstable processes")
        
        if features.get("automation_rate", 0) < 0.4:
            risk_areas.append("Manual Processes - Low automation rate increases risk")
        
        if features.get("score_trend", 0) < -5:
            risk_areas.append("Declining Performance - Compliance scores trending downward")
        
        # Check for evidence gaps
        evidence_gaps = await self.data_analyzer.identify_evidence_gaps(
            organization_id, Framework.SOC2  # Default framework check
        )
        
        critical_gaps = [gap for gap in evidence_gaps if gap["gap_severity"] == "critical"]
        if critical_gaps:
            risk_areas.append(f"Evidence Gaps - {len(critical_gaps)} critical control gaps identified")
        
        return risk_areas
    
    def _identify_efficiency_gaps(self, features: Dict[str, Any]) -> List[str]:
        """Identify efficiency improvement opportunities"""
        
        gaps = []
        
        if features.get("automation_rate", 0) < 0.8:
            gaps.append("Automation Opportunity - Many processes still manual")
        
        if features.get("total_evidence", 0) > 0 and features.get("validated_percentage", 0) < 0.9:
            gaps.append("Validation Efficiency - Evidence validation process can be improved")
        
        if features.get("score_volatility", 0) > 10:
            gaps.append("Process Standardization - Inconsistent compliance processes")
        
        return gaps

class PredictiveAnalyticsEngine:
    """Main engine for predictive compliance analytics"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.data_analyzer = ComplianceDataAnalyzer(db_session)
        self.predictive_models = None  # Initialized in start()
        self.health_analyzer = None    # Initialized in start()
        
        # Cache for predictions
        self.prediction_cache: Dict[str, Prediction] = {}
        self.cache_expiry: Dict[str, datetime] = {}
        
        # Performance metrics
        self.metrics = {
            "predictions_generated": 0,
            "models_trained": 0,
            "accuracy_scores": [],
            "cache_hits": 0
        }
    
    async def start(self):
        """Start the predictive analytics engine"""
        
        # Initialize ML pipeline
        ml_pipeline = await get_ml_pipeline(self.db)
        
        self.predictive_models = PredictiveModels(ml_pipeline)
        self.health_analyzer = ComplianceHealthAnalyzer(self.data_analyzer, self.predictive_models)
        
        # Start background tasks
        asyncio.create_task(self._model_training_scheduler())
        
        logger.info("Predictive analytics engine started")
    
    async def generate_prediction(
        self,
        organization_id: str,
        prediction_type: PredictionType,
        context: Dict[str, Any] = None
    ) -> Optional[Prediction]:
        """Generate prediction of specified type"""
        
        # Check cache first
        cache_key = f"{organization_id}:{prediction_type.value}:{hash(str(context))}"
        
        if (cache_key in self.prediction_cache and
            cache_key in self.cache_expiry and
            datetime.now(timezone.utc) < self.cache_expiry[cache_key]):
            self.metrics["cache_hits"] += 1
            return self.prediction_cache[cache_key]
        
        try:
            prediction = None
            
            if prediction_type == PredictionType.COMPLIANCE_SCORE:
                features_df = await self.data_analyzer.get_feature_matrix(organization_id)
                prediction = await self.predictive_models.predict_compliance_score(
                    organization_id, features_df
                )
            
            elif prediction_type == PredictionType.EVIDENCE_GAP:
                framework = context.get("framework", Framework.SOC2)
                gaps = await self.data_analyzer.identify_evidence_gaps(organization_id, framework)
                
                if gaps:
                    prediction = Prediction(
                        prediction_id=str(uuid.uuid4()),
                        prediction_type=prediction_type,
                        organization_id=organization_id,
                        predicted_value=gaps,
                        confidence_score=0.9,  # High confidence in gap analysis
                        prediction_date=datetime.now(timezone.utc),
                        valid_until=datetime.now(timezone.utc) + timedelta(days=7),
                        framework=framework,
                        recommendations=[
                            f"Address {len([g for g in gaps if g['gap_severity'] == 'critical'])} critical gaps",
                            "Prioritize evidence collection for high-severity gaps"
                        ]
                    )
            
            elif prediction_type == PredictionType.AUDIT_READINESS:
                health_metrics = await self.health_analyzer.generate_health_assessment(organization_id)
                
                # Calculate audit readiness score
                readiness_score = (
                    health_metrics.overall_health_score * 0.4 +
                    health_metrics.compliance_maturity * 0.3 +
                    health_metrics.automation_efficiency * 0.3
                )
                
                prediction = Prediction(
                    prediction_id=str(uuid.uuid4()),
                    prediction_type=prediction_type,
                    organization_id=organization_id,
                    predicted_value=readiness_score,
                    confidence_score=0.85,
                    prediction_date=datetime.now(timezone.utc),
                    valid_until=datetime.now(timezone.utc) + timedelta(days=30),
                    risk_level=self.predictive_models._score_to_risk_level(readiness_score),
                    recommendations=self._generate_audit_readiness_recommendations(health_metrics)
                )
            
            if prediction:
                # Cache the prediction
                self.prediction_cache[cache_key] = prediction
                self.cache_expiry[cache_key] = prediction.valid_until
                
                self.metrics["predictions_generated"] += 1
                
                logger.info(
                    "Prediction generated",
                    organization_id=organization_id,
                    prediction_type=prediction_type.value,
                    confidence=prediction.confidence_score
                )
            
            return prediction
            
        except Exception as e:
            logger.error(f"Failed to generate prediction: {e}")
            return None
    
    async def get_compliance_health(self, organization_id: str) -> ComplianceHealthMetrics:
        """Get comprehensive compliance health assessment"""
        return await self.health_analyzer.generate_health_assessment(organization_id)
    
    async def _model_training_scheduler(self):
        """Background task to retrain models periodically"""
        
        while True:
            try:
                # Get all organizations
                organizations = self.db.query(Organization).all()
                
                for org in organizations:
                    # Check if model needs retraining (weekly)
                    org_id = str(org.id)
                    
                    # Get features for training
                    features_df = await self.data_analyzer.get_feature_matrix(org_id)
                    
                    if not features_df.empty and len(features_df) >= 10:
                        # Train compliance score predictor
                        success = await self.predictive_models.train_compliance_score_predictor(
                            org_id, features_df
                        )
                        
                        if success:
                            self.metrics["models_trained"] += 1
                
                # Sleep for 24 hours before next training cycle
                await asyncio.sleep(86400)
                
            except Exception as e:
                logger.error(f"Model training scheduler error: {e}")
                await asyncio.sleep(3600)  # Retry in 1 hour
    
    def _generate_audit_readiness_recommendations(
        self, 
        health_metrics: ComplianceHealthMetrics
    ) -> List[str]:
        """Generate audit readiness recommendations"""
        
        recommendations = []
        
        if health_metrics.overall_health_score < 80:
            recommendations.append("Improve overall compliance posture before audit")
            
            if health_metrics.compliance_maturity < 70:
                recommendations.append("Enhance compliance program maturity")
            
            if health_metrics.automation_efficiency < 60:
                recommendations.append("Increase automation to reduce audit burden")
        
        if health_metrics.high_risk_areas:
            recommendations.append(f"Address {len(health_metrics.high_risk_areas)} high-risk areas")
        
        if health_metrics.emerging_risks:
            recommendations.append("Monitor and mitigate emerging risk patterns")
        
        # Timeline-based recommendations
        if health_metrics.timeline_to_target and health_metrics.timeline_to_target > 180:
            recommendations.append("Consider delaying audit - significant improvement time needed")
        elif health_metrics.timeline_to_target and health_metrics.timeline_to_target < 30:
            recommendations.append("Well-positioned for audit - minor improvements needed")
        
        return recommendations
    
    def get_analytics_metrics(self) -> Dict[str, Any]:
        """Get analytics engine performance metrics"""
        
        avg_accuracy = np.mean(self.metrics["accuracy_scores"]) if self.metrics["accuracy_scores"] else 0.0
        
        return {
            "metrics": self.metrics,
            "average_model_accuracy": avg_accuracy,
            "cached_predictions": len(self.prediction_cache),
            "models_available": len(self.predictive_models.models) if self.predictive_models else 0
        }

# Global analytics engine instance
analytics_engine = None

async def get_analytics_engine(db: Session) -> PredictiveAnalyticsEngine:
    """Get or create analytics engine instance"""
    global analytics_engine
    if analytics_engine is None:
        analytics_engine = PredictiveAnalyticsEngine(db)
        await analytics_engine.start()
    return analytics_engine