"""
Velocity.ai Agent Orchestration Engine
Main agent lifecycle management and coordination system

Handles:
- Agent creation, startup, shutdown, and monitoring
- Task distribution and load balancing
- Resource allocation and dependency management
- Error handling and recovery mechanisms
"""

import asyncio
import json
import logging
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Callable
from enum import Enum
from dataclasses import dataclass, asdict
import psycopg2
import psycopg2.extras
from contextlib import asynccontextmanager
import redis.asyncio as redis
from celery import Celery

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AgentStatus(Enum):
    CREATED = "created"
    STARTING = "starting"
    RUNNING = "running"
    PAUSED = "paused"
    STOPPED = "stopped"
    ERROR = "error"
    TERMINATED = "terminated"

class TaskStatus(Enum):
    PENDING = "pending"
    ASSIGNED = "assigned"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"
    CANCELLED = "cancelled"

@dataclass
class AgentConfig:
    """Agent configuration data structure"""
    agent_type: str
    config: Dict[str, Any]
    capabilities: List[str]
    resource_limits: Dict[str, Any]
    dependencies: List[str] = None
    
    def __post_init__(self):
        if self.dependencies is None:
            self.dependencies = []

@dataclass
class AgentInstance:
    """Agent instance representation"""
    id: str
    agent_type: str
    status: AgentStatus
    config: Dict[str, Any]
    created_at: datetime
    last_active: Optional[datetime] = None
    error_message: Optional[str] = None
    metrics: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.metrics is None:
            self.metrics = {}

@dataclass
class Task:
    """Task data structure for agent processing"""
    id: str
    agent_id: str
    task_type: str
    priority: int
    payload: Dict[str, Any]
    status: TaskStatus
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    retry_count: int = 0
    max_retries: int = 3

class DatabaseConnection:
    """PostgreSQL database connection manager"""
    
    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        self._connection = None
    
    async def connect(self):
        """Establish database connection"""
        try:
            self._connection = psycopg2.connect(
                self.connection_string,
                cursor_factory=psycopg2.extras.RealDictCursor
            )
            self._connection.autocommit = True
            logger.info("✅ Database connection established")
        except Exception as e:
            logger.error(f"❌ Database connection failed: {e}")
            raise
    
    @asynccontextmanager
    async def cursor(self):
        """Get database cursor with automatic cleanup"""
        if not self._connection:
            await self.connect()
        
        cursor = self._connection.cursor()
        try:
            yield cursor
        finally:
            cursor.close()
    
    async def close(self):
        """Close database connection"""
        if self._connection:
            self._connection.close()
            logger.info("🔌 Database connection closed")

