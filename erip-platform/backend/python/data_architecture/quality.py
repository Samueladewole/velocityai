"""
Data Quality Monitoring System for ERIP Data Architecture
Reusable components for automated data quality assessment, anomaly detection, and quality metrics
"""

from typing import Dict, List, Optional, Any, Callable, Union, Tuple
from datetime import datetime, timedelta
from abc import ABC, abstractmethod
import asyncio
import json
from enum import Enum
import structlog
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

logger = structlog.get_logger()

class QualityDimension(str, Enum):
    """Data quality dimensions"""
    COMPLETENESS = "completeness"     # Data is complete and not missing
    ACCURACY = "accuracy"             # Data is correct and precise
    CONSISTENCY = "consistency"       # Data is consistent across systems
    VALIDITY = "validity"            # Data conforms to defined formats
    UNIQUENESS = "uniqueness"        # Data is unique without duplicates
    TIMELINESS = "timeliness"        # Data is up-to-date and timely
    INTEGRITY = "integrity"          # Data maintains referential integrity

class QualitySeverity(str, Enum):
    """Quality issue severity levels"""
    CRITICAL = "critical"     # Data cannot be used
    HIGH = "high"            # Significant quality issues
    MEDIUM = "medium"        # Moderate quality issues
    LOW = "low"              # Minor quality issues
    INFO = "info"            # Informational quality metrics

class QualityMetric(BaseModel):
    """Data quality metric"""
    metric_id: str
    name: str
    dimension: QualityDimension
    value: float
    threshold_min: Optional[float] = None
    threshold_max: Optional[float] = None
    severity: QualitySeverity = QualitySeverity.INFO
    description: str
    calculated_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class QualityIssue(BaseModel):
    """Data quality issue"""
    issue_id: str
    metric_id: str
    dimension: QualityDimension
    severity: QualitySeverity
    title: str
    description: str
    affected_records: int = 0
    affected_columns: List[str] = Field(default_factory=list)
    detected_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None
    resolution: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class QualityReport(BaseModel):
    """Comprehensive data quality report"""
    report_id: str
    dataset_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    metrics: List[QualityMetric] = Field(default_factory=list)
    issues: List[QualityIssue] = Field(default_factory=list)
    overall_score: float = 0.0
    dimension_scores: Dict[QualityDimension, float] = Field(default_factory=dict)
    recommendations: List[str] = Field(default_factory=list)
    statistics: Dict[str, Any] = Field(default_factory=dict)

class ValidationRule(ABC):
    """
    Abstract base class for reusable validation rules
    """
    
    def __init__(self, rule_id: str, name: str, dimension: QualityDimension):
        self.rule_id = rule_id
        self.name = name
        self.dimension = dimension
        
    @abstractmethod
    async def validate(self, df: pd.DataFrame) -> List[QualityMetric]:
        """Validate data and return quality metrics"""
        pass

class CompletenessRule(ValidationRule):
    """Check data completeness - no missing values"""
    
    def __init__(self, columns: Optional[List[str]] = None, threshold: float = 0.95):
        super().__init__("completeness", "Data Completeness", QualityDimension.COMPLETENESS)
        self.columns = columns
        self.threshold = threshold
    
    async def validate(self, df: pd.DataFrame) -> List[QualityMetric]:
        """Calculate completeness metrics"""
        metrics = []
        
        columns_to_check = self.columns or df.columns
        
        for column in columns_to_check:
            if column not in df.columns:
                continue
                
            total_records = len(df)
            missing_records = df[column].isnull().sum()
            completeness_score = (total_records - missing_records) / total_records if total_records > 0 else 0
            
            severity = QualitySeverity.INFO
            if completeness_score < self.threshold:
                if completeness_score < 0.5:
                    severity = QualitySeverity.CRITICAL
                elif completeness_score < 0.8:
                    severity = QualitySeverity.HIGH
                else:
                    severity = QualitySeverity.MEDIUM
            
            metrics.append(QualityMetric(
                metric_id=f"completeness_{column}",
                name=f"Completeness - {column}",
                dimension=self.dimension,
                value=completeness_score,
                threshold_min=self.threshold,
                severity=severity,
                description=f"Completeness score for column {column}",
                metadata={
                    "column": column,
                    "missing_count": int(missing_records),
                    "total_count": int(total_records)
                }
            ))
        
        return metrics

