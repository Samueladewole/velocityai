import React from 'react';
import { ExecutiveSummary } from '@/components/dashboard/ExecutiveSummary';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ComponentGrid } from '@/components/dashboard/ComponentGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
// import VideoPlayer from '@/components/video/VideoPlayer'; // Temporarily disabled
import { 
  Shield,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Activity,
  Globe,
  Zap
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarGrid
} from 'recharts';

// Trust Score progression
const trustScoreTrend = [
  { month: 'Jan', score: 45, target: 50 },
  { month: 'Feb', score: 52, target: 55 },
  { month: 'Mar', score: 58, target: 60 },
  { month: 'Apr', score: 65, target: 65 },
  { month: 'May', score: 71, target: 70 },
  { month: 'Jun', score: 78, target: 75 },
  { month: 'Jul', score: 84, target: 80 }
];

// Business value metrics
const businessValue = [
  { metric: 'Risk Reduction', value: 2300000, change: -450000, trend: 'down', color: '#10b981' },
  { metric: 'Sales Acceleration', value: 4200000, change: 1200000, trend: 'up', color: '#8b5cf6' },
  { metric: 'Compliance Savings', value: 890000, change: 120000, trend: 'up', color: '#3b82f6' },
  { metric: 'Time Saved', value: 1240, change: 180, trend: 'up', color: '#f59e0b', unit: 'hours' }
];

// Executive summary data
const executiveSummaryData = {
  trustScore: {
    current: 84,
    trend: 'up' as const,
    percentile: 'Top 5% in Financial Services',
    tier: 'Platinum' as const,
    change: 6
  },
  keyMetrics: [
    {
      label: 'Total Value Created',
      value: '€7.4M',
      change: '+€1.8M',
      period: 'YTD',
      color: 'green'
    },
    {
      label: 'Risk Exposure',
      value: '€450K',
      change: '-€1.85M',
      period: 'from €2.3M',
      color: 'blue'
    },
    {
      label: 'ROI',
      value: '340%',
      change: '+60%',
      period: 'above target',
      color: 'purple'
    },
    {
      label: 'Compliance',
      value: '98%',
      change: '+3',
      period: 'frameworks automated',
      color: 'amber'
    }
  ],
  alerts: {
    critical: 0,
    warnings: 2,
    opportunities: 5
  }
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <div className="max-w-[1600px] mx-auto p-6 space-y-8">
        {/* Executive Summary */}
        <ExecutiveSummary {...executiveSummaryData} />

        {/* Dashboard Demo Video - Temporarily disabled for improvements
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Dashboard Walkthrough
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VideoPlayer 
              videoType="dashboard-demo"
              title="Velocity Dashboard - Your Command Center for Compliance Automation"
              showDownload={true}
              controls={true}
              style={{
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            />
          </CardContent>
        </Card> */}

        {/* Quick Actions - Primary CTAs */}
        <QuickActions />

        {/* Key Business Metrics */}
        <div className="grid gap-6 lg:grid-cols-4">
          {businessValue.map((metric, index) => (
            <Card key={index} className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">{metric.metric}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">
                    {metric.unit === 'hours' 
                      ? metric.value.toLocaleString()
                      : `€€{(metric.value / 1000000).toFixed(1)}M`
                    }
                  </span>
                  {metric.unit === 'hours' && <span className="text-sm text-slate-600">hrs</span>}
                  <div className={`flex items-center gap-1 €{metric.trend === 'up' ? 'text-green-600' : 'text-blue-600'}`}>
                    {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="text-sm font-medium">
                      {metric.unit === 'hours' 
                        ? `€{metric.change > 0 ? '+' : ''}€{metric.change}`
                        : `€{metric.change > 0 ? '+' : ''}€€{Math.abs(metric.change / 1000000).toFixed(1)}M`
                      }
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  {metric.metric === 'Risk Reduction' && 'Quantified risk exposure reduced'}
                  {metric.metric === 'Sales Acceleration' && 'Revenue from faster deals'}
                  {metric.metric === 'Compliance Savings' && 'Automation cost savings'}
                  {metric.metric === 'Time Saved' && 'This quarter alone'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Score Trend & High Value Insights */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Trust Score Evolution */}
          <Card className="lg:col-span-2 border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Trust Score Evolution
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/trust-score')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  View Details
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trustScoreTrend}>
                  <defs>
                    <linearGradient id="trustGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" domain={[40, 90]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Target"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#trustGradient)"
                    name="Trust Score" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* High Priority Actions */}
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Zap className="h-5 w-5 text-amber-600" />
                High Value Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">Share Trust Score</p>
                    <p className="text-xs text-green-700 mt-1">3 active RFPs could benefit</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-green-700 hover:text-green-800">
                    Action
                  </Button>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Complete DTEF</p>
                    <p className="text-xs text-blue-700 mt-1">+50 Trust Score points</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-blue-700 hover:text-blue-800">
                    Start
                  </Button>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900">2 Suppliers Need Review</p>
                    <p className="text-xs text-amber-700 mt-1">€1.2M risk exposure</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-amber-700 hover:text-amber-800">
                    Review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ERIP Components Overview */}
        <ComponentGrid />

        {/* Value Demonstration */}
        <Card className="border-0 bg-gradient-to-br from-blue-600 to-purple-700 shadow-xl text-white">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Your Trust Equity™ is Working</h2>
                <p className="text-blue-100 mb-6">
                  ERIP has transformed your security operations into a strategic business advantage. 
                  Your Trust Score of 84 puts you in the top 5% of your industry.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-3xl font-bold">€7.4M</div>
                    <p className="text-sm text-blue-200">Total value created</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">340%</div>
                    <p className="text-sm text-blue-200">Return on investment</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-blue-50"
                    onClick={() => navigate('/trust-score-share')}
                  >
                    Share Trust Score
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-white border-white hover:bg-white/10"
                    onClick={() => navigate('/tools/beacon')}
                  >
                    View Full Report
                  </Button>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
                  <Award className="h-48 w-48 text-white/90 relative" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};