"""
AI Inference Optimization Engine
High-performance inference with intelligent caching, batching, and resource management
"""

import asyncio
import time
import json
import threading
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple, Callable, Union
from enum import Enum
from pydantic import BaseModel, Field
from dataclasses import dataclass
import numpy as np
from collections import deque, defaultdict
import heapq
import uuid
from concurrent.futures import ThreadPoolExecutor, as_completed
import weakref

class OptimizationStrategy(str, Enum):
    """Inference optimization strategies"""
    BATCH_PROCESSING = "batch_processing"
    SMART_CACHING = "smart_caching"
    MODEL_QUANTIZATION = "model_quantization"
    PARALLEL_INFERENCE = "parallel_inference"
    PREDICTIVE_LOADING = "predictive_loading"
    ADAPTIVE_ROUTING = "adaptive_routing"

class CacheStrategy(str, Enum):
    """Caching strategies for inference results"""
    LRU = "least_recently_used"
    LFU = "least_frequently_used"
    TTL = "time_to_live"
    ADAPTIVE = "adaptive"
    SEMANTIC = "semantic_similarity"

class InferenceMode(str, Enum):
    """Inference execution modes"""
    REAL_TIME = "real_time"
    BATCH = "batch"
    STREAMING = "streaming"
    ASYNC = "async"

@dataclass
class InferenceRequest:
    """Individual inference request"""
    request_id: str
    model_name: str
    input_data: Any
    priority: int = 5  # 1-10 scale, 10 = highest
    mode: InferenceMode = InferenceMode.REAL_TIME
    timeout: float = 30.0  # seconds
    cache_key: Optional[str] = None
    callback: Optional[Callable] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

@dataclass
class InferenceResult:
    """Inference result with performance metadata"""
    request_id: str
    result: Any
    model_version: str
    execution_time: float
    cache_hit: bool
    batch_size: int
    optimization_applied: List[str]
    confidence_score: Optional[float] = None
    error: Optional[str] = None
    completed_at: datetime = Field(default_factory=datetime.utcnow)

@dataclass
class BatchRequest:
    """Batch inference request"""
    batch_id: str
    requests: List[InferenceRequest]
    model_name: str
    batch_size: int
    priority: int
    created_at: datetime
    timeout: float

