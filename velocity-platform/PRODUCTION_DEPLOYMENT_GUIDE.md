# 🚀 Velocity AI Platform - Production Deployment Guide

## Executive Summary

This guide provides step-by-step instructions for deploying the Velocity AI Platform to production on AWS Amplify with enterprise-grade security, monitoring, and scalability.

## 📋 Prerequisites

### Required AWS Services
- ✅ **AWS Amplify** - Frontend and backend hosting
- ✅ **Amazon RDS** - PostgreSQL database
- ✅ **Amazon ElastiCache** - Redis caching
- ✅ **Amazon S3** - Evidence storage
- ✅ **Amazon SES** - Email delivery
- ✅ **Amazon CloudFront** - CDN
- ✅ **AWS Certificate Manager** - SSL certificates
- ✅ **AWS Parameter Store** - Secrets management

### Domain Configuration
- Primary: `velocity.eripapp.com`
- API: `api.velocity.eripapp.com`
- WebSocket: `ws.velocity.eripapp.com`
- Staging: `staging.velocity.eripapp.com`

---

## 🏗️ Infrastructure Setup

### 1. Domain and SSL Setup

```bash
# Configure DNS in Route 53
aws route53 create-hosted-zone --name velocity.eripapp.com
aws route53 create-hosted-zone --name api.velocity.eripapp.com
aws route53 create-hosted-zone --name ws.velocity.eripapp.com

# Request SSL certificates
aws acm request-certificate \
  --domain-name velocity.eripapp.com \
  --subject-alternative-names "*.velocity.eripapp.com" \
  --validation-method DNS
```

### 2. Database Setup (Amazon RDS)

```bash
# Create PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier velocity-production \
  --db-instance-class db.r5.large \
  --engine postgres \
  --engine-version 15.4 \
  --allocated-storage 100 \
  --storage-type gp2 \
  --master-username velocityuser \
  --master-user-password "$(openssl rand -base64 32)" \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name velocity-db-subnet-group \
  --backup-retention-period 30 \
  --multi-az \
  --storage-encrypted \
  --copy-tags-to-snapshot
```

### 3. Redis Cache Setup (ElastiCache)

```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id velocity-redis-prod \
  --cache-node-type cache.r5.large \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-group-name velocity-cache-subnet-group
```

### 4. S3 Bucket for Evidence Storage

```bash
# Create S3 bucket
aws s3 mb s3://velocity-evidence-storage
aws s3 mb s3://velocity-backups

# Configure bucket policies
aws s3api put-bucket-encryption \
  --bucket velocity-evidence-storage \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

---

## 🔐 Security Configuration

### 1. AWS Parameter Store Setup

```bash
# Store sensitive environment variables
aws ssm put-parameter \
  --name "/velocity/production/jwt-secret" \
  --value "$(openssl rand -base64 32)" \
  --type "SecureString"

aws ssm put-parameter \
  --name "/velocity/production/encryption-key" \
  --value "$(openssl rand -base64 32)" \
  --type "SecureString"

aws ssm put-parameter \
  --name "/velocity/production/database-url" \
  --value "postgresql://user:pass@host:5432/velocity" \
  --type "SecureString"

aws ssm put-parameter \
  --name "/velocity/production/openai-api-key" \
  --value "sk-your-openai-key" \
  --type "SecureString"

aws ssm put-parameter \
  --name "/velocity/production/anthropic-api-key" \
  --value "sk-ant-your-anthropic-key" \
  --type "SecureString"
```

### 2. IAM Roles and Policies

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::velocity-evidence-storage/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParameters"
      ],
      "Resource": "arn:aws:ssm:*:*:parameter/velocity/production/*"
    }
  ]
}
```

---

## 🌐 AWS Amplify Deployment

### 1. Connect Repository

```bash
# Initialize Amplify project
amplify init --name velocity-platform --region us-east-1

# Connect to GitHub repository
amplify add hosting
amplify publish
```

### 2. Configure Environment Variables in Amplify Console

Navigate to AWS Amplify Console → App Settings → Environment Variables:

```bash
# Frontend Variables
REACT_APP_API_BASE_URL=https://api.velocity.eripapp.com
REACT_APP_WS_URL=wss://ws.velocity.eripapp.com
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0

# Backend Variables (from Parameter Store)
DATABASE_URL=${{resolve:ssm:/velocity/production/database-url}}
JWT_SECRET_KEY=${{resolve:ssm:/velocity/production/jwt-secret}}
ENCRYPTION_KEY=${{resolve:ssm:/velocity/production/encryption-key}}
OPENAI_API_KEY=${{resolve:ssm:/velocity/production/openai-api-key}}
ANTHROPIC_API_KEY=${{resolve:ssm:/velocity/production/anthropic-api-key}}

# AWS Services
AWS_REGION=us-east-1
AWS_S3_BUCKET=velocity-evidence-storage
FROM_EMAIL=noreply@velocity.eripapp.com
```

### 3. Custom Domain Configuration

```bash
# Add custom domain in Amplify Console
aws amplify create-domain-association \
  --app-id your-amplify-app-id \
  --domain-name velocity.eripapp.com \
  --sub-domain-settings '{
    "prefix": "",
    "branchName": "main"
  },{
    "prefix": "www",
    "branchName": "main"
  }'
```

---

## 📊 Monitoring Setup

### 1. CloudWatch Configuration

