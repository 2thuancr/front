'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Home, LogIn, UserPlus, Key, LogOut, Gift, ShoppingBag, Bell, Package } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/ui/Logo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const navigationItems = [
    { name: 'Trang chủ', href: '/', icon: Home },
    { name: 'Sản phẩm', href: '/products', icon: Gift, showWhen: true },
    { name: 'Giỏ hàng', href: '/cart', icon: ShoppingBag, showWhen: true },
    { name: 'Đơn hàng', href: '/orders', icon: Package, showWhen: isAuthenticated },
    { name: 'Đăng nhập', href: '/login', icon: LogIn, showWhen: !isAuthenticated },
    { name: 'Đăng ký', href: '/register', icon: UserPlus, showWhen: !isAuthenticated },
    { name: 'Quên mật khẩu', href: '/forgot-password', icon: Key, showWhen: !isAuthenticated },
    { name: 'Nhân viên', href: '/staff-login', icon: User, showWhen: !isAuthenticated },
    { name: 'Hồ sơ', href: '/profile', icon: User, showWhen: isAuthenticated },
  ].filter(item => item.showWhen !== false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-pink-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Logo size="sm" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors duration-200 font-medium"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-pink-200 bg-white/95 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors duration-200 font-medium"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
