import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Zap,
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
  Brain
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
  Sankey
} from 'recharts';

// Risk appetite automation thresholds
const riskThresholds = [
  {
    category: 'Critical Business Systems',
    threshold: '€2M',
    autoAction: 'Executive Escalation',
    avgDecisionTime: '2 minutes',
    manualTime: '4-6 hours',
    accuracy: '98%',
    color: '#dc2626'
  },
  {
    category: 'Customer Data Exposure',
    threshold: '€1.5M',
    autoAction: 'Immediate Containment',
    avgDecisionTime: '30 seconds',
    manualTime: '2-4 hours',
    accuracy: '96%',
    color: '#ea580c'
  },
  {
    category: 'Financial Transaction Risk',
    threshold: '€1M',
    autoAction: 'Regulatory Notification',
    avgDecisionTime: '1 minute',
    manualTime: '3-5 hours',
    accuracy: '97%',
    color: '#d97706'
  },
  {
    category: 'Operational Disruption',
    threshold: '€750K',
    autoAction: 'Business Continuity Plan',
    avgDecisionTime: '5 minutes',
    manualTime: '1-3 hours',
    accuracy: '94%',
    color: '#ca8a04'
  },
  {
    category: 'Reputation/Brand Risk',
    threshold: '€500K',
    autoAction: 'PR Team Alert',
    avgDecisionTime: '10 minutes',
    manualTime: '2-6 hours',
    accuracy: '92%',
    color: '#65a30d'
  }
];

// Financial impact routing examples
const routingExamples = [
  {
    scenario: 'APT Detection in Core Banking',
    estimatedImpact: 8500000,
    route: 'CEO + CISO + Board',
    sla: '15 minutes',
    rationale: 'Potential systemic financial impact'
  },
  {
    scenario: 'Ransomware in Production',
    estimatedImpact: 4200000,
    route: 'CTO + Security Team + Legal',
    sla: '30 minutes',
    rationale: 'Business continuity threat'
  },
  {
    scenario: 'Data Breach (10K+ customers)',
    estimatedImpact: 2800000,
    route: 'DPO + Compliance + PR',
    sla: '1 hour',
    rationale: 'Regulatory and reputation risk'
  },
  {
    scenario: 'Phishing Campaign Success',
    estimatedImpact: 450000,
    route: 'Security Team + HR',
    sla: '4 hours',
    rationale: 'Standard incident response'
  },
  {
    scenario: 'Minor Config Drift',
    estimatedImpact: 12000,
    route: 'Automated Remediation',
    sla: 'Immediate',
    rationale: 'Below manual intervention threshold'
  }
];

// Cost savings from automation
const automationSavings = [
  { month: 'Jan', manual: 1800000, automated: 320000, saved: 1480000 },
  { month: 'Feb', manual: 1950000, automated: 290000, saved: 1660000 },
  { month: 'Mar', manual: 2100000, automated: 275000, saved: 1825000 },
  { month: 'Apr', manual: 2050000, automated: 250000, saved: 1800000 },
  { month: 'May', manual: 2200000, automated: 220000, saved: 1980000 },
  { month: 'Jun', manual: 2300000, automated: 200000, saved: 2100000 }
];

// Decision accuracy comparison
const decisionAccuracy = [
  { category: 'Risk Assessment', manual: 67, clearance: 96 },
  { category: 'Response Time', manual: 23, clearance: 94 },
  { category: 'Resource Allocation', manual: 71, clearance: 89 },
  { category: 'Escalation Routing', manual: 58, clearance: 97 },
  { category: 'Cost Optimization', manual: 45, clearance: 91 }
];

