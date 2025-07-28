"""
Smart Scheduling System with Intelligent Retry Logic
Provides adaptive scheduling based on success rates, resource availability, and compliance requirements
"""

import asyncio
import json
from datetime import datetime, timedelta, time
from typing import Dict, List, Optional, Tuple, Any, Callable
from dataclasses import dataclass, field
from enum import Enum
import heapq
import logging
from collections import defaultdict, deque
import numpy as np
from concurrent.futures import ThreadPoolExecutor
import pytz

logger = logging.getLogger(__name__)


class ScheduleType(Enum):
    CONTINUOUS = "continuous"
    HOURLY = "hourly"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    CUSTOM = "custom"
    ADAPTIVE = "adaptive"


class Priority(Enum):
    CRITICAL = 1
    HIGH = 2
    MEDIUM = 3
    LOW = 4
    BACKGROUND = 5


class RetryStrategy(Enum):
    EXPONENTIAL_BACKOFF = "exponential_backoff"
    LINEAR_BACKOFF = "linear_backoff"
    FIBONACCI_BACKOFF = "fibonacci_backoff"
    ADAPTIVE = "adaptive"
    IMMEDIATE = "immediate"


@dataclass
class ScheduleConfig:
    schedule_type: ScheduleType
    interval_minutes: Optional[int] = None
    specific_times: Optional[List[time]] = None
    days_of_week: Optional[List[int]] = None  # 0=Monday, 6=Sunday
    timezone: str = "UTC"
    blackout_periods: List[Tuple[time, time]] = field(default_factory=list)
    resource_constraints: Dict[str, Any] = field(default_factory=dict)
    priority: Priority = Priority.MEDIUM
    max_concurrent: int = 1


@dataclass
class RetryConfig:
    strategy: RetryStrategy
    max_attempts: int = 5
    initial_delay_seconds: int = 60
    max_delay_seconds: int = 3600
    backoff_factor: float = 2.0
    jitter: bool = True
    retry_on_errors: List[str] = field(default_factory=list)
    skip_on_errors: List[str] = field(default_factory=list)


@dataclass
class AgentTask:
    task_id: str
    agent_id: str
    control_id: str
    platform: str
    framework: str
    schedule_config: ScheduleConfig
    retry_config: RetryConfig
    last_run: Optional[datetime] = None
    last_success: Optional[datetime] = None
    consecutive_failures: int = 0
    total_runs: int = 0
    total_successes: int = 0
    average_duration: float = 0.0
    next_run: Optional[datetime] = None
    is_active: bool = True
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ExecutionResult:
    task_id: str
    success: bool
    duration_seconds: float
    error: Optional[str] = None
    evidence_collected: int = 0
    retry_recommended: bool = False
    resource_usage: Dict[str, float] = field(default_factory=dict)