class UniquenessRule(ValidationRule):
    """Check data uniqueness - no duplicate values"""
    
    def __init__(self, columns: Optional[List[str]] = None, threshold: float = 0.95):
        super().__init__("uniqueness", "Data Uniqueness", QualityDimension.UNIQUENESS)
        self.columns = columns
        self.threshold = threshold
    
    async def validate(self, df: pd.DataFrame) -> List[QualityMetric]:
        """Calculate uniqueness metrics"""
        metrics = []
        
        if self.columns:
            # Check uniqueness across specified columns
            for column in self.columns:
                if column not in df.columns:
                    continue
                    
                total_records = len(df)
                unique_records = df[column].nunique()
                uniqueness_score = unique_records / total_records if total_records > 0 else 0
                
                severity = QualitySeverity.INFO
                if uniqueness_score < self.threshold:
                    severity = QualitySeverity.HIGH if uniqueness_score < 0.8 else QualitySeverity.MEDIUM
                
                metrics.append(QualityMetric(
                    metric_id=f"uniqueness_{column}",
                    name=f"Uniqueness - {column}",
                    dimension=self.dimension,
                    value=uniqueness_score,
                    threshold_min=self.threshold,
                    severity=severity,
                    description=f"Uniqueness score for column {column}",
                    metadata={
                        "column": column,
                        "unique_count": int(unique_records),
                        "total_count": int(total_records),
                        "duplicate_count": int(total_records - unique_records)
                    }
                ))
        else:
            # Check overall record uniqueness
            total_records = len(df)
            unique_records = len(df.drop_duplicates())
            uniqueness_score = unique_records / total_records if total_records > 0 else 0
            
            severity = QualitySeverity.INFO
            if uniqueness_score < self.threshold:
                severity = QualitySeverity.HIGH if uniqueness_score < 0.9 else QualitySeverity.MEDIUM
            
            metrics.append(QualityMetric(
                metric_id="uniqueness_records",
                name="Record Uniqueness",
                dimension=self.dimension,
                value=uniqueness_score,
                threshold_min=self.threshold,
                severity=severity,
                description="Overall record uniqueness score",
                metadata={
                    "unique_records": int(unique_records),
                    "total_records": int(total_records),
                    "duplicate_records": int(total_records - unique_records)
                }
            ))
        
        return metrics

class ValidityRule(ValidationRule):
    """Check data validity - conforms to expected format/type"""
    
    def __init__(self, column_types: Dict[str, str], patterns: Optional[Dict[str, str]] = None):
        super().__init__("validity", "Data Validity", QualityDimension.VALIDITY)
        self.column_types = column_types
        self.patterns = patterns or {}
    
    async def validate(self, df: pd.DataFrame) -> List[QualityMetric]:
        """Calculate validity metrics"""
        metrics = []
        
        for column, expected_type in self.column_types.items():
            if column not in df.columns:
                continue
            
            total_records = len(df[df[column].notnull()])  # Exclude null values
            valid_records = 0
            
            try:
                if expected_type == "int":
                    valid_records = len(df[df[column].astype(str).str.isdigit()])
                elif expected_type == "float":
                    valid_records = len(df[pd.to_numeric(df[column], errors='coerce').notnull()])
                elif expected_type == "date":
                    valid_records = len(df[pd.to_datetime(df[column], errors='coerce').notnull()])
                elif expected_type == "email" and column in self.patterns:
                    pattern = self.patterns[column]
                    valid_records = len(df[df[column].str.contains(pattern, regex=True, na=False)])
                else:
                    valid_records = total_records  # Assume all are valid for string types
                
                validity_score = valid_records / total_records if total_records > 0 else 1.0
                
                severity = QualitySeverity.INFO
                if validity_score < 0.95:
                    if validity_score < 0.8:
                        severity = QualitySeverity.HIGH
                    else:
                        severity = QualitySeverity.MEDIUM
                
                metrics.append(QualityMetric(
                    metric_id=f"validity_{column}",
                    name=f"Validity - {column}",
                    dimension=self.dimension,
                    value=validity_score,
                    threshold_min=0.95,
                    severity=severity,
                    description=f"Validity score for column {column} (expected type: {expected_type})",
                    metadata={
                        "column": column,
                        "expected_type": expected_type,
                        "valid_count": int(valid_records),
                        "total_count": int(total_records)
                    }
                ))
                
            except Exception as e:
                logger.error("Validity check failed", column=column, error=str(e))
        
        return metrics

