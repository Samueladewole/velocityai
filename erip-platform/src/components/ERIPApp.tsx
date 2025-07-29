import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ScrollToTop } from '@/components/ScrollToTop';

// ERIP-specific imports (existing pages)
import { LandingEnhanced } from '@/pages/LandingEnhanced';
import { IndustrySelection } from '@/pages/IndustrySelection';
import { EuropeanLandscape } from '@/pages/regulatory/EuropeanLandscape';
import { CaseStudy } from '@/pages/CaseStudy';
import { LayoutSimple } from '@/components/layout/LayoutSimple';
import { Layout } from '@/components/layout/Layout';
import { DashboardSimple } from '@/pages/DashboardSimple';
import { DashboardEnhanced } from '@/pages/DashboardEnhanced';
import { CompassWorking } from '@/pages/CompassWorking';
import { AtlasWorking } from '@/pages/AtlasWorking';
import { Prism } from '@/pages/Prism';
import { PrismDemo } from '@/pages/PrismDemo';
import { ClearanceWorking } from '@/pages/ClearanceWorking';
import { PulseWorking } from '@/pages/PulseWorking';
import { CipherWorking } from '@/pages/CipherWorking';
import { NexusWorking } from '@/pages/NexusWorking';
import { BeaconWorking } from '@/pages/BeaconWorking';
import { Onboarding } from '@/pages/Onboarding';
import { MVPDashboard } from '@/pages/MVPDashboard';

// ERIP feature flags
import { ERIP_FEATURES } from '@/config/platform.config';

const ERIPApp: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ERIP Landing and Core */}
        <Route path="/" element={<LandingEnhanced />} />
        <Route path="/industry-selection" element={<IndustrySelection />} />
        <Route path="/regulatory/european-landscape" element={<EuropeanLandscape />} />
        <Route path="/case-study" element={<CaseStudy />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Dashboards */}
        <Route path="/dashboard" element={
          <Layout>
            <DashboardEnhanced />
          </Layout>
        } />
        <Route path="/dashboard-simple" element={
          <LayoutSimple>
            <DashboardSimple />
          </LayoutSimple>
        } />
        <Route path="/mvp-dashboard" element={<MVPDashboard />} />

        {/* ERIP Tools - Conditional based on feature flags */}
        {ERIP_FEATURES.PRISM && (
          <>
            <Route path="/prism" element={<Prism />} />
            <Route path="/prism-demo" element={<PrismDemo />} />
          </>
        )}
        
        {ERIP_FEATURES.COMPASS && (
          <Route path="/compass" element={<CompassWorking />} />
        )}
        
        {ERIP_FEATURES.ATLAS && (
          <Route path="/atlas" element={<AtlasWorking />} />
        )}
        
        {ERIP_FEATURES.CLEARANCE && (
          <Route path="/clearance" element={<ClearanceWorking />} />
        )}
        
        {ERIP_FEATURES.PULSE && (
          <Route path="/pulse" element={<PulseWorking />} />
        )}
        
        {ERIP_FEATURES.CIPHER && (
          <Route path="/cipher" element={<CipherWorking />} />
        )}
        
        {ERIP_FEATURES.NEXUS && (
          <Route path="/nexus" element={<NexusWorking />} />
        )}
        
        {ERIP_FEATURES.BEACON && (
          <Route path="/beacon" element={<BeaconWorking />} />
        )}

        {/* ERIP Business Features */}
        {ERIP_FEATURES.QIE && (
          <Route path="/qie" element={<div>QIE Enhanced (Coming Soon)</div>} />
        )}
        
        {ERIP_FEATURES.SHEETS && (
          <Route path="/sheets" element={<div>Collaborative Sheets (Coming Soon)</div>} />
        )}
        
        {ERIP_FEATURES.TRUST_CENTER && (
          <Route path="/trust-center" element={<div>Trust Center (Coming Soon)</div>} />
        )}

        {/* Fallback for unknown ERIP routes */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">ERIP Page Not Found</h1>
              <p className="text-gray-600">The requested ERIP page could not be found.</p>
              <button 
                onClick={() => window.location.href = '/erip/'}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to ERIP Home
              </button>
            </div>
          </div>
        } />
      </Routes>
    </>
  );
};

export default ERIPApp;