import React from 'react';

// Simple test component to verify the agent creator works
const TestAgentCreator: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Agent Creator Test</h1>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <p>If you can see this, the basic component structure works.</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">🤖 AI Agent Creator should load here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAgentCreator;