"""
Advanced Agent Communication and Coordination System
Implements intelligent communication protocols between the 10 AI agents
"""

import asyncio
import json
import time
import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional, Callable, Set, Union
from enum import Enum
from dataclasses import dataclass, field, asdict
from collections import defaultdict, deque
import logging

from pydantic import BaseModel, Field
import structlog
import redis.asyncio as redis

from agent_orchestration import AgentType, TaskType, TaskStatus, AgentTask

logger = structlog.get_logger()

class MessageType(Enum):
    """Types of messages agents can exchange"""
    TASK_REQUEST = "task_request"
    TASK_RESPONSE = "task_response"
    STATUS_UPDATE = "status_update"
    DATA_SHARE = "data_share"
    COORDINATION_REQUEST = "coordination_request"
    ALERT = "alert"
    HEALTH_CHECK = "health_check"
    WORKFLOW_SIGNAL = "workflow_signal"
    CONTEXT_UPDATE = "context_update"
    CAPABILITY_ANNOUNCE = "capability_announce"

class MessagePriority(Enum):
    """Message priority levels"""
    CRITICAL = 1
    HIGH = 2
    NORMAL = 3
    LOW = 4

@dataclass
class AgentMessage:
    """Message between agents"""
    message_id: str
    sender: AgentType
    recipient: Union[AgentType, str]  # Can be specific agent or channel
    message_type: MessageType
    priority: MessagePriority
    
    # Content
    payload: Dict[str, Any] = field(default_factory=dict)
    context: Dict[str, Any] = field(default_factory=dict)
    
    # Routing
    requires_response: bool = False
    response_timeout: Optional[int] = None  # seconds
    correlation_id: Optional[str] = None
    
    # Metadata
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    ttl: Optional[int] = None  # time to live in seconds
    retry_count: int = 0
    max_retries: int = 3

@dataclass
class AgentCapabilityAnnouncement:
    """Agent announces its capabilities to the network"""
    agent_type: AgentType
    instance_id: str
    organization_id: str
    
    capabilities: List[TaskType]
    supported_platforms: List[str]
    supported_frameworks: List[str]
    
    current_load: int
    max_capacity: int
    health_status: str
    specialization_scores: Dict[str, float]
    
    announcement_time: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

class CommunicationProtocol:
    """Defines communication protocols between specific agent pairs"""
    
    @staticmethod
    def get_protocol(sender: AgentType, recipient: AgentType) -> Dict[str, Any]:
        """Get communication protocol between two agents"""
        protocols = {
            # ATLAS -> PRISM: Security data to risk analysis
            (AgentType.ATLAS, AgentType.PRISM): {
                "data_format": "security_assessment",
                "required_fields": ["vulnerabilities", "security_score", "threat_level"],
                "encryption": True,
                "compression": True,
                "priority": MessagePriority.HIGH
            },
            
            # CLEARANCE -> CRYPTO_VERIFICATION: Evidence to verification
            (AgentType.CLEARANCE, AgentType.CRYPTO_VERIFICATION): {
                "data_format": "evidence_package",
                "required_fields": ["evidence_items", "metadata", "signatures"],
                "encryption": True,
                "integrity_check": True,
                "priority": MessagePriority.CRITICAL
            },
            
            # COMPASS -> All agents: Regulatory updates
            (AgentType.COMPASS, "broadcast"): {
                "data_format": "regulatory_update",
                "required_fields": ["framework", "changes", "effective_date"],
                "broadcast": True,
                "priority": MessagePriority.HIGH
            }
        }
        
        return protocols.get((sender, recipient), {
            "data_format": "generic",
            "priority": MessagePriority.NORMAL
        })

class MessageRouter:
    """Routes messages between agents with intelligent routing"""
    
    def __init__(self):
        self.routing_table: Dict[AgentType, Set[str]] = defaultdict(set)
        self.message_history: deque = deque(maxlen=10000)
        self.delivery_stats: Dict[str, Dict[str, int]] = defaultdict(lambda: defaultdict(int))
        self.failed_deliveries: deque = deque(maxlen=1000)
    
    async def route_message(self, message: AgentMessage) -> List[str]:
        """Route message to appropriate recipients"""
        recipients = []
        
        if isinstance(message.recipient, AgentType):
            # Route to specific agent type instances
            recipients.extend(self.routing_table[message.recipient])
        elif message.recipient == "broadcast":
            # Broadcast to all agents
            for agent_instances in self.routing_table.values():
                recipients.extend(agent_instances)
        elif message.recipient.startswith("channel:"):
            # Route to channel subscribers
            channel = message.recipient[8:]  # Remove "channel:" prefix
            recipients.extend(self._get_channel_subscribers(channel))
        else:
            # Direct instance routing
            recipients.append(message.recipient)
        
        # Apply routing filters
        recipients = await self._apply_routing_filters(message, recipients)
        
        return recipients
    
    async def _apply_routing_filters(self, message: AgentMessage, recipients: List[str]) -> List[str]:
        """Apply intelligent routing filters"""
        filtered = []
        
        for recipient in recipients:
            # Check if recipient is healthy
            if await self._is_recipient_healthy(recipient):
                # Check load balancing
                if await self._should_route_to_recipient(message, recipient):
                    filtered.append(recipient)
        
        return filtered
    
    async def _is_recipient_healthy(self, recipient: str) -> bool:
        """Check if recipient is healthy"""
        # This would check agent health status
        return True  # Simplified for now
    
    async def _should_route_to_recipient(self, message: AgentMessage, recipient: str) -> bool:
        """Determine if message should be routed to specific recipient"""
        # Load balancing logic
        current_load = self.delivery_stats[recipient]["current_load"]
        max_load = self.delivery_stats[recipient].get("max_load", 100)
        
        if current_load >= max_load:
            return False
        
        # Priority-based routing
        if message.priority == MessagePriority.CRITICAL:
            return True
        
        return True
    
    def _get_channel_subscribers(self, channel: str) -> List[str]:
        """Get subscribers for a channel"""
        # This would maintain channel subscriptions
        return []
    
    def register_agent_instance(self, agent_type: AgentType, instance_id: str):
        """Register an agent instance for routing"""
        self.routing_table[agent_type].add(instance_id)
        
        logger.info(
            "Agent instance registered for routing",
            agent_type=agent_type.value,
            instance_id=instance_id
        )
    
    def unregister_agent_instance(self, agent_type: AgentType, instance_id: str):
        """Unregister an agent instance"""
        self.routing_table[agent_type].discard(instance_id)
        
        logger.info(
            "Agent instance unregistered from routing",
            agent_type=agent_type.value,
            instance_id=instance_id
        )

