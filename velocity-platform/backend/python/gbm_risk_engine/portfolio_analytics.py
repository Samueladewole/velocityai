"""
Portfolio Analytics and Optimization
Advanced portfolio risk analytics with correlation analysis and optimization
"""

import numpy as np
from typing import Dict, List, Optional, Tuple, Any, Union
from datetime import datetime, timedelta
from enum import Enum
from pydantic import BaseModel, Field
from dataclasses import dataclass
import math
from scipy import stats, optimize
from scipy.linalg import sqrtm

from .gbm_simulator import GBMSimulator, GBMParameters, GBMResult
from .risk_metrics import RiskMetricsCalculator, PortfolioRiskMetrics

class OptimizationObjective(str, Enum):
    """Portfolio optimization objectives"""
    MAXIMIZE_SHARPE = "maximize_sharpe"
    MINIMIZE_VARIANCE = "minimize_variance"
    MAXIMIZE_RETURN = "maximize_return"
    MINIMIZE_VAR = "minimize_var"
    RISK_PARITY = "risk_parity"
    BLACK_LITTERMAN = "black_litterman"

class CorrelationModel(str, Enum):
    """Correlation modeling approaches"""
    HISTORICAL = "historical"
    EXPONENTIAL_WEIGHTED = "exponential_weighted"
    SHRINKAGE = "shrinkage"
    DCC_GARCH = "dcc_garch"
    FACTOR_MODEL = "factor_model"

@dataclass
class AssetParameters:
    """Parameters for individual asset in portfolio"""
    asset_id: str
    asset_name: str
    expected_return: float
    volatility: float
    current_weight: float
    min_weight: float = 0.0
    max_weight: float = 1.0
    sector: Optional[str] = None
    liquidity_score: float = 1.0  # 0-1 scale
    transaction_cost: float = 0.001  # Basis points

@dataclass
class CorrelationMatrix:
    """Correlation matrix with metadata"""
    matrix: np.ndarray
    asset_ids: List[str]
    estimation_method: CorrelationModel
    observation_period: int  # Number of periods used
    confidence_level: float
    eigenvalues: List[float]
    condition_number: float
    is_positive_definite: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)

@dataclass
class DiversificationMetrics:
    """Portfolio diversification analysis"""
    effective_number_assets: float
    diversification_ratio: float
    concentration_ratio: float  # Herfindahl index
    sector_concentration: Dict[str, float]
    risk_contribution: Dict[str, float]
    correlation_risk: float
    idiosyncratic_risk: float
    systematic_risk: float

@dataclass 
class OptimizationConstraints:
    """Portfolio optimization constraints"""
    min_weights: Dict[str, float] = Field(default_factory=dict)
    max_weights: Dict[str, float] = Field(default_factory=dict)
    sector_limits: Dict[str, Tuple[float, float]] = Field(default_factory=dict)
    turnover_limit: Optional[float] = None
    target_return: Optional[float] = None
    max_variance: Optional[float] = None
    max_var: Optional[float] = None
    min_liquidity: Optional[float] = None

