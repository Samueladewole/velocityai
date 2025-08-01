import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import VelocityFooter from './VelocityFooter';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Play, 
  CheckCircle, 
  Zap, 
  Clock,
  ArrowRight,
  Activity,
  Target,
  AlertTriangle,
  Plus,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  Home,
  FileText,
  BarChart3,
  Bot,
  Database,
  HelpCircle,
  MessageSquare,
  Globe,
  Bookmark,
  Pause,
  RotateCw,
  Cloud,
  Github,
  Key,
  Server,
  Eye,
  Lock,
  Cpu,
  AlertCircle,
  CheckCircle2,
  Circle,
  MoreVertical,
  Filter,
  Download,
  RefreshCw,
  Layers,
  Link2,
  Code2,
  Terminal,
  BookOpen,
  Fingerprint
} from 'lucide-react';

// Agent status types
type AgentStatus = 'running' | 'paused' | 'stopped' | 'error' | 'initializing';
type AgentType = 'aws' | 'gcp' | 'github' | 'azure' | 'document' | 'qie' | 'trust' | 'monitor' | 'observability' | 'crypto';

// Enhanced Agent Interface
interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  description: string;
  evidence: number;
  lastActivity: string;
  cpu: number;
  memory: number;
  tasks: {
    completed: number;
    pending: number;
    failed: number;
  };
  metrics: {
    performanceScore: number;
    uptime: string;
    lastScan: Date;
  };
}

