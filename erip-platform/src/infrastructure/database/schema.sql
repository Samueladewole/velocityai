-- ERIP PostgreSQL Database Schema
-- Optimized for high-performance queries with proper indexing and partitioning

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ===============================
-- Core Tables
-- ===============================

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    size organization_size NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Trust Equity columns
    trust_score INTEGER DEFAULT 0,
    trust_tier trust_tier DEFAULT 'bronze',
    trust_equity_balance BIGINT DEFAULT 0,
    
    -- Configuration
    risk_appetite risk_appetite DEFAULT 'moderate',
    compliance_frameworks TEXT[] DEFAULT '{}',
    
    -- JSON metadata
    settings JSONB DEFAULT '{}',
    subscriptions TEXT[] DEFAULT '{}',
    
    -- Constraints
    CONSTRAINT trust_score_range CHECK (trust_score >= 0 AND trust_score <= 1000),
    CONSTRAINT trust_equity_positive CHECK (trust_equity_balance >= 0)
);

-- Custom ENUM types
CREATE TYPE organization_size AS ENUM ('small', 'medium', 'large', 'enterprise');
CREATE TYPE trust_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE risk_appetite AS ENUM ('conservative', 'moderate', 'aggressive');
CREATE TYPE severity_level AS ENUM ('info', 'low', 'medium', 'high', 'critical');
CREATE TYPE status_type AS ENUM ('open', 'in_progress', 'resolved', 'accepted');

-- Users table with RBAC
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(320) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'viewer',
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Activity tracking
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Trust metrics
    trust_points_contributed BIGINT DEFAULT 0,
    activity_score INTEGER DEFAULT 0,
    
    -- JSON fields for flexibility
    permissions JSONB DEFAULT '{}',
    component_access JSONB DEFAULT '{}'
);

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'analyst', 'viewer');

-- ===============================
-- COMPASS Tables
-- ===============================

-- Regulatory frameworks
CREATE TABLE regulatory_frameworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    industry TEXT[] DEFAULT '{}',
    
    -- Metadata
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    effective_date DATE NOT NULL,
    
    -- Trust Equity configuration
    trust_equity_weight NUMERIC(3,2) DEFAULT 1.0,
    base_points_per_requirement INTEGER DEFAULT 10,
    
    -- Full text search
    search_vector tsvector,
    
    UNIQUE(name, version)
);

-- Framework requirements
CREATE TABLE framework_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    framework_id UUID NOT NULL REFERENCES regulatory_frameworks(id) ON DELETE CASCADE,
    section VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type requirement_type NOT NULL,
    mandatory BOOLEAN DEFAULT true,
    
    -- Implementation guidance
    implementation_guidance TEXT[],
    acceptable_methods TEXT[],
    evidence_types TEXT[],
    
    -- Risk and scoring
    risk_level severity_level DEFAULT 'medium',
    trust_points_value INTEGER DEFAULT 10,
    multipliers JSONB DEFAULT '{}',
    
    -- Search optimization
    search_vector tsvector
);

CREATE TYPE requirement_type AS ENUM ('policy', 'technical', 'procedural', 'documentation');

-- Compliance status tracking
CREATE TABLE compliance_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requirement_id UUID NOT NULL REFERENCES framework_requirements(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Compliance details
    status compliance_status_enum NOT NULL DEFAULT 'not_assessed',
    score INTEGER DEFAULT 0,
    
    -- Assessment tracking
    last_assessed TIMESTAMP WITH TIME ZONE,
    assessed_by UUID REFERENCES users(id),
    next_assessment_due TIMESTAMP WITH TIME ZONE,
    
    -- Automation
    automation_level INTEGER DEFAULT 0,
    monitoring_enabled BOOLEAN DEFAULT false,
    
    -- Constraints
    CONSTRAINT score_range CHECK (score >= 0 AND score <= 100),
    CONSTRAINT automation_range CHECK (automation_level >= 0 AND automation_level <= 100),
    
    -- Unique constraint
    UNIQUE(requirement_id, organization_id)
);

CREATE TYPE compliance_status_enum AS ENUM ('compliant', 'partial', 'non_compliant', 'not_assessed');

