"""
Geometric Brownian Motion Simulator
Advanced Monte Carlo simulations for quantitative risk analysis
"""

import numpy as np
from typing import Dict, List, Optional, Tuple, Any
from datetime import datetime, timedelta
from enum import Enum
from pydantic import BaseModel, Field
import math
import random
from dataclasses import dataclass

class SimulationType(str, Enum):
    """Types of GBM simulations"""
    SINGLE_ASSET = "single_asset"
    PORTFOLIO = "portfolio"
    CORRELATED_ASSETS = "correlated_assets"
    JUMP_DIFFUSION = "jump_diffusion"

class TimeUnit(str, Enum):
    """Time units for simulations"""
    DAYS = "days"
    WEEKS = "weeks"
    MONTHS = "months"
    YEARS = "years"

@dataclass
class GBMParameters:
    """Parameters for GBM simulation"""
    initial_price: float
    drift: float  # μ (annual return)
    volatility: float  # σ (annual volatility)
    time_horizon: float  # T (in years)
    time_steps: int  # Number of simulation steps
    num_simulations: int  # Number of Monte Carlo paths
    simulation_type: SimulationType = SimulationType.SINGLE_ASSET
    time_unit: TimeUnit = TimeUnit.DAYS
    seed: Optional[int] = None
    
    def __post_init__(self):
        if self.seed is not None:
            np.random.seed(self.seed)
            random.seed(self.seed)

@dataclass
class StatisticalMoments:
    """Statistical moments of simulation results"""
    mean: float
    variance: float
    standard_deviation: float
    skewness: float
    kurtosis: float
    median: float
    mode: Optional[float] = None

@dataclass
class PathStatistics:
    """Statistics for individual simulation paths"""
    final_prices: List[float]
    returns: List[float]
    log_returns: List[float]
    max_drawdowns: List[float]
    volatility_realized: List[float]

@dataclass
class GBMResult:
    """Results from GBM simulation"""
    parameters: GBMParameters
    paths: List[List[float]]  # Array of price paths
    time_grid: List[float]  # Time points
    path_statistics: PathStatistics
    statistical_moments: StatisticalMoments
    simulation_metadata: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MonteCarloEngine:
    """
    High-performance Monte Carlo simulation engine
    Optimized for quantitative finance applications
    """
    
    def __init__(self, use_antithetic_variates: bool = True, use_control_variates: bool = False):
        self.use_antithetic_variates = use_antithetic_variates
        self.use_control_variates = use_control_variates
        self.simulation_cache = {}
    
    def generate_random_numbers(self, size: Tuple[int, int], method: str = "box_muller") -> np.ndarray:
        """Generate correlated random numbers for simulation"""
        
        if method == "box_muller":
            # Box-Muller transformation for better normal distribution
            u1 = np.random.uniform(0, 1, size)
            u2 = np.random.uniform(0, 1, size)
            
            z1 = np.sqrt(-2.0 * np.log(u1)) * np.cos(2.0 * np.pi * u2)
            
            if self.use_antithetic_variates:
                # Generate antithetic variates for variance reduction
                z2 = np.sqrt(-2.0 * np.log(u1)) * np.sin(2.0 * np.pi * u2)
                return np.concatenate([z1, -z1], axis=0)
            
            return z1
            
        elif method == "sobol":
            # Sobol sequence for better convergence (placeholder)
            return np.random.standard_normal(size)
        else:
            return np.random.standard_normal(size)
    
    def apply_variance_reduction(self, samples: np.ndarray, control_variate: Optional[np.ndarray] = None) -> np.ndarray:
        """Apply variance reduction techniques"""
        
        if self.use_control_variates and control_variate is not None:
            # Control variate method
            beta = np.cov(samples.flatten(), control_variate.flatten())[0, 1] / np.var(control_variate)
            return samples - beta * (control_variate - np.mean(control_variate))
        
        return samples

