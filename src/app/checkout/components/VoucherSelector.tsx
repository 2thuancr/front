'use client';

import React, { useState } from 'react';
import { Ticket, ChevronRight } from 'lucide-react';
import { Voucher } from '@/types/voucher';
import { VoucherModal } from './VoucherModal';

interface VoucherSelectorProps {
  selectedVoucher: Voucher | null;
  onVoucherSelect: (voucher: Voucher | null) => void;
  orderTotal: number;
  className?: string;
}

export function VoucherSelector({ 
  selectedVoucher, 
  onVoucherSelect, 
  orderTotal,
  className = '' 
}: VoucherSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRemoveVoucher = () => {
    onVoucherSelect(null);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-medium text-gray-900">Voucher giảm giá:</h3>
      
      {/* Voucher Selection Button */}
      <button
        type="button"
        onClick={handleOpenModal}
        className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Ticket className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            {selectedVoucher ? (
              <>
                <div className="font-medium text-gray-900">
                  <span className="font-bold tracking-wider">{selectedVoucher.code}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {selectedVoucher.description}
                </div>
              </>
            ) : (
              <>
                <div className="font-medium text-gray-900">
                  Chọn voucher giảm giá
                </div>
                <div className="text-sm text-gray-500">
                  Nhấn để xem danh sách voucher
                </div>
              </>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>

      {/* Selected Voucher Details */}
      {selectedVoucher && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Ticket className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-green-800">
                  Voucher: <span className="font-bold tracking-wider">{selectedVoucher.code}</span>
                </div>
                <div className="text-sm text-green-600">
                  {selectedVoucher.description}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-green-800">
                -{formatCurrency(
                  selectedVoucher.discountType === 'percentage' 
                    ? Math.min(
                        (orderTotal * parseFloat(selectedVoucher.discountValue || '0')) / 100,
                        parseFloat(selectedVoucher.maxDiscount || '0') || Infinity
                      )
                    : selectedVoucher.discountType === 'freeship'
                    ? 30000
                    : parseFloat(selectedVoucher.discountValue || '0')
                )}
              </span>
              <button
                onClick={handleRemoveVoucher}
                className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      <VoucherModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedVoucher={selectedVoucher}
        onVoucherSelect={onVoucherSelect}
        orderTotal={orderTotal}
      />
    </div>
  );
}