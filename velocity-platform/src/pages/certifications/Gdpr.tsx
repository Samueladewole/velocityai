import React from 'react';
import { Award, Shield, CheckCircle } from 'lucide-react';

const Gdpr: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Gdpr Certification</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about our Gdpr compliance and certification status.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Gdpr Compliant</h2>
                <p className="text-gray-600">Certified and audited by independent third parties</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Certification Details</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Current certification status: Active</li>
                  <li>• Last audit: 2025</li>
                  <li>• Next renewal: 2026</li>
                  <li>• Audit firm: Independent third party</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">What This Means</h3>
                <p className="text-blue-800 text-sm">
                  Our Gdpr certification demonstrates our commitment to maintaining 
                  the highest standards of security, privacy, and compliance for our customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gdpr;
