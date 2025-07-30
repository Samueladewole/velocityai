import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VelocityHeader from './VelocityHeader';
import VelocityFooter from './VelocityFooter';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  FileText, 
  Settings, 
  Bell, 
  Search, 
  ChevronDown, 
  Play, 
  CheckCircle, 
  Zap, 
  Clock,
  ArrowRight,
  Bot,
  Database,
  Target,
  Award,
  Lock,
  Globe,
  Layers,
  Timer,
  BarChart3,
  Eye,
  Cpu,
  Server,
  Activity,
  Check,
  Star,
  ChevronRight,
  Calendar,
  Download,
  BookOpen,
  MessageSquare,
  Mail,
  Phone
} from 'lucide-react';

// Animated Trust Score Component for Hero
const HeroTrustScore = () => {
  const [score, setScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setScore(94), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <svg className="w-16 h-16" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="url(#heroGradient)"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 35}`}
                strokeDashoffset={`${2 * Math.PI * 35 * (1 - score / 100)}`}
                className="transition-all duration-2000 ease-out"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              <defs>
                <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-white font-mono">{score}</span>
            </div>
          </div>
          <div>
            <p className="text-white font-semibold">Trust Score</p>
            <p className="text-sm text-emerald-300">Audit Ready</p>
            <p className="text-xs text-white/60">SOC 2 • ISO 27001 • GDPR</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Hero Section
const HeroSection = () => {
  const navigate = useNavigate();
  const [currentFramework, setCurrentFramework] = useState(0);
  
  const frameworks = ['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA', 'EU AI Act', 'DORA'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFramework((prev) => (prev + 1) % frameworks.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [frameworks.length]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/5 to-amber-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-500/20 mb-6">
              <span className="text-emerald-400 text-sm font-medium">
                ✨ 10 AI Agents • Zero Integration Risk • 30-Minute Assessment
              </span>
            </div>
            
            <h1 className="font-serif text-5xl lg:text-7xl font-light text-white mb-6 leading-tight">
              Trust-First
              <span className="block font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
                Compliance Automation
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed font-light max-w-lg">
              Experience Velocity's value with zero risk. Get your compliance score in 30 minutes, 
              then build trust progressively through our proven 5-stage integration pathway.
            </p>

            {/* Dynamic Framework Display */}
            <div className="mb-8">
              <p className="text-sm text-slate-400 mb-2">Now supporting:</p>
              <div className="text-2xl font-bold text-white">
                <span className="transition-all duration-500">
                  {frameworks[currentFramework]}
                </span>
                <span className="text-emerald-400 ml-2">✓</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => navigate('/velocity/assessment')}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Start Free Assessment
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button 
                onClick={() => navigate('/velocity/demo')}
                className="group flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Play className="w-5 h-5" />
                View Demo
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                SOC 2 Ready
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Zero Trust Architecture
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                95% Automation
              </div>
            </div>
          </div>

          {/* Visual Demo */}
          <div className="lg:pl-12">
            <HeroTrustScore />
            
            {/* Live Agent Activity */}
            <div className="mt-6 space-y-3">
              {[
                { agent: 'COMPASS', task: 'Mapping SOC 2 controls', status: 'active' },
                { agent: 'ATLAS', task: 'Scanning AWS security groups', status: 'active' },
                { agent: 'PULSE', task: 'Monitoring compliance drift', status: 'active' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-white font-mono">{item.agent}</span>
                  <span className="text-sm text-slate-400">{item.task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Trust-First Value Proposition
const TrustFirstSection = () => {
  const navigate = useNavigate();
  
  const trustStages = [
    {
      stage: 'Discovery',
      title: 'Zero Risk Assessment',
      description: 'Complete compliance questionnaire in 30 minutes. Get AI-powered gap analysis with no system access required.',
      duration: '30 minutes',
      risk: 'Zero Risk',
      icon: Target,
      color: 'emerald'
    },
    {
      stage: 'Exploration',
      title: 'Safe Sandbox Testing',
      description: 'Preview our automation capabilities with read-only access to your systems. See exactly what we can do.',
      duration: '1-2 hours',
      risk: 'Read-Only',
      icon: Eye,
      color: 'blue'
    },
    {
      stage: 'Pilot',
      title: 'Limited Integration',
      description: 'Start with 1-2 systems in a controlled pilot program. Measure ROI before expanding.',
      duration: '2-4 weeks',
      risk: 'Controlled',
      icon: Play,
      color: 'amber'
    },
    {
      stage: 'Production',
      title: 'Full Automation',
      description: 'Scale across your entire infrastructure with 95% automation and continuous monitoring.',
      duration: 'Ongoing',
      risk: 'Trusted Partner',
      icon: Zap,
      color: 'purple'
    }
  ];

  return (
    <section className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white font-serif mb-6">
            Build Trust Progressively
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Unlike traditional platforms that require immediate system access, Velocity builds trust through proven value delivery at every step.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustStages.map((stage, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < trustStages.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
              )}
              
              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                <div className={`p-3 bg-${stage.color}-500/10 rounded-lg w-fit mb-4`}>
                  <stage.icon className={`w-6 h-6 text-${stage.color}-400`} />
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-emerald-400 font-medium mb-1">{stage.stage}</div>
                  <h3 className="text-lg font-semibold text-white font-serif">{stage.title}</h3>
                </div>
                
                <p className="text-sm text-slate-400 mb-4">{stage.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Duration</span>
                    <span className="text-white">{stage.duration}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Risk Level</span>
                    <span className={`text-${stage.color}-400`}>{stage.risk}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/velocity/trust-pathway')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
          >
            Learn About Our Trust Pathway
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

// AI Agents Showcase
const AIAgentsSection = () => {
  const agents = [
    {
      name: 'COMPASS',
      description: 'Compliance Framework Mapping & Gap Analysis',
      capabilities: ['Framework mapping', 'Control assessment', 'Gap identification'],
      automation: 90,
      icon: Target
    },
    {
      name: 'ATLAS',
      description: 'Security Assessment & Vulnerability Management',
      capabilities: ['Security scanning', 'Vulnerability assessment', 'Risk analysis'],
      automation: 85,
      icon: Shield
    },
    {
      name: 'NEXUS',
      description: 'Cross-Framework Control Harmonization',
      capabilities: ['Control mapping', 'Framework alignment', 'Duplicate detection'],
      automation: 88,
      icon: Layers
    },
    {
      name: 'BEACON',
      description: 'Compliance Reporting & Communication',
      capabilities: ['Report generation', 'Stakeholder communication', 'Dashboard creation'],
      automation: 92,
      icon: BarChart3
    },
    {
      name: 'PULSE',
      description: 'Real-Time Monitoring & Alerting',
      capabilities: ['Continuous monitoring', 'Drift detection', 'Real-time alerts'],
      automation: 95,
      icon: Activity
    },
    {
      name: 'PRISM',
      description: 'Risk Quantification & Business Impact',
      capabilities: ['Risk calculation', 'Impact analysis', 'ROI modeling'],
      automation: 87,
      icon: TrendingUp
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white font-serif mb-6">
            10 Specialized AI Agents
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Our intelligent agent system automates 95% of compliance tasks, from evidence collection to report generation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {agents.map((agent, index) => (
            <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <agent.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white font-mono">{agent.automation}%</div>
                  <div className="text-xs text-slate-400">Automation</div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white font-mono mb-2">{agent.name}</h3>
                <p className="text-sm text-slate-400">{agent.description}</p>
              </div>
              
              <div className="space-y-2">
                {agent.capabilities.map((capability, capIndex) => (
                  <div key={capIndex} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    {capability}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
            <Bot className="w-5 h-5" />
            Explore All 10 Agents
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Social Proof Section
const SocialProofSection = () => {
  const testimonials = [
    {
      quote: "Velocity transformed our SOC 2 preparation from a 6-month nightmare into a 45-day success story. The trust-first approach made all the difference.",
      author: "Sarah Chen",
      title: "CISO, TechScale Inc",
      company: "Series B SaaS",
      metric: "45 days to SOC 2"
    },
    {
      quote: "The AI agents collected 95% of our evidence automatically. What used to take weeks now happens in hours.",
      author: "Marcus Rodriguez",
      title: "Compliance Manager",
      company: "FinanceFlow",
      metric: "95% automation"
    },
    {
      quote: "Zero integration risk meant we could evaluate Velocity properly. Now we can't imagine compliance without it.",
      author: "Dr. Emily Watson",
      title: "CTO, HealthTech Pro",
      company: "Healthcare",
      metric: "30-min assessment"
    }
  ];

  return (
    <section className="py-20 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white font-serif mb-6">
            Trusted by Growing Companies
          </h2>
          <p className="text-lg text-slate-400">
            Join hundreds of companies transforming their compliance operations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="mb-4">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300">{testimonial.quote}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{testimonial.author}</p>
                  <p className="text-sm text-slate-400">{testimonial.title}</p>
                  <p className="text-xs text-slate-500">{testimonial.company}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-400">{testimonial.metric}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Company Logos */}
        <div className="flex items-center justify-center gap-8 opacity-50">
          {['TechScale', 'FinanceFlow', 'HealthTech', 'DataCorp', 'CloudFirst'].map((company, index) => (
            <div key={index} className="text-slate-400 font-medium">
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-900/50 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white font-serif mb-6">
          Start Your Compliance Journey Today
        </h2>
        <p className="text-lg text-slate-300 mb-8">
          Experience Velocity's value with zero risk. Get your compliance assessment in 30 minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => navigate('/velocity/assessment')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Target className="w-5 h-5" />
            Start Free Assessment
          </button>
          
          <button
            onClick={() => navigate('/velocity/demo')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <Calendar className="w-5 h-5" />
            Schedule Demo
          </button>
        </div>

        <p className="text-sm text-slate-400">
          No credit card required • Exit anytime • Full data export guarantee
        </p>
      </div>
    </section>
  );
};

// Main Landing Component
const VelocityLandingComplete: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <VelocityHeader />
      
      <HeroSection />
      <TrustFirstSection />
      <AIAgentsSection />
      <SocialProofSection />
      <CTASection />
      
      <VelocityFooter />
    </div>
  );
};

export default VelocityLandingComplete;