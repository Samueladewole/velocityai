"""
Velocity.ai Task Queue Management System
Redis/Celery-based distributed task processing

Features:
- Priority-based task queuing
- Task retry mechanisms with exponential backoff
- Load balancing across agent instances
- Real-time task status monitoring
- Dead letter queue for failed tasks
"""

import asyncio
import json
import logging
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Callable
from enum import Enum
from dataclasses import dataclass, asdict
import redis.asyncio as redis
from celery import Celery
from celery.result import AsyncResult
import pickle

logger = logging.getLogger(__name__)

class TaskPriority(Enum):
    CRITICAL = 1
    HIGH = 2
    NORMAL = 5
    LOW = 8
    BACKGROUND = 10

class TaskStatus(Enum):
    PENDING = "pending"
    QUEUED = "queued"
    ASSIGNED = "assigned"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"
    CANCELLED = "cancelled"
    TIMEOUT = "timeout"

@dataclass
class TaskDefinition:
    """Task definition with all metadata"""
    id: str
    task_type: str
    agent_type: str
    priority: TaskPriority
    payload: Dict[str, Any]
    max_retries: int = 3
    timeout_seconds: int = 300
    retry_delay_seconds: int = 60
    created_at: datetime = None
    scheduled_at: datetime = None
    correlation_id: str = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.utcnow()
        if self.correlation_id is None:
            self.correlation_id = str(uuid.uuid4())

@dataclass  
class TaskResult:
    """Task execution result"""
    task_id: str
    status: TaskStatus
    result: Optional[Any] = None
    error_message: Optional[str] = None
    execution_time_ms: Optional[int] = None
    agent_id: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    retry_count: int = 0

