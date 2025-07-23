import type { AIModel, AIRequest } from '@/types';
import { AIProvider, AITier } from '@/types';

// AI Model Configuration
export const AI_MODELS: Record<string, AIModel> = {
  // Premium Tier - Complex Analysis
  CLAUDE_OPUS: {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: AIProvider.ANTHROPIC,
    tier: AITier.PREMIUM,
    capabilities: ['complex_analysis', 'strategic_insights', 'executive_reporting'],
    costPerToken: 0.00005
  },
  CLAUDE_SONNET: {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: AIProvider.ANTHROPIC,
    tier: AITier.PREMIUM,
    capabilities: ['regulatory_analysis', 'risk_assessment', 'policy_generation'],
    costPerToken: 0.00003
  },
  
  // Standard Tier - Regular Operations
  CLAUDE_HAIKU: {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: AIProvider.ANTHROPIC,
    tier: AITier.STANDARD,
    capabilities: ['standard_analysis', 'report_generation', 'data_processing'],
    costPerToken: 0.00001
  },
  GPT_35_TURBO: {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: AIProvider.OPENAI,
    tier: AITier.STANDARD,
    capabilities: ['general_purpose', 'classification', 'summarization'],
    costPerToken: 0.000002
  },
  
  // Efficient Tier - Batch Processing
  LLAMA_70B: {
    id: 'llama-3.1-70b',
    name: 'Llama 3.1 70B',
    provider: AIProvider.OPEN_SOURCE,
    tier: AITier.EFFICIENT,
    capabilities: ['batch_processing', 'data_extraction', 'classification'],
    costPerToken: 0.0001
  },
  MISTRAL_7B: {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    provider: AIProvider.OPEN_SOURCE,
    tier: AITier.EFFICIENT,
    capabilities: ['document_classification', 'simple_analysis'],
    costPerToken: 0.00005
  },
  PHI_3_MINI: {
    id: 'phi-3-mini',
    name: 'Phi-3 Mini',
    provider: AIProvider.OPEN_SOURCE,
    tier: AITier.EFFICIENT,
    capabilities: ['change_detection', 'monitoring', 'alerts'],
    costPerToken: 0.00001
  },
  
  // Specialized Models
  FINBERT: {
    id: 'finbert',
    name: 'FinBERT',
    provider: AIProvider.SPECIALIZED,
    tier: AITier.EFFICIENT,
    capabilities: ['financial_analysis', 'risk_quantification'],
    costPerToken: 0.0001
  },
  SECBERT: {
    id: 'secbert',
    name: 'SecBERT',
    provider: AIProvider.SPECIALIZED,
    tier: AITier.EFFICIENT,
    capabilities: ['security_classification', 'threat_analysis'],
    costPerToken: 0.0001
  },
  LEGALBERT: {
    id: 'legalbert',
    name: 'LegalBERT',
    provider: AIProvider.SPECIALIZED,
    tier: AITier.EFFICIENT,
    capabilities: ['legal_analysis', 'regulatory_processing'],
    costPerToken: 0.0001
  }
};

// Task complexity assessment
export interface TaskComplexity {
  level: 'simple' | 'medium' | 'complex' | 'critical';
  reasoning?: string;
}

// Model selection strategy
export class AIModelRouter {
  private static instance: AIModelRouter;
  // private costThreshold: number = 0.05; // 5% of revenue target
  private premiumUsageRatio: number = 0;
  
  private constructor() {}
  
  static getInstance(): AIModelRouter {
    if (!AIModelRouter.instance) {
      AIModelRouter.instance = new AIModelRouter();
    }
    return AIModelRouter.instance;
  }
  
  // Assess task complexity
  assessComplexity(task: string, context?: any): TaskComplexity {
    // Simple heuristics for complexity assessment
    const complexKeywords = ['strategic', 'executive', 'complex', 'critical', 'board'];
    const mediumKeywords = ['analyze', 'assess', 'evaluate', 'report'];
    const simpleKeywords = ['classify', 'extract', 'summarize', 'list'];
    
    const taskLower = task.toLowerCase();
    
    if (complexKeywords.some(keyword => taskLower.includes(keyword))) {
      return { level: 'complex', reasoning: 'Strategic or executive-level task' };
    }
    
    if (context?.priority === 'high' || context?.financial_impact > 1000000) {
      return { level: 'critical', reasoning: 'High priority or significant financial impact' };
    }
    
    if (mediumKeywords.some(keyword => taskLower.includes(keyword))) {
      return { level: 'medium', reasoning: 'Standard analysis task' };
    }
    
    if (simpleKeywords.some(keyword => taskLower.includes(keyword))) {
      return { level: 'simple', reasoning: 'Basic processing task' };
    }
    
    return { level: 'medium', reasoning: 'Default complexity assessment' };
  }
  
  // Select appropriate model based on task
  selectModel(task: string, context?: any): AIModel {
    const complexity = this.assessComplexity(task, context);
    const taskType = this.identifyTaskType(task);
    
    // Check premium usage ratio
    if (this.premiumUsageRatio > 0.2 && complexity.level !== 'critical') {
      // Force lower tier if premium usage is too high
      complexity.level = complexity.level === 'complex' ? 'medium' : 'simple';
    }
    
    // Route based on complexity and task type
    switch (complexity.level) {
      case 'critical':
      case 'complex':
        if (taskType === 'regulatory') return AI_MODELS.CLAUDE_SONNET;
        if (taskType === 'executive') return AI_MODELS.CLAUDE_OPUS;
        return AI_MODELS.CLAUDE_SONNET;
        
      case 'medium':
        if (taskType === 'financial') return AI_MODELS.FINBERT;
        if (taskType === 'security') return AI_MODELS.SECBERT;
        if (taskType === 'general') return AI_MODELS.CLAUDE_HAIKU;
        return AI_MODELS.GPT_35_TURBO;
        
      case 'simple':
        if (taskType === 'classification') return AI_MODELS.MISTRAL_7B;
        if (taskType === 'monitoring') return AI_MODELS.PHI_3_MINI;
        if (taskType === 'batch') return AI_MODELS.LLAMA_70B;
        return AI_MODELS.MISTRAL_7B;
        
      default:
        return AI_MODELS.CLAUDE_HAIKU;
    }
  }
  
  // Identify task type from content
  private identifyTaskType(task: string): string {
    const taskLower = task.toLowerCase();
    
    if (taskLower.includes('regulat') || taskLower.includes('complian')) {
      return 'regulatory';
    }
    if (taskLower.includes('executive') || taskLower.includes('board')) {
      return 'executive';
    }
    if (taskLower.includes('financ') || taskLower.includes('roi') || taskLower.includes('cost')) {
      return 'financial';
    }
    if (taskLower.includes('security') || taskLower.includes('threat') || taskLower.includes('vulnerab')) {
      return 'security';
    }
    if (taskLower.includes('classif') || taskLower.includes('categor')) {
      return 'classification';
    }
    if (taskLower.includes('monitor') || taskLower.includes('track') || taskLower.includes('alert')) {
      return 'monitoring';
    }
    if (taskLower.includes('batch') || taskLower.includes('bulk')) {
      return 'batch';
    }
    
    return 'general';
  }
  
  // Update usage metrics
  updateUsageMetrics(model: AIModel, _tokens: number) {
    // In production, this would update a database
    if (model.tier === AITier.PREMIUM) {
      // Track premium usage ratio
      // This is simplified - in production would track over time windows
      this.premiumUsageRatio = Math.min(this.premiumUsageRatio + 0.01, 1);
    } else {
      this.premiumUsageRatio = Math.max(this.premiumUsageRatio - 0.001, 0);
    }
  }
}

// AI Service Interface
export interface AIService {
  processRequest(request: Partial<AIRequest>): Promise<AIRequest>;
  estimateCost(task: string, context?: any): number;
  getModelRecommendation(task: string, context?: any): AIModel;
}

// Mock AI Service Implementation
export class MockAIService implements AIService {
  private router: AIModelRouter;
  
  constructor() {
    this.router = AIModelRouter.getInstance();
  }
  
  async processRequest(request: Partial<AIRequest>): Promise<AIRequest> {
    const model = request.model || this.router.selectModel(request.prompt || '', request.context);
    
    // Mock processing - in production would call actual AI APIs
    const mockResponse = this.generateMockResponse(request.prompt || '', model);
    const tokens = this.estimateTokens(request.prompt || '', mockResponse);
    const cost = tokens * model.costPerToken;
    
    this.router.updateUsageMetrics(model, tokens);
    
    return {
      id: `req_${Date.now()}`,
      model,
      prompt: request.prompt || '',
      context: request.context,
      response: mockResponse,
      tokens,
      cost,
      timestamp: new Date()
    };
  }
  
  estimateCost(task: string, context?: any): number {
    const model = this.router.selectModel(task, context);
    const estimatedTokens = this.estimateTokens(task, '');
    return estimatedTokens * model.costPerToken;
  }
  
  getModelRecommendation(task: string, context?: any): AIModel {
    return this.router.selectModel(task, context);
  }
  
  private generateMockResponse(prompt: string, model: AIModel): string {
    // Mock responses based on model and prompt
    return `Mock response from ${model.name} for: ${prompt.substring(0, 50)}...`;
  }
  
  private estimateTokens(prompt: string, response: string): number {
    // Rough token estimation (4 chars = 1 token)
    return Math.ceil((prompt.length + response.length) / 4);
  }
}

// Export singleton instance
export const aiService = new MockAIService();