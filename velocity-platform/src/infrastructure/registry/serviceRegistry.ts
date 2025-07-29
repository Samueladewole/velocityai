/**
 * ERIP Service Registry
 * 
 * Service discovery and health management for all ERIP components
 * Implements dynamic service registration with health checks and load balancing
 */

import { Redis } from 'ioredis'
import { Logger } from '../logging/logger'
import { ERIPEventBus } from '../events/eventBus'
import { ERIPComponent } from '../data/models'

export interface ServiceInstance {
  id: string
  component: ERIPComponent
  name: string
  version: string
  host: string
  port: number
  protocol: 'http' | 'https' | 'grpc'
  
  // Service metadata
  metadata: {
    region: string
    environment: 'development' | 'staging' | 'production'
    capabilities: string[]
    tags: Record<string, string>
    
    // Performance characteristics
    maxConcurrency: number
    averageResponseTime: number
    resourceUtilization: {
      cpu: number
      memory: number
      disk: number
    }
  }
  
  // Health and status
  status: 'healthy' | 'unhealthy' | 'degraded' | 'maintenance'
  lastHealthCheck: Date
  healthCheckUrl: string
  
  // Registration info
  registeredAt: Date
  lastHeartbeat: Date
  
  // Integration points
  dependencies: string[]
  endpoints: ServiceEndpoint[]
}

export interface ServiceEndpoint {
  name: string
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  description: string
  
  // Rate limiting
  rateLimit?: {
    requests: number
    window: number // seconds
    burst: number
  }
  
  // Authentication
  authentication: 'none' | 'api_key' | 'jwt' | 'mutual_tls'
  
  // Documentation
  schema?: string // JSON Schema or OpenAPI spec
  examples?: Record<string, any>
}

export interface HealthCheck {
  serviceId: string
  timestamp: Date
  status: 'healthy' | 'unhealthy' | 'degraded'
  responseTime: number
  
  // Detailed metrics
  checks: HealthCheckResult[]
  
  // Context
  version: string
  environment: string
}

export interface HealthCheckResult {
  name: string
  status: 'pass' | 'fail' | 'warn'
  responseTime: number
  message?: string
  
  // Additional data
  data?: Record<string, any>
}

export interface ServiceDiscoveryQuery {
  component?: ERIPComponent
  capabilities?: string[]
  region?: string
  environment?: string
  tags?: Record<string, string>
  healthStatus?: 'healthy' | 'unhealthy' | 'degraded'
  loadBalancing?: 'round_robin' | 'least_connections' | 'weighted' | 'random'
}

export interface LoadBalancingStrategy {
  name: string
  selectInstance(instances: ServiceInstance[], context?: any): ServiceInstance | null
}

// Built-in load balancing strategies
const LOAD_BALANCING_STRATEGIES: Record<string, LoadBalancingStrategy> = {
  round_robin: {
    name: 'round_robin',
    selectInstance: (() => {
      const counters = new Map<string, number>()
      
      return (instances: ServiceInstance[]) => {
        if (instances.length === 0) return null
        
        const key = instances.map(i => i.id).sort().join(',')
        const current = counters.get(key) || 0
        const selected = instances[current % instances.length]
        counters.set(key, current + 1)
        
        return selected
      }
    })()
  },
  
  least_connections: {
    name: 'least_connections',
    selectInstance: (instances: ServiceInstance[]) => {
      if (instances.length === 0) return null
      
      // Sort by current connections (simulated by resourceUtilization)
      return instances.sort((a, b) => 
        a.metadata.resourceUtilization.cpu - b.metadata.resourceUtilization.cpu
      )[0]
    }
  },
  
  weighted: {
    name: 'weighted',
    selectInstance: (instances: ServiceInstance[]) => {
      if (instances.length === 0) return null
      
      // Weight based on inverse of response time and resource utilization
      const weights = instances.map(instance => {
        const responseTimeWeight = 1000 / (instance.metadata.averageResponseTime + 1)
        const resourceWeight = 100 / (instance.metadata.resourceUtilization.cpu + instance.metadata.resourceUtilization.memory + 1)
        return responseTimeWeight * resourceWeight
      })
      
      const totalWeight = weights.reduce((sum, w) => sum + w, 0)
      const random = Math.random() * totalWeight
      
      let currentWeight = 0
      for (let i = 0; i < instances.length; i++) {
        currentWeight += weights[i]
        if (random <= currentWeight) {
          return instances[i]
        }
      }
      
      return instances[0]
    }
  },
  
  random: {
    name: 'random',
    selectInstance: (instances: ServiceInstance[]) => {
      if (instances.length === 0) return null
      return instances[Math.floor(Math.random() * instances.length)]
    }
  }
}

