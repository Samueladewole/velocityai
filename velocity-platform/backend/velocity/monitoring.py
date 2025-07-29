"""
Comprehensive Monitoring and Observability for Velocity AI Platform
Provides metrics collection, health checks, and observability features
"""

import os
import time
import psutil
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from dataclasses import dataclass, asdict
from collections import defaultdict, deque
import logging
import json

from fastapi import Request, Response
from prometheus_client import Counter, Histogram, Gauge, CollectorRegistry, generate_latest
import structlog

logger = structlog.get_logger()

# Metrics configuration
METRICS_ENABLED = os.getenv("METRICS_ENABLED", "true").lower() == "true"
METRICS_PREFIX = os.getenv("METRICS_PREFIX", "velocity_ai")

# Create custom registry to avoid conflicts
registry = CollectorRegistry()

# Application metrics
request_count = Counter(
    f'{METRICS_PREFIX}_http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status_code'],
    registry=registry
)

request_duration = Histogram(
    f'{METRICS_PREFIX}_http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint'],
    registry=registry
)

active_connections = Gauge(
    f'{METRICS_PREFIX}_active_connections',
    'Number of active connections',
    registry=registry
)

database_queries = Counter(
    f'{METRICS_PREFIX}_database_queries_total',
    'Total database queries',
    ['operation', 'table'],
    registry=registry
)

database_query_duration = Histogram(
    f'{METRICS_PREFIX}_database_query_duration_seconds',
    'Database query duration in seconds',
    ['operation', 'table'],
    registry=registry
)

agent_executions = Counter(
    f'{METRICS_PREFIX}_agent_executions_total',
    'Total agent executions',
    ['agent_type', 'status'],
    registry=registry
)

evidence_collected = Counter(
    f'{METRICS_PREFIX}_evidence_collected_total',
    'Total evidence items collected',
    ['framework', 'evidence_type'],
    registry=registry
)

trust_score_updates = Counter(
    f'{METRICS_PREFIX}_trust_score_updates_total',
    'Total trust score updates',
    ['organization_id'],
    registry=registry
)

# System metrics
cpu_usage = Gauge(
    f'{METRICS_PREFIX}_cpu_usage_percent',
    'CPU usage percentage',
    registry=registry
)

memory_usage = Gauge(
    f'{METRICS_PREFIX}_memory_usage_bytes',
    'Memory usage in bytes',
    registry=registry
)

disk_usage = Gauge(
    f'{METRICS_PREFIX}_disk_usage_percent',
    'Disk usage percentage',
    registry=registry
)

@dataclass
class HealthCheck:
    """Health check result"""
    service: str
    status: str  # healthy, unhealthy, degraded
    timestamp: datetime
    response_time_ms: float
    details: Dict[str, Any] = None
    error: Optional[str] = None

@dataclass
class SystemMetrics:
    """System resource metrics"""
    cpu_percent: float
    memory_used_bytes: int
    memory_total_bytes: int
    memory_percent: float
    disk_used_bytes: int
    disk_total_bytes: int
    disk_percent: float
    load_average: List[float]
    uptime_seconds: float
    timestamp: datetime

