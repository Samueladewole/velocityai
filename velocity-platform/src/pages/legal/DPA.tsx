import React from 'react';
import { Shield } from 'lucide-react';

const DPA: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Data Processing Agreement</h1>
          </div>
          <p className="text-lg text-gray-600">
            Last updated: July 28, 2025
          </p>
        </div>
        
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            DPA Documentation
          </h2>
          <p className="text-blue-800 mb-6">
            This page is being updated with comprehensive data processing agreement information.
          </p>
          <p className="text-blue-700">
            For immediate assistance, contact us at{' '}
            <a href="mailto:legal@eripapp.com" className="underline">
              legal@eripapp.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DPA;