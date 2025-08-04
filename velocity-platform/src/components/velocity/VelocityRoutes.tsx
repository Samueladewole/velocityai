import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import VelocityLandingComplete from './VelocityLandingComplete';
import VelocityDashboardComplete from './VelocityDashboardComplete';
import VelocityHeader from './VelocityHeader';
import VelocityFooter from './VelocityFooter';
import VelocitySignup from './VelocitySignup';
import CustomerImpactShowcase from './CustomerImpactShowcase';
import ROIMetricsDashboard from './ROIMetricsDashboard';
import CompetitiveAdvantageShowcase from './CompetitiveAdvantageShowcase';
import AgentDashboard from '../../pages/AgentDashboard';
import UnifiedDashboard from '../../pages/UnifiedDashboard';
import SOC2Page from '../../pages/solutions/SOC2Page';
import ISO27001Page from '../../pages/solutions/ISO27001Page';
import GDPRPage from '../../pages/solutions/GDPRPage';
import HIPAAPage from '../../pages/solutions/HIPAAPage';
import PCIDSSPage from '../../pages/solutions/PCIDSSPage';
import CISControlsPage from '../../pages/solutions/CISControlsPage';
import FrameworksPage from '../../pages/FrameworksPage';
import IntegrationsPage from '../../pages/IntegrationsPage';
import PricingPage from '../../pages/pricing/PricingPage';
import QIEPage from '../../pages/QIEPage';
import FeaturesPage from '../../pages/FeaturesPage';
import ResourceCenter from '../../pages/resources/ResourceCenter';
import SOC2Guide from '../../pages/resources/guides/SOC2Guide';
import GDPRGuide from '../../pages/resources/guides/GDPRGuide';
import ISO27001Guide from '../../pages/resources/guides/ISO27001Guide';

// New page imports
import PlatformOverview from '../../pages/PlatformOverview';
import FinancialServices from '../../pages/industries/FinancialServices';
import Healthcare from '../../pages/industries/Healthcare';
import SaaS from '../../pages/industries/SaaS';
import Manufacturing from '../../pages/industries/Manufacturing';
import Government from '../../pages/industries/Government';
import Energy from '../../pages/industries/Energy';
import Dashboard from '../../pages/platform/Dashboard';
import EvidenceCollection from '../../pages/platform/EvidenceCollection';
import TrustScore from '../../pages/platform/TrustScore';
import QIE from '../../pages/platform/QIE';
import GDPRInternationalTransfersPage from '../../pages/solutions/GDPRInternationalTransfersPage';
import ISAE3000ServicesPricing from '../../pages/ISAE3000ServicesPricing';
import FinancialServicesPricing from '../../pages/FinancialServicesPricing';
import ROICalculator from '../../pages/calculators/ROICalculator';
import CaseStudies from '../../pages/CaseStudies';
import TrustPathway from '../../pages/TrustPathway';
import BankingROIDemo from '../../pages/demo/BankingROIDemo';
import SettingsPage from '../../pages/SettingsPage';
import ISAE3000EnterpriseModule from '../../pages/ISAE3000EnterpriseModule';
import DemoPage from '../../pages/DemoPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/velocity/login" replace />;
  }
  
  return <>{children}</>;
};

