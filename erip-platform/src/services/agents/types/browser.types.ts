export interface BrowserConfig {
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
  userAgent?: string;
  proxy?: {
    server: string;
    username?: string;
    password?: string;
  };
  timeout: number;
  retries: number;
}

export interface BrowserSession {
  id: string;
  customerId: string;
  browser: 'chrome' | 'firefox' | 'safari';
  status: 'idle' | 'active' | 'failed';
  startTime: Date;
  lastActivity: Date;
  evidence: Evidence[];
}

export interface Evidence {
  id: string;
  type: 'screenshot' | 'text' | 'structured';
  frameworkId: string;
  controlId: string;
  timestamp: Date;
  url: string;
  selector?: string;
  data: ScreenshotData | TextData | StructuredData;
  validation: ValidationResult;
  metadata: {
    agentId: string;
    workflowId: string;
    retryCount: number;
    processingTime: number;
  };
}

export interface ScreenshotData {
  imageUrl: string;
  thumbnailUrl: string;
  fullPageCapture: boolean;
  dimensions: {
    width: number;
    height: number;
  };
  fileSize: number;
  format: 'png' | 'jpeg' | 'webp';
}

export interface TextData {
  content: string;
  extractedFrom: 'ocr' | 'dom' | 'api';
  confidence?: number;
  language?: string;
}

export interface StructuredData {
  schema: string;
  data: Record<string, any>;
  source: string;
}

export interface ValidationResult {
  status: 'valid' | 'invalid' | 'pending';
  score: number;
  issues?: ValidationIssue[];
  validatedAt?: Date;
  validatedBy?: string;
}

export interface ValidationIssue {
  type: 'quality' | 'completeness' | 'accuracy' | 'compliance';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion?: string;
}

export interface BrowserAutomationTask {
  id: string;
  customerId: string;
  type: 'navigate' | 'screenshot' | 'extract' | 'interact' | 'validate';
  target: string;
  instructions?: string;
  selectors?: string[];
  expectedResult?: any;
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffType: 'linear' | 'exponential';
  initialDelay: number;
  maxDelay: number;
  retryableErrors?: string[];
}

export interface AgentCapabilities {
  screenshot: {
    navigation: boolean;
    detection: boolean;
    capture: boolean;
    validation: boolean;
    retry: boolean;
  };
  extraction: {
    ocr: boolean;
    structuring: boolean;
    tagging: boolean;
    storage: boolean;
  };
  monitoring: {
    scheduling: boolean;
    changeDetection: boolean;
    healing: boolean;
    reporting: boolean;
  };
}

export interface BrowserPool {
  maxInstances: number;
  instancesPerCustomer: number;
  idleTimeout: number;
  resourceLimits: {
    cpu: number;
    memory: string;
    disk: string;
  };
  isolation: {
    network: boolean;
    storage: boolean;
    process: boolean;
  };
}