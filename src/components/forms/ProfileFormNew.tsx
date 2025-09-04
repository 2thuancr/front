'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar as CalendarIcon, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Shield,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, UpdateProfileData } from '@/types/user';

interface ProfileFormNewProps {
  profile: UserProfile | null;
  onUpdate: (data: UpdateProfileData) => Promise<void>;
  isLoading?: boolean;
  error?: string | undefined;
}

const profileSchema = yup.object({
  firstName: yup.string().optional().min(2, 'Họ phải có ít nhất 2 ký tự'),
  lastName: yup.string().optional().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: yup.string().optional().matches(/^[0-9+\-\s()]*$/, 'Số điện thoại không hợp lệ'),
  address: yup.string().optional().max(200, 'Địa chỉ không được quá 200 ký tự'),
  bio: yup.string().optional().max(500, 'Giới thiệu không được quá 500 ký tự'),
  dateOfBirth: yup.string().optional(),
  gender: yup.string().optional().oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ'),
});

const ProfileFormNew: React.FC<ProfileFormNewProps> = ({
  profile,
  onUpdate,
  isLoading = false,
  error,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<UpdateProfileData>({
    resolver: yupResolver(profileSchema) as any,
  });

  // Set form values when profile changes
  useEffect(() => {
    if (profile) {
      setValue('firstName', profile.firstName || '');
      setValue('lastName', profile.lastName || '');
      setValue('phone', profile.phone || '');
      setValue('address', profile.address || '');
      setValue('bio', profile.bio || '');
      setValue('dateOfBirth', profile.dateOfBirth || '');
      setValue('gender', profile.gender || 'other');
    }
  }, [profile, setValue]);

  const watchedValues = watch();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (data: UpdateProfileData) => {
    try {
      await onUpdate(data);
      setIsEditing(false);
      reset(data);
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
    setAvatarPreview(null);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const genderOptions = [
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
    { label: 'Khác', value: 'other' },
  ];

  const maskEmail = (email: string) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    const maskedUsername = username.length > 2 
      ? username.substring(0, 2) + '*'.repeat(username.length - 2)
      : username;
    return `${maskedUsername}@${domain}`;
  };

  const maskPhone = (phone: string) => {
    if (!phone) return '';
    return '*'.repeat(phone.length - 2) + phone.slice(-2);
  };

  const maskDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `**/**/${year}`;
  };

  // Early return if profile is null
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Đang tải thông tin hồ sơ...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ Sơ Của Tôi</h1>
          <p className="text-gray-600">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
        </div>

        <div className="max-w-4xl">
          <Card className="shadow-sm border-0">
            <div className="p-6">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Message severity="error" text={error} className="w-full mb-4" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.form 
                onSubmit={handleSubmit(handleSave)} 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Avatar Section - First */}
                <div className="text-center py-6 border-b border-gray-100">
                  <motion.div
                    className="relative inline-block mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-32 h-32 rounded-full object-cover"
                        />
                      ) : profile?.avatar ? (
                        <img
                          src={profile.avatar}
                          alt="Profile avatar"
                          className="w-32 h-32 rounded-full object-cover"
                        />
                      ) : (
                        profile?.firstName && profile?.lastName ?
                          getInitials(profile.firstName, profile.lastName) :
                          '?'
                      )}
                    </div>

                    {isEditing && (
                      <motion.label
                        className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-50 transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Camera className="w-5 h-5 text-gray-700" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </motion.label>
                    )}
                  </motion.div>

                  <Button
                    label="Chọn Ảnh"
                    className="p-button-outlined mb-3 px-6 py-2"
                    onClick={() => document.querySelector('input[type="file"]')?.click()}
                  />

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Dụng lượng file tối đa 1 MB</p>
                    <p>Định dạng: .JPEG, .PNG</p>
                  </div>
                </div>

                {/* Username */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Tên đăng nhập
                  </label>
                  <div className="md:col-span-2">
                    <InputText
                      value={profile.username || ''}
                      className="w-full"
                      disabled
                    />
                    <small className="text-gray-500 text-xs mt-1 block">
                      Tên Đăng nhập chỉ có thể thay đổi một lần.
                    </small>
                  </div>
                </div>

                {/* First Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Họ
                  </label>
                  <div className="md:col-span-2">
                    <InputText
                      {...register('firstName')}
                      placeholder="Nhập họ của bạn"
                      className={`w-full ${errors.firstName ? 'p-invalid' : ''}`}
                      disabled={!isEditing}
                    />
                    {errors.firstName && (
                      <small className="p-error block mt-1 text-xs">{errors.firstName.message}</small>
                    )}
                  </div>
                </div>

                {/* Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Tên
                  </label>
                  <div className="md:col-span-2">
                    <InputText
                      {...register('lastName')}
                      placeholder="Nhập tên của bạn"
                      className={`w-full ${errors.lastName ? 'p-invalid' : ''}`}
                      disabled={!isEditing}
                    />
                    {errors.lastName && (
                      <small className="p-error block mt-1 text-xs">{errors.lastName.message}</small>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-900 flex-1">
                        {maskEmail(profile.email || '')}
                      </span>
                      <Button
                        label="Thay Đổi"
                        className="p-button-text p-button-sm text-blue-600 hover:text-blue-700"
                        onClick={() => {/* Handle email change */}}
                      />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-900 flex-1">
                        {maskPhone(profile.phone || '')}
                      </span>
                      <Button
                        label="Thay Đổi"
                        className="p-button-text p-button-sm text-blue-600 hover:text-blue-700"
                        onClick={() => {/* Handle phone change */}}
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-700">
                    Địa chỉ
                  </label>
                  <div className="md:col-span-2">
                    <InputTextarea
                      {...register('address')}
                      placeholder="Nhập địa chỉ của bạn"
                      className={`w-full ${errors.address ? 'p-invalid' : ''}`}
                      disabled={!isEditing}
                      rows={3}
                    />
                    {errors.address && (
                      <small className="p-error block mt-1 text-xs">{errors.address.message}</small>
                    )}
                  </div>
                </div>

                {/* Gender */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    Giới tính
                    <HelpCircle className="w-3 h-3 ml-1 text-gray-400" />
                  </label>
                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-900 flex-1">
                        {profile.gender === 'male' ? 'Nam' : 
                         profile.gender === 'female' ? 'Nữ' : 'Khác'}
                      </span>
                      <Button
                        label="Thay Đổi"
                        className="p-button-text p-button-sm text-blue-600 hover:text-blue-700"
                        onClick={() => setIsEditing(true)}
                      />
                    </div>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    Ngày sinh
                    <HelpCircle className="w-3 h-3 ml-1 text-gray-400" />
                  </label>
                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-900 flex-1">
                        {maskDate(profile.dateOfBirth || '')}
                      </span>
                      <Button
                        label="Thay Đổi"
                        className="p-button-text p-button-sm text-blue-600 hover:text-blue-700"
                        onClick={() => setIsEditing(true)}
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-6 border-t border-gray-100"
                  >
                    <div className="flex space-x-3 justify-end">
                      <Button
                        onClick={handleSubmit(handleSave)}
                        disabled={!isDirty || isLoading}
                        loading={isLoading}
                        label="Lưu"
                        className="bg-orange-500 hover:bg-orange-600 border-0 px-6 py-2"
                      />
                      <Button
                        onClick={handleCancel}
                        label="Hủy"
                        className="p-button-outlined px-6 py-2"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileFormNew;
