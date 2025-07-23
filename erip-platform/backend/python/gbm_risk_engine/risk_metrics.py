"""
Risk Metrics Calculator
Advanced risk metrics including VaR, Expected Shortfall, and portfolio risk measures
"""

import numpy as np
from typing import Dict, List, Optional, Tuple, Any, Union
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field
from dataclasses import dataclass
import math
from scipy import stats
from scipy.optimize import minimize

class ConfidenceLevel(float, Enum):
    """Standard confidence levels for risk metrics"""
    CONFIDENCE_90 = 0.90
    CONFIDENCE_95 = 0.95
    CONFIDENCE_99 = 0.99
    CONFIDENCE_999 = 0.999

class RiskMeasure(str, Enum):
    """Types of risk measures"""
    VALUE_AT_RISK = "value_at_risk"
    EXPECTED_SHORTFALL = "expected_shortfall"
    MAXIMUM_DRAWDOWN = "maximum_drawdown"
    VOLATILITY = "volatility"
    SHARPE_RATIO = "sharpe_ratio"
    SORTINO_RATIO = "sortino_ratio"
    CALMAR_RATIO = "calmar_ratio"

@dataclass
class RiskMetrics:
    """Individual risk metrics calculation result"""
    var_95: float  # Value at Risk at 95% confidence
    var_99: float  # Value at Risk at 99% confidence
    expected_shortfall_95: float  # Expected Shortfall (Conditional VaR) at 95%
    expected_shortfall_99: float  # Expected Shortfall at 99%
    maximum_drawdown: float
    volatility: float
    sharpe_ratio: float
    sortino_ratio: float
    calmar_ratio: float
    skewness: float
    kurtosis: float
    probability_of_loss: float
    expected_return: float
    downside_deviation: float
    upside_capture: float
    downside_capture: float
    tail_risk: float
    risk_adjusted_return: float

@dataclass 
class PortfolioRiskMetrics:
    """Portfolio-level risk metrics"""
    portfolio_var_95: float
    portfolio_var_99: float
    portfolio_expected_shortfall: float
    marginal_var: Dict[str, float]  # Marginal VaR by asset
    component_var: Dict[str, float]  # Component VaR by asset
    diversification_ratio: float
    concentration_risk: float
    correlation_risk: float
    liquidity_risk: float
    portfolio_beta: float
    tracking_error: float
    information_ratio: float
    portfolio_volatility: float

class VaRCalculator:
    """
    Value at Risk calculator with multiple methodologies
    Supports historical, parametric, and Monte Carlo methods
    """
    
    def __init__(self):
        self.calculation_cache = {}
    
    def historical_var(
        self, 
        returns: List[float], 
        confidence_level: float = 0.95,
        window: Optional[int] = None
    ) -> float:
        """Calculate VaR using historical simulation method"""
        
        if not returns:
            return 0.0
        
        # Use specified window or all data
        if window and len(returns) > window:
            returns = returns[-window:]
        
        returns_array = np.array(returns)
        
        # Calculate percentile
        percentile = (1 - confidence_level) * 100
        var = np.percentile(returns_array, percentile)
        
        return abs(var)
    
    def parametric_var(
        self,
        mean_return: float,
        volatility: float,
        confidence_level: float = 0.95,
        time_horizon: float = 1.0,
        distribution: str = "normal"
    ) -> float:
        """Calculate VaR using parametric method"""
        
        # Scale to time horizon
        horizon_mean = mean_return * time_horizon
        horizon_vol = volatility * math.sqrt(time_horizon)
        
        if distribution == "normal":
            # Normal distribution VaR
            z_score = stats.norm.ppf(1 - confidence_level)
            var = -(horizon_mean + z_score * horizon_vol)
            
        elif distribution == "t":
            # t-distribution VaR (more conservative for fat tails)
            df = 6  # degrees of freedom
            t_score = stats.t.ppf(1 - confidence_level, df)
            var = -(horizon_mean + t_score * horizon_vol)
            
        elif distribution == "skewed_t":
            # Skewed t-distribution (placeholder - would use skew parameter)
            t_score = stats.t.ppf(1 - confidence_level, 6)
            var = -(horizon_mean + t_score * horizon_vol * 1.1)  # Simplified skew adjustment
            
        else:
            raise ValueError(f"Unsupported distribution: {distribution}")
        
        return abs(var)
    
    def monte_carlo_var(
        self,
        simulated_returns: List[float],
        confidence_level: float = 0.95
    ) -> float:
        """Calculate VaR from Monte Carlo simulation results"""
        
        if not simulated_returns:
            return 0.0
        
        returns_array = np.array(simulated_returns)
        percentile = (1 - confidence_level) * 100
        var = np.percentile(returns_array, percentile)
        
        return abs(var)
    
    def expected_shortfall(
        self,
        returns: List[float],
        confidence_level: float = 0.95,
        method: str = "historical"
    ) -> float:
        """Calculate Expected Shortfall (Conditional VaR)"""
        
        if not returns:
            return 0.0
        
        returns_array = np.array(returns)
        
        if method == "historical":
            # Historical method
            var = self.historical_var(returns, confidence_level)
            tail_returns = returns_array[returns_array <= -var]
            
            if len(tail_returns) > 0:
                es = np.mean(tail_returns)
                return abs(es)
            else:
                return var
        
        elif method == "parametric":
            # Parametric method assuming normal distribution
            mean_return = np.mean(returns_array)
            volatility = np.std(returns_array)
            
            z_score = stats.norm.ppf(1 - confidence_level)
            es = -(mean_return - volatility * stats.norm.pdf(z_score) / (1 - confidence_level))
            
            return abs(es)
        
        else:
            raise ValueError(f"Unsupported method: {method}")

