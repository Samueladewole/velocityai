import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Shield, 
  ChevronDown, 
  User, 
  Bell,
  ExternalLink,
  Building2,
  Zap,
  Brain,
  Award,
  FileCheck,
  Users,
  Globe,
  Briefcase,
  BookOpen,
  Calculator,
  Video,
  MessageSquare,
  Phone,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';

interface NavigationHeaderProps {
  className?: string;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({ className }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [velocityOpen, setVelocityOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const platformItems = [
    {
      category: 'Overview',
      description: 'See how ERIP transforms compliance into competitive advantage',
      items: [
        { name: 'Platform Overview', href: '/platform', icon: Shield },
        { name: 'Trust Equity™ System', href: '/trust-score', icon: Award },
        { name: 'Value-First Workflow™', href: '/platform', icon: Zap }
      ]
    },
    {
      category: 'Components',
      description: 'Core platform capabilities',
      items: [
        { name: 'QIE - Questionnaire Intelligence', href: '/qie-enhanced', icon: Brain },
        { name: 'ISACA DTEF Automation', href: '/dtef-automation', icon: FileCheck },
        { name: 'Industry Certifications', href: '/certifications', icon: Award },
        { name: 'AI Governance', href: '/ai-governance', icon: Brain },
        { name: 'Privacy Management', href: '/privacy-management', icon: Shield }
      ]
    },
    {
      category: 'Integrations',
      description: 'Connect with your existing tools',
      items: [
        { name: 'Cloud Environments', href: '/tools/integrations', icon: Globe },
        { name: 'Security Tools', href: '/tools/integrations', icon: Shield },
        { name: 'Compliance Platforms', href: '/tools/integrations', icon: FileCheck }
      ]
    },
    {
      category: 'Trust Score',
      description: 'See how Trust Score accelerates sales',
      items: [
        { name: 'Share Trust Score', href: '/trust-score-share', icon: ExternalLink },
        { name: 'Public Profiles', href: '/public-profiles', icon: Users },
        { name: 'Sales Acceleration', href: '/sales-acceleration', icon: Zap }
      ]
    }
  ];

  const velocityItems = [
    {
      category: 'AI Agents',
      description: '95% compliance automation with AI-powered evidence collection',
      items: [
        { name: 'Velocity Overview', href: '/velocity', icon: Award },
        { name: 'Agent Dashboard', href: '/velocity/dashboard', icon: Zap },
        { name: '30-Min Onboarding', href: '/velocity/onboarding', icon: Clock },
        { name: 'Evidence Review', href: '/velocity/evidence', icon: FileCheck },
        { name: 'Integration Hub', href: '/velocity/integration', icon: Globe }
      ]
    },
    {
      category: 'Velocity Tiers',
      description: 'Pricing designed for fast-growing AI startups',
      items: [
        { name: 'Velocity Pricing', href: '/velocity/pricing', icon: Calculator },
        { name: 'Starter ($999/mo)', href: '/velocity/pricing', icon: Zap },
        { name: 'Growth ($2,499/mo)', href: '/velocity/pricing', icon: Building2 },
        { name: 'Scale ($4,999/mo)', href: '/velocity/pricing', icon: Award }
      ]
    }
  ];

  const solutionsByUseCase = [
    { name: 'Compliance Automation', href: '/solutions/compliance-automation', description: '95% time reduction' },
    { name: 'Risk Quantification', href: '/solutions/risk-quantification', description: 'FAIR methodology' },
    { name: 'Sales Acceleration', href: '/solutions/sales-acceleration', description: '40% faster deals' },
    { name: 'AI Governance', href: '/solutions/ai-governance', description: 'ISO 42001 compliance' },
    { name: 'Privacy Management', href: '/solutions/privacy-management', description: 'GDPR automation' }
  ];

  const solutionsByIndustry = [
    { name: 'Financial Services', href: '/solutions/financial-services' },
    { name: 'Healthcare', href: '/solutions/healthcare' },
    { name: 'Technology/SaaS', href: '/solutions/technology' },
    { name: 'Automotive', href: '/solutions/automotive' },
    { name: 'Manufacturing', href: '/solutions/manufacturing' }
  ];

  const solutionsByCompanySize = [
    { name: 'Startups', href: '/solutions/startups' },
    { name: 'Scaleups', href: '/solutions/scaleups' },
    { name: 'Mid-Market', href: '/solutions/mid-market' },
    { name: 'Enterprise', href: '/solutions/enterprise' }
  ];

  const resourceItems = [
    { name: 'Documentation', href: '/docs', icon: BookOpen },
    { name: 'API Reference', href: '/api-docs', icon: FileCheck },
    { name: 'Trust Academy', href: '/academy', icon: Users },
    { name: 'Blog & Insights', href: '/blog', icon: MessageSquare },
    { name: 'Webinars', href: '/webinars', icon: Video },
    { name: 'Case Studies', href: '/case-studies', icon: Briefcase },
    { name: 'ROI Calculator', href: '/roi-calculator', icon: Calculator }
  ];

  const pricingTiers = [
    { name: 'Starter', price: '€500/month', href: '/pricing/starter' },
    { name: 'Growth', price: '€1,500/month', href: '/pricing/growth' },
    { name: 'Enterprise', price: 'Custom', href: '/pricing/enterprise' }
  ];

  const companyItems = [
    { name: 'About ERIP', href: '/company/about', icon: Building2 },
    { name: 'Seed Pitch (€2M)', href: '/company/seed-pitch', icon: Award },
    { name: 'Contact', href: '/company/contact', icon: Phone },
    { name: 'Team', href: '/company/team', icon: Users },
    { name: 'Careers', href: '/company/careers', icon: Briefcase }
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm",
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                ERIP
              </h1>
              <p className="text-xs text-slate-500 font-medium">Trust Intelligence Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Platform Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setPlatformOpen(true)}
              onMouseLeave={() => setPlatformOpen(false)}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                onClick={() => setPlatformOpen(!platformOpen)}
              >
                Platform
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {platformOpen && (
                <div 
                  className="absolute top-full left-0 mt-0 pt-2 w-screen max-w-4xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-6 grid grid-cols-2 gap-6">
                  {platformItems.map((category) => (
                    <div key={category.category}>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">{category.category}</h3>
                      <p className="text-xs text-slate-500 mb-3">{category.description}</p>
                      <ul className="space-y-2">
                        {category.items.map((item) => (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              className="flex items-center gap-2 px-2 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
                              onClick={() => setPlatformOpen(false)}
                            >
                              <item.icon className="h-4 w-4" />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  </div>
                </div>
              )}
            </div>

            {/* Velocity Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setVelocityOpen(true)}
              onMouseLeave={() => setVelocityOpen(false)}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors relative"
                onClick={() => setVelocityOpen(!velocityOpen)}
              >
                <span className="relative">
                  Velocity
                  <span className="absolute -top-1 -right-2 px-1 py-0.5 text-xs bg-purple-100 text-purple-600 rounded-full font-bold">
                    NEW
                  </span>
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {velocityOpen && (
                <div 
                  className="absolute top-full left-0 mt-0 pt-2 w-screen max-w-3xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-white border border-purple-200 rounded-lg shadow-xl p-6 grid grid-cols-2 gap-6 bg-gradient-to-br from-purple-50 to-pink-50">
                  {velocityItems.map((category) => (
                    <div key={category.category}>
                      <h3 className="text-sm font-semibold text-purple-900 mb-1">{category.category}</h3>
                      <p className="text-xs text-purple-600 mb-3">{category.description}</p>
                      <ul className="space-y-2">
                        {category.items.map((item) => (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              className="flex items-center gap-2 px-2 py-1 text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded transition-colors"
                              onClick={() => setVelocityOpen(false)}
                            >
                              <item.icon className="h-4 w-4" />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  </div>
                </div>
              )}
            </div>

            {/* Solutions Mega Menu */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                onMouseEnter={() => setSolutionsOpen(true)}
                onMouseLeave={() => setSolutionsOpen(false)}
              >
                Solutions
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {solutionsOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-screen max-w-5xl bg-white border border-slate-200 rounded-lg shadow-xl p-6 grid grid-cols-3 gap-6"
                  onMouseEnter={() => setSolutionsOpen(true)}
                  onMouseLeave={() => setSolutionsOpen(false)}
                >
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">By Use Case</h3>
                    <ul className="space-y-2">
                      {solutionsByUseCase.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className="block px-2 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
                            onClick={() => setSolutionsOpen(false)}
                          >
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-slate-500">{item.description}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">By Industry</h3>
                    <ul className="space-y-2">
                      {solutionsByIndustry.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className="block px-2 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
                            onClick={() => setSolutionsOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">By Company Size</h3>
                    <ul className="space-y-2">
                      {solutionsByCompanySize.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className="block px-2 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
                            onClick={() => setSolutionsOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                onMouseEnter={() => setResourcesOpen(true)}
                onMouseLeave={() => setResourcesOpen(false)}
              >
                Resources
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {resourcesOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-4"
                  onMouseEnter={() => setResourcesOpen(true)}
                  onMouseLeave={() => setResourcesOpen(false)}
                >
                  <ul className="space-y-2">
                    {resourceItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className="flex items-center gap-2 px-2 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
                          onClick={() => setResourcesOpen(false)}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Pricing */}
            <Link
              to="/pricing"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Pricing
            </Link>

            {/* Company Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                onMouseEnter={() => setCompanyOpen(true)}
                onMouseLeave={() => setCompanyOpen(false)}
              >
                Company
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {companyOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-4"
                  onMouseEnter={() => setCompanyOpen(true)}
                  onMouseLeave={() => setCompanyOpen(false)}
                >
                  <ul className="space-y-2">
                    {companyItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className="flex items-center gap-2 px-2 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
                          onClick={() => setCompanyOpen(false)}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Dashboard Button (for authenticated users) */}
            {isAuthenticated && (
              <Button
                onClick={() => navigate('/dashboard')}
                size="sm"
                className="font-medium bg-blue-600 hover:bg-blue-700 text-white"
              >
                Dashboard
              </Button>
            )}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
                </Button>
                
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-slate-200">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
                    <User className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user?.name || 'Guest User'}</p>
                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/demo')}
                  className="text-sm font-medium"
                >
                  Get a Demo
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="erip-gradient-primary text-sm font-medium"
                >
                  Login
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 mt-4 py-4">
            <div className="space-y-4">
              <Link
                to="/platform"
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Platform
              </Link>
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm font-semibold text-purple-900 border-b border-purple-200 bg-purple-50 rounded-lg flex items-center gap-2">
                  <span>Velocity</span>
                  <span className="px-1 py-0.5 text-xs bg-purple-100 text-purple-600 rounded-full font-bold">
                    NEW
                  </span>
                </div>
                <Link
                  to="/velocity"
                  className="block px-3 py-2 text-sm text-purple-700 hover:text-purple-900 font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Velocity Overview
                </Link>
                <Link
                  to="/velocity/pricing"
                  className="block px-3 py-2 text-sm text-purple-700 hover:text-purple-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Velocity Pricing
                </Link>
                <Link
                  to="/velocity/onboarding"
                  className="block px-3 py-2 text-sm text-purple-700 hover:text-purple-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  30-Min Onboarding
                </Link>
                <Link
                  to="/velocity/dashboard"
                  className="block px-3 py-2 text-sm text-purple-700 hover:text-purple-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Agent Dashboard
                </Link>
                <Link
                  to="/velocity/evidence"
                  className="block px-3 py-2 text-sm text-purple-700 hover:text-purple-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Evidence Review
                </Link>
                <Link
                  to="/velocity/integration"
                  className="block px-3 py-2 text-sm text-purple-700 hover:text-purple-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Integration Hub
                </Link>
              </div>
              <Link
                to="/solutions"
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link
                to="/resources"
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
              <Link
                to="/pricing"
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm font-semibold text-slate-900 border-b border-slate-200">
                  Company
                </div>
                {companyItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </div>

              {isAuthenticated && (
                <div className="px-3 py-2">
                  <Button
                    onClick={() => {
                      navigate('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full font-medium bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Dashboard
                  </Button>
                </div>
              )}
              
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    navigate('/demo');
                    setMobileMenuOpen(false);
                  }}
                >
                  Get a Demo
                </Button>
                <Button 
                  className="w-full erip-gradient-primary"
                  onClick={() => {
                    navigate('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};