// Agent Card Component with Real-time Updates
const AgentCard: React.FC<{ agent: Agent; onAction: (action: string, agentId: string) => void }> = ({ agent, onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const getAgentIcon = (type: AgentType) => {
    const icons = {
      aws: Cloud,
      gcp: Cloud,
      github: Github,
      azure: Cloud,
      document: FileText,
      qie: MessageSquare,
      trust: Shield,
      monitor: Eye,
      observability: Activity,
      crypto: Fingerprint
    };
    return icons[type] || Bot;
  };
  
  const getStatusColor = (status: AgentStatus) => {
    const colors = {
      running: 'text-emerald-400 bg-emerald-400/10',
      paused: 'text-amber-400 bg-amber-400/10',
      stopped: 'text-slate-400 bg-slate-400/10',
      error: 'text-red-400 bg-red-400/10',
      initializing: 'text-blue-400 bg-blue-400/10'
    };
    return colors[status] || 'text-slate-400 bg-slate-400/10';
  };
  
  const getStatusIcon = (status: AgentStatus) => {
    const icons = {
      running: Play,
      paused: Pause,
      stopped: Circle,
      error: AlertTriangle,
      initializing: RotateCw
    };
    const Icon = icons[status] || Circle;
    return <Icon className={`w-3 h-3 €{status === 'initializing' ? 'animate-spin' : ''}`} />;
  };
  
  const Icon = getAgentIcon(agent.type);
  const statusColors = getStatusColor(agent.status);
  
  return (
    <div className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
      {/* Agent Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg bg-€{agent.type === 'aws' ? 'orange' : agent.type === 'gcp' ? 'blue' : agent.type === 'github' ? 'purple' : 'emerald'}-500/10`}>
              <Icon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">{agent.name}</h3>
              <p className="text-sm text-slate-400">{agent.description}</p>
            </div>
          </div>
          
          {/* Agent Controls */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium €{statusColors}`}>
              {getStatusIcon(agent.status)}
              <span className="capitalize">{agent.status}</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20">
                  <button 
                    onClick={() => {
                      onAction(agent.status === 'running' ? 'pause' : 'start', agent.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                  >
                    {agent.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {agent.status === 'running' ? 'Pause Agent' : 'Start Agent'}
                  </button>
                  <button 
                    onClick={() => {
                      onAction('restart', agent.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Restart Agent
                  </button>
                  <button 
                    onClick={() => {
                      onAction('logs', agent.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                  >
                    <Terminal className="w-4 h-4" />
                    View Logs
                  </button>
                  <hr className="my-1 border-slate-700" />
                  <button 
                    onClick={() => {
                      onAction('configure', agent.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Configure
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Agent Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Evidence</p>
            <p className="text-lg font-semibold text-white">{agent.evidence}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Tasks</p>
            <p className="text-lg font-semibold text-white">
              {agent.tasks.completed}
              <span className="text-xs text-slate-400 ml-1">/ {agent.tasks.completed + agent.tasks.pending}</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Performance</p>
            <p className="text-lg font-semibold text-white">{agent.metrics.performanceScore}%</p>
          </div>
        </div>
        
        {/* Resource Usage */}
        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400">CPU Usage</span>
              <span className="text-xs text-white font-medium">{agent.cpu}%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 €{
                  agent.cpu > 80 ? 'bg-red-500' : agent.cpu > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `€{agent.cpu}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400">Memory</span>
              <span className="text-xs text-white font-medium">{agent.memory}%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 €{
                  agent.memory > 80 ? 'bg-red-500' : agent.memory > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `€{agent.memory}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
          <ChevronDown className={`w-4 h-4 transition-transform €{isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-0 border-t border-slate-700/50">
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Last Activity</span>
              <span className="text-white">{agent.lastActivity}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Uptime</span>
              <span className="text-white">{agent.metrics.uptime}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Last Scan</span>
              <span className="text-white">{new Date(agent.metrics.lastScan).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Failed Tasks</span>
              <span className={`font-medium €{agent.tasks.failed > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {agent.tasks.failed}
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <button className="w-full py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-medium">
              View Detailed Analytics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Real-time Activity Feed Component
const ActivityFeed: React.FC = () => {
  const [activities] = useState([
    {
      id: 1,
      agent: 'AWS Evidence Collector',
      action: 'Completed security scan',
      details: 'Found 0 critical issues',
      time: '2 minutes ago',
      type: 'success'
    },
    {
      id: 2,
      agent: 'Trust Score Engine',
      action: 'Updated trust score',
      details: 'Score increased to 94/100',
      time: '5 minutes ago',
      type: 'info'
    },
    {
      id: 3,
      agent: 'Document Generator',
      action: 'Generated compliance report',
      details: 'SOC 2 Type II report ready',
      time: '12 minutes ago',
      type: 'success'
    },
    {
      id: 4,
      agent: 'Continuous Monitor',
      action: 'Detected configuration drift',
      details: 'Azure VM security group modified',
      time: '18 minutes ago',
      type: 'warning'
    },
    {
      id: 5,
      agent: 'GitHub Security Analyzer',
      action: 'Repository scan completed',
      details: '3 repositories analyzed',
      time: '25 minutes ago',
      type: 'success'
    }
  ]);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };
  
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Activity Feed</h3>
        <button className="text-sm text-slate-400 hover:text-white transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 group">
            <div className="mt-0.5">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium">{activity.agent}</p>
              <p className="text-sm text-slate-400">{activity.action}</p>
              <p className="text-xs text-slate-500 mt-1">{activity.details}</p>
            </div>
            <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Dashboard with Real-time Monitoring
const VelocityDashboardEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'aws-1',
      name: 'AWS Evidence Collector',
      type: 'aws',
      status: 'running',
      description: 'Automated AWS infrastructure scanning',
      evidence: 47,
      lastActivity: '2 min ago',
      cpu: 35,
      memory: 42,
      tasks: { completed: 156, pending: 3, failed: 0 },
      metrics: { performanceScore: 98, uptime: '99.9%', lastScan: new Date() }
    },
    {
      id: 'gcp-1',
      name: 'GCP Scanner',
      type: 'gcp',
      status: 'running',
      description: 'Google Cloud compliance monitoring',
      evidence: 23,
      lastActivity: '5 min ago',
      cpu: 28,
      memory: 38,
      tasks: { completed: 89, pending: 2, failed: 1 },
      metrics: { performanceScore: 95, uptime: '99.5%', lastScan: new Date() }
    },
    {
      id: 'github-1',
      name: 'GitHub Security Analyzer',
      type: 'github',
      status: 'running',
      description: 'Repository security scanning',
      evidence: 15,
      lastActivity: '1 min ago',
      cpu: 15,
      memory: 25,
      tasks: { completed: 234, pending: 5, failed: 0 },
      metrics: { performanceScore: 99, uptime: '100%', lastScan: new Date() }
    },
    {
      id: 'azure-1',
      name: 'Azure Compliance Monitor',
      type: 'azure',
      status: 'paused',
      description: 'Microsoft Azure compliance tracking',
      evidence: 31,
      lastActivity: '20 min ago',
      cpu: 0,
      memory: 12,
      tasks: { completed: 67, pending: 0, failed: 2 },
      metrics: { performanceScore: 92, uptime: '98.7%', lastScan: new Date() }
    },
    {
      id: 'trust-1',
      name: 'Trust Score Engine',
      type: 'trust',
      status: 'running',
      description: 'Real-time trust calculations',
      evidence: 0,
      lastActivity: 'Just now',
      cpu: 45,
      memory: 55,
      tasks: { completed: 1024, pending: 12, failed: 0 },
      metrics: { performanceScore: 100, uptime: '100%', lastScan: new Date() }
    },
    {
      id: 'crypto-1',
      name: 'Cryptographic Verification',
      type: 'crypto',
      status: 'running',
      description: 'Blockchain evidence verification',
      evidence: 89,
      lastActivity: '30 sec ago',
      cpu: 62,
      memory: 48,
      tasks: { completed: 456, pending: 8, failed: 0 },
      metrics: { performanceScore: 97, uptime: '99.8%', lastScan: new Date() }
    }
  ]);
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prevAgents => 
        prevAgents.map(agent => ({
          ...agent,
          cpu: Math.max(0, Math.min(100, agent.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(0, Math.min(100, agent.memory + (Math.random() - 0.5) * 5)),
          tasks: {
            ...agent.tasks,
            completed: agent.tasks.completed + (agent.status === 'running' ? Math.floor(Math.random() * 2) : 0)
          }
        }))
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleAgentAction = (action: string, agentId: string) => {
    console.log(`Action €{action} on agent €{agentId}`);
    
    if (action === 'pause' || action === 'start') {
      setAgents(prevAgents =>
        prevAgents.map(agent =>
          agent.id === agentId
            ? { ...agent, status: action === 'pause' ? 'paused' : 'running' }
            : agent
        )
      );
    }
  };
  
  const filteredAgents = agents.filter(agent => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'running') return agent.status === 'running';
    if (selectedFilter === 'paused') return agent.status === 'paused';
    if (selectedFilter === 'error') return agent.status === 'error';
    return true;
  });
  
  const metrics = {
    trustScore: 94,
    activeAgents: agents.filter(a => a.status === 'running').length,
    totalAgents: agents.length,
    evidenceItems: agents.reduce((sum, agent) => sum + agent.evidence, 0),
    automationRate: 95,
    tasksCompleted: agents.reduce((sum, agent) => sum + agent.tasks.completed, 0),
    tasksPending: agents.reduce((sum, agent) => sum + agent.tasks.pending, 0),
    tasksFailed: agents.reduce((sum, agent) => sum + agent.tasks.failed, 0)
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg blur-sm opacity-50"></div>
                </div>
                <span className="text-xl font-bold text-white">Velocity</span>
              </div>
              
              {/* Main Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                <button className="flex items-center gap-2 px-4 py-2 text-white bg-slate-800/50 rounded-lg">
                  <Bot className="w-4 h-4" />
                  Agents
                </button>
                <button 
                  onClick={() => navigate('/velocity/evidence')}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  <Database className="w-4 h-4" />
                  Evidence
                </button>
                <button 
                  onClick={() => navigate('/velocity/reports')}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Reports
                </button>
                <button 
                  onClick={() => navigate('/velocity/integrations')}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  <Link2 className="w-4 h-4" />
                  Integrations
                </button>
              </div>
            </div>
            
            {/* Search and Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search agents, evidence..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                />
              </div>
              
              <button className="relative p-2 text-slate-300 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
              </button>
              
              <button 
                onClick={() => navigate('/velocity/agent/create')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden md:inline">New Agent</span>
              </button>
              
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Dashboard Content */}
      <div className="pt-16 p-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-white mb-2">
              AI Agent Command Center
            </h1>
            <p className="text-slate-400">Monitor and manage your 10 compliance automation agents in real-time</p>
          </div>
          
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm rounded-xl border border-emerald-500/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <Shield className="w-8 h-8 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">+2 pts</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{metrics.trustScore}</p>
              <p className="text-sm text-slate-400">Trust Score</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <Bot className="w-8 h-8 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">{metrics.activeAgents}/{metrics.totalAgents}</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{metrics.activeAgents}</p>
              <p className="text-sm text-slate-400">Active Agents</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <Database className="w-8 h-8 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">+{metrics.evidenceItems}</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{metrics.evidenceItems}</p>
              <p className="text-sm text-slate-400">Evidence Items</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">{metrics.automationRate}%</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{metrics.tasksCompleted}</p>
              <p className="text-sm text-slate-400">Tasks Completed</p>
            </div>
          </div>
          
          {/* Agent Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-white">AI Agents</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors €{
                    selectedFilter === 'all' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  All ({metrics.totalAgents})
                </button>
                <button
                  onClick={() => setSelectedFilter('running')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors €{
                    selectedFilter === 'running' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Running ({metrics.activeAgents})
                </button>
                <button
                  onClick={() => setSelectedFilter('paused')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors €{
                    selectedFilter === 'paused' 
                      ? 'bg-amber-500/20 text-amber-400' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Paused ({agents.filter(a => a.status === 'paused').length})
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-white transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-white transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Agents Grid */}
            <div className="lg:col-span-2">
              <div className="grid gap-4">
                {filteredAgents.map(agent => (
                  <AgentCard 
                    key={agent.id} 
                    agent={agent} 
                    onAction={handleAgentAction}
                  />
                ))}
              </div>
            </div>
            
            {/* Activity Feed */}
            <div>
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VelocityDashboardEnhanced;