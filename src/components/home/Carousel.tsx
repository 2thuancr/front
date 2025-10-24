'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from 'primereact/button';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'primary' | 'secondary';
  gradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Khám phá Gift Shop HCMUTE ngay hôm nay!',
    subtitle: '',
    description: 'Nơi lưu giữ những kỷ niệm đẹp của sinh viên HCMUTE. Từ áo thun, móc khóa đến balo, túi xách - tất cả đều mang đậm dấu ấn trường đại học thân yêu!',
    image: '/images/banner-hcmute-final.png',
    buttonText: 'Mua sắm ngay',
    buttonLink: '/products',
    buttonVariant: 'primary',
    gradient: 'from-blue-500/30 via-purple-500/30 to-pink-500/30'
  },
  // {
  //   id: 2,
  //   title: 'MỞ BÁN SẢN PHẨM LOGO HCMUTE',
  //   subtitle: 'Trung tâm dịch vụ sinh viên',
  //   description: 'Khám phá các sản phẩm độc đáo với logo HCMUTE, giao hàng tận nhà và nhiều ưu đãi hấp dẫn.',
  //   image: '/images/giftshop_banner.jpg',
  //   buttonText: 'Mua ngay',
  //   buttonLink: '/products',
  //   buttonVariant: 'primary',
  //   gradient: 'from-blue-600 via-purple-600 to-pink-600'
  // },
  // {
  //   id: 3,
  //   title: 'Chào đón Fanpage',
  //   subtitle: 'Nhận quà liền tay',
  //   description: 'Like & Share Page, Tag bạn bè và CMT số may mắn để nhận những phần quà hấp dẫn từ Gift Shop UTE.',
  //   image: '/images/giftshop_ute.jpg',
  //   buttonText: 'Tham gia ngay',
  //   buttonLink: '/products',
  //   buttonVariant: 'primary',
  //   gradient: 'from-green-600 via-teal-600 to-blue-600'
  // },
  // {
  //   id: 4,
  //   title: 'Gift Shop UTE',
  //   subtitle: 'Sản phẩm đa dạng',
  //   description: 'Từ đồng xu, cặp sách đến gấu bông và cốc - tất cả đều mang đậm dấu ấn trường đại học thân yêu.',
  //   image: '/images/giftshop_ute2.jpg',
  //   buttonText: 'Khám phá',
  //   buttonLink: '/products',
  //   buttonVariant: 'secondary',
  //   gradient: 'from-yellow-600 via-orange-600 to-red-600'
  // }
];

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  
  // Get current slide data with proper type safety
  const currentSlideData = useMemo((): Slide => {
    // Using non-null assertion since we know slides array is not empty
    return slides[currentSlide]!;
  }, [currentSlide]);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${slides[currentSlide]?.image || ''})`,
                backgroundSize: 'cover',
                backgroundPosition: currentSlide === 0 ? 'center' : 'center top'
              }}
            >
              {/* No gradient overlay to show original images clearly */}
            </div>

            {/* Top Banner - Only for first slide */}
            {currentSlide === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20"
              >
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
              </motion.div>
            )}

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-white"
                  >

                    {/* Main Title - Only for banner 1 and 4 */}
                    {(currentSlide === 0 || currentSlide === 3) && (
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        {currentSlide === 0 ? (
                          <>
                            Khám phá <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">Gift Shop HCMUTE</span> ngay hôm nay!
                          </>
                        ) : (
                          <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">{currentSlideData.title}</span>
                        )}
                      </h1>
                    )}

                    {/* Description - Only for banner 1 and 4 */}
                    {(currentSlide === 0 || currentSlide === 3) && (
                      <p className="text-xl sm:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
                        {currentSlide === 0 ? (
                          currentSlideData.description
                        ) : (
                          currentSlideData.description
                        )}
                      </p>
                    )}

                    {/* CTA Button */}
                    <div className={`${(currentSlide === 1 || currentSlide === 2) ? 'mt-24' : ''}`}>
                      <Link href={currentSlideData.buttonLink}>
                        <Button
                          className={`${
                            currentSlide === 0 
                              ? currentSlideData.buttonVariant === 'primary'
                                ? 'bg-white text-gray-900 hover:bg-gray-100'
                                : 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900'
                              : currentSlideData.buttonVariant === 'primary'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                                : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-2 border-gray-800 hover:from-gray-700 hover:to-gray-800'
                          } font-semibold px-8 py-4 rounded-xl shadow-xl transform transition-all duration-200 hover:scale-105 hover:shadow-2xl`}
                          label={currentSlideData.buttonText}
                        />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          {/* Dots Indicator */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </section>
  );
};

export default Carousel;
