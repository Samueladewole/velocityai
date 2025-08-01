import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, TrendingUp, Users, Settings, Bell, Search, Play, CheckCircle, 
  Zap, Clock, ArrowRight, Activity, Target, AlertTriangle, Plus, LogOut,
  User, Menu, X, ChevronDown, Home, FileText, BarChart3, Bot, Database,
  HelpCircle, MessageSquare, Globe, Bookmark, Pause, RotateCw, Cloud,
  Github, Key, Server, Eye, Lock, Cpu, AlertCircle, CheckCircle2, Circle,
  MoreVertical, Filter, Download, RefreshCw, Layers, Link2, Code2, Terminal,
  BookOpen, Fingerprint, Sparkles, Brain, Gauge, Network, Radio, Workflow,
  ShieldCheck, FileCode, Zap as Lightning, Waves, PieChart, TrendingDown,
  Calendar, Hash, Boxes, Briefcase, Award, AlertOctagon, CheckSquare,
  XCircle, Info, ChevronRight, ExternalLink, Copy, Share2, Star, GitBranch,
  Package, Timer, BarChart2, LineChart, DollarSign, CreditCard, Building,
  MapPin, Phone, Mail, Linkedin, Twitter, Send, Loader2, LucideIcon
} from 'lucide-react';

// Type definitions for our multi-agent system
type AgentStatus = 'running' | 'paused' | 'stopped' | 'error' | 'initializing' | 'idle';
type AgentType = 'aws' | 'gcp' | 'github' | 'azure' | 'document' | 'qie' | 'trust' | 'monitor' | 'observability' | 'crypto';
type MetricTrend = 'up' | 'down' | 'stable';

interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  description: string;
  icon: LucideIcon;
  color: string;
  evidence: {
    collected: number;
    pending: number;
    verified: number;
  };
  performance: {
    cpu: number;
    memory: number;
    latency: number;
    throughput: number;
  };
  tasks: {
    completed: number;
    pending: number;
    failed: number;
    processing: number;
  };
  metrics: {
    uptime: number;
    successRate: number;
    lastActivity: Date;
    nextScheduled: Date | null;
  };
  integrations: string[];
  capabilities: string[];
}

// Design System Components following our philosophy
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}> = ({ children, className = '', hover = false, gradient = false, onClick }) => {
  const baseClasses = `
    relative overflow-hidden
    bg-white/5 backdrop-blur-xl 
    border border-white/10 
    rounded-2xl 
    transition-all duration-300
    €{hover ? 'hover:bg-white/[0.07] hover:border-white/20 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5' : ''}
    €{gradient ? 'bg-gradient-to-br from-white/5 to-white/[0.02]' : ''}
    €{onClick ? 'cursor-pointer' : ''}
  `;

  return (
    <div className={`€{baseClasses} €{className}`} onClick={onClick}>
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-amber-500/5 opacity-50" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const AnimatedMetric: React.FC<{
  value: number;
  suffix?: string;
  decimals?: number;
}> = ({ value, suffix = '', decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <span className="font-mono">
      {displayValue.toFixed(decimals)}{suffix}
    </span>
  );
};

const LiveIndicator: React.FC<{ status?: 'active' | 'idle' | 'error' }> = ({ status = 'active' }) => {
  const colors = {
    active: 'bg-emerald-400',
    idle: 'bg-amber-400',
    error: 'bg-red-400'
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`w-2 h-2 €{colors[status]} rounded-full animate-pulse`} />
        <div className={`absolute inset-0 w-2 h-2 €{colors[status]} rounded-full animate-ping`} />
      </div>
      <span className="text-xs text-slate-400 uppercase tracking-wider">Live</span>
    </div>
  );
};

// Main Navigation Component
const UltimateNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notifications = [
    { id: 1, title: 'AWS scan completed', desc: '47 new evidence items', time: '2m', type: 'success' },
    { id: 2, title: 'Trust score updated', desc: 'Increased to 94/100', time: '5m', type: 'info' },
    { id: 3, title: 'Configuration drift', desc: 'Azure VM policy changed', time: '12m', type: 'warning' }
  ];
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-2xl border-b border-slate-800/50">
      <div className="px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/velocity')}
          >
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-amber-400 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow" />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-amber-400 rounded-xl blur-md opacity-50" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-serif">Velocity</h1>
              <p className="text-[10px] text-slate-500 -mt-1">AI Command Center</p>
            </div>
          </div>
          
          {/* Primary Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavButton icon={Bot} label="Agents" active />
            <NavButton icon={Database} label="Evidence" onClick={() => navigate('/velocity/evidence')} />
            <NavButton icon={BarChart3} label="Analytics" onClick={() => navigate('/velocity/analytics')} />
            <NavButton icon={Shield} label="Compliance" onClick={() => navigate('/velocity/compliance')} />
            <NavButton icon={Workflow} label="Workflows" onClick={() => navigate('/velocity/workflows')} />
          </div>
        </div>
        
        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          {/* Global Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents, evidence, reports..."
              className="w-80 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Quick Actions */}
          <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full" />
          </button>
          
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            onClick={() => navigate('/velocity/agent/create')}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Agent</span>
          </button>
          
          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400/20 to-amber-400/20 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform €{showProfile ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavButton: React.FC<{
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}> = ({ icon: Icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all
      €{active 
        ? 'bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      }
    `}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

// Agent Status Card with Real-time Monitoring
const AgentMonitorCard: React.FC<{ agent: Agent }> = ({ agent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = agent.icon;
  
  const statusColors = {
    running: 'emerald',
    paused: 'amber',
    stopped: 'slate',
    error: 'red',
    initializing: 'blue',
    idle: 'purple'
  };
  
  const color = statusColors[agent.status];
  
  return (
    <GlassCard hover gradient>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 bg-€{color}-500/10 rounded-xl`}>
              <Icon className={`w-6 h-6 text-€{color}-400`} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg mb-1">{agent.name}</h3>
              <p className="text-sm text-slate-400">{agent.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 bg-€{color}-400 rounded-full €{agent.status === 'running' ? 'animate-pulse' : ''}`} />
                  <span className={`text-xs font-medium text-€{color}-400 capitalize`}>{agent.status}</span>
                </div>
                <span className="text-xs text-slate-500">
                  Last active {new Date(agent.metrics.lastActivity).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform €{isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <MetricItem 
            label="Evidence" 
            value={agent.evidence.collected}
            trend={agent.evidence.verified > 50 ? 'up' : 'stable'}
            suffix=" items"
          />
          <MetricItem 
            label="Tasks" 
            value={agent.tasks.completed}
            total={agent.tasks.completed + agent.tasks.pending}
            trend="up"
          />
          <MetricItem 
            label="Success" 
            value={agent.metrics.successRate}
            suffix="%"
            trend={agent.metrics.successRate > 95 ? 'up' : 'down'}
          />
          <MetricItem 
            label="Uptime" 
            value={agent.metrics.uptime}
            suffix="%"
            trend="stable"
          />
        </div>
        
        {/* Performance Bars */}
        <div className="space-y-3">
          <PerformanceBar label="CPU" value={agent.performance.cpu} max={100} />
          <PerformanceBar label="Memory" value={agent.performance.memory} max={100} />
          <PerformanceBar label="Throughput" value={agent.performance.throughput} max={1000} unit="req/s" />
        </div>
        
        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-4">
            {/* Integrations */}
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Active Integrations</h4>
              <div className="flex flex-wrap gap-2">
                {agent.integrations.map((integration, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-800/50 rounded-lg text-xs text-slate-300">
                    {integration}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Capabilities */}
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Capabilities</h4>
              <div className="grid grid-cols-2 gap-2">
                {agent.capabilities.map((capability, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {capability}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <button className="flex-1 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors text-sm font-medium">
                View Details
              </button>
              <button className="flex-1 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700/70 transition-colors text-sm font-medium">
                Configure
              </button>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

const MetricItem: React.FC<{
  label: string;
  value: number;
  total?: number;
  trend?: MetricTrend;
  suffix?: string;
}> = ({ label, value, total, trend, suffix = '' }) => (
  <div>
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-lg font-bold text-white">
        <AnimatedMetric value={value} suffix={suffix} />
      </span>
      {total && (
        <span className="text-xs text-slate-500">/ {total}</span>
      )}
      {trend && <TrendIndicator trend={trend} />}
    </div>
  </div>
);

const TrendIndicator: React.FC<{ trend: MetricTrend }> = ({ trend }) => {
  const icons = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Activity
  };
  const colors = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    stable: 'text-slate-400'
  };
  const Icon = icons[trend];
  
  return <Icon className={`w-3 h-3 €{colors[trend]}`} />;
};

const PerformanceBar: React.FC<{
  label: string;
  value: number;
  max: number;
  unit?: string;
}> = ({ label, value, max, unit = '%' }) => {
  const percentage = (value / max) * 100;
  const color = percentage > 80 ? 'red' : percentage > 60 ? 'amber' : 'emerald';
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs text-white font-medium">
          {value}{unit}
        </span>
      </div>
      <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-€{color}-500 transition-all duration-500`}
          style={{ width: `€{percentage}%` }}
        />
      </div>
    </div>
  );
};

// Trust Score Widget
const TrustScoreWidget: React.FC<{ score: number }> = ({ score }) => {
  const radius = 90;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <GlassCard gradient className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Trust Score</h3>
          <p className="text-sm text-slate-400">Cryptographically verified</p>
        </div>
        <LiveIndicator />
      </div>
      
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            className="text-slate-700"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="url(#gradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 2s ease-out' }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-white font-mono">
            <AnimatedMetric value={score} />
          </span>
          <span className="text-slate-400 text-sm">out of 100</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-400">A+</p>
          <p className="text-xs text-slate-400">Grade</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">147</p>
          <p className="text-xs text-slate-400">Controls</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-400">3</p>
          <p className="text-xs text-slate-400">Risks</p>
        </div>
      </div>
    </GlassCard>
  );
};

// Activity Timeline
const ActivityTimeline: React.FC = () => {
  const activities = [
    {
      id: 1,
      agent: 'AWS Evidence Collector',
      action: 'Completed infrastructure scan',
      details: '47 new evidence items collected from us-east-1',
      time: new Date(Date.now() - 2 * 60 * 1000),
      type: 'success' as const,
      icon: Cloud
    },
    {
      id: 2,
      agent: 'Trust Score Engine',
      action: 'Recalculated trust score',
      details: 'Score increased from 92 to 94 based on new evidence',
      time: new Date(Date.now() - 5 * 60 * 1000),
      type: 'info' as const,
      icon: TrendingUp
    },
    {
      id: 3,
      agent: 'Cryptographic Verification',
      action: 'Verified evidence integrity',
      details: '89 evidence items verified with Blake3 hashing',
      time: new Date(Date.now() - 12 * 60 * 1000),
      type: 'success' as const,
      icon: Fingerprint
    },
    {
      id: 4,
      agent: 'Continuous Monitor',
      action: 'Detected configuration drift',
      details: 'Azure VM security group rules modified outside policy',
      time: new Date(Date.now() - 18 * 60 * 1000),
      type: 'warning' as const,
      icon: AlertTriangle
    },
    {
      id: 5,
      agent: 'Document Generator',
      action: 'Generated compliance report',
      details: 'SOC 2 Type II evidence package ready for download',
      time: new Date(Date.now() - 25 * 60 * 1000),
      type: 'success' as const,
      icon: FileText
    }
  ];
  
  const typeStyles = {
    success: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: CheckCircle2 },
    warning: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: AlertCircle },
    error: { bg: 'bg-red-500/10', text: 'text-red-400', icon: XCircle },
    info: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: Info }
  };
  
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Activity Timeline</h3>
        <button className="text-sm text-slate-400 hover:text-white transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const style = typeStyles[activity.type];
          const StatusIcon = style.icon;
          const AgentIcon = activity.icon;
          
          return (
            <div key={activity.id} className="relative flex gap-4 group">
              {/* Timeline Line */}
              {index < activities.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-px bg-slate-700/50" />
              )}
              
              {/* Icon */}
              <div className={`relative flex-shrink-0 w-12 h-12 €{style.bg} rounded-xl flex items-center justify-center`}>
                <AgentIcon className={`w-5 h-5 €{style.text}`} />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 €{style.bg} rounded-full flex items-center justify-center border-2 border-slate-800`}>
                  <StatusIcon className={`w-3 h-3 €{style.text}`} />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white text-sm">{activity.agent}</p>
                    <p className="text-sm text-slate-400 mt-0.5">{activity.action}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.details}</p>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {formatTimeAgo(activity.time)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-6 py-2 bg-slate-800/50 text-slate-300 rounded-lg hover:bg-slate-800/70 transition-colors text-sm font-medium">
        Load More Activities
      </button>
    </GlassCard>
  );
};

// Helper function
const formatTimeAgo = (date: Date): string => {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 60) return `€{minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `€{hours}h ago`;
  return `€{Math.floor(hours / 24)}d ago`;
};

