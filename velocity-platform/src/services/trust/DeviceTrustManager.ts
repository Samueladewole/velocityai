/**
 * Device Trust Management with Gradual Learning
 * Builds device trust over time without user friction
 */

export interface DeviceTrust {
  deviceId: string;
  userId: string;
  fingerprint: DeviceFingerprint;
  trustScore: number; // 0-1, starts low and builds over time
  status: 'learning' | 'trusted' | 'suspicious' | 'blocked';
  learningPeriodStart: Date;
  learningPeriodEnd: Date;
  lastSeen: Date;
  usageCount: number;
  anomalyCount: number;
  verificationHistory: DeviceVerification[];
  metadata: {
    firstRegistration: Date;
    userAgent: string;
    ipAddress: string;
    location?: GeoLocation;
    name?: string; // User-assigned device name
  };
}

export interface DeviceFingerprint {
  id: string;
  hash: string;
  components: {
    userAgent: string;
    screen: { width: number; height: number; colorDepth: number };
    timezone: string;
    language: string;
    platform: string;
    cookiesEnabled: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    webGL?: {
      vendor: string;
      renderer: string;
    };
    canvas?: string;
    fonts?: string[];
    plugins?: string[];
    hardwareConcurrency?: number;
    deviceMemory?: number;
  };
}

export interface DeviceVerification {
  timestamp: Date;
  method: 'fingerprint' | 'behavior' | 'location' | 'temporal';
  result: 'pass' | 'suspicious' | 'fail';
  confidence: number;
  details: Record<string, any>;
}

export interface GeoLocation {
  country: string;
  city: string;
  coordinates: [number, number];
  accuracy: number;
}

export interface DeviceLearningMetrics {
  consistencyScore: number; // How consistent the device appears
  behaviorScore: number; // How normal the usage behavior is
  locationScore: number; // How consistent the location is
  temporalScore: number; // How consistent the timing is
  overallTrend: 'improving' | 'stable' | 'declining';
}

export class DeviceTrustManager {
  private readonly LEARNING_PERIOD_DAYS = 7;
  private readonly TRUST_THRESHOLDS = {
    INITIAL: 0.3, // Starting trust for new devices
    TRUSTED: 0.8, // Threshold for trusted status
    SUSPICIOUS: 0.4, // Below this becomes suspicious
    BLOCKED: 0.2 // Below this gets blocked
  };

  /**
   * Register a new device silently in the background
   */
  async registerDeviceSeamlessly(
    userId: string,
    deviceInfo: {
      userAgent: string;
      ip: string;
      headers: Record<string, string>;
      clientFingerprint?: any;
    }
  ): Promise<DeviceTrust> {
    try {
      // Generate comprehensive device fingerprint
      const fingerprint = await this.generateDeviceFingerprint(deviceInfo);
      
      // Check if this device already exists (partial matches)
      const existingDevice = await this.findSimilarDevice(userId, fingerprint);
      
      if (existingDevice && existingDevice.trustScore > 0.6) {
        // Update existing device instead of creating new one
        return await this.updateDeviceInfo(existingDevice.deviceId, deviceInfo);
      }

      // Create new device trust record
      const deviceTrust: DeviceTrust = {
        deviceId: this.generateDeviceId(fingerprint),
        userId,
        fingerprint,
        trustScore: this.TRUST_THRESHOLDS.INITIAL,
        status: 'learning',
        learningPeriodStart: new Date(),
        learningPeriodEnd: new Date(Date.now() + this.LEARNING_PERIOD_DAYS * 24 * 60 * 60 * 1000),
        lastSeen: new Date(),
        usageCount: 1,
        anomalyCount: 0,
        verificationHistory: [],
        metadata: {
          firstRegistration: new Date(),
          userAgent: deviceInfo.userAgent,
          ipAddress: deviceInfo.ip,
          location: await this.getLocationFromIP(deviceInfo.ip)
        }
      };

      // Store device trust
      await this.storeDeviceTrust(deviceTrust);

      // Send friendly notification to user (non-intrusive)
      await this.sendDeviceLearningNotification(userId, deviceTrust);

      return deviceTrust;

    } catch (error) {
      console.error('Failed to register device:', error);
      throw error;
    }
  }

