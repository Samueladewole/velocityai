-- Velocity.ai Agent Management Database Schema
-- Created for Phase 1 Agent Infrastructure Foundation
-- PostgreSQL 15+ optimized with proper indexing

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agent instances and their configurations
CREATE TABLE agent_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'created',
    config JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP,
    
    -- Performance indexes
    CONSTRAINT valid_status CHECK (status IN ('created', 'starting', 'running', 'paused', 'stopped', 'error', 'terminated')),
    CONSTRAINT valid_agent_type CHECK (agent_type IN (
        'aws-evidence-collector',
        'gcp-scanner',
        'github-analyzer',
        'azure-monitor',
        'document-generator',
        'qie-integration',
        'trust-score-engine',
        'continuous-monitor',
        'observability-specialist',
        'cryptographic-verification'
    ))
);

-- Indexes for agent_instances
CREATE INDEX idx_agent_instances_type ON agent_instances(agent_type);
CREATE INDEX idx_agent_instances_status ON agent_instances(status);
CREATE INDEX idx_agent_instances_last_active ON agent_instances(last_active);
CREATE INDEX idx_agent_instances_config ON agent_instances USING GIN(config);

-- Task queue and execution tracking  
CREATE TABLE agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agent_instances(id) ON DELETE CASCADE,
    task_type VARCHAR(50) NOT NULL,
    priority INTEGER DEFAULT 5,
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    result JSONB,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    
    CONSTRAINT valid_task_status CHECK (status IN ('pending', 'assigned', 'running', 'completed', 'failed', 'retrying', 'cancelled')),
    CONSTRAINT valid_priority CHECK (priority BETWEEN 1 AND 10)
);

-- Indexes for agent_tasks
CREATE INDEX idx_agent_tasks_agent_id ON agent_tasks(agent_id);
CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX idx_agent_tasks_priority ON agent_tasks(priority DESC);
CREATE INDEX idx_agent_tasks_created_at ON agent_tasks(created_at);
CREATE INDEX idx_agent_tasks_type ON agent_tasks(task_type);
CREATE INDEX idx_agent_tasks_payload ON agent_tasks USING GIN(payload);

-- Workflow definitions and steps
CREATE TABLE agent_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    definition JSONB NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(100),
    
    CONSTRAINT valid_version CHECK (version > 0)
);

-- Indexes for agent_workflows
CREATE INDEX idx_agent_workflows_name ON agent_workflows(name);
CREATE INDEX idx_agent_workflows_active ON agent_workflows(is_active);
CREATE INDEX idx_agent_workflows_version ON agent_workflows(version DESC);
CREATE INDEX idx_agent_workflows_definition ON agent_workflows USING GIN(definition);

-- Workflow executions
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES agent_workflows(id) ON DELETE CASCADE,
    execution_status VARCHAR(20) NOT NULL DEFAULT 'started',
    input_data JSONB,
    output_data JSONB,
    current_step INTEGER DEFAULT 0,
    total_steps INTEGER,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    error_details JSONB,
    
    CONSTRAINT valid_execution_status CHECK (execution_status IN ('started', 'running', 'paused', 'completed', 'failed', 'cancelled'))
);

-- Indexes for workflow_executions
CREATE INDEX idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(execution_status);
CREATE INDEX idx_workflow_executions_started_at ON workflow_executions(started_at);

-- Performance metrics and monitoring
CREATE TABLE agent_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agent_instances(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    value DECIMAL NOT NULL,
    unit VARCHAR(20),
    timestamp TIMESTAMP DEFAULT NOW(),
    tags JSONB,
    
    CONSTRAINT valid_metric_type CHECK (metric_type IN (
        'performance', 'resource_usage', 'task_completion', 'error_rate', 'throughput'
    ))
);

-- Indexes for agent_metrics (optimized for time-series queries)
CREATE INDEX idx_agent_metrics_agent_timestamp ON agent_metrics(agent_id, timestamp DESC);
CREATE INDEX idx_agent_metrics_type_name ON agent_metrics(metric_type, metric_name);
CREATE INDEX idx_agent_metrics_timestamp ON agent_metrics(timestamp DESC);
CREATE INDEX idx_agent_metrics_tags ON agent_metrics USING GIN(tags);

