import React, { useState } from 'react';
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
  Menu,
  X,
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
  DollarSign
} from 'lucide-react';

export const LandingEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePhase, setActivePhase] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('core');

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
          id: 'privacy-suite',
          name: 'PRIVACY MANAGEMENT',
          title: 'Privacy Suite',
          icon: Eye,
          color: 'from-pink-500 to-rose-600',
          description: 'Complete GDPR compliance with Shadow IT detection',
          trustEquity: 95,
          route: '/privacy-suite'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Swedish Innovation Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Logo className="h-8 w-8" />
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-slate-900">
                  ERIP
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate('/assessment')}>
                Free Assessment
              </Button>
              <Button variant="ghost" onClick={() => navigate('/sandbox')}>
                Interactive Demo
              </Button>
              <Button variant="ghost" onClick={() => navigate('/roi-calculator')}>
                ROI Calculator
              </Button>
              <Button onClick={() => navigate('/onboarding')} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                Start Free Trial
              </Button>
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
              The world's first comprehensive trust platform that quantifies, optimizes, and automates 
              security, compliance, and risk management across your entire enterprise.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/assessment')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 text-lg"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Get Your Trust Score
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/sandbox')}
                className="border-blue-200 text-blue-700 px-8 py-4 text-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Interactive Demo
              </Button>
            </div>

            {/* Trust Equity Indicator */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 max-w-md mx-auto border border-blue-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {trustEquityCalculator()}%
                </div>
                <div className="text-sm text-slate-600 mb-3">
                  Average Trust Equity™ Score
                </div>
                <Progress value={trustEquityCalculator()} className="h-2" />
                <div className="text-xs text-slate-500 mt-2">
                  Based on {Object.values(componentCategories).reduce((acc, cat) => acc + cat.components.length, 0)} integrated components
                </div>
              </div>
            </div>
          </div>
        </div>
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

      {/* Trust Platform Components */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200 mb-4">
              <Shield className="h-4 w-4 mr-2" />
              Trust Platform
            </Badge>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              13+ Enterprise-Grade Components
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every component designed with principles of simplicity, functionality, and excellence.
            </p>
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
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.components.map((component) => {
                    const IconComponent = component.icon;
                    return (
                      <Card 
                        key={component.id}
                        className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white/80 backdrop-blur border-blue-100"
                        onClick={() => navigate(component.route)}
                      >
                        <CardHeader className="text-center pb-4">
                          <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-r ${component.color} text-white group-hover:scale-110 transition-transform`}>
                            <IconComponent className="h-8 w-8" />
                          </div>
                          <CardTitle className="text-lg mb-2">{component.name}</CardTitle>
                          <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                            {component.title}
                          </Badge>
                        </CardHeader>
                        <CardContent className="text-center">
                          <p className="text-sm text-slate-600 mb-4">{component.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Trust Equity™</span>
                            <span className="font-bold text-blue-600">{component.trustEquity}%</span>
                          </div>
                          <Progress value={component.trustEquity} className="h-1 mt-2" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* ROI & Value Proposition */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 mb-4">
                <DollarSign className="h-4 w-4 mr-2" />
                Proven ROI
              </Badge>
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                Measurable Business Impact
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Our clients see immediate value through cost reduction, 
                efficiency gains, and risk mitigation across all operations.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">70%</div>
                  <div className="text-sm text-slate-600">Framework Overlap Reduction</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                  <div className="text-sm text-slate-600">Questionnaire Time Saved</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
                  <div className="text-sm text-slate-600">Compliance Cost Reduction</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl">
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-sm text-slate-600">Automated Monitoring</div>
                </div>
              </div>

              <Button 
                size="lg" 
                onClick={() => navigate('/roi-calculator')}
                className="bg-gradient-to-r from-green-600 to-emerald-600"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calculate Your ROI
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Success Story</h3>
              <blockquote className="text-lg italic mb-6">
                "ERIP's Trust Platform transformed our compliance program. 
                We reduced audit preparation time by 80% and achieved ISO 27001 
                certification 6 months ahead of schedule."
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Trust Posture?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Start with our free assessment and experience the ERIP difference. 
            No commitment required.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/assessment')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
            >
              <Heart className="h-5 w-5 mr-2" />
              Start Free Assessment
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/sandbox')}
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Try Interactive Demo
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-blue-200">
            <CheckCircle className="h-4 w-4 inline mr-2" />
            No credit card required • 30-day free trial • Enterprise support included
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Logo className="h-8 w-8" />
                <span className="text-xl font-bold">ERIP</span>
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