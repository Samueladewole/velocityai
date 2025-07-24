import React from 'react';
import { ExecutiveSummary } from '@/components/dashboard/ExecutiveSummary';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ComponentGrid } from '@/components/dashboard/ComponentGrid';
import { IntelligenceInsights } from '@/components/dashboard/IntelligenceInsights';
import { ActivityStream } from '@/components/dashboard/ActivityStream';
import { OnboardingFlow } from '@/components/tour/OnboardingFlow';
import { TourTrigger } from '@/components/tour/TourTrigger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  LineChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Sample data for charts
const trustScoreTrend = [
  { month: 'Jan', score: 45 },
  { month: 'Feb', score: 52 },
  { month: 'Mar', score: 58 },
  { month: 'Apr', score: 65 },
  { month: 'May', score: 71 },
  { month: 'Jun', score: 78 }
];

const complianceData = [
  { framework: 'ISO 27001', completion: 94, target: 100 },
  { framework: 'SOC 2', completion: 87, target: 100 },
  { framework: 'GDPR', completion: 92, target: 100 },
  { framework: 'HIPAA', completion: 78, target: 100 },
  { framework: 'NIS2', completion: 65, target: 100 }
];

const riskDistribution = [
  { name: 'Low', value: 45, color: '#10b981' },
  { name: 'Medium', value: 30, color: '#f59e0b' },
  { name: 'High', value: 20, color: '#ef4444' },
  { name: 'Critical', value: 5, color: '#991b1b' }
];

const salesImpact = [
  { month: 'Jan', pipeline: 1.2, closed: 0.8 },
  { month: 'Feb', pipeline: 1.5, closed: 1.1 },
  { month: 'Mar', pipeline: 2.1, closed: 1.4 },
  { month: 'Apr', pipeline: 2.8, closed: 1.9 },
  { month: 'May', pipeline: 3.5, closed: 2.4 },
  { month: 'Jun', pipeline: 4.2, closed: 3.1 }
];

// Executive summary data
const executiveSummaryData = {
  trustScore: {
    current: 78,
    trend: 'up' as const,
    percentile: 'Top 5% in your industry',
    tier: 'Gold' as const,
    change: 7
  },
  keyMetrics: [
    {
      label: 'Risk Exposure',
      value: '€2.3M',
      change: '-€450K',
      period: 'vs last month',
      color: 'green'
    },
    {
      label: 'Compliance Coverage',
      value: '94%',
      change: '+5%',
      period: '7/8 frameworks',
      color: 'blue'
    },
    {
      label: 'Sales Impact',
      value: '3 deals',
      change: '+40%',
      period: '€1.2M pipeline',
      color: 'purple'
    },
    {
      label: 'ROI',
      value: '269%',
      change: '+18%',
      period: '€890K savings',
      color: 'amber'
    }
  ],
  alerts: {
    critical: 2,
    warnings: 5,
    opportunities: 8
  }
};

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <OnboardingFlow page="dashboard" />
      <div className="max-w-[1600px] mx-auto p-6 space-y-8">
        {/* Executive Summary */}
        <div data-tour="dashboard-header">
          <ExecutiveSummary {...executiveSummaryData} />
        </div>

        {/* Quick Actions */}
        <div data-tour="quick-actions">
          <QuickActions />
        </div>

        {/* Business Impact Metrics */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Risk Reduction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">€2.3M</span>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm font-medium">18%</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">Quantified risk exposure reduced</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Compliance Speed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">7.2x</span>
                <div className="flex items-center gap-1 text-blue-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">faster</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">vs manual processes</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Deal Acceleration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">40%</span>
                <div className="flex items-center gap-1 text-purple-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">faster</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">Sales cycle reduction</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Time Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">1,240</span>
                <div className="flex items-center gap-1 text-amber-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">hours</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">This quarter alone</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Visualizations */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Trust Score Trend */}
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <LineChart className="h-5 w-5 text-blue-600" />
                Trust Score Evolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trustScoreTrend}>
                  <defs>
                    <linearGradient id="trustGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#trustGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sales Impact */}
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <DollarSign className="h-5 w-5 text-green-600" />
                Sales Impact Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesImpact}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="pipeline" fill="#8b5cf6" name="Pipeline (€M)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="closed" fill="#10b981" name="Closed (€M)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Component Grid */}
        <div data-tour="component-grid">
          <ComponentGrid />
        </div>

        {/* Intelligence Insights */}
        <div data-tour="insights-panel">
          <IntelligenceInsights />
        </div>

        {/* Activity Stream and Additional Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityStream />
          </div>

          <div className="space-y-6">
            {/* Risk Distribution */}
            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                  <Target className="h-5 w-5 text-red-600" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {riskDistribution.map((risk) => (
                    <div key={risk.name} className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded"
                        style={{ backgroundColor: risk.color }}
                      />
                      <span className="text-xs text-slate-600">{risk.name}: {risk.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  Compliance Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceData.map((framework) => (
                    <div key={framework.framework} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{framework.framework}</span>
                        <span className="text-sm font-bold text-slate-900">{framework.completion}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            framework.completion >= 90 ? 'bg-green-500' :
                            framework.completion >= 70 ? 'bg-blue-500' :
                            'bg-amber-500'
                          }`}
                          style={{ width: `${framework.completion}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};