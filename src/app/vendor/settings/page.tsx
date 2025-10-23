'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Settings, 
  Store, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  FileText, 
  Save,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function VendorSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('store');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - replace with real API calls
  const [storeInfo, setStoreInfo] = useState({
    storeName: 'Cửa hàng điện tử ABC',
    ownerName: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0123456789',
    address: '123 Đường ABC',
    ward: 'Phường 1',
    city: 'Quận 1, TP.HCM',
    taxCode: '0123456789',
    businessLicense: 'GP123456789',
    description: 'Cửa hàng chuyên bán các sản phẩm điện tử chất lượng cao với giá cả hợp lý.',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
    banner: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
  });

  const [accountInfo, setAccountInfo] = useState({
    username: 'vendor_abc',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: 'nguyenvana@email.com',
    phone: '0123456789'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    productUpdates: true,
    marketingEmails: false,
    securityAlerts: true
  });

  const tabs = [
    { id: 'store', name: 'Thông tin cửa hàng', icon: Store },
    { id: 'account', name: 'Tài khoản', icon: User },
    { id: 'notifications', name: 'Thông báo', icon: Mail },
    { id: 'security', name: 'Bảo mật', icon: Settings }
  ];

  const handleStoreInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // console.log('Store info updated:', storeInfo);
    } catch (error) {
      console.error('Error updating store info:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccountInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // console.log('Account info updated:', accountInfo);
    } catch (error) {
      console.error('Error updating account info:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // console.log('Notifications updated:', notifications);
    } catch (error) {
      console.error('Error updating notifications:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt cửa hàng</h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin cửa hàng và tài khoản
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow">
            {/* Store Information Tab */}
            {activeTab === 'store' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Thông tin cửa hàng</h2>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600">Đã xác thực</span>
                  </div>
                </div>

                <form onSubmit={handleStoreInfoSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên cửa hàng *
                        </label>
                        <input
                          type="text"
                          value={storeInfo.storeName}
                          onChange={(e) => setStoreInfo({...storeInfo, storeName: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chủ sở hữu *
                        </label>
                        <input
                          type="text"
                          value={storeInfo.ownerName}
                          onChange={(e) => setStoreInfo({...storeInfo, ownerName: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={storeInfo.email}
                          onChange={(e) => setStoreInfo({...storeInfo, email: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          value={storeInfo.phone}
                          onChange={(e) => setStoreInfo({...storeInfo, phone: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Địa chỉ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa chỉ chi tiết *
                        </label>
                        <input
                          type="text"
                          value={storeInfo.address}
                          onChange={(e) => setStoreInfo({...storeInfo, address: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phường/Xã *
                        </label>
                        <input
                          type="text"
                          value={storeInfo.ward}
                          onChange={(e) => setStoreInfo({...storeInfo, ward: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Thành phố *
                        </label>
                        <input
                          type="text"
                          value={storeInfo.city}
                          onChange={(e) => setStoreInfo({...storeInfo, city: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin kinh doanh</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mã số thuế *
                        </label>
                        <input
                          type="text"
                          value={storeInfo.taxCode}
                          onChange={(e) => setStoreInfo({...storeInfo, taxCode: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giấy phép kinh doanh *
                        </label>
                        <input
                          type="text"
                          value={storeInfo.businessLicense}
                          onChange={(e) => setStoreInfo({...storeInfo, businessLicense: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mô tả cửa hàng *
                        </label>
                        <textarea
                          value={storeInfo.description}
                          onChange={(e) => setStoreInfo({...storeInfo, description: e.target.value})}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Hình ảnh cửa hàng</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo cửa hàng
                        </label>
                        <div className="flex items-center space-x-4">
                          <img
                            src={storeInfo.logo}
                            alt="Logo"
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Thay đổi
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Banner cửa hàng
                        </label>
                        <div className="flex items-center space-x-4">
                          <img
                            src={storeInfo.banner}
                            alt="Banner"
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Thay đổi
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Account Information Tab */}
            {activeTab === 'account' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin tài khoản</h2>

                <form onSubmit={handleAccountInfoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên đăng nhập
                      </label>
                      <input
                        type="text"
                        value={accountInfo.username}
                        onChange={(e) => setAccountInfo({...accountInfo, username: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={accountInfo.email}
                        onChange={(e) => setAccountInfo({...accountInfo, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={accountInfo.phone}
                        onChange={(e) => setAccountInfo({...accountInfo, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Đổi mật khẩu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu hiện tại
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={accountInfo.currentPassword}
                            onChange={(e) => setAccountInfo({...accountInfo, currentPassword: e.target.value})}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={accountInfo.newPassword}
                          onChange={(e) => setAccountInfo({...accountInfo, newPassword: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={accountInfo.confirmPassword}
                          onChange={(e) => setAccountInfo({...accountInfo, confirmPassword: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Cài đặt thông báo</h2>

                <form onSubmit={handleNotificationsSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Thông báo qua email</h3>
                        <p className="text-sm text-gray-500">Nhận thông báo quan trọng qua email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Thông báo qua SMS</h3>
                        <p className="text-sm text-gray-500">Nhận thông báo qua tin nhắn SMS</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.smsNotifications}
                        onChange={(e) => setNotifications({...notifications, smsNotifications: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Cập nhật đơn hàng</h3>
                        <p className="text-sm text-gray-500">Thông báo khi có đơn hàng mới hoặc thay đổi trạng thái</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.orderUpdates}
                        onChange={(e) => setNotifications({...notifications, orderUpdates: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Cập nhật sản phẩm</h3>
                        <p className="text-sm text-gray-500">Thông báo về thay đổi sản phẩm và tồn kho</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.productUpdates}
                        onChange={(e) => setNotifications({...notifications, productUpdates: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email marketing</h3>
                        <p className="text-sm text-gray-500">Nhận thông tin về các chương trình khuyến mãi</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.marketingEmails}
                        onChange={(e) => setNotifications({...notifications, marketingEmails: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Cảnh báo bảo mật</h3>
                        <p className="text-sm text-gray-500">Thông báo về các hoạt động bảo mật quan trọng</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.securityAlerts}
                        onChange={(e) => setNotifications({...notifications, securityAlerts: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Bảo mật</h2>

                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">
                          Bảo mật tài khoản
                        </h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Để bảo vệ tài khoản của bạn, hãy sử dụng mật khẩu mạnh và không chia sẻ thông tin đăng nhập.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Xác thực 2 yếu tố</h3>
                        <p className="text-sm text-gray-500">Thêm lớp bảo mật cho tài khoản</p>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        Bật
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Lịch sử đăng nhập</h3>
                        <p className="text-sm text-gray-500">Xem các lần đăng nhập gần đây</p>
                      </div>
                      <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
                        Xem
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Thiết bị đã đăng nhập</h3>
                        <p className="text-sm text-gray-500">Quản lý các thiết bị đã đăng nhập</p>
                      </div>
                      <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
                        Quản lý
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
