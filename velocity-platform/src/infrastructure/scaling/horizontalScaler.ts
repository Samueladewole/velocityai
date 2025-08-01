/**
 * Horizontal Scaling Manager for ERIP Platform
 * 
 * Implements automatic horizontal scaling with Kubernetes integration,
 * container orchestration, and intelligent scaling decisions
 */

import { EventEmitter } from 'events'
import { Logger } from '../logging/logger'
import { MetricsCollector } from '../../services/monitoring/metricsCollector'
import { EnterpriseLoadBalancer, ServiceInstance } from './loadBalancer'

export interface ScalingConfig {
  kubernetes: {
    enabled: boolean
    namespace: string
    deploymentName: string
    containerImage: string
    minReplicas: number
    maxReplicas: number
    targetCpuUtilization: number
    targetMemoryUtilization: number
  }
  scaling: {
    scaleUpCooldownMs: number
    scaleDownCooldownMs: number
    scaleUpThreshold: number
    scaleDownThreshold: number
    evaluationPeriods: number
    metricsWindowMs: number
  }
  resources: {
    cpuRequest: string
    cpuLimit: string
    memoryRequest: string
    memoryLimit: string
    startupTimeMs: number
    shutdownTimeMs: number
  }
  monitoring: {
    enabled: boolean
    alertingEnabled: boolean
    predictiveScaling: boolean
  }
}

export interface ScalingMetrics {
  timestamp: Date
  cpuUtilization: number
  memoryUtilization: number
  activeConnections: number
  requestsPerSecond: number
  responseTime: number
  errorRate: number
  queueDepth: number
}

export interface ScalingDecision {
  action: 'scale_up' | 'scale_down' | 'no_action'
  currentReplicas: number
  targetReplicas: number
  reason: string
  confidence: number
  metrics: ScalingMetrics
  timestamp: Date
}

export interface ScalingEvent {
  eventId: string
  action: 'scale_up' | 'scale_down'
  fromReplicas: number
  toReplicas: number
  duration: number
  success: boolean
  reason: string
  timestamp: Date
}

export class HorizontalScaler extends EventEmitter {
  private logger: Logger
  private metricsCollector: MetricsCollector
  private loadBalancer: EnterpriseLoadBalancer
  private currentReplicas = 0
  private targetReplicas = 0
  private lastScaleAction?: Date
  private metricsHistory: ScalingMetrics[] = []
  private scalingHistory: ScalingEvent[] = []
  private evaluationTimer?: NodeJS.Timeout
  private isScaling = false

  constructor(
    private config: ScalingConfig,
    loadBalancer: EnterpriseLoadBalancer
  ) {
    super()
    
    this.logger = new Logger('HorizontalScaler')
    this.loadBalancer = loadBalancer
    
    if (config.monitoring.enabled) {
      this.metricsCollector = new MetricsCollector({
        enabled: true,
        exportInterval: 60000,
        labels: { component: 'horizontal_scaler' }
      })
    }

    this.currentReplicas = config.kubernetes.minReplicas
    this.targetReplicas = config.kubernetes.minReplicas

    this.startMetricsEvaluation()
    this.setupLoadBalancerIntegration()
  }

  /**
   * Start periodic metrics evaluation for scaling decisions
   */
  private startMetricsEvaluation(): void {
    this.evaluationTimer = setInterval(async () => {
      try {
        await this.evaluateScalingDecision()
      } catch (error) {
        this.logger.error('Failed to evaluate scaling decision', { error })
      }
    }, this.config.scaling.metricsWindowMs / this.config.scaling.evaluationPeriods)

    this.logger.info('Scaling evaluation started', {
      evaluationInterval: this.config.scaling.metricsWindowMs / this.config.scaling.evaluationPeriods,
      minReplicas: this.config.kubernetes.minReplicas,
      maxReplicas: this.config.kubernetes.maxReplicas
    })
  }

  /**
   * Setup integration with load balancer for scaling triggers
   */
  private setupLoadBalancerIntegration(): void {
    this.loadBalancer.on('scale_up_triggered', async (data) => {
      this.logger.info('Scale up triggered by load balancer', data)
      await this.handleScaleUpTrigger('load_balancer_utilization', data.utilization)
    })

    this.loadBalancer.on('scale_down_triggered', async (data) => {
      this.logger.info('Scale down triggered by load balancer', data)
      await this.handleScaleDownTrigger('load_balancer_underutilization', data.utilization)
    })

    this.loadBalancer.on('emergency_scaling_required', async (data) => {
      this.logger.warn('Emergency scaling required', data)
      await this.handleEmergencyScaling(data.healthyCount, data.required)
    })
  }

