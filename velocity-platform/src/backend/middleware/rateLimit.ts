/**
 * Rate Limiting Middleware
 * Advanced rate limiting with different strategies
 */

import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD
});

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum requests per window
  message?: string;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
  handler?: (req: Request, res: Response) => void;
  onLimitReached?: (req: Request, res: Response) => void;
  trustScore?: {
    enabled: boolean;
    multiplier: number; // Higher trust = higher limit
  };
}

/**
 * Advanced rate limiter with trust score integration
 */
export function rateLimit(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    message = 'Too many requests',
    keyGenerator = defaultKeyGenerator,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    standardHeaders = true,
    legacyHeaders = false,
    handler = defaultHandler,
    onLimitReached,
    trustScore = { enabled: false, multiplier: 1.5 }
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = keyGenerator(req);
      const now = Date.now();
      const window = Math.floor(now / windowMs);
      const redisKey = `rate_limit:${key}:${window}`;

      // Get current count
      const current = await redis.incr(redisKey);
      
      // Set expiry on first request in window
      if (current === 1) {
        await redis.pexpire(redisKey, windowMs);
      }

      // Calculate effective limit based on trust score
      let effectiveLimit = max;
      if (trustScore.enabled && req.user?.trustScore) {
        effectiveLimit = Math.floor(max * (1 + (req.user.trustScore - 0.5) * trustScore.multiplier));
      }

      const remaining = Math.max(0, effectiveLimit - current);
      const resetTime = new Date((window + 1) * windowMs);

      // Set headers
      if (standardHeaders) {
        res.set({
          'RateLimit-Limit': effectiveLimit.toString(),
          'RateLimit-Remaining': remaining.toString(),
          'RateLimit-Reset': resetTime.toISOString()
        });
      }

      if (legacyHeaders) {
        res.set({
          'X-RateLimit-Limit': effectiveLimit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(resetTime.getTime() / 1000).toString()
        });
      }

      // Check if limit exceeded
      if (current > effectiveLimit) {
        // Log rate limit violation
        await logRateLimitViolation(req, key, current, effectiveLimit);
        
        if (onLimitReached) {
          onLimitReached(req, res);
        }
        
        return handler(req, res);
      }

      // Hook into response to track success/failure
      const originalSend = res.send;
      res.send = function(body) {
        const statusCode = res.statusCode;
        
        // Decrement counter for successful requests if configured
        if (skipSuccessfulRequests && statusCode < 400) {
          redis.decr(redisKey).catch(console.error);
        }
        
        // Decrement counter for failed requests if configured
        if (skipFailedRequests && statusCode >= 400) {
          redis.decr(redisKey).catch(console.error);
        }
        
        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      next(); // Continue on error
    }
  };
}

/**
 * Sliding window rate limiter
 */
export function slidingWindowRateLimit(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    message = 'Too many requests',
    keyGenerator = defaultKeyGenerator,
    handler = defaultHandler,
    trustScore = { enabled: false, multiplier: 1.5 }
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = keyGenerator(req);
      const now = Date.now();
      const redisKey = `sliding_rate_limit:${key}`;

      // Remove old entries
      await redis.zremrangebyscore(redisKey, 0, now - windowMs);

      // Count current requests in window
      const current = await redis.zcard(redisKey);

      // Calculate effective limit
      let effectiveLimit = max;
      if (trustScore.enabled && req.user?.trustScore) {
        effectiveLimit = Math.floor(max * (1 + (req.user.trustScore - 0.5) * trustScore.multiplier));
      }

      if (current >= effectiveLimit) {
        await logRateLimitViolation(req, key, current, effectiveLimit);
        return handler(req, res);
      }

      // Add current request
      await redis.zadd(redisKey, now, `${now}-${Math.random()}`);
      await redis.expire(redisKey, Math.ceil(windowMs / 1000));

      // Set headers
      res.set({
        'RateLimit-Limit': effectiveLimit.toString(),
        'RateLimit-Remaining': Math.max(0, effectiveLimit - current - 1).toString(),
        'RateLimit-Reset': new Date(now + windowMs).toISOString()
      });

      next();
    } catch (error) {
      console.error('Sliding window rate limiting error:', error);
      next();
    }
  };
}

