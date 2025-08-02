/**
 * Live Interactive Velocity Dashboard
 * Real-time monitoring with live charts, streaming data, and interactive controls
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Database, 
  Target, 
  Zap, 
  Wifi, 
  WifiOff,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Sparkles,
  Layers
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { useLiveData } from './LiveDataProvider';
import BackToTopButton from '@/components/ui/BackToTopButton';

const LiveVelocityDashboard: React.FC = () => {
  const { 
    metrics, 
    agents, 
    evidenceStream, 
    isConnected, 
    connectionStatus,
    pauseAgent,
    resumeAgent,
    triggerCollection,
    refreshData 
  } = useLiveData();

  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-500 bg-green-50 border-green-200';
      case 'paused': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'completed': return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'error': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className="flex items-center space-x-2">
      {isConnected ? (
        <div className="flex items-center space-x-1 text-green-600">
          <Wifi className="w-4 h-4" />
          <span className="text-sm">Live</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      ) : (
        <div className="flex items-center space-x-1 text-red-600">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm">{connectionStatus}</span>
        </div>
      )}
    </div>
  );

  // Real-time metrics cards
  const MetricsCard = ({ title, value, icon, trend, suffix = '', color = 'blue' }: any) => (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg bg-${color}-100 flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </div>
            <div className="text-sm text-gray-600">{title}</div>
          </div>
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
    </div>
  );

  // Live evidence stream component
  const EvidenceStreamCard = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>Live Evidence Stream</span>
          </h3>
          <div className="text-sm text-gray-500">
            {evidenceStream.length} items today
          </div>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {evidenceStream.slice(0, 10).map((evidence, index) => (
          <div key={evidence.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    evidence.status === 'validated' ? 'bg-green-100 text-green-800' :
                    evidence.status === 'validating' ? 'bg-yellow-100 text-yellow-800' :
                    evidence.status === 'collecting' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {evidence.status}
                  </span>
                  <span className="text-xs text-gray-500">{evidence.evidence_type}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{evidence.framework}</span>
                </div>
                <div className="text-sm font-medium text-gray-900">{evidence.title}</div>
                <div className="text-xs text-gray-600 mt-1">Control: {evidence.control_id}</div>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>Confidence: {Math.round(evidence.confidence_score)}%</span>
                  <span>+{evidence.trust_points} Trust Points</span>
                  <span>{new Date(evidence.created_at).toLocaleTimeString()}</span>
                </div>
              </div>
              {evidence.status === 'collecting' && (
                <div className="flex items-center space-x-1 text-blue-500">
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Interactive agent control
  const AgentControlCard = ({ agent }: { agent: any }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center ${getStatusColor(agent.status)}`}>
            {getStatusIcon(agent.status)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{agent.name}</div>
            <div className="text-sm text-gray-600">{agent.platform} • {agent.framework}</div>
          </div>
        </div>
        <div className="flex space-x-1">
          {agent.status === 'running' ? (
            <Button
              onClick={() => pauseAgent(agent.id)}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
            >
              <Pause className="w-3 h-3" />
            </Button>
          ) : (
            <Button
              onClick={() => resumeAgent(agent.id)}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
            >
              <Play className="w-3 h-3" />
            </Button>
          )}
          <Button
            onClick={() => triggerCollection(agent.id)}
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
          >
            <Zap className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {agent.status === 'running' && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{agent.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${agent.progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">{agent.currentActivity}</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-600">Evidence</div>
          <div className="font-medium">{agent.evidence_collected}</div>
        </div>
        <div>
          <div className="text-gray-600">Success Rate</div>
          <div className="font-medium text-purple-600">{agent.success_rate}%</div>
        </div>
        <div>
          <div className="text-gray-600">Last Run</div>
          <div className="font-medium">{agent.last_run}</div>
        </div>
        <div>
          <div className="text-gray-600">Next Run</div>
          <div className="font-medium">{agent.next_run}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Live Velocity Dashboard</h1>
              <p className="text-gray-600 mt-1">Real-time compliance automation monitoring</p>
            </div>
            <div className="flex items-center space-x-4">
              <ConnectionStatus />
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Auto-refresh</label>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    autoRefresh ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    autoRefresh ? 'translate-x-5' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
              <Button onClick={refreshData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Last updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Live Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Active Agents"
            value={metrics.activeAgents}
            icon={<Activity className="w-6 h-6 text-blue-600" />}
            color="blue"
          />
          <MetricsCard
            title="Evidence Collected"
            value={metrics.totalEvidence}
            icon={<Database className="w-6 h-6 text-green-600" />}
            color="green"
          />
          <MetricsCard
            title="Trust Points"
            value={metrics.totalTrustPoints}
            icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
            color="purple"
          />
          <MetricsCard
            title="Automation Rate"
            value={metrics.automationRate}
            suffix="%"
            icon={<Target className="w-6 h-6 text-orange-600" />}
            color="orange"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Evidence Collection Trend */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Evidence Collection Trend</h3>
              <div className="flex space-x-2">
                {['1h', '6h', '24h'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedTimeRange === range 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={metrics.trendsData.evidenceOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(time) => new Date(time).toLocaleString()}
                  formatter={(value) => [value, 'Evidence Items']}
                />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#93C5FD" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Trust Points Growth */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust Points Growth</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={metrics.trendsData.trustPointsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(time) => new Date(time).toLocaleString()}
                  formatter={(value) => [value, 'Trust Points']}
                />
                <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Controls and Evidence Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Agents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Live Agent Control</span>
            </h3>
            {agents.map((agent) => (
              <AgentControlCard key={agent.id} agent={agent} />
            ))}
          </div>

          {/* Evidence Stream */}
          <EvidenceStreamCard />
        </div>

        {/* Additional Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Today's Performance</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Collections Completed</span>
                <span className="font-medium">{metrics.collectionsToday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Collection Time</span>
                <span className="font-medium">{Math.round(metrics.avgCollectionTime * 10) / 10} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate</span>
                <span className={`font-medium ${metrics.successRate >= 95 ? 'text-green-600' : metrics.successRate >= 85 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {Math.round(metrics.successRate * 10) / 10}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Layers className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Platform Distribution</h4>
            </div>
            <div className="space-y-2 text-sm">
              {metrics.platformDistribution.map((item) => (
                <div key={item.platform} className="flex items-center justify-between">
                  <span className="text-gray-600">{item.platform}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="font-medium w-8 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900">System Health</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Response Time</span>
                <span className={`font-medium ${metrics.systemHealth.apiResponseTime < 200 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {metrics.systemHealth.apiResponseTime}ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Queue Length</span>
                <span className="font-medium">{metrics.systemHealth.queueLength}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Error Rate</span>
                <span className={`font-medium ${metrics.systemHealth.errorRate < 0.05 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.systemHealth.errorRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BackToTopButton variant="blue" />
    </div>
  );
};

export default LiveVelocityDashboard;