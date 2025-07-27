import { Evidence } from './browser.types';

export interface AIAgent {
  id: string;
  name: string;
  type: 'browser' | 'api' | 'hybrid';
  status: 'idle' | 'running' | 'paused' | 'failed';
  capabilities: string[];
  config: AgentConfig;
  metrics: AgentMetrics;
}

export interface AgentConfig {
  parallelism: number;
  timeout: number;
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
  };
  resourceLimits: {
    maxConcurrentTasks: number;
    maxMemoryMB: number;
    maxExecutionTimeMs: number;
  };
}

export interface AgentMetrics {
  tasksCompleted: number;
  tasksFailed: number;
  averageExecutionTime: number;
  successRate: number;
  lastExecutionTime?: Date;
  totalEvidenceCollected: number;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  type: 'prebuilt' | 'custom';
  platform: 'aws' | 'google' | 'github' | 'azure' | 'custom';
  estimatedDuration: number;
  steps: WorkflowStep[];
  requirements?: WorkflowRequirements;
  outputs: WorkflowOutput[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'navigate' | 'authenticate' | 'capture' | 'extract' | 'validate';
  description: string;
  instructions: string | NaturalLanguageInstruction;
  selectors?: string[];
  expectedOutcome?: any;
  failureStrategy?: 'retry' | 'skip' | 'abort';
  dependencies?: string[];
}

export interface NaturalLanguageInstruction {
  prompt: string;
  context?: Record<string, any>;
  examples?: string[];
}

export interface WorkflowRequirements {
  credentials?: CredentialRequirement[];
  permissions?: string[];
  prerequisites?: string[];
}

export interface CredentialRequirement {
  type: 'username_password' | 'api_key' | 'oauth' | 'mfa';
  name: string;
  description: string;
  optional?: boolean;
}

export interface WorkflowOutput {
  type: 'evidence' | 'metric' | 'report';
  format: string;
  destination: 'storage' | 'notification' | 'api';
}

export interface AgentTask {
  id: string;
  agentId: string;
  workflowId: string;
  customerId: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: TaskResult;
  context: TaskContext;
}

export type TaskStatus = 
  | 'pending'
  | 'scheduled'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'retrying';

export interface TaskResult {
  success: boolean;
  evidence?: Evidence[];
  errors?: TaskError[];
  metrics?: Record<string, any>;
  nextSteps?: string[];
}

export interface TaskError {
  code: string;
  message: string;
  stack?: string;
  retryable: boolean;
  occurredAt: Date;
}

export interface TaskContext {
  frameworkId: string;
  controlIds: string[];
  previousEvidence?: Evidence[];
  customerConfig?: Record<string, any>;
  sessionData?: Record<string, any>;
}

export interface AgentOrchestrator {
  id: string;
  status: 'active' | 'paused' | 'stopped';
  agents: AIAgent[];
  queue: TaskQueue;
  metrics: OrchestratorMetrics;
}

export interface TaskQueue {
  pending: AgentTask[];
  active: AgentTask[];
  completed: AgentTask[];
  failed: AgentTask[];
  maxConcurrent: number;
  priorityWeights: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface OrchestratorMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageWaitTime: number;
  averageExecutionTime: number;
  throughput: number;
  resourceUtilization: {
    cpu: number;
    memory: number;
    network: number;
  };
}