class SmartScheduler:
    """
    Advanced scheduling system with ML-powered optimization
    """
    
    def __init__(self, max_workers: int = 10):
        self.tasks: Dict[str, AgentTask] = {}
        self.execution_queue: List[Tuple[datetime, str]] = []  # Min heap
        self.execution_history: Dict[str, deque] = defaultdict(lambda: deque(maxlen=100))
        self.resource_monitor = ResourceMonitor()
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.is_running = False
        self._schedule_lock = asyncio.Lock()
        self.performance_analyzer = PerformanceAnalyzer()
        
    async def add_task(self, task: AgentTask) -> None:
        """Add a new task to the scheduler"""
        async with self._schedule_lock:
            self.tasks[task.task_id] = task
            next_run = self._calculate_next_run(task)
            task.next_run = next_run
            heapq.heappush(self.execution_queue, (next_run, task.task_id))
            logger.info(f"Added task {task.task_id} scheduled for {next_run}")
    
    async def remove_task(self, task_id: str) -> None:
        """Remove a task from the scheduler"""
        async with self._schedule_lock:
            if task_id in self.tasks:
                self.tasks[task_id].is_active = False
                logger.info(f"Deactivated task {task_id}")
    
    async def start(self) -> None:
        """Start the scheduler"""
        self.is_running = True
        logger.info("Smart Scheduler started")
        
        # Start background tasks
        asyncio.create_task(self._execution_loop())
        asyncio.create_task(self._optimization_loop())
        asyncio.create_task(self._resource_monitoring_loop())
    
    async def stop(self) -> None:
        """Stop the scheduler"""
        self.is_running = False
        self.executor.shutdown(wait=True)
        logger.info("Smart Scheduler stopped")
    
    async def _execution_loop(self) -> None:
        """Main execution loop"""
        while self.is_running:
            try:
                async with self._schedule_lock:
                    if not self.execution_queue:
                        await asyncio.sleep(1)
                        continue
                    
                    # Check if it's time to run the next task
                    next_time, task_id = self.execution_queue[0]
                    
                    if datetime.utcnow() >= next_time:
                        heapq.heappop(self.execution_queue)
                        
                        if task_id not in self.tasks or not self.tasks[task_id].is_active:
                            continue
                        
                        task = self.tasks[task_id]
                        
                        # Check resource availability
                        if self._can_execute_now(task):
                            asyncio.create_task(self._execute_task(task))
                        else:
                            # Reschedule for later
                            retry_time = datetime.utcnow() + timedelta(minutes=5)
                            heapq.heappush(self.execution_queue, (retry_time, task_id))
                            logger.info(f"Rescheduled {task_id} due to resource constraints")
                
                await asyncio.sleep(0.1)  # Small delay to prevent CPU spinning
                
            except Exception as e:
                logger.error(f"Error in execution loop: {e}")
                await asyncio.sleep(1)
    
    async def _execute_task(self, task: AgentTask) -> None:
        """Execute a scheduled task"""
        start_time = datetime.utcnow()
        logger.info(f"Executing task {task.task_id} for {task.platform}/{task.control_id}")
        
        try:
            # Record execution start
            self.resource_monitor.record_execution_start(task.task_id)
            
            # Execute the actual agent task
            result = await self._run_agent_task(task)
            
            # Update task statistics
            duration = (datetime.utcnow() - start_time).total_seconds()
            task.last_run = start_time
            task.total_runs += 1
            
            if result.success:
                task.last_success = start_time
                task.consecutive_failures = 0
                task.total_successes += 1
                task.average_duration = (
                    (task.average_duration * (task.total_runs - 1) + duration) / task.total_runs
                )
            else:
                task.consecutive_failures += 1
                
                # Determine if retry is needed
                if self._should_retry(task, result):
                    retry_time = self._calculate_retry_time(task)
                    heapq.heappush(self.execution_queue, (retry_time, task.task_id))
                    logger.info(f"Task {task.task_id} scheduled for retry at {retry_time}")
                    return
            
            # Record execution history
            self.execution_history[task.task_id].append({
                "timestamp": start_time,
                "success": result.success,
                "duration": duration,
                "error": result.error,
                "evidence_collected": result.evidence_collected
            })
            
            # Schedule next regular run
            next_run = self._calculate_next_run(task)
            task.next_run = next_run
            heapq.heappush(self.execution_queue, (next_run, task.task_id))
            
            # Record execution end
            self.resource_monitor.record_execution_end(task.task_id, result)
            
        except Exception as e:
            logger.error(f"Error executing task {task.task_id}: {e}")
            task.consecutive_failures += 1
            
            # Schedule retry if appropriate
            if task.consecutive_failures < task.retry_config.max_attempts:
                retry_time = self._calculate_retry_time(task)
                heapq.heappush(self.execution_queue, (retry_time, task.task_id))
    
    async def _run_agent_task(self, task: AgentTask) -> ExecutionResult:
        """Simulate running an agent task (replace with actual agent execution)"""
        # This would be replaced with actual agent execution logic
        await asyncio.sleep(2)  # Simulate task execution
        
        # Simulate success/failure based on historical performance
        success_rate = task.total_successes / max(1, task.total_runs)
        success = np.random.random() > (1 - success_rate * 0.9)  # Bias towards success
        
        return ExecutionResult(
            task_id=task.task_id,
            success=success,
            duration_seconds=np.random.normal(task.average_duration or 30, 5),
            error=None if success else "Simulated error",
            evidence_collected=np.random.randint(5, 20) if success else 0,
            retry_recommended=not success,
            resource_usage={"cpu": np.random.random(), "memory": np.random.random()}
        )
    
    def _calculate_next_run(self, task: AgentTask) -> datetime:
        """Calculate the next scheduled run time"""
        now = datetime.utcnow()
        tz = pytz.timezone(task.schedule_config.timezone)
        
        if task.schedule_config.schedule_type == ScheduleType.CONTINUOUS:
            # Run immediately after completion
            return now + timedelta(seconds=30)  # Small delay
            
        elif task.schedule_config.schedule_type == ScheduleType.HOURLY:
            interval = task.schedule_config.interval_minutes or 60
            return now + timedelta(minutes=interval)
            
        elif task.schedule_config.schedule_type == ScheduleType.DAILY:
            # Run at specific times each day
            local_now = now.astimezone(tz)
            next_runs = []
            
            for scheduled_time in task.schedule_config.specific_times or [time(0, 0)]:
                next_datetime = local_now.replace(
                    hour=scheduled_time.hour,
                    minute=scheduled_time.minute,
                    second=0,
                    microsecond=0
                )
                
                if next_datetime <= local_now:
                    next_datetime += timedelta(days=1)
                
                # Check blackout periods
                if not self._in_blackout_period(next_datetime, task.schedule_config):
                    next_runs.append(next_datetime.astimezone(pytz.UTC))
            
            return min(next_runs) if next_runs else now + timedelta(days=1)
            
        elif task.schedule_config.schedule_type == ScheduleType.WEEKLY:
            # Run on specific days of the week
            local_now = now.astimezone(tz)
            next_runs = []
            
            for day in task.schedule_config.days_of_week or [0]:
                days_ahead = (day - local_now.weekday()) % 7
                if days_ahead == 0 and local_now.time() > (task.schedule_config.specific_times or [time(0, 0)])[0]:
                    days_ahead = 7
                
                next_date = local_now + timedelta(days=days_ahead)
                for scheduled_time in task.schedule_config.specific_times or [time(0, 0)]:
                    next_datetime = next_date.replace(
                        hour=scheduled_time.hour,
                        minute=scheduled_time.minute,
                        second=0,
                        microsecond=0
                    )
                    
                    if not self._in_blackout_period(next_datetime, task.schedule_config):
                        next_runs.append(next_datetime.astimezone(pytz.UTC))
            
            return min(next_runs) if next_runs else now + timedelta(weeks=1)
            
        elif task.schedule_config.schedule_type == ScheduleType.ADAPTIVE:
            # Use ML to determine optimal time
            return self._calculate_adaptive_schedule(task)
        
        else:
            # Default to hourly
            return now + timedelta(hours=1)
    
    def _calculate_adaptive_schedule(self, task: AgentTask) -> datetime:
        """Use ML to calculate optimal schedule time"""
        # Analyze historical performance
        history = self.execution_history.get(task.task_id, deque())
        
        if len(history) < 10:
            # Not enough data, use default schedule
            return datetime.utcnow() + timedelta(hours=4)
        
        # Find patterns in successful executions
        successful_hours = []
        for execution in history:
            if execution["success"]:
                hour = execution["timestamp"].hour
                successful_hours.append(hour)
        
        if successful_hours:
            # Find most successful hour
            hour_counts = defaultdict(int)
            for hour in successful_hours:
                hour_counts[hour] += 1
            
            best_hour = max(hour_counts, key=hour_counts.get)
            
            # Schedule for next occurrence of best hour
            now = datetime.utcnow()
            next_run = now.replace(hour=best_hour, minute=0, second=0, microsecond=0)
            
            if next_run <= now:
                next_run += timedelta(days=1)
            
            # Add some randomness to prevent clustering
            jitter = np.random.randint(-30, 30)
            next_run += timedelta(minutes=jitter)
            
            return next_run
        
        # Fallback
        return datetime.utcnow() + timedelta(hours=6)
    
    def _should_retry(self, task: AgentTask, result: ExecutionResult) -> bool:
        """Determine if a task should be retried"""
        if task.consecutive_failures >= task.retry_config.max_attempts:
            return False
        
        if result.error and any(skip in result.error for skip in task.retry_config.skip_on_errors):
            return False
        
        if task.retry_config.retry_on_errors:
            return any(retry in (result.error or "") for retry in task.retry_config.retry_on_errors)
        
        return result.retry_recommended
    
    def _calculate_retry_time(self, task: AgentTask) -> datetime:
        """Calculate when to retry a failed task"""
        config = task.retry_config
        attempt = task.consecutive_failures
        
        if config.strategy == RetryStrategy.EXPONENTIAL_BACKOFF:
            delay = min(
                config.initial_delay_seconds * (config.backoff_factor ** (attempt - 1)),
                config.max_delay_seconds
            )
        elif config.strategy == RetryStrategy.LINEAR_BACKOFF:
            delay = min(
                config.initial_delay_seconds * attempt,
                config.max_delay_seconds
            )
        elif config.strategy == RetryStrategy.FIBONACCI_BACKOFF:
            # Fibonacci sequence for delays
            fib = [1, 1]
            for _ in range(attempt):
                fib.append(fib[-1] + fib[-2])
            delay = min(
                config.initial_delay_seconds * fib[min(attempt, len(fib) - 1)],
                config.max_delay_seconds
            )
        elif config.strategy == RetryStrategy.ADAPTIVE:
            # Use ML to determine optimal retry time
            delay = self._calculate_adaptive_retry_delay(task)
        else:  # IMMEDIATE
            delay = 0
        
        # Add jitter if configured
        if config.jitter and delay > 0:
            jitter = np.random.uniform(-delay * 0.25, delay * 0.25)
            delay += jitter
        
        return datetime.utcnow() + timedelta(seconds=max(0, delay))
    
    def _calculate_adaptive_retry_delay(self, task: AgentTask) -> float:
        """Use ML to calculate optimal retry delay"""
        # Analyze historical retry success rates
        history = self.execution_history.get(task.task_id, deque())
        
        # Simple adaptive strategy based on time of day and resource usage
        current_hour = datetime.utcnow().hour
        
        # Night hours (less load) - shorter delays
        if 0 <= current_hour < 6:
            base_delay = 30
        # Business hours (high load) - longer delays
        elif 9 <= current_hour < 17:
            base_delay = 300
        else:
            base_delay = 120
        
        # Adjust based on consecutive failures
        delay = base_delay * (1.5 ** min(task.consecutive_failures - 1, 5))
        
        return min(delay, task.retry_config.max_delay_seconds)
    
    def _can_execute_now(self, task: AgentTask) -> bool:
        """Check if a task can be executed given current resource constraints"""
        # Check concurrent execution limits
        platform_tasks = sum(
            1 for t in self.tasks.values()
            if t.platform == task.platform and t.last_run and
            (datetime.utcnow() - t.last_run).total_seconds() < t.average_duration
        )
        
        if platform_tasks >= task.schedule_config.max_concurrent:
            return False
        
        # Check resource availability
        resources = self.resource_monitor.get_current_resources()
        constraints = task.schedule_config.resource_constraints
        
        if "min_cpu_available" in constraints:
            if resources.get("cpu_available", 100) < constraints["min_cpu_available"]:
                return False
        
        if "min_memory_available" in constraints:
            if resources.get("memory_available", 100) < constraints["min_memory_available"]:
                return False
        
        # Check if in blackout period
        if self._in_blackout_period(datetime.utcnow(), task.schedule_config):
            return False
        
        return True
    
    def _in_blackout_period(self, check_time: datetime, config: ScheduleConfig) -> bool:
        """Check if a time falls within blackout periods"""
        local_time = check_time.astimezone(pytz.timezone(config.timezone))
        current_time = local_time.time()
        
        for start, end in config.blackout_periods:
            if start <= end:
                if start <= current_time <= end:
                    return True
            else:  # Crosses midnight
                if current_time >= start or current_time <= end:
                    return True
        
        return False
    
    async def _optimization_loop(self) -> None:
        """Background loop for schedule optimization"""
        while self.is_running:
            try:
                # Run optimization every hour
                await asyncio.sleep(3600)
                
                # Analyze performance and adjust schedules
                for task_id, task in self.tasks.items():
                    if task.schedule_config.schedule_type == ScheduleType.ADAPTIVE:
                        optimized_schedule = self.performance_analyzer.optimize_schedule(
                            task, self.execution_history[task_id]
                        )
                        if optimized_schedule:
                            task.schedule_config = optimized_schedule
                            logger.info(f"Optimized schedule for task {task_id}")
                
            except Exception as e:
                logger.error(f"Error in optimization loop: {e}")
    
    async def _resource_monitoring_loop(self) -> None:
        """Background loop for resource monitoring"""
        while self.is_running:
            try:
                await self.resource_monitor.update_metrics()
                await asyncio.sleep(30)  # Update every 30 seconds
            except Exception as e:
                logger.error(f"Error in resource monitoring: {e}")
    
    def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get current status of a task"""
        if task_id not in self.tasks:
            return None
        
        task = self.tasks[task_id]
        return {
            "task_id": task_id,
            "agent_id": task.agent_id,
            "platform": task.platform,
            "framework": task.framework,
            "is_active": task.is_active,
            "last_run": task.last_run.isoformat() if task.last_run else None,
            "last_success": task.last_success.isoformat() if task.last_success else None,
            "next_run": task.next_run.isoformat() if task.next_run else None,
            "consecutive_failures": task.consecutive_failures,
            "success_rate": task.total_successes / max(1, task.total_runs),
            "average_duration": task.average_duration,
            "schedule_type": task.schedule_config.schedule_type.value,
            "priority": task.schedule_config.priority.value
        }
    
    def get_upcoming_tasks(self, hours: int = 24) -> List[Dict[str, Any]]:
        """Get tasks scheduled in the next N hours"""
        cutoff = datetime.utcnow() + timedelta(hours=hours)
        upcoming = []
        
        for next_time, task_id in sorted(self.execution_queue):
            if next_time > cutoff:
                break
            
            if task_id in self.tasks and self.tasks[task_id].is_active:
                task = self.tasks[task_id]
                upcoming.append({
                    "task_id": task_id,
                    "agent_id": task.agent_id,
                    "scheduled_time": next_time.isoformat(),
                    "platform": task.platform,
                    "control_id": task.control_id,
                    "priority": task.schedule_config.priority.value
                })
        
        return upcoming


class ResourceMonitor:
    """Monitor system resources for intelligent scheduling"""
    
    def __init__(self):
        self.current_resources = {
            "cpu_available": 100,
            "memory_available": 100,
            "active_tasks": 0,
            "queued_tasks": 0
        }
        self.resource_history = deque(maxlen=1000)
    
    async def update_metrics(self) -> None:
        """Update resource metrics"""
        # In production, this would use actual system metrics
        # For now, simulate resource usage
        
        self.current_resources.update({
            "cpu_available": max(0, 100 - np.random.normal(30, 10)),
            "memory_available": max(0, 100 - np.random.normal(40, 15)),
            "timestamp": datetime.utcnow().isoformat()
        })
        
        self.resource_history.append(self.current_resources.copy())
    
    def get_current_resources(self) -> Dict[str, float]:
        """Get current resource availability"""
        return self.current_resources.copy()
    
    def record_execution_start(self, task_id: str) -> None:
        """Record that a task execution has started"""
        self.current_resources["active_tasks"] += 1
    
    def record_execution_end(self, task_id: str, result: ExecutionResult) -> None:
        """Record that a task execution has ended"""
        self.current_resources["active_tasks"] = max(0, self.current_resources["active_tasks"] - 1)
        
        # Update resource usage based on result
        if result.resource_usage:
            # This would update predictions for future scheduling
            pass


class PerformanceAnalyzer:
    """Analyze task performance for optimization"""
    
    def optimize_schedule(self, task: AgentTask, history: deque) -> Optional[ScheduleConfig]:
        """Optimize schedule based on historical performance"""
        if len(history) < 20:
            return None  # Not enough data
        
        # Analyze success patterns by hour
        success_by_hour = defaultdict(list)
        duration_by_hour = defaultdict(list)
        
        for execution in history:
            hour = execution["timestamp"].hour
            success_by_hour[hour].append(execution["success"])
            duration_by_hour[hour].append(execution["duration"])
        
        # Find best performing hours
        hour_scores = {}
        for hour in range(24):
            if hour in success_by_hour:
                success_rate = sum(success_by_hour[hour]) / len(success_by_hour[hour])
                avg_duration = np.mean(duration_by_hour[hour])
                # Score based on success rate and speed
                hour_scores[hour] = success_rate * (1 / (1 + avg_duration / 60))
        
        if hour_scores:
            # Get top 3 hours
            best_hours = sorted(hour_scores.keys(), key=hour_scores.get, reverse=True)[:3]
            
            # Create optimized schedule
            return ScheduleConfig(
                schedule_type=ScheduleType.DAILY,
                specific_times=[time(hour, 0) for hour in best_hours],
                timezone=task.schedule_config.timezone,
                blackout_periods=task.schedule_config.blackout_periods,
                resource_constraints=task.schedule_config.resource_constraints,
                priority=task.schedule_config.priority,
                max_concurrent=task.schedule_config.max_concurrent
            )
        
        return None


# Example usage
def create_velocity_scheduler() -> SmartScheduler:
    """Create a configured scheduler for Velocity platform"""
    scheduler = SmartScheduler(max_workers=20)
    
    # Example task configuration
    aws_soc2_task = AgentTask(
        task_id="aws_soc2_iam_001",
        agent_id="aws-soc2-agent",
        control_id="CC6.1",
        platform="aws",
        framework="soc2",
        schedule_config=ScheduleConfig(
            schedule_type=ScheduleType.HOURLY,
            interval_minutes=240,  # Every 4 hours
            timezone="US/Eastern",
            blackout_periods=[(time(22, 0), time(6, 0))],  # No runs 10 PM - 6 AM
            resource_constraints={"min_cpu_available": 20},
            priority=Priority.HIGH
        ),
        retry_config=RetryConfig(
            strategy=RetryStrategy.EXPONENTIAL_BACKOFF,
            max_attempts=3,
            initial_delay_seconds=300,  # 5 minutes
            max_delay_seconds=3600,  # 1 hour
            retry_on_errors=["timeout", "connection_error"],
            skip_on_errors=["invalid_credentials", "access_denied"]
        )
    )
    
    return scheduler