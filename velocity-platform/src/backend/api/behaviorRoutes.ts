/**
 * Backend API Routes for Behavior Tracking
 * Real implementation of behavior analysis endpoints
 */

import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { validateRequest } from '../middleware/validation';
import { BehaviorService } from '../services/BehaviorService';
import { body, param, query } from 'express-validator';

const router = Router();
const behaviorService = new BehaviorService();

// Rate limiters for different endpoints
const sessionRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 session updates per minute
  message: 'Too many session updates'
});

const analyticsRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30, // 30 analytics requests per minute
  message: 'Too many analytics requests'
});

/**
 * Store complete behavior session
 */
router.post('/behavior/session',
  authenticate,
  sessionRateLimit,
  [
    body('session').isObject().notEmpty(),
    body('metrics').isObject().notEmpty(),
    body('timestamp').isISO8601()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { session, metrics, timestamp } = req.body;
      const userId = req.user!.id;

      // Validate session belongs to authenticated user
      if (session.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized session access' });
      }

      // Store session data
      const result = await behaviorService.storeSession({
        sessionId: session.sessionId,
        userId,
        deviceId: session.deviceId,
        currentSession: session,
        metrics,
        timestamp
      });

      // Update user trust score based on behavior
      await behaviorService.updateUserTrustScore(userId, result.analysis);

      res.json({
        sessionId: result.sessionId,
        stored: result.stored,
        analysis: {
          isAnomaly: result.analysis.isAnomaly,
          riskLevel: result.analysis.riskLevel,
          confidence: result.analysis.confidence
        }
      });

    } catch (error) {
      console.error('Failed to store behavior session:', error);
      res.status(500).json({ error: 'Failed to store session data' });
    }
  }
);

/**
 * Process incremental behavior updates
 */
router.post('/behavior/update',
  authenticate,
  sessionRateLimit,
  [
    body('sessionId').isString().notEmpty(),
    body('userId').isString().notEmpty(),
    body('deviceId').isString().notEmpty(),
    body('incrementalData').isObject().notEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { sessionId, userId, deviceId, incrementalData, timestamp } = req.body;

      // Validate user authorization
      if (userId !== req.user!.id) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      // Process real-time behavior update
      const result = await behaviorService.updateBehavior({
        sessionId,
        userId,
        deviceId,
        timestamp,
        incrementalData
      });

      // Check for immediate threats
      if (result.alertsTriggered.length > 0) {
        await behaviorService.handleSecurityAlerts(
          userId,
          sessionId,
          result.alertsTriggered,
          result.riskAssessment
        );
      }

      res.json({
        processed: result.processed,
        alertsTriggered: result.alertsTriggered,
        currentRiskLevel: result.riskAssessment.level
      });

    } catch (error) {
      console.error('Failed to update behavior:', error);
      res.status(500).json({ error: 'Failed to process behavior update' });
    }
  }
);

/**
 * Get behavior analytics for a user
 */
router.get('/behavior/analytics/:userId',
  authenticate,
  analyticsRateLimit,
  [
    param('userId').isUUID(),
    query('timeRange').optional().isInt({ min: 3600000 }) // Minimum 1 hour
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const timeRange = parseInt(req.query.timeRange as string) || 24 * 60 * 60 * 1000;

      // Check authorization (users can only access their own data, admins can access any)
      if (userId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      const analytics = await behaviorService.getAnalytics(userId, timeRange);

      res.json(analytics);

    } catch (error) {
      console.error('Failed to get analytics:', error);
      res.status(500).json({ error: 'Failed to retrieve analytics' });
    }
  }
);

/**
 * Get user behavior baseline
 */
router.get('/behavior/baseline/:userId',
  authenticate,
  analyticsRateLimit,
  [
    param('userId').isUUID()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      // Check authorization
      if (userId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      const baseline = await behaviorService.getUserBaseline(userId);

      if (!baseline) {
        return res.status(404).json({ error: 'No baseline found' });
      }

      res.json(baseline);

    } catch (error) {
      console.error('Failed to get baseline:', error);
      res.status(500).json({ error: 'Failed to retrieve baseline' });
    }
  }
);

/**
 * Report behavior anomaly
 */
router.post('/behavior/anomaly',
  authenticate,
  [
    body('userId').isUUID(),
    body('sessionId').isString().notEmpty(),
    body('anomalyType').isString().notEmpty(),
    body('severity').isIn(['low', 'medium', 'high', 'critical']),
    body('details').isObject()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const anomaly = req.body;

      // Store anomaly
      const result = await behaviorService.reportAnomaly(anomaly);

      // Trigger automated response if needed
      if (anomaly.severity === 'high' || anomaly.severity === 'critical') {
        await behaviorService.triggerAnomalyResponse(anomaly);
      }

      res.json({
        anomalyId: result.id,
        recorded: true,
        responseTriggered: result.responseTriggered
      });

    } catch (error) {
      console.error('Failed to report anomaly:', error);
      res.status(500).json({ error: 'Failed to report anomaly' });
    }
  }
);

/**
 * Get behavior risk score
 */
router.get('/behavior/risk-score/:sessionId',
  authenticate,
  [
    param('sessionId').isString().notEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;

      const riskScore = await behaviorService.getSessionRiskScore(
        sessionId,
        req.user!.id
      );

      res.json(riskScore);

    } catch (error) {
      console.error('Failed to get risk score:', error);
      res.status(500).json({ error: 'Failed to calculate risk score' });
    }
  }
);

export default router;