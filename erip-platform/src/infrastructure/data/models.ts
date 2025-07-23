/**
 * ERIP Shared Data Models
 * 
 * Unified TypeScript interfaces for all ERIP components following the orchestra architecture
 */

// ===============================
// Core Entity Models
// ===============================

export interface Organization {
  id: string
  name: string
  industry: string
  size: 'small' | 'medium' | 'large' | 'enterprise'
  createdAt: Date
  updatedAt: Date
  
  // Trust Equity
  trustScore: number
  trustTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  trustEquityBalance: number
  
  // Configuration
  riskAppetite: 'conservative' | 'moderate' | 'aggressive'
  complianceFrameworks: string[]
  
  // Metadata
  settings: Record<string, any>
  subscriptions: string[]
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'analyst' | 'viewer'
  organizationId: string
  
  // Permissions
  permissions: Permission[]
  componentAccess: ComponentAccess[]
  
  // Activity
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
  
  // Trust tracking
  trustPointsContributed: number
  activityScore: number
}

export interface Permission {
  resource: string
  actions: ('create' | 'read' | 'update' | 'delete')[]
  conditions?: Record<string, any>
}

export interface ComponentAccess {
  component: ERIPComponent
  level: 'none' | 'read' | 'write' | 'admin'
  features: string[]
}

export type ERIPComponent = 
  | 'compass' 
  | 'atlas' 
  | 'prism' 
  | 'pulse' 
  | 'cipher' 
  | 'nexus' 
  | 'beacon' 
  | 'clearance'

// ===============================
// COMPASS Models
// ===============================

export interface RegulatoryFramework {
  id: string
  name: string
  version: string
  jurisdiction: string
  industry: string[]
  
  requirements: FrameworkRequirement[]
  lastUpdated: Date
  effectiveDate: Date
  
  // Compliance tracking
  organizationCompliance: Map<string, ComplianceStatus>
  
  // Trust Equity
  trustEquityWeight: number
  basePointsPerRequirement: number
}

export interface FrameworkRequirement {
  id: string
  frameworkId: string
  section: string
  title: string
  description: string
  type: 'policy' | 'technical' | 'procedural' | 'documentation'
  mandatory: boolean
  
  // Implementation
  implementationGuidance: string[]
  acceptableMethods: string[]
  evidenceTypes: string[]
  
  // Assessment
  assessmentCriteria: AssessmentCriteria[]
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  
  // Trust Equity
  trustPointsValue: number
  multipliers: Record<string, number>
}

export interface ComplianceStatus {
  requirementId: string
  organizationId: string
  status: 'compliant' | 'partial' | 'non_compliant' | 'not_assessed'
  score: number // 0-100
  
  // Evidence
  evidence: Evidence[]
  gaps: ComplianceGap[]
  
  // Assessment details
  lastAssessed: Date
  assessedBy: string
  nextAssessmentDue: Date
  
  // Automation
  automationLevel: number // 0-100
  monitoringEnabled: boolean
}

export interface ComplianceGap {
  id: string
  requirementId: string
  organizationId: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  
  // Remediation
  remediationPlan: RemediationPlan
  estimatedCost: number
  estimatedTimeToResolve: number // days
  
  // Trust impact
  trustEquityAtRisk: number
  businessImpact: string
  
  // Tracking
  status: 'open' | 'in_progress' | 'resolved' | 'accepted'
  assignee: string
  createdAt: Date
  resolvedAt?: Date
}

// ===============================
// ATLAS Models
// ===============================

export interface Asset {
  id: string
  name: string
  type: 'server' | 'application' | 'database' | 'network' | 'cloud_service' | 'endpoint'
  organizationId: string
  
  // Technical details
  ipAddresses: string[]
  hostnames: string[]
  operatingSystem?: string
  version?: string
  
  // Classification
  criticality: 'low' | 'medium' | 'high' | 'critical'
  classification: 'public' | 'internal' | 'confidential' | 'restricted'
  dataTypes: string[]
  
  // Location and ownership
  location: string
  owner: string
  businessFunction: string
  
  // Security
  securityControls: SecurityControl[]
  vulnerabilities: Vulnerability[]
  
  // Compliance
  complianceFrameworks: string[]
  lastAssessment: Date
  
  // Trust Equity
  trustContribution: number
  riskExposure: number
  
  // Lifecycle
  createdAt: Date
  updatedAt: Date
  decommissionedAt?: Date
}

export interface SecurityControl {
  id: string
  assetId: string
  type: 'preventive' | 'detective' | 'corrective'
  category: string
  name: string
  description: string
  
  // Implementation
  implementationStatus: 'not_implemented' | 'partial' | 'implemented' | 'optimized'
  effectiveness: number // 0-100
  automationLevel: number // 0-100
  