  /**
   * Collect current system metrics for scaling decisions
   */
  private async collectMetrics(): Promise<ScalingMetrics> {
    const loadBalancerStats = this.loadBalancer.getStatistics()
    
    // In real implementation, these would come from actual monitoring systems
    const metrics: ScalingMetrics = {
      timestamp: new Date(),
      cpuUtilization: this.simulateCpuUtilization(),
      memoryUtilization: this.simulateMemoryUtilization(),
      activeConnections: loadBalancerStats.totalConnections,
      requestsPerSecond: this.calculateRequestsPerSecond(),
      responseTime: loadBalancerStats.averageResponseTime,
      errorRate: loadBalancerStats.errorRate,
      queueDepth: loadBalancerStats.queueSize
    }

    // Store metrics history
    this.metricsHistory.push(metrics)
    
    // Keep only recent metrics
    const maxHistorySize = 100
    if (this.metricsHistory.length > maxHistorySize) {
      this.metricsHistory = this.metricsHistory.slice(-maxHistorySize)
    }

    if (this.config.monitoring.enabled) {
      this.recordMetrics(metrics)
    }

    return metrics
  }

  /**
   * Evaluate whether scaling action is needed
   */
  private async evaluateScalingDecision(): Promise<void> {
    if (this.isScaling) {
      this.logger.debug('Scaling operation in progress, skipping evaluation')
      return
    }

    const currentMetrics = await this.collectMetrics()
    const decision = this.makeScalingDecision(currentMetrics)

    this.logger.debug('Scaling decision evaluated', {
      action: decision.action,
      currentReplicas: decision.currentReplicas,
      targetReplicas: decision.targetReplicas,
      reason: decision.reason,
      confidence: decision.confidence
    })

    if (decision.action !== 'no_action' && decision.confidence > 0.7) {
      await this.executeScalingDecision(decision)
    }
  }

  /**
   * Make scaling decision based on current metrics
   */
  private makeScalingDecision(currentMetrics: ScalingMetrics): ScalingDecision {
    const recentMetrics = this.getRecentMetrics(this.config.scaling.metricsWindowMs)
    
    if (recentMetrics.length < this.config.scaling.evaluationPeriods) {
      return {
        action: 'no_action',
        currentReplicas: this.currentReplicas,
        targetReplicas: this.currentReplicas,
        reason: 'Insufficient metrics data',
        confidence: 0,
        metrics: currentMetrics,
        timestamp: new Date()
      }
    }

    // Calculate average metrics over evaluation period
    const avgCpu = recentMetrics.reduce((sum, m) => sum + m.cpuUtilization, 0) / recentMetrics.length
    const avgMemory = recentMetrics.reduce((sum, m) => sum + m.memoryUtilization, 0) / recentMetrics.length
    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length
    const avgErrorRate = recentMetrics.reduce((sum, m) => sum + m.errorRate, 0) / recentMetrics.length

    // Check cooldown periods
    if (this.lastScaleAction) {
      const timeSinceLastAction = Date.now() - this.lastScaleAction.getTime()
      const cooldownPeriod = this.isLastActionScaleUp() ? 
        this.config.scaling.scaleUpCooldownMs : 
        this.config.scaling.scaleDownCooldownMs

      if (timeSinceLastAction < cooldownPeriod) {
        return {
          action: 'no_action',
          currentReplicas: this.currentReplicas,
          targetReplicas: this.currentReplicas,
          reason: 'Cooldown period active',
          confidence: 0,
          metrics: currentMetrics,
          timestamp: new Date()
        }
      }
    }

    // Scale up conditions
    const shouldScaleUp = (
      avgCpu > this.config.kubernetes.targetCpuUtilization ||
      avgMemory > this.config.kubernetes.targetMemoryUtilization ||
      avgResponseTime > 5000 || // 5 second threshold
      avgErrorRate > 0.02 || // 2% error rate threshold
      currentMetrics.queueDepth > 100
    ) && this.currentReplicas < this.config.kubernetes.maxReplicas

    // Scale down conditions
    const shouldScaleDown = (
      avgCpu < this.config.kubernetes.targetCpuUtilization * 0.3 &&
      avgMemory < this.config.kubernetes.targetMemoryUtilization * 0.3 &&
      avgResponseTime < 1000 && // Under 1 second
      avgErrorRate < 0.001 && // Under 0.1% error rate
      currentMetrics.queueDepth === 0
    ) && this.currentReplicas > this.config.kubernetes.minReplicas

    if (shouldScaleUp) {
      const targetReplicas = Math.min(
        this.currentReplicas + this.calculateScaleUpAmount(avgCpu, avgMemory),
        this.config.kubernetes.maxReplicas
      )

      return {
        action: 'scale_up',
        currentReplicas: this.currentReplicas,
        targetReplicas,
        reason: this.buildScaleUpReason(avgCpu, avgMemory, avgResponseTime, avgErrorRate),
        confidence: this.calculateConfidence(recentMetrics, 'scale_up'),
        metrics: currentMetrics,
        timestamp: new Date()
      }
    }

    if (shouldScaleDown) {
      const targetReplicas = Math.max(
        this.currentReplicas - 1, // Scale down by 1 at a time for safety
        this.config.kubernetes.minReplicas
      )

      return {
        action: 'scale_down',
        currentReplicas: this.currentReplicas,
        targetReplicas,
        reason: this.buildScaleDownReason(avgCpu, avgMemory, avgResponseTime),
        confidence: this.calculateConfidence(recentMetrics, 'scale_down'),
        metrics: currentMetrics,
        timestamp: new Date()
      }
    }

    return {
      action: 'no_action',
      currentReplicas: this.currentReplicas,
      targetReplicas: this.currentReplicas,
      reason: 'Metrics within acceptable range',
      confidence: 1.0,
      metrics: currentMetrics,
      timestamp: new Date()
    }
  }

