'use client';

import React from 'react';
import { Eye, Menu, ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';

export default function AdminNavigation() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Eye className="w-8 h-8 text-gray-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Điều hướng</h1>
          <p className="text-gray-600 text-sm">Cấu hình menu và điều hướng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu chính</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Trang chủ</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Sản phẩm</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Giới thiệu</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Liên hệ</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu phụ</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Đăng nhập</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Đăng ký</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Giỏ hàng</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
