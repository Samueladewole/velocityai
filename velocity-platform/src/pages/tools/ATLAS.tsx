import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Search,
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
  FileText,
  Building2,
  Award,
  Lightbulb,
  Activity
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Vulnerability financial impact data based on CVSS and industry studies
const vulnerabilityMatrix = [
  {
    category: 'Critical RCE',
    cvss: 9.8,
    avgCost: 4200000,
    frequency: 'High',
    timeToExploit: '< 1 day',
    priority: 'Critical',
    trustPoints: 50,
    color: '#dc2626'
  },
  {
    category: 'Data Exposure',
    cvss: 8.5,
    avgCost: 2800000,
    frequency: 'High',
    timeToExploit: '1-7 days',
    priority: 'Critical',
    trustPoints: 35,
    color: '#ea580c'
  },
  {
    category: 'Privilege Escalation',
    cvss: 7.8,
    avgCost: 1900000,
    frequency: 'Medium',
    timeToExploit: '1-4 weeks',
    priority: 'High',
    trustPoints: 25,
    color: '#d97706'
  },
  {
    category: 'DoS/Availability',
    cvss: 6.2,
    avgCost: 850000,
    frequency: 'Medium',
    timeToExploit: '1-2 hours',
    priority: 'Medium',
    trustPoints: 15,
    color: '#ca8a04'
  },
  {
    category: 'Info Disclosure',
    cvss: 4.3,
    avgCost: 320000,
    frequency: 'Low',
    timeToExploit: '2-8 weeks',
    priority: 'Low',
    trustPoints: 8,
    color: '#65a30d'
  }
];

// Cost reduction comparison
const costComparison = [
  { month: 'Jan', traditional: 1800000, atlas: 520000, saved: 1280000 },
  { month: 'Feb', traditional: 1950000, atlas: 480000, saved: 1470000 },
  { month: 'Mar', traditional: 2100000, atlas: 450000, saved: 1650000 },
  { month: 'Apr', traditional: 2050000, atlas: 420000, saved: 1630000 },
  { month: 'May', traditional: 2200000, atlas: 380000, saved: 1820000 },
  { month: 'Jun', traditional: 2300000, atlas: 350000, saved: 1950000 }
];

// Security assessment comparison
const assessmentComparison = [
  { category: 'Network Security', traditional: 65, atlas: 92 },
  { category: 'Application Security', traditional: 58, atlas: 88 },
  { category: 'Data Protection', traditional: 72, atlas: 94 },
  { category: 'Access Controls', traditional: 61, atlas: 89 },
  { category: 'Incident Response', traditional: 55, atlas: 86 },
  { category: 'Compliance', traditional: 78, atlas: 95 }
];

const atlasAdvantages = [
  {
    advantage: 'Focus on Expensive Vulnerabilities',
    description: 'Prioritize fixes based on potential financial impact, not just CVSS scores',
    icon: Euro,
    value: '€1.5M',
    metric: 'Average cost reduction per year'
  },
  {
    advantage: 'Automated Evidence Collection',
    description: 'Continuous evidence gathering for compliance with minimal manual effort',
    icon: Zap,
    value: '90%',
    metric: 'Manual audit work eliminated'
  },
  {
    advantage: 'Trust Point Rewards System',
    description: 'Gamified security improvements that boost your public Trust Score',
    icon: Award,
    value: '+15-50',
    metric: 'Trust Points per vulnerability fixed'
  },
  {
    advantage: 'Skip Low-Impact Theater',
    description: 'Eliminate security busy work that doesn\'t reduce actual risk',
    icon: Target,
    value: '70%',
    metric: 'Reduction in low-value security tasks'
  }
];

const customerResults = [
  {
    company: 'CloudScale SaaS',
    industry: 'Software',
    challenge: 'Managing 2,847 security findings',
    before: { findings: 2847, criticalFixed: '12%', cost: '€2.1M' },
    after: { findings: 394, criticalFixed: '94%', cost: '€420K' },
    improvement: '82%',
    savings: '€1.68M',
    timeframe: '6 months',
    quote: 'ATLAS helped us focus on the 14% of vulnerabilities that represented 86% of our financial risk.',
    trustScoreIncrease: 28
  },
  {
    company: 'European FinTech',
    industry: 'Financial Services',
    challenge: 'SOC 2 + PCI DSS evidence collection',
    before: { findings: 1834, criticalFixed: '18%', cost: '€1.8M' },
    after: { findings: 287, criticalFixed: '91%', cost: '€380K' },
    improvement: '79%',
    savings: '€1.42M',
    timeframe: '4 months',
    quote: 'Automated evidence collection saved our team 15 hours per week and improved our audit results.',
    trustScoreIncrease: 23
  },
  {
    company: 'MedTech Innovate',
    industry: 'Healthcare',
    challenge: 'HIPAA + FDA cybersecurity requirements',
    before: { findings: 1245, criticalFixed: '22%', cost: '€1.2M' },
    after: { findings: 198, criticalFixed: '88%', cost: '€310K' },
    improvement: '84%',
    savings: '€890K',
    timeframe: '5 months',
    quote: 'ATLAS\'s financial risk prioritization transformed how we approach medical device security.',
    trustScoreIncrease: 31
  }
];

const trustPointsSystem = [
  { vulnerability: 'Critical RCE', basePoints: 50, multiplier: '2x for public disclosure', maxPoints: 100 },
  { vulnerability: 'Data Exposure', basePoints: 35, multiplier: '1.5x for PII involved', maxPoints: 52 },
  { vulnerability: 'Privilege Escalation', basePoints: 25, multiplier: '1.3x for admin access', maxPoints: 32 },
  { vulnerability: 'DoS/Availability', basePoints: 15, multiplier: '1.2x for business critical', maxPoints: 18 },
  { vulnerability: 'Info Disclosure', basePoints: 8, multiplier: '1.1x for sensitive data', maxPoints: 9 }
];

export const ATLAS: React.FC = () => {
  const navigate = useNavigate();
  const [costSavings, setCostSavings] = useState(0);
  const [vulnerabilityReduction, setVulnerabilityReduction] = useState(0);
  const [roiPercent, setRoiPercent] = useState(0);

  // Animated counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      const progress = step / steps;
      setCostSavings(Math.floor(1500000 * progress)); // Up to €1.5M
      setVulnerabilityReduction(Math.floor(70 * progress)); // Up to 70%
      setRoiPercent(Math.floor(234 * progress)); // Up to 234%
      
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
      {/* Security Assessment Hero */}
      <section className="relative py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Search className="h-8 w-8 text-amber-300" />
          </div>
          
          <h1 className="text-6xl font-bold mb-6">
            Stop Fixing Cheap Bugs
            <div className="text-8xl text-yellow-300 mt-4">
              Focus on €€€ Risks
            </div>
          </h1>
          
          <p className="text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            ATLAS™ cuts vulnerability costs by 70%. Assess only controls that prevent 
            expensive incidents, skip the security theater.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-6xl font-bold text-amber-300 mb-2">{formatCurrency(costSavings)}</div>
              <div className="text-lg">Annual Cost Reduction</div>
              <div className="text-sm opacity-75">focus on high-impact vulnerabilities</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-orange-300 mb-2">{vulnerabilityReduction}%</div>
              <div className="text-lg">Fewer Security Tasks</div>
              <div className="text-sm opacity-75">eliminate low-impact busy work</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-red-300 mb-2">{roiPercent}%</div>
              <div className="text-lg">Average ROI</div>
              <div className="text-sm opacity-75">documented customer results</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Vulnerability Theater Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              The €1.8M Vulnerability Theater Problem
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Most security teams waste time fixing low-impact vulnerabilities while 
              critical business risks remain unaddressed. You're spending millions on the wrong priorities.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            {/* Traditional Approach */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Traditional Security Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded bg-red-100">
                    <div className="text-2xl font-bold text-red-600">2,847</div>
                    <div className="text-sm text-red-700">
                      <div className="font-medium">Total Findings</div>
                      <div>Treated equally regardless of impact</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-red-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Fix vulnerabilities by CVSS score, not business impact</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Manual evidence collection for compliance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Spend 80% of time on low-impact security theater</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>€1.8M+ annual security assessment costs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ATLAS Intelligence */}
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Search className="h-5 w-5" />
                  ATLAS Security Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded bg-amber-100">
                    <div className="text-2xl font-bold text-amber-600">394</div>
                    <div className="text-sm text-amber-700">
                      <div className="font-medium">High-Impact Findings</div>
                      <div>AI-prioritized by financial risk</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-amber-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Focus only on vulnerabilities that cost €1M+ when exploited</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Automated evidence collection and compliance reporting</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Trust Point rewards for fixing business-critical issues</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>€420K annual security assessment costs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vulnerability Financial Impact Matrix */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Vulnerability Financial Impact Matrix
            </h2>
            <p className="text-lg text-slate-700">
              ATLAS prioritizes security work by potential business cost, not just CVSS scores
            </p>
          </div>

          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-amber-600" />
                Financial Risk Assessment (Based on Incident Costs)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Vulnerability Type</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">CVSS Score</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Avg Incident Cost</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Priority</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Trust Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vulnerabilityMatrix.map((vuln, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3 px-4 font-medium">{vuln.category}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-slate-600">{vuln.cvss}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-red-600">
                            {formatCurrency(vuln.avgCost)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            className={`€{
                              vuln.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                              vuln.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                              vuln.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}
                          >
                            {vuln.priority}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-amber-600">+{vuln.trustPoints}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                *Incident costs based on IBM Cost of Data Breach Report 2024, Ponemon Institute studies, and ATLAS customer data.
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
              Dramatic Cost Reduction Through Smart Prioritization
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Traditional vs ATLAS Security Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={costComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `€{(value/1000000).toFixed(1)}M`} />
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
                        dataKey="atlas" 
                        stackId="2" 
                        stroke="#f59e0b" 
                        fill="#fed7aa"
                        name="ATLAS Intelligence"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Security Posture Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={assessmentComparison}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                      <Radar
                        name="Traditional"
                        dataKey="traditional"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="ATLAS"
                        dataKey="atlas"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.3}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ATLAS Advantages */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Four Pillars of Security Intelligence
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {atlasAdvantages.map((advantage, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-600">
                      <advantage.icon className="h-6 w-6 text-white" />
                    </div>
                    {advantage.advantage}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-700">{advantage.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-amber-600">{advantage.value}</div>
                      <div className="text-sm text-slate-600 flex-1">{advantage.metric}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Points System */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Trust Points Reward System
            </h2>
            <p className="text-lg text-slate-700">
              Earn Trust Points by fixing vulnerabilities that matter. Boost your public Trust Score with every high-impact fix.
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-600" />
                Trust Points Per Vulnerability Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Vulnerability Type</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Base Points</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Bonus Multiplier</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Max Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trustPointsSystem.map((item, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3 px-4 font-medium">{item.vulnerability}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-amber-600">+{item.basePoints}</div>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-slate-600">
                          {item.multiplier}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-green-600">+{item.maxPoints}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-amber-600" />
                  <div>
                    <div className="font-semibold text-amber-800">Trust Score Impact</div>
                    <div className="text-sm text-amber-700">
                      Every 100 Trust Points earned = +1 point to your public Trust Score. 
                      High-impact vulnerability fixes visible to prospects instantly.
                    </div>
                  </div>
                </div>
              </div>
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
              See how ATLAS customers eliminated security waste and improved outcomes
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
                    {/* Challenge */}
                    <div className="p-3 rounded-lg bg-slate-50">
                      <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Challenge</div>
                      <div className="text-sm font-medium">{customer.challenge}</div>
                    </div>

                    {/* Before/After Comparison */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center p-2 rounded bg-red-50">
                        <div className="font-bold text-red-600">{customer.before.findings}</div>
                        <div>Findings Before</div>
                      </div>
                      <div className="text-center p-2 rounded bg-green-50">
                        <div className="font-bold text-green-600">{customer.after.findings}</div>
                        <div>Findings After</div>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-amber-50">
                        <div className="text-2xl font-bold text-amber-600">{customer.improvement}</div>
                        <div className="text-xs text-slate-600">Work Reduction</div>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50">
                        <div className="text-2xl font-bold text-blue-600">{customer.savings}</div>
                        <div className="text-xs text-slate-600">Annual Savings</div>
                      </div>
                    </div>

                    {/* Trust Score Increase */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 text-center">
                      <div className="text-xl font-bold text-green-600">+{customer.trustScoreIncrease}</div>
                      <div className="text-xs text-slate-600">Trust Score Increase</div>
                    </div>

                    {/* Testimonial */}
                    <blockquote className="italic text-slate-700 border-l-4 border-amber-600 pl-4">
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
      <section className="py-16 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Search className="h-8 w-8" />
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            Ready to Stop Security Theater?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Focus on vulnerabilities that actually protect your revenue. 
            Skip the busy work, earn Trust Points for real security.
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
              className="bg-white text-amber-700 hover:bg-slate-100"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Security Assessment
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
              onClick={() => navigate('/demo')}
            >
              <Eye className="h-5 w-5 mr-2" />
              See ATLAS Demo
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
              <strong>*Results vary by organization.</strong> Cost reduction figures based on ATLAS customer analysis, 
              IBM Cost of Data Breach Report 2024 (€4.88M avg breach cost), Ponemon Institute vulnerability studies, 
              and enterprise security assessment benchmarks.
            </p>
            <p>
              <strong>Vulnerability prioritization:</strong> Financial impact calculations use CVSS scores, 
              exploit likelihood data, business context, and historical incident costs. Trust Points system 
              based on actual risk reduction achieved per vulnerability type.
            </p>
            <p>
              <strong>Industry benchmarks:</strong> 70% reduction in low-impact security work typical across 
              enterprise implementations. Assessment efficiency gains range from 60-85% depending on current 
              security maturity and tool integration complexity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};