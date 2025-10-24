"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchOrderById, cancelOrder } from "@/store/orderSlice";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { OrderItem } from "@/types/order";

export default function OrderDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = useParams();
  const orderId = parseInt(id as string);

  const { currentOrder, ordersLoading, ordersError } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  const handleCancelOrder = async () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      try {
        await dispatch(cancelOrder(orderId)).unwrap();
        router.push("/orders");
      } catch (error) {
        console.error("Cancel order error:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Đơn hàng của bạn đang chờ xác nhận từ cửa hàng.';
      case 'confirmed':
        return 'Đơn hàng đã được xác nhận và đang được chuẩn bị.';
      case 'shipped':
        return 'Đơn hàng đang được vận chuyển đến bạn.';
      case 'delivered':
        return 'Đơn hàng đã được giao thành công.';
      case 'cancelled':
        return 'Đơn hàng đã bị hủy.';
      default:
        return '';
    }
  };

  if (ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (ordersError || !currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-red-50 rounded-xl shadow-lg"
        >
          <p className="text-red-600 text-lg font-medium">
            {ordersError || "Không tìm thấy đơn hàng"}
          </p>
          <Link
            href="/orders"
            className="mt-4 inline-block px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Quay lại danh sách đơn hàng
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Đơn hàng #{currentOrder.orderNumber}
              </h1>
              <p className="text-gray-600">
                Đặt ngày {new Date(currentOrder.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <Link
              href="/orders"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              ← Quay lại
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}>
              {getStatusText(currentOrder.status)}
            </span>
            <p className="text-sm text-gray-600">
              {getStatusDescription(currentOrder.status)}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sản phẩm đã đặt
              </h2>
              <div className="space-y-4">
                {(currentOrder.orderItems || currentOrder.orderDetails || []).map((item: OrderItem) => {
                  // Handle different field names from backend
                  const itemId = item.orderItemId || item.orderDetailId || item.productId;
                  const productName = item.productName || item.product?.productName || 'Sản phẩm';
                  const price = item.price || item.unitPrice || item.product?.price || 0;
                  const totalPrice = item.totalPrice || (price * item.quantity);
                  const imageUrl = item.imageUrl || item.product?.images?.find(img => img.isPrimary)?.imageUrl;
                  
                  return (
                    <div key={itemId} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={productName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-gray-400 text-lg">📦</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{productName}</h3>
                        <p className="text-sm text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {totalPrice.toLocaleString()}₫
                        </p>
                        <p className="text-sm text-gray-500">
                          {price.toLocaleString()}₫/sản phẩm
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Thông tin giao hàng
              </h2>
              {currentOrder.shippingInfo ? (
                <div className="space-y-2">
                  <p className="text-gray-900">
                    <span className="font-medium">{currentOrder.shippingInfo.customerName}</span>
                  </p>
                  <p className="text-gray-600">
                    {currentOrder.shippingInfo.customerPhone}
                  </p>
                  <p className="text-gray-600">
                    {currentOrder.shippingInfo.shippingAddress}, {currentOrder.shippingInfo.ward}, {currentOrder.shippingInfo.district}, {currentOrder.shippingInfo.city}
                  </p>
                  {currentOrder.shippingInfo.notes && (
                    <p className="text-gray-500 text-sm mt-2">
                      <span className="font-medium">Ghi chú:</span> {currentOrder.shippingInfo.notes}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Thông tin giao hàng chưa có</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Tóm tắt đơn hàng
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="text-gray-900">
                    {(currentOrder.totalAmount - 30000).toLocaleString()}₫
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="text-gray-900">30,000₫</span>
                </div>
                
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                  <span className="text-gray-900">Tổng cộng:</span>
                  <span className="text-blue-600">
                    {currentOrder.totalAmount.toLocaleString()}₫
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Payment Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin thanh toán
              </h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="text-gray-900">
                    {currentOrder.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : currentOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentOrder.paymentStatus === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : currentOrder.paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {currentOrder.paymentStatus === 'completed' ? 'Đã thanh toán' : 
                     currentOrder.paymentStatus === 'pending' ? 'Chờ thanh toán' : 'Thất bại'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              {currentOrder.status === 'pending' && (
                <button
                  onClick={handleCancelOrder}
                  className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  Hủy đơn hàng
                </button>
              )}
              
              {currentOrder.status === 'delivered' && (
                <button className="w-full px-4 py-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition">
                  Đánh giá sản phẩm
                </button>
              )}
              
              <Link
                href="/products"
                className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-center"
              >
                Tiếp tục mua sắm
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
