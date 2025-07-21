import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Map, 
  Calculator, 
  Activity, 
  Lock, 
  Network, 
  Lightbulb, 
  Shield,
  LayoutDashboard,
  Settings,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  description?: string;
}

const navigationItems: NavItem[] = [{
  id: 'dashboard',
  label: 'Dashboard',
  icon: <LayoutDashboard className="h-5 w-5" />,
  path: '/',
  description: 'Executive overview'
}, {
  id: 'compass',
  label: 'COMPASS',
  icon: <Compass className="h-5 w-5" />,
  path: '/compass',
  description: 'Regulatory Intelligence'
}, {
  id: 'atlas',
  label: 'ATLAS',
  icon: <Map className="h-5 w-5" />,
  path: '/atlas',
  description: 'Security Assessment'
}, {
  id: 'prism',
  label: 'PRISM',
  icon: <Calculator className="h-5 w-5" />,
  path: '/prism',
  description: 'Risk Quantification'
}, {
  id: 'pulse',
  label: 'PULSE',
  icon: <Activity className="h-5 w-5" />,
  path: '/pulse',
  description: 'Continuous Monitoring'
}, {
  id: 'cipher',
  label: 'CIPHER',
  icon: <Lock className="h-5 w-5" />,
  path: '/cipher',
  description: 'Policy Automation'
}, {
  id: 'nexus',
  label: 'NEXUS',
  icon: <Network className="h-5 w-5" />,
  path: '/nexus',
  description: 'Intelligence Platform'
}, {
  id: 'beacon',
  label: 'BEACON',
  icon: <Lightbulb className="h-5 w-5" />,
  path: '/beacon',
  description: 'Value Demonstration'
}, {
  id: 'clearance',
  label: 'CLEARANCE',
  icon: <Shield className="h-5 w-5" />,
  path: '/clearance',
  description: 'Risk Clearance'
}];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { sidebarOpen, activeComponent, setActiveComponent } = useAppStore();

  const handleNavigation = (item: NavItem) => {
    setActiveComponent(item.id);
    navigate(item.path);
  };

  return (
    <aside className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r transition-all duration-300",
      sidebarOpen ? "w-64" : "w-0 md:w-16"
    )}>
      <nav className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  activeComponent === item.id && "bg-accent text-accent-foreground",
                  !sidebarOpen && "md:justify-center"
                )}
              >
                {item.icon}
                {sidebarOpen && (
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t p-4 space-y-1">
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              !sidebarOpen && "md:justify-center"
            )}
          >
            <Settings className="h-5 w-5" />
            {sidebarOpen && <span className="text-sm">Settings</span>}
          </button>
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              !sidebarOpen && "md:justify-center"
            )}
          >
            <HelpCircle className="h-5 w-5" />
            {sidebarOpen && <span className="text-sm">Help</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
};