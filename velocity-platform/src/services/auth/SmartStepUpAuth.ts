/**
 * Smart Step-Up Authentication System
 * Provides seamless, risk-based authentication with minimal user friction
 */

import { TrustAssessment } from '../trust/TrustEngine';

export type AuthMethod = 
  | 'none' 
  | 'push_notification' 
  | 'sms' 
  | 'totp' 
  | 'biometric' 
  | 'email_verification'
  | 'security_questions';

export type AuthChallenge = {
  id: string;
  type: AuthMethod;
  message: string;
  userFriendlyTitle: string;
  estimatedTimeSeconds: number;
  fallbackMethods: AuthMethod[];
  skipOption?: boolean;
  expiresAt: Date;
};

export interface UserAuthPreferences {
  userId: string;
  availableMethods: AuthMethod[];
  preferredMethod: AuthMethod;
  biometricEnabled: boolean;
  pushNotificationsEnabled: boolean;
  phoneNumberVerified: boolean;
  emailVerified: boolean;
  lastUpdated: Date;
}

export interface AuthChallengeResponse {
  challengeId: string;
  method: AuthMethod;
  token: string;
  biometricData?: string;
  timestamp: Date;
}

export class SmartStepUpAuth {
  private readonly METHOD_FRICTION_SCORES = {
    none: 0,
    push_notification: 1, // One tap
    biometric: 2, // Touch/look
    sms: 3, // Need to check phone and type
    totp: 4, // Need authenticator app
    email_verification: 5, // Need to check email
    security_questions: 6 // Need to remember answers
  };

  private readonly METHOD_SECURITY_SCORES = {
    none: 0,
    push_notification: 6,
    sms: 5,
    biometric: 9,
    totp: 8,
    email_verification: 4,
    security_questions: 3
  };

  /**
   * Determine the best authentication method based on trust score and user preferences
   */
  async determineAuthMethod(
    userId: string, 
    trustAssessment: TrustAssessment
  ): Promise<AuthChallenge | null> {
    try {
      // Get user's available auth methods and preferences
      const userPrefs = await this.getUserAuthPreferences(userId);
      
      // No additional auth needed for high trust
      if (trustAssessment.score >= 0.8) {
        return null; // Seamless login
      }

      // Choose method based on trust score and user preferences
      const requiredSecurityLevel = this.calculateRequiredSecurityLevel(trustAssessment);
      const optimalMethod = this.selectOptimalAuthMethod(userPrefs, requiredSecurityLevel);

      // Create user-friendly challenge
      return this.createAuthChallenge(optimalMethod, trustAssessment, userPrefs);

    } catch (error) {
      console.error('Failed to determine auth method:', error);
      
      // Fallback to safest option
      return this.createFallbackChallenge(userId);
    }
  }

  /**
   * Calculate required security level based on trust assessment
   */
  private calculateRequiredSecurityLevel(trustAssessment: TrustAssessment): number {
    const baseRequirement = Math.max(1, Math.round((1 - trustAssessment.score) * 10));
    
    // Increase requirement based on risk factors
    const riskMultiplier = trustAssessment.riskFactors.length > 0 ? 1.5 : 1.0;
    
    return Math.min(10, Math.round(baseRequirement * riskMultiplier));
  }

  /**
   * Select optimal auth method balancing security and user experience
   */
  private selectOptimalAuthMethod(
    userPrefs: UserAuthPreferences, 
    requiredSecurityLevel: number
  ): AuthMethod {
    // Filter methods that meet security requirement
    const adequateMethods = userPrefs.availableMethods.filter(method => 
      this.METHOD_SECURITY_SCORES[method] >= requiredSecurityLevel
    );

    if (adequateMethods.length === 0) {
      // Fallback to strongest available method
      return this.getStrongestAvailableMethod(userPrefs.availableMethods);
    }

    // Among adequate methods, choose the one with least friction
    return adequateMethods.reduce((best, current) => 
      this.METHOD_FRICTION_SCORES[current] < this.METHOD_FRICTION_SCORES[best] 
        ? current 
        : best
    );
  }

  /**
   * Create user-friendly authentication challenge
   */
  private createAuthChallenge(
    method: AuthMethod,
    trustAssessment: TrustAssessment,
    userPrefs: UserAuthPreferences
  ): AuthChallenge {
    const challengeId = this.generateChallengeId();
    const fallbackMethods = this.getFallbackMethods(method, userPrefs.availableMethods);

    const challengeConfig = this.getMethodConfig(method, trustAssessment);

    return {
      id: challengeId,
      type: method,
      message: challengeConfig.message,
      userFriendlyTitle: challengeConfig.title,
      estimatedTimeSeconds: challengeConfig.estimatedTime,
      fallbackMethods,
      skipOption: trustAssessment.score > 0.6, // Allow skip for medium trust
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    };
  }

  /**
   * Get configuration for each auth method
   */
  private getMethodConfig(method: AuthMethod, trustAssessment: TrustAssessment) {
    const configs = {
      push_notification: {
        title: "Quick Security Check",
        message: "We sent a notification to your device. Just tap 'Approve' to continue.",
        estimatedTime: 10
      },
      biometric: {
        title: "Verify It's You",
        message: "Use your fingerprint or face to verify your identity.",
        estimatedTime: 5
      },
      sms: {
        title: "Text Message Verification",
        message: "We sent a code to your phone. Enter it below to continue.",
        estimatedTime: 30
      },
      totp: {
        title: "Authenticator Code",
        message: "Open your authenticator app and enter the 6-digit code.",
        estimatedTime: 15
      },
      email_verification: {
        title: "Email Verification",
        message: "Check your email and click the verification link we sent.",
        estimatedTime: 60
      },
      security_questions: {
        title: "Security Questions",
        message: "Answer your security questions to verify your identity.",
        estimatedTime: 45
      }
    };

    // Customize message based on risk level
    const config = configs[method];
    if (trustAssessment.riskFactors.length > 0) {
      config.message = `For your security, ${config.message.toLowerCase()}`;
    }

    return config;
  }

  /**
   * Verify authentication challenge response
   */
  async verifyChallenge(response: AuthChallengeResponse): Promise<{
    success: boolean;
    trustBoost: number;
    error?: string;
  }> {
    try {
      // Get challenge details
      const challenge = await this.getChallenge(response.challengeId);
      
      if (!challenge) {
        return { success: false, trustBoost: 0, error: 'Invalid challenge' };
      }

      if (challenge.expiresAt < new Date()) {
        return { success: false, trustBoost: 0, error: 'Challenge expired' };
      }

      // Verify based on method
      const verificationResult = await this.verifyByMethod(response, challenge);
      
      if (verificationResult.success) {
        // Calculate trust boost based on method strength
        const trustBoost = this.calculateTrustBoost(response.method);
        
        // Clean up challenge
        await this.cleanupChallenge(response.challengeId);
        
        return { success: true, trustBoost };
      }

      return { success: false, trustBoost: 0, error: verificationResult.error };

    } catch (error) {
      console.error('Challenge verification failed:', error);
      return { success: false, trustBoost: 0, error: 'Verification failed' };
    }
  }

  /**
   * Verify challenge by specific method
   */
  private async verifyByMethod(
    response: AuthChallengeResponse, 
    challenge: AuthChallenge
  ): Promise<{ success: boolean; error?: string }> {
    switch (response.method) {
      case 'push_notification':
        return await this.verifyPushNotification(response.token);
      
      case 'biometric':
        return await this.verifyBiometric(response.biometricData!);
      
      case 'sms':
        return await this.verifySMS(response.token);
      
      case 'totp':
        return await this.verifyTOTP(response.token);
      
      case 'email_verification':
        return await this.verifyEmailToken(response.token);
      
      case 'security_questions':
        return await this.verifySecurityQuestions(response.token);
      
      default:
        return { success: false, error: 'Unsupported method' };
    }
  }

  /**
   * Calculate trust boost from successful authentication
   */
  private calculateTrustBoost(method: AuthMethod): number {
    const boosts = {
      push_notification: 0.1,
      sms: 0.15,
      totp: 0.2,
      biometric: 0.25,
      email_verification: 0.1,
      security_questions: 0.05
    };

    return boosts[method] || 0;
  }

