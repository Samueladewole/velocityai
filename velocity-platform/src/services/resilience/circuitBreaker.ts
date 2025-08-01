/**
 * Circuit Breaker Pattern Implementation
 * 
 * Provides fault tolerance and prevents cascading failures
 * across microservices in the ERIP platform
 */

export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

export interface CircuitBreakerConfig {
  failureThreshold: number      // Number of failures to trip the circuit
  timeout: number              // Timeout for requests in ms
  resetTimeout?: number        // Time before attempting to close circuit again
  monitoringPeriod: number     // Time window for failure counting
  fallback?: (error: Error) => Promise<any>
}

export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED
  private failureCount: number = 0
  private lastFailureTime: number = 0
  private nextAttempt: number = 0
  private config: Required<CircuitBreakerConfig>

  constructor(config: CircuitBreakerConfig) {
    this.config = {
      ...config,
      resetTimeout: config.resetTimeout || 60000,
      fallback: config.fallback || this.defaultFallback
    }
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitBreakerState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        return this.config.fallback(new Error('Circuit breaker is OPEN'))
      } else {
        this.state = CircuitBreakerState.HALF_OPEN
      }
    }

    try {
      const result = await Promise.race([
        operation(),
        this.timeoutPromise()
      ])

      this.onSuccess()
      return result as T
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private async timeoutPromise(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timeout')), this.config.timeout)
    })
  }

  private onSuccess(): void {
    this.failureCount = 0
    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.state = CircuitBreakerState.CLOSED
    }
  }

  private onFailure(): void {
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.state = CircuitBreakerState.OPEN
      this.nextAttempt = Date.now() + this.config.resetTimeout
    } else if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitBreakerState.OPEN
      this.nextAttempt = Date.now() + this.config.resetTimeout
    }
  }

  private async defaultFallback(error: Error): Promise<any> {
    throw new Error(`Circuit breaker fallback: €{error.message}`)
  }

  public getState(): CircuitBreakerState {
    return this.state
  }

  public getFailureCount(): number {
    return this.failureCount
  }

  public shutdown(): void {
    this.state = CircuitBreakerState.CLOSED
    this.failureCount = 0
  }
}