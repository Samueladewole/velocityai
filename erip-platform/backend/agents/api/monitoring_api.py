"""
FastAPI endpoints for performance monitoring and alerting.
Provides API for accessing metrics, alerts, and system health data.
"""

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from datetime import datetime
import structlog
from ..core.monitoring_service import monitoring_service, AlertSeverity
from ..api.security_middleware import get_current_customer, require_permission

logger = structlog.get_logger()

app = FastAPI(title="ERIP Monitoring API", version="1.0.0")


# Pydantic models
class MetricsQuery(BaseModel):
    customer_id: Optional[str] = Field(None, description="Customer ID filter")
    metric_names: List[str] = Field(default=[], description="Specific metrics to retrieve")
    hours: int = Field(default=24, description="Time period in hours")


class AlertQuery(BaseModel):
    customer_id: Optional[str] = Field(None, description="Customer ID filter")
    severity: Optional[AlertSeverity] = Field(None, description="Alert severity filter")
    active_only: bool = Field(default=True, description="Only return active alerts")


class HealthCheckResponse(BaseModel):
    status: str
    timestamp: str
    components: Dict[str, Dict[str, Any]]
    overall_health_score: float


# Endpoints
@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Get comprehensive system health status"""
    
    try:
        # Collect current system metrics
        system_metrics = await monitoring_service.collect_system_metrics()
        app_metrics = await monitoring_service.collect_application_metrics()
        
        # Calculate health scores
        cpu_metric = next((m for m in system_metrics if m.metric_name == "system.cpu_percent"), None)
        memory_metric = next((m for m in system_metrics if m.metric_name == "system.memory_percent"), None)
        disk_metric = next((m for m in system_metrics if m.metric_name == "system.disk_percent"), None)
        
        components = {
            "system": {
                "status": "healthy",
                "cpu_percent": cpu_metric.value if cpu_metric else 0,
                "memory_percent": memory_metric.value if memory_metric else 0,
                "disk_percent": disk_metric.value if disk_metric else 0,
                "health_score": 100 - max(
                    cpu_metric.value if cpu_metric else 0,
                    memory_metric.value if memory_metric else 0,
                    disk_metric.value if disk_metric else 0
                )
            },
            "redis": {
                "status": "healthy",
                "connected": True,
                "health_score": 100
            },
            "agents": {
                "status": "healthy",
                "active_count": 15,  # Mock data
                "error_rate": 1.2,
                "health_score": 95
            }
        }
        
        # Calculate overall health score
        overall_score = sum(comp["health_score"] for comp in components.values()) / len(components)
        
        # Determine overall status
        if overall_score >= 90:
            status = "healthy"
        elif overall_score >= 70:
            status = "degraded"
        else:
            status = "unhealthy"
        
        return HealthCheckResponse(
            status=status,
            timestamp=datetime.utcnow().isoformat(),
            components=components,
            overall_health_score=round(overall_score, 1)
        )
        
    except Exception as e:
        logger.error("health_check_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metrics/summary", response_model=Dict[str, Any])
async def get_metrics_summary(
    hours: int = Query(24, description="Time period in hours"),
    customer_id: Optional[str] = Query(None, description="Customer ID filter"),
    current_user: Dict = Depends(require_permission('billing:view'))
):
    """Get metrics summary for specified time period"""
    
    try:
        # Validate customer access
        if customer_id and customer_id != current_user.get('customer_id'):
            raise HTTPException(status_code=403, detail="Access denied")
        
        summary = await monitoring_service.get_metrics_summary(
            customer_id=customer_id or current_user.get('customer_id'),
            hours=hours
        )
        
        return summary
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("metrics_summary_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metrics/current", response_model=Dict[str, Any])
async def get_current_metrics(
    current_user: Dict = Depends(require_permission('billing:view'))
):
    """Get current real-time metrics"""
    
    try:
        # Collect current metrics
        system_metrics = await monitoring_service.collect_system_metrics()
        app_metrics = await monitoring_service.collect_application_metrics()
        business_metrics = await monitoring_service.collect_business_metrics(
            current_user.get('customer_id')
        )
        
        # Format response
        response = {
            "timestamp": datetime.utcnow().isoformat(),
            "system": {
                metric.metric_name: {
                    "value": metric.value,
                    "unit": metric.unit
                }
                for metric in system_metrics
            },
            "application": {
                metric.metric_name: {
                    "value": metric.value,
                    "unit": metric.unit
                }
                for metric in app_metrics
            },
            "business": {
                metric.metric_name: {
                    "value": metric.value,
                    "unit": metric.unit
                }
                for metric in business_metrics
            }
        }
        
        return response
        
    except Exception as e:
        logger.error("current_metrics_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/alerts", response_model=Dict[str, Any])
async def get_alerts(
    severity: Optional[str] = Query(None, description="Alert severity filter"),
    active_only: bool = Query(True, description="Only return active alerts"),
    limit: int = Query(100, description="Maximum number of alerts to return"),
    current_user: Dict = Depends(require_permission('billing:view'))
):
    """Get alerts for customer"""
    
    try:
        customer_id = current_user.get('customer_id')
        
        # Mock alert data - replace with actual Redis queries
        alerts = [
            {
                "alert_id": "cpu_high:demo_customer",
                "severity": "high",
                "title": "High CPU Usage",
                "description": "CPU usage 85.2% > 80.0%",
                "metric_name": "system.cpu_percent",
                "current_value": 85.2,
                "threshold_value": 80.0,
                "customer_id": customer_id,
                "created_at": "2024-01-15T10:30:00Z",
                "resolved_at": None,
                "status": "active"
            },
            {
                "alert_id": "memory_high:demo_customer",
                "severity": "high",
                "title": "High Memory Usage",
                "description": "Memory usage 88.7% > 85.0%",
                "metric_name": "system.memory_percent", 
                "current_value": 88.7,
                "threshold_value": 85.0,
                "customer_id": customer_id,
                "created_at": "2024-01-15T09:45:00Z",
                "resolved_at": "2024-01-15T10:15:00Z",
                "status": "resolved"
            }
        ]
        
        # Apply filters
        if active_only:
            alerts = [a for a in alerts if a['resolved_at'] is None]
        
        if severity:
            alerts = [a for a in alerts if a['severity'] == severity.lower()]
        
        # Limit results
        alerts = alerts[:limit]
        
        return {
            "alerts": alerts,
            "total_count": len(alerts),
            "active_count": len([a for a in alerts if a['resolved_at'] is None]),
            "by_severity": {
                sev: len([a for a in alerts if a['severity'] == sev])
                for sev in ['low', 'medium', 'high', 'critical']
            }
        }
        
    except Exception as e:
        logger.error("alerts_fetch_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/performance/dashboard", response_model=Dict[str, Any])
async def get_performance_dashboard(
    current_user: Dict = Depends(require_permission('billing:view'))
):
    """Get comprehensive performance dashboard data"""
    
    try:
        customer_id = current_user.get('customer_id')
        
        # Get metrics summary
        metrics_summary = await monitoring_service.get_metrics_summary(
            customer_id=customer_id,
            hours=24
        )
        
        # Get current system health
        system_metrics = await monitoring_service.collect_system_metrics()
        
        # Performance trends (mock data)
        performance_trends = {
            "evidence_processing": {
                "hourly_rates": [45, 52, 48, 61, 55, 49, 53, 58, 62, 59, 54, 57],
                "avg_processing_time": 23.4,
                "trend": "stable"
            },
            "trust_score_impact": {
                "daily_improvements": [2.1, 3.4, 1.8, 4.2, 2.9, 3.1, 2.7],
                "total_points_added": 847,
                "trend": "improving"
            },
            "automation_efficiency": {
                "daily_rates": [94.2, 95.1, 94.8, 95.7, 95.3, 95.9, 95.1],
                "avg_rate": 95.2,
                "trend": "stable"
            }
        }
        
        # Resource utilization
        resource_utilization = {
            "cpu": {
                "current": next((m.value for m in system_metrics if m.metric_name == "system.cpu_percent"), 0),
                "avg_24h": 45.2,
                "peak_24h": 78.3
            },
            "memory": {
                "current": next((m.value for m in system_metrics if m.metric_name == "system.memory_percent"), 0),
                "avg_24h": 62.1,
                "peak_24h": 84.7
            },
            "storage": {
                "current": next((m.value for m in system_metrics if m.metric_name == "system.disk_percent"), 0),
                "avg_24h": 35.8,
                "peak_24h": 38.2
            }
        }
        
        # Active operations
        active_operations = {
            "agents_running": 15,
            "evidence_in_queue": 23,
            "validations_pending": 7,
            "uploads_in_progress": 12
        }
        
        return {
            "customer_id": customer_id,
            "dashboard_updated": datetime.utcnow().isoformat(),
            "metrics_summary": metrics_summary,
            "performance_trends": performance_trends,
            "resource_utilization": resource_utilization,
            "active_operations": active_operations,
            "recommendations": [
                "Consider upgrading CPU allocation during peak hours",
                "Evidence processing efficiency is optimal",
                "Trust Score improvements are above target"
            ]
        }
        
    except Exception as e:
        logger.error("performance_dashboard_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metrics/agent/{agent_id}", response_model=Dict[str, Any])
async def get_agent_metrics(
    agent_id: str,
    hours: int = Query(24, description="Time period in hours"),
    current_user: Dict = Depends(require_permission('agents:manage'))
):
    """Get metrics for specific agent"""
    
    try:
        customer_id = current_user.get('customer_id')
        
        # Mock agent metrics - replace with actual data
        agent_metrics = {
            "agent_id": agent_id,
            "customer_id": customer_id,
            "period_hours": hours,
            "status": "active",
            "performance": {
                "evidence_collected": 127,
                "success_rate": 97.6,
                "avg_processing_time": 18.3,
                "total_runtime_hours": 23.5
            },
            "errors": {
                "total_count": 3,
                "by_type": {
                    "timeout": 1,
                    "validation_failed": 1,
                    "network_error": 1
                },
                "error_rate": 2.4
            },
            "resource_usage": {
                "avg_cpu_percent": 25.3,
                "avg_memory_mb": 156.7,
                "network_bytes": 1247583
            },
            "automation_metrics": {
                "frameworks_covered": ["SOC2", "ISO27001"],
                "controls_automated": 23,
                "trust_points_generated": 347
            }
        }
        
        return agent_metrics
        
    except Exception as e:
        logger.error("agent_metrics_failed", agent_id=agent_id, error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/alerts/resolve/{alert_id}", response_model=Dict[str, Any])
async def resolve_alert(
    alert_id: str,
    current_user: Dict = Depends(require_permission('agents:manage'))
):
    """Manually resolve an active alert"""
    
    try:
        customer_id = current_user.get('customer_id')
        
        # Validate alert belongs to customer
        if not alert_id.endswith(f":{customer_id}"):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Mock resolution - replace with actual alert management
        resolved_at = datetime.utcnow()
        
        logger.info(
            "alert_manually_resolved",
            alert_id=alert_id,
            customer_id=customer_id,
            resolved_by=current_user.get('user_id')
        )
        
        return {
            "success": True,
            "alert_id": alert_id,
            "resolved_at": resolved_at.isoformat(),
            "resolved_by": current_user.get('user_id')
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("alert_resolution_failed", alert_id=alert_id, error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/monitoring/status", response_model=Dict[str, Any])
async def get_monitoring_status():
    """Get monitoring service status and configuration"""
    
    try:
        status = {
            "monitoring_active": True,
            "collection_interval_seconds": monitoring_service.collection_interval_seconds,
            "metrics_retention_days": monitoring_service.metrics_retention_days,
            "alert_retention_days": monitoring_service.alert_retention_days,
            "alert_rules_count": len(monitoring_service.default_alert_rules),
            "active_alerts_count": len(monitoring_service.active_alerts),
            "last_collection": datetime.utcnow().isoformat(),
            "health": "operational"
        }
        
        return status
        
    except Exception as e:
        logger.error("monitoring_status_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


# Add CORS middleware
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://erip.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007)