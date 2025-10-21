'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { ToggleButton } from 'primereact/togglebutton';
import { Divider } from 'primereact/divider';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: (user as any)?.firstName || '',
    lastName: (user as any)?.lastName || '',
    email: user?.email || '',
    phone: (user as any)?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
  });

  const tabs = [
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'appearance', label: 'Giao diện', icon: Palette },
  ];

  const handleSaveProfile = () => {
    // Handle profile save
  };

  const handleChangePassword = () => {
    // Handle password change
  };

  const handleSaveNotifications = () => {
    // Handle notification settings save
  };

  const handleSaveAppearance = () => {
    // Handle appearance settings save
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt</h1>
          <p className="text-gray-600">Quản lý tài khoản và tùy chọn của bạn</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <div className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6">
                  {/* Profile Settings */}
                  {activeTab === 'profile' && (
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <User className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Thông tin hồ sơ</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="field">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Họ
                          </label>
                          <InputText
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                            className="w-full"
                            placeholder="Nhập họ của bạn"
                          />
                        </div>

                        <div className="field">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên
                          </label>
                          <InputText
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                            className="w-full"
                            placeholder="Nhập tên của bạn"
                          />
                        </div>

                        <div className="field">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <InputText
                            value={profileData.email}
                            disabled
                            className="w-full"
                            placeholder="Email không thể thay đổi"
                          />
                        </div>

                        <div className="field">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại
                          </label>
                          <InputText
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="w-full"
                            placeholder="Nhập số điện thoại"
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button
                          label="Lưu thay đổi"
                          icon={<Save className="w-4 h-4" />}
                          onClick={handleSaveProfile}
                          className="bg-blue-600 hover:bg-blue-700"
                        />
                      </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeTab === 'security' && (
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Bảo mật</h2>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Đổi mật khẩu</h3>
                          <div className="space-y-4">
                            <div className="field">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu hiện tại
                              </label>
                              <div className="relative">
                                <Password
                                  value={passwordData.currentPassword}
                                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                  className="w-full"
                                  placeholder="Nhập mật khẩu hiện tại"
                                  toggleMask
                                />
                              </div>
                            </div>

                            <div className="field">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu mới
                              </label>
                              <Password
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full"
                                placeholder="Nhập mật khẩu mới"
                                toggleMask
                              />
                            </div>

                            <div className="field">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Xác nhận mật khẩu mới
                              </label>
                              <Password
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="w-full"
                                placeholder="Xác nhận mật khẩu mới"
                                toggleMask
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <Button
                              label="Đổi mật khẩu"
                              icon={<Shield className="w-4 h-4" />}
                              onClick={handleChangePassword}
                              className="bg-blue-600 hover:bg-blue-700"
                            />
                          </div>
                        </div>

                        <Divider />

                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Đăng xuất</h3>
                          <p className="text-gray-600 mb-4">
                            Đăng xuất khỏi tất cả các thiết bị và phiên đăng nhập
                          </p>
                          <Button
                            label="Đăng xuất"
                            icon={<SettingsIcon className="w-4 h-4" />}
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700"
                            outlined
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notification Settings */}
                  {activeTab === 'notifications' && (
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <Bell className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Thông báo</h2>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Thông báo email</h3>
                            <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
                          </div>
                          <ToggleButton
                            checked={notificationSettings.emailNotifications}
                            onChange={(e) => setNotificationSettings({ 
                              ...notificationSettings, 
                              emailNotifications: e.value 
                            })}
                            onLabel="Bật"
                            offLabel="Tắt"
                            className="w-16"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Thông báo SMS</h3>
                            <p className="text-sm text-gray-600">Nhận thông báo qua tin nhắn</p>
                          </div>
                          <ToggleButton
                            checked={notificationSettings.smsNotifications}
                            onChange={(e) => setNotificationSettings({ 
                              ...notificationSettings, 
                              smsNotifications: e.value 
                            })}
                            onLabel="Bật"
                            offLabel="Tắt"
                            className="w-16"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Thông báo đẩy</h3>
                            <p className="text-sm text-gray-600">Nhận thông báo trên trình duyệt</p>
                          </div>
                          <ToggleButton
                            checked={notificationSettings.pushNotifications}
                            onChange={(e) => setNotificationSettings({ 
                              ...notificationSettings, 
                              pushNotifications: e.value 
                            })}
                            onLabel="Bật"
                            offLabel="Tắt"
                            className="w-16"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Email marketing</h3>
                            <p className="text-sm text-gray-600">Nhận email về sản phẩm mới và khuyến mãi</p>
                          </div>
                          <ToggleButton
                            checked={notificationSettings.marketingEmails}
                            onChange={(e) => setNotificationSettings({ 
                              ...notificationSettings, 
                              marketingEmails: e.value 
                            })}
                            onLabel="Bật"
                            offLabel="Tắt"
                            className="w-16"
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button
                          label="Lưu cài đặt"
                          icon={<Save className="w-4 h-4" />}
                          onClick={handleSaveNotifications}
                          className="bg-blue-600 hover:bg-blue-700"
                        />
                      </div>
                    </div>
                  )}

                  {/* Appearance Settings */}
                  {activeTab === 'appearance' && (
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <Palette className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Giao diện</h2>
                      </div>

                      <div className="space-y-6">
                        <div className="field">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chủ đề
                          </label>
                          <div className="flex space-x-4">
                            <button
                              onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'light' })}
                              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                                appearanceSettings.theme === 'light'
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              Sáng
                            </button>
                            <button
                              onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'dark' })}
                              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                                appearanceSettings.theme === 'dark'
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              Tối
                            </button>
                          </div>
                        </div>

                        <div className="field">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngôn ngữ
                          </label>
                          <div className="flex space-x-4">
                            <button
                              onClick={() => setAppearanceSettings({ ...appearanceSettings, language: 'vi' })}
                              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                                appearanceSettings.language === 'vi'
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              Tiếng Việt
                            </button>
                            <button
                              onClick={() => setAppearanceSettings({ ...appearanceSettings, language: 'en' })}
                              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                                appearanceSettings.language === 'en'
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              English
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button
                          label="Lưu cài đặt"
                          icon={<Save className="w-4 h-4" />}
                          onClick={handleSaveAppearance}
                          className="bg-blue-600 hover:bg-blue-700"
                        />
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
