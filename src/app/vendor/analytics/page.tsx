'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Star,
  Calendar,
  Download
} from 'lucide-react';

export default function VendorAnalyticsPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  // Mock data - replace with real API calls
  const analytics = {
    revenue: {
      current: 12500000,
      previous: 9800000,
      change: 27.6
    },
    orders: {
      current: 128,
      previous: 95,
      change: 34.7
    },
    customers: {
      current: 89,
      previous: 67,
      change: 32.8
    },
    products: {
      current: 45,
      previous: 38,
      change: 18.4
    }
  };

  const topProducts = [
    { name: 'iPhone 15 Pro Max', sales: 156, revenue: 4694400000, growth: 12.5 },
    { name: 'Samsung Galaxy S24 Ultra', sales: 203, revenue: 5072970000, growth: 8.3 },
    { name: 'MacBook Pro M3', sales: 67, revenue: 3081330000, growth: 15.2 },
    { name: 'AirPods Pro 2', sales: 234, revenue: 1401660000, growth: 22.1 },
    { name: 'iPad Air 5', sales: 89, revenue: 1423110000, growth: 6.7 }
  ];

  const monthlyData = [
    { month: 'T1', revenue: 8500000, orders: 95, customers: 67 },
    { month: 'T2', revenue: 9200000, orders: 108, customers: 72 },
    { month: 'T3', revenue: 9800000, orders: 112, customers: 78 },
    { month: 'T4', revenue: 10500000, orders: 118, customers: 82 },
    { month: 'T5', revenue: 11200000, orders: 125, customers: 85 },
    { month: 'T6', revenue: 12500000, orders: 128, customers: 89 }
  ];

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thống kê bán hàng</h1>
          <p className="text-gray-600 mt-1">
            Phân tích hiệu suất bán hàng và doanh thu
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="90days">90 ngày qua</option>
            <option value="1year">1 năm qua</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.revenue.current.toLocaleString('vi-VN')}đ
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`flex items-center text-sm font-medium ${getChangeColor(analytics.revenue.change)}`}>
              {getChangeIcon(analytics.revenue.change)}
              <span className="ml-1">{Math.abs(analytics.revenue.change)}%</span>
            </span>
            <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.orders.current}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`flex items-center text-sm font-medium ${getChangeColor(analytics.orders.change)}`}>
              {getChangeIcon(analytics.orders.change)}
              <span className="ml-1">{Math.abs(analytics.orders.change)}%</span>
            </span>
            <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.customers.current}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`flex items-center text-sm font-medium ${getChangeColor(analytics.customers.change)}`}>
              {getChangeIcon(analytics.customers.change)}
              <span className="ml-1">{Math.abs(analytics.customers.change)}%</span>
            </span>
            <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.products.current}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`flex items-center text-sm font-medium ${getChangeColor(analytics.products.change)}`}>
              {getChangeIcon(analytics.products.change)}
              <span className="ml-1">{Math.abs(analytics.products.change)}%</span>
            </span>
            <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo tháng</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Doanh thu</span>
            </div>
          </div>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-8">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-20 text-right">
                  {(data.revenue / 1000000).toFixed(1)}M
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Đơn hàng theo tháng</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Đơn hàng</span>
            </div>
          </div>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-8">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.orders / Math.max(...monthlyData.map(d => d.orders))) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-20 text-right">
                  {data.orders}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Sản phẩm bán chạy</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.sales} đơn bán</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {product.revenue.toLocaleString('vi-VN')}đ
                  </p>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>+{product.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đánh giá trung bình</p>
              <p className="text-2xl font-bold text-gray-900">4.7/5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tăng trưởng</p>
              <p className="text-2xl font-bold text-gray-900">+27.6%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Thời gian hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">6 tháng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
