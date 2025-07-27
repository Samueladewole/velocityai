import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '@/store';

export const TestRouting: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Routing Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Current Location:</h2>
          <p>{location.pathname}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Authentication Status:</h2>
          <p>Authenticated: {isAuthenticated ? 'YES' : 'NO'}</p>
          <p>User: {user?.email || 'None'}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Test Links:</h2>
          <div className="space-y-2">
            <Link to="/dashboard" className="block text-blue-600 hover:underline">Dashboard</Link>
            <Link to="/tools" className="block text-blue-600 hover:underline">Tools (with sidebar)</Link>
            <Link to="/tools/dtef-automation" className="block text-blue-600 hover:underline">DTEF Automation</Link>
            <Link to="/framework-management" className="block text-blue-600 hover:underline">Framework Management</Link>
          </div>
        </div>
      </div>
    </div>
  );
};