'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearAuthError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đăng nhập
          </h1>
          <p className="text-gray-600">
            Chào mừng bạn quay trở lại! Vui lòng đăng nhập để tiếp tục.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            placeholder="Nhập mật khẩu của bạn"
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
            {...register('password')}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">
                Ghi nhớ đăng nhập
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            onClick={clearAuthError}
          >
            Đăng nhập
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

