"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAvailableVouchers,
  applyVoucher,
  clearVoucher,
} from "@/store/cartSlice";

export default function VoucherModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    availableVouchers,
    loadingVouchers,
    appliedVoucher,
    applyingVoucher,
    voucherError,
  } = useSelector((state: RootState) => state.cart);

  const [codeInput, setCodeInput] = useState("");

  useEffect(() => {
    if (open) dispatch(fetchAvailableVouchers());
  }, [open, dispatch]);

  const handleApply = (code: string) => {
    dispatch(applyVoucher(code)).then(() => onClose());
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Áp dụng mã giảm giá
          </h2>

          {/* Nhập mã thủ công */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhập mã voucher
            </label>
            <div className="flex gap-2">
              <input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="VD: HELLO10"
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => codeInput && handleApply(codeInput)}
                disabled={applyingVoucher}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {applyingVoucher ? "Đang áp..." : "Áp dụng"}
              </button>
            </div>
            {voucherError && (
              <p className="mt-2 text-sm text-red-600">{voucherError}</p>
            )}
            {appliedVoucher && (
              <p className="mt-2 text-sm text-green-700">
                Đã áp mã{" "}
                <span className="font-semibold">{appliedVoucher.code}</span>
              </p>
            )}
          </div>

          {/* Danh sách voucher có sẵn */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Hoặc chọn voucher có sẵn
              </h3>
              <button
                onClick={() => dispatch(fetchAvailableVouchers())}
                className="text-blue-600 text-sm hover:underline"
              >
                Làm mới
              </button>
            </div>

            {loadingVouchers ? (
              <p className="text-sm text-gray-500">Đang tải...</p>
            ) : availableVouchers.length === 0 ? (
              <p className="text-sm text-gray-500">Không có voucher nào khả dụng</p>
            ) : (
              <div className="max-h-72 overflow-y-auto pr-1 space-y-3">
                {availableVouchers.map((v: any) => (
                  <motion.div
                    key={v.id}
                    whileHover={{ scale: 1.02 }}
                    className={`border rounded-xl p-4 cursor-pointer transition ${
                      appliedVoucher?.code === v.code
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-400"
                    }`}
                    onClick={() => handleApply(v.code)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{v.code}</p>
                        <p className="text-sm text-gray-600">{v.name}</p>
                      </div>
                      <span className="text-blue-600 font-semibold">
                        {v.discountType === "PERCENT"
                          ? `-${v.discountValue}%`
                          : `-${Number(v.discountValue).toLocaleString()}₫`}
                      </span>
                    </div>
                    {v.minOrderValue > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Đơn tối thiểu {Number(v.minOrderValue).toLocaleString()}₫
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Gỡ mã */}
          {appliedVoucher && (
            <div className="mt-6 text-center">
              <button
                onClick={() => dispatch(clearVoucher())}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition"
              >
                Gỡ mã hiện tại
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
