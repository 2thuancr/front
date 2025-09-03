'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, Eye, Truck, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

// Mock order data
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 750000,
    items: [
      {
        id: 1,
        name: 'Áo thun HCMUTE Classic',
        price: 250000,
        quantity: 2,
        image: '/images/ao-thun-hcmute.jpg',
      },
      {
        id: 2,
        name: 'Ba lô HCMUTE Premium',
        price: 450000,
        quantity: 1,
        image: '/images/ba-lo-hcmute.jpg',
      },
    ],
    shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    status: 'shipped',
    total: 380000,
    items: [
      {
        id: 3,
        name: 'Hoodie HCMUTE Winter',
        price: 380000,
        quantity: 1,
        image: '/images/hcmute-logo.png',
      },
    ],
    shippingAddress: '456 Đường XYZ, Quận 2, TP.HCM',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'ORD-003',
    date: '2024-01-08',
    status: 'processing',
    total: 120000,
    items: [
      {
        id: 4,
        name: 'Mũ nón HCMUTE',
        price: 120000,
        quantity: 1,
        image: '/images/hcmute-logo.png',
      },
    ],
    shippingAddress: '789 Đường DEF, Quận 3, TP.HCM',
    paymentMethod: 'Cash on Delivery',
  },
];

const statusConfig = {
  processing: {
    label: 'Đang xử lý',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  shipped: {
    label: 'Đã gửi hàng',
    color: 'bg-blue-100 text-blue-800',
    icon: Truck,
  },
  delivered: {
    label: 'Đã giao hàng',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState(mockOrders);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang chuyển hướng...</p>
        </div>
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
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả ({orders.length})
            </button>
            {Object.entries(statusConfig).map(([status, config]) => {
              const count = orders.filter(order => order.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {config.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Không có đơn hàng nào
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedStatus === 'all' 
                  ? 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!'
                  : `Không có đơn hàng nào với trạng thái "${getStatusLabel(selectedStatus)}"`
                }
              </p>
              <Button
                label="Mua sắm ngay"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push('/products')}
              />
            </Card>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center space-x-4 mb-2 md:mb-0">
                        <div className="flex items-center space-x-2">
                          <Package className="w-5 h-5 text-gray-600" />
                          <span className="font-semibold text-gray-900">#{order.id}</span>
                        </div>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{formatDate(order.date)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {React.createElement(getStatusIcon(order.status), { className: "w-4 h-4" })}
                          <span>{getStatusLabel(order.status)}</span>
                        </div>
                        
                        <Button
                          icon={<Eye className="w-4 h-4" />}
                          className="p-button-outlined p-button-sm"
                          tooltip="Xem chi tiết"
                        />
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray-500">
                                {formatPrice(item.price)} × {item.quantity}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2 mb-4 md:mb-0">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Truck className="w-4 h-4" />
                            <span>{order.shippingAddress}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <CreditCard className="w-4 h-4" />
                            <span>{order.paymentMethod}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            Tổng cộng: {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>
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
