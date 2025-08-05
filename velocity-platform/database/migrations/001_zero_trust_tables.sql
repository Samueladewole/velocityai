-- Zero Trust Architecture Database Schema
-- Migration: 001 - Initial Zero Trust Tables

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Trust Profiles
CREATE TABLE IF NOT EXISTS user_trust_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_trust_score DECIMAL(3,2) DEFAULT 0.50 CHECK (current_trust_score >= 0 AND current_trust_score <= 1),
    baseline_trust_score DECIMAL(3,2) DEFAULT 0.50,
    trust_history JSONB DEFAULT '[]',
    risk_factors JSONB DEFAULT '[]',
    last_assessment_at TIMESTAMP DEFAULT NOW(),
    assessment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Device Trust Profiles  
CREATE TABLE IF NOT EXISTS device_trust_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_fingerprint TEXT NOT NULL,
    device_name VARCHAR(255),
    device_type VARCHAR(50),
    operating_system VARCHAR(100),
    browser VARCHAR(100),
    is_trusted BOOLEAN DEFAULT FALSE,
    trust_score DECIMAL(3,2) DEFAULT 0.30,
    last_seen_at TIMESTAMP DEFAULT NOW(),
    first_seen_at TIMESTAMP DEFAULT NOW(),
    access_count INTEGER DEFAULT 0,
    risk_indicators JSONB DEFAULT '[]',
    geolocation_history JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(device_id, user_id)
);

-- User Sessions (Enhanced for Zero Trust)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    device_fingerprint TEXT,
    ip_address INET NOT NULL,
    user_agent TEXT,
    trust_score DECIMAL(3,2) DEFAULT 0.50,
    mfa_verified BOOLEAN DEFAULT FALSE,
    restrictions JSONB DEFAULT '[]',
    geolocation JSONB DEFAULT '{}',
    risk_factors JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    last_activity TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    blocked BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'
);

-- Behavior Sessions
CREATE TABLE IF NOT EXISTS behavior_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    typing_patterns JSONB DEFAULT '{}',
    mouse_movements JSONB DEFAULT '{}',
    navigation_events JSONB DEFAULT '[]',
    focus_events JSONB DEFAULT '[]',
    scroll_behavior JSONB DEFAULT '{}',
    last_activity TIMESTAMP DEFAULT NOW(),
    activity_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(session_id)
);

-- User Behavior Baselines
CREATE TABLE IF NOT EXISTS user_behavior_baselines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    average_typing_speed DECIMAL(6,2) DEFAULT 0,
    key_press_duration_avg DECIMAL(6,2) DEFAULT 0,
    key_interval_avg DECIMAL(6,2) DEFAULT 0,
    typing_rhythm_signature JSONB DEFAULT '[]',
    average_mouse_speed DECIMAL(6,2) DEFAULT 0,
    click_precision_score DECIMAL(3,2) DEFAULT 0,
    scroll_behavior_metrics JSONB DEFAULT '{}',
    common_pages JSONB DEFAULT '[]',
    typical_action_sequences JSONB DEFAULT '[]',
    typical_access_hours JSONB DEFAULT '[]',
    average_session_duration INTEGER DEFAULT 0,
    access_frequency DECIMAL(4,2) DEFAULT 0,
    baseline_confidence DECIMAL(3,2) DEFAULT 0.10,
    training_sample_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Behavior Analyses
CREATE TABLE IF NOT EXISTS behavior_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_anomaly BOOLEAN DEFAULT FALSE,
    confidence DECIMAL(3,2) DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'low',
    anomaly_details JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Behavior Anomalies
CREATE TABLE IF NOT EXISTS behavior_anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255),
    session_id VARCHAR(255),
    anomaly_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    confidence DECIMAL(3,2) DEFAULT 0.80,
    expected_value JSONB,
    observed_value JSONB,
    deviation_score DECIMAL(4,2),
    anomaly_details JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'detected',
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- Security Events
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'new',
    event_title VARCHAR(255),
    event_description TEXT,
    risk_score DECIMAL(3,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- Session Events (for session lifecycle tracking)
CREATE TABLE IF NOT EXISTS session_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Access Logs (Enhanced)
CREATE TABLE IF NOT EXISTS access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    method VARCHAR(10),
    path TEXT,
    ip_address INET,
    user_agent TEXT,
    response_status INTEGER,
    response_time INTEGER,
    trust_score DECIMAL(3,2),
    risk_factors JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW()
);

-- MFA Logs
CREATE TABLE IF NOT EXISTS mfa_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    method VARCHAR(20),
    outcome VARCHAR(20),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Events (Comprehensive audit trail)
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    event_type VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    device_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    resource VARCHAR(500),
    action VARCHAR(100) NOT NULL,
    outcome VARCHAR(20) NOT NULL,
    details JSONB DEFAULT '{}',
    risk_score DECIMAL(3,2),
    compliance_tags JSONB DEFAULT '[]',
    retention_period INTEGER DEFAULT 365
);

