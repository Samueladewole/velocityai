/**
 * Health Checker for ERIP Platform Services
 * 
 * Provides comprehensive health monitoring and status reporting
 * for all platform components and dependencies
 */

export interface HealthCheck {
  name: string
  check: () => Promise<{ status: 'healthy' | 'unhealthy'; details?: string }>
  timeout?: number
  interval?: number
}

export interface HealthStatus {
  service: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  checks: HealthCheckResult[]
  uptime: number
}

export interface HealthCheckResult {
  name: string
  status: 'healthy' | 'unhealthy'
  duration: number
  details?: string
  lastUpdated: string
}

export interface HealthCheckerConfig {
  interval: number
  checks: HealthCheck[]
  onStatusChange?: (status: HealthStatus) => void
}

export class HealthChecker {
  private checkResults: Map<string, HealthCheckResult> = new Map()
  private checkTimer?: NodeJS.Timeout
  private startTime = Date.now()

  constructor(private config: HealthCheckerConfig) {
    this.startHealthChecks()
  }

  private startHealthChecks(): void {
    // Run initial checks
    this.runAllChecks()

    // Schedule periodic checks
    this.checkTimer = setInterval(
      () => this.runAllChecks(),
      this.config.interval
    )
  }

  private async runAllChecks(): Promise<void> {
    const checkPromises = this.config.checks.map(async (check) => {
      try {
        const startTime = Date.now()
        
        // Apply timeout if specified
        const timeout = check.timeout || 5000
        const checkPromise = check.check()
        const timeoutPromise = new Promise<{ status: 'unhealthy'; details: string }>((_, reject) => {
          setTimeout(() => reject(new Error('Health check timeout')), timeout)
        })

        const result = await Promise.race([checkPromise, timeoutPromise])
        const duration = Date.now() - startTime

        this.checkResults.set(check.name, {
          name: check.name,
          status: result.status,
          duration,
          details: result.details,
          lastUpdated: new Date().toISOString()
        })

      } catch (error) {
        this.checkResults.set(check.name, {
          name: check.name,
          status: 'unhealthy',
          duration: Date.now() - Date.now(), // Approximate
          details: error instanceof Error ? error.message : 'Unknown error',
          lastUpdated: new Date().toISOString()
        })
      }
    })

    await Promise.allSettled(checkPromises)

    // Trigger status change callback if configured
    if (this.config.onStatusChange) {
      const status = this.getOverallStatus()
      this.config.onStatusChange(status)
    }
  }

  public getOverallStatus(): HealthStatus {
    const checks = Array.from(this.checkResults.values())
    const healthyChecks = checks.filter(check => check.status === 'healthy')
    const unhealthyChecks = checks.filter(check => check.status === 'unhealthy')

    let overallStatus: 'healthy' | 'unhealthy' | 'degraded'
    
    if (unhealthyChecks.length === 0) {
      overallStatus = 'healthy'
    } else if (healthyChecks.length === 0) {
      overallStatus = 'unhealthy'
    } else {
      overallStatus = 'degraded'
    }

    return {
      service: 'erip-platform',
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks,
      uptime: Date.now() - this.startTime
    }
  }

  public getCheckStatus(checkName: string): HealthCheckResult | undefined {
    return this.checkResults.get(checkName)
  }

  public async runSingleCheck(checkName: string): Promise<HealthCheckResult | null> {
    const check = this.config.checks.find(c => c.name === checkName)
    if (!check) return null

    try {
      const startTime = Date.now()
      const result = await check.check()
      const duration = Date.now() - startTime

      const checkResult: HealthCheckResult = {
        name: check.name,
        status: result.status,
        duration,
        details: result.details,
        lastUpdated: new Date().toISOString()
      }

      this.checkResults.set(check.name, checkResult)
      return checkResult

    } catch (error) {
      const checkResult: HealthCheckResult = {
        name: check.name,
        status: 'unhealthy',
        duration: 0,
        details: error instanceof Error ? error.message : 'Unknown error',
        lastUpdated: new Date().toISOString()
      }

      this.checkResults.set(check.name, checkResult)
      return checkResult
    }
  }

  shutdown(): void {
    if (this.checkTimer) {
      clearInterval(this.checkTimer)
    }
  }
}