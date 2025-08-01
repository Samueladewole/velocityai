/**
 * AI Agent Performance Monitoring Service
 * 
 * Enterprise-grade monitoring for all AI agents in Velocity.ai
 * Provides full transparency and auditability for AI decision-making
 */

import { observabilityCore, AIDecisionEvent } from './observabilityCore'

export interface AgentPerformanceMetrics {
  agentType: string
  organizationId: string
  metrics: {
    totalDecisions: number
    averageConfidence: number
    averageLatency: number
    successRate: number
    tokenUsage: {
      total: number
      input: number
      output: number
      cost: number
    }
    qualityScore: number
    modelDistribution: Record<string, number>
  }
  trends: {
    confidenceTrend: 'improving' | 'declining' | 'stable'
    latencyTrend: 'improving' | 'declining' | 'stable'
    qualityTrend: 'improving' | 'declining' | 'stable'
  }
  alerts: AgentAlert[]
}

export interface AgentAlert {
  id: string
  severity: 'info' | 'warning' | 'critical'
  type: 'confidence_drop' | 'latency_spike' | 'error_rate' | 'quality_degradation'
  message: string
  timestamp: Date
  agentType: string
  data: Record<string, any>
}

export interface AgentHealthStatus {
  agentType: string
  status: 'healthy' | 'degraded' | 'critical' | 'offline'
  lastActivity: Date
  uptime: number
  errorRate: number
  averageLatency: number
  confidenceScore: number
}

export class AIAgentMonitoringService {
  private static instance: AIAgentMonitoringService
  private alerts: Map<string, AgentAlert[]> = new Map() // organizationId -> alerts
  private thresholds = {
    confidenceThreshold: 0.7,
    latencyThreshold: 5000, // 5 seconds
    errorRateThreshold: 0.05, // 5%
    qualityThreshold: 0.8
  }

  static getInstance(): AIAgentMonitoringService {
    if (!AIAgentMonitoringService.instance) {
      AIAgentMonitoringService.instance = new AIAgentMonitoringService()
    }
    return AIAgentMonitoringService.instance
  }

  /**
   * Monitor AI agent decision and generate insights
   */
  monitorAIDecision(
    agentType: string,
    prompt: string,
    response: string,
    confidence: number,
    model: string,
    tokens: { input: number; output: number },
    latency: number,
    organizationId: string,
    reasoning: string[] = [],
    contextUsed: Record<string, any> = {}
  ): AIDecisionEvent {
    // Track the decision in observability core
    const decision = observabilityCore.trackAIDecision({
      agentType,
      prompt,
      response,
      confidence,
      model,
      tokens,
      latency,
      reasoning,
      contextUsed,
      organizationId
    })

    // Generate performance insights and alerts
    this.analyzeDecisionPerformance(decision)

    // Track performance metrics
    this.trackAgentPerformanceMetrics(decision)

    return decision
  }

  /**
   * Get comprehensive agent performance metrics
   */
  getAgentPerformanceMetrics(organizationId: string, agentType?: string): AgentPerformanceMetrics[] {
    const decisions = observabilityCore.getAIDecisions(organizationId, 1000)
    const filteredDecisions = agentType 
      ? decisions.filter(d => d.agentType === agentType)
      : decisions

    // Group by agent type
    const agentGroups = new Map<string, AIDecisionEvent[]>()
    filteredDecisions.forEach(decision => {
      if (!agentGroups.has(decision.agentType)) {
        agentGroups.set(decision.agentType, [])
      }
      agentGroups.get(decision.agentType)!.push(decision)
    })

    return Array.from(agentGroups.entries()).map(([agentType, agentDecisions]) => {
      return this.calculateAgentMetrics(agentType, agentDecisions, organizationId)
    })
  }

