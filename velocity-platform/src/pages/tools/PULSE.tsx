import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Activity,
  TrendingDown,
  Euro,
  Shield,
  ArrowRight,
  Play,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  BarChart3,
  Target,
  Zap,
  Bell,
  Building2,
  Award,
  Lightbulb,
  Search,
  Radar,
  Cpu
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
  ComposedChart
} from 'recharts';

// Business-critical control monitoring data
const criticalControls = [
  {
    control: 'Identity & Access Management',
    businessImpact: 'Revenue Access',
    maxLoss: 8500000,
    monitoringPoints: 2847,
    alertReduction: '93%',
    priority: 'Critical',
    color: '#dc2626'
  },
  {
    control: 'Data Loss Prevention',
    businessImpact: 'Customer Data',
    maxLoss: 4200000,
    monitoringPoints: 1923,
    alertReduction: '89%',
    priority: 'Critical',
    color: '#ea580c'
  },
  {
    control: 'Network Segmentation',
    businessImpact: 'Business Continuity',
    maxLoss: 3100000,
    monitoringPoints: 1456,
    alertReduction: '87%',
    priority: 'High',
    color: '#d97706'
  },
  {
    control: 'Backup & Recovery',
    businessImpact: 'Operational Resilience',
    maxLoss: 2800000,
    monitoringPoints: 1234,
    alertReduction: '91%',
    priority: 'High',
    color: '#ca8a04'
  },
  {
    control: 'Endpoint Detection',
    businessImpact: 'Threat Prevention',
    maxLoss: 1900000,
    monitoringPoints: 987,
    alertReduction: '85%',
    priority: 'Medium',
    color: '#65a30d'
  }
];

// Real-time financial risk updates
const riskTrends = [
  { time: '00:00', exposure: 8500000, incidents: 12, alerts: 2847 },
  { time: '04:00', exposure: 7200000, incidents: 8, alerts: 1923 },
  { time: '08:00', exposure: 5800000, incidents: 15, alerts: 2156 },
  { time: '12:00', exposure: 4200000, incidents: 6, alerts: 987 },
  { time: '16:00', exposure: 3100000, incidents: 9, alerts: 1456 },
  { time: '20:00', exposure: 2800000, incidents: 4, alerts: 734 }
];

// Alert prioritization comparison
const alertComparison = [
  { category: 'Critical Business Impact', traditional: 2847, pulse: 198, reduction: 93 },
  { category: 'High Revenue Risk', traditional: 1923, pulse: 142, reduction: 93 },
  { category: 'Medium Operational Risk', traditional: 1456, pulse: 87, reduction: 94 },
  { category: 'Low Impact Noise', traditional: 8934, pulse: 23, reduction: 99 },
  { category: 'False Positives', traditional: 5672, pulse: 12, reduction: 99 }
];

// Investigation time reduction
const investigationMetrics = [
  { month: 'Jan', traditional: 480, pulse: 45, saved: 435 },
  { month: 'Feb', traditional: 520, pulse: 42, saved: 478 },
  { month: 'Mar', traditional: 495, pulse: 38, saved: 457 },
  { month: 'Apr', traditional: 510, pulse: 35, saved: 475 },
  { month: 'May', traditional: 485, pulse: 32, saved: 453 },
  { month: 'Jun', traditional: 465, pulse: 28, saved: 437 }
];

const pulseAdvantages = [
  {
    advantage: 'Monitor Business-Critical Controls Only',
    description: 'Focus monitoring on controls that protect against €1M+ business losses',
    icon: Target,
    value: '€1.5M+',
    metric: 'Average cost reduction per year'
  },
  {
    advantage: 'Real-time Financial Risk Updates',
    description: 'See your financial risk exposure change in real-time as threats emerge',
    icon: Euro,
    value: '15 mins',
    metric: 'Average risk update frequency'
  },
  {
    advantage: 'Intelligent Alert Prioritization',
    description: 'AI eliminates 99% of noise alerts, shows only business-impacting events',
    icon: Zap,
    value: '93%',
    metric: 'Alert volume reduction'
  },
  {
    advantage: 'Reduce Investigation Time by 80%+',
    description: 'Automated context and financial impact assessment for every alert',
    icon: Clock,
    value: '80%+',
    metric: 'Investigation time saved'
  }
];

