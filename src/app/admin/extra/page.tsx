'use client';

import React from 'react';
import { Settings, Plus, Star, Heart, Gift, Award } from 'lucide-react';

export default function AdminExtra() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="w-8 h-8 text-gray-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tính năng bổ sung</h1>
          <p className="text-gray-600 text-sm">Các tính năng mở rộng và bổ sung</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Plus className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Tính năng mới</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Khám phá các tính năng mới</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Xem thêm
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Star className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Đánh giá</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Hệ thống đánh giá sản phẩm</p>
          <button className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700">
            Kích hoạt
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Yêu thích</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Danh sách yêu thích khách hàng</p>
          <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
            Kích hoạt
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Gift className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Khuyến mãi</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Hệ thống khuyến mãi và giảm giá</p>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Kích hoạt
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Thành tích</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Hệ thống thành tích và điểm thưởng</p>
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            Kích hoạt
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Tùy chỉnh</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Cài đặt tùy chỉnh giao diện</p>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
            Cấu hình
          </button>
        </div>
      </div>
    </div>
  );
}
