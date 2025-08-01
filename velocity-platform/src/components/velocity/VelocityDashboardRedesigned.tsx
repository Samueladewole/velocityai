import React, { useState, useEffect } from 'react';
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
  Eye,
  Download,
  Filter,
  Calendar,
  Layers,
  Code,
  Server,
  Cloud,
  Lock,
  Key,
  RefreshCw,
  ExternalLink,
  Award,
  Star,
  TrendingDown
} from 'lucide-react';

// Enhanced Navigation with Glass Morphism
const DashboardNavigation = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [notifications] = useState([
    { id: 1, title: 'SOC2 Compliance achieved', time: '2m ago', type: 'success', unread: true },
    { id: 2, title: 'New AI agent deployed', time: '15m ago', type: 'info', unread: true },
    { id: 3, title: 'Evidence review required', time: '1h ago', type: 'warning', unread: false },
    { id: 4, title: 'Trust score increased +5', time: '2h ago', type: 'success', unread: false }
  ]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('velocity_auth_token');
    localStorage.removeItem('velocity_user');
    navigate('/velocity/login');
  };

  const userData = JSON.parse(localStorage.getItem('velocity_user') || '{}');

  const navigationItems = [
    { label: 'Overview', path: '/velocity/dashboard', icon: Home },
    { label: 'AI Agents', path: '/velocity/agents', icon: Bot },
    { label: 'Evidence', path: '/velocity/evidence', icon: Database },
    { label: 'Reports', path: '/velocity/reports', icon: BarChart3 },
    { label: 'Integrations', path: '/velocity/integration', icon: Globe }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error': return <X className="w-4 h-4 text-red-400" />;
      default: return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 €{
      scrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-slate-900/20' 
        : 'bg-slate-900/80 backdrop-blur-lg'
    }`}>
      <div className="border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/velocity/dashboard')}>
                <div className="relative group">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-slate-900" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white font-serif">Velocity</h1>
                  <p className="text-xs text-slate-400 -mt-1">AI Compliance Platform</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = window.location.pathname === item.path;
                  return (
                    <button 
                      key={item.label}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 €{
                        isActive 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search agents, evidence, compliance frameworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:bg-slate-800/70 transition-all duration-300"
                />
                <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden sm:block px-2 py-1 text-xs text-slate-400 bg-slate-700/50 rounded">⌘K</kbd>
              </div>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Quick Create Button */}
              <button 
                onClick={() => navigate('/velocity/creator')}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                Create Agent
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-amber-400 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Notifications</h3>
                        <button className="text-xs text-emerald-400 hover:text-emerald-300">Mark all read</button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 hover:bg-slate-700/30 transition-colors cursor-pointer border-b border-slate-700/30 €{
                            notification.unread ? 'bg-slate-700/20' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-700/50 rounded-lg">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white font-medium">{notification.title}</p>
                              <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                            </div>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-slate-700/50">
                      <button 
                        onClick={() => navigate('/velocity/notifications')}
                        className="w-full text-sm text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Settings */}
              <button 
                onClick={() => navigate('/velocity/settings')}
                className="p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {/* User Profile */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg flex items-center justify-center">
                    <span className="text-slate-900 font-bold text-sm">
                      {userData.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                
                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50">
                      <p className="text-white font-medium">{userData.name || 'Admin User'}</p>
                      <p className="text-xs text-slate-400 mt-1">{userData.email || 'admin@velocity.ai'}</p>
                      {userData.role === 'admin' && (
                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => navigate('/velocity/profile')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </button>
                      <button 
                        onClick={() => navigate('/velocity/billing')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                      >
                        <CreditCard className="w-4 h-4" />
                        Billing & Plans
                      </button>
                      <button 
                        onClick={() => navigate('/velocity/docs')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Documentation
                      </button>
                      <hr className="my-2 border-slate-700/50" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded-lg transition-colors"
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
                className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/50 bg-slate-900/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.path;
              return (
                <button 
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 €{
                    isActive 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

// Enhanced Metric Card with Animations
const MetricCard = ({ title, value, change, trend, icon: Icon, color, onClick, subtitle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPositive = change?.startsWith('+');
  
  const colorClasses = {
    emerald: 'from-emerald-400 to-emerald-600',
    amber: 'from-amber-400 to-amber-600',
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    red: 'from-red-400 to-red-600'
  };

  const bgClasses = {
    emerald: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
    amber: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    blue: 'bg-blue-500/10 group-hover:bg-blue-500/20',
    purple: 'bg-purple-500/10 group-hover:bg-purple-500/20',
    red: 'bg-red-500/10 group-hover:bg-red-500/20'
  };

  return (
    <div 
      className="group relative cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r €{colorClasses[color]} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}></div>
      
      <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transition-all duration-300 group-hover:border-slate-600/50 group-hover:transform group-hover:scale-[1.02]">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl €{bgClasses[color]} transition-all duration-300`}>
            <Icon className={`w-6 h-6 bg-gradient-to-r €{colorClasses[color]} bg-clip-text text-transparent`} />
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium €{isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className={`text-3xl font-bold bg-gradient-to-r €{colorClasses[color]} bg-clip-text text-transparent`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
          )}
        </div>

        {/* Progress Bar for percentage values */}
        {typeof value === 'string' && value.includes('%') && (
          <div className="mt-4">
            <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r €{colorClasses[color]} transition-all duration-1000 ease-out`}
                style={{ width: value }}
              ></div>
            </div>
          </div>
        )}

        {/* Hover Arrow */}
        <div className={`absolute bottom-4 right-4 transition-all duration-300 €{isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
};

// AI Agents Overview Section
const AIAgentsOverview = () => {
  const navigate = useNavigate();
  const [agents] = useState([
    {
      id: 1,
      name: 'SOC2 Compliance Scanner',
      status: 'active',
      framework: 'SOC2',
      platform: 'AWS',
      evidenceCollected: 156,
      lastRun: '2 mins ago',
      progress: 94,
      health: 'excellent'
    },
    {
      id: 2,
      name: 'ISO27001 Monitor',
      status: 'active',
      framework: 'ISO27001',
      platform: 'Multi-Cloud',
      evidenceCollected: 89,
      lastRun: '15 mins ago',
      progress: 87,
      health: 'good'
    },
    {
      id: 3,
      name: 'GDPR Data Scanner',
      status: 'paused',
      framework: 'GDPR',
      platform: 'Azure',
      evidenceCollected: 234,
      lastRun: '1 hour ago',
      progress: 100,
      health: 'good'
    },
    {
      id: 4,
      name: 'HIPAA Compliance Agent',
      status: 'active',
      framework: 'HIPAA',
      platform: 'GCP',
      evidenceCollected: 67,
      lastRun: '30 mins ago',
      progress: 72,
      health: 'warning'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/10';
      case 'paused': return 'text-amber-400 bg-amber-500/10';
      case 'error': return 'text-red-400 bg-red-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getHealthIcon = (health) => {
    switch (health) {
      case 'excellent': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'good': return <Activity className="w-4 h-4 text-blue-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default: return <X className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white font-serif">AI Agents</h2>
          <p className="text-sm text-slate-400 mt-1">Automated compliance monitoring</p>
        </div>
        <button 
          onClick={() => navigate('/velocity/agents')}
          className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className="group bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/agents/€{agent.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg €{getStatusColor(agent.status).split(' ')[1]}`}>
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-slate-400">{agent.framework}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400">{agent.platform}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400">{agent.lastRun}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getHealthIcon(agent.health)}
                <span className={`text-xs font-medium px-2 py-1 rounded-full €{getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <p className="text-xs text-slate-400">Evidence Items</p>
                <p className="text-sm font-semibold text-white">{agent.evidenceCollected}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Progress</p>
                <p className="text-sm font-semibold text-white">{agent.progress}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Health</p>
                <p className="text-sm font-semibold text-white capitalize">{agent.health}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000"
                style={{ width: `€{agent.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Compliance Frameworks Overview
const ComplianceFrameworksOverview = () => {
  const navigate = useNavigate();
  const [frameworks] = useState([
    {
      name: 'SOC 2 Type II',
      status: 'compliant',
      score: 94,
      controls: { total: 64, passed: 60, failed: 4 },
      lastAudit: '2 days ago',
      nextAudit: 'in 28 days',
      trend: '+2.3%'
    },
    {
      name: 'ISO 27001',
      status: 'in-progress',
      score: 87,
      controls: { total: 114, passed: 99, failed: 15 },
      lastAudit: '1 week ago',
      nextAudit: 'in 21 days',
      trend: '+5.1%'
    },
    {
      name: 'GDPR',
      status: 'compliant',
      score: 96,
      controls: { total: 45, passed: 43, failed: 2 },
      lastAudit: '3 days ago',
      nextAudit: 'in 87 days',
      trend: '+1.2%'
    },
    {
      name: 'HIPAA',
      status: 'at-risk',
      score: 72,
      controls: { total: 78, passed: 56, failed: 22 },
      lastAudit: '2 weeks ago',
      nextAudit: 'in 14 days',
      trend: '-3.4%'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'in-progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'at-risk': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'from-emerald-400 to-emerald-600';
    if (score >= 70) return 'from-amber-400 to-amber-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white font-serif">Compliance Status</h2>
          <p className="text-sm text-slate-400 mt-1">Framework compliance overview</p>
        </div>
        <button 
          onClick={() => navigate('/velocity/reports')}
          className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          Full Report
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {frameworks.map((framework, index) => (
          <div 
            key={index}
            className="group bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/50 transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/compliance/€{framework.name.toLowerCase().replace(/\s+/g, '-')}`)}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {framework.name}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border €{getStatusColor(framework.status)}`}>
                    {framework.status.replace('-', ' ')}
                  </span>
                  <span className={`text-xs font-medium €{framework.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {framework.trend}
                  </span>
                </div>
              </div>
              
              {/* Score Circle */}
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-slate-700"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`€{framework.score * 1.76} 176`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient">
                      <stop offset="0%" className={`text-€{getScoreColor(framework.score).split(' ')[0].split('-')[1]}-400`} />
                      <stop offset="100%" className={`text-€{getScoreColor(framework.score).split(' ')[2].split('-')[1]}-600`} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold bg-gradient-to-r €{getScoreColor(framework.score)} bg-clip-text text-transparent`}>
                    {framework.score}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls Status */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
              <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                <p className="text-slate-400">Total</p>
                <p className="text-white font-semibold">{framework.controls.total}</p>
              </div>
              <div className="text-center p-2 bg-emerald-500/10 rounded-lg">
                <p className="text-emerald-400">Passed</p>
                <p className="text-white font-semibold">{framework.controls.passed}</p>
              </div>
              <div className="text-center p-2 bg-red-500/10 rounded-lg">
                <p className="text-red-400">Failed</p>
                <p className="text-white font-semibold">{framework.controls.failed}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Last: {framework.lastAudit}</span>
              <span>Next: {framework.nextAudit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recent Activity Timeline
const ActivityTimeline = () => {
  const [activities] = useState([
    {
      id: 1,
      type: 'compliance',
      title: 'SOC2 Compliance Achieved',
      description: 'All controls passed for SOC2 Type II certification',
      time: '2 minutes ago',
      user: 'System',
      impact: 'high'
    },
    {
      id: 2,
      type: 'agent',
      title: 'New Agent Deployed',
      description: 'AWS Security Scanner deployed to production',
      time: '15 minutes ago',
      user: 'Admin User',
      impact: 'medium'
    },
    {
      id: 3,
      type: 'evidence',
      title: 'Evidence Collection Complete',
      description: '234 new evidence items collected from Azure environment',
      time: '1 hour ago',
      user: 'ISO27001 Monitor',
      impact: 'low'
    },
    {
      id: 4,
      type: 'alert',
      title: 'Security Alert Resolved',
      description: 'Unauthorized access attempt blocked and logged',
      time: '2 hours ago',
      user: 'Security Agent',
      impact: 'high'
    }
  ]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'compliance': return <Award className="w-4 h-4" />;
      case 'agent': return <Bot className="w-4 h-4" />;
      case 'evidence': return <Database className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-emerald-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white font-serif">Recent Activity</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time compliance events</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 rounded-lg transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative group">
            {/* Timeline Line */}
            {index < activities.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-px bg-slate-700/50"></div>
            )}
            
            <div className="flex gap-4">
              {/* Icon */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-slate-700/70 transition-colors">
                  {getActivityIcon(activity.type)}
                </div>
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full €{getImpactColor(activity.impact)} ring-2 ring-slate-800`}></div>
              </div>
              
              {/* Content */}
              <div className="flex-1 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 group-hover:border-slate-600/50 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-white">{activity.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{activity.description}</p>
                  </div>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <User className="w-3 h-3" />
                  {activity.user}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
        Load more activities
      </button>
    </div>
  );
};

// Quick Actions Grid
const QuickActions = () => {
  const navigate = useNavigate();
  
  const actions = [
    {
      title: 'Run Compliance Scan',
      description: 'Start a comprehensive audit',
      icon: Search,
      color: 'emerald',
      action: () => navigate('/velocity/scan')
    },
    {
      title: 'Generate Report',
      description: 'Create compliance report',
      icon: FileText,
      color: 'blue',
      action: () => navigate('/velocity/reports/generate')
    },
    {
      title: 'Deploy Agent',
      description: 'Add new AI agent',
      icon: Bot,
      color: 'purple',
      action: () => navigate('/velocity/agents/create')
    },
    {
      title: 'View Evidence',
      description: 'Browse collected evidence',
      icon: Database,
      color: 'amber',
      action: () => navigate('/velocity/evidence')
    }
  ];

  const colorClasses = {
    emerald: 'from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700',
    blue: 'from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700',
    purple: 'from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700',
    amber: 'from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700'
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white font-serif mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="group relative overflow-hidden bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-all duration-300"
          >
            <div className="relative z-10">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r €{colorClasses[action.color]} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-white mb-1">{action.title}</h3>
              <p className="text-xs text-slate-400">{action.description}</p>
            </div>
            
            {/* Hover Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r €{colorClasses[action.color]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const VelocityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics] = useState({
    trustScore: 94,
    activeAgents: 8,
    evidenceItems: 2847,
    automationRate: 95,
    frameworks: 4,
    integrations: 12
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600;700&display=swap');
        
        .font-serif {
          font-family: 'Instrument Serif', serif;
        }
        
        .font-sans {
          font-family: 'Manrope', sans-serif;
        }
      `}</style>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <DashboardNavigation />

      <div className="relative z-10 pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-light text-white">
              Welcome back, <span className="font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">Admin</span>
            </h1>
            <p className="text-slate-400 mt-2">Your compliance automation platform is running smoothly</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <MetricCard
              title="Trust Score"
              value={`€{metrics.trustScore}%`}
              change="+2.3%"
              trend={true}
              icon={Shield}
              color="emerald"
              onClick={() => navigate('/velocity/trust-score')}
              subtitle="Excellent"
            />
            <MetricCard
              title="Active Agents"
              value={metrics.activeAgents}
              change="+2"
              trend={true}
              icon={Bot}
              color="blue"
              onClick={() => navigate('/velocity/agents')}
              subtitle="All systems go"
            />
            <MetricCard
              title="Evidence Items"
              value={metrics.evidenceItems.toLocaleString()}
              change="+347"
              trend={true}
              icon={Database}
              color="purple"
              onClick={() => navigate('/evidence')}
              subtitle="Last 24 hours"
            />
            <MetricCard
              title="Automation"
              value={`€{metrics.automationRate}%`}
              change="+5%"
              trend={true}
              icon={Zap}
              color="amber"
              onClick={() => navigate('/velocity/automation')}
              subtitle="Industry leading"
            />
            <MetricCard
              title="Frameworks"
              value={metrics.frameworks}
              icon={Layers}
              color="emerald"
              onClick={() => navigate('/velocity/frameworks')}
              subtitle="All compliant"
            />
            <MetricCard
              title="Integrations"
              value={metrics.integrations}
              change="+1"
              trend={true}
              icon={Globe}
              color="blue"
              onClick={() => navigate('/velocity/integrations')}
              subtitle="Connected"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - AI Agents & Compliance */}
            <div className="lg:col-span-2 space-y-6">
              <AIAgentsOverview />
              <ComplianceFrameworksOverview />
            </div>

            {/* Right Column - Activity & Actions */}
            <div className="space-y-6">
              <QuickActions />
              <ActivityTimeline />
            </div>
          </div>
        </div>
      </div>

      <VelocityFooter />

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

// Missing import
const CreditCard = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="7" width="18" height="12" rx="2" strokeWidth="2"/>
    <path d="M3 10h18" strokeWidth="2"/>
  </svg>
);

export default VelocityDashboard;