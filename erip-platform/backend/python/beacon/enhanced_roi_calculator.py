"""
Enhanced BEACON ROI Calculator
Building on existing value_engine.py with advanced financial calculations
NPV, IRR, Payback Period, Monte Carlo ROI confidence intervals
"""

from typing import Dict, List, Optional, Any, Union, Tuple
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
import numpy as np
import scipy.optimize
from scipy import stats
import asyncio
import json
from enum import Enum
import uuid
from decimal import Decimal

# Import existing BEACON engine
from beacon.value_engine import (
    ValueDemonstrationEngine, 
    ROIMetric, 
    BusinessImpactReport,
    MetricCategory,
    ROITimeframe
)

class AdvancedROIParameters(BaseModel):
    """Advanced ROI calculation parameters"""
    investment_amount: float
    annual_benefits: List[float]  # Benefits per year (can vary)
    discount_rate: float = 0.08  # 8% default discount rate
    tax_rate: float = 0.25      # 25% corporate tax rate
    inflation_rate: float = 0.025  # 2.5% inflation
    risk_adjustment: float = 0.05  # 5% risk premium
    project_life_years: int = 5
    
class AdvancedROIResult(BaseModel):
    """Comprehensive ROI analysis results"""
    simple_roi: float
    net_present_value: float
    internal_rate_of_return: float
    modified_irr: float
    payback_period_years: float
    discounted_payback_period: float
    profitability_index: float
    
    # Monte Carlo results
    roi_mean: float
    roi_std: float
    roi_confidence_95: float
    roi_confidence_5: float
    probability_positive_roi: float
    
    # Sensitivity analysis
    sensitivity_to_benefits: float
    sensitivity_to_costs: float
    sensitivity_to_discount_rate: float
    
    # Risk metrics
    value_at_risk_5: float
    conditional_value_at_risk: float
    maximum_drawdown: float
    
class ScenarioAnalysis(BaseModel):
    """Scenario analysis results"""
    pessimistic: AdvancedROIResult
    base_case: AdvancedROIResult
    optimistic: AdvancedROIResult
    
    scenario_probabilities: Dict[str, float]
    expected_value: float
    risk_adjusted_value: float

