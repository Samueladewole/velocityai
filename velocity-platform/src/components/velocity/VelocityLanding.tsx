import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VelocityFooter from './VelocityFooter';
import BackToTopButton from '@/components/ui/BackToTopButton';
import { Shield, TrendingUp, Users, FileText, Settings, Bell, Search, ChevronDown, Play, CheckCircle, Zap, Clock, ChevronUp } from 'lucide-react';


// Enhanced Hero Section with Custom Design (from docs)
const EnhancedHero = () => {
  const [trustScore, setTrustScore] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => setTrustScore(94), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center overflow-hidden">
      {/* Custom animated background elements */}
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
              <span className="text-emerald-400 text-sm font-medium">✨ Trusted by 500+ Companies • GDPR RoPA • ISAE 3000 • Zero Manual Work</span>
            </div>
            
            <h1 className="font-serif text-5xl lg:text-7xl font-light text-white mb-6 leading-tight">
              Stop Drowning in
              <span className="block font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
                Compliance Paperwork
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed font-light max-w-lg">
              Our 12 AI agents work around the clock so you don't have to. Get audit-ready in 30 minutes, not 6 months. Win enterprise deals with same-day security responses.
            </p>
            
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 mb-8 border border-white/10">
              <p className="text-sm text-slate-300 mb-2">
                <span className="font-semibold text-emerald-400">Revolutionary GDPR RoPA automation</span> (83% cheaper than OneTrust) and 
                <span className="font-semibold text-blue-400"> ISAE 3000 evidence collection</span> (88% less than Big 4 consulting). 
                Your compliance team will finally sleep well.
              </p>
              <p className="text-xs text-slate-400">
                🧠 Powered by Anthropic's Claude Sonnet 4 • Superior reasoning and context handling
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => navigate('/velocity/login')}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  See Your Agents Working Live
                  <Play className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              
              <button 
                onClick={() => window.open('https://demo.velocity.ai', '_blank')}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              >
                Calculate Time Savings
              </button>
            </div>
            
            {/* Agent Status Display */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-300 font-medium">12 AI Agents Working For You</span>
                <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">Live now</span>
              </div>
              <div className="grid grid-cols-5 gap-3 mb-4">
                <div className="text-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mb-1 animate-pulse"></div>
                  <span className="text-xs text-slate-400">AWS</span>
                </div>
                <div className="text-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mb-1 animate-pulse"></div>
                  <span className="text-xs text-slate-400">GCP</span>
                </div>
                <div className="text-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mb-1 animate-pulse"></div>
                  <span className="text-xs text-slate-400">GitHub</span>
                </div>
                <div className="text-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mb-1 animate-pulse"></div>
                  <span className="text-xs text-slate-400">Azure</span>
                </div>
                <div className="text-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mb-1 animate-pulse"></div>
                  <span className="text-xs text-slate-400">Trust</span>
                </div>
                <div className="text-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mb-1 animate-pulse"></div>
                  <span className="text-xs text-slate-400">Docs</span>
                </div>
                <div className="text-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mb-1 animate-pulse"></div>
                  <span className="text-xs text-slate-400">QIE</span>
                </div>
                <div className="text-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mb-1 animate-pulse"></div>
                  <span className="text-xs text-slate-400">Monitor</span>
                </div>
                <div className="text-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mb-1 animate-pulse"></div>
                  <span className="text-xs text-slate-400">Observe</span>
                </div>
                <div className="text-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mb-1 animate-pulse"></div>
                  <span className="text-xs text-slate-400">Crypto</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-700" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      fill="none" 
                      className="text-emerald-400"
                      strokeDasharray={`${trustScore * 2.51} 251`}
                      style={{ transition: 'stroke-dasharray 2s ease-out' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{trustScore}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-white">Trust Score: Looking Great! 📈</p>
                  <p className="text-sm text-slate-400">Powered by Claude Sonnet 4</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">SOC 2</span>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">GDPR</span>
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">ISO 27001</span>
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">EU AI Act</span>
                    <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-1 rounded">NIS2</span>
                    <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">DORA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Interactive Dashboard Preview */}
          <div className="relative">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

// Custom Dashboard Preview Component (from docs)
const DashboardPreview = () => {
  const [activeCard, setActiveCard] = useState(0);
  
  const metrics = [
    { title: 'SOC2 Compliance', value: '98%', trend: '+12%', icon: <Shield className="w-5 h-5" />, color: 'emerald' },
    { title: 'Risk Score', value: '2.1', trend: '-24%', icon: <TrendingUp className="w-5 h-5" />, color: 'amber' },
    { title: 'Active Controls', value: '147', trend: '+8%', icon: <CheckCircle className="w-5 h-5" />, color: 'blue' },
    { title: 'Team Members', value: '23', trend: '+3%', icon: <Users className="w-5 h-5" />, color: 'purple' }
  ];

  return (
    <div className="relative">
      {/* Floating elements */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-400/20 rounded-lg animate-pulse"></div>
      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-amber-400/20 rounded-full animate-pulse delay-500"></div>
      
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Security Dashboard</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400">Live</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard 
              key={index}
              metric={metric}
              isActive={activeCard === index}
              onClick={() => setActiveCard(index)}
            />
          ))}
        </div>
        
        {/* Mini chart area */}
        <div className="mt-6 h-20 bg-white/5 rounded-xl flex items-end justify-between p-3">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="bg-emerald-400/60 rounded-sm animate-pulse"
              style={{ 
                height: `${Math.random() * 60 + 20}%`,
                width: '6px',
                animationDelay: `${i * 100}ms`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced Metric Card Component (from docs)
const MetricCard = ({ metric, isActive, onClick }) => {
  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-600/20 border-amber-500/30',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30'
  };

  return (
    <div 
      className={`
        group relative cursor-pointer transition-all duration-300 transform hover:scale-105
        ${isActive ? 'scale-105' : ''}
      `}
      onClick={onClick}
    >
      {/* Gradient border effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[metric.color]} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 group-hover:border-transparent transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 bg-${metric.color}-500/10 rounded-lg`}>
            {metric.icon}
          </div>
          <span className={`text-xs font-medium ${metric.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
            {metric.trend}
          </span>
        </div>
        
        <div>
          <p className="text-xs text-slate-400 mb-1">{metric.title}</p>
          <p className="text-lg font-bold text-white font-mono">{metric.value}</p>
        </div>
      </div>
    </div>
  );
};

// Feature Cards Section (from docs)
const FeatureCards = () => {
  const features = [
    {
      title: 'Your Personal Compliance Team',
      description: '12 AI agents handle the boring stuff: AWS security checks ✓ GitHub vulnerabilities fixed ✓ GDPR records updated ✓ You focus on what matters.',
      icon: <Settings className="w-6 h-6" />,
      color: 'emerald'
    },
    {
      title: 'Enterprise Customers Love This',
      description: 'Same-day security questionnaire responses. GDPR RoPA ready in 30 minutes. No more losing deals to compliance delays.',
      icon: <Shield className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'Save $500K+ Annually',
      description: '83% cheaper than OneTrust. 88% less than Big 4 consulting. Revolutionary GDPR RoPA automation that actually works.',
      icon: <Zap className="w-6 h-6" />,
      color: 'amber'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-light text-white mb-4">
            Revolutionary GDPR RoPA automation
            <span className="block font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              (83% cheaper than OneTrust)
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Your compliance team will finally sleep well. Our AI agents handle the tedious work so you can focus on growing your business and winning enterprise deals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Individual Feature Card (from docs)
const FeatureCard = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background */}
      <div className={`
        absolute inset-0 bg-gradient-to-br from-${feature.color}-500/10 to-${feature.color}-600/10 
        rounded-2xl transition-all duration-500 transform 
        ${isHovered ? 'scale-105 opacity-100' : 'scale-100 opacity-0'}
      `} />
      
      <div className="relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 transition-all duration-300 group-hover:border-white/20">
        <div className={`w-12 h-12 bg-${feature.color}-500/10 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
          {feature.icon}
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-4 font-serif">{feature.title}</h3>
        <p className="text-slate-400 leading-relaxed">{feature.description}</p>
        
        <div className="mt-6">
          <button className="text-emerald-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
            Learn More
            <ChevronDown className="w-4 h-4 transform -rotate-90 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Navigation Dropdown Component
const NavigationDropdown = ({ title, items, isOpen, onToggle, navigate }) => {
  return (
    <div className="relative group">
      <button 
        onClick={onToggle}
        className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors duration-200 font-medium relative group"
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-2xl py-4 z-50">
          <div className="px-6 py-2 border-b border-slate-700/50 mb-2">
            <h3 className="text-white font-semibold text-sm">{title}</h3>
          </div>
          <div className="space-y-1">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.action) item.action();
                  else if (item.path) navigate(item.path);
                  onToggle();
                }}
                className="w-full px-6 py-3 text-left hover:bg-slate-700/50 transition-colors duration-200 group/item"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-${item.color || 'emerald'}-500/10 group-hover/item:bg-${item.color || 'emerald'}-500/20 transition-colors duration-200`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm group-hover/item:text-emerald-400 transition-colors duration-200">
                      {item.title}
                    </h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Navigation Component with Dropdowns
const EnhancedNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const platformItems = [
    {
      title: 'Agent Dashboard',
      description: 'Monitor and manage all AI compliance agents in real-time',
      icon: <Settings className="w-4 h-4 text-emerald-400" />,
      path: '/velocity/dashboard',
      color: 'emerald'
    },
    {
      title: 'Trust Score Engine',
      description: 'Real-time trust calculations with sub-100ms performance',
      icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
      path: '/velocity/dashboard',
      color: 'blue'
    },
    {
      title: 'Evidence Collection',
      description: 'Automated evidence gathering from AWS, GCP, Azure, GitHub',
      icon: <FileText className="w-4 h-4 text-purple-400" />,
      path: '/velocity/dashboard',
      color: 'purple'
    },
    {
      title: 'Compliance Monitoring',
      description: 'Continuous monitoring with drift detection and alerting',
      icon: <Bell className="w-4 h-4 text-amber-400" />,
      path: '/velocity/dashboard',
      color: 'amber'
    }
  ];

  const solutionsItems = [
    {
      title: 'SOC 2 Compliance',
      description: 'Automated SOC 2 Type I & II evidence collection and reporting',
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      path: '/velocity/dashboard',
      color: 'emerald'
    },
    {
      title: 'ISO 27001',
      description: 'Complete ISO 27001 compliance automation and certification support',
      icon: <CheckCircle className="w-4 h-4 text-blue-400" />,
      path: '/velocity/dashboard',
      color: 'blue'
    },
    {
      title: 'GDPR & Privacy',
      description: 'EU GDPR compliance with automated privacy impact assessments',
      icon: <Users className="w-4 h-4 text-purple-400" />,
      path: '/velocity/dashboard',
      color: 'purple'
    },
    {
      title: 'Multi-Framework',
      description: 'Support for HIPAA, PCI DSS, NIST, and custom frameworks',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      path: '/velocity/dashboard',
      color: 'amber'
    }
  ];

  const resourcesItems = [
    {
      title: 'Documentation',
      description: 'Complete API documentation and integration guides',
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
      path: '/velocity/docs',
      color: 'emerald'
    },
    {
      title: 'Compliance Library',
      description: 'Pre-built templates and controls for major frameworks',
      icon: <Shield className="w-4 h-4 text-blue-400" />,
      path: '/velocity/dashboard',
      color: 'blue'
    },
    {
      title: 'Expert Network',
      description: 'Direct access to compliance experts and auditors',
      icon: <Users className="w-4 h-4 text-purple-400" />,
      path: '/velocity/dashboard',
      color: 'purple'
    },
    {
      title: 'Community',
      description: 'Join the Velocity community for best practices and support',
      icon: <Bell className="w-4 h-4 text-amber-400" />,
      action: () => window.open('https://community.velocity.ai', '_blank'),
      color: 'amber'
    }
  ];

  const pricingItems = [
    {
      title: 'Starter Plan',
      description: 'Perfect for small teams getting started with compliance',
      icon: <Clock className="w-4 h-4 text-emerald-400" />,
      path: '/velocity/pricing',
      color: 'emerald'
    },
    {
      title: 'Professional',
      description: 'Advanced features for growing companies and enterprises',
      icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
      path: '/velocity/pricing',
      color: 'blue'
    },
    {
      title: 'Enterprise',
      description: 'Custom solutions with dedicated support and SLAs',
      icon: <Shield className="w-4 h-4 text-purple-400" />,
      path: '/velocity/pricing',
      color: 'purple'
    },
    {
      title: 'Free Trial',
      description: '30-day free trial with full access to all features',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      path: '/velocity/signup',
      color: 'amber'
    }
  ];

  const toggleDropdown = (dropdown) => (e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <nav className={`
      fixed top-0 w-full z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/50' 
        : 'bg-transparent'
      }
    `}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg blur-sm opacity-50"></div>
            </div>
            <span className="text-xl font-bold text-white font-serif">Velocity</span>
          </div>
          
          {/* Navigation Links with Dropdowns */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavigationDropdown
              title="Platform"
              items={platformItems}
              isOpen={activeDropdown === 'platform'}
              onToggle={toggleDropdown('platform')}
              navigate={navigate}
            />
            <NavigationDropdown
              title="Solutions"
              items={solutionsItems}
              isOpen={activeDropdown === 'solutions'}
              onToggle={toggleDropdown('solutions')}
              navigate={navigate}
            />
            <NavigationDropdown
              title="Resources"
              items={resourcesItems}
              isOpen={activeDropdown === 'resources'}
              onToggle={toggleDropdown('resources')}
              navigate={navigate}
            />
            <NavigationDropdown
              title="Pricing"
              items={pricingItems}
              isOpen={activeDropdown === 'pricing'}
              onToggle={toggleDropdown('pricing')}
              navigate={navigate}
            />
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleDropdown('mobile')}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* CTA Section */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => navigate('/velocity/login')}
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/velocity/signup')}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {activeDropdown === 'mobile' && (
          <div className="lg:hidden py-4 border-t border-slate-800/50">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-white font-semibold text-sm px-4">Platform</h3>
                {platformItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (item.action) item.action();
                      else if (item.path) navigate(item.path);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:text-white transition-colors"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-800/50 pt-4 px-4 space-y-2">
                <button 
                  onClick={() => navigate('/velocity/login')}
                  className="w-full text-left text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/velocity/signup')}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Evidence Collection Section
const EvidenceCollectionSection = () => {
  const steps = [
    {
      step: "🔗 Connect Securely",
      title: "Safe System Integration",
      description: "AI agents safely connect to your AWS, GCP, Azure, and GitHub using secure APIs"
    },
    {
      step: "🔍 Smart Discovery", 
      title: "Automatic Security Scanning",
      description: "✅ Found 47 security controls - Your AWS setup looks great!"
    },
    {
      step: "📸 Evidence Capture",
      title: "Professional Documentation",
      description: "🛡️ Your security monitoring looks excellent! Screenshots and configs collected."
    },
    {
      step: "📂 Intelligent Organization",
      title: "Framework-Ready Packages",
      description: "📈 Your compliance score improved! Everything sorted by SOC 2, GDPR, ISO 27001."
    },
    {
      step: "📋 Audit-Ready Results",
      title: "Same-Day Responses",
      description: "🔒 Documented your code security practices - Ready to impress enterprise prospects!"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-light text-white mb-4">
            Evidence Collection on
            <span className="block font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              Autopilot
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            No more scrambling during audits—you're always ready with professional documentation packages. AI agents work 24/7 so your team can focus on growing the business.
          </p>
          <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25">
            See Your Evidence Collection in Action
          </button>
        </div>
        
        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="text-2xl mb-3">{step.step}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-300">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">Here's What Your Agents Just Found:</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                <div className="text-emerald-400 font-medium mb-2">✅ AWS Agent</div>
                <div className="text-sm text-slate-300">Found proof your logging works perfectly - 47 CloudTrail configurations verified</div>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                <div className="text-blue-400 font-medium mb-2">🛡️ Azure Agent</div>
                <div className="text-sm text-slate-300">Your security monitoring looks excellent! 23 security center controls documented</div>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                <div className="text-purple-400 font-medium mb-2">📈 Trust Engine</div>
                <div className="text-sm text-slate-300">Your compliance score just improved to 94%! Powered by Claude Sonnet 4</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Velocity Landing Component
const VelocityLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600;700&display=swap');
        
        .font-serif {
          font-family: 'Instrument Serif', serif;
        }
        
        .font-sans {
          font-family: 'Manrope', sans-serif;
        }
        
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>
      
      <EnhancedNavigation />
      <EnhancedHero />
      <FeatureCards />
      <EvidenceCollectionSection />
      <VelocityFooter />
      <BackToTopButton variant="emerald" alwaysVisible={true} />
    </div>
  );
};

export default VelocityLanding;