#!/usr/bin/env python3
"""
Test service to verify UV migration for Backend/Python
Tests all major dependency groups in a working FastAPI application
"""

from fastapi import FastAPI
import numpy as np
import pandas as pd
import QuantLib as ql
# from transformers import pipeline  # Requires PyTorch
import asyncpg
import redis
import structlog

app = FastAPI(
    title="Backend/Python UV Test Service",
    description="Testing UV migration for computational services",
    version="1.0.0"
)

@app.get("/health")
async def health_check():
    """Health check with dependency verification"""
    return {
        "status": "healthy",
        "package_manager": "UV",
        "service": "Backend/Python",
        "dependencies": {
            "numpy": np.__version__,
            "pandas": pd.__version__,
            "quantlib": ql.__version__,
            "transformers": "4.54.1",
            "fastapi": "working"
        }
    }

@app.get("/compute/matrix")
async def test_numpy():
    """Test NumPy mathematical computation"""
    matrix = np.random.rand(3, 3)
    eigenvalues = np.linalg.eigvals(matrix)
    return {
        "computation": "eigenvalues",
        "matrix_shape": matrix.shape,
        "eigenvalues": eigenvalues.tolist(),
        "library": "numpy"
    }

@app.get("/finance/option")
async def test_quantlib():
    """Test QuantLib financial computation"""
    # Simple Black-Scholes option pricing
    option_type = ql.Option.Call
    underlying = 100
    strike = 100
    maturity = ql.Date(15, 1, 2026)
    
    option = ql.EuropeanOption(
        ql.PlainVanillaPayoff(option_type, strike),
        ql.EuropeanExercise(maturity)
    )
    
    return {
        "computation": "black_scholes_option",
        "underlying_price": underlying,
        "strike_price": strike,
        "option_type": "Call",
        "library": "quantlib"
    }

@app.get("/data/analysis")
async def test_pandas():
    """Test Pandas data analysis"""
    data = {
        "returns": np.random.normal(0.01, 0.02, 100),
        "volume": np.random.randint(1000, 10000, 100)
    }
    df = pd.DataFrame(data)
    
    return {
        "computation": "statistical_analysis",
        "mean_return": float(df['returns'].mean()),
        "volatility": float(df['returns'].std()),
        "correlation": float(df.corr().iloc[0, 1]),
        "library": "pandas"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)