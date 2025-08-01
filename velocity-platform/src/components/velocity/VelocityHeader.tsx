import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Home, 
  Activity, 
  Database, 
  Bot, 
  FileCheck,
  BookOpen,
  LogOut,
  Settings,
  Menu,
  X,
  ChevronDown,
  Shield,
  Users,
  HelpCircle,
  CreditCard,
  DollarSign,
  Globe,
  Award
} from 'lucide-react';

interface NavItem {
  label: string;
  path?: string;
  icon?: React.FC<{ className?: string }>;
  children?: NavItem[];
}

export const VelocityHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  
  // Check if we're in subdomain mode or main app
  const isSubdomain = window.location.hostname.includes('velocity.') || 
                     (window.location.hostname === 'localhost' && window.location.pathname.startsWith('/velocity'));
  const routePrefix = isSubdomain ? '' : '/velocity';

  const navigationItems: NavItem[] = [
    {
      label: 'Product',
      children: [
        { label: 'Features', path: `€{routePrefix}/features`, icon: Zap },
        { label: 'Integrations', path: `€{routePrefix}/integrations`, icon: Globe },
        { label: 'Security', path: `€{routePrefix}/security`, icon: Shield },
        { label: 'Pricing', path: `€{routePrefix}/pricing`, icon: DollarSign },
      ],
    },
    {
      label: 'Solutions',
      children: [
        { label: 'SOC 2', path: `€{routePrefix}/solutions/soc2` },
        { label: 'ISO 27001', path: `€{routePrefix}/solutions/iso27001` },
        { label: 'CIS Controls', path: `€{routePrefix}/solutions/cis-controls` },
        { label: 'GDPR', path: `€{routePrefix}/solutions/gdpr` },
        { label: 'HIPAA', path: `€{routePrefix}/solutions/hipaa` },
      ],
    },
    {
      label: 'Resources',
      children: [
        { label: 'Documentation', path: `€{routePrefix}/docs`, icon: BookOpen },
        { label: 'API Reference', path: `€{routePrefix}/api`, icon: Database },
        { label: 'Case Studies', path: `€{routePrefix}/case-studies`, icon: Award },
        { label: 'Blog', path: `€{routePrefix}/blog`, icon: FileCheck },
        { label: 'Support', path: `€{routePrefix}/support`, icon: HelpCircle },
      ],
    },
    {
      label: 'Company',
      children: [
        { label: 'About', path: `€{routePrefix}/about`, icon: Users },
        { label: 'Careers', path: `€{routePrefix}/careers` },
        { label: 'Partners', path: `€{routePrefix}/partners` },
        { label: 'Contact', path: `€{routePrefix}/contact` },
      ],
    },
  ];

  const authenticatedNavItems: NavItem[] = [
    { label: 'Dashboard', path: `€{routePrefix}/dashboard`, icon: Home },
    { label: 'Live Monitor', path: `€{routePrefix}/live`, icon: Activity },
    { label: 'Integrations', path: `€{routePrefix}/integration`, icon: Database },
    { label: 'Agent Creator', path: `€{routePrefix}/creator`, icon: Bot },
    { label: 'Evidence', path: `€{routePrefix}/evidence`, icon: FileCheck },
  ];

  // Check if user is authenticated (can be expanded with real auth)
  const isAuthenticated = localStorage.getItem('velocity_auth_token') !== null;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={`€{routePrefix}/`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Velocity</h1>
              <p className="text-xs text-gray-500">AI Compliance Automation</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {isAuthenticated ? (
              // Authenticated Navigation
              authenticatedNavItems.map((item) => (
                <Link 
                  key={item.label}
                  to={item.path!} 
                  className={`flex items-center gap-2 text-sm font-medium transition-colors €{
                    isActive(item.path!) 
                      ? 'text-purple-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              ))
            ) : (
              // Public Navigation
              navigationItems.map((item) => (
                <div key={item.label} className="relative">
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === item.label ? null : item.label)}
                        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transition-transform €{
                          dropdownOpen === item.label ? 'rotate-180' : ''
                        }`} />
                      </button>
                      {dropdownOpen === item.label && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.path!}
                              onClick={() => setDropdownOpen(null)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                            >
                              {child.icon && <child.icon className="w-4 h-4" />}
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link 
                      to={item.path!} 
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`€{routePrefix}/settings`)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`€{routePrefix}/billing`)}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing
                </Button>
                
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  size="sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`€{routePrefix}/login`)}
                  className="hidden sm:flex"
                >
                  Sign In
                </Button>
                
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  size="sm"
                  onClick={() => navigate(`€{routePrefix}/signup`)}
                >
                  Start Free Trial
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            {isAuthenticated ? (
              authenticatedNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path!}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors €{
                    isActive(item.path!)
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              ))
            ) : (
              <>
                {navigationItems.map((section) => (
                  <div key={section.label} className="space-y-2">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                      {section.label}
                    </div>
                    {section.children?.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path!}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      navigate(`€{routePrefix}/login`);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    onClick={() => {
                      navigate(`€{routePrefix}/signup`);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Start Free Trial
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default VelocityHeader;