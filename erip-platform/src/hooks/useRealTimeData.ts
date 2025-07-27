/**
 * Real-time Data Hook for Component Page Template
 * Provides WebSocket connectivity and data streaming capabilities
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { RealTimeConfig } from '@/types/componentTemplate';

interface RealTimeState {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastUpdate: Date | null;
  error: string | null;
  data: any;
  metrics: {
    messagesReceived: number;
    messagesSent: number;
    averageLatency: number;
    connectionUptime: number;
  };
}

interface UseRealTimeDataOptions extends RealTimeConfig {
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  heartbeatInterval?: number;
  messageQueue?: boolean;
  dataTransform?: (data: any) => any;
}

interface UseRealTimeDataReturn {
  state: RealTimeState;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: any) => boolean;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  clearData: () => void;
  getConnectionUptime: () => number;
}

export const useRealTimeData = (options: UseRealTimeDataOptions): UseRealTimeDataReturn => {
  const {
    enabled = false,
    websocketUrl,
    refreshInterval = 30000,
    connectionIndicator = true,
    onConnectionChange,
    onDataUpdate,
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectDelay = 1000,
    heartbeatInterval = 30000,
    messageQueue = true,
    dataTransform
  } = options;

  const [state, setState] = useState<RealTimeState>({
    isConnected: false,
    connectionStatus: 'disconnected',
    lastUpdate: null,
    error: null,
    data: null,
    metrics: {
      messagesReceived: 0,
      messagesSent: 0,
      averageLatency: 0,
      connectionUptime: 0
    }
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<any[]>([]);
  const connectionStartTimeRef = useRef<Date | null>(null);
  const latencyMeasurementsRef = useRef<number[]>([]);
  const reconnectCountRef = useRef(0);
  const subscriptionsRef = useRef<Set<string>>(new Set());

  // Connection management
  const connect = useCallback(() => {
    if (!enabled) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    setState(prev => ({ ...prev, connectionStatus: 'connecting', error: null }));
    
    if (websocketUrl) {
      // WebSocket connection
      try {
        wsRef.current = new WebSocket(websocketUrl);
        connectionStartTimeRef.current = new Date();

        wsRef.current.onopen = () => {
          setState(prev => ({ 
            ...prev, 
            isConnected: true, 
            connectionStatus: 'connected',
            error: null 
          }));
          
          reconnectCountRef.current = 0;
          onConnectionChange?.('connected');
          
          // Send queued messages
          if (messageQueue && messageQueueRef.current.length > 0) {
            messageQueueRef.current.forEach(message => {
              wsRef.current?.send(JSON.stringify(message));
            });
            messageQueueRef.current = [];
          }

          // Start heartbeat
          startHeartbeat();

          // Subscribe to channels
          subscriptionsRef.current.forEach(channel => {
            sendMessage({ type: 'subscribe', channel });
          });
        };

        wsRef.current.onmessage = (event) => {
          const now = new Date();
          let data;
          
          try {
            data = JSON.parse(event.data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
            return;
          }

          // Handle heartbeat response
          if (data.type === 'pong') {
            const latency = now.getTime() - data.timestamp;
            latencyMeasurementsRef.current.push(latency);
            if (latencyMeasurementsRef.current.length > 10) {
              latencyMeasurementsRef.current.shift();
            }
            return;
          }

          // Transform data if transformer provided
          const transformedData = dataTransform ? dataTransform(data) : data;

          setState(prev => ({
            ...prev,
            data: transformedData,
            lastUpdate: now,
            metrics: {
              ...prev.metrics,
              messagesReceived: prev.metrics.messagesReceived + 1,
              averageLatency: latencyMeasurementsRef.current.length > 0 
                ? latencyMeasurementsRef.current.reduce((a, b) => a + b, 0) / latencyMeasurementsRef.current.length
                : 0
            }
          }));

          onDataUpdate?.(transformedData, 'websocket');
        };

        wsRef.current.onclose = (event) => {
          setState(prev => ({ 
            ...prev, 
            isConnected: false, 
            connectionStatus: 'disconnected' 
          }));
          
          connectionStartTimeRef.current = null;
          onConnectionChange?.('disconnected');
          stopHeartbeat();

          // Attempt reconnection if not intentional
          if (event.code !== 1000 && reconnectCountRef.current < reconnectAttempts) {
            scheduleReconnect();
          }
        };

        wsRef.current.onerror = () => {
          setState(prev => ({ 
            ...prev, 
            connectionStatus: 'error',
            error: 'WebSocket connection failed'
          }));
          onConnectionChange?.('error');
        };

      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          connectionStatus: 'error',
          error: `Connection failed: ${error}`
        }));
        onConnectionChange?.('error');
      }
    } else {
      // Fallback to polling
      startPolling();
    }
  }, [enabled, websocketUrl, onConnectionChange, onDataUpdate, dataTransform, messageQueue, reconnectAttempts]);

  const disconnect = useCallback(() => {
    // Clean up WebSocket
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }

    // Clean up timeouts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }

    stopHeartbeat();

    setState(prev => ({ 
      ...prev, 
      isConnected: false, 
      connectionStatus: 'disconnected',
      error: null 
    }));

    connectionStartTimeRef.current = null;
    reconnectCountRef.current = 0;
  }, []);

  const sendMessage = useCallback((message: any): boolean => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
        setState(prev => ({
          ...prev,
          metrics: {
            ...prev.metrics,
            messagesSent: prev.metrics.messagesSent + 1
          }
        }));
        return true;
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        return false;
      }
    } else if (messageQueue) {
      // Queue message for later sending
      messageQueueRef.current.push(message);
      return true;
    }
    return false;
  }, [messageQueue]);

  const subscribe = useCallback((channel: string) => {
    subscriptionsRef.current.add(channel);
    if (state.isConnected) {
      sendMessage({ type: 'subscribe', channel });
    }
  }, [state.isConnected, sendMessage]);

  const unsubscribe = useCallback((channel: string) => {
    subscriptionsRef.current.delete(channel);
    if (state.isConnected) {
      sendMessage({ type: 'unsubscribe', channel });
    }
  }, [state.isConnected, sendMessage]);

  const clearData = useCallback(() => {
    setState(prev => ({ ...prev, data: null, lastUpdate: null }));
  }, []);

  const getConnectionUptime = useCallback((): number => {
    if (!connectionStartTimeRef.current) return 0;
    return Date.now() - connectionStartTimeRef.current.getTime();
  }, []);

  // Helper functions
  const scheduleReconnect = useCallback(() => {
    reconnectCountRef.current++;
    const delay = reconnectDelay * Math.pow(2, reconnectCountRef.current - 1); // Exponential backoff
    
    reconnectTimeoutRef.current = setTimeout(() => {
      if (reconnectCountRef.current <= reconnectAttempts) {
        connect();
      } else {
        setState(prev => ({ 
          ...prev, 
          error: `Failed to reconnect after ${reconnectAttempts} attempts` 
        }));
      }
    }, delay);
  }, [connect, reconnectDelay, reconnectAttempts]);

  const startHeartbeat = useCallback(() => {
    if (!heartbeatInterval) return;
    
    heartbeatTimeoutRef.current = setInterval(() => {
      sendMessage({ type: 'ping', timestamp: Date.now() });
    }, heartbeatInterval);
  }, [heartbeatInterval, sendMessage]);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    const poll = async () => {
      try {
        setState(prev => ({ ...prev, connectionStatus: 'connecting' }));
        
        // This would be replaced with actual API call
        const response = await fetch('/api/real-time-data');
        const data = await response.json();
        
        const transformedData = dataTransform ? dataTransform(data) : data;
        
        setState(prev => ({
          ...prev,
          data: transformedData,
          lastUpdate: new Date(),
          isConnected: true,
          connectionStatus: 'connected',
          error: null
        }));

        onDataUpdate?.(transformedData, 'poll');
        
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          connectionStatus: 'error',
          error: `Polling failed: ${error}`
        }));
      }

      // Schedule next poll
      pollTimeoutRef.current = setTimeout(poll, refreshInterval);
    };

    poll();
  }, [refreshInterval, onDataUpdate, dataTransform]);

  // Update connection uptime
  useEffect(() => {
    if (!state.isConnected) return;

    const uptimeInterval = setInterval(() => {
      setState(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          connectionUptime: getConnectionUptime()
        }
      }));
    }, 1000);

    return () => clearInterval(uptimeInterval);
  }, [state.isConnected, getConnectionUptime]);

  // Auto-connect on mount
  useEffect(() => {
    if (enabled && autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, autoConnect, connect, disconnect]);

  return {
    state,
    connect,
    disconnect,
    sendMessage,
    subscribe,
    unsubscribe,
    clearData,
    getConnectionUptime
  };
};

export default useRealTimeData;