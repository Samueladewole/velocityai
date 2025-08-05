/**
 * Backend API Service for Behavior Tracking
 * Handles server-side behavior analysis and data persistence
 */

import { BehaviorSession, BehaviorMetrics } from '../tracking/BehaviorTracker';
import { DeviceTrust } from '../trust/DeviceTrustManager';

export interface BehaviorAnalysisResult {
  isAnomaly: boolean;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  details: {
    typingAnomalies: any[];
    mouseAnomalies: any[];
    navigationAnomalies: any[];
    temporalAnomalies: any[];
  };
  recommendations: string[];
}

export interface UserBehaviorBaseline {
  userId: string;
  typingCharacteristics: {
    averageSpeed: number;
    keyPressDuration: number;
    timeBetweenKeys: number;
    rhythmPattern: number[];
  };
  mouseCharacteristics: {
    averageSpeed: number;
    clickPrecision: number;
    scrollPattern: number[];
  };
  navigationPatterns: {
    commonPages: string[];
    actionSequences: string[];
    timeOnPage: number;
  };
  temporalPatterns: {
    activeHours: number[];
    sessionDuration: number;
    accessFrequency: number;
  };
  confidence: number;
  lastUpdated: Date;
  sampleCount: number;
}

export interface BehaviorAssessmentRequest {
  sessionId: string;
  userId: string;
  deviceId: string;
  currentSession: Partial<BehaviorSession>;
  metrics: BehaviorMetrics;
  timestamp: string;
}

export interface BehaviorUpdateRequest {
  sessionId: string;
  userId: string;
  deviceId: string;
  timestamp: string;
  incrementalData: {
    typingPatterns: any[];
    mouseMovements: any[];
    recentEvents: any[];
    currentMetrics: any;
  };
}

