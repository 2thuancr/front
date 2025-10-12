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
  Clock,
  ChevronDown
} from 'lucide-react';
import { useToastSuccess, useToastError } from '@/components/ui/Toast';
import { staffOrderAPI } from '@/lib/api';
import { Order, OrdersResponse } from '@/types/api';
import { useStaffOrderSync } from '@/hooks/useOrderStatusSync';

export default function StaffOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]); // For stats calculation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(10);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  // Function to update status counts
  const updateStatusCounts = (orders: Order[]) => {
    const counts: Record<string, number> = {};
    const allStatuses = ['NEW', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELLED', 'CANCELLATION_REQUESTED'];
    
    allStatuses.forEach(status => {
      counts[status] = orders.filter(o => o.status === status).length;
    });
    
    setStatusCounts(counts);
    console.log('📊 Staff status counts updated:', counts);
  };

  // Real-time order status sync
  const { isConnected, connectionError } = useStaffOrderSync({
    onStatusUpdate: (update) => {
      console.log('📦 Staff received order update:', update);
      console.log('📦 Staff order update details:', {
        orderId: update.orderId,
        oldStatus: update.oldStatus,
        newStatus: update.status,
        updatedBy: update.updatedBy,
        timestamp: update.timestamp
      });
      
      // Update orders in real-time
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order => 
          order.orderId === update.orderId 
            ? { ...order, status: update.status }
            : order
        );
        console.log('🔄 Staff orders updated:', updatedOrders);
        return updatedOrders;
      });
      
      setAllOrders(prevOrders => {
        const updatedAllOrders = prevOrders.map(order => {
          if (order.orderId === update.orderId) {
            // Normalize cancelled status to CANCELLED
            let normalizedStatus = update.status as any;
            if ((update.status as string) === 'CANCELED' || (update.status as string) === 'CANCEL') {
              normalizedStatus = 'CANCELLED';
            }
            return { ...order, status: normalizedStatus };
          }
          return order;
        });
        
        // Update status counts
        updateStatusCounts(updatedAllOrders);
        
        return updatedAllOrders;
      });
    }
  });

  // Fallback polling mechanism if Socket.IO is not working
  useEffect(() => {
    if (!isConnected && allOrders.length > 0) {
      console.log('🔄 Socket.IO not connected, starting fallback polling...');
      
      const pollInterval = setInterval(async () => {
        try {
          const response = await staffOrderAPI.getAllOrders(1, 1000);
          if (response.data && response.data.orders) {
            const fetchedOrders = response.data.orders;
            
            // Normalize cancelled status to CANCELLED
            const normalizedOrders = fetchedOrders.map((order: any) => {
              if (order.status === 'CANCELED' || order.status === 'CANCEL') {
                return { ...order, status: 'CANCELLED' };
              }
              return order;
            });
            
            const currentOrderIds = allOrders.map(o => o.orderId).sort();
            const fetchedOrderIds = normalizedOrders.map((o: any) => o.orderId).sort();
            
            // Check if orders have changed
            if (JSON.stringify(currentOrderIds) !== JSON.stringify(fetchedOrderIds)) {
              console.log('🔄 Staff polling detected order changes, updating...');
              setAllOrders(normalizedOrders);
              updateStatusCounts(normalizedOrders);
            }
          }
        } catch (error) {
          console.error('❌ Staff polling error:', error);
        }
      }, 5000); // Poll every 5 seconds
      
      return () => clearInterval(pollInterval);
    }
  }, [isConnected, allOrders]);

  // Fetch all orders for stats
  const fetchAllOrders = async () => {
    try {
      const response = await staffOrderAPI.getAllOrders(1, 1000); // Get all orders
      if (response.data && response.data.orders) {
        const fetchedOrders = response.data.orders;
        
        // Normalize cancelled status to CANCELLED
        const normalizedOrders = fetchedOrders.map((order: any) => {
          if (order.status === 'CANCELED' || order.status === 'CANCEL') {
            return { ...order, status: 'CANCELLED' };
          }
          return order;
        });
        
        console.log('📦 Staff fetched orders from API:', fetchedOrders);
        console.log('📦 Staff normalized orders:', normalizedOrders);
        
        setAllOrders(normalizedOrders);
        
        // Update status counts after fetching
        updateStatusCounts(normalizedOrders);
      }
    } catch (error) {
      console.error('❌ Error fetching all orders for stats:', error);
    }
  };

  // Fetch orders from API for pagination
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await staffOrderAPI.getAllOrders(currentPage, limit);
      
      if (response.data && response.data.orders) {
        const fetchedOrders = response.data.orders;
        
        // Normalize cancelled status to CANCELLED
        const normalizedOrders = fetchedOrders.map((order: any) => {
          if (order.status === 'CANCELED' || order.status === 'CANCEL') {
            return { ...order, status: 'CANCELLED' };
          }
          return order;
        });
        
        setOrders(normalizedOrders);
        
        // Use total from backend response, fallback to orders.length
        const total = response.data.total || response.data.orders.length;
        setTotalOrders(total);
        
        // Calculate total pages based on total count
        const calculatedTotalPages = Math.ceil(total / limit);
        setTotalPages(calculatedTotalPages);
        
        setOrders(response.data.orders);
        
        console.log('📊 Staff Orders loaded:', {
          ordersCount: response.data.orders.length,
          totalFromBackend: response.data.total,
          totalPages: calculatedTotalPages,
          currentPage: currentPage,
          limit: limit
        });
        
      } else {
        console.warn('⚠️ No orders data in response');
        setOrders([]);
        setTotalOrders(0);
        setTotalPages(0);
      }
    } catch (error: any) {
      console.error('❌ Error fetching staff orders:', error);
      setError(error.response?.data?.message || 'Không thể tải danh sách đơn hàng');
      toastError('Lỗi', 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchAllOrders(); // Fetch all orders for stats
  }, [currentPage]);

  const getStatusColor = (status: string) => {
    // Handle CANCEL vs CANCELLED inconsistency
    if (status === 'CANCEL' || status === 'CANCELED') {
      return 'bg-red-100 text-red-800';
    }
    
    const statusColors: Record<string, string> = {
      'NEW': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'PREPARING': 'bg-purple-100 text-purple-800',
      'SHIPPING': 'bg-orange-100 text-orange-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'CANCELLATION_REQUESTED': 'bg-gray-100 text-gray-800'
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    return getStatusDisplayName(status);
  };

  const getStatusIcon = (status: string) => {
    // Handle CANCEL vs CANCELLED inconsistency
    if (status === 'CANCEL' || status === 'CANCELED') {
      return XCircle;
    }
    
    switch (status) {
      case 'NEW': return Clock;
      case 'CONFIRMED': return CheckCircle;
      case 'PREPARING': return Package;
      case 'SHIPPING': return Truck;
      case 'DELIVERED': return CheckCircle;
      case 'CANCELLED': return XCircle;
      case 'CANCELLATION_REQUESTED': return AlertCircle;
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
    setUpdatingStatus(orderId);
    try {
      console.log('🔄 Updating order status:', { orderId, newStatus });
      
      // Call API to update order status
      const response = await staffOrderAPI.updateOrderStatus(orderId, newStatus);
      console.log('✅ API call successful:', response.data);
      
      // Verify the status was actually updated in the response
      if (response.data && response.data.status) {
        console.log('✅ Status confirmed in response:', response.data.status);
      } else {
        console.warn('⚠️ Status not found in response, checking if update was successful');
      }
      
      // Update local state after successful API call
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, status: newStatus as any }
            : order
        )
      );
      
      setAllOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, status: newStatus as any }
            : order
        )
      );

      console.log('📡 Waiting for Socket.IO event from backend...');
      console.log('📡 Expected event: order_status_update with orderId:', orderId, 'status:', newStatus);
      console.log('📡 Backend should emit to customer room for order owner');
      
      // Check if backend emits event after 2 seconds
      setTimeout(() => {
        console.log('⏰ 2 seconds passed - checking if Socket.IO event was received...');
        console.log('⏰ If no event received, backend may not be emitting Socket.IO events');
      }, 2000);
      
      // Verify the update by fetching the order again
      setTimeout(async () => {
        try {
          const verifyResponse = await staffOrderAPI.getOrderById(orderId);
          console.log('🔍 Verification - Current order status:', verifyResponse.data.status);
          
          if (verifyResponse.data.status !== newStatus) {
            console.warn('⚠️ Status mismatch! Expected:', newStatus, 'Got:', verifyResponse.data.status);
            toastError('Cảnh báo!', 'Trạng thái có thể chưa được lưu vào database');
          } else {
            console.log('✅ Status verified in database:', verifyResponse.data.status);
          }
        } catch (verifyError) {
          console.error('❌ Error verifying order status:', verifyError);
        }
      }, 1000);
      
      toastSuccess('Thành công!', `Đã cập nhật trạng thái đơn hàng #${orderId}`);
    } catch (error: any) {
      console.error('❌ Error updating order status:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        orderId,
        newStatus
      });
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toastError('Lỗi!', 'Bạn không có quyền cập nhật trạng thái đơn hàng');
      } else if (error.response?.status === 400) {
        toastError('Lỗi!', 'Dữ liệu không hợp lệ');
      } else if (error.response?.status === 500) {
        const errorMessage = error.response?.data?.message || 'Lỗi server';
        toastError('Lỗi Server!', `Không thể cập nhật trạng thái đơn hàng: ${errorMessage}`);
      } else {
        toastError('Lỗi!', 'Không thể cập nhật trạng thái đơn hàng');
      }
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Get available status options based on current status
  const getAvailableStatuses = (currentStatus: string) => {
    const statusFlow: Record<string, string[]> = {
      'NEW': ['CONFIRMED', 'CANCELLED'],
      'CONFIRMED': ['PREPARING', 'CANCELLED'],
      'PREPARING': ['SHIPPING', 'CANCELLED'],
      'SHIPPING': ['DELIVERED', 'CANCELLED'],
      'DELIVERED': [], // Final status
      'CANCELLED': [], // Final status
      'CANCELLATION_REQUESTED': ['CANCELLED', 'CONFIRMED'] // Can approve cancellation or continue processing
    };
    
    return statusFlow[currentStatus] || [];
  };

  // Get all possible statuses for staff (more flexible)
  const getAllStatuses = (currentStatus: string) => {
    const allStatuses = ['NEW', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELLED', 'CANCELLATION_REQUESTED'];
    
    // Filter out current status and return all others
    return allStatuses.filter(status => status !== currentStatus);
  };

  // Get status display name
  const getStatusDisplayName = (status: string) => {
    // Handle CANCEL vs CANCELLED inconsistency
    if (status === 'CANCEL' || status === 'CANCELED') {
      return 'Đã hủy';
    }
    
    const statusNames: Record<string, string> = {
      'NEW': 'Mới',
      'CONFIRMED': 'Đã xác nhận',
      'PREPARING': 'Shop đang chuẩn bị hàng',
      'SHIPPING': 'Đang giao hàng',
      'DELIVERED': 'Đã giao hàng',
      'CANCELLED': 'Đã hủy',
      'CANCELLATION_REQUESTED': 'Yêu cầu hủy'
    };
    
    return statusNames[status] || status;
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShoppingCart className="w-8 h-8 text-gray-600" />
          <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
            {/* Socket.IO Connection Status */}
            <div className="flex items-center space-x-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-xs text-gray-500">
                {isConnected ? 'Kết nối thời gian thực' : 'Chế độ tải thủ công'}
              </span>
              {connectionError && (
                <span className="text-xs text-red-500">({connectionError})</span>
              )}
            </div>
            <p className="text-gray-600 text-sm">Quản lý đơn hàng của cửa hàng</p>
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
          <a 
            href="/debug/socketio"
            target="_blank"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Debug Socket.IO</span>
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">{allOrders.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã xác nhận</p>
              <p className="text-2xl font-bold text-gray-900">
                {statusCounts.CONFIRMED || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shop đang chuẩn bị hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {statusCounts.PREPARING || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đang giao hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {statusCounts.SHIPPING || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã giao hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {statusCounts.DELIVERED || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã hủy</p>
              <p className="text-2xl font-bold text-gray-900">
                {statusCounts.CANCELLED || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yêu cầu hủy</p>
              <p className="text-2xl font-bold text-gray-900">
                {statusCounts.CANCELLATION_REQUESTED || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đơn hàng mới</p>
              <p className="text-2xl font-bold text-gray-900">
                {statusCounts.NEW || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
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
              <option value="PREPARING">Shop đang chuẩn bị hàng</option>
              <option value="SHIPPING">Đang giao hàng</option>
              <option value="DELIVERED">Đã giao hàng</option>
              <option value="CANCELLED">Đã hủy</option>
              <option value="CANCELLATION_REQUESTED">Yêu cầu hủy</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Lọc</span>
        </button>
          </div>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Đang tải đơn hàng...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={handleRefresh}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Danh sách đơn hàng ({filteredOrders.length})
          </h3>
        </div>
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
              {filteredOrders.map((order) => {
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
                      <div className="relative">
                        {/* Status Dropdown with colored badge */}
                        {getAllStatuses(order.status).length > 0 ? (
                          <select
                            value={order.status}
                            onChange={(e) => {
                              if (e.target.value && e.target.value !== order.status) {
                                handleStatusChange(order.orderId, e.target.value);
                              }
                            }}
                            disabled={updatingStatus === order.orderId}
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] ${getStatusColor(order.status)}`}
                            style={{
                              appearance: 'none',
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 8px center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '16px',
                              paddingRight: '32px'
                            }}
                          >
                            <option value={order.status} disabled>
                              {getStatusText(order.status)}
                            </option>
                            {getAllStatuses(order.status).map((status: string) => (
                              <option key={status} value={status}>
                                {getStatusText(status)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {getStatusText(order.status)}
                          </span>
                        )}
                        
                        {updatingStatus === order.orderId && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
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
              })}
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
    </div>
  );
}
