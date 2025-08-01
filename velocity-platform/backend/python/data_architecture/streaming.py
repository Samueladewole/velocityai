"""
Real-time Streaming Pipeline for ERIP Data Architecture
Reusable streaming components for Redis, Kafka, and event processing
"""

from typing import Dict, List, Optional, Any, Callable, Union, AsyncIterator
from datetime import datetime, timedelta
from abc import ABC, abstractmethod
import asyncio
import json
from enum import Enum
import structlog
from pydantic import BaseModel, Field
import hashlib
import time

# Optional imports for streaming backends
try:
    import redis.asyncio as redis
except ImportError:
    redis = None

try:
    from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
except ImportError:
    AIOKafkaProducer = None
    AIOKafkaConsumer = None

logger = structlog.get_logger()

class StreamType(str, Enum):
    """Supported streaming backends"""
    REDIS = "redis"
    KAFKA = "kafka"
    MEMORY = "memory"  # For testing
    CUSTOM = "custom"  # For extensibility

class ProcessingMode(str, Enum):
    """Stream processing modes"""
    AT_MOST_ONCE = "at_most_once"
    AT_LEAST_ONCE = "at_least_once"
    EXACTLY_ONCE = "exactly_once"

class StreamConfig(BaseModel):
    """Reusable stream configuration"""
    stream_type: StreamType
    connection_params: Dict[str, Any] = Field(default_factory=dict)
    batch_size: int = 100
    batch_timeout: float = 1.0  # seconds
    processing_mode: ProcessingMode = ProcessingMode.AT_LEAST_ONCE
    retry_policy: Dict[str, Any] = Field(default_factory=lambda: {
        "max_retries": 3,
        "retry_delay": 1.0,
        "exponential_backoff": True
    })
    serialization: str = "json"  # json, msgpack, protobuf
    compression: Optional[str] = None  # gzip, lz4, snappy

class StreamMessage(BaseModel):
    """Reusable stream message format"""
    message_id: str
    timestamp: datetime
    source: str
    event_type: str
    data: Dict[str, Any]
    metadata: Dict[str, Any] = Field(default_factory=dict)
    correlation_id: Optional[str] = None
    partition_key: Optional[str] = None
    
    def to_bytes(self, serialization: str = "json") -> bytes:
        """Serialize message to bytes"""
        if serialization == "json":
            return json.dumps(self.dict(), default=str).encode('utf-8')
        # Add other serialization formats as needed
        return b""
    
    @classmethod
    def from_bytes(cls, data: bytes, serialization: str = "json") -> 'StreamMessage':
        """Deserialize message from bytes"""
        if serialization == "json":
            return cls(**json.loads(data.decode('utf-8')))
        # Add other deserialization formats as needed
        raise ValueError(f"Unsupported serialization: {serialization}")

