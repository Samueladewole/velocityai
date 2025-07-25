"""
Real-Time Financial Intelligence Integration
Connects TimescaleDB with existing ERIP financial engines for live dashboard streaming
"""

from typing import Dict, List, Optional, Any, AsyncGenerator
import asyncio
from datetime import datetime, timedelta
from decimal import Decimal
import json
import structlog
from fastapi import WebSocket, WebSocketDisconnect
from pydantic import BaseModel

from .timescale_db import (
    TimescaleFinancialDB, 
    TimescaleDBConfig,
    FinancialMetric,
    MetricType,
    FinancialMetricsStreamer,
    MonteCarloResult,
    ROICalculation,
    ComplianceCostMetric
)
from .financial_engine import FinancialIntelligenceEngine
from ..beacon.enhanced_roi_calculator import EnhancedROICalculator
from ..prism.monte_carlo import MonteCarloRiskEngine

logger = structlog.get_logger()

class RealTimeFinancialOrchestrator:
    """
    Orchestrates real-time financial intelligence across all ERIP engines
    Integrates TimescaleDB with existing financial calculation engines
    """
    
    def __init__(
        self,
        timescale_config: TimescaleDBConfig,
        financial_engine: FinancialIntelligenceEngine,
        roi_calculator: EnhancedROICalculator,
        monte_carlo_engine: MonteCarloRiskEngine
    ):
        self.timescale_db: Optional[TimescaleFinancialDB] = None
        self.timescale_config = timescale_config
        self.financial_engine = financial_engine
        self.roi_calculator = roi_calculator
        self.monte_carlo_engine = monte_carlo_engine
        self.metrics_streamer: Optional[FinancialMetricsStreamer] = None
        self.active_calculations: Dict[str, asyncio.Task] = {}
        
    async def initialize(self) -> bool:
        """Initialize all components"""
        try:
            # Initialize TimescaleDB
            self.timescale_db = TimescaleFinancialDB(self.timescale_config)
            if not await self.timescale_db.initialize():
                raise Exception("Failed to initialize TimescaleDB")
            
            # Initialize metrics streamer
            self.metrics_streamer = FinancialMetricsStreamer(self.timescale_db)
            
            # Start background tasks
            asyncio.create_task(self._continuous_metric_calculation())
            asyncio.create_task(self._periodic_aggregation())
            
            logger.info("Real-time financial orchestrator initialized")
            return True
            
        except Exception as e:
            logger.error("Failed to initialize orchestrator", error=str(e))
            return False
    
    async def start_customer_stream(self, customer_id: str, websocket: WebSocket) -> None:
        """Start real-time financial stream for customer"""
        try:
            await websocket.accept()
            await self.metrics_streamer.start_real_time_stream(customer_id, websocket)
            
            # Start customer-specific calculations
            if customer_id not in self.active_calculations:
                task = asyncio.create_task(
                    self._customer_calculation_loop(customer_id)
                )
                self.active_calculations[customer_id] = task
            
            # Keep connection alive and handle messages
            try:
                while True:
                    data = await websocket.receive_text()
                    message = json.loads(data)
                    await self._handle_websocket_message(customer_id, message, websocket)
                    
            except WebSocketDisconnect:
                logger.info("WebSocket disconnected", customer_id=customer_id)
            finally:
                await self.metrics_streamer.stop_stream(customer_id, websocket)
                
        except Exception as e:
            logger.error("Error in customer stream", 
                        customer_id=customer_id,
                        error=str(e))
    
    async def calculate_and_store_roi(
        self,
        customer_id: str,
        investment_amount: Decimal,
        compliance_costs: List[Decimal],
        risk_reduction_factors: Dict[str, float],
        calculation_id: Optional[str] = None
    ) -> ROICalculation:
        """Calculate ROI and store in TimescaleDB"""
        try:
            # Use enhanced ROI calculator
            result = await self.roi_calculator.calculate_comprehensive_roi(
                initial_investment=float(investment_amount),
                annual_compliance_costs=compliance_costs,
                risk_reduction_factors=risk_reduction_factors
            )
            
            # Create ROI calculation record
            roi_calc = ROICalculation(
                calculation_id=calculation_id or f"roi_{customer_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
                customer_id=customer_id,
                investment_amount=investment_amount,
                savings_amount=Decimal(str(result['annual_savings'])),
                roi_percentage=Decimal(str(result['roi_percentage'])),
                npv=Decimal(str(result['npv'])),
                irr=Decimal(str(result['irr'])),
                payback_months=result['payback_period_months'],
                calculation_date=datetime.utcnow()
            )
            
            # Store in TimescaleDB
            await self.timescale_db.store_roi_calculation(roi_calc)
            
            # Store individual metrics for real-time streaming
            await self._store_roi_metrics(customer_id, result)
            
            logger.info("ROI calculated and stored", 
                       customer_id=customer_id,
                       roi_percentage=result['roi_percentage'])
            
            return roi_calc
            
        except Exception as e:
            logger.error("Failed to calculate and store ROI", 
                        customer_id=customer_id,
                        error=str(e))
            raise
    
    async def run_monte_carlo_analysis(
        self,
        customer_id: str,
        scenarios: List[Dict[str, Any]],
        iterations: int = 10000,
        simulation_id: Optional[str] = None
    ) -> str:
        """Run Monte Carlo analysis and store results"""
        try:
            sim_id = simulation_id or f"mc_{customer_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
            
            # Run Monte Carlo for each scenario
            for scenario in scenarios:
                scenario_name = scenario['name']
                parameters = scenario['parameters']
                
                # Use existing Monte Carlo engine
                results = await self.monte_carlo_engine.run_comprehensive_simulation(
                    **parameters,
                    iterations=iterations
                )
                
                # Store each iteration result
                for i, iteration_result in enumerate(results['iterations'][:1000]):  # Store first 1000
                    mc_result = MonteCarloResult(
                        simulation_id=sim_id,
                        customer_id=customer_id,
                        iteration_number=i,
                        scenario_name=scenario_name,
                        risk_value=Decimal(str(iteration_result['risk_value'])),
                        probability=iteration_result['probability'],
                        timestamp=datetime.utcnow(),
                        input_parameters=parameters,
                        output_metrics=iteration_result['metrics']
                    )
                    
                    await self.timescale_db.store_monte_carlo_result(mc_result)
                
                # Store aggregated risk metrics
                await self._store_risk_metrics(customer_id, scenario_name, results)
            
            logger.info("Monte Carlo analysis completed", 
                       customer_id=customer_id,
                       simulation_id=sim_id,
                       scenarios=len(scenarios))
            
            return sim_id
            
        except Exception as e:
            logger.error("Failed to run Monte Carlo analysis", 
                        customer_id=customer_id,
                        error=str(e))
            raise
    
    async def track_compliance_costs(
        self,
        customer_id: str,
        framework: str,
        cost_data: Dict[str, Any]
    ) -> None:
        """Track compliance costs by framework"""
        try:
            cost_metric = ComplianceCostMetric(
                cost_id=f"cost_{customer_id}_{framework}_{datetime.utcnow().strftime('%Y%m%d')}",
                customer_id=customer_id,
                framework=framework,
                cost_category=cost_data['category'],
                amount=Decimal(str(cost_data['amount'])),
                currency=cost_data.get('currency', 'EUR'),
                period_start=cost_data['period_start'],
                period_end=cost_data['period_end'],
                is_recurring=cost_data.get('is_recurring', False),
                cost_center=cost_data.get('cost_center')
            )
            
            await self.timescale_db.store_compliance_cost(cost_metric)
            
            # Store as metric for streaming
            metric = FinancialMetric(
                metric_id=cost_metric.cost_id,
                customer_id=customer_id,
                metric_type=MetricType.COMPLIANCE_COST,
                value=cost_metric.amount,
                currency=cost_metric.currency,
                timestamp=datetime.utcnow(),
                metadata={
                    'framework': framework,
                    'category': cost_data['category'],
                    'is_recurring': cost_metric.is_recurring
                },
                tags={'framework': framework}
            )
            
            await self.timescale_db.store_financial_metric(metric)
            await self.metrics_streamer.broadcast_metric_update(metric)
            
        except Exception as e:
            logger.error("Failed to track compliance costs", 
                        customer_id=customer_id,
                        framework=framework,
                        error=str(e))
    
    async def calculate_trust_score_impact(
        self,
        customer_id: str,
        current_metrics: Dict[str, Any]
    ) -> Decimal:
        """Calculate trust score based on financial metrics"""
        try:
            # Get recent financial performance
            recent_metrics = await self.timescale_db.get_financial_metrics(
                customer_id=customer_id,
                start_time=datetime.utcnow() - timedelta(days=30)
            )
            
            # Calculate trust score components
            roi_scores = [m.value for m in recent_metrics if m.metric_type == MetricType.ROI]
            risk_scores = [m.value for m in recent_metrics if m.metric_type == MetricType.RISK_SCORE]
            savings_scores = [m.value for m in recent_metrics if m.metric_type == MetricType.SAVINGS_REALIZED]
            
            # Weighted trust score calculation
            trust_score = Decimal('0')
            
            if roi_scores:
                avg_roi = sum(roi_scores) / len(roi_scores)
                trust_score += avg_roi * Decimal('0.4')  # 40% weight
            
            if risk_scores:
                avg_risk = sum(risk_scores) / len(risk_scores)
                risk_component = max(Decimal('0'), Decimal('100') - avg_risk)
                trust_score += risk_component * Decimal('0.3')  # 30% weight
            
            if savings_scores:
                total_savings = sum(savings_scores)
                savings_component = min(Decimal('100'), total_savings / Decimal('10000'))  # Normalize
                trust_score += savings_component * Decimal('0.3')  # 30% weight
            
            # Cap at 100
            trust_score = min(trust_score, Decimal('100'))
            
            # Store trust score metric
            metric = FinancialMetric(
                metric_id=f"trust_{customer_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M')}",
                customer_id=customer_id,
                metric_type=MetricType.TRUST_SCORE,
                value=trust_score,
                timestamp=datetime.utcnow(),
                metadata=current_metrics,
                confidence_level=0.95
            )
            
            await self.timescale_db.store_financial_metric(metric)
            await self.metrics_streamer.broadcast_metric_update(metric)
            
            return trust_score
            
        except Exception as e:
            logger.error("Failed to calculate trust score", 
                        customer_id=customer_id,
                        error=str(e))
            return Decimal('0')
    
    async def get_real_time_dashboard(self, customer_id: str) -> Dict[str, Any]:
        """Get complete real-time dashboard data"""
        try:
            # Get current dashboard metrics
            dashboard = await self.timescale_db.calculate_real_time_dashboard_metrics(customer_id)
            
            # Get recent aggregated data
            hourly_data = await self.timescale_db.get_aggregated_metrics(
                customer_id=customer_id,
                interval="1 hour",
                start_time=datetime.utcnow() - timedelta(hours=24)
            )
            
            daily_data = await self.timescale_db.get_aggregated_metrics(
                customer_id=customer_id,
                interval="1 day",
                start_time=datetime.utcnow() - timedelta(days=30)
            )
            
            # Enhanced dashboard with trends
            enhanced_dashboard = {
                **dashboard,
                'trends': {
                    'hourly': hourly_data,
                    'daily': daily_data
                },
                'status': 'active',
                'last_calculation': datetime.utcnow().isoformat()
            }
            
            return enhanced_dashboard
            
        except Exception as e:
            logger.error("Failed to get real-time dashboard", 
                        customer_id=customer_id,
                        error=str(e))
            return {}
    
    async def _store_roi_metrics(self, customer_id: str, roi_result: Dict[str, Any]) -> None:
        """Store individual ROI metrics for streaming"""
        metrics = [
            FinancialMetric(
                metric_id=f"roi_{customer_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
                customer_id=customer_id,
                metric_type=MetricType.ROI,
                value=Decimal(str(roi_result['roi_percentage'])),
                timestamp=datetime.utcnow(),
                source_system="enhanced_beacon"
            ),
            FinancialMetric(
                metric_id=f"npv_{customer_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
                customer_id=customer_id,
                metric_type=MetricType.NPV,
                value=Decimal(str(roi_result['npv'])),
                timestamp=datetime.utcnow(),
                source_system="enhanced_beacon"
            ),
            FinancialMetric(
                metric_id=f"payback_{customer_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
                customer_id=customer_id,
                metric_type=MetricType.PAYBACK_PERIOD,
                value=Decimal(str(roi_result['payback_period_months'])),
                timestamp=datetime.utcnow(),
                source_system="enhanced_beacon"
            )
        ]
        
        for metric in metrics:
            await self.timescale_db.store_financial_metric(metric)
            await self.metrics_streamer.broadcast_metric_update(metric)
    
    async def _store_risk_metrics(self, customer_id: str, scenario_name: str, results: Dict[str, Any]) -> None:
        """Store risk metrics from Monte Carlo results"""
        risk_metric = FinancialMetric(
            metric_id=f"risk_{customer_id}_{scenario_name}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            customer_id=customer_id,
            metric_type=MetricType.RISK_SCORE,
            value=Decimal(str(results['statistics']['mean'])),
            timestamp=datetime.utcnow(),
            metadata={
                'scenario': scenario_name,
                'confidence_95': results['statistics']['confidence_95'],
                'confidence_99': results['statistics']['confidence_99']
            },
            source_system="prism_monte_carlo"
        )
        
        await self.timescale_db.store_financial_metric(risk_metric)
        await self.metrics_streamer.broadcast_metric_update(risk_metric)
    
    async def _customer_calculation_loop(self, customer_id: str) -> None:
        """Continuous calculation loop for customer"""
        try:
            while True:
                # Run periodic calculations every 5 minutes
                await asyncio.sleep(300)
                
                # Calculate current trust score
                await self.calculate_trust_score_impact(customer_id, {})
                
                # Update dashboard cache
                await self.get_real_time_dashboard(customer_id)
                
        except asyncio.CancelledError:
            logger.info("Customer calculation loop cancelled", customer_id=customer_id)
        except Exception as e:
            logger.error("Error in customer calculation loop", 
                        customer_id=customer_id,
                        error=str(e))
    
    async def _continuous_metric_calculation(self) -> None:
        """Background task for continuous metric calculations"""
        while True:
            try:
                await asyncio.sleep(60)  # Run every minute
                
                # Perform system-wide calculations
                # This could include market data updates, benchmark calculations, etc.
                
            except Exception as e:
                logger.error("Error in continuous metric calculation", error=str(e))
    
    async def _periodic_aggregation(self) -> None:
        """Background task for periodic data aggregation"""
        while True:
            try:
                await asyncio.sleep(3600)  # Run every hour
                
                # Perform data aggregations for performance optimization
                # This could include pre-calculating common queries
                
            except Exception as e:
                logger.error("Error in periodic aggregation", error=str(e))
    
    async def _handle_websocket_message(
        self,
        customer_id: str,
        message: Dict[str, Any],
        websocket: WebSocket
    ) -> None:
        """Handle incoming WebSocket messages"""
        try:
            message_type = message.get('type')
            
            if message_type == 'request_roi_calculation':
                # Trigger ROI calculation
                data = message['data']
                roi_calc = await self.calculate_and_store_roi(
                    customer_id=customer_id,
                    investment_amount=Decimal(str(data['investment'])),
                    compliance_costs=data['compliance_costs'],
                    risk_reduction_factors=data['risk_factors']
                )
                
                await websocket.send_json({
                    'type': 'roi_calculation_complete',
                    'data': {
                        'calculation_id': roi_calc.calculation_id,
                        'roi_percentage': float(roi_calc.roi_percentage),
                        'npv': float(roi_calc.npv),
                        'payback_months': roi_calc.payback_months
                    }
                })
            
            elif message_type == 'request_monte_carlo':
                # Trigger Monte Carlo analysis
                data = message['data']
                simulation_id = await self.run_monte_carlo_analysis(
                    customer_id=customer_id,
                    scenarios=data['scenarios'],
                    iterations=data.get('iterations', 10000)
                )
                
                await websocket.send_json({
                    'type': 'monte_carlo_complete',
                    'data': {'simulation_id': simulation_id}
                })
            
            elif message_type == 'request_dashboard_update':
                # Send updated dashboard data
                dashboard = await self.get_real_time_dashboard(customer_id)
                await websocket.send_json({
                    'type': 'dashboard_update',
                    'data': dashboard
                })
                
        except Exception as e:
            logger.error("Error handling WebSocket message", 
                        customer_id=customer_id,
                        message_type=message.get('type'),
                        error=str(e))
            
            await websocket.send_json({
                'type': 'error',
                'message': f"Failed to process {message.get('type')}: {str(e)}"
            })
    
    async def close(self) -> None:
        """Cleanup resources"""
        # Cancel all active calculation tasks
        for task in self.active_calculations.values():
            task.cancel()
        
        # Close TimescaleDB connection
        if self.timescale_db:
            await self.timescale_db.close()
        
        logger.info("Real-time financial orchestrator closed")

# Factory function for easy setup
async def create_real_time_orchestrator(
    timescale_config: TimescaleDBConfig,
    financial_engine: FinancialIntelligenceEngine,
    roi_calculator: EnhancedROICalculator,
    monte_carlo_engine: MonteCarloRiskEngine
) -> RealTimeFinancialOrchestrator:
    """Create and initialize real-time financial orchestrator"""
    orchestrator = RealTimeFinancialOrchestrator(
        timescale_config=timescale_config,
        financial_engine=financial_engine,
        roi_calculator=roi_calculator,
        monte_carlo_engine=monte_carlo_engine
    )
    
    await orchestrator.initialize()
    return orchestrator