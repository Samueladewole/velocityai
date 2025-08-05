-- Zero Trust Database Schemas
-- Comprehensive data models for Zero Trust implementation

-- User Trust Profiles
CREATE TABLE user_trust_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_trust_score DECIMAL(3,2) NOT NULL DEFAULT 0.30 CHECK (current_trust_score >= 0 AND current_trust_score <= 1),
    baseline_trust_score DECIMAL(3,2) NOT NULL DEFAULT 0.30,
    trust_trend VARCHAR(20) NOT NULL DEFAULT 'stable' CHECK (trust_trend IN ('improving', 'stable', 'declining')),
    risk_level VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    assessment_count INTEGER NOT NULL DEFAULT 0,
    last_assessment_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexing for performance
    INDEX idx_user_trust_user_id (user_id),
    INDEX idx_user_trust_score (current_trust_score),
    INDEX idx_user_trust_updated (updated_at)
);

-- Device Trust Records
CREATE TABLE device_trust_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(128) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_fingerprint_hash VARCHAR(256) NOT NULL,
    trust_score DECIMAL(3,2) NOT NULL DEFAULT 0.30 CHECK (trust_score >= 0 AND trust_score <= 1),
    status VARCHAR(20) NOT NULL DEFAULT 'learning' CHECK (status IN ('learning', 'trusted', 'suspicious', 'blocked')),
    
    -- Device metadata
    user_agent TEXT,
    platform VARCHAR(50),
    screen_resolution VARCHAR(20),
    timezone VARCHAR(50),
    language VARCHAR(10),
    
    -- Trust building
    usage_count INTEGER NOT NULL DEFAULT 0,
    anomaly_count INTEGER NOT NULL DEFAULT 0,
    learning_period_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    learning_period_end TIMESTAMP WITH TIME ZONE,
    
    -- Location data
    first_seen_ip INET,
    first_seen_country VARCHAR(2),
    first_seen_city VARCHAR(100),
    last_seen_ip INET,
    last_seen_country VARCHAR(2),
    last_seen_city VARCHAR(100),
    
    -- Timestamps
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexing
    INDEX idx_device_trust_user_id (user_id),
    INDEX idx_device_trust_device_id (device_id),
    INDEX idx_device_trust_status (status),
    INDEX idx_device_trust_score (trust_score),
    INDEX idx_device_fingerprint (device_fingerprint_hash)
);

-- Device Fingerprint Components (detailed fingerprint storage)
CREATE TABLE device_fingerprint_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_trust_id UUID NOT NULL REFERENCES device_trust_records(id) ON DELETE CASCADE,
    
    -- Browser/Device characteristics
    user_agent TEXT,
    screen_width INTEGER,
    screen_height INTEGER,
    color_depth INTEGER,
    timezone VARCHAR(50),
    language VARCHAR(10),
    platform VARCHAR(50),
    
    -- Capabilities
    cookies_enabled BOOLEAN DEFAULT true,
    local_storage_enabled BOOLEAN DEFAULT true,
    session_storage_enabled BOOLEAN DEFAULT true,
    indexed_db_enabled BOOLEAN DEFAULT true,
    
    -- Advanced fingerprinting
    webgl_vendor VARCHAR(200),
    webgl_renderer VARCHAR(200),
    canvas_fingerprint VARCHAR(64),
    audio_fingerprint VARCHAR(64),
    font_list TEXT,
    plugin_list TEXT,
    hardware_concurrency INTEGER,
    device_memory INTEGER,
    
    -- Network characteristics
    connection_type VARCHAR(20),
    effective_type VARCHAR(10),
    downlink DECIMAL(5,2),
    rtt INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_fingerprint_device_id (device_trust_id)
);

