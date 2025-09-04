'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { CheckCircle, Clock, RefreshCw, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OTPFormData {
  otp: string[];
}

const otpSchema = yup.object({
  otp: yup.array().of(
    yup.string().required('OTP là bắt buộc')
  ).length(6, 'OTP phải có 6 số').required('OTP là bắt buộc'),
});

interface OTPVerificationFormProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({
  email,
  onVerify,
  onResend,
  isLoading = false,
  error,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OTPFormData>({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      otp: new Array(6).fill(''),
    },
  });

  const watchedOtp = watch('otp');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Update form value
    setValue('otp', newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await onResend();
      setCountdown(30);
      setCanResend(false);
    } catch (error) {
      console.error('Resend error:', error);
    }
  };

  const onSubmit = async (data: OTPFormData) => {
    const otpString = data.otp.join('');
    if (otpString.length === 6) {
      await onVerify(otpString);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-2xl border border-gray-100">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4"
            >
              <Shield className="h-10 w-10 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Xác thực OTP
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600"
            >
              Chúng tôi đã gửi mã xác thực 6 số đến
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-blue-600 font-medium"
            >
              {email}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 text-center">
                Nhập mã OTP
              </label>
              
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <input
                      ref={(el) => {
                                      inputRefs.current[index] = el;
                                    }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={() => setActiveIndex(index)}
                      className={`
                        w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg
                        transition-all duration-200 focus:outline-none
                        ${activeIndex === index
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : digit
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                    />
                  </motion.div>
                ))}
              </div>
              
              {errors.otp && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-red-600 text-center"
                >
                  {errors.otp.message}
                </motion.p>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Message severity="error" text={error} className="w-full" />
              </motion.div>
            )}

            <Button
              type="submit"
              label="Xác thực OTP"
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
              loading={isLoading}
              disabled={otp.join('').length !== 6}
            />
          </form>

          <div className="mt-6 text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {canResend ? 'Có thể gửi lại' : `Gửi lại sau ${formatTime(countdown)}`}
              </span>
            </div>
            
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isLoading}
              className={`
                flex items-center space-x-2 mx-auto text-sm font-medium
                ${canResend
                  ? 'text-blue-600 hover:text-blue-500'
                  : 'text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <RefreshCw className={`h-4 w-4 ${canResend && !isLoading ? 'animate-spin' : ''}`} />
              <span>Gửi lại mã</span>
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Lưu ý:</p>
                <ul className="mt-1 space-y-1 text-blue-700">
                  <li>• Mã OTP có hiệu lực trong 5 phút</li>
                  <li>• Kiểm tra cả hộp thư spam nếu không nhận được</li>
                  <li>• Không chia sẻ mã OTP với bất kỳ ai</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default OTPVerificationForm;

