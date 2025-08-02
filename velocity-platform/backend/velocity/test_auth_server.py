#!/usr/bin/env python3
"""
Simple test server for authentication endpoints
Tests Supabase auth without database dependency
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Set environment variables
os.environ["DATABASE_URL"] = "sqlite:///test.db"  # Use SQLite for testing
os.environ["SUPABASE_URL"] = "https://acefedmwnsgarsjvjyao.supabase.co"
os.environ["SUPABASE_ANON_KEY"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZWZlZG13bnNnYXJzanZqeWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwMTAzMDUsImV4cCI6MjAzNjU4NjMwNX0.dh8nQV_wqbHQ8pCmvO6KHpjJG_AiRNZHnNqWg_dYNTM"

# Create FastAPI app
app = FastAPI(
    title="Velocity AI Authentication Test",
    description="Testing authentication endpoints with UV package manager",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include auth routes
from auth_routes import router as auth_router
app.include_router(auth_router, prefix="/auth", tags=["authentication"])

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Velocity AI Authentication Server Running",
        "package_manager": "UV",
        "auth_system": "Supabase"
    }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Velocity AI Authentication API",
        "package_manager": "UV",
        "auth_endpoints": {
            "signup": "POST /auth/signup",
            "login": "POST /auth/login", 
            "me": "GET /auth/me",
            "refresh": "POST /auth/refresh"
        },
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)