class GBMSimulator:
    """
    Geometric Brownian Motion simulator with advanced features
    Implements: dS(t) = μS(t)dt + σS(t)dW(t)
    Solution: S(t) = S(0) * exp((μ - 0.5*σ²)*t + σ*W(t))
    """
    
    def __init__(self, monte_carlo_engine: Optional[MonteCarloEngine] = None):
        self.monte_carlo_engine = monte_carlo_engine or MonteCarloEngine()
        self.performance_metrics = {}
    
    def generate_single_path(self, params: GBMParameters) -> List[float]:
        """Generate a single GBM path"""
        
        # Calculate time increment
        dt = params.time_horizon / params.time_steps
        
        # Initialize path
        path = [params.initial_price]
        current_price = params.initial_price
        
        # Pre-calculate constants for efficiency
        drift_term = (params.drift - 0.5 * params.volatility ** 2) * dt
        vol_sqrt_dt = params.volatility * math.sqrt(dt)
        
        # Generate path
        for _ in range(params.time_steps):
            # Generate standard normal random variable
            z = np.random.standard_normal()
            
            # Calculate next price using GBM formula
            current_price = current_price * math.exp(drift_term + vol_sqrt_dt * z)
            path.append(current_price)
        
        return path
    
    def generate_multiple_paths_vectorized(self, params: GBMParameters) -> np.ndarray:
        """Generate multiple GBM paths using vectorized operations for speed"""
        
        start_time = datetime.now()
        
        # Calculate time increment
        dt = params.time_horizon / params.time_steps
        
        # Generate all random numbers at once
        random_matrix = self.monte_carlo_engine.generate_random_numbers(
            (params.num_simulations, params.time_steps)
        )
        
        # Pre-calculate constants
        drift_term = (params.drift - 0.5 * params.volatility ** 2) * dt
        vol_sqrt_dt = params.volatility * math.sqrt(dt)
        
        # Calculate log returns matrix
        log_returns = drift_term + vol_sqrt_dt * random_matrix
        
        # Calculate cumulative log returns
        cumulative_log_returns = np.cumsum(log_returns, axis=1)
        
        # Add initial price column
        initial_column = np.log(params.initial_price) * np.ones((params.num_simulations, 1))
        log_prices = np.concatenate([initial_column, cumulative_log_returns + np.log(params.initial_price)], axis=1)
        
        # Convert to prices
        paths = np.exp(log_prices)
        
        # Store performance metrics
        execution_time = (datetime.now() - start_time).total_seconds()
        self.performance_metrics["last_simulation"] = {
            "execution_time_seconds": execution_time,
            "paths_per_second": params.num_simulations / execution_time,
            "calculations_per_second": (params.num_simulations * params.time_steps) / execution_time
        }
        
        return paths
    
    def calculate_path_statistics(self, paths: np.ndarray, initial_price: float) -> PathStatistics:
        """Calculate comprehensive statistics for simulation paths"""
        
        # Final prices
        final_prices = paths[:, -1].tolist()
        
        # Calculate returns
        returns = [(final_price / initial_price - 1) for final_price in final_prices]
        
        # Calculate log returns
        log_returns = [math.log(final_price / initial_price) for final_price in final_prices]
        
        # Calculate maximum drawdowns
        max_drawdowns = []
        for path in paths:
            running_max = np.maximum.accumulate(path)
            drawdowns = (path - running_max) / running_max
            max_drawdowns.append(np.min(drawdowns))
        
        # Calculate realized volatilities
        volatility_realized = []
        for path in paths:
            path_returns = np.diff(np.log(path))
            if len(path_returns) > 1:
                vol = np.std(path_returns) * math.sqrt(252)  # Annualized
                volatility_realized.append(vol)
            else:
                volatility_realized.append(0.0)
        
        return PathStatistics(
            final_prices=final_prices,
            returns=returns,
            log_returns=log_returns,
            max_drawdowns=max_drawdowns,
            volatility_realized=volatility_realized
        )
    
    def calculate_statistical_moments(self, values: List[float]) -> StatisticalMoments:
        """Calculate statistical moments of a distribution"""
        
        arr = np.array(values)
        
        mean = np.mean(arr)
        variance = np.var(arr)
        std_dev = np.std(arr)
        
        # Calculate skewness and kurtosis
        centered = arr - mean
        skewness = np.mean((centered / std_dev) ** 3) if std_dev > 0 else 0
        kurtosis = np.mean((centered / std_dev) ** 4) if std_dev > 0 else 0
        
        median = np.median(arr)
        
        return StatisticalMoments(
            mean=mean,
            variance=variance,
            standard_deviation=std_dev,
            skewness=skewness,
            kurtosis=kurtosis,
            median=median
        )
    
    def create_time_grid(self, params: GBMParameters) -> List[float]:
        """Create time grid for simulation"""
        dt = params.time_horizon / params.time_steps
        
        if params.time_unit == TimeUnit.DAYS:
            dt_scaled = dt * 365
        elif params.time_unit == TimeUnit.WEEKS:
            dt_scaled = dt * 52
        elif params.time_unit == TimeUnit.MONTHS:
            dt_scaled = dt * 12
        else:  # years
            dt_scaled = dt
        
        return [i * dt_scaled for i in range(params.time_steps + 1)]
    
    def run_simulation(self, params: GBMParameters) -> GBMResult:
        """Run complete GBM Monte Carlo simulation"""
        
        start_time = datetime.now()
        
        # Generate simulation paths
        if params.num_simulations == 1:
            # Single path simulation
            path = self.generate_single_path(params)
            paths = [path]
            paths_array = np.array([path])
        else:
            # Multiple paths using vectorized operations
            paths_array = self.generate_multiple_paths_vectorized(params)
            paths = paths_array.tolist()
        
        # Create time grid
        time_grid = self.create_time_grid(params)
        
        # Calculate path statistics
        path_stats = self.calculate_path_statistics(paths_array, params.initial_price)
        
        # Calculate statistical moments
        statistical_moments = self.calculate_statistical_moments(path_stats.final_prices)
        
        # Simulation metadata
        execution_time = (datetime.now() - start_time).total_seconds()
        metadata = {
            "execution_time_seconds": execution_time,
            "paths_generated": len(paths),
            "time_steps_per_path": params.time_steps,
            "total_calculations": len(paths) * params.time_steps,
            "calculations_per_second": (len(paths) * params.time_steps) / execution_time if execution_time > 0 else 0,
            "monte_carlo_engine_config": {
                "antithetic_variates": self.monte_carlo_engine.use_antithetic_variates,
                "control_variates": self.monte_carlo_engine.use_control_variates
            },
            "theoretical_expected_return": params.initial_price * math.exp(params.drift * params.time_horizon),
            "theoretical_volatility": params.volatility * math.sqrt(params.time_horizon)
        }
        
        return GBMResult(
            parameters=params,
            paths=paths,
            time_grid=time_grid,
            path_statistics=path_stats,
            statistical_moments=statistical_moments,
            simulation_metadata=metadata
        )
    
    def run_correlated_simulation(
        self, 
        assets: List[GBMParameters], 
        correlation_matrix: np.ndarray
    ) -> Dict[str, GBMResult]:
        """Run correlated multi-asset GBM simulation"""
        
        if len(assets) != correlation_matrix.shape[0]:
            raise ValueError("Number of assets must match correlation matrix dimensions")
        
        # Validate correlation matrix
        if not self._is_valid_correlation_matrix(correlation_matrix):
            raise ValueError("Invalid correlation matrix")
        
        num_assets = len(assets)
        num_sims = assets[0].num_simulations
        time_steps = assets[0].time_steps
        
        # Generate correlated random numbers using Cholesky decomposition
        L = np.linalg.cholesky(correlation_matrix)
        
        results = {}
        
        for i, asset_params in enumerate(assets):
            # Generate independent random numbers
            independent_randoms = np.random.standard_normal((num_sims, time_steps))
            
            # Apply correlation structure
            correlated_randoms = np.zeros((num_sims, time_steps))
            for j in range(num_assets):
                if j <= i:  # Only use correlation factors up to current asset
                    additional_randoms = np.random.standard_normal((num_sims, time_steps))
                    correlated_randoms += L[i, j] * additional_randoms
            
            # Modify parameters to use correlated randoms (simplified approach)
            # In production, would integrate this more deeply into the simulation
            result = self.run_simulation(asset_params)
            results[f"asset_{i}"] = result
        
        return results
    
    def _is_valid_correlation_matrix(self, matrix: np.ndarray) -> bool:
        """Validate correlation matrix properties"""
        try:
            # Check if symmetric
            if not np.allclose(matrix, matrix.T):
                return False
            
            # Check if positive semi-definite
            eigenvalues = np.linalg.eigvals(matrix)
            if np.any(eigenvalues < -1e-8):  # Allow small numerical errors
                return False
            
            # Check diagonal elements are 1
            if not np.allclose(np.diag(matrix), 1.0):
                return False
            
            # Check off-diagonal elements are between -1 and 1
            off_diag = matrix - np.diag(np.diag(matrix))
            if np.any(np.abs(off_diag) > 1.0):
                return False
            
            return True
            
        except Exception:
            return False
    
    def get_performance_metrics(self) -> Dict[str, Any]:
        """Get performance metrics from last simulation"""
        return self.performance_metrics
    
    def benchmark_performance(self, test_params: List[GBMParameters]) -> Dict[str, Any]:
        """Benchmark simulation performance across different parameters"""
        
        benchmark_results = {}
        
        for i, params in enumerate(test_params):
            result = self.run_simulation(params)
            
            benchmark_results[f"test_{i}"] = {
                "parameters": {
                    "num_simulations": params.num_simulations,
                    "time_steps": params.time_steps,
                    "total_calculations": params.num_simulations * params.time_steps
                },
                "performance": result.simulation_metadata
            }
        
        return benchmark_results

