import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Zap,
  Home,
  Activity,
  Database,
  Bot,
  FileCheck,
  Settings,
  HelpCircle,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  BookOpen,
  Code2,
  Workflow,
  ChevronDown,
  ChevronRight,
  Package,
  Cloud,
  Globe,
  Github,
  Key,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

interface NavItem {
  label: string;
  path?: string;
  icon: React.FC<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

interface VelocitySidebarProps {
  className?: string;
}

export const VelocitySidebar: React.FC<VelocitySidebarProps> = ({ className }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['compliance']));

  // Check if we're in subdomain mode or main app
  const isSubdomain = window.location.hostname.includes('velocity.') || 
                     (window.location.hostname === 'localhost' && window.location.pathname.startsWith('/velocity'));
  const routePrefix = isSubdomain ? '' : '/velocity';

  const navigationItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: `€{routePrefix}/dashboard`,
      icon: Home,
    },
    {
      label: 'Live Monitor',
      path: `€{routePrefix}/live`,
      icon: Activity,
      badge: 'Live',
    },
    {
      label: 'AI Agents',
      icon: Bot,
      children: [
        { label: 'Active Agents', path: `€{routePrefix}/agents`, icon: CheckCircle },
        { label: 'Agent Creator', path: `€{routePrefix}/creator`, icon: Package },
        { label: 'Scheduled Tasks', path: `€{routePrefix}/scheduled`, icon: Clock },
        { label: 'Agent Logs', path: `€{routePrefix}/logs`, icon: FileCheck },
      ],
    },
    {
      label: 'Evidence',
      icon: FileCheck,
      children: [
        { label: 'Evidence Review', path: `€{routePrefix}/evidence`, icon: FileCheck },
        { label: 'Validation Queue', path: `€{routePrefix}/validation`, icon: AlertCircle },
        { label: 'Export Center', path: `€{routePrefix}/export`, icon: Package },
      ],
    },
    {
      label: 'Integrations',
      icon: Database,
      children: [
        { label: 'Cloud Platforms', path: `€{routePrefix}/integration`, icon: Cloud },
        { label: 'AWS', path: `€{routePrefix}/integration/aws`, icon: Cloud },
        { label: 'Google Cloud', path: `€{routePrefix}/integration/gcp`, icon: Globe },
        { label: 'Azure', path: `€{routePrefix}/integration/azure`, icon: Cloud },
        { label: 'GitHub', path: `€{routePrefix}/integration/github`, icon: Github },
        { label: 'API Keys', path: `€{routePrefix}/integration/keys`, icon: Key },
      ],
    },
    {
      label: 'Compliance',
      icon: Shield,
      children: [
        { label: 'Trust Score', path: `€{routePrefix}/trust-score`, icon: TrendingUp },
        { label: 'SOC 2', path: `€{routePrefix}/compliance/soc2`, icon: Shield },
        { label: 'ISO 27001', path: `€{routePrefix}/compliance/iso27001`, icon: Shield },
        { label: 'CIS Controls', path: `€{routePrefix}/compliance/cis`, icon: Shield },
        { label: 'GDPR', path: `€{routePrefix}/compliance/gdpr`, icon: Shield },
        { label: 'HIPAA', path: `€{routePrefix}/compliance/hipaa`, icon: Shield },
        { label: 'Custom Frameworks', path: `€{routePrefix}/compliance/custom`, icon: Settings },
      ],
    },
    {
      label: 'Analytics',
      path: `€{routePrefix}/analytics`,
      icon: BarChart3,
    },
    {
      label: 'Workflows',
      path: `€{routePrefix}/workflows`,
      icon: Workflow,
    },
  ];

  const bottomNavigationItems: NavItem[] = [
    {
      label: 'API Reference',
      path: `€{routePrefix}/api`,
      icon: Code2,
    },
    {
      label: 'Documentation',
      path: `€{routePrefix}/docs`,
      icon: BookOpen,
    },
    {
      label: 'Support',
      path: `€{routePrefix}/support`,
      icon: HelpCircle,
    },
    {
      label: 'Team & Billing',
      path: `€{routePrefix}/billing`,
      icon: Users,
    },
    {
      label: 'Settings',
      path: `€{routePrefix}/settings`,
      icon: Settings,
    },
  ];

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.label);
    const isItemActive = item.path ? isActive(item.path) : item.children?.some(child => isActive(child.path));

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleExpanded(item.label)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              isItemActive ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-100',
              depth > 0 && 'ml-4'
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children.map(child => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        to={item.path!}
        className={cn(
          'flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          isActive(item.path) ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-100',
          depth > 0 && 'ml-8'
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon className="w-4 h-4" />
          <span>{item.label}</span>
        </div>
        {item.badge && (
          <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-600 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className={cn('w-64 bg-white border-r border-gray-200 flex flex-col', className)}>
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-200">
        <Link to={`€{routePrefix}/`} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Velocity</h1>
            <p className="text-xs text-gray-500">AI Compliance</p>
          </div>
        </Link>
      </div>

      {/* Trust Score Summary */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Trust Score</span>
            <span className="text-lg font-bold text-purple-600">92</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '92%' }} />
          </div>
          <p className="text-xs text-gray-600 mt-1">+5 points this week</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map(item => renderNavItem(item))}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-gray-200 space-y-1">
        {bottomNavigationItems.map(item => renderNavItem(item))}
      </div>

      {/* User Profile */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">Enterprise Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default VelocitySidebar;