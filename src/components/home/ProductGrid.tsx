'use client';

import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  isNew?: boolean;
  isHot?: boolean;
  discount?: number;
}

const ProductGrid: React.FC = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const products: Product[] = [
    {
      id: 1,
      name: 'Áo Thun HCMUTE Premium',
      price: 299000,
      originalPrice: 399000,
      rating: 4.8,
      reviewCount: 127,
      image: '/images/ao-thun-hcmute.jpg',
      category: 'Áo thun',
      isNew: true,
      discount: 25,
    },
    {
      id: 2,
      name: 'Ba Lô HCMUTE Sport',
      price: 599000,
      originalPrice: 699000,
      rating: 4.9,
      reviewCount: 89,
      image: '/images/ba-lo-hcmute.jpg',
      category: 'Ba lô',
      isHot: true,
      discount: 15,
    },
    {
      id: 3,
      name: 'Mũ Nón HCMUTE Classic',
      price: 199000,
      rating: 4.7,
      reviewCount: 56,
      image: '/images/hcmute-logo.png',
      category: 'Mũ nón',
    },
    {
      id: 4,
      name: 'Túi Xách HCMUTE Elegant',
      price: 399000,
      originalPrice: 499000,
      rating: 4.6,
      reviewCount: 34,
      image: '/images/hcmute-logo.png',
      category: 'Túi xách',
      discount: 20,
    },
    {
      id: 5,
      name: 'Hoodie HCMUTE Winter',
      price: 799000,
      rating: 4.9,
      reviewCount: 78,
      image: '/images/hcmute-logo.png',
      category: 'Áo khoác',
      isNew: true,
    },
    {
      id: 6,
      name: 'Ví HCMUTE Leather',
      price: 299000,
      originalPrice: 399000,
      rating: 4.5,
      reviewCount: 23,
      image: '/images/hcmute-logo.png',
      category: 'Phụ kiện',
      discount: 25,
    },
  ];

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá bộ sưu tập sản phẩm độc đáo với thiết kế riêng biệt dành cho sinh viên HCMUTE
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['Tất cả', 'Áo thun', 'Ba lô', 'Mũ nón', 'Túi xách', 'Áo khoác', 'Phụ kiện'].map((category) => (
            <button
              key={category}
              className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden"
              hover
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                      Mới
                    </span>
                  )}
                  {product.isHot && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                      Hot
                    </span>
                  )}
                  {product.discount && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2 rounded-full ${
                      wishlist.includes(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:text-red-500'
                    } shadow-lg hover:scale-110 transition-all duration-200`}
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full bg-white text-gray-600 shadow-lg hover:scale-110 hover:text-blue-500 transition-all duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-2">{product.category}</div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center justify-between mb-3">
                  {renderRating(product.rating)}
                  <span className="text-sm text-gray-500">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant="primary"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Thêm vào giỏ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    Chi tiết
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Xem thêm sản phẩm
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;

