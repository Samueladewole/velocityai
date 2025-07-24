import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingEnhanced } from '@/pages/LandingEnhanced';
// import { TestLanding } from '@/pages/TestLanding';
import { IndustrySelection } from '@/pages/IndustrySelection';
import { EuropeanLandscape } from '@/pages/regulatory/EuropeanLandscape';
import { CaseStudy } from '@/pages/CaseStudy';
import { LayoutSimple } from '@/components/layout/LayoutSimple';
import { Layout } from '@/components/layout/Layout';
import { DashboardSimple } from '@/pages/DashboardSimple';
import { DashboardEnhanced } from '@/pages/DashboardEnhanced';
import { CompassWorking } from '@/pages/CompassWorking';
import { AtlasWorking } from '@/pages/AtlasWorking';
// import { PrismWorking } from '@/pages/PrismWorking';
import { Prism } from '@/pages/Prism';
import { PrismDemo } from '@/pages/PrismDemo';
import { PrismDemoSimple } from '@/pages/PrismDemoSimple';
import { PrismDemoWorking } from '@/pages/PrismDemoWorking';
import { ClearanceWorking } from '@/pages/ClearanceWorking';
import { PulseWorking } from '@/pages/PulseWorking';
import { CipherWorking } from '@/pages/CipherWorking';
import { NexusWorking } from '@/pages/NexusWorking';
import { BeaconWorking } from '@/pages/BeaconWorking';
import { Onboarding } from '@/pages/Onboarding';
import { MVPDashboard } from '@/pages/MVPDashboard';
import { DayInTheLifeDemo } from '@/pages/DayInTheLifeDemo';
import { FreeTrustAssessment } from '@/pages/FreeTrustAssessment';
import { IntegrationHub } from '@/pages/IntegrationHub';
import { ExpertNetwork } from '@/pages/ExpertNetwork';
import { CustomerSuccess } from '@/pages/CustomerSuccess';
import { InteractiveSandbox } from '@/pages/InteractiveSandbox';
import { ROICalculator } from '@/pages/ROICalculator';
import { DTEFAutomation } from '@/pages/DTEFAutomation';
import { IndustryCertifications } from '@/pages/IndustryCertifications';
import { QIEEnhanced } from '@/pages/QIEEnhanced';
import { PrivacyManagement } from '@/pages/PrivacyManagement';
import { AIGovernance } from '@/pages/AIGovernance';
import { FrameworkManagement } from '@/pages/FrameworkManagement';
import { PolicyManagement } from '@/pages/PolicyManagement';
import { EmployeeTraining } from '@/pages/EmployeeTraining';
import { AssessmentMarketplace } from '@/pages/AssessmentMarketplace';
import { PlatformCapabilities } from '@/pages/PlatformCapabilities';
import { ComplianceAutomation } from '@/pages/solutions/ComplianceAutomation';
import { SalesAcceleration } from '@/pages/solutions/SalesAcceleration';
import { TrustScore } from '@/pages/TrustScore';
import { Dashboard } from '@/pages/Dashboard';
import { TrustCenter } from '@/pages/TrustCenter';
import { PublicLayout } from '@/components/navigation/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { TourProvider } from '@/components/tour/TourProvider';
import { TourOverlay } from '@/components/tour/TourOverlay';
import { Tooltip } from '@/components/tour/Tooltip';
// Full Stack Trust Platform components - TODO: Implement these
// import { FrameworkManager } from '@/pages/FrameworkManager';
// import { PolicyManagement } from '@/pages/PolicyManagement';
// import { QIEWorkflow } from '@/pages/QIEWorkflow';
// import { EmployeeTraining } from '@/pages/EmployeeTraining';
// import { PrivacySuite } from '@/pages/PrivacySuite';
// import { AssessmentMarketplace } from '@/pages/AssessmentMarketplace';
import { useAppStore, useAuthStore, mockUser } from '@/store';
// import { CurrencyProvider } from '@/contexts/CurrencyContext';

