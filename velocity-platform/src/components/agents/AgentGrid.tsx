import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Activity,
  Zap,
  Shield,
  Database,
  Eye,
  FileText,
  Cpu,
  Lock,
  Users
} from 'lucide-react';

// Import the real Velocity API service
import { velocityApi } from '@/services/velocity-api';

interface Agent {
  id: string;
  name: string;
  type: 'AWS' | 'GCP' | 'Azure' | 'GitHub' | 'QIE' | 'TrustScore' | 'Monitor' | 'DocGen' | 'Observability' | 'Crypto' | 'ISAE3000' | 'BankingROI';
  status: 'collecting' | 'idle' | 'error' | 'scheduled' | 'connecting';
  lastRun: Date;
  nextRun: Date;
  evidenceCollected: number;
  successRate: number;
  currentTask?: string;
  progress?: number;
}

const AGENT_ICONS = {
  AWS: Zap,
  GCP: Cpu,
  Azure: Activity,
  GitHub: Database,
  QIE: FileText,
  TrustScore: Shield,
  Monitor: Eye,
  DocGen: FileText,
  Observability: Activity,
  Crypto: Lock,
  ISAE3000: Database,
  BankingROI: Users
};

const STATUS_STYLES = {
  collecting: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  idle: 'border-slate-300 bg-slate-50 text-slate-600',
  error: 'border-red-500 bg-red-50 text-red-700',
  scheduled: 'border-amber-500 bg-amber-50 text-amber-700',
  connecting: 'border-blue-500 bg-blue-50 text-blue-700'
};

const PRODUCTION_AGENTS: Agent[] = [
  {
    id: 'aws-evidence',
    name: 'AWS Evidence Collector',
    type: 'AWS',
    status: 'collecting',
    lastRun: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
    nextRun: new Date(Date.now() + 28 * 60 * 1000), // 28 min from now
    evidenceCollected: 247,
    successRate: 98.2,
    currentTask: 'Scanning CloudTrail configurations',
    progress: 67
  },
  {
    id: 'gcp-scanner',
    name: 'GCP Security Scanner',
    type: 'GCP',
    status: 'idle',
    lastRun: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    evidenceCollected: 156,
    successRate: 97.8
  },
  {
    id: 'azure-monitor',
    name: 'Azure Security Monitor',
    type: 'Azure',
    status: 'scheduled',
    lastRun: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    nextRun: new Date(Date.now() + 90 * 60 * 1000), // 90 min
    evidenceCollected: 203,
    successRate: 96.5
  },
  {
    id: 'github-analyzer',
    name: 'GitHub Security Analyzer',
    type: 'GitHub',
    status: 'collecting',
    lastRun: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
    nextRun: new Date(Date.now() + 55 * 60 * 1000), // 55 min
    evidenceCollected: 89,
    successRate: 99.1,
    currentTask: 'Analyzing organization security settings',
    progress: 23
  },
  {
    id: 'qie-agent',
    name: 'QIE Integration Agent',
    type: 'QIE',
    status: 'idle',
    lastRun: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    nextRun: new Date(Date.now() + 45 * 60 * 1000), // 45 min
    evidenceCollected: 134,
    successRate: 94.7
  },
  {
    id: 'trust-engine',
    name: 'Trust Score Engine',
    type: 'TrustScore',
    status: 'collecting',
    lastRun: new Date(Date.now() - 1 * 60 * 1000), // 1 min ago
    nextRun: new Date(Date.now() + 14 * 60 * 1000), // 14 min
    evidenceCollected: 312,
    successRate: 99.8,
    currentTask: 'Calculating cryptographic verification',
    progress: 89
  },
  {
    id: 'continuous-monitor',
    name: 'Continuous Monitor',
    type: 'Monitor',
    status: 'collecting',
    lastRun: new Date(Date.now() - 30 * 1000), // 30 sec ago
    nextRun: new Date(Date.now() + 4.5 * 60 * 1000), // 4.5 min
    evidenceCollected: 445,
    successRate: 97.3,
    currentTask: 'Monitoring configuration changes',
    progress: 15
  },
  {
    id: 'doc-generator',
    name: 'Document Generator',
    type: 'DocGen',
    status: 'idle',
    lastRun: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    nextRun: new Date(Date.now() + 75 * 60 * 1000), // 75 min
    evidenceCollected: 178,
    successRate: 95.4
  },
  {
    id: 'observability',
    name: 'Observability Specialist',
    type: 'Observability',
    status: 'scheduled',
    lastRun: new Date(Date.now() - 20 * 60 * 1000), // 20 min ago
    nextRun: new Date(Date.now() + 40 * 60 * 1000), // 40 min
    evidenceCollected: 267,
    successRate: 98.9
  },
  {
    id: 'crypto-verification',
    name: 'Cryptographic Verification',
    type: 'Crypto',
    status: 'collecting',
    lastRun: new Date(Date.now() - 3 * 60 * 1000), // 3 min ago
    nextRun: new Date(Date.now() + 12 * 60 * 1000), // 12 min
    evidenceCollected: 89,
    successRate: 100.0,
    currentTask: 'Generating blockchain proofs',
    progress: 45
  },
  {
    id: 'isae3000-evidence',
    name: 'ISAE 3000 Evidence Agent',
    type: 'ISAE3000',
    status: 'collecting',
    lastRun: new Date(Date.now() - 1 * 60 * 1000), // 1 min ago
    nextRun: new Date(Date.now() + 8 * 60 * 1000), // 8 min
    evidenceCollected: 523,
    successRate: 98.8,
    currentTask: 'Collecting banking system evidence for ISAE 3000 audit',
    progress: 73
  },
  {
    id: 'gdpr-compliance',
    name: 'Banking ROI Calculator Agent',
    type: 'BankingROI',
    status: 'collecting',
    lastRun: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
    nextRun: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    evidenceCollected: 387,
    successRate: 97.6,
    currentTask: 'Calculating Banking ROI metrics',
    progress: 58
  }
];

interface AgentGridProps {
  className?: string;
}

export const AgentGrid: React.FC<AgentGridProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Load real agents from backend API
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoading(true);
        const realAgents = await velocityApi.getAgents();
        
        // Transform backend agent data to match frontend interface
        const transformedAgents = realAgents.map(agent => ({
          id: agent.id,
          name: agent.name,
          type: agent.platform.toUpperCase() as Agent['type'],
          status: mapBackendStatus(agent.status),
          lastRun: agent.last_run ? new Date(agent.last_run) : new Date(Date.now() - Math.random() * 60 * 60 * 1000),
          nextRun: agent.next_run ? new Date(agent.next_run) : new Date(Date.now() + Math.random() * 60 * 60 * 1000),
          evidenceCollected: agent.evidence_collected || 0,
          successRate: agent.success_rate || 0
        }));
        
        setAgents(transformedAgents);
        setError(null);
      } catch (err) {
        console.error('Failed to load agents:', err);
        setError('Failed to load agents. Using mock data.');
        // Fallback to mock data if API fails
        setAgents(PRODUCTION_AGENTS);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();

    // Set up real-time updates via polling (replace with WebSocket later)
    const interval = setInterval(loadAgents, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Map backend agent status to frontend status
  const mapBackendStatus = (backendStatus: string): Agent['status'] => {
    switch (backendStatus.toLowerCase()) {
      case 'running': return 'collecting';
      case 'idle': return 'idle';
      case 'completed': return 'idle';
      case 'error': return 'error';
      case 'scheduled': return 'scheduled';
      default: return 'idle';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `€{seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `€{minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `€{hours}h ago`;
  };

  const formatTimeUntil = (date: Date) => {
    const seconds = Math.floor((date.getTime() - Date.now()) / 1000);
    if (seconds < 60) return `€{seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `€{minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `€{hours}h`;
  };

  const getDefaultTaskForAgent = (type: Agent['type']): string => {
    const tasks = {
      AWS: 'Scanning CloudTrail configurations',
      GCP: 'Analyzing IAM policies and permissions',
      Azure: 'Monitoring Security Center alerts',
      GitHub: 'Analyzing repository security settings',
      QIE: 'Processing compliance questionnaires',
      TrustScore: 'Calculating cryptographic verification',
      Monitor: 'Monitoring configuration changes',
      DocGen: 'Generating compliance documentation',
      Observability: 'Collecting system metrics and logs',
      Crypto: 'Generating blockchain proofs',
      ISAE3000: 'Collecting banking system evidence for ISAE 3000 audit',
      BankingROI: 'Calculating Banking ROI metrics'
    };
    return tasks[type] || 'Processing compliance data';
  };

  const handleAgentAction = async (agentId: string, action: 'deploy' | 'pause' | 'resume') => {
    try {
      if (action === 'deploy' || action === 'resume') {
        // Update UI immediately for better UX
        setAgents(prev => prev.map(agent => {
          if (agent.id === agentId) {
            return {
              ...agent,
              status: 'connecting' as const,
              currentTask: 'Starting agent execution...',
              progress: 0
            };
          }
          return agent;
        }));

        // Call real API to run the agent
        await velocityApi.runAgent(agentId);
        
        // Update status to collecting after API call succeeds
        setAgents(prev => prev.map(agent => {
          if (agent.id === agentId) {
            return {
              ...agent,
              status: 'collecting' as const,
              currentTask: getDefaultTaskForAgent(agent.type),
              progress: Math.random() * 50 + 10,
              lastRun: new Date()
            };
          }
          return agent;
        }));
      }, 2000);
    }

    // TODO: Connect to actual backend API
    console.log(`Agent €{agentId}: €{action}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'collecting': return <Activity className="h-4 w-4 animate-pulse" />;
      case 'idle': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'connecting': return <RefreshCw className="h-4 w-4 animate-spin" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const totalEvidence = agents.reduce((sum, agent) => sum + agent.evidenceCollected, 0);
  const activeAgents = agents.filter(agent => agent.status === 'collecting').length;
  const avgSuccessRate = agents.reduce((sum, agent) => sum + agent.successRate, 0) / agents.length;

  return (
    <div className={`space-y-6 €{className}`}>
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Total Agents</p>
                <p className="text-2xl font-bold text-emerald-900">{agents.length}</p>
              </div>
              <Cpu className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Active Now</p>
                <p className="text-2xl font-bold text-blue-900">{activeAgents}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Evidence Collected</p>
                <p className="text-2xl font-bold text-purple-900">{totalEvidence.toLocaleString()}</p>
              </div>
              <Database className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-amber-900">{avgSuccessRate.toFixed(1)}%</p>
              </div>
              <Shield className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Status */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">AI Agent Monitoring</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Live - Updated {formatTimeAgo(lastUpdate)}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {agents.map((agent) => {
          const IconComponent = AGENT_ICONS[agent.type];
          
          return (
            <Card 
              key={agent.id} 
              className={`h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:scale-105 €{STATUS_STYLES[agent.status]}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    <Badge variant="outline" className="text-xs">
                      {agent.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(agent.status)}
                    <span className="text-xs font-medium capitalize">
                      {agent.status}
                    </span>
                  </div>
                </div>
                <CardTitle className="text-sm font-semibold leading-tight">
                  {agent.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0 space-y-3 flex-1 flex flex-col">
                {/* Current Task & Progress */}
                {agent.currentTask && agent.progress !== undefined && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 truncate">
                      {agent.currentTask}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{Math.round(agent.progress)}%</span>
                      </div>
                      <Progress value={agent.progress} className="h-1.5" />
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center p-2 bg-white/50 rounded-md">
                    <p className="text-slate-500 mb-1">Evidence</p>
                    <p className="font-bold text-slate-900">{agent.evidenceCollected}</p>
                  </div>
                  <div className="text-center p-2 bg-white/50 rounded-md">
                    <p className="text-slate-500 mb-1">Success Rate</p>
                    <p className="font-bold text-slate-900">{agent.successRate}%</p>
                  </div>
                </div>

                {/* Timing */}
                <div className="text-xs space-y-2 p-2 bg-slate-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Last run:</span>
                    <span className="font-semibold">{formatTimeAgo(agent.lastRun)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Next run:</span>
                    <span className="font-semibold">In {formatTimeUntil(agent.nextRun)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 mt-auto">
                  {(agent.status === 'idle' || agent.status === 'scheduled') && (
                    <Button 
                      size="sm" 
                      className="flex-1 h-9 text-xs font-medium"
                      onClick={() => handleAgentAction(agent.id, 'deploy')}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Deploy
                    </Button>
                  )}
                  {(agent.status === 'collecting' || agent.status === 'connecting') && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 h-9 text-xs font-medium"
                      onClick={() => handleAgentAction(agent.id, 'pause')}
                      disabled={agent.status === 'connecting'}
                    >
                      <Pause className="h-3 w-3 mr-1" />
                      {agent.status === 'connecting' ? 'Starting...' : 'Pause'}
                    </Button>
                  )}
                  {agent.status === 'error' && (
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="flex-1 h-9 text-xs font-medium"
                      onClick={() => handleAgentAction(agent.id, 'resume')}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Deploy Section */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Deploy</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-24 p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-all" 
              variant="outline"
              onClick={() => navigate('/velocity/solutions/soc2')}
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold">SOC 2 Ready</span>
              </div>
              <p className="text-xs text-slate-600">
                Deploy all SOC 2 compliance agents
              </p>
            </Button>
            
            <Button 
              className="h-24 p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-all" 
              variant="outline"
              onClick={() => navigate('/velocity/integrations')}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Full Automation</span>
              </div>
              <p className="text-xs text-slate-600">
                Deploy all 12 agents for complete coverage
              </p>
            </Button>
            
            <Button 
              className="h-24 p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-all" 
              variant="outline"
              onClick={() => navigate('/velocity/qie')}
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="font-semibold">QIE Ready</span>
              </div>
              <p className="text-xs text-slate-600">
                Deploy questionnaire processing agents
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};