  /**
   * Get agent health status
   */
  getAgentHealthStatus(organizationId: string): AgentHealthStatus[] {
    const decisions = observabilityCore.getAIDecisions(organizationId, 1000)
    const agentGroups = new Map<string, AIDecisionEvent[]>()

    decisions.forEach(decision => {
      if (!agentGroups.has(decision.agentType)) {
        agentGroups.set(decision.agentType, [])
      }
      agentGroups.get(decision.agentType)!.push(decision)
    })

    return Array.from(agentGroups.entries()).map(([agentType, agentDecisions]) => {
      const recent = agentDecisions.slice(0, 100)
      const now = new Date()
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      
      const recentDecisions = recent.filter(d => d.timestamp > hourAgo)
      const errorRate = this.calculateErrorRate(recent)
      const averageLatency = recent.length > 0 
        ? recent.reduce((sum, d) => sum + d.latency, 0) / recent.length 
        : 0
      const confidenceScore = recent.length > 0
        ? recent.reduce((sum, d) => sum + d.confidence, 0) / recent.length
        : 0

      let status: AgentHealthStatus['status'] = 'healthy'
      if (recentDecisions.length === 0) {
        status = 'offline'
      } else if (errorRate > this.thresholds.errorRateThreshold || 
                 averageLatency > this.thresholds.latencyThreshold ||
                 confidenceScore < this.thresholds.confidenceThreshold) {
        status = 'critical'
      } else if (errorRate > this.thresholds.errorRateThreshold * 0.5 ||
                 averageLatency > this.thresholds.latencyThreshold * 0.7) {
        status = 'degraded'
      }

      return {
        agentType,
        status,
        lastActivity: recent.length > 0 ? recent[0].timestamp : new Date(0),
        uptime: this.calculateUptime(recent),
        errorRate,
        averageLatency,
        confidenceScore
      }
    })
  }

  /**
   * Get active alerts for organization
   */
  getActiveAlerts(organizationId: string): AgentAlert[] {
    return this.alerts.get(organizationId) || []
  }

  /**
   * Get agent comparison analysis
   */
  getAgentComparison(organizationId: string): {
    comparison: Array<{
      agentType: string
      metrics: {
        confidence: number
        latency: number
        quality: number
        costEfficiency: number
        reliability: number
      }
      rank: number
    }>
    recommendations: string[]
  } {
    const agentMetrics = this.getAgentPerformanceMetrics(organizationId)
    
    const comparison = agentMetrics.map(agent => ({
      agentType: agent.agentType,
      metrics: {
        confidence: agent.metrics.averageConfidence,
        latency: 1 / (agent.metrics.averageLatency / 1000), // Invert for scoring
        quality: agent.metrics.qualityScore,
        costEfficiency: agent.metrics.totalDecisions / agent.metrics.tokenUsage.cost,
        reliability: agent.metrics.successRate
      },
      rank: 0
    }))

    // Calculate overall scores and rank
    comparison.forEach(agent => {
      const overallScore = (
        agent.metrics.confidence * 0.25 +
        (Math.min(agent.metrics.latency, 1)) * 0.20 +
        agent.metrics.quality * 0.25 +
        (Math.min(agent.metrics.costEfficiency / 100, 1)) * 0.15 +
        agent.metrics.reliability * 0.15
      )
      agent.rank = overallScore
    })

    comparison.sort((a, b) => b.rank - a.rank)
    comparison.forEach((agent, index) => {
      agent.rank = index + 1
    })

    const recommendations = this.generateAgentRecommendations(comparison)

    return { comparison, recommendations }
  }

  /**
   * Generate agent optimization recommendations
   */
  generateOptimizationRecommendations(organizationId: string): {
    agentType: string
    recommendations: Array<{
      type: 'performance' | 'cost' | 'quality' | 'reliability'
      priority: 'high' | 'medium' | 'low'
      description: string
      expectedImpact: string
      implementationComplexity: 'low' | 'medium' | 'high'
    }>
  }[] {
    const agentMetrics = this.getAgentPerformanceMetrics(organizationId)

    return agentMetrics.map(agent => ({
      agentType: agent.agentType,
      recommendations: this.analyzeAgentForOptimization(agent)
    }))
  }

