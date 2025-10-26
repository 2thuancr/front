'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Admin } from '@/types/auth';
import { 
  LayoutDashboard, 
  Eye, 
  Target, 
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  Heart,
  MessageSquare
} from 'lucide-react';
import { adminAuthAPI } from '@/lib/api';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCategories: number;
  totalVouchers: number;
  totalViews: number;
  totalWishlists: number;
  totalReviews: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const admin = user as Admin;

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCategories: 0,
    totalVouchers: 0,
    totalViews: 0,
    totalWishlists: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all stats from single endpoint
        const response = await adminAuthAPI.getStatistics();
        
        if (response.data?.statistics) {
          setStats({
            totalUsers: response.data.statistics.totalUsers || 0,
            totalProducts: response.data.statistics.totalProducts || 0,
            totalOrders: response.data.statistics.totalOrders || 0,
            totalRevenue: 0, // Not included in API response
            totalCategories: response.data.statistics.totalCategories || 0,
            totalVouchers: response.data.statistics.totalVouchers || 0,
            totalViews: response.data.statistics.totalViews || 0,
            totalWishlists: response.data.statistics.totalWishlists || 0,
            totalReviews: response.data.statistics.totalReviews || 0,
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format number with thousand separators
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  // Format currency
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  };

  const quickStats = [
    {
      title: 'Tổng người dùng',
      value: formatNumber(stats.totalUsers),
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Tổng sản phẩm',
      value: formatNumber(stats.totalProducts),
      icon: Package,
      color: 'bg-green-500',
    },
    {
      title: 'Tổng đơn hàng',
      value: formatNumber(stats.totalOrders),
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-orange-500',
    }
  ];

  const bottomStats = [
    {
      title: 'Danh mục',
      value: formatNumber(stats.totalCategories),
      icon: Target,
      color: 'green',
    },
    {
      title: 'Voucher',
      value: formatNumber(stats.totalVouchers),
      icon: Tag,
      color: 'blue',
    },
    {
      title: 'Lượt xem sản phẩm',
      value: formatNumber(stats.totalViews),
      icon: Eye,
      color: 'purple',
    },
    {
      title: 'Yêu thích',
      value: formatNumber(stats.totalWishlists),
      icon: Heart,
      color: 'pink',
    },
    {
      title: 'Đánh giá',
      value: formatNumber(stats.totalReviews),
      icon: MessageSquare,
      color: 'indigo',
    }
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center space-x-3">
        <LayoutDashboard className="w-8 h-8 text-gray-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
          <p className="text-gray-600 text-sm">
            Chào mừng đến với trang quản trị hệ thống
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Quick Stats */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Google Analytics Integration */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Phân tích giao dịch</h2>
              <a 
                href="https://analytics.google.com/analytics/web/?hl=vi#/a370974046p508167750/reports/intelligenthome?params=_u..nav%3Dmaui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
              >
                Xem trên Google Analytics
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
            
            {/* Google Analytics Placeholder */}
            <div 
              onClick={() => window.open('https://analytics.google.com/analytics/web/?hl=vi#/a370974046p508167750/reports/intelligenthome?params=_u..nav%3Dmaui', '_blank', 'noopener,noreferrer')}
              className="h-80 rounded-lg flex items-center justify-center cursor-pointer group relative overflow-hidden"
              style={{
                backgroundImage: 'url(/images/google_analytics.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Subtle overlay for better contrast on edges only */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              
              <div className="text-center relative z-10">
                <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-opacity-100 group-hover:scale-110 transition-all shadow-lg">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-red-600 font-semibold text-lg drop-shadow-md">Google Analytics</p>
                <p className="text-sm text-red-600 drop-shadow-sm">Nhấp để mở trang phân tích chi tiết</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-semibold group-hover:shadow-lg group-hover:scale-105 transition-all">
                  Mở Analytics
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            {/* Google Analytics Badge */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-500">Powered by Google Analytics</span>
              </div>
              <a 
                href="https://analytics.google.com/analytics/web/?hl=vi#/a370974046p508167750/reports/intelligenthome?params=_u..nav%3Dmaui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Truy cập ngay →
              </a>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="space-y-6">
            {bottomStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-900">{stat.title}</h3>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    stat.color === 'blue' ? 'bg-blue-500' :
                    stat.color === 'green' ? 'bg-green-500' :
                    stat.color === 'orange' ? 'bg-orange-500' :
                    stat.color === 'purple' ? 'bg-purple-500' :
                    stat.color === 'pink' ? 'bg-pink-500' :
                    'bg-indigo-500'
                  }`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="mb-2">
                  <span className={`text-2xl font-bold ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'orange' ? 'text-orange-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    stat.color === 'pink' ? 'text-pink-600' :
                    'text-indigo-600'
                  }`}>
                    {stat.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}