class AgentOrchestrator:
    """
    Main agent orchestration engine for Velocity.ai
    
    Responsibilities:
    - Agent lifecycle management (create, start, stop, monitor)
    - Task distribution and execution coordination
    - Resource allocation and dependency resolution
    - Health monitoring and error recovery
    """
    
    def __init__(
        self,
        db_connection_string: str = "postgresql://localhost/velocity_agents",
        redis_url: str = "redis://localhost:6379/0",
        celery_broker_url: str = "redis://localhost:6379/1"
    ):
        self.db = DatabaseConnection(db_connection_string)
        self.redis_client = None
        self.celery_app = None
        
        # Agent registry
        self.agents: Dict[str, AgentInstance] = {}
        self.agent_processes: Dict[str, Any] = {}  # Process references
        
        # Task management
        self.task_queue: Dict[int, List[Task]] = {}  # Priority-based queues
        self.active_tasks: Dict[str, Task] = {}
        
        # Agent factories for different types
        self.agent_factories: Dict[str, Callable] = {}
        
        # Configuration
        self.redis_url = redis_url
        self.celery_broker_url = celery_broker_url
        self.max_agents_per_type = 10
        self.health_check_interval = 30  # seconds
        self.task_timeout = 300  # seconds
        
        # Initialize task queues by priority
        for priority in range(1, 11):
            self.task_queue[priority] = []
    
    async def initialize(self):
        """Initialize orchestrator and dependencies"""
        logger.info("🚀 Initializing Velocity Agent Orchestrator")
        
        # Initialize database
        await self.db.connect()
        
        # Initialize Redis
        self.redis_client = redis.from_url(self.redis_url)
        await self.redis_client.ping()
        logger.info("✅ Redis connection established")
        
        # Initialize Celery
        self.celery_app = Celery(
            'velocity_agents',
            broker=self.celery_broker_url,
            backend=self.celery_broker_url
        )
        logger.info("✅ Celery initialized")
        
        # Register built-in agent factories
        self._register_agent_factories()
        
        # Load existing agents from database
        await self._load_existing_agents()
        
        # Start health monitoring
        asyncio.create_task(self._health_monitor_loop())
        
        # Start task processing
        asyncio.create_task(self._task_processor_loop())
        
        logger.info("🎯 Agent Orchestrator initialized successfully")
    
    def _register_agent_factories(self):
        """Register agent factory functions"""
        from .factory import (
            AWSEvidenceCollectorFactory,
            GCPScannerFactory,
            GitHubAnalyzerFactory,
            AzureMonitorFactory,
            QIEIntegrationFactory,
            TrustScoreEngineFactory,
            ContinuousMonitorFactory,
            ObservabilitySpecialistFactory,
            CryptographicVerificationFactory
        )
        
        self.agent_factories.update({
            'aws-evidence-collector': AWSEvidenceCollectorFactory,
            'gcp-scanner': GCPScannerFactory,
            'github-analyzer': GitHubAnalyzerFactory,
            'azure-monitor': AzureMonitorFactory,
            'qie-integration': QIEIntegrationFactory,
            'trust-score-engine': TrustScoreEngineFactory,
            'continuous-monitor': ContinuousMonitorFactory,
            'observability-specialist': ObservabilitySpecialistFactory,
            'cryptographic-verification': CryptographicVerificationFactory
        })
        
        logger.info(f"📦 Registered {len(self.agent_factories)} agent factories")
    
    async def _load_existing_agents(self):
        """Load existing agents from database"""
        async with self.db.cursor() as cursor:
            cursor.execute("""
                SELECT id, agent_type, status, config, created_at, last_active
                FROM agent_instances
                WHERE status NOT IN ('terminated', 'stopped')
            """)
            
            rows = cursor.fetchall()
            for row in rows:
                agent = AgentInstance(
                    id=row['id'],
                    agent_type=row['agent_type'],
                    status=AgentStatus(row['status']),
                    config=row['config'],
                    created_at=row['created_at'],
                    last_active=row['last_active']
                )
                self.agents[agent.id] = agent
                
                # Restart running agents
                if agent.status == AgentStatus.RUNNING:
                    await self._restart_agent(agent)
            
            logger.info(f"📋 Loaded {len(self.agents)} existing agents")
    
    async def create_agent(self, config: AgentConfig) -> str:
        """Create new agent instance"""
        agent_id = str(uuid.uuid4())
        
        # Validate agent type
        if config.agent_type not in self.agent_factories:
            raise ValueError(f"Unsupported agent type: {config.agent_type}")
        
        # Check limits
        type_count = sum(1 for a in self.agents.values() if a.agent_type == config.agent_type)
        if type_count >= self.max_agents_per_type:
            raise ValueError(f"Maximum agents of type {config.agent_type} reached")
        
        # Create agent instance
        agent = AgentInstance(
            id=agent_id,
            agent_type=config.agent_type,
            status=AgentStatus.CREATED,
            config=config.config,
            created_at=datetime.utcnow()
        )
        
        # Store in database
        async with self.db.cursor() as cursor:
            cursor.execute("""
                INSERT INTO agent_instances (id, agent_type, status, config, created_at)
                VALUES (%s, %s, %s, %s, %s)
            """, (agent_id, config.agent_type, agent.status.value, 
                  json.dumps(config.config), agent.created_at))
        
        # Add to registry
        self.agents[agent_id] = agent
        
        logger.info(f"✨ Created agent {agent_id} of type {config.agent_type}")
        
        # Log creation event
        await self._log_agent_event(agent_id, "INFO", f"Agent created with config: {config.config}")
        
        return agent_id
    
    async def start_agent(self, agent_id: str) -> bool:
        """Start an agent instance"""
        if agent_id not in self.agents:
            logger.error(f"❌ Agent {agent_id} not found")
            return False
        
        agent = self.agents[agent_id]
        
        if agent.status == AgentStatus.RUNNING:
            logger.info(f"⚡ Agent {agent_id} already running")
            return True
        
        try:
            # Update status to starting
            await self._update_agent_status(agent_id, AgentStatus.STARTING)
            
            # Get agent factory
            factory = self.agent_factories[agent.agent_type]
            
            # Create and start agent process
            process = await factory.create_agent(agent.config)
            await process.start()
            
            # Store process reference
            self.agent_processes[agent_id] = process
            
            # Update status to running
            await self._update_agent_status(agent_id, AgentStatus.RUNNING)
            agent.last_active = datetime.utcnow()
            
            logger.info(f"🚀 Agent {agent_id} started successfully")
            await self._log_agent_event(agent_id, "INFO", "Agent started")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to start agent {agent_id}: {e}")
            await self._update_agent_status(agent_id, AgentStatus.ERROR, str(e))
            await self._log_agent_event(agent_id, "ERROR", f"Start failed: {e}")
            return False
    
    async def stop_agent(self, agent_id: str, graceful: bool = True) -> bool:
        """Stop an agent instance"""
        if agent_id not in self.agents:
            return False
        
        agent = self.agents[agent_id]
        
        if agent.status in [AgentStatus.STOPPED, AgentStatus.TERMINATED]:
            return True
        
        try:
            # Cancel active tasks
            await self._cancel_agent_tasks(agent_id)
            
            # Stop agent process
            if agent_id in self.agent_processes:
                process = self.agent_processes[agent_id]
                if graceful:
                    await process.shutdown()
                else:
                    await process.terminate()
                
                del self.agent_processes[agent_id]
            
            # Update status
            status = AgentStatus.STOPPED if graceful else AgentStatus.TERMINATED
            await self._update_agent_status(agent_id, status)
            
            logger.info(f"🛑 Agent {agent_id} stopped {'gracefully' if graceful else 'forcefully'}")
            await self._log_agent_event(agent_id, "INFO", f"Agent {'stopped' if graceful else 'terminated'}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to stop agent {agent_id}: {e}")
            await self._log_agent_event(agent_id, "ERROR", f"Stop failed: {e}")
            return False
    
    async def get_agent_status(self, agent_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed agent status"""
        if agent_id not in self.agents:
            return None
        
        agent = self.agents[agent_id]
        
        # Get recent metrics
        async with self.db.cursor() as cursor:
            cursor.execute("""
                SELECT metric_type, metric_name, value, timestamp
                FROM agent_metrics
                WHERE agent_id = %s AND timestamp > %s
                ORDER BY timestamp DESC
                LIMIT 50
            """, (agent_id, datetime.utcnow() - timedelta(minutes=5)))
            
            metrics = cursor.fetchall()
        
        # Get active tasks
        active_tasks = [t for t in self.active_tasks.values() if t.agent_id == agent_id]
        
        return {
            'id': agent.id,
            'agent_type': agent.agent_type,
            'status': agent.status.value,
            'created_at': agent.created_at.isoformat(),
            'last_active': agent.last_active.isoformat() if agent.last_active else None,
            'config': agent.config,
            'metrics': [dict(m) for m in metrics],
            'active_tasks': len(active_tasks),
            'error_message': agent.error_message
        }
    
    async def list_agents(self, agent_type: Optional[str] = None, status: Optional[AgentStatus] = None) -> List[Dict[str, Any]]:
        """List agents with optional filtering"""
        agents = []
        
        for agent in self.agents.values():
            if agent_type and agent.agent_type != agent_type:
                continue
            if status and agent.status != status:
                continue
            
            agents.append({
                'id': agent.id,
                'agent_type': agent.agent_type,
                'status': agent.status.value,
                'created_at': agent.created_at.isoformat(),
                'last_active': agent.last_active.isoformat() if agent.last_active else None
            })
        
        return agents
    
    async def distribute_task(self, task: Task) -> bool:
        """Distribute task to appropriate agent"""
        # Find available agent of required type
        target_agent = None
        for agent_id, agent in self.agents.items():
            if (agent.agent_type == task.task_type.split('_')[0] and  # Match task to agent type
                agent.status == AgentStatus.RUNNING):
                target_agent = agent_id
                break
        
        if not target_agent:
            logger.warning(f"⚠️ No available agent for task {task.id} of type {task.task_type}")
            return False
        
        # Assign task to agent
        task.agent_id = target_agent
        task.status = TaskStatus.ASSIGNED
        
        # Store in database
        async with self.db.cursor() as cursor:
            cursor.execute("""
                INSERT INTO agent_tasks 
                (id, agent_id, task_type, priority, payload, status, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (task.id, task.agent_id, task.task_type, task.priority,
                  json.dumps(task.payload), task.status.value, task.created_at))
        
        # Add to priority queue
        self.task_queue[task.priority].append(task)
        
        # Send to Redis for immediate processing
        await self.redis_client.lpush(f"tasks:{target_agent}", json.dumps(asdict(task)))
        
        logger.info(f"📤 Task {task.id} distributed to agent {target_agent}")
        return True
    
    async def _health_monitor_loop(self):
        """Continuous health monitoring of agents"""
        while True:
            try:
                for agent_id, agent in self.agents.items():
                    if agent.status == AgentStatus.RUNNING:
                        await self._check_agent_health(agent_id)
                
                await asyncio.sleep(self.health_check_interval)
                
            except Exception as e:
                logger.error(f"❌ Health monitor error: {e}")
                await asyncio.sleep(5)
    
    async def _task_processor_loop(self):
        """Process tasks from priority queues"""
        while True:
            try:
                # Process tasks by priority (1 = highest, 10 = lowest)
                for priority in range(1, 11):
                    if self.task_queue[priority]:
                        task = self.task_queue[priority].pop(0)
                        await self._execute_task(task)
                
                await asyncio.sleep(1)  # Small delay to prevent CPU spinning
                
            except Exception as e:
                logger.error(f"❌ Task processor error: {e}")
                await asyncio.sleep(5)
    
    async def _check_agent_health(self, agent_id: str):
        """Check individual agent health"""
        try:
            if agent_id not in self.agent_processes:
                return
            
            process = self.agent_processes[agent_id]
            health_data = await process.health_check()
            
            # Record health metrics
            await self._record_metric(agent_id, "performance", "response_time_ms", health_data.get('response_time', 0))
            await self._record_metric(agent_id, "resource_usage", "cpu_percent", health_data.get('cpu_usage', 0))
            await self._record_metric(agent_id, "resource_usage", "memory_mb", health_data.get('memory_usage', 0))
            
            # Update last active
            self.agents[agent_id].last_active = datetime.utcnow()
            
            # Store health check
            async with self.db.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO agent_health_checks 
                    (agent_id, health_status, response_time_ms, cpu_usage, memory_usage_mb)
                    VALUES (%s, %s, %s, %s, %s)
                """, (agent_id, health_data.get('status', 'healthy'),
                      health_data.get('response_time', 0),
                      health_data.get('cpu_usage', 0),
                      health_data.get('memory_usage', 0)))
            
        except Exception as e:
            logger.warning(f"⚠️ Health check failed for agent {agent_id}: {e}")
            await self._update_agent_status(agent_id, AgentStatus.ERROR, str(e))
    
    async def _execute_task(self, task: Task):
        """Execute a task through Celery"""
        try:
            task.status = TaskStatus.RUNNING
            task.started_at = datetime.utcnow()
            self.active_tasks[task.id] = task
            
            # Update in database
            async with self.db.cursor() as cursor:
                cursor.execute("""
                    UPDATE agent_tasks 
                    SET status = %s, started_at = %s
                    WHERE id = %s
                """, (task.status.value, task.started_at, task.id))
            
            # Execute via Celery
            celery_task = self.celery_app.send_task(
                f'agents.{task.task_type}',
                args=[task.payload],
                kwargs={'task_id': task.id}
            )
            
            # Wait for completion with timeout
            result = await asyncio.wait_for(
                asyncio.to_thread(celery_task.get),
                timeout=self.task_timeout
            )
            
            # Mark as completed
            await self._complete_task(task.id, result)
            
        except asyncio.TimeoutError:
            logger.error(f"⏰ Task {task.id} timed out")
            await self._fail_task(task.id, "Task execution timeout")
            
        except Exception as e:
            logger.error(f"❌ Task {task.id} execution failed: {e}")
            await self._fail_task(task.id, str(e))
    
    async def _complete_task(self, task_id: str, result: Any):
        """Mark task as completed"""
        if task_id not in self.active_tasks:
            return
        
        task = self.active_tasks[task_id]
        task.status = TaskStatus.COMPLETED
        task.completed_at = datetime.utcnow()
        task.result = result
        
        # Update database
        async with self.db.cursor() as cursor:
            cursor.execute("""
                UPDATE agent_tasks 
                SET status = %s, completed_at = %s, result = %s
                WHERE id = %s
            """, (task.status.value, task.completed_at, json.dumps(result), task_id))
        
        # Remove from active tasks
        del self.active_tasks[task_id]
        
        logger.info(f"✅ Task {task_id} completed successfully")
    
    async def _fail_task(self, task_id: str, error_message: str):
        """Mark task as failed and handle retry logic"""
        if task_id not in self.active_tasks:
            return
        
        task = self.active_tasks[task_id]
        task.retry_count += 1
        
        if task.retry_count < task.max_retries:
            # Retry task
            task.status = TaskStatus.RETRYING
            self.task_queue[task.priority].append(task)
            logger.info(f"🔄 Task {task_id} scheduled for retry ({task.retry_count}/{task.max_retries})")
        else:
            # Mark as failed
            task.status = TaskStatus.FAILED
            task.error_message = error_message
            del self.active_tasks[task_id]
            logger.error(f"❌ Task {task_id} failed permanently: {error_message}")
        
        # Update database
        async with self.db.cursor() as cursor:
            cursor.execute("""
                UPDATE agent_tasks 
                SET status = %s, error_message = %s, retry_count = %s
                WHERE id = %s
            """, (task.status.value, error_message, task.retry_count, task_id))
    
    async def _update_agent_status(self, agent_id: str, status: AgentStatus, error_message: str = None):
        """Update agent status in memory and database"""
        if agent_id in self.agents:
            self.agents[agent_id].status = status
            self.agents[agent_id].error_message = error_message
        
        async with self.db.cursor() as cursor:
            cursor.execute("""
                UPDATE agent_instances 
                SET status = %s, last_active = %s
                WHERE id = %s
            """, (status.value, datetime.utcnow(), agent_id))
    
    async def _log_agent_event(self, agent_id: str, level: str, message: str, metadata: Dict = None):
        """Log agent event to database"""
        async with self.db.cursor() as cursor:
            cursor.execute("""
                INSERT INTO agent_logs (agent_id, level, message, metadata, correlation_id)
                VALUES (%s, %s, %s, %s, %s)
            """, (agent_id, level, message, json.dumps(metadata or {}), str(uuid.uuid4())))
    
    async def _record_metric(self, agent_id: str, metric_type: str, metric_name: str, value: float):
        """Record performance metric"""
        async with self.db.cursor() as cursor:
            cursor.execute("""
                INSERT INTO agent_metrics (agent_id, metric_type, metric_name, value)
                VALUES (%s, %s, %s, %s)
            """, (agent_id, metric_type, metric_name, value))
    
    async def _cancel_agent_tasks(self, agent_id: str):
        """Cancel all active tasks for an agent"""
        cancelled_tasks = []
        for task_id, task in list(self.active_tasks.items()):
            if task.agent_id == agent_id:
                task.status = TaskStatus.CANCELLED
                cancelled_tasks.append(task_id)
                del self.active_tasks[task_id]
        
        if cancelled_tasks:
            async with self.db.cursor() as cursor:
                cursor.execute("""
                    UPDATE agent_tasks 
                    SET status = %s
                    WHERE id = ANY(%s)
                """, (TaskStatus.CANCELLED.value, cancelled_tasks))
    
    async def _restart_agent(self, agent: AgentInstance):
        """Restart an existing agent"""
        logger.info(f"🔄 Restarting agent {agent.id}")
        config = AgentConfig(
            agent_type=agent.agent_type,
            config=agent.config,
            capabilities=[],
            resource_limits={}
        )
        await self.start_agent(agent.id)
    
    async def shutdown(self):
        """Graceful shutdown of orchestrator"""
        logger.info("🛑 Shutting down Agent Orchestrator")
        
        # Stop all agents
        for agent_id in list(self.agents.keys()):
            await self.stop_agent(agent_id, graceful=True)
        
        # Close connections
        if self.redis_client:
            await self.redis_client.close()
        await self.db.close()
        
        logger.info("✅ Agent Orchestrator shutdown complete")

# Singleton instance
orchestrator = None

async def get_orchestrator() -> AgentOrchestrator:
    """Get global orchestrator instance"""
    global orchestrator
    if orchestrator is None:
        orchestrator = AgentOrchestrator()
        await orchestrator.initialize()
    return orchestrator