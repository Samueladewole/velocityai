"""
Continuous monitoring and scheduling service for ERIP AI Agents.
Manages periodic evidence collection, Trust Score updates, and compliance monitoring.
"""

import asyncio
import json
from typing import Dict, List, Any, Optional, Callable
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from enum import Enum
import structlog
from celery import Celery
from celery.schedules import crontab
import redis
from .database import DatabaseManager, Customer, Agent, ScheduledTask
from .monitoring_service import MonitoringService, AlertSeverity
from ..workflows.aws_workflows import collect_aws_evidence
from ..workflows.google_workspace_workflows import collect_google_workspace_evidence
from ..workflows.github_workflows import collect_github_evidence, collect_gitlab_evidence

logger = structlog.get_logger()

class ScheduleType(Enum):
    CONTINUOUS = "continuous"      # Every 4 hours
    DAILY = "daily"               # Once per day
    WEEKLY = "weekly"             # Once per week
    MONTHLY = "monthly"           # Once per month
    ON_DEMAND = "on_demand"       # Manual trigger only

class TaskStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"

@dataclass
class ScheduledCollection:
    customer_id: str
    platform: str  # aws, gcp, azure, github, gitlab, google_workspace
    framework_id: str
    schedule_type: ScheduleType
    next_run: datetime
    last_run: Optional[datetime] = None
    task_id: Optional[str] = None
    status: TaskStatus = TaskStatus.PENDING
    retry_count: int = 0
    max_retries: int = 3
    configuration: Dict[str, Any] = None
    metadata: Dict[str, Any] = None

