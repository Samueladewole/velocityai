/**
 * Rate Limiter Implementation
 * 
 * Provides protection against overload and abuse
 * with sliding window rate limiting
 */

import { ERIPEvent } from '../../infrastructure/events/schemas'

export interface RateLimiterConfig {
  windowMs: number
  maxRequests: number
  keyGenerator: (event: ERIPEvent) => string
  skipSuccessfulRequests: boolean
  onLimitReached?: (key: string) => void
}

interface WindowEntry {
  count: number
  resetTime: number
}

export class RateLimiter {
  private windows: Map<string, WindowEntry> = new Map()
  private cleanupInterval: NodeJS.Timeout

  constructor(private config: RateLimiterConfig) {
    // Cleanup expired windows every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000)
  }

  allowRequest(event: ERIPEvent): boolean {
    const key = this.config.keyGenerator(event)
    const now = Date.now()
    
    let window = this.windows.get(key)
    
    if (!window || now >= window.resetTime) {
      // Create new window
      window = {
        count: 0,
        resetTime: now + this.config.windowMs
      }
      this.windows.set(key, window)
    }
    
    if (window.count >= this.config.maxRequests) {
      if (this.config.onLimitReached) {
        this.config.onLimitReached(key)
      }
      return false
    }
    
    window.count++
    return true
  }

  private cleanup(): void {
    const now = Date.now()
    
    for (const [key, window] of this.windows.entries()) {
      if (now >= window.resetTime) {
        this.windows.delete(key)
      }
    }
  }

  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}