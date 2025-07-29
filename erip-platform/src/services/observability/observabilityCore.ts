/**
 * Velocity.ai Observability Core
 * 
 * Enterprise-grade AI agent monitoring and compliance transparency
 * World's first fully observable AI compliance platform
 */

export interface ObservabilityEvent {
  id: string
  timestamp: Date
  type: ObservabilityEventType
  source: string
  component: string
  data: Record<string, any>
  correlationId?: string
  userId?: string
  organizationId: string
  severity: 'info' | 'warn' | 'error' | 'critical'
  tags: Record<string, string>
}

export type ObservabilityEventType = 
  | 'ai_decision'
  | 'api_call'
  | 'user_action'
  | 'system_metric'
  | 'compliance_event'
  | 'error'
  | 'performance'
  | 'audit_trail'

export interface AIDecisionEvent {
  id: string
  timestamp: Date
  agentType: string
  prompt: string
  response: string
  confidence: number
  model: string
  tokens: { input: number; output: number }
  latency: number
  reasoning: string[]
  contextUsed: Record<string, any>
  organizationId: string
}

export interface PerformanceMetric {
  id: string
  timestamp: Date
  metric: string
  value: number
  unit: string
  component: string
  organizationId: string
  tags: Record<string, string>
}

export interface ComplianceAuditEvent {
  id: string
  timestamp: Date
  eventType: 'evidence_collection' | 'assessment_completion' | 'decision_override' | 'approval_workflow'
  actor: string
  action: string
  resource: string
  outcome: 'success' | 'failure' | 'partial'
  evidence: {
    before?: any
    after?: any
    reasoning: string
  }
  complianceFramework: string
  organizationId: string
}

export class ObservabilityCore {
  private static instance: ObservabilityCore
  private events: ObservabilityEvent[] = []
  private aiDecisions: AIDecisionEvent[] = []
  private performanceMetrics: PerformanceMetric[] = []
  private complianceEvents: ComplianceAuditEvent[] = []
  private listeners: Map<ObservabilityEventType, Function[]> = new Map()

  static getInstance(): ObservabilityCore {
    if (!ObservabilityCore.instance) {
      ObservabilityCore.instance = new ObservabilityCore()
    }
    return ObservabilityCore.instance
  }

  /**
   * Track AI agent decision with full transparency
   */
  trackAIDecision(decision: Omit<AIDecisionEvent, 'id' | 'timestamp'>): AIDecisionEvent {
    const fullDecision: AIDecisionEvent = {
      ...decision,
      id: this.generateId('ai_decision'),
      timestamp: new Date()
    }

    this.aiDecisions.push(fullDecision)

    // Also create observability event
    this.trackEvent({
      type: 'ai_decision',
      source: 'ai_agent',
      component: decision.agentType,
      data: {
        confidence: decision.confidence,
        model: decision.model,
        latency: decision.latency,
        tokens: decision.tokens
      },
      organizationId: decision.organizationId,
      severity: decision.confidence < 0.7 ? 'warn' : 'info',
      tags: {
        agent_type: decision.agentType,
        model: decision.model
      }
    })

    return fullDecision
  }

  /**
   * Track compliance audit event
   */
  trackComplianceEvent(event: Omit<ComplianceAuditEvent, 'id' | 'timestamp'>): ComplianceAuditEvent {
    const fullEvent: ComplianceAuditEvent = {
      ...event,
      id: this.generateId('compliance'),
      timestamp: new Date()
    }

    this.complianceEvents.push(fullEvent)

    this.trackEvent({
      type: 'compliance_event',
      source: 'compliance_engine',
      component: event.complianceFramework,
      data: {
        eventType: event.eventType,
        outcome: event.outcome,
        resource: event.resource
      },
      organizationId: event.organizationId,
      severity: event.outcome === 'failure' ? 'error' : 'info',
      tags: {
        framework: event.complianceFramework,
        event_type: event.eventType
      }
    })

    return fullEvent
  }

  /**
   * Track performance metric
   */
  trackPerformance(metric: Omit<PerformanceMetric, 'id' | 'timestamp'>): PerformanceMetric {
    const fullMetric: PerformanceMetric = {
      ...metric,
      id: this.generateId('metric'),
      timestamp: new Date()
    }

    this.performanceMetrics.push(fullMetric)

    this.trackEvent({
      type: 'performance',
      source: 'system',
      component: metric.component,
      data: {
        metric: metric.metric,
        value: metric.value,
        unit: metric.unit
      },
      organizationId: metric.organizationId,
      severity: 'info',
      tags: metric.tags
    })

    return fullMetric
  }

  /**
   * Track general observability event
   */
  trackEvent(event: Omit<ObservabilityEvent, 'id' | 'timestamp'>): ObservabilityEvent {
    const fullEvent: ObservabilityEvent = {
      ...event,
      id: this.generateId('event'),
      timestamp: new Date()
    }

    this.events.push(fullEvent)

    // Notify listeners
    const listeners = this.listeners.get(event.type) || []
    listeners.forEach(listener => {
      try {
        listener(fullEvent)
      } catch (error) {
        console.error('Error in observability listener:', error)
      }
    })

    return fullEvent
  }

