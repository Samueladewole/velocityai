"""
Agent Performance Optimization System for Velocity AI Platform
Continuously optimizes agent performance through ML-driven insights and adaptive configurations
"""

import asyncio
import json
import uuid
import time
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional, Union, Tuple
from enum import Enum
from dataclasses import dataclass, field, asdict
from collections import defaultdict, deque
import logging
import numpy as np
import pandas as pd

from pydantic import BaseModel, Field
import structlog
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

# ML libraries
from sklearn.ensemble import RandomForestRegressor
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
import joblib

from agent_orchestration import AgentType, TaskType, TaskStatus, orchestrator
from models import Agent, AgentExecutionLog, Organization
from ml_pipeline import MLPipeline, get_ml_pipeline

logger = structlog.get_logger()

class OptimizationType(Enum):
    """Types of optimization strategies"""
    PERFORMANCE_TUNING = "performance_tuning"
    RESOURCE_ALLOCATION = "resource_allocation"
    TASK_SCHEDULING = "task_scheduling"
    CONFIGURATION_ADAPTATION = "configuration_adaptation"
    LOAD_BALANCING = "load_balancing"
    CAPACITY_SCALING = "capacity_scaling"
    ERROR_REDUCTION = "error_reduction"
    EFFICIENCY_IMPROVEMENT = "efficiency_improvement"

class OptimizationStatus(Enum):
    """Status of optimization processes"""
    ANALYZING = "analyzing"
    OPTIMIZING = "optimizing"
    TESTING = "testing"
    DEPLOYING = "deploying"
    MONITORING = "monitoring"
    COMPLETED = "completed"
    FAILED = "failed"
    ROLLED_BACK = "rolled_back"

class PerformanceMetric(Enum):
    """Agent performance metrics"""
    SUCCESS_RATE = "success_rate"
    EXECUTION_TIME = "execution_time"
    THROUGHPUT = "throughput"
    ERROR_RATE = "error_rate"
    RESOURCE_UTILIZATION = "resource_utilization"
    QUEUE_TIME = "queue_time"
    COMPLETION_RATE = "completion_rate"
    QUALITY_SCORE = "quality_score"

@dataclass
class PerformanceData:
    """Agent performance data point"""
    agent_id: str
    agent_type: AgentType
    organization_id: str
    
    # Performance metrics
    success_rate: float
    avg_execution_time: float
    throughput: float  # Tasks per hour
    error_rate: float
    resource_utilization: float
    
    # Quality metrics
    output_quality_score: float
    confidence_score: float
    
    # Context
    task_types: List[TaskType] = field(default_factory=list)
    workload_size: int = 0
    configuration: Dict[str, Any] = field(default_factory=dict)
    
    # Timing
    measurement_period: timedelta = field(default_factory=lambda: timedelta(hours=24))
    measured_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

@dataclass
class OptimizationRecommendation:
    """Optimization recommendation for an agent"""
    recommendation_id: str
    agent_id: str
    optimization_type: OptimizationType
    
    # Recommendation details
    title: str
    description: str
    expected_improvement: Dict[str, float]  # metric -> improvement percentage
    confidence: float
    
    # Implementation
    configuration_changes: Dict[str, Any] = field(default_factory=dict)
    resource_changes: Dict[str, Any] = field(default_factory=dict)
    implementation_effort: str = "low"  # low, medium, high
    
    # Risk assessment
    risk_level: str = "low"  # low, medium, high
    rollback_plan: Dict[str, Any] = field(default_factory=dict)
    
    # Status
    status: OptimizationStatus = OptimizationStatus.ANALYZING
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    implemented_at: Optional[datetime] = None
    
    # Results tracking
    actual_improvement: Dict[str, float] = field(default_factory=dict)
    success: Optional[bool] = None

@dataclass
class OptimizationExperiment:
    """Controlled optimization experiment"""
    experiment_id: str
    name: str
    description: str
    
    # Experiment setup
    agent_ids: List[str]
    control_group: List[str]
    treatment_group: List[str]
    
    # Configuration
    baseline_config: Dict[str, Any]
    optimized_config: Dict[str, Any]
    
    # Metrics to track
    target_metrics: List[PerformanceMetric]
    success_criteria: Dict[str, float]
    
    # Timing
    duration_hours: int = 24
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    # Results
    baseline_performance: Dict[str, float] = field(default_factory=dict)
    optimized_performance: Dict[str, float] = field(default_factory=dict)
    statistical_significance: Dict[str, float] = field(default_factory=dict)
    
    # Status
    status: str = "planned"  # planned, running, completed, failed
    success: Optional[bool] = None

class PerformanceAnalyzer:
    """Analyzes agent performance data and identifies optimization opportunities"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.performance_history: Dict[str, List[PerformanceData]] = defaultdict(list)
        self.baseline_metrics: Dict[str, Dict[str, float]] = {}
    
    async def collect_performance_data(self, agent_id: str) -> PerformanceData:
        """Collect current performance data for an agent"""
        
        try:
            # Get agent from database
            agent = self.db.query(Agent).filter(Agent.id == agent_id).first()
            if not agent:
                raise ValueError(f"Agent not found: {agent_id}")
            
            # Get recent execution logs
            cutoff_time = datetime.now(timezone.utc) - timedelta(hours=24)
            logs = self.db.query(AgentExecutionLog).filter(
                AgentExecutionLog.agent_id == agent_id,
                AgentExecutionLog.created_at >= cutoff_time
            ).all()
            
            # Calculate performance metrics
            if logs:
                success_count = len([log for log in logs if log.status == "completed"])
                total_count = len(logs)
                error_count = len([log for log in logs if log.status == "failed"])
                
                execution_times = [
                    log.execution_time for log in logs 
                    if log.execution_time and log.status == "completed"
                ]
                
                success_rate = success_count / total_count if total_count > 0 else 0.0
                error_rate = error_count / total_count if total_count > 0 else 0.0
                avg_execution_time = np.mean(execution_times) if execution_times else 0.0
                throughput = success_count / 24.0  # Tasks per hour
                
                # Quality metrics (simplified)
                quality_scores = [
                    log.output_data.get("quality_score", 0.5) 
                    for log in logs 
                    if log.output_data and log.status == "completed"
                ]
                output_quality_score = np.mean(quality_scores) if quality_scores else 0.5
                
                confidence_scores = [
                    log.output_data.get("confidence", 0.5) 
                    for log in logs 
                    if log.output_data and log.status == "completed"
                ]
                confidence_score = np.mean(confidence_scores) if confidence_scores else 0.5
                
            else:
                # No recent data
                success_rate = agent.success_rate or 0.0
                error_rate = 1.0 - success_rate
                avg_execution_time = agent.avg_collection_time or 0.0
                throughput = 0.0
                output_quality_score = 0.5
                confidence_score = 0.5
            
            # Create performance data
            performance_data = PerformanceData(
                agent_id=agent_id,
                agent_type=AgentType(agent.platform.value),  # Map platform to agent type
                organization_id=str(agent.organization_id),
                success_rate=success_rate,
                avg_execution_time=avg_execution_time,
                throughput=throughput,
                error_rate=error_rate,
                resource_utilization=0.7,  # Placeholder - would be from monitoring
                output_quality_score=output_quality_score,
                confidence_score=confidence_score,
                workload_size=total_count if logs else 0,
                configuration=agent.configuration or {}
            )
            
            # Store in history
            self.performance_history[agent_id].append(performance_data)
            
            # Limit history size
            if len(self.performance_history[agent_id]) > 100:
                self.performance_history[agent_id] = self.performance_history[agent_id][-100:]
            
            return performance_data
            
        except Exception as e:
            logger.error(f"Failed to collect performance data for agent {agent_id}: {e}")
            raise
    
    async def analyze_performance_trends(self, agent_id: str) -> Dict[str, Any]:
        """Analyze performance trends for an agent"""
        
        if agent_id not in self.performance_history:
            await self.collect_performance_data(agent_id)
        
        history = self.performance_history[agent_id]
        
        if len(history) < 2:
            return {
                "trend": "insufficient_data",
                "message": "Need more historical data for trend analysis"
            }
        
        # Extract metrics over time
        times = [data.measured_at for data in history]
        success_rates = [data.success_rate for data in history]
        execution_times = [data.avg_execution_time for data in history]
        throughput = [data.throughput for data in history]
        error_rates = [data.error_rate for data in history]
        
        # Calculate trends
        trends = {}
        
        for metric_name, values in [
            ("success_rate", success_rates),
            ("execution_time", execution_times),
            ("throughput", throughput),
            ("error_rate", error_rates)
        ]:
            if len(values) >= 3:
                # Simple trend calculation
                recent_avg = np.mean(values[-3:])
                older_avg = np.mean(values[:3])
                trend_direction = "improving" if recent_avg > older_avg else "declining"
                
                if metric_name in ["execution_time", "error_rate"]:
                    # Lower is better for these metrics
                    trend_direction = "improving" if recent_avg < older_avg else "declining"
                
                trends[metric_name] = {
                    "direction": trend_direction,
                    "change_percentage": abs(recent_avg - older_avg) / max(older_avg, 0.001) * 100,
                    "current_value": values[-1],
                    "best_value": max(values) if metric_name in ["success_rate", "throughput"] else min(values),
                    "worst_value": min(values) if metric_name in ["success_rate", "throughput"] else max(values)
                }
        
        return {
            "agent_id": agent_id,
            "analysis_period": len(history),
            "trends": trends,
            "overall_trend": self._determine_overall_trend(trends),
            "analysis_date": datetime.now(timezone.utc).isoformat()
        }
    
    def _determine_overall_trend(self, trends: Dict[str, Dict[str, Any]]) -> str:
        """Determine overall performance trend"""
        
        improving_count = 0
        declining_count = 0
        
        for trend_data in trends.values():
            if trend_data["direction"] == "improving":
                improving_count += 1
            elif trend_data["direction"] == "declining":
                declining_count += 1
        
        if improving_count > declining_count:
            return "improving"
        elif declining_count > improving_count:
            return "declining"
        else:
            return "stable"
    
    async def identify_performance_bottlenecks(self, agent_id: str) -> List[Dict[str, Any]]:
        """Identify performance bottlenecks for an agent"""
        
        performance_data = await self.collect_performance_data(agent_id)
        bottlenecks = []
        
        # Check various bottleneck indicators
        if performance_data.success_rate < 0.8:
            bottlenecks.append({
                "type": "low_success_rate",
                "severity": "high" if performance_data.success_rate < 0.6 else "medium",
                "description": f"Success rate is {performance_data.success_rate:.1%}, below optimal threshold",
                "metric_value": performance_data.success_rate,
                "threshold": 0.8,
                "recommendations": [
                    "Review error logs for common failure patterns",
                    "Improve input validation",
                    "Consider timeout adjustments"
                ]
            })
        
        if performance_data.avg_execution_time > 300:  # 5 minutes
            bottlenecks.append({
                "type": "slow_execution",
                "severity": "high" if performance_data.avg_execution_time > 600 else "medium",
                "description": f"Average execution time is {performance_data.avg_execution_time:.1f} seconds",
                "metric_value": performance_data.avg_execution_time,
                "threshold": 300,
                "recommendations": [
                    "Optimize data processing algorithms",
                    "Consider parallel processing",
                    "Review external API call efficiency"
                ]
            })
        
        if performance_data.error_rate > 0.1:  # 10%
            bottlenecks.append({
                "type": "high_error_rate",
                "severity": "critical" if performance_data.error_rate > 0.2 else "high",
                "description": f"Error rate is {performance_data.error_rate:.1%}",
                "metric_value": performance_data.error_rate,
                "threshold": 0.1,
                "recommendations": [
                    "Implement better error handling",
                    "Add retry mechanisms",
                    "Improve input validation"
                ]
            })
        
        if performance_data.throughput < 1.0:  # Less than 1 task per hour
            bottlenecks.append({
                "type": "low_throughput",
                "severity": "medium",
                "description": f"Throughput is {performance_data.throughput:.2f} tasks/hour",
                "metric_value": performance_data.throughput,
                "threshold": 1.0,
                "recommendations": [
                    "Optimize task scheduling",
                    "Reduce task complexity",
                    "Consider increasing concurrency"
                ]
            })
        
        if performance_data.output_quality_score < 0.7:
            bottlenecks.append({
                "type": "low_quality_output",
                "severity": "medium",
                "description": f"Output quality score is {performance_data.output_quality_score:.2f}",
                "metric_value": performance_data.output_quality_score,
                "threshold": 0.7,
                "recommendations": [
                    "Improve data validation",
                    "Enhance output formatting",
                    "Add quality assurance checks"
                ]
            })
        
        return sorted(bottlenecks, key=lambda x: {"critical": 0, "high": 1, "medium": 2, "low": 3}[x["severity"]])
    
    async def benchmark_against_peers(self, agent_id: str) -> Dict[str, Any]:
        """Benchmark agent performance against similar agents"""
        
        agent = self.db.query(Agent).filter(Agent.id == agent_id).first()
        if not agent:
            return {"error": "Agent not found"}
        
        # Find similar agents (same platform/framework)
        similar_agents = self.db.query(Agent).filter(
            Agent.platform == agent.platform,
            Agent.framework == agent.framework,
            Agent.organization_id == agent.organization_id,  # Same organization
            Agent.id != agent.id  # Exclude self
        ).all()
        
        if not similar_agents:
            return {
                "message": "No similar agents found for comparison",
                "agent_performance": await self.collect_performance_data(agent_id)
            }
        
        # Collect performance data for similar agents
        peer_performance = []
        for peer_agent in similar_agents:
            try:
                peer_data = await self.collect_performance_data(str(peer_agent.id))
                peer_performance.append(peer_data)
            except Exception as e:
                logger.warning(f"Failed to collect data for peer agent {peer_agent.id}: {e}")
        
        if not peer_performance:
            return {"message": "Could not collect peer performance data"}
        
        # Calculate benchmarks
        current_performance = await self.collect_performance_data(agent_id)
        
        benchmarks = {}
        for metric in ["success_rate", "avg_execution_time", "throughput", "error_rate"]:
            peer_values = [getattr(p, metric) for p in peer_performance]
            current_value = getattr(current_performance, metric)
            
            peer_avg = np.mean(peer_values)
            peer_median = np.median(peer_values)
            peer_best = max(peer_values) if metric in ["success_rate", "throughput"] else min(peer_values)
            peer_worst = min(peer_values) if metric in ["success_rate", "throughput"] else max(peer_values)
            
            # Calculate percentile
            if metric in ["success_rate", "throughput"]:
                percentile = (sum(1 for v in peer_values if current_value >= v) / len(peer_values)) * 100
            else:
                percentile = (sum(1 for v in peer_values if current_value <= v) / len(peer_values)) * 100
            
            benchmarks[metric] = {
                "current_value": current_value,
                "peer_average": peer_avg,
                "peer_median": peer_median,
                "peer_best": peer_best,
                "peer_worst": peer_worst,
                "percentile": percentile,
                "vs_average": ((current_value - peer_avg) / peer_avg * 100) if peer_avg > 0 else 0,
                "performance_tier": self._get_performance_tier(percentile)
            }
        
        return {
            "agent_id": agent_id,
            "peer_count": len(peer_performance),
            "benchmarks": benchmarks,
            "overall_ranking": self._calculate_overall_ranking(benchmarks),
            "benchmark_date": datetime.now(timezone.utc).isoformat()
        }
    
    def _get_performance_tier(self, percentile: float) -> str:
        """Get performance tier based on percentile"""
        if percentile >= 90:
            return "excellent"
        elif percentile >= 75:
            return "above_average"
        elif percentile >= 50:
            return "average"
        elif percentile >= 25:
            return "below_average"
        else:
            return "poor"
    
    def _calculate_overall_ranking(self, benchmarks: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate overall performance ranking"""
        
        # Weight different metrics
        metric_weights = {
            "success_rate": 0.3,
            "avg_execution_time": 0.25,
            "throughput": 0.25,
            "error_rate": 0.2
        }
        
        weighted_percentile = 0
        for metric, weight in metric_weights.items():
            if metric in benchmarks:
                weighted_percentile += benchmarks[metric]["percentile"] * weight
        
        return {
            "overall_percentile": weighted_percentile,
            "overall_tier": self._get_performance_tier(weighted_percentile),
            "strengths": [
                metric for metric, data in benchmarks.items()
                if data["percentile"] >= 75
            ],
            "improvement_areas": [
                metric for metric, data in benchmarks.items()
                if data["percentile"] < 50
            ]
        }

