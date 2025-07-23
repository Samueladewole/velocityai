import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Clearance } from '@/pages/Clearance';
import { Landing } from '@/pages/Landing';
import { useAppStore, useAuthStore, mockUser } from '@/store';

import { MonteCarloVisualization } from '@/components/prism/MonteCarloVisualization';
import { EUComplianceDashboard } from '@/components/atlas/EUComplianceDashboard';

// Mock data for demonstrations
const mockScenarios = [
  {
    id: '1',
    name: 'Data Breach',
    probability: { annual: 0.15 },
    impact: { financial: { min: 100000, max: 5000000, likely: 750000 } }
  },
  {
    id: '2', 
    name: 'System Outage',
    probability: { annual: 0.25 },
    impact: { financial: { min: 50000, max: 2000000, likely: 300000 } }
  }
];

// Placeholder components for other pages
const CompassPage = () => <div className="p-6"><h2 className="text-2xl font-bold">COMPASS - Regulatory Intelligence Engine</h2><p>AI-powered regulation analysis and compliance tracking</p></div>;
const AtlasPage = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">ATLAS - Security Assessment System</h2>
    <p className="mb-6">Intelligent security assessments with EU compliance monitoring</p>
    <EUComplianceDashboard organizationName="Demo Organization" />
  </div>
);
const PrismPage = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">PRISM - Risk Quantification Engine</h2>
    <p className="mb-6">Monte Carlo simulations and financial risk modeling</p>
    <MonteCarloVisualization scenarios={mockScenarios} />
  </div>
);
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
          <Route path="compass" element={<CompassPage />} />
          <Route path="atlas" element={<AtlasPage />} />
          <Route path="prism" element={<PrismPage />} />
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