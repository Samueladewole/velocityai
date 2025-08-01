/**
 * ERIP Health Check System
 * 
 * Comprehensive health monitoring for all ERIP components with detailed diagnostics
 */

import { Express, Request, Response } from 'express'
import { DatabaseService } from '../database/service'
import { ERIPEventBus } from '../events/eventBus'
import { ERIPServiceRegistry } from '../registry/serviceRegistry'
import { TrustEquityEngine } from '../trustEquity/engine'
import { Logger } from '../logging/logger'
import { ERIPComponent } from '../data/models'

export interface HealthCheckResult {
  name: string
  status: 'pass' | 'fail' | 'warn'
  responseTime: number
  message?: string
  data?: Record<string, any>
  timestamp: Date
}

export interface ComponentHealthStatus {
  component: ERIPComponent
  status: 'healthy' | 'degraded' | 'unhealthy' | 'offline'
  overallScore: number
  checks: HealthCheckResult[]
  lastCheck: Date
  uptime: number
  version: string
  dependencies: ComponentDependency[]
}

export interface ComponentDependency {
  name: string
  type: 'database' | 'redis' | 'external_api' | 'service'
  status: 'available' | 'degraded' | 'unavailable'
  responseTime?: number
  lastCheck: Date
}

export interface SystemHealthOverview {
  status: 'healthy' | 'degraded' | 'unhealthy'
  overallScore: number
  timestamp: Date
  components: ComponentHealthStatus[]
  infrastructure: {
    database: HealthCheckResult
    eventBus: HealthCheckResult
    serviceRegistry: HealthCheckResult
    trustEngine: HealthCheckResult
  }
  metrics: {
    totalRequests: number
    averageResponseTime: number
    errorRate: number
    uptime: number
  }
}

export class ERIPHealthCheck {
  private static instance: ERIPHealthCheck
  private logger: Logger
  private database: DatabaseService
  private eventBus: ERIPEventBus
  private serviceRegistry: ERIPServiceRegistry
  private trustEngine: TrustEquityEngine
  
  // Health check cache
  private healthCache = new Map<string, { result: HealthCheckResult; timestamp: number }>()
  private systemHealthCache?: { overview: SystemHealthOverview; timestamp: number }
  private readonly CACHE_TTL = 30000 // 30 seconds
  
  // Metrics tracking
  private metrics = {
    startTime: Date.now(),
    totalRequests: 0,
    totalResponseTime: 0,
    errorCount: 0
  }

  private constructor() {
    this.logger = new Logger('HealthCheck')
    this.database = DatabaseService.getInstance()
    this.eventBus = ERIPEventBus.getInstance()
    this.serviceRegistry = ERIPServiceRegistry.getInstance()
    this.trustEngine = TrustEquityEngine.getInstance()
  }

  static getInstance(): ERIPHealthCheck {
    if (!this.instance) {
      this.instance = new ERIPHealthCheck()
    }
    return this.instance
  }

  /**
   * Setup health check endpoints
   */
  setupHealthEndpoints(app: Express): void {
    // Basic health check
    app.get('/health', async (req: Request, res: Response) => {
      const startTime = Date.now()
      try {
        const result = await this.performBasicHealthCheck()
        const responseTime = Date.now() - startTime
        
        this.updateMetrics(responseTime, false)
        
        res.status(result.status === 'pass' ? 200 : 503).json({
          status: result.status,
          timestamp: result.timestamp,
          responseTime: result.responseTime,
          message: result.message,
          data: result.data
        })
        
      } catch (error) {
        const responseTime = Date.now() - startTime
        this.updateMetrics(responseTime, true)
        
        res.status(503).json({
          status: 'fail',
          timestamp: new Date(),
          responseTime,
          message: error instanceof Error ? error.message : 'Health check failed',
          error: process.env.NODE_ENV === 'development' ? error : undefined
        })
      }
    })

    // Detailed health check
    app.get('/health/detailed', async (req: Request, res: Response) => {
      try {
        const overview = await this.getSystemHealthOverview()
        const status = overview.status === 'healthy' ? 200 : 
                      overview.status === 'degraded' ? 200 : 503
        
        res.status(status).json(overview)
        
      } catch (error) {
        res.status(503).json({
          status: 'fail',
          timestamp: new Date(),
          message: 'Detailed health check failed',
          error: process.env.NODE_ENV === 'development' ? error : undefined
        })
      }
    })

    // Component-specific health check
    app.get('/health/component/:component', async (req: Request, res: Response) => {
      try {
        const component = req.params.component as ERIPComponent
        const health = await this.getComponentHealth(component)
        
        if (!health) {
          res.status(404).json({
            status: 'fail',
            message: `Component €{component} not found`
          })
          return
        }
        
        const status = health.status === 'healthy' ? 200 :
                      health.status === 'degraded' ? 200 : 503
        
        res.status(status).json(health)
        
      } catch (error) {
        res.status(503).json({
          status: 'fail',
          message: 'Component health check failed',
          error: process.env.NODE_ENV === 'development' ? error : undefined
        })
      }
    })

    // Readiness check
    app.get('/ready', async (req: Request, res: Response) => {
      try {
        const ready = await this.isSystemReady()
        res.status(ready ? 200 : 503).json({
          ready,
          timestamp: new Date(),
          message: ready ? 'System is ready' : 'System is not ready'
        })
        
      } catch (error) {
        res.status(503).json({
          ready: false,
          timestamp: new Date(),
          message: 'Readiness check failed',
          error: process.env.NODE_ENV === 'development' ? error : undefined
        })
      }
    })

    // Liveness check
    app.get('/live', (req: Request, res: Response) => {
      res.status(200).json({
        alive: true,
        timestamp: new Date(),
        uptime: Date.now() - this.metrics.startTime,
        message: 'Service is alive'
      })
    })

    // Metrics endpoint
    app.get('/health/metrics', (req: Request, res: Response) => {
      const uptime = Date.now() - this.metrics.startTime
      const averageResponseTime = this.metrics.totalRequests > 0 
        ? this.metrics.totalResponseTime / this.metrics.totalRequests 
        : 0
      const errorRate = this.metrics.totalRequests > 0
        ? (this.metrics.errorCount / this.metrics.totalRequests) * 100
        : 0

      res.json({
        uptime,
        totalRequests: this.metrics.totalRequests,
        averageResponseTime: Math.round(averageResponseTime * 100) / 100,
        errorRate: Math.round(errorRate * 100) / 100,
        errorCount: this.metrics.errorCount,
        timestamp: new Date()
      })
    })
  }

  /**
   * Perform basic health check
   */
  async performBasicHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now()
    
    try {
      // Check critical dependencies
      const checks = await Promise.allSettled([
        this.checkDatabase(),
        this.checkEventBus(),
        this.checkServiceRegistry()
      ])
      
      const results = checks.map((result, index) => ({
        name: ['database', 'eventBus', 'serviceRegistry'][index],
        success: result.status === 'fulfilled' && result.value.status === 'pass',
        result: result.status === 'fulfilled' ? result.value : null
      }))
      
      const allPassed = results.every(r => r.success)
      const somePasssed = results.some(r => r.success)
      
      const responseTime = Date.now() - startTime
      
      return {
        name: 'basic_health',
        status: allPassed ? 'pass' : somePasssed ? 'warn' : 'fail',
        responseTime,
        message: allPassed 
          ? 'All systems operational'
          : somePasssed 
            ? 'Some systems degraded'
            : 'Critical systems failing',
        data: {
          checks: results,
          passedChecks: results.filter(r => r.success).length,
          totalChecks: results.length
        },
        timestamp: new Date()
      }
      
    } catch (error) {
      return {
        name: 'basic_health',
        status: 'fail',
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }
  }

