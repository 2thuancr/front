'use client';

import React from 'react';
import Link from 'next/link';
import { StaffGuard } from '@/components/guards';
import { useAuth } from '@/hooks/useAuth';
import { useVendorStats } from '@/hooks/useVendorStats';
import { vendorOrderAPI } from '@/lib/api';
import { Staff, UserRole } from '@/types/auth';
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
  XCircle,
  RefreshCw,
  Download
} from 'lucide-react';

export default function StaffDashboard() {
  const { user } = useAuth();
  const staff = user as Staff;
  const stats = useVendorStats();
  
  // State for recent orders
  const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = React.useState(true);

  // Fetch recent orders
  React.useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setOrdersLoading(true);
        const response = await vendorOrderAPI.getAllOrders(1, 3); // Get only 3 most recent
        const orders = response.data?.orders || [];
        // Sort by createdAt date (most recent first)
        const sortedOrders = orders.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setRecentOrders(sortedOrders.slice(0, 3)); // Take only 3
      } catch (error) {
        console.error('Error fetching recent orders:', error);
        setRecentOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  // Helper functions for order status
  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
      case 'CONFIRMED':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
      case 'SHIPPING':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'pending':
      case 'NEW':
        return 'Mới';
      case 'processing':
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'shipped':
      case 'SHIPPING':
        return 'Đang giao';
      case 'delivered':
      case 'DELIVERED':
        return 'Đã giao';
      case 'cancelled':
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <StaffGuard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
            <p className="text-gray-600 mt-1">
              Chào mừng, {staff?.firstName} {staff?.lastName}!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              staff?.role === UserRole.MANAGER 
                ? 'text-purple-600 bg-purple-100' 
                : 'text-blue-600 bg-blue-100'
            }`}>
              {staff?.role === UserRole.MANAGER ? 'Quản lý' : 'Nhân viên'}
            </span>
            <button 
              onClick={() => {
                window.location.href = '/staff/dashboard';
              }}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Test Redirect
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.loading ? '...' : stats.totalProducts}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {stats.loading ? '...' : stats.totalOrders}
                </p>
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
                  {stats.loading ? '...' : `${stats.totalRevenue.toLocaleString('vi-VN')}đ`}
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
                <p className="text-2xl font-bold text-gray-900">
                  {stats.loading ? '...' : stats.totalCustomers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {stats.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
                <p className="text-sm text-red-700 mt-1">{stats.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
            </div>
            <div className="p-6">
              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={order.orderId || order.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <ShoppingCart className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">#{order.orderId || order.id || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{order.customerName || order.user?.name || order.userName || 'Khách hàng'}</p>
                          <p className="text-xs text-gray-500">Khách hàng</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(order.status)}`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {getOrderStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có đơn hàng nào</p>
                </div>
              )}
              <div className="mt-4">
                <Link href="/staff/orders">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Xem tất cả đơn hàng
                  </button>
                </Link>
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
                  <span className="text-lg font-semibold text-gray-900">
                    {stats.loading ? '...' : `${stats.averageRating}/5`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="text-gray-700">Đơn hàng chờ xử lý</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {stats.loading ? '...' : stats.pendingOrders}
                  </span>
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

        {/* Staff Information */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin nhân viên</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <p className="text-gray-900">{staff?.firstName} {staff?.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{staff?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <p className="text-gray-900">{staff?.phone || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <p className="text-gray-900">{staff?.role === UserRole.MANAGER ? 'Quản lý' : 'Nhân viên'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <p className="text-gray-900">{staff?.isActive ? 'Hoạt động' : 'Tạm dừng'}</p>
              </div>
            </div>
            <div className="mt-6">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Cập nhật thông tin cá nhân
              </button>
            </div>
          </div>
        </div>
      </div>
    </StaffGuard>
  );
}
