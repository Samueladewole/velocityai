import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LiveDataProvider } from '@/components/velocity/LiveDataProvider';

// Main Dashboards
import LiveVelocityDashboard from '@/components/velocity/LiveVelocityDashboard';
import VelocityDashboardComplete from '@/components/velocity/VelocityDashboardComplete';
import VelocityDashboardUltimate from '@/components/velocity/VelocityDashboardUltimate';
import AgentDashboard from '@/components/velocity/AgentDashboard';
import IntegrationDashboard from '@/components/velocity/IntegrationDashboard';

// Specialized Dashboards
import SystemStatusDashboard from '@/components/infrastructure/SystemStatusDashboard';
import EUComplianceDashboard from '@/components/atlas/EUComplianceDashboard';
import GDPRDataMappingDashboard from '@/components/gdpr/GDPRDataMappingDashboard';
import AuditPreparationDashboard from '@/components/audit/AuditPreparationDashboard';
import TrustEquityDashboard from '@/components/trustEquity/TrustEquityDashboard';
import BankingSystemsDashboard from '@/components/banking/BankingSystemsDashboard';
import SOXCoordinationDashboard from '@/components/sox404/SOXCoordinationDashboard';
import ROIMetricsDashboard from '@/components/velocity/ROIMetricsDashboard';
import ExecutiveDashboard from '@/components/observability/ExecutiveDashboard';
import EvidenceCategorizationDashboard from '@/components/isae3000/EvidenceCategorizationDashboard';
import OperationalDashboard from '@/components/observability/OperationalDashboard';
import QIELearningDashboard from '@/components/qie/QIELearningDashboard';

// Dashboard Navigation Component
import DashboardNavigation from './DashboardNavigation';
import AdminPanel from '@/components/admin/AdminPanel';
import UserOnboarding from '@/components/onboarding/UserOnboarding';
import UserSettings from '@/components/settings/UserSettings';
import HelpCenter from '@/components/help/HelpCenter';

// Dashboard Layout Wrapper
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation />
      <main className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

// Main Dashboard Router Component
const DashboardRouter: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/velocity/login" state={{ from: location }} replace />;
  }

  return (
    <LiveDataProvider>
      <DashboardLayout>
        <Routes>
        {/* Default Dashboard Route */}
        <Route path="/" element={<LiveVelocityDashboard />} />
        
        {/* Main Application Dashboards */}
        <Route path="/overview" element={<LiveVelocityDashboard />} />
        <Route path="/complete" element={<VelocityDashboardComplete />} />
        <Route path="/ultimate" element={<VelocityDashboardUltimate />} />
        <Route path="/agents" element={<AgentDashboard />} />
        <Route path="/integrations" element={<IntegrationDashboard />} />
        <Route path="/metrics" element={<ROIMetricsDashboard />} />
        
        {/* Compliance Dashboards */}
        <Route path="/compliance/eu" element={<EUComplianceDashboard />} />
        <Route path="/compliance/gdpr" element={<GDPRDataMappingDashboard />} />
        <Route path="/compliance/audit" element={<AuditPreparationDashboard />} />
        <Route path="/compliance/sox" element={<SOXCoordinationDashboard />} />
        <Route path="/compliance/evidence" element={<EvidenceCategorizationDashboard />} />
        
        {/* Industry-Specific Dashboards */}
        <Route path="/industry/banking" element={<BankingSystemsDashboard />} />
        <Route path="/industry/trust-equity" element={<TrustEquityDashboard />} />
        
        {/* Operational Dashboards */}
        <Route path="/operations/system" element={<SystemStatusDashboard />} />
        <Route path="/operations/executive" element={<ExecutiveDashboard />} />
        <Route path="/operations/operational" element={<OperationalDashboard />} />
        <Route path="/operations/qie" element={<QIELearningDashboard />} />
        
        {/* Admin Dashboard Routes (Role-based access) */}
        {user?.role === 'admin' && (
          <>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/*" element={<AdminPanel />} />
          </>
        )}
        
        {/* User Management Routes */}
        <Route path="/onboarding" element={<UserOnboarding />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/notifications" element={<div className="p-8"><h1 className="text-2xl font-bold mb-4">All Notifications</h1><p>Comprehensive notification management coming soon...</p></div>} />
        
        {/* Fallback Routes */}
        <Route path="*" element={
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Not Found</h2>
            <p className="text-gray-600 mb-6">The requested dashboard could not be found.</p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Go to Main Dashboard
            </button>
          </div>
        } />
        </Routes>
      </DashboardLayout>
    </LiveDataProvider>
  );
};

export default DashboardRouter;