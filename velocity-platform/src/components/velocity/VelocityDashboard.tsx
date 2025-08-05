import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Bookmark
} from 'lucide-react';

// Enhanced Navigation for Dashboard
const DashboardNavigation = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'SOC2 Agent completed scan', time: '2 min ago', type: 'success' },
    { id: 2, title: 'New evidence items collected', time: '5 min ago', type: 'info' },
    { id: 3, title: 'Trust score updated', time: '10 min ago', type: 'success' }
  ]);
  
  const handleLogout = () => {
    localStorage.removeItem('velocity_auth_token');
    navigate('/login');
  };

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Agents', path: '/agents', icon: Bot },
    { label: 'Evidence', path: '/evidence', icon: Database },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Integration', path: '/integration', icon: Globe },
    { label: 'Documentation', path: '/docs', icon: FileText }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg blur-sm opacity-50"></div>
            </div>
            <span className="text-xl font-bold text-white font-serif">Velocity</span>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search agents, evidence, reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <button 
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200 font-medium relative group px-3 py-2 rounded-lg hover:bg-slate-800/50"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
                </button>
              );
            })}
          </div>
          
          {/* Right Side Menu */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button className="relative text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{notifications.length}</span>
                  </span>
                )}
              </button>
            </div>
            
            {/* Quick Actions */}
            <button 
              onClick={() => navigate('/creator')}
              className="hidden md:flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg hover:bg-emerald-500/30 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              New Agent
            </button>
            
            {/* User Profile Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50"
              >
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-400" />
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-xl overflow-hidden">
                  <div className="p-3 border-b border-slate-700/50">
                    <p className="text-white font-medium">John Doe</p>
                    <p className="text-xs text-slate-400">admin@company.com</p>
                  </div>
                  <div className="p-1">
                    <button 
                      onClick={() => navigate('/settings')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button 
                      onClick={() => navigate('/docs')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Help & Support
                    </button>
                    <button 
                      onClick={() => navigate('/feedback')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Feedback
                    </button>
                    <hr className="my-1 border-slate-700/50" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-300 hover:text-white transition-colors p-2"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800/50 py-4">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={item.label}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors font-medium px-3 py-2 rounded-lg hover:bg-slate-800/50"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Enhanced Metric Card for Dashboard
const DashboardMetricCard = ({ title, value, trend, icon: Icon, color }) => {
  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-600/20 border-amber-500/30',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30'
  };

  return (
    <div className="group relative">
      {/* Gradient border effect */}
      <div className={`absolute inset-0 bg-gradient-to-br €{colorClasses[color]} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 group-hover:border-transparent transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-€{color}-500/10 rounded-lg`}>
            <Icon className="w-6 h-6 text-emerald-400" />
          </div>
          <span className={`text-sm font-medium €{trend?.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend}
          </span>
        </div>
        
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white font-mono">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Active Agents Section
const ActiveAgentsSection = () => {
  const [agents] = useState([
    { id: 1, name: 'SOC2 Compliance Agent', status: 'running', evidence: 47, platform: 'AWS' },
    { id: 2, name: 'ISO27001 Scanner', status: 'running', evidence: 23, platform: 'GCP' },
    { id: 3, name: 'GDPR Monitor', status: 'paused', evidence: 15, platform: 'Azure' },
    { id: 4, name: 'Security Controls', status: 'running', evidence: 89, platform: 'Multi-Cloud' }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-emerald-400';
      case 'paused': return 'text-amber-400';
      case 'error': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4" />;
      case 'paused': return <Clock className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white font-serif">Active AI Agents</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
          <Plus className="w-4 h-4" />
          Create Agent
        </button>
      </div>
      
      <div className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-2 bg-slate-800 rounded-lg €{getStatusColor(agent.status)}`}>
                {getStatusIcon(agent.status)}
              </div>
              <div>
                <h4 className="font-medium text-white">{agent.name}</h4>
                <p className="text-sm text-slate-400">{agent.platform} • {agent.evidence} evidence items</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium capitalize €{getStatusColor(agent.status)}`}>
                {agent.status}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick Actions Section
const QuickActionsSection = () => {
  const navigate = useNavigate();
  
  const actions = [
    { 
      title: 'Run SOC2 Assessment', 
      description: 'Start automated SOC2 compliance scan',
      icon: Shield,
      color: 'emerald',
      action: () => console.log('SOC2 Assessment')
    },
    { 
      title: 'Generate Report', 
      description: 'Create compliance report for stakeholders',
      icon: Target,
      color: 'blue',
      action: () => console.log('Generate Report')
    },
    { 
      title: 'Review Evidence', 
      description: 'Check recently collected evidence',
      icon: CheckCircle,
      color: 'amber',
      action: () => navigate('/evidence')
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white font-serif mb-6">Quick Actions</h3>
      
      <div className="grid gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="group flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 text-left"
          >
            <div className={`p-3 bg-€{action.color}-500/10 rounded-lg group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-white group-hover:text-emerald-400 transition-colors">{action.title}</h4>
              <p className="text-sm text-slate-400">{action.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const VelocityDashboard: React.FC = () => {
  const [metrics] = useState({
    trustScore: 94,
    activeAgents: 4,
    evidenceItems: 174,
    automationRate: 95
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 font-sans">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600;700&display=swap');
        
        .font-serif {
          font-family: 'Instrument Serif', serif;
        }
        
        .font-sans {
          font-family: 'Manrope', sans-serif;
        }
        
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      <DashboardNavigation />

      <div className="relative z-10 pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-light text-white mb-2">
              Welcome back to 
              <span className="font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent"> Velocity</span>
            </h1>
            <p className="text-slate-400">Your compliance automation is running smoothly</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardMetricCard
              title="Trust Score"
              value={metrics.trustScore}
              trend="+2pts"
              icon={Shield}
              color="emerald"
            />
            <DashboardMetricCard
              title="Active Agents"
              value={metrics.activeAgents}
              trend="+1"
              icon={Zap}
              color="blue"
            />
            <DashboardMetricCard
              title="Evidence Items"
              value={metrics.evidenceItems}
              trend="+47"
              icon={CheckCircle}
              color="amber"
            />
            <DashboardMetricCard
              title="Automation Rate"
              value={`€{metrics.automationRate}%`}
              trend="+3%"
              icon={TrendingUp}
              color="purple"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <ActiveAgentsSection />
            </div>
            <div>
              <QuickActionsSection />
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default VelocityDashboard;