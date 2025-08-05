/**
 * Zero Trust Admin Monitoring Dashboard
 * Real-time security monitoring and analytics for administrators
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Activity, 
  Smartphone, 
  Globe,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Search,
  ChevronDown
} from 'lucide-react';

interface DashboardMetrics {
  totalUsers: number;
  activeSessions: number;
  trustedDevices: number;
  blockedAttempts: number;
  averageTrustScore: number;
  criticalAlerts: number;
  recentAnomalies: any[];
  trustScoreDistribution: any[];
  deviceStatusBreakdown: any[];
  locationRiskAnalysis: any[];
  behaviorTrends: any[];
}

interface SecurityEvent {
  id: string;
  timestamp: Date;
  userId: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  details: any;
  status: 'new' | 'investigating' | 'resolved';
  trustScore: number;
  location: string;
  device: string;
}

export const ZeroTrustDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API calls - in real implementation would fetch from backend
      const [metricsData, eventsData] = await Promise.all([
        fetchMetrics(selectedTimeRange),
        fetchSecurityEvents(selectedTimeRange, filterSeverity)
      ]);
      
      setMetrics(metricsData);
      setSecurityEvents(eventsData);
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh data
  useEffect(() => {
    fetchDashboardData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [selectedTimeRange, filterSeverity, autoRefresh]);

  const handleExportData = () => {
    // Implementation would export current dashboard data
    console.log('Exporting dashboard data...');
  };

  if (isLoading && !metrics) {
    return <DashboardLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Zero Trust Security Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time monitoring and analytics for your security posture
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </button>

            {/* Export Button */}
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Active Users"
          value={metrics?.totalUsers || 0}
          icon={<Users className="w-6 h-6" />}
          trend="+12%"
          trendDirection="up"
          color="blue"
        />
        <MetricCard
          title="Active Sessions"
          value={metrics?.activeSessions || 0}
          icon={<Activity className="w-6 h-6" />}
          trend="+5%"
          trendDirection="up"
          color="green"
        />
        <MetricCard
          title="Avg Trust Score"
          value={`${Math.round((metrics?.averageTrustScore || 0) * 100)}%`}
          icon={<Shield className="w-6 h-6" />}
          trend="+3%"
          trendDirection="up"
          color="emerald"
        />
        <MetricCard
          title="Critical Alerts"
          value={metrics?.criticalAlerts || 0}
          icon={<AlertTriangle className="w-6 h-6" />}
          trend="-8%"
          trendDirection="down"
          color="red"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trust Score Distribution */}
          <DashboardCard title="Trust Score Distribution" icon={<Shield className="w-5 h-5" />}>
            <TrustScoreChart data={metrics?.trustScoreDistribution || []} />
          </DashboardCard>

          {/* Security Events Timeline */}
          <DashboardCard title="Recent Security Events" icon={<AlertTriangle className="w-5 h-5" />}>
            <SecurityEventsTimeline events={securityEvents.slice(0, 10)} />
          </DashboardCard>

          {/* Behavior Trends */}
          <DashboardCard title="Behavior Analytics" icon={<Activity className="w-5 h-5" />}>
            <BehaviorTrendsChart data={metrics?.behaviorTrends || []} />
          </DashboardCard>
        </div>

        {/* Right Column - Status and Controls */}
        <div className="space-y-6">
          {/* Device Status */}
          <DashboardCard title="Device Status" icon={<Smartphone className="w-5 h-5" />}>
            <DeviceStatusBreakdown data={metrics?.deviceStatusBreakdown || []} />
          </DashboardCard>

          {/* Location Risk Analysis */}
          <DashboardCard title="Location Risk" icon={<Globe className="w-5 h-5" />}>
            <LocationRiskPanel data={metrics?.locationRiskAnalysis || []} />
          </DashboardCard>

          {/* Real-time Alerts */}
          <DashboardCard title="Real-time Alerts" icon={<Eye className="w-5 h-5" />}>
            <RealTimeAlerts events={securityEvents.filter(e => e.severity === 'critical')} />
          </DashboardCard>

          {/* System Controls */}
          <DashboardCard title="Quick Actions" icon={<Settings className="w-5 h-5" />}>
            <QuickActions />
          </DashboardCard>
        </div>
      </div>

      {/* Detailed Events Table */}
      <div className="mt-8">
        <DashboardCard title="Security Events Details" icon={<AlertTriangle className="w-5 h-5" />}>
          <SecurityEventsTable 
            events={securityEvents} 
            onFilterChange={setFilterSeverity}
            currentFilter={filterSeverity}
          />
        </DashboardCard>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  trendDirection: 'up' | 'down';
  color: string;
}> = ({ title, value, icon, trend, trendDirection, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    emerald: 'bg-emerald-500',
    red: 'bg-red-500'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} bg-opacity-10`}>
          <div className={`text-${color}-600`}>{icon}</div>
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trendDirection === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {trend}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
    </div>
  );
};

// Dashboard Card Container
const DashboardCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <div className="text-gray-600">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Trust Score Chart Component
const TrustScoreChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="space-y-4">
    {['Excellent (80-100%)', 'Good (60-80%)', 'Fair (40-60%)', 'Poor (<40%)'].map((level, index) => {
      const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500'];
      const percentage = Math.random() * 40 + 10; // Mock data
      
      return (
        <div key={level} className="flex items-center gap-4">
          <div className="w-32 text-sm text-gray-600">{level}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${colors[index]}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="w-12 text-sm font-medium text-gray-900">
            {Math.round(percentage)}%
          </div>
        </div>
      );
    })}
  </div>
);

// Security Events Timeline
const SecurityEventsTimeline: React.FC<{ events: SecurityEvent[] }> = ({ events }) => (
  <div className="space-y-4 max-h-64 overflow-y-auto">
    {events.map((event, index) => (
      <div key={event.id} className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full mt-2 ${
          event.severity === 'critical' ? 'bg-red-500' :
          event.severity === 'high' ? 'bg-orange-500' :
          event.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
        }`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900">{event.description}</div>
          <div className="text-xs text-gray-500 mt-1">
            {event.timestamp.toLocaleTimeString()} • {event.location} • Trust: {Math.round(event.trustScore * 100)}%
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Quick Actions Panel
const QuickActions: React.FC = () => (
  <div className="space-y-3">
    <button className="w-full flex items-center justify-between p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200">
      <span className="text-sm font-medium text-red-700">Emergency Lockdown</span>
      <Shield className="w-4 h-4 text-red-600" />
    </button>
    <button className="w-full flex items-center justify-between p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
      <span className="text-sm font-medium text-blue-700">Refresh All Sessions</span>
      <RefreshCw className="w-4 h-4 text-blue-600" />
    </button>
    <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
      <span className="text-sm font-medium text-gray-700">Export Security Log</span>
      <Download className="w-4 h-4 text-gray-600" />
    </button>
  </div>
);

// Other component stubs for the dashboard
const BehaviorTrendsChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-64 flex items-center justify-center text-gray-500">
    Behavior trends visualization would go here
  </div>
);

const DeviceStatusBreakdown: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="space-y-3">
    {['Trusted', 'Learning', 'Suspicious', 'Blocked'].map((status, index) => (
      <div key={status} className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{status}</span>
        <span className="font-medium">{Math.floor(Math.random() * 100)}</span>
      </div>
    ))}
  </div>
);

const LocationRiskPanel: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="space-y-3">
    {['Low Risk', 'Medium Risk', 'High Risk'].map((risk, index) => (
      <div key={risk} className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{risk}</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          index === 0 ? 'bg-green-100 text-green-700' :
          index === 1 ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {Math.floor(Math.random() * 50)}%
        </span>
      </div>
    ))}
  </div>
);

const RealTimeAlerts: React.FC<{ events: SecurityEvent[] }> = ({ events }) => (
  <div className="space-y-2 max-h-32 overflow-y-auto">
    {events.length === 0 ? (
      <div className="text-sm text-gray-500 text-center py-4">No critical alerts</div>
    ) : (
      events.map(event => (
        <div key={event.id} className="text-sm bg-red-50 p-2 rounded border border-red-200">
          <div className="font-medium text-red-700">{event.description}</div>
          <div className="text-xs text-red-600 mt-1">{event.timestamp.toLocaleTimeString()}</div>
        </div>
      ))
    )}
  </div>
);

const SecurityEventsTable: React.FC<{
  events: SecurityEvent[];
  onFilterChange: (filter: string) => void;
  currentFilter: string;
}> = ({ events, onFilterChange, currentFilter }) => (
  <div>
    {/* Table filters */}
    <div className="flex items-center gap-4 mb-4">
      <select
        value={currentFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
      >
        <option value="all">All Severities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3 font-medium text-gray-700">Time</th>
            <th className="text-left p-3 font-medium text-gray-700">Type</th>
            <th className="text-left p-3 font-medium text-gray-700">User</th>
            <th className="text-left p-3 font-medium text-gray-700">Location</th>
            <th className="text-left p-3 font-medium text-gray-700">Trust Score</th>
            <th className="text-left p-3 font-medium text-gray-700">Severity</th>
            <th className="text-left p-3 font-medium text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {events.slice(0, 20).map(event => (
            <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3">{event.timestamp.toLocaleTimeString()}</td>
              <td className="p-3">{event.type}</td>
              <td className="p-3">{event.userId}</td>
              <td className="p-3">{event.location}</td>
              <td className="p-3">{Math.round(event.trustScore * 100)}%</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  event.severity === 'critical' ? 'bg-red-100 text-red-700' :
                  event.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                  event.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {event.severity}
                </span>
              </td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  event.status === 'resolved' ? 'bg-green-100 text-green-700' :
                  event.status === 'investigating' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {event.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DashboardLoadingState: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
      <h2 className="text-lg font-semibold text-gray-900">Loading Dashboard...</h2>
      <p className="text-gray-600">Gathering security metrics</p>
    </div>
  </div>
);

// Mock data functions
const fetchMetrics = async (timeRange: string): Promise<DashboardMetrics> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    totalUsers: 1247,
    activeSessions: 342,
    trustedDevices: 2891,
    blockedAttempts: 23,
    averageTrustScore: 0.78,
    criticalAlerts: 3,
    recentAnomalies: [],
    trustScoreDistribution: [],
    deviceStatusBreakdown: [],
    locationRiskAnalysis: [],
    behaviorTrends: []
  };
};

const fetchSecurityEvents = async (timeRange: string, severity: string): Promise<SecurityEvent[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const events: SecurityEvent[] = [];
  for (let i = 0; i < 50; i++) {
    events.push({
      id: `event_${i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000),
      userId: `user_${Math.floor(Math.random() * 100)}`,
      type: ['behavior_anomaly', 'device_mismatch', 'location_risk', 'temporal_anomaly'][Math.floor(Math.random() * 4)],
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
      description: 'Security event description',
      details: {},
      status: ['new', 'investigating', 'resolved'][Math.floor(Math.random() * 3)] as any,
      trustScore: Math.random(),
      location: ['New York', 'London', 'Tokyo', 'Sydney'][Math.floor(Math.random() * 4)],
      device: 'Chrome/Windows'
    });
  }
  
  return events.filter(e => severity === 'all' || e.severity === severity);
};

export default ZeroTrustDashboard;