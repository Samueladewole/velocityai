"""
Database connection and management for ERIP Python Backend
"""

import asyncio
import asyncpg
from typing import Optional
import structlog
from shared.config import get_settings

logger = structlog.get_logger()
settings = get_settings()

class Database:
    """Async database connection manager"""
    
    def __init__(self):
        self.pool: Optional[asyncpg.Pool] = None
    
    async def connect(self):
        """Initialize database connection pool"""
        try:
            self.pool = await asyncpg.create_pool(
                settings.database_url,
                min_size=1,
                max_size=10,
                command_timeout=60
            )
            logger.info("Database connection pool created")
        except Exception as e:
            logger.error("Failed to create database pool", error=str(e))
            raise
    
    async def disconnect(self):
        """Close database connection pool"""
        if self.pool:
            await self.pool.close()
            logger.info("Database connection pool closed")
    
    async def execute(self, query: str, *args):
        """Execute a query"""
        async with self.pool.acquire() as connection:
            return await connection.execute(query, *args)
    
    async def fetch(self, query: str, *args):
        """Fetch multiple rows"""
        async with self.pool.acquire() as connection:
            return await connection.fetch(query, *args)
    
    async def fetchrow(self, query: str, *args):
        """Fetch single row"""
        async with self.pool.acquire() as connection:
            return await connection.fetchrow(query, *args)

# Global database instance
db = Database()

async def init_db():
    """Initialize database connection"""
    await db.connect()

async def close_db():
    """Close database connection"""
    await db.disconnect()

async def get_db():
    """Dependency for getting database connection"""
    return db