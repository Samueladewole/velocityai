"""
TimescaleDB Implementation for Real-Time Financial Metrics Storage
Optimized time-series database for ERIP financial intelligence platform
"""

from typing import Dict, List, Optional, Any, Union, Tuple
from datetime import datetime, timedelta
from decimal import Decimal
import asyncio
import json
import structlog
from pydantic import BaseModel, Field
from enum import Enum
import asyncpg
from contextlib import asynccontextmanager
import numpy as np
import pandas as pd

logger = structlog.get_logger()

class MetricType(str, Enum):
    """Financial metric types"""
    ROI = "roi"
    NPV = "npv"
    IRR = "irr"
    PAYBACK_PERIOD = "payback_period"
    RISK_SCORE = "risk_score"
    COMPLIANCE_COST = "compliance_cost"
    BREACH_PROBABILITY = "breach_probability"
    SAVINGS_REALIZED = "savings_realized"
    MONTE_CARLO_ITERATION = "monte_carlo_iteration"
    TRUST_SCORE = "trust_score"

class AggregationInterval(str, Enum):
    """Time aggregation intervals"""
    MINUTE = "1 minute"
    HOUR = "1 hour"
    DAY = "1 day"
    WEEK = "1 week"
    MONTH = "1 month"
    QUARTER = "3 months"
    YEAR = "1 year"

class FinancialMetric(BaseModel):
    """Financial metric data model"""
    metric_id: str
    customer_id: str
    metric_type: MetricType
    value: Decimal
    currency: str = "EUR"
    timestamp: datetime
    metadata: Dict[str, Any] = Field(default_factory=dict)
    tags: Dict[str, str] = Field(default_factory=dict)
    source_system: Optional[str] = None
    confidence_level: Optional[float] = None
    
class MonteCarloResult(BaseModel):
    """Monte Carlo simulation result"""
    simulation_id: str
    customer_id: str
    iteration_number: int
    scenario_name: str
    risk_value: Decimal
    probability: float
    timestamp: datetime
    input_parameters: Dict[str, Any]
    output_metrics: Dict[str, Decimal]

class ComplianceCostMetric(BaseModel):
    """Compliance cost tracking"""
    cost_id: str
    customer_id: str
    framework: str  # GDPR, NIS2, DORA, etc.
    cost_category: str  # personnel, tools, audits, etc.
    amount: Decimal
    currency: str = "EUR"
    period_start: datetime
    period_end: datetime
    is_recurring: bool = False
    cost_center: Optional[str] = None
    
class ROICalculation(BaseModel):
    """ROI calculation result"""
    calculation_id: str
    customer_id: str
    investment_amount: Decimal
    savings_amount: Decimal
    roi_percentage: Decimal
    npv: Decimal
    irr: Decimal
    payback_months: int
    calculation_date: datetime
    projection_months: int = 36
    discount_rate: float = 0.08
    
class TimescaleDBConfig(BaseModel):
    """TimescaleDB configuration"""
    host: str = "localhost"
    port: int = 5432
    database: str = "erip_financial_metrics"
    username: str = "erip_user"
    password: str = "secure_password"
    pool_size: int = 20
    max_pool_size: int = 50
    ssl_mode: str = "prefer"
    compression: bool = True
    