/**
 * Adaptive rate limiter based on system load
 */
export function adaptiveRateLimit(baseOptions: RateLimitOptions) {
  let currentMultiplier = 1;
  
  // Monitor system load every 30 seconds
  setInterval(async () => {
    try {
      const load = await getSystemLoad();
      
      if (load > 0.8) {
        currentMultiplier = 0.5; // Reduce limits by 50% under high load
      } else if (load > 0.6) {
        currentMultiplier = 0.75; // Reduce limits by 25% under medium load
      } else {
        currentMultiplier = 1; // Normal limits under low load
      }
    } catch (error) {
      console.error('Failed to update adaptive rate limits:', error);
    }
  }, 30000);

  return rateLimit({
    ...baseOptions,
    max: Math.floor(baseOptions.max * currentMultiplier)
  });
}

/**
 * Distributed rate limiter for multiple instances
 */
export function distributedRateLimit(options: RateLimitOptions) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = options.keyGenerator?.(req) || defaultKeyGenerator(req);
      const script = `
        local key = KEYS[1]
        local window = ARGV[1]
        local limit = ARGV[2]
        local now = ARGV[3]
        
        local current = redis.call('GET', key)
        if current == false then
          current = 0
        else
          current = tonumber(current)
        end
        
        if current < tonumber(limit) then
          redis.call('INCR', key)
          redis.call('EXPIRE', key, window)
          return {current + 1, tonumber(limit) - current - 1}
        else
          return {current, 0}
        end
      `;

      const windowSeconds = Math.ceil(options.windowMs / 1000);
      let effectiveLimit = options.max;
      
      if (options.trustScore?.enabled && req.user?.trustScore) {
        effectiveLimit = Math.floor(options.max * (1 + (req.user.trustScore - 0.5) * options.trustScore.multiplier));
      }

      const result = await redis.eval(
        script,
        1,
        `distributed_rate_limit:${key}`,
        windowSeconds.toString(),
        effectiveLimit.toString(),
        Date.now().toString()
      ) as [number, number];

      const [current, remaining] = result;

      // Set headers
      res.set({
        'RateLimit-Limit': effectiveLimit.toString(),
        'RateLimit-Remaining': remaining.toString()
      });

      if (remaining === 0) {
        await logRateLimitViolation(req, key, current, effectiveLimit);
        return (options.handler || defaultHandler)(req, res);
      }

      next();
    } catch (error) {
      console.error('Distributed rate limiting error:', error);
      next();
    }
  };
}

/**
 * Brute force protection for authentication endpoints
 */
export function bruteForceProtection(options?: {
  maxAttempts?: number;
  windowMs?: number;
  blockDuration?: number;
}) {
  const {
    maxAttempts = 5,
    windowMs = 15 * 60 * 1000, // 15 minutes
    blockDuration = 30 * 60 * 1000 // 30 minutes
  } = options || {};

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const identifier = req.body?.email || req.body?.username || req.ip;
      const key = `brute_force:${identifier}`;
      const blockKey = `brute_force_block:${identifier}`;

      // Check if currently blocked
      const blocked = await redis.get(blockKey);
      if (blocked) {
        const ttl = await redis.ttl(blockKey);
        return res.status(429).json({
          error: 'Account temporarily blocked',
          retryAfter: ttl,
          message: 'Too many failed attempts. Please try again later.'
        });
      }

      // Hook into response to track failures
      const originalJson = res.json;
      res.json = function(data) {
        const statusCode = res.statusCode;
        
        if (statusCode === 401 || statusCode === 403) {
          // Failed authentication
          incrementFailedAttempts(key, blockKey, maxAttempts, windowMs, blockDuration);
        } else if (statusCode === 200) {
          // Successful authentication - clear failures
          redis.del(key).catch(console.error);
        }
        
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Brute force protection error:', error);
      next();
    }
  };
}

