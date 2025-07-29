import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple test components
const TestLanding = () => (
  <div className="min-h-screen bg-blue-100 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">ERIP Landing</h1>
      <p className="text-lg text-blue-700">Landing page is working</p>
      <a href="/app" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Go to Dashboard
      </a>
    </div>
  </div>
);

const TestLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-100">
    <div className="bg-white shadow-sm border-b p-4">
      <h1 className="text-xl font-semibold">ERIP Debug Layout</h1>
    </div>
    <div className="p-8">
      {children}
    </div>
  </div>
);

const TestDashboard = () => (
  <TestLayout>
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>Dashboard is working. If you see this, the routing is working.</p>
      <div className="mt-4">
        <a href="/app/test" className="text-blue-600 hover:text-blue-800">Go to test page</a>
      </div>
    </div>
  </TestLayout>
);

const TestPage = () => (
  <TestLayout>
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Test Page</h2>
      <p>Test page is working. Routing is functional.</p>
      <div className="mt-4">
        <a href="/app" className="text-blue-600 hover:text-blue-800">Back to dashboard</a>
      </div>
    </div>
  </TestLayout>
);

function App() {
  useEffect(() => {
    console.log('App component mounted');
  }, []);

  console.log('App component rendering');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestLanding />} />
        <Route path="/app" element={<TestDashboard />} />
        <Route path="/app/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;