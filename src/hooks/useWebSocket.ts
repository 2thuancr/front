'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './useAuth';

interface WebSocketMessage {
  type: 'ORDER_STATUS_UPDATE' | 'NEW_ORDER' | 'ORDER_CANCELLED';
  data: {
    orderId: number;
    status: 'NEW' | 'CONFIRMED' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED' | 'CANCELLATION_REQUESTED';
    userId?: number;
    vendorId?: number;
    staffId?: number;
    timestamp: string;
  };
}

interface UseWebSocketOptions {
  onOrderStatusUpdate?: (data: WebSocketMessage['data']) => void;
  onNewOrder?: (data: WebSocketMessage['data']) => void;
  onOrderCancelled?: (data: WebSocketMessage['data']) => void;
  autoConnect?: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { user, token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const {
    onOrderStatusUpdate,
    onNewOrder,
    onOrderCancelled,
    autoConnect = true
  } = options;

  const connect = useCallback(() => {
    if (!token || !user) {
      console.log('🔌 WebSocket: No token or user, skipping connection');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('🔌 WebSocket: Already connected');
      return;
    }

    try {
      // WebSocket URL - adjust based on your backend setup
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'wss://your-backend-domain.com/ws'
        : 'ws://localhost:3001/ws';

      console.log('🔌 WebSocket: Connecting to', wsUrl);
      
      wsRef.current = new WebSocket(`${wsUrl}?token=${token}`);

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket: Connected successfully');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('📨 WebSocket: Received message', message);

          switch (message.type) {
            case 'ORDER_STATUS_UPDATE':
              onOrderStatusUpdate?.(message.data);
              break;
            case 'NEW_ORDER':
              onNewOrder?.(message.data);
              break;
            case 'ORDER_CANCELLED':
              onOrderCancelled?.(message.data);
              break;
            default:
              console.warn('⚠️ WebSocket: Unknown message type', message.type);
          }
        } catch (error) {
          console.error('❌ WebSocket: Error parsing message', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('🔌 WebSocket: Connection closed', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect if not manually closed
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          console.log(`🔄 WebSocket: Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current + 1})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setConnectionError('Failed to reconnect after multiple attempts');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket: Connection error', error);
        setConnectionError('WebSocket connection error');
      };

    } catch (error) {
      console.error('❌ WebSocket: Failed to create connection', error);
      setConnectionError('Failed to create WebSocket connection');
    }
  }, [token, user, onOrderStatusUpdate, onNewOrder, onOrderCancelled]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
    reconnectAttempts.current = 0;
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    console.warn('⚠️ WebSocket: Cannot send message, not connected');
    return false;
  }, []);

  // Auto-connect when component mounts and user is authenticated
  useEffect(() => {
    // Temporarily disable auto-connect until backend WebSocket server is ready
    if (autoConnect && user && token && process.env.NODE_ENV === 'development') {
      console.log('🔌 WebSocket: Auto-connect disabled in development mode');
      // connect(); // Commented out until backend is ready
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, user, token, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    sendMessage
  };
};
