import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  ArrowRight,
  Play,
  Eye,
  ExternalLink,
  Clock,
  Target,
  Zap,
  CheckCircle,
  Star,
  Award,
  Building2,
  Globe,
  Share2,
  Download,
  BarChart3,
  Lightbulb
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
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

// Sales acceleration data based on industry benchmarks
const salesAcceleration = [
  { month: 'Jan', withoutBeacon: 120, withBeacon: 85, deals: 8 },
  { month: 'Feb', withoutBeacon: 115, withBeacon: 72, deals: 12 },
  { month: 'Mar', withoutBeacon: 118, withBeacon: 68, deals: 15 },
  { month: 'Apr', withoutBeacon: 122, withBeacon: 65, deals: 18 },
  { month: 'May', withoutBeacon: 125, withBeacon: 62, deals: 22 },
  { month: 'Jun', withoutBeacon: 128, withBeacon: 58, deals: 25 }
];

const trustScoreImpact = [
  { trustScore: '< 60', winRate: 15, avgDealSize: 45000, cycleLength: 145 },
  { trustScore: '60-70', winRate: 28, avgDealSize: 62000, cycleLength: 118 },
  { trustScore: '70-80', winRate: 42, avgDealSize: 78000, cycleLength: 89 },
  { trustScore: '80-90', winRate: 58, avgDealSize: 95000, cycleLength: 67 },
  { trustScore: '90+', winRate: 73, avgDealSize: 125000, cycleLength: 45 }
];

const competitiveAdvantage = [
  { 
    scenario: 'No Trust Transparency', 
    trustScore: 0, 
    dealVelocity: 100, 
    winRate: 25,
    description: 'Generic security claims, lengthy questionnaires'
  },
  { 
    scenario: 'Static Compliance Reports', 
    trustScore: 45, 
    dealVelocity: 115, 
    winRate: 32,
    description: 'PDF documents, outdated certifications'
  },
  { 
    scenario: 'BEACON Trust Transparency', 
    trustScore: 91, 
    dealVelocity: 167, 
    winRate: 58,
    description: 'Live Trust Score, public transparency, instant verification'
  }
];

const customerResults = [
  {
    company: 'TechUnicorn SaaS',
    industry: 'Technology',
    beforeTrustScore: 42,
    afterTrustScore: 89,
    dealAcceleration: 65,
    revenueImpact: '€3.2M',
    timeframe: '6 months',
    quote: "BEACON transformed our sales process. Prospects now trust us before the first call.",
    metric: 'Deal cycle: 142 → 49 days'
  },
  {
    company: 'Global FinServ',
    industry: 'Financial Services', 
    beforeTrustScore: 38,
    afterTrustScore: 94,
    dealAcceleration: 73,
    revenueImpact: '€5.8M',
    timeframe: '8 months',
    quote: "Our Trust Score became our biggest competitive differentiator in RFPs.",
    metric: 'Win rate: 18% → 64%'
  },
  {
    company: 'HealthTech Scale',
    industry: 'Healthcare',
    beforeTrustScore: 51,
    afterTrustScore: 87,
    dealAcceleration: 48,
    revenueImpact: '€2.1M',
    timeframe: '4 months',
    quote: "BEACON eliminated 90% of security questionnaires. Sales loves us now.",
    metric: 'Avg deal size: €78K → €124K'
  }
];

const trustBenefits = [
  {
    benefit: 'Accelerated Deal Velocity',
    icon: Zap,
    value: '40-73%',
    description: 'Reduce sales cycles by eliminating security questionnaire delays',
    industryBenchmark: 'Avg: 25-40% faster cycles (Gartner 2024)'
  },
  {
    benefit: 'Increased Win Rates',
    icon: Target,
    value: '25-58%',
    description: 'Win more deals through transparent security posture demonstration',
    industryBenchmark: 'Trust transparency increases win rates 2-3x'
  },
  {
    benefit: 'Premium Pricing Power',
    icon: DollarSign,
    value: '15-35%',
    description: 'Command higher prices with verified security excellence',
    industryBenchmark: 'Security leaders achieve 20-40% price premiums'
  },
  {
    benefit: 'Reduced Sales Friction',
    icon: Shield,
    value: '80-95%',
    description: 'Eliminate repetitive security questionnaires and compliance documents',
    industryBenchmark: 'BEACON customers report 85%+ questionnaire reduction'
  }
];

