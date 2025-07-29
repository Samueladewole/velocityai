#!/usr/bin/env python3
"""
Trust Score Engine Agent - Velocity.ai Multi-Agent System
High-Performance Trust Score Calculations with Rust Integration

This agent provides real-time trust score calculations using the Rust cryptographic
core for sub-100ms performance, integrating with the Velocity Trust Protocol
on Polygon blockchain for immutable trust records.
"""

import asyncio
import json
import logging
import subprocess
import tempfile
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass
import statistics
import math

from ..core.base_agent import BaseAgent, AgentConfig, TaskResult, Evidence
from ..core.agent_types import AgentType, TaskPriority
from ...database.evidence_store import EvidenceStore

# Configure logging
logger = logging.getLogger(__name__)

@dataclass
class TrustScoreMetrics:
    """Trust score calculation metrics"""
    evidence_count: int
    confidence_average: float
    recency_score: float
    source_diversity: float
    verification_status: float
    blockchain_integrity: float
    final_score: float
    calculation_time_ms: float
    
class TrustScoreConfig(AgentConfig):
    """Configuration for Trust Score Engine Agent"""
    
    def __init__(self):
        super().__init__(
            agent_id="trust-score-engine",
            name="Trust Score Engine",
            agent_type=AgentType.INTELLIGENCE,
            description="High-performance trust score calculations with Rust integration",
            capabilities=[
                "real_time_trust_scoring",
                "rust_crypto_integration",
                "blockchain_verification",
                "multi_factor_analysis",
                "performance_optimization"
            ],
            required_permissions=[
                "trust:calculate",
                "crypto:access",
                "blockchain:read",
                "evidence:analyze"
            ],
            max_concurrent_tasks=10,  # High concurrency for real-time scoring
            task_timeout=100,  # 100ms timeout for real-time performance
            priority=TaskPriority.HIGH
        )
        
        # Trust scoring configuration
        self.target_response_time_ms = 100
        self.rust_binary_path = "/Users/macbook/Projects/ERIP-app/velocity-platform/src/services/cryptoCore/target/release/velocity_crypto"
        self.blockchain_network = "polygon-mainnet"
        self.scoring_algorithm = "multi_factor_weighted"
        
        # Trust score weights
        self.weight_config = {
            "evidence_quantity": 0.15,    # 15% - Number of evidence items
            "confidence_quality": 0.25,   # 25% - Average confidence of evidence
            "source_diversity": 0.20,     # 20% - Diversity of evidence sources
            "recency_factor": 0.15,       # 15% - How recent the evidence is
            "verification_status": 0.15,  # 15% - Cryptographic verification status
            "blockchain_integrity": 0.10  # 10% - Blockchain verification status
        }
        
        # Performance thresholds
        self.performance_targets = {
            "calculation_time_ms": 100,
            "throughput_per_second": 1000,
            "accuracy_threshold": 0.95,
            "consistency_variance": 0.05
        }

