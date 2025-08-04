# Velocity AI Platform - Deployment Guide

## 🚀 Overview

This guide covers setting up staging and production environments for the Velocity AI Platform with proper Supabase authentication and CI/CD pipelines.

## 📋 Prerequisites

- [Supabase](https://supabase.com) account
- [Vercel](https://vercel.com) account (or preferred hosting provider)
- [GitHub](https://github.com) repository
- Node.js 18+ installed locally

## 🏗️ Environment Setup

### 1. Development Environment ✅ (Already configured)

- **Supabase Project**: Already set up
- **Environment**: Uses `.env` file
- **Demo Mode**: Enabled with `demo@velocity.ai` / `demo123`
- **Access**: http://localhost:5174

### 2. Staging Environment

#### Step 1: Create Staging Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Name: `velocity-staging`
4. Choose your organization
5. Generate a secure database password
6. Select region (closest to your users)

#### Step 2: Configure Staging Environment

1. Copy `.env.staging` to `.env.staging.local`
2. Update the following variables:

```bash
# From Supabase Dashboard > Settings > API
VITE_SUPABASE_URL=https://your-staging-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-staging-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-staging-service-role-key

# From Supabase Dashboard > Settings > Database
DATABASE_URL=postgresql://postgres:your-db-password@db.your-project-id.supabase.co:5432/postgres
SUPABASE_DB_PASSWORD=your-database-password
```

#### Step 3: Set up Staging Database

1. In Supabase Dashboard, go to SQL Editor
2. Run the database migration script:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create organizations table
CREATE TABLE organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    domain TEXT,
    industry TEXT,
    size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    role TEXT DEFAULT 'USER',
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Organizations: Users can only see their own organization
CREATE POLICY "Users can view their organization" ON organizations
    FOR SELECT USING (auth.uid() IN (
        SELECT id FROM user_profiles WHERE organization_id = organizations.id
    ));

-- User profiles: Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);
```

### 3. Production Environment

#### Step 1: Create Production Supabase Project

1. Create new project: `velocity-production`
2. Use a strong database password
3. Choose optimal region for your users
4. Enable all security features

#### Step 2: Configure Production Environment

1. Copy `.env.production.example` to `.env.production.local`
2. Update all variables with production values
3. **Important**: Use different, secure secrets from staging

#### Step 3: Set up Production Security

1. **Enable Row Level Security** on all tables
2. **Configure CORS** properly for your domain
3. **Set up SSL** certificates
4. **Enable 2FA** on Supabase account
5. **Set up monitoring** and alerts

## 🔄 CI/CD Pipeline Setup

### 1. GitHub Secrets Configuration

Go to your GitHub repository > Settings > Secrets and variables > Actions

Add the following secrets:

```bash
# Vercel Configuration
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id

# Staging Environment
STAGING_SUPABASE_URL=https://your-staging-project.supabase.co
STAGING_SUPABASE_ANON_KEY=your-staging-anon-key

# Production Environment
PRODUCTION_SUPABASE_URL=https://your-production-project.supabase.co
PRODUCTION_SUPABASE_ANON_KEY=your-production-anon-key
```

### 2. Branch Strategy

- `main` branch → Production deployment
- `staging` branch → Staging deployment
- Feature branches → Pull requests to staging

### 3. Deployment Workflow

1. **Development**: Work on feature branches
2. **Staging**: Merge to `staging` branch → Auto-deploy to staging
3. **Production**: Merge staging to `main` → Auto-deploy to production

## 🧪 Testing Deployments

### Staging Tests
```bash
# Test authentication
curl -X POST https://staging.velocity.ai/api/auth/login
```

### Production Tests
```bash
# Health check
curl https://velocity.ai/api/health

# Test authentication flow
# (Use real user accounts, not demo)
```

## 🚨 Security Checklist

### Pre-Production

- [ ] Row Level Security enabled on all tables
- [ ] Strong passwords for all service accounts
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled
- [ ] SSL certificates configured
- [ ] Security headers enabled
- [ ] Demo mode disabled in production
- [ ] Debug logging disabled in production
- [ ] Monitoring and alerts configured

### Post-Deployment

- [ ] Test user registration flow
- [ ] Test password reset flow
- [ ] Test dashboard access
- [ ] Verify SSL certificates
- [ ] Check security headers
- [ ] Test rate limiting
- [ ] Monitor error rates
- [ ] Verify backup processes

## 📊 Monitoring

### Key Metrics to Monitor

1. **Authentication**
   - Sign-up rate
   - Login success rate
   - Password reset requests

2. **Performance**
   - Page load times
   - API response times
   - Database query performance

3. **Errors**
   - 4xx/5xx error rates
   - JavaScript errors
   - Database connection issues

### Recommended Tools

- **Supabase**: Built-in monitoring and logs
- **Vercel**: Analytics and performance metrics
- **Sentry**: Error tracking and performance monitoring
- **Uptime Robot**: Uptime monitoring

## 🆘 Troubleshooting

### Common Issues

1. **Supabase Connection Errors**
   - Check environment variables
   - Verify project URLs
   - Check API key permissions

2. **Authentication Failures**
   - Verify RLS policies
   - Check CORS settings
   - Validate JWT configuration

3. **Build Failures**
   - Check environment variables in CI/CD
   - Verify Node.js version compatibility
   - Check for TypeScript errors

### Support

- **Supabase**: [Documentation](https://supabase.com/docs)
- **Vercel**: [Documentation](https://vercel.com/docs)
- **GitHub Actions**: [Documentation](https://docs.github.com/en/actions)

## 📞 Next Steps

1. **Set up staging environment** following this guide
2. **Test authentication flows** in staging
3. **Configure production environment**
4. **Set up CI/CD pipeline**
5. **Deploy to production**
6. **Monitor and maintain**

---

**🎉 Congratulations!** You now have a production-ready Velocity AI Platform with proper authentication, security, and deployment pipelines.

For questions or support, reach out to the development team or create an issue in the repository.