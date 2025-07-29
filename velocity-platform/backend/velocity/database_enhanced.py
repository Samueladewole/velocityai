"""
Enhanced Database Configuration for Velocity AI Platform
Production-ready database connection with monitoring, health checks, and optimization
"""
import os
import logging
from typing import Generator, AsyncGenerator
from contextlib import contextmanager, asynccontextmanager
import time
from functools import wraps

from sqlalchemy import create_engine, event, pool, text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.engine import Engine
from sqlalchemy.pool import QueuePool
import structlog

logger = structlog.get_logger()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://velocity:password@localhost/velocity_db")
ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

# Connection pool settings
POOL_SIZE = int(os.getenv("DB_POOL_SIZE", "20"))
MAX_OVERFLOW = int(os.getenv("DB_MAX_OVERFLOW", "30"))
POOL_TIMEOUT = int(os.getenv("DB_POOL_TIMEOUT", "30"))
POOL_RECYCLE = int(os.getenv("DB_POOL_RECYCLE", "3600"))  # 1 hour
POOL_PRE_PING = os.getenv("DB_POOL_PRE_PING", "true").lower() == "true"

# Query performance monitoring
SLOW_QUERY_THRESHOLD = float(os.getenv("SLOW_QUERY_THRESHOLD", "1.0"))  # seconds

class DatabaseMetrics:
    """Database performance metrics collector"""
    
    def __init__(self):
        self.query_count = 0
        self.slow_query_count = 0
        self.total_query_time = 0.0
        self.connection_errors = 0
    
    def record_query(self, duration: float):
        """Record query execution"""
        self.query_count += 1
        self.total_query_time += duration
        
        if duration > SLOW_QUERY_THRESHOLD:
            self.slow_query_count += 1
            logger.warning(
                "slow_query_detected",
                duration=duration,
                threshold=SLOW_QUERY_THRESHOLD
            )
    
    def record_connection_error(self):
        """Record connection error"""
        self.connection_errors += 1
        logger.error("database_connection_error")
    
    def get_stats(self) -> dict:
        """Get current metrics"""
        avg_query_time = self.total_query_time / self.query_count if self.query_count > 0 else 0
        return {
            "query_count": self.query_count,
            "slow_query_count": self.slow_query_count,
            "slow_query_percentage": (self.slow_query_count / self.query_count * 100) if self.query_count > 0 else 0,
            "avg_query_time": avg_query_time,
            "total_query_time": self.total_query_time,
            "connection_errors": self.connection_errors
        }

# Global metrics instance
db_metrics = DatabaseMetrics()

# Create optimized engines
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=POOL_SIZE,
    max_overflow=MAX_OVERFLOW,
    pool_timeout=POOL_TIMEOUT,
    pool_pre_ping=POOL_PRE_PING,
    pool_recycle=POOL_RECYCLE,
    echo=False,  # Set to True for SQL debugging
    echo_pool=False,
    connect_args={
        "application_name": "velocity_ai_platform",
        "options": "-c default_transaction_isolation=read_committed"
    }
)

async_engine = create_async_engine(
    ASYNC_DATABASE_URL,
    poolclass=pool.QueuePool,
    pool_size=POOL_SIZE,
    max_overflow=MAX_OVERFLOW,
    pool_timeout=POOL_TIMEOUT,
    pool_pre_ping=POOL_PRE_PING,
    pool_recycle=POOL_RECYCLE,
    echo=False,
    connect_args={
        "application_name": "velocity_ai_platform_async",
        "server_settings": {
            "application_name": "velocity_ai_platform_async",
        }
    }
)

# Session makers
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False
)

AsyncSessionLocal = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

from models import Base

# Event listeners for monitoring
@event.listens_for(Engine, "before_cursor_execute")
def receive_before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    """Record query start time"""
    context._query_start_time = time.time()

@event.listens_for(Engine, "after_cursor_execute")
def receive_after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    """Record query completion and metrics"""
    total = time.time() - context._query_start_time
    db_metrics.record_query(total)
    
    logger.debug(
        "database_query_executed",
        duration=total,
        statement=statement[:100] + "..." if len(statement) > 100 else statement
    )

