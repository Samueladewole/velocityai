import React, { useState, useEffect } from 'react';
import { useWebSocketEvent } from '@/hooks/useWebSocket';
import { WebSocketMessage } from '@/services/velocity/websocket.service';
import { 
  CheckCircle,
  FileText,
  Zap,
  TrendingUp,
  X,
  ExternalLink
} from 'lucide-react';

interface EvidenceNotification {
  id: string;
  title: string;
  evidence_type: string;
  framework: string;
  control_id: string;
  trust_points: number;
  agent_name: string;
  confidence_score: number;
  timestamp: string;
  seen?: boolean;
}

interface EvidenceNotificationsProps {
  maxNotifications?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
  className?: string;
}

const EvidenceNotifications: React.FC<EvidenceNotificationsProps> = ({
  maxNotifications = 5,
  autoHide = true,
  autoHideDelay = 8000,
  className = ""
}) => {
  const [notifications, setNotifications] = useState<EvidenceNotification[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Listen for new evidence collection events
  useWebSocketEvent('evidence_collected', (message: WebSocketMessage) => {
    const data = message.data;
    const newNotification: EvidenceNotification = {
      id: data.id,
      title: data.title,
      evidence_type: data.evidence_type,
      framework: data.framework,
      control_id: data.control_id,
      trust_points: data.trust_points,
      agent_name: data.agent_name,
      confidence_score: data.confidence_score,
      timestamp: data.timestamp || message.timestamp,
      seen: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Keep only the latest notifications
      return updated.slice(0, maxNotifications);
    });

    // Auto-hide notification after delay
    if (autoHide) {
      setTimeout(() => {
        setNotifications(prev => 
          prev.map(n => n.id === newNotification.id ? { ...n, seen: true } : n)
        );
      }, autoHideDelay);
    }
  }, [maxNotifications, autoHide, autoHideDelay]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsSeen = () => {
    setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
  };

  const getFrameworkColor = (framework: string) => {
    switch (framework.toLowerCase()) {
      case 'soc2':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'iso27001':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'gdpr':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hipaa':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getTrustPointsColor = (points: number) => {
    if (points >= 20) return 'text-green-600';
    if (points >= 15) return 'text-blue-600';
    if (points >= 10) return 'text-amber-600';
    return 'text-slate-600';
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 10) return 'Just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    return `${Math.floor(diffSeconds / 3600)}h ago`;
  };

  // Filter out seen notifications if auto-hide is enabled
  const visibleNotifications = autoHide 
    ? notifications.filter(n => !n.seen)
    : notifications;

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 space-y-2 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-slate-700">
            New Evidence ({visibleNotifications.length})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={markAllAsSeen}
            className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100"
          >
            Mark all as seen
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {visibleNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white border border-slate-200 rounded-lg shadow-sm p-3 transition-all duration-300 ${
              !notification.seen ? 'ring-2 ring-green-100 animate-pulse' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-800 truncate">
                    {notification.title}
                  </span>
                </div>

                {/* Agent and Framework */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-600">by {notification.agent_name}</span>
                  <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${getFrameworkColor(notification.framework)}`}>
                    {notification.framework}
                  </span>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span className={`font-medium ${getTrustPointsColor(notification.trust_points)}`}>
                      +{notification.trust_points} points
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{(notification.confidence_score * 100).toFixed(0)}% confidence</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{notification.control_id}</span>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="mt-2 text-xs text-slate-500">
                  {formatTimeAgo(notification.timestamp)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => {
                    // Navigate to evidence details
                    window.open(`/app/platform/evidence?id=${notification.id}`, '_blank');
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
                  title="View evidence"
                >
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
                  title="Dismiss"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvidenceNotifications;