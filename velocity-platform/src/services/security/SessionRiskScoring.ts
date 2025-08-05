/**
 * Session Risk Scoring Engine
 * Continuously evaluates session risk based on multiple factors
 */

import { geolocationService } from '../intelligence/GeolocationService';
import { behaviorAPI } from '../api/BehaviorAPI';

export interface SessionRiskFactors {
  // User behavior factors
  behaviorAnomalies: number; // Count of recent anomalies
  behaviorConfidence: number; // 0-1 confidence in behavior baseline
  typingSpeedDeviation: number; // Deviation from normal typing speed
  navigationAnomalies: number; // Unusual navigation patterns
  
  // Device factors
  deviceTrustScore: number; // 0-1 device trust level
  deviceChanges: number; // Number of device characteristic changes
  newFingerprint: boolean; // Whether device fingerprint is new
  
  // Location factors
  locationRiskScore: number; // 0-1 location risk
  newLocation: boolean; // Whether location is new for user
  vpnDetected: boolean; // VPN/proxy detection
  threatIntelligence: number; // Threat intelligence score
  
  // Temporal factors
  unusualTimeAccess: boolean; // Access outside normal hours
  sessionDuration: number; // Current session length in minutes
  rapidActionSequence: boolean; // Unusually rapid actions
  
  // Security factors
  failedAuthAttempts: number; // Recent failed auth attempts
  privilegeEscalation: boolean; // Attempt to access higher privileges
  suspiciousRequests: number; // Count of suspicious API requests
  
  // External factors
  reputationScore: number; // External reputation score for IP/user
  correlatedThreats: number; // Correlated threats from other sources
}

export interface SessionRiskAssessment {
  overallRiskScore: number; // 0-1 overall risk
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1 confidence in assessment
  factors: SessionRiskFactors;
  riskReasons: string[];
  recommendedActions: string[];
  trustImpact: number; // -1 to 1, impact on user's trust score
  requiresAction: boolean;
  actionType?: 'monitor' | 'challenge' | 'restrict' | 'block';
  lastUpdated: Date;
}

export interface SessionMetrics {
  sessionId: string;
  userId: string;
  startTime: Date;
  lastActivity: Date;
  actionsPerformed: number;
  pagesVisited: string[];
  dataAccessed: string[];
  privilegesUsed: string[];
}

export class SessionRiskScoring {
  private readonly RISK_WEIGHTS = {
    behavior: 0.25,
    device: 0.20,
    location: 0.20,
    temporal: 0.15,
    security: 0.15,
    external: 0.05
  };

  private readonly RISK_THRESHOLDS = {
    low: 0.3,
    medium: 0.5,
    high: 0.7,
    critical: 0.85
  };

  /**
   * Calculate comprehensive session risk score
   */
  async calculateSessionRisk(
    sessionId: string,
    userId: string,
    currentIP: string,
    sessionMetrics: SessionMetrics
  ): Promise<SessionRiskAssessment> {
    try {
      // Gather risk factors from all sources
      const factors = await this.gatherRiskFactors(userId, currentIP, sessionMetrics);
      
      // Calculate weighted risk score
      const overallRiskScore = this.calculateWeightedRiskScore(factors);
      
      // Determine risk level and confidence
      const riskLevel = this.determineRiskLevel(overallRiskScore);
      const confidence = this.calculateConfidence(factors);
      
      // Generate risk analysis
      const riskReasons = this.identifyRiskReasons(factors);
      const recommendedActions = this.generateRecommendations(riskLevel, factors);
      const trustImpact = this.calculateTrustImpact(overallRiskScore, factors);
      
      // Determine if immediate action is required
      const { requiresAction, actionType } = this.determineActionRequired(riskLevel, factors);

      return {
        overallRiskScore,
        riskLevel,
        confidence,
        factors,
        riskReasons,
        recommendedActions,
        trustImpact,
        requiresAction,
        actionType,
        lastUpdated: new Date()
      };

    } catch (error) {
      console.error('Session risk calculation failed:', error);
      return this.createFallbackRiskAssessment();
    }
  }