class ConsistencyRule(ValidationRule):
    """Check data consistency across related fields"""
    
    def __init__(self, consistency_checks: Dict[str, Any]):
        super().__init__("consistency", "Data Consistency", QualityDimension.CONSISTENCY)
        self.consistency_checks = consistency_checks
    
    async def validate(self, df: pd.DataFrame) -> List[QualityMetric]:
        """Calculate consistency metrics"""
        metrics = []
        
        for check_name, check_config in self.consistency_checks.items():
            try:
                if check_config["type"] == "range":
                    # Check if values are within expected range relative to another column
                    col1, col2 = check_config["columns"]
                    if col1 in df.columns and col2 in df.columns:
                        # Example: end_date should be >= start_date
                        consistent_records = len(df[df[col2] >= df[col1]])
                        total_records = len(df)
                        consistency_score = consistent_records / total_records if total_records > 0 else 1.0
                        
                        severity = QualitySeverity.INFO
                        if consistency_score < 0.98:
                            severity = QualitySeverity.HIGH if consistency_score < 0.9 else QualitySeverity.MEDIUM
                        
                        metrics.append(QualityMetric(
                            metric_id=f"consistency_{check_name}",
                            name=f"Consistency - {check_name}",
                            dimension=self.dimension,
                            value=consistency_score,
                            threshold_min=0.98,
                            severity=severity,
                            description=f"Consistency check: {check_config['description']}",
                            metadata={
                                "check_type": "range",
                                "columns": [col1, col2],
                                "consistent_records": int(consistent_records),
                                "total_records": int(total_records)
                            }
                        ))
                
            except Exception as e:
                logger.error("Consistency check failed", check_name=check_name, error=str(e))
        
        return metrics

