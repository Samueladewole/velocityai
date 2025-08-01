import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { SidebarNavigation } from '@/components/navigation/SidebarNavigation';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';
import EvidenceNotifications from '@/components/features/evidence/EvidenceNotifications';
import { useWebSocket } from '@/hooks/useWebSocket';

export const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize WebSocket connection for authenticated users
  const { isConnected } = useWebSocket({
    autoConnect: isAuthenticated,
    reconnectOnClose: true
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <NavigationHeader />
      
      <div className="flex">
        {/* Sidebar for authenticated users */}
        {isAuthenticated && (
          <SidebarNavigation 
            isCollapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
        )}
        
        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300",
          isAuthenticated ? (sidebarCollapsed ? "ml-16" : "ml-64") : "ml-0",
          "mt-16" // Account for fixed header
        )}>
          <Outlet />
        </main>
      </div>

      {/* Real-time notifications for authenticated users */}
      {isAuthenticated && isConnected && (
        <EvidenceNotifications />
      )}

      {/* WebSocket Connection Status Indicator */}
      {isAuthenticated && (
        <div className="fixed bottom-4 left-4 z-40">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="font-medium">
              {isConnected ? 'Live' : 'Reconnecting...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};