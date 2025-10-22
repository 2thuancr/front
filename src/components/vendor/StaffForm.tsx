'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  X, 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  UserCheck,
  AlertCircle,
  Save,
  Loader,
  Upload,
  Image,
  Camera
} from 'lucide-react';
import { useToastSuccess, useToastError } from '@/components/ui/Toast';
import { staffAPI } from '@/lib/api';

interface StaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  staffData?: any; // Staff data for edit mode
  mode?: 'create' | 'view' | 'edit'; // Form mode
}

interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  gender: string;
  dateOfBirth: string;
  role: string;
  isActive: boolean;
  avatar: FileList | null;
  password?: string; // For create mode and password update
  confirmPassword?: string; // For create mode and password update
}

const schema = yup.object({
  firstName: yup.string().required('Tên là bắt buộc'),
  lastName: yup.string().required('Họ là bắt buộc'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  phone: yup.string().matches(/^[0-9+\-\s()]+$/, 'Số điện thoại không hợp lệ'),
  address: yup.string(),
  city: yup.string(),
  gender: yup.string().oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ'),
  dateOfBirth: yup.string(),
  role: yup.string().required('Vai trò là bắt buộc'),
  isActive: yup.boolean(),
  password: yup.string().when('mode', {
    is: 'create',
    then: (schema) => schema.required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    otherwise: (schema) => schema.optional().test('min-length', 'Mật khẩu tối thiểu 6 ký tự', function(value) {
      if (!value || value.length === 0) return true; // Không bắt buộc nếu để trống
      return value.length >= 6;
    })
  }),
  confirmPassword: yup.string().when('password', {
    is: (password: string) => password && password.length > 0,
    then: (schema) => schema.required('Xác nhận mật khẩu là bắt buộc').oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
    otherwise: (schema) => schema.optional()
  }),
  avatar: yup.mixed().test('fileSize', 'File quá lớn (tối đa 5MB)', (value) => {
    if (!value || value.length === 0) return true;
    return value[0]?.size <= 5 * 1024 * 1024;
  }).test('fileType', 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF)', (value) => {
    if (!value || value.length === 0) return true;
    return ['image/jpeg', 'image/png', 'image/gif'].includes(value[0]?.type);
  }),
});

