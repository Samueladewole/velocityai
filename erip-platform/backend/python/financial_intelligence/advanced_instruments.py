"""
Advanced Financial Instruments Management
Python interface for complex derivatives, structured products, and portfolio analytics
"""

from typing import Dict, List, Optional, Any, Union, Tuple
from datetime import datetime, date
from decimal import Decimal
from enum import Enum
import asyncio
import json
import numpy as np
import pandas as pd
import structlog
from pydantic import BaseModel, Field
import asyncpg

from .timescale_db import TimescaleFinancialDB

logger = structlog.get_logger()

class InstrumentType(str, Enum):
    """Financial instrument types"""
    EQUITY = "equity"
    BOND = "bond"
    OPTION = "option"
    FUTURE = "future"
    SWAP = "swap"
    STRUCTURED_PRODUCT = "structured_product"
    EXOTIC_DERIVATIVE = "exotic_derivative"

class OptionType(str, Enum):
    """Option types"""
    CALL = "call"
    PUT = "put"

class OptionStyle(str, Enum):
    """Option exercise styles"""
    AMERICAN = "american"
    EUROPEAN = "european"
    ASIAN = "asian"
    BARRIER = "barrier"

class SwapType(str, Enum):
    """Swap contract types"""
    INTEREST_RATE = "interest_rate"
    CURRENCY = "currency"
    COMMODITY = "commodity"
    CREDIT_DEFAULT = "credit_default"
    TOTAL_RETURN = "total_return"

class FinancialInstrument(BaseModel):
    """Base financial instrument model"""
    instrument_id: str
    isin_code: Optional[str] = None
    instrument_name: str
    instrument_type: InstrumentType
    asset_class: str
    currency: str = "USD"
    country_code: Optional[str] = None
    exchange_code: Optional[str] = None
    is_active: bool = True
    metadata: Dict[str, Any] = Field(default_factory=dict)

class OptionsContract(BaseModel):
    """Options contract specification"""
    option_id: str
    underlying_instrument_id: str
    option_type: OptionType
    option_style: OptionStyle
    strike_price: Decimal
    expiration_date: date
    contract_size: Decimal = Decimal("100")
    premium: Optional[Decimal] = None
    implied_volatility: Optional[Decimal] = None
    
    # Greeks
    delta_greek: Optional[Decimal] = None
    gamma_greek: Optional[Decimal] = None
    theta_greek: Optional[Decimal] = None
    vega_greek: Optional[Decimal] = None
    rho_greek: Optional[Decimal] = None
    
    # Market data
    open_interest: Optional[int] = None
    volume: Optional[int] = None
    
    currency: str = "USD"
    metadata: Dict[str, Any] = Field(default_factory=dict)

class FuturesContract(BaseModel):
    """Futures contract specification"""
    future_id: str
    underlying_instrument_id: Optional[str] = None
    underlying_asset_type: str
    contract_month: str  # YYYYMM
    expiration_date: date
    contract_size: Decimal
    tick_size: Decimal
    tick_value: Decimal
    settlement_price: Optional[Decimal] = None
    initial_margin: Optional[Decimal] = None
    maintenance_margin: Optional[Decimal] = None
    exchange_code: str
    currency: str = "USD"

class SwapsContract(BaseModel):
    """Swaps contract specification"""
    swap_id: str
    swap_type: SwapType
    notional_amount: Decimal
    currency: str
    start_date: date
    maturity_date: date
    
    # Fixed leg
    fixed_rate: Optional[Decimal] = None
    
    # Floating leg
    floating_rate_index: Optional[str] = None
    floating_spread: Optional[Decimal] = None
    
    # Valuation
    present_value: Optional[Decimal] = None
    dv01: Optional[Decimal] = None
    
    counterparty_id: str
    is_cleared: bool = False

class PortfolioPosition(BaseModel):
    """Portfolio position tracking"""
    position_id: str
    portfolio_id: str
    instrument_id: str
    quantity: Decimal
    average_cost: Optional[Decimal] = None
    market_value: Optional[Decimal] = None
    unrealized_pnl: Optional[Decimal] = None
    realized_pnl: Optional[Decimal] = None
    
    # Risk metrics
    var_1_day: Optional[Decimal] = None
    var_10_day: Optional[Decimal] = None
    beta: Optional[Decimal] = None
    
    currency: str = "USD"

