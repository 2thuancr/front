'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/hooks/useAuth';
import { RegisterCredentials } from '@/types/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Mail, Lock, Eye, EyeOff, User, UserCheck } from 'lucide-react';
import Link from 'next/link';

const registerSchema = yup.object({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  username: yup
    .string()
    .required('Tên đăng nhập là bắt buộc')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .matches(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'),
  confirmPassword: yup
    .string()
    .required('Xác nhận mật khẩu là bắt buộc')
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
  firstName: yup
    .string()
    .required('Họ là bắt buộc')
    .min(2, 'Họ phải có ít nhất 2 ký tự'),
  lastName: yup
    .string()
    .required('Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự'),
});

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading, error, clearAuthError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      await registerUser(data);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Họ"
              placeholder="Nhập họ của bạn"
              leftIcon={<User className="h-4 w-4" />}
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Tên"
              placeholder="Nhập tên của bạn"
              leftIcon={<User className="h-4 w-4" />}
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="Tên đăng nhập"
            placeholder="Chọn tên đăng nhập"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.username?.message}
            helperText="Chỉ được chứa chữ cái, số và dấu gạch dưới"
            {...register('username')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Nhập email của bạn"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
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
            error={errors.password?.message}
            helperText="Ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
            {...register('password')}
          />

          <Input
            label="Xác nhận mật khẩu"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Nhập lại mật khẩu"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
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
            loading={isLoading}
            onClick={clearAuthError}
          >
            Tạo tài khoản
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

