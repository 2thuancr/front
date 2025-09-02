'use client';
import { authAPI } from '@/lib/api';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Mail, ArrowLeft, AlertCircle, Lock } from 'lucide-react';
import Link from 'next/link';

const emailSchema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
});
const otpSchema = yup.object({
  otp: yup.string().required('OTP là bắt buộc'),
});
const passwordSchema = yup.object({
  password: yup.string().required('Mật khẩu mới là bắt buộc').min(8, 'Ít nhất 8 ký tự'),
});

const ForgotPasswordForm: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Form gửi email
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<{ email: string }>({ resolver: yupResolver(emailSchema) });

  // Form nhập OTP
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm<{ otp: string }>({ resolver: yupResolver(otpSchema) });

  // Form nhập mật khẩu mới
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<{ password: string }>({ resolver: yupResolver(passwordSchema) });

  // Gửi email lấy OTP
  const onSendEmail = async (data: { email: string }) => {
    try {
      setError(null);
      await authAPI.forgotPassword(data.email);
      setEmail(data.email);
      setStep('otp');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  // Xác thực OTP
  const onVerifyOtp = async (data: { otp: string }) => {
    try {
      setError(null);
      setToken(data.otp); 
      setStep('reset');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'OTP không đúng hoặc đã hết hạn.');
    }
  };

  // Đổi mật khẩu
  const onResetPassword = async (data: { password: string }) => {
    try {
      setError(null);
      await authAPI.resetPassword({
        email,
        otp: token,
        newPassword: data.password,
      });
      alert('Đổi mật khẩu thành công!');
      setStep('email');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {step === 'email' && (
        <form onSubmit={handleSubmitEmail(onSendEmail)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="Nhập email của bạn"
            leftIcon={<Mail className="h-4 w-4" />}
            error={emailErrors.email?.message || ''}
            {...registerEmail('email')}
          />
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-2">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            </div>
          )}
          <Button type="submit">Gửi OTP về email</Button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleSubmitOtp(onVerifyOtp)} className="space-y-6">
          <Input
            label="OTP"
            type="text"
            placeholder="Nhập mã OTP vừa nhận"
            error={otpErrors.otp?.message || ''}
            {...registerOtp('otp')}
          />
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-2">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            </div>
          )}
          <Button type="submit">Xác thực OTP</Button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleSubmitPassword(onResetPassword)} className="space-y-6">
          <Input
            label="Mật khẩu mới"
            type="password"
            placeholder="Nhập mật khẩu mới"
            leftIcon={<Lock className="h-4 w-4" />}
            error={passwordErrors.password?.message || ''}
            {...registerPassword('password')}
          />
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-2">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            </div>
          )}
          <Button type="submit">Đổi mật khẩu</Button>
        </form>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;