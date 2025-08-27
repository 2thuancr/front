'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, UpdateProfileData } from '@/types/user';

interface ProfileFormProps {
  profile: UserProfile;
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
  } = useForm<UpdateProfileData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone || '',
      address: profile.address || '',
      bio: profile.bio || '',
      dateOfBirth: profile.dateOfBirth || '',
      gender: profile.gender || 'other',
    },
  });

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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
      >
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
                ) : profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Profile avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  getInitials(profile.firstName, profile.lastName)
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
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-blue-100 text-lg mb-1">@{profile.username}</p>
              <p className="text-blue-100">{profile.email}</p>
              
              <div className="flex items-center justify-center md:justify-start mt-3 space-x-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">
                  {profile.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                </span>
                {profile.isEmailVerified && (
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
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
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
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/20"
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
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
              >
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Họ"
                placeholder="Nhập họ của bạn"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.firstName?.message}
                disabled={!isEditing}
                {...register('firstName')}
              />
              
              <Input
                label="Tên"
                placeholder="Nhập tên của bạn"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.lastName?.message}
                disabled={!isEditing}
                {...register('lastName')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                type="email"
                value={profile.email}
                leftIcon={<Mail className="h-4 w-4" />}
                disabled
                helperText="Email không thể thay đổi"
              />
              
              <Input
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                leftIcon={<Phone className="h-4 w-4" />}
                error={errors.phone?.message}
                disabled={!isEditing}
                {...register('phone')}
              />
            </div>

            <Input
              label="Địa chỉ"
              placeholder="Nhập địa chỉ của bạn"
              leftIcon={<MapPin className="h-4 w-4" />}
              error={errors.address?.message}
              disabled={!isEditing}
              {...register('address')}
            />

            <Input
              label="Giới thiệu"
              placeholder="Viết gì đó về bản thân..."
              leftIcon={<User className="h-4 w-4" />}
              error={errors.bio?.message}
              disabled={!isEditing}
              {...register('bio')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Ngày sinh"
                type="date"
                leftIcon={<Calendar className="h-4 w-4" />}
                error={errors.dateOfBirth?.message}
                disabled={!isEditing}
                {...register('dateOfBirth')}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  {...register('gender')}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Tên đăng nhập:</span>
                  <span className="ml-2 font-medium text-gray-900">@{profile.username}</span>
                </div>
                <div>
                  <span className="text-gray-600">Vai trò:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {profile.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Ngày tham gia:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {formatDate(profile.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Cập nhật lần cuối:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {formatDate(profile.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileForm;

