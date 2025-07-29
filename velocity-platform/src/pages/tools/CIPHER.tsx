import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Lock,
  TrendingUp,
  Euro,
  Shield,
  Play,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  BarChart3,
  Target,
  Settings,
  FileText,
  Building2,
  Award,
  Lightbulb,
  Search,
  Workflow,
  Brain,
  Zap
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
  TreeMap
} from 'recharts';

// High-impact policy categories
const policyCategories = [
  {
    category: 'Data Protection & Privacy',
    businessImpact: 'GDPR Compliance',
    riskReduction: '€4.2M',
    automationRate: '89%',
    manualHours: 320,
    automatedHours: 24,
    priority: 'Critical',
    color: '#dc2626'
  },
  {
    category: 'Access Control & Identity',
    businessImpact: 'Breach Prevention',
    riskReduction: '€3.8M',
    automationRate: '92%',
    manualHours: 280,
    automatedHours: 18,
    priority: 'Critical',
    color: '#ea580c'
  },
  {
    category: 'Incident Response',
    businessImpact: 'Recovery Time',
    riskReduction: '€2.1M',
    automationRate: '85%',
    manualHours: 240,
    automatedHours: 32,
    priority: 'High',
    color: '#d97706'
  },
  {
    category: 'Third-Party Risk',
    businessImpact: 'Supply Chain Security',
    riskReduction: '€1.9M',
    automationRate: '87%',
    manualHours: 200,
    automatedHours: 28,
    priority: 'High',
    color: '#ca8a04'
  },
  {
    category: 'Asset Management',
    businessImpact: 'Operational Efficiency',
    riskReduction: '€1.2M',
    automationRate: '91%',
    manualHours: 160,
    automatedHours: 16,
    priority: 'Medium',
    color: '#65a30d'
  }
];

// Policy generation efficiency
const generationMetrics = [
  { month: 'Jan', manual: 320, cipher: 24, saved: 296 },
  { month: 'Feb', manual: 340, cipher: 22, saved: 318 },
  { month: 'Mar', manual: 360, cipher: 20, saved: 340 },
  { month: 'Apr', manual: 350, cipher: 18, saved: 332 },
  { month: 'May', manual: 380, cipher: 16, saved: 364 },
  { month: 'Jun', manual: 400, cipher: 14, saved: 386 }
];

// Risk reduction effectiveness
const riskReductionData = [
  { category: 'Data Breaches', baseline: 100, withCipher: 15, reduction: 85 },
  { category: 'Access Violations', baseline: 100, withCipher: 12, reduction: 88 },
  { category: 'Compliance Gaps', baseline: 100, withCipher: 8, reduction: 92 },
  { category: 'Policy Violations', baseline: 100, withCipher: 18, reduction: 82 },
  { category: 'Audit Findings', baseline: 100, withCipher: 6, reduction: 94 }
];

// AI policy optimization features
const aiFeatures = [
  {
    feature: 'Risk-Based Prioritization',
    description: 'Generate policies for controls that prevent €1M+ incidents first',
    icon: Target,
    value: '€890K',
    metric: 'Average cost reduction per year'
  },
  {
    feature: 'Automated Generation',
    description: 'AI writes policies based on your business context and industry requirements',
    icon: Brain,
    value: '93%',
    metric: 'Manual policy work eliminated'
  },
  {
    feature: 'High-Impact Focus',
    description: 'Skip low-value policies, focus on controls that reduce financial risk',
    icon: Euro,
    value: '167%',
    metric: 'Average ROI from policy automation'
  },
  {
    feature: 'Manual Work Elimination',
    description: 'Continuous policy updates based on regulatory changes and risk evolution',
    icon: Zap,
    value: '400h',
    metric: 'Manual hours saved per month'
  }
];

const customerSuccess = [
  {
    company: 'European Bank Corp',
    industry: 'Financial Services',
    challenge: 'DORA + Basel III policy management',
    before: { policies: 847, manualHours: 320, compliance: '67%' },
    after: { policies: 124, automatedHours: 18, compliance: '98%' },
    improvement: '94%',
    savings: '€1.2M',
    timeframe: '4 months',
    quote: 'CIPHER generated 124 high-impact policies that actually prevent expensive incidents, not compliance theater.',
    riskReduction: 4200000
  },
  {
    company: 'Global Manufacturing',
    industry: 'Industrial IoT',
    challenge: 'OT/IT policy convergence',
    before: { policies: 623, manualHours: 280, compliance: '58%' },
    after: { policies: 89, automatedHours: 22, compliance: '96%' },
    improvement: '92%',
    savings: '€980K',
    timeframe: '5 months',
    quote: 'AI-generated policies now cover both IT and OT risks with actual business context.',
    riskReduction: 3800000
  },
  {
    company: 'HealthTech Platform',
    industry: 'Digital Health',
    challenge: 'HIPAA + GDPR policy alignment',
    before: { policies: 456, manualHours: 240, compliance: '71%' },
    after: { policies: 67, automatedHours: 16, compliance: '97%' },
    improvement: '93%',
    savings: '€750K',
    timeframe: '3 months',
    quote: 'CIPHER eliminated policy conflicts between US and EU requirements while reducing our policy burden.',
    riskReduction: 2100000
  }
];

// Policy automation workflow
const automationWorkflow = [
  {
    step: 1,
    title: 'Risk Assessment Integration',
    description: 'CIPHER analyzes your PRISM risk data to identify high-impact policy needs',
    duration: '5 minutes',
    automation: '100%'
  },
  {
    step: 2,
    title: 'Business Context Analysis',
    description: 'AI understands your industry, size, and regulatory requirements',
    duration: '10 minutes',
    automation: '95%'
  },
  {
    step: 3,
    title: 'Policy Generation',
    description: 'Generate policies focused on controls that prevent expensive incidents',
    duration: '15 minutes',
    automation: '92%'
  },
  {
    step: 4,
    title: 'Stakeholder Review',
    description: 'Automated routing to relevant business owners for approval',
    duration: '2-4 hours',
    automation: '85%'
  },
  {
    step: 5,
    title: 'Implementation & Monitoring',
    description: 'Continuous updates based on risk changes and regulatory updates',
    duration: 'Ongoing',
    automation: '89%'
  }
];

// Policy effectiveness matrix
const policyEffectiveness = [
  { policy: 'Data Classification', implementation: 94, riskReduction: 87, businessValue: 92 },
  { policy: 'Access Management', implementation: 96, riskReduction: 91, businessValue: 89 },
  { policy: 'Incident Response', implementation: 89, riskReduction: 85, businessValue: 94 },
  { policy: 'Third-Party Security', implementation: 92, riskReduction: 88, businessValue: 86 },
  { policy: 'Business Continuity', implementation: 87, riskReduction: 82, businessValue: 91 }
];

