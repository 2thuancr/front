'use client';

import React from 'react';
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
  ArrowDownRight
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const admin = user as Admin;

  // Mock data for statistics
  const stats = [
    {
      title: 'Lượt xem',
      value: '1,563',
      change: '+12%',
      changeType: 'positive',
      icon: Eye,
      color: 'blue',
      dateRange: '23/05 - 01/06 (2024)'
    },
    {
      title: 'Mục tiêu',
      value: '30,564',
      change: '+8%',
      changeType: 'positive',
      icon: Target,
      color: 'green',
      dateRange: '23/05 - 01/06 (2024)'
    },
    {
      title: 'Tác động',
      value: '42.6%',
      change: '-2%',
      changeType: 'negative',
      icon: TrendingUp,
      color: 'orange',
      dateRange: '23/05 - 01/06 (2024)'
    }
  ];

  const quickStats = [
    {
      title: 'Tổng người dùng',
      value: '2,847',
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Tổng sản phẩm',
      value: '1,234',
      icon: Package,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Tổng đơn hàng',
      value: '856',
      icon: ShoppingCart,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Doanh thu',
      value: '45,678,000₫',
      icon: DollarSign,
      color: 'bg-orange-500',
      change: '+23%'
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deals Analytics Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Phân tích giao dịch</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Xem tất cả
            </button>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 font-medium">Khu vực biểu đồ</p>
              <p className="text-sm text-gray-500">Biểu đồ phân tích tương tác sẽ được hiển thị tại đây</p>
            </div>
          </div>
          
          {/* Range Selector Placeholder */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-32 h-8 bg-gray-200 rounded"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-500">
              biểu đồ bởi amCharts
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="space-y-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">{stat.title}</h3>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-500' :
                  stat.color === 'green' ? 'bg-green-500' :
                  'bg-orange-500'
                }`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="mb-2">
                <span className={`text-2xl font-bold ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  'text-orange-600'
                }`}>
                  {stat.value}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{stat.dateRange}</span>
                <div className={`flex items-center text-xs ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Dự án đã xuất bản</h3>
          <p className="text-2xl font-bold text-gray-900">156</p>
          <p className="text-xs text-green-600 flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            +12% so với tháng trước
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Nhiệm vụ hoàn thành</h3>
          <p className="text-2xl font-bold text-gray-900">89</p>
          <p className="text-xs text-green-600 flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            +8% so với tháng trước
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Nhiệm vụ thành công</h3>
          <p className="text-2xl font-bold text-gray-900">76</p>
          <p className="text-xs text-green-600 flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            +15% so với tháng trước
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Dự án đang thực hiện</h3>
          <p className="text-2xl font-bold text-gray-900">23</p>
          <p className="text-xs text-red-600 flex items-center mt-1">
            <ArrowDownRight className="w-3 h-3 mr-1" />
            -3% so với tháng trước
          </p>
        </div>
      </div>
    </div>
  );
}