/**
 * Enterprise Load Balancer for ERIP Platform
 * 
 * Implements high-availability load balancing with automatic failover,
 * health checking, and horizontal scaling capabilities
 */

import { EventEmitter } from 'events'
import { Logger } from '../logging/logger'
import { MetricsCollector } from '../../services/monitoring/metricsCollector'

export interface ServiceInstance {
  id: string
  host: string
  port: number
  protocol: 'http' | 'https' | 'ws' | 'wss'
  weight: number
  healthy: boolean
  currentConnections: number
  maxConnections: number
  lastHealthCheck: Date
  responseTime: number
  errorCount: number
  metadata: Record<string, any>
}

export interface LoadBalancerConfig {
  strategy: 'round_robin' | 'weighted_round_robin' | 'least_connections' | 'ip_hash' | 'random'
  healthCheck: {
    enabled: boolean
    intervalMs: number
    timeoutMs: number
    retries: number
    path?: string
    expectedStatus?: number
  }
  failover: {
    enabled: boolean
    minHealthyInstances: number
    autoScaling: boolean
    scaleUpThreshold: number
    scaleDownThreshold: number
  }
  connectionLimits: {
    maxPerInstance: number
    maxTotal: number
    queueSize: number
  }
  monitoring: {
    metricsEnabled: boolean
    alertThresholds: {
      errorRate: number
      responseTime: number
      connectionUtilization: number
    }
  }
}

export interface LoadBalancingResult {
  instance: ServiceInstance
  connectionId: string
  routingDecision: string
  timestamp: Date
}

export class EnterpriseLoadBalancer extends EventEmitter {
  private instances: Map<string, ServiceInstance> = new Map()
  private logger: Logger
  private metricsCollector: MetricsCollector
  private healthCheckInterval?: NodeJS.Timeout
  private currentIndex = 0 // For round robin
  private connectionQueue: Array<{ resolve: Function; reject: Function; timeout: NodeJS.Timeout }> = []
  private totalConnections = 0

  constructor(private config: LoadBalancerConfig) {
    super()
    this.logger = new Logger('EnterpriseLoadBalancer')
    
    if (config.monitoring.metricsEnabled) {
      this.metricsCollector = new MetricsCollector({
        enabled: true,
        exportInterval: 60000,
        labels: { component: 'load_balancer' }
      })
    }

    this.startHealthChecking()
    this.startConnectionQueueProcessor()
  }

  /**
   * Register a service instance
   */
  registerInstance(instance: Omit<ServiceInstance, 'id' | 'healthy' | 'currentConnections' | 'lastHealthCheck' | 'errorCount'>): string {
    const instanceId = `${instance.host}:${instance.port}_${Date.now()}`
    
    const serviceInstance: ServiceInstance = {
      ...instance,
      id: instanceId,
      healthy: true,
      currentConnections: 0,
      lastHealthCheck: new Date(),
      errorCount: 0
    }

    this.instances.set(instanceId, serviceInstance)
    
    this.logger.info('Service instance registered', {
      instanceId,
      host: instance.host,
      port: instance.port,
      weight: instance.weight
    })

    if (this.config.monitoring.metricsEnabled) {
      this.metricsCollector.incrementCounter('instances_registered', { 
        host: instance.host 
      })
    }

    this.emit('instance_registered', serviceInstance)
    return instanceId
  }

  /**
   * Unregister a service instance
   */
  unregisterInstance(instanceId: string): boolean {
    const instance = this.instances.get(instanceId)
    if (!instance) return false

    // Gracefully drain connections
    this.drainInstance(instanceId)
    
    this.instances.delete(instanceId)
    
    this.logger.info('Service instance unregistered', { instanceId })
    
    if (this.config.monitoring.metricsEnabled) {
      this.metricsCollector.incrementCounter('instances_unregistered', {
        host: instance.host
      })
    }

    this.emit('instance_unregistered', instanceId)
    return true
  }

  /**
   * Get next available instance using configured strategy
   */
  async getNextInstance(clientInfo?: { ip?: string; headers?: Record<string, string> }): Promise<LoadBalancingResult> {
    const healthyInstances = Array.from(this.instances.values()).filter(i => i.healthy)
    
    if (healthyInstances.length === 0) {
      throw new Error('No healthy instances available')
    }

    // Check if we need to queue the request
    if (this.totalConnections >= this.config.connectionLimits.maxTotal) {
      if (this.connectionQueue.length >= this.config.connectionLimits.queueSize) {
        throw new Error('Connection queue full')
      }

      return this.queueConnection()
    }

    let selectedInstance: ServiceInstance

    switch (this.config.strategy) {
      case 'round_robin':
        selectedInstance = this.selectRoundRobin(healthyInstances)
        break
      case 'weighted_round_robin':
        selectedInstance = this.selectWeightedRoundRobin(healthyInstances)
        break
      case 'least_connections':
        selectedInstance = this.selectLeastConnections(healthyInstances)
        break
      case 'ip_hash':
        selectedInstance = this.selectIpHash(healthyInstances, clientInfo?.ip)
        break
      case 'random':
        selectedInstance = this.selectRandom(healthyInstances)
        break
      default:
        selectedInstance = this.selectRoundRobin(healthyInstances)
    }

    // Check instance connection limits
    if (selectedInstance.currentConnections >= selectedInstance.maxConnections) {
      // Try next available instance
      const alternativeInstances = healthyInstances.filter(i => 
        i.id !== selectedInstance.id && 
        i.currentConnections < i.maxConnections
      )
      
      if (alternativeInstances.length === 0) {
        return this.queueConnection()
      }
      
      selectedInstance = this.selectLeastConnections(alternativeInstances)
    }

    // Update connection count
    selectedInstance.currentConnections++
    this.totalConnections++

    const connectionId = this.generateConnectionId()
    
    const result: LoadBalancingResult = {
      instance: selectedInstance,
      connectionId,
      routingDecision: `${this.config.strategy}:${selectedInstance.id}`,
      timestamp: new Date()
    }

    if (this.config.monitoring.metricsEnabled) {
      this.metricsCollector.incrementCounter('connections_routed', {
        instance: selectedInstance.id,
        strategy: this.config.strategy
      })
      this.metricsCollector.recordHistogram('connection_routing_time', Date.now() - result.timestamp.getTime())
    }

    this.logger.debug('Connection routed', {
      connectionId,
      instance: selectedInstance.id,
      strategy: this.config.strategy,
      currentConnections: selectedInstance.currentConnections
    })

    return result
  }

  /**
   * Release a connection from an instance
   */
  releaseConnection(connectionId: string, instanceId: string, success: boolean = true): void {
    const instance = this.instances.get(instanceId)
    if (!instance) return

    instance.currentConnections = Math.max(0, instance.currentConnections - 1)
    this.totalConnections = Math.max(0, this.totalConnections - 1)

    if (!success) {
      instance.errorCount++
      
      // Mark instance as unhealthy if error rate is too high
      const errorRate = instance.errorCount / Math.max(1, instance.currentConnections + instance.errorCount)
      if (errorRate > this.config.monitoring.alertThresholds.errorRate) {
        this.markInstanceUnhealthy(instanceId, `High error rate: ${errorRate}`)
      }
    }

    if (this.config.monitoring.metricsEnabled) {
      this.metricsCollector.incrementCounter('connections_released', {
        instance: instanceId,
        success: success.toString()
      })
    }

    // Process queued connections
    this.processConnectionQueue()

    this.logger.debug('Connection released', {
      connectionId,
      instanceId,
      success,
      remainingConnections: instance.currentConnections
    })
  }

  /**
   * Load balancing strategy implementations
   */
  private selectRoundRobin(instances: ServiceInstance[]): ServiceInstance {
    const instance = instances[this.currentIndex % instances.length]
    this.currentIndex++
    return instance
  }

  private selectWeightedRoundRobin(instances: ServiceInstance[]): ServiceInstance {
    const totalWeight = instances.reduce((sum, instance) => sum + instance.weight, 0)
    let random = Math.random() * totalWeight
    
    for (const instance of instances) {
      random -= instance.weight
      if (random <= 0) {
        return instance
      }
    }
    
    return instances[0] // Fallback
  }

  private selectLeastConnections(instances: ServiceInstance[]): ServiceInstance {
    return instances.reduce((least, current) => 
      current.currentConnections < least.currentConnections ? current : least
    )
  }

  private selectIpHash(instances: ServiceInstance[], clientIp?: string): ServiceInstance {
    if (!clientIp) return this.selectRoundRobin(instances)
    
    // Simple hash function for IP
    const hash = clientIp.split('.').reduce((acc, octet) => acc + parseInt(octet), 0)
    return instances[hash % instances.length]
  }

  private selectRandom(instances: ServiceInstance[]): ServiceInstance {
    return instances[Math.floor(Math.random() * instances.length)]
  }

