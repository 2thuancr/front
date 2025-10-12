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
    
    // Generate unique tab ID for Socket.IO connection
    const tabId = sessionStorage.getItem('tabId') || `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('tabId', tabId);
    
    socketRef.current = io(socketUrl, {
      query: { token, tabId }, // Include tabId to distinguish connections
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    // Connection events
    socketRef.current.on('connect', () => {
      console.log('✅ SocketIO: Connected');
      console.log('🔌 SocketIO: Socket ID:', socketRef.current?.id);
      console.log('🔌 SocketIO: Tab ID:', tabId);
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

    // Order events - Listen to multiple possible event names
    socketRef.current.on('order_status_update', (data) => {
      console.log('📦 SocketIO: Order status update received', data);
      console.log('📦 SocketIO: Event details:', {
        orderId: data.orderId,
        oldStatus: data.oldStatus,
        newStatus: data.newStatus,
        updatedBy: data.updatedBy,
        timestamp: data.timestamp
      });
      
      // Transform backend data structure to frontend expected structure
      const transformedData = {
        orderId: data.orderId,
        status: data.newStatus, // Use newStatus as status
        userId: data.userId,
        vendorId: data.vendorId,
        staffId: data.staffId,
        timestamp: data.timestamp,
        oldStatus: data.oldStatus,
        updatedBy: data.updatedBy,
        updatedByUsername: data.updatedByUsername
      };
      
      console.log('📦 SocketIO: Transformed data:', transformedData);
      onOrderStatusUpdateRef.current?.(transformedData);
    });

    // Alternative event names that backend might use
    socketRef.current.on('orderStatusUpdate', (data) => {
      console.log('📦 SocketIO: orderStatusUpdate received', data);
      const transformedData = {
        orderId: data.orderId,
        status: data.newStatus || data.status,
        userId: data.userId,
        vendorId: data.vendorId,
        staffId: data.staffId,
        timestamp: data.timestamp,
        oldStatus: data.oldStatus,
        updatedBy: data.updatedBy,
        updatedByUsername: data.updatedByUsername
      };
      onOrderStatusUpdateRef.current?.(transformedData);
    });

    socketRef.current.on('order_updated', (data) => {
      console.log('📦 SocketIO: order_updated received', data);
      const transformedData = {
        orderId: data.orderId,
        status: data.newStatus || data.status,
        userId: data.userId,
        vendorId: data.vendorId,
        staffId: data.staffId,
        timestamp: data.timestamp,
        oldStatus: data.oldStatus,
        updatedBy: data.updatedBy,
        updatedByUsername: data.updatedByUsername
      };
      onOrderStatusUpdateRef.current?.(transformedData);
    });

    socketRef.current.on('orderUpdated', (data) => {
      console.log('📦 SocketIO: orderUpdated received', data);
      const transformedData = {
        orderId: data.orderId,
        status: data.newStatus || data.status,
        userId: data.userId,
        vendorId: data.vendorId,
        staffId: data.staffId,
        timestamp: data.timestamp,
        oldStatus: data.oldStatus,
        updatedBy: data.updatedBy,
        updatedByUsername: data.updatedByUsername
      };
      onOrderStatusUpdateRef.current?.(transformedData);
    });

    socketRef.current.on('status_changed', (data) => {
      console.log('📦 SocketIO: status_changed received', data);
      const transformedData = {
        orderId: data.orderId,
        status: data.newStatus || data.status,
        userId: data.userId,
        vendorId: data.vendorId,
        staffId: data.staffId,
        timestamp: data.timestamp,
        oldStatus: data.oldStatus,
        updatedBy: data.updatedBy,
        updatedByUsername: data.updatedByUsername
      };
      onOrderStatusUpdateRef.current?.(transformedData);
    });

    socketRef.current.on('statusChanged', (data) => {
      console.log('📦 SocketIO: statusChanged received', data);
      const transformedData = {
        orderId: data.orderId,
        status: data.newStatus || data.status,
        userId: data.userId,
        vendorId: data.vendorId,
        staffId: data.staffId,
        timestamp: data.timestamp,
        oldStatus: data.oldStatus,
        updatedBy: data.updatedBy,
        updatedByUsername: data.updatedByUsername
      };
      onOrderStatusUpdateRef.current?.(transformedData);
    });

    socketRef.current.on('new_order', (data) => {
      console.log('🆕 SocketIO: New order received', data);
      onNewOrderRef.current?.(data);
    });

    socketRef.current.on('order_cancelled', (data) => {
      console.log('❌ SocketIO: Order cancelled received', data);
      console.log('❌ SocketIO: Order cancellation details:', {
        orderId: data.orderId,
        userId: data.userId,
        status: data.status,
        timestamp: data.timestamp,
        reason: data.reason
      });
      
      // Transform to match OrderStatusUpdate interface
      const transformedData = {
        orderId: data.orderId,
        status: data.status || 'CANCELLED',
        userId: data.userId,
        vendorId: data.vendorId,
        staffId: data.staffId,
        timestamp: data.timestamp,
        oldStatus: data.oldStatus,
        updatedBy: data.updatedBy,
        updatedByUsername: data.updatedByUsername
      };
      
      console.log('❌ SocketIO: Transformed cancellation data:', transformedData);
      onOrderCancelledRef.current?.(transformedData);
    });

    // Listen to all events for debugging
    socketRef.current.onAny((eventName, ...args) => {
      console.log('🔍 SocketIO: Received event:', eventName, args);
    });

    // Join room based on user type
    if (userType === 'customer' && 'id' in user && user.id) {
      console.log('🔌 SocketIO: Joining customer room', { customerId: user.id });
      socketRef.current.emit('join_customer_room', { customerId: user.id });
      socketRef.current.emit('join_room', { room: `customer_${user.id}`, userId: user.id });
      socketRef.current.emit('join_user_room', { userId: user.id }); // Backend broadcasts to user room
    } else if (userType === 'vendor' && 'vendorId' in user && user.vendorId) {
      console.log('🔌 SocketIO: Joining vendor room', { vendorId: user.vendorId });
      socketRef.current.emit('join_vendor_room', { vendorId: user.vendorId });
      if ('id' in user) {
        socketRef.current.emit('join_room', { room: `vendor_${user.vendorId}`, userId: user.id });
        socketRef.current.emit('join_user_room', { userId: user.id });
      }
    } else if (userType === 'staff' && 'id' in user && user.id) {
      console.log('🔌 SocketIO: Joining staff room', { staffId: user.id });
      socketRef.current.emit('join_staff_room', { staffId: user.id });
      socketRef.current.emit('join_room', { room: `staff_${user.id}`, userId: user.id });
      socketRef.current.emit('join_user_room', { userId: user.id });
    }

    // Listen for room join confirmations
    socketRef.current.on('room_joined', (data) => {
      console.log('🔌 SocketIO: Room joined successfully', data);
    });

    socketRef.current.on('joined_room', (data) => {
      console.log('🔌 SocketIO: Joined room', data);
    });

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

