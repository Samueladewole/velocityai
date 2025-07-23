import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
// import { CurrencyDisplay } from '@/components/CurrencyDisplay';
import { 
  Shield,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  Sparkles,
  BookOpen,
  BarChart3,
  Calculator,
  Activity,
  FileText,
  Network,
  Lightbulb,
  Globe,
  Layers,
  GitBranch,
  Workflow,
  Target,
  Eye,
  ChevronRight,
  Play,
  Info,
  Menu,
  X,
  Phone,
  Mail,
  Download,
  Brain,
  AlertTriangle,
  Zap,
  Award
} from 'lucide-react';

export const LandingEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showValueProof, setShowValueProof] = useState(false);

  const components = [
    {
      id: 'compass',
      name: 'COMPASS',
      title: 'Regulatory Intelligence',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      description: 'Stay ahead of regulatory changes with AI-powered compliance tracking',
      features: [
        'Real-time regulatory updates across jurisdictions',
        'Automated compliance gap analysis',
        'Framework mapping (GDPR, SOX, ISO, etc.)',
        'Regulatory change impact assessment'
      ],
      benefits: 'Reduce compliance costs by 40% and avoid regulatory penalties',
      metrics: ['95% compliance rate', '200+ frameworks', '24/7 monitoring'],
      integrates: ['atlas', 'cipher', 'beacon']
    },
    {
      id: 'atlas',
      name: 'ATLAS',
      title: 'Security Assessment System',
      icon: Shield,
      color: 'from-slate-600 to-blue-700',
      bgColor: 'from-slate-50 to-blue-50',
      description: 'Multi-cloud security posture assessment with automated vulnerability detection',
      features: [
        'Continuous security scanning across AWS, Azure, GCP',
        'AI-powered vulnerability prioritization',
        'Automated penetration testing',
        'Real-time threat detection'
      ],
      benefits: 'Identify and fix vulnerabilities 75% faster',
      metrics: ['247 assets monitored', '3 cloud platforms', '24/7 scanning'],
      integrates: ['prism', 'nexus', 'pulse']
    },
    {
      id: 'prism',
      name: 'PRISM',
      title: 'Risk Quantification Engine',
      icon: Calculator,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50',
      description: 'Transform qualitative risks into quantified financial impacts',
      features: [
        'Monte Carlo simulations for risk modeling',
        'FAIR methodology implementation',
        'Financial impact forecasting',
        'Risk appetite vs exposure tracking'
      ],
      benefits: 'Make data-driven risk decisions with 95% confidence',
      metrics: ['$535K ALE identified', '10K simulations', '4 risk scenarios'],
      integrates: ['clearance', 'beacon', 'atlas']
    },
    {
      id: 'clearance',
      name: 'CLEARANCE',
      title: 'Risk Appetite Management',
      icon: Target,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-indigo-50',
      description: 'Automated risk decision routing based on organizational appetite',
      features: [
        'Dynamic risk appetite thresholds',
        'Automated approval workflows',
        'Real-time exposure tracking',
        'Executive decision support'
      ],
      benefits: 'Accelerate risk decisions by 60% while maintaining governance',
      metrics: ['18h avg decision time', '$5M appetite limit', '98.5% accuracy'],
      integrates: ['prism', 'cipher', 'pulse']
    },
    {
      id: 'pulse',
      name: 'PULSE',
      title: 'Continuous Monitoring',
      icon: Activity,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      description: 'Real-time monitoring across security, compliance, and operations',
      features: [
        'Multi-source data aggregation',
        'Intelligent alert correlation',
        'Predictive anomaly detection',
        'Automated incident response'
      ],
      benefits: 'Detect and respond to threats 80% faster',
      metrics: ['4 data sources', '2.8K events/day', '4.2min MTTD'],
      integrates: ['atlas', 'nexus', 'beacon']
    },
    {
      id: 'cipher',
      name: 'CIPHER',
      title: 'Policy Automation',
      icon: FileText,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'from-indigo-50 to-purple-50',
      description: 'Transform static policies into automated, enforceable controls',
      features: [
        'Policy-as-code implementation',
        'Automated enforcement rules',
        'Compliance violation detection',
        'Self-healing controls'
      ],
      benefits: 'Achieve 93% policy compliance with 75% less manual effort',
      metrics: ['28 active policies', '93.4% compliance', '75% automated'],
      integrates: ['compass', 'clearance', 'nexus']
    },
    {
      id: 'nexus',
      name: 'NEXUS',
      title: 'Intelligence Platform',
      icon: Network,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'from-cyan-50 to-blue-50',
      description: 'AI-powered threat intelligence aggregation and correlation',
      features: [
        'Multi-source threat intelligence',
        'AI correlation engine',
        'Proactive threat hunting',
        'IOC management'
      ],
      benefits: 'Prevent 85% of threats before they materialize',
      metrics: ['3M+ indicators', '15 intel sources', '94.2% accuracy'],
      integrates: ['atlas', 'pulse', 'cipher']
    },
    {
      id: 'beacon',
      name: 'BEACON',
      title: 'Value Demonstration',
      icon: Lightbulb,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50',
      description: 'Quantify and communicate risk management ROI to stakeholders',
      features: [
        'Automated value tracking',
        'Executive dashboards',
        'Industry benchmarking',
        'ROI calculations'
      ],
      benefits: 'Demonstrate 340% ROI on risk management investments',
      metrics: ['$9.1M value delivered', '340% ROI', '8mo payback'],
      integrates: ['prism', 'compass', 'pulse']
    }
  ];

  const ecosystemFlow = [
    {
      title: 'Immediate Value Discovery',
      components: ['prism', 'beacon'],
      description: 'Start with "What\'s this costing you?" - Quantify financial impact and show potential ROI upfront',
      icon: DollarSign
    },
    {
      title: 'Intelligent Assessment',
      components: ['compass', 'atlas'],
      description: 'Map what you actually need and assess only what matters financially - prioritize by impact, not frameworks',
      icon: Brain
    },
    {
      title: 'Continuous Intelligence',
      components: ['pulse', 'nexus'],
      description: 'Monitor what\'s valuable and focus on threats that could cost you - don\'t monitor everything, monitor what matters',
      icon: Activity
    },
    {
      title: 'Automated Excellence',
      components: ['clearance', 'cipher'],
      description: 'Automate decisions based on risk appetite and turn decisions into action - scale your value creation',
      icon: Zap
    }
  ];

  const getComponentById = (id: string) => components.find(c => c.id === id);

  const navigationItems = [
    { name: 'Platform', href: '#platform' },
    { name: 'Components', href: '#components' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Resources', href: '#resources' },
    { name: 'Pricing', href: '#pricing' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Navigation */}
      <header className="relative z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Logo 
                className="h-10 w-10 text-blue-600" 
                textClassName="font-bold text-xl text-slate-900" 
                showText={false}
                clickable={true}
              />
              <div 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/')}
              >
                <div className="font-bold text-xl text-slate-900">ERIP</div>
                <div className="text-xs text-slate-600 -mt-1">Trust Intelligence Platform</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-slate-700">
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-700">
                <Download className="h-4 w-4 mr-2" />
                Resources
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                onClick={() => navigate('/app')}
              >
                Launch Platform
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg">
              <div className="px-6 py-4 space-y-4">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-sm font-medium text-slate-700 hover:text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Sales
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resources
                  </Button>
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/app');
                    }}
                  >
                    Launch Platform
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Hero Section */}
      <div id="platform" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Turn Compliance Costs into Competitive Advantage
            </h1>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-emerald-400 mb-2">€2,300,000</div>
              <div className="text-xl text-slate-300">Average Annual ROI</div>
              <div className="text-sm text-slate-400">Join 500+ organizations building the trust economy together</div>
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4">
              The <strong>Trust Intelligence Platform</strong> that transforms your security and regulatory investments 
              into measurable business value through Trust Equity™.
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-6">
              Close enterprise deals 40% faster, command 25% premium pricing, and achieve measurable ROI
              while actually being more secure. All components work together in one unified platform.
            </p>

            {/* Trust Equity Meter */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Your Trust Equity™ Journey</h3>
                <p className="text-sm text-slate-400">Transform compliance from cost center to competitive advantage</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <div className="w-3 h-3 rounded bg-slate-600"></div>
                    <div className="w-3 h-3 rounded bg-slate-600"></div>
                    <div className="w-3 h-3 rounded bg-slate-600"></div>
                    <div className="w-3 h-3 rounded bg-slate-600"></div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">Phase 1: Foundation</div>
                    <div className="text-xs text-slate-400">Trust Score: 200 - Basic compliance</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <div className="w-3 h-3 rounded bg-slate-600"></div>
                    <div className="w-3 h-3 rounded bg-slate-600"></div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">Phase 2: Integration</div>
                    <div className="text-xs text-slate-400">Trust Score: 600 - Automated workflows</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <div className="w-3 h-3 rounded bg-slate-600"></div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">Phase 3: Optimization</div>
                    <div className="text-xs text-slate-400">Trust Score: 800 - Sales acceleration</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-600/20 to-purple-600/20 border border-emerald-400/30">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded bg-emerald-400"></div>
                    <div className="w-3 h-3 rounded bg-emerald-400"></div>
                    <div className="w-3 h-3 rounded bg-emerald-400"></div>
                    <div className="w-3 h-3 rounded bg-emerald-400"></div>
                    <div className="w-3 h-3 rounded bg-emerald-400"></div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-emerald-300 flex items-center gap-2">
                      Phase 4: Platinum Trust
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="text-xs text-emerald-400">Trust Score: 950+ - Market leadership</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => setShowValueProof(true)}
              >
                <Target className="h-5 w-5 mr-2" />
                Calculate Your Trust Equity™
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Info className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Proven Results */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold text-emerald-400 mb-2">40%</div>
              <div className="text-sm text-slate-300">Faster Enterprise Sales</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold text-blue-400 mb-2">25%</div>
              <div className="text-sm text-slate-300">Premium Pricing</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                €2,300,000
              </div>
              <div className="text-sm text-slate-300">Annual ROI</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold text-amber-400 mb-2">60%</div>
              <div className="text-sm text-slate-300">Time Reduction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem & Solution */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* The Problem */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              The Problem Every Enterprise Faces
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-red-900">
                    €3,000,000+ annual spend
                  </div>
                  <div className="text-sm text-red-700">with no clear ROI</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-red-900">Compliance theater</div>
                  <div className="text-sm text-red-700">that doesn't reduce real risk</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-red-900">Fragmented tools</div>
                  <div className="text-sm text-red-700">that create more work, not less</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-red-900">Reactive approach</div>
                  <div className="text-sm text-red-700">that fails during critical deals</div>
                </div>
              </div>
            </div>
            <p className="text-lg font-semibold text-slate-700">
              Result: Your compliance budget feels like burning money while competitors move faster.
            </p>
          </div>

          {/* The Solution */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Introducing Trust Equity™
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              The first system to measure and monetize your compliance investments:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-blue-900">Every assessment</div>
                  <div className="text-sm text-blue-700">= Trust points that never expire</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-green-900">Every control implemented</div>
                  <div className="text-sm text-green-700">= Compound growth in trust score</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-purple-900">Every certification earned</div>
                  <div className="text-sm text-purple-700">= Measurable business value</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <Zap className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-amber-900">Every risk mitigated</div>
                  <div className="text-sm text-amber-700">= Faster deal cycles and premium pricing</div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <p className="text-center font-semibold text-slate-900">
                Think Amex points for enterprise trust—but the rewards are enterprise deals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Together */}
      <div id="solutions" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            How ERIP Works
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Four integrated phases that transform compliance activities into Trust Equity™ 
            and measurable business value
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {ecosystemFlow.map((stage, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100">
                    <stage.icon className="h-6 w-6 text-blue-700" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900">{stage.title}</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">{stage.description}</p>
                <div className="space-y-2">
                  {stage.components.map(compId => {
                    const comp = getComponentById(compId);
                    return comp ? (
                      <div key={compId} className="flex items-center gap-2 text-sm">
                        <comp.icon className="h-4 w-4 text-slate-600" />
                        <span className="font-medium text-slate-700">{comp.name}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              {index < ecosystemFlow.length - 1 && (
                <ChevronRight className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-300 hidden md:block" />
              )}
            </div>
          ))}
        </div>

        {/* Component Grid */}
        <div id="components" className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              One Unified Platform, Eight Integrated Components
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-6">
              All components work together seamlessly, sharing data and insights to accelerate your Trust Equity™ journey. 
              No silos, no integration headaches - just one comprehensive platform that grows with your organization.
            </p>
            <div className="flex justify-center gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700">
                  <Network className="h-5 w-5" />
                  <span className="font-medium">Real-time data sharing across all 8 components</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Core platform available now, full suite Q2 2025</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {components.map((component) => {
              const Icon = component.icon;
              return (
                <Card 
                  key={component.id}
                  className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    selectedComponent === component.id ? 'ring-2 ring-blue-600' : ''
                  }`}
                  onClick={() => setSelectedComponent(selectedComponent === component.id ? null : component.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${component.bgColor} opacity-50`} />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${component.color} text-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Eye className="h-5 w-5 text-slate-400" />
                    </div>
                    <CardTitle className="text-xl">{component.name}</CardTitle>
                    <CardDescription className="text-sm font-medium">{component.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-sm text-slate-600 mb-4">{component.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">Click for details</span>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Selected Component Details */}
        {selectedComponent && (
          <div className="mb-16 animate-in slide-in-from-top duration-300">
            {(() => {
              const component = components.find(c => c.id === selectedComponent);
              if (!component) return null;
              const Icon = component.icon;
              
              return (
                <Card className="border-0 shadow-xl overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${component.color}`} />
                  <CardContent className="p-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${component.color} text-white`}>
                            <Icon className="h-8 w-8" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900">{component.name}</h3>
                            <p className="text-lg text-slate-600">{component.title}</p>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="font-semibold text-slate-900 mb-3">Key Features</h4>
                          <ul className="space-y-2">
                            {component.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-slate-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <div className="mb-6">
                          <h4 className="font-semibold text-slate-900 mb-3">Business Value</h4>
                          <p className="text-slate-700 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
                            {component.benefits}
                          </p>
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="font-semibold text-slate-900 mb-3">Key Metrics</h4>
                          <div className="grid grid-cols-3 gap-4">
                            {component.metrics.map((metric, index) => (
                              <div key={index} className="text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                                <div className="text-sm font-medium text-slate-900">{metric}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Integrates With</h4>
                          <div className="flex gap-2">
                            {component.integrates.map(intId => {
                              const intComp = getComponentById(intId);
                              return intComp ? (
                                <div key={intId} className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-sm">
                                  <intComp.icon className="h-4 w-4 text-slate-600" />
                                  <span className="font-medium text-slate-700">{intComp.name}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <Button 
                            className={`w-full bg-gradient-to-r ${component.color} text-white`}
                            onClick={() => navigate(`/app/${component.id}`)}
                          >
                            Launch {component.name}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        )}

        {/* Call to Action */}
        <div id="pricing" className="text-center py-16">
          <Card className="max-w-4xl mx-auto border-0 shadow-xl bg-gradient-to-br from-blue-900 to-purple-900 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Risk Management?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join leading enterprises using ERIP to turn risk into competitive advantage
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-900 hover:bg-white/90"
                  onClick={() => navigate('/industry')}
                >
                  Choose Your Industry
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-white/50 text-white hover:bg-white/10"
                >
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer id="resources" className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Logo 
                  className="h-10 w-10 text-white" 
                  showText={false}
                  clickable={true}
                />
                <div 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate('/')}
                >
                  <div className="font-bold text-xl">ERIP</div>
                  <div className="text-sm text-slate-400">Enterprise Risk Intelligence Platform</div>
                </div>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Transform your organization's approach to risk management with AI-powered intelligence, 
                automated processes, and quantified business value.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Mail className="h-4 w-4 mr-2" />
                  contact@erip.com
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Phone className="h-4 w-4 mr-2" />
                  1-800-ERIP-NOW
                </Button>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#components" className="hover:text-white transition-colors">Components</a></li>
                <li><a href="#solutions" className="hover:text-white transition-colors">Solutions</a></li>
                <li><a href="/app" className="hover:text-white transition-colors">Launch App</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integration Guide</a></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">White Papers</a></li>
                <li><a href="/case-study" className="hover:text-white transition-colors">Case Study: European Authentication Provider</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex items-center justify-between">
            <div className="text-slate-400 text-sm">
              © 2025 Enterprise Risk Intelligence Platform. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Trust Equity Calculator Modal */}
      {showValueProof && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Trust Equity™ Calculator</h3>
                  <p className="text-slate-600">See how much revenue you're leaving on the table</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowValueProof(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Annual Revenue
                  </label>
                  <select className="w-full p-3 border border-slate-300 rounded-lg">
                    <option>$10M - $50M</option>
                    <option>$50M - $100M</option>
                    <option>$100M - $500M</option>
                    <option>$500M+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Enterprise Deals per Year
                  </label>
                  <select className="w-full p-3 border border-slate-300 rounded-lg">
                    <option>1-10 deals</option>
                    <option>10-25 deals</option>
                    <option>25-50 deals</option>
                    <option>50+ deals</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Compliance Spend
                  </label>
                  <select className="w-full p-3 border border-slate-300 rounded-lg">
                    <option>$500K - $1M</option>
                    <option>$1M - $3M</option>
                    <option>$3M - $5M</option>
                    <option>$5M+</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <h4 className="font-semibold text-slate-900 mb-4">Your Trust Equity™ Potential:</h4>
                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Revenue acceleration (40% faster deals)</span>
                    <span className="font-semibold text-green-600">
                      +€3,200,000 annually
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Premium pricing (25% uplift)</span>
                    <span className="font-semibold text-blue-600">
                      +€1,800,000 annually
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Compliance efficiency (60% time savings)</span>
                    <span className="font-semibold text-purple-600">
                      +€480,000 annually
                    </span>
                  </div>
                  <div className="border-t border-slate-300 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-slate-900">Total Annual Value</span>
                      <span className="text-emerald-600">
                        €5,480,000
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setShowValueProof(false);
                    navigate('/industry');
                  }}
                >
                  Start Building Trust Equity™
                </Button>
                <Button variant="outline" onClick={() => setShowValueProof(false)}>
                  Download Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};