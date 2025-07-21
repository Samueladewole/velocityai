import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';

export const Layout: React.FC = () => {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,0.02)_0%,_transparent_50%)] pointer-events-none" />
      
      <Header />
      <Sidebar />
      <main className={cn(
        "relative pt-16 transition-all duration-300",
        sidebarOpen ? "md:ml-64" : "md:ml-16"
      )}>
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};