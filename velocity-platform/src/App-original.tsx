import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Clearance } from '@/pages/Clearance';
import { Landing } from '@/pages/Landing';
import { Compass } from '@/pages/Compass';
import { Atlas } from '@/pages/Atlas';
import { Prism } from '@/pages/Prism';
import { useAppStore, useAuthStore, mockUser } from '@/store';

// Placeholder components for remaining pages
const PulsePage = () => <div className="p-6"><h2 className="text-2xl font-bold">PULSE - Continuous Monitoring</h2><p>Real-time monitoring and predictive analytics</p></div>;
const CipherPage = () => <div className="p-6"><h2 className="text-2xl font-bold">CIPHER - Policy Automation</h2><p>AI-powered policy generation and automation</p></div>;
const NexusPage = () => <div className="p-6"><h2 className="text-2xl font-bold">NEXUS - Intelligence Platform</h2><p>Threat intelligence and industry benchmarking</p></div>;
const BeaconPage = () => <div className="p-6"><h2 className="text-2xl font-bold">BEACON - Value Demonstration</h2><p>ROI measurement and business impact reporting</p></div>;

function App() {
  const { setTheme } = useAppStore();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Auto-login for demo (in production, would handle proper authentication)
    if (!isAuthenticated) {
      login(mockUser);
    }
  }, [setTheme, login, isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="compass" element={<Compass />} />
          <Route path="atlas" element={<Atlas />} />
          <Route path="prism" element={<Prism />} />
          <Route path="pulse" element={<PulsePage />} />
          <Route path="cipher" element={<CipherPage />} />
          <Route path="nexus" element={<NexusPage />} />
          <Route path="beacon" element={<BeaconPage />} />
          <Route path="clearance" element={<Clearance />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;