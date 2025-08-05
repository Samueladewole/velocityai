/**
 * Invisible Trust Scoring Engine
 * Calculates user trust scores behind the scenes without user friction
 * Integrates with behavior tracking for continuous authentication
 */

import { behaviorAPI } from '../api/BehaviorAPI';
import { behaviorTracker } from '../tracking/BehaviorTracker';
import { geolocationService } from '../intelligence/GeolocationService';

export interface TrustSignal {
  type: 'device' | 'behavior' | 'location' | 'temporal';
  value: number; // 0-1 score
  confidence: number; // 0-1 confidence in this signal
  timestamp: Date;
}

export interface TrustAssessment {
  score: number; // 0-1 overall trust score
  confidence: number; // 0-1 confidence in assessment
  signals: TrustSignal[];
  requiresStepUp: boolean;
  riskFactors: string[];
  userExperienceImpact: 'none' | 'minimal' | 'moderate';
}

export interface DeviceFingerprint {
  id: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  localStorageEnabled: boolean;
  sessionStorageEnabled: boolean;
  webglRenderer?: string;
  webglVendor?: string;
  canvasFingerprint?: string;
}

export interface BehaviorMetrics {
  typingPatterns: {
    avgKeyDelay: number;
    keystrokeDynamics: number[];
    typingRhythm: number;
  };
  mouseMovements: {
    avgSpeed: number;
    movementPattern: string;
    clickPrecision: number;
  };
  navigationPatterns: {
    commonPages: string[];
    sessionDuration: number;
    actionSequences: string[];
  };
}

export class InvisibleTrustEngine {
  private readonly TRUST_THRESHOLDS = {
    HIGH: 0.8,
    MEDIUM: 0.6,
    LOW: 0.4
  };

  private readonly SIGNAL_WEIGHTS = {
    device: 0.35,
    behavior: 0.25,
    location: 0.25,
    temporal: 0.15
  };

  /**
   * Main trust assessment - runs silently in background
   */
  async assessTrust(
    userId: string,
    request: {
      ip: string;
      userAgent: string;
      headers: Record<string, string>;
      timestamp: Date;
    }
  ): Promise<TrustAssessment> {
    try {
      // Gather trust signals in parallel (non-blocking)
      const signals = await Promise.all([
        this.assessDeviceTrust(userId, request),
        this.assessBehaviorTrust(userId, request),
        this.assessLocationTrust(userId, request.ip),
        this.assessTemporalTrust(userId, request.timestamp)
      ]);

      // Calculate weighted trust score
      const score = this.calculateWeightedScore(signals);
      const confidence = this.calculateConfidence(signals);
      
      // Determine user experience impact
      const requiresStepUp = score < this.TRUST_THRESHOLDS.MEDIUM;
      const userExperienceImpact = this.determineUXImpact(score);
      const riskFactors = this.identifyRiskFactors(signals);

      return {
        score,
        confidence,
        signals,
        requiresStepUp,
        riskFactors,
        userExperienceImpact
      };
    } catch (error) {
      console.error('Trust assessment failed:', error);
      
      // Fail safely - conservative approach
      return {
        score: 0.3, // Low trust when assessment fails
        confidence: 0.1,
        signals: [],
        requiresStepUp: true,
        riskFactors: ['Assessment failure'],
        userExperienceImpact: 'moderate'
      };
    }
  }

  /**
   * Device fingerprinting and trust assessment
   */
  private async assessDeviceTrust(
    userId: string,
    request: { userAgent: string; headers: Record<string, string> }
  ): Promise<TrustSignal> {
    try {
      // Generate device fingerprint
      const fingerprint = this.generateDeviceFingerprint(request);
      
      // Check against known devices for this user
      const knownDevices = await this.getKnownDevices(userId);
      const deviceMatch = this.findDeviceMatch(fingerprint, knownDevices);

      let trustValue = 0.3; // Default for unknown device
      
      if (deviceMatch) {
        if (deviceMatch.similarity > 0.95) {
          trustValue = 0.9; // Exact match
        } else if (deviceMatch.similarity > 0.8) {
          trustValue = 0.7; // Close match (minor browser updates, etc.)
        } else {
          trustValue = 0.5; // Partial match
        }
      }

      return {
        type: 'device',
        value: trustValue,
        confidence: deviceMatch ? deviceMatch.similarity : 0.8,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Device trust assessment failed:', error);
      return {
        type: 'device',
        value: 0.2, // Conservative fallback
        confidence: 0.1,
        timestamp: new Date()
      };
    }
  }

  /**
   * Behavioral pattern analysis - now integrated with real-time tracking
   */
  private async assessBehaviorTrust(
    userId: string,
    _request: any
  ): Promise<TrustSignal> {
    try {
      // Get user's behavioral baseline from API
      const baseline = await behaviorAPI.getUserBaseline(userId);
      
      if (!baseline) {
        // New user - start with neutral trust, will improve over time
        return {
          type: 'behavior',
          value: 0.5,
          confidence: 0.3,
          timestamp: new Date()
        };
      }

      // Get recent behavior analytics
      const analytics = await behaviorAPI.getAnalytics(userId, 24 * 60 * 60 * 1000); // Last 24 hours
      
      // Calculate behavior trust based on recent patterns
      const behaviorScore = this.calculateBehaviorTrustScore(analytics, baseline);
      
      // Adjust confidence based on data quality and recency
      const confidence = this.calculateBehaviorConfidence(analytics, baseline);

      return {
        type: 'behavior',
        value: behaviorScore,
        confidence,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Behavior trust assessment failed:', error);
      return {
        type: 'behavior',
        value: 0.5,
        confidence: 0.1,
        timestamp: new Date()
      };
    }
  }

  /**
   * Calculate behavior trust score from analytics
   */
  private calculateBehaviorTrustScore(analytics: any, baseline: any): number {
    if (!analytics || analytics.sessionCount === 0) {
      return 0.5; // Neutral score for no data
    }

    let score = 0.7; // Base score for having behavior data

    // Factor in anomaly count
    const recentAnomalies = analytics.anomalyHistory.filter(
      (a: any) => Date.now() - new Date(a.timestamp).getTime() < 2 * 60 * 60 * 1000 // Last 2 hours
    );
    
    if (recentAnomalies.length === 0) {
      score += 0.2; // Bonus for no recent anomalies
    } else if (recentAnomalies.length > 3) {
      score -= 0.3; // Penalty for multiple anomalies
    }

    // Factor in trust contribution
    score = Math.max(0.2, Math.min(1.0, score * analytics.trustContribution));

    // Apply baseline confidence modifier
    if (baseline.confidence > 0.8) {
      score += 0.1; // Bonus for high-confidence baseline
    }

    return Math.max(0.1, Math.min(1.0, score));
  }

  /**
   * Calculate confidence in behavior assessment
   */
  private calculateBehaviorConfidence(analytics: any, baseline: any): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence with more sessions
    confidence += Math.min(0.3, analytics.sessionCount * 0.05);

    // Increase confidence with higher baseline confidence
    if (baseline.confidence) {
      confidence += baseline.confidence * 0.3;
    }

    // Decrease confidence for very recent anomalies
    const recentAnomalies = analytics.anomalyHistory.filter(
      (a: any) => Date.now() - new Date(a.timestamp).getTime() < 30 * 60 * 1000 // Last 30 minutes
    );
    
    if (recentAnomalies.length > 0) {
      confidence -= recentAnomalies.length * 0.1;
    }

    return Math.max(0.1, Math.min(1.0, confidence));
  }

  /**
   * Start continuous behavior monitoring for a session
   */
  async startContinuousMonitoring(userId: string, deviceId: string): Promise<void> {
    try {
      // Initialize behavior tracking
      await behaviorTracker.initializeTracking(userId, deviceId);
      
      // Set up periodic trust reassessment
      this.setupPeriodicReassessment(userId);
      
    } catch (error) {
      console.error('Failed to start continuous monitoring:', error);
    }
  }

  /**
   * Stop continuous monitoring and get final assessment
   */
  async stopContinuousMonitoring(): Promise<any> {
    try {
      const finalMetrics = await behaviorTracker.stopTracking();
      return finalMetrics;
    } catch (error) {
      console.error('Failed to stop continuous monitoring:', error);
      return null;
    }
  }

  /**
   * Set up periodic trust reassessment during session
   */
  private setupPeriodicReassessment(userId: string): void {
    // Reassess trust every 5 minutes during active session
    const interval = setInterval(async () => {
      try {
        const analytics = await behaviorAPI.getAnalytics(userId, 5 * 60 * 1000); // Last 5 minutes
        
        // Check for immediate risk factors
        if (analytics.anomalyHistory.some((a: any) => a.severity === 'critical')) {
          // Trigger immediate security response
          this.handleCriticalAnomaly(userId);
          clearInterval(interval);
        }
        
      } catch (error) {
        console.error('Periodic reassessment failed:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Clean up interval after 4 hours max
    setTimeout(() => {
      clearInterval(interval);
    }, 4 * 60 * 60 * 1000);
  }

  /**
   * Handle critical behavior anomalies
   */
  private async handleCriticalAnomaly(userId: string): Promise<void> {
    console.warn('Critical behavior anomaly detected for user:', userId);
    
    // Dispatch security event
    window.dispatchEvent(new CustomEvent('criticalSecurityAnomaly', {
      detail: {
        userId,
        timestamp: new Date(),
        reason: 'Critical behavior anomaly detected'
      }
    }));
  }

  /**
   * Location-based trust assessment - now with geolocation intelligence
   */
  private async assessLocationTrust(userId: string, ip: string): Promise<TrustSignal> {
    try {
      // Get comprehensive location data with threat intelligence
      const locationData = await geolocationService.getLocationData(ip);
      
      // Get user's location history for anomaly detection
      const locationHistory = await this.getUserLocationHistory(userId);
      
      // Assess location risk
      const locationRisk = await geolocationService.assessLocationRisk(ip, locationHistory);
      
      // Detect location anomalies
      const anomaly = await geolocationService.detectLocationAnomaly(ip, locationHistory);

      // Calculate base trust value from risk assessment
      let trustValue = 1.0 - locationRisk.riskScore;

      // Apply threat intelligence adjustments
      if (locationData.threatLevel === 'critical') {
        trustValue = Math.min(trustValue, 0.1);
      } else if (locationData.threatLevel === 'high') {
        trustValue = Math.min(trustValue, 0.3);
      } else if (locationData.threatLevel === 'medium') {
        trustValue = Math.min(trustValue, 0.6);
      }

      // Apply location anomaly adjustments
      if (anomaly.isAnomalous && anomaly.confidence > 0.7) {
        trustValue *= 0.7; // 30% reduction for anomalous locations
      }

      // Apply trust modifier from risk assessment
      trustValue = Math.max(0.05, Math.min(1.0, trustValue + locationRisk.trustModifier));

      // Calculate confidence based on data quality
      const confidence = this.calculateLocationConfidence(locationData, anomaly);

      return {
        type: 'location',
        value: trustValue,
        confidence,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Location trust assessment failed:', error);
      return {
        type: 'location',
        value: 0.5,
        confidence: 0.1,
        timestamp: new Date()
      };
    }
  }

  /**
   * Calculate confidence in location assessment
   */
  private calculateLocationConfidence(locationData: any, anomaly: any): number {
    let confidence = 0.7; // Base confidence

    // Increase confidence for high-accuracy location data
    if (locationData.accuracy > 80) {
      confidence += 0.1;
    }

    // Increase confidence for threat intelligence data
    if (locationData.threatReasons.length > 0) {
      confidence += 0.1;
    }

    // Decrease confidence for unknown/fallback data
    if (locationData.country === 'Unknown') {
      confidence -= 0.3;
    }

    // Factor in anomaly detection confidence
    if (anomaly.confidence > 0.8) {
      confidence += 0.1;
    }

    return Math.max(0.1, Math.min(1.0, confidence));
  }

  /**
   * Time-based pattern analysis
   */
  private async assessTemporalTrust(userId: string, timestamp: Date): Promise<TrustSignal> {
    try {
      // Get user's access patterns
      const accessPatterns = await this.getUserAccessPatterns(userId);
      
      if (!accessPatterns) {
        return {
          type: 'temporal',
          value: 0.5, // Neutral for new users
          confidence: 0.3,
          timestamp: new Date()
        };
      }

      // Check if current time matches user's patterns
      const timeScore = this.calculateTemporalScore(timestamp, accessPatterns);

      return {
        type: 'temporal',
        value: timeScore,
        confidence: 0.6,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Temporal trust assessment failed:', error);
      return {
        type: 'temporal',
        value: 0.5,
        confidence: 0.1,
        timestamp: new Date()
      };
    }
  }

  /**
   * Calculate weighted trust score from all signals
   */
  private calculateWeightedScore(signals: TrustSignal[]): number {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const signal of signals) {
      const weight = this.SIGNAL_WEIGHTS[signal.type] * signal.confidence;
      weightedSum += signal.value * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0.3;
  }

  /**
   * Calculate confidence in overall assessment
   */
  private calculateConfidence(signals: TrustSignal[]): number {
    const avgConfidence = signals.reduce((sum, signal) => sum + signal.confidence, 0) / signals.length;
    const signalCount = signals.length;
    
    // Higher confidence with more signals and higher individual confidences
    return Math.min(1.0, avgConfidence * (signalCount / 4));
  }

  /**
   * Determine UX impact level
   */
  private determineUXImpact(score: number): 'none' | 'minimal' | 'moderate' {
    if (score >= this.TRUST_THRESHOLDS.HIGH) {
      return 'none'; // No additional auth needed
    } else if (score >= this.TRUST_THRESHOLDS.MEDIUM) {
      return 'minimal'; // Light touch auth (push notification, SMS)
    } else {
      return 'moderate'; // Multi-factor or biometric required
    }
  }

  /**
   * Identify specific risk factors
   */
  private identifyRiskFactors(signals: TrustSignal[]): string[] {
    const riskFactors: string[] = [];

    for (const signal of signals) {
      if (signal.value < 0.3) {
        switch (signal.type) {
          case 'device':
            riskFactors.push('Unknown or suspicious device');
            break;
          case 'behavior':
            riskFactors.push('Unusual behavior patterns');
            break;
          case 'location':
            riskFactors.push('Unfamiliar or high-risk location');
            break;
          case 'temporal':
            riskFactors.push('Unusual access time');
            break;
        }
      }
    }

    return riskFactors;
  }

  // Helper methods (would be implemented with actual data sources)
  private generateDeviceFingerprint(request: any): DeviceFingerprint {
    // Implementation would generate comprehensive device fingerprint
    return {
      id: '', // Generated hash
      userAgent: request.userAgent,
      screenResolution: request.headers['screen-resolution'] || '',
      timezone: request.headers['timezone'] || '',
      language: request.headers['accept-language'] || '',
      platform: request.headers['sec-ch-ua-platform'] || '',
      cookiesEnabled: true, // Would be detected
      localStorageEnabled: true, // Would be detected
      sessionStorageEnabled: true, // Would be detected
    };
  }

  private async getKnownDevices(_userId: string): Promise<any[]> {
    // Implementation would fetch from database
    return [];
  }

  private findDeviceMatch(_fingerprint: DeviceFingerprint, _knownDevices: any[]): any {
    // Implementation would compare fingerprints and return similarity score
    return null;
  }

  private async getUserLocationHistory(_userId: string): Promise<any[]> {
    // Implementation would fetch location history
    return [];
  }

  private async getUserAccessPatterns(_userId: string): Promise<any> {
    // Implementation would fetch temporal patterns
    return null;
  }

  private calculateTemporalScore(_timestamp: Date, _patterns: any): number {
    // Implementation would score based on time patterns
    return 0.5;
  }
}

export const trustEngine = new InvisibleTrustEngine();