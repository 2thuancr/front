'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, Package, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface UserDropdownProps {
  className?: string;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Debug logging
  console.log('🎯 UserDropdown render:', { 
    user, 
    hasUser: !!user,
    userFirstName: user?.firstName,
    userLastName: user?.lastName,
    userEmail: user?.email
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserDisplayName = () => {
    // Always prioritize Redux state if available
    if (user && (user.firstName || user.lastName || user.email)) {
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      }
      if (user.email) {
        return user.email.split('@')[0];
      }
    }
    
    // Only fallback to localStorage if Redux state is completely empty
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const localUser = JSON.parse(userData);
          if (localUser.firstName && localUser.lastName) {
            return `${localUser.firstName} ${localUser.lastName}`;
          }
          if (localUser.email) {
            return localUser.email.split('@')[0];
          }
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      }
    }
    
    return 'User';
  };

  const getUserInitials = () => {
    // Always prioritize Redux state if available
    if (user && (user.firstName || user.lastName || user.email)) {
      if (user.firstName && user.lastName) {
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
      }
      if (user.email) {
        return user.email.charAt(0).toUpperCase();
      }
    }
    
    // Only fallback to localStorage if Redux state is completely empty
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const localUser = JSON.parse(userData);
          if (localUser.firstName && localUser.lastName) {
            return `${localUser.firstName.charAt(0)}${localUser.lastName.charAt(0)}`.toUpperCase();
          }
          if (localUser.email) {
            return localUser.email.charAt(0).toUpperCase();
          }
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      }
    }
    
    return 'U';
  };

  const menuItems = [
    {
      icon: User,
      label: 'Hồ sơ cá nhân',
      href: '/profile',
      onClick: () => setIsOpen(false),
    },
    {
      icon: Package,
      label: 'Đơn hàng của tôi',
      href: '/orders',
      onClick: () => setIsOpen(false),
    },
    {
      icon: Settings,
      label: 'Cài đặt',
      href: '/settings',
      onClick: () => setIsOpen(false),
    },
  ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {getUserInitials()}
        </div>
        
        {/* User Name (Desktop only) */}
        <span className="hidden lg:block text-sm font-medium">
          {getUserDisplayName()}
        </span>
        
        {/* Dropdown Arrow */}
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {getUserInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getUserDisplayName()}
                  </p>
                                     <p className="text-xs text-gray-500 truncate">
                     {(() => {
                       // Always prioritize Redux state if available
                       if (user?.email) return user.email;
                       
                       // Only fallback to localStorage if Redux state is empty
                       if (typeof window !== 'undefined') {
                         try {
                           const userData = localStorage.getItem('user');
                           if (userData) {
                             const localUser = JSON.parse(userData);
                             return localUser.email || 'user@example.com';
                           }
                         } catch (error) {
                           console.error('Error parsing user email:', error);
                         }
                       }
                       return 'user@example.com';
                     })()}
                   </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={item.onClick}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-100 pt-1">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Đăng xuất
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;