class ConfigurationOptimizer:
    """Optimizes agent configurations based on performance data"""
    
    def __init__(self, ml_pipeline: MLPipeline):
        self.ml_pipeline = ml_pipeline
        self.optimization_models: Dict[str, Any] = {}
        self.configuration_templates: Dict[str, Dict[str, Any]] = {}
        self._initialize_templates()
    
    def _initialize_templates(self):
        """Initialize configuration templates for different optimization scenarios"""
        
        self.configuration_templates = {
            "high_throughput": {
                "concurrent_tasks": 5,
                "batch_size": 10,
                "timeout": 300,
                "retry_attempts": 2,
                "cache_enabled": True,
                "optimization_focus": "speed"
            },
            "high_accuracy": {
                "concurrent_tasks": 2,
                "batch_size": 5,
                "timeout": 600,
                "retry_attempts": 3,
                "validation_enabled": True,
                "optimization_focus": "quality"
            },
            "balanced": {
                "concurrent_tasks": 3,
                "batch_size": 7,
                "timeout": 450,
                "retry_attempts": 2,
                "cache_enabled": True,
                "validation_enabled": True,
                "optimization_focus": "balanced"
            },
            "resource_efficient": {
                "concurrent_tasks": 2,
                "batch_size": 5,
                "timeout": 300,
                "retry_attempts": 1,
                "cache_enabled": True,
                "memory_limit": "low",
                "optimization_focus": "efficiency"
            }
        }
    
    async def generate_optimization_recommendations(
        self,
        agent_id: str,
        performance_data: PerformanceData,
        bottlenecks: List[Dict[str, Any]]
    ) -> List[OptimizationRecommendation]:
        """Generate optimization recommendations based on performance analysis"""
        
        recommendations = []
        
        # Analyze bottlenecks and generate targeted recommendations
        for bottleneck in bottlenecks:
            if bottleneck["type"] == "low_success_rate":
                rec = await self._create_success_rate_optimization(agent_id, performance_data, bottleneck)
                if rec:
                    recommendations.append(rec)
            
            elif bottleneck["type"] == "slow_execution":
                rec = await self._create_performance_optimization(agent_id, performance_data, bottleneck)
                if rec:
                    recommendations.append(rec)
            
            elif bottleneck["type"] == "high_error_rate":
                rec = await self._create_reliability_optimization(agent_id, performance_data, bottleneck)
                if rec:
                    recommendations.append(rec)
            
            elif bottleneck["type"] == "low_throughput":
                rec = await self._create_throughput_optimization(agent_id, performance_data, bottleneck)
                if rec:
                    recommendations.append(rec)
        
        # Generate proactive optimizations
        if performance_data.success_rate > 0.9 and performance_data.avg_execution_time < 300:
            # Agent is performing well, suggest throughput optimization
            rec = await self._create_proactive_optimization(agent_id, performance_data)
            if rec:
                recommendations.append(rec)
        
        return recommendations
    
    async def _create_success_rate_optimization(
        self,
        agent_id: str,
        performance_data: PerformanceData,
        bottleneck: Dict[str, Any]
    ) -> Optional[OptimizationRecommendation]:
        """Create optimization recommendation for improving success rate"""
        
        try:
            # Analyze current configuration
            current_config = performance_data.configuration
            
            # Suggest reliability-focused configuration
            optimized_config = self.configuration_templates["high_accuracy"].copy()
            
            # Customize based on current settings
            if "timeout" in current_config:
                optimized_config["timeout"] = max(current_config["timeout"] * 1.5, 600)
            
            if "retry_attempts" in current_config:
                optimized_config["retry_attempts"] = min(current_config.get("retry_attempts", 1) + 1, 5)
            
            recommendation = OptimizationRecommendation(
                recommendation_id=str(uuid.uuid4()),
                agent_id=agent_id,
                optimization_type=OptimizationType.CONFIGURATION_ADAPTATION,
                title="Improve Success Rate",
                description=f"Optimize configuration to improve success rate from {performance_data.success_rate:.1%}",
                expected_improvement={
                    "success_rate": 15.0,  # Expected 15% improvement
                    "error_rate": -20.0    # Expected 20% reduction in errors
                },
                confidence=0.75,
                configuration_changes=optimized_config,
                implementation_effort="low",
                risk_level="low",
                rollback_plan={
                    "restore_config": current_config,
                    "monitoring_period_hours": 24
                }
            )
            
            return recommendation
            
        except Exception as e:
            logger.error(f"Failed to create success rate optimization: {e}")
            return None
    
    async def _create_performance_optimization(
        self,
        agent_id: str,
        performance_data: PerformanceData,
        bottleneck: Dict[str, Any]
    ) -> Optional[OptimizationRecommendation]:
        """Create optimization recommendation for improving execution speed"""
        
        try:
            current_config = performance_data.configuration
            optimized_config = self.configuration_templates["high_throughput"].copy()
            
            # Customize timeout reduction
            if "timeout" in current_config:
                optimized_config["timeout"] = max(current_config["timeout"] * 0.8, 180)
            
            # Increase concurrency if success rate is good
            if performance_data.success_rate > 0.8:
                optimized_config["concurrent_tasks"] = min(
                    current_config.get("concurrent_tasks", 3) + 2, 8
                )
            
            recommendation = OptimizationRecommendation(
                recommendation_id=str(uuid.uuid4()),
                agent_id=agent_id,
                optimization_type=OptimizationType.PERFORMANCE_TUNING,
                title="Improve Execution Speed",
                description=f"Optimize configuration to reduce execution time from {performance_data.avg_execution_time:.1f}s",
                expected_improvement={
                    "execution_time": -25.0,  # Expected 25% reduction
                    "throughput": 30.0        # Expected 30% increase
                },
                confidence=0.65,
                configuration_changes=optimized_config,
                implementation_effort="medium",
                risk_level="medium",
                rollback_plan={
                    "restore_config": current_config,
                    "monitoring_period_hours": 48
                }
            )
            
            return recommendation
            
        except Exception as e:
            logger.error(f"Failed to create performance optimization: {e}")
            return None
    
    async def _create_reliability_optimization(
        self,
        agent_id: str,
        performance_data: PerformanceData,
        bottleneck: Dict[str, Any]
    ) -> Optional[OptimizationRecommendation]:
        """Create optimization recommendation for reducing errors"""
        
        try:
            current_config = performance_data.configuration
            optimized_config = self.configuration_templates["high_accuracy"].copy()
            
            # Enhanced error handling
            optimized_config.update({
                "error_handling": "enhanced",
                "input_validation": "strict",
                "output_verification": True,
                "fallback_enabled": True
            })
            
            recommendation = OptimizationRecommendation(
                recommendation_id=str(uuid.uuid4()),
                agent_id=agent_id,
                optimization_type=OptimizationType.ERROR_REDUCTION,
                title="Reduce Error Rate",
                description=f"Implement enhanced error handling to reduce error rate from {performance_data.error_rate:.1%}",
                expected_improvement={
                    "error_rate": -40.0,      # Expected 40% reduction
                    "success_rate": 10.0,     # Expected 10% improvement
                    "quality_score": 15.0     # Expected 15% improvement
                },
                confidence=0.8,
                configuration_changes=optimized_config,
                implementation_effort="high",
                risk_level="low",
                rollback_plan={
                    "restore_config": current_config,
                    "monitoring_period_hours": 72
                }
            )
            
            return recommendation
            
        except Exception as e:
            logger.error(f"Failed to create reliability optimization: {e}")
            return None
    
    async def _create_throughput_optimization(
        self,
        agent_id: str,
        performance_data: PerformanceData,
        bottleneck: Dict[str, Any]
    ) -> Optional[OptimizationRecommendation]:
        """Create optimization recommendation for improving throughput"""
        
        try:
            current_config = performance_data.configuration
            optimized_config = self.configuration_templates["high_throughput"].copy()
            
            # Increase batch processing
            optimized_config["batch_processing"] = True
            optimized_config["batch_size"] = min(
                current_config.get("batch_size", 5) * 2, 20
            )
            
            # Optimize scheduling
            optimized_config["scheduling_strategy"] = "aggressive"
            optimized_config["queue_priority"] = "high"
            
            recommendation = OptimizationRecommendation(
                recommendation_id=str(uuid.uuid4()),
                agent_id=agent_id,
                optimization_type=OptimizationType.EFFICIENCY_IMPROVEMENT,
                title="Improve Throughput",
                description=f"Optimize scheduling and batching to improve throughput from {performance_data.throughput:.2f} tasks/hour",
                expected_improvement={
                    "throughput": 50.0,       # Expected 50% increase
                    "queue_time": -30.0       # Expected 30% reduction in queue time
                },
                confidence=0.7,
                configuration_changes=optimized_config,
                implementation_effort="medium",
                risk_level="medium",
                rollback_plan={
                    "restore_config": current_config,
                    "monitoring_period_hours": 24
                }
            )
            
            return recommendation
            
        except Exception as e:
            logger.error(f"Failed to create throughput optimization: {e}")
            return None
    
    async def _create_proactive_optimization(
        self,
        agent_id: str,
        performance_data: PerformanceData
    ) -> Optional[OptimizationRecommendation]:
        """Create proactive optimization for well-performing agents"""
        
        try:
            # Suggest balanced optimization for further improvement
            optimized_config = self.configuration_templates["balanced"].copy()
            
            # Fine-tune based on current performance
            if performance_data.resource_utilization < 0.6:
                optimized_config["concurrent_tasks"] += 1
                optimized_config["batch_size"] += 2
            
            recommendation = OptimizationRecommendation(
                recommendation_id=str(uuid.uuid4()),
                agent_id=agent_id,
                optimization_type=OptimizationType.EFFICIENCY_IMPROVEMENT,
                title="Proactive Performance Enhancement",
                description="Fine-tune configuration for optimal performance balance",
                expected_improvement={
                    "overall_efficiency": 10.0,
                    "resource_utilization": 15.0
                },
                confidence=0.6,
                configuration_changes=optimized_config,
                implementation_effort="low",
                risk_level="low",
                rollback_plan={
                    "restore_config": performance_data.configuration,
                    "monitoring_period_hours": 24
                }
            )
            
            return recommendation
            
        except Exception as e:
            logger.error(f"Failed to create proactive optimization: {e}")
            return None

