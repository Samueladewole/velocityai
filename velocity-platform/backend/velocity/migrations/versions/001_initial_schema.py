"""Initial schema migration for Velocity AI Platform

Revision ID: 001
Revises: 
Create Date: 2025-01-15 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    """Create initial database schema"""
    
    # Create organizations table
    op.create_table('organizations',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('domain', sa.String(length=255), nullable=False),
        sa.Column('tier', sa.String(length=50), nullable=True),
        sa.Column('settings', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('domain')
    )
    
    # Create users table
    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.Enum('SUPER_ADMIN', 'PLATFORM_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'COMPLIANCE_MANAGER', 'SECURITY_LEAD', 'AUDIT_MANAGER', 'RISK_ANALYST', 'COMPLIANCE_OFFICER', 'SECURITY_ANALYST', 'EVIDENCE_REVIEWER', 'AGENT_OPERATOR', 'VIEWER', 'EXTERNAL_AUDITOR', name='userrole'), nullable=True),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_verified', sa.Boolean(), nullable=True),
        sa.Column('failed_login_attempts', sa.Integer(), nullable=True),
        sa.Column('locked_until', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
        sa.Column('password_changed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('mfa_enabled', sa.Boolean(), nullable=True),
        sa.Column('mfa_secret', sa.String(length=255), nullable=True),
        sa.Column('backup_codes', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('profile_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('preferences', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('timezone', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    
    # Create integrations table
    op.create_table('integrations',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('platform', sa.Enum('AWS', 'GCP', 'AZURE', 'GITHUB', 'GOOGLE_WORKSPACE', 'SLACK', 'CUSTOM', name='platform'), nullable=False),
        sa.Column('status', sa.Enum('CONNECTED', 'DISCONNECTED', 'ERROR', 'SYNCING', name='integrationstatus'), nullable=True),
        sa.Column('credentials', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('configuration', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('last_sync', sa.DateTime(timezone=True), nullable=True),
        sa.Column('sync_frequency', sa.Integer(), nullable=True),
        sa.Column('error_count', sa.Integer(), nullable=True),
        sa.Column('last_error', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create agents table
    op.create_table('agents',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('platform', sa.Enum('AWS', 'GCP', 'AZURE', 'GITHUB', 'GOOGLE_WORKSPACE', 'SLACK', 'CUSTOM', name='platform'), nullable=False),
        sa.Column('framework', sa.Enum('SOC2', 'ISO27001', 'CIS_CONTROLS', 'GDPR', 'HIPAA', 'PCI_DSS', name='framework'), nullable=False),
        sa.Column('status', sa.Enum('IDLE', 'RUNNING', 'PAUSED', 'ERROR', 'COMPLETED', name='agentstatus'), nullable=True),
        sa.Column('configuration', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('schedule', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('integration_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('evidence_collected', sa.Integer(), nullable=True),
        sa.Column('success_rate', sa.Float(), nullable=True),
        sa.Column('avg_collection_time', sa.Float(), nullable=True),
        sa.Column('last_run', sa.DateTime(timezone=True), nullable=True),
        sa.Column('next_run', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['integration_id'], ['integrations.id'], ),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create evidence_items table
    op.create_table('evidence_items',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('evidence_type', sa.Enum('SCREENSHOT', 'API_RESPONSE', 'CONFIGURATION', 'LOG_ENTRY', 'POLICY_DOCUMENT', 'SCAN_RESULT', name='evidencetype'), nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'VALIDATED', 'REJECTED', 'PROCESSING', name='evidencestatus'), nullable=True),
        sa.Column('data', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('evidence_metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('file_path', sa.String(length=500), nullable=True),
        sa.Column('framework', sa.Enum('SOC2', 'ISO27001', 'CIS_CONTROLS', 'GDPR', 'HIPAA', 'PCI_DSS', name='framework'), nullable=False),
        sa.Column('control_id', sa.String(length=100), nullable=True),
        sa.Column('confidence_score', sa.Float(), nullable=True),
        sa.Column('trust_points', sa.Integer(), nullable=True),
        sa.Column('agent_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('validated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('validated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('validation_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['agent_id'], ['agents.id'], ),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
        sa.ForeignKeyConstraint(['validated_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create trust_scores table
    op.create_table('trust_scores',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('total_score', sa.Integer(), nullable=True),
        sa.Column('framework_scores', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('previous_score', sa.Integer(), nullable=True),
        sa.Column('score_change', sa.Integer(), nullable=True),
        sa.Column('last_updated', sa.DateTime(timezone=True), nullable=True),
        sa.Column('evidence_count', sa.Integer(), nullable=True),
        sa.Column('automation_rate', sa.Float(), nullable=True),
        sa.Column('coverage_percentage', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create agent_execution_logs table
    op.create_table('agent_execution_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('agent_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('execution_id', sa.String(length=255), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('status', sa.Enum('IDLE', 'RUNNING', 'PAUSED', 'ERROR', 'COMPLETED', name='agentstatus'), nullable=False),
        sa.Column('evidence_collected', sa.Integer(), nullable=True),
        sa.Column('errors_encountered', sa.Integer(), nullable=True),
        sa.Column('execution_time', sa.Float(), nullable=True),
        sa.Column('logs', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('error_details', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('performance_metrics', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.ForeignKeyConstraint(['agent_id'], ['agents.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create scheduled_tasks table
    op.create_table('scheduled_tasks',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('agent_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('cron_expression', sa.String(length=100), nullable=True),
        sa.Column('next_run', sa.DateTime(timezone=True), nullable=False),
        sa.Column('last_run', sa.DateTime(timezone=True), nullable=True),
        sa.Column('enabled', sa.Boolean(), nullable=True),
        sa.Column('retry_count', sa.Integer(), nullable=True),
        sa.Column('timeout_seconds', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['agent_id'], ['agents.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for performance
    op.create_index('ix_users_organization_id', 'users', ['organization_id'])
    op.create_index('ix_users_email', 'users', ['email'])
    op.create_index('ix_agents_organization_id', 'agents', ['organization_id'])
    op.create_index('ix_agents_status', 'agents', ['status'])
    op.create_index('ix_evidence_items_organization_id', 'evidence_items', ['organization_id'])
    op.create_index('ix_evidence_items_framework_control', 'evidence_items', ['framework', 'control_id'])
    op.create_index('ix_evidence_items_status', 'evidence_items', ['status'])
    op.create_index('ix_evidence_items_created_at', 'evidence_items', ['created_at'])
    op.create_index('ix_agent_execution_logs_agent_id', 'agent_execution_logs', ['agent_id'])
    op.create_index('ix_agent_execution_logs_started_at', 'agent_execution_logs', ['started_at'])
    op.create_index('ix_integrations_organization_id', 'integrations', ['organization_id'])
    op.create_index('ix_integrations_platform', 'integrations', ['platform'])

def downgrade():
    """Drop all tables and indexes"""
    
    # Drop indexes
    op.drop_index('ix_integrations_platform')
    op.drop_index('ix_integrations_organization_id')
    op.drop_index('ix_agent_execution_logs_started_at')
    op.drop_index('ix_agent_execution_logs_agent_id')
    op.drop_index('ix_evidence_items_created_at')
    op.drop_index('ix_evidence_items_status')
    op.drop_index('ix_evidence_items_framework_control')
    op.drop_index('ix_evidence_items_organization_id')
    op.drop_index('ix_agents_status')
    op.drop_index('ix_agents_organization_id')
    op.drop_index('ix_users_email')
    op.drop_index('ix_users_organization_id')
    
    # Drop tables in reverse order
    op.drop_table('scheduled_tasks')
    op.drop_table('agent_execution_logs')
    op.drop_table('trust_scores')
    op.drop_table('evidence_items')
    op.drop_table('agents')
    op.drop_table('integrations')
    op.drop_table('users')
    op.drop_table('organizations')
    
    # Drop enums
    op.execute('DROP TYPE IF EXISTS userrole')
    op.execute('DROP TYPE IF EXISTS platform')
    op.execute('DROP TYPE IF EXISTS framework')
    op.execute('DROP TYPE IF EXISTS agentstatus')
    op.execute('DROP TYPE IF EXISTS evidencetype')
    op.execute('DROP TYPE IF EXISTS evidencestatus')
    op.execute('DROP TYPE IF EXISTS integrationstatus')