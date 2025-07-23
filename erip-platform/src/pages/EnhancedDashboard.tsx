import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Skeleton, 
  SkeletonCard, 
  SkeletonMetric, 
  SkeletonText, 
  SkeletonChart 
} from '@/components/ui/skeleton';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  DollarSign,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  Eye,
  BarChart3,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

// Types for our data structures
interface MetricCard {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

interface Activity {
  component: string;
  action: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
  id: string;
}

interface RiskData {
  name: string;
  current: number;
  threshold: number;
  status: 'safe' | 'warning' | 'critical';
}

interface ChartDataPoint {
  name: string;
  value: number;
  trend?: number;
}

// Mock data - this would come from the backend
const generateMockData = () => {
  const riskTrendData: ChartDataPoint[] = [
    { name: 'Jan', value: 65, trend: -5 },
    { name: 'Feb', value: 59, trend: -6 },
    { name: 'Mar', value: 80, trend: 21 },
    { name: 'Apr', value: 81, trend: 1 },
    { name: 'May', value: 78, trend: -3 },
    { name: 'Jun', value: 73, trend: -5 },
  ];

  const complianceData: ChartDataPoint[] = [
    { name: 'GDPR', value: 95 },
    { name: 'SOC2', value: 87 },
    { name: 'ISO27001', value: 92 },
    { name: 'NIST', value: 89 },
    { name: 'HIPAA', value: 96 },
  ];

  const pieChartData = [
    { name: 'Financial', value: 35, color: '#3b82f6' },
    { name: 'Operational', value: 40, color: '#f59e0b' },
    { name: 'Strategic', value: 15, color: '#10b981' },
    { name: 'Compliance', value: 10, color: '#ef4444' },
  ];

  return { riskTrendData, complianceData, pieChartData };
};

export const EnhancedDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [riskData, setRiskData] = useState<RiskData[]>([]);
  const [chartData, setChartData] = useState<any>({});
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Simulate API calls and loading states
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock API responses
      const mockMetrics: MetricCard[] = [
        {
          title: 'Risk Score',
          value: '73',
          change: '-12%',
          icon: <Shield className="h-4 w-4" />,
          trend: 'down'
        },
        {
          title: 'Compliance Rate',
          value: '94%',
          change: '+5%',
          icon: <CheckCircle className="h-4 w-4" />,
          trend: 'up'
        },
        {
          title: 'Active Risks',
          value: '24',
          change: '-3',
          icon: <AlertTriangle className="h-4 w-4" />,
          trend: 'down'
        },
        {
          title: 'ROI Generated',
          value: '$2.4M',
          change: '+18%',
          icon: <DollarSign className="h-4 w-4" />,
          trend: 'up'
        }
      ];

      const mockActivities: Activity[] = [
        {
          id: '1',
          component: 'COMPASS',
          action: 'New EU AI Act requirements identified',
          time: '2 hours ago',
          severity: 'medium'
        },
        {
          id: '2',
          component: 'ATLAS',
          action: 'Critical vulnerability detected in production',
          time: '4 hours ago',
          severity: 'high'
        },
        {
          id: '3',
          component: 'CLEARANCE',
          action: 'Risk appetite threshold exceeded for cloud migration',
          time: '6 hours ago',
          severity: 'high'
        },
        {
          id: '4',
          component: 'PRISM',
          action: 'Q1 risk quantification report completed',
          time: '1 day ago',
          severity: 'low'
        }
      ];

      const mockRiskData: RiskData[] = [
        { name: 'Financial Risk', current: 46, threshold: 100, status: 'safe' },
        { name: 'Operational Risk', current: 68, threshold: 100, status: 'warning' },
        { name: 'Compliance Risk', current: 94, threshold: 100, status: 'critical' },
      ];

