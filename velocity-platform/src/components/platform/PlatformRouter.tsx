import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PLATFORM_CONFIG, shouldRedirectToPlatform, isPlatformEnabled, DEV_CONFIG } from '@/config/platform.config';

// ERIP Components (existing)
import { LandingEnhanced } from '@/pages/LandingEnhanced';
import { DashboardEnhanced } from '@/pages/DashboardEnhanced';

// Velocity Components  
import VelocityLanding from '@/components/velocity/VelocityLanding';
import VelocitySignup from '@/components/velocity/VelocitySignup';
import VelocityLogin from '@/components/velocity/VelocityLogin';
import LiveVelocityDashboard from '@/components/velocity/LiveVelocityDashboard';

// Platform-specific app wrappers
import ERIPApp from '../ERIPApp';
import VelocityApp from '../../VelocityApp';

const PlatformRouter: React.FC = () => {
  // Handle domain redirects
  useEffect(() => {
    if (DEV_CONFIG.DISABLE_REDIRECTS) return;
    
    const redirectInfo = shouldRedirectToPlatform();
    if (redirectInfo.redirect && redirectInfo.target) {
      window.location.href = redirectInfo.target;
    }
  }, []);

  const eripEnabled = isPlatformEnabled('erip');
  const velocityEnabled = isPlatformEnabled('velocity');
  
  // If neither platform is enabled, show error
  if (!eripEnabled && !velocityEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Platform Configuration Error</h1>
          <p className="text-gray-600">No platforms are currently enabled.</p>
          <p className="text-sm text-gray-500 mt-2">
            Please check your environment configuration.
          </p>
        </div>
      </div>
    );
  }

  // Route structure based on enabled platforms
  return (
    <Routes>
      {/* Velocity Routes */}
      {velocityEnabled && (
        <>
          {/* Velocity standalone routes (for velocity.eripapp.com) */}
          <Route path="/velocity/*" element={<VelocityApp />} />
          
          {/* If Velocity is primary, show it on root domain */}
          {PLATFORM_CONFIG.mode === 'velocity-primary' && (
            <>
              <Route path="/" element={<VelocityLanding />} />
              <Route path="/signup" element={<VelocitySignup />} />
              <Route path="/login" element={<VelocityLogin />} />
              <Route path="/dashboard" element={<LiveVelocityDashboard />} />
            </>
          )}
          
          {/* Velocity-only mode */}
          {PLATFORM_CONFIG.mode === 'velocity-only' && (
            <>
              <Route path="/" element={<VelocityLanding />} />
              <Route path="/signup" element={<VelocitySignup />} />
              <Route path="/login" element={<VelocityLogin />} />
              <Route path="/dashboard" element={<LiveVelocityDashboard />} />
              {/* Redirect all other routes to Velocity */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </>
      )}

      {/* ERIP Routes */}
      {eripEnabled && (
        <>
          {/* ERIP routes (existing structure) */}
          <Route path="/erip/*" element={<ERIPApp />} />
          
          {/* If ERIP is primary, show it on root domain */}
          {PLATFORM_CONFIG.mode === 'erip-primary' && (
            <>
              <Route path="/" element={<LandingEnhanced />} />
              <Route path="/dashboard" element={<DashboardEnhanced />} />
              {/* Add other ERIP routes as needed */}
            </>
          )}
          
          {/* ERIP-only mode */}
          {PLATFORM_CONFIG.mode === 'erip-only' && (
            <>
              <Route path="/" element={<LandingEnhanced />} />
              <Route path="/dashboard" element={<DashboardEnhanced />} />
              {/* Redirect all other routes to ERIP */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </>
      )}

      {/* Dual Platform Mode */}
      {PLATFORM_CONFIG.mode === 'dual-platform' && (
        <>
          {/* Default to Velocity if both are enabled */}
          <Route path="/" element={<VelocityLanding />} />
          
          {/* Explicit platform routing */}
          <Route path="/erip" element={<Navigate to="/erip/" replace />} />
          <Route path="/velocity" element={<Navigate to="/velocity/" replace />} />
        </>
      )}

      {/* Fallback routes */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
              <p className="text-gray-600">The requested page could not be found.</p>
              {velocityEnabled && (
                <button 
                  onClick={() => window.location.href = '/velocity'}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Go to Velocity
                </button>
              )}
              {eripEnabled && (
                <button 
                  onClick={() => window.location.href = '/erip'}
                  className="mt-4 ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go to ERIP
                </button>
              )}
            </div>
          </div>
        } 
      />
    </Routes>
  );
};

export default PlatformRouter;