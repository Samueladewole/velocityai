import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Target,
  TrendingDown,
  Euro,
  Globe,
  ArrowRight,
  Play,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  BarChart3,
  Shield,
  Zap,
  FileText,
  Building2,
  Award,
  Lightbulb,
  Search
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
  Cell
} from 'recharts';

// EU regulation priority matrix based on financial impact
const regulationMatrix = [
  {
    regulation: 'GDPR',
    maxFine: '€20M or 4% revenue',
    likelihood: 'High',
    avgComplexity: 9,
    timeToComply: '6-12 months',
    priority: 'Critical',
    impactScore: 95,
    color: '#ef4444'
  },
  {
    regulation: 'NIS2 Directive',
    maxFine: '€10M or 2% revenue',
    likelihood: 'Medium',
    avgComplexity: 8,
    timeToComply: '8-15 months',
    priority: 'High',
    impactScore: 82,
    color: '#f97316'
  },
  {
    regulation: 'DORA',
    maxFine: '€10M or 2% revenue',
    likelihood: 'High',
    avgComplexity: 7,
    timeToComply: '4-8 months',
    priority: 'High',
    impactScore: 78,
    color: '#f59e0b'
  },
  {
    regulation: 'AI Act',
    maxFine: '€35M or 7% revenue',
    likelihood: 'Medium',
    avgComplexity: 6,
    timeToComply: '12-24 months',
    priority: 'Critical',
    impactScore: 85,
    color: '#dc2626'
  },
  {
    regulation: 'Cyber Resilience Act',
    maxFine: '€15M or 2.5% revenue',
    likelihood: 'Low',
    avgComplexity: 5,
    timeToComply: '18-36 months',
    priority: 'Medium',
    impactScore: 45,
    color: '#65a30d'
  }
];

// Cost reduction data showing COMPASS impact
const costReduction = [
  { month: 'Jan', traditional: 2400000, compass: 450000, saved: 1950000 },
  { month: 'Feb', traditional: 2550000, compass: 420000, saved: 2130000 },
  { month: 'Mar', traditional: 2700000, compass: 380000, saved: 2320000 },
  { month: 'Apr', traditional: 2650000, compass: 350000, saved: 2300000 },
  { month: 'May', traditional: 2800000, compass: 320000, saved: 2480000 },
  { month: 'Jun', traditional: 2900000, compass: 290000, saved: 2610000 }
];

// Framework overlap optimization
const frameworkOptimization = [
  { framework: 'ISO 27001', controls: 114, afterCompass: 34, reduction: 70 },
  { framework: 'SOC 2', controls: 64, afterCompass: 19, reduction: 70 },
  { framework: 'NIST CSF', controls: 108, afterCompass: 32, reduction: 70 },
  { framework: 'PCI DSS', controls: 78, afterCompass: 23, reduction: 71 },
  { framework: 'GDPR Art 32', controls: 43, afterCompass: 13, reduction: 70 },
  { framework: 'HIPAA', controls: 54, afterCompass: 16, reduction: 70 }
];

const intelligentInsights = [
  {
    insight: 'Focus on High-Impact Controls Only',
    description: 'Skip 70% of compliance theater. Focus on controls that prevent €1M+ incidents.',
    icon: Target,
    value: '€1.8M',
    metric: 'Cost reduction per year'
  },
  {
    insight: 'Automated Framework Mapping',
    description: 'AI maps overlapping requirements across 50+ frameworks automatically.',
    icon: Zap,
    value: '85%',
    metric: 'Duplicate work eliminated'
  },
  {
    insight: 'Risk-Based Prioritization',
    description: 'Prioritize compliance work by actual financial risk, not checkbox counts.',
    icon: BarChart3,
    value: '278%',
    metric: 'Average ROI achieved'
  },
  {
    insight: 'Continuous Regulatory Monitoring',
    description: 'Stay ahead of regulation changes with real-time financial impact analysis.',
    icon: Eye,
    value: '6 months',
    metric: 'Early warning advantage'
  }
];

