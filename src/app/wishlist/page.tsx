'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchWishlist, removeFromWishlist } from '@/store/wishlistSlice';
import { useAuth } from '@/hooks/useAuth';
import { WishlistItem } from '@/types/api';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const WishlistPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useAuth();
  const { items: wishlistItems, loading, error, checkedItems } = useSelector((state: RootState) => state.wishlist);
  const [lastCheckedItems, setLastCheckedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated, user]);

  // Refresh wishlist when checkedItems change (from other pages)
  useEffect(() => {
    if (isAuthenticated && user && Object.keys(checkedItems).length > 0) {
      // Only refresh if we're on the wishlist page and there are changes
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated, user, checkedItems]);

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const formatPrice = (price: string): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number(price));
  };

  const getProductImage = (product: any): string => {
    // Check if product exists and has images
    if (!product || !product.images || !Array.isArray(product.images)) {
      return '/images/placeholder.svg';
    }
    
    const primaryImage = product.images.find((img: any) => img.isPrimary);
    const imageUrl = primaryImage?.imageUrl || product.images[0]?.imageUrl;
    
    // Fallback to placeholder if no image
    if (!imageUrl) {
      return '/images/placeholder.svg';
    }
    
    return imageUrl;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Vui lòng đăng nhập
            </h2>
            <p className="mt-2 text-gray-600">
              Bạn cần đăng nhập để xem danh sách sản phẩm yêu thích
            </p>
            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm">
                  <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium mb-4">
              Lỗi: {error}
            </div>
            <button
              onClick={() => dispatch(fetchWishlist())}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Danh sách yêu thích trống
            </h2>
            <p className="mt-2 text-gray-600">
              Bạn chưa có sản phẩm nào trong danh sách yêu thích
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Khám phá sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Danh sách yêu thích
          </h1>
          <p className="mt-2 text-gray-600">
            {wishlistItems.length} sản phẩm trong danh sách yêu thích của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item: WishlistItem) => {
            // Debug logging
            console.log('Wishlist item:', item);
            console.log('Product:', item.product);
            console.log('Product images:', item.product?.images);
            
            return (
              <div key={item.wishlistId} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <Link href={`/products/${item.productId}`}>
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={getProductImage(item.product)}
                      alt={item.product?.productName || 'Product'}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 hover:text-blue-600">
                      {item.product?.productName || 'Unknown Product'}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-bold text-blue-600">
                      {item.product?.price ? formatPrice(item.product.price) : 'N/A'}
                    </div>
                    {item.product?.discountPercent && Number(item.product.discountPercent) > 0 && (
                      <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                        -{item.product.discountPercent}%
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    {item.product?.category?.categoryName || 'Uncategorized'}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                      <span>Xóa</span>
                    </button>
                    
                    <Link
                      href={`/products/${item.productId}`}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Xem</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;