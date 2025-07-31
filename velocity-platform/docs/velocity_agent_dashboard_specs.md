# Velocity AI Agent Dashboard - Component Specifications

## 🎯 MISSION: SHOWCASE 10 PRODUCTION AI AGENTS

### **Problem Statement:**
- Backend: 10 production-ready AI agents (363KB of implementation)
- Frontend: No UI to showcase this revolutionary automation
- Result: Users can't see the magic happening

---

## **COMPONENT 1: AGENT MONITORING DASHBOARD**

### **Primary Interface: AgentGrid.tsx**
```typescript
interface AgentGridProps {
  agents: Agent[];
  realTimeStatus: boolean;
  onDeploy: (agentId: string) => void;
  onSchedule: (agentId: string, schedule: Schedule) => void;
}

interface Agent {
  id: string;
  name: string;
  type: 'AWS' | 'GCP' | 'Azure' | 'GitHub' | 'QIE' | 'TrustScore' | 'Monitor' | 'DocGen' | 'Observability' | 'Crypto';
  status: 'collecting' | 'idle' | 'error' | 'scheduled' | 'connecting';
  lastRun: Date;
  nextRun: Date;
  evidenceCollected: number;
  successRate: number;
  currentTask?: string;
  progress?: number;
}

const PRODUCTION_AGENTS: Agent[] = [
  {
    id: 'aws-evidence',
    name: 'AWS Evidence Collector',
    type: 'AWS',
    status: 'collecting',
    lastRun: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
    nextRun: new Date(Date.now() + 28 * 60 * 1000), // 28 min from now
    evidenceCollected: 247,
    successRate: 98.2,
    currentTask: 'Scanning CloudTrail configurations',
    progress: 67
  },
  {
    id: 'gcp-scanner',
    name: 'GCP Security Scanner',
    type: 'GCP',
    status: 'idle',
    lastRun: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    evidenceCollected: 156,
    successRate: 97.8
  },
  {
    id: 'azure-monitor',
    name: 'Azure Security Monitor',
    type: 'Azure',
    status: 'scheduled',
    lastRun: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    nextRun: new Date(Date.now() + 90 * 60 * 1000), // 90 min
    evidenceCollected: 203,
    successRate: 96.5
  },
  {
    id: 'github-analyzer',
    name: 'GitHub Security Analyzer',
    type: 'GitHub',
    status: 'collecting',
    lastRun: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
    nextRun: new Date(Date.now() + 55 * 60 * 1000), // 55 min
    evidenceCollected: 89,
    successRate: 99.1,
    currentTask: 'Analyzing organization security settings',
    progress: 23
  },
  {
    id: 'qie-agent',
    name: 'QIE Integration Agent',
    type: 'QIE',
    status: 'idle',
    lastRun: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    nextRun: new Date(Date.now() + 45 * 60 * 1000), // 45 min
    evidenceCollected: 134,
    successRate: 94.7
  },
  {
    id: 'trust-engine',
    name: 'Trust Score Engine',
    type: 'TrustScore',
    status: 'collecting',
    lastRun: new Date(Date.now() - 1 * 60 * 1000), // 1 min ago
    nextRun: new Date(Date.now() + 14 * 60 * 1000), // 14 min
    evidenceCollected: 312,
    successRate: 99.8,
    currentTask: 'Calculating cryptographic verification',
    progress: 89
  },
  {
    id: 'continuous-monitor',
    name: 'Continuous Monitor',
    type: 'Monitor',
    status: 'collecting',
    lastRun: new Date(Date.now() - 30 * 1000), // 30 sec ago
    nextRun: new Date(Date.now() + 4.5 * 60 * 1000), // 4.5 min
    evidenceCollected: 445,
    successRate: 97.3,
    currentTask: 'Monitoring configuration changes',
    progress: 15
  },
  {
    id: 'doc-generator',
    name: 'Document Generator',
    type: 'DocGen',
    status: 'idle',
    lastRun: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    nextRun: new Date(Date.now() + 75 * 60 * 1000), // 75 min
    evidenceCollected: 178,
    successRate: 95.4
  },
  {
    id: 'observability',
    name: 'Observability Specialist',
    type: 'Observability',
    status: 'scheduled',
    lastRun: new Date(Date.now() - 20 * 60 * 1000), // 20 min ago
    nextRun: new Date(Date.now() + 40 * 60 * 1000), // 40 min
    evidenceCollected: 267,
    successRate: 98.9
  },
  {
    id: 'crypto-verification',
    name: 'Cryptographic Verification',
    type: 'Crypto',
    status: 'collecting',
    lastRun: new Date(Date.now() - 3 * 60 * 1000), // 3 min ago
    nextRun: new Date(Date.now() + 12 * 60 * 1000), // 12 min
    evidenceCollected: 89,
    successRate: 100.0,
    currentTask: 'Generating blockchain proofs',
    progress: 45
  }
];
```