  private calculateAgentMetrics(
    agentType: string, 
    decisions: AIDecisionEvent[], 
    organizationId: string
  ): AgentPerformanceMetrics {
    const totalDecisions = decisions.length
    const averageConfidence = decisions.reduce((sum, d) => sum + d.confidence, 0) / totalDecisions
    const averageLatency = decisions.reduce((sum, d) => sum + d.latency, 0) / totalDecisions
    
    const totalTokens = decisions.reduce((sum, d) => sum + d.tokens.input + d.tokens.output, 0)
    const inputTokens = decisions.reduce((sum, d) => sum + d.tokens.input, 0)
    const outputTokens = decisions.reduce((sum, d) => sum + d.tokens.output, 0)
    
    // Estimate cost (rough approximation)
    const estimatedCost = (inputTokens * 0.001 + outputTokens * 0.002) // €0.001 per input token, €0.002 per output token
    
    const successRate = this.calculateSuccessRate(decisions)
    const qualityScore = this.calculateQualityScore(decisions)
    
    const modelDistribution: Record<string, number> = {}
    decisions.forEach(d => {
      modelDistribution[d.model] = (modelDistribution[d.model] || 0) + 1
    })

    const trends = this.calculateTrends(decisions)
    const alerts = this.getAlertsForAgent(agentType, organizationId)

    return {
      agentType,
      organizationId,
      metrics: {
        totalDecisions,
        averageConfidence,
        averageLatency,
        successRate,
        tokenUsage: {
          total: totalTokens,
          input: inputTokens,
          output: outputTokens,
          cost: estimatedCost
        },
        qualityScore,
        modelDistribution
      },
      trends,
      alerts
    }
  }

  private analyzeDecisionPerformance(decision: AIDecisionEvent): void {
    // Check for performance issues and generate alerts
    const alerts: AgentAlert[] = []

    // Low confidence alert
    if (decision.confidence < this.thresholds.confidenceThreshold) {
      alerts.push({
        id: `alert_€{Date.now()}_confidence`,
        severity: 'warning',
        type: 'confidence_drop',
        message: `Low confidence score (€{decision.confidence.toFixed(2)}) for €{decision.agentType}`,
        timestamp: new Date(),
        agentType: decision.agentType,
        data: { confidence: decision.confidence, threshold: this.thresholds.confidenceThreshold }
      })
    }

    // High latency alert
    if (decision.latency > this.thresholds.latencyThreshold) {
      alerts.push({
        id: `alert_€{Date.now()}_latency`,
        severity: 'warning',
        type: 'latency_spike',
        message: `High latency (€{decision.latency}ms) for €{decision.agentType}`,
        timestamp: new Date(),
        agentType: decision.agentType,
        data: { latency: decision.latency, threshold: this.thresholds.latencyThreshold }
      })
    }

    // Store alerts
    if (alerts.length > 0) {
      const orgAlerts = this.alerts.get(decision.organizationId) || []
      this.alerts.set(decision.organizationId, [...orgAlerts, ...alerts])
    }
  }

  private trackAgentPerformanceMetrics(decision: AIDecisionEvent): void {
    // Track various performance metrics
    observabilityCore.trackPerformance({
      metric: 'ai_agent_latency',
      value: decision.latency,
      unit: 'milliseconds',
      component: decision.agentType,
      organizationId: decision.organizationId,
      tags: {
        model: decision.model,
        agent_type: decision.agentType
      }
    })

    observabilityCore.trackPerformance({
      metric: 'ai_agent_confidence',
      value: decision.confidence,
      unit: 'score',
      component: decision.agentType,
      organizationId: decision.organizationId,
      tags: {
        model: decision.model,
        agent_type: decision.agentType
      }
    })

    observabilityCore.trackPerformance({
      metric: 'ai_agent_tokens',
      value: decision.tokens.input + decision.tokens.output,
      unit: 'tokens',
      component: decision.agentType,
      organizationId: decision.organizationId,
      tags: {
        model: decision.model,
        agent_type: decision.agentType,
        token_type: 'total'
      }
    })
  }

  private calculateSuccessRate(decisions: AIDecisionEvent[]): number {
    // Success rate based on confidence threshold
    const successful = decisions.filter(d => d.confidence >= this.thresholds.confidenceThreshold).length
    return decisions.length > 0 ? successful / decisions.length : 0
  }

  private calculateQualityScore(decisions: AIDecisionEvent[]): number {
    // Quality score based on confidence and reasoning depth
    const scores = decisions.map(d => {
      const confidenceScore = d.confidence
      const reasoningScore = Math.min(d.reasoning.length / 3, 1) // Normalize reasoning depth
      return (confidenceScore * 0.7) + (reasoningScore * 0.3)
    })
    
    return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0
  }