@event.listens_for(Engine, "connect")
def receive_connect(dbapi_connection, connection_record):
    """Configure connection settings"""
    logger.info("database_connection_established")
    
    # Set connection-level settings for PostgreSQL
    with dbapi_connection.cursor() as cursor:
        # Set timezone
        cursor.execute("SET timezone = 'UTC'")
        # Set statement timeout (30 seconds)
        cursor.execute("SET statement_timeout = '30s'")
        # Set lock timeout (10 seconds)
        cursor.execute("SET lock_timeout = '10s'")
        dbapi_connection.commit()

@event.listens_for(Engine, "handle_error")
def receive_handle_error(exception_context):
    """Handle database errors"""
    db_metrics.record_connection_error()
    logger.error(
        "database_error",
        error=str(exception_context.original_exception),
        statement=exception_context.statement
    )

def create_tables():
    """Create all tables with proper error handling"""
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error("Failed to create database tables", error=str(e))
        raise

async def create_tables_async():
    """Create all tables asynchronously"""
    try:
        logger.info("Creating database tables asynchronously...")
        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully (async)")
    except Exception as e:
        logger.error("Failed to create database tables (async)", error=str(e))
        raise

def get_db() -> Generator[Session, None, None]:
    """Get database session with automatic cleanup and error handling"""
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error("Database session error", error=str(e))
        db.rollback()
        raise
    finally:
        db.close()

async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    """Get async database session with automatic cleanup"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            logger.error("Async database session error", error=str(e))
            await session.rollback()
            raise

@contextmanager
def get_db_context():
    """Context manager for database sessions"""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        logger.error("Database context error", error=str(e))
        db.rollback()
        raise
    finally:
        db.close()

@asynccontextmanager
async def get_async_db_context():
    """Async context manager for database sessions"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            logger.error("Async database context error", error=str(e))
            await session.rollback()
            raise

def health_check() -> dict:
    """Perform database health check"""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()
        
        # Get pool status
        pool_status = {
            "pool_size": engine.pool.size(),
            "checked_in": engine.pool.checkedin(),
            "checked_out": engine.pool.checkedout(),
            "overflow": engine.pool.overflow(),
            "invalidated": engine.pool.invalidated()
        }
        
        return {
            "status": "healthy",
            "pool": pool_status,
            "metrics": db_metrics.get_stats()
        }
    
    except Exception as e:
        logger.error("Database health check failed", error=str(e))
        return {
            "status": "unhealthy",
            "error": str(e),
            "metrics": db_metrics.get_stats()
        }

async def async_health_check() -> dict:
    """Perform async database health check"""
    try:
        async with async_engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            await result.fetchone()
        
        return {
            "status": "healthy",
            "engine": "async",
            "metrics": db_metrics.get_stats()
        }
    
    except Exception as e:
        logger.error("Async database health check failed", error=str(e))
        return {
            "status": "unhealthy",
            "error": str(e),
            "engine": "async",
            "metrics": db_metrics.get_stats()
        }

def retry_db_operation(max_retries: int = 3, delay: float = 1.0):
    """Decorator for retrying database operations"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_retries - 1:
                        logger.warning(
                            "Database operation failed, retrying",
                            attempt=attempt + 1,
                            max_retries=max_retries,
                            error=str(e)
                        )
                        time.sleep(delay * (2 ** attempt))  # Exponential backoff
                    else:
                        logger.error(
                            "Database operation failed after all retries",
                            attempts=max_retries,
                            error=str(e)
                        )
            raise last_exception
        return wrapper
    return decorator

# Database initialization and cleanup
async def init_db():
    """Initialize database with health checks"""
    logger.info("Initializing database...")
    
    # Check database health
    health = health_check()
    if health["status"] != "healthy":
        raise Exception(f"Database unhealthy: {health.get('error', 'Unknown error')}")
    
    # Create tables if they don't exist
    await create_tables_async()
    
    logger.info("Database initialized successfully", health=health)

async def close_db():
    """Close database connections"""
    logger.info("Closing database connections...")
    
    try:
        await async_engine.dispose()
        engine.dispose()
        logger.info("Database connections closed successfully")
    except Exception as e:
        logger.error("Error closing database connections", error=str(e))