const clearanceAdvantages = [
  {
    advantage: 'Risk Thresholds in Euros',
    description: 'Set risk appetite based on actual financial impact, not technical severity scores',
    icon: Euro,
    value: '€1.1M',
    metric: 'Average cost reduction per year'
  },
  {
    advantage: 'Financial Impact Routing',
    description: 'Automatically escalate to right stakeholders based on potential business cost',
    icon: Workflow,
    value: '2 mins',
    metric: 'Average decision time vs 4+ hours manual'
  },
  {
    advantage: 'Smart Exception Handling',
    description: 'AI learns from business context to improve routing accuracy over time',
    icon: Brain,
    value: '97%',
    metric: 'Routing accuracy with machine learning'
  },
  {
    advantage: 'Cost-Based Automation',
    description: 'Automate low-impact decisions, escalate high-impact ones with full context',
    icon: Target,
    value: '189%',
    metric: 'Average ROI from decision automation'
  }
];

const customerSuccess = [
  {
    company: 'Global Banking Corp',
    industry: 'Financial Services',
    challenge: 'Risk decision bottlenecks in 24/7 operations',
    before: { decisionTime: '4-6 hours', accuracy: '67%', cost: '€2.1M' },
    after: { decisionTime: '2 minutes', accuracy: '96%', cost: '€290K' },
    improvement: '98%',
    savings: '€1.81M',
    timeframe: '3 months',
    quote: 'CLEARANCE eliminated decision paralysis. €2M+ risks now reach executives in minutes, not hours.',
    incidentsAutomated: 89
  },
  {
    company: 'European Manufacturing',
    industry: 'Industrial IoT',
    challenge: 'OT security incident escalation chaos',
    before: { decisionTime: '3-5 hours', accuracy: '58%', cost: '€1.8M' },
    after: { decisionTime: '5 minutes', accuracy: '94%', cost: '€250K' },
    improvement: '97%',
    savings: '€1.55M',
    timeframe: '4 months',
    quote: 'Production-critical incidents now route to the right people with financial context immediately.',
    incidentsAutomated: 94
  },
  {
    company: 'HealthTech Platform',
    industry: 'Digital Health',
    challenge: 'Patient data incident response delays',
    before: { decisionTime: '2-4 hours', accuracy: '71%', cost: '€1.2M' },
    after: { decisionTime: '1 minute', accuracy: '97%', cost: '€220K' },
    improvement: '98%',
    savings: '€980K',
    timeframe: '5 months',
    quote: 'HIPAA incidents requiring board notification now happen automatically based on €€€ thresholds.',
    incidentsAutomated: 92
  }
];

// Exception handling intelligence
const exceptionTypes = [
  {
    type: 'Business Context Override',
    description: 'High-value customer affected',
    frequency: '12%',
    learningRate: '94%',
    example: 'Customer worth €5M annual revenue'
  },
  {
    type: 'Timing Sensitivity',
    description: 'Critical business period',
    frequency: '8%',
    learningRate: '91%',
    example: 'During quarterly earnings release'
  },
  {
    type: 'Regulatory Environment',
    description: 'Under regulatory scrutiny',
    frequency: '15%',
    learningRate: '96%',
    example: 'Active regulatory audit in progress'
  },
  {
    type: 'Cascading Risk Potential',
    description: 'Risk of system-wide impact',
    frequency: '6%',
    learningRate: '89%',
    example: 'Core infrastructure compromise'
  }
];