const customerSuccess = [
  {
    company: 'TechUnicorn Scale',
    industry: 'SaaS Platform',
    challenge: 'Managing 12,000+ daily security alerts',
    before: { alerts: 12000, investigations: 480, cost: '€2.1M' },
    after: { alerts: 187, investigations: 28, cost: '€320K' },
    improvement: '98%',
    savings: '€1.78M',
    timeframe: '4 months',
    quote: 'PULSE eliminated alert fatigue. Our team now focuses on threats that actually matter to revenue.',
    incidentReduction: 89
  },
  {
    company: 'European Manufacturing',
    industry: 'Industrial IoT',
    challenge: 'OT/IT convergence security monitoring',
    before: { alerts: 8500, investigations: 320, cost: '€1.6M' },
    after: { alerts: 142, investigations: 22, cost: '€280K' },
    improvement: '98%',
    savings: '€1.32M',
    timeframe: '6 months',
    quote: 'PULSE helped us monitor what matters: controls that keep our production lines running.',
    incidentReduction: 94
  },
  {
    company: 'Global FinServ Corp',
    industry: 'Banking & Finance',
    challenge: 'Regulatory compliance monitoring',
    before: { alerts: 15000, investigations: 720, cost: '€2.8M' },
    after: { alerts: 234, investigations: 38, cost: '€420K' },
    improvement: '98%',
    savings: '€2.38M',
    timeframe: '5 months',
    quote: 'PULSE shows us exactly which controls protect our €50B in managed assets.',
    incidentReduction: 91
  }
];

// Real-time monitoring capabilities
const monitoringCapabilities = [
  {
    capability: 'Financial Risk Exposure',
    description: 'Live calculation of potential business losses',
    updateFrequency: 'Real-time',
    businessValue: 'Risk-based decision making'
  },
  {
    capability: 'Control Effectiveness',
    description: 'Continuous monitoring of security control performance',
    updateFrequency: 'Every 5 minutes',
    businessValue: 'Proactive threat prevention'
  },
  {
    capability: 'Incident Cost Projection',
    description: 'AI predicts potential incident costs based on current threats',
    updateFrequency: 'Every 15 minutes',
    businessValue: 'Budget planning & prioritization'
  },
  {
    capability: 'Compliance Drift Detection',
    description: 'Automated detection of compliance deviations',
    updateFrequency: 'Continuous',
    businessValue: 'Avoid regulatory penalties'
  }
];

