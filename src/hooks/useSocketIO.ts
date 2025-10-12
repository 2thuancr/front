'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

interface SocketIOHookOptions {
  onOrderStatusUpdate?: (data: any) => void;
  onNewOrder?: (data: any) => void;
  onOrderCancelled?: (data: any) => void;
  autoConnect?: boolean;
}

export const useSocketIO = ({
  onOrderStatusUpdate,
  onNewOrder,
  onOrderCancelled,
  autoConnect = true
}: SocketIOHookOptions = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { user, userType, token } = useAuth();
  
  // Stable references for callbacks to prevent re-connections
  const onOrderStatusUpdateRef = useRef(onOrderStatusUpdate);
  const onNewOrderRef = useRef(onNewOrder);
  const onOrderCancelledRef = useRef(onOrderCancelled);
  
  // Update refs when callbacks change
  useEffect(() => {
    onOrderStatusUpdateRef.current = onOrderStatusUpdate;
  }, [onOrderStatusUpdate]);
  
  useEffect(() => {
    onNewOrderRef.current = onNewOrder;
  }, [onNewOrder]);
  
  useEffect(() => {
    onOrderCancelledRef.current = onOrderCancelled;
  }, [onOrderCancelled]);

  const connect = useCallback(() => {
    if (!user || !token) {
      console.warn('SocketIO: User or token not available');
      return;
    }

    // Disconnect existing connection
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    
    console.log('🔌 SocketIO: Connecting to', socketUrl);
    
    socketRef.current = io(socketUrl, {
      query: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    // Connection events
    socketRef.current.on('connect', () => {
      console.log('✅ SocketIO: Connected');
      setIsConnected(true);
      setConnectionError(null);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ SocketIO: Disconnected', reason);
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ SocketIO: Connection error', error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    // Order events
    socketRef.current.on('order_status_update', (data) => {
      console.log('📦 SocketIO: Order status update received', data);
      onOrderStatusUpdateRef.current?.(data);
    });

    socketRef.current.on('new_order', (data) => {
      console.log('🆕 SocketIO: New order received', data);
      onNewOrderRef.current?.(data);
    });

    socketRef.current.on('order_cancelled', (data) => {
      console.log('❌ SocketIO: Order cancelled received', data);
      onOrderCancelledRef.current?.(data);
    });

    // Join room based on user type
    if (userType === 'customer' && user.id) {
      socketRef.current.emit('join_customer_room', { customerId: user.id });
    } else if (userType === 'vendor' && 'vendorId' in user && user.vendorId) {
      socketRef.current.emit('join_vendor_room', { vendorId: user.vendorId });
    } else if (userType === 'staff' && user.id) {
      socketRef.current.emit('join_staff_room', { staffId: user.id });
    }

  }, [user, token, userType]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('🔌 SocketIO: Disconnecting...');
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const sendMessage = useCallback((event: string, data: any) => {
    if (socketRef.current && isConnected) {
      console.log('📤 SocketIO: Sending message', event, data);
      socketRef.current.emit(event, data);
      return true;
    }
    console.warn('⚠️ SocketIO: Cannot send message, not connected');
    return false;
  }, [isConnected]);

  // Auto-connect when component mounts and user is authenticated
  useEffect(() => {
    if (autoConnect && user && token) {
      console.log('🔌 SocketIO: Auto-connecting...');
      connect();
    } else if (!user || !token) {
      console.log('🔌 SocketIO: User or token not available for connection');
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
    socket: socketRef.current,
    isConnected,
    connectionError,
    connect,
    disconnect,
    sendMessage
  };
};