// Create placeholder components for all the routes
const PlaceholderPage = ({ title, description }: { title: string; description: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center">
    <div className="text-center max-w-lg mx-auto px-6">
      <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg mx-auto mb-6 flex items-center justify-center">
        <span className="text-2xl">🚧</span>
      </div>
      <h1 className="text-3xl font-bold text-white font-serif mb-4">{title}</h1>
      <p className="text-slate-400 mb-8">{description}</p>
      <button 
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
      >
        ← Go Back
      </button>
    </div>
  </div>
);

// Enhanced Signup Component - will be moved to separate file later
const EnhancedSignup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    industry: '',
    companySize: '',
    role: '',
    acceptTerms: false,
    acceptMarketing: true
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to dashboard with welcome flow
    navigate('/dashboard?welcome=true');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-purple-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Back to Home Button */}
      <div className="absolute top-8 left-8 z-20">
        <button
          onClick={() => navigate('/velocity')}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-200 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hover:border-white/30 hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Back to Home</span>
        </button>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Value Proposition */}
          <div className="text-center lg:text-left space-y-8">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-purple-500/10 backdrop-blur-sm rounded-full border border-purple-500/20 mb-6">
                <span className="text-purple-400 text-sm font-medium">🎯 Join 500+ Growing Companies</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white font-serif mb-6 leading-tight">
                Start Your
                <span className="block bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Trust Journey
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Transform your security posture into a revenue engine. Join hundreds of companies already accelerating deals and reducing costs.
              </p>
            </div>
            
            {/* Success Stories */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">What You'll Get:</h3>
              {[
                { icon: '⚡', title: '30-Minute Setup', desc: 'Get audit-ready in minutes, not months' },
                { icon: '💎', title: '€4.9M Average Savings', desc: 'Proven ROI with measurable results' },
                { icon: '🚀', title: '340% Faster Sales', desc: 'Accelerate enterprise deals instantly' },
                { icon: '🎯', title: '95% Automation', desc: 'Eliminate manual compliance work' }
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-all">
                  <div className="text-2xl">{benefit.icon}</div>
                  <div>
                    <div className="font-semibold text-white">{benefit.title}</div>
                    <div className="text-sm text-slate-400">{benefit.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Social Proof */}
            <div className="p-6 bg-emerald-500/10 backdrop-blur-sm rounded-xl border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full border-2 border-white/20 flex items-center justify-center text-xs text-white font-semibold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-emerald-400 text-sm font-medium">500+ companies</div>
              </div>
              <p className="text-sm text-emerald-300">
                "Velocity helped us close our Series A 6 months faster by proving our security posture to investors instantly."
              </p>
              <div className="text-xs text-emerald-400 mt-2">— Sarah Chen, CTO at TechCorp</div>
            </div>
          </div>
          
          {/* Right Side - Signup Form */}
          <div className="w-full max-w-lg mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-emerald-400 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Start Free Trial</h2>
                <p className="text-slate-300">No credit card required • 30-day free trial</p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="Your Company Inc."
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Industry</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      required
                    >
                      <option value="">Select Industry</option>
                      <option value="fintech">Fintech</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="saas">SaaS</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Company Size</label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      required
                    >
                      <option value="">Select Size</option>
                      <option value="1-50">1-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="Create a secure password"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/20 rounded bg-white/10 mt-1"
                      required
                    />
                    <label htmlFor="acceptTerms" className="ml-3 text-sm text-slate-300">
                      I agree to the{' '}
                      <button type="button" className="text-purple-400 hover:text-purple-300 underline">
                        Terms of Service
                      </button>
                      {' '}and{' '}
                      <button type="button" className="text-purple-400 hover:text-purple-300 underline">
                        Privacy Policy
                      </button>
                    </label>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      id="acceptMarketing"
                      name="acceptMarketing"
                      type="checkbox"
                      checked={formData.acceptMarketing}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/20 rounded bg-white/10 mt-1"
                    />
                    <label htmlFor="acceptMarketing" className="ml-3 text-sm text-slate-300">
                      Send me product updates and best practices (optional)
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !formData.acceptTerms}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-emerald-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Your Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Start Free Trial
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </button>
                
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <svg className="w-4 h-4 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-emerald-400">
                      30-day free trial • No credit card required
                    </p>
                  </div>
                </div>
              </form>

              {/* Login Link */}
              <div className="text-center pt-6 border-t border-white/10 mt-8">
                <p className="text-sm text-slate-300">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/velocity/login')}
                    className="font-medium text-purple-400 hover:text-purple-300 transition-colors hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Assessment Component
const ComplianceAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const frameworks = [
    { name: 'SOC 2', description: 'Service Organization Control 2' },
    { name: 'ISO 27001', description: 'Information Security Management' },
    { name: 'GDPR', description: 'General Data Protection Regulation' },
    { name: 'HIPAA', description: 'Health Insurance Portability' },
    { name: 'NIST CSF', description: 'Cybersecurity Framework' },
    { name: 'PCI DSS', description: 'Payment Card Industry Standard' }
  ];

  const handleFrameworkSelect = (framework: string) => {
    setSelectedFramework(framework);
  };

  const handleStartAssessment = async () => {
    if (!selectedFramework) {
      alert('Please select a compliance framework first');
      return;
    }

    setIsLoading(true);
    
    try {
      // Try to create an assessment using the backend API
      const response = await fetch('http://localhost:8000/api/v1/assessments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          framework: selectedFramework,
          organizationName: 'Demo Organization',
          assessmentType: 'free_assessment'
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Navigate to dashboard with assessment results
        navigate('/velocity/dashboard', { 
          state: { 
            assessmentStarted: true, 
            framework: selectedFramework,
            assessmentId: result.assessment_id 
          } 
        });
      } else {
        // If API fails, still provide a good user experience
        navigate('/velocity/dashboard', { 
          state: { 
            assessmentStarted: true, 
            framework: selectedFramework,
            demo: true 
          } 
        });
      }
    } catch (error) {
      console.error('Assessment API error:', error);
      // Fallback to dashboard with demo mode
      navigate('/velocity/dashboard', { 
        state: { 
          assessmentStarted: true, 
          framework: selectedFramework,
          demo: true 
        } 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/velocity')}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => navigate('/velocity/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Go to Dashboard
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white font-serif mb-4">
            Free Compliance Assessment
          </h1>
          <p className="text-lg text-slate-400">
            Get your compliance score in 30 minutes - no integration required
          </p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">What You'll Get:</h2>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  AI-powered compliance gap analysis
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Prioritized remediation roadmap
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Cost estimates for compliance
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Timeline to audit readiness
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Trust score projection
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Choose Your Framework:</h3>
              <div className="grid grid-cols-2 gap-3">
                {frameworks.map((framework) => (
                  <button
                    key={framework.name}
                    onClick={() => handleFrameworkSelect(framework.name)}
                    className={`p-3 rounded-lg border text-sm transition-all duration-300 ${
                      selectedFramework === framework.name
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-white hover:border-emerald-500/30 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium">{framework.name}</div>
                    <div className="text-xs opacity-75 mt-1">{framework.description}</div>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={handleStartAssessment}
                disabled={!selectedFramework || isLoading}
                className={`w-full mt-6 px-6 py-4 rounded-lg font-medium transition-all duration-300 ${
                  selectedFramework && !isLoading
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Starting Assessment...
                  </div>
                ) : (
                  `Start ${selectedFramework} Assessment`
                )}
              </button>

              {selectedFramework && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <p className="text-sm text-emerald-400">
                    ✓ {selectedFramework} framework selected. Assessment will take approximately 20-30 minutes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Enhanced Login Component
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('demo@velocity.ai');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create demo user for login
    const demoUser = {
      id: 'demo_user_1',
      email: 'demo@velocity.ai',
      name: 'Demo User',
      organization: {
        id: 'velocity_demo_org',
        name: 'Velocity Demo Organization',
        industry: 'Technology',
        size: 'ENTERPRISE' as const,
        subscription: {
          plan: 'ENTERPRISE' as const,
          status: 'ACTIVE' as const,
          startDate: new Date(),
        },
      },
      role: 'ADMIN' as const,
      permissions: [],
    };
    
    // Use Zustand store for persistent login
    login(demoUser);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Back to Home Button */}
      <div className="absolute top-8 left-8 z-20">
        <button
          onClick={() => navigate('/velocity')}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-200 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hover:border-white/30 hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Back to Home</span>
        </button>
      </div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Marketing Content */}
          <div className="text-center lg:text-left space-y-8">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-500/20 mb-6">
                <span className="text-emerald-400 text-sm font-medium">✨ Trusted by 500+ Companies</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white font-serif mb-6 leading-tight">
                Welcome Back to
                <span className="block bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Velocity
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Continue building trust, accelerating deals, and automating compliance with our AI-powered platform.
              </p>
            </div>
            
            {/* Key Benefits */}
            <div className="grid gap-4">
              {[
                { icon: '🚀', title: 'Sales Acceleration', desc: '340% faster enterprise deals' },
                { icon: '🛡️', title: 'Trust Intelligence', desc: 'Real-time compliance monitoring' },
                { icon: '💰', title: 'Cost Reduction', desc: '€4.9M average customer savings' }
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="text-2xl">{benefit.icon}</div>
                  <div>
                    <div className="font-semibold text-white">{benefit.title}</div>
                    <div className="text-sm text-slate-400">{benefit.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
                <p className="text-slate-300">Access your trust intelligence dashboard</p>
              </div>
              
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                      placeholder="Enter your email"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all pr-12"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-white/20 rounded bg-white/10"
                    />
                    <label htmlFor="remember-me" className="ml-2 text-sm text-slate-300">
                      Remember me
                    </label>
                  </div>
                  
                  <button
                    type="button"
                    className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Sign In
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </button>
                
                <div className="text-center mt-4">
                  <div className="inline-flex items-center px-3 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <svg className="w-4 h-4 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-emerald-400">
                      Demo credentials are pre-filled
                    </p>
                  </div>
                </div>
              </form>

              {/* Signup Link */}
              <div className="text-center pt-6 border-t border-white/10 mt-8">
                <p className="text-sm text-slate-300">
                  New to Velocity?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/velocity/signup')}
                    className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors hover:underline"
                  >
                    Start your free trial
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Public Layout for landing and marketing pages (no header/footer)
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen">
    {children}
  </div>
);

// Dashboard Layout with header and footer
const DashboardLayout: React.FC<{ children: React.ReactNode; showFooter?: boolean }> = ({ 
  children, 
  showFooter = false 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <VelocityHeader />
    <main className="pt-16">
      {children}
    </main>
    {showFooter && <VelocityFooter />}
  </div>
);

// Main Routes Component
const VelocityRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes - No header/footer */}
      <Route path="/" element={
        <PublicLayout>
          <VelocityLandingComplete />
        </PublicLayout>
      } />
      <Route path="/velocity" element={
        <PublicLayout>
          <VelocityLandingComplete />
        </PublicLayout>
      } />
      <Route path="/velocity/" element={
        <PublicLayout>
          <VelocityLandingComplete />
        </PublicLayout>
      } />
      
      {/* Assessment and Demo - Public pages */}
      <Route path="/velocity/assessment" element={
        <PublicLayout>
          <ComplianceAssessment />
        </PublicLayout>
      } />
      <Route path="/velocity/demo" element={
        <PublicLayout>
          <DemoPage />
        </PublicLayout>
      } />
      <Route path="/velocity/impact" element={
        <PublicLayout>
          <CustomerImpactShowcase />
        </PublicLayout>
      } />
      <Route path="/velocity/roi" element={
        <PublicLayout>
          <ROIMetricsDashboard />
        </PublicLayout>
      } />
      <Route path="/velocity/competitive" element={
        <PublicLayout>
          <CompetitiveAdvantageShowcase />
        </PublicLayout>
      } />
      
      {/* Auth routes - No layout needed */}
      <Route path="/velocity/login" element={<Login />} />
      <Route path="/velocity/signup" element={<VelocitySignup />} />
      
      {/* Dashboard routes - Protected unified dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <UnifiedDashboard />
        </ProtectedRoute>
      } />
      <Route path="/velocity/dashboard" element={<Navigate to="/dashboard" replace />} />
      
      {/* Product routes - Public marketing pages */}
      <Route path="/velocity/features" element={
        <PublicLayout>
          <FeaturesPage />
        </PublicLayout>
      } />
      <Route path="/velocity/integrations" element={
        <PublicLayout>
          <IntegrationsPage />
        </PublicLayout>
      } />
      <Route path="/velocity/security" element={
        <PublicLayout>
          <PlaceholderPage title="Security" description="Learn about our enterprise-grade security architecture" />
        </PublicLayout>
      } />
      <Route path="/velocity/pricing" element={
        <PublicLayout>
          <PricingPage />
        </PublicLayout>
      } />
      <Route path="/velocity/qie" element={
        <PublicLayout>
          <QIEPage />
        </PublicLayout>
      } />
      
      {/* Platform routes - Public pages */}
      <Route path="/platform/overview" element={<PlatformOverview />} />
      <Route path="/platform/dashboard" element={<Dashboard />} />
      <Route path="/platform/evidence-collection" element={<EvidenceCollection />} />
      <Route path="/platform/trust-score" element={<TrustScore />} />
      <Route path="/platform/qie" element={<QIE />} />
      
      {/* Industry routes - Public pages */}
      <Route path="/industries/financial-services" element={<FinancialServices />} />
      <Route path="/industries/healthcare" element={<Healthcare />} />
      <Route path="/industries/saas" element={<SaaS />} />
      <Route path="/industries/manufacturing" element={<Manufacturing />} />
      <Route path="/industries/government" element={<Government />} />
      <Route path="/industries/energy" element={<Energy />} />
      
      {/* Solutions routes - Public marketing pages */}
      <Route path="/velocity/solutions/soc2" element={
        <PublicLayout>
          <SOC2Page />
        </PublicLayout>
      } />
      <Route path="/velocity/solutions/iso27001" element={
        <PublicLayout>
          <ISO27001Page />
        </PublicLayout>
      } />
      <Route path="/velocity/solutions/gdpr" element={
        <PublicLayout>
          <GDPRPage />
        </PublicLayout>
      } />
      <Route path="/velocity/solutions/hipaa" element={
        <PublicLayout>
          <HIPAAPage />
        </PublicLayout>
      } />
      <Route path="/velocity/solutions/pci-dss" element={
        <PublicLayout>
          <PCIDSSPage />
        </PublicLayout>
      } />
      <Route path="/solutions/gdpr-international-transfers" element={<Navigate to="/velocity/solutions/gdpr" replace />} />
      <Route path="/solutions/isae-3000" element={
        <PublicLayout>
          <ISAE3000EnterpriseModule />
        </PublicLayout>
      } />
      <Route path="/velocity/solutions/cis-controls" element={<CISControlsPage />} />
      
      {/* Platform routes - Authenticated dashboard pages */}
      <Route path="/velocity/agents" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AgentDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/velocity/agents/:agentId" element={
        <ProtectedRoute>
          <DashboardLayout>
            <PlaceholderPage title="Agent Details" description="Configure and monitor individual AI agents" />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/velocity/evidence" element={
        <ProtectedRoute>
          <DashboardLayout>
            <PlaceholderPage title="Evidence Hub" description="Central repository for all compliance evidence" />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/velocity/evidence/:evidenceId" element={
        <ProtectedRoute>
          <DashboardLayout>
            <PlaceholderPage title="Evidence Details" description="View and manage individual evidence items" />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/velocity/reports" element={
        <ProtectedRoute>
          <DashboardLayout>
            <PlaceholderPage title="Reports" description="Generate compliance reports for stakeholders" />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/velocity/live" element={
        <ProtectedRoute>
          <DashboardLayout>
            <PlaceholderPage title="Live Monitor" description="Real-time compliance monitoring dashboard" />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/velocity/integration" element={
        <ProtectedRoute>
          <DashboardLayout>
            <PlaceholderPage title="Integration Dashboard" description="Manage your cloud and tool integrations" />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/velocity/creator" element={
        <ProtectedRoute>
          <DashboardLayout>
            <PlaceholderPage title="Agent Creator" description="Create custom AI agents for your specific needs" />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Resources routes - Public pages */}
      <Route path="/velocity/resources" element={
        <PublicLayout>
          <ResourceCenter />
        </PublicLayout>
      } />
      <Route path="/velocity/resources/guides/soc2" element={
        <PublicLayout>
          <SOC2Guide />
        </PublicLayout>
      } />
      <Route path="/velocity/resources/guides/gdpr" element={
        <PublicLayout>
          <GDPRGuide />
        </PublicLayout>
      } />
      <Route path="/velocity/resources/guides/iso27001" element={
        <PublicLayout>
          <ISO27001Guide />
        </PublicLayout>
      } />
      <Route path="/velocity/docs" element={
        <PublicLayout>
          <PlaceholderPage title="Documentation" description="Comprehensive guides and API documentation" />
        </PublicLayout>
      } />
      <Route path="/velocity/api" element={
        <PublicLayout>
          <PlaceholderPage title="API Reference" description="Complete API reference and developer tools" />
        </PublicLayout>
      } />
      <Route path="/velocity/support" element={
        <PublicLayout>
          <PlaceholderPage title="Support" description="Get help from our expert support team" />
        </PublicLayout>
      } />
      <Route path="/velocity/community" element={
        <PublicLayout>
          <PlaceholderPage title="Community" description="Join the Velocity compliance community" />
        </PublicLayout>
      } />
      <Route path="/velocity/status" element={
        <PublicLayout>
          <PlaceholderPage title="System Status" description="Real-time system status and uptime monitoring" />
        </PublicLayout>
      } />
      <Route path="/case-studies" element={<CaseStudies />} />
      <Route path="/velocity/case-studies" element={
        <PublicLayout>
          <PlaceholderPage title="Case Studies" description="Success stories from our customers" />
        </PublicLayout>
      } />
      <Route path="/calculators/roi" element={<ROICalculator />} />
      <Route path="/calculators/banking-roi" element={
        <PublicLayout>
          <BankingROIDemo />
        </PublicLayout>
      } />
      <Route path="/calculators/gdpr-roi" element={
        <PlaceholderPage title="GDPR ROI Calculator" description="Calculate GDPR compliance savings" />
      } />
      <Route path="/velocity/blog" element={
        <PublicLayout>
          <PlaceholderPage title="Blog" description="Latest insights on compliance and security" />
        </PublicLayout>
      } />
      
      {/* Company routes - Public pages */}
      <Route path="/velocity/about" element={
        <PublicLayout>
          <PlaceholderPage title="About Velocity" description="Learn about our mission and team" />
        </PublicLayout>
      } />
      <Route path="/velocity/careers" element={
        <PublicLayout>
          <PlaceholderPage title="Careers" description="Join our team and help shape the future of compliance" />
        </PublicLayout>
      } />
      <Route path="/velocity/contact" element={
        <PublicLayout>
          <PlaceholderPage title="Contact Us" description="Get in touch with our team" />
        </PublicLayout>
      } />
      <Route path="/velocity/partners" element={
        <PublicLayout>
          <PlaceholderPage title="Partners" description="Our technology and channel partners" />
        </PublicLayout>
      } />
      <Route path="/velocity/privacy" element={
        <PublicLayout>
          <PlaceholderPage title="Privacy Policy" description="How we protect and handle your data" />
        </PublicLayout>
      } />
      <Route path="/velocity/terms" element={
        <PublicLayout>
          <PlaceholderPage title="Terms of Service" description="Terms and conditions for using Velocity" />
        </PublicLayout>
      } />
      
      {/* Settings and account routes - Dashboard pages */}
      <Route path="/velocity/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />
      <Route path="/velocity/billing" element={
        <ProtectedRoute>
          <DashboardLayout>
            <PlaceholderPage title="Billing" description="Manage your subscription and billing information" />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Additional functional routes - Dashboard pages */}
      <Route path="/velocity/scan" element={
        <DashboardLayout>
          <PlaceholderPage title="Compliance Scan" description="Run comprehensive compliance assessment" />
        </DashboardLayout>
      } />
      <Route path="/velocity/reports/generate" element={
        <DashboardLayout>
          <PlaceholderPage title="Generate Report" description="Create new compliance report" />
        </DashboardLayout>
      } />
      <Route path="/velocity/integrations/add" element={
        <DashboardLayout>
          <PlaceholderPage title="Add Integration" description="Connect new cloud service or tool" />
        </DashboardLayout>
      } />
      <Route path="/velocity/audits/schedule" element={
        <DashboardLayout>
          <PlaceholderPage title="Schedule Audit" description="Plan upcoming compliance audit" />
        </DashboardLayout>
      } />
      <Route path="/velocity/frameworks" element={<FrameworksPage />} />
      <Route path="/velocity/compliance" element={
        <DashboardLayout>
          <PlaceholderPage title="Compliance Overview" description="Comprehensive compliance status overview" />
        </DashboardLayout>
      } />
      <Route path="/velocity/trust-pathway" element={
        <PublicLayout>
          <TrustPathway />
        </PublicLayout>
      } />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/velocity" replace />} />
    </Routes>
  );
};

export default VelocityRoutes;