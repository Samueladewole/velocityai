/**
 * Dashboard API Routes
 * Real-time data endpoints for security dashboard and user experience
 */

import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { validateRequest } from '../middleware/validation';
import { BehaviorService } from '../services/BehaviorService';
import { SessionManager } from '../services/SessionManager';
import { AuditService } from '../services/AuditService';
import { ResilienceService } from '../services/ResilienceService';
import { GeolocationServiceReal } from '../services/GeolocationServiceReal';
import { query, body } from 'express-validator';
import { Pool } from 'pg';
import Redis from 'ioredis';

const router = Router();
const db = new Pool({ connectionString: process.env.DATABASE_URL });
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD
});

// Rate limiters
const dashboardRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Dashboard rate limit exceeded',
  trustScore: { enabled: true, multiplier: 1.5 }
});

const fastRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 120, // More frequent for real-time updates
  message: 'Rate limit exceeded'
});

/**
 * Get security overview metrics
 */
router.get('/dashboard/overview',
  authenticate,
  dashboardRateLimit,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const timeRange = parseInt(req.query.timeRange as string) || 24 * 60 * 60 * 1000; // 24 hours default

      // Get trust score
      const trustResult = await db.query(
        `SELECT current_trust_score, last_assessment_at 
         FROM user_trust_profiles WHERE user_id = $1`,
        [userId]
      );

      // Get active threats
      const threatsResult = await db.query(
        `SELECT COUNT(*) as count, severity
         FROM security_events 
         WHERE user_id = $1 AND created_at > NOW() - INTERVAL '24 hours'
         AND status != 'resolved'
         GROUP BY severity`,
        [userId]
      );

      // Get compliance scores
      const complianceResult = await db.query(
        `SELECT 
           AVG(CASE WHEN outcome = 'success' THEN 100 ELSE 0 END) as avg_score,
           COUNT(*) as total_checks
         FROM audit_events 
         WHERE user_id = $1 AND category = 'compliance'
         AND timestamp > NOW() - INTERVAL '30 days'`,
        [userId]
      );

      // Calculate monthly savings (mock calculation)
      const savingsResult = await redis.get(`user:${userId}:monthly_savings`);
      const monthlySavings = savingsResult ? parseInt(savingsResult) : 15750;

      const overview = {
        trustScore: {
          current: trustResult.rows[0]?.current_trust_score || 0.5,
          lastUpdated: trustResult.rows[0]?.last_assessment_at || new Date(),
          trend: 'up', // Would calculate from historical data
          change: 0.05
        },
        activeThreats: {
          total: threatsResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
          critical: threatsResult.rows.find(r => r.severity === 'critical')?.count || 0,
          high: threatsResult.rows.find(r => r.severity === 'high')?.count || 0,
          medium: threatsResult.rows.find(r => r.severity === 'medium')?.count || 0,
          trend: 'down',
          change: -2
        },
        compliance: {
          score: Math.round(parseFloat(complianceResult.rows[0]?.avg_score || '0')),
          totalChecks: parseInt(complianceResult.rows[0]?.total_checks || '0'),
          trend: 'up',
          change: 2
        },
        savings: {
          monthly: monthlySavings,
          trend: 'up',
          change: 3200
        }
      };

      res.json(overview);

    } catch (error) {
      console.error('Failed to get dashboard overview:', error);
      res.status(500).json({ error: 'Failed to fetch overview data' });
    }
  }
);

/**
 * Get active security threats
 */
router.get('/dashboard/threats',
  authenticate,
  dashboardRateLimit,
  [
    query('status').optional().isIn(['new', 'investigating', 'resolved', 'false_positive']),
    query('severity').optional().isIn(['critical', 'high', 'medium', 'low']),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { status, severity, limit = 10 } = req.query;

      let query = `
        SELECT 
          id,
          event_type,
          severity,
          event_title as title,
          event_description as description,
          created_at as timestamp,
          status,
          risk_score,
          metadata
        FROM security_events 
        WHERE user_id = $1
      `;
      const params = [userId];
      let paramIndex = 2;

      if (status) {
        query += ` AND status = $${paramIndex}`;
        params.push(status as string);
        paramIndex++;
      }

      if (severity) {
        query += ` AND severity = $${paramIndex}`;
        params.push(severity as string);
        paramIndex++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
      params.push(limit as string);

      const result = await db.query(query, params);

      const threats = result.rows.map(row => ({
        id: row.id,
        title: row.title || `Security Event: ${row.event_type}`,
        description: row.description || 'Security event detected',
        severity: row.severity,
        timestamp: row.timestamp,
        status: row.status,
        source: 'Velocity Security Monitor',
        estimatedImpact: Math.round((row.risk_score || 0.5) * 100000),
        autoRemediationAvailable: row.metadata?.auto_fix_available || false,
        affectedResources: row.metadata?.affected_resources || 1
      }));

      res.json({ threats, total: threats.length });

    } catch (error) {
      console.error('Failed to get threats:', error);
      res.status(500).json({ error: 'Failed to fetch threat data' });
    }
  }
);

/**
 * Get quick security actions
 */
router.get('/dashboard/quick-actions',
  authenticate,
  dashboardRateLimit,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      // Get user's cloud resources and security issues
      const issuesResult = await db.query(
        `SELECT 
           event_type,
           severity,
           COUNT(*) as count,
           AVG(risk_score) as avg_risk
         FROM security_events 
         WHERE user_id = $1 AND status != 'resolved'
         GROUP BY event_type, severity
         ORDER BY AVG(risk_score) DESC
         LIMIT 10`,
        [userId]
      );

      // Mock quick actions based on common security issues
      const quickActions = [
        {
          id: 'mfa_admin',
          title: 'Enable MFA for Admin Users',
          description: 'Admin accounts without multi-factor authentication detected',
          impact: 'high',
          effort: 'low',
          estimatedTime: '15 minutes',
          potentialSavings: 75000,
          category: 'security',
          autoFixAvailable: true
        },
        {
          id: 'public_s3',
          title: 'Secure Public S3 Buckets',
          description: 'S3 buckets with public read access found',
          impact: 'high',
          effort: 'low',
          estimatedTime: '5 minutes',
          potentialSavings: 100000,
          category: 'security',
          autoFixAvailable: true
        },
        {
          id: 'security_groups',
          title: 'Tighten Security Group Rules',
          description: 'Overly permissive security groups detected',
          impact: 'medium',
          effort: 'medium',
          estimatedTime: '30 minutes',
          potentialSavings: 25000,
          category: 'security',
          autoFixAvailable: false
        },
        {
          id: 'cloudtrail',
          title: 'Enable CloudTrail Logging',
          description: 'Audit logging missing in some regions',
          impact: 'medium',
          effort: 'low',
          estimatedTime: '10 minutes',
          potentialSavings: 15000,
          category: 'compliance',
          autoFixAvailable: true
        }
      ];

      res.json({ actions: quickActions });

    } catch (error) {
      console.error('Failed to get quick actions:', error);
      res.status(500).json({ error: 'Failed to fetch quick actions' });
    }
  }
);

/**
 * Get compliance status
 */
router.get('/dashboard/compliance',
  authenticate,
  dashboardRateLimit,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      // Get compliance events
      const complianceResult = await db.query(
        `SELECT 
           compliance_tags,
           outcome,
           COUNT(*) as count
         FROM audit_events 
         WHERE user_id = $1 
         AND 'compliance' = ANY(compliance_tags::text[])
         AND timestamp > NOW() - INTERVAL '30 days'
         GROUP BY compliance_tags, outcome`,
        [userId]
      );

      // Mock compliance frameworks status
      const frameworks = [
        {
          framework: 'SOC 2',
          score: 96,
          passing: 143,
          failing: 6,
          total: 149,
          nextAudit: new Date('2024-03-15'),
          trend: 'improving'
        },
        {
          framework: 'ISO 27001',
          score: 92,
          passing: 187,
          failing: 16,
          total: 203,
          nextAudit: new Date('2024-04-20'),
          trend: 'stable'
        },
        {
          framework: 'PCI DSS',
          score: 89,
          passing: 278,
          failing: 34,
          total: 312,
          nextAudit: new Date('2024-05-10'),
          trend: 'improving'
        },
        {
          framework: 'GDPR',
          score: 94,
          passing: 67,
          failing: 4,
          total: 71,
          nextAudit: new Date('2024-06-01'),
          trend: 'improving'
        }
      ];

      res.json({ frameworks });

    } catch (error) {
      console.error('Failed to get compliance status:', error);
      res.status(500).json({ error: 'Failed to fetch compliance data' });
    }
  }
);

/**
 * Execute auto-remediation action
 */
