'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from 'primereact/button';

const Carousel: React.FC = () => {
  const slideData = {
    id: 1,
    title: 'Khám phá Gift Shop HCMUTE ngay hôm nay!',
    subtitle: '',
    description: 'Nơi lưu giữ những kỷ niệm đẹp của sinh viên HCMUTE. Từ áo thun, móc khóa đến balo, túi xách - tất cả đều mang đậm dấu ấn trường đại học thân yêu!',
    image: '/images/banner-hcmute-final.png',
    buttonText: 'Mua sắm ngay',
    buttonLink: '/products',
    buttonVariant: 'primary' as const,
    gradient: 'from-blue-500/30 via-purple-500/30 to-pink-500/30'
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Banner Container */}
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${slideData.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          {/* Top Banner */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-white rounded-full px-6 py-3 shadow-lg flex items-center space-x-4 mx-auto max-w-2xl">
              {/* Logo */}
              <div className="relative flex-shrink-0">
                <img 
                  src="/images/hcmute-logo.png" 
                  alt="HCMUTE Logo" 
                  className="w-8 h-8 object-contain"
                />
                <div className="absolute -top-1 -right-1 w-1/3 h-1/3 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-2/3 h-2/3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Text */}
              <div className="text-pink-600 font-semibold text-sm flex-1">
                Gift Shop chính thức của HCMUTE - Hơn 1000+ sản phẩm độc đáo
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <div className="text-white">
                  {/* Main Title */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Khám phá <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">Gift Shop HCMUTE</span> ngay hôm nay!
                  </h1>

                  {/* Description */}
                  <p className="text-xl sm:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
                    {slideData.description}
                  </p>

                  {/* CTA Button */}
                  <div>
                    <Link href={slideData.buttonLink}>
                      <Button
                        className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-xl transform transition-all duration-200 hover:scale-105 hover:shadow-2xl"
                        label={slideData.buttonText}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
