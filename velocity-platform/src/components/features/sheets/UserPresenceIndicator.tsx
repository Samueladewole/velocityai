/**
 * User Presence Indicator for Collaborative Sheets
 * Shows active users in real-time collaboration session
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface UserSession {
  user_id: string;
  email: string;
  cursor_position?: { row: number; column: number };
  selection_range?: { start_row: number; start_column: number; end_row: number; end_column: number };
  last_activity: string;
}

interface UserPresenceIndicatorProps {
  users: UserSession[];
  currentUserId: string;
  maxVisible?: number;
}

export const UserPresenceIndicator: React.FC<UserPresenceIndicatorProps> = ({
  users,
  currentUserId,
  maxVisible = 5
}) => {
  const otherUsers = users.filter(user => user.user_id !== currentUserId);
  const visibleUsers = otherUsers.slice(0, maxVisible);
  const hiddenCount = Math.max(0, otherUsers.length - maxVisible);

  const getUserColor = (userId: string): string => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const index = Array.from(userId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const getUserInitials = (email: string): string => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  if (otherUsers.length === 0) {
    return (
      <div className="flex items-center text-sm text-gray-500">
        <span>No other users online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">
        {otherUsers.length} user{otherUsers.length !== 1 ? 's' : ''} online
      </span>
      
      <div className="flex items-center -space-x-2">
        {visibleUsers.map((user) => (
          <div
            key={user.user_id}
            className="relative group"
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white shadow-sm"
              style={{ backgroundColor: getUserColor(user.user_id) }}
            >
              {getUserInitials(user.email)}
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                <div className="font-medium">{user.email}</div>
                <div className="text-gray-300">
                  Last active: {formatTime(user.last_activity)}
                </div>
                {user.cursor_position && (
                  <div className="text-gray-300">
                    Cell: {String.fromCharCode(65 + user.cursor_position.column)}{user.cursor_position.row + 1}
                  </div>
                )}
              </div>
              <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -mt-1" />
            </div>
          </div>
        ))}
        
        {hiddenCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600 shadow-sm">
            +{hiddenCount}
          </div>
        )}
      </div>
      
      <Badge variant="outline" className="ml-2">
        Live
      </Badge>
    </div>
  );
};