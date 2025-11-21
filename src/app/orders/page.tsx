'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, Truck, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useCustomerOrderSync } from '@/hooks/useOrderStatusSync';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Cấu hình trạng thái đơn hàng
const statusConfig = {
  NEW: { label: 'Đơn hàng mới', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  PREPARING: { label: 'Shop đang chuẩn bị hàng', color: 'bg-purple-100 text-purple-800', icon: Package },
  SHIPPING: { label: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  DELIVERED: { label: 'Đã giao hàng', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle },
  CANCELLATION_REQUESTED: { label: 'Yêu cầu hủy', color: 'bg-orange-100 text-orange-800', icon: Clock },
};

// Helper lấy userId tùy loại tài khoản
const getUserId = (user: any): number | undefined => {
  if (!user) return undefined;
  if ('id' in user) return user.id;
  if ('adminId' in user) return user.adminId;
  if ('vendorId' in user) return user.vendorId;
  return undefined;
};

export default function OrdersPage() {
  const { isAuthenticated, user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const hasFetchedRef = useRef(false);

  // Cập nhật bộ đếm trạng thái
  const updateStatusCounts = (orders: any[]) => {
    const counts: Record<string, number> = {};
    Object.keys(statusConfig).forEach(status => {
      counts[status] = orders.filter(o => o.status === status).length;
    });
    setStatusCounts(counts);
  };

  // Đồng bộ trạng thái đơn hàng theo thời gian thực
  const { isConnected, connectionError } = useCustomerOrderSync({
    onStatusUpdate: (update) => {
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order =>
          order.orderId === update.orderId ? { ...order, status: update.status } : order
        );
        updateStatusCounts(updatedOrders);
        return updatedOrders;
      });
    },
  });

  // Polling fallback nếu socket không hoạt động
  useEffect(() => {
    if (!isConnected && orders.length > 0) {
      const pollInterval = setInterval(async () => {
        try {
          if (!user) return;
          const userId = getUserId(user);
          if (!userId) return;

          const res = await axios.get(`${API_BASE}/orders/user/${userId}?page=1&limit=10`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const fetchedOrders = res.data.orders || [];

          const normalizedOrders = fetchedOrders.map((order: any) => {
            if (order.status === 'CANCELED' || order.status === 'CANCEL')
              return { ...order, status: 'CANCELLED' };
            return order;
          });

          const currentIds = orders.map(o => o.orderId).sort();
          const fetchedIds = normalizedOrders.map((o: any) => o.orderId).sort();

          if (JSON.stringify(currentIds) !== JSON.stringify(fetchedIds)) {
            setOrders(normalizedOrders);
            updateStatusCounts(normalizedOrders);
          }
        } catch (error) {
          console.error('❌ Polling error:', error);
        }
      }, 5000);

      return () => clearInterval(pollInterval);
    }
  }, [isConnected, orders, user, token]);

  // Fetch danh sách đơn
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async (force = false) => {
    if (!user) return;
    const userId = getUserId(user);
    if (!userId) return;
    if (!force && hasFetchedRef.current && orders.length > 0) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/orders/user/${userId}?page=1&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedOrders = res.data.orders || [];
      const normalizedOrders = fetchedOrders.map((order: any) => {
        if (order.status === 'CANCELED' || order.status === 'CANCEL')
          return { ...order, status: 'CANCELLED' };
        return order;
      });

      setOrders(normalizedOrders);
      updateStatusCounts(normalizedOrders);
    } catch (err) {
      console.error('Lỗi load orders', err);
    } finally {
      setLoading(false);
    }
  };

  // Hủy đơn hàng
  const cancelOrder = async (orderId: string) => {
    try {
      await axios.patch(`${API_BASE}/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders(true);
    } catch (err: any) {
      console.error('❌ Customer order cancellation failed:', err);
      alert(err.response?.data?.message || 'Không thể hủy đơn');
    }
  };

  // Format tiền & ngày
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('vi-VN');

  // Lọc theo trạng thái
  const filteredOrders =
    selectedStatus === 'all' ? orders : orders.filter(o => o.status === selectedStatus);

  // Lấy icon/màu/nhãn trạng thái
  const getStatusIcon = (status: string) =>
    statusConfig[status as keyof typeof statusConfig]?.icon || Clock;
  const getStatusColor = (status: string) =>
    statusConfig[status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800';
  const getStatusLabel = (status: string) =>
    statusConfig[status as keyof typeof statusConfig]?.label || status;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Đang chuyển hướng...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đơn hàng của tôi</h1>
          <p className="text-gray-600">Theo dõi và quản lý các đơn hàng của bạn</p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-xs text-gray-500">
              {isConnected ? 'Cập nhật thời gian thực' : 'Chế độ tải thủ công'}
            </span>
            {connectionError && <span className="text-xs text-red-500">({connectionError})</span>}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Tất cả ({orders.length})
          </button>
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = statusCounts[status] || 0;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedStatus === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {loading ? (
            <p>Đang tải đơn hàng...</p>
          ) : filteredOrders.length === 0 ? (
            <Card className="text-center py-12">Không có đơn hàng nào</Card>
          ) : (
            <AnimatePresence>
              {filteredOrders.map((order, index) => {
                // ---- TÍNH TỔNG TIỀN + VOUCHER ----
                let orderTotal =
                  order.totalAmount ??
                  order.orderDetails?.reduce(
                    (sum: number, d: any) => sum + d.unitPrice * d.quantity,
                    0
                  ) ??
                  0;

                // Áp dụng voucher nếu có
                if (order.voucher) {
                  const { discountType, discountValue, maxDiscount } = order.voucher;
                  if (discountType === 'percentage') {
                    const discount = Math.min(orderTotal * (discountValue / 100), maxDiscount || Infinity);
                    orderTotal -= discount;
                  } else if (discountType === 'fixed') {
                    orderTotal -= discountValue;
                  }
                }

                if (orderTotal < 0) orderTotal = 0;

                return (
                  <motion.div
                    key={order.orderId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="shadow-lg hover:shadow-xl">
                      <div className="p-6">
                        {/* Header đơn */}
                        <div className="flex justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Package className="w-5 h-5 text-gray-600" />
                            <span className="font-semibold">#{order.orderId}</span>
                            <span className="text-gray-500">•</span>
                            <span>{formatDate(order.orderDate)}</span>
                          </div>
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {React.createElement(getStatusIcon(order.status), { className: 'w-4 h-4' })}
                            <span>{getStatusLabel(order.status)}</span>
                          </div>
                        </div>

                        {/* Chi tiết sản phẩm */}
                        <div className="space-y-2 mb-4">
                          {order.orderDetails?.map((detail: any, idx: number) => (
                            <div key={`${order.orderId}-${detail.productId || detail.id || idx}`} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={detail.product?.images?.[0]?.imageUrl || 'https://picsum.photos/200'}
                                  alt={detail.product?.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <span>{detail.product?.name} × {detail.quantity}</span>
                              </div>
                              <span>{formatPrice(detail.unitPrice * detail.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Tóm tắt */}
                        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                          <div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Truck className="w-4 h-4" />
                              <span>{order.shippingAddress}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                              <CreditCard className="w-4 h-4" />
                              <span>
                                {order.paymentMethod === 'COD'
                                  ? 'Thanh toán khi nhận hàng'
                                  : order.paymentMethod}
                              </span>
                            </div>
                            {order.voucher && (
                              <p className="text-sm text-green-600 mt-2">
                                Đã áp dụng voucher: <strong>{order.voucher.code}</strong>
                              </p>
                            )}
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            Tổng cộng: {formatPrice(orderTotal)}
                          </p>
                        </div>

                        {/* Hành động */}
                        <div className="flex justify-end mt-4 space-x-3">
                          <Link
                            href={`/orders/${order.orderId}`}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                          >
                            Xem chi tiết
                          </Link>
                          {(order.status === 'NEW' ||
                            order.status === 'CONFIRMED' ||
                            order.status === 'PREPARING') && (
                            <Button
                              label="Hủy đơn"
                              className="bg-red-500 text-white"
                              onClick={() => cancelOrder(order.orderId)}
                            />
                          )}
                          {order.status === 'DELIVERED' && (
                            <Button
                              label="Đánh giá"
                              className="bg-green-500 text-white"
                              onClick={() => alert('Chức năng đánh giá')}
                            />
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
