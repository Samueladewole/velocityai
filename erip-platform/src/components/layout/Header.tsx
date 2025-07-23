import React from 'react';
import { Menu, Bell, User, ChevronDown, Shield, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore, useAuthStore } from '@/store';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { toggleSidebar } = useAppStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-slate-200/50 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden hover:bg-slate-100 rounded-xl"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">ERIP</h1>
            <p className="text-xs text-slate-500 font-medium">Trust Intelligence Platform</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/')}
          className="hover:bg-slate-100 rounded-xl"
          title="Go to Home"
        >
          <Home className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => navigate('/case-study')}
          className="hover:bg-slate-100 rounded-xl flex items-center gap-2 px-3 py-2"
          title="View Case Study"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline text-sm font-medium">Case Study</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="relative hover:bg-slate-100 rounded-xl"
        >
          <Bell className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
        </Button>

        <div className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-slate-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
            <User className="h-4 w-4 text-slate-600" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name || 'Guest User'}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
};