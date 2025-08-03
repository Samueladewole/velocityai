import React from 'react';
import { PublicHeader } from '../../components/common/PublicHeader';

const GDPRPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicHeader />
      
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              GDPR Compliance & International Transfers
            </h1>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              AI-powered GDPR compliance with seamless international data transfer management
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-lg mx-auto">
              <h2 className="text-xl font-semibold text-white mb-4">Page is Loading...</h2>
              <p className="text-blue-200">
                This is a test version to debug the blank page issue. The full GDPR page will be restored once the issue is resolved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GDPRPage;