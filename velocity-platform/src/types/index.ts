// Core types for ERIP platform

// User and Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  organization: Organization;
  role: UserRole;
  permissions: Permission[];
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  size: OrganizationSize;
  subscription: Subscription;
}

export const UserRole = {
  ADMIN: 'ADMIN',
  CISO: 'CISO',
  COMPLIANCE_MANAGER: 'COMPLIANCE_MANAGER',
  SECURITY_ARCHITECT: 'SECURITY_ARCHITECT',
  EXECUTIVE: 'EXECUTIVE',
  AUDITOR: 'AUDITOR',
  USER: 'USER'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface Permission {
  id: string;
  resource: string;
  action: string;
}

export const OrganizationSize = {
  STARTUP: 'STARTUP',
  SME: 'SME',
  ENTERPRISE: 'ENTERPRISE'
} as const;

export type OrganizationSize = typeof OrganizationSize[keyof typeof OrganizationSize];

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
}

export const SubscriptionPlan = {
  STARTER: 'STARTER',
  PROFESSIONAL: 'PROFESSIONAL',
  ENTERPRISE: 'ENTERPRISE'
} as const;

export type SubscriptionPlan = typeof SubscriptionPlan[keyof typeof SubscriptionPlan];

export const SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  TRIAL: 'TRIAL',
  SUSPENDED: 'SUSPENDED',
  CANCELLED: 'CANCELLED'
} as const;

export type SubscriptionStatus = typeof SubscriptionStatus[keyof typeof SubscriptionStatus];

// Common Risk Types
export interface Risk {
  id: string;
  name: string;
  category: RiskCategory;
  severity: Severity;
  likelihood: Likelihood;
  impact: Impact;
  status: RiskStatus;
  owner?: User;
  createdAt: Date;
  updatedAt: Date;
}

export const RiskCategory = {
  SECURITY: 'SECURITY',
  COMPLIANCE: 'COMPLIANCE',
  OPERATIONAL: 'OPERATIONAL',
  FINANCIAL: 'FINANCIAL',
  STRATEGIC: 'STRATEGIC',
  REPUTATIONAL: 'REPUTATIONAL'
} as const;

export type RiskCategory = typeof RiskCategory[keyof typeof RiskCategory];

export const Severity = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  INFO: 'INFO'
} as const;

export type Severity = typeof Severity[keyof typeof Severity];

export const Likelihood = {
  ALMOST_CERTAIN: 'ALMOST_CERTAIN',
  LIKELY: 'LIKELY',
  POSSIBLE: 'POSSIBLE',
  UNLIKELY: 'UNLIKELY',
  RARE: 'RARE'
} as const;

export type Likelihood = typeof Likelihood[keyof typeof Likelihood];

export interface Impact {
  financial?: number;
  operational?: string;
  reputational?: string;
  compliance?: string;
}

export const RiskStatus = {
  IDENTIFIED: 'IDENTIFIED',
  ASSESSED: 'ASSESSED',
  MITIGATING: 'MITIGATING',
  MONITORING: 'MONITORING',
  CLOSED: 'CLOSED'
} as const;

export type RiskStatus = typeof RiskStatus[keyof typeof RiskStatus];

// AI Model Types
export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  tier: AITier;
  capabilities: string[];
  costPerToken: number;
}

export const AIProvider = {
  ANTHROPIC: 'ANTHROPIC',
  OPENAI: 'OPENAI',
  OPEN_SOURCE: 'OPEN_SOURCE',
  SPECIALIZED: 'SPECIALIZED'
} as const;

export type AIProvider = typeof AIProvider[keyof typeof AIProvider];

export const AITier = {
  PREMIUM: 'PREMIUM',
  STANDARD: 'STANDARD',
  EFFICIENT: 'EFFICIENT'
} as const;

export type AITier = typeof AITier[keyof typeof AITier];

export interface AIRequest {
  id: string;
  model: AIModel;
  prompt: string;
  context?: any;
  response?: string;
  tokens: number;
  cost: number;
  timestamp: Date;
}

// Component-specific types will be defined in their respective directories