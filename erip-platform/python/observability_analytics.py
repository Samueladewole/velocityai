#!/usr/bin/env python3
"""
Velocity.ai Observability Analytics Engine
Advanced Python-based analytics for AI agent performance and compliance monitoring

This module provides efficient data processing, statistical analysis, and machine learning
for observability insights that would be computationally expensive in JavaScript.
"""

import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from enum import Enum
import statistics
from collections import defaultdict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AlertSeverity(Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"

class TrendDirection(Enum):
    IMPROVING = "improving"
    DECLINING = "declining"
    STABLE = "stable"

@dataclass
class AIDecisionAnalytics:
    """Analytics for AI decision performance"""
    agent_type: str
    total_decisions: int
    confidence_stats: Dict[str, float]
    latency_stats: Dict[str, float]
    quality_score: float
    token_efficiency: float
    error_rate: float
    trend_analysis: Dict[str, str]
    anomalies: List[Dict[str, Any]]
    predictions: Dict[str, float]

@dataclass
class ComplianceAnalytics:
    """Analytics for compliance monitoring"""
    framework: str
    completion_percentage: float
    risk_score: float
    gap_analysis: List[Dict[str, Any]]
    trend_analysis: Dict[str, str]
    predictive_insights: List[str]
    benchmark_comparison: Dict[str, float]

@dataclass
class SystemHealthAnalytics:
    """System-wide health analytics"""
    overall_health_score: float
    component_health: Dict[str, float]
    performance_trends: Dict[str, str]
    resource_utilization: Dict[str, float]
    predicted_issues: List[Dict[str, Any]]
    optimization_recommendations: List[str]

class ObservabilityAnalytics:
    """
    Advanced analytics engine for Velocity.ai observability data
    
    Provides statistical analysis, trend detection, anomaly detection,
    and predictive insights for AI agents and compliance monitoring.
    """
    
    def __init__(self):
        self.confidence_threshold = 0.7
        self.latency_threshold = 5000  # milliseconds
        self.error_rate_threshold = 0.05
        self.anomaly_detection_window = 100  # number of recent decisions to analyze
        
    def analyze_ai_agent_performance(
        self, 
        decisions_data: List[Dict[str, Any]], 
        agent_type: str
    ) -> AIDecisionAnalytics:
        """
        Comprehensive analysis of AI agent performance
        
        Args:
            decisions_data: List of AI decision records
            agent_type: Type of AI agent being analyzed
            
        Returns:
            AIDecisionAnalytics object with comprehensive insights
        """
        if not decisions_data:
            return self._empty_ai_analytics(agent_type)
            
        df = pd.DataFrame(decisions_data)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        
        # Basic statistics
        confidence_values = df['confidence'].values
        latency_values = df['latency'].values
        
        confidence_stats = {
            'mean': float(np.mean(confidence_values)),
            'median': float(np.median(confidence_values)),
            'std': float(np.std(confidence_values)),
            'min': float(np.min(confidence_values)),
            'max': float(np.max(confidence_values)),
            'p25': float(np.percentile(confidence_values, 25)),
            'p75': float(np.percentile(confidence_values, 75)),
            'p95': float(np.percentile(confidence_values, 95))
        }
        
        latency_stats = {
            'mean': float(np.mean(latency_values)),
            'median': float(np.median(latency_values)),
            'std': float(np.std(latency_values)),
            'min': float(np.min(latency_values)),
            'max': float(np.max(latency_values)),
            'p95': float(np.percentile(latency_values, 95)),
            'p99': float(np.percentile(latency_values, 99))
        }
        
        # Quality score calculation
        quality_score = self._calculate_quality_score(df)
        
        # Token efficiency
        total_tokens = df['tokens_input'].sum() + df['tokens_output'].sum()
        token_efficiency = len(df) / max(total_tokens, 1)
        
        # Error rate
        error_rate = len(df[df['confidence'] < 0.3]) / len(df)
        
        # Trend analysis
        trend_analysis = self._analyze_trends(df)
        
        # Anomaly detection
        anomalies = self._detect_anomalies(df)
        
        # Predictive insights
        predictions = self._generate_predictions(df)
        
        return AIDecisionAnalytics(
            agent_type=agent_type,
            total_decisions=len(df),
            confidence_stats=confidence_stats,
            latency_stats=latency_stats,
            quality_score=quality_score,
            token_efficiency=token_efficiency,
            error_rate=error_rate,
            trend_analysis=trend_analysis,
            anomalies=anomalies,
            predictions=predictions
        )
    
    def analyze_compliance_health(
        self, 
        compliance_data: List[Dict[str, Any]], 
        framework: str
    ) -> ComplianceAnalytics:
        """
        Analyze compliance health and generate insights
        
        Args:
            compliance_data: List of compliance events and assessments
            framework: Compliance framework being analyzed
            
        Returns:
            ComplianceAnalytics object with compliance insights
        """
        if not compliance_data:
            return self._empty_compliance_analytics(framework)
            
        df = pd.DataFrame(compliance_data)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Calculate completion percentage
        completion_percentage = self._calculate_completion_percentage(df)
        
        # Risk score calculation
        risk_score = self._calculate_compliance_risk_score(df, completion_percentage)
        
        # Gap analysis
        gap_analysis = self._perform_gap_analysis(df)
        
        # Trend analysis
        trend_analysis = self._analyze_compliance_trends(df)
        
        # Predictive insights
        predictive_insights = self._generate_compliance_predictions(df, completion_percentage)
        
        # Benchmark comparison (simulated)
        benchmark_comparison = self._generate_benchmark_comparison(framework, completion_percentage)
        
        return ComplianceAnalytics(
            framework=framework,
            completion_percentage=completion_percentage,
            risk_score=risk_score,
            gap_analysis=gap_analysis,
            trend_analysis=trend_analysis,
            predictive_insights=predictive_insights,
            benchmark_comparison=benchmark_comparison
        )
    
    def analyze_system_health(
        self, 
        system_data: Dict[str, List[Dict[str, Any]]]
    ) -> SystemHealthAnalytics:
        """
        Comprehensive system health analysis
        
        Args:
            system_data: Dictionary containing various system metrics
            
        Returns:
            SystemHealthAnalytics object with system insights
        """
        # Calculate overall health score
        component_scores = {}
        
        for component, metrics in system_data.items():
            if metrics:
                df = pd.DataFrame(metrics)
                score = self._calculate_component_health_score(df, component)
                component_scores[component] = score
        
        overall_health_score = np.mean(list(component_scores.values())) if component_scores else 0.0
        
        # Performance trends
        performance_trends = self._analyze_system_trends(system_data)
        
        # Resource utilization analysis
        resource_utilization = self._analyze_resource_utilization(system_data)
        
        # Predict potential issues
        predicted_issues = self._predict_system_issues(system_data)
        
        # Generate optimization recommendations
        optimization_recommendations = self._generate_optimization_recommendations(
            component_scores, resource_utilization
        )
        
        return SystemHealthAnalytics(
            overall_health_score=overall_health_score,
            component_health=component_scores,
            performance_trends=performance_trends,
            resource_utilization=resource_utilization,
            predicted_issues=predicted_issues,
            optimization_recommendations=optimization_recommendations
        )
    
    def detect_performance_anomalies(
        self, 
        metrics_data: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Advanced anomaly detection using statistical methods
        
        Args:
            metrics_data: List of performance metrics
            
        Returns:
            List of detected anomalies with details
        """
        if len(metrics_data) < 10:
            return []
            
        df = pd.DataFrame(metrics_data)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        
        anomalies = []
        
        # Detect anomalies in different metrics
        for column in ['confidence', 'latency', 'error_rate']:
            if column in df.columns:
                column_anomalies = self._detect_column_anomalies(df, column)
                anomalies.extend(column_anomalies)
        
        return anomalies
    
    def generate_predictive_insights(
        self, 
        historical_data: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Generate predictive insights using time series analysis
        
        Args:
            historical_data: Historical performance data
            
        Returns:
            Dictionary containing predictive insights
        """
        if len(historical_data) < 30:
            return {"message": "Insufficient data for predictions"}
            
        df = pd.DataFrame(historical_data)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        
        insights = {
            "confidence_forecast": self._forecast_confidence_trend(df),
            "performance_forecast": self._forecast_performance_trend(df),
            "capacity_planning": self._generate_capacity_recommendations(df),
            "risk_assessment": self._assess_future_risks(df)
        }
        
        return insights
    
    def calculate_business_impact_metrics(
        self, 
        performance_data: Dict[str, Any],
        compliance_data: Dict[str, Any]
    ) -> Dict[str, float]:
        """
        Calculate business impact metrics from performance and compliance data
        
        Args:
            performance_data: AI performance metrics
            compliance_data: Compliance health data
            
        Returns:
            Dictionary of business impact metrics
        """
        # Cost savings from automation
        total_decisions = performance_data.get('total_decisions', 0)
        avg_processing_time = performance_data.get('avg_latency', 0) / 1000  # Convert to seconds
        manual_processing_time = 300  # Assume 5 minutes manual processing per decision
        
        time_saved_hours = (total_decisions * manual_processing_time) / 3600
        cost_per_hour = 50  # Assume $50/hour labor cost
        automation_savings = time_saved_hours * cost_per_hour
        
        # Risk reduction value
        compliance_score = compliance_data.get('completion_percentage', 0)
        risk_reduction_value = compliance_score * 1000  # $1000 per compliance percentage point
        
        # Efficiency gains
        confidence_score = performance_data.get('avg_confidence', 0)
        efficiency_multiplier = min(confidence_score * 2, 1.5)  # Up to 50% efficiency gain
        
        return {
            "automation_savings": automation_savings,
            "risk_reduction_value": risk_reduction_value,
            "efficiency_gain_percentage": (efficiency_multiplier - 1) * 100,
            "total_business_value": automation_savings + risk_reduction_value,
            "roi_percentage": ((automation_savings + risk_reduction_value) / max(total_decisions * 0.1, 1)) * 100
        }
    
    # Private helper methods
    
    def _empty_ai_analytics(self, agent_type: str) -> AIDecisionAnalytics:
        """Return empty analytics for when no data is available"""
        return AIDecisionAnalytics(
            agent_type=agent_type,
            total_decisions=0,
            confidence_stats={},
            latency_stats={},
            quality_score=0.0,
            token_efficiency=0.0,
            error_rate=0.0,
            trend_analysis={},
            anomalies=[],
            predictions={}
        )
    
    def _empty_compliance_analytics(self, framework: str) -> ComplianceAnalytics:
        """Return empty compliance analytics"""
        return ComplianceAnalytics(
            framework=framework,
            completion_percentage=0.0,
            risk_score=100.0,
            gap_analysis=[],
            trend_analysis={},
            predictive_insights=[],
            benchmark_comparison={}
        )
    
    def _calculate_quality_score(self, df: pd.DataFrame) -> float:
        """Calculate overall quality score for AI decisions"""
        confidence_score = df['confidence'].mean()
        consistency_score = 1 - (df['confidence'].std() / max(df['confidence'].mean(), 0.1))
        
        # Factor in reasoning quality (length of reasoning as proxy)
        if 'reasoning_count' in df.columns:
            reasoning_score = min(df['reasoning_count'].mean() / 3, 1.0)
        else:
            reasoning_score = 0.5
        
        return (confidence_score * 0.5 + consistency_score * 0.3 + reasoning_score * 0.2)
    
    def _analyze_trends(self, df: pd.DataFrame) -> Dict[str, str]:
        """Analyze trends in AI decision data"""
        if len(df) < 10:
            return {"confidence": "stable", "latency": "stable", "quality": "stable"}
        
        # Split data into two halves for trend analysis
        mid_point = len(df) // 2
        recent_half = df.iloc[mid_point:]
        older_half = df.iloc[:mid_point]
        
        trends = {}
        
        # Confidence trend
        recent_conf = recent_half['confidence'].mean()
        older_conf = older_half['confidence'].mean()
        conf_change = (recent_conf - older_conf) / older_conf if older_conf > 0 else 0
        
        if conf_change > 0.05:
            trends['confidence'] = 'improving'
        elif conf_change < -0.05:
            trends['confidence'] = 'declining'
        else:
            trends['confidence'] = 'stable'
        
        # Latency trend (inverse - lower is better)
        recent_lat = recent_half['latency'].mean()
        older_lat = older_half['latency'].mean()
        lat_change = (recent_lat - older_lat) / older_lat if older_lat > 0 else 0
        
        if lat_change < -0.1:
            trends['latency'] = 'improving'
        elif lat_change > 0.1:
            trends['latency'] = 'declining'
        else:
            trends['latency'] = 'stable'
        
        # Quality trend
        recent_quality = self._calculate_quality_score(recent_half)
        older_quality = self._calculate_quality_score(older_half)
        quality_change = (recent_quality - older_quality) / older_quality if older_quality > 0 else 0
        
        if quality_change > 0.05:
            trends['quality'] = 'improving'
        elif quality_change < -0.05:
            trends['quality'] = 'declining'
        else:
            trends['quality'] = 'stable'
        
        return trends
    
    def _detect_anomalies(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Detect anomalies in AI decision data using statistical methods"""
        anomalies = []
        
        # Confidence anomalies
        conf_mean = df['confidence'].mean()
        conf_std = df['confidence'].std()
        
        for idx, row in df.iterrows():
            z_score = abs((row['confidence'] - conf_mean) / conf_std) if conf_std > 0 else 0
            if z_score > 2.5:  # 2.5 standard deviations
                anomalies.append({
                    'type': 'confidence_anomaly',
                    'timestamp': row['timestamp'].isoformat(),
                    'value': row['confidence'],
                    'expected_range': [conf_mean - 2*conf_std, conf_mean + 2*conf_std],
                    'severity': 'high' if z_score > 3 else 'medium'
                })
        
        # Latency anomalies
        lat_mean = df['latency'].mean()
        lat_std = df['latency'].std()
        
        for idx, row in df.iterrows():
            z_score = abs((row['latency'] - lat_mean) / lat_std) if lat_std > 0 else 0
            if z_score > 2.5:
                anomalies.append({
                    'type': 'latency_anomaly',
                    'timestamp': row['timestamp'].isoformat(),
                    'value': row['latency'],
                    'expected_range': [max(0, lat_mean - 2*lat_std), lat_mean + 2*lat_std],
                    'severity': 'high' if z_score > 3 else 'medium'
                })
        
        return anomalies
    
    def _generate_predictions(self, df: pd.DataFrame) -> Dict[str, float]:
        """Generate predictions for future performance"""
        if len(df) < 20:
            return {}
        
        # Simple linear trend prediction
        df_indexed = df.set_index('timestamp')
        df_resampled = df_indexed.resample('1H').mean().fillna(method='forward')
        
        predictions = {}
        
        # Predict confidence trend
        if len(df_resampled) >= 5:
            conf_values = df_resampled['confidence'].values[-10:]  # Last 10 hours
            if len(conf_values) >= 3:
                # Simple linear regression
                x = np.arange(len(conf_values))
                slope = np.polyfit(x, conf_values, 1)[0]
                next_hour_prediction = conf_values[-1] + slope
                predictions['confidence_next_hour'] = float(np.clip(next_hour_prediction, 0, 1))
        
        # Predict latency trend
        if len(df_resampled) >= 5:
            lat_values = df_resampled['latency'].values[-10:]
            if len(lat_values) >= 3:
                x = np.arange(len(lat_values))
                slope = np.polyfit(x, lat_values, 1)[0]
                next_hour_prediction = lat_values[-1] + slope
                predictions['latency_next_hour'] = float(max(0, next_hour_prediction))
        
        return predictions
    
    def _calculate_completion_percentage(self, df: pd.DataFrame) -> float:
        """Calculate compliance completion percentage"""
        if df.empty:
            return 0.0
        
        # Count successful compliance events
        successful_events = len(df[df['outcome'] == 'success'])
        total_events = len(df)
        
        return (successful_events / total_events * 100) if total_events > 0 else 0.0
    
    def _calculate_compliance_risk_score(self, df: pd.DataFrame, completion_percentage: float) -> float:
        """Calculate risk score based on compliance data"""
        base_risk = 100 - completion_percentage
        
        # Factor in recent failures
        recent_failures = len(df[
            (df['outcome'] == 'failure') & 
            (df['timestamp'] > datetime.now() - timedelta(days=30))
        ])
        
        failure_risk = min(recent_failures * 5, 30)  # Up to 30 points for failures
        
        return min(base_risk + failure_risk, 100)
    
    def _perform_gap_analysis(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Perform gap analysis on compliance data"""
        gaps = []
        
        # Analyze event types for gaps
        event_types = df['event_type'].value_counts()
        framework_coverage = df['compliance_framework'].value_counts()
        
        # Identify missing or underperforming areas
        for framework, count in framework_coverage.items():
            success_rate = len(df[
                (df['compliance_framework'] == framework) & 
                (df['outcome'] == 'success')
            ]) / count if count > 0 else 0
            
            if success_rate < 0.8:
                gaps.append({
                    'area': framework,
                    'current_performance': success_rate * 100,
                    'target_performance': 90,
                    'gap_severity': 'high' if success_rate < 0.6 else 'medium',
                    'recommended_actions': [
                        f'Improve {framework} compliance processes',
                        'Increase monitoring and validation',
                        'Provide additional training'
                    ]
                })
        
        return gaps
    
    def _analyze_compliance_trends(self, df: pd.DataFrame) -> Dict[str, str]:
        """Analyze trends in compliance data"""
        if len(df) < 10:
            return {"overall": "stable"}
        
        # Calculate success rate over time
        df_sorted = df.sort_values('timestamp')
        mid_point = len(df_sorted) // 2
        
        recent_success_rate = len(df_sorted.iloc[mid_point:][
            df_sorted.iloc[mid_point:]['outcome'] == 'success'
        ]) / len(df_sorted.iloc[mid_point:])
        
        older_success_rate = len(df_sorted.iloc[:mid_point][
            df_sorted.iloc[:mid_point]['outcome'] == 'success'
        ]) / len(df_sorted.iloc[:mid_point])
        
        if recent_success_rate > older_success_rate + 0.05:
            trend = 'improving'
        elif recent_success_rate < older_success_rate - 0.05:
            trend = 'declining'
        else:
            trend = 'stable'
        
        return {"overall": trend, "success_rate": trend}
    
    def _generate_compliance_predictions(self, df: pd.DataFrame, current_completion: float) -> List[str]:
        """Generate predictive insights for compliance"""
        insights = []
        
        if current_completion < 70:
            insights.append("Risk of compliance gaps increasing - immediate action recommended")
        elif current_completion < 85:
            insights.append("Moderate compliance risk - monitor closely and address gaps")
        else:
            insights.append("Good compliance health - maintain current practices")
        
        # Check for recent trend
        if len(df) >= 10:
            recent_events = df.tail(10)
            recent_failures = len(recent_events[recent_events['outcome'] == 'failure'])
            
            if recent_failures > 3:
                insights.append("Increasing failure rate detected - investigate root causes")
        
        return insights
    
    def _generate_benchmark_comparison(self, framework: str, completion_percentage: float) -> Dict[str, float]:
        """Generate benchmark comparison (simulated industry data)"""
        # Simulated industry benchmarks
        industry_benchmarks = {
            'SOC2': {'average': 78.5, 'top_quartile': 92.0, 'median': 82.3},
            'ISO27001': {'average': 74.2, 'top_quartile': 89.5, 'median': 79.1},
            'GDPR': {'average': 71.8, 'top_quartile': 88.2, 'median': 76.4},
            'HIPAA': {'average': 76.9, 'top_quartile': 91.3, 'median': 81.2},
            'PCI_DSS': {'average': 73.4, 'top_quartile': 87.8, 'median': 78.6},
            'ISACA_DTEF': {'average': 68.5, 'top_quartile': 85.0, 'median': 72.1}
        }
        
        benchmark = industry_benchmarks.get(framework, {'average': 75.0, 'top_quartile': 90.0, 'median': 80.0})
        
        return {
            'your_score': completion_percentage,
            'industry_average': benchmark['average'],
            'industry_median': benchmark['median'],
            'top_quartile': benchmark['top_quartile'],
            'percentile_rank': self._calculate_percentile_rank(completion_percentage, benchmark)
        }
    
    def _calculate_percentile_rank(self, score: float, benchmark: Dict[str, float]) -> float:
        """Calculate percentile rank compared to industry"""
        if score >= benchmark['top_quartile']:
            return 90 + (score - benchmark['top_quartile']) / (100 - benchmark['top_quartile']) * 10
        elif score >= benchmark['median']:
            return 50 + (score - benchmark['median']) / (benchmark['top_quartile'] - benchmark['median']) * 40
        elif score >= benchmark['average']:
            return 30 + (score - benchmark['average']) / (benchmark['median'] - benchmark['average']) * 20
        else:
            return max(0, score / benchmark['average'] * 30)
    
    def _calculate_component_health_score(self, df: pd.DataFrame, component: str) -> float:
        """Calculate health score for a system component"""
        if df.empty:
            return 0.0
        
        # Different scoring logic based on component type
        if 'error_rate' in df.columns:
            avg_error_rate = df['error_rate'].mean()
            error_score = max(0, (1 - avg_error_rate) * 100)
        else:
            error_score = 90
        
        if 'response_time' in df.columns:
            avg_response_time = df['response_time'].mean()
            # Assume good response time is under 1000ms
            response_score = max(0, 100 - (avg_response_time / 1000) * 20)
        else:
            response_score = 90
        
        return (error_score + response_score) / 2
    
    def _analyze_system_trends(self, system_data: Dict[str, List[Dict[str, Any]]]) -> Dict[str, str]:
        """Analyze system-wide performance trends"""
        trends = {}
        
        for component, metrics in system_data.items():
            if not metrics:
                trends[component] = 'stable'
                continue
                
            df = pd.DataFrame(metrics)
            if len(df) < 10:
                trends[component] = 'stable'
                continue
            
            # Analyze trend based on available metrics
            if 'performance_score' in df.columns:
                recent_score = df.tail(5)['performance_score'].mean()
                older_score = df.head(5)['performance_score'].mean()
                
                if recent_score > older_score * 1.05:
                    trends[component] = 'improving'
                elif recent_score < older_score * 0.95:
                    trends[component] = 'declining'
                else:
                    trends[component] = 'stable'
            else:
                trends[component] = 'stable'
        
        return trends
    
    def _analyze_resource_utilization(self, system_data: Dict[str, List[Dict[str, Any]]]) -> Dict[str, float]:
        """Analyze resource utilization across system components"""
        utilization = {}
        
        # Simulated resource utilization
        utilization['cpu'] = np.random.uniform(30, 80)
        utilization['memory'] = np.random.uniform(40, 85)
        utilization['storage'] = np.random.uniform(20, 70)
        utilization['network'] = np.random.uniform(10, 60)
        
        return utilization
    
    def _predict_system_issues(self, system_data: Dict[str, List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
        """Predict potential system issues"""
        predicted_issues = []
        
        # Analyze patterns that might indicate future issues
        for component, metrics in system_data.items():
            if not metrics:
                continue
                
            df = pd.DataFrame(metrics)
            
            # Check for increasing error rates
            if 'error_rate' in df.columns and len(df) >= 5:
                recent_errors = df.tail(5)['error_rate'].mean()
                if recent_errors > 0.02:  # 2% error rate
                    predicted_issues.append({
                        'component': component,
                        'issue_type': 'increasing_errors',
                        'severity': 'medium',
                        'probability': min(recent_errors * 50, 0.8),
                        'description': f'{component} showing increased error rates',
                        'recommended_action': 'Monitor closely and investigate error causes'
                    })
        
        return predicted_issues
    
    def _generate_optimization_recommendations(
        self, 
        component_scores: Dict[str, float], 
        resource_utilization: Dict[str, float]
    ) -> List[str]:
        """Generate optimization recommendations"""
        recommendations = []
        
        # Check component performance
        for component, score in component_scores.items():
            if score < 70:
                recommendations.append(f"Optimize {component} performance - current score: {score:.1f}")
        
        # Check resource utilization
        for resource, utilization in resource_utilization.items():
            if utilization > 80:
                recommendations.append(f"High {resource} utilization ({utilization:.1f}%) - consider scaling")
            elif utilization < 30:
                recommendations.append(f"Low {resource} utilization ({utilization:.1f}%) - consider cost optimization")
        
        if not recommendations:
            recommendations.append("System performance is optimal - maintain current configuration")
        
        return recommendations
    
    def _detect_column_anomalies(self, df: pd.DataFrame, column: str) -> List[Dict[str, Any]]:
        """Detect anomalies in a specific column using statistical methods"""
        if column not in df.columns or len(df) < 10:
            return []
        
        values = df[column].values
        mean_val = np.mean(values)
        std_val = np.std(values)
        
        anomalies = []
        
        for idx, value in enumerate(values):
            z_score = abs((value - mean_val) / std_val) if std_val > 0 else 0
            
            if z_score > 2.5:
                anomalies.append({
                    'type': f'{column}_anomaly',
                    'index': idx,
                    'value': float(value),
                    'z_score': float(z_score),
                    'timestamp': df.iloc[idx]['timestamp'].isoformat() if 'timestamp' in df.columns else None,
                    'severity': 'high' if z_score > 3 else 'medium'
                })
        
        return anomalies
    
    def _forecast_confidence_trend(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Forecast confidence trends"""
        if 'confidence' not in df.columns or len(df) < 10:
            return {"status": "insufficient_data"}
        
        # Simple trend analysis
        recent_values = df.tail(10)['confidence'].values
        trend_slope = np.polyfit(range(len(recent_values)), recent_values, 1)[0]
        
        return {
            "current_trend": "increasing" if trend_slope > 0.01 else "decreasing" if trend_slope < -0.01 else "stable",
            "projected_change": float(trend_slope * 24),  # 24 hours ahead
            "confidence_level": "medium"
        }
    
    def _forecast_performance_trend(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Forecast overall performance trends"""
        return {
            "trend": "stable",
            "factors": ["confidence", "latency", "quality"],
            "projection_horizon": "24_hours"
        }
    
    def _generate_capacity_recommendations(self, df: pd.DataFrame) -> List[str]:
        """Generate capacity planning recommendations"""
        recommendations = []
        
        if len(df) >= 24:  # At least 24 data points
            recent_load = len(df.tail(12))  # Recent 12 periods
            historical_load = len(df.head(12))  # Earlier 12 periods
            
            growth_rate = (recent_load - historical_load) / historical_load if historical_load > 0 else 0
            
            if growth_rate > 0.2:
                recommendations.append("Consider scaling up - 20%+ load increase detected")
            elif growth_rate < -0.2:
                recommendations.append("Consider scaling down - 20%+ load decrease detected")
            else:
                recommendations.append("Current capacity appears adequate")
        
        return recommendations
    
    def _assess_future_risks(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Assess future risk levels"""
        if df.empty:
            return {"risk_level": "unknown"}
        
        # Simple risk assessment based on current trends
        if 'confidence' in df.columns:
            avg_confidence = df['confidence'].mean()
            risk_level = "low" if avg_confidence > 0.8 else "medium" if avg_confidence > 0.6 else "high"
        else:
            risk_level = "medium"
        
        return {
            "risk_level": risk_level,
            "factors": ["confidence_degradation", "latency_increase", "error_rate"],
            "mitigation_strategies": [
                "Monitor key metrics closely",
                "Implement automated alerts",
                "Prepare rollback procedures"
            ]
        }


def main():
    """Main function for testing the analytics engine"""
    # Initialize analytics engine
    analytics = ObservabilityAnalytics()
    
    # Sample data for testing
    sample_decisions = [
        {
            'timestamp': datetime.now() - timedelta(hours=i),
            'confidence': 0.8 + np.random.normal(0, 0.1),
            'latency': 1000 + np.random.normal(0, 200),
            'tokens_input': np.random.randint(100, 500),
            'tokens_output': np.random.randint(50, 200),
            'reasoning_count': np.random.randint(1, 5)
        }
        for i in range(100)
    ]
    
    # Test AI agent analysis
    ai_analytics = analytics.analyze_ai_agent_performance(sample_decisions, "QIE_Agent")
    print("AI Analytics:")
    print(json.dumps(asdict(ai_analytics), indent=2, default=str))
    
    print("\nAnalytics engine test completed successfully!")


if __name__ == "__main__":
    main()