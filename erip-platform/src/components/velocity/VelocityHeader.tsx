import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Home, 
  Activity, 
  Database, 
  Bot, 
  FileCheck,
  BookOpen,
  LogOut,
  Settings
} from 'lucide-react';

export const VelocityHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Velocity</h1>
              <p className="text-xs text-gray-500">by ERIP</p>
            </div>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link 
              to="/live" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Activity className="w-4 h-4" />
              Live Monitor
            </Link>
            <Link 
              to="/integration" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Database className="w-4 h-4" />
              Integrations
            </Link>
            <Link 
              to="/creator" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Bot className="w-4 h-4" />
              Agent Creator
            </Link>
            <Link 
              to="/evidence" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FileCheck className="w-4 h-4" />
              Evidence
            </Link>
            <Link 
              to="/docs" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Docs
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = 'https://app.eripapp.com'}
            >
              Back to ERIP
            </Button>
            
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default VelocityHeader;