### **Visual Design Specifications**
```typescript
interface AgentCardDesign {
  layout: 'grid' | 'list';
  cardSize: '320px x 240px';
  
  statusIndicators: {
    collecting: 'Pulsing emerald with progress ring',
    idle: 'Subtle gray with last run time',
    error: 'Red with retry button',
    scheduled: 'Amber with countdown timer',
    connecting: 'Blue with spinning loader'
  };
  
  realTimeUpdates: {
    websocket: 'Connect to /ws/agents for live status',
    updateFrequency: '2 seconds for active agents',
    animations: 'Smooth transitions for status changes'
  };
  
  interactionStates: {
    hover: 'Lift card with detailed information overlay',
    click: 'Expand to show full agent details and logs',
    deploy: 'Show deployment modal with options'
  };
}
```

---

## **COMPONENT 2: LIVE EVIDENCE STREAM**

### **Real-Time Evidence Feed: EvidenceStream.tsx**
```typescript
interface EvidenceStreamProps {
  evidence: EvidenceItem[];
  filters: EvidenceFilter;
  onValidate: (evidenceId: string, validation: ValidationResult) => void;
  realTime: boolean;
}

interface EvidenceItem {
  id: string;
  agentId: string;
  agentName: string;
  type: 'screenshot' | 'configuration' | 'log' | 'policy' | 'certificate';
  title: string;
  description: string;
  timestamp: Date;
  framework: ('SOC2' | 'ISO27001' | 'GDPR' | 'HIPAA')[];
  controls: string[];
  confidence: number; // AI validation confidence 0-100
  status: 'collecting' | 'validating' | 'approved' | 'flagged';
  thumbnailUrl?: string;
  fullUrl?: string;
  metadata: Record<string, any>;
}

const SAMPLE_EVIDENCE_STREAM: EvidenceItem[] = [
  {
    id: 'ev-001',
    agentId: 'aws-evidence',
    agentName: 'AWS Evidence Collector',
    type: 'screenshot',
    title: 'CloudTrail Configuration',
    description: 'Management events logging enabled for all regions',
    timestamp: new Date(),
    framework: ['SOC2', 'ISO27001'],
    controls: ['CC6.1', 'CC6.8', 'A.12.4.1'],
    confidence: 98,
    status: 'validating',
    thumbnailUrl: '/evidence/thumbs/cloudtrail-001.png',
    fullUrl: '/evidence/full/cloudtrail-001.png',
    metadata: {
      region: 'us-east-1',
      account: 'prod-account',
      service: 'CloudTrail'
    }
  },
  {
    id: 'ev-002',
    agentId: 'github-analyzer',
    agentName: 'GitHub Security Analyzer',
    type: 'configuration',
    title: 'Branch Protection Rules',
    description: 'Require pull request reviews and status checks',
    timestamp: new Date(Date.now() - 30000),
    framework: ['SOC2'],
    controls: ['CC8.1'],
    confidence: 95,
    status: 'approved',
    metadata: {
      repository: 'main-app',
      branch: 'main',
      protection: 'enabled'
    }
  }
];
```

### **Evidence Stream UI Specifications**
```typescript
interface EvidenceStreamDesign {
  layout: 'timeline' | 'cards' | 'table';
  
  realTimeFeatures: {
    newItemAnimation: 'Slide in from top with pulse effect',
    statusUpdates: 'Live status changes with smooth transitions',
    countdownTimers: 'Next collection countdown for each agent',
    progressIndicators: 'Collection progress for active agents'
  };
  
  evidencePreview: {
    screenshots: 'Thumbnail with zoom overlay on hover',
    configurations: 'JSON/YAML preview with syntax highlighting',
    logs: 'Recent entries with search and filter',
    policies: 'Document preview with compliance mapping'
  };
  
  validationUI: {
    confidenceScore: 'Progress ring with percentage',
    aiInsights: 'Tooltip with validation reasoning',
    manualActions: 'Approve/Flag/Request Re-collection buttons',
    frameworkMapping: 'Visual tags for applicable frameworks'
  };
}
```

---

## **COMPONENT 3: CLOUD INTEGRATION HUB**