-- Compliance gaps tracking
CREATE TABLE compliance_gaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requirement_id UUID NOT NULL REFERENCES framework_requirements(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Gap details
    title VARCHAR(500) NOT NULL,
    description TEXT,
    severity severity_level NOT NULL,
    
    -- Remediation planning
    estimated_cost NUMERIC(12,2) DEFAULT 0,
    estimated_time_to_resolve INTEGER DEFAULT 0, -- days
    
    -- Trust Equity impact
    trust_equity_at_risk INTEGER DEFAULT 0,
    business_impact TEXT,
    
    -- Tracking
    status status_type DEFAULT 'open',
    assignee UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- ===============================
-- ATLAS Tables  
-- ===============================

-- Assets inventory
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type asset_type NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Technical details
    ip_addresses INET[],
    hostnames TEXT[],
    operating_system VARCHAR(100),
    version VARCHAR(50),
    
    -- Classification
    criticality severity_level DEFAULT 'medium',
    classification data_classification DEFAULT 'internal',
    data_types TEXT[],
    
    -- Business context
    location VARCHAR(255),
    owner UUID REFERENCES users(id),
    business_function VARCHAR(255),
    
    -- Trust and risk metrics
    trust_contribution INTEGER DEFAULT 0,
    risk_exposure NUMERIC(12,2) DEFAULT 0,
    
    -- Compliance
    compliance_frameworks TEXT[],
    last_assessment TIMESTAMP WITH TIME ZONE,
    
    -- Lifecycle
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    decommissioned_at TIMESTAMP WITH TIME ZONE
);

CREATE TYPE asset_type AS ENUM ('server', 'application', 'database', 'network', 'cloud_service', 'endpoint');
CREATE TYPE data_classification AS ENUM ('public', 'internal', 'confidential', 'restricted');

-- Security controls
CREATE TABLE security_controls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    type control_type NOT NULL,
    category VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Implementation status
    implementation_status implementation_status_enum DEFAULT 'not_implemented',
    effectiveness INTEGER DEFAULT 0,
    automation_level INTEGER DEFAULT 0,
    
    -- Testing
    last_tested TIMESTAMP WITH TIME ZONE,
    
    -- Trust Equity
    trust_points_generated INTEGER DEFAULT 0,
    risk_reduction NUMERIC(12,2) DEFAULT 0,
    
    -- Constraints
    CONSTRAINT effectiveness_range CHECK (effectiveness >= 0 AND effectiveness <= 100),
    CONSTRAINT automation_range CHECK (automation_level >= 0 AND automation_level <= 100)
);

CREATE TYPE control_type AS ENUM ('preventive', 'detective', 'corrective');
CREATE TYPE implementation_status_enum AS ENUM ('not_implemented', 'partial', 'implemented', 'optimized');

-- Vulnerabilities
CREATE TABLE vulnerabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    cve_id VARCHAR(20),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    
    -- Scoring
    cvss_score NUMERIC(3,1) DEFAULT 0.0,
    severity severity_level NOT NULL,
    exploitability NUMERIC(3,1) DEFAULT 0.0,
    
    -- Details
    affected_components TEXT[],
    attack_vector attack_vector_enum DEFAULT 'network',
    
    -- Remediation
    remediation_steps TEXT[],
    patch_available BOOLEAN DEFAULT false,
    workarounds TEXT[],
    
    -- Risk assessment
    risk_score NUMERIC(5,2) DEFAULT 0,
    business_impact NUMERIC(12,2) DEFAULT 0,
    likelihood NUMERIC(3,2) DEFAULT 0,
    
    -- Lifecycle
    discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    status status_type DEFAULT 'open',
    
    -- Trust impact
    trust_equity_impact INTEGER DEFAULT 0,
    
    -- Constraints
    CONSTRAINT cvss_range CHECK (cvss_score >= 0.0 AND cvss_score <= 10.0),
    CONSTRAINT exploitability_range CHECK (exploitability >= 0.0 AND exploitability <= 10.0)
);

CREATE TYPE attack_vector_enum AS ENUM ('network', 'adjacent', 'local', 'physical');

-- ===============================
-- PRISM Tables
-- ===============================