/**
 * IP-based rate limiting with geolocation
 */
export function geoRateLimit(options: RateLimitOptions & {
  highRiskCountries?: string[];
  highRiskMultiplier?: number;
}) {
  const {
    highRiskCountries = ['CN', 'RU', 'IR', 'KP'],
    highRiskMultiplier = 0.5,
    ...rateLimitOptions
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get country from IP (would integrate with GeoIP service)
      const country = await getCountryFromIP(req.ip);
      
      let adjustedMax = rateLimitOptions.max;
      if (highRiskCountries.includes(country)) {
        adjustedMax = Math.floor(rateLimitOptions.max * highRiskMultiplier);
      }

      return rateLimit({
        ...rateLimitOptions,
        max: adjustedMax
      })(req, res, next);
    } catch (error) {
      console.error('Geo rate limiting error:', error);
      return rateLimit(rateLimitOptions)(req, res, next);
    }
  };
}

// Helper functions

function defaultKeyGenerator(req: Request): string {
  return req.user?.id || req.ip;
}

function defaultHandler(req: Request, res: Response): void {
  res.status(429).json({
    error: 'Too many requests',
    message: 'You have exceeded the rate limit. Please try again later.',
    retryAfter: '60s'
  });
}

async function logRateLimitViolation(
  req: Request,
  key: string,
  current: number,
  limit: number
): Promise<void> {
  try {
    const violation = {
      key,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      current,
      limit,
      userId: req.user?.id,
      timestamp: new Date()
    };

    // Store in Redis for immediate analysis
    await redis.lpush('rate_limit_violations', JSON.stringify(violation));
    await redis.ltrim('rate_limit_violations', 0, 999); // Keep last 1000

    // Log to console
    console.warn('Rate limit violation:', violation);
  } catch (error) {
    console.error('Failed to log rate limit violation:', error);
  }
}

async function incrementFailedAttempts(
  key: string,
  blockKey: string,
  maxAttempts: number,
  windowMs: number,
  blockDuration: number
): Promise<void> {
  try {
    const attempts = await redis.incr(key);
    
    if (attempts === 1) {
      await redis.pexpire(key, windowMs);
    }
    
    if (attempts >= maxAttempts) {
      await redis.setex(blockKey, Math.ceil(blockDuration / 1000), 'blocked');
      await redis.del(key); // Clear attempts counter
    }
  } catch (error) {
    console.error('Failed to increment failed attempts:', error);
  }
}

async function getSystemLoad(): Promise<number> {
  // Simplified system load calculation
  // In production, would monitor CPU, memory, Redis, database, etc.
  try {
    const info = await redis.info('memory');
    const memoryMatch = info.match(/used_memory_rss:(\d+)/);
    if (memoryMatch) {
      const usedMemory = parseInt(memoryMatch[1]);
      const maxMemory = 1024 * 1024 * 1024; // 1GB threshold
      return Math.min(1, usedMemory / maxMemory);
    }
    return 0.5; // Default moderate load
  } catch {
    return 0.5;
  }
}

async function getCountryFromIP(ip: string): Promise<string> {
  // Mock implementation - would integrate with GeoIP service
  return 'US';
}

// Pre-configured rate limiters for common use cases

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts',
  trustScore: { enabled: false, multiplier: 1 } // No trust bonus for auth
});

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'API rate limit exceeded',
  trustScore: { enabled: true, multiplier: 2 } // Higher trust = more API calls
});

export const sensitiveActionRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 sensitive actions per hour
  message: 'Too many sensitive operations',
  trustScore: { enabled: true, multiplier: 1.5 }
});

export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: 'Upload limit exceeded',
  skipSuccessfulRequests: false,
  skipFailedRequests: true // Don't count failed uploads
});

export { bruteForceProtection as authBruteForceProtection };