export class BehaviorAPI {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl: string = '/api', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey || process.env.BEHAVIOR_API_KEY || '';
  }

  /**
   * Store a complete behavior session
   */
  async storeSession(request: BehaviorAssessmentRequest): Promise<{
    sessionId: string;
    stored: boolean;
    analysis: BehaviorAnalysisResult;
  }> {
    try {
      // Validate request
      this.validateSessionRequest(request);

      // Get user baseline for comparison
      const baseline = await this.getUserBaseline(request.userId);

      // Perform behavior analysis
      const analysis = await this.analyzeBehavior(request.metrics, baseline);

      // Store session data in database
      const stored = await this.persistSessionData(request);

      // Update user baseline if this is normal behavior
      if (!analysis.isAnomaly && analysis.confidence > 0.7) {
        await this.updateUserBaseline(request.userId, request.metrics);
      }

      // Log security event if anomaly detected
      if (analysis.isAnomaly) {
        await this.logSecurityEvent({
          userId: request.userId,
          deviceId: request.deviceId,
          sessionId: request.sessionId,
          eventType: 'behavior_anomaly',
          severity: analysis.riskLevel,
          details: analysis.details,
          timestamp: request.timestamp
        });
      }

      return {
        sessionId: request.sessionId,
        stored,
        analysis
      };

    } catch (error) {
      console.error('Failed to store behavior session:', error);
      throw new Error(`Session storage failed: ${error.message}`);
    }
  }

  /**
   * Process incremental behavior updates
   */
  async updateBehavior(request: BehaviorUpdateRequest): Promise<{
    processed: boolean;
    alertsTriggered: string[];
    riskAssessment: any;
  }> {
    try {
      // Process real-time behavior data
      const realtimeAnalysis = await this.analyzeRealtimeBehavior(request);

      // Check for immediate threats
      const alerts = await this.checkImmediateThreats(request, realtimeAnalysis);

      // Update ongoing session metrics
      await this.updateSessionMetrics(request.sessionId, request.incrementalData);

      // Calculate current risk level
      const riskAssessment = await this.assessCurrentRisk(request.userId, realtimeAnalysis);

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
   * Get behavior analytics for a user
   */
  async getAnalytics(userId: string, timeRange: number): Promise<{
    sessionCount: number;
    totalDuration: number;
    averageMetrics: BehaviorMetrics;
    trendAnalysis: any;
    anomalyHistory: any[];
    trustContribution: number;
  }> {
    try {
      // Fetch sessions from database
      const sessions = await this.fetchUserSessions(userId, timeRange);

      // Calculate aggregate metrics
      const analytics = await this.calculateAggregateMetrics(sessions);

      // Analyze trends
      const trends = await this.analyzeBehaviorTrends(sessions);

      // Get anomaly history
      const anomalies = await this.getAnomalyHistory(userId, timeRange);

      // Calculate trust contribution
      const trustContribution = await this.calculateTrustContribution(analytics, anomalies);

      return {
        sessionCount: sessions.length,
        totalDuration: sessions.reduce((sum, s) => sum + s.duration, 0),
        averageMetrics: analytics.averageMetrics,
        trendAnalysis: trends,
        anomalyHistory: anomalies,
        trustContribution
      };

    } catch (error) {
      console.error('Failed to get analytics:', error);
      throw new Error(`Analytics retrieval failed: ${error.message}`);
    }
  }

  /**
   * Get user behavior baseline
   */
  async getUserBaseline(userId: string): Promise<UserBehaviorBaseline | null> {
    try {
      const response = await fetch(`${this.baseUrl}/behavior/baseline/${userId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No baseline exists yet
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Failed to get user baseline:', error);
      return null;
    }
  }

  /**
   * Analyze behavior patterns for anomalies
   */
  private async analyzeBehavior(
    metrics: BehaviorMetrics,
    baseline: UserBehaviorBaseline | null
  ): Promise<BehaviorAnalysisResult> {
    if (!baseline) {
      // No baseline yet - everything is normal during learning phase
      return {
        isAnomaly: false,
        confidence: 0.5,
        riskLevel: 'low',
        details: {
          typingAnomalies: [],
          mouseAnomalies: [],
          navigationAnomalies: [],
          temporalAnomalies: []
        },
        recommendations: ['Building behavioral baseline - continue normal usage']
      };
    }

    const anomalies = {
      typingAnomalies: await this.detectTypingAnomalies(metrics, baseline),
      mouseAnomalies: await this.detectMouseAnomalies(metrics, baseline),
      navigationAnomalies: await this.detectNavigationAnomalies(metrics, baseline),
      temporalAnomalies: await this.detectTemporalAnomalies(metrics, baseline)
    };

    const totalAnomalies = Object.values(anomalies).flat().length;
    const isAnomaly = totalAnomalies > 2; // Threshold for anomaly detection
    
    const confidence = Math.min(0.95, baseline.confidence * (1 - totalAnomalies * 0.1));
    const riskLevel = this.calculateRiskLevel(totalAnomalies, confidence);

    return {
      isAnomaly,
      confidence,
      riskLevel,
      details: anomalies,
      recommendations: this.generateRecommendations(anomalies, riskLevel)
    };
  }

  /**
   * Detect typing pattern anomalies
   */
  private async detectTypingAnomalies(metrics: BehaviorMetrics, baseline: UserBehaviorBaseline): Promise<any[]> {
    const anomalies = [];
    
    const speedDiff = Math.abs(metrics.averageTypingSpeed - baseline.typingCharacteristics.averageSpeed);
    if (speedDiff > baseline.typingCharacteristics.averageSpeed * 0.3) { // 30% deviation
      anomalies.push({
        type: 'typing_speed_deviation',
        severity: speedDiff > baseline.typingCharacteristics.averageSpeed * 0.5 ? 'high' : 'medium',
        expected: baseline.typingCharacteristics.averageSpeed,
        observed: metrics.averageTypingSpeed,
        deviation: speedDiff
      });
    }

    const keyPressDiff = Math.abs(
      metrics.keystrokeDynamics.avgKeyPressDuration - baseline.typingCharacteristics.keyPressDuration
    );
    if (keyPressDiff > 50) { // 50ms difference
      anomalies.push({
        type: 'key_press_duration_anomaly',
        severity: keyPressDiff > 100 ? 'high' : 'medium',
        expected: baseline.typingCharacteristics.keyPressDuration,
        observed: metrics.keystrokeDynamics.avgKeyPressDuration,
        deviation: keyPressDiff
      });
    }

    return anomalies;
  }

  /**
   * Detect mouse movement anomalies
   */
  private async detectMouseAnomalies(metrics: BehaviorMetrics, baseline: UserBehaviorBaseline): Promise<any[]> {
    const anomalies = [];
    
    const speedDiff = Math.abs(metrics.mouseCharacteristics.averageSpeed - baseline.mouseCharacteristics.averageSpeed);
    if (speedDiff > baseline.mouseCharacteristics.averageSpeed * 0.4) { // 40% deviation
      anomalies.push({
        type: 'mouse_speed_deviation',
        severity: speedDiff > baseline.mouseCharacteristics.averageSpeed * 0.6 ? 'high' : 'medium',
        expected: baseline.mouseCharacteristics.averageSpeed,
        observed: metrics.mouseCharacteristics.averageSpeed,
        deviation: speedDiff
      });
    }

    const precisionDiff = Math.abs(
      metrics.mouseCharacteristics.clickPrecision - baseline.mouseCharacteristics.clickPrecision
    );
    if (precisionDiff > 0.2) { // 20% precision difference
      anomalies.push({
        type: 'click_precision_anomaly',
        severity: precisionDiff > 0.3 ? 'high' : 'medium',
        expected: baseline.mouseCharacteristics.clickPrecision,
        observed: metrics.mouseCharacteristics.clickPrecision,
        deviation: precisionDiff
      });
    }

    return anomalies;
  }

  /**
   * Detect navigation pattern anomalies
   */
  private async detectNavigationAnomalies(metrics: BehaviorMetrics, baseline: UserBehaviorBaseline): Promise<any[]> {
    const anomalies = [];
    
    const timeOnPageDiff = Math.abs(
      metrics.navigationBehavior.averageTimeOnPage - baseline.navigationPatterns.timeOnPage
    );
    if (timeOnPageDiff > baseline.navigationPatterns.timeOnPage * 0.5) { // 50% deviation
      anomalies.push({
        type: 'time_on_page_anomaly',
        severity: timeOnPageDiff > baseline.navigationPatterns.timeOnPage ? 'medium' : 'low',
        expected: baseline.navigationPatterns.timeOnPage,
        observed: metrics.navigationBehavior.averageTimeOnPage,
        deviation: timeOnPageDiff
      });
    }

    return anomalies;
  }

  /**
   * Detect temporal pattern anomalies
   */
  private async detectTemporalAnomalies(metrics: BehaviorMetrics, baseline: UserBehaviorBaseline): Promise<any[]> {
    const anomalies = [];
    const currentHour = new Date().getHours();
    
    if (!baseline.temporalPatterns.activeHours.includes(currentHour)) {
      anomalies.push({
        type: 'unusual_access_time',
        severity: 'medium',
        expected: baseline.temporalPatterns.activeHours,
        observed: currentHour,
        details: 'Access outside typical hours'
      });
    }

    return anomalies;
  }

  /**
   * Calculate risk level based on anomalies
   */
  private calculateRiskLevel(anomalyCount: number, confidence: number): 'low' | 'medium' | 'high' | 'critical' {
    if (anomalyCount === 0) return 'low';
    if (anomalyCount <= 2 && confidence > 0.7) return 'low';
    if (anomalyCount <= 4 && confidence > 0.5) return 'medium';
    if (anomalyCount <= 6 && confidence > 0.3) return 'high';
    return 'critical';
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(anomalies: any, riskLevel: string): string[] {
    const recommendations = [];
    
    if (riskLevel === 'low') {
      recommendations.push('Behavior appears normal - continue monitoring');
    } else if (riskLevel === 'medium') {
      recommendations.push('Some behavioral changes detected - verify user identity');
      recommendations.push('Consider additional authentication if patterns persist');
    } else if (riskLevel === 'high') {
      recommendations.push('Significant behavioral anomalies detected - require step-up authentication');
      recommendations.push('Monitor session closely for additional threats');
    } else {
      recommendations.push('Critical behavioral anomalies - consider blocking session');
      recommendations.push('Require strong authentication before proceeding');
      recommendations.push('Alert security team for investigation');
    }

    return recommendations;
  }

  /**
   * Analyze real-time behavior data
   */
  private async analyzeRealtimeBehavior(request: BehaviorUpdateRequest): Promise<any> {
    const currentMetrics = request.incrementalData.currentMetrics;
    
    return {
      activityLevel: currentMetrics.currentActivityLevel,
      anomalyCount: currentMetrics.anomalyIndicators?.length || 0,
      typingSpeed: currentMetrics.recentTypingSpeed,
      mouseActivity: currentMetrics.recentMouseActivity,
      sessionDuration: currentMetrics.sessionDuration,
      timestamp: request.timestamp
    };
  }

  /**
   * Check for immediate security threats
   */
  private async checkImmediateThreats(request: BehaviorUpdateRequest, analysis: any): Promise<string[]> {
    const alerts = [];
    
    if (analysis.anomalyCount > 3) {
      alerts.push('multiple_anomalies_detected');
    }
    
    if (analysis.activityLevel === 'idle' && analysis.sessionDuration > 30 * 60 * 1000) {
      alerts.push('session_timeout_risk');
    }
    
    if (analysis.typingSpeed > 200) { // Impossibly fast typing
      alerts.push('bot_activity_suspected');
    }

    return alerts;
  }

  /**
   * Assess current risk based on behavior
   */
  private async assessCurrentRisk(userId: string, analysis: any): Promise<any> {
    let riskScore = 0.3; // Base risk
    
    // Increase risk based on anomalies
    riskScore += analysis.anomalyCount * 0.1;
    
    // Decrease risk for normal activity
    if (analysis.activityLevel === 'medium' || analysis.activityLevel === 'high') {
      riskScore -= 0.1;
    }
    
    // Increase risk for very long sessions
    if (analysis.sessionDuration > 4 * 60 * 60 * 1000) { // 4 hours
      riskScore += 0.1;
    }
    
    riskScore = Math.max(0, Math.min(1, riskScore));
    
    return {
      level: riskScore < 0.3 ? 'low' : riskScore < 0.6 ? 'medium' : 'high',
      score: riskScore,
      confidence: 0.8,
      factors: {
        anomalyCount: analysis.anomalyCount,
        activityLevel: analysis.activityLevel,
        sessionDuration: analysis.sessionDuration
      }
    };
  }

  // Database interaction methods (would connect to actual database)
  private async persistSessionData(request: BehaviorAssessmentRequest): Promise<boolean> {
    // Implementation would store session data in database
    console.log('Storing session data:', request.sessionId);
    return true;
  }

  private async updateUserBaseline(userId: string, metrics: BehaviorMetrics): Promise<void> {
    // Implementation would update user behavior baseline in database
    console.log('Updating baseline for user:', userId);
  }

  private async logSecurityEvent(event: any): Promise<void> {
    // Implementation would log security events
    console.log('Security event logged:', event.eventType);
  }

  private async updateSessionMetrics(sessionId: string, data: any): Promise<void> {
    // Implementation would update ongoing session metrics
    console.log('Updating session metrics:', sessionId);
  }

  private async fetchUserSessions(userId: string, timeRange: number): Promise<any[]> {
    // Implementation would fetch user sessions from database
    return [];
  }

  private async calculateAggregateMetrics(sessions: any[]): Promise<any> {
    // Implementation would calculate aggregate metrics
    return { averageMetrics: {} };
  }

  private async analyzeBehaviorTrends(sessions: any[]): Promise<any> {
    // Implementation would analyze behavior trends
    return {};
  }

  private async getAnomalyHistory(userId: string, timeRange: number): Promise<any[]> {
    // Implementation would get anomaly history
    return [];
  }

  private async calculateTrustContribution(analytics: any, anomalies: any[]): Promise<number> {
    // Implementation would calculate trust contribution
    return 0.7;
  }

  // Helper methods
  private validateSessionRequest(request: BehaviorAssessmentRequest): void {
    if (!request.sessionId || !request.userId || !request.deviceId) {
      throw new Error('Missing required session data');
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    
    return headers;
  }
}

export const behaviorAPI = new BehaviorAPI();