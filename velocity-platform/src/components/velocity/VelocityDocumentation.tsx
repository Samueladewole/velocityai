/**
 * Velocity AI Documentation and Customer Success Center
 * Comprehensive guides, tutorials, and help resources
 */

import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { 
  Search,
  BookOpen,
  Video,
  HelpCircle,
  MessageSquare,
  Zap,
  Bot,
  Shield,
  Cloud,
  Target,
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Download,
  Play,
  Users,
  Lightbulb,
  Settings,
  AlertCircle,
  Star,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: Article[];
}

interface Article {
  id: string;
  title: string;
  description: string;
  readTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'guide' | 'tutorial' | 'reference' | 'video' | 'faq';
  tags: string[];
  popular: boolean;
  content?: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: number;
  steps: number;
  difficulty: string;
  thumbnail: string;
  completed?: boolean;
}

const VelocityDocumentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const docSections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Quick setup and initial configuration',
      icon: <Zap className="w-5 h-5" />,
      articles: [
        {
          id: 'quick-start',
          title: '5-Minute Quick Start Guide',
          description: 'Get up and running with Velocity AI in just 5 minutes',
          readTime: 5,
          difficulty: 'beginner',
          type: 'guide',
          tags: ['setup', 'quickstart', 'beginner'],
          popular: true,
          content: `# 5-Minute Quick Start Guide

## Welcome to Velocity AI! 🚀

This guide will have you up and running with automated compliance monitoring in just 5 minutes.

### Step 1: Create Your Account (1 minute)
1. Visit **https://velocity.eripapp.com/signup**
2. Enter your work email, name, and company details
3. Choose a secure password
4. Click **"Start Free Trial"** - no credit card required!
5. You'll be automatically logged in and redirected to onboarding

### Step 2: Complete Onboarding Wizard (2 minutes)
1. The **Velocity Onboarding Wizard** will guide you through:
   - Platform selection (AWS, GCP, Azure, GitHub)
   - Compliance framework choice (SOC 2, ISO 27001, GDPR, CIS)
   - Credential setup with secure encryption
   - Initial agent configuration
2. Follow the step-by-step prompts - everything is automated!

### Step 3: Deploy Your First Agent (2 minutes)
1. Review the auto-generated agent configuration
2. Click **"Deploy Agent"** in the onboarding wizard
3. Watch as your agent starts collecting evidence automatically
4. Your initial Trust Score will appear within minutes!

### 🎉 You're Done!
Your Velocity AI platform is now actively monitoring your infrastructure and collecting compliance evidence 24/7.

### What You Can Do Now
- **Live Dashboard**: See real-time monitoring at /velocity/live
- **Agent Dashboard**: View all your agents at /velocity/dashboard  
- **Evidence Review**: Check collected artifacts at /velocity/evidence
- **Agent Creator**: Build custom agents at /velocity/creator
- **Documentation**: Learn more at /velocity/docs

### Your 14-Day Free Trial Includes:
- Unlimited agent creation with natural language
- Real-time compliance monitoring across all platforms
- AI-powered evidence validation and scoring
- Complete Trust Score calculation and sharing
- Access to all compliance frameworks
- Priority email support

Need help? Our support team is ready to assist at every step!`
        },
        {
          id: 'account-setup',
          title: 'Account Creation & Authentication',
          description: 'Complete guide to signing up and managing your Velocity account',
          readTime: 8,
          difficulty: 'beginner',
          type: 'guide',
          tags: ['account', 'signup', 'login', 'authentication'],
          popular: true,
          content: `# Account Creation & Authentication

## Creating Your Velocity Account

### Sign Up Process
1. **Visit Signup Page**: Go to https://velocity.eripapp.com/signup
2. **Enter Details**:
   - First and Last Name
   - Work Email (personal emails accepted for trials)
   - Company Name
   - Secure Password (minimum 8 characters)
3. **Agree to Terms**: Review and accept our Terms of Service and Privacy Policy
4. **Start Free Trial**: Click the button - no credit card required!

### Account Verification
- Email verification is automatic
- You'll be logged in immediately after signup
- Onboarding wizard starts automatically

## Logging In

### Login Process
1. **Visit Login Page**: Go to https://velocity.eripapp.com/login
2. **Enter Credentials**: Email and password
3. **Stay Logged In**: Check "Remember me" for convenience
4. **Dashboard Access**: Automatic redirect to /velocity/dashboard

### Forgot Password
- Click "Forgot password?" on login page
- Enter your email address
- Check email for reset instructions
- Create new password and login

## Account Management

### Profile Settings
Access your profile settings from the dashboard header:
- Update personal information
- Change password
- Manage notification preferences
- View subscription details

### Security Features
- **Encrypted Storage**: All credentials encrypted with AES-256
- **Secure Sessions**: Auto-logout after inactivity
- **GDPR Compliant**: Full data protection compliance
- **Audit Logs**: Complete login and activity tracking

### Trial vs Paid Accounts

#### 14-Day Free Trial Includes:
- Full platform access
- Unlimited agent creation
- All compliance frameworks
- Real-time monitoring
- Evidence collection and validation
- Trust Score calculation
- Email support

#### After Trial:
- Choose from Starter, Growth, or Enterprise plans
- See /velocity/pricing for current options
- Seamless upgrade process
- No data loss during transition

## Multi-User Support (Coming Soon)
- Team member invitations
- Role-based access control
- Shared agent management
- Collaborative evidence review`
        },
        {
          id: 'detailed-setup',
          title: 'Platform Overview & Navigation',
          description: 'Complete tour of the Velocity AI platform and all its features',
          readTime: 15,
          difficulty: 'beginner',
          type: 'guide',
          tags: ['platform', 'navigation', 'overview', 'features'],
          popular: true,
          content: `# Platform Overview & Navigation

## Velocity AI Platform Structure

Velocity AI is organized into focused modules that work together to provide comprehensive compliance automation. Here's your complete guide to navigating the platform.

### Main Navigation Areas

#### 🏠 **Landing Page** (/velocity)
- **Purpose**: Marketing homepage and feature overview
- **Key Features**:
  - Product demonstration with live metrics
  - Pricing information and plan comparison
  - Customer testimonials and success stories
  - Clear call-to-action for trial signup
- **Who Uses It**: Prospective customers, sales teams

#### 🔐 **Authentication** (/velocity/login, /velocity/signup)
- **Login Page**: Secure authentication with "Remember Me" option
- **Signup Page**: 14-day free trial registration
- **Features**:
  - Password strength validation
  - Forgot password recovery
  - Terms of service and privacy policy links
  - Automatic redirect to onboarding after signup

#### 🚀 **Onboarding Wizard** (/velocity/onboarding)
- **Purpose**: Guided setup for new users
- **Process Flow**:
  1. Welcome and overview
  2. Platform selection (AWS, GCP, Azure, GitHub)
  3. Compliance framework choice
  4. Credential configuration
  5. First agent deployment
  6. Initial Trust Score generation
- **Time to Complete**: 5-10 minutes
- **Outcome**: Fully configured monitoring agent

### Core Platform Features

#### 🤖 **Agent Dashboard** (/velocity/dashboard)
- **Purpose**: Central hub for all AI agents
- **Features**:
  - Agent status monitoring (active, paused, failed)
  - Performance metrics and statistics
  - Quick deployment options
  - Agent configuration management
  - Real-time status updates
- **Key Metrics Displayed**:
  - Total agents deployed
  - Evidence collection rate
  - Platform coverage
  - Compliance score trends

#### ⚡ **Live Dashboard** (/velocity/live)
- **Purpose**: Real-time monitoring and alerting
- **Features**:
  - Live data streaming from all agents
  - Real-time compliance score updates
  - Instant alert notifications
  - Platform health monitoring
  - Evidence collection progress
- **Update Frequency**: Every 30 seconds
- **Alert Types**: Failures, score changes, new evidence

#### 🧠 **AI Agent Creator** (/velocity/creator)
- **Purpose**: Natural language agent creation
- **How It Works**:
  - Conversational AI interface
  - Natural language processing for intent recognition
  - Automatic configuration generation
  - Platform and framework detection
  - Custom control selection
- **Example Commands**:
  - "Create an AWS SOC2 agent that runs every 4 hours"
  - "Build a GitHub security scanner for ISO27001"
  - "Set up Azure GDPR compliance monitoring"
- **Output**: Ready-to-deploy agent configuration

#### 📊 **Evidence Review** (/velocity/evidence)
- **Purpose**: Evidence validation and management
- **Features**:
  - AI-powered evidence scoring
  - Manual review workflow
  - Evidence export for audits
  - Compliance gap identification
  - Historical evidence tracking
- **Evidence Types**: Screenshots, configurations, logs, reports
- **Validation**: Automated quality scoring with manual override

#### 🔧 **Integration Dashboard** (/velocity/integration)
- **Purpose**: Platform connection management
- **Supported Platforms**:
  - **AWS**: IAM, CloudTrail, Config, GuardDuty
  - **GCP**: Cloud Asset Inventory, Cloud Logging, Security Command Center
  - **Azure**: Security Center, Monitor, Policy
  - **GitHub**: Security, Code Scanning, Dependabot
- **Connection Features**:
  - Secure credential storage
  - Connection health monitoring
  - Permission validation
  - Test connectivity tools

#### 📚 **Documentation** (/velocity/docs)
- **Purpose**: Comprehensive help and learning resources
- **Features**:
  - Fuzzy search with Fuse.js
  - Categorized content sections
  - Video tutorials and guides
  - FAQ and troubleshooting
  - API reference documentation
- **Content Areas**: Setup, agents, compliance, evidence, troubleshooting

### Platform Architecture

#### Data Flow
1. **Agents** collect evidence from connected platforms
2. **AI Validation** scores evidence quality and authenticity
3. **Trust Score** calculation based on collected evidence
4. **Real-time Updates** push changes to live dashboard
5. **Evidence Storage** with encrypted, audit-ready format

#### Security Features
- **Encryption**: AES-256 for all stored data
- **Access Control**: Role-based permissions
- **Audit Logging**: Complete activity tracking
- **Secure Communications**: TLS 1.3 for all API calls
- **Credential Management**: AWS KMS integration

### Getting the Most from Velocity

#### Best Practices
1. **Start Simple**: Begin with one platform and framework
2. **Use Agent Creator**: Leverage natural language for custom agents
3. **Monitor Live Dashboard**: Check daily for real-time insights
4. **Review Evidence**: Validate AI scoring for critical controls
5. **Export Regularly**: Generate audit packages monthly

#### Common Workflows
1. **Daily Monitoring**: Check live dashboard for alerts
2. **Weekly Reviews**: Validate new evidence in review section
3. **Monthly Reporting**: Export evidence packages for stakeholders
4. **Quarterly Audits**: Generate comprehensive compliance reports

#### Integration Tips
- Test connections before deploying agents
- Use least-privilege access for credentials
- Monitor connection health regularly
- Keep credentials updated and rotated

### Support Resources
- **In-Platform Help**: Contextual help tooltips throughout
- **Documentation Search**: Instant answers via Fuse.js search
- **Video Tutorials**: Step-by-step visual guides
- **Email Support**: support@eripapp.com for technical assistance
- **Live Chat**: Available during business hours (coming soon)

This comprehensive platform puts enterprise-grade compliance automation at your fingertips, all controlled through intuitive interfaces designed for both technical and non-technical users.`
        },
        {
          id: 'platform-connections',
          title: 'Platform Integrations & Connections',
          description: 'Complete guide to connecting and managing all supported platforms',
          readTime: 20,
          difficulty: 'intermediate',
          type: 'tutorial',
          tags: ['aws', 'gcp', 'azure', 'github', 'connections', 'integrations'],
          popular: true,
          content: `# Platform Integrations & Connections

## Overview

Velocity AI connects to your cloud infrastructure and development platforms to automatically collect compliance evidence. This guide covers all supported integrations and how to set them up securely.

## Supported Platforms

### ☁️ **Amazon Web Services (AWS)**

#### Services Monitored
- **IAM**: Users, roles, policies, access keys
- **CloudTrail**: API calls, management events
- **Config**: Resource configurations, compliance rules
- **GuardDuty**: Security findings and threats
- **VPC**: Network configurations, security groups
- **S3**: Bucket policies, encryption settings
- **EC2**: Security groups, key pairs, instances

#### Required Permissions
\`\`\`json
{
  "Version": "2012-10-17", 
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iam:List*",
        "iam:Get*", 
        "cloudtrail:Describe*",
        "config:Describe*",
        "config:Get*",
        "guardduty:List*",
        "guardduty:Get*",
        "ec2:Describe*",
        "s3:GetBucket*",
        "s3:GetObject*"
      ],
      "Resource": "*"
    }
  ]
}
\`\`\`

#### Setup Process
1. **Create IAM User**:
   - Go to AWS Console → IAM → Users
   - Click "Add user" and choose "Programmatic access"
   - Attach the Velocity policy (above)
   - Save Access Key ID and Secret Access Key

2. **Configure in Velocity**:
   - Navigate to /velocity/integration
   - Click "Add AWS Connection"
   - Enter credentials: Access Key ID, Secret Key, Region
   - Click "Test Connection" to verify

3. **Deploy Agents**:
   - Use Agent Creator: "Create AWS SOC2 agent"
   - Or manually configure agents for specific controls
   - Agents will start collecting evidence immediately

#### Troubleshooting AWS
- **Connection Failed**: Check IAM permissions and region
- **No Data**: Verify services are enabled in your AWS account
- **Partial Data**: Review CloudTrail and Config setup

### 🔧 **Google Cloud Platform (GCP)**

#### Services Monitored
- **Cloud Asset Inventory**: Resource configurations
- **Cloud Logging**: Audit logs and events
- **Security Command Center**: Security findings
- **IAM & Admin**: Policies, service accounts
- **Compute Engine**: Instance configurations
- **Cloud Storage**: Bucket policies and settings

#### Required Permissions
Create a service account with these roles:
- Security Reviewer
- Cloud Asset Viewer  
- Logging Viewer
- Compute Viewer
- Storage Object Viewer

#### Setup Process
1. **Create Service Account**:
   - Go to GCP Console → IAM & Admin → Service Accounts
   - Create new service account with required roles
   - Generate and download JSON key file

2. **Configure in Velocity**:
   - Go to /velocity/integration
   - Click "Add GCP Connection"
   - Upload service account JSON key
   - Enter Project ID
   - Test connection

3. **Enable APIs**:
   Required APIs (automatically enabled by Velocity):
   - Cloud Asset API
   - Cloud Logging API
   - Security Command Center API
   - Compute Engine API

### 🔵 **Microsoft Azure**

#### Services Monitored
- **Azure Security Center**: Security recommendations
- **Azure Monitor**: Activity logs and metrics
- **Azure Policy**: Compliance assessments
- **Azure AD**: Identity and access management
- **Key Vault**: Secrets and certificate management
- **Storage Accounts**: Security configurations

#### Required Permissions
Application registration with these API permissions:
- SecurityEvents.Read.All
- Policy.Read.All
- Directory.Read.All
- KeyVault.Read.All
- Storage.Read.All

#### Setup Process
1. **Register Application**:
   - Go to Azure Portal → Azure AD → App registrations
   - Create new registration
   - Add required API permissions
   - Create client secret

2. **Configure in Velocity**:
   - Navigate to /velocity/integration
   - Click "Add Azure Connection"
   - Enter: Tenant ID, Client ID, Client Secret, Subscription ID
   - Test connection

3. **Assign Roles**:
   - Reader role on subscription
   - Security Reader role on Security Center

### 🐙 **GitHub**

#### Features Monitored
- **Repository Security**: Secret scanning, vulnerability alerts
- **Code Scanning**: SAST results and findings
- **Dependabot**: Dependency vulnerability alerts
- **Branch Protection**: Rules and enforcement
- **Access Control**: Team permissions, collaborator access
- **Audit Logs**: Administrative and security events

#### Required Permissions
Personal Access Token with scopes:
- \`repo\` (Full control of private repositories)
- \`admin:org\` (Full control of orgs and teams)
- \`read:audit_log\` (Read audit log data)
- \`read:enterprise\` (Read enterprise data)

#### Setup Process
1. **Generate PAT**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token with required scopes
   - Copy token (shown only once)

2. **Configure in Velocity**:
   - Go to /velocity/integration
   - Click "Add GitHub Connection"
   - Enter: Personal Access Token, Organization Name
   - Optional: Repository filters, team restrictions
   - Test connection

3. **Enable Security Features**:
   - Secret scanning (GitHub Advanced Security)
   - Code scanning (CodeQL or third-party)
   - Dependabot alerts and security updates

## Integration Management

### Connection Health Monitoring
Velocity continuously monitors all platform connections:
- **Status Indicators**: Green (healthy), Yellow (warning), Red (failed)
- **Last Sync Time**: When evidence was last collected
- **Error Messages**: Detailed failure reasons
- **Retry Logic**: Automatic reconnection attempts

### Credential Security
- **Encryption**: AES-256 encryption at rest
- **Rotation**: Support for credential rotation
- **Least Privilege**: Minimal required permissions
- **Audit Trail**: Complete access logging

### Performance Optimization
- **Rate Limiting**: Respects platform API limits
- **Caching**: Intelligent caching to reduce API calls
- **Parallel Processing**: Concurrent evidence collection
- **Incremental Updates**: Only collect changed data

## Advanced Configuration

### Multi-Region Support
- **AWS**: Configure multiple regions per connection
- **GCP**: Multi-project monitoring
- **Azure**: Cross-subscription compliance

### Custom Filtering
- **Resource Tags**: Filter by specific tags
- **Service Scope**: Monitor only required services  
- **Time Windows**: Customize collection schedules

### Compliance Mapping
Each platform integration automatically maps to compliance frameworks:
- **SOC 2**: Trust service criteria alignment
- **ISO 27001**: Information security controls
- **GDPR**: Data protection requirements
- **CIS Controls**: Cybersecurity framework mapping

## Troubleshooting Common Issues

### Connection Problems
1. **Invalid Credentials**: Verify keys, tokens, and permissions
2. **Network Issues**: Check firewall and proxy settings
3. **API Limits**: Monitor rate limiting and quotas
4. **Service Availability**: Check platform status pages

### Data Collection Issues
1. **Missing Evidence**: Verify service configurations
2. **Partial Data**: Review permissions and service enablement  
3. **Stale Data**: Check connection health and sync times
4. **Performance**: Monitor agent execution times

### Best Practices
- **Test Connections**: Always verify before deploying agents
- **Monitor Health**: Check integration dashboard daily
- **Update Credentials**: Rotate keys and tokens regularly
- **Review Permissions**: Audit access quarterly
- **Backup Configurations**: Export integration settings

This comprehensive integration system ensures Velocity can monitor your entire compliance posture across all major cloud and development platforms, providing unified visibility and automated evidence collection.`
        }
      ]
    },
    {
      id: 'ai-agents',
      title: 'AI Agents',
      description: 'Managing and customizing your AI agents',
      icon: <Bot className="w-5 h-5" />,
      articles: [
        {
          id: 'agent-overview',
          title: 'Understanding AI Agents',
          description: 'How Velocity AI agents work and what they monitor',
          readTime: 12,
          difficulty: 'beginner',
          type: 'guide',
          tags: ['agents', 'overview', 'monitoring', 'architecture'],
          popular: true,
          content: `# Understanding AI Agents

## What Are Velocity AI Agents?

Velocity AI agents are autonomous software programs that continuously monitor your cloud infrastructure and collect compliance evidence. Think of them as digital auditors that never sleep, working 24/7 to ensure your organization maintains compliance across all connected platforms.

## How AI Agents Work

### Core Architecture
1. **Intelligent Scheduling**: Agents run on customizable schedules (hourly, daily, weekly, or continuous)
2. **Platform Integration**: Secure connections to AWS, GCP, Azure, and GitHub
3. **Evidence Collection**: Automated gathering of configurations, logs, and security data
4. **AI Validation**: Machine learning models score and validate evidence quality
5. **Real-time Updates**: Instant notifications and dashboard updates

### Agent Lifecycle
1. **Creation**: Define scope, platform, and compliance framework
2. **Configuration**: Set schedules, credentials, and monitoring rules
3. **Deployment**: Activate agent for autonomous operation
4. **Monitoring**: Real-time status tracking and health checks
5. **Evidence Processing**: AI validation and storage of collected data
6. **Reporting**: Integration with Trust Score and compliance dashboards

## Types of Agents

### Pre-built Framework Agents
Ready-to-deploy agents for common compliance needs:

#### **SOC 2 Agents**
- **Focus**: Trust service criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy)
- **Platforms**: AWS, GCP, Azure, GitHub
- **Controls**: 50+ automated controls covering all TSCs
- **Evidence**: IAM policies, access logs, encryption settings, backup configurations

#### **ISO 27001 Agents**
- **Focus**: Information security management systems
- **Controls**: 114 controls across 14 domains
- **Evidence**: Risk assessments, security policies, access controls, incident logs

#### **GDPR Agents**
- **Focus**: Data protection and privacy compliance
- **Controls**: Data processing activities, consent management, breach detection
- **Evidence**: Privacy policies, data inventories, consent records, access logs

#### **CIS Controls Agents**
- **Focus**: Cybersecurity framework and best practices
- **Controls**: 18 critical security controls
- **Evidence**: Asset inventories, vulnerability scans, configuration baselines

### Custom Agents
Built using the AI Agent Creator for specific requirements:
- **Natural Language Creation**: Describe needs in plain English
- **Flexible Scheduling**: Custom timing and frequency
- **Targeted Monitoring**: Specific services or resource types
- **Custom Controls**: Organization-specific compliance requirements

## Agent Intelligence Features

### Natural Language Processing
The Agent Creator uses advanced NLP to understand requests like:
- "Create an AWS SOC2 agent that checks IAM policies every 4 hours"
- "Monitor GitHub repositories for security vulnerabilities daily"
- "Set up GDPR data protection scanning for Azure every week"

### Automatic Configuration
Agents automatically configure themselves based on:
- **Platform Detection**: Recognizes AWS, GCP, Azure, GitHub keywords
- **Framework Mapping**: Maps compliance frameworks to relevant controls
- **Service Discovery**: Identifies available services and permissions
- **Best Practice Application**: Applies industry-standard monitoring rules

### Intelligent Adaptation
Agents learn and adapt over time:
- **Error Recovery**: Automatic retry with exponential backoff
- **Permission Detection**: Adapts to available access levels
- **Service Changes**: Automatically discovers new services and features
- **Performance Optimization**: Adjusts collection frequency based on data patterns

## Agent Dashboard Features

### Real-time Monitoring
Track all agents from the central dashboard (/velocity/dashboard):
- **Status Indicators**: Active, paused, failed, or maintenance states
- **Performance Metrics**: Execution times, success rates, error counts
- **Evidence Statistics**: Items collected, validation scores, coverage percentages
- **Platform Coverage**: Visual representation of monitored services

### Agent Management
- **Start/Stop Control**: Pause agents for maintenance or troubleshooting
- **Configuration Updates**: Modify schedules, scopes, and settings
- **Clone Agents**: Duplicate successful configurations for other environments
- **Export Settings**: Backup agent configurations for disaster recovery

### Historical Analytics
- **Execution History**: Complete log of agent runs and outcomes
- **Trend Analysis**: Performance and evidence collection trends over time
- **Compliance Drift**: Identification of configuration changes affecting compliance
- **Cost Optimization**: Resource usage and API call optimization recommendations

## Live Dashboard Integration

### Real-time Updates
Agents feed data into the Live Dashboard (/velocity/live) every 30 seconds:
- **Live Status**: Current agent execution states
- **Fresh Evidence**: Recently collected compliance artifacts
- **Alert Generation**: Immediate notifications for failures or compliance gaps
- **Trust Score Updates**: Real-time compliance score adjustments

### Alert System
- **Agent Failures**: Immediate notification of execution problems
- **Compliance Changes**: Alerts when configurations affect compliance posture
- **New Findings**: Notifications for newly discovered resources or issues
- **Threshold Breaches**: Warnings when metrics exceed defined limits

## Best Practices for Agent Management

### Design Principles
1. **Start Simple**: Begin with one platform and framework
2. **Incremental Expansion**: Add complexity gradually
3. **Monitor Performance**: Watch execution times and error rates
4. **Regular Review**: Validate agent effectiveness monthly

### Security Considerations
- **Least Privilege**: Agents use minimal required permissions
- **Credential Rotation**: Regular updates to access keys and tokens
- **Audit Logging**: Complete trails of all agent activities
- **Encryption**: All collected data encrypted in transit and at rest

### Performance Optimization
- **Schedule Coordination**: Avoid overlapping execution times
- **Resource Filtering**: Focus on critical assets and services
- **Batch Processing**: Group similar collection tasks
- **Intelligent Caching**: Reduce redundant API calls

### Maintenance and Troubleshooting
- **Health Monitoring**: Daily review of agent status
- **Error Analysis**: Investigate and resolve failure patterns
- **Credential Validation**: Ensure continued access to monitored platforms
- **Update Management**: Keep agents current with latest features

## Integration with Evidence Management

### Evidence Quality Scoring
Agents use ML models to score evidence:
- **Completeness**: 0-100% based on required data presence
- **Authenticity**: Verification of data integrity and source
- **Timeliness**: Freshness score based on collection time
- **Consistency**: Cross-reference validation with other evidence

### Automated Validation
- **Policy Compliance**: Automatic checking against compliance requirements
- **Anomaly Detection**: Identification of unusual configurations or changes
- **Gap Analysis**: Discovery of missing evidence or uncovered controls
- **Risk Assessment**: Automated scoring of security and compliance risks

### Audit Preparation
Agents prepare evidence packages for auditors:
- **Formatted Reports**: Professional PDF and Excel exports
- **Evidence Trails**: Complete collection and validation history
- **Control Mapping**: Direct links between evidence and compliance requirements
- **Timestamp Verification**: Cryptographic proof of collection times

This intelligent agent system forms the foundation of Velocity's automated compliance monitoring, providing continuous oversight of your infrastructure while minimizing manual effort and maximizing compliance confidence.`
        },
        {
          id: 'custom-agents',
          title: 'AI Agent Creator Guide',
          description: 'Complete guide to building custom agents with natural language',
          readTime: 15,
          difficulty: 'intermediate',
          type: 'tutorial',
          tags: ['custom', 'nlp', 'agent-creator', 'natural-language'],
          popular: true,
          content: `# AI Agent Creator Guide

## Overview

The AI Agent Creator (/velocity/creator) is Velocity's revolutionary natural language interface for building custom compliance monitoring agents. Instead of complex configuration files, simply describe what you need in plain English, and our AI will create a fully functional agent.

## How It Works

### Conversational AI Interface
The Agent Creator uses a chat-based interface powered by advanced natural language processing:
- **Natural Conversation**: Describe your needs as you would to a colleague
- **Context Awareness**: The AI remembers previous messages and builds on them
- **Intelligent Suggestions**: Get recommendations for common configurations
- **Real-time Feedback**: Immediate validation and clarification questions

### AI Processing Pipeline
1. **Intent Recognition**: Understands what you want to monitor
2. **Platform Detection**: Identifies target platforms (AWS, GCP, Azure, GitHub)
3. **Framework Mapping**: Determines relevant compliance frameworks
4. **Control Selection**: Chooses appropriate monitoring controls
5. **Configuration Generation**: Creates complete agent configuration
6. **Validation**: Ensures configuration is viable and secure

## Creating Your First Custom Agent

### Step 1: Access the Agent Creator
1. Navigate to /velocity/creator
2. You'll see a chat interface with an AI assistant
3. The AI will greet you with example requests and suggestions

### Step 2: Describe Your Requirements
Use natural language to describe what you need. Here are effective patterns:

#### **Platform + Framework Pattern**
- "Create an AWS SOC2 agent that runs every 4 hours"
- "Build a GCP ISO27001 monitoring agent for daily checks"
- "Set up Azure GDPR compliance scanning weekly"

#### **Service-Specific Pattern**
- "Monitor GitHub repositories for security vulnerabilities"
- "Check AWS IAM policies for SOC2 compliance"
- "Scan Azure Key Vault configurations hourly"

#### **Custom Control Pattern**
- "Create an agent that monitors database encryption across all platforms"
- "Build a custom agent for PCI DSS payment processing controls"
- "Set up monitoring for HIPAA data access controls"

### Step 3: Review Generated Configuration
The AI will generate a complete agent configuration showing:
- **Agent Name**: Auto-generated descriptive name
- **Platform**: Target infrastructure platform
- **Framework**: Compliance framework alignment
- **Schedule**: Execution frequency and timing
- **Controls**: Specific monitoring rules and checks
- **Automation Level**: Percentage of automated evidence collection
- **Estimated Runtime**: Expected execution duration

### Step 4: Customize and Deploy
- Review the configuration in the side panel
- Make adjustments using follow-up messages
- Click "Deploy Agent" when satisfied
- Watch your agent start collecting evidence immediately

## Advanced Agent Creation

### Multi-Platform Agents
Create agents that monitor across multiple platforms:
\`\`\`
"Create a SOC2 agent that monitors both AWS and GitHub - 
AWS for infrastructure controls and GitHub for code security"
\`\`\`

### Custom Scheduling
Specify complex scheduling requirements:
\`\`\`
"Build an agent that runs daily during business hours but 
does intensive scans weekly on weekends"
\`\`\`

### Targeted Monitoring
Focus on specific resources or services:
\`\`\`
"Create an agent that only monitors production AWS resources 
tagged with 'critical' for SOC2 compliance"
\`\`\`

### Framework Combination
Mix multiple compliance frameworks:
\`\`\`
"Build an agent that covers both SOC2 and ISO27001 requirements 
for our Azure infrastructure"
\`\`\`

## Natural Language Patterns

### Effective Phrasing
✅ **Good Examples**:
- "Create an AWS agent for SOC2 that checks IAM policies every 4 hours"
- "I need GitHub security monitoring for ISO27001 compliance"
- "Set up daily GDPR scanning for Azure data services"
- "Monitor AWS encryption settings continuously for PCI DSS"

✅ **Specific Requests**:
- "Build an agent that monitors S3 bucket policies and encryption"
- "Create GitHub monitoring for secret scanning and vulnerability alerts"  
- "Set up Azure monitoring for identity and access management"
- "Build a NIS2 cybersecurity risk monitoring agent for critical infrastructure"
- "Create DORA operational resilience monitoring for financial services"
- "Set up EU AI Act compliance monitoring for high-risk AI systems"

### Common Mistakes
❌ **Too Vague**:
- "Make an agent" (missing platform and purpose)
- "Monitor everything" (too broad, will be slow)
- "Check compliance" (doesn't specify framework)

❌ **Too Technical**:
- "Create agent with CloudTrail API calls for resource modification events"
  (Better: "Monitor AWS for configuration changes")

### AI Understanding Examples

#### Request: "Create an AWS SOC2 agent that runs every 4 hours"
**AI Interprets**:
- Platform: AWS
- Framework: SOC 2
- Schedule: Every 4 hours
- Controls: Automatically selects relevant SOC2 controls for AWS

#### Request: "I need GitHub security monitoring for our development team"
**AI Interprets**:
- Platform: GitHub
- Purpose: Security monitoring
- Scope: Development team repositories
- Controls: Secret scanning, vulnerability alerts, code scanning

#### Request: "Monitor Azure for GDPR data protection daily"
**AI Interprets**:
- Platform: Azure
- Framework: GDPR
- Focus: Data protection
- Schedule: Daily
- Controls: Data classification, access controls, retention policies

#### Request: "Create NIS2 cybersecurity monitoring for our critical infrastructure"
**AI Interprets**:
- Platform: Multi-platform (AWS, Azure, on-premises)
- Framework: NIS2
- Focus: Cybersecurity risk management
- Schedule: Continuous monitoring
- Controls: Incident detection, risk assessments, supply chain monitoring

#### Request: "Build DORA compliance agent for banking operations"
**AI Interprets**:
- Platform: Multi-cloud financial infrastructure
- Framework: DORA
- Focus: ICT operational resilience
- Schedule: Daily with real-time alerts
- Controls: Third-party risk, incident response, business continuity

## Agent Configuration Options

### Platform Selection
The AI automatically detects platforms from your description:
- **AWS**: CloudFormation, Lambda, S3, IAM, CloudTrail, Config
- **GCP**: Cloud Asset Inventory, IAM, Cloud SQL, Kubernetes Engine
- **Azure**: Resource Manager, Key Vault, Security Center, Active Directory
- **GitHub**: Repositories, Organizations, Security features, API access

### Framework Mapping
Supported compliance frameworks with automatic control mapping:
- **SOC 2**: Trust Service Criteria (CC1-CC9)
- **ISO 27001**: Information Security Management (A.5-A.18)
- **GDPR**: Data Protection Regulation (Articles 5, 25, 30, 32)
- **NIS2**: Network and Information Systems Directive (Risk Management, Incident Reporting)
- **DORA**: Digital Operational Resilience Act (ICT Risk, Third-party Dependencies)
- **EU AI Act**: AI Risk Management (High-risk AI Systems, Transparency)
- **CIS Controls**: Critical Security Controls (1-18)
- **PCI DSS**: Payment Card Industry (Requirements 1-12)
- **HIPAA**: Health Insurance Portability (Administrative, Physical, Technical)
- **NIST**: Cybersecurity Framework (Identify, Protect, Detect, Respond, Recover)

### Schedule Options
Flexible scheduling based on your needs:
- **Continuous**: Real-time monitoring (resource intensive)
- **Hourly**: Every hour on the hour
- **Every 4 hours**: Default for most agents
- **Daily**: Once per day at specified time
- **Weekly**: Weekly on specified day
- **Monthly**: For comprehensive audits
- **Custom**: Cron-like expressions for complex schedules

## Agent Management Features

### Configuration Panel
Each generated agent includes a detailed configuration panel:
- **Basic Information**: Name, description, platform, framework
- **Schedule Details**: Frequency, runtime estimates, automation level
- **Control List**: All monitoring rules and their purposes
- **Credential Requirements**: Necessary permissions and access keys
- **Deployment Options**: Immediate deployment or save for later

### Iterative Refinement
Refine agents through continued conversation:
- "Add monitoring for database encryption"
- "Change the schedule to run every 2 hours"
- "Include additional SOC2 controls for availability"
- "Remove GitHub integration, focus only on AWS"

### Agent Templates
Save successful configurations as templates:
- Export agent configurations for reuse
- Share templates across teams
- Version control for agent definitions
- Import/export for environment promotion

## Troubleshooting Agent Creation

### Common Issues and Solutions

#### "I don't understand your request"
- **Cause**: Too vague or ambiguous description
- **Solution**: Be more specific about platform and compliance needs
- **Example**: Instead of "monitor compliance", try "monitor AWS for SOC2 compliance"

#### "Multiple platforms detected, please clarify"
- **Cause**: Mention of multiple platforms without clear priority
- **Solution**: Specify primary platform or confirm multi-platform intent
- **Example**: "Create separate agents for AWS and Azure" or "Create one agent for both AWS and Azure"

#### "Framework not supported"
- **Cause**: Reference to unsupported compliance framework
- **Solution**: Check supported frameworks list or describe custom requirements
- **Example**: "Monitor for custom security policies similar to SOC2"

### Best Practices for Agent Creation

#### Start Simple
1. Begin with one platform and one framework
2. Use standard scheduling (every 4 hours)
3. Accept default control selections initially
4. Iterate and refine based on results

#### Be Specific
- Mention specific services or resources when relevant
- Include scheduling preferences
- Specify compliance framework clearly
- Indicate scope (production, development, all environments)

#### Test and Iterate
- Deploy agents and monitor their performance
- Use follow-up conversations to refine
- Check evidence quality and adjust controls
- Scale gradually to additional platforms

#### Security Considerations
- Review credential requirements carefully
- Use least-privilege access principles
- Monitor agent access patterns
- Rotate credentials regularly

## Advanced Features

### Custom Control Creation
For specialized requirements:
\`\`\`
"Create an agent that monitors our custom application logs 
for security events and maps them to SOC2 requirements"
\`\`\`

### Integration with Existing Tools
Connect with your security stack:
\`\`\`
"Build an agent that integrates with our SIEM to collect 
compliance evidence from security alerts"
\`\`\`

### Regulatory Specific Agents
For industry-specific compliance:
\`\`\`
"Create a healthcare-specific agent that monitors HIPAA 
requirements across AWS and ensures patient data protection"
\`\`\`

The AI Agent Creator democratizes compliance automation, allowing anyone to create sophisticated monitoring agents without technical expertise. By simply describing your needs in natural language, you can deploy enterprise-grade compliance monitoring in minutes.`
        },
        {
          id: 'agent-scheduling',
          title: 'Agent Scheduling & Automation',
          description: 'Configure when and how often agents run',
          readTime: 6,
          difficulty: 'intermediate',
          type: 'guide',
          tags: ['scheduling', 'automation', 'configuration'],
          popular: false
        }
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance Frameworks',
      description: 'Framework-specific guidance and best practices',
      icon: <Shield className="w-5 h-5" />,
      articles: [
        {
          id: 'soc2-guide',
          title: 'SOC 2 Compliance with Velocity',
          description: 'Complete guide to SOC 2 Type II automation',
          readTime: 20,
          difficulty: 'intermediate',
          type: 'guide',
          tags: ['soc2', 'compliance', 'automation'],
          popular: true
        },
        {
          id: 'gdpr-compliance',
          title: 'GDPR Data Protection Monitoring',
          description: 'Automated GDPR compliance and privacy controls',
          readTime: 18,
          difficulty: 'intermediate',
          type: 'guide',
          tags: ['gdpr', 'privacy', 'data protection'],
          popular: true
        },
        {
          id: 'iso27001-setup',
          title: 'ISO 27001 Implementation',
          description: 'Implementing ISO 27001 with AI-powered monitoring',
          readTime: 25,
          difficulty: 'advanced',
          type: 'guide',
          tags: ['iso27001', 'security', 'implementation'],
          popular: false
        }
      ]
    },
    {
      id: 'evidence',
      title: 'Evidence Management',
      description: 'Collecting, validating, and managing compliance evidence',
      icon: <Target className="w-5 h-5" />,
      articles: [
        {
          id: 'evidence-types',
          title: 'Types of Evidence',
          description: 'Understanding different evidence types and their uses',
          readTime: 7,
          difficulty: 'beginner',
          type: 'reference',
          tags: ['evidence', 'types', 'reference'],
          popular: false
        },
        {
          id: 'evidence-validation',
          title: 'AI-Powered Evidence Validation',
          description: 'How Velocity validates evidence quality and authenticity',
          readTime: 12,
          difficulty: 'intermediate',
          type: 'guide',
          tags: ['validation', 'ai', 'quality'],
          popular: true
        },
        {
          id: 'evidence-export',
          title: 'Exporting Evidence for Audits',
          description: 'Prepare evidence packages for auditors and assessors',
          readTime: 9,
          difficulty: 'beginner',
          type: 'tutorial',
          tags: ['export', 'audits', 'packages'],
          popular: true
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Common issues and their solutions',
      icon: <HelpCircle className="w-5 h-5" />,
      articles: [
        {
          id: 'connection-issues',
          title: 'Connection & Authentication Issues',
          description: 'Resolving common connection problems',
          readTime: 8,
          difficulty: 'beginner',
          type: 'faq',
          tags: ['troubleshooting', 'connections', 'auth'],
          popular: true
        },
        {
          id: 'agent-failures',
          title: 'Agent Execution Failures',
          description: 'Diagnosing and fixing agent execution problems',
          readTime: 12,
          difficulty: 'intermediate',
          type: 'guide',
          tags: ['troubleshooting', 'agents', 'failures'],
          popular: true
        },
        {
          id: 'performance-optimization',
          title: 'Performance Optimization',
          description: 'Optimizing agent performance and resource usage',
          readTime: 15,
          difficulty: 'advanced',
          type: 'guide',
          tags: ['performance', 'optimization', 'resources'],
          popular: false
        }
      ]
    }
  ];

  const videoTutorials: Tutorial[] = [
    {
      id: 'intro-video',
      title: 'Introduction to Velocity AI',
      description: 'Overview of features and capabilities',
      duration: 8,
      steps: 5,
      difficulty: 'Beginner',
      thumbnail: '/api/placeholder/320/180',
      completed: false
    },
    {
      id: 'aws-setup',
      title: 'Setting up AWS Monitoring',
      description: 'Complete AWS integration walkthrough',
      duration: 12,
      steps: 8,
      difficulty: 'Beginner',
      thumbnail: '/api/placeholder/320/180',
      completed: false
    },
    {
      id: 'custom-agents',
      title: 'Building Custom AI Agents',
      description: 'Create specialized monitoring agents',
      duration: 15,
      steps: 10,
      difficulty: 'Intermediate',
      thumbnail: '/api/placeholder/320/180',
      completed: false
    },
    {
      id: 'evidence-review',
      title: 'Evidence Review Workflow',
      description: 'Managing and validating collected evidence',
      duration: 10,
      steps: 6,
      difficulty: 'Beginner',
      thumbnail: '/api/placeholder/320/180',
      completed: false
    }
  ];

  const faqs = [
    {
      question: 'How does Velocity AI ensure the security of my credentials?',
      answer: 'All credentials are encrypted at rest using AES-256 encryption and transmitted over TLS 1.3. We use AWS KMS for key management and never store credentials in plain text. Your data is isolated in dedicated, encrypted storage.'
    },
    {
      question: 'Can I customize which controls are monitored?',
      answer: 'Yes! While Velocity automatically selects relevant controls based on your chosen framework, you can customize the control set through the Agent Creator or by editing existing agents. You can add, remove, or modify controls as needed.'
    },
    {
      question: 'How often do agents collect evidence?',
      answer: 'By default, agents run every 4 hours, but this is fully customizable. You can set continuous monitoring, hourly checks, daily scans, or create custom schedules. Critical controls can be monitored more frequently than others.'
    },
    {
      question: 'What happens if an agent fails to collect evidence?',
      answer: 'Velocity uses smart retry logic with exponential backoff. Failed agents are automatically retried up to 5 times with increasing delays. You receive notifications about persistent failures, and the system provides detailed error logs for troubleshooting.'
    },
    {
      question: 'Can I export evidence for external audits?',
      answer: 'Absolutely! Velocity provides multiple export formats including PDF reports, Excel spreadsheets, and JSON data. Evidence packages include timestamps, validation scores, and audit trails that meet compliance requirements.'
    },
    {
      question: 'How accurate is the AI evidence validation?',
      answer: 'Our ML validation system achieves 95%+ accuracy by analyzing multiple factors: completeness, authenticity, timeliness, and consistency. Each piece of evidence receives a confidence score, and low-confidence items are flagged for manual review.'
    }
  ];

  // Create search index for all articles
  const allArticles = useMemo(() => 
    docSections.flatMap(section => 
      section.articles.map(article => ({
        ...article,
        sectionId: section.id,
        sectionTitle: section.title
      }))
    ), [docSections]
  );

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => new Fuse(allArticles, {
    keys: [
      { name: 'title', weight: 0.3 },
      { name: 'description', weight: 0.2 },
      { name: 'tags', weight: 0.2 },
      { name: 'sectionTitle', weight: 0.2 },
      { name: 'content', weight: 0.1 }
    ],
    threshold: 0.4, // More lenient matching
    includeScore: true,
    includeMatches: true
  }), [allArticles]);

  // Enhanced search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).slice(0, 10); // Limit to 10 results
  }, [searchQuery, fuse]);

  const filteredSections = useMemo(() => {
    if (searchQuery.trim()) {
      // Return search results grouped by section
      const resultsBySection = searchResults.reduce((acc, result) => {
        const article = result.item;
        const sectionId = article.sectionId;
        if (!acc[sectionId]) {
          const section = docSections.find(s => s.id === sectionId);
          acc[sectionId] = {
            ...section!,
            articles: []
          };
        }
        acc[sectionId].articles.push({ ...article, searchScore: result.score });
        return acc;
      }, {} as Record<string, any>);
      
      return Object.values(resultsBySection);
    }
    
    return docSections;
  }, [searchQuery, searchResults, docSections]);

  const currentSection = docSections.find(section => section.id === activeSection);

  const renderArticleContent = (article: Article) => {
    if (article.content) {
      return (
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>').replace(/###/g, '<h3>').replace(/##/g, '<h2>').replace(/#/g, '<h1>') }} />
        </div>
      );
    }
    
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{article.title}</h3>
        <p className="text-gray-600 mb-4">{article.description}</p>
        <Button variant="outline">
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Full Article
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Velocity AI Documentation</h1>
              <p className="text-gray-600 mt-1">Everything you need to master AI-powered compliance</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Download Guides
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-6 relative max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedArticle ? (
          <div className="flex">
            {/* Sidebar Navigation */}
            <div className="w-64 flex-shrink-0 mr-8">
              <nav className="space-y-2">
                {filteredSections.map(section => (
                  <div key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors €{
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {section.icon}
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs text-gray-500">{section.articles.length} articles</div>
                      </div>
                    </button>
                  </div>
                ))}
              </nav>

              {/* Quick Links */}
              <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                <div className="space-y-2 text-sm">
                  <a href="/velocity/onboarding" className="flex items-center text-purple-600 hover:text-purple-700">
                    <Zap className="w-3 h-3 mr-1" />
                    Start Setup Wizard
                  </a>
                  <a href="/velocity/live" className="flex items-center text-blue-600 hover:text-blue-700">
                    <Target className="w-3 h-3 mr-1" />
                    Live Dashboard
                  </a>
                  <a href="/velocity/creator" className="flex items-center text-green-600 hover:text-green-700">
                    <Bot className="w-3 h-3 mr-1" />
                    Agent Creator
                  </a>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {searchQuery ? (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Search Results for "{searchQuery}"
                    </h2>
                    <span className="text-sm text-gray-500">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {searchResults.length === 0 ? (
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-600 mb-4">
                        Try adjusting your search terms or browse our documentation sections.
                      </p>
                      <Button variant="outline" onClick={() => setSearchQuery('')}>
                        Clear Search
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {searchResults.map((result, index) => {
                        const article = result.item;
                        const section = docSections.find(s => s.id === article.sectionId);
                        const relevanceScore = Math.round((1 - (result.score || 0)) * 100);
                        
                        return (
                          <div key={article.id} className="bg-white border rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
                               onClick={() => setSelectedArticle(article)}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    {section?.title}
                                  </span>
                                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    {relevanceScore}% match
                                  </span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                                <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {article.readTime} min read
                                  </span>
                                  <span className={`px-2 py-1 rounded-full €{
                                    article.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                    article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {article.difficulty}
                                  </span>
                                  {article.popular && (
                                    <span className="flex items-center text-orange-600">
                                      <Star className="w-3 h-3 mr-1" />
                                      Popular
                                    </span>
                                  )}
                                  <div className="flex flex-wrap gap-1">
                                    {article.tags.slice(0, 3).map(tag => (
                                      <span key={tag} className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400 ml-4" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Section Header */}
                  {currentSection && (
                    <div className="mb-8">
                      <div className="flex items-center space-x-3 mb-4">
                        {currentSection.icon}
                        <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
                      </div>
                      <p className="text-gray-600">{currentSection.description}</p>
                    </div>
                  )}

                  {/* Popular Articles */}
                  {currentSection && currentSection.articles.some(a => a.popular) && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Star className="w-4 h-4 mr-2 text-orange-500" />
                        Popular Articles
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentSection.articles.filter(a => a.popular).map(article => (
                          <div 
                            key={article.id}
                            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedArticle(article)}
                          >
                            <h4 className="font-semibold text-gray-900 mb-2">{article.title}</h4>
                            <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {article.readTime} min
                                </span>
                                <span className={`px-2 py-1 rounded-full €{
                                  article.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                  article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {article.difficulty}
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Articles */}
                  {currentSection && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">All Articles</h3>
                      <div className="space-y-3">
                        {currentSection.articles.map(article => (
                          <div 
                            key={article.id}
                            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedArticle(article)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {article.type === 'video' && <Video className="w-4 h-4 text-red-500" />}
                                  {article.type === 'tutorial' && <Settings className="w-4 h-4 text-blue-500" />}
                                  {article.type === 'guide' && <BookOpen className="w-4 h-4 text-green-500" />}
                                  {article.type === 'reference' && <Target className="w-4 h-4 text-purple-500" />}
                                  {article.type === 'faq' && <HelpCircle className="w-4 h-4 text-orange-500" />}
                                  <h4 className="font-semibold text-gray-900">{article.title}</h4>
                                  {article.popular && <Star className="w-4 h-4 text-orange-500" />}
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{article.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {article.readTime} min read
                                  </span>
                                  <span className={`px-2 py-1 rounded-full €{
                                    article.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                    article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {article.difficulty}
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {article.tags.slice(0, 3).map(tag => (
                                      <span key={tag} className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400 ml-4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Tutorials */}
                  {activeSection === 'getting-started' && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Video className="w-4 h-4 mr-2 text-red-500" />
                        Video Tutorials
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {videoTutorials.map(tutorial => (
                          <div key={tutorial.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                              <img 
                                src={tutorial.thumbnail} 
                                alt={tutorial.title}
                                className="w-full h-40 object-cover bg-gray-200"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <Play className="w-12 h-12 text-white" />
                              </div>
                              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                {tutorial.duration} min
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-2">{tutorial.title}</h4>
                              <p className="text-gray-600 text-sm mb-3">{tutorial.description}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{tutorial.steps} steps</span>
                                <span>{tutorial.difficulty}</span>
                                {tutorial.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FAQ Section */}
                  {activeSection === 'troubleshooting' && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <HelpCircle className="w-4 h-4 mr-2 text-blue-500" />
                        Frequently Asked Questions
                      </h3>
                      <div className="space-y-4">
                        {faqs.map((faq, index) => (
                          <div key={index} className="bg-white border rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-start">
                              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                              {faq.question}
                            </h4>
                            <p className="text-gray-600 ml-6">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          /* Article View */
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedArticle(null)}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Documentation
              </Button>
              
              <div className="bg-white border rounded-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedArticle.title}</h1>
                    <p className="text-gray-600 mb-4">{selectedArticle.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedArticle.readTime} min read
                      </span>
                      <span className={`px-2 py-1 rounded-full €{
                        selectedArticle.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        selectedArticle.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {selectedArticle.difficulty}
                      </span>
                      <div className="flex items-center space-x-1">
                        {selectedArticle.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  {renderArticleContent(selectedArticle)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VelocityDocumentation;