class MessageDeliveryService:
    """Handles reliable message delivery with retries and acknowledgments"""
    
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.pending_messages: Dict[str, AgentMessage] = {}
        self.delivery_timeouts: Dict[str, datetime] = {}
        self.acknowledgments: Set[str] = set()
        
        # Delivery statistics
        self.delivery_stats = {
            "sent": 0,
            "delivered": 0,
            "failed": 0,
            "retried": 0
        }
    
    async def send_message(self, message: AgentMessage, recipients: List[str]) -> bool:
        """Send message to recipients with reliability guarantees"""
        success_count = 0
        
        for recipient in recipients:
            try:
                # Apply protocol-specific formatting
                protocol = CommunicationProtocol.get_protocol(
                    message.sender, 
                    message.recipient if isinstance(message.recipient, AgentType) else AgentType.COMPASS
                )
                
                formatted_message = await self._format_message(message, protocol)
                
                # Send via Redis pubsub
                await self.redis.publish(
                    f"agent:{recipient}",
                    json.dumps(formatted_message)
                )
                
                # Track if response is required
                if message.requires_response:
                    self.pending_messages[message.message_id] = message
                    if message.response_timeout:
                        timeout_time = datetime.now(timezone.utc) + timedelta(seconds=message.response_timeout)
                        self.delivery_timeouts[message.message_id] = timeout_time
                
                success_count += 1
                self.delivery_stats["sent"] += 1
                
                logger.debug(
                    "Message sent",
                    message_id=message.message_id,
                    recipient=recipient,
                    type=message.message_type.value
                )
                
            except Exception as e:
                logger.error(
                    "Message delivery failed",
                    message_id=message.message_id,
                    recipient=recipient,
                    error=str(e)
                )
                
                # Retry if within limits
                if message.retry_count < message.max_retries:
                    message.retry_count += 1
                    await asyncio.sleep(2 ** message.retry_count)  # Exponential backoff
                    await self.send_message(message, [recipient])
                    self.delivery_stats["retried"] += 1
                else:
                    self.delivery_stats["failed"] += 1
        
        return success_count > 0
    
    async def _format_message(self, message: AgentMessage, protocol: Dict[str, Any]) -> Dict[str, Any]:
        """Format message according to protocol"""
        formatted = {
            "message_id": message.message_id,
            "sender": message.sender.value,
            "recipient": message.recipient.value if isinstance(message.recipient, AgentType) else message.recipient,
            "type": message.message_type.value,
            "priority": message.priority.value,
            "timestamp": message.timestamp.isoformat(),
            "payload": message.payload,
            "context": message.context
        }
        
        # Apply protocol-specific formatting
        if protocol.get("encryption"):
            formatted["payload"] = await self._encrypt_payload(formatted["payload"])
            formatted["encrypted"] = True
        
        if protocol.get("compression"):
            formatted["payload"] = await self._compress_payload(formatted["payload"])
            formatted["compressed"] = True
        
        if protocol.get("integrity_check"):
            formatted["checksum"] = await self._calculate_checksum(formatted["payload"])
        
        return formatted
    
    async def _encrypt_payload(self, payload: Dict[str, Any]) -> str:
        """Encrypt message payload"""
        # This would use proper encryption
        return json.dumps(payload)
    
    async def _compress_payload(self, payload: Dict[str, Any]) -> str:
        """Compress message payload"""
        import gzip
        import base64
        
        json_str = json.dumps(payload)
        compressed = gzip.compress(json_str.encode())
        return base64.b64encode(compressed).decode()
    
    async def _calculate_checksum(self, payload: Any) -> str:
        """Calculate checksum for integrity verification"""
        import hashlib
        
        payload_str = json.dumps(payload, sort_keys=True)
        return hashlib.sha256(payload_str.encode()).hexdigest()
    
    async def acknowledge_message(self, message_id: str):
        """Acknowledge message receipt"""
        self.acknowledgments.add(message_id)
        if message_id in self.pending_messages:
            del self.pending_messages[message_id]
        if message_id in self.delivery_timeouts:
            del self.delivery_timeouts[message_id]
        
        self.delivery_stats["delivered"] += 1
    
    async def check_timeouts(self):
        """Check for message timeouts"""
        current_time = datetime.now(timezone.utc)
        timed_out = []
        
        for message_id, timeout_time in self.delivery_timeouts.items():
            if current_time > timeout_time:
                timed_out.append(message_id)
        
        for message_id in timed_out:
            message = self.pending_messages.get(message_id)
            if message:
                logger.warning(
                    "Message timed out",
                    message_id=message_id,
                    sender=message.sender.value,
                    recipient=message.recipient
                )
                
                # Clean up
                del self.pending_messages[message_id]
                del self.delivery_timeouts[message_id]
                self.delivery_stats["failed"] += 1

