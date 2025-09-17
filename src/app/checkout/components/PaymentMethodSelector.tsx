"use client";

import React from "react";
import { motion } from "framer-motion";
import { PaymentMethod } from "@/types/order";

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: number | null;
  onPaymentMethodSelect: (paymentMethodId: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PaymentMethodSelector({
  paymentMethods,
  selectedPaymentMethod,
  onPaymentMethodSelect,
  onNext,
  onBack
}: PaymentMethodSelectorProps) {
  console.log("🔍 PaymentMethodSelector render - selectedPaymentMethod:", selectedPaymentMethod);
  console.log("🔍 PaymentMethodSelector render - paymentMethods:", paymentMethods);
  const getPaymentIcon = (code: string) => {
    switch (code) {
      case 'COD':
        return '💰';
      case 'VNPAY':
        return '🏦';
      case 'MOMO':
        return '💜';
      case 'ZALOPAY':
        return '💙';
      default:
        return '💳';
    }
  };

  const getPaymentDescription = (code: string) => {
    switch (code) {
      case 'COD':
        return 'Thanh toán khi nhận hàng';
      case 'VNPAY':
        return 'Thanh toán qua VNPay';
      case 'MOMO':
        return 'Thanh toán qua MoMo';
      case 'ZALOPAY':
        return 'Thanh toán qua ZaloPay';
      default:
        return 'Phương thức thanh toán';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Chọn phương thức thanh toán
      </h2>

      <div className="space-y-4">
        {paymentMethods.map((method, index) => {
          console.log(`🔍 Rendering method ${index}:`, method, "Selected:", selectedPaymentMethod, "Is selected:", selectedPaymentMethod === method.id);
          return (
          <motion.div
            key={`payment-method-${method.id}-${index}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedPaymentMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              console.log("🔘 Payment method clicked:", method.id, "Current selected:", selectedPaymentMethod);
              console.log("🔘 Method details:", method);
              console.log("🔘 Comparison result:", selectedPaymentMethod === method.id);
              onPaymentMethodSelect(method.id);
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl">
                {getPaymentIcon(method.code)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {method.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {getPaymentDescription(method.code)}
                </p>
                {method.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {method.description}
                  </p>
                )}
              </div>
              <div 
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPaymentMethod === method.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("🔘 Radio button clicked for method:", method.id);
                }}
              >
                {selectedPaymentMethod === method.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>

      {/* COD Info */}
      {selectedPaymentMethod && paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.code === 'COD' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-start space-x-3">
            <div className="text-green-500 text-xl">ℹ️</div>
            <div>
              <h4 className="font-medium text-green-800 mb-1">
                Thông tin thanh toán COD
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Bạn sẽ thanh toán khi nhận được hàng</li>
                <li>• Kiểm tra hàng hóa trước khi thanh toán</li>
                <li>• Phí vận chuyển sẽ được tính vào tổng đơn hàng</li>
                <li>• Thời gian giao hàng: 1-3 ngày làm việc</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* E-wallet Info */}
      {selectedPaymentMethod && paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.code !== 'COD' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-start space-x-3">
            <div className="text-blue-500 text-xl">💳</div>
            <div>
              <h4 className="font-medium text-blue-800 mb-1">
                Thanh toán trực tuyến
              </h4>
              <p className="text-sm text-blue-700">
                Bạn sẽ được chuyển hướng đến trang thanh toán của nhà cung cấp để hoàn tất giao dịch.
                Đơn hàng sẽ được xác nhận ngay sau khi thanh toán thành công.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Quay lại
        </button>
        <button
          onClick={onNext}
          disabled={!selectedPaymentMethod}
          className="px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Tiếp tục
        </button>
      </div>
    </motion.div>
  );
}
