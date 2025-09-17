"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShippingInfo } from "@/types/order";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AddressManager } from "./AddressManager";
import { AddAddressForm } from "./AddAddressForm";

interface CheckoutFormProps {
  shippingInfo: ShippingInfo;
  onShippingInfoChange: (info: ShippingInfo) => void;
  onNext: () => void;
}

export function CheckoutForm({ shippingInfo, onShippingInfoChange, onNext }: CheckoutFormProps) {
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const [formData, setFormData] = useState<ShippingInfo>(shippingInfo);
  const [showAddressManager, setShowAddressManager] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  // Auto-fill form with user profile data
  useEffect(() => {
    if (userProfile && !shippingInfo.customerName) {
      const autoFilledData: ShippingInfo = {
        customerName: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
        customerPhone: userProfile.phone || "",
        shippingAddress: userProfile.address || "",
        city: userProfile.city || "",
        ward: "",
        notes: ""
      };
      
      setFormData(autoFilledData);
      onShippingInfoChange(autoFilledData);
      console.log("✅ Auto-filled form with user profile data:", autoFilledData);
    }
  }, [userProfile, shippingInfo.customerName, onShippingInfoChange]);

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onShippingInfoChange(newData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleUseProfileData = () => {
    if (userProfile) {
      const profileData: ShippingInfo = {
        customerName: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
        customerPhone: userProfile.phone || "",
        shippingAddress: userProfile.address || "",
        city: userProfile.city || "",
        district: "",
        ward: "",
        notes: ""
      };
      
      setFormData(profileData);
      onShippingInfoChange(profileData);
    }
  };

  const handleSelectAddress = (address: ShippingInfo) => {
    setFormData(address);
    onShippingInfoChange(address);
  };

  const handleAddNewAddress = () => {
    setShowAddressManager(false);
    setShowAddAddressForm(true);
  };

  const handleSaveNewAddress = (address: ShippingInfo) => {
    setFormData(address);
    onShippingInfoChange(address);
    setShowAddAddressForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Thông tin giao hàng
        </h2>
        {userProfile && (
          <button
            type="button"
            onClick={handleUseProfileData}
            className="px-4 py-2 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
          >
            📋 Sử dụng thông tin từ hồ sơ
          </button>
        )}
      </div>

      {/* Auto-fill notification */}
      {userProfile && formData.customerName && formData.customerName === `${userProfile.firstName} ${userProfile.lastName}`.trim() && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="text-green-500 text-sm">✅</div>
            <p className="text-sm text-green-700">
              Đã tự động điền thông tin từ hồ sơ của bạn. Bạn có thể chỉnh sửa nếu cần.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleInputChange("customerName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại *
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange("customerPhone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập số điện thoại"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ giao hàng *
          </label>
          <input
            type="text"
            value={formData.shippingAddress}
            onChange={(e) => handleInputChange("shippingAddress", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Số nhà, tên đường"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tỉnh/Thành phố *
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Chọn tỉnh/thành phố</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
              <option value="An Giang">An Giang</option>
              <option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</option>
              <option value="Bắc Giang">Bắc Giang</option>
              <option value="Bắc Kạn">Bắc Kạn</option>
              <option value="Bạc Liêu">Bạc Liêu</option>
              <option value="Bắc Ninh">Bắc Ninh</option>
              <option value="Bến Tre">Bến Tre</option>
              <option value="Bình Định">Bình Định</option>
              <option value="Bình Dương">Bình Dương</option>
              <option value="Bình Phước">Bình Phước</option>
              <option value="Bình Thuận">Bình Thuận</option>
              <option value="Cà Mau">Cà Mau</option>
              <option value="Cao Bằng">Cao Bằng</option>
              <option value="Đắk Lắk">Đắk Lắk</option>
              <option value="Đắk Nông">Đắk Nông</option>
              <option value="Điện Biên">Điện Biên</option>
              <option value="Đồng Nai">Đồng Nai</option>
              <option value="Đồng Tháp">Đồng Tháp</option>
              <option value="Gia Lai">Gia Lai</option>
              <option value="Hà Giang">Hà Giang</option>
              <option value="Hà Nam">Hà Nam</option>
              <option value="Hà Tĩnh">Hà Tĩnh</option>
              <option value="Hải Dương">Hải Dương</option>
              <option value="Hậu Giang">Hậu Giang</option>
              <option value="Hòa Bình">Hòa Bình</option>
              <option value="Hưng Yên">Hưng Yên</option>
              <option value="Khánh Hòa">Khánh Hòa</option>
              <option value="Kiên Giang">Kiên Giang</option>
              <option value="Kon Tum">Kon Tum</option>
              <option value="Lai Châu">Lai Châu</option>
              <option value="Lâm Đồng">Lâm Đồng</option>
              <option value="Lạng Sơn">Lạng Sơn</option>
              <option value="Lào Cai">Lào Cai</option>
              <option value="Long An">Long An</option>
              <option value="Nam Định">Nam Định</option>
              <option value="Nghệ An">Nghệ An</option>
              <option value="Ninh Bình">Ninh Bình</option>
              <option value="Ninh Thuận">Ninh Thuận</option>
              <option value="Phú Thọ">Phú Thọ</option>
              <option value="Phú Yên">Phú Yên</option>
              <option value="Quảng Bình">Quảng Bình</option>
              <option value="Quảng Nam">Quảng Nam</option>
              <option value="Quảng Ngãi">Quảng Ngãi</option>
              <option value="Quảng Ninh">Quảng Ninh</option>
              <option value="Quảng Trị">Quảng Trị</option>
              <option value="Sóc Trăng">Sóc Trăng</option>
              <option value="Sơn La">Sơn La</option>
              <option value="Tây Ninh">Tây Ninh</option>
              <option value="Thái Bình">Thái Bình</option>
              <option value="Thái Nguyên">Thái Nguyên</option>
              <option value="Thanh Hóa">Thanh Hóa</option>
              <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
              <option value="Tiền Giang">Tiền Giang</option>
              <option value="Trà Vinh">Trà Vinh</option>
              <option value="Tuyên Quang">Tuyên Quang</option>
              <option value="Vĩnh Long">Vĩnh Long</option>
              <option value="Vĩnh Phúc">Vĩnh Phúc</option>
              <option value="Yên Bái">Yên Bái</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phường/Xã *
            </label>
            <input
              type="text"
              value={formData.ward}
              onChange={(e) => handleInputChange("ward", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập phường/xã"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú (tùy chọn)
          </label>
          <textarea
            value={formData.notes || ""}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Ghi chú thêm cho đơn hàng..."
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowAddressManager(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Thay đổi
          </button>
          <button
            type="submit"
            className="px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Tiếp tục
          </button>
        </div>
      </form>

      {/* Address Manager Modal */}
      <AddressManager
        isOpen={showAddressManager}
        onClose={() => setShowAddressManager(false)}
        onSelectAddress={handleSelectAddress}
      />

      {/* Add Address Form Modal */}
      <AddAddressForm
        isOpen={showAddAddressForm}
        onClose={() => setShowAddAddressForm(false)}
        onSave={handleSaveNewAddress}
      />
    </motion.div>
  );
}
