import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import VelocityRoutes from '@/components/velocity/VelocityRoutes';
import { ScrollToTop } from '@/components/ScrollToTop';

// Observability Components
import ExecutiveDashboard from '@/components/observability/ExecutiveDashboard';
import OperationalDashboard from '@/components/observability/OperationalDashboard';
import AuditReports from '@/components/observability/AuditReports';

// Agent Components
import { AgentDashboard } from '@/components/agents/AgentDashboard';

// Velocity State Management
interface VelocityState {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    plan: string;
  } | null;
  frameworks: any[];
  evidenceItems: any[];
  trustScore: number;
  activeAgents: number;
  automationRate: number;
}

interface VelocityContextType {
  state: VelocityState;
  updateState: (updates: Partial<VelocityState>) => void;
  isAuthenticated: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

const VelocityContext = createContext<VelocityContextType | null>(null);

export const useVelocity = () => {
  const context = useContext(VelocityContext);
  if (!context) {
    throw new Error('useVelocity must be used within VelocityProvider');
  }
  return context;
};

// Velocity Provider Component
const VelocityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<VelocityState>({
    user: null,
    frameworks: [],
    evidenceItems: [],
    trustScore: 94,
    activeAgents: 8,
    automationRate: 95
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('velocity_token'));

  // Check authentication status on mount and storage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('velocity_token');
      setIsAuthenticated(!!token);
    };

    // Listen for storage changes (like login/logout in other tabs)
    window.addEventListener('storage', checkAuth);
    
    const savedState = localStorage.getItem('velocity_state');
    const savedUser = localStorage.getItem('velocity_user');
    
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setState(prev => ({ ...prev, ...parsedState }));
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }

    if (savedUser && isAuthenticated) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setState(prev => ({ ...prev, user: parsedUser }));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
      }
    }

    return () => window.removeEventListener('storage', checkAuth);
  }, [isAuthenticated]);

  // Persist state changes
  const updateState = (updates: Partial<VelocityState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      // Persist to localStorage (excluding user data which is stored separately)
      const { user, ...stateToSave } = newState;
      localStorage.setItem('velocity_state', JSON.stringify(stateToSave));
      return newState;
    });
  };

  // Login function
  const login = (userData: any) => {
    localStorage.setItem('velocity_token', userData.token);
    localStorage.setItem('velocity_user', JSON.stringify(userData));
    setState(prev => ({ ...prev, user: userData }));
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('velocity_token');
    localStorage.removeItem('velocity_user');
    localStorage.removeItem('velocity_state');
    setState({
      user: null,
      frameworks: [],
      evidenceItems: [],
      trustScore: 94,
      activeAgents: 8,
      automationRate: 95
    });
    setIsAuthenticated(false);
  };

  return (
    <VelocityContext.Provider value={{ state, updateState, isAuthenticated, login, logout }}>
      {children}
    </VelocityContext.Provider>
  );
};

