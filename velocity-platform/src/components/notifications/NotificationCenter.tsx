import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  CogIcon,
  ChartBarIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'agent' | 'compliance' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
}

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    
    // Set up real-time notification listener
    const interval = setInterval(loadNotifications, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      // Mock API call - replace with real API
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'agent',
          title: 'AWS Evidence Collector Completed',
          message: 'Successfully collected 23 new evidence items from your AWS infrastructure.',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          read: false,
          actionUrl: '/dashboard/evidence',
          actionText: 'View Evidence',
          metadata: { agentId: 'aws-collector-1', evidenceCount: 23 }
        },
        {
          id: '2',
          type: 'compliance',
          title: 'GDPR Compliance Score Updated',
          message: 'Your GDPR compliance score has improved to 94%. Great progress!',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          read: false,
          actionUrl: '/dashboard/compliance/gdpr',
          actionText: 'View Report',
          metadata: { framework: 'GDPR', score: 94, previousScore: 89 }
        },
        {
          id: '3',
          type: 'warning',
          title: 'Agent Configuration Issue',
          message: 'Azure Compliance Monitor is experiencing connectivity issues. Please check your configuration.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
          actionUrl: '/dashboard/agents',
          actionText: 'Fix Configuration',
          metadata: { agentId: 'azure-monitor', issue: 'connectivity' }
        },
        {
          id: '4',
          type: 'system',
          title: 'Scheduled Maintenance',
          message: 'System maintenance is scheduled for this weekend from 2-4 AM UTC.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          read: true,
          metadata: { maintenanceWindow: '2-4 AM UTC', date: 'This Weekend' }
        },
        {
          id: '5',
          type: 'success',
          title: 'Integration Completed',
          message: 'GitHub integration has been successfully configured and is now collecting security data.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          read: true,
          actionUrl: '/dashboard/integrations',
          actionText: 'View Integration',
          metadata: { platform: 'GitHub', status: 'active' }
        },
        {
          id: '6',
          type: 'info',
          title: 'Weekly Compliance Report Ready',
          message: 'Your weekly compliance summary report is now available for download.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          read: true,
          actionUrl: '/dashboard/reports',
          actionText: 'Download Report',
          metadata: { reportType: 'weekly', format: 'PDF' }
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Mock API call - replace with real API
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // Mock API call - replace with real API
      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'agent':
        return <CogIcon className="w-5 h-5 text-blue-500" />;
      case 'compliance':
        return <ShieldCheckIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XMarkIcon className="w-5 h-5 text-red-500" />;
      case 'success':
        return <CheckIcon className="w-5 h-5 text-green-500" />;
      case 'system':
        return <ChartBarIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg"
      >
        {unreadCount > 0 ? (
          <BellSolidIcon className="w-6 h-6" />
        ) : (
          <BellIcon className="w-6 h-6" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    disabled={loading}
                    className="text-sm text-purple-600 hover:text-purple-800 disabled:opacity-50"
                  >
                    {loading ? 'Marking...' : 'Mark all read'}
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mt-3">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'agent', label: 'Agents' },
                { key: 'compliance', label: 'Compliance' },
                { key: 'system', label: 'System' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === key
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-purple-600 hover:text-purple-800"
                              title="Mark as read"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-gray-400 hover:text-gray-600"
                            title="Delete notification"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {notification.actionUrl && notification.actionText && (
                        <button
                          onClick={() => {
                            window.location.href = notification.actionUrl!;
                            markAsRead(notification.id);
                            setIsOpen(false);
                          }}
                          className="text-xs text-purple-600 hover:text-purple-800 mt-2 inline-flex items-center"
                        >
                          {notification.actionText} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => {
                  window.location.href = '/dashboard/notifications';
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm text-purple-600 hover:text-purple-800"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;