class EnhancedROICalculator:
    """Advanced ROI calculator extending existing BEACON capabilities"""
    
    def __init__(self):
        self.base_engine = ValueDemonstrationEngine()
        
    def calculate_net_present_value(
        self, 
        initial_investment: float,
        cash_flows: List[float],
        discount_rate: float
    ) -> float:
        """Calculate Net Present Value"""
        
        npv = -initial_investment  # Initial investment is negative
        
        for year, cash_flow in enumerate(cash_flows, 1):
            npv += cash_flow / ((1 + discount_rate) ** year)
        
        return npv
    
    def calculate_internal_rate_of_return(
        self,
        initial_investment: float,
        cash_flows: List[float],
        max_iterations: int = 1000
    ) -> float:
        """Calculate Internal Rate of Return using Newton-Raphson method"""
        
        def npv_function(rate):
            npv = -initial_investment
            for year, cash_flow in enumerate(cash_flows, 1):
                npv += cash_flow / ((1 + rate) ** year)
            return npv
        
        try:
            # Use scipy's optimization to find IRR
            result = scipy.optimize.brentq(npv_function, -0.99, 10.0)
            return result
        except ValueError:
            # If no solution found, return NaN
            return float('nan')
    
    def calculate_modified_irr(
        self,
        initial_investment: float,
        cash_flows: List[float],
        finance_rate: float,
        reinvestment_rate: float
    ) -> float:
        """Calculate Modified Internal Rate of Return (MIRR)"""
        
        n = len(cash_flows)
        
        # Present value of negative cash flows (financed at finance_rate)
        pv_negative = initial_investment
        for year, cf in enumerate(cash_flows, 1):
            if cf < 0:
                pv_negative += abs(cf) / ((1 + finance_rate) ** year)
        
        # Future value of positive cash flows (reinvested at reinvestment_rate)
        fv_positive = 0
        for year, cf in enumerate(cash_flows, 1):
            if cf > 0:
                fv_positive += cf * ((1 + reinvestment_rate) ** (n - year))
        
        if pv_negative == 0 or fv_positive == 0:
            return float('nan')
        
        # MIRR calculation
        mirr = (fv_positive / pv_negative) ** (1/n) - 1
        return mirr
    
    def calculate_payback_period(
        self,
        initial_investment: float,
        cash_flows: List[float],
        discount_rate: Optional[float] = None
    ) -> Tuple[float, float]:
        """Calculate simple and discounted payback periods"""
        
        # Simple payback period
        cumulative_simple = 0
        simple_payback = 0
        
        for year, cash_flow in enumerate(cash_flows, 1):
            cumulative_simple += cash_flow
            if cumulative_simple >= initial_investment:
                # Linear interpolation for fractional year
                previous_cumulative = cumulative_simple - cash_flow
                fraction = (initial_investment - previous_cumulative) / cash_flow
                simple_payback = year - 1 + fraction
                break
        else:
            simple_payback = float('inf')  # Never pays back
        
        # Discounted payback period
        discounted_payback = float('inf')
        if discount_rate is not None:
            cumulative_discounted = 0
            
            for year, cash_flow in enumerate(cash_flows, 1):
                discounted_cf = cash_flow / ((1 + discount_rate) ** year)
                cumulative_discounted += discounted_cf
                
                if cumulative_discounted >= initial_investment:
                    # Linear interpolation for fractional year
                    previous_cumulative = cumulative_discounted - discounted_cf
                    fraction = (initial_investment - previous_cumulative) / discounted_cf
                    discounted_payback = year - 1 + fraction
                    break
        
        return simple_payback, discounted_payback
    
    def monte_carlo_roi_analysis(
        self,
        params: AdvancedROIParameters,
        iterations: int = 10000
    ) -> Dict[str, float]:
        """Monte Carlo simulation for ROI uncertainty analysis"""
        
        roi_simulations = []
        npv_simulations = []
        
        for _ in range(iterations):
            # Sample uncertain parameters
            investment_variation = np.random.normal(1.0, 0.1)  # ±10% investment uncertainty
            benefits_variation = np.random.normal(1.0, 0.15)   # ±15% benefits uncertainty
            discount_rate_variation = np.random.normal(params.discount_rate, 0.02)  # ±2% rate uncertainty
            
            # Simulate varied parameters
            sim_investment = params.investment_amount * investment_variation
            sim_benefits = [benefit * benefits_variation for benefit in params.annual_benefits]
            sim_discount_rate = max(0.01, discount_rate_variation)  # Minimum 1% discount rate
            
            # Calculate NPV for this simulation
            npv = self.calculate_net_present_value(sim_investment, sim_benefits, sim_discount_rate)
            npv_simulations.append(npv)
            
            # Calculate ROI for this simulation
            total_benefits = sum(sim_benefits)
            roi = ((total_benefits - sim_investment) / sim_investment) * 100
            roi_simulations.append(roi)
        
        roi_array = np.array(roi_simulations)
        npv_array = np.array(npv_simulations)
        
        return {
            "roi_mean": float(np.mean(roi_array)),
            "roi_std": float(np.std(roi_array)),
            "roi_confidence_95": float(np.percentile(roi_array, 95)),
            "roi_confidence_5": float(np.percentile(roi_array, 5)),
            "probability_positive_roi": float(np.mean(roi_array > 0)),
            "npv_mean": float(np.mean(npv_array)),
            "npv_std": float(np.std(npv_array)),
            "value_at_risk_5": float(np.percentile(roi_array, 5)),
            "conditional_value_at_risk": float(np.mean(roi_array[roi_array <= np.percentile(roi_array, 5)]))
        }
    
    def sensitivity_analysis(
        self,
        params: AdvancedROIParameters,
        sensitivity_range: float = 0.1
    ) -> Dict[str, float]:
        """Perform sensitivity analysis on key parameters"""
        
        base_npv = self.calculate_net_present_value(
            params.investment_amount,
            params.annual_benefits,
            params.discount_rate
        )
        
        sensitivities = {}
        
        # Sensitivity to benefits
        increased_benefits = [b * (1 + sensitivity_range) for b in params.annual_benefits]
        decreased_benefits = [b * (1 - sensitivity_range) for b in params.annual_benefits]
        
        npv_high_benefits = self.calculate_net_present_value(
            params.investment_amount, increased_benefits, params.discount_rate
        )
        npv_low_benefits = self.calculate_net_present_value(
            params.investment_amount, decreased_benefits, params.discount_rate
        )
        
        sensitivities["sensitivity_to_benefits"] = (
            (npv_high_benefits - npv_low_benefits) / (2 * sensitivity_range * base_npv)
        ) if base_npv != 0 else 0
        
        # Sensitivity to investment costs
        high_investment = params.investment_amount * (1 + sensitivity_range)
        low_investment = params.investment_amount * (1 - sensitivity_range)
        
        npv_high_investment = self.calculate_net_present_value(
            high_investment, params.annual_benefits, params.discount_rate
        )
        npv_low_investment = self.calculate_net_present_value(
            low_investment, params.annual_benefits, params.discount_rate
        )
        
        sensitivities["sensitivity_to_costs"] = (
            (npv_low_investment - npv_high_investment) / (2 * sensitivity_range * base_npv)
        ) if base_npv != 0 else 0
        
        # Sensitivity to discount rate
        high_discount = params.discount_rate * (1 + sensitivity_range)
        low_discount = params.discount_rate * (1 - sensitivity_range)
        
        npv_high_discount = self.calculate_net_present_value(
            params.investment_amount, params.annual_benefits, high_discount
        )
        npv_low_discount = self.calculate_net_present_value(
            params.investment_amount, params.annual_benefits, low_discount
        )
        
        sensitivities["sensitivity_to_discount_rate"] = (
            (npv_low_discount - npv_high_discount) / (2 * sensitivity_range * base_npv)
        ) if base_npv != 0 else 0
        
        return sensitivities
    
    def calculate_comprehensive_roi(
        self,
        params: AdvancedROIParameters
    ) -> AdvancedROIResult:
        """Calculate comprehensive ROI analysis"""
        
        # Basic calculations
        total_benefits = sum(params.annual_benefits)
        simple_roi = ((total_benefits - params.investment_amount) / params.investment_amount) * 100
        
        npv = self.calculate_net_present_value(
            params.investment_amount,
            params.annual_benefits,
            params.discount_rate
        )
        
        irr = self.calculate_internal_rate_of_return(
            params.investment_amount,
            params.annual_benefits
        )
        
        mirr = self.calculate_modified_irr(
            params.investment_amount,
            params.annual_benefits,
            params.discount_rate,
            params.discount_rate + 0.02  # Reinvestment rate slightly higher
        )
        
        simple_payback, discounted_payback = self.calculate_payback_period(
            params.investment_amount,
            params.annual_benefits,
            params.discount_rate
        )
        
        # Profitability Index
        pv_benefits = sum([
            benefit / ((1 + params.discount_rate) ** year)
            for year, benefit in enumerate(params.annual_benefits, 1)
        ])
        profitability_index = pv_benefits / params.investment_amount if params.investment_amount > 0 else 0
        
        # Monte Carlo analysis
        mc_results = self.monte_carlo_roi_analysis(params)
        
        # Sensitivity analysis
        sensitivity_results = self.sensitivity_analysis(params)
        
        # Maximum drawdown calculation (simplified)
        cumulative_returns = []
        cumulative = -params.investment_amount
        for benefit in params.annual_benefits:
            cumulative += benefit
            cumulative_returns.append(cumulative / params.investment_amount)
        
        peak = cumulative_returns[0]
        max_drawdown = 0
        for return_val in cumulative_returns:
            if return_val > peak:
                peak = return_val
            drawdown = (peak - return_val) / peak if peak != 0 else 0
            max_drawdown = max(max_drawdown, drawdown)
        
        return AdvancedROIResult(
            simple_roi=simple_roi,
            net_present_value=npv,
            internal_rate_of_return=irr if not np.isnan(irr) else 0,
            modified_irr=mirr if not np.isnan(mirr) else 0,
            payback_period_years=simple_payback,
            discounted_payback_period=discounted_payback,
            profitability_index=profitability_index,
            
            # Monte Carlo results
            roi_mean=mc_results["roi_mean"],
            roi_std=mc_results["roi_std"],
            roi_confidence_95=mc_results["roi_confidence_95"],
            roi_confidence_5=mc_results["roi_confidence_5"],
            probability_positive_roi=mc_results["probability_positive_roi"],
            
            # Sensitivity results
            sensitivity_to_benefits=sensitivity_results["sensitivity_to_benefits"],
            sensitivity_to_costs=sensitivity_results["sensitivity_to_costs"],
            sensitivity_to_discount_rate=sensitivity_results["sensitivity_to_discount_rate"],
            
            # Risk metrics
            value_at_risk_5=mc_results["value_at_risk_5"],
            conditional_value_at_risk=mc_results["conditional_value_at_risk"],
            maximum_drawdown=max_drawdown
        )
    
    def scenario_analysis(
        self,
        base_params: AdvancedROIParameters,
        scenario_adjustments: Dict[str, Dict[str, float]]
    ) -> ScenarioAnalysis:
        """Perform three-scenario analysis (pessimistic, base, optimistic)"""
        
        # Base case
        base_case = self.calculate_comprehensive_roi(base_params)
        
        # Pessimistic scenario
        pessimistic_params = AdvancedROIParameters(**base_params.dict())
        if "pessimistic" in scenario_adjustments:
            adj = scenario_adjustments["pessimistic"]
            pessimistic_params.investment_amount *= adj.get("investment_multiplier", 1.2)
            pessimistic_params.annual_benefits = [
                b * adj.get("benefits_multiplier", 0.8) for b in pessimistic_params.annual_benefits
            ]
            pessimistic_params.discount_rate *= adj.get("discount_rate_multiplier", 1.2)
        
        pessimistic = self.calculate_comprehensive_roi(pessimistic_params)
        
        # Optimistic scenario
        optimistic_params = AdvancedROIParameters(**base_params.dict())
        if "optimistic" in scenario_adjustments:
            adj = scenario_adjustments["optimistic"]
            optimistic_params.investment_amount *= adj.get("investment_multiplier", 0.9)
            optimistic_params.annual_benefits = [
                b * adj.get("benefits_multiplier", 1.3) for b in optimistic_params.annual_benefits
            ]
            optimistic_params.discount_rate *= adj.get("discount_rate_multiplier", 0.9)
        
        optimistic = self.calculate_comprehensive_roi(optimistic_params)
        
        # Calculate expected value with scenario probabilities
        probabilities = scenario_adjustments.get("probabilities", {
            "pessimistic": 0.2,
            "base_case": 0.6,
            "optimistic": 0.2
        })
        
        expected_npv = (
            pessimistic.net_present_value * probabilities["pessimistic"] +
            base_case.net_present_value * probabilities["base_case"] +
            optimistic.net_present_value * probabilities["optimistic"]
        )
        
        # Risk-adjusted value (penalize downside risk)
        risk_penalty = max(0, -pessimistic.net_present_value) * 0.1
        risk_adjusted_value = expected_npv - risk_penalty
        
        return ScenarioAnalysis(
            pessimistic=pessimistic,
            base_case=base_case,
            optimistic=optimistic,
            scenario_probabilities=probabilities,
            expected_value=expected_npv,
            risk_adjusted_value=risk_adjusted_value
        )
    
    async def generate_enhanced_business_impact_report(
        self,
        organization_id: str,
        roi_analysis: AdvancedROIResult,
        scenario_analysis: ScenarioAnalysis,
        metrics: List[ROIMetric]
    ) -> Dict[str, Any]:
        """Generate enhanced business impact report with advanced ROI metrics"""
        
        # Use existing report generation as base
        base_report = await self.base_engine.generate_business_impact_report(
            organization_id, metrics, "Q4 2024"
        )
        
        # Enhance with advanced financial analysis
        enhanced_report = {
            "base_report": base_report.dict(),
            "advanced_roi_analysis": roi_analysis.dict(),
            "scenario_analysis": scenario_analysis.dict(),
            "executive_summary": {
                "key_finding": f"Investment shows {roi_analysis.probability_positive_roi:.1%} probability of positive ROI",
                "npv_assessment": "Positive" if roi_analysis.net_present_value > 0 else "Negative",
                "risk_level": self._assess_risk_level(roi_analysis),
                "recommendation": self._generate_recommendation(roi_analysis, scenario_analysis)
            },
            "financial_highlights": {
                "expected_roi": f"{roi_analysis.roi_mean:.1f}%",
                "confidence_interval": f"{roi_analysis.roi_confidence_5:.1f}% to {roi_analysis.roi_confidence_95:.1f}%",
                "payback_period": f"{roi_analysis.payback_period_years:.1f} years",
                "net_present_value": f"€{roi_analysis.net_present_value:,.0f}",
                "internal_rate_of_return": f"{roi_analysis.internal_rate_of_return:.1%}"
            }
        }
        
        return enhanced_report
    
    def _assess_risk_level(self, roi_analysis: AdvancedROIResult) -> str:
        """Assess investment risk level"""
        
        if roi_analysis.probability_positive_roi > 0.8 and roi_analysis.roi_std < 20:
            return "Low Risk"
        elif roi_analysis.probability_positive_roi > 0.6 and roi_analysis.roi_std < 40:
            return "Medium Risk"
        else:
            return "High Risk"
    
    def _generate_recommendation(
        self,
        roi_analysis: AdvancedROIResult,
        scenario_analysis: ScenarioAnalysis
    ) -> str:
        """Generate investment recommendation"""
        
        if (roi_analysis.net_present_value > 0 and 
            roi_analysis.probability_positive_roi > 0.7 and
            scenario_analysis.pessimistic.net_present_value > -roi_analysis.net_present_value * 0.5):
            return "STRONGLY RECOMMEND - High probability of positive returns with manageable downside risk"
        elif roi_analysis.net_present_value > 0 and roi_analysis.probability_positive_roi > 0.6:
            return "RECOMMEND - Positive expected returns but monitor risk factors"
        elif roi_analysis.probability_positive_roi > 0.5:
            return "CONDITIONAL - Consider if risk tolerance allows for uncertainty"
        else:
            return "NOT RECOMMENDED - High probability of negative returns"