  // Compliance mapping
  frameworkMappings: FrameworkMapping[]
  
  // Monitoring
  lastTested: Date
  testResults: TestResult[]
  
  // Trust Equity
  trustPointsGenerated: number
  riskReduction: number
}

export interface Vulnerability {
  id: string
  assetId: string
  cveId?: string
  title: string
  description: string
  
  // Scoring
  cvssScore: number
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical'
  exploitability: number
  
  // Details
  affectedComponents: string[]
  attack_vector: 'network' | 'adjacent' | 'local' | 'physical'
  
  // Remediation
  remediationSteps: string[]
  patchAvailable: boolean
  workarounds: string[]
  
  // Risk assessment
  riskScore: number
  businessImpact: number
  likelihood: number
  
  // Lifecycle
  discoveredAt: Date
  resolvedAt?: Date
  status: 'open' | 'in_progress' | 'resolved' | 'accepted'
  
  // Trust impact
  trustEquityImpact: number
}

// ===============================
// PRISM Models
// ===============================

export interface RiskScenario {
  id: string
  organizationId: string
  name: string
  description: string
  category: string
  
  // Risk calculation
  probability: number // 0-1
  impact: number // dollar amount
  ale: number // Annual Loss Expectancy
  sle: number // Single Loss Expectancy  
  aro: number // Annual Rate of Occurrence
  
  // Monte Carlo simulation results
  simulationResults?: MonteCarloResults
  confidenceInterval: {
    lower: number
    upper: number
    confidence: number
  }
  
  // Mitigation
  mitigationControls: MitigationControl[]
  residualRisk: number
  costOfMitigation: number
  
  // Business context
  affectedAssets: string[]
  affectedProcesses: string[]
  regulatoryImplications: string[]
  
  // Trust Equity
  trustEquityRequired: number
  trustEquityAtRisk: number
  
  // Lifecycle
  createdAt: Date
  updatedAt: Date
  lastReviewed: Date
  reviewedBy: string
}

export interface MonteCarloResults {
  simulationId: string
  iterations: number
  
  results: {
    mean: number
    median: number
    mode: number
    standardDeviation: number
    variance: number
    skewness: number
    kurtosis: number
  }
  
  percentiles: {
    p5: number
    p10: number
    p25: number
    p50: number
    p75: number
    p90: number
    p95: number
    p99: number
  }
  
  distribution: {
    x: number[]
    y: number[]
  }
  
  convergenceMetrics: {
    converged: boolean
    convergenceIteration?: number
    stabilityScore: number
  }
}

export interface MitigationControl {
  id: string
  riskScenarioId: string
  name: string
  type: 'preventive' | 'detective' | 'corrective'
  
  // Effectiveness
  riskReduction: number // percentage
  cost: number
  implementationTime: number // days
  
  // Implementation
  status: 'planned' | 'in_progress' | 'implemented' | 'verified'
  assignee: string
  dueDate: Date
  
  // Dependencies
  prerequisites: string[]
  dependencies: string[]
  
  // Trust Equity
  trustEquityGenerated: number
}

// ===============================
// PULSE Models
// ===============================

export interface MonitoringMetric {
  id: string
  name: string
  description: string
  category: 'security' | 'performance' | 'availability' | 'compliance'
  dataType: 'gauge' | 'counter' | 'histogram' | 'summary'
  
  // Collection
  source: string
  collectionInterval: number // seconds
  retention: number // days
  
  // Thresholds
  warningThreshold?: number
  criticalThreshold?: number
  
  // Processing
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count'
  smoothing?: 'none' | 'moving_average' | 'exponential'
  
  // Alert configuration
  alertEnabled: boolean
  alertTemplate?: string
  
  // Trust Equity
  trustEquityWeight: number
}

export interface Alert {
  id: string
  title: string
  description: string
  severity: 'info' | 'warning' | 'critical'
  
  // Source information
  source: string
  metricId?: string
  assetId?: string
  
  // Alert data
  triggeredAt: Date
  value: number
  threshold: number
  
  // Correlation
  correlatedAlerts: string[]
  rootCause?: string
  
  // Response
  status: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'false_positive'
  assignee?: string
  acknowledgedAt?: Date
  resolvedAt?: Date
  
  // Automation
  autoRemediationTriggered: boolean
  remediationActions: RemediationAction[]
  
  // Business impact
  affectedServices: string[]
  estimatedImpact: number
  
  // Trust Equity
  trustEquityImpact: number
}

// ===============================
// Shared Supporting Models
// ===============================

export interface Evidence {
  id: string
  title: string
  description: string
  type: 'document' | 'screenshot' | 'report' | 'certificate' | 'policy' | 'procedure'
  
  // File information
  fileName: string
  fileSize: number
  mimeType: string
  checksum: string
  
  // Storage
  storageLocation: string
  accessUrl: string
  
  // Metadata
  tags: string[]
  categories: string[]
  
  // Verification
  verificationStatus: 'unverified' | 'verified' | 'expired' | 'invalid'
  verifiedBy?: string
  verifiedAt?: Date
  expiryDate?: Date
  
  // Compliance mapping
  frameworkMappings: FrameworkMapping[]
  requirementIds: string[]
  
  // Lifecycle
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface FrameworkMapping {
  frameworkId: string
  requirementId: string
  mappingType: 'direct' | 'partial' | 'supporting'
  confidence: number // 0-100
  notes?: string
}

export interface AssessmentCriteria {
  id: string
  question: string
  expectedAnswer: string
  weight: number // 0-1
  assessmentMethod: 'document_review' | 'interview' | 'observation' | 'testing'
}

export interface TestResult {
  id: string
  testDate: Date
  testType: 'manual' | 'automated'
  result: 'pass' | 'fail' | 'partial'
  score: number // 0-100
  findings: string[]
  recommendations: string[]
  tester: string
}

export interface RemediationPlan {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  
  // Steps
  steps: RemediationStep[]
  
  // Resources
  estimatedCost: number
  requiredSkills: string[]
  dependencies: string[]
  
  // Timeline
  estimatedDuration: number // days
  startDate?: Date
  targetDate?: Date
  
  // Approval
  approved: boolean
  approvedBy?: string
  approvedAt?: Date
}

export interface RemediationStep {
  id: string
  sequence: number
  title: string
  description: string
  assignee: string
  
  // Status
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  
  // Timeline
  estimatedHours: number
  startDate?: Date
  completedDate?: Date
  
  // Dependencies
  dependencies: string[]
  blockers: string[]
}

export interface RemediationAction {
  id: string
  alertId: string
  type: 'automated' | 'manual'
  name: string
  description: string
  
  // Execution
  status: 'pending' | 'running' | 'completed' | 'failed'
  triggeredAt: Date
  completedAt?: Date
  
  // Results
  success: boolean
  output: string
  errorMessage?: string
  
  // Impact
  riskReduction: number
  costSavings: number
}

// ===============================
// Trust Equity Models
// ===============================

export interface TrustEquityTransaction {
  id: string
  entityId: string
  entityType: 'organization' | 'user' | 'asset'
  
  // Transaction details
  type: 'earned' | 'spent' | 'expired' | 'adjusted'
  amount: number
  balance_after: number
  
  // Source information
  source: ERIPComponent
  sourceId: string
  category: 'compliance' | 'security' | 'risk_management' | 'automation' | 'intelligence'
  
  // Metadata
  description: string
  evidence: string[]
  multiplier: number
  
  // Lifecycle
  timestamp: Date
  expiresAt?: Date
  reversedAt?: Date
  reversalReason?: string
}

export interface TrustScore {
  entityId: string
  entityType: 'organization' | 'user' | 'asset'
  
  // Overall score
  totalScore: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  
  // Component breakdown
  breakdown: {
    compliance: number
    security: number
    risk_management: number
    automation: number
    intelligence: number
  }
  
  // Trending
  previousScore: number
  change: number
  trend: 'up' | 'down' | 'stable'
  
  // Metadata
  lastCalculated: Date
  calculationVersion: string
  
  // Benchmarking
  industryPercentile?: number
  sizePercentile?: number
}

// ===============================
// API Response Models
// ===============================

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  metadata?: {
    timestamp: string
    version: string
    requestId: string
  }
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

// ===============================
// Query and Filter Models
// ===============================

export interface QueryOptions {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, any>
  include?: string[]
}

export interface DateRange {
  start: Date
  end: Date
}

export interface NumericRange {
  min?: number
  max?: number
}

// ===============================
// Integration Models
// ===============================

export interface IntegrationConfig {
  id: string
  name: string
  type: 'api' | 'webhook' | 'file_sync' | 'database'
  
  // Configuration
  config: Record<string, any>
  credentials: Record<string, string>
  
  // Status
  enabled: boolean
  lastSync?: Date
  lastError?: string
  
  // Rate limiting
  rateLimit: number
  rateLimitWindow: number // seconds
  
  // Retry configuration
  retryAttempts: number
  retryBackoff: number // seconds
}

export interface SyncResult {
  integrationId: string
  startTime: Date
  endTime: Date
  status: 'success' | 'partial' | 'failed'
  
  // Statistics
  recordsProcessed: number
  recordsCreated: number
  recordsUpdated: number
  recordsSkipped: number
  recordsFailed: number
  
  // Errors
  errors: SyncError[]
  warnings: string[]
  
  // Trust Equity
  trustEquityGenerated: number
}

export interface SyncError {
  recordId?: string
  errorCode: string
  message: string
  details?: any
  retryable: boolean
}