      setMetrics(mockMetrics);
      setActivities(mockActivities);
      setRiskData(mockRiskData);
      setChartData(generateMockData());
      setLastUpdated(new Date());
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    // Trigger data refresh
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  const LoadingSkeleton: React.FC = () => (
    <div className="space-y-8 pb-8">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="space-y-4">
          <Skeleton variant="rectangular" width="300px" height="48px" className="bg-white/10" />
          <Skeleton variant="rectangular" width="500px" height="24px" className="bg-white/10" />
          <div className="flex gap-6">
            <Skeleton variant="rectangular" width="200px" height="20px" className="bg-white/10" />
            <Skeleton variant="rectangular" width="250px" height="20px" className="bg-white/10" />
          </div>
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg">
            <CardContent className="p-6">
              <SkeletonMetric />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activities Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Chart Section Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardHeader>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </CardHeader>
            <CardContent>
              <SkeletonChart height={200} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
                <p className="text-blue-100 text-lg">
                  Real-time risk intelligence and compliance overview
                </p>
              </div>
            </div>
            
            {/* Status and Refresh */}
            <div className="flex items-center gap-4">
              <button 
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-green-400" />
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-100">All systems operational</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-400" />
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="text-red-100">Offline mode</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-200" />
              <span className="text-blue-100">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">
                {metric.title}
              </CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-blue-50 group-hover:to-blue-100 group-hover:text-blue-600 transition-all duration-300">
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-slate-900 mb-2">{metric.value}</div>
              {metric.change && (
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-700' : 
                  metric.trend === 'down' ? 'text-red-700' : 
                  'text-slate-600'
                }`}>
                  {metric.trend === 'up' && <ArrowUpRight className="h-4 w-4" />}
                  {metric.trend === 'down' && <ArrowDownRight className="h-4 w-4" />}
                  <span>{metric.change}</span>
                  <span className="text-slate-500 font-normal">from last month</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activities and Risk Status Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Enhanced Recent Activities */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Recent Activities
                </CardTitle>
                <CardDescription className="text-slate-600">Latest updates across all components</CardDescription>
              </div>
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                <Eye className="h-4 w-4" />
                View all
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {activities.map((activity, index) => (
                <div key={activity.id} className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-slate-50/80 transition-all duration-200">
                  <div className="flex flex-col items-center mt-1">
                    <div className={`h-3 w-3 rounded-full ring-4 ring-white shadow-sm ${
                      activity.severity === 'high' ? 'bg-red-500' :
                      activity.severity === 'medium' ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`} />
                    {index < activities.length - 1 && (
                      <div className="w-px h-8 bg-slate-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-slate-900 leading-relaxed">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-700 mr-2">
                          {activity.component}
                        </span>
                        {activity.action}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Risk Appetite Status */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Risk Appetite Status
                </CardTitle>
                <CardDescription className="text-slate-600">Current risk levels vs. defined appetite</CardDescription>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                Within limits
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {riskData.map((risk) => (
                <div key={risk.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">{risk.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-slate-700">{risk.current}%</span>
                      <span className="text-xs text-slate-500">/</span>
                      <span className="text-sm font-mono text-slate-500">{risk.threshold}%</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full shadow-sm transition-all duration-1000 ${
                          risk.status === 'safe' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          risk.status === 'warning' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                          'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: `${risk.current}%` }}
                      />
                    </div>
                    <div className="absolute right-0 top-0 h-3 w-px bg-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Chart Visualizations */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Risk Trend Chart */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Risk Trend
            </CardTitle>
            <CardDescription>6-month risk score progression</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.riskTrendData}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRisk)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Scores */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Compliance Scores
            </CardTitle>
            <CardDescription>Current framework compliance levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.complianceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Risk Distribution
            </CardTitle>
            <CardDescription>Risk category breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.pieChartData?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {chartData.pieChartData?.map((entry: any, index: number) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-slate-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Zap className="h-5 w-5 text-amber-600" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-slate-600">Common tasks and workflows</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <button className="group relative overflow-hidden flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-slate-100 bg-gradient-to-br from-white to-slate-50/50 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                <FileText className="h-6 w-6" />
              </div>
              <span className="relative text-sm font-semibold text-slate-900 group-hover:text-blue-900">Generate Report</span>
            </button>
            
            <button className="group relative overflow-hidden flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-slate-100 bg-gradient-to-br from-white to-slate-50/50 hover:border-green-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-green-100 text-green-600 group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300">
                <Activity className="h-6 w-6" />
              </div>
              <span className="relative text-sm font-semibold text-slate-900 group-hover:text-green-900">Run Assessment</span>
            </button>
            
            <button className="group relative overflow-hidden flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-slate-100 bg-gradient-to-br from-white to-slate-50/50 hover:border-purple-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-300">
                <Users className="h-6 w-6" />
              </div>
              <span className="relative text-sm font-semibold text-slate-900 group-hover:text-purple-900">Expert Consult</span>
            </button>
            
            <button className="group relative overflow-hidden flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-slate-100 bg-gradient-to-br from-white to-slate-50/50 hover:border-amber-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 group-hover:from-amber-100 group-hover:to-amber-200 transition-all duration-300">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="relative text-sm font-semibold text-slate-900 group-hover:text-amber-900">View Trends</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};