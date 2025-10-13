'use client';

import React, { useState, useEffect } from 'react';
import { X, Ticket, Check, Percent, Users, RefreshCw, Search } from 'lucide-react';
import { voucherAPI } from '@/lib/api';
import { Voucher } from '@/types/voucher';

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoucher: Voucher | null;
  onVoucherSelect: (voucher: Voucher | null) => void;
  orderTotal: number;
}

interface VoucherWithStatus extends Voucher {
  isApplicable: boolean;
  reason?: string;
  discountAmount: number;
}

export function VoucherModal({ 
  isOpen, 
  onClose, 
  selectedVoucher, 
  onVoucherSelect, 
  orderTotal 
}: VoucherModalProps) {
  const [vouchers, setVouchers] = useState<VoucherWithStatus[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<VoucherWithStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load vouchers when modal opens
  useEffect(() => {
    if (isOpen) {
      loadVouchers();
    }
  }, [isOpen, orderTotal]);

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
      setFilteredVouchers(processedVouchers);
    } catch (err: any) {
      setError('Không thể tải danh sách voucher');
      console.error('Error loading vouchers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter vouchers based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredVouchers(vouchers);
    } else {
      const filtered = vouchers.filter(voucher => 
        voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.discountType.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVouchers(filtered);
    }
  }, [searchTerm, vouchers]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleVoucherSelect = (voucher: VoucherWithStatus) => {
    if (voucher.isApplicable) {
      onVoucherSelect(voucher);
      onClose();
    }
  };

  const handleRemoveVoucher = () => {
    onVoucherSelect(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Chọn Voucher Giảm Giá</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Search Bar - Fixed at top */}
        <div className="p-6 pt-4 pb-4 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm voucher theo mã, mô tả hoặc loại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600">
              Tìm thấy {filteredVouchers.length} voucher{filteredVouchers.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-0">

          {/* Selected Voucher Info */}
          {selectedVoucher && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Ticket className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-green-800">
                      Voucher đã chọn: {selectedVoucher.code}
                    </div>
                    <div className="text-sm text-green-600">
                      {selectedVoucher.description}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleRemoveVoucher}
                  className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Đang tải voucher...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={loadVouchers}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredVouchers.length === 0 && (
            <div className="text-center py-12">
              <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'Không tìm thấy voucher nào phù hợp' : 'Không có voucher nào'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          )}

          {/* Voucher List */}
          {!loading && !error && filteredVouchers.length > 0 && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Có thể chọn 1 Voucher
              </div>
              
              {filteredVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                    voucher.isApplicable 
                      ? 'border-green-200 hover:border-green-300 cursor-pointer' 
                      : 'border-gray-200 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleVoucherSelect(voucher)}
                    disabled={!voucher.isApplicable}
                    className="w-full"
                  >
                    {/* Voucher Card */}
                    <div className="flex h-28">
                      {/* Left Teal Section */}
                      <div className={`flex-1 flex flex-col justify-center items-center text-white relative ${
                        voucher.isApplicable 
                          ? 'bg-gradient-to-br from-teal-400 to-teal-500' 
                          : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      }`}>
                        {/* Perforated Edge */}
                        <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col justify-center">
                          <div className="space-y-1">
                            {[...Array(10)].map((_, i) => (
                              <div key={i} className="w-2 h-2 bg-white rounded-full opacity-30"></div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Voucher Type */}
                        <div className="text-center px-4">
                          <div className="text-xl font-bold">
                            {voucher.discountType === 'freeship' ? 'FREE SHIP' : 
                             voucher.discountType === 'percentage' ? `${voucher.discountValue}% OFF` : 
                             'DISCOUNT'}
                          </div>
                          <div className="text-xs opacity-90 mt-1">
                            HCMUTE GIFT SHOP
                          </div>
                        </div>
                      </div>

                      {/* Right White Section */}
                      <div className="flex-1 bg-white p-4 flex flex-col justify-between">
                        <div>
                          {/* Discount Amount */}
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-lg font-bold ${
                              voucher.isApplicable ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              Giảm tối đa {formatCurrency(voucher.discountAmount)}
                            </span>
                            {voucher.usageLimit > 0 && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                x {voucher.usageLimit - voucher.usedCount}
                              </span>
                            )}
                          </div>
                          
                          {/* Minimum Order */}
                          <div className={`text-sm mb-2 ${
                            voucher.isApplicable ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            Đơn tối thiểu {formatCurrency(parseFloat(voucher.minOrderValue))}
                          </div>
                          
                          {/* Expiry Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs ${
                                voucher.isApplicable ? 'text-orange-600' : 'text-gray-400'
                              }`}>
                                {(() => {
                                  const now = new Date();
                                  const endDate = new Date(voucher.endDate);
                                  const diffTime = endDate.getTime() - now.getTime();
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                  
                                  if (diffDays <= 0) return 'Đã hết hạn';
                                  if (diffDays === 1) return 'Sắp hết hạn: Còn 1 ngày';
                                  return `Còn ${diffDays} ngày`;
                                })()}
                              </span>
                              <button 
                                type="button"
                                className="text-xs text-blue-600 hover:text-blue-800"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle conditions click
                                }}
                              >
                                Điều kiện
                              </button>
                            </div>
                            
                            {/* Radio Button */}
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedVoucher?.id === voucher.id
                                ? 'border-green-500 bg-green-500' 
                                : voucher.isApplicable 
                                ? 'border-green-500' 
                                : 'border-gray-300'
                            }`}>
                              {selectedVoucher?.id === voucher.id && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Warning for non-applicable vouchers */}
                  {!voucher.isApplicable && voucher.reason && (
                    <div className="bg-orange-50 border-t border-orange-200 p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">i</span>
                        </div>
                        <span className="text-sm text-orange-700">{voucher.reason}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Trở lại
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
