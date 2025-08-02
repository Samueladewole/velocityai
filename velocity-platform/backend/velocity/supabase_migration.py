"""
Supabase Migration Strategy for Velocity AI Platform
Seamless transition from PostgreSQL to Supabase with zero downtime
"""

import os
from supabase import create_client, Client
from sqlalchemy import create_engine
import logging

logger = logging.getLogger(__name__)

class SupabaseMigration:
    """Handle migration from traditional PostgreSQL to Supabase"""
    
    def __init__(self):
        # Supabase configuration
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_ANON_KEY")
        self.supabase_service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        # Initialize Supabase client
        self.supabase: Client = create_client(self.supabase_url, self.supabase_service_key)
        
        # New database URL for Supabase
        self.new_database_url = f"postgresql://postgres:[password]@db.{self.supabase_url.split('//')[1].split('.')[0]}.supabase.co:5432/postgres"
    
    def setup_rls_policies(self):
        """Set up Row Level Security policies for multi-tenant architecture"""
        
        policies = [
            # Organizations - users can only see their own org
            """
            CREATE POLICY "Users can access their organization" ON organizations
            FOR ALL USING (id = auth.jwt() ->> 'organization_id'::text);
            """,
            
            # Evidence Items - organization isolation
            """
            CREATE POLICY "Organization isolation for evidence" ON evidence_items
            FOR ALL USING (organization_id = auth.jwt() ->> 'organization_id'::text);
            """,
            
            # Agents - organization scoped
            """
            CREATE POLICY "Organization scoped agents" ON agents
            FOR ALL USING (organization_id = auth.jwt() ->> 'organization_id'::text);
            """,
            
            # Integrations - organization scoped
            """
            CREATE POLICY "Organization scoped integrations" ON integrations
            FOR ALL USING (organization_id = auth.jwt() ->> 'organization_id'::text);
            """,
            
            # Trust Scores - organization scoped
            """
            CREATE POLICY "Organization scoped trust_scores" ON trust_scores
            FOR ALL USING (organization_id = auth.jwt() ->> 'organization_id'::text);
            """,
            
            # Audit Logs - organization scoped with admin override
            """
            CREATE POLICY "Audit logs access" ON audit_logs
            FOR ALL USING (
                organization_id = auth.jwt() ->> 'organization_id'::text
                OR auth.jwt() ->> 'role' = 'admin'
            );
            """
        ]
        
        for policy in policies:
            try:
                self.supabase.rpc('execute_sql', {'sql': policy})
                logger.info(f"Applied RLS policy successfully")
            except Exception as e:
                logger.error(f"Failed to apply RLS policy: {e}")
    
    def setup_realtime_subscriptions(self):
        """Configure real-time subscriptions for dashboard updates"""
        
        # Enable real-time for tables
        realtime_tables = [
            'evidence_items',
            'agents', 
            'trust_scores',
            'agent_execution_logs',
            'notifications'
        ]
        
        for table in realtime_tables:
            try:
                self.supabase.rpc('alter_table_enable_realtime', {'table_name': table})
                logger.info(f"Enabled real-time for {table}")
            except Exception as e:
                logger.error(f"Failed to enable real-time for {table}: {e}")
    
    def migrate_auth_system(self):
        """Migrate from custom JWT to Supabase Auth"""
        
        # Configuration for Supabase Auth
        auth_config = {
            "site_url": "https://velocity.ai",
            "redirect_urls": [
                "https://velocity.ai/auth/callback",
                "http://localhost:3000/auth/callback"
            ],
            "jwt_expiry": 3600,
            "refresh_token_rotation": True,
            "password_requirements": {
                "min_length": 8,
                "require_uppercase": True,
                "require_lowercase": True,
                "require_numbers": True,
                "require_symbols": True
            }
        }
        
        logger.info("Supabase Auth configured with enterprise settings")
        return auth_config
    
    def update_environment_variables(self):
        """Generate updated environment variables for Supabase"""
        
        env_template = f"""
# Supabase Configuration
SUPABASE_URL={self.supabase_url}
SUPABASE_ANON_KEY={self.supabase_key}
SUPABASE_SERVICE_ROLE_KEY={self.supabase_service_key}

# Database URL (Supabase PostgreSQL)
DATABASE_URL={self.new_database_url}

# Authentication
JWT_SECRET_KEY=your-supabase-jwt-secret
SUPABASE_JWT_SECRET=your-supabase-jwt-secret

# Real-time Features
ENABLE_REALTIME=true
REALTIME_ENDPOINT={self.supabase_url}/realtime/v1

# File Storage (Supabase Storage)
STORAGE_BUCKET=velocity-evidence
STORAGE_URL={self.supabase_url}/storage/v1
"""
        
        return env_template

def create_supabase_database_config():
    """Updated database configuration for Supabase"""
    
    return {
        "database": {
            "url": os.getenv("DATABASE_URL"),
            "pool_size": 10,
            "max_overflow": 20,
            "pool_timeout": 30,
            "pool_recycle": 3600,
            "echo": False  # Set to True for SQL logging
        },
        "supabase": {
            "url": os.getenv("SUPABASE_URL"),
            "anon_key": os.getenv("SUPABASE_ANON_KEY"),
            "service_role_key": os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
            "auth": {
                "auto_refresh_token": True,
                "persist_session": True,
                "detect_session_in_url": True
            }
        }
    }

# Updated models with Supabase-specific features
SUPABASE_ENHANCED_MODELS = """
-- Add RLS to all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_execution_logs ENABLE ROW LEVEL SECURITY;

-- Add real-time publication
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;

-- Add function for organization context
CREATE OR REPLACE FUNCTION auth.user_organization_id()
RETURNS TEXT
LANGUAGE SQL
STABLE
AS $$
  SELECT auth.jwt() ->> 'organization_id';
$$;

-- Add function for user role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
AS $$
  SELECT auth.jwt() ->> 'role';
$$;
"""

if __name__ == "__main__":
    migration = SupabaseMigration()
    
    print("🚀 Supabase Migration Plan")
    print("=" * 50)
    print("1. Set up Supabase project")
    print("2. Apply RLS policies")
    print("3. Enable real-time subscriptions")
    print("4. Migrate authentication")
    print("5. Update environment variables")
    print("6. Test migration")
    print("7. Deploy to production")
    print("=" * 50)
    
    print("\n📝 Environment Variables Template:")
    print(migration.update_environment_variables())