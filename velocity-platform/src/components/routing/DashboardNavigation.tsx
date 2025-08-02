import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import {
  HomeIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  ServerStackIcon,
  UserGroupIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  current?: boolean;
  children?: NavigationItem[];
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const DashboardNavigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const navigationSections: NavigationSection[] = [
    {
      title: 'Main',
      items: [
        { name: 'Overview', href: '/dashboard', icon: HomeIcon },
        { name: 'Complete Dashboard', href: '/dashboard/complete', icon: ChartBarIcon },
        { name: 'Ultimate Dashboard', href: '/dashboard/ultimate', icon: ChartBarIcon },
        { name: 'AI Agents', href: '/dashboard/agents', icon: ServerStackIcon },
        { name: 'Integrations', href: '/dashboard/integrations', icon: CogIcon },
        { name: 'Metrics & ROI', href: '/dashboard/metrics', icon: ChartBarIcon },
      ]
    },
    {
      title: 'Compliance',
      items: [
        { name: 'EU Compliance', href: '/dashboard/compliance/eu', icon: ShieldCheckIcon },
        { name: 'GDPR Data Mapping', href: '/dashboard/compliance/gdpr', icon: DocumentTextIcon },
        { name: 'Audit Preparation', href: '/dashboard/compliance/audit', icon: DocumentTextIcon },
        { name: 'SOX Coordination', href: '/dashboard/compliance/sox', icon: ShieldCheckIcon },
        { name: 'Evidence Management', href: '/dashboard/compliance/evidence', icon: DocumentTextIcon },
      ]
    },
    {
      title: 'Industry Solutions',
      items: [
        { name: 'Banking Systems', href: '/dashboard/industry/banking', icon: BuildingOfficeIcon },
        { name: 'Trust & Equity', href: '/dashboard/industry/trust-equity', icon: ShieldCheckIcon },
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'System Status', href: '/dashboard/operations/system', icon: ServerStackIcon },
        { name: 'Executive View', href: '/dashboard/operations/executive', icon: ChartBarIcon },
        { name: 'Operational View', href: '/dashboard/operations/operational', icon: CogIcon },
        { name: 'QIE Learning', href: '/dashboard/operations/qie', icon: DocumentTextIcon },
      ]
    }
  ];

  // Add admin section if user is admin
  if (user?.role === 'admin') {
    navigationSections.push({
      title: 'Administration',
      items: [
        { name: 'System Admin', href: '/dashboard/admin/system', icon: ServerStackIcon },
        { name: 'User Management', href: '/dashboard/admin/users', icon: UserGroupIcon },
        { name: 'System Settings', href: '/dashboard/admin/settings', icon: CogIcon },
      ]
    });
  }

  const isCurrentPath = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? 'bg-white' : 'bg-gray-900'}`}>
      {/* Logo and Close Button */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-lg ${mobile ? 'bg-purple-600' : 'bg-purple-500'} flex items-center justify-center`}>
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className={`ml-2 text-lg font-bold ${mobile ? 'text-gray-900' : 'text-white'}`}>
            Velocity.ai
          </span>
        </div>
        {mobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-6 overflow-y-auto">
        {navigationSections.map((section) => (
          <div key={section.title}>
            <button
              onClick={() => toggleSection(section.title.toLowerCase())}
              className={`w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md ${
                mobile 
                  ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span>{section.title}</span>
              {expandedSections.includes(section.title.toLowerCase()) ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
            
            {expandedSections.includes(section.title.toLowerCase()) && (
              <div className="mt-2 space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => mobile && setSidebarOpen(false)}
                    className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isCurrentPath(item.href)
                        ? mobile
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-gray-800 text-white'
                        : mobile
                          ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isCurrentPath(item.href)
                          ? mobile
                            ? 'text-purple-500'
                            : 'text-gray-300'
                          : mobile
                            ? 'text-gray-400'
                            : 'text-gray-400 group-hover:text-gray-300'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className={`px-4 py-4 border-t ${mobile ? 'border-gray-200' : 'border-gray-700'}`}>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full ${mobile ? 'bg-gray-300' : 'bg-gray-600'} flex items-center justify-center`}>
            <span className={`text-sm font-medium ${mobile ? 'text-gray-700' : 'text-gray-200'}`}>
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="ml-3">
            <p className={`text-sm font-medium ${mobile ? 'text-gray-900' : 'text-white'}`}>
              {user?.name || user?.email}
            </p>
            <p className={`text-xs ${mobile ? 'text-gray-500' : 'text-gray-400'}`}>
              {user?.role || 'User'}
            </p>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <Link
            to="/dashboard/settings"
            className={`block w-full text-left px-2 py-1 text-sm rounded-md ${
              mobile
                ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Settings
          </Link>
          <Link
            to="/dashboard/help"
            className={`block w-full text-left px-2 py-1 text-sm rounded-md ${
              mobile
                ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Help Center
          </Link>
          <button
            onClick={logout}
            className={`mt-2 w-full text-left px-2 py-1 text-sm rounded-md ${
              mobile
                ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-2 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center">
            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className="ml-2 text-lg font-bold text-gray-900">Velocity.ai</span>
          </div>

          <div className="flex items-center space-x-2">
            <NotificationCenter />
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardNavigation;