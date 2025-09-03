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
import { User, Mail, Phone, MapPin, Calendar as CalendarIcon, Edit3, Save, X, Camera, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, UpdateProfileData } from '@/types/user';

interface ProfileFormProps {
  profile: UserProfile | null;
  onUpdate: (data: UpdateProfileData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const profileSchema = yup.object({
  firstName: yup.string().required('Họ là bắt buộc').min(2, 'Họ phải có ít nhất 2 ký tự'),
  lastName: yup.string().required('Tên là bắt buộc').min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: yup.string().matches(/^[0-9+\-\s()]*$/, 'Số điện thoại không hợp lệ'),
  address: yup.string().max(200, 'Địa chỉ không được quá 200 ký tự'),
  bio: yup.string().max(500, 'Giới thiệu không được quá 500 ký tự'),
  dateOfBirth: yup.string(),
  gender: yup.string().oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ'),
});

const ProfileForm: React.FC<ProfileFormProps> = ({
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
    resolver: yupResolver(profileSchema),
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

  // Early return if profile is null
  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin hồ sơ...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Profile avatar"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    profile?.firstName && profile?.lastName ? 
                      getInitials(profile.firstName, profile.lastName) : 
                      '?'
                  )}
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4 text-gray-700" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Profile Info */}
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">
                  {profile?.firstName || ''} {profile?.lastName || ''}
                </h1>
                <p className="text-blue-100 text-lg mb-1">@{profile?.username || 'username'}</p>
                <p className="text-blue-100">{profile?.email || ''}</p>
                
                <div className="flex items-center justify-center md:justify-start mt-3 space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">
                    {profile?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                  {profile?.isEmailVerified && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Đã xác thực
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <div className="ml-auto">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    outlined
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSubmit(handleSave)}
                      disabled={!isDirty || isLoading}
                      loading={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Lưu
                    </Button>
                    <Button
                      onClick={handleCancel}
                      className="border-white/30 text-white hover:bg-white/20"
                      outlined
                    >
                      <X className="w-4 h-4 mr-2" />
                      Hủy
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Message severity="error" text={error} className="w-full mb-6" />
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="field">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Họ
                  </label>
                  <span className="p-input-icon-left w-full">
                    <User className="h-4 w-4" />
                    <InputText
                      id="firstName"
                      placeholder="Nhập họ của bạn"
                      className={`w-full ${errors.firstName ? 'p-invalid' : ''}`}
                      disabled={!isEditing}
                      {...register('firstName')}
                    />
                  </span>
                  {errors.firstName && (
                    <small className="p-error block mt-1">{errors.firstName.message}</small>
                  )}
                </div>
                
                <div className="field">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Tên
                  </label>
                  <span className="p-input-icon-left w-full">
                    <User className="h-4 w-4" />
                    <InputText
                      id="lastName"
                      placeholder="Nhập tên của bạn"
                      className={`w-full ${errors.lastName ? 'p-invalid' : ''}`}
                      disabled={!isEditing}
                      {...register('lastName')}
                    />
                  </span>
                  {errors.lastName && (
                    <small className="p-error block mt-1">{errors.lastName.message}</small>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="field">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <span className="p-input-icon-left w-full">
                    <Mail className="h-4 w-4" />
                    <InputText
                      id="email"
                      type="email"
                      value={profile?.email || ''}
                      className="w-full"
                      disabled
                    />
                  </span>
                  <small className="text-gray-500 block mt-1">Email không thể thay đổi</small>
                </div>
                
                <div className="field">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <span className="p-input-icon-left w-full">
                    <Phone className="h-4 w-4" />
                    <InputText
                      id="phone"
                      placeholder="Nhập số điện thoại"
                      className={`w-full ${errors.phone ? 'p-invalid' : ''}`}
                      disabled={!isEditing}
                      {...register('phone')}
                    />
                  </span>
                  {errors.phone && (
                    <small className="p-error block mt-1">{errors.phone.message}</small>
                  )}
                </div>
              </div>

              <div className="field">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <span className="p-input-icon-left w-full">
                  <MapPin className="h-4 w-4" />
                  <InputText
                    id="address"
                    placeholder="Nhập địa chỉ của bạn"
                    className={`w-full ${errors.address ? 'p-invalid' : ''}`}
                    disabled={!isEditing}
                    {...register('address')}
                  />
                </span>
                {errors.address && (
                  <small className="p-error block mt-1">{errors.address.message}</small>
                )}
              </div>

              <div className="field">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Giới thiệu
                </label>
                <span className="p-input-icon-left w-full">
                  <User className="h-4 w-4" />
                  <InputTextarea
                    id="bio"
                    placeholder="Viết gì đó về bản thân..."
                    className={`w-full ${errors.bio ? 'p-invalid' : ''}`}
                    disabled={!isEditing}
                    rows={3}
                    {...register('bio')}
                  />
                </span>
                {errors.bio && (
                  <small className="p-error block mt-1">{errors.bio.message}</small>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="field">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh
                  </label>
                  <div className="w-full">
                    <Calendar
                      id="dateOfBirth"
                      className={`w-full ${errors.dateOfBirth ? 'p-invalid' : ''}`}
                      disabled={!isEditing}
                      showIcon
                      {...register('dateOfBirth')}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <small className="p-error block mt-1">{errors.dateOfBirth.message}</small>
                  )}
                </div>
                
                <div className="field">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  <Dropdown
                    id="gender"
                    options={genderOptions}
                    value={watchedValues.gender}
                    onChange={(e) => register('gender').onChange(e)}
                    disabled={!isEditing}
                    className={`w-full ${errors.gender ? 'p-invalid' : ''}`}
                    placeholder="Chọn giới tính"
                  />
                  {errors.gender && (
                    <small className="p-error block mt-1">{errors.gender.message}</small>
                  )}
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tên đăng nhập:</span>
                    <span className="ml-2 font-medium text-gray-900">@{profile?.username || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Vai trò:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {profile?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ngày tham gia:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cập nhật lần cuối:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {profile?.updatedAt ? formatDate(profile.updatedAt) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileForm;