  /**
   * Execute scaling decision
   */
  private async executeScalingDecision(decision: ScalingDecision): Promise<void> {
    if (decision.targetReplicas === this.currentReplicas) {
      return
    }

    this.isScaling = true
    const startTime = Date.now()
    
    this.logger.info('Executing scaling decision', {
      action: decision.action,
      from: decision.currentReplicas,
      to: decision.targetReplicas,
      reason: decision.reason
    })

    try {
      if (this.config.kubernetes.enabled) {
        await this.scaleKubernetesDeployment(decision.targetReplicas)
      } else {
        await this.scaleManually(decision.targetReplicas)
      }

      const duration = Date.now() - startTime
      
      // Record scaling event
      const scalingEvent: ScalingEvent = {
        eventId: this.generateEventId(),
        action: decision.action,
        fromReplicas: this.currentReplicas,
        toReplicas: decision.targetReplicas,
        duration,
        success: true,
        reason: decision.reason,
        timestamp: new Date()
      }

      this.scalingHistory.push(scalingEvent)
      this.currentReplicas = decision.targetReplicas
      this.targetReplicas = decision.targetReplicas
      this.lastScaleAction = new Date()

      if (this.config.monitoring.enabled) {
        this.metricsCollector.incrementCounter('scaling_actions_completed', {
          action: decision.action,
          success: 'true'
        })
        this.metricsCollector.recordHistogram('scaling_duration', duration)
      }

      this.emit('scaling_completed', scalingEvent)
      
      this.logger.info('Scaling completed successfully', {
        eventId: scalingEvent.eventId,
        newReplicas: this.currentReplicas,
        duration
      })

    } catch (error) {
      const duration = Date.now() - startTime
      
      const scalingEvent: ScalingEvent = {
        eventId: this.generateEventId(),
        action: decision.action,
        fromReplicas: this.currentReplicas,
        toReplicas: decision.targetReplicas,
        duration,
        success: false,
        reason: `Scaling failed: €{error}`,
        timestamp: new Date()
      }

      this.scalingHistory.push(scalingEvent)

      if (this.config.monitoring.enabled) {
        this.metricsCollector.incrementCounter('scaling_actions_completed', {
          action: decision.action,
          success: 'false'
        })
      }

      this.emit('scaling_failed', { ...scalingEvent, error })
      
      this.logger.error('Scaling failed', {
        eventId: scalingEvent.eventId,
        error,
        duration
      })

      throw error

    } finally {
      this.isScaling = false
    }
  }