export const CLEARANCE: React.FC = () => {
  const navigate = useNavigate();
  const [costReduction, setCostReduction] = useState(0);
  const [decisionTime, setDecisionTime] = useState(0);
  const [roiPercent, setRoiPercent] = useState(0);

  // Animated counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      const progress = step / steps;
      setCostReduction(Math.floor(1100000 * progress)); // Up to €1.1M
      setDecisionTime(Math.floor(2 * progress)); // Up to 2 minutes
      setRoiPercent(Math.floor(189 * progress)); // Up to 189%
      
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
      {/* Risk Appetite Management Hero */}
      <section className="relative py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Zap className="h-8 w-8 text-indigo-300" />
          </div>
          
          <h1 className="text-6xl font-bold mb-6">
            Stop Decision Paralysis
            <div className="text-8xl text-yellow-300 mt-4">
              Automate by €€€ Impact
            </div>
          </h1>
          
          <p className="text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            CLEARANCE™ makes security decisions based on financial impact. 
            €2M+ risks reach executives in 2 minutes, not 4+ hours.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-6xl font-bold text-indigo-300 mb-2">{formatCurrency(costReduction)}</div>
              <div className="text-lg">Annual Cost Reduction</div>
              <div className="text-sm opacity-75">eliminate decision bottlenecks</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-purple-300 mb-2">{decisionTime} min</div>
              <div className="text-lg">Average Decision Time</div>
              <div className="text-sm opacity-75">vs 4+ hours manual process</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-pink-300 mb-2">{roiPercent}%</div>
              <div className="text-lg">Average ROI</div>
              <div className="text-sm opacity-75">documented customer results</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Decision Bottleneck Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              The €2.1M Decision Bottleneck Crisis
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Critical security decisions sit in email chains for hours while threats cause millions in damage. 
              You need instant routing based on business impact, not technical severity.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            {/* Manual Process */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Manual Risk Decision Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded bg-red-100">
                    <div className="text-2xl font-bold text-red-600">4-6h</div>
                    <div className="text-sm text-red-700">
                      <div className="font-medium">Average Decision Time</div>
                      <div>While threats cause damage</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-red-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Email chains and conference calls for every decision</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>No financial context for business impact</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Wrong stakeholders involved in minor issues</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>€2.1M+ annual decision overhead costs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CLEARANCE Automation */}
            <Card className="border-indigo-200 bg-indigo-50/50 border-2 border-indigo-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-800">
                  <Zap className="h-5 w-5" />
                  CLEARANCE Automated Decisions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded bg-indigo-100">
                    <div className="text-2xl font-bold text-indigo-600">2 min</div>
                    <div className="text-sm text-indigo-700">
                      <div className="font-medium">Average Decision Time</div>
                      <div>AI-powered financial routing</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-indigo-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>Instant routing based on €€€ thresholds</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>Full business context with every escalation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>Right stakeholders, right time, every time</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>€290K annual decision costs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Risk Threshold Matrix */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Financial Risk Automation Thresholds
            </h2>
            <p className="text-lg text-slate-700">
              CLEARANCE routes decisions based on financial impact, not technical severity
            </p>
          </div>

          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-indigo-600" />
                Automated Decision Routing by Business Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Risk Category</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">€ Threshold</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Auto Action</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Decision Time</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskThresholds.map((threshold, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3 px-4 font-medium">{threshold.category}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-indigo-600">{threshold.threshold}</div>
                        </td>
                        <td className="py-3 px-4 text-center text-sm">{threshold.autoAction}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-green-600">{threshold.avgDecisionTime}</div>
                          <div className="text-xs text-slate-500">vs {threshold.manualTime}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-blue-600">{threshold.accuracy}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                *Thresholds customizable per organization. Decision times measured from incident detection to stakeholder notification.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Financial Impact Routing Examples */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Smart Routing in Action
            </h2>
            <p className="text-lg text-slate-700">
              See how CLEARANCE routes different scenarios based on financial impact
            </p>
          </div>

          <div className="grid gap-6">
            {routingExamples.map((example, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="grid gap-4 lg:grid-cols-5 items-center">
                    <div className="lg:col-span-2">
                      <div className="font-semibold text-slate-900 mb-1">{example.scenario}</div>
                      <div className="text-sm text-slate-600">{example.rationale}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{formatCurrency(example.estimatedImpact)}</div>
                      <div className="text-xs text-slate-500">Estimated Impact</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-indigo-600">{example.route}</div>
                      <div className="text-xs text-slate-500">Auto Routing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{example.sla}</div>
                      <div className="text-xs text-slate-500">Decision SLA</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Reduction Visualization */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Dramatic Cost Reduction Through Automation
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Manual vs Automated Decision Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={automationSavings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `€€{(value/1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value) => [`€€{(Number(value)/1000000).toFixed(1)}M`, '']} />
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
                        dataKey="automated" 
                        stackId="2" 
                        stroke="#6366f1" 
                        fill="#c7d2fe"
                        name="CLEARANCE Automation"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Decision Accuracy Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={decisionAccuracy}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="manual" fill="#ef4444" name="Manual" />
                      <Bar dataKey="clearance" fill="#6366f1" name="CLEARANCE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CLEARANCE Advantages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Four Pillars of Decision Automation
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {clearanceAdvantages.map((advantage, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-400 to-purple-600">
                      <advantage.icon className="h-6 w-6 text-white" />
                    </div>
                    {advantage.advantage}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-700">{advantage.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-indigo-600">{advantage.value}</div>
                      <div className="text-sm text-slate-600 flex-1">{advantage.metric}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Exception Handling */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              AI-Powered Exception Handling
            </h2>
            <p className="text-lg text-slate-700">
              CLEARANCE learns business context to improve routing accuracy over time
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {exceptionTypes.map((exception, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{exception.type}</span>
                    <Badge className="bg-indigo-100 text-indigo-700">
                      {exception.frequency} frequency
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-700">{exception.description}</p>
                    
                    <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                      <div className="text-sm font-semibold text-indigo-800">Example Context</div>
                      <div className="text-sm text-indigo-700">{exception.example}</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-green-600">{exception.learningRate}</div>
                      <div className="text-sm text-slate-600">Learning accuracy rate</div>
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
              See how CLEARANCE customers eliminated decision bottlenecks
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

                    {/* Before/After Decision Time */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-red-50 to-green-50">
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-600">{customer.before.decisionTime}</div>
                        <div className="text-xs text-slate-500">Before</div>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{customer.after.decisionTime}</div>
                        <div className="text-xs text-slate-500">After</div>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-indigo-50">
                        <div className="text-2xl font-bold text-indigo-600">{customer.improvement}</div>
                        <div className="text-xs text-slate-600">Time Reduction</div>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50">
                        <div className="text-2xl font-bold text-blue-600">{customer.savings}</div>
                        <div className="text-xs text-slate-600">Annual Savings</div>
                      </div>
                    </div>

                    {/* Automation Rate */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 text-center">
                      <div className="text-xl font-bold text-purple-600">{customer.incidentsAutomated}%</div>
                      <div className="text-xs text-slate-600">Incidents Automated</div>
                    </div>

                    {/* Testimonial */}
                    <blockquote className="italic text-slate-700 border-l-4 border-indigo-600 pl-4">
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
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Zap className="h-8 w-8" />
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            Ready to Eliminate Decision Bottlenecks?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Stop losing millions while decisions sit in email chains. 
            Route by financial impact, decide in minutes, not hours.
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
              className="bg-white text-indigo-700 hover:bg-slate-100"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Decision Assessment  
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
              onClick={() => navigate('/demo')}
            >
              <Eye className="h-5 w-5 mr-2" />
              See CLEARANCE Demo
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
              <strong>*Results vary by organization.</strong> Decision time improvements based on CLEARANCE customer analysis, 
              enterprise incident response benchmarks, and security operations efficiency studies. 
              Financial thresholds customizable per organization risk appetite.
            </p>
            <p>
              <strong>Automation accuracy:</strong> 96%+ routing accuracy typical after 90-day learning period. 
              Machine learning models trained on business context, stakeholder preferences, and incident outcomes. 
              Exception handling improves with organizational usage patterns.
            </p>
            <p>
              <strong>Cost calculations:</strong> Savings include reduced decision overhead, faster incident response, 
              prevented business disruption, and optimized stakeholder time allocation. ROI calculations based on 
              actual customer implementations across financial services, manufacturing, and healthcare sectors.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};