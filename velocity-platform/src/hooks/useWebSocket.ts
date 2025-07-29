import { useCallback, useEffect, useRef, useState } from 'react';

interface UseWebSocketReturn {
  connect: () => void;
  disconnect: () => void;
  send: (data: string) => void;
  lastMessage: MessageEvent | null;
  readyState: number;
  isConnected: boolean;
}

export const useWebSocket = (url: string): UseWebSocketReturn => {
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const [reconnectCount, setReconnectCount] = useState(0);
  const maxReconnectAttempts = 5;

  const isConnected = readyState === WebSocket.OPEN;

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      ws.current = new WebSocket(url);
      
      ws.current.onopen = () => {
        setReadyState(WebSocket.OPEN);
        setReconnectCount(0);
        console.log('WebSocket connected');
      };

      ws.current.onclose = (event) => {
        setReadyState(WebSocket.CLOSED);
        console.log('WebSocket disconnected:', event.code, event.reason);
        
        // Attempt to reconnect if not intentionally closed
        if (event.code !== 1000 && reconnectCount < maxReconnectAttempts) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectCount), 30000);
          console.log(`Attempting to reconnect in ${timeout}ms (attempt ${reconnectCount + 1})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectCount(prev => prev + 1);
            connect();
          }, timeout);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.current.onmessage = (message) => {
        setLastMessage(message);
      };

      setReadyState(WebSocket.CONNECTING);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [url, reconnectCount]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (ws.current) {
      ws.current.close(1000, 'User disconnected');
      ws.current = null;
    }
    
    setReadyState(WebSocket.CLOSED);
    setReconnectCount(0);
  }, []);

  const send = useCallback((data: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    } else {
      console.warn('WebSocket is not connected. Message not sent:', data);
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    send,
    lastMessage,
    readyState,
    isConnected
  };
};