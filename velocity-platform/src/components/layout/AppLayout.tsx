import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { SidebarNavigation } from '@/components/navigation/SidebarNavigation';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

export const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    </div>
  );
};