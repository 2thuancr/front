"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShippingInfo } from "@/types/order";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AddAddressForm } from "./AddAddressForm";

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
  type: 'home' | 'office';
}

interface AddressManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: ShippingInfo) => void;
}

export function AddressManager({ isOpen, onClose, onSelectAddress }: AddressManagerProps) {
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Load addresses from localStorage on mount
  useEffect(() => {
    if (userProfile) {
      const savedAddresses = localStorage.getItem(`addresses_${userProfile.id}`);
      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses);
        setAddresses(parsedAddresses);
      } else {
        // Chỉ tạo địa chỉ mặc định từ user profile nếu chưa có địa chỉ nào
        // Không lưu vào localStorage, chỉ hiển thị tạm thời
        const defaultAddresses: Address[] = [
          {
            id: 1,
            name: `${userProfile.firstName} ${userProfile.lastName}`,
            phone: userProfile.phone || "",
            address: userProfile.address || "",
            city: userProfile.city || "",
            district: "",
            ward: "",
            isDefault: true,
            type: 'home'
          }
        ];
        setAddresses(defaultAddresses);
        // Không lưu vào localStorage, chỉ hiển thị tạm thời
      }
    }
  }, [userProfile]);

  const handleSelectAddress = (address: Address) => {
    const shippingInfo: ShippingInfo = {
      customerName: address.name,
      customerPhone: address.phone,
      shippingAddress: address.address,
      city: address.city,
      district: address.district,
      ward: address.ward,
      notes: ""
    };
    onSelectAddress(shippingInfo);
    onClose();
  };

  const handleAddNew = () => {
    setEditingAddress(null); // Reset editing address khi tạo mới
    setShowAddForm(true);
  };

  const handleSaveNewAddress = (address: ShippingInfo) => {
    if (editingAddress) {
      // Cập nhật địa chỉ hiện có
      const updatedAddress: Address = {
        id: editingAddress.id, // Giữ nguyên ID
        name: address.customerName,
        phone: address.customerPhone,
        address: address.shippingAddress,
        city: address.city,
        district: address.district || "",
        ward: address.ward,
        isDefault: editingAddress.isDefault, // Giữ nguyên trạng thái default
        type: editingAddress.type // Giữ nguyên loại địa chỉ
      };
      
      const updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? updatedAddress : addr
      );
      setAddresses(updatedAddresses);
      
      // Lưu vào localStorage
      if (userProfile) {
        localStorage.setItem(`addresses_${userProfile.id}`, JSON.stringify(updatedAddresses));
      }
      
      // Chọn địa chỉ đã cập nhật
      handleSelectAddress(updatedAddress);
      setEditingAddress(null);
    } else {
      // Tạo địa chỉ mới
      const newAddress: Address = {
        id: Date.now(), // Simple ID generation
        name: address.customerName,
        phone: address.customerPhone,
        address: address.shippingAddress,
        city: address.city,
        district: address.district || "",
        ward: address.ward,
        isDefault: true, // Địa chỉ đầu tiên được tạo sẽ là default
        type: 'home'
      };
      
      // Nếu đây là địa chỉ đầu tiên được tạo (thay thế địa chỉ tạm thời từ user profile)
      const updatedAddresses = addresses.length === 1 && addresses[0]?.id === 1 
        ? [newAddress] // Thay thế địa chỉ tạm thời
        : [...addresses, newAddress]; // Thêm vào danh sách
      
      setAddresses(updatedAddresses);
      
      // Lưu vào localStorage
      if (userProfile) {
        localStorage.setItem(`addresses_${userProfile.id}`, JSON.stringify(updatedAddresses));
      }
      
      // Chọn địa chỉ vừa tạo
      handleSelectAddress(newAddress);
    }
    
    setShowAddForm(false);
  };

  const handleUpdateAddress = (addressId: number) => {
    const address = addresses.find(addr => addr.id === addressId);
    if (address) {
      // Mở form chỉnh sửa với dữ liệu đã có
      setShowAddForm(true);
      setEditingAddress(address);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="address-manager-modal"
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
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Địa chỉ của tôi
            </h2>
          </div>

          {/* Address List */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {addresses.map((address) => (
                <motion.div
                  key={address.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedAddressId === address.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAddressId(address.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                        selectedAddressId === address.id
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAddressId === address.id && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <h3 className="font-medium text-gray-900">{address.name}</h3>
                          <div className="w-px h-4 bg-gray-300" />
                          <p className="text-gray-600">{address.phone}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateAddress(address.id);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Cập nhật
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {address.address}, {address.ward}, {address.district}, {address.city}
                        </p>
                        {address.isDefault && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-red-100 text-red-800 border border-red-200 rounded">
                            Mặc định
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add New Address Button */}
            <button
              onClick={handleAddNew}
              className="w-full mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition flex items-center justify-center space-x-2"
            >
              <span className="text-xl">+</span>
              <span>Thêm địa chỉ mới</span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (selectedAddressId) {
                  const address = addresses.find(addr => addr.id === selectedAddressId);
                  if (address) {
                    handleSelectAddress(address);
                  }
                }
              }}
              disabled={!selectedAddressId}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xác nhận
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Add Address Form Modal */}
      <AddAddressForm
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveNewAddress}
        editingAddress={editingAddress}
      />
    </AnimatePresence>
  );
}
