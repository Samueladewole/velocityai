"""
PULSE Analytics Service
Predictive analytics and trend analysis
"""

from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from typing import List, Dict
from datetime import datetime, timedelta
from scipy import stats

router = APIRouter()

class TrendAnalysisRequest(BaseModel):
    """Trend analysis request"""
    metric_name: str
    time_series_data: List[float]
    timestamps: List[datetime]
    forecast_days: int = 30

class TrendAnalysisResult(BaseModel):
    """Trend analysis results"""
    trend_direction: str
    slope: float
    confidence: float
    forecast: List[Dict]
    anomalies_detected: List[Dict]
    recommendations: List[str]

@router.post("/trend-analysis", response_model=TrendAnalysisResult)
async def analyze_trend(request: TrendAnalysisRequest):
    """
    Analyze trends and predict future values using statistical methods
    """
    
    try:
        # Convert to numpy arrays for processing
        values = np.array(request.time_series_data)
        timestamps = request.timestamps
        
        # Simple linear regression for trend
        x = np.arange(len(values))
        slope, intercept, r_value, p_value, std_err = stats.linregress(x, values)
        
        # Determine trend direction
        if abs(slope) < 0.01:
            trend_direction = "STABLE"
        elif slope > 0:
            trend_direction = "INCREASING"
        else:
            trend_direction = "DECREASING"
        
        # Generate forecast
        forecast = []
        last_x = len(values) - 1
        
        for i in range(1, request.forecast_days + 1):
            forecast_value = slope * (last_x + i) + intercept
            forecast_date = timestamps[-1] + timedelta(days=i)
            
            forecast.append({
                "date": forecast_date,
                "predicted_value": float(forecast_value),
                "confidence_interval": {
                    "lower": float(forecast_value - 2 * std_err),
                    "upper": float(forecast_value + 2 * std_err)
                }
            })
        
        # Detect anomalies using z-score
        z_scores = np.abs(stats.zscore(values))
        anomalies = []
        
        for i, z_score in enumerate(z_scores):
            if z_score > 2:  # 2 standard deviations
                anomalies.append({
                    "timestamp": timestamps[i],
                    "value": float(values[i]),
                    "z_score": float(z_score),
                    "severity": "HIGH" if z_score > 3 else "MEDIUM"
                })
        
        # Generate recommendations
        recommendations = []
        if trend_direction == "INCREASING" and request.metric_name.lower() in ["risk", "vulnerability", "threat"]:
            recommendations.append("Consider implementing additional controls")
        elif trend_direction == "DECREASING" and request.metric_name.lower() in ["compliance", "security"]:
            recommendations.append("Investigate potential degradation causes")
        
        if len(anomalies) > 0:
            recommendations.append(f"Investigate {len(anomalies)} anomalous data points")
        
        confidence = abs(r_value)  # Correlation coefficient as confidence measure
        
        return TrendAnalysisResult(
            trend_direction=trend_direction,
            slope=float(slope),
            confidence=float(confidence),
            forecast=forecast,
            anomalies_detected=anomalies,
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trend analysis failed: {str(e)}")

@router.get("/predictive-alerts")
async def get_predictive_alerts():
    """
    Generate predictive alerts based on trend analysis
    """
    
    # Mock predictive alerts - in production would analyze actual trends
    alerts = [
        {
            "alert_id": "PRED_001",
            "type": "TREND_ALERT",
            "metric": "Compliance Score",
            "prediction": "Likely to fall below 95% threshold in 14 days",
            "confidence": 0.85,
            "recommended_action": "Review upcoming compliance requirements",
            "urgency": "MEDIUM"
        },
        {
            "alert_id": "PRED_002", 
            "type": "ANOMALY_ALERT",
            "metric": "Security Incidents",
            "prediction": "Unusual spike detected - 40% above normal",
            "confidence": 0.92,
            "recommended_action": "Investigate potential security breach",
            "urgency": "HIGH"
        }
    ]
    
    return {"predictive_alerts": alerts, "generated_at": datetime.utcnow()}