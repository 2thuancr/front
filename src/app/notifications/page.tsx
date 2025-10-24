'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, Info, X, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - trong thực tế sẽ fetch từ API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 1,
        type: 'success',
        title: 'Đơn hàng đã được xác nhận',
        message: 'Đơn hàng #12345 của bạn đã được xác nhận và đang được chuẩn bị.',
        isRead: false,
        createdAt: '2024-01-15T10:30:00Z',
        actionUrl: '/orders/12345'
      },
      {
        id: 2,
        type: 'info',
        title: 'Sản phẩm mới',
        message: 'Áo thun HCMUTE mới đã được thêm vào cửa hàng.',
        isRead: false,
        createdAt: '2024-01-15T09:15:00Z',
        actionUrl: '/products'
      },
      {
        id: 3,
        type: 'warning',
        title: 'Sản phẩm sắp hết hàng',
        message: 'Balo HCMUTE trong danh sách yêu thích của bạn sắp hết hàng.',
        isRead: true,
        createdAt: '2024-01-14T16:45:00Z',
        actionUrl: '/wishlist'
      },
      {
        id: 4,
        type: 'success',
        title: 'Thanh toán thành công',
        message: 'Thanh toán cho đơn hàng #12340 đã được xử lý thành công.',
        isRead: true,
        createdAt: '2024-01-14T14:20:00Z',
        actionUrl: '/orders/12340'
      },
      {
        id: 5,
        type: 'info',
        title: 'Chương trình khuyến mãi',
        message: 'Giảm giá 20% cho tất cả sản phẩm áo thun trong tuần này.',
        isRead: false,
        createdAt: '2024-01-13T11:00:00Z',
        actionUrl: '/products?category=Áo thun'
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 48) return 'Hôm qua';
    return date.toLocaleDateString('vi-VN');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Thông báo</h1>
                <p className="text-gray-600 mt-1">
                  {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả thông báo đã được đọc'}
                </p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'unread', label: 'Chưa đọc' },
                { key: 'read', label: 'Đã đọc' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {label}
                  {key === 'unread' && unreadCount > 0 && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo'}
              </h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? 'Tất cả thông báo đã được đọc' 
                  : 'Chưa có thông báo nào'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  notification.isRead 
                    ? 'bg-white border-gray-200' 
                    : `${getNotificationBgColor(notification.type)} border-l-4`
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-medium ${
                          notification.isRead ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm ${
                        notification.isRead ? 'text-gray-500' : 'text-gray-700'
                      } mb-2`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-gray-400">
                          {formatDate(notification.createdAt)}
                        </span>
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Xem chi tiết
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Đánh dấu đã đọc"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Xóa thông báo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