  /**
   * Gradually build device trust based on normal usage
   */
  async updateDeviceTrust(
    deviceId: string,
    activityData: {
      timestamp: Date;
      ip: string;
      userAgent: string;
      behaviorMetrics?: any;
      sessionDuration?: number;
      actionsPerformed?: string[];
    }
  ): Promise<DeviceTrust> {
    try {
      const deviceTrust = await this.getDeviceTrust(deviceId);
      
      if (!deviceTrust) {
        throw new Error('Device not found');
      }

      // Update usage statistics
      deviceTrust.usageCount += 1;
      deviceTrust.lastSeen = activityData.timestamp;

      // Perform trust assessments
      const verifications = await this.performDeviceVerifications(deviceTrust, activityData);
      deviceTrust.verificationHistory.push(...verifications);

      // Calculate new trust score
      const learningMetrics = await this.calculateLearningMetrics(deviceTrust, activityData);
      const newTrustScore = this.calculateUpdatedTrustScore(deviceTrust, learningMetrics);

      // Update trust score gradually
      deviceTrust.trustScore = this.smoothTrustTransition(
        deviceTrust.trustScore, 
        newTrustScore, 
        deviceTrust.usageCount
      );

      // Update device status based on trust score
      deviceTrust.status = this.determineDeviceStatus(deviceTrust.trustScore, deviceTrust);

      // Check if learning period is complete
      if (new Date() > deviceTrust.learningPeriodEnd && deviceTrust.status === 'learning') {
        await this.completeLearningPeriod(deviceTrust);
      }

      // Store updated trust
      await this.storeDeviceTrust(deviceTrust);

      // Send positive feedback if trust improved significantly
      if (newTrustScore > deviceTrust.trustScore + 0.1) {
        await this.sendTrustImprovementNotification(deviceTrust.userId, deviceTrust);
      }

      return deviceTrust;

    } catch (error) {
      console.error('Failed to update device trust:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive device fingerprint
   */
  private async generateDeviceFingerprint(deviceInfo: any): Promise<DeviceFingerprint> {
    const components = {
      userAgent: deviceInfo.userAgent,
      screen: this.extractScreenInfo(deviceInfo.headers),
      timezone: deviceInfo.headers['timezone'] || 'UTC',
      language: deviceInfo.headers['accept-language'] || 'en-US',
      platform: deviceInfo.headers['sec-ch-ua-platform'] || 'unknown',
      cookiesEnabled: true, // Would be detected client-side
      localStorage: true, // Would be detected client-side
      sessionStorage: true, // Would be detected client-side
      indexedDB: true, // Would be detected client-side
      webGL: this.extractWebGLInfo(deviceInfo.clientFingerprint),
      canvas: deviceInfo.clientFingerprint?.canvas,
      fonts: deviceInfo.clientFingerprint?.fonts,
      plugins: deviceInfo.clientFingerprint?.plugins,
      hardwareConcurrency: deviceInfo.clientFingerprint?.hardwareConcurrency,
      deviceMemory: deviceInfo.clientFingerprint?.deviceMemory
    };

    const hash = await this.hashFingerprint(components);

    return {
      id: hash,
      hash,
      components
    };
  }

  /**
   * Perform various device verifications
   */
  private async performDeviceVerifications(
    deviceTrust: DeviceTrust, 
    activityData: any
  ): Promise<DeviceVerification[]> {
    const verifications: DeviceVerification[] = [];

    // Fingerprint consistency check
    const fingerprintVerification = await this.verifyFingerprintConsistency(
      deviceTrust, 
      activityData.userAgent
    );
    verifications.push(fingerprintVerification);

    // Behavior pattern verification
    if (activityData.behaviorMetrics) {
      const behaviorVerification = await this.verifyBehaviorConsistency(
        deviceTrust, 
        activityData.behaviorMetrics
      );
      verifications.push(behaviorVerification);
    }

    // Location consistency check
    const locationVerification = await this.verifyLocationConsistency(
      deviceTrust, 
      activityData.ip
    );
    verifications.push(locationVerification);

    // Temporal pattern verification
    const temporalVerification = await this.verifyTemporalPatterns(
      deviceTrust, 
      activityData.timestamp
    );
    verifications.push(temporalVerification);

    return verifications;
  }

  /**
   * Calculate learning metrics for the device
   */
  private async calculateLearningMetrics(
    deviceTrust: DeviceTrust, 
    activityData: any
  ): Promise<DeviceLearningMetrics> {
    // Get recent verifications
    const recentVerifications = deviceTrust.verificationHistory.slice(-10);

    // Calculate consistency scores
    const consistencyScore = this.calculateConsistencyScore(recentVerifications, 'fingerprint');
    const behaviorScore = this.calculateConsistencyScore(recentVerifications, 'behavior');
    const locationScore = this.calculateConsistencyScore(recentVerifications, 'location');
    const temporalScore = this.calculateConsistencyScore(recentVerifications, 'temporal');

    // Determine trend
    const overallTrend = this.calculateTrustTrend(deviceTrust.verificationHistory);

    return {
      consistencyScore,
      behaviorScore,
      locationScore,
      temporalScore,
      overallTrend
    };
  }

  /**
   * Calculate updated trust score based on learning metrics
   */
  private calculateUpdatedTrustScore(
    deviceTrust: DeviceTrust, 
    metrics: DeviceLearningMetrics
  ): number {
    const weights = {
      consistency: 0.3,
      behavior: 0.25,
      location: 0.25,
      temporal: 0.2
    };

    let baseScore = (
      metrics.consistencyScore * weights.consistency +
      metrics.behaviorScore * weights.behavior +
      metrics.locationScore * weights.location +
      metrics.temporalScore * weights.temporal
    );

    // Apply trend modifier
    if (metrics.overallTrend === 'improving') {
      baseScore *= 1.1;
    } else if (metrics.overallTrend === 'declining') {
      baseScore *= 0.9;
    }

    // Apply usage bonus (more usage = more trust, up to a point)
    const usageBonus = Math.min(0.1, deviceTrust.usageCount * 0.01);
    baseScore += usageBonus;

    // Apply anomaly penalty
    const anomalyPenalty = deviceTrust.anomalyCount * 0.05;
    baseScore -= anomalyPenalty;

    return Math.max(0, Math.min(1, baseScore));
  }

  /**
   * Smooth trust score transitions to avoid sudden changes
   */
  private smoothTrustTransition(
    currentScore: number, 
    newScore: number, 
    usageCount: number
  ): number {
    // Gradually adjust trust score
    const maxChange = usageCount < 10 ? 0.1 : 0.05; // Larger changes early on
    const difference = newScore - currentScore;
    const adjustedChange = Math.sign(difference) * Math.min(Math.abs(difference), maxChange);
    
    return Math.max(0, Math.min(1, currentScore + adjustedChange));
  }

  /**
   * Determine device status based on trust score
   */
  private determineDeviceStatus(
    trustScore: number, 
    deviceTrust: DeviceTrust
  ): DeviceTrust['status'] {
    if (trustScore <= this.TRUST_THRESHOLDS.BLOCKED) {
      return 'blocked';
    } else if (trustScore < this.TRUST_THRESHOLDS.SUSPICIOUS) {
      return 'suspicious';
    } else if (trustScore >= this.TRUST_THRESHOLDS.TRUSTED) {
      return 'trusted';
    } else if (new Date() <= deviceTrust.learningPeriodEnd) {
      return 'learning';
    } else {
      return 'trusted'; // Default to trusted after learning period
    }
  }

  /**
   * Complete the learning period for a device
   */
  private async completeLearningPeriod(deviceTrust: DeviceTrust): Promise<void> {
    if (deviceTrust.trustScore >= this.TRUST_THRESHOLDS.TRUSTED) {
      deviceTrust.status = 'trusted';
      await this.sendDeviceTrustedNotification(deviceTrust.userId, deviceTrust);
    } else if (deviceTrust.trustScore >= this.TRUST_THRESHOLDS.SUSPICIOUS) {
      // Continue monitoring but don't mark as fully trusted
      deviceTrust.status = 'learning';
      deviceTrust.learningPeriodEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // Extend 3 days
    } else {
      deviceTrust.status = 'suspicious';
      await this.sendDeviceSuspiciousNotification(deviceTrust.userId, deviceTrust);
    }
  }

  /**
   * Send friendly notification about device learning
   */
  private async sendDeviceLearningNotification(
    userId: string, 
    deviceTrust: DeviceTrust
  ): Promise<void> {
    const notification = {
      type: 'info' as const,
      title: 'Learning Your Device',
      message: 'We\'re getting to know your device to make future logins smoother and more secure.',
      icon: '🔐',
      duration: 8000, // 8 seconds
      dismissible: true,
      actions: [
        {
          text: 'Got it',
          action: 'dismiss'
        },
        {
          text: 'Learn more',
          action: 'show_device_info'
        }
      ]
    };

    await this.sendNotification(userId, notification);
  }

  /**
   * Send notification when trust improves
   */
  private async sendTrustImprovementNotification(
    userId: string, 
    deviceTrust: DeviceTrust
  ): Promise<void> {
    if (deviceTrust.trustScore >= this.TRUST_THRESHOLDS.TRUSTED) {
      const notification = {
        type: 'success' as const,
        title: 'Device Trusted! 🎉',
        message: 'Your device is now fully trusted. You\'ll experience fewer security checks.',
        icon: '✅',
        duration: 5000,
        dismissible: true
      };

      await this.sendNotification(userId, notification);
    }
  }

  // Helper methods (would be implemented with actual services)
  private extractScreenInfo(headers: Record<string, string>) {
    return {
      width: parseInt(headers['screen-width'] || '0'),
      height: parseInt(headers['screen-height'] || '0'),
      colorDepth: parseInt(headers['color-depth'] || '24')
    };
  }

  private extractWebGLInfo(clientFingerprint: any) {
    return clientFingerprint?.webgl || undefined;
  }

  private async hashFingerprint(components: any): Promise<string> {
    // Implementation would create a stable hash of the fingerprint components
    const str = JSON.stringify(components);
    return `device_${btoa(str).slice(0, 16)}`;
  }

  private generateDeviceId(fingerprint: DeviceFingerprint): string {
    return `device_${fingerprint.hash}_${Date.now()}`;
  }

  private async findSimilarDevice(
    userId: string, 
    fingerprint: DeviceFingerprint
  ): Promise<DeviceTrust | null> {
    // Implementation would find devices with similar fingerprints
    return null;
  }

  private async updateDeviceInfo(deviceId: string, deviceInfo: any): Promise<DeviceTrust> {
    // Implementation would update existing device
    const existing = await this.getDeviceTrust(deviceId);
    return existing!;
  }

  private async getLocationFromIP(ip: string): Promise<GeoLocation | undefined> {
    // Implementation would use GeoIP service
    return undefined;
  }

  private async storeDeviceTrust(deviceTrust: DeviceTrust): Promise<void> {
    // Implementation would store in database
  }

  private async getDeviceTrust(deviceId: string): Promise<DeviceTrust | null> {
    // Implementation would fetch from database
    return null;
  }

  private async verifyFingerprintConsistency(
    deviceTrust: DeviceTrust, 
    currentUserAgent: string
  ): Promise<DeviceVerification> {
    const isConsistent = deviceTrust.fingerprint.components.userAgent === currentUserAgent;
    
    return {
      timestamp: new Date(),
      method: 'fingerprint',
      result: isConsistent ? 'pass' : 'suspicious',
      confidence: isConsistent ? 0.9 : 0.3,
      details: { userAgentMatch: isConsistent }
    };
  }

  private async verifyBehaviorConsistency(
    deviceTrust: DeviceTrust, 
    behaviorMetrics: any
  ): Promise<DeviceVerification> {
    // Implementation would compare behavior patterns
    return {
      timestamp: new Date(),
      method: 'behavior',
      result: 'pass',
      confidence: 0.7,
      details: {}
    };
  }

  private async verifyLocationConsistency(
    deviceTrust: DeviceTrust, 
    ip: string
  ): Promise<DeviceVerification> {
    // Implementation would check location consistency
    return {
      timestamp: new Date(),
      method: 'location',
      result: 'pass',
      confidence: 0.8,
      details: {}
    };
  }

  private async verifyTemporalPatterns(
    deviceTrust: DeviceTrust, 
    timestamp: Date
  ): Promise<DeviceVerification> {
    // Implementation would check temporal patterns
    return {
      timestamp: new Date(),
      method: 'temporal',
      result: 'pass',
      confidence: 0.6,
      details: {}
    };
  }

  private calculateConsistencyScore(
    verifications: DeviceVerification[], 
    method: string
  ): number {
    const methodVerifications = verifications.filter(v => v.method === method);
    if (methodVerifications.length === 0) return 0.5;

    const passCount = methodVerifications.filter(v => v.result === 'pass').length;
    return passCount / methodVerifications.length;
  }

  private calculateTrustTrend(verifications: DeviceVerification[]): 'improving' | 'stable' | 'declining' {
    if (verifications.length < 5) return 'stable';

    const recent = verifications.slice(-5);
    const older = verifications.slice(-10, -5);

    const recentScore = recent.filter(v => v.result === 'pass').length / recent.length;
    const olderScore = older.length > 0 ? older.filter(v => v.result === 'pass').length / older.length : 0.5;

    if (recentScore > olderScore + 0.1) return 'improving';
    if (recentScore < olderScore - 0.1) return 'declining';
    return 'stable';
  }

  private async sendDeviceTrustedNotification(userId: string, deviceTrust: DeviceTrust): Promise<void> {
    // Implementation would send notification
  }

  private async sendDeviceSuspiciousNotification(userId: string, deviceTrust: DeviceTrust): Promise<void> {
    // Implementation would send notification
  }

  private async sendNotification(userId: string, notification: any): Promise<void> {
    // Implementation would send notification to user
  }
}

export const deviceTrustManager = new DeviceTrustManager();