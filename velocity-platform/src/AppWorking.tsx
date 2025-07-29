import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrismDemoSimple } from './pages/PrismDemoSimple';
import { PrismDemoWorking } from './pages/PrismDemoWorking';
import { TestLanding } from './pages/TestLanding';
import { useAppStore, useAuthStore, mockUser } from './store';

// Simple Dashboard Component
function SimpleDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">ERIP Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">🎯 PRISM</h2>
            <p className="text-gray-600 mb-4">Risk Quantification</p>
            <a href="/dashboard/prism-demo" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Launch PRISM
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">🧭 Compass</h2>
            <p className="text-gray-600 mb-4">Risk Assessment</p>
            <button className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">
              Coming Soon
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">📊 Atlas</h2>
            <p className="text-gray-600 mb-4">Risk Mapping</p>
            <button className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <span>PRISM - Fully Operational</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
              <span>Other Modules - In Development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppWorking() {
  const { setTheme } = useAppStore();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestLanding />} />
        <Route path="/dashboard" element={<SimpleDashboard />} />
        <Route path="/dashboard/prism-demo" element={<PrismDemoWorking />} />
        <Route path="/prism-test" element={<PrismDemoSimple />} />
        <Route path="/prism-demo" element={<PrismDemoWorking />} />
        <Route path="*" element={<TestLanding />} />
      </Routes>
    </Router>
  );
}

export default AppWorking;