class AdvancedInstrumentsManager:
    """
    Manager for advanced financial instruments and derivatives
    Provides high-level interface for complex financial products
    """
    
    def __init__(self, db: TimescaleFinancialDB):
        self.db = db
        
    async def create_financial_instrument(self, instrument: FinancialInstrument) -> bool:
        """Create a new financial instrument"""
        try:
            query = """
            INSERT INTO financial_instruments 
            (instrument_id, isin_code, instrument_name, instrument_type, asset_class,
             currency, country_code, exchange_code, is_active, metadata)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (instrument_id) DO UPDATE SET
                instrument_name = EXCLUDED.instrument_name,
                is_active = EXCLUDED.is_active,
                updated_at = NOW()
            """
            
            async with self.db.pool.acquire() as conn:
                await conn.execute(
                    query,
                    instrument.instrument_id,
                    instrument.isin_code,
                    instrument.instrument_name,
                    instrument.instrument_type.value,
                    instrument.asset_class,
                    instrument.currency,
                    instrument.country_code,
                    instrument.exchange_code,
                    instrument.is_active,
                    json.dumps(instrument.metadata)
                )
            
            logger.info("Financial instrument created",
                       instrument_id=instrument.instrument_id,
                       instrument_type=instrument.instrument_type)
            return True
            
        except Exception as e:
            logger.error("Failed to create financial instrument",
                        instrument_id=instrument.instrument_id,
                        error=str(e))
            return False
    
    async def create_options_contract(self, option: OptionsContract) -> bool:
        """Create an options contract"""
        try:
            query = """
            INSERT INTO options_contracts 
            (time, option_id, underlying_instrument_id, option_type, option_style,
             strike_price, expiration_date, contract_size, premium, implied_volatility,
             delta_greek, gamma_greek, theta_greek, vega_greek, rho_greek,
             open_interest, volume, currency, metadata)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
            """
            
            async with self.db.pool.acquire() as conn:
                await conn.execute(
                    query,
                    datetime.utcnow(),
                    option.option_id,
                    option.underlying_instrument_id,
                    option.option_type.value,
                    option.option_style.value,
                    option.strike_price,
                    option.expiration_date,
                    option.contract_size,
                    option.premium,
                    option.implied_volatility,
                    option.delta_greek,
                    option.gamma_greek,
                    option.theta_greek,
                    option.vega_greek,
                    option.rho_greek,
                    option.open_interest,
                    option.volume,
                    option.currency,
                    json.dumps(option.metadata)
                )
            
            logger.info("Options contract created",
                       option_id=option.option_id,
                       underlying=option.underlying_instrument_id)
            return True
            
        except Exception as e:
            logger.error("Failed to create options contract",
                        option_id=option.option_id,
                        error=str(e))
            return False
    
    async def create_futures_contract(self, future: FuturesContract) -> bool:
        """Create a futures contract"""
        try:
            query = """
            INSERT INTO futures_contracts 
            (time, future_id, underlying_instrument_id, underlying_asset_type,
             contract_month, expiration_date, contract_size, tick_size, tick_value,
             settlement_price, initial_margin, maintenance_margin, exchange_code, currency)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            """
            
            async with self.db.pool.acquire() as conn:
                await conn.execute(
                    query,
                    datetime.utcnow(),
                    future.future_id,
                    future.underlying_instrument_id,
                    future.underlying_asset_type,
                    future.contract_month,
                    future.expiration_date,
                    future.contract_size,
                    future.tick_size,
                    future.tick_value,
                    future.settlement_price,
                    future.initial_margin,
                    future.maintenance_margin,
                    future.exchange_code,
                    future.currency
                )
            
            logger.info("Futures contract created",
                       future_id=future.future_id,
                       contract_month=future.contract_month)
            return True
            
        except Exception as e:
            logger.error("Failed to create futures contract",
                        future_id=future.future_id,
                        error=str(e))
            return False
    
    async def create_swap_contract(self, swap: SwapsContract) -> bool:
        """Create a swap contract"""
        try:
            query = """
            INSERT INTO swaps_contracts 
            (time, swap_id, swap_type, notional_amount, currency, start_date,
             maturity_date, fixed_rate, floating_rate_index, floating_spread,
             present_value, dv01, counterparty_id, is_cleared)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            """
            
            async with self.db.pool.acquire() as conn:
                await conn.execute(
                    query,
                    datetime.utcnow(),
                    swap.swap_id,
                    swap.swap_type.value,
                    swap.notional_amount,
                    swap.currency,
                    swap.start_date,
                    swap.maturity_date,
                    swap.fixed_rate,
                    swap.floating_rate_index,
                    swap.floating_spread,
                    swap.present_value,
                    swap.dv01,
                    swap.counterparty_id,
                    swap.is_cleared
                )
            
            logger.info("Swap contract created",
                       swap_id=swap.swap_id,
                       swap_type=swap.swap_type)
            return True
            
        except Exception as e:
            logger.error("Failed to create swap contract",
                        swap_id=swap.swap_id,
                        error=str(e))
            return False
    
    async def update_portfolio_position(self, position: PortfolioPosition) -> bool:
        """Update portfolio position"""
        try:
            query = """
            INSERT INTO portfolio_positions 
            (time, position_id, portfolio_id, instrument_id, quantity, average_cost,
             market_value, unrealized_pnl, realized_pnl, var_1_day, var_10_day,
             beta, currency)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            """
            
            async with self.db.pool.acquire() as conn:
                await conn.execute(
                    query,
                    datetime.utcnow(),
                    position.position_id,
                    position.portfolio_id,
                    position.instrument_id,
                    position.quantity,
                    position.average_cost,
                    position.market_value,
                    position.unrealized_pnl,
                    position.realized_pnl,
                    position.var_1_day,
                    position.var_10_day,
                    position.beta,
                    position.currency
                )
            
            logger.info("Portfolio position updated",
                       position_id=position.position_id,
                       portfolio_id=position.portfolio_id)
            return True
            
        except Exception as e:
            logger.error("Failed to update portfolio position",
                        position_id=position.position_id,
                        error=str(e))
            return False
    
    async def get_portfolio_summary(self, portfolio_id: str) -> Optional[Dict[str, Any]]:
        """Get portfolio summary with risk metrics"""
        try:
            query = """
            SELECT 
                portfolio_id,
                COUNT(DISTINCT instrument_id) as num_positions,
                SUM(market_value) as total_market_value,
                SUM(unrealized_pnl) as total_unrealized_pnl,
                SUM(var_1_day) as portfolio_var_1_day,
                AVG(beta) as weighted_beta
            FROM portfolio_positions 
            WHERE portfolio_id = $1 
                AND time >= NOW() - INTERVAL '1 day'
            GROUP BY portfolio_id
            """
            
            async with self.db.pool.acquire() as conn:
                row = await conn.fetchrow(query, portfolio_id)
            
            if row:
                return {
                    "portfolio_id": row["portfolio_id"],
                    "num_positions": row["num_positions"],
                    "total_market_value": float(row["total_market_value"] or 0),
                    "total_unrealized_pnl": float(row["total_unrealized_pnl"] or 0),
                    "portfolio_var_1_day": float(row["portfolio_var_1_day"] or 0),
                    "weighted_beta": float(row["weighted_beta"] or 0),
                    "last_updated": datetime.utcnow().isoformat()
                }
            
            return None
            
        except Exception as e:
            logger.error("Failed to get portfolio summary",
                        portfolio_id=portfolio_id,
                        error=str(e))
            return None
    
    async def get_derivatives_exposure(self, portfolio_id: Optional[str] = None) -> Dict[str, Any]:
        """Get derivatives exposure summary"""
        try:
            # Options exposure
            options_query = """
            SELECT 
                COUNT(*) as num_options,
                SUM(ABS(delta_greek * contract_size)) as total_delta,
                SUM(ABS(gamma_greek * contract_size)) as total_gamma,
                SUM(premium * contract_size) as total_premium,
                currency
            FROM options_contracts 
            WHERE time >= NOW() - INTERVAL '1 day'
            GROUP BY currency
            """
            
            # Futures exposure
            futures_query = """
            SELECT 
                COUNT(*) as num_futures,
                SUM(settlement_price * contract_size) as notional_exposure,
                currency
            FROM futures_contracts 
            WHERE time >= NOW() - INTERVAL '1 day'
            GROUP BY currency
            """
            
            # Swaps exposure
            swaps_query = """
            SELECT 
                COUNT(*) as num_swaps,
                SUM(notional_amount) as total_notional,
                SUM(present_value) as total_mtm,
                currency
            FROM swaps_contracts 
            WHERE time >= NOW() - INTERVAL '1 day'
            GROUP BY currency
            """
            
            async with self.db.pool.acquire() as conn:
                options_rows = await conn.fetch(options_query)
                futures_rows = await conn.fetch(futures_query)
                swaps_rows = await conn.fetch(swaps_query)
            
            return {
                "options_exposure": [dict(row) for row in options_rows],
                "futures_exposure": [dict(row) for row in futures_rows],
                "swaps_exposure": [dict(row) for row in swaps_rows],
                "calculated_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error("Failed to get derivatives exposure", error=str(e))
            return {}
    
    async def calculate_portfolio_var(
        self,
        portfolio_id: str,
        confidence_level: float = 0.95,
        time_horizon_days: int = 1
    ) -> Optional[Dict[str, Any]]:
        """Calculate portfolio Value-at-Risk"""
        try:
            # Get current positions
            positions_query = """
            SELECT 
                instrument_id,
                quantity,
                market_value,
                var_1_day,
                beta
            FROM portfolio_positions 
            WHERE portfolio_id = $1 
                AND time >= NOW() - INTERVAL '1 day'
                AND quantity != 0
            """
            
            async with self.db.pool.acquire() as conn:
                positions = await conn.fetch(positions_query)
            
            if not positions:
                return None
            
            # Simple VaR calculation (would be more sophisticated in production)
            total_value = sum(float(pos["market_value"] or 0) for pos in positions)
            individual_vars = [float(pos["var_1_day"] or 0) for pos in positions]
            
            # Portfolio VaR (assuming some correlation)
            correlation_adjustment = 0.8  # Simplified correlation
            portfolio_var = sum(individual_vars) * correlation_adjustment
            
            # Scale for time horizon
            time_scaling = np.sqrt(time_horizon_days)
            scaled_var = portfolio_var * time_scaling
            
            return {
                "portfolio_id": portfolio_id,
                "confidence_level": confidence_level,
                "time_horizon_days": time_horizon_days,
                "portfolio_value": total_value,
                "var_amount": scaled_var,
                "var_percentage": (scaled_var / total_value * 100) if total_value > 0 else 0,
                "num_positions": len(positions),
                "calculated_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error("Failed to calculate portfolio VaR",
                        portfolio_id=portfolio_id,
                        error=str(e))
            return None
    
    async def get_options_chain(
        self,
        underlying_instrument_id: str,
        expiration_date: Optional[date] = None
    ) -> List[Dict[str, Any]]:
        """Get options chain for underlying instrument"""
        try:
            conditions = ["underlying_instrument_id = $1"]
            params = [underlying_instrument_id]
            
            if expiration_date:
                conditions.append("expiration_date = $2")
                params.append(expiration_date)
            
            where_clause = " AND ".join(conditions)
            
            query = f"""
            SELECT 
                option_id,
                option_type,
                strike_price,
                expiration_date,
                premium,
                implied_volatility,
                delta_greek,
                gamma_greek,
                theta_greek,
                vega_greek,
                open_interest,
                volume
            FROM options_contracts 
            WHERE {where_clause}
                AND time >= NOW() - INTERVAL '1 day'
            ORDER BY expiration_date, strike_price, option_type
            """
            
            async with self.db.pool.acquire() as conn:
                rows = await conn.fetch(query, *params)
            
            return [
                {
                    "option_id": row["option_id"],
                    "option_type": row["option_type"],
                    "strike_price": float(row["strike_price"]),
                    "expiration_date": row["expiration_date"].isoformat(),
                    "premium": float(row["premium"] or 0),
                    "implied_volatility": float(row["implied_volatility"] or 0),
                    "greeks": {
                        "delta": float(row["delta_greek"] or 0),
                        "gamma": float(row["gamma_greek"] or 0),
                        "theta": float(row["theta_greek"] or 0),
                        "vega": float(row["vega_greek"] or 0)
                    },
                    "market_data": {
                        "open_interest": row["open_interest"],
                        "volume": row["volume"]
                    }
                }
                for row in rows
            ]
            
        except Exception as e:
            logger.error("Failed to get options chain",
                        underlying_instrument_id=underlying_instrument_id,
                        error=str(e))
            return []
    
    async def calculate_portfolio_greeks(self, portfolio_id: str) -> Dict[str, Any]:
        """Calculate aggregate portfolio Greeks"""
        try:
            query = """
            SELECT 
                SUM(p.quantity * COALESCE(o.delta_greek, 0) * o.contract_size) as portfolio_delta,
                SUM(p.quantity * COALESCE(o.gamma_greek, 0) * o.contract_size) as portfolio_gamma,
                SUM(p.quantity * COALESCE(o.theta_greek, 0) * o.contract_size) as portfolio_theta,
                SUM(p.quantity * COALESCE(o.vega_greek, 0) * o.contract_size) as portfolio_vega,
                SUM(p.quantity * COALESCE(o.rho_greek, 0) * o.contract_size) as portfolio_rho
            FROM portfolio_positions p
            JOIN options_contracts o ON p.instrument_id = o.option_id
            WHERE p.portfolio_id = $1 
                AND p.time >= NOW() - INTERVAL '1 day'
                AND o.time >= NOW() - INTERVAL '1 day'
            """
            
            async with self.db.pool.acquire() as conn:
                row = await conn.fetchrow(query, portfolio_id)
            
            if row:
                return {
                    "portfolio_id": portfolio_id,
                    "greeks": {
                        "delta": float(row["portfolio_delta"] or 0),
                        "gamma": float(row["portfolio_gamma"] or 0),
                        "theta": float(row["portfolio_theta"] or 0),
                        "vega": float(row["portfolio_vega"] or 0),
                        "rho": float(row["portfolio_rho"] or 0)
                    },
                    "calculated_at": datetime.utcnow().isoformat()
                }
            
            return {"portfolio_id": portfolio_id, "greeks": {}, "calculated_at": datetime.utcnow().isoformat()}
            
        except Exception as e:
            logger.error("Failed to calculate portfolio Greeks",
                        portfolio_id=portfolio_id,
                        error=str(e))
            return {}

class StructuredProductsManager:
    """Manager for structured products and complex instruments"""
    
    def __init__(self, db: TimescaleFinancialDB):
        self.db = db
    
    async def create_structured_product(
        self,
        product_id: str,
        product_type: str,
        notional_amount: Decimal,
        tranche_details: Dict[str, Any]
    ) -> bool:
        """Create a structured product (CDO, CLO, ABS, MBS)"""
        try:
            query = """
            INSERT INTO structured_products 
            (time, product_id, product_type, notional_amount, currency,
             tranche_name, seniority_level, attachment_point, detachment_point,
             expected_loss, loss_given_default, rating_1, metadata)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            """
            
            async with self.db.pool.acquire() as conn:
                await conn.execute(
                    query,
                    datetime.utcnow(),
                    product_id,
                    product_type,
                    notional_amount,
                    tranche_details.get("currency", "USD"),
                    tranche_details.get("tranche_name"),
                    tranche_details.get("seniority_level"),
                    tranche_details.get("attachment_point"),
                    tranche_details.get("detachment_point"),
                    tranche_details.get("expected_loss"),
                    tranche_details.get("loss_given_default"),
                    tranche_details.get("rating"),
                    json.dumps(tranche_details)
                )
            
            logger.info("Structured product created",
                       product_id=product_id,
                       product_type=product_type)
            return True
            
        except Exception as e:
            logger.error("Failed to create structured product",
                        product_id=product_id,
                        error=str(e))
            return False

# Factory functions
async def create_advanced_instruments_manager(db: TimescaleFinancialDB) -> AdvancedInstrumentsManager:
    """Create advanced instruments manager"""
    return AdvancedInstrumentsManager(db)

async def create_structured_products_manager(db: TimescaleFinancialDB) -> StructuredProductsManager:
    """Create structured products manager"""
    return StructuredProductsManager(db)

# Example usage
async def example_advanced_instruments():
    """Example usage of advanced instruments"""
    from .timescale_db import TimescaleDBConfig, TimescaleFinancialDB
    
    # Initialize database
    config = TimescaleDBConfig()
    db = TimescaleFinancialDB(config)
    await db.initialize()
    
    # Create managers
    instruments_mgr = await create_advanced_instruments_manager(db)
    
    # Create sample instrument
    instrument = FinancialInstrument(
        instrument_id="AAPL_EQUITY",
        instrument_name="Apple Inc. Common Stock",
        instrument_type=InstrumentType.EQUITY,
        asset_class="equity",
        currency="USD",
        exchange_code="NASDAQ"
    )
    
    await instruments_mgr.create_financial_instrument(instrument)
    
    # Create options contract
    option = OptionsContract(
        option_id="AAPL_240315C150",
        underlying_instrument_id="AAPL_EQUITY",
        option_type=OptionType.CALL,
        option_style=OptionStyle.AMERICAN,
        strike_price=Decimal("150.00"),
        expiration_date=date(2024, 3, 15),
        premium=Decimal("5.25"),
        delta_greek=Decimal("0.65")
    )
    
    await instruments_mgr.create_options_contract(option)
    
    # Get options chain
    chain = await instruments_mgr.get_options_chain("AAPL_EQUITY")
    print(f"Options chain: {chain}")
    
    await db.close()

if __name__ == "__main__":
    asyncio.run(example_advanced_instruments())