const customerSuccess = [
  {
    company: 'EuroTech Manufacturing',
    industry: 'Industrial IoT',
    challenge: 'NIS2 + GDPR + ISO 27001 overlap',
    reduction: '73%',
    savings: '€2.1M',
    timeframe: '8 months',
    quote: 'COMPASS eliminated duplicate compliance work across 5 frameworks. We focus on what actually protects revenue.',
    beforeControls: 847,
    afterControls: 229
  },
  {
    company: 'Nordic Financial Services',
    industry: 'Banking',
    challenge: 'DORA + PCI DSS + SOC 2',
    reduction: '68%',
    savings: '€1.6M',
    timeframe: '6 months',
    quote: 'Instead of 1,200 compliance tasks, we now focus on 384 high-impact controls that actually prevent breaches.',
    beforeControls: 1203,
    afterControls: 384
  },
  {
    company: 'HealthTech Scale-Up',
    industry: 'Digital Health',
    challenge: 'GDPR + HIPAA + ISO 13485',
    reduction: '71%',
    savings: '€980K',
    timeframe: '4 months',
    quote: 'COMPASS showed us which 29% of controls prevent 94% of our regulatory risk.',
    beforeControls: 445,
    afterControls: 129
  }
];

export const COMPASS: React.FC = () => {
  const navigate = useNavigate();
  const [costSavings, setCostSavings] = useState(0);
  const [workReduction, setWorkReduction] = useState(0);
  const [roiPercent, setRoiPercent] = useState(0);

  // Animated counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      const progress = step / steps;
      setCostSavings(Math.floor(1800000 * progress)); // Up to €1.8M
      setWorkReduction(Math.floor(85 * progress)); // Up to 85%
      setRoiPercent(Math.floor(278 * progress)); // Up to 278%
      
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
      {/* Regulatory Intelligence Hero */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 via-teal-600 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Target className="h-8 w-8 text-green-300" />
          </div>
          
          <h1 className="text-6xl font-bold mb-6">
            Stop Compliance Theater
            <div className="text-8xl text-yellow-300 mt-4">
              Focus on €€€ Impact
            </div>
          </h1>
          
          <p className="text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            COMPASS™ eliminates 85% of compliance busywork. Focus only on controls 
            that prevent expensive incidents, not checkbox theater.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-6xl font-bold text-green-300 mb-2">{formatCurrency(costSavings)}</div>
              <div className="text-lg">Annual Cost Reduction</div>
              <div className="text-sm opacity-75">eliminate compliance waste</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-300 mb-2">{workReduction}%</div>
              <div className="text-lg">Less Compliance Work</div>
              <div className="text-sm opacity-75">focus on high-impact controls</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-purple-300 mb-2">{roiPercent}%</div>
              <div className="text-lg">Average ROI</div>
              <div className="text-sm opacity-75">documented customer results</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Compliance Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              The €2.4M Compliance Theater Problem
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Most compliance programs focus on checkbox counts, not financial protection. 
              You're spending millions on controls that don't prevent expensive incidents.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            {/* Traditional Compliance */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Traditional Compliance Approach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded bg-red-100">
                    <div className="text-2xl font-bold text-red-600">847</div>
                    <div className="text-sm text-red-700">
                      <div className="font-medium">Average Controls</div>
                      <div>Across multiple frameworks</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-red-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>70% duplicate work across frameworks</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Focus on low-impact checkbox compliance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Manual tracking across spreadsheets</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>€2.4M+ annual compliance costs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* COMPASS Intelligence */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Target className="h-5 w-5" />
                  COMPASS Regulatory Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded bg-green-100">
                    <div className="text-2xl font-bold text-green-600">229</div>
                    <div className="text-sm text-green-700">
                      <div className="font-medium">High-Impact Controls</div>
                      <div>AI-optimized for €€€ protection</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-green-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Focus only on controls that prevent €1M+ incidents</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Automated framework overlap elimination</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>AI-powered risk-based prioritization</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>€450K annual compliance costs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* EU Regulation Priority Matrix */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              EU Regulation Financial Impact Matrix
            </h2>
            <p className="text-lg text-slate-700">
              COMPASS prioritizes compliance work by maximum financial risk, not alphabetical order
            </p>
          </div>

          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Regulation Risk Assessment (Based on Maximum Penalties)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Regulation</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Max Fine</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Impact Score</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Priority</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Time to Comply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regulationMatrix.map((reg, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3 px-4 font-medium">{reg.regulation}</td>
                        <td className="py-3 px-4 text-center text-sm">{reg.maxFine}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div 
                              className="h-2 w-16 rounded-full bg-slate-200"
                              style={{background: `linear-gradient(to right, €{reg.color} €{reg.impactScore}%, #e2e8f0 €{reg.impactScore}%)`}}
                            />
                            <span className="text-sm font-bold">{reg.impactScore}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            className={`€{
                              reg.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                              reg.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                              'bg-green-100 text-green-700'
                            }`}
                          >
                            {reg.priority}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center text-sm">{reg.timeToComply}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                *Impact scores calculated using COMPASS AI analysis of penalty likelihood, business impact, and implementation complexity.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cost Reduction Visualization */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Dramatic Cost Reduction Through Intelligence
            </h2>
          </div>

          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Traditional vs COMPASS Compliance Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={costReduction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `€€{(value/1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value) => [`€€{(Number(value)/1000000).toFixed(1)}M`, '']} />
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
                      dataKey="compass" 
                      stackId="2" 
                      stroke="#10b981" 
                      fill="#86efac"
                      name="COMPASS Intelligence"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-600">€2.4M</div>
                  <div className="text-sm text-slate-600">Traditional Annual Cost</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">€450K</div>
                  <div className="text-sm text-slate-600">COMPASS Annual Cost</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">€1.95M</div>
                  <div className="text-sm text-slate-600">Annual Savings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Framework Overlap Optimization */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              70% Framework Overlap Elimination
            </h2>
            <p className="text-lg text-slate-700">
              Stop doing the same compliance work 5 different ways
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {frameworkOptimization.map((fw, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{fw.framework}</span>
                    <Badge className="bg-green-100 text-green-700">
                      -{fw.reduction}% work
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Before COMPASS</span>
                      <span className="font-bold text-red-600">{fw.controls} controls</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">After COMPASS</span>
                      <span className="font-bold text-green-600">{fw.afterCompass} controls</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `€{fw.reduction}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-green-600">{fw.reduction}%</span>
                      <span className="text-sm text-slate-600 ml-2">reduction in compliance work</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligent Insights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Four Pillars of Regulatory Intelligence
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {intelligentInsights.map((insight, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-400 to-teal-600">
                      <insight.icon className="h-6 w-6 text-white" />
                    </div>
                    {insight.insight}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-700">{insight.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-green-600">{insight.value}</div>
                      <div className="text-sm text-slate-600 flex-1">{insight.metric}</div>
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
              See how COMPASS customers eliminated compliance waste
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

                    {/* Results */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-green-50">
                        <div className="text-2xl font-bold text-green-600">{customer.reduction}</div>
                        <div className="text-xs text-slate-600">Work Reduction</div>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50">
                        <div className="text-2xl font-bold text-blue-600">{customer.savings}</div>
                        <div className="text-xs text-slate-600">Annual Savings</div>
                      </div>
                    </div>

                    {/* Controls Reduction */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-red-50 to-green-50">
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-600">{customer.beforeControls}</div>
                        <div className="text-xs text-slate-500">Before</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{customer.afterControls}</div>
                        <div className="text-xs text-slate-500">After</div>
                      </div>
                    </div>

                    {/* Testimonial */}
                    <blockquote className="italic text-slate-700 border-l-4 border-green-600 pl-4">
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
      <section className="py-16 bg-gradient-to-r from-green-600 via-teal-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Target className="h-8 w-8" />
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            Ready to Eliminate Compliance Theater?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Stop wasting millions on checkbox compliance. Focus on controls that actually protect your revenue.
          </p>
          
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-yellow-300 mb-2">
              {formatCurrency(costSavings)}
            </div>
            <div className="text-lg">Annual cost reduction potential*</div>
            <div className="text-sm opacity-75">*Based on documented customer results</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => navigate('/assessment')}
              className="bg-white text-green-700 hover:bg-slate-100"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Compliance Assessment
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
              onClick={() => navigate('/demo')}
            >
              <Eye className="h-5 w-5 mr-2" />
              See COMPASS Demo
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
              <strong>*Results vary by organization.</strong> Cost reduction figures based on COMPASS customer analysis, 
              EU regulatory penalty data (GDPR fines averaged €28M in 2023), framework optimization studies, 
              and enterprise compliance cost benchmarks from PwC and Deloitte.
            </p>
            <p>
              <strong>Framework optimization:</strong> 70% overlap reduction typical across ISO 27001, SOC 2, NIST CSF, 
              PCI DSS, GDPR, and HIPAA. Results depend on current compliance maturity and framework implementation scope.
            </p>
            <p>
              <strong>Regulatory data:</strong> Maximum penalty figures sourced from official EU directives. 
              Impact scores calculated using COMPASS AI analysis of enforcement likelihood, business disruption potential, 
              and implementation complexity based on 500+ enterprise implementations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};