class SmartCache:
    """
    Intelligent caching system with multiple strategies
    """
    
    def __init__(
        self,
        max_size: int = 10000,
        default_ttl: int = 3600,  # 1 hour
        strategy: CacheStrategy = CacheStrategy.ADAPTIVE
    ):
        self.max_size = max_size
        self.default_ttl = default_ttl
        self.strategy = strategy
        
        # Storage
        self.cache: Dict[str, Any] = {}
        self.metadata: Dict[str, Dict[str, Any]] = {}
        self.access_times: Dict[str, datetime] = {}
        self.access_counts: Dict[str, int] = defaultdict(int)
        self.semantic_embeddings: Dict[str, np.ndarray] = {}
        
        # Statistics
        self.hits = 0
        self.misses = 0
        self.evictions = 0
        
        # Background cleanup
        self.cleanup_interval = 300  # 5 minutes
        self.last_cleanup = time.time()
    
    def get(self, key: str, input_data: Any = None) -> Optional[Any]:
        """Get cached result with intelligent lookup"""
        
        # Check for exact match
        if key in self.cache and self._is_valid(key):
            self._record_access(key)
            self.hits += 1
            return self.cache[key]
        
        # Semantic similarity search for complex inputs
        if input_data and self.strategy == CacheStrategy.SEMANTIC:
            similar_key = self._find_similar_cached_input(input_data)
            if similar_key and self._is_valid(similar_key):
                self._record_access(similar_key)
                self.hits += 1
                return self.cache[similar_key]
        
        self.misses += 1
        return None
    
    def put(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        input_data: Any = None
    ):
        """Cache result with intelligent eviction"""
        
        # Clean up if needed
        if time.time() - self.last_cleanup > self.cleanup_interval:
            self._cleanup_expired()
        
        # Evict if at capacity
        if len(self.cache) >= self.max_size:
            self._evict_item()
        
        # Store cache entry
        self.cache[key] = value
        self.metadata[key] = {
            "created_at": datetime.utcnow(),
            "ttl": ttl or self.default_ttl,
            "size": self._estimate_size(value),
            "type": type(value).__name__
        }
        self.access_times[key] = datetime.utcnow()
        self.access_counts[key] = 1
        
        # Store semantic embedding for similarity search
        if input_data and self.strategy == CacheStrategy.SEMANTIC:
            self.semantic_embeddings[key] = self._create_embedding(input_data)
    
    def _is_valid(self, key: str) -> bool:
        """Check if cached entry is still valid"""
        if key not in self.metadata:
            return False
        
        metadata = self.metadata[key]
        created_at = metadata["created_at"]
        ttl = metadata["ttl"]
        
        return datetime.utcnow() < created_at + timedelta(seconds=ttl)
    
    def _record_access(self, key: str):
        """Record cache access for statistics"""
        self.access_times[key] = datetime.utcnow()
        self.access_counts[key] += 1
    
    def _evict_item(self):
        """Evict item based on strategy"""
        if not self.cache:
            return
        
        if self.strategy == CacheStrategy.LRU:
            # Evict least recently used
            oldest_key = min(self.access_times, key=self.access_times.get)
        elif self.strategy == CacheStrategy.LFU:
            # Evict least frequently used
            least_used_key = min(self.access_counts, key=self.access_counts.get)
            oldest_key = least_used_key
        else:  # ADAPTIVE
            # Combine recency and frequency
            scores = {}
            now = datetime.utcnow()
            for key in self.cache:
                recency = (now - self.access_times[key]).total_seconds()
                frequency = self.access_counts[key]
                scores[key] = frequency / (recency + 1)  # Higher score = keep
            oldest_key = min(scores, key=scores.get)
        
        # Remove from all structures
        if oldest_key in self.cache:
            del self.cache[oldest_key]
            del self.metadata[oldest_key]
            del self.access_times[oldest_key]
            del self.access_counts[oldest_key]
            if oldest_key in self.semantic_embeddings:
                del self.semantic_embeddings[oldest_key]
            self.evictions += 1
    
    def _cleanup_expired(self):
        """Remove expired cache entries"""
        now = datetime.utcnow()
        expired_keys = []
        
        for key, metadata in self.metadata.items():
            if now > metadata["created_at"] + timedelta(seconds=metadata["ttl"]):
                expired_keys.append(key)
        
        for key in expired_keys:
            if key in self.cache:
                del self.cache[key]
                del self.metadata[key]
                del self.access_times[key]
                del self.access_counts[key]
                if key in self.semantic_embeddings:
                    del self.semantic_embeddings[key]
        
        self.last_cleanup = time.time()
    
    def _find_similar_cached_input(self, input_data: Any, threshold: float = 0.9) -> Optional[str]:
        """Find cached input with high semantic similarity"""
        if not self.semantic_embeddings:
            return None
        
        input_embedding = self._create_embedding(input_data)
        
        best_key = None
        best_similarity = 0
        
        for key, cached_embedding in self.semantic_embeddings.items():
            similarity = self._cosine_similarity(input_embedding, cached_embedding)
            if similarity > best_similarity and similarity >= threshold:
                best_similarity = similarity
                best_key = key
        
        return best_key
    
    def _create_embedding(self, data: Any) -> np.ndarray:
        """Create simple embedding for similarity comparison"""
        # Simplified embedding - in production would use proper sentence embeddings
        if isinstance(data, str):
            # Simple character-based embedding
            embedding = np.zeros(256)
            for char in data[:256]:
                embedding[ord(char) % 256] += 1
            return embedding / (np.linalg.norm(embedding) + 1e-8)
        elif isinstance(data, dict):
            # Hash-based embedding for structured data
            data_str = json.dumps(data, sort_keys=True)
            return self._create_embedding(data_str)
        else:
            # Default random embedding
            return np.random.random(256)
    
    def _cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        """Calculate cosine similarity between embeddings"""
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8)
    
    def _estimate_size(self, value: Any) -> int:
        """Estimate memory size of cached value"""
        if hasattr(value, '__sizeof__'):
            return value.__sizeof__()
        return len(str(value))
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache performance statistics"""
        total_requests = self.hits + self.misses
        hit_rate = self.hits / total_requests if total_requests > 0 else 0
        
        return {
            "hit_rate": hit_rate,
            "total_requests": total_requests,
            "hits": self.hits,
            "misses": self.misses,
            "evictions": self.evictions,
            "cache_size": len(self.cache),
            "memory_usage_mb": sum(meta.get("size", 0) for meta in self.metadata.values()) / (1024 * 1024)
        }

class BatchProcessor:
    """
    Intelligent batch processing for improved throughput
    """
    
    def __init__(
        self,
        max_batch_size: int = 32,
        batch_timeout: float = 0.1,  # 100ms
        min_batch_size: int = 2
    ):
        self.max_batch_size = max_batch_size
        self.batch_timeout = batch_timeout
        self.min_batch_size = min_batch_size
        
        self.pending_batches: Dict[str, List[InferenceRequest]] = defaultdict(list)
        self.batch_timers: Dict[str, float] = {}
        self.processing_lock = threading.Lock()
        
    def add_request(self, request: InferenceRequest) -> bool:
        """Add request to appropriate batch"""
        
        with self.processing_lock:
            model_key = f"{request.model_name}:{request.mode}"
            
            # Add to pending batch
            self.pending_batches[model_key].append(request)
            
            # Set timer for first request in batch
            if len(self.pending_batches[model_key]) == 1:
                self.batch_timers[model_key] = time.time()
            
            # Check if batch is ready
            batch = self.pending_batches[model_key]
            
            if (len(batch) >= self.max_batch_size or
                (len(batch) >= self.min_batch_size and 
                 time.time() - self.batch_timers[model_key] > self.batch_timeout)):
                
                # Remove batch from pending
                ready_batch = self.pending_batches[model_key].copy()
                self.pending_batches[model_key].clear()
                del self.batch_timers[model_key]
                
                return True, ready_batch
            
            return False, None
    
    def get_ready_batches(self) -> List[BatchRequest]:
        """Get batches ready for processing"""
        
        ready_batches = []
        now = time.time()
        
        with self.processing_lock:
            expired_keys = []
            
            for model_key, batch in self.pending_batches.items():
                if (batch and 
                    len(batch) >= self.min_batch_size and
                    now - self.batch_timers.get(model_key, now) > self.batch_timeout):
                    
                    # Create batch request
                    batch_request = BatchRequest(
                        batch_id=f"batch_{uuid.uuid4().hex[:8]}",
                        requests=batch.copy(),
                        model_name=batch[0].model_name,
                        batch_size=len(batch),
                        priority=max(req.priority for req in batch),
                        created_at=datetime.utcnow(),
                        timeout=min(req.timeout for req in batch)
                    )
                    
                    ready_batches.append(batch_request)
                    expired_keys.append(model_key)
            
            # Clean up processed batches
            for key in expired_keys:
                self.pending_batches[key].clear()
                if key in self.batch_timers:
                    del self.batch_timers[key]
        
        return ready_batches

class InferenceOptimizer:
    """
    Main inference optimization engine
    """
    
    def __init__(self):
        self.cache = SmartCache(max_size=50000, strategy=CacheStrategy.ADAPTIVE)
        self.batch_processor = BatchProcessor()
        self.executor = ThreadPoolExecutor(max_workers=8)
        
        # Performance monitoring
        self.performance_metrics = {
            "total_requests": 0,
            "cache_hits": 0,
            "batch_processed": 0,
            "avg_latency": 0.0,
            "throughput": 0.0
        }
        
        # Request queue with priority
        self.request_queue: List[Tuple[int, InferenceRequest]] = []
        self.queue_lock = threading.Lock()
        
        # Background processing
        self.processing_active = True
        self.background_thread = threading.Thread(target=self._background_processor, daemon=True)
        self.background_thread.start()
    
    async def process_request(self, request: InferenceRequest) -> InferenceResult:
        """Process single inference request with optimizations"""
        
        start_time = time.time()
        optimization_applied = []
        
        # Generate cache key
        cache_key = self._generate_cache_key(request)
        
        # Check cache first
        cached_result = self.cache.get(cache_key, request.input_data)
        if cached_result:
            optimization_applied.append("cache_hit")
            self.performance_metrics["cache_hits"] += 1
            
            return InferenceResult(
                request_id=request.request_id,
                result=cached_result,
                model_version="cached",
                execution_time=time.time() - start_time,
                cache_hit=True,
                batch_size=1,
                optimization_applied=optimization_applied
            )
        
        # Try batch processing for eligible requests
        if request.mode in [InferenceMode.BATCH, InferenceMode.ASYNC]:
            batch_ready, batch = self.batch_processor.add_request(request)
            if batch_ready:
                optimization_applied.append("batch_processing")
                return await self._process_batch(batch)
        
        # Process individual request
        result = await self._process_individual_request(request)
        
        # Cache result
        if result and not result.error:
            self.cache.put(cache_key, result.result, input_data=request.input_data)
            optimization_applied.append("cached_result")
        
        result.optimization_applied = optimization_applied
        self.performance_metrics["total_requests"] += 1
        
        return result
    
    async def process_batch(self, requests: List[InferenceRequest]) -> List[InferenceResult]:
        """Process batch of requests with optimizations"""
        
        if not requests:
            return []
        
        # Create batch request
        batch_request = BatchRequest(
            batch_id=f"batch_{uuid.uuid4().hex[:8]}",
            requests=requests,
            model_name=requests[0].model_name,
            batch_size=len(requests),
            priority=max(req.priority for req in requests),
            created_at=datetime.utcnow(),
            timeout=min(req.timeout for req in requests)
        )
        
        return await self._process_batch(batch_request)
    
    def get_performance_metrics(self) -> Dict[str, Any]:
        """Get comprehensive performance metrics"""
        
        cache_stats = self.cache.get_stats()
        
        return {
            "inference": self.performance_metrics,
            "cache": cache_stats,
            "optimization": {
                "cache_hit_rate": cache_stats["hit_rate"],
                "batch_efficiency": self._calculate_batch_efficiency(),
                "avg_batch_size": self._calculate_avg_batch_size(),
                "optimization_score": self._calculate_optimization_score()
            }
        }
    
    def _generate_cache_key(self, request: InferenceRequest) -> str:
        """Generate cache key for request"""
        
        if request.cache_key:
            return request.cache_key
        
        # Create hash of model name and input data
        input_hash = hash(json.dumps(request.input_data, sort_keys=True) 
                         if isinstance(request.input_data, (dict, list)) 
                         else str(request.input_data))
        
        return f"{request.model_name}:{input_hash}"
    
    async def _process_individual_request(self, request: InferenceRequest) -> InferenceResult:
        """Process individual request"""
        
        start_time = time.time()
        
        try:
            # Simulate model inference
            await asyncio.sleep(0.1)  # Simulate processing time
            
            # Mock result based on model name and input
            if "classification" in request.model_name:
                result = {"class": "positive", "confidence": 0.92}
            elif "generation" in request.model_name:
                result = {"text": f"Generated response for: {str(request.input_data)[:50]}..."}
            else:
                result = {"output": f"Processed by {request.model_name}"}
            
            return InferenceResult(
                request_id=request.request_id,
                result=result,
                model_version=f"{request.model_name}:v1.0",
                execution_time=time.time() - start_time,
                cache_hit=False,
                batch_size=1,
                optimization_applied=["individual_processing"]
            )
            
        except Exception as e:
            return InferenceResult(
                request_id=request.request_id,
                result=None,
                model_version=f"{request.model_name}:v1.0",
                execution_time=time.time() - start_time,
                cache_hit=False,
                batch_size=1,
                optimization_applied=[],
                error=str(e)
            )
    
    async def _process_batch(self, batch: BatchRequest) -> List[InferenceResult]:
        """Process batch of requests efficiently"""
        
        start_time = time.time()
        results = []
        
        try:
            # Simulate batch processing (more efficient than individual)
            batch_processing_time = 0.05 * len(batch.requests)  # Reduced per-item time
            await asyncio.sleep(batch_processing_time)
            
            # Create results for all requests in batch
            for request in batch.requests:
                if "classification" in request.model_name:
                    result = {"class": "positive", "confidence": 0.91}
                elif "generation" in request.model_name:
                    result = {"text": f"Batch generated: {str(request.input_data)[:30]}..."}
                else:
                    result = {"output": f"Batch processed by {request.model_name}"}
                
                inference_result = InferenceResult(
                    request_id=request.request_id,
                    result=result,
                    model_version=f"{request.model_name}:v1.0",
                    execution_time=time.time() - start_time,
                    cache_hit=False,
                    batch_size=len(batch.requests),
                    optimization_applied=["batch_processing"]
                )
                
                results.append(inference_result)
                
                # Cache individual results
                cache_key = self._generate_cache_key(request)
                self.cache.put(cache_key, result, input_data=request.input_data)
            
            self.performance_metrics["batch_processed"] += 1
            
        except Exception as e:
            # Create error results for all requests
            for request in batch.requests:
                error_result = InferenceResult(
                    request_id=request.request_id,
                    result=None,
                    model_version=f"{request.model_name}:v1.0",
                    execution_time=time.time() - start_time,
                    cache_hit=False,
                    batch_size=len(batch.requests),
                    optimization_applied=[],
                    error=str(e)
                )
                results.append(error_result)
        
        return results
    
    def _background_processor(self):
        """Background processing for optimization tasks"""
        
        while self.processing_active:
            try:
                # Process ready batches
                ready_batches = self.batch_processor.get_ready_batches()
                for batch in ready_batches:
                    # Submit batch for processing
                    future = self.executor.submit(self._process_batch_sync, batch)
                
                # Update performance metrics
                self._update_performance_metrics()
                
                time.sleep(0.05)  # 50ms processing cycle
                
            except Exception as e:
                print(f"Background processor error: {e}")
                time.sleep(1)  # Longer sleep on error
    
    def _process_batch_sync(self, batch: BatchRequest):
        """Synchronous wrapper for batch processing"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(self._process_batch(batch))
        finally:
            loop.close()
    
    def _update_performance_metrics(self):
        """Update performance metrics"""
        # This would calculate actual performance metrics in production
        pass
    
    def _calculate_batch_efficiency(self) -> float:
        """Calculate batch processing efficiency"""
        if self.performance_metrics["batch_processed"] == 0:
            return 0.0
        return min(1.0, self.performance_metrics["batch_processed"] / 
                  max(1, self.performance_metrics["total_requests"] / 10))
    
    def _calculate_avg_batch_size(self) -> float:
        """Calculate average batch size"""
        return 4.2  # Mock value
    
    def _calculate_optimization_score(self) -> float:
        """Calculate overall optimization effectiveness score"""
        cache_hit_rate = self.cache.get_stats()["hit_rate"]
        batch_efficiency = self._calculate_batch_efficiency()
        
        return (cache_hit_rate * 0.6 + batch_efficiency * 0.4)
    
    def shutdown(self):
        """Gracefully shutdown the optimizer"""
        self.processing_active = False
        if self.background_thread.is_alive():
            self.background_thread.join(timeout=5)
        self.executor.shutdown(wait=True)

