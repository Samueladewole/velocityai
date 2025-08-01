import React, { useState, useEffect } from 'react';
import { useWebSocketEvent } from '@/hooks/useWebSocket';
import { WebSocketMessage } from '@/services/velocity/websocket.service';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Pause,
  Zap,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface AgentStatus {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'error' | 'paused';
  evidence_collected: number;
  last_run?: string;
  execution_time?: number;
  success_rate?: number;
  next_run?: string;
  errors?: string[];
}

interface AgentStatusIndicatorProps {
  agentId: string;
  initialStatus?: AgentStatus;
  className?: string;
  showDetails?: boolean;
}

const AgentStatusIndicator: React.FC<AgentStatusIndicatorProps> = ({
  agentId,
  initialStatus,
  className = "",
  showDetails = true
}) => {
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(initialStatus || null);
  const [isBlinking, setIsBlinking] = useState(false);

  // Listen for agent status updates
  useWebSocketEvent('agent_status_update', (message: WebSocketMessage) => {
    const data = message.data;
    if (data.id === agentId) {
      setAgentStatus({
        id: data.id,
        name: data.name,
        status: data.status,
        evidence_collected: data.evidence_collected || 0,
        last_run: data.last_run,
        execution_time: data.execution_time,
        success_rate: data.success_rate,
        next_run: data.next_run,
        errors: data.errors
      });

      // Trigger blink animation for status changes
      if (data.status === 'running' || data.status === 'completed') {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 2000);
      }
    }
  }, [agentId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'idle':
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'idle':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!agentStatus) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-4 h-4 bg-slate-200 rounded-full animate-pulse" />
        <span className="text-slate-400 text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className={`${className} ${isBlinking ? 'animate-pulse' : ''}`}>
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(agentStatus.status)}`}>
        {getStatusIcon(agentStatus.status)}
        <span className="capitalize">{agentStatus.status}</span>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-slate-600">
          {/* Evidence Count */}
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{agentStatus.evidence_collected} evidence</span>
          </div>

          {/* Success Rate */}
          {agentStatus.success_rate !== undefined && (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>{(agentStatus.success_rate * 100).toFixed(1)}% success</span>
            </div>
          )}

          {/* Last Run */}
          {agentStatus.last_run && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{formatDate(agentStatus.last_run)}</span>
            </div>
          )}

          {/* Execution Time */}
          {agentStatus.execution_time && (
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-purple-500" />
              <span>{formatDuration(agentStatus.execution_time)}</span>
            </div>
          )}

          {/* Next Run */}
          {agentStatus.next_run && (
            <div className="flex items-center gap-2 col-span-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>Next: {formatDate(agentStatus.next_run)}</span>
            </div>
          )}

          {/* Errors */}
          {agentStatus.errors && agentStatus.errors.length > 0 && (
            <div className="col-span-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium text-sm">Execution Errors:</p>
                  <ul className="text-red-700 text-xs mt-1 space-y-1">
                    {agentStatus.errors.slice(0, 3).map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {agentStatus.errors.length > 3 && (
                      <li className="text-red-600">... and {agentStatus.errors.length - 3} more</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentStatusIndicator;