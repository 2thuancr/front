'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerOrderSync } from '@/hooks/useOrderStatusSync';
import axios from 'axios';

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  orderId?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: number) => void;
  isConnected: boolean;
  connectionError: string | null;
  isLoading: boolean;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nextId, setNextId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // API base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Function to translate order status messages
  const translateOrderStatusMessage = (message: string, orderId: number): string => {
    // Extract status from English message
    const statusMap: Record<string, string> = {
      'NEW': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'PREPARING': 'Shop đang chuẩn bị hàng',
      'SHIPPING': 'Đang giao hàng',
      'DELIVERED': 'Đã giao hàng',
      'CANCELLED': 'Đã hủy',
      'CANCELLATION_REQUESTED': 'Yêu cầu hủy'
    };

    // Try multiple patterns to extract status
    let translatedMessage = message;
    
    // Pattern 1: "trạng thái: PREPARING" -> "trạng thái: Shop đang chuẩn bị hàng"
    for (const [englishStatus, vietnameseStatus] of Object.entries(statusMap)) {
      const regex = new RegExp(`trạng thái: ${englishStatus}`, 'gi');
      translatedMessage = translatedMessage.replace(regex, `trạng thái: ${vietnameseStatus}`);
    }
    
    // Pattern 2: "status: PREPARING" -> "trạng thái: Shop đang chuẩn bị hàng"
    for (const [englishStatus, vietnameseStatus] of Object.entries(statusMap)) {
      const regex = new RegExp(`status: ${englishStatus}`, 'gi');
      translatedMessage = translatedMessage.replace(regex, `trạng thái: ${vietnameseStatus}`);
    }
    
    // Pattern 3: Just the status word at the end
    for (const [englishStatus, vietnameseStatus] of Object.entries(statusMap)) {
      const regex = new RegExp(`\\b${englishStatus}\\b`, 'gi');
      translatedMessage = translatedMessage.replace(regex, vietnameseStatus);
    }

    return translatedMessage;
  };

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!user || !token) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: 1,
          limit: 50,
          filter: 'all'
        }
      });

      if (response.data && response.data.notifications) {
        const fetchedNotifications = response.data.notifications.map((notification: any) => ({
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
          actionUrl: notification.actionUrl,
          orderId: notification.orderId
        }));

        // Translate English notifications to Vietnamese if needed
        const translatedNotifications = fetchedNotifications.map((notification: Notification) => {
          let translatedTitle = notification.title;
          let translatedMessage = notification.message;
          
          // Check if this is an order status notification that needs translation
          if (notification.orderId) {
            // Always translate order notifications
            translatedTitle = `Cập nhật đơn hàng #${notification.orderId}`;
            translatedMessage = translateOrderStatusMessage(notification.message, notification.orderId);
          }
          
          // Check for other common English patterns
          if (translatedTitle.includes('Payment') || translatedTitle.includes('payment')) {
            translatedTitle = translatedTitle.replace(/Payment/i, 'Thanh toán');
            translatedMessage = translatedMessage.replace(/payment/i, 'thanh toán');
          }
          
          if (translatedTitle.includes('Product') || translatedTitle.includes('product')) {
            translatedTitle = translatedTitle.replace(/Product/i, 'Sản phẩm');
            translatedMessage = translatedMessage.replace(/product/i, 'sản phẩm');
          }
          
          return {
            ...notification,
            title: translatedTitle,
            message: translatedMessage
          };
        });

        setNotifications(translatedNotifications);
        
        // Set nextId to be higher than the highest existing ID
        const maxId = Math.max(...translatedNotifications.map((n: Notification) => n.id), 0);
        setNextId(maxId + 1);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to localStorage if API fails
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          setNotifications(parsed);
          const maxId = Math.max(...parsed.map((n: Notification) => n.id), 0);
          setNextId(maxId + 1);
        } catch (parseError) {
          console.error('Error parsing saved notifications:', parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, token, API_BASE]);

  // Real-time order status sync for notifications
  const { isConnected, connectionError } = useCustomerOrderSync({
    onStatusUpdate: (update) => {
      // Create new notification for order status update
      const statusText = {
        'NEW': 'Chờ xác nhận',
        'CONFIRMED': 'Đã xác nhận',
        'PREPARING': 'Shop đang chuẩn bị hàng',
        'SHIPPING': 'Đang giao hàng',
        'DELIVERED': 'Đã giao hàng',
        'CANCELLED': 'Đã hủy',
        'CANCELLATION_REQUESTED': 'Yêu cầu hủy'
      }[update.status] || update.status;

      const notificationType = update.status === 'CANCELLED' ? 'error' : 
                              update.status === 'DELIVERED' ? 'success' : 'info';

      const newNotification: Omit<Notification, 'id'> = {
        type: notificationType,
        title: `Đơn hàng #${update.orderId} đã cập nhật`,
        message: `Trạng thái đơn hàng #${update.orderId} đã thay đổi thành: ${statusText}`,
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: `/orders/${update.orderId}`,
        orderId: update.orderId
      };

      addNotification(newNotification);
    },
    showNotifications: false // Disable toast notifications since we're handling them here
  });

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: nextId
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setNextId(prev => prev + 1);
  }, [nextId]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      // Update on server
      await axios.put(`${API_BASE}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Fallback to local update
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );
    }
  }, [token, API_BASE]);

  const markAllAsRead = useCallback(async () => {
    try {
      // Update on server
      await axios.put(`${API_BASE}/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Fallback to local update
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    }
  }, [token, API_BASE]);

  const deleteNotification = useCallback(async (id: number) => {
    try {
      // Delete on server
      await axios.delete(`${API_BASE}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Fallback to local update
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }
  }, [token, API_BASE]);

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Load notifications from API on mount
  useEffect(() => {
    if (user && token) {
      fetchNotifications();
    }
  }, [user, token, fetchNotifications]);

  // Save notifications to localStorage whenever they change (as backup)
  useEffect(() => {
    if (typeof window !== 'undefined' && notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isConnected,
    connectionError,
    isLoading,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
