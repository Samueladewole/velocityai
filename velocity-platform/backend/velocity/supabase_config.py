"""
Supabase Configuration for Velocity AI Platform
Enhanced database and authentication setup with Supabase
"""

import os
from supabase import create_client, Client
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class SupabaseConfig:
    """Supabase configuration and client management"""
    
    def __init__(self):
        # Supabase credentials
        self.url = os.getenv("SUPABASE_URL")
        self.anon_key = os.getenv("SUPABASE_ANON_KEY")
        self.service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not all([self.url, self.anon_key, self.service_role_key]):
            raise ValueError("Missing Supabase environment variables")
        
        # Initialize clients
        self.client: Client = create_client(self.url, self.anon_key)
        self.admin_client: Client = create_client(self.url, self.service_role_key)
        
        # Database configuration
        self.database_url = self._get_database_url()
    
    def _get_database_url(self) -> str:
        """Extract PostgreSQL connection URL from Supabase"""
        # Extract project reference from URL
        project_ref = self.url.split("//")[1].split(".")[0]
        
        # Get database password from environment or Supabase dashboard
        db_password = os.getenv("SUPABASE_DB_PASSWORD", "your-database-password")
        
        return f"postgresql://postgres:{db_password}@db.{project_ref}.supabase.co:5432/postgres"
    
    def get_client(self, use_service_role: bool = False) -> Client:
        """Get Supabase client (service role for server-side operations)"""
        return self.admin_client if use_service_role else self.client

# Global Supabase configuration
try:
    supabase_config = SupabaseConfig()
    supabase = supabase_config.get_client()
    supabase_admin = supabase_config.get_client(use_service_role=True)
except Exception as e:
    logger.warning(f"Supabase not configured: {e}")
    supabase = None
    supabase_admin = None

# Enhanced database setup with Supabase
DATABASE_URL = os.getenv("DATABASE_URL") or (
    supabase_config.database_url if 'supabase_config' in locals() else None
)

if DATABASE_URL:
    # SQLAlchemy engine with Supabase PostgreSQL
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_timeout=30,
        pool_recycle=3600,
        echo=os.getenv("SQL_ECHO", "false").lower() == "true"
    )
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    metadata = MetaData()
else:
    logger.warning("No database URL configured")
    engine = None
    SessionLocal = None

def get_db():
    """Database dependency for FastAPI"""
    if SessionLocal is None:
        raise RuntimeError("Database not configured")
    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Supabase Authentication Helper
class SupabaseAuth:
    """Enhanced authentication with Supabase"""
    
    @staticmethod
    async def sign_up(email: str, password: str, metadata: dict = None):
        """Sign up user with Supabase Auth"""
        try:
            response = supabase_admin.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": metadata or {}
                }
            })
            return response
        except Exception as e:
            logger.error(f"Supabase signup error: {e}")
            raise
    
    @staticmethod
    async def sign_in(email: str, password: str):
        """Sign in user with Supabase Auth"""
        try:
            response = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            return response
        except Exception as e:
            logger.error(f"Supabase signin error: {e}")
            raise
    
    @staticmethod
    async def get_user(access_token: str):
        """Get user from access token"""
        try:
            supabase.auth.set_session(access_token, "")
            user = supabase.auth.get_user()
            return user
        except Exception as e:
            logger.error(f"Supabase get user error: {e}")
            return None
    
    @staticmethod
    async def sign_out():
        """Sign out current user"""
        try:
            response = supabase.auth.sign_out()
            return response
        except Exception as e:
            logger.error(f"Supabase signout error: {e}")
            raise

# Real-time Subscriptions
class SupabaseRealtime:
    """Handle real-time subscriptions with Supabase"""
    
    @staticmethod
    def subscribe_to_table(table_name: str, callback, filter_condition: str = None):
        """Subscribe to table changes"""
        try:
            subscription = supabase.table(table_name)
            
            if filter_condition:
                subscription = subscription.filter(filter_condition)
            
            return subscription.on('*', callback).subscribe()
        except Exception as e:
            logger.error(f"Supabase realtime subscription error: {e}")
            return None
    
    @staticmethod
    def subscribe_to_organization_data(organization_id: str, callback):
        """Subscribe to organization-specific data changes"""
        tables = ['agents', 'evidence_items', 'trust_scores', 'integrations']
        subscriptions = []
        
        for table in tables:
            try:
                subscription = supabase.table(table).filter(
                    'organization_id', 'eq', organization_id
                ).on('*', callback).subscribe()
                subscriptions.append(subscription)
            except Exception as e:
                logger.error(f"Failed to subscribe to {table}: {e}")
        
        return subscriptions

# Storage Helper
class SupabaseStorage:
    """Handle file storage with Supabase Storage"""
    
    @staticmethod
    async def upload_evidence_file(file_path: str, file_content: bytes, organization_id: str):
        """Upload evidence file to Supabase Storage"""
        try:
            # Organize files by organization
            storage_path = f"{organization_id}/evidence/{file_path}"
            
            response = supabase_admin.storage.from_('velocity-evidence').upload(
                storage_path, file_content
            )
            
            if response.get('error'):
                raise Exception(response['error']['message'])
            
            # Get public URL
            public_url = supabase_admin.storage.from_('velocity-evidence').get_public_url(storage_path)
            
            return {
                'path': storage_path,
                'url': public_url,
                'size': len(file_content)
            }
        except Exception as e:
            logger.error(f"Supabase storage upload error: {e}")
            raise
    
    @staticmethod
    async def download_evidence_file(file_path: str):
        """Download evidence file from Supabase Storage"""
        try:
            response = supabase_admin.storage.from_('velocity-evidence').download(file_path)
            return response
        except Exception as e:
            logger.error(f"Supabase storage download error: {e}")
            raise
    
    @staticmethod
    async def delete_evidence_file(file_path: str):
        """Delete evidence file from Supabase Storage"""
        try:
            response = supabase_admin.storage.from_('velocity-evidence').remove([file_path])
            return response
        except Exception as e:
            logger.error(f"Supabase storage delete error: {e}")
            raise

# Database Health Check
async def check_supabase_health():
    """Check Supabase connection health"""
    try:
        # Test database connection
        if engine:
            with engine.connect() as conn:
                conn.execute("SELECT 1")
        
        # Test Supabase API
        if supabase_admin:
            response = supabase_admin.table('organizations').select('id').limit(1).execute()
            
        return {
            'status': 'healthy',
            'database': 'connected' if engine else 'not_configured',
            'supabase_api': 'connected' if supabase_admin else 'not_configured',
            'timestamp': str(datetime.utcnow())
        }
    except Exception as e:
        return {
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': str(datetime.utcnow())
        }

# Migration helpers
def create_supabase_tables():
    """Create tables with RLS enabled"""
    if not engine:
        raise RuntimeError("Database engine not configured")
    
    # Import your models
    from models import Base
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Enable RLS on all tables
    rls_tables = [
        'organizations', 'users', 'agents', 'evidence_items', 
        'integrations', 'trust_scores', 'agent_execution_logs'
    ]
    
    with engine.connect() as conn:
        for table in rls_tables:
            try:
                conn.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;")
                logger.info(f"Enabled RLS for {table}")
            except Exception as e:
                logger.warning(f"RLS already enabled for {table}: {e}")

def get_supabase_client(use_service_role: bool = False) -> Client:
    """Get Supabase client instance"""
    if use_service_role:
        return supabase_admin
    return supabase

if __name__ == "__main__":
    import asyncio
    
    async def test_connection():
        health = await check_supabase_health()
        print("Supabase Health Check:")
        print(f"Status: {health['status']}")
        print(f"Database: {health['database']}")
        print(f"Supabase API: {health['supabase_api']}")
        
        if health['status'] == 'unhealthy':
            print(f"Error: {health['error']}")
    
    asyncio.run(test_connection())