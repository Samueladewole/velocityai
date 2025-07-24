import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shield, 
  Boxes, 
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Users,
  Bot,
  Cloud,
  Lock,
  FileCheck,
  GraduationCap,
  ShoppingCart,
  BarChart3,
  Target,
  Search,
  Activity,
  Zap,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';

interface SidebarNavigationProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const mainNavItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    description: 'Executive command center'
  },
  {
    title: 'Trust Score',
    icon: Trophy,
    href: '/trust-score',
    description: 'Monitor and share trust credentials'
  },
  {
    title: 'Components',
    icon: Boxes,
    href: '#',
    description: 'Platform capabilities',
    children: [
      { title: 'QIE', icon: FileCheck, href: '/qie', description: 'Questionnaire Intelligence' },
      { title: 'DTEF Automation', icon: Shield, href: '/dtef', description: 'Digital Trust Framework' },
      { title: 'Framework Management', icon: Settings, href: '/framework-management', description: '70% overlap optimization' },
      { title: 'Privacy Management', icon: Lock, href: '/privacy-management', description: 'GDPR & CCPA compliance' },
      { title: 'AI Governance', icon: Bot, href: '/ai-governance', description: 'ISO 42001 compliance' },
      { title: 'Cloud Security', icon: Cloud, href: '/cloud-security', description: 'Multi-cloud scanning' },
      { title: 'Policy Management', icon: FileText, href: '/policy-management', description: 'AI-powered policies' },
      { title: 'Employee Training', icon: GraduationCap, href: '/employee-training', description: 'Gamified learning' },
      { title: 'Assessment Marketplace', icon: ShoppingCart, href: '/assessment-marketplace', description: 'Community assessments' }
    ]
  },
  {
    title: 'Reports',
    icon: BarChart3,
    href: '/reports',
    description: 'Analytics and insights'
  }
];

const toolsNavItems = [
  { title: 'PRISM', icon: BarChart3, href: '/prism', description: 'Risk quantification' },
  { title: 'COMPASS', icon: Target, href: '/compass', description: 'Compliance navigator' },
  { title: 'ATLAS', icon: Search, href: '/atlas', description: 'Threat intelligence' },
  { title: 'PULSE', icon: Activity, href: '/pulse', description: 'Real-time monitoring' },
  { title: 'CLEARANCE', icon: Zap, href: '/clearance', description: 'Risk decisions' }
];

const bottomNavItems = [
  { title: 'Settings', icon: Settings, href: '/settings' },
  { title: 'Help & Support', icon: HelpCircle, href: '/help' },
  { title: 'Notifications', icon: Bell, href: '/notifications', badge: 3 }
];

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (children: any[]) => 
    children.some(child => location.pathname === child.href);

  return (
    <div 
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 transition-all duration-300 z-40",
        isCollapsed ? "w-16" : "w-64"
      )}
      data-tour="sidebar"
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-6 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Primary Nav */}
            <div>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Main</h3>
              )}
              <ul className="space-y-1">
                {mainNavItems.map((item) => (
                  <li key={item.title}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => !isCollapsed && toggleExpanded(item.title)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            isParentActive(item.children)
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          )}
                        >
                          <item.icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed && "mx-auto")} />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-left">{item.title}</span>
                              <ChevronRight className={cn(
                                "h-4 w-4 transition-transform",
                                expandedItems.includes(item.title) && "rotate-90"
                              )} />
                            </>
                          )}
                        </button>
                        {!isCollapsed && expandedItems.includes(item.title) && (
                          <ul className="mt-1 ml-8 space-y-1">
                            {item.children.map((child) => (
                              <li key={child.title}>
                                <Link
                                  to={child.href}
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                                    isActive(child.href)
                                      ? "bg-blue-50 text-blue-700 font-medium"
                                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                  )}
                                >
                                  <child.icon className="h-4 w-4" />
                                  <span>{child.title}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        )}
                        title={isCollapsed ? item.title : undefined}
                      >
                        <item.icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed && "mx-auto")} />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools */}
            <div>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Tools</h3>
              )}
              <ul className="space-y-1">
                {toolsNavItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed && "mx-auto")} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-slate-200">
          <ul className="space-y-1">
            {bottomNavItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed && "mx-auto")} />
                  {!isCollapsed && <span>{item.title}</span>}
                  {item.badge && (
                    <span className={cn(
                      "absolute bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center",
                      isCollapsed ? "top-1 right-1" : "right-3"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};