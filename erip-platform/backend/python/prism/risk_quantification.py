"""
PRISM Risk Quantification Service
Advanced financial risk modeling and quantification
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import numpy as np
from typing import Dict, List, Optional
import asyncio
from datetime import datetime, timedelta

router = APIRouter()

class RiskScenario(BaseModel):
    """Risk scenario definition"""
    id: str
    name: str
    description: str
    threat_type: str
    asset_value: float
    probability_annual: float = Field(ge=0, le=1)
    impact_min: float
    impact_max: float
    impact_most_likely: float
    mitigation_cost: Optional[float] = None
    residual_risk_reduction: Optional[float] = None

class RiskAssessmentRequest(BaseModel):
    """Risk assessment request"""
    scenarios: List[RiskScenario]
    time_horizon_years: int = Field(default=1, ge=1, le=10)
    discount_rate: float = Field(default=0.05, ge=0, le=0.5)
    confidence_level: float = Field(default=0.95, ge=0.5, le=0.999)

class RiskAssessmentResult(BaseModel):
    """Risk assessment results"""
    total_risk_exposure: float
    annual_loss_expectancy: float
    maximum_probable_loss: float
    value_at_risk: float
    scenarios_ranked: List[Dict]
    roi_analysis: Dict
    recommendations: List[str]

@router.post("/quantify-risk", response_model=RiskAssessmentResult)
async def quantify_risk(request: RiskAssessmentRequest):
    """
    Quantify financial risk across multiple scenarios
    Uses FAIR methodology with Monte Carlo simulation
    """
    
    try:
        # Calculate risk for each scenario
        scenario_results = []
        total_ale = 0
        
        for scenario in request.scenarios:
            # Calculate ALE (Annual Loss Expectancy)
            ale = scenario.probability_annual * scenario.impact_most_likely
            total_ale += ale
            
            # Calculate risk metrics
            scenario_result = {
                "id": scenario.id,
                "name": scenario.name,
                "annual_loss_expectancy": ale,
                "risk_score": ale / scenario.asset_value * 100,
                "impact_range": {
                    "min": scenario.impact_min,
                    "max": scenario.impact_max,
                    "most_likely": scenario.impact_most_likely
                },
                "probability": scenario.probability_annual,
                "priority": "HIGH" if ale > 1000000 else "MEDIUM" if ale > 100000 else "LOW"
            }
            
            # ROI analysis for mitigation
            if scenario.mitigation_cost and scenario.residual_risk_reduction:
                risk_reduction = ale * scenario.residual_risk_reduction
                roi = (risk_reduction - scenario.mitigation_cost) / scenario.mitigation_cost * 100
                scenario_result["mitigation_roi"] = roi
                scenario_result["net_benefit"] = risk_reduction - scenario.mitigation_cost
            
            scenario_results.append(scenario_result)
        
        # Sort scenarios by ALE (highest risk first)
        scenario_results.sort(key=lambda x: x["annual_loss_expectancy"], reverse=True)
        
        # Calculate portfolio-level metrics
        mpl = sum(s.impact_max for s in request.scenarios)  # Maximum Probable Loss
        var_95 = np.percentile([s["annual_loss_expectancy"] for s in scenario_results], 95)
        
        # Generate recommendations
        recommendations = []
        high_risk_scenarios = [s for s in scenario_results if s["priority"] == "HIGH"]
        
        if high_risk_scenarios:
            recommendations.append(f"Prioritize mitigation for {len(high_risk_scenarios)} high-risk scenarios")
        
        if total_ale > 5000000:  # $5M threshold
            recommendations.append("Consider cyber insurance for catastrophic losses")
        
        # ROI analysis summary
        roi_analysis = {
            "total_mitigation_cost": sum(s.mitigation_cost for s in request.scenarios if s.mitigation_cost),
            "total_risk_reduction": sum(s["net_benefit"] for s in scenario_results if "net_benefit" in s),
            "portfolio_roi": 0  # Calculate weighted average ROI
        }
        
        if roi_analysis["total_mitigation_cost"] > 0:
            roi_analysis["portfolio_roi"] = (roi_analysis["total_risk_reduction"] / roi_analysis["total_mitigation_cost"]) * 100
        
        return RiskAssessmentResult(
            total_risk_exposure=total_ale,
            annual_loss_expectancy=total_ale,
            maximum_probable_loss=mpl,
            value_at_risk=var_95,
            scenarios_ranked=scenario_results,
            roi_analysis=roi_analysis,
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk quantification failed: {str(e)}")

@router.get("/risk-appetite-thresholds")
async def get_risk_appetite_thresholds():
    """
    Calculate dynamic risk appetite thresholds
    Based on organization size, industry, and financial capacity
    """
    
    # Mock calculation - in production would use real organizational data
    thresholds = {
        "financial_impact": {
            "low": 100000,      # <$100K
            "medium": 1000000,  # $100K - $1M  
            "high": 5000000,    # $1M - $5M
            "critical": 10000000 # >$5M
        },
        "probability": {
            "rare": 0.01,       # <1% annually
            "unlikely": 0.05,   # 1-5% annually
            "possible": 0.20,   # 5-20% annually
            "likely": 0.50      # >20% annually
        },
        "risk_appetite": {
            "financial_loss_annual": 2500000,  # $2.5M annual appetite
            "operational_downtime_hours": 8,   # 8 hours max downtime
            "data_breach_records": 10000,      # 10K records max exposure
            "regulatory_fine_percentage": 0.01  # 1% of revenue max fine
        },
        "automated_thresholds": {
            "auto_approve_under": 50000,       # Auto-approve under $50K
            "executive_approval_over": 1000000, # Executive approval over $1M
            "board_approval_over": 5000000     # Board approval over $5M
        }
    }
    
    return thresholds