-- Trust Assessment History
CREATE TABLE trust_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(128) REFERENCES device_trust_records(device_id),
    session_id VARCHAR(128),
    
    -- Assessment results
    overall_trust_score DECIMAL(3,2) NOT NULL CHECK (overall_trust_score >= 0 AND overall_trust_score <= 1),
    confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    
    -- Individual signal scores
    device_trust_signal DECIMAL(3,2) CHECK (device_trust_signal >= 0 AND device_trust_signal <= 1),
    behavior_trust_signal DECIMAL(3,2) CHECK (behavior_trust_signal >= 0 AND behavior_trust_signal <= 1),
    location_trust_signal DECIMAL(3,2) CHECK (location_trust_signal >= 0 AND location_trust_signal <= 1),
    temporal_trust_signal DECIMAL(3,2) CHECK (temporal_trust_signal >= 0 AND temporal_trust_signal <= 1),
    
    -- Risk factors
    risk_factors JSONB,
    user_experience_impact VARCHAR(20) CHECK (user_experience_impact IN ('none', 'minimal', 'moderate')),
    requires_step_up BOOLEAN NOT NULL DEFAULT false,
    
    -- Request context
    ip_address INET,
    user_agent TEXT,
    request_headers JSONB,
    geolocation JSONB,
    
    -- Processing metadata
    assessment_duration_ms INTEGER,
    assessment_version VARCHAR(10) DEFAULT '1.0',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexing for analytics
    INDEX idx_trust_assessment_user_id (user_id),
    INDEX idx_trust_assessment_device_id (device_id),
    INDEX idx_trust_assessment_score (overall_trust_score),
    INDEX idx_trust_assessment_created (created_at),
    INDEX idx_trust_assessment_risk (requires_step_up)
);

-- Authentication Challenges
CREATE TABLE auth_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id VARCHAR(128) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trust_assessment_id UUID REFERENCES trust_assessments(id),
    
    -- Challenge details
    challenge_type VARCHAR(30) NOT NULL CHECK (challenge_type IN ('push_notification', 'sms', 'totp', 'biometric', 'email_verification', 'security_questions')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'expired', 'cancelled')),
    
    -- User experience
    user_friendly_title VARCHAR(200),
    message TEXT,
    estimated_time_seconds INTEGER,
    fallback_methods JSONB,
    skip_option BOOLEAN DEFAULT false,
    
    -- Challenge metadata
    required_security_level INTEGER NOT NULL,
    friction_score INTEGER NOT NULL,
    
    -- Timing
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Result
    verification_result JSONB,
    trust_boost DECIMAL(3,2) DEFAULT 0.00,
    failure_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_auth_challenge_user_id (user_id),
    INDEX idx_auth_challenge_status (status),
    INDEX idx_auth_challenge_type (challenge_type),
    INDEX idx_auth_challenge_expires (expires_at)
);

-- User Behavior Baselines
CREATE TABLE user_behavior_baselines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Temporal patterns
    typical_access_hours JSONB, -- Array of hour preferences [0-23]
    typical_access_days JSONB,  -- Day of week patterns
    average_session_duration INTEGER, -- Minutes
    
    -- Navigation patterns
    common_pages JSONB, -- Frequently visited pages
    typical_action_sequences JSONB, -- Common user flows
    navigation_speed_metrics JSONB, -- Click/navigation timing
    
    -- Typing patterns (keystroke dynamics)
    average_typing_speed INTEGER, -- WPM
    key_press_duration_avg INTEGER, -- Milliseconds
    key_interval_avg INTEGER, -- Milliseconds between keys
    typing_rhythm_signature JSONB, -- Detailed timing patterns
    
    -- Mouse/touch patterns
    average_mouse_speed DECIMAL(8,2),
    click_precision_score DECIMAL(3,2),
    scroll_behavior_metrics JSONB,
    
    -- Device usage patterns
    preferred_screen_resolution VARCHAR(20),
    typical_browser_window_size JSONB,
    zoom_level_preference INTEGER,
    
    -- Learning metadata
    baseline_confidence DECIMAL(3,2) NOT NULL DEFAULT 0.10,
    training_sample_count INTEGER NOT NULL DEFAULT 0,
    last_training_session TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_behavior_baseline_user_id (user_id),
    INDEX idx_behavior_baseline_confidence (baseline_confidence)
);

