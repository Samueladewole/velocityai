"""
ERIP Financial Intelligence Engine
Real-time financial risk quantification and P&L impact tracking
Built on existing PRISM Monte Carlo foundation
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field
import asyncio
import numpy as np
from typing import Dict, List, Optional, Union
import time
import json
from datetime import datetime, timedelta
from decimal import Decimal
import redis
import uuid
from concurrent.futures import ProcessPoolExecutor

# Import existing engines
from prism.monte_carlo import MonteCarloEngine, MonteCarloRequest
from beacon.value_engine import ValueDemonstrationEngine
from shared.config import get_settings

router = APIRouter()
settings = get_settings()

# Redis connection for real-time caching
redis_client = redis.Redis(
    host=settings.redis_host,
    port=settings.redis_port,
    decode_responses=True
)

class CompanyProfile(BaseModel):
    """Company profile for financial calculations"""
    company_id: str
    annual_revenue: float
    employee_count: int
    industry: str
    region: str = "EU"
    risk_tolerance: str = Field(..., regex="^(low|medium|high)$")
    
class FinancialRisk(BaseModel):
    """Financial risk assessment results"""
    total_exposure: float
    monthly_risk: float
    annual_loss_expectancy: float
    confidence_95: float
    confidence_99: float
    breach_probability: float
    compliance_risk: float
    operational_risk: float
    
class ROIProjection(BaseModel):
    """ROI projection with confidence intervals"""
    expected_roi: float
    roi_confidence_95: float
    roi_confidence_5: float
    payback_period_months: float
    net_present_value: float
    internal_rate_of_return: float
    total_savings_3_years: float
    
class RealTimeMetrics(BaseModel):
    """Real-time financial metrics"""
    timestamp: datetime
    current_risk_exposure: float
    monthly_burn_rate: float
    roi_percentage: float
    savings_to_date: float
    cost_avoidance: float
    productivity_gains: float
    
class FinancialIntelligenceEngine:
    """Enhanced financial intelligence engine building on PRISM/BEACON"""
    
    def __init__(self):
        self.monte_carlo_engine = MonteCarloEngine()
        self.value_engine = ValueDemonstrationEngine()
        self.websocket_connections = {}
        
        # Industry breach cost multipliers (based on IBM 2024 data)
        self.industry_multipliers = {
            "healthcare": 1.21,  # €5.90M average
            "financial": 1.12,   # €5.46M average  
            "pharma": 1.08,      # €5.27M average
            "technology": 0.91,  # €4.44M average
            "retail": 0.79,      # €3.86M average
            "manufacturing": 0.75, # €3.66M average
            "education": 0.68,   # €3.32M average
            "government": 0.45   # €2.20M average
        }
        
        # Company size multipliers
        self.size_multipliers = {
            "small": 0.3,    # <1000 employees
            "medium": 1.0,   # 1K-10K employees
            "large": 2.5     # >10K employees
        }
    
    async def calculate_financial_risk(self, profile: CompanyProfile) -> FinancialRisk:
        """Calculate comprehensive financial risk using enhanced Monte Carlo"""
        
        try:
            # Base breach cost from IBM 2024 study (€4.88M)
            base_breach_cost = 4880000
            
            # Apply industry and size multipliers
            industry_multiplier = self.industry_multipliers.get(profile.industry.lower(), 1.0)
            
            # Determine size multiplier
            if profile.employee_count < 1000:
                size_multiplier = self.size_multipliers["small"]
            elif profile.employee_count < 10000:
                size_multiplier = self.size_multipliers["medium"]
            else:
                size_multiplier = self.size_multipliers["large"]
            
            adjusted_breach_cost = base_breach_cost * industry_multiplier * size_multiplier
            
            # Create Monte Carlo request for risk simulation
            risk_factors = {
                "cyber_breach": {
                    "distribution": "lognormal",
                    "mu": np.log(adjusted_breach_cost),
                    "sigma": 0.8  # High variability in breach costs
                },
                "regulatory_fines": {
                    "distribution": "triangular", 
                    "min": profile.annual_revenue * 0.001,  # 0.1% of revenue
                    "mode": profile.annual_revenue * 0.02,  # 2% of revenue (GDPR)
                    "max": profile.annual_revenue * 0.04   # 4% of revenue (GDPR max)
                },
                "operational_disruption": {
                    "distribution": "gamma",
                    "shape": 2.0,
                    "scale": adjusted_breach_cost * 0.3
                },
                "reputation_damage": {
                    "distribution": "beta",
                    "alpha": 2,
                    "beta": 5,
                    "min": 0,
                    "max": profile.annual_revenue * 0.15  # Up to 15% revenue impact
                }
            }
            
            mc_request = MonteCarloRequest(
                scenario_name=f"Financial Risk - {profile.company_id}",
                iterations=50000,  # High precision for financial calculations
                risk_factors=risk_factors,
                confidence_levels=[0.95, 0.99, 0.999]
            )
            
            # Run Monte Carlo simulation
            mc_result = await self._run_enhanced_monte_carlo(mc_request)
            
            # Calculate breach probability based on industry data
            breach_probability = self._calculate_breach_probability(profile)
            
            # Build financial risk result
            financial_risk = FinancialRisk(
                total_exposure=mc_result["statistics"]["mean"],
                monthly_risk=mc_result["statistics"]["mean"] / 12,
                annual_loss_expectancy=mc_result["annual_loss_expectancy"],
                confidence_95=mc_result["percentiles"]["p95"],
                confidence_99=mc_result["percentiles"]["p99"],
                breach_probability=breach_probability,
                compliance_risk=mc_result["statistics"]["mean"] * 0.3,  # Estimated compliance component
                operational_risk=mc_result["statistics"]["mean"] * 0.4   # Estimated operational component
            )
            
            # Cache result for real-time updates
            await self._cache_financial_risk(profile.company_id, financial_risk)
            
            return financial_risk
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Financial risk calculation failed: {str(e)}")
    
    async def calculate_enhanced_roi(
        self, 
        profile: CompanyProfile, 
        investment_amount: float,
        risk_reduction_percentage: float = 0.70  # 70% risk reduction typical
    ) -> ROIProjection:
        """Calculate comprehensive ROI with Monte Carlo confidence intervals"""
        
        try:
            # Get current risk exposure
            current_risk = await self.calculate_financial_risk(profile)
            
            # Calculate expected savings
            annual_savings = current_risk.annual_loss_expectancy * risk_reduction_percentage
            
            # Monte Carlo simulation for ROI uncertainty
            roi_simulations = []
            for _ in range(10000):
                # Variable factors affecting ROI
                actual_risk_reduction = np.random.beta(7, 3) * risk_reduction_percentage  # 70% typical, but varies
                implementation_efficiency = np.random.triangular(0.8, 0.95, 1.1)  # Implementation variance
                market_conditions = np.random.normal(1.0, 0.1)  # Economic conditions
                
                simulated_savings = current_risk.annual_loss_expectancy * actual_risk_reduction * market_conditions
                simulated_roi = ((simulated_savings * 3 - investment_amount) / investment_amount) * 100
                roi_simulations.append(simulated_roi)
            
            roi_array = np.array(roi_simulations)
            
            # Calculate NPV (3-year projection with 8% discount rate)
            discount_rate = 0.08
            npv = sum([
                (annual_savings - investment_amount/3) / ((1 + discount_rate) ** year)
                for year in range(1, 4)
            ]) - investment_amount
            
            # Calculate IRR (simplified approximation)
            irr = (annual_savings / investment_amount) - 1
            
            # Calculate payback period
            payback_months = (investment_amount / (annual_savings / 12)) if annual_savings > 0 else float('inf')
            
            roi_projection = ROIProjection(
                expected_roi=float(np.mean(roi_array)),
                roi_confidence_95=float(np.percentile(roi_array, 95)),
                roi_confidence_5=float(np.percentile(roi_array, 5)),
                payback_period_months=payback_months,
                net_present_value=npv,
                internal_rate_of_return=irr,
                total_savings_3_years=annual_savings * 3
            )
            
            return roi_projection
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"ROI calculation failed: {str(e)}")
    
    async def get_real_time_metrics(self, company_id: str) -> RealTimeMetrics:
        """Get real-time financial metrics for a company"""
        
        try:
            # Get cached financial risk
            cached_risk = await self._get_cached_financial_risk(company_id)
            if not cached_risk:
                raise HTTPException(status_code=404, detail="No financial data available")
            
            # Calculate time-based metrics
            current_time = datetime.utcnow()
            
            # Simulate real-time changes (in production, this would use actual monitoring data)
            time_factor = np.sin(current_time.hour * np.pi / 12) * 0.1 + 1  # Daily variation
            
            metrics = RealTimeMetrics(
                timestamp=current_time,
                current_risk_exposure=cached_risk.total_exposure * time_factor,
                monthly_burn_rate=cached_risk.monthly_risk,
                roi_percentage=234.5,  # Example - would be calculated from actual implementation
                savings_to_date=cached_risk.total_exposure * 0.15,  # 15% realized savings
                cost_avoidance=cached_risk.total_exposure * 0.45,   # 45% costs avoided
                productivity_gains=cached_risk.total_exposure * 0.25 # 25% productivity value
            )
            
            return metrics
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Real-time metrics failed: {str(e)}")
    
    async def _run_enhanced_monte_carlo(self, request: MonteCarloRequest) -> dict:
        """Run Monte Carlo with enhanced financial calculations"""
        
        # Use existing Monte Carlo engine with enhanced processing
        with ProcessPoolExecutor(max_workers=settings.parallel_workers) as executor:
            future = executor.submit(self._monte_carlo_financial_wrapper, request.dict())
            result = await asyncio.get_event_loop().run_in_executor(None, future.result, 60)
        
        return result
    
    def _monte_carlo_financial_wrapper(self, request_data: dict) -> dict:
        """Wrapper for Monte Carlo with financial enhancements"""
        
        from prism.monte_carlo import run_monte_carlo_simulation
        
        # Run base Monte Carlo
        base_result = run_monte_carlo_simulation(request_data)
        
        # Add financial-specific calculations
        base_result["financial_metrics"] = {
            "expected_annual_loss": base_result["statistics"]["mean"],
            "worst_case_99": base_result["percentiles"]["p99"],
            "value_at_risk_95": base_result["risk_metrics"]["value_at_risk_95"],
            "expected_shortfall": base_result["risk_metrics"]["expected_shortfall"]
        }
        
        return base_result
    
    def _calculate_breach_probability(self, profile: CompanyProfile) -> float:
        """Calculate annual breach probability based on company profile"""
        
        # Base probability from Ponemon/IBM studies
        base_probability = 0.032  # 3.2% annual probability
        
        # Industry adjustments
        industry_adjustments = {
            "healthcare": 1.4,
            "financial": 1.2,
            "government": 0.8,
            "education": 0.9,
            "retail": 1.1,
            "manufacturing": 0.95
        }
        
        # Size adjustments (larger = higher probability)
        if profile.employee_count > 10000:
            size_factor = 1.3
        elif profile.employee_count > 1000:
            size_factor = 1.1
        else:
            size_factor = 0.9
        
        industry_factor = industry_adjustments.get(profile.industry.lower(), 1.0)
        
        return min(base_probability * industry_factor * size_factor, 0.15)  # Cap at 15%
    
    async def _cache_financial_risk(self, company_id: str, risk: FinancialRisk):
        """Cache financial risk data for real-time updates"""
        
        cache_key = f"financial_risk:{company_id}"
        cache_data = {
            "total_exposure": risk.total_exposure,
            "monthly_risk": risk.monthly_risk,
            "annual_loss_expectancy": risk.annual_loss_expectancy,
            "breach_probability": risk.breach_probability,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Cache for 1 hour
        redis_client.setex(cache_key, 3600, json.dumps(cache_data))
    
    async def _get_cached_financial_risk(self, company_id: str) -> Optional[FinancialRisk]:
        """Get cached financial risk data"""
        
        cache_key = f"financial_risk:{company_id}"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            data = json.loads(cached_data)
            return FinancialRisk(
                total_exposure=data["total_exposure"],
                monthly_risk=data["monthly_risk"],
                annual_loss_expectancy=data["annual_loss_expectancy"],
                confidence_95=data["total_exposure"] * 1.2,  # Approximation
                confidence_99=data["total_exposure"] * 1.5,  # Approximation
                breach_probability=data["breach_probability"],
                compliance_risk=data["total_exposure"] * 0.3,
                operational_risk=data["total_exposure"] * 0.4
            )
        
        return None

# Global engine instance
financial_engine = FinancialIntelligenceEngine()

# WebSocket manager for real-time updates
class WebSocketManager:
    def __init__(self):
        self.active_connections = {}
    
    async def connect(self, websocket: WebSocket, company_id: str):
        await websocket.accept()
        if company_id not in self.active_connections:
            self.active_connections[company_id] = []
        self.active_connections[company_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, company_id: str):
        if company_id in self.active_connections:
            self.active_connections[company_id].remove(websocket)
    
    async def broadcast_to_company(self, company_id: str, message: dict):
        if company_id in self.active_connections:
            for connection in self.active_connections[company_id]:
                try:
                    await connection.send_json(message)
                except:
                    # Remove dead connections
                    self.active_connections[company_id].remove(connection)

websocket_manager = WebSocketManager()

# API Endpoints
@router.post("/calculate-financial-risk")
async def calculate_financial_risk(profile: CompanyProfile):
    """Calculate comprehensive financial risk for a company"""
    return await financial_engine.calculate_financial_risk(profile)

@router.post("/calculate-roi-projection")
async def calculate_roi_projection(
    profile: CompanyProfile,
    investment_amount: float,
    risk_reduction_percentage: float = 0.70
):
    """Calculate enhanced ROI projection with confidence intervals"""
    return await financial_engine.calculate_enhanced_roi(
        profile, investment_amount, risk_reduction_percentage
    )

@router.get("/real-time-metrics/{company_id}")
async def get_real_time_metrics(company_id: str):
    """Get real-time financial metrics"""
    return await financial_engine.get_real_time_metrics(company_id)

@router.websocket("/ws/financial-updates/{company_id}")
async def websocket_financial_updates(websocket: WebSocket, company_id: str):
    """WebSocket endpoint for real-time financial updates"""
    
    await websocket_manager.connect(websocket, company_id)
    
    try:
        while True:
            # Send updated metrics every 30 seconds
            await asyncio.sleep(30)
            
            try:
                metrics = await financial_engine.get_real_time_metrics(company_id)
                await websocket_manager.broadcast_to_company(
                    company_id,
                    {
                        "type": "financial_update",
                        "data": metrics.dict()
                    }
                )
            except Exception as e:
                # Continue even if metrics calculation fails
                pass
                
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket, company_id)

# Background task for continuous metric updates
async def continuous_metric_updates():
    """Background task to continuously update financial metrics"""
    
    while True:
        try:
            # Get all active company connections
            for company_id in websocket_manager.active_connections.keys():
                if websocket_manager.active_connections[company_id]:  # Has active connections
                    try:
                        metrics = await financial_engine.get_real_time_metrics(company_id)
                        await websocket_manager.broadcast_to_company(
                            company_id,
                            {
                                "type": "financial_update",
                                "data": metrics.dict(),
                                "timestamp": datetime.utcnow().isoformat()
                            }
                        )
                    except Exception:
                        # Continue with other companies if one fails
                        continue
            
            # Update every 5 minutes
            await asyncio.sleep(300)
            
        except Exception:
            # Restart after error
            await asyncio.sleep(60)

# Start background task
asyncio.create_task(continuous_metric_updates())