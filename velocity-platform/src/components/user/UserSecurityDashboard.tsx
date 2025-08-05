/**
 * User Security Dashboard
 * Provides users with visibility and control over their security posture
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  Smartphone, 
  MapPin, 
  Clock, 
  Eye,
  EyeOff,
  Settings,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Info,
  Bell,
  BellOff,
  RefreshCw,
  Download,
  Trash2,
  Edit3
} from 'lucide-react';

interface UserSecurityData {
  trustScore: number;
  trustLevel: string;
  securityStrength: 'weak' | 'fair' | 'good' | 'excellent';
  devices: UserDevice[];
  recentActivity: SecurityEvent[];
  locationHistory: LocationAccess[];
  securitySettings: SecuritySettings;
  recommendations: SecurityRecommendation[];
  sessionHistory: SessionInfo[];
}

interface UserDevice {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  trustScore: number;
  status: 'trusted' | 'learning' | 'suspicious' | 'blocked';
  lastSeen: Date;
  firstSeen: Date;
  usageCount: number;
  location: string;
  isCurrentDevice: boolean;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'location_change' | 'device_change' | 'suspicious_activity' | 'policy_violation';
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  location?: string;
  deviceInfo?: string;
  resolved: boolean;
}

interface LocationAccess {
  id: string;
  country: string;
  city: string;
  ipAddress: string;
  firstAccess: Date;
  lastAccess: Date;
  accessCount: number;
  trustLevel: 'trusted' | 'normal' | 'suspicious';
  vpnDetected: boolean;
}

interface SecuritySettings {
  notifications: {
    newDevice: boolean;
    newLocation: boolean;
    suspiciousActivity: boolean;
    securityTips: boolean;
  };
  privacy: {
    behaviorTracking: boolean;
    locationTracking: boolean;
    deviceFingerprinting: boolean;
  };
  authentication: {
    requireStepUp: boolean;
    preferredMethod: string;
    sessionTimeout: number; // minutes
  };
}

interface SecurityRecommendation {
  id: string;
  type: 'device' | 'location' | 'behavior' | 'settings';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionText?: string;
  completed: boolean;
}

interface SessionInfo {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  device: string;
  location: string;
  actionsPerformed: number;
  riskScore: number;
  isActive: boolean;
}

export const UserSecurityDashboard: React.FC<{ userId: string }> = ({ userId }) => {
  const [securityData, setSecurityData] = useState<UserSecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'activity' | 'settings'>('overview');
  const [showDetailsFor, setShowDetailsFor] = useState<string | null>(null);

  useEffect(() => {
    loadSecurityData();
  }, [userId]);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      // In real implementation, would fetch from API
      const data = await fetchUserSecurityData(userId);
      setSecurityData(data);
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceAction = async (deviceId: string, action: 'trust' | 'block' | 'remove') => {
    try {
      await fetch(`/api/user/devices/${deviceId}/${action}`, { method: 'POST' });
      await loadSecurityData(); // Refresh data
    } catch (error) {
      console.error(`Failed to ${action} device:`, error);
    }
  };

  const handleLocationAction = async (locationId: string, action: 'trust' | 'block') => {
    try {
      await fetch(`/api/user/locations/${locationId}/${action}`, { method: 'POST' });
      await loadSecurityData(); // Refresh data
    } catch (error) {
      console.error(`Failed to ${action} location:`, error);
    }
  };

  const updateSecuritySettings = async (settings: Partial<SecuritySettings>) => {
    try {
      await fetch('/api/user/security-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      await loadSecurityData(); // Refresh data
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!securityData) {
    return <ErrorState onRetry={loadSecurityData} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Security Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your account security</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={loadSecurityData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Trust Score Overview */}
      <SecurityScoreCard securityData={securityData} />

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'devices', label: 'Devices', icon: Smartphone },
              { key: 'activity', label: 'Activity', icon: Activity },
              { key: 'settings', label: 'Settings', icon: Settings }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab securityData={securityData} />}
          {activeTab === 'devices' && (
            <DevicesTab 
              devices={securityData.devices} 
              onDeviceAction={handleDeviceAction}
            />
          )}
          {activeTab === 'activity' && (
            <ActivityTab 
              events={securityData.recentActivity}
              sessions={securityData.sessionHistory}
              locations={securityData.locationHistory}
              onLocationAction={handleLocationAction}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab 
              settings={securityData.securitySettings}
              onUpdateSettings={updateSecuritySettings}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const SecurityScoreCard: React.FC<{ securityData: UserSecurityData }> = ({ securityData }) => {
  const getTrustScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-blue-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrustScoreBg = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-blue-500';
    if (score >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Security Score</h2>
          <p className="text-sm text-gray-600">Your overall account security strength</p>
        </div>
        
        <div className="text-right">
          <div className={`text-3xl font-bold ${getTrustScoreColor(securityData.trustScore)}`}>
            {Math.round(securityData.trustScore * 100)}%
          </div>
          <div className="text-sm text-gray-600">{securityData.trustLevel}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>Weak</span>
          <span>Excellent</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getTrustScoreBg(securityData.trustScore)}`}
            style={{ width: `${Math.max(10, securityData.trustScore * 100)}%` }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{securityData.devices.length}</div>
          <div className="text-xs text-gray-600">Devices</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{securityData.locationHistory.length}</div>
          <div className="text-xs text-gray-600">Locations</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {securityData.recentActivity.filter(e => e.severity === 'high').length}
          </div>
          <div className="text-xs text-gray-600">High Alerts</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {securityData.recommendations.filter(r => !r.completed).length}
          </div>
          <div className="text-xs text-gray-600">Recommendations</div>
        </div>
      </div>
    </div>
  );
};

const OverviewTab: React.FC<{ securityData: UserSecurityData }> = ({ securityData }) => (
  <div className="space-y-6">
    {/* Security Recommendations */}
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Security Recommendations</h3>
      <div className="space-y-3">
        {securityData.recommendations.slice(0, 3).map(rec => (
          <div key={rec.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <div className={`p-1 rounded ${
              rec.priority === 'high' ? 'bg-red-100 text-red-600' :
              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              <Info className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{rec.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
              {rec.actionText && (
                <button className="text-sm text-blue-600 hover:text-blue-800 mt-2">
                  {rec.actionText} →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Activity */}
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-2">
        {securityData.recentActivity.slice(0, 5).map(event => (
          <div key={event.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                event.severity === 'high' ? 'bg-red-500' :
                event.severity === 'medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`} />
              <div>
                <div className="text-sm font-medium text-gray-900">{event.description}</div>
                <div className="text-xs text-gray-500">{event.timestamp.toLocaleString()}</div>
              </div>
            </div>
            {event.resolved ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DevicesTab: React.FC<{
  devices: UserDevice[];
  onDeviceAction: (deviceId: string, action: 'trust' | 'block' | 'remove') => void;
}> = ({ devices, onDeviceAction }) => (
  <div className="space-y-4">
    {devices.map(device => (
      <div key={device.id} className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-gray-400" />
            <div>
              <h4 className="font-medium text-gray-900">
                {device.name} {device.isCurrentDevice && <span className="text-xs text-blue-600">(Current)</span>}
              </h4>
              <p className="text-sm text-gray-600">{device.browser} on {device.os}</p>
              <p className="text-xs text-gray-500">
                Last seen: {device.lastSeen.toLocaleDateString()} • {device.location}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-sm font-medium ${
                device.status === 'trusted' ? 'text-green-600' :
                device.status === 'learning' ? 'text-blue-600' :
                device.status === 'suspicious' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
              </div>
              <div className="text-xs text-gray-500">
                Trust: {Math.round(device.trustScore * 100)}%
              </div>
            </div>
            
            <div className="flex gap-2">
              {device.status !== 'trusted' && (
                <button
                  onClick={() => onDeviceAction(device.id, 'trust')}
                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                  title="Trust this device"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              {device.status !== 'blocked' && (
                <button
                  onClick={() => onDeviceAction(device.id, 'block')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Block this device"
                >
                  <Lock className="w-4 h-4" />
                </button>
              )}
              {!device.isCurrentDevice && (
                <button
                  onClick={() => onDeviceAction(device.id, 'remove')}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                  title="Remove this device"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ActivityTab: React.FC<{
  events: SecurityEvent[];
  sessions: SessionInfo[];
  locations: LocationAccess[];
  onLocationAction: (locationId: string, action: 'trust' | 'block') => void;
}> = ({ events, sessions, locations, onLocationAction }) => {
  const [subTab, setSubTab] = useState<'events' | 'sessions' | 'locations'>('events');

  return (
    <div className="space-y-4">
      {/* Sub-navigation */}
      <div className="flex space-x-4 border-b border-gray-200">
        {[
          { key: 'events', label: 'Security Events' },
          { key: 'sessions', label: 'Sessions' },
          { key: 'locations', label: 'Locations' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSubTab(key as any)}
            className={`pb-2 px-1 text-sm font-medium border-b-2 ${
              subTab === key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {subTab === 'events' && (
        <div className="space-y-2">
          {events.map(event => (
            <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  event.severity === 'high' ? 'bg-red-500' :
                  event.severity === 'medium' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <div>
                  <div className="font-medium text-gray-900">{event.description}</div>
                  <div className="text-sm text-gray-500">{event.timestamp.toLocaleString()}</div>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                event.resolved 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {event.resolved ? 'Resolved' : 'Active'}
              </div>
            </div>
          ))}
        </div>
      )}

      {subTab === 'sessions' && (
        <div className="space-y-2">
          {sessions.map(session => (
            <div key={session.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    {session.device} • {session.location}
                  </div>
                  <div className="text-sm text-gray-500">
                    {session.startTime.toLocaleString()} • {session.duration} minutes
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">Risk: {Math.round(session.riskScore * 100)}%</div>
                    <div className="text-xs text-gray-500">{session.actionsPerformed} actions</div>
                  </div>
                  {session.isActive && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {subTab === 'locations' && (
        <div className="space-y-2">
          {locations.map(location => (
            <div key={location.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {location.city}, {location.country}
                      {location.vpnDetected && <span className="text-xs text-orange-600 ml-2">(VPN)</span>}
                    </div>
                    <div className="text-sm text-gray-500">
                      {location.accessCount} accesses • Last: {location.lastAccess.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    location.trustLevel === 'trusted' ? 'bg-green-100 text-green-700' :
                    location.trustLevel === 'suspicious' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {location.trustLevel}
                  </div>
                  
                  {location.trustLevel !== 'trusted' && (
                    <button
                      onClick={() => onLocationAction(location.id, 'trust')}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {location.trustLevel !== 'suspicious' && (
                    <button
                      onClick={() => onLocationAction(location.id, 'block')}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SettingsTab: React.FC<{
  settings: SecuritySettings;
  onUpdateSettings: (settings: Partial<SecuritySettings>) => void;
}> = ({ settings, onUpdateSettings }) => {
  const updateNotificationSetting = (key: keyof SecuritySettings['notifications'], value: boolean) => {
    onUpdateSettings({
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    });
  };

  const updatePrivacySetting = (key: keyof SecuritySettings['privacy'], value: boolean) => {
    onUpdateSettings({
      privacy: {
        ...settings.privacy,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Notifications */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'newDevice', label: 'New device access', desc: 'Alert when your account is accessed from a new device' },
            { key: 'newLocation', label: 'New location access', desc: 'Alert when your account is accessed from a new location' },
            { key: 'suspiciousActivity', label: 'Suspicious activity', desc: 'Alert about potentially suspicious activity' },
            { key: 'securityTips', label: 'Security tips', desc: 'Receive helpful security recommendations' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-500">{desc}</div>
              </div>
              <button
                onClick={() => updateNotificationSetting(key as any, !settings.notifications[key as keyof typeof settings.notifications])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications[key as keyof typeof settings.notifications] ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications[key as keyof typeof settings.notifications] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Controls</h3>
        <div className="space-y-4">
          {[
            { key: 'behaviorTracking', label: 'Behavior analysis', desc: 'Allow analysis of typing and mouse patterns for security' },
            { key: 'locationTracking', label: 'Location tracking', desc: 'Track general location for security analysis' },
            { key: 'deviceFingerprinting', label: 'Device fingerprinting', desc: 'Create device fingerprints for recognition' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-500">{desc}</div>
              </div>
              <button
                onClick={() => updatePrivacySetting(key as any, !settings.privacy[key as keyof typeof settings.privacy])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.privacy[key as keyof typeof settings.privacy] ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.privacy[key as keyof typeof settings.privacy] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Authentication */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Require step-up authentication</div>
              <div className="text-sm text-gray-500">Require additional verification for sensitive actions</div>
            </div>
            <button
              onClick={() => onUpdateSettings({
                authentication: {
                  ...settings.authentication,
                  requireStepUp: !settings.authentication.requireStepUp
                }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.authentication.requireStepUp ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.authentication.requireStepUp ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred authentication method
            </label>
            <select
              value={settings.authentication.preferredMethod}
              onChange={(e) => onUpdateSettings({
                authentication: {
                  ...settings.authentication,
                  preferredMethod: e.target.value
                }
              })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="push_notification">Push Notification</option>
              <option value="sms">SMS Code</option>
              <option value="totp">Authenticator App</option>
              <option value="email">Email Verification</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session timeout (minutes)
            </label>
            <select
              value={settings.authentication.sessionTimeout}
              onChange={(e) => onUpdateSettings({
                authentication: {
                  ...settings.authentication,
                  sessionTimeout: parseInt(e.target.value)
                }
              })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={240}>4 hours</option>
              <option value={480}>8 hours</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingState: React.FC = () => (
  <div className="max-w-6xl mx-auto p-6">
    <div className="animate-pulse space-y-6">
      <div className="bg-gray-200 h-32 rounded-xl" />
      <div className="bg-gray-200 h-64 rounded-xl" />
      <div className="bg-gray-200 h-96 rounded-xl" />
    </div>
  </div>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="max-w-6xl mx-auto p-6">
    <div className="text-center py-12">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Security Data</h2>
      <p className="text-gray-600 mb-4">There was an error loading your security information.</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Mock data function
const fetchUserSecurityData = async (userId: string): Promise<UserSecurityData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    trustScore: 0.85,
    trustLevel: 'Excellent',
    securityStrength: 'excellent',
    devices: [
      {
        id: 'device1',
        name: 'MacBook Pro',
        type: 'desktop',
        browser: 'Chrome',
        os: 'macOS',
        trustScore: 0.95,
        status: 'trusted',
        lastSeen: new Date(),
        firstSeen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        usageCount: 145,
        location: 'San Francisco, CA',
        isCurrentDevice: true
      }
    ],
    recentActivity: [
      {
        id: 'event1',
        type: 'login',
        description: 'Successful login from San Francisco, CA',
        timestamp: new Date(),
        severity: 'low',
        resolved: true
      }
    ],
    locationHistory: [
      {
        id: 'loc1',
        country: 'United States',
        city: 'San Francisco',
        ipAddress: '192.168.1.1',
        firstAccess: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastAccess: new Date(),
        accessCount: 145,
        trustLevel: 'trusted',
        vpnDetected: false
      }
    ],
    securitySettings: {
      notifications: {
        newDevice: true,
        newLocation: true,
        suspiciousActivity: true,
        securityTips: false
      },
      privacy: {
        behaviorTracking: true,
        locationTracking: true,
        deviceFingerprinting: true
      },
      authentication: {
        requireStepUp: true,
        preferredMethod: 'push_notification',
        sessionTimeout: 120
      }
    },
    recommendations: [
      {
        id: 'rec1',
        type: 'settings',
        title: 'Enable Two-Factor Authentication',
        description: 'Add an extra layer of security to your account',
        priority: 'high',
        actionText: 'Set up 2FA',
        completed: false
      }
    ],
    sessionHistory: [
      {
        id: 'session1',
        startTime: new Date(),
        duration: 45,
        device: 'MacBook Pro',
        location: 'San Francisco, CA',
        actionsPerformed: 23,
        riskScore: 0.15,
        isActive: true
      }
    ]
  };
};

export default UserSecurityDashboard;