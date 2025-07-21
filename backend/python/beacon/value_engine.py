# BEACON - Value Demonstration Platform
# ROI measurement, business impact reporting, and success story generation

from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel
from datetime import datetime, timedelta
import asyncio
import json
from enum import Enum
import uuid
import numpy as np

from anthropic import AsyncAnthropic
from shared.config import get_settings

class MetricCategory(str, Enum):
    FINANCIAL = "financial"
    OPERATIONAL = "operational"
    SECURITY = "security"
    COMPLIANCE = "compliance"
    PRODUCTIVITY = "productivity"

class ROITimeframe(str, Enum):
    QUARTERLY = "quarterly"
    ANNUALLY = "annually"
    THREE_YEAR = "three_year"
    FIVE_YEAR = "five_year"

class MaturityLevel(str, Enum):
    INITIAL = "initial"
    DEVELOPING = "developing"
    DEFINED = "defined"
    MANAGED = "managed"
    OPTIMIZING = "optimizing"

class ROIMetric(BaseModel):
    metric_id: str
    name: str
    category: MetricCategory
    current_value: float
    baseline_value: float
    target_value: float
    improvement_percentage: float
    financial_impact: float
    measurement_unit: str
    measurement_date: datetime
    confidence_level: float

class BusinessImpactReport(BaseModel):
    report_id: str
    title: str
    organization_id: str
    reporting_period: str
    total_roi: float
    cost_savings: float
    cost_avoidance: float
    productivity_gains: float
    risk_reduction_value: float
    compliance_value: float
    metrics: List[ROIMetric]
    success_stories: List[str]
    generated_at: datetime
    next_report_date: datetime

class MaturityAssessment(BaseModel):
    assessment_id: str
    organization_id: str
    overall_maturity: MaturityLevel
    domain_scores: Dict[str, float]
    current_capabilities: List[str]
    improvement_opportunities: List[str]
    maturity_roadmap: List[Dict[str, Any]]
    benchmark_comparison: Dict[str, float]
    assessment_date: datetime

class SuccessStory(BaseModel):
    story_id: str
    title: str
    challenge: str
    solution: str
    implementation: str
    results: str
    metrics: Dict[str, float]
    timeline: str
    stakeholders: List[str]
    industry: str
    company_size: str
    generated_at: datetime

class ValueDemonstrationEngine:
    """AI-powered value demonstration and ROI calculation engine"""
    
    def __init__(self):
        settings = get_settings()
        self.anthropic_client = AsyncAnthropic(api_key=settings.anthropic_api_key)
        
        # Value tracking cache
        self.roi_cache = {}
        self.impact_reports = {}
        self.maturity_assessments = {}
        self.success_stories = {}
        
    async def calculate_roi_metrics(
        self,
        organization_id: str,
        baseline_data: Dict[str, float],
        current_data: Dict[str, float],
        investment_data: Dict[str, float],
        timeframe: ROITimeframe
    ) -> List[ROIMetric]:
        """Calculate comprehensive ROI metrics across all categories"""
        
        try:
            roi_metrics = []
            
            # Financial metrics
            financial_metrics = await self._calculate_financial_metrics(
                baseline_data, current_data, investment_data
            )
            roi_metrics.extend(financial_metrics)
            
            # Security metrics
            security_metrics = await self._calculate_security_metrics(
                baseline_data, current_data
            )
            roi_metrics.extend(security_metrics)
            
            # Operational metrics
            operational_metrics = await self._calculate_operational_metrics(
                baseline_data, current_data
            )
            roi_metrics.extend(operational_metrics)
            
            # Compliance metrics
            compliance_metrics = await self._calculate_compliance_metrics(
                baseline_data, current_data
            )
            roi_metrics.extend(compliance_metrics)
            
            # AI-enhanced impact analysis
            enhanced_metrics = await self._enhance_metrics_with_ai(roi_metrics)
            
            return enhanced_metrics
            
        except Exception as e:
            raise Exception(f"ROI calculation failed: {str(e)}")
    
    async def _calculate_financial_metrics(
        self,
        baseline: Dict[str, float],
        current: Dict[str, float],
        investment: Dict[str, float]
    ) -> List[ROIMetric]:
        """Calculate financial ROI metrics"""
        
        metrics = []
        
        # Cost savings from automation
        automation_savings = current.get('automated_processes', 0) * 2000  # $2k per automated process
        baseline_automation = baseline.get('automated_processes', 0) * 2000
        
        if automation_savings > baseline_automation:
            metrics.append(ROIMetric(
                metric_id=str(uuid.uuid4()),
                name="Automation Cost Savings",
                category=MetricCategory.FINANCIAL,
                current_value=automation_savings,
                baseline_value=baseline_automation,
                target_value=automation_savings * 1.5,
                improvement_percentage=((automation_savings - baseline_automation) / max(baseline_automation, 1)) * 100,
                financial_impact=automation_savings - baseline_automation,
                measurement_unit="USD",
                measurement_date=datetime.utcnow(),
                confidence_level=0.85
            ))
        
        # Incident cost reduction
        incident_cost_reduction = (baseline.get('incident_costs', 100000) - current.get('incident_costs', 50000))
        if incident_cost_reduction > 0:
            metrics.append(ROIMetric(
                metric_id=str(uuid.uuid4()),
                name="Security Incident Cost Reduction",
                category=MetricCategory.FINANCIAL,
                current_value=current.get('incident_costs', 50000),
                baseline_value=baseline.get('incident_costs', 100000),
                target_value=25000,
                improvement_percentage=(incident_cost_reduction / baseline.get('incident_costs', 100000)) * 100,
                financial_impact=incident_cost_reduction,
                measurement_unit="USD",
                measurement_date=datetime.utcnow(),
                confidence_level=0.90
            ))
        
        # Compliance cost optimization
        compliance_savings = baseline.get('compliance_costs', 200000) - current.get('compliance_costs', 120000)
        if compliance_savings > 0:
            metrics.append(ROIMetric(
                metric_id=str(uuid.uuid4()),
                name="Compliance Cost Optimization",
                category=MetricCategory.FINANCIAL,
                current_value=current.get('compliance_costs', 120000),
                baseline_value=baseline.get('compliance_costs', 200000),
                target_value=100000,
                improvement_percentage=(compliance_savings / baseline.get('compliance_costs', 200000)) * 100,
                financial_impact=compliance_savings,
                measurement_unit="USD",
                measurement_date=datetime.utcnow(),
                confidence_level=0.80
            ))
        
        return metrics
    
    async def _calculate_security_metrics(
        self,
        baseline: Dict[str, float],
        current: Dict[str, float]
    ) -> List[ROIMetric]:
        """Calculate security-related ROI metrics"""
        
        metrics = []
        
        # Security posture improvement
        security_score_improvement = current.get('security_score', 7.5) - baseline.get('security_score', 6.0)
        if security_score_improvement > 0:
            # Convert security score to financial value
            financial_impact = security_score_improvement * 50000  # $50k per point improvement
            
            metrics.append(ROIMetric(
                metric_id=str(uuid.uuid4()),
                name="Security Posture Improvement",
                category=MetricCategory.SECURITY,
                current_value=current.get('security_score', 7.5),
                baseline_value=baseline.get('security_score', 6.0),
                target_value=9.0,
                improvement_percentage=(security_score_improvement / baseline.get('security_score', 6.0)) * 100,
                financial_impact=financial_impact,
                measurement_unit="Score (1-10)",
                measurement_date=datetime.utcnow(),
                confidence_level=0.88
            ))
        
        # Vulnerability reduction
        vuln_reduction = baseline.get('critical_vulnerabilities', 50) - current.get('critical_vulnerabilities', 15)
        if vuln_reduction > 0:
            # Value of reduced vulnerabilities
            financial_impact = vuln_reduction * 5000  # $5k per critical vuln avoided
            
            metrics.append(ROIMetric(
                metric_id=str(uuid.uuid4()),
                name="Critical Vulnerability Reduction",
                category=MetricCategory.SECURITY,
                current_value=current.get('critical_vulnerabilities', 15),
                baseline_value=baseline.get('critical_vulnerabilities', 50),
                target_value=5,
                improvement_percentage=(vuln_reduction / baseline.get('critical_vulnerabilities', 50)) * 100,
                financial_impact=financial_impact,
                measurement_unit="Count",
                measurement_date=datetime.utcnow(),
                confidence_level=0.92
            ))
        
        return metrics
    
    async def _calculate_operational_metrics(
        self,
        baseline: Dict[str, float],
        current: Dict[str, float]
    ) -> List[ROIMetric]:
        """Calculate operational efficiency metrics"""
        
        metrics = []
        
        # Mean Time to Detection (MTTD) improvement
        mttd_improvement = baseline.get('mttd_hours', 72) - current.get('mttd_hours', 24)
        if mttd_improvement > 0:
            # Financial value of faster detection
            financial_impact = mttd_improvement * 1000  # $1k per hour improvement
            
            metrics.append(ROIMetric(
                metric_id=str(uuid.uuid4()),
                name="Mean Time to Detection Improvement",
                category=MetricCategory.OPERATIONAL,
                current_value=current.get('mttd_hours', 24),
                baseline_value=baseline.get('mttd_hours', 72),
                target_value=12,
                improvement_percentage=(mttd_improvement / baseline.get('mttd_hours', 72)) * 100,
                financial_impact=financial_impact,
                measurement_unit="Hours",
                measurement_date=datetime.utcnow(),
                confidence_level=0.87
            ))
        
        # Staff productivity improvement
        productivity_gain = current.get('automation_percentage', 40) - baseline.get('automation_percentage', 15)
        if productivity_gain > 0:
            # Productivity value calculation
            financial_impact = productivity_gain * 2000  # $2k per percentage point
            
            metrics.append(ROIMetric(
                metric_id=str(uuid.uuid4()),
                name="Staff Productivity Through Automation",
                category=MetricCategory.PRODUCTIVITY,
                current_value=current.get('automation_percentage', 40),
                baseline_value=baseline.get('automation_percentage', 15),
                target_value=70,
                improvement_percentage=(productivity_gain / baseline.get('automation_percentage', 15)) * 100,
                financial_impact=financial_impact,
                measurement_unit="Percentage",
                measurement_date=datetime.utcnow(),
                confidence_level=0.83
            ))
        
        return metrics
    
    async def _calculate_compliance_metrics(
        self,
        baseline: Dict[str, float],
        current: Dict[str, float]
    ) -> List[ROIMetric]:
        """Calculate compliance-related metrics"""
        
        metrics = []
        
        # Compliance score improvement
        compliance_improvement = current.get('compliance_score', 85) - baseline.get('compliance_score', 68)
        if compliance_improvement > 0:
            # Value of improved compliance
            financial_impact = compliance_improvement * 3000  # $3k per percentage point
            
            metrics.append(ROIMetric(
                metric_id=str(uuid.uuid4()),
                name="Overall Compliance Score",
                category=MetricCategory.COMPLIANCE,
                current_value=current.get('compliance_score', 85),
                baseline_value=baseline.get('compliance_score', 68),
                target_value=95,
                improvement_percentage=(compliance_improvement / baseline.get('compliance_score', 68)) * 100,
                financial_impact=financial_impact,
                measurement_unit="Percentage",
                measurement_date=datetime.utcnow(),
                confidence_level=0.90
            ))
        
        # Audit preparation time reduction
        audit_time_reduction = baseline.get('audit_prep_days', 45) - current.get('audit_prep_days', 15)
        if audit_time_reduction > 0:
            # Value of reduced audit preparation time
            financial_impact = audit_time_reduction * 1500  # $1.5k per day saved
            
            metrics.append(ROIMetric(
                metric_id=str(uuid.uuid4()),
                name="Audit Preparation Time Reduction",
                category=MetricCategory.COMPLIANCE,
                current_value=current.get('audit_prep_days', 15),
                baseline_value=baseline.get('audit_prep_days', 45),
                target_value=10,
                improvement_percentage=(audit_time_reduction / baseline.get('audit_prep_days', 45)) * 100,
                financial_impact=financial_impact,
                measurement_unit="Days",
                measurement_date=datetime.utcnow(),
                confidence_level=0.85
            ))
        
        return metrics
    
    async def _enhance_metrics_with_ai(self, metrics: List[ROIMetric]) -> List[ROIMetric]:
        """Enhance ROI metrics with AI analysis and insights"""
        
        for metric in metrics:
            enhancement_prompt = f"""
            Analyze this ROI metric and provide additional insights:
            
            Metric: {metric.name}
            Category: {metric.category}
            Current Value: {metric.current_value} {metric.measurement_unit}
            Baseline Value: {metric.baseline_value} {metric.measurement_unit}
            Improvement: {metric.improvement_percentage:.1f}%
            Financial Impact: ${metric.financial_impact:,.2f}
            
            Provide brief analysis on:
            1. Significance of this improvement
            2. Industry benchmark comparison
            3. Sustainability of gains
            4. Additional value drivers
            
            Keep response concise (2-3 sentences).
            """
            
            try:
                response = await self.anthropic_client.messages.create(
                    model="claude-3-haiku-20240307",
                    max_tokens=200,
                    messages=[{"role": "user", "content": enhancement_prompt}]
                )
                
                # Add AI insights as metadata (would be stored in database)
                metric.ai_insights = response.content[0].text
                
            except Exception:
                # If AI enhancement fails, continue without insights
                pass
        
        return metrics
    
    async def generate_business_impact_report(
        self,
        organization_id: str,
        metrics: List[ROIMetric],
        reporting_period: str
    ) -> BusinessImpactReport:
        """Generate comprehensive business impact report"""
        
        try:
            # Calculate aggregate values
            total_financial_impact = sum(metric.financial_impact for metric in metrics)
            cost_savings = sum(metric.financial_impact for metric in metrics if metric.category == MetricCategory.FINANCIAL)
            
            # Estimate cost avoidance (prevented losses)
            security_metrics = [m for m in metrics if m.category == MetricCategory.SECURITY]
            cost_avoidance = sum(metric.financial_impact * 2 for metric in security_metrics)  # 2x multiplier for avoided costs
            
            # Calculate productivity gains
            productivity_metrics = [m for m in metrics if m.category == MetricCategory.PRODUCTIVITY]
            productivity_gains = sum(metric.financial_impact for metric in productivity_metrics)
            
            # Generate success stories
            success_stories = await self._generate_success_stories(metrics)
            
            report = BusinessImpactReport(
                report_id=str(uuid.uuid4()),
                title=f"ERIP Business Impact Report - {reporting_period}",
                organization_id=organization_id,
                reporting_period=reporting_period,
                total_roi=total_financial_impact,
                cost_savings=cost_savings,
                cost_avoidance=cost_avoidance,
                productivity_gains=productivity_gains,
                risk_reduction_value=sum(m.financial_impact for m in metrics if m.category == MetricCategory.SECURITY),
                compliance_value=sum(m.financial_impact for m in metrics if m.category == MetricCategory.COMPLIANCE),
                metrics=metrics,
                success_stories=success_stories,
                generated_at=datetime.utcnow(),
                next_report_date=datetime.utcnow() + timedelta(days=90)
            )
            
            # Cache the report
            self.impact_reports[report.report_id] = report
            
            return report
            
        except Exception as e:
            raise Exception(f"Business impact report generation failed: {str(e)}")
    
    async def assess_security_maturity(
        self,
        organization_id: str,
        current_capabilities: Dict[str, float],
        industry_benchmarks: Dict[str, float]
    ) -> MaturityAssessment:
        """Assess organizational security maturity"""
        
        try:
            # Calculate domain scores
            domain_scores = {
                "governance": current_capabilities.get('governance_score', 3.2),
                "risk_management": current_capabilities.get('risk_management_score', 3.8),
                "security_operations": current_capabilities.get('security_ops_score', 4.1),
                "incident_response": current_capabilities.get('incident_response_score', 3.5),
                "compliance": current_capabilities.get('compliance_score', 4.2),
                "threat_intelligence": current_capabilities.get('threat_intel_score', 3.0)
            }
            
            # Calculate overall maturity
            overall_score = sum(domain_scores.values()) / len(domain_scores)
            overall_maturity = self._determine_maturity_level(overall_score)
            
            # Generate improvement opportunities
            improvement_opportunities = []
            for domain, score in domain_scores.items():
                if score < 4.0:  # Below "Managed" level
                    improvement_opportunities.append(f"Enhance {domain.replace('_', ' ')} capabilities")
            
            # Create maturity roadmap
            roadmap = await self._create_maturity_roadmap(domain_scores)
            
            assessment = MaturityAssessment(
                assessment_id=str(uuid.uuid4()),
                organization_id=organization_id,
                overall_maturity=overall_maturity,
                domain_scores=domain_scores,
                current_capabilities=list(domain_scores.keys()),
                improvement_opportunities=improvement_opportunities,
                maturity_roadmap=roadmap,
                benchmark_comparison=self._compare_to_benchmarks(domain_scores, industry_benchmarks),
                assessment_date=datetime.utcnow()
            )
            
            # Cache the assessment
            self.maturity_assessments[assessment.assessment_id] = assessment
            
            return assessment
            
        except Exception as e:
            raise Exception(f"Maturity assessment failed: {str(e)}")
    
    async def _generate_success_stories(self, metrics: List[ROIMetric]) -> List[str]:
        """Generate success stories from metrics"""
        
        stories = []
        
        # Find top performing metrics
        top_metrics = sorted(metrics, key=lambda x: x.improvement_percentage, reverse=True)[:3]
        
        for metric in top_metrics:
            story_prompt = f"""
            Create a brief success story based on this improvement:
            
            Achievement: {metric.name}
            Improvement: {metric.improvement_percentage:.1f}%
            Financial Impact: ${metric.financial_impact:,.2f}
            
            Write a 2-3 sentence success story highlighting:
            - The challenge addressed
            - The solution implemented
            - The quantified results achieved
            
            Keep it professional and results-focused.
            """
            
            try:
                response = await self.anthropic_client.messages.create(
                    model="claude-3-haiku-20240307",
                    max_tokens=150,
                    messages=[{"role": "user", "content": story_prompt}]
                )
                
                stories.append(response.content[0].text.strip())
                
            except Exception:
                # Fallback success story
                stories.append(f"Achieved {metric.improvement_percentage:.1f}% improvement in {metric.name}, "
                             f"resulting in ${metric.financial_impact:,.2f} in business value.")
        
        return stories
    
    def _determine_maturity_level(self, score: float) -> MaturityLevel:
        """Determine maturity level based on score"""
        if score >= 4.5:
            return MaturityLevel.OPTIMIZING
        elif score >= 3.5:
            return MaturityLevel.MANAGED
        elif score >= 2.5:
            return MaturityLevel.DEFINED
        elif score >= 1.5:
            return MaturityLevel.DEVELOPING
        else:
            return MaturityLevel.INITIAL
    
    async def _create_maturity_roadmap(self, domain_scores: Dict[str, float]) -> List[Dict[str, Any]]:
        """Create maturity improvement roadmap"""
        
        roadmap = []
        
        # Identify lowest scoring domains for prioritization
        sorted_domains = sorted(domain_scores.items(), key=lambda x: x[1])
        
        for i, (domain, score) in enumerate(sorted_domains[:3]):  # Top 3 priorities
            roadmap.append({
                "priority": i + 1,
                "domain": domain,
                "current_score": score,
                "target_score": min(5.0, score + 1.0),
                "timeline": f"{(i + 1) * 6} months",
                "key_initiatives": [
                    f"Implement {domain} best practices",
                    f"Deploy automated {domain} tools",
                    f"Enhance {domain} processes and training"
                ]
            })
        
        return roadmap
    
    def _compare_to_benchmarks(
        self,
        scores: Dict[str, float],
        benchmarks: Dict[str, float]
    ) -> Dict[str, float]:
        """Compare scores to industry benchmarks"""
        
        comparison = {}
        for domain, score in scores.items():
            benchmark = benchmarks.get(domain, 3.0)  # Default benchmark
            comparison[domain] = ((score - benchmark) / benchmark) * 100  # Percentage difference
        
        return comparison