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
  firstName: yup.string().optional().min(2, 'Họ phải có ít nhất 2 ký tự'),
  lastName: yup.string().optional().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: yup.string().optional().matches(/^[0-9+\-\s()]*$/, 'Số điện thoại không hợp lệ'),
  address: yup.string().optional().max(200, 'Địa chỉ không được quá 200 ký tự'),
  bio: yup.string().optional().max(500, 'Giới thiệu không được quá 500 ký tự'),
  dateOfBirth: yup.string().optional(),
  gender: yup.string().optional().oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ'),
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
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Profile Header Card */}
        <Card className="shadow-2xl border-0 overflow-hidden mb-8 bg-white/80 backdrop-blur-sm">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Avatar */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30 shadow-2xl">
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
                    className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-50 transition-all duration-200 hover:scale-110"
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

              {/* Profile Info */}
              <div className="text-center lg:text-left flex-1">
                <motion.h1 
                  className="text-4xl font-bold mb-3 text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {profile?.firstName || ''} {profile?.lastName || ''}
                </motion.h1>
                <motion.p 
                  className="text-white/90 text-xl mb-2 font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  @{profile?.username || 'username'}
                </motion.p>
                <motion.p 
                  className="text-white/80 text-lg mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {profile?.email || ''}
                </motion.p>
                
                <motion.div 
                  className="flex items-center justify-center lg:justify-start space-x-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
                    <Shield className="w-4 h-4 text-white" />
                    <span className="text-sm text-white font-medium">
                      Người dùng
                    </span>
                  </div>
                  {profile?.isEmailVerified && (
                    <span className="bg-green-500 text-white text-xs px-3 py-2 rounded-full font-medium shadow-lg">
                      ✓ Đã xác thực
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Edit Button */}
              <motion.div 
                className="flex justify-center lg:justify-end"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                {!isEditing ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm px-6 py-3 text-lg font-medium shadow-lg"
                      outlined
                    >
                      <Edit3 className="w-5 h-5 mr-2" />
                      Chỉnh sửa hồ sơ
                    </Button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleSubmit(handleSave)}
                        disabled={!isDirty || isLoading}
                        loading={isLoading}
                        className="bg-green-600 hover:bg-green-700 px-6 py-3 text-lg font-medium shadow-lg"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        Lưu thay đổi
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleCancel}
                        className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-6 py-3 text-lg font-medium shadow-lg"
                        outlined
                      >
                        <X className="w-5 h-5 mr-2" />
                        Hủy
                      </Button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 bg-white/50 backdrop-blur-sm">
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

            <motion.form 
              onSubmit={handleSubmit(handleSave)} 
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Personal Information Section */}
              <motion.div 
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-indigo-600" />
                  Thông tin cá nhân
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    className="field"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-3">
                      Họ
                    </label>
                    <span className="p-input-icon-left w-full">
                      <User className="h-4 w-4 text-gray-400" />
                      <InputText
                        id="firstName"
                        placeholder="Nhập họ của bạn"
                        className={`w-full p-3 border-2 rounded-xl transition-all duration-200 ${
                          errors.firstName ? 'p-invalid border-red-300' : 'border-gray-200 focus:border-indigo-500'
                        } ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                        disabled={!isEditing}
                        {...register('firstName')}
                      />
                    </span>
                    {errors.firstName && (
                      <small className="p-error block mt-2 text-red-600 font-medium">{errors.firstName.message}</small>
                    )}
                  </motion.div>
                  
                  <motion.div 
                    className="field"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-3">
                      Tên
                    </label>
                    <span className="p-input-icon-left w-full">
                      <User className="h-4 w-4 text-gray-400" />
                      <InputText
                        id="lastName"
                        placeholder="Nhập tên của bạn"
                        className={`w-full p-3 border-2 rounded-xl transition-all duration-200 ${
                          errors.lastName ? 'p-invalid border-red-300' : 'border-gray-200 focus:border-indigo-500'
                        } ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                        disabled={!isEditing}
                        {...register('lastName')}
                      />
                    </span>
                    {errors.lastName && (
                      <small className="p-error block mt-2 text-red-600 font-medium">{errors.lastName.message}</small>
                    )}
                  </motion.div>
                </div>
              </motion.div>

              {/* Contact Information Section */}
              <motion.div 
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-indigo-600" />
                  Thông tin liên hệ
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    className="field"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                      Email
                    </label>
                    <span className="p-input-icon-left w-full">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <InputText
                        id="email"
                        type="email"
                        value={profile?.email || ''}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                        disabled
                      />
                    </span>
                    <small className="text-gray-500 block mt-2 font-medium">Email không thể thay đổi</small>
                  </motion.div>
                  
                  <motion.div 
                    className="field"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                      Số điện thoại
                    </label>
                    <span className="p-input-icon-left w-full">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <InputText
                        id="phone"
                        placeholder="Nhập số điện thoại"
                        className={`w-full p-3 border-2 rounded-xl transition-all duration-200 ${
                          errors.phone ? 'p-invalid border-red-300' : 'border-gray-200 focus:border-indigo-500'
                        } ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                        disabled={!isEditing}
                        {...register('phone')}
                      />
                    </span>
                    {errors.phone && (
                      <small className="p-error block mt-2 text-red-600 font-medium">{errors.phone.message}</small>
                    )}
                  </motion.div>
                </div>
              </motion.div>

              {/* Additional Information Section */}
              <motion.div 
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                  Thông tin bổ sung
                </h3>
                
                <div className="space-y-6">
                  <motion.div 
                    className="field"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-3">
                      Địa chỉ
                    </label>
                    <span className="p-input-icon-left w-full">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <InputText
                        id="address"
                        placeholder="Nhập địa chỉ của bạn"
                        className={`w-full p-3 border-2 rounded-xl transition-all duration-200 ${
                          errors.address ? 'p-invalid border-red-300' : 'border-gray-200 focus:border-indigo-500'
                        } ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                        disabled={!isEditing}
                        {...register('address')}
                      />
                    </span>
                    {errors.address && (
                      <small className="p-error block mt-2 text-red-600 font-medium">{errors.address.message}</small>
                    )}
                  </motion.div>

                  <motion.div 
                    className="field"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-3">
                      Giới thiệu
                    </label>
                    <span className="p-input-icon-left w-full">
                      <User className="h-4 w-4 text-gray-400" />
                      <InputTextarea
                        id="bio"
                        placeholder="Viết gì đó về bản thân..."
                        className={`w-full p-3 border-2 rounded-xl transition-all duration-200 ${
                          errors.bio ? 'p-invalid border-red-300' : 'border-gray-200 focus:border-indigo-500'
                        } ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                        disabled={!isEditing}
                        rows={3}
                        {...register('bio')}
                      />
                    </span>
                    {errors.bio && (
                      <small className="p-error block mt-2 text-red-600 font-medium">{errors.bio.message}</small>
                    )}
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      className="field"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 }}
                    >
                      <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 mb-3">
                        Ngày sinh
                      </label>
                      <div className="w-full">
                        <Calendar
                          id="dateOfBirth"
                          className={`w-full p-3 border-2 rounded-xl transition-all duration-200 ${
                            errors.dateOfBirth ? 'p-invalid border-red-300' : 'border-gray-200 focus:border-indigo-500'
                          } ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                          disabled={!isEditing}
                          showIcon
                          {...register('dateOfBirth')}
                        />
                      </div>
                      {errors.dateOfBirth && (
                        <small className="p-error block mt-2 text-red-600 font-medium">{errors.dateOfBirth.message}</small>
                      )}
                    </motion.div>
                    
                    <motion.div 
                      className="field"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 }}
                    >
                      <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-3">
                        Giới tính
                      </label>
                      <Dropdown
                        id="gender"
                        options={genderOptions}
                        value={watchedValues.gender}
                        onChange={(e) => register('gender').onChange(e)}
                        disabled={!isEditing}
                        className={`w-full p-3 border-2 rounded-xl transition-all duration-200 ${
                          errors.gender ? 'p-invalid border-red-300' : 'border-gray-200 focus:border-indigo-500'
                        } ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                        placeholder="Chọn giới tính"
                      />
                      {errors.gender && (
                        <small className="p-error block mt-2 text-red-600 font-medium">{errors.gender.message}</small>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Account Information Section */}
              <motion.div 
                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-indigo-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                  Thông tin tài khoản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 }}
                  >
                    <span className="text-sm font-medium text-gray-600">Tên đăng nhập</span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">@{profile?.username || 'N/A'}</p>
                  </motion.div>
                  <motion.div 
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.7 }}
                  >
                    <span className="text-sm font-medium text-gray-600">Vai trò</span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      Người dùng
                    </p>
                  </motion.div>
                  <motion.div 
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.8 }}
                  >
                    <span className="text-sm font-medium text-gray-600">Ngày tham gia</span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                    </p>
                  </motion.div>
                  <motion.div 
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.9 }}
                  >
                    <span className="text-sm font-medium text-gray-600">Cập nhật lần cuối</span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {profile?.updatedAt ? formatDate(profile.updatedAt) : 'N/A'}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileForm;

