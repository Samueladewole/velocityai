import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
const ComplianceAssessment = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-20">
    <div className="max-w-4xl mx-auto px-6">
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
              {['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA', 'NIST CSF', 'PCI DSS'].map((framework) => (
                <button
                  key={framework}
                  className="p-3 bg-white/5 rounded-lg border border-white/10 text-white hover:border-emerald-500/30 transition-colors text-sm"
                >
                  {framework}
                </button>
              ))}
            </div>
            
            <button className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300">
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
const Login = () => (
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
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              localStorage.setItem('velocity_auth_token', 'demo_token');
              window.location.href = '/velocity/dashboard';
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  </div>
);

// Layout wrapper component
const PageLayout: React.FC<{ children: React.ReactNode; showFooter?: boolean }> = ({ 
  children, 
  showFooter = true 
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
      {/* Public routes */}
      <Route path="/" element={
        <PageLayout>
          <VelocityLandingComplete />
        </PageLayout>
      } />
      <Route path="/velocity" element={
        <PageLayout>
          <VelocityLandingComplete />
        </PageLayout>
      } />
      <Route path="/velocity/" element={
        <PageLayout>
          <VelocityLandingComplete />
        </PageLayout>
      } />
      
      {/* Assessment and Demo */}
      <Route path="/velocity/assessment" element={
        <PageLayout>
          <ComplianceAssessment />
        </PageLayout>
      } />
      <Route path="/velocity/demo" element={
        <PageLayout>
          <Demo />
        </PageLayout>
      } />
      
      {/* Auth routes */}
      <Route path="/velocity/login" element={<Login />} />
      <Route path="/velocity/signup" element={<Login />} />
      
      {/* Dashboard routes */}
      <Route path="/velocity/dashboard" element={
        <PageLayout showFooter={false}>
          <VelocityDashboardComplete />
        </PageLayout>
      } />
      
      {/* Product routes */}
      <Route path="/velocity/features" element={
        <PageLayout>
          <PlaceholderPage title="Features" description="Discover Velocity's powerful compliance automation features" />
        </PageLayout>
      } />
      <Route path="/velocity/integrations" element={
        <PageLayout>
          <PlaceholderPage title="Integrations" description="Connect with your existing tools and cloud services" />
        </PageLayout>
      } />
      <Route path="/velocity/security" element={
        <PageLayout>
          <PlaceholderPage title="Security" description="Learn about our enterprise-grade security architecture" />
        </PageLayout>
      } />
      <Route path="/velocity/pricing" element={
        <PageLayout>
          <PlaceholderPage title="Pricing" description="Choose the right plan for your organization" />
        </PageLayout>
      } />
      
      {/* Solutions routes */}
      <Route path="/velocity/solutions/soc2" element={
        <PageLayout>
          <PlaceholderPage title="SOC 2 Compliance" description="Automate your SOC 2 Type I and Type II compliance" />
        </PageLayout>
      } />
      <Route path="/velocity/solutions/iso27001" element={
        <PageLayout>
          <PlaceholderPage title="ISO 27001" description="Streamline your ISO 27001 certification process" />
        </PageLayout>
      } />
      <Route path="/velocity/solutions/gdpr" element={
        <PageLayout>
          <PlaceholderPage title="GDPR Compliance" description="Ensure GDPR compliance with automated data protection" />
        </PageLayout>
      } />
      <Route path="/velocity/solutions/hipaa" element={
        <PageLayout>
          <PlaceholderPage title="HIPAA Compliance" description="Healthcare compliance made simple" />
        </PageLayout>
      } />
      <Route path="/velocity/solutions/cis-controls" element={
        <PageLayout>
          <PlaceholderPage title="CIS Controls" description="Implement CIS Controls with AI automation" />
        </PageLayout>
      } />
      
      {/* Platform routes */}
      <Route path="/velocity/agents" element={
        <PageLayout>
          <PlaceholderPage title="AI Agents" description="Manage your 10-agent compliance orchestration system" />
        </PageLayout>
      } />
      <Route path="/velocity/agents/:agentId" element={
        <PageLayout>
          <PlaceholderPage title="Agent Details" description="Configure and monitor individual AI agents" />
        </PageLayout>
      } />
      <Route path="/velocity/evidence" element={
        <PageLayout>
          <PlaceholderPage title="Evidence Hub" description="Central repository for all compliance evidence" />
        </PageLayout>
      } />
      <Route path="/velocity/evidence/:evidenceId" element={
        <PageLayout>
          <PlaceholderPage title="Evidence Details" description="View and manage individual evidence items" />
        </PageLayout>
      } />
      <Route path="/velocity/reports" element={
        <PageLayout>
          <PlaceholderPage title="Reports" description="Generate compliance reports for stakeholders" />
        </PageLayout>
      } />
      <Route path="/velocity/live" element={
        <PageLayout>
          <PlaceholderPage title="Live Monitor" description="Real-time compliance monitoring dashboard" />
        </PageLayout>
      } />
      <Route path="/velocity/integration" element={
        <PageLayout>
          <PlaceholderPage title="Integration Dashboard" description="Manage your cloud and tool integrations" />
        </PageLayout>
      } />
      <Route path="/velocity/creator" element={
        <PageLayout>
          <PlaceholderPage title="Agent Creator" description="Create custom AI agents for your specific needs" />
        </PageLayout>
      } />
      
      {/* Resources routes */}
      <Route path="/velocity/docs" element={
        <PageLayout>
          <PlaceholderPage title="Documentation" description="Comprehensive guides and API documentation" />
        </PageLayout>
      } />
      <Route path="/velocity/api" element={
        <PageLayout>
          <PlaceholderPage title="API Reference" description="Complete API reference and developer tools" />
        </PageLayout>
      } />
      <Route path="/velocity/support" element={
        <PageLayout>
          <PlaceholderPage title="Support" description="Get help from our expert support team" />
        </PageLayout>
      } />
      <Route path="/velocity/community" element={
        <PageLayout>
          <PlaceholderPage title="Community" description="Join the Velocity compliance community" />
        </PageLayout>
      } />
      <Route path="/velocity/status" element={
        <PageLayout>
          <PlaceholderPage title="System Status" description="Real-time system status and uptime monitoring" />
        </PageLayout>
      } />
      <Route path="/velocity/case-studies" element={
        <PageLayout>
          <PlaceholderPage title="Case Studies" description="Success stories from our customers" />
        </PageLayout>
      } />
      <Route path="/velocity/blog" element={
        <PageLayout>
          <PlaceholderPage title="Blog" description="Latest insights on compliance and security" />
        </PageLayout>
      } />
      
      {/* Company routes */}
      <Route path="/velocity/about" element={
        <PageLayout>
          <PlaceholderPage title="About Velocity" description="Learn about our mission and team" />
        </PageLayout>
      } />
      <Route path="/velocity/careers" element={
        <PageLayout>
          <PlaceholderPage title="Careers" description="Join our team and help shape the future of compliance" />
        </PageLayout>
      } />
      <Route path="/velocity/contact" element={
        <PageLayout>
          <PlaceholderPage title="Contact Us" description="Get in touch with our team" />
        </PageLayout>
      } />
      <Route path="/velocity/partners" element={
        <PageLayout>
          <PlaceholderPage title="Partners" description="Our technology and channel partners" />
        </PageLayout>
      } />
      <Route path="/velocity/privacy" element={
        <PageLayout>
          <PlaceholderPage title="Privacy Policy" description="How we protect and handle your data" />
        </PageLayout>
      } />
      <Route path="/velocity/terms" element={
        <PageLayout>
          <PlaceholderPage title="Terms of Service" description="Terms and conditions for using Velocity" />
        </PageLayout>
      } />
      
      {/* Settings and account routes */}
      <Route path="/velocity/settings" element={
        <PageLayout>
          <PlaceholderPage title="Settings" description="Manage your account and organization settings" />
        </PageLayout>
      } />
      <Route path="/velocity/billing" element={
        <PageLayout>
          <PlaceholderPage title="Billing" description="Manage your subscription and billing information" />
        </PageLayout>
      } />
      
      {/* Additional functional routes */}
      <Route path="/velocity/scan" element={
        <PageLayout>
          <PlaceholderPage title="Compliance Scan" description="Run comprehensive compliance assessment" />
        </PageLayout>
      } />
      <Route path="/velocity/reports/generate" element={
        <PageLayout>
          <PlaceholderPage title="Generate Report" description="Create new compliance report" />
        </PageLayout>
      } />
      <Route path="/velocity/integrations/add" element={
        <PageLayout>
          <PlaceholderPage title="Add Integration" description="Connect new cloud service or tool" />
        </PageLayout>
      } />
      <Route path="/velocity/audits/schedule" element={
        <PageLayout>
          <PlaceholderPage title="Schedule Audit" description="Plan upcoming compliance audit" />
        </PageLayout>
      } />
      <Route path="/velocity/frameworks" element={
        <PageLayout>
          <PlaceholderPage title="Compliance Frameworks" description="Manage your compliance frameworks" />
        </PageLayout>
      } />
      <Route path="/velocity/compliance" element={
        <PageLayout>
          <PlaceholderPage title="Compliance Overview" description="Comprehensive compliance status overview" />
        </PageLayout>
      } />
      <Route path="/velocity/trust-pathway" element={
        <PageLayout>
          <PlaceholderPage title="Trust Pathway" description="Learn about our progressive integration approach" />
        </PageLayout>
      } />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/velocity" replace />} />
    </Routes>
  );
};

export default VelocityRoutes;