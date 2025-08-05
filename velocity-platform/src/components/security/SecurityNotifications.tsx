/**
 * User-Friendly Security Notifications
 * Provides seamless, non-intrusive security feedback to users
 */

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Shield, AlertTriangle, Info, Settings, Eye } from 'lucide-react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface SecurityNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  duration?: number; // milliseconds, 0 = permanent
  dismissible: boolean;
  priority: 'low' | 'medium' | 'high';
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface NotificationAction {
  text: string;
  action: string;
  style?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
}

// Predefined notification templates for common security events
export const SecurityNotificationTemplates = {
  // Device Learning Notifications
  deviceLearning: (deviceName: string = 'device'): SecurityNotification => ({
    id: `device-learning-${Date.now()}`,
    type: 'info',
    title: 'Learning Your Device',
    message: `We're getting to know your ${deviceName} to make future logins smoother and more secure.`,
    icon: '🔐',
    duration: 8000,
    dismissible: true,
    priority: 'low',
    actions: [
      { text: 'Got it', action: 'dismiss', style: 'secondary' },
      { text: 'Learn more', action: 'show_device_info', style: 'primary' }
    ],
    timestamp: new Date()
  }),

  // Trust Score Improvement
  trustImproved: (newLevel: string): SecurityNotification => ({
    id: `trust-improved-${Date.now()}`,
    type: 'success',
    title: 'Security Score Improved! 🎉',
    message: `Your security score is now ${newLevel}. You'll experience fewer security checks.`,
    icon: '✅',
    duration: 5000,
    dismissible: true,
    priority: 'medium',
    actions: [
      { text: 'View details', action: 'show_trust_score', style: 'primary' }
    ],
    timestamp: new Date()
  }),

  // New Location Detection
  newLocation: (location: string): SecurityNotification => ({
    id: `new-location-${Date.now()}`,
    type: 'warning',
    title: 'New Location Detected',
    message: `We noticed you're signing in from ${location}. Is this you?`,
    icon: '🌍',
    duration: 0, // Requires user action
    dismissible: false,
    priority: 'high',
    actions: [
      { text: 'Yes, it\'s me', action: 'approve_location', style: 'primary' },
      { text: 'No, secure my account', action: 'security_lockdown', style: 'danger' }
    ],
    timestamp: new Date()
  }),

  // Device Trusted
  deviceTrusted: (deviceName: string): SecurityNotification => ({
    id: `device-trusted-${Date.now()}`,
    type: 'success',
    title: 'Device Trusted',
    message: `Your ${deviceName} is now fully trusted. Enjoy smoother, more secure access.`,
    icon: '🔒',
    duration: 6000,
    dismissible: true,
    priority: 'medium',
    actions: [
      { text: 'Manage devices', action: 'show_devices', style: 'secondary' }
    ],
    timestamp: new Date()
  }),

  // Suspicious Activity
  suspiciousActivity: (details: string): SecurityNotification => ({
    id: `suspicious-${Date.now()}`,
    type: 'warning',
    title: 'Unusual Activity Detected',
    message: `We detected ${details}. Please verify this was you.`,
    icon: '⚠️',
    duration: 0,
    dismissible: false,
    priority: 'high',
    actions: [
      { text: 'This was me', action: 'confirm_activity', style: 'primary' },
      { text: 'Secure my account', action: 'security_lockdown', style: 'danger' }
    ],
    timestamp: new Date()
  }),

  // Authentication Success
  authSuccess: (): SecurityNotification => ({
    id: `auth-success-${Date.now()}`,
    type: 'success',
    title: 'Authentication Successful',
    message: 'Your identity has been verified. Welcome back!',
    icon: '✅',
    duration: 3000,
    dismissible: true,
    priority: 'low',
    timestamp: new Date()
  }),

  // Security Enhancement Suggestion
  securityTip: (tip: string): SecurityNotification => ({
    id: `security-tip-${Date.now()}`,
    type: 'info',
    title: 'Security Tip',
    message: tip,
    icon: '💡',
    duration: 10000,
    dismissible: true,
    priority: 'low',
    actions: [
      { text: 'Apply now', action: 'apply_security_tip', style: 'primary' },
      { text: 'Remind me later', action: 'remind_later', style: 'secondary' }
    ],
    timestamp: new Date()
  })
};