  private calculateTrends(decisions: AIDecisionEvent[]): AgentPerformanceMetrics['trends'] {
    // Calculate trends over time (simplified)
    const recent = decisions.slice(0, Math.floor(decisions.length / 2))
    const older = decisions.slice(Math.floor(decisions.length / 2))

    if (recent.length === 0 || older.length === 0) {
      return {
        confidenceTrend: 'stable',
        latencyTrend: 'stable',
        qualityTrend: 'stable'
      }
    }

    const recentConfidence = recent.reduce((sum, d) => sum + d.confidence, 0) / recent.length
    const olderConfidence = older.reduce((sum, d) => sum + d.confidence, 0) / older.length
    
    const recentLatency = recent.reduce((sum, d) => sum + d.latency, 0) / recent.length
    const olderLatency = older.reduce((sum, d) => sum + d.latency, 0) / older.length

    const recentQuality = this.calculateQualityScore(recent)
    const olderQuality = this.calculateQualityScore(older)

    return {
      confidenceTrend: this.getTrend(recentConfidence, olderConfidence),
      latencyTrend: this.getTrend(olderLatency, recentLatency), // Inverted for latency (lower is better)
      qualityTrend: this.getTrend(recentQuality, olderQuality)
    }
  }

  private getTrend(recent: number, older: number): 'improving' | 'declining' | 'stable' {
    const threshold = 0.05 // 5% change threshold
    const change = (recent - older) / older

    if (change > threshold) return 'improving'
    if (change < -threshold) return 'declining'
    return 'stable'
  }

  private calculateErrorRate(decisions: AIDecisionEvent[]): number {
    // Error rate based on very low confidence scores
    const errors = decisions.filter(d => d.confidence < 0.3).length
    return decisions.length > 0 ? errors / decisions.length : 0
  }

  private calculateUptime(decisions: AIDecisionEvent[]): number {
    // Simplified uptime calculation
    if (decisions.length === 0) return 0
    
    const now = new Date()
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const recentDecisions = decisions.filter(d => d.timestamp > dayAgo)
    
    // If we have decisions in the last 24 hours, consider it up
    return recentDecisions.length > 0 ? 0.99 : 0
  }

  private getAlertsForAgent(agentType: string, organizationId: string): AgentAlert[] {
    const allAlerts = this.alerts.get(organizationId) || []
    return allAlerts.filter(alert => alert.agentType === agentType)
  }

  private generateAgentRecommendations(comparison: any[]): string[] {
    const recommendations: string[] = []
    
    if (comparison.length > 1) {
      const best = comparison[0]
      const worst = comparison[comparison.length - 1]
      
      recommendations.push(`€{best.agentType} is your top-performing agent with the highest overall score`)
      
      if (worst.metrics.confidence < 0.7) {
        recommendations.push(`Consider improving €{worst.agentType}'s confidence through better training data`)
      }
      
      if (worst.metrics.latency < 0.5) {
        recommendations.push(`€{worst.agentType} has high latency - consider optimization or different model`)
      }
    }

    return recommendations
  }

  private analyzeAgentForOptimization(agent: AgentPerformanceMetrics): any[] {
    const recommendations: any[] = []

    // Performance recommendations
    if (agent.metrics.averageLatency > this.thresholds.latencyThreshold) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        description: 'Optimize response time by using faster models or caching',
        expectedImpact: `Reduce latency by 30-50%`,
        implementationComplexity: 'medium'
      })
    }

    // Quality recommendations
    if (agent.metrics.qualityScore < this.thresholds.qualityThreshold) {
      recommendations.push({
        type: 'quality',
        priority: 'high',
        description: 'Improve response quality through better prompts and training',
        expectedImpact: 'Increase quality score by 15-25%',
        implementationComplexity: 'high'
      })
    }

    // Cost recommendations
    if (agent.metrics.tokenUsage.cost > 100) {
      recommendations.push({
        type: 'cost',
        priority: 'medium',
        description: 'Reduce token usage through prompt optimization',
        expectedImpact: 'Reduce costs by 20-30%',
        implementationComplexity: 'low'
      })
    }

    return recommendations
  }
}

export const aiAgentMonitoring = AIAgentMonitoringService.getInstance()