  /**
   * Gather risk factors from all available sources
   */
  private async gatherRiskFactors(
    userId: string,
    currentIP: string,
    sessionMetrics: SessionMetrics
  ): Promise<SessionRiskFactors> {
    try {
      // Get behavior analytics
      const behaviorAnalytics = await behaviorAPI.getAnalytics(userId, 2 * 60 * 60 * 1000); // Last 2 hours
      
      // Get location risk assessment
      const locationRisk = await geolocationService.assessLocationRisk(currentIP);
      const locationData = await geolocationService.getLocationData(currentIP);
      
      // Calculate session-specific factors
      const sessionAge = Date.now() - sessionMetrics.startTime.getTime();
      const sessionDurationMinutes = sessionAge / (1000 * 60);
      
      return {
        // Behavior factors
        behaviorAnomalies: behaviorAnalytics.anomalyHistory?.length || 0,
        behaviorConfidence: behaviorAnalytics.trustContribution || 0.5,
        typingSpeedDeviation: this.calculateTypingSpeedDeviation(behaviorAnalytics),
        navigationAnomalies: this.calculateNavigationAnomalies(behaviorAnalytics),
        
        // Device factors (would be populated from device trust manager)
        deviceTrustScore: 0.7, // Placeholder
        deviceChanges: 0,
        newFingerprint: false,
        
        // Location factors
        locationRiskScore: locationRisk.riskScore,
        newLocation: this.isNewLocation(userId, locationData),
        vpnDetected: locationData.vpnDetected || locationData.proxyDetected,
        threatIntelligence: this.calculateThreatScore(locationData),
        
        // Temporal factors
        unusualTimeAccess: this.isUnusualTimeAccess(userId, new Date()),
        sessionDuration: sessionDurationMinutes,
        rapidActionSequence: this.detectRapidActions(sessionMetrics),
        
        // Security factors
        failedAuthAttempts: await this.getFailedAuthAttempts(userId),
        privilegeEscalation: this.detectPrivilegeEscalation(sessionMetrics),
        suspiciousRequests: this.countSuspiciousRequests(sessionMetrics),
        
        // External factors
        reputationScore: await this.getReputationScore(currentIP),
        correlatedThreats: await this.getCorrelatedThreats(userId, currentIP)
      };

    } catch (error) {
      console.error('Failed to gather risk factors:', error);
      return this.createDefaultRiskFactors();
    }
  }

  /**
   * Calculate weighted risk score from all factors
   */
  private calculateWeightedRiskScore(factors: SessionRiskFactors): number {
    // Behavior risk component
    const behaviorRisk = Math.min(1.0, 
      (factors.behaviorAnomalies * 0.1) + 
      (1 - factors.behaviorConfidence) + 
      (factors.typingSpeedDeviation * 0.2) +
      (factors.navigationAnomalies * 0.1)
    );

    // Device risk component
    const deviceRisk = Math.min(1.0,
      (1 - factors.deviceTrustScore) +
      (factors.deviceChanges * 0.1) +
      (factors.newFingerprint ? 0.3 : 0)
    );

    // Location risk component
    const locationRisk = Math.min(1.0,
      factors.locationRiskScore +
      (factors.newLocation ? 0.2 : 0) +
      (factors.vpnDetected ? 0.1 : 0) +
      (factors.threatIntelligence * 0.3)
    );

    // Temporal risk component
    const temporalRisk = Math.min(1.0,
      (factors.unusualTimeAccess ? 0.3 : 0) +
      (factors.sessionDuration > 480 ? 0.2 : 0) + // 8+ hours
      (factors.rapidActionSequence ? 0.2 : 0)
    );

    // Security risk component
    const securityRisk = Math.min(1.0,
      (factors.failedAuthAttempts * 0.1) +
      (factors.privilegeEscalation ? 0.4 : 0) +
      (factors.suspiciousRequests * 0.05)
    );

    // External risk component
    const externalRisk = Math.min(1.0,
      (1 - factors.reputationScore) +
      (factors.correlatedThreats * 0.2)
    );

    // Calculate weighted sum
    const weightedScore = 
      (behaviorRisk * this.RISK_WEIGHTS.behavior) +
      (deviceRisk * this.RISK_WEIGHTS.device) +
      (locationRisk * this.RISK_WEIGHTS.location) +
      (temporalRisk * this.RISK_WEIGHTS.temporal) +
      (securityRisk * this.RISK_WEIGHTS.security) +
      (externalRisk * this.RISK_WEIGHTS.external);

    return Math.max(0, Math.min(1, weightedScore));
  }

