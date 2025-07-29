/**
 * ERIP Sheets WebSocket Client
 * Real-time collaboration client for multi-user spreadsheet editing
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { toast } from '@/components/ui/toast';

export interface WebSocketMessage {
  type: 'user_join' | 'user_leave' | 'cell_update' | 'range_update' | 'cursor_position' | 'selection_change' | 'chart_update' | 'conflict_resolution' | 'sync_request' | 'sync_response' | 'error' | 'heartbeat';
  payload: any;
  user_id: string;
  timestamp: string;
  message_id?: string;
}

export interface UserSession {
  user_id: string;
  email: string;
  cursor_position?: { row: number; column: number };
  selection_range?: { start_row: number; start_column: number; end_row: number; end_column: number };
  last_activity: string;
}

export interface CollaborationState {
  workbook_id: string;
  worksheet_id: string;
  active_users: UserSession[];
  user_cursors: Record<string, any>;
  user_selections: Record<string, any>;
}

interface WebSocketClientProps {
  workbookId: string;
  worksheetId: string;
  userId: string;
  userEmail: string;
  onMessage: (message: WebSocketMessage) => void;
  onUserJoin: (user: UserSession) => void;
  onUserLeave: (userId: string) => void;
  onCellUpdate: (update: any) => void;
  onRangeUpdate: (update: any) => void;
  onCursorMove: (cursor: any) => void;
  onSelectionChange: (selection: any) => void;
  onSyncData: (state: CollaborationState) => void;
  onConnectionStatus: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
}

export const useWebSocketClient = ({
  workbookId,
  worksheetId,
  userId,
  userEmail,
  onMessage,
  onUserJoin,
  onUserLeave,
  onCellUpdate,
  onRangeUpdate,
  onCursorMove,
  onSelectionChange,
  onSyncData,
  onConnectionStatus
}: WebSocketClientProps) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    onConnectionStatus('connecting');
    
    // Build WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NODE_ENV === 'development' ? 'localhost:8001' : window.location.host;
    const wsUrl = `${protocol}//${host}/sheets/workbooks/${workbookId}/worksheets/${worksheetId}/collaborate?user_id=${userId}&email=${encodeURIComponent(userEmail)}`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected for sheets collaboration');
      setIsConnected(true);
      onConnectionStatus('connected');
      reconnectAttempts.current = 0;
      
      // Start heartbeat
      startHeartbeat();
      
      // Request initial sync
      sendMessage({
        type: 'sync_request',
        payload: {},
        user_id: userId,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: 'Connected',
        description: 'Real-time collaboration is now active',
        variant: 'default'
      });
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        // Route message to appropriate handler
        switch (message.type) {
          case 'user_join':
            onUserJoin(message.payload);
            toast({
              title: 'User Joined',
              description: `${message.payload.email} joined the collaboration`,
              variant: 'default'
            });
            break;
            
          case 'user_leave':
            onUserLeave(message.payload.user_id);
            toast({
              title: 'User Left',
              description: `User left the collaboration`,
              variant: 'default'
            });
            break;
            
          case 'cell_update':
            onCellUpdate(message.payload);
            break;
            
          case 'range_update':
            onRangeUpdate(message.payload);
            break;
            
          case 'cursor_position':
            onCursorMove(message.payload);
            break;
            
          case 'selection_change':
            onSelectionChange(message.payload);
            break;
            
          case 'sync_response':
            onSyncData(message.payload);
            break;
            
          case 'conflict_resolution':
            toast({
              title: 'Conflict Resolved',
              description: `Edit conflict resolved using ${message.payload.resolution_strategy}`,
              variant: 'default'
            });
            break;
            
          case 'error':
            toast({
              title: 'Collaboration Error',
              description: message.payload.error,
              variant: 'destructive'
            });
            break;
            
          case 'heartbeat':
            // Heartbeat response, connection is alive
            break;
        }
        
        // Call general message handler
        onMessage(message);
        
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.current.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
      onConnectionStatus('disconnected');
      
      stopHeartbeat();
      
      // Attempt to reconnect if not a normal closure
      if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
        reconnectAttempts.current++;
        
        reconnectTimeout.current = setTimeout(() => {
          console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`);
          connect();
        }, delay);
        
        toast({
          title: 'Connection Lost',
          description: `Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`,
          variant: 'default'
        });
      } else if (reconnectAttempts.current >= maxReconnectAttempts) {
        toast({
          title: 'Connection Failed',
          description: 'Unable to maintain real-time collaboration. Please refresh the page.',
          variant: 'destructive'
        });
        onConnectionStatus('error');
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      onConnectionStatus('error');
    };
  }, [workbookId, worksheetId, userId, userEmail, onMessage, onUserJoin, onUserLeave, onCellUpdate, onRangeUpdate, onCursorMove, onSelectionChange, onSyncData, onConnectionStatus]);

  const startHeartbeat = useCallback(() => {
    stopHeartbeat();
    heartbeatInterval.current = setInterval(() => {
      sendMessage({
        type: 'heartbeat',
        payload: { timestamp: new Date().toISOString() },
        user_id: userId,
        timestamp: new Date().toISOString()
      });
    }, 30000); // 30 second heartbeat
  }, [userId]);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'message_id'>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        ...message,
        message_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      ws.current.send(JSON.stringify(fullMessage));
      return true;
    }
    return false;
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    
    stopHeartbeat();
    
    if (ws.current) {
      ws.current.close(1000, 'User initiated disconnect');
    }
  }, [stopHeartbeat]);

  // API methods for sending specific collaboration events
  const sendCellUpdate = useCallback((row: number, column: number, value: any, formula?: string) => {
    return sendMessage({
      type: 'cell_update',
      payload: { row, column, value, formula },
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage, userId]);

  const sendRangeUpdate = useCallback((range: any, data: any[][]) => {
    return sendMessage({
      type: 'range_update',
      payload: { range, data },
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage, userId]);

  const sendCursorPosition = useCallback((row: number, column: number) => {
    return sendMessage({
      type: 'cursor_position',
      payload: { row, column },
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage, userId]);

  const sendSelectionChange = useCallback((startRow: number, startColumn: number, endRow: number, endColumn: number) => {
    return sendMessage({
      type: 'selection_change',
      payload: { start_row: startRow, start_column: startColumn, end_row: endRow, end_column: endColumn },
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage, userId]);

  const sendChartUpdate = useCallback((chartId: string, action: 'create' | 'update' | 'delete', chartConfig?: any) => {
    return sendMessage({
      type: 'chart_update',
      payload: { chart_id: chartId, action, chart_config: chartConfig },
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage, userId]);

  const requestSync = useCallback(() => {
    return sendMessage({
      type: 'sync_request',
      payload: {},
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage, userId]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connect,
    disconnect,
    sendCellUpdate,
    sendRangeUpdate,
    sendCursorPosition,
    sendSelectionChange,
    sendChartUpdate,
    requestSync,
    sendMessage
  };
};

interface WebSocketClientComponentProps extends WebSocketClientProps {
  children?: React.ReactNode;
}

export const WebSocketClient: React.FC<WebSocketClientComponentProps> = ({ 
  children, 
  ...props 
}) => {
  const client = useWebSocketClient(props);
  
  return (
    <div className="websocket-client">
      {children}
      {/* Connection status indicator */}
      <div className={`fixed bottom-4 right-4 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        client.isConnected 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {client.isConnected ? 'Live' : 'Offline'}
      </div>
    </div>
  );
};