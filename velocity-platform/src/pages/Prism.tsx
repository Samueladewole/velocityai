import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Skeleton, 
  SkeletonCard, 
  SkeletonMetric,
  SkeletonChart 
} from '@/components/ui/skeleton';
import { AccessibleButton } from '@/components/ui/accessible-button';
import { 
  Calculator as CalculatorIcon, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Target,
  DollarSign,
  Activity,
  Zap,
  Settings,
  Download,
  RefreshCw,
  AlertTriangle,
  Brain,
  Award,
  Lightbulb,
  ArrowRight,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import lightweight chart components directly (these are small)
import { XAxis, YAxis, CartesianGrid, Tooltip, Area, Bar } from 'recharts';

// Lazy load heavy chart components
const LazyLineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })));
const LazyAreaChart = lazy(() => import('recharts').then(module => ({ default: module.AreaChart })));
const LazyBarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })));
const LazyResponsiveContainer = lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })));

// Lazy load Monte Carlo component
const MonteCarloVisualization = lazy(() => import('@/components/prism/MonteCarloVisualization').then(module => ({ default: module.MonteCarloVisualization })));

interface RiskScenario {
  id: string;
  name: string;
  category: string;
  probability: number;
  impact: number;
  riskScore: number;
  expectedLoss: number;
  confidence: number;
  lastCalculated: string;
}

interface MonteCarloResult {
  scenario: string;
  p10: number;
  p50: number;
  p90: number;
  mean: number;
  stdDev: number;
}

const mockScenarios: RiskScenario[] = [
  {
    id: 'cyber-breach',
    name: 'Major Cyber Security Breach',
    category: 'Cybersecurity',
    probability: 15,
    impact: 8.5,
    riskScore: 85,
    expectedLoss: 2400000,
    confidence: 78,
    lastCalculated: '2025-07-20'
  },
  {
    id: 'compliance-fine',
    name: 'Regulatory Compliance Fine',
    category: 'Compliance',
    probability: 25,
    impact: 6.2,
    riskScore: 62,
    expectedLoss: 890000,
    confidence: 85,
    lastCalculated: '2025-07-19'
  },
  {
    id: 'business-disruption',
    name: 'Business Continuity Disruption',
    category: 'Operational',
    probability: 12,
    impact: 7.8,
    riskScore: 78,
    expectedLoss: 1600000,
    confidence: 72,
    lastCalculated: '2025-07-18'
  },
  {
    id: 'third-party-risk',
    name: 'Third Party Vendor Risk',
    category: 'Strategic',
    probability: 18,
    impact: 5.4,
    riskScore: 54,
    expectedLoss: 650000,
    confidence: 80,
    lastCalculated: '2025-07-17'
  }
];

const mockMonteCarloData = [
  { name: 'P10', value: 450000, color: '#10b981' },
  { name: 'P50', value: 1200000, color: '#f59e0b' },
  { name: 'P90', value: 3800000, color: '#ef4444' }
];

const riskTrendData = [
  { month: 'Jan', risk: 2.1, var: 1.8 },
  { month: 'Feb', risk: 2.3, var: 2.1 },
  { month: 'Mar', risk: 2.8, var: 2.4 },
  { month: 'Apr', risk: 2.5, var: 2.2 },
  { month: 'May', risk: 2.2, var: 1.9 },
  { month: 'Jun', risk: 2.4, var: 2.1 },
  { month: 'Jul', risk: 2.6, var: 2.3 }
];