// Simple test landing page
const TestLanding: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b, #059669)', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          Velocity AI Platform
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '3rem', opacity: 0.8 }}>
          Compliance automation that transforms regulatory requirements into competitive advantages
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <button 
            onClick={() => navigate('/login')}
            style={{ background: '#059669', border: 'none', color: 'white', padding: '12px 24px', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer' }}
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer' }}
          >
            View Dashboard
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>AI-Powered Automation</h3>
            <p style={{ opacity: 0.8 }}>Reduce manual compliance work by 95% with intelligent automation</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Real-time Monitoring</h3>
            <p style={{ opacity: 0.8 }}>Continuous compliance monitoring across all your systems</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Enterprise Security</h3>
            <p style={{ opacity: 0.8 }}>SOC 2 Type II certified with bank-grade security</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Login Component
const SimpleLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useVelocity();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@velocity.ai' && password === 'admin123') {
      const userData = {
        id: 'admin-1',
        email: 'admin@velocity.ai',
        name: 'Admin User',
        role: 'admin',
        plan: 'Enterprise',
        token: 'admin_token_' + Date.now(),
        loginTime: new Date().toISOString()
      };
      
      login(userData);
      
      // Check if user has completed onboarding
      const hasCompletedOnboarding = localStorage.getItem('velocity_onboarding');
      if (!hasCompletedOnboarding) {
        navigate('/velocity/onboarding');
      } else {
        navigate('/velocity/dashboard');
      }
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

// Sidebar Component
const VelocitySidebar: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['QIE - Questionnaire Intelligence', 'ISACA Digital Trust']));
  const navigate = useNavigate();
  const { state } = useVelocity();

  const navigationItems = [
    { label: 'Dashboard', path: '/velocity/dashboard', icon: '🏠' },
    { label: 'Live Monitor', path: '/velocity/live', icon: '📊', badge: 'Live' },
    { 
      label: 'QIE - Questionnaire Intelligence', 
      icon: '🧠',
      badge: 'Key Feature',
      children: [
        { label: 'QIE Dashboard', path: '/velocity/qie', icon: '📊' },
        { label: 'New Questionnaire', path: '/velocity/qie/workflow', icon: '➕' },
        { label: 'Learning Center', path: '/velocity/qie/learning', icon: '📚' },
        { label: 'Templates', path: '/velocity/qie/templates', icon: '📋' },
      ]
    },
    { 
      label: 'AI Agents', 
      icon: '🤖',
      children: [
        { label: 'Active Agents', path: '/velocity/agents', icon: '✅' },
        { label: 'Agent Creator', path: '/velocity/creator', icon: '📦' },
        { label: 'Scheduled Tasks', path: '/velocity/scheduled', icon: '⏰' },
        { label: 'Agent Logs', path: '/velocity/logs', icon: '📋' },
      ]
    },
    {
      label: 'Evidence',
      icon: '📋',
      children: [
        { label: 'Evidence Review', path: '/velocity/evidence', icon: '📋' },
        { label: 'Validation Queue', path: '/velocity/validation', icon: '⚠️' },
        { label: 'Export Center', path: '/velocity/export', icon: '📦' },
      ]
    },
    {
      label: 'ISACA Digital Trust',
      icon: '🏛️',
      badge: 'Enterprise',
      children: [
        { label: 'COBIT Governance', path: '/velocity/isaca/cobit', icon: '🏛️' },
        { label: 'Risk IT Framework', path: '/velocity/isaca/riskit', icon: '⚠️' },
        { label: 'Digital Trust Score', path: '/velocity/isaca/trust', icon: '📊' },
        { label: 'Maturity Assessment', path: '/velocity/isaca/maturity', icon: '📈' },
      ]
    },
    {
      label: 'Compliance',
      icon: '🛡️',
      children: [
        { label: 'Trust Score', path: '/velocity/trust-score', icon: '📈' },
        { label: 'SOC 2', path: '/velocity/compliance/soc2', icon: '🛡️' },
        { label: 'ISO 27001', path: '/velocity/compliance/iso27001', icon: '🛡️' },
        { label: 'GDPR', path: '/velocity/compliance/gdpr', icon: '🛡️' },
        { label: 'Custom Frameworks', path: '/velocity/compliance/custom', icon: '⚙️' },
      ]
    },
    {
      label: 'Observability',
      icon: '🔍',
      badge: 'Enterprise',
      children: [
        { label: 'Executive Dashboard', path: '/velocity/observability/executive', icon: '👔' },
        { label: 'Operational Monitor', path: '/velocity/observability/operational', icon: '⚙️' },
        { label: 'AI Agent Performance', path: '/velocity/observability/agents', icon: '🤖' },
        { label: 'Compliance Tracking', path: '/velocity/observability/compliance', icon: '✅' },
        { label: 'Audit Reports', path: '/velocity/observability/audit', icon: '📋' },
        { label: 'System Health', path: '/velocity/observability/health', icon: '❤️' },
      ]
    },
    { label: 'Analytics', path: '/velocity/analytics', icon: '📊' },
    { label: 'Workflows', path: '/velocity/workflows', icon: '⚡' },
  ];

  const bottomItems = [
    { label: 'Documentation', path: '/velocity/docs', icon: '📚' },
    { label: 'Support', path: '/velocity/support', icon: '❓' },
    { label: 'Settings', path: '/velocity/settings', icon: '⚙️' },
  ];

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const renderNavItem = (item: any, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.label);

    if (hasChildren) {
      return (
        <div key={item.label} style={{ marginBottom: '4px' }}>
          <button
            onClick={() => toggleExpanded(item.label)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              marginLeft: depth > 0 ? '16px' : '0'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <span>{isExpanded ? '▼' : '▶'}</span>
          </button>
          {isExpanded && (
            <div style={{ marginTop: '4px' }}>
              {item.children.map((child: any) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.label}
        onClick={() => navigate(item.path)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'transparent',
          border: 'none',
          color: 'white',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          marginLeft: depth > 0 ? '32px' : '0',
          marginBottom: '4px'
        }}
        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
        onMouseOut={(e) => e.target.style.background = 'transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
        {item.badge && (
          <span style={{ 
            padding: '2px 6px', 
            fontSize: '0.7rem', 
            background: '#10b981', 
            borderRadius: '12px' 
          }}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div style={{ 
      width: '280px', 
      background: 'rgba(15, 23, 42, 0.8)', 
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'linear-gradient(135deg, #10b981, #f59e0b)', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '16px',
            color: 'white'
          }}>
            V
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Velocity</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>AI Compliance</p>
          </div>
        </div>
      </div>

      {/* Trust Score */}
      <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ 
          background: 'rgba(16, 185, 129, 0.1)', 
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '8px', 
          padding: '12px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Trust Score</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>94</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '6px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: '94%', 
              height: '100%', 
              background: 'linear-gradient(90deg, #10b981, #34d399)'
            }}></div>
          </div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#22c55e', marginTop: '4px' }}>+5 points this week</p>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        {navigationItems.map(item => renderNavItem(item))}
      </div>

      {/* Bottom Navigation */}
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {bottomItems.map(item => renderNavItem(item))}
      </div>

      {/* User Profile */}
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'rgba(16, 185, 129, 0.2)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            👤
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500', color: 'white' }}>
              {state.user?.name || 'Admin User'}
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
              {state.user?.plan || 'Enterprise Plan'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Dashboard Component
const SimpleDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { state, updateState, logout } = useVelocity();
  
  const handleLogout = () => {
    logout();
    navigate('/velocity/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b, #0f172a)', color: 'white', display: 'flex' }}>
      <VelocitySidebar />
      
      <div style={{ flex: 1, marginLeft: '280px' }}>
      {/* Enhanced Header */}
      <header style={{ 
        background: 'rgba(255,255,255,0.05)', 
        backdropFilter: 'blur(20px)', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '1rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'linear-gradient(135deg, #10b981, #f59e0b)', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            V
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>Velocity Dashboard</h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Search */}
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '8px', 
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '200px'
          }}>
            <span style={{ opacity: 0.7 }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search..." 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'white', 
                outline: 'none',
                width: '100%'
              }} 
            />
          </div>
          
          {/* Notifications */}
          <button style={{ 
            background: 'rgba(255,255,255,0.1)', 
            border: 'none', 
            color: 'white', 
            padding: '8px', 
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            🔔
          </button>
          
          {/* Profile Menu */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                border: 'none', 
                color: 'white', 
                padding: '8px 12px', 
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              👤 Admin
            </button>
            
            {isProfileOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'rgba(30, 41, 59, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px',
                minWidth: '150px',
                zIndex: 1000
              }}>
                <button 
                  style={{ 
                    width: '100%', 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'white', 
                    padding: '8px 12px', 
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                  Profile
                </button>
                <button 
                  style={{ 
                    width: '100%', 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'white', 
                    padding: '8px 12px', 
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                  Settings
                </button>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' }} />
                <button 
                  onClick={handleLogout}
                  style={{ 
                    width: '100%', 
                    background: 'transparent', 
                    border: 'none', 
                    color: '#ef4444', 
                    padding: '8px 12px', 
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                  onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div style={{ padding: '2rem' }}>
        {/* Enhanced Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {/* Trust Score Card */}
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '1.5rem', 
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #10b981, #34d399)',
              borderRadius: '16px 16px 0 0'
            }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>Trust Score</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', margin: '0.5rem 0' }}>{state.trustScore}%</div>
                <div style={{ fontSize: '0.8rem', color: '#22c55e' }}>↗ +2.1% from last month</div>
              </div>
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.2)', 
                padding: '8px', 
                borderRadius: '8px',
                fontSize: '1.2rem'
              }}>
                🛡️
              </div>
            </div>
          </div>

          {/* Active Agents Card */}
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            padding: '1.5rem', 
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
              borderRadius: '16px 16px 0 0'
            }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>Active AI Agents</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6', margin: '0.5rem 0' }}>{state.activeAgents}</div>
                <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>3 deployed this week</div>
              </div>
              <div style={{ 
                background: 'rgba(59, 130, 246, 0.2)', 
                padding: '8px', 
                borderRadius: '8px',
                fontSize: '1.2rem'
              }}>
                🤖
              </div>
            </div>
          </div>

          {/* Automation Rate Card */}
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            padding: '1.5rem', 
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              borderRadius: '16px 16px 0 0'
            }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>Automation Rate</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b', margin: '0.5rem 0' }}>{state.automationRate}%</div>
                <div style={{ fontSize: '0.8rem', color: '#f59e0b' }}>{state.evidenceItems.length} tasks automated</div>
              </div>
              <div style={{ 
                background: 'rgba(245, 158, 11, 0.2)', 
                padding: '8px', 
                borderRadius: '8px',
                fontSize: '1.2rem'
              }}>
                ⚡
              </div>
            </div>
          </div>

          {/* Evidence Items Card */}
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            padding: '1.5rem', 
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #a855f7, #c084fc)',
              borderRadius: '16px 16px 0 0'
            }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>Evidence Collected</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#a855f7', margin: '0.5rem 0' }}>2,847</div>
                <div style={{ fontSize: '0.8rem', color: '#a855f7' }}>147 new today</div>
              </div>
              <div style={{ 
                background: 'rgba(168, 85, 247, 0.2)', 
                padding: '8px', 
                borderRadius: '8px',
                fontSize: '1.2rem'
              }}>
                📊
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '2rem', 
          borderRadius: '16px' 
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button
              onClick={() => navigate('/velocity/qie/workflow')}
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: 'white',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>🧠</span>
              <span>QIE - New Questionnaire</span>
            </button>
            <button
              onClick={() => navigate('/velocity/evidence')}
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                color: 'white',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>📋</span>
              <span>Review Evidence</span>
            </button>
            <button
              onClick={() => navigate('/velocity/creator')}
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                color: 'white',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>🤖</span>
              <span>Create AI Agent</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useVelocity();
  return isAuthenticated ? <>{children}</> : <Navigate to="/velocity/login" />;
};

// Evidence Collection Component
const EvidenceCollection: React.FC = () => {
  const { state, updateState } = useVelocity();
  const navigate = useNavigate();

  // Sample frameworks from ERIP
  const frameworks = [
    { 
      id: 'soc2', 
      name: 'SOC 2 Type II', 
      controls: 64, 
      progress: 87,
      color: '#10b981',
      description: 'Service Organization Control 2 security, availability, processing integrity'
    },
    { 
      id: 'iso27001', 
      name: 'ISO 27001', 
      controls: 114, 
      progress: 72,
      color: '#3b82f6',
      description: 'Information Security Management System standard'
    },
    { 
      id: 'cis', 
      name: 'CIS Controls v8.1', 
      controls: 153, 
      progress: 65,
      color: '#f59e0b',
      description: 'Center for Internet Security Critical Security Controls'
    },
    { 
      id: 'gdpr', 
      name: 'GDPR', 
      controls: 47, 
      progress: 91,
      color: '#8b5cf6',
      description: 'General Data Protection Regulation compliance'
    }
  ];

  // Sample evidence items
  const evidenceItems = [
    {
      id: '1',
      type: 'config',
      title: 'AWS IAM Password Policy',
      framework: 'SOC 2',
      control: 'CC6.1 - Logical Access',
      status: 'verified',
      confidence: 98,
      platform: 'aws',
      collectedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2', 
      type: 'screenshot',
      title: 'MFA Configuration Evidence',
      framework: 'CIS Controls',
      control: 'CIS 6.2 - MFA',
      status: 'pending_review',
      confidence: 95,
      platform: 'manual',
      collectedAt: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      type: 'log',
      title: 'Access Log Review',
      framework: 'ISO 27001',
      control: 'A.9.4.2 - Access Review',
      status: 'auto_approved',
      confidence: 100,
      platform: 'gcp',
      collectedAt: '2024-01-15T08:45:00Z'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b, #0f172a)', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate('/velocity/dashboard')}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              border: '1px solid rgba(255,255,255,0.2)', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '8px',
              marginBottom: '1rem',
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Evidence Collection</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Automated compliance evidence collection across your infrastructure</p>
        </div>

        {/* Frameworks Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Active Frameworks</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {frameworks.map(framework => (
              <div key={framework.id} style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: `1px solid €{framework.color}40`,
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>{framework.name}</h3>
                  <span style={{ 
                    color: framework.color, 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold' 
                  }}>
                    {framework.progress}%
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>{framework.description}</p>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    width: '100%', 
                    height: '6px', 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `€{framework.progress}%`, 
                      height: '100%', 
                      background: framework.color
                    }}></div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {Math.round(framework.controls * framework.progress / 100)} of {framework.controls} controls implemented
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Evidence */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Recent Evidence Collection</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {evidenceItems.map(item => (
              <div key={item.id} style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>
                      {item.type === 'config' ? '⚙️' : item.type === 'screenshot' ? '📸' : '📋'}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>{item.title}</h3>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      background: item.status === 'verified' ? '#10b98140' : 
                                 item.status === 'auto_approved' ? '#3b82f640' : '#f59e0b40',
                      color: item.status === 'verified' ? '#10b981' : 
                             item.status === 'auto_approved' ? '#3b82f6' : '#f59e0b'
                    }}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    {item.framework} • {item.control} • Confidence: {item.confidence}%
                  </div>
                </div>
                <div style={{ textAlign: 'right', color: '#94a3b8', fontSize: '0.8rem' }}>
                  <div>{item.platform.toUpperCase()}</div>
                  <div>{new Date(item.collectedAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// QIE Dashboard Page - Key Velocity Differentiator
const QIEPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b, #0f172a)', color: 'white', display: 'flex' }}>
      <VelocitySidebar />
      
      <div style={{ flex: 1, marginLeft: '280px', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, #10b981, #f59e0b)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            🧠 Questionnaire Intelligence Engine
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Transform security questionnaires from sales blockers to competitive advantages</p>
        </div>

        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#94a3b8' }}>Time Saved</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>38 hours</div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#22c55e' }}>Per questionnaire</p>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#94a3b8' }}>Response Rate</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>Same Day</div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#3b82f6' }}>vs 2-week industry standard</p>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#94a3b8' }}>Win Rate Boost</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>+34%</div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#f59e0b' }}>Higher enterprise deals</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '16px' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button
              onClick={() => navigate('/velocity/qie/workflow')}
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: 'white',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>➕</span>
              <span>New Questionnaire</span>
            </button>
            <button
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                color: 'white',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>📚</span>
              <span>Learning Center</span>
            </button>
            <button
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                color: 'white',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>📋</span>
              <span>Templates</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// QIE Workflow Page
const QIEWorkflowPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b, #0f172a)', color: 'white', display: 'flex' }}>
      <VelocitySidebar />
      
      <div style={{ flex: 1, marginLeft: '280px', padding: '2rem' }}>
        <QIEWorkflowComponent onWorkflowComplete={(questionnaire) => {
          console.log('Questionnaire completed:', questionnaire);
        }} />
      </div>
    </div>
  );
};

// ISACA Digital Trust Assessment Page
const ISACADigitalTrustPage: React.FC = () => {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<DigitalTrustAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const isacaService = ISACADigitalTrustService.getInstance();

  const runAssessment = async () => {
    setIsLoading(true);
    try {
      const result = await isacaService.conductAutomatedAssessment('velocity-org');
      setAssessment(result);
    } catch (error) {
      console.error('Assessment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b, #0f172a)', color: 'white', display: 'flex' }}>
      <VelocitySidebar />
      
      <div style={{ flex: 1, marginLeft: '280px', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, #10b981, #f59e0b)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            🏛️ ISACA Digital Trust Assessment
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Enterprise credibility through ISACA Risk IT and COBIT frameworks</p>
        </div>

        {!assessment && (
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', padding: '3rem', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🏛️</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Professional Governance Assessment</h3>
            <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '1.1rem' }}>
              Assess your organization's digital trust maturity using ISACA's globally recognized frameworks
            </p>
            <button
              onClick={runAssessment}
              disabled={isLoading}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Running Assessment...' : 'Start ISACA Assessment'}
            </button>
          </div>
        )}

        {assessment && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Assessment Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#94a3b8' }}>Digital Trust Score</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{assessment.trustScore}</div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#22c55e' }}>ISACA Aligned</p>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#94a3b8' }}>Maturity Level</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{assessment.overallMaturity}/5</div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#3b82f6' }}>COBIT Framework</p>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#94a3b8' }}>Risk Score</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{assessment.riskScore}</div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#f59e0b' }}>Risk IT Aligned</p>
              </div>
            </div>

            {/* Domain Breakdown */}
            <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '16px' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>COBIT Domain Assessment</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {Object.entries(assessment.domainScores).map(([domain, score]) => (
                  <div key={domain} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '500' }}>{domain.toUpperCase()}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                        {domain === 'edm' ? 'Evaluate, Direct and Monitor' : 
                         domain === 'apo' ? 'Align, Plan and Organise' : 
                         'Domain Assessment'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: score >= 4 ? '#10b981' : score >= 3 ? '#f59e0b' : '#ef4444' }}>
                        {score.toFixed(1)}/5
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {score >= 4 ? 'Optimized' : score >= 3 ? 'Established' : 'Developing'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '16px' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>ISACA Recommendations</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {assessment.recommendations.map(rec => (
                  <div key={rec.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: `4px solid €{rec.priority === 'High' ? '#ef4444' : rec.priority === 'Medium' ? '#f59e0b' : '#10b981'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '500' }}>{rec.domain}</h4>
                      <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', background: rec.priority === 'High' ? '#ef444440' : '#f59e0b40', color: rec.priority === 'High' ? '#ef4444' : '#f59e0b' }}>
                        {rec.priority} Priority
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>{rec.description}</p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                      <span>Effort: {rec.effort}</span>
                      <span>Impact: {rec.impact}</span>
                      <span>Timeline: {rec.timeline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setAssessment(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                New Assessment
              </button>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Export Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Coming Soon Component for missing pages
const ComingSoon: React.FC<{ title: string }> = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b, #0f172a)', color: 'white', display: 'flex' }}>
      <VelocitySidebar />
      
      <div style={{ flex: 1, marginLeft: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #10b981, #f59e0b)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            🚧
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            {title}
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '2rem' }}>
            This feature is currently under development. We're working hard to bring you this functionality soon!
          </p>
          <button
            onClick={() => navigate('/velocity/dashboard')}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// Observability Wrapper Components
const ObservabilityExecutiveWrapper: React.FC = () => {
  const { state } = useVelocity();
  return <ExecutiveDashboard organizationId={state.user?.id || 'org-1'} />;
};

const ObservabilityOperationalWrapper: React.FC = () => {
  const { state } = useVelocity();
  return <OperationalDashboard organizationId={state.user?.id || 'org-1'} />;
};

const ObservabilityAuditWrapper: React.FC = () => {
  const { state } = useVelocity();
  return <AuditReports organizationId={state.user?.id || 'org-1'} />;
};

// Cryptographic Verification Wrapper Components (Agent 10)
const CryptographicDashboardWrapper: React.FC = () => {
  const { state } = useVelocity();
  return (
    <ComingSoon 
      title="Cryptographic Verification Dashboard" 
      description="🔐 Agent 10: World's first cryptographically verified AI compliance platform. Immutable proof for every decision, evidence, and trust score." 
    />
  );
};

const EvidenceIntegrityWrapper: React.FC = () => {
  const { state } = useVelocity();
  return (
    <ComingSoon 
      title="Evidence Integrity Blockchain" 
      description="🔗 Blockchain-based evidence verification with cryptographic proof chains. Every piece of evidence gets immutable attestation." 
    />
  );
};

const TrustScoreProofWrapper: React.FC = () => {
  const { state } = useVelocity();
  return (
    <ComingSoon 
      title="Trust Score Cryptographic Proof" 
      description="🏆 Immutable trust score calculations with cryptographic verification. Zero manipulation, maximum transparency." 
    />
  );
};

const AIVerificationWrapper: React.FC = () => {
  const { state } = useVelocity();
  return (
    <ComingSoon 
      title="AI Decision Verification" 
      description="🤖 Cryptographic attestation for every AI decision with human oversight verification and audit trails." 
    />
  );
};

const CredentialVerificationWrapper: React.FC = () => {
  const { state } = useVelocity();
  return (
    <ComingSoon 
      title="Professional Credential Verification" 
      description="🎓 Blockchain-verified ISACA, SOC, and compliance professional credentials with reputation scoring." 
    />
  );
};

const BlockchainExplorerWrapper: React.FC = () => {
  const { state } = useVelocity();
  return (
    <ComingSoon 
      title="Evidence Blockchain Explorer" 
      description="🔍 Explore the evidence integrity blockchain. View blocks, transactions, and cryptographic proofs." 
    />
  );
};

const VTPSmartContractsWrapper: React.FC = () => {
  const { state } = useVelocity();
  return (
    <ComingSoon 
      title="Velocity Trust Protocol (VTP)" 
      description="⚡ Smart contracts for automated trust verification, compliance checking, and regulatory integration." 
    />
  );
};

const CryptographicAnalyticsWrapper: React.FC = () => {
  const { state } = useVelocity();
  return (
    <ComingSoon 
      title="Cryptographic Analytics" 
      description="📊 Real-time analytics on cryptographic verification rates, blockchain integrity, and trust metrics." 
    />
  );
};

// Main App Component
const VelocityAppSimple: React.FC = () => {
  return (
    <VelocityProvider>
      <Router>
        <ScrollToTop />
        <VelocityRoutes />
      </Router>
    </VelocityProvider>
  );
};

export default VelocityAppSimple;