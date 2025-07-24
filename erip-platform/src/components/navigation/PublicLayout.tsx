import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavigationHeader } from './NavigationHeader';
import { NavigationFooter } from './NavigationFooter';
import { cn } from '@/lib/utils';

interface PublicLayoutProps {
  className?: string;
  children?: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ className, children }) => {
  return (
    <div className={cn("min-h-screen bg-white", className)}>
      <NavigationHeader />
      
      <main className="pt-16">
        {children || <Outlet />}
      </main>
      
      <NavigationFooter />
    </div>
  );
};