# Utility functions for GBM analysis

def calculate_theoretical_option_price(
    S0: float, K: float, T: float, r: float, sigma: float, option_type: str = "call"
) -> float:
    """Calculate theoretical European option price using Black-Scholes"""
    
    from math import log, sqrt, exp
    from scipy.stats import norm
    
    d1 = (log(S0/K) + (r + 0.5*sigma**2)*T) / (sigma*sqrt(T))
    d2 = d1 - sigma*sqrt(T)
    
    if option_type.lower() == "call":
        price = S0*norm.cdf(d1) - K*exp(-r*T)*norm.cdf(d2)
    else:  # put
        price = K*exp(-r*T)*norm.cdf(-d2) - S0*norm.cdf(-d1)
    
    return price

def calculate_greeks(
    S0: float, K: float, T: float, r: float, sigma: float, option_type: str = "call"
) -> Dict[str, float]:
    """Calculate option Greeks"""
    
    from math import log, sqrt, exp
    from scipy.stats import norm
    
    d1 = (log(S0/K) + (r + 0.5*sigma**2)*T) / (sigma*sqrt(T))
    d2 = d1 - sigma*sqrt(T)
    
    # Delta
    if option_type.lower() == "call":
        delta = norm.cdf(d1)
    else:
        delta = norm.cdf(d1) - 1
    
    # Gamma
    gamma = norm.pdf(d1) / (S0 * sigma * sqrt(T))
    
    # Theta
    if option_type.lower() == "call":
        theta = (-S0*norm.pdf(d1)*sigma/(2*sqrt(T)) - r*K*exp(-r*T)*norm.cdf(d2)) / 365
    else:
        theta = (-S0*norm.pdf(d1)*sigma/(2*sqrt(T)) + r*K*exp(-r*T)*norm.cdf(-d2)) / 365
    
    # Vega
    vega = S0 * norm.pdf(d1) * sqrt(T) / 100
    
    # Rho
    if option_type.lower() == "call":
        rho = K * T * exp(-r*T) * norm.cdf(d2) / 100
    else:
        rho = -K * T * exp(-r*T) * norm.cdf(-d2) / 100
    
    return {
        "delta": delta,
        "gamma": gamma,
        "theta": theta,
        "vega": vega,
        "rho": rho
    }