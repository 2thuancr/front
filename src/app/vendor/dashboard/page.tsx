'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Vendor, VendorStatus } from '@/types/auth';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

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

  const getStatusIcon = (status: VendorStatus) => {
    switch (status) {
      case VendorStatus.ACTIVE:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case VendorStatus.PENDING_APPROVAL:
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case VendorStatus.SUSPENDED:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case VendorStatus.REJECTED:
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  // Mock data - replace with real API calls
  const stats = {
    totalProducts: 45,
    totalOrders: 128,
    totalRevenue: 12500000,
    totalCustomers: 89,
    averageRating: 4.7,
    pendingOrders: 12
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
          <p className="text-gray-600 mt-1">
            Chào mừng, {vendor?.ownerName || vendor?.storeName}!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(vendor?.status)}
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(vendor?.status)}`}>
            {getStatusText(vendor?.status)}
          </span>
        </div>
      </div>

      {/* Status Alert */}
      {vendor?.status !== VendorStatus.ACTIVE && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Tài khoản chưa được kích hoạt
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Tài khoản của bạn đang ở trạng thái "{getStatusText(vendor?.status)}". 
                Vui lòng chờ admin duyệt hoặc liên hệ hỗ trợ.
              </p>
              {vendor?.rejectionReason && (
                <div className="mt-2 text-sm text-red-600">
                  <strong>Lý do từ chối:</strong> {vendor.rejectionReason}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalRevenue.toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">#ORD-001</p>
                  <p className="text-sm text-gray-600">Nguyễn Văn A</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">1,250,000đ</p>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Chờ xử lý
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">#ORD-002</p>
                  <p className="text-sm text-gray-600">Trần Thị B</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">890,000đ</p>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Đã giao
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">#ORD-003</p>
                  <p className="text-sm text-gray-600">Lê Văn C</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">2,100,000đ</p>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Đang giao
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Xem tất cả đơn hàng
              </button>
            </div>
          </div>
        </div>

        {/* Store Performance */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Hiệu suất cửa hàng</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-gray-700">Đánh giá trung bình</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{stats.averageRating}/5</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-orange-500 mr-2" />
                  <span className="text-gray-700">Đơn hàng chờ xử lý</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{stats.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Tăng trưởng tháng này</span>
                </div>
                <span className="text-lg font-semibold text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Xem báo cáo chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Store Information */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Thông tin cửa hàng</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên cửa hàng</label>
              <p className="text-gray-900">{vendor?.storeName || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chủ sở hữu</label>
              <p className="text-gray-900">{vendor?.ownerName || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{vendor?.email || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <p className="text-gray-900">{vendor?.phone || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <p className="text-gray-900">
                {vendor?.address ? `${vendor.address}, ${vendor.ward}, ${vendor.city}` : 'Chưa cập nhật'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã số thuế</label>
              <p className="text-gray-900">{vendor?.taxCode || 'Chưa cập nhật'}</p>
            </div>
          </div>
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Cập nhật thông tin cửa hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
