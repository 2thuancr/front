'use client';
import { authAPI } from '@/lib/api';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Lock, Eye, EyeOff, KeyRound, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { restoreAuth } from '@/store/authSlice';
import type { AppDispatch } from '@/store';

const passwordSchema = yup.object({
  password: yup.string().required('Mật khẩu mới là bắt buộc').min(8, 'Ít nhất 8 ký tự'),
  confirmPassword: yup
    .string()
    .required('Xác nhận mật khẩu là bắt buộc')
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
});

const SetPasswordForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>({ resolver: yupResolver(passwordSchema) });

  useEffect(() => {
    // Check if user has access_token from Google login
    const token = localStorage.getItem('token');
    if (!token) {
      // No token, redirect to login
      router.push('/login');
      return;
    }
    setHasToken(true);
  }, [router]);

  const onSubmit = async (data: { password: string; confirmPassword: string }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      setError(null);
      const response = await authAPI.setPassword({
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      
      // Backend might return updated user data
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userType', response.data.userType || 'customer');
        if (response.data.user.id) {
          localStorage.setItem('userId', JSON.stringify(response.data.user.id));
        }
      }
      
      // Update Redux state with user data from localStorage
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const userType = localStorage.getItem('userType');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          dispatch(restoreAuth({
            user,
            token,
            userType: (userType || 'customer') as 'customer' | 'admin' | 'vendor' | 'staff'
          }));
        } catch (e) {
          console.error('Error restoring auth:', e);
        }
      }
      
      // Show success message
      alert('Đặt mật khẩu thành công!');
      
      // Redirect to home page
      window.location.href = '/';
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  if (!hasToken) {
    return null; // Will redirect
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-2xl border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4"
            >
              <KeyRound className="h-10 w-10 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Đặt mật khẩu mới
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600"
            >
              Vui lòng đặt mật khẩu để tiếp tục sử dụng tài khoản
            </motion.p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Mật khẩu mới với toggle eye */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu mới"
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Xác nhận mật khẩu với toggle eye */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu để xác nhận"
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {error && (
              <Message severity="error" text={error} className="w-full" />
            )}
            
            <Button
              type="submit"
              label="Đặt mật khẩu"
              icon={<ArrowRight className="mr-2 h-4 w-4" />}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
            />
          </form>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Lưu ý:</p>
                <ul className="mt-1 space-y-1 text-blue-700">
                  <li>• Mật khẩu phải có ít nhất 8 ký tự</li>
                  <li>• Bạn có thể dùng mật khẩu này để đăng nhập lần sau</li>
                  <li>• Đảm bảo mật khẩu đủ mạnh và an toàn</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SetPasswordForm;