-- IP Analyses (Geolocation and threat intelligence)
CREATE TABLE IF NOT EXISTS ip_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address INET NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    geolocation_data JSONB NOT NULL,
    threat_intelligence JSONB NOT NULL,
    risk_assessment JSONB NOT NULL,
    velocity_check JSONB DEFAULT '{}',
    context JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- API Keys (for service-to-service authentication)
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(100) NOT NULL,
    service_id VARCHAR(100) NOT NULL,
    key_hash TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    permissions JSONB DEFAULT '[]',
    rate_limit INTEGER DEFAULT 1000,
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(service_id)
);

-- Update users table to include MFA fields if they don't exist
DO $$ 
BEGIN
    -- Add MFA fields to users table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'mfa_enabled') THEN
        ALTER TABLE users ADD COLUMN mfa_enabled BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'mfa_secret') THEN
        ALTER TABLE users ADD COLUMN mfa_secret TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'mfa_methods') THEN
        ALTER TABLE users ADD COLUMN mfa_methods JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'backup_codes') THEN
        ALTER TABLE users ADD COLUMN backup_codes JSONB DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone_number') THEN
        ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_trust_profiles_user_id ON user_trust_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_trust_profiles_trust_score ON user_trust_profiles(current_trust_score);

CREATE INDEX IF NOT EXISTS idx_device_trust_profiles_user_id ON device_trust_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_device_trust_profiles_device_id ON device_trust_profiles(device_id);
CREATE INDEX IF NOT EXISTS idx_device_trust_profiles_trust_score ON device_trust_profiles(trust_score);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_device_id ON user_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_ip_address ON user_sessions(ip_address);

CREATE INDEX IF NOT EXISTS idx_behavior_sessions_user_id ON behavior_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_behavior_sessions_session_id ON behavior_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_behavior_sessions_device_id ON behavior_sessions(device_id);

CREATE INDEX IF NOT EXISTS idx_behavior_analyses_user_id ON behavior_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_behavior_analyses_session_id ON behavior_analyses(session_id);
CREATE INDEX IF NOT EXISTS idx_behavior_analyses_created_at ON behavior_analyses(created_at);

CREATE INDEX IF NOT EXISTS idx_behavior_anomalies_user_id ON behavior_anomalies(user_id);
CREATE INDEX IF NOT EXISTS idx_behavior_anomalies_severity ON behavior_anomalies(severity);
CREATE INDEX IF NOT EXISTS idx_behavior_anomalies_created_at ON behavior_anomalies(created_at);

CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);

CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_ip_address ON access_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_access_logs_created_at ON access_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_category ON audit_events(category);
CREATE INDEX IF NOT EXISTS idx_audit_events_severity ON audit_events(severity);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON audit_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_events_event_type ON audit_events(event_type);

CREATE INDEX IF NOT EXISTS idx_ip_analyses_ip_address ON ip_analyses(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_analyses_user_id ON ip_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_ip_analyses_created_at ON ip_analyses(created_at);

CREATE INDEX IF NOT EXISTS idx_mfa_logs_user_id ON mfa_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_logs_created_at ON mfa_logs(created_at);

-- Update triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_trust_profiles_updated_at 
    BEFORE UPDATE ON user_trust_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_trust_profiles_updated_at 
    BEFORE UPDATE ON device_trust_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_behavior_baselines_updated_at 
    BEFORE UPDATE ON user_behavior_baselines 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for common queries
CREATE OR REPLACE VIEW user_security_summary AS
SELECT 
    u.id,
    u.email,
    u.mfa_enabled,
    utp.current_trust_score,
    utp.last_assessment_at,
    COUNT(DISTINCT dtp.device_id) as trusted_devices,
    COUNT(DISTINCT us.id) as active_sessions,
    COUNT(DISTINCT se.id) as recent_security_events
FROM users u
LEFT JOIN user_trust_profiles utp ON u.id = utp.user_id
LEFT JOIN device_trust_profiles dtp ON u.id = dtp.user_id AND dtp.is_trusted = true
LEFT JOIN user_sessions us ON u.id = us.user_id AND us.expires_at > NOW() AND us.blocked = false
LEFT JOIN security_events se ON u.id = se.user_id AND se.created_at > NOW() - INTERVAL '24 hours'
GROUP BY u.id, u.email, u.mfa_enabled, utp.current_trust_score, utp.last_assessment_at;

-- Create view for risk dashboard
CREATE OR REPLACE VIEW security_risk_dashboard AS
SELECT 
    DATE_TRUNC('hour', created_at) as hour,
    COUNT(*) as total_events,
    COUNT(*) FILTER (WHERE severity = 'critical') as critical_events,
    COUNT(*) FILTER (WHERE severity = 'high') as high_events,
    COUNT(*) FILTER (WHERE category = 'security') as security_events,
    AVG(risk_score) as avg_risk_score
FROM audit_events
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;

-- Insert default system user for service operations
INSERT INTO users (id, email, password_hash, role, email_verified, created_at)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'system@velocity.internal',
    crypt('system_password_' || gen_random_uuid(), gen_salt('bf')),
    'system',
    true,
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create initial trust profile for system user
INSERT INTO user_trust_profiles (user_id, current_trust_score, baseline_trust_score)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    1.0,
    1.0
) ON CONFLICT (user_id) DO NOTHING;

COMMIT;