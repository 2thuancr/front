'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { productStatsApi, productAPI } from '@/lib/api';
import { Eye, Clock, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductView {
  viewId: number;
  userId: number;
  productId: number;
  viewedAt: string;
  product?: {
    productId: number;
    categoryId: number;
    productName: string;
    slug?: string; // URL-friendly slug
    description?: string;
    price: string;
    discountPercent?: string;
    stockQuantity: number;
    createdAt: string;
    updatedAt: string;
    category?: {
      categoryName: string;
    };
    images?: Array<{
      imageId: number;
      imageUrl: string;
      isPrimary: boolean | number;
    }>;
  };
}

interface ViewedProductsResponse {
  views: ProductView[];
  total: number;
  page: string;
  limit: string;
}

const ViewedProductsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [viewedProducts, setViewedProducts] = useState<ProductView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchViewedProducts = async () => {
      // Get userId from user object or localStorage
      let userId = (user as any)?.id;
      
      if (!userId && typeof window !== 'undefined') {
        // Try to get from localStorage userId
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          userId = JSON.parse(storedUserId);
        } else {
          // Try to get from user object in localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser.id;
          }
        }
      }
      
      if (!isAuthenticated || !userId) {
        // console.log('⚠️ No user ID found:', { isAuthenticated, userId, user });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // console.log('🔍 Fetching viewed products for user ID:', userId);
        const response: ViewedProductsResponse = await productStatsApi.getUserViewHistory(userId, currentPage, limit);
        
        // Fetch detailed product info including images for each product
        const viewsWithImages = await Promise.all(
          (response.views || []).map(async (view: ProductView) => {
            try {
              // console.log(`🔍 Fetching detailed info for product ${view.productId}`);
              const productDetail = await productAPI.getProductById(view.productId);
              const detailedProduct = productDetail.data?.product || productDetail.data;
              
              return {
                ...view,
                product: {
                  ...view.product,
                  ...detailedProduct, // Merge detailed product info including images
                }
              };
            } catch (error) {
              console.error(`❌ Failed to fetch product ${view.productId}:`, error);
              return view; // Return original view if fetch fails
            }
          })
        );
        
        // console.log('✅ Views with images:', viewsWithImages);
        
        setViewedProducts(viewsWithImages);
        setTotalItems(response.total || 0);
        setTotalPages(Math.ceil((response.total || 0) / limit));
      } catch (err: any) {
        console.error('Error fetching viewed products:', err);
        setError(err.message || 'Failed to load viewed products');
      } finally {
        setLoading(false);
      }
    };

    fetchViewedProducts();
  }, [isAuthenticated, user, currentPage, limit]);

  const formatPrice = (price: string): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number(price));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Vừa xem';
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  };

  const getProductImage = (product: any): string => {
    // console.log('🖼️ getProductImage called with:', product);
    
    if (!product) {
      // console.log('❌ No product provided');
      return '/images/placeholder.svg';
    }
    
    // Check if product has images array
    if (!product.images || !Array.isArray(product.images)) {
      // console.log('❌ No images array found in product:', product);
      
      // Fallback: Use default images based on product name or category
      const productName = product.productName?.toLowerCase() || '';
      if (productName.includes('iphone')) {
        return '/images/ao-thun-hcmute.jpg'; // iPhone placeholder
      } else if (productName.includes('samsung')) {
        return '/images/ba-lo-hcmute.jpg'; // Samsung placeholder
      } else if (productName.includes('macbook')) {
        return '/images/hcmute-logo.png'; // MacBook placeholder
      } else if (productName.includes('ipad')) {
        return '/images/ao-thun-hcmute.jpg'; // iPad placeholder
      } else if (productName.includes('tv') || productName.includes('qled')) {
        return '/images/ba-lo-hcmute.jpg'; // TV placeholder
      } else if (productName.includes('charger') || productName.includes('magsafe')) {
        return '/images/hcmute-logo.png'; // Charger placeholder
      } else if (productName.includes('sony') || productName.includes('headphone')) {
        return '/images/ao-thun-hcmute.jpg'; // Headphone placeholder
      }
      
      return '/images/placeholder.svg';
    }
    
    // console.log('✅ Images array found:', product.images);
    
    // Handle both boolean and number types for isPrimary
    const primaryImage = product.images.find((img: any) => 
      Boolean(img.isPrimary) || img.isPrimary === 1
    );
    
    // console.log('🔍 Primary image found:', primaryImage);
    
    const imageUrl = primaryImage?.imageUrl || product.images[0]?.imageUrl;
    
    // console.log('🖼️ Final image URL:', imageUrl);
    
    if (!imageUrl) {
      // console.log('❌ No image URL found, using placeholder');
      return '/images/placeholder.svg';
    }
    
    return imageUrl;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Eye className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Vui lòng đăng nhập
            </h2>
            <p className="mt-2 text-gray-600">
              Bạn cần đăng nhập để xem lịch sử sản phẩm đã xem
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
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Eye className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Chưa có sản phẩm nào được xem
            </h2>
            <p className="mt-2 text-gray-600">
              Hãy khám phá các sản phẩm để xem lịch sử tại đây
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
            Sản phẩm đã xem
          </h1>
          <p className="mt-2 text-gray-600">
            {totalItems} sản phẩm trong lịch sử xem của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {viewedProducts.map((item) => (
            <div key={item.viewId} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <Link href={`/products/${item.product?.slug || item.productId}`}>
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <Image
                    src={getProductImage(item.product)}
                    alt={item.product?.productName || 'Product'}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {formatDate(item.viewedAt)}
                  </div>
                </div>
              </Link>
              
              <div className="p-4">
                <Link href={`/products/${item.product?.slug || item.productId}`}>
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
                  <Link
                    href={`/products/${item.product?.slug || item.productId}`}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Xem lại</span>
                  </Link>
                  
                  <button className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium">
                    <Heart className="w-4 h-4" />
                    <span>Yêu thích</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'text-white bg-blue-600 border border-blue-600'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewedProductsPage;
