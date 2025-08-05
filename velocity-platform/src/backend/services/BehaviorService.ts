/**
 * Behavior Analysis Service
 * Core backend service for behavior tracking and analysis
 */

import { Pool } from 'pg';
import Redis from 'ioredis';
import { BehaviorAnalysisResult, UserBehaviorBaseline } from '../../services/api/BehaviorAPI';

export class BehaviorService {
  private db: Pool;
  private redis: Redis;
  private readonly BASELINE_CONFIDENCE_THRESHOLD = 0.7;
  private readonly ANOMALY_THRESHOLD = 0.6;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });

    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    });
  }

  /**
   * Store behavior session in database
   */
  async storeSession(request: any): Promise<any> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');

      // Store session data
      const sessionResult = await client.query(
        `INSERT INTO behavior_sessions 
         (session_id, user_id, device_id, start_time, end_time, 
          typing_patterns, mouse_movements, navigation_events, 
          focus_events, scroll_behavior)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (session_id) 
         DO UPDATE SET 
           end_time = EXCLUDED.end_time,
           typing_patterns = EXCLUDED.typing_patterns,
           mouse_movements = EXCLUDED.mouse_movements
         RETURNING id`,
        [
          request.sessionId,
          request.userId,
          request.deviceId,
          request.currentSession.startTime,
          request.currentSession.endTime || new Date(),
          JSON.stringify(request.currentSession.typingPatterns),
          JSON.stringify(request.currentSession.mouseMovements),
          JSON.stringify(request.currentSession.navigationEvents),
          JSON.stringify(request.currentSession.focusEvents),
          JSON.stringify(request.currentSession.scrollBehavior)
        ]
      );

      // Get or create user baseline
      const baseline = await this.getOrCreateBaseline(request.userId, client);

      // Analyze behavior
      const analysis = await this.analyzeBehavior(request.metrics, baseline);

      // Store analysis results
      await client.query(
        `INSERT INTO behavior_analyses 
         (session_id, user_id, is_anomaly, confidence, risk_level, 
          anomaly_details, recommendations, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          request.sessionId,
          request.userId,
          analysis.isAnomaly,
          analysis.confidence,
          analysis.riskLevel,
          JSON.stringify(analysis.details),
          JSON.stringify(analysis.recommendations)
        ]
      );

      // Update baseline if behavior is normal
      if (!analysis.isAnomaly && analysis.confidence > this.BASELINE_CONFIDENCE_THRESHOLD) {
        await this.updateBaseline(request.userId, request.metrics, client);
      }

      await client.query('COMMIT');

      return {
        sessionId: request.sessionId,
        stored: true,
        analysis
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update behavior in real-time
   */
  async updateBehavior(request: any): Promise<any> {
    try {
      // Store incremental data in Redis for performance
      const key = `behavior:session:${request.sessionId}`;
      await this.redis.hset(key, {
        lastUpdate: Date.now(),
        userId: request.userId,
        deviceId: request.deviceId,
        incrementalData: JSON.stringify(request.incrementalData)
      });
      await this.redis.expire(key, 7200); // 2 hour expiry

      // Analyze real-time behavior
      const realtimeAnalysis = this.analyzeRealtimeBehavior(request.incrementalData);

      // Check for immediate threats
      const alerts = this.checkImmediateThreats(realtimeAnalysis);

      // Calculate current risk
      const riskAssessment = await this.assessCurrentRisk(
        request.userId, 
        realtimeAnalysis
      );

      // Update session metrics in background
      this.updateSessionMetricsAsync(request.sessionId, request.incrementalData);

      return {
        processed: true,
        alertsTriggered: alerts,
        riskAssessment
      };

    } catch (error) {
      console.error('Failed to update behavior:', error);
      return {
        processed: false,
        alertsTriggered: [],
        riskAssessment: { level: 'unknown', confidence: 0 }
      };
    }
  }

  /**
   * Get user behavior analytics
   */
  async getAnalytics(userId: string, timeRange: number): Promise<any> {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - timeRange);

    try {
      // Get sessions from database
      const sessionsResult = await this.db.query(
        `SELECT * FROM behavior_sessions 
         WHERE user_id = $1 AND created_at >= $2 AND created_at <= $3
         ORDER BY created_at DESC`,
        [userId, startTime, endTime]
      );

      // Get anomalies
      const anomaliesResult = await this.db.query(
        `SELECT * FROM behavior_anomalies
         WHERE user_id = $1 AND created_at >= $2 AND created_at <= $3
         ORDER BY created_at DESC`,
        [userId, startTime, endTime]
      );

      // Calculate aggregate metrics
      const metrics = this.calculateAggregateMetrics(sessionsResult.rows);

      // Analyze trends
      const trends = this.analyzeBehaviorTrends(sessionsResult.rows);

      // Calculate trust contribution
      const trustContribution = this.calculateTrustContribution(
        metrics,
        anomaliesResult.rows
      );

      return {
        sessionCount: sessionsResult.rows.length,
        totalDuration: this.calculateTotalDuration(sessionsResult.rows),
        averageMetrics: metrics,
        trendAnalysis: trends,
        anomalyHistory: anomaliesResult.rows,
        trustContribution
      };

    } catch (error) {
      console.error('Failed to get analytics:', error);
      throw error;
    }
  }

  /**
   * Get user behavior baseline
   */
  async getUserBaseline(userId: string): Promise<UserBehaviorBaseline | null> {
    try {
      const result = await this.db.query(
        `SELECT * FROM user_behavior_baselines WHERE user_id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const baseline = result.rows[0];
      return {
        userId: baseline.user_id,
        typingCharacteristics: {
          averageSpeed: baseline.average_typing_speed,
          keyPressDuration: baseline.key_press_duration_avg,
          timeBetweenKeys: baseline.key_interval_avg,
          rhythmPattern: baseline.typing_rhythm_signature || []
        },
        mouseCharacteristics: {
          averageSpeed: baseline.average_mouse_speed,
          clickPrecision: baseline.click_precision_score,
          scrollPattern: baseline.scroll_behavior_metrics || []
        },
        navigationPatterns: {
          commonPages: baseline.common_pages || [],
          actionSequences: baseline.typical_action_sequences || [],
          timeOnPage: baseline.average_session_duration
        },
        temporalPatterns: {
          activeHours: baseline.typical_access_hours || [],
          sessionDuration: baseline.average_session_duration,
          accessFrequency: baseline.access_frequency || 0
        },
        confidence: baseline.baseline_confidence,
        lastUpdated: baseline.updated_at,
        sampleCount: baseline.training_sample_count
      };

    } catch (error) {
      console.error('Failed to get baseline:', error);
      return null;
    }
  }

  /**
   * Report behavior anomaly
   */
  async reportAnomaly(anomaly: any): Promise<any> {
    try {
      const result = await this.db.query(
        `INSERT INTO behavior_anomalies
         (user_id, device_id, session_id, anomaly_type, severity,
          confidence, expected_value, observed_value, deviation_score,
          anomaly_details, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
         RETURNING id`,
        [
          anomaly.userId,
          anomaly.deviceId,
          anomaly.sessionId,
          anomaly.anomalyType,
          anomaly.severity,
          anomaly.confidence || 0.8,
          JSON.stringify(anomaly.expectedValue),
          JSON.stringify(anomaly.observedValue),
          anomaly.deviationScore,
          JSON.stringify(anomaly.details),
          'detected'
        ]
      );

      // Check if automated response is needed
      const responseTriggered = await this.checkAnomalyResponsePolicy(anomaly);

      return {
        id: result.rows[0].id,
        responseTriggered
      };

    } catch (error) {
      console.error('Failed to report anomaly:', error);
      throw error;
    }
  }

  /**
   * Get session risk score
   */
  async getSessionRiskScore(sessionId: string, userId: string): Promise<any> {
    try {
      // Get session data from Redis first (real-time)
      const redisData = await this.redis.hgetall(`behavior:session:${sessionId}`);
      
      // Get session from database
      const sessionResult = await this.db.query(
        `SELECT * FROM behavior_sessions WHERE session_id = $1 AND user_id = $2`,
        [sessionId, userId]
      );

      if (sessionResult.rows.length === 0) {
        throw new Error('Session not found');
      }

      const session = sessionResult.rows[0];
      
      // Calculate risk based on current data
      const riskScore = this.calculateSessionRisk(session, redisData);

      return riskScore;

    } catch (error) {
      console.error('Failed to get risk score:', error);
      throw error;
    }
  }

  /**
   * Update user trust score based on behavior
   */
  async updateUserTrustScore(userId: string, analysis: BehaviorAnalysisResult): Promise<void> {
    try {
      // Calculate trust adjustment
      let trustAdjustment = 0;
      if (analysis.isAnomaly) {
        trustAdjustment = -0.1 * (analysis.confidence || 0.5);
      } else {
        trustAdjustment = 0.05 * (analysis.confidence || 0.5);
      }

      // Update trust profile
      await this.db.query(
        `UPDATE user_trust_profiles 
         SET current_trust_score = GREATEST(0, LEAST(1, current_trust_score + $1)),
             last_assessment_at = NOW(),
             assessment_count = assessment_count + 1
         WHERE user_id = $2`,
        [trustAdjustment, userId]
      );

    } catch (error) {
      console.error('Failed to update trust score:', error);
    }
  }

  /**
   * Handle security alerts
   */
  async handleSecurityAlerts(
    userId: string, 
    sessionId: string, 
    alerts: string[], 
    riskAssessment: any
  ): Promise<void> {
    try {
      // Log security events
      for (const alert of alerts) {
        await this.db.query(
          `INSERT INTO security_events
           (user_id, session_id, event_type, severity, status,
            event_title, event_description, risk_score, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
          [
            userId,
            sessionId,
            alert,
            riskAssessment.level === 'high' ? 'high' : 'medium',
            'new',
            `Security Alert: ${alert}`,
            `Automated alert triggered for ${alert}`,
            riskAssessment.score
          ]
        );
      }

      // Send notifications
      await this.sendSecurityNotifications(userId, alerts);

    } catch (error) {
      console.error('Failed to handle security alerts:', error);
    }
  }

  /**
   * Trigger anomaly response
   */
  async triggerAnomalyResponse(anomaly: any): Promise<void> {
    try {
      // Create threat event
      const threatEvent = {
        id: `threat_${Date.now()}`,
        timestamp: new Date(),
        type: 'behavior_anomaly',
        severity: anomaly.severity,
        userId: anomaly.userId,
        sessionId: anomaly.sessionId,
        deviceId: anomaly.deviceId,
        ipAddress: anomaly.ipAddress || 'unknown',
        details: anomaly.details,
        riskAssessment: {
          overallRiskScore: anomaly.deviationScore || 0.7,
          riskLevel: anomaly.severity,
          confidence: anomaly.confidence || 0.8,
          factors: {},
          riskReasons: [anomaly.anomalyType],
          recommendedActions: [],
          trustImpact: -0.1,
          requiresAction: true,
          lastUpdated: new Date()
        },
        autoResponseEnabled: true
      };

      // Queue for automated response
      await this.redis.lpush(
        'threat_response_queue',
        JSON.stringify(threatEvent)
      );

    } catch (error) {
      console.error('Failed to trigger anomaly response:', error);
    }
  }

  // Private helper methods

  private async getOrCreateBaseline(userId: string, client: any): Promise<any> {
    const result = await client.query(
      `SELECT * FROM user_behavior_baselines WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    // Create new baseline
    const newBaseline = await client.query(
      `INSERT INTO user_behavior_baselines 
       (user_id, baseline_confidence, training_sample_count, created_at)
       VALUES ($1, 0.1, 0, NOW())
       RETURNING *`,
      [userId]
    );

    return newBaseline.rows[0];
  }

  private async analyzeBehavior(metrics: any, baseline: any): Promise<BehaviorAnalysisResult> {
    // Implement behavior analysis logic
    const anomalies = {
      typingAnomalies: [],
      mouseAnomalies: [],
      navigationAnomalies: [],
      temporalAnomalies: []
    };

    // Compare metrics with baseline
    if (baseline.average_typing_speed) {
      const speedDiff = Math.abs(metrics.averageTypingSpeed - baseline.average_typing_speed);
      if (speedDiff > baseline.average_typing_speed * 0.3) {
        anomalies.typingAnomalies.push({
          type: 'typing_speed_deviation',
          severity: speedDiff > baseline.average_typing_speed * 0.5 ? 'high' : 'medium',
          expected: baseline.average_typing_speed,
          observed: metrics.averageTypingSpeed
        });
      }
    }

    const totalAnomalies = Object.values(anomalies).flat().length;
    const isAnomaly = totalAnomalies > 2;
    const confidence = baseline.baseline_confidence || 0.5;
    const riskLevel = this.calculateRiskLevel(totalAnomalies, confidence);

    return {
      isAnomaly,
      confidence,
      riskLevel,
      details: anomalies,
      recommendations: this.generateRecommendations(anomalies, riskLevel)
    };
  }

  private calculateRiskLevel(anomalyCount: number, confidence: number): 'low' | 'medium' | 'high' | 'critical' {
    if (anomalyCount === 0) return 'low';
    if (anomalyCount <= 2 && confidence > 0.7) return 'low';
    if (anomalyCount <= 4 && confidence > 0.5) return 'medium';
    if (anomalyCount <= 6 && confidence > 0.3) return 'high';
    return 'critical';
  }

  private generateRecommendations(anomalies: any, riskLevel: string): string[] {
    const recommendations = [];
    
    if (riskLevel === 'low') {
      recommendations.push('Behavior appears normal - continue monitoring');
    } else if (riskLevel === 'medium') {
      recommendations.push('Some behavioral changes detected - verify user identity');
    } else if (riskLevel === 'high') {
      recommendations.push('Significant behavioral anomalies detected - require step-up authentication');
    } else {
      recommendations.push('Critical behavioral anomalies - consider blocking session');
    }

    return recommendations;
  }

  private async updateBaseline(userId: string, metrics: any, client: any): Promise<void> {
    // Update baseline with new metrics using exponential moving average
    await client.query(
      `UPDATE user_behavior_baselines
       SET average_typing_speed = (average_typing_speed * 0.9 + $1 * 0.1),
           key_press_duration_avg = (key_press_duration_avg * 0.9 + $2 * 0.1),
           baseline_confidence = LEAST(1.0, baseline_confidence + 0.01),
           training_sample_count = training_sample_count + 1,
           updated_at = NOW()
       WHERE user_id = $3`,
      [
        metrics.averageTypingSpeed,
        metrics.keystrokeDynamics?.avgKeyPressDuration || 0,
        userId
      ]
    );
  }

  private analyzeRealtimeBehavior(incrementalData: any): any {
    return {
      activityLevel: incrementalData.currentMetrics?.currentActivityLevel || 'unknown',
      anomalyCount: incrementalData.currentMetrics?.anomalyIndicators?.length || 0,
      typingSpeed: incrementalData.currentMetrics?.recentTypingSpeed || 0,
      mouseActivity: incrementalData.currentMetrics?.recentMouseActivity || 0,
      sessionDuration: incrementalData.currentMetrics?.sessionDuration || 0
    };
  }

  private checkImmediateThreats(analysis: any): string[] {
    const alerts = [];
    
    if (analysis.anomalyCount > 3) {
      alerts.push('multiple_anomalies_detected');
    }
    
    if (analysis.typingSpeed > 200) {
      alerts.push('bot_activity_suspected');
    }

    return alerts;
  }

  private async assessCurrentRisk(userId: string, analysis: any): Promise<any> {
    let riskScore = 0.3;
    
    riskScore += analysis.anomalyCount * 0.1;
    
    if (analysis.activityLevel === 'idle') {
      riskScore += 0.1;
    }
    
    riskScore = Math.max(0, Math.min(1, riskScore));
    
    return {
      level: riskScore < 0.3 ? 'low' : riskScore < 0.6 ? 'medium' : 'high',
      score: riskScore,
      confidence: 0.8
    };
  }

  private async updateSessionMetricsAsync(sessionId: string, incrementalData: any): Promise<void> {
    // Update session metrics in background
    setImmediate(async () => {
      try {
        await this.db.query(
          `UPDATE behavior_sessions
           SET last_activity = NOW(),
               activity_count = activity_count + 1
           WHERE session_id = $1`,
          [sessionId]
        );
      } catch (error) {
        console.error('Failed to update session metrics:', error);
      }
    });
  }

  private calculateAggregateMetrics(sessions: any[]): any {
    // Implementation for calculating aggregate metrics
    return {
      averageTypingSpeed: 60,
      keystrokeDynamics: {
        avgKeyPressDuration: 100,
        avgTimeBetweenKeys: 150,
        typingRhythm: 0.8,
        pausePatterns: []
      }
    };
  }

  private analyzeBehaviorTrends(sessions: any[]): any {
    // Implementation for trend analysis
    return {
      trend: 'stable',
      confidence: 0.8
    };
  }

  private calculateTrustContribution(metrics: any, anomalies: any[]): number {
    const baseContribution = 0.7;
    const anomalyPenalty = anomalies.length * 0.05;
    return Math.max(0, Math.min(1, baseContribution - anomalyPenalty));
  }

  private calculateTotalDuration(sessions: any[]): number {
    return sessions.reduce((total, session) => {
      const start = new Date(session.start_time).getTime();
      const end = new Date(session.end_time || Date.now()).getTime();
      return total + (end - start);
    }, 0);
  }

  private calculateSessionRisk(session: any, redisData: any): any {
    // Implementation for session risk calculation
    return {
      score: 0.3,
      level: 'low',
      factors: {}
    };
  }

  private async checkAnomalyResponsePolicy(anomaly: any): Promise<boolean> {
    // Check if automated response should be triggered
    return anomaly.severity === 'high' || anomaly.severity === 'critical';
  }

  private async sendSecurityNotifications(userId: string, alerts: string[]): Promise<void> {
    // Implementation for sending notifications
    console.log(`Security notifications sent to user ${userId}:`, alerts);
  }
}