"""
Shared configuration for ERIP Python Backend
"""

from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Application
    app_name: str = "ERIP Python Backend"
    debug: bool = False
    environment: str = "development"  # development, staging, production
    
    # Development mode settings
    dev_mode_bypass_auth: bool = True  # Bypass authentication in development
    dev_mode_default_user: str = "dev@erip.com"  # Default dev user
    dev_mode_default_role: str = "super_admin"  # Full permissions for dev
    
    # Database
    database_url: str = "postgresql://postgres:password@localhost:5432/erip"
    redis_url: str = "redis://localhost:6379"
    
    # AI Models
    anthropic_api_key: str = ""
    openai_api_key: str = ""
    huggingface_api_key: str = ""
    
    # Model serving
    model_cache_dir: str = "/tmp/erip_models"
    max_model_memory: int = 8  # GB
    
    # Monte Carlo settings
    default_iterations: int = 10000
    max_iterations: int = 100000
    parallel_workers: int = 4
    
    # Performance
    request_timeout: int = 300  # 5 minutes for complex calculations
    max_concurrent_requests: int = 10
    
    # Monitoring
    enable_metrics: bool = True
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()