@dataclass
class OptimizationResult:
    """Portfolio optimization result"""
    objective: OptimizationObjective
    optimal_weights: Dict[str, float]
    expected_return: float
    expected_volatility: float
    sharpe_ratio: float
    optimization_status: str
    objective_value: float
    turnover: float
    transaction_costs: float
    risk_metrics: PortfolioRiskMetrics
    constraints_summary: Dict[str, Any]
    sensitivity_analysis: Dict[str, float]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CorrelationEstimator:
    """
    Advanced correlation matrix estimation
    Handles different correlation models and regularization
    """
    
    def __init__(self):
        self.estimation_cache = {}
    
    def estimate_historical_correlation(
        self,
        returns_data: Dict[str, List[float]],
        window: Optional[int] = None
    ) -> CorrelationMatrix:
        """Estimate correlation matrix using historical returns"""
        
        if not returns_data:
            raise ValueError("Returns data is required")
        
        # Convert to matrix format
        asset_ids = list(returns_data.keys())
        returns_matrix = np.array([returns_data[asset_id] for asset_id in asset_ids]).T
        
        # Apply window if specified
        if window and returns_matrix.shape[0] > window:
            returns_matrix = returns_matrix[-window:, :]
        
        # Calculate correlation matrix
        correlation_matrix = np.corrcoef(returns_matrix.T)
        
        # Handle edge cases
        if np.any(np.isnan(correlation_matrix)):
            correlation_matrix = np.eye(len(asset_ids))
        
        # Calculate matrix properties
        eigenvalues = np.linalg.eigvals(correlation_matrix)
        condition_number = np.max(eigenvalues) / np.max([np.min(eigenvalues), 1e-10])
        is_positive_definite = np.all(eigenvalues > 0)
        
        return CorrelationMatrix(
            matrix=correlation_matrix,
            asset_ids=asset_ids,
            estimation_method=CorrelationModel.HISTORICAL,
            observation_period=returns_matrix.shape[0],
            confidence_level=0.95,
            eigenvalues=eigenvalues.tolist(),
            condition_number=condition_number,
            is_positive_definite=is_positive_definite
        )
    
    def estimate_exponential_weighted_correlation(
        self,
        returns_data: Dict[str, List[float]],
        decay_factor: float = 0.94
    ) -> CorrelationMatrix:
        """Estimate correlation using exponentially weighted moving average"""
        
        asset_ids = list(returns_data.keys())
        returns_matrix = np.array([returns_data[asset_id] for asset_id in asset_ids]).T
        
        n_assets = len(asset_ids)
        n_periods = returns_matrix.shape[0]
        
        # Initialize correlation matrix
        correlation_matrix = np.eye(n_assets)
        
        # Calculate exponentially weighted correlations
        weights = np.array([(1 - decay_factor) * decay_factor**(n_periods - 1 - t) for t in range(n_periods)])
        weights /= np.sum(weights)
        
        # Calculate weighted covariance matrix
        weighted_returns = returns_matrix * np.sqrt(weights).reshape(-1, 1)
        covariance_matrix = np.cov(weighted_returns.T)
        
        # Convert to correlation matrix
        std_devs = np.sqrt(np.diag(covariance_matrix))
        for i in range(n_assets):
            for j in range(n_assets):
                if std_devs[i] > 0 and std_devs[j] > 0:
                    correlation_matrix[i, j] = covariance_matrix[i, j] / (std_devs[i] * std_devs[j])
        
        eigenvalues = np.linalg.eigvals(correlation_matrix)
        
        return CorrelationMatrix(
            matrix=correlation_matrix,
            asset_ids=asset_ids,
            estimation_method=CorrelationModel.EXPONENTIAL_WEIGHTED,
            observation_period=n_periods,
            confidence_level=0.95,
            eigenvalues=eigenvalues.tolist(),
            condition_number=np.max(eigenvalues) / np.max([np.min(eigenvalues), 1e-10]),
            is_positive_definite=np.all(eigenvalues > 0)
        )
    
    def shrinkage_estimation(
        self,
        returns_data: Dict[str, List[float]],
        shrinkage_target: str = "identity"
    ) -> CorrelationMatrix:
        """Ledoit-Wolf shrinkage estimation for correlation matrix"""
        
        asset_ids = list(returns_data.keys())
        returns_matrix = np.array([returns_data[asset_id] for asset_id in asset_ids]).T
        
        # Calculate sample correlation matrix
        sample_corr = np.corrcoef(returns_matrix.T)
        
        # Define shrinkage target
        n_assets = len(asset_ids)
        if shrinkage_target == "identity":
            target = np.eye(n_assets)
        elif shrinkage_target == "constant":
            avg_corr = np.mean(sample_corr[~np.eye(n_assets, dtype=bool)])
            target = np.full((n_assets, n_assets), avg_corr)
            np.fill_diagonal(target, 1.0)
        else:
            target = np.eye(n_assets)
        
        # Estimate optimal shrinkage intensity (simplified)
        n_periods = returns_matrix.shape[0]
        shrinkage_intensity = min(1.0, (n_assets + 1) / n_periods)
        
        # Apply shrinkage
        shrunk_corr = (1 - shrinkage_intensity) * sample_corr + shrinkage_intensity * target
        
        eigenvalues = np.linalg.eigvals(shrunk_corr)
        
        return CorrelationMatrix(
            matrix=shrunk_corr,
            asset_ids=asset_ids,
            estimation_method=CorrelationModel.SHRINKAGE,
            observation_period=n_periods,
            confidence_level=0.95,
            eigenvalues=eigenvalues.tolist(),
            condition_number=np.max(eigenvalues) / np.max([np.min(eigenvalues), 1e-10]),
            is_positive_definite=np.all(eigenvalues > 0)
        )

