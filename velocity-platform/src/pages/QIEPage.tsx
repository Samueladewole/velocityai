import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Brain,
  Zap,
  CheckCircle,
  ArrowRight,
  Clock,
  TrendingUp,
  FileText,
  Bot,
  Target,
  BarChart3,
  Shield,
  Activity,
  Sparkles,
  Timer,
  Award,
  Upload,
  Play,
  AlertCircle,
  ChevronRight,
  Database,
  Search,
  Download,
  RefreshCw,
  MessageSquare,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

// Velocity Header Component
const VelocityHeader: React.FC = () => {
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
              <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button 
                  onClick={() => navigate('/platform/overview')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Platform Overview</div>
                  <div className="text-xs text-slate-400">Learn about our AI agents</div>
                </button>
                <button 
                  onClick={() => navigate('/platform/evidence-collection')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Evidence Collection</div>
                  <div className="text-xs text-slate-400">Automated gathering info</div>
                </button>
                <button 
                  onClick={() => navigate('/platform/trust-score')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Trust Score</div>
                  <div className="text-xs text-slate-400">Learn about verification</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/qie')}
                  className="block w-full text-left px-4 py-2 text-purple-300 hover:text-purple-100 hover:bg-purple-800/30 transition-colors border-l-2 border-purple-400"
                >
                  <div className="font-medium">QIE Intelligence</div>
                  <div className="text-xs text-purple-400">Questionnaire automation</div>
                </button>
              </div>
            </div>
            
            <div className="relative group">
              <button className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                Solutions
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button 
                  onClick={() => navigate('/velocity/solutions/soc2')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">SOC 2 Automation</div>
                  <div className="text-xs text-slate-400">45-day audit readiness</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/solutions/iso27001')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">ISO 27001 Automation</div>
                  <div className="text-xs text-slate-400">ISMS implementation</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/solutions/gdpr')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">GDPR Automation</div>
                  <div className="text-xs text-slate-400">Data protection compliance</div>
                </button>
              </div>
            </div>

            <div className="relative group">
              <button className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                Resources
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button 
                  onClick={() => navigate('/velocity/resources')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Compliance Guides</div>
                  <div className="text-xs text-slate-400">Best practices & frameworks</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/docs')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Documentation</div>
                  <div className="text-xs text-slate-400">Complete platform docs</div>
                </button>
                <button 
                  onClick={() => navigate('/case-studies')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Case Studies</div>
                  <div className="text-xs text-slate-400">Customer success stories</div>
                </button>
              </div>
            </div>

            <div className="relative group">
              <button className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                Company
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button 
                  onClick={() => navigate('/velocity/pitch-deck')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Investor Pitch Deck</div>
                  <div className="text-xs text-slate-400">Seed round presentation</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/about')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">About Us</div>
                  <div className="text-xs text-slate-400">Our mission & team</div>
                </button>
              </div>
            </div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/velocity/login')}
              className="hidden lg:block text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/velocity/login')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-amber-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-amber-600 transition-all duration-300"
            >
              Get Started
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800">
            <div className="space-y-2">
              <button 
                onClick={() => { navigate('/platform/overview'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white"
              >
                Platform Overview
              </button>
              <button 
                onClick={() => { navigate('/velocity/qie'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 text-purple-300 hover:text-purple-100"
              >
                QIE Intelligence
              </button>
              <button 
                onClick={() => { navigate('/velocity/solutions/soc2'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white"
              >
                Solutions
              </button>
              <button 
                onClick={() => { navigate('/velocity/resources'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white"
              >
                Resources
              </button>
              <button 
                onClick={() => { navigate('/velocity/login'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Trust Score Animation Component
const QIETrustScore = () => {
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setScore(96.7);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-32 h-32" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="#1e293b"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="url(#qieGradient)"
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 40}`}
          strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
          className="transition-all duration-1500 ease-out"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <defs>
          <linearGradient id="qieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-white font-mono">
            {isLoading ? '--' : score}%
          </div>
          <div className="text-xs text-slate-400">Accuracy</div>
        </div>
      </div>
    </div>
  );
};

// Recent Questionnaires Component
const RecentQuestionnaires = () => {
  const questionnaires = [
    {
      id: 1,
      client: 'Fortune 500 Bank',
      framework: 'SOC 2 Type II',
      questions: 487,
      completionTime: '2.5 hours',
      status: 'completed',
      date: '2 hours ago'
    },
    {
      id: 2,
      client: 'Healthcare Provider',
      framework: 'HIPAA + SOC 2',
      questions: 892,
      completionTime: '4 hours',
      status: 'in_progress',
      date: '5 hours ago'
    },
    {
      id: 3,
      client: 'SaaS Startup',
      framework: 'ISO 27001',
      questions: 324,
      completionTime: '1.5 hours',
      status: 'completed',
      date: 'Yesterday'
    }
  ];

  return (
    <div className="space-y-4">
      {questionnaires.map((q) => (
        <div 
          key={q.id}
          className="group relative bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-white font-semibold text-lg">{q.client}</h4>
              <p className="text-purple-400 text-sm">{q.framework}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              q.status === 'completed' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {q.status === 'completed' ? 'Completed' : 'In Progress'}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Questions</p>
              <p className="text-white font-semibold">{q.questions}</p>
            </div>
            <div>
              <p className="text-slate-500">Time</p>
              <p className="text-white font-semibold">{q.completionTime}</p>
            </div>
            <div>
              <p className="text-slate-500">Date</p>
              <p className="text-white font-semibold">{q.date}</p>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

// QIE Features Grid
const QIEFeaturesGrid = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI Context Understanding',
      description: 'Understands your entire compliance posture',
      color: 'purple'
    },
    {
      icon: Zap,
      title: 'Instant Processing',
      description: 'Complete questionnaires in hours, not weeks',
      color: 'amber'
    },
    {
      icon: Shield,
      title: 'Evidence-Backed',
      description: 'Every answer linked to verified evidence',
      color: 'emerald'
    },
    {
      icon: Database,
      title: 'Multi-Framework',
      description: 'SOC 2, ISO 27001, GDPR, HIPAA support',
      color: 'blue'
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        const colorClasses = {
          purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
          amber: 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400',
          emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400',
          blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400'
        };

        return (
          <div key={index} className="group relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[feature.color].split(' ')[0] + ' ' + colorClasses[feature.color].split(' ')[1]} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 group-hover:border-transparent transition-all duration-300">
              <div className={`inline-flex p-3 bg-${feature.color}-500/10 rounded-lg mb-4`}>
                <Icon className={`w-6 h-6 ${colorClasses[feature.color].split(' ')[2]}`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const QIEPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
      {/* Velocity Header */}
      <VelocityHeader />
      
      {/* Breadcrumb/Page Header */}
      <div className="pt-20 pb-4 bg-slate-900/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/velocity')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Back to Home</span>
              </button>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">QIE Intelligence Engine</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-slate-400" />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5 text-slate-400" />
              </button>
              <button 
                onClick={() => navigate('/velocity/qie/workflow')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                New Questionnaire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-6 border border-purple-500/30">
                <Sparkles className="w-4 h-4" />
                AI-Powered Questionnaire Intelligence
              </div>
              
              <h1 className="text-5xl font-bold text-white mb-6 font-serif">
                Transform Questionnaires from
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> Weeks to Hours</span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8">
                Our AI engine processes compliance questionnaires with 96.7% accuracy, 
                turning a 2-week process into same-day completion.
              </p>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-300">Average: 2.5 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  <span className="text-slate-300">96.7% accuracy</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => navigate('/velocity/qie/workflow')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start New Questionnaire
                </button>
                <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
                  View Demo
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                <div className="flex flex-col items-center">
                  <QIETrustScore />
                  <h3 className="text-2xl font-bold text-white mt-6 mb-2">Questionnaire Accuracy</h3>
                  <p className="text-slate-400 text-center mb-6">
                    Powered by AI with continuous learning
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">487</div>
                      <div className="text-xs text-slate-500">Avg Questions</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-400">2.5h</div>
                      <div className="text-xs text-slate-500">Avg Time</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-amber-400">100%</div>
                      <div className="text-xs text-slate-500">Evidence</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex items-center gap-8 mb-8 border-b border-white/10">
          {['overview', 'recent', 'templates', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-medium transition-all duration-300 relative ${
                activeTab === tab 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Features Grid */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  QIE Capabilities
                </h2>
                <QIEFeaturesGrid />
              </div>

              {/* How It Works */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">How QIE Works</h3>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Upload Questionnaire', desc: 'Drop any format - Excel, Word, PDF', icon: Upload },
                    { step: 2, title: 'AI Analysis', desc: 'QIE understands context and requirements', icon: Brain },
                    { step: 3, title: 'Evidence Matching', desc: 'Automatic linking to your evidence library', icon: Database },
                    { step: 4, title: 'Expert Review', desc: 'Optional human validation for critical answers', icon: CheckCircle },
                    { step: 5, title: 'Export & Submit', desc: 'Download completed questionnaire', icon: Download }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.step} className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-semibold">
                          {item.step}
                        </div>
                        <div className="flex-shrink-0 p-3 bg-white/5 rounded-lg">
                          <Icon className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{item.title}</h4>
                          <p className="text-slate-400 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Stats Card */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-2xl border border-purple-500/30">
                <h3 className="text-lg font-semibold text-white mb-4">QIE Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-300 text-sm">Accuracy Rate</span>
                      <span className="text-white font-semibold">96.7%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{ width: '96.7%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-300 text-sm">Time Saved</span>
                      <span className="text-white font-semibold">95%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-300 text-sm">Evidence Coverage</span>
                      <span className="text-white font-semibold">100%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-400" />
                      <span className="text-white">Browse Templates</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </button>
                  <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                      <span className="text-white">Learning Center</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </button>
                  <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      <span className="text-white">View Analytics</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>

              {/* Alert */}
              <div className="bg-amber-500/10 backdrop-blur-sm rounded-xl p-4 border border-amber-500/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium text-sm mb-1">Pro Tip</h4>
                    <p className="text-amber-200 text-xs">
                      Upload your evidence library first for maximum QIE accuracy and speed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Questionnaires</h2>
              <RecentQuestionnaires />
            </div>
            <div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Summary Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Processed</span>
                    <span className="text-white font-semibold">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">This Month</span>
                    <span className="text-white font-semibold">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Avg Time Saved</span>
                    <span className="text-emerald-400 font-semibold">38 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Success Rate</span>
                    <span className="text-purple-400 font-semibold">99.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QIEPage;