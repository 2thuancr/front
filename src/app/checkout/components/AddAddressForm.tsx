"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShippingInfo } from "@/types/order";

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  ward: string;
  isDefault: boolean;
  type: 'home' | 'office';
}

interface AddAddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: ShippingInfo) => void;
  editingAddress?: Address | null;
}

export function AddAddressForm({ isOpen, onClose, onSave, editingAddress }: AddAddressFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    ward: "",
    type: 'home' as 'home' | 'office',
    isDefault: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Điền dữ liệu khi editingAddress thay đổi
  useEffect(() => {
    if (editingAddress) {
      setFormData({
        name: editingAddress.name,
        phone: editingAddress.phone,
        address: editingAddress.address,
        city: editingAddress.city,
        ward: editingAddress.ward,
        type: editingAddress.type,
        isDefault: editingAddress.isDefault
      });
    } else {
      // Reset form khi không có editingAddress
      setFormData({
        name: "",
        phone: "",
        address: "",
        city: "",
        ward: "",
        type: 'home',
        isDefault: false
      });
    }
  }, [editingAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const shippingInfo: ShippingInfo = {
      customerName: formData.name,
      customerPhone: formData.phone,
      shippingAddress: formData.address,
      city: formData.city,
      ward: formData.ward,
      notes: ""
    };
    
    onSave(shippingInfo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="add-address-form-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
        onClick={onClose}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {/* Name and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Họ và tên"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Số điện thoại"
                    required
                  />
                </div>
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tỉnh/Thành phố *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tỉnh/Thành phố"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phường/Xã *
                  </label>
                  <input
                    type="text"
                    value={formData.ward}
                    onChange={(e) => handleInputChange('ward', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Phường/Xã"
                    required
                  />
                </div>
              </div>

              {/* Specific Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ cụ thể *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Địa chỉ cụ thể"
                  required
                />
              </div>

              {/* Add Location Button */}
              <button
                type="button"
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition flex items-center justify-center space-x-2"
              >
                <span className="text-xl">+</span>
                <span>Thêm vị trí</span>
              </button>

              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại địa chỉ:
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('type', 'home')}
                    className={`px-4 py-2 rounded-lg border transition ${
                      formData.type === 'home'
                        ? 'bg-gray-100 border-gray-300 text-gray-900'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Nhà Riêng
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('type', 'office')}
                    className={`px-4 py-2 rounded-lg border transition ${
                      formData.type === 'office'
                        ? 'bg-gray-100 border-gray-300 text-gray-900'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Văn Phòng
                  </button>
                </div>
              </div>

              {/* Default Address Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              Trở lại
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Hoàn thành
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
