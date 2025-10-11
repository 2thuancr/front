'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function StaffOrders() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Xử lý đơn hàng
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Trang quản lý đơn hàng cho nhân viên</p>
        <p className="text-sm text-gray-500 mt-2">Chức năng này đang được phát triển...</p>
      </div>
    </div>
  );
}
