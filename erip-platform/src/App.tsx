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
    <Router>
      <Routes>
        <Route path="/" element={<LandingEnhanced />} />
        <Route path="/prism-demo" element={<PrismDemoWorking />} />
        <Route path="/industry" element={<IndustrySelection />} />
        <Route path="/regulatory/eu" element={<EuropeanLandscape />} />
        <Route path="/case-study" element={<CaseStudy />} />
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
        </Route>
        <Route path="/simple" element={<LayoutSimple />}>
          <Route index element={<DashboardSimple />} />
          <Route path="compass" element={<div><h2>Compass Page</h2><p>Coming Soon</p></div>} />
          <Route path="atlas" element={<div><h2>Atlas Page</h2><p>Coming Soon</p></div>} />
          <Route path="prism" element={<div><h2>Prism Page</h2><p>Coming Soon</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;