### **Multi-Cloud Connection Manager: CloudHub.tsx**
```typescript
interface CloudHubProps {
  connections: CloudConnection[];
  onConnect: (platform: CloudPlatform) => void;
  onTest: (connectionId: string) => void;
  onConfigure: (connectionId: string, config: CloudConfig) => void;
}

interface CloudConnection {
  id: string;
  platform: 'AWS' | 'GCP' | 'Azure' | 'GitHub';
  status: 'connected' | 'connecting' | 'error' | 'disconnected';
  lastSync: Date;
  nextSync: Date;
  permissions: PermissionStatus[];
  evidenceCount: number;
  agentsDeployed: string[];
  healthScore: number;
  issues?: CloudIssue[];
}

interface PermissionStatus {
  name: string;
  required: boolean;
  granted: boolean;
  description: string;
  impact?: string;
}

const CLOUD_CONNECTIONS: CloudConnection[] = [
  {
    id: 'aws-prod',
    platform: 'AWS',
    status: 'connected',
    lastSync: new Date(Date.now() - 5 * 60 * 1000),
    nextSync: new Date(Date.now() + 25 * 60 * 1000),
    permissions: [
      { name: 'SecurityHub:GetFindings', required: true, granted: true, description: 'Read security findings' },
      { name: 'CloudTrail:DescribeTrails', required: true, granted: true, description: 'Access audit logs' },
      { name: 'IAM:ListPolicies', required: true, granted: true, description: 'Review IAM policies' },
      { name: 'Config:GetComplianceDetails', required: false, granted: false, description: 'Enhanced compliance data', impact: 'Reduced evidence quality' }
    ],
    evidenceCount: 247,
    agentsDeployed: ['aws-evidence', 'continuous-monitor'],
    healthScore: 95
  },
  {
    id: 'gcp-prod',
    platform: 'GCP',
    status: 'connected',
    lastSync: new Date(Date.now() - 10 * 60 * 1000),
    nextSync: new Date(Date.now() + 50 * 60 * 1000),
    permissions: [
      { name: 'securitycenter.findings.list', required: true, granted: true, description: 'Security Command Center access' },
      { name: 'logging.logs.list', required: true, granted: true, description: 'Cloud Logging access' },
      { name: 'iam.roles.list', required: true, granted: true, description: 'IAM role enumeration' }
    ],
    evidenceCount: 156,
    agentsDeployed: ['gcp-scanner'],
    healthScore: 98
  },
  {
    id: 'azure-prod',
    platform: 'Azure',
    status: 'error',
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
    nextSync: new Date(Date.now() + 30 * 60 * 1000),
    permissions: [
      { name: 'Security Reader', required: true, granted: true, description: 'Security Center access' },
      { name: 'Log Analytics Reader', required: true, granted: false, description: 'Activity log access' }
    ],
    evidenceCount: 203,
    agentsDeployed: ['azure-monitor'],
    healthScore: 67,
    issues: [
      { severity: 'error', message: 'Missing Log Analytics Reader permission', fix: 'Grant permission in Azure portal' }
    ]
  }
];
```

---

## **COMPONENT 4: AGENT DEPLOYMENT WIZARD**

### **One-Click Agent Deployment: AgentDeployment.tsx**
```typescript
interface AgentDeploymentProps {
  frameworks: Framework[];
  cloudConnections: CloudConnection[];
  onDeploy: (deployment: AgentDeployment) => void;
}

interface AgentDeployment {
  agents: string[];
  schedule: DeploymentSchedule;
  frameworks: string[];
  platforms: string[];
  configuration: DeploymentConfig;
}

interface DeploymentSchedule {
  frequency: 'continuous' | 'hourly' | 'daily' | 'weekly' | 'on-demand';
  startTime?: Date;
  timezone: string;
  retryPolicy: RetryPolicy;
}

// Smart deployment recommendations based on user selections
const DEPLOYMENT_STRATEGIES = {
  'SOC2_AUDIT_PREP': {
    name: 'SOC 2 Audit Preparation',
    description: 'Deploy all SOC 2 relevant agents for comprehensive evidence collection',
    agents: ['aws-evidence', 'gcp-scanner', 'azure-monitor', 'github-analyzer', 'continuous-monitor', 'crypto-verification'],
    schedule: { frequency: 'daily', startTime: new Date(), timezone: 'UTC' },
    estimatedTime: '45 minutes',
    evidenceCount: '800+ pieces'
  },
  'QUESTIONNAIRE_READY': {
    name: 'Questionnaire Response Ready',
    description: 'Quick deployment for immediate questionnaire response capabilities',
    agents: ['qie-agent', 'trust-engine', 'doc-generator'],
    schedule: { frequency: 'on-demand', timezone: 'UTC' },
    estimatedTime: '15 minutes',
    evidenceCount: '200+ pieces'
  },
  'CONTINUOUS_COMPLIANCE': {
    name: 'Continuous Compliance Monitoring',
    description: 'Full agent deployment for ongoing compliance monitoring',
    agents: ['aws-evidence', 'gcp-scanner', 'azure-monitor', 'github-analyzer', 'continuous-monitor', 'observability', 'trust-engine', 'crypto-verification'],
    schedule: { frequency: 'continuous', timezone: 'UTC' },
    estimatedTime: 'Ongoing',
    evidenceCount: '1000+ pieces/week'
  }
};
```