class AnomalyDetector:
    """
    Reusable anomaly detection for data quality monitoring
    Uses statistical methods to identify unusual patterns
    """
    
    def __init__(self, sensitivity: float = 2.0):
        self.sensitivity = sensitivity  # Number of standard deviations for outlier detection
        self.baseline_stats: Dict[str, Dict[str, Any]] = {}
    
    async def detect_anomalies(
        self, 
        df: pd.DataFrame, 
        columns: Optional[List[str]] = None
    ) -> List[QualityIssue]:
        """Detect anomalies in numerical data"""
        issues = []
        columns_to_check = columns or df.select_dtypes(include=[np.number]).columns
        
        for column in columns_to_check:
            if column not in df.columns:
                continue
            
            try:
                column_data = df[column].dropna()
                if len(column_data) == 0:
                    continue
                
                # Statistical outlier detection using z-score
                z_scores = np.abs(stats.zscore(column_data))
                outliers = column_data[z_scores > self.sensitivity]
                
                if len(outliers) > 0:
                    outlier_percentage = len(outliers) / len(column_data) * 100
                    
                    severity = QualitySeverity.LOW
                    if outlier_percentage > 10:
                        severity = QualitySeverity.HIGH
                    elif outlier_percentage > 5:
                        severity = QualitySeverity.MEDIUM
                    
                    issues.append(QualityIssue(
                        issue_id=f"anomaly_outliers_{column}",
                        metric_id=f"outliers_{column}",
                        dimension=QualityDimension.ACCURACY,
                        severity=severity,
                        title=f"Statistical Outliers Detected in {column}",
                        description=f"Found {len(outliers)} outliers ({outlier_percentage:.1f}%) in column {column}",
                        affected_records=len(outliers),
                        affected_columns=[column],
                        metadata={
                            "column": column,
                            "outlier_count": len(outliers),
                            "outlier_percentage": outlier_percentage,
                            "mean": float(column_data.mean()),
                            "std": float(column_data.std()),
                            "sensitivity": self.sensitivity
                        }
                    ))
                
                # Trend anomaly detection (if we have baseline stats)
                if column in self.baseline_stats:
                    current_mean = column_data.mean()
                    baseline_mean = self.baseline_stats[column]["mean"]
                    baseline_std = self.baseline_stats[column]["std"]
                    
                    if abs(current_mean - baseline_mean) > (self.sensitivity * baseline_std):
                        issues.append(QualityIssue(
                            issue_id=f"anomaly_trend_{column}",
                            metric_id=f"trend_{column}",
                            dimension=QualityDimension.CONSISTENCY,
                            severity=QualitySeverity.MEDIUM,
                            title=f"Trend Anomaly in {column}",
                            description=f"Column {column} mean has significantly changed from baseline",
                            affected_records=len(column_data),
                            affected_columns=[column],
                            metadata={
                                "column": column,
                                "current_mean": float(current_mean),
                                "baseline_mean": float(baseline_mean),
                                "deviation": float(abs(current_mean - baseline_mean))
                            }
                        ))
                
            except Exception as e:
                logger.error("Anomaly detection failed", column=column, error=str(e))
        
        return issues
    
    async def update_baseline(self, df: pd.DataFrame, columns: Optional[List[str]] = None) -> None:
        """Update baseline statistics for anomaly detection"""
        columns_to_check = columns or df.select_dtypes(include=[np.number]).columns
        
        for column in columns_to_check:
            if column not in df.columns:
                continue
            
            column_data = df[column].dropna()
            if len(column_data) > 0:
                self.baseline_stats[column] = {
                    "mean": float(column_data.mean()),
                    "std": float(column_data.std()),
                    "min": float(column_data.min()),
                    "max": float(column_data.max()),
                    "count": len(column_data),
                    "updated_at": datetime.utcnow().isoformat()
                }
        
        logger.info("Baseline statistics updated", columns=len(self.baseline_stats))

