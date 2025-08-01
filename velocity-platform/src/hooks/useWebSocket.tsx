import { useEffect, useState, useCallback, useRef } from 'react';
import velocityWebSocket, { WebSocketMessage, WebSocketEventType } from '@/services/velocity/websocket.service';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectOnClose?: boolean;
}

interface WebSocketState {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  connectionError: string | null;
  reconnectCount: number;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { autoConnect = true, reconnectOnClose = true } = options;
  
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    lastMessage: null,
    connectionError: null,
    reconnectCount: 0,
  });

  const eventHandlersRef = useRef<Map<WebSocketEventType, Set<(message: WebSocketMessage) => void>>>(
    new Map()
  );

  const connect = useCallback(() => {
    try {
      velocityWebSocket.connect();
    } catch (error) {
      setState(prev => ({
        ...prev,
        connectionError: error instanceof Error ? error.message : 'Connection failed',
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    velocityWebSocket.disconnect();
  }, []);

  const subscribe = useCallback((
    eventType: WebSocketEventType,
    handler: (message: WebSocketMessage) => void
  ) => {
    // Add to our ref for cleanup
    if (!eventHandlersRef.current.has(eventType)) {
      eventHandlersRef.current.set(eventType, new Set());
    }
    eventHandlersRef.current.get(eventType)!.add(handler);

    // Subscribe to the WebSocket service
    const unsubscribe = velocityWebSocket.on(eventType, handler);

    // Return cleanup function
    return () => {
      eventHandlersRef.current.get(eventType)?.delete(handler);
      unsubscribe();
    };
  }, []);

  const sendMessage = useCallback((type: string, data: any) => {
    velocityWebSocket.send(type, data);
  }, []);

  useEffect(() => {
    // Set up connection status listeners
    const handleConnectionEstablished = (message: WebSocketMessage) => {
      setState(prev => ({
        ...prev,
        isConnected: true,
        connectionError: null,
        lastMessage: message,
      }));
    };

    const handleError = (message: WebSocketMessage) => {
      setState(prev => ({
        ...prev,
        connectionError: message.data?.error || 'WebSocket error',
        lastMessage: message,
      }));
    };

    const handleMessage = (message: WebSocketMessage) => {
      setState(prev => ({
        ...prev,
        lastMessage: message,
      }));
    };

    // Subscribe to connection events
    const unsubscribeConnection = velocityWebSocket.on('connection_established', handleConnectionEstablished);
    const unsubscribeError = velocityWebSocket.on('error', handleError);
    
    // Subscribe to all message types for state updates
    const allEventTypes: WebSocketEventType[] = [
      'agent_status_update',
      'evidence_collected',
      'evidence_validated',
      'trust_score_update',
      'integration_status',
    ];

    const unsubscribers = allEventTypes.map(eventType => 
      velocityWebSocket.on(eventType, handleMessage)
    );

    // Auto-connect if enabled
    if (autoConnect) {
      connect();
    }

    // Cleanup function
    return () => {
      // Clean up all subscriptions
      unsubscribeConnection();
      unsubscribeError();
      unsubscribers.forEach(unsub => unsub());
      
      // Clean up all event handlers
      eventHandlersRef.current.clear();
      
      // Disconnect if auto-connected
      if (autoConnect) {
        disconnect();
      }
    };
  }, [autoConnect, connect, disconnect]);

  // Update connection state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const isCurrentlyConnected = velocityWebSocket.isConnected();
      if (isCurrentlyConnected !== state.isConnected) {
        setState(prev => ({
          ...prev,
          isConnected: isCurrentlyConnected,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isConnected]);

  return {
    ...state,
    connect,
    disconnect,
    subscribe,
    sendMessage,
  };
};

// Hook for specific event types
export const useWebSocketEvent = (
  eventType: WebSocketEventType,
  handler: (message: WebSocketMessage) => void,
  deps: React.DependencyList = []
) => {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe(eventType, handler);
    return unsubscribe;
  }, [subscribe, eventType, ...deps]);
};

export default useWebSocket;