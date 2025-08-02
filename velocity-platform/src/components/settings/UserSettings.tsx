import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  KeyIcon,
  CreditCardIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

interface NotificationSettings {
  email: boolean;
  browser: boolean;
  mobile: boolean;
  agentUpdates: boolean;
  complianceAlerts: boolean;
  weeklyReports: boolean;
  securityNotifications: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: string;
  loginNotifications: boolean;
  deviceTracking: boolean;
}

interface PrivacySettings {
  shareAnalytics: boolean;
  shareUsageData: boolean;
  marketingEmails: boolean;
  publicProfile: boolean;
}

const UserSettings: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    role: user?.role || '',
    phone: user?.phone || '',
    timezone: user?.timezone || 'UTC',
    language: user?.language || 'en',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    browser: true,
    mobile: false,
    agentUpdates: true,
    complianceAlerts: true,
    weeklyReports: true,
    securityNotifications: true,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: '60',
    loginNotifications: true,
    deviceTracking: true,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    shareAnalytics: true,
    shareUsageData: false,
    marketingEmails: false,
    publicProfile: false,
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: KeyIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon },
    { id: 'preferences', name: 'Preferences', icon: CogIcon },
  ];

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      await updateUser(profileData);
      showSuccessMessage('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      showSuccessMessage('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    setLoading(true);
    try {
      // API call to save notification settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      showSuccessMessage('Notification settings saved');
    } catch (error) {
      console.error('Error saving notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySave = async () => {
    setLoading(true);
    try {
      // API call to save security settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      showSuccessMessage('Security settings saved');
    } catch (error) {
      console.error('Error saving security settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacySave = async () => {
    setLoading(true);
    try {
      // API call to save privacy settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      showSuccessMessage('Privacy settings saved');
    } catch (error) {
      console.error('Error saving privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const enableTwoFactor = async () => {
    setLoading(true);
    try {
      // API call to enable 2FA
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock API call
      setSecurity(prev => ({ ...prev, twoFactorEnabled: true }));
      showSuccessMessage('Two-factor authentication enabled');
    } catch (error) {
      console.error('Error enabling 2FA:', error);
    } finally {
      setLoading(false);
    }
  };

  const disableTwoFactor = async () => {
    const confirm = window.confirm('Are you sure you want to disable two-factor authentication?');
    if (!confirm) return;

    setLoading(true);
    try {
      // API call to disable 2FA
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      setSecurity(prev => ({ ...prev, twoFactorEnabled: false }));
      showSuccessMessage('Two-factor authentication disabled');
    } catch (error) {
      console.error('Error disabling 2FA:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    const confirm = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirm) return;

    const finalConfirm = window.confirm(
      'This will permanently delete all your data. Type "DELETE" to confirm.'
    );
    if (!finalConfirm) return;

    setLoading(true);
    try {
      // API call to delete account
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock API call
      logout();
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security settings</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-600'
                    : 'text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
              
              <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-purple-600" />
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mr-3">
                      Change Avatar
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                      Remove
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={profileData.timezone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">EST</option>
                      <option value="PST">PST</option>
                      <option value="GMT">GMT</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={profileData.language}
                      onChange={(e) => setProfileData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleProfileSave}
                    disabled={loading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              {/* Change Password Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handlePasswordChange}
                    disabled={loading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      security.twoFactorEnabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  
                  {security.twoFactorEnabled ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        Two-factor authentication is currently enabled for your account.
                      </p>
                      <button
                        onClick={disableTwoFactor}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        {loading ? 'Disabling...' : 'Disable 2FA'}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        Secure your account with two-factor authentication using an authenticator app.
                      </p>
                      <button
                        onClick={enableTwoFactor}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? 'Enabling...' : 'Enable 2FA'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Session Settings */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <select
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                        <option value="480">8 hours</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Login Notifications</h4>
                        <p className="text-xs text-gray-500">Get notified when someone signs into your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.loginNotifications}
                          onChange={(e) => setSecurity(prev => ({ ...prev, loginNotifications: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Device Tracking</h4>
                        <p className="text-xs text-gray-500">Track devices that access your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.deviceTracking}
                          onChange={(e) => setSecurity(prev => ({ ...prev, deviceTracking: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSecuritySave}
                      disabled={loading}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Security Settings'}
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-2" />
                    <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
                  </div>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={deleteAccount}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Methods</h3>
                    <div className="space-y-4">
                      {Object.entries({
                        email: 'Email notifications',
                        browser: 'Browser notifications',
                        mobile: 'Mobile push notifications',
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[key as keyof NotificationSettings] as boolean}
                              onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
                    <div className="space-y-4">
                      {Object.entries({
                        agentUpdates: 'AI Agent status updates',
                        complianceAlerts: 'Compliance alerts and warnings',
                        weeklyReports: 'Weekly compliance reports',
                        securityNotifications: 'Security notifications',
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[key as keyof NotificationSettings] as boolean}
                              onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNotificationSave}
                    disabled={loading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="space-y-6">
                  {Object.entries({
                    shareAnalytics: {
                      title: 'Share Analytics Data',
                      description: 'Help improve our service by sharing anonymous usage analytics'
                    },
                    shareUsageData: {
                      title: 'Share Usage Data',
                      description: 'Allow us to collect data about how you use our platform'
                    },
                    marketingEmails: {
                      title: 'Marketing Emails',
                      description: 'Receive emails about new features and product updates'
                    },
                    publicProfile: {
                      title: 'Public Profile',
                      description: 'Make your profile visible to other users in your organization'
                    },
                  }).map(([key, { title, description }]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                        <p className="text-xs text-gray-500">{description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy[key as keyof PrivacySettings]}
                          onChange={(e) => setPrivacy(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handlePrivacySave}
                    disabled={loading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Privacy Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing & Subscription</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">Professional Plan</h4>
                      <p className="text-gray-600">$99/month • Billed monthly</p>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                      Unlimited AI agents
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                      Advanced compliance frameworks
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                      Priority support
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Upgrade Plan
                    </button>
                    <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Change Plan
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <CreditCardIcon className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600">Expires 12/25</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50">
                    Update Payment Method
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b">
                      <div>
                        <p className="font-medium text-gray-900">Professional Plan</p>
                        <p className="text-sm text-gray-600">January 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">$99.00</p>
                        <button className="text-sm text-purple-600 hover:text-purple-800">Download</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <div>
                        <p className="font-medium text-gray-900">Professional Plan</p>
                        <p className="text-sm text-gray-600">December 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">$99.00</p>
                        <button className="text-sm text-purple-600 hover:text-purple-800">Download</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Preferences</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Dashboard View
                        </label>
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                          <option>Overview Dashboard</option>
                          <option>Compliance Dashboard</option>
                          <option>Agent Dashboard</option>
                          <option>Analytics Dashboard</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Refresh Interval
                        </label>
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                          <option>Real-time</option>
                          <option>Every 30 seconds</option>
                          <option>Every minute</option>
                          <option>Every 5 minutes</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme
                        </label>
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                          <option>Light</option>
                          <option>Dark</option>
                          <option>Auto</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data Format
                        </label>
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                          <option>MM/DD/YYYY</option>
                          <option>DD/MM/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;