export const Prism: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const [scenarios, setScenarios] = useState<RiskScenario[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Load data immediately (remove artificial delay)
      setScenarios(mockScenarios);
      setLoading(false);
      
      // Defer chart loading to improve initial page load
      setTimeout(() => setChartsLoaded(true), 100);
      
      // Preload heavy components in the background
      import('@/components/prism/MonteCarloVisualization').catch(() => {
        // Silently fail if component doesn't load
      });
    };

    loadData();
  }, []);

  const runMonteCarlo = async () => {
    setRunning(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setRunning(false);
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-700 bg-red-50 border-red-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    if (score >= 40) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-green-700 bg-green-50 border-green-200';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="space-y-4">
          <Skeleton variant="text" width="300px" height="32px" />
          <Skeleton variant="text" width="500px" height="20px" />
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg">
              <CardContent className="p-6">
                <SkeletonMetric />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonCard />
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardHeader>
              <Skeleton variant="text" width="60%" />
            </CardHeader>
            <CardContent>
              <SkeletonChart height={300} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalExpectedLoss = scenarios.reduce((sum, s) => sum + s.expectedLoss, 0);
  const avgRiskScore = Math.round(scenarios.reduce((sum, s) => sum + s.riskScore, 0) / scenarios.length);
  const highRiskScenarios = scenarios.filter(s => s.riskScore >= 70).length;

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600">
            <CalculatorIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              PRISM
            </h1>
            <p className="text-lg text-slate-600">
              Risk Quantification Engine
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <AccessibleButton 
            variant="outline" 
            className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            onClick={() => window.location.href = '/prism-demo'}
          >
            <Brain className="h-4 w-4" />
            Hubbard 5-Point Demo
          </AccessibleButton>
          <AccessibleButton variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </AccessibleButton>
          <AccessibleButton variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </AccessibleButton>
          <AccessibleButton 
            onClick={runMonteCarlo}
            loading={running}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Run Simulation
          </AccessibleButton>
        </div>
      </div>

      {/* Hubbard Methodology Banner */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Brain className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Upgrade to Hubbard Calibrated Risk Analysis
                </h3>
                <p className="text-blue-700 mb-3">
                  Transform your risk assessments from guesswork to precise quantitative analysis using 
                  Douglas Hubbard's scientifically-proven 5-point calibration methodology.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>90% accuracy improvement</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Eliminates overconfidence bias</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Board-ready precision</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <AccessibleButton 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.href = '/prism-demo'}
              >
                Try Hubbard Demo
                <ArrowRight className="h-4 w-4 ml-2" />
              </AccessibleButton>
              <AccessibleButton 
                variant="outline"
                className="border-blue-300 text-blue-700"
                onClick={() => {
                  const methodologySection = document.getElementById('hubbard-methodology')
                  methodologySection?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Learn More
              </AccessibleButton>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Legacy Results */}
      <Card className="border border-amber-200 bg-amber-50 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                These results use traditional estimation methods. For precise quantitative analysis, 
                use the Hubbard 5-point calibration system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Expected Loss (VaR)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {formatCurrency(totalExpectedLoss)}
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-red-700">
              <TrendingUp className="h-4 w-4" />
              <span>+12% vs last quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Average Risk Score
            </CardTitle>
            <Target className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">{avgRiskScore}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-amber-700">
              <span>Moderate risk level</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              High Risk Scenarios
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {highRiskScenarios}/{scenarios.length}
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-red-700">
              <span>Requires immediate attention</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Simulation Speed
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">3.4M</div>
            <div className="flex items-center gap-1 text-sm font-medium text-blue-700">
              <span>calculations/second</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Scenarios */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Risk Scenarios
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Quantified risk scenarios with Monte Carlo analysis
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="group p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{scenario.name}</h3>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {scenario.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>Probability: {scenario.probability}%</span>
                        <span>Impact: {scenario.impact}/10</span>
                        <span>Confidence: {scenario.confidence}%</span>
                      </div>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getRiskColor(scenario.riskScore)
                    )}>
                      Risk: {scenario.riskScore}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="text-lg font-bold text-slate-900">
                      Expected Loss: {formatCurrency(scenario.expectedLoss)}
                    </div>
                    <div className="text-xs text-slate-500">
                      Last calculated: {new Date(scenario.lastCalculated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Trend Chart */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Risk Trend Analysis
            </CardTitle>
            <CardDescription className="text-slate-600">
              7-month risk exposure and VaR progression
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px]">
              <Suspense fallback={<SkeletonChart />}>
                <LazyResponsiveContainer width="100%" height="100%">
                  <LazyAreaChart data={riskTrendData}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
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
                    dataKey="risk" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRisk)" 
                    name="Risk Score"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="var" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorVar)" 
                    name="VaR (M€)"
                  />
                  </LazyAreaChart>
                </LazyResponsiveContainer>
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monte Carlo Results */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <CalculatorIcon className="h-5 w-5 text-green-600" />
                Monte Carlo Simulation Results
              </CardTitle>
              <CardDescription className="text-slate-600">
                Statistical distribution of potential losses (1M iterations)
              </CardDescription>
            </div>
            <div className="text-sm text-slate-500">
              Last run: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              {mockMonteCarloData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-900">{item.name}</span>
                    <span className="text-sm text-slate-600">
                      ({item.name === 'P10' ? '10th' : item.name === 'P50' ? '50th' : '90th'} percentile)
                    </span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
              
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Confidence Interval (95%)</span>
                  <span className="font-medium">{formatCurrency(450000)} - {formatCurrency(3800000)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-600">Standard Deviation</span>
                  <span className="font-medium">{formatCurrency(890000)}</span>
                </div>
              </div>
            </div>
            
            <div className="h-[200px]">
              <Suspense fallback={<SkeletonChart />}>
                <LazyResponsiveContainer width="100%" height="100%">
                  <LazyBarChart data={mockMonteCarloData}>
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
                    formatter={(value: any) => [formatCurrency(value), 'Expected Loss']}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={4} />
                  </LazyBarChart>
                </LazyResponsiveContainer>
              </Suspense>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hubbard Methodology Explanation */}
      <div id="hubbard-methodology" className="mt-12 space-y-6">
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="text-center border-b border-slate-100">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-3">
              <Brain className="h-8 w-8 text-blue-600" />
              The Hubbard 5-Point Calibration Method
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 max-w-3xl mx-auto">
              Scientifically proven methodology for transforming subjective risk estimates 
              into precise quantitative analysis with measurable accuracy improvements.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Problem with Traditional Methods */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-900 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  Problem: Traditional Risk Assessment
                </h3>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <ul className="space-y-2 text-red-800">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span><strong>Overconfidence bias:</strong> People consistently underestimate uncertainty</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span><strong>Point estimates:</strong> "I think it's 15%" provides no uncertainty range</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span><strong>Subjective scales:</strong> "High/Medium/Low" has no mathematical meaning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span><strong>No calibration:</strong> No way to measure or improve accuracy over time</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Solution with Hubbard Method */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-900 flex items-center gap-2">
                  <Award className="h-6 w-6 text-green-600" />
                  Solution: Hubbard Calibration
                </h3>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <ul className="space-y-2 text-green-800">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span><strong>5-point ranges:</strong> P10, P30, P50, P70, P90 confidence intervals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span><strong>Calibration training:</strong> Practice with known answers to reduce bias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span><strong>Measurable accuracy:</strong> Track how often reality falls within your ranges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span><strong>Continuous improvement:</strong> Adjust estimation based on historical performance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                How the 5-Point Method Works
              </h3>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="grid grid-cols-5 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto font-bold">
                      P10
                    </div>
                    <p className="text-sm font-medium text-blue-900">90% confident it's higher</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto font-bold">
                      P30
                    </div>
                    <p className="text-sm font-medium text-blue-900">70% confident it's higher</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center mx-auto font-bold">
                      P50
                    </div>
                    <p className="text-sm font-medium text-blue-900">Most likely value (median)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto font-bold">
                      P70
                    </div>
                    <p className="text-sm font-medium text-blue-900">70% confident it's lower</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto font-bold">
                      P90
                    </div>
                    <p className="text-sm font-medium text-blue-900">90% confident it's lower</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded border border-blue-300">
                  <p className="text-sm text-blue-800 text-center">
                    <strong>Example:</strong> Instead of "I think there's a 15% chance of a data breach," 
                    you estimate: "P10: 5%, P30: 10%, P50: 15%, P70: 22%, P90: 35%" - providing a full probability distribution!
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits and Research */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Proven Results
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• <strong>90% improvement</strong> in estimation accuracy after training</li>
                  <li>• <strong>80% reduction</strong> in overconfidence bias</li>
                  <li>• <strong>Used by major corporations</strong> for critical decisions</li>
                  <li>• <strong>Peer-reviewed research</strong> in decision science journals</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Business Applications
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• <strong>Risk quantification:</strong> Convert qualitative risks to financial impact</li>
                  <li>• <strong>Investment decisions:</strong> Portfolio risk and return modeling</li>
                  <li>• <strong>Project estimation:</strong> More accurate cost and timeline predictions</li>
                  <li>• <strong>Regulatory compliance:</strong> Defensible risk assessments for auditors</li>
                </ul>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
              <h4 className="text-xl font-bold mb-2">Ready to Upgrade Your Risk Analysis?</h4>
              <p className="mb-4 opacity-90">
                Stop guessing and start measuring. Try the Hubbard calibration demo now.
              </p>
              <AccessibleButton 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                onClick={() => window.location.href = '/prism-demo'}
              >
                Launch Hubbard Demo
                <ArrowRight className="h-4 w-4 ml-2" />
              </AccessibleButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};