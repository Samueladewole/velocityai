import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import VelocityLandingComplete from './VelocityLandingComplete';
import VelocityDashboardComplete from './VelocityDashboardComplete';
import VelocityHeader from './VelocityHeader';
import VelocityFooter from './VelocityFooter';

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
    
    // Simulate assessment start
    setTimeout(() => {
      setIsLoading(false);
      // For now, navigate to login or create a demo assessment
      navigate('/velocity/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/velocity')}
          className="mb-8 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to Home
        </button>

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
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('velocity_auth_token', 'demo_token');
    navigate('/velocity/dashboard');
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
      
      {/* Auth routes - No layout needed */}
      <Route path="/velocity/login" element={<Login />} />
      <Route path="/velocity/signup" element={<Login />} />
      
      {/* Dashboard routes - Use dashboard layout */}
      <Route path="/velocity/dashboard" element={
        <DashboardLayout>
          <VelocityDashboardComplete />
        </DashboardLayout>
      } />
      
      {/* Product routes - Public marketing pages */}
      <Route path="/velocity/features" element={
        <PublicLayout>
          <PlaceholderPage title="Features" description="Discover Velocity's powerful compliance automation features" />
        </PublicLayout>
      } />
      <Route path="/velocity/integrations" element={
        <PublicLayout>
          <PlaceholderPage title="Integrations" description="Connect with your existing tools and cloud services" />
        </PublicLayout>
      } />
      <Route path="/velocity/security" element={
        <PublicLayout>
          <PlaceholderPage title="Security" description="Learn about our enterprise-grade security architecture" />
        </PublicLayout>
      } />
      <Route path="/velocity/pricing" element={
        <PublicLayout>
          <PlaceholderPage title="Pricing" description="Choose the right plan for your organization" />
        </PublicLayout>
      } />
      
      {/* Solutions routes - Public marketing pages */}
      <Route path="/velocity/solutions/soc2" element={
        <PublicLayout>
          <PlaceholderPage title="SOC 2 Compliance" description="Automate your SOC 2 Type I and Type II compliance" />
        </PublicLayout>
      } />
      <Route path="/velocity/solutions/iso27001" element={
        <PublicLayout>
          <PlaceholderPage title="ISO 27001" description="Streamline your ISO 27001 certification process" />
        </PublicLayout>
      } />
      <Route path="/velocity/solutions/gdpr" element={
        <PublicLayout>
          <PlaceholderPage title="GDPR Compliance" description="Ensure GDPR compliance with automated data protection" />
        </PublicLayout>
      } />
      <Route path="/velocity/solutions/hipaa" element={
        <PublicLayout>
          <PlaceholderPage title="HIPAA Compliance" description="Healthcare compliance made simple" />
        </PublicLayout>
      } />
      <Route path="/velocity/solutions/cis-controls" element={
        <PublicLayout>
          <PlaceholderPage title="CIS Controls" description="Implement CIS Controls with AI automation" />
        </PublicLayout>
      } />
      
      {/* Platform routes - Authenticated dashboard pages */}
      <Route path="/velocity/agents" element={
        <DashboardLayout>
          <PlaceholderPage title="AI Agents" description="Manage your 10-agent compliance orchestration system" />
        </DashboardLayout>
      } />
      <Route path="/velocity/agents/:agentId" element={
        <DashboardLayout>
          <PlaceholderPage title="Agent Details" description="Configure and monitor individual AI agents" />
        </DashboardLayout>
      } />
      <Route path="/velocity/evidence" element={
        <DashboardLayout>
          <PlaceholderPage title="Evidence Hub" description="Central repository for all compliance evidence" />
        </DashboardLayout>
      } />
      <Route path="/velocity/evidence/:evidenceId" element={
        <DashboardLayout>
          <PlaceholderPage title="Evidence Details" description="View and manage individual evidence items" />
        </DashboardLayout>
      } />
      <Route path="/velocity/reports" element={
        <DashboardLayout>
          <PlaceholderPage title="Reports" description="Generate compliance reports for stakeholders" />
        </DashboardLayout>
      } />
      <Route path="/velocity/live" element={
        <DashboardLayout>
          <PlaceholderPage title="Live Monitor" description="Real-time compliance monitoring dashboard" />
        </DashboardLayout>
      } />
      <Route path="/velocity/integration" element={
        <DashboardLayout>
          <PlaceholderPage title="Integration Dashboard" description="Manage your cloud and tool integrations" />
        </DashboardLayout>
      } />
      <Route path="/velocity/creator" element={
        <DashboardLayout>
          <PlaceholderPage title="Agent Creator" description="Create custom AI agents for your specific needs" />
        </DashboardLayout>
      } />
      
      {/* Resources routes - Public pages */}
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
      <Route path="/velocity/case-studies" element={
        <PublicLayout>
          <PlaceholderPage title="Case Studies" description="Success stories from our customers" />
        </PublicLayout>
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
        <DashboardLayout>
          <PlaceholderPage title="Settings" description="Manage your account and organization settings" />
        </DashboardLayout>
      } />
      <Route path="/velocity/billing" element={
        <DashboardLayout>
          <PlaceholderPage title="Billing" description="Manage your subscription and billing information" />
        </DashboardLayout>
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