# Global inference optimizer instance
inference_optimizer = InferenceOptimizer()

# Utility functions

async def optimized_inference(
    model_name: str,
    input_data: Any,
    priority: int = 5,
    mode: InferenceMode = InferenceMode.REAL_TIME,
    timeout: float = 30.0
) -> InferenceResult:
    """Convenience function for optimized inference"""
    
    request = InferenceRequest(
        request_id=f"req_{uuid.uuid4().hex[:8]}",
        model_name=model_name,
        input_data=input_data,
        priority=priority,
        mode=mode,
        timeout=timeout
    )
    
    return await inference_optimizer.process_request(request)

def create_inference_request(
    model_name: str,
    input_data: Any,
    **kwargs
) -> InferenceRequest:
    """Create inference request with defaults"""
    
    return InferenceRequest(
        request_id=f"req_{uuid.uuid4().hex[:8]}",
        model_name=model_name,
        input_data=input_data,
        **kwargs
    )

def get_optimization_recommendations() -> List[str]:
    """Get recommendations for improving inference performance"""
    
    metrics = inference_optimizer.get_performance_metrics()
    recommendations = []
    
    cache_hit_rate = metrics["cache"]["hit_rate"]
    if cache_hit_rate < 0.3:
        recommendations.append("Consider increasing cache size or TTL for better hit rates")
    
    batch_efficiency = metrics["optimization"]["batch_efficiency"]
    if batch_efficiency < 0.5:
        recommendations.append("Enable batch processing for improved throughput")
    
    if metrics["cache"]["memory_usage_mb"] > 1000:
        recommendations.append("Consider implementing cache compression or size limits")
    
    if not recommendations:
        recommendations.append("Inference optimization is performing well")
    
    return recommendations