class ContinuousScheduler:
    """Manages continuous monitoring and scheduled evidence collection"""
    
    def __init__(self, celery_app: Celery, db_manager: DatabaseManager, redis_client: redis.Redis):
        self.celery = celery_app
        self.db = db_manager
        self.redis = redis_client
        self.monitoring = MonitoringService(db_manager, redis_client)
        self.scheduled_collections: Dict[str, ScheduledCollection] = {}
        self.is_running = False
        
        # Schedule configurations
        self.schedule_intervals = {
            ScheduleType.CONTINUOUS: timedelta(hours=4),
            ScheduleType.DAILY: timedelta(days=1),
            ScheduleType.WEEKLY: timedelta(weeks=1),
            ScheduleType.MONTHLY: timedelta(days=30)
        }
        
        # Platform-specific collection functions
        self.collection_tasks = {
            'aws': self._schedule_aws_collection,
            'gcp': self._schedule_gcp_collection,
            'azure': self._schedule_azure_collection,
            'github': self._schedule_github_collection,
            'gitlab': self._schedule_gitlab_collection,
            'google_workspace': self._schedule_google_workspace_collection
        }
    
    async def start_scheduler(self):
        """Start the continuous monitoring scheduler"""
        if self.is_running:
            logger.warning("Scheduler already running")
            return
        
        self.is_running = True
        logger.info("Starting continuous monitoring scheduler")
        
        # Load existing scheduled collections from database
        await self._load_scheduled_collections()
        
        # Start the main scheduler loop
        while self.is_running:
            try:
                await self._process_scheduled_collections()
                await self._cleanup_completed_tasks()
                await self._update_trust_scores()
                
                # Wait 60 seconds before next check
                await asyncio.sleep(60)
                
            except Exception as e:
                logger.error("Error in scheduler loop", error=str(e))
                await asyncio.sleep(60)  # Continue after error
    
    async def stop_scheduler(self):
        """Stop the continuous monitoring scheduler"""
        self.is_running = False
        logger.info("Stopping continuous monitoring scheduler")
    
    async def schedule_collection(self, 
                                customer_id: str, 
                                platform: str, 
                                framework_id: str,
                                schedule_type: ScheduleType,
                                configuration: Dict[str, Any]) -> str:
        """Schedule a new evidence collection"""
        
        collection_id = f"{customer_id}_{platform}_{framework_id}_{schedule_type.value}"
        
        # Calculate next run time
        if schedule_type == ScheduleType.ON_DEMAND:
            next_run = datetime.now()
        else:
            next_run = datetime.now() + self.schedule_intervals[schedule_type]
        
        scheduled_collection = ScheduledCollection(
            customer_id=customer_id,
            platform=platform,
            framework_id=framework_id,
            schedule_type=schedule_type,
            next_run=next_run,
            configuration=configuration,
            metadata={'created_at': datetime.now().isoformat()}
        )
        
        # Store in memory and database
        self.scheduled_collections[collection_id] = scheduled_collection
        await self._save_scheduled_collection(collection_id, scheduled_collection)
        
        logger.info("Scheduled new collection", 
                   collection_id=collection_id,
                   platform=platform,
                   schedule_type=schedule_type.value,
                   next_run=next_run.isoformat())
        
        return collection_id
    
    async def cancel_collection(self, collection_id: str) -> bool:
        """Cancel a scheduled collection"""
        
        if collection_id in self.scheduled_collections:
            collection = self.scheduled_collections[collection_id]
            
            # Cancel running task if exists
            if collection.task_id and collection.status == TaskStatus.RUNNING:
                self.celery.control.revoke(collection.task_id, terminate=True)
            
            # Remove from memory and database
            del self.scheduled_collections[collection_id]
            await self._delete_scheduled_collection(collection_id)
            
            logger.info("Cancelled scheduled collection", collection_id=collection_id)
            return True
        
        return False
    
    async def get_collection_status(self, collection_id: str) -> Optional[Dict[str, Any]]:
        """Get status of a scheduled collection"""
        
        if collection_id in self.scheduled_collections:
            collection = self.scheduled_collections[collection_id]
            return {
                'collection_id': collection_id,
                'customer_id': collection.customer_id,
                'platform': collection.platform,
                'framework_id': collection.framework_id,
                'schedule_type': collection.schedule_type.value,
                'status': collection.status.value,
                'next_run': collection.next_run.isoformat(),
                'last_run': collection.last_run.isoformat() if collection.last_run else None,
                'retry_count': collection.retry_count,
                'task_id': collection.task_id
            }
        
        return None
    
    async def list_customer_collections(self, customer_id: str) -> List[Dict[str, Any]]:
        """List all collections for a customer"""
        
        customer_collections = []
        for collection_id, collection in self.scheduled_collections.items():
            if collection.customer_id == customer_id:
                status = await self.get_collection_status(collection_id)
                if status:
                    customer_collections.append(status)
        
        return customer_collections
    
    async def trigger_immediate_collection(self, collection_id: str) -> Optional[str]:
        """Trigger an immediate collection run"""
        
        if collection_id in self.scheduled_collections:
            collection = self.scheduled_collections[collection_id]
            
            # Don't trigger if already running
            if collection.status == TaskStatus.RUNNING:
                logger.warning("Collection already running", collection_id=collection_id)
                return None
            
            # Execute the collection
            task_id = await self._execute_collection(collection_id, collection)
            return task_id
        
        return None
    
    async def _process_scheduled_collections(self):
        """Process all scheduled collections that are due"""
        
        current_time = datetime.now()
        
        for collection_id, collection in self.scheduled_collections.items():
            # Skip if not due yet
            if current_time < collection.next_run:
                continue
            
            # Skip if already running
            if collection.status == TaskStatus.RUNNING:
                continue
            
            # Skip if failed too many times
            if collection.retry_count >= collection.max_retries:
                logger.error("Collection exceeded max retries", 
                           collection_id=collection_id,
                           retry_count=collection.retry_count)
                collection.status = TaskStatus.FAILED
                continue
            
            # Execute the collection
            try:
                task_id = await self._execute_collection(collection_id, collection)
                if task_id:
                    collection.task_id = task_id
                    collection.status = TaskStatus.RUNNING
                    collection.last_run = current_time
                    
                    # Schedule next run
                    if collection.schedule_type != ScheduleType.ON_DEMAND:
                        collection.next_run = current_time + self.schedule_intervals[collection.schedule_type]
                    
                    await self._save_scheduled_collection(collection_id, collection)
                    
            except Exception as e:
                logger.error("Failed to execute collection", 
                           collection_id=collection_id,
                           error=str(e))
                
                collection.retry_count += 1
                collection.status = TaskStatus.RETRYING
                collection.next_run = current_time + timedelta(minutes=30)  # Retry in 30 minutes
    
    async def _execute_collection(self, collection_id: str, collection: ScheduledCollection) -> Optional[str]:
        """Execute a collection based on platform"""
        
        platform = collection.platform
        if platform not in self.collection_tasks:
            logger.error("Unknown platform", platform=platform)
            return None
        
        # Get the platform-specific scheduling function
        schedule_func = self.collection_tasks[platform]
        
        try:
            task_id = await schedule_func(collection)
            
            logger.info("Executed collection", 
                       collection_id=collection_id,
                       platform=platform,
                       task_id=task_id)
            
            return task_id
            
        except Exception as e:
            logger.error("Failed to execute collection", 
                       collection_id=collection_id,
                       platform=platform,
                       error=str(e))
            return None
    
    async def _schedule_aws_collection(self, collection: ScheduledCollection) -> str:
        """Schedule AWS evidence collection"""
        
        config = collection.configuration
        task = collect_aws_evidence.delay(
            customer_id=collection.customer_id,
            access_key_id=config['access_key_id'],
            secret_access_key=config['secret_access_key'],
            region=config.get('region', 'us-east-1'),
            framework_id=collection.framework_id
        )
        
        return task.id
    
    async def _schedule_gcp_collection(self, collection: ScheduledCollection) -> str:
        """Schedule GCP evidence collection"""
        
        # Would implement GCP-specific collection
        # For now, return a placeholder
        return f"gcp_task_{collection.customer_id}_{datetime.now().timestamp()}"
    
    async def _schedule_azure_collection(self, collection: ScheduledCollection) -> str:
        """Schedule Azure evidence collection"""
        
        # Would implement Azure-specific collection
        # For now, return a placeholder
        return f"azure_task_{collection.customer_id}_{datetime.now().timestamp()}"
    
    async def _schedule_github_collection(self, collection: ScheduledCollection) -> str:
        """Schedule GitHub evidence collection"""
        
        config = collection.configuration
        task = collect_github_evidence.delay(
            customer_id=collection.customer_id,
            access_token=config['access_token'],
            organization=config.get('organization'),
            framework_id=collection.framework_id
        )
        
        return task.id
    
    async def _schedule_gitlab_collection(self, collection: ScheduledCollection) -> str:
        """Schedule GitLab evidence collection"""
        
        config = collection.configuration
        task = collect_gitlab_evidence.delay(
            customer_id=collection.customer_id,
            access_token=config['access_token'],
            gitlab_url=config.get('gitlab_url', 'https://gitlab.com'),
            group_id=config.get('group_id'),
            framework_id=collection.framework_id
        )
        
        return task.id
    
    async def _schedule_google_workspace_collection(self, collection: ScheduledCollection) -> str:
        """Schedule Google Workspace evidence collection"""
        
        config = collection.configuration
        task = collect_google_workspace_evidence.delay(
            customer_id=collection.customer_id,
            credentials_dict=config['credentials'],
            framework_id=collection.framework_id
        )
        
        return task.id
    
    async def _cleanup_completed_tasks(self):
        """Clean up completed and failed tasks"""
        
        for collection_id, collection in list(self.scheduled_collections.items()):
            if collection.task_id and collection.status == TaskStatus.RUNNING:
                # Check task status with Celery
                try:
                    task_result = self.celery.AsyncResult(collection.task_id)
                    
                    if task_result.successful():
                        collection.status = TaskStatus.COMPLETED
                        collection.retry_count = 0  # Reset retry count on success
                        await self._save_scheduled_collection(collection_id, collection)
                        
                        # Send success notification
                        await self.monitoring.record_metric(
                            'evidence_collection_success',
                            1.0,
                            customer_id=collection.customer_id,
                            platform=collection.platform
                        )
                        
                    elif task_result.failed():
                        collection.status = TaskStatus.FAILED
                        collection.retry_count += 1
                        
                        # Schedule retry if under max retries
                        if collection.retry_count < collection.max_retries:
                            collection.status = TaskStatus.RETRYING
                            collection.next_run = datetime.now() + timedelta(minutes=30)
                        
                        await self._save_scheduled_collection(collection_id, collection)
                        
                        # Send failure alert
                        await self.monitoring.send_alert(
                            AlertSeverity.MEDIUM,
                            f"Evidence collection failed for {collection.platform}",
                            {
                                'customer_id': collection.customer_id,
                                'platform': collection.platform,
                                'retry_count': collection.retry_count,
                                'error': str(task_result.result) if task_result.result else 'Unknown error'
                            }
                        )
                        
                except Exception as e:
                    logger.error("Error checking task status", 
                               collection_id=collection_id,
                               task_id=collection.task_id,
                               error=str(e))
    
    async def _update_trust_scores(self):
        """Periodically update Trust Scores based on new evidence"""
        
        # Run Trust Score updates every 30 minutes
        last_trust_score_update = await self.redis.get('last_trust_score_update')
        
        if last_trust_score_update:
            last_update = datetime.fromisoformat(last_trust_score_update.decode())
            if datetime.now() - last_update < timedelta(minutes=30):
                return
        
        try:
            # Get all customers with active collections
            active_customers = set()
            for collection in self.scheduled_collections.values():
                if collection.status in [TaskStatus.COMPLETED, TaskStatus.RUNNING]:
                    active_customers.add(collection.customer_id)
            
            # Update Trust Scores for active customers
            for customer_id in active_customers:
                try:
                    # This would call the Trust Score engine
                    # For now, just record the update attempt
                    await self.monitoring.record_metric(
                        'trust_score_update',
                        1.0,
                        customer_id=customer_id
                    )
                    
                except Exception as e:
                    logger.error("Failed to update Trust Score", 
                               customer_id=customer_id,
                               error=str(e))
            
            # Update the last update timestamp
            await self.redis.set('last_trust_score_update', datetime.now().isoformat())
            
            logger.info("Completed Trust Score updates", customer_count=len(active_customers))
            
        except Exception as e:
            logger.error("Error updating Trust Scores", error=str(e))
    
    async def _load_scheduled_collections(self):
        """Load scheduled collections from database"""
        
        try:
            # In a real implementation, this would query the database
            # For now, just log that we're loading
            logger.info("Loading scheduled collections from database")
            
            # Placeholder: In production, this would:
            # 1. Query the database for all active scheduled collections
            # 2. Reconstruct ScheduledCollection objects
            # 3. Add them to self.scheduled_collections
            
        except Exception as e:
            logger.error("Failed to load scheduled collections", error=str(e))
    
    async def _save_scheduled_collection(self, collection_id: str, collection: ScheduledCollection):
        """Save scheduled collection to database"""
        
        try:
            # Store in Redis for quick access
            collection_data = asdict(collection)
            # Convert datetime objects to ISO strings for JSON serialization
            collection_data['next_run'] = collection.next_run.isoformat()
            if collection.last_run:
                collection_data['last_run'] = collection.last_run.isoformat()
            collection_data['schedule_type'] = collection.schedule_type.value
            collection_data['status'] = collection.status.value
            
            await self.redis.hset(
                'scheduled_collections',
                collection_id,
                json.dumps(collection_data)
            )
            
            logger.debug("Saved scheduled collection", collection_id=collection_id)
            
        except Exception as e:
            logger.error("Failed to save scheduled collection", 
                       collection_id=collection_id,
                       error=str(e))
    
    async def _delete_scheduled_collection(self, collection_id: str):
        """Delete scheduled collection from database"""
        
        try:
            await self.redis.hdel('scheduled_collections', collection_id)
            logger.debug("Deleted scheduled collection", collection_id=collection_id)
            
        except Exception as e:
            logger.error("Failed to delete scheduled collection", 
                       collection_id=collection_id,
                       error=str(e))

# Global scheduler instance
scheduler_instance: Optional[ContinuousScheduler] = None

async def get_scheduler() -> ContinuousScheduler:
    """Get the global scheduler instance"""
    global scheduler_instance
    
    if scheduler_instance is None:
        from .celery_app import app as celery_app
        from .database import get_db_manager
        
        db_manager = await get_db_manager()
        redis_client = redis.from_url('redis://localhost:6379/0')
        
        scheduler_instance = ContinuousScheduler(celery_app, db_manager, redis_client)
    
    return scheduler_instance

# Celery beat schedule for periodic tasks
celery_beat_schedule = {
    'continuous-evidence-collection': {
        'task': 'agents.core.scheduler_service.process_scheduled_collections',
        'schedule': crontab(minute='*/5'),  # Every 5 minutes
    },
    'trust-score-updates': {
        'task': 'agents.core.scheduler_service.update_trust_scores',
        'schedule': crontab(minute='*/30'),  # Every 30 minutes
    },
    'cleanup-completed-tasks': {
        'task': 'agents.core.scheduler_service.cleanup_tasks',
        'schedule': crontab(minute='*/15'),  # Every 15 minutes
    },
}