  /**
   * Scale Kubernetes deployment
   */
  private async scaleKubernetesDeployment(targetReplicas: number): Promise<void> {
    // In real implementation, would use Kubernetes API
    this.logger.info('Scaling Kubernetes deployment', {
      namespace: this.config.kubernetes.namespace,
      deployment: this.config.kubernetes.deploymentName,
      targetReplicas
    })

    // Simulate Kubernetes API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate adding/removing instances in load balancer
    const currentInstances = this.loadBalancer.getInstances()
    const healthyInstances = currentInstances.filter(i => i.healthy)

    if (targetReplicas > healthyInstances.length) {
      // Add new instances
      const instancesToAdd = targetReplicas - healthyInstances.length
      for (let i = 0; i < instancesToAdd; i++) {
        const newInstance = this.createNewServiceInstance()
        this.loadBalancer.registerInstance(newInstance)
      }
    } else if (targetReplicas < healthyInstances.length) {
      // Remove instances
      const instancesToRemove = healthyInstances.length - targetReplicas
      for (let i = 0; i < instancesToRemove; i++) {
        const instanceToRemove = healthyInstances[i]
        await this.loadBalancer.triggerFailover(instanceToRemove.id)
        this.loadBalancer.unregisterInstance(instanceToRemove.id)
      }
    }
  }

  /**
   * Manual scaling (for non-Kubernetes environments)
   */
  private async scaleManually(targetReplicas: number): Promise<void> {
    this.logger.info('Manual scaling', { targetReplicas })
    
    // Implement manual scaling logic (e.g., Docker Swarm, bare metal)
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Update load balancer instances
    await this.scaleKubernetesDeployment(targetReplicas)
  }

  /**
   * Handle scale up trigger from external source
   */
  private async handleScaleUpTrigger(reason: string, value: number): Promise<void> {
    if (this.isScaling || this.currentReplicas >= this.config.kubernetes.maxReplicas) {
      return
    }

    const decision: ScalingDecision = {
      action: 'scale_up',
      currentReplicas: this.currentReplicas,
      targetReplicas: Math.min(this.currentReplicas + 2, this.config.kubernetes.maxReplicas),
      reason: `External trigger: €{reason} (€{value})`,
      confidence: 0.9,
      metrics: await this.collectMetrics(),
      timestamp: new Date()
    }

    await this.executeScalingDecision(decision)
  }

  /**
   * Handle scale down trigger from external source
   */
  private async handleScaleDownTrigger(reason: string, value: number): Promise<void> {
    if (this.isScaling || this.currentReplicas <= this.config.kubernetes.minReplicas) {
      return
    }

    const decision: ScalingDecision = {
      action: 'scale_down',
      currentReplicas: this.currentReplicas,
      targetReplicas: Math.max(this.currentReplicas - 1, this.config.kubernetes.minReplicas),
      reason: `External trigger: €{reason} (€{value})`,
      confidence: 0.8,
      metrics: await this.collectMetrics(),
      timestamp: new Date()
    }

    await this.executeScalingDecision(decision)
  }

  /**
   * Handle emergency scaling when minimum healthy instances not met
   */
  private async handleEmergencyScaling(healthyCount: number, required: number): Promise<void> {
    const neededInstances = required - healthyCount + 1 // Add one extra for buffer
    const targetReplicas = Math.min(
      this.currentReplicas + neededInstances,
      this.config.kubernetes.maxReplicas
    )

    if (targetReplicas <= this.currentReplicas) return

    this.logger.warn('Emergency scaling initiated', {
      healthyCount,
      required,
      targetReplicas
    })

    const decision: ScalingDecision = {
      action: 'scale_up',
      currentReplicas: this.currentReplicas,
      targetReplicas,
      reason: `Emergency: Only €{healthyCount} healthy instances, need €{required}`,
      confidence: 1.0,
      metrics: await this.collectMetrics(),
      timestamp: new Date()
    }

    // Override cooldown for emergency scaling
    this.lastScaleAction = undefined
    await this.executeScalingDecision(decision)
  }

  /**
   * Utility methods
   */
  private getRecentMetrics(windowMs: number): ScalingMetrics[] {
    const cutoff = Date.now() - windowMs
    return this.metricsHistory.filter(m => m.timestamp.getTime() >= cutoff)
  }

