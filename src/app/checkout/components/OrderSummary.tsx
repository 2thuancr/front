"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cart } from "@/types/cart";
import { CartItem } from "@/types/order";

interface OrderSummaryProps {
  checkoutItems: any[];
  discountAmount?: number;
  voucherCode?: string | null;
}

export function OrderSummary({ checkoutItems, discountAmount = 0, voucherCode }: OrderSummaryProps) {
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingFee = 30000; // Fixed shipping fee
  const discount = Math.max(0, Math.min(discountAmount, subtotal));
  const total = Math.max(0, subtotal - discount) + shippingFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6 sticky top-8"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Tóm tắt đơn hàng
      </h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {checkoutItems.map((item: any) => (
          <motion.div
            key={item.cartItemId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-400 text-xs">📦</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500">
                {item.quantity} × {item.price.toLocaleString()}₫
              </p>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {(item.price * item.quantity).toLocaleString()}₫
            </div>
          </motion.div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="text-gray-900">{subtotal.toLocaleString()}₫</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-700">
            <span>
              Giảm giá{voucherCode ? ` (${voucherCode})` : ""}:
            </span>
            <span>-{discount.toLocaleString()}₫</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <span className="text-gray-900">{shippingFee.toLocaleString()}₫</span>
        </div>
        
        <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
          <span className="text-gray-900">Tổng cộng:</span>
          <span className="text-blue-600">{total.toLocaleString()}₫</span>
        </div>
      </div>

      {/* COD Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
      >
        <div className="flex items-start space-x-2">
          <div className="text-yellow-500 text-lg">💰</div>
          <div>
            <h4 className="font-medium text-yellow-800 text-sm mb-1">
              Thanh toán COD
            </h4>
            <p className="text-xs text-yellow-700">
              Bạn sẽ thanh toán {total.toLocaleString()}₫ khi nhận hàng
            </p>
          </div>
        </div>
      </motion.div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
      >
        <div className="flex items-center space-x-2">
          <div className="text-green-500 text-sm">🔒</div>
          <p className="text-xs text-green-700">
            Thông tin của bạn được bảo mật và mã hóa
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
