'use client';
import { authAPI } from '@/lib/api';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import Input from '@/components/ui/Input';
import { Mail, ArrowLeft, AlertCircle, Lock, KeyRound, Shield, CheckCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const emailSchema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
});
const passwordSchema = yup.object({
  password: yup.string().required('Mật khẩu mới là bắt buộc').min(8, 'Ít nhất 8 ký tự'),
  confirmPassword: yup
    .string()
    .required('Xác nhận mật khẩu là bắt buộc')
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
});

const ForgotPasswordForm: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP input state
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const otpInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Form gửi email
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<{ email: string }>({ resolver: yupResolver(emailSchema) });

  // OTP không cần form validation vì dùng state riêng

  // Form nhập mật khẩu mới
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<{ password: string; confirmPassword: string }>({ resolver: yupResolver(passwordSchema) });

  // Gửi email lấy OTP
  const onSendEmail = async (data: { email: string }) => {
    try {
      setError(null);
      await authAPI.forgotPassword(data.email);
      setEmail(data.email);
      // Reset OTP values for new step
      setOtpValues(['', '', '', '', '', '']);
      setActiveOtpIndex(0);
      // Focus vào ô đầu tiên sau khi chuyển step
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      setStep('otp');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  // Xác thực OTP
  const onVerifyOtp = async () => {
    try {
      setError(null);
      const otpCode = otpValues.join('');
      if (otpCode.length !== 6) {
        setError('Vui lòng nhập đầy đủ 6 số OTP');
        return;
      }
      setToken(otpCode); 
      setStep('reset');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'OTP không đúng hoặc đã hết hạn.');
    }
  };

  // Xử lý OTP input
  const handleOtpChange = (value: string, index: number) => {
    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) return;
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Tự động chuyển sang ô tiếp theo khi nhập số
    if (value && index < 5) {
      setActiveOtpIndex(index + 1);
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      setActiveOtpIndex(index - 1);
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpValues(digits);
      setActiveOtpIndex(5);
      otpInputRefs.current[5]?.focus();
    }
  };

  // Đổi mật khẩu
  const onResetPassword = async (data: { password: string; confirmPassword: string }) => {
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

  const getStepIcon = () => {
    switch (step) {
      case 'email':
        return <Mail className="h-10 w-10 text-white" />;
      case 'otp':
        return <Shield className="h-10 w-10 text-white" />;
      case 'reset':
        return <KeyRound className="h-10 w-10 text-white" />;
      default:
        return <Mail className="h-10 w-10 text-white" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'email':
        return 'Quên mật khẩu';
      case 'otp':
        return 'Xác thực OTP';
      case 'reset':
        return 'Đặt lại mật khẩu';
      default:
        return 'Quên mật khẩu';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'email':
        return 'Nhập email của bạn để nhận mã xác thực';
      case 'otp':
        return 'Nhập mã OTP đã được gửi đến email của bạn';
      case 'reset':
        return 'Nhập mật khẩu mới của bạn';
      default:
        return 'Nhập email của bạn để nhận mã xác thực';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-2xl border border-gray-100">
            {/* Progress Steps */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-4">
                {/* Step 1: Email */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      step === 'email'
                        ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white scale-110'
                        : step === 'otp' || step === 'reset'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step === 'email' ? (
                      <Mail className="h-5 w-5" />
                    ) : step === 'otp' || step === 'reset' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      '1'
                    )}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">Email</span>
                </div>

                {/* Line */}
                <div
                  className={`h-0.5 w-16 transition-all duration-300 ${
                    step === 'otp' || step === 'reset'
                      ? 'bg-gradient-to-r from-green-500 to-blue-600'
                      : 'bg-gray-200'
                  }`}
                />

                {/* Step 2: OTP */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      step === 'otp'
                        ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white scale-110'
                        : step === 'reset'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step === 'otp' ? (
                      <Shield className="h-5 w-5" />
                    ) : step === 'reset' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      '2'
                    )}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">OTP</span>
                </div>

                {/* Line */}
                <div
                  className={`h-0.5 w-16 transition-all duration-300 ${
                    step === 'reset' ? 'bg-gradient-to-r from-green-500 to-blue-600' : 'bg-gray-200'
                  }`}
                />

                {/* Step 3: Reset */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      step === 'reset'
                        ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white scale-110'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step === 'reset' ? <KeyRound className="h-5 w-5" /> : '3'}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">Đổi MK</span>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4"
              >
                {getStepIcon()}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                {getStepTitle()}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600"
              >
                {getStepDescription()}
              </motion.p>
            </div>

            {/* Form Content */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (step === 'email') {
                  handleSubmitEmail(onSendEmail)(e);
                } else if (step === 'otp') {
                  onVerifyOtp();
                } else {
                  handleSubmitPassword(onResetPassword)(e);
                }
              }}
              className="space-y-6"
            >
              <AnimatePresence mode="wait">
                {step === 'email' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Nhập email của bạn"
                      leftIcon={<Mail className="h-4 w-4" />}
                      error={emailErrors.email?.message || ''}
                      {...registerEmail('email')}
                    />
                    {error && (
                      <Message severity="error" text={error} className="w-full" />
                    )}
                    <Button
                      type="submit"
                      label="Gửi OTP về email"
                      icon={<ArrowRight className="mr-2 h-4 w-4" />}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                    />
                  </motion.div>
                )}

                {step === 'otp' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* 6 OTP Input Boxes */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 text-center">
                        Nhập mã OTP 6 số
                      </label>
                      
                      <div className="flex justify-center gap-3">
                        {otpValues.map((value, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            <input
                              ref={(el) => {
                                otpInputRefs.current[index] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={value}
                              onChange={(e) => handleOtpChange(e.target.value, index)}
                              onKeyDown={(e) => handleOtpKeyDown(e, index)}
                              onPaste={handleOtpPaste}
                              onFocus={() => setActiveOtpIndex(index)}
                              className={`
                                w-12 h-12 text-center text-xl font-semibold rounded-lg border-2
                                transition-all duration-200 focus:outline-none
                                ${activeOtpIndex === index
                                  ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                                  : value
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-300 hover:border-gray-400 bg-white'
                                }
                              `}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <Message severity="error" text={error} className="w-full" />
                    )}
                    
                    <Button
                      type="submit"
                      label="Xác thực OTP"
                      icon={<ArrowRight className="mr-2 h-4 w-4" />}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                      disabled={otpValues.join('').length !== 6}
                    />
                  </motion.div>
                )}

                {step === 'reset' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
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
                            passwordErrors.password
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300'
                          }`}
                          {...registerPassword('password')}
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
                      {passwordErrors.password && (
                        <p className="text-sm text-red-600 mt-1">{passwordErrors.password.message}</p>
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
                            passwordErrors.confirmPassword
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300'
                          }`}
                          {...registerPassword('confirmPassword')}
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
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    {error && (
                      <Message severity="error" text={error} className="w-full" />
                    )}
                    <Button
                      type="submit"
                      label="Đổi mật khẩu"
                      icon={<ArrowRight className="mr-2 h-4 w-4" />}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Back to Login Link */}
            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Link>
            </div>

            {/* Info Box */}
            {step === 'email' && (
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
                      <li>• Mã OTP sẽ được gửi đến email của bạn</li>
                      <li>• Mã có hiệu lực trong 5 phút</li>
                      <li>• Kiểm tra cả hộp thư spam nếu không nhận được</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ForgotPasswordForm;