import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  Database,
  Cloud,
  Shield,
  Clock,
  Users,
  Target,
  Plus,
  RefreshCw,
  Settings,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLiveData } from './LiveDataProvider';
import { useNavigate } from 'react-router-dom';

interface Agent {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'error';
  framework: string;
  evidenceCollected: number;
  lastRun: string;
  trustPoints: number;
  platform: string;
  nextRun?: string;
  progress?: number;
}

interface RealtimeMetrics {
  activeAgents: number;
  totalEvidence: number;
  totalTrustPoints: number;
  automationRate: number;
  lastUpdated: string;
}

const AgentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { metrics: liveMetrics, agents: liveAgents, isConnected } = useLiveData();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [metrics, setMetrics] = useState<RealtimeMetrics>({
    activeAgents: 0,
    totalEvidence: 0,
    totalTrustPoints: 0,
    automationRate: 0,
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate real-time data updates
  const fetchAgentsData = async () => {
    setRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate dynamic data based on current time
    const now = new Date();
    const evidenceBase = Math.floor(now.getMinutes() * 3.2) + 150;
    const trustPointsBase = Math.floor(now.getSeconds() * 8.7) + 400;
    
    const mockAgents: Agent[] = [
      {
        id: 'aws-soc2',
        name: 'AWS SOC2 Agent',
        status: 'running',
        framework: 'SOC2',
        platform: 'AWS',
        evidenceCollected: evidenceBase + Math.floor(Math.random() * 50),
        lastRun: `${Math.floor(Math.random() * 5) + 1} minutes ago`,
        nextRun: 'In 3h 24m',
        trustPoints: trustPointsBase + Math.floor(Math.random() * 100),
        progress: Math.floor(Math.random() * 40) + 60
      },
      {
        id: 'gcp-iso27001', 
        name: 'GCP ISO27001 Agent',
        status: 'running',
        framework: 'ISO27001',
        platform: 'GCP',
        evidenceCollected: Math.floor(evidenceBase * 0.6) + Math.floor(Math.random() * 30),
        lastRun: `${Math.floor(Math.random() * 8) + 3} minutes ago`,
        nextRun: 'In 2h 15m',
        trustPoints: Math.floor(trustPointsBase * 0.65) + Math.floor(Math.random() * 80),
        progress: Math.floor(Math.random() * 30) + 70
      },
      {
        id: 'azure-gdpr',
        name: 'Azure GDPR Agent',
        status: Math.random() > 0.7 ? 'paused' : 'running',
        framework: 'GDPR',
        platform: 'Azure',
        evidenceCollected: Math.floor(evidenceBase * 0.2) + Math.floor(Math.random() * 20),
        lastRun: Math.random() > 0.5 ? '45 minutes ago' : '1 hour ago',
        nextRun: 'Paused',
        trustPoints: Math.floor(trustPointsBase * 0.2) + Math.floor(Math.random() * 50),
        progress: Math.floor(Math.random() * 20) + 20
      },
      {
        id: 'github-cis',
        name: 'GitHub CIS Controls Agent',
        status: 'running',
        framework: 'CIS Controls',
        platform: 'GitHub',
        evidenceCollected: Math.floor(evidenceBase * 0.4) + Math.floor(Math.random() * 25),
        lastRun: `${Math.floor(Math.random() * 15) + 5} minutes ago`,
        nextRun: 'In 1h 8m',
        trustPoints: Math.floor(trustPointsBase * 0.45) + Math.floor(Math.random() * 70),
        progress: Math.floor(Math.random() * 35) + 50
      }
    ];

    setAgents(mockAgents);
    
    // Update metrics
    const activeAgents = mockAgents.filter(a => a.status === 'running').length;
    const totalEvidence = mockAgents.reduce((sum, agent) => sum + agent.evidenceCollected, 0);
    const totalTrustPoints = mockAgents.reduce((sum, agent) => sum + agent.trustPoints, 0);
    const automationRate = 94.8 + Math.random() * 1.4; // 94.8% - 96.2%
    
    setMetrics({
      activeAgents,
      totalEvidence,
      totalTrustPoints,
      automationRate: Math.round(automationRate * 10) / 10,
      lastUpdated: new Date().toISOString()
    });
    
    setLoading(false);
    setRefreshing(false);
  };
  
  useEffect(() => {
    fetchAgentsData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAgentsData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="w-5 h-5 text-green-500" />;
      case 'paused':
        return <Pause className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'border-green-200 bg-green-50';
      case 'paused':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Agent Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor your compliance automation agents</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => window.location.href = '/velocity/onboarding'}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Agent
              </Button>
              <Button
                onClick={() => navigate('/velocity/live')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                Go Live
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={fetchAgentsData}
                disabled={refreshing}
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            {metrics.lastUpdated && (
              <p className="text-xs text-gray-500">
                Last updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
              </p>
            )}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-500">
                {isConnected ? 'Live data connected' : 'Live data disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{metrics.activeAgents}</div>
                <div className="text-sm text-gray-600">Active Agents</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {metrics.totalEvidence.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Evidence Collected</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {metrics.totalTrustPoints.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Trust Points</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{metrics.automationRate}%</div>
                <div className="text-sm text-gray-600">Automation Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Agents List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Active Agents</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {agents.map((agent) => (
              <div key={agent.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg border-2 ${getStatusColor(agent.status)}`}>
                      {getStatusIcon(agent.status)}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                      <div className="text-sm text-gray-600">
                        <span>Framework: {agent.framework}</span>
                        <span className="mx-2">•</span>
                        <span>Platform: {agent.platform}</span>
                      </div>
                      {agent.progress && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Collection Progress</span>
                            <span className="text-gray-700">{agent.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: `${agent.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{agent.evidenceCollected}</div>
                      <div className="text-sm text-gray-600">Evidence Items</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{agent.trustPoints}</div>
                      <div className="text-sm text-gray-600">Trust Points</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{agent.lastRun}</div>
                      <div className="text-sm text-gray-600">Last Run</div>
                      {agent.nextRun && (
                        <div className="text-xs text-blue-600 mt-1">{agent.nextRun}</div>
                      )}
                    </div>

                    <button
                      className={`px-4 py-2 rounded-lg font-medium ${
                        agent.status === 'running'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {agent.status === 'running' ? (
                        <>
                          <Pause className="w-4 h-4 mr-2 inline" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2 inline" />
                          Start
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">
                  AWS SOC2 Agent collected 15 new evidence items for CC6.1 control
                </span>
                <span className="text-xs text-gray-500">2 minutes ago</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">
                  Trust Score updated: +2.3 points from automated evidence collection
                </span>
                <span className="text-xs text-gray-500">5 minutes ago</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-700">
                  GCP ISO27001 Agent started scanning cloud configurations
                </span>
                <span className="text-xs text-gray-500">8 minutes ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;