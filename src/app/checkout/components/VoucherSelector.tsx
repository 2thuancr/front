'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Ticket, Check, X, Percent, Users } from 'lucide-react';
import { voucherAPI } from '@/lib/api';
import { Voucher } from '@/types/voucher';

interface VoucherSelectorProps {
  selectedVoucher: Voucher | null;
  onVoucherSelect: (voucher: Voucher | null) => void;
  orderTotal: number;
  className?: string;
}

interface VoucherWithStatus extends Voucher {
  isApplicable: boolean;
  reason?: string;
  discountAmount: number;
}

export function VoucherSelector({ 
  selectedVoucher, 
  onVoucherSelect, 
  orderTotal,
  className = '' 
}: VoucherSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [vouchers, setVouchers] = useState<VoucherWithStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load vouchers on mount
  useEffect(() => {
    loadVouchers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await voucherAPI.getAll();
      const allVouchers = response.data || [];
      
      // Process vouchers to add status and discount amount
      const processedVouchers: VoucherWithStatus[] = allVouchers.map((voucher: Voucher) => {
        const now = new Date();
        const startDate = new Date(voucher.startDate);
        const endDate = new Date(voucher.endDate);
        const minOrderValue = parseFloat(voucher.minOrderValue);
        
        let isApplicable = true;
        let reason = '';
        let discountAmount = 0;
        
        // Check if voucher is active
        if (!voucher.isActive) {
          isApplicable = false;
          reason = 'Voucher không hoạt động';
        }
        // Check if voucher has started
        else if (now < startDate) {
          isApplicable = false;
          reason = 'Voucher chưa bắt đầu';
        }
        // Check if voucher has expired
        else if (now > endDate) {
          isApplicable = false;
          reason = 'Voucher đã hết hạn';
        }
        // Check minimum order value
        else if (orderTotal < minOrderValue) {
          isApplicable = false;
          reason = `Đơn hàng tối thiểu ${formatCurrency(minOrderValue)}`;
        }
        // Check usage limit
        else if (voucher.usedCount >= voucher.usageLimit) {
          isApplicable = false;
          reason = 'Voucher đã hết lượt sử dụng';
        }
        // Calculate discount amount
        else {
          if (voucher.discountType === 'percentage') {
            const percentage = parseFloat(voucher.discountValue || '0');
            discountAmount = (orderTotal * percentage) / 100;
            if (voucher.maxDiscount) {
              discountAmount = Math.min(discountAmount, parseFloat(voucher.maxDiscount));
            }
          } else if (voucher.discountType === 'fixed') {
            discountAmount = parseFloat(voucher.discountValue || '0');
          } else if (voucher.discountType === 'freeship') {
            discountAmount = 30000; // Assuming shipping fee is 30k
          }
        }
        
        return {
          ...voucher,
          isApplicable,
          reason,
          discountAmount
        };
      });
      
      setVouchers(processedVouchers);
    } catch (err: any) {
      setError('Không thể tải danh sách voucher');
      console.error('Error loading vouchers:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getVoucherTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4" />;
      case 'freeship':
        return <Users className="w-4 h-4" />;
      default:
        return <Ticket className="w-4 h-4" />;
    }
  };

  const getVoucherTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'Giảm %';
      case 'freeship':
        return 'Miễn phí ship';
      default:
        return 'Giảm tiền';
    }
  };

  const handleVoucherSelect = (voucher: VoucherWithStatus) => {
    if (voucher.isApplicable) {
      onVoucherSelect(voucher);
      setIsOpen(false);
    }
  };

  const handleRemoveVoucher = () => {
    onVoucherSelect(null);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="space-y-2">
        <h3 className="font-medium text-gray-900">Voucher:</h3>
        
        {/* Selected Voucher Display */}
        {selectedVoucher ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Ticket className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-green-800">
                  {selectedVoucher.code}
                </div>
                <div className="text-sm text-green-600">
                  {selectedVoucher.description}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
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
                className="p-1 text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Dropdown Trigger */
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Ticket className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">
                Chọn voucher giảm giá
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Đang tải voucher...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={loadVouchers}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Thử lại
              </button>
            </div>
          ) : vouchers.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">Không có voucher nào</p>
            </div>
          ) : (
            <div className="py-2">
              {vouchers.map((voucher) => (
                <button
                  key={voucher.id}
                  type="button"
                  onClick={() => handleVoucherSelect(voucher)}
                  disabled={!voucher.isApplicable}
                  className={`w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors ${
                    !voucher.isApplicable 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      voucher.isApplicable 
                        ? 'bg-blue-100' 
                        : 'bg-gray-100'
                    }`}>
                      {getVoucherTypeIcon(voucher.discountType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${
                          voucher.isApplicable 
                            ? 'text-gray-900' 
                            : 'text-gray-400'
                        }`}>
                          {voucher.code}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          voucher.isApplicable 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {getVoucherTypeLabel(voucher.discountType)}
                        </span>
                      </div>
                      <div className={`text-sm ${
                        voucher.isApplicable 
                          ? 'text-gray-600' 
                          : 'text-gray-400'
                      }`}>
                        {voucher.description}
                      </div>
                      {!voucher.isApplicable && voucher.reason && (
                        <div className="text-xs text-red-500 mt-1">
                          {voucher.reason}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {voucher.isApplicable && (
                      <span className="text-sm font-medium text-green-600">
                        -{formatCurrency(voucher.discountAmount)}
                      </span>
                    )}
                    {voucher.isApplicable ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
