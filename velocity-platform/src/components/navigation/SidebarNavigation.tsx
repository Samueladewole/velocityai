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
  Bell,
  Sparkles,
  Globe,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';

interface SidebarNavigationProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const mainNavItems = [
  {
    title: 'Agent Dashboard',
    icon: Bot,
    href: '/dashboard',
    description: '10 AI agents working for you'
  },
  {
    title: 'Evidence Collection',
    icon: FileCheck,
    href: '/dashboard',
    description: 'Automated evidence gathering'
  },
  {
    title: 'Trust Score',
    icon: Trophy,
    href: '/dashboard',
    description: 'Cryptographically verified trust'
  },
  {
    title: 'QIE Intelligence',
    icon: FileText,
    href: '/velocity/qie',
    description: 'Questionnaire automation'
  },
  {
    title: 'Cloud Integrations',
    icon: Cloud,
    href: '/dashboard',
    description: 'AWS, GCP, Azure connections'
  },
  {
    title: 'Compliance Frameworks',
    icon: Shield,
    href: '/dashboard',
    description: 'SOC 2, ISO 27001, GDPR, HIPAA'
  },
  {
    title: 'AI Agents',
    icon: Bot,
    href: '#',
    description: '10 intelligent automation agents',
    children: [
      { title: 'AWS Evidence Collector', icon: Zap, href: '/velocity/agents/aws-evidence', description: 'CloudTrail, Config, Security Hub' },
      { title: 'GCP Security Scanner', icon: Cpu, href: '/velocity/agents/gcp-scanner', description: 'IAM, Cloud Security Command Center' },
      { title: 'Azure Security Monitor', icon: Activity, href: '/velocity/agents/azure-monitor', description: 'Security Center, Sentinel, Defender' },
      { title: 'GitHub Security Analyzer', icon: Database, href: '/velocity/agents/github-analyzer', description: 'Repository security, branch protection' },
      { title: 'QIE Integration Agent', icon: FileText, href: '/velocity/agents/qie-agent', description: 'Questionnaire intelligence engine' },
      { title: 'Trust Score Engine', icon: Shield, href: '/velocity/agents/trust-engine', description: 'Cryptographic verification system' },
      { title: 'Continuous Monitor', icon: Eye, href: '/velocity/agents/continuous-monitor', description: 'Real-time configuration tracking' },
      { title: 'Document Generator', icon: FileText, href: '/velocity/agents/doc-generator', description: 'Automated compliance documentation' },
      { title: 'Observability Specialist', icon: Activity, href: '/velocity/agents/observability', description: 'System monitoring and alerting' },
      { title: 'Cryptographic Verification', icon: Lock, href: '/velocity/agents/crypto-verification', description: 'Blockchain proof generation' }
    ]
  },
  {
    title: 'Reports',
    icon: BarChart3,
    href: '/velocity/reports',
    description: 'Analytics and insights'
  }
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