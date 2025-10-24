'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock data - trong thực tế sẽ fetch từ API
  useEffect(() => {
    // Simulate unread notifications count
    const mockUnreadCount = 3; // Số thông báo chưa đọc
    setUnreadCount(mockUnreadCount);
  }, []);

  return (
    <Link 
      href="/notifications" 
      className={`relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${className}`}
    >
      <Bell className="h-5 w-5" />
      
      {/* Notification Badge */}
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
};

export default NotificationBell;