  /**
   * Get comprehensive system health overview
   */
  async getSystemHealthOverview(): Promise<SystemHealthOverview> {
    // Check cache
    if (this.systemHealthCache && 
        Date.now() - this.systemHealthCache.timestamp < this.CACHE_TTL) {
      return this.systemHealthCache.overview
    }
    
    try {
      const [
        databaseHealth,
        eventBusHealth,
        serviceRegistryHealth,
        trustEngineHealth
      ] = await Promise.allSettled([
        this.checkDatabase(),
        this.checkEventBus(),
        this.checkServiceRegistry(),
        this.checkTrustEngine()
      ])
      
      const infrastructure = {
        database: this.getResultFromSettled(databaseHealth, 'database'),
        eventBus: this.getResultFromSettled(eventBusHealth, 'eventBus'),
        serviceRegistry: this.getResultFromSettled(serviceRegistryHealth, 'serviceRegistry'),
        trustEngine: this.getResultFromSettled(trustEngineHealth, 'trustEngine')
      }
      
      // Get component health
      const components = await this.getAllComponentHealth()
      
      // Calculate overall score
      const infrastructureScore = this.calculateInfrastructureScore(infrastructure)
      const componentScore = this.calculateComponentScore(components)
      const overallScore = Math.round((infrastructureScore + componentScore) / 2)
      
      // Determine overall status
      const overallStatus = overallScore >= 80 ? 'healthy' :
                           overallScore >= 50 ? 'degraded' : 'unhealthy'
      
      const uptime = Date.now() - this.metrics.startTime
      const averageResponseTime = this.metrics.totalRequests > 0 
        ? this.metrics.totalResponseTime / this.metrics.totalRequests 
        : 0
      const errorRate = this.metrics.totalRequests > 0
        ? (this.metrics.errorCount / this.metrics.totalRequests) * 100
        : 0
      
      const overview: SystemHealthOverview = {
        status: overallStatus,
        overallScore,
        timestamp: new Date(),
        components,
        infrastructure,
        metrics: {
          totalRequests: this.metrics.totalRequests,
          averageResponseTime: Math.round(averageResponseTime * 100) / 100,
          errorRate: Math.round(errorRate * 100) / 100,
          uptime
        }
      }
      
      // Cache the result
      this.systemHealthCache = { overview, timestamp: Date.now() }
      
      return overview
      
    } catch (error) {
      this.logger.error('Failed to get system health overview', { error })
      throw error
    }
  }

  /**
   * Get health status for a specific component
   */
  async getComponentHealth(component: ERIPComponent): Promise<ComponentHealthStatus | null> {
    try {
      const services = await this.serviceRegistry.getServicesForComponent(component)
      
      if (services.length === 0) {
        return {
          component,
          status: 'offline',
          overallScore: 0,
          checks: [],
          lastCheck: new Date(),
          uptime: 0,
          version: 'unknown',
          dependencies: []
        }
      }
      
      // Aggregate health from all service instances
      const allChecks: HealthCheckResult[] = []
      let totalScore = 0
      let totalUptime = 0
      
      for (const service of services) {
        const healthHistory = await this.serviceRegistry.getHealthHistory(service.id, 1)
        
        if (healthHistory.length > 0) {
          const latestHealth = healthHistory[0]
          allChecks.push(...latestHealth.checks.map(check => ({
            ...check,
            timestamp: latestHealth.timestamp
          })))
          
          const serviceScore = this.calculateServiceScore(latestHealth)
          totalScore += serviceScore
          totalUptime += Date.now() - service.registeredAt.getTime()
        }
      }
      
      const averageScore = services.length > 0 ? totalScore / services.length : 0
      const averageUptime = services.length > 0 ? totalUptime / services.length : 0
      
      const status = averageScore >= 80 ? 'healthy' :
                    averageScore >= 50 ? 'degraded' : 
                    averageScore > 0 ? 'unhealthy' : 'offline'
      
      // Get component dependencies
      const dependencies = await this.getComponentDependencies(component)
      
      return {
        component,
        status,
        overallScore: Math.round(averageScore),
        checks: allChecks,
        lastCheck: new Date(),
        uptime: averageUptime,
        version: services[0]?.version || 'unknown',
        dependencies
      }
      
    } catch (error) {
      this.logger.error('Failed to get component health', { component, error })
      return null
    }
  }

  /**
   * Check if system is ready to serve requests
   */
  async isSystemReady(): Promise<boolean> {
    try {
      const basicHealth = await this.performBasicHealthCheck()
      return basicHealth.status === 'pass' || basicHealth.status === 'warn'
    } catch {
      return false
    }
  }

  /**
   * Individual health check methods
   */
  private async checkDatabase(): Promise<HealthCheckResult> {
    const cacheKey = 'database'
    const cached = this.healthCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result
    }
    
    const startTime = Date.now()
    