-- Comprehensive audit trail
CREATE TABLE agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agent_instances(id) ON DELETE CASCADE,
    level VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    correlation_id VARCHAR(100),
    timestamp TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT valid_log_level CHECK (level IN ('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'))
);

-- Indexes for agent_logs (optimized for log analysis)
CREATE INDEX idx_agent_logs_agent_timestamp ON agent_logs(agent_id, timestamp DESC);
CREATE INDEX idx_agent_logs_level ON agent_logs(level);
CREATE INDEX idx_agent_logs_correlation_id ON agent_logs(correlation_id);
CREATE INDEX idx_agent_logs_timestamp ON agent_logs(timestamp DESC);
CREATE INDEX idx_agent_logs_metadata ON agent_logs USING GIN(metadata);

-- Agent capabilities and configurations
CREATE TABLE agent_capabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_type VARCHAR(50) NOT NULL,
    capability_name VARCHAR(100) NOT NULL,
    capability_config JSONB NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(agent_type, capability_name)
);

-- Indexes for agent_capabilities
CREATE INDEX idx_agent_capabilities_type ON agent_capabilities(agent_type);
CREATE INDEX idx_agent_capabilities_enabled ON agent_capabilities(is_enabled);

-- Agent dependencies and relationships
CREATE TABLE agent_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agent_instances(id) ON DELETE CASCADE,
    depends_on_agent_id UUID REFERENCES agent_instances(id) ON DELETE CASCADE,
    dependency_type VARCHAR(50) NOT NULL,
    is_critical BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT no_self_dependency CHECK (agent_id != depends_on_agent_id),
    CONSTRAINT valid_dependency_type CHECK (dependency_type IN (
        'data_flow', 'execution_order', 'resource_sharing', 'authentication'
    )),
    UNIQUE(agent_id, depends_on_agent_id, dependency_type)
);

-- Indexes for agent_dependencies
CREATE INDEX idx_agent_dependencies_agent ON agent_dependencies(agent_id);
CREATE INDEX idx_agent_dependencies_depends_on ON agent_dependencies(depends_on_agent_id);
CREATE INDEX idx_agent_dependencies_critical ON agent_dependencies(is_critical);

-- Evidence collection tracking (specific to Velocity compliance agents)
CREATE TABLE evidence_collection (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agent_instances(id) ON DELETE CASCADE,
    evidence_type VARCHAR(100) NOT NULL,
    source_system VARCHAR(100) NOT NULL,
    collection_timestamp TIMESTAMP DEFAULT NOW(),
    evidence_hash VARCHAR(64), -- For cryptographic verification
    evidence_size BIGINT,
    compliance_framework VARCHAR(50),
    verification_status VARCHAR(20) DEFAULT 'pending',
    metadata JSONB,
    
    CONSTRAINT valid_verification_status CHECK (verification_status IN (
        'pending', 'verified', 'failed', 'disputed'
    ))
);

-- Indexes for evidence_collection
CREATE INDEX idx_evidence_agent_timestamp ON evidence_collection(agent_id, collection_timestamp DESC);
CREATE INDEX idx_evidence_type ON evidence_collection(evidence_type);
CREATE INDEX idx_evidence_source ON evidence_collection(source_system);
CREATE INDEX idx_evidence_framework ON evidence_collection(compliance_framework);
CREATE INDEX idx_evidence_verification ON evidence_collection(verification_status);
CREATE INDEX idx_evidence_hash ON evidence_collection(evidence_hash);

-- Agent health and status tracking
CREATE TABLE agent_health_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agent_instances(id) ON DELETE CASCADE,
    check_timestamp TIMESTAMP DEFAULT NOW(),
    health_status VARCHAR(20) NOT NULL,
    response_time_ms INTEGER,
    cpu_usage DECIMAL(5,2),
    memory_usage_mb INTEGER,
    error_details JSONB,
    
    CONSTRAINT valid_health_status CHECK (health_status IN (
        'healthy', 'degraded', 'unhealthy', 'timeout', 'error'
    ))
);

-- Indexes for agent_health_checks
CREATE INDEX idx_health_agent_timestamp ON agent_health_checks(agent_id, check_timestamp DESC);
CREATE INDEX idx_health_status ON agent_health_checks(health_status);
CREATE INDEX idx_health_response_time ON agent_health_checks(response_time_ms);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for workflows table
CREATE TRIGGER update_agent_workflows_updated_at 
    BEFORE UPDATE ON agent_workflows 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create performance views for common queries
