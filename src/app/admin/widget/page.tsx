'use client';

import React from 'react';
import { BarChart3, Calendar, Clock, Users, Package, ShoppingCart } from 'lucide-react';

export default function AdminWidget() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BarChart3 className="w-8 h-8 text-gray-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Widget</h1>
          <p className="text-gray-600 text-sm">Quản lý các widget trên dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Widget người dùng</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Hiển thị thống kê người dùng</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Thêm vào dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Package className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Widget sản phẩm</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Hiển thị thống kê sản phẩm</p>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Thêm vào dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ShoppingCart className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Widget đơn hàng</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Hiển thị thống kê đơn hàng</p>
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            Thêm vào dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Widget lịch</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Hiển thị lịch và sự kiện</p>
          <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
            Thêm vào dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Widget thời gian</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Hiển thị thời gian thực</p>
          <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
            Thêm vào dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Widget biểu đồ</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Hiển thị biểu đồ thống kê</p>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
            Thêm vào dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
