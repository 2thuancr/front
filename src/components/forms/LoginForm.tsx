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
  const { login, isLoading, error, clearAuthError } = useAuth();
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
    if (result?.user?.id) {
      console.log("✅ Đăng nhập thành công, userId:", result.user.id);
      console.log("🔍 User role:", result.user.role);
      
      // Redirect to home for all users
      console.log("👤 User logged in, redirecting to home");
      router.push('/');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
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
              Tên đăng nhập
            </label>
            <span className="p-input-icon-left w-full">
              <Mail className="h-4 w-4" />
              <InputText
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập của bạn"
                className={`w-full ${errors.username ? 'p-invalid' : ''}`}
                {...register('username')}
              />
            </span>
            {errors.username && (
              <small className="p-error block mt-1">{errors.username.message}</small>
            )}
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
      </Card>
    </div>
  );
};

export default LoginForm;

