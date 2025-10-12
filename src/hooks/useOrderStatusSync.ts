'use client';

import { useEffect, useCallback } from 'react';
import { useSocketIO } from './useSocketIO';
import { useAuth } from './useAuth';
import { useToastSuccess, useToastError } from '@/components/ui/Toast';

interface OrderStatusUpdate {
  orderId: number;
  status: 'NEW' | 'CONFIRMED' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED' | 'CANCELLATION_REQUESTED';
  userId?: number;
  vendorId?: number;
  staffId?: number;
  timestamp: string;
  oldStatus?: string;
  updatedBy?: number;
  updatedByUsername?: string;
}

interface UseOrderStatusSyncOptions {
  onStatusUpdate?: (update: OrderStatusUpdate) => void;
  showNotifications?: boolean;
}

export const useStaffOrderSync = ({ onStatusUpdate, showNotifications = true }: UseOrderStatusSyncOptions = {}) => {
  const { user, userType } = useAuth();
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const handleOrderStatusUpdate = useCallback((data: OrderStatusUpdate) => {
    console.log('📦 Staff received order status update:', data);
    
    if (showNotifications) {
      const statusText = {
        'NEW': 'Chờ xác nhận',
        'CONFIRMED': 'Đã xác nhận',
        'PREPARING': 'Shop đang chuẩn bị hàng',
        'SHIPPING': 'Đang giao hàng',
        'DELIVERED': 'Đã giao hàng',
        'CANCELLED': 'Đã hủy',
        'CANCELLATION_REQUESTED': 'Yêu cầu hủy'
      }[data.status] || data.status;
      
      toastSuccess(`Đơn hàng #${data.orderId} đã cập nhật: ${statusText}`);
    }

    onStatusUpdate?.(data);
  }, [showNotifications, onStatusUpdate, toastSuccess]);

  const handleNewOrder = useCallback((data: OrderStatusUpdate) => {
    console.log('🆕 Staff received new order:', data);
    
    if (showNotifications) {
      toastSuccess(`Đơn hàng mới #${data.orderId} từ khách hàng`);
    }

    onStatusUpdate?.(data);
  }, [showNotifications, onStatusUpdate, toastSuccess]);

  const handleOrderCancelled = useCallback((data: OrderStatusUpdate) => {
    console.log('❌ Staff received order cancellation:', data);
    
    if (showNotifications) {
      toastError(`Đơn hàng #${data.orderId} đã bị hủy`);
    }

    onStatusUpdate?.(data);
  }, [showNotifications, onStatusUpdate, toastError]);

  const { isConnected, connectionError } = useSocketIO({
    onOrderStatusUpdate: handleOrderStatusUpdate,
    onNewOrder: handleNewOrder,
    onOrderCancelled: handleOrderCancelled,
    autoConnect: true // Enable real-time sync
  });

  return {
    isConnected,
    connectionError
  };
};

export const useVendorOrderSync = ({ onStatusUpdate, showNotifications = true }: UseOrderStatusSyncOptions = {}) => {
  const { user, userType } = useAuth();
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const handleOrderStatusUpdate = useCallback((data: OrderStatusUpdate) => {
    console.log('📦 Vendor received order status update:', data);
    
    if (showNotifications) {
      const statusText = {
        'NEW': 'Chờ xác nhận',
        'CONFIRMED': 'Đã xác nhận',
        'PREPARING': 'Shop đang chuẩn bị hàng',
        'SHIPPING': 'Đang giao hàng',
        'DELIVERED': 'Đã giao hàng',
        'CANCELLED': 'Đã hủy',
        'CANCELLATION_REQUESTED': 'Yêu cầu hủy'
      }[data.status] || data.status;
      
      toastSuccess(`Đơn hàng #${data.orderId} đã cập nhật: ${statusText}`);
    }

    onStatusUpdate?.(data);
  }, [showNotifications, onStatusUpdate, toastSuccess]);

  const handleNewOrder = useCallback((data: OrderStatusUpdate) => {
    console.log('🆕 Vendor received new order:', data);
    
    if (showNotifications) {
      toastSuccess(`Đơn hàng mới #${data.orderId} từ khách hàng`);
    }

    onStatusUpdate?.(data);
  }, [showNotifications, onStatusUpdate, toastSuccess]);

  const handleOrderCancelled = useCallback((data: OrderStatusUpdate) => {
    console.log('❌ Vendor received order cancellation:', data);
    
    if (showNotifications) {
      toastError(`Đơn hàng #${data.orderId} đã bị hủy`);
    }

    onStatusUpdate?.(data);
  }, [showNotifications, onStatusUpdate, toastError]);

  const { isConnected, connectionError } = useSocketIO({
    onOrderStatusUpdate: handleOrderStatusUpdate,
    onNewOrder: handleNewOrder,
    onOrderCancelled: handleOrderCancelled,
    autoConnect: true // Enable real-time sync
  });

  return {
    isConnected,
    connectionError
  };
};

export const useCustomerOrderSync = ({ onStatusUpdate, showNotifications = true }: UseOrderStatusSyncOptions = {}) => {
  const { user, userType } = useAuth();
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const handleOrderStatusUpdate = useCallback((data: OrderStatusUpdate) => {
    console.log('📦 Customer received order status update:', data);
    
    if (showNotifications) {
      const statusText = {
        'NEW': 'Chờ xác nhận',
        'CONFIRMED': 'Đã xác nhận',
        'PREPARING': 'Shop đang chuẩn bị hàng',
        'SHIPPING': 'Đang giao hàng',
        'DELIVERED': 'Đã giao hàng',
        'CANCELLED': 'Đã hủy',
        'CANCELLATION_REQUESTED': 'Yêu cầu hủy'
      }[data.status] || data.status;
      
      toastSuccess(`Đơn hàng #${data.orderId} đã cập nhật: ${statusText}`);
    }

    onStatusUpdate?.(data);
  }, [showNotifications, onStatusUpdate, toastSuccess]);

  const handleNewOrder = useCallback((data: OrderStatusUpdate) => {
    console.log('🆕 Customer received new order:', data);
    
    if (showNotifications) {
      toastSuccess(`Đơn hàng #${data.orderId} đã được tạo thành công`);
    }

    onStatusUpdate?.(data);
  }, [showNotifications, onStatusUpdate, toastSuccess]);

  const handleOrderCancelled = useCallback((data: OrderStatusUpdate) => {
    console.log('❌ Customer received order cancellation:', data);
    console.log('❌ Customer cancellation details:', {
      orderId: data.orderId,
      status: data.status,
      userId: data.userId,
      timestamp: data.timestamp,
      updatedBy: data.updatedBy
    });
    
    if (showNotifications) {
      toastError(`Đơn hàng #${data.orderId} đã bị hủy`);
    }

    onStatusUpdate?.(data);
  }, [showNotifications, onStatusUpdate, toastError]);

  const { isConnected, connectionError } = useSocketIO({
    onOrderStatusUpdate: handleOrderStatusUpdate,
    onNewOrder: handleNewOrder,
    onOrderCancelled: handleOrderCancelled,
    autoConnect: true // Enable real-time sync
  });

  return {
    isConnected,
    connectionError
  };
};