"use client";

import React from "react";
import { motion } from "framer-motion";
import { Order } from "@/types/order";
import Link from "next/link";

interface CheckoutSuccessProps {
  order: Order;
}

export function CheckoutSuccess({ order }: CheckoutSuccessProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <div className="text-4xl">✅</div>
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Đặt hàng thành công!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-600 mb-8"
          >
            Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được xác nhận.
          </motion.p>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Thông tin đơn hàng
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-medium text-gray-900">
                  {order.orderNumber}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Ngày đặt:</span>
                <span className="text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.status === 'confirmed'
                    ? 'bg-blue-100 text-blue-800'
                    : order.status === 'shipped'
                    ? 'bg-purple-100 text-purple-800'
                    : order.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.status === 'pending' && 'Chờ xác nhận'}
                  {order.status === 'confirmed' && 'Đã xác nhận'}
                  {order.status === 'shipped' && 'Đang giao hàng'}
                  {order.status === 'delivered' && 'Đã giao hàng'}
                  {order.status === 'cancelled' && 'Đã hủy'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Phương thức thanh toán:</span>
                <span className="text-gray-900">
                  {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                <span className="text-gray-900">Tổng tiền:</span>
                <span className="text-blue-600">
                  {order.totalAmount.toLocaleString()}₫
                </span>
              </div>
            </div>
          </motion.div>

          {/* Shipping Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Thông tin giao hàng
            </h2>

            <div className="space-y-2">
              <p className="text-gray-900">
                <span className="font-medium">{order.shippingInfo.customerName}</span>
              </p>
              <p className="text-gray-600">
                {order.shippingInfo.customerPhone}
              </p>
              <p className="text-gray-600">
                {order.shippingInfo.shippingAddress}, {order.shippingInfo.ward}, {order.shippingInfo.district}, {order.shippingInfo.city}
              </p>
              {order.shippingInfo.notes && (
                <p className="text-gray-500 text-sm mt-2">
                  <span className="font-medium">Ghi chú:</span> {order.shippingInfo.notes}
                </p>
              )}
            </div>
          </motion.div>

          {/* COD Notice */}
          {order.paymentMethod === 'COD' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8"
            >
              <div className="flex items-start space-x-3">
                <div className="text-yellow-500 text-2xl">💰</div>
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    Thông tin thanh toán COD
                  </h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Bạn sẽ thanh toán {order.totalAmount.toLocaleString()}₫ khi nhận hàng</li>
                    <li>• Vui lòng kiểm tra hàng hóa trước khi thanh toán</li>
                    <li>• Thời gian giao hàng: 1-3 ngày làm việc</li>
                    <li>• Nhân viên giao hàng sẽ liên hệ trước khi giao</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/orders"
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Xem đơn hàng của tôi
            </Link>
            <Link
              href="/products"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Tiếp tục mua sắm
            </Link>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-8 p-4 bg-gray-50 rounded-lg"
          >
            <p className="text-sm text-gray-600">
              Có câu hỏi? Liên hệ chúng tôi qua{' '}
              <a href="tel:0123456789" className="text-blue-600 hover:underline">
                0123 456 789
              </a>
              {' '}hoặc{' '}
              <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                support@example.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
