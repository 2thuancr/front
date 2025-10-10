'use client';

import React from 'react';
import { StaffGuard } from '@/components/guards';
import { useAuth } from '@/hooks/useAuth';
import { Staff, UserRole } from '@/types/auth';

export default function StaffDashboard() {
  const { user } = useAuth();
  const staff = user as Staff;

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case UserRole.STAFF:
        return 'Nhân viên';
      case UserRole.MANAGER:
        return 'Quản lý';
      default:
        return 'Không xác định';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.STAFF:
        return 'text-blue-600 bg-blue-100';
      case UserRole.MANAGER:
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <StaffGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Chào mừng, {staff?.firstName} {staff?.lastName}!
            </p>
            <div className="mt-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(staff?.role)}`}>
                {getRoleText(staff?.role)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quản lý đơn hàng</h3>
              <p className="text-gray-600 mb-4">Xem và xử lý đơn hàng từ khách hàng</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Truy cập
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quản lý sản phẩm</h3>
              <p className="text-gray-600 mb-4">Thêm, sửa, xóa sản phẩm trong hệ thống</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Truy cập
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quản lý khách hàng</h3>
              <p className="text-gray-600 mb-4">Xem thông tin và hỗ trợ khách hàng</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Truy cập
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quản lý kho</h3>
              <p className="text-gray-600 mb-4">Kiểm tra tồn kho, nhập xuất hàng</p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                Truy cập
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Báo cáo</h3>
              <p className="text-gray-600 mb-4">Xem báo cáo bán hàng, thống kê</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Truy cập
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hỗ trợ</h3>
              <p className="text-gray-600 mb-4">Liên hệ hỗ trợ kỹ thuật</p>
              <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                Truy cập
              </button>
            </div>
          </div>

          {staff?.role === UserRole.MANAGER && (
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chức năng quản lý</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Quản lý nhân viên</h4>
                  <p className="text-purple-700 text-sm mb-3">Phân quyền và quản lý nhân viên</p>
                  <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                    Truy cập
                  </button>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Báo cáo tổng hợp</h4>
                  <p className="text-purple-700 text-sm mb-3">Xem báo cáo tổng hợp hệ thống</p>
                  <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                    Truy cập
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <p className="text-gray-900">{staff?.firstName} {staff?.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{staff?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <p className="text-gray-900">{staff?.phone || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                <p className="text-gray-900">{getRoleText(staff?.role)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <p className="text-gray-900">{staff?.isActive ? 'Hoạt động' : 'Tạm dừng'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lần đăng nhập cuối</label>
                <p className="text-gray-900">
                  {staff?.lastLoginAt ? new Date(staff.lastLoginAt).toLocaleString('vi-VN') : 'Chưa có'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffGuard>
  );
}