```bash
# Create CloudWatch dashboard
aws cloudwatch put-dashboard \
  --dashboard-name "Velocity-Platform-Production" \
  --dashboard-body file://cloudwatch-dashboard.json

# Set up alarms
aws cloudwatch put-metric-alarm \
  --alarm-name "Velocity-High-Error-Rate" \
  --alarm-description "Alert when error rate is high" \
  --metric-name "Errors" \
  --namespace "AWS/Amplify" \
  --statistic "Sum" \
  --period 300 \
  --threshold 10 \
  --comparison-operator "GreaterThanThreshold"
```

### 2. Application Performance Monitoring

```javascript
// Install monitoring packages
npm install @sentry/react @sentry/tracing
npm install @datadog/browser-rum

// Configure in main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: "production",
  tracesSampleRate: 0.1,
});
```

---

## 🔄 CI/CD Pipeline

### 1. GitHub Actions Workflow

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage --watchAll=false
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Amplify
        uses: aws-amplify/amplify-console-action@v1
        with:
          amplify_command: 'publish'
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### 2. Automated Testing

```bash
# Frontend tests
npm test -- --coverage --watchAll=false

# Backend tests
cd backend/velocity
python -m pytest tests/ --verbose --cov=.

# Integration tests
npm run test:integration

# Security tests
npm audit
pip safety check
```

---

## 🏥 Health Checks and Monitoring

### 1. Application Health Endpoints

```python
# backend/velocity/health.py
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "services": {
            "database": await check_database(),
            "redis": await check_redis(),
            "s3": await check_s3(),
            "agents": await check_agents()
        }
    }
```

### 2. Monitoring Dashboard

```bash
# CloudWatch custom metrics
aws cloudwatch put-metric-data \
  --namespace "Velocity/Platform" \
  --metric-data MetricName=ActiveUsers,Value=100,Unit=Count

aws cloudwatch put-metric-data \
  --namespace "Velocity/Platform" \
  --metric-data MetricName=EvidenceCollected,Value=500,Unit=Count
```

---

## 🚨 Incident Response

### 1. Alerting Configuration

```yaml
# alerts.yml
alerts:
  - name: high-error-rate
    condition: error_rate > 5%
    notification: 
      - slack: "#alerts"
      - email: "ops@velocity.eripapp.com"
  
  - name: database-connection-failure
    condition: database_connection_errors > 0
    notification:
      - pagerduty: "database-team"
      - slack: "#critical"
```

### 2. Rollback Procedures

```bash
# Amplify rollback
aws amplify start-job \
  --app-id your-app-id \
  --branch-name main \
  --job-type RELEASE \
  --job-id previous-job-id

# Database rollback
pg_restore --clean --no-acl --no-owner \
  -h your-db-host -U username -d velocity \
  backup-file.sql
```

---

## 📈 Performance Optimization

### 1. CDN Configuration

```bash
# CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json

# Configure caching rules
aws cloudfront put-distribution-config \
  --id your-distribution-id \
  --distribution-config file://updated-config.json
```

### 2. Database Optimization

```sql
-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_evidence_items_org_id ON evidence_items(organization_id);
CREATE INDEX CONCURRENTLY idx_agents_status ON agents(status);
CREATE INDEX CONCURRENTLY idx_executions_timestamp ON agent_execution_logs(created_at);

-- Analyze table statistics
ANALYZE evidence_items;
ANALYZE agents;
ANALYZE organizations;
```

---

## 🔒 Security Hardening

### 1. Network Security

```bash
# Security groups
aws ec2 create-security-group \
  --group-name velocity-web \
  --description "Velocity web tier security group"

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

### 2. WAF Configuration

```json
{
  "Name": "velocity-web-acl",
  "Rules": [
    {
      "Name": "RateLimitRule",
      "Priority": 1,
      "Statement": {
        "RateBasedStatement": {
          "Limit": 1000,
          "AggregateKeyType": "IP"
        }
      },
      "Action": {"Block": {}}
    }
  ]
}
```

---

## 📋 Go-Live Checklist

### Pre-Launch
- [ ] SSL certificates configured and tested
- [ ] DNS records properly configured
- [ ] Database migrations applied
- [ ] All environment variables configured
- [ ] Monitoring and alerting active
- [ ] Backup procedures tested
- [ ] Security scanning completed
- [ ] Performance testing passed
- [ ] Load testing completed

### Launch Day
- [ ] Deploy to production
- [ ] Verify all services healthy
- [ ] Test critical user flows
- [ ] Monitor error rates and performance
- [ ] Validate WebSocket connections
- [ ] Test all 13 AI agents
- [ ] Verify email delivery
- [ ] Check SSL certificate status

### Post-Launch
- [ ] Monitor for 24 hours continuously
- [ ] Review performance metrics
- [ ] Validate backup procedures
- [ ] Test incident response procedures
- [ ] Document any issues and resolutions
- [ ] Update runbooks based on learnings

---

## 📞 Support and Maintenance

### Daily Operations
- Monitor application health and performance
- Review error logs and resolve issues
- Check backup completion status
- Monitor resource utilization

### Weekly Operations
- Review security logs and alerts
- Analyze performance trends
- Update dependencies and security patches
- Review and test disaster recovery procedures

### Monthly Operations
- Comprehensive security audit
- Performance optimization review
- Cost optimization analysis
- Update documentation and runbooks

---

## 🎯 Success Metrics

### Technical KPIs
- **Uptime**: > 99.9%
- **Response Time**: < 200ms average
- **Error Rate**: < 0.1%
- **WebSocket Latency**: < 50ms

### Business KPIs
- **User Onboarding**: < 15 minutes
- **Evidence Collection**: Within 24 hours
- **Trust Score Calculation**: Real-time
- **Compliance Reports**: Generated instantly

---

*This deployment guide ensures enterprise-grade reliability, security, and scalability for the Velocity AI Platform. Follow all steps carefully and test thoroughly before going live.*