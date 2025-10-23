'use client';

import React, { useState } from 'react';
import { StaffGuard } from '@/components/guards';
import { useAuth } from '@/hooks/useAuth';
import { Staff } from '@/types/auth';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Key, 
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera
} from 'lucide-react';

export default function StaffSettingsPage() {
  const { user } = useAuth();
  const staff = user as Staff;
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: (staff as any)?.firstName || '',
    lastName: (staff as any)?.lastName || '',
    email: (staff as any)?.email || '',
    phone: (staff as any)?.phone || '',
    address: (staff as any)?.address || '',
    city: (staff as any)?.city || '',
    dateOfBirth: (staff as any)?.dateOfBirth || '',
    gender: (staff as any)?.gender || 'male'
  });

  // Security form state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    productUpdates: true,
    systemAlerts: true,
    marketingEmails: false
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('Profile update:', profileForm);
    // Handle profile update logic here
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert('Mật khẩu mới không khớp!');
      return;
    }
    // console.log('Security update:', securityForm);
    // Handle password change logic here
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const tabs = [
    { id: 'profile', name: 'Hồ sơ cá nhân', icon: User },
    { id: 'security', name: 'Bảo mật', icon: Shield },
    { id: 'notifications', name: 'Thông báo', icon: Bell }
  ];

  return (
    <StaffGuard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân và cài đặt hệ thống</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Hồ sơ cá nhân</h2>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4 mr-2" />
                      Đổi ảnh đại diện
                    </button>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên đệm
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            value={profileForm.firstName}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập họ và tên đệm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            value={profileForm.lastName}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tên"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập email"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập số điện thoại"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                        <textarea
                          value={profileForm.address}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="Nhập địa chỉ"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Thành phố
                        </label>
                        <select
                          value={profileForm.city}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Chọn thành phố</option>
                          <option value="TP.HCM">TP.HCM</option>
                          <option value="Hà Nội">Hà Nội</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                          <option value="Cần Thơ">Cần Thơ</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày sinh
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="date"
                            value={profileForm.dateOfBirth}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giới tính
                        </label>
                        <select
                          value={profileForm.gender}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Bảo mật tài khoản</h2>

                  <form onSubmit={handleSecuritySubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu hiện tại
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={securityForm.currentPassword}
                          onChange={(e) => setSecurityForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu mới
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={securityForm.newPassword}
                          onChange={(e) => setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nhập mật khẩu mới"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xác nhận mật khẩu mới
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={securityForm.confirmPassword}
                          onChange={(e) => setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nhập lại mật khẩu mới"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <Shield className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">Lưu ý bảo mật</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Đổi mật khẩu
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Cài đặt thông báo</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Kênh thông báo</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-900">Email thông báo</label>
                            <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.emailNotifications}
                              onChange={() => handleNotificationChange('emailNotifications')}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-900">SMS thông báo</label>
                            <p className="text-sm text-gray-500">Nhận thông báo qua tin nhắn</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.smsNotifications}
                              onChange={() => handleNotificationChange('smsNotifications')}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Loại thông báo</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-900">Cập nhật đơn hàng</label>
                            <p className="text-sm text-gray-500">Thông báo về trạng thái đơn hàng</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.orderUpdates}
                              onChange={() => handleNotificationChange('orderUpdates')}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-900">Cập nhật sản phẩm</label>
                            <p className="text-sm text-gray-500">Thông báo về sản phẩm mới</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.productUpdates}
                              onChange={() => handleNotificationChange('productUpdates')}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-900">Cảnh báo hệ thống</label>
                            <p className="text-sm text-gray-500">Thông báo quan trọng từ hệ thống</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.systemAlerts}
                              onChange={() => handleNotificationChange('systemAlerts')}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-900">Email marketing</label>
                            <p className="text-sm text-gray-500">Nhận thông tin khuyến mãi</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.marketingEmails}
                              onChange={() => handleNotificationChange('marketingEmails')}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Save className="w-4 h-4 mr-2" />
                        Lưu cài đặt
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </StaffGuard>
  );
}
