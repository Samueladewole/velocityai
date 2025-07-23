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
import { 
  ComplianceTrendChart, 
  RiskHeatmapChart, 
  SecurityScoreRadialChart,
  FinancialImpactChart,
  ActivityStreamChart,
  RiskRadarChart,
  VulnerabilityTimelineChart
} from '@/components/charts/RiskCharts';
import { ChartExplanationButton, PageExplanations } from '@/components/charts/ChartExplanation';
import { chartExplanations, pageCorrelations } from '@/data/chartExplanations';

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

// Chart data
const complianceData = [
  { month: 'Jan', compliance: 82, target: 90 },
  { month: 'Feb', compliance: 85, target: 90 },
  { month: 'Mar', compliance: 87, target: 90 },
  { month: 'Apr', compliance: 89, target: 90 },
  { month: 'May', compliance: 91, target: 90 },
  { month: 'Jun', compliance: 94, target: 90 },
];

const riskHeatmapData = [
  { category: 'Financial', high: 3, medium: 5, low: 8 },
  { category: 'Operational', high: 2, medium: 7, low: 12 },
  { category: 'Compliance', high: 1, medium: 4, low: 15 },
  { category: 'Strategic', high: 4, medium: 6, low: 5 },
  { category: 'Cyber', high: 5, medium: 8, low: 3 },
];

const financialImpactData = [
  { month: 'Jan', prevented: 120000, potential: 450000 },
  { month: 'Feb', prevented: 180000, potential: 380000 },
  { month: 'Mar', prevented: 250000, potential: 320000 },
  { month: 'Apr', prevented: 320000, potential: 280000 },
  { month: 'May', prevented: 380000, potential: 250000 },
  { month: 'Jun', prevented: 420000, potential: 200000 },
];

const activityStreamData = [
  { time: '00:00', events: 12 },
  { time: '04:00', events: 8 },
  { time: '08:00', events: 25 },
  { time: '12:00', events: 45 },
  { time: '16:00', events: 38 },
  { time: '20:00', events: 22 },
  { time: '24:00', events: 15 },
];

const riskRadarData = [
  { risk: 'Financial', current: 73, target: 80 },
  { risk: 'Operational', current: 68, target: 75 },
  { risk: 'Compliance', current: 94, target: 90 },
  { risk: 'Strategic', current: 65, target: 70 },
  { risk: 'Cyber', current: 58, target: 85 },
  { risk: 'Reputational', current: 82, target: 80 },
];

const vulnerabilityData = [
  { date: 'Jan', found: 45, fixed: 38, openCount: 7 },
  { date: 'Feb', found: 52, fixed: 48, openCount: 11 },
  { date: 'Mar', found: 38, fixed: 42, openCount: 7 },
  { date: 'Apr', found: 41, fixed: 39, openCount: 9 },
  { date: 'May', found: 35, fixed: 37, openCount: 7 },
  { date: 'Jun', found: 28, fixed: 30, openCount: 5 },
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

export const DashboardEnhanced: React.FC = () => {
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

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Compliance Trend */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Compliance Trend
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Monthly compliance rate vs target
                </CardDescription>
              </div>
              <ChartExplanationButton chartId="compliance-trend" explanations={chartExplanations} />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ComplianceTrendChart data={complianceData} />
            <ChartExplanationButton chartId="compliance-trend" explanations={chartExplanations} variant="inline" />
          </CardContent>
        </Card>

        {/* Risk Heatmap */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Risk Distribution
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Risk levels by category
                </CardDescription>
              </div>
              <ChartExplanationButton chartId="risk-heatmap" explanations={chartExplanations} />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <RiskHeatmapChart data={riskHeatmapData} />
            <ChartExplanationButton chartId="risk-heatmap" explanations={chartExplanations} variant="inline" />
          </CardContent>
        </Card>
      </div>

      {/* Risk Radar and Security Score */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Risk Radar */}
        <Card className="col-span-2 border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Shield className="h-5 w-5 text-purple-600" />
              Risk Coverage Analysis
            </CardTitle>
            <CardDescription className="text-slate-600">
              Current risk scores vs target thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <RiskRadarChart data={riskRadarData} />
          </CardContent>
        </Card>

        {/* Security Score */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-center text-slate-900">
              Overall Security Score
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <SecurityScoreRadialChart score={73} />
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Previous Month</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Industry Average</span>
                <span className="font-medium">68%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Target Score</span>
                <span className="font-medium text-emerald-600">80%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Impact and Activity Stream */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Financial Impact */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Financial Impact Analysis
            </CardTitle>
            <CardDescription className="text-slate-600">
              Prevented vs potential losses
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <FinancialImpactChart data={financialImpactData} />
          </CardContent>
        </Card>

        {/* Vulnerability Timeline */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Activity className="h-5 w-5 text-orange-600" />
              Vulnerability Management
            </CardTitle>
            <CardDescription className="text-slate-600">
              Found vs fixed vulnerabilities over time
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <VulnerabilityTimelineChart data={vulnerabilityData} />
          </CardContent>
        </Card>
      </div>

      {/* Activity Stream */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Activity className="h-5 w-5 text-purple-600" />
            Platform Activity Stream
          </CardTitle>
          <CardDescription className="text-slate-600">
            Real-time event monitoring across all components
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ActivityStreamChart data={activityStreamData} />
        </CardContent>
      </Card>

      {/* Page-Level Analytics Overview */}
      <PageExplanations
        title="Executive Dashboard"
        overview="Comprehensive risk intelligence combining real-time monitoring, compliance tracking, and financial impact analysis across all ERIP components"
        charts={['compliance-trend', 'risk-heatmap', 'security-score', 'financial-impact', 'risk-radar', 'vulnerability-timeline', 'activity-stream']}
        explanations={chartExplanations}
        componentFocus="This dashboard integrates data from all 8 ERIP components to provide executives with actionable insights for strategic risk decision-making. Charts show correlations between compliance performance, security posture, and financial impact."
        correlations={pageCorrelations.dashboard}
      />

      {/* Recent Activities */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Clock className="h-5 w-5 text-blue-600" />
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
    </div>
  );
};