// Main notification component
export const SecurityNotificationToast: React.FC<{
  notification: SecurityNotification;
  onDismiss: (id: string) => void;
  onAction: (action: string, notificationId: string) => void;
}> = ({ notification, onDismiss, onAction }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(notification.duration || 0);

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        if (notification.dismissible) {
          handleDismiss();
        }
      }, notification.duration);

      // Update countdown timer
      const countdownTimer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 100));
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownTimer);
      };
    }
  }, [notification.duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(notification.id), 300); // Allow for fade out animation
  };

  const handleAction = (action: string) => {
    onAction(action, notification.id);
    if (action === 'dismiss') {
      handleDismiss();
    }
  };

  const getColorClasses = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          border: 'border-emerald-500',
          bg: 'bg-emerald-50',
          text: 'text-emerald-800',
          icon: 'text-emerald-600'
        };
      case 'warning':
        return {
          border: 'border-amber-500',
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          icon: 'text-amber-600'
        };
      case 'error':
        return {
          border: 'border-red-500',
          bg: 'bg-red-50',
          text: 'text-red-800',
          icon: 'text-red-600'
        };
      default: // info
        return {
          border: 'border-blue-500',
          bg: 'bg-blue-50',
          text: 'text-blue-800',
          icon: 'text-blue-600'
        };
    }
  };

  const colors = getColorClasses(notification.type);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed top-4 right-4 max-w-sm w-full
        ${colors.bg} ${colors.border} border-l-4
        rounded-xl shadow-lg backdrop-blur-sm
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        z-50
      `}
      role="alert"
      aria-live={notification.priority === 'high' ? 'assertive' : 'polite'}
    >
      {/* Progress bar for timed notifications */}
      {notification.duration && notification.duration > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-xl overflow-hidden">
          <div
            className={`h-full ${notification.type === 'success' ? 'bg-emerald-500' : 
              notification.type === 'warning' ? 'bg-amber-500' :
              notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            } transition-all duration-100 ease-linear`}
            style={{
              width: `${Math.max(0, (timeRemaining / notification.duration) * 100)}%`
            }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            {notification.icon ? (
              <span className="text-2xl" role="img" aria-label="notification icon">
                {notification.icon}
              </span>
            ) : (
              <div className={`p-1 rounded-full ${colors.icon}`}>
                {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                {notification.type === 'error' && <AlertTriangle className="w-5 h-5" />}
                {notification.type === 'info' && <Info className="w-5 h-5" />}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold ${colors.text} text-sm mb-1`}>
              {notification.title}
            </h4>
            <p className={`${colors.text} text-sm opacity-90 leading-relaxed`}>
              {notification.message}
            </p>

            {/* Actions */}
            {notification.actions && notification.actions.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleAction(action.action)}
                    className={`
                      px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                      ${action.style === 'primary' 
                        ? `${colors.icon.replace('text-', 'bg-')} text-white hover:opacity-90`
                        : action.style === 'danger'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }
                    `}
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dismiss button */}
          {notification.dismissible && (
            <button
              onClick={handleDismiss}
              className={`
                flex-shrink-0 p-1 rounded-full transition-colors
                ${colors.text} hover:bg-white hover:bg-opacity-50
              `}
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Notification container component
export const SecurityNotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<SecurityNotification[]>([]);

  // Listen for new notifications
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent<SecurityNotification>) => {
      const notification = event.detail;
      
      // Prevent duplicate notifications
      setNotifications(prev => {
        const existing = prev.find(n => 
          n.type === notification.type && 
          n.title === notification.title &&
          Date.now() - n.timestamp.getTime() < 5000 // Within 5 seconds
        );
        
        if (existing) return prev;
        
        // Sort by priority and timestamp
        const updated = [...prev, notification].sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
          
          if (priorityDiff !== 0) return priorityDiff;
          return b.timestamp.getTime() - a.timestamp.getTime();
        });
        
        // Limit to 5 notifications max
        return updated.slice(0, 5);
      });
    };

    window.addEventListener('securityNotification', handleNewNotification as EventListener);
    
    return () => {
      window.removeEventListener('securityNotification', handleNewNotification as EventListener);
    };
  }, []);

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAction = (action: string, notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification) return;

    // Dispatch action event for handling
    window.dispatchEvent(new CustomEvent('securityNotificationAction', {
      detail: { action, notification }
    }));

    // Auto-dismiss for certain actions
    if (['dismiss', 'approve_location', 'confirm_activity'].includes(action)) {
      handleDismiss(notificationId);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{ 
            transform: `translateY(${index * 4}px)`,
            zIndex: 1000 - index 
          }}
        >
          <SecurityNotificationToast
            notification={notification}
            onDismiss={handleDismiss}
            onAction={handleAction}
          />
        </div>
      ))}
    </div>
  );
};