CREATE VIEW agent_status_summary AS
SELECT 
    agent_type,
    status,
    COUNT(*) as count,
    AVG(EXTRACT(EPOCH FROM (NOW() - last_active))/60) as avg_inactive_minutes
FROM agent_instances 
GROUP BY agent_type, status;

CREATE VIEW task_performance_summary AS
SELECT 
    task_type,
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_tasks,
    AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_execution_seconds
FROM agent_tasks 
WHERE started_at IS NOT NULL
GROUP BY task_type;

CREATE VIEW agent_health_summary AS
SELECT 
    ai.agent_type,
    ai.id as agent_id,
    ai.status as agent_status,
    ahc.health_status,
    ahc.response_time_ms,
    ahc.cpu_usage,
    ahc.memory_usage_mb,
    ahc.check_timestamp
FROM agent_instances ai
LEFT JOIN LATERAL (
    SELECT * FROM agent_health_checks 
    WHERE agent_id = ai.id 
    ORDER BY check_timestamp DESC 
    LIMIT 1
) ahc ON true;

-- Grant permissions (adjust as needed for your application user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO velocity_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO velocity_app;

-- Insert initial agent capabilities configuration
INSERT INTO agent_capabilities (agent_type, capability_name, capability_config) VALUES
('aws-evidence-collector', 'ec2_scanning', '{"services": ["EC2", "S3", "RDS", "IAM"], "regions": ["us-east-1", "us-west-2"], "max_concurrent": 5}'),
('aws-evidence-collector', 'compliance_mapping', '{"frameworks": ["SOC2", "ISO27001", "GDPR"], "auto_classify": true}'),
('gcp-scanner', 'resource_discovery', '{"services": ["Compute", "Storage", "BigQuery"], "projects": [], "max_concurrent": 3}'),
('github-analyzer', 'security_scanning', '{"check_secrets": true, "check_dependencies": true, "branch_protection": true}'),
('azure-monitor', 'compliance_check', '{"services": ["VMs", "Storage", "ActiveDirectory"], "subscriptions": []}'),
('cryptographic-verification', 'blockchain_integration', '{"polygon_network": "mainnet", "trust_protocol": "enabled", "signature_verification": true}');

-- Create initial system workflow templates
INSERT INTO agent_workflows (name, description, definition) VALUES
('evidence_collection_workflow', 'Standard evidence collection across cloud platforms', 
'{"steps": [{"type": "discover_resources", "timeout": 300}, {"type": "collect_evidence", "timeout": 600}, {"type": "verify_evidence", "timeout": 120}, {"type": "store_evidence", "timeout": 60}], "error_handling": "retry_with_backoff", "max_retries": 3}'),

('compliance_assessment_workflow', 'Full compliance assessment with expert validation',
'{"steps": [{"type": "collect_evidence", "agents": ["aws-evidence-collector", "gcp-scanner", "azure-monitor"]}, {"type": "analyze_compliance", "frameworks": ["SOC2", "ISO27001"]}, {"type": "expert_validation", "required_consensus": 0.8}, {"type": "generate_report", "format": "comprehensive"}], "parallel_execution": true}'),

('trust_score_calculation_workflow', 'Real-time trust score calculation with blockchain verification',
'{"steps": [{"type": "gather_attestations", "sources": ["internal", "expert", "regulatory"]}, {"type": "cryptographic_verification", "algorithm": "blake3"}, {"type": "calculate_trust_score", "engine": "rust_core"}, {"type": "blockchain_record", "network": "polygon"}], "performance_target_ms": 100}');

COMMENT ON DATABASE velocity_agents IS 'Velocity.ai Agent Management Database - Phase 1 Infrastructure';
COMMENT ON TABLE agent_instances IS 'Core agent instance management and configuration';
COMMENT ON TABLE agent_tasks IS 'Distributed task queue and execution tracking';
COMMENT ON TABLE agent_workflows IS 'Workflow definitions for agent orchestration';
COMMENT ON TABLE agent_metrics IS 'Performance and monitoring metrics for agents';
COMMENT ON TABLE agent_logs IS 'Comprehensive audit trail and logging';
COMMENT ON TABLE evidence_collection IS 'Compliance evidence tracking with cryptographic verification';
COMMENT ON TABLE agent_health_checks IS 'Agent health monitoring and status tracking';