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

  // Fetch real-time data from backend
  const fetchAgentsData = async () => {
    setRefreshing(true);
    
    try {
      // Import API service dynamically
      const { apiService } = await import('@/services/api');
      
      // Fetch real agents and dashboard stats
      const [agentsData, dashboardStats] = await Promise.all([
        apiService.getAgents(),
        apiService.getDashboardStats()
      ]);
      
      // Transform backend data to match frontend interface
      const transformedAgents: Agent[] = agentsData.map(agent => ({
        id: agent.id,
        name: agent.name,
        status: agent.status === 'active' ? 'running' : 'paused',
        framework: agent.framework.toUpperCase(),
        evidenceCollected: agent.evidence_count,
        lastRun: new Date(agent.created_at).toLocaleDateString() === new Date().toLocaleDateString() 
          ? 'Today' 
          : new Date(agent.created_at).toLocaleDateString(),
        trustPoints: Math.floor(agent.success_rate * 30), // Convert success rate to points
        platform: agent.platform.toUpperCase(),
        nextRun: agent.status === 'active' ? '2 hours' : 'Paused',
        progress: Math.floor(agent.automation_level)
      }));
      
      setAgents(transformedAgents);
      
      // Use real dashboard metrics
      setMetrics({
        activeAgents: dashboardStats.active_agents,
        totalEvidence: dashboardStats.total_evidence,
        totalTrustPoints: Math.floor(dashboardStats.trust_score * 30), // Convert trust score to points
        automationRate: dashboardStats.avg_automation,
        lastUpdated: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Failed to fetch agents data:', error);
      // Fall back to empty state if not authenticated or API fails
      setAgents([]);
      setMetrics({
        activeAgents: 0,
        totalEvidence: 0,
        totalTrustPoints: 0,
        automationRate: 0,
        lastUpdated: new Date().toISOString()
      });
    }
    
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
                <RefreshCw className={`w-4 h-4 mr-2 €{refreshing ? 'animate-spin' : ''}`} />
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
              <div className={`w-2 h-2 rounded-full €{isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
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
                    <div className={`p-3 rounded-lg border-2 €{getStatusColor(agent.status)}`}>
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
                              style={{ width: `€{agent.progress}%` }}
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
                      className={`px-4 py-2 rounded-lg font-medium €{
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