// Quick Actions Grid
const QuickActionsGrid: React.FC = () => {
  const actions = [
    {
      title: 'Run Full Scan',
      description: 'Execute comprehensive compliance scan',
      icon: Shield,
      color: 'emerald',
      onClick: () => console.log('Run scan')
    },
    {
      title: 'Generate Report',
      description: 'Create SOC 2 evidence package',
      icon: FileText,
      color: 'blue',
      onClick: () => console.log('Generate report')
    },
    {
      title: 'Deploy Agent',
      description: 'Launch new compliance agent',
      icon: Rocket,
      color: 'purple',
      onClick: () => console.log('Deploy agent')
    },
    {
      title: 'Review Evidence',
      description: 'Validate collected evidence',
      icon: CheckSquare,
      color: 'amber',
      onClick: () => console.log('Review evidence')
    }
  ];
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, i) => (
        <GlassCard 
          key={i} 
          hover 
          onClick={action.onClick}
          className="p-6 cursor-pointer group"
        >
          <div className={`w-12 h-12 bg-€{action.color}-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <action.icon className={`w-6 h-6 text-€{action.color}-400`} />
          </div>
          <h4 className="font-medium text-white mb-1 group-hover:text-emerald-400 transition-colors">
            {action.title}
          </h4>
          <p className="text-sm text-slate-400">{action.description}</p>
        </GlassCard>
      ))}
    </div>
  );
};

// Compliance Frameworks Status
const ComplianceStatus: React.FC = () => {
  const frameworks = [
    { name: 'SOC 2', status: 98, trend: 'up', lastAudit: '2 days ago' },
    { name: 'ISO 27001', status: 95, trend: 'stable', lastAudit: '1 week ago' },
    { name: 'GDPR', status: 100, trend: 'up', lastAudit: '3 days ago' },
    { name: 'HIPAA', status: 87, trend: 'down', lastAudit: '5 days ago' },
    { name: 'PCI DSS', status: 92, trend: 'up', lastAudit: '4 days ago' },
    { name: 'NIST', status: 96, trend: 'stable', lastAudit: '6 days ago' }
  ];
  
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Compliance Frameworks</h3>
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-slate-400" />
        </button>
      </div>
      
      <div className="space-y-4">
        {frameworks.map((framework) => (
          <div key={framework.name} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white text-sm">{framework.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">{framework.status}%</span>
                  <TrendIndicator trend={framework.trend as MetricTrend} />
                </div>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 €{
                    framework.status >= 95 ? 'bg-emerald-500' : 
                    framework.status >= 90 ? 'bg-blue-500' : 
                    framework.status >= 80 ? 'bg-amber-500' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `€{framework.status}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Last audit: {framework.lastAudit}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// Main Dashboard Component
const VelocityDashboardUltimate: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock agent data
  const agents: Agent[] = [
    {
      id: 'aws-1',
      name: 'AWS Evidence Collector',
      type: 'aws',
      status: 'running',
      description: 'Automated AWS infrastructure scanning and evidence collection',
      icon: Cloud,
      color: 'orange',
      evidence: { collected: 1247, pending: 23, verified: 1224 },
      performance: { cpu: 35, memory: 42, latency: 45, throughput: 850 },
      tasks: { completed: 156, pending: 3, failed: 0, processing: 2 },
      metrics: { uptime: 99.9, successRate: 98.5, lastActivity: new Date(), nextScheduled: new Date(Date.now() + 3600000) },
      integrations: ['CloudTrail', 'Config', 'GuardDuty', 'Security Hub'],
      capabilities: ['Auto-discovery', 'Real-time monitoring', 'Policy validation', 'Drift detection']
    },
    {
      id: 'gcp-1',
      name: 'GCP Scanner',
      type: 'gcp',
      status: 'running',
      description: 'Google Cloud Platform compliance monitoring and resource analysis',
      icon: Cloud,
      color: 'blue',
      evidence: { collected: 892, pending: 15, verified: 877 },
      performance: { cpu: 28, memory: 38, latency: 52, throughput: 720 },
      tasks: { completed: 89, pending: 2, failed: 1, processing: 1 },
      metrics: { uptime: 99.5, successRate: 95.2, lastActivity: new Date(Date.now() - 300000), nextScheduled: new Date(Date.now() + 1800000) },
      integrations: ['Cloud Asset', 'Security Command Center', 'Cloud Logging'],
      capabilities: ['Resource inventory', 'Security analysis', 'Compliance checks', 'Cost optimization']
    },
    {
      id: 'github-1',
      name: 'GitHub Security Analyzer',
      type: 'github',
      status: 'running',
      description: 'Repository security scanning and code compliance verification',
      icon: Github,
      color: 'purple',
      evidence: { collected: 456, pending: 8, verified: 448 },
      performance: { cpu: 15, memory: 25, latency: 38, throughput: 450 },
      tasks: { completed: 234, pending: 5, failed: 0, processing: 3 },
      metrics: { uptime: 100, successRate: 99.1, lastActivity: new Date(Date.now() - 60000), nextScheduled: null },
      integrations: ['GitHub API', 'Dependabot', 'Code Scanning', 'Secret Scanning'],
      capabilities: ['Vulnerability detection', 'License compliance', 'Code quality', 'Secret detection']
    },
    {
      id: 'azure-1',
      name: 'Azure Compliance Monitor',
      type: 'azure',
      status: 'paused',
      description: 'Microsoft Azure compliance tracking and configuration monitoring',
      icon: Cloud,
      color: 'blue',
      evidence: { collected: 678, pending: 0, verified: 678 },
      performance: { cpu: 0, memory: 12, latency: 0, throughput: 0 },
      tasks: { completed: 67, pending: 0, failed: 2, processing: 0 },
      metrics: { uptime: 98.7, successRate: 92.3, lastActivity: new Date(Date.now() - 1200000), nextScheduled: null },
      integrations: ['Azure Policy', 'Security Center', 'Monitor', 'Key Vault'],
      capabilities: ['Policy enforcement', 'Compliance scoring', 'Resource tagging', 'Access reviews']
    },
    {
      id: 'trust-1',
      name: 'Trust Score Engine',
      type: 'trust',
      status: 'running',
      description: 'High-performance trust calculations with Rust crypto core',
      icon: Shield,
      color: 'emerald',
      evidence: { collected: 0, pending: 0, verified: 0 },
      performance: { cpu: 45, memory: 55, latency: 12, throughput: 950 },
      tasks: { completed: 1024, pending: 12, failed: 0, processing: 8 },
      metrics: { uptime: 100, successRate: 100, lastActivity: new Date(), nextScheduled: new Date(Date.now() + 60000) },
      integrations: ['Rust Crypto Core', 'Polygon', 'Evidence Store', 'All Agents'],
      capabilities: ['Sub-50ms calculations', 'Merkle proofs', 'Blockchain verification', 'Real-time scoring']
    },
    {
      id: 'crypto-1',
      name: 'Cryptographic Verification',
      type: 'crypto',
      status: 'running',
      description: 'Blockchain-based evidence integrity and trust verification',
      icon: Fingerprint,
      color: 'purple',
      evidence: { collected: 2156, pending: 34, verified: 2122 },
      performance: { cpu: 62, memory: 48, latency: 28, throughput: 890 },
      tasks: { completed: 456, pending: 8, failed: 0, processing: 4 },
      metrics: { uptime: 99.8, successRate: 97.6, lastActivity: new Date(Date.now() - 30000), nextScheduled: new Date(Date.now() + 300000) },
      integrations: ['Polygon Network', 'IPFS', 'Blake3', 'All Evidence Sources'],
      capabilities: ['Hash verification', 'Digital signatures', 'Immutable audit trails', 'Zero-knowledge proofs']
    }
  ];
  
  const metrics = {
    trustScore: 94,
    totalAgents: 10,
    activeAgents: agents.filter(a => a.status === 'running').length,
    totalEvidence: agents.reduce((sum, a) => sum + a.evidence.collected, 0),
    verifiedEvidence: agents.reduce((sum, a) => sum + a.evidence.verified, 0),
    totalTasks: agents.reduce((sum, a) => sum + a.tasks.completed, 0),
    pendingTasks: agents.reduce((sum, a) => sum + a.tasks.pending, 0),
    failedTasks: agents.reduce((sum, a) => sum + a.tasks.failed, 0),
    avgSuccessRate: Math.round(agents.reduce((sum, a) => sum + a.metrics.successRate, 0) / agents.length),
    avgUptime: Math.round(agents.reduce((sum, a) => sum + a.metrics.uptime, 0) / agents.length * 10) / 10
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <UltimateNavigation />
      
      {/* Main Content */}
      <div className="pt-20 px-6 pb-8">
        <div className="max-w-[1920px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-light text-white mb-2">
                  Welcome to your
                  <span className="font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent"> AI Command Center</span>
                </h1>
                <p className="text-slate-400">
                  {metrics.activeAgents} of {metrics.totalAgents} agents actively monitoring your compliance posture
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Last 24 hours</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Export</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <MetricCard
              title="Trust Score"
              value={metrics.trustScore}
              suffix="/100"
              trend="up"
              icon={Shield}
              color="emerald"
              sparkline
            />
            <MetricCard
              title="Active Agents"
              value={metrics.activeAgents}
              suffix={`/€{metrics.totalAgents}`}
              trend="stable"
              icon={Bot}
              color="blue"
            />
            <MetricCard
              title="Evidence Collected"
              value={metrics.totalEvidence}
              trend="up"
              change="+127"
              icon={Database}
              color="purple"
            />
            <MetricCard
              title="Tasks Completed"
              value={metrics.totalTasks}
              trend="up"
              change="+89"
              icon={CheckCircle}
              color="amber"
            />
            <MetricCard
              title="Success Rate"
              value={metrics.avgSuccessRate}
              suffix="%"
              trend="up"
              icon={TrendingUp}
              color="emerald"
            />
          </div>
          
          {/* Main Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Agents */}
            <div className="col-span-12 xl:col-span-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">AI Agents</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg">
                    <span className="text-xs text-slate-400">Filter:</span>
                    <button className="text-xs font-medium text-emerald-400">All Agents</button>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <button className="p-1.5 text-slate-400 hover:text-white transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid gap-4">
                {agents.map(agent => (
                  <AgentMonitorCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>
            
            {/* Right Column */}
            <div className="col-span-12 xl:col-span-4 space-y-6">
              {/* Trust Score */}
              <TrustScoreWidget score={metrics.trustScore} />
              
              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <QuickActionsGrid />
              </div>
              
              {/* Compliance Status */}
              <ComplianceStatus />
              
              {/* Activity Timeline */}
              <ActivityTimeline />
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white transition-all hover:scale-110">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: number;
  suffix?: string;
  trend?: MetricTrend;
  change?: string;
  icon: LucideIcon;
  color: string;
  sparkline?: boolean;
}> = ({ title, value, suffix = '', trend, change, icon: Icon, color, sparkline }) => (
  <GlassCard hover gradient className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-2.5 bg-€{color}-500/10 rounded-xl`}>
        <Icon className={`w-5 h-5 text-€{color}-400`} />
      </div>
      {trend && (
        <div className="flex items-center gap-2">
          {change && (
            <span className={`text-xs font-medium €{trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
              {change}
            </span>
          )}
          <TrendIndicator trend={trend} />
        </div>
      )}
    </div>
    
    <div className="mb-2">
      <p className="text-3xl font-bold text-white">
        <AnimatedMetric value={value} />
        <span className="text-xl font-normal text-slate-400">{suffix}</span>
      </p>
      <p className="text-sm text-slate-400 mt-1">{title}</p>
    </div>
    
    {sparkline && (
      <div className="h-8 flex items-end justify-between gap-1 mt-4">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className={`flex-1 bg-€{color}-500/30 rounded-sm`}
            style={{ 
              height: `€{Math.random() * 100}%`,
              animationDelay: `€{i * 50}ms`
            }}
          />
        ))}
      </div>
    )}
  </GlassCard>
);

// Missing icon fix
const Rocket: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

export default VelocityDashboardUltimate;