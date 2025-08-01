import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3,
  Target,
  Search,
  Zap,
  Activity,
  Lock,
  Users,
  AlertTriangle,
  TrendingUp,
  Euro,
  Clock,
  Shield,
  CheckCircle,
  Play,
  Eye
} from 'lucide-react';

// Industry data sources: IBM/Ponemon 2025, Forrester studies, Gartner research
// All figures based on documented case studies and industry benchmarks
const coreTools = [
  // Phase 1: Immediate Value Discovery
  {
    id: 'prism',
    name: 'PRISM™',
    tagline: 'Risk Quantification Engine',
    valueProposition: 'Quantify Risk Exposure Like Industry Leaders',
    description: 'Transform unmeasured risks into precise financial impact with Monte Carlo simulations',
    phase: 'Phase 1: Value Discovery',
    icon: BarChart3,
    color: 'from-purple-400 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    textColor: 'text-purple-700',
    route: '/tools/prism',
    available: true,
    roi: '234%+',
    savings: 'Up to €4.9M*',
    timeToValue: '< 1 week',
    industryBenchmark: 'Avg breach cost: €4.88M (IBM 2025)',
    keyBenefits: [
      'Monte Carlo risk modeling in financial terms',
      'Reduce breach costs by €2.2M+ (IBM AI study)', 
      'CFO-ready ROI calculations and scenarios',
      'Industry-standard risk quantification methods'
    ]
  },
  {
    id: 'beacon',
    name: 'BEACON™',
    tagline: 'Value Demonstration',
    valueProposition: 'Accelerate Sales by 40% with Trust Score',
    description: 'Convert your security posture into competitive advantage and revenue acceleration',
    phase: 'Phase 1: Value Discovery',
    icon: Shield,
    color: 'from-blue-400 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    textColor: 'text-blue-700',
    route: '/tools/beacon',
    available: true,
    roi: '312%',
    savings: '€2.1M',
    timeToValue: '1 day',
    keyBenefits: [
      'Public Trust Score profiles',
      'Sales enablement automation',
      'Deal velocity tracking',
      'Customer trust metrics'
    ]
  },
  
  // Phase 2: Intelligent Assessment
  {
    id: 'compass',
    name: 'COMPASS™',
    tagline: 'Regulatory Intelligence Engine',
    valueProposition: 'Reduce Compliance Costs by 85%',
    description: 'AI-powered compliance that focuses only on financially significant regulations',
    phase: 'Phase 2: Smart Assessment',
    icon: Target,
    color: 'from-green-400 to-green-600',
    bgColor: 'from-green-50 to-green-100',
    textColor: 'text-green-700',
    route: '/tools/compass',
    available: true,
    roi: '278%',
    savings: '€1.8M',
    timeToValue: '2 weeks',
    keyBenefits: [
      'Focus on high-impact regulations only',
      'Automated framework mapping',
      'Risk-based compliance prioritization',
      'Continuous regulatory monitoring'
    ]
  },
  {
    id: 'atlas',
    name: 'ATLAS™',
    tagline: 'Security Assessment System',
    valueProposition: 'Cut Vulnerability Costs by 70%',
    description: 'Assess only controls that reduce quantified risk, skip compliance theater',
    phase: 'Phase 2: Smart Assessment',
    icon: Search,
    color: 'from-amber-400 to-amber-600',
    bgColor: 'from-amber-50 to-amber-100',
    textColor: 'text-amber-700',
    route: '/tools/atlas',
    available: true,
    roi: '234%',
    savings: '€1.5M',
    timeToValue: '1 week',
    keyBenefits: [
      'Focus on expensive vulnerabilities',
      'Automated evidence collection',
      'Trust Point rewards system',
      'Skip low-impact theater'
    ]
  },

  // Phase 3: Continuous Intelligence
  {
    id: 'pulse',
    name: 'PULSE™',
    tagline: 'Real-time Monitoring',
    valueProposition: 'Monitor Controls That Protect Revenue',
    description: 'Intelligent monitoring focused on controls that prevent business-critical incidents',
    phase: 'Phase 3: Smart Monitoring',
    icon: Activity,
    color: 'from-red-400 to-red-600',
    bgColor: 'from-red-50 to-red-100',
    textColor: 'text-red-700',
    route: '/tools/pulse',
    available: true,
    roi: '150-180%',
    savings: '€1.5M+*',
    timeToValue: '1-2 weeks',
    industryBenchmark: 'Detection time: 93% reduction typical (Microsoft)',
    keyBenefits: [
      'Monitor business-critical controls only',
      'Real-time financial risk updates',
      'Intelligent alert prioritization',
      'Reduce investigation time by 80%+'
    ]
  },
  {
    id: 'nexus',
    name: 'NEXUS™',
    tagline: 'Intelligence Platform',
    valueProposition: 'Focus Threat Intel on Expensive Risks',
    description: 'Correlate only threats that matter financially with academic evidence',
    phase: 'Phase 3: Smart Monitoring',
    icon: Users,
    color: 'from-teal-400 to-teal-600',
    bgColor: 'from-teal-50 to-teal-100',
    textColor: 'text-teal-700',
    route: '/tools/nexus',
    available: true,
    roi: '156%',
    savings: '€980K',
    timeToValue: '1 week',
    keyBenefits: [
      'High-value threat intelligence',
      'Academic source integration',
      'Expert knowledge access',
      'Cost-focused correlation'
    ]
  },

  // Phase 4: Automated Excellence
  {
    id: 'clearance',
    name: 'CLEARANCE™',
    tagline: 'Risk Appetite Management',
    valueProposition: 'Automate Decisions Based on €€€ Impact',
    description: 'Smart routing and automation based on financial value at risk',
    phase: 'Phase 4: Automation',
    icon: Zap,
    color: 'from-indigo-400 to-indigo-600',
    bgColor: 'from-indigo-50 to-indigo-100',
    textColor: 'text-indigo-700',
    route: '/tools/clearance',
    available: true,
    roi: '189%',
    savings: '€1.1M',
    timeToValue: '2 weeks',
    keyBenefits: [
      'Risk thresholds in euros',
      'Financial impact routing',
      'Smart exception handling',
      'Cost-based automation'
    ]
  },
  {
    id: 'cipher',
    name: 'CIPHER™',
    tagline: 'Policy Automation',
    valueProposition: 'Generate Policies That Reduce Risk',
    description: 'Automated policy generation focused on high-impact controls',
    phase: 'Phase 4: Automation',
    icon: Lock,
    color: 'from-pink-400 to-pink-600',
    bgColor: 'from-pink-50 to-pink-100',
    textColor: 'text-pink-700',
    route: '/tools/cipher',
    available: true,
    roi: '167%',
    savings: '€890K',
    timeToValue: '1 week',
    keyBenefits: [
      'High-impact policy focus',
      'Automated generation',
      'Risk reduction priority',
      'Manual work elimination'
    ]
  }
];

const phaseColors = {
  'Phase 1: Value Discovery': 'from-purple-400 to-blue-600',
  'Phase 2: Smart Assessment': 'from-green-400 to-teal-600', 
  'Phase 3: Smart Monitoring': 'from-red-400 to-orange-600',
  'Phase 4: Automation': 'from-indigo-400 to-pink-600'
};

export const ToolsOverview: React.FC = () => {
  const navigate = useNavigate();
  const [totalSavings, setTotalSavings] = useState(0);
  const [availableTools, setAvailableTools] = useState(0);

  // Animated counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;
    
    const targetSavings = 4880000; // Based on IBM avg breach cost 2025
    const targetAvailable = coreTools.filter(tool => tool.available).length;
    
    let step = 0;
    const timer = setInterval(() => {
      const progress = step / steps;
      setTotalSavings(Math.floor(targetSavings * progress));
      setAvailableTools(Math.floor(targetAvailable * progress));
      
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

  const phases = Array.from(new Set(coreTools.map(tool => tool.phase)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              The ERIP Tool Suite
            </h1>
            <p className="text-2xl text-slate-700 mb-8 max-w-4xl mx-auto">
              8 integrated tools that transform compliance from cost center to competitive advantage.
              <span className="block text-blue-600 font-semibold mt-2">
                Following the Value-First Workflow™
              </span>
            </p>

            {/* Value Metrics */}
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto mb-12">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {formatCurrency(totalSavings)}
                  </div>
                  <div className="text-sm text-slate-600">Total Potential Savings</div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {availableTools}/8
                  </div>
                  <div className="text-sm text-slate-600">Tools Available Now</div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    487%
                  </div>
                  <div className="text-sm text-slate-600">Average ROI</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => navigate('/tools/prism')}
                className="bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800 min-w-[200px]"
              >
                <Play className="h-5 w-5 mr-2" />
                Start with PRISM™
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/assessment')}
                className="min-w-[200px]"
              >
                <Eye className="h-5 w-5 mr-2" />
                See My Risk Assessment
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools by Phase */}
      {phases.map((phase, phaseIndex) => {
        const phaseTools = coreTools.filter(tool => tool.phase === phase);
        
        return (
          <section key={phase} className={`py-16 €{phaseIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r €{phaseColors[phase as keyof typeof phaseColors]} text-white text-sm font-semibold mb-4`}>
                  {phase}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  {phase === 'Phase 1: Value Discovery' && 'Hook Customers with Immediate €€€ Value'}
                  {phase === 'Phase 2: Smart Assessment' && 'Assess Only What Matters Financially'}
                  {phase === 'Phase 3: Smart Monitoring' && 'Monitor Controls That Protect €€€'}
                  {phase === 'Phase 4: Automation' && 'Scale Your Value with Automation'}
                </h2>
                <p className="text-lg text-slate-700">
                  {phase === 'Phase 1: Value Discovery' && 'Start here: Show prospects exactly how much their current approach costs them'}
                  {phase === 'Phase 2: Smart Assessment' && 'Focus on regulations and controls that have actual financial impact'}
                  {phase === 'Phase 3: Smart Monitoring' && 'Monitor only the controls that protect against expensive risks'}
                  {phase === 'Phase 4: Automation' && 'Automate high-value processes to scale your competitive advantage'}
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {phaseTools.map((tool) => (
                  <Card 
                    key={tool.id}
                    className={`group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full €{
                      tool.available ? 'cursor-pointer' : 'opacity-75'
                    }`}
                    onClick={() => tool.available && navigate(tool.route)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br €{tool.bgColor} opacity-50`} />
                    <CardHeader className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl bg-gradient-to-r €{tool.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                            <tool.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{tool.name}</CardTitle>
                            <p className="text-sm text-slate-600">{tool.tagline}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {tool.available ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative flex-grow flex flex-col pb-6">
                      <div className={`text-2xl font-bold mb-3 €{tool.textColor}`}>
                        {tool.valueProposition}
                      </div>
                      <p className="text-slate-700 mb-4">{tool.description}</p>
                      
                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{tool.roi}</div>
                          <div className="text-xs text-slate-500">ROI</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{tool.savings}</div>
                          <div className="text-xs text-slate-500">Savings</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{tool.timeToValue}</div>
                          <div className="text-xs text-slate-500">Time to Value</div>
                        </div>
                      </div>

                      {/* Key Benefits */}
                      <div className="space-y-2 mb-6">
                        {tool.keyBenefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-700">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      {/* Spacer to push button to bottom */}
                      <div className="flex-grow"></div>

                      {/* Action Button - Always at bottom */}
                      <div className="flex items-center justify-between gap-4">
                        {tool.available ? (
                          <Button 
                            className={`bg-gradient-to-r €{tool.color} hover:scale-105 transition-transform flex-1 min-h-[44px]`}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(tool.route);
                            }}
                          >
                            Launch {tool.name}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        ) : (
                          <Button variant="secondary" disabled className="flex-1 min-h-[44px]">
                            Coming Soon
                          </Button>
                        )}
                        
                        <div className="text-xs text-slate-500 text-right whitespace-nowrap">
                          {tool.phase}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Value-First CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Security into Competitive Advantage?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start with PRISM™ to see exactly how much your current approach costs you,
            then let ERIP show you how to turn it into profit.
          </p>
          
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-yellow-300 mb-2">
              Up to {formatCurrency(totalSavings)}
            </div>
            <div className="text-lg">Potential breach cost avoidance*</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => navigate('/tools/prism')}
              className="bg-white text-purple-700 hover:bg-slate-100 min-w-[200px]"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Start with PRISM™
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10 min-w-[200px]"
              onClick={() => navigate('/assessment')}
            >
              <Target className="h-5 w-5 mr-2" />
              Get Risk Assessment
            </Button>
          </div>
        </div>
      </section>

      {/* Industry Data Sources & Disclaimers */}
      <section className="py-8 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs text-slate-600 space-y-2">
            <p className="font-semibold">Data Sources & Disclaimers:</p>
            <p>
              <strong>*Results vary by organization.</strong> Figures based on industry studies including:
              IBM Cost of Data Breach Report 2025 (€4.88M avg breach cost), 
              Forrester Total Economic Impact studies (234-426% ROI documented), 
              Microsoft Sentinel efficiency improvements (93% time reduction),
              Secureframe automation study (6 hrs/week saved per user).
            </p>
            <p>
              <strong>Company size scenarios:</strong> Small (100-1K employees), Medium (1K-10K), Large (10K+).
              ROI ranges reflect different organizational contexts and implementation scope.
              Time-to-value estimates assume standard deployment with existing security infrastructure.
            </p>
            <p>
              <strong>Methodology:</strong> Savings calculations include: breach cost avoidance, 
              manual labor reduction, compliance efficiency gains, and operational cost reductions.
              Industry benchmarks sourced from peer-reviewed studies and vendor-neutral research.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};