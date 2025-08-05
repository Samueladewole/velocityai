/**
 * Audit and Compliance Service
 * Comprehensive logging and compliance system for Zero Trust Architecture
 */

import { Pool } from 'pg';
import Redis from 'ioredis';
import crypto from 'crypto';

export interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: string;
  category: 'security' | 'access' | 'data' | 'system' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  sessionId?: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  action: string;
  outcome: 'success' | 'failure' | 'blocked' | 'warning';
  details: Record<string, any>;
  risk_score?: number;
  compliance_tags: string[];
  retention_period: number; // days
}

export interface ComplianceReport {
  period: { start: Date; end: Date };
  totalEvents: number;
  eventsByCategory: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  securityIncidents: number;
  accessViolations: number;
  dataAccess: number;
  failedAuthentications: number;
  complianceViolations: AuditEvent[];
  riskMetrics: {
    averageRiskScore: number;
    highRiskEvents: number;
    blockedAttempts: number;
  };
}

export class AuditService {
  private db: Pool;
  private redis: Redis;
  private readonly BATCH_SIZE = 100;
  private readonly FLUSH_INTERVAL = 5000; // 5 seconds
  private eventBuffer: AuditEvent[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });

    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    });

    this.startBatchProcessor();
  }

  /**
   * Log security event
   */
  async logSecurityEvent(event: {
    eventType: string;
    userId?: string;
    sessionId?: string;
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
    action: string;
    resource?: string;
    outcome: 'success' | 'failure' | 'blocked' | 'warning';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    details?: Record<string, any>;
    riskScore?: number;
  }): Promise<string> {
    const auditEvent: AuditEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      eventType: event.eventType,
      category: 'security',
      severity: event.severity || this.calculateSeverity(event),
      userId: event.userId,
      sessionId: event.sessionId,
      deviceId: event.deviceId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      resource: event.resource,
      action: event.action,
      outcome: event.outcome,
      details: event.details || {},
      risk_score: event.riskScore,
      compliance_tags: this.generateComplianceTags(event),
      retention_period: this.calculateRetentionPeriod(event.severity || 'medium')
    };

    await this.queueEvent(auditEvent);
    return auditEvent.id;
  }

  /**
   * Log access event
   */
  async logAccessEvent(event: {
    userId: string;
    sessionId: string;
    resource: string;
    action: string;
    outcome: 'success' | 'failure' | 'blocked';
    ipAddress?: string;
    userAgent?: string;
    details?: Record<string, any>;
  }): Promise<string> {
    const auditEvent: AuditEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      eventType: 'resource_access',
      category: 'access',
      severity: event.outcome === 'success' ? 'low' : 'medium',
      userId: event.userId,
      sessionId: event.sessionId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      resource: event.resource,
      action: event.action,
      outcome: event.outcome,
      details: event.details || {},
      compliance_tags: this.generateComplianceTags({ eventType: 'resource_access', outcome: event.outcome }),
      retention_period: 365 // 1 year for access logs
    };

    await this.queueEvent(auditEvent);
    return auditEvent.id;
  }

  /**
   * Log data event
   */
  async logDataEvent(event: {
    userId: string;
    action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'import';
    dataType: string;
    dataId?: string;
    outcome: 'success' | 'failure' | 'blocked';
    classification?: 'public' | 'internal' | 'confidential' | 'restricted';
    details?: Record<string, any>;
  }): Promise<string> {
    const severity = this.getDataEventSeverity(event.action, event.classification);
    
    const auditEvent: AuditEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      eventType: 'data_access',
      category: 'data',
      severity,
      userId: event.userId,
      resource: `${event.dataType}:${event.dataId || 'unknown'}`,
      action: event.action,
      outcome: event.outcome,
      details: {
        ...event.details,
        dataType: event.dataType,
        dataClassification: event.classification
      },
      compliance_tags: this.generateDataComplianceTags(event),
      retention_period: event.classification === 'restricted' ? 2555 : 1825 // 7 years for restricted, 5 years for others
    };

    await this.queueEvent(auditEvent);
    return auditEvent.id;
  }

  /**
   * Log system event
   */
  async logSystemEvent(event: {
    eventType: string;
    action: string;
    outcome: 'success' | 'failure' | 'warning';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    component?: string;
    details?: Record<string, any>;
  }): Promise<string> {
    const auditEvent: AuditEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      eventType: event.eventType,
      category: 'system',
      severity: event.severity || 'medium',
      resource: event.component,
      action: event.action,
      outcome: event.outcome,
      details: event.details || {},
      compliance_tags: ['system_event'],
      retention_period: 90 // 3 months for system events
    };

    await this.queueEvent(auditEvent);
    return auditEvent.id;
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    startDate: Date,
    endDate: Date,
    categories?: string[]
  ): Promise<ComplianceReport> {
    try {
      let query = `
        SELECT 
          category,
          severity,
          outcome,
          risk_score,
          COUNT(*) as count,
          jsonb_agg(
            CASE 
              WHEN severity IN ('high', 'critical') AND outcome != 'success'
              THEN jsonb_build_object('id', id, 'event_type', event_type, 'timestamp', timestamp)
              ELSE NULL
            END
          ) FILTER (WHERE severity IN ('high', 'critical') AND outcome != 'success') as violations
        FROM audit_events 
        WHERE timestamp >= $1 AND timestamp <= $2
      `;
      
      const params = [startDate, endDate];
      
      if (categories && categories.length > 0) {
        query += ` AND category = ANY($3)`;
        params.push(categories);
      }
      
      query += ` GROUP BY category, severity, outcome`;

      const result = await this.db.query(query, params);

      // Process results
      const eventsByCategory: Record<string, number> = {};
      const eventsBySeverity: Record<string, number> = {};
      let totalEvents = 0;
      let securityIncidents = 0;
      let accessViolations = 0;
      let dataAccess = 0;
      let failedAuthentications = 0;
      let totalRiskScore = 0;
      let riskEventCount = 0;
      let highRiskEvents = 0;
      let blockedAttempts = 0;
      const complianceViolations: AuditEvent[] = [];

      for (const row of result.rows) {
        const count = parseInt(row.count);
        totalEvents += count;

        // Category breakdown
        eventsByCategory[row.category] = (eventsByCategory[row.category] || 0) + count;

        // Severity breakdown  
        eventsBySeverity[row.severity] = (eventsBySeverity[row.severity] || 0) + count;

        // Specific metrics
        if (row.category === 'security' && row.outcome !== 'success') {
          securityIncidents += count;
        }
        if (row.category === 'access' && row.outcome === 'blocked') {
          accessViolations += count;
        }
        if (row.category === 'data') {
          dataAccess += count;
        }
        if (row.outcome === 'blocked') {
          blockedAttempts += count;
        }

        // Risk calculations
        if (row.risk_score) {
          totalRiskScore += row.risk_score * count;
          riskEventCount += count;
          if (row.risk_score > 0.7) {
            highRiskEvents += count;
          }
        }

        // Compliance violations
        if (row.violations) {
          complianceViolations.push(...row.violations.filter((v: any) => v !== null));
        }
      }

      // Get authentication failures
      const authResult = await this.db.query(
        `SELECT COUNT(*) as count 
         FROM audit_events 
         WHERE timestamp >= $1 AND timestamp <= $2 
         AND event_type LIKE '%auth%' AND outcome = 'failure'`,
        [startDate, endDate]
      );
      failedAuthentications = parseInt(authResult.rows[0]?.count || '0');

      return {
        period: { start: startDate, end: endDate },
        totalEvents,
        eventsByCategory,
        eventsBySeverity,
        securityIncidents,
        accessViolations,
        dataAccess,
        failedAuthentications,
        complianceViolations,
        riskMetrics: {
          averageRiskScore: riskEventCount > 0 ? totalRiskScore / riskEventCount : 0,
          highRiskEvents,
          blockedAttempts
        }
      };

    } catch (error) {
      console.error('Failed to generate compliance report:', error);
      throw error;
    }
  }

  /**
   * Search audit events
   */
  async searchEvents(criteria: {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    eventType?: string;
    category?: string;
    severity?: string;
    outcome?: string;
    resource?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ events: AuditEvent[]; total: number }> {
    try {
      let query = 'SELECT * FROM audit_events WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (criteria.startDate) {
        query += ` AND timestamp >= $${paramIndex}`;
        params.push(criteria.startDate);
        paramIndex++;
      }

      if (criteria.endDate) {
        query += ` AND timestamp <= $${paramIndex}`;
        params.push(criteria.endDate);
        paramIndex++;
      }

      if (criteria.userId) {
        query += ` AND user_id = $${paramIndex}`;
        params.push(criteria.userId);
        paramIndex++;
      }

      if (criteria.eventType) {
        query += ` AND event_type = $${paramIndex}`;
        params.push(criteria.eventType);
        paramIndex++;
      }

      if (criteria.category) {
        query += ` AND category = $${paramIndex}`;
        params.push(criteria.category);
        paramIndex++;
      }

      if (criteria.severity) {
        query += ` AND severity = $${paramIndex}`;
        params.push(criteria.severity);
        paramIndex++;
      }

      if (criteria.outcome) {
        query += ` AND outcome = $${paramIndex}`;
        params.push(criteria.outcome);
        paramIndex++;
      }

      if (criteria.resource) {
        query += ` AND resource ILIKE $${paramIndex}`;
        params.push(`%${criteria.resource}%`);
        paramIndex++;
      }

      // Get total count
      const countResult = await this.db.query(
        query.replace('SELECT *', 'SELECT COUNT(*)'),
        params
      );
      const total = parseInt(countResult.rows[0].count);

      // Add pagination
      query += ` ORDER BY timestamp DESC`;
      if (criteria.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(criteria.limit);
        paramIndex++;
      }
      if (criteria.offset) {
        query += ` OFFSET $${paramIndex}`;
        params.push(criteria.offset);
      }

      const result = await this.db.query(query, params);
      const events = result.rows.map(this.mapRowToAuditEvent);

      return { events, total };

    } catch (error) {
      console.error('Failed to search audit events:', error);
      throw error;
    }
  }

  /**
   * Get audit statistics
   */
  async getAuditStatistics(timeRange: number = 24 * 60 * 60 * 1000): Promise<{
    totalEvents: number;
    eventsByHour: number[];
    topEventTypes: Array<{ type: string; count: number }>;
    severityDistribution: Record<string, number>;
    riskTrends: Array<{ hour: string; avgRisk: number }>;
  }> {
    try {
      const since = new Date(Date.now() - timeRange);

      // Total events
      const totalResult = await this.db.query(
        `SELECT COUNT(*) as count FROM audit_events WHERE timestamp >= $1`,
        [since]
      );
      const totalEvents = parseInt(totalResult.rows[0].count);

      // Events by hour
      const hourlyResult = await this.db.query(
        `SELECT 
           DATE_TRUNC('hour', timestamp) as hour,
           COUNT(*) as count
         FROM audit_events 
         WHERE timestamp >= $1
         GROUP BY hour
         ORDER BY hour`,
        [since]
      );
      const eventsByHour = hourlyResult.rows.map(row => parseInt(row.count));

      // Top event types
      const topTypesResult = await this.db.query(
        `SELECT event_type as type, COUNT(*) as count
         FROM audit_events 
         WHERE timestamp >= $1
         GROUP BY event_type
         ORDER BY count DESC
         LIMIT 10`,
        [since]
      );
      const topEventTypes = topTypesResult.rows;

      // Severity distribution
      const severityResult = await this.db.query(
        `SELECT severity, COUNT(*) as count
         FROM audit_events 
         WHERE timestamp >= $1
         GROUP BY severity`,
        [since]
      );
      const severityDistribution: Record<string, number> = {};
      severityResult.rows.forEach(row => {
        severityDistribution[row.severity] = parseInt(row.count);
      });

      // Risk trends
      const riskResult = await this.db.query(
        `SELECT 
           DATE_TRUNC('hour', timestamp) as hour,
           AVG(risk_score) as avg_risk
         FROM audit_events 
         WHERE timestamp >= $1 AND risk_score IS NOT NULL
         GROUP BY hour
         ORDER BY hour`,
        [since]
      );
      const riskTrends = riskResult.rows.map(row => ({
        hour: row.hour.toISOString(),
        avgRisk: parseFloat(row.avg_risk) || 0
      }));

      return {
        totalEvents,
        eventsByHour,
        topEventTypes,
        severityDistribution,
        riskTrends
      };

    } catch (error) {
      console.error('Failed to get audit statistics:', error);
      throw error;
    }
  }

  // Private methods

  private async queueEvent(event: AuditEvent): Promise<void> {
    // Add to buffer
    this.eventBuffer.push(event);

    // Store critical events immediately
    if (event.severity === 'critical') {
      await this.flushEvents();
    } else if (this.eventBuffer.length >= this.BATCH_SIZE) {
      await this.flushEvents();
    }

    // Also store in Redis for real-time access
    await this.redis.lpush('audit_events', JSON.stringify(event));
    await this.redis.ltrim('audit_events', 0, 999); // Keep last 1000
  }

  private async flushEvents(): Promise<void> {
    if (this.eventBuffer.length === 0) return;

    try {
      const events = [...this.eventBuffer];
      this.eventBuffer = [];

      // Batch insert to database
      const values = events.map(event => [
        event.id,
        event.timestamp,
        event.eventType,
        event.category,
        event.severity,
        event.userId,
        event.sessionId,
        event.deviceId,
        event.ipAddress,
        event.userAgent,
        event.resource,
        event.action,
        event.outcome,
        JSON.stringify(event.details),
        event.risk_score,
        JSON.stringify(event.compliance_tags),
        event.retention_period
      ]);

      const placeholders = values.map((_, i) => {
        const base = i * 17;
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, $${base + 11}, $${base + 12}, $${base + 13}, $${base + 14}, $${base + 15}, $${base + 16}, $${base + 17})`;
      }).join(', ');

      await this.db.query(
        `INSERT INTO audit_events 
         (id, timestamp, event_type, category, severity, user_id, session_id, 
          device_id, ip_address, user_agent, resource, action, outcome, 
          details, risk_score, compliance_tags, retention_period)
         VALUES ${placeholders}`,
        values.flat()
      );

    } catch (error) {
      console.error('Failed to flush audit events:', error);
      // Events are lost - could implement retry logic or dead letter queue
    }
  }

  private startBatchProcessor(): void {
    this.flushTimer = setInterval(() => {
      this.flushEvents();
    }, this.FLUSH_INTERVAL);
  }

  private calculateSeverity(event: any): 'low' | 'medium' | 'high' | 'critical' {
    if (event.outcome === 'blocked') return 'high';
    if (event.outcome === 'failure' && event.eventType.includes('auth')) return 'medium';
    if (event.riskScore && event.riskScore > 0.8) return 'high';
    if (event.riskScore && event.riskScore > 0.6) return 'medium';
    return 'low';
  }

  private calculateRetentionPeriod(severity: string): number {
    switch (severity) {
      case 'critical': return 2555; // 7 years
      case 'high': return 1825; // 5 years  
      case 'medium': return 1095; // 3 years
      default: return 365; // 1 year
    }
  }

  private generateComplianceTags(event: any): string[] {
    const tags = [];
    
    if (event.eventType?.includes('auth')) tags.push('authentication');
    if (event.eventType?.includes('access')) tags.push('access_control');
    if (event.outcome === 'blocked') tags.push('security_violation');
    if (event.outcome === 'failure') tags.push('failed_operation');
    
    return tags;
  }

  private generateDataComplianceTags(event: any): string[] {
    const tags = ['data_processing'];
    
    if (event.classification === 'restricted') tags.push('pii', 'gdpr');
    if (event.action === 'export') tags.push('data_transfer');
    if (event.action === 'delete') tags.push('data_deletion');
    
    return tags;
  }

  private getDataEventSeverity(
    action: string, 
    classification?: string
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (action === 'delete' && classification === 'restricted') return 'critical';
    if (action === 'export' && classification === 'restricted') return 'high';
    if (classification === 'restricted') return 'medium';
    if (action === 'delete') return 'medium';
    return 'low';
  }

  private mapRowToAuditEvent(row: any): AuditEvent {
    return {
      id: row.id,
      timestamp: row.timestamp,
      eventType: row.event_type,
      category: row.category,
      severity: row.severity,
      userId: row.user_id,
      sessionId: row.session_id,
      deviceId: row.device_id,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      resource: row.resource,
      action: row.action,
      outcome: row.outcome,
      details: JSON.parse(row.details || '{}'),
      risk_score: row.risk_score,
      compliance_tags: JSON.parse(row.compliance_tags || '[]'),
      retention_period: row.retention_period
    };
  }
}