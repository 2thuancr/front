'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { 
  Heart, 
  Eye, 
  ShoppingCart, 
  Star, 
  Tag,
  Clock,
  TrendingUp
} from 'lucide-react';
import { LegacyProduct } from '@/types/product';
import { useToastSuccess, useToastError } from './Toast';
import { useUserId } from '@/hooks/useUserId';

interface ProductCardProps {
  product: LegacyProduct;
  showQuickActions?: boolean;
  showAddToCart?: boolean;
  onAddToCart?: (productId: number) => void;
  onToggleWishlist?: (productId: number) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showQuickActions = true,
  showAddToCart = false, // Changed default to false
  onAddToCart,
  onToggleWishlist,
  className = ''
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const userId = useUserId();
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      toastError("Cần đăng nhập", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    setIsAddingToCart(true);
    try {
      if (onAddToCart) {
        await onAddToCart(product.id);
      } else {
        // Default behavior - you can implement cart API call here
        toastSuccess("Thành công!", "Đã thêm sản phẩm vào giỏ hàng");
      }
    } catch (error) {
      toastError("Thất bại", "Không thể thêm sản phẩm vào giỏ hàng");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = () => {
    if (!userId) {
      toastError("Cần đăng nhập", "Vui lòng đăng nhập để sử dụng tính năng yêu thích");
      return;
    }

    setIsWishlisted(!isWishlisted);
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    } else {
      toastSuccess(
        isWishlisted ? "Đã bỏ yêu thích" : "Đã thêm yêu thích",
        isWishlisted ? "Sản phẩm đã được bỏ khỏi danh sách yêu thích" : "Sản phẩm đã được thêm vào danh sách yêu thích"
      );
    }
  };

  const getDiscountPercentage = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return product.discount || 0;
  };

  const discountPercentage = getDiscountPercentage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`group ${className}`}
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white rounded-2xl flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <Link href={`/products/${product.id}`}>
            <div className="relative w-full h-48 bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                loading="lazy"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>

          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg flex items-center gap-1"
              >
                <Clock className="w-3 h-3" />
                Mới
              </motion.span>
            )}
            {product.isHot && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg flex items-center gap-1"
              >
                <TrendingUp className="w-3 h-3" />
                Hot
              </motion.span>
            )}
          </div>

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 right-3">
              <motion.span
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                -{discountPercentage}%
              </motion.span>
            </div>
          )}

          {/* Quick Actions */}
          {showQuickActions && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex flex-col space-y-4">
                {/* Shopping Cart Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    className="w-12 h-12 rounded-full bg-white hover:bg-green-50 text-gray-700 hover:text-green-600 transition-all duration-200 border-2 border-white shadow-xl hover:shadow-2xl flex items-center justify-center"
                    title="Thêm vào giỏ hàng"
                    onClick={() => handleAddToCart()}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <ShoppingCart className="w-5 h-5" />
                    )}
                  </button>
                </motion.div>
                
                {/* View Details Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={`/products/${product.id}`}>
                    <button
                      className="w-12 h-12 rounded-full bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all duration-200 border-2 border-white shadow-xl hover:shadow-2xl flex items-center justify-center"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </Link>
                </motion.div>
                
                {/* Wishlist Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    className={`w-12 h-12 rounded-full transition-all duration-200 border-2 border-white shadow-xl hover:shadow-2xl flex items-center justify-center ${
                      isWishlisted 
                        ? 'bg-red-50 hover:bg-red-100 text-red-500' 
                        : 'bg-white hover:bg-red-50 text-gray-700 hover:text-red-500'
                    }`}
                    title={isWishlisted ? "Bỏ yêu thích" : "Thêm yêu thích"}
                    onClick={handleToggleWishlist}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-2 flex flex-col flex-1">
          {/* Category */}
          <div className="mb-0.5">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
              {product.category}
            </span>
          </div>

          {/* Product Name - Fixed height */}
          <div className="h-10 mb-0.5">
            <Link href={`/products/${product.id}`}>
              <h3 className="text-sm font-bold text-gray-800 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors duration-200 leading-tight">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1 font-medium">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="mb-0 flex-1 flex flex-col justify-end">
            <div className="flex flex-col">
              {product.originalPrice && product.originalPrice > product.price ? (
                <span className="text-xs text-gray-500 line-through font-medium mb-0.5">
                  {formatPrice(product.originalPrice)}
                </span>
              ) : (
                <div className="h-3 mb-0.5"></div>
              )}
              <span className="text-sm font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          {/* Stock Status */}
          <div className="pt-1">
            {product.stock && product.stock > 0 ? (
              <span className="text-xs text-green-600 font-medium">
                Còn {product.stock} sản phẩm
              </span>
            ) : (
              <span className="text-xs text-red-500 font-medium">
                Hết hàng
              </span>
            )}
          </div>
        </div>

      </Card>
    </motion.div>
  );
};

export default ProductCard;
