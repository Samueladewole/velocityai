import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import {
  UsersIcon,
  ServerIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

interface SystemMetric {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  status: 'healthy' | 'warning' | 'error';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
  organization: string;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

const AdminPanel: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Simulate API calls - replace with real API calls
      await Promise.all([
        loadSystemMetrics(),
        loadUsers(),
        loadSystemAlerts(),
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSystemMetrics = async () => {
    // Mock data - replace with real API call
    setSystemMetrics([
      { name: 'Total Users', value: '1,247', change: '+12%', trend: 'up', status: 'healthy' },
      { name: 'Active Agents', value: '342', change: '+8%', trend: 'up', status: 'healthy' },
      { name: 'API Requests/min', value: '1,834', change: '+15%', trend: 'up', status: 'healthy' },
      { name: 'System Uptime', value: '99.9%', change: '0%', trend: 'stable', status: 'healthy' },
      { name: 'Storage Used', value: '2.4TB', change: '+5%', trend: 'up', status: 'warning' },
      { name: 'Error Rate', value: '0.02%', change: '-50%', trend: 'down', status: 'healthy' },
    ]);
  };

  const loadUsers = async () => {
    // Mock data - replace with real API call
    setUsers([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        lastActive: '2 minutes ago',
        organization: 'Acme Corp'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        status: 'active',
        lastActive: '1 hour ago',
        organization: 'Tech Solutions'
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'user',
        status: 'inactive',
        lastActive: '2 days ago',
        organization: 'Global Industries'
      },
    ]);
  };

  const loadSystemAlerts = async () => {
    // Mock data - replace with real API call
    setAlerts([
      {
        id: '1',
        type: 'warning',
        message: 'High memory usage detected on server-01',
        timestamp: '5 minutes ago',
        resolved: false,
      },
      {
        id: '2',
        type: 'info',
        message: 'Database backup completed successfully',
        timestamp: '1 hour ago',
        resolved: true,
      },
      {
        id: '3',
        type: 'error',
        message: 'Failed to connect to external API',
        timestamp: '2 hours ago',
        resolved: false,
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'info': return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'users', name: 'User Management', icon: UsersIcon },
    { id: 'system', name: 'System Health', icon: ServerIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">System administration and management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <button
                onClick={loadAdminData}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

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
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">System Overview</h2>
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {systemMetrics.map((metric, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{metric.name}</p>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                        {metric.status}
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      {getTrendIcon(metric.trend)}
                      <span className="text-sm text-gray-600 ml-1">{metric.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Alerts */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
                </div>
                <div className="divide-y">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        {getAlertIcon(alert.type)}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.timestamp}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.resolved ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                      }`}>
                        {alert.resolved ? 'Resolved' : 'Active'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Add User
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="capitalize text-sm text-gray-900">{user.role}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastActive}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.organization}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-purple-600 hover:text-purple-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">System Health</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Server Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">API Server</span>
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">Healthy</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Database</span>
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">Healthy</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Redis Cache</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-medium">Warning</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">File Storage</span>
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">Healthy</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">CPU Usage</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Memory Usage</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Disk Usage</span>
                      <span className="text-sm font-medium">89%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Overview</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Events</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center">
                        <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-red-900">Failed login attempts</p>
                          <p className="text-xs text-red-600">Multiple attempts from IP 192.168.1.100</p>
                        </div>
                      </div>
                      <span className="text-xs text-red-600">2 min ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-yellow-900">Unusual API usage</p>
                          <p className="text-xs text-yellow-600">High rate limit exceeded</p>
                        </div>
                      </div>
                      <span className="text-xs text-yellow-600">15 min ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-xs text-gray-500">Require 2FA for all users</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" checked className="sr-only" />
                        <div className="block bg-green-500 w-14 h-8 rounded-full"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                        <p className="text-xs text-gray-500">Auto logout after inactivity</p>
                      </div>
                      <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">System Settings</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        System Name
                      </label>
                      <input
                        type="text"
                        value="Velocity AI Platform"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default User Role
                      </label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                        <option>User</option>
                        <option>Admin</option>
                        <option>Viewer</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maintenance Mode
                      </label>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm text-gray-600">Enable maintenance mode</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Server
                      </label>
                      <input
                        type="text"
                        placeholder="smtp.example.com"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        placeholder="noreply@velocity.ai"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Save Settings
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

export default AdminPanel;