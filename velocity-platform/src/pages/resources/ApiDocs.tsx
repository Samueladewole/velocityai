import React from 'react';
import { BookOpen } from 'lucide-react';

const ApiDocs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">ApiDocs</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ApiDocs resources coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
