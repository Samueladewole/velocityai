import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/velocity')}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg blur-sm opacity-50"></div>
            </div>
            <span className="text-xl font-bold text-white font-serif">Velocity</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Platform Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('platform')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors font-medium">
                Platform
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'platform' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md rounded-lg border border-slate-700/50 py-2 shadow-xl">
                  <button onClick={() => navigate('/platform/overview')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">Platform Overview</div>
                    <div className="text-xs text-slate-400">12 AI agents & features</div>
                  </button>
                  <button onClick={() => navigate('/dashboard')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">AI Agent Dashboard</div>
                    <div className="text-xs text-slate-400">Live agent monitoring</div>
                  </button>
                  <button onClick={() => navigate('/dashboard')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">Evidence Collection</div>
                    <div className="text-xs text-slate-400">400+ evidence types</div>
                  </button>
                  <button onClick={() => navigate('/dashboard')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">Trust Score</div>
                    <div className="text-xs text-slate-400">Cryptographic verification</div>
                  </button>
                  <button onClick={() => navigate('/velocity/qie')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">QIE Intelligence</div>
                    <div className="text-xs text-slate-400">AI questionnaire processing</div>
                  </button>
                </div>
              )}
            </div>

            {/* Industries Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('industries')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors font-medium">
                Industries
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'industries' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md rounded-lg border border-slate-700/50 py-2 shadow-xl">
                  <button onClick={() => navigate('/industries/financial-services')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">Financial Services</div>
                    <div className="text-xs text-slate-400">Banking & ISAE 3000</div>
                  </button>
                  <button onClick={() => navigate('/industries/healthcare')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">Healthcare</div>
                    <div className="text-xs text-slate-400">HIPAA compliance</div>
                  </button>
                  <button onClick={() => navigate('/industries/saas')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">SaaS</div>
                    <div className="text-xs text-slate-400">SOC 2 & multi-tenant</div>
                  </button>
                  <button onClick={() => navigate('/industries/manufacturing')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">Manufacturing</div>
                    <div className="text-xs text-slate-400">Industrial IoT security</div>
                  </button>
                  <button onClick={() => navigate('/industries/government')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">Government</div>
                    <div className="text-xs text-slate-400">FedRAMP & FISMA</div>
                  </button>
                  <button onClick={() => navigate('/industries/energy')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">Energy</div>
                    <div className="text-xs text-slate-400">NERC CIP & critical infrastructure</div>
                  </button>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('solutions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors font-medium">
                Solutions
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'solutions' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md rounded-lg border border-slate-700/50 py-2 shadow-xl">
                  <button onClick={() => navigate('/solutions/gdpr-ropa')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">GDPR RoPA Automation</div>
                    <div className="text-xs text-slate-400">83% vs traditional solutions</div>
                  </button>
                  <button onClick={() => navigate('/solutions/isae-3000')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">ISAE 3000 Evidence</div>
                    <div className="text-xs text-slate-400">88% vs Big 4 consulting</div>
                  </button>
                  <button onClick={() => navigate('/velocity/solutions/soc2')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">SOC 2</div>
                    <div className="text-xs text-slate-400">Type II automation</div>
                  </button>
                  <button onClick={() => navigate('/velocity/solutions/iso27001')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">ISO 27001</div>
                    <div className="text-xs text-slate-400">ISMS automation</div>
                  </button>
                  <button onClick={() => navigate('/velocity/solutions/gdpr')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">GDPR</div>
                    <div className="text-xs text-slate-400">Privacy compliance</div>
                  </button>
                  <button onClick={() => navigate('/velocity/solutions/hipaa')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">HIPAA</div>
                    <div className="text-xs text-slate-400">Healthcare compliance</div>
                  </button>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors font-medium">
                Resources
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'resources' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md rounded-lg border border-slate-700/50 py-2 shadow-xl">
                  <button onClick={() => navigate('/guides/compliance-automation')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">Compliance Guides</div>
                    <div className="text-xs text-slate-400">Best practices & frameworks</div>
                  </button>
                  <button onClick={() => navigate('/calculators/roi')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">ROI Calculator</div>
                    <div className="text-xs text-slate-400">Calculate cost savings</div>
                  </button>
                  <button onClick={() => navigate('/calculators/banking-roi')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">Banking ROI</div>
                    <div className="text-xs text-slate-400">Financial services specific</div>
                  </button>
                  <button onClick={() => navigate('/calculators/gdpr-roi')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">GDPR ROI</div>
                    <div className="text-xs text-slate-400">Privacy compliance savings</div>
                  </button>
                  <button onClick={() => navigate('/case-studies')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">Case Studies</div>
                    <div className="text-xs text-slate-400">Customer success stories</div>
                  </button>
                  <button onClick={() => navigate('/velocity/demo')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">Demo</div>
                    <div className="text-xs text-slate-400">Interactive platform demo</div>
                  </button>
                  <button onClick={() => navigate('/velocity/docs')} className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <div className="font-medium">Documentation</div>
                    <div className="text-xs text-slate-400">Technical documentation</div>
                  </button>
                </div>
              )}
            </div>

            {/* Pricing */}
            <button 
              onClick={() => navigate('/velocity/pricing')}
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Pricing
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => navigate('/velocity/login')}
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
            >
              Start Free Assessment
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-800/95 backdrop-blur-md border-t border-slate-700/50">
            <div className="px-6 py-4 space-y-3">
              <div className="text-slate-400 text-sm font-medium py-1">Platform</div>
              <button onClick={() => { navigate('/platform/overview'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                Platform Overview
              </button>
              <button onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                AI Agent Dashboard
              </button>
              
              <div className="text-slate-400 text-sm font-medium py-1 pt-4">Industries</div>
              <button onClick={() => { navigate('/industries/financial-services'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                Financial Services
              </button>
              <button onClick={() => { navigate('/industries/healthcare'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                Healthcare
              </button>
              
              <div className="text-slate-400 text-sm font-medium py-1 pt-4">Solutions</div>
              <button onClick={() => { navigate('/solutions/gdpr-ropa'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                GDPR RoPA Automation
              </button>
              <button onClick={() => { navigate('/solutions/isae-3000'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                ISAE 3000 Evidence
              </button>
              
              <div className="text-slate-400 text-sm font-medium py-1 pt-4">Resources</div>
              <button onClick={() => { navigate('/calculators/roi'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                ROI Calculator
              </button>
              
              <button onClick={() => { navigate('/velocity/pricing'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pt-4">
                Pricing
              </button>
              
              <div className="pt-4 border-t border-slate-700/50 space-y-2">
                <button onClick={() => { navigate('/velocity/login'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2">
                  Sign In
                </button>
                <button onClick={() => { navigate('/velocity/assessment'); setMobileMenuOpen(false); }} className="block w-full px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300">
                  Start Free Assessment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};