class DataQualityMonitor:
    """
    Comprehensive data quality monitoring system
    Orchestrates quality checks, anomaly detection, and reporting
    """
    
    def __init__(self):
        self.validation_rules: List[ValidationRule] = []
        self.anomaly_detector = AnomalyDetector()
        self.quality_history: List[QualityReport] = []
        self.thresholds: Dict[QualityDimension, float] = {
            QualityDimension.COMPLETENESS: 0.95,
            QualityDimension.ACCURACY: 0.98,
            QualityDimension.CONSISTENCY: 0.95,
            QualityDimension.VALIDITY: 0.95,
            QualityDimension.UNIQUENESS: 0.95,
            QualityDimension.TIMELINESS: 0.90,
            QualityDimension.INTEGRITY: 0.98
        }
    
    def add_validation_rule(self, rule: ValidationRule) -> None:
        """Add reusable validation rule"""
        self.validation_rules.append(rule)
        logger.info("Validation rule added", rule_id=rule.rule_id)
    
    def set_quality_threshold(self, dimension: QualityDimension, threshold: float) -> None:
        """Set quality threshold for specific dimension"""
        self.thresholds[dimension] = threshold
        logger.info("Quality threshold updated", dimension=dimension, threshold=threshold)
    
    async def assess_quality(
        self, 
        df: pd.DataFrame, 
        dataset_id: str,
        include_anomaly_detection: bool = True
    ) -> QualityReport:
        """Comprehensive data quality assessment"""
        report_id = f"quality_report_{dataset_id}_{int(datetime.utcnow().timestamp())}"
        
        report = QualityReport(
            report_id=report_id,
            dataset_id=dataset_id
        )
        
        try:
            # Run validation rules
            all_metrics = []
            for rule in self.validation_rules:
                try:
                    metrics = await rule.validate(df)
                    all_metrics.extend(metrics)
                except Exception as e:
                    logger.error("Validation rule failed", rule_id=rule.rule_id, error=str(e))
            
            report.metrics = all_metrics
            
            # Detect anomalies if enabled
            if include_anomaly_detection:
                try:
                    anomaly_issues = await self.anomaly_detector.detect_anomalies(df)
                    report.issues.extend(anomaly_issues)
                except Exception as e:
                    logger.error("Anomaly detection failed", error=str(e))
            
            # Generate quality issues from metrics
            metric_issues = self._generate_issues_from_metrics(all_metrics)
            report.issues.extend(metric_issues)
            
            # Calculate dimension scores
            report.dimension_scores = self._calculate_dimension_scores(all_metrics)
            
            # Calculate overall quality score
            report.overall_score = self._calculate_overall_score(report.dimension_scores)
            
            # Generate recommendations
            report.recommendations = self._generate_recommendations(report)
            
            # Calculate basic statistics
            report.statistics = self._calculate_dataset_statistics(df)
            
            # Store in history
            self.quality_history.append(report)
            
            logger.info("Quality assessment completed", 
                       dataset_id=dataset_id,
                       overall_score=report.overall_score,
                       issues_count=len(report.issues))
            
        except Exception as e:
            logger.error("Quality assessment failed", dataset_id=dataset_id, error=str(e))
            raise
        
        return report
    
    def _generate_issues_from_metrics(self, metrics: List[QualityMetric]) -> List[QualityIssue]:
        """Generate quality issues from failed metrics"""
        issues = []
        
        for metric in metrics:
            if metric.severity in [QualitySeverity.CRITICAL, QualitySeverity.HIGH, QualitySeverity.MEDIUM]:
                # Check if metric fails threshold
                fails_threshold = False
                if metric.threshold_min is not None and metric.value < metric.threshold_min:
                    fails_threshold = True
                elif metric.threshold_max is not None and metric.value > metric.threshold_max:
                    fails_threshold = True
                
                if fails_threshold:
                    issue = QualityIssue(
                        issue_id=f"threshold_fail_{metric.metric_id}",
                        metric_id=metric.metric_id,
                        dimension=metric.dimension,
                        severity=metric.severity,
                        title=f"Quality Threshold Failed: {metric.name}",
                        description=f"{metric.description}. Value: {metric.value:.3f}",
                        affected_columns=[metric.metadata.get('column')] if 'column' in metric.metadata else [],
                        metadata=metric.metadata
                    )
                    issues.append(issue)
        
        return issues
    
    def _calculate_dimension_scores(self, metrics: List[QualityMetric]) -> Dict[QualityDimension, float]:
        """Calculate quality scores by dimension"""
        dimension_scores = {}
        
        for dimension in QualityDimension:
            dimension_metrics = [m for m in metrics if m.dimension == dimension]
            if dimension_metrics:
                # Calculate weighted average (could be enhanced with actual weights)
                total_score = sum(m.value for m in dimension_metrics)
                dimension_scores[dimension] = total_score / len(dimension_metrics)
            else:
                dimension_scores[dimension] = 1.0  # Default to perfect if no metrics
        
        return dimension_scores
    
    def _calculate_overall_score(self, dimension_scores: Dict[QualityDimension, float]) -> float:
        """Calculate overall quality score"""
        if not dimension_scores:
            return 0.0
        
        # Simple average - could be enhanced with dimension weights
        return sum(dimension_scores.values()) / len(dimension_scores)
    
    def _generate_recommendations(self, report: QualityReport) -> List[str]:
        """Generate quality improvement recommendations"""
        recommendations = []
        
        # Completeness recommendations
        if report.dimension_scores.get(QualityDimension.COMPLETENESS, 1.0) < 0.9:
            recommendations.append("Improve data completeness by implementing required field validation at data entry points")
        
        # Uniqueness recommendations
        if report.dimension_scores.get(QualityDimension.UNIQUENESS, 1.0) < 0.9:
            recommendations.append("Implement deduplication processes to improve data uniqueness")
        
        # Validity recommendations
        if report.dimension_scores.get(QualityDimension.VALIDITY, 1.0) < 0.9:
            recommendations.append("Strengthen data validation rules and format standardization")
        
        # Critical issues recommendations
        critical_issues = [i for i in report.issues if i.severity == QualitySeverity.CRITICAL]
        if critical_issues:
            recommendations.append("Address critical data quality issues immediately - data may be unusable")
        
        return recommendations
    
    def _calculate_dataset_statistics(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Calculate basic dataset statistics"""
        return {
            "record_count": len(df),
            "column_count": len(df.columns),
            "numeric_columns": len(df.select_dtypes(include=[np.number]).columns),
            "text_columns": len(df.select_dtypes(include=['object']).columns),
            "date_columns": len(df.select_dtypes(include=['datetime64']).columns),
            "missing_values_total": int(df.isnull().sum().sum()),
            "memory_usage_mb": df.memory_usage(deep=True).sum() / 1024 / 1024
        }
    
    async def get_quality_trends(
        self, 
        dataset_id: str, 
        days: int = 30
    ) -> Dict[str, Any]:
        """Get quality trends over time"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        relevant_reports = [
            r for r in self.quality_history 
            if r.dataset_id == dataset_id and r.generated_at >= cutoff_date
        ]
        
        if not relevant_reports:
            return {"message": "No quality data available for the specified period"}
        
        # Calculate trend metrics
        overall_scores = [r.overall_score for r in relevant_reports]
        dimension_trends = {}
        
        for dimension in QualityDimension:
            dimension_scores = [r.dimension_scores.get(dimension, 0) for r in relevant_reports]
            if dimension_scores:
                dimension_trends[dimension.value] = {
                    "current": dimension_scores[-1],
                    "average": sum(dimension_scores) / len(dimension_scores),
                    "trend": "improving" if len(dimension_scores) > 1 and dimension_scores[-1] > dimension_scores[0] else "declining" if len(dimension_scores) > 1 and dimension_scores[-1] < dimension_scores[0] else "stable"
                }
        
        return {
            "dataset_id": dataset_id,
            "period_days": days,
            "reports_analyzed": len(relevant_reports),
            "overall_quality": {
                "current": overall_scores[-1],
                "average": sum(overall_scores) / len(overall_scores),
                "best": max(overall_scores),
                "worst": min(overall_scores)
            },
            "dimension_trends": dimension_trends,
            "latest_issues_count": len(relevant_reports[-1].issues),
            "trend_analysis": {
                "improving_dimensions": len([d for d in dimension_trends.values() if d["trend"] == "improving"]),
                "declining_dimensions": len([d for d in dimension_trends.values() if d["trend"] == "declining"]),
                "stable_dimensions": len([d for d in dimension_trends.values() if d["trend"] == "stable"])
            }
        }
    
    def get_quality_summary(self) -> Dict[str, Any]:
        """Get overall quality monitoring summary"""
        if not self.quality_history:
            return {"message": "No quality assessments have been performed"}
        
        latest_reports = {}
        for report in self.quality_history:
            if report.dataset_id not in latest_reports or report.generated_at > latest_reports[report.dataset_id].generated_at:
                latest_reports[report.dataset_id] = report
        
        total_datasets = len(latest_reports)
        total_issues = sum(len(report.issues) for report in latest_reports.values())
        critical_issues = sum(
            len([i for i in report.issues if i.severity == QualitySeverity.CRITICAL])
            for report in latest_reports.values()
        )
        
        avg_quality_score = sum(report.overall_score for report in latest_reports.values()) / total_datasets if total_datasets > 0 else 0
        
        return {
            "total_datasets_monitored": total_datasets,
            "average_quality_score": avg_quality_score,
            "total_active_issues": total_issues,
            "critical_issues": critical_issues,
            "datasets_below_threshold": len([r for r in latest_reports.values() if r.overall_score < 0.8]),
            "validation_rules_active": len(self.validation_rules),
            "quality_thresholds": {k.value: v for k, v in self.thresholds.items()}
        }

