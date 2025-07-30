import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VelocityHeader from './VelocityHeader';
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
  Eye,
  Download,
  Calendar,
  Timer,
  Cpu,
  Server,
  Layers,
  Lock,
  Award,
  TrendingDown
} from 'lucide-react';

// Trust Score Animation Component
const TrustScoreWidget = () => {
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScore(94);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400">Trust Score</h3>
              <p className="text-xs text-slate-500">Updated 2 min ago</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-emerald-400 font-medium">+2.1%</div>
            <div className="text-xs text-slate-500">vs last week</div>
          </div>
        </div>

        <div className="relative mb-4">
          <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(148, 163, 184, 0.1)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#trustGradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white font-mono">
                {isLoading ? '--' : score}
              </div>
              <div className="text-xs text-slate-400">/ 100</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-300 font-medium">Excellent</p>
          <p className="text-xs text-slate-500">SOC 2 • ISO 27001 • GDPR Ready</p>
        </div>
      </div>
    </div>
  );
};

// Enhanced Metric Card
const MetricCard = ({ title, value, subtitle, trend, icon: Icon, color = 'emerald', onClick }) => {
  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400'
  };

  return (
    <div 
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color].split(' ')[0] + ' ' + colorClasses[color].split(' ')[1]} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 group-hover:border-transparent transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 bg-${color}-500/10 rounded-lg`}>
            <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[2]}`} />
          </div>
          {trend && (
            <div className={`text-sm font-medium ${trend.startsWith('+') ? 'text-emerald-400' : trend.startsWith('-') ? 'text-red-400' : 'text-slate-400'}`}>
              {trend}
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white font-mono mb-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

// AI Agents Status Grid
const AIAgentsGrid = () => {
  const navigate = useNavigate();
  
  const agents = [
    { 
      id: 'compass', 
      name: 'COMPASS', 
      description: 'Compliance Framework Mapping',
      status: 'active', 
      tasks: 12, 
      efficiency: 94,
      lastActive: '2 min ago',
      frameworks: ['SOC 2', 'ISO 27001']
    },
    { 
      id: 'atlas', 
      name: 'ATLAS', 
      description: 'Security Assessment Engine',
      status: 'active', 
      tasks: 8, 
      efficiency: 91,
      lastActive: '5 min ago',
      frameworks: ['NIST', 'CIS Controls']
    },
    { 
      id: 'nexus', 
      name: 'NEXUS', 
      description: 'Cross-Framework Harmonization',
      status: 'processing', 
      tasks: 15, 
      efficiency: 96,
      lastActive: '1 min ago',
      frameworks: ['GDPR', 'HIPAA']
    },
    { 
      id: 'beacon', 
      name: 'BEACON', 
      description: 'Compliance Reporting',
      status: 'idle', 
      tasks: 3, 
      efficiency: 88,
      lastActive: '15 min ago',
      frameworks: ['SOC 2', 'ISO 27001']
    },
    { 
      id: 'prism', 
      name: 'PRISM', 
      description: 'Risk Analysis & Impact',
      status: 'active', 
      tasks: 6, 
      efficiency: 92,
      lastActive: '3 min ago',
      frameworks: ['Risk Assessment']
    },
    { 
      id: 'pulse', 
      name: 'PULSE', 
      description: 'Real-time Monitoring',
      status: 'active', 
      tasks: 24, 
      efficiency: 98,
      lastActive: 'Live',
      frameworks: ['Continuous Monitoring']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/20';
      case 'processing': return 'text-amber-400 bg-amber-500/20';
      case 'idle': return 'text-slate-400 bg-slate-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Activity className="w-3 h-3" />;
      case 'processing': return <Cpu className="w-3 h-3" />;
      case 'idle': return <Clock className="w-3 h-3" />;
      case 'error': return <AlertTriangle className="w-3 h-3" />;
      default: return <Bot className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white font-serif">AI Agents Status</h3>
          <p className="text-sm text-slate-400">10-agent orchestration system</p>
        </div>
        <button 
          onClick={() => navigate('/velocity/agents')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
        >
          <Bot className="w-4 h-4" />
          Manage Agents
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group"
            onClick={() => navigate(`/velocity/agents/${agent.id}`)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                <span className="font-mono text-sm font-bold text-white">{agent.name}</span>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(agent.status)}`}>
                {getStatusIcon(agent.status)}
                {agent.status}
              </div>
            </div>
            
            <p className="text-sm text-slate-400 mb-3">{agent.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Active Tasks</span>
                <span className="text-white font-mono">{agent.tasks}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Efficiency</span>
                <span className="text-emerald-400 font-mono">{agent.efficiency}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Last Active</span>
                <span className="text-slate-300">{agent.lastActive}</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="flex flex-wrap gap-1">
                {agent.frameworks.map((framework) => (
                  <span 
                    key={framework}
                    className="text-xs px-2 py-1 bg-slate-500/20 text-slate-300 rounded"
                  >
                    {framework}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recent Evidence Collection
const RecentEvidenceSection = () => {
  const navigate = useNavigate();
  
  const evidenceItems = [
    {
      id: 1,
      title: 'AWS IAM Password Policy',
      type: 'Configuration',
      source: 'AWS Account (Production)',
      timestamp: '2 minutes ago',
      status: 'verified',
      framework: 'SOC 2',
      agent: 'ATLAS'
    },
    {
      id: 2,
      title: 'Security Group Rules',
      type: 'Network Configuration',
      source: 'AWS VPC',
      timestamp: '5 minutes ago',
      status: 'verified',
      framework: 'ISO 27001',
      agent: 'ATLAS'
    },
    {
      id: 3,
      title: 'Access Review Report',
      type: 'User Access',
      source: 'Google Workspace',
      timestamp: '12 minutes ago',
      status: 'pending_review',
      framework: 'SOC 2',
      agent: 'COMPASS'
    },
    {
      id: 4,
      title: 'Backup Verification',
      type: 'Data Protection',
      source: 'Database Backups',
      timestamp: '18 minutes ago',
      status: 'verified',
      framework: 'GDPR',
      agent: 'PULSE'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-emerald-400 bg-emerald-500/20';
      case 'pending_review': return 'text-amber-400 bg-amber-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white font-serif">Recent Evidence Collection</h3>
          <p className="text-sm text-slate-400">Automated compliance evidence gathering</p>
        </div>
        <button 
          onClick={() => navigate('/velocity/evidence')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
        >
          <Database className="w-4 h-4" />
          View All Evidence
        </button>
      </div>

      <div className="space-y-3">
        {evidenceItems.map((item) => (
          <div 
            key={item.id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-blue-500/30 transition-all duration-300 cursor-pointer group"
            onClick={() => navigate(`/velocity/evidence/${item.id}`)}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">{item.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-400">{item.type}</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">{item.source}</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">by {item.agent}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                  {item.status.replace('_', ' ')}
                </span>
                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                  {item.framework}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                {item.timestamp}
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick Actions Panel
const QuickActionsPanel = () => {
  const navigate = useNavigate();
  
  const quickActions = [
    {
      title: 'Run Compliance Scan',
      description: 'Trigger full compliance assessment across all frameworks',
      icon: Target,
      color: 'emerald',
      action: () => navigate('/velocity/scan')
    },
    {
      title: 'Generate Report',
      description: 'Create compliance report for stakeholders',
      icon: BarChart3,
      color: 'blue',
      action: () => navigate('/velocity/reports/generate')
    },
    {
      title: 'Add Integration',
      description: 'Connect new cloud service or tool',
      icon: Plus,
      color: 'purple',
      action: () => navigate('/velocity/integrations/add')
    },
    {
      title: 'Schedule Audit',
      description: 'Plan upcoming compliance audit',
      icon: Calendar,
      color: 'amber',
      action: () => navigate('/velocity/audits/schedule')
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white font-serif">Quick Actions</h3>
        <p className="text-sm text-slate-400">Common compliance tasks</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`group p-4 bg-white/5 rounded-lg border border-white/5 hover:border-${action.color}-500/30 transition-all duration-300 text-left`}
          >
            <div className={`p-2 bg-${action.color}-500/10 rounded-lg w-fit mb-3`}>
              <action.icon className={`w-5 h-5 text-${action.color}-400`} />
            </div>
            <h4 className="text-sm font-medium text-white mb-1">{action.title}</h4>
            <p className="text-xs text-slate-400">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const VelocityDashboardComplete: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'SOC 2 evidence collection completed', time: '2 min ago', type: 'success' },
    { id: 2, title: 'New GDPR requirement detected', time: '15 min ago', type: 'info' },
    { id: 3, title: 'Trust score updated', time: '1 hour ago', type: 'success' }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update notifications, scores, etc.
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      <VelocityHeader />
      
      {/* Dashboard Content */}
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white font-serif mb-2">
                  Compliance Dashboard
                </h1>
                <p className="text-slate-400">
                  Real-time compliance monitoring and AI agent orchestration
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/velocity/settings')}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
                
                <div className="relative">
                  <button className="p-2 text-slate-400 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                  </button>
                  {notifications.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid lg:grid-cols-5 gap-6 mb-8">
            <div className="lg:col-span-1">
              <TrustScoreWidget />
            </div>
            
            <div className="lg:col-span-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Active Agents"
                value="8/10"
                subtitle="2 idle"
                trend="+1"
                icon={Bot}
                color="emerald"
                onClick={() => navigate('/velocity/agents')}
              />
              
              <MetricCard
                title="Evidence Collected"
                value="1,247"
                subtitle="This month"
                trend="+156"
                icon={Database}
                color="blue"
                onClick={() => navigate('/velocity/evidence')}
              />
              
              <MetricCard
                title="Frameworks"
                value="6"
                subtitle="SOC 2, ISO 27001, GDPR+"
                trend="100%"
                icon={Award}
                color="purple"
                onClick={() => navigate('/velocity/frameworks')}
              />
              
              <MetricCard
                title="Compliance Score"
                value="94%"
                subtitle="Audit ready"
                trend="+2.1%"
                icon={Target}
                color="amber"
                onClick={() => navigate('/velocity/compliance')}
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-8">
              <AIAgentsGrid />
              <RecentEvidenceSection />
            </div>
            
            <div className="space-y-8">
              <QuickActionsPanel />
              
              {/* Upcoming Tasks */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white font-serif mb-4">Upcoming Tasks</h3>
                <div className="space-y-3">
                  {[
                    { task: 'Quarterly access review', due: 'Due in 3 days', priority: 'high' },
                    { task: 'SOC 2 audit preparation', due: 'Due next week', priority: 'medium' },
                    { task: 'GDPR compliance report', due: 'Due in 2 weeks', priority: 'low' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-sm text-white">{item.task}</p>
                        <p className="text-xs text-slate-400">{item.due}</p>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        item.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {item.priority}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <VelocityFooter />
    </div>
  );
};

export default VelocityDashboardComplete;