class PortfolioAnalyzer:
    """
    Advanced portfolio analytics and risk decomposition
    """
    
    def __init__(self, risk_calculator: Optional[RiskMetricsCalculator] = None):
        self.risk_calculator = risk_calculator or RiskMetricsCalculator()
        self.correlation_estimator = CorrelationEstimator()
    
    def calculate_diversification_metrics(
        self,
        weights: Dict[str, float],
        correlation_matrix: CorrelationMatrix,
        volatilities: Dict[str, float],
        sectors: Optional[Dict[str, str]] = None
    ) -> DiversificationMetrics:
        """Calculate comprehensive diversification metrics"""
        
        asset_ids = correlation_matrix.asset_ids
        weights_array = np.array([weights.get(asset_id, 0) for asset_id in asset_ids])
        vol_array = np.array([volatilities.get(asset_id, 0) for asset_id in asset_ids])
        
        # Effective number of assets (inverse Herfindahl index)
        effective_n_assets = 1 / np.sum(weights_array ** 2)
        
        # Portfolio volatility
        portfolio_variance = np.dot(weights_array, np.dot(correlation_matrix.matrix * np.outer(vol_array, vol_array), weights_array))
        portfolio_vol = np.sqrt(portfolio_variance)
        
        # Diversification ratio
        weighted_avg_vol = np.sum(weights_array * vol_array)
        diversification_ratio = weighted_avg_vol / portfolio_vol if portfolio_vol > 0 else 1.0
        
        # Concentration ratio (Herfindahl index)
        concentration_ratio = np.sum(weights_array ** 2)
        
        # Sector concentration
        sector_concentration = {}
        if sectors:
            sector_weights = {}
            for asset_id, weight in weights.items():
                sector = sectors.get(asset_id, "Other")
                sector_weights[sector] = sector_weights.get(sector, 0) + weight
            sector_concentration = sector_weights
        
        # Risk contribution analysis
        marginal_contributions = np.dot(correlation_matrix.matrix * np.outer(vol_array, vol_array), weights_array)
        risk_contributions = weights_array * marginal_contributions / portfolio_variance if portfolio_variance > 0 else weights_array
        
        risk_contribution = {}
        for i, asset_id in enumerate(asset_ids):
            risk_contribution[asset_id] = risk_contributions[i]
        
        # Correlation risk (average absolute correlation)
        off_diagonal = correlation_matrix.matrix[~np.eye(correlation_matrix.matrix.shape[0], dtype=bool)]
        correlation_risk = np.mean(np.abs(off_diagonal))
        
        # Systematic vs idiosyncratic risk (simplified)
        systematic_risk = correlation_risk * portfolio_vol
        idiosyncratic_risk = portfolio_vol - systematic_risk
        
        return DiversificationMetrics(
            effective_number_assets=effective_n_assets,
            diversification_ratio=diversification_ratio,
            concentration_ratio=concentration_ratio,
            sector_concentration=sector_concentration,
            risk_contribution=risk_contribution,
            correlation_risk=correlation_risk,
            idiosyncratic_risk=max(0, idiosyncratic_risk),
            systematic_risk=systematic_risk
        )
    
    def decompose_portfolio_risk(
        self,
        weights: Dict[str, float],
        correlation_matrix: CorrelationMatrix,
        volatilities: Dict[str, float],
        expected_returns: Dict[str, float]
    ) -> Dict[str, Any]:
        """Comprehensive portfolio risk decomposition"""
        
        asset_ids = correlation_matrix.asset_ids
        weights_array = np.array([weights.get(asset_id, 0) for asset_id in asset_ids])
        vol_array = np.array([volatilities.get(asset_id, 0) for asset_id in asset_ids])
        return_array = np.array([expected_returns.get(asset_id, 0) for asset_id in asset_ids])
        
        # Covariance matrix
        cov_matrix = correlation_matrix.matrix * np.outer(vol_array, vol_array)
        
        # Portfolio metrics
        portfolio_return = np.dot(weights_array, return_array)
        portfolio_variance = np.dot(weights_array, np.dot(cov_matrix, weights_array))
        portfolio_vol = np.sqrt(portfolio_variance)
        
        # Marginal contributions
        marginal_contrib = np.dot(cov_matrix, weights_array) / portfolio_vol if portfolio_vol > 0 else np.zeros_like(weights_array)
        
        # Component contributions
        component_contrib = weights_array * marginal_contrib
        
        # Risk decomposition
        decomposition = {
            "portfolio_metrics": {
                "expected_return": portfolio_return,
                "volatility": portfolio_vol,
                "variance": portfolio_variance
            },
            "risk_contributions": {
                asset_ids[i]: {
                    "weight": weights_array[i],
                    "marginal_contribution": marginal_contrib[i],
                    "component_contribution": component_contrib[i],
                    "risk_percentage": component_contrib[i] / np.sum(component_contrib) * 100 if np.sum(component_contrib) > 0 else 0
                }
                for i in range(len(asset_ids))
            },
            "diversification_analysis": self.calculate_diversification_metrics(
                weights, correlation_matrix, volatilities
            )
        }
        
        return decomposition

