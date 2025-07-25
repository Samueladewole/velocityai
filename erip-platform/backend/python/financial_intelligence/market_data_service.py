"""
Market Data Integration Service
Real-time pricing and economic indicators for financial risk modeling
"""

from typing import Dict, List, Optional, Any, Union, AsyncGenerator
from datetime import datetime, timedelta
from decimal import Decimal
import asyncio
import json
import structlog
from enum import Enum
from pydantic import BaseModel, Field
import aiohttp
import websockets
import numpy as np
import pandas as pd
from dataclasses import dataclass

logger = structlog.get_logger()

class AssetType(str, Enum):
    """Financial asset types"""
    EQUITY = "equity"
    BOND = "bond"
    CURRENCY = "currency"
    COMMODITY = "commodity"
    CRYPTO = "crypto"
    INDEX = "index"
    OPTION = "option"
    FUTURE = "future"
    SWAP = "swap"

class DataProvider(str, Enum):
    """Market data providers"""
    BLOOMBERG = "bloomberg"
    REFINITIV = "refinitiv"
    ALPHA_VANTAGE = "alpha_vantage"
    POLYGON = "polygon"
    YAHOO_FINANCE = "yahoo_finance"
    ECB = "ecb"  # European Central Bank
    FRED = "fred"  # Federal Reserve Economic Data
    IEX = "iex"
    QUANDL = "quandl"

class EconomicIndicator(str, Enum):
    """Economic indicators"""
    GDP_GROWTH = "gdp_growth"
    INFLATION_RATE = "inflation_rate"
    UNEMPLOYMENT_RATE = "unemployment_rate"
    INTEREST_RATE = "interest_rate"
    YIELD_CURVE = "yield_curve"
    VOLATILITY_INDEX = "volatility_index"
    CREDIT_SPREAD = "credit_spread"
    EXCHANGE_RATE = "exchange_rate"
    COMMODITY_PRICE = "commodity_price"

class MarketDataPoint(BaseModel):
    """Single market data point"""
    symbol: str
    asset_type: AssetType
    timestamp: datetime
    price: Decimal
    volume: Optional[Decimal] = None
    bid: Optional[Decimal] = None
    ask: Optional[Decimal] = None
    high: Optional[Decimal] = None
    low: Optional[Decimal] = None
    open: Optional[Decimal] = None
    close: Optional[Decimal] = None
    currency: str = "USD"
    provider: DataProvider
    metadata: Dict[str, Any] = Field(default_factory=dict)

class EconomicData(BaseModel):
    """Economic indicator data point"""
    indicator: EconomicIndicator
    country_code: str
    timestamp: datetime
    value: Decimal
    unit: str
    frequency: str  # daily, weekly, monthly, quarterly, annual
    provider: DataProvider
    source_url: Optional[str] = None
    revision_indicator: Optional[str] = None

class VolatilityData(BaseModel):
    """Volatility metrics"""
    symbol: str
    timestamp: datetime
    implied_volatility: Optional[Decimal] = None
    historical_volatility_30d: Optional[Decimal] = None
    historical_volatility_90d: Optional[Decimal] = None
    var_95: Optional[Decimal] = None
    var_99: Optional[Decimal] = None
    provider: DataProvider

class YieldCurveData(BaseModel):
    """Government bond yield curve"""
    country_code: str
    currency: str
    timestamp: datetime
    tenors: List[str]  # ["1M", "3M", "6M", "1Y", "2Y", "5Y", "10Y", "30Y"]
    yields: List[Decimal]
    provider: DataProvider

class MarketDataConfig(BaseModel):
    """Market data service configuration"""
    providers: Dict[DataProvider, Dict[str, str]] = Field(default_factory=dict)
    update_intervals: Dict[AssetType, int] = Field(default_factory=dict)  # seconds
    cache_ttl: int = Field(300, description="Cache TTL in seconds")
    max_retries: int = Field(3, description="Max API retries")
    timeout: int = Field(30, description="Request timeout in seconds")

class MarketDataService:
    """
    Comprehensive market data integration service
    Provides real-time and historical market data from multiple providers
    """
    
    def __init__(self, config: MarketDataConfig):
        self.config = config
        self.session: Optional[aiohttp.ClientSession] = None
        self.cache: Dict[str, Any] = {}
        self.active_subscriptions: Dict[str, asyncio.Task] = {}
        self.websocket_connections: Dict[DataProvider, Any] = {}
        
    async def initialize(self) -> bool:
        """Initialize market data service"""
        try:
            # Create HTTP session
            self.session = aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=self.config.timeout)
            )
            
            # Initialize provider connections
            await self._initialize_providers()
            
            logger.info("Market data service initialized")
            return True
            
        except Exception as e:
            logger.error("Failed to initialize market data service", error=str(e))
            return False
    
    async def get_real_time_price(
        self,
        symbol: str,
        asset_type: AssetType,
        provider: DataProvider = DataProvider.ALPHA_VANTAGE
    ) -> Optional[MarketDataPoint]:
        """Get real-time price for a symbol"""
        try:
            cache_key = f"price_{provider.value}_{symbol}"
            
            # Check cache first
            if cache_key in self.cache:
                cached_data = self.cache[cache_key]
                if datetime.utcnow() - cached_data['timestamp'] < timedelta(seconds=self.config.cache_ttl):
                    return MarketDataPoint(**cached_data['data'])
            
            # Fetch from provider
            price_data = await self._fetch_price_data(symbol, asset_type, provider)
            
            if price_data:
                # Cache the result
                self.cache[cache_key] = {
                    'timestamp': datetime.utcnow(),
                    'data': price_data.dict()
                }
                
                return price_data
            
            return None
            
        except Exception as e:
            logger.error("Failed to get real-time price", 
                        symbol=symbol,
                        provider=provider.value,
                        error=str(e))
            return None
    
    async def get_historical_prices(
        self,
        symbol: str,
        asset_type: AssetType,
        start_date: datetime,
        end_date: datetime,
        interval: str = "1day",
        provider: DataProvider = DataProvider.ALPHA_VANTAGE
    ) -> List[MarketDataPoint]:
        """Get historical price data"""
        try:
            if provider == DataProvider.ALPHA_VANTAGE:
                return await self._fetch_alpha_vantage_historical(
                    symbol, asset_type, start_date, end_date, interval
                )
            elif provider == DataProvider.YAHOO_FINANCE:
                return await self._fetch_yahoo_historical(
                    symbol, asset_type, start_date, end_date, interval
                )
            elif provider == DataProvider.POLYGON:
                return await self._fetch_polygon_historical(
                    symbol, asset_type, start_date, end_date, interval
                )
            else:
                logger.warning("Unsupported provider for historical data", provider=provider.value)
                return []
                
        except Exception as e:
            logger.error("Failed to get historical prices", 
                        symbol=symbol,
                        provider=provider.value,
                        error=str(e))
            return []
    
    async def get_economic_indicator(
        self,
        indicator: EconomicIndicator,
        country_code: str = "US",
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[EconomicData]:
        """Get economic indicator data"""
        try:
            if indicator in [EconomicIndicator.INTEREST_RATE, EconomicIndicator.GDP_GROWTH]:
                return await self._fetch_fred_data(indicator, country_code, start_date, end_date)
            elif country_code.startswith("EU") or country_code == "EUR":
                return await self._fetch_ecb_data(indicator, country_code, start_date, end_date)
            else:
                return await self._fetch_fred_data(indicator, country_code, start_date, end_date)
                
        except Exception as e:
            logger.error("Failed to get economic indicator", 
                        indicator=indicator.value,
                        country_code=country_code,
                        error=str(e))
            return []
    
    async def get_yield_curve(
        self,
        country_code: str = "US",
        currency: str = "USD",
        date: Optional[datetime] = None
    ) -> Optional[YieldCurveData]:
        """Get government bond yield curve"""
        try:
            if country_code == "US":
                return await self._fetch_us_treasury_curve(date)
            elif country_code.startswith("EU") or currency == "EUR":
                return await self._fetch_eu_yield_curve(date)
            elif country_code == "DE":
                return await self._fetch_german_bund_curve(date)
            else:
                logger.warning("Unsupported country for yield curve", country_code=country_code)
                return None
                
        except Exception as e:
            logger.error("Failed to get yield curve", 
                        country_code=country_code,
                        error=str(e))
            return None
    
    async def get_volatility_data(
        self,
        symbol: str,
        asset_type: AssetType = AssetType.EQUITY
    ) -> Optional[VolatilityData]:
        """Get volatility metrics for a symbol"""
        try:
            # Calculate historical volatility
            historical_prices = await self.get_historical_prices(
                symbol=symbol,
                asset_type=asset_type,
                start_date=datetime.utcnow() - timedelta(days=100),
                end_date=datetime.utcnow()
            )
            
            if len(historical_prices) < 30:
                logger.warning("Insufficient data for volatility calculation", symbol=symbol)
                return None
            
            # Calculate returns
            returns = []
            for i in range(1, len(historical_prices)):
                prev_price = float(historical_prices[i-1].price)
                curr_price = float(historical_prices[i].price)
                if prev_price > 0:
                    return_val = (curr_price - prev_price) / prev_price
                    returns.append(return_val)
            
            if not returns:
                return None
            
            returns_array = np.array(returns)
            
            # Calculate volatilities (annualized)
            vol_30d = np.std(returns_array[-30:]) * np.sqrt(252) if len(returns) >= 30 else None
            vol_90d = np.std(returns_array[-90:]) * np.sqrt(252) if len(returns) >= 90 else None
            
            # Calculate VaR
            var_95 = np.percentile(returns_array, 5) if returns_array.size > 0 else None
            var_99 = np.percentile(returns_array, 1) if returns_array.size > 0 else None
            
            return VolatilityData(
                symbol=symbol,
                timestamp=datetime.utcnow(),
                historical_volatility_30d=Decimal(str(vol_30d)) if vol_30d else None,
                historical_volatility_90d=Decimal(str(vol_90d)) if vol_90d else None,
                var_95=Decimal(str(var_95)) if var_95 else None,
                var_99=Decimal(str(var_99)) if var_99 else None,
                provider=DataProvider.ALPHA_VANTAGE
            )
            
        except Exception as e:
            logger.error("Failed to calculate volatility", 
                        symbol=symbol,
                        error=str(e))
            return None
    
    async def subscribe_real_time_feed(
        self,
        symbols: List[str],
        callback,
        provider: DataProvider = DataProvider.POLYGON
    ) -> str:
        """Subscribe to real-time market data feed"""
        try:
            subscription_id = f"sub_{provider.value}_{datetime.utcnow().timestamp()}"
            
            if provider == DataProvider.POLYGON:
                task = asyncio.create_task(
                    self._polygon_websocket_feed(symbols, callback)
                )
            elif provider == DataProvider.ALPHA_VANTAGE:
                task = asyncio.create_task(
                    self._alpha_vantage_websocket_feed(symbols, callback)
                )
            else:
                # Fallback to polling
                task = asyncio.create_task(
                    self._polling_feed(symbols, callback, provider)
                )
            
            self.active_subscriptions[subscription_id] = task
            
            logger.info("Real-time feed subscription created",
                       subscription_id=subscription_id,
                       symbols=symbols,
                       provider=provider.value)
            
            return subscription_id
            
        except Exception as e:
            logger.error("Failed to subscribe to real-time feed", 
                        symbols=symbols,
                        provider=provider.value,
                        error=str(e))
            raise
    
    async def unsubscribe_feed(self, subscription_id: str) -> bool:
        """Unsubscribe from real-time feed"""
        try:
            if subscription_id in self.active_subscriptions:
                task = self.active_subscriptions[subscription_id]
                task.cancel()
                del self.active_subscriptions[subscription_id]
                
                logger.info("Feed subscription cancelled", subscription_id=subscription_id)
                return True
            
            return False
            
        except Exception as e:
            logger.error("Failed to unsubscribe feed", 
                        subscription_id=subscription_id,
                        error=str(e))
            return False
    
    async def _initialize_providers(self) -> None:
        """Initialize provider-specific configurations"""
        # This would typically load API keys and configure providers
        logger.info("Initializing market data providers")
    
    async def _fetch_price_data(
        self,
        symbol: str,
        asset_type: AssetType,
        provider: DataProvider
    ) -> Optional[MarketDataPoint]:
        """Fetch price data from specific provider"""
        
        if provider == DataProvider.ALPHA_VANTAGE:
            return await self._fetch_alpha_vantage_price(symbol, asset_type)
        elif provider == DataProvider.YAHOO_FINANCE:
            return await self._fetch_yahoo_price(symbol, asset_type)
        elif provider == DataProvider.POLYGON:
            return await self._fetch_polygon_price(symbol, asset_type)
        else:
            logger.warning("Unsupported provider", provider=provider.value)
            return None
    
    async def _fetch_alpha_vantage_price(
        self,
        symbol: str,
        asset_type: AssetType
    ) -> Optional[MarketDataPoint]:
        """Fetch price from Alpha Vantage"""
        try:
            # This is a mock implementation - would use real API
            # For demonstration, return simulated data
            
            mock_price = Decimal("100.50") + Decimal(str(np.random.uniform(-5, 5)))
            
            return MarketDataPoint(
                symbol=symbol,
                asset_type=asset_type,
                timestamp=datetime.utcnow(),
                price=mock_price,
                volume=Decimal("1000000"),
                provider=DataProvider.ALPHA_VANTAGE,
                currency="USD"
            )
            
        except Exception as e:
            logger.error("Alpha Vantage API error", error=str(e))
            return None
    
    async def _fetch_yahoo_price(
        self,
        symbol: str,
        asset_type: AssetType
    ) -> Optional[MarketDataPoint]:
        """Fetch price from Yahoo Finance"""
        try:
            # Mock implementation
            mock_price = Decimal("95.75") + Decimal(str(np.random.uniform(-3, 3)))
            
            return MarketDataPoint(
                symbol=symbol,
                asset_type=asset_type,
                timestamp=datetime.utcnow(),
                price=mock_price,
                provider=DataProvider.YAHOO_FINANCE,
                currency="USD"
            )
            
        except Exception as e:
            logger.error("Yahoo Finance API error", error=str(e))
            return None
    
    async def _fetch_polygon_price(
        self,
        symbol: str,
        asset_type: AssetType
    ) -> Optional[MarketDataPoint]:
        """Fetch price from Polygon.io"""
        try:
            # Mock implementation
            mock_price = Decimal("102.25") + Decimal(str(np.random.uniform(-2, 2)))
            
            return MarketDataPoint(
                symbol=symbol,
                asset_type=asset_type,
                timestamp=datetime.utcnow(),
                price=mock_price,
                bid=mock_price - Decimal("0.05"),
                ask=mock_price + Decimal("0.05"),
                provider=DataProvider.POLYGON,
                currency="USD"
            )
            
        except Exception as e:
            logger.error("Polygon API error", error=str(e))
            return None
    
    async def _fetch_alpha_vantage_historical(
        self,
        symbol: str,
        asset_type: AssetType,
        start_date: datetime,
        end_date: datetime,
        interval: str
    ) -> List[MarketDataPoint]:
        """Fetch historical data from Alpha Vantage"""
        try:
            # Mock historical data generation
            data_points = []
            current_date = start_date
            base_price = Decimal("100.0")
            
            while current_date <= end_date:
                # Random walk simulation
                change = Decimal(str(np.random.uniform(-0.02, 0.02)))  # ±2% daily change
                base_price = base_price * (Decimal("1") + change)
                
                data_points.append(MarketDataPoint(
                    symbol=symbol,
                    asset_type=asset_type,
                    timestamp=current_date,
                    price=base_price,
                    open=base_price * Decimal("0.999"),
                    close=base_price,
                    high=base_price * Decimal("1.01"),
                    low=base_price * Decimal("0.99"),
                    volume=Decimal(str(np.random.uniform(500000, 2000000))),
                    provider=DataProvider.ALPHA_VANTAGE,
                    currency="USD"
                ))
                
                current_date += timedelta(days=1)
            
            return data_points
            
        except Exception as e:
            logger.error("Alpha Vantage historical data error", error=str(e))
            return []
    
    async def _fetch_yahoo_historical(
        self,
        symbol: str,
        asset_type: AssetType,
        start_date: datetime,
        end_date: datetime,
        interval: str
    ) -> List[MarketDataPoint]:
        """Fetch historical data from Yahoo Finance"""
        # Similar implementation to Alpha Vantage with different mock data
        return await self._fetch_alpha_vantage_historical(symbol, asset_type, start_date, end_date, interval)
    
    async def _fetch_polygon_historical(
        self,
        symbol: str,
        asset_type: AssetType,
        start_date: datetime,
        end_date: datetime,
        interval: str
    ) -> List[MarketDataPoint]:
        """Fetch historical data from Polygon"""
        # Similar implementation to Alpha Vantage with different mock data
        return await self._fetch_alpha_vantage_historical(symbol, asset_type, start_date, end_date, interval)
    
    async def _fetch_fred_data(
        self,
        indicator: EconomicIndicator,
        country_code: str,
        start_date: Optional[datetime],
        end_date: Optional[datetime]
    ) -> List[EconomicData]:
        """Fetch data from Federal Reserve Economic Data (FRED)"""
        try:
            # Mock economic data
            data_points = []
            
            # Generate monthly data for the past year if dates not specified
            if not start_date:
                start_date = datetime.utcnow() - timedelta(days=365)
            if not end_date:
                end_date = datetime.utcnow()
            
            current_date = start_date.replace(day=1)  # Start of month
            base_value = Decimal("2.5")  # Base interest rate
            
            while current_date <= end_date:
                # Small random variations
                variation = Decimal(str(np.random.uniform(-0.1, 0.1)))
                value = base_value + variation
                
                data_points.append(EconomicData(
                    indicator=indicator,
                    country_code=country_code,
                    timestamp=current_date,
                    value=value,
                    unit="percent",
                    frequency="monthly",
                    provider=DataProvider.FRED
                ))
                
                # Move to next month
                if current_date.month == 12:
                    current_date = current_date.replace(year=current_date.year + 1, month=1)
                else:
                    current_date = current_date.replace(month=current_date.month + 1)
            
            return data_points
            
        except Exception as e:
            logger.error("FRED API error", error=str(e))
            return []
    
    async def _fetch_ecb_data(
        self,
        indicator: EconomicIndicator,
        country_code: str,
        start_date: Optional[datetime],
        end_date: Optional[datetime]
    ) -> List[EconomicData]:
        """Fetch data from European Central Bank"""
        try:
            # Mock ECB data - similar to FRED but for EUR
            data_points = []
            
            if not start_date:
                start_date = datetime.utcnow() - timedelta(days=365)
            if not end_date:
                end_date = datetime.utcnow()
            
            current_date = start_date.replace(day=1)
            base_value = Decimal("0.5")  # ECB base rate
            
            while current_date <= end_date:
                variation = Decimal(str(np.random.uniform(-0.05, 0.05)))
                value = base_value + variation
                
                data_points.append(EconomicData(
                    indicator=indicator,
                    country_code=country_code,
                    timestamp=current_date,
                    value=value,
                    unit="percent",
                    frequency="monthly",
                    provider=DataProvider.ECB
                ))
                
                if current_date.month == 12:
                    current_date = current_date.replace(year=current_date.year + 1, month=1)
                else:
                    current_date = current_date.replace(month=current_date.month + 1)
            
            return data_points
            
        except Exception as e:
            logger.error("ECB API error", error=str(e))
            return []
    
    async def _fetch_us_treasury_curve(
        self,
        date: Optional[datetime] = None
    ) -> Optional[YieldCurveData]:
        """Fetch US Treasury yield curve"""
        try:
            if not date:
                date = datetime.utcnow()
            
            # Mock yield curve data
            tenors = ["1M", "3M", "6M", "1Y", "2Y", "5Y", "10Y", "30Y"]
            base_yields = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 2.5, 3.0]
            
            # Add small random variations
            yields = [Decimal(str(base + np.random.uniform(-0.1, 0.1))) for base in base_yields]
            
            return YieldCurveData(
                country_code="US",
                currency="USD",
                timestamp=date,
                tenors=tenors,
                yields=yields,
                provider=DataProvider.FRED
            )
            
        except Exception as e:
            logger.error("US Treasury curve error", error=str(e))
            return None
    
    async def _fetch_eu_yield_curve(
        self,
        date: Optional[datetime] = None
    ) -> Optional[YieldCurveData]:
        """Fetch EU government bond yield curve"""
        try:
            if not date:
                date = datetime.utcnow()
            
            # Mock EU yield curve (typically lower than US)
            tenors = ["1M", "3M", "6M", "1Y", "2Y", "5Y", "10Y", "30Y"]
            base_yields = [-0.5, -0.4, -0.3, -0.2, 0.0, 0.5, 1.0, 1.5]
            
            yields = [Decimal(str(base + np.random.uniform(-0.05, 0.05))) for base in base_yields]
            
            return YieldCurveData(
                country_code="EU",
                currency="EUR",
                timestamp=date,
                tenors=tenors,
                yields=yields,
                provider=DataProvider.ECB
            )
            
        except Exception as e:
            logger.error("EU yield curve error", error=str(e))
            return None
    
    async def _fetch_german_bund_curve(
        self,
        date: Optional[datetime] = None
    ) -> Optional[YieldCurveData]:
        """Fetch German Bund yield curve"""
        # Similar to EU curve but specific to German bonds
        return await self._fetch_eu_yield_curve(date)
    
    async def _polygon_websocket_feed(
        self,
        symbols: List[str],
        callback
    ) -> None:
        """Polygon.io WebSocket feed"""
        try:
            # Mock WebSocket feed with price updates every 5 seconds
            while True:
                for symbol in symbols:
                    price_data = await self._fetch_polygon_price(symbol, AssetType.EQUITY)
                    if price_data:
                        await callback(price_data)
                
                await asyncio.sleep(5)
                
        except asyncio.CancelledError:
            logger.info("Polygon WebSocket feed cancelled")
        except Exception as e:
            logger.error("Polygon WebSocket error", error=str(e))
    
    async def _alpha_vantage_websocket_feed(
        self,
        symbols: List[str],
        callback
    ) -> None:
        """Alpha Vantage WebSocket feed"""
        try:
            # Similar to Polygon but with different update frequency
            while True:
                for symbol in symbols:
                    price_data = await self._fetch_alpha_vantage_price(symbol, AssetType.EQUITY)
                    if price_data:
                        await callback(price_data)
                
                await asyncio.sleep(10)  # Less frequent updates
                
        except asyncio.CancelledError:
            logger.info("Alpha Vantage WebSocket feed cancelled")
        except Exception as e:
            logger.error("Alpha Vantage WebSocket error", error=str(e))
    
    async def _polling_feed(
        self,
        symbols: List[str],
        callback,
        provider: DataProvider
    ) -> None:
        """Fallback polling-based feed"""
        try:
            while True:
                for symbol in symbols:
                    price_data = await self.get_real_time_price(symbol, AssetType.EQUITY, provider)
                    if price_data:
                        await callback(price_data)
                
                await asyncio.sleep(30)  # Polling every 30 seconds
                
        except asyncio.CancelledError:
            logger.info("Polling feed cancelled")
        except Exception as e:
            logger.error("Polling feed error", error=str(e))
    
    async def close(self) -> None:
        """Close market data service and cleanup resources"""
        try:
            # Cancel all active subscriptions
            for subscription_id, task in self.active_subscriptions.items():
                task.cancel()
            
            # Close WebSocket connections
            for provider, connection in self.websocket_connections.items():
                if connection:
                    await connection.close()
            
            # Close HTTP session
            if self.session:
                await self.session.close()
            
            logger.info("Market data service closed")
            
        except Exception as e:
            logger.error("Error closing market data service", error=str(e))

