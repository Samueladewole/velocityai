import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LiveDataProvider } from '@/components/velocity/LiveDataProvider';
import VelocityLanding from '@/components/velocity/VelocityLanding';
import VelocityPricing from '@/components/velocity/VelocityPricing';
import VelocityLogin from '@/components/velocity/VelocityLogin';
import VelocitySignup from '@/components/velocity/VelocitySignup';
import VelocityOnboardingWizard from '@/components/velocity/VelocityOnboardingWizard';
import AgentDashboard from '@/components/velocity/AgentDashboard';
import LiveVelocityDashboard from '@/components/velocity/LiveVelocityDashboard';
import IntegrationDashboard from '@/components/velocity/IntegrationDashboard';
import EvidenceReview from '@/components/velocity/EvidenceReview';
import CustomAgentCreator from '@/components/velocity/CustomAgentCreator';
import CustomAgentCreatorDebug from '@/components/velocity/CustomAgentCreatorDebug';
import VelocityDocumentation from '@/components/velocity/VelocityDocumentation';
import VelocityHeader from '@/components/velocity/VelocityHeader';
import VelocityFooter from '@/components/velocity/VelocityFooter';
import { Outlet } from 'react-router-dom';

// Custom layout for Velocity subdomain
const VelocityLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <VelocityHeader />
      <main className="pt-16 flex-grow">
        <Outlet />
      </main>
      <VelocityFooter />
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
        <Route path="/login" element={<VelocityLogin />} />
        <Route path="/signup" element={<VelocitySignup />} />
        
        {/* Authenticated Velocity routes with custom header */}
        <Route path="/dashboard" element={<VelocityLayout />}>
          <Route index element={<AgentDashboard />} />
        </Route>
        <Route path="/live" element={<VelocityLayout />}>
          <Route index element={<LiveVelocityDashboard />} />
        </Route>
        <Route path="/onboarding" element={<VelocityLayout />}>
          <Route index element={<VelocityOnboardingWizard />} />
        </Route>
        <Route path="/integration" element={<VelocityLayout />}>
          <Route index element={<IntegrationDashboard />} />
        </Route>
        <Route path="/evidence" element={<VelocityLayout />}>
          <Route index element={<EvidenceReview />} />
        </Route>
        <Route path="/creator" element={<VelocityLayout />}>
          <Route index element={<CustomAgentCreatorDebug />} />
        </Route>
        <Route path="/docs" element={<VelocityLayout />}>
          <Route index element={<VelocityDocumentation />} />
        </Route>
      </Routes>
    </LiveDataProvider>
  );
};

export default VelocityApp;