import React, { useState } from 'react';
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
  HelpCircle,
  Zap,
  Bot,
  FileCheck,
  Globe,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Target,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  description?: string;
  children?: NavItem[];
  isDropdown?: boolean;
}

const navigationItems: NavItem[] = [{
  id: 'dashboard',
  label: 'Dashboard',
  icon: <LayoutDashboard className="h-5 w-5" />,
  path: '/dashboard',
  description: 'Executive overview'
}, {
  id: 'trust-score',
  label: 'Trust Score',
  icon: <Target className="h-5 w-5" />,
  path: '/trust-score',
  description: 'Compliance scoring'
}, {
  id: 'velocity',
  label: 'Velocity AI',
  icon: <Zap className="h-5 w-5" />,
  description: 'AI-Powered Compliance',
  isDropdown: true,
  children: [{
    id: 'velocity-dashboard',
    label: 'AI Agents',
    icon: <Bot className="h-5 w-5" />,
    path: '/velocity/dashboard',
    description: 'Velocity AI Dashboard'
  }, {
    id: 'velocity-live',
    label: 'Live Dashboard',
    icon: <Zap className="h-5 w-5" />,
    path: '/velocity/live',
    description: 'Real-time Interactive Dashboard'
  }, {
    id: 'velocity-evidence',
    label: 'Evidence Review',
    icon: <FileCheck className="h-5 w-5" />,
    path: '/velocity/evidence',
    description: 'Review AI Evidence'
  }, {
    id: 'velocity-integration',
    label: 'Integrations',
    icon: <Globe className="h-5 w-5" />,
    path: '/velocity/integration',
    description: 'Platform Connections'
  }, {
    id: 'velocity-creator',
    label: 'Agent Creator',
    icon: <Sparkles className="h-5 w-5" />,
    path: '/velocity/creator',
    description: 'Build Custom Agents'
  }]
}, {
  id: 'tools',
  label: 'Tools',
  icon: <Wrench className="h-5 w-5" />,
  description: 'ERIP Tool Suite',
  isDropdown: true,
  children: [{
    id: 'prism',
    label: 'PRISM',
    icon: <Calculator className="h-5 w-5" />,
    path: '/tools/prism',
    description: 'Risk Quantification'
  }, {
    id: 'beacon',
    label: 'BEACON',
    icon: <Lightbulb className="h-5 w-5" />,
    path: '/tools/beacon',
    description: 'Value Demonstration'
  }, {
    id: 'compass',
    label: 'COMPASS',
    icon: <Compass className="h-5 w-5" />,
    path: '/tools/compass',
    description: 'Regulatory Intelligence'
  }, {
    id: 'atlas',
    label: 'ATLAS',
    icon: <Map className="h-5 w-5" />,
    path: '/tools/atlas',
    description: 'Security Assessment'
  }, {
    id: 'nexus',
    label: 'NEXUS',
    icon: <Network className="h-5 w-5" />,
    path: '/tools/nexus',
    description: 'Intelligence Platform'
  }, {
    id: 'pulse',
    label: 'PULSE',
    icon: <Activity className="h-5 w-5" />,
    path: '/tools/pulse',
    description: 'Continuous Monitoring'
  }, {
    id: 'clearance',
    label: 'CLEARANCE',
    icon: <Shield className="h-5 w-5" />,
    path: '/tools/clearance',
    description: 'Risk Clearance'
  }, {
    id: 'cipher',
    label: 'CIPHER',
    icon: <Lock className="h-5 w-5" />,
    path: '/tools/cipher',
    description: 'Policy Automation'
  }]
}];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { sidebarOpen, activeComponent, setActiveComponent } = useAppStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['velocity', 'tools']));

  const handleNavigation = (item: NavItem) => {
    if (item.path) {
      setActiveComponent(item.id);
      navigate(item.path);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const renderNavItem = (item: NavItem, isChild = false) => {
    const isExpanded = expandedSections.has(item.id);
    const isActive = activeComponent === item.id;
    
    return (
      <div key={item.id}>
        <button
          onClick={() => item.isDropdown ? toggleSection(item.id) : handleNavigation(item)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground",
            isChild && "ml-4 pl-2",
            !sidebarOpen && "md:justify-center"
          )}
        >
          {item.icon}
          {sidebarOpen && (
            <>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">{item.label}</div>
                {item.description && (
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                )}
              </div>
              {item.isDropdown && (
                <div className="ml-auto">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              )}
            </>
          )}
        </button>
        
        {item.isDropdown && isExpanded && sidebarOpen && item.children && (
          <div className="mt-1 space-y-1">
            {item.children.map((child) => renderNavItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r transition-all duration-300",
      sidebarOpen ? "w-64" : "w-0 md:w-16"
    )}>
      <nav className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {navigationItems.map((item) => renderNavItem(item))}
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