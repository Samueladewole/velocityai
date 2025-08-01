import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

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
                  <div className="text-xs text-slate-400">13 AI agents & features</div>
                </button>
                <button 
                  onClick={() => navigate('/platform/dashboard')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">AI Agent Dashboard</div>
                  <div className="text-xs text-slate-400">13 agents working for you</div>
                </button>
                <button 
                  onClick={() => navigate('/platform/evidence-collection')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Evidence Collection</div>
                  <div className="text-xs text-slate-400">Automated gathering</div>
                </button>
                <button 
                  onClick={() => navigate('/platform/trust-score')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Trust Score</div>
                  <div className="text-xs text-slate-400">Cryptographic verification</div>
                </button>
                <button 
                  onClick={() => navigate('/platform/qie')}
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
                  onClick={() => navigate('/solutions/gdpr-international-transfers')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">GDPR International Transfers</div>
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
                  onClick={() => navigate('/calculators/roi')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">ROI Calculator</div>
                  <div className="text-xs text-slate-400">Calculate cost savings</div>
                </button>
                <button 
                  onClick={() => navigate('/case-studies')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Case Studies</div>
                  <div className="text-xs text-slate-400">Customer success stories</div>
                </button>
                <button 
                  onClick={() => navigate('/velocity/demo')}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <div className="font-medium">Demo</div>
                  <div className="text-xs text-slate-400">Interactive platform tour</div>
                </button>
              </div>
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
              <button onClick={() => { navigate('/platform/dashboard'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                AI Agent Dashboard
              </button>
              <button onClick={() => { navigate('/platform/evidence-collection'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                Evidence Collection
              </button>
              <button onClick={() => { navigate('/platform/trust-score'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                Trust Score
              </button>
              <button onClick={() => { navigate('/platform/qie'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                QIE Intelligence
              </button>
              
              <div className="text-slate-400 text-sm font-medium py-1 pt-4">Industries</div>
              <button onClick={() => { navigate('/industries/financial-services'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                Financial Services
              </button>
              <button onClick={() => { navigate('/industries/healthcare'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                Healthcare & Life Sciences
              </button>
              <button onClick={() => { navigate('/industries/saas'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                SaaS & Technology
              </button>
              <button onClick={() => { navigate('/industries/manufacturing'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                Manufacturing
              </button>
              <button onClick={() => { navigate('/industries/government'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                Government
              </button>
              <button onClick={() => { navigate('/industries/energy'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                Energy
              </button>
              
              <div className="text-slate-400 text-sm font-medium py-1 pt-4">Solutions</div>
              <button onClick={() => { navigate('/solutions/gdpr-international-transfers'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                GDPR International Transfers
              </button>
              <button onClick={() => { navigate('/solutions/isae-3000'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                ISAE 3000 Evidence
              </button>
              <button onClick={() => { navigate('/velocity/solutions/soc2'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                SOC 2 Automation
              </button>
              <button onClick={() => { navigate('/velocity/solutions/iso27001'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                ISO 27001 Automation
              </button>
              <button onClick={() => { navigate('/velocity/solutions/hipaa'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                HIPAA Automation
              </button>
              <button onClick={() => { navigate('/velocity/solutions/pci-dss'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                PCI DSS
              </button>
              <button onClick={() => { navigate('/velocity/solutions/cis-controls'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                CIS Controls
              </button>
              <button onClick={() => { navigate('/velocity/frameworks'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                NIST Framework
              </button>
              
              <div className="text-slate-400 text-sm font-medium py-1 pt-4">Resources</div>
              <button onClick={() => { navigate('/velocity/resources'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                Compliance Guides
              </button>
              <button onClick={() => { navigate('/calculators/roi'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                ROI Calculator
              </button>
              <button onClick={() => { navigate('/case-studies'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                Case Studies
              </button>
              <button onClick={() => { navigate('/velocity/demo'); setMobileMenuOpen(false); }} className="block w-full text-left text-slate-300 hover:text-white transition-colors py-2 pl-4">
                Demo
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