'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import OTPVerificationForm from './OTPVerificationForm';
import { Mail, Lock, Eye, EyeOff, UserCheck, Phone, MapPin, Calendar, User } from 'lucide-react';
import Link from 'next/link';

const registerSchema = yup.object({
  firstName: yup
    .string()
    .required('Họ là bắt buộc')
    .min(2, 'Họ phải có ít nhất 2 ký tự'),
  lastName: yup
    .string()
    .required('Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'),
  phone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  address: yup
    .string()
    .required('Địa chỉ là bắt buộc')
    .min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  city: yup
    .string()
    .required('Thành phố là bắt buộc'),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other'], 'Vui lòng chọn giới tính')
    .required('Giới tính là bắt buộc'),
  dateOfBirth: yup
    .string()
    .required('Ngày sinh là bắt buộc')
    .test('age', 'Bạn phải ít nhất 16 tuổi', function(value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 16;
      }
      return age >= 16;
    }),
});

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
};

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { register: registerUser, isLoading, error, clearAuthError, verifyOTPCode, resendOTPCode } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser(data);
      // Sau khi đăng ký thành công, chuyển sang form OTP
      setRegisteredEmail(data.email);
      setShowOTPForm(true);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    try {
      // console.log('Verifying OTP:', otp, 'for email:', registeredEmail);
      await verifyOTPCode({ email: registeredEmail, otp });
      // Sau khi verify thành công, useAuth sẽ tự động redirect đến /profile
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  const handleOTPResend = async () => {
    try {
      // console.log('Resending OTP for email:', registeredEmail);
      await resendOTPCode(registeredEmail);
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  };

  // Nếu đang hiển thị form OTP, render OTPVerificationForm
  if (showOTPForm) {
    return (
      <OTPVerificationForm
        email={registeredEmail}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        isLoading={isLoading}
        error={error || ''}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white shadow-2xl border border-gray-100 rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tạo tài khoản mới
          </h1>
          <p className="text-gray-600">
            Tham gia cùng chúng tôi và khám phá những điều tuyệt vời!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Họ"
              placeholder="Nhập họ của bạn"
              leftIcon={<User className="h-4 w-4" />}
              error={errors.firstName?.message || ''}
              {...register('firstName')}
            />

            <Input
              label="Tên"
              placeholder="Nhập tên của bạn"
              leftIcon={<User className="h-4 w-4" />}
              error={errors.lastName?.message || ''}
              {...register('lastName')}
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="Nhập email của bạn"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message || ''}
            {...register('email')}
          />

          <Input
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            placeholder="Tạo mật khẩu mạnh"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            error={errors.password?.message || ''}
            helperText="Ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
            {...register('password')}
          />

          <Input
            label="Số điện thoại"
            type="tel"
            placeholder="Nhập số điện thoại"
            leftIcon={<Phone className="h-4 w-4" />}
            error={errors.phone?.message || ''}
            {...register('phone')}
          />

          <Input
            label="Địa chỉ"
            placeholder="Nhập địa chỉ của bạn"
            leftIcon={<MapPin className="h-4 w-4" />}
            error={errors.address?.message || ''}
            {...register('address')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Thành phố"
              placeholder="Nhập thành phố"
              leftIcon={<MapPin className="h-4 w-4" />}
              error={errors.city?.message || ''}
              {...register('city')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính <span className="text-red-500">*</span>
              </label>
              <select
                {...register('gender')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <Input
            label="Ngày sinh"
            type="date"
            placeholder="Chọn ngày sinh"
            leftIcon={<Calendar className="h-4 w-4" />}
            error={errors.dateOfBirth?.message || ''}
            {...register('dateOfBirth')}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                {error}
              </p>
            </div>
          )}

          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              Tôi đồng ý với{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                Điều khoản sử dụng
              </a>{' '}
              và{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                Chính sách bảo mật
              </a>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
            disabled={isLoading}
            onClick={clearAuthError}
          >
            {isLoading ? 'Đang tạo...' : 'Tạo tài khoản'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;