class TaskQueueManager:
    """
    Distributed task queue manager using Redis and Celery
    
    Handles:
    - Task queuing with priority-based routing
    - Agent load balancing and capacity management
    - Task retry logic with exponential backoff
    - Dead letter queue for permanently failed tasks
    - Real-time task status monitoring
    """
    
    def __init__(
        self,
        redis_url: str = "redis://localhost:6379/0",
        celery_broker_url: str = "redis://localhost:6379/1",
        celery_backend_url: str = "redis://localhost:6379/2"
    ):
        self.redis_url = redis_url
        self.celery_broker_url = celery_broker_url
        self.celery_backend_url = celery_backend_url
        
        # Redis client
        self.redis_client = None
        
        # Celery app
        self.celery_app = None
        
        # Task tracking
        self.pending_tasks: Dict[str, TaskDefinition] = {}
        self.running_tasks: Dict[str, TaskDefinition] = {}
        
        # Agent capacity tracking
        self.agent_capacities: Dict[str, int] = {}  # agent_id -> max_concurrent_tasks
        self.agent_load: Dict[str, int] = {}  # agent_id -> current_task_count
        
        # Queue statistics
        self.queue_stats = {
            'tasks_queued': 0,
            'tasks_completed': 0,
            'tasks_failed': 0,
            'tasks_retried': 0,
            'average_execution_time_ms': 0
        }
        
        # Redis key prefixes
        self.TASK_QUEUE_PREFIX = "velocity:tasks:queue:"
        self.TASK_STATUS_PREFIX = "velocity:tasks:status:"
        self.AGENT_CAPACITY_PREFIX = "velocity:agents:capacity:"
        self.DEAD_LETTER_QUEUE = "velocity:tasks:deadletter"
        
    async def initialize(self):
        """Initialize task queue system"""
        logger.info("🚀 Initializing Velocity Task Queue Manager")
        
        # Initialize Redis
        self.redis_client = redis.from_url(self.redis_url)
        await self.redis_client.ping()
        logger.info("✅ Redis connection established for task queue")
        
        # Initialize Celery
        self.celery_app = Celery(
            'velocity_task_queue',
            broker=self.celery_broker_url,
            backend=self.celery_backend_url
        )
        
        # Configure Celery
        self.celery_app.conf.update(
            task_serializer='json',
            accept_content=['json'],
            result_serializer='json',
            timezone='UTC',
            enable_utc=True,
            task_track_started=True,
            task_time_limit=600,  # 10 minutes hard limit  
            task_soft_time_limit=300,  # 5 minutes soft limit
            worker_prefetch_multiplier=1,
            task_acks_late=True,
            worker_disable_rate_limits=False,
            task_compression='gzip',
            result_compression='gzip'
        )
        
        # Register task handlers
        self._register_celery_tasks()
        
        # Start monitoring tasks
        asyncio.create_task(self._task_monitor_loop())
        asyncio.create_task(self._queue_stats_updater())
        
        logger.info("🎯 Task Queue Manager initialized successfully")
    
    def _register_celery_tasks(self):
        """Register Celery task handlers"""
        
        @self.celery_app.task(bind=True, name='velocity.execute_agent_task')
        def execute_agent_task(self, task_data: Dict[str, Any]):
            """Execute agent task through Celery"""
            try:
                task_id = task_data['id']
                agent_type = task_data['agent_type']
                payload = task_data['payload']
                
                logger.info(f"🔄 Executing task {task_id} on agent type {agent_type}")
                
                # Simulate task execution (in real implementation, this would call the actual agent)
                import time
                start_time = time.time()
                
                # Task execution logic would go here
                # For now, simulate different execution times and success rates
                execution_time = 2.5  # seconds
                time.sleep(execution_time)
                
                result = {
                    'task_id': task_id,
                    'agent_type': agent_type,
                    'execution_time_ms': int(execution_time * 1000),
                    'status': 'completed',
                    'result_data': f"Task {task_id} completed successfully",
                    'timestamp': datetime.utcnow().isoformat()
                }
                
                logger.info(f"✅ Task {task_id} completed in {execution_time:.2f}s")
                return result
                
            except Exception as e:
                logger.error(f"❌ Task {task_data.get('id', 'unknown')} failed: {e}")
                raise
        
        logger.info("📋 Celery task handlers registered")
    
    async def submit_task(self, task: TaskDefinition) -> str:
        """Submit task to the queue"""
        try:
            # Store task definition
            self.pending_tasks[task.id] = task
            
            # Add to priority queue in Redis
            queue_key = f"{self.TASK_QUEUE_PREFIX}{task.priority.value}"
            task_data = asdict(task)
            
            # Convert datetime objects and enums to JSON serializable formats
            task_data['created_at'] = task.created_at.isoformat()
            if task.scheduled_at:
                task_data['scheduled_at'] = task.scheduled_at.isoformat()
            task_data['priority'] = task.priority.value  # Convert enum to value
            
            await self.redis_client.lpush(queue_key, json.dumps(task_data))
            
            # Set task status
            await self._set_task_status(task.id, TaskStatus.QUEUED)
            
            # Update stats
            self.queue_stats['tasks_queued'] += 1
            
            logger.info(f"📤 Task {task.id} submitted to priority queue {task.priority.value}")
            
            # Trigger immediate processing if agents are available
            await self._trigger_task_processing(task.agent_type)
            
            return task.id
            
        except Exception as e:
            logger.error(f"❌ Failed to submit task {task.id}: {e}")
            raise
    
    async def get_task_status(self, task_id: str) -> Optional[TaskResult]:
        """Get current task status"""
        try:
            # Check Redis for task status
            status_key = f"{self.TASK_STATUS_PREFIX}{task_id}"
            status_data = await self.redis_client.get(status_key)
            
            if status_data:
                status_dict = json.loads(status_data)
                
                # Convert ISO strings back to datetime objects
                if status_dict.get('started_at'):
                    status_dict['started_at'] = datetime.fromisoformat(status_dict['started_at'])
                if status_dict.get('completed_at'):
                    status_dict['completed_at'] = datetime.fromisoformat(status_dict['completed_at'])
                
                return TaskResult(**status_dict)
            
            # Check if task is pending
            if task_id in self.pending_tasks:
                return TaskResult(
                    task_id=task_id,
                    status=TaskStatus.PENDING
                )
            
            # Check Celery backend for completed tasks
            if self.celery_app:
                celery_result = AsyncResult(task_id, app=self.celery_app)
                if celery_result.state == 'SUCCESS':
                    result_data = celery_result.result
                    return TaskResult(
                        task_id=task_id,
                        status=TaskStatus.COMPLETED,
                        result=result_data,
                        execution_time_ms=result_data.get('execution_time_ms'),
                        completed_at=datetime.fromisoformat(result_data.get('timestamp', datetime.utcnow().isoformat()))
                    )
                elif celery_result.state == 'FAILURE':
                    return TaskResult(
                        task_id=task_id,
                        status=TaskStatus.FAILED,
                        error_message=str(celery_result.info)
                    )
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Failed to get task status for {task_id}: {e}")
            return None
    
    async def cancel_task(self, task_id: str) -> bool:
        """Cancel a queued or running task"""
        try:
            # Remove from pending tasks
            if task_id in self.pending_tasks:
                del self.pending_tasks[task_id]
            
            # Remove from running tasks
            if task_id in self.running_tasks:
                del self.running_tasks[task_id]
            
            # Revoke Celery task if it exists
            if self.celery_app:
                self.celery_app.control.revoke(task_id, terminate=True)
            
            # Update status
            await self._set_task_status(task_id, TaskStatus.CANCELLED)
            
            logger.info(f"🚫 Task {task_id} cancelled")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to cancel task {task_id}: {e}")
            return False
    
    async def register_agent_capacity(self, agent_id: str, max_concurrent_tasks: int):
        """Register agent processing capacity"""
        self.agent_capacities[agent_id] = max_concurrent_tasks
        self.agent_load[agent_id] = 0
        
        # Store in Redis for persistence
        capacity_key = f"{self.AGENT_CAPACITY_PREFIX}{agent_id}"
        await self.redis_client.set(capacity_key, max_concurrent_tasks)
        
        logger.info(f"📊 Agent {agent_id} registered with capacity {max_concurrent_tasks}")
    
    async def update_agent_load(self, agent_id: str, current_load: int):
        """Update current agent load"""
        if agent_id in self.agent_load:
            self.agent_load[agent_id] = current_load
            logger.debug(f"📈 Agent {agent_id} load updated to {current_load}")
    
    async def get_available_agent(self, agent_type: str) -> Optional[str]:
        """Find available agent for task assignment"""
        available_agents = []
        
        for agent_id, max_capacity in self.agent_capacities.items():
            # Check if agent matches type (simplified matching)
            if agent_type in agent_id or agent_id.startswith(agent_type):
                current_load = self.agent_load.get(agent_id, 0)
                if current_load < max_capacity:
                    available_agents.append((agent_id, max_capacity - current_load))
        
        if available_agents:
            # Return agent with most available capacity
            return max(available_agents, key=lambda x: x[1])[0]
        
        return None
    
    async def get_queue_statistics(self) -> Dict[str, Any]:
        """Get comprehensive queue statistics"""
        stats = self.queue_stats.copy()
        
        # Add real-time queue lengths
        for priority in TaskPriority:
            queue_key = f"{self.TASK_QUEUE_PREFIX}{priority.value}"
            queue_length = await self.redis_client.llen(queue_key)
            stats[f'queue_length_priority_{priority.value}'] = queue_length
        
        # Add agent statistics
        stats['total_agents'] = len(self.agent_capacities)
        stats['total_agent_capacity'] = sum(self.agent_capacities.values())
        stats['current_agent_load'] = sum(self.agent_load.values())
        
        # Add dead letter queue length
        dead_letter_length = await self.redis_client.llen(self.DEAD_LETTER_QUEUE)
        stats['dead_letter_queue_length'] = dead_letter_length
        
        return stats
    
    async def requeue_failed_tasks(self, max_age_hours: int = 24) -> int:
        """Requeue failed tasks from dead letter queue"""
        try:
            requeued_count = 0
            cutoff_time = datetime.utcnow() - timedelta(hours=max_age_hours)
            
            # Process dead letter queue
            while True:
                task_data = await self.redis_client.rpop(self.DEAD_LETTER_QUEUE)
                if not task_data:
                    break
                
                try:
                    task_dict = json.loads(task_data)
                    task_created = datetime.fromisoformat(task_dict['created_at'])
                    
                    # Only requeue recent tasks
                    if task_created > cutoff_time:
                        # Reset retry count and requeue
                        task_dict['retry_count'] = 0
                        task = TaskDefinition(**task_dict)
                        await self.submit_task(task)
                        requeued_count += 1
                        
                except Exception as e:
                    logger.warning(f"⚠️ Failed to requeue task: {e}")
                    continue
            
            logger.info(f"🔄 Requeued {requeued_count} failed tasks")
            return requeued_count
            
        except Exception as e:
            logger.error(f"❌ Failed to requeue tasks: {e}")
            return 0
    
    async def _trigger_task_processing(self, agent_type: str):
        """Trigger immediate task processing for available agents"""
        available_agent = await self.get_available_agent(agent_type)
        if available_agent:
            asyncio.create_task(self._process_tasks_for_agent(available_agent, agent_type))
    
    async def _process_tasks_for_agent(self, agent_id: str, agent_type: str):
        """Process tasks for a specific agent"""
        try:
            # Get next highest priority task
            for priority in TaskPriority:
                queue_key = f"{self.TASK_QUEUE_PREFIX}{priority.value}"
                task_data = await self.redis_client.rpop(queue_key)
                
                if task_data:
                    task_dict = json.loads(task_data)
                    
                    # Check if task matches agent type
                    if task_dict['agent_type'] == agent_type:
                        await self._execute_task(task_dict, agent_id)
                        break
                    else:
                        # Put back in queue if wrong agent type
                        await self.redis_client.lpush(queue_key, task_data)
                        
        except Exception as e:
            logger.error(f"❌ Task processing error for agent {agent_id}: {e}")
    
    async def _execute_task(self, task_dict: Dict[str, Any], agent_id: str):
        """Execute task through Celery"""
        try:
            task_id = task_dict['id']
            
            # Update agent load
            current_load = self.agent_load.get(agent_id, 0)
            await self.update_agent_load(agent_id, current_load + 1)
            
            # Set task status to running
            await self._set_task_status(task_id, TaskStatus.RUNNING, agent_id=agent_id)
            
            # Move to running tasks
            if task_id in self.pending_tasks:
                self.running_tasks[task_id] = self.pending_tasks[task_id]
                del self.pending_tasks[task_id]
            
            # Execute via Celery
            celery_task = self.celery_app.send_task(
                'velocity.execute_agent_task',
                args=[task_dict],
                task_id=task_id,
                countdown=0
            )
            
            logger.info(f"🔄 Task {task_id} dispatched to Celery (agent: {agent_id})")
            
            # Monitor task completion
            asyncio.create_task(self._monitor_task_completion(task_id, agent_id, celery_task))
            
        except Exception as e:
            logger.error(f"❌ Failed to execute task {task_dict.get('id', 'unknown')}: {e}")
            await self._handle_task_failure(task_dict, str(e))
    
    async def _monitor_task_completion(self, task_id: str, agent_id: str, celery_task):
        """Monitor Celery task completion"""
        try:
            # Wait for task completion
            while not celery_task.ready():
                await asyncio.sleep(1)
            
            # Update agent load
            current_load = self.agent_load.get(agent_id, 1)
            await self.update_agent_load(agent_id, max(0, current_load - 1))
            
            # Remove from running tasks
            if task_id in self.running_tasks:
                del self.running_tasks[task_id]
            
            # Handle result
            if celery_task.successful():
                result = celery_task.result
                await self._set_task_status(
                    task_id, 
                    TaskStatus.COMPLETED,
                    result=result,
                    execution_time_ms=result.get('execution_time_ms')
                )
                self.queue_stats['tasks_completed'] += 1
                
            else:
                error_msg = str(celery_task.info)
                await self._set_task_status(task_id, TaskStatus.FAILED, error_message=error_msg)
                await self._handle_task_retry(task_id, error_msg)
                
        except Exception as e:
            logger.error(f"❌ Task monitoring error for {task_id}: {e}")
    
    async def _handle_task_failure(self, task_dict: Dict[str, Any], error_message: str):
        """Handle task failure and retry logic"""
        task_id = task_dict['id']
        retry_count = task_dict.get('retry_count', 0)
        max_retries = task_dict.get('max_retries', 3)
        
        if retry_count < max_retries:
            # Retry task with exponential backoff
            retry_delay = task_dict.get('retry_delay_seconds', 60) * (2 ** retry_count)
            task_dict['retry_count'] = retry_count + 1
            
            # Schedule retry
            await asyncio.sleep(retry_delay)
            
            # Requeue task
            priority = task_dict.get('priority', 5)
            queue_key = f"{self.TASK_QUEUE_PREFIX}{priority}"
            await self.redis_client.lpush(queue_key, json.dumps(task_dict))
            
            await self._set_task_status(task_id, TaskStatus.RETRYING)
            self.queue_stats['tasks_retried'] += 1
            
            logger.info(f"🔄 Task {task_id} scheduled for retry {retry_count + 1}/{max_retries}")
            
        else:
            # Move to dead letter queue
            await self.redis_client.lpush(self.DEAD_LETTER_QUEUE, json.dumps(task_dict))
            await self._set_task_status(task_id, TaskStatus.FAILED, error_message=error_message)
            self.queue_stats['tasks_failed'] += 1
            
            logger.error(f"💀 Task {task_id} moved to dead letter queue after {max_retries} retries")
    
    async def _handle_task_retry(self, task_id: str, error_message: str):
        """Handle task retry after Celery failure"""
        if task_id in self.running_tasks:
            task = self.running_tasks[task_id]
            task_dict = asdict(task)
            task_dict['created_at'] = task.created_at.isoformat()
            if task.scheduled_at:
                task_dict['scheduled_at'] = task.scheduled_at.isoformat()
            
            await self._handle_task_failure(task_dict, error_message)
    
    async def _set_task_status(
        self, 
        task_id: str, 
        status: TaskStatus, 
        agent_id: str = None,
        result: Any = None,
        error_message: str = None,
        execution_time_ms: int = None
    ):
        """Set task status in Redis"""
        status_key = f"{self.TASK_STATUS_PREFIX}{task_id}"
        
        status_data = {
            'task_id': task_id,
            'status': status.value,
            'agent_id': agent_id,
            'result': result,
            'error_message': error_message,
            'execution_time_ms': execution_time_ms,
            'updated_at': datetime.utcnow().isoformat()
        }
        
        if status == TaskStatus.RUNNING:
            status_data['started_at'] = datetime.utcnow().isoformat()
        elif status in [TaskStatus.COMPLETED, TaskStatus.FAILED]:
            status_data['completed_at'] = datetime.utcnow().isoformat()
        
        await self.redis_client.setex(
            status_key, 
            86400,  # 24 hours TTL
            json.dumps(status_data)
        )
    
    async def _task_monitor_loop(self):
        """Background task monitoring loop"""
        while True:
            try:
                # Check for stuck tasks
                await self._check_stuck_tasks()
                
                # Clean up completed task statuses
                await self._cleanup_old_statuses()
                
                await asyncio.sleep(60)  # Check every minute
                
            except Exception as e:
                logger.error(f"❌ Task monitor loop error: {e}")
                await asyncio.sleep(30)
    
    async def _check_stuck_tasks(self):
        """Check for and handle stuck tasks"""
        stuck_timeout = timedelta(minutes=10)
        current_time = datetime.utcnow()
        
        for task_id, task in list(self.running_tasks.items()):
            if current_time - task.created_at > stuck_timeout:
                logger.warning(f"⚠️ Task {task_id} appears stuck, marking as timeout")
                await self._set_task_status(task_id, TaskStatus.TIMEOUT)
                del self.running_tasks[task_id]
    
    async def _cleanup_old_statuses(self):
        """Clean up old task statuses from Redis"""
        # This would implement cleanup logic for old task status entries
        # to prevent Redis memory bloat
        pass
    
    async def _queue_stats_updater(self):
        """Update queue statistics periodically"""
        while True:
            try:
                # Update average execution time
                # This would calculate from recent completed tasks
                await asyncio.sleep(300)  # Update every 5 minutes
                
            except Exception as e:
                logger.error(f"❌ Queue stats updater error: {e}")
                await asyncio.sleep(60)
    
    async def shutdown(self):
        """Graceful shutdown of task queue"""
        logger.info("🛑 Shutting down Task Queue Manager")
        
        # Cancel pending tasks
        for task_id in list(self.pending_tasks.keys()):
            await self.cancel_task(task_id)
        
        # Wait for running tasks to complete (with timeout)
        timeout = 30  # seconds
        start_time = datetime.utcnow()
        
        while self.running_tasks and (datetime.utcnow() - start_time).seconds < timeout:
            await asyncio.sleep(1)
        
        # Force cancel remaining tasks
        for task_id in list(self.running_tasks.keys()):
            await self.cancel_task(task_id)
        
        # Close Redis connection
        if self.redis_client:
            await self.redis_client.close()
        
        logger.info("✅ Task Queue Manager shutdown complete")

# Global task queue manager instance
task_queue_manager = None

async def get_task_queue_manager() -> TaskQueueManager:
    """Get global task queue manager instance"""
    global task_queue_manager
    if task_queue_manager is None:
        task_queue_manager = TaskQueueManager()
        await task_queue_manager.initialize()
    return task_queue_manager