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
  Target
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'error';
  framework: string;
  evidenceCollected: number;
  lastRun: string;
  trustPoints: number;
}

const AgentDashboard: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockAgents: Agent[] = [
      {
        id: 'aws-soc2',
        name: 'AWS SOC2 Agent',
        status: 'running',
        framework: 'SOC2',
        evidenceCollected: 157,
        lastRun: '2 minutes ago',
        trustPoints: 471
      },
      {
        id: 'gcp-iso27001', 
        name: 'GCP ISO27001 Agent',
        status: 'running',
        framework: 'ISO27001',
        evidenceCollected: 89,
        lastRun: '5 minutes ago',
        trustPoints: 267
      },
      {
        id: 'azure-gdpr',
        name: 'Azure GDPR Agent',
        status: 'paused',
        framework: 'GDPR',
        evidenceCollected: 23,
        lastRun: '1 hour ago',
        trustPoints: 69
      }
    ];

    setAgents(mockAgents);
    setLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-900">AI Agent Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your compliance automation agents</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{agents.filter(a => a.status === 'running').length}</div>
                <div className="text-sm text-gray-600">Active Agents</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {agents.reduce((sum, agent) => sum + agent.evidenceCollected, 0)}
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
                  {agents.reduce((sum, agent) => sum + agent.trustPoints, 0)}
                </div>
                <div className="text-sm text-gray-600">Trust Points</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">95.1%</div>
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
                      <p className="text-sm text-gray-600">Framework: {agent.framework}</p>
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