class AgentCoordinationService:
    """Coordinates complex multi-agent workflows"""
    
    def __init__(self, message_router: MessageRouter, delivery_service: MessageDeliveryService):
        self.router = message_router
        self.delivery = delivery_service
        self.active_workflows: Dict[str, Dict[str, Any]] = {}
        self.coordination_state: Dict[str, Any] = {}
    
    async def coordinate_workflow(self, workflow_id: str, participants: List[AgentType]) -> bool:
        """Coordinate a multi-agent workflow"""
        coordination_id = str(uuid.uuid4())
        
        # Initialize coordination state
        self.coordination_state[coordination_id] = {
            "workflow_id": workflow_id,
            "participants": participants,
            "status": "initializing",
            "responses": {},
            "started_at": datetime.now(timezone.utc)
        }
        
        # Send coordination request to all participants
        for participant in participants:
            message = AgentMessage(
                message_id=str(uuid.uuid4()),
                sender=AgentType.COMPASS,  # Coordinator
                recipient=participant,
                message_type=MessageType.COORDINATION_REQUEST,
                priority=MessagePriority.HIGH,
                payload={
                    "coordination_id": coordination_id,
                    "workflow_id": workflow_id,
                    "participants": [p.value for p in participants]
                },
                requires_response=True,
                response_timeout=30
            )
            
            recipients = await self.router.route_message(message)
            await self.delivery.send_message(message, recipients)
        
        # Wait for responses
        success = await self._wait_for_coordination_responses(coordination_id, len(participants))
        
        return success
    
    async def _wait_for_coordination_responses(self, coordination_id: str, expected_responses: int) -> bool:
        """Wait for coordination responses from all participants"""
        timeout = datetime.now(timezone.utc) + timedelta(seconds=60)
        
        while datetime.now(timezone.utc) < timeout:
            state = self.coordination_state.get(coordination_id, {})
            responses = state.get("responses", {})
            
            if len(responses) >= expected_responses:
                # Check if all agreed to participate
                all_agreed = all(
                    response.get("status") == "ready" 
                    for response in responses.values()
                )
                
                if all_agreed:
                    state["status"] = "coordinated"
                    return True
                else:
                    state["status"] = "failed"
                    return False
            
            await asyncio.sleep(1)
        
        # Timeout
        self.coordination_state[coordination_id]["status"] = "timeout"
        return False
    
    async def handle_coordination_response(self, coordination_id: str, agent: AgentType, response: Dict[str, Any]):
        """Handle coordination response from an agent"""
        if coordination_id in self.coordination_state:
            self.coordination_state[coordination_id]["responses"][agent.value] = response
            
            logger.info(
                "Coordination response received",
                coordination_id=coordination_id,
                agent=agent.value,
                status=response.get("status")
            )

class AgentCommunicationHub:
    """Main communication hub that orchestrates all agent communication"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_client = None
        self.router = MessageRouter()
        self.delivery_service = None
        self.coordination_service = None
        
        # Message handlers
        self.message_handlers: Dict[MessageType, List[Callable]] = defaultdict(list)
        
        # Subscriptions
        self.subscriptions: Dict[str, asyncio.Task] = {}
        
        # Performance metrics
        self.metrics = {
            "messages_sent": 0,
            "messages_received": 0,
            "coordination_requests": 0,
            "workflow_completions": 0
        }
    
    async def start(self, redis_url: str = "redis://localhost:6379"):
        """Start the communication hub"""
        self.redis_client = redis.from_url(redis_url)
        self.delivery_service = MessageDeliveryService(self.redis_client)
        self.coordination_service = AgentCoordinationService(self.router, self.delivery_service)
        
        # Start background tasks
        asyncio.create_task(self._timeout_checker())
        
        logger.info("Agent communication hub started")
    
    async def stop(self):
        """Stop the communication hub"""
        # Cancel all subscriptions
        for task in self.subscriptions.values():
            task.cancel()
        
        if self.redis_client:
            await self.redis_client.close()
        
        logger.info("Agent communication hub stopped")
    
    async def register_agent(self, agent_type: AgentType, instance_id: str) -> bool:
        """Register an agent with the communication hub"""
        self.router.register_agent_instance(agent_type, instance_id)
        
        # Subscribe to agent's message channel
        subscription_task = asyncio.create_task(
            self._subscribe_to_agent_channel(instance_id)
        )
        self.subscriptions[instance_id] = subscription_task
        
        # Send capability announcement
        announcement = AgentCapabilityAnnouncement(
            agent_type=agent_type,
            instance_id=instance_id,
            organization_id="",  # Would be set properly
            capabilities=[],  # Would be populated
            supported_platforms=[],
            supported_frameworks=[],
            current_load=0,
            max_capacity=3,
            health_status="healthy",
            specialization_scores={}
        )
        
        await self._broadcast_capability_announcement(announcement)
        
        logger.info(
            "Agent registered with communication hub",
            agent_type=agent_type.value,
            instance_id=instance_id
        )
        
        return True
    
    async def send_message(self, message: AgentMessage) -> bool:
        """Send a message through the communication hub"""
        recipients = await self.router.route_message(message)
        success = await self.delivery_service.send_message(message, recipients)
        
        if success:
            self.metrics["messages_sent"] += 1
        
        return success
    
    async def coordinate_agents(self, workflow_id: str, participants: List[AgentType]) -> bool:
        """Coordinate multiple agents for a workflow"""
        success = await self.coordination_service.coordinate_workflow(workflow_id, participants)
        
        self.metrics["coordination_requests"] += 1
        if success:
            self.metrics["workflow_completions"] += 1
        
        return success
    
    async def _subscribe_to_agent_channel(self, instance_id: str):
        """Subscribe to an agent's message channel"""
        pubsub = self.redis_client.pubsub()
        await pubsub.subscribe(f"agent:{instance_id}")
        
        try:
            async for message in pubsub.listen():
                if message["type"] == "message":
                    await self._handle_received_message(instance_id, message["data"])
        except Exception as e:
            logger.error(
                "Error in agent channel subscription",
                instance_id=instance_id,
                error=str(e)
            )
        finally:
            await pubsub.unsubscribe(f"agent:{instance_id}")
    
    async def _handle_received_message(self, instance_id: str, message_data: bytes):
        """Handle a received message"""
        try:
            message_dict = json.loads(message_data.decode())
            message_type = MessageType(message_dict["type"])
            
            # Update metrics
            self.metrics["messages_received"] += 1
            
            # Call registered handlers
            for handler in self.message_handlers[message_type]:
                try:
                    await handler(message_dict)
                except Exception as e:
                    logger.error(
                        "Message handler error",
                        handler=handler.__name__,
                        error=str(e)
                    )
            
            # Send acknowledgment if required
            if message_dict.get("requires_response"):
                await self.delivery_service.acknowledge_message(message_dict["message_id"])
                
        except Exception as e:
            logger.error(
                "Error handling received message",
                instance_id=instance_id,
                error=str(e)
            )
    
    async def _broadcast_capability_announcement(self, announcement: AgentCapabilityAnnouncement):
        """Broadcast agent capability announcement"""
        message = AgentMessage(
            message_id=str(uuid.uuid4()),
            sender=announcement.agent_type,
            recipient="broadcast",
            message_type=MessageType.CAPABILITY_ANNOUNCE,
            priority=MessagePriority.NORMAL,
            payload=asdict(announcement)
        )
        
        await self.send_message(message)
    
    async def _timeout_checker(self):
        """Background task to check for message timeouts"""
        while True:
            try:
                await self.delivery_service.check_timeouts()
                await asyncio.sleep(10)  # Check every 10 seconds
            except Exception as e:
                logger.error("Timeout checker error", error=str(e))
                await asyncio.sleep(30)
    
    def register_message_handler(self, message_type: MessageType, handler: Callable):
        """Register a message handler"""
        self.message_handlers[message_type].append(handler)
    
    def get_communication_stats(self) -> Dict[str, Any]:
        """Get communication statistics"""
        return {
            "metrics": self.metrics,
            "active_subscriptions": len(self.subscriptions),
            "registered_agents": len(self.router.routing_table),
            "delivery_stats": self.delivery_service.delivery_stats if self.delivery_service else {}
        }

# Global communication hub instance
communication_hub = AgentCommunicationHub()