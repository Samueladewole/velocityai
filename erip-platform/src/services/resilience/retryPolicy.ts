/**
 * Retry Policy Implementation with Exponential Backoff
 * 
 * Provides intelligent retry mechanisms for transient failures
 * in distributed ERIP platform operations
 */

export interface BackoffStrategy {
  calculateDelay(attempt: number): number
}

export class ExponentialBackoff implements BackoffStrategy {
  constructor(
    private config: {
      initialDelay: number
      maxDelay: number
      multiplier: number
      jitter?: boolean
    }
  ) {}

  calculateDelay(attempt: number): number {
    const delay = this.config.initialDelay * Math.pow(this.config.multiplier, attempt - 1)
    const cappedDelay = Math.min(delay, this.config.maxDelay)
    
    if (this.config.jitter) {
      // Add jitter to prevent thundering herd
      return cappedDelay * (0.5 + Math.random() * 0.5)
    }
    
    return cappedDelay
  }
}

export interface RetryPolicyConfig {
  maxAttempts: number
  backoff: BackoffStrategy
  retryableErrors: string[]
  onRetry?: (error: Error, attempt: number) => void
}

export class RetryPolicy {
  constructor(private config: RetryPolicyConfig) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error
    
    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (!this.isRetryableError(error as Error) || attempt === this.config.maxAttempts) {
          throw error
        }
        
        if (this.config.onRetry) {
          this.config.onRetry(error as Error, attempt)
        }
        
        const delay = this.config.backoff.calculateDelay(attempt)
        await this.sleep(delay)
      }
    }
    
    throw lastError!
  }

  private isRetryableError(error: Error): boolean {
    return this.config.retryableErrors.some(retryableError => 
      error.message.includes(retryableError) || 
      error.name.includes(retryableError)
    )
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}