  private isLastActionScaleUp(): boolean {
    if (this.scalingHistory.length === 0) return false
    const lastEvent = this.scalingHistory[this.scalingHistory.length - 1]
    return lastEvent.action === 'scale_up'
  }

  private calculateScaleUpAmount(cpuUtilization: number, memoryUtilization: number): number {
    const maxUtil = Math.max(cpuUtilization, memoryUtilization)
    
    if (maxUtil > 90) return 3 // Aggressive scaling for high utilization
    if (maxUtil > 80) return 2
    return 1 // Conservative scaling
  }

  private calculateConfidence(metrics: ScalingMetrics[], action: string): number {
    if (metrics.length < 3) return 0.5

    // Calculate trend stability
    const trends = this.calculateTrends(metrics)
    const stability = this.calculateTrendStability(trends)
    
    // Higher confidence for consistent trends
    return Math.min(0.9, 0.6 + (stability * 0.3))
  }

  private calculateTrends(metrics: ScalingMetrics[]): { cpu: number; memory: number; responseTime: number } {
    if (metrics.length < 2) return { cpu: 0, memory: 0, responseTime: 0 }

    const first = metrics[0]
    const last = metrics[metrics.length - 1]

    return {
      cpu: last.cpuUtilization - first.cpuUtilization,
      memory: last.memoryUtilization - first.memoryUtilization,
      responseTime: last.responseTime - first.responseTime
    }
  }

  private calculateTrendStability(trends: { cpu: number; memory: number; responseTime: number }): number {
    const avgTrend = (Math.abs(trends.cpu) + Math.abs(trends.memory) + Math.abs(trends.responseTime)) / 3
    return Math.max(0, 1 - (avgTrend / 50)) // Stability inversely related to trend volatility
  }

  private buildScaleUpReason(cpu: number, memory: number, responseTime: number, errorRate: number): string {
    const reasons = []
    if (cpu > this.config.kubernetes.targetCpuUtilization) reasons.push(`CPU: €{cpu.toFixed(1)}%`)
    if (memory > this.config.kubernetes.targetMemoryUtilization) reasons.push(`Memory: €{memory.toFixed(1)}%`)
    if (responseTime > 5000) reasons.push(`Response time: €{responseTime.toFixed(0)}ms`)
    if (errorRate > 0.02) reasons.push(`Error rate: €{(errorRate * 100).toFixed(2)}%`)
    
    return `High utilization detected: €{reasons.join(', ')}`
  }

  private buildScaleDownReason(cpu: number, memory: number, responseTime: number): string {
    return `Low utilization detected: CPU: €{cpu.toFixed(1)}%, Memory: €{memory.toFixed(1)}%, Response time: €{responseTime.toFixed(0)}ms`
  }

  private createNewServiceInstance(): Omit<ServiceInstance, 'id' | 'healthy' | 'currentConnections' | 'lastHealthCheck' | 'errorCount'> {
    const port = 8080 + Math.floor(Math.random() * 1000)
    return {
      host: 'new-instance',
      port,
      protocol: 'http',
      weight: 100,
      maxConnections: 1000,
      responseTime: 0,
      metadata: {
        createdBy: 'horizontal_scaler',
        createdAt: new Date().toISOString()
      }
    }
  }

  private recordMetrics(metrics: ScalingMetrics): void {
    this.metricsCollector.recordHistogram('cpu_utilization', metrics.cpuUtilization)
    this.metricsCollector.recordHistogram('memory_utilization', metrics.memoryUtilization)
    this.metricsCollector.recordHistogram('active_connections', metrics.activeConnections)
    this.metricsCollector.recordHistogram('requests_per_second', metrics.requestsPerSecond)
    this.metricsCollector.recordHistogram('response_time', metrics.responseTime)
    this.metricsCollector.recordHistogram('error_rate', metrics.errorRate * 100)
    this.metricsCollector.recordHistogram('queue_depth', metrics.queueDepth)
    this.metricsCollector.recordHistogram('current_replicas', this.currentReplicas)
  }

  private simulateCpuUtilization(): number {
    // Simulate CPU utilization based on current load
    const baseUtilization = 30 + (this.loadBalancer.getStatistics().utilization * 50)
    return Math.min(100, baseUtilization + (Math.random() * 10 - 5))
  }

