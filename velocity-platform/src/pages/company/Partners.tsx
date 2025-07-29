import React from 'react';

const Partners: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Partners</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Partners page coming soon. Stay tuned for updates.
          </p>
        </div>
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Coming Soon
          </h3>
          <p className="text-gray-600 mb-6">
            We're working on this page. Check back soon for updates.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Get Notified
          </button>
        </div>
      </div>
    </div>
  );
};

export default Partners;