class TimescaleFinancialDB:
    """
    TimescaleDB implementation for financial metrics storage
    Optimized for time-series financial data with automatic compression and retention
    """
    
    def __init__(self, config: TimescaleDBConfig):
        self.config = config
        self.pool: Optional[asyncpg.Pool] = None
        self._initialized = False
        
    async def initialize(self) -> bool:
        """Initialize database connection pool and schema"""
        try:
            # Create connection pool
            self.pool = await asyncpg.create_pool(
                host=self.config.host,
                port=self.config.port,
                database=self.config.database,
                user=self.config.username,
                password=self.config.password,
                min_size=self.config.pool_size,
                max_size=self.config.max_pool_size,
                ssl=self.config.ssl_mode
            )
            
            # Initialize schema
            await self._create_schema()
            await self._create_hypertables()
            await self._create_compression_policies()
            await self._create_retention_policies()
            await self._create_indexes()
            
            self._initialized = True
            logger.info("TimescaleDB initialized successfully")
            return True
            
        except Exception as e:
            logger.error("Failed to initialize TimescaleDB", error=str(e))
            return False
    
    async def _create_schema(self) -> None:
        """Create database schema for financial metrics"""
        schema_sql = """
        -- Enable TimescaleDB extension
        CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
        
        -- Financial metrics table
        CREATE TABLE IF NOT EXISTS financial_metrics (
            time TIMESTAMPTZ NOT NULL,
            metric_id TEXT NOT NULL,
            customer_id TEXT NOT NULL,
            metric_type TEXT NOT NULL,
            value DECIMAL(20,8) NOT NULL,
            currency TEXT DEFAULT 'EUR',
            metadata JSONB,
            tags JSONB,
            source_system TEXT,
            confidence_level REAL,
            PRIMARY KEY (time, metric_id)
        );
        
        -- Monte Carlo simulation results
        CREATE TABLE IF NOT EXISTS monte_carlo_results (
            time TIMESTAMPTZ NOT NULL,
            simulation_id TEXT NOT NULL,
            customer_id TEXT NOT NULL,
            iteration_number INTEGER NOT NULL,
            scenario_name TEXT NOT NULL,
            risk_value DECIMAL(20,8) NOT NULL,
            probability REAL NOT NULL,
            input_parameters JSONB,
            output_metrics JSONB,
            PRIMARY KEY (time, simulation_id, iteration_number)
        );
        
        -- Compliance cost tracking
        CREATE TABLE IF NOT EXISTS compliance_costs (
            time TIMESTAMPTZ NOT NULL,
            cost_id TEXT NOT NULL,
            customer_id TEXT NOT NULL,
            framework TEXT NOT NULL,
            cost_category TEXT NOT NULL,
            amount DECIMAL(20,8) NOT NULL,
            currency TEXT DEFAULT 'EUR',
            period_start TIMESTAMPTZ NOT NULL,
            period_end TIMESTAMPTZ NOT NULL,
            is_recurring BOOLEAN DEFAULT FALSE,
            cost_center TEXT,
            PRIMARY KEY (time, cost_id)
        );
        
        -- ROI calculations
        CREATE TABLE IF NOT EXISTS roi_calculations (
            time TIMESTAMPTZ NOT NULL,
            calculation_id TEXT NOT NULL,
            customer_id TEXT NOT NULL,
            investment_amount DECIMAL(20,8) NOT NULL,
            savings_amount DECIMAL(20,8) NOT NULL,
            roi_percentage DECIMAL(10,4) NOT NULL,
            npv DECIMAL(20,8) NOT NULL,
            irr DECIMAL(10,4) NOT NULL,
            payback_months INTEGER NOT NULL,
            projection_months INTEGER DEFAULT 36,
            discount_rate REAL DEFAULT 0.08,
            PRIMARY KEY (time, calculation_id)
        );
        
        -- Real-time financial dashboard aggregates
        CREATE TABLE IF NOT EXISTS financial_aggregates (
            time TIMESTAMPTZ NOT NULL,
            customer_id TEXT NOT NULL,
            interval_type TEXT NOT NULL,
            total_savings DECIMAL(20,8) DEFAULT 0,
            total_costs DECIMAL(20,8) DEFAULT 0,
            average_roi DECIMAL(10,4) DEFAULT 0,
            risk_score DECIMAL(10,4) DEFAULT 0,
            trust_score DECIMAL(10,4) DEFAULT 0,
            metrics_count INTEGER DEFAULT 0,
            PRIMARY KEY (time, customer_id, interval_type)
        );
        """
        
        async with self.pool.acquire() as conn:
            await conn.execute(schema_sql)
    
    async def _create_hypertables(self) -> None:
        """Create TimescaleDB hypertables for time-series optimization"""
        hypertable_sql = """
        -- Convert tables to hypertables if not already
        SELECT create_hypertable('financial_metrics', 'time', 
            chunk_time_interval => INTERVAL '1 day',
            if_not_exists => TRUE);
            
        SELECT create_hypertable('monte_carlo_results', 'time',
            chunk_time_interval => INTERVAL '1 day',
            if_not_exists => TRUE);
            
        SELECT create_hypertable('compliance_costs', 'time',
            chunk_time_interval => INTERVAL '1 week',
            if_not_exists => TRUE);
            
        SELECT create_hypertable('roi_calculations', 'time',
            chunk_time_interval => INTERVAL '1 day',
            if_not_exists => TRUE);
            
        SELECT create_hypertable('financial_aggregates', 'time',
            chunk_time_interval => INTERVAL '1 hour',
            if_not_exists => TRUE);
        """
        
        async with self.pool.acquire() as conn:
            await conn.execute(hypertable_sql)
    
    async def _create_compression_policies(self) -> None:
        """Create compression policies for efficient storage"""
        compression_sql = """
        -- Enable compression for older data
        SELECT add_compression_policy('financial_metrics', INTERVAL '7 days');
        SELECT add_compression_policy('monte_carlo_results', INTERVAL '3 days');
        SELECT add_compression_policy('compliance_costs', INTERVAL '30 days');
        SELECT add_compression_policy('roi_calculations', INTERVAL '7 days');
        SELECT add_compression_policy('financial_aggregates', INTERVAL '1 day');
        """
        
        async with self.pool.acquire() as conn:
            try:
                await conn.execute(compression_sql)
            except Exception as e:
                logger.warning("Compression policy creation failed", error=str(e))
    
    async def _create_retention_policies(self) -> None:
        """Create data retention policies"""
        retention_sql = """
        -- Retention policies for different data types
        SELECT add_retention_policy('financial_metrics', INTERVAL '2 years');
        SELECT add_retention_policy('monte_carlo_results', INTERVAL '1 year');
        SELECT add_retention_policy('compliance_costs', INTERVAL '7 years');
        SELECT add_retention_policy('roi_calculations', INTERVAL '5 years');
        SELECT add_retention_policy('financial_aggregates', INTERVAL '3 years');
        """
        
        async with self.pool.acquire() as conn:
            try:
                await conn.execute(retention_sql)
            except Exception as e:
                logger.warning("Retention policy creation failed", error=str(e))
    
    async def _create_indexes(self) -> None:
        """Create optimized indexes for financial queries"""
        index_sql = """
        -- Indexes for financial metrics
        CREATE INDEX IF NOT EXISTS idx_financial_metrics_customer_type 
            ON financial_metrics (customer_id, metric_type, time DESC);
        CREATE INDEX IF NOT EXISTS idx_financial_metrics_type_time 
            ON financial_metrics (metric_type, time DESC);
        
        -- Indexes for Monte Carlo results
        CREATE INDEX IF NOT EXISTS idx_monte_carlo_customer_sim 
            ON monte_carlo_results (customer_id, simulation_id, time DESC);
        CREATE INDEX IF NOT EXISTS idx_monte_carlo_scenario 
            ON monte_carlo_results (scenario_name, time DESC);
        
        -- Indexes for compliance costs
        CREATE INDEX IF NOT EXISTS idx_compliance_costs_customer_framework 
            ON compliance_costs (customer_id, framework, time DESC);
        CREATE INDEX IF NOT EXISTS idx_compliance_costs_category 
            ON compliance_costs (cost_category, time DESC);
        
        -- Indexes for ROI calculations
        CREATE INDEX IF NOT EXISTS idx_roi_customer_time 
            ON roi_calculations (customer_id, time DESC);
        
        -- Indexes for financial aggregates
        CREATE INDEX IF NOT EXISTS idx_financial_aggregates_customer_interval 
            ON financial_aggregates (customer_id, interval_type, time DESC);
        """
        
        async with self.pool.acquire() as conn:
            await conn.execute(index_sql)
    
    async def store_financial_metric(self, metric: FinancialMetric) -> bool:
        """Store a financial metric"""
        try:
            query = """
            INSERT INTO financial_metrics 
            (time, metric_id, customer_id, metric_type, value, currency, 
             metadata, tags, source_system, confidence_level)
            VALUES (€1, €2, €3, €4, €5, €6, €7, €8, €9, €10)
            ON CONFLICT (time, metric_id) DO UPDATE SET
                value = EXCLUDED.value,
                metadata = EXCLUDED.metadata,
                tags = EXCLUDED.tags,
                confidence_level = EXCLUDED.confidence_level
            """
            
            async with self.pool.acquire() as conn:
                await conn.execute(
                    query,
                    metric.timestamp,
                    metric.metric_id,
                    metric.customer_id,
                    metric.metric_type.value,
                    metric.value,
                    metric.currency,
                    json.dumps(metric.metadata),
                    json.dumps(metric.tags),
                    metric.source_system,
                    metric.confidence_level
                )
            
            logger.info("Financial metric stored", 
                       metric_id=metric.metric_id,
                       customer_id=metric.customer_id,
                       metric_type=metric.metric_type)
            return True
            
        except Exception as e:
            logger.error("Failed to store financial metric", 
                        metric_id=metric.metric_id,
                        error=str(e))
            return False
    
    async def store_monte_carlo_result(self, result: MonteCarloResult) -> bool:
        """Store Monte Carlo simulation result"""
        try:
            query = """
            INSERT INTO monte_carlo_results 
            (time, simulation_id, customer_id, iteration_number, scenario_name,
             risk_value, probability, input_parameters, output_metrics)
            VALUES (€1, €2, €3, €4, €5, €6, €7, €8, €9)
            """
            
            async with self.pool.acquire() as conn:
                await conn.execute(
                    query,
                    result.timestamp,
                    result.simulation_id,
                    result.customer_id,
                    result.iteration_number,
                    result.scenario_name,
                    result.risk_value,
                    result.probability,
                    json.dumps(result.input_parameters),
                    json.dumps(result.output_metrics, default=str)
                )
            
            return True
            
        except Exception as e:
            logger.error("Failed to store Monte Carlo result", 
                        simulation_id=result.simulation_id,
                        error=str(e))
            return False
    
    async def store_compliance_cost(self, cost: ComplianceCostMetric) -> bool:
        """Store compliance cost metric"""
        try:
            query = """
            INSERT INTO compliance_costs 
            (time, cost_id, customer_id, framework, cost_category, amount,
             currency, period_start, period_end, is_recurring, cost_center)
            VALUES (€1, €2, €3, €4, €5, €6, €7, €8, €9, €10, €11)
            ON CONFLICT (time, cost_id) DO UPDATE SET
                amount = EXCLUDED.amount,
                cost_category = EXCLUDED.cost_category
            """
            
            async with self.pool.acquire() as conn:
                await conn.execute(
                    query,
                    datetime.utcnow(),
                    cost.cost_id,
                    cost.customer_id,
                    cost.framework,
                    cost.cost_category,
                    cost.amount,
                    cost.currency,
                    cost.period_start,
                    cost.period_end,
                    cost.is_recurring,
                    cost.cost_center
                )
            
            return True
            
        except Exception as e:
            logger.error("Failed to store compliance cost", 
                        cost_id=cost.cost_id,
                        error=str(e))
            return False
    
    async def store_roi_calculation(self, roi: ROICalculation) -> bool:
        """Store ROI calculation result"""
        try:
            query = """
            INSERT INTO roi_calculations 
            (time, calculation_id, customer_id, investment_amount, savings_amount,
             roi_percentage, npv, irr, payback_months, projection_months, discount_rate)
            VALUES (€1, €2, €3, €4, €5, €6, €7, €8, €9, €10, €11)
            """
            
            async with self.pool.acquire() as conn:
                await conn.execute(
                    query,
                    roi.calculation_date,
                    roi.calculation_id,
                    roi.customer_id,
                    roi.investment_amount,
                    roi.savings_amount,
                    roi.roi_percentage,
                    roi.npv,
                    roi.irr,
                    roi.payback_months,
                    roi.projection_months,
                    roi.discount_rate
                )
            
            return True
            
        except Exception as e:
            logger.error("Failed to store ROI calculation", 
                        calculation_id=roi.calculation_id,
                        error=str(e))
            return False
    
    async def get_financial_metrics(
        self,
        customer_id: str,
        metric_types: Optional[List[MetricType]] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        limit: int = 1000
    ) -> List[FinancialMetric]:
        """Retrieve financial metrics with filtering"""
        try:
            conditions = ["customer_id = €1"]
            params = [customer_id]
            param_count = 1
            
            if metric_types:
                param_count += 1
                conditions.append(f"metric_type = ANY(€{param_count})")
                params.append([mt.value for mt in metric_types])
            
            if start_time:
                param_count += 1
                conditions.append(f"time >= €{param_count}")
                params.append(start_time)
            
            if end_time:
                param_count += 1
                conditions.append(f"time <= €{param_count}")
                params.append(end_time)
            
            where_clause = " AND ".join(conditions)
            query = f"""
            SELECT time, metric_id, customer_id, metric_type, value, currency,
                   metadata, tags, source_system, confidence_level
            FROM financial_metrics
            WHERE {where_clause}
            ORDER BY time DESC
            LIMIT {limit}
            """
            
            async with self.pool.acquire() as conn:
                rows = await conn.fetch(query, *params)
            
            metrics = []
            for row in rows:
                metrics.append(FinancialMetric(
                    metric_id=row['metric_id'],
                    customer_id=row['customer_id'],
                    metric_type=MetricType(row['metric_type']),
                    value=Decimal(str(row['value'])),
                    currency=row['currency'],
                    timestamp=row['time'],
                    metadata=json.loads(row['metadata'] or '{}'),
                    tags=json.loads(row['tags'] or '{}'),
                    source_system=row['source_system'],
                    confidence_level=row['confidence_level']
                ))
            
            return metrics
            
        except Exception as e:
            logger.error("Failed to retrieve financial metrics", 
                        customer_id=customer_id,
                        error=str(e))
            return []
    
    async def get_aggregated_metrics(
        self,
        customer_id: str,
        interval: AggregationInterval,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get aggregated financial metrics"""
        try:
            time_filter = ""
            params = [customer_id, interval.value]
            
            if start_time and end_time:
                time_filter = "AND time >= €3 AND time <= €4"
                params.extend([start_time, end_time])
            
            query = f"""
            SELECT 
                time_bucket(€2, time) as bucket,
                AVG(CASE WHEN metric_type = 'roi' THEN value END) as avg_roi,
                SUM(CASE WHEN metric_type = 'savings_realized' THEN value END) as total_savings,
                SUM(CASE WHEN metric_type = 'compliance_cost' THEN value END) as total_costs,
                AVG(CASE WHEN metric_type = 'risk_score' THEN value END) as avg_risk_score,
                AVG(CASE WHEN metric_type = 'trust_score' THEN value END) as avg_trust_score,
                COUNT(*) as metrics_count
            FROM financial_metrics
            WHERE customer_id = €1 {time_filter}
            GROUP BY bucket
            ORDER BY bucket DESC
            """
            
            async with self.pool.acquire() as conn:
                rows = await conn.fetch(query, *params)
            
            aggregates = []
            for row in rows:
                aggregates.append({
                    'timestamp': row['bucket'],
                    'avg_roi': float(row['avg_roi'] or 0),
                    'total_savings': float(row['total_savings'] or 0),
                    'total_costs': float(row['total_costs'] or 0),
                    'avg_risk_score': float(row['avg_risk_score'] or 0),
                    'avg_trust_score': float(row['avg_trust_score'] or 0),
                    'metrics_count': row['metrics_count']
                })
            
            return {
                'customer_id': customer_id,
                'interval': interval.value,
                'aggregates': aggregates
            }
            
        except Exception as e:
            logger.error("Failed to get aggregated metrics", 
                        customer_id=customer_id,
                        error=str(e))
            return {}
    
    async def get_monte_carlo_analysis(
        self,
        customer_id: str,
        simulation_id: str,
        scenario_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get Monte Carlo simulation analysis"""
        try:
            conditions = ["customer_id = €1", "simulation_id = €2"]
            params = [customer_id, simulation_id]
            
            if scenario_name:
                conditions.append("scenario_name = €3")
                params.append(scenario_name)
            
            where_clause = " AND ".join(conditions)
            query = f"""
            SELECT 
                scenario_name,
                COUNT(*) as iteration_count,
                AVG(risk_value) as mean_risk,
                STDDEV(risk_value) as std_risk,
                MIN(risk_value) as min_risk,
                MAX(risk_value) as max_risk,
                PERCENTILE_CONT(0.05) WITHIN GROUP (ORDER BY risk_value) as var_95,
                PERCENTILE_CONT(0.01) WITHIN GROUP (ORDER BY risk_value) as var_99,
                AVG(probability) as mean_probability
            FROM monte_carlo_results
            WHERE {where_clause}
            GROUP BY scenario_name
            ORDER BY scenario_name
            """
            
            async with self.pool.acquire() as conn:
                rows = await conn.fetch(query, *params)
            
            scenarios = []
            for row in rows:
                scenarios.append({
                    'scenario_name': row['scenario_name'],
                    'iteration_count': row['iteration_count'],
                    'statistics': {
                        'mean_risk': float(row['mean_risk'] or 0),
                        'std_risk': float(row['std_risk'] or 0),
                        'min_risk': float(row['min_risk'] or 0),
                        'max_risk': float(row['max_risk'] or 0),
                        'var_95': float(row['var_95'] or 0),
                        'var_99': float(row['var_99'] or 0),
                        'mean_probability': float(row['mean_probability'] or 0)
                    }
                })
            
            return {
                'customer_id': customer_id,
                'simulation_id': simulation_id,
                'scenarios': scenarios
            }
            
        except Exception as e:
            logger.error("Failed to get Monte Carlo analysis", 
                        customer_id=customer_id,
                        simulation_id=simulation_id,
                        error=str(e))
            return {}
    
    async def calculate_real_time_dashboard_metrics(self, customer_id: str) -> Dict[str, Any]:
        """Calculate real-time dashboard metrics"""
        try:
            query = """
            WITH recent_metrics AS (
                SELECT * FROM financial_metrics 
                WHERE customer_id = €1 
                AND time >= NOW() - INTERVAL '30 days'
            ),
            roi_metrics AS (
                SELECT 
                    AVG(value) as current_roi,
                    COUNT(*) as roi_calculations
                FROM recent_metrics 
                WHERE metric_type = 'roi'
            ),
            savings_metrics AS (
                SELECT 
                    SUM(value) as total_savings,
                    COUNT(*) as savings_events
                FROM recent_metrics 
                WHERE metric_type = 'savings_realized'
            ),
            risk_metrics AS (
                SELECT 
                    AVG(value) as current_risk_score,
                    MAX(value) as max_risk
                FROM recent_metrics 
                WHERE metric_type = 'risk_score'
            ),
            trust_metrics AS (
                SELECT 
                    AVG(value) as current_trust_score,
                    MIN(value) as min_trust
                FROM recent_metrics 
                WHERE metric_type = 'trust_score'
            )
            SELECT 
                r.current_roi,
                r.roi_calculations,
                s.total_savings,
                s.savings_events,
                rs.current_risk_score,
                rs.max_risk,
                t.current_trust_score,
                t.min_trust
            FROM roi_metrics r, savings_metrics s, risk_metrics rs, trust_metrics t
            """
            
            async with self.pool.acquire() as conn:
                row = await conn.fetchrow(query, customer_id)
            
            if not row:
                return {}
            
            return {
                'customer_id': customer_id,
                'last_updated': datetime.utcnow(),
                'roi': {
                    'current': float(row['current_roi'] or 0),
                    'calculations_count': row['roi_calculations'] or 0
                },
                'savings': {
                    'total_30_days': float(row['total_savings'] or 0),
                    'events_count': row['savings_events'] or 0
                },
                'risk': {
                    'current_score': float(row['current_risk_score'] or 0),
                    'max_30_days': float(row['max_risk'] or 0)
                },
                'trust': {
                    'current_score': float(row['current_trust_score'] or 0),
                    'min_30_days': float(row['min_trust'] or 0)
                }
            }
            
        except Exception as e:
            logger.error("Failed to calculate dashboard metrics", 
                        customer_id=customer_id,
                        error=str(e))
            return {}
    
    async def close(self) -> None:
        """Close database connection pool"""
        if self.pool:
            await self.pool.close()
            logger.info("TimescaleDB connection pool closed")

class FinancialMetricsStreamer:
    """
    Real-time financial metrics streaming service
    Provides WebSocket streams for live dashboard updates
    """
    
    def __init__(self, db: TimescaleFinancialDB):
        self.db = db
        self.active_streams: Dict[str, List] = {}
        
    async def start_real_time_stream(self, customer_id: str, websocket) -> None:
        """Start real-time metrics stream for customer"""
        try:
            if customer_id not in self.active_streams:
                self.active_streams[customer_id] = []
            
            self.active_streams[customer_id].append(websocket)
            
            # Send initial dashboard state
            dashboard_metrics = await self.db.calculate_real_time_dashboard_metrics(customer_id)
            await websocket.send_json({
                'type': 'dashboard_update',
                'data': dashboard_metrics
            })
            
            logger.info("Real-time stream started", customer_id=customer_id)
            
        except Exception as e:
            logger.error("Failed to start real-time stream", 
                        customer_id=customer_id,
                        error=str(e))
    
    async def broadcast_metric_update(self, metric: FinancialMetric) -> None:
        """Broadcast metric update to active streams"""
        if metric.customer_id in self.active_streams:
            update_message = {
                'type': 'metric_update',
                'data': {
                    'metric_type': metric.metric_type.value,
                    'value': float(metric.value),
                    'timestamp': metric.timestamp.isoformat(),
                    'currency': metric.currency
                }
            }
            
            # Send to all active websockets for this customer
            for websocket in self.active_streams[metric.customer_id]:
                try:
                    await websocket.send_json(update_message)
                except Exception as e:
                    logger.warning("Failed to send metric update", error=str(e))
    
    async def stop_stream(self, customer_id: str, websocket) -> None:
        """Stop real-time stream"""
        if customer_id in self.active_streams:
            try:
                self.active_streams[customer_id].remove(websocket)
                if not self.active_streams[customer_id]:
                    del self.active_streams[customer_id]
            except ValueError:
                pass

# Utility functions for financial calculations
def calculate_npv(cash_flows: List[Decimal], discount_rate: float) -> Decimal:
    """Calculate Net Present Value"""
    npv = Decimal('0')
    for i, cash_flow in enumerate(cash_flows):
        npv += cash_flow / Decimal((1 + discount_rate) ** i)
    return npv

def calculate_irr(cash_flows: List[Decimal], initial_guess: float = 0.1) -> Optional[Decimal]:
    """Calculate Internal Rate of Return using Newton-Raphson method"""
    try:
        import scipy.optimize
        
        def npv_function(rate):
            return sum(float(cf) / (1 + rate) ** i for i, cf in enumerate(cash_flows))
        
        irr = scipy.optimize.newton(npv_function, initial_guess, maxiter=100)
        return Decimal(str(round(irr, 6)))
    except:
        return None

def calculate_payback_period(investment: Decimal, annual_savings: Decimal) -> int:
    """Calculate payback period in months"""
    if annual_savings <= 0:
        return 999  # Invalid/infinite payback
    
    monthly_savings = annual_savings / 12
    months = int(investment / monthly_savings)
    return months

# Example usage and factory functions
async def create_timescale_financial_db(config: TimescaleDBConfig) -> TimescaleFinancialDB:
    """Factory function to create and initialize TimescaleDB"""
    db = TimescaleFinancialDB(config)
    await db.initialize()
    return db

async def example_usage():
    """Example usage of TimescaleDB financial metrics"""
    # Configuration
    config = TimescaleDBConfig(
        host="localhost",
        database="erip_financial_metrics",
        username="erip_user",
        password="secure_password"
    )
    
    # Initialize database
    db = await create_timescale_financial_db(config)
    
    # Store sample metrics
    metric = FinancialMetric(
        metric_id="roi_calc_001",
        customer_id="customer_123",
        metric_type=MetricType.ROI,
        value=Decimal("485.7"),
        timestamp=datetime.utcnow(),
        metadata={"calculation_method": "enhanced_beacon"}
    )
    
    await db.store_financial_metric(metric)
    
    # Retrieve and analyze
    metrics = await db.get_financial_metrics("customer_123")
    dashboard = await db.calculate_real_time_dashboard_metrics("customer_123")
    
    print(f"Stored {len(metrics)} metrics")
    print(f"Dashboard data: {dashboard}")
    
    await db.close()

if __name__ == "__main__":
    asyncio.run(example_usage())