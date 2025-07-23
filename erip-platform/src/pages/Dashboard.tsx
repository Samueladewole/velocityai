import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  BarChart3
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

const metrics: MetricCard[] = [
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

const recentActivities = [
  {
    component: 'COMPASS',
    action: 'New EU AI Act requirements identified',
    time: '2 hours ago',
    severity: 'medium'
  },
  {
    component: 'ATLAS',
    action: 'Critical vulnerability detected in production',
    time: '4 hours ago',
    severity: 'high'
  },
  {
    component: 'CLEARANCE',
    action: 'Risk appetite threshold exceeded for cloud migration',
    time: '6 hours ago',
    severity: 'high'
  },
  {
    component: 'PRISM',
    action: 'Q1 risk quantification report completed',
    time: '1 day ago',
    severity: 'low'
  }
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
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
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-100">All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-200" />
              <span className="text-blue-100">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Metrics Grid */}
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
              {recentActivities.map((activity, index) => (
                <div key={index} className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-slate-50/80 transition-all duration-200">
                  <div className="flex flex-col items-center mt-1">
                    <div className={`h-3 w-3 rounded-full ring-4 ring-white shadow-sm ${
                      activity.severity === 'high' ? 'bg-red-500' :
                      activity.severity === 'medium' ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`} />
                    {index < recentActivities.length - 1 && (
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Financial Risk</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-700">$2.3M</span>
                    <span className="text-xs text-slate-500">/</span>
                    <span className="text-sm font-mono text-slate-500">$5M</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-1000" style={{ width: '46%' }} />
                  </div>
                  <div className="absolute right-0 top-0 h-3 w-px bg-slate-300" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Operational Risk</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-700">68</span>
                    <span className="text-xs text-slate-500">/</span>
                    <span className="text-sm font-mono text-slate-500">100</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full shadow-sm transition-all duration-1000" style={{ width: '68%' }} />
                  </div>
                  <div className="absolute right-0 top-0 h-3 w-px bg-slate-300" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Compliance Risk</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-700">94</span>
                    <span className="text-xs text-slate-500">/</span>
                    <span className="text-sm font-mono text-slate-500">100</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full shadow-sm transition-all duration-1000" style={{ width: '94%' }} />
                  </div>
                  <div className="absolute right-0 top-0 h-3 w-px bg-slate-300" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Quick Actions */}
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