// Utility function to show notifications
export const showSecurityNotification = (notification: SecurityNotification) => {
  window.dispatchEvent(new CustomEvent('securityNotification', {
    detail: notification
  }));
};

// Hook for using security notifications in components
export const useSecurityNotifications = () => {
  const showNotification = (notification: SecurityNotification) => {
    showSecurityNotification(notification);
  };

  const showDeviceLearning = (deviceName?: string) => {
    showNotification(SecurityNotificationTemplates.deviceLearning(deviceName));
  };

  const showTrustImproved = (level: string) => {
    showNotification(SecurityNotificationTemplates.trustImproved(level));
  };

  const showNewLocation = (location: string) => {
    showNotification(SecurityNotificationTemplates.newLocation(location));
  };

  const showDeviceTrusted = (deviceName: string) => {
    showNotification(SecurityNotificationTemplates.deviceTrusted(deviceName));
  };

  const showSuspiciousActivity = (details: string) => {
    showNotification(SecurityNotificationTemplates.suspiciousActivity(details));
  };

  const showAuthSuccess = () => {
    showNotification(SecurityNotificationTemplates.authSuccess());
  };

  const showSecurityTip = (tip: string) => {
    showNotification(SecurityNotificationTemplates.securityTip(tip));
  };

  return {
    showNotification,
    showDeviceLearning,
    showTrustImproved,
    showNewLocation,
    showDeviceTrusted,
    showSuspiciousActivity,
    showAuthSuccess,
    showSecurityTip
  };
};

// Security Insights Component (Optional - shows trust score to users)
export const SecurityInsightsPanel: React.FC<{
  trustScore: number;
  deviceCount: number;
  lastSecurityCheck: Date;
}> = ({ trustScore, deviceCount, lastSecurityCheck }) => {
  const getTrustLevel = (score: number) => {
    if (score >= 0.8) return { level: 'Excellent', color: 'emerald', icon: '🛡️' };
    if (score >= 0.6) return { level: 'Good', color: 'blue', icon: '🔒' };
    if (score >= 0.4) return { level: 'Fair', color: 'amber', icon: '⚠️' };
    return { level: 'Needs Attention', color: 'red', icon: '🚨' };
  };

  const trust = getTrustLevel(trustScore);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-slate-100 rounded-lg">
          <Shield className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Security Status</h3>
          <p className="text-sm text-slate-600">Your account security overview</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Trust Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Trust Score</span>
            <span className={`text-sm font-semibold text-${trust.color}-600`}>
              {trust.icon} {trust.level}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-${trust.color}-500 transition-all duration-500`}
              style={{ width: `${Math.max(10, trustScore * 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {trustScore >= 0.8 
              ? "Excellent security posture with minimal authentication friction"
              : trustScore >= 0.6
              ? "Good security with occasional additional verification"
              : "Building trust - expect some additional security checks"
            }
          </p>
        </div>

        {/* Device Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700">Trusted Devices</span>
          <span className="text-sm font-medium text-slate-900">{deviceCount}</span>
        </div>

        {/* Last Check */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700">Last Security Check</span>
          <span className="text-sm font-medium text-slate-900">
            {lastSecurityCheck.toLocaleDateString()}
          </span>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-slate-100">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            Manage Security Settings
          </button>
        </div>
      </div>
    </div>
  );
};