class RiskMetricsCalculator:
    """
    Comprehensive risk metrics calculator
    Calculates various risk measures for individual assets and portfolios
    """
    
    def __init__(self, risk_free_rate: float = 0.02):
        self.risk_free_rate = risk_free_rate
        self.var_calculator = VaRCalculator()
    
    def calculate_comprehensive_metrics(
        self,
        returns: List[float],
        initial_value: float = 100,
        benchmark_returns: Optional[List[float]] = None
    ) -> RiskMetrics:
        """Calculate comprehensive risk metrics for a return series"""
        
        if not returns:
            raise ValueError("Returns list cannot be empty")
        
        returns_array = np.array(returns)
        
        # Basic statistics
        mean_return = np.mean(returns_array)
        volatility = np.std(returns_array)
        skewness = stats.skew(returns_array)
        kurtosis = stats.kurtosis(returns_array)
        
        # Risk metrics
        var_95 = self.var_calculator.historical_var(returns, 0.95)
        var_99 = self.var_calculator.historical_var(returns, 0.99)
        
        es_95 = self.var_calculator.expected_shortfall(returns, 0.95)
        es_99 = self.var_calculator.expected_shortfall(returns, 0.99)
        
        # Drawdown analysis
        cumulative_returns = np.cumprod(1 + returns_array)
        running_max = np.maximum.accumulate(cumulative_returns)
        drawdowns = (cumulative_returns - running_max) / running_max
        max_drawdown = abs(np.min(drawdowns))
        
        # Performance ratios
        excess_return = mean_return - self.risk_free_rate
        sharpe_ratio = excess_return / volatility if volatility > 0 else 0
        
        # Sortino ratio (using downside deviation)
        negative_returns = returns_array[returns_array < 0]
        downside_deviation = np.std(negative_returns) if len(negative_returns) > 0 else 0
        sortino_ratio = excess_return / downside_deviation if downside_deviation > 0 else 0
        
        # Calmar ratio
        calmar_ratio = mean_return / max_drawdown if max_drawdown > 0 else 0
        
        # Additional metrics
        probability_of_loss = len(negative_returns) / len(returns_array)
        expected_return = mean_return
        
        # Upside/downside capture (if benchmark provided)
        upside_capture = 1.0
        downside_capture = 1.0
        
        if benchmark_returns and len(benchmark_returns) == len(returns):
            benchmark_array = np.array(benchmark_returns)
            
            # Upside capture
            up_periods = benchmark_array > 0
            if np.any(up_periods):
                upside_capture = np.mean(returns_array[up_periods]) / np.mean(benchmark_array[up_periods])
            
            # Downside capture  
            down_periods = benchmark_array < 0
            if np.any(down_periods):
                downside_capture = np.mean(returns_array[down_periods]) / np.mean(benchmark_array[down_periods])
        
        # Tail risk (average of worst 5% returns)
        worst_returns = np.sort(returns_array)[:max(1, int(len(returns_array) * 0.05))]
        tail_risk = abs(np.mean(worst_returns))
        
        # Risk-adjusted return
        risk_adjusted_return = mean_return / volatility if volatility > 0 else 0
        
        return RiskMetrics(
            var_95=var_95,
            var_99=var_99,
            expected_shortfall_95=es_95,
            expected_shortfall_99=es_99,
            maximum_drawdown=max_drawdown,
            volatility=volatility,
            sharpe_ratio=sharpe_ratio,
            sortino_ratio=sortino_ratio,
            calmar_ratio=calmar_ratio,
            skewness=skewness,
            kurtosis=kurtosis,
            probability_of_loss=probability_of_loss,
            expected_return=expected_return,
            downside_deviation=downside_deviation,
            upside_capture=upside_capture,
            downside_capture=downside_capture,
            tail_risk=tail_risk,
            risk_adjusted_return=risk_adjusted_return
        )
    
    def calculate_portfolio_risk_metrics(
        self,
        asset_returns: Dict[str, List[float]],
        weights: Dict[str, float],
        correlation_matrix: Optional[np.ndarray] = None
    ) -> PortfolioRiskMetrics:
        """Calculate portfolio-level risk metrics"""
        
        # Validate inputs
        if not asset_returns or not weights:
            raise ValueError("Asset returns and weights are required")
        
        if set(asset_returns.keys()) != set(weights.keys()):
            raise ValueError("Asset returns and weights must have same keys")
        
        # Calculate portfolio returns
        portfolio_returns = self._calculate_portfolio_returns(asset_returns, weights)
        
        # Basic portfolio metrics
        portfolio_var_95 = self.var_calculator.historical_var(portfolio_returns, 0.95)
        portfolio_var_99 = self.var_calculator.historical_var(portfolio_returns, 0.99)
        portfolio_es = self.var_calculator.expected_shortfall(portfolio_returns, 0.95)
        
        portfolio_volatility = np.std(portfolio_returns)
        
        # Marginal and Component VaR
        marginal_var = {}
        component_var = {}
        
        for asset in asset_returns.keys():
            # Calculate marginal VaR (simplified approach)
            marginal_var[asset] = self._calculate_marginal_var(
                asset, asset_returns, weights, portfolio_returns
            )
            
            # Component VaR = Marginal VaR * Weight * Portfolio Value
            component_var[asset] = marginal_var[asset] * weights[asset] * 100  # Assuming $100 portfolio
        
        # Diversification ratio
        individual_volatilities = [np.std(asset_returns[asset]) for asset in asset_returns.keys()]
        weighted_avg_vol = sum(weights[asset] * individual_volatilities[i] 
                              for i, asset in enumerate(asset_returns.keys()))
        diversification_ratio = weighted_avg_vol / portfolio_volatility if portfolio_volatility > 0 else 1.0
        
        # Concentration risk (Herfindahl index)
        concentration_risk = sum(w**2 for w in weights.values())
        
        # Correlation risk (average correlation)
        if correlation_matrix is not None:
            off_diagonal = correlation_matrix[~np.eye(correlation_matrix.shape[0], dtype=bool)]
            correlation_risk = np.mean(np.abs(off_diagonal))
        else:
            correlation_risk = self._estimate_average_correlation(asset_returns)
        
        # Placeholder values for other metrics
        liquidity_risk = 0.1  # Would be calculated based on bid-ask spreads, volume, etc.
        portfolio_beta = 1.0  # Would be calculated against market benchmark
        tracking_error = 0.02  # Would be calculated against benchmark
        information_ratio = 0.5  # Would be calculated as excess return / tracking error
        
        return PortfolioRiskMetrics(
            portfolio_var_95=portfolio_var_95,
            portfolio_var_99=portfolio_var_99,
            portfolio_expected_shortfall=portfolio_es,
            marginal_var=marginal_var,
            component_var=component_var,
            diversification_ratio=diversification_ratio,
            concentration_risk=concentration_risk,
            correlation_risk=correlation_risk,
            liquidity_risk=liquidity_risk,
            portfolio_beta=portfolio_beta,
            tracking_error=tracking_error,
            information_ratio=information_ratio,
            portfolio_volatility=portfolio_volatility
        )
    
    def _calculate_portfolio_returns(
        self, 
        asset_returns: Dict[str, List[float]], 
        weights: Dict[str, float]
    ) -> List[float]:
        """Calculate portfolio returns from asset returns and weights"""
        
        # Convert to arrays
        assets = list(asset_returns.keys())
        returns_matrix = np.array([asset_returns[asset] for asset in assets]).T
        weights_array = np.array([weights[asset] for asset in assets])
        
        # Calculate portfolio returns
        portfolio_returns = np.dot(returns_matrix, weights_array)
        
        return portfolio_returns.tolist()
    
    def _calculate_marginal_var(
        self,
        asset: str,
        asset_returns: Dict[str, List[float]],
        weights: Dict[str, float],
        portfolio_returns: List[float]
    ) -> float:
        """Calculate marginal VaR for an asset (simplified approach)"""
        
        # Calculate correlation between asset and portfolio
        asset_ret = np.array(asset_returns[asset])
        portfolio_ret = np.array(portfolio_returns)
        
        if len(asset_ret) != len(portfolio_ret):
            return 0.0
        
        correlation = np.corrcoef(asset_ret, portfolio_ret)[0, 1]
        
        # Simplified marginal VaR calculation
        asset_volatility = np.std(asset_ret)
        portfolio_var = self.var_calculator.historical_var(portfolio_returns, 0.95)
        
        # Marginal VaR approximation
        marginal_var = correlation * asset_volatility * portfolio_var
        
        return marginal_var
    
    def _estimate_average_correlation(self, asset_returns: Dict[str, List[float]]) -> float:
        """Estimate average correlation between assets"""
        
        assets = list(asset_returns.keys())
        if len(assets) < 2:
            return 0.0
        
        correlations = []
        
        for i in range(len(assets)):
            for j in range(i + 1, len(assets)):
                ret_i = np.array(asset_returns[assets[i]])
                ret_j = np.array(asset_returns[assets[j]])
                
                if len(ret_i) == len(ret_j) and len(ret_i) > 1:
                    corr = np.corrcoef(ret_i, ret_j)[0, 1]
                    if not np.isnan(corr):
                        correlations.append(abs(corr))
        
        return np.mean(correlations) if correlations else 0.0
    
    def calculate_risk_attribution(
        self,
        portfolio_risk_metrics: PortfolioRiskMetrics,
        weights: Dict[str, float]
    ) -> Dict[str, Dict[str, float]]:
        """Calculate risk attribution analysis"""
        
        attribution = {}
        
        total_component_var = sum(portfolio_risk_metrics.component_var.values())
        
        for asset in weights.keys():
            component_var = portfolio_risk_metrics.component_var.get(asset, 0)
            marginal_var = portfolio_risk_metrics.marginal_var.get(asset, 0)
            
            attribution[asset] = {
                "weight": weights[asset],
                "component_var": component_var,
                "marginal_var": marginal_var,
                "var_contribution_pct": (component_var / total_component_var * 100) if total_component_var > 0 else 0,
                "risk_weight_ratio": (component_var / total_component_var) / weights[asset] if weights[asset] > 0 and total_component_var > 0 else 0
            }
        
        return attribution
    
    def stress_test_var(
        self,
        returns: List[float],
        stress_scenarios: List[Dict[str, float]],
        confidence_level: float = 0.95
    ) -> Dict[str, float]:
        """Calculate VaR under different stress scenarios"""
        
        base_var = self.var_calculator.historical_var(returns, confidence_level)
        stress_results = {"base_case": base_var}
        
        returns_array = np.array(returns)
        
        for i, scenario in enumerate(stress_scenarios):
            # Apply stress scenario (simplified approach)
            shocked_returns = returns_array.copy()
            
            if "volatility_multiplier" in scenario:
                mean_return = np.mean(returns_array)
                shocked_returns = mean_return + (shocked_returns - mean_return) * scenario["volatility_multiplier"]
            
            if "return_shift" in scenario:
                shocked_returns += scenario["return_shift"]
            
            stressed_var = self.var_calculator.historical_var(shocked_returns.tolist(), confidence_level)
            stress_results[f"scenario_{i+1}"] = stressed_var
        
        return stress_results

# Utility functions for risk analysis

def calculate_black_scholes_greeks(
    S: float, K: float, T: float, r: float, sigma: float, option_type: str = "call"
) -> Dict[str, float]:
    """Calculate Black-Scholes option Greeks for risk management"""
    
    from math import log, sqrt, exp
    from scipy.stats import norm
    
    d1 = (log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*sqrt(T))
    d2 = d1 - sigma*sqrt(T)
    
    greeks = {}
    
    # Delta
    if option_type.lower() == "call":
        greeks["delta"] = norm.cdf(d1)
    else:
        greeks["delta"] = norm.cdf(d1) - 1
    
    # Gamma
    greeks["gamma"] = norm.pdf(d1) / (S * sigma * sqrt(T))
    
    # Vega (per 1% change in volatility)
    greeks["vega"] = S * norm.pdf(d1) * sqrt(T) / 100
    
    # Theta (per day)
    if option_type.lower() == "call":
        greeks["theta"] = (-S*norm.pdf(d1)*sigma/(2*sqrt(T)) - r*K*exp(-r*T)*norm.cdf(d2)) / 365
    else:
        greeks["theta"] = (-S*norm.pdf(d1)*sigma/(2*sqrt(T)) + r*K*exp(-r*T)*norm.cdf(-d2)) / 365
    
    # Rho (per 1% change in interest rate)
    if option_type.lower() == "call":
        greeks["rho"] = K * T * exp(-r*T) * norm.cdf(d2) / 100
    else:
        greeks["rho"] = -K * T * exp(-r*T) * norm.cdf(-d2) / 100
    
    return greeks

def calculate_portfolio_beta(
    asset_returns: List[float],
    market_returns: List[float]
) -> float:
    """Calculate portfolio beta relative to market"""
    
    if len(asset_returns) != len(market_returns) or len(asset_returns) < 2:
        return 1.0
    
    covariance = np.cov(asset_returns, market_returns)[0, 1]
    market_variance = np.var(market_returns)
    
    beta = covariance / market_variance if market_variance > 0 else 1.0
    
    return beta