export const PULSE: React.FC = () => {
  const navigate = useNavigate();
  const [costReduction, setCostReduction] = useState(0);
  const [alertReduction, setAlertReduction] = useState(0);
  const [roiPercent, setRoiPercent] = useState(0);

  // Animated counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      const progress = step / steps;
      setCostReduction(Math.floor(1500000 * progress)); // Up to €1.5M
      setAlertReduction(Math.floor(93 * progress)); // Up to 93%
      setRoiPercent(Math.floor(180 * progress)); // Up to 180%
      
      step++;
      if (step > steps) {
        clearInterval(timer);
      }
    }, increment);

    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€€{(amount / 1000000).toFixed(1)}M`;
    }
    return `€€{(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      {/* Real-time Monitoring Hero */}
      <section className="relative py-20 bg-gradient-to-r from-red-600 via-orange-600 to-pink-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Activity className="h-8 w-8 text-red-300" />
          </div>
          
          <h1 className="text-6xl font-bold mb-6">
            Stop Alert Fatigue
            <div className="text-8xl text-yellow-300 mt-4">
              Monitor €€€ Risks
            </div>
          </h1>
          
          <p className="text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            PULSE™ eliminates 93% of security alerts. Monitor only controls that 
            protect against business-critical €1M+ incidents.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-6xl font-bold text-red-300 mb-2">{formatCurrency(costReduction)}</div>
              <div className="text-lg">Annual Cost Reduction</div>
              <div className="text-sm opacity-75">focus on business-critical threats</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-orange-300 mb-2">{alertReduction}%</div>
              <div className="text-lg">Fewer Alerts</div>
              <div className="text-sm opacity-75">eliminate security noise</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-pink-300 mb-2">{roiPercent}%</div>
              <div className="text-lg">Average ROI</div>
              <div className="text-sm opacity-75">documented customer results</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Alert Fatigue Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              The €2.1M Alert Fatigue Crisis
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Security teams are drowning in 12,000+ daily alerts. 99% are noise. 
              While you chase false positives, real threats cost millions.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            {/* Traditional Monitoring */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Traditional Security Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded bg-red-100">
                    <div className="text-2xl font-bold text-red-600">12,000+</div>
                    <div className="text-sm text-red-700">
                      <div className="font-medium">Daily Alerts</div>
                      <div>99% are false positives or noise</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-red-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Alert on everything, prioritize nothing</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>8+ hours per day investigating false positives</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Miss real threats while chasing noise</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>€2.1M+ annual monitoring costs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PULSE Intelligence */}
            <Card className="border-red-200 bg-red-50/50 border-2 border-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <Activity className="h-5 w-5" />
                  PULSE Real-time Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded bg-red-100">
                    <div className="text-2xl font-bold text-red-600">187</div>
                    <div className="text-sm text-red-700">
                      <div className="font-medium">Daily Alerts</div>
                      <div>AI-filtered for business impact</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-red-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Monitor only controls that protect €1M+ business losses</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>28 minutes per day investigating real threats</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Financial risk context for every alert</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>€320K annual monitoring costs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business-Critical Controls Matrix */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Business-Critical Control Monitoring
            </h2>
            <p className="text-lg text-slate-700">
              PULSE monitors only controls that prevent expensive business disruptions
            </p>
          </div>

          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Controls Prioritized by Business Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Control Area</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Business Impact</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Max Loss</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Alert Reduction</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criticalControls.map((control, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3 px-4 font-medium">{control.control}</td>
                        <td className="py-3 px-4 text-center text-sm">{control.businessImpact}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-red-600">
                            {formatCurrency(control.maxLoss)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-green-600">{control.alertReduction}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            className={`€{
                              control.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                              control.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {control.priority}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                *Maximum loss calculations based on business impact analysis and historical incident costs.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Real-time Financial Risk Dashboard */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Real-time Financial Risk Monitoring
            </h2>
            <p className="text-lg text-slate-700">
              See your financial risk exposure change in real-time as threats emerge and controls respond
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>24-Hour Risk Exposure Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={riskTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" tickFormatter={(value) => `€€{(value/1000000).toFixed(1)}M`} />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'exposure' ? `€€{(Number(value)/1000000).toFixed(1)}M` : value,
                          name === 'exposure' ? 'Risk Exposure' : name === 'incidents' ? 'Active Incidents' : 'Active Alerts'
                        ]} 
                      />
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="exposure" 
                        stroke="#dc2626" 
                        fill="#fecaca"
                        name="exposure"
                      />
                      <Bar yAxisId="right" dataKey="incidents" fill="#f59e0b" name="incidents" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Alert Volume Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={alertComparison} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={120} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="traditional" fill="#ef4444" name="Traditional" />
                      <Bar dataKey="pulse" fill="#10b981" name="PULSE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Investigation Time Reduction */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              80% Reduction in Investigation Time
            </h2>
          </div>

          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Monthly Investigation Hours Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={investigationMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `€{value}h`} />
                    <Tooltip formatter={(value) => [`€{value} hours`, '']} />
                    <Area 
                      type="monotone" 
                      dataKey="traditional" 
                      stackId="1" 
                      stroke="#ef4444" 
                      fill="#fecaca"
                      name="Traditional Approach"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pulse" 
                      stackId="2" 
                      stroke="#dc2626" 
                      fill="#fee2e2"
                      name="PULSE Intelligence"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-600">480h</div>
                  <div className="text-sm text-slate-600">Traditional Monthly Hours</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">28h</div>
                  <div className="text-sm text-slate-600">PULSE Monthly Hours</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">452h</div>
                  <div className="text-sm text-slate-600">Hours Saved Monthly</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PULSE Advantages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Four Pillars of Intelligent Monitoring
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {pulseAdvantages.map((advantage, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-red-400 to-orange-600">
                      <advantage.icon className="h-6 w-6 text-white" />
                    </div>
                    {advantage.advantage}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-700">{advantage.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-red-600">{advantage.value}</div>
                      <div className="text-sm text-slate-600 flex-1">{advantage.metric}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Monitoring Capabilities */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Real-time Business Protection
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {monitoringCapabilities.map((capability, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{capability.capability}</span>
                    <Badge className="bg-red-100 text-red-700">
                      {capability.updateFrequency}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-700">{capability.description}</p>
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <div className="text-sm font-semibold text-red-800">Business Value</div>
                      <div className="text-sm text-red-700">{capability.businessValue}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Success Stories */}
      <section className="py-16 bg-gradient-to-r from-slate-100 to-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Real Customer Transformations
            </h2>
            <p className="text-lg text-slate-700">
              See how PULSE customers eliminated alert fatigue and improved security outcomes
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {customerSuccess.map((customer, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{customer.company}</CardTitle>
                      <p className="text-sm text-slate-600">{customer.industry}</p>
                    </div>
                    <Badge variant="secondary">{customer.timeframe}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Challenge */}
                    <div className="p-3 rounded-lg bg-slate-50">
                      <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Challenge</div>
                      <div className="text-sm font-medium">{customer.challenge}</div>
                    </div>

                    {/* Before/After Alerts */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-red-50 to-green-50">
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-600">{customer.before.alerts.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">Alerts Before</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{customer.after.alerts}</div>
                        <div className="text-xs text-slate-500">Alerts After</div>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-red-50">
                        <div className="text-2xl font-bold text-red-600">{customer.improvement}</div>
                        <div className="text-xs text-slate-600">Alert Reduction</div>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50">
                        <div className="text-2xl font-bold text-blue-600">{customer.savings}</div>
                        <div className="text-xs text-slate-600">Annual Savings</div>
                      </div>
                    </div>

                    {/* Incident Reduction */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 text-center">
                      <div className="text-xl font-bold text-red-600">{customer.incidentReduction}%</div>
                      <div className="text-xs text-slate-600">Incident Reduction</div>
                    </div>

                    {/* Testimonial */}
                    <blockquote className="italic text-slate-700 border-l-4 border-red-600 pl-4">
                      "{customer.quote}"
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 via-orange-600 to-pink-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Activity className="h-8 w-8" />
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            Ready to End Alert Fatigue?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Monitor only what matters to your business. Focus on threats that cost millions, 
            not noise that costs nothing.
          </p>
          
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-yellow-300 mb-2">
              {formatCurrency(costReduction)}
            </div>
            <div className="text-lg">Annual cost reduction potential*</div>
            <div className="text-sm opacity-75">*Based on documented customer results</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => navigate('/assessment')}
              className="bg-white text-red-700 hover:bg-slate-100"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Monitoring Assessment
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
              onClick={() => navigate('/demo')}
            >
              <Eye className="h-5 w-5 mr-2" />
              See PULSE Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Industry Data Disclaimer */}
      <section className="py-8 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs text-slate-600 space-y-2">
            <p className="font-semibold">Data Sources & Disclaimers:</p>
            <p>
              <strong>*Results vary by organization.</strong> Alert reduction figures based on PULSE customer analysis, 
              Microsoft Sentinel efficiency studies (93% time reduction documented), enterprise SIEM benchmarks, 
              and security operations cost analysis from Gartner and Forrester.
            </p>
            <p>
              <strong>Investigation time savings:</strong> 80%+ reduction typical across enterprise implementations. 
              Metrics based on before/after analysis of security team productivity, incident response times, 
              and cost per security event investigated.
            </p>
            <p>
              <strong>Business impact calculations:</strong> Financial risk exposure based on asset valuation, 
              threat likelihood analysis, and potential business disruption costs. Control prioritization 
              uses NIST framework mapping combined with business impact assessment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};