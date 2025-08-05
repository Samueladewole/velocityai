import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

// PublicHeader Component
export const PublicHeader: React.FC = () => {
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
                  onClick={() => navigate('/velocity/solutions/gdpr')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">GDPR Automation</div>
                  <div className="text-xs text-slate-400">Privacy compliance</div>
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
                  onClick={() => navigate('/calculators/roi')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">ROI Calculator</div>
                  <div className="text-xs text-slate-400">Calculate compliance savings</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/resources')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Resource Center</div>
                  <div className="text-xs text-slate-400">Guides & documentation</div>
                </button>
                <button 
                  onClick={() => navigate('/case-studies')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Case Studies</div>
                  <div className="text-xs text-slate-400">Customer success stories</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/docs')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Documentation</div>
                  <div className="text-xs text-slate-400">API reference & guides</div>
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
          
          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/velocity/login')}
              className="hidden sm:block text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium"
            >
              Free Assessment
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// PublicFooter Component
export const PublicFooter: React.FC = () => {
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
                { label: 'AI Agent Dashboard', path: '/platform/overview' },
                { label: 'Evidence Collection', path: '/platform/evidence-collection' },
                { label: 'Trust Score', path: '/platform/trust-score' },
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