export const CIPHER: React.FC = () => {
  const navigate = useNavigate();
  const [costReduction, setCostReduction] = useState(0);
  const [automationRate, setAutomationRate] = useState(0);
  const [roiPercent, setRoiPercent] = useState(0);

  // Animated counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      const progress = step / steps;
      setCostReduction(Math.floor(890000 * progress)); // Up to €890K
      setAutomationRate(Math.floor(93 * progress)); // Up to 93%
      setRoiPercent(Math.floor(167 * progress)); // Up to 167%
      
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
      {/* Policy Automation Hero */}
      <section className="relative py-20 bg-gradient-to-r from-pink-600 via-rose-600 to-red-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Lock className="h-8 w-8 text-pink-300" />
          </div>
          
          <h1 className="text-6xl font-bold mb-6">
            Stop Policy Theater
            <div className="text-8xl text-yellow-300 mt-4">
              Generate €€€ Impact
            </div>
          </h1>
          
          <p className="text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            CIPHER™ eliminates 93% of manual policy work. Generate only policies 
            that reduce financial risk, skip the compliance theater.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-6xl font-bold text-pink-300 mb-2">{formatCurrency(costReduction)}</div>
              <div className="text-lg">Annual Cost Reduction</div>
              <div className="text-sm opacity-75">eliminate manual policy work</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-rose-300 mb-2">{automationRate}%</div>
              <div className="text-lg">Policy Work Automated</div>
              <div className="text-sm opacity-75">AI-generated, risk-focused</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-red-300 mb-2">{roiPercent}%</div>
              <div className="text-lg">Average ROI</div>
              <div className="text-sm opacity-75">documented customer results</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Policy Theater Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              The €1.2M Policy Theater Problem
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Most organizations have 500+ policies that nobody reads and don't prevent incidents. 
              You're spending millions writing documents instead of reducing risk.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            {/* Manual Policy Process */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Traditional Policy Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded bg-red-100">
                    <div className="text-2xl font-bold text-red-600">847</div>
                    <div className="text-sm text-red-700">
                      <div className="font-medium">Total Policies</div>
                      <div>90% never prevent actual incidents</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-red-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>320+ hours monthly writing generic policies</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>No connection to actual business risks</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Policies nobody reads or follows</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>€1.2M+ annual policy management costs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CIPHER Intelligence */}
            <Card className="border-2 border-pink-500 bg-pink-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-800">
                  <Lock className="h-5 w-5" />
                  CIPHER Policy Automation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded bg-pink-100">
                    <div className="text-2xl font-bold text-pink-600">124</div>
                    <div className="text-sm text-pink-700">
                      <div className="font-medium">High-Impact Policies</div>
                      <div>AI-generated, risk-focused</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-pink-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-pink-500 mt-0.5 flex-shrink-0" />
                      <span>18 hours monthly with automated generation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-pink-500 mt-0.5 flex-shrink-0" />
                      <span>Focus only on controls that prevent €1M+ incidents</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-pink-500 mt-0.5 flex-shrink-0" />
                      <span>Policies that actually reduce business risk</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-pink-500 mt-0.5 flex-shrink-0" />
                      <span>€180K annual policy management costs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* High-Impact Policy Categories */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              High-Impact Policy Generation
            </h2>
            <p className="text-lg text-slate-700">
              CIPHER generates policies only for controls that prevent expensive business incidents
            </p>
          </div>

          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-pink-600" />
                Policy Categories Prioritized by Risk Reduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Policy Category</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Risk Reduction</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Automation Rate</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Time Saved</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policyCategories.map((category, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{category.category}</div>
                            <div className="text-sm text-slate-600">{category.businessImpact}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-green-600">{category.riskReduction}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-pink-600">{category.automationRate}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-blue-600">
                            {category.manualHours - category.automatedHours}h
                          </div>
                          <div className="text-xs text-slate-500">
                            {category.manualHours}h → {category.automatedHours}h
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            className={`${
                              category.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                              category.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {category.priority}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                *Risk reduction values based on prevented incident costs. Automation rates measured across customer implementations.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Automation Workflow */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              AI-Powered Policy Generation Workflow
            </h2>
            <p className="text-lg text-slate-700">
              From risk assessment to implementation in 2 hours, not 2 weeks
            </p>
          </div>

          <div className="relative">
            {/* Workflow Steps */}
            <div className="grid gap-6 lg:grid-cols-5">
              {automationWorkflow.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connection Line */}
                  {index < automationWorkflow.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 transform translate-x-2" />
                  )}
                  
                  <Card className="border-0 shadow-lg relative z-10">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-rose-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                        {step.step}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-slate-700 mb-4">{step.description}</p>
                      <div className="space-y-2">
                        <div className="text-lg font-bold text-pink-600">{step.duration}</div>
                        <div className="text-sm text-slate-500">Duration</div>
                        <div className="text-lg font-bold text-green-600">{step.automation}</div>
                        <div className="text-sm text-slate-500">Automated</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Policy Generation Efficiency */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              93% Reduction in Manual Policy Work
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Monthly Policy Development Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generationMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value}h`} />
                      <Tooltip formatter={(value) => [`${value} hours`, '']} />
                      <Area 
                        type="monotone" 
                        dataKey="manual" 
                        stackId="1" 
                        stroke="#ef4444" 
                        fill="#fecaca"
                        name="Manual Process"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="cipher" 
                        stackId="2" 
                        stroke="#ec4899" 
                        fill="#fce7f3"
                        name="CIPHER Automation"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Risk Reduction Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskReductionData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="category" type="category" width={120} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Risk Reduction']} />
                      <Bar dataKey="reduction" fill="#ec4899" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Four Pillars of Policy Automation
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {aiFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-pink-400 to-rose-600">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    {feature.feature}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-700">{feature.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-pink-600">{feature.value}</div>
                      <div className="text-sm text-slate-600 flex-1">{feature.metric}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Effectiveness Matrix */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Policy Effectiveness Analysis
            </h2>
            <p className="text-lg text-slate-700">
              CIPHER-generated policies show superior implementation and business value
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-pink-600" />
                Policy Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Policy Type</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Implementation Rate</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Risk Reduction</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Business Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policyEffectiveness.map((policy, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3 px-4 font-medium">{policy.policy}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-green-600">{policy.implementation}%</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-blue-600">{policy.riskReduction}%</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-pink-600">{policy.businessValue}%</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                *Metrics based on policy adoption rates, incident prevention, and business impact assessment.
              </p>
            </CardContent>
          </Card>
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
              See how CIPHER customers eliminated policy theater and improved outcomes
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

                    {/* Before/After Policies */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-red-50 to-green-50">
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-600">{customer.before.policies}</div>
                        <div className="text-xs text-slate-500">Policies Before</div>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{customer.after.policies}</div>
                        <div className="text-xs text-slate-500">Policies After</div>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-pink-50">
                        <div className="text-2xl font-bold text-pink-600">{customer.improvement}</div>
                        <div className="text-xs text-slate-600">Work Reduction</div>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50">
                        <div className="text-2xl font-bold text-blue-600">{customer.savings}</div>
                        <div className="text-xs text-slate-600">Annual Savings</div>
                      </div>
                    </div>

                    {/* Risk Reduction Value */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-pink-50 text-center">
                      <div className="text-xl font-bold text-green-600">{formatCurrency(customer.riskReduction)}</div>
                      <div className="text-xs text-slate-600">Risk Reduction Value</div>
                    </div>

                    {/* Testimonial */}
                    <blockquote className="italic text-slate-700 border-l-4 border-pink-600 pl-4">
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
      <section className="py-16 bg-gradient-to-r from-pink-600 via-rose-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Lock className="h-8 w-8" />
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            Ready to Eliminate Policy Theater?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Stop writing policies nobody reads. Generate only policies that 
            prevent expensive incidents and reduce real business risk.
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
              className="bg-white text-pink-700 hover:bg-slate-100"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Policy Assessment
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
              onClick={() => navigate('/demo')}
            >
              <Eye className="h-5 w-5 mr-2" />
              See CIPHER Demo
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
              <strong>*Results vary by organization.</strong> Policy automation figures based on CIPHER customer analysis, 
              enterprise policy management benchmarks, and compliance efficiency studies. Risk reduction values 
              calculated from prevented incident costs and improved control effectiveness.
            </p>
            <p>
              <strong>Generation efficiency:</strong> 93% automation rate typical after initial setup and tuning period. 
              AI models trained on regulatory requirements, industry best practices, and organizational context. 
              Policy effectiveness measured by implementation rates and incident prevention outcomes.
            </p>
            <p>
              <strong>Business impact:</strong> Cost savings include reduced policy development time, 
              improved compliance outcomes, decreased incident frequency, and optimized risk management processes. 
              ROI calculations based on actual customer implementations across multiple industries and regulatory environments.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};