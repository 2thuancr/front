'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ForgotPasswordFormData {
  email: string;
}

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
});

interface ForgotPasswordFormProps {}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // TODO: Implement forgot password API call
      console.log('Forgot password:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setSubmitError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="h-10 w-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            Kiểm tra email của bạn
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-6"
          >
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. 
            Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 text-left">
                <p className="font-medium">Lưu ý:</p>
                <ul className="mt-1 space-y-1 text-blue-700">
                  <li>• Kiểm tra cả hộp thư spam</li>
                  <li>• Link có hiệu lực trong 1 giờ</li>
                  <li>• Không chia sẻ link với bất kỳ ai</li>
                </ul>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full px-6 py-3 text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đăng nhập
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center w-full px-6 py-3 text-gray-600 bg-gray-50 hover:bg-gray-100 font-medium rounded-lg transition-colors duration-200"
            >
              Gửi lại email
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4"
          >
            <Mail className="h-8 w-8 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Quên mật khẩu?
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600"
          >
            Đừng lo lắng! Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu 
            đến email của bạn.
          </motion.p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="Nhập email của bạn"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            helperText="Chúng tôi sẽ gửi link đặt lại mật khẩu đến email này"
            {...register('email')}
          />

          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {submitError}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
            loading={isSubmitting}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
          </Button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-800">
              <p className="font-medium">Bạn nhớ mật khẩu?</p>
              <p className="mt-1">
                <Link
                  href="/login"
                  className="text-orange-600 hover:text-orange-700 font-medium underline"
                >
                  Đăng nhập ngay
                </Link>{' '}
                để truy cập tài khoản của bạn.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;

