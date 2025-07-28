import React from 'react';
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
import VelocityHeader from '@/components/velocity/VelocityHeader';
import { Outlet } from 'react-router-dom';

// Custom layout for Velocity subdomain
const VelocityLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <VelocityHeader />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

const VelocityApp: React.FC = () => {
  return (
    <LiveDataProvider>
      <Routes>
        {/* Public Velocity routes */}
        <Route path="/" element={<VelocityLanding />} />
        <Route path="/pricing" element={<VelocityPricing />} />
        
        {/* Authenticated Velocity routes with custom header */}
        <Route path="/" element={<VelocityLayout />}>
          <Route path="dashboard" element={<AgentDashboard />} />
          <Route path="live" element={<LiveVelocityDashboard />} />
          <Route path="onboarding" element={<VelocityOnboardingWizard />} />
          <Route path="integration" element={<IntegrationDashboard />} />
          <Route path="evidence" element={<EvidenceReview />} />
          <Route path="creator" element={<CustomAgentCreator />} />
          <Route path="docs" element={<VelocityDocumentation />} />
          
          {/* Default redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </LiveDataProvider>
  );
};

export default VelocityApp;