  /**
   * Connection queueing for overload handling
   */
  private async queueConnection(): Promise<LoadBalancingResult> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = this.connectionQueue.findIndex(item => item.resolve === resolve)
        if (index !== -1) {
          this.connectionQueue.splice(index, 1)
        }
        reject(new Error('Connection queue timeout'))
      }, 30000) // 30 second timeout

      this.connectionQueue.push({ resolve, reject, timeout })

      if (this.config.monitoring.metricsEnabled) {
        this.metricsCollector.recordHistogram('connection_queue_size', this.connectionQueue.length)
      }
    })
  }

  private processConnectionQueue(): void {
    while (this.connectionQueue.length > 0 && this.totalConnections < this.config.connectionLimits.maxTotal) {
      const queuedConnection = this.connectionQueue.shift()
      if (queuedConnection) {
        clearTimeout(queuedConnection.timeout)
        
        this.getNextInstance().then(result => {
          queuedConnection.resolve(result)
        }).catch(error => {
          queuedConnection.reject(error)
        })
      }
    }
  }

  /**
   * Health checking implementation
   */
  private startHealthChecking(): void {
    if (!this.config.healthCheck.enabled) return

    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks()
    }, this.config.healthCheck.intervalMs)

    this.logger.info('Health checking started', {
      interval: this.config.healthCheck.intervalMs,
      timeout: this.config.healthCheck.timeoutMs
    })
  }

  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = Array.from(this.instances.values()).map(instance => 
      this.checkInstanceHealth(instance)
    )

    await Promise.allSettled(healthCheckPromises)

    // Check if we need to trigger scaling
    if (this.config.failover.autoScaling) {
      await this.checkScalingTriggers()
    }
  }

  private async checkInstanceHealth(instance: ServiceInstance): Promise<void> {
    const startTime = Date.now()
    
    try {
      // Perform health check (simplified - would make actual HTTP request)
      const isHealthy = await this.performHealthCheckRequest(instance)
      const responseTime = Date.now() - startTime
      
      instance.responseTime = responseTime
      instance.lastHealthCheck = new Date()

      if (isHealthy && !instance.healthy) {
        this.markInstanceHealthy(instance.id)
      } else if (!isHealthy && instance.healthy) {
        this.markInstanceUnhealthy(instance.id, 'Health check failed')
      }

      if (this.config.monitoring.metricsEnabled) {
        this.metricsCollector.recordHistogram('health_check_response_time', responseTime, {
          instance: instance.id
        })
      }

    } catch (error) {
      instance.errorCount++
      if (instance.healthy) {
        this.markInstanceUnhealthy(instance.id, `Health check error: ${error}`)
      }
    }
  }

  private async performHealthCheckRequest(instance: ServiceInstance): Promise<boolean> {
    // Simulate health check - in real implementation would make HTTP request
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
    
    // Simulate 95% success rate
    return Math.random() > 0.05
  }

  private markInstanceHealthy(instanceId: string): void {
    const instance = this.instances.get(instanceId)
    if (!instance) return

    instance.healthy = true
    instance.errorCount = Math.floor(instance.errorCount * 0.5) // Reduce error count

    this.logger.info('Instance marked healthy', { instanceId })
    
    if (this.config.monitoring.metricsEnabled) {
      this.metricsCollector.incrementCounter('instances_recovered', {
        instance: instanceId
      })
    }

    this.emit('instance_healthy', instance)
  }

  private markInstanceUnhealthy(instanceId: string, reason: string): void {
    const instance = this.instances.get(instanceId)
    if (!instance) return

    instance.healthy = false

    this.logger.warn('Instance marked unhealthy', { instanceId, reason })
    
    if (this.config.monitoring.metricsEnabled) {
      this.metricsCollector.incrementCounter('instances_unhealthy', {
        instance: instanceId,
        reason
      })
    }

    this.emit('instance_unhealthy', { instance, reason })

    // Check if we need emergency scaling
    const healthyCount = Array.from(this.instances.values()).filter(i => i.healthy).length
    if (healthyCount < this.config.failover.minHealthyInstances) {
      this.emit('emergency_scaling_required', { healthyCount, required: this.config.failover.minHealthyInstances })
    }
  }

  /**
   * Auto-scaling logic
   */
  private async checkScalingTriggers(): Promise<void> {
    const healthyInstances = Array.from(this.instances.values()).filter(i => i.healthy)
    const totalCapacity = healthyInstances.reduce((sum, i) => sum + i.maxConnections, 0)
    const utilization = totalCapacity > 0 ? this.totalConnections / totalCapacity : 0

    // Scale up trigger
    if (utilization > this.config.failover.scaleUpThreshold) {
      this.emit('scale_up_triggered', {
        utilization,
        threshold: this.config.failover.scaleUpThreshold,
        currentInstances: healthyInstances.length
      })
    }

    // Scale down trigger
    if (utilization < this.config.failover.scaleDownThreshold && healthyInstances.length > this.config.failover.minHealthyInstances) {
      this.emit('scale_down_triggered', {
        utilization,
        threshold: this.config.failover.scaleDownThreshold,
        currentInstances: healthyInstances.length
      })
    }
  }

  /**
   * Graceful instance draining
   */
  private async drainInstance(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId)
    if (!instance) return

    this.logger.info('Draining instance', { instanceId, currentConnections: instance.currentConnections })

    // Mark as unhealthy to stop new connections
    instance.healthy = false

    // Wait for existing connections to complete (with timeout)
    const maxWaitTime = 30000 // 30 seconds
    const startTime = Date.now()

    while (instance.currentConnections > 0 && (Date.now() - startTime) < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    if (instance.currentConnections > 0) {
      this.logger.warn('Force closing remaining connections', {
        instanceId,
        remainingConnections: instance.currentConnections
      })
      // In real implementation, would forcefully close connections
      instance.currentConnections = 0
    }

    this.logger.info('Instance drained successfully', { instanceId })
  }

  /**
   * Get load balancer statistics
   */
  public getStatistics(): {
    totalInstances: number
    healthyInstances: number
    totalConnections: number
    queueSize: number
    averageResponseTime: number
    errorRate: number
    utilization: number
  } {
    const allInstances = Array.from(this.instances.values())
    const healthyInstances = allInstances.filter(i => i.healthy)
    const totalCapacity = healthyInstances.reduce((sum, i) => sum + i.maxConnections, 0)
    const totalErrors = allInstances.reduce((sum, i) => sum + i.errorCount, 0)
    const totalRequests = totalErrors + this.totalConnections
    const avgResponseTime = allInstances.length > 0 
      ? allInstances.reduce((sum, i) => sum + i.responseTime, 0) / allInstances.length 
      : 0

    return {
      totalInstances: allInstances.length,
      healthyInstances: healthyInstances.length,
      totalConnections: this.totalConnections,
      queueSize: this.connectionQueue.length,
      averageResponseTime: avgResponseTime,
      errorRate: totalRequests > 0 ? totalErrors / totalRequests : 0,
      utilization: totalCapacity > 0 ? this.totalConnections / totalCapacity : 0
    }
  }

  /**
   * Get instance details
   */
  public getInstances(): ServiceInstance[] {
    return Array.from(this.instances.values())
  }

  /**
   * Force failover to backup instances
   */
  public async triggerFailover(failedInstanceId: string): Promise<void> {
    this.logger.info('Triggering failover', { failedInstanceId })
    
    await this.drainInstance(failedInstanceId)
    this.markInstanceUnhealthy(failedInstanceId, 'Manual failover triggered')
    
    this.emit('failover_triggered', { failedInstanceId })
  }

  /**
   * Utility methods
   */
  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private startConnectionQueueProcessor(): void {
    setInterval(() => {
      this.processConnectionQueue()
    }, 1000) // Process queue every second
  }

  /**
   * Shutdown load balancer
   */
  public async shutdown(): Promise<void> {
    this.logger.info('Shutting down load balancer')

    // Stop health checking
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }

    // Drain all instances
    const drainPromises = Array.from(this.instances.keys()).map(instanceId => 
      this.drainInstance(instanceId)
    )
    await Promise.all(drainPromises)

    // Clear connection queue
    this.connectionQueue.forEach(queuedConnection => {
      clearTimeout(queuedConnection.timeout)
      queuedConnection.reject(new Error('Load balancer shutting down'))
    })
    this.connectionQueue = []

    // Shutdown metrics
    if (this.metricsCollector) {
      this.metricsCollector.shutdown()
    }

    this.logger.info('Load balancer shutdown complete')
  }
}

/**
 * Factory function to create load balancer with common configurations
 */
export function createEnterpriseLoadBalancer(config: Partial<LoadBalancerConfig> = {}): EnterpriseLoadBalancer {
  const defaultConfig: LoadBalancerConfig = {
    strategy: 'least_connections',
    healthCheck: {
      enabled: true,
      intervalMs: 30000,
      timeoutMs: 5000,
      retries: 3,
      path: '/health',
      expectedStatus: 200
    },
    failover: {
      enabled: true,
      minHealthyInstances: 2,
      autoScaling: true,
      scaleUpThreshold: 0.8,
      scaleDownThreshold: 0.3
    },
    connectionLimits: {
      maxPerInstance: 1000,
      maxTotal: 10000,
      queueSize: 1000
    },
    monitoring: {
      metricsEnabled: true,
      alertThresholds: {
        errorRate: 0.05,
        responseTime: 5000,
        connectionUtilization: 0.9
      }
    }
  }

  return new EnterpriseLoadBalancer({ ...defaultConfig, ...config })
}