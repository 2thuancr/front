'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  TrendingUp,
  Eye,
  MousePointer,
  Clock,
  Users,
  ShoppingCart
} from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <LayoutDashboard className="w-8 h-8 text-gray-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phân tích chi tiết</h1>
          <p className="text-gray-600 text-sm">Phân tích dữ liệu và hiệu suất hệ thống</p>
        </div>
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lượt truy cập</p>
              <p className="text-2xl font-bold text-gray-900">12,456</p>
              <p className="text-xs text-green-600">+15.2% so với tháng trước</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỷ lệ chuyển đổi</p>
              <p className="text-2xl font-bold text-gray-900">3.2%</p>
              <p className="text-xs text-green-600">+0.8% so với tháng trước</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Thời gian trung bình</p>
              <p className="text-2xl font-bold text-gray-900">2m 34s</p>
              <p className="text-xs text-red-600">-12s so với tháng trước</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỷ lệ thoát</p>
              <p className="text-2xl font-bold text-gray-900">45.6%</p>
              <p className="text-xs text-green-600">-2.1% so với tháng trước</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <MousePointer className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lưu lượng truy cập theo giờ</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 font-medium">Biểu đồ lưu lượng</p>
              <p className="text-sm text-gray-500">Dữ liệu sẽ được hiển thị tại đây</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top trang được truy cập</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Trang chủ</p>
                  <p className="text-xs text-gray-500">4,234 lượt xem</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">34%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Sản phẩm</p>
                  <p className="text-xs text-gray-500">2,156 lượt xem</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">17%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Giỏ hàng</p>
                  <p className="text-xs text-gray-500">1,234 lượt xem</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Behavior */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành vi người dùng</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900">Người dùng mới</h4>
            <p className="text-2xl font-bold text-gray-900">234</p>
            <p className="text-xs text-gray-500">Trong tháng này</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900">Đơn hàng</h4>
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-xs text-gray-500">Trong tháng này</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900">Tăng trưởng</h4>
            <p className="text-2xl font-bold text-gray-900">+23%</p>
            <p className="text-xs text-gray-500">So với tháng trước</p>
          </div>
        </div>
      </div>
    </div>
  );
}
