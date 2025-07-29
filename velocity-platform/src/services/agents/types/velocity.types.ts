export interface VelocityTier {
  id: string;
  name: 'starter' | 'growth' | 'scale';
  pricing: TierPricing;
  features: TierFeatures;
  limits: TierLimits;
  support: TierSupport;
}

export interface TierPricing {
  monthly: number;
  annual: number;
  currency: 'USD' | 'EUR' | 'GBP';
  billingCycle: 'monthly' | 'annual';
}

export interface TierFeatures {
  frameworks: string[];
  maxFrameworks: number;
  automation: {
    evidenceCollection: number; // percentage
    questionnaires: boolean;
    monitoring: boolean;
    alerts: boolean;
  };
  onboarding: {
    timeToTrustScore: number; // minutes
    wizardAvailable: boolean;
    templates: string[];
    instantScore: boolean;
  };
  integrations: string[];
}

export interface TierLimits {
  users: number | 'unlimited';
  agents: number;
  evidenceItems: number;
  apiCalls: number;
  storage: string; // e.g., "100GB"
}

export interface TierSupport {
  channels: ('email' | 'chat' | 'phone' | 'dedicated')[];
  responseTime: string; // e.g., "24 hours"
  csmAvailable: boolean;
  training: ('docs' | 'videos' | 'webinars' | 'custom')[];
}

export interface VelocityCustomer {
  id: string;
  organizationId: string;
  tier: 'starter' | 'growth' | 'scale';
  status: 'trial' | 'active' | 'suspended' | 'cancelled';
  signupDate: Date;
  trialEndsAt?: Date;
  billingInfo: BillingInfo;
  usage: CustomerUsage;
  trustScore: TrustScoreData;
}

export interface BillingInfo {
  subscriptionId: string;
  paymentMethod: 'card' | 'invoice' | 'ach';
  nextBillingDate: Date;
  amount: number;
  currency: string;
}

export interface CustomerUsage {
  activeUsers: number;
  evidenceCollected: number;
  agentRuns: number;
  apiCallsThisMonth: number;
  storageUsedGB: number;
  lastActivity: Date;
}

export interface TrustScoreData {
  current: number;
  history: TrustScoreHistory[];
  breakdown: {
    security: number;
    compliance: number;
    operations: number;
    governance: number;
  };
  nextMilestone: {
    score: number;
    requirements: string[];
    estimatedTime: string;
  };
}

export interface TrustScoreHistory {
  score: number;
  timestamp: Date;
  change: number;
  reason: string;
}

export interface VelocityOnboarding {
  id: string;
  customerId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  currentStep: number;
  totalSteps: number;
  startedAt?: Date;
  completedAt?: Date;
  steps: OnboardingStep[];
  timeToTrustScore?: number;
}

export interface OnboardingStep {
  id: string;
  name: string;
  description: string;
  type: 'connect' | 'configure' | 'scan' | 'review';
  status: 'pending' | 'active' | 'completed' | 'skipped';
  requiredTime: number; // minutes
  actualTime?: number;
  data?: Record<string, any>;
}

export interface QuickStartWizard {
  templates: {
    aiStartup: OnboardingTemplate;
    saas: OnboardingTemplate;
    fintech: OnboardingTemplate;
    healthcare: OnboardingTemplate;
  };
}

export interface OnboardingTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  commonStack: string[];
  recommendedFrameworks: string[];
  preConfiguredAgents: string[];
  estimatedTime: number;
  successMetrics: {
    trustScore: number;
    evidenceItems: number;
    frameworks: string[];
  };
}

export interface VelocityDashboard {
  hero: {
    trustScore: number;
    trustScoreChange: number;
    timeToCompliance: string;
    evidenceProgress: number;
    quickActions: QuickAction[];
  };
  agentControl: {
    activeAgents: AgentStatus[];
    queuedTasks: number;
    completedToday: number;
    failureRate: number;
  };
  evidenceGallery: {
    recentEvidence: Evidence[];
    totalEvidence: number;
    byFramework: Record<string, number>;
    needsReview: number;
  };
  compliance: {
    frameworks: FrameworkStatus[];
    gaps: ComplianceGap[];
    recommendations: string[];
  };
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: string;
  enabled: boolean;
}

export interface AgentStatus {
  agentId: string;
  name: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  estimatedCompletion?: Date;
}

export interface FrameworkStatus {
  id: string;
  name: string;
  completeness: number;
  status: 'not_started' | 'in_progress' | 'ready' | 'certified';
  lastUpdated: Date;
  nextSteps: string[];
}

export interface ComplianceGap {
  frameworkId: string;
  controlId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  remediation: string;
  estimatedEffort: string;
  automatable: boolean;
}

export interface Evidence {
  id: string;
  type: 'screenshot' | 'document' | 'api_response' | 'configuration';
  title: string;
  description: string;
  collectedAt: Date;
  collectedBy: 'agent' | 'manual' | 'integration';
  frameworkMappings: string[];
  status: 'pending' | 'approved' | 'rejected';
  url?: string;
  metadata: Record<string, any>;
}