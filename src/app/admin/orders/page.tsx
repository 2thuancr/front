'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Plus,
  Download,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useToastSuccess, useToastError } from '@/components/ui/Toast';
import { adminOrderAPI } from '@/lib/api';
import { Order, OrdersResponse } from '@/types/api';

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(10);
  
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminOrderAPI.getAllOrders(currentPage, limit);
      
      if (response.data && response.data.orders) {
        setOrders(response.data.orders);
        
        // Use total from backend response, fallback to orders.length
        const total = response.data.total || response.data.orders.length;
        setTotalOrders(total);
        
        // Calculate total pages based on total count
        const calculatedTotalPages = Math.ceil(total / limit);
        setTotalPages(calculatedTotalPages);
      } else {
        console.warn('⚠️ No orders data in response');
        setOrders([]);
        setTotalOrders(0);
        setTotalPages(0);
      }
    } catch (error: any) {
      console.error('❌ Error fetching orders:', error);
      setError(error.response?.data?.message || 'Không thể tải danh sách đơn hàng');
      toastError('Lỗi', 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED': return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPING': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NEW': return 'Mới';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'SHIPPING': return 'Đang giao';
      case 'DELIVERED': return 'Đã giao';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW': return Clock;
      case 'CONFIRMED': return CheckCircle;
      case 'SHIPPING': return Truck;
      case 'DELIVERED': return CheckCircle;
      case 'CANCELLED': return XCircle;
      default: return Clock;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán';
      case 'paid': return 'Đã thanh toán';
      case 'failed': return 'Thanh toán thất bại';
      case 'refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toString().includes(searchTerm) ||
      order.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = async () => {
    await fetchOrders();
    toastSuccess('Thành công', 'Đã làm mới danh sách đơn hàng');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await adminOrderAPI.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, status: newStatus as any }
            : order
        )
      );
      
      toastSuccess('Thành công', 'Đã cập nhật trạng thái đơn hàng');
    } catch (error: any) {
      console.error('❌ Error updating order status:', error);
      toastError('Lỗi', 'Không thể cập nhật trạng thái đơn hàng');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShoppingCart className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
            <p className="text-gray-600 text-sm">Quản lý đơn hàng và trạng thái giao hàng</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đơn hàng mới</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'NEW').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đang giao</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'SHIPPING').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã giao</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'DELIVERED').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="NEW">Mới</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="SHIPPING">Đang giao</option>
              <option value="DELIVERED">Đã giao</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Lọc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Đang tải danh sách đơn hàng...</span>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    const totalItems = order.orderDetails.reduce((sum, detail) => sum + detail.quantity, 0);
                    
                    return (
                      <tr key={order.orderId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <ShoppingCart className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">#{order.orderId}</div>
                              <div className="text-sm text-gray-500">{totalItems} sản phẩm</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {order.user.firstName} {order.user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{order.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            {order.orderDetails.slice(0, 2).map((detail, index) => (
                              <div key={index} className="truncate">
                                {detail.product.productName} (x{detail.quantity})
                              </div>
                            ))}
                            {order.orderDetails.length > 2 && (
                              <div className="text-gray-500">+{order.orderDetails.length - 2} sản phẩm khác</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(order.totalAmount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {getPaymentStatusText(order.paymentStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(order.orderDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-gray-400 hover:text-gray-600" title="Xem chi tiết">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600" title="Chỉnh sửa">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600" title="Xóa">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị{' '}
                    <span className="font-medium">{(currentPage - 1) * limit + 1}</span>
                    {' '}đến{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * limit, totalOrders)}
                    </span>
                    {' '}trong tổng số{' '}
                    <span className="font-medium">{totalOrders}</span> đơn hàng
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}