# Reusable quality check functions
async def check_referential_integrity(
    df: pd.DataFrame, 
    foreign_key: str, 
    reference_values: List[Any]
) -> QualityMetric:
    """Check referential integrity between datasets"""
    if foreign_key not in df.columns:
        return QualityMetric(
            metric_id=f"integrity_{foreign_key}",
            name=f"Referential Integrity - {foreign_key}",
            dimension=QualityDimension.INTEGRITY,
            value=0.0,
            severity=QualitySeverity.CRITICAL,
            description=f"Foreign key column {foreign_key} not found"
        )
    
    valid_references = df[foreign_key].isin(reference_values).sum()
    total_records = len(df[df[foreign_key].notnull()])
    integrity_score = valid_references / total_records if total_records > 0 else 1.0
    
    severity = QualitySeverity.INFO
    if integrity_score < 0.98:
        severity = QualitySeverity.CRITICAL if integrity_score < 0.9 else QualitySeverity.HIGH
    
    return QualityMetric(
        metric_id=f"integrity_{foreign_key}",
        name=f"Referential Integrity - {foreign_key}",
        dimension=QualityDimension.INTEGRITY,
        value=integrity_score,
        threshold_min=0.98,
        severity=severity,
        description=f"Referential integrity score for {foreign_key}",
        metadata={
            "foreign_key": foreign_key,
            "valid_references": int(valid_references),
            "total_records": int(total_records),
            "reference_count": len(reference_values)
        }
    )

