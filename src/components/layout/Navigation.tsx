'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ShoppingCart, User, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/ui/Logo';
import ClientOnly from '@/components/ui/ClientOnly';
import UserDropdown from './UserDropdown';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Debug log
  console.log('🔍 Navigation: Current state:', {
    pathname,
    isAuthenticated,
    user: (user as any)?.firstName + ' ' + (user as any)?.lastName,
    currentPath: window.location.pathname
  });
  const navigation = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Sản phẩm', href: '/products' },
    { name: 'Về chúng tôi', href: '/about' },
    { name: 'Liên hệ', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const goToCart = () => {
    router.push("/cart"); // ✅ điều hướng đến trang giỏ hàng
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white shadow-sm border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <Link href="/wishlist" className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Heart className="h-5 w-5" />
              </Link>
              <button onClick= {goToCart } className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <ShoppingCart className="h-5 w-5" />
              </button>
              
              {/* Wrap authentication-dependent content in ClientOnly */}
              <ClientOnly>
                {isAuthenticated ? (
                  <UserDropdown />
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Đăng nhập
                  </Link>
                )}
              </ClientOnly>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile search */}
            <div className="px-3 py-2">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Mobile action buttons */}
            <div className="px-3 py-2 space-y-2">
              <ClientOnly>
                {isAuthenticated ? (
                  <div className="space-y-1">
                    {/* User Info */}
                    <div className="px-3 py-2 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {(user as any)?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {(user as any)?.firstName && (user as any)?.lastName 
                              ? `${(user as any).firstName} ${(user as any).lastName}` 
                              : user?.email?.split('@')[0] || 'User'
                            }
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Menu Items */}
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đơn hàng của tôi
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cài đặt
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        // Handle logout
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-base font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                )}
              </ClientOnly>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