-- Risk scenarios
CREATE TABLE risk_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    
    -- Risk calculation
    probability NUMERIC(5,4) NOT NULL, -- 0.0000 to 1.0000
    impact NUMERIC(15,2) NOT NULL,     -- dollar amount
    ale NUMERIC(15,2) GENERATED ALWAYS AS (probability * impact) STORED,
    sle NUMERIC(15,2) DEFAULT 0,       -- Single Loss Expectancy
    aro NUMERIC(8,4) DEFAULT 0,        -- Annual Rate of Occurrence
    
    -- Monte Carlo results
    simulation_results JSONB,
    confidence_interval JSONB,
    
    -- Mitigation
    residual_risk NUMERIC(15,2) DEFAULT 0,
    cost_of_mitigation NUMERIC(12,2) DEFAULT 0,
    
    -- Business context
    affected_assets UUID[],
    affected_processes TEXT[],
    regulatory_implications TEXT[],
    
    -- Trust Equity
    trust_equity_required INTEGER DEFAULT 0,
    trust_equity_at_risk INTEGER DEFAULT 0,
    
    -- Lifecycle
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_reviewed TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT probability_range CHECK (probability >= 0 AND probability <= 1),
    CONSTRAINT positive_amounts CHECK (impact >= 0 AND sle >= 0 AND residual_risk >= 0)
);

-- Mitigation controls
CREATE TABLE mitigation_controls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_scenario_id UUID NOT NULL REFERENCES risk_scenarios(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type control_type NOT NULL,
    
    -- Effectiveness
    risk_reduction NUMERIC(5,2) DEFAULT 0, -- percentage
    cost NUMERIC(12,2) DEFAULT 0,
    implementation_time INTEGER DEFAULT 0, -- days
    
    -- Implementation
    status mitigation_status DEFAULT 'planned',
    assignee UUID REFERENCES users(id),
    due_date DATE,
    
    -- Dependencies
    prerequisites TEXT[],
    dependencies TEXT[],
    
    -- Trust Equity
    trust_equity_generated INTEGER DEFAULT 0,
    
    -- Constraints
    CONSTRAINT risk_reduction_range CHECK (risk_reduction >= 0 AND risk_reduction <= 100)
);

CREATE TYPE mitigation_status AS ENUM ('planned', 'in_progress', 'implemented', 'verified');

-- ===============================
-- PULSE Tables
-- ===============================

-- Monitoring metrics configuration
CREATE TABLE monitoring_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category metric_category NOT NULL,
    data_type metric_data_type NOT NULL,
    
    -- Collection configuration
    source VARCHAR(255) NOT NULL,
    collection_interval INTEGER DEFAULT 300, -- seconds
    retention INTEGER DEFAULT 90,           -- days
    
    -- Thresholds
    warning_threshold NUMERIC,
    critical_threshold NUMERIC,
    
    -- Processing
    aggregation aggregation_type DEFAULT 'avg',
    smoothing smoothing_type DEFAULT 'none',
    
    -- Alerting
    alert_enabled BOOLEAN DEFAULT true,
    alert_template TEXT,
    
    -- Trust Equity
    trust_equity_weight NUMERIC(3,2) DEFAULT 1.0,
    
    -- Unique constraint on name per organization
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    UNIQUE(name, organization_id)
);

CREATE TYPE metric_category AS ENUM ('security', 'performance', 'availability', 'compliance');
CREATE TYPE metric_data_type AS ENUM ('gauge', 'counter', 'histogram', 'summary');
CREATE TYPE aggregation_type AS ENUM ('sum', 'avg', 'min', 'max', 'count');
CREATE TYPE smoothing_type AS ENUM ('none', 'moving_average', 'exponential');

