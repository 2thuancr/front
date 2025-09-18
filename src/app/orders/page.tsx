'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, Eye, Truck, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Config API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const statusConfig = {
  NEW: { label: 'Đơn hàng mới', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  PREPARING: { label: 'Shop đang chuẩn bị hàng', color: 'bg-purple-100 text-purple-800', icon: Package },
  SHIPPING: { label: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  DELIVERED: { label: 'Đã giao hàng', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle },
  CANCEL_REQUESTED: { label: 'Yêu cầu hủy', color: 'bg-orange-100 text-orange-800', icon: Clock },
};

export default function OrdersPage() {
  const { isAuthenticated, user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchOrders();
    }
  }, [isAuthenticated, user, router]);

  // Gọi API lấy danh sách đơn
  const fetchOrders = async () => {
    if (!user) {
    console.log("⚠️ User chưa load xong");
    return;
    }
    console.log("🔑 User ID:", user.id);
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/orders/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
      setOrders(res.data.orders);
    } catch (err) {
      console.error('Lỗi load orders', err);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API hủy đơn
  const cancelOrder = async (orderId: string) => {
    try {
      await axios.patch(`${API_BASE}/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders(); // refresh danh sách
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể hủy đơn');
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('vi-VN');

  const filteredOrders =
    selectedStatus === 'all' ? orders : orders.filter((order) => order.status === selectedStatus);

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return config ? config.icon : Clock;
  };

  const getStatusColor = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return config ? config.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return config ? config.label : status;
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Đơn hàng của tôi</h1>

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
            const count = orders.filter((o) => o.status === status).length;
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
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="shadow-lg hover:shadow-xl">
                  <div className="p-6">
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

                    {/* Items */}
                    <div className="space-y-2 mb-4">
                      {order.orderDetails?.map((detail: any) => (
                        <div key={detail.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center space-x-3">
                            <img
                              // src={detail.product?.images?.find((img: any) => img.isPrimary)?.imageUrl 
                              //   || detail.product?.images?.[0]?.imageUrl 
                              //   || 'https://picsum.photos/200'}
                              src={'https://picsum.photos/200'}
                              alt={detail.product?.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span>{detail.product?.name} × {detail.quantity}</span>
                          </div>
                          <span>{formatPrice(detail.unitPrice * detail.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center">
                      <p className="font-bold">Tổng: {formatPrice(order.totalAmount)}</p>
                      {(order.status === 'NEW' || order.status === 'CONFIRMED' || order.status === 'PREPARING') && (
                        <Button
                          label="Hủy đơn"
                          className="bg-red-500 text-white"
                          onClick={() => cancelOrder(order.orderId)}
                        />
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