async def check_data_freshness(
    df: pd.DataFrame, 
    timestamp_column: str, 
    max_age_hours: int = 24
) -> QualityMetric:
    """Check data timeliness/freshness"""
    if timestamp_column not in df.columns:
        return QualityMetric(
            metric_id=f"timeliness_{timestamp_column}",
            name=f"Data Freshness - {timestamp_column}",
            dimension=QualityDimension.TIMELINESS,
            value=0.0,
            severity=QualitySeverity.CRITICAL,
            description=f"Timestamp column {timestamp_column} not found"
        )
    
    try:
        timestamps = pd.to_datetime(df[timestamp_column], errors='coerce')
        current_time = datetime.utcnow()
        cutoff_time = current_time - timedelta(hours=max_age_hours)
        
        fresh_records = len(timestamps[timestamps >= cutoff_time])
        total_records = len(timestamps.dropna())
        freshness_score = fresh_records / total_records if total_records > 0 else 0.0
        
        severity = QualitySeverity.INFO
        if freshness_score < 0.8:
            severity = QualitySeverity.HIGH if freshness_score < 0.5 else QualitySeverity.MEDIUM
        
        return QualityMetric(
            metric_id=f"timeliness_{timestamp_column}",
            name=f"Data Freshness - {timestamp_column}",
            dimension=QualityDimension.TIMELINESS,
            value=freshness_score,
            threshold_min=0.8,
            severity=severity,
            description=f"Data freshness score for {timestamp_column} (max age: {max_age_hours}h)",
            metadata={
                "timestamp_column": timestamp_column,
                "max_age_hours": max_age_hours,
                "fresh_records": int(fresh_records),
                "total_records": int(total_records),
                "oldest_record": timestamps.min().isoformat() if not timestamps.empty else None,
                "newest_record": timestamps.max().isoformat() if not timestamps.empty else None
            }
        )
        
    except Exception as e:
        return QualityMetric(
            metric_id=f"timeliness_{timestamp_column}",
            name=f"Data Freshness - {timestamp_column}",
            dimension=QualityDimension.TIMELINESS,
            value=0.0,
            severity=QualitySeverity.CRITICAL,
            description=f"Error checking data freshness: {str(e)}"
        )