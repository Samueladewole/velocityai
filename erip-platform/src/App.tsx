import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from '@/components/ScrollToTop';
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
import { CloudSecurity } from '@/pages/CloudSecurity';
import { Reports } from '@/pages/Reports';
import { DebugAuth } from '@/pages/DebugAuth';
import { TestRouting } from '@/pages/TestRouting';
import { PlatformCapabilities } from '@/pages/PlatformCapabilities';
import { ComplianceAutomation } from '@/pages/solutions/ComplianceAutomation';
import { SalesAcceleration } from '@/pages/solutions/SalesAcceleration';
import { TrustScore } from '@/pages/TrustScore';
import { Dashboard } from '@/pages/Dashboard';
import { TrustCenter } from '@/pages/TrustCenter';
import { ROIGuide } from '@/pages/ROIGuide';
import { PRISM } from '@/pages/tools/PRISM';
import { BEACON } from '@/pages/tools/BEACON';
import { COMPASS } from '@/pages/tools/COMPASS';
import { ATLAS } from '@/pages/tools/ATLAS';
import { PULSE } from '@/pages/tools/PULSE';
import { NEXUS } from '@/pages/tools/NEXUS';
import { CLEARANCE } from '@/pages/tools/CLEARANCE';
import { CIPHER } from '@/pages/tools/CIPHER';
import { ToolsOverview } from '@/pages/tools/ToolsOverview';
import { Contact } from '@/pages/company/Contact';
import { SeedPitch } from '@/pages/company/SeedPitch';
import { About } from '@/pages/company/About';
import Story from '@/pages/company/Story';
import Team from '@/pages/company/Team';
import Careers from '@/pages/company/Careers';
import Press from '@/pages/company/Press';
import Partners from '@/pages/company/Partners';
import Investors from '@/pages/company/Investors';
// Resource pages
import { Docs } from '@/pages/resources/Docs';
import { Academy } from '@/pages/resources/Academy';
import ApiDocs from '@/pages/resources/ApiDocs';
import Blog from '@/pages/resources/Blog';
import Webinars from '@/pages/resources/Webinars';
import CaseStudies from '@/pages/resources/CaseStudies';
import Help from '@/pages/resources/Help';
// Legal pages
import Privacy from '@/pages/legal/Privacy';
import Terms from '@/pages/legal/Terms';
import DPA from '@/pages/legal/DPA';
import Cookies from '@/pages/legal/Cookies';
import Security from '@/pages/legal/Security';
import Compliance from '@/pages/legal/Compliance';
// Certification pages
import Soc2 from '@/pages/certifications/Soc2';
import Iso27001 from '@/pages/certifications/Iso27001';
import Gdpr from '@/pages/certifications/Gdpr';
import Tisax from '@/pages/certifications/Tisax';
import { PublicLayout } from '@/components/navigation/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { TourProvider } from '@/components/tour/TourProvider';
import { TourOverlay } from '@/components/tour/TourOverlay';
import { Tooltip } from '@/components/tour/Tooltip';
// New solution pages
import { RiskQuantification } from '@/pages/solutions/RiskQuantification';
import { AIGovernance as AIGovernanceSolution } from '@/pages/solutions/AIGovernance';
import { PrivacyManagement as PrivacyManagementSolution } from '@/pages/solutions/PrivacyManagement';
import { FinancialServices } from '@/pages/solutions/FinancialServices';
import { Healthcare } from '@/pages/solutions/Healthcare';
import { Technology } from '@/pages/solutions/Technology';
// AI Agents & Velocity Tier components
import VelocityLanding from '@/components/velocity/VelocityLanding';
import VelocityPricing from '@/components/velocity/VelocityPricing';
import VelocityOnboarding from '@/components/velocity/VelocityOnboarding';
import AgentDashboard from '@/components/velocity/AgentDashboard';
import IntegrationDashboard from '@/components/velocity/IntegrationDashboard';
import EvidenceReview from '@/components/velocity/EvidenceReview';
import CustomAgentCreator from '@/components/velocity/CustomAgentCreator';
import { LiveDataProvider } from '@/components/velocity/LiveDataProvider';
import LiveVelocityDashboard from '@/components/velocity/LiveVelocityDashboard';
import VelocityOnboardingWizard from '@/components/velocity/VelocityOnboardingWizard';
import VelocityDocumentation from '@/components/velocity/VelocityDocumentation';
// Other pages
import { PublicProfiles } from '@/pages/PublicProfiles';
import Settings from '@/pages/Settings';
// Pricing pages
import { Pricing } from '@/pages/Pricing';
// Full Stack Trust Platform components - TODO: Implement these
// import { FrameworkManager } from '@/pages/FrameworkManager';
// import { PolicyManagement } from '@/pages/PolicyManagement';
// import { QIEWorkflow } from '@/pages/QIEWorkflow';
// import { EmployeeTraining } from '@/pages/EmployeeTraining';
// import { PrivacySuite } from '@/pages/PrivacySuite';
// import { AssessmentMarketplace } from '@/pages/AssessmentMarketplace';
import { useAppStore, useAuthStore, mockUser } from '@/store';
import { DateProvider } from '@/components/shared/DateProvider';
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
    <DateProvider>
      <TourProvider>
        <Router>
          <ScrollToTop />
          <Routes>
        {/* Public routes with comprehensive navigation */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingEnhanced />} />
          <Route path="platform" element={<PlatformCapabilities />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="demo" element={<DayInTheLifeDemo />} />
          <Route path="sandbox" element={<InteractiveSandbox />} />
          <Route path="roi-calculator" element={<ROICalculator />} />
          <Route path="roi-guide" element={<ROIGuide />} />
          <Route path="assessment" element={<FreeTrustAssessment />} />
          <Route path="industry" element={<IndustrySelection />} />
          <Route path="regulatory/eu" element={<EuropeanLandscape />} />
          <Route path="case-study" element={<CaseStudy />} />
          <Route path="solutions/compliance-automation" element={<ComplianceAutomation />} />
          <Route path="solutions/sales-acceleration" element={<SalesAcceleration />} />
          <Route path="solutions/risk-quantification" element={<RiskQuantification />} />
          <Route path="solutions/ai-governance" element={<AIGovernanceSolution />} />
          <Route path="solutions/privacy-management" element={<PrivacyManagementSolution />} />
          <Route path="solutions/financial-services" element={<FinancialServices />} />
          <Route path="solutions/healthcare" element={<Healthcare />} />
          <Route path="solutions/technology" element={<Technology />} />
          {/* Platform sharing */}
          <Route path="public-profiles" element={<PublicProfiles />} />
          {/* Pricing */}
          <Route path="pricing" element={<Pricing />} />
          <Route path="velocity" element={<VelocityLanding />} />
          <Route path="velocity/pricing" element={<VelocityPricing />} />
          {/* Resources */}
          <Route path="docs" element={<Docs />} />
          <Route path="api-docs" element={<ApiDocs />} />
          <Route path="blog" element={<Blog />} />
          <Route path="webinars" element={<Webinars />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="help" element={<Help />} />
          <Route path="academy" element={<Academy />} />
          {/* Legal */}
          <Route path="legal/privacy" element={<Privacy />} />
          <Route path="legal/terms" element={<Terms />} />
          <Route path="legal/dpa" element={<DPA />} />
          <Route path="legal/cookies" element={<Cookies />} />
          <Route path="legal/security" element={<Security />} />
          <Route path="legal/compliance" element={<Compliance />} />
          {/* Certifications */}
          <Route path="certifications/soc2" element={<Soc2 />} />
          <Route path="certifications/iso27001" element={<Iso27001 />} />
          <Route path="certifications/gdpr" element={<Gdpr />} />
          <Route path="certifications/tisax" element={<Tisax />} />
          {/* Company */}
          <Route path="company/about" element={<About />} />
          <Route path="company/story" element={<Story />} />
          <Route path="company/team" element={<Team />} />
          <Route path="company/careers" element={<Careers />} />
          <Route path="company/press" element={<Press />} />
          <Route path="company/partners" element={<Partners />} />
          <Route path="company/investors" element={<Investors />} />
          <Route path="company/contact" element={<Contact />} />
          <Route path="company/seed-pitch" element={<SeedPitch />} />
          {/* Non-sidebar routes */}
          <Route path="certifications" element={<IndustryCertifications />} />
          {/* Tools Overview - only this stays in public layout */}
          <Route path="tools" element={<ToolsOverview />} />
        </Route>
        
        {/* Trust Center Routes (Public) */}
        <Route path="/trust/:companySlug" element={<TrustCenter />} />
        
        {/* App Layout with Sidebar (for authenticated users) */}
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="debug-auth" element={<DebugAuth />} />
          <Route path="test-routing" element={<TestRouting />} />
          <Route path="trust-score" element={<TrustScore />} />
          {/* Component pages with sidebar navigation */}
          <Route path="qie-enhanced" element={<QIEEnhanced />} />
          <Route path="dtef-automation" element={<DTEFAutomation />} />
          <Route path="tools/qie-enhanced" element={<QIEEnhanced />} />
          <Route path="tools/dtef-automation" element={<DTEFAutomation />} />
          <Route path="framework-management" element={<FrameworkManagement />} />
          <Route path="privacy-management" element={<PrivacyManagement />} />
          <Route path="ai-governance" element={<AIGovernance />} />
          <Route path="cloud-security" element={<CloudSecurity />} />
          <Route path="policy-management" element={<PolicyManagement />} />
          <Route path="employee-training" element={<EmployeeTraining />} />
          <Route path="assessment-marketplace" element={<AssessmentMarketplace />} />
          <Route path="tools/framework-management" element={<FrameworkManagement />} />
          <Route path="tools/privacy-management" element={<PrivacyManagement />} />
          <Route path="tools/ai-governance" element={<AIGovernance />} />
          <Route path="tools/cloud-security" element={<CloudSecurity />} />
          <Route path="tools/policy-management" element={<PolicyManagement />} />
          <Route path="tools/employee-training" element={<EmployeeTraining />} />
          <Route path="tools/assessment-marketplace" element={<AssessmentMarketplace />} />
          {/* Tool specific routes */}
          <Route path="tools" element={<ToolsOverview />} />
          <Route path="tools/prism" element={<PRISM />} />
          <Route path="tools/beacon" element={<BEACON />} />
          <Route path="tools/compass" element={<COMPASS />} />
          <Route path="tools/atlas" element={<ATLAS />} />
          <Route path="tools/pulse" element={<PULSE />} />
          <Route path="tools/nexus" element={<NEXUS />} />
          <Route path="tools/clearance" element={<CLEARANCE />} />
          <Route path="tools/cipher" element={<CIPHER />} />
          <Route path="tools/integrations" element={<IntegrationHub />} />
          <Route path="tools/experts" element={<ExpertNetwork />} />
          <Route path="tools/customer-success" element={<CustomerSuccess />} />
          <Route path="tools/reports" element={<Reports />} />
          {/* AI Agents & Velocity Tier routes */}
          <Route path="velocity/dashboard" element={
            <LiveDataProvider>
              <AgentDashboard />
            </LiveDataProvider>
          } />
          <Route path="velocity/live" element={
            <LiveDataProvider>
              <LiveVelocityDashboard />
            </LiveDataProvider>
          } />
          <Route path="velocity/onboarding" element={<VelocityOnboardingWizard />} />
          <Route path="velocity/integration" element={
            <LiveDataProvider>
              <IntegrationDashboard />
            </LiveDataProvider>
          } />
          <Route path="velocity/evidence" element={
            <LiveDataProvider>
              <EvidenceReview />
            </LiveDataProvider>
          } />
          <Route path="velocity/creator" element={<CustomAgentCreator />} />
          <Route path="velocity/docs" element={<VelocityDocumentation />} />
          {/* Settings */}
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Full Stack Trust Platform routes - TODO: Implement these components */}
        {/* <Route path="/framework-manager" element={<FrameworkManager />} /> */}
        {/* <Route path="/policy-management" element={<PolicyManagement />} /> */}
        {/* <Route path="/qie" element={<QIEWorkflow />} /> */}
        {/* <Route path="/employee-training" element={<EmployeeTraining />} /> */}
        {/* <Route path="/privacy-suite" element={<PrivacySuite />} /> */}
        {/* <Route path="/assessment-marketplace" element={<AssessmentMarketplace />} /> */}
        <Route path="/prism-demo" element={<PrismDemoWorking />} />
        <Route path="/simple" element={<LayoutSimple />}>
          <Route index element={<DashboardSimple />} />
          <Route path="compass" element={<CompassWorking />} />
          <Route path="atlas" element={<AtlasWorking />} />
          <Route path="prism" element={<PrismDemo />} />
        </Route>
      </Routes>
        <TourOverlay />
        <Tooltip />
      </Router>
      </TourProvider>
    </DateProvider>
  );
}

export default App;