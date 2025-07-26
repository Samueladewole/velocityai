import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { FeaturePageTemplate } from '@/components/templates/PageTemplate';
import { Grid, Stack, ButtonGroup, CardGrid } from '@/components/ui/layout';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Calculator,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Play,
  BarChart3,
  Target,
  Zap,
  Euro,
  Clock,
  Users,
  Building2,
  Shield,
  Eye,
  Download
} from 'lucide-react';
import {
  LineChart,
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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Financial impact data
const riskExposureData = [
  { month: 'Jan', current: 4200000, optimized: 1100000 },
  { month: 'Feb', current: 4350000, optimized: 1050000 },
  { month: 'Mar', current: 4180000, optimized: 980000 },
  { month: 'Apr', current: 4620000, optimized: 920000 },
  { month: 'May', current: 4890000, optimized: 850000 },
  { month: 'Jun', current: 5100000, optimized: 780000 }
];

const riskCategories = [
  { name: 'Data Breaches', value: 2100000, color: '#ef4444', likelihood: 0.12 },
  { name: 'Compliance Fines', value: 890000, color: '#f59e0b', likelihood: 0.08 },
  { name: 'Business Disruption', value: 1350000, color: '#8b5cf6', likelihood: 0.15 },
  { name: 'Reputation Loss', value: 760000, color: '#06b6d4', likelihood: 0.06 }
];

const scenarioData = [
  { scenario: 'Best Case', probability: 15, cost: 450000, description: 'Minor incidents only' },
  { scenario: 'Likely', probability: 60, cost: 1800000, description: 'Typical risk materialization' },
  { scenario: 'Worst Case', probability: 25, cost: 5100000, description: 'Major breach + compliance fines' }
];

const roiMetrics = [
  { metric: 'Current Annual Risk', value: '€5.1M', trend: 'up', color: 'text-red-600' },
  { metric: 'With ERIP', value: '€780K', trend: 'down', color: 'text-green-600' },
  { metric: 'Annual Savings', value: '€4.3M', trend: 'up', color: 'text-blue-600' },
  { metric: 'ROI', value: '487%', trend: 'up', color: 'text-purple-600' }
];

export const PRISM: React.FC = () => {
  const navigate = useNavigate();
  const [currentRisk, setCurrentRisk] = useState(0);
  const [optimizedRisk, setOptimizedRisk] = useState(0);
  const [savings, setSavings] = useState(0);

  // Animated counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      const progress = step / steps;
      setCurrentRisk(Math.floor(5100000 * progress));
      setOptimizedRisk(Math.floor(780000 * progress));
      setSavings(Math.floor(4320000 * progress));
      
      step++;
      if (step > steps) {
        clearInterval(timer);
      }
    }, increment);

    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    }
    return `€${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      {/* Shock Value Hero */}
      <section className="relative py-20 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <AlertTriangle className="h-8 w-8 text-yellow-300" />
          </div>
          
          <h1 className="text-6xl font-bold mb-6">
            Your Security Risks Cost
            <div className="text-8xl text-yellow-300 mt-4">
              {formatCurrency(currentRisk)}
            </div>
            <div className="text-3xl font-normal mt-2">every year</div>
          </h1>
          
          <p className="text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            Most companies have no idea how much their security risks actually cost them. 
            PRISM™ shows you the exact financial impact and how to reduce it by 85%.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-red-300">73%</div>
              <div className="text-sm">of companies can't quantify their cyber risk</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-300">€4.3M</div>
              <div className="text-sm">average cost of major incidents</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-300">85%</div>
              <div className="text-sm">risk reduction with ERIP</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              PRISM™ Risk Quantification Engine
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              The only platform that converts your security risks into precise financial impact, 
              then shows you exactly how to reduce them for maximum ROI.
            </p>
          </div>

          {/* ROI Metrics */}
          <div className="grid gap-6 md:grid-cols-4 mb-16">
            {roiMetrics.map((metric, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className={`text-4xl font-bold mb-2 ${metric.color}`}>
                    {metric.value}
                  </div>
                  <div className="text-sm text-slate-600 mb-2">{metric.metric}</div>
                  <div className="flex items-center justify-center gap-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className={`h-4 w-4 ${metric.color}`} />
                    ) : (
                      <TrendingDown className={`h-4 w-4 ${metric.color}`} />
                    )}
                    <span className="text-xs text-slate-500">vs current state</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Before/After Visualization */}
          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Your Current Risk Exposure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-red-600 mb-4">
                  {formatCurrency(currentRisk)}
                </div>
                <p className="text-red-700 mb-4">
                  Hidden risks across your entire organization that could materialize at any time.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <span className="text-sm text-red-700">No quantified risk assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <span className="text-sm text-red-700">Reactive security approach</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <span className="text-sm text-red-700">Unknown financial exposure</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  With PRISM Risk Quantification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-green-600 mb-4">
                  {formatCurrency(optimizedRisk)}
                </div>
                <p className="text-green-700 mb-4">
                  Precisely quantified and actively managed risk exposure with clear financial impact.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm text-green-700">Monte Carlo risk modeling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm text-green-700">Proactive risk mitigation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm text-green-700">Clear ROI on security spend</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Risk Breakdown Analysis */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Where Your €{(currentRisk/1000000).toFixed(1)}M Risk Comes From
            </h2>
            <p className="text-lg text-slate-700">
              PRISM's Monte Carlo analysis breaks down your exact risk exposure by category
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Risk Categories Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {riskCategories.map((risk) => (
                    <div key={risk.name} className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded"
                        style={{ backgroundColor: risk.color }}
                      />
                      <div>
                        <div className="text-sm font-medium">{risk.name}</div>
                        <div className="text-xs text-slate-500">{formatCurrency(risk.value)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scenario Analysis */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Risk Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scenarioData.map((scenario, index) => (
                    <div key={index} className="p-4 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-slate-900">{scenario.scenario}</div>
                        <Badge variant={scenario.scenario === 'Worst Case' ? 'destructive' : 
                                     scenario.scenario === 'Likely' ? 'default' : 'secondary'}>
                          {scenario.probability}% probability
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {formatCurrency(scenario.cost)}
                      </div>
                      <div className="text-sm text-slate-600">{scenario.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Risk Reduction Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Your Risk Reduction Journey
            </h2>
            <p className="text-lg text-slate-700">
              See exactly how PRISM reduces your financial exposure month by month
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={riskExposureData}>
                  <defs>
                    <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="optimizedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis 
                    className="text-xs" 
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#ef4444" 
                    fillOpacity={1} 
                    fill="url(#currentGradient)"
                    name="Current Risk"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="optimized" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#optimizedGradient)"
                    name="With PRISM"
                  />
                </AreaChart>
              </ResponsiveContainer>
              
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm text-slate-600">Current Risk Exposure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm text-slate-600">With PRISM Optimization</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Demo CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Calculator className="h-8 w-8" />
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            Ready to Quantify Your Risk?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get your personalized risk assessment in under 5 minutes. 
            See exactly how much your current approach is costing you.
          </p>
          
          <div className="text-center">
            <div className="text-6xl font-bold text-yellow-300 mb-2">
              {formatCurrency(savings)}
            </div>
            <div className="text-lg mb-8">potential annual savings identified</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => navigate('/assessment')}
              className="bg-white text-blue-700 hover:bg-slate-100"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Risk Assessment
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
              onClick={() => navigate('/demo')}
            >
              <Eye className="h-5 w-5 mr-2" />
              See Live Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Trusted by Risk Leaders
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">€3.2M</div>
                <div className="text-sm text-slate-600 mb-4">Risk reduction in 6 months</div>
                <blockquote className="text-sm italic text-slate-700">
                  "PRISM showed us risks worth €3.2M that we never knew existed. 
                  The ROI was immediate."
                </blockquote>
                <div className="text-xs text-slate-500 mt-2">— CISO, Global FinTech</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">487%</div>
                <div className="text-sm text-slate-600 mb-4">ROI in first year</div>
                <blockquote className="text-sm italic text-slate-700">
                  "Finally, a security platform that speaks CFO language. 
                  Every investment decision is now data-driven."
                </blockquote>
                <div className="text-xs text-slate-500 mt-2">— CFO, Healthcare Corp</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
                <div className="text-sm text-slate-600 mb-4">Faster board approvals</div>
                <blockquote className="text-sm italic text-slate-700">
                  "Board meetings transformed overnight. Clear financial impact 
                  makes every security discussion productive."
                </blockquote>
                <div className="text-xs text-slate-500 mt-2">— CRO, Tech Unicorn</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};