class OptimizationEngine:
    """
    Portfolio optimization engine with multiple objectives and constraints
    """
    
    def __init__(self, risk_calculator: Optional[RiskMetricsCalculator] = None):
        self.risk_calculator = risk_calculator or RiskMetricsCalculator()
        self.optimization_history = []
    
    def optimize_portfolio(
        self,
        assets: List[AssetParameters],
        correlation_matrix: CorrelationMatrix,
        objective: OptimizationObjective,
        constraints: OptimizationConstraints,
        risk_free_rate: float = 0.02
    ) -> OptimizationResult:
        """Optimize portfolio using specified objective and constraints"""
        
        n_assets = len(assets)
        asset_ids = [asset.asset_id for asset in assets]
        
        # Extract parameters
        expected_returns = np.array([asset.expected_return for asset in assets])
        volatilities = np.array([asset.volatility for asset in assets])
        current_weights = np.array([asset.current_weight for asset in assets])
        
        # Covariance matrix
        cov_matrix = correlation_matrix.matrix * np.outer(volatilities, volatilities)
        
        # Set up bounds
        bounds = []
        for asset in assets:
            min_w = constraints.min_weights.get(asset.asset_id, asset.min_weight)
            max_w = constraints.max_weights.get(asset.asset_id, asset.max_weight)
            bounds.append((min_w, max_w))
        
        # Set up constraints
        constraint_list = []
        
        # Weights sum to 1
        constraint_list.append({
            'type': 'eq',
            'fun': lambda w: np.sum(w) - 1.0
        })
        
        # Target return constraint
        if constraints.target_return is not None:
            constraint_list.append({
                'type': 'eq',
                'fun': lambda w: np.dot(w, expected_returns) - constraints.target_return
            })
        
        # Maximum variance constraint
        if constraints.max_variance is not None:
            constraint_list.append({
                'type': 'ineq',
                'fun': lambda w: constraints.max_variance - np.dot(w, np.dot(cov_matrix, w))
            })
        
        # Turnover constraint
        if constraints.turnover_limit is not None:
            constraint_list.append({
                'type': 'ineq',
                'fun': lambda w: constraints.turnover_limit - np.sum(np.abs(w - current_weights))
            })
        
        # Define objective function
        def objective_function(weights):
            portfolio_return = np.dot(weights, expected_returns)
            portfolio_variance = np.dot(weights, np.dot(cov_matrix, weights))
            portfolio_vol = np.sqrt(portfolio_variance)
            
            if objective == OptimizationObjective.MAXIMIZE_SHARPE:
                sharpe = (portfolio_return - risk_free_rate) / portfolio_vol if portfolio_vol > 0 else 0
                return -sharpe  # Minimize negative Sharpe
            
            elif objective == OptimizationObjective.MINIMIZE_VARIANCE:
                return portfolio_variance
            
            elif objective == OptimizationObjective.MAXIMIZE_RETURN:
                return -portfolio_return  # Minimize negative return
            
            elif objective == OptimizationObjective.RISK_PARITY:
                # Risk parity: minimize sum of squared risk contribution deviations
                marginal_contrib = np.dot(cov_matrix, weights) / portfolio_vol if portfolio_vol > 0 else np.ones_like(weights)
                risk_contrib = weights * marginal_contrib
                target_contrib = np.ones(n_assets) / n_assets
                return np.sum((risk_contrib - target_contrib) ** 2)
            
            else:
                return portfolio_variance
        
        # Initial guess (equal weights or current weights)
        if np.sum(current_weights) > 0.99:
            x0 = current_weights
        else:
            x0 = np.ones(n_assets) / n_assets
        
        # Optimize
        try:
            result = optimize.minimize(
                objective_function,
                x0,
                method='SLSQP',
                bounds=bounds,
                constraints=constraint_list,
                options={'maxiter': 1000, 'ftol': 1e-9}
            )
            
            if result.success:
                optimal_weights = result.x
                optimization_status = "Success"
            else:
                optimal_weights = x0
                optimization_status = f"Failed: {result.message}"
        
        except Exception as e:
            optimal_weights = x0
            optimization_status = f"Error: {str(e)}"
        
        # Calculate portfolio metrics
        portfolio_return = np.dot(optimal_weights, expected_returns)
        portfolio_variance = np.dot(optimal_weights, np.dot(cov_matrix, optimal_weights))
        portfolio_vol = np.sqrt(portfolio_variance)
        sharpe_ratio = (portfolio_return - risk_free_rate) / portfolio_vol if portfolio_vol > 0 else 0
        
        # Calculate turnover and transaction costs
        turnover = np.sum(np.abs(optimal_weights - current_weights))
        transaction_costs = sum(
            abs(optimal_weights[i] - current_weights[i]) * assets[i].transaction_cost 
            for i in range(n_assets)
        )
        
        # Create weights dictionary
        optimal_weights_dict = {asset_ids[i]: optimal_weights[i] for i in range(n_assets)}
        
        # Calculate portfolio risk metrics
        portfolio_returns = self._simulate_portfolio_returns(optimal_weights_dict, assets, correlation_matrix)
        risk_metrics = self.risk_calculator.calculate_portfolio_risk_metrics(
            {asset_ids[i]: portfolio_returns for i in range(n_assets)},  # Simplified
            optimal_weights_dict,
            correlation_matrix.matrix
        )
        
        # Sensitivity analysis
        sensitivity = self._calculate_optimization_sensitivity(
            optimal_weights, expected_returns, cov_matrix, objective
        )
        
        result = OptimizationResult(
            objective=objective,
            optimal_weights=optimal_weights_dict,
            expected_return=portfolio_return,
            expected_volatility=portfolio_vol,
            sharpe_ratio=sharpe_ratio,
            optimization_status=optimization_status,
            objective_value=-result.fun if 'result' in locals() and result.success else 0,
            turnover=turnover,
            transaction_costs=transaction_costs,
            risk_metrics=risk_metrics,
            constraints_summary=self._summarize_constraints(constraints),
            sensitivity_analysis=sensitivity
        )
        
        self.optimization_history.append(result)
        return result
    
    def _simulate_portfolio_returns(
        self,
        weights: Dict[str, float],
        assets: List[AssetParameters],
        correlation_matrix: CorrelationMatrix,
        n_simulations: int = 1000
    ) -> List[float]:
        """Simulate portfolio returns for risk calculation"""
        
        # Simplified portfolio return simulation
        portfolio_returns = []
        
        for _ in range(n_simulations):
            period_return = 0
            for asset in assets:
                asset_return = np.random.normal(asset.expected_return / 252, asset.volatility / np.sqrt(252))
                period_return += weights.get(asset.asset_id, 0) * asset_return
            portfolio_returns.append(period_return)
        
        return portfolio_returns
    
    def _calculate_optimization_sensitivity(
        self,
        optimal_weights: np.ndarray,
        expected_returns: np.ndarray,
        cov_matrix: np.ndarray,
        objective: OptimizationObjective
    ) -> Dict[str, float]:
        """Calculate sensitivity of optimal solution to input parameters"""
        
        sensitivity = {}
        
        # Return sensitivity
        return_perturbation = 0.01  # 1% change
        for i, original_return in enumerate(expected_returns):
            perturbed_returns = expected_returns.copy()
            perturbed_returns[i] += return_perturbation
            
            # Simplified sensitivity calculation
            if objective == OptimizationObjective.MAXIMIZE_SHARPE:
                original_sharpe = np.dot(optimal_weights, expected_returns) / np.sqrt(np.dot(optimal_weights, np.dot(cov_matrix, optimal_weights)))
                perturbed_sharpe = np.dot(optimal_weights, perturbed_returns) / np.sqrt(np.dot(optimal_weights, np.dot(cov_matrix, optimal_weights)))
                sensitivity[f"return_{i}"] = (perturbed_sharpe - original_sharpe) / return_perturbation
        
        return sensitivity
    
    def _summarize_constraints(self, constraints: OptimizationConstraints) -> Dict[str, Any]:
        """Summarize optimization constraints"""
        return {
            "weight_constraints": len(constraints.min_weights) + len(constraints.max_weights),
            "sector_constraints": len(constraints.sector_limits),
            "has_target_return": constraints.target_return is not None,
            "has_turnover_limit": constraints.turnover_limit is not None,
            "has_variance_limit": constraints.max_variance is not None
        }
    
    def efficient_frontier(
        self,
        assets: List[AssetParameters],
        correlation_matrix: CorrelationMatrix,
        n_points: int = 20
    ) -> List[Tuple[float, float]]:
        """Generate efficient frontier points (risk, return)"""
        
        expected_returns = np.array([asset.expected_return for asset in assets])
        volatilities = np.array([asset.volatility for asset in assets])
        cov_matrix = correlation_matrix.matrix * np.outer(volatilities, volatilities)
        
        min_return = np.min(expected_returns)
        max_return = np.max(expected_returns)
        
        frontier_points = []
        
        for target_return in np.linspace(min_return, max_return, n_points):
            constraints = OptimizationConstraints(target_return=target_return)
            
            try:
                result = self.optimize_portfolio(
                    assets,
                    correlation_matrix,
                    OptimizationObjective.MINIMIZE_VARIANCE,
                    constraints
                )
                frontier_points.append((result.expected_volatility, result.expected_return))
            except:
                continue
        
        return frontier_points

# Utility functions

def calculate_tracking_error(
    portfolio_returns: List[float],
    benchmark_returns: List[float]
) -> float:
    """Calculate tracking error relative to benchmark"""
    
    if len(portfolio_returns) != len(benchmark_returns):
        return 0.0
    
    excess_returns = np.array(portfolio_returns) - np.array(benchmark_returns)
    tracking_error = np.std(excess_returns) * np.sqrt(252)  # Annualized
    
    return tracking_error

def calculate_maximum_drawdown_duration(returns: List[float]) -> Tuple[float, int]:
    """Calculate maximum drawdown and its duration"""
    
    cumulative_returns = np.cumprod(1 + np.array(returns))
    running_max = np.maximum.accumulate(cumulative_returns)
    drawdowns = (cumulative_returns - running_max) / running_max
    
    max_drawdown = np.min(drawdowns)
    
    # Calculate duration
    drawdown_periods = drawdowns < -0.01  # Periods with >1% drawdown
    if np.any(drawdown_periods):
        max_duration = np.max(np.diff(np.where(np.concatenate(([False], drawdown_periods, [False])))[0])[::2])
    else:
        max_duration = 0
    
    return abs(max_drawdown), max_duration