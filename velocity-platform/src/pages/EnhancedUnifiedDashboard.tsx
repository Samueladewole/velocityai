import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useUrlState } from '../hooks/useUrlState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AgentGrid } from '@/components/agents/AgentGrid';
import { EvidenceStream } from '@/components/agents/EvidenceStream';
import { useAuthStore } from '@/store';
import { 
  Activity, 
  Database, 
  Settings, 
  TrendingUp,
  Zap,
  Shield,
  Play,
  Pause,
  AlertCircle,
  Trophy,
  Users,
  FileCheck,
  Bot,
  Eye,
  BarChart3,
  Lock,
  Cloud,
  ArrowUp,
  ArrowDown,
  Clock,
  Home,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
  Maximize2,
  MoreHorizontal,
  Cpu,
  Server,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  Target,
  Layers,
  PieChart,
  LineChart,
  Map,
  Gauge
} from 'lucide-react';

// Enhanced Trust Score Card with real-time animations
const EnhancedTrustScoreCard = () => {
  const [score, setScore] = useState(96.7);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setScore(prev => prev + (Math.random() - 0.5) * 0.2);
        setIsAnimating(false);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 text-white border-0 shadow-2xl overflow-hidden relative group hover:shadow-3xl transition-all duration-300">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-x"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <CardContent className="p-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <div>
                <div className={`text-5xl font-bold transition-all duration-500 ${isAnimating ? 'scale-110' : ''}`}>
                  {score.toFixed(1)}%
                </div>
                <p className="text-white/90 text-xl font-semibold">Trust Score</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-emerald-300 text-sm">
                    <ArrowUp className="h-4 w-4" />
                    <span className="font-medium">+2.3% today</span>
                  </div>
                  <span className="text-white/60">•</span>
                  <span className="text-white/80 text-sm">99th percentile</span>
                </div>
              </div>
            </div>
            
            <p className="text-white/90 text-lg">
              🔐 Cryptographically verified • Real-time monitoring
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Shield, label: 'SOC 2 Ready', value: '100%', color: 'emerald' },
                { icon: Activity, label: 'Agents Active', value: '13', color: 'blue' },
                { icon: Database, label: 'Evidence Items', value: '2.8K', color: 'purple' },
                { icon: Zap, label: 'Automation', value: '98.2%', color: 'amber' }
              ].map((metric, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition-all duration-200 group/metric">
                  <div className="flex items-center gap-2 mb-2">
                    <metric.icon className="h-5 w-5 text-white" />
                    <span className="text-white/80 text-sm font-medium">{metric.label}</span>
                  </div>
                  <div className="text-2xl font-bold group-hover/metric:scale-105 transition-transform">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hidden xl:block">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold mb-1">Real-time Status</div>
                <div className="text-white/80">Live Monitoring</div>
              </div>
              
              {/* Real-time status indicators */}
              <div className="space-y-3">
                {[
                  { label: 'Cloud Security', status: 'optimal', value: 99.9 },
                  { label: 'Compliance Score', status: 'excellent', value: 96.7 },
                  { label: 'Evidence Quality', status: 'verified', value: 98.2 },
                  { label: 'Risk Level', status: 'low', value: 2.1 }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-white/90 text-sm">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Advanced Real-time Metrics Grid
const RealTimeMetricsGrid = () => {
  const [metrics, setMetrics] = useState({
    activeThreats: 0,
    incidentsResolved: 247,
    systemUptime: 99.97,
    dataProcessed: 1.2,
    alertsTriaged: 89,
    complianceScore: 96.7
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeThreats: Math.max(0, prev.activeThreats + (Math.random() > 0.7 ? 1 : -1)),
        incidentsResolved: prev.incidentsResolved + (Math.random() > 0.8 ? 1 : 0),
        systemUptime: Math.min(99.99, prev.systemUptime + (Math.random() - 0.5) * 0.01),
        dataProcessed: prev.dataProcessed + Math.random() * 0.1,
        alertsTriaged: prev.alertsTriaged + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const metricCards = [
    {
      title: 'Active Threats',
      value: metrics.activeThreats,
      suffix: '',
      trend: 'down',
      trendValue: '-23%',
      icon: AlertTriangle,
      color: metrics.activeThreats === 0 ? 'emerald' : 'red',
      bgColor: metrics.activeThreats === 0 ? 'emerald' : 'red'
    },
    {
      title: 'Incidents Resolved',
      value: metrics.incidentsResolved,
      suffix: '',
      trend: 'up',
      trendValue: '+12%',
      icon: CheckCircle,
      color: 'emerald',
      bgColor: 'emerald'
    },
    {
      title: 'System Uptime',
      value: metrics.systemUptime.toFixed(2),
      suffix: '%',
      trend: 'up',
      trendValue: '+0.02%',
      icon: Server,
      color: 'blue',
      bgColor: 'blue'
    },
    {
      title: 'Data Processed',
      value: metrics.dataProcessed.toFixed(1),
      suffix: 'TB',
      trend: 'up',
      trendValue: '+15%',
      icon: Database,
      color: 'purple',
      bgColor: 'purple'
    },
    {
      title: 'Alerts Triaged',
      value: metrics.alertsTriaged,
      suffix: '',
      trend: 'up',
      trendValue: '+8%',
      icon: Eye,
      color: 'amber',
      bgColor: 'amber'
    },
    {
      title: 'Compliance Score',
      value: metrics.complianceScore,
      suffix: '%',
      trend: 'up',
      trendValue: '+2.3%',
      icon: Shield,
      color: 'emerald',
      bgColor: 'emerald'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metricCards.map((metric, index) => (
        <Card key={index} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${metric.bgColor}-100 rounded-xl group-hover:bg-${metric.bgColor}-200 transition-colors`}>
                <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {metric.trendValue}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900 group-hover:scale-105 transition-transform">
                {metric.value}{metric.suffix}
              </div>
              <div className="text-sm text-slate-600 font-medium">{metric.title}</div>
              
              {/* Animated progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-600 rounded-full transition-all duration-1000 animate-pulse`}
                  style={{ width: `${Math.min(100, (typeof metric.value === 'number' ? metric.value : 0))}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Interactive Command Center
const CommandCenter = () => {
  const [activeView, setActiveView] = useState('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <Card className="bg-slate-900 text-white border-0 shadow-2xl overflow-hidden">
      <CardHeader className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Cpu className="h-6 w-6 text-blue-400" />
            AI Command Center
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <span className="font-semibold">AI Recommendations</span>
              </div>
              
              <div className="space-y-3">
                {[
                  {
                    type: 'security',
                    priority: 'high',
                    message: 'Detected unusual login pattern from AWS. Consider enabling MFA for service accounts.',
                    confidence: 94,
                    action: 'Review'
                  },
                  {
                    type: 'compliance',
                    priority: 'medium',
                    message: 'SOC 2 evidence collection is 15% ahead of schedule. Excellent progress!',
                    confidence: 98,
                    action: 'Continue'
                  },
                  {
                    type: 'optimization',
                    priority: 'low',
                    message: 'Agent efficiency can be improved by 12% with configuration update.',
                    confidence: 87,
                    action: 'Optimize'
                  }
                ].map((insight, i) => (
                  <div key={i} className="bg-slate-700/30 rounded-lg p-3 hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${
                            insight.priority === 'high' ? 'bg-red-400' :
                            insight.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
                          }`} />
                          <span className="text-sm font-medium capitalize">{insight.type}</span>
                          <span className="text-xs text-slate-400">Confidence: {insight.confidence}%</span>
                        </div>
                        <p className="text-slate-300 text-sm">{insight.message}</p>
                      </div>
                      <Button size="sm" variant="outline" className="ml-3 text-xs">
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Real-time Activity Feed */}
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-green-400" />
                <span className="font-semibold">Live Activity Stream</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-auto" />
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {[
                  { time: '2s ago', action: 'AWS Evidence Collector', details: 'Gathered 23 CloudTrail events', status: 'success' },
                  { time: '15s ago', action: 'Trust Engine', details: 'Updated compliance score to 96.8%', status: 'info' },
                  { time: '1m ago', action: 'GCP Scanner', details: 'Validated 15 IAM policies', status: 'success' },
                  { time: '2m ago', action: 'Alert System', details: 'Detected configuration drift in EKS', status: 'warning' },
                  { time: '3m ago', action: 'Evidence Validator', details: 'Verified 45 compliance artifacts', status: 'success' }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm py-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      activity.status === 'success' ? 'bg-emerald-400' :
                      activity.status === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{activity.action}</span>
                        <span className="text-slate-500 text-xs">{activity.time}</span>
                      </div>
                      <p className="text-slate-400 text-xs truncate">{activity.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick Actions & Stats */}
          <div className="space-y-4">
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                Quick Actions
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Scan Infrastructure', icon: Search, color: 'blue' },
                  { label: 'Generate Report', icon: Download, color: 'emerald' },
                  { label: 'Deploy Agent', icon: Bot, color: 'purple' },
                  { label: 'Review Alerts', icon: Bell, color: 'amber' }
                ].map((action, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className={`bg-${action.color}-900/20 border-${action.color}-700/50 text-${action.color}-300 hover:bg-${action.color}-800/30 p-3 h-auto flex-col gap-1`}
                  >
                    <action.icon className="h-4 w-4" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-400" />
                System Health
              </h3>
              
              <div className="space-y-3">
                {[
                  { label: 'API Response Time', value: '12ms', status: 'excellent' },
                  { label: 'Data Pipeline', value: '99.9%', status: 'excellent' },
                  { label: 'Agent Network', value: '13/13', status: 'optimal' },
                  { label: 'Storage Usage', value: '68%', status: 'good' }
                ].map((health, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">{health.label}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        health.status === 'excellent' ? 'bg-emerald-400' :
                        health.status === 'optimal' ? 'bg-blue-400' : 'bg-amber-400'
                      }`} />
                      <span className="text-white text-sm font-medium">{health.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Dashboard Layout
const EnhancedUnifiedDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useUrlState('tab', 'overview', {
    storageKey: 'dashboard_tab'
  });
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/velocity/login" replace />;
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 py-2">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/velocity')}
                className="flex items-center gap-3 hover:scale-105 transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl shadow-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">V</span>
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-bold text-slate-900 font-serif">Velocity</span>
                  <div className="text-sm text-violet-600 font-semibold -mt-1">AI Compliance Command Center</div>
                </div>
              </button>
              
              {user && (
                <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200/50 shadow-sm">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-sm font-semibold text-slate-700">
                    Welcome back, {user.name || 'User'}
                  </span>
                  <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {(user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-violet-50 hover:text-violet-600 transition-all duration-200"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
                onClick={() => navigate('/velocity')}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                onClick={() => navigate('/velocity/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all duration-200 shadow-sm border-slate-300"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5 bg-white/80 backdrop-blur-sm shadow-xl border-0 p-2 rounded-2xl">
            <TabsTrigger value="overview" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-violet-500 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-violet-500 data-[state=active]:text-white">
              <Bot className="h-4 w-4" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="evidence" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-violet-500 data-[state=active]:text-white">
              <Database className="h-4 w-4" />
              Evidence
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-violet-500 data-[state=active]:text-white">
              <Shield className="h-4 w-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-violet-500 data-[state=active]:text-white">
              <Cloud className="h-4 w-4" />
              Cloud
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Enhanced */}
          <TabsContent value="overview" className="space-y-8">
            <EnhancedTrustScoreCard />
            
            <div className="grid grid-cols-1 gap-8">
              <RealTimeMetricsGrid />
            </div>
            
            <CommandCenter />
          </TabsContent>

          {/* AI Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">AI Agent Network</h2>
              <AgentGrid />
            </div>
          </TabsContent>

          {/* Evidence Tab */}
          <TabsContent value="evidence" className="space-y-6">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Evidence Intelligence</h2>
              <EvidenceStream />
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-violet-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Compliance Framework Dashboard</h3>
              <p className="text-slate-500 mb-6">Advanced compliance monitoring and framework management</p>
            </div>
          </TabsContent>

          {/* Cloud Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="text-center py-12">
              <Cloud className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Cloud Integration Hub</h3>
              <p className="text-slate-500 mb-6">Manage your cloud platform connections and data flows</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {[
                  { name: 'AWS', status: 'connected', color: 'emerald' },
                  { name: 'Google Cloud', status: 'connected', color: 'blue' },
                  { name: 'Microsoft Azure', status: 'pending', color: 'amber' },
                  { name: 'GitHub', status: 'connected', color: 'purple' }
                ].map((platform) => (
                  <Card key={platform.name} className="p-4 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className={`w-12 h-12 bg-${platform.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <div className={`w-3 h-3 bg-${platform.color}-500 rounded-full`} />
                      </div>
                      <h3 className="font-semibold">{platform.name}</h3>
                      <p className={`text-sm text-${platform.color}-600 capitalize`}>{platform.status}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedUnifiedDashboard;