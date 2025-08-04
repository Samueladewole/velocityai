import React, { useState, useEffect } from 'react';
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
  Home
} from 'lucide-react';

// Trust Score Card Component
const TrustScoreCard = () => {
  return (
    <Card className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white border-0 shadow-xl">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">
              🏆 Trust Score: 96.7%
            </h2>
            <p className="text-emerald-100 text-lg">
              Cryptographically verified compliance status
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>SOC 2 Ready</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span>13 Agents Active</span>
              </div>
              <div className="flex items-center gap-1">
                <Database className="h-4 w-4" />
                <span>2,831 Evidence Items</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-right">
              <div className="text-4xl font-bold">98.2%</div>
              <div className="text-emerald-100">Automation Rate</div>
              <div className="text-sm text-emerald-200 mt-2">
                vs 15% industry average
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Compliance Status Overview
const ComplianceStatus = () => {
  const frameworks = [
    { name: 'SOC 2', status: 98.4, color: 'emerald' },
    { name: 'ISO 27001', status: 94.7, color: 'blue' },
    { name: 'GDPR', status: 91.2, color: 'purple' },
    { name: 'HIPAA', status: 87.9, color: 'orange' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-600" />
          Compliance Framework Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {frameworks.map((framework) => (
            <div key={framework.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{framework.name}</span>
                <span className="font-bold">{framework.status}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`bg-€{framework.color}-500 h-2 rounded-full transition-all duration-300`}
                  style={{ width: `€{framework.status}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-700">
            <Trophy className="h-5 w-5" />
            <span className="font-semibold">Ready for audit in 2 weeks</span>
          </div>
          <p className="text-sm text-emerald-600 mt-1">
            All critical controls validated and evidence collected
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'evidence_collected',
      message: 'AWS Evidence Collector gathered 47 new CloudTrail events',
      timestamp: '5 minutes ago',
      icon: Database,
      color: 'blue'
    },
    {
      id: 2,
      type: 'compliance_check',
      message: 'SOC 2 control CC6.1 automatically verified',
      timestamp: '12 minutes ago',
      icon: Shield,
      color: 'emerald'
    },
    {
      id: 3,
      type: 'trust_score_update',
      message: 'Trust score increased to 96.7% (+0.3%)',
      timestamp: '1 hour ago',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      id: 4,
      type: 'agent_deployment',
      message: 'GitHub Security Analyzer deployed successfully',
      timestamp: '2 hours ago',
      icon: Bot,
      color: 'amber'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className={`p-2 rounded-lg bg-€{activity.color}-100`}>
                <activity.icon className={`h-4 w-4 text-€{activity.color}-600`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                <p className="text-xs text-slate-500 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Simple Line Chart Component (using CSS for visualization)
const SimpleLineChart = ({ data, color = "emerald", height = "h-32" }: { 
  data: number[], 
  color?: string, 
  height?: string 
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  return (
    <div className={`€{height} relative`}>
      <svg className="w-full h-full" viewBox="0 0 100 40">
        <polyline
          fill="none"
          stroke={color === 'emerald' ? '#10b981' : color === 'blue' ? '#3b82f6' : color === 'purple' ? '#8b5cf6' : '#10b981'}
          strokeWidth="2"
          points={data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 40 - ((value - min) / range) * 30;
            return `€{x},€{y}`;
          }).join(' ')}
        />
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 40 - ((value - min) / range) * 30;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color === 'emerald' ? '#10b981' : color === 'blue' ? '#3b82f6' : color === 'purple' ? '#8b5cf6' : '#10b981'}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Agent Performance Chart
const AgentPerformanceChart = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  
  const performanceData = {
    '24h': [92, 94, 96, 98, 97, 99, 98, 96, 95, 97, 98, 99],
    '7d': [88, 91, 94, 96, 98, 97, 99],
    '30d': [85, 87, 90, 93, 95, 96, 97, 98, 98, 97, 98, 99]
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" />
            Agent Performance Trends
          </CardTitle>
          <div className="flex gap-1">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-emerald-600">
              {performanceData[timeRange][performanceData[timeRange].length - 1]}%
            </span>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm">+2.1%</span>
            </div>
          </div>
          <SimpleLineChart data={performanceData[timeRange]} color="emerald" />
          <div className="text-sm text-slate-600">
            Average agent success rate over {timeRange}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Evidence Collection Chart
const EvidenceCollectionChart = () => {
  const [evidenceData] = useState([
    { platform: 'AWS', count: 247, trend: 12, color: 'orange' },
    { platform: 'GCP', count: 156, trend: 8, color: 'blue' },
    { platform: 'Azure', count: 203, trend: 15, color: 'blue' },
    { platform: 'GitHub', count: 89, trend: 5, color: 'purple' }
  ]);

  const totalEvidence = evidenceData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          Evidence Collection by Platform
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">{totalEvidence}</div>
            <div className="text-slate-600">Total Evidence Items</div>
          </div>
          
          <div className="space-y-4">
            {evidenceData.map((item) => (
              <div key={item.platform} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.platform}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{item.count}</span>
                    <div className="flex items-center gap-1 text-emerald-600 text-xs">
                      <ArrowUp className="h-3 w-3" />
                      +{item.trend}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`bg-€{item.color}-500 h-2 rounded-full transition-all duration-500`}
                    style={{ width: `€{(item.count / totalEvidence) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Trust Score Trend Chart
const TrustScoreTrend = () => {
  const trustScoreHistory = [88.5, 90.2, 92.1, 93.8, 94.5, 95.2, 96.1, 96.7];
  const timeLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-600" />
          Trust Score Evolution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-600">96.7%</div>
              <div className="text-slate-600 text-sm">Current Trust Score</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-emerald-600">
                <ArrowUp className="h-4 w-4" />
                <span className="font-medium">+8.2%</span>
              </div>
              <div className="text-slate-500 text-sm">vs last year</div>
            </div>
          </div>
          
          <SimpleLineChart data={trustScoreHistory} color="purple" />
          
          <div className="flex justify-between text-xs text-slate-500">
            {timeLabels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Compliance Progress Donut Chart (using CSS)
const ComplianceDonutChart = () => {
  const frameworks = [
    { name: 'SOC 2', progress: 98.4, color: 'emerald', size: 30 },
    { name: 'ISO 27001', progress: 94.7, color: 'blue', size: 25 },
    { name: 'GDPR', progress: 91.2, color: 'purple', size: 20 },
    { name: 'HIPAA', progress: 87.9, color: 'orange', size: 15 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-600" />
          Compliance Coverage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="relative w-48 h-48 mx-auto">
            {frameworks.map((framework, index) => {
              const circumference = 2 * Math.PI * (60 - index * 8);
              const strokeDasharray = circumference;
              const strokeDashoffset = circumference - (framework.progress / 100) * circumference;
              
              return (
                <svg key={framework.name} className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r={60 - index * 8}
                    stroke="rgb(226 232 240)"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r={60 - index * 8}
                    stroke={
                      framework.color === 'emerald' ? '#10b981' : 
                      framework.color === 'blue' ? '#3b82f6' : 
                      framework.color === 'purple' ? '#8b5cf6' : 
                      framework.color === 'orange' ? '#f97316' : '#10b981'
                    }
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
              );
            })}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">93.1%</div>
                <div className="text-slate-600 text-sm">Average</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {frameworks.map((framework) => (
              <div key={framework.name} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-€{framework.color}-500`}></div>
                <span className="text-sm font-medium">{framework.name}</span>
                <span className="text-sm text-slate-600 ml-auto">{framework.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Real-time Activity Feed
const ActivityFeed = () => {
  const [activities, setActivities] = useState([
    { id: 1, agent: 'AWS Collector', action: 'Collected 12 CloudTrail events', time: '2 min ago', type: 'success' },
    { id: 2, agent: 'Trust Engine', action: 'Updated trust score to 96.7%', time: '5 min ago', type: 'info' },
    { id: 3, agent: 'GCP Scanner', action: 'Validated 8 IAM policies', time: '8 min ago', type: 'success' },
    { id: 4, agent: 'Monitor', action: 'Detected configuration drift', time: '12 min ago', type: 'warning' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newActivity = {
          id: Date.now(),
          agent: ['AWS Collector', 'Trust Engine', 'GCP Scanner', 'Monitor'][Math.floor(Math.random() * 4)],
          action: ['Collected evidence', 'Updated scores', 'Validated controls', 'Detected changes'][Math.floor(Math.random() * 4)],
          time: 'Just now',
          type: ['success', 'info', 'warning'][Math.floor(Math.random() * 3)] as 'success' | 'info' | 'warning'
        };
        setActivities(prev => [newActivity, ...prev.slice(0, 6)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-emerald-600 bg-emerald-100';
      case 'warning': return 'text-amber-600 bg-amber-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Real-time Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 €{getActivityColor(activity.type).split(' ')[1]}`}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{activity.agent}</span>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
                <p className="text-sm text-slate-600">{activity.action}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Framework Manager Component
const FrameworkManager = () => {
  const frameworks = [
    { name: 'SOC 2', enabled: true, controls: 127, coverage: '98.4%' },
    { name: 'ISO 27001', enabled: true, controls: 114, coverage: '94.7%' },
    { name: 'GDPR', enabled: true, controls: 45, coverage: '91.2%' },
    { name: 'HIPAA', enabled: false, controls: 89, coverage: '0%' },
    { name: 'PCI DSS', enabled: false, controls: 67, coverage: '0%' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {frameworks.map((framework) => (
          <Card key={framework.name} className={framework.enabled ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{framework.name}</h3>
                <div className={`w-3 h-3 rounded-full €{framework.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Controls:</span>
                  <span className="font-medium">{framework.controls}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coverage:</span>
                  <span className="font-medium">{framework.coverage}</span>
                </div>
              </div>
              <Button 
                variant={framework.enabled ? "outline" : "default"} 
                size="sm" 
                className="w-full mt-4"
                onClick={() => {
                  if (framework.enabled) {
                    navigate('/velocity/frameworks');
                  } else {
                    navigate('/velocity/integrations');
                  }
                }}
              >
                {framework.enabled ? 'Configure' : 'Enable'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const UnifiedDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useUrlState('tab', 'overview', {
    storageKey: 'dashboard_tab'
  });
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Check authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/velocity/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/velocity')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg blur-sm opacity-50"></div>
                </div>
                <div>
                  <span className="text-xl font-bold text-slate-900 font-serif">Velocity</span>
                  <div className="text-xs text-slate-400 -mt-1">Dashboard</div>
                </div>
              </button>
              {user && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-700">
                    Welcome, {user.name}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/velocity')}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/velocity/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="evidence" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Evidence
            </TabsTrigger>
            <TabsTrigger value="frameworks" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Frameworks
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <TrustScoreCard />
            
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <AgentPerformanceChart />
              <EvidenceCollectionChart />
              <TrustScoreTrend />
            </div>
            
            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ComplianceDonutChart />
              <ComplianceStatus />
              <ActivityFeed />
            </div>
          </TabsContent>

          {/* AI Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <AgentGrid />
          </TabsContent>

          {/* Evidence Tab */}
          <TabsContent value="evidence" className="space-y-6">
            <EvidenceStream />
          </TabsContent>

          {/* Frameworks Tab */}
          <TabsContent value="frameworks" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Compliance Frameworks</h2>
              <p className="text-slate-600">Manage your compliance frameworks and monitor coverage</p>
            </div>
            <FrameworkManager />
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="text-center py-12">
              <Cloud className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Cloud Integrations</h3>
              <p className="text-slate-500 mb-6">Connect your cloud platforms for automated evidence collection</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {['AWS', 'Google Cloud', 'Microsoft Azure', 'GitHub'].map((platform) => (
                  <Button 
                    key={platform} 
                    variant="outline" 
                    className="h-16"
                    onClick={() => {
                      if (platform === 'AWS') navigate('/velocity/integrations');
                      else if (platform === 'Google Cloud') navigate('/velocity/integrations');
                      else if (platform === 'Microsoft Azure') navigate('/velocity/integrations');
                      else if (platform === 'GitHub') navigate('/velocity/integrations');
                    }}
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedDashboard;