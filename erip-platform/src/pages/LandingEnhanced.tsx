import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Logo } from '@/components/Logo';
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
  Phone,
  Mail,
  Download,
  Brain,
  AlertTriangle,
  Zap,
  Award,
  Building2,
  Cpu,
  Database,
  Settings,
  GraduationCap,
  Search,
  Lock,
  Heart,
  Star,
  Briefcase,
  CloudCog,
  UserCheck,
  ChevronDown,
  ExternalLink,
  Clock,
  DollarSign,
  MessageCircle,
  PlayCircle,
  TrendingDown,
  Users2,
  Zap2,
  Video,
  Filter,
  MonitorPlay,
  CloudIcon,
  ArrowUpRight
} from 'lucide-react';

export const LandingEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('core');
  const [animatedTrustScore, setAnimatedTrustScore] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [trustedByCount, setTrustedByCount] = useState(0);
  const [componentFilter, setComponentFilter] = useState('all');

  // Trust Platform Components organized by category
  const componentCategories = {
    core: {
      title: 'Core Security Platform',
      description: 'Essential security and compliance tools',
      components: [
        {
          id: 'compass',
          name: 'COMPASS',
          title: 'Regulatory Intelligence',
          icon: BookOpen,
          color: 'from-blue-500 to-indigo-600',
          description: 'AI-powered regulatory compliance tracking across 200+ frameworks',
          trustEquity: 85,
          route: '/app/compass'
        },
        {
          id: 'atlas',
          name: 'ATLAS',
          title: 'Security Assessment',
          icon: Shield,
          color: 'from-slate-600 to-blue-700',
          description: 'Multi-cloud security posture assessment with automated scanning',
          trustEquity: 92,
          route: '/app/atlas'
        },
        {
          id: 'prism',
          name: 'PRISM',
          title: 'Risk Quantification',
          icon: Calculator,
          color: 'from-emerald-500 to-teal-600',
          description: 'FAIR methodology risk quantification with Monte Carlo simulations',
          trustEquity: 88,
          route: '/app/prism'
        },
        {
          id: 'clearance',
          name: 'CLEARANCE',
          title: 'Access Management',
          icon: UserCheck,
          color: 'from-purple-500 to-violet-600',
          description: 'Zero-trust access control with behavioral analytics',
          trustEquity: 91,
          route: '/app/clearance'
        }
      ]
    },
    intelligence: {
      title: 'Intelligence & Analytics',
      description: 'Advanced analytics and threat intelligence',
      components: [
        {
          id: 'pulse',
          name: 'PULSE',
          title: 'Threat Intelligence',
          icon: Activity,
          color: 'from-red-500 to-orange-600',
          description: 'Real-time threat intelligence with predictive analytics',
          trustEquity: 89,
          route: '/app/pulse'
        },
        {
          id: 'beacon',
          name: 'BEACON',
          title: 'Incident Response',
          icon: AlertTriangle,
          color: 'from-amber-500 to-yellow-600',
          description: 'Automated incident response with AI-powered remediation',
          trustEquity: 87,
          route: '/app/beacon'
        },
        {
          id: 'cipher',
          name: 'CIPHER',
          title: 'Data Protection',
          icon: Lock,
          color: 'from-teal-500 to-cyan-600',
          description: 'Advanced encryption and data loss prevention',
          trustEquity: 93,
          route: '/app/cipher'
        },
        {
          id: 'nexus',
          name: 'NEXUS',
          title: 'Integration Hub',
          icon: Network,
          color: 'from-indigo-500 to-purple-600',
          description: 'Seamless integration with 500+ security tools',
          trustEquity: 86,
          route: '/app/nexus'
        }
      ]
    },
    automation: {
      title: 'Automation & Management',
      description: 'Workflow automation and policy management',
      components: [
        {
          id: 'framework-manager',
          name: 'FRAMEWORK MANAGER',
          title: 'Framework Optimization',
          icon: Layers,
          color: 'from-cyan-500 to-blue-600',
          description: '70% overlap optimization across multiple compliance frameworks',
          trustEquity: 94,
          route: '/framework-manager'
        },
        {
          id: 'qie',
          name: 'QIE',
          title: 'Questionnaire Intelligence',
          icon: Brain,
          color: 'from-violet-500 to-purple-600',
          description: 'AI-powered questionnaire automation with 95% time reduction',
          trustEquity: 96,
          route: '/qie'
        },
        {
          id: 'policy-management',
          name: 'POLICY MANAGEMENT 2.0',
          title: 'Policy Automation',
          icon: FileText,
          color: 'from-green-500 to-emerald-600',
          description: '500+ EU-focused policy templates with Python backend',
          trustEquity: 92,
          route: '/policy-management'
        },
        {
          id: 'employee-training',
          name: 'EMPLOYEE TRAINING',
          title: 'Security Training',
          icon: GraduationCap,
          color: 'from-orange-500 to-red-600',
          description: 'Gamified security training with phishing simulations',
          trustEquity: 89,
          route: '/employee-training'
        }
      ]
    },
    governance: {
      title: 'Privacy & Governance',
      description: 'Privacy management and AI governance',
      components: [
        {
          id: 'privacy-management',
          name: 'PRIVACY MANAGEMENT',
          title: 'Privacy Suite',
          icon: Eye,
          color: 'from-pink-500 to-rose-600',
          description: 'Complete GDPR compliance with Shadow IT detection',
          trustEquity: 95,
          route: '/privacy-management',
          isNew: false
        },
        {
          id: 'ai-governance',
          name: 'AI GOVERNANCE',
          title: 'AI Risk Management',
          icon: Cpu,
          color: 'from-blue-600 to-indigo-700',
          description: 'ISO 42001 compliance with AI registry and risk assessment',
          trustEquity: 91,
          route: '/ai-governance'
        },
        {
          id: 'assessment-marketplace',
          name: 'ASSESSMENT MARKETPLACE',
          title: 'Shared Assessments',
          icon: Building2,
          color: 'from-gray-600 to-slate-700',
          description: 'Collaborative security assessments with vendor management',
          trustEquity: 88,
          route: '/assessment-marketplace'
        }
      ]
    }
  };

  // Value-First Workflow phases
  const workflowPhases = [
    {
      phase: 1,
      title: 'Discover Value',
      description: 'Identify compliance gaps and security risks',
      time: '30 minutes',
      actions: ['Free Trust Assessment', 'ROI Calculator', 'Interactive Sandbox'],
      outcomes: 'Clear understanding of current posture and potential value'
    },
    {
      phase: 2,
      title: 'Experience Excellence',
      description: 'Hands-on experience with our platform',
      time: '1 hour',
      actions: ['Live Demo', 'Pilot Program', 'Custom Configuration'],
      outcomes: 'Confidence in platform capabilities and fit'
    },
    {
      phase: 3,
      title: 'Build Partnership',
      description: 'Collaborative implementation planning',
      time: '2 weeks',
      actions: ['Implementation Roadmap', 'Team Training', 'Expert Consultation'],
      outcomes: 'Detailed deployment plan with success metrics'
    },
    {
      phase: 4,
      title: 'Deploy Successfully',
      description: 'Guided implementation with continuous support',
      time: '4-8 weeks',
      actions: ['Phased Rollout', '24/7 Support', 'Performance Monitoring'],
      outcomes: 'Fully operational platform with measurable results'
    },
    {
      phase: 5,
      title: 'Optimize Continuously',
      description: 'Ongoing optimization and growth',
      time: 'Ongoing',
      actions: ['Performance Analytics', 'Feature Updates', 'Strategic Reviews'],
      outcomes: 'Continuous improvement and expanded value realization'
    }
  ];

  // Animation effects
  useEffect(() => {
    const targetScore = 91;
    const targetCount = 250;
    
    // Animate Trust Score
    const scoreInterval = setInterval(() => {
      setAnimatedTrustScore(prev => {
        if (prev >= targetScore) {
          clearInterval(scoreInterval);
          return targetScore;
        }
        return prev + 1;
      });
    }, 30);

    // Animate Trusted By count
    const countInterval = setInterval(() => {
      setTrustedByCount(prev => {
        if (prev >= targetCount) {
          clearInterval(countInterval);
          return targetCount;
        }
        return prev + 5;
      });
    }, 20);

    return () => {
      clearInterval(scoreInterval);
      clearInterval(countInterval);
    };
  }, []);

  const trustEquityCalculator = () => {
    const totalComponents = Object.values(componentCategories).reduce(
      (acc, category) => acc + category.components.length, 0
    );
    const averageTrustEquity = Object.values(componentCategories).reduce(
      (acc, category) => acc + category.components.reduce(
        (catAcc, comp) => catAcc + comp.trustEquity, 0
      ), 0
    ) / totalComponents;
    
    return Math.round(averageTrustEquity);
  };

  // Integration partners
  const integrationPartners = [
    { name: 'AWS', logo: '☁️', color: 'from-orange-500 to-yellow-600' },
    { name: 'Azure', logo: '🌐', color: 'from-blue-500 to-indigo-600' },
    { name: 'GCP', logo: '🔵', color: 'from-green-500 to-blue-600' },
    { name: 'Okta', logo: '🔒', color: 'from-blue-600 to-indigo-700' },
    { name: 'Splunk', logo: '📊', color: 'from-green-600 to-teal-600' },
    { name: 'ServiceNow', logo: '⚡', color: 'from-green-500 to-emerald-600' }
  ];

  // Customer logos
  const customerLogos = [
    { name: 'Nordic Financial', logo: '🏦' },
    { name: 'TechCorp', logo: '💻' },
    { name: 'Global Retail', logo: '🛍️' },
    { name: 'Healthcare Plus', logo: '🏥' },
    { name: 'Energy Solutions', logo: '⚡' },
    { name: 'Manufacturing Pro', logo: '🏭' }
  ];

  // Feature highlights for discovery section
  const featureHighlights = [
    {
      id: 'qie',
      title: 'QIE - Questionnaire Intelligence',
      description: '95% faster questionnaires with AI automation',
      metric: '95% faster',
      icon: Brain,
      color: 'from-violet-500 to-purple-600',
      badge: 'AI-Powered'
    },
    {
      id: 'trust-center',
      title: 'Public Trust Center',
      description: 'Share your security posture with custom URLs',
      metric: 'trust.erip.io/your-company',
      icon: Globe,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Industry First'
    },
    {
      id: 'dtef',
      title: 'ISACA DTEF Automation',
      description: 'First platform to automate Digital Trust Framework',
      metric: '70% overlap reduction',
      icon: Award,
      color: 'from-green-500 to-emerald-600',
      badge: 'ISACA Certified'
    },
    {
      id: 'expert-network',
      title: 'Expert Network',
      description: 'On-demand access to compliance experts',
      metric: '24/7 availability',
      icon: Users,
      color: 'from-orange-500 to-red-600',
      badge: 'Premium'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* Enhanced Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Trusted by banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-800 text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Trusted by {trustedByCount}+ companies worldwide
            </div>
          </div>

          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Trust Platform
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Trust Equity™
              </span>
              <br />
              <span className="text-slate-800">Made Simple</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Start with ROI, not compliance. See your risk in euros, not scores. 
              The world's first value-first trust platform that quantifies business impact.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button 
                size="lg" 
                onClick={() => navigate('/assessment')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 text-lg group"
              >
                <Calculator className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Get Your Trust Score
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowVideoModal(true)}
                className="border-blue-200 text-blue-700 px-8 py-4 text-lg group"
              >
                <PlayCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch 2-min Demo
              </Button>
            </div>

            {/* Integration logos */}
            <div className="mb-12">
              <p className="text-sm text-slate-500 mb-4">Works with your existing tools</p>
              <div className="flex items-center justify-center gap-6 flex-wrap">
                {integrationPartners.map((partner, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-white/60 backdrop-blur rounded-lg border border-slate-200 hover:scale-105 transition-transform"
                  >
                    <span className="text-xl">{partner.logo}</span>
                    <span className="text-sm font-medium text-slate-700">{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Trust Score Indicator */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 max-w-md mx-auto border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2 transition-all duration-300">
                  {animatedTrustScore}%
                </div>
                <div className="text-sm text-slate-600 mb-3">
                  Live Trust Equity™ Score
                </div>
                <Progress value={animatedTrustScore} className="h-3 mb-2" />
                <div className="text-xs text-slate-500">
                  Based on {Object.values(componentCategories).reduce((acc, cat) => acc + cat.components.length, 0)} integrated components
                </div>
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Updating in real-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Video Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>ERIP Platform Demo</CardTitle>
                  <button 
                    onClick={() => setShowVideoModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-slate-900 to-blue-900 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <MonitorPlay className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                    <p className="text-blue-200">Interactive demo video will be available here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      {/* Value-First Workflow */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 mb-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              ERIP Value-First Workflow™
            </Badge>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Your Journey to Trust Excellence
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience value before commitment. Our proven 5-phase methodology ensures 
              successful implementation and measurable results.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {workflowPhases.map((phase, index) => (
              <Card 
                key={phase.phase}
                className={`cursor-pointer transition-all duration-300 ${
                  activePhase === phase.phase 
                    ? 'ring-2 ring-blue-500 shadow-lg transform scale-105' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setActivePhase(phase.phase)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold ${
                    activePhase === phase.phase 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                      : 'bg-slate-400'
                  }`}>
                    {phase.phase}
                  </div>
                  <CardTitle className="text-lg">{phase.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {phase.time}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-slate-600 mb-4">{phase.description}</p>
                  {activePhase === phase.phase && (
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-blue-600 mb-2">Key Actions:</div>
                      {phase.actions.map((action, idx) => (
                        <div key={idx} className="text-xs text-slate-600 flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          {action}
                        </div>
                      ))}
                      <div className="text-xs font-semibold text-green-600 mt-3">Outcome:</div>
                      <div className="text-xs text-slate-600">{phase.outcomes}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Discovery Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200 mb-4">
              <Lightbulb className="h-4 w-4 mr-2" />
              Discover Key Features
            </Badge>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Industry-First Innovations
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Breakthrough features that set ERIP apart from traditional compliance tools
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {featureHighlights.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={feature.id}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-white border-slate-200"
                  onClick={() => navigate(`/${feature.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${feature.color} text-white group-hover:scale-110 transition-transform`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {feature.badge}
                          </Badge>
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">{feature.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Key Metric:</span>
                      <span className={`font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                        {feature.metric}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Complete Trust Platform Components */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200 mb-4">
              <Shield className="h-4 w-4 mr-2" />
              Complete Trust Platform
            </Badge>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              All {Object.values(componentCategories).reduce((acc, cat) => acc + cat.components.length, 0)} Enterprise Components
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Every component designed with principles of simplicity, functionality, and excellence.
            </p>
            
            {/* Component Filter */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <Filter className="h-4 w-4 text-slate-500" />
              <div className="flex gap-2">
                <button
                  onClick={() => setComponentFilter('all')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    componentFilter === 'all' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  All Components
                </button>
                <button
                  onClick={() => setComponentFilter('new')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    componentFilter === 'new' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  New & Updated
                </button>
                <button
                  onClick={() => setComponentFilter('popular')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    componentFilter === 'popular' 
                      ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Most Popular
                </button>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              {Object.entries(componentCategories).map(([key, category]) => (
                <TabsTrigger key={key} value={key} className="text-sm">
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(componentCategories).map(([key, category]) => (
              <TabsContent key={key} value={key}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{category.title}</h3>
                  <p className="text-slate-600">{category.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {category.components.map((component) => {
                    const IconComponent = component.icon;
                    const isNew = component.id === 'qie' || component.id === 'ai-governance' || component.id === 'framework-manager';
                    const isPopular = component.trustEquity >= 90;
                    
                    return (
                      <Card 
                        key={component.id}
                        className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white/80 backdrop-blur border-blue-100 relative overflow-hidden"
                        onClick={() => navigate(component.route)}
                      >
                        {/* NEW Badge */}
                        {isNew && (
                          <div className="absolute top-2 right-2 z-10">
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold">
                              NEW
                            </Badge>
                          </div>
                        )}
                        
                        {/* Popular Badge */}
                        {isPopular && !isNew && (
                          <div className="absolute top-2 right-2 z-10">
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold">
                              ⭐ POPULAR
                            </Badge>
                          </div>
                        )}

                        <CardHeader className="text-center pb-4">
                          <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-r ${component.color} text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                            <IconComponent className="h-8 w-8" />
                          </div>
                          <CardTitle className="text-lg mb-2 group-hover:text-blue-600 transition-colors">
                            {component.name}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                            {component.title}
                          </Badge>
                        </CardHeader>
                        <CardContent className="text-center">
                          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{component.description}</p>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-slate-500">Trust Equity™</span>
                            <span className="font-bold text-blue-600">{component.trustEquity}%</span>
                          </div>
                          <Progress value={component.trustEquity} className="h-2 mb-3" />
                          
                          {/* Integration connections indicator */}
                          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Network className="h-3 w-3" />
                            <span>Integrated with {Math.floor(Math.random() * 5) + 3} tools</span>
                          </div>
                        </CardContent>
                        
                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Integration Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 mb-4">
              <Network className="h-4 w-4 mr-2" />
              Enterprise Integrations
            </Badge>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Works with What You Have
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Seamlessly integrate with your existing security stack, cloud infrastructure, and compliance tools
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Cloud Providers */}
            <Card className="border-0 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <CloudIcon className="h-5 w-5" />
                  Cloud Providers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {integrationPartners.slice(0, 3).map((partner, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                      <span className="text-2xl">{partner.logo}</span>
                      <div>
                        <p className="font-medium text-slate-900">{partner.name}</p>
                        <p className="text-xs text-slate-600">Native API integration</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Tools */}
            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Shield className="h-5 w-5" />
                  Security Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {integrationPartners.slice(3).map((partner, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                      <span className="text-2xl">{partner.logo}</span>
                      <div>
                        <p className="font-medium text-slate-900">{partner.name}</p>
                        <p className="text-xs text-slate-600">Bidirectional sync</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Systems */}
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Building2 className="h-5 w-5" />
                  Enterprise Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                    <span className="text-2xl">📊</span>
                    <div>
                      <p className="font-medium text-slate-900">Microsoft 365</p>
                      <p className="text-xs text-slate-600">SSO & compliance data</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                    <span className="text-2xl">🔐</span>
                    <div>
                      <p className="font-medium text-slate-900">Active Directory</p>
                      <p className="text-xs text-slate-600">Identity management</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                    <span className="text-2xl">📋</span>
                    <div>
                      <p className="font-medium text-slate-900">Jira & Confluence</p>
                      <p className="text-xs text-slate-600">Workflow automation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-slate-600 mb-4">And 500+ more integrations through our open API</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/app/integrations')}
              className="border-blue-200 text-blue-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Integrations
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 mb-4">
              <Award className="h-4 w-4 mr-2" />
              Trust & Security
            </Badge>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Enterprise-Grade Security & Compliance
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Built to meet the highest standards for security, privacy, and compliance
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Certifications */}
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Security Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🛡️</span>
                      <span className="font-medium">ISO 27001</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Certified</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏆</span>
                      <span className="font-medium">SOC 2 Type II</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔒</span>
                      <span className="font-medium">GDPR</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">Compliant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uptime & Performance */}
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Uptime & Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-1">99.99%</div>
                    <div className="text-sm text-slate-600">Uptime SLA</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-1">&lt;200ms</div>
                    <div className="text-sm text-slate-600">API Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-1">24/7</div>
                    <div className="text-sm text-slate-600">Support Coverage</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Trust */}
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Customer Trust
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {customerLogos.map((customer, index) => (
                      <div key={index} className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl mb-1">{customer.logo}</div>
                        <div className="text-xs text-slate-600">{customer.name}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600 mb-1">4.9/5</div>
                    <div className="text-sm text-slate-600">Customer Satisfaction</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Value-First ROI Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 mb-4">
                <DollarSign className="h-4 w-4 mr-2" />
                Value-First Approach
              </Badge>
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                Start with ROI, Not Compliance
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                See your risk in euros, not scores. Our unique approach quantifies 
                business impact first, making compliance a natural outcome.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold text-blue-600 mb-2">€2.3M</div>
                  <div className="text-sm text-slate-600">Average Risk Reduction</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold text-green-600 mb-2">7.2x</div>
                  <div className="text-sm text-slate-600">Faster Compliance</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold text-purple-600 mb-2">269%</div>
                  <div className="text-sm text-slate-600">Average ROI</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold text-orange-600 mb-2">6 months</div>
                  <div className="text-sm text-slate-600">Payback Period</div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/roi-calculator')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate Your ROI
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/assessment')}
                  className="border-green-200 text-green-700"
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Free Risk Assessment
                </Button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Success Story</h3>
              <blockquote className="text-lg italic mb-6">
                "ERIP transformed our approach to compliance. Instead of checkbox 
                exercises, we now see clear business value. ROI was positive within 
                3 months, and we achieved ISO 27001 certification 6 months ahead of schedule."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Maria Andersson</div>
                  <div className="text-blue-200 text-sm">CISO, Nordic Financial Group</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-xl" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Trust Posture?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Join 250+ companies who've already transformed their compliance approach. 
              Start with ROI, not compliance.
            </p>
          </div>
          
          {/* Multiple CTA Options */}
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/assessment')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-4 group"
            >
              <Calculator className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Free Assessment
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate('/demo')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-4 group"
            >
              <PlayCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Book a Demo  
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate('/company/investor-pitch')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 hover:from-yellow-500 hover:to-yellow-600 px-6 py-4 group shadow-lg"
            >
              <Briefcase className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Investor Pitch
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate('/sandbox')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-4 group"
            >
              <MonitorPlay className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Try Free Trial
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate('/roi-guide')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-4 group"
            >
              <Download className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              ROI Guide
            </Button>
          </div>

          {/* Interactive Mini Calculator */}
          <Card className="max-w-md mx-auto bg-white/10 backdrop-blur border-white/20 text-white mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Quick ROI Estimate</CardTitle>
              <CardDescription className="text-blue-100">
                See potential savings in 30 seconds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-blue-100">Annual Compliance Spend (€)</label>
                  <input 
                    type="number" 
                    placeholder="500000"
                    className="w-full mt-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200"
                  />
                </div>
                <div className="text-center p-4 bg-white/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-300 mb-1">€350K</div>
                  <div className="text-sm text-blue-100">Estimated Annual Savings</div>
                  <div className="text-xs text-blue-200 mt-1">Based on 70% efficiency gain</div>
                </div>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => navigate('/roi-calculator')}
                >
                  Get Detailed ROI Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-2 text-green-200">
              <CheckCircle className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-green-200">
              <CheckCircle className="h-5 w-5" />
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-green-200">
              <CheckCircle className="h-5 w-5" />
              <span>Enterprise support included</span>
            </div>
          </div>
        </div>

        {/* Live Chat Bubble */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
            onClick={() => alert('Live chat would open here')}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Logo className="h-8 w-8" />
              </div>
              <p className="text-slate-400 text-sm">
                Building trust through technology excellence.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div>Trust Platform</div>
                <div>Trust Equity™ System</div>
                <div>Framework Optimization</div>
                <div>Policy Automation</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div>Interactive Demo</div>
                <div>ROI Calculator</div>
                <div>Free Assessment</div>
                <div>Expert Network</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div>About ERIP</div>
                <div>Our Mission</div>
                <div>Customer Success</div>
                <div>Partnership Program</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 ERIP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};