import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LiveDataProvider } from '@/components/velocity/LiveDataProvider';
import VelocityLanding from '@/components/velocity/VelocityLanding';
import VelocityPricing from '@/components/velocity/VelocityPricing';
import VelocityOnboardingWizard from '@/components/velocity/VelocityOnboardingWizard';
import AgentDashboard from '@/components/velocity/AgentDashboard';
import LiveVelocityDashboard from '@/components/velocity/LiveVelocityDashboard';
import IntegrationDashboard from '@/components/velocity/IntegrationDashboard';
import EvidenceReview from '@/components/velocity/EvidenceReview';
import CustomAgentCreator from '@/components/velocity/CustomAgentCreator';
import VelocityDocumentation from '@/components/velocity/VelocityDocumentation';
import VelocitySignup from '@/components/velocity/VelocitySignup';
import VelocityLogin from '@/components/velocity/VelocityLogin';
import VelocityHeader from '@/components/velocity/VelocityHeader';
import VelocityFooter from '@/components/velocity/VelocityFooter';
import VelocitySidebar from '@/components/velocity/VelocitySidebar';
import { Outlet } from 'react-router-dom';
import { useVelocityAuth } from '@/services/velocity/auth.service';
import velocityWebSocket from '@/services/velocity/websocket.service';
import { VELOCITY_FEATURES } from '@/config/platform.config';

// Layout for public Velocity pages (landing, pricing, etc.)
const VelocityPublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <VelocityHeader />
      <main className="pt-16">
        <Outlet />
      </main>
      <VelocityFooter />
    </div>
  );
};

// Layout for authenticated Velocity app pages
const VelocityAppLayout: React.FC = () => {
  return (
    <div className="h-screen flex bg-gray-50">
      <VelocitySidebar />
      <div className="flex-1 flex flex-col">
        <VelocityHeader />
        <main className="flex-1 pt-16 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const VelocityApp: React.FC = () => {
  useEffect(() => {
    // Initialize WebSocket connection on app load
    if (localStorage.getItem('velocity_auth_token')) {
      velocityWebSocket.connect();
    }
    
    return () => {
      velocityWebSocket.disconnect();
    };
  }, []);

  return (
    <LiveDataProvider>
      <Routes>
        {/* Public Velocity routes with header/footer */}
        <Route path="/" element={<VelocityPublicLayout />}>
          <Route index element={<VelocityLanding />} />
          <Route path="pricing" element={<VelocityPricing />} />
          <Route path="features" element={<div>Features Page</div>} />
          <Route path="integrations" element={<div>Integrations Page</div>} />
          <Route path="security" element={<div>Security Page</div>} />
          <Route path="solutions/:framework" element={<div>Solution Page</div>} />
          <Route path="docs" element={<VelocityDocumentation />} />
          <Route path="api" element={<div>API Documentation</div>} />
          <Route path="case-studies" element={<div>Case Studies</div>} />
          <Route path="blog" element={<div>Blog</div>} />
          <Route path="support" element={<div>Support</div>} />
          <Route path="about" element={<div>About</div>} />
          <Route path="careers" element={<div>Careers</div>} />
          <Route path="partners" element={<div>Partners</div>} />
          <Route path="contact" element={<div>Contact</div>} />
          <Route path="login" element={<VelocityLogin />} />
          <Route path="signup" element={<VelocitySignup />} />
        </Route>
        
        {/* Authenticated Velocity routes with sidebar */}
        <Route path="/" element={<VelocityAppLayout />}>
          {VELOCITY_FEATURES.AI_AGENTS && (
            <>
              <Route path="dashboard" element={<AgentDashboard />} />
              <Route path="agents" element={<div>Active Agents</div>} />
              <Route path="creator" element={<CustomAgentCreator />} />
            </>
          )}
          
          {VELOCITY_FEATURES.LIVE_MONITORING && (
            <Route path="live" element={<LiveVelocityDashboard />} />
          )}
          
          {VELOCITY_FEATURES.RAPID_ONBOARDING && (
            <Route path="onboarding" element={<VelocityOnboardingWizard />} />
          )}
          
          {VELOCITY_FEATURES.CLOUD_INTEGRATIONS && (
            <>
              <Route path="integration" element={<IntegrationDashboard />} />
              <Route path="integration/:provider" element={<div>Integration Setup</div>} />
            </>
          )}
          
          {VELOCITY_FEATURES.AUTO_EVIDENCE && (
            <>
              <Route path="evidence" element={<EvidenceReview />} />
              <Route path="validation" element={<div>Validation Queue</div>} />
              <Route path="export" element={<div>Export Center</div>} />
            </>
          )}
          
          {VELOCITY_FEATURES.COMPLIANCE_FLOWS && (
            <>
              <Route path="trust-score" element={<div>Trust Score</div>} />
              <Route path="compliance/:framework" element={<div>Compliance Framework</div>} />
              <Route path="workflows" element={<div>Workflows</div>} />
            </>
          )}
          
          <Route path="scheduled" element={<div>Scheduled Tasks</div>} />
          <Route path="logs" element={<div>Agent Logs</div>} />
          <Route path="analytics" element={<div>Analytics</div>} />
          
          {VELOCITY_FEATURES.SUBSCRIPTION_TIERS && (
            <Route path="billing" element={<div>Billing & Team</div>} />
          )}
          
          <Route path="settings" element={<div>Settings</div>} />
          
          {/* Default redirect to dashboard for authenticated users */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </LiveDataProvider>
  );
};

export default VelocityApp;