-- Time-series data for metrics (partitioned by month)
CREATE TABLE metric_data (
    metric_id UUID NOT NULL REFERENCES monitoring_metrics(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    value NUMERIC NOT NULL,
    tags JSONB DEFAULT '{}',
    
    PRIMARY KEY (metric_id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Create monthly partitions (automation script would create future partitions)
CREATE TABLE metric_data_2025_07 PARTITION OF metric_data
    FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity severity_level NOT NULL,
    
    -- Source information
    source VARCHAR(255) NOT NULL,
    metric_id UUID REFERENCES monitoring_metrics(id),
    asset_id UUID REFERENCES assets(id),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Alert data
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    value NUMERIC,
    threshold NUMERIC,
    
    -- Correlation
    correlated_alerts UUID[],
    root_cause TEXT,
    
    -- Response
    status alert_status DEFAULT 'open',
    assignee UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Automation
    auto_remediation_triggered BOOLEAN DEFAULT false,
    
    -- Business impact
    affected_services TEXT[],
    estimated_impact NUMERIC(12,2) DEFAULT 0,
    
    -- Trust Equity
    trust_equity_impact INTEGER DEFAULT 0
);

CREATE TYPE alert_status AS ENUM ('open', 'acknowledged', 'in_progress', 'resolved', 'false_positive');

-- ===============================
-- Trust Equity Tables
-- ===============================

-- Trust Equity transactions (partitioned by date)
CREATE TABLE trust_equity_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL,
    entity_type entity_type NOT NULL,
    
    -- Transaction details
    type transaction_type NOT NULL,
    amount BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    
    -- Source information
    source erip_component NOT NULL,
    source_id UUID NOT NULL,
    category trust_category NOT NULL,
    
    -- Metadata
    description TEXT NOT NULL,
    evidence TEXT[],
    multiplier NUMERIC(3,2) DEFAULT 1.0,
    
    -- Lifecycle
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    reversed_at TIMESTAMP WITH TIME ZONE,
    reversal_reason TEXT,
    
    -- Indexing for performance
    INDEX (entity_id, timestamp DESC),
    INDEX (entity_type, timestamp DESC),
    INDEX (source, timestamp DESC)
) PARTITION BY RANGE (timestamp);

CREATE TYPE entity_type AS ENUM ('organization', 'user', 'asset');
CREATE TYPE transaction_type AS ENUM ('earned', 'spent', 'expired', 'adjusted');
CREATE TYPE erip_component AS ENUM ('compass', 'atlas', 'prism', 'pulse', 'cipher', 'nexus', 'beacon', 'clearance');
CREATE TYPE trust_category AS ENUM ('compliance', 'security', 'risk_management', 'automation', 'intelligence');

-- Create monthly partitions for trust equity transactions
CREATE TABLE trust_equity_transactions_2025_07 PARTITION OF trust_equity_transactions
    FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');

-- Current trust scores (updated via triggers)
CREATE TABLE trust_scores (
    entity_id UUID NOT NULL,
    entity_type entity_type NOT NULL,
    
    -- Overall score
    total_score INTEGER NOT NULL DEFAULT 0,
    tier trust_tier NOT NULL DEFAULT 'bronze',
    
    -- Component breakdown
    compliance_score INTEGER DEFAULT 0,
    security_score INTEGER DEFAULT 0,
    risk_management_score INTEGER DEFAULT 0,
    automation_score INTEGER DEFAULT 0,
    intelligence_score INTEGER DEFAULT 0,
    
    -- Trending
    previous_score INTEGER DEFAULT 0,
    change INTEGER DEFAULT 0,
    trend trend_direction DEFAULT 'stable',
    
    -- Metadata
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    calculation_version VARCHAR(10) DEFAULT '1.0',
    
    -- Benchmarking
    industry_percentile INTEGER,
    size_percentile INTEGER,
    
    -- Primary key
    PRIMARY KEY (entity_id, entity_type),
    
    -- Constraints
    CONSTRAINT score_ranges CHECK (
        total_score >= 0 AND
        compliance_score >= 0 AND security_score >= 0 AND
        risk_management_score >= 0 AND automation_score >= 0 AND
        intelligence_score >= 0
    )
);

CREATE TYPE trend_direction AS ENUM ('up', 'down', 'stable');

-- ===============================
-- Supporting Tables
-- ===============================

-- Evidence repository
CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type evidence_type NOT NULL,
    
    -- File information
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    
    -- Storage
    storage_location TEXT NOT NULL,
    access_url TEXT,
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    categories TEXT[] DEFAULT '{}',
    
    -- Verification
    verification_status verification_status_enum DEFAULT 'unverified',
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    expiry_date DATE,
    
    -- Organization
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Lifecycle
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    -- Full text search
    search_vector tsvector
);