    try {
      // Test basic connectivity
      await this.database.testConnection()
      
      // Test query performance
      const queryStartTime = Date.now()
      await this.database.healthCheckQuery()
      const queryTime = Date.now() - queryStartTime
      
      const responseTime = Date.now() - startTime
      
      const result: HealthCheckResult = {
        name: 'database',
        status: queryTime < 100 ? 'pass' : queryTime < 500 ? 'warn' : 'fail',
        responseTime,
        message: `Database query completed in €{queryTime}ms`,
        data: {
          queryTime,
          connectionPool: await this.database.getConnectionPoolStats()
        },
        timestamp: new Date()
      }
      
      this.healthCache.set(cacheKey, { result, timestamp: Date.now() })
      return result
      
    } catch (error) {
      const result: HealthCheckResult = {
        name: 'database',
        status: 'fail',
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Database connection failed',
        timestamp: new Date()
      }
      
      this.healthCache.set(cacheKey, { result, timestamp: Date.now() })
      return result
    }
  }

  private async checkEventBus(): Promise<HealthCheckResult> {
    const cacheKey = 'eventBus'
    const cached = this.healthCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result
    }
    
    const startTime = Date.now()
    
    try {
      // Test event bus connectivity by publishing a test event
      await this.eventBus.publish({
        eventId: `health_check_€{Date.now()}`,
        source: 'health_check',
        type: 'health.test',
        timestamp: new Date().toISOString(),
        data: { test: true }
      })
      
      const responseTime = Date.now() - startTime
      
      const result: HealthCheckResult = {
        name: 'eventBus',
        status: responseTime < 50 ? 'pass' : responseTime < 200 ? 'warn' : 'fail',
        responseTime,
        message: `Event bus responding in €{responseTime}ms`,
        data: {
          publishTime: responseTime
        },
        timestamp: new Date()
      }
      
      this.healthCache.set(cacheKey, { result, timestamp: Date.now() })
      return result
      
    } catch (error) {
      const result: HealthCheckResult = {
        name: 'eventBus',
        status: 'fail',
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Event bus failed',
        timestamp: new Date()
      }
      
      this.healthCache.set(cacheKey, { result, timestamp: Date.now() })
      return result
    }
  }

  private async checkServiceRegistry(): Promise<HealthCheckResult> {
    const cacheKey = 'serviceRegistry'
    const cached = this.healthCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result
    }
    
    const startTime = Date.now()
    
    try {
      const stats = await this.serviceRegistry.getRegistryStats()
      const responseTime = Date.now() - startTime
      
      const result: HealthCheckResult = {
        name: 'serviceRegistry',
        status: responseTime < 100 ? 'pass' : responseTime < 300 ? 'warn' : 'fail',
        responseTime,
        message: `Service registry has €{stats.totalServices} registered services`,
        data: stats,
        timestamp: new Date()
      }
      
      this.healthCache.set(cacheKey, { result, timestamp: Date.now() })
      return result
      
    } catch (error) {
      const result: HealthCheckResult = {
        name: 'serviceRegistry',
        status: 'fail',
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Service registry failed',
        timestamp: new Date()
      }
      
      this.healthCache.set(cacheKey, { result, timestamp: Date.now() })
      return result
    }
  }

  private async checkTrustEngine(): Promise<HealthCheckResult> {
    const cacheKey = 'trustEngine'
    const cached = this.healthCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result
    }
    
    const startTime = Date.now()
    
    try {
      // Test trust engine by getting metrics for a test entity
      const testEntityId = 'health-check-test'
      
      await this.trustEngine.getTrustEquityMetrics(testEntityId, 'organization')
      
      const responseTime = Date.now() - startTime
      
      const result: HealthCheckResult = {
        name: 'trustEngine',
        status: responseTime < 200 ? 'pass' : responseTime < 500 ? 'warn' : 'fail',
        responseTime,
        message: `Trust engine responding in €{responseTime}ms`,
        data: {
          calculationTime: responseTime
        },
        timestamp: new Date()
      }
      
      this.healthCache.set(cacheKey, { result, timestamp: Date.now() })
      return result
      
    } catch (error) {
      const result: HealthCheckResult = {
        name: 'trustEngine',
        status: 'fail',
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Trust engine failed',
        timestamp: new Date()
      }
      
      this.healthCache.set(cacheKey, { result, timestamp: Date.now() })
      return result
    }
  }

  /**
   * Helper methods
   */
  private async getAllComponentHealth(): Promise<ComponentHealthStatus[]> {
    const components: ERIPComponent[] = [
      'compass', 'atlas', 'prism', 'pulse', 
      'cipher', 'nexus', 'beacon', 'clearance'
    ]
    
    const healthResults = await Promise.allSettled(
      components.map(component => this.getComponentHealth(component))
    )
    
    return healthResults
      .map(result => result.status === 'fulfilled' ? result.value : null)
      .filter((health): health is ComponentHealthStatus => health !== null)
  }

  private async getComponentDependencies(component: ERIPComponent): Promise<ComponentDependency[]> {
    const dependencies: ComponentDependency[] = []
    
    // Add common dependencies
    dependencies.push(
      {
        name: 'PostgreSQL Database',
        type: 'database',
        status: 'available', // Would be determined by actual checks
        lastCheck: new Date()
      },
      {
        name: 'Redis Event Bus',
        type: 'redis',
        status: 'available',
        lastCheck: new Date()
      }
    )
    
    // Add component-specific dependencies
    switch (component) {
      case 'atlas':
        dependencies.push({
          name: 'Vulnerability Scanner API',
          type: 'external_api',
          status: 'available',
          lastCheck: new Date()
        })
        break
      
      case 'nexus':
        dependencies.push({
          name: 'Threat Intelligence Feeds',
          type: 'external_api',
          status: 'available',
          lastCheck: new Date()
        })
        break
      
      case 'beacon':
        dependencies.push({
          name: 'Analytics Service',
          type: 'service',
          status: 'available',
          lastCheck: new Date()
        })
        break
    }
    
    return dependencies
  }

  private getResultFromSettled(
    settled: PromiseSettledResult<HealthCheckResult>, 
    name: string
  ): HealthCheckResult {
    if (settled.status === 'fulfilled') {
      return settled.value
    } else {
      return {
        name,
        status: 'fail',
        responseTime: 0,
        message: settled.reason?.message || 'Check failed',
        timestamp: new Date()
      }
    }
  }

  private calculateInfrastructureScore(infrastructure: SystemHealthOverview['infrastructure']): number {
    const scores = Object.values(infrastructure).map(check => {
      switch (check.status) {
        case 'pass': return 100
        case 'warn': return 70
        case 'fail': return 0
        default: return 50
      }
    })
    
    return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0
  }

  private calculateComponentScore(components: ComponentHealthStatus[]): number {
    if (components.length === 0) return 0
    
    const totalScore = components.reduce((sum, component) => sum + component.overallScore, 0)
    return totalScore / components.length
  }

  private calculateServiceScore(healthCheck: any): number {
    const passedChecks = healthCheck.checks.filter((c: any) => c.status === 'pass').length
    const totalChecks = healthCheck.checks.length
    
    if (totalChecks === 0) return 50 // Neutral score for no checks
    
    const checkScore = (passedChecks / totalChecks) * 100
    
    // Adjust based on response time
    const responseTimePenalty = Math.min(healthCheck.responseTime / 10, 20) // Max 20 point penalty
    
    return Math.max(0, Math.min(100, checkScore - responseTimePenalty))
  }

  private updateMetrics(responseTime: number, isError: boolean): void {
    this.metrics.totalRequests++
    this.metrics.totalResponseTime += responseTime
    
    if (isError) {
      this.metrics.errorCount++
    }
  }
}

/**
 * Health check router for Express
 */
import { Router } from 'express'

export const healthCheckRouter = Router()

healthCheckRouter.get('/', async (req: Request, res: Response) => {
  const healthService = ERIPHealthCheckService.getInstance()
  
  try {
    const status = await healthService.checkComponentHealth()
    const overallHealth = status.every(component => component.status === 'healthy')
    
    res.status(overallHealth ? 200 : 503).json({
      status: overallHealth ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      components: status,
      summary: {
        total: status.length,
        healthy: status.filter(c => c.status === 'healthy').length,
        degraded: status.filter(c => c.status === 'degraded').length,
        unhealthy: status.filter(c => c.status === 'unhealthy').length,
        offline: status.filter(c => c.status === 'offline').length
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

healthCheckRouter.get('/component/:component', async (req: Request, res: Response) => {
  const healthService = ERIPHealthCheckService.getInstance()
  
  try {
    const componentName = req.params.component as ERIPComponent
    const status = await healthService.checkSpecificComponent(componentName)
    
    res.status(status.status === 'healthy' ? 200 : 503).json(status)
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Component health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})