---

## **COMPONENT 5: PERFORMANCE ANALYTICS**

### **Agent Performance Dashboard: AgentAnalytics.tsx**
```typescript
interface AgentAnalyticsProps {
  timeRange: TimeRange;
  agents: string[];
  metrics: AgentMetrics[];
}

interface AgentMetrics {
  agentId: string;
  agentName: string;
  metrics: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    averageRunTime: number; // seconds
    evidenceCollected: number;
    evidenceQuality: number; // average confidence score
    uptimePercentage: number;
    lastError?: ErrorInfo;
    trends: MetricTrend[];
  };
}

interface MetricTrend {
  date: Date;
  successRate: number;
  evidenceCount: number;
  averageQuality: number;
  runTime: number;
}

// Performance optimization recommendations
const OPTIMIZATION_INSIGHTS = {
  'HIGH_FAILURE_RATE': 'Agent failure rate above 5% - check permissions and network connectivity',
  'SLOW_PERFORMANCE': 'Agent running slower than baseline - consider resource allocation',
  'LOW_QUALITY_EVIDENCE': 'Evidence quality below 90% - review collection parameters',
  'PERMISSION_ISSUES': 'Permission errors detected - update cloud credentials'
};
```

---

## **WEBSOCKET INTEGRATION SPECIFICATIONS**

### **Real-Time Agent Communication**
```typescript
interface WebSocketAgentUpdates {
  endpoint: '/ws/agents';
  
  messageTypes: {
    AGENT_STATUS_UPDATE: {
      agentId: string;
      status: AgentStatus;
      progress?: number;
      currentTask?: string;
    };
    
    EVIDENCE_COLLECTED: {
      agentId: string;
      evidence: EvidenceItem;
      timestamp: Date;
    };
    
    AGENT_ERROR: {
      agentId: string;
      error: ErrorInfo;
      retryCount: number;
    };
    
    DEPLOYMENT_COMPLETE: {
      deploymentId: string;
      agentsDeployed: string[];
      status: 'success' | 'partial' | 'failed';
    };
  };
  
  clientActions: {
    DEPLOY_AGENT: { agentId: string; config: AgentConfig };
    PAUSE_AGENT: { agentId: string };
    RESUME_AGENT: { agentId: string };
    REQUEST_STATUS: { agentId?: string }; // all agents if not specified
  };
}
```

---

## **SUCCESS METRICS & VALIDATION**

### **Week 1 Launch Targets**
- [ ] All 10 agents visible with real-time status
- [ ] Agent deployment working with one-click
- [ ] Live evidence stream showing real collections
- [ ] Cloud connection health monitoring active
- [ ] WebSocket updates working smoothly

### **User Experience Goals**
- [ ] Users can see the "magic" of automated evidence collection
- [ ] Agent automation feels reliable and professional
- [ ] Cloud integrations are transparent and trustworthy
- [ ] Evidence quality and validation builds confidence
- [ ] One-click deployment makes agents accessible

### **Technical Performance Targets**
- [ ] Sub-2-second agent status updates
- [ ] 99.5%+ WebSocket connection reliability
- [ ] <500ms response time for agent actions
- [ ] Real-time evidence stream with <3-second latency
- [ ] Mobile-responsive agent monitoring

---

## **IMPLEMENTATION CHECKLIST**

### **Phase 1: Core Agent Dashboard (Days 1-3)**
- [ ] `AgentGrid.tsx` - Main dashboard component
- [ ] `AgentCard.tsx` - Individual agent status cards
- [ ] `AgentStatus.tsx` - Real-time status indicators
- [ ] WebSocket connection setup

### **Phase 2: Evidence Automation (Days 4-5)**
- [ ] `EvidenceStream.tsx` - Live evidence feed
- [ ] `EvidencePreview.tsx` - Evidence validation UI
- [ ] `EvidenceFilters.tsx` - Filter and search components

### **Phase 3: Cloud Integration (Days 6-7)**
- [ ] `CloudHub.tsx` - Multi-cloud connection manager
- [ ] `ConnectionHealth.tsx` - Permission and health monitoring
- [ ] `CloudSetupWizard.tsx` - New connection setup

This dashboard will finally showcase Velocity's revolutionary automated evidence collection capabilities that have been hidden in the backend!