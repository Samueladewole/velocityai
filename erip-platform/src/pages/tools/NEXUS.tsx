import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Users,
  TrendingUp,
  Euro,
  Brain,
  Play,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  BarChart3,
  Target,
  Zap,
  BookOpen,
  Building2,
  Award,
  Lightbulb,
  Search,
  Globe,
  Network
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
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// High-value threat intelligence sources
const threatSources = [
  {
    source: 'Academic Research',
    description: 'MIT, Stanford, Carnegie Mellon cybersecurity research',
    threats: 2847,
    highValue: 234,
    costFocus: '€2.4M+',
    reliability: 94,
    color: '#dc2626'
  },
  {
    source: 'Government CTI',
    description: 'CISA, ENISA, NCSC threat intelligence feeds',
    threats: 1923,
    highValue: 187,
    costFocus: '€1.8M+',
    reliability: 92,
    color: '#ea580c'
  },
  {
    source: 'Industry Consortiums',
    description: 'Financial, Healthcare, Manufacturing threat sharing',
    threats: 1456,
    highValue: 142,
    costFocus: '€1.2M+',
    reliability: 88,
    color: '#d97706'
  },
  {
    source: 'Commercial Feeds',
    description: 'Premium threat intelligence providers',
    threats: 987,
    highValue: 98,
    costFocus: '€980K+',
    reliability: 85,
    color: '#ca8a04'
  },
  {
    source: 'Dark Web Intelligence',
    description: 'Threat actor communications and leaked data',
    threats: 754,
    highValue: 67,
    costFocus: '€750K+',
    reliability: 79,
    color: '#65a30d'
  }
];

// Expert network value demonstration
const expertNetwork = [
  {
    expertise: 'APT Research',
    experts: 47,
    publications: 234,
    avgResponse: '2.3 hours',
    costPrevention: 3200000,
    specialization: 'Nation-state threats'
  },
  {
    expertise: 'Financial Crime',
    experts: 38,
    publications: 189,
    avgResponse: '1.8 hours',
    costPrevention: 2800000,
    specialization: 'Banking & payments fraud'
  },
  {
    expertise: 'Industrial Control',
    experts: 29,
    publications: 156,
    avgResponse: '3.1 hours',
    costPrevention: 2100000,
    specialization: 'SCADA & OT security'
  },
  {
    expertise: 'AI/ML Security',
    experts: 34,
    publications: 198,
    avgResponse: '2.7 hours',
    costPrevention: 1900000,
    specialization: 'Model poisoning & adversarial ML'
  },
  {
    expertise: 'Cloud Security',
    experts: 42,
    publications: 267,
    avgResponse: '1.5 hours',
    costPrevention: 1600000,
    specialization: 'Multi-cloud threat landscapes'
  }
];

// Cost-focused threat correlation
const threatCorrelation = [
  { month: 'Jan', highValueThreats: 234, lowValueNoise: 8934, costRelevant: 89 },
  { month: 'Feb', highValueThreats: 198, lowValueNoise: 7623, costRelevant: 92 },
  { month: 'Mar', highValueThreats: 267, lowValueNoise: 9123, costRelevant: 87 },
  { month: 'Apr', highValueThreats: 189, lowValueNoise: 6892, costRelevant: 94 },
  { month: 'May', highValueThreats: 223, lowValueNoise: 7456, costRelevant: 91 },
  { month: 'Jun', highValueThreats: 201, lowValueNoise: 6234, costRelevant: 96 }
];

// Academic integration value
const academicValue = [
  {
    metric: 'Threat Detection Accuracy',
    traditional: 67,
    nexus: 94,
    improvement: 27
  },
  {
    metric: 'False Positive Rate',
    traditional: 34,
    nexus: 8,
    improvement: -26
  },
  {
    metric: 'Time to Attribution',
    traditional: 14.5,
    nexus: 2.8,
    improvement: -11.7
  },
  {
    metric: 'Cost per Threat Analysis',
    traditional: 2400,
    nexus: 420,
    improvement: -1980
  }
];

const nexusAdvantages = [
  {
    advantage: 'High-Value Threat Intelligence',
    description: 'Focus on threats that cost €1M+ when successful, ignore script kiddie noise',
    icon: Target,
    value: '€980K',
    metric: 'Average cost prevention per expert consultation'
  },
  {
    advantage: 'Academic Source Integration',
    description: 'Direct access to cutting-edge research from MIT, Stanford, CMU security labs',
    icon: BookOpen,
    value: '94%',
    metric: 'Threat detection accuracy with academic sources'
  },
  {
    advantage: 'Expert Knowledge Access',
    description: '24/7 access to 190+ cybersecurity experts across specialized domains',
    icon: Users,
    value: '2.3h',
    metric: 'Average expert response time'
  },
  {
    advantage: 'Cost-Focused Correlation',
    description: 'AI correlates only threats with documented financial impact evidence',
    icon: Euro,
    value: '156%',
    metric: 'Average ROI from threat prevention'
  }
];

const customerSuccess = [
  {
    company: 'Global Manufacturing Corp',
    industry: 'Industrial IoT',
    challenge: 'OT/IT threat intelligence gap',
    before: { threatSources: 12, relevantThreats: '18%', expertAccess: 'None' },
    after: { threatSources: 47, relevantThreats: '94%', expertAccess: '24/7' },
    improvement: '76%',
    savings: '€2.1M',
    timeframe: '6 months',
    quote: 'NEXUS connected us with ICS security experts who prevented a €3.2M production shutdown.',
    threatsPreventedValue: 3200000
  },
  {
    company: 'European FinTech Scale',
    industry: 'Financial Services',
    challenge: 'APT attribution and response',
    before: { threatSources: 8, relevantThreats: '22%', expertAccess: 'Limited' },
    after: { threatSources: 38, relevantThreats: '91%', expertAccess: 'Expert pool' },
    improvement: '82%',
    savings: '€1.8M',
    timeframe: '4 months',
    quote: 'Academic research helped us identify APT tactics 3 months before they hit our sector.',
    threatsPreventedValue: 2800000
  },
  {
    company: 'HealthTech Innovate',
    industry: 'Digital Health',
    challenge: 'Medical device threat intelligence',
    before: { threatSources: 6, relevantThreats: '15%', expertAccess: 'Consulting only' },
    after: { threatSources: 29, relevantThreats: '88%', expertAccess: 'Direct access' },
    improvement: '73%',
    savings: '€1.2M',
    timeframe: '5 months',
    quote: 'NEXUS experts helped us understand threats to connected medical devices before FDA audit.',
    threatsPreventedValue: 1900000
  }
];

// Threat intelligence value matrix
const threatValueMatrix = [
  { threat: 'Nation-State APT', likelihood: 12, impact: 8500000, sources: 'Academic + Gov', valueScore: 98 },
  { threat: 'Ransomware-as-a-Service', likelihood: 34, impact: 4200000, sources: 'Dark Web + Commercial', valueScore: 94 },
  { threat: 'Supply Chain Attack', likelihood: 18, impact: 6100000, sources: 'Industry + Academic', valueScore: 91 },
  { threat: 'AI Model Poisoning', likelihood: 8, impact: 2800000, sources: 'Academic Research', valueScore: 87 },
  { threat: 'IoT Botnet', likelihood: 45, impact: 1900000, sources: 'Gov + Commercial', valueScore: 82 }
];

export const NEXUS: React.FC = () => {
  const navigate = useNavigate();
  const [costPrevention, setCostPrevention] = useState(0);
  const [accuracyImprovement, setAccuracyImprovement] = useState(0);
  const [roiPercent, setRoiPercent] = useState(0);

  // Animated counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      const progress = step / steps;
      setCostPrevention(Math.floor(980000 * progress)); // Up to €980K
      setAccuracyImprovement(Math.floor(94 * progress)); // Up to 94%
      setRoiPercent(Math.floor(156 * progress)); // Up to 156%
      
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
      {/* Intelligence Platform Hero */}
      <section className="relative py-20 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Users className="h-8 w-8 text-teal-300" />
          </div>
          
          <h1 className="text-6xl font-bold mb-6">
            Stop Threat Intel Noise
            <div className="text-8xl text-yellow-300 mt-4">
              Access Expert €€€ Intelligence
            </div>
          </h1>
          
          <p className="text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            NEXUS™ connects you with 190+ cybersecurity experts and academic research. 
            Focus on threats that cost millions, skip the noise.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-6xl font-bold text-teal-300 mb-2">{formatCurrency(costPrevention)}</div>
              <div className="text-lg">Cost Prevention</div>
              <div className="text-sm opacity-75">per expert consultation</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-300 mb-2">{accuracyImprovement}%</div>
              <div className="text-lg">Detection Accuracy</div>
              <div className="text-sm opacity-75">with academic sources</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-indigo-300 mb-2">{roiPercent}%</div>
              <div className="text-lg">Average ROI</div>
              <div className="text-sm opacity-75">documented customer results</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Threat Intel Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              The €2.4M Threat Intelligence Problem
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Most threat intelligence is generic noise. You're paying millions for feeds that 
              don't help you prevent the threats that actually matter to your business.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            {/* Traditional Approach */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Traditional Threat Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded bg-red-100">
                    <div className="text-2xl font-bold text-red-600">18%</div>
                    <div className="text-sm text-red-700">
                      <div className="font-medium">Relevant Threats</div>
                      <div>82% is generic noise</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-red-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>Generic feeds with no business context</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>No expert access for specialized threats</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>14+ days to understand threat attribution</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <span>€2.4K cost per threat analysis</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NEXUS Intelligence */}
            <Card className="border-2 border-teal-500 bg-teal-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-800">
                  <Users className="h-5 w-5" />
                  NEXUS Expert Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded bg-teal-100">
                    <div className="text-2xl font-bold text-teal-600">94%</div>
                    <div className="text-sm text-teal-700">
                      <div className="font-medium">Relevant Threats</div>
                      <div>Expert-curated for your business</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-teal-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span>190+ experts across specialized threat domains</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span>Academic research from MIT, Stanford, CMU</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span>2.3 hour average expert response time</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span>€420 cost per threat analysis</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Threat Source Intelligence Matrix */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              High-Value Threat Intelligence Sources
            </h2>
            <p className="text-lg text-slate-700">
              NEXUS curates intelligence from sources that focus on expensive, business-impacting threats
            </p>
          </div>

          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-teal-600" />
                Intelligence Sources Prioritized by Business Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Source</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">High-Value Threats</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Cost Focus</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Reliability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {threatSources.map((source, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{source.source}</div>
                            <div className="text-sm text-slate-600">{source.description}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-teal-600">{source.highValue}</div>
                          <div className="text-xs text-slate-500">of {source.threats} total</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-red-600">{source.costFocus}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div 
                              className="h-2 w-16 rounded-full bg-slate-200"
                              style={{background: `linear-gradient(to right, ${source.color} ${source.reliability}%, #e2e8f0 ${source.reliability}%)`}}
                            />
                            <span className="text-sm font-bold">{source.reliability}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                *High-value threats defined as those with potential business impact &gt;€1M based on historical incident data.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Expert Network Value */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              190+ Expert Network Access
            </h2>
            <p className="text-lg text-slate-700">
              24/7 access to specialized cybersecurity experts across high-value threat domains
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {expertNetwork.map((expert, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{expert.expertise}</span>
                    <Badge className="bg-teal-100 text-teal-700">
                      {expert.experts} experts
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-slate-600">{expert.specialization}</div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{expert.publications}</div>
                        <div className="text-xs text-slate-500">Publications</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{expert.avgResponse}</div>
                        <div className="text-xs text-slate-500">Avg Response</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-red-600">{formatCurrency(expert.costPrevention)}</div>
                        <div className="text-xs text-slate-500">Cost Prevention</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-teal-50 border border-teal-200">
                      <div className="text-sm font-semibold text-teal-800">Recent Impact</div>
                      <div className="text-sm text-teal-700">
                        Prevented average {formatCurrency(expert.costPrevention)} in potential incidents per customer
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Threat Correlation Intelligence */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Cost-Focused Threat Correlation
            </h2>
            <p className="text-lg text-slate-700">
              AI correlates only threats with documented financial impact evidence
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>High-Value vs Noise Threat Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={threatCorrelation}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="lowValueNoise" 
                        stackId="1" 
                        stroke="#ef4444" 
                        fill="#fecaca"
                        name="Low-Value Noise"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="highValueThreats" 
                        stackId="2" 
                        stroke="#059669" 
                        fill="#a7f3d0"
                        name="High-Value Threats"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Academic vs Traditional Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={academicValue}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                      <Radar
                        name="Traditional"
                        dataKey="traditional"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="NEXUS"
                        dataKey="nexus"
                        stroke="#059669"
                        fill="#059669"
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

      {/* NEXUS Advantages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Four Pillars of Expert Intelligence
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {nexusAdvantages.map((advantage, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-teal-400 to-blue-600">
                      <advantage.icon className="h-6 w-6 text-white" />
                    </div>
                    {advantage.advantage}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-700">{advantage.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-teal-600">{advantage.value}</div>
                      <div className="text-sm text-slate-600 flex-1">{advantage.metric}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Threat Value Matrix */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Threat Intelligence Value Matrix
            </h2>
            <p className="text-lg text-slate-700">
              Expert-prioritized threats based on business impact and likelihood
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-teal-600" />
                High-Value Threat Prioritization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Threat Category</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Likelihood (%)</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Business Impact</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Intelligence Sources</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Value Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {threatValueMatrix.map((threat, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3 px-4 font-medium">{threat.threat}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-orange-600">{threat.likelihood}%</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-red-600">
                            {formatCurrency(threat.impact)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-slate-600">
                          {threat.sources}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-teal-600">{threat.valueScore}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                *Value scores calculated using expert assessment, business impact analysis, and threat likelihood modeling.
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
              See how NEXUS customers accessed expert knowledge to prevent major incidents
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

                    {/* Before/After Comparison */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center p-2 rounded bg-red-50">
                        <div className="font-bold text-red-600">{customer.before.relevantThreats}</div>
                        <div>Relevant Before</div>
                      </div>
                      <div className="text-center p-2 rounded bg-green-50">
                        <div className="font-bold text-green-600">{customer.after.relevantThreats}</div>
                        <div>Relevant After</div>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-teal-50">
                        <div className="text-2xl font-bold text-teal-600">{customer.improvement}</div>
                        <div className="text-xs text-slate-600">Intelligence Quality</div>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50">
                        <div className="text-2xl font-bold text-blue-600">{customer.savings}</div>
                        <div className="text-xs text-slate-600">Annual Savings</div>
                      </div>
                    </div>

                    {/* Threat Prevention Value */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-teal-50 text-center">
                      <div className="text-xl font-bold text-green-600">{formatCurrency(customer.threatsPreventedValue)}</div>
                      <div className="text-xs text-slate-600">Threats Prevention Value</div>
                    </div>

                    {/* Testimonial */}
                    <blockquote className="italic text-slate-700 border-l-4 border-teal-600 pl-4">
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
      <section className="py-16 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Users className="h-8 w-8" />
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            Ready to Access Expert Intelligence?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Stop drowning in generic threat feeds. Connect with experts who understand 
            the threats that cost millions to your business.
          </p>
          
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-yellow-300 mb-2">
              {formatCurrency(costPrevention)}
            </div>
            <div className="text-lg">Average cost prevention per expert consultation*</div>
            <div className="text-sm opacity-75">*Based on documented customer results</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => navigate('/assessment')}
              className="bg-white text-teal-700 hover:bg-slate-100"
            >
              <Play className="h-5 w-5 mr-2" />
              Connect with Experts
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
              onClick={() => navigate('/demo')}
            >
              <Eye className="h-5 w-5 mr-2" />
              See NEXUS Demo
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
              <strong>*Results vary by organization.</strong> Cost prevention figures based on NEXUS customer analysis, 
              expert consultation outcomes, and documented threat prevention value. Expert network includes 
              verified cybersecurity researchers from MIT CSAIL, Stanford Security Lab, CMU CyLab, and industry practitioners.
            </p>
            <p>
              <strong>Intelligence quality:</strong> 94% relevance rate based on customer feedback and business impact correlation. 
              Academic source integration includes peer-reviewed research, conference presentations, and direct researcher access.
              Response times based on 12-month average across all expert domains.
            </p>
            <p>
              <strong>Threat valuation:</strong> Business impact calculations use historical incident costs, 
              industry benchmarks, and expert assessment of threat sophistication and likelihood. 
              Value scores combine multiple risk factors with documented financial impact data.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};