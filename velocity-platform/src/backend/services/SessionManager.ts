/**
 * Session Management Service
 * Distributed session management with Redis for Zero Trust Architecture
 */

import { Pool } from 'pg';
import Redis from 'ioredis';
import crypto from 'crypto';

export interface SessionData {
  id: string;
  userId: string;
  deviceId: string;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  trustScore: number;
  mfaVerified: boolean;
  restrictions: string[];
  geolocation?: {
    country: string;
    region: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  riskFactors: string[];
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  blocked: boolean;
  metadata: Record<string, any>;
}

export interface SessionMetrics {
  totalSessions: number;
  activeSessions: number;
  blockedSessions: number;
  averageTrustScore: number;
  riskDistribution: Record<string, number>;
  deviceDistribution: Record<string, number>;
}

export class SessionManager {
  private db: Pool;
  private redis: Redis;
  private readonly SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours
  private readonly MAX_SESSIONS_PER_USER = 5;
  private readonly CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });

    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    });

    // Start cleanup timer
    this.startCleanupTimer();
  }

  /**
   * Create new session
   */
  async createSession(data: {
    userId: string;
    deviceId: string;
    deviceFingerprint: string;
    ipAddress: string;
    userAgent: string;
    initialTrustScore: number;
    geolocation?: any;
    metadata?: Record<string, any>;
  }): Promise<SessionData> {
    try {
      // Check session limits
      await this.enforceSessionLimits(data.userId);

      const sessionId = crypto.randomUUID();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + this.SESSION_DURATION);

      const session: SessionData = {
        id: sessionId,
        userId: data.userId,
        deviceId: data.deviceId,
        deviceFingerprint: data.deviceFingerprint,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        trustScore: data.initialTrustScore,
        mfaVerified: false,
        restrictions: [],
        geolocation: data.geolocation,
        riskFactors: [],
        createdAt: now,
        lastActivity: now,
        expiresAt,
        blocked: false,
        metadata: data.metadata || {}
      };

      // Store in Redis for fast access
      const redisKey = `session:${sessionId}`;
      await this.redis.setex(
        redisKey,
        Math.ceil(this.SESSION_DURATION / 1000),
        JSON.stringify(session)
      );

      // Store in database for persistence
      await this.db.query(
        `INSERT INTO user_sessions 
         (id, user_id, device_id, device_fingerprint, ip_address, user_agent,
          trust_score, mfa_verified, restrictions, geolocation, risk_factors,
          created_at, last_activity, expires_at, blocked, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          sessionId, data.userId, data.deviceId, data.deviceFingerprint,
          data.ipAddress, data.userAgent, data.initialTrustScore, false,
          JSON.stringify([]), JSON.stringify(data.geolocation || {}),
          JSON.stringify([]), now, now, expiresAt, false,
          JSON.stringify(data.metadata || {})
        ]
      );

      // Add to user's active sessions set
      await this.redis.sadd(`user_sessions:${data.userId}`, sessionId);
      await this.redis.expire(`user_sessions:${data.userId}`, this.SESSION_DURATION / 1000);

      // Log session creation
      await this.logSessionEvent(sessionId, data.userId, 'session_created', {
        deviceId: data.deviceId,
        ipAddress: data.ipAddress,
        trustScore: data.initialTrustScore
      });

      return session;

    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  }

  /**
   * Get session data
   */
  async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      // Try Redis first
      const redisData = await this.redis.get(`session:${sessionId}`);
      if (redisData) {
        return JSON.parse(redisData);
      }

      // Fall back to database
      const result = await this.db.query(
        `SELECT * FROM user_sessions WHERE id = $1 AND expires_at > NOW()`,
        [sessionId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      const session: SessionData = {
        id: row.id,
        userId: row.user_id,
        deviceId: row.device_id,
        deviceFingerprint: row.device_fingerprint,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        trustScore: row.trust_score,
        mfaVerified: row.mfa_verified,
        restrictions: JSON.parse(row.restrictions || '[]'),
        geolocation: JSON.parse(row.geolocation || '{}'),
        riskFactors: JSON.parse(row.risk_factors || '[]'),
        createdAt: row.created_at,
        lastActivity: row.last_activity,
        expiresAt: row.expires_at,
        blocked: row.blocked,
        metadata: JSON.parse(row.metadata || '{}')
      };

      // Cache in Redis
      const ttl = Math.max(0, Math.floor((session.expiresAt.getTime() - Date.now()) / 1000));
      if (ttl > 0) {
        await this.redis.setex(`session:${sessionId}`, ttl, JSON.stringify(session));
      }

      return session;

    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }

  /**
   * Update session data
   */
  async updateSession(
    sessionId: string,
    updates: Partial<SessionData>
  ): Promise<boolean> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        console.warn(`Session ${sessionId} not found for update`);
        return false;
      }

      // Apply updates
      const updatedSession = {
        ...session,
        ...updates,
        lastActivity: new Date()
      };

      // Update in Redis
      const ttl = Math.max(0, Math.floor((updatedSession.expiresAt.getTime() - Date.now()) / 1000));
      if (ttl > 0) {
        await this.redis.setex(
          `session:${sessionId}`,
          ttl,
          JSON.stringify(updatedSession)
        );
      }

      // Update in database
      await this.db.query(
        `UPDATE user_sessions SET
         trust_score = $1, mfa_verified = $2, restrictions = $3,
         risk_factors = $4, last_activity = $5, blocked = $6,
         metadata = $7
         WHERE id = $8`,
        [
          updatedSession.trustScore,
          updatedSession.mfaVerified,
          JSON.stringify(updatedSession.restrictions),
          JSON.stringify(updatedSession.riskFactors),
          updatedSession.lastActivity,
          updatedSession.blocked,
          JSON.stringify(updatedSession.metadata),
          sessionId
        ]
      );

      return true;

    } catch (error) {
      console.error('Failed to update session:', error);
      return false;
    }
  }

  /**
   * Block session
   */
  async blockSession(sessionId: string, reason: string): Promise<boolean> {
    try {
      const success = await this.updateSession(sessionId, {
        blocked: true,
        restrictions: ['blocked'],
        riskFactors: [`blocked: ${reason}`]
      });

      if (success) {
        const session = await this.getSession(sessionId);
        if (session) {
          await this.logSessionEvent(sessionId, session.userId, 'session_blocked', { reason });
        }
      }

      return success;

    } catch (error) {
      console.error('Failed to block session:', error);
      return false;
    }
  }

  /**
   * Extend session
   */
  async extendSession(sessionId: string, duration?: number): Promise<boolean> {
    try {
      const session = await this.getSession(sessionId);
      if (!session || session.blocked) {
        return false;
      }

      const extensionDuration = duration || this.SESSION_DURATION;
      const newExpiresAt = new Date(Date.now() + extensionDuration);

      const success = await this.updateSession(sessionId, {
        expiresAt: newExpiresAt
      });

      if (success) {
        // Update database expiry
        await this.db.query(
          `UPDATE user_sessions SET expires_at = $1 WHERE id = $2`,
          [newExpiresAt, sessionId]
        );

        // Update Redis TTL
        const ttl = Math.ceil(extensionDuration / 1000);
        await this.redis.expire(`session:${sessionId}`, ttl);
      }

      return success;

    } catch (error) {
      console.error('Failed to extend session:', error);
      return false;
    }
  }

  /**
   * Terminate session
   */
  async terminateSession(sessionId: string, reason?: string): Promise<boolean> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        return false;
      }

      // Remove from Redis
      await this.redis.del(`session:${sessionId}`);

      // Remove from user's active sessions
      await this.redis.srem(`user_sessions:${session.userId}`, sessionId);

      // Mark as terminated in database (keep for audit)
      await this.db.query(
        `UPDATE user_sessions SET 
         expires_at = NOW(), 
         blocked = true,
         metadata = jsonb_set(metadata, '{termination_reason}', $1)
         WHERE id = $2`,
        [JSON.stringify(reason || 'manual_termination'), sessionId]
      );

      // Log termination
      await this.logSessionEvent(sessionId, session.userId, 'session_terminated', { reason });

      return true;

    } catch (error) {
      console.error('Failed to terminate session:', error);
      return false;
    }
  }

  /**
   * Get user's active sessions
   */
  async getUserSessions(userId: string): Promise<SessionData[]> {
    try {
      const sessionIds = await this.redis.smembers(`user_sessions:${userId}`);
      const sessions: SessionData[] = [];

      for (const sessionId of sessionIds) {
        const session = await this.getSession(sessionId);
        if (session && !session.blocked && session.expiresAt > new Date()) {
          sessions.push(session);
        }
      }

      return sessions.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());

    } catch (error) {
      console.error('Failed to get user sessions:', error);
      return [];
    }
  }

  /**
   * Terminate all user sessions except current
   */
  async terminateUserSessions(userId: string, exceptSessionId?: string): Promise<number> {
    try {
      const sessions = await this.getUserSessions(userId);
      let terminatedCount = 0;

      for (const session of sessions) {
        if (session.id !== exceptSessionId) {
          const success = await this.terminateSession(session.id, 'user_logout_all');
          if (success) terminatedCount++;
        }
      }

      return terminatedCount;

    } catch (error) {
      console.error('Failed to terminate user sessions:', error);
      return 0;
    }
  }

  /**
   * Get session metrics
   */
  async getSessionMetrics(timeRange?: number): Promise<SessionMetrics> {
    try {
      const since = timeRange ? new Date(Date.now() - timeRange) : new Date(0);

      const result = await this.db.query(
        `SELECT 
           COUNT(*) as total_sessions,
           COUNT(*) FILTER (WHERE expires_at > NOW() AND NOT blocked) as active_sessions,
           COUNT(*) FILTER (WHERE blocked) as blocked_sessions,
           AVG(trust_score) as average_trust_score,
           jsonb_object_agg(
             CASE 
               WHEN trust_score >= 0.8 THEN 'high'
               WHEN trust_score >= 0.5 THEN 'medium'
               ELSE 'low'
             END,
             COUNT(*)
           ) as risk_distribution
         FROM user_sessions 
         WHERE created_at >= $1`,
        [since]
      );

      const row = result.rows[0];

      return {
        totalSessions: parseInt(row.total_sessions) || 0,
        activeSessions: parseInt(row.active_sessions) || 0,
        blockedSessions: parseInt(row.blocked_sessions) || 0,
        averageTrustScore: parseFloat(row.average_trust_score) || 0,
        riskDistribution: row.risk_distribution || {},
        deviceDistribution: {} // Would be calculated from device data
      };

    } catch (error) {
      console.error('Failed to get session metrics:', error);
      return {
        totalSessions: 0,
        activeSessions: 0,
        blockedSessions: 0,
        averageTrustScore: 0,
        riskDistribution: {},
        deviceDistribution: {}
      };
    }
  }

  // Private methods

  private async enforceSessionLimits(userId: string): Promise<void> {
    const activeSessions = await this.getUserSessions(userId);
    
    if (activeSessions.length >= this.MAX_SESSIONS_PER_USER) {
      // Terminate oldest session
      const oldestSession = activeSessions[activeSessions.length - 1];
      await this.terminateSession(oldestSession.id, 'session_limit_exceeded');
    }
  }

  private async logSessionEvent(
    sessionId: string,
    userId: string,
    eventType: string,
    metadata: any
  ): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO session_events 
         (session_id, user_id, event_type, metadata, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [sessionId, userId, eventType, JSON.stringify(metadata)]
      );
    } catch (error) {
      console.error('Failed to log session event:', error);
    }
  }

  private startCleanupTimer(): void {
    setInterval(async () => {
      try {
        await this.cleanupExpiredSessions();
      } catch (error) {
        console.error('Session cleanup error:', error);
      }
    }, this.CLEANUP_INTERVAL);
  }

  private async cleanupExpiredSessions(): Promise<void> {
    try {
      // Get expired sessions from database
      const result = await this.db.query(
        `SELECT id, user_id FROM user_sessions 
         WHERE expires_at <= NOW() AND NOT blocked`
      );

      for (const row of result.rows) {
        // Remove from Redis
        await this.redis.del(`session:${row.id}`);
        
        // Remove from user's active sessions
        await this.redis.srem(`user_sessions:${row.user_id}`, row.id);

        // Mark as expired in database
        await this.db.query(
          `UPDATE user_sessions SET blocked = true WHERE id = $1`,
          [row.id]
        );
      }

      if (result.rows.length > 0) {
        console.log(`Cleaned up ${result.rows.length} expired sessions`);
      }

    } catch (error) {
      console.error('Failed to cleanup expired sessions:', error);
    }
  }
}