'use client';

import React from 'react';
import { VendorGuard } from '@/components/guards';
import { useAuth } from '@/hooks/useAuth';
import { Vendor, VendorStatus } from '@/types/auth';

export default function VendorDashboard() {
  const { user } = useAuth();
  const vendor = user as Vendor;

  const getStatusColor = (status: VendorStatus) => {
    switch (status) {
      case VendorStatus.ACTIVE:
        return 'text-green-600 bg-green-100';
      case VendorStatus.PENDING_APPROVAL:
        return 'text-yellow-600 bg-yellow-100';
      case VendorStatus.SUSPENDED:
        return 'text-red-600 bg-red-100';
      case VendorStatus.REJECTED:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: VendorStatus) => {
    switch (status) {
      case VendorStatus.ACTIVE:
        return 'Hoạt động';
      case VendorStatus.PENDING_APPROVAL:
        return 'Chờ duyệt';
      case VendorStatus.SUSPENDED:
        return 'Tạm dừng';
      case VendorStatus.REJECTED:
        return 'Bị từ chối';
      default:
        return 'Không xác định';
    }
  };

  return (
    <VendorGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Chào mừng, {vendor?.ownerName}!
            </p>
            <div className="mt-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vendor?.status)}`}>
                {getStatusText(vendor?.status)}
              </span>
            </div>
          </div>

          {vendor?.status === VendorStatus.ACTIVE ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quản lý sản phẩm</h3>
                <p className="text-gray-600 mb-4">Thêm, sửa, xóa sản phẩm của cửa hàng</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Truy cập
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng</h3>
                <p className="text-gray-600 mb-4">Xem và xử lý đơn hàng từ khách hàng</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Truy cập
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê bán hàng</h3>
                <p className="text-gray-600 mb-4">Xem báo cáo doanh thu, sản phẩm bán chạy</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  Truy cập
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt cửa hàng</h3>
                <p className="text-gray-600 mb-4">Cập nhật thông tin cửa hàng</p>
                <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                  Truy cập
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá</h3>
                <p className="text-gray-600 mb-4">Xem đánh giá từ khách hàng</p>
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
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tài khoản chưa được kích hoạt
                </h3>
                <p className="text-gray-600 mb-4">
                  Tài khoản của bạn đang ở trạng thái "{getStatusText(vendor?.status)}". 
                  Vui lòng chờ admin duyệt hoặc liên hệ hỗ trợ để được hỗ trợ.
                </p>
                {vendor?.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
                    <strong>Lý do từ chối:</strong> {vendor.rejectionReason}
                  </div>
                )}
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Liên hệ hỗ trợ
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cửa hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên cửa hàng</label>
                <p className="text-gray-900">{vendor?.storeName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Chủ sở hữu</label>
                <p className="text-gray-900">{vendor?.ownerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{vendor?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <p className="text-gray-900">{vendor?.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <p className="text-gray-900">{vendor?.address}, {vendor?.ward}, {vendor?.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mã số thuế</label>
                <p className="text-gray-900">{vendor?.taxCode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VendorGuard>
  );
}
