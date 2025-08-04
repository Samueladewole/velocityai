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
  Phone,
  DollarSign,
  Calculator,
  Rocket,
  Building,
  AlertTriangle
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
                  <div className="text-xs text-slate-400">Learn about automation</div>
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
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">QIE Intelligence</div>
                  <div className="text-xs text-slate-400">Questionnaire automation</div>
                </button>
              </div>
            </div>
            <div className="relative group">
              <button className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                Industries
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button 
                  onClick={() => navigate('/industries/financial-services')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Financial Services</div>
                  <div className="text-xs text-slate-400">Banking & FinTech</div>
                </button>
                <button 
                  onClick={() => navigate('/industries/healthcare')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Healthcare & Life Sciences</div>
                  <div className="text-xs text-slate-400">HIPAA & FDA compliance</div>
                </button>
                <button 
                  onClick={() => navigate('/industries/saas')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">SaaS & Technology</div>
                  <div className="text-xs text-slate-400">SOC 2 & ISO 27001</div>
                </button>
                <button 
                  onClick={() => navigate('/industries/manufacturing')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Manufacturing</div>
                  <div className="text-xs text-slate-400">Industrial IoT security</div>
                </button>
                <button 
                  onClick={() => navigate('/industries/government')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Government</div>
                  <div className="text-xs text-slate-400">FedRAMP & FISMA</div>
                </button>
                <button 
                  onClick={() => navigate('/industries/energy')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Energy</div>
                  <div className="text-xs text-slate-400">NERC CIP & critical infrastructure</div>
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
                  onClick={() => navigate('/calculators/banking-roi')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Banking ROI Calculator</div>
                  <div className="text-xs text-slate-400">81% vs traditional solutions</div>
                </button>
                <button 
                  onClick={() => navigate('/solutions/isae-3000')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">ISAE 3000 Evidence</div>
                  <div className="text-xs text-slate-400">88% vs Big 4 consulting</div>
                </button>
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
                  onClick={() => navigate('/velocity/solutions/hipaa')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">HIPAA Automation</div>
                  <div className="text-xs text-slate-400">Healthcare compliance</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/solutions/pci-dss')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">PCI DSS</div>
                  <div className="text-xs text-slate-400">Payment security</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/solutions/cis-controls')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">CIS Controls</div>
                  <div className="text-xs text-slate-400">Cybersecurity framework</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/solutions/gdpr')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">GDPR Automation</div>
                  <div className="text-xs text-slate-400">Data protection compliance</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/solutions/gdpr')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">GDPR International Transfers</div>
                  <div className="text-xs text-slate-400">Cross-border data compliance</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/frameworks')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">NIST Framework</div>
                  <div className="text-xs text-slate-400">Cybersecurity standards</div>
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
                  onClick={() => navigate('/velocity/api')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">API Reference</div>
                  <div className="text-xs text-slate-400">Developer tools & APIs</div>
                </button>
                <button 
                  onClick={() => navigate('/case-studies')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Case Studies</div>
                  <div className="text-xs text-slate-400">Customer success stories</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/blog')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Blog</div>
                  <div className="text-xs text-slate-400">Latest insights & updates</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/support')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Support</div>
                  <div className="text-xs text-slate-400">Get help from experts</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/demo')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Interactive Demo</div>
                  <div className="text-xs text-slate-400">Try compliance scenarios</div>
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
                  <div className="text-xs text-slate-400">€500K-€2M seed presentation</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/about')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">About Us</div>
                  <div className="text-xs text-slate-400">Our mission and team</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/careers')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Careers</div>
                  <div className="text-xs text-slate-400">Join our team</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/contact')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Contact</div>
                  <div className="text-xs text-slate-400">Get in touch</div>
                </button>
              </div>
            </div>
            <button 
              onClick={() => navigate('/velocity/pricing')}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Pricing
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
              Watch AI Agents
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
              onClick={() => { navigate('/platform/overview'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Platform Overview
            </button>
            <button 
              onClick={() => { navigate('/platform/evidence-collection'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Evidence Collection
            </button>
            <button 
              onClick={() => { navigate('/platform/trust-score'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Trust Score
            </button>
            <button 
              onClick={() => { navigate('/velocity/qie'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              QIE Intelligence
            </button>
            <div className="text-slate-400 text-sm font-medium py-1 pt-4">Industries</div>
            <button 
              onClick={() => { navigate('/industries/financial-services'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Financial Services
            </button>
            <button 
              onClick={() => { navigate('/industries/healthcare'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Healthcare
            </button>
            <button 
              onClick={() => { navigate('/industries/saas'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              SaaS
            </button>
            <button 
              onClick={() => { navigate('/industries/manufacturing'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Manufacturing
            </button>
            <button 
              onClick={() => { navigate('/industries/government'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Government
            </button>
            <button 
              onClick={() => { navigate('/industries/energy'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Energy
            </button>
            
            <div className="text-slate-400 text-sm font-medium py-1 pt-4">Solutions</div>
            <button 
              onClick={() => { navigate('/calculators/banking-roi'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              <div className="font-medium">Banking ROI Calculator</div>
              <div className="text-xs text-slate-400">81% vs traditional solutions</div>
            </button>
            <button 
              onClick={() => { navigate('/solutions/isae-3000'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              <div className="font-medium">ISAE 3000 Evidence</div>
              <div className="text-xs text-slate-400">88% vs Big 4 consulting</div>
            </button>
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
            
            <div className="text-slate-400 text-sm font-medium py-1 pt-4">Resources</div>
            <button 
              onClick={() => { navigate('/velocity/resources'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Compliance Guides
            </button>
            <button 
              onClick={() => { navigate('/velocity/docs'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Documentation
            </button>
            <button 
              onClick={() => { navigate('/velocity/api'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              API Reference
            </button>
            <button 
              onClick={() => { navigate('/case-studies'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Case Studies
            </button>
            <button 
              onClick={() => { navigate('/velocity/blog'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Blog
            </button>
            <button 
              onClick={() => { navigate('/velocity/support'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Support
            </button>
            <button 
              onClick={() => { navigate('/velocity/demo'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4"
            >
              Interactive Demo
            </button>
            
            <button 
              onClick={() => { navigate('/velocity/pricing'); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pt-4"
            >
              Pricing
            </button>
            <div className="pt-4 border-t border-slate-700/50 space-y-2">
              <button
                onClick={() => { navigate('/velocity/login'); setMobileMenuOpen(false); }}
                className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2"
              >
                Sign In
              </button>
              <button
                onClick={() => { 
                  console.log('Mobile - Explore All 13 Agents button clicked');
                  setMobileMenuOpen(false);
                  
                  // Store current position for return navigation
                  const currentPosition = {
                    url: window.location.href,
                    scrollY: window.scrollY,
                    timestamp: Date.now()
                  };
                  sessionStorage.setItem('velocity_return_position', JSON.stringify(currentPosition));
                  
                  // Use window.location.href for direct navigation with hash
                  window.location.href = '/velocity/trust-pathway#ai-agents-section';
                }}
                className="block w-full px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
              >
                Explore All 13 Agents
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
            <p className="text-xs text-white/60">SOC 2 • ISO 27001 • Basel III</p>
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
  
  const frameworks = ['Banking ROI Calculator', 'ISAE 3000', 'SOC 2', 'ISO 27001', 'HIPAA', 'Basel III'];
  
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
                ✨ Trusted by 500+ Companies • Banking ROI Calculator • ISAE 3000 • Zero Manual Work
              </span>
            </div>
            
            <h1 className="font-serif text-5xl lg:text-7xl font-light text-white mb-6 leading-tight">
              Stop Drowning in
              <span className="block font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
                Compliance Paperwork
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed font-light max-w-lg">
              Our 13 AI agents work around the clock so you don't have to. Get audit-ready in 30 minutes, not 6 months. Win enterprise deals with same-day security responses.
            </p>
            
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 mb-8 border border-white/10">
              <p className="text-sm text-slate-300 mb-2">
                <span className="font-semibold text-emerald-400">Revolutionary Banking ROI automation</span> (81% cheaper than traditional solutions) and 
                <span className="font-semibold text-blue-400"> ISAE 3000 evidence collection</span> (88% less than Big 4 consulting). 
                Your compliance team will finally sleep well.
              </p>
              <p className="text-xs text-slate-400">
                🧠 Powered by Advanced AI Technology • Superior reasoning and context handling
              </p>
            </div>

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
                onClick={() => {
                  console.log('Explore All 13 Agents button clicked');
                  
                  // Store current position for return navigation
                  const currentPosition = {
                    url: window.location.href,
                    scrollY: window.scrollY,
                    timestamp: Date.now()
                  };
                  sessionStorage.setItem('velocity_return_position', JSON.stringify(currentPosition));
                  
                  // Use window.location.href for direct navigation with hash
                  window.location.href = '/velocity/trust-pathway#ai-agents-section';
                }}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Explore All 13 Agents
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button 
                onClick={() => navigate('/velocity/demo')}
                className="group flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Play className="w-5 h-5" />
                Calculate Time Savings
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
                { agent: 'AWS Evidence Collector', task: '✅ Found proof your logging works perfectly', status: 'active' },
                { agent: 'Trust Score Engine', task: '📈 Your compliance score just improved to 94%!', status: 'active' },
                { agent: 'GitHub Security Analyzer', task: '🔒 Documented your code security practices', status: 'active' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <Bot className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-mono font-medium mb-1">{item.agent}</div>
                      <div className="text-sm text-slate-300">{item.task}</div>
                    </div>
                  </div>
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
      value: '€120K',
      label: 'Average Annual Savings',
      description: 'Per customer in first year',
      icon: '💰',
      colorClasses: 'from-green-400 to-emerald-500'
    },
    {
      value: '2 Hours',
      label: 'Questionnaire Response',
      description: 'vs 2 weeks industry standard',
      icon: '⚡',
      colorClasses: 'from-blue-400 to-cyan-500'
    },
    {
      value: '95%',
      label: 'Evidence Automation',
      description: 'vs 40% industry average',
      icon: '🤖',
      colorClasses: 'from-purple-400 to-pink-500'
    },
    {
      value: '650%',
      label: 'Average ROI',
      description: 'Return on investment',
      icon: '📈',
      colorClasses: 'from-orange-400 to-red-500'
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
              <div className={`text-3xl font-bold bg-gradient-to-r ${metric.colorClasses} bg-clip-text text-transparent mb-2`}>
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
      name: 'AWS Agent',
      description: 'Automates AWS evidence collection',
      capabilities: ['CloudTrail monitoring', 'Config rules validation', 'Security Hub integration', 'Auto-scaling compliance'],
      automation: 98,
      icon: Zap
    },
    {
      name: 'GCP Agent',
      description: 'Google Cloud compliance automation',
      capabilities: ['IAM policy analysis', 'Security Command Center', 'Resource inventory', 'Compliance scanning'],
      automation: 97,
      icon: Cpu
    },
    {
      name: 'GitHub Agent',
      description: 'Code repository security scanning',
      capabilities: ['Security settings scan', 'Branch protection rules', 'Access control audit', 'Code compliance'],
      automation: 99,
      icon: Database
    },
    {
      name: 'QIE Agent',
      description: 'Questionnaire Intelligence Engine',
      capabilities: ['Framework questionnaires', 'AI-powered responses', 'Multi-framework mapping', 'Automated answers'],
      automation: 94,
      icon: FileText
    },
    {
      name: 'Trust Score Agent',
      description: 'Real-time compliance scoring',
      capabilities: ['Blockchain proofs', 'Evidence verification', 'Trust calculation', 'Cryptographic validation'],
      automation: 100,
      icon: Shield
    },
    {
      name: 'Monitoring Agent',
      description: 'Continuous compliance monitoring',
      capabilities: ['Drift detection', 'Real-time alerts', 'Configuration tracking', '24/7 surveillance'],
      automation: 97,
      icon: Eye
    },
    {
      name: 'Evidence Agent',
      description: 'Automated evidence collection',
      capabilities: ['Policy generation', 'Evidence documentation', 'Report creation', 'Audit preparation'],
      automation: 95,
      icon: FileText
    },
    {
      name: 'Framework Agent',
      description: 'Multi-framework management',
      capabilities: ['SOC 2 automation', 'ISO 27001 mapping', 'HIPAA compliance', 'Framework orchestration'],
      automation: 98,
      icon: Layers
    },
    {
      name: 'Integration Agent',
      description: 'Third-party tool connections',
      capabilities: ['API integrations', 'Tool synchronization', 'Data flow automation', 'System connectivity'],
      automation: 96,
      icon: Settings
    },
    {
      name: 'Reporting Agent',
      description: 'Automated compliance reporting',
      capabilities: ['Executive dashboards', 'Audit reports', 'Compliance metrics', 'Real-time analytics'],
      automation: 93,
      icon: BarChart3
    },
    {
      name: 'GDPR Compliance Agent',
      description: 'Data protection and international transfer automation',
      capabilities: ['Data mapping', 'Consent management', 'International transfer monitoring', 'Privacy impact assessments'],
      automation: 96,
      icon: Globe
    },
    {
      name: 'ISAE 3000 Evidence Agent',
      description: 'Banking evidence automation for ISAE 3000 compliance',
      capabilities: ['Core banking integration', 'Control evidence collection', 'Audit trail generation', 'Financial services compliance'],
      automation: 94,
      icon: Building
    },
    {
      name: 'Risk Assessment Engine',
      description: 'Automated risk evaluation and treatment planning',
      capabilities: ['Risk identification', 'Impact assessment', 'Treatment recommendations', 'Continuous risk monitoring'],
      automation: 92,
      icon: AlertTriangle
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white font-serif mb-6">
            13 Specialized AI Agents
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Revolutionary automation including GDPR compliance and ISAE 3000 evidence collection. 
            95% of compliance tasks automated across all major frameworks.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {agents.slice(0, 3).map((agent, index) => (
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
          <button 
            onClick={() => {
              console.log('Third Explore All 13 Agents button clicked');
              
              // Store current position for return navigation
              const currentPosition = {
                url: window.location.href,
                scrollY: window.scrollY,
                timestamp: Date.now()
              };
              sessionStorage.setItem('velocity_return_position', JSON.stringify(currentPosition));
              
              // Use window.location.href for direct navigation with hash
              window.location.href = '/velocity/trust-pathway#ai-agents-section';
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <Bot className="w-5 h-5" />
            Explore All 13 Agents
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Evidence Collection Section
const EvidenceCollectionSection = () => {
  const navigate = useNavigate();
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

// Competitive Advantages Section
const CompetitiveAdvantagesSection = () => {
  const navigate = useNavigate();
  
  const advantages = [
    {
      title: "83% vs Traditional Banking Solutions",
      metric: "€137K+ Saved Annually",
      description: "Revolutionary Banking ROI automation vs traditional compliance providers",
      icon: DollarSign,
      color: "emerald"
    },
    {
      title: "88% vs Big 4 Consulting",
      metric: "30 Days vs 6-12 Months",
      description: "ISAE 3000 evidence automation vs Deloitte, PwC, KPMG manual processes",
      icon: Clock,
      color: "blue"
    },
    {
      title: "95% Automation Rate",
      metric: "vs 15-25% Industry Average",
      description: "Highest automation rate with 13 specialized AI agents working 24/7",
      icon: Zap,
      color: "amber"
    },
    {
      title: "6-Week Implementation",
      metric: "vs 6+ Month Traditional",
      description: "Rapid deployment with pre-configured banking and enterprise workflows",
      icon: Rocket,
      color: "purple"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white font-serif mb-6">
            Competitive Advantages That Matter
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Revolutionary cost savings and speed advantages vs traditional solutions. 
            Real metrics from actual enterprise deployments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <div key={index} className={`bg-gradient-to-br from-${advantage.color}-500/10 to-${advantage.color}-600/5 rounded-2xl p-6 border border-${advantage.color}-500/20 hover:border-${advantage.color}-500/40 transition-all duration-300`}>
                <div className="text-center">
                  <div className={`w-12 h-12 bg-${advantage.color}-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-6 h-6 text-${advantage.color}-400`} />
                  </div>
                  <h3 className="font-bold text-white mb-2 text-sm">{advantage.title}</h3>
                  <div className={`text-2xl font-bold text-${advantage.color}-400 mb-3 font-mono`}>
                    {advantage.metric}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{advantage.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table Preview */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white font-serif mb-4">
              Enterprise Cost Comparison
            </h3>
            <p className="text-slate-400">See how Velocity compares to traditional solutions</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-slate-800/50 rounded-xl">
              <div className="text-3xl font-bold text-red-400 mb-2">€100K+</div>
              <div className="text-slate-300 text-sm mb-1">Traditional Compliance</div>
              <div className="text-xs text-slate-500">Annual consulting + audit costs</div>
            </div>
            <div className="text-center p-6 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <div className="text-3xl font-bold text-emerald-400 mb-2">€25K</div>
              <div className="text-slate-300 text-sm mb-1">Velocity Growth Plan</div>
              <div className="text-xs text-emerald-400">Up to 3 frameworks included</div>
            </div>
            <div className="text-center p-6 bg-slate-800/50 rounded-xl">
              <div className="text-3xl font-bold text-emerald-400 mb-2">€75K+</div>
              <div className="text-slate-300 text-sm mb-1">Annual Savings</div>
              <div className="text-xs text-slate-500">75% cost reduction</div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => navigate('/calculators/roi')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
            >
              <Calculator className="w-5 h-5" />
              Calculate Your Savings
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Industry Showcase Section
const IndustryShowcaseSection = () => {
  const navigate = useNavigate();
  
  const industries = [
    {
      name: "Financial Services",
      description: "Banking-specific ROI calculations and ISAE 3000 automation with core banking integrations",
      metrics: ["83% cost savings", "88% vs Big 4", "6-week deployment"],
      icon: Building,
      color: "blue",
      path: "/industries/financial-services"
    },
    {
      name: "Healthcare",
      description: "HIPAA compliance automation with patient data protection and breach prevention",
      metrics: ["95% HIPAA coverage", "30-day implementation", "Zero breaches"],
      icon: Shield,
      color: "emerald",
      path: "/industries/healthcare"
    },
    {
      name: "SaaS",
      description: "Multi-tenant SOC 2 and ISO 27001 automation for software companies",
      metrics: ["96.8% audit pass rate", "45-day audit readiness", "Multi-tenant support"],
      icon: Globe,
      color: "purple",
      path: "/industries/saas"
    },
    {
      name: "Manufacturing",
      description: "Industrial IoT security and operational technology compliance",
      metrics: ["OT/IT convergence", "Supply chain security", "ISO 27001 ready"],
      icon: Settings,
      color: "amber",
      path: "/industries/manufacturing"
    },
    {
      name: "Government",
      description: "FedRAMP and government compliance with advanced security controls",
      metrics: ["FedRAMP ready", "FISMA compliance", "ATO acceleration"],
      icon: Lock,
      color: "red",
      path: "/industries/government"
    },
    {
      name: "Energy",
      description: "Critical infrastructure protection with NERC CIP and cybersecurity frameworks",
      metrics: ["NERC CIP compliance", "Critical infrastructure", "24/7 monitoring"],
      icon: Zap,
      color: "yellow",
      path: "/industries/energy"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white font-serif mb-6">
            Multi-Industry Compliance Leadership
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Specialized automation for 6 key industries with pre-configured workflows, 
            industry-specific integrations, and regulatory expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <div 
                key={index} 
                className={`group bg-gradient-to-br from-${industry.color}-500/5 to-${industry.color}-600/5 rounded-2xl p-6 border border-${industry.color}-500/20 hover:border-${industry.color}-500/40 transition-all duration-300 cursor-pointer`}
                onClick={() => navigate(industry.path)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-${industry.color}-500/10 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${industry.color}-400`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{industry.name}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{industry.description}</p>
                
                <div className="space-y-2">
                  {industry.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className={`w-3 h-3 text-${industry.color}-400 flex-shrink-0`} />
                      <span className="text-xs text-slate-300">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Industry Stats */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white font-serif mb-4">
              Cross-Industry Impact
            </h3>
            <p className="text-slate-400">Proven results across diverse regulatory environments</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">150+</div>
              <div className="text-slate-300 text-sm mb-1">Financial Institutions</div>
              <div className="text-xs text-slate-500">Including Top 10 banks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">300+</div>
              <div className="text-slate-300 text-sm mb-1">Healthcare Organizations</div>
              <div className="text-xs text-slate-500">HIPAA compliant</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-slate-300 text-sm mb-1">SaaS Companies</div>
              <div className="text-xs text-slate-500">SOC 2 certified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">95%</div>
              <div className="text-slate-300 text-sm mb-1">Cross-Industry Success</div>
              <div className="text-xs text-slate-500">First-time audit pass rate</div>
            </div>
          </div>
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
            onClick={() => {
              console.log('Fourth Explore All 13 Agents button clicked');
              
              // Store current position for return navigation
              const currentPosition = {
                url: window.location.href,
                scrollY: window.scrollY,
                timestamp: Date.now()
              };
              sessionStorage.setItem('velocity_return_position', JSON.stringify(currentPosition));
              
              // Use window.location.href for direct navigation with hash
              window.location.href = '/velocity/trust-pathway#ai-agents-section';
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Target className="w-5 h-5" />
            Explore All 13 Agents
          </button>
          
          <button
            onClick={() => navigate('/velocity/demo')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <Calculator className="w-5 h-5" />
            Calculate Time Savings
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
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg blur-sm opacity-50"></div>
              </div>
              <span className="text-xl font-bold text-white font-serif">Velocity</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Stop drowning in compliance paperwork. Our AI agents work around the clock with revolutionary Banking ROI calculations and ISAE 3000 evidence automation. 
              83% cost savings, 88% vs Big 4 consulting.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>✓ 13 AI Agents</span>
              <span>✓ Banking ROI Calculator</span>
              <span>✓ ISAE 3000</span>
            </div>
          </div>
          
          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <div className="space-y-3">
              {[
                { label: 'AI Agent Dashboard', path: '/dashboard' },
                { label: 'Evidence Collection', path: '/dashboard' },
                { label: 'Trust Score', path: '/dashboard' },
                { label: 'QIE Intelligence', path: '/velocity/qie' },
                { label: 'Pricing', path: '/velocity/pricing' }
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
          
          {/* Industries */}
          <div>
            <h3 className="text-white font-semibold mb-4">Industries</h3>
            <div className="space-y-3">
              {[
                { label: 'Financial Services', path: '/industries/financial-services' },
                { label: 'Healthcare', path: '/industries/healthcare' },
                { label: 'SaaS', path: '/industries/saas' },
                { label: 'Manufacturing', path: '/industries/manufacturing' },
                { label: 'Government', path: '/industries/government' },
                { label: 'Energy', path: '/industries/energy' }
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
          
          {/* Solutions */}
          <div>
            <h3 className="text-white font-semibold mb-4">Solutions</h3>
            <div className="space-y-3">
              {[
                { label: 'Banking ROI Calculator', path: '/calculators/banking-roi', badge: '81% savings' },
                { label: 'ISAE 3000', path: '/solutions/isae-3000', badge: '88% vs Big 4' },
                { label: 'SOC 2', path: '/velocity/solutions/soc2' },
                { label: 'ISO 27001', path: '/velocity/solutions/iso27001' },
                { label: 'GDPR & International Transfers', path: '/velocity/solutions/gdpr' },
                { label: 'HIPAA', path: '/velocity/solutions/hipaa' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="block text-slate-400 hover:text-white transition-colors text-sm w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded ml-2 flex-shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <div className="space-y-3">
              {[
                { label: 'Compliance Guides', path: '/guides/compliance-automation' },
                { label: 'ROI Calculator', path: '/calculators/roi' },
                { label: 'Banking ROI', path: '/calculators/banking-roi' },
                { label: 'GDPR ROI', path: '/calculators/gdpr-roi' },
                { label: 'Case Studies', path: '/case-studies' },
                { label: 'Demo', path: '/velocity/demo' },
                { label: 'Documentation', path: '/velocity/docs' }
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
        <CompetitiveAdvantagesSection />
        <IndustryShowcaseSection />
        <EvidenceCollectionSection />
        <SocialProofSection />
        <CTASection />
      </main>
      <PublicFooter />
    </div>
  );
};

export default VelocityLandingComplete;