CREATE TYPE evidence_type AS ENUM ('document', 'screenshot', 'report', 'certificate', 'policy', 'procedure');
CREATE TYPE verification_status_enum AS ENUM ('unverified', 'verified', 'expired', 'invalid');

-- Framework mappings (many-to-many relationships)
CREATE TABLE framework_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type mapping_entity_type NOT NULL,
    entity_id UUID NOT NULL,
    framework_id UUID NOT NULL REFERENCES regulatory_frameworks(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES framework_requirements(id) ON DELETE CASCADE,
    
    -- Mapping details
    mapping_type mapping_type_enum NOT NULL DEFAULT 'direct',
    confidence INTEGER DEFAULT 100,
    notes TEXT,
    
    -- Lifecycle
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT confidence_range CHECK (confidence >= 0 AND confidence <= 100),
    UNIQUE(entity_type, entity_id, framework_id, requirement_id)
);

CREATE TYPE mapping_entity_type AS ENUM ('evidence', 'security_control', 'asset', 'risk_scenario');
CREATE TYPE mapping_type_enum AS ENUM ('direct', 'partial', 'supporting');

-- ===============================
-- Indexes for Performance
-- ===============================

-- Organizations
CREATE INDEX idx_organizations_industry ON organizations(industry);
CREATE INDEX idx_organizations_size ON organizations(size);
CREATE INDEX idx_organizations_trust_tier ON organizations(trust_tier);

-- Users
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_last_login ON users(last_login DESC);

-- Compliance
CREATE INDEX idx_compliance_status_org ON compliance_status(organization_id);
CREATE INDEX idx_compliance_status_framework ON compliance_status(requirement_id);
CREATE INDEX idx_compliance_gaps_severity ON compliance_gaps(severity, status);
CREATE INDEX idx_compliance_gaps_assignee ON compliance_gaps(assignee) WHERE assignee IS NOT NULL;

-- Assets
CREATE INDEX idx_assets_organization ON assets(organization_id);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_criticality ON assets(criticality);
CREATE INDEX idx_assets_ip_addresses ON assets USING GIN(ip_addresses);

-- Vulnerabilities  
CREATE INDEX idx_vulnerabilities_severity ON vulnerabilities(severity, status);
CREATE INDEX idx_vulnerabilities_asset ON vulnerabilities(asset_id);
CREATE INDEX idx_vulnerabilities_cvss ON vulnerabilities(cvss_score DESC);

-- Risk scenarios
CREATE INDEX idx_risk_scenarios_org ON risk_scenarios(organization_id);
CREATE INDEX idx_risk_scenarios_ale ON risk_scenarios(ale DESC);
CREATE INDEX idx_risk_scenarios_category ON risk_scenarios(category);

-- Alerts
CREATE INDEX idx_alerts_organization ON alerts(organization_id);
CREATE INDEX idx_alerts_severity_status ON alerts(severity, status);
CREATE INDEX idx_alerts_triggered_at ON alerts(triggered_at DESC);
CREATE INDEX idx_alerts_assignee ON alerts(assignee) WHERE assignee IS NOT NULL;

-- Trust Equity
CREATE INDEX idx_trust_transactions_entity ON trust_equity_transactions(entity_id, timestamp DESC);
CREATE INDEX idx_trust_transactions_source ON trust_equity_transactions(source, timestamp DESC);
CREATE INDEX idx_trust_scores_tier ON trust_scores(tier);
CREATE INDEX idx_trust_scores_total ON trust_scores(total_score DESC);

-- Evidence
CREATE INDEX idx_evidence_organization ON evidence(organization_id);
CREATE INDEX idx_evidence_type ON evidence(type);
CREATE INDEX idx_evidence_verification ON evidence(verification_status);
CREATE INDEX idx_evidence_search ON evidence USING GIN(search_vector);

-- Full text search indexes
CREATE INDEX idx_frameworks_search ON regulatory_frameworks USING GIN(search_vector);
CREATE INDEX idx_requirements_search ON framework_requirements USING GIN(search_vector);

-- ===============================
-- Triggers for Search Vectors
-- ===============================