class OptimizationEngine:
    """Main engine for agent performance optimization"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.performance_analyzer = PerformanceAnalyzer(db_session)
        self.config_optimizer = None  # Initialized in start()
        
        # Optimization state
        self.active_optimizations: Dict[str, OptimizationRecommendation] = {}
        self.completed_optimizations: Dict[str, OptimizationRecommendation] = {}
        self.running_experiments: Dict[str, OptimizationExperiment] = {}
        
        # Performance tracking
        self.optimization_metrics = {
            "optimizations_applied": 0,
            "successful_optimizations": 0,
            "average_improvement": 0.0,
            "rollbacks_performed": 0
        }
    
    async def start(self):
        """Start the optimization engine"""
        
        # Initialize ML pipeline
        ml_pipeline = await get_ml_pipeline(self.db)
        self.config_optimizer = ConfigurationOptimizer(ml_pipeline)
        
        # Start background optimization loop
        asyncio.create_task(self._optimization_loop())
        
        logger.info("Agent optimization engine started")
    
    async def optimize_agent(self, agent_id: str) -> List[OptimizationRecommendation]:
        """Optimize a specific agent"""
        
        try:
            # Collect current performance data
            performance_data = await self.performance_analyzer.collect_performance_data(agent_id)
            
            # Identify bottlenecks
            bottlenecks = await self.performance_analyzer.identify_performance_bottlenecks(agent_id)
            
            # Generate optimization recommendations
            recommendations = await self.config_optimizer.generate_optimization_recommendations(
                agent_id, performance_data, bottlenecks
            )
            
            # Store recommendations
            for recommendation in recommendations:
                self.active_optimizations[recommendation.recommendation_id] = recommendation
            
            logger.info(
                "Agent optimization analysis completed",
                agent_id=agent_id,
                recommendations_count=len(recommendations),
                bottlenecks_found=len(bottlenecks)
            )
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Failed to optimize agent {agent_id}: {e}")
            return []
    
    async def apply_optimization(self, recommendation_id: str) -> bool:
        """Apply an optimization recommendation"""
        
        if recommendation_id not in self.active_optimizations:
            logger.error(f"Optimization recommendation not found: {recommendation_id}")
            return False
        
        recommendation = self.active_optimizations[recommendation_id]
        
        try:
            recommendation.status = OptimizationStatus.DEPLOYING
            
            # Get the agent
            agent = self.db.query(Agent).filter(Agent.id == recommendation.agent_id).first()
            if not agent:
                raise ValueError(f"Agent not found: {recommendation.agent_id}")
            
            # Store current configuration for rollback
            recommendation.rollback_plan["original_config"] = agent.configuration.copy() if agent.configuration else {}
            
            # Apply new configuration
            if agent.configuration:
                agent.configuration.update(recommendation.configuration_changes)
            else:
                agent.configuration = recommendation.configuration_changes.copy()
            
            # Update database
            self.db.commit()
            
            # Update status
            recommendation.status = OptimizationStatus.MONITORING
            recommendation.implemented_at = datetime.now(timezone.utc)
            
            # Start monitoring period
            asyncio.create_task(self._monitor_optimization(recommendation))
            
            self.optimization_metrics["optimizations_applied"] += 1
            
            logger.info(
                "Optimization applied",
                recommendation_id=recommendation_id,
                agent_id=recommendation.agent_id,
                optimization_type=recommendation.optimization_type.value
            )
            
            return True
            
        except Exception as e:
            recommendation.status = OptimizationStatus.FAILED
            logger.error(f"Failed to apply optimization {recommendation_id}: {e}")
            return False
    
    async def _monitor_optimization(self, recommendation: OptimizationRecommendation):
        """Monitor optimization results"""
        
        try:
            # Wait for monitoring period
            monitoring_hours = recommendation.rollback_plan.get("monitoring_period_hours", 24)
            await asyncio.sleep(monitoring_hours * 3600)
            
            # Collect post-optimization performance data
            post_performance = await self.performance_analyzer.collect_performance_data(
                recommendation.agent_id
            )
            
            # Calculate actual improvement
            # This would compare against baseline - simplified for now
            recommendation.actual_improvement = {
                "success_rate": 5.0,  # Placeholder
                "execution_time": -10.0,  # Placeholder
                "throughput": 15.0  # Placeholder
            }
            
            # Determine success
            success_threshold = 0.5  # 50% of expected improvement
            success_metrics = 0
            total_metrics = len(recommendation.expected_improvement)
            
            for metric, expected in recommendation.expected_improvement.items():
                actual = recommendation.actual_improvement.get(metric, 0)
                if (expected > 0 and actual >= expected * success_threshold) or \
                   (expected < 0 and actual <= expected * success_threshold):
                    success_metrics += 1
            
            recommendation.success = success_metrics >= total_metrics * 0.6  # 60% of metrics improved
            
            if recommendation.success:
                recommendation.status = OptimizationStatus.COMPLETED
                self.optimization_metrics["successful_optimizations"] += 1
                
                # Update average improvement
                improvement_sum = sum(abs(v) for v in recommendation.actual_improvement.values())
                current_avg = self.optimization_metrics["average_improvement"]
                total_optimizations = self.optimization_metrics["optimizations_applied"]
                
                self.optimization_metrics["average_improvement"] = (
                    (current_avg * (total_optimizations - 1) + improvement_sum) / total_optimizations
                )
                
                logger.info(
                    "Optimization successful",
                    recommendation_id=recommendation.recommendation_id,
                    actual_improvement=recommendation.actual_improvement
                )
            else:
                # Rollback optimization
                await self._rollback_optimization(recommendation)
            
            # Move to completed optimizations
            self.completed_optimizations[recommendation.recommendation_id] = recommendation
            if recommendation.recommendation_id in self.active_optimizations:
                del self.active_optimizations[recommendation.recommendation_id]
            
        except Exception as e:
            logger.error(f"Error monitoring optimization: {e}")
            await self._rollback_optimization(recommendation)
    
    async def _rollback_optimization(self, recommendation: OptimizationRecommendation):
        """Rollback a failed optimization"""
        
        try:
            # Restore original configuration
            agent = self.db.query(Agent).filter(Agent.id == recommendation.agent_id).first()
            if agent and "original_config" in recommendation.rollback_plan:
                agent.configuration = recommendation.rollback_plan["original_config"]
                self.db.commit()
            
            recommendation.status = OptimizationStatus.ROLLED_BACK
            self.optimization_metrics["rollbacks_performed"] += 1
            
            logger.warning(
                "Optimization rolled back",
                recommendation_id=recommendation.recommendation_id,
                agent_id=recommendation.agent_id,
                reason="Performance did not meet expectations"
            )
            
        except Exception as e:
            logger.error(f"Failed to rollback optimization: {e}")
    
    async def _optimization_loop(self):
        """Background loop for continuous optimization"""
        
        while True:
            try:
                # Get all agents
                agents = self.db.query(Agent).all()
                
                for agent in agents:
                    # Skip agents with recent optimizations
                    recent_optimizations = [
                        opt for opt in self.active_optimizations.values()
                        if opt.agent_id == str(agent.id) and
                        (datetime.now(timezone.utc) - opt.created_at) < timedelta(hours=48)
                    ]
                    
                    if recent_optimizations:
                        continue
                    
                    # Analyze agent performance
                    try:
                        trends = await self.performance_analyzer.analyze_performance_trends(str(agent.id))
                        
                        # Check if optimization is needed
                        if trends.get("overall_trend") == "declining":
                            await self.optimize_agent(str(agent.id))
                    
                    except Exception as e:
                        logger.warning(f"Failed to analyze agent {agent.id}: {e}")
                
                # Sleep for 6 hours before next optimization cycle
                await asyncio.sleep(21600)
                
            except Exception as e:
                logger.error(f"Optimization loop error: {e}")
                await asyncio.sleep(3600)  # Retry in 1 hour
    
    def get_optimization_status(self, agent_id: str) -> Dict[str, Any]:
        """Get optimization status for an agent"""
        
        active_opts = [
            opt for opt in self.active_optimizations.values()
            if opt.agent_id == agent_id
        ]
        
        completed_opts = [
            opt for opt in self.completed_optimizations.values()
            if opt.agent_id == agent_id
        ]
        
        return {
            "agent_id": agent_id,
            "active_optimizations": len(active_opts),
            "completed_optimizations": len(completed_opts),
            "latest_optimization": completed_opts[-1] if completed_opts else None,
            "optimization_history": [
                {
                    "recommendation_id": opt.recommendation_id,
                    "type": opt.optimization_type.value,
                    "status": opt.status.value,
                    "success": opt.success,
                    "implemented_at": opt.implemented_at.isoformat() if opt.implemented_at else None
                }
                for opt in completed_opts[-5:]  # Last 5 optimizations
            ]
        }
    
    def get_optimization_metrics(self) -> Dict[str, Any]:
        """Get optimization engine metrics"""
        
        return {
            "metrics": self.optimization_metrics,
            "active_optimizations": len(self.active_optimizations),
            "completed_optimizations": len(self.completed_optimizations),
            "running_experiments": len(self.running_experiments),
            "success_rate": (
                self.optimization_metrics["successful_optimizations"] / 
                max(self.optimization_metrics["optimizations_applied"], 1)
            ) * 100
        }

# Global optimization engine instance
optimization_engine = None

async def get_optimization_engine(db: Session) -> OptimizationEngine:
    """Get or create optimization engine instance"""
    global optimization_engine
    if optimization_engine is None:
        optimization_engine = OptimizationEngine(db)
        await optimization_engine.start()
    return optimization_engine