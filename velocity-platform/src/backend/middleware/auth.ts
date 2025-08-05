/**
 * Authentication Middleware
 * JWT-based authentication with Zero Trust integration
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import Redis from 'ioredis';

const db = new Pool({
  connectionString: process.env.DATABASE_URL
});

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD
});

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  mfaEnabled: boolean;
  sessionId: string;
  deviceId: string;
  trustScore: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      session?: {
        id: string;
        deviceId: string;
        trustScore: number;
        restrictions?: string[];
      };
    }
  }
}

/**
 * Main authentication middleware
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Check if session is still valid in Redis
    const sessionKey = `session:${decoded.sessionId}`;
    const sessionData = await redis.get(sessionKey);

    if (!sessionData) {
      return res.status(401).json({ error: 'Session expired' });
    }

    const session = JSON.parse(sessionData);

    // Check if session is blocked
    if (session.blocked) {
      return res.status(403).json({ error: 'Session blocked due to security concerns' });
    }

    // Get user from database
    const userResult = await db.query(
      `SELECT u.*, utp.current_trust_score 
       FROM users u
       LEFT JOIN user_trust_profiles utp ON u.id = utp.user_id
       WHERE u.id = $1`,
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Update session activity
    await redis.expire(sessionKey, 7200); // Extend for 2 hours
    await redis.hset(sessionKey, 'lastActivity', Date.now().toString());

    // Set user and session on request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role || 'user',
      mfaEnabled: user.mfa_enabled || false,
      sessionId: decoded.sessionId,
      deviceId: session.deviceId,
      trustScore: user.current_trust_score || 0.5
    };

    req.session = {
      id: decoded.sessionId,
      deviceId: session.deviceId,
      trustScore: user.current_trust_score || 0.5,
      restrictions: session.restrictions
    };

    // Log access for security monitoring
    logAccess(req);

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Require MFA for sensitive operations
 */
export const requireMFA = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Check if user has MFA enabled
  if (!req.user.mfaEnabled) {
    return res.status(403).json({ 
      error: 'MFA required',
      action: 'setup_mfa',
      message: 'This operation requires multi-factor authentication'
    });
  }

  // Check if session has recent MFA verification
  const mfaKey = `mfa:${req.user.sessionId}`;
  const mfaVerified = await redis.get(mfaKey);

  if (!mfaVerified) {
    return res.status(403).json({
      error: 'MFA verification required',
      action: 'verify_mfa',
      message: 'Please verify with MFA to continue'
    });
  }

  next();
};

/**
 * Trust-based access control
 */
export const requireTrustLevel = (minTrustScore: number) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || !req.session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (req.session.trustScore < minTrustScore) {
      return res.status(403).json({
        error: 'Insufficient trust level',
        required: minTrustScore,
        current: req.session.trustScore,
        message: 'Your current trust score is too low for this operation'
      });
    }

    next();
  };
};

/**
 * Check for session restrictions
 */
export const checkRestrictions = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (req.session.restrictions && req.session.restrictions.includes(requiredPermission)) {
      return res.status(403).json({
        error: 'Access restricted',
        restriction: requiredPermission,
        message: 'Your session has restricted access to this resource'
      });
    }

    next();
  };
};

/**
 * Role-based access control
 */
export const requireRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

/**
 * API key authentication for service-to-service
 */
export const authenticateAPIKey = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  try {
    // Validate API key
    const keyResult = await db.query(
      `SELECT * FROM api_keys 
       WHERE key_hash = crypt($1, key_hash) 
       AND active = true 
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [apiKey]
    );

    if (keyResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    const apiKeyData = keyResult.rows[0];

    // Update last used
    await db.query(
      `UPDATE api_keys SET last_used_at = NOW() WHERE id = $1`,
      [apiKeyData.id]
    );

    // Set service context
    req.user = {
      id: apiKeyData.service_id,
      email: `service-${apiKeyData.service_name}@system`,
      role: 'service',
      mfaEnabled: false,
      sessionId: `api-${apiKeyData.id}`,
      deviceId: 'api',
      trustScore: 1.0 // Services are trusted
    };

    next();
  } catch (error) {
    console.error('API key authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Log access for security monitoring
 */
async function logAccess(req: Request): Promise<void> {
  try {
    const logEntry = {
      userId: req.user!.id,
      sessionId: req.user!.sessionId,
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date()
    };

    // Store in Redis for real-time monitoring
    await redis.lpush('access_log', JSON.stringify(logEntry));
    await redis.ltrim('access_log', 0, 9999); // Keep last 10k entries

    // Async write to database for long-term storage
    setImmediate(async () => {
      try {
        await db.query(
          `INSERT INTO access_logs 
           (user_id, session_id, method, path, ip_address, user_agent, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            logEntry.userId,
            logEntry.sessionId,
            logEntry.method,
            logEntry.path,
            logEntry.ip,
            logEntry.userAgent,
            logEntry.timestamp
          ]
        );
      } catch (error) {
        console.error('Failed to log access:', error);
      }
    });
  } catch (error) {
    console.error('Access logging error:', error);
  }
}

/**
 * Generate JWT token
 */
export function generateToken(payload: {
  userId: string;
  sessionId: string;
  deviceId: string;
}): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '2h'
  });
}

/**
 * Refresh token
 */
export async function refreshToken(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

    // Check if refresh token is still valid
    const refreshKey = `refresh:${decoded.sessionId}`;
    const isValid = await redis.get(refreshKey);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new access token
    const newToken = generateToken({
      userId: decoded.userId,
      sessionId: decoded.sessionId,
      deviceId: decoded.deviceId
    });

    res.json({ accessToken: newToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Token refresh failed' });
  }
}