# Factory function
async def create_market_data_service(
    providers_config: Optional[Dict[DataProvider, Dict[str, str]]] = None
) -> MarketDataService:
    """Create and initialize market data service"""
    
    config = MarketDataConfig()
    if providers_config:
        config.providers = providers_config
    
    service = MarketDataService(config)
    await service.initialize()
    return service

# Example usage
async def example_market_data_usage():
    """Example market data service usage"""
    
    # Initialize service
    service = await create_market_data_service()
    
    # Get real-time price
    price = await service.get_real_time_price("AAPL", AssetType.EQUITY)
    print(f"AAPL Price: {price}")
    
    # Get historical data
    historical = await service.get_historical_prices(
        "AAPL",
        AssetType.EQUITY,
        datetime.utcnow() - timedelta(days=30),
        datetime.utcnow()
    )
    print(f"Historical data points: {len(historical)}")
    
    # Get economic indicators
    fed_rates = await service.get_economic_indicator(
        EconomicIndicator.INTEREST_RATE,
        "US"
    )
    print(f"Fed rates data points: {len(fed_rates)}")
    
    # Get yield curve
    yield_curve = await service.get_yield_curve("US")
    print(f"US Yield Curve: {yield_curve}")
    
    # Get volatility
    volatility = await service.get_volatility_data("AAPL")
    print(f"AAPL Volatility: {volatility}")
    
    await service.close()

if __name__ == "__main__":
    asyncio.run(example_market_data_usage())