-- Behavior Anomaly Detection
CREATE TABLE behavior_anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(128) REFERENCES device_trust_records(device_id),
    session_id VARCHAR(128),
    
    -- Anomaly details
    anomaly_type VARCHAR(50) NOT NULL CHECK (anomaly_type IN ('temporal', 'navigation', 'typing', 'mouse', 'location', 'device', 'velocity')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    
    -- Anomaly data
    expected_value JSONB,
    observed_value JSONB,
    deviation_score DECIMAL(5,2),
    anomaly_details JSONB,
    
    -- Context
    baseline_reference UUID REFERENCES user_behavior_baselines(id),
    contextual_factors JSONB,
    
    -- Resolution
    status VARCHAR(20) NOT NULL DEFAULT 'detected' CHECK (status IN ('detected', 'investigating', 'confirmed', 'false_positive', 'resolved')),
    investigation_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_behavior_anomaly_user_id (user_id),
    INDEX idx_behavior_anomaly_type (anomaly_type),
    INDEX idx_behavior_anomaly_severity (severity),
    INDEX idx_behavior_anomaly_created (created_at)
);

-- Location Intelligence
CREATE TABLE user_location_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(128) REFERENCES device_trust_records(device_id),
    
    -- Location data
    ip_address INET NOT NULL,
    country_code VARCHAR(2),
    country_name VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    accuracy_radius INTEGER,
    
    -- ISP/Organization
    isp VARCHAR(200),
    organization VARCHAR(200),
    
    -- Risk assessment
    is_vpn BOOLEAN DEFAULT false,
    is_proxy BOOLEAN DEFAULT false,
    is_tor BOOLEAN DEFAULT false,
    is_hosting_provider BOOLEAN DEFAULT false,
    threat_intelligence_score DECIMAL(3,2) DEFAULT 0.00,
    
    -- Usage statistics
    visit_count INTEGER NOT NULL DEFAULT 1,
    total_session_duration INTEGER DEFAULT 0, -- Minutes
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Trust building
    location_trust_score DECIMAL(3,2) DEFAULT 0.30,
    is_trusted_location BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_location_history_user_id (user_id),
    INDEX idx_location_history_ip (ip_address),
    INDEX idx_location_history_country (country_code),
    INDEX idx_location_history_trust (is_trusted_location),
    INDEX idx_location_history_risk (threat_intelligence_score)
);

-- Security Events Log
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(128) REFERENCES device_trust_records(device_id),
    session_id VARCHAR(128),
    
    -- Event classification
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('login_attempt', 'trust_assessment', 'challenge_issued', 'challenge_completed', 'anomaly_detected', 'device_registered', 'location_change', 'risk_elevated', 'access_blocked')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failure', 'pending', 'blocked')),
    
    -- Event details
    event_title VARCHAR(200),
    event_description TEXT,
    event_data JSONB,
    
    -- Risk and trust impact
    risk_score DECIMAL(3,2),
    trust_impact DECIMAL(3,2), -- Can be negative for trust reduction
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    request_headers JSONB,
    geolocation JSONB,
    
    -- Processing
    detection_method VARCHAR(100), -- Which system detected this
    confidence DECIMAL(3,2),
    false_positive_likelihood DECIMAL(3,2),
    
    -- Response
    automated_response JSONB, -- What actions were taken automatically
    requires_human_review BOOLEAN DEFAULT false,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Partitioning by month for performance
    PARTITION BY RANGE (created_at),
    
    INDEX idx_security_events_user_id (user_id),
    INDEX idx_security_events_type (event_type),
    INDEX idx_security_events_severity (severity),
    INDEX idx_security_events_created (created_at),
    INDEX idx_security_events_review (requires_human_review)
);