  /**
   * Subscribe to observability events
   */
  subscribe(eventType: ObservabilityEventType, listener: (event: ObservabilityEvent) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType)!.push(listener)

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType) || []
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * Get AI decisions for organization
   */
  getAIDecisions(organizationId: string, limit: number = 100): AIDecisionEvent[] {
    return this.aiDecisions
      .filter(d => d.organizationId === organizationId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  /**
   * Get compliance events for organization
   */
  getComplianceEvents(organizationId: string, limit: number = 100): ComplianceAuditEvent[] {
    return this.complianceEvents
      .filter(e => e.organizationId === organizationId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  /**
   * Get performance metrics for organization
   */
  getPerformanceMetrics(
    organizationId: string, 
    component?: string, 
    timeRange?: { start: Date; end: Date }
  ): PerformanceMetric[] {
    let metrics = this.performanceMetrics.filter(m => m.organizationId === organizationId)

    if (component) {
      metrics = metrics.filter(m => m.component === component)
    }

    if (timeRange) {
      metrics = metrics.filter(m => 
        m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      )
    }

    return metrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  /**
   * Get observability events
   */
  getEvents(
    organizationId: string, 
    eventType?: ObservabilityEventType,
    limit: number = 100
  ): ObservabilityEvent[] {
    let events = this.events.filter(e => e.organizationId === organizationId)

    if (eventType) {
      events = events.filter(e => e.type === eventType)
    }

    return events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  /**
   * Get observability analytics
   */
  getAnalytics(organizationId: string): {
    aiDecisionStats: {
      total: number
      averageConfidence: number
      averageLatency: number
      totalTokens: number
      modelDistribution: Record<string, number>
    }
    complianceStats: {
      total: number
      successRate: number
      frameworkDistribution: Record<string, number>
      eventTypeDistribution: Record<string, number>
    }
    performanceStats: {
      totalMetrics: number
      componentDistribution: Record<string, number>
    }
    systemHealth: {
      errorRate: number
      averageResponseTime: number
      uptime: number
    }
  } {
    const aiDecisions = this.getAIDecisions(organizationId, 1000)
    const complianceEvents = this.getComplianceEvents(organizationId, 1000)
    const performanceMetrics = this.getPerformanceMetrics(organizationId)
    const allEvents = this.getEvents(organizationId, undefined, 1000)

    // AI Decision Stats
    const aiDecisionStats = {
      total: aiDecisions.length,
      averageConfidence: aiDecisions.length > 0 
        ? aiDecisions.reduce((sum, d) => sum + d.confidence, 0) / aiDecisions.length 
        : 0,
      averageLatency: aiDecisions.length > 0
        ? aiDecisions.reduce((sum, d) => sum + d.latency, 0) / aiDecisions.length
        : 0,
      totalTokens: aiDecisions.reduce((sum, d) => sum + d.tokens.input + d.tokens.output, 0),
      modelDistribution: this.calculateDistribution(aiDecisions, 'model')
    }

    // Compliance Stats
    const successfulCompliance = complianceEvents.filter(e => e.outcome === 'success').length
    const complianceStats = {
      total: complianceEvents.length,
      successRate: complianceEvents.length > 0 ? successfulCompliance / complianceEvents.length : 0,
      frameworkDistribution: this.calculateDistribution(complianceEvents, 'complianceFramework'),
      eventTypeDistribution: this.calculateDistribution(complianceEvents, 'eventType')
    }

    // Performance Stats
    const performanceStats = {
      totalMetrics: performanceMetrics.length,
      componentDistribution: this.calculateDistribution(performanceMetrics, 'component')
    }

    // System Health
    const errorEvents = allEvents.filter(e => e.severity === 'error' || e.severity === 'critical')
    const systemHealth = {
      errorRate: allEvents.length > 0 ? errorEvents.length / allEvents.length : 0,
      averageResponseTime: aiDecisionStats.averageLatency,
      uptime: 0.999 // This would be calculated from actual uptime monitoring
    }

    return {
      aiDecisionStats,
      complianceStats,
      performanceStats,
      systemHealth
    }
  }

  /**
   * Export audit trail for compliance
   */
  exportAuditTrail(organizationId: string, timeRange?: { start: Date; end: Date }): {
    aiDecisions: AIDecisionEvent[]
    complianceEvents: ComplianceAuditEvent[]
    systemEvents: ObservabilityEvent[]
    summary: {
      totalEvents: number
      timeRange: { start: Date; end: Date }
      organizationId: string
      exportedAt: Date
    }
  } {
    let aiDecisions = this.getAIDecisions(organizationId, 10000)
    let complianceEvents = this.getComplianceEvents(organizationId, 10000)
    let systemEvents = this.getEvents(organizationId, undefined, 10000)

    if (timeRange) {
      aiDecisions = aiDecisions.filter(d => 
        d.timestamp >= timeRange.start && d.timestamp <= timeRange.end
      )
      complianceEvents = complianceEvents.filter(e => 
        e.timestamp >= timeRange.start && e.timestamp <= timeRange.end
      )
      systemEvents = systemEvents.filter(e => 
        e.timestamp >= timeRange.start && e.timestamp <= timeRange.end
      )
    }

    const actualTimeRange = timeRange || {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    }

    return {
      aiDecisions,
      complianceEvents,
      systemEvents,
      summary: {
        totalEvents: aiDecisions.length + complianceEvents.length + systemEvents.length,
        timeRange: actualTimeRange,
        organizationId,
        exportedAt: new Date()
      }
    }
  }

  private calculateDistribution<T>(items: T[], field: keyof T): Record<string, number> {
    const distribution: Record<string, number> = {}
    items.forEach(item => {
      const value = String(item[field])
      distribution[value] = (distribution[value] || 0) + 1
    })
    return distribution
  }

  private generateId(type: string): string {
    return `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Clear old data (for memory management)
   */
  cleanup(retentionDays: number = 30): void {
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)

    this.events = this.events.filter(e => e.timestamp > cutoff)
    this.aiDecisions = this.aiDecisions.filter(d => d.timestamp > cutoff)
    this.performanceMetrics = this.performanceMetrics.filter(m => m.timestamp > cutoff)
    this.complianceEvents = this.complianceEvents.filter(e => e.timestamp > cutoff)
  }
}

export const observabilityCore = ObservabilityCore.getInstance()