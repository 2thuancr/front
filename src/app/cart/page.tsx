"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchCart,
  removeFromCart,
  updateQuantity,
  reapplyVoucher,
} from "@/store/cartSlice";
import Link from "next/link";
import { CartItem } from "@/types/cart";
import { motion, AnimatePresence } from "framer-motion";
import VoucherModal from "@/components/ui/VoucherModal";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: cart,
    loading,
    error,
    appliedVoucher,
    discount,
    grandTotal,
  } = useSelector((state: RootState) => state.cart);
  const userId = useSelector((state: RootState) => state.user?.profile?.id);

  const [showVoucherModal, setShowVoucherModal] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId)).then(() => {
        dispatch(reapplyVoucher());
      });
    }
  }, [dispatch, userId]);

  const handleRemove = (itemId: number) => {
    dispatch(removeFromCart(itemId)).then(() => {
      dispatch(reapplyVoucher());
    });
  };

  const handleUpdateQty = (itemId: number, qty: number) => {
    if (qty <= 0) return;
    dispatch(updateQuantity({ itemId, quantity: qty })).then(() => {
      dispatch(reapplyVoucher());
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-red-50 rounded-xl shadow-lg"
        >
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <button
            onClick={() => userId && dispatch(fetchCart(userId))}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Thử lại
          </button>
        </motion.div>
      </div>
    );

  if (!cart || cart.cartItems.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-white rounded-xl shadow-lg"
        >
          <p className="text-gray-600 text-lg font-medium">Giỏ hàng trống</p>
          <Link
            href="/products"
            className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Tiếp tục mua sắm
          </Link>
        </motion.div>
      </div>
    );

  const total = cart.cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12"
        >
          Giỏ hàng của bạn
        </motion.h1>

        <AnimatePresence>
          {cart.cartItems.map((item: CartItem) => (
            <motion.div
              key={item.cartItemId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 mb-6"
            >
              <div className="flex items-center gap-4 w-full sm:w-2/3">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {item.name}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {(item.price * item.quantity).toLocaleString()}₫
                  </p>
                  <p className="text-sm text-gray-500">
                    Đơn giá: {item.price.toLocaleString()}₫
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() =>
                      handleUpdateQty(item.cartItemId, item.quantity - 1)
                    }
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-gray-200 transition text-gray-700"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQty(item.cartItemId, item.quantity + 1)
                    }
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-gray-200 transition text-gray-700"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(item.cartItemId)}
                  className="text-red-500 hover:text-red-600 font-medium transition flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Xóa
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Nút mở modal voucher */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Mã giảm giá
            </p>
            <button
              onClick={() => setShowVoucherModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition w-full sm:w-auto"
            >
              Chọn mã giảm giá
            </button>
            {appliedVoucher && (
              <p className="mt-2 text-sm text-green-700">
                Đã áp mã{" "}
                <span className="font-semibold">{appliedVoucher.code}</span>
              </p>
            )}
          </div>
        </div>

        {/* Tổng kết với voucher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm"
        >
          <div className="w-full sm:w-auto space-y-1">
            <p className="text-gray-700">
              Tạm tính:{" "}
              <span className="font-semibold">
                {total.toLocaleString()}₫
              </span>
            </p>
            <p className="text-gray-700">
              Giảm giá:{" "}
              <span className="font-semibold">
                -{Number(discount || 0).toLocaleString()}₫
              </span>
              {appliedVoucher ? ` (Mã: ${appliedVoucher.code})` : ""}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              Thành tiền: {Number(grandTotal || total).toLocaleString()}₫
            </p>
          </div>

          <Link
            href="/checkout"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-200 mt-4 sm:mt-0"
          >
            Thanh toán ngay
          </Link>
        </motion.div>
      </div>

      {/* Modal chọn hoặc nhập voucher */}
      <VoucherModal
        open={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
      />
    </div>
  );
}