-- Zero Trust Configuration
CREATE TABLE zero_trust_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value JSONB NOT NULL,
    config_description TEXT,
    environment VARCHAR(20) DEFAULT 'production' CHECK (environment IN ('development', 'staging', 'production')),
    
    -- Version control
    version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    
    -- Validation
    schema_version VARCHAR(10) DEFAULT '1.0',
    last_validated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    
    INDEX idx_zero_trust_config_key (config_key),
    INDEX idx_zero_trust_config_active (is_active),
    INDEX idx_zero_trust_config_env (environment)
);

-- Insert default configuration
INSERT INTO zero_trust_config (config_key, config_value, config_description) VALUES
('trust_thresholds', '{"high": 0.8, "medium": 0.6, "low": 0.4, "blocked": 0.2}', 'Trust score thresholds for different access levels'),
('signal_weights', '{"device": 0.35, "behavior": 0.25, "location": 0.25, "temporal": 0.15}', 'Weights for different trust signals'),
('learning_period_days', '7', 'Device learning period in days'),
('max_anomalies_per_hour', '5', 'Maximum anomalies before triggering review'),
('challenge_expiry_minutes', '5', 'Authentication challenge expiry time'),
('session_assessment_interval', '300', 'Seconds between continuous assessments'),
('enable_behavioral_learning', 'true', 'Enable behavioral pattern learning'),
('enable_location_intelligence', 'true', 'Enable location-based risk assessment'),
('notification_preferences', '{"device_learning": true, "trust_improvements": true, "security_alerts": true}', 'Default user notification preferences');

-- Views for analytics and monitoring

-- Trust Score Distribution
CREATE VIEW trust_score_distribution AS
SELECT 
    CASE 
        WHEN current_trust_score >= 0.8 THEN 'High (0.8+)'
        WHEN current_trust_score >= 0.6 THEN 'Medium (0.6-0.8)'
        WHEN current_trust_score >= 0.4 THEN 'Low (0.4-0.6)'
        ELSE 'Critical (<0.4)'
    END AS trust_level,
    COUNT(*) as user_count,
    ROUND(AVG(current_trust_score), 3) as avg_score
FROM user_trust_profiles 
GROUP BY trust_level
ORDER BY avg_score DESC;

-- Device Trust Summary
CREATE VIEW device_trust_summary AS
SELECT 
    status,
    COUNT(*) as device_count,
    ROUND(AVG(trust_score), 3) as avg_trust_score,
    ROUND(AVG(usage_count), 1) as avg_usage_count
FROM device_trust_records 
GROUP BY status
ORDER BY avg_trust_score DESC;

-- Daily Security Events
CREATE VIEW daily_security_events AS
SELECT 
    DATE(created_at) as event_date,
    event_type,
    severity,
    COUNT(*) as event_count
FROM security_events 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at), event_type, severity
ORDER BY event_date DESC, event_count DESC;

-- Authentication Challenge Success Rate
CREATE VIEW challenge_success_rates AS
SELECT 
    challenge_type,
    COUNT(*) as total_challenges,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_challenges,
    ROUND(
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::decimal / 
        COUNT(*)::decimal * 100, 
        2
    ) as success_rate_percent,
    ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - issued_at))), 2) as avg_completion_time_seconds
FROM auth_challenges 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY challenge_type
ORDER BY success_rate_percent DESC;

-- Ensure updated_at timestamps are automatically maintained
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to relevant tables
CREATE TRIGGER update_user_trust_profiles_updated_at BEFORE UPDATE ON user_trust_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_device_trust_records_updated_at BEFORE UPDATE ON device_trust_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_auth_challenges_updated_at BEFORE UPDATE ON auth_challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_behavior_baselines_updated_at BEFORE UPDATE ON user_behavior_baselines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_behavior_anomalies_updated_at BEFORE UPDATE ON behavior_anomalies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_location_history_updated_at BEFORE UPDATE ON user_location_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_zero_trust_config_updated_at BEFORE UPDATE ON zero_trust_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();