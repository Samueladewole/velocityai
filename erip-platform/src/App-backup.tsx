import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  useEffect(() => {
    console.log('App component mounted');
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div style={{ padding: '20px' }}>
            <h1>ERIP Platform</h1>
            <p>Welcome to ERIP</p>
            <a href="/app" style={{ color: 'blue', textDecoration: 'underline' }}>Go to Dashboard</a>
          </div>
        } />
        <Route path="/app" element={
          <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>
            <p>This is the dashboard</p>
            <div style={{ marginTop: '20px' }}>
              <a href="/app/compass" style={{ color: 'blue', marginRight: '20px' }}>Compass</a>
              <a href="/app/atlas" style={{ color: 'blue', marginRight: '20px' }}>Atlas</a>
              <a href="/app/prism" style={{ color: 'blue', marginRight: '20px' }}>Prism</a>
            </div>
          </div>
        } />
        <Route path="/app/compass" element={
          <div style={{ padding: '20px' }}>
            <h1>COMPASS</h1>
            <p>Regulatory Intelligence Engine</p>
          </div>
        } />
        <Route path="/app/atlas" element={
          <div style={{ padding: '20px' }}>
            <h1>ATLAS</h1>
            <p>Vulnerability Management System</p>
          </div>
        } />
        <Route path="/app/prism" element={
          <div style={{ padding: '20px' }}>
            <h1>PRISM</h1>
            <p>Risk Quantification Engine</p>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;