  /**
   * Determine risk level from score
   */
  private determineRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= this.RISK_THRESHOLDS.critical) return 'critical';
    if (score >= this.RISK_THRESHOLDS.high) return 'high';
    if (score >= this.RISK_THRESHOLDS.medium) return 'medium';
    return 'low';
  }

  /**
   * Calculate confidence in the risk assessment
   */
  private calculateConfidence(factors: SessionRiskFactors): number {
    let confidence = 0.7; // Base confidence

    // Increase confidence with more behavior data
    if (factors.behaviorConfidence > 0.8) confidence += 0.1;
    
    // Increase confidence with strong location data
    if (!factors.vpnDetected && factors.threatIntelligence < 0.3) confidence += 0.1;
    
    // Decrease confidence for uncertain factors
    if (factors.newFingerprint || factors.newLocation) confidence -= 0.1;

    return Math.max(0.1, Math.min(1.0, confidence));
  }

  /**
   * Identify specific risk reasons
   */
  private identifyRiskReasons(factors: SessionRiskFactors): string[] {
    const reasons: string[] = [];

    if (factors.behaviorAnomalies > 3) {
      reasons.push(`Multiple behavior anomalies detected (${factors.behaviorAnomalies})`);
    }
    
    if (factors.threatIntelligence > 0.5) {
      reasons.push('Access from known threat source');
    }
    
    if (factors.vpnDetected) {
      reasons.push('VPN or proxy detected');
    }
    
    if (factors.failedAuthAttempts > 5) {
      reasons.push(`High number of failed authentication attempts (${factors.failedAuthAttempts})`);
    }
    
    if (factors.privilegeEscalation) {
      reasons.push('Privilege escalation attempt detected');
    }
    
    if (factors.rapidActionSequence) {
      reasons.push('Unusually rapid action sequence detected');
    }
    
    if (factors.sessionDuration > 480) {
      reasons.push(`Extremely long session duration (${Math.round(factors.sessionDuration)} minutes)`);
    }

    return reasons;
  }

  /**
   * Generate security recommendations
   */
  private generateRecommendations(
    riskLevel: string, 
    factors: SessionRiskFactors
  ): string[] {
    const recommendations: string[] = [];

    switch (riskLevel) {
      case 'critical':
        recommendations.push('Terminate session immediately');
        recommendations.push('Require strong re-authentication');
        recommendations.push('Alert security team');
        break;
        
      case 'high':
        recommendations.push('Require additional verification');
        recommendations.push('Limit access to sensitive resources');
        recommendations.push('Increase monitoring frequency');
        break;
        
      case 'medium':
        recommendations.push('Consider step-up authentication');
        recommendations.push('Monitor session closely');
        if (factors.newLocation) {
          recommendations.push('Notify user of new location access');
        }
        break;
        
      case 'low':
        recommendations.push('Continue standard monitoring');
        break;
    }

    return recommendations;
  }

  /**
   * Calculate impact on user's trust score
   */
  private calculateTrustImpact(score: number, factors: SessionRiskFactors): number {
    let impact = 0;

    // Negative impact for high risk
    if (score > 0.7) {
      impact -= (score - 0.7) * 0.5;
    }

    // Positive impact for low risk with good behavior
    if (score < 0.3 && factors.behaviorConfidence > 0.8) {
      impact += 0.1;
    }

    return Math.max(-0.3, Math.min(0.2, impact));
  }

  /**
   * Determine if immediate action is required
   */
  private determineActionRequired(
    riskLevel: string, 
    factors: SessionRiskFactors
  ): { requiresAction: boolean; actionType?: string } {
    switch (riskLevel) {
      case 'critical':
        return { requiresAction: true, actionType: 'block' };
      case 'high':
        if (factors.privilegeEscalation || factors.threatIntelligence > 0.7) {
          return { requiresAction: true, actionType: 'restrict' };
        }
        return { requiresAction: true, actionType: 'challenge' };
      case 'medium':
        if (factors.behaviorAnomalies > 5 || factors.failedAuthAttempts > 10) {
          return { requiresAction: true, actionType: 'challenge' };
        }
        return { requiresAction: true, actionType: 'monitor' };
      default:
        return { requiresAction: false };
    }
  }

  // Helper methods for calculating specific risk factors

  private calculateTypingSpeedDeviation(analytics: any): number {
    if (!analytics.averageMetrics?.averageTypingSpeed) return 0;
    
    const currentSpeed = analytics.averageMetrics.averageTypingSpeed;
    const expectedSpeed = 60; // Average WPM
    const deviation = Math.abs(currentSpeed - expectedSpeed) / expectedSpeed;
    
    return Math.min(1.0, deviation);
  }

  private calculateNavigationAnomalies(analytics: any): number {
    return analytics.anomalyHistory?.filter(
      (a: any) => a.type === 'navigation'
    ).length || 0;
  }

  private isNewLocation(_userId: string, _locationData: any): boolean {
    // Implementation would check against user's location history
    return false;
  }

  private calculateThreatScore(locationData: any): number {
    let score = 0;
    
    if (locationData.threatLevel === 'critical') score = 1.0;
    else if (locationData.threatLevel === 'high') score = 0.8;
    else if (locationData.threatLevel === 'medium') score = 0.5;
    else score = 0.2;
    
    return score;
  }

  private isUnusualTimeAccess(_userId: string, _timestamp: Date): boolean {
    // Implementation would check against user's normal access patterns
    const hour = new Date().getHours();
    return hour < 6 || hour > 23; // Simple check for unusual hours
  }

  private detectRapidActions(sessionMetrics: SessionMetrics): boolean {
    const sessionAge = Date.now() - sessionMetrics.startTime.getTime();
    const actionsPerMinute = sessionMetrics.actionsPerformed / (sessionAge / 60000);
    
    return actionsPerMinute > 30; // More than 30 actions per minute
  }

  private async getFailedAuthAttempts(_userId: string): Promise<number> {
    // Implementation would query failed auth attempts from database
    return Math.floor(Math.random() * 10);
  }

  private detectPrivilegeEscalation(sessionMetrics: SessionMetrics): boolean {
    // Check if user accessed higher privileges than normal
    const adminActions = ['admin', 'system', 'config', 'user-management'];
    return sessionMetrics.privilegesUsed.some(p => adminActions.includes(p));
  }

  private countSuspiciousRequests(sessionMetrics: SessionMetrics): number {
    // Implementation would analyze API requests for suspicious patterns
    const suspiciousPages = sessionMetrics.pagesVisited.filter(page => 
      page.includes('admin') || page.includes('system') || page.includes('..')
    );
    return suspiciousPages.length;
  }

  private async getReputationScore(_ip: string): Promise<number> {
    // Implementation would query external reputation services
    return 0.8;
  }

  private async getCorrelatedThreats(_userId: string, _ip: string): Promise<number> {
    // Implementation would check for correlated threats
    return 0;
  }

  private createDefaultRiskFactors(): SessionRiskFactors {
    return {
      behaviorAnomalies: 0,
      behaviorConfidence: 0.5,
      typingSpeedDeviation: 0,
      navigationAnomalies: 0,
      deviceTrustScore: 0.7,
      deviceChanges: 0,
      newFingerprint: false,
      locationRiskScore: 0.3,
      newLocation: false,
      vpnDetected: false,
      threatIntelligence: 0.2,
      unusualTimeAccess: false,
      sessionDuration: 30,
      rapidActionSequence: false,
      failedAuthAttempts: 0,
      privilegeEscalation: false,
      suspiciousRequests: 0,
      reputationScore: 0.8,
      correlatedThreats: 0
    };
  }

  private createFallbackRiskAssessment(): SessionRiskAssessment {
    return {
      overallRiskScore: 0.5,
      riskLevel: 'medium',
      confidence: 0.3,
      factors: this.createDefaultRiskFactors(),
      riskReasons: ['Unable to assess session risk - using conservative estimate'],
      recommendedActions: ['Manual security review recommended'],
      trustImpact: -0.1,
      requiresAction: true,
      actionType: 'monitor',
      lastUpdated: new Date()
    };
  }
}

export const sessionRiskScoring = new SessionRiskScoring();