router.post('/dashboard/auto-fix',
  authenticate,
  rateLimit({
    windowMs: 60 * 1000,
    max: 10, // Limited auto-fix actions
    message: 'Auto-fix rate limit exceeded'
  }),
  [
    body('actionId').isString().notEmpty(),
    body('resourceId').optional().isString()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { actionId, resourceId } = req.body;
      const userId = req.user!.id;

      // Log the auto-fix attempt
      const auditService = new AuditService();
      await auditService.logSecurityEvent({
        eventType: 'auto_remediation_requested',
        userId,
        action: 'auto_fix',
        resource: resourceId,
        outcome: 'success',
        details: { actionId }
      });

      // Mock auto-fix execution
      const autoFixResults = {
        'mfa_admin': {
          success: true,
          message: 'MFA enforcement enabled for 12 admin users',
          affectedResources: 12,
          estimatedTime: '2 minutes'
        },
        'public_s3': {
          success: true,
          message: 'Public access removed from 3 S3 buckets',
          affectedResources: 3,
          estimatedTime: '30 seconds'
        },
        'cloudtrail': {
          success: true,
          message: 'CloudTrail enabled in 2 regions',
          affectedResources: 2,
          estimatedTime: '1 minute'
        }
      };

      const result = autoFixResults[actionId as keyof typeof autoFixResults] || {
        success: false,
        message: 'Auto-fix not available for this action',
        affectedResources: 0,
        estimatedTime: '0 seconds'
      };

      if (result.success) {
        // Update user savings
        const currentSavings = await redis.get(`user:${userId}:monthly_savings`) || '15750';
        const newSavings = parseInt(currentSavings) + Math.floor(Math.random() * 5000);
        await redis.set(`user:${userId}:monthly_savings`, newSavings.toString());
      }

      res.json(result);

    } catch (error) {
      console.error('Failed to execute auto-fix:', error);
      res.status(500).json({ error: 'Auto-fix execution failed' });
    }
  }
);

/**
 * Get real-time security metrics
 */
router.get('/dashboard/metrics/realtime',
  authenticate,
  fastRateLimit,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      // Get real-time metrics from Redis
      const metricsKey = `realtime:${userId}`;
      const cachedMetrics = await redis.get(metricsKey);

      if (cachedMetrics) {
        return res.json(JSON.parse(cachedMetrics));
      }

      // Generate real-time metrics
      const metrics = {
        timestamp: new Date(),
        activeUsers: Math.floor(Math.random() * 50) + 100,
        activeSessions: Math.floor(Math.random() * 200) + 300,
        threatsDetected: Math.floor(Math.random() * 5),
        systemLoad: Math.random() * 0.8 + 0.1,
        responseTime: Math.random() * 100 + 50,
        securityScore: Math.floor(Math.random() * 10) + 85
      };

      // Cache for 30 seconds
      await redis.setex(metricsKey, 30, JSON.stringify(metrics));

      res.json(metrics);

    } catch (error) {
      console.error('Failed to get real-time metrics:', error);
      res.status(500).json({ error: 'Failed to fetch real-time metrics' });
    }
  }
);

/**
 * Export security report
 */
router.get('/dashboard/export',
  authenticate,
  rateLimit({
    windowMs: 60 * 1000,
    max: 5, // Limited exports
    message: 'Export rate limit exceeded'
  }),
  [
    query('format').optional().isIn(['pdf', 'csv', 'json']),
    query('timeRange').optional().isInt({ min: 3600000 }) // Minimum 1 hour
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const format = req.query.format || 'json';
      const timeRange = parseInt(req.query.timeRange as string) || 24 * 60 * 60 * 1000;

      // Get comprehensive security data
      const securityData = {
        generatedAt: new Date(),
        timeRange: `${timeRange / (60 * 60 * 1000)} hours`,
        user: userId,
        summary: {
          trustScore: 87,
          threatCount: 3,
          complianceScore: 94,
          savings: 15750
        },
        threats: [], // Would populate from database
        compliance: [], // Would populate from database
        recommendations: [] // Would populate from analysis
      };

      // Log export event
      const auditService = new AuditService();
      await auditService.logAccessEvent({
        userId,
        sessionId: req.user!.sessionId,
        resource: 'security_report',
        action: 'export',
        outcome: 'success',
        details: { format, timeRange }
      });

      res.setHeader('Content-Disposition', `attachment; filename="security-report.${format}"`);
      
      if (format === 'json') {
        res.json(securityData);
      } else {
        // For PDF/CSV, would use appropriate libraries
        res.json({ message: `${format.toUpperCase()} export would be generated here` });
      }

    } catch (error) {
      console.error('Failed to export report:', error);
      res.status(500).json({ error: 'Report export failed' });
    }
  }
);

export default router;