function App() {
  const { setTheme } = useAppStore();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    console.log('App mounting with store');
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Auto-login for demo
    if (!isAuthenticated) {
      login(mockUser);
    }
  }, [setTheme, login, isAuthenticated]);

  console.log('App rendering with store');
  
  return (
    <TourProvider>
      <Router>
      <Routes>
        {/* Public routes with comprehensive navigation */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingEnhanced />} />
          <Route path="platform" element={<PlatformCapabilities />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="demo" element={<DayInTheLifeDemo />} />
          <Route path="sandbox" element={<InteractiveSandbox />} />
          <Route path="roi-calculator" element={<ROICalculator />} />
          <Route path="assessment" element={<FreeTrustAssessment />} />
          <Route path="industry" element={<IndustrySelection />} />
          <Route path="regulatory/eu" element={<EuropeanLandscape />} />
          <Route path="case-study" element={<CaseStudy />} />
          <Route path="solutions/compliance-automation" element={<ComplianceAutomation />} />
          <Route path="solutions/sales-acceleration" element={<SalesAcceleration />} />
          {/* Platform component routes with navigation */}
          <Route path="dtef-automation" element={<DTEFAutomation />} />
          <Route path="certifications" element={<IndustryCertifications />} />
          <Route path="qie-enhanced" element={<QIEEnhanced />} />
          <Route path="privacy-management" element={<PrivacyManagement />} />
          <Route path="ai-governance" element={<AIGovernance />} />
          <Route path="framework-management" element={<FrameworkManagement />} />
          <Route path="policy-management" element={<PolicyManagement />} />
          <Route path="employee-training" element={<EmployeeTraining />} />
          <Route path="assessment-marketplace" element={<AssessmentMarketplace />} />
        </Route>
        
        {/* Trust Center Routes (Public) */}
        <Route path="/trust/:companySlug" element={<TrustCenter />} />
        
        {/* App Layout with Sidebar (for authenticated users) */}
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="trust-score" element={<TrustScore />} />
        </Route>
        
        {/* Full Stack Trust Platform routes - TODO: Implement these components */}
        {/* <Route path="/framework-manager" element={<FrameworkManager />} /> */}
        {/* <Route path="/policy-management" element={<PolicyManagement />} /> */}
        {/* <Route path="/qie" element={<QIEWorkflow />} /> */}
        {/* <Route path="/employee-training" element={<EmployeeTraining />} /> */}
        {/* <Route path="/privacy-suite" element={<PrivacySuite />} /> */}
        {/* <Route path="/assessment-marketplace" element={<AssessmentMarketplace />} /> */}
        <Route path="/prism-demo" element={<PrismDemoWorking />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<DashboardEnhanced />} />
          <Route path="compass" element={<CompassWorking />} />
          <Route path="atlas" element={<AtlasWorking />} />
          <Route path="prism" element={<Prism />} />
          <Route path="prism-demo" element={<PrismDemo />} />
          <Route path="prism-test" element={<PrismDemoSimple />} />
          <Route path="clearance" element={<ClearanceWorking />} />
          <Route path="pulse" element={<PulseWorking />} />
          <Route path="cipher" element={<CipherWorking />} />
          <Route path="nexus" element={<NexusWorking />} />
          <Route path="beacon" element={<BeaconWorking />} />
          <Route path="integrations" element={<IntegrationHub />} />
          <Route path="experts" element={<ExpertNetwork />} />
          <Route path="customer-success" element={<CustomerSuccess />} />
        </Route>
        <Route path="/simple" element={<LayoutSimple />}>
          <Route index element={<DashboardSimple />} />
          <Route path="compass" element={<div><h2>Compass Page</h2><p>Coming Soon</p></div>} />
          <Route path="atlas" element={<div><h2>Atlas Page</h2><p>Coming Soon</p></div>} />
          <Route path="prism" element={<div><h2>Prism Page</h2><p>Coming Soon</p></div>} />
        </Route>
      </Routes>
      <TourOverlay />
      <Tooltip />
    </Router>
    </TourProvider>
  );
}

export default App;