-- Trigger function for updating search vectors
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'regulatory_frameworks' THEN
        NEW.search_vector := to_tsvector('english', 
            COALESCE(NEW.name, '') || ' ' ||
            COALESCE(NEW.jurisdiction, '') || ' ' ||
            array_to_string(NEW.industry, ' ')
        );
    ELSIF TG_TABLE_NAME = 'framework_requirements' THEN
        NEW.search_vector := to_tsvector('english',
            COALESCE(NEW.title, '') || ' ' ||
            COALESCE(NEW.description, '') || ' ' ||
            COALESCE(NEW.section, '')
        );
    ELSIF TG_TABLE_NAME = 'evidence' THEN
        NEW.search_vector := to_tsvector('english',
            COALESCE(NEW.title, '') || ' ' ||
            COALESCE(NEW.description, '') || ' ' ||
            array_to_string(NEW.tags, ' ')
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER regulatory_frameworks_search_vector_update
    BEFORE INSERT OR UPDATE ON regulatory_frameworks
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER framework_requirements_search_vector_update
    BEFORE INSERT OR UPDATE ON framework_requirements
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER evidence_search_vector_update
    BEFORE INSERT OR UPDATE ON evidence
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- ===============================
-- Functions for Trust Score Calculation
-- ===============================

-- Function to calculate trust score from transactions
CREATE OR REPLACE FUNCTION calculate_trust_score(p_entity_id UUID, p_entity_type entity_type)
RETURNS INTEGER AS $$
DECLARE
    v_total_score INTEGER := 0;
    v_compliance INTEGER := 0;
    v_security INTEGER := 0;
    v_risk_mgmt INTEGER := 0;
    v_automation INTEGER := 0;
    v_intelligence INTEGER := 0;
BEGIN
    -- Calculate scores by category from recent transactions (last 12 months)
    SELECT 
        COALESCE(SUM(CASE WHEN category = 'compliance' THEN amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN category = 'security' THEN amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN category = 'risk_management' THEN amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN category = 'automation' THEN amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN category = 'intelligence' THEN amount ELSE 0 END), 0)
    INTO v_compliance, v_security, v_risk_mgmt, v_automation, v_intelligence
    FROM trust_equity_transactions
    WHERE entity_id = p_entity_id 
        AND entity_type = p_entity_type
        AND timestamp >= NOW() - INTERVAL '12 months'
        AND type IN ('earned', 'adjusted');
    
    v_total_score := v_compliance + v_security + v_risk_mgmt + v_automation + v_intelligence;
    
    RETURN GREATEST(0, LEAST(1000, v_total_score));
END;
$$ LANGUAGE plpgsql;

-- ===============================
-- Views for Common Queries
-- ===============================

-- Organization compliance overview
CREATE VIEW organization_compliance_overview AS
SELECT 
    o.id,
    o.name,
    o.trust_score,
    o.trust_tier,
    COUNT(cs.id) as total_requirements,
    COUNT(cs.id) FILTER (WHERE cs.status = 'compliant') as compliant_requirements,
    COUNT(cs.id) FILTER (WHERE cs.status = 'non_compliant') as non_compliant_requirements,
    COUNT(cg.id) as open_gaps,
    COUNT(cg.id) FILTER (WHERE cg.severity IN ('high', 'critical')) as critical_gaps
FROM organizations o
LEFT JOIN compliance_status cs ON o.id = cs.organization_id
LEFT JOIN compliance_gaps cg ON o.id = cg.organization_id AND cg.status = 'open'
GROUP BY o.id, o.name, o.trust_score, o.trust_tier;

-- Asset security overview
CREATE VIEW asset_security_overview AS
SELECT 
    a.id,
    a.name,
    a.type,
    a.criticality,
    COUNT(sc.id) as total_controls,
    COUNT(sc.id) FILTER (WHERE sc.implementation_status = 'implemented') as implemented_controls,
    COUNT(v.id) as total_vulnerabilities,
    COUNT(v.id) FILTER (WHERE v.severity IN ('high', 'critical') AND v.status = 'open') as critical_vulnerabilities,
    MAX(v.cvss_score) as highest_cvss_score
FROM assets a
LEFT JOIN security_controls sc ON a.id = sc.asset_id
LEFT JOIN vulnerabilities v ON a.id = v.asset_id
GROUP BY a.id, a.name, a.type, a.criticality;