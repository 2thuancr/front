'use client';

import React from 'react';
import { Package, Layout, Grid, List, Sidebar } from 'lucide-react';

export default function AdminLayouts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Package className="w-8 h-8 text-gray-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bố cục trang</h1>
          <p className="text-gray-600 text-sm">Quản lý bố cục và giao diện trang</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Layout className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Bố cục cơ bản</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Bố cục đơn giản với header và content</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Sử dụng
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Grid className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Bố cục lưới</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Bố cục dạng lưới với sidebar</p>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Sử dụng
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <List className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Bố cục danh sách</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Bố cục tối ưu cho danh sách</p>
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            Sử dụng
          </button>
        </div>
      </div>
    </div>
  );
}