  private simulateMemoryUtilization(): number {
    // Simulate memory utilization
    const baseUtilization = 25 + (this.loadBalancer.getStatistics().utilization * 40)
    return Math.min(100, baseUtilization + (Math.random() * 8 - 4))
  }

  private calculateRequestsPerSecond(): number {
    // Calculate based on connection metrics
    const stats = this.loadBalancer.getStatistics()
    return stats.totalConnections * 0.5 // Approximate RPS
  }

  private generateEventId(): string {
    return `scale_€{Date.now()}_€{Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Public API methods
   */
  public getCurrentReplicas(): number {
    return this.currentReplicas
  }

  public getTargetReplicas(): number {
    return this.targetReplicas
  }

  public getScalingHistory(limit: number = 20): ScalingEvent[] {
    return this.scalingHistory.slice(-limit)
  }

  public getMetricsHistory(limit: number = 50): ScalingMetrics[] {
    return this.metricsHistory.slice(-limit)
  }

  public async forceScale(targetReplicas: number, reason: string = 'Manual scaling'): Promise<void> {
    if (targetReplicas < this.config.kubernetes.minReplicas || 
        targetReplicas > this.config.kubernetes.maxReplicas) {
      throw new Error(`Target replicas must be between €{this.config.kubernetes.minReplicas} and €{this.config.kubernetes.maxReplicas}`)
    }

    const decision: ScalingDecision = {
      action: targetReplicas > this.currentReplicas ? 'scale_up' : 'scale_down',
      currentReplicas: this.currentReplicas,
      targetReplicas,
      reason: `Manual scaling: €{reason}`,
      confidence: 1.0,
      metrics: await this.collectMetrics(),
      timestamp: new Date()
    }

    await this.executeScalingDecision(decision)
  }

  public getScalingStatistics(): {
    currentReplicas: number
    targetReplicas: number
    totalScalingEvents: number
    successfulScalingEvents: number
    averageScalingDuration: number
    lastScalingAction?: Date
  } {
    const successfulEvents = this.scalingHistory.filter(e => e.success)
    const avgDuration = successfulEvents.length > 0
      ? successfulEvents.reduce((sum, e) => sum + e.duration, 0) / successfulEvents.length
      : 0

    return {
      currentReplicas: this.currentReplicas,
      targetReplicas: this.targetReplicas,
      totalScalingEvents: this.scalingHistory.length,
      successfulScalingEvents: successfulEvents.length,
      averageScalingDuration: avgDuration,
      lastScalingAction: this.lastScaleAction
    }
  }

  /**
   * Shutdown horizontal scaler
   */
  public shutdown(): void {
    this.logger.info('Shutting down horizontal scaler')
    
    if (this.evaluationTimer) {
      clearInterval(this.evaluationTimer)
    }

    if (this.metricsCollector) {
      this.metricsCollector.shutdown()
    }

    this.logger.info('Horizontal scaler shutdown complete')
  }
}

/**
 * Factory function to create horizontal scaler
 */
export function createHorizontalScaler(
  config: Partial<ScalingConfig>,
  loadBalancer: EnterpriseLoadBalancer
): HorizontalScaler {
  const defaultConfig: ScalingConfig = {
    kubernetes: {
      enabled: true,
      namespace: 'erip-platform',
      deploymentName: 'erip-workers',
      containerImage: 'erip-platform:latest',
      minReplicas: 2,
      maxReplicas: 20,
      targetCpuUtilization: 70,
      targetMemoryUtilization: 80
    },
    scaling: {
      scaleUpCooldownMs: 300000, // 5 minutes
      scaleDownCooldownMs: 600000, // 10 minutes
      scaleUpThreshold: 0.8,
      scaleDownThreshold: 0.3,
      evaluationPeriods: 3,
      metricsWindowMs: 180000 // 3 minutes
    },
    resources: {
      cpuRequest: '500m',
      cpuLimit: '1000m',
      memoryRequest: '1Gi',
      memoryLimit: '2Gi',
      startupTimeMs: 60000,
      shutdownTimeMs: 30000
    },
    monitoring: {
      enabled: true,
      alertingEnabled: true,
      predictiveScaling: false
    }
  }

  return new HorizontalScaler({ ...defaultConfig, ...config }, loadBalancer)
}