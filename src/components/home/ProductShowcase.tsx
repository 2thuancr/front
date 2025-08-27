'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  features: string[];
}

const products: Product[] = [
  {
    id: 1,
    name: "Áo Thun HCMUTE Gift Shop",
    description: "Áo thun chất liệu cotton cao cấp với logo HCMUTE độc đáo. Thiết kế thời trang, phù hợp mọi lứa tuổi. Món quà ý nghĩa cho sinh viên, giảng viên và cựu sinh viên HCMUTE.",
    price: 299000,
    image: "/images/ao-thun-hcmute.jpg",
    category: "Áo thun",
    rating: 4.8,
    reviews: 156,
    features: ["100% Cotton", "Logo HCMUTE độc đáo", "Nhiều size", "In bền màu"]
  },
  {
    id: 2,
    name: "Ba Lô HCMUTE Premium",
    description: "Ba lô cao cấp với thiết kế hiện đại, logo HCMUTE nổi bật. Chất liệu chống thấm nước, nhiều ngăn tiện lợi. Phù hợp cho sinh viên, dân văn phòng và du lịch.",
    price: 599000,
    image: "/images/ba-lo-hcmute.jpg",
    category: "Ba lô",
    rating: 4.9,
    reviews: 89,
    features: ["Chống thấm nước", "Nhiều ngăn", "Logo HCMUTE", "Đai đeo thoải mái"]
  },
  {
    id: 3,
    name: "Mũ Nón HCMUTE",
    description: "Mũ nón thời trang với logo HCMUTE độc đáo. Chất liệu vải cao cấp, thấm hút mồ hôi tốt. Thiết kế unisex, phù hợp mọi giới tính và độ tuổi.",
    price: 199000,
    image: "/images/mu-non-hcmute.jpg",
    category: "Mũ nón",
    rating: 4.7,
    reviews: 203,
    features: ["Thấm hút mồ hôi", "Logo HCMUTE", "Nhiều màu sắc", "Size điều chỉnh"]
  },
  {
    id: 4,
    name: "Túi Xách HCMUTE",
    description: "Túi xách thời trang với logo HCMUTE nổi bật. Chất liệu da tổng hợp cao cấp, thiết kế đa năng. Phù hợp cho sinh viên, dân văn phòng và các dịp đặc biệt.",
    price: 399000,
    image: "/images/tui-xach-hcmute.jpg",
    category: "Túi xách",
    rating: 4.6,
    reviews: 67,
    features: ["Chất liệu cao cấp", "Logo HCMUTE", "Nhiều ngăn", "Dây đeo điều chỉnh"]
  }
];

const ProductShowcase: React.FC = () => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sản Phẩm Nổi Bật
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá bộ sưu tập độc đáo với logo HCMUTE, mang đậm dấu ấn của trường đại học
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="space-y-24">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex items-center gap-12 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Product Image */}
              <div className="flex-1 flex justify-center">
                <div className="relative group">
                  <div className="w-80 h-80 bg-gray-200 rounded-3xl overflow-hidden shadow-lg">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-3xl"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-3">
                    {product.category}
                  </span>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    {product.name}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Tính năng nổi bật:</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rating & Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-gray-600">({product.reviews} đánh giá)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ
                  </button>
                  <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200">
                    Chi tiết
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Products Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            Xem Tất Cả Sản Phẩm
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;