class MetricsCollector:
    """Collects and manages application metrics"""
    
    def __init__(self):
        self.start_time = time.time()
        self.request_times = defaultdict(lambda: deque(maxlen=1000))  # Keep last 1000 requests per endpoint
        self.error_counts = defaultdict(int)
        self.health_checks: Dict[str, HealthCheck] = {}
    
    def record_request(self, method: str, endpoint: str, status_code: int, duration: float):
        """Record HTTP request metrics"""
        if METRICS_ENABLED:
            request_count.labels(method=method, endpoint=endpoint, status_code=status_code).inc()
            request_duration.labels(method=method, endpoint=endpoint).observe(duration)
        
        # Store in memory for analysis
        key = f"{method}:{endpoint}"
        self.request_times[key].append({
            'timestamp': time.time(),
            'duration': duration,
            'status_code': status_code
        })
        
        if status_code >= 400:
            self.error_counts[key] += 1
    
    def record_database_query(self, operation: str, table: str, duration: float):
        """Record database query metrics"""
        if METRICS_ENABLED:
            database_queries.labels(operation=operation, table=table).inc()
            database_query_duration.labels(operation=operation, table=table).observe(duration)
    
    def record_agent_execution(self, agent_type: str, status: str):
        """Record agent execution metrics"""
        if METRICS_ENABLED:
            agent_executions.labels(agent_type=agent_type, status=status).inc()
    
    def record_evidence_collection(self, framework: str, evidence_type: str):
        """Record evidence collection metrics"""
        if METRICS_ENABLED:
            evidence_collected.labels(framework=framework, evidence_type=evidence_type).inc()
    
    def record_trust_score_update(self, organization_id: str):
        """Record trust score update"""
        if METRICS_ENABLED:
            trust_score_updates.labels(organization_id=organization_id).inc()
    
    def get_endpoint_stats(self, endpoint: str) -> Dict[str, Any]:
        """Get statistics for a specific endpoint"""
        key = f"GET:{endpoint}"  # Assuming GET, could be parameterized
        requests = list(self.request_times[key])
        
        if not requests:
            return {"total_requests": 0}
        
        durations = [r['duration'] for r in requests]
        status_codes = [r['status_code'] for r in requests]
        
        return {
            "total_requests": len(requests),
            "avg_response_time": sum(durations) / len(durations),
            "min_response_time": min(durations),
            "max_response_time": max(durations),
            "error_rate": sum(1 for s in status_codes if s >= 400) / len(status_codes),
            "requests_per_minute": len([r for r in requests if time.time() - r['timestamp'] < 60])
        }
    
    def get_system_metrics(self) -> SystemMetrics:
        """Get current system metrics"""
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        metrics = SystemMetrics(
            cpu_percent=psutil.cpu_percent(interval=1),
            memory_used_bytes=memory.used,
            memory_total_bytes=memory.total,
            memory_percent=memory.percent,
            disk_used_bytes=disk.used,
            disk_total_bytes=disk.total,
            disk_percent=disk.percent,
            load_average=list(psutil.getloadavg()) if hasattr(psutil, 'getloadavg') else [0.0, 0.0, 0.0],
            uptime_seconds=time.time() - self.start_time,
            timestamp=datetime.now(timezone.utc)
        )
        
        # Update Prometheus metrics
        if METRICS_ENABLED:
            cpu_usage.set(metrics.cpu_percent)
            memory_usage.set(metrics.memory_used_bytes)
            disk_usage.set(metrics.disk_percent)
        
        return metrics
    
    def add_health_check(self, service: str, status: str, response_time_ms: float, 
                        details: Dict[str, Any] = None, error: str = None):
        """Add health check result"""
        self.health_checks[service] = HealthCheck(
            service=service,
            status=status,
            timestamp=datetime.now(timezone.utc),
            response_time_ms=response_time_ms,
            details=details,
            error=error
        )
    
    def get_health_status(self) -> Dict[str, Any]:
        """Get overall health status"""
        if not self.health_checks:
            return {"status": "unknown", "services": {}}
        
        services = {}
        overall_healthy = True
        
        for service, check in self.health_checks.items():
            services[service] = asdict(check)
            services[service]['timestamp'] = check.timestamp.isoformat()
            
            if check.status != "healthy":
                overall_healthy = False
        
        return {
            "status": "healthy" if overall_healthy else "unhealthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "services": services,
            "uptime_seconds": time.time() - self.start_time
        }

# Global metrics collector
metrics_collector = MetricsCollector()

class HealthCheckService:
    """Service for performing health checks"""
    
    @staticmethod
    async def check_database():
        """Check database health"""
        start_time = time.time()
        try:
            from database import health_check
            result = health_check()
            
            response_time = (time.time() - start_time) * 1000
            status = "healthy" if result["status"] == "healthy" else "unhealthy"
            
            metrics_collector.add_health_check(
                service="database",
                status=status,
                response_time_ms=response_time,
                details=result
            )
            
            return result
            
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            metrics_collector.add_health_check(
                service="database",
                status="unhealthy",
                response_time_ms=response_time,
                error=str(e)
            )
            return {"status": "unhealthy", "error": str(e)}
    
    @staticmethod
    async def check_redis():
        """Check Redis health"""
        start_time = time.time()
        try:
            import redis
            r = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
            r.ping()
            
            response_time = (time.time() - start_time) * 1000
            metrics_collector.add_health_check(
                service="redis",
                status="healthy",
                response_time_ms=response_time
            )
            
            return {"status": "healthy"}
            
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            metrics_collector.add_health_check(
                service="redis",
                status="unhealthy",
                response_time_ms=response_time,
                error=str(e)
            )
            return {"status": "unhealthy", "error": str(e)}
    
    @staticmethod
    async def check_external_services():
        """Check external service dependencies"""
        results = {}
        
        # Check if we can reach common cloud provider APIs
        import httpx
        services = [
            ("aws", "https://ec2.amazonaws.com"),
            ("gcp", "https://www.googleapis.com"),
            ("azure", "https://management.azure.com")
        ]
        
        for service_name, url in services:
            start_time = time.time()
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    response = await client.get(url)
                
                response_time = (time.time() - start_time) * 1000
                status = "healthy" if response.status_code < 500 else "degraded"
                
                metrics_collector.add_health_check(
                    service=f"external_{service_name}",
                    status=status,
                    response_time_ms=response_time,
                    details={"status_code": response.status_code}
                )
                
                results[service_name] = {"status": status, "status_code": response.status_code}
                
            except Exception as e:
                response_time = (time.time() - start_time) * 1000
                metrics_collector.add_health_check(
                    service=f"external_{service_name}",
                    status="unhealthy",
                    response_time_ms=response_time,
                    error=str(e)
                )
                results[service_name] = {"status": "unhealthy", "error": str(e)}
        
        return results

# Monitoring middleware
class MonitoringMiddleware:
    """Middleware for collecting request metrics and monitoring"""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        
        start_time = time.time()
        
        # Extract request info
        method = scope["method"]
        path = scope["path"]
        
        # Process request
        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                # Record metrics when response starts
                duration = time.time() - start_time
                status_code = message["status"]
                
                metrics_collector.record_request(method, path, status_code, duration)
                
                # Add custom headers
                headers = list(message.get("headers", []))
                headers.append((b"X-Response-Time", f"{duration:.4f}".encode()))
                message["headers"] = headers
            
            await send(message)
        
        await self.app(scope, receive, send_wrapper)

# Alerting system
class AlertManager:
    """Simple alerting system for critical issues"""
    
    def __init__(self):
        self.alert_thresholds = {
            "error_rate": 0.05,  # 5% error rate
            "response_time": 2.0,  # 2 seconds
            "cpu_usage": 80.0,    # 80% CPU
            "memory_usage": 85.0,  # 85% memory
            "disk_usage": 90.0     # 90% disk
        }
        self.alerts_sent = set()
    
    def check_alerts(self):
        """Check for alert conditions"""
        alerts = []
        
        # Check system metrics
        system_metrics = metrics_collector.get_system_metrics()
        
        if system_metrics.cpu_percent > self.alert_thresholds["cpu_usage"]:
            alert = f"High CPU usage: {system_metrics.cpu_percent:.1f}%"
            if alert not in self.alerts_sent:
                alerts.append(alert)
                self.alerts_sent.add(alert)
        
        if system_metrics.memory_percent > self.alert_thresholds["memory_usage"]:
            alert = f"High memory usage: {system_metrics.memory_percent:.1f}%"
            if alert not in self.alerts_sent:
                alerts.append(alert)
                self.alerts_sent.add(alert)
        
        if system_metrics.disk_percent > self.alert_thresholds["disk_usage"]:
            alert = f"High disk usage: {system_metrics.disk_percent:.1f}%"
            if alert not in self.alerts_sent:
                alerts.append(alert)
                self.alerts_sent.add(alert)
        
        # Check health status
        health_status = metrics_collector.get_health_status()
        if health_status["status"] != "healthy":
            alert = f"Service unhealthy: {health_status['status']}"
            if alert not in self.alerts_sent:
                alerts.append(alert)
                self.alerts_sent.add(alert)
        
        # Log alerts
        for alert in alerts:
            logger.critical("alert_triggered", alert=alert)
        
        return alerts

# Global instances
health_check_service = HealthCheckService()
alert_manager = AlertManager()

def get_prometheus_metrics() -> str:
    """Get Prometheus metrics"""
    if not METRICS_ENABLED:
        return "# Metrics disabled\n"
    
    return generate_latest(registry).decode('utf-8')

def get_application_info() -> Dict[str, Any]:
    """Get application information"""
    return {
        "name": "Velocity AI Platform",
        "version": "1.0.0",
        "description": "AI-Powered Compliance Automation",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "python_version": f"{psutil.sys.version_info.major}.{psutil.sys.version_info.minor}.{psutil.sys.version_info.micro}",
        "process_id": os.getpid(),
        "started_at": datetime.fromtimestamp(metrics_collector.start_time, timezone.utc).isoformat(),
        "uptime_seconds": time.time() - metrics_collector.start_time
    }