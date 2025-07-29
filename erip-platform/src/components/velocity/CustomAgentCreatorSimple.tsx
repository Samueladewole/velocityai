import React from 'react';
import { Bot } from 'lucide-react';

const CustomAgentCreatorSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Agent Creator</h1>
              <p className="text-gray-600">Build intelligent compliance agents with natural language</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              🤖 <strong>AI Agent Creator is loading...</strong>
            </p>
            <p className="text-sm text-gray-600">
              If you can see this message, the routing and basic component structure is working correctly.
              The issue might be with the full CustomAgentCreator component complexity.
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Test</h3>
            <p className="text-blue-800 text-sm">
              Try typing: "Create an AWS SOC2 agent that runs every 4 hours"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAgentCreatorSimple;