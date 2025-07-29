import React from 'react';
import { useAuthStore } from '@/store';

export const DebugAuth: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>
      <div className="space-y-2">
        <p>Is Authenticated: {isAuthenticated ? 'YES' : 'NO'}</p>
        <p>User: {user ? JSON.stringify(user, null, 2) : 'null'}</p>
      </div>
    </div>
  );
};