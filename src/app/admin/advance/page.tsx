'use client';

import React from 'react';
import { Settings, Database, Shield, Zap, Globe, Key } from 'lucide-react';

export default function AdminAdvance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="w-8 h-8 text-gray-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt nâng cao</h1>
          <p className="text-gray-600 text-sm">Cấu hình các tính năng nâng cao</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Cơ sở dữ liệu</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Quản lý và tối ưu hóa database</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Cấu hình
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Bảo mật</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Cài đặt bảo mật nâng cao</p>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Cấu hình
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Hiệu suất</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Tối ưu hóa hiệu suất hệ thống</p>
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            Cấu hình
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">CDN</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Cấu hình Content Delivery Network</p>
          <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
            Cấu hình
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Key className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Quản lý API keys và tokens</p>
          <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
            Cấu hình
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Tùy chỉnh</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Cài đặt tùy chỉnh hệ thống</p>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
            Cấu hình
          </button>
        </div>
      </div>
    </div>
  );
}
