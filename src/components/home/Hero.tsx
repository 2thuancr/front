'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Users, Zap, Shield, User, LogIn, UserPlus, Gift, ShoppingBag, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from 'primereact/button';
import Logo from '@/components/ui/Logo';

const Hero: React.FC = () => {
  const features = [
    { icon: Gift, text: 'Quà tặng độc đáo', color: 'text-pink-600' },
    { icon: Heart, text: 'Tình yêu HCMUTE', color: 'text-red-600' },
    { icon: Sparkles, text: 'Chất lượng cao', color: 'text-yellow-600' },
  ];

  const quickActions = [
    { name: 'Đăng nhập', href: '/login', icon: LogIn, variant: 'primary' },
    { name: 'Đăng ký', href: '/register', icon: UserPlus, variant: 'secondary' },
    { name: 'Hồ sơ', href: '/profile', icon: User, variant: 'outline' },
  ];

  const popularCategories = [
    { name: 'Áo thun HCMUTE', icon: ShoppingBag, color: 'from-blue-500 to-blue-600' },
    { name: 'Móc khóa', icon: Gift, color: 'from-pink-500 to-pink-600' },
    { name: 'Balo, Túi xách', icon: ShoppingBag, color: 'from-green-500 to-green-600' },
    { name: 'Đồ lưu niệm', icon: Heart, color: 'from-red-500 to-red-600' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-orange-100 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-pink-200 shadow-lg mb-8"
          >
            <Logo size="sm" showText={false} className="mr-3" />
            <span className="text-sm font-medium text-pink-700">
              Gift Shop chính thức của HCMUTE - Hơn 1000+ sản phẩm độc đáo
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Khám phá{' '}
            <span className="bg-gradient-to-r from-pink-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              Gift Shop HCMUTE
            </span>{' '}
            ngay hôm nay!
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Nơi lưu giữ những kỷ niệm đẹp của sinh viên HCMUTE. 
            Từ áo thun, móc khóa đến balo, túi xách - tất cả đều mang đậm dấu ấn trường đại học thân yêu!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link href="/register">
              <Button
                className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-semibold px-8 py-4 rounded-xl shadow-xl transform transition-all duration-200 hover:scale-105 hover:shadow-2xl"
                label="Mua sắm ngay"
                icon={<ArrowRight className="ml-2 h-5 w-5" />}
              />
            </Link>
            
            <button className="inline-flex items-center px-8 py-4 text-gray-700 bg-white hover:bg-gray-50 font-semibold rounded-xl shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl">
              <Play className="mr-2 h-5 w-5 text-pink-600" />
              Xem catalog
            </button>
          </motion.div>

          {/* Popular Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-12"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Danh mục nổi bật</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {popularCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className={`bg-gradient-to-br ${category.color} p-6 rounded-2xl text-white text-center transform transition-all duration-200 group-hover:scale-105 group-hover:shadow-xl`}>
                    <category.icon className="w-8 h-8 mx-auto mb-3" />
                    <h4 className="font-semibold text-sm">{category.name}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mb-12"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Truy cập nhanh</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {quickActions.map((action, index) => (
                <Link key={action.name} href={action.href}>
                  <Button
                    className="flex items-center space-x-2"
                    label={action.name}
                    icon={<action.icon className="w-4 h-4" />}
                    outlined={action.variant === 'outline'}
                  />
                </Link>
              ))}
              
              {/* Test Buttons */}
              <button
                onClick={() => {
                  console.log('🧪 Test redirect to staff dashboard');
                  window.location.href = '/staff/dashboard';
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Test Staff Dashboard
              </button>
              <button
                onClick={() => {
                  console.log('🧪 Test redirect to vendor dashboard');
                  window.location.href = '/vendor/dashboard';
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Test Vendor Dashboard
              </button>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-pink-200 shadow-lg"
              >
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
                <span className="text-sm font-medium text-gray-700">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            {[
              { number: '1000+', label: 'Sản phẩm' },
              { number: '5000+', label: 'Khách hàng' },
              { number: '24/7', label: 'Hỗ trợ' },
              { number: '100%', label: 'Chính hãng' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-pink-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-pink-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
