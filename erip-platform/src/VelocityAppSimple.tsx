import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Simple Login Component
const SimpleLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@velocity.ai' && password === 'admin123') {
      localStorage.setItem('velocity_token', 'authenticated');
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleLogin} style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '12px', width: '400px' }}>
        <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Velocity Login</h1>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            placeholder="admin@velocity.ai"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            placeholder="admin123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#059669', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}>
          Login
        </button>
      </form>
    </div>
  );
};

// Simple Dashboard Component
const SimpleDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('velocity_token');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white' }}>
      <header style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Velocity Dashboard</h1>
        <button onClick={handleLogout} style={{ background: '#dc2626', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px' }}>
          Logout
        </button>
      </header>
      
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '12px' }}>
            <h3>Trust Score</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>94%</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '12px' }}>
            <h3>Active Agents</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>8</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '12px' }}>
            <h3>Automation Rate</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>95%</div>
          </div>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '12px' }}>
          <h3>Welcome to Velocity Dashboard</h3>
          <p>This is a working dashboard. Your routing and authentication are functional.</p>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('velocity_token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Main App Component
const VelocityAppSimple: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SimpleLogin />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <SimpleDashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default VelocityAppSimple;