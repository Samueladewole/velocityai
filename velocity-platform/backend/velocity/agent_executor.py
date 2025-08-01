"""
Velocity AI Platform - Agent Execution System
Real AI agent execution with cloud platform integration
"""
import asyncio
import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional
import json
import traceback
import uuid
from dataclasses import dataclass

from sqlalchemy.orm import Session
from models import (
    Agent, AgentExecutionLog, EvidenceItem, Integration,
    AgentStatus, EvidenceType, EvidenceStatus, Platform, Framework
)
from database import SessionLocal
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'agents'))
from aws_evidence_collector import AWSEvidenceCollector

logger = logging.getLogger(__name__)

@dataclass
class ExecutionResult:
    success: bool
    evidence_collected: int
    errors: List[str]
    execution_time: float
    performance_metrics: Dict[str, Any]

class AgentExecutor:
    """Manages AI agent execution and scheduling"""
    
    def __init__(self):
        # self.cloud_manager = CloudIntegrationManager()  # Temporarily disabled
        self.running_agents: Dict[str, asyncio.Task] = {}
        self.scheduler_task: Optional[asyncio.Task] = None
        self._shutdown = False
    
    async def start_scheduler(self):
        """Start the agent scheduler"""
        logger.info("Starting agent scheduler...")
        self.scheduler_task = asyncio.create_task(self._scheduler_loop())
    
    async def stop_scheduler(self):
        """Stop the agent scheduler"""
        logger.info("Stopping agent scheduler...")
        self._shutdown = True
        if self.scheduler_task:
            self.scheduler_task.cancel()
            try:
                await self.scheduler_task
            except asyncio.CancelledError:
                pass
        
        # Cancel all running agents
        for task in self.running_agents.values():
            task.cancel()
        
        if self.running_agents:
            await asyncio.gather(*self.running_agents.values(), return_exceptions=True)
    
    async def _scheduler_loop(self):
        """Main scheduler loop"""
        while not self._shutdown:
            try:
                await self._check_scheduled_agents()
                await asyncio.sleep(60)  # Check every minute
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Scheduler error: {e}")
                await asyncio.sleep(60)
    
    async def _check_scheduled_agents(self):
        """Check for agents that need to be executed"""
        db = SessionLocal()
        try:
            now = datetime.now(timezone.utc)
            
            # Find agents that should run
            agents_to_run = db.query(Agent).filter(
                Agent.next_run <= now,
                Agent.status.in_([AgentStatus.IDLE, AgentStatus.COMPLETED])
            ).all()
            
            for agent in agents_to_run:
                if str(agent.id) not in self.running_agents:
                    logger.info(f"Scheduling agent {agent.name} for execution")
                    await self.schedule_agent_execution(str(agent.id))
        
        finally:
            db.close()
    
    async def schedule_agent_execution(self, agent_id: str):
        """Schedule an agent for execution"""
        if agent_id in self.running_agents:
            logger.warning(f"Agent {agent_id} is already running")
            return
        
        task = asyncio.create_task(self.execute_agent(agent_id))
        self.running_agents[agent_id] = task
        
        # Clean up completed task
        def cleanup(task):
            if agent_id in self.running_agents:
                del self.running_agents[agent_id]
        
        task.add_done_callback(cleanup)
    
    async def execute_agent(self, agent_id: str) -> ExecutionResult:
        """Execute a single agent"""
        execution_id = str(uuid.uuid4())
        start_time = datetime.now(timezone.utc)
        db = SessionLocal()
        
        try:
            # Get agent and integration
            agent = db.query(Agent).filter(Agent.id == agent_id).first()
            if not agent:
                raise Exception(f"Agent {agent_id} not found")
            
            integration = db.query(Integration).filter(
                Integration.id == agent.integration_id
            ).first()
            if not integration:
                raise Exception(f"Integration for agent {agent_id} not found")
            
            logger.info(f"Executing agent {agent.name} (ID: {agent_id})")
            
            # Update agent status
            agent.status = AgentStatus.RUNNING
            agent.last_run = start_time
            db.commit()
            
            # Create execution log
            execution_log = AgentExecutionLog(
                agent_id=agent.id,
                execution_id=execution_id,
                started_at=start_time,
                status=AgentStatus.RUNNING,
                logs=[]
            )
            db.add(execution_log)
            db.commit()
            
            # Execute agent based on platform and framework
            result = await self._execute_agent_workflow(agent, integration, execution_log, db)
            
            # Update completion status
            completion_time = datetime.now(timezone.utc)
            execution_time = (completion_time - start_time).total_seconds()
            
            agent.status = AgentStatus.COMPLETED if result.success else AgentStatus.ERROR
            agent.evidence_collected += result.evidence_collected
            agent.avg_collection_time = execution_time
            agent.success_rate = self._calculate_success_rate(agent, result.success)
            agent.next_run = self._calculate_next_run(agent)
            
            execution_log.completed_at = completion_time
            execution_log.status = agent.status
            execution_log.evidence_collected = result.evidence_collected
            execution_log.errors_encountered = len(result.errors)
            execution_log.execution_time = execution_time
            execution_log.performance_metrics = result.performance_metrics
            
            if result.errors:
                execution_log.error_details = {"errors": result.errors}
            
            db.commit()
            
            logger.info(f"Agent {agent.name} completed: {result.evidence_collected} evidence items collected")
            return result
            
        except Exception as e:
            logger.error(f"Agent execution failed: {e}")
            logger.error(traceback.format_exc())
            
            # Update error status
            if 'agent' in locals():
                agent.status = AgentStatus.ERROR
                agent.next_run = datetime.now(timezone.utc) + timedelta(hours=1)  # Retry in 1 hour
                db.commit()
            
            return ExecutionResult(
                success=False,
                evidence_collected=0,
                errors=[str(e)],
                execution_time=0.0,
                performance_metrics={}
            )
        
        finally:
            db.close()
    
    async def _execute_agent_workflow(
        self, 
        agent: Agent, 
        integration: Integration, 
        execution_log: AgentExecutionLog, 
        db: Session
    ) -> ExecutionResult:
        """Execute the actual agent workflow"""
        evidence_collected = 0
        errors = []
        performance_metrics = {}
        
        try:
            # Execute based on platform
            if agent.platform == Platform.AWS:
                result = await self._execute_aws_agent(agent, integration, db)
            elif agent.platform == Platform.GCP:
                result = await self._execute_gcp_agent(agent, integration, db)
            elif agent.platform == Platform.AZURE:
                result = await self._execute_azure_agent(agent, integration, db)
            elif agent.platform == Platform.GITHUB:
                result = await self._execute_github_agent(agent, integration, db)
            else:
                raise Exception(f"Unsupported platform: {agent.platform}")
            
            evidence_collected = result.get("evidence_collected", 0)
            performance_metrics = result.get("performance_metrics", {})
            
            # Add log entry
            execution_log.logs.append({
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "level": "INFO",
                "message": f"Collected {evidence_collected} evidence items"
            })
            
            return ExecutionResult(
                success=True,
                evidence_collected=evidence_collected,
                errors=errors,
                execution_time=0.0,
                performance_metrics=performance_metrics
            )
            
        except Exception as e:
            errors.append(str(e))
            
            # Add error log entry
            execution_log.logs.append({
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "level": "ERROR",
                "message": str(e)
            })
            
            raise e
    
    async def _execute_aws_agent(self, agent: Agent, integration: Integration, db: Session) -> Dict[str, Any]:
        """
        Execute AWS Evidence Collector Agent with real boto3 integration
        
        This method now uses the actual AWSEvidenceCollector class to collect
        real compliance evidence from AWS services including IAM, CloudTrail,
        Security Groups, S3, and Config rules.
        
        Args:
            agent: The AWS agent configuration
            integration: AWS integration with encrypted credentials
            db: Database session for storing evidence
            
        Returns:
            Dict containing evidence collection results and performance metrics
        """
        try:
            # Decrypt and prepare AWS credentials
            from security import decrypt_credentials
            credentials = decrypt_credentials(integration.credentials)
            
            # Initialize AWS Evidence Collector with real credentials
            aws_collector = AWSEvidenceCollector(credentials)
            
            # Test connection first
            connection_test = await aws_collector.test_connection()
            if not connection_test["success"]:
                raise Exception(f"AWS connection failed: {connection_test.get('error', 'Unknown error')}")
            
            # Collect all evidence types based on framework requirements
            collection_result = await aws_collector.collect_all_evidence()
            
            # Store evidence items in database
            evidence_items_created = 0
            for evidence_data in collection_result.get("evidence_items", []):
                try:
                    # Create evidence item in database
                    evidence_item = EvidenceItem(
                        title=f"AWS {evidence_data['type'].replace('_', ' ').title()}",
                        description=f"AWS compliance evidence: {evidence_data['resource_name']}",
                        evidence_type=EvidenceType.API_RESPONSE,
                        status=EvidenceStatus.PENDING,
                        framework=agent.framework,
                        platform=Platform.AWS,
                        control_id=evidence_data.get("control_id", "AUTO-GENERATED"),
                        data=evidence_data["data"],
                        evidence_metadata={
                            "aws_resource_id": evidence_data["resource_id"],
                            "aws_resource_type": evidence_data["type"],
                            "collection_timestamp": evidence_data["collected_at"],
                            "agent_id": str(agent.id),
                            "integration_id": str(integration.id)
                        },
                        confidence_score=evidence_data.get("confidence_score", 0.85),
                        trust_points=10,  # Base trust points for AWS evidence
                        organization_id=agent.organization_id,
                        agent_id=agent.id
                    )
                    
                    db.add(evidence_item)
                    evidence_items_created += 1
                    
                except Exception as e:
                    logger.warning(f"Failed to create evidence item: {e}")
            
            # Commit all evidence items to database
            db.commit()
            
            logger.info(f"AWS Agent completed successfully: {evidence_items_created} evidence items stored")
            
            return {
                "success": True,
                "evidence_collected": evidence_items_created,
                "collection_results": collection_result.get("collection_results", {}),
                "aws_account_id": connection_test.get("account_id"),
                "performance_metrics": {
                    "total_api_calls": sum(result.get("count", 0) for result in collection_result.get("collection_results", {}).values()),
                    "successful_collections": collection_result.get("successful_collections", 0),
                    "automation_rate": collection_result.get("automation_rate", 98.5),
                    "confidence_score": collection_result.get("confidence_score", 0.91),
                    "collection_time_seconds": (datetime.now(timezone.utc) - datetime.fromisoformat(collection_result.get("collected_at", datetime.now(timezone.utc).isoformat()).replace('Z', '+00:00'))).total_seconds()
                }
            }
            
        except Exception as e:
            logger.error(f"AWS agent execution failed: {e}")
            raise e
    
    async def _execute_gcp_agent(self, agent: Agent, integration: Integration, db: Session) -> Dict[str, Any]:
        """
        Execute GCP Evidence Collector Agent
        
        TODO: Implement real GCP evidence collection using google-cloud-* libraries
        This is a placeholder that should be replaced with actual GCP API calls
        similar to the AWS implementation above.
        """
        logger.warning("GCP agent not yet implemented - returning placeholder data")
        return {
            "success": False,
            "evidence_collected": 0,
            "error": "GCP agent implementation pending",
            "performance_metrics": {}
        }
    
    
    async def _execute_azure_agent(self, agent: Agent, integration: Integration, db: Session) -> Dict[str, Any]:
        """
        Execute Azure Evidence Collector Agent
        
        TODO: Implement real Azure evidence collection using azure-* libraries
        This is a placeholder that should be replaced with actual Azure API calls.
        """
        logger.warning("Azure agent not yet implemented - returning placeholder data")
        return {
            "success": False,
            "evidence_collected": 0,
            "error": "Azure agent implementation pending",
            "performance_metrics": {}
        }
    
    async def _execute_github_agent(self, agent: Agent, integration: Integration, db: Session) -> Dict[str, Any]:
        """
        Execute GitHub Security Analyzer Agent
        
        TODO: Implement real GitHub security analysis using PyGithub or GitHub API
        This is a placeholder that should be replaced with actual GitHub API calls.
        """
        logger.warning("GitHub agent not yet implemented - returning placeholder data")
        return {
            "success": False,
            "evidence_collected": 0,
            "error": "GitHub agent implementation pending",
            "performance_metrics": {}
        }
    
    def _calculate_success_rate(self, agent: Agent, current_success: bool) -> float:
        """Calculate rolling success rate"""
        # Simple implementation - in production, would use more sophisticated tracking
        if agent.success_rate == 0.0:
            return 1.0 if current_success else 0.0
        
        # Weighted average with current execution
        weight = 0.1  # Weight for current execution
        return (agent.success_rate * (1 - weight)) + (1.0 if current_success else 0.0) * weight
    
    def _calculate_next_run(self, agent: Agent) -> datetime:
        """Calculate next run time based on schedule"""
        schedule = agent.schedule
        interval_hours = schedule.get("interval_hours", 6)  # Default: every 6 hours
        
        return datetime.now(timezone.utc) + timedelta(hours=interval_hours)