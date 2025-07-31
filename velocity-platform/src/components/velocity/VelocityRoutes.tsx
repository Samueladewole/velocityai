import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import VelocityLandingComplete from './VelocityLandingComplete';
import VelocityDashboardComplete from './VelocityDashboardComplete';
import VelocityHeader from './VelocityHeader';
import VelocityFooter from './VelocityFooter';
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
import IntegrationsPage from '../../pages/IntegrationsPage';
import PricingPage from '../../pages/PricingPage';
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

// Demo Component
const Demo = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-20">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white font-serif mb-4">
          Interactive Demo
        </h1>
        <p className="text-lg text-slate-400">
          Experience Velocity's capabilities with realistic industry scenarios
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Startup SOC 2', description: 'Fast-growing SaaS company preparing for first SOC 2 audit', industry: 'SaaS' },
          { title: 'Healthcare HIPAA', description: 'Medical device company ensuring HIPAA compliance', industry: 'Healthcare' },
          { title: 'Fintech Multi-Framework', description: 'Financial services with SOC 2, PCI DSS, and ISO 27001', industry: 'Fintech' },
          { title: 'Enterprise ISO 27001', description: 'Large enterprise managing global compliance requirements', industry: 'Enterprise' },
          { title: 'AI Company EU Compliance', description: 'AI startup navigating EU AI Act and GDPR', industry: 'AI/ML' },
          { title: 'Manufacturing NIS2', description: 'Manufacturing company preparing for NIS2 requirements', industry: 'Manufacturing' }
        ].map((demo, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer">
            <div className="mb-4">
              <div className="text-xs text-emerald-400 font-medium mb-2">{demo.industry}</div>
              <h3 className="text-lg font-semibold text-white">{demo.title}</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">{demo.description}</p>
            <button className="text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">
              Launch Demo →
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Login Component
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl">⚡</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-serif">Welcome Back</h1>
            <p className="text-slate-400">Sign in to your Velocity account</p>
          </div>
          
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="Enter your email"
                defaultValue="demo@velocity.ai"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="Enter your password"
                defaultValue="demo123"
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
            >
              Sign In
            </button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-slate-400">
                Demo credentials are pre-filled. Just click "Sign In"
              </p>
            </div>
          </form>
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
          <Demo />
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
      <Route path="/velocity/signup" element={<Login />} />
      
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
      <Route path="/solutions/gdpr-international-transfers" element={<GDPRInternationalTransfersPage />} />
      <Route path="/solutions/isae-3000" element={<ISAE3000ServicesPricing />} />
      <Route path="/velocity/solutions/cis-controls" element={
        <PublicLayout>
          <PlaceholderPage title="CIS Controls" description="Implement CIS Controls with AI automation" />
        </PublicLayout>
      } />
      
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
        <PlaceholderPage title="Banking ROI Calculator" description="Specialized ROI calculator for financial institutions" />
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
          <DashboardLayout>
            <PlaceholderPage title="Settings" description="Manage your account and organization settings" />
          </DashboardLayout>
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
      <Route path="/velocity/frameworks" element={
        <DashboardLayout>
          <PlaceholderPage title="Compliance Frameworks" description="Manage your compliance frameworks" />
        </DashboardLayout>
      } />
      <Route path="/velocity/compliance" element={
        <DashboardLayout>
          <PlaceholderPage title="Compliance Overview" description="Comprehensive compliance status overview" />
        </DashboardLayout>
      } />
      <Route path="/velocity/trust-pathway" element={
        <PublicLayout>
          <PlaceholderPage title="Trust Pathway" description="Learn about our progressive integration approach" />
        </PublicLayout>
      } />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/velocity" replace />} />
    </Routes>
  );
};

export default VelocityRoutes;