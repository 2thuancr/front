'use client';

import React from 'react';
import { Settings, Play, Pause, RotateCcw, Zap, Sparkles } from 'lucide-react';

export default function AdminAnimations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="w-8 h-8 text-gray-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hoạt ảnh</h1>
          <p className="text-gray-600 text-sm">Cấu hình hiệu ứng và hoạt ảnh</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Play className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Hoạt ảnh cơ bản</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Fade, slide, scale animations</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Kích hoạt
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Hiệu ứng nhanh</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Animations với tốc độ cao</p>
          <button className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700">
            Kích hoạt
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Hiệu ứng đặc biệt</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Particles, glow, shimmer effects</p>
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            Kích hoạt
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <RotateCcw className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Loading</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Spinner, progress, skeleton loading</p>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Kích hoạt
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Pause className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Tắt hoạt ảnh</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Tắt tất cả animations</p>
          <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
            Tắt
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Tùy chỉnh</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Cài đặt thời gian và hiệu ứng</p>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
            Cấu hình
          </button>
        </div>
      </div>
    </div>
  );
}