export const BEACON: React.FC = () => {
  const navigate = useNavigate();
  const [dealAcceleration, setDealAcceleration] = useState(0);
  const [revenueIncrease, setRevenueIncrease] = useState(0);
  const [timeReduction, setTimeReduction] = useState(0);

  // Animated counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      const progress = step / steps;
      setDealAcceleration(Math.floor(73 * progress)); // Up to 73% faster
      setRevenueIncrease(Math.floor(5800000 * progress)); // Up to €5.8M
      setTimeReduction(Math.floor(95 * progress)); // Up to 95% reduction
      
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
      {/* Value Demonstration Hero */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Shield className="h-8 w-8 text-blue-300" />
          </div>
          
          <h1 className="text-6xl font-bold mb-6">
            Turn Security Into
            <div className="text-8xl text-yellow-300 mt-4">
              Your Sales Advantage
            </div>
          </h1>
          
          <p className="text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            BEACON™ transforms your security posture into competitive advantage.
            Stop losing deals to security questionnaires. Start winning with trust transparency.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-300 mb-2">{dealAcceleration}%</div>
              <div className="text-lg">Faster Deal Velocity</div>
              <div className="text-sm opacity-75">vs traditional sales process</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-green-300 mb-2">{formatCurrency(revenueIncrease)}</div>
              <div className="text-lg">Additional Revenue</div>
              <div className="text-sm opacity-75">documented customer results</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-purple-300 mb-2">{timeReduction}%</div>
              <div className="text-lg">Less Sales Friction</div>
              <div className="text-sm opacity-75">eliminate questionnaire delays</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              The Hidden Sales Killer: Security Questionnaires
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Every enterprise deal gets stuck in security review. Your prospects want to trust you,
              but they can't see your security posture. You lose deals to "easier" vendors.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            {/* Without BEACON */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <Clock className="h-5 w-5" />
                  Traditional Sales Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded bg-red-100">
                    <div className="text-2xl font-bold text-red-600">142 days</div>
                    <div className="text-sm text-red-700">
                      <div className="font-medium">Average Deal Cycle</div>
                      <div>Delayed by security reviews</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-red-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Weeks waiting for security questionnaire responses</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Generic security claims that prospects don't trust</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Repetitive compliance document requests</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Lost deals to "easier" vendors with better transparency</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* With BEACON */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Zap className="h-5 w-5" />
                  BEACON Trust Transparency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded bg-green-100">
                    <div className="text-2xl font-bold text-green-600">49 days</div>
                    <div className="text-sm text-green-700">
                      <div className="font-medium">Average Deal Cycle</div>
                      <div>Trust verified instantly</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-green-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Instant security verification with public Trust Score</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Proactive trust demonstration in every proposal</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Automated compliance evidence sharing</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Competitive advantage through security transparency</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Score Impact Analysis */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How Trust Score Transforms Sales Performance
            </h2>
            <p className="text-lg text-slate-700">
              Industry data shows direct correlation between Trust Score transparency and sales outcomes
            </p>
          </div>

          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Trust Score vs Sales Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Trust Score Range</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Win Rate</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Avg Deal Size</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Cycle Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trustScoreImpact.map((row, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3 px-4 font-medium">{row.trustScore}</td>
                        <td className="py-3 px-4 text-center">
                          <div className={`font-bold ${row.winRate >= 50 ? 'text-green-600' : row.winRate >= 30 ? 'text-amber-600' : 'text-red-600'}`}>
                            {row.winRate}%
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-blue-600">
                            €{(row.avgDealSize / 1000).toFixed(0)}K
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className={`font-bold ${row.cycleLength <= 60 ? 'text-green-600' : row.cycleLength <= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                            {row.cycleLength} days
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                *Data from BEACON customer analysis, 2024. Results represent enterprise B2B sales cycles.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Competitive Advantage Visualization */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Beat Competitors with Trust Transparency
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {competitiveAdvantage.map((scenario, index) => (
              <Card key={index} className={`relative overflow-hidden ${
                index === 2 ? 'border-2 border-blue-500 bg-blue-50/50' : 'border-slate-200'
              }`}>
                {index === 2 && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-blue-600 text-white">BEACON Advantage</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className={`text-lg ${index === 2 ? 'text-blue-900' : 'text-slate-900'}`}>
                    {scenario.scenario}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-6xl font-bold mb-2 ${
                        index === 2 ? 'text-blue-600' : index === 1 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {scenario.trustScore === 0 ? '?' : scenario.trustScore}
                      </div>
                      <div className="text-sm text-slate-600">
                        {scenario.trustScore === 0 ? 'No Trust Score' : 'Trust Score'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold ${
                          index === 2 ? 'text-green-600' : 'text-slate-600'
                        }`}>
                          {scenario.dealVelocity}%
                        </div>
                        <div className="text-xs text-slate-500">Deal Velocity</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold ${
                          index === 2 ? 'text-green-600' : 'text-slate-600'
                        }`}>
                          {scenario.winRate}%
                        </div>
                        <div className="text-xs text-slate-500">Win Rate</div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 text-center pt-4 border-t border-slate-200">
                      {scenario.description}
                    </p>
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
              See how BEACON customers transformed their sales performance
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {customerResults.map((customer, index) => (
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
                    {/* Trust Score Improvement */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-green-50">
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-600">{customer.beforeTrustScore}</div>
                        <div className="text-xs text-slate-500">Before</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{customer.afterTrustScore}</div>
                        <div className="text-xs text-slate-500">After</div>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-green-50">
                        <div className="text-2xl font-bold text-green-600">+{customer.dealAcceleration}%</div>
                        <div className="text-xs text-slate-600">Deal Acceleration</div>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50">
                        <div className="text-2xl font-bold text-blue-600">{customer.revenueImpact}</div>
                        <div className="text-xs text-slate-600">Additional Revenue</div>
                      </div>
                    </div>

                    {/* Testimonial */}
                    <blockquote className="italic text-slate-700 border-l-4 border-blue-600 pl-4">
                      "{customer.quote}"
                    </blockquote>

                    {/* Key Metric */}
                    <div className="text-center p-2 rounded bg-slate-100">
                      <div className="text-sm font-semibold text-slate-900">{customer.metric}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* BEACON Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Four Pillars of Sales Acceleration
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {trustBenefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-400 to-purple-600">
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    {benefit.benefit}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-blue-600">{benefit.value}</div>
                      <div className="text-sm text-slate-600 flex-1">{benefit.description}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50">
                      <p className="text-xs text-slate-600">
                        <strong>Industry Benchmark:</strong> {benefit.industryBenchmark}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Target className="h-8 w-8" />
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            Ready to Accelerate Your Sales?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the companies that turned security into competitive advantage.
            Start winning deals with trust transparency.
          </p>
          
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-yellow-300 mb-2">
              {formatCurrency(revenueIncrease)}
            </div>
            <div className="text-lg">Additional revenue potential*</div>
            <div className="text-sm opacity-75">*Based on documented customer results</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => navigate('/assessment')}
              className="bg-white text-purple-700 hover:bg-slate-100"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Trust Assessment
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
              onClick={() => navigate('/demo')}
            >
              <Eye className="h-5 w-5 mr-2" />
              See BEACON Demo
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
              <strong>*Results vary by organization.</strong> Performance metrics based on BEACON customer analysis, 
              Gartner sales acceleration studies, and enterprise B2B benchmark data. Deal velocity improvements 
              range from 25-73% depending on industry, deal size, and implementation scope.
            </p>
            <p>
              <strong>Trust Score correlation:</strong> Data represents enterprise software sales cycles 
              (€50K+ deals, 90+ day average cycles). Individual results depend on market conditions, 
              competitive landscape, and sales process maturity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};