class StreamProcessor(ABC):
    """
    Abstract base class for stream processors
    Designed for maximum reusability across different streaming backends
    """
    
    def __init__(self, config: StreamConfig):
        self.config = config
        self._connected = False
        self._processors: Dict[str, Callable] = {}
        self._error_handlers: List[Callable] = []
        self._metrics = {
            "messages_processed": 0,
            "messages_failed": 0,
            "processing_time_ms": []
        }
    
    @abstractmethod
    async def connect(self) -> bool:
        """Connect to streaming backend"""
        pass
    
    @abstractmethod
    async def disconnect(self) -> bool:
        """Disconnect from streaming backend"""
        pass
    
    @abstractmethod
    async def send(self, topic: str, message: StreamMessage) -> bool:
        """Send message to stream"""
        pass
    
    @abstractmethod
    async def receive(self, topic: str, timeout: Optional[float] = None) -> Optional[StreamMessage]:
        """Receive single message from stream"""
        pass
    
    @abstractmethod
    async def subscribe(self, topics: List[str]) -> AsyncIterator[StreamMessage]:
        """Subscribe to topics and yield messages"""
        pass
    
    def register_processor(self, event_type: str, processor: Callable) -> None:
        """Register reusable message processor"""
        self._processors[event_type] = processor
        logger.info("Processor registered", event_type=event_type)
    
    def register_error_handler(self, handler: Callable) -> None:
        """Register reusable error handler"""
        self._error_handlers.append(handler)
    
    async def process_message(self, message: StreamMessage) -> Any:
        """Process message using registered processors"""
        start_time = time.time()
        
        try:
            processor = self._processors.get(message.event_type)
            if not processor:
                logger.warning("No processor for event type", 
                             event_type=message.event_type)
                return None
            
            result = await processor(message) if asyncio.iscoroutinefunction(processor) else processor(message)
            
            # Update metrics
            self._metrics["messages_processed"] += 1
            self._metrics["processing_time_ms"].append((time.time() - start_time) * 1000)
            
            return result
            
        except Exception as e:
            self._metrics["messages_failed"] += 1
            logger.error("Message processing failed", 
                        message_id=message.message_id,
                        error=str(e))
            
            # Call error handlers
            for handler in self._error_handlers:
                try:
                    await handler(message, e) if asyncio.iscoroutinefunction(handler) else handler(message, e)
                except Exception as handler_error:
                    logger.error("Error handler failed", error=str(handler_error))
            
            raise
    
    async def batch_send(self, topic: str, messages: List[StreamMessage]) -> Dict[str, Any]:
        """Send messages in batch for efficiency"""
        results = {
            "succeeded": 0,
            "failed": 0,
            "errors": []
        }
        
        for message in messages:
            try:
                if await self.send(topic, message):
                    results["succeeded"] += 1
                else:
                    results["failed"] += 1
            except Exception as e:
                results["failed"] += 1
                results["errors"].append(str(e))
        
        return results
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get processing metrics"""
        avg_time = sum(self._metrics["processing_time_ms"]) / len(self._metrics["processing_time_ms"]) if self._metrics["processing_time_ms"] else 0
        
        return {
            "messages_processed": self._metrics["messages_processed"],
            "messages_failed": self._metrics["messages_failed"],
            "average_processing_time_ms": avg_time,
            "success_rate": self._metrics["messages_processed"] / (self._metrics["messages_processed"] + self._metrics["messages_failed"]) if (self._metrics["messages_processed"] + self._metrics["messages_failed"]) > 0 else 0
        }

class RedisStreamProcessor(StreamProcessor):
    """
    Redis Streams implementation - highly scalable and reusable
    """
    
    def __init__(self, config: StreamConfig):
        super().__init__(config)
        self.redis_client = None
        self.consumer_group = config.connection_params.get('consumer_group', 'erip-default')
        self.consumer_name = config.connection_params.get('consumer_name', f'consumer-{id(self)}')
    
    async def connect(self) -> bool:
        """Connect to Redis"""
        try:
            if not redis:
                raise ImportError("redis not installed. Run: pip install redis")
            
            self.redis_client = await redis.from_url(
                self.config.connection_params.get('url', 'redis://localhost:6379'),
                decode_responses=False  # We'll handle decoding
            )
            
            # Test connection
            await self.redis_client.ping()
            self._connected = True
            logger.info("Redis connection established")
            return True
            
        except Exception as e:
            logger.error("Failed to connect to Redis", error=str(e))
            return False
    
    async def disconnect(self) -> bool:
        """Disconnect from Redis"""
        if self.redis_client:
            await self.redis_client.close()
        self._connected = False
        return True
    
    async def send(self, topic: str, message: StreamMessage) -> bool:
        """Send message to Redis stream"""
        try:
            # Add message to stream
            message_id = await self.redis_client.xadd(
                topic,
                {
                    'data': message.to_bytes(self.config.serialization),
                    'event_type': message.event_type.encode('utf-8'),
                    'timestamp': str(message.timestamp).encode('utf-8')
                }
            )
            
            logger.info("Message sent to Redis stream", 
                       topic=topic, 
                       message_id=message_id.decode('utf-8'))
            return True
            
        except Exception as e:
            logger.error("Failed to send message to Redis", 
                        topic=topic, 
                        error=str(e))
            return False
    
    async def receive(self, topic: str, timeout: Optional[float] = None) -> Optional[StreamMessage]:
        """Receive single message from Redis stream"""
        try:
            # Read from stream
            messages = await self.redis_client.xread(
                {topic: '€'},
                count=1,
                block=int(timeout * 1000) if timeout else 0
            )
            
            if messages:
                stream_name, stream_messages = messages[0]
                if stream_messages:
                    message_id, data = stream_messages[0]
                    return StreamMessage.from_bytes(
                        data[b'data'],
                        self.config.serialization
                    )
            
            return None
            
        except Exception as e:
            logger.error("Failed to receive message from Redis", 
                        topic=topic, 
                        error=str(e))
            return None
    
    async def subscribe(self, topics: List[str]) -> AsyncIterator[StreamMessage]:
        """Subscribe to Redis streams"""
        # Create consumer groups if they don't exist
        for topic in topics:
            try:
                await self.redis_client.xgroup_create(
                    topic, 
                    self.consumer_group, 
                    id='0',
                    mkstream=True
                )
            except Exception:
                # Group might already exist
                pass
        
        # Start consuming messages
        last_ids = {topic: '>' for topic in topics}
        
        while self._connected:
            try:
                # Read from multiple streams
                messages = await self.redis_client.xreadgroup(
                    self.consumer_group,
                    self.consumer_name,
                    last_ids,
                    count=self.config.batch_size,
                    block=int(self.config.batch_timeout * 1000)
                )
                
                for stream_name, stream_messages in messages:
                    topic = stream_name.decode('utf-8') if isinstance(stream_name, bytes) else stream_name
                    
                    for message_id, data in stream_messages:
                        try:
                            message = StreamMessage.from_bytes(
                                data[b'data'],
                                self.config.serialization
                            )
                            
                            yield message
                            
                            # Acknowledge message
                            await self.redis_client.xack(
                                topic,
                                self.consumer_group,
                                message_id
                            )
                            
                        except Exception as e:
                            logger.error("Failed to process Redis message", 
                                       message_id=message_id,
                                       error=str(e))
                
            except Exception as e:
                logger.error("Redis subscription error", error=str(e))
                await asyncio.sleep(1)  # Avoid tight error loop

class KafkaStreamProcessor(StreamProcessor):
    """
    Apache Kafka implementation - enterprise-grade streaming
    """
    
    def __init__(self, config: StreamConfig):
        super().__init__(config)
        self.producer = None
        self.consumer = None
        self.bootstrap_servers = config.connection_params.get('bootstrap_servers', 'localhost:9092')
    
    async def connect(self) -> bool:
        """Connect to Kafka"""
        try:
            if not AIOKafkaProducer:
                raise ImportError("aiokafka not installed. Run: pip install aiokafka")
            
            # Create producer
            self.producer = AIOKafkaProducer(
                bootstrap_servers=self.bootstrap_servers,
                value_serializer=lambda v: v.to_bytes(self.config.serialization) if isinstance(v, StreamMessage) else json.dumps(v).encode()
            )
            await self.producer.start()
            
            self._connected = True
            logger.info("Kafka connection established")
            return True
            
        except Exception as e:
            logger.error("Failed to connect to Kafka", error=str(e))
            return False
    
    async def disconnect(self) -> bool:
        """Disconnect from Kafka"""
        if self.producer:
            await self.producer.stop()
        if self.consumer:
            await self.consumer.stop()
        self._connected = False
        return True
    
    async def send(self, topic: str, message: StreamMessage) -> bool:
        """Send message to Kafka topic"""
        try:
            # Send message with optional partition key
            await self.producer.send(
                topic,
                value=message,
                key=message.partition_key.encode() if message.partition_key else None
            )
            
            logger.info("Message sent to Kafka", 
                       topic=topic, 
                       message_id=message.message_id)
            return True
            
        except Exception as e:
            logger.error("Failed to send message to Kafka", 
                        topic=topic, 
                        error=str(e))
            return False
    
    async def receive(self, topic: str, timeout: Optional[float] = None) -> Optional[StreamMessage]:
        """Receive single message from Kafka"""
        # For single message receive, create temporary consumer
        consumer = AIOKafkaConsumer(
            topic,
            bootstrap_servers=self.bootstrap_servers,
            value_deserializer=lambda v: StreamMessage.from_bytes(v, self.config.serialization)
        )
        
        try:
            await consumer.start()
            
            # Get one message
            async for msg in consumer:
                return msg.value
                
        except Exception as e:
            logger.error("Failed to receive message from Kafka", 
                        topic=topic, 
                        error=str(e))
            return None
        finally:
            await consumer.stop()
    
    async def subscribe(self, topics: List[str]) -> AsyncIterator[StreamMessage]:
        """Subscribe to Kafka topics"""
        self.consumer = AIOKafkaConsumer(
            *topics,
            bootstrap_servers=self.bootstrap_servers,
            group_id=self.config.connection_params.get('group_id', 'erip-consumer'),
            value_deserializer=lambda v: StreamMessage.from_bytes(v, self.config.serialization)
        )
        
        await self.consumer.start()
        
        try:
            async for msg in self.consumer:
                yield msg.value
        finally:
            await self.consumer.stop()

class MemoryStreamProcessor(StreamProcessor):
    """
    In-memory stream processor for testing and development
    Fully reusable without external dependencies
    """
    
    def __init__(self, config: StreamConfig):
        super().__init__(config)
        self.streams: Dict[str, asyncio.Queue] = {}
        self.subscriptions: Dict[str, List[asyncio.Queue]] = {}
    
    async def connect(self) -> bool:
        """No connection needed for memory streams"""
        self._connected = True
        return True
    
    async def disconnect(self) -> bool:
        """Clear memory streams"""
        self.streams.clear()
        self.subscriptions.clear()
        self._connected = False
        return True
    
    async def send(self, topic: str, message: StreamMessage) -> bool:
        """Send message to memory stream"""
        try:
            # Create stream if it doesn't exist
            if topic not in self.streams:
                self.streams[topic] = asyncio.Queue()
            
            # Put message in stream
            await self.streams[topic].put(message)
            
            # Notify subscribers
            if topic in self.subscriptions:
                for queue in self.subscriptions[topic]:
                    await queue.put(message)
            
            return True
            
        except Exception as e:
            logger.error("Failed to send message to memory stream", 
                        topic=topic, 
                        error=str(e))
            return False
    
    async def receive(self, topic: str, timeout: Optional[float] = None) -> Optional[StreamMessage]:
        """Receive message from memory stream"""
        try:
            if topic not in self.streams:
                return None
            
            if timeout:
                return await asyncio.wait_for(
                    self.streams[topic].get(),
                    timeout=timeout
                )
            else:
                return await self.streams[topic].get()
                
        except asyncio.TimeoutError:
            return None
        except Exception as e:
            logger.error("Failed to receive from memory stream", 
                        topic=topic, 
                        error=str(e))
            return None
    
    async def subscribe(self, topics: List[str]) -> AsyncIterator[StreamMessage]:
        """Subscribe to memory streams"""
        # Create subscription queue
        sub_queue = asyncio.Queue()
        
        # Register subscription
        for topic in topics:
            if topic not in self.subscriptions:
                self.subscriptions[topic] = []
            self.subscriptions[topic].append(sub_queue)
        
        # Yield messages
        while self._connected:
            try:
                message = await asyncio.wait_for(
                    sub_queue.get(),
                    timeout=self.config.batch_timeout
                )
                yield message
            except asyncio.TimeoutError:
                continue

class StreamingPipeline:
    """
    High-level streaming pipeline orchestrator
    Reusable across different streaming backends
    """
    
    def __init__(self, config: StreamConfig):
        self.config = config
        self.processor = self._create_processor(config)
        self.transformers: List[Callable] = []
        self.filters: List[Callable] = []
        self.sinks: List[Callable] = []
        self._running = False
    
    def _create_processor(self, config: StreamConfig) -> StreamProcessor:
        """Create appropriate stream processor"""
        if config.stream_type == StreamType.REDIS:
            return RedisStreamProcessor(config)
        elif config.stream_type == StreamType.KAFKA:
            return KafkaStreamProcessor(config)
        elif config.stream_type == StreamType.MEMORY:
            return MemoryStreamProcessor(config)
        else:
            raise ValueError(f"Unsupported stream type: {config.stream_type}")
    
    def add_transformer(self, transformer: Callable) -> 'StreamingPipeline':
        """Add reusable message transformer"""
        self.transformers.append(transformer)
        return self
    
    def add_filter(self, filter_func: Callable) -> 'StreamingPipeline':
        """Add reusable message filter"""
        self.filters.append(filter_func)
        return self
    
    def add_sink(self, sink: Callable) -> 'StreamingPipeline':
        """Add reusable data sink"""
        self.sinks.append(sink)
        return self
    
    async def process_stream(self, input_topics: List[str], output_topic: Optional[str] = None) -> None:
        """Process streaming data through the pipeline"""
        await self.processor.connect()
        self._running = True
        
        try:
            async for message in self.processor.subscribe(input_topics):
                if not self._running:
                    break
                
                # Apply filters
                should_process = True
                for filter_func in self.filters:
                    if not await self._apply_function(filter_func, message):
                        should_process = False
                        break
                
                if not should_process:
                    continue
                
                # Apply transformers
                transformed = message
                for transformer in self.transformers:
                    transformed = await self._apply_function(transformer, transformed)
                
                # Send to output topic if specified
                if output_topic and isinstance(transformed, StreamMessage):
                    await self.processor.send(output_topic, transformed)
                
                # Send to sinks
                for sink in self.sinks:
                    await self._apply_function(sink, transformed)
                
        except Exception as e:
            logger.error("Pipeline processing error", error=str(e))
            raise
        finally:
            await self.processor.disconnect()
    
    async def _apply_function(self, func: Callable, data: Any) -> Any:
        """Apply function with async support"""
        if asyncio.iscoroutinefunction(func):
            return await func(data)
        return func(data)
    
    async def stop(self) -> None:
        """Stop the streaming pipeline"""
        self._running = False
        await self.processor.disconnect()

class EventProcessor:
    """
    Reusable event processing utilities
    """
    
    @staticmethod
    def create_message(
        event_type: str,
        data: Dict[str, Any],
        source: str = "erip",
        correlation_id: Optional[str] = None
    ) -> StreamMessage:
        """Create standardized stream message"""
        return StreamMessage(
            message_id=f"{int(time.time() * 1000)}-{hashlib.md5(json.dumps(data).encode()).hexdigest()[:8]}",
            timestamp=datetime.utcnow(),
            source=source,
            event_type=event_type,
            data=data,
            correlation_id=correlation_id
        )
    
    @staticmethod
    def batch_messages(
        messages: List[StreamMessage],
        batch_size: int = 100
    ) -> List[List[StreamMessage]]:
        """Batch messages for efficient processing"""
        return [messages[i:i + batch_size] for i in range(0, len(messages), batch_size)]
    
    @staticmethod
    async def replay_messages(
        processor: StreamProcessor,
        topic: str,
        start_time: datetime,
        end_time: datetime
    ) -> List[StreamMessage]:
        """Replay messages within time range (if supported by backend)"""
        # This would need backend-specific implementation
        logger.info("Message replay requested", 
                   topic=topic,
                   start_time=start_time,
                   end_time=end_time)
        return []

# Reusable processor functions
async def log_processor(message: StreamMessage) -> StreamMessage:
    """Log message for debugging"""
    logger.info("Processing message", 
               message_id=message.message_id,
               event_type=message.event_type)
    return message

async def enrichment_processor(message: StreamMessage) -> StreamMessage:
    """Enrich message with additional context"""
    message.metadata["processed_at"] = datetime.utcnow().isoformat()
    message.metadata["processor"] = "erip-streaming"
    return message

async def validation_processor(message: StreamMessage) -> StreamMessage:
    """Validate message structure"""
    required_fields = ["event_type", "data", "timestamp"]
    for field in required_fields:
        if not hasattr(message, field):
            raise ValueError(f"Missing required field: {field}")
    return message