export class ERIPServiceRegistry {
  private static instance: ERIPServiceRegistry
  private redis: Redis
  private logger: Logger
  private eventBus: ERIPEventBus
  
  // Local cache for performance
  private serviceCache = new Map<string, ServiceInstance[]>()
  private cacheTimestamp = 0
  private readonly CACHE_TTL = 30000 // 30 seconds
  
  // Background processes
  private healthCheckInterval?: NodeJS.Timeout
  private cleanupInterval?: NodeJS.Timeout
  
  // Registry configuration
  private config = {
    healthCheckInterval: 30000, // 30 seconds
    serviceTimeout: 120000,     // 2 minutes
    maxRetries: 3,
    retryDelay: 5000,          // 5 seconds
    cleanupInterval: 300000    // 5 minutes
  }

  private constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '1'),
      keyPrefix: 'erip:registry:',
      retryDelayOnFailover: 100,
      lazyConnect: true
    })
    
    this.logger = new Logger('ServiceRegistry')
    this.eventBus = ERIPEventBus.getInstance()
    
    this.setupEventHandlers()
    this.startBackgroundProcesses()
  }

  static getInstance(): ERIPServiceRegistry {
    if (!this.instance) {
      this.instance = new ERIPServiceRegistry()
    }
    return this.instance
  }

  /**
   * Register a service instance
   */
  async registerService(service: Omit<ServiceInstance, 'id' | 'registeredAt' | 'lastHeartbeat'>): Promise<string> {
    const serviceId = this.generateServiceId(service.component, service.name)
    
    const serviceInstance: ServiceInstance = {
      ...service,
      id: serviceId,
      registeredAt: new Date(),
      lastHeartbeat: new Date()
    }
    
    try {
      // Store in Redis with TTL
      await this.redis.setex(
        `service:${serviceId}`,
        Math.ceil(this.config.serviceTimeout / 1000),
        JSON.stringify(serviceInstance)
      )
      
      // Add to component index
      await this.redis.sadd(`component:${service.component}`, serviceId)
      
      // Add to region index
      await this.redis.sadd(`region:${service.metadata.region}`, serviceId)
      
      // Add to environment index
      await this.redis.sadd(`environment:${service.metadata.environment}`, serviceId)
      
      // Add capability indexes
      for (const capability of service.metadata.capabilities) {
        await this.redis.sadd(`capability:${capability}`, serviceId)
      }
      
      // Add tag indexes
      for (const [key, value] of Object.entries(service.metadata.tags)) {
        await this.redis.sadd(`tag:${key}:${value}`, serviceId)
      }
      
      // Clear cache
      this.clearCache()
      
      // Emit registration event
      await this.eventBus.publish({
        eventId: this.generateEventId(),
        source: 'service_registry',
        type: 'service.registered',
        timestamp: new Date().toISOString(),
        data: {
          serviceId,
          component: service.component,
          name: service.name,
          version: service.version,
          endpoints: service.endpoints
        }
      })
      
      this.logger.info('Service registered', {
        serviceId,
        component: service.component,
        name: service.name,
        version: service.version
      })
      
      return serviceId
      
    } catch (error) {
      this.logger.error('Failed to register service', { service, error })
      throw error
    }
  }

  /**
   * Update service heartbeat and metadata
   */
  async updateServiceHeartbeat(
    serviceId: string, 
    metadata?: Partial<ServiceInstance['metadata']>
  ): Promise<void> {
    try {
      const serviceData = await this.redis.get(`service:${serviceId}`)
      if (!serviceData) {
        throw new Error(`Service ${serviceId} not found`)
      }
      
      const service: ServiceInstance = JSON.parse(serviceData)
      service.lastHeartbeat = new Date()
      
      if (metadata) {
        service.metadata = { ...service.metadata, ...metadata }
      }
      
      // Update with extended TTL
      await this.redis.setex(
        `service:${serviceId}`,
        Math.ceil(this.config.serviceTimeout / 1000),
        JSON.stringify(service)
      )
      
      this.clearCache()
      
    } catch (error) {
      this.logger.error('Failed to update service heartbeat', { serviceId, error })
      throw error
    }
  }

  /**
   * Deregister a service
   */
  async deregisterService(serviceId: string): Promise<void> {
    try {
      const serviceData = await this.redis.get(`service:${serviceId}`)
      if (!serviceData) {
        this.logger.warn('Attempted to deregister non-existent service', { serviceId })
        return
      }
      
      const service: ServiceInstance = JSON.parse(serviceData)
      
      // Remove from all indexes
      await Promise.all([
        this.redis.del(`service:${serviceId}`),
        this.redis.srem(`component:${service.component}`, serviceId),
        this.redis.srem(`region:${service.metadata.region}`, serviceId),
        this.redis.srem(`environment:${service.metadata.environment}`, serviceId),
        ...service.metadata.capabilities.map(cap => 
          this.redis.srem(`capability:${cap}`, serviceId)
        ),
        ...Object.entries(service.metadata.tags).map(([key, value]) =>
          this.redis.srem(`tag:${key}:${value}`, serviceId)
        )
      ])
      
      this.clearCache()
      
      // Emit deregistration event
      await this.eventBus.publish({
        eventId: this.generateEventId(),
        source: 'service_registry',
        type: 'service.deregistered',
        timestamp: new Date().toISOString(),
        data: {
          serviceId,
          component: service.component,
          name: service.name
        }
      })
      
      this.logger.info('Service deregistered', { serviceId, component: service.component })
      
    } catch (error) {
      this.logger.error('Failed to deregister service', { serviceId, error })
      throw error
    }
  }

  /**
   * Discover services based on query parameters
   */
  async discoverServices(query: ServiceDiscoveryQuery): Promise<ServiceInstance[]> {
    try {
      // Check cache first
      const cacheKey = JSON.stringify(query)
      const now = Date.now()
      
      if (now - this.cacheTimestamp < this.CACHE_TTL) {
        const cached = this.serviceCache.get(cacheKey)
        if (cached) {
          return this.applyLoadBalancing(cached, query.loadBalancing)
        }
      }
      
      // Build intersection of service IDs based on query
      let serviceIds: string[] = []
      
      if (query.component) {
        serviceIds = await this.redis.smembers(`component:${query.component}`)
      } else {
        // Get all services if no component specified
        const keys = await this.redis.keys('service:*')
        serviceIds = keys.map(key => key.replace('service:', ''))
      }
      
      // Apply filters
      if (query.capabilities && query.capabilities.length > 0) {
        const capabilityIntersections = await Promise.all(
          query.capabilities.map(cap => this.redis.smembers(`capability:${cap}`))
        )
        serviceIds = this.intersectArrays([serviceIds, ...capabilityIntersections])
      }
      
      if (query.region) {
        const regionServices = await this.redis.smembers(`region:${query.region}`)
        serviceIds = this.intersectArrays([serviceIds, regionServices])
      }
      
      if (query.environment) {
        const envServices = await this.redis.smembers(`environment:${query.environment}`)
        serviceIds = this.intersectArrays([serviceIds, envServices])
      }
      
      if (query.tags) {
        const tagIntersections = await Promise.all(
          Object.entries(query.tags).map(([key, value]) =>
            this.redis.smembers(`tag:${key}:${value}`)
          )
        )
        serviceIds = this.intersectArrays([serviceIds, ...tagIntersections])
      }
      
      // Get service details
      const services: ServiceInstance[] = []
      const pipeline = this.redis.pipeline()
      serviceIds.forEach(id => pipeline.get(`service:${id}`))
      
      const results = await pipeline.exec()
      
      if (results) {
        for (const [error, result] of results) {
          if (!error && result) {
            try {
              const service: ServiceInstance = JSON.parse(result as string)
              
              // Apply health status filter
              if (!query.healthStatus || service.status === query.healthStatus) {
                services.push(service)
              }
            } catch (parseError) {
              this.logger.error('Failed to parse service data', { result, parseError })
            }
          }
        }
      }
      
      // Cache results
      this.serviceCache.set(cacheKey, services)
      this.cacheTimestamp = now
      
      return this.applyLoadBalancing(services, query.loadBalancing)
      
    } catch (error) {
      this.logger.error('Failed to discover services', { query, error })
      throw error
    }
  }

  /**
   * Get a specific service by ID
   */
  async getService(serviceId: string): Promise<ServiceInstance | null> {
    try {
      const serviceData = await this.redis.get(`service:${serviceId}`)
      return serviceData ? JSON.parse(serviceData) : null
    } catch (error) {
      this.logger.error('Failed to get service', { serviceId, error })
      return null
    }
  }

  /**
   * Get all services for a component
   */
  async getServicesForComponent(component: ERIPComponent): Promise<ServiceInstance[]> {
    return this.discoverServices({ component, healthStatus: 'healthy' })
  }

  /**
   * Record health check result
   */
  async recordHealthCheck(serviceId: string, healthCheck: Omit<HealthCheck, 'serviceId' | 'timestamp'>): Promise<void> {
    try {
      const service = await this.getService(serviceId)
      if (!service) {
        throw new Error(`Service ${serviceId} not found`)
      }
      
      const fullHealthCheck: HealthCheck = {
        ...healthCheck,
        serviceId,
        timestamp: new Date()
      }
      
      // Update service status
      service.status = healthCheck.status
      service.lastHealthCheck = new Date()
      service.metadata.averageResponseTime = healthCheck.responseTime
      
      // Store updated service
      await this.redis.setex(
        `service:${serviceId}`,
        Math.ceil(this.config.serviceTimeout / 1000),
        JSON.stringify(service)
      )
      
      // Store health check history
      await this.redis.lpush(
        `health:${serviceId}`,
        JSON.stringify(fullHealthCheck)
      )
      
      // Keep only last 50 health checks
      await this.redis.ltrim(`health:${serviceId}`, 0, 49)
      
      this.clearCache()
      
      // Emit health check event
      await this.eventBus.publish({
        eventId: this.generateEventId(),
        source: 'service_registry',
        type: 'service.health_check',
        timestamp: new Date().toISOString(),
        data: {
          serviceId,
          status: healthCheck.status,
          responseTime: healthCheck.responseTime,
          checksCount: healthCheck.checks.length,
          passedChecks: healthCheck.checks.filter(c => c.status === 'pass').length
        }
      })
      
    } catch (error) {
      this.logger.error('Failed to record health check', { serviceId, error })
      throw error
    }
  }

  /**
   * Get health check history for a service
   */
  async getHealthHistory(serviceId: string, limit: number = 10): Promise<HealthCheck[]> {
    try {
      const healthData = await this.redis.lrange(`health:${serviceId}`, 0, limit - 1)
      return healthData.map(data => JSON.parse(data))
    } catch (error) {
      this.logger.error('Failed to get health history', { serviceId, error })
      return []
    }
  }

  /**
   * Get service registry statistics
   */
  async getRegistryStats(): Promise<{
    totalServices: number
    servicesByComponent: Record<ERIPComponent, number>
    servicesByStatus: Record<string, number>
    servicesByRegion: Record<string, number>
    servicesByEnvironment: Record<string, number>
  }> {
    try {
      const serviceKeys = await this.redis.keys('service:*')
      const pipeline = this.redis.pipeline()
      serviceKeys.forEach(key => pipeline.get(key))
      
      const results = await pipeline.exec()
      
      const stats = {
        totalServices: 0,
        servicesByComponent: {} as Record<ERIPComponent, number>,
        servicesByStatus: {} as Record<string, number>,
        servicesByRegion: {} as Record<string, number>,
        servicesByEnvironment: {} as Record<string, number>
      }
      
      if (results) {
        for (const [error, result] of results) {
          if (!error && result) {
            try {
              const service: ServiceInstance = JSON.parse(result as string)
              stats.totalServices++
              
              // Count by component
              stats.servicesByComponent[service.component] = 
                (stats.servicesByComponent[service.component] || 0) + 1
              
              // Count by status
              stats.servicesByStatus[service.status] = 
                (stats.servicesByStatus[service.status] || 0) + 1
              
              // Count by region
              stats.servicesByRegion[service.metadata.region] = 
                (stats.servicesByRegion[service.metadata.region] || 0) + 1
              
              // Count by environment
              stats.servicesByEnvironment[service.metadata.environment] = 
                (stats.servicesByEnvironment[service.metadata.environment] || 0) + 1
                
            } catch (parseError) {
              // Skip invalid entries
            }
          }
        }
      }
      
      return stats
      
    } catch (error) {
      this.logger.error('Failed to get registry stats', { error })
      throw error
    }
  }

  /**
   * Private helper methods
   */
  private setupEventHandlers(): void {
    // Listen for component events to update service status
    this.eventBus.subscribe('*', async (event) => {
      if (event.type.includes('error') || event.type.includes('failure')) {
        await this.handleServiceError(event)
      }
    })
  }

  private async handleServiceError(event: any): Promise<void> {
    // Find services that might be affected by this error
    const services = await this.discoverServices({
      component: event.source as ERIPComponent
    })
    
    // Mark services as degraded if they're having issues
    for (const service of services) {
      if (service.status === 'healthy') {
        service.status = 'degraded'
        await this.redis.setex(
          `service:${service.id}`,
          Math.ceil(this.config.serviceTimeout / 1000),
          JSON.stringify(service)
        )
      }
    }
    
    this.clearCache()
  }

  private startBackgroundProcesses(): void {
    // Health check process
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performHealthChecks()
      } catch (error) {
        this.logger.error('Health check process failed', error)
      }
    }, this.config.healthCheckInterval)
    
    // Cleanup process
    this.cleanupInterval = setInterval(async () => {
      try {
        await this.cleanupStaleServices()
      } catch (error) {
        this.logger.error('Cleanup process failed', error)
      }
    }, this.config.cleanupInterval)
  }

  private async performHealthChecks(): Promise<void> {
    const serviceKeys = await this.redis.keys('service:*')
    
    for (const key of serviceKeys) {
      try {
        const serviceData = await this.redis.get(key)
        if (!serviceData) continue
        
        const service: ServiceInstance = JSON.parse(serviceData)
        const serviceId = service.id
        
        // Skip if recently checked
        const timeSinceLastCheck = Date.now() - service.lastHealthCheck.getTime()
        if (timeSinceLastCheck < this.config.healthCheckInterval / 2) {
          continue
        }
        
        // Perform health check
        const healthCheck = await this.performServiceHealthCheck(service)
        await this.recordHealthCheck(serviceId, healthCheck)
        
      } catch (error) {
        this.logger.error('Failed to perform health check', { key, error })
      }
    }
  }

  private async performServiceHealthCheck(service: ServiceInstance): Promise<Omit<HealthCheck, 'serviceId' | 'timestamp'>> {
    const startTime = Date.now()
    
    try {
      // Perform HTTP health check
      const response = await fetch(`${service.protocol}://${service.host}:${service.port}${service.healthCheckUrl}`, {
        method: 'GET',
        timeout: 5000,
        headers: {
          'User-Agent': 'ERIP-ServiceRegistry/1.0',
          'Accept': 'application/json'
        }
      })
      
      const responseTime = Date.now() - startTime
      const isHealthy = response.ok
      
      let healthData: any = {}
      try {
        healthData = await response.json()
      } catch {
        // Ignore JSON parse errors
      }
      
      const checks: HealthCheckResult[] = [
        {
          name: 'http_connectivity',
          status: isHealthy ? 'pass' : 'fail',
          responseTime,
          message: isHealthy ? 'Service responding' : `HTTP ${response.status}: ${response.statusText}`
        }
      ]
      
      // Add additional checks from response
      if (healthData.checks && Array.isArray(healthData.checks)) {
        checks.push(...healthData.checks)
      }
      
      const overallStatus = checks.every(c => c.status === 'pass') ? 'healthy' :
                          checks.some(c => c.status === 'pass') ? 'degraded' : 'unhealthy'
      
      return {
        status: overallStatus,
        responseTime,
        checks,
        version: service.version,
        environment: service.metadata.environment
      }
      
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        checks: [{
          name: 'http_connectivity',
          status: 'fail',
          responseTime: Date.now() - startTime,
          message: error instanceof Error ? error.message : 'Unknown error'
        }],
        version: service.version,
        environment: service.metadata.environment
      }
    }
  }

  private async cleanupStaleServices(): Promise<void> {
    const serviceKeys = await this.redis.keys('service:*')
    const now = Date.now()
    
    for (const key of serviceKeys) {
      try {
        const serviceData = await this.redis.get(key)
        if (!serviceData) continue
        
        const service: ServiceInstance = JSON.parse(serviceData)
        const timeSinceHeartbeat = now - service.lastHeartbeat.getTime()
        
        if (timeSinceHeartbeat > this.config.serviceTimeout) {
          this.logger.info('Removing stale service', {
            serviceId: service.id,
            component: service.component,
            timeSinceHeartbeat: Math.round(timeSinceHeartbeat / 1000)
          })
          
          await this.deregisterService(service.id)
        }
        
      } catch (error) {
        this.logger.error('Failed to cleanup stale service', { key, error })
      }
    }
  }

  private applyLoadBalancing(services: ServiceInstance[], strategy?: string): ServiceInstance[] {
    if (!strategy || services.length <= 1) {
      return services
    }
    
    const loadBalancer = LOAD_BALANCING_STRATEGIES[strategy]
    if (!loadBalancer) {
      this.logger.warn('Unknown load balancing strategy', { strategy })
      return services
    }
    
    const selected = loadBalancer.selectInstance(services)
    return selected ? [selected] : []
  }

  private intersectArrays(arrays: string[][]): string[] {
    if (arrays.length === 0) return []
    if (arrays.length === 1) return arrays[0]
    
    return arrays.reduce((intersection, array) => 
      intersection.filter(item => array.includes(item))
    )
  }

  private clearCache(): void {
    this.serviceCache.clear()
    this.cacheTimestamp = 0
  }

  private generateServiceId(component: ERIPComponent, name: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 9)
    return `${component}-${name}-${timestamp}-${random}`
  }

  private generateEventId(): string {
    return `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Cleanup resources
   */
  async shutdown(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }
    
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    
    await this.redis.quit()
    this.logger.info('Service registry shutdown complete')
  }
}