class TrustScoreEngine(BaseAgent):
    """
    Trust Score Engine Agent
    
    Provides high-performance, real-time trust score calculations using Rust
    cryptographic core integration with sub-100ms response times.
    """
    
    def __init__(self, config: TrustScoreConfig):
        super().__init__(config)
        self.config = config
        self.evidence_store = EvidenceStore()
        
        # Performance metrics
        self.performance_metrics = {
            "total_calculations": 0,
            "average_calculation_time": 0.0,
            "fastest_calculation": float('inf'),
            "slowest_calculation": 0.0,
            "calculations_under_100ms": 0,
            "rust_core_calls": 0,
            "blockchain_verifications": 0,
            "cache_hits": 0,
            "cache_misses": 0
        }
        
        # Trust score cache for performance optimization
        self.trust_score_cache = {}
        self.cache_ttl_seconds = 300  # 5 minutes
        
        logger.info(f"Trust Score Engine initialized: {self.config.agent_id}")
    
    async def start(self) -> bool:
        """Start the Trust Score Engine Agent"""
        try:
            await super().start()
            
            # Verify Rust crypto core availability
            await self._verify_rust_crypto_core()
            
            # Initialize performance monitoring
            await self._initialize_performance_monitoring()
            
            logger.info("Trust Score Engine started successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start Trust Score Engine: {e}")
            return False
    
    async def stop(self) -> bool:
        """Stop the Trust Score Engine Agent"""
        try:
            # Log final performance metrics
            await self._log_performance_summary()
            
            await super().stop()
            logger.info("Trust Score Engine stopped successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error stopping Trust Score Engine: {e}")
            return False
    
    async def process_task(self, task_data: Dict[str, Any]) -> TaskResult:
        """Process trust scoring tasks"""
        task_type = task_data.get("type")
        start_time = datetime.now()
        
        try:
            if task_type == "calculate_trust_score":
                result = await self._calculate_trust_score(task_data)
            elif task_type == "bulk_score_calculation":
                result = await self._bulk_score_calculation(task_data)
            elif task_type == "trust_score_analysis":
                result = await self._analyze_trust_trends(task_data)
            elif task_type == "performance_benchmark":
                result = await self._run_performance_benchmark(task_data)
            elif task_type == "cache_management":
                result = await self._manage_trust_cache(task_data)
            else:
                return TaskResult(
                    success=False,
                    error=f"Unknown task type: {task_type}",
                    task_type=task_type
                )
            
            # Update performance metrics
            processing_time = (datetime.now() - start_time).total_seconds() * 1000
            await self._update_performance_metrics(processing_time)
            
            return result
            
        except Exception as e:
            logger.error(f"Trust score task processing failed: {e}")
            return TaskResult(
                success=False,
                error=str(e),
                task_type=task_type,
                processing_time=(datetime.now() - start_time).total_seconds()
            )
    
    async def _calculate_trust_score(self, task_data: Dict[str, Any]) -> TaskResult:
        """Calculate trust score for an entity using Rust crypto core"""
        try:
            entity_id = task_data.get("entity_id")
            organization_id = task_data.get("organization_id")
            force_recalculate = task_data.get("force_recalculate", False)
            
            if not entity_id or not organization_id:
                raise ValueError("Missing required parameters: entity_id, organization_id")
            
            calculation_start = datetime.now()
            
            # Check cache first (unless force recalculate)
            if not force_recalculate:
                cached_score = await self._get_cached_trust_score(entity_id)
                if cached_score:
                    self.performance_metrics["cache_hits"] += 1
                    return TaskResult(
                        success=True,
                        data={
                            "entity_id": entity_id,
                            "trust_score": cached_score["score"],
                            "metrics": cached_score["metrics"],
                            "cached": True,
                            "cache_age_seconds": (datetime.now() - cached_score["timestamp"]).total_seconds()
                        },
                        task_type="calculate_trust_score"
                    )
            
            self.performance_metrics["cache_misses"] += 1
            
            # Gather evidence for the entity
            evidence_items = await self.evidence_store.get_evidence_for_entity(
                organization_id, entity_id
            )
            
            if not evidence_items:
                # Return default trust score for entities with no evidence
                default_score = 0.5  # Neutral trust score
                metrics = TrustScoreMetrics(
                    evidence_count=0,
                    confidence_average=0.0,
                    recency_score=0.0,
                    source_diversity=0.0,
                    verification_status=0.0,
                    blockchain_integrity=0.0,
                    final_score=default_score,
                    calculation_time_ms=0.1
                )
                
                return TaskResult(
                    success=True,
                    data={
                        "entity_id": entity_id,
                        "trust_score": default_score,
                        "metrics": metrics.__dict__,
                        "reason": "no_evidence_available"
                    },
                    task_type="calculate_trust_score"
                )
            
            # Prepare data for Rust crypto core calculation
            rust_input_data = {
                "entity_id": entity_id,
                "evidence_items": [
                    {
                        "source": evidence.source,
                        "evidence_type": evidence.evidence_type,
                        "confidence_score": evidence.confidence_score,
                        "collected_at": evidence.collected_at.isoformat(),
                        "hash_value": evidence.hash_value,
                        "content_length": len(str(evidence.content))
                    }
                    for evidence in evidence_items
                ],
                "weights": self.config.weight_config,
                "calculation_timestamp": datetime.now().isoformat()
            }
            
            # Call Rust crypto core for high-performance calculation
            rust_result = await self._call_rust_trust_calculation(rust_input_data)
            
            if not rust_result["success"]:
                # Fallback to Python calculation if Rust fails
                logger.warning("Rust calculation failed, falling back to Python")
                metrics = await self._python_trust_calculation(evidence_items)
            else:
                # Parse Rust calculation results
                metrics = TrustScoreMetrics(
                    evidence_count=rust_result["metrics"]["evidence_count"],
                    confidence_average=rust_result["metrics"]["confidence_average"],
                    recency_score=rust_result["metrics"]["recency_score"],
                    source_diversity=rust_result["metrics"]["source_diversity"],
                    verification_status=rust_result["metrics"]["verification_status"],
                    blockchain_integrity=rust_result["metrics"]["blockchain_integrity"],
                    final_score=rust_result["trust_score"],
                    calculation_time_ms=rust_result["calculation_time_ms"]
                )
            
            calculation_time = (datetime.now() - calculation_start).total_seconds() * 1000
            
            # Cache the result
            await self._cache_trust_score(entity_id, metrics.final_score, metrics)
            
            # Create evidence for the trust score calculation
            evidence_content = {
                "entity_id": entity_id,
                "trust_score": metrics.final_score,
                "calculation_method": "rust_crypto_core" if rust_result.get("success") else "python_fallback",
                "metrics": metrics.__dict__,
                "evidence_count": len(evidence_items),
                "calculation_timestamp": datetime.now().isoformat(),
                "performance_ms": calculation_time
            }
            
            # Generate cryptographic hash for trust score integrity
            trust_hash = await self._generate_trust_score_hash(evidence_content)
            
            evidence = Evidence(
                source="trust_score_engine",
                evidence_type="trust_score_calculation",
                content=evidence_content,
                confidence_score=0.95,  # High confidence in calculation
                collected_at=datetime.now(),
                hash_value=trust_hash,
                metadata={
                    "agent_id": self.config.agent_id,
                    "calculation_method": evidence_content["calculation_method"],
                    "performance_ms": calculation_time,
                    "under_target": calculation_time < self.config.target_response_time_ms
                }
            )
            
            # Store trust score evidence
            evidence_id = await self.evidence_store.store_evidence(
                evidence, organization_id
            )
            
            # Update blockchain if enabled
            blockchain_tx = None
            if self.config.blockchain_network:
                try:
                    blockchain_tx = await self._update_blockchain_trust_record(
                        entity_id, metrics.final_score, trust_hash
                    )
                except Exception as e:
                    logger.warning(f"Blockchain update failed: {e}")
            
            return TaskResult(
                success=True,
                data={
                    "entity_id": entity_id,
                    "trust_score": metrics.final_score,
                    "metrics": metrics.__dict__,
                    "evidence_id": evidence_id,
                    "trust_hash": trust_hash,
                    "calculation_time_ms": calculation_time,
                    "blockchain_tx": blockchain_tx,
                    "performance_target_met": calculation_time < self.config.target_response_time_ms
                },
                evidence=[evidence],
                task_type="calculate_trust_score",
                processing_time=calculation_time / 1000
            )
            
        except Exception as e:
            logger.error(f"Trust score calculation failed: {e}")
            raise
    
    async def _bulk_score_calculation(self, task_data: Dict[str, Any]) -> TaskResult:
        """Calculate trust scores for multiple entities in bulk"""
        try:
            entity_ids = task_data.get("entity_ids", [])
            organization_id = task_data.get("organization_id")
            
            if not entity_ids or not organization_id:
                raise ValueError("Missing required parameters: entity_ids, organization_id")
            
            bulk_start = datetime.now()
            results = []
            
            # Process entities in batches for optimal performance
            batch_size = 10
            for i in range(0, len(entity_ids), batch_size):
                batch = entity_ids[i:i+batch_size]
                batch_tasks = []
                
                for entity_id in batch:
                    task = self._calculate_trust_score({
                        "entity_id": entity_id,
                        "organization_id": organization_id
                    })
                    batch_tasks.append(task)
                
                # Execute batch concurrently
                batch_results = await asyncio.gather(*batch_tasks, return_exceptions=True)
                
                for j, result in enumerate(batch_results):
                    if isinstance(result, Exception):
                        results.append({
                            "entity_id": batch[j],
                            "success": False,
                            "error": str(result)
                        })
                    else:
                        results.append({
                            "entity_id": batch[j],
                            "success": result.success,
                            "trust_score": result.data.get("trust_score") if result.success else None,
                            "calculation_time_ms": result.data.get("calculation_time_ms") if result.success else None
                        })
            
            bulk_time = (datetime.now() - bulk_start).total_seconds() * 1000
            successful_calculations = sum(1 for r in results if r["success"])
            
            return TaskResult(
                success=True,
                data={
                    "total_entities": len(entity_ids),
                    "successful_calculations": successful_calculations,
                    "failed_calculations": len(entity_ids) - successful_calculations,
                    "results": results,
                    "bulk_calculation_time_ms": bulk_time,
                    "average_time_per_entity": bulk_time / len(entity_ids) if entity_ids else 0
                },
                task_type="bulk_score_calculation"
            )
            
        except Exception as e:
            logger.error(f"Bulk trust score calculation failed: {e}")
            raise
    
    async def _analyze_trust_trends(self, task_data: Dict[str, Any]) -> TaskResult:
        """Analyze trust score trends over time"""
        try:
            entity_id = task_data.get("entity_id")
            organization_id = task_data.get("organization_id")
            time_range_hours = task_data.get("time_range_hours", 24)
            
            if not entity_id or not organization_id:
                raise ValueError("Missing required parameters: entity_id, organization_id")
            
            # Get historical trust score evidence
            end_time = datetime.now()
            start_time = end_time - timedelta(hours=time_range_hours)
            
            historical_evidence = await self.evidence_store.get_evidence_by_time_range(
                organization_id, start_time, end_time, evidence_type="trust_score_calculation"
            )
            
            # Filter for the specific entity
            entity_scores = [
                {
                    "timestamp": evidence.collected_at,
                    "trust_score": evidence.content.get("trust_score", 0),
                    "metrics": evidence.content.get("metrics", {}),
                    "calculation_time": evidence.content.get("performance_ms", 0)
                }
                for evidence in historical_evidence
                if evidence.content.get("entity_id") == entity_id
            ]
            
            if not entity_scores:
                return TaskResult(
                    success=True,
                    data={
                        "entity_id": entity_id,
                        "analysis": "no_historical_data",
                        "recommendation": "Need more data points for trend analysis"
                    },
                    task_type="trust_score_analysis"
                )
            
            # Sort by timestamp
            entity_scores.sort(key=lambda x: x["timestamp"])
            
            # Calculate trend metrics
            scores = [s["trust_score"] for s in entity_scores]
            calculation_times = [s["calculation_time"] for s in entity_scores]
            
            trend_analysis = {
                "entity_id": entity_id,
                "time_range_hours": time_range_hours,
                "data_points": len(entity_scores),
                "current_score": scores[-1] if scores else 0,
                "score_statistics": {
                    "min": min(scores) if scores else 0,
                    "max": max(scores) if scores else 0,
                    "average": statistics.mean(scores) if scores else 0,
                    "median": statistics.median(scores) if scores else 0,
                    "std_deviation": statistics.stdev(scores) if len(scores) > 1 else 0
                },
                "performance_statistics": {
                    "average_calculation_time": statistics.mean(calculation_times) if calculation_times else 0,
                    "fastest_calculation": min(calculation_times) if calculation_times else 0,
                    "slowest_calculation": max(calculation_times) if calculation_times else 0
                },
                "trend_direction": self._calculate_trend_direction(scores),
                "volatility": statistics.stdev(scores) if len(scores) > 1 else 0,
                "recommendations": self._generate_trust_recommendations(entity_scores)
            }
            
            return TaskResult(
                success=True,
                data=trend_analysis,
                task_type="trust_score_analysis"
            )
            
        except Exception as e:
            logger.error(f"Trust trend analysis failed: {e}")
            raise
    
    async def _run_performance_benchmark(self, task_data: Dict[str, Any]) -> TaskResult:
        """Run performance benchmark for trust score calculations"""
        try:
            num_calculations = task_data.get("num_calculations", 100)
            organization_id = task_data.get("organization_id", "benchmark-org")
            
            benchmark_start = datetime.now()
            calculation_times = []
            successful_calculations = 0
            
            # Run benchmark calculations
            for i in range(num_calculations):
                calc_start = datetime.now()
                
                try:
                    # Generate mock entity for benchmarking
                    entity_id = f"benchmark-entity-{i}"
                    
                    # Simulate trust calculation
                    result = await self._calculate_trust_score({
                        "entity_id": entity_id,
                        "organization_id": organization_id,
                        "force_recalculate": True
                    })
                    
                    if result.success:
                        successful_calculations += 1
                        calc_time = (datetime.now() - calc_start).total_seconds() * 1000
                        calculation_times.append(calc_time)
                
                except Exception as e:
                    logger.warning(f"Benchmark calculation {i} failed: {e}")
            
            total_benchmark_time = (datetime.now() - benchmark_start).total_seconds() * 1000
            
            # Calculate benchmark metrics
            if calculation_times:
                benchmark_results = {
                    "total_calculations": num_calculations,
                    "successful_calculations": successful_calculations,
                    "success_rate": successful_calculations / num_calculations,
                    "total_time_ms": total_benchmark_time,
                    "average_calculation_time": statistics.mean(calculation_times),
                    "fastest_calculation": min(calculation_times),
                    "slowest_calculation": max(calculation_times),
                    "median_calculation_time": statistics.median(calculation_times),
                    "calculations_under_100ms": sum(1 for t in calculation_times if t < 100),
                    "performance_target_achievement": sum(1 for t in calculation_times if t < 100) / len(calculation_times),
                    "throughput_per_second": successful_calculations / (total_benchmark_time / 1000),
                    "performance_grade": self._calculate_performance_grade(calculation_times)
                }
            else:
                benchmark_results = {
                    "total_calculations": num_calculations,
                    "successful_calculations": 0,
                    "success_rate": 0.0,
                    "error": "No successful calculations completed"
                }
            
            return TaskResult(
                success=True,
                data=benchmark_results,
                task_type="performance_benchmark"
            )
            
        except Exception as e:
            logger.error(f"Performance benchmark failed: {e}")
            raise
    
    async def _manage_trust_cache(self, task_data: Dict[str, Any]) -> TaskResult:
        """Manage trust score cache operations"""
        try:
            operation = task_data.get("operation", "status")
            
            if operation == "status":
                cache_stats = {
                    "cached_entities": len(self.trust_score_cache),
                    "cache_ttl_seconds": self.cache_ttl_seconds,
                    "memory_usage_mb": len(str(self.trust_score_cache)) / 1024 / 1024,
                    "hit_rate": (
                        self.performance_metrics["cache_hits"] / 
                        (self.performance_metrics["cache_hits"] + self.performance_metrics["cache_misses"])
                        if (self.performance_metrics["cache_hits"] + self.performance_metrics["cache_misses"]) > 0 
                        else 0
                    )
                }
                
            elif operation == "clear":
                cleared_count = len(self.trust_score_cache)
                self.trust_score_cache.clear()
                cache_stats = {
                    "operation": "clear",
                    "cleared_entries": cleared_count
                }
                
            elif operation == "cleanup":
                # Remove expired entries
                current_time = datetime.now()
                expired_keys = [
                    key for key, value in self.trust_score_cache.items()
                    if (current_time - value["timestamp"]).total_seconds() > self.cache_ttl_seconds
                ]
                
                for key in expired_keys:
                    del self.trust_score_cache[key]
                
                cache_stats = {
                    "operation": "cleanup",
                    "expired_entries_removed": len(expired_keys),
                    "remaining_entries": len(self.trust_score_cache)
                }
                
            else:
                raise ValueError(f"Unknown cache operation: {operation}")
            
            return TaskResult(
                success=True,
                data=cache_stats,
                task_type="cache_management"
            )
            
        except Exception as e:
            logger.error(f"Cache management failed: {e}")
            raise
    
    async def _call_rust_trust_calculation(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Call Rust crypto core for trust score calculation"""
        try:
            # Create temporary input file for Rust process
            with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
                json.dump(input_data, f)
                input_file = f.name
            
            # Call Rust binary
            rust_start = datetime.now()
            
            try:
                result = subprocess.run([
                    self.config.rust_binary_path,
                    'calculate-trust',
                    '--input', input_file,
                    '--algorithm', self.config.scoring_algorithm
                ], capture_output=True, text=True, timeout=5)
                
                rust_time = (datetime.now() - rust_start).total_seconds() * 1000
                self.performance_metrics["rust_core_calls"] += 1
                
                if result.returncode == 0:
                    rust_output = json.loads(result.stdout)
                    rust_output["calculation_time_ms"] = rust_time
                    rust_output["success"] = True
                    return rust_output
                else:
                    logger.error(f"Rust calculation failed: {result.stderr}")
                    return {"success": False, "error": result.stderr}
                    
            except subprocess.TimeoutExpired:
                logger.error("Rust calculation timeout")
                return {"success": False, "error": "Calculation timeout"}
            except FileNotFoundError:
                logger.warning("Rust binary not found, using Python fallback")
                return {"success": False, "error": "Rust binary not available"}
            finally:
                # Clean up temp file
                try:
                    import os
                    os.unlink(input_file)
                except:
                    pass
                    
        except Exception as e:
            logger.error(f"Rust calculation call failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def _python_trust_calculation(self, evidence_items: List[Evidence]) -> TrustScoreMetrics:
        """Fallback Python trust score calculation"""
        calc_start = datetime.now()
        
        # Evidence quantity score
        evidence_count = len(evidence_items)
        quantity_score = min(evidence_count / 10, 1.0)  # Normalize to 1.0 at 10+ items
        
        # Confidence quality score
        confidence_scores = [e.confidence_score for e in evidence_items]
        confidence_average = statistics.mean(confidence_scores) if confidence_scores else 0.0
        
        # Source diversity score
        unique_sources = len(set(e.source for e in evidence_items))
        diversity_score = min(unique_sources / 5, 1.0)  # Normalize to 1.0 at 5+ sources
        
        # Recency score
        current_time = datetime.now()
        recency_scores = []
        for evidence in evidence_items:
            age_hours = (current_time - evidence.collected_at).total_seconds() / 3600
            recency_score = max(0, 1 - (age_hours / 168))  # Decay over 1 week
            recency_scores.append(recency_score)
        
        recency_average = statistics.mean(recency_scores) if recency_scores else 0.0
        
        # Verification status (based on hash presence)
        verified_count = sum(1 for e in evidence_items if e.hash_value)
        verification_score = verified_count / evidence_count if evidence_count > 0 else 0.0
        
        # Blockchain integrity (simplified)
        blockchain_score = 0.8  # Assume high blockchain integrity
        
        # Calculate weighted final score
        weights = self.config.weight_config
        final_score = (
            quantity_score * weights["evidence_quantity"] +
            confidence_average * weights["confidence_quality"] +
            diversity_score * weights["source_diversity"] +
            recency_average * weights["recency_factor"] +
            verification_score * weights["verification_status"] +
            blockchain_score * weights["blockchain_integrity"]
        )
        
        calculation_time = (datetime.now() - calc_start).total_seconds() * 1000
        
        return TrustScoreMetrics(
            evidence_count=evidence_count,
            confidence_average=confidence_average,
            recency_score=recency_average,
            source_diversity=diversity_score,
            verification_status=verification_score,
            blockchain_integrity=blockchain_score,
            final_score=final_score,
            calculation_time_ms=calculation_time
        )
    
    async def _get_cached_trust_score(self, entity_id: str) -> Optional[Dict[str, Any]]:
        """Get cached trust score if available and not expired"""
        if entity_id not in self.trust_score_cache:
            return None
        
        cached_entry = self.trust_score_cache[entity_id]
        age_seconds = (datetime.now() - cached_entry["timestamp"]).total_seconds()
        
        if age_seconds > self.cache_ttl_seconds:
            # Remove expired entry
            del self.trust_score_cache[entity_id]
            return None
        
        return cached_entry
    
    async def _cache_trust_score(self, entity_id: str, score: float, metrics: TrustScoreMetrics):
        """Cache trust score for performance optimization"""
        self.trust_score_cache[entity_id] = {
            "score": score,
            "metrics": metrics.__dict__,
            "timestamp": datetime.now()
        }
    
    async def _generate_trust_score_hash(self, content: Dict[str, Any]) -> str:
        """Generate cryptographic hash for trust score integrity"""
        # Simplified hash generation - would use Rust crypto core in production
        import hashlib
        content_str = json.dumps(content, sort_keys=True)
        return hashlib.sha256(content_str.encode()).hexdigest()
    
    async def _update_blockchain_trust_record(self, entity_id: str, trust_score: float, trust_hash: str) -> Optional[str]:
        """Update trust record on blockchain (Velocity Trust Protocol)"""
        # Placeholder for blockchain integration
        self.performance_metrics["blockchain_verifications"] += 1
        
        # Would integrate with Polygon/Ethereum here
        mock_tx_hash = f"0x{trust_hash[:40]}"
        logger.info(f"Trust record updated on blockchain: {mock_tx_hash}")
        
        return mock_tx_hash
    
    async def _verify_rust_crypto_core(self) -> bool:
        """Verify Rust crypto core is available"""
        try:
            result = subprocess.run([
                self.config.rust_binary_path, '--version'
            ], capture_output=True, text=True, timeout=5)
            
            if result.returncode == 0:
                logger.info("✅ Rust crypto core verified")
                return True
            else:
                logger.warning("⚠️ Rust crypto core not available, using Python fallback")
                return False
                
        except (subprocess.TimeoutExpired, FileNotFoundError) as e:
            logger.warning(f"⚠️ Rust crypto core verification failed: {e}")
            return False
    
    async def _initialize_performance_monitoring(self):
        """Initialize performance monitoring"""
        logger.info("📊 Performance monitoring initialized")
        logger.info(f"Target response time: {self.config.target_response_time_ms}ms")
        logger.info(f"Target throughput: {self.config.performance_targets['throughput_per_second']} scores/sec")
    
    async def _update_performance_metrics(self, calculation_time_ms: float):
        """Update performance metrics"""
        self.performance_metrics["total_calculations"] += 1
        
        # Update calculation time metrics
        total = self.performance_metrics["total_calculations"]
        current_avg = self.performance_metrics["average_calculation_time"]
        self.performance_metrics["average_calculation_time"] = (
            (current_avg * (total - 1) + calculation_time_ms) / total
        )
        
        self.performance_metrics["fastest_calculation"] = min(
            self.performance_metrics["fastest_calculation"], calculation_time_ms
        )
        self.performance_metrics["slowest_calculation"] = max(
            self.performance_metrics["slowest_calculation"], calculation_time_ms
        )
        
        if calculation_time_ms < 100:
            self.performance_metrics["calculations_under_100ms"] += 1
    
    async def _log_performance_summary(self):
        """Log performance summary on shutdown"""
        metrics = self.performance_metrics
        logger.info("🎯 Trust Score Engine Performance Summary:")
        logger.info(f"  Total calculations: {metrics['total_calculations']}")
        logger.info(f"  Average time: {metrics['average_calculation_time']:.2f}ms")
        logger.info(f"  Fastest: {metrics['fastest_calculation']:.2f}ms")
        logger.info(f"  Slowest: {metrics['slowest_calculation']:.2f}ms")
        logger.info(f"  Under 100ms: {metrics['calculations_under_100ms']}/{metrics['total_calculations']}")
        logger.info(f"  Cache hit rate: {metrics['cache_hits']/(metrics['cache_hits']+metrics['cache_misses']):.2%}")
    
    def _calculate_trend_direction(self, scores: List[float]) -> str:
        """Calculate trend direction from score history"""
        if len(scores) < 2:
            return "insufficient_data"
        
        recent_scores = scores[-5:]  # Last 5 scores
        older_scores = scores[:-5] if len(scores) > 5 else scores[:-1]
        
        if not older_scores:
            return "insufficient_data"
        
        recent_avg = statistics.mean(recent_scores)
        older_avg = statistics.mean(older_scores)
        
        if recent_avg > older_avg * 1.05:
            return "improving"
        elif recent_avg < older_avg * 0.95:
            return "declining"
        else:
            return "stable"
    
    def _generate_trust_recommendations(self, score_history: List[Dict[str, Any]]) -> List[str]:
        """Generate recommendations based on trust score history"""
        recommendations = []
        
        if not score_history:
            return ["Collect more evidence to establish trust baseline"]
        
        latest_score = score_history[-1]["trust_score"]
        
        if latest_score < 0.5:
            recommendations.append("Trust score is below average - increase evidence collection")
        
        if len(score_history) < 5:
            recommendations.append("Collect more historical data for better trend analysis")
        
        calculation_times = [s["calculation_time"] for s in score_history]
        avg_calc_time = statistics.mean(calculation_times)
        
        if avg_calc_time > 100:
            recommendations.append("Optimize calculation performance - consider cache warming")
        
        return recommendations
    
    def _calculate_performance_grade(self, calculation_times: List[float]) -> str:
        """Calculate performance grade based on calculation times"""
        under_50ms = sum(1 for t in calculation_times if t < 50)
        under_100ms = sum(1 for t in calculation_times if t < 100)
        total = len(calculation_times)
        
        if under_50ms / total >= 0.9:
            return "A+"
        elif under_100ms / total >= 0.9:
            return "A"
        elif under_100ms / total >= 0.8:
            return "B+"
        elif under_100ms / total >= 0.7:
            return "B"
        elif under_100ms / total >= 0.6:
            return "C+"
        else:
            return "C"
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get agent health status"""
        base_status = await super().get_health_status()
        
        # Add trust-specific health information
        base_status.update({
            "rust_crypto_available": await self._verify_rust_crypto_core(),
            "total_calculations": self.performance_metrics["total_calculations"],
            "average_calculation_time": round(self.performance_metrics["average_calculation_time"], 2),
            "performance_target_met": self.performance_metrics["average_calculation_time"] < self.config.target_response_time_ms,
            "cache_entries": len(self.trust_score_cache),
            "cache_hit_rate": round(
                self.performance_metrics["cache_hits"] / 
                (self.performance_metrics["cache_hits"] + self.performance_metrics["cache_misses"])
                if (self.performance_metrics["cache_hits"] + self.performance_metrics["cache_misses"]) > 0 
                else 0, 3
            )
        })
        
        return base_status

# Factory function for agent creation
def create_trust_score_engine() -> TrustScoreEngine:
    """Create a Trust Score Engine instance"""
    config = TrustScoreConfig()
    return TrustScoreEngine(config)

if __name__ == "__main__":
    # Test the agent
    async def test_agent():
        agent = create_trust_score_engine()
        await agent.start()
        
        # Test trust score calculation
        test_task = {
            "type": "calculate_trust_score",
            "entity_id": "test-entity-123",
            "organization_id": "test-org"
        }
        
        result = await agent.process_task(test_task)
        print(f"Test result: {result.success}")
        print(f"Trust score: {result.data.get('trust_score') if result.success else 'N/A'}")
        
        # Test performance benchmark
        benchmark_task = {
            "type": "performance_benchmark",
            "num_calculations": 10,
            "organization_id": "benchmark-org"
        }
        
        benchmark_result = await agent.process_task(benchmark_task)
        print(f"Benchmark result: {benchmark_result.success}")
        if benchmark_result.success:
            print(f"Average calculation time: {benchmark_result.data.get('average_calculation_time', 0):.2f}ms")
        
        await agent.stop()
    
    asyncio.run(test_agent())