  /**
   * Create adaptive UI components for challenges
   */
  createChallengeComponent(challenge: AuthChallenge): {
    componentType: string;
    props: Record<string, any>;
  } {
    const baseProps = {
      challengeId: challenge.id,
      title: challenge.userFriendlyTitle,
      message: challenge.message,
      estimatedTime: challenge.estimatedTimeSeconds,
      fallbackMethods: challenge.fallbackMethods,
      skipOption: challenge.skipOption
    };

    switch (challenge.type) {
      case 'push_notification':
        return {
          componentType: 'PushNotificationChallenge',
          props: {
            ...baseProps,
            icon: '📱',
            animation: 'pulse',
            autoCheck: true // Automatically check for approval
          }
        };

      case 'biometric':
        return {
          componentType: 'BiometricChallenge',
          props: {
            ...baseProps,
            icon: '👆',
            supportedTypes: ['fingerprint', 'face', 'voice'],
            privacyNote: 'Biometric data never leaves your device'
          }
        };

      case 'sms':
        return {
          componentType: 'SMSChallenge',
          props: {
            ...baseProps,
            icon: '💬',
            codeLength: 6,
            resendAvailable: true,
            maskedPhoneNumber: this.maskPhoneNumber('') // Would get actual number
          }
        };

      case 'totp':
        return {
          componentType: 'TOTPChallenge',
          props: {
            ...baseProps,
            icon: '🔐',
            codeLength: 6,
            helpText: 'Find the code in your authenticator app'
          }
        };

      default:
        return {
          componentType: 'GenericChallenge',
          props: baseProps
        };
    }
  }

  // Helper methods (implementations would connect to actual services)
  private async getUserAuthPreferences(userId: string): Promise<UserAuthPreferences> {
    // Mock implementation - would fetch from database
    return {
      userId,
      availableMethods: ['push_notification', 'biometric', 'sms', 'totp'],
      preferredMethod: 'biometric',
      biometricEnabled: true,
      pushNotificationsEnabled: true,
      phoneNumberVerified: true,
      emailVerified: true,
      lastUpdated: new Date()
    };
  }

  private getStrongestAvailableMethod(methods: AuthMethod[]): AuthMethod {
    const orderedByStrength: AuthMethod[] = [
      'biometric', 'totp', 'push_notification', 'sms', 'email_verification', 'security_questions'
    ];

    return orderedByStrength.find(method => methods.includes(method)) || 'sms';
  }

  private getFallbackMethods(primary: AuthMethod, available: AuthMethod[]): AuthMethod[] {
    return available.filter(method => 
      method !== primary && 
      this.METHOD_SECURITY_SCORES[method] >= this.METHOD_SECURITY_SCORES[primary] - 2
    ).slice(0, 2); // Max 2 fallback options
  }

  private generateChallengeId(): string {
    return `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createFallbackChallenge(userId: string): AuthChallenge {
    return {
      id: this.generateChallengeId(),
      type: 'sms',
      message: 'For security, we need to verify your identity.',
      userFriendlyTitle: 'Security Verification',
      estimatedTimeSeconds: 30,
      fallbackMethods: ['email_verification'],
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    };
  }

  private async getChallenge(challengeId: string): Promise<AuthChallenge | null> {
    // Implementation would fetch from cache/database
    return null;
  }

  private async cleanupChallenge(challengeId: string): Promise<void> {
    // Implementation would remove challenge from cache
  }

  private async verifyPushNotification(token: string): Promise<{ success: boolean; error?: string }> {
    // Implementation would verify push notification response
    return { success: true };
  }

  private async verifyBiometric(biometricData: string): Promise<{ success: boolean; error?: string }> {
    // Implementation would verify biometric data
    return { success: true };
  }

  private async verifySMS(code: string): Promise<{ success: boolean; error?: string }> {
    // Implementation would verify SMS code
    return { success: true };
  }

  private async verifyTOTP(code: string): Promise<{ success: boolean; error?: string }> {
    // Implementation would verify TOTP code
    return { success: true };
  }

  private async verifyEmailToken(token: string): Promise<{ success: boolean; error?: string }> {
    // Implementation would verify email token
    return { success: true };
  }

  private async verifySecurityQuestions(answers: string): Promise<{ success: boolean; error?: string }> {
    // Implementation would verify security question answers
    return { success: true };
  }

  private maskPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber || phoneNumber.length < 4) return '****';
    return `****${phoneNumber.slice(-4)}`;
  }
}

export const smartStepUpAuth = new SmartStepUpAuth();