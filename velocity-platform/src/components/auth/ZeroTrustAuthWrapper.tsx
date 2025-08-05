/**
 * Zero Trust Authentication Wrapper
 * Integrates all Zero Trust components into a seamless user experience
 */

import React, { useState, useEffect, useCallback } from 'react';
import { trustEngine, TrustAssessment } from '../../services/trust/TrustEngine';
import { smartStepUpAuth, AuthChallenge } from '../../services/auth/SmartStepUpAuth';
import { deviceTrustManager } from '../../services/trust/DeviceTrustManager';
import { 
  SecurityNotificationContainer, 
  useSecurityNotifications,
  SecurityInsightsPanel 
} from '../security/SecurityNotifications';
import { 
  Fingerprint, 
  Smartphone, 
  MessageSquare, 
  Mail, 
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Loader2
} from 'lucide-react';

export type AuthState = 
  | 'checking' 
  | 'trusted' 
  | 'step_up_required' 
  | 'verification_required' 
  | 'blocked';

export interface ZeroTrustAuthProps {
  children: React.ReactNode;
  userId: string;
  onAuthSuccess?: () => void;
  onAuthFailure?: (reason: string) => void;
  showTrustScore?: boolean;
  enableDeviceLearning?: boolean;
}

interface AuthChallengeUIProps {
  challenge: AuthChallenge;
  onSuccess: () => void;
  onCancel: () => void;
}

// Main Zero Trust Authentication Wrapper
export const ZeroTrustAuthWrapper: React.FC<ZeroTrustAuthProps> = ({
  children,
  userId,
  onAuthSuccess,
  onAuthFailure,
  showTrustScore = false,
  enableDeviceLearning = true
}) => {
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [trustAssessment, setTrustAssessment] = useState<TrustAssessment | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<AuthChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showDeviceLearning, showTrustImproved, showAuthSuccess } = useSecurityNotifications();

  // Perform initial trust assessment
  const performTrustAssessment = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Gather request information
      const requestInfo = {
        ip: await getCurrentIP(),
        userAgent: navigator.userAgent,
        headers: {
          'timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
          'language': navigator.language,
          'screen-width': screen.width.toString(),
          'screen-height': screen.height.toString(),
          'color-depth': screen.colorDepth.toString()
        },
        timestamp: new Date()
      };

      // Assess trust score
      const assessment = await trustEngine.assessTrust(userId, requestInfo);
      setTrustAssessment(assessment);

      // Register/update device if learning is enabled
      if (enableDeviceLearning) {
        try {
          await deviceTrustManager.registerDeviceSeamlessly(userId, requestInfo);
          showDeviceLearning();
        } catch (deviceError) {
          console.warn('Device registration failed:', deviceError);
          // Don't fail auth if device registration fails
        }
      }

      // Start continuous behavior monitoring for trusted sessions
      if (assessment.score >= 0.6) {
        try {
          await trustEngine.startContinuousMonitoring(userId, 'device_' + Date.now());
        } catch (monitoringError) {
          console.warn('Failed to start continuous monitoring:', monitoringError);
          // Don't fail auth if monitoring setup fails
        }
      }

      // Determine authentication state
      if (assessment.score >= 0.8) {
        setAuthState('trusted');
        showAuthSuccess();
        onAuthSuccess?.();
      } else if (assessment.score >= 0.6) {
        // Require step-up authentication
        const challenge = await smartStepUpAuth.determineAuthMethod(userId, assessment);
        if (challenge) {
          setCurrentChallenge(challenge);
          setAuthState('step_up_required');
        } else {
          setAuthState('trusted');
          onAuthSuccess?.();
        }
      } else if (assessment.score >= 0.3) {
        // High verification required
        const challenge = await smartStepUpAuth.determineAuthMethod(userId, assessment);
        setCurrentChallenge(challenge);
        setAuthState('verification_required');
      } else {
        // Block access
        setAuthState('blocked');
        onAuthFailure?.('Trust score too low');
      }

    } catch (error) {
      console.error('Trust assessment failed:', error);
      setError('Security check failed. Please try again.');
      setAuthState('verification_required');
    } finally {
      setIsLoading(false);
    }
  }, [userId, enableDeviceLearning, onAuthSuccess, onAuthFailure]);

  // Handle successful challenge completion
  const handleChallengeSuccess = useCallback(async (trustBoost: number = 0) => {
    if (!trustAssessment) return;

    // Update trust score
    const newScore = Math.min(1.0, trustAssessment.score + trustBoost);
    const updatedAssessment = { ...trustAssessment, score: newScore };
    setTrustAssessment(updatedAssessment);

    // Update auth state
    setAuthState('trusted');
    setCurrentChallenge(null);

    // Show success notifications
    showAuthSuccess();
    if (trustBoost > 0.1) {
      showTrustImproved(getTrustLevel(newScore));
    }

    onAuthSuccess?.();
  }, [trustAssessment, showAuthSuccess, showTrustImproved, onAuthSuccess]);

  // Handle challenge failure
  const handleChallengeFailure = useCallback((reason: string) => {
    setError(reason);
    onAuthFailure?.(reason);
  }, [onAuthFailure]);

  // Initial assessment on mount
  useEffect(() => {
    performTrustAssessment();
    
    // Listen for critical security anomalies
    const handleCriticalAnomaly = (event: CustomEvent) => {
      console.warn('Critical security anomaly detected:', event.detail);
      setAuthState('verification_required');
      setError('Security anomaly detected - additional verification required');
    };

    window.addEventListener('criticalSecurityAnomaly', handleCriticalAnomaly as EventListener);
    
    return () => {
      window.removeEventListener('criticalSecurityAnomaly', handleCriticalAnomaly as EventListener);
      
      // Clean up continuous monitoring on unmount
      trustEngine.stopContinuousMonitoring().catch(error => {
        console.warn('Failed to stop continuous monitoring:', error);
      });
    };
  }, [performTrustAssessment]);

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={performTrustAssessment} />;
  }

  // Blocked state
  if (authState === 'blocked') {
    return <BlockedState />;
  }

  // Challenge required states
  if ((authState === 'step_up_required' || authState === 'verification_required') && currentChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <AuthChallengeUI
          challenge={currentChallenge}
          onSuccess={() => handleChallengeSuccess(0.1)}
          onCancel={() => handleChallengeFailure('Authentication cancelled')}
        />
        <SecurityNotificationContainer />
      </div>
    );
  }

  // Trusted state - show protected content
  return (
    <div className="relative">
      {children}
      
      {/* Security notifications */}
      <SecurityNotificationContainer />
      
      {/* Optional trust score display */}
      {showTrustScore && trustAssessment && (
        <div className="fixed bottom-4 right-4 z-40">
          <SecurityInsightsPanel
            trustScore={trustAssessment.score}
            deviceCount={1} // Would be fetched from device manager
            lastSecurityCheck={new Date()}
          />
        </div>
      )}
    </div>
  );
};

// Authentication Challenge UI Component
const AuthChallengeUI: React.FC<AuthChallengeUIProps> = ({ challenge, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const remaining = Math.max(0, challenge.expiresAt.getTime() - Date.now());
    setTimeRemaining(remaining);

    const timer = setInterval(() => {
      const newRemaining = Math.max(0, challenge.expiresAt.getTime() - Date.now());
      setTimeRemaining(newRemaining);
      
      if (newRemaining <= 0) {
        clearInterval(timer);
        onCancel();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [challenge.expiresAt, onCancel]);

  const handleSubmit = async () => {
    if (!userInput.trim() && challenge.type !== 'push_notification') return;

    setIsSubmitting(true);
    
    try {
      // Simulate challenge verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, would call smartStepUpAuth.verifyChallenge
      onSuccess();
    } catch (error) {
      console.error('Challenge verification failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'biometric': return <Fingerprint className="w-8 h-8" />;
      case 'push_notification': return <Smartphone className="w-8 h-8" />;
      case 'sms': return <MessageSquare className="w-8 h-8" />;
      case 'email_verification': return <Mail className="w-8 h-8" />;
      default: return <Shield className="w-8 h-8" />;
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              {getMethodIcon(challenge.type)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{challenge.userFriendlyTitle}</h2>
              <p className="text-blue-100 text-sm">
                {timeRemaining > 0 && `Expires in ${formatTime(timeRemaining)}`}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            {challenge.message}
          </p>

          {/* Input field for codes */}
          {['sms', 'totp', 'email_verification'].includes(challenge.type) && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter verification code
              </label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="000000"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono tracking-widest"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
              />
            </div>
          )}

          {/* Biometric prompt */}
          {challenge.type === 'biometric' && (
            <div className="mb-6 text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Fingerprint className="w-12 h-12 text-blue-600" />
              </div>
              <p className="text-sm text-slate-500">
                Use your fingerprint or face to verify your identity
              </p>
            </div>
          )}

          {/* Push notification waiting */}
          {challenge.type === 'push_notification' && (
            <div className="mb-6 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Smartphone className="w-12 h-12 text-green-600" />
              </div>
              <p className="text-sm text-slate-500">
                Check your device for a notification and tap "Approve"
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            {challenge.type !== 'push_notification' && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (!userInput.trim() && challenge.type !== 'biometric')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Verify
                  </>
                )}
              </button>
            )}

            {challenge.skipOption && (
              <button
                onClick={onCancel}
                className="px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Skip
              </button>
            )}
          </div>

          {/* Fallback methods */}
          {challenge.fallbackMethods.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Having trouble? Try:</p>
              <div className="flex gap-2">
                {challenge.fallbackMethods.map((method, index) => (
                  <button
                    key={index}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                    onClick={() => {
                      // Switch to fallback method
                      console.log('Switch to:', method);
                    }}
                  >
                    {method.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading state component
const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mb-2">Securing your session...</h2>
      <p className="text-slate-600">This will just take a moment</p>
    </div>
  </div>
);

// Error state component
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Shield className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mb-2">Security Check Failed</h2>
      <p className="text-slate-600 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Blocked state component
const BlockedState: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <EyeOff className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mb-2">Access Temporarily Restricted</h2>
      <p className="text-slate-600 mb-6">
        For security reasons, we've temporarily restricted access from this device or location. 
        Please contact support if you believe this is an error.
      </p>
      <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
        Contact Support
      </button>
    </div>
  </div>
);

// Helper functions
const getCurrentIP = async (): Promise<string> => {
  try {
    // In a real implementation, this would call an IP detection service
    return '192.168.1.1';
  } catch {
    return 'unknown';
  }
};

const getTrustLevel = (score: number): string => {
  if (score >= 0.8) return 'Excellent';
  if (score >= 0.6) return 'Good';
  if (score >= 0.4) return 'Fair';
  return 'Needs Attention';
};

export default ZeroTrustAuthWrapper;