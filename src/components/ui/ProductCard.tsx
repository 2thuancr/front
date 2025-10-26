'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { LegacyProduct } from '@/types/api';
import { useToastSuccess, useToastError } from './Toast';
import { useUserId } from '@/hooks/useUserId';
import { cartApi } from '@/lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { toggleWishlist, checkInWishlist } from '@/store/wishlistSlice';

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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartId, setCartId] = useState<number | null>(null);
  const userId = useUserId();
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();
  const router = useRouter();
  const fetchingCartRef = useRef(false);
  
  const dispatch = useDispatch<AppDispatch>();
  
  // Check authentication status from Redux
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const authToken = useSelector((state: RootState) => state.auth.token);
  
  const { checkedItems } = useSelector((state: RootState) => state.wishlist);
  // Only show as wishlisted if authenticated AND actually in wishlist
  const isWishlisted = isAuthenticated && (checkedItems[product.id] || false);

  // Kiểm tra trạng thái wishlist khi component mount (chỉ khi đã đăng nhập)
  useEffect(() => {
    if (isAuthenticated && userId && product.id && checkedItems[product.id] === undefined) {
      // console.log("🔍 Checking wishlist status for product:", product.id);
      dispatch(checkInWishlist(product.id));
    }
  }, [dispatch, isAuthenticated, userId, product.id, checkedItems]);

  // Lấy cartId khi userId thay đổi
  useEffect(() => {
    const fetchCart = async () => {
      if (fetchingCartRef.current) return; // Prevent duplicate calls
      
      if (!userId || userId <= 0) {
        // console.log("👤 Guest user - skipping cart fetch");
        setCartId(null);
        return;
      }

      // Check if user is actually authenticated
      if (!isAuthenticated || !authToken) {
        // console.log("🔒 User not authenticated - skipping cart fetch");
        setCartId(null);
        return;
      }

      fetchingCartRef.current = true;

      try {
        // console.log("🛒 Lấy giỏ hàng cho user:", userId);
        const cart = await cartApi.getCartByUser(userId);
        // console.log("✅ Dữ liệu giỏ hàng:", cart);

        if (cart && cart.cartId) {
          setCartId(cart.cartId);
        } else {
          console.warn("⚠️ Cart data is invalid:", cart);
        }
      } catch (error: any) {
        console.warn("⚠️ Cart API not available yet:", error.response?.status);
        
        // Thử tạo giỏ hàng mới nếu không tìm thấy
        if (error.response?.status === 404) {
          // console.log("🛒 Cart not found, attempting to create new cart for user:", userId);
          try {
            const newCart = await cartApi.createCart(userId);
            // console.log("✅ Created new cart:", newCart);
            if (newCart && newCart.cartId) {
              setCartId(newCart.cartId);
            }
          } catch (createError: any) {
            console.error("❌ Failed to create cart:", createError);
          }
        }
      } finally {
        fetchingCartRef.current = false;
      }
    };

    fetchCart();
  }, [userId, isAuthenticated, authToken]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async () => {
    // console.log("🔥 handleAddToCart được gọi từ ProductCard!", { product, onAddToCart });

    // Redirect to login if not authenticated
    if (!userId || userId <= 0 || !isAuthenticated || !authToken) {
      // console.log("🔒 User not authenticated - redirecting to login");
      router.push('/login');
      return;
    }

    setIsAddingToCart(true);
    try {
      if (onAddToCart) {
        // console.log("🔄 Gọi onAddToCart callback");
        await onAddToCart(product.id);
      } else {
        // console.log("🔄 Không có onAddToCart callback, sử dụng logic mặc định");
        // Fallback logic nếu không có callback
        toastSuccess("Thành công!", "Đã thêm sản phẩm vào giỏ hàng");
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi thêm giỏ hàng:", error);
      const errorMessage = error.message || "Thêm giỏ hàng thất bại";
      toastError("Thất bại", errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    // console.log("🔥 handleToggleWishlist được gọi!", { productId: product.id, isWishlisted, userId });

    if (!isAuthenticated) {
      // console.log("❌ User not authenticated for wishlist");
      toastError("Cần đăng nhập", "Vui lòng đăng nhập để sử dụng tính năng yêu thích");
      return;
    }

    if (!userId || userId <= 0) {
      toastError("Cần đăng nhập", "Vui lòng đăng nhập để sử dụng tính năng yêu thích");
      return;
    }

    try {
      if (onToggleWishlist) {
        // console.log("🔄 Gọi onToggleWishlist callback");
        await onToggleWishlist(product.id);
      } else {
        // console.log("🔄 Gọi Redux toggleWishlist");
        const result = await dispatch(toggleWishlist(product.id)).unwrap();
        // console.log("✅ Toggle wishlist result:", result);
        
        if (result.action === 'added') {
          toastSuccess("Thành công!", "Đã thêm sản phẩm vào danh sách yêu thích");
        } else if (result.action === 'removed') {
          toastSuccess("Thành công!", "Đã bỏ sản phẩm khỏi danh sách yêu thích");
        } else if (result.action === 'already_exists') {
          toastSuccess("Thông báo", "Sản phẩm đã có trong danh sách yêu thích");
        }
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi toggle wishlist:", error);
      const errorMessage = error.message || "Thao tác yêu thích thất bại";
      toastError("Thất bại", errorMessage);
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
          <Link href={`/products/${product.slug || product.id}`}>
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
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-start justify-start opacity-0 group-hover:opacity-100">
              <div className="flex flex-col space-y-4 mt-4 ml-4">
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
                  <Link href={`/products/${product.slug || product.id}`}>
                    <button
                      className="w-12 h-12 rounded-full bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all duration-200 border-2 border-white shadow-xl hover:shadow-2xl flex items-center justify-center"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </Link>
                </motion.div>
                
                {/* Wishlist Button - Always show, but only check status when authenticated */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    className={`w-12 h-12 rounded-full transition-all duration-200 border-2 border-white shadow-xl hover:shadow-2xl flex items-center justify-center ${
                      isAuthenticated && isWishlisted 
                        ? 'bg-red-50 hover:bg-red-100 text-red-500' 
                        : 'bg-white hover:bg-red-50 text-gray-700 hover:text-red-500'
                    }`}
                    title={isAuthenticated ? (isWishlisted ? "Bỏ yêu thích" : "Thêm yêu thích") : "Đăng nhập để sử dụng"}
                    onClick={handleToggleWishlist}
                  >
                    <Heart className={`w-5 h-5 ${isAuthenticated && isWishlisted ? 'fill-current' : ''}`} />
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
            <Link href={`/products/${product.slug || product.id}`}>
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
