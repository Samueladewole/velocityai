-- Velocity AI Platform - Database Initialization
-- Create extensions and initial data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create initial demo organization and user
INSERT INTO organizations (id, name, domain, tier, created_at, updated_at) 
VALUES (
    uuid_generate_v4(),
    'Demo Organization',
    'demo.velocity.ai',
    'growth',
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- Get the organization ID for demo user
DO $$
DECLARE
    org_id UUID;
BEGIN
    SELECT id INTO org_id FROM organizations WHERE domain = 'demo.velocity.ai' LIMIT 1;
    
    -- Create demo user
    INSERT INTO users (id, email, name, role, organization_id, is_active, created_at)
    VALUES (
        uuid_generate_v4(),
        'demo@velocity.ai',
        'Demo User',
        'admin',
        org_id,
        true,
        NOW()
    ) ON CONFLICT DO NOTHING;
    
    -- Create initial trust score
    INSERT INTO trust_scores (id, organization_id, total_score, framework_scores, evidence_count, automation_rate, coverage_percentage, created_at)
    VALUES (
        uuid_generate_v4(),
        org_id,
        0,
        '{"soc2": 0, "iso27001": 0, "cis_controls": 0, "gdpr": 0}',
        0,
        0.0,
        0.0,
        NOW()
    ) ON CONFLICT DO NOTHING;
END $$;