export default function StaffForm({ isOpen, onClose, onSuccess, staffData, mode = 'create' }: StaffFormProps) {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<StaffFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: staffData?.firstName || '',
      lastName: staffData?.lastName || '',
      email: staffData?.email || '',
      phone: staffData?.phone || '',
      address: staffData?.address || '',
      city: staffData?.city || '',
      gender: staffData?.gender || '',
      dateOfBirth: staffData?.dateOfBirth || '',
      role: staffData?.role || 'staff',
      isActive: staffData?.isActive ?? true,
      avatar: null,
    }
  });

  const avatarFile = watch('avatar');

  // Load staff data when component mounts or staffData changes
  React.useEffect(() => {
    if (staffData) {
      setValue('firstName', staffData.firstName || '');
      setValue('lastName', staffData.lastName || '');
      setValue('email', staffData.email || '');
      setValue('phone', staffData.phone || '');
      setValue('address', staffData.address || '');
      setValue('city', staffData.city || '');
      setValue('gender', staffData.gender || '');
      setValue('dateOfBirth', staffData.dateOfBirth || '');
      setValue('role', staffData.role || 'staff');
      setValue('isActive', staffData.isActive ?? true);
      
      // Set preview image if staff has avatar
      if (staffData.avatar) {
        setPreviewImage(staffData.avatar);
      }
    }
  }, [staffData, setValue]);

  // Handle avatar preview
  React.useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const file = avatarFile[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (!staffData?.avatar) {
      setPreviewImage(null);
    }
  }, [avatarFile, staffData?.avatar]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setValue('avatar', files);
    }
  };

  const removeAvatar = () => {
    setValue('avatar', null);
    setPreviewImage(null);
  };

  const getInputClassName = (baseClass: string) => {
    return `${baseClass} ${mode === 'view' ? 'bg-gray-50 text-gray-500' : ''}`;
  };

  const roles = [
    { value: 'manager', label: 'Quản lý' },
    { value: 'staff', label: 'Nhân viên' },
  ];

  const genders = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' },
  ];

  const cities = [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'An Giang',
    'Bà Rịa - Vũng Tàu',
    'Bắc Giang',
    'Bắc Kạn',
    'Bạc Liêu',
    'Bắc Ninh',
    'Bến Tre',
    'Bình Định',
    'Bình Dương',
    'Bình Phước',
    'Bình Thuận',
    'Cà Mau',
    'Cao Bằng',
    'Đắk Lắk',
    'Đắk Nông',
    'Điện Biên',
    'Đồng Nai',
    'Đồng Tháp',
    'Gia Lai',
    'Hà Giang',
    'Hà Nam',
    'Hà Tĩnh',
    'Hải Dương',
    'Hậu Giang',
    'Hòa Bình',
    'Hưng Yên',
    'Khánh Hòa',
    'Kiên Giang',
    'Kon Tum',
    'Lai Châu',
    'Lâm Đồng',
    'Lạng Sơn',
    'Lào Cai',
    'Long An',
    'Nam Định',
    'Nghệ An',
    'Ninh Bình',
    'Ninh Thuận',
    'Phú Thọ',
    'Phú Yên',
    'Quảng Bình',
    'Quảng Nam',
    'Quảng Ngãi',
    'Quảng Ninh',
    'Quảng Trị',
    'Sóc Trăng',
    'Sơn La',
    'Tây Ninh',
    'Thái Bình',
    'Thái Nguyên',
    'Thanh Hóa',
    'Thừa Thiên Huế',
    'Tiền Giang',
    'Trà Vinh',
    'Tuyên Quang',
    'Vĩnh Long',
    'Vĩnh Phúc',
    'Yên Bái',
  ];

  const onSubmit = async (data: StaffFormData) => {
    try {
      setLoading(true);
      
      // Prepare data for API
      const requestData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        gender: data.gender || '',
        dateOfBirth: data.dateOfBirth || '',
        role: data.role,
        isActive: data.isActive,
      };
      
      // Add password for create mode or when updating password
      if (data.password && data.password.trim() !== '') {
        requestData.password = data.password;
      }
      
      console.log('📝 Staff form data:', {
        mode,
        staffId: staffData?.id,
        requestData
      });
      
      // Call API
      if (mode === 'create') {
        await staffAPI.create(requestData);
      } else if (mode === 'edit') {
        await staffAPI.update(staffData.id, requestData);
      }
      
      const successMessage = mode === 'create' ? 'Đã thêm nhân viên mới' : 'Đã cập nhật thông tin nhân viên';
      toastSuccess('Thành công', successMessage);
      handleClose();
      onSuccess();
      
    } catch (error: any) {
      console.error('❌ Error saving staff:', error);
      const errorMessage = mode === 'create' ? 'Không thể tạo nhân viên mới' : 'Không thể cập nhật thông tin nhân viên';
      toastError('Lỗi', error.response?.data?.message || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setPreviewImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' && 'Thêm nhân viên mới'}
              {mode === 'view' && 'Thông tin nhân viên'}
              {mode === 'edit' && 'Chỉnh sửa nhân viên'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Ảnh đại diện
            </h3>
            
            <div className="flex items-center space-x-6">
              {/* Avatar Preview */}
              <div className="flex-shrink-0">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Avatar preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn ảnh đại diện
                </label>
                <div className="flex items-center space-x-3">
                  {mode !== 'view' ? (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm text-gray-700">Chọn ảnh</span>
                      </div>
                    </label>
                  ) : (
                    <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                      <Image className="w-4 h-4" />
                      <span className="text-sm">Chỉ xem</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-500">
                    JPG, PNG, GIF (tối đa 5MB)
                  </span>
                </div>
                {errors.avatar && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.avatar.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Thông tin cá nhân
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên *
                </label>
                <input
                  {...register('firstName')}
                  type="text"
                  disabled={mode === 'view'}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    mode === 'view' ? 'bg-gray-50 text-gray-500' : ''
                  }`}
                  placeholder="Nhập tên"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ *
                </label>
                <input
                  {...register('lastName')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập họ"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Số điện thoại
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn giới tính</option>
                  {genders.map(gender => (
                    <option key={gender.value} value={gender.value}>
                      {gender.label}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Ngày sinh
                </label>
                <input
                  {...register('dateOfBirth')}
                  type="date"
                  disabled={mode === 'view'}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    mode === 'view' ? 'bg-gray-50 text-gray-500' : ''
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
            </div>
          </div>

       {/* Password Section - For create mode and password update */}
       {(mode === 'create' || mode === 'edit') && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Thông tin đăng nhập
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu {mode === 'create' ? '*' : ''}
                  </label>
                  <input
                    {...register('password')}
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={mode === 'create' ? "Nhập mật khẩu" : "Để trống nếu không muốn thay đổi"}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password.message}
                    </p>
                  )}
                  {mode === 'edit' && (
                    <p className="mt-1 text-xs text-gray-500">
                      Chỉ điền khi cần đổi mật khẩu cho nhân viên (ví dụ: nhân viên quên mật khẩu)
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu {mode === 'create' ? '*' : ''}
                  </label>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={mode === 'create' ? "Nhập lại mật khẩu" : "Xác nhận mật khẩu mới"}
                    disabled={mode === 'view'}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                  {mode === 'edit' && (
                    <p className="mt-1 text-xs text-gray-500">
                      Chỉ cần nhập khi muốn thay đổi mật khẩu
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Thông tin địa chỉ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  {...register('address')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập địa chỉ chi tiết"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thành phố/Tỉnh
                </label>
                <select
                  {...register('city')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn thành phố/tỉnh</option>
                  {cities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Thông tin công việc
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò *
                </label>
                <select
                  {...register('role')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserCheck className="w-4 h-4 inline mr-1" />
                  Trạng thái
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      {...register('isActive')}
                      type="radio"
                      value="true"
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Hoạt động</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('isActive')}
                      type="radio"
                      value="false"
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Tạm dừng</span>
                  </label>
                </div>
                {errors.isActive && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.isActive.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {mode === 'view' ? 'Đóng' : 'Hủy'}
            </button>
            {mode !== 'view' && (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>{mode === 'edit' ? 'Đang cập nhật...' : 'Đang tạo...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{mode === 'edit' ? 'Cập nhật' : 'Tạo nhân viên'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
