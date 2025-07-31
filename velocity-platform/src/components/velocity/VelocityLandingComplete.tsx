import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

// Public Navigation Header for Landing Page
const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/velocity" className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg blur-sm opacity-50"></div>
            </div>
            <div>
              <span className="text-xl font-bold text-white font-serif">Velocity</span>
              <div className="text-xs text-slate-400">AI Compliance Automation</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <div className="relative group">
              <button className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                Platform
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button 
                  onClick={() => navigate('/velocity/features')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => navigate('/velocity/agents')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  AI Agents
                </button>
                <button 
                  onClick={() => navigate('/velocity/integrations')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  Integrations
                </button>
                <button 
                  onClick={() => navigate('/velocity/security')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  Security
                </button>
              </div>
            </div>
            <div className="relative group">
              <button className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                Solutions
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button 
                  onClick={() => navigate('/velocity/solutions/soc2')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  SOC 2
                </button>
                <button 
                  onClick={() => navigate('/velocity/solutions/iso27001')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  ISO 27001
                </button>
                <button 
                  onClick={() => navigate('/velocity/solutions/gdpr')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  GDPR
                </button>
                <button 
                  onClick={() => navigate('/velocity/solutions/hipaa')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  HIPAA
                </button>
              </div>
            </div>
            <button 
              onClick={() => navigate('/velocity/pricing')}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => navigate('/velocity/docs')}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Resources
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/velocity/login')}
              className="hidden sm:block text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
            >
              Start Free Assessment
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-800/95 backdrop-blur-md border-t border-slate-700/50">
          <div className="px-6 py-4 space-y-3">
            <div className="text-slate-400 text-sm font-medium py-1">Platform</div>
            <button 
              onClick={() => { navigate('/velocity/features'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Features
            </button>
            <button 
              onClick={() => { navigate('/velocity/agents'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              AI Agents
            </button>
            <button 
              onClick={() => { navigate('/velocity/integrations'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Integrations
            </button>
            <button 
              onClick={() => { navigate('/velocity/security'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Security
            </button>
            <div className="text-slate-400 text-sm font-medium py-1">Solutions</div>
            <button 
              onClick={() => { navigate('/velocity/solutions/soc2'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              SOC 2
            </button>
            <button 
              onClick={() => { navigate('/velocity/solutions/iso27001'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              ISO 27001
            </button>
            <button 
              onClick={() => { navigate('/velocity/solutions/gdpr'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              GDPR
            </button>
            <button 
              onClick={() => { navigate('/velocity/solutions/hipaa'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              HIPAA
            </button>
            <button 
              onClick={() => { navigate('/velocity/pricing'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2"
            >
              Pricing
            </button>
            <button 
              onClick={() => { navigate('/velocity/docs'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2"
            >
              Resources
            </button>
            <div className="pt-4 border-t border-slate-700/50 space-y-2">
              <button
                onClick={() => { navigate('/velocity/login'); setMobileMenuOpen(false); }}
                className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2"
              >
                Sign In
              </button>
              <button
                onClick={() => { navigate('/velocity/assessment'); setMobileMenuOpen(false); }}
                className="block w-full px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
              >
                Start Free Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

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
                { agent: 'AWS Evidence Collector', task: 'Scanning CloudTrail configurations', status: 'active' },
                { agent: 'Trust Score Engine', task: 'Calculating cryptographic verification', status: 'active' },
                { agent: 'GitHub Security Analyzer', task: 'Analyzing organization security settings', status: 'active' }
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

// Customer Impact Metrics Section
const ImpactMetricsSection = () => {
  const navigate = useNavigate();
  
  const metrics = [
    {
      value: '$120K',
      label: 'Average Annual Savings',
      description: 'Per customer in first year',
      icon: '💰',
      color: 'from-green-400 to-emerald-500'
    },
    {
      value: '2 Hours',
      label: 'Questionnaire Response',
      description: 'vs 2 weeks industry standard',
      icon: '⚡',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      value: '95%',
      label: 'Evidence Automation',
      description: 'vs 40% industry average',
      icon: '🤖',
      color: 'from-purple-400 to-pink-500'
    },
    {
      value: '650%',
      label: 'Average ROI',
      description: 'Return on investment',
      icon: '📈',
      color: 'from-orange-400 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white font-serif mb-4">
            Transformational Impact for Our Customers
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            See how Velocity customers turn compliance from a cost center into a competitive advantage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-4xl mb-4">{metric.icon}</div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-2`}>
                {metric.value}
              </div>
              <div className="text-white font-semibold mb-1">
                {metric.label}
              </div>
              <div className="text-sm text-slate-400">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/velocity/impact')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <TrendingUp className="w-5 h-5" />
            See Full Customer Impact Stories
            <ArrowRight className="w-5 h-5" />
          </button>
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
                  {React.createElement(stage.icon, { className: `w-6 h-6 text-${stage.color}-400` })}
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
      name: 'AWS Evidence Collector',
      description: 'Automated AWS compliance evidence gathering',
      capabilities: ['CloudTrail monitoring', 'Config rules validation', 'Security Hub integration'],
      automation: 98,
      icon: Zap
    },
    {
      name: 'GCP Security Scanner',
      description: 'Google Cloud security assessment & monitoring',
      capabilities: ['IAM policy analysis', 'Security Command Center', 'Resource inventory'],
      automation: 97,
      icon: Cpu
    },
    {
      name: 'Azure Security Monitor',
      description: 'Microsoft Azure security and compliance tracking',
      capabilities: ['Security Center alerts', 'Policy compliance', 'Defender integration'],
      automation: 96,
      icon: Activity
    },
    {
      name: 'GitHub Security Analyzer',
      description: 'Repository security and branch protection analysis',
      capabilities: ['Security settings scan', 'Branch protection rules', 'Access control audit'],
      automation: 99,
      icon: Database
    },
    {
      name: 'QIE Integration Agent',
      description: 'Questionnaire Intelligence Engine for automated responses',
      capabilities: ['Framework questionnaires', 'AI-powered responses', 'Multi-framework mapping'],
      automation: 94,
      icon: FileText
    },
    {
      name: 'Trust Score Engine',
      description: 'Cryptographic verification and trust scoring',
      capabilities: ['Blockchain proofs', 'Evidence verification', 'Trust calculation'],
      automation: 100,
      icon: Shield
    },
    {
      name: 'Continuous Monitor',
      description: 'Real-time configuration change monitoring',
      capabilities: ['Drift detection', 'Real-time alerts', 'Configuration tracking'],
      automation: 97,
      icon: Eye
    },
    {
      name: 'Document Generator',
      description: 'Automated compliance documentation creation',
      capabilities: ['Policy generation', 'Evidence documentation', 'Report creation'],
      automation: 95,
      icon: FileText
    },
    {
      name: 'Observability Specialist',
      description: 'System monitoring and performance analysis',
      capabilities: ['System metrics', 'Performance monitoring', 'Alert management'],
      automation: 98,
      icon: Activity
    },
    {
      name: 'Cryptographic Verification',
      description: 'Blockchain-based evidence integrity verification',
      capabilities: ['Merkle tree proofs', 'Tamper detection', 'Cryptographic hashing'],
      automation: 100,
      icon: Lock
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
                  {React.createElement(agent.icon, { className: "w-6 h-6 text-emerald-400" })}
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

// Evidence Collection Section
const EvidenceCollectionSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const evidenceTypes = [
    {
      title: "Cloud Infrastructure",
      icon: Server,
      count: "2,847",
      description: "AWS, Azure, GCP configurations",
      examples: ["IAM policies", "Network security groups", "Encryption settings", "Access logs"]
    },
    {
      title: "Application Security", 
      icon: Shield,
      count: "1,923",
      description: "Code security and vulnerabilities",
      examples: ["SAST scan results", "Dependency scans", "Security headers", "Authentication flows"]
    },
    {
      title: "Access Controls",
      icon: Users,
      count: "856",
      description: "User permissions and access reviews",
      examples: ["User access reviews", "Privileged accounts", "MFA configurations", "Session logs"]
    },
    {
      title: "Operational Evidence",
      icon: Activity,
      count: "3,421",
      description: "Processes and documentation",
      examples: ["Policy documents", "Training records", "Incident responses", "Change logs"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white font-serif mb-6">
            Automated Evidence Collection
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Velocity automatically collects, validates, and organizes evidence from across your entire infrastructure. 
            No manual screenshots, no missing documentation - just complete, audit-ready evidence portfolios.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Evidence Types Tabs */}
          <div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {evidenceTypes.map((type, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`p-4 rounded-xl text-left transition-all duration-300 ${
                    activeTab === index
                      ? 'bg-emerald-500/20 border border-emerald-500/50'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {React.createElement(type.icon, { className: `w-5 h-5 ${activeTab === index ? 'text-emerald-400' : 'text-slate-400'}` })}
                    <span className={`font-medium ${activeTab === index ? 'text-emerald-400' : 'text-white'}`}>
                      {type.title}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold font-mono mb-1 ${activeTab === index ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {type.count}
                  </div>
                  <div className="text-xs text-slate-400">{type.description}</div>
                </button>
              ))}
            </div>

            {/* Active Evidence Examples */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                {React.createElement(evidenceTypes[activeTab].icon, { className: "w-5 h-5 text-emerald-400" })}
                {evidenceTypes[activeTab].title} Evidence
              </h3>
              <div className="space-y-3">
                {evidenceTypes[activeTab].examples.map((example, index) => (
                  <div key={index} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm">{example}</span>
                    <div className="ml-auto text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                      Auto-collected
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Evidence Collection Stats */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-emerald-400 font-mono mb-2">8,047</div>
                <div className="text-slate-400">Evidence items collected today</div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">95%</div>
                  <div className="text-sm text-slate-400">Automated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm text-slate-400">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">0</div>
                  <div className="text-sm text-slate-400">Missing Evidence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">100%</div>
                  <div className="text-sm text-slate-400">Audit Ready</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-emerald-400 font-medium">Real-time Collection</span>
                </div>
                <p className="text-sm text-slate-300">
                  Evidence is collected continuously as your infrastructure changes, ensuring you never miss critical compliance data.
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-400 font-medium">Intelligent Validation</span>
                </div>
                <p className="text-sm text-slate-300">
                  AI agents automatically validate evidence quality and completeness before auditors even see it.
                </p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="text-amber-400 font-medium">Audit-Ready Exports</span>
                </div>
                <p className="text-sm text-slate-300">
                  One-click evidence packages formatted exactly how auditors expect to receive them.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={() => navigate('/velocity/demo')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25"
          >
            <Database className="w-5 h-5" />
            See Evidence Collection in Action
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

        {/* Customer Impact Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <button
            onClick={() => navigate('/velocity/impact')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/20 backdrop-blur-sm text-blue-300 rounded-lg font-medium border border-blue-400/30 hover:bg-blue-500/30 transition-all duration-300"
          >
            <TrendingUp className="w-4 h-4" />
            Customer Impact Stories
          </button>
          
          <button
            onClick={() => navigate('/velocity/roi')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 backdrop-blur-sm text-green-300 rounded-lg font-medium border border-green-400/30 hover:bg-green-500/30 transition-all duration-300"
          >
            <BarChart3 className="w-4 h-4" />
            ROI Calculator
          </button>
          
          <button
            onClick={() => navigate('/velocity/competitive')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 backdrop-blur-sm text-purple-300 rounded-lg font-medium border border-purple-400/30 hover:bg-purple-500/30 transition-all duration-300"
          >
            <Award className="w-4 h-4" />
            Why We Win
          </button>
        </div>

        <p className="text-sm text-slate-400">
          No credit card required • Exit anytime • Full data export guarantee
        </p>
      </div>
    </section>
  );
};

// Public Footer Component
const PublicFooter: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg blur-sm opacity-50"></div>
              </div>
              <span className="text-xl font-bold text-white font-serif">Velocity</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              AI-powered compliance automation for modern security teams.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <div className="space-y-3">
              {['Features', 'Integrations', 'Security', 'Pricing'].map((item) => (
                <button
                  key={item}
                  onClick={() => navigate(`/velocity/${item.toLowerCase()}`)}
                  className="block text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          {/* Solutions */}
          <div>
            <h3 className="text-white font-semibold mb-4">Solutions</h3>
            <div className="space-y-3">
              {[
                { label: 'SOC 2', path: '/velocity/solutions/soc2' },
                { label: 'ISO 27001', path: '/velocity/solutions/iso27001' },
                { label: 'GDPR', path: '/velocity/solutions/gdpr' },
                { label: 'HIPAA', path: '/velocity/solutions/hipaa' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="block text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <div className="space-y-3">
              {[
                { label: 'About', path: '/velocity/about' },
                { label: 'Careers', path: '/velocity/careers' },
                { label: 'Contact', path: '/velocity/contact' },
                { label: 'Privacy', path: '/velocity/privacy' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="block text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <hr className="border-slate-800 my-8" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Velocity. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-500">Enterprise-grade security</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs text-slate-400">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Component
const VelocityLandingComplete: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <PublicHeader />
      <main className="pt-16">
        <HeroSection />
        <ImpactMetricsSection />
        <TrustFirstSection />
        <AIAgentsSection />
        <EvidenceCollectionSection />
        <SocialProofSection />
        <CTASection />
      </main>
      <PublicFooter />
    </div>
  );
};

export default VelocityLandingComplete;