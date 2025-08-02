import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import VelocityLanding from '@/components/velocity/VelocityLanding';
import VelocitySignup from '@/components/velocity/VelocitySignup';
import VelocityLogin from '@/components/velocity/VelocityLogin';
import DashboardRouter from '@/components/routing/DashboardRouter';

// Coming Soon component for placeholder pages
const VelocityComingSoon: React.FC<{ title: string; protected?: boolean }> = ({ title, protected: isProtected = false }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 font-sans">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600;700&display=swap');
        
        .font-serif {
          font-family: 'Instrument Serif', serif;
        }
        
        .font-sans {
          font-family: 'Manrope', sans-serif;
        }
      `}</style>
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-500/20 mb-6">
            <span className="text-emerald-400 text-sm font-medium">Coming Soon</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-serif font-light text-white mb-6">
            {title}
            <span className="block font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              In Development
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            We're working hard to bring you this feature. Stay tuned for updates!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate(isProtected ? '/velocity/dashboard' : '/velocity/')}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25"
            >
              {isProtected ? 'Back to Dashboard' : 'Back to Home'}
            </button>
            
            <button 
              onClick={() => navigate('/velocity/contact')}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            >
              Contact Support
            </button>
          </div>
          
          <div className="mt-12 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 font-serif">Want to be notified?</h3>
            <p className="text-slate-400 mb-4">Get updates when this feature becomes available.</p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VelocityApp: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('velocity_auth_token');

  useEffect(() => {
    console.log('VelocityApp mounted successfully at:', location.pathname);
    console.log('Authentication status:', !!isAuthenticated);
    console.log('Auth token:', isAuthenticated);
    console.log('LocalStorage velocity_auth_token:', localStorage.getItem('velocity_auth_token'));
    console.log('LocalStorage velocity_user:', localStorage.getItem('velocity_user'));
  }, [location.pathname, isAuthenticated]);

  return (
    <Routes>
        {/* Root velocity paths */}
        <Route path="/velocity" element={<VelocityLanding />} />
        <Route path="/velocity/" element={<VelocityLanding />} />
        <Route path="/velocity/signup" element={<VelocitySignup />} />
        <Route path="/velocity/login" element={<VelocityLogin />} />
        
        {/* Dashboard - the main protected route with comprehensive routing */}
        <Route path="/velocity/dashboard/*" element={<DashboardRouter />} />
        
        {/* All other velocity routes */}
        <Route path="/velocity/agents" element={
          isAuthenticated ? <VelocityComingSoon title="AI Agents" protected /> : <Navigate to="/velocity/login" replace />
        } />
        <Route path="/velocity/evidence" element={
          isAuthenticated ? <VelocityComingSoon title="Evidence Hub" protected /> : <Navigate to="/velocity/login" replace />
        } />
        <Route path="/velocity/reports" element={
          isAuthenticated ? <VelocityComingSoon title="Reports" protected /> : <Navigate to="/velocity/login" replace />
        } />
        <Route path="/velocity/integration" element={
          isAuthenticated ? <VelocityComingSoon title="Integrations" protected /> : <Navigate to="/velocity/login" replace />
        } />
        <Route path="/velocity/creator" element={
          isAuthenticated ? <VelocityComingSoon title="Agent Creator" protected /> : <Navigate to="/velocity/login" replace />
        } />
        <Route path="/velocity/settings" element={
          isAuthenticated ? <VelocityComingSoon title="Settings" protected /> : <Navigate to="/velocity/login" replace />
        } />
        <Route path="/velocity/docs" element={<VelocityComingSoon title="Documentation" />} />
        
        {/* Additional dashboard routes */}
        <Route path="/velocity/notifications" element={
          isAuthenticated ? <VelocityComingSoon title="Notifications" protected /> : <Navigate to="/velocity/login" replace />
        } />
        <Route path="/velocity/profile" element={
          isAuthenticated ? <VelocityComingSoon title="Profile Settings" protected /> : <Navigate to="/velocity/login" replace />
        } />
        <Route path="/velocity/billing" element={
          isAuthenticated ? <VelocityComingSoon title="Billing & Plans" protected /> : <Navigate to="/velocity/login" replace />
        } />
        <Route path="/velocity/trust-score" element={
          isAuthenticated ? <VelocityComingSoon title="Trust Score" protected /> : <Navigate to="/velocity/login" replace />
        } />
        <Route path="/velocity/automation" element={
          isAuthenticated ? <VelocityComingSoon title="Automation Dashboard" protected /> : <Navigate to="/velocity/login" replace />
        } />
        <Route path="/velocity/frameworks" element={
          isAuthenticated ? <VelocityComingSoon title="Compliance Frameworks" protected /> : <Navigate to="/velocity/login" replace />
        } />
        <Route path="/velocity/scan" element={
          isAuthenticated ? <VelocityComingSoon title="Compliance Scanner" protected /> : <Navigate to="/velocity/login" replace />
        } />
        <Route path="/velocity/agents/create" element={
          isAuthenticated ? <VelocityComingSoon title="Create AI Agent" protected /> : <Navigate to="/velocity/login" replace />
        } />
        <Route path="/velocity/reports/generate" element={
          isAuthenticated ? <VelocityComingSoon title="Generate Report" protected /> : <Navigate to="/velocity/login" replace />
        } />
        
        {/* Public routes */}
        <Route path="/velocity/pricing" element={<VelocityComingSoon title="Velocity Pricing" />} />
        <Route path="/velocity/about" element={<VelocityComingSoon title="About Velocity" />} />
        <Route path="/velocity/careers" element={<VelocityComingSoon title="Careers" />} />
        <Route path="/velocity/contact" element={<VelocityComingSoon title="Contact Us" />} />
        <Route path="/velocity/privacy" element={<VelocityComingSoon title="Privacy Policy" />} />
        <Route path="/velocity/terms" element={<VelocityComingSoon title="Terms of Service" />} />
        <Route path="/velocity/support" element={<VelocityComingSoon title="Support Center" />} />
        <Route path="/velocity/community" element={<VelocityComingSoon title="Community" />} />
        <Route path="/velocity/status" element={<VelocityComingSoon title="System Status" />} />
        <Route path="/velocity/api" element={<VelocityComingSoon title="API Reference" />} />
        
        {/* Legacy routes without /velocity prefix - redirect to velocity versions */}
        <Route path="/" element={<Navigate to="/velocity" replace />} />
        <Route path="/dashboard" element={<Navigate to="/velocity/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/velocity/login" replace />} />
        <Route path="/signup" element={<Navigate to="/velocity/signup" replace />} />
        
        {/* Fallback route */}
        <Route path="/*" element={<Navigate to="/velocity" replace />} />
    </Routes>
  );
};

export default VelocityApp;