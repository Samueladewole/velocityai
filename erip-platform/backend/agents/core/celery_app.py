from celery import Celery, Task
from kombu import Queue, Exchange
import redis
import structlog
from typing import Any, Dict
import time
from prometheus_client import Counter, Histogram, Gauge
import os

logger = structlog.get_logger()

# Metrics
task_counter = Counter(
    'erip_agent_tasks_total', 
    'Total agent tasks', 
    ['task_type', 'status']
)
task_duration = Histogram(
    'erip_agent_task_duration_seconds', 
    'Task duration', 
    ['task_type']
)
active_tasks = Gauge(
    'erip_agent_active_tasks', 
    'Currently active tasks', 
    ['task_type']
)
queue_depth = Gauge(
    'erip_agent_queue_depth', 
    'Queue depth by priority', 
    ['priority']
)

# Configure Celery
app = Celery('erip_agents')

app.conf.update(
    broker_url=os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
    result_backend=os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=600,  # 10 minutes
    task_soft_time_limit=540,  # 9 minutes
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=100,
    task_reject_on_worker_lost=True,
    task_routes={
        'agents.tasks.browser.*': {'queue': 'browser'},
        'agents.tasks.api.*': {'queue': 'api'},
        'agents.tasks.monitoring.*': {'queue': 'monitoring'},
        'agents.tasks.evidence.*': {'queue': 'evidence'},
    },
    task_default_queue='default',
    task_queues=(
        Queue('critical', Exchange('critical'), routing_key='critical', priority=10),
        Queue('high', Exchange('high'), routing_key='high', priority=7),
        Queue('default', Exchange('default'), routing_key='default', priority=5),
        Queue('low', Exchange('low'), routing_key='low', priority=1),
        Queue('browser', Exchange('browser'), routing_key='browser'),
        Queue('api', Exchange('api'), routing_key='api'),
        Queue('monitoring', Exchange('monitoring'), routing_key='monitoring'),
        Queue('evidence', Exchange('evidence'), routing_key='evidence'),
    ),
)

class BaseTask(Task):
    """Base task with automatic retries and monitoring"""
    
    autoretry_for = (Exception,)
    retry_kwargs = {'max_retries': 3}
    retry_backoff = True
    retry_backoff_max = 300
    retry_jitter = True
    
    def __init__(self):
        super().__init__()
        self.redis_client = redis.Redis.from_url(
            os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
            decode_responses=True
        )
    
    def before_start(self, task_id, args, kwargs):
        """Called before task execution"""
        customer_id = kwargs.get('customer_id', 'unknown')
        self.redis_client.setex(
            f"task:{task_id}:status",
            3600,
            "running"
        )
        active_tasks.labels(task_type=self.name).inc()
        logger.info(
            "task_started",
            task_id=task_id,
            task_name=self.name,
            customer_id=customer_id
        )
    
    def on_success(self, retval, task_id, args, kwargs):
        """Called on successful completion"""
        customer_id = kwargs.get('customer_id', 'unknown')
        self.redis_client.setex(
            f"task:{task_id}:status",
            3600,
            "completed"
        )
        task_counter.labels(task_type=self.name, status='success').inc()
        active_tasks.labels(task_type=self.name).dec()
        logger.info(
            "task_completed",
            task_id=task_id,
            task_name=self.name,
            customer_id=customer_id
        )
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """Called on task failure"""
        customer_id = kwargs.get('customer_id', 'unknown')
        self.redis_client.setex(
            f"task:{task_id}:status",
            3600,
            "failed"
        )
        self.redis_client.setex(
            f"task:{task_id}:error",
            3600,
            str(exc)
        )
        task_counter.labels(task_type=self.name, status='failure').inc()
        active_tasks.labels(task_type=self.name).dec()
        logger.error(
            "task_failed",
            task_id=task_id,
            task_name=self.name,
            customer_id=customer_id,
            error=str(exc)
        )

app.Task = BaseTask

# Circuit breaker implementation
class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=60):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'closed'  # closed, open, half-open
    
    def call(self, func, *args, **kwargs):
        if self.state == 'open':
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = 'half-open'
            else:
                raise Exception("Circuit breaker is open")
        
        try:
            result = func(*args, **kwargs)
            if self.state == 'half-open':
                self.state = 'closed'
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            
            if self.failure_count >= self.failure_threshold:
                self.state = 'open'
                logger.warning(
                    "circuit_breaker_opened",
                    function=func.__name__,
                    failures=self.failure_count
                )
            raise e

# Rate limiter
class RateLimiter:
    def __init__(self, redis_client, max_requests=100, window=60):
        self.redis = redis_client
        self.max_requests = max_requests
        self.window = window
    
    def is_allowed(self, key: str) -> bool:
        pipe = self.redis.pipeline()
        now = time.time()
        window_start = now - self.window
        
        # Remove old entries
        pipe.zremrangebyscore(key, 0, window_start)
        # Add current request
        pipe.zadd(key, {str(now): now})
        # Count requests in window
        pipe.zcount(key, window_start, now)
        # Set expiry
        pipe.expire(key, self.window + 1)
        
        results = pipe.execute()
        request_count = results[2]
        
        return request_count <= self.max_requests

# Task priority manager
class TaskPriorityManager:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    def get_priority(self, customer_id: str, task_type: str) -> str:
        # Check customer tier
        tier = self.redis.get(f"customer:{customer_id}:tier") or "starter"
        
        # Priority mapping based on tier
        priority_map = {
            "scale": "high",
            "growth": "default",
            "starter": "low"
        }
        
        # Override for critical tasks
        if task_type in ["security_incident", "compliance_violation"]:
            return "critical"
        
        return priority_map.get(tier, "default")
    
    def route_task(self, task_name: str, customer_id: str) -> Dict[str, Any]:
        priority = self.get_priority(customer_id, task_name)
        
        return {
            "queue": priority,
            "priority": {"critical": 10, "high": 7, "default": 5, "low": 1}[priority],
            "routing_key": priority
        }

# Initialize components
redis_client = redis.Redis.from_url(
    os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
    decode_responses=True
)
rate_limiter = RateLimiter(redis_client)
priority_manager = TaskPriorityManager(redis_client)

# Monitor queue depth
@app.task
def monitor_queues():
    """Monitor queue depths and update metrics"""
    inspector = app.control.inspect()
    stats = inspector.stats()
    
    if stats:
        for worker, info in stats.items():
            for queue_name in ['critical', 'high', 'default', 'low']:
                queue_info = info.get('total', {}).get(queue_name, {})
                depth = queue_info.get('messages', 0)
                queue_depth.labels(priority=queue_name).set(depth)

# Schedule queue monitoring
app.conf.beat_schedule = {
    'monitor-queues': {
        'task': 'agents.core.celery_app.monitor_queues',
        'schedule': 30.0,  # Every 30 seconds
    },
}