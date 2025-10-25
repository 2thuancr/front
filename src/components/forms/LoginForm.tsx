'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials, UserRole } from '@/types/auth';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import { GoogleLoginButton } from '@/components/ui';

const loginSchema = yup.object({
  username: yup
    .string()
    .required('Tên đăng nhập là bắt buộc'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const { login, googleLogin, isLoading, error, clearAuthError } = useAuth();
  const router = useRouter(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
  });

const onSubmit = async (data: LoginCredentials) => {
  try {
    const result = await login(data);
    
    if (result?.access_token) {
      
      
      // Check role for different user types
      if (result.userType === 'staff' && result.staff) {
      } else if (result.userType === 'admin' && result.admin) {
      } else if (result.userType === 'vendor' && result.vendor) {
      } else if (result.userType === 'customer' && result.user) {
      }
      
      // Redirect based on user type
      let redirectPath = '/';
      if (result.userType === 'admin') {
        redirectPath = '/admin/dashboard';
      } else if (result.userType === 'vendor') {
        redirectPath = '/vendor/dashboard';
      } else if (result.userType === 'staff') {
        redirectPath = '/staff/dashboard';
      } else {
        redirectPath = '/'; // Customer
      }
      
      
      // Fallback redirect in case useAuth redirect fails
      setTimeout(() => {
        if (window.location.pathname === '/login' || window.location.pathname === '/') {
          window.location.href = redirectPath;
        }
      }, 2000);
      
    } else {
      
    }
  } catch (error: any) {
    
    
    // Log more details about the error
    if (error.response) {
      console.error('❌ Login API Error Details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url
      });
    }
  }
};

const handleGoogleSuccess = (result: any) => {
  console.log('✅ Google login successful:', result);
  // The googleLogin function in useAuth already handles redirect
};

const handleGoogleError = (error: any) => {
  console.error('❌ Google login error:', error);
  // You can add toast notification here if needed
};

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đăng nhập
          </h1>
          <p className="text-gray-600">
            Chào mừng bạn quay trở lại! Vui lòng đăng nhập để tiếp tục.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="field">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập / Email
            </label>
            <span className="p-input-icon-left w-full">
              <Mail className="h-4 w-4" />
              <InputText
                id="username"
                type="text"
                placeholder="Nhập email hoặc tên đăng nhập"
                className={`w-full ${errors.username ? 'p-invalid' : ''}`}
                {...register('username')}
              />
            </span>
            {errors.username && (
              <small className="p-error block mt-1">{errors.username.message}</small>
            )}
            <small className="text-gray-500 mt-1 block">
              Khách hàng/Nhân viên: Email | Admin/Nhà cung cấp: Tên đăng nhập
            </small>
          </div>

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
            error={errors.password?.message || ''}
            {...register('password')}
          />

          {error && (
            <Message severity="error" text={error} className="w-full" />
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox inputId="remember" checked={false} onChange={() => {}} />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            type="submit"
            label="Đăng nhập"
            className="w-full"
            loading={isLoading}
            onClick={clearAuthError}
          />
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Hoặc</span>
          </div>
        </div>

        {/* Google Login Button */}
        <GoogleLoginButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          disabled={isLoading